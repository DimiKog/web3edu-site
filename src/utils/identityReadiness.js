/**
 * AA-first onboarding: wallet-backed “logged in” only after persisted identity shows a
 * real mint (or legacy token id). Social-login viewers are keyed by backend AA address.
 */

import { normalizeEvmAddress } from "./evmAddress.js";
import { isNeutralAfterLogout } from "./viewerMode.js";

const DEV_MESSAGE = "Identity not initialized — check onboarding flow";

/**
 * Persisted identity row is treated as minted only with explicit backend signals — not
 * merely a candidate smart account address from resolve.
 * @param {object|null|undefined} identity
 */
export function isWalletMintedIdentityRecord(identity) {
  if (!identity || typeof identity !== "object") return false;
  if (identity.alreadyMinted === true) return true;
  if (identity.hasIdentity === true) {
    const tid = identity.tokenId ?? identity.token_id;
    if (tid != null && tid !== "") return true;
  }
  return false;
}

/**
 * App “identity ready” for chrome, resolve, and dashboard: either an OIDC social AA
 * address is known, or a wallet-backed smart account exists with a minted record.
 *
 * @param {string|null|undefined} smartAccount
 * @param {object|null|undefined} identity — persisted `web3edu-aa-identity` slice
 * @param {{ isOidcAuthenticated?: boolean; socialAaAddress?: string|null }} [viewer]
 */
export function isIdentityReady(smartAccount, identity, viewer = {}) {
  const socialAa = normalizeEvmAddress(viewer.socialAaAddress);
  if (viewer.isOidcAuthenticated && socialAa) return true;
  // After OIDC logout, prevent silent auto-picking a wallet/device profile until the user explicitly chooses.
  if (isNeutralAfterLogout()) return false;
  const sc = normalizeEvmAddress(smartAccount);
  if (!sc) return false;
  return isWalletMintedIdentityRecord(identity);
}

/**
 * DEV-only: log when code paths assume identity but both SC and owner are absent.
 * @param {string} context — short label (e.g. component or function name)
 * @param {{ smartAccount?: string|null, owner?: string|null }} state
 */
export function warnIfIdentityNotInitialized(context, state = {}) {
  if (!import.meta.env.DEV) return;
  const sc = state.smartAccount ?? null;
  const ow = state.owner ?? null;
  if (sc || ow) return;
  // eslint-disable-next-line no-console -- intentional dev-only onboarding diagnostic
  console.warn(`[Web3Edu:${context}] ${DEV_MESSAGE}`);
}

/** Hash-router: send user to onboarding when smart account is required but missing. */
export function redirectToJoin() {
  if (typeof window === "undefined") return;
  const raw = `${window.location.hash || ""}${window.location.pathname || ""}`;
  const isGr =
    raw.includes("join-gr") ||
    raw.includes("-gr") ||
    /-gr(\/|$|\?|#)/.test(window.location.pathname || "");
  window.location.hash = isGr ? "#/join-gr" : "#/join";
}
