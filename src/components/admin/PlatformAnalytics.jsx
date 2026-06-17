const PLATFORM_TONES = {
    started: {
        border: "border-cyan-300/50 dark:border-cyan-500/35",
        bg: "bg-gradient-to-br from-cyan-50/90 via-white/80 to-white/70 dark:from-cyan-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-cyan-800 dark:text-cyan-300",
        value: "text-cyan-950 dark:text-cyan-100",
        dot: "bg-[#4ACBFF]",
    },
    completed: {
        border: "border-emerald-300/50 dark:border-emerald-500/35",
        bg: "bg-gradient-to-br from-emerald-50/90 via-white/80 to-white/70 dark:from-emerald-950/35 dark:via-[#0b0f17]/80 dark:to-[#0b0f17]/80",
        label: "text-emerald-800 dark:text-emerald-300",
        value: "text-emerald-950 dark:text-emerald-100",
        dot: "bg-emerald-500",
    },
    rate: {
        border: "border-violet-300/50 dark:border-violet-500/35",
        bg: "bg-gradient-to-br from-violet-50/90 via-indigo-50/50 to-white/70 dark:from-violet-950/40 dark:via-indigo-950/20 dark:to-[#0b0f17]/80",
        label: "text-violet-800 dark:text-violet-300",
        value: "text-violet-950 dark:text-violet-100",
        dot: "bg-[#8A57FF]",
    },
};

export default function PlatformAnalytics({ platform }) {
    if (!platform) return null;

    const completionRate =
        platform.usersStartedAnyLab > 0
            ? Math.round((platform.usersCompletedAnyLab / platform.usersStartedAnyLab) * 100)
            : 0;

    return (
        <div className="rounded-2xl border border-violet-200/40 bg-white/70 dark:border-violet-500/20 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
            <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] text-sm font-bold text-white shadow-md">
                    %
                </span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Platform Analytics
                </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <KpiCard label="Started Any Lab" value={platform.usersStartedAnyLab} tone="started" />
                <KpiCard label="Completed Any Lab" value={platform.usersCompletedAnyLab} tone="completed" />
                <KpiCard
                    label="Completion (Started → Completed)"
                    value={`${completionRate}%`}
                    tone="rate"
                />
            </div>
        </div>
    );
}

function KpiCard({ label, value, tone }) {
    const styles = PLATFORM_TONES[tone] || PLATFORM_TONES.started;

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
