import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { useResolvedIdentityContext } from "./useResolvedIdentityContext.js";

/**
 * Shared educational-write / lab-status identity args.
 * Includes H3A.1 wallet-entry flags from ResolvedIdentityProvider.
 */
export function useEducationalIdentityArgs() {
  const { address } = useAccount();
  const { smartAccount, owner } = useIdentity();
  const {
    socialIdentity,
    isOidcAuthenticated,
    socialIdentityLoading,
    oidcAuthLoading,
  } = useSocialIdentity();
  const { isWalletEntryLinkedAlias, walletEntryResolvePending } =
    useResolvedIdentityContext();

  return useMemo(
    () => ({
      smartAccount,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      address,
      owner,
      walletEntryLinkedAlias: Boolean(isWalletEntryLinkedAlias),
      walletEntryResolvePending: Boolean(walletEntryResolvePending),
    }),
    [
      smartAccount,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      address,
      owner,
      isWalletEntryLinkedAlias,
      walletEntryResolvePending,
    ]
  );
}
