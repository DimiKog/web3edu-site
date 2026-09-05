import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Boxes,
  FileCode2,
  GitCompareArrows,
  Search,
  Send,
  WandSparkles,
} from "lucide-react";
import { getLm08ChapterCopy } from "../../content/lm08ChapterLocale.js";

const STAGE_ICONS = [
  FileCode2,
  WandSparkles,
  Binary,
  Send,
  Boxes,
  GitCompareArrows,
  Search,
  BadgeCheck,
];

/**
 * Compact visual lifecycle strip — conceptual map only.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm08LifecycleExplainer({ lang = "en" }) {
  const copy = getLm08ChapterCopy(lang);
  const stages = Array.isArray(copy.stages) ? copy.stages : [];

  return (
    <section
      id="lm08-lifecycle"
      aria-labelledby="lm08-lifecycle-title"
      className="rounded-[1.5rem] border border-cyan-200/70 bg-gradient-to-br from-cyan-50/90 via-white to-violet-50/60 px-4 py-4 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.35)] dark:border-cyan-500/20 dark:from-cyan-950/35 dark:via-slate-950/40 dark:to-violet-950/30 sm:px-5 sm:py-5"
    >
      <h2
        id="lm08-lifecycle-title"
        className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg"
      >
        {copy.lifecycleTitle}
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {copy.lifecycleSubtitle}
      </p>

      {/* Mobile / tablet: compact 2-column ordered flow */}
      <ol className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
        {stages.map((stage, index) => {
          const Icon = STAGE_ICONS[index] || FileCode2;
          return (
            <li
              key={`${stage.title}-${index}`}
              className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/85 px-2.5 py-2 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-sm">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-xs font-bold leading-snug text-slate-900 dark:text-white">
                  {stage.title}
                </p>
                {stage.hint ? (
                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                    {stage.hint}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop: two connected rows of four (fits content width) */}
      <div className="mt-4 hidden lg:block">
        <ol className="flex items-stretch gap-1.5">
          {stages.slice(0, 4).map((stage, offset) => {
            const index = offset;
            const Icon = STAGE_ICONS[index] || FileCode2;
            const isLastInRow = offset === 3;
            return (
              <li key={`${stage.title}-${index}`} className="flex min-w-0 flex-1 items-center gap-1.5">
                <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-slate-200/70 bg-white/90 px-2 py-2.5 text-center dark:border-white/10 dark:bg-white/[0.05]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-[11px] font-extrabold leading-snug text-slate-900 dark:text-white">
                    {stage.title}
                  </p>
                  {stage.hint ? (
                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                      {stage.hint}
                    </p>
                  ) : null}
                </div>
                {!isLastInRow ? (
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-violet-400 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="my-1.5 flex justify-center" aria-hidden="true">
          <ArrowRight className="h-4 w-4 rotate-90 text-violet-400 dark:text-cyan-400" />
        </div>
        <ol className="flex items-stretch gap-1.5">
          {stages.slice(4, 8).map((stage, offset) => {
            const index = 4 + offset;
            const Icon = STAGE_ICONS[index] || FileCode2;
            const isLastInRow = offset === 3;
            return (
              <li key={`${stage.title}-${index}`} className="flex min-w-0 flex-1 items-center gap-1.5">
                <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-slate-200/70 bg-white/90 px-2 py-2.5 text-center dark:border-white/10 dark:bg-white/[0.05]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-[11px] font-extrabold leading-snug text-slate-900 dark:text-white">
                    {stage.title}
                  </p>
                  {stage.hint ? (
                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                      {stage.hint}
                    </p>
                  ) : null}
                </div>
                {!isLastInRow ? (
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-violet-400 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-4 max-w-3xl border-l-2 border-violet-300/70 pl-3 text-xs leading-5 text-slate-600 dark:border-violet-400/40 dark:text-slate-300 sm:text-sm sm:leading-6">
        {copy.conceptualNote}
      </p>
      {copy.foodTraceLine ? (
        <p className="mt-2 max-w-3xl text-[11px] leading-5 text-slate-500 dark:text-slate-400 sm:text-xs">
          {copy.foodTraceLine}
        </p>
      ) : null}
    </section>
  );
}
