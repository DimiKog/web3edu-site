/**
 * Educational identity INPUT for backend canonical resolution.
 *
 * This is NOT a canonical learner resolver. It does not infer SocialIdentity
 * relationships, credential binding, AA ownership, SBT selection, or
 * progressAddress. The backend Canonical Identity facade decides those.
 *
 * It only chooses the safest address to SEND so the backend can resolve.
 *
 * Distinct concepts:
 * - signerAddress: connected EOA (or local owner key) that may sign txs
 * - identityInput: address sent as `wallet` on educational writes
 * - progressAddress: backend-only canonical destination
 *
 * Wallet provider (MetaMask today, BesuWallet later) must not determine
 * canonical learner identity.
 */

import { normalizeEvmAddress } from "./evmAddress.js";
import {
  getSocialIdentityAaAddress,
  getSocialIdentityOwnerAddress,
  getSocialIdentityWalletAddress,
} from "./socialIdentityPayload.js";

export const IDENTITY_INPUT_SOCIAL_AA = "social_aa";
export const IDENTITY_INPUT_SOCIAL_RELATIONSHIP = "social_relationship_input";
export const IDENTITY_INPUT_DEVICE_AA = "device_aa";
export const IDENTITY_INPUT_CONNECTED_EOA = "connected_eoa";
export const IDENTITY_INPUT_OIDC_PENDING = "oidc_pending";
export const IDENTITY_INPUT_NONE = "none";

function ownerPayload(address, owner) {
  return normalizeEvmAddress(owner) ?? normalizeEvmAddress(address) ?? null;
}

function emptyResult({ signerAddress = null, source = IDENTITY_INPUT_NONE, deferred = false } = {}) {
  return {
    identityInput: null,
    owner: null,
    signerAddress,
    source,
    ready: false,
    deferred,
  };
}

/**
 * @param {object} [args]
 * @param {string|null} [args.smartAccount] device-local / IdentityContext AA (tx surface, not canonical)
 * @param {boolean} [args.isOidcAuthenticated]
 * @param {object|null} [args.socialIdentity]
 * @param {boolean} [args.socialIdentityLoading]
 * @param {boolean} [args.oidcAuthLoading]
 * @param {string|null} [args.address] connected self-custodial EOA (signer)
 * @param {string|null} [args.owner] IdentityContext owner
 */
export function getEducationalIdentityInput({
  smartAccount = null,
  isOidcAuthenticated = false,
  socialIdentity = null,
  socialIdentityLoading = undefined,
  oidcAuthLoading = undefined,
  address = null,
  owner = null,
} = {}) {
  const localSc = normalizeEvmAddress(smartAccount);
  const connectedEoa = normalizeEvmAddress(address);
  const ownerAddr = normalizeEvmAddress(owner);
  const signerAddress = connectedEoa ?? ownerAddr;
  const socialAa = isOidcAuthenticated
    ? normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity))
    : null;
  const socialOwner = isOidcAuthenticated
    ? normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity))
    : null;
  const linkedWallet = isOidcAuthenticated
    ? normalizeEvmAddress(getSocialIdentityWalletAddress(socialIdentity))
    : null;

  const oidcPending = Boolean(
    isOidcAuthenticated &&
      !socialAa &&
      (socialIdentityLoading === true ||
        oidcAuthLoading === true ||
        (socialIdentity == null && socialIdentityLoading !== false))
  );

  if (oidcPending) {
    return emptyResult({
      signerAddress,
      source: IDENTITY_INPUT_OIDC_PENDING,
      deferred: true,
    });
  }

  if (socialAa) {
    return {
      identityInput: socialAa,
      owner: ownerPayload(address, owner) ?? socialOwner,
      signerAddress,
      source: IDENTITY_INPUT_SOCIAL_AA,
      ready: true,
      deferred: false,
    };
  }

  if (isOidcAuthenticated) {
    // Authoritative social session without a usable AA: never pretend a
    // device-local smartAccount is the Web3Edu identity.
    const relationshipInput = socialOwner ?? linkedWallet ?? connectedEoa ?? ownerAddr;
    if (!relationshipInput) {
      return emptyResult({ signerAddress, source: IDENTITY_INPUT_NONE });
    }
    return {
      identityInput: relationshipInput,
      owner: socialOwner ?? ownerPayload(address, owner),
      signerAddress,
      source: socialOwner || linkedWallet
        ? IDENTITY_INPUT_SOCIAL_RELATIONSHIP
        : IDENTITY_INPUT_CONNECTED_EOA,
      ready: true,
      deferred: false,
    };
  }

  // Wallet-first / wallet-only: device AA if present, else connected EOA.
  // No social login, AA, or SBT is required.
  if (localSc) {
    return {
      identityInput: localSc,
      owner: ownerPayload(address, owner),
      signerAddress,
      source: IDENTITY_INPUT_DEVICE_AA,
      ready: true,
      deferred: false,
    };
  }

  if (connectedEoa) {
    return {
      identityInput: connectedEoa,
      owner: null,
      signerAddress: connectedEoa,
      source: IDENTITY_INPUT_CONNECTED_EOA,
      ready: true,
      deferred: false,
    };
  }

  return emptyResult({ signerAddress, source: IDENTITY_INPUT_NONE });
}

/**
 * Compatibility shape used by existing lab write callers.
 * `wallet` is the educational identity input, not a canonical progressAddress.
 */
export function getEffectiveLabsWalletIdentity(args = {}) {
  const result = getEducationalIdentityInput(args);
  return {
    wallet: result.identityInput,
    owner: result.owner,
    signerAddress: result.signerAddress,
    source: result.source,
    ready: result.ready,
    deferred: result.deferred,
  };
}
