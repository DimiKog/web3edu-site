import { Outlet } from "react-router-dom";

export default function Web3Layout() {
  // Web3Providers and Web3RouteControls are now at root level in main.jsx
  return <Outlet />;
}
