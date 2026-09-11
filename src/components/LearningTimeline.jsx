import { useState } from "react";
import { getDashboardCompositionCopy } from "../content/dashboardCompositionLocale.js";
import { getTimelineCompactStats } from "../utils/dashboardRecordView.js";

/**
 * LearningTimeline
 * Props:
 *  - timeline: Array of timeline events from backend metadata
 *      [{ type, id, title, xp, badge, completedAt }]
 * Collapsed by default on Dashboard; expands to the full chronological feed.
 * Includes passed LM assessments when projected into the timeline feed.
 */
const LearningTimeline = ({ timeline = [], lang = "en", isLoading = false }) => {
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(false);
    const composition = getDashboardCompositionCopy(lang);

    const labels = {
        en: {
            title: "📈 Learning Timeline",
            all: "All",
            lab: "Labs",
            lesson: "Lessons",
            quiz: "Quizzes",
            project: "Projects",
            assessment: "Assessments",
            empty: "Your activity will appear here as you progress.",
            emptyHint:
                "Complete a lab, lesson, quiz, project, or assessment to start building your timeline.",
            loading: "Loading recent activity…",
            milestone: "Milestone",
            activity: "Activity",
        },
        gr: {
            title: "📈 Χρονολόγιο Μάθησης",
            all: "Όλα",
            lab: "Εργαστήρια",
            lesson: "Μαθήματα",
            quiz: "Κουίζ",
            project: "Projects",
            assessment: "Αξιολογήσεις",
            empty: "Η δραστηριότητά σου θα εμφανίζεται εδώ όσο προχωράς.",
            emptyHint:
                "Ολοκλήρωσε ένα lab, lesson, quiz, project ή αξιολόγηση για να ξεκινήσει το χρονολόγιο.",
            loading: "Φόρτωση πρόσφατης δραστηριότητας…",
            milestone: "Milestone",
            activity: "Δραστηριότητα",
        },
    };

    const t = labels[lang] || labels.en;
    const localeTag = lang === "gr" ? "el-GR" : "en-US";
    const compactStats = getTimelineCompactStats(timeline);

    const filters = [
        { id: "all", label: t.all },
        { id: "lab", label: t.lab },
        { id: "lesson", label: t.lesson },
        { id: "quiz", label: t.quiz },
        { id: "project", label: t.project },
        { id: "assessment", label: t.assessment },
    ];

    const filteredTimeline =
        filter === "all"
            ? timeline
            : timeline.filter((item) => item.type === filter);

    const parseDate = (iso) => {
        if (!iso) return 0;
        const timestamp = Date.parse(iso);
        return Number.isFinite(timestamp) ? timestamp : 0;
    };

    const sortedTimeline = [...filteredTimeline].sort(
        (a, b) => parseDate(b?.completedAt) - parseDate(a?.completedAt)
    );

    const isMilestoneEntry = (item) => {
        const title =
            typeof item?.title === "string"
                ? item.title
                : item?.title?.[lang] || item?.title?.en || "";
        const badge = typeof item?.badge === "string" ? item.badge : "";
        const combined = `${title} ${badge}`.toLowerCase();
        return (
            combined.includes("builder") ||
            combined.includes("architect") ||
            combined.includes("genesis")
        );
    };

    const formatDate = (iso) => {
        if (!iso) return "—";
        try {
            const date = new Date(iso);
            if (Number.isNaN(date.getTime())) return iso;
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = String(date.getFullYear()).slice(-2);
            return `${day}/${month}/${year}`;
        } catch {
            return iso;
        }
    };

    const formatMonthGroup = (iso) => {
        if (!iso) return lang === "gr" ? "Χωρίς ημερομηνία" : "Undated";
        try {
            const date = new Date(iso);
            if (Number.isNaN(date.getTime())) return iso;
            return date.toLocaleDateString(lang === "gr" ? "el-GR" : "en-US", {
                month: "long",
                year: "numeric",
            });
        } catch {
            return iso;
        }
    };

    const groupedTimeline = sortedTimeline.reduce((groups, item) => {
        const key = formatMonthGroup(item?.completedAt);
        const lastGroup = groups[groups.length - 1];
        if (!lastGroup || lastGroup.label !== key) {
            groups.push({ label: key, items: [item] });
        } else {
            lastGroup.items.push(item);
        }
        return groups;
    }, []);

    const compactMetricCards = [
        {
            key: "labs",
            value: compactStats.labs.toLocaleString(localeTag),
            label: composition.timelineCompactLabs,
            tone: "border-sky-200/80 bg-sky-50/80 text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/35 dark:text-sky-100",
            valueTone: "text-sky-900 dark:text-sky-50",
        },
        {
            key: "projects",
            value: compactStats.projects.toLocaleString(localeTag),
            label: composition.timelineCompactProjects,
            tone: "border-violet-200/80 bg-violet-50/80 text-violet-950 dark:border-violet-500/30 dark:bg-violet-950/35 dark:text-violet-100",
            valueTone: "text-violet-900 dark:text-violet-50",
        },
        {
            key: "assessments",
            value: compactStats.assessments.toLocaleString(localeTag),
            label: composition.timelineCompactAssessments,
            tone: "border-emerald-200/80 bg-emerald-50/80 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/35 dark:text-emerald-100",
            valueTone: "text-emerald-900 dark:text-emerald-50",
        },
        {
            key: "activities",
            value: compactStats.activities.toLocaleString(localeTag),
            label: composition.timelineCompactActivities,
            tone: "border-indigo-200/80 bg-indigo-50/70 text-indigo-950 dark:border-indigo-500/30 dark:bg-indigo-950/35 dark:text-indigo-100",
            valueTone: "text-indigo-900 dark:text-indigo-50",
        },
    ];

    return (
        <div
            className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/45 sm:p-5"
            data-timeline-expanded={expanded ? "true" : "false"}
        >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    {t.title}
                </h3>
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="self-start text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
                    aria-expanded={expanded}
                >
                    {expanded ? composition.hideTimeline : composition.showTimeline}
                </button>
            </div>

            {!expanded ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {compactMetricCards.map((card) => (
                        <div
                            key={card.key}
                            className={`rounded-xl border px-3 py-3 ${card.tone}`}
                            data-compact-metric={card.key}
                        >
                            <p
                                className={`text-xl font-bold tabular-nums ${card.valueTone}`}
                            >
                                {isLoading ? "—" : card.value}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium opacity-80">
                                {card.label}
                            </p>
                        </div>
                    ))}
                </div>
            ) : null}

            {expanded ? (
                <>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFilter(f.id)}
                                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                                    filter === f.id
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.loading}
                            </p>
                            {[0, 1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white/55 px-4 py-4 dark:border-slate-700/60 dark:bg-slate-800/40"
                                >
                                    <div className="mt-1 h-5 w-5 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                                            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                                        </div>
                                        <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTimeline.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/45 px-4 py-6 text-center dark:border-slate-700/70 dark:bg-slate-800/30">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {t.empty}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {t.emptyHint}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {groupedTimeline.map((group) => (
                                <section key={group.label} className="space-y-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                            {group.label}
                                        </p>
                                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <ul className="space-y-3">
                                        {group.items.map((item, idx) => (
                                            <li
                                                key={`${item.type}-${item.id}-${idx}`}
                                                className={`flex gap-3 rounded-2xl border px-3.5 py-3 ${
                                                    isMilestoneEntry(item)
                                                        ? "border-purple-300/70 bg-gradient-to-r from-purple-50/85 to-fuchsia-50/60 shadow-[inset_3px_0_0_0_rgba(168,85,247,0.7)] dark:border-purple-700/40 dark:bg-gradient-to-r dark:from-purple-900/25 dark:to-fuchsia-900/10"
                                                        : "border-slate-200/70 bg-white/55 dark:border-slate-700/60 dark:bg-slate-800/35"
                                                }`}
                                            >
                                                <div className="mt-0.5 flex-shrink-0">
                                                    {item.type === "lab" && <span>🧪</span>}
                                                    {item.type === "lesson" && <span>📘</span>}
                                                    {item.type === "quiz" && <span>📝</span>}
                                                    {item.type === "project" && <span>🧾</span>}
                                                    {item.type === "assessment" && (
                                                        <span>✅</span>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                                        isMilestoneEntry(item)
                                                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                                                            : item.type ===
                                                                                "assessment"
                                                                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                                                                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                                    }`}
                                                                >
                                                                    {isMilestoneEntry(item)
                                                                        ? t.milestone
                                                                        : item.type ===
                                                                            "assessment"
                                                                          ? t.assessment
                                                                          : t.activity}
                                                                </span>
                                                            </div>
                                                            <h4
                                                                className={`mt-1.5 text-slate-900 dark:text-slate-100 ${
                                                                    isMilestoneEntry(item)
                                                                        ? "text-lg font-bold"
                                                                        : "text-sm font-semibold leading-snug sm:text-base"
                                                                }`}
                                                            >
                                                                {typeof item.title === "string"
                                                                    ? item.title
                                                                    : item.title?.[lang] ||
                                                                      item.title?.en ||
                                                                      item.title?.gr}
                                                            </h4>
                                                        </div>
                                                        <span className="shrink-0 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDate(item.completedAt)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                                                        {item.xp ? (
                                                            <span>+{item.xp} XP</span>
                                                        ) : null}
                                                        {item.badge ? (
                                                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                                🏅 {item.badge}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
};

export default LearningTimeline;
