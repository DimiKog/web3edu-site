import { useState } from "react";

/**
 * LearningTimeline
 * Props:
 *  - timeline: Array of timeline events from backend metadata
 *      [{ type, id, title, xp, badge, completedAt }]
 */
const LearningTimeline = ({ timeline = [], lang = "en", isLoading = false }) => {
    const [filter, setFilter] = useState("all");

    const labels = {
        en: {
            title: "📈 Learning Timeline",
            all: "All",
            lab: "Labs",
            lesson: "Lessons",
            quiz: "Quizzes",
            project: "Projects",
            empty: "Your activity will appear here as you progress.",
            emptyHint: "Complete a lab, lesson, quiz, or project to start building your timeline.",
            loading: "Loading recent activity…",
            milestone: "Milestone",
            activity: "Activity",
            summaryLabs: "labs",
            summaryLessons: "lessons",
            summaryQuizzes: "quizzes",
            summaryProjects: "projects"
        },
        gr: {
            title: "📈 Χρονολόγιο Μάθησης",
            all: "Όλα",
            lab: "Εργαστήρια",
            lesson: "Μαθήματα",
            quiz: "Κουίζ",
            project: "Projects",
            empty: "Η δραστηριότητά σου θα εμφανίζεται εδώ όσο προχωράς.",
            emptyHint: "Ολοκλήρωσε ένα lab, lesson, quiz ή project για να ξεκινήσει το χρονολόγιο.",
            loading: "Φόρτωση πρόσφατης δραστηριότητας…",
            milestone: "Milestone",
            activity: "Δραστηριότητα",
            summaryLabs: "εργαστήρια",
            summaryLessons: "μαθήματα",
            summaryQuizzes: "κουίζ",
            summaryProjects: "projects"
        }
    };

    const t = labels[lang] || labels.en;

    const filters = [
        { id: "all", label: t.all },
        { id: "lab", label: t.lab },
        { id: "lesson", label: t.lesson },
        { id: "quiz", label: t.quiz },
        { id: "project", label: t.project },
    ];

    const filteredTimeline =
        filter === "all"
            ? timeline
            : timeline.filter(item => item.type === filter);

    const parseDate = (iso) => {
        if (!iso) return 0;
        const timestamp = Date.parse(iso);
        return Number.isFinite(timestamp) ? timestamp : 0;
    };

    const sortedTimeline = [...filteredTimeline].sort(
        (a, b) => parseDate(b?.completedAt) - parseDate(a?.completedAt)
    );

    const isMilestoneEntry = (item) => {
        const title = typeof item?.title === "string"
            ? item.title
            : item?.title?.[lang] || item?.title?.en || "";
        const badge = typeof item?.badge === "string" ? item.badge : "";
        const combined = `${title} ${badge}`.toLowerCase();
        return combined.includes("builder") || combined.includes("architect") || combined.includes("genesis");
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

    const timelineStats = timeline.reduce((acc, item) => {
        if (!item) return acc;
        if (item.type === "lab") acc.labs += 1;
        if (item.type === "lesson") acc.lessons += 1;
        if (item.type === "quiz") acc.quizzes += 1;
        if (item.type === "project") acc.projects += 1;
        acc.xp += Number(item.xp) || 0;
        return acc;
    }, { labs: 0, lessons: 0, quizzes: 0, projects: 0, xp: 0 });

    const summarySegments = [
        timelineStats.labs > 0 ? `${timelineStats.labs} ${t.summaryLabs}` : null,
        timelineStats.lessons > 0 ? `${timelineStats.lessons} ${t.summaryLessons}` : null,
        timelineStats.quizzes > 0 ? `${timelineStats.quizzes} ${t.summaryQuizzes}` : null,
        timelineStats.projects > 0 ? `${timelineStats.projects} ${t.summaryProjects}` : null,
        timelineStats.xp > 0 ? `${timelineStats.xp} XP` : null,
    ].filter(Boolean);

    return (
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold">
                    {t.title}
                </h3>

                {/* Filters */}
                <div className="flex gap-2">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                                ${filter === f.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {!isLoading && summarySegments.length > 0 ? (
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    {summarySegments.join(" · ")}
                </p>
            ) : null}

            {/* Timeline */}
            {isLoading ? (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.loading}</p>
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
                <div className="space-y-6">
                    {groupedTimeline.map((group) => (
                        <section key={group.label} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                                <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    {group.label}
                                </p>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            </div>
                            <ul className="space-y-4">
                                {group.items.map((item, idx) => (
                                    <li
                                        key={`${item.type}-${item.id}-${idx}`}
                                        className={`flex gap-4 rounded-2xl border px-4 py-4 ${
                                            isMilestoneEntry(item)
                                                ? "border-purple-300/70 bg-gradient-to-r from-purple-50/85 to-fuchsia-50/60 shadow-[inset_3px_0_0_0_rgba(168,85,247,0.7)] dark:border-purple-700/40 dark:bg-gradient-to-r dark:from-purple-900/25 dark:to-fuchsia-900/10"
                                                : "border-slate-200/70 bg-white/55 dark:border-slate-700/60 dark:bg-slate-800/35"
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className="mt-1 flex-shrink-0">
                                            {item.type === "lab" && <span>🧪</span>}
                                            {item.type === "lesson" && <span>📘</span>}
                                            {item.type === "quiz" && <span>📝</span>}
                                            {item.type === "project" && <span>🧾</span>}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            isMilestoneEntry(item)
                                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                        }`}>
                                                            {isMilestoneEntry(item) ? t.milestone : t.activity}
                                                        </span>
                                                    </div>
                                                    <h4 className={`mt-2 text-slate-900 dark:text-slate-100 ${
                                                        isMilestoneEntry(item) ? "text-lg font-bold" : "font-semibold"
                                                    }`}>
                                                        {typeof item.title === "string"
                                                            ? item.title
                                                            : item.title?.[lang] || item.title?.en}
                                                    </h4>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {formatDate(item.completedAt)}
                                                </span>
                                            </div>

                                            <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                                {item.xp ? <span>+{item.xp} XP</span> : null}
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
        </div>
    );
};

export default LearningTimeline;
