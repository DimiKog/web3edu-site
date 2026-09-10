/**
 * Question hierarchy chrome: number, optional Critical, type, optional short heading.
 * Prompt is rendered separately as body text by the parent.
 *
 * @param {{
 *   number: number,
 *   typeLabel: string,
 *   isMultiple?: boolean,
 *   heading?: string,
 *   critical?: boolean,
 *   criticalLabel?: string,
 * }} props
 */
export default function AssessmentQuestionHeader({
  number,
  typeLabel,
  isMultiple = false,
  heading = "",
  critical = false,
  criticalLabel = "",
}) {
  const title = typeof heading === "string" ? heading.trim() : "";
  const type = typeof typeLabel === "string" ? typeLabel.trim() : "";
  const criticalText = typeof criticalLabel === "string" ? criticalLabel.trim() : "";
  const showCritical = Boolean(critical) && Boolean(criticalText);

  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-1.5"
      data-assessment-question-header=""
      data-question-type={isMultiple ? "multiple_select" : "single_choice"}
      data-critical={showCritical ? "true" : "false"}
    >
      <span className="inline-flex rounded-md bg-slate-900 px-2 py-0.5 text-[0.6875rem] font-bold tabular-nums tracking-wide text-white dark:bg-white dark:text-slate-900">
        Q{number}
      </span>
      {showCritical ? (
        <span
          className="inline-flex max-w-full rounded-full border border-violet-300/80 bg-violet-50 px-2 py-0.5 text-[0.6875rem] font-semibold leading-5 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-100"
          data-critical-chip=""
        >
          {criticalText}
        </span>
      ) : null}
      {type ? (
        <span
          className={[
            "inline-flex max-w-full rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-5",
            isMultiple
              ? "border-cyan-200/80 bg-cyan-50 text-cyan-800 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100"
              : "border-slate-200/80 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300",
          ].join(" ")}
        >
          {type}
        </span>
      ) : null}
      {title ? (
        <span className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
          {title}
        </span>
      ) : null}
    </div>
  );
}
