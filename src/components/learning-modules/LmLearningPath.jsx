import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { LmActivityTile } from "./LmVisuals.jsx";
import { getLmPageCopy } from "../../content/lmPageLocale.js";

const TYPE_STYLES = {
  book: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  reading: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
  demo: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  simulator: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
  observation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  coding: "bg-teal-100 text-teal-900 dark:bg-teal-500/20 dark:text-teal-100",
  inspection: "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100",
  verification: "bg-orange-100 text-orange-950 dark:bg-orange-500/20 dark:text-orange-100",
  assessment: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-200",
};

const STATUS_STYLES = {
  available: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  external: "bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-100",
  recommended: "bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-100",
  core: "bg-violet-50 text-violet-900 dark:bg-violet-500/15 dark:text-violet-100",
  optional: "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300",
  interactive: "bg-cyan-50 text-cyan-900 dark:bg-cyan-500/15 dark:text-cyan-100",
  evidence_required: "bg-amber-50 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100",
  evidence_satisfied: "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100",
  assessment_required: "bg-amber-50 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100",
  assessment_passed: "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100",
};

function StatusPill({ statusKind, label }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        STATUS_STYLES[statusKind] || STATUS_STYLES.available
      }`}
    >
      {label}
    </span>
  );
}

function ActivityAction({ row, lang, expanded, onToggle }) {
  const copy = getLmPageCopy(lang);

  if (row.embed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:translate-x-0.5 dark:text-indigo-300"
      >
        {expanded ? copy.closeSimulator : row.ctaLabel} →
      </button>
    );
  }

  if (!row.href) return null;

  if (row.linkKind === "external") {
    return (
      <a
        href={row.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 transition hover:translate-x-0.5 dark:text-indigo-300"
      >
        {row.ctaLabel}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link
      to={row.href}
      className="inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:translate-x-0.5 dark:text-indigo-300"
    >
      {row.ctaLabel} →
    </Link>
  );
}

/**
 * One cohesive Learning Path surface with compact illustrated activity rows.
 * Embed content is supplied by the caller (presentation only).
 * @param {{
 *   activities: Array,
 *   lang?: "en"|"gr",
 *   moduleId?: string,
 *   renderEmbed?: (row: object, ctx: { lang: "en"|"gr" }) => import("react").ReactNode,
 * }} props
 */
export default function LmLearningPath({
  activities = [],
  lang = "en",
  moduleId = "LM01",
  renderEmbed = null,
}) {
  const copy = getLmPageCopy(lang, moduleId);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section
      aria-labelledby="lm-learning-path-title"
      className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_20px_50px_-36px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/[0.035]"
    >
      <header className="border-b border-slate-100 px-5 py-5 dark:border-white/[0.07] sm:px-7">
        <h2
          id="lm-learning-path-title"
          className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-2xl"
        >
          {copy.learningPath}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          {copy.learningPathIntro}
        </p>
      </header>

      <ol className="relative px-4 py-2 sm:px-6 sm:py-3">
        <div
          className="pointer-events-none absolute bottom-10 left-8 top-10 w-px bg-sky-300/80 dark:bg-cyan-400/40 sm:left-10"
          aria-hidden="true"
        />

        {activities.map((row, index) => {
          const expanded = row.embed && expandedId === row.id;
          const onToggle = () =>
            setExpandedId((current) => (current === row.id ? null : row.id));
          return (
            <li key={row.id} className="relative">
              {/*
                Mobile: compact illustration accent beside type/title; description +
                status/CTA use the full content width under that header.
                Desktop: shared modestly reduced tile scale beside the text column.
              */}
              <div className="flex items-start gap-3 py-4 sm:items-center sm:gap-4">
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm ring-4 ring-white dark:bg-violet-500 dark:ring-slate-950">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 sm:flex sm:items-center sm:gap-4">
                  <LmActivityTile
                    visualType={row.visualType}
                    visualSrc={row.visualSrc}
                    className="col-start-1 row-start-1 h-12 w-[4.5rem] shrink-0 self-start sm:h-[5.5rem] sm:w-[8.1rem] sm:self-center"
                  />

                  <div className="col-start-2 row-start-1 min-w-0 sm:flex sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                          TYPE_STYLES[row.visualType] || TYPE_STYLES.reading
                        }`}
                      >
                        {row.typeLabel}
                      </span>
                      <h3 className="mt-1 text-[15px] font-extrabold leading-snug tracking-tight text-slate-950 dark:text-white sm:text-base">
                        {row.title}
                      </h3>
                      <p className="mt-1 hidden max-w-xl text-sm leading-5 text-slate-600 dark:text-slate-300 sm:block">
                        {row.description}
                      </p>
                    </div>

                    <div className="mt-2 hidden shrink-0 flex-wrap items-center gap-3 sm:mt-0 sm:flex sm:flex-col sm:items-end sm:gap-2">
                      <StatusPill statusKind={row.statusKind} label={row.statusLabel} />
                      <ActivityAction
                        row={row}
                        lang={lang}
                        expanded={expanded}
                        onToggle={onToggle}
                      />
                    </div>
                  </div>

                  <p className="col-span-2 text-sm leading-5 text-slate-600 dark:text-slate-300 sm:hidden">
                    {row.description}
                  </p>
                  <div className="col-span-2 flex flex-wrap items-center gap-3 sm:hidden">
                    <StatusPill statusKind={row.statusKind} label={row.statusLabel} />
                    <ActivityAction
                      row={row}
                      lang={lang}
                      expanded={expanded}
                      onToggle={onToggle}
                    />
                  </div>
                </div>
              </div>

              {expanded && typeof renderEmbed === "function" ? (
                <div className="mb-4 ml-11 rounded-2xl border border-cyan-200/70 bg-slate-50/80 p-3 dark:border-cyan-500/20 dark:bg-slate-950/30 sm:ml-14 sm:p-4">
                  {renderEmbed(row, { lang })}
                </div>
              ) : null}

              {index < activities.length - 1 ? (
                <div className="ml-11 border-b border-slate-100 dark:border-white/[0.06] sm:ml-14" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
