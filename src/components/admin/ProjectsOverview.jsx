import { useMemo } from "react";

const EMPTY_PROJECTS_OVERVIEW = {
    summary: {
        totalProjectsStarted: 0,
        totalProjectsSubmitted: 0,
        totalProjectsPendingReview: 0,
        totalProjectsCompleted: 0,
        totalProjectsNeedsRevision: 0,
        totalProjectsRejected: 0,
        usersWithAnyProject: 0,
        usersWithCompletedProject: 0,
    },
    byProject: [],
    insights: {},
};

function normalizeProjectsOverview(raw) {
    if (!raw || typeof raw !== "object") {
        return EMPTY_PROJECTS_OVERVIEW;
    }

    const summary = raw.summary && typeof raw.summary === "object"
        ? {
            totalProjectsStarted: Number(raw.summary.totalProjectsStarted) || 0,
            totalProjectsSubmitted: Number(raw.summary.totalProjectsSubmitted) || 0,
            totalProjectsPendingReview: Number(raw.summary.totalProjectsPendingReview) || 0,
            totalProjectsCompleted: Number(raw.summary.totalProjectsCompleted) || 0,
            totalProjectsNeedsRevision: Number(raw.summary.totalProjectsNeedsRevision) || 0,
            totalProjectsRejected: Number(raw.summary.totalProjectsRejected) || 0,
            usersWithAnyProject: Number(raw.summary.usersWithAnyProject) || 0,
            usersWithCompletedProject: Number(raw.summary.usersWithCompletedProject) || 0,
        }
        : EMPTY_PROJECTS_OVERVIEW.summary;

    const byProject = Array.isArray(raw.byProject) ? raw.byProject : [];
    const insights = raw.insights && typeof raw.insights === "object" ? raw.insights : {};

    return { summary, byProject, insights };
}

function getProjectTitle(item) {
    return item?.title?.en || item?.title?.el || item?.projectId || "—";
}

function formatInsightProject(insight) {
    if (!insight) return "—";
    if (typeof insight === "string") return insight;
    return insight?.title?.en || insight?.title?.el || insight?.projectId || "—";
}

function formatCompletionRate(rate) {
    if (rate === null || rate === undefined || Number.isNaN(Number(rate))) {
        return "—";
    }
    const value = Number(rate);
    const pct = value <= 1 ? Math.round(value * 100) : Math.round(value);
    return `${pct}%`;
}

function hasProjectActivity(data) {
    const { summary, byProject } = data;
    if (byProject.length > 0) return true;

    return (
        summary.totalProjectsStarted > 0 ||
        summary.totalProjectsSubmitted > 0 ||
        summary.totalProjectsPendingReview > 0 ||
        summary.totalProjectsCompleted > 0 ||
        summary.totalProjectsNeedsRevision > 0 ||
        summary.totalProjectsRejected > 0
    );
}

export default function ProjectsOverview({ projectsOverview }) {
    const data = useMemo(
        () => normalizeProjectsOverview(projectsOverview),
        [projectsOverview]
    );

    const showActivity = hasProjectActivity(data);
    const { summary, byProject, insights } = data;

    const summaryCards = [
        { label: "Projects Started", value: summary.totalProjectsStarted, tone: "started" },
        { label: "Projects Completed", value: summary.totalProjectsCompleted, tone: "completed" },
        { label: "Pending Review", value: summary.totalProjectsPendingReview, tone: "pending" },
        { label: "Needs Revision", value: summary.totalProjectsNeedsRevision, tone: "revision" },
    ];

    const insightItems = [
        { label: "Most started project", value: formatInsightProject(insights.mostStartedProject), tone: "started" },
        { label: "Most completed project", value: formatInsightProject(insights.mostCompletedProject), tone: "completed" },
        { label: "Highest pending review", value: formatInsightProject(insights.highestPendingReviewProject), tone: "pending" },
        { label: "Lowest completion project", value: formatInsightProject(insights.lowestCompletionProject), tone: "revision" },
    ];

    return (
        <div className="rounded-2xl border border-fuchsia-200/40 bg-white/70 dark:border-fuchsia-500/20 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
            <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF67D2] to-[#8A57FF] text-sm font-bold text-white shadow-md">
                    ◆
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Projects Overview
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {summaryCards.map((card) => (
                    <SummaryCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
                ))}
            </div>

            {!showActivity ? (
                <p className="rounded-xl border border-white/10 bg-white/60 dark:bg-slate-900/40 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    No project activity recorded yet.
                </p>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                            Project Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {insightItems.map((item) => (
                                <InsightCard
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                    tone={item.tone}
                                />
                            ))}
                        </div>
                    </div>

                    {byProject.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-gradient-to-r from-indigo-50/80 via-violet-50/50 to-fuchsia-50/40 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-fuchsia-950/20 text-left text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
                                        <th className="px-3 py-2 font-semibold">Project</th>
                                        <th className="px-3 py-2 font-semibold text-right">Started</th>
                                        <th className="px-3 py-2 font-semibold text-right">Submitted</th>
                                        <th className="px-3 py-2 font-semibold text-right">Pending</th>
                                        <th className="px-3 py-2 font-semibold text-right">Completed</th>
                                        <th className="px-3 py-2 font-semibold text-right">Needs Revision</th>
                                        <th className="px-3 py-2 font-semibold text-right">Rejected</th>
                                        <th className="px-3 py-2 font-semibold text-right">Completion %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {byProject.map((project, idx) => {
                                        const title = getProjectTitle(project);
                                        const projectId = project?.projectId || `project-${idx}`;

                                        return (
                                            <tr
                                                key={`${projectId}-${idx}`}
                                                className="bg-white/40 dark:bg-slate-900/20"
                                            >
                                                <td className="px-3 py-2.5">
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                                        {title}
                                                    </p>
                                                    {title !== projectId ? (
                                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                                            {projectId}
                                                        </p>
                                                    ) : null}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.started ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.submitted ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.pendingReview ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.completed ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.needsRevision ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
                                                    {project?.rejected ?? 0}
                                                </td>
                                                <td className="px-3 py-2.5 text-right font-medium text-slate-900 dark:text-slate-100">
                                                    {formatCompletionRate(project?.completionRate)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

const PROJECT_SUMMARY_TONES = {
    started: {
        border: "border-indigo-300/50 dark:border-indigo-500/35",
        bg: "bg-gradient-to-br from-indigo-50/90 via-white/80 to-white/70 dark:from-indigo-950/40 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-indigo-700 dark:text-indigo-300",
        value: "text-indigo-950 dark:text-indigo-100",
        dot: "bg-indigo-500",
    },
    completed: {
        border: "border-emerald-300/50 dark:border-emerald-500/35",
        bg: "bg-gradient-to-br from-emerald-50/90 via-white/80 to-white/70 dark:from-emerald-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-emerald-800 dark:text-emerald-300",
        value: "text-emerald-950 dark:text-emerald-100",
        dot: "bg-emerald-500",
    },
    pending: {
        border: "border-amber-300/50 dark:border-amber-500/35",
        bg: "bg-gradient-to-br from-amber-50/90 via-white/80 to-white/70 dark:from-amber-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-amber-800 dark:text-amber-300",
        value: "text-amber-950 dark:text-amber-100",
        dot: "bg-amber-500",
    },
    revision: {
        border: "border-rose-300/50 dark:border-rose-500/35",
        bg: "bg-gradient-to-br from-rose-50/90 via-white/80 to-white/70 dark:from-rose-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-rose-800 dark:text-rose-300",
        value: "text-rose-950 dark:text-rose-100",
        dot: "bg-rose-500",
    },
};

function SummaryCard({ label, value, tone }) {
    const styles = PROJECT_SUMMARY_TONES[tone] || PROJECT_SUMMARY_TONES.started;

    return (
        <div className={`rounded-2xl border backdrop-blur-xl p-4 shadow-md ${styles.border} ${styles.bg}`}>
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} aria-hidden="true" />
                <div className={`text-xs uppercase tracking-wide font-semibold ${styles.label}`}>
                    {label}
                </div>
            </div>
            <div className={`text-2xl font-bold mt-2 ${styles.value}`}>
                {value}
            </div>
        </div>
    );
}

function InsightCard({ label, value, tone }) {
    const styles = PROJECT_SUMMARY_TONES[tone] || PROJECT_SUMMARY_TONES.started;

    return (
        <div className={`rounded-xl border p-4 ${styles.border} ${styles.bg}`}>
            <div className={`text-xs uppercase tracking-wide font-semibold ${styles.label}`}>
                {label}
            </div>
            <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {value}
            </div>
        </div>
    );
}
