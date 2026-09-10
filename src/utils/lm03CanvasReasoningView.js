/**
 * LM03 Platform Comparison Canvas — local formative feedback helpers.
 * Presentation only: no grading of free text, no persistence, no XP/evidence.
 */

/** @typedef {"fit"|"misfit"|"insufficient"} Lm03CanvasVerdictId */
/** @typedef {"aligned"|"reconsider"} Lm03CanvasFeedbackTone */

/**
 * @param {Record<string, string>|null|undefined} feedbackByVerdict
 * @param {string} verdictId
 * @returns {string|null}
 */
export function resolveLm03CanvasReasoningFeedback(feedbackByVerdict, verdictId) {
  if (!verdictId || typeof feedbackByVerdict !== "object" || !feedbackByVerdict) {
    return null;
  }
  const text = feedbackByVerdict[verdictId];
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  return trimmed ? trimmed : null;
}

/**
 * Visual tone for formative feedback (not assessment pass/fail chrome).
 * @param {string} verdictId
 * @returns {Lm03CanvasFeedbackTone}
 */
export function lm03CanvasFeedbackTone(verdictId) {
  return verdictId === "misfit" ? "aligned" : "reconsider";
}
