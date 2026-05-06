import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import {
  OIDC_POST_LOGIN_NAV_SESSION_KEY,
  OIDC_RETURN_URL_SESSION_KEY,
  stripOAuthSearchFromUrl,
} from "../auth/oidcConfig.js";

function hasOAuthCallbackQuery() {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  return q.has("code") || q.has("state");
}

/**
 * Runs inside HashRouter after OIDC `onSigninCallback` queues a sessionStorage flag.
 * Performs `navigate(..., { replace: true })` so the hash history listener updates
 * HashRouter state (raw `replaceState` alone does not).
 */
export default function OidcPostLoginNavigate() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(OIDC_POST_LOGIN_NAV_SESSION_KEY) !== "1") return;
    if (auth.isLoading) return;
    if (auth.error) {
      sessionStorage.removeItem(OIDC_POST_LOGIN_NAV_SESSION_KEY);
      return;
    }
    if (!auth.isAuthenticated) return;

    sessionStorage.removeItem(OIDC_POST_LOGIN_NAV_SESSION_KEY);
    if (hasOAuthCallbackQuery()) {
      stripOAuthSearchFromUrl();
    }
    const returnUrl = sessionStorage.getItem(OIDC_RETURN_URL_SESSION_KEY);
    if (returnUrl) sessionStorage.removeItem(OIDC_RETURN_URL_SESSION_KEY);
    const isGr = window.localStorage.getItem("lang") === "gr";
    const dest = returnUrl || (isGr ? "/dashboard-gr" : "/dashboard");
    navigate(dest, { replace: true });
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

  return null;
}
