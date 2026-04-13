import React, { useEffect, useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const DEFAULT_LABELS = {
    breadcrumbLabs: "Labs",
    breadcrumbSystemLabs: "System Labs",
    headerPill: "🧪 Web3Edu · System Lab",
    completedBadge: "✓ Completed",
    backLabel: "⬅ Return to Lab Overview",

    level: "Level",
    estimatedTime: "Estimated time",
    xp: "XP",
    badgeLabel: "Badge",

    stepsTitle: "Lab Guide",
    stepLabel: "Step",
    simulatorTitle: "Simulator",
    guidanceTitle: "Guidance",
    eventsTitle: "Observed Events",
    takeawaysTitle: "Key Takeaways",
    checkpointTitle: "Checkpoint",

    checkingStatus: "Checking completion status…",
    completionTitle: "Lab completion",
    completionDescription:
        "Finish the guided interaction, then claim completion below.",
    completeInsideInteraction: "Complete the interaction and claim completion below.",
    successMessage: "✔ Completion recorded successfully",
    completedOn: "Completed on:",
};

function MetaCard({ label, value, icon = null }) {
    if (!value) return null;

    return (
        <div
            className="rounded-xl border border-slate-200/70 dark:border-slate-700/60
            bg-white/80 dark:bg-slate-900/60 p-5"
        >
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                {label}
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">
                {icon ? `${icon} ${value}` : value}
            </div>
        </div>
    );
}

function StepTracker({
    title,
    steps = [],
    currentStep = 0,
    stepLabel = "Step",
    accentClassName = "from-cyan-500/10 to-fuchsia-500/10",
}) {
    if (!steps?.length) return null;

    const normalizedCurrentStep =
        currentStep < 0 ? steps.length : Math.min(currentStep, steps.length);
    const isAllComplete = normalizedCurrentStep >= steps.length;

    return (
        <section
            className={`rounded-2xl border border-slate-200/70 dark:border-slate-700/60
            bg-gradient-to-br ${accentClassName}
            p-6`}
        >
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                    const isActive = !isAllComplete && index === normalizedCurrentStep;
                    const isComplete = isAllComplete || index < normalizedCurrentStep;

                    return (
                        <div
                            key={step.title || index}
                            className={[
                                "rounded-2xl border p-4 transition-all duration-200",
                                isActive
                                    ? "border-cyan-400/40 bg-cyan-50/70 dark:bg-cyan-900/20"
                                    : isComplete
                                        ? "border-emerald-400/30 bg-emerald-50/70 dark:bg-emerald-900/20"
                                        : "border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40",
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={[
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                        isActive
                                            ? "bg-cyan-500 text-white"
                                            : isComplete
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200",
                                    ].join(" ")}
                                >
                                    {index + 1}
                                </div>

                                <div className="text-xs uppercase tracking-wide text-slate-500">
                                    {step.label || `${stepLabel} ${index + 1}`}
                                </div>
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                {step.title}
                            </h3>

                            {step.text && (
                                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {step.text}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function normalizeClaimBackHref(backHref) {
    if (!backHref) return null;
    if (backHref.startsWith("/#/")) return backHref;
    if (backHref.startsWith("#/")) return `/${backHref}`;
    if (backHref.startsWith("/")) return `/#${backHref}`;
    return `/#/${backHref}`;
}

const SystemLabTemplate = ({
    labId,
    title,
    subtitle,
    level = "Intermediate",
    estimatedTime = "10–15 minutes",
    xp = null,
    badge = null,
    labels = {},
    language = "en",
    backHref = null,

    // hero extras
    kicker = null,
    statusBadge = null,
    heroRight = null,
    heroBottom = null,
    heroAccentClassName = "from-slate-50/90 via-cyan-50/40 to-fuchsia-50/40 dark:from-slate-900/80 dark:via-cyan-950/20 dark:to-fuchsia-950/20",

    // guided flow
    steps = [],
    currentStep = 0,
    stepAccentClassName = "from-cyan-500/10 to-fuchsia-500/10",

    // main content slots
    simulatorContent = null,
    sideGuidanceContent = null,
    eventsContent = null,
    takeawaysContent = null,
    checkpointContent = null,
    completionContent = null,
    wrapSimulatorSection = true,

    // completion
    showCompletionSection = true,

    // backend
    apiBase = import.meta.env.VITE_BACKEND_URL,
}) => {
    const mergedLabels = useMemo(
        () => ({ ...DEFAULT_LABELS, ...labels }),
        [labels]
    );

    const { address, isConnected } = useAccount();

    const [claimed, setClaimed] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completedAt, setCompletedAt] = useState(null);

    useEffect(() => {
        if (!isConnected || !address || !labId || !apiBase) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                const res = await fetch(
                    `${apiBase}/labs/status?address=${address}&labId=${labId}`
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
    }, [isConnected, address, labId, apiBase]);

    return (
        <PageShell>
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <span>{mergedLabels.breadcrumbLabs}</span>
                    <span className="mx-2">→</span>
                    <span>{mergedLabels.breadcrumbSystemLabs}</span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-300">
                        {title}
                    </span>
                </nav>

                {/* Hero */}
                <section
                    className={`mb-8 rounded-3xl border border-slate-200/70 dark:border-slate-700/60
                    bg-gradient-to-br ${heroAccentClassName}
                    p-6 md:p-8 shadow-sm`}
                >
                    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                        <div>
                            {backHref ? (
                                <Link
                                    to={backHref}
                                    className="mb-4 inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-1 dark:text-indigo-300"
                                >
                                    {mergedLabels.backLabel}
                                </Link>
                            ) : null}

                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                                    bg-cyan-100/70 dark:bg-cyan-900/30
                                    text-sm font-semibold tracking-wide
                                    text-cyan-700 dark:text-cyan-300"
                                >
                                    {mergedLabels.headerPill}
                                </span>

                                {claimed && (
                                    <span
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                        bg-green-100 dark:bg-green-900/40
                                        text-sm font-semibold
                                        text-green-700 dark:text-green-300"
                                    >
                                        {mergedLabels.completedBadge}
                                    </span>
                                )}

                                {statusBadge ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-300/70 bg-white/70 text-sm font-semibold text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200">
                                        {statusBadge}
                                    </span>
                                ) : null}
                            </div>

                            {kicker ? (
                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    {kicker}
                                </div>
                            ) : null}

                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">
                                {title}
                            </h1>

                            {subtitle && (
                                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                                    {subtitle}
                                </p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                                <MetaCard
                                    label={mergedLabels.level}
                                    value={level}
                                    icon="🧭"
                                />
                                <MetaCard
                                    label={mergedLabels.estimatedTime}
                                    value={estimatedTime}
                                    icon="⏱️"
                                />
                                <MetaCard
                                    label={mergedLabels.xp}
                                    value={xp}
                                    icon="⭐"
                                />
                                <MetaCard
                                    label={mergedLabels.badgeLabel}
                                    value={badge}
                                    icon="🏅"
                                />
                            </div>
                        </div>

                        {heroRight && <div>{heroRight}</div>}
                    </div>

                    {heroBottom && <div className="mt-6">{heroBottom}</div>}
                </section>

                {/* Guide / Steps */}
                {!!steps?.length && (
                    <div className="mb-8">
                        <StepTracker
                            title={mergedLabels.stepsTitle}
                            steps={steps}
                            currentStep={currentStep}
                            stepLabel={mergedLabels.stepLabel}
                            accentClassName={stepAccentClassName}
                        />
                    </div>
                )}

                {/* Simulator */}
                {simulatorContent && (
                    <section className="mb-8">
                        {wrapSimulatorSection ? (
                            <section
                                className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                                bg-white/80 dark:bg-slate-900/60 p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                                    {mergedLabels.simulatorTitle}
                                </h2>
                                {simulatorContent}
                            </section>
                        ) : (
                            simulatorContent
                        )}
                    </section>
                )}

                {/* Side guidance */}
                {sideGuidanceContent && (
                    <section
                        className="mb-8 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                            {mergedLabels.guidanceTitle}
                        </h2>
                        {sideGuidanceContent}
                    </section>
                )}

                {/* Observed events */}
                {eventsContent && (
                    <section
                        className="mb-8 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                            {mergedLabels.eventsTitle}
                        </h2>
                        {eventsContent}
                    </section>
                )}

                {/* Takeaways */}
                {takeawaysContent && (
                    <section
                        className="mb-8 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                            {mergedLabels.takeawaysTitle}
                        </h2>
                        {takeawaysContent}
                    </section>
                )}

                {/* Checkpoint */}
                {checkpointContent && (
                    <section
                        className="mb-8 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                            {mergedLabels.checkpointTitle}
                        </h2>
                        {checkpointContent}
                    </section>
                )}

                {/* Completion */}
                {(showCompletionSection || claimed) &&
                    (completionContent ? (
                        completionContent
                    ) : (
                        <section
                            className="mt-10 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/40
                            bg-indigo-50/60 dark:bg-indigo-900/20 p-6"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
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
                                <div>
                                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                                        {mergedLabels.completeInsideInteraction}
                                    </p>
                                    <LabCompletionClaim
                                        labId={labId}
                                        language={language}
                                        backHref={normalizeClaimBackHref(backHref)}
                                        backLabel={mergedLabels.backLabel}
                                        labTitle={title}
                                    />
                                </div>
                            ) : claimed ? (
                                <div
                                    id="lab-completion"
                                    className="rounded-xl border border-green-300/60 dark:border-green-700/40
                                    bg-green-50 dark:bg-green-900/20 p-4 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                                            ✓
                                        </span>
                                        <span>{mergedLabels.successMessage}</span>
                                    </div>

                                    {(xp || badge) && (
                                        <div className="text-sm mt-1 text-green-700 dark:text-green-300">
                                            {xp && <>⭐ +{xp} XP</>}{" "}
                                            {badge && <>· 🏅 {badge}</>}
                                        </div>
                                    )}

                                    {completedAt && (
                                        <div className="text-xs mt-1 text-green-600 dark:text-green-400">
                                            {mergedLabels.completedOn}{" "}
                                            {new Date(completedAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </section>
                    ))}
            </div>
        </PageShell>
    );
};

export default SystemLabTemplate;
