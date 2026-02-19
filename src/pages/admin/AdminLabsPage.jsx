import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchLabsSummary } from "../../services/adminApi";
import AdminLabsTable from "../../components/admin/AdminLabsTable";
import PageShell from "../../components/PageShell.jsx";

export default function AdminLabsPage() {
    const { address } = useAccount();
    const [labs, setLabs] = useState(null);
    const [error, setError] = useState(null);

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
            <PageShell>
                <div className="min-h-screen px-6 py-20">
                    <div className="max-w-4xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                        {error}
                    </div>
                </div>
            </PageShell>
        );
    }

    if (!labs) {
        return (
            <PageShell>
                <div className="min-h-screen px-6 py-20">
                    <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                        Loading lab analytics…
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

                <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                            Admin
                        </p>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                            Labs Analytics
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                            Completion statistics and per-lab insights
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                        <AdminLabsTable labs={labs} />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
