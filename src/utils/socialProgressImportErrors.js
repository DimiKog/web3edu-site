/**
 * Classify social progress-import API errors for Dashboard UX.
 * source_empty is treated like source_missing (neutral / snooze).
 */

export function classifySocialProgressImportError(err) {
  const p = err?.payload && typeof err.payload === "object" ? err.payload : {};
  const raw = String(p.error ?? p.code ?? p.reason ?? err?.message ?? "").toLowerCase();
  if (raw.includes("already_imported")) return "already_imported";
  if (raw.includes("target_has_progress")) return "target_has_progress";
  if (raw.includes("source_not_authorized")) return "source_not_authorized";
  if (raw.includes("source_missing") || raw.includes("source_empty")) return "source_missing";
  return "generic";
}
