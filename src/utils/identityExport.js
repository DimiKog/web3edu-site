import {
  clearIdentityState,
  normalizeOwnerPrivateKey,
  saveOwnerPrivateKey,
} from "./aaIdentity.js";

const OWNER_KEY = "web3edu-aa-owner-private-key";

/** @returns {string | null} JSON backup or null */
export function exportIdentity() {
  try {
    const privateKey = localStorage.getItem(OWNER_KEY);
    if (!privateKey) return null;
    const normalized = normalizeOwnerPrivateKey(privateKey);
    if (!normalized) return null;
    // Read-only: do not mutate storage; export only validated keys.
    return JSON.stringify({ privateKey: normalized });
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

    // Validate before any storage mutation so failures are fail-closed.
    const normalized = normalizeOwnerPrivateKey(privateKey);
    if (!normalized) return false;

    saveOwnerPrivateKey(normalized);
    clearIdentityState();
    return true;
  } catch {
    return false;
  }
}
