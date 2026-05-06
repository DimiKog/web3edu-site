import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { HashRouter } from "react-router-dom";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import { IdentityProvider } from "./context/IdentityContext.jsx";
import { ResolvedIdentityProvider } from "./context/ResolvedIdentityProvider.jsx";
import Web3Providers from "./providers/Web3Providers.jsx";
import {
  createOidcConfig,
  queuePostLoginRouterNavigation,
  stripOAuthSearchFromUrl,
} from "./auth/oidcConfig.js";
import { SocialIdentityProvider } from "./context/SocialIdentityContext.jsx";
import OidcPostLoginNavigate from "./components/OidcPostLoginNavigate.jsx";

/**
 * After `userManager.signinCallback()` (react-oidc-context): strip OAuth query params
 * from the address bar, and queue a router navigation handled inside HashRouter
 * (`OidcPostLoginNavigate`) so HashRouter state updates (raw `replaceState` to change
 * the hash does not notify the hash history listener).
 */
function onSigninCallback() {
  queuePostLoginRouterNavigation();
  stripOAuthSearchFromUrl();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...createOidcConfig()} onSigninCallback={onSigninCallback}>
      <AppErrorBoundary>
        <Web3Providers>
          <SocialIdentityProvider>
            <IdentityProvider>
              <ResolvedIdentityProvider>
                <HashRouter>
                  <OidcPostLoginNavigate />
                  <ScrollToTop />
                  <AppRoutes />
                </HashRouter>
              </ResolvedIdentityProvider>
            </IdentityProvider>
          </SocialIdentityProvider>
        </Web3Providers>
      </AppErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);
