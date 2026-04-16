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
 * Connected wallet first, then AA owner — for `owner=` on backend reads only
 * (legacy rows are keyed by EOA). Empty strings are treated as absent.
 * @param {string|null|undefined} address wagmi `address` or session EOA
 * @param {string|null|undefined} owner AA owner from IdentityContext
 */
export function buildResolveOwner(address, owner) {
  const a = normalizeEvmAddress(address);
  const o = normalizeEvmAddress(owner);
  return a ?? o ?? null;
}

/**
 * `owner` query for backend reads: wagmi EOA only — same as write payloads (`owner: address ?? null`).
 * Never IdentityContext `owner`.
 */
export function resolveReadOwnerQueryParam(_smartAccount, address, _contextOwner) {
  return normalizeEvmAddress(address);
}

/**
 * GET /web3sbt/resolve/:routeAddress for the current viewer: adds `?owner=` only when
 * the route matches the viewer's AA (`smartAccount`) or persisted owner EOA (no wagmi in identity match).
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
  const myId =
    normalizeEvmAddress(smartAccount) ?? normalizeEvmAddress(contextOwner);
  const ownerQuery =
    myId && path === myId
      ? resolveReadOwnerQueryParam(smartAccount, walletAddress, contextOwner)
      : null;
  return buildWeb3SbtResolveUrl(routeAddress, ownerQuery);
}

/**
 * GET /web3sbt/resolve/:identityAddress — optional ?owner=<resolveOwner>
 * @param {string} identityAddress smart account preferred, else owner / connected EOA
 * @param {string|null|undefined} resolveOwner wagmi EOA only (see {@link resolveReadOwnerQueryParam})
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
