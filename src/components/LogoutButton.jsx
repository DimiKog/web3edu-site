import { useAuth } from "react-oidc-context";
import { createOidcConfig } from "../auth/oidcConfig.js";
import { useAccount, useDisconnect } from "wagmi";
import { useIdentity } from "../context/useIdentity.js";
import { setNeutralAfterLogout } from "../utils/viewerMode.js";

export default function LogoutButton() {
    const auth = useAuth();
    const { isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const { disconnectIdentity } = useIdentity();

    if (!auth.isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={async () => {
                // Keep all logout entry points consistent: clear AA/local identity + best-effort wallet disconnect,
                // then OIDC sign-out redirect back to Join.
                try {
                    if (isConnected) {
                        try {
                            await disconnectAsync();
                        } catch {
                            /* ignore wagmi disconnect errors */
                        }
                    }
                    disconnectIdentity();
                } catch {
                    /* ignore cleanup errors */
                }
                const cfg = createOidcConfig();
                setNeutralAfterLogout();
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