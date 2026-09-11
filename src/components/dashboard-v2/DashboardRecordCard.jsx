import {
  StarIcon,
  BeakerIcon,
  FolderIcon,
  TrophyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { getDashboardCompositionCopy } from "../../content/dashboardCompositionLocale.js";
import {
  getDashboardRecordMetrics,
  hasGenesisBadgeInMetadata,
} from "../../utils/dashboardRecordView.js";

/**
 * Historical Web3Edu Record — XP/labs/projects/badges without legacy Journey tiers.
 */
export default function DashboardRecordCard({
  metadata,
  lang = "en",
  hasGenesisBadge,
}) {
  const copy = getDashboardCompositionCopy(lang);
  const metrics = getDashboardRecordMetrics(metadata);
  const showGenesis =
    typeof hasGenesisBadge === "boolean"
      ? hasGenesisBadge
      : hasGenesisBadgeInMetadata(metadata);

  const items = [
    {
      key: "xp",
      label: copy.totalXp,
      value: metrics.xp.toLocaleString(lang === "gr" ? "el-GR" : "en-US"),
      icon: StarIcon,
      tone: "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      key: "labs",
      label: copy.labsCompleted,
      value: String(metrics.labsCompleted),
      icon: BeakerIcon,
      tone: "text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40",
    },
    {
      key: "projects",
      label: copy.projects,
      value: String(metrics.projectsCount),
      icon: FolderIcon,
      tone: "text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40",
    },
    {
      key: "badges",
      label: copy.achievements,
      value: String(metrics.badgesCount),
      icon: TrophyIcon,
      tone: "text-fuchsia-600 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-950/40",
    },
  ];

  return (
    <section
      id="dashboard-record"
      className="flex h-full scroll-mt-24 flex-col rounded-3xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/45 sm:px-5 sm:py-4"
      aria-labelledby="dashboard-record-title"
    >
      <div className="mb-3">
        <h2
          id="dashboard-record-title"
          className="text-base font-bold text-slate-900 dark:text-white sm:text-lg"
        >
          {copy.recordTitle}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {copy.recordSubtitle}
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-200/70 bg-slate-50/60 px-3 py-3 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div
                className={`mb-2.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-2 pt-3">
        {showGenesis ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{copy.genesisBadge}:</span>
            <span>{copy.poeYes}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
          <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">{copy.poeEarned}:</span>
          <span>{metrics.hasPoe ? copy.poeYes : copy.poeNo}</span>
        </div>
      </div>
    </section>
  );
}
