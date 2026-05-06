const SS_PREFIX = "web3edu-social-progress-import-snooze";

/** @param {string | null | undefined} oidcSub @param {string | null | undefined} walletLower */
export function isProgressImportSnoozed(oidcSub, walletLower) {
  if (typeof window === "undefined" || !walletLower || typeof walletLower !== "string") {
    return false;
  }
  const subPart =
    oidcSub && typeof oidcSub === "string" && oidcSub.trim() ? oidcSub.trim() : "no-sub";
  return window.sessionStorage.getItem(`${SS_PREFIX}:${subPart}:${walletLower.toLowerCase()}`) === "1";
}

/** @param {string | null | undefined} oidcSub @param {string | null | undefined} walletLower */
export function snoozeProgressImport(oidcSub, walletLower) {
  if (typeof window === "undefined" || !walletLower || typeof walletLower !== "string") return;
  const subPart =
    oidcSub && typeof oidcSub === "string" && oidcSub.trim() ? oidcSub.trim() : "no-sub";
  window.sessionStorage.setItem(`${SS_PREFIX}:${subPart}:${walletLower.toLowerCase()}`, "1");
}
