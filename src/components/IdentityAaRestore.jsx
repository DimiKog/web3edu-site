import { useEffect, useRef } from "react";
import { useAccount, useConfig } from "wagmi";
import { getAccount } from "wagmi/actions";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  getSocialIdentityAaAddress,
  hasUsableSocialIdentityPayload,
} from "../utils/socialIdentityPayload.js";
import { tryProvisionMintedWalletIdentityFromOwner } from "../utils/provisionWalletIdentityFromOwner.js";
import { shouldApplyWalletConnectIdentityMutation } from "../utils/walletConnectIdentityFreshness.js";

/**
 * Sole active smart-account restore path (runs under WagmiProvider).
 * IdentityContext only reconciles `owner`; this component resolves `smartAccount`
 * once `owner` matches the connected EOA (or there is no connected address — ephemeral).
 * Uses owner resolve → anchor → address+owner resolve (same pattern as mint/import).
 *
 * In-flight restores are generation-gated and re-validated against the live wallet /
 * OIDC context before setIdentity so aborted or superseded responses cannot mutate.
 */
export default function IdentityAaRestore() {
  const { address } = useAccount();
  const wagmiConfig = useConfig();
  const { owner, smartAccount, setIdentity } = useIdentity();
  const { socialIdentity, isOidcAuthenticated } = useSocialIdentity();

  const opSeqRef = useRef(0);
  const liveRef = useRef({
    isOidcAuthenticated: false,
    hasActiveSocialAa: false,
  });

  const hasActiveSocialAa = Boolean(
    isOidcAuthenticated &&
      hasUsableSocialIdentityPayload(socialIdentity) &&
      normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity))
  );

  liveRef.current = {
    isOidcAuthenticated: Boolean(isOidcAuthenticated),
    hasActiveSocialAa,
  };

  useEffect(() => {
    if (isOidcAuthenticated) return;
    if (!owner) return;
    if (smartAccount) return;

    if (
      address &&
      owner.toLowerCase() !== address.toLowerCase()
    ) {
      return;
    }

    // eslint-disable-next-line no-console -- AA restore diagnostic
    console.log("AA RESTORE", { owner, smartAccount, address });

    const controller = new AbortController();
    const mySeq = ++opSeqRef.current;
    const ownerNorm = normalizeEvmAddress(owner);
    const startedWithLiveWallet = Boolean(normalizeEvmAddress(address));
    const requestOidcAuthenticated = Boolean(isOidcAuthenticated);

    const isOperationFresh = () => {
      const liveOwner = normalizeEvmAddress(getAccount(wagmiConfig).address);
      const live = liveRef.current;
      return shouldApplyWalletConnectIdentityMutation({
        operationId: mySeq,
        currentOperationId: opSeqRef.current,
        requestOwner: ownerNorm,
        liveOwner,
        requestOidcAuthenticated,
        liveOidcAuthenticated: live.isOidcAuthenticated,
        liveHasActiveSocialAa: live.hasActiveSocialAa,
        // Ephemeral restore may run without a connected wallet; still reject mismatches.
        requireLiveOwner: startedWithLiveWallet,
      });
    };

    (async () => {
      if (!ownerNorm) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only guard
          console.warn("Restore skipped — invalid owner for resolve");
        }
        return;
      }
      try {
        const status = await tryProvisionMintedWalletIdentityFromOwner(
          ownerNorm,
          setIdentity,
          { signal: controller.signal, isOperationFresh }
        );
        if (status === "stale" || status === "aborted") {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- dev-only
            console.debug("[IdentityAaRestore] Discarded stale/aborted restore", {
              status,
              ownerNorm,
            });
          }
          return;
        }
        if (import.meta.env.DEV && status !== "minted") {
          const msg =
            status === "not_minted"
              ? "Restore skipped — identity not minted for this owner"
              : status === "invalid_owner"
                ? "Restore skipped — invalid owner"
                : "Restore skipped — resolve failed";
          // eslint-disable-next-line no-console -- dev-only
          console.warn(msg);
        }
      } catch {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.warn("Restore skipped — resolve failed");
        }
      }
    })();

    return () => {
      opSeqRef.current += 1;
      controller.abort();
    };
  }, [
    owner,
    address,
    smartAccount,
    setIdentity,
    isOidcAuthenticated,
    hasActiveSocialAa,
    wagmiConfig,
  ]);

  return null;
}
