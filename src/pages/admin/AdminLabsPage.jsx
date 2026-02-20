import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchLabsSummary } from "../../services/adminApi";
import AdminLabsTable from "../../components/admin/AdminLabsTable";

export default function AdminLabsPage() {
    const { address } = useAccount();
    const [labs, setLabs] = useState(null);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("dropoff");

    useEffect(() => {
        if (!address) return;

        fetchLabsSummary(address)
            .then((data) => {
                // Handle both old and new backend shapes
                if (Array.isArray(data)) {
                    setLabs(data);
                } else if (data?.labs && Array.isArray(data.labs)) {
                    setLabs(data.labs);
                } else {
                    console.log("Unexpected labs response shape:", data);
                    setLabs([]);
                }
            })
            .catch(() => setError("Not authorized"));
    }, [address]);

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                {error}
            </div>
        );
    }

    if (!labs) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading lab analytics…
            </div>
        );
    }

    const completionRate = (lab) => {
        if (typeof lab?.completionRate === "number") return lab.completionRate;
        const started = lab?.started || 0;
        const completed = lab?.completed || 0;
        if (started <= 0) return 0;
        return completed / started;
    };

    const dropOffPercent = (lab) => {
        const started = lab?.started || 0;
        const completed = lab?.completed || 0;
        if (started <= 0) return 0;
        return Math.max(0, (started - completed) / started);
    };

    const avgDuration = (lab) => {
        const value = Number(lab?.avgCompletionTimeMinutes);
        return Number.isFinite(value) ? value : -1;
    };

    const sortedLabs = [...labs].sort((a, b) => {
        if (sortBy === "completion") {
            return completionRate(b) - completionRate(a);
        }
        if (sortBy === "dropoff") {
            return dropOffPercent(b) - dropOffPercent(a);
        }
        if (sortBy === "avgDuration") {
            return avgDuration(b) - avgDuration(a);
        }
        if (sortBy === "started") {
            return (b?.started || 0) - (a?.started || 0);
        }
        return 0;
    });

    const highestCompletionLab = labs.length
        ? [...labs].sort((a, b) => completionRate(b) - completionRate(a))[0]
        : null;

    const worstDropOffLab = labs.length
        ? [...labs].sort((a, b) => dropOffPercent(b) - dropOffPercent(a))[0]
        : null;

    const longestDurationLab = labs.length
        ? [...labs].sort((a, b) => avgDuration(b) - avgDuration(a))[0]
        : null;

    const formatMinutes = (value) => {
        const num = Number(value);
        if (!Number.isFinite(num) || num < 0) return "—";
        return `${Math.round(num)} min`;
    };

    const labelForLab = (lab) => lab?.title?.en || lab?.labId || "—";

    return (
        <div className="relative min-h-[calc(100vh-8rem)]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[140px]" />
                <div className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-[#4ACBFF]/20 blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-8%] h-[320px] w-[320px] rounded-full bg-[#FF67D2]/15 blur-[130px]" />
            </div>

            <div className="relative z-10 space-y-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                        Labs Summary
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                        Completion statistics and per-lab insights
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                    <div className="mb-4 rounded-xl border border-yellow-400/50 bg-yellow-50/80 p-4 text-yellow-900 dark:border-yellow-600/40 dark:bg-yellow-950/30 dark:text-yellow-200" role="alert">
                        <strong className="font-semibold">Notice:</strong> Lab start and completion are tracked separately. Drop-off reflects users who started but did not complete a lab.
                    </div>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Sort by:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                        >
                            <option value="completion">Completion %</option>
                            <option value="dropoff">Drop-off %</option>
                            <option value="avgDuration">Avg duration</option>
                            <option value="started">Total started</option>
                        </select>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <SummaryKpi
                            label="Highest completion lab"
                            title={labelForLab(highestCompletionLab)}
                            value={`${Math.round(completionRate(highestCompletionLab) * 100)}%`}
                        />
                        <SummaryKpi
                            label="Worst drop-off lab"
                            title={labelForLab(worstDropOffLab)}
                            value={`${Math.round(dropOffPercent(worstDropOffLab) * 100)}%`}
                        />
                        <SummaryKpi
                            label="Longest average duration lab"
                            title={labelForLab(longestDurationLab)}
                            value={formatMinutes(longestDurationLab?.avgCompletionTimeMinutes)}
                        />
                    </div>

                    <AdminLabsTable labs={sortedLabs} />
                </div>
            </div>
        </div>
    );
}

function SummaryKpi({ label, title, value }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/80 p-4 dark:bg-[#111827]/70">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {title}
            </p>
            <p className="mt-1 text-base font-bold text-fuchsia-700 dark:text-fuchsia-300">
                {value}
            </p>
        </div>
    );
}
