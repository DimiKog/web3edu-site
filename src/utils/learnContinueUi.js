/**
 * Learn landing Continue UI selection — presentation only.
 * Does not interpret tiers/XP/current module; only picks a canonical progression
 * payload and whether the Continue section should appear.
 */

import { getLmCurriculumModules } from "../content/lmRegistry.js";
import {
  getContinueLearningViewState,
  isValidCanonicalProgression,
} from "./continueLearningView.js";
import { getCanonicalModuleEntry } from "./lmModuleView.js";

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
 * Module ids with an Interactive Chapter today (registry `chapterAvailable`).
 * Planned modules (LM09–LM11) are excluded — never Continue Learning targets.
 * @returns {string[]}
 */
export function getAvailableLearningModuleIds() {
  return getLmCurriculumModules()
    .filter((mod) => mod.chapterAvailable === true)
    .map((mod) => mod.id);
}

/**
 * True when every registry-available module has canonical `modules[id].complete`.
 * Ignores Planned chapters, XP, badges, and nextAction / currentModule pointers.
 *
 * @param {unknown} progression
 */
export function areAllAvailableLearningModulesComplete(progression) {
  if (!isValidCanonicalProgression(progression)) return false;
  const availableIds = getAvailableLearningModuleIds();
  if (availableIds.length === 0) return false;
  return availableIds.every(
    (id) => getCanonicalModuleEntry(progression, id)?.complete === true
  );
}

/**
 * Learn Continue bar presentation (Learn landing only).
 * Prefer "all available modules complete" over shared active/unavailable
 * targeting of Planned modules (e.g. LM09 evidence).
 *
 * @param {Record<string, unknown>|null|undefined} progression
 * @param {"en"|"gr"} [lang]
 * @returns {{
 *   mode: "invalid"|"available_complete"|"path_complete"|"active",
 *   view?: ReturnType<typeof getContinueLearningViewState>,
 * }}
 */
export function resolveLearnContinueBarPresentation(progression, lang = "en") {
  if (!isValidCanonicalProgression(progression)) {
    return { mode: "invalid" };
  }
  if (areAllAvailableLearningModulesComplete(progression)) {
    return { mode: "available_complete" };
  }
  const view = getContinueLearningViewState(progression, lang);
  if (view.mode === "complete") {
    return { mode: "path_complete", view };
  }
  if (view.mode === "invalid") {
    return { mode: "invalid" };
  }
  return { mode: "active", view };
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
