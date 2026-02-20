export default function PlatformAnalytics({ platform }) {
    if (!platform) return null;

    const completionRate =
        platform.usersStartedAnyLab > 0
            ? Math.round((platform.usersCompletedAnyLab / platform.usersStartedAnyLab) * 100)
            : 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Platform Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <KpiCard label="Started Any Lab" value={platform.usersStartedAnyLab} />
                <KpiCard label="Completed Any Lab" value={platform.usersCompletedAnyLab} />
                <KpiCard
                    label="Completion (Started → Completed)"
                    value={`${completionRate}%`}
                />
            </div>
        </div>
    );
}

function KpiCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl p-4 shadow-md">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {value}
            </div>
        </div>
    );
}
