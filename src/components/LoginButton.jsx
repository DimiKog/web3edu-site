import { useAuth } from "react-oidc-context";

export default function LoginButton() {
    const auth = useAuth();
    const forceOidcPromptLogin =
        (typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("oidc_prompt") === "login") ||
        import.meta.env.VITE_OIDC_FORCE_PROMPT_LOGIN === "true";

    if (auth.isLoading) {
        return <button disabled>Loading...</button>;
    }

    if (auth.isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={() =>
                auth.signinRedirect(
                    forceOidcPromptLogin ? { extraQueryParams: { prompt: "login" } } : undefined
                )
            }
        >
            Sign in with Web3Edu
        </button>
    );
}