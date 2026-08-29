import React from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import {
    buildLabsStatusUrl,
    getWeb3eduBackendUrl,
} from "../../lib/web3eduBackend.js";
import { getLabsStatusReadIdentity, postLabsStart } from "../../utils/labWriteApi.js";

const DEFAULT_LABELS = {
    breadcrumbLabs: "Labs",
    backToLabsLabel: "Back to all labs",
    overview: "",
    level: "Level",
    estimatedTime: "Estimated time",
    tools: "Tools used",
    prerequisites: "Prerequisites",
    xp: "XP",
    badgeLabel: "Badge",
    startLab: "Start Lab →",
    startLabHint: "Opens full step-by-step guide",
    startLabInteractionHint: "Opens interactive lab inside Web3Edu",
    conceptualFocus: "Conceptual focus",
    heroCaption: "Web3 identity emerges from cryptographic wallets and network context",
    headerPill: "🧪 Web3Edu · Foundational Lab",
    completedBadge: "✓ Completed",
    checkingStatus: "Checking completion status…",
    completedOn: "Completed on:",

    // Completion / Claim section
    completionTitle: "Lab completion",
    completionDescription:
        "After completing the lab, record your completion to update your progress in Web3Edu.",
    successMessage: "✔ Completion recorded successfully",
    completeInsideInteraction: "Complete the interaction and claim completion there.",
    walletNotConnectedError: "Wallet not connected",
    labIdMissingError: "Lab ID missing",
    backendError: "Failed to record completion",
};

const LabTemplate = ({
    labId,
    title = "Lab 01 — Wallets & Web3 Identity",
    subtitle = "Understand wallets, addresses, and identity before transactions",
    heroImage = null,
    level = "Beginner",
    estimatedTime = "30–40 minutes",
    xp = null,
    badge = null,
    tools = [
        "Network Identifier",
        "Address Anatomy",
        "Identity Scope Visualizer",
    ],
    prerequisites = [
        "Modern browser (Chrome / Firefox / Brave)",
        "Browser wallet (MetaMask or equivalent)",
        "Besu Edu‑Net RPC details",
    ],
    interactionPath = null,
    readmeUrl = "https://github.com/dimikog/web3edu-labs/blob/main/lab-01-wallets-identity/README.md",
    setupGuidePath = null,
    setupGuideLabel = "Setup guide",
    labsOverviewPath = null,
    beforeStartSection = null,
    conceptualFocusText = "",
    labels = {},
}) => {

    const mergedLabels = { ...DEFAULT_LABELS, ...labels };

    const identityArgs = useEducationalIdentityArgs();
    const { identityAddress } = useMemo(
        () => getLabsStatusReadIdentity(identityArgs),
        [identityArgs]
    );
    const [claimed, setClaimed] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completedAt, setCompletedAt] = useState(null);

    const API_BASE = getWeb3eduBackendUrl();
    const manualStartGuardRef = useRef(null);

    const handleStartLab = useCallback(async () => {
        if (!labId || !identityAddress) return;
        const idToken =
            typeof identityArgs.idToken === "string" && identityArgs.idToken.trim()
                ? identityArgs.idToken.trim()
                : null;
        if (!idToken) return;

        const guardKey = `${String(labId)}:${identityAddress}`;
        if (manualStartGuardRef.current === guardKey) return;
        manualStartGuardRef.current = guardKey;

        try {
            const res = await postLabsStart({
                apiBase: API_BASE,
                labId,
                ...identityArgs,
                idToken,
            });
            if (!res.ok && res.status !== 204) {
                manualStartGuardRef.current = null;
            }
            if (res.status === 204) {
                manualStartGuardRef.current = null;
            }
        } catch (err) {
            manualStartGuardRef.current = null;
            // eslint-disable-next-line no-console -- non-fatal lab start telemetry
            console.warn("Failed to record lab start", err);
        }
    }, [API_BASE, identityAddress, identityArgs, labId]);

    useEffect(() => {
        if (!identityAddress || !labId) {
            setCheckingStatus(false);
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const checkCompletion = async () => {
            try {
                const res = await fetch(
                    buildLabsStatusUrl(identityAddress, labId, null),
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    if (!cancelled) setCheckingStatus(false);
                    return;
                }

                const data = await res.json();
                if (!cancelled && data.completed === true) {
                    setClaimed(true);
                    setCompletedAt(data.completedAt || null);
                }
            } catch (err) {
                if (cancelled || err?.name === "AbortError") return;
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console -- non-fatal status restore
                    console.warn("Failed to restore lab completion state", err);
                }
            } finally {
                if (!cancelled) setCheckingStatus(false);
            }
        };

        checkCompletion();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [identityAddress, labId]);

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    {labsOverviewPath ? (
                        <Link
                            to={labsOverviewPath}
                            className="font-medium text-indigo-600 transition hover:underline dark:text-indigo-300"
                        >
                            {mergedLabels.breadcrumbLabs}
                        </Link>
                    ) : (
                        <span className="cursor-default">{mergedLabels.breadcrumbLabs}</span>
                    )}
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-300">
                        {title}
                    </span>
                </nav>

                {labsOverviewPath ? (
                    <Link
                        to={labsOverviewPath}
                        className="mb-6 inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-1 dark:text-indigo-300"
                    >
                        {mergedLabels.backToLabsLabel}
                    </Link>
                ) : null}

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-indigo-100/70 dark:bg-indigo-900/40
                            text-sm font-semibold tracking-wide
                            text-indigo-700 dark:text-indigo-300"
                        >
                            {mergedLabels.headerPill}
                        </span>

                        {claimed && (
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                bg-green-100 dark:bg-green-900/40
                                text-sm font-semibold
                                text-green-700 dark:text-green-300
                                animate-in fade-in zoom-in-95 duration-300"
                            >
                                {mergedLabels.completedBadge}
                            </span>
                        )}
                    </div>

                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                        {subtitle}
                    </p>
                </header>

                <hr className="mb-10 border-slate-200/70 dark:border-slate-700/60" />

                {/* Hero image */}
                {heroImage && (
                    <div className="mb-12 rounded-3xl overflow-hidden
                        border border-slate-200/70 dark:border-slate-700/60
                        bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-blue-50/60
                        dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900
                        shadow-xl"
                    >
                        <div className="max-w-3xl mx-auto">
                            <img src={heroImage}
                                alt={`${title} visual overview`}
                                className="mx-auto max-w-3xl w-full h-auto object-contain
                                   drop-shadow-[0_20px_40px_rgba(80,60,200,0.35)]" loading="eager" fetchPriority="high" />
                            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                                {mergedLabels.heroCaption}
                            </p>
                        </div>
                    </div>
                )}

                {/* Overview */}
                <section
                    className="mb-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                    bg-slate-50/60 dark:bg-slate-900/40 p-6"
                >
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        🧠 <span className="font-semibold">{mergedLabels.conceptualFocus}:</span>{" "}
                        {conceptualFocusText}
                    </p>
                </section>

                {/* Meta info */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    <div
                        className="rounded-xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-5"
                    >
                        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            {mergedLabels.level}
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                            🧭 {level}
                        </div>
                    </div>
                    <div
                        className="rounded-xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-5"
                    >
                        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            {mergedLabels.estimatedTime}
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                            ⏱️ {estimatedTime}
                        </div>
                    </div>
                    {xp && (
                        <div
                            className="rounded-xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-5"
                        >
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                                {mergedLabels.xp}
                            </div>
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                                ⭐ {xp}
                            </div>
                        </div>
                    )}

                    {badge && (
                        <div
                            className="rounded-xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-5"
                        >
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                                {mergedLabels.badgeLabel}
                            </div>
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                                {badge}
                            </div>
                        </div>
                    )}
                </section>

                {/* Tools */}
                <section
                    className="mb-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                    bg-white/80 dark:bg-slate-900/60 p-6"
                >
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        {mergedLabels.tools}
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        {tools.map((tool) => (
                            <li key={tool} className="flex items-center gap-2">
                                🛠️ <span>{tool}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Prerequisites */}
                <section
                    className="mb-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                    bg-white/80 dark:bg-slate-900/60 p-6"
                >
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        {mergedLabels.prerequisites}
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        {prerequisites.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                ⚠️ <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {beforeStartSection ? <div className="mb-10">{beforeStartSection}</div> : null}

                {setupGuidePath && !beforeStartSection && (
                    <section
                        className="mb-10 rounded-2xl border border-cyan-200/70 dark:border-cyan-400/25
                        bg-cyan-50/70 dark:bg-cyan-400/10 p-6"
                    >
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                            {setupGuideLabel}
                        </h3>
                        <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
                            {mergedLabels.setupGuideHint ||
                                "Complete this setup guide before starting the lab if you have not configured Remix and Besu Edu-Net yet."}
                        </p>
                        <a
                            href={`/#${setupGuidePath}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/70 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-slate-950/40 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                        >
                            {mergedLabels.setupGuideCta || "Open setup guide →"}
                        </a>
                    </section>
                )}

                {/* CTA */}
                <div className="flex justify-center mt-12">
                    {interactionPath ? (
                        <a
                            href={`/#${interactionPath}`}
                            onClick={handleStartLab}
                            className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-xl
                            bg-gradient-to-r from-indigo-600 to-violet-600
                            text-white font-semibold text-lg
                            hover:from-indigo-500 hover:to-violet-500
                            hover:scale-[1.02]
                            transition-all duration-200 shadow-xl"
                        >
                            <span>{mergedLabels.startLab}</span>
                            <span className="text-xs opacity-90">
                                {mergedLabels.startLabInteractionHint}
                            </span>
                        </a>
                    ) : (
                        <a
                            href={readmeUrl}
                            onClick={handleStartLab}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-xl
                            bg-gradient-to-r from-indigo-600 to-violet-600
                            text-white font-semibold text-lg
                            hover:from-indigo-500 hover:to-violet-500
                            hover:scale-[1.02]
                            transition-all duration-200 shadow-xl"
                        >
                            <span>{mergedLabels.startLab}</span>
                            <span className="text-xs opacity-90">{mergedLabels.startLabHint}</span>
                        </a>
                    )}
                </div>

                <section
                    className="mt-14 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/40
                    bg-indigo-50/60 dark:bg-indigo-900/20 p-6"
                >
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {mergedLabels.completionTitle}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {mergedLabels.completionDescription}
                    </p>

                    {checkingStatus && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            {mergedLabels.checkingStatus}
                        </p>
                    )}
                    {!claimed && !checkingStatus ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {mergedLabels.completeInsideInteraction}
                        </p>
                    ) : claimed ? (
                        <div
                            id="lab-completion"
                            className="rounded-xl border border-green-300/60 dark:border-green-700/40
                            bg-green-50 dark:bg-green-900/20 p-4
                            animate-in fade-in zoom-in-95 duration-300
                            text-center"
                        >
                            <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white animate-bounce">
                                    ✓
                                </span>
                                <span>{mergedLabels.successMessage}</span>
                            </div>

                            {(xp || badge) && (
                                <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                                    {xp && <>⭐ +{xp} XP</>} {badge && <> · 🏅 {badge}</>}
                                </div>
                            )}
                            {completedAt && (
                                <div className="text-xs mt-1 text-green-600 dark:text-green-400">
                                    {mergedLabels.completedOn} {new Date(completedAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    ) : null}
                </section>
            </div>
        </PageShell>
    );
};

export default LabTemplate;
