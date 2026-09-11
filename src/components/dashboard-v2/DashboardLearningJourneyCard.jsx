import { CheckIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const JOURNEY_ASSET = "/assets/dashboard-v2/dashboard-learning-journey.png";

/**
 * Explorer → Builder → Architect journey — desktop 2-column composition.
 * Left: continuous milestone track + optional legacy note.
 * Right: signature artwork (supporting visual). Presentation only.
 */
export default function DashboardLearningJourneyCard({
  nodes,
  journeyNote,
  learnRoute,
  copy,
  onNavigate,
  showJourneyNote = false,
}) {
  if (!Array.isArray(nodes) || nodes.length === 0) return null;

  return (
    <section
      className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/45"
      aria-labelledby="dashboard-learning-journey-title"
    >
      <div className="px-4 py-3 sm:px-5 sm:py-3.5">
        {/* A. Header — full width */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2
              id="dashboard-learning-journey-title"
              className="text-base font-bold text-slate-900 dark:text-white sm:text-lg"
            >
              {copy.journeyTitle}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {copy.journeySubtitle}
            </p>
          </div>
          {learnRoute ? (
            <button
              type="button"
              onClick={() => onNavigate(learnRoute)}
              className="text-xs font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300 sm:text-sm"
            >
              {copy.openLearn}
            </button>
          ) : null}
        </div>

        {/*
          B. Body — md+: ~63% track column / ~37% artwork column.
          Mobile: track first, artwork below (single column).
        */}
        <div className="mt-3 grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:gap-4 lg:gap-5">
          {/* LEFT — continuous track + labels + legacy note */}
          <div className="relative min-w-0">
            {/*
              Track geometry (sm+):
              3 equal columns → centers at 16.666%, 50%, 83.333%.
              One absolute bar from Explorer center → Architect center,
              painted behind circles — no fragments.
            */}
            <div
              className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-5 z-[1] hidden h-[3px] -translate-y-1/2 sm:block"
              aria-hidden="true"
            >
              <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500 dark:from-emerald-500/90 dark:via-sky-400/85 dark:to-violet-400/90" />
            </div>

            <ol className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
              {nodes.map((node) => {
                const isCompleted = node.status === "completed";
                const isCurrent = node.status === "current";
                const isBridged = node.status === "bridged";

                return (
                  <li
                    key={node.tierKey}
                    className="relative flex sm:flex-col sm:items-center sm:text-center"
                  >
                    <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:gap-1.5">
                      <span
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-sm ${
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isBridged
                              ? "border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-400/70 dark:bg-sky-950 dark:text-sky-200"
                              : isCurrent
                                ? "border-violet-500 bg-white text-violet-600 dark:border-violet-400 dark:bg-slate-900 dark:text-violet-300"
                                : "border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500"
                        }`}
                        aria-hidden="true"
                      >
                        {isCompleted ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : isBridged ? (
                          <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                        ) : (
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isCurrent
                                ? "bg-violet-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                        )}
                      </span>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {node.label}
                        </p>
                        <p
                          className={`mt-0.5 text-xs font-medium ${
                            isCompleted
                              ? "text-emerald-700 dark:text-emerald-300"
                              : isBridged
                                ? "text-sky-700 dark:text-sky-300"
                                : isCurrent
                                  ? "text-violet-700 dark:text-violet-300"
                                  : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {node.statusLabel}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {node.modulesLabel}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {showJourneyNote && journeyNote?.text ? (
              <p
                className={`mt-2.5 flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11px] leading-snug sm:text-xs ${
                  journeyNote.tone === "milestone"
                    ? "bg-indigo-50/60 text-indigo-900/90 dark:bg-indigo-950/25 dark:text-indigo-100/90"
                    : "bg-slate-100/70 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300"
                }`}
              >
                <ArrowPathIcon
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70"
                  aria-hidden="true"
                />
                <span>{journeyNote.text}</span>
              </p>
            ) : null}
          </div>

          {/* RIGHT — signature artwork; fills column, no panel, no crop */}
          <div
            className="flex min-w-0 items-center justify-center self-stretch"
            aria-hidden="true"
          >
            <img
              src={JOURNEY_ASSET}
              alt=""
              className="block h-auto w-full max-w-sm object-contain object-center drop-shadow-sm md:max-w-none md:drop-shadow"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
