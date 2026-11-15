/**
 * Stale-operation guard for social-aware wallet connect identity mutations.
 * Generation / AbortController alone are insufficient — re-check live wallet + OIDC
 * after every await before applying identity or navigation side effects.
 */

import { normalizeEvmAddress } from "./evmAddress.js";

/**
 * @param {{
 *   operationId: number,
 *   currentOperationId: number,
 *   requestOwner?: string|null,
 *   liveOwner?: string|null,
 *   requestOidcAuthenticated?: boolean,
 *   liveOidcAuthenticated?: boolean,
 *   liveHasActiveSocialAa?: boolean,
 *   requireLiveOwner?: boolean,
 * }} args
 * @returns {boolean}
 */
export function shouldApplyWalletConnectIdentityMutation({
  operationId,
  currentOperationId,
  requestOwner = null,
  liveOwner = null,
  requestOidcAuthenticated = false,
  liveOidcAuthenticated = false,
  liveHasActiveSocialAa = false,
  requireLiveOwner = true,
} = {}) {
  if (operationId !== currentOperationId) return false;

  const req = normalizeEvmAddress(requestOwner);
  const live = normalizeEvmAddress(liveOwner);
  if (!req) return false;

  if (requireLiveOwner) {
    // Disconnect or wallet switch — never apply for the initiating owner.
    if (!live || req !== live) return false;
  } else if (live && req !== live) {
    // Ephemeral restore: reject only when a different wallet becomes connected.
    return false;
  }

  // Wallet-only operation must not overwrite a newly established OIDC social AA.
  if (!requestOidcAuthenticated && liveOidcAuthenticated && liveHasActiveSocialAa) {
    return false;
  }

  return true;
}
