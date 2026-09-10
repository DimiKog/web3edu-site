import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

/**
 * Compact pass / completion chrome with expandable detailed takeaways.
 * Score and XP must come from the assessment result — never invent awards.
 *
 * @param {{
 *   title: string,
 *   scoreLabel?: string | null,
 *   xpLabel: string,
 *   youCanNowLabel?: string,
 *   capabilities?: string[],
 *   keyPrinciple?: string,
 *   revisitTitle?: string,
 *   revisitRows?: Array<{ key: string, label?: string, hint: string }>,
 *   reviewTakeawaysLabel?: string,
 *   takeawaysTitle?: string,
 *   takeaways?: Array<{ id: string, text: string }>,
 *   continueHint?: string,
 *   dashboardPath: string,
 *   dashboardLabel: string,
 * }} props
 */
export default function AssessmentPassState({
  title,
  scoreLabel = null,
  xpLabel,
  youCanNowLabel = "",
  capabilities = [],
  keyPrinciple = "",
  revisitTitle = "",
  revisitRows = [],
  reviewTakeawaysLabel = "",
  takeawaysTitle = "",
  takeaways = [],
  continueHint = "",
  dashboardPath,
  dashboardLabel,
}) {
  const caps = (capabilities || [])
    .filter((item) => typeof item === "string" && item.trim())
    .slice(0, 3);
  const rationaleRows = (takeaways || []).filter(
    (row) => row && typeof row.text === "string" && row.text.trim()
  );
  const revisit = (revisitRows || []).filter(
    (row) => row && typeof row.hint === "string" && row.hint.trim()
  );
  const showRevisit = revisit.length > 0 && Boolean(revisitTitle);

  return (
    <div
      className="space-y-4 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-5 py-5 dark:border-emerald-400/20 dark:bg-emerald-400/10"
      data-assessment-pass-state=""
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-200" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            {title}
          </h2>
          <p className="mt-1 text-base font-semibold tabular-nums text-emerald-800 dark:text-emerald-100">
            {[scoreLabel, xpLabel].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {caps.length > 0 ? (
        <div className="text-sm leading-6 text-emerald-900 dark:text-emerald-100">
          {youCanNowLabel ? <h3 className="font-semibold">{youCanNowLabel}</h3> : null}
          <ul className={`list-disc space-y-1 pl-5 ${youCanNowLabel ? "mt-1.5" : ""}`}>
            {caps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {keyPrinciple ? (
        <p
          className="rounded-xl border border-emerald-300/50 bg-white/55 px-3 py-2 text-sm font-semibold leading-6 text-emerald-950 dark:border-emerald-400/20 dark:bg-black/10 dark:text-emerald-50"
          data-assessment-key-principle=""
        >
          {keyPrinciple}
        </p>
      ) : null}

      {showRevisit ? (
        <div
          className="rounded-xl border border-amber-300/45 bg-white/55 px-3 py-2.5 dark:border-amber-400/20 dark:bg-black/10"
          data-assessment-revisit=""
        >
          <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-50">
            {revisitTitle}
          </h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-950 dark:text-amber-50">
            {revisit.map((row) => (
              <li key={row.key}>
                {row.label ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                    {row.label}
                  </p>
                ) : null}
                <p className={row.label ? "mt-0.5" : undefined}>{row.hint}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {rationaleRows.length > 0 ? (
        <details className="group rounded-xl border border-emerald-300/45 bg-white/40 open:bg-white/55 dark:border-emerald-400/15 dark:bg-black/10 dark:open:bg-black/15">
          <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-emerald-900 marker:content-none dark:text-emerald-100 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="text-emerald-700 transition group-open:rotate-90 dark:text-emerald-200"
              >
                ▸
              </span>
              {reviewTakeawaysLabel || takeawaysTitle}
            </span>
          </summary>
          <div className="border-t border-emerald-200/70 px-3 py-2.5 text-sm leading-6 text-emerald-900 dark:border-emerald-400/15 dark:text-emerald-100">
            {takeawaysTitle && reviewTakeawaysLabel ? (
              <h3 className="font-semibold">{takeawaysTitle}</h3>
            ) : null}
            <ul
              className={`list-disc space-y-1.5 pl-5 ${
                takeawaysTitle && reviewTakeawaysLabel ? "mt-1.5" : ""
              }`}
            >
              {rationaleRows.map((row) => (
                <li key={row.id}>{row.text}</li>
              ))}
            </ul>
          </div>
        </details>
      ) : null}

      {continueHint ? (
        <p className="text-sm leading-6 text-emerald-800/90 dark:text-emerald-200/90">
          {continueHint}
        </p>
      ) : null}

      <Link
        to={dashboardPath}
        className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {dashboardLabel}
      </Link>
    </div>
  );
}
