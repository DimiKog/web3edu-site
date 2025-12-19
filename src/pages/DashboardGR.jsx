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

export default function Dashboard() {
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
    const [lastSyncTime, setLastSyncTime] = useState(null);

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

    const isFounder = (() => {
        const m = displayedMetadata || {};
        const p = profile || {};
        const attrs = [
            ...(Array.isArray(m.attributes) ? m.attributes : []),
            ...(Array.isArray(p.attributes) ? p.attributes : []),
        ];

        const attrFounderTrue = attrs.some(
            a =>
                (a?.trait_type || "").toLowerCase() === "founder" &&
                (a?.value === true || String(a?.value).toLowerCase() === "true")
        );

        return (
            m.founder === true ||
            p.founder === true ||
            m.edition === "Founder Edition" ||
            p.edition === "Founder Edition" ||
            m.role === "Founder" ||
            p.role === "Founder" ||
            attrFounderTrue
        );
    })();

    useEffect(() => {
        if (!isConnected) navigate("/join");
        window.scrollTo(0, 0);
    }, [isConnected, navigate]);

    const formattedAddress = shortAddress(address);

    useEffect(() => {
        if (!address) return;
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";
        setIsMetadataLoading(true);
        setMetadataError(null);
        fetch(`${BACKEND}/web3sbt/resolve/${address}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Normalize metadata/profile and merge the richest info available
                const apiMetadata =
                    data?.metadata?.metadata && typeof data.metadata.metadata === "object"
                        ? data.metadata.metadata
                        : data?.metadata && typeof data.metadata === "object"
                            ? data.metadata
                            : {};
                const apiProfile =
                    data?.profile?.metadata && typeof data.profile.metadata === "object"
                        ? data.profile.metadata
                        : data?.profile && typeof data.profile === "object"
                            ? data.profile
                            : {};

                setMetadata({ ...apiMetadata, tokenId: data?.tokenId });

                const parseMaybeJson = value => {
                    if (typeof value === "string") {
                        try {
                            return JSON.parse(value);
                        } catch {
                            return null;
                        }
                    }
                    return value;
                };

                const normalizeAttributes = source => {
                    const candidates = [
                        source?.attributes,
                        source?.attribute,
                        source?.attrs,
                        source?.traits,
                        source?.traits_array,
                        source?.traitsArray,
                        source?.attributes_json,
                        source?.attributesJson
                    ];
                    for (const cand of candidates) {
                        const parsed = parseMaybeJson(cand);
                        if (Array.isArray(parsed)) return parsed;
                        if (parsed && typeof parsed === "object") {
                            return Object.entries(parsed).map(([key, value]) => ({
                                trait_type: key,
                                value
                            }));
                        }
                    }
                    return [];
                };

                const metadataAttributes = normalizeAttributes(apiMetadata);
                const profileAttributes = normalizeAttributes(apiProfile);
                const mergedAttributes = [...metadataAttributes, ...profileAttributes];

                // Add derived attributes for role/specialization if missing
                const roleValue = apiProfile.role || apiMetadata.role;
                const specializationValue =
                    apiProfile.specialization ||
                    apiProfile.speciality ||
                    apiMetadata.specialization ||
                    apiMetadata.speciality;

                const hasRoleAttr = mergedAttributes.some(
                    a => (a.trait_type || "").toLowerCase() === "role"
                );
                const hasSpecAttr = mergedAttributes.some(a =>
                    ["specialization", "speciality"].includes(
                        (a.trait_type || "").toLowerCase()
                    )
                );

                if (!hasRoleAttr && roleValue) {
                    mergedAttributes.push({ trait_type: "Role", value: roleValue });
                }
                if (!hasSpecAttr && specializationValue) {
                    mergedAttributes.push({
                        trait_type: "Specialization",
                        value: specializationValue
                    });
                }

                // Determine final profile image with a clear precedence:
                // 1) profile.image
                // 2) profile.avatar
                // 3) metadata.image
                // 4) metadata.avatar
                const finalImage =
                    apiProfile.image && apiProfile.image.trim() !== ""
                        ? apiProfile.image
                        : apiProfile.avatar && apiProfile.avatar.trim() !== ""
                            ? apiProfile.avatar
                            : apiMetadata.image && apiMetadata.image.trim() !== ""
                                ? apiMetadata.image
                                : apiMetadata.avatar && apiMetadata.avatar.trim() !== ""
                                    ? apiMetadata.avatar
                                    : null;

                const mergedProfile = {
                    ...apiMetadata,
                    ...apiProfile,
                    name:
                        apiProfile.name ||
                        apiMetadata.name ||
                        formattedAddress ||
                        "Web3Edu Identity",
                    image: finalImage,
                    attributes: mergedAttributes
                };

                setProfile(mergedProfile);
                setLastSyncTime(new Date());
            })
            .catch(err => {
                console.error("Failed to fetch metadata:", err);
                setMetadataError("Δεν ήταν δυνατή η φόρτωση της ζωντανής προόδου — εμφάνιση προεπιλογών.");
            })
            .finally(() => setIsMetadataLoading(false));
    }, [address, formattedAddress]);

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
                {profile && (
                    <div
                        className="
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        "
                    >
                        {/* Mini Avatar + Shine */}
                        <div className="flex justify-center mb-3">
                            <div className="relative">
                                <img
                                    src={profile.image || "/icons/web3edu-identity.png"}
                                    alt="avatar"
                                    className="
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    "
                                />

                                {/* Subtle highlight ring */}
                                <div
                                    className="
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    "
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
                            Καλώς ήρθες πάλι, {profile.name || formattedAddress} 👋

                            {/* Tier Badge */}
                            {metadata?.tier && (
                                <span
                                    className="
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            "
                                >
                                    {metadata.tier}
                                </span>
                            )}
                        </h2>
                        {lastSyncTime && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                🕒 Συγχρονίστηκε πριν {Math.max(1, Math.floor((Date.now() - lastSyncTime.getTime()) / 1000))} δευτ • Ταυτότητα Web3Edu
                            </p>
                        )}

                        <div
                            className="
                w-20 h-1 mx-auto mt-3 rounded-full
                bg-gradient-to-r from-[#8A57FF]/50 via-[#4ACBFF]/40 to-[#FF67D2]/50
                shadow-[0_0_12px_rgba(138,87,255,0.45)]
            "
                        ></div>

                        {/* Shine Animations */}
                        <style>
                            {`
                @keyframes shine {
                    0% { filter: brightness(1); }
                    50% { filter: brightness(1.4); }
                    100% { filter: brightness(1); }
                }

                @keyframes shineGlow {
                    0% { opacity: 0.25; }
                    50% { opacity: 0.45; }
                    100% { opacity: 0.25; }
                }
            `}
                        </style>
                    </div>
                )}

                {/* 2-Column Premium Layout */}
                <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0">
                    {/* Left Column — IdentityCard */}
                    <div className="flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center">
                        <div className="absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"></div>
                        {profile && (
                            <IdentityCard
                                metadata={profile}
                                wallet={address}
                                tokenId={displayedMetadata.tokenId}
                                lang="gr"
                            />
                        )}
                    </div>

                    {/* Right Column — Dashboard Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8">
                        {/* Founder Badge Panel */}
                        {isFounder && (
                            <DashboardCard
                                title="Σήμα Ιδρυτή"
                                className="
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                "
                                icon={<StarIcon className="w-5 h-5 text-white" />}
                            >
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Κατέχεις ένα{" "}
                                    <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                                        Founder SBT
                                    </span>
                                    . Μια ειδική αναγνώριση για τους βασικούς δημιουργούς του Web3Edu.
                                </p>
                            </DashboardCard>
                        )}

                        {/* Mini Wallet Card */}
                        <DashboardCard
                            title="Το πορτοφόλι σου"
                            className="
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            "
                            icon={<KeyIcon className="w-5 h-5 text-white" />}
                        >
                            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                                {address ?? "—"}
                            </p>
                        </DashboardCard>

                        {/* Animated Rank Panel */}
                        <DashboardCard
                            title="Βαθμίδα"
                            className="
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            "
                            icon={<UserIcon className="w-5 h-5 text-white" />}
                        >
                            <div className="flex flex-col items-start gap-3">
                                {/* Tier label pill */}
                                <div
                                    className="
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    "
                                >
                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400" />
                                    <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200">
                                        Τρέχουσα βαθμίδα
                                    </span>
                                </div>

                                {/* Tier value + subtle helper text */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-200">
                                            {metadata?.tier ?? "Explorer"}
                                        </p>
                                        {metadata?.tier && metadata.tier !== "Explorer" && (
                                            <span className="text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90">
                                                {metadata.tier === "Builder"
                                                    ? "Σε πορεία για DAO"
                                                    : "Έτοιμος για διακυβέρνηση DAO"}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600/90 dark:text-slate-400/90">
                                        Κέρδισε XP από μαθήματα και κουίζ για να αναβαθμίσεις τη βαθμίδα σου.
                                    </p>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Continue Learning Callout */}
                        <DashboardCard
                            title="Συνέχισε να μαθαίνεις"
                            className="
                                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                                bg-gradient-to-br from-white/95 via-indigo-50/70 to-slate-100/90
                                dark:from-[#0e1020]/90 dark:via-[#0a0d19]/85 dark:to-[#060811]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            "
                            icon={<BookOpenIcon className="w-5 h-5 text-white" />}
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                                Προχωράς πολύ καλά — τα επόμενα βήματα του Web3 ταξιδιού σου σε περιμένουν.
                            </p>
                            <button
                                onClick={() => navigate("/education")}
                                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#4ACBFF]
                                           text-white hover:scale-[1.04] hover:opacity-90 transition 
                                           font-semibold shadow-md"
                            >
                                Συνέχισε να μαθαίνεις
                            </button>
                        </DashboardCard>

                        {/* Progress Card */}
                        <DashboardCard
                            title="Πρόοδος"
                            className="
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
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
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        "
                            icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                                Εδώ θα βρεις τις βασικές ενέργειες για την ταυτότητα και το ταξίδι μάθησής σου στο Web3Edu.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate("/sbt-view")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    Δες το SBT μου
                                </button>

                                <button
                                    onClick={() => navigate("/education")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    Ξεκίνησε τα μαθήματα
                                </button>

                                <button
                                    onClick={() => navigate("/start-here-gr")}
                                    className="
    py-3 px-6 rounded-xl
    bg-gradient-to-r from-indigo-500 to-purple-400
    text-white
    hover:scale-[1.03] hover:opacity-90
    transition
    font-semibold shadow-md
  "
                                >
                                    Ξεκίνα εδώ (οδηγός)
                                </button>

                                <button
                                    onClick={() => navigate("/")}
                                    className="py-3 px-6 rounded-xl bg-white/10 hover:bg
                                    white/20 hover:scale-[1.03] transition font-semibold shadow-md text-slate-900 dark:text-white"
                                >
                                    Επιστροφή στην Αρχική
                                </button>
                            </div>
                        </DashboardCard>

                        {/* Badges */}
                        <DashboardCard
                            title="Σήματα"
                            className="
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        "
                            icon={<StarIcon className="w-5 h-5 text-white" />}
                        >
                            <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                                Όλες οι διακρίσεις και τα σήματα που κερδίζεις θα εμφανίζονται εδώ καθώς προχωράς.
                            </p>
                            {metadata && metadata.badges?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {metadata.badges.map((b, i) => {
                                        let Icon = StarIcon;
                                        const lower = b.toLowerCase();
                                        if (lower.includes("wallet")) Icon = KeyIcon;
                                        if (lower.includes("lesson")) Icon = BookOpenIcon;
                                        if (lower.includes("quiz")) Icon = TrophyIcon;

                                        return (
                                            <span
                                                key={i}
                                                className="
                                                    inline-flex items-center gap-2 
                                                    px-3 py-1 rounded-full 
                                                    text-xs font-semibold
                                                    bg-indigo-200/60 dark:bg-indigo-900/40
                                                    border border-indigo-300/30 dark:border-indigo-700/30
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
                                <p className="text-slate-600 dark:text-slate-300">
                                    Δεν υπάρχουν σήματα ακόμη…
                                </p>
                            )}
                        </DashboardCard>

                        {/* DAO Access */}
                        <DashboardCard
                            title="Πρόσβαση DAO"
                            className="
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        "
                            icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}
                        >
                            {metadata?.tier === "Builder" || metadata?.tier === "Architect" ? (
                                <p className="text-slate-800 dark:text-slate-100">
                                    Είσαι επιλέξιμος/η για συμμετοχή στο DAO.
                                </p>
                            ) : (
                                <p className="text-slate-700 dark:text-slate-300">
                                    Φτάσε τη βαθμίδα Builder για να ξεκλειδώσεις πρόσβαση στο DAO.
                                </p>
                            )}
                        </DashboardCard>

                        {/* Recommended Next Lesson */}
                        <DashboardCard
                            title="Προτεινόμενο επόμενο μάθημα"
                            className="
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
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
                                <p className="text-slate-700 dark:text-slate-300">
                                    Νέες προτάσεις σύντομα…
                                </p>
                            )}
                        </DashboardCard>
                    </div>
                </div>

                {/* Side Gradient Glow */}
                <div
                    className="pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60"
                ></div>

                {showTierPopup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl">
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                Οφέλη βαθμίδας
                            </h2>
                            <ul className="text-white/80 text-sm space-y-2">
                                <li>🟣 Explorer — Βασική πρόσβαση, ρόλος στην κοινότητα, παρακολούθηση προόδου</li>
                                <li>🔵 Builder — Ξεκλείδωσε προχωρημένα μαθήματα, πρώιμες προτάσεις DAO</li>
                                <li>🟡 Architect — Πλήρης πρόσβαση DAO, beta δυνατότητες, προτεραιότητα σε σήματα</li>
                            </ul>
                            <p className="text-white/70 text-sm mt-4">
                                Πώς να αναβαθμίσεις τη βαθμίδα σου:
                            </p>
                            <ul className="text-white/80 text-sm space-y-1 mt-1">
                                <li>• Ολοκλήρωσε μαθήματα και κουίζ για να κερδίσεις XP.</li>
                                <li>• Επεστρέφε τακτικά και ολοκλήρωσε τις διαδρομές μάθησης.</li>
                                <li>• Συμμετέχεις σε δράσεις της κοινότητας / DAO (μελλοντικά).</li>
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
