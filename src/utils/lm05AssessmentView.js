/**
 * Pure helpers for LM05 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM05_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM05_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM05 UX transparency.
 * Mirrors the known LM05 curriculum critical outcome — not a grading source of truth.
 */
export const LM05_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm05_q7_pending_transaction",
]);

/** Presentation mirror of the known LM05 numeric pass floor (backend remains authoritative). */
export const LM05_PRESENTATION_PASS_MIN = 5;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm05CriticalQuestion(questionId) {
  return LM05_CRITICAL_QUESTION_IDS.includes(questionId);
}
