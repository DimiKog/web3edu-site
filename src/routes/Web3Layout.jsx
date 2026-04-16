import { Outlet } from "react-router-dom";
import Web3RouteControls from "./Web3RouteControls.jsx";
import IdentityAaRestore from "../components/IdentityAaRestore.jsx";

export default function Web3Layout() {
  return (
    <>
      <IdentityAaRestore />
      <Web3RouteControls />
      <Outlet />
    </>
  );
}
