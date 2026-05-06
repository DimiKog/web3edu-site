const LS_KEY_PREFIX = "web3edu-social-wallet-history-prompt";
const SS_SNOOZE_PREFIX = "web3edu-social-wallet-history-prompt:snooze";

/** @param {string | null | undefined} sub */
export function getSocialWalletOnboardingLocalChoice(sub) {
  if (typeof window === "undefined" || !sub || typeof sub !== "string") return null;
  const raw = window.localStorage.getItem(`${LS_KEY_PREFIX}:${sub}`);
  return raw === "no" || raw === "yes" ? raw : null;
}

/** @param {string | null | undefined} sub */
export function setSocialWalletOnboardingNoContinue(sub) {
  if (typeof window === "undefined" || !sub || typeof sub !== "string") return;
  window.localStorage.setItem(`${LS_KEY_PREFIX}:${sub}`, "no");
}

/** After user chose to connect a wallet (recovery path); do not re-show the question. */
export function setSocialWalletOnboardingYesWallet(sub) {
  if (typeof window === "undefined" || !sub || typeof sub !== "string") return;
  window.localStorage.setItem(`${LS_KEY_PREFIX}:${sub}`, "yes");
}

/** @param {string | null | undefined} sub */
export function isSocialWalletOnboardingSnoozed(sub) {
  if (typeof window === "undefined" || !sub || typeof sub !== "string") return false;
  return window.sessionStorage.getItem(`${SS_SNOOZE_PREFIX}:${sub}`) === "1";
}

/** @param {string | null | undefined} sub */
export function setSocialWalletOnboardingSnoozeSession(sub) {
  if (typeof window === "undefined" || !sub || typeof sub !== "string") return;
  window.sessionStorage.setItem(`${SS_SNOOZE_PREFIX}:${sub}`, "1");
}
