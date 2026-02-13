import { Outlet } from "react-router-dom";
import Web3Providers from "../providers/Web3Providers.jsx";
import Web3RouteControls from "./Web3RouteControls.jsx";

export default function Web3Layout() {
  return (
    <Web3Providers>
      <Web3RouteControls />
      <Outlet />
    </Web3Providers>
  );
}
