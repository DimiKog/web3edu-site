/**
 * Pure helpers for assessment fail-state presentation.
 * No grading authority — only formats leads from already-public evaluation fields.
 */

/**
 * Prefer a critical-threshold fail lead when the public evaluation already exposes
 * criticalFailures and the numeric score meets the known presentation threshold.
 *
 * @param {{
 *   evaluation?: { score?: number, criticalFailures?: unknown } | null,
 *   defaultLead?: string,
 *   criticalThresholdLead?: string,
 *   passMinCorrect?: number,
 * }} args
 * @returns {string}
 */
export function resolveAssessmentFailLead({
  evaluation = null,
  defaultLead = "",
  criticalThresholdLead = "",
  passMinCorrect,
} = {}) {
  const fallback = typeof defaultLead === "string" ? defaultLead : "";
  const criticalLead =
    typeof criticalThresholdLead === "string" ? criticalThresholdLead.trim() : "";
  if (!criticalLead) return fallback;

  const failures = evaluation?.criticalFailures;
  const score = evaluation?.score;
  const hasCriticalFailures = Array.isArray(failures) && failures.length > 0;
  const meetsNumeric =
    typeof passMinCorrect === "number" &&
    Number.isFinite(passMinCorrect) &&
    typeof score === "number" &&
    Number.isFinite(score) &&
    score >= passMinCorrect;

  if (hasCriticalFailures && meetsNumeric) {
    return criticalLead;
  }
  return fallback;
}
