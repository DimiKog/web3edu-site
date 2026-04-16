import React, { lazy } from "react";

import AppEN from "../pages/appEN.jsx";
import AppGR from "../pages/appGR.jsx";

// Public pages
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
const Projects = lazy(() => import("../pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("../pages/ProjectDetail.jsx"));
const DaoPreview = lazy(() => import("../pages/dao-preview/DaoPreview.jsx"));
const DaoPreviewGR = lazy(() => import("../pages/dao-preview/DaoPreviewGR.jsx"));
const DaoGovernance = lazy(() => import("../pages/dao-preview/DaoGovernance.jsx"));
const DaoGovernanceGR = lazy(() => import("../pages/dao-preview/DaoGovernanceGR.jsx"));
const GenesisEvent = lazy(() => import("../pages/events/GenesisEvent.jsx"));
const Tools = lazy(() => import("../pages/Tools.jsx"));
const MiningLab = lazy(() => import("../pages/MiningLab.jsx"));
const PoSVisualizer = lazy(() => import("../pages/tools/PoSVisualizer.jsx"));

// Web3 pages
const Join = lazy(() => import("../pages/Join.jsx"));
const JoinGR = lazy(() => import("../pages/JoinGR.jsx"));
const MintIdentity = lazy(() => import("../pages/MintIdentity.jsx"));
const WelcomeIdentity = lazy(() => import("../pages/WelcomeIdentity.jsx"));
const WelcomeIdentityGR = lazy(() => import("../pages/WelcomeIdentityGR.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const DashboardGR = lazy(() => import("../pages/DashboardGR.jsx"));
const SbtView = lazy(() => import("../pages/SbtView.jsx"));
const SbtViewGR = lazy(() => import("../pages/SbtViewGR.jsx"));
const VerifyIdentity = lazy(() => import("../pages/VerifyIdentity.jsx"));
const VerifyIdentityGR = lazy(() => import("../pages/VerifyIdentityGR.jsx"));
const Labs = lazy(() => import("../pages/Labs.jsx"));
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
const CodingLab1 = lazy(() => import("../pages/labs/CodingLab1.jsx"));
const CodingLabInteraction1 = lazy(() => import("../pages/labs/CodingLabInteraction1.jsx"));
const SystemLabS0 = lazy(() => import("../pages/labs/SystemLabS0.jsx"));
const SystemLabS0Interaction = lazy(() => import("../pages/labs/SystemLabS0Interaction.jsx"));
const SystemLabS1 = lazy(() => import("../pages/labs/SystemLabS1.jsx"));
const SystemLabS1Interaction = lazy(() => import("../pages/labs/SystemLabS1Interaction.jsx"));
const SystemLabS2 = lazy(() => import("../pages/labs/SystemLabS2.jsx"));
const SystemLabS2Interaction = lazy(() => import("../pages/labs/SystemLabS2Interaction.jsx"));
const SystemLabS3 = lazy(() => import("../pages/labs/SystemLabS3.jsx"));
const SystemLabS3Interaction = lazy(() => import("../pages/labs/SystemLabS3Interaction.jsx"));
const SystemLabS4 = lazy(() => import("../pages/labs/SystemLabS4.jsx"));
const SystemLabS4Interaction = lazy(() => import("../pages/labs/SystemLabS4Interaction.jsx"));
const SystemLabS5 = lazy(() => import("../pages/labs/SystemLabS5.jsx"));
const SystemLabS5Interaction = lazy(() => import("../pages/labs/SystemLabS5Interaction.jsx"));
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

// Admin pages
const AdminDashboard = lazy(() => import("../pages/AdminDashboard.jsx"));
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout.jsx"));
const AdminLabsPage = lazy(() => import("../pages/admin/AdminLabsPage.jsx"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage.jsx"));
const AdminUserDetailsPage = lazy(() => import("../pages/admin/AdminUserDetailsPage.jsx"));
const AdminLabDetails = lazy(() => import("../pages/admin/AdminLabDetails.jsx"));

// Layouts
const Web3Layout = lazy(() => import("./Web3Layout.jsx"));

/**
 * Route definitions. All URLs are preserved.
 *
 * Each entry is one of:
 * - { path, element }
 * - { paths: [..], element }
 * - { path, component, props }
 * - { paths: [..], component, propsByPath }
 */
export const routeTable = {
  public: [
    { path: "/", element: <AppEN /> },
    { path: "/gr", element: <AppGR /> },
    { path: "/poe", component: Poe },
    { path: "/poe-gr", component: PoeGR },
    { path: "/education", component: Education },
    { path: "/education-gr", component: EducationGR },
    { path: "/education/network-check", component: NetworkCheck },
    { path: "/education/network-check-gr", component: NetworkCheckGR },
    { path: "/network-check", component: NetworkCheckStandalone },
    { path: "/network-check-gr", component: NetworkCheckStandaloneGR },
    { path: "/team", component: TeamPageEN },
    { path: "/team-gr", component: TeamPageGR },
    { path: "/start-here", component: StartHere },
    { path: "/start-here-gr", component: StartHereGR },

    // Example of bilingual single-component route variant:
    // same component, two paths, GR uses lang prop.
    { paths: ["/projects", "/projects-gr"], component: Projects },
    {
      paths: ["/projects/:id", "/projects-gr/:id"],
      component: ProjectDetail,
    },

    { path: "/dao-preview", component: DaoPreview },
    { path: "/dao-preview-gr", component: DaoPreviewGR },
    { path: "/dao-info", component: DaoGovernance },
    { path: "/dao-governance", component: DaoGovernance },
    { path: "/dao-info-gr", component: DaoGovernanceGR },

    { paths: ["/events/genesis", "/events/genesis-gr", "/events-gr/genesis"], component: GenesisEvent },

    { path: "/tools", component: Tools },
    { path: "/tools-gr", component: Tools, props: { lang: "gr" } },
    { path: "/tools/mining", component: MiningLab },
    { path: "/tools-gr/mining", component: MiningLab, props: { lang: "gr" } },
    { path: "/tools/pos", component: PoSVisualizer },
    { path: "/tools-gr/pos", component: PoSVisualizer, props: { lang: "gr" } },
  ],

  web3: {
    layout: Web3Layout,
    routes: [
      { path: "/join", component: Join },
      { path: "/join-gr", component: JoinGR },
      { path: "/mint-identity", component: MintIdentity },
      { path: "/mint-identity-gr", component: MintIdentity, props: { lang: "gr" } },
      { path: "/welcome", component: WelcomeIdentity },
      { path: "/welcome-gr", component: WelcomeIdentityGR },
      { path: "/dashboard", component: Dashboard },
      { path: "/dashboard-gr", component: DashboardGR },
      { path: "/sbt-view", component: SbtView },
      { path: "/sbt-view-gr", component: SbtViewGR },
      { path: "/verify/:address", component: VerifyIdentity },
      { path: "/verify-gr/:address", component: VerifyIdentityGR },
      { path: "/labs", component: Labs },
      { path: "/labs-gr", component: Labs, props: { lang: "gr" } },
      { path: "/labs/wallets-keys", component: Lab01 },
      { path: "/labs-gr/wallets-keys", component: Lab01GR },
      { path: "/labs/lab02", component: Lab02 },
      { path: "/labs-gr/lab02", component: Lab02GR },
      { path: "/labs/wallets-keys/interaction", component: Lab01Interaction },
      { path: "/labs-gr/wallets-keys/interaction", component: Lab01InteractionGR },
      { path: "/labs/lab02/interaction", component: Lab02Interaction },
      { path: "/labs-gr/lab02/interaction", component: Lab02InteractionGR },
      { path: "/labs/lab03", component: Lab03 },
      { path: "/labs-gr/lab03", component: Lab03GR },
      { path: "/labs/lab03/interaction", component: Lab03Interaction },
      { path: "/labs-gr/lab03/interaction", component: Lab03InteractionGR },
      { path: "/labs/lab04", component: Lab04 },
      { path: "/labs-gr/lab04", component: Lab04GR },
      { path: "/labs/lab04/interaction", component: Lab04Interaction },
      { path: "/labs-gr/lab04/interaction", component: Lab04InteractionGR },
      { path: "/labs/lab05", component: Lab05 },
      { path: "/labs-gr/lab05", component: Lab05GR },
      { path: "/labs/lab05/interaction", component: Lab05Interaction },
      { path: "/labs-gr/lab05/interaction", component: Lab05InteractionGR },
      { path: "/labs/lab06", component: Lab06 },
      { path: "/labs-gr/lab06", component: Lab06GR },
      { path: "/labs/lab06/interaction", component: Lab06Interaction },
      { path: "/labs-gr/lab06/interaction", component: Lab06InteractionGR },
      { path: "/labs/coding-01", component: CodingLab1 },
      { path: "/labs-gr/coding-01", component: CodingLab1, props: { lang: "gr" } },
      { path: "/labs/coding-01/interaction", component: CodingLabInteraction1 },
      { path: "/labs-gr/coding-01/interaction", component: CodingLabInteraction1, props: { lang: "gr" } },
      { path: "/labs/system/s0", component: SystemLabS0 },
      { path: "/labs-gr/system/s0", component: SystemLabS0, props: { lang: "gr" } },
      { path: "/labs/system/s0/interaction", component: SystemLabS0Interaction },
      { path: "/labs-gr/system/s0/interaction", component: SystemLabS0Interaction, props: { lang: "gr" } },
      { path: "/labs/system/s1", component: SystemLabS1 },
      { path: "/labs-gr/system/s1", component: SystemLabS1, props: { lang: "gr" } },
      { path: "/labs/system/s1/interaction", component: SystemLabS1Interaction },
      { path: "/labs-gr/system/s1/interaction", component: SystemLabS1Interaction, props: { lang: "gr" } },
      { path: "/labs/system/s2", component: SystemLabS2 },
      { path: "/labs-gr/system/s2", component: SystemLabS2, props: { lang: "gr" } },
      { path: "/labs/system/s2/interaction", component: SystemLabS2Interaction },
      { path: "/labs-gr/system/s2/interaction", component: SystemLabS2Interaction, props: { lang: "gr" } },
      { path: "/labs/system/s3", component: SystemLabS3 },
      { path: "/labs-gr/system/s3", component: SystemLabS3, props: { lang: "gr" } },
      { path: "/labs/system/s3/interaction", component: SystemLabS3Interaction },
      { path: "/labs-gr/system/s3/interaction", component: SystemLabS3Interaction, props: { lang: "gr" } },
      { path: "/labs/system/s4", component: SystemLabS4 },
      { path: "/labs-gr/system/s4", component: SystemLabS4, props: { lang: "gr" } },
      { path: "/labs/system/s4/interaction", component: SystemLabS4Interaction },
      { path: "/labs-gr/system/s4/interaction", component: SystemLabS4Interaction, props: { lang: "gr" } },
      { path: "/labs/system/s5", component: SystemLabS5 },
      { path: "/labs-gr/system/s5", component: SystemLabS5, props: { lang: "gr" } },
      { path: "/labs/system/s5/interaction", component: SystemLabS5Interaction },
      { path: "/labs-gr/system/s5/interaction", component: SystemLabS5Interaction, props: { lang: "gr" } },
      { path: "/labs/dao-01", component: DaoLab01 },
      { path: "/labs-gr/dao-01", component: DaoLab01GR },
      { path: "/labs/dao-01/interaction", component: DaoLab01Interaction },
      { path: "/labs-gr/dao-01/interaction", component: DaoLab01InteractionGR },
      { path: "/labs/dao-02", component: DaoLab02 },
      { path: "/labs-gr/dao-02", component: DaoLab02GR },
      { path: "/labs/dao-02/interaction", component: DaoLab02Interaction },
      { path: "/labs-gr/dao-02/interaction", component: DaoLab02InteractionGR },
      { path: "/labs/proof-of-escape", component: PoELab },
      { path: "/labs-gr/proof-of-escape", component: PoELabGR },
    ],
  },

  admin: {
    path: "/admin",
    layout: AdminLayout,
    routes: [
      { index: true, component: AdminDashboard },
      { path: "labs", component: AdminLabsPage },
      { path: "users", component: AdminUsersPage },
      { path: "users/:wallet", component: AdminUserDetailsPage },
      { path: "labs/:labId", component: AdminLabDetails },
    ],
  },
};

