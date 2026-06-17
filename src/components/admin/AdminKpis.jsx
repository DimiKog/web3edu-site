const KPI_TONES = {
    totalUsers: {
        border: "border-indigo-300/50 dark:border-indigo-500/35",
        bg: "bg-gradient-to-br from-indigo-50/90 via-white/80 to-white/70 dark:from-indigo-950/40 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-indigo-700 dark:text-indigo-300",
        value: "text-indigo-950 dark:text-indigo-100",
        dot: "bg-indigo-500",
    },
    startedAnyLab: {
        border: "border-cyan-300/50 dark:border-cyan-500/35",
        bg: "bg-gradient-to-br from-cyan-50/90 via-white/80 to-white/70 dark:from-cyan-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-cyan-800 dark:text-cyan-300",
        value: "text-cyan-950 dark:text-cyan-100",
        dot: "bg-[#4ACBFF]",
    },
    completedAnyLab: {
        border: "border-emerald-300/50 dark:border-emerald-500/35",
        bg: "bg-gradient-to-br from-emerald-50/90 via-white/80 to-white/70 dark:from-emerald-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-emerald-800 dark:text-emerald-300",
        value: "text-emerald-950 dark:text-emerald-100",
        dot: "bg-emerald-500",
    },
    retention3plus: {
        border: "border-fuchsia-300/50 dark:border-fuchsia-500/35",
        bg: "bg-gradient-to-br from-fuchsia-50/90 via-white/80 to-white/70 dark:from-fuchsia-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-fuchsia-800 dark:text-fuchsia-300",
        value: "text-fuchsia-950 dark:text-fuchsia-100",
        dot: "bg-[#FF67D2]",
    },
};

export default function AdminKpis({ overview, platform, onCardClick }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
                id="totalUsers"
                label="Total Users"
                value={overview?.totalUsers}
                tone="totalUsers"
                onClick={onCardClick}
            />
            <KpiCard
                id="startedAnyLab"
                label="Started Any Lab"
                value={platform?.usersStartedAnyLab ?? 0}
                tone="startedAnyLab"
                onClick={onCardClick}
            />
            <KpiCard
                id="completedAnyLab"
                label="Completed Any Lab"
                value={platform?.usersCompletedAnyLab ?? 0}
                tone="completedAnyLab"
                onClick={onCardClick}
            />
            <KpiCard
                id="retention3plus"
                label="3+ Labs (Retention)"
                value={overview?.usersWith3PlusLabs}
                tone="retention3plus"
                onClick={onCardClick}
            />
        </div>
    );
}

function KpiCard({ id, label, value, tone, delta, onClick }) {
    const styles = KPI_TONES[tone] || KPI_TONES.totalUsers;

    return (
        <button
            type="button"
            onClick={() => onClick?.(id)}
            className={`text-left rounded-2xl border backdrop-blur-xl p-4 shadow-md transition hover:scale-[1.02] hover:shadow-lg ${styles.border} ${styles.bg}`}
        >
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} aria-hidden="true" />
                <div className={`text-xs uppercase tracking-wide font-semibold ${styles.label}`}>
                    {label}
                </div>
            </div>
            <div className={`text-2xl font-bold mt-2 ${styles.value}`}>
                {value ?? "—"}
            </div>
            {delta ? (
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {delta}
                </div>
            ) : null}
        </button>
    );
}
