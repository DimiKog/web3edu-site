import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { useResolvedIdentityContext } from "./useResolvedIdentityContext.js";

/**
 * Shared educational-write / lab-status identity args.
 * Includes H3A.1 wallet-entry flags from ResolvedIdentityProvider.
 * Includes Keycloak idToken from SocialIdentityContext for lab write auth.
 */
export function useEducationalIdentityArgs() {
  const { address } = useAccount();
  const { smartAccount, owner } = useIdentity();
  const {
    socialIdentity,
    isOidcAuthenticated,
    socialIdentityLoading,
    oidcAuthLoading,
    idToken,
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
      idToken,
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
      idToken,
      address,
      owner,
      isWalletEntryLinkedAlias,
      walletEntryResolvePending,
    ]
  );
}
