import { useAuth } from "react-oidc-context";

export default function LogoutButton() {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return null;
    }

    return (
        <button onClick={() => auth.signoutRedirect()}>
            Sign out
        </button>
    );
}