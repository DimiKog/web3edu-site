import React, { useEffect, useState, useRef } from "react";
import PageShell from "../../components/PageShell";
import { useAccount } from "wagmi";
import FeedbackModal from "../../components/FeedbackModal";

/**
 * ProjectLabTemplate
 * Used for Applied & Project Labs (e.g. Proof of Escape)
 */
const ProjectLabTemplate = ({
    projectId,
    title,
    subtitle,
    heroImage = null,
    heroImageWrapperClass = "mb-14 rounded-3xl overflow-hidden border bg-slate-50 dark:bg-slate-900/60 dark:border-slate-700",
    heroImageClass = "w-full h-auto object-cover",

    level = "Applied",
    estimatedTime = "20-30 minutes",
    difficulty = "Medium",

    missionText = "",
    whatYouDo = [],
    unlocks = [],

    primaryCta = {
        label: "Enter the Challenge →",
        href: null,
    },

    // Completion / verification
    verifyEndpoint = null,      // optional backend verification
}) => {
    const { address, isConnected } = useAccount();

    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const wasCompletedRef = useRef(false);

    const language =
        typeof window !== "undefined" &&
            window.location.hash.includes("/labs-gr")
            ? "gr"
            : "en";
    const backToLabsHref = language === "gr" ? "/#/labs-gr" : "/#/labs";
    const backToLabsLabel =
        language === "gr"
            ? "⬅ Επιστροφή στα Εργαστήρια"
            : "⬅ Return to Labs";

    /**
     * Completion verification
     * For PoE this will likely be:
     * - NFT ownership
     * - DAO invite SBT
     */
    useEffect(() => {
        if (!address || !verifyEndpoint) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                const res = await fetch(
                    `${verifyEndpoint}?address=${address}`
                );

                if (!res.ok) return;

                const data = await res.json();
                if (data.completed) {
                    setCompleted(true);

                    if (!wasCompletedRef.current) {
                        setShowFeedback(true);
                        wasCompletedRef.current = true;
                    }
                }
            } catch (err) {
                console.warn("Project completion check failed", err);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkCompletion();
    }, [address, isConnected, projectId, verifyEndpoint]);

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12">

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <span>Labs</span>
                    <span className="mx-2">→</span>
                    <span>Applied & Project</span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-200">{title}</span>
                </nav>

                {/* Header */}
                <header className="mb-10">
                    <span className="inline-flex mb-4 px-3 py-1 rounded-full
            bg-purple-100 dark:bg-purple-900/40
            text-purple-700 dark:text-purple-300
            text-sm font-semibold">
                        🧪 Web3Edu · Project Lab
                    </span>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                        {title}
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                        {subtitle}
                    </p>
                </header>

                {/* Hero */}
                {heroImage && (
                    <div className={heroImageWrapperClass}>
                        <img
                            src={heroImage}
                            alt={`${title} hero`}
                            className={heroImageClass}
                        />
                    </div>
                )}

                {/* Mission */}
                <section className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900/70">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        🎯 Mission
                    </h3>

                    <div className="max-w-3xl space-y-4 text-slate-700 dark:text-slate-200 leading-relaxed">
                        {typeof missionText === "string" &&
                            missionText
                                .trim()
                                .split("\n\n")
                                .map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                    </div>
                </section>

                {/* Meta */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <MetaCard label="Level" value={level} />
                    <MetaCard label="Estimated Time" value={estimatedTime} />
                    <MetaCard label="Difficulty" value={difficulty} />
                </section>

                {/* What You’ll Do */}
                {whatYouDo.length > 0 && (
                    <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/70">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">🧩 What You’ll Do</h3>
                        <ul className="space-y-3 text-slate-800 dark:text-slate-200">
                            {whatYouDo.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* What This Unlocks */}
                {unlocks.length > 0 && (
                    <section className="mb-14 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/40 dark:bg-indigo-950/40">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-indigo-100">🔓 What This Unlocks</h3>
                        <ul className="space-y-2 text-slate-800 dark:text-indigo-100">
                            {unlocks.map((item, i) => (
                                <li key={i}>✨ {item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* CTA */}
                {primaryCta?.href && !completed && (
                    <div className="max-w-3xl mx-auto text-center">
                        <a
                            href={primaryCta.href}
                            target="_blank" rel="noopener noreferrer"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {primaryCta.label}
                        </a>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Opens in a new tab
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            If redirected to a wallet app, copy the link and open it directly in your browser.
                        </p>
                    </div>
                )}

                {/* Completion status */}
                <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-center dark:border-slate-700 dark:bg-slate-900/70">
                    {checkingStatus && (
                        <p className="text-slate-600 dark:text-slate-300">
                            Checking completion status…
                        </p>
                    )}

                    {!checkingStatus && completed && (
                        <div
                            id="lab-completion"
                            className="rounded-xl border border-green-300/60 dark:border-green-700/40
                            bg-green-50 dark:bg-green-900/20 p-4
                            animate-in fade-in zoom-in-95 duration-300 text-center"
                        >
                            <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-300 font-semibold">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white animate-bounce">
                                    ✓
                                </span>
                                <span>Applied project completed — on-chain proof verified</span>
                            </div>
                            <a
                                href={backToLabsHref}
                                className="inline-block mt-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                                {backToLabsLabel}
                            </a>
                        </div>
                    )}

                    {!checkingStatus && !completed && (
                        <div className="text-slate-600 dark:text-slate-300">
                            Complete the project to record your on-chain proof.
                        </div>
                    )}
                </section>

                <FeedbackModal
                    isOpen={showFeedback}
                    onClose={() => setShowFeedback(false)}
                    labId={projectId}
                    labTitle={title}
                    labType="project"
                    language={language}
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

            </div>
        </PageShell>
    );
};

const MetaCard = ({ label, value }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/70">
        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            {label}
        </div>
        <div className="font-semibold text-slate-800 dark:text-slate-100">
            {value}
        </div>
    </div>
);

export default ProjectLabTemplate;
