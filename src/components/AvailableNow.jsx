import {
    ArrowRight,
    BadgeCheck,
    Blocks,
    FlaskConical,
    Fingerprint,
} from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";
import dashboardPreview from "../assets/home/web3edu-dashboard-preview.png";
import profilePreview from "../assets/home/verifiable-profile-preview.png";

const ICONS = {
    labs: FlaskConical,
    onchain: Blocks,
    progress: BadgeCheck,
    identity: Fingerprint,
};

const ICON_STYLES = {
    labs: "bg-[#8A57FF]/12 text-[#8A57FF] dark:bg-[#8A57FF]/20 dark:text-[#B794FF]",
    onchain: "bg-cyan-500/12 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200",
    progress: "bg-fuchsia-500/12 text-fuchsia-700 dark:bg-fuchsia-400/15 dark:text-fuchsia-300",
    identity: "bg-indigo-500/12 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200",
};

const AvailableNow = ({ content }) => {
    const capabilities = content?.capabilities ?? [];
    const alsoExplore = content?.alsoExplore;
    const productPreview = content?.productPreview;

    if (!capabilities.length) return null;

    return (
        <section className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.06),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.06),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.10),transparent_38%)]" />

                <div className="relative lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-8 xl:gap-10">
                    {/* LEFT — capabilities + Also Explore */}
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

                        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-3.5">
                            {capabilities.map((item) => {
                                const Icon = ICONS[item.icon] || BadgeCheck;
                                const iconStyle = ICON_STYLES[item.icon] || ICON_STYLES.labs;

                                return (
                                    <article
                                        key={item.id ?? item.title}
                                        className="rounded-2xl border border-slate-200/75 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04] lg:p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:h-10 lg:w-10 ${iconStyle}`}
                                            >
                                                <Icon className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white lg:text-[1.05rem]">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
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

                    {/* RIGHT — product preview */}
                    {productPreview ? (
                        <div className="mt-10 min-w-0 overflow-visible lg:mt-0 lg:pr-14">
                            <div className="mb-4 max-w-xl lg:mb-4">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A57FF] dark:text-[#B794FF]">
                                    {productPreview.eyebrow}
                                </p>
                                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[1.65rem]">
                                    {productPreview.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-7">
                                    {productPreview.description}
                                </p>
                            </div>

                            <div className="relative mx-auto w-full max-w-xl max-lg:w-[107%] max-lg:max-w-[107%] max-lg:-mx-[3.5%] overflow-visible lg:mx-0 lg:mr-auto lg:w-[72%] lg:max-w-[72%]">
                                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950/5 shadow-md shadow-slate-950/10 dark:border-white/10 dark:bg-black/20 dark:shadow-black/30">
                                    <img
                                        src={dashboardPreview}
                                        alt={productPreview.dashboardAlt}
                                        width={1184}
                                        height={970}
                                        loading="lazy"
                                        decoding="async"
                                        className="block h-auto w-full object-contain"
                                    />
                                </div>

                                <div className="pointer-events-none absolute bottom-0 right-0 z-10 hidden w-[clamp(14rem,35%,18.5rem)] translate-x-[38%] translate-y-[8%] lg:block">
                                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-950/15 dark:border-white/15 dark:bg-slate-900 dark:shadow-black/40">
                                        <img
                                            src={profilePreview}
                                            alt={productPreview.profileAlt}
                                            width={1614}
                                            height={396}
                                            loading="lazy"
                                            decoding="async"
                                            className="block h-auto w-full rounded-lg object-contain"
                                        />
                                    </div>
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
