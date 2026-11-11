/**
 * WA-01c1 wallet-authentication flow helpers.
 *
 * Challenge validation + EIP-712 sign + confirm orchestration.
 * Reuses signEip712TypedData (same as H3C link) but never reuses
 * WEB3EDU_WALLET_LINK typed data / purposes.
 *
 * Does not decide backend authorization. Does not log tokens or signatures.
 */

import {
  confirmWalletAuth,
  createWalletAuthChallenge,
  logoutWalletAuth,
} from "../api/walletAuth.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import { signEip712TypedData } from "./signEip712TypedData.js";

export const WALLET_AUTH_PURPOSE = "WEB3EDU_WALLET_AUTH";
export const WALLET_LINK_PURPOSE = "WEB3EDU_WALLET_LINK";
export const WALLET_AUTH_PRIMARY_TYPE = "WalletAuth";
export const WALLET_AUTH_CHAIN_ID = 424242;
export const WALLET_SESSION_TOKEN_PREFIX = "w3wa1_";
export const WALLET_AUTH_SESSION_SCOPE = "education:read_private";

export const WALLET_AUTH_REASON = Object.freeze({
  FRONTEND_DISABLED: "WALLET_AUTH_FRONTEND_DISABLED",
  API_DISABLED: "WALLET_AUTH_API_DISABLED",
  UNAVAILABLE: "WALLET_AUTH_UNAVAILABLE",
  NOT_WALLET_ONLY: "WALLET_AUTH_NOT_WALLET_ONLY",
  OIDC_ACTIVE: "WALLET_AUTH_OIDC_ACTIVE",
  LINKED_ALIAS: "WALLET_AUTH_LINKED_ALIAS_EXCLUDED",
  DEVICE_AA: "WALLET_AUTH_DEVICE_AA_EXCLUDED",
  WALLET_DISCONNECTED: "WALLET_AUTH_WALLET_DISCONNECTED",
  WRONG_CHAIN: "WALLET_AUTH_WRONG_CHAIN",
  INVALID_CHALLENGE: "INVALID_CHALLENGE",
  PURPOSE_MISMATCH: "PURPOSE_MISMATCH",
  CHAIN_ID_MISMATCH: "CHAIN_ID_MISMATCH",
  WALLET_MISMATCH: "WALLET_MISMATCH",
  ORIGIN_MISMATCH: "ORIGIN_MISMATCH",
  INVALID_SESSION: "INVALID_SESSION",
  USER_REJECTED: "USER_REJECTED",
  WALLET_SWITCH: "WALLET_SWITCH",
  AUTH_IN_PROGRESS: "WALLET_AUTH_IN_PROGRESS",
  EXPIRED: "SESSION_EXPIRED",
  REAUTH_LIMIT: "WALLET_AUTH_REAUTH_LIMIT",
});

function authError(reasonCode, message) {
  const err = new Error(message || reasonCode);
  err.reasonCode = reasonCode;
  return err;
}

/** Normalize origin for comparison (trim, strip trailing slash). */
export function normalizeOrigin(origin) {
  if (origin == null || typeof origin !== "string") return null;
  const trimmed = origin.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, "");
}

/**
 * Frontend opt-in. Exact "1" or case-insensitive "true" enables.
 * Default OFF when unset / anything else.
 */
export function isWalletAuthFrontendEnabled(env = undefined) {
  const source =
    env !== undefined
      ? env
      : typeof import.meta !== "undefined"
        ? import.meta.env
        : undefined;
  const raw = source?.VITE_WALLET_AUTH_ENABLED;
  if (raw == null) return false;
  const v = String(raw).trim().toLowerCase();
  return v === "1" || v === "true";
}

export function isEduNetChainId(chainId) {
  const n = normalizeWalletChainId(chainId);
  return n === WALLET_AUTH_CHAIN_ID;
}

/**
 * Normalize a wallet/provider chain id to a finite number, or null when unknown.
 * Accepts decimal numbers and 0x-prefixed hex strings.
 */
export function normalizeWalletChainId(chainId) {
  if (chainId == null || chainId === "") return null;
  if (typeof chainId === "boolean") return null;
  if (typeof chainId === "bigint") {
    const n = Number(chainId);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.trunc(n);
  }
  if (typeof chainId === "string") {
    const s = chainId.trim();
    if (!s) return null;
    const n =
      s.startsWith("0x") || s.startsWith("0X")
        ? Number.parseInt(s, 16)
        : Number.parseInt(s, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.trunc(n);
  }
  const n = Number(chainId);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.trunc(n);
}

/**
 * Authority for wallet-auth chain gating (WA-01e2.1).
 *
 * Prefer the actual connected wallet/account chain (`useAccount().chainId`) over
 * wagmi config `useChainId()`, which can remain on the configured Edu-Net id after
 * the wallet switches to an unsupported chain.
 *
 * Fail closed: unknown/unsupported → null (not Edu-Net).
 * Never treat configChainId as sole authority.
 *
 * @param {{
 *   accountChainId?: string|number|null,
 *   providerChainId?: string|number|null,
 *   configChainId?: string|number|null,
 * }} [parts]
 * @returns {number|null}
 */
export function resolveConnectedWalletChainId({
  accountChainId = null,
  providerChainId = null,
  configChainId = null,
} = {}) {
  const connected =
    normalizeWalletChainId(accountChainId) ??
    normalizeWalletChainId(providerChainId);
  if (connected != null) return connected;
  // Fail closed — do not fall back to wagmi config chain for auth eligibility.
  void configChainId;
  return null;
}

/**
 * Eligibility for starting wallet authentication.
 * Frontend gating only — backend Policy B remains authoritative.
 *
 * @param {object} args
 * @param {boolean} [args.isOidcAuthenticated]
 * @param {boolean} [args.isConnected]
 * @param {string|number|null} [args.chainId]
 * @param {string|null} [args.viewerSource]
 * @param {string|null} [args.walletEntryStatus]
 * @param {string|null} [args.walletEntryMode]
 * @param {boolean} [args.walletOnlyModeEstablished] explicit caller gate
 */
export function getWalletAuthEligibility({
  isOidcAuthenticated = false,
  isConnected = false,
  chainId = null,
  viewerSource = null,
  walletEntryStatus = null,
  walletEntryMode = null,
  walletOnlyModeEstablished = false,
} = {}) {
  if (isOidcAuthenticated || viewerSource === VIEWER_SOURCE_OIDC_SOCIAL) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.OIDC_ACTIVE };
  }
  if (
    viewerSource === VIEWER_SOURCE_LINKED_WALLET_ALIAS ||
    walletEntryStatus === "linked_alias"
  ) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.LINKED_ALIAS };
  }
  if (viewerSource === VIEWER_SOURCE_DEVICE_AA) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.DEVICE_AA };
  }
  if (!isConnected) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.WALLET_DISCONNECTED };
  }
  if (!isEduNetChainId(chainId)) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.WRONG_CHAIN };
  }

  const walletOnly =
    walletOnlyModeEstablished === true ||
    viewerSource === VIEWER_SOURCE_CONNECTED_EOA ||
    walletEntryStatus === WALLET_ENTRY_WALLET_ONLY ||
    walletEntryMode === "wallet_only";

  if (!walletOnly) {
    return { ok: false, reasonCode: WALLET_AUTH_REASON.NOT_WALLET_ONLY };
  }

  return { ok: true, reasonCode: null };
}

/**
 * Validate server challenge before signing.
 *
 * @param {object} challenge
 * @param {{ walletAddress: string, expectedOrigin: string, expectedChainId?: number }} opts
 */
export function validateWalletAuthChallenge(
  challenge,
  { walletAddress, expectedOrigin, expectedChainId = WALLET_AUTH_CHAIN_ID } = {}
) {
  if (!challenge || typeof challenge !== "object") {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "challenge missing");
  }

  const purpose = String(challenge.purpose || "").trim();
  if (purpose === WALLET_LINK_PURPOSE) {
    throw authError(WALLET_AUTH_REASON.PURPOSE_MISMATCH, "wallet-link purpose rejected");
  }
  if (purpose !== WALLET_AUTH_PURPOSE) {
    throw authError(WALLET_AUTH_REASON.PURPOSE_MISMATCH, "unexpected purpose");
  }

  const chainId = Number(challenge.chainId);
  if (chainId !== Number(expectedChainId) || chainId !== WALLET_AUTH_CHAIN_ID) {
    throw authError(WALLET_AUTH_REASON.CHAIN_ID_MISMATCH, "unexpected chainId");
  }

  const expectedWallet = normalizeEvmAddress(walletAddress);
  const challengeWallet = normalizeEvmAddress(challenge.walletAddress);
  if (!expectedWallet || !challengeWallet || challengeWallet !== expectedWallet) {
    throw authError(WALLET_AUTH_REASON.WALLET_MISMATCH, "challenge wallet mismatch");
  }

  const expected = normalizeOrigin(expectedOrigin);
  const got = normalizeOrigin(challenge.origin);
  if (!expected || !got || expected !== got) {
    throw authError(WALLET_AUTH_REASON.ORIGIN_MISMATCH, "origin mismatch");
  }

  const typedData = challenge.typedData;
  if (!typedData || typeof typedData !== "object") {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "typedData missing");
  }
  if (
    typedData.primaryType === "WalletBinding" ||
    typedData.types?.WalletBinding ||
    String(typedData.message?.purpose || "").trim() === WALLET_LINK_PURPOSE
  ) {
    throw authError(WALLET_AUTH_REASON.PURPOSE_MISMATCH, "wallet-link typed data rejected");
  }
  if (typedData.primaryType !== WALLET_AUTH_PRIMARY_TYPE) {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "primaryType must be WalletAuth");
  }
  if (!typedData.types?.WalletAuth) {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "WalletAuth types missing");
  }

  const domainChain = Number(typedData.domain?.chainId);
  const messageChain = Number(typedData.message?.chainId);
  if (domainChain !== WALLET_AUTH_CHAIN_ID || messageChain !== WALLET_AUTH_CHAIN_ID) {
    throw authError(WALLET_AUTH_REASON.CHAIN_ID_MISMATCH, "typedData chainId mismatch");
  }

  const messagePurpose = String(typedData.message?.purpose || "").trim();
  if (messagePurpose !== WALLET_AUTH_PURPOSE) {
    throw authError(WALLET_AUTH_REASON.PURPOSE_MISMATCH, "message purpose mismatch");
  }

  const messageWallet = normalizeEvmAddress(typedData.message?.wallet);
  if (!messageWallet || messageWallet !== expectedWallet) {
    throw authError(WALLET_AUTH_REASON.WALLET_MISMATCH, "typedData wallet mismatch");
  }

  const messageOrigin = normalizeOrigin(typedData.message?.origin);
  if (!messageOrigin || messageOrigin !== expected) {
    throw authError(WALLET_AUTH_REASON.ORIGIN_MISMATCH, "typedData origin mismatch");
  }

  if (!challenge.challengeId || typeof challenge.challengeId !== "string") {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "challengeId missing");
  }
  if (!challenge.nonce || typeof challenge.nonce !== "string") {
    throw authError(WALLET_AUTH_REASON.INVALID_CHALLENGE, "nonce missing");
  }

  return {
    challengeId: challenge.challengeId,
    nonce: challenge.nonce,
    walletAddress: challengeWallet,
    typedData,
    expiresAt: challenge.expiresAt || null,
  };
}

/**
 * Validate confirm response into an in-memory session record.
 *
 * @param {object} payload
 * @param {{ walletAddress: string }} opts
 */
export function validateWalletAuthSession(payload, { walletAddress } = {}) {
  if (!payload || typeof payload !== "object") {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "session payload missing");
  }

  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  if (!token || !token.startsWith(WALLET_SESSION_TOKEN_PREFIX)) {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "invalid session token class");
  }
  // Opaque wallet sessions must not look like JWTs.
  if (token.slice(WALLET_SESSION_TOKEN_PREFIX.length).includes(".")) {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "token class mismatch");
  }

  if (payload.tokenType && String(payload.tokenType) !== "Bearer") {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "tokenType must be Bearer");
  }

  const scope = String(payload.scope || "").trim();
  if (scope !== WALLET_AUTH_SESSION_SCOPE) {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "unexpected session scope");
  }

  const expectedWallet = normalizeEvmAddress(walletAddress);
  const sessionWallet = normalizeEvmAddress(payload.walletAddress);
  if (!expectedWallet || !sessionWallet || sessionWallet !== expectedWallet) {
    throw authError(WALLET_AUTH_REASON.WALLET_MISMATCH, "session wallet mismatch");
  }

  const sessionId =
    typeof payload.sessionId === "string" && payload.sessionId.trim()
      ? payload.sessionId.trim()
      : null;
  if (!sessionId) {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "sessionId missing");
  }

  const expiresAtRaw = payload.expiresAt;
  if (!expiresAtRaw || typeof expiresAtRaw !== "string") {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "expiresAt missing");
  }
  const expiresMs = Date.parse(expiresAtRaw);
  if (!Number.isFinite(expiresMs)) {
    throw authError(WALLET_AUTH_REASON.INVALID_SESSION, "expiresAt invalid");
  }

  return {
    token,
    walletAddress: sessionWallet,
    sessionId,
    expiresAt: expiresAtRaw,
    expiresAtMs: expiresMs,
    scope,
  };
}

export function isWalletAuthSessionExpired(session, nowMs = Date.now()) {
  if (!session || typeof session !== "object") return true;
  const ms =
    typeof session.expiresAtMs === "number"
      ? session.expiresAtMs
      : Date.parse(session.expiresAt);
  if (!Number.isFinite(ms)) return true;
  return nowMs >= ms;
}

function isUserRejectionError(err) {
  const code = String(err?.code ?? err?.name ?? "").toLowerCase();
  const msg = String(err?.message || "").toLowerCase();
  const reason = String(err?.reasonCode || "").toLowerCase();
  if (reason === "user_rejected" || reason === WALLET_AUTH_REASON.USER_REJECTED.toLowerCase()) {
    return true;
  }
  if (code === "4001" || code.includes("rejected") || code.includes("denied")) return true;
  if (msg.includes("user rejected") || msg.includes("user denied") || msg.includes("rejected the request")) {
    return true;
  }
  return false;
}

/**
 * Full wallet-auth: challenge → validate → EIP-712 sign → confirm → validate session.
 *
 * @param {object} args
 * @param {string} args.walletAddress
 * @param {string} args.expectedOrigin
 * @param {number} [args.chainId]
 * @param {() => string|null|undefined} [args.getConnectedWallet]
 * @param {Function} [args.signTypedDataAsync]
 * @param {AbortSignal} [args.signal]
 * @param {{ createChallenge?: Function, confirm?: Function }} [args.api] injectable for tests
 */
export async function runWalletAuthFlow({
  walletAddress,
  expectedOrigin,
  chainId = WALLET_AUTH_CHAIN_ID,
  getConnectedWallet,
  getConnectedChainId,
  signTypedDataAsync,
  signal,
  api,
} = {}) {
  const startWallet = normalizeEvmAddress(walletAddress);
  if (!startWallet) {
    throw authError("INVALID_WALLET_ADDRESS", "wallet required");
  }
  if (!isEduNetChainId(chainId)) {
    throw authError(WALLET_AUTH_REASON.WRONG_CHAIN, "Besu Edu-Net required");
  }
  if (!normalizeOrigin(expectedOrigin)) {
    throw authError(WALLET_AUTH_REASON.ORIGIN_MISMATCH, "expectedOrigin required");
  }

  const assertSameWallet = () => {
    if (typeof getConnectedWallet !== "function") return;
    const now = normalizeEvmAddress(getConnectedWallet());
    if (now && now !== startWallet) {
      throw authError(WALLET_AUTH_REASON.WALLET_SWITCH, "wallet switched");
    }
  };

  const assertEduNetChain = () => {
    if (typeof getConnectedChainId !== "function") return;
    const live = normalizeWalletChainId(getConnectedChainId());
    if (live == null || live !== WALLET_AUTH_CHAIN_ID) {
      throw authError(WALLET_AUTH_REASON.WRONG_CHAIN, "chain switched away from Edu-Net");
    }
  };

  assertSameWallet();
  assertEduNetChain();

  const createChallenge = api?.createChallenge || createWalletAuthChallenge;
  const confirm = api?.confirm || confirmWalletAuth;

  let challenge;
  try {
    challenge = await createChallenge({
      walletAddress: startWallet,
      signal,
    });
  } catch (err) {
    if (err?.reasonCode === "WALLET_AUTH_API_DISABLED" || err?.payload?.error === "WALLET_AUTH_API_DISABLED") {
      throw authError(WALLET_AUTH_REASON.API_DISABLED, "wallet auth API disabled");
    }
    throw err;
  }

  assertSameWallet();
  assertEduNetChain();

  const validated = validateWalletAuthChallenge(challenge, {
    walletAddress: startWallet,
    expectedOrigin,
    expectedChainId: WALLET_AUTH_CHAIN_ID,
  });

  assertSameWallet();
  assertEduNetChain();

  let signature;
  try {
    signature = await signEip712TypedData(validated.typedData, {
      signTypedDataAsync,
      account: startWallet,
    });
  } catch (err) {
    if (isUserRejectionError(err)) {
      throw authError(WALLET_AUTH_REASON.USER_REJECTED, "user rejected signature");
    }
    err.reasonCode = err.reasonCode || "INVALID_SIGNATURE";
    throw err;
  }

  if (!signature || typeof signature !== "string") {
    throw authError("INVALID_SIGNATURE", "empty signature");
  }

  assertSameWallet();
  assertEduNetChain();

  const confirmPayload = await confirm({
    walletAddress: startWallet,
    challengeId: validated.challengeId,
    nonce: validated.nonce,
    signature,
    signal,
  });

  assertSameWallet();
  assertEduNetChain();

  return validateWalletAuthSession(confirmPayload, { walletAddress: startWallet });
}

/**
 * Pure in-memory session controller (no React, no storage).
 * Used by useWalletAuthSession and unit tests.
 */
export function createWalletAuthSessionController({
  runFlow = runWalletAuthFlow,
  logoutApi = logoutWalletAuth,
  isFrontendEnabled = isWalletAuthFrontendEnabled,
  now = () => Date.now(),
} = {}) {
  let session = null;
  let generation = 0;
  let inFlight = null;
  let unavailableReason = null;
  /** Server/local invalidation code for UX (SESSION_EXPIRED, …); not an authz claim. */
  let invalidationReason = null;
  let reauthAttempts = 0;
  const listeners = new Set();

  const emit = () => {
    for (const listener of listeners) {
      try {
        listener(getSnapshot());
      } catch {
        // ignore listener errors
      }
    }
  };

  const getSnapshot = () => {
    const expired = session ? isWalletAuthSessionExpired(session, now()) : false;
    return {
      session: session && !expired ? session : null,
      rawSession: session,
      expired: Boolean(session && expired),
      generation,
      authenticating: Boolean(inFlight),
      unavailableReason,
      invalidationReason,
      reauthAttempts,
      bearerToken: session && !expired ? session.token : null,
    };
  };

  const bumpGeneration = () => {
    generation += 1;
  };

  const clearSession = ({ reason = null, markUnavailable = false } = {}) => {
    bumpGeneration();
    session = null;
    invalidationReason = reason || null;
    if (markUnavailable && reason) {
      unavailableReason = reason;
    }
    emit();
  };

  const invalidateForLifecycle = () => {
    // Drop session without marking API unavailable (wallet/chain events).
    bumpGeneration();
    session = null;
    invalidationReason = null;
    reauthAttempts = 0;
    emit();
  };

  const invalidateFromAuthError = (reasonCode) => {
    const code =
      typeof reasonCode === "string" && reasonCode.trim()
        ? reasonCode.trim()
        : WALLET_AUTH_REASON.EXPIRED;
    bumpGeneration();
    session = null;
    invalidationReason = code;
    reauthAttempts = 0;
    emit();
  };

  const markApiDisabled = () => {
    unavailableReason = WALLET_AUTH_REASON.API_DISABLED;
    bumpGeneration();
    session = null;
    invalidationReason = null;
    emit();
  };

  // Sync function (not async) so duplicate callers receive the same Promise reference.
  const authenticate = (args = {}) => {
    if (!isFrontendEnabled(args.env)) {
      return Promise.reject(
        authError(WALLET_AUTH_REASON.FRONTEND_DISABLED, "frontend flag off")
      );
    }
    if (unavailableReason === WALLET_AUTH_REASON.API_DISABLED) {
      return Promise.reject(
        authError(WALLET_AUTH_REASON.API_DISABLED, "wallet auth API disabled")
      );
    }

    const eligibility = getWalletAuthEligibility(args);
    if (!eligibility.ok) {
      return Promise.reject(authError(eligibility.reasonCode, eligibility.reasonCode));
    }

    const wallet = normalizeEvmAddress(args.walletAddress);
    if (!wallet) {
      return Promise.reject(authError("INVALID_WALLET_ADDRESS", "wallet required"));
    }

    if (inFlight) {
      return inFlight;
    }

    const allowReauth = args.allowReauth === true;
    if (allowReauth) {
      if (reauthAttempts >= 1) {
        return Promise.reject(
          authError(WALLET_AUTH_REASON.REAUTH_LIMIT, "reauth limit reached")
        );
      }
      reauthAttempts += 1;
    } else {
      reauthAttempts = 0;
    }

    const myGen = ++generation;
    const abortController =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = args.signal || abortController?.signal;

    inFlight = (async () => {
      try {
        const next = await runFlow({
          walletAddress: wallet,
          expectedOrigin: args.expectedOrigin,
          chainId: args.chainId ?? WALLET_AUTH_CHAIN_ID,
          getConnectedWallet: args.getConnectedWallet,
          getConnectedChainId: args.getConnectedChainId,
          signTypedDataAsync: args.signTypedDataAsync,
          signal,
          api: args.api,
        });
        if (myGen !== generation) {
          throw authError(WALLET_AUTH_REASON.WALLET_SWITCH, "stale auth discarded");
        }
        session = next;
        unavailableReason = null;
        invalidationReason = null;
        reauthAttempts = 0;
        emit();
        return next;
      } catch (err) {
        if (
          err?.reasonCode === WALLET_AUTH_REASON.API_DISABLED ||
          err?.payload?.error === "WALLET_AUTH_API_DISABLED"
        ) {
          markApiDisabled();
        }
        throw err;
      } finally {
        inFlight = null;
        emit();
      }
    })();

    return inFlight;
  };

  const logout = async ({ signal } = {}) => {
    const token = session?.token;
    bumpGeneration();
    session = null;
    invalidationReason = null;
    reauthAttempts = 0;
    emit();
    if (!token) return { ok: true, localOnly: true };
    try {
      await logoutApi({ token, signal });
      return { ok: true, localOnly: false };
    } catch {
      // Best-effort server revoke; local session already cleared.
      return { ok: true, localOnly: true, revokeFailed: true };
    }
  };

  const onWalletAddressChange = (nextAddress, previousAddress) => {
    const next = normalizeEvmAddress(nextAddress);
    const prev = normalizeEvmAddress(previousAddress);
    if (!next || (prev && next !== prev) || (session && session.walletAddress !== next)) {
      invalidateForLifecycle();
    }
  };

  const onChainChange = (nextChainId) => {
    if (!isEduNetChainId(nextChainId)) {
      invalidateForLifecycle();
      return;
    }
    // Even when landing back on Edu-Net, prior session was bound to prior chain context.
    invalidateForLifecycle();
  };

  const onDisconnect = () => {
    invalidateForLifecycle();
  };

  const checkExpiration = () => {
    if (session && isWalletAuthSessionExpired(session, now())) {
      bumpGeneration();
      session = null;
      invalidationReason = WALLET_AUTH_REASON.EXPIRED;
      emit();
      return true;
    }
    return false;
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot,
    authenticate,
    logout,
    clearSession,
    invalidateForLifecycle,
    invalidateFromAuthError,
    markApiDisabled,
    onWalletAddressChange,
    onChainChange,
    onDisconnect,
    checkExpiration,
    get generation() {
      return generation;
    },
  };
}
