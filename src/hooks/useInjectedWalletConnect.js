import { useCallback } from "react";
import { useConfig, useConnect } from "wagmi";
import { getAccount } from "wagmi/actions";
import { persistWagmiWalletSession } from "../utils/aaIdentity.js";

/**
 * Browser extension (injected) connect — same connector order as {@link ../providers/Web3Providers.jsx}.
 * Persists wagmi session keys + dispatches `web3edu-wallet-state` after success.
 */
export function useInjectedWalletConnect() {
  const wagmiConfig = useConfig();
  const { connectAsync, isPending } = useConnect();

  const connectInjected = useCallback(async () => {
    const connector =
      wagmiConfig.connectors.find((c) => c.ready) ||
      wagmiConfig.connectors[0];

    if (!connector) {
      console.warn("No wallet connector available");
      return;
    }

    try {
      await connectAsync({ connector });
      const { address } = getAccount(wagmiConfig);
      if (address) persistWagmiWalletSession(address);
    } catch (e) {
      console.warn("Wallet connection failed", e, {
        message: e?.message,
        name: e?.name,
      });
    }
  }, [wagmiConfig, connectAsync]);

  return { connectInjected, isPending };
}
