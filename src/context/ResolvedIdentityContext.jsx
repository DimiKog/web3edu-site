import React, { createContext, useContext, useMemo } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "./IdentityContext.jsx";
import { useResolvedIdentity } from "../hooks/useResolvedIdentity.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

const ResolvedIdentityContext = createContext(null);

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
    address ?? null,
    smartAccount ?? null
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

export function useResolvedIdentityContext() {
  const ctx = useContext(ResolvedIdentityContext);
  if (!ctx) {
    throw new Error(
      "useResolvedIdentityContext must be used within ResolvedIdentityProvider"
    );
  }
  return ctx;
}
