import { useCallback, useEffect, useState } from "react";
import { importSocialProgress } from "../api/socialIdentity.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

function classifyImportError(err) {
  const p = err?.payload && typeof err.payload === "object" ? err.payload : {};
  const raw = String(p.error ?? p.code ?? p.reason ?? err?.message ?? "").toLowerCase();
  if (raw.includes("already_imported")) return "already_imported";
  if (raw.includes("target_has_progress")) return "target_has_progress";
  if (raw.includes("source_not_authorized")) return "source_not_authorized";
  return "generic";
}

/**
 * Progress import offer for social AA + guest connected wallet (inside amber guest-wallet card).
 */
export default function SocialWalletProgressImportSection({
  isGr = false,
  idToken,
  connectedAddress,
  onSnooze,
  onRefetch,
  resolveSocialIdentity,
}) {
  const [phase, setPhase] = useState("offer");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setPhase("offer");
    setHidden(false);
  }, [connectedAddress, idToken]);

  const handleSnooze = useCallback(() => {
    onSnooze?.();
  }, [onSnooze]);

  const finishAndHide = useCallback(() => {
    setHidden(true);
  }, []);

  const handleImport = useCallback(async () => {
    if (!idToken || !connectedAddress) return;
    const sourceOwner = normalizeEvmAddress(connectedAddress);
    if (!sourceOwner) return;

    setPhase("loading");
    try {
      await importSocialProgress(idToken, { sourceOwner });
      await onRefetch?.();
      if (typeof resolveSocialIdentity === "function") {
        try {
          await resolveSocialIdentity();
        } catch {
          /* optional */
        }
      }
      setPhase("success");
      window.setTimeout(() => {
        finishAndHide();
      }, 4500);
    } catch (err) {
      const kind = classifyImportError(err);
      if (kind === "already_imported") {
        await onRefetch?.();
        try {
          await resolveSocialIdentity?.();
        } catch {
          /* ignore */
        }
        setPhase("already_imported");
        window.setTimeout(() => finishAndHide(), 4500);
        return;
      }
      if (kind === "target_has_progress") {
        setPhase("err_target");
        return;
      }
      if (kind === "source_not_authorized") {
        setPhase("err_auth");
        return;
      }
      setPhase("err_generic");
    }
  }, [idToken, connectedAddress, onRefetch, resolveSocialIdentity, finishAndHide]);

  if (hidden) return null;

  if (phase === "success") {
    return (
      <div
        className="mt-4 rounded-xl border border-emerald-300/70 bg-emerald-50/95 px-3 py-3 text-xs text-emerald-950 dark:border-emerald-600/40 dark:bg-emerald-950/35 dark:text-emerald-50"
        role="status"
      >
        {isGr
          ? "Η εισαγωγή προόδου ολοκληρώθηκε. Ο πίνακας ενημερώνεται με τα νέα δεδομένα."
          : "Progress import completed. Your dashboard data is being refreshed."}
      </div>
    );
  }

  if (phase === "already_imported") {
    return (
      <div
        className="mt-4 rounded-xl border border-sky-300/70 bg-sky-50/95 px-3 py-3 text-xs text-sky-950 dark:border-sky-600/40 dark:bg-sky-950/35 dark:text-sky-50"
        role="status"
      >
        {isGr
          ? "Η πρόοδος από αυτό το πορτοφόλι έχει ήδη εισαχθεί. Τα δεδομένα ενημερώθηκαν."
          : "Progress from this wallet was already imported. Data is up to date."}
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-amber-300/50 pt-4 dark:border-amber-600/30">
      {(phase === "offer" || phase === "loading") && (
        <>
          <p className="text-sm font-semibold text-amber-950 dark:text-amber-50">
            {isGr
              ? "Βρήκαμε πιθανή προηγούμενη πρόοδο στο συνδεδεμένο πορτοφόλι σου."
              : "We found previous progress on your connected wallet."}
          </p>
          <p className="mt-1 text-xs text-amber-900/95 dark:text-amber-100/90">
            {isGr
              ? "Θέλεις να την εισάγεις στην τρέχουσα Web3Edu ταυτότητά σου (social AA);"
              : "Do you want to import it into your current Web3Edu identity?"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={phase === "loading"}
              onClick={() => void handleImport()}
              className="inline-flex min-h-[2.25rem] items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {phase === "loading"
                ? isGr
                  ? "Γίνεται εισαγωγή…"
                  : "Importing…"
                : isGr
                  ? "Εισαγωγή προόδου"
                  : "Import progress"}
            </button>
            <button
              type="button"
              disabled={phase === "loading"}
              onClick={handleSnooze}
              className="text-xs font-medium text-amber-900 underline-offset-2 hover:underline dark:text-amber-100"
            >
              {isGr ? "Όχι τώρα" : "Not now"}
            </button>
          </div>
        </>
      )}

      {phase === "err_target" && (
        <div className="rounded-xl border border-amber-400/60 bg-amber-100/80 px-3 py-2 text-xs text-amber-950 dark:bg-amber-950/40 dark:text-amber-50">
          <p className="font-medium">
            {isGr
              ? "Αυτή η ταυτότητα έχει ήδη πρόοδο — η εισαγωγή δεν είναι διαθέσιμη."
              : "This identity already has progress, so import is not available."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase("offer")}
              className="rounded-lg border border-amber-700/30 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-200/60 dark:border-amber-400/30 dark:text-amber-50 dark:hover:bg-amber-900/40"
            >
              {isGr ? "Δοκίμασε ξανά" : "Retry"}
            </button>
            <button type="button" onClick={handleSnooze} className="text-xs font-medium underline">
              {isGr ? "Κλείσιμο" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {phase === "err_auth" && (
        <div className="rounded-xl border border-red-300/70 bg-red-50/90 px-3 py-2 text-xs text-red-950 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-100">
          <p className="font-medium">
            {isGr
              ? "Δεν επιτρέπεται η εισαγωγή από αυτό το πορτοφόλι (μη εξουσιοδοτημένη πηγή)."
              : "This wallet is not authorized as the import source."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase("offer")}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold hover:bg-red-100/80 dark:hover:bg-red-900/30"
            >
              {isGr ? "Δοκίμασε ξανά" : "Retry"}
            </button>
            <button type="button" onClick={handleSnooze} className="text-xs font-medium underline">
              {isGr ? "Κλείσιμο" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {phase === "err_generic" && (
        <div className="rounded-xl border border-red-300/70 bg-red-50/90 px-3 py-2 text-xs text-red-950 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-100">
          <p className="font-medium">
            {isGr
              ? "Η εισαγωγή απέτυχε. Έλεγξε τη σύνδεση και δοκίμασε ξανά."
              : "Import failed. Check your connection and try again."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase("offer")}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold hover:bg-red-100/80 dark:hover:bg-red-900/30"
            >
              {isGr ? "Δοκίμασε ξανά" : "Retry"}
            </button>
            <button type="button" onClick={handleSnooze} className="text-xs font-medium underline">
              {isGr ? "Όχι τώρα" : "Not now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
