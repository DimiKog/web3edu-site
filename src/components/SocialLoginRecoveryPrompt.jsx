import { useCallback, useReducer } from "react";
import { useAuth } from "react-oidc-context";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { saveReturnUrl } from "../auth/oidcConfig.js";

const SESSION_KEY = "web3edu-dashboard-social-login-recovery-snooze";

function readSnoozed() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

/**
 * Encourages wallet-first / browser-key users to add social login for recovery.
 * Shown only when the parent does not render this for OIDC sessions.
 */
export default function SocialLoginRecoveryPrompt({ variant = "en" }) {
  const auth = useAuth();
  const [, bump] = useReducer((c) => c + 1, 0);
  const isGr = variant === "gr";

  const snoozed = readSnoozed();

  const dismissSession = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    bump();
  }, [bump]);

  if (auth?.isLoading) return null;
  if (auth?.isAuthenticated) return null;
  if (snoozed) return null;

  return (
    <div
      role="region"
      aria-label={
        isGr ? "Πρόταση για κοινωνική είσοδο και ανάκτηση" : "Social login recovery suggestion"
      }
      className="relative z-20 w-full max-w-3xl mx-auto mb-6 rounded-2xl border border-indigo-200/70 dark:border-indigo-500/35
        bg-gradient-to-r from-indigo-50/95 via-violet-50/90 to-cyan-50/85
        dark:from-indigo-950/45 dark:via-violet-950/35 dark:to-slate-900/50
        px-4 py-4 sm:px-5 sm:py-4 shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex shrink-0 justify-center sm:justify-start pt-0.5">
          <ArrowRightOnRectangleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {isGr
              ? "Χρησιμοποίησε social login για ευκολότερη ανάκτηση και πρόσβαση"
              : "Use social login for easier recovery and access"}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
            {isGr
              ? "Η σύνδεση με τον λογαριασμό Web3Edu (Keycloak) σου επιτρέπει να ξαναμπείς στον πίνακα χωρίς να στηρίζεσαι μόνο στο τοπικό κλειδί του browser — ιδανικό αν αλλάζεις συσκευή ή καθαρίζεις δεδομένα."
              : "Signing in with your Web3Edu account (Keycloak) makes it easier to return to your dashboard without relying only on your browser’s local key — especially when you switch devices or clear site data."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { saveReturnUrl(); void auth?.signinRedirect?.(); }}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isGr ? "Είσοδος" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={dismissSession}
              className="text-xs font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-400"
            >
              {isGr ? "Ίσως αργότερα" : "Maybe later"}
            </button>
            <button
              type="button"
              onClick={dismissSession}
              className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-500 sm:ml-1"
            >
              {isGr ? "Συνέχεια χωρίς social login" : "Continue without social login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
