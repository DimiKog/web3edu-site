import { createOidcConfig } from "./oidcConfig.js";
import { setNeutralAfterLogout } from "../utils/viewerMode.js";

/**
 * Keycloak-only sign out: enter neutral viewer mode so wallet/device profiles
 * are not silently treated as the same user after OIDC logout.
 * Does not disconnect the browser wallet or clear local identity storage.
 */
export async function signOutKeycloakAccount(auth) {
  if (!auth?.isAuthenticated) return false;
  setNeutralAfterLogout();
  const cfg = createOidcConfig();
  await auth.signoutRedirect({
    id_token_hint: auth?.user?.id_token,
    post_logout_redirect_uri: cfg.post_logout_redirect_uri,
    extraQueryParams: { client_id: cfg.client_id },
  });
  return true;
}
