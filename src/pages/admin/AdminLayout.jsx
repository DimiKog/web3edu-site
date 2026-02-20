import { NavLink, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { fetchAdminOverview } from "../../services/adminApi";
import PageShell from "../../components/PageShell.jsx";

export default function AdminLayout() {
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function verifyAdminAccess() {
            if (!address) {
                if (isMounted) {
                    setLoading(false);
                    setError("Admin wallet not connected.");
                }
                return;
            }

            try {
                await fetchAdminOverview(address);
                if (isMounted) {
                    setError(null);
                }
            } catch {
                if (isMounted) {
                    setError("Not authorized");
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

    return (
        <PageShell>
            <div className="min-h-screen px-4 md:px-6 py-8 md:py-12">
                <div className="mx-auto flex w-full max-w-7xl gap-6">
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
                        </nav>
                    </aside>

                    <main className="min-w-0 flex-1">
                        {loading && (
                            <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                                Checking admin access…
                            </div>
                        )}

                        {!loading && error && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                                {error}
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
