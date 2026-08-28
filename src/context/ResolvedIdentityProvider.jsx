import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "./useIdentity.js";
import { ResolvedIdentityContext } from "./resolvedIdentityContext.js";
import { useResolvedIdentity } from "../hooks/useResolvedIdentity.js";
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
  WALLET_ENTRY_IDLE,
  selectCanonicalViewerIdentity,
} from "../utils/walletEntryCanonicalResolve.js";

/**
 * Single app-wide canonical viewer identity.
 *
 * Wallet-entry (no OIDC): resolve the connected EOA via
 * GET /web3edu/identity/resolve/<EOA> before using a device-local AA.
 */
export function ResolvedIdentityProvider({ children }) {
  const { smartAccount, owner, identityHydrated, identity } = useIdentity();
  const { address, isConnected } = useAccount();
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
  ]);

  const canonicalIdentityKey = useMemo(() => {
    if (!identityAddress) return null;
    const ro = normalizeEvmAddress(resolveOwner);
    return ro ? `${identityAddress}|${ro.toLowerCase()}` : identityAddress;
  }, [identityAddress, resolveOwner]);

  const { metadata, profile, resolveData, loading, error, refetch } =
    useResolvedIdentity(
      identityAddress,
      resolveOwner,
      isOidcAuthenticated ? idToken : null
    );

  const walletTier = metadata?.tier ?? "Explorer";
  const syncIssueVisible = error === "user_state_unavailable";

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
    ]
  );

  return (
    <ResolvedIdentityContext.Provider value={value}>
      {children}
    </ResolvedIdentityContext.Provider>
  );
}
