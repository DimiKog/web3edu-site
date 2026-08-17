/**
 * Dashboard identity UX helpers — backend-driven; no client-side origin inference.
 */

/**
 * Legacy import-progress is only for Case A (web3edu_account origin, wallet-side progress).
 * Case B (linked_wallet) and post-H3E account progress must not offer import.
 *
 * @param {{
 *   isSocialWalletLinkedAuthorized?: boolean,
 *   hasIdToken?: boolean,
 *   hasConnectedWallet?: boolean,
 *   progressImportSnoozed?: boolean,
 *   socialContinuityAlreadyReflected?: boolean,
 *   progressSource?: string|null,
 * }} args
 */
export function shouldOfferSocialProgressImport({
  isSocialWalletLinkedAuthorized = false,
  hasIdToken = false,
  hasConnectedWallet = false,
  progressImportSnoozed = false,
  socialContinuityAlreadyReflected = false,
  progressSource = null,
} = {}) {
  if (!isSocialWalletLinkedAuthorized || !hasIdToken || !hasConnectedWallet) {
    return false;
  }
  if (progressImportSnoozed) return false;
  if (progressSource === "linked_wallet") return false;
  if (progressSource === null) return false;
  if (progressSource === "web3edu_account" && socialContinuityAlreadyReflected) {
    return false;
  }
  return true;
}

/**
 * @param {{ isGR?: boolean, progressSource?: string|null }} args
 */
export function resolveLinkWalletSuccessMessage({ isGR = false, progressSource = null } = {}) {
  if (progressSource === "linked_wallet") {
    return isGR
      ? "Το πορτοφόλι συνδέθηκε. Η Πηγή προόδου παραμένει στο Συνδεδεμένο πορτοφόλι σου."
      : "Wallet linked. Progress Source remains on your Linked Wallet.";
  }
  return isGR
    ? "Το πορτοφόλι συνδέθηκε. Η Πηγή προόδου παραμένει στον Web3Edu Account σου."
    : "Wallet linked. Progress Source remains on your Web3Edu Account.";
}

/**
 * Minimal unlink/revoke semantics — no backend revoke API wired in H3F.
 *
 * @param {{ isGR?: boolean, progressSource?: string|null, hasLinkedWallet?: boolean }} args
 * @returns {string|null}
 */
export function resolveLinkedWalletRevokeHint({
  isGR = false,
  progressSource = null,
  hasLinkedWallet = false,
} = {}) {
  if (!hasLinkedWallet) return null;
  if (progressSource === "linked_wallet") {
    return isGR
      ? "Όσο η Πηγή προόδου είναι Συνδεδεμένο πορτοφόλι, δεν μπορείς να αποσυνδέσεις αυτό το πορτοφόλι. Η μεταφορά προόδου στον Web3Edu Account γίνεται μόνο όταν είναι διαθέσιμη από την πλατφόρμα."
      : "While Progress Source is Linked Wallet, this wallet cannot be unlinked. Move progress to your Web3Edu Account when that option is available from the platform.";
  }
  if (progressSource === "web3edu_account") {
    return isGR
      ? "Η πρόοδος σου βρίσκεται στον Web3Edu Account. Η αποσύνδεση πορτοφολιού δεν αφαιρεί την πρόοδο — η διαχείριση σύνδεσης θα προστεθεί όταν υποστηριχθεί από το backend."
      : "Your progress is on your Web3Edu Account. Unlinking this wallet does not remove progress — wallet relationship management will be added when supported by the backend.";
  }
  return null;
}

/** Link-wallet banner copy (amber card). */
export function resolveLinkWalletBannerCopy({ isGR = false } = {}) {
  if (isGR) {
    return {
      title: "Συνδεδεμένο πορτοφόλι — σύνδεσέ το με τον Web3Edu λογαριασμό σου",
      body:
        "Δημιούργησε επίσημη σύνδεση Linked Wallet με το Connected Wallet σου. " +
        "Η σύνδεση δεν μετακινεί πρόοδο από μόνη της — η Πηγή προόδου αποφασίζεται από το backend.",
      stepTitle: "Σύνδεση πορτοφολιού (EIP-712)",
      stepBody: "Θα υπογράψεις ασφαλές αίτημα στο πορτοφόλι σου για απόδειξη ιδιοκτησίας.",
      required: "Απαιτείται",
      action: "Σύνδεση πορτοφολιού",
      actionLoading: "Σύνδεση…",
      connectedLabel: "Connected Wallet",
    };
  }
  return {
    title: "Connected Wallet — link it to your Web3Edu Account",
    body:
      "Create an authoritative Linked Wallet binding for this Connected Wallet. " +
      "Linking does not move progress by itself — Progress Source is decided by the backend.",
    stepTitle: "Link wallet (EIP-712)",
    stepBody: "You will sign a secure request in your wallet to prove ownership.",
    required: "Required",
    action: "Link Wallet",
    actionLoading: "Linking…",
    connectedLabel: "Connected Wallet",
  };
}

/** PageShell identity menu — canonical identity vs signing wallet. */
export function resolveNavIdentityMenuHint({ isGR = false } = {}) {
  return isGR
    ? "Web3Edu Identity — ο κανονικός λογαριασμός μάθησης σου (όχι απλώς το συνδεδεμένο πορτοφόλι υπογραφής)"
    : "Web3Edu Identity — your canonical learner account (not just the connected signing wallet)";
}

/**
 * Social-wallet linkage DEV snapshot panel.
 * Production (isDev false) must never render, even if a snapshot exists.
 *
 * @param {{ isDev?: boolean, hasSnapshot?: boolean }} args
 */
export function shouldShowSocialWalletLinkageDevSnapshot({
  isDev = false,
  hasSnapshot = false,
} = {}) {
  return Boolean(isDev && hasSnapshot);
}
