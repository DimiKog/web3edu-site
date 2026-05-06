import { Outlet } from "react-router-dom";
import IdentityAaRestore from "../components/IdentityAaRestore.jsx";

export default function Web3Layout() {
  return (
    <>
      <IdentityAaRestore />
      <Outlet />
    </>
  );
}
