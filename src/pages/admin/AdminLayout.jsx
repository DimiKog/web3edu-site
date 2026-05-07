import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { fetchAdminOverview, getAdminApiBase } from "../../services/adminApi";
import PageShell from "../../components/PageShell.jsx";

function shortAddress(address) {
    const a = String(address || "");
    if (a.length <= 12) return a || "—";
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastVerifiedAt, setLastVerifiedAt] = useState(null);
    const [langPref, setLangPref] = useState(() => {
        if (typeof window === "undefined") return "en";
        const stored = localStorage.getItem("lang");
        return stored === "gr" ? "gr" : "en";
    });

    useEffect(() => {
        let isMounted = true;

        async function verifyAdminAccess() {
            if (!address) {
                if (isMounted) {
                    setLoading(false);
                    setError("Wallet not connected.");
                }
                return;
            }

            try {
                await fetchAdminOverview(address);
                if (isMounted) {
                    setError(null);
                    setLastVerifiedAt(new Date());
                }
            } catch {
                if (isMounted) {
                    setError("Not authorized.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        setLoading(true);
        verifyAdminAccess();

        return () => {
            isMounted = false;
        };
    }, [address]);

    const apiBase = getAdminApiBase();
    const canShowSession = Boolean(address);
    const dashboardPath = langPref === "gr" ? "/dashboard-gr" : "/dashboard";
    const settingsPath = langPref === "gr" ? "/settings-gr" : "/settings";
    const identityPath = langPref === "gr" ? "/sbt-view-gr" : "/sbt-view";
    const isWideAdminPage = String(location?.pathname || "").startsWith("/admin/feedback");

    return (
        <PageShell>
            <div className={isWideAdminPage ? "min-h-screen px-3 md:px-4 py-8 md:py-12" : "min-h-screen px-4 md:px-6 py-8 md:py-12"}>
                <div className={isWideAdminPage ? "mx-auto flex w-full max-w-[95rem] gap-5" : "mx-auto flex w-full max-w-7xl gap-6"}>
                    <aside className="w-64 shrink-0 rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl p-4 h-fit sticky top-24">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-4">
                            Admin
                        </p>

                        <nav className="space-y-2">
                            <SidebarLink to="/admin" end>
                                Dashboard
                            </SidebarLink>
                            <SidebarLink to="/admin/labs">
                                Labs
                            </SidebarLink>
                            <SidebarLink to="/admin/users">
                                Users
                            </SidebarLink>
                            <SidebarLink to="/admin/feedback">
                                Feedback
                            </SidebarLink>
                        </nav>
                    </aside>

                    <main className="min-w-0 flex-1">
                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-5 py-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                                        Admin session
                                    </div>
                                    <div className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                                        <span className="font-semibold">Account:</span>{" "}
                                        <span className="font-mono">{canShowSession ? shortAddress(address) : "—"}</span>
                                        <span className="text-slate-400 dark:text-slate-500"> · </span>
                                        <span className="font-semibold">API:</span>{" "}
                                        <span className="font-mono break-all">{apiBase}</span>
                                        {lastVerifiedAt ? (
                                            <>
                                                <span className="text-slate-400 dark:text-slate-500"> · </span>
                                                <span className="font-semibold">Verified:</span>{" "}
                                                <span>{lastVerifiedAt.toLocaleString()}</span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = langPref === "gr" ? "en" : "gr";
                                            setLangPref(next);
                                            try {
                                                localStorage.setItem("lang", next);
                                            } catch {
                                                /* ignore */
                                            }
                                        }}
                                        className="rounded-full border border-white/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                                        title="Language preference for links"
                                    >
                                        {langPref === "gr" ? "GR" : "EN"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(dashboardPath)}
                                        className="rounded-full border border-white/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(identityPath)}
                                        className="rounded-full border border-white/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                                    >
                                        Identity
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(settingsPath)}
                                        className="rounded-full border border-white/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                                    >
                                        Settings
                                    </button>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {loading ? "Verifying…" : error ? "Access unavailable" : "Access verified"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                                Checking admin access…
                            </div>
                        )}

                        {!loading && error && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-200 px-6 py-4 space-y-2">
                                <div className="font-semibold">
                                    {error === "Wallet not connected."
                                        ? "Connect an admin wallet to access the admin area."
                                        : "This wallet is not authorized to access admin analytics."}
                                </div>
                                <div className="text-sm text-red-800/90 dark:text-red-200/90">
                                    {error === "Wallet not connected."
                                        ? "Admin access is validated via the connected wallet and the backend `/admin/*` endpoints."
                                        : "If you believe this is incorrect, confirm the connected wallet is in the admin allowlist and that the backend is configured for this environment."}
                                </div>
                            </div>
                        )}

                        {!loading && !error && <Outlet />}
                    </main>
                </div>
            </div>
        </PageShell>
    );
}

function SidebarLink({ to, end = false, children }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                [
                    "block w-full rounded-xl px-3 py-2 text-sm font-medium border transition",
                    isActive
                        ? "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300"
                        : "border-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}
