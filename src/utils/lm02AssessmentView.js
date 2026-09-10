/**
 * Pure helpers for LM02 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers to avoid duplication — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM02_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM02_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM02 UX transparency.
 * Mirrors known LM02 curriculum critical outcomes — not a grading source of truth.
 */
export const LM02_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm02_q2_trusted_authority",
  "lm02_q7_foodtrace_decide",
]);

/** Presentation mirror of the known LM02 numeric pass floor (backend remains authoritative). */
export const LM02_PRESENTATION_PASS_MIN = 5;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm02CriticalQuestion(questionId) {
  return LM02_CRITICAL_QUESTION_IDS.includes(questionId);
}
