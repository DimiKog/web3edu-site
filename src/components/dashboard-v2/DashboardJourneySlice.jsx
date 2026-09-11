import { useCallback } from "react";
import { getDashboardJourneyViewState } from "../../utils/dashboardJourneyView.js";
import DashboardLearnerGreeting from "./DashboardLearnerGreeting.jsx";
import DashboardNextStepCard from "./DashboardNextStepCard.jsx";
import DashboardLearningJourneyCard from "./DashboardLearningJourneyCard.jsx";

function navigateHashSafe(path) {
  if (!path) return;
  try {
    if (typeof window !== "undefined") {
      const normalized = String(path).startsWith("/") ? String(path) : `/${path}`;
      window.location.hash = `#${normalized}`;
    }
  } catch {
    /* ignore */
  }
}

/**
 * Dashboard v2 Slice 1 — Journey (greeting + next step + learning journey).
 * @param {{
 *   progression: Record<string, unknown>|null|undefined,
 *   hasHistoricalRecord?: boolean,
 *   progressionError?: boolean,
 *   lang?: "en"|"gr",
 *   onScrollToRecord?: () => void,
 * }} props
 */
export default function DashboardJourneySlice({
  progression,
  hasHistoricalRecord = false,
  progressionError = false,
  lang = "en",
  onScrollToRecord,
}) {
  const view = getDashboardJourneyViewState({
    progression,
    hasHistoricalRecord,
    progressionError,
    lang,
  });

  const handleNavigate = useCallback((route) => {
    navigateHashSafe(route);
  }, []);

  if (view.mode === "unavailable") {
    return (
      <div className="space-y-4">
        <DashboardLearnerGreeting greeting={view.greeting} />
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 dark:border-amber-600/40 dark:bg-amber-950/25 dark:text-amber-100">
          {view.copy.greetingUnavailable}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <DashboardLearnerGreeting greeting={view.greeting} />

      {view.showRecordPreserved ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-sky-500/30 dark:bg-sky-950/30">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sky-950 dark:text-sky-50">
              {view.copy.recordPreservedTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-sky-900/85 dark:text-sky-100/85">
              {view.copy.recordPreservedBody}
            </p>
          </div>
          {typeof onScrollToRecord === "function" ? (
            <button
              type="button"
              onClick={onScrollToRecord}
              className="shrink-0 text-left text-sm font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-200 sm:text-right"
            >
              {view.copy.viewRecord}
            </button>
          ) : null}
        </div>
      ) : null}

      <DashboardNextStepCard nextStep={view.nextStep} onNavigate={handleNavigate} lang={lang} />

      <DashboardLearningJourneyCard
        nodes={view.journeyNodes}
        journeyNote={view.journeyNote}
        learnRoute={view.learnRoute}
        copy={view.copy}
        onNavigate={handleNavigate}
        showJourneyNote={
          view.mode === "legacy_start" ||
          view.mode === "fresh_start" ||
          Boolean(view.journeyNodes?.some((n) => n.status === "bridged"))
        }
      />
    </div>
  );
}
