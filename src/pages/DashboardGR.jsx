import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import XPProgressCard from "../components/XPProgressCard.jsx";

import { UserIcon, AcademicCapIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import IdentityCard from "../components/IdentityCard.jsx";
import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function DashboardGR() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [metadata, setMetadata] = useState(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);
    const [metadataError, setMetadataError] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const prevXpRef = useRef(null);
    const prevLessonsRef = useRef(null);
    const [lessonsPulse, setLessonsPulse] = useState(false);
    const [profile, setProfile] = useState(null);

    const fallbackMetadata = {
        tier: "Explorer",
        xp: 0,
        xpPercent: 0,
        remainingXp: 0,
        nextTierPercent: 0,
        lessonsCompleted: 0
    };
    const safeMetadata =
        metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
    const displayedMetadata = { ...fallbackMetadata, ...safeMetadata };

    useEffect(() => {
        if (!isConnected) navigate("/join-gr");
        window.scrollTo(0, 0);
    }, [isConnected]);

    const formattedAddress = shortAddress(address);

    useEffect(() => {
        if (!address) return;
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";
        setIsMetadataLoading(true);
        setMetadataError(null);
        fetch(`${BACKEND}/sbt/resolve/${address}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setMetadata(data.metadata);
                setProfile(data.profile || null);
            })
            .catch(err => {
                console.error("Failed to fetch metadata:", err);
                setMetadataError("Αποτυχία φόρτωσης προόδου — εμφάνιση προεπιλογών.");
            })
            .finally(() => setIsMetadataLoading(false));
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
        if (!displayedMetadata?.nextLesson) return "";
        const trimmed = displayedMetadata.nextLesson
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
                        Καλώς ήρθες στο Dashboard σου
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Παρακολούθησε την πρόοδό σου, εξερεύνησε την ταυτότητά σου και συνέχισε το Web3 ταξίδι μάθησης.
                    </p>

                    <div className="w-24 h-1 mx-auto mt-6 rounded-full 
                        bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40">
                    </div>
                </div>

                {/* 2‑Column Premium Layout */}
                <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0">

                    {/* Left Column — IdentityCard */}
                    <div className="flex flex-col items-center lg:justify-center">
                        {profile && (
                            <IdentityCard
                                metadata={profile}
                                wallet={address}
                                tokenId={2}
                                lang="gr"
                            />
                        )}
                    </div>

                    {/* Right Column — Dashboard Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-10">

                        {/* Founder Badge Panel */}
                        <DashboardCard
                            title="Σήμα Ιδρυτή"
                            className="
                                rounded-2xl border border-fuchsia-300/40 dark:border-fuchsia-700/30
                                bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                            "
                            icon={<StarIcon className='w-5 h-5 text-white' />}
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                Κατέχεις ένα <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">Founder SBT</span>.
                                Μια ειδική αναγνώριση για τους βασικούς δημιουργούς του Web3Edu.
                            </p>
                        </DashboardCard>

                        {/* Mini Wallet Card */}
                        <DashboardCard
                            title="Το Πορτοφόλι σου"
                            className="
                                rounded-2xl border border-cyan-300/40 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                            "
                            icon={<KeyIcon className='w-5 h-5 text-white' />}
                        >
                            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                                {address ?? "—"}
                            </p>
                        </DashboardCard>

                        {/* Animated Rank Panel */}
                        <DashboardCard
                            title="Κατάταξη"
                            className="
                                rounded-2xl border border-purple-300/40 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.01] hover:shadow-2xl transition-all duration-500 relative
                            "
                            icon={<UserIcon className='w-5 h-5 text-white' />}
                        >
                            <div className="flex flex-col items-start">
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Τρέχον Tier</p>
                                <p className="text-xl font-bold text-purple-600 dark:text-purple-300 animate-pulse">
                                    {metadata?.tier ?? "Explorer"}
                                </p>
                            </div>
                        </DashboardCard>

                        {/* Continue Learning Callout */}
                        <DashboardCard
                            title="Συνέχισε τη Μάθηση"
                            className="
                                rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                                bg-gradient-to-br from-white/95 via-indigo-50/70 to-slate-100/90
                                dark:from-[#0e1020]/90 dark:via-[#0a0d19]/85 dark:to-[#060811]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                            "
                            icon={<BookOpenIcon className='w-5 h-5 text-white' />}
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                                Προχωράς εξαιρετικά — τα επόμενα βήματα του Web3 ταξιδιού σου σε περιμένουν.
                            </p>
                            <button
                                onClick={() => navigate("/education-gr")}
                                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#4ACBFF]
                                           text-white hover:scale-[1.04] hover:opacity-90 transition 
                                           font-semibold shadow-md"
                            >
                                Συνέχισε να Μαθαίνεις
                            </button>
                        </DashboardCard>

                        {/* Progress Card */}
                        <DashboardCard
                            title="Πρόοδος"
                            className="
                            rounded-2xl border border-indigo-300/40 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.01] hover:shadow-2xl transition-all duration-500
                        "
                            icon={<StarIcon className="w-5 h-5 text-white" />}
                        >
                            <XPProgressCard
                                xp={metadata?.xp ?? 0}
                                xpPercent={metadata?.xpPercent ?? 0}
                                remainingXp={metadata?.remainingXp ?? 0}
                                nextTierPercent={metadata?.nextTierPercent ?? 0}
                                tier={metadata?.tier ?? "Explorer"}
                                xpLeveledUp={xpLeveledUp}
                                lang="gr"
                            />
                        </DashboardCard>

                        {/* Actions */}
                        <DashboardCard
                            title="Ενέργειες"
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
                                Εδώ θα βρεις τις βασικές ενέργειες για την ταυτότητά σου και την πορεία μάθησης στο Web3Edu.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate("/sbt-view-gr")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    Προβολή SBT
                                </button>

                                <button
                                    onClick={() => navigate("/education-gr")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    Ξεκίνησε την Εκπαίδευση
                                </button>

                                <button
                                    onClick={() => navigate("/gr")}
                                    className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-[1.03] transition font-semibold shadow-md text-slate-900 dark:text-white"
                                >
                                    Αρχική Σελίδα
                                </button>
                            </div>
                        </DashboardCard>

                        {/* Badges */}
                        <DashboardCard
                            title="Διακρίσεις"
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
                                Όλες οι διακρίσεις και τα επιτεύγματά σου θα εμφανίζονται εδώ καθώς προχωράς.
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
                                <p className="text-slate-600 dark:text-slate-300">Δεν υπάρχουν διακρίσεις…</p>
                            )}
                        </DashboardCard>

                        {/* DAO Access */}
                        <DashboardCard
                            title="Πρόσβαση DAO"
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
                                <p className="text-slate-800 dark:text-slate-100">Έχεις πρόσβαση για συμμετοχή στο DAO.</p>
                            ) : (
                                <p className="text-slate-700 dark:text-slate-300">Φτάσε στο επίπεδο Builder για να ξεκλειδώσεις πρόσβαση στο DAO.</p>
                            )}
                        </DashboardCard>

                        {/* Recommended Next Lesson */}
                        <DashboardCard
                            title="Προτεινόμενο Μάθημα"
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
                                        Επόμενο μάθημα
                                    </p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                                        {cleanNextLesson}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-700 dark:text-slate-300">Νέες προτάσεις έρχονται σύντομα…</p>
                            )}
                        </DashboardCard>

                    </div>
                </div>
                {/* Side Gradient Glow */}
                <div className="pointer-events-none fixed top-0 right-0 w-[260px] h-full 
                                bg-gradient-to-b from-[#8A57FF]/25 via-[#4ACBFF]/20 to-[#FF67D2]/25
                                blur-[120px] opacity-70"></div>
                {showTierPopup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                Προνόμια Tier
                            </h2>
                            <ul className="text-white/80 text-sm space-y-2">
                                <li>🟣 Explorer — Βασική πρόσβαση, ρόλος κοινότητας, παρακολούθηση προόδου</li>
                                <li>🔵 Builder — Προχωρημένα μαθήματα, αρχικές προτάσεις DAO</li>
                                <li>🟡 Architect — Πλήρης πρόσβαση DAO, beta λειτουργίες, προτεραιότητα σε badges</li>
                            </ul>
                            <p className="text-white/70 text-sm mt-4">
                                Πώς ανεβαίνεις tier:
                            </p>
                            <ul className="text-white/80 text-sm space-y-1 mt-1">
                                <li>• Ολοκλήρωσε μαθήματα και κουίζ για να κερδίζεις XP.</li>
                                <li>• Επιστρέφε τακτικά και τελείωσε τα learning paths.</li>
                                <li>• Συμμετέχεις σε κοινότητα / DAO (όταν είναι διαθέσιμο).</li>
                            </ul>
                            <button
                                onClick={() => setShowTierPopup(false)}
                                className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide"
                            >
                                Κλείσιμο
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}
