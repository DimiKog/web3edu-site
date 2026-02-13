import React from "react";
import PageShell from "../../components/PageShell";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

import FeedbackModal from "../../components/FeedbackModal";

const DEFAULT_LABELS = {
    breadcrumbLabs: "Labs",
    overview: "",
    level: "Level",
    estimatedTime: "Estimated time",
    tools: "Tools used",
    prerequisites: "Prerequisites",
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
        "After completing the lab, sign a message to record your progress on Web3Edu.",
    claimButton: "✅ Claim completion",
    claimingButton: "Signing…",
    successMessage: "✔ Completion recorded successfully",
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
    conceptualFocusText = "",
    labels = {},
}) => {

    const mergedLabels = { ...DEFAULT_LABELS, ...labels };

    // Detect language from route (labs / labs-gr)
    const isGreekRoute = window.location.hash.includes("/labs-gr/");
    const lang = isGreekRoute ? "gr" : "en";

    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [error, setError] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completedAt, setCompletedAt] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        if (!isConnected || !address || !labId) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                const res = await fetch(
                    `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=${labId}`
                );

                if (!res.ok) {
                    setCheckingStatus(false);
                    return;
                }

                const data = await res.json();
                if (data.completed === true) {
                    setClaimed(true);
                    setCompletedAt(data.completedAt || null);
                }
            } catch (err) {
                console.warn("Failed to restore lab completion state", err);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkCompletion();
    }, [isConnected, address, labId]);

    const handleClaimCompletion = async () => {
        if (claimed) return;
        if (!isConnected || !address) {
            setError(mergedLabels.walletNotConnectedError);
            return;
        }

        if (!labId) {
            setError(mergedLabels.labIdMissingError);
            return;
        }

        setClaiming(true);
        setError(null);

        try {
            const timestamp = new Date().toISOString();

            const message = `I confirm completion of Web3Edu Lab
Lab ID: ${labId}
Address: ${address}
Timestamp: ${timestamp}`;

            const signature = await signMessageAsync({ message });

            const res = await fetch(
                "https://web3edu-api.dimikog.org/labs/complete",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        address,
                        labId,
                        message,
                        signature,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Backend rejected completion");
            }

            setClaimed(true);
            setShowFeedback(true);
            setTimeout(() => {
                document
                    .getElementById("lab-completion")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 200);
        } catch (err) {
            console.error(err);
            setError(mergedLabels.backendError);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <span className="hover:underline cursor-default">
                        {mergedLabels.breadcrumbLabs}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-300">
                        {title}
                    </span>
                </nav>

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

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
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
                                   drop-shadow-[0_20px_40px_rgba(80,60,200,0.35)]" loading="eager" fetchpriority="high" />
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
                    <FeedbackModal
                        isOpen={showFeedback}
                        onClose={() => setShowFeedback(false)}
                        labId={labId}
                        labTitle={title}
                        labType="foundation"
                        language={lang}
                        onSubmit={async (feedback) => {
                            try {
                                await fetch("https://web3edu-api.dimikog.org/feedback", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(feedback),
                                });
                            } catch (e) {
                                console.warn("Feedback submission failed", e);
                            }
                        }}
                    />
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
                                XP
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
                                Badge
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
                    <h3 className="text-lg font-semibold mb-4">
                        {mergedLabels.tools}
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        {tools.map((tool, idx) => (
                            <li key={idx} className="flex items-center gap-2">
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
                    <h3 className="text-lg font-semibold mb-4">
                        {mergedLabels.prerequisites}
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        {prerequisites.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                ⚠️ <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <div className="flex justify-center mt-12">
                    {interactionPath ? (
                        <a
                            href={`/#${interactionPath}`}
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
                    <h3 className="text-lg font-semibold mb-2">
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
                        <div className="flex justify-center">
                            <button
                                onClick={handleClaimCompletion}
                                disabled={claiming}
                                className={`px-6 py-3 rounded-xl font-semibold text-white
                                ${claiming
                                        ? "bg-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                                    }`}
                            >
                                {claiming ? mergedLabels.claimingButton : mergedLabels.claimButton}
                            </button>
                        </div>
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

                    {error && (
                        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </section>
            </div>
        </PageShell>
    );
};

export default LabTemplate;
