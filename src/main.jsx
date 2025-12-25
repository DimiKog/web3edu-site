import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig } from "wagmi";
import { http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppEN from './pages/appEN.jsx';
import AppGR from './pages/appGR.jsx';
import Poe from './pages/poe/index.jsx';
import PoeGR from './pages/poe/index-gr.jsx';
import Education from './pages/education/index.jsx';
import EducationGR from './pages/education/index-gr.jsx';
import NetworkCheck from './pages/education/network-check.jsx';
import NetworkCheckGR from './pages/education/network-check-gr.jsx';
import TeamPageEN from './pages/team/TeamPageEN.jsx';
import TeamPageGR from './pages/team/TeamPageGR.jsx';
import Join from './pages/Join.jsx';
import JoinGR from './pages/JoinGR.jsx';
import MintIdentity from './pages/MintIdentity.jsx';
import MintIdentityGR from './pages/MintIdentityGR.jsx';
import WelcomeIdentity from './pages/WelcomeIdentity.jsx';
import WelcomeIdentityGR from './pages/WelcomeIdentityGR.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DashboardGR from './pages/DashboardGR.jsx';
import SbtView from "./pages/SbtView.jsx";
import SbtViewGR from "./pages/SbtViewGR.jsx";
import VerifyIdentity from "./pages/VerifyIdentity.jsx";
import VerifyIdentityGR from "./pages/VerifyIdentityGR.jsx";
import StartHere from './pages/StartHere.jsx';
import StartHereGR from './pages/StartHereGR.jsx';
import Labs from "./pages/Labs.jsx";
import LabsGR from './pages/LabsGR.jsx';
import Lab01 from "./pages/labs/Lab01";
import Lab01GR from "./pages/labs/Lab01GR";
import Lab02 from "./pages/labs/Lab02.jsx";
import Lab02GR from "./pages/labs/Lab02GR.jsx";


// Besu Edu-Net chain config
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

// RainbowKit + Wagmi config
const wagmiConfig = createConfig({
  appName: "Web3Edu-signin",
  chains: [web3EduChain],
  projectId: "4d28b03f4f1ed8de583b5738cc20a121",
  connectors: [
    injected(), // Explicit injected connector for MetaMask
  ],
  transports: {
    [web3EduChain.id]: http("https://rpc.dimikog.org/rpc/"),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<AppEN />} />
              <Route path="/gr" element={<AppGR />} />
              <Route path="/poe" element={<Poe />} />
              <Route path="/poe-gr" element={<PoeGR />} />
              <Route path="/education" element={<Education />} />
              <Route path="/education-gr" element={<EducationGR />} />
              <Route path="/education/network-check" element={<NetworkCheck />} />
              <Route path="/education/network-check-gr" element={<NetworkCheckGR />} />
              <Route path="/team" element={<TeamPageEN />} />
              <Route path="/team-gr" element={<TeamPageGR />} />
              <Route path="/join" element={<Join />} />
              <Route path="/join-gr" element={<JoinGR />} />
              <Route path="/mint-identity" element={<MintIdentity />} />
              <Route path="/mint-identity-gr" element={<MintIdentityGR />} />
              <Route path="/welcome" element={<WelcomeIdentity />} />
              <Route path="/welcome-gr" element={<WelcomeIdentityGR />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-gr" element={<DashboardGR />} />
              <Route path="/sbt-view" element={<SbtView />} />
              <Route path="/sbt-view-gr" element={<SbtViewGR />} />
              <Route path="/verify/:address" element={<VerifyIdentity />} />
              <Route path="/verify-gr/:address" element={<VerifyIdentityGR />} />
              <Route path="/start-here" element={<StartHere />} />
              <Route path="/start-here-gr" element={<StartHereGR />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs-gr" element={<LabsGR />} />
              <Route path="/labs/wallets-keys" element={<Lab01 />} />
              <Route path="/labs-gr/wallets-keys" element={<Lab01GR />} />
              <Route path="/labs/lab02" element={<Lab02 />} />
              <Route path="/labs-gr/lab02" element={<Lab02GR />} />
            </Routes>
          </HashRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
