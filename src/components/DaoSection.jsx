import { Link } from "react-router-dom";
import SectionBadge from "./SectionBadge.jsx";
import daoHolo from "../assets/dao-holo.webp";

const DEFAULT_CAPTION = "A research track for participation models, governance experiments, and community feedback loops.";

const DEFAULT_STATUS = "preview"; // "preview" | "coming-soon" | "active"

const DaoSection = ({
    content,
    badgeLabel = "Community Governance",
    status = DEFAULT_STATUS,
    previewPath = "/dao-preview",
    governancePath = "/dao-info",
}) => (
    <section className="relative mt-10 overflow-hidden rounded-2xl border border-[#8A57FF]/18 dark:border-[#8A57FF]/24 shadow-lg">

        {/* Background image + overlay */}
        <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-[#0A0F1A] via-[#111626] to-[#131B2D]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.22),transparent_52%)]" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.16),transparent_58%)]" aria-hidden="true"></div>

            {/* subtle grid texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px]"></div>

            {/* Central holographic glow spine */}
            <div className="pointer-events-none absolute -bottom-28 right-10 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_center,rgba(138,87,255,0.34),transparent_62%)] blur-3xl opacity-60"></div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 px-6 py-7 md:px-8 lg:px-10 lg:py-8">
            <div className="grid grid-cols-1 gap-6 items-center md:grid-cols-[0.72fr_1.28fr]">

                {/* LEFT — floating hologram card */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        {/* soft glow */}
                        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#8A57FF]/28 via-[#FF67D2]/16 to-[#4ACBFF]/18 opacity-70 blur-2xl"></div>

                        <div className="relative rounded-2xl border border-white/18 bg-white/8 dark:bg-slate-900/30 p-4 shadow-lg backdrop-blur-2xl">
                            <img src={daoHolo}
                                alt="Governance research hologram"
                                className="h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-[0_0_20px_rgba(138,87,255,0.6)]" loading="lazy" />
                            <p className="mt-3 text-[11px] md:text-xs text-[#CBB2FF]/85 max-w-[12rem] leading-snug text-center mx-auto">
                                {content.imageCaption || DEFAULT_CAPTION}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT — text + CTAs */}
                <div className="text-left text-white">

                    {/* eyebrow badge */}
                    <SectionBadge label={badgeLabel} variant="dark" className="mb-2" />

                    {/* status badge */}
                    {status !== "active" && (
                        <div className="mt-2 inline-flex items-center rounded-full border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                            {status === "preview" ? "Research Track" : "Coming Soon"}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                        {content.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/78">
                        {content.desc}
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <Link
                            to={status === "active" ? "/dao" : previewPath}
                            className="inline-flex items-center gap-2 rounded-full bg-[#8A57FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(138,87,255,0.45)] transition hover:bg-[#7A4DE5] hover:shadow-[0_0_18px_rgba(138,87,255,0.55)]"
                        >
                            {content.buttons.enter} ↗
                        </Link>

                        <Link
                            to={governancePath}
                            className="inline-flex items-center gap-2 rounded-full border border-[#8A57FF]/40 bg-slate-900/40 px-5 py-2.5 text-sm font-semibold text-[#CBB2FF] backdrop-blur-xl transition hover:border-[#CBB2FF] hover:bg-slate-900/70"
                        >
                            {content.buttons.learn} ↗
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default DaoSection;
