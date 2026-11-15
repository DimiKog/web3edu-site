/**
 * Pure decision helpers for {@link ../hooks/useSocialAwareWalletConnect.js}.
 * Does not perform I/O, navigation, or storage writes.
 */

import { isWalletMintedIdentityRecord } from "./identityReadiness.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import {
  getSocialIdentityAaAddress,
  hasUsableSocialIdentityPayload,
} from "./socialIdentityPayload.js";
import { pickSmartAccountFromPayload } from "./aaResolvePayload.js";

/**
 * Derive social/wallet AA activity flags and whether an owner→AA lookup is required.
 *
 * @param {{
 *   persistedSmartAccount?: string|null,
 *   identity?: object|null,
 *   socialIdentity?: object|null,
 *   isOidcAuthenticated?: boolean,
 * }} input
 */
export function getSocialAwareWalletConnectFlags({
  persistedSmartAccount = null,
  identity = null,
  socialIdentity = null,
  isOidcAuthenticated = false,
} = {}) {
  const persistedSc = normalizeEvmAddress(persistedSmartAccount);
  const socialAaNorm = normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity));
  const hasActiveSocialAa = Boolean(
    isOidcAuthenticated && hasUsableSocialIdentityPayload(socialIdentity) && socialAaNorm
  );
  const hasActiveWalletAa = Boolean(persistedSc && isWalletMintedIdentityRecord(identity));
  const shouldLookupOwnerMapping = Boolean(
    !hasActiveSocialAa && hasActiveWalletAa && persistedSc
  );
  return {
    persistedSc,
    socialAaNorm,
    hasActiveSocialAa,
    hasActiveWalletAa,
    shouldLookupOwnerMapping,
  };
}

/**
 * Map owner→AA resolve payload fields the same way as the production connect path.
 * @param {object|null|undefined} ownerLookup
 * @returns {string|null}
 */
export function resolveMappedAaFromOwnerLookup(ownerLookup) {
  let mapped = normalizeEvmAddress(
    ownerLookup?.identityAddress ?? ownerLookup?.smartAccount
  );
  if (!mapped) mapped = normalizeEvmAddress(pickSmartAccountFromPayload(ownerLookup));
  return mapped;
}

function ownerKey(value) {
  const n = normalizeEvmAddress(value);
  if (n) return n.toLowerCase();
  if (typeof value === "string" && /^0x[a-fA-F0-9]{40}$/i.test(value.trim())) {
    return value.trim().toLowerCase();
  }
  return null;
}

/**
 * Decide session-additive vs mismatch-clear vs wallet-first restore after optional lookup.
 *
 * Security (non-OIDC): a persisted wallet-AA for owner A must not stay active for a
 * different connected owner B unless the backend authoritatively maps B → that same AA.
 * Missing mapping or lookup failure ⇒ fail closed (mismatch clear), not session-additive.
 *
 * Same-owner reconnect remains session-additive even when lookup fails (local owner match).
 *
 * `ownerLookupOutcome`:
 * - `{ kind: 'skipped' }` — lookup not performed (social AA active or no wallet AA)
 * - `{ kind: 'success', mapped }` — lookup returned (mapped may be null)
 * - `{ kind: 'error' }` — lookup threw/timed out
 *
 * @param {{
 *   ownerNorm: string,
 *   persistedOwner?: string|null,
 *   hasActiveSocialAa: boolean,
 *   hasActiveWalletAa: boolean,
 *   persistedSc: string|null,
 *   ownerLookupOutcome: { kind: 'skipped' } | { kind: 'success', mapped: string|null } | { kind: 'error' },
 * }} input
 */
export function decideSocialAwareWalletConnectAction({
  ownerNorm,
  persistedOwner = null,
  hasActiveSocialAa,
  hasActiveWalletAa,
  persistedSc,
  ownerLookupOutcome,
}) {
  const connectedKey = ownerKey(ownerNorm);
  const persistedOwnerKey = ownerKey(persistedOwner);
  const isForeignWalletAa = Boolean(
    hasActiveWalletAa &&
      !hasActiveSocialAa &&
      persistedSc &&
      connectedKey &&
      (!persistedOwnerKey || persistedOwnerKey !== connectedKey)
  );

  let walletMismatch = false;

  if (isForeignWalletAa) {
    if (ownerLookupOutcome?.kind === "success") {
      const mapped = ownerLookupOutcome.mapped;
      if (
        mapped &&
        persistedSc &&
        mapped.toLowerCase() === persistedSc.toLowerCase()
      ) {
        // Backend authoritatively ties this EOA to the persisted AA.
        walletMismatch = false;
      } else {
        // Different AA, or no mapping — do not keep Wallet A's AA for Wallet B.
        walletMismatch = true;
      }
    } else {
      // Lookup error/skipped while a foreign minted AA is active — fail closed.
      walletMismatch = true;
    }
  } else if (
    ownerLookupOutcome?.kind === "success" &&
    persistedSc &&
    ownerLookupOutcome.mapped &&
    ownerLookupOutcome.mapped.toLowerCase() !== persistedSc.toLowerCase()
  ) {
    walletMismatch = true;
  }

  if (hasActiveSocialAa || (hasActiveWalletAa && !walletMismatch)) {
    return {
      mode: "session_additive",
      walletMismatch,
      hasActiveSocialAa,
      hasActiveWalletAa,
      clearedIdentity: null,
    };
  }

  if (walletMismatch) {
    return {
      mode: "mismatch_clear_then_resolve",
      walletMismatch,
      hasActiveSocialAa,
      hasActiveWalletAa,
      clearedIdentity: {
        owner: ownerNorm,
        smartAccount: null,
        version: null,
        tokenId: null,
        hasIdentity: false,
        alreadyMinted: false,
        signerType: "eoa",
      },
    };
  }

  return {
    mode: "resolve_restore",
    walletMismatch,
    hasActiveSocialAa,
    hasActiveWalletAa,
    clearedIdentity: null,
  };
}
