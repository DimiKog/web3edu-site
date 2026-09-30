/**
 * Pure helpers for LM07 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM07_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM07_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM07 UX transparency.
 * Mirrors the known LM07 curriculum critical outcome — not a grading source of truth.
 */
export const LM07_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm07_q9_foodchain_critical",
]);

/** Presentation mirror of the known LM07 numeric pass floor (backend remains authoritative). */
export const LM07_PRESENTATION_PASS_MIN = 7;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm07CriticalQuestion(questionId) {
  return LM07_CRITICAL_QUESTION_IDS.includes(questionId);
}
