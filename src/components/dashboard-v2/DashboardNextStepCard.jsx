const NEXT_ACTION_ASSET = "/assets/dashboard-v2/dashboard-next-action.png";

/**
 * Primary Next Step / Next Milestone card — locked visual asset.
 * Artwork is integrated into one continuous card surface (PNG has real alpha).
 */
export default function DashboardNextStepCard({ nextStep, onNavigate }) {
  if (!nextStep) return null;

  const isContinue = nextStep.variant === "continue";
  const isStart = nextStep.variant === "start";
  const isUpcoming = nextStep.variant === "upcoming";

  const shellClass = isContinue
    ? "relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-indigo-50/90 to-white shadow-md dark:border-violet-500/25 dark:from-violet-950/50 dark:via-indigo-950/40 dark:to-slate-950/80"
    : isStart
      ? "relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/95 via-teal-50/70 to-white shadow-md dark:border-emerald-500/25 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-950/80"
      : isUpcoming
        ? "relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-white shadow-sm dark:border-white/10 dark:from-slate-900/60 dark:via-indigo-950/25 dark:to-slate-950/80"
        : "relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/50";

  const primaryBtnClass = isContinue
    ? "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
    : isStart
      ? "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
      : "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95";

  const showPrimary =
    Boolean(nextStep.primaryCta) &&
    nextStep.primaryEnabled &&
    Boolean(nextStep.primaryRoute);

  return (
    <section className={shellClass} aria-labelledby="dashboard-next-step-title">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[40%] bg-gradient-to-l from-white/35 to-transparent dark:from-white/[0.03] lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 grid items-center gap-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(9rem,0.6fr)]">
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 lg:pr-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {nextStep.eyebrow}
            </p>
            {isUpcoming && nextStep.comingSoonLabel ? (
              <span className="rounded-full border border-slate-300/70 bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                {nextStep.comingSoonLabel}
              </span>
            ) : null}
          </div>
          <h2
            id="dashboard-next-step-title"
            className="mt-1 text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl"
          >
            {nextStep.title}
          </h2>

          {nextStep.body && nextStep.variant !== "start" ? (
            <p className="mt-1 max-w-xl text-sm leading-snug text-slate-600 dark:text-slate-300">
              {nextStep.body}
            </p>
          ) : null}

          {isStart && Array.isArray(nextStep.bullets) ? (
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {nextStep.bullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {isStart && nextStep.body ? (
            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              {nextStep.body}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {showPrimary ? (
              <button
                type="button"
                onClick={() => onNavigate(nextStep.primaryRoute)}
                className={primaryBtnClass}
              >
                {nextStep.primaryCta}
              </button>
            ) : null}

            {nextStep.secondaryCta && nextStep.secondaryRoute ? (
              <button
                type="button"
                onClick={() => onNavigate(nextStep.secondaryRoute)}
                className={
                  isUpcoming
                    ? "inline-flex items-center justify-center rounded-xl border border-indigo-300/60 bg-white/80 px-3.5 py-2 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-white/5 dark:text-indigo-200"
                    : "text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
                }
              >
                {nextStep.secondaryCta}
              </button>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-none relative hidden min-h-[7.5rem] items-center justify-center p-2 pr-4 lg:flex">
          <img
            src={NEXT_ACTION_ASSET}
            alt=""
            className="max-h-36 w-full object-contain object-center drop-shadow-sm"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex justify-center px-4 pb-3.5 pt-0 lg:hidden">
        <img
          src={NEXT_ACTION_ASSET}
          alt=""
          className="h-20 w-auto max-w-[13rem] object-contain object-center"
          loading="lazy"
        />
      </div>
    </section>
  );
}
