import { clearIdentityState } from "./aaIdentity.js";

const OWNER_KEY = "web3edu-aa-owner-private-key";

/** @returns {string | null} JSON backup or null */
export function exportIdentity() {
  try {
    const privateKey = localStorage.getItem(OWNER_KEY);
    if (!privateKey) return null;
    return JSON.stringify({ privateKey });
  } catch {
    return null;
  }
}

/** @returns {boolean} */
export function importIdentity(serialized) {
  try {
    if (!serialized || typeof serialized !== "string") return false;
    const trimmed = serialized.trim();
    let privateKey = null;
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      privateKey = parsed?.privateKey ?? null;
    } else {
      privateKey = trimmed;
    }
    if (!privateKey || typeof privateKey !== "string") return false;

    clearIdentityState();
    localStorage.setItem(OWNER_KEY, privateKey);
    return true;
  } catch {
    return false;
  }
}
