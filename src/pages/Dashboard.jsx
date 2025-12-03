import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";

import { UserIcon, AcademicCapIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [metadata, setMetadata] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const prevXpRef = useRef(null);

    useEffect(() => {
        if (!isConnected) navigate("/join");
        window.scrollTo(0, 0);
    }, [isConnected]);

    const formattedAddress = shortAddress(address);

    useEffect(() => {
        if (!address) return;
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";
        fetch(`${BACKEND}/sbt/resolve/${address}`)
            .then(res => res.json())
            .then(data => setMetadata(data.metadata))
            .catch(err => console.error("Failed to fetch metadata:", err));
    }, [address]);

    useEffect(() => {
        if (!metadata || typeof metadata.xp !== "number") return;

        let timeoutId;
        if (prevXpRef.current == null) {
            prevXpRef.current = metadata.xp;
        } else {
            if (metadata.xp > prevXpRef.current) {
                setXpLeveledUp(true);
                timeoutId = setTimeout(() => setXpLeveledUp(false), 1200);
            }
            prevXpRef.current = metadata.xp;
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [metadata]);

    useEffect(() => {
        if (!metadata || !metadata.tier) return;
        try {
            localStorage.setItem("web3edu-tier", metadata.tier);
        } catch (err) {
            console.error("Failed to persist tier in localStorage:", err);
        }
    }, [metadata?.tier]);

    return (
        <PageShell>
            <div
                className="
                    min-h-screen flex flex-col items-center px-6 py-20
                    bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/20 to-[#020617]
                    text-white relative overflow-hidden
                "
            >

                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[18%] left-[32%] w-[420px] h-[420px] bg-purple-600/20 blur-[130px] rounded-full"></div>
                    <div className="absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/20 blur-[140px] rounded-full"></div>
                </div>

                {/* Card Grid */}
                <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 px-1 md:px-0">

                    <DashboardCard
                        title=""
                        className="
        rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
        bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
        backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
    "
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
relative w-20 h-20 rounded-full flex items-center justify-center 
shadow-xl ring-2 ring-indigo-300 dark:ring-indigo-700/50
transition-transform hover:scale-[1.03]
"
                                    style={generateAvatarStyle(address, metadata?.tier)}
                                >
                                    <AddressIdenticon address={address} />
                                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-[10px]">
                                        {metadata?.tier === "Explorer" && <ExplorerIcon />}
                                        {metadata?.tier === "Builder" && <BuilderIcon />}
                                        {metadata?.tier === "Architect" && <ArchitectIcon />}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/90 font-semibold text-lg">Identity</p>
                                    <p className="text-white/50 text-xs">Soulbound Profile</p>
                                </div>
                            </div>

                            {metadata?.tier && (
                                <span
                                    className={
                                        "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md " +
                                        (metadata?.tier === "Architect"
                                            ? "bg-yellow-300/20 border-yellow-300/40 animate-pulse"
                                            : "bg-white/10 border-white/20")
                                    }
                                >
                                    {metadata.tier === "Explorer" && <ExplorerIcon />}
                                    {metadata.tier === "Builder" && <BuilderIcon />}
                                    {metadata.tier === "Architect" && <ArchitectIcon />}
                                    {metadata.tier}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold
uppercase tracking-wide mb-2">Address</p>
                        <p className="text-slate-900 dark:text-slate-100 font-medium mb-4">{formattedAddress}</p>

                        {metadata ? (
                            <div className="space-y-3 text-white/85">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold
uppercase tracking-wide">Tier</p>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium flex items-center gap-2">
                                        {metadata.tier === "Explorer" && <ExplorerIcon />}
                                        {metadata.tier === "Builder" && <BuilderIcon />}
                                        {metadata.tier === "Architect" && <ArchitectIcon />}
                                        {metadata.tier}
                                    </p>
                                    <button
                                        onClick={() => setShowTierPopup(true)}
                                        className="mt-2 text-xs text-[#33D6FF] hover:text-[#7F3DF1] underline"
                                    >
                                        View Tier Benefits
                                    </button>
                                </div>

                                <div
                                    className={
                                        "rounded-xl p-3 bg-white/5 transition " +
                                        (xpLeveledUp
                                            ? "ring-2 ring-[#33D6FF] ring-offset-2 ring-offset-[#090C14] animate-pulse"
                                            : "")
                                    }
                                >
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold
uppercase tracking-wide">XP Progress</p>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"
                                            style={{ width: `${metadata.xpPercent ?? 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm mt-1">{metadata.xp} XP</p>
                                    <p className="text-xs text-white/60">
                                        {metadata.remainingXp > 0
                                            ? `${metadata.remainingXp} XP to next tier`
                                            : `Tier max reached`}
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold
uppercase tracking-wide">Progress to Next Tier</p>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                                            style={{ width: `${metadata.nextTierPercent ?? 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-white/60 mt-1">
                                        {metadata.remainingXp > 0
                                            ? `${metadata.remainingXp} XP remaining`
                                            : `Tier max reached`}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold
uppercase tracking-wide">Lessons Completed</p>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">{metadata.lessonsCompleted}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-white/60">Loading metadata...</p>
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="Actions"
                        className="
                        rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                        bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
                        dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
                        backdrop-blur-xl shadow-xl text-slate-800 dark:text-slate-100
                    "
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/sbt-view")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                View My SBT
                            </button>

                            <button
                                onClick={() => navigate("/education")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                Start Learning
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold shadow-md"
                            >
                                Back to Home
                            </button>
                        </div>
                    </DashboardCard>

                    <DashboardCard
                        title="Badges"
                        className="
        rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
        bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
        backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
    "
                        icon={<StarIcon className="w-5 h-5 text-white" />}
                    >
                        {metadata && metadata.badges?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {metadata.badges.map((b, i) => {
                                    let Icon = StarIcon;
                                    if (b.toLowerCase().includes("wallet")) Icon = KeyIcon;
                                    if (b.toLowerCase().includes("lesson")) Icon = BookOpenIcon;
                                    if (b.toLowerCase().includes("quiz")) Icon = TrophyIcon;

                                    return (
                                        <span
                                            key={i}
                                            className="
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full 
                                        text-xs font-semibold
                                        bg-indigo-200/60 dark:bg-indigo-900/40
                                        border border-indigo-300/40 dark:border-indigo-700/40
                                        text-slate-900 dark:text-slate-100
                                        "
                                        >
                                            <Icon className="w-4 h-4 text-white/90" />
                                            {b}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-white/60">No badges yet…</p>
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="DAO Access"
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
                            dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
                            backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        "
                        icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}
                    >
                        {metadata?.tier === "Builder" || metadata?.tier === "Architect" ? (
                            <p className="text-white/85">You are eligible for DAO participation.</p>
                        ) : (
                            <p className="text-slate-700 dark:text-slate-300">Reach Builder tier to unlock DAO access.</p>
                        )}
                    </DashboardCard>

                    <DashboardCard
                        title="Recommended Next Lesson"
                        className="
                        rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                        bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
                        dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
                        backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                    "
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        {metadata?.nextLesson ? (
                            <p className="text-slate-800 dark:text-slate-100">{metadata.nextLesson}</p>
                        ) : (
                            <p className="text-slate-600 dark:text-slate-300">New recommendations coming soon…</p>
                        )}
                    </DashboardCard>

                </div>
            </div>
            {showTierPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            Tier Benefits
                        </h2>
                        <ul className="text-white/80 text-sm space-y-2">
                            <li>🟣 Explorer — Basic access, community role, progress tracking</li>
                            <li>🔵 Builder — Unlock advanced lessons, early DAO proposals</li>
                            <li>🟡 Architect — Full DAO access, beta features, priority badges</li>
                        </ul>
                        <p className="text-white/70 text-sm mt-4">
                            How to upgrade your tier:
                        </p>
                        <ul className="text-white/80 text-sm space-y-1 mt-1">
                            <li>• Complete lessons and quizzes to earn XP.</li>
                            <li>• Return regularly and finish learning paths.</li>
                            <li>• Participate in community / DAO activities (future).</li>
                        </ul>
                        <button
                            onClick={() => setShowTierPopup(false)}
                            className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </PageShell>
    );
}