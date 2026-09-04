import { Link } from "react-router-dom";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import { LmApprovedVisual } from "./LmVisuals.jsx";

/**
 * Chapter-ending next action — distinct from Learning Path step 04.
 * @param {{ view: object, lang?: "en"|"gr" }} props
 */
export default function LmChapterClose({ view, lang = "en" }) {
  const copy = getLmPageCopy(lang);
  const cta = view.closingCta;
  if (!cta) return null;

  const complete = cta.kind === "complete";
  const visualSrc = cta.visualSrc || null;

  return (
    <section
      aria-labelledby="lm-chapter-close-title"
      className={`overflow-hidden rounded-[1.75rem] border px-5 py-5 sm:px-6 sm:py-6 ${
        complete
          ? "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10"
          : "border-violet-200/80 bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-50 dark:border-violet-500/25 dark:from-violet-950/50 dark:via-slate-900 dark:to-cyan-950/40"
      }`}
    >
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(15rem,1.05fr)_auto] xl:items-center xl:gap-6">
        <LmApprovedVisual
          src={visualSrc}
          className={
            complete
              ? "h-auto w-auto max-h-32 max-w-[11rem] sm:max-h-40 sm:max-w-[15rem]"
              : "h-auto w-full max-h-[7.5rem] max-w-full sm:max-h-36 xl:max-h-44"
          }
        />
        <div className="min-w-0">
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
              complete
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-indigo-700 dark:text-indigo-300"
            }`}
          >
            {cta.eyebrow}
          </p>
          <h2
            id="lm-chapter-close-title"
            className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white xl:whitespace-nowrap"
          >
            {cta.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {cta.body}
          </p>
          {complete && cta.currentModule ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {copy.currentModuleLabel}:{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {cta.currentModule}
                {cta.currentModuleTitle ? ` — ${cta.currentModuleTitle}` : ""}
              </span>
            </p>
          ) : null}
        </div>

        {cta.route && cta.ctaLabel ? (
          <Link
            to={cta.route}
            className={`inline-flex w-fit shrink-0 items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold whitespace-nowrap text-white shadow-sm xl:justify-self-end ${
              complete
                ? "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                : "bg-gradient-to-r from-violet-600 to-indigo-500 hover:brightness-110 dark:from-violet-500 dark:to-indigo-400"
            }`}
          >
            {cta.ctaLabel}
            {String(cta.ctaLabel).includes("→") ? "" : " →"}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
