import { Outlet } from "react-router-dom";
import IdentityAaRestore from "../components/IdentityAaRestore.jsx";
import Web3Providers from "../providers/Web3Providers.jsx";
import { IdentityProvider } from "../context/IdentityContext.jsx";
import { ResolvedIdentityProvider } from "../context/ResolvedIdentityProvider.jsx";

/**
 * Application / Web3-capable route boundary.
 * Mounts wagmi + identity providers only for routes under this layout.
 */
export default function Web3Layout() {
  return (
    <Web3Providers>
      <IdentityProvider>
        <ResolvedIdentityProvider>
          <IdentityAaRestore />
          <Outlet />
        </ResolvedIdentityProvider>
      </IdentityProvider>
    </Web3Providers>
  );
}
