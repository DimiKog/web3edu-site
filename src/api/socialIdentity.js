import { getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

function buildAuthHeaders(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("ID token is required");
  }
  return {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };
}

async function fetchSocialJson(path, { method = "GET", idToken, body, signal } = {}) {
  const base = getWeb3eduBackendUrl();
  const res = await fetch(`${base}${path}`, {
    method,
    headers: buildAuthHeaders(idToken),
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      payload?.error ||
      payload?.message ||
      `Request failed (HTTP ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/**
 * POST /social/identity/resolve-or-provision
 * Uses Authorization: Bearer <ID_TOKEN>.
 * Returns backend payload mostly as-is (no aggressive reshaping).
 */
export async function resolveOrProvisionSocialIdentity(idToken, { signal } = {}) {
  return await fetchSocialJson(`/social/identity/resolve-or-provision`, {
    method: "POST",
    idToken,
    body: {},
    signal,
  });
}

/**
 * GET /social/identity/me
 * Uses Authorization: Bearer <ID_TOKEN>.
 * Returns backend payload mostly as-is (no aggressive reshaping).
 * **404** means not provisioned yet — returns `null` (does not throw) so callers can POST provision.
 */
export async function getSocialIdentityMe(idToken, { signal } = {}) {
  const base = getWeb3eduBackendUrl();
  const res = await fetch(`${base}/social/identity/me`, {
    method: "GET",
    headers: buildAuthHeaders(idToken),
    signal,
  });
  const payload = await res.json().catch(() => ({}));
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const msg =
      payload?.error ||
      payload?.message ||
      `Request failed (HTTP ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/**
 * POST /social/identity/import-progress — copy wallet/EOA progress into the current social AA identity.
 * Authorization: Bearer &lt;Keycloak id_token&gt;.
 *
 * @param {string} idToken
 * @param {{ sourceOwner: string, signal?: AbortSignal }} body
 */
export async function importSocialProgress(idToken, { sourceOwner, signal } = {}) {
  if (!sourceOwner || typeof sourceOwner !== "string") {
    throw new Error("sourceOwner is required");
  }
  const normalized =
    normalizeEvmAddress(String(sourceOwner).trim()) ?? String(sourceOwner).trim();
  return await fetchSocialJson(`/social/identity/import-progress`, {
    method: "POST",
    idToken,
    body: {
      sourceOwner: normalized,
      confirmImport: true,
    },
    signal,
  });
}

// Legacy EIP-191 link-wallet: see socialIdentityLegacyLink.js (not used by student Dashboard).

