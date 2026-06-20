import { useAuth } from "react-oidc-context";
import { useAccount, useDisconnect } from "wagmi";
import { useIdentity } from "../context/useIdentity.js";
import { signOutKeycloakAccount } from "../auth/keycloakSignOut.js";

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
                return signOutKeycloakAccount(auth);
            }}
        >
            Sign out
        </button>
    );
}