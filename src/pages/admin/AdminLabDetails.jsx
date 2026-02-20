import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import PageShell from "../../components/PageShell.jsx";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AdminLabDetails() {
    const { labId } = useParams();
    const navigate = useNavigate();
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

    return (
        <PageShell>
            <div className="min-h-screen px-6 py-20">
                <div className="max-w-5xl mx-auto space-y-8">
                    <button
                        onClick={() => navigate("/admin")}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition mb-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold">
                        Lab Details: {labId}
                    </h1>

                    {loading && (
                        <div className="text-slate-400">
                            Loading lab analytics...
                        </div>
                    )}

                    {error && (
                        <div className="text-red-400">
                            {error}
                        </div>
                    )}

                    {data?.summary && (
                        <>
                            <div className="grid md:grid-cols-5 gap-6">
                                <StatCard label="Total Users" value={data.summary.totalUsers} />
                                <StatCard label="Started" value={data.summary.started} />
                                <StatCard label="Completed" value={data.summary.completed} />
                                <StatCard label="Drop-off" value={data.summary.dropOff} />
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
                                />
                            </div>

                            <div className="mt-10">
                                <h2 className="text-xl font-semibold mb-4">User Breakdown</h2>
                                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900/60">
                                            <tr>
                                                <th className="p-3 text-left">Wallet</th>
                                                <th className="p-3 text-left">Started</th>
                                                <th className="p-3 text-left">Completed</th>
                                                <th className="p-3 text-left">Started At</th>
                                                <th className="p-3 text-left">Completed At</th>
                                                <th className="p-3 text-left">XP</th>
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
                                                    <tr key={entry.wallet} className="border-t border-slate-800 hover:bg-slate-800/40">
                                                        <td className="p-3 font-mono text-xs">
                                                            <span className="inline-flex items-center gap-2">
                                                                {short}
                                                                <button
                                                                    onClick={handleCopy}
                                                                    title={entry.wallet}
                                                                    className="text-slate-500 hover:text-slate-200 transition text-[10px]"
                                                                >
                                                                    {isCopied ? "✓" : "⎘"}
                                                                </button>
                                                            </span>
                                                        </td>
                                                        <td className="p-3 font-semibold">
                                                            {entry.started
                                                                ? <span className="text-green-500">✔</span>
                                                                : <span className="text-red-500">✖</span>}
                                                        </td>
                                                        <td className="p-3 font-semibold">
                                                            {entry.completed
                                                                ? <span className="text-green-500">✔</span>
                                                                : <span className="text-red-500">✖</span>}
                                                        </td>
                                                        <td className="p-3">{entry.startedAt || "-"}</td>
                                                        <td className="p-3">{entry.completedAt || "-"}</td>
                                                        <td className="p-3">{entry.xp}</td>
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
            </div>
        </PageShell>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}
