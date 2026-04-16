import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useIdentity } from "../context/IdentityContext.jsx";
import PageShell from "../components/PageShell.jsx";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.webp";
import {
    buildLabsStatusUrl,
    buildResolveOwner,
    getWeb3eduBackendUrl,
} from "../lib/web3eduBackend.js";
import { LABS_LOCALES } from "../content/labsPageLocale.js";

const BACKEND = getWeb3eduBackendUrl();

const CORE_LAB_IDS = ["lab01", "lab02", "lab03", "lab04", "lab05", "lab06"];

const CARD_ACCENT = {
    foundational: "bg-blue-500/10 border-blue-400/20 dark:bg-blue-500/20 dark:border-blue-400/30",
    coding:       "bg-fuchsia-500/10 border-fuchsia-400/20 dark:bg-fuchsia-500/20 dark:border-fuchsia-400/30",
    system:       "bg-indigo-500/10 border-indigo-400/20 dark:bg-indigo-500/20 dark:border-indigo-400/30",
    dao:          "bg-green-500/10 border-green-400/20 dark:bg-green-500/20 dark:border-green-400/30",
    project:      "bg-orange-500/10 border-orange-400/20 dark:bg-orange-500/20 dark:border-orange-400/30",
};

const CATEGORY_BADGE = {
    foundational: "bg-blue-500/10 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20",
    coding:       "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 dark:bg-fuchsia-500/20",
    system:       "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-500/20",
    dao:          "bg-green-500/10 text-green-700 dark:text-green-300 dark:bg-green-500/20",
    project:      "bg-orange-500/10 text-orange-700 dark:text-orange-300 dark:bg-orange-500/20",
};

function buildLabRoutes(prefix) {
    return {
        lab01: `${prefix}/wallets-keys`,
        lab02: `${prefix}/lab02`,
        lab03: `${prefix}/lab03`,
        lab04: `${prefix}/lab04`,
        lab05: `${prefix}/lab05`,
        lab06: `${prefix}/lab06`,
        coding01: `${prefix}/coding-01`,
        dao01: `${prefix}/dao-01`,
        dao02: `${prefix}/dao-02`,
        "system-s0": `${prefix}/system/s0`,
        "system-s1": `${prefix}/system/s1`,
        "system-s2": `${prefix}/system/s2`,
        "system-s3": `${prefix}/system/s3`,
        "system-s4": `${prefix}/system/s4`,
        "system-s5": `${prefix}/system/s5`,
    };
}

function pickLang(lab, field, lang) {
    if (!lab?.[field]) return undefined;
    const v = lab[field];
    if (typeof v === "string") return v;
    if (lang === "gr") return v.gr ?? v.en;
    return v.en ?? v.gr;
}

function pickBadge(lab, lang) {
    const b = lab?.badge;
    if (!b) return undefined;
    if (typeof b === "string") return b;
    if (b.label && typeof b.label === "object") {
        if (lang === "gr") return b.label.gr ?? b.label.en ?? b.label;
        return b.label.en ?? b.label.gr ?? b.label;
    }
    return b.label ?? b.id;
}

function foundationalCompletedClass(lang) {
    if (lang === "gr") {
        return "inline-flex max-w-[132px] shrink-0 items-center justify-center gap-1 rounded-full border border-green-400/20 bg-green-500 px-2.5 py-1 text-[10px] font-semibold leading-tight text-center text-white shadow";
    }
    return "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-green-400/20 bg-green-500 px-2 py-0.5 text-[10px] font-semibold leading-none text-white shadow";
}

function completedMdClass(lang) {
    if (lang === "gr") {
        return "inline-flex max-w-[132px] shrink-0 self-start items-center justify-center rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold leading-tight text-center text-white shadow";
    }
    return "inline-flex shrink-0 self-start rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow";
}

function otherSectionCompletedClass(lang) {
    if (lang === "gr") {
        return "inline-flex max-w-[132px] shrink-0 items-center justify-center rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold leading-tight text-center text-white shadow";
    }
    return "inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow";
}

const sortLabs = (labs) =>
    [...labs].sort((a, b) => {
        const orderDiff = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
        if (orderDiff !== 0) return orderDiff;
        return String(a.id).localeCompare(String(b.id));
    });

export default function Labs({ lang = "en" }) {
    const { smartAccount, owner: identityOwner } = useIdentity();
    const { address } = useAccount();
    const identityAddress = smartAccount ?? null;
    const resolveOwner = useMemo(
        () => buildResolveOwner(address, identityOwner),
        [address, identityOwner]
    );
    const L = lang === "gr" ? LABS_LOCALES.gr : LABS_LOCALES.en;
    const labRoutes = useMemo(() => buildLabRoutes(L.pathPrefix), [L.pathPrefix]);
    const [labsRegistry, setLabsRegistry] = useState([]);
    const [completionMap, setCompletionMap] = useState({});
    const [poeCompleted, setPoeCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [, setStatusLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        fetch(`${BACKEND}/labs`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const items = Object.entries(data || {}).map(([id, lab]) => ({
                    id,
                    ...lab,
                }));
                setLabsRegistry(sortLabs(items.filter((lab) => lab.active !== false)));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Failed to load labs registry", err);
                    setLabsRegistry([]);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (labsRegistry.length === 0) {
            setCompletionMap({});
            return;
        }

        if (!identityAddress) {
            return;
        }

        const controller = new AbortController();
        setStatusLoading(true);

        // eslint-disable-next-line no-console -- AA / backend integration debug
        console.log("API CALL", { identityAddress, resolveOwner });

        Promise.all(
            labsRegistry.map(async (lab) => {
                const res = await fetch(
                    buildLabsStatusUrl(identityAddress, lab.id, resolveOwner),
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                return [lab.id, Boolean(data?.completed)];
            })
        )
            .then((entries) => {
                setCompletionMap(Object.fromEntries(entries));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Failed to load lab completion statuses", err);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setStatusLoading(false);
                }
            });

        return () => controller.abort();
    }, [identityAddress, resolveOwner, labsRegistry]);

    useEffect(() => {
        if (!identityAddress) {
            return;
        }

        const controller = new AbortController();

        const poeParams = new URLSearchParams({ address: identityAddress });
        if (resolveOwner) {
            poeParams.set("owner", resolveOwner);
        }

        fetch(`${BACKEND}/projects/poe/status?${poeParams.toString()}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setPoeCompleted(Boolean(data?.completed));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Failed to load Proof of Escape status", err);
                }
            });

        return () => controller.abort();
    }, [identityAddress, resolveOwner]);

    const groupedLabs = useMemo(() => {
        const groups = new Map();
        for (const lab of labsRegistry) {
            const category = lab.category || "other";
            if (!groups.has(category)) groups.set(category, []);
            groups.get(category).push(lab);
        }
        return [...groups.entries()];
    }, [labsRegistry]);

    const foundationalLabs = labsRegistry.filter(
        (lab) => lab.category === "foundational" && CORE_LAB_IDS.includes(lab.id)
    );
    const featuredLab = foundationalLabs.find((lab) => lab.id === "lab01") || null;
    const remainingFoundationalLabs = foundationalLabs.filter((lab) => lab.id !== "lab01");
    const daoLabs = labsRegistry.filter((lab) => lab.category === "dao");
    const systemLabs = labsRegistry.filter((lab) => lab.category === "system");
    const displayedSystemLabs = L.systemLabs.map((fallbackLab) => {
        const backendLab = systemLabs.find((lab) => lab.id === fallbackLab.id);
        return {
            id: fallbackLab.id,
            title:
                fallbackLab.title ||
                pickLang(backendLab, "title", lang) ||
                fallbackLab.id,
            hint: fallbackLab.hint || null,
            description:
                pickLang(backendLab, "description", lang) || fallbackLab.description,
            level: backendLab?.level || fallbackLab.level,
            xp: typeof backendLab?.xp === "number" ? backendLab.xp : fallbackLab.xp,
            link: labRoutes[fallbackLab.id],
            cta: fallbackLab.cta,
            status: completionMap[fallbackLab.id]
                ? L.ui.statusCompleted
                : L.ui.statusAvailable,
            completed: Boolean(completionMap[fallbackLab.id]),
            badge:
                pickBadge(backendLab, lang) || fallbackLab.badge,
        };
    });
    const otherSections = groupedLabs.filter(
        ([category]) => category !== "foundational" && category !== "dao" && category !== "project" && category !== "system"
    );

    const completedCount = foundationalLabs.filter((lab) => Boolean(completionMap[lab.id])).length;
    const totalCount = CORE_LAB_IDS.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <PageShell title="Web3Edu Labs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        {L.ui.heroTitle}
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                        {L.ui.heroSubtitle}
                    </p>
                </header>

                {loading ? (
                    <p className="text-slate-600 dark:text-slate-300">{L.ui.loadingLabs}</p>
                ) : groupedLabs.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-300">
                        {L.ui.emptyRegistry}
                    </p>
                ) : (
                    <div className="space-y-14">
                        {foundationalLabs.length > 0 ? (
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">{L.ui.foundationalSectionTitle}</h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        {L.ui.foundationalSectionBlurb}
                                    </p>
                                </div>

                                <div className="mb-10 max-w-xl">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <span>{L.ui.progressLabel}</span>
                                        <span>{completedCount} / {totalCount} {L.ui.progressCountSuffix}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {featuredLab ? (
                                    <div className="mb-10">
                                        <Link
                                            to={labRoutes[featuredLab.id] || `${L.pathPrefix}/${featuredLab.slug || featuredLab.id}`}
                                            className="group relative block overflow-hidden rounded-2xl backdrop-blur-sm bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-blue-50/90 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all"
                                        >
                                            {completionMap[featuredLab.id] ? (
                                                <div className="absolute top-4 right-4 z-20">
                                                    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-semibold leading-none text-white shadow-lg backdrop-blur">
                                                        {L.ui.completedBadge}
                                                    </span>
                                                </div>
                                            ) : null}
                                            <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] min-h-[420px]">
                                                <div className="relative flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-6 lg:p-8">
                                                    <img
                                                        src={lab01IdentityImg}
                                                        alt={L.ui.featuredLabAlt}
                                                        className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/30"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-10 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-indigo-300">
                                                            {pickLang(featuredLab, "title", lang) || L.ui.featuredDefaultTitle}
                                                        </h3>
                                                        <p className="text-xs italic text-slate-600/90 dark:text-slate-300/80 mb-4">
                                                            {L.ui.pedagogyHintLabel} {L.ui.featuredPedagogy}
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                            {pickLang(featuredLab, "description", lang)}
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <span>🧭 <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaLevel}</strong> {featuredLab.level || "Beginner"}</span>
                                                            <span>⏱️ <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaTime}</strong> {featuredLab.estimated_time_minutes || "15-20"} {L.ui.metaTimeUnit}</span>
                                                            <span>🌐 <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaNetwork}</strong> Besu Edu-Net</span>
                                                            <span>🚫 <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaTransactions}</strong> {L.ui.metaTransactionsNone}</span>
                                                            <span>🛠️ <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaTools}</strong> {L.ui.metaToolsCount}</span>
                                                            <span>🏅 <strong className="font-semibold text-slate-700 dark:text-slate-200">{L.ui.metaBadge}</strong> {pickBadge(featuredLab, lang) || L.ui.defaultBadge}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex items-center justify-between">
                                                        <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition">
                                                            {L.ui.startLabCta}
                                                        </span>
                                                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                                                            +{featuredLab.xp || 100} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ) : null}

                                {remainingFoundationalLabs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {remainingFoundationalLabs.map((lab) => {
                                            const completed = Boolean(completionMap[lab.id]);
                                            const copy = L.foundationalCopy[lab.id] || {};
                                            const title = copy.title || pickLang(lab, "title", lang) || lab.id;
                                            const description = copy.description || pickLang(lab, "description", lang) || "";
                                            const hint = copy.hint || null;
                                            const badge = pickBadge(lab, lang);
                                            const link = labRoutes[lab.id] || `${L.pathPrefix}/${lab.slug || lab.id}`;
                                            const showNext =
                                                lab.id === "lab02" &&
                                                !!completionMap.lab01 &&
                                                !completionMap.lab02;

                                            return (
                                                <Link
                                                    key={lab.id}
                                                    to={link}
                                                    className={`group rounded-2xl border ${CARD_ACCENT.foundational} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                                >
                                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.foundational}`}>
                                                        {L.categoryBadgeLabel.foundational}
                                                    </span>
                                                    <div className="flex items-start justify-between gap-3 mb-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                                {lab.id}
                                                            </p>
                                                            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                                {title}
                                                            </h3>
                                                        </div>
                                                        {completed ? (
                                                            <span className={foundationalCompletedClass(lang)}>
                                                                {L.ui.completedBadge}
                                                            </span>
                                                        ) : null}
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                {L.ui.nextBadge}
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    {hint ? (
                                                        <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                            {L.ui.pedagogyHintLabel} <span className="not-italic">{hint}</span>
                                                        </p>
                                                    ) : null}
                                                    <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                                        {description}
                                                    </p>

                                                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                                        {lab.level ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {lab.level}
                                                            </span>
                                                        ) : null}
                                                        {lab.estimated_time_minutes ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {lab.estimated_time_minutes} {L.ui.timeMinShort}
                                                            </span>
                                                        ) : null}
                                                        {typeof lab.xp === "number" ? (
                                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-indigo-700 dark:text-indigo-300">
                                                                +{lab.xp} XP
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    {badge ? (
                                                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                            {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                        </p>
                                                    ) : null}

                                                    <div className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                        {L.ui.openLabCta}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </section>
                        ) : null}

                        <section>
                            <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">{L.ui.codingSectionTitle}</h2>
                                <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                    {L.ui.codingSectionBlurb}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {L.codingLabs.map((lab) => (
                                    <div
                                        key={lab.id}
                                        className={`rounded-2xl border ${CARD_ACCENT.coding} p-6 shadow-sm`}
                                    >
                                        <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.coding}`}>
                                            {L.categoryBadgeLabel.coding}
                                        </span>
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                    {lab.id}
                                                </p>
                                                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                    {lab.title}
                                                </h3>
                                            </div>
                                            <span className="inline-flex shrink-0 self-start rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-900 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-200">
                                                {L.ui.comingSoon}
                                            </span>
                                        </div>

                                        <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                            {L.ui.pedagogyHintLabel} <span className="not-italic">{lab.hint}</span>
                                        </p>

                                        <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                            {lab.description}
                                        </p>

                                        {lab.badge ? (
                                            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{lab.badge}</span>
                                            </p>
                                        ) : null}

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                            <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                                {lab.level}
                                            </span>
                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                +{lab.xp} XP
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">{L.ui.systemSectionTitle}</h2>
                                <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                    {L.ui.systemSectionBlurb}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {displayedSystemLabs.map((lab) => (
                                    <Link
                                        key={lab.id}
                                        to={lab.link}
                                        className={`group flex h-full flex-col rounded-2xl border ${CARD_ACCENT.system} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                    >
                                        <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.system}`}>
                                            {L.categoryBadgeLabel.system}
                                        </span>
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                    {lab.id}
                                                </p>
                                                <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
                                                    {lab.title}
                                                </h3>
                                            </div>
                                            {lab.completed ? (
                                                <span className={completedMdClass(lang)}>
                                                    {L.ui.completedBadge}
                                                </span>
                                            ) : null}
                                        </div>

                                        {lab.hint ? (
                                            <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                {L.ui.pedagogyHintLabel} <span className="not-italic">{lab.hint}</span>
                                            </p>
                                        ) : null}

                                        <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                            {lab.description}
                                        </p>

                                        {lab.badge ? (
                                            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{lab.badge}</span>
                                            </p>
                                        ) : null}

                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                                            <span className="rounded-lg bg-slate-200/80 px-3 py-1 text-sm text-slate-700 capitalize dark:bg-slate-800 dark:text-slate-200">
                                                {lab.level}
                                            </span>
                                            <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-900/35 dark:text-indigo-300">
                                                    +{lab.xp} XP
                                                </span>
                                                <span className="text-sm font-semibold text-indigo-600 transition-transform group-hover:translate-x-1 dark:text-indigo-300">
                                                    {lab.cta}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {daoLabs.length > 0 ? (
                            <section>
                                <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">{L.ui.daoSectionTitle}</h2>
                                    <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                        {L.ui.daoSectionBlurb}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {daoLabs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const showNext =
                                            lab.id === "dao02" &&
                                            !!completionMap.dao01 &&
                                            !completionMap.dao02;
                                        const copy = L.daoCopy[lab.id] || {};
                                        const title = copy.title || pickLang(lab, "title", lang) || lab.id;
                                        const hint = copy.hint || null;
                                        const description = copy.description || pickLang(lab, "description", lang) || "";
                                        const badge = pickBadge(lab, lang) || copy.badge;
                                        const link = labRoutes[lab.id] || `${L.pathPrefix}/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className={`group rounded-2xl border ${CARD_ACCENT.dao} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                            >
                                                <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.dao}`}>
                                                    {L.categoryBadgeLabel.dao}
                                                </span>
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {completed ? (
                                                            <span className={completedMdClass(lang)}>
                                                                {L.ui.completedBadge}
                                                            </span>
                                                        ) : null}
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                {L.ui.nextBadge}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {hint ? (
                                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                        {L.ui.pedagogyHintLabel} <span className="not-italic">{hint}</span>
                                                    </p>
                                                ) : null}

                                                <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                                    {description}
                                                </p>

                                                {badge ? (
                                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                        {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                    </p>
                                                ) : null}

                                                <div className="mt-5 flex items-center justify-between gap-4">
                                                    <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                                        {copy.level || lab.level || L.ui.defaultDaoLevelFallback}
                                                    </span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                            +{lab.xp || 0} XP
                                                        </span>
                                                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                            {L.ui.openLabCta}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : null}

                        <section>
                            <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">{L.ui.appliedSectionTitle}</h2>
                                <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                    {L.ui.appliedSectionBlurb}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Link
                                    to={`${L.pathPrefix}/proof-of-escape`}
                                    className={`group rounded-2xl border ${CARD_ACCENT.project} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                >
                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.project}`}>
                                        {L.categoryBadgeLabel.project}
                                    </span>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {L.ui.proofOfEscapeTitle}
                                        </h3>
                                        {poeCompleted ? (
                                            <span className={completedMdClass(lang)}>
                                                {L.ui.completedBadge}
                                            </span>
                                        ) : null}
                                    </div>

                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                        {L.ui.pedagogyHintLabel} <span className="not-italic">{L.ui.proofOfEscapeHint}</span>
                                    </p>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        {L.ui.proofOfEscapeDescription}
                                    </p>

                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                        {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{L.ui.proofOfEscapeBadge}</span>
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            {L.ui.proofOfEscapeLevel}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                +500 XP
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                {L.ui.openLabCta}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className={`rounded-2xl border ${CARD_ACCENT.project} p-6 shadow-sm`}>
                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.project}`}>
                                        {L.categoryBadgeLabel.project}
                                    </span>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {L.ui.nftMarketplaceTitle}
                                        </h3>
                                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            {L.ui.nftComingSoonBadge}
                                        </span>
                                    </div>

                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                        {L.ui.pedagogyHintLabel} <span className="not-italic">{L.ui.nftMarketplaceHint}</span>
                                    </p>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        {L.ui.nftMarketplaceDescription}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            {L.ui.nftMarketplaceLevel}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {L.ui.nftComingSoonFooter}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {otherSections.map(([category, labs]) => (
                            <section key={category}>
                                <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">
                                        {L.categoryLabels[category] || category}
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        {L.categoryDescriptions[category] || L.ui.otherCategoryFallback}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {labs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const copy = L.projectCopy[lab.id] || L.projectCopy[lab.slug] || {};
                                        const title = copy.title || pickLang(lab, "title", lang) || lab.id;
                                        const hint = copy.hint || null;
                                        const description = copy.description || pickLang(lab, "description", lang) || "";
                                        const badge = pickBadge(lab, lang);
                                        const link = labRoutes[lab.id] || `${L.pathPrefix}/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className={`group rounded-2xl border ${CARD_ACCENT[category] || CARD_ACCENT.project} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                            >
                                                <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE[category] || CATEGORY_BADGE.project}`}>
                                                    {L.categoryBadgeLabel[category] || L.categoryBadgeLabel.project}
                                                </span>
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                            {lab.id}
                                                        </p>
                                                        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                            {title}
                                                        </h3>
                                                    </div>
                                                    {completed ? (
                                                        <span className={otherSectionCompletedClass(lang)}>
                                                            {L.ui.completedBadge}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {hint ? (
                                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                        {L.ui.pedagogyHintLabel} <span className="not-italic">{hint}</span>
                                                    </p>
                                                ) : null}

                                                <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                                    {description}
                                                </p>

                                                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                                        {copy.level || lab.level ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {copy.level || lab.level}
                                                            </span>
                                                        ) : null}
                                                    {lab.estimated_time_minutes ? (
                                                        <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                            {lab.estimated_time_minutes} {L.ui.timeMinShort}
                                                        </span>
                                                    ) : null}
                                                    {typeof lab.xp === "number" ? (
                                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-indigo-700 dark:text-indigo-300">
                                                            +{lab.xp} XP
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {badge ? (
                                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                        {L.ui.badgePrefix} <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                    </p>
                                                ) : null}

                                                <div className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                    {L.ui.openLabCta}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </PageShell>
    );
}
