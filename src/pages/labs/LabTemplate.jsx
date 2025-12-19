import React from "react";
import PageShell from "../../components/PageShell";

const LabTemplate = ({
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
    readmeUrl = "https://github.com/dimikog/web3edu-labs/blob/main/lab-01-wallets-identity/README.md",
    conceptualFocusText = "",
    labels = {
        breadcrumbLabs: "Labs",
        overview: "",
        level: "Level",
        estimatedTime: "Estimated time",
        tools: "Tools used",
        prerequisites: "Prerequisites",
        startLab: "Start Lab →",
        conceptualFocus: "Conceptual focus",
        startLabHint: "Opens full step-by-step guide",
        heroCaption: "Web3 identity emerges from cryptographic wallets and network context",
    },
}) => {

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <span className="hover:underline cursor-default">
                        {labels.breadcrumbLabs}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-300">
                        {title}
                    </span>
                </nav>

                {/* Header */}
                <header className="mb-10">
                    <span
                        className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full
                        bg-indigo-100/70 dark:bg-indigo-900/40
                        text-sm font-semibold tracking-wide
                        text-indigo-700 dark:text-indigo-300"
                    >
                        🧪 Web3Edu · Foundational Lab
                    </span>

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
                            <img
                                src={heroImage}
                                alt={`${title} visual overview`}
                                className="mx-auto max-w-3xl w-full h-auto object-contain
                                   drop-shadow-[0_20px_40px_rgba(80,60,200,0.35)]"
                            />
                            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                                {labels.heroCaption}
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
                        🧠 <span className="font-semibold">{labels.conceptualFocus}:</span>{" "}
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
                            {labels.level}
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
                            {labels.estimatedTime}
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
                        {labels.tools}
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
                        {labels.prerequisites}
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
                    <a
                        href={readmeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-violet-600
                        text-white font-semibold text-lg
                        hover:from-indigo-500 hover:to-violet-500
                        hover:scale-[1.02]
                        transition-all duration-200 shadow-xl"
                    >
                        <span>{labels.startLab}</span>
                        <span className="text-xs opacity-90">{labels.startLabHint}</span>
                    </a>
                </div>
            </div>
        </PageShell>
    );
};

export default LabTemplate;
