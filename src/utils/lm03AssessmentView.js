/**
 * Pure helpers for LM03 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers to avoid duplication — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM03_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM03_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM03 UX transparency.
 * Mirrors known LM03 curriculum critical outcomes — not a grading source of truth.
 */
export const LM03_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm03_q4_platform_fit",
  "lm03_q7_architectural_rejection",
]);

/** Presentation mirror of the known LM03 numeric pass floor (backend remains authoritative). */
export const LM03_PRESENTATION_PASS_MIN = 5;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm03CriticalQuestion(questionId) {
  return LM03_CRITICAL_QUESTION_IDS.includes(questionId);
}
