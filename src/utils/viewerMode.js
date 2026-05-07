/**
 * Identity model notes (implementation reality)
 * ------------------------------------------
 * Web3Edu currently supports multiple identity “surfaces” that can legitimately refer
 * to different AA accounts/profiles:
 *
 * - Social/Web3Edu account identity (OIDC):
 *   - Canonical AA address comes from backend social identity (`aaAddress`).
 *   - This is used as the canonical viewer identity when OIDC is authenticated.
 *
 * - Wallet/device identity (local AA):
 *   - Persisted in localStorage as `web3edu-aa-identity`.
 *   - Treated as “ready” only when minted signals exist (see `isWalletMintedIdentityRecord`).
 *
 * Wallet “linking” today is an authorization / relationship for continuity workflows
 * (e.g. allowing a connected wallet to act as an import source), NOT a guaranteed
 * “merge into one profile”. As a result, it is expected that the social identity and
 * wallet identity can still be different profiles unless the product explicitly
 * enforces a single canonical identity.
 *
 * Product UX guard
 * ----------------
 * To prevent confusing silent profile switching (especially after OIDC logout while
 * a wallet remains connected), we use a session-scoped `viewerMode` flag. When in
 * `neutral_after_logout`, the app should not automatically pick a wallet/device
 * identity as canonical; instead the user must explicitly choose a path again.
 */

const KEY = "web3edu:viewerMode:v1";

export const VIEWER_MODES = {
  social: "social",
  wallet: "wallet",
  device: "device",
  neutralAfterLogout: "neutral_after_logout",
};

function safeSessionStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getViewerMode() {
  const ss = safeSessionStorage();
  if (!ss) return null;
  const v = ss.getItem(KEY);
  return typeof v === "string" && v.trim() ? v : null;
}

/** @param {string|null|undefined} mode */
export function setViewerMode(mode) {
  const ss = safeSessionStorage();
  if (!ss) return;
  const v = typeof mode === "string" ? mode.trim() : "";
  if (!v) {
    ss.removeItem(KEY);
    return;
  }
  ss.setItem(KEY, v);
}

export function setNeutralAfterLogout() {
  setViewerMode(VIEWER_MODES.neutralAfterLogout);
}

export function clearNeutralAfterLogout() {
  if (getViewerMode() === VIEWER_MODES.neutralAfterLogout) {
    setViewerMode(null);
  }
}

export function isNeutralAfterLogout() {
  return getViewerMode() === VIEWER_MODES.neutralAfterLogout;
}

