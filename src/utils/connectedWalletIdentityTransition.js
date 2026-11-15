/**
 * Pure wallet-switch identity transition for {@link ../context/IdentityContext.jsx}.
 * Behavior-preserving extraction — does not write localStorage; caller persists when needed.
 */

import { ethers } from "ethers";
import { hasPersistedWalletAaIdentity } from "./aaIdentity.js";

/** Same blank shape as IdentityContext (no signerType). */
export const BLANK_WALLET_IDENTITY = {
  owner: null,
  smartAccount: null,
  version: null,
  tokenId: null,
  hasIdentity: false,
  alreadyMinted: false,
};

function normalizeOwnerLower(owner) {
  if (!owner) return null;
  try {
    return ethers.getAddress(owner).toLowerCase();
  } catch {
    return String(owner).toLowerCase();
  }
}

/**
 * Decide how React identity state should change when a connected EOA is observed.
 *
 * OIDC sessions never sync a guest EOA into `web3edu-aa-identity` (caller skips the
 * setState path entirely). When a minted wallet-AA is persisted and a different EOA
 * connects, clear mint evidence and keep only the new owner (existing A→B behavior).
 *
 * @param {{
 *   isOidcAuthenticated?: boolean,
 *   connectedEoa?: string|null,
 *   prevIdentity?: object|null,
 * }} input
 * @returns {{
 *   action: 'skip_oidc' | 'noop_no_connected' | 'keep' | 'clear_minted_for_wallet_switch' | 'set_owner_only' | 'replace_with_connected_owner',
 *   nextIdentity: object|null,
 *   shouldPersist: boolean,
 * }}
 */
export function decideConnectedWalletIdentityTransition({
  isOidcAuthenticated = false,
  connectedEoa = null,
  prevIdentity = null,
} = {}) {
  if (isOidcAuthenticated) {
    return {
      action: "skip_oidc",
      nextIdentity: null,
      shouldPersist: false,
    };
  }

  if (!connectedEoa) {
    return {
      action: "noop_no_connected",
      nextIdentity: null,
      shouldPersist: false,
    };
  }

  const base =
    prevIdentity && typeof prevIdentity === "object"
      ? prevIdentity
      : BLANK_WALLET_IDENTITY;

  if (hasPersistedWalletAaIdentity(base)) {
    const prevOwnerNorm = normalizeOwnerLower(base.owner);
    if (prevOwnerNorm === connectedEoa.toLowerCase()) {
      return {
        action: "keep",
        nextIdentity: base,
        shouldPersist: false,
      };
    }
    /** Different wallet connected — do not keep another wallet’s minted identity. */
    const cleared = {
      ...BLANK_WALLET_IDENTITY,
      owner: connectedEoa,
    };
    return {
      action: "clear_minted_for_wallet_switch",
      nextIdentity: cleared,
      shouldPersist: true,
    };
  }

  const prevOwnerNorm = normalizeOwnerLower(base.owner);

  if (prevOwnerNorm === connectedEoa.toLowerCase()) {
    return {
      action: "keep",
      nextIdentity: base,
      shouldPersist: false,
    };
  }

  if (!prevOwnerNorm && !base.smartAccount) {
    const merged = { ...base, owner: connectedEoa };
    return {
      action: "set_owner_only",
      nextIdentity: merged,
      shouldPersist: true,
    };
  }

  const merged = {
    ...BLANK_WALLET_IDENTITY,
    owner: connectedEoa,
  };
  return {
    action: "replace_with_connected_owner",
    nextIdentity: merged,
    shouldPersist: true,
  };
}
