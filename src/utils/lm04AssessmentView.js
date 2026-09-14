/**
 * Pure helpers for LM04 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM04_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM04_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM04 UX transparency.
 * Mirrors the known LM04 curriculum critical outcome — not a grading source of truth.
 */
export const LM04_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm04_q4_authenticity_signing",
]);

/** Presentation mirror of the known LM04 numeric pass floor (backend remains authoritative). */
export const LM04_PRESENTATION_PASS_MIN = 5;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm04CriticalQuestion(questionId) {
  return LM04_CRITICAL_QUESTION_IDS.includes(questionId);
}
