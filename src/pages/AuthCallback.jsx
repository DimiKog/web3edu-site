import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import { stripOAuthSearchFromUrl } from "../auth/oidcConfig.js";

function hasOAuthCallbackQuery() {
    if (typeof window === "undefined") return false;
    const q = new URLSearchParams(window.location.search);
    return q.has("code") || q.has("state");
}

/**
 * HashRouter route `#/auth/callback`.
 * The OAuth `code` / `state` query lives on `window.location.search` (before `#`),
 * not inside the hash. `react-oidc-context` completes the callback on the app root
 * when `redirect_uri` is the origin + `/` (see `createOidcConfig`).
 *
 * This page mainly handles post-login navigation if the user lands here with an
 * already-completed session, or shows errors while the provider finishes processing.
 */
export default function AuthCallback() {
    const auth = useAuth();
    const waitingOnOAuthQuery = hasOAuthCallbackQuery();

    // If something navigated here with tokens still in `search`, strip them once auth is ready.
    // Route change uses `<Navigate>` below (real HashRouter navigation); only strip the query here.
    useEffect(() => {
        if (!auth.isAuthenticated || auth.isLoading) return;
        if (!hasOAuthCallbackQuery()) return;
        stripOAuthSearchFromUrl();
    }, [auth.isAuthenticated, auth.isLoading]);

    if (auth.isLoading || (waitingOnOAuthQuery && !auth.error)) {
        return (
            <div className="min-h-[40vh] px-6 py-16 text-center text-slate-800 dark:text-slate-100">
                <p className="text-sm font-medium">Completing sign-in…</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    If this hangs, confirm Keycloak allows redirect URI{" "}
                    <code className="rounded bg-slate-200/80 px-1 py-0.5 text-[11px] dark:bg-slate-800">
                        {typeof window !== "undefined" ? `${window.location.origin}/` : ""}
                    </code>
                </p>
            </div>
        );
    }

    if (auth.error) {
        return (
            <div className="min-h-[40vh] px-6 py-16 text-center text-red-800 dark:text-red-200">
                <p className="font-semibold">Authentication error</p>
                <p className="mt-2 text-sm">{auth.error.message}</p>
            </div>
        );
    }

    if (auth.isAuthenticated) {
        const lang =
            typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
        const to = lang === "gr" ? "/dashboard-gr" : "/dashboard";
        return <Navigate to={to} replace />;
    }

    return (
        <div className="min-h-[40vh] px-6 py-16 text-center text-slate-800 dark:text-slate-100">
            <p className="text-sm">Signing you in…</p>
        </div>
    );
}
