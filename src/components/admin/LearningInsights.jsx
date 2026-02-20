export default function LearningInsights({ labs }) {
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
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Learning Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InsightCard
                    label="Best Performing Lab"
                    value={`${best?.title?.en || best?.labId} (${Math.round(
                        best?.completionRate * 100
                    )}%)`}
                />
                <InsightCard
                    label="Lowest Completion"
                    value={`${worst?.title?.en || worst?.labId} (${Math.round(
                        worst?.completionRate * 100
                    )}%)`}
                />
                <InsightCard
                    label="Highest Drop-off"
                    value={`${highestDrop?.title?.en || highestDrop?.labId} (${highestDrop?.dropOff})`}
                />
                <InsightCard
                    label="Most Engaged Lab"
                    value={`${mostStarted?.title?.en || mostStarted?.labId} (${mostStarted?.started} starts)`}
                />
                <InsightCard
                    label="Lowest Engagement"
                    value={`${leastStarted?.title?.en || leastStarted?.labId} (${leastStarted?.started} starts)`}
                />
            </div>
        </div>
    );
}

function InsightCard({ label, value }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/60 dark:bg-[#111827]/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {value}
            </div>
        </div>
    );
}
