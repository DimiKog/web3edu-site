/**
 * WA-01c2 — explicit Bearer selection for /web3sbt/resolve.
 *
 * Priority:
 * 1. Authenticated Keycloak → idToken
 * 2. Eligible wallet-only + valid in-memory session → w3wa1_ token
 * 3. Otherwise → no Bearer
 *
 * Never combine credentials. Never reuse a wallet token for another address.
 * Frontend eligibility is not authorization — backend Policy B remains authoritative.
 */

import { normalizeEvmAddress } from "./evmAddress.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import {
  WALLET_AUTH_REASON,
  WALLET_SESSION_TOKEN_PREFIX,
  isEduNetChainId,
  isWalletAuthFrontendEnabled,
  isWalletAuthSessionExpired,
} from "./walletAuthFlow.js";

export const RESOLVE_BEARER_KIND = Object.freeze({
  KEYCLOAK: "keycloak",
  WALLET: "wallet",
  NONE: "none",
});

export const WALLET_SESSION_AUTH_FAILURE_CODES = Object.freeze(
  new Set(["SESSION_EXPIRED", "SESSION_REVOKED", "SESSION_NOT_FOUND"])
);

/**
 * @param {unknown} err
 * @returns {boolean}
 */
export function isWalletSessionAuthFailureError(err) {
  if (!err || err.status !== 401) return false;
  const code = err.payload?.reasonCode || err.reasonCode || err.code || null;
  return typeof code === "string" && WALLET_SESSION_AUTH_FAILURE_CODES.has(code);
}

/**
 * Wallet-only Dashboard eligibility for attaching a wallet Bearer.
 * Requires identity address === connected EOA (Policy B target shape).
 */
export function isWalletOnlyResolveAuthEligible({
  isOidcAuthenticated = false,
  viewerSource = null,
  walletEntryStatus = null,
  walletEntryMode = null,
  identityAddress = null,
  connectedEoa = null,
  chainId = null,
  frontendEnabled = undefined,
} = {}) {
  const flagOn =
    frontendEnabled === undefined
      ? isWalletAuthFrontendEnabled()
      : Boolean(frontendEnabled);
  if (!flagOn) return false;
  if (isOidcAuthenticated) return false;
  if (viewerSource !== VIEWER_SOURCE_CONNECTED_EOA) return false;
  const modeOk =
    walletEntryMode === "wallet_only" ||
    walletEntryStatus === WALLET_ENTRY_WALLET_ONLY;
  if (!modeOk) return false;
  if (!isEduNetChainId(chainId)) return false;

  const id = normalizeEvmAddress(identityAddress);
  const eoa = normalizeEvmAddress(connectedEoa);
  if (!id || !eoa || id !== eoa) return false;
  return true;
}

/**
 * @param {object|null|undefined} session
 * @param {string|null|undefined} identityAddress
 * @param {string|null|undefined} connectedEoa
 */
export function walletSessionMatchesIdentity(session, identityAddress, connectedEoa) {
  if (!session || typeof session !== "object") return false;
  if (isWalletAuthSessionExpired(session)) return false;
  const token = typeof session.token === "string" ? session.token.trim() : "";
  if (!token.startsWith(WALLET_SESSION_TOKEN_PREFIX)) return false;
  const sessionWallet = normalizeEvmAddress(session.walletAddress);
  const id = normalizeEvmAddress(identityAddress);
  const eoa = normalizeEvmAddress(connectedEoa);
  if (!sessionWallet || !id || !eoa) return false;
  return sessionWallet === id && sessionWallet === eoa;
}

/**
 * @returns {{ kind: string, token: string|null, authStateKey: string, reasonCode: string|null }}
 */
export function selectResolveBearer({
  isOidcAuthenticated = false,
  idToken = null,
  walletSession = null,
  viewerSource = null,
  walletEntryStatus = null,
  walletEntryMode = null,
  identityAddress = null,
  connectedEoa = null,
  chainId = null,
  frontendEnabled = undefined,
} = {}) {
  if (isOidcAuthenticated) {
    const token =
      typeof idToken === "string" && idToken.trim() ? idToken.trim() : null;
    return {
      kind: token ? RESOLVE_BEARER_KIND.KEYCLOAK : RESOLVE_BEARER_KIND.NONE,
      token,
      authStateKey: token ? "keycloak" : "anon",
      reasonCode: token ? null : WALLET_AUTH_REASON.OIDC_ACTIVE,
    };
  }

  const eligible = isWalletOnlyResolveAuthEligible({
    isOidcAuthenticated: false,
    viewerSource,
    walletEntryStatus,
    walletEntryMode,
    identityAddress,
    connectedEoa,
    chainId,
    frontendEnabled,
  });

  if (
    eligible &&
    walletSessionMatchesIdentity(walletSession, identityAddress, connectedEoa)
  ) {
    const token = walletSession.token.trim();
    const sessionId =
      typeof walletSession.sessionId === "string" && walletSession.sessionId.trim()
        ? walletSession.sessionId.trim()
        : "session";
    return {
      kind: RESOLVE_BEARER_KIND.WALLET,
      token,
      authStateKey: `wallet:${sessionId}`,
      reasonCode: null,
    };
  }

  return {
    kind: RESOLVE_BEARER_KIND.NONE,
    token: null,
    authStateKey: "anon",
    reasonCode: eligible ? null : WALLET_AUTH_REASON.NOT_WALLET_ONLY,
  };
}

/**
 * UI state for the wallet-only verify banner (not an authorization claim).
 *
 * @returns {'hidden'|'prompt'|'signing'|'rejected'|'expired'|'unavailable'}
 */
export function getWalletAuthProgressUiState({
  isOidcAuthenticated = false,
  eligible = false,
  frontendEnabled = false,
  isAvailable = true,
  isAuthenticating = false,
  hasWalletSession = false,
  sessionInvalidationReason = null,
  authErrorReason = null,
} = {}) {
  if (isOidcAuthenticated || !frontendEnabled || !eligible) {
    return "hidden";
  }
  if (!isAvailable) return "unavailable";
  if (isAuthenticating) return "signing";
  if (hasWalletSession) return "hidden";
  if (
    sessionInvalidationReason &&
    WALLET_SESSION_AUTH_FAILURE_CODES.has(sessionInvalidationReason)
  ) {
    return "expired";
  }
  if (
    authErrorReason === WALLET_AUTH_REASON.USER_REJECTED ||
    authErrorReason === "USER_REJECTED"
  ) {
    return "rejected";
  }
  return "prompt";
}
