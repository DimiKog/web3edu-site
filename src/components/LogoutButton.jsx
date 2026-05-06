import { useAuth } from "react-oidc-context";
import { createOidcConfig } from "../auth/oidcConfig.js";

export default function LogoutButton() {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={() => {
                const cfg = createOidcConfig();
                return auth.signoutRedirect({
                    id_token_hint: auth?.user?.id_token,
                    post_logout_redirect_uri: cfg.post_logout_redirect_uri,
                    extraQueryParams: { client_id: cfg.client_id },
                });
            }}
        >
            Sign out
        </button>
    );
}