import React, { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "./useIdentity.js";
import { ResolvedIdentityContext } from "./resolvedIdentityContext.js";
import { useResolvedIdentity } from "../hooks/useResolvedIdentity.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { buildResolveOwner, buildWeb3SbtResolveUrl } from "../lib/web3eduBackend.js";
import { useSocialIdentity } from "./SocialIdentityContext.jsx";
import {
  getSocialIdentityAaAddress,
  getSocialIdentityOwnerAddress,
} from "../utils/socialIdentityPayload.js";
import { isWalletMintedIdentityRecord } from "../utils/identityReadiness.js";
import { readConnectedEoaAddress } from "../utils/aaIdentity.js";
import { isNeutralAfterLogout } from "../utils/viewerMode.js";

/**
 * Single app-wide /web3sbt/resolve subscriber (one network fetch per identity key).
 */
export function ResolvedIdentityProvider({ children }) {
  const { smartAccount, owner, identityHydrated, identity } = useIdentity();
  const { address } = useAccount();
  const { socialIdentity, isOidcAuthenticated } = useSocialIdentity();

  const socialAaAddress = useMemo(
    () => normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity)),
    [socialIdentity]
  );

  const effectiveSmartAccount = useMemo(() => {
    /**
     * Canonical viewer identity:
     * - If social login has an AA address, always resolve dashboard/profile against that AA.
     * - Otherwise, fall back to the persisted minted AA identity (wallet-first or local-browser AA).
     *
     * This avoids a mismatch where a previously-minted local AA stays canonical even after OIDC
     * login provisions a distinct social AA identity.
     */
    if (socialAaAddress) return socialAaAddress;
    // Neutral post-logout guard: do not silently restore wallet/device canonical identity.
    if (isNeutralAfterLogout()) return null;
    const walletSc =
      identityHydrated && isWalletMintedIdentityRecord(identity)
        ? normalizeEvmAddress(smartAccount)
        : null;
    return walletSc ?? null;
  }, [identityHydrated, smartAccount, socialAaAddress, identity]);

  const identityAddress = effectiveSmartAccount;

  /**
   * `?owner=` for /web3sbt/resolve only when backend supplies an owner for the social AA.
   * Never fall back to persisted `identity.owner` here — it can be a stale wallet from a
   * prior session and causes the wrong user's XP/profile to load for the social SC path.
   */
  const resolveOwner = useMemo(() => {
    if (!identityHydrated) return null;
    const socialOwner = normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity));
    if (socialAaAddress) {
      return socialOwner ?? null;
    }
    const sessionOwner = normalizeEvmAddress(readConnectedEoaAddress());
    return sessionOwner ?? buildResolveOwner(address, owner) ?? socialOwner ?? null;
  }, [identityHydrated, address, owner, socialIdentity, socialAaAddress]);

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
      resolveOwner: resolveOwner ?? null,
      finalResolveUrl: finalUrl,
    });
  }, [
    isOidcAuthenticated,
    socialAaAddress,
    identityAddress,
    smartAccount,
    resolveOwner,
  ]);

  const canonicalIdentityKey = useMemo(() => {
    if (!identityAddress) return null;
    const ro = normalizeEvmAddress(resolveOwner);
    return ro ? `${identityAddress}|${ro.toLowerCase()}` : identityAddress;
  }, [identityAddress, resolveOwner]);

  const { metadata, profile, resolveData, loading, error, refetch } =
    useResolvedIdentity(identityAddress, resolveOwner);

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
      /** Smart account address used for /web3sbt/resolve (wallet SC or social AA). */
      canonicalIdentityAddress: identityAddress,
      /** `${sc}|${owner}` or SC only — changes when canonical viewer identity changes. */
      canonicalIdentityKey,
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
    ]
  );

  return (
    <ResolvedIdentityContext.Provider value={value}>
      {children}
    </ResolvedIdentityContext.Provider>
  );
}
