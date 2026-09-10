/**
 * Compact assessment metadata strip (presentation only).
 * @param {{
 *   items?: string[],
 *   scopeHint?: string,
 *   summaryLabel?: string,
 * }} props
 */
export default function AssessmentMetaStrip({
  items = [],
  scopeHint = "",
  summaryLabel = "Assessment summary",
}) {
  const chips = (items || []).filter((item) => typeof item === "string" && item.trim());
  const hint = typeof scopeHint === "string" ? scopeHint.trim() : "";

  if (!chips.length && !hint) return null;

  return (
    <div
      className="border-b border-slate-200/70 pb-3 dark:border-white/10"
      data-assessment-meta-strip=""
    >
      {chips.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={summaryLabel}>
          {chips.map((item) => (
            <li
              key={item}
              className="inline-flex max-w-full rounded-md border border-slate-200/80 bg-slate-50/90 px-2 py-0.5 text-[0.6875rem] font-semibold leading-5 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {hint ? (
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
