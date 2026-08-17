import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminOverview, fetchLabsSummary } from "../services/adminApi";
import AdminKpis from "../components/admin/AdminKpis";
import PlatformAnalytics from "../components/admin/PlatformAnalytics";
import LearningInsights from "../components/admin/LearningInsights";
import ProjectsOverview from "../components/admin/ProjectsOverview";
import { useAdminEligibility } from "../hooks/useAdminEligibility.js";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminWalletAddress, idToken } = useAdminEligibility();
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState(null);
    const [labs, setLabs] = useState(null);
    const [platform, setPlatform] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshTick, setRefreshTick] = useState(0);

    const cacheKey = adminWalletAddress ? `admin-dashboard-cache:${adminWalletAddress.toLowerCase()}` : null;

    const loadDashboardData = useCallback(() => {
        if (!idToken) return;

        Promise.all([fetchAdminOverview(idToken), fetchLabsSummary(idToken)])
            .then(([overviewData, labsData]) => {
                setOverview(overviewData);
                setPlatform(labsData?.platform || null);
                setLabs(labsData?.labs || []);
                setError(null);

                const now = new Date();
                setLastUpdated(now);

                if (cacheKey) {
                    sessionStorage.setItem(
                        cacheKey,
                        JSON.stringify({
                            overview: overviewData,
                            platform: labsData?.platform || null,
                            labs: labsData?.labs || [],
                            lastUpdatedIso: now.toISOString(),
                        })
                    );
                }
            })
            .catch(() => {
                setError("Could not load dashboard analytics.");
            });
    }, [idToken, cacheKey]);

    useEffect(() => {
        if (!idToken) return;

        if (cacheKey) {
            try {
                const cachedRaw = sessionStorage.getItem(cacheKey);
                if (cachedRaw) {
                    const cached = JSON.parse(cachedRaw);
                    if (cached?.overview) {
                        setOverview(cached.overview);
                        setPlatform(cached.platform || null);
                        setLabs(cached.labs || []);
                        setLastUpdated(cached.lastUpdatedIso ? new Date(cached.lastUpdatedIso) : null);
                    }
                }
            } catch {
                // Ignore cache parse issues.
            }
        }

        loadDashboardData();
    }, [idToken, cacheKey, loadDashboardData, refreshTick]);

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4 space-y-3">
                <div>{error}</div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setRefreshTick((v) => v + 1)}
                        className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-1.5 text-sm"
                    >
                        Retry
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/labs")}
                        className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-1.5 text-sm"
                    >
                        Open Labs
                    </button>
                </div>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading admin data…
            </div>
        );
    }

    const sortedByCompletion = [...(labs || [])].sort(
        (a, b) => (a?.completionRate || 0) - (b?.completionRate || 0)
    );
    const sortedByDropOff = [...(labs || [])].sort(
        (a, b) => (b?.dropOff || 0) - (a?.dropOff || 0)
    );
    const lowestCompletion = sortedByCompletion[0];
    const highestDropOff = sortedByDropOff[0];
    const usersAtRisk = Math.max(
        0,
        (platform?.usersStartedAnyLab || 0) - (platform?.usersCompletedAnyLab || 0)
    );

    return (
        <div className="relative min-h-[calc(100vh-8rem)]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[140px]" />
                <div className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-[#4ACBFF]/20 blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-8%] h-[320px] w-[320px] rounded-full bg-[#FF67D2]/15 blur-[130px]" />
            </div>

            <div className="relative z-10 space-y-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                            Admin Dashboard
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                            Overview & management tools for Web3Edu
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "—"}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <ActionButton
                            label="View Labs"
                            variant="secondary"
                            onClick={() => navigate("/admin/labs")}
                        />
                        <ActionButton
                            label="View Users"
                            variant="primary"
                            onClick={() => navigate("/admin/users")}
                        />
                        <ActionButton
                            label="Refresh"
                            variant="ghost"
                            onClick={() => setRefreshTick((v) => v + 1)}
                        />
                    </div>
                </div>

                <AdminKpis
                    overview={overview}
                    platform={platform}
                    onCardClick={(id) => {
                        if (id === "totalUsers") navigate("/admin/users?sort=xp&dir=desc");
                        if (id === "startedAnyLab") navigate("/admin/labs?sort=started");
                        if (id === "completedAnyLab") navigate("/admin/labs?sort=completion");
                        if (id === "retention3plus") navigate("/admin/users?sort=completed&dir=desc");
                    }}
                />

                <ProjectsOverview projectsOverview={overview?.projectsOverview} />

                <div className="rounded-2xl border border-rose-300/40 bg-gradient-to-br from-rose-50/80 via-white/70 to-orange-50/50 dark:border-rose-500/25 dark:from-rose-950/25 dark:via-[#0b0f17]/80 dark:to-orange-950/15 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-bold text-white shadow-md">
                            !
                        </span>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            Top Risks
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <RiskCard
                            label="Highest Drop-off Lab"
                            value={highestDropOff ? `${highestDropOff?.title?.en || highestDropOff?.labId} (${highestDropOff?.dropOff || 0})` : "—"}
                            onClick={() => navigate("/admin/labs?sort=dropoff&risk=dropoff")}
                        />
                        <RiskCard
                            label="Lowest Completion Lab"
                            value={lowestCompletion ? `${lowestCompletion?.title?.en || lowestCompletion?.labId} (${Math.round((lowestCompletion?.completionRate || 0) * 100)}%)` : "—"}
                            onClick={() => navigate("/admin/labs?sort=completion&dir=asc")}
                        />
                        <RiskCard
                            label="Users At Risk"
                            value={`${usersAtRisk}`}
                            onClick={() => navigate("/admin/users?sort=dropOff&dir=desc&dropoffOnly=1")}
                        />
                    </div>
                </div>

                {labs && labs.length > 0 && (
                    <LearningInsights labs={labs} />
                )}
                {labs && labs.length === 0 && (
                    <div className="rounded-2xl border border-amber-300/40 bg-amber-50/70 dark:bg-amber-900/10 p-5 text-amber-900 dark:text-amber-200">
                        No labs data available for the current scope. Try refreshing or opening the Labs page.
                    </div>
                )}

                <PlatformAnalytics platform={platform} />
            </div>
        </div>
    );
}

const ACTION_VARIANTS = {
    primary:
        "border-transparent bg-gradient-to-r from-[#8A57FF] to-[#4ACBFF] text-white shadow-md hover:brightness-110 hover:shadow-lg",
    secondary:
        "border-indigo-300/60 bg-indigo-50/90 text-indigo-900 shadow-sm hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-950/50 dark:text-indigo-100 dark:hover:bg-indigo-900/60",
    ghost:
        "border-slate-300/70 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800",
};

function ActionButton({ label, onClick, variant = "ghost" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${ACTION_VARIANTS[variant] || ACTION_VARIANTS.ghost}`}
        >
            {label}
        </button>
    );
}

function RiskCard({ label, value, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-left rounded-xl border border-rose-200/70 bg-white/85 p-4 shadow-sm transition hover:scale-[1.01] hover:border-rose-300/80 hover:bg-white hover:shadow-md dark:border-rose-800/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/35"
        >
            <div className="text-xs uppercase tracking-wide font-semibold text-rose-700 dark:text-rose-300">
                {label}
            </div>
            <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {value}
            </div>
        </button>
    );
}
