/**
 * Student-facing identity-link error copy + H3C EIP-712 orchestration helpers.
 */

import { normalizeEvmAddress } from "./evmAddress.js";
import {
  confirmIdentityLink,
  createIdentityLinkChallenge,
  getIdentityLinkStatus,
  previewIdentityLink,
} from "../api/identityLink.js";
import { signEip712TypedData } from "./signEip712TypedData.js";

const RETRYABLE = new Set([
  "CHALLENGE_EXPIRED",
  "CHALLENGE_CONSUMED",
  "CHALLENGE_NOT_FOUND",
  "INVALID_SIGNATURE",
  "SIGNER_MISMATCH",
]);

export function mapIdentityLinkError(reasonCode, { isGR = false } = {}) {
  const code = String(reasonCode || "").trim();
  const en = {
    CASE_B_REQUIRES_EIP712:
      "Wallet linking needs an updated signing flow. Please refresh and try again.",
    CASE_B_NOT_ALLOWLISTED:
      // Legacy backend code; current H3C no longer emits this.
      "Wallet linking is temporarily unavailable. Please try again later.",
    CASE_B_PREREQUISITES_NOT_ENABLED:
      "Wallet linking is temporarily unavailable. Please try again later.",
    WALLET_HAS_PROGRESS:
      "Wallet linking with existing wallet progress is temporarily unavailable. Please try again later.",
    BOTH_HAVE_PROGRESS:
      "Both your Web3Edu Account and this wallet already contain progress. Automatic linking is not available. Please contact the administrator so the two progress histories can be reconciled.",
    WALLET_ALREADY_BOUND:
      "This wallet is already linked to a different Web3Edu identity.",
    RELINK_REQUIRED:
      "Your Web3Edu Account already has a different primary linked wallet. Relinking is not available here yet.",
    INVALID_SIGNATURE: "The wallet signature was not accepted. Please try again.",
    SIGNER_MISMATCH:
      "The signing wallet does not match the connected wallet. Please reconnect and try again.",
    CHALLENGE_EXPIRED: "The signing request expired. Please try again.",
    CHALLENGE_CONSUMED: "That signing request was already used. Please try again.",
    CHALLENGE_NOT_FOUND: "The signing request was not found. Please try again.",
    WALLET_SWITCH:
      "Your wallet account changed during linking. Please reconnect the same wallet and try again.",
    default: "Wallet linking failed. Please try again.",
  };
  const gr = {
    CASE_B_REQUIRES_EIP712:
      "Η σύνδεση πορτοφολιού χρειάζεται ενημερωμένη υπογραφή. Ανανέωσε τη σελίδα και δοκίμασε ξανά.",
    CASE_B_NOT_ALLOWLISTED:
      "Η σύνδεση πορτοφολιού δεν είναι προσωρινά διαθέσιμη. Δοκίμασε ξανά αργότερα.",
    CASE_B_PREREQUISITES_NOT_ENABLED:
      "Η σύνδεση πορτοφολιού δεν είναι προσωρινά διαθέσιμη. Δοκίμασε ξανά αργότερα.",
    WALLET_HAS_PROGRESS:
      "Η σύνδεση πορτοφολιού με υπάρχουσα πρόοδο στο πορτοφόλι δεν είναι προσωρινά διαθέσιμη. Δοκίμασε ξανά αργότερα.",
    BOTH_HAVE_PROGRESS:
      "Τόσο ο λογαριασμός Web3Edu όσο και αυτό το πορτοφόλι έχουν ήδη πρόοδο. Η αυτόματη σύνδεση δεν είναι διαθέσιμη. Επικοινώνησε με τον διαχειριστή ώστε να γίνει συμφιλίωση των δύο ιστορικών προόδου.",
    WALLET_ALREADY_BOUND:
      "Αυτό το πορτοφόλι είναι ήδη συνδεδεμένο με διαφορετική ταυτότητα Web3Edu.",
    RELINK_REQUIRED:
      "Ο λογαριασμός Web3Edu έχει ήδη διαφορετικό κύριο συνδεδεμένο πορτοφόλι. Η επανασύνδεση δεν είναι διαθέσιμη εδώ ακόμη.",
    INVALID_SIGNATURE: "Η υπογραφή δεν έγινε αποδεκτή. Δοκίμασε ξανά.",
    SIGNER_MISMATCH:
      "Το πορτοφόλι υπογραφής δεν ταιριάζει με το συνδεδεμένο. Επανασύνδεσε το ίδιο πορτοφόλι και δοκίμασε ξανά.",
    CHALLENGE_EXPIRED: "Το αίτημα υπογραφής έληξε. Δοκίμασε ξανά.",
    CHALLENGE_CONSUMED: "Το αίτημα υπογραφής χρησιμοποιήθηκε ήδη. Δοκίμασε ξανά.",
    CHALLENGE_NOT_FOUND: "Το αίτημα υπογραφής δεν βρέθηκε. Δοκίμασε ξανά.",
    WALLET_SWITCH:
      "Το πορτοφόλι άλλαξε κατά τη σύνδεση. Επανασύνδεσε το ίδιο πορτοφόλι και δοκίμασε ξανά.",
    default: "Η σύνδεση πορτοφολιού απέτυχε. Δοκίμασε ξανά.",
  };
  const table = isGR ? gr : en;
  return table[code] || table.default;
}

export function isIdentityLinkRetryable(reasonCode) {
  return RETRYABLE.has(String(reasonCode || "").trim());
}

/**
 * Full H3C link: challenge → EIP-712 sign → preview → confirm → status.
 *
 * @param {object} args
 * @param {string} args.idToken
 * @param {string} args.walletAddress connected EOA at start
 * @param {() => string|null|undefined} [args.getConnectedWallet] re-check before sign/confirm
 * @param {Function} [args.signTypedDataAsync] wagmi signer
 * @param {AbortSignal} [args.signal]
 */
export async function runEip712WalletLinkFlow({
  idToken,
  walletAddress,
  getConnectedWallet,
  signTypedDataAsync,
  signal,
} = {}) {
  const startWallet = normalizeEvmAddress(walletAddress);
  if (!startWallet) {
    throw Object.assign(new Error("wallet required"), { reasonCode: "INVALID_WALLET_ADDRESS" });
  }

  const assertSameWallet = () => {
    if (typeof getConnectedWallet !== "function") return;
    const now = normalizeEvmAddress(getConnectedWallet());
    if (now && now !== startWallet) {
      const err = new Error("wallet switched");
      err.reasonCode = "WALLET_SWITCH";
      throw err;
    }
  };

  assertSameWallet();
  const challenge = await createIdentityLinkChallenge(idToken, {
    walletAddress: startWallet,
    signal,
  });

  if (challenge?.alreadyActive || challenge?.reasonCode === "ALREADY_ACTIVE") {
    const status = await getIdentityLinkStatus(idToken, { signal }).catch(() => null);
    return {
      outcome: "already_active",
      caseLabel: null,
      confirm: challenge,
      preview: null,
      status,
      progressSource: status?.progressSource || null,
    };
  }

  const typedData = challenge?.typedData;
  const nonce = challenge?.nonce;
  const challengeId = challenge?.challengeId;
  const challengeWallet = normalizeEvmAddress(challenge?.walletAddress) || startWallet;
  if (challengeWallet !== startWallet) {
    const err = new Error("challenge wallet mismatch");
    err.reasonCode = "WALLET_SWITCH";
    throw err;
  }
  if (!typedData || !nonce || !challengeId) {
    throw new Error("Backend did not return a complete EIP-712 challenge.");
  }

  assertSameWallet();
  let signature;
  try {
    signature = await signEip712TypedData(typedData, {
      signTypedDataAsync,
      account: startWallet,
    });
  } catch (err) {
    err.reasonCode = err.reasonCode || "INVALID_SIGNATURE";
    throw err;
  }

  assertSameWallet();
  const previewRes = await previewIdentityLink(idToken, {
    walletAddress: startWallet,
    nonce,
    signature,
    challengeId,
    signal,
  });
  const preview = previewRes?.preview || {};
  const allowed = Boolean(preview.allowed);
  const caseLabel = preview.case || null;
  const reasonCode = preview.reasonCode || previewRes?.reasonCode || null;

  if (!allowed) {
    const err = new Error(reasonCode || "link_not_allowed");
    err.reasonCode = reasonCode || preview.detail || "CONFLICT";
    err.preview = preview;
    throw err;
  }

  assertSameWallet();
  const confirm = await confirmIdentityLink(idToken, {
    walletAddress: startWallet,
    nonce,
    signature,
    challengeId,
    signal,
  });

  const status = await getIdentityLinkStatus(idToken, { signal }).catch(() => null);
  const progressSource =
    status?.progressSource ||
    confirm?.progressSource ||
    (confirm?.progressOrigin === "linked_wallet" ? "linked_wallet" : null);

  return {
    outcome: "linked",
    caseLabel: caseLabel === "B" ? "B" : "A",
    confirm,
    preview,
    status,
    progressSource,
  };
}
