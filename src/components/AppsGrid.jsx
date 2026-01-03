import { Puzzle, BadgeCheck, Landmark, GraduationCap, Eye, ArrowRight } from "lucide-react";
import { CARD_BACKGROUND_MAP } from "../design/theme.js";
import SectionBadge from "./SectionBadge.jsx";
import { Link } from "react-router-dom";

const iconMap = {
    poe: Puzzle,
    education: GraduationCap,
    nft: BadgeCheck,
    dao: Landmark,
    zkp: Eye,
};

const COLOR_THEME = {
    poe: { ring: "from-fuchsia-400/60 to-purple-500/60", icon: "text-fuchsia-200" },
    education: { ring: "from-sky-300/50 to-blue-400/60", icon: "text-sky-200" },
    nft: { ring: "from-emerald-300/50 to-green-400/60", icon: "text-emerald-200" },
    dao: { ring: "from-indigo-300/50 to-indigo-500/60", icon: "text-indigo-200" },
    zkp: { ring: "from-pink-300/50 to-fuchsia-500/60", icon: "text-pink-200" },
};

const AppsGrid = ({ content, badgeLabel = "Developer’s Corner" }) => (
    <section className="mt-16">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] opacity-70 blur-[2px] pointer-events-none"></div>
        <div className="px-4 mb-10 text-left animate-[slideFade_0.6s_ease-out]">
            <SectionBadge label={badgeLabel} className="mb-4" />

            <div className="relative w-fit">
                <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                    <div className="absolute top-0 left-0 h-full w-[120%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_2s_ease-in-out_infinite]"></div>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-[0_0_20px_rgba(138,87,255,0.35)]">
                    {content.heading || "Web3 Applications & Tools"}
                </h2>
            </div>
        </div>
        {/* Top animated divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent mb-10" />

        <div className="flex flex-col gap-6 px-2 py-6 w-full perspective-[2000px]
      md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:px-0 md:py-10 md:overflow-visible">
            {["poe", "education", "nft", "dao", "zkp"].map((key) => {
                const app = content[key];
                const Icon = iconMap[key];
                const theme = COLOR_THEME[key];

                return (
                    <Link
                        key={key}
                        to={`/${key}`}
                        className="group relative rounded-3xl p-[2px] shadow-xl transition-all
           hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(138,87,255,0.25)]
           hover:[transform:perspective(900px)_rotateX(4deg)_rotateY(-4deg)]
           bg-gradient-to-br from-white/40 to-white/10 
           dark:from-slate-800/30 dark:to-slate-900/40 
           backdrop-blur-xl border border-white/20 w-full md:min-w-0 md:flex-shrink"
                    >
                        <div className="absolute inset-0 bg-white/20 dark:bg-white/5 opacity-0 group-hover:opacity-10 
       transition rounded-3xl pointer-events-none" />
                        <div className={`
    rounded-3xl p-6 sm:p-7 md:p-8 h-full backdrop-blur-xl border border-white/10 
    relative overflow-hidden transition-all
    bg-gradient-to-br 
    ${theme.ring.replace("from-", "from-").replace("to-", "to-")}
    dark:bg-slate-900/70
`}>
                            {/* Inner hologram ring */}
                            <div className={`
        absolute inset-0 rounded-3xl pointer-events-none 
        bg-gradient-to-br ${theme.ring}
        opacity-20 blur-2xl
    `}></div>

                            {/* Content wrapper */}
                            <div className="relative z-10">

                                {/* Hologram Icon */}
                                <div className="relative mb-6 h-20 w-20 animate-[float_4s_ease-in-out_infinite]">
                                    <div className={`
                absolute inset-0 rounded-2xl bg-gradient-to-br ${theme.ring}
                blur-xl opacity-70 group-hover:opacity-100
                transition-all duration-500
                animate-[pulse_3s_ease-in-out_infinite]
            `} />
                                    <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-lg opacity-50" />
                                    <div className="relative flex items-center justify-center h-full w-full">
                                        <Icon className={`h-10 w-10 ${theme.icon} drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]`} />
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight 
            group-hover:text-[#CBB2FF] transition">
                                    {app.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-slate-600 dark:text-white/80 leading-relaxed mb-6">
                                    {app.desc}
                                </p>

                                {/* CTA - themed color */}
                                <div className={`inline-flex items-center gap-2 text-base font-semibold 
      text-slate-700 dark:${theme.icon}`}>
                                    {content.cta}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>

                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>

        {/* Bottom animated divider */}
        <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent" />

        <style>{`
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
@keyframes shine {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}
@keyframes slideFade {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
`}</style>
    </section>
);

export default AppsGrid;
