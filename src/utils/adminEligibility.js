/**
 * Admin eligibility for UI only. Backend authorization is OIDC Bearer.
 *
 * OIDC learners: ACTIVE linked wallet binding must match admin allowlist.
 * Wallet-only learners: never admin (OIDC-only admin authorization).
 */

export const ACTIVE_BINDING_STATUS = "ACTIVE";

const ADMIN_WALLET_RE = /^0x[a-f0-9]{40}$/;

/**
 * Parse VITE_ADMIN_WALLETS (comma-separated). Mode-independent; empty/invalid → [].
 * Pass the env string from the hook so Vite can statically inline it.
 * Do not read Vite env inside this module.
 *
 * @param {unknown} rawValue
 * @returns {string[]}
 */
export function parseAdminWalletAllowlist(rawValue) {
  if (typeof rawValue !== "string") return [];
  return rawValue
    .split(",")
    .map((address) => address.trim().toLowerCase())
    .filter((address) => ADMIN_WALLET_RE.test(address));
}

export function getAdminWalletAllowlist(envValue) {
  return parseAdminWalletAllowlist(envValue);
}

export function isAdminWalletAddress(address, allowlist) {
  if (!address || typeof address !== "string") return false;
  const normalized = address.trim().toLowerCase();
  return allowlist.includes(normalized);
}

function bindingWalletAddress(binding) {
  if (!binding || typeof binding !== "object") return null;
  const raw = binding.walletAddress ?? binding.wallet_address;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function isActiveBinding(binding) {
  if (!binding || typeof binding !== "object") return false;
  return String(binding.status || "").toUpperCase() === ACTIVE_BINDING_STATUS;
}

/**
 * First ACTIVE linked wallet that is on the admin allowlist, or null.
 */
export function pickActiveLinkedAdminWallet(linkStatus, allowlist) {
  if (!linkStatus || typeof linkStatus !== "object") return null;

  const bindings = Array.isArray(linkStatus.activeBindings)
    ? linkStatus.activeBindings
    : Array.isArray(linkStatus.active_bindings)
      ? linkStatus.active_bindings
      : [];

  for (const binding of bindings) {
    if (!isActiveBinding(binding)) continue;
    const addr = bindingWalletAddress(binding);
    if (addr && allowlist.includes(addr)) return addr;
  }

  const primary = linkStatus.primaryWallet ?? linkStatus.primary_wallet;
  if (isActiveBinding(primary)) {
    const addr = bindingWalletAddress(primary);
    if (addr && allowlist.includes(addr)) return addr;
  }

  return null;
}

export function computeOidcSocialAdminEligibility(linkStatus, allowlist) {
  const adminWalletAddress = pickActiveLinkedAdminWallet(linkStatus, allowlist);
  return {
    isAdminEligible: Boolean(adminWalletAddress),
    adminWalletAddress,
  };
}

export function computeWalletOnlyAdminEligibility(
  _connectedWalletAddress,
  _isWalletConnected,
  _allowlist
) {
  return { isAdminEligible: false, adminWalletAddress: null };
}

export function computeAdminEligibility({
  isOidcAuthenticated,
  linkStatus,
  linkStatusLoaded,
  connectedWalletAddress,
  isWalletConnected,
  allowlist,
}) {
  if (isOidcAuthenticated) {
    if (!linkStatusLoaded) {
      return { isAdminEligible: false, adminWalletAddress: null, pending: true };
    }
    const result = computeOidcSocialAdminEligibility(linkStatus, allowlist);
    return { ...result, pending: false };
  }

  return { isAdminEligible: false, adminWalletAddress: null, pending: false };
}
