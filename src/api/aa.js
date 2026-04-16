const DEFAULT_BACKEND = "https://web3edu-api.dimikog.org";

function getBackendBaseUrl() {
  return (import.meta.env.VITE_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
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

export function resolveIdentity({ owner, signal } = {}) {
  if (!owner) throw new Error("owner is required");
  return fetchJson(`/aa/identity/resolve`, {
    method: "POST",
    body: { owner },
    signal,
  });
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
  return fetchJson(`/aa/userop/build`, {
    method: "POST",
    body: { owner },
    signal,
  });
}

export function submitUserOp({ userOp, signal } = {}) {
  if (!userOp) throw new Error("userOp is required");
  return fetchJson(`/aa/userop/submit`, {
    method: "POST",
    body: { userOp },
    signal,
  });
}

export function getUserOpReceipt({ hash, signal } = {}) {
  if (!hash) throw new Error("hash is required");
  return fetchJson(`/aa/userop/${hash}/receipt`, { signal });
}

