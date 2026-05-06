/**
 * OIDC settings for Keycloak + HashRouter.
 *
 * redirect_uri must NOT put OAuth `code` / `state` in the hash fragment. IdPs append
 * `?code=...&state=...` to the redirect URI base; a hash in redirect_uri is unreliable
 * and breaks signinRedirectCallback matching (you end up with `/?code=...#/...` and no tokens).
 *
 * Register in Keycloak (client → Valid redirect URIs) exactly:
 *   - Dev:  http://localhost:5173/
 *   - Prod: https://<your-app-origin>/
 *
 * Post-logout returns users to the visible Join entry (`#/join`).
 */
const STATIC = {
    authority: "https://auth.dimikog.org/realms/web3edu",
    client_id: "web3edu-frontend",
    response_type: "code",
    scope: "openid profile email",
    automaticSilentRenew: true,
    loadUserInfo: true,
};

export function createOidcConfig() {
    const origin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
    const redirectFromEnv = import.meta.env.VITE_OIDC_REDIRECT_URI;
    const postLogoutFromEnv = import.meta.env.VITE_OIDC_POST_LOGOUT_URI;

    return {
        ...STATIC,
        redirect_uri: redirectFromEnv || `${origin}/`,
        post_logout_redirect_uri: postLogoutFromEnv || `${origin}/#/join`,
    };
}

/** Set in `onSigninCallback`; consumed by `OidcPostLoginNavigate` inside HashRouter. */
export const OIDC_POST_LOGIN_NAV_SESSION_KEY = "web3edu-oidc-pending-post-login-nav";

/** Hash-route to return to after login (e.g. "/labs/system-01"). Skipped for join/root. */
export const OIDC_RETURN_URL_SESSION_KEY = "web3edu-oidc-return-url";

/**
 * Persists the current in-app route before `signinRedirect()` so `OidcPostLoginNavigate`
 * can restore it after the OAuth callback. Pass an explicit path to override auto-detection.
 */
export function saveReturnUrl(explicitPath) {
  if (typeof window === "undefined") return;
  let explicitRoute = null;
  if (typeof explicitPath === "string") {
    explicitRoute = explicitPath;
  } else if (explicitPath && typeof explicitPath === "object") {
    const maybePathname = typeof explicitPath.pathname === "string" ? explicitPath.pathname : "";
    const maybeSearch = typeof explicitPath.search === "string" ? explicitPath.search : "";
    const maybeHash = typeof explicitPath.hash === "string" ? explicitPath.hash : "";
    const joined = `${maybePathname}${maybeSearch}${maybeHash}`;
    explicitRoute = joined || null;
  }

  const route =
    explicitRoute ??
    (window.location.hash.startsWith("#") ? window.location.hash.slice(1) : null);
  if (!route || route === "/" || route === "/join" || route === "/join-gr") return;
  sessionStorage.setItem(OIDC_RETURN_URL_SESSION_KEY, route);
}

export function queuePostLoginRouterNavigation() {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(OIDC_POST_LOGIN_NAV_SESSION_KEY, "1");
}

/**
 * Removes OAuth `code` / `state` from `window.location.search` without touching the
 * hash. Uses a full absolute URL so the query string is actually cleared (fragment-only
 * `replaceState` would leave `?code=` on the bar).
 *
 * Does not update React Router — in-app route changes must use `navigate()` from a
 * component under HashRouter (see `OidcPostLoginNavigate.jsx`).
 */
export function stripOAuthSearchFromUrl() {
    if (typeof window === "undefined") return;
    const { origin, pathname, hash } = window.location;
    window.history.replaceState({}, document.title, `${origin}${pathname}${hash || ""}`);
}
