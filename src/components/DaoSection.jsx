import { Link } from "react-router-dom";
import SectionBadge from "./SectionBadge.jsx";
import daoHolo from "../assets/dao-holo.png";

const DEFAULT_CAPTION = "A living governance layer where students, mentors and partners vote on the evolution of the Web3Edu ecosystem.";

const DEFAULT_STATUS = "preview"; // "preview" | "coming-soon" | "active"

const DaoSection = ({
    content,
    badgeLabel = "Community Governance",
    status = DEFAULT_STATUS,
    previewPath = "/dao-preview",
    governancePath = "/dao-info",
}) => (
    <section className="relative mt-16 overflow-hidden rounded-3xl border border-[#8A57FF]/25 dark:border-[#8A57FF]/30 shadow-2xl">

        {/* Background image + overlay */}
        <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-[#0A0F1A] via-[#111626] to-[#131B2D]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(138,87,255,0.35),transparent_60%)]" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(74,203,255,0.25),transparent_65%)]" aria-hidden="true"></div>

            {/* subtle grid texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px]"></div>

            {/* Central holographic glow spine */}
            <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(138,87,255,0.55),transparent_60%)] blur-3xl opacity-80 animate-pulse"></div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 px-6 py-10 md:px-10 lg:px-14 lg:py-12">
            <div className="grid grid-cols-1 gap-10 items-center md:grid-cols-2">

                {/* LEFT — floating hologram card */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        {/* soft glow */}
                        <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#8A57FF]/40 via-[#FF67D2]/25 to-[#4ACBFF]/30 opacity-80 blur-2xl"></div>

                        <div className="relative rounded-3xl border border-white/25 bg-white/10 dark:bg-slate-900/35 p-6 shadow-xl backdrop-blur-2xl animate-[float_6s_ease-in-out_infinite]">
                            <img
                                src={daoHolo}
                                alt="DAO Governance Hologram"
                                className="h-52 w-52 md:h-60 md:w-60 object-contain drop-shadow-[0_0_32px_rgba(138,87,255,0.85)]"
                            />
                            <p className="mt-4 text-xs md:text-sm text-[#CBB2FF]/90 max-w-[14rem] leading-snug text-center mx-auto">
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
                            {status === "preview" ? "Planned" : "Coming Soon"}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
                        {content.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed md:leading-loose text-white/80">
                        {content.desc}
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <Link
                            to={status === "active" ? "/dao" : previewPath}
                            className="inline-flex items-center gap-2 rounded-full bg-[#8A57FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(138,87,255,0.45)] transition hover:bg-[#7A4DE5] hover:shadow-[0_0_18px_rgba(138,87,255,0.55)]"
                        >
                            {status === "active" ? content.buttons.enter : "Explore DAO"} ↗
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
