export default function AdminKpis({ overview, platform }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Total Users" value={overview?.totalUsers} />
            <KpiCard
                label="Started Any Lab"
                value={platform?.usersStartedAnyLab ?? 0}
            />
            <KpiCard
                label="Completed Any Lab"
                value={platform?.usersCompletedAnyLab ?? 0}
            />
            <KpiCard
                label="3+ Labs (Retention)"
                value={overview?.usersWith3PlusLabs}
            />
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
