/**
 * IC-03A credential-association API client.
 * POST/GET /web3edu/identity/credential-association/*
 *
 * Isolated from Keycloak, WA-01 wallet-auth, and H3C wallet-link.
 * Does not attach Bearer. Does not log signatures or nonces.
 */

import { getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

function requireAddress(value, reasonCode = "INVALID_EOA_ADDRESS") {
  const normalized = normalizeEvmAddress(value);
  if (!normalized) {
    throw Object.assign(new Error(reasonCode), { reasonCode });
  }
  return normalized;
}

function requireTokenId(tokenId) {
  if (typeof tokenId === "boolean") {
    throw Object.assign(new Error("INVALID_TOKEN_ID"), { reasonCode: "INVALID_TOKEN_ID" });
  }
  if (typeof tokenId === "number" && Number.isInteger(tokenId) && tokenId >= 0) {
    return tokenId;
  }
  if (typeof tokenId === "string" && /^\d+$/.test(tokenId.trim())) {
    return Number(tokenId.trim());
  }
  throw Object.assign(new Error("INVALID_TOKEN_ID"), { reasonCode: "INVALID_TOKEN_ID" });
}

function throwApiError(res, payload) {
  const code =
    payload?.reasonCode ||
    payload?.error ||
    payload?.message ||
    `Request failed (HTTP ${res.status})`;
  const err = new Error(String(code));
  err.status = res.status;
  err.payload = payload && typeof payload === "object" ? payload : {};
  err.reasonCode = payload?.reasonCode || payload?.error || null;
  throw err;
}

async function fetchCredentialAssociationJson(
  path,
  { method = "GET", body, signal, query } = {}
) {
  const base = getWeb3eduBackendUrl();
  let url = `${base}${path}`;
  if (query && typeof query === "object") {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v == null || v === "") continue;
      params.set(k, String(v));
    }
    const qs = params.toString();
    if (qs) url = `${url}?${qs}`;
  }
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    cache: "no-store",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throwApiError(res, payload);
  }
  return payload;
}

/**
 * POST /web3edu/identity/credential-association/challenge
 */
export async function createCredentialAssociationChallenge({
  eoaAddress,
  aaAddress,
  tokenId,
  sbtContract,
  action = "ASSOCIATE",
  associationId,
  signal,
} = {}) {
  const eoa = requireAddress(eoaAddress, "INVALID_EOA_ADDRESS");
  const aa = requireAddress(aaAddress, "INVALID_AA_ADDRESS");
  const tid = requireTokenId(tokenId);
  const body = {
    eoaAddress: eoa,
    aaAddress: aa,
    tokenId: tid,
    action: String(action || "ASSOCIATE").trim().toUpperCase(),
  };
  if (sbtContract) {
    body.sbtContract = requireAddress(sbtContract, "INVALID_SBT_CONTRACT");
  }
  if (associationId) {
    body.associationId = String(associationId);
  }
  return await fetchCredentialAssociationJson(
    `/web3edu/identity/credential-association/challenge`,
    { method: "POST", body, signal }
  );
}

/**
 * POST /web3edu/identity/credential-association/confirm
 */
export async function confirmCredentialAssociation({
  eoaAddress,
  aaAddress,
  tokenId,
  sbtContract,
  challengeId,
  nonce,
  signature,
  signal,
} = {}) {
  const eoa = requireAddress(eoaAddress, "INVALID_EOA_ADDRESS");
  const aa = requireAddress(aaAddress, "INVALID_AA_ADDRESS");
  const tid = requireTokenId(tokenId);
  if (!challengeId || typeof challengeId !== "string") {
    throw Object.assign(new Error("CHALLENGE_NOT_FOUND"), {
      reasonCode: "CHALLENGE_NOT_FOUND",
    });
  }
  if (!nonce || typeof nonce !== "string") {
    throw Object.assign(new Error("INVALID_SIGNATURE"), {
      reasonCode: "INVALID_SIGNATURE",
    });
  }
  if (!signature || typeof signature !== "string") {
    throw Object.assign(new Error("INVALID_SIGNATURE"), {
      reasonCode: "INVALID_SIGNATURE",
    });
  }
  const body = {
    eoaAddress: eoa,
    aaAddress: aa,
    tokenId: tid,
    challengeId,
    nonce,
    signature,
  };
  if (sbtContract) {
    body.sbtContract = requireAddress(sbtContract, "INVALID_SBT_CONTRACT");
  }
  return await fetchCredentialAssociationJson(
    `/web3edu/identity/credential-association/confirm`,
    { method: "POST", body, signal }
  );
}

/**
 * GET /web3edu/identity/credential-association/lookup
 * Public path always revalidates on-chain (backend ignores revalidate=0).
 */
export async function lookupCredentialAssociation({
  progressAddress,
  eoaAddress,
  aaAddress,
  credentialId,
  signal,
} = {}) {
  return await fetchCredentialAssociationJson(
    `/web3edu/identity/credential-association/lookup`,
    {
      method: "GET",
      signal,
      query: {
        progressAddress: progressAddress
          ? requireAddress(progressAddress)
          : undefined,
        eoaAddress: eoaAddress ? requireAddress(eoaAddress) : undefined,
        aaAddress: aaAddress ? requireAddress(aaAddress) : undefined,
        credentialId: credentialId || undefined,
      },
    }
  );
}
