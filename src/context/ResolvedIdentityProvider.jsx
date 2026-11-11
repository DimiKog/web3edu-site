import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "./useIdentity.js";
import { ResolvedIdentityContext } from "./resolvedIdentityContext.js";
import { useResolvedIdentity } from "../hooks/useResolvedIdentity.js";
import { useWalletAuthSession } from "../hooks/useWalletAuthSession.js";
import { useWalletEntryCanonicalResolve } from "../hooks/useWalletEntryCanonicalResolve.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { buildResolveOwner, buildWeb3SbtResolveUrl } from "../lib/web3eduBackend.js";
import { useSocialIdentity } from "./SocialIdentityContext.jsx";
import {
  getSocialIdentityAaAddress,
  getSocialIdentityOwnerAddress,
} from "../utils/socialIdentityPayload.js";
import { isWalletMintedIdentityRecord } from "../utils/identityReadiness.js";
import { readConnectedEoaAddress } from "../utils/aaIdentity.js";
import { isNeutralAfterLogout, VIEWER_MODE_EVENT } from "../utils/viewerMode.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  WALLET_ENTRY_IDLE,
  WALLET_ENTRY_WALLET_ONLY,
  selectCanonicalViewerIdentity,
} from "../utils/walletEntryCanonicalResolve.js";
import {
  WALLET_AUTH_REASON,
  resolveConnectedWalletChainId,
} from "../utils/walletAuthFlow.js";
import {
  getWalletAuthProgressUiState,
  isWalletOnlyResolveAuthEligible,
  selectResolveBearer,
} from "../utils/resolveBearerSelection.js";

/**
 * Single app-wide canonical viewer identity.
 *
 * Wallet-entry (no OIDC): resolve the connected EOA via
 * GET /web3edu/identity/resolve/<EOA> before using a device-local AA.
 *
 * WA-01c2: wallet-only EOA may attach an in-memory w3wa1_ Bearer for private
 * resolve (Policy B). Keycloak idToken still wins when OIDC is authenticated.
 */
export function ResolvedIdentityProvider({ children }) {
  const { smartAccount, owner, identityHydrated, identity } = useIdentity();
  const { address, isConnected, chainId: accountChainId } = useAccount();
  // WA-01e2.1: connected wallet chain (not wagmi config useChainId) gates wallet Bearer.
  const chainId = useMemo(
    () =>
      resolveConnectedWalletChainId({
        accountChainId: accountChainId ?? null,
      }),
    [accountChainId]
  );
  const { socialIdentity, isOidcAuthenticated, oidcAuthLoading, idToken } = useSocialIdentity();
  const [, setViewerModeEpoch] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onMode = () => setViewerModeEpoch((n) => n + 1);
    window.addEventListener(VIEWER_MODE_EVENT, onMode);
    return () => window.removeEventListener(VIEWER_MODE_EVENT, onMode);
  }, []);

  const socialAaAddress = useMemo(
    () => normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity)),
    [socialIdentity]
  );

  const connectedEoa = useMemo(() => {
    if (!isConnected) return null;
    return normalizeEvmAddress(address);
  }, [isConnected, address]);

  const walletEntryEnabled = Boolean(
    !isOidcAuthenticated && !oidcAuthLoading && connectedEoa
  );

  const walletEntry = useWalletEntryCanonicalResolve({
    enabled: walletEntryEnabled,
    connectedEoa: walletEntryEnabled ? connectedEoa : null,
  });

  const deviceAaReady = Boolean(
    identityHydrated &&
      isWalletMintedIdentityRecord(identity) &&
      normalizeEvmAddress(smartAccount)
  );
  const neutralAfterLogout = isNeutralAfterLogout();

  const viewer = useMemo(
    () =>
      selectCanonicalViewerIdentity({
        isOidcAuthenticated,
        socialAaAddress,
        connectedEoa,
        deviceAa: smartAccount,
        deviceAaReady,
        isNeutralAfterLogout: neutralAfterLogout,
        walletEntryActive: walletEntryEnabled,
        walletEntryStatus: walletEntryEnabled
          ? walletEntry.status
          : WALLET_ENTRY_IDLE,
        walletEntryProgressAddress: walletEntry.canonicalProgressAddress,
        walletEntryResolveOwner: walletEntry.ownerAddress,
        walletEntryMatchedBy: walletEntry.matchedBy,
        walletEntryMode: walletEntry.mode,
        walletEntryLinkedWalletAddress: walletEntry.linkedWalletAddress,
      }),
    [
      isOidcAuthenticated,
      socialAaAddress,
      connectedEoa,
      smartAccount,
      deviceAaReady,
      neutralAfterLogout,
      walletEntryEnabled,
      walletEntry.status,
      walletEntry.canonicalProgressAddress,
      walletEntry.ownerAddress,
      walletEntry.matchedBy,
      walletEntry.mode,
      walletEntry.linkedWalletAddress,
    ]
  );

  const identityAddress = viewer.identityAddress;
  const walletEntryResolvePending = Boolean(viewer.pending);
  const isWalletEntryLinkedAlias = Boolean(viewer.isLinkedWalletAlias);

  const walletOnlyModeEstablished = Boolean(
    viewer.source === VIEWER_SOURCE_CONNECTED_EOA &&
      (walletEntry.mode === "wallet_only" ||
        walletEntry.status === WALLET_ENTRY_WALLET_ONLY)
  );

  const walletAuth = useWalletAuthSession({
    isOidcAuthenticated,
    viewerSource: viewer.source,
    walletEntryStatus: walletEntry.status,
    walletEntryMode: walletEntry.mode,
    walletOnlyModeEstablished,
  });

  /**
   * `?owner=` for /web3sbt/resolve only when backend supplies an owner for the social AA.
   * Never fall back to persisted `identity.owner` here — it can be a stale wallet from a
   * prior session and causes the wrong user's XP/profile to load for the social SC path.
   */
  const resolveOwner = useMemo(() => {
    if (!identityHydrated && !isWalletEntryLinkedAlias) return null;
    if (isWalletEntryLinkedAlias) {
      return viewer.resolveOwner ?? connectedEoa ?? null;
    }
    const socialOwner = normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity));
    if (socialAaAddress) {
      return socialOwner ?? null;
    }
    const sessionOwner = normalizeEvmAddress(readConnectedEoaAddress());
    return sessionOwner ?? buildResolveOwner(address, owner) ?? socialOwner ?? null;
  }, [
    identityHydrated,
    address,
    owner,
    socialIdentity,
    socialAaAddress,
    isWalletEntryLinkedAlias,
    viewer.resolveOwner,
    connectedEoa,
  ]);

  const resolveBearer = useMemo(
    () =>
      selectResolveBearer({
        isOidcAuthenticated,
        idToken,
        walletSession: walletAuth.session,
        viewerSource: viewer.source,
        walletEntryStatus: walletEntry.status,
        walletEntryMode: walletEntry.mode,
        identityAddress,
        connectedEoa,
        chainId,
        frontendEnabled: walletAuth.isFrontendEnabled,
      }),
    [
      isOidcAuthenticated,
      idToken,
      walletAuth.session,
      walletAuth.isFrontendEnabled,
      viewer.source,
      walletEntry.status,
      walletEntry.mode,
      identityAddress,
      connectedEoa,
      chainId,
    ]
  );

  const walletOnlyAuthEligible = useMemo(
    () =>
      isWalletOnlyResolveAuthEligible({
        isOidcAuthenticated,
        viewerSource: viewer.source,
        walletEntryStatus: walletEntry.status,
        walletEntryMode: walletEntry.mode,
        identityAddress,
        connectedEoa,
        chainId,
        frontendEnabled: walletAuth.isFrontendEnabled,
      }),
    [
      isOidcAuthenticated,
      viewer.source,
      walletEntry.status,
      walletEntry.mode,
      identityAddress,
      connectedEoa,
      chainId,
      walletAuth.isFrontendEnabled,
    ]
  );

  const walletAuthUiState = useMemo(
    () =>
      getWalletAuthProgressUiState({
        isOidcAuthenticated,
        eligible: walletOnlyAuthEligible,
        frontendEnabled: walletAuth.isFrontendEnabled,
        isAvailable: walletAuth.isAvailable,
        isAuthenticating: walletAuth.isAuthenticating,
        hasWalletSession: Boolean(walletAuth.session),
        sessionInvalidationReason: walletAuth.sessionInvalidationReason,
        authErrorReason: walletAuth.error?.reasonCode || null,
      }),
    [
      isOidcAuthenticated,
      walletOnlyAuthEligible,
      walletAuth.isFrontendEnabled,
      walletAuth.isAvailable,
      walletAuth.isAuthenticating,
      walletAuth.session,
      walletAuth.sessionInvalidationReason,
      walletAuth.error,
    ]
  );

  const invalidateWalletSessionFromAuthError = walletAuth.invalidateFromAuthError;
  const onPrivateAuthFailure = useCallback(
    (reasonCode) => {
      if (resolveBearer.kind !== "wallet") return;
      invalidateWalletSessionFromAuthError(reasonCode || WALLET_AUTH_REASON.EXPIRED);
    },
    [resolveBearer.kind, invalidateWalletSessionFromAuthError]
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const finalUrl = (() => {
      try {
        return identityAddress ? buildWeb3SbtResolveUrl(identityAddress, resolveOwner) : null;
      } catch {
        return null;
      }
    })();
    // eslint-disable-next-line no-console -- dev-only identity diagnostics (must be visible)
    console.log("[ResolvedIdentityProvider]", {
      isOidcAuthenticated,
      socialAa: socialAaAddress ?? null,
      canonicalIdentityAddress: identityAddress ?? null,
      identityAddress: identityAddress ?? null,
      walletSmartAccount: smartAccount ?? null,
      connectedEoa: connectedEoa ?? null,
      viewerSource: viewer.source,
      walletEntryStatus: walletEntry.status,
      resolveOwner: resolveOwner ?? null,
      resolveBearerKind: resolveBearer.kind,
      authStateKey: resolveBearer.authStateKey,
      finalResolveUrl: finalUrl,
    });
  }, [
    isOidcAuthenticated,
    socialAaAddress,
    identityAddress,
    smartAccount,
    connectedEoa,
    viewer.source,
    walletEntry.status,
    resolveOwner,
    resolveBearer.kind,
    resolveBearer.authStateKey,
  ]);

  const canonicalIdentityKey = useMemo(() => {
    if (!identityAddress) return null;
    const ro = normalizeEvmAddress(resolveOwner);
    return ro ? `${identityAddress}|${ro.toLowerCase()}` : identityAddress;
  }, [identityAddress, resolveOwner]);

  const { metadata, profile, resolveData, loading, error, refetch } =
    useResolvedIdentity(identityAddress, resolveOwner, resolveBearer.token, {
      authStateKey: resolveBearer.authStateKey,
      onPrivateAuthFailure,
    });

  const walletTier = metadata?.tier ?? "Explorer";
  const syncIssueVisible = error === "user_state_unavailable";

  const authenticateWallet = walletAuth.authenticate;
  const reauthenticateWallet = walletAuth.reauthenticate;
  const verifyWalletForProgress = useCallback(async () => {
    if (walletAuthUiState === "expired") {
      await reauthenticateWallet();
    } else {
      await authenticateWallet();
    }
    refetch();
  }, [authenticateWallet, reauthenticateWallet, walletAuthUiState, refetch]);

  const value = useMemo(
    () => ({
      metadata,
      profile,
      resolveData,
      loading,
      error,
      refetch,
      walletTier,
      syncIssueVisible,
      /** Smart account / canonical progress address used for /web3sbt/resolve. */
      canonicalIdentityAddress: identityAddress,
      /** `${sc}|${owner}` or SC only — changes when canonical viewer identity changes. */
      canonicalIdentityKey,
      viewerSource: viewer.source,
      isWalletEntryLinkedAlias,
      walletEntryResolvePending,
      walletEntryMatchedBy: viewer.matchedBy,
      walletEntryLinkedWalletAddress: viewer.linkedWalletAddress,
      signerAddress: viewer.signerAddress ?? connectedEoa,
      /** WA-01c2 wallet-only private-read auth surface (Dashboard banner). */
      walletAuthProgress: {
        uiState: walletAuthUiState,
        eligible: walletOnlyAuthEligible,
        isAuthenticating: walletAuth.isAuthenticating,
        isAvailable: walletAuth.isAvailable,
        isFrontendEnabled: walletAuth.isFrontendEnabled,
        hasSession: Boolean(walletAuth.session),
        bearerKind: resolveBearer.kind,
        errorReason: walletAuth.error?.reasonCode || null,
        sessionInvalidationReason: walletAuth.sessionInvalidationReason,
        verifyWalletForProgress,
      },
    }),
    [
      metadata,
      profile,
      resolveData,
      loading,
      error,
      refetch,
      walletTier,
      syncIssueVisible,
      identityAddress,
      canonicalIdentityKey,
      viewer.source,
      viewer.matchedBy,
      viewer.linkedWalletAddress,
      viewer.signerAddress,
      isWalletEntryLinkedAlias,
      walletEntryResolvePending,
      connectedEoa,
      walletAuthUiState,
      walletOnlyAuthEligible,
      walletAuth.isAuthenticating,
      walletAuth.isAvailable,
      walletAuth.isFrontendEnabled,
      walletAuth.session,
      walletAuth.error,
      walletAuth.sessionInvalidationReason,
      resolveBearer.kind,
      verifyWalletForProgress,
    ]
  );

  return (
    <ResolvedIdentityContext.Provider value={value}>
      {children}
    </ResolvedIdentityContext.Provider>
  );
}
