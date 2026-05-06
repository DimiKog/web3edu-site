import { useAuth } from "react-oidc-context";

export default function UserInfo() {
    const auth = useAuth();

    if (!auth.isAuthenticated) return null;

    return (
        <div>
            <p>Logged in as: {auth.user?.profile?.preferred_username}</p>
            <p>Email: {auth.user?.profile?.email}</p>
        </div>
    );
}