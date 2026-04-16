import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import { IdentityProvider } from "./context/IdentityContext.jsx";
import { ResolvedIdentityProvider } from "./context/ResolvedIdentityProvider.jsx";
import Web3Providers from "./providers/Web3Providers.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Web3Providers>
        <IdentityProvider>
          <ResolvedIdentityProvider>
            <HashRouter>
              <ScrollToTop />
              <AppRoutes />
            </HashRouter>
          </ResolvedIdentityProvider>
        </IdentityProvider>
      </Web3Providers>
    </AppErrorBoundary>
  </React.StrictMode>
);
