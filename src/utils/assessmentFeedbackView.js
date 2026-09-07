/**
 * Presentation helpers for assessment failure remediation labels.
 * No grading authority.
 */

/**
 * @param {string} questionId
 * @param {string[]} canonicalQuestionOrder
 * @returns {number|null} 1-based number, or null if unknown
 */
export function questionNumberFromCanonicalOrder(questionId, canonicalQuestionOrder) {
  if (!questionId || !Array.isArray(canonicalQuestionOrder)) return null;
  const idx = canonicalQuestionOrder.indexOf(questionId);
  return idx >= 0 ? idx + 1 : null;
}

/**
 * Prefer explicit heading/title; never invent answer text.
 * @param {Record<string, { heading?: string, title?: string, prompt?: string }>|null|undefined} questionsCopy
 * @param {string} questionId
 * @returns {string}
 */
export function localizedQuestionFeedbackTitle(questionsCopy, questionId) {
  const entry = questionsCopy?.[questionId];
  if (!entry || typeof entry !== "object") return "";
  if (typeof entry.heading === "string" && entry.heading.trim()) return entry.heading.trim();
  if (typeof entry.title === "string" && entry.title.trim()) return entry.title.trim();
  return "";
}

/**
 * @param {{ number: number|null, title: string }} args
 * @returns {string}
 */
export function formatAssessmentFeedbackQuestionLabel({ number, title }) {
  const n = number != null ? `Q${number}` : "";
  const t = typeof title === "string" ? title.trim() : "";
  if (n && t) return `${n} — ${t}`;
  if (n) return n;
  return t;
}

/**
 * Build display rows for failure remediation from API feedback + locale.
 * Only items with questionId are labeled; hint text is passed through unchanged.
 *
 * @param {Array<{ questionId?: string, hint?: string }>|null|undefined} feedback
 * @param {{
 *   questions?: Record<string, { heading?: string, title?: string }>,
 * }} copy
 * @param {string[]} canonicalQuestionOrder
 * @returns {Array<{ key: string, label: string, hint: string }>}
 */
export function buildAssessmentFeedbackRows(feedback, copy, canonicalQuestionOrder) {
  const rows = [];
  (feedback || []).forEach((item, idx) => {
    if (!item || typeof item !== "object") return;
    const hint = typeof item.hint === "string" ? item.hint.trim() : "";
    if (!hint) return;
    const qid = typeof item.questionId === "string" ? item.questionId : "";
    if (!qid) {
      rows.push({ key: `generic-${idx}`, label: "", hint });
      return;
    }
    const number = questionNumberFromCanonicalOrder(qid, canonicalQuestionOrder);
    const title = localizedQuestionFeedbackTitle(copy?.questions, qid);
    rows.push({
      key: `${qid}-${idx}`,
      label: formatAssessmentFeedbackQuestionLabel({ number, title }),
      hint,
    });
  });
  return rows;
}
