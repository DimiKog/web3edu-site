import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const AppEN = lazy(() => import("../pages/appEN.jsx"));
const AppGR = lazy(() => import("../pages/appGR.jsx"));
const Poe = lazy(() => import("../pages/poe/index.jsx"));
const PoeGR = lazy(() => import("../pages/poe/index-gr.jsx"));
const Education = lazy(() => import("../pages/education/index.jsx"));
const EducationGR = lazy(() => import("../pages/education/index-gr.jsx"));
const NetworkCheck = lazy(() => import("../pages/education/network-check.jsx"));
const NetworkCheckGR = lazy(() => import("../pages/education/network-check-gr.jsx"));
const NetworkCheckStandalone = lazy(() => import("../pages/network-check.jsx"));
const NetworkCheckStandaloneGR = lazy(() => import("../pages/network-check-gr.jsx"));
const TeamPageEN = lazy(() => import("../pages/team/TeamPageEN.jsx"));
const TeamPageGR = lazy(() => import("../pages/team/TeamPageGR.jsx"));
const StartHere = lazy(() => import("../pages/StartHere.jsx"));
const StartHereGR = lazy(() => import("../pages/StartHereGR.jsx"));
const DaoPreview = lazy(() => import("../pages/dao-preview/DaoPreview.jsx"));
const DaoPreviewGR = lazy(() => import("../pages/dao-preview/DaoPreviewGR.jsx"));
const DaoGovernance = lazy(() => import("../pages/dao-preview/DaoGovernance.jsx"));
const DaoGovernanceGR = lazy(() => import("../pages/dao-preview/DaoGovernanceGR.jsx"));

const Join = lazy(() => import("../pages/Join.jsx"));
const JoinGR = lazy(() => import("../pages/JoinGR.jsx"));
const MintIdentity = lazy(() => import("../pages/MintIdentity.jsx"));
const MintIdentityGR = lazy(() => import("../pages/MintIdentityGR.jsx"));
const WelcomeIdentity = lazy(() => import("../pages/WelcomeIdentity.jsx"));
const WelcomeIdentityGR = lazy(() => import("../pages/WelcomeIdentityGR.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const DashboardGR = lazy(() => import("../pages/DashboardGR.jsx"));
const SbtView = lazy(() => import("../pages/SbtView.jsx"));
const SbtViewGR = lazy(() => import("../pages/SbtViewGR.jsx"));
const VerifyIdentity = lazy(() => import("../pages/VerifyIdentity.jsx"));
const VerifyIdentityGR = lazy(() => import("../pages/VerifyIdentityGR.jsx"));
const Labs = lazy(() => import("../pages/Labs.jsx"));
const LabsGR = lazy(() => import("../pages/LabsGR.jsx"));
const Lab01 = lazy(() => import("../pages/labs/Lab01.jsx"));
const Lab01GR = lazy(() => import("../pages/labs/Lab01GR.jsx"));
const Lab02 = lazy(() => import("../pages/labs/Lab02.jsx"));
const Lab02GR = lazy(() => import("../pages/labs/Lab02GR.jsx"));
const Lab01Interaction = lazy(() => import("../pages/labs/Lab01Interaction.jsx"));
const Lab01InteractionGR = lazy(() => import("../pages/labs/Lab01InteractionGR.jsx"));
const Lab02Interaction = lazy(() => import("../pages/labs/Lab02Interaction.jsx"));
const Lab02InteractionGR = lazy(() => import("../pages/labs/Lab02InteractionGR.jsx"));
const Lab03 = lazy(() => import("../pages/labs/Lab03.jsx"));
const Lab03GR = lazy(() => import("../pages/labs/Lab03GR.jsx"));
const Lab03Interaction = lazy(() => import("../pages/labs/Lab03Interaction.jsx"));
const Lab03InteractionGR = lazy(() => import("../pages/labs/Lab03InteractionGR.jsx"));
const Lab04 = lazy(() => import("../pages/labs/Lab04.jsx"));
const Lab04GR = lazy(() => import("../pages/labs/Lab04GR.jsx"));
const Lab04Interaction = lazy(() => import("../pages/labs/Lab04Interaction.jsx"));
const Lab04InteractionGR = lazy(() => import("../pages/labs/Lab04InteractionGR.jsx"));
const Lab05 = lazy(() => import("../pages/labs/Lab05.jsx"));
const Lab05GR = lazy(() => import("../pages/labs/Lab05GR.jsx"));
const Lab05Interaction = lazy(() => import("../pages/labs/Lab05Interaction.jsx"));
const Lab05InteractionGR = lazy(() => import("../pages/labs/Lab05InteractionGR.jsx"));
const Lab06 = lazy(() => import("../pages/labs/Lab06.jsx"));
const Lab06GR = lazy(() => import("../pages/labs/Lab06GR.jsx"));
const Lab06Interaction = lazy(() => import("../pages/labs/Lab06Interaction.jsx"));
const Lab06InteractionGR = lazy(() => import("../pages/labs/Lab06InteractionGR.jsx"));
const DaoLab01 = lazy(() => import("../pages/labs/DaoLab01.jsx"));
const DaoLab01GR = lazy(() => import("../pages/labs/DaoLab01GR.jsx"));
const DaoLab01Interaction = lazy(() => import("../pages/labs/DaoLab01Interaction.jsx"));
const DaoLab01InteractionGR = lazy(() => import("../pages/labs/DaoLab01InteractionGR.jsx"));
const DaoLab02 = lazy(() => import("../pages/labs/DaoLab02.jsx"));
const DaoLab02GR = lazy(() => import("../pages/labs/DaoLab02GR.jsx"));
const DaoLab02Interaction = lazy(() => import("../pages/labs/DaoLab02Interaction.jsx"));
const DaoLab02InteractionGR = lazy(() => import("../pages/labs/DaoLab02InteractionGR.jsx"));
const PoELab = lazy(() => import("../pages/labs/PoELab.jsx"));
const PoELabGR = lazy(() => import("../pages/labs/PoELabGR.jsx"));
const AdminPage = lazy(() => import("../pages/AdminPage.jsx"));
const Web3Layout = lazy(() => import("./Web3Layout.jsx"));

function RouteLoader() {
  return <div className="w-full min-h-screen" />;
}

function withSuspense(node) {
  return <Suspense fallback={<RouteLoader />}>{node}</Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={withSuspense(<AppEN />)} />
      <Route path="/gr" element={withSuspense(<AppGR />)} />
      <Route path="/poe" element={withSuspense(<Poe />)} />
      <Route path="/poe-gr" element={withSuspense(<PoeGR />)} />
      <Route path="/education" element={withSuspense(<Education />)} />
      <Route path="/education-gr" element={withSuspense(<EducationGR />)} />
      <Route path="/education/network-check" element={withSuspense(<NetworkCheck />)} />
      <Route path="/education/network-check-gr" element={withSuspense(<NetworkCheckGR />)} />
      <Route path="/network-check" element={withSuspense(<NetworkCheckStandalone />)} />
      <Route path="/network-check-gr" element={withSuspense(<NetworkCheckStandaloneGR />)} />
      <Route path="/team" element={withSuspense(<TeamPageEN />)} />
      <Route path="/team-gr" element={withSuspense(<TeamPageGR />)} />
      <Route path="/start-here" element={withSuspense(<StartHere />)} />
      <Route path="/start-here-gr" element={withSuspense(<StartHereGR />)} />
      <Route path="/dao-preview" element={withSuspense(<DaoPreview />)} />
      <Route path="/dao-preview-gr" element={withSuspense(<DaoPreviewGR />)} />
      <Route path="/dao-info" element={withSuspense(<DaoGovernance />)} />
      <Route path="/dao-governance" element={withSuspense(<DaoGovernance />)} />
      <Route path="/dao-info-gr" element={withSuspense(<DaoGovernanceGR />)} />

      <Route element={withSuspense(<Web3Layout />)}>
        <Route path="/join" element={withSuspense(<Join />)} />
        <Route path="/join-gr" element={withSuspense(<JoinGR />)} />
        <Route path="/mint-identity" element={withSuspense(<MintIdentity />)} />
        <Route path="/mint-identity-gr" element={withSuspense(<MintIdentityGR />)} />
        <Route path="/welcome" element={withSuspense(<WelcomeIdentity />)} />
        <Route path="/welcome-gr" element={withSuspense(<WelcomeIdentityGR />)} />
        <Route path="/dashboard" element={withSuspense(<Dashboard />)} />
        <Route path="/dashboard-gr" element={withSuspense(<DashboardGR />)} />
        <Route path="/sbt-view" element={withSuspense(<SbtView />)} />
        <Route path="/sbt-view-gr" element={withSuspense(<SbtViewGR />)} />
        <Route path="/verify/:address" element={withSuspense(<VerifyIdentity />)} />
        <Route path="/verify-gr/:address" element={withSuspense(<VerifyIdentityGR />)} />
        <Route path="/labs" element={withSuspense(<Labs />)} />
        <Route path="/labs-gr" element={withSuspense(<LabsGR />)} />
        <Route path="/labs/wallets-keys" element={withSuspense(<Lab01 />)} />
        <Route path="/labs-gr/wallets-keys" element={withSuspense(<Lab01GR />)} />
        <Route path="/labs/lab02" element={withSuspense(<Lab02 />)} />
        <Route path="/labs-gr/lab02" element={withSuspense(<Lab02GR />)} />
        <Route path="/labs/wallets-keys/interaction" element={withSuspense(<Lab01Interaction />)} />
        <Route path="/labs-gr/wallets-keys/interaction" element={withSuspense(<Lab01InteractionGR />)} />
        <Route path="/labs/lab02/interaction" element={withSuspense(<Lab02Interaction />)} />
        <Route path="/labs-gr/lab02/interaction" element={withSuspense(<Lab02InteractionGR />)} />
        <Route path="/labs/lab03" element={withSuspense(<Lab03 />)} />
        <Route path="/labs-gr/lab03" element={withSuspense(<Lab03GR />)} />
        <Route path="/labs/lab03/interaction" element={withSuspense(<Lab03Interaction />)} />
        <Route path="/labs-gr/lab03/interaction" element={withSuspense(<Lab03InteractionGR />)} />
        <Route path="/labs/lab04" element={withSuspense(<Lab04 />)} />
        <Route path="/labs-gr/lab04" element={withSuspense(<Lab04GR />)} />
        <Route path="/labs/lab04/interaction" element={withSuspense(<Lab04Interaction />)} />
        <Route path="/labs-gr/lab04/interaction" element={withSuspense(<Lab04InteractionGR />)} />
        <Route path="/labs/lab05" element={withSuspense(<Lab05 />)} />
        <Route path="/labs-gr/lab05" element={withSuspense(<Lab05GR />)} />
        <Route path="/labs/lab05/interaction" element={withSuspense(<Lab05Interaction />)} />
        <Route path="/labs-gr/lab05/interaction" element={withSuspense(<Lab05InteractionGR />)} />
        <Route path="/labs/lab06" element={withSuspense(<Lab06 />)} />
        <Route path="/labs-gr/lab06" element={withSuspense(<Lab06GR />)} />
        <Route path="/labs/lab06/interaction" element={withSuspense(<Lab06Interaction />)} />
        <Route path="/labs-gr/lab06/interaction" element={withSuspense(<Lab06InteractionGR />)} />
        <Route path="/labs/dao-01" element={withSuspense(<DaoLab01 />)} />
        <Route path="/labs-gr/dao-01" element={withSuspense(<DaoLab01GR />)} />
        <Route path="/labs/dao-01/interaction" element={withSuspense(<DaoLab01Interaction />)} />
        <Route path="/labs-gr/dao-01/interaction" element={withSuspense(<DaoLab01InteractionGR />)} />
        <Route path="/labs/dao-02" element={withSuspense(<DaoLab02 />)} />
        <Route path="/labs-gr/dao-02" element={withSuspense(<DaoLab02GR />)} />
        <Route path="/labs/dao-02/interaction" element={withSuspense(<DaoLab02Interaction />)} />
        <Route path="/labs-gr/dao-02/interaction" element={withSuspense(<DaoLab02InteractionGR />)} />
        <Route path="/labs/proof-of-escape" element={withSuspense(<PoELab />)} />
        <Route path="/labs-gr/proof-of-escape" element={withSuspense(<PoELabGR />)} />
        <Route path="/admin" element={withSuspense(<AdminPage />)} />
      </Route>
    </Routes>
  );
}
