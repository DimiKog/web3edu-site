import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AdminBackButton from "../../components/admin/AdminBackButton";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AdminLabDetails() {
    const { labId } = useParams();
    const { address } = useAccount();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedWallet, setCopiedWallet] = useState(null);

    const sortedEntries = data?.entries
        ? [...data.entries].sort((a, b) => {
            const aTime = a.completedAtEpoch || a.startedAtEpoch || 0;
            const bTime = b.completedAtEpoch || b.startedAtEpoch || 0;
            return bTime - aTime;
        })
        : [];

    useEffect(() => {
        async function fetchDetails() {
            try {
                if (!address) {
                    setError("Admin wallet not connected.");
                    setLoading(false);
                    return;
                }
                const res = await fetch(
                    `${API_BASE}/admin/labs/details?wallet=${address}&labId=${labId}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch lab details");
                }

                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError("Could not load lab details.");
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [labId, address]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading lab analytics…
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-200 px-6 py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                        Lab Details
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Lab ID: <span className="font-semibold font-mono">{labId}</span>
                    </p>
                </div>
                <AdminBackButton to="/admin/labs" label="Back to Labs" />
            </div>

            {data?.summary && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatCard label="Total Users" value={data.summary.totalUsers} />
                        <StatCard label="Started" value={data.summary.started} />
                        <StatCard label="Completed" value={data.summary.completed} />
                        <StatCard
                            label="Drop-off"
                            value={data.summary.dropOff}
                            variant={data.summary.dropOff > 0 ? "warning" : "default"}
                        />
                        <StatCard
                            label="Completion %"
                            value={
                                data.summary.started > 0
                                    ? Math.round(
                                        (data.summary.completed /
                                            data.summary.started) *
                                        100
                                    ) + "%"
                                    : "0%"
                            }
                            variant={
                                data.summary.started > 0 &&
                                (data.summary.completed / data.summary.started) >= 0.7
                                    ? "success"
                                    : "default"
                            }
                        />
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            User Breakdown
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                            <table className="w-full text-sm">
                                <thead className="bg-white/80 dark:bg-[#111827]/80">
                                    <tr>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Wallet</th>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Started</th>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Completed</th>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Started At</th>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">Completed At</th>
                                        <th className="p-3 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">XP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedEntries.map((entry) => {
                                        const short = entry.wallet
                                            ? `${entry.wallet.slice(0, 6)}...${entry.wallet.slice(-4)}`
                                            : "-";
                                        const isCopied = copiedWallet === entry.wallet;

                                        function handleCopy() {
                                            navigator.clipboard.writeText(entry.wallet);
                                            setCopiedWallet(entry.wallet);
                                            setTimeout(() => setCopiedWallet(null), 1500);
                                        }

                                        return (
                                            <tr
                                                key={entry.wallet}
                                                className="border-t border-white/10 hover:bg-white/60 dark:hover:bg-white/5 transition"
                                            >
                                                <td className="p-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                                                    <span className="inline-flex items-center gap-2">
                                                        {short}
                                                        <button
                                                            onClick={handleCopy}
                                                            title={entry.wallet}
                                                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition text-[10px]"
                                                        >
                                                            {isCopied ? "✓" : "⎘"}
                                                        </button>
                                                    </span>
                                                </td>
                                                <td className="p-3 font-semibold">
                                                    {entry.started
                                                        ? <span className="text-emerald-600 dark:text-emerald-400">✔</span>
                                                        : <span className="text-rose-600 dark:text-rose-400">✖</span>}
                                                </td>
                                                <td className="p-3 font-semibold">
                                                    {entry.completed
                                                        ? <span className="text-emerald-600 dark:text-emerald-400">✔</span>
                                                        : <span className="text-rose-600 dark:text-rose-400">✖</span>}
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{entry.startedAt || "-"}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{entry.completedAt || "-"}</td>
                                                <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{entry.xp}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ label, value, variant = "default" }) {
    const variantStyles = {
        default: "",
        success: "ring-2 ring-emerald-500/20",
        warning: "ring-2 ring-amber-500/20",
    };

    const valueStyles = {
        default: "text-slate-900 dark:text-slate-100",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
    };

    return (
        <div className={`rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5 ${variantStyles[variant]}`}>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${valueStyles[variant]}`}>{value}</div>
        </div>
    );
}
