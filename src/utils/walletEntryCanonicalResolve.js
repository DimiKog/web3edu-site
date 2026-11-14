/**
 * Wallet-entry canonical identity selection (H3A.1).
 *
 * The frontend does NOT decide whether a connected EOA belongs to a Web3Edu
 * Account. It asks GET /web3edu/identity/resolve/<EOA> and consumes the
 * already-persisted backend relationship.
 *
 * This module is not a resolver: it only interprets a privacy-safe payload
 * and chooses which viewer address to use. It never writes SocialIdentity,
 * progress, browser storage EOA→AA maps, or chain transactions.
 */

import { normalizeEvmAddress } from "./evmAddress.js";

export const WALLET_ENTRY_IDLE = "idle";
export const WALLET_ENTRY_LOADING = "loading";
export const WALLET_ENTRY_LINKED_ALIAS = "linked_alias";
export const WALLET_ENTRY_WALLET_ONLY = "wallet_only";
export const WALLET_ENTRY_UNRESOLVED = "unresolved";
export const WALLET_ENTRY_UNAVAILABLE = "unavailable";

export const VIEWER_SOURCE_OIDC_SOCIAL = "oidc_social";
export const VIEWER_SOURCE_LINKED_WALLET_ALIAS = "linked_wallet_alias";
export const VIEWER_SOURCE_DEVICE_AA = "device_aa";
export const VIEWER_SOURCE_CONNECTED_EOA = "connected_eoa";
export const VIEWER_SOURCE_WALLET_ENTRY_PENDING = "wallet_entry_pending";
export const VIEWER_SOURCE_NEUTRAL_AFTER_LOGOUT = "neutral_after_logout";
export const VIEWER_SOURCE_UNAVAILABLE = "unavailable";
export const VIEWER_SOURCE_UNRESOLVED = "unresolved";
export const VIEWER_SOURCE_NONE = "none";

const RESOLVED_STATUSES = new Set(["resolved", "resolved_legacy"]);

function emptyViewer({ source = VIEWER_SOURCE_NONE, pending = false } = {}) {
  return {
    identityAddress: null,
    source,
    pending,
    isLinkedWalletAlias: false,
    resolveOwner: null,
    matchedBy: null,
    mode: null,
    linkedWalletAddress: null,
    signerAddress: null,
  };
}

/**
 * Interpret GET /web3edu/identity/resolve payload for wallet-entry selection.
 * Ignores credential/SBT, email, sub, and names. Does not infer ownership.
 *
 * @param {object|null} payload
 * @param {{ connectedEoa?: string|null, error?: unknown }} [opts]
 */
export function interpretWalletEntryCanonicalResult(payload, { connectedEoa = null, error = null } = {}) {
  const eoa = normalizeEvmAddress(connectedEoa);
  if (error) {
    return {
      status: WALLET_ENTRY_UNAVAILABLE,
      canonicalProgressAddress: null,
      matchedBy: null,
      mode: null,
      linkedWalletAddress: null,
      aaAddress: null,
      ownerAddress: null,
      connectedEoa: eoa,
    };
  }

  const identity = payload && typeof payload === "object" ? payload.identity : null;
  if (!identity || typeof identity !== "object") {
    return {
      status: WALLET_ENTRY_UNAVAILABLE,
      canonicalProgressAddress: null,
      matchedBy: null,
      mode: null,
      linkedWalletAddress: null,
      aaAddress: null,
      ownerAddress: null,
      connectedEoa: eoa,
    };
  }

  const status = typeof identity.status === "string" ? identity.status : "";
  const mode = typeof identity.mode === "string" ? identity.mode : "";
  const matchedBy = typeof identity.matchedBy === "string" ? identity.matchedBy : null;
  const progress = normalizeEvmAddress(identity.progressAddress);
  const aaAddress = normalizeEvmAddress(identity.aaAddress);
  const ownerAddress = normalizeEvmAddress(identity.ownerAddress);
  const linkedWalletAddress = normalizeEvmAddress(identity.linkedWalletAddress);
  const socialPresent = identity.socialIdentityPresent === true;

  if (status === "not_ready" || status === "conflicted" || status === "unresolved") {
    return {
      status: WALLET_ENTRY_UNRESOLVED,
      canonicalProgressAddress: null,
      matchedBy,
      mode: mode || null,
      linkedWalletAddress,
      aaAddress,
      ownerAddress,
      connectedEoa: eoa,
    };
  }

  if (
    RESOLVED_STATUSES.has(status) &&
    mode === "social" &&
    matchedBy === "wallet_address" &&
    socialPresent &&
    progress
  ) {
    return {
      status: WALLET_ENTRY_LINKED_ALIAS,
      canonicalProgressAddress: progress,
      matchedBy,
      mode,
      linkedWalletAddress: linkedWalletAddress ?? eoa,
      aaAddress: aaAddress ?? progress,
      ownerAddress,
      connectedEoa: eoa,
    };
  }

  if (RESOLVED_STATUSES.has(status) && mode === "wallet_only") {
    // Fail closed: wallet-only requires an authoritative progressAddress.
    // Policy B: when a connected EOA is present, progress must match it.
    if (!progress || (eoa && progress !== eoa)) {
      return {
        status: WALLET_ENTRY_UNRESOLVED,
        canonicalProgressAddress: null,
        matchedBy,
        mode,
        linkedWalletAddress: null,
        aaAddress,
        ownerAddress,
        connectedEoa: eoa,
      };
    }
    return {
      status: WALLET_ENTRY_WALLET_ONLY,
      canonicalProgressAddress: progress,
      matchedBy,
      mode,
      linkedWalletAddress: null,
      aaAddress,
      ownerAddress,
      connectedEoa: eoa,
    };
  }

  return {
    status: WALLET_ENTRY_UNRESOLVED,
    canonicalProgressAddress: null,
    matchedBy,
    mode: mode || null,
    linkedWalletAddress,
    aaAddress,
    ownerAddress,
    connectedEoa: eoa,
  };
}

/**
 * Choose the canonical viewer identity address for Dashboard / resolve.
 *
 * Priority (IC-03B):
 * 1. OIDC social AA
 * 2. Authoritative wallet-entry backend result (linked alias OR wallet-only
 *    progressAddress). Device AA must NOT override these.
 * 3. Neutral-after-logout
 * 4. Device AA only when no connected-EOA wallet-entry path applies
 *    (execution/recovery surface — not an EOA/AA learner merge)
 *
 * Educational progression uses backend identity.progressAddress.
 * AA execution identity remains in IdentityContext; this selector does not
 * invent EOA↔AA mappings from browser storage or AA ownership alone.
 *
 * @param {object} args
 */
export function selectCanonicalViewerIdentity({
  isOidcAuthenticated = false,
  socialAaAddress = null,
  connectedEoa = null,
  deviceAa = null,
  deviceAaReady = false,
  isNeutralAfterLogout = false,
  walletEntryStatus = WALLET_ENTRY_IDLE,
  walletEntryActive = false,
  walletEntryProgressAddress = null,
  walletEntryResolveOwner = null,
  walletEntryMatchedBy = null,
  walletEntryMode = null,
  walletEntryLinkedWalletAddress = null,
} = {}) {
  const social = normalizeEvmAddress(socialAaAddress);
  const eoa = normalizeEvmAddress(connectedEoa);
  const device = normalizeEvmAddress(deviceAa);

  if (isOidcAuthenticated && social) {
    return {
      identityAddress: social,
      source: VIEWER_SOURCE_OIDC_SOCIAL,
      pending: false,
      isLinkedWalletAlias: false,
      resolveOwner: walletEntryResolveOwner,
      matchedBy: null,
      mode: "social",
      linkedWalletAddress: normalizeEvmAddress(walletEntryLinkedWalletAddress),
      signerAddress: eoa,
    };
  }

  if (!isOidcAuthenticated && eoa && walletEntryActive) {
    if (
      walletEntryStatus === WALLET_ENTRY_LOADING ||
      walletEntryStatus === WALLET_ENTRY_IDLE
    ) {
      return {
        ...emptyViewer({
          source: VIEWER_SOURCE_WALLET_ENTRY_PENDING,
          pending: true,
        }),
        signerAddress: eoa,
      };
    }

    if (walletEntryStatus === WALLET_ENTRY_LINKED_ALIAS) {
      const progress = normalizeEvmAddress(walletEntryProgressAddress);
      return {
        identityAddress: progress,
        source: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
        pending: false,
        isLinkedWalletAlias: Boolean(progress),
        resolveOwner: normalizeEvmAddress(walletEntryResolveOwner),
        matchedBy: walletEntryMatchedBy ?? "wallet_address",
        mode: walletEntryMode ?? "social",
        linkedWalletAddress:
          normalizeEvmAddress(walletEntryLinkedWalletAddress) ?? eoa,
        signerAddress: eoa,
      };
    }

    // IC-03B: wallet-only learners use backend progressAddress only.
    // No connected-EOA fallback. Policy B requires progress === connected EOA.
    // A restored/local device AA is execution-only and must not replace this.
    if (walletEntryStatus === WALLET_ENTRY_WALLET_ONLY) {
      const progress = normalizeEvmAddress(walletEntryProgressAddress);
      if (!progress || progress !== eoa) {
        return {
          ...emptyViewer({ source: VIEWER_SOURCE_UNRESOLVED }),
          signerAddress: eoa,
        };
      }
      return {
        identityAddress: progress,
        source: VIEWER_SOURCE_CONNECTED_EOA,
        pending: false,
        isLinkedWalletAlias: false,
        resolveOwner: null,
        matchedBy: walletEntryMatchedBy,
        mode: walletEntryMode ?? "wallet_only",
        linkedWalletAddress: null,
        signerAddress: eoa,
      };
    }

    if (walletEntryStatus === WALLET_ENTRY_UNAVAILABLE) {
      return {
        ...emptyViewer({ source: VIEWER_SOURCE_UNAVAILABLE }),
        signerAddress: eoa,
      };
    }

    if (walletEntryStatus === WALLET_ENTRY_UNRESOLVED) {
      return {
        ...emptyViewer({ source: VIEWER_SOURCE_UNRESOLVED }),
        signerAddress: eoa,
      };
    }
  }

  if (isNeutralAfterLogout) {
    return {
      ...emptyViewer({ source: VIEWER_SOURCE_NEUTRAL_AFTER_LOGOUT }),
      signerAddress: eoa,
    };
  }

  // Device AA only when wallet-entry did not establish a canonical EOA path
  // (e.g. no connected wallet, or wallet-entry inactive).
  if (deviceAaReady && device) {
    return {
      identityAddress: device,
      source: VIEWER_SOURCE_DEVICE_AA,
      pending: false,
      isLinkedWalletAlias: false,
      resolveOwner: null,
      matchedBy: null,
      mode: "wallet_only",
      linkedWalletAddress: null,
      signerAddress: eoa,
    };
  }

  return {
    ...emptyViewer(),
    signerAddress: eoa,
  };
}
