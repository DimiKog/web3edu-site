/**
 * Pure helpers for LM08 assessment presentation (shuffle / visual labels).
 * No grading authority — canonical option IDs are submitted unchanged.
 */

import { shuffleArray } from "./lm01AssessmentView.js";

export { shuffleArray };

export const LM08_CANONICAL_OPTION_IDS = Object.freeze(["A", "B", "C", "D", "E"]);
export const LM08_VISUAL_LETTERS = Object.freeze(["A", "B", "C", "D", "E"]);

/**
 * Presentation-only critical question ids for LM08 UX transparency.
 * Mirrors known LM08 curriculum critical outcomes — not a grading source of truth.
 */
export const LM08_CRITICAL_QUESTION_IDS = Object.freeze([
  "lm08_q4_changing_state",
  "lm08_q7_verification_limits",
]);

/** Presentation mirror of the known LM08 numeric pass floor (backend remains authoritative). */
export const LM08_PRESENTATION_PASS_MIN = 5;

/**
 * @param {string} questionId
 * @returns {boolean}
 */
export function isLm08CriticalQuestion(questionId) {
  return LM08_CRITICAL_QUESTION_IDS.includes(questionId);
}

/**
 * @param {Array<{ id: string, optionIds?: string[] }>|null|undefined} questions
 * @param {() => number} [random]
 * @returns {Record<string, string[]>}
 */
export function buildShuffledOptionOrders(questions, random = Math.random) {
  const orders = {};
  for (const question of questions || []) {
    if (!question?.id) continue;
    const ids =
      Array.isArray(question.optionIds) && question.optionIds.length > 0
        ? question.optionIds.map(String)
        : [...LM08_CANONICAL_OPTION_IDS].slice(0, 4);
    orders[question.id] = shuffleArray(ids, random);
  }
  return orders;
}

/**
 * @param {number} index
 * @returns {string}
 */
export function visualLetterForIndex(index) {
  if (index < 0 || index >= LM08_VISUAL_LETTERS.length) {
    return String(index + 1);
  }
  return LM08_VISUAL_LETTERS[index];
}

/**
 * @param {string[]} orderedCanonicalIds
 * @param {Record<string, string>} optionTextsByCanonicalId
 * @returns {Array<{ canonicalId: string, visualLetter: string, text: string }>}
 */
export function mapOptionsForDisplay(orderedCanonicalIds, optionTextsByCanonicalId) {
  const rows = [];
  const texts = optionTextsByCanonicalId || {};
  (orderedCanonicalIds || []).forEach((canonicalId, index) => {
    const text = texts[canonicalId];
    if (!text) return;
    rows.push({
      canonicalId,
      visualLetter: visualLetterForIndex(index),
      text,
    });
  });
  return rows;
}
