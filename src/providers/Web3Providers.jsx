import React from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import rainbowCssUrl from "@rainbow-me/rainbowkit/styles.css?url";

const web3EduChain = {
  id: 424242,
  name: "QBFT_Besu_EduNet",
  rpcUrls: {
    default: { http: ["https://rpc.dimikog.org/rpc/"] },
  },
  nativeCurrency: {
    name: "EDU-D",
    symbol: "EDU-D",
    decimals: 18,
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://blockexplorer.dimikog.org" },
  },
};

const wagmiConfig = createConfig({
  appName: "Web3Edu-signin",
  chains: [web3EduChain],
  projectId: "4d28b03f4f1ed8de583b5738cc20a121",
  connectors: [injected()],
  transports: {
    [web3EduChain.id]: http("https://rpc.dimikog.org/rpc/"),
  },
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }) {
  React.useEffect(() => {
    const id = "rainbowkit-styles";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = rainbowCssUrl;
    document.head.appendChild(link);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
