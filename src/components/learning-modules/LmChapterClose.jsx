import { Link } from "react-router-dom";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import { LmApprovedVisual } from "./LmVisuals.jsx";

/**
 * Chapter-ending next action — distinct from Learning Path step 04.
 * Incomplete: native text primary (left) + supporting illustration (right).
 * @param {{ view: object, lang?: "en"|"gr" }} props
 */
export default function LmChapterClose({ view, lang = "en" }) {
  const copy = getLmPageCopy(lang, view?.moduleId || "LM01");
  const cta = view.closingCta;
  if (!cta) return null;

  const complete = cta.kind === "complete";
  const visualSrc = cta.visualSrc || null;
  const unavailable = !complete && !cta.route;

  const actionLink =
    cta.route && cta.ctaLabel ? (
      <Link
        to={cta.route}
        className={`inline-flex w-fit shrink-0 items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold whitespace-nowrap text-white shadow-sm ${
          complete
            ? "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            : "bg-gradient-to-r from-violet-600 to-indigo-500 hover:brightness-110 dark:from-violet-500 dark:to-indigo-400"
        }`}
      >
        {cta.ctaLabel}
        {String(cta.ctaLabel).includes("→") ? "" : " →"}
      </Link>
    ) : null;

  if (complete) {
    return (
      <section
        aria-labelledby="lm-chapter-close-title"
        className="overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-emerald-50/70 px-5 py-5 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:px-6 sm:py-6"
      >
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1.2fr)_max-content] xl:items-center xl:gap-8">
          <LmApprovedVisual
            src={visualSrc}
            alt=""
            className="h-auto w-auto max-h-32 max-w-[11rem] sm:max-h-40 sm:max-w-[15rem]"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              {cta.eyebrow}
            </p>
            <h2
              id="lm-chapter-close-title"
              className="mt-1 text-xl font-extrabold leading-snug tracking-tight text-slate-950 dark:text-white"
            >
              {cta.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {cta.body}
            </p>
            {cta.currentModule ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {copy.currentModuleLabel}:{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {cta.currentModule}
                  {cta.currentModuleTitle ? ` — ${cta.currentModuleTitle}` : ""}
                </span>
              </p>
            ) : null}
          </div>
          {actionLink}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="lm-chapter-close-title"
      className="overflow-hidden rounded-[1.75rem] border border-violet-200/80 bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-50 px-5 py-5 dark:border-violet-500/25 dark:from-violet-950/50 dark:via-slate-900 dark:to-cyan-950/40 sm:px-6 sm:py-6"
      data-lm-chapter-close-native="true"
    >
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-8">
        <div className="min-w-0 order-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
            {cta.eyebrow}
          </p>
          <h2
            id="lm-chapter-close-title"
            className="mt-1 text-xl font-extrabold leading-snug tracking-tight text-slate-950 dark:text-white"
          >
            {cta.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {cta.body}
          </p>

          {unavailable ? (
            <div
              className="mt-4 inline-flex max-w-full flex-col gap-0.5 rounded-2xl border border-violet-200/80 bg-white/80 px-3.5 py-2.5 dark:border-violet-400/25 dark:bg-violet-500/10 sm:flex-row sm:items-center sm:gap-3"
              data-lm-chapter-close-coming-soon="true"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {copy.assessmentComingSoon}
              </p>
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                {copy.closingComingSoonHint}
              </p>
            </div>
          ) : null}

          {actionLink ? <div className="mt-4">{actionLink}</div> : null}
        </div>

        {visualSrc ? (
          <div className="order-2 flex justify-center md:justify-end">
            <LmApprovedVisual
              src={visualSrc}
              alt=""
              className="h-auto w-full max-h-44 max-w-[16rem] sm:max-h-52 sm:max-w-[18rem] md:max-h-56 md:max-w-full"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
