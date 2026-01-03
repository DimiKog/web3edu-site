import { useRef, useLayoutEffect, useState, useCallback } from "react";
import holoImg from "../assets/holo.png";
import SectionBadge from "./SectionBadge.jsx";

const DEFAULT_STEPS = [
    {
        title: "Identity & Foundations",
        emoji: "🪪",
        desc: "Create your Web3 identity and learn the core concepts needed to interact safely with decentralized systems."
    },
    {
        title: "Access the DAO",
        emoji: "🏛️",
        desc: "Unlock DAO access, verify your progress, and join a learner-driven Web3 community."
    },
    {
        title: "Participate",
        emoji: "🤝",
        desc: "Vote, propose ideas, collaborate, and contribute to real Web3 experiments."
    },
    {
        title: "Build",
        emoji: "🛠️",
        desc: "Turn concepts into prototypes and build your own Web3 applications."
    }
];

const LearningPath = ({ content, badgeLabel = "Learning Journey", ctaHref = "/#/start-here" }) => {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const [nodeYs, setNodeYs] = useState([]);
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(max-width: 768px)").matches;
    });

    const steps = Array.isArray(content?.steps) && content.steps.length ? content.steps : DEFAULT_STEPS;
    const ctaLabel = content?.ctaLabel || "Start Your Web3 Journey →";
    cardRefs.current = cardRefs.current.slice(0, steps.length);

    const recomputePositions = useCallback(() => {
        if (isMobile || !containerRef.current) {
            setNodeYs([]);
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const positions = cardRefs.current.map(el => {
            if (!el) return 0;
            const containerTop = containerRect.top;
            const anchor = el.querySelector("[data-node-anchor]");
            if (anchor) {
                const anchorRect = anchor.getBoundingClientRect();
                return anchorRect.top - containerTop + anchorRect.height / 2;
            }

            const rect = el.getBoundingClientRect();
            return rect.top - containerTop + rect.height / 3;
        });

        const headerOffset = containerRef.current.querySelector(".header-block")?.offsetHeight || 0;
        const ADJUST = 68;
        setNodeYs(positions.map(y => y - headerOffset - ADJUST));
    }, [isMobile]);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const updateMatch = () => setIsMobile(mediaQuery.matches);
        updateMatch();

        const handler = () => updateMatch();
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }

        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
    }, []);

    useLayoutEffect(() => {
        if (isMobile || !containerRef.current) {
            setNodeYs([]);
            return;
        }

        const observer = new ResizeObserver(() => recomputePositions());
        cardRefs.current.forEach(el => el && observer.observe(el));

        window.addEventListener("resize", recomputePositions);
        window.addEventListener("load", recomputePositions);
        recomputePositions();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", recomputePositions);
            window.removeEventListener("load", recomputePositions);
        };
    }, [content, isMobile, recomputePositions]);

    const cardContainerClasses = isMobile
        ? "flex flex-col w-full gap-6 mt-4"
        : "flex-1 w-full max-w-[820px] space-y-12 mt-6 md:mt-0 px-2 md:px-0";

    return (
        <section
            ref={containerRef}
            className="relative mt-12 mx-auto max-w-[1700px] rounded-2xl border border-slate-200/70 bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF] dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D]"
        >
            <div className="mb-8 flex flex-col gap-4 header-block">
                <div>
                    <SectionBadge label={badgeLabel} className="mb-3" />

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {content.title}
                    </h2>

                    <p className="mt-2 max-w-none whitespace-normal text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-400">
                        {content.subtitle}
                    </p>
                </div>
            </div>

            <div className="md:hidden mb-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/50 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-3">
                    Path Overview
                </p>
                <div className="flex items-start justify-between text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {steps.map((step) => (
                        <div key={step.title} className="flex flex-col items-center flex-1 text-center gap-1">
                            <span className="text-2xl" aria-hidden="true">{step.emoji}</span>
                            <span className="text-[0.75rem] leading-tight">{step.title}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] animate-pulse" />
                </div>
            </div>

            <div className="relative w-full flex flex-col md:flex-row gap-6 md:gap-14 items-start justify-center">
                <div className="relative flex items-center justify-center md:justify-end md:pt-40 pt-6 pl-2 pr-0 w-full md:w-auto select-none">
                    <div
                        className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[340px] md:h-[340px] flex items-center justify-center animate-float-slow before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[#4ACBFF]/20 before:blur-2xl before:animate-pulse"
                        style={{ pointerEvents: "none" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-holoShimmer rounded-2xl pointer-events-none"></div>
                        <img
                            src={holoImg}
                            alt="Hologram Projector"
                            className="object-contain opacity-90 drop-shadow-[0_0_20px_rgba(74,203,255,0.55)]"
                            draggable="false"
                        />
                    </div>
                </div>

                {!isMobile && (
                    <div
                        className="relative w-20 md:w-32 overflow-visible ml-6 md:ml-0 mt-4 md:mt-0 hidden md:block"
                        style={{
                            height: nodeYs.length ? `${Math.max(...nodeYs) + 120}px` : "0px"
                        }}
                    >
                        {nodeYs.length > 0 && (
                            <svg
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-24 z-50 pointer-events-none"
                                style={{ height: `${Math.max(...nodeYs) + 120}px`, minWidth: "50px" }}
                                viewBox={`0 0 100 ${Math.max(...nodeYs) + 120}`}
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="100"
                                    height={Math.max(...nodeYs) + 160}
                                    fill="url(#holoScanGrad)"
                                    className="animate-holoScan"
                                    opacity="0.35"
                                />
                                <defs>
                                    <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8e5cff" />
                                        <stop offset="50%" stopColor="#5ad2ff" />
                                        <stop offset="100%" stopColor="#d946ef" />
                                    </linearGradient>

                                    <radialGradient id="node1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#6366f1aa" />
                                    </radialGradient>

                                    <radialGradient id="node2">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#a855f7aa" />
                                    </radialGradient>

                                    <radialGradient id="node3">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#3b82f6aa" />
                                    </radialGradient>

                                    <radialGradient id="node4">
                                        <stop offset="0%" stopColor="#d946ef" />
                                        <stop offset="100%" stopColor="#d946efaa" />
                                    </radialGradient>

                                    <linearGradient id="holoScanGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                                        <stop offset="50%" stopColor="rgba(255,255,255,0.35)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                                    </linearGradient>

                                    <radialGradient id="nodePulseGrad">
                                        <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                                    </radialGradient>
                                </defs>

                                <rect
                                    x={45}
                                    y={nodeYs[0]}
                                    width="10"
                                    height={nodeYs[nodeYs.length - 1] - nodeYs[0] + 40}
                                    fill="url(#pipeGrad)"
                                    style={{ filter: "blur(6px)" }}
                                />

                                <rect
                                    x={48}
                                    y={nodeYs[0]}
                                    width="4"
                                    height={nodeYs[nodeYs.length - 1] - nodeYs[0] + 40}
                                    fill="url(#pipeGrad)"
                                />

                                {nodeYs.map((y, i) => (
                                    <g key={i}>
                                        <circle
                                            cx="50"
                                            cy={
                                                i === nodeYs.length - 1
                                                    ? y + 12
                                                    : i === 2
                                                        ? y + 5
                                                        : y
                                            }
                                            r="14"
                                            fill={`url(#node${i + 1})`}
                                            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))" }}
                                        />
                                        <circle
                                            cx="50"
                                            cy={
                                                i === nodeYs.length - 1
                                                    ? y + 12
                                                    : i === 2
                                                        ? y + 5
                                                        : y
                                            }
                                            r="24"
                                            fill="url(#nodePulseGrad)"
                                            className="animate-nodeHalo"
                                            opacity="0.6"
                                        />
                                    </g>
                                ))}
                            </svg>
                        )}
                    </div>
                )}

                <div className={cardContainerClasses}>
                    {steps.map((step, i) => (
                        <div
                            key={step.title}
                            ref={(el) => (cardRefs.current[i] = el)}
                            className={`reveal-card relative rounded-2xl p-6 bg-white/90 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 shadow-md ${isMobile ? "w-full" : "ml-4 max-w-[760px]"}`}
                        >
                            <div className="flex items-center gap-3 mb-3" data-node-anchor>
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm
                                      ${i === 0 ? "bg-gradient-to-r from-[#8A57FF]/90 to-[#4ACBFF]/90" : ""}
                                      ${i === 1 ? "bg-gradient-to-r from-[#4ACBFF]/90 to-[#FF67D2]/90" : ""}
                                      ${i === 2 ? "bg-gradient-to-r from-[#FF67D2]/90 to-[#8A57FF]/90" : ""}
                                      ${i === 3 ? "bg-gradient-to-r from-[#4ACBFF]/90 to-[#8A57FF]/90" : ""}`}
                                >
                                    <span>{content?.stepLabel || "STEP"} {i + 1}</span>
                                </div>

                                <span
                                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-white text-lg shadow-md
                                      ${i === 0 ? "bg-[#8A57FF]" : ""}
                                      ${i === 1 ? "bg-[#4ACBFF]" : ""}
                                      ${i === 2 ? "bg-[#FF67D2]" : ""}
                                      ${i === 3 ? "bg-[#8A57FF]" : ""}`}
                                >
                                    {step.emoji}
                                </span>

                                <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100 m-0">
                                    {step.title}
                                </h3>
                            </div>

                            <p className="text-lg sm:text-base text-slate-600 dark:text-slate-400 card-text">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <a
                    className="w-full md:w-auto text-center px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
                    href={ctaHref}
                >
                    {ctaLabel}
                </a>
            </div>

            <style>{`
                @keyframes holoScan {
                    0% { transform: translateY(-120%); opacity:0.2; }
                    50% { opacity:0.45; }
                    100% { transform: translateY(120%); opacity:0.2; }
                }
                .animate-holoScan {
                    animation: holoScan 4.5s linear infinite;
                    mix-blend-mode: screen;
                }

                @keyframes nodeHalo {
                    0% { transform: scale(1); opacity:0.5; }
                    50% { transform: scale(1.25); opacity:1; }
                    100% { transform: scale(1); opacity:0.5; }
                }
                .animate-nodeHalo {
                    animation: nodeHalo 2.8s ease-in-out infinite;
                }

                @keyframes floatSlow {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float-slow {
                    animation: floatSlow 5s ease-in-out infinite;
                }

                @keyframes holoShimmer {
                  0% { transform: translateX(-150%) rotate(10deg); }
                  50% { transform: translateX(50%) rotate(10deg); }
                  100% { transform: translateX(150%) rotate(10deg); }
                }
                .animate-holoShimmer {
                  animation: holoShimmer 5s ease-in-out infinite;
                  mix-blend-mode: screen;
                }

                @keyframes revealFadeUp {
                  0% { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .reveal-card {
                  opacity: 0;
                  animation: revealFadeUp 0.7s ease-out forwards;
                }
                .reveal-card:nth-child(1) { animation-delay: 0ms; }
                .reveal-card:nth-child(2) { animation-delay: 120ms; }
                .reveal-card:nth-child(3) { animation-delay: 240ms; }
                .reveal-card:nth-child(4) { animation-delay: 360ms; }

                @media (min-width: 1600px) {
                  h2 { font-size: 2.2rem; }
                  .card-text { font-size: 1.125rem; }
                }
            `}</style>
        </section>
    );
};

export default LearningPath;
