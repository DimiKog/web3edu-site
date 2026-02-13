import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import XPProgressCard from "../components/XPProgressCard.jsx";

import { UserIcon, AcademicCapIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon as BookOpenIcon2, AcademicCapIcon as AcademicCapIcon2, TrophyIcon as TrophyIcon2 } from "@heroicons/react/24/solid";
import LearningTimeline from "../components/LearningTimeline.jsx";
import IdentityCard from "../components/IdentityCard.jsx";
import PilotBanner from "../components/PilotBanner.jsx";
import {
    shortAddress
} from "../components/identity-ui.jsx";

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [metadata, setMetadata] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const prevXpRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [lastSyncTime, setLastSyncTime] = useState(null);

    // Builder unlock promo state
    const [showBuilderUnlock, setShowBuilderUnlock] = useState(false);
    const [builderRewardClaimed, setBuilderRewardClaimed] = useState(
        localStorage.getItem("web3edu-builder-claimed") === "true"
    );
    const [builderJustClaimed, setBuilderJustClaimed] = useState(false);
    const prevTierRef = useRef(null);

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
            });
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
        const tier = metadata?.tier;
        if (!tier) return;
        try {
            localStorage.setItem("web3edu-tier", tier);
        } catch (err) {
            console.error("Failed to persist tier in localStorage:", err);
        }
    }, [metadata?.tier]);

    // Builder unlock promo effect
    useEffect(() => {
        if (!metadata?.tier) return;

        // If user is Builder and has NOT claimed reward yet,
        // always show unlock promo (even on first load)
        if (
            metadata.tier === "Builder" &&
            !builderRewardClaimed
        ) {
            setShowBuilderUnlock(true);
        }

        prevTierRef.current = metadata.tier;
    }, [metadata?.tier, builderRewardClaimed]);

    // Always provide a recommendation (backend-driven or fallback)
    const fallbackRecommendation = {
        type: "guide",
        title: "Start Here — Your Web3 Learning Path",
        slug: "start-here",
        why: "This short guide explains how Web3Edu works and helps you choose what to learn next.",
        estimatedTime: 5,
    };

    const recommendedFromBackend =
        metadata && typeof metadata.recommendedNext === "object"
            ? metadata.recommendedNext
            : null;
    const hasBackendRecommendation =
        recommendedFromBackend &&
        (recommendedFromBackend.title || recommendedFromBackend.slug);
    const recommended = hasBackendRecommendation
        ? recommendedFromBackend
        : fallbackRecommendation;
    const isFallbackRecommendation = !hasBackendRecommendation;
    const isBuilderRequired = !!recommended?.builderRequired;
    const recommendedLabSlug =
        recommended?.slug?.endsWith("-gr")
            ? recommended.slug.replace(/-gr$/, "")
            : recommended?.slug;

    const builderChecklist = metadata?.builderChecklist || null;
    const [showBuilderPath, setShowBuilderPath] = useState(
        metadata?.tier && metadata.tier !== "Explorer"
    );


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
                                <img src={profile.image || "/icons/web3edu-identity.png"}
                                    alt="avatar"
                                    className="
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    " loading="lazy" />

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
                            Welcome back, {profile.name || formattedAddress} 👋

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
                                🕒 Synced {Math.max(1, Math.floor((Date.now() - lastSyncTime.getTime()) / 1000))}s ago • Web3Edu Identity
                            </p>
                        )}
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Mint your Web3Edu Identity to anchor your learning on-chain.
                        </p>

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

                {/* Pilot User Banner */}
                <PilotBanner lang={document.documentElement.lang === "gr" ? "gr" : "en"} />

                {/* Builder Unlock Promotion */}
                {showBuilderUnlock && (
                    <div className="relative z-10 w-full max-w-4xl mx-auto mb-10 px-4">
                        <div className="
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        ">
                            <h2 className="text-2xl font-extrabold text-white mb-3">
                                🏗️ Builder Level Unlocked
                            </h2>

                            <p className="text-sm text-slate-200 mb-6">
                                You have completed the core requirements and unlocked
                                <span className="font-semibold text-purple-300"> Builder </span>
                                status.
                                You are now eligible to participate in advanced governance tracks.
                            </p>

                            {builderJustClaimed ? (
                                <div
                                    className="
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    "
                                >
                                    <span>✅ Builder Badge Claimed</span>
                                    <span className="text-[11px] opacity-90">
                                        Next milestone: Architect Tier
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        localStorage.setItem("web3edu-builder-claimed", "true");
                                        setBuilderRewardClaimed(true);
                                        setBuilderJustClaimed(true);

                                        // Show claimed state briefly before hiding
                                        setTimeout(() => {
                                            setShowBuilderUnlock(false);
                                            setBuilderJustClaimed(false);
                                        }, 1400);
                                    }}
                                    className="
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    "
                                >
                                    Claim Builder Badge
                                </button>
                            )}
                        </div>
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
                            />
                        )}
                    </div>

                    {/* Right Column — Dashboard Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8">
                        {/* Founder Badge Panel */}
                        {isFounder && (
                            <DashboardCard
                                title="Founder Badge"
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
                                    You hold a{" "}
                                    <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                                        Founder SBT
                                    </span>
                                    . A special recognition for the core creators of Web3Edu.
                                </p>
                            </DashboardCard>
                        )}

                        {/* Mini Wallet Card */}
                        <DashboardCard
                            title="Your Wallet"
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
                            title="Rank"
                            className="
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            "
                            icon={<UserIcon className="w-5 h-5 text-white" />}
                        >
                            <div
                                className="flex flex-col items-start gap-3 cursor-pointer"
                                onClick={() => setShowTierPopup(true)}
                            >
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
                                        Current Tier
                                    </span>
                                </div>

                                {/* Tier value + subtle helper text */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <p
                                            className={`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${metadata?.tier === "Builder" ? "animate-[xpBurst_1.2s_ease-out]" : ""}
                                            `}
                                        >
                                            {metadata?.tier ?? "Explorer"}
                                        </p>
                                        {metadata?.tier && metadata.tier !== "Explorer" && (
                                            <span className="text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90">
                                                {metadata.tier === "Builder"
                                                    ? "DAO-ready in progress"
                                                    : "DAO governance ready"}
                                            </span>
                                        )}
                                    </div>
                                    {/* Next Tier Hint */}
                                    {metadata?.tier && metadata.tier !== "Architect" && (
                                        <div className="mt-2 text-xs text-slate-600/90 dark:text-slate-400/90">
                                            {(() => {
                                                const currentTier = metadata.tier;
                                                const remainingXp = metadata?.remainingXp ?? 0;

                                                let nextTier = "Builder";
                                                if (currentTier === "Builder") nextTier = "Architect";

                                                return (
                                                    <span>
                                                        Next Tier:{" "}
                                                        <span className="font-semibold text-purple-600 dark:text-purple-300">
                                                            {nextTier}
                                                        </span>{" "}
                                                        • {remainingXp} XP remaining
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    )}
                                    <p className="text-xs text-slate-600/90 dark:text-slate-400/90">
                                        Earn XP from lessons and quizzes to upgrade your tier.
                                    </p>
                                    <p className="mt-2 text-xs text-slate-600/90 dark:text-slate-400/90">
                                        {metadata?.tier === "Builder" || metadata?.tier === "Architect"
                                            ? "DAO governance access unlocked at your current tier."
                                            : "Reach Builder tier to unlock DAO governance access."}
                                    </p>
                                    <div className="mt-2 text-xs font-semibold">
                                        {metadata?.tier === "Builder" || metadata?.tier === "Architect" ? (
                                            <span className="text-green-600 dark:text-green-400">
                                                🟢 Governance Access: Active
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 dark:text-slate-400">
                                                🔒 Governance Access: Locked
                                            </span>
                                        )}
                                    </div>
                                    {metadata?.tier === "Builder" && (
                                        <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">
                                            Architect tier unlocks proposal publishing & advanced governance tools.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>


                        {/* Progress Card */}
                        <DashboardCard
                            title="Progress"
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
                            />
                        </DashboardCard>

                        {/* Actions */}
                        <DashboardCard
                            title="Quick Actions"
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
                                Here you can find the main actions for your Web3Edu identity and learning
                                journey.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate("/sbt-view")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    View My SBT
                                </button>

                                <button
                                    onClick={() => navigate("/labs")}
                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md"
                                >
                                    Continue Learning
                                </button>

                                <div className="mt-3">
                                    <button
                                        onClick={() => navigate("/start-here")}
                                        className="
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
"
                                    >
                                        Start Here (guide)
                                    </button>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Badges */}
                        <DashboardCard
                            title="Badges"
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
                                All your achievements and earned badges will appear here as you progress.
                            </p>
                            {metadata && metadata.badges?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {metadata.badges.map((b, i) => {
                                        let Icon = StarIcon;
                                        // Defensive: handle b possibly not being a string
                                        const lower =
                                            typeof b === "string"
                                                ? b.toLowerCase()
                                                : (b?.label?.toLowerCase?.() ||
                                                    b?.en?.toLowerCase?.() ||
                                                    b?.gr?.toLowerCase?.() ||
                                                    "");
                                        if (lower.includes("wallet")) Icon = KeyIcon;
                                        if (lower.includes("lesson")) Icon = BookOpenIcon;
                                        if (lower.includes("quiz")) Icon = TrophyIcon;

                                        return (
                                            <span
                                                key={`${i}-${typeof b === "string" ? b : b?.id || "badge"}`}
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
                                                {typeof b === "string"
                                                    ? b
                                                    : b?.en || b?.gr || b?.label || JSON.stringify(b)}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-300">
                                    No badges yet…
                                </p>
                            )}
                        </DashboardCard>

                    </div>
                </div>


                {/* Recommended Next Module — Full Width */}
                {recommended && (
                    <div className="relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0">
                        <DashboardCard
                            title="Recommended Next Module"
                            className="
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            "
                            icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                        >
                            {builderChecklist && (
                                <div className="mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                            🏗 Builder Path
                                        </span>

                                        {metadata?.tier === "Explorer" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowBuilderPath(prev => !prev);
                                                }}
                                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                {showBuilderPath ? "Hide details" : "View requirements"}
                                            </button>
                                        )}

                                        {metadata?.tier !== "Explorer" && (
                                            builderChecklist.coreLabs?.done &&
                                                builderChecklist.daoLabs?.done &&
                                                builderChecklist.proofOfEscape?.done &&
                                                builderChecklist.xpRequirement?.done ? (
                                                <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                                                    ✔ Builder Unlocked
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    In Progress
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {showBuilderPath && (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    {builderChecklist.coreLabs?.done ? "✔" : "⏳"} Core Labs
                                                    ({builderChecklist.coreLabs?.completed}/{builderChecklist.coreLabs?.required})
                                                </div>
                                                <div>
                                                    {builderChecklist.daoLabs?.done ? "✔" : "⏳"} DAO Labs
                                                    ({builderChecklist.daoLabs?.completed}/{builderChecklist.daoLabs?.required})
                                                </div>
                                                <div>
                                                    {builderChecklist.proofOfEscape?.done ? "✔" : "⏳"} Proof of Escape
                                                </div>
                                                <div>
                                                    {builderChecklist.xpRequirement?.done ? "✔" : "⏳"} XP
                                                    ({builderChecklist.xpRequirement?.current}/{builderChecklist.xpRequirement?.required})
                                                </div>
                                            </div>
                                            {(() => {
                                                // XP is naturally achieved by completing the labs,
                                                // so we treat Builder as 3 structural requirements.
                                                const total = 3;

                                                const completed =
                                                    (builderChecklist.coreLabs?.done ? 1 : 0) +
                                                    (builderChecklist.daoLabs?.done ? 1 : 0) +
                                                    (builderChecklist.proofOfEscape?.done ? 1 : 0);

                                                const percent = Math.round((completed / total) * 100);

                                                return (
                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                                                            <span>Builder Progress</span>
                                                            <span>{completed}/{total} requirements</span>
                                                        </div>
                                                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>
                            )}
                            <div
                                className="space-y-3 cursor-pointer"
                                onClick={() => {
                                    if (recommended.type === "guide" && recommended.slug) {
                                        navigate(`/${recommended.slug}`);
                                        return;
                                    }
                                    if (recommended.type === "lab" && recommendedLabSlug) {
                                        navigate(`/labs/${recommendedLabSlug}`);
                                        return;
                                    }
                                    if (recommended.type === "lesson" && recommended.slug) {
                                        navigate(`/lessons/${recommended.slug}`);
                                        return;
                                    }
                                    navigate("/education");
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {isFallbackRecommendation ? "Start Here" : "Recommended for you"}
                                    </p>

                                    {isBuilderRequired && (
                                        <span className="
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        ">
                                            🏗 Builder Path
                                        </span>
                                    )}

                                    {isBuilderRequired && (
                                        <span className="
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        ">
                                            Final Builder Requirement
                                        </span>
                                    )}
                                </div>

                                <p className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                                    {typeof recommended.title === "object"
                                        ? recommended.title.en || recommended.title.gr
                                        : recommended.title}
                                </p>

                                {recommended.why && (
                                    <div className="mt-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1">
                                            {isFallbackRecommendation ? "Suggested next step" : "Why this is recommended"}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                            {typeof recommended.why === "object"
                                                ? recommended.why.en || recommended.why.gr
                                                : recommended.why}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {recommended.estimatedTime && (
                                        <span>⏱ {recommended.estimatedTime} min</span>
                                    )}
                                    {recommended.xp && <span>🏅 +{recommended.xp} XP</span>}
                                </div>

                                <div className="pt-2">
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                        Continue →
                                    </span>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>
                )}

                {/* Full-width Learning Timeline */}
                <div className="relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0">
                    <LearningTimeline timeline={metadata?.timeline || []} />
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
                                Tier Benefits
                            </h2>
                            <ul className="text-white/80 text-sm space-y-2">
                                <li>🟣 Explorer — Basic access, community role, progress tracking</li>
                                <li>🔵 Builder — Unlock advanced lessons, early DAO proposals</li>
                                <li>
                                    🟡 Architect — Full DAO access, beta features, priority badges
                                </li>
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
            </div>
        </PageShell>
    );
}
