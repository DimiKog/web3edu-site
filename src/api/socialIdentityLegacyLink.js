/**
 * @deprecated Legacy EIP-191 wallet link (pre-H3C). Dashboard uses EIP-712 via identityLink.js.
 * Retained for admin/scripts only — not imported by student UI.
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

/** @deprecated Use createIdentityLinkChallenge from identityLink.js */
export async function createLinkWalletChallenge(idToken, { walletAddress, signal } = {}) {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw new Error("walletAddress is required");
  }
  const normalized =
    normalizeEvmAddress(String(walletAddress).trim()) ?? String(walletAddress).trim();
  return await fetchSocialJson(`/social/identity/link-wallet/challenge`, {
    method: "POST",
    idToken,
    body: {
      walletAddress: normalized,
    },
    signal,
  });
}

/** @deprecated Use confirmIdentityLink from identityLink.js */
export async function confirmLinkWallet(idToken, { walletAddress, signature, signal } = {}) {
  if (!walletAddress || typeof walletAddress !== "string") {
    throw new Error("walletAddress is required");
  }
  if (!signature || typeof signature !== "string") {
    throw new Error("signature is required");
  }
  const normalized =
    normalizeEvmAddress(String(walletAddress).trim()) ?? String(walletAddress).trim();
  return await fetchSocialJson(`/social/identity/link-wallet/confirm`, {
    method: "POST",
    idToken,
    body: {
      walletAddress: normalized,
      signature,
    },
    signal,
  });
}
