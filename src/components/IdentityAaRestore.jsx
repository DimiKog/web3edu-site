import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../context/IdentityContext.jsx";
import { resolveSmartAccountFromOwner } from "../api/aa.js";

/**
 * Sole active smart-account restore path (runs under WagmiProvider).
 * IdentityContext only reconciles `owner`; this component resolves `smartAccount`
 * once `owner` matches the connected EOA (or there is no connected address — ephemeral).
 */
export default function IdentityAaRestore() {
  const { address } = useAccount();
  const { owner, smartAccount, setIdentity } = useIdentity();

  useEffect(() => {
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
    resolveSmartAccountFromOwner(owner, { signal: controller.signal })
      .then((account) => {
        if (account) {
          setIdentity({ smartAccount: account });
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.warn("Failed to restore smart account from owner");
      });

    return () => controller.abort();
  }, [owner, address, smartAccount, setIdentity]);

  return null;
}
