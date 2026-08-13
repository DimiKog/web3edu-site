import { buildCanonicalIdentityResolveUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

/**
 * GET /web3edu/identity/resolve/<address> — read-only, unauthenticated, privacy-safe.
 * Does not persist relationships or write identity state.
 *
 * @param {string} address
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchCanonicalIdentityResolve(address, { signal } = {}) {
  const id = normalizeEvmAddress(address);
  if (!id) {
    const err = new Error("invalid_address");
    err.code = "INVALID_ADDRESS";
    throw err;
  }

  const url = buildCanonicalIdentityResolveUrl(id);
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    const networkErr = new Error("canonical_identity_unavailable");
    networkErr.code = "API_UNAVAILABLE";
    networkErr.cause = err;
    throw networkErr;
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const httpErr = new Error(
      payload?.error || payload?.message || `canonical_identity_http_${res.status}`
    );
    httpErr.code = "API_UNAVAILABLE";
    httpErr.status = res.status;
    httpErr.payload = payload;
    throw httpErr;
  }

  if (!payload || typeof payload !== "object" || !payload.identity) {
    const shapeErr = new Error("canonical_identity_invalid_payload");
    shapeErr.code = "API_UNAVAILABLE";
    shapeErr.payload = payload;
    throw shapeErr;
  }

  return payload;
}
