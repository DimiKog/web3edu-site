import { useNavigate } from "react-router-dom";

const INSIGHT_TONES = {
    best: {
        border: "border-emerald-300/50 dark:border-emerald-600/35",
        bg: "bg-gradient-to-br from-emerald-50/80 to-white/60 dark:from-emerald-950/30 dark:to-[#111827]/60",
        label: "text-emerald-800 dark:text-emerald-300",
    },
    worst: {
        border: "border-amber-300/50 dark:border-amber-600/35",
        bg: "bg-gradient-to-br from-amber-50/80 to-white/60 dark:from-amber-950/30 dark:to-[#111827]/60",
        label: "text-amber-800 dark:text-amber-300",
    },
    dropoff: {
        border: "border-rose-300/50 dark:border-rose-600/35",
        bg: "bg-gradient-to-br from-rose-50/80 to-white/60 dark:from-rose-950/30 dark:to-[#111827]/60",
        label: "text-rose-800 dark:text-rose-300",
    },
    engaged: {
        border: "border-cyan-300/50 dark:border-cyan-600/35",
        bg: "bg-gradient-to-br from-cyan-50/80 to-white/60 dark:from-cyan-950/30 dark:to-[#111827]/60",
        label: "text-cyan-800 dark:text-cyan-300",
    },
    lowEngaged: {
        border: "border-slate-300/50 dark:border-slate-600/35",
        bg: "bg-gradient-to-br from-slate-100/80 to-white/60 dark:from-slate-900/40 dark:to-[#111827]/60",
        label: "text-slate-700 dark:text-slate-300",
    },
};

export default function LearningInsights({ labs }) {
    const navigate = useNavigate();
    if (!labs || labs.length === 0) return null;

    const sortedByCompletion = [...labs].sort(
        (a, b) => b.completionRate - a.completionRate
    );

    const sortedByDropOff = [...labs].sort(
        (a, b) => b.dropOff - a.dropOff
    );

    const sortedByStarted = [...labs].sort(
        (a, b) => b.started - a.started
    );

    const best = sortedByCompletion[0];
    const worst = sortedByCompletion[sortedByCompletion.length - 1];
    const highestDrop = sortedByDropOff[0];
    const mostStarted = sortedByStarted[0];
    const leastStarted = sortedByStarted[sortedByStarted.length - 1];

    return (
        <div className="rounded-2xl border border-indigo-200/40 bg-white/70 dark:border-indigo-500/20 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
            <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-sm font-bold text-white shadow-md">
                    ✦
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Learning Insights
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InsightCard
                    label="Best Performing Lab"
                    value={`${best?.title?.en || best?.labId} (${Math.round(
                        best?.completionRate * 100
                    )}%)`}
                    tone="best"
                    onClick={() => navigate(best?.labId ? `/admin/labs/${best.labId}` : "/admin/labs")}
                />
                <InsightCard
                    label="Lowest Completion"
                    value={`${worst?.title?.en || worst?.labId} (${Math.round(
                        worst?.completionRate * 100
                    )}%)`}
                    tone="worst"
                    onClick={() => navigate(worst?.labId ? `/admin/labs/${worst.labId}` : "/admin/labs")}
                />
                <InsightCard
                    label="Highest Drop-off"
                    value={`${highestDrop?.title?.en || highestDrop?.labId} (${highestDrop?.dropOff})`}
                    tone="dropoff"
                    onClick={() => navigate(highestDrop?.labId ? `/admin/labs/${highestDrop.labId}` : "/admin/labs")}
                />
                <InsightCard
                    label="Most Engaged Lab"
                    value={`${mostStarted?.title?.en || mostStarted?.labId} (${mostStarted?.started} starts)`}
                    tone="engaged"
                    onClick={() => navigate(mostStarted?.labId ? `/admin/labs/${mostStarted.labId}` : "/admin/labs")}
                />
                <InsightCard
                    label="Lowest Engagement"
                    value={`${leastStarted?.title?.en || leastStarted?.labId} (${leastStarted?.started} starts)`}
                    tone="lowEngaged"
                    onClick={() => navigate(leastStarted?.labId ? `/admin/labs/${leastStarted.labId}` : "/admin/labs")}
                />
            </div>
        </div>
    );
}

function InsightCard({ label, value, tone, onClick }) {
    const styles = INSIGHT_TONES[tone] || INSIGHT_TONES.lowEngaged;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-left rounded-xl border p-4 transition hover:scale-[1.01] hover:shadow-md ${styles.border} ${styles.bg}`}
        >
            <div className={`text-xs uppercase tracking-wide font-semibold ${styles.label}`}>
                {label}
            </div>
            <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {value}
            </div>
        </button>
    );
}
