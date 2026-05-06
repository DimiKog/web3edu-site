import React from "react";

/**
 * One-time style onboarding for social-login users: clarify wallet history vs new account.
 * @param {{ isGr?: boolean, isPending?: boolean, onYesConnectWallet: () => void | Promise<void>, onNoContinue: () => void, onLater?: () => void }} props
 */
export default function SocialWalletHistoryPrompt({
  isGr = false,
  isPending = false,
  onYesConnectWallet,
  onNoContinue,
  onLater,
}) {
  return (
    <div
      className="relative z-10 mx-auto mb-6 mt-2 w-full max-w-5xl rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50/95 via-white/90 to-cyan-50/80 px-4 py-4 text-left shadow-md backdrop-blur-sm dark:border-violet-500/35 dark:from-violet-950/40 dark:via-slate-900/50 dark:to-indigo-950/35 dark:text-slate-100 md:px-5"
      role="region"
      aria-label={isGr ? "Ερώτηση για προηγούμενη χρήση με πορτοφόλι" : "Question about previous wallet use"}
    >
      <p className="text-base font-semibold text-slate-900 dark:text-white">
        {isGr
          ? "Έχεις ξαναχρησιμοποιήσει το Web3Edu με πορτοφόλι (wallet);"
          : "Have you used Web3Edu before with a wallet?"}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {isGr
          ? "Βοηθάει να ξέρουμε αν θέλεις να συνδέσεις υπάρχον ιστορικό από πορτοφόλι. Ο πίνακας παραμένει στην τρέχουσα κοινωνική AA ταυτότητά σου μέχρι να ολοκληρωθεί επίσημα το linking."
          : "This helps us know if you want to connect existing wallet-based progress. Your dashboard stays on your current social AA identity until official linking is available."}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={isPending}
          onClick={() => void onYesConnectWallet()}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? isGr
              ? "Σύνδεση…"
              : "Connecting…"
            : isGr
              ? "Ναι, σύνδεση πορτοφολιού"
              : "Yes, connect wallet"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onNoContinue}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-xl border border-slate-300/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600/60 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {isGr ? "Όχι, συνέχεια" : "No, continue"}
        </button>
        {typeof onLater === "function" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={onLater}
            className="text-xs font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300 sm:ml-1"
          >
            {isGr ? "Αργότερα" : "Later"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
