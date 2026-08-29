import { ArrowDown, ArrowRight } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const STAGE_ACCENTS = [
    {
        node: "from-[#8A57FF] to-[#8A57FF]",
        ring: "ring-[#8A57FF]/40",
        label: "text-[#8A57FF] dark:text-[#B794FF]",
        panel: "border-[#8A57FF]/25 dark:border-[#8A57FF]/35",
        glow: "from-[#8A57FF]/10 via-transparent to-transparent",
    },
    {
        node: "from-[#4ACBFF] to-[#4ACBFF]",
        ring: "ring-[#4ACBFF]/40",
        label: "text-cyan-700 dark:text-cyan-300",
        panel: "border-cyan-300/40 dark:border-cyan-400/30",
        glow: "from-[#4ACBFF]/10 via-transparent to-transparent",
    },
    {
        node: "from-[#FF67D2] to-[#FF67D2]",
        ring: "ring-[#FF67D2]/40",
        label: "text-fuchsia-700 dark:text-fuchsia-300",
        panel: "border-fuchsia-300/35 dark:border-fuchsia-400/25",
        glow: "from-[#FF67D2]/10 via-transparent to-transparent",
    },
    {
        node: "from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]",
        ring: "ring-[#8A57FF]/35",
        label: "text-indigo-700 dark:text-indigo-200",
        panel: "border-indigo-300/35 dark:border-indigo-400/25",
        glow: "from-[#8A57FF]/12 via-[#4ACBFF]/8 to-[#FF67D2]/10",
    },
];

const GRID_CLASS = "grid grid-cols-1 gap-0 lg:grid-cols-4 lg:gap-5";

const LearningJourney = ({ content }) => {
    if (!content?.stages?.length) return null;

    const stages = content.stages;
    const progression = content.progression ?? stages.map((stage) => stage.shortLabel);

    return (
        <section
            id="home-explore"
            className="scroll-mt-28 w-full px-6 opacity-0 animate-fadeInSlow duration-500"
            aria-labelledby="learning-journey-title"
        >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.08),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.08),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.12),transparent_38%)]" />

                <div className="relative mb-5 max-w-4xl lg:mb-5">
                    <SectionBadge label={content.badge} className="mb-4" />
                    <h2
                        id="learning-journey-title"
                        className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
                    >
                        {content.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                        {content.subtitle}
                    </p>
                </div>

                <div className="relative">
                    {/* Desktop ribbon — aligned to stage grid columns (lg+ only) */}
                    <div
                        className={`relative mb-3 hidden lg:grid lg:grid-cols-4 lg:gap-5`}
                        aria-hidden="true"
                    >
                        {progression.map((step, index) => (
                            <div key={step} className="relative flex items-center justify-center">
                                <span className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
                                    {step}
                                </span>
                                {index < progression.length - 1 ? (
                                    <ArrowRight className="pointer-events-none absolute left-full top-1/2 z-10 h-4 w-4 -translate-y-1/2 translate-x-[calc(1.25rem/2-0.5rem)] text-[#8A57FF]" />
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {/* Desktop node track — connector through circle centers only */}
                    <div
                        className="relative mb-4 hidden h-11 lg:grid lg:grid-cols-4 lg:gap-5"
                        aria-hidden="true"
                    >
                        <div className="pointer-events-none absolute top-1/2 left-[12.5%] right-[12.5%] h-px -translate-y-1/2 bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]" />
                        {stages.map((stage, index) => {
                            const accent = STAGE_ACCENTS[index] ?? STAGE_ACCENTS[0];

                            return (
                                <div key={`${stage.id}-node`} className="relative z-10 flex items-center justify-center">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${accent.node} text-sm font-extrabold text-white shadow-lg ring-4 ${accent.ring}`}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <ol className={`relative ${GRID_CLASS}`}>
                        <div
                            className="pointer-events-none absolute bottom-12 left-[1.35rem] top-12 w-px bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] lg:hidden"
                            aria-hidden="true"
                        />

                        {stages.map((stage, index) => {
                            const accent = STAGE_ACCENTS[index] ?? STAGE_ACCENTS[0];
                            const cta = stage.cta;

                            return (
                                <li key={stage.id} className="relative flex min-h-0 flex-col">
                                    {index > 0 ? (
                                        <div
                                            className="flex justify-start py-2 lg:hidden"
                                            aria-hidden="true"
                                        >
                                            <div className="relative z-10 ml-[calc(1.35rem-0.875rem)] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#8A57FF]/40 bg-white/90 shadow-sm backdrop-blur-sm dark:border-cyan-400/25 dark:bg-slate-950/85">
                                                <ArrowDown className="h-3.5 w-3.5 text-[#8A57FF] dark:text-[#B794FF]" />
                                            </div>
                                        </div>
                                    ) : null}

                                    <article
                                        className={`relative flex h-full flex-col rounded-2xl border bg-white/75 p-5 shadow-sm backdrop-blur-sm dark:bg-white/[0.04] sm:p-6 ${accent.panel}`}
                                    >
                                        <div
                                            className={`pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-2xl bg-gradient-to-br ${accent.glow}`}
                                            aria-hidden="true"
                                        />

                                        {/* Mobile / tablet — node beside header */}
                                        <div className="relative flex items-start gap-3 lg:hidden">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accent.node} text-sm font-extrabold text-white shadow-lg ring-4 ${accent.ring}`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </div>
                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <p
                                                    className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${accent.label}`}
                                                >
                                                    {stage.label}
                                                </p>
                                                <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
                                                    {stage.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Desktop — header below node track */}
                                        <div className="relative hidden lg:block">
                                            <p
                                                className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${accent.label}`}
                                            >
                                                {stage.label}
                                            </p>
                                            <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
                                                {stage.title}
                                            </h3>
                                        </div>

                                        <p className="relative mt-4 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-[0.9375rem] sm:leading-7">
                                            {stage.description}
                                        </p>

                                        {cta?.label && cta?.href ? (
                                            <a
                                                href={cta.href}
                                                className={`relative mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold ${accent.label} transition hover:translate-x-0.5`}
                                            >
                                                {cta.label}
                                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </a>
                                        ) : (
                                            <div className="mt-5 h-5" aria-hidden="true" />
                                        )}
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
};

export default LearningJourney;
