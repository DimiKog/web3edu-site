import React, { useEffect, useState } from "react";
import PageShell from "../../components/PageShell";
import { useAccount } from "wagmi";

/**
 * ProjectLabTemplate
 * Used for Applied & Project Labs (e.g. Proof of Escape)
 */
const ProjectLabTemplate = ({
    projectId,
    title,
    subtitle,
    heroImage = null,
    heroImageWrapperClass = "mb-14 rounded-3xl overflow-hidden border bg-slate-50",
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
    completionType = "onchain", // "onchain" | "backend" | "external"
    verifyEndpoint = null,      // optional backend verification
}) => {
    const { address, isConnected } = useAccount();

    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [completionData, setCompletionData] = useState(null);

    /**
     * Completion verification
     * For PoE this will likely be:
     * - NFT ownership
     * - DAO invite SBT
     */
    useEffect(() => {
        if (!isConnected || !address || !verifyEndpoint) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                const res = await fetch(
                    `${verifyEndpoint}?address=${address}&projectId=${projectId}`
                );

                if (!res.ok) return;

                const data = await res.json();
                if (data.completed) {
                    setCompleted(true);
                    setCompletionData(data);
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
                <nav className="mb-6 text-sm text-slate-500">
                    <span>Labs</span>
                    <span className="mx-2">→</span>
                    <span>Applied & Project</span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700">{title}</span>
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

                    <p className="text-lg text-slate-600 max-w-2xl">
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
                <section className="mb-12 rounded-2xl border bg-slate-50 p-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        🎯 Mission
                    </h3>

                    <div className="max-w-3xl space-y-4 text-slate-700 leading-relaxed">
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
                    <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6">
                        <h3 className="text-lg font-semibold mb-4">🧩 What You’ll Do</h3>
                        <ul className="space-y-3 text-slate-800">
                            {whatYouDo.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* What This Unlocks */}
                {unlocks.length > 0 && (
                    <section className="mb-14 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
                        <h3 className="text-lg font-semibold mb-4">🔓 What This Unlocks</h3>
                        <ul className="space-y-2">
                            {unlocks.map((item, i) => (
                                <li key={i}>✨ {item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* CTA */}
                {primaryCta?.href && (
                    <div className="max-w-3xl mx-auto text-center">
                        <a
                            href={primaryCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {primaryCta.label}
                        </a>
                        <p className="mt-2 text-xs text-slate-500">
                            Opens in a new tab
                        </p>
                    </div>
                )}

                {/* Completion status */}
                <section className="rounded-2xl border p-6 text-center">
                    {checkingStatus && <p>Checking completion status…</p>}

                    {!checkingStatus && completed && (
                        <div className="text-green-700 font-semibold">
                            ✓ Project completed — on-chain proof verified
                        </div>
                    )}

                    {!checkingStatus && !completed && (
                        <div className="text-slate-600">
                            Complete the project to record your on-chain proof.
                        </div>
                    )}
                </section>

            </div>
        </PageShell>
    );
};

const MetaCard = ({ label, value }) => (
    <div className="rounded-xl border bg-white p-5">
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            {label}
        </div>
        <div className="font-semibold text-slate-800">
            {value}
        </div>
    </div>
);

export default ProjectLabTemplate;
