import { useState } from "react";

/**
 * LearningTimeline
 * Props:
 *  - timeline: Array of timeline events from backend metadata
 *      [{ type, id, title, xp, badge, completedAt }]
 */
const LearningTimeline = ({ timeline = [] }) => {
    const [filter, setFilter] = useState("all");

    const filters = [
        { id: "all", label: "All" },
        { id: "lab", label: "Labs" },
        { id: "lesson", label: "Lessons" },
        { id: "quiz", label: "Quizzes" },
    ];

    const filteredTimeline =
        filter === "all"
            ? timeline
            : timeline.filter(item => item.type === filter);

    const formatDate = (iso) => {
        if (!iso) return "—";
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold">
                    📈 Learning Timeline
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

            {/* Timeline */}
            {filteredTimeline.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No activity recorded yet.
                </p>
            ) : (
                <ul className="space-y-6">
                    {filteredTimeline.map((item, idx) => (
                        <li key={`${item.type}-${item.id}-${idx}`} className="flex gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-1">
                                {item.type === "lab" && <span>🧪</span>}
                                {item.type === "lesson" && <span>📘</span>}
                                {item.type === "quiz" && <span>📝</span>}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className="font-semibold">
                                        {typeof item.title === "string"
                                            ? item.title
                                            : item.title?.en || item.title?.gr}
                                    </h4>
                                    <span className="text-xs text-slate-500">
                                        {formatDate(item.completedAt)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    {item.xp ? <span>+{item.xp} XP</span> : null}
                                    {item.badge ? (
                                        <span className="px-2 py-0.5 rounded-full text-xs
                                                         bg-indigo-100 text-indigo-700
                                                         dark:bg-indigo-900/40 dark:text-indigo-300">
                                            🏅 {item.badge}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LearningTimeline;
