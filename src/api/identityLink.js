/**
 * H3C EIP-712 wallet-link API (canonical).
 * POST/GET /web3edu/identity/link/*
 *
 * Do not use /social/identity/link-wallet/* for Case B / progress-aware linking.
 */

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

async function fetchLinkJson(path, { method = "GET", idToken, body, signal } = {}) {
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
      payload?.reasonCode ||
      payload?.message ||
      `Request failed (HTTP ${res.status})`;
    const err = new Error(String(msg));
    err.status = res.status;
    err.payload = payload;
    err.reasonCode = payload?.reasonCode || payload?.error || null;
    throw err;
  }
  return payload;
}

function requireWallet(walletAddress) {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw new Error("walletAddress is required");
  }
  return normalizeEvmAddress(String(walletAddress).trim()) ?? String(walletAddress).trim();
}

/**
 * POST /web3edu/identity/link/challenge
 */
export async function createIdentityLinkChallenge(idToken, { walletAddress, signal } = {}) {
  const normalized = requireWallet(walletAddress);
  return await fetchLinkJson(`/web3edu/identity/link/challenge`, {
    method: "POST",
    idToken,
    body: { walletAddress: normalized },
    signal,
  });
}

/**
 * POST /web3edu/identity/link/preview
 */
export async function previewIdentityLink(
  idToken,
  { walletAddress, nonce, signature, challengeId, signal } = {}
) {
  const normalized = requireWallet(walletAddress);
  if (!nonce || typeof nonce !== "string") throw new Error("nonce is required");
  if (!signature || typeof signature !== "string") throw new Error("signature is required");
  return await fetchLinkJson(`/web3edu/identity/link/preview`, {
    method: "POST",
    idToken,
    body: {
      walletAddress: normalized,
      nonce,
      signature,
      challengeId: challengeId || undefined,
    },
    signal,
  });
}

/**
 * POST /web3edu/identity/link/confirm
 */
export async function confirmIdentityLink(
  idToken,
  { walletAddress, nonce, signature, challengeId, signal } = {}
) {
  const normalized = requireWallet(walletAddress);
  if (!nonce || typeof nonce !== "string") throw new Error("nonce is required");
  if (!signature || typeof signature !== "string") throw new Error("signature is required");
  return await fetchLinkJson(`/web3edu/identity/link/confirm`, {
    method: "POST",
    idToken,
    body: {
      walletAddress: normalized,
      nonce,
      signature,
      challengeId: challengeId || undefined,
    },
    signal,
  });
}

/**
 * GET /web3edu/identity/link/status
 */
export async function getIdentityLinkStatus(idToken, { signal } = {}) {
  return await fetchLinkJson(`/web3edu/identity/link/status`, {
    method: "GET",
    idToken,
    signal,
  });
}
