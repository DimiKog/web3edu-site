/**
 * WA-01a wallet-authentication API client.
 * POST /web3edu/auth/wallet/challenge|confirm|logout
 *
 * Isolated from Keycloak and from H3C wallet-link (/web3edu/identity/link/*).
 * Does not attach Keycloak Bearer. Does not log tokens or signatures.
 */

import { getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

function requireWallet(walletAddress) {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw Object.assign(new Error("walletAddress is required"), {
      reasonCode: "INVALID_WALLET_ADDRESS",
    });
  }
  const normalized =
    normalizeEvmAddress(String(walletAddress).trim()) ?? String(walletAddress).trim();
  if (!normalized) {
    throw Object.assign(new Error("walletAddress is invalid"), {
      reasonCode: "INVALID_WALLET_ADDRESS",
    });
  }
  return normalized;
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

async function fetchWalletAuthJson(path, { method = "POST", headers, body, signal } = {}) {
  const base = getWeb3eduBackendUrl();
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers || {}),
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
 * POST /web3edu/auth/wallet/challenge
 * @param {{ walletAddress: string, signal?: AbortSignal }} args
 */
export async function createWalletAuthChallenge({ walletAddress, signal } = {}) {
  const normalized = requireWallet(walletAddress);
  return await fetchWalletAuthJson(`/web3edu/auth/wallet/challenge`, {
    method: "POST",
    body: { walletAddress: normalized },
    signal,
  });
}

/**
 * POST /web3edu/auth/wallet/confirm
 * @param {{ walletAddress: string, challengeId: string, nonce: string, signature: string, signal?: AbortSignal }} args
 */
export async function confirmWalletAuth({
  walletAddress,
  challengeId,
  nonce,
  signature,
  signal,
} = {}) {
  const normalized = requireWallet(walletAddress);
  if (!challengeId || typeof challengeId !== "string") {
    throw Object.assign(new Error("challengeId is required"), {
      reasonCode: "CHALLENGE_NOT_FOUND",
    });
  }
  if (!nonce || typeof nonce !== "string") {
    throw Object.assign(new Error("nonce is required"), {
      reasonCode: "INVALID_TOKEN",
    });
  }
  if (!signature || typeof signature !== "string") {
    throw Object.assign(new Error("signature is required"), {
      reasonCode: "INVALID_SIGNATURE",
    });
  }
  return await fetchWalletAuthJson(`/web3edu/auth/wallet/confirm`, {
    method: "POST",
    body: {
      walletAddress: normalized,
      challengeId,
      nonce,
      signature,
    },
    signal,
  });
}

/**
 * POST /web3edu/auth/wallet/logout — Authorization: Bearer w3wa1_…
 * @param {{ token: string, signal?: AbortSignal }} args
 */
export async function logoutWalletAuth({ token, signal } = {}) {
  if (!token || typeof token !== "string" || !token.trim()) {
    throw Object.assign(new Error("missing bearer token"), {
      reasonCode: "MISSING_BEARER_TOKEN",
    });
  }
  return await fetchWalletAuthJson(`/web3edu/auth/wallet/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
    },
    body: {},
    signal,
  });
}
