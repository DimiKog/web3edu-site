/**
 * Pure helpers for LM01 assessment presentation (shuffle / visual labels).
 * No grading authority — canonical option IDs are submitted unchanged.
 */

export const LM01_CANONICAL_OPTION_IDS = Object.freeze(["A", "B", "C", "D"]);
export const LM01_VISUAL_LETTERS = Object.freeze(["A", "B", "C", "D"]);

/** Question that introduces the FoodTrace Design Case (marker shown immediately before it). */
export const FOODTRACE_DESIGN_CASE_INTRO_QUESTION_ID = "lm01_q6_foodtrace_consider";

export function isFoodtraceDesignCaseIntroQuestion(questionId) {
  return String(questionId || "") === FOODTRACE_DESIGN_CASE_INTRO_QUESTION_ID;
}

/**
 * Fisher–Yates shuffle. Inject `random` for deterministic tests.
 * @template T
 * @param {T[]} items
 * @param {() => number} [random]
 * @returns {T[]}
 */
export function shuffleArray(items, random = Math.random) {
  const next = Array.isArray(items) ? [...items] : [];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
  }
  return next;
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
        : [...LM01_CANONICAL_OPTION_IDS];
    orders[question.id] = shuffleArray(ids, random);
  }
  return orders;
}

/**
 * Visual letter for a position in the current attempt order (0 → "A").
 * @param {number} index
 * @returns {string}
 */
export function visualLetterForIndex(index) {
  if (index < 0 || index >= LM01_VISUAL_LETTERS.length) {
    return String(index + 1);
  }
  return LM01_VISUAL_LETTERS[index];
}

/**
 * Map shuffled canonical IDs to display rows.
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

/**
 * True when two order maps differ (used by tests / retry checks).
 * @param {Record<string, string[]>} a
 * @param {Record<string, string[]>} b
 */
export function optionOrdersEqual(a, b) {
  const keysA = Object.keys(a || {}).sort();
  const keysB = Object.keys(b || {}).sort();
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i += 1) {
    if (keysA[i] !== keysB[i]) return false;
    const left = a[keysA[i]] || [];
    const right = b[keysB[i]] || [];
    if (left.length !== right.length) return false;
    for (let j = 0; j < left.length; j += 1) {
      if (left[j] !== right[j]) return false;
    }
  }
  return true;
}
