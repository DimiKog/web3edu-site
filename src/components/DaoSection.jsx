import SectionBadge from "./SectionBadge.jsx";
import daoHolo from "../assets/dao-holo.png";

const DEFAULT_CAPTION = "A living governance layer where students, mentors and partners vote on the evolution of the Web3Edu ecosystem.";

const DaoSection = ({ content, badgeLabel = "Community Governance" }) => (
    <section className="relative mt-16 overflow-hidden rounded-3xl border border-indigo-200/40 dark:border-indigo-700/40 shadow-2xl">

        {/* Background image + overlay */}
        <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-slate-950 via-indigo-900/60 to-slate-950"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_60%)]" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.25),transparent_65%)]" aria-hidden="true"></div>

            {/* subtle grid texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px]"></div>

            {/* Central holographic glow spine */}
            <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.65),transparent_60%)] blur-3xl opacity-80 animate-pulse"></div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 px-6 py-10 md:px-10 lg:px-14 lg:py-12">
            <div className="grid grid-cols-1 gap-10 items-center md:grid-cols-2">

                {/* LEFT — floating hologram card */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        {/* soft glow */}
                        <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/25 to-sky-400/30 opacity-80 blur-2xl"></div>

                        <div className="relative rounded-3xl border border-white/25 bg-white/10 dark:bg-slate-900/35 p-6 shadow-xl backdrop-blur-2xl animate-[float_6s_ease-in-out_infinite]">
                            <img
                                src={daoHolo}
                                alt="DAO Governance Hologram"
                                className="h-52 w-52 md:h-60 md:w-60 object-contain drop-shadow-[0_0_32px_rgba(129,140,248,0.9)]"
                            />
                            <p className="mt-4 text-xs md:text-sm text-indigo-50/90 max-w-[14rem] leading-snug text-center mx-auto">
                                {content.imageCaption || DEFAULT_CAPTION}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT — text + CTAs */}
                <div className="text-left text-slate-50">

                    {/* eyebrow badge */}
                    <SectionBadge label={badgeLabel} variant="dark" className="mb-2" />

                    {/* Title */}
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                        {content.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-100/85">
                        {content.desc}
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <a
                            href="/#/dao"
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 hover:shadow-indigo-400/40"
                        >
                            {content.buttons.enter} ↗
                        </a>

                        <a
                            href="/#/dao-info"
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-slate-900/40 px-5 py-2.5 text-sm font-semibold text-indigo-100 backdrop-blur-xl transition hover:border-indigo-100 hover:bg-slate-900/70"
                        >
                            {content.buttons.learn} ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default DaoSection;
