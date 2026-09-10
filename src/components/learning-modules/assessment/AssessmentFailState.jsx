import { AlertTriangle } from "lucide-react";

/**
 * Compact fail / remediation chrome. Semantics remain in the panel + API.
 *
 * @param {{
 *   title: string,
 *   scoreLabel?: string | null,
 *   lead?: string,
 *   feedbackTitle?: string,
 *   feedbackRows?: Array<{ key: string, label?: string, hint: string }>,
 *   retryLabel: string,
 *   onRetry: () => void,
 * }} props
 */
export default function AssessmentFailState({
  title,
  scoreLabel = null,
  lead = "",
  feedbackTitle = "",
  feedbackRows = [],
  retryLabel,
  onRetry,
}) {
  return (
    <div
      className="mt-5 space-y-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-5 dark:border-amber-400/20 dark:bg-amber-400/10"
      data-assessment-fail-state=""
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-200" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-50">{title}</h2>
          {scoreLabel ? (
            <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-900 dark:text-amber-100">
              {scoreLabel}
            </p>
          ) : null}
          {lead ? (
            <p className="mt-1.5 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
              {lead}
            </p>
          ) : null}
        </div>
      </div>

      {feedbackRows.length > 0 ? (
        <div className="text-sm leading-6 text-amber-950 dark:text-amber-50">
          {feedbackTitle ? <h3 className="font-semibold">{feedbackTitle}</h3> : null}
          <ul className={`space-y-2.5 ${feedbackTitle ? "mt-2.5" : ""}`}>
            {feedbackRows.map((row) => (
              <li
                key={row.key}
                className="rounded-xl border border-amber-300/50 bg-white/50 px-3 py-2 dark:border-amber-400/15 dark:bg-black/10"
              >
                {row.label ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                    {row.label}
                  </p>
                ) : null}
                <p
                  className={
                    row.label
                      ? "mt-0.5 text-amber-950 dark:text-amber-50"
                      : "text-amber-950 dark:text-amber-50"
                  }
                >
                  {row.hint}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
      >
        {retryLabel}
      </button>
    </div>
  );
}
