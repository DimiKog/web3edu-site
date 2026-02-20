import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchAdminOverview, fetchLabsSummary } from "../services/adminApi";
import AdminKpis from "../components/admin/AdminKpis";
import PlatformAnalytics from "../components/admin/PlatformAnalytics";
import LearningInsights from "../components/admin/LearningInsights";

export default function AdminDashboard() {
    const { address } = useAccount();
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState(null);
    const [labs, setLabs] = useState(null);
    const [platform, setPlatform] = useState(null);

    useEffect(() => {
        if (!address) return;

        fetchAdminOverview(address)
            .then(setOverview)
            .catch(() => setError("Not authorized"));
    }, [address]);

    useEffect(() => {
        if (!address) return;

        fetchLabsSummary(address)
            .then((data) => {
                if (data?.platform) {
                    setPlatform(data.platform);
                }
                setLabs(data?.labs || []);
            })
            .catch(() => {
                setLabs([]);
                setPlatform(null);
            });
    }, [address]);

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                {error}
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
                    </div>
                </div>

                <AdminKpis overview={overview} platform={platform} />

                {labs && labs.length > 0 && (
                    <LearningInsights labs={labs} />
                )}

                <PlatformAnalytics platform={platform} />
            </div>
        </div>
    );
}
