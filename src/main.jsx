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
import ScrollToTop from "./components/ScrollToTop.jsx";

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
import DaoPreview from './pages/dao-preview/DaoPreview.jsx';
import DaoPreviewGR from './pages/dao-preview/DaoPreviewGR.jsx';
import DaoGovernance from './pages/dao-preview/DaoGovernance.jsx';
import DaoGovernanceGR from './pages/dao-preview/DaoGovernanceGR.jsx';

//Labs
import Labs from "./pages/Labs.jsx";
import LabsGR from './pages/LabsGR.jsx';
import Lab01 from "./pages/labs/Lab01";
import Lab01GR from "./pages/labs/Lab01GR";
import Lab02 from "./pages/labs/Lab02.jsx";
import Lab02GR from "./pages/labs/Lab02GR.jsx";
import Lab01Interaction from './pages/labs/Lab01Interaction.jsx';
import Lab01InteractionGR from './pages/labs/Lab01InteractionGR.jsx';
import Lab02Interaction from './pages/labs/Lab02Interaction.jsx';
import Lab02InteractionGR from './pages/labs/Lab02InteractionGR.jsx';
import Lab03 from './pages/labs/Lab03.jsx';
import Lab03GR from './pages/labs/Lab03GR.jsx';
import Lab03Interaction from './pages/labs/Lab03Interaction.jsx';
import Lab03InteractionGR from './pages/labs/Lab03InteractionGR.jsx';
import Lab04 from './pages/labs/Lab04.jsx';
import Lab04GR from './pages/labs/Lab04GR.jsx';
import Lab04Interaction from './pages/labs/Lab04Interaction.jsx';
import Lab04InteractionGR from './pages/labs/Lab04InteractionGR.jsx';
import Lab05 from './pages/labs/Lab05.jsx';
import Lab05GR from './pages/labs/Lab05GR.jsx';
import Lab05Interaction from './pages/labs/Lab05Interaction.jsx';
import Lab05InteractionGR from './pages/labs/Lab05InteractionGR.jsx';
import Lab06 from './pages/labs/Lab06.jsx';
import Lab06GR from './pages/labs/Lab06GR.jsx';
import Lab06Interaction from './pages/labs/Lab06Interaction.jsx';
import Lab06InteractionGR from './pages/labs/Lab06InteractionGR.jsx';

//Project Labs
import PoELab from './pages/labs/PoELab.jsx';
import PoELabGR from './pages/labs/PoELabGR.jsx';

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
            <ScrollToTop />
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
              <Route path="/dao-preview" element={<DaoPreview />} />
              <Route path="/dao-preview-gr" element={<DaoPreviewGR />} />
              <Route path="/dao-info" element={<DaoGovernance />} />
              <Route path="/dao-info-gr" element={<DaoGovernanceGR />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs-gr" element={<LabsGR />} />
              <Route path="/labs/wallets-keys" element={<Lab01 />} />
              <Route path="/labs-gr/wallets-keys" element={<Lab01GR />} />
              <Route path="/labs/lab02" element={<Lab02 />} />
              <Route path="/labs-gr/lab02" element={<Lab02GR />} />
              <Route path="/labs/wallets-keys/interaction" element={<Lab01Interaction />} />
              <Route path="/labs-gr/wallets-keys/interaction" element={<Lab01InteractionGR />} />
              <Route path="/labs/lab02/interaction" element={<Lab02Interaction />} />
              <Route path="/labs-gr/lab02/interaction" element={<Lab02InteractionGR />} />
              <Route path="/labs/lab03" element={<Lab03 />} />
              <Route path="/labs-gr/lab03" element={<Lab03GR />} />
              <Route path="/labs/lab03/interaction" element={<Lab03Interaction />} />
              <Route path="/labs-gr/lab03/interaction" element={<Lab03InteractionGR />} />
              <Route path="/labs/lab04" element={<Lab04 />} />
              <Route path="/labs-gr/lab04" element={<Lab04GR />} />
              <Route path="/labs/lab04/interaction" element={<Lab04Interaction />} />
              <Route path="/labs-gr/lab04/interaction" element={<Lab04InteractionGR />} />
              <Route path="/labs/lab05" element={<Lab05 />} />
              <Route path="/labs-gr/lab05" element={<Lab05GR />} />
              <Route path="/labs/lab05/interaction" element={<Lab05Interaction />} />
              <Route path="/labs-gr/lab05/interaction" element={<Lab05InteractionGR />} />
              <Route path="/labs/lab06" element={<Lab06 />} />
              <Route path="/labs-gr/lab06" element={<Lab06GR />} />
              <Route path="/labs/lab06/interaction" element={<Lab06Interaction />} />
              <Route path="/labs-gr/lab06/interaction" element={<Lab06InteractionGR />} />
              <Route path="/labs/proof-of-escape" element={<PoELab />} />
              <Route path="/labs-gr/proof-of-escape" element={<PoELabGR />} />
            </Routes>
          </HashRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
