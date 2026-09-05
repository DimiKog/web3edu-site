/**
 * Pure helpers for LM08 assessment presentation (shuffle / visual labels).
 * No grading authority — canonical option IDs are submitted unchanged.
 */

import { shuffleArray } from "./lm01AssessmentView.js";

export { shuffleArray };

export const LM08_CANONICAL_OPTION_IDS = Object.freeze(["A", "B", "C", "D", "E"]);
export const LM08_VISUAL_LETTERS = Object.freeze(["A", "B", "C", "D", "E"]);

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
