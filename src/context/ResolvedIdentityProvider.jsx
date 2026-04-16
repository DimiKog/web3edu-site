import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "./IdentityContext.jsx";
import { ResolvedIdentityContext } from "./resolvedIdentityContext.js";
import { useResolvedIdentity } from "../hooks/useResolvedIdentity.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

/**
 * Single app-wide /web3sbt/resolve subscriber (one network fetch per identity key).
 */
export function ResolvedIdentityProvider({ children }) {
  const { owner, smartAccount } = useIdentity();
  const { address } = useAccount();

  const identityAddress = useMemo(
    () => normalizeEvmAddress(smartAccount),
    [smartAccount]
  );

  const { metadata, profile, loading, error, refetch } = useResolvedIdentity(
    identityAddress,
    owner ?? null,
    address ?? null
  );

  const walletTier = metadata?.tier ?? "Explorer";
  const syncIssueVisible = error === "user_state_unavailable";

  const value = useMemo(
    () => ({
      metadata,
      profile,
      loading,
      error,
      refetch,
      walletTier,
      syncIssueVisible,
    }),
    [metadata, profile, loading, error, refetch, walletTier, syncIssueVisible]
  );

  return (
    <ResolvedIdentityContext.Provider value={value}>
      {children}
    </ResolvedIdentityContext.Provider>
  );
}
