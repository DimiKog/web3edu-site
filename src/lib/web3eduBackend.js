/**
 * Web3Edu API base URL and URL builders for AA-aware identity (smart account + owner EOA).
 */
import { normalizeEvmAddress } from "../utils/evmAddress.js";

const DEFAULT_WEB3EDU_API = "https://web3edu-api.dimikog.org";

export function getWeb3eduBackendUrl() {
  const raw = import.meta.env.VITE_BACKEND_URL || DEFAULT_WEB3EDU_API;
  return String(raw).replace(/\/$/, "");
}

/**
 * IdentityContext owner first, then wagmi address — for `owner=` on backend reads only
 * (legacy rows are keyed by EOA). Empty strings are treated as absent.
 *
 * Rationale: wagmi `address` can temporarily lag behind the app's own wallet-session
 * bookkeeping (localStorage + `web3edu-wallet-state`). The IdentityContext `owner`
 * is the canonical "who just connected" signal for AA + resolve flows.
 * @param {string|null|undefined} address wagmi `address` or session EOA
 * @param {string|null|undefined} owner AA owner from IdentityContext
 */
export function buildResolveOwner(address, owner) {
  const a = normalizeEvmAddress(address);
  const o = normalizeEvmAddress(owner);
  return o ?? a ?? null;
}

/**
 * Wagmi EOA only (no IdentityContext). Prefer {@link buildResolveOwner} for lab status / AA flows.
 */
export function resolveReadOwnerQueryParam(address) {
  return normalizeEvmAddress(address);
}

/**
 * GET /web3sbt/resolve/:routeAddress for the current viewer.
 * When the viewer has a smart account (v2), reads use the path only — never `?owner=`.
 * Pre-AA / legacy: when there is no smart account, `?owner=` may be added when viewing own EOA.
 */
export function buildWeb3SbtResolveUrlForViewer(
  routeAddress,
  smartAccount,
  walletAddress,
  contextOwner
) {
  const path = normalizeEvmAddress(routeAddress);
  if (!path) {
    throw new Error("identityAddress is required for /web3sbt/resolve");
  }
  const mySc = normalizeEvmAddress(smartAccount);
  const myEoa = normalizeEvmAddress(contextOwner);
  const isViewingSelf =
    Boolean(mySc && path === mySc) ||
    Boolean(!mySc && myEoa && path === myEoa);
  const ownerQuery = mySc
    ? null
    : isViewingSelf
      ? buildResolveOwner(walletAddress, contextOwner)
      : null;
  return buildWeb3SbtResolveUrl(routeAddress, ownerQuery);
}

/**
 * GET /web3sbt/resolve/:identityAddress — optional ?owner=<resolveOwner>
 * @param {string} identityAddress smart account preferred, else owner / connected EOA
 * @param {string|null|undefined} resolveOwner EOA for backend row lookup (use {@link buildResolveOwner} when wagmi may be disconnected)
 */
export function buildWeb3SbtResolveUrl(identityAddress, resolveOwner) {
  const base = getWeb3eduBackendUrl();
  const id = normalizeEvmAddress(identityAddress);
  if (!id) {
    throw new Error("identityAddress is required for /web3sbt/resolve");
  }
  const path = `${base}/web3sbt/resolve/${encodeURIComponent(id)}`;
  const ro = normalizeEvmAddress(resolveOwner);
  if (ro) {
    return `${path}?owner=${encodeURIComponent(ro)}`;
  }
  return path;
}

/**
 * GET /labs/status?address=&labId=&owner=
 * @param {string|null|undefined} resolveOwner from {@link resolveReadOwnerQueryParam} (AA-first reads)
 */
export function buildLabsStatusUrl(identityAddress, labId, resolveOwner) {
  const base = getWeb3eduBackendUrl();
  const addr = normalizeEvmAddress(identityAddress);
  if (!addr) {
    throw new Error("identityAddress is required for /labs/status");
  }
  const params = new URLSearchParams({
    address: addr,
    labId: String(labId),
  });
  const ro = normalizeEvmAddress(resolveOwner);
  if (ro) {
    params.set("owner", ro);
  }
  return `${base}/labs/status?${params.toString()}`;
}

/**
 * GET /web3sbt/anchor-status/:address — read-only profile-anchor verification.
 * @param {string} identityAddress smart account / progress identity
 */
export function buildProfileAnchorStatusUrl(identityAddress) {
  const base = getWeb3eduBackendUrl();
  const id = normalizeEvmAddress(identityAddress);
  if (!id) {
    throw new Error("identityAddress is required for /web3sbt/anchor-status");
  }
  return `${base}/web3sbt/anchor-status/${encodeURIComponent(id)}`;
}

/**
 * Fetch profile-anchor verification status (read-only; no signing / POST).
 * @param {string} identityAddress
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<object>}
 */
export async function getProfileAnchorStatus(identityAddress, { signal } = {}) {
  const url = buildProfileAnchorStatusUrl(identityAddress);
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    const networkErr = new Error("anchor_status_unavailable");
    networkErr.code = "API_UNAVAILABLE";
    networkErr.cause = err;
    throw networkErr;
  }

  const payload = await res.json().catch(() => ({}));

  // Trust backend top-level verification statuses even on non-2xx (e.g. 503 INVALID config).
  const status = typeof payload?.status === "string" ? payload.status : null;
  const known =
    status === "VERIFIED" ||
    status === "OUTDATED" ||
    status === "NOT_ANCHORED" ||
    status === "INVALID";

  if (known) {
    return payload;
  }

  if (!res.ok) {
    const httpErr = new Error(
      payload?.error || payload?.message || `anchor_status_http_${res.status}`
    );
    httpErr.code = "API_UNAVAILABLE";
    httpErr.status = res.status;
    httpErr.payload = payload;
    throw httpErr;
  }

  const shapeErr = new Error("anchor_status_invalid_payload");
  shapeErr.code = "API_UNAVAILABLE";
  shapeErr.payload = payload;
  throw shapeErr;
}
