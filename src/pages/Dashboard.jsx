import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import XPProgressCard from "../components/XPProgressCard.jsx";

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
    const prevLessonsRef = useRef(null);
    const [lessonsPulse, setLessonsPulse] = useState(false);

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
        if (!metadata || typeof metadata.lessonsCompleted !== "number") return;

        let timeoutId;

        if (prevLessonsRef.current == null) {
            prevLessonsRef.current = metadata.lessonsCompleted;
        } else {
            if (metadata.lessonsCompleted > prevLessonsRef.current) {
                setLessonsPulse(true);
                timeoutId = setTimeout(() => setLessonsPulse(false), 900);
            }
            prevLessonsRef.current = metadata.lessonsCompleted;
        }

        return () => timeoutId && clearTimeout(timeoutId);
    }, [metadata]);

    useEffect(() => {
        if (!metadata || !metadata.tier) return;
        try {
            localStorage.setItem("web3edu-tier", metadata.tier);
        } catch (err) {
            console.error("Failed to persist tier in localStorage:", err);
        }
    }, [metadata?.tier]);

    const cleanNextLesson = (() => {
        if (!metadata?.nextLesson) return "";
        const trimmed = metadata.nextLesson
            .trim()
            .replace(/^Start\s+/i, "")
            .replace(/^with\s+/i, "")
            .trim();
        if (!trimmed) return "";
        const normalized = trimmed.toLowerCase();
        const looksLikePlaceholderLesson1 =
            /^lesson\s*1$/.test(normalized) ||
            normalized.includes("with lesson 1") ||
            (normalized.includes("lesson 1") && normalized.length <= 20);
        if (looksLikePlaceholderLesson1) return "";
        return trimmed;
    })();

    return (
        <PageShell>
            <div
                className="
                    min-h-screen flex flex-col items-center px-6 py-20
                    bg-transparent dark:bg-transparent
                    text-slate-900 dark:text-slate-100
                    relative overflow-hidden transition-colors duration-500
                "
            >

                <style>
                    {`
                  @keyframes pulseGlow {
                    0% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                    50% { box-shadow: 0 0 18px rgba(51,214,255,0.55); }
                    100% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                  }

                  @keyframes xpBurst {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.08); filter: drop-shadow(0 0 18px rgba(138,87,255,0.6)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }

                  @keyframes lessonPulse {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(138,87,255,0.8)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }
                `}
                </style>

                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"></div>
                    <div className="absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"></div>
                </div>

                {/* Dashboard Header */}
                <div className="relative z-10 w-full max-w-5xl mx-auto text-center mb-16 animate-[fadeIn_0.6s_ease-out] transition-all duration-700">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        Welcome to Your Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Track your progress, explore your identity, and continue your Web3 learning journey.
                    </p>

                    <div className="w-24 h-1 mx-auto mt-6 rounded-full 
                        bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40">
                    </div>
                </div>

                {/* Card Grid */}
                <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 px-2 md:px-0">

                    {/* Identity */}
                    <DashboardCard
                        title=""
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                    >
                        <div className="flex flex-col items-center justify-center gap-3 text-center mb-4">
                            <div className="relative w-20 h-20 rounded-full flex items-center justify-center 
shadow-xl ring-2 ring-indigo-300 dark:ring-indigo-700/50
transition-transform hover:scale-[1.03]
mx-auto sm:mx-0
"
                                style={generateAvatarStyle(address, metadata?.tier)}
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/20 to-[#FF67D2]/30 blur-xl -z-10"></div>
                                <AddressIdenticon address={address} />
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-[10px]">
                                    {metadata?.tier === "Explorer" && <ExplorerIcon />}
                                    {metadata?.tier === "Builder" && <BuilderIcon />}
                                    {metadata?.tier === "Architect" && <ArchitectIcon />}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100 font-semibold text-lg">Identity</p>
                                <p className="text-slate-600 dark:text-slate-300 text-xs">Soulbound Profile</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide mb-1">
                                Address
                            </p>
                            <p className="text-slate-900 dark:text-slate-100 font-medium mb-3">
                                {formattedAddress}
                            </p>
                        </div>

                        {metadata ? (
                            <div className="space-y-3 text-white/85">
                                <div className="flex flex-col items-center text-center">
                                    <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm font-semibold
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

                                <div className={xpLeveledUp ? "animate-[xpBurst_0.7s_ease-out]" : ""}>
                                    <XPProgressCard
                                        tier={metadata.tier}
                                        xp={metadata.xp}
                                        xpPercent={metadata.xpPercent}
                                        remainingXp={metadata.remainingXp}
                                        nextTierPercent={metadata.nextTierPercent}
                                        leveledUp={xpLeveledUp}
                                    />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold uppercase tracking-wide mb-1">
                                        Lessons Completed
                                    </p>
                                    <p
                                        className={`
            font-extrabold text-2xl tracking-wide
            text-[#7F3DF1] dark:text-[#E8D5FF]
            ${lessonsPulse ? "animate-[lessonPulse_0.9s_ease-out]" : ""}
        `}
                                    >
                                        {metadata.lessonsCompleted}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-white/60">Loading metadata...</p>
                        )}
                    </DashboardCard>

                    {/* Actions */}
                    <DashboardCard
                        title="Actions"
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                            Here you can find the main actions for your Web3Edu identity and learning journey.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/sbt-view")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                View My SBT
                            </button>

                            <button
                                onClick={() => navigate("/education")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                Start Learning
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.03] transition font-semibold shadow-md text-slate-900 dark:text-white"
                            >
                                Back to Home
                            </button>
                        </div>
                    </DashboardCard>

                    {/* Badges */}
                    <DashboardCard
                        title="Badges"
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                        icon={<StarIcon className="w-5 h-5 text-white" />}
                    >
                        <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                            All your achievements and earned badges will appear here as you progress.
                        </p>
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
                        <p className="text-slate-600 dark:text-slate-300">No badges yet…</p>
                    )}
                </DashboardCard>

                    {/* DAO Access */}
                    <DashboardCard
                        title="DAO Access"
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                        icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}
                    >
                        {metadata?.tier === "Builder" || metadata?.tier === "Architect" ? (
                            <p className="text-slate-800 dark:text-slate-100">You are eligible for DAO participation.</p>
                        ) : (
                            <p className="text-slate-700 dark:text-slate-300">Reach Builder tier to unlock DAO access.</p>
                        )}
                    </DashboardCard>

                    {/* Recommended Next Lesson */}
                    <DashboardCard
                        title="Recommended Next Lesson"
                        className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                        icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                    >
                        {cleanNextLesson ? (
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Next lesson
                                </p>
                                <p className="text-base font-semibold text-slate-900 dark:text-white">
                                    {cleanNextLesson}
                                </p>
                            </div>
                        ) : (
                            <p className="text-slate-700 dark:text-slate-300">New recommendations coming soon…</p>
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
