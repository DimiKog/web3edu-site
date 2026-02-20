import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

function toArray(value) {
    return Array.isArray(value) ? value : [];
}

function pickArray(obj, keys) {
    for (const key of keys) {
        if (Array.isArray(obj?.[key])) return obj[key];
    }
    return [];
}

function pickObject(obj, keys) {
    for (const key of keys) {
        if (obj?.[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) return obj[key];
    }
    return null;
}

function normalizeTimeline(entries) {
    return toArray(entries)
        .map((item) => ({
            label: item?.label || item?.event || item?.type || "Activity",
            when: item?.timestamp || item?.date || item?.at || null,
        }))
        .filter((i) => i.label)
        .slice(0, 20);
}

export default function AdminUserDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useAccount();
    const { wallet } = useParams();

    const targetWallet = decodeURIComponent(wallet || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const adminWallet =
            localStorage.getItem("adminWallet") ||
            localStorage.getItem("web3edu-wallet-address") ||
            localStorage.getItem("walletAddress") ||
            localStorage.getItem("wallet") ||
            address;

        if (!adminWallet || !targetWallet) {
            setError("Missing wallet context.");
            setLoading(false);
            return;
        }

        let active = true;

        async function loadUserDetails() {
            try {
                // First: try dedicated details endpoint if backend supports it.
                const detailsRes = await fetch(
                    `${API_BASE}/admin/users/details?wallet=${adminWallet}&user=${targetWallet}`
                );

                if (detailsRes.ok) {
                    const detailsJson = await detailsRes.json();
                    if (active) {
                        setData(detailsJson);
                        setError(null);
                        setLoading(false);
                    }
                    return;
                }

                // Fallback: fetch users list and locate the selected wallet.
                const listRes = await fetch(`${API_BASE}/admin/users?wallet=${adminWallet}`);
                if (!listRes.ok) {
                    throw new Error("Failed to fetch user details");
                }

                const listJson = await listRes.json();
                const users = Array.isArray(listJson) ? listJson : Array.isArray(listJson?.users) ? listJson.users : [];
                const matched = users.find((u) => {
                    const w = String(u?.wallet || u?.address || "").toLowerCase();
                    return w === String(targetWallet).toLowerCase();
                });

                if (!matched) {
                    throw new Error("User not found");
                }

                if (active) {
                    setData({ user: matched });
                    setError(null);
                    setLoading(false);
                }
            } catch {
                if (active) {
                    setError("Could not load user details.");
                    setLoading(false);
                }
            }
        }

        loadUserDetails();

        return () => {
            active = false;
        };
    }, [address, targetWallet]);

    const labsCompleted = useMemo(() => {
        if (!data?.labsCompleted) return [];
        return data.labsCompleted;
    }, [data]);

    const labsStartedNotCompleted = useMemo(() => {
        if (!data?.labsStartedNotCompleted) return [];
        return data.labsStartedNotCompleted;
    }, [data]);

    const xpBreakdownObj = useMemo(() => {
        return data?.xpBreakdown || null;
    }, [data]);

    const timeline = useMemo(() => {
        if (!data?.timeline) return [];
        return data.timeline;
    }, [data]);

    if (loading) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading user details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                        User Analytics
                    </h1>
                    {data?.user && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Tier: <span className="font-semibold">{data.user.tier}</span> · XP:{" "}
                            <span className="font-semibold">{data.user.xp}</span>
                        </p>
                    )}
                    <p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                        {targetWallet}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                >
                    Back to Users
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Panel title="Labs Completed List">
                    <List items={labsCompleted} emptyMessage="No completed labs available." />
                </Panel>

                <Panel title="Labs Started but Not Completed">
                    <List items={labsStartedNotCompleted} emptyMessage="No incomplete labs available." />
                </Panel>

                <Panel title="XP Breakdown">
                    {xpBreakdownObj ? (
                        <div className="space-y-2">
                            {Object.entries(xpBreakdownObj).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-300">{key}</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No XP breakdown available.</p>
                    )}
                </Panel>

                <Panel title="Timeline of Activity">
                    {timeline.length ? (
                        <div className="space-y-2">
                            {timeline.map((item, idx) => (
                                <div key={`${item.label}-${idx}`} className="rounded-lg border border-white/10 bg-white/60 dark:bg-slate-900/40 px-3 py-2">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.when || "—"}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No timeline entries available.</p>
                    )}
                </Panel>
            </div>
        </div>
    );
}

function Panel({ title, children }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
            {children}
        </div>
    );
}

function List({ items, emptyMessage }) {
    if (!items.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>;
    }

    return (
        <ul className="space-y-2">
            {items.map((item, idx) => {
                const label =
                    item?.title?.en ||
                    item?.labId ||
                    item?.projectId ||
                    String(item);

                const meta =
                    item?.completedAt ||
                    item?.startedAt ||
                    item?.xp;

                return (
                    <li
                        key={`${label}-${idx}`}
                        className="rounded-lg border border-white/10 bg-white/60 dark:bg-slate-900/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
                    >
                        <div className="flex justify-between">
                            <span>{label}</span>
                            {meta && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {typeof meta === "number" ? `${meta} XP` : meta}
                                </span>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
