import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Blocks,
    FlaskConical,
    Fingerprint,
} from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";
import dashboardPreview from "../assets/home/web3edu-dashboard-preview.png";

const ICONS = {
    modules: BookOpen,
    handsOn: FlaskConical,
    progress: BadgeCheck,
    identity: Fingerprint,
    // legacy keys kept for safety if older content is referenced
    labs: FlaskConical,
    onchain: Blocks,
};

const ACCENTS = {
    modules: {
        icon: "bg-[#8A57FF]/12 text-[#8A57FF] dark:bg-[#8A57FF]/20 dark:text-[#B794FF]",
        label: "text-[#8A57FF] dark:text-[#B794FF]",
        glow: "from-[#8A57FF]/14 via-transparent to-transparent",
    },
    handsOn: {
        icon: "bg-cyan-500/12 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200",
        label: "text-cyan-700 dark:text-cyan-300",
        glow: "from-cyan-400/14 via-transparent to-transparent",
    },
    progress: {
        icon: "bg-fuchsia-500/12 text-fuchsia-700 dark:bg-fuchsia-400/15 dark:text-fuchsia-300",
        label: "text-fuchsia-700 dark:text-fuchsia-300",
        glow: "from-fuchsia-400/14 via-transparent to-transparent",
    },
    identity: {
        icon: "bg-indigo-500/12 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200",
        label: "text-indigo-700 dark:text-indigo-200",
        glow: "from-indigo-400/14 via-transparent to-transparent",
    },
    labs: {
        icon: "bg-[#8A57FF]/12 text-[#8A57FF] dark:bg-[#8A57FF]/20 dark:text-[#B794FF]",
        label: "text-[#8A57FF] dark:text-[#B794FF]",
        glow: "from-[#8A57FF]/14 via-transparent to-transparent",
    },
    onchain: {
        icon: "bg-cyan-500/12 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200",
        label: "text-cyan-700 dark:text-cyan-300",
        glow: "from-cyan-400/14 via-transparent to-transparent",
    },
};

const AvailableNow = ({ content }) => {
    const capabilities = content?.capabilities ?? [];
    const alsoExplore = content?.alsoExplore;
    const productPreview = content?.productPreview;

    if (!capabilities.length) return null;

    return (
        <section className="w-full px-6 opacity-100 lg:opacity-0 lg:animate-fadeInSlow duration-500">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.06),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.06),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.10),transparent_38%)]" />

                <div className="relative lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-8 xl:gap-10">
                    {/* LEFT — connected capability system + Also Explore */}
                    <div className="flex min-w-0 flex-col">
                        <div className="mb-5 max-w-2xl lg:mb-5">
                            <SectionBadge label={content.badge} className="mb-4" />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                {content.title}
                            </h2>
                            <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                                {content.description}
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/40 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                            {/* Shared system connectors — 2×2 cross, not a horizontal journey ribbon */}
                            <div
                                className="pointer-events-none absolute inset-0 hidden sm:block"
                                aria-hidden="true"
                            >
                                <div className="absolute left-1/2 top-[10%] bottom-[10%] w-px -translate-x-1/2 bg-gradient-to-b from-[#8A57FF]/30 via-[#4ACBFF]/40 to-[#FF67D2]/30" />
                                <div className="absolute top-1/2 left-[8%] right-[8%] h-px -translate-y-1/2 bg-gradient-to-r from-[#8A57FF]/30 via-[#4ACBFF]/40 to-[#FF67D2]/30" />
                                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] shadow-sm ring-[5px] ring-white/90 dark:ring-slate-900/90" />
                            </div>

                            <div className="relative grid grid-cols-1 sm:grid-cols-2">
                                {capabilities.map((item, index) => {
                                    const Icon = ICONS[item.icon] || BadgeCheck;
                                    const accent = ACCENTS[item.icon] || ACCENTS.labs;
                                    const isRightCol = index % 2 === 1;
                                    const isBottomRow = index >= 2;

                                    return (
                                        <article
                                            key={item.id ?? item.title}
                                            className={[
                                                "relative flex flex-col p-4 sm:p-5 lg:p-[1.15rem]",
                                                index > 0
                                                    ? "border-t border-slate-200/70 dark:border-white/10 sm:border-t-0"
                                                    : "",
                                                isRightCol
                                                    ? "sm:border-l sm:border-slate-200/70 dark:sm:border-white/10"
                                                    : "",
                                                isBottomRow
                                                    ? "sm:border-t sm:border-slate-200/70 dark:sm:border-white/10"
                                                    : "",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            <div
                                                className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${accent.glow} opacity-80`}
                                                aria-hidden="true"
                                            />

                                            <div className="relative flex flex-col gap-3">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.icon}`}
                                                >
                                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                                </div>

                                                <div className="min-w-0">
                                                    {item.systemLabel ? (
                                                        <p
                                                            className={`text-[10px] font-extrabold uppercase tracking-[0.22em] ${accent.label}`}
                                                        >
                                                            {item.systemLabel}
                                                        </p>
                                                    ) : null}
                                                    <h3 className="mt-1 text-base font-bold leading-snug text-slate-900 dark:text-white lg:text-[1.05rem]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {item.description}
                                                    </p>
                                                    {item.cta?.label && item.cta?.href ? (
                                                        <a
                                                            href={item.cta.href}
                                                            className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700 transition hover:translate-x-0.5 dark:text-cyan-200"
                                                        >
                                                            {item.cta.label}
                                                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        {alsoExplore?.links?.length ? (
                            <div className="mt-5 border-t border-slate-200/70 pt-4 dark:border-white/10 lg:mt-6 lg:pt-4">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    {alsoExplore.label}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                    {alsoExplore.links.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 transition hover:text-indigo-900 dark:text-indigo-200 dark:hover:text-white"
                                        >
                                            {link.label}
                                            <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* RIGHT — product preview (heading aligned to screenshot) */}
                    {productPreview ? (
                        <div className="mt-10 min-w-0 lg:mt-0">
                            <div className="relative mx-auto w-full max-lg:w-[107%] max-lg:max-w-[107%] max-lg:-mx-[3.5%] lg:w-[65%] lg:max-w-[65%]">
                                <div className="mb-4 text-center lg:mb-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A57FF] dark:text-[#B794FF]">
                                        {productPreview.eyebrow}
                                    </p>
                                    <h3 className="mx-auto mt-2 max-w-[22rem] text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[1.65rem] lg:max-w-none">
                                        {productPreview.title}
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-[24rem] text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-7 lg:max-w-none">
                                        {productPreview.description}
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950/5 shadow-md shadow-slate-950/10 dark:border-white/10 dark:bg-black/20 dark:shadow-black/30">
                                    <img
                                        src={dashboardPreview}
                                        alt={productPreview.dashboardAlt}
                                        width={1380}
                                        height={1140}
                                        loading="lazy"
                                        decoding="async"
                                        className="block h-auto w-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default AvailableNow;
