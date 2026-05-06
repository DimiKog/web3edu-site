import { normalizeEvmAddress } from "../utils/evmAddress.js";

const DEFAULT_BACKEND = "https://web3edu-api.dimikog.org";

function getBackendBaseUrl() {
  return (import.meta.env.VITE_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
}

function isAbortError(e) {
  return (
    e?.name === "AbortError" ||
    e?.message === "signal is aborted without reason"
  );
}

async function fetchJson(path, { method = "GET", body, signal } = {}) {
  const base = getBackendBaseUrl();
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
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
 * POST /aa/identity/resolve — `address` is the normalized smart account anchor when present.
 * With `address`, `owner` is sent in the JSON body only when {@link includeOwnerWithAddress}
 * is true (mint / post-mint indexing, or backup import proving the restored owner key).
 * Otherwise resolve is smart-account-only.
 * Owner-only calls (no `address`) are reserved for {@link resolveSmartAccountFromOwner}.
 * @returns {Promise<object|null>} `null` when inputs are invalid, the request fails (non-fatal), or both `address` and `owner` are missing.
 */
export async function resolveIdentity({
  owner,
  address,
  signal,
  /** When true with a normalized `address`, include `owner` in the body (mint-phase indexing only). */
  includeOwnerWithAddress = false,
} = {}) {
  if (!address && !owner) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- dev-only invalid-call guard
      console.warn("Blocked invalid resolveIdentity call");
    }
    return null;
  }

  const addr = normalizeEvmAddress(address);
  const body = {};
  if (addr) {
    body.address = addr;
    if (
      includeOwnerWithAddress &&
      owner != null &&
      String(owner).trim() !== ""
    ) {
      const o = String(owner).trim();
      body.owner = normalizeEvmAddress(o) ?? o;
    }
  } else if (owner != null && String(owner).trim() !== "") {
    const o = String(owner).trim();
    body.owner = normalizeEvmAddress(o) ?? o;
  }
  if (!body.address && body.owner == null) {
    throw new Error(
      "resolveIdentity requires a normalized smart account address or owner"
    );
  }

  let payload;
  try {
    payload = await fetchJson(`/aa/identity/resolve`, {
      method: "POST",
      body,
      signal,
    });
  } catch (e) {
    if (isAbortError(e)) {
      return null;
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- eventual-consistency: resolve is non-fatal
      console.warn("Resolve API failed", {
        message: e?.message,
        status: e?.status,
      });
    }
    return null;
  }

  if (import.meta.env.DEV && addr) {
    const rid = normalizeEvmAddress(payload?.identityAddress);
    if (rid && rid !== addr) {
      // eslint-disable-next-line no-console -- dev-only identity invariant
      console.warn(
        "Identity invariant violated: backend returned different identity",
        { expected: addr, identityAddress: payload?.identityAddress }
      );
    }
  }

  return payload;
}

/**
 * POST /aa/identity/resolve-v2 — smart-account–first / address-first flows.
 * Body includes only normalized non-empty `address` and/or `owner` fields.
 * @returns {Promise<object|null>} `null` when inputs are invalid or the request fails (non-fatal).
 */
export async function resolveIdentityV2({ owner, address, signal } = {}) {
  if (!address && !owner) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- dev-only invalid-call guard
      console.warn("Blocked invalid resolveIdentityV2 call");
    }
    return null;
  }

  const body = {};
  if (address != null && String(address).trim() !== "") {
    const addr = normalizeEvmAddress(address);
    if (addr) body.address = addr;
  }
  if (owner != null && String(owner).trim() !== "") {
    const o = String(owner).trim();
    body.owner = normalizeEvmAddress(o) ?? o;
  }

  if (!body.address && body.owner == null) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- dev-only invalid-call guard
      console.warn("resolveIdentityV2: no valid address or owner after normalization");
    }
    return null;
  }

  let payload;
  try {
    payload = await fetchJson(`/aa/identity/resolve-v2`, {
      method: "POST",
      body,
      signal,
    });
  } catch (e) {
    if (isAbortError(e)) {
      return null;
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- eventual-consistency: resolve is non-fatal
      console.warn("Resolve V2 API failed", {
        message: e?.message,
        status: e?.status,
      });
    }
    return null;
  }

  if (import.meta.env.DEV && body.address) {
    const rid = normalizeEvmAddress(payload?.identityAddress);
    if (rid && rid !== body.address) {
      // eslint-disable-next-line no-console -- dev-only identity invariant
      console.warn(
        "Identity invariant violated: backend returned different identity",
        { expected: body.address, identityAddress: payload?.identityAddress }
      );
    }
  }

  return payload;
}

/** Counterparty smart account for `owner` (POST /aa/identity/resolve). */
export async function resolveSmartAccountFromOwner(owner, { signal } = {}) {
  if (!owner || typeof owner !== "string") return null;
  const data = await resolveIdentity({ owner, signal });
  const sc =
    (typeof data?.smartAccount === "string" && data.smartAccount.startsWith("0x") && data.smartAccount) ||
    (typeof data?.smartAccountAddress === "string" &&
      data.smartAccountAddress.startsWith("0x") &&
      data.smartAccountAddress) ||
    null;
  return sc;
}

export function buildUserOp({ owner, signal } = {}) {
  if (!owner) throw new Error("owner is required");
  return fetchJson(`/aa/userop/build`, { method: "POST", body: { owner }, signal });
}

export function submitUserOp({ userOp, signal } = {}) {
  if (!userOp) throw new Error("userOp is required");
  return fetchJson(`/aa/userop/submit`, { method: "POST", body: { userOp }, signal });
}

export function getUserOpReceipt({ hash, signal } = {}) {
  if (!hash) throw new Error("hash is required");
  return fetchJson(`/aa/userop/${hash}/receipt`, { signal });
}

