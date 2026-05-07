import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "wagmi";
import { getAccount } from "wagmi/actions";
import { ethers } from "ethers";
import { useInjectedWalletConnect } from "./useInjectedWalletConnect.js";
import { useIdentity } from "../context/useIdentity.js";
import { isWalletMintedIdentityRecord } from "../utils/identityReadiness.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  getSocialIdentityAaAddress,
  hasUsableSocialIdentityPayload,
} from "../utils/socialIdentityPayload.js";
import { resolveIdentity, resolveIdentityV2 } from "../api/aa.js";
import {
  pickSmartAccountFromPayload,
  resolveIndicatesMintedIdentity,
} from "../utils/aaResolvePayload.js";

/**
 * Injected wallet connect + optional owner→AA resolve for wallet-first restore.
 * When social AA or an active wallet-backed AA identity is already canonical, only
 * connects the browser wallet (session-additive) and navigates to the dashboard.
 */
export function useSocialAwareWalletConnect() {
  const navigate = useNavigate();
  const wagmiConfig = useConfig();
  const { connectInjected, isPending } = useInjectedWalletConnect();
  const { smartAccount, setIdentity, identity } = useIdentity();
  const { socialIdentity, isOidcAuthenticated } = useSocialIdentity();

  const connectWalletSessionAware = useCallback(
    async (isGr) => {
      await connectInjected();
      const { address: connected } = getAccount(wagmiConfig);
      const ownerNorm = normalizeEvmAddress(connected);
      if (!ownerNorm) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only guard
          console.warn("Skipping wallet-connect resolve — no connected address (user cancelled or no accounts)");
        }
        return false;
      }

      const persistedSc = normalizeEvmAddress(smartAccount);
      const socialAaNorm = normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity));
      const hasActiveSocialAa =
        Boolean(isOidcAuthenticated && hasUsableSocialIdentityPayload(socialIdentity) && socialAaNorm);
      const hasActiveWalletAa = Boolean(
        persistedSc && isWalletMintedIdentityRecord(identity)
      );

      /**
       * IMPORTANT: A wallet connect can race with identity persistence. Also, `identity.owner`
       * may already have been overwritten to the newly connected EOA while `smartAccount` still
       * points to a previous minted identity. So we must compare against the backend owner→AA
       * mapping instead of trusting local `identity.owner`.
       */
      let walletMismatch = false;
      if (!hasActiveSocialAa && hasActiveWalletAa && persistedSc) {
        try {
          const ownerLookup = await resolveIdentity({ owner: ownerNorm });
          let mapped = normalizeEvmAddress(ownerLookup?.identityAddress ?? ownerLookup?.smartAccount);
          if (!mapped) mapped = normalizeEvmAddress(pickSmartAccountFromPayload(ownerLookup));
          if (mapped && mapped.toLowerCase() !== persistedSc.toLowerCase()) {
            walletMismatch = true;
          }
        } catch {
          // If lookup fails, do not assume mismatch; fall back to existing behavior.
        }
      }

      if (hasActiveSocialAa || (hasActiveWalletAa && !walletMismatch)) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.debug(
            "[useSocialAwareWalletConnect] Wallet connect is session-additive — skipping auto identity switch",
            { hasActiveSocialAa, hasActiveWalletAa, walletMismatch }
          );
        }
        navigate(isGr ? "/dashboard-gr" : "/dashboard");
        return true;
      }

      if (walletMismatch) {
        setIdentity({
          owner: ownerNorm,
          smartAccount: null,
          version: null,
          tokenId: null,
          hasIdentity: false,
          alreadyMinted: false,
          signerType: "eoa",
        });
      }

      try {
        const first = await resolveIdentity({ owner: ownerNorm });
        if (!first) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- dev-only
            console.warn("Skipping wallet-connect resolve — owner resolve returned null");
          }
          navigate(isGr ? "/join-gr" : "/join");
          return false;
        }
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.log("WALLET CONNECT RESOLVE", first);
        }
        let anchor = normalizeEvmAddress(first?.identityAddress ?? first?.smartAccount);
        if (!anchor) {
          anchor = normalizeEvmAddress(pickSmartAccountFromPayload(first));
        }
        if (!anchor) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- dev-only
            console.warn("Restore skipped — owner not linked to smartAccount");
          }
          navigate(isGr ? "/join-gr" : "/join");
          return false;
        }
        const finalResolved = await resolveIdentityV2({
          address: anchor,
        });
        if (!finalResolved) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- dev-only
            console.warn("Skipping wallet-connect resolve — final resolve returned null");
          }
          navigate(isGr ? "/join-gr" : "/join");
          return false;
        }
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.log("WALLET CONNECT RESOLVE (final)", finalResolved);
        }
        if (!resolveIndicatesMintedIdentity(finalResolved)) {
          navigate(isGr ? "/join-gr" : "/join");
          return false;
        }
        const rawSc = pickSmartAccountFromPayload(finalResolved);
        const smartAccountResolved = normalizeEvmAddress(rawSc);
        if (!smartAccountResolved) {
          navigate(isGr ? "/join-gr" : "/join");
          return false;
        }
        let ownerChecksummed = ownerNorm;
        try {
          ownerChecksummed = ethers.getAddress(ownerNorm);
        } catch {
          ownerChecksummed = ownerNorm;
        }
        setIdentity({
          owner: ownerChecksummed,
          smartAccount: smartAccountResolved,
          hasIdentity: true,
          version: finalResolved?.version ?? "aa",
          tokenId: finalResolved?.tokenId ?? finalResolved?.token_id ?? null,
          alreadyMinted: true,
          signerType: "eoa",
        });
        navigate(isGr ? "/dashboard-gr" : "/dashboard");
        return true;
      } catch (e) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.warn("WALLET CONNECT RESOLVE failed", e);
        }
        navigate(isGr ? "/join-gr" : "/join");
        return false;
      }
    },
    [
      connectInjected,
      wagmiConfig,
      setIdentity,
      navigate,
      smartAccount,
      identity,
      socialIdentity,
      isOidcAuthenticated,
    ]
  );

  return { connectWalletSessionAware, isPending };
}
