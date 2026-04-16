import { useEffect, useState } from "react";

const WALLET_ADDRESS_KEY = "web3edu-wallet-address";

/**
 * Session EOA written by Web3RouteControls (wagmi sync). Empty string when absent.
 */
export function useWalletSessionAddress() {
  const [address, setAddress] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(WALLET_ADDRESS_KEY) || "";
  });

  useEffect(() => {
    const sync = () => {
      setAddress(
        typeof window !== "undefined"
          ? window.localStorage.getItem(WALLET_ADDRESS_KEY) || ""
          : ""
      );
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("web3edu-wallet-state", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("web3edu-wallet-state", sync);
    };
  }, []);

  return address.trim();
}
