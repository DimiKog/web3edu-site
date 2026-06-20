import { useAuth } from "react-oidc-context";
import UserInfo from "../components/UserInfo.jsx";
import { signOutKeycloakAccount } from "../auth/keycloakSignOut.js";

export default function OidcTestPage() {
  const auth = useAuth();

  return (
    <div className="min-h-screen px-6 py-16 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight">OIDC Test</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Temporary page for validating Keycloak OIDC integration in isolation.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => auth.signinRedirect()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Sign in with Web3Edu
            </button>

            {auth.isAuthenticated && (
              <button
                type="button"
                onClick={() => void signOutKeycloakAccount(auth)}
                className="rounded-xl border border-slate-300/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Sign out
              </button>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-950/30">
            <p>isLoading: {String(auth.isLoading)}</p>
            <p>isAuthenticated: {String(auth.isAuthenticated)}</p>
            {auth.error && <p>Auth error: {auth.error.message}</p>}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-950/30">
            <UserInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

