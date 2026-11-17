/**
 * LM03 Platform Fit Challenge — local formative feedback helpers.
 * Presentation only: no grading authority, no persistence, no XP/evidence.
 */

/** @typedef {"fit"|"misfit"|"needMoreInfo"} Lm03FitChallengeAnswerId */
/** @typedef {"aligned"|"reconsider"} Lm03FitChallengeFeedbackTone */

/**
 * @param {Record<string, string>|null|undefined} feedbackByAnswer
 * @param {string} answerId
 * @returns {string|null}
 */
export function resolveLm03FitChallengeFeedback(feedbackByAnswer, answerId) {
  if (!answerId || typeof feedbackByAnswer !== "object" || !feedbackByAnswer) {
    return null;
  }
  const text = feedbackByAnswer[answerId];
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  return trimmed ? trimmed : null;
}

/**
 * Visual tone for formative feedback (not assessment pass/fail chrome).
 * @param {string} answerId
 * @returns {Lm03FitChallengeFeedbackTone}
 */
export function lm03FitChallengeFeedbackTone(answerId) {
  return answerId === "needMoreInfo" ? "aligned" : "reconsider";
}
