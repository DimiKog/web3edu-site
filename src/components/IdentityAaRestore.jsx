import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { tryProvisionMintedWalletIdentityFromOwner } from "../utils/provisionWalletIdentityFromOwner.js";

/**
 * Sole active smart-account restore path (runs under WagmiProvider).
 * IdentityContext only reconciles `owner`; this component resolves `smartAccount`
 * once `owner` matches the connected EOA (or there is no connected address — ephemeral).
 * Uses owner resolve → anchor → address+owner resolve (same pattern as mint/import).
 */
export default function IdentityAaRestore() {
  const { address } = useAccount();
  const { owner, smartAccount, setIdentity } = useIdentity();
  const { isOidcAuthenticated } = useSocialIdentity();

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
    let cancelled = false;

    (async () => {
      const ownerNorm = normalizeEvmAddress(owner);
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
          { signal: controller.signal }
        );
        if (cancelled) return;
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
      cancelled = true;
      controller.abort();
    };
  }, [owner, address, smartAccount, setIdentity, isOidcAuthenticated]);

  return null;
}
