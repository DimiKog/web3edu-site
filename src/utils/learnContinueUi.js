/**
 * Learn landing Continue UI selection — presentation only.
 * Does not interpret tiers/XP/current module; only picks a canonical progression
 * payload and whether the Continue section should appear.
 */

import { isValidCanonicalProgression } from "./continueLearningView.js";

/**
 * Prefer dedicated progression fetch; fall back to identity-resolve metadata
 * (same payload Dashboard Continue Learning already consumes).
 *
 * @param {unknown} fetchProgression
 * @param {unknown} metadataProgression
 * @returns {{ progression: Record<string, unknown>|null, source: "fetch"|"metadata"|null }}
 */
export function pickLearnContinueProgression(
  fetchProgression,
  metadataProgression
) {
  if (isValidCanonicalProgression(fetchProgression)) {
    return { progression: fetchProgression, source: "fetch" };
  }
  if (isValidCanonicalProgression(metadataProgression)) {
    return { progression: metadataProgression, source: "metadata" };
  }
  return { progression: null, source: null };
}

/**
 * @param {{
 *   oidcAuthLoading?: boolean,
 *   idToken?: string|null,
 *   isOidcAuthenticated?: boolean,
 *   fetchLoading?: boolean,
 *   identityAddress?: string|null,
 *   identityLoading?: boolean,
 *   progression?: Record<string, unknown>|null,
 *   progressionError?: unknown,
 * }} args
 */
export function shouldShowLearnContinueSection({
  oidcAuthLoading = false,
  idToken = null,
  isOidcAuthenticated = false,
  fetchLoading = false,
  identityAddress = null,
  identityLoading = false,
  progression = null,
  progressionError = null,
} = {}) {
  if (oidcAuthLoading) return true;
  if (idToken && fetchLoading) return true;
  if (identityAddress && identityLoading && !isValidCanonicalProgression(progression)) {
    return true;
  }
  if (isValidCanonicalProgression(progression)) return true;
  if (progressionError && (idToken || isOidcAuthenticated || identityAddress)) {
    return true;
  }
  // Signed-in OIDC: keep the personalization slot for loading/error/bar.
  if (idToken || isOidcAuthenticated) return true;
  return false;
}

export { isValidCanonicalProgression };
