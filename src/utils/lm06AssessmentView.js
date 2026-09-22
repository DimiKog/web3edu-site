/**
 * Pure helpers for LM06 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM06_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM06_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";

/**
 * Presentation-only critical question ids for LM06 UX transparency.
 * Mirrors the known LM06 curriculum critical outcome — not a grading source of truth.
 */
export const LM06_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm06_q8_proposal_not_finality",
]);

/** Presentation mirror of the known LM06 numeric pass floor (backend remains authoritative). */
export const LM06_PRESENTATION_PASS_MIN = 7;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm06CriticalQuestion(questionId) {
  return LM06_CRITICAL_QUESTION_IDS.includes(questionId);
}
