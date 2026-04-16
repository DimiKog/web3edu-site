import { useCallback, useMemo, useState } from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { useIdentity } from "../context/IdentityContext.jsx";
import { exportIdentity } from "../utils/identityExport.js";

const STORAGE_KEY = "web3edu-identity-backup-banner-dismissed";

/**
 * Dismissible reminder: AA / walletless identity is anchored to the local owner key.
 * Clearing storage without a backup locks the user out of their smart account.
 */
export default function IdentityBackupBanner({ variant = "en" }) {
  const { hasIdentity, smartAccount } = useIdentity();
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true"
  );

  const shouldShow = useMemo(() => {
    if (dismissed) return false;
    return Boolean(hasIdentity || smartAccount);
  }, [dismissed, hasIdentity, smartAccount]);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }, []);

  const handleExport = useCallback(() => {
    const payload = exportIdentity();
    const isGr = variant === "gr";
    if (!payload) {
      alert(isGr ? "Δεν βρέθηκε κλειδί για εξαγωγή." : "No identity key found to export.");
      return;
    }
    navigator.clipboard.writeText(payload).then(
      () => {
        alert(
          isGr
            ? "Το αντίγραφο ασφαλείας αντιγράφηκε στο πρόχειρο. Φύλαξέ το offline — χωρίς αυτό δεν μπορείς να επαναφέρεις την ταυτότητά σου σε νέο browser ή συσκευή."
            : "Backup copied to clipboard. Store it offline — without it you cannot restore this identity on a new browser or device."
        );
      },
      () => {
        alert(isGr ? "Αποτυχία αντιγραφής." : "Could not copy to clipboard.");
      }
    );
  }, [variant]);

  if (!shouldShow) return null;

  const isGr = variant === "gr";
  const joinHref = isGr ? "/#/join-gr" : "/#/join";

  return (
    <div
      role="region"
      aria-label={isGr ? "Υπενθύμιση αντιγράφου ασφαλείας ταυτότητας" : "Identity backup reminder"}
      className="
        relative z-20 w-full max-w-3xl mx-auto mb-8 rounded-2xl border border-amber-300/60 dark:border-amber-700/40
        bg-gradient-to-r from-amber-50/95 via-orange-50/80 to-amber-50/95
        dark:from-amber-950/40 dark:via-orange-950/35 dark:to-amber-950/40
        px-4 py-4 sm:px-5 sm:py-4 shadow-md
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-shrink-0 flex justify-center sm:justify-start pt-0.5">
          <ShieldExclamationIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
            {isGr ? "Φύλαξε το κλειδί της ταυτότητάς σου" : "Back up your identity key"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-amber-900/90 dark:text-amber-100/85 leading-relaxed">
            {isGr
              ? "Η ταυτότητα Web3Edu (smart account) δένεται με το ιδιωτικό κλειδί που φυλάσσεται μόνο σε αυτό το πρόγραμμα περιήγησης. Αν καθαρίσεις τα δεδομένα του site ή αλλάξεις συσκευή χωρίς εξαγωγή, χάνεις την πρόσβαση — δεν υπάρχει κεντρική ανάκτηση κωδικού."
              : "Your Web3Edu identity (smart account) is tied to a private key stored only in this browser. If you clear site data or switch devices without exporting it, you lose access — there is no central password reset."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="
                inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold
                bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500
                transition-colors
              "
            >
              {isGr ? "Εξαγωγή αντιγράφου ασφαλείας" : "Export backup now"}
            </button>
            <a
              href={joinHref}
              className="
                inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium
                border border-amber-700/30 dark:border-amber-500/40 text-amber-950 dark:text-amber-100
                hover:bg-amber-100/80 dark:hover:bg-amber-900/40 transition-colors
              "
            >
              {isGr ? "Επαναφορά σε άλλη συσκευή (Join)" : "Restore on another device (Join)"}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs font-medium text-amber-800/80 dark:text-amber-200/80 hover:text-amber-950 dark:hover:text-amber-50 underline-offset-2 hover:underline ml-auto sm:ml-0"
            >
              {isGr ? "Το κατάλαβα, απόκρυψη" : "Got it, hide"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
