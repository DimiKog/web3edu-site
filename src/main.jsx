import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import Web3Providers from "./providers/Web3Providers.jsx";
import Web3RouteControls from "./routes/Web3RouteControls.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Web3Providers>
        <HashRouter>
          <ScrollToTop />
          <Web3RouteControls />
          <AppRoutes />
        </HashRouter>
      </Web3Providers>
    </AppErrorBoundary>
  </React.StrictMode>
);
