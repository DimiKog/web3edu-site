/**
 * Student-facing Progress Source labels/helpers from backend progressSource.
 * Frontend displays the backend decision — does not infer AA/EOA ownership.
 */

export const PROGRESS_SOURCE_HELPER_ACCOUNT_EN =
  "Project and XP progress is tied to your Web3Edu Account.";

export const PROGRESS_SOURCE_HELPER_ACCOUNT_GR =
  "Η πρόοδος projects και XP συνδέεται με τον Web3Edu Account σου.";

export const PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN =
  "Project and XP progress is tied to your Linked Wallet.";

export const PROGRESS_SOURCE_HELPER_LINKED_WALLET_GR =
  "Η πρόοδος projects και XP συνδέεται με το συνδεδεμένο πορτοφόλι σου.";

export const PROGRESS_SOURCE_HELPER_WALLET_EN =
  "This wallet-only profile is separate from your Web3Edu Account progress. Sign in with your Web3Edu Account to view that progress.";

export const PROGRESS_SOURCE_HELPER_WALLET_GR =
  "Αυτό το wallet-only προφίλ είναι ξεχωριστό από την πρόοδο του Web3Edu Account σου. Συνδέσου με Web3Edu Account για να δεις εκείνη την πρόοδο.";

/** @deprecated Prefer PROGRESS_SOURCE_HELPER_ACCOUNT_EN */
export const PROGRESS_SOURCE_HELPER_EN = PROGRESS_SOURCE_HELPER_ACCOUNT_EN;

/** @deprecated Prefer PROGRESS_SOURCE_HELPER_ACCOUNT_GR */
export const PROGRESS_SOURCE_HELPER_GR = PROGRESS_SOURCE_HELPER_ACCOUNT_GR;

/**
 * @param {{ isGR?: boolean, profileMode?: "account"|"wallet-only", progressSource?: string|null }} args
 * @returns {string|null} null = unknown/loading (do not claim Account or Linked Wallet)
 */
export function resolveProgressSourceHelperCopy({
  isGR = false,
  profileMode = "account",
  progressSource,
} = {}) {
  if (profileMode === "wallet-only") {
    return isGR ? PROGRESS_SOURCE_HELPER_WALLET_GR : PROGRESS_SOURCE_HELPER_WALLET_EN;
  }
  if (progressSource === "linked_wallet") {
    return isGR
      ? PROGRESS_SOURCE_HELPER_LINKED_WALLET_GR
      : PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN;
  }
  if (progressSource === "web3edu_account") {
    return isGR ? PROGRESS_SOURCE_HELPER_ACCOUNT_GR : PROGRESS_SOURCE_HELPER_ACCOUNT_EN;
  }
  // Explicit null = hydration pending / unknown — never claim Web3Edu Account.
  if (progressSource === null) {
    return null;
  }
  // Prop omitted (undefined): legacy callers keep Account wording.
  return isGR ? PROGRESS_SOURCE_HELPER_ACCOUNT_GR : PROGRESS_SOURCE_HELPER_ACCOUNT_EN;
}

/**
 * @param {{ isGR?: boolean, profileMode?: "account"|"wallet-only", progressSource?: string|null, progressSourceLabel?: string|null }} args
 * @returns {string|null}
 */
export function resolveProgressSourceDisplayLabel({
  isGR = false,
  profileMode = "account",
  progressSource,
  progressSourceLabel,
} = {}) {
  if (typeof progressSourceLabel === "string" && progressSourceLabel.trim()) {
    return progressSourceLabel.trim();
  }
  if (profileMode === "wallet-only") {
    return isGR ? "Wallet-only προφίλ" : "Wallet-only profile";
  }
  if (progressSource === "linked_wallet") {
    return isGR ? "Συνδεδεμένο πορτοφόλι" : "Linked Wallet";
  }
  if (progressSource === "web3edu_account") {
    return "Web3Edu Account";
  }
  if (progressSource === null) {
    return null;
  }
  return "Web3Edu Account";
}
