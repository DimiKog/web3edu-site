export default function AdminKpis({ overview, platform, onCardClick }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
                id="totalUsers"
                label="Total Users"
                value={overview?.totalUsers}
                delta="7d delta: —"
                onClick={onCardClick}
            />
            <KpiCard
                id="startedAnyLab"
                label="Started Any Lab"
                value={platform?.usersStartedAnyLab ?? 0}
                delta="7d delta: —"
                onClick={onCardClick}
            />
            <KpiCard
                id="completedAnyLab"
                label="Completed Any Lab"
                value={platform?.usersCompletedAnyLab ?? 0}
                delta="7d delta: —"
                onClick={onCardClick}
            />
            <KpiCard
                id="retention3plus"
                label="3+ Labs (Retention)"
                value={overview?.usersWith3PlusLabs}
                delta="7d delta: —"
                onClick={onCardClick}
            />
        </div>
    );
}

function KpiCard({ id, label, value, delta, onClick }) {
    return (
        <button
            type="button"
            onClick={() => onClick?.(id)}
            className="text-left rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl p-4 shadow-md hover:bg-white/90 dark:hover:bg-[#0f1420] transition"
        >
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {value}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {delta}
            </div>
        </button>
    );
}
