import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function VerifyIdentityGR() {
    const { address } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!address) {
            setError("Μη έγκυρη διεύθυνση.");
            setLoading(false);
            return;
        }

        const BACKEND =
            import.meta.env.VITE_BACKEND_URL ??
            "https://web3edu-api.dimikog.org";

        setLoading(true);
        setError("");

        const fetchJson = async url => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        };

        Promise.allSettled([
            fetchJson(`${BACKEND}/web3sbt/verify/${address}`),
            fetchJson(`${BACKEND}/web3sbt/resolve/${address}`)
        ])
            .then(([verifyResult, resolveResult]) => {
                const verifyData =
                    verifyResult.status === "fulfilled" ? verifyResult.value : null;
                const resolveData =
                    resolveResult.status === "fulfilled" ? resolveResult.value : null;

                if (!verifyData && !resolveData) {
                    throw new Error("Both verify and resolve failed.");
                }

                const extractMeta = data =>
                    data?.metadata?.metadata && typeof data.metadata.metadata === "object"
                        ? data.metadata.metadata
                        : data?.metadata && typeof data.metadata === "object"
                            ? data.metadata
                            : {};

                const extractInfo = data =>
                    data?.profile?.metadata && typeof data.profile.metadata === "object"
                        ? data.profile.metadata
                        : data?.profile && typeof data.profile === "object"
                            ? data.profile
                            : {};

                const merged = {
                    ...(verifyData || {}),
                    ...(resolveData || {}),
                    metadata: {
                        ...extractMeta(verifyData),
                        ...extractMeta(resolveData)
                    },
                    profile: {
                        ...extractInfo(verifyData),
                        ...extractInfo(resolveData)
                    },
                    tokenId:
                        verifyData?.tokenId ??
                        verifyData?.token_id ??
                        resolveData?.tokenId ??
                        resolveData?.token_id ??
                        null
                };

                setProfile(merged);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Verify page error:", err);
                setError("Αδυναμία φόρτωσης των δεδομένων SBT.");
                setLoading(false);
            });
    }, [address]);

    // Normalize nested payload shapes (verify endpoint can return metadata/profile wrappers)
    const rawMeta = profile?.metadata ?? {};
    const rawInfo = profile?.profile ?? {};
    const meta =
        rawMeta?.metadata && typeof rawMeta.metadata === "object"
            ? rawMeta.metadata
            : rawMeta;
    const info =
        rawInfo?.metadata && typeof rawInfo.metadata === "object"
            ? rawInfo.metadata
            : rawInfo;
    const pickFirst = (...values) => {
        for (const value of values) {
            if (value !== null && value !== undefined && value !== "") return value;
        }
        return null;
    };
    const toNumber = value => {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string") {
            const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ""));
            if (Number.isFinite(parsed)) return parsed;
        }
        return null;
    };

    // Founder/Edition logic
    const isFounder = (meta.founder ?? info.founder) || false;
    const edition = meta.edition ?? info.edition ?? (isFounder ? "Founder Edition" : null);

    const tier = meta.tier ?? info.tier ?? "Explorer";
    const totalXp = toNumber(
        pickFirst(
            meta.xp,
            meta.xp_total,
            meta.totalXp,
            meta.total_xp,
            info.xp,
            info.xp_total,
            info.totalXp,
            info.total_xp,
            profile?.xp,
            profile?.xp_total,
            profile?.totalXp,
            profile?.total_xp,
            profile?.metadata?.xp,
            profile?.metadata?.xp_total,
            profile?.metadata?.totalXp,
            profile?.metadata?.total_xp,
            profile?.profile?.xp,
            profile?.profile?.xp_total,
            profile?.profile?.totalXp,
            profile?.profile?.total_xp
        )
    ) ?? 0;
    const xpPercentRaw = toNumber(
        pickFirst(
            meta.xpPercent,
            meta.xp_percent,
            meta.progress,
            meta.progressPercent,
            meta.progress_percent,
            meta.nextTierPercent,
            meta.next_tier_percent,
            meta.completionPercent,
            meta.completion_percent,
            info.xpPercent,
            info.xp_percent,
            info.progress,
            info.progressPercent,
            info.progress_percent,
            info.nextTierPercent,
            info.next_tier_percent,
            info.completionPercent,
            info.completion_percent,
            profile?.xpPercent,
            profile?.xp_percent,
            profile?.progress,
            profile?.progressPercent,
            profile?.progress_percent,
            profile?.nextTierPercent,
            profile?.next_tier_percent,
            profile?.completionPercent,
            profile?.completion_percent
        )
    ) ?? 0;
    const remainingXp = toNumber(
        pickFirst(
            meta.remainingXp,
            meta.remaining_xp,
            info.remainingXp,
            info.remaining_xp,
            profile?.remainingXp,
            profile?.remaining_xp,
            profile?.metadata?.remainingXp,
            profile?.metadata?.remaining_xp
        )
    );
    const xpPercentNormalized =
        xpPercentRaw > 0 && xpPercentRaw <= 1 ? xpPercentRaw * 100 : xpPercentRaw;
    let xpPercent = Math.max(0, Math.min(100, xpPercentNormalized));
    if (xpPercent <= 0 && totalXp > 0) {
        if (remainingXp !== null && remainingXp >= 0) {
            xpPercent = Math.max(1, Math.min(100, (totalXp / (totalXp + remainingXp)) * 100));
        } else {
            // Fallback when backend omits percentage fields.
            xpPercent = Math.max(1, Math.min(100, (totalXp / 6000) * 100));
            if (tier === "Architect") xpPercent = Math.max(xpPercent, 85);
        }
    }
    // Visual progress should move clearly with total XP, not only within current tier.
    const overallXpPercent = Math.max(0, Math.min(100, (totalXp / 7000) * 100));
    const xpBarPercent = Math.max(xpPercent, overallXpPercent);
    const timeline = pickFirst(
        meta.timeline,
        info.timeline,
        profile?.timeline,
        profile?.metadata?.timeline,
        profile?.profile?.timeline
    );
    const derivedLessonsFromTimeline = Array.isArray(timeline)
        ? timeline.filter(item => {
            const status = String(item?.status || "").toLowerCase();
            const progress = toNumber(item?.progress) ?? 0;
            return (
                item?.type === "lab" &&
                (
                    item?.completed === true ||
                    item?.done === true ||
                    item?.verified === true ||
                    !!item?.completedAt ||
                    ["completed", "done", "claimed", "verified"].includes(status) ||
                    progress >= 100
                )
            );
        }).length
        : null;
    const builderChecklist = pickFirst(
        meta.builderChecklist,
        info.builderChecklist,
        profile?.builderChecklist,
        profile?.metadata?.builderChecklist
    );
    const derivedLessonsFromChecklist = builderChecklist
        ? (
            (toNumber(builderChecklist?.coreLabs?.completed) ?? 0) +
            (toNumber(builderChecklist?.daoLabs?.completed) ?? 0) +
            ((builderChecklist?.proofOfEscape?.done || builderChecklist?.proofOfEscape?.completed) ? 1 : 0)
        )
        : null;
    const lessonsCompleted = toNumber(
        pickFirst(
            meta.lessonsCompleted,
            meta.lessons_completed,
            meta.completedLessons,
            meta.completed_lessons,
            info.lessonsCompleted,
            info.lessons_completed,
            info.completedLessons,
            info.completed_lessons,
            profile?.lessonsCompleted,
            profile?.lessons_completed,
            profile?.completedLessons,
            profile?.completed_lessons,
            profile?.metadata?.lessonsCompleted,
            profile?.metadata?.lessons_completed,
            profile?.profile?.lessonsCompleted,
            profile?.profile?.lessons_completed,
            derivedLessonsFromChecklist,
            derivedLessonsFromTimeline
        )
    ) ?? 0;
    // The verification URL is always the current page URL (public verification link)
    const verifyUrl = window.location.href;

    const tokenId = profile?.tokenId ?? null;

    const shortAddr = address ? shortAddress(address) : "";

    return (
        <PageShell>
            <div
                className="
        min-h-screen 
        flex flex-col items-center 
        px-4 sm:px-6 py-20
        relative

        /* OFFICIAL WEB3EDU LIGHT GRADIENT */
        bg-gradient-to-br 
            from-[#f5f0ff]
            via-[#f0f3ff]
            to-[#eaf1ff]
        text-[#1e1e2d]

        /* OFFICIAL WEB3EDU DARK GRADIENT */
        dark:bg-gradient-to-br
            dark:from-[#070b18]
            dark:via-[#0b0f22]
            dark:to-[#060912]
        dark:text-white

        transition-colors duration-300
    "
            >

                <div className="absolute top-0 left-0 w-full text-center py-2 bg-blue-900/40 text-[#e1e8ff] text-xs tracking-widest z-20 border-b border-blue-700/40">ΛΕΙΤΟΥΡΓΙΑ ΕΠΑΛΗΘΕΥΣΗΣ</div>

                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/15 blur-[180px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/12 blur-[160px] rounded-full"></div>
                </div>

                {/* Title */}
                <div className="relative z-10 mb-10 text-center max-w-3xl">

                    {/* Soft identity strip */}
                    <div className="
        absolute inset-0 
        bg-white/50 dark:bg-white/5 
        backdrop-blur-sm 
        rounded-2xl 
        -z-10 
    " />

                    <h1 className="
    text-4xl sm:text-5xl 
    font-extrabold 
    tracking-tight 
    text-[#6f31d7]               /* Web3Edu purple */
    dark:text-[#9f80ff]          /* Softer purple in dark */
    drop-shadow-sm
">
                        Επαλήθευση Ταυτότητας Web3Edu
                    </h1>

                    <p className="
        mt-3 
        text-[#4a4a63] dark:text-slate-300
        text-sm sm:text-base 
        tracking-wide
    ">
                        Δημόσια επαλήθευση ενός Soulbound Web3Edu Identity Token.
                    </p>
                </div>

                {/* Status */}
                {loading && (
                    <p className="relative z-10 text-slate-600 dark:text-slate-200">
                        Φόρτωση ταυτότητας…
                    </p>
                )}

                {error && !loading && (
                    <p className="relative z-10 text-red-500 dark:text-red-300">
                        {error}
                    </p>
                )}

                {/* Identity Card */}
                {!loading && !error && profile && (
                    <div
                        className="
        relative z-10 max-w-5xl w-full
        print:p-0 print:shadow-none print:bg-white print:text-black print:border-none
        rounded-3xl border border-white/60 bg-white/95
        shadow-[0_24px_60px_rgba(15,23,42,0.30)] hover:shadow-[0_28px_80px_rgba(15,23,42,0.38)] transition-shadow duration-300
        animate-[fadeIn_0.6s_ease]
        dark:border-teal-200/25
        dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]
        p-4 sm:p-6 md:p-10
        overflow-hidden
    "
                    >
                        {/* MOBILE PASSPORT CARD */}
                        <div className="relative md:hidden block rounded-xl border border-white/20 bg-[#0e1422] p-4 mx-auto w-full shadow-lg">
                            <div className="absolute top-2 right-2 w-10 h-10 opacity-70 pointer-events-none">
                                <svg viewBox="0 0 120 120" className="w-full h-full">
                                    <defs>
                                        <radialGradient id="mSealInner" cx="50%" cy="35%" r="60%">
                                            <stop offset="0%" stopColor="#e5f4ff" stopOpacity="0.95" />
                                            <stop offset="45%" stopColor="#1f2937" stopOpacity="0.9" />
                                            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                                        </radialGradient>
                                        <linearGradient id="mSealRing" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#38bdf8" />
                                            <stop offset="45%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#fbbf24" />
                                        </linearGradient>
                                        <path
                                            id="mSealCirclePath"
                                            d="M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"
                                        />
                                    </defs>
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="52"
                                        fill="none"
                                        stroke="url(#mSealRing)"
                                        strokeWidth="4"
                                        strokeDasharray="2 5"
                                        opacity="0.9"
                                    />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="40"
                                        fill="url(#mSealInner)"
                                        stroke="rgba(255,255,255,0.28)"
                                        strokeWidth="1.5"
                                    />
                                    <text fontSize="6" letterSpacing="6" fill="rgba(0,0,0,0.55)">
                                        <textPath href="#mSealCirclePath" startOffset="50%" textAnchor="middle">
                                            ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •
                                        </textPath>
                                    </text>
                                    <g transform="translate(60 60)">
                                        <path
                                            d="M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z"
                                            fill="#38bdf8"
                                            opacity="0.96"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={generateAvatarStyle(address, tier)}
                                >
                                    <AddressIdenticon address={address} />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">
                                        Ταυτότητα Soulbound
                                    </p>
                                    <p className="text-base font-semibold text-white">
                                        {info?.name ?? "Ταυτότητα Web3Edu"}
                                    </p>
                                    <p className="text-[10px] text-white/50 font-mono">{shortAddr}</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Επίπεδο</p>
                                <p className="text-sm font-semibold flex items-center gap-1">
                                    {tier === "Explorer" && <ExplorerIcon />}
                                    {tier === "Builder" && <BuilderIcon />}
                                    {tier === "Architect" && <ArchitectIcon />}
                                    {tier}
                                </p>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Πρόοδος XP</p>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"
                                        style={{ width: `${xpBarPercent}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Token ID</p>
                                <p className="text-xs font-mono">{tokenId !== null ? tokenId : "Κανένα"}</p>
                            </div>

                            <div className="mt-4">
                                {verifyUrl && (
                                    <>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                                verifyUrl
                                            )}&size=100x100`}
                                            alt="QR"
                                            className="rounded-lg border border-white/20 bg-white/5 p-1 mx-auto" loading="lazy" />
                                        <p className="text-center text-[10px] text-white/50 mt-2">
                                            Σάρωση για επαλήθευση
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP PASSPORT CARD */}
                        <div className="hidden md:block">
                            <div className="
    pointer-events-none absolute inset-0 flex items-center justify-center
    -translate-y-8
">
                                ΔΗΜΟΣΙΑ ΕΠΑΛΗΘΕΥΣΗ
                            </div>
                            {/* Holo stripe */}
                            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-20 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-40 blur-xl" />

                            {/* Header */}
                            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8
                max-w-3xl mx-auto w-full">
                                {/* Avatar + Basic Info */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className={
                                            "relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl " +
                                            (tier === "Architect"
                                                ? "animate-pulse"
                                                : tier === "Builder"
                                                    ? "ring-2 ring-[#33D6FF]/70"
                                                    : "ring-2 ring-[#7F3DF1]/60")
                                        }
                                        style={generateAvatarStyle(address, tier)}
                                    >
                                        <AddressIdenticon address={address} />

                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/40 flex items-center justify-center">
                                            {tier === "Explorer" && <ExplorerIcon />}
                                            {tier === "Builder" && <BuilderIcon />}
                                            {tier === "Architect" && <ArchitectIcon />}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-white/50">
                                            Ταυτότητα Soulbound
                                        </p>

                                        <p className="text-xl font-semibold mt-1 text-slate-900 dark:text-white">
                                            {info.name ?? "Web3Edu Identity SBT"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
                                            Διεύθυνση: <span className="font-mono">{shortAddr}</span>
                                        </p>
                                        {edition && (
                                            <span
                                                className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold
                                                           bg-gradient-to-r from-[#7F3DF1] via-[#9A5CFF] to-[#FF6FD8]
                                                           text-white shadow-sm"
                                            >
                                                {edition}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Tier */}
                                {tier && (
                                    <div className="flex flex-col items-center md:items-end gap-2">
                                        <span
                                            className={
                                                "px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md " +
                                                (tier === "Architect"
                                                    ? "bg-amber-100/90 border-amber-300/70 dark:bg-yellow-300/20 dark:border-yellow-300/40"
                                                    : "bg-slate-100 border-slate-200 dark:bg-white/10 dark:border-white/20")
                                            }
                                        >
                                            {tier === "Explorer" && <ExplorerIcon />}
                                            {tier === "Builder" && <BuilderIcon />}
                                            {tier === "Architect" && <ArchitectIcon />}
                                            {tier}
                                        </span>

                                        <p className="text-xs text-slate-500 dark:text-white/60">
                                            XP: {totalXp} • Μαθήματα: {lessonsCompleted}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Main single-column layout */}
                            <div className="mt-6 relative">
                                <div className="
    relative rounded-3xl 
    border border-slate-300/30 
    bg-gradient-to-br
    max-w-4xl mx-auto w-full
    text-slate-800 dark:text-slate-200
    px-10 py-10 
    shadow-[0_18px_50px_rgba(15,23,42,0.45)]
">
                                    {/* Watermark — clean, top-aligned, visible in both themes */}
                                    <div
                                        className="
      pointer-events-none absolute inset-x-0 top-4
      flex items-center justify-center select-none
      text-[48px] font-extrabold tracking-widest
      text-[#7F3DF1]/15
      dark:text-[#7F3DF1]/12
  "
                                    >
                                        ΕΠΑΛΗΘΕΥΜΕΝΟ
                                    </div>

                                    {/* Two-column layout */}
                                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* LEFT SIDE — Details */}
                                        <div className="space-y-4 text-sm">
                                            <p className="font-semibold tracking-wide text-xs text-[#6f31d7] dark:text-[#bfa6ff] uppercase">
                                                ΣΤΟΙΧΕΙΑ ΤΑΥΤΟΤΗΤΑΣ
                                            </p>

                                            {/* Name */}
                                            <div>
                                                <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                    ΟΝΟΜΑ
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white text-2xl">
                                                    {info?.name ?? "Web3Edu Identity SBT"}
                                                </p>
                                            </div>

                                            {/* Token Standard */}
                                            <div>
                                                <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                    ΠΡΟΤΥΠΟ Token
                                                </p>
                                                <p className="font-medium text-base">ERC-721 SBT</p>
                                            </div>

                                            {/* Wallet */}
                                            <div>
                                                <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                    ΠΟΡΤΟΦΟΛΙ
                                                </p>
                                                <p className="font-mono text-xs break-all">{address}</p>
                                            </div>

                                            {/* Token ID */}
                                            <div>
                                                <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                    Token ID
                                                </p>
                                                <p className="font-mono text-sm">{tokenId ?? "Κανένα"}</p>
                                            </div>

                                            {/* Edition */}
                                            {edition && (
                                                <div>
                                                    <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                        ΕΚΔΟΣΗ
                                                    </p>
                                                    <p className="font-medium text-[#7F3DF1] dark:text-[#c4b2ff] text-base">
                                                        {edition}
                                                    </p>
                                                </div>
                                            )}

                                            {/* XP Bar */}
                                            <div>
                                                <p className="text-sm font-semibold uppercase text-slate-600 dark:text-slate-300mb-1">
                                                    ΠΡΟΟΔΟΣ XP
                                                </p>
                                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"
                                                        style={{ width: `${xpBarPercent}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm mt-1">
                                                    {totalXp} XP
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE — Seal + QR (Stylized Offset) */}
                                        <div className="relative z-10 flex flex-col items-center gap-6 mt-2 pt-4">
                                            {/* Seal */}
                                            <div
                                                className="
        w-48 h-48 flex items-center justify-center
        drop-shadow-[0_8px_25px_rgba(127,61,241,0.28)]
        transition-transform duration-300 
        hover:scale-[1.04]
    "
                                            >
                                                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
                                                    <defs>
                                                        <radialGradient id="sealInner" cx="50%" cy="35%" r="60%">
                                                            <stop offset="0%" stopColor="#e5f4ff" stopOpacity="0.95" />
                                                            <stop offset="45%" stopColor="#1f2937" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                                                        </radialGradient>

                                                        <linearGradient id="sealRing" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#38bdf8" />
                                                            <stop offset="45%" stopColor="#6366f1" />
                                                            <stop offset="100%" stopColor="#fbbf24" />
                                                        </linearGradient>

                                                        <path
                                                            id="sealCirclePath"
                                                            d="M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"
                                                        />
                                                    </defs>

                                                    {/* Outer ring */}
                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r="52"
                                                        fill="none"
                                                        stroke="url(#sealRing)"
                                                        strokeWidth="4"
                                                        strokeDasharray="2 5"
                                                        opacity="0.9"
                                                    />

                                                    {/* Inner fill */}
                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r="40"
                                                        fill="url(#sealInner)"
                                                        stroke="rgba(255,255,255,0.28)"
                                                        strokeWidth="1.5"
                                                    />

                                                    {/* Circular text */}
                                                    <text fontSize="6" letterSpacing="6" fill="rgba(0,0,0,0.45)">
                                                        <textPath href="#sealCirclePath" startOffset="50%" textAnchor="middle">
                                                            ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •
                                                        </textPath>
                                                    </text>

                                                    {/* Shield */}
                                                    <g transform="translate(60 60)">
                                                        <path
                                                            d="M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z"
                                                            fill="#38bdf8"
                                                            opacity="0.95"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>

                                            {/* QR (lowered slightly, premium styling) */}
                                            {verifyUrl && (
                                                <div className="flex flex-col items-center mt-4 space-y-3">
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                                            verifyUrl
                                                        )}&size=120x120`}
                                                        alt="QR"
                                                        className="
                    rounded-2xl 
                    border border-slate-300/40 dark:border-white/10 
                    bg-white/90 dark:bg-white/5 
                    p-4 
                    shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                    backdrop-blur-md
                    transition-transform duration-300 
                    hover:scale-[1.06] hover:brightness-110
                " loading="lazy" />

                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center">
                                                        Εκδόθηκε στο Web3Edu Edu-Net
                                                        <br />
                                                        ως Soulbound Token
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Information */}
                                    <div className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 tracking-wide">
                                        <p>Επαληθεύτηκε στις: {new Date().toISOString()}</p>
                                        <p>Δίκτυο: Web3Edu Edu-Net (424242)</p>
                                        <p>Συμβόλαιο: 0xdDE6A59445538eA146a17Dd8745e7eA5288b1a31</p>
                                    </div>

                                    {/* Print Button */}
                                    <div className="mt-4 flex justify-center print:hidden">
                                        <button
                                            onClick={() => window.print()}
                                            className="
                                        px-4 py-2 text-xs rounded-lg
                                        bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]
                                        text-white font-medium
                                        shadow-lg hover:shadow-xl hover:brightness-110
                                        transition
                                        active:scale-95 transition-transform
                                    "
                                        >
                                            Εκτύπωση Επαλήθευσης
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </PageShell >
    );
}
