import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchAdminOverview, fetchLabsSummary } from "../services/adminApi";
import AdminLabsTable from "../components/admin/AdminLabsTable";
import PageShell from "../components/PageShell.jsx";

export default function AdminPage() {
    const { address } = useAccount();
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState(null);
    const [labs, setLabs] = useState(null);

    useEffect(() => {
        if (!address) return;

        fetchAdminOverview(address)
            .then(setOverview)
            .catch(() => setError("Not authorized"));
    }, [address]);

    useEffect(() => {
        if (!address) return;

        fetchLabsSummary(address)
            .then(setLabs)
            .catch(() => setLabs([]));
    }, [address]);

    if (error) {
        return (
            <PageShell>
                <div className="min-h-screen px-6 py-20">
                    <div className="max-w-4xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                        {error}
                    </div>
                </div>
            </PageShell>
        );
    }

    if (!overview) {
        return (
            <PageShell>
                <div className="min-h-screen px-6 py-20">
                    <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                        Loading admin data…
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="relative min-h-screen px-6 py-20">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[140px]" />
                    <div className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-[#4ACBFF]/20 blur-[140px]" />
                    <div className="absolute bottom-[-10%] left-[-8%] h-[320px] w-[320px] rounded-full bg-[#FF67D2]/15 blur-[130px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto space-y-12">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                                Admin
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                                Admin Dashboard
                            </h1>
                            <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                                Overview & management tools for Web3Edu
                            </p>
                        </div>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Kpi label="Total Users" value={overview.totalUsers} />
                        <Kpi label="Labs Started" value={overview.usersWithLabsStarted} />
                        <Kpi label="1 Lab" value={overview.usersWith1Lab} />
                        <Kpi label="2 Labs" value={overview.usersWith2Labs} />
                        <Kpi label="3+ Labs" value={overview.usersWith3PlusLabs} />
                    </div>

                    {/* Admin Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AdminCard
                            title="Labs Analytics"
                            description="Completion statistics and per-lab insights"
                            actionLabel="View Labs"
                            onClick={() => (window.location.hash = "#/admin/labs")}
                        />

                        <AdminCard
                            title="User Progress"
                            description="Aggregated learner progress across Web3Edu"
                            actionLabel="Coming soon"
                            disabled
                        />

                        <AdminCard
                            title="Identity & SBTs"
                            description="Inspect identity layer and skill attestations"
                            actionLabel="Coming soon"
                            disabled
                        />
                    </div>

                    {/* Default: Labs Table */}
                    <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                            Labs Summary
                        </h2>
                        <div className="mb-4 rounded-xl border border-yellow-400/50 bg-yellow-50/80 p-4 text-yellow-900 dark:border-yellow-600/40 dark:bg-yellow-950/30 dark:text-yellow-200" role="alert">
                            <strong className="font-semibold">Notice:</strong> Lab completion is currently inferred from lab start, and analytics are provisional.
                        </div>
                        <AdminLabsTable labs={labs} />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

function Kpi({ label, value }) {
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

function AdminCard({ title, description, actionLabel, onClick, disabled }) {
    const baseButton =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";
    const activeButton =
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
    const inactiveButton =
        "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed";

    return (
        <div className="group relative rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/15 to-[#FF67D2]/15 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
            <div className="relative space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    {description}
                </p>
                <button
                    className={`${baseButton} ${disabled ? inactiveButton : activeButton}`}
                    onClick={disabled ? undefined : onClick}
                    disabled={disabled}
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}
