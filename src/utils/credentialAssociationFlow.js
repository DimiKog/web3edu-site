/**
 * IC-03A — wallet-first credential association onboarding helpers.
 *
 * Explicit EOA signature associates an existing AA-held Web3Edu SBT as
 * credential provenance. Does not mint, create AA, migrate progress, or
 * grant private educational access. Does not invent identity mappings.
 *
 * Reuses signEip712TypedData but never wallet-auth / wallet-link purposes.
 */

import {
  confirmCredentialAssociation,
  createCredentialAssociationChallenge,
  lookupCredentialAssociation,
} from "../api/credentialAssociation.js";
import { fetchCanonicalIdentityResolve } from "../api/canonicalIdentity.js";
import { resolveIdentity } from "../api/aa.js";
import {
  pickSmartAccountFromPayload,
  resolveIndicatesMintedIdentity,
} from "./aaResolvePayload.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import { signEip712TypedData } from "./signEip712TypedData.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import {
  WALLET_AUTH_CHAIN_ID,
  WALLET_AUTH_PURPOSE,
  WALLET_LINK_PURPOSE,
  isEduNetChainId,
  normalizeOrigin,
  normalizeWalletChainId,
} from "./walletAuthFlow.js";

export const CREDENTIAL_ASSOCIATION_PURPOSE = "WEB3EDU_CREDENTIAL_ASSOCIATION";
export const CREDENTIAL_ASSOCIATION_PRIMARY_TYPE = "CredentialAssociation";
export const CREDENTIAL_ASSOCIATION_CHAIN_ID = WALLET_AUTH_CHAIN_ID;
export const CREDENTIAL_ASSOCIATION_DOMAIN_NAME = "Web3Edu";
export const CREDENTIAL_ASSOCIATION_DOMAIN_VERSION = "1";
export const CREDENTIAL_ASSOCIATION_ACTION_ASSOCIATE = "ASSOCIATE";

/** Default AA-held SBT (Besu Edu-Net). Overridable via VITE_AA_SBT_CONTRACT. */
export const DEFAULT_AA_SBT_CONTRACT =
  "0x5e67E43cd14DaAb71B01A5268d209CB3b69dC175";

export const CREDENTIAL_ASSOCIATION_REASON = Object.freeze({
  FRONTEND_DISABLED: "CREDENTIAL_ASSOCIATION_FRONTEND_DISABLED",
  API_DISABLED: "CREDENTIAL_ASSOCIATION_API_DISABLED",
  UNAVAILABLE: "CREDENTIAL_ASSOCIATION_UNAVAILABLE",
  NOT_WALLET_ONLY: "CREDENTIAL_ASSOCIATION_NOT_WALLET_ONLY",
  OIDC_ACTIVE: "CREDENTIAL_ASSOCIATION_OIDC_ACTIVE",
  SOCIAL_EXCLUDED: "SOCIAL_LEARNER_NOT_ELIGIBLE",
  LINKED_ALIAS: "CREDENTIAL_ASSOCIATION_LINKED_ALIAS_EXCLUDED",
  DEVICE_AA: "CREDENTIAL_ASSOCIATION_DEVICE_AA_EXCLUDED",
  WALLET_DISCONNECTED: "CREDENTIAL_ASSOCIATION_WALLET_DISCONNECTED",
  WRONG_CHAIN: "WRONG_CHAIN",
  WRONG_WALLET: "WRONG_EOA",
  WALLET_SWITCH: "WALLET_SWITCH",
  MISSING_AA_SBT: "MISSING_AA_SBT",
  ALREADY_VERIFIED: "ASSOCIATION_ACTIVE_VERIFIED",
  INVALID_CHALLENGE: "INVALID_CHALLENGE",
  PURPOSE_MISMATCH: "PURPOSE_MISMATCH",
  CHAIN_ID_MISMATCH: "CHAIN_ID_MISMATCH",
  ORIGIN_MISMATCH: "ORIGIN_MISMATCH",
  USER_REJECTED: "USER_REJECTED",
  CHALLENGE_EXPIRED: "CHALLENGE_EXPIRED",
  RPC_UNAVAILABLE: "RPC_UNAVAILABLE",
  NOT_ISSUED_AFTER_CONFIRM: "CREDENTIAL_NOT_ISSUED_AFTER_CONFIRM",
  LEARNER_NOT_ELIGIBLE: "LEARNER_NOT_ELIGIBLE",
});

export const CREDENTIAL_ASSOCIATION_UI = Object.freeze({
  HIDDEN: "hidden",
  PROMPT: "prompt",
  VERIFIED: "verified",
  MISSING_CREDENTIAL: "missing_credential",
  SIGNING: "signing",
  REJECTED: "rejected",
  EXPIRED: "expired",
  WRONG_WALLET: "wrong_wallet",
  WRONG_NETWORK: "wrong_network",
  RPC_UNAVAILABLE: "rpc_unavailable",
  UNAVAILABLE: "unavailable",
});

function assocError(reasonCode, message) {
  const err = new Error(message || reasonCode);
  err.reasonCode = reasonCode;
  return err;
}

/**
 * Frontend opt-in. Exact "1" or case-insensitive "true" enables.
 * Default OFF when unset.
 */
export function isCredentialAssociationFrontendEnabled(env = undefined) {
  const source =
    env !== undefined
      ? env
      : typeof import.meta !== "undefined"
        ? import.meta.env
        : undefined;
  const raw = source?.VITE_CREDENTIAL_ASSOCIATION_ENABLED;
  if (raw == null) return false;
  const v = String(raw).trim().toLowerCase();
  return v === "1" || v === "true";
}

export function getConfiguredAaSbtContract(env = undefined) {
  const source =
    env !== undefined
      ? env
      : typeof import.meta !== "undefined"
        ? import.meta.env
        : undefined;
  const raw = source?.VITE_AA_SBT_CONTRACT || DEFAULT_AA_SBT_CONTRACT;
  return normalizeEvmAddress(raw) || DEFAULT_AA_SBT_CONTRACT.toLowerCase();
}

export function coerceTokenId(raw) {
  if (typeof raw === "boolean" || raw == null || raw === "") return null;
  if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0) return raw;
  if (typeof raw === "bigint") {
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 ? n : null;
  }
  if (typeof raw === "string" && /^\d+$/.test(raw.trim())) {
    return Number(raw.trim());
  }
  return null;
}

/**
 * Extract AA + tokenId from POST /aa/identity/resolve — the approved discovery path.
 * Does not invent AA from factory prediction alone.
 */
export function extractAaHeldCredential(aaPayload) {
  if (!aaPayload || typeof aaPayload !== "object") return null;
  const aaAddress = normalizeEvmAddress(pickSmartAccountFromPayload(aaPayload));
  const tokenId = coerceTokenId(aaPayload.tokenId ?? aaPayload.token_id);
  const minted = resolveIndicatesMintedIdentity(aaPayload);
  if (!aaAddress || tokenId == null || !minted) return null;
  return {
    aaAddress,
    tokenId,
    alreadyMinted: true,
    smartAccount: aaAddress,
  };
}

/**
 * Read credential + association blocks from GET /web3edu/identity/resolve payload.
 */
export function readCanonicalCredentialBlocks(payload) {
  const identity = payload?.identity && typeof payload.identity === "object"
    ? payload.identity
    : null;
  const credential =
    payload?.credential && typeof payload.credential === "object"
      ? payload.credential
      : null;
  const association =
    payload?.credentialAssociation &&
    typeof payload.credentialAssociation === "object"
      ? payload.credentialAssociation
      : payload?.association && typeof payload.association === "object"
        ? payload.association
        : null;
  return {
    identity,
    credential,
    association,
    mode: typeof identity?.mode === "string" ? identity.mode : null,
    status: typeof identity?.status === "string" ? identity.status : null,
    progressAddress: normalizeEvmAddress(identity?.progressAddress),
    isWalletOnly: identity?.mode === "wallet_only",
    credentialStatus:
      typeof credential?.status === "string" ? credential.status : null,
    currentlyVerified: association?.currentlyVerified === true,
    associationVerification:
      typeof association?.verificationStatus === "string"
        ? association.verificationStatus
        : null,
  };
}

/**
 * Gate: who may see / run credential association (no auto-sign).
 *
 * IC-03B: eligibility is based on the connected EOA + authoritative backend
 * wallet-only resolution — not solely on Dashboard viewerSource. A device-AA
 * UI context must not hide the CTA when wallet-entry established wallet_only.
 * Social-linked / unresolved learners remain excluded. Independent of WA-01.
 */
export function getCredentialAssociationEligibility({
  isOidcAuthenticated = false,
  isConnected = false,
  chainId = null,
  viewerSource = null,
  walletEntryStatus = null,
  walletEntryMode = null,
  walletOnlyModeEstablished = false,
} = {}) {
  if (isOidcAuthenticated || viewerSource === VIEWER_SOURCE_OIDC_SOCIAL) {
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.SOCIAL_EXCLUDED,
    };
  }
  if (
    viewerSource === VIEWER_SOURCE_LINKED_WALLET_ALIAS ||
    walletEntryStatus === WALLET_ENTRY_LINKED_ALIAS
  ) {
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.LINKED_ALIAS,
    };
  }
  if (!isConnected) {
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.WALLET_DISCONNECTED,
    };
  }
  if (!isEduNetChainId(chainId)) {
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN,
    };
  }

  const modeOk =
    walletEntryMode === "wallet_only" ||
    walletEntryStatus === WALLET_ENTRY_WALLET_ONLY ||
    walletOnlyModeEstablished === true;
  if (!modeOk) {
    // Device AA alone (no backend wallet_only) is not credential-association eligible.
    if (viewerSource === VIEWER_SOURCE_DEVICE_AA) {
      return {
        eligible: false,
        reasonCode: CREDENTIAL_ASSOCIATION_REASON.DEVICE_AA,
      };
    }
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.NOT_WALLET_ONLY,
    };
  }

  // Authoritative wallet-only established: allow even if viewerSource is still
  // device_aa (legacy UI context) or connected_eoa. Never auto-associate.
  if (
    viewerSource != null &&
    viewerSource !== VIEWER_SOURCE_CONNECTED_EOA &&
    viewerSource !== VIEWER_SOURCE_DEVICE_AA
  ) {
    return {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.NOT_WALLET_ONLY,
    };
  }

  return { eligible: true, reasonCode: null };
}

/**
 * Map discovery + lookup into a banner UI state. Never triggers signing.
 */
export function assessCredentialAssociationUiState({
  frontendEnabled = false,
  eligibility = { eligible: false },
  canonical = null,
  aaCredential = null,
  associationLookup = null,
  flowPhase = "idle",
  flowReasonCode = null,
} = {}) {
  if (!frontendEnabled) {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.HIDDEN, reasonCode: CREDENTIAL_ASSOCIATION_REASON.FRONTEND_DISABLED };
  }

  if (flowPhase === "signing") {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.SIGNING, reasonCode: null };
  }

  if (flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.USER_REJECTED) {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.REJECTED, reasonCode: flowReasonCode };
  }
  if (
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.CHALLENGE_EXPIRED ||
    flowReasonCode === "CHALLENGE_EXPIRED"
  ) {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.EXPIRED, reasonCode: flowReasonCode };
  }
  if (
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.WRONG_WALLET ||
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.WALLET_SWITCH ||
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.WALLET_DISCONNECTED ||
    flowReasonCode === "WRONG_EOA" ||
    flowReasonCode === "SIGNER_MISMATCH"
  ) {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.WRONG_WALLET, reasonCode: flowReasonCode };
  }
  if (
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN ||
    flowReasonCode === "WRONG_CHAIN" ||
    flowReasonCode === "CHAIN_ID_MISMATCH"
  ) {
    return { uiState: CREDENTIAL_ASSOCIATION_UI.WRONG_NETWORK, reasonCode: flowReasonCode };
  }
  if (
    flowReasonCode === CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE ||
    flowReasonCode === "AA_OWNERSHIP_LOOKUP_FAILED" ||
    flowReasonCode === "SBT_OWNERSHIP_LOOKUP_FAILED" ||
    flowReasonCode === "ASSOCIATION_VERIFICATION_UNAVAILABLE"
  ) {
    return {
      uiState: CREDENTIAL_ASSOCIATION_UI.RPC_UNAVAILABLE,
      reasonCode: flowReasonCode,
    };
  }

  if (!eligibility?.eligible) {
    if (
      eligibility?.reasonCode === CREDENTIAL_ASSOCIATION_REASON.SOCIAL_EXCLUDED ||
      eligibility?.reasonCode === CREDENTIAL_ASSOCIATION_REASON.OIDC_ACTIVE
    ) {
      return {
        uiState: CREDENTIAL_ASSOCIATION_UI.HIDDEN,
        reasonCode: eligibility.reasonCode,
      };
    }
    if (eligibility?.reasonCode === CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN) {
      return {
        uiState: CREDENTIAL_ASSOCIATION_UI.WRONG_NETWORK,
        reasonCode: eligibility.reasonCode,
      };
    }
    return {
      uiState: CREDENTIAL_ASSOCIATION_UI.HIDDEN,
      reasonCode: eligibility?.reasonCode || CREDENTIAL_ASSOCIATION_REASON.NOT_WALLET_ONLY,
    };
  }

  const lookupVerified =
    associationLookup?.currentlyVerified === true ||
    associationLookup?.verificationStatus === "VERIFIED" ||
    associationLookup?.reasonCode === "ASSOCIATION_ACTIVE_VERIFIED" ||
    associationLookup?.ok === true;
  const resolveVerified = canonical?.currentlyVerified === true;
  if (lookupVerified || resolveVerified || canonical?.credentialStatus === "ISSUED") {
    // ISSUED alone is not always association — only treat as verified when
    // association block says so, or lookup verified. Pure EOA-held ISSUED stays hidden.
    if (lookupVerified || resolveVerified) {
      return {
        uiState: CREDENTIAL_ASSOCIATION_UI.VERIFIED,
        reasonCode: CREDENTIAL_ASSOCIATION_REASON.ALREADY_VERIFIED,
      };
    }
  }

  if (!aaCredential) {
    return {
      uiState: CREDENTIAL_ASSOCIATION_UI.MISSING_CREDENTIAL,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.MISSING_AA_SBT,
    };
  }

  if (!canonical?.isWalletOnly || !canonical?.progressAddress) {
    return {
      uiState: CREDENTIAL_ASSOCIATION_UI.HIDDEN,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.LEARNER_NOT_ELIGIBLE,
    };
  }

  // Eligible wallet-first learner with AA-held SBT and no verified association.
  return {
    uiState: CREDENTIAL_ASSOCIATION_UI.PROMPT,
    reasonCode: null,
  };
}

/**
 * Validate challenge before signing. Rejects WA-01 / H3C typed data.
 */
export function validateCredentialAssociationChallenge(
  challenge,
  {
    eoaAddress,
    aaAddress,
    tokenId,
    sbtContract,
    expectedOrigin,
    expectedChainId = CREDENTIAL_ASSOCIATION_CHAIN_ID,
  } = {}
) {
  if (!challenge || typeof challenge !== "object") {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE, "challenge missing");
  }

  const purpose = String(challenge.purpose || "").trim();
  if (purpose === WALLET_AUTH_PURPOSE || purpose === WALLET_LINK_PURPOSE) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH, "foreign purpose");
  }
  if (purpose !== CREDENTIAL_ASSOCIATION_PURPOSE) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH, "unexpected purpose");
  }

  const chainId = Number(challenge.chainId);
  if (chainId !== Number(expectedChainId) || chainId !== CREDENTIAL_ASSOCIATION_CHAIN_ID) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.CHAIN_ID_MISMATCH, "unexpected chainId");
  }

  const expectedEoa = normalizeEvmAddress(eoaAddress);
  const challengeEoa = normalizeEvmAddress(challenge.eoaAddress || challenge.eoa);
  if (!expectedEoa || !challengeEoa || challengeEoa !== expectedEoa) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_WALLET, "challenge eoa mismatch");
  }

  const expectedAa = normalizeEvmAddress(aaAddress);
  const challengeAa = normalizeEvmAddress(challenge.aaAddress || challenge.aa);
  if (!expectedAa || !challengeAa || challengeAa !== expectedAa) {
    throw assocError("WRONG_AA", "challenge aa mismatch");
  }

  const expectedTid = coerceTokenId(tokenId);
  const challengeTid = coerceTokenId(challenge.tokenId);
  if (expectedTid == null || challengeTid == null || challengeTid !== expectedTid) {
    throw assocError("INVALID_TOKEN_ID", "challenge tokenId mismatch");
  }

  if (sbtContract) {
    const expectedSbt = normalizeEvmAddress(sbtContract);
    const challengeSbt = normalizeEvmAddress(challenge.sbtContract);
    if (!expectedSbt || !challengeSbt || challengeSbt !== expectedSbt) {
      throw assocError("WRONG_SBT", "challenge sbt mismatch");
    }
  }

  const expected = normalizeOrigin(expectedOrigin);
  const got = normalizeOrigin(challenge.origin);
  if (!expected || !got || expected !== got) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.ORIGIN_MISMATCH, "origin mismatch");
  }

  const typedData = challenge.typedData;
  if (!typedData || typeof typedData !== "object") {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE, "typedData missing");
  }
  if (
    typedData.primaryType === "WalletAuth" ||
    typedData.primaryType === "WalletBinding" ||
    typedData.types?.WalletAuth ||
    typedData.types?.WalletBinding
  ) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH, "foreign typed data");
  }
  if (typedData.primaryType !== CREDENTIAL_ASSOCIATION_PRIMARY_TYPE) {
    throw assocError(
      CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE,
      "primaryType must be CredentialAssociation"
    );
  }
  if (!typedData.types?.CredentialAssociation) {
    throw assocError(
      CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE,
      "CredentialAssociation types missing"
    );
  }

  if (
    typedData.domain?.name !== CREDENTIAL_ASSOCIATION_DOMAIN_NAME ||
    String(typedData.domain?.version) !== CREDENTIAL_ASSOCIATION_DOMAIN_VERSION
  ) {
    throw assocError("CHALLENGE_CONTEXT_MISMATCH", "domain mismatch");
  }

  const domainChain = Number(typedData.domain?.chainId);
  const messageChain = Number(typedData.message?.chainId);
  if (
    domainChain !== CREDENTIAL_ASSOCIATION_CHAIN_ID ||
    messageChain !== CREDENTIAL_ASSOCIATION_CHAIN_ID
  ) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.CHAIN_ID_MISMATCH, "typedData chainId");
  }

  const messagePurpose = String(typedData.message?.purpose || "").trim();
  if (messagePurpose !== CREDENTIAL_ASSOCIATION_PURPOSE) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH, "message purpose");
  }

  const messageEoa = normalizeEvmAddress(typedData.message?.eoa);
  if (!messageEoa || messageEoa !== expectedEoa) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_WALLET, "typedData eoa");
  }

  const messageAa = normalizeEvmAddress(typedData.message?.aa);
  if (!messageAa || messageAa !== expectedAa) {
    throw assocError("WRONG_AA", "typedData aa");
  }

  const messageOrigin = normalizeOrigin(typedData.message?.origin);
  if (!messageOrigin || messageOrigin !== expected) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.ORIGIN_MISMATCH, "typedData origin");
  }

  if (!challenge.challengeId || typeof challenge.challengeId !== "string") {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE, "challengeId missing");
  }
  if (!challenge.nonce || typeof challenge.nonce !== "string") {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.INVALID_CHALLENGE, "nonce missing");
  }

  return {
    challengeId: challenge.challengeId,
    nonce: challenge.nonce,
    eoaAddress: challengeEoa,
    aaAddress: challengeAa,
    sbtContract: normalizeEvmAddress(challenge.sbtContract),
    tokenId: challengeTid,
    typedData,
    expiresAt: challenge.expiresAt || null,
  };
}

function isUserRejectionError(err) {
  const code = String(err?.code ?? err?.name ?? "").toLowerCase();
  const msg = String(err?.message || "").toLowerCase();
  const reason = String(err?.reasonCode || "").toLowerCase();
  if (reason === "user_rejected" || reason === "user_rejected".toLowerCase()) return true;
  if (reason === CREDENTIAL_ASSOCIATION_REASON.USER_REJECTED.toLowerCase()) return true;
  if (code === "4001" || code.includes("rejected") || code.includes("denied")) return true;
  if (
    msg.includes("user rejected") ||
    msg.includes("user denied") ||
    msg.includes("rejected the request")
  ) {
    return true;
  }
  return false;
}

function mapConfirmError(err) {
  const code = err?.reasonCode || err?.payload?.reasonCode || err?.payload?.error || err?.message;
  const s = String(code || "");
  if (s === "CHALLENGE_EXPIRED" || s.includes("EXPIRED")) {
    return assocError(CREDENTIAL_ASSOCIATION_REASON.CHALLENGE_EXPIRED, s);
  }
  if (
    s === "AA_OWNERSHIP_LOOKUP_FAILED" ||
    s === "SBT_OWNERSHIP_LOOKUP_FAILED" ||
    s === "ASSOCIATION_VERIFICATION_UNAVAILABLE"
  ) {
    return assocError(CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE, s);
  }
  if (s === "CREDENTIAL_ASSOCIATION_API_DISABLED" || err?.status === 404) {
    return assocError(CREDENTIAL_ASSOCIATION_REASON.API_DISABLED, s);
  }
  if (s === "SOCIAL_LEARNER_NOT_ELIGIBLE") {
    return assocError(CREDENTIAL_ASSOCIATION_REASON.SOCIAL_EXCLUDED, s);
  }
  err.reasonCode = err.reasonCode || s;
  return err;
}

/**
 * Full association: challenge → validate → EIP-712 sign → confirm.
 * Never persists challenge/signature. Never mints.
 *
 * @param {object} args
 */
export async function runCredentialAssociationFlow({
  eoaAddress,
  aaAddress,
  tokenId,
  sbtContract,
  expectedOrigin,
  chainId = CREDENTIAL_ASSOCIATION_CHAIN_ID,
  getConnectedWallet,
  getConnectedChainId,
  signTypedDataAsync,
  signal,
  api,
} = {}) {
  const startEoa = normalizeEvmAddress(eoaAddress);
  const startAa = normalizeEvmAddress(aaAddress);
  const tid = coerceTokenId(tokenId);
  const sbt =
    normalizeEvmAddress(sbtContract) || getConfiguredAaSbtContract();

  if (!startEoa) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_WALLET, "eoa required");
  }
  if (!startAa) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.MISSING_AA_SBT, "aa required");
  }
  if (tid == null) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.MISSING_AA_SBT, "tokenId required");
  }
  if (!isEduNetChainId(chainId)) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN, "Besu Edu-Net required");
  }
  if (!normalizeOrigin(expectedOrigin)) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.ORIGIN_MISMATCH, "expectedOrigin required");
  }

  const assertSameWallet = () => {
    if (typeof getConnectedWallet !== "function") return;
    const now = normalizeEvmAddress(getConnectedWallet());
    if (!now) {
      throw assocError(
        CREDENTIAL_ASSOCIATION_REASON.WALLET_DISCONNECTED,
        "wallet disconnected"
      );
    }
    if (now !== startEoa) {
      throw assocError(CREDENTIAL_ASSOCIATION_REASON.WALLET_SWITCH, "wallet switched");
    }
  };

  const assertEduNetChain = () => {
    if (typeof getConnectedChainId !== "function") return;
    const live = normalizeWalletChainId(getConnectedChainId());
    if (live == null || live !== CREDENTIAL_ASSOCIATION_CHAIN_ID) {
      throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN, "chain switched");
    }
  };

  assertSameWallet();
  assertEduNetChain();

  const createChallenge =
    api?.createChallenge || createCredentialAssociationChallenge;
  const confirm = api?.confirm || confirmCredentialAssociation;

  let challenge;
  try {
    challenge = await createChallenge({
      eoaAddress: startEoa,
      aaAddress: startAa,
      tokenId: tid,
      sbtContract: sbt,
      action: CREDENTIAL_ASSOCIATION_ACTION_ASSOCIATE,
      signal,
    });
  } catch (err) {
    throw mapConfirmError(err);
  }

  assertSameWallet();
  assertEduNetChain();

  const validated = validateCredentialAssociationChallenge(challenge, {
    eoaAddress: startEoa,
    aaAddress: startAa,
    tokenId: tid,
    sbtContract: sbt,
    expectedOrigin,
    expectedChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
  });

  assertSameWallet();
  assertEduNetChain();

  let signature;
  try {
    signature = await signEip712TypedData(validated.typedData, {
      signTypedDataAsync,
      account: startEoa,
    });
  } catch (err) {
    if (isUserRejectionError(err)) {
      throw assocError(CREDENTIAL_ASSOCIATION_REASON.USER_REJECTED, "user rejected signature");
    }
    err.reasonCode = err.reasonCode || "INVALID_SIGNATURE";
    throw err;
  }

  if (!signature || typeof signature !== "string") {
    throw assocError("INVALID_SIGNATURE", "empty signature");
  }

  assertSameWallet();
  assertEduNetChain();

  let confirmPayload;
  try {
    confirmPayload = await confirm({
      eoaAddress: startEoa,
      aaAddress: startAa,
      tokenId: tid,
      sbtContract: validated.sbtContract || sbt,
      challengeId: validated.challengeId,
      nonce: validated.nonce,
      signature,
      signal,
    });
  } catch (err) {
    throw mapConfirmError(err);
  }

  if (!confirmPayload?.ok && confirmPayload?.reasonCode !== "ASSOCIATION_CREATED") {
    throw assocError(
      confirmPayload?.reasonCode || "CONFIRM_FAILED",
      "confirm failed"
    );
  }

  return {
    ok: true,
    reasonCode: confirmPayload?.reasonCode || "ASSOCIATION_CREATED",
    association: confirmPayload?.association || null,
    // Explicit: no mint / no AA creation side effects from this flow.
    minted: false,
    createdAa: false,
  };
}

/**
 * Guard for applying async discovery results after wallet/chain/eligibility churn.
 * Generation + AbortController alone are not enough if a late resolve lands after
 * disconnect or a switch back to a different context with the same generation race.
 */
export function shouldApplyCredentialAssociationDiscovery({
  generation,
  currentGeneration,
  requestWallet = null,
  liveWallet = null,
  requestChainId = null,
  liveChainId = null,
  eligible = false,
} = {}) {
  if (generation !== currentGeneration) return false;
  if (!eligible) return false;
  const req = normalizeEvmAddress(requestWallet);
  const live = normalizeEvmAddress(liveWallet);
  if (!req || !live || req !== live) return false;
  const reqChain = normalizeWalletChainId(requestChainId);
  const liveChain = normalizeWalletChainId(liveChainId);
  if (reqChain == null || liveChain == null || reqChain !== liveChain) return false;
  return true;
}

/**
 * Discovery helper used by the onboarding hook / tests.
 * Resolve EOA → AA resolve → lookup. Never associates implicitly.
 */
export async function discoverCredentialAssociationContext({
  eoaAddress,
  signal,
  api,
} = {}) {
  const eoa = normalizeEvmAddress(eoaAddress);
  if (!eoa) {
    throw assocError(CREDENTIAL_ASSOCIATION_REASON.WRONG_WALLET, "eoa required");
  }

  const fetchResolve = api?.fetchCanonicalResolve || fetchCanonicalIdentityResolve;
  const fetchAa = api?.resolveIdentity || resolveIdentity;
  const fetchLookup = api?.lookup || lookupCredentialAssociation;

  const canonicalPayload = await fetchResolve(eoa, { signal });
  const canonical = readCanonicalCredentialBlocks(canonicalPayload);

  let aaPayload = null;
  try {
    aaPayload = await fetchAa({ owner: eoa, signal });
  } catch {
    aaPayload = null;
  }
  const aaCredential = extractAaHeldCredential(aaPayload);

  let associationLookup = null;
  try {
    associationLookup = await fetchLookup({
      progressAddress: canonical.progressAddress || eoa,
      eoaAddress: eoa,
      aaAddress: aaCredential?.aaAddress,
      signal,
    });
  } catch (err) {
    const code = err?.reasonCode || err?.payload?.error;
    if (code === "CREDENTIAL_ASSOCIATION_API_DISABLED" || err?.status === 404) {
      throw assocError(CREDENTIAL_ASSOCIATION_REASON.API_DISABLED, String(code));
    }
    if (
      code === "AA_OWNERSHIP_LOOKUP_FAILED" ||
      code === "SBT_OWNERSHIP_LOOKUP_FAILED" ||
      err?.status === 503
    ) {
      associationLookup = {
        ok: false,
        currentlyVerified: false,
        reasonCode: CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE,
      };
    } else if (code === "ASSOCIATION_NOT_FOUND" || err?.status === 200) {
      associationLookup = {
        ok: false,
        currentlyVerified: false,
        reasonCode: "ASSOCIATION_NOT_FOUND",
      };
    } else {
      associationLookup = {
        ok: false,
        currentlyVerified: false,
        reasonCode: String(code || "LOOKUP_FAILED"),
      };
    }
  }

  return {
    eoaAddress: eoa,
    canonicalPayload,
    canonical,
    aaPayload,
    aaCredential,
    associationLookup,
    // No implicit association side effect.
    associated: false,
    minted: false,
  };
}

/**
 * After confirm: re-fetch canonical resolve and require ISSUED via verified association.
 */
export async function refreshAndConfirmIssued({
  eoaAddress,
  signal,
  api,
} = {}) {
  const eoa = normalizeEvmAddress(eoaAddress);
  const fetchResolve = api?.fetchCanonicalResolve || fetchCanonicalIdentityResolve;
  const payload = await fetchResolve(eoa, { signal });
  const blocks = readCanonicalCredentialBlocks(payload);
  const issued =
    blocks.credentialStatus === "ISSUED" &&
    (blocks.currentlyVerified === true ||
      blocks.associationVerification === "VERIFIED");
  if (!issued) {
    throw assocError(
      CREDENTIAL_ASSOCIATION_REASON.NOT_ISSUED_AFTER_CONFIRM,
      "credential not ISSUED after association"
    );
  }
  return { payload, blocks, issued: true };
}
