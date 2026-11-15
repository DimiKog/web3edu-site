/**
 * Pure Join "Continue with connected wallet" classification for owner→AA resolve.
 * Used by {@link ./provisionWalletIdentityFromOwner.js}.
 */

import { normalizeEvmAddress } from "./evmAddress.js";
import { pickSmartAccountFromPayload } from "./aaResolvePayload.js";

/**
 * Classify the first owner-only resolve payload before final mint checks.
 *
 * - `null` / transport failure → `resolve_failed` (cannot decide)
 * - Payload present but no AA anchor → `not_minted` (Identity Setup)
 * - AA anchor present → `has_anchor` (caller continues with resolve-v2 / mint checks)
 *
 * @param {object|null|undefined} first — POST /aa/identity/resolve owner-only result
 * @returns {'resolve_failed' | 'not_minted' | 'has_anchor'}
 */
export function classifyOwnerResolveForWalletContinue(first) {
  if (first == null) return "resolve_failed";

  let anchor = normalizeEvmAddress(first?.identityAddress ?? first?.smartAccount);
  if (!anchor) {
    anchor = normalizeEvmAddress(pickSmartAccountFromPayload(first));
  }
  if (!anchor) return "not_minted";
  return "has_anchor";
}
