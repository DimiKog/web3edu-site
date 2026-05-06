import { useAuth } from "react-oidc-context";

export default function LoginButton() {
    const auth = useAuth();

    if (auth.isLoading) {
        return <button disabled>Loading...</button>;
    }

    if (auth.isAuthenticated) {
        return null;
    }

    return (
        <button onClick={() => auth.signinRedirect()}>
            Sign in with Web3Edu
        </button>
    );
}