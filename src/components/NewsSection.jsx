import SectionBadge from "./SectionBadge.jsx";

const NewsSection = ({ content }) => (
    <section className="relative z-10 mt-24 rounded-3xl p-10 border 
                      bg-gradient-to-br from-[#F6F1FF]/70 via-white/60 to-[#EAF8FF]/70 
                      dark:bg-gradient-to-br dark:from-[#0A0F1A]/60 dark:via-[#111626]/50 dark:to-[#131B2D]/50 
                      shadow-xl backdrop-blur-2xl overflow-hidden">

        {/* ✨ Particle Float Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-particleSlow absolute w-1.5 h-1.5 rounded-full bg-[#8A57FF]/30 top-1/3 left-1/3 blur-[1px]"></div>
        </div>

        {/* 🔮 Vertical Neon Spine */}
        <div className="absolute left-6 top-0 h-full w-[4px] z-0 bg-gradient-to-b 
             from-[#8A57FF] via-[#FF67D2] to-[#4ACBFF] 
             opacity-70 rounded-full 
             shadow-[0_0_20px_rgba(138,87,255,0.85)] blur-[0.4px]"></div>

        {/* 🌐 Neon Node Network (Faint Background) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none z-0">
            <circle cx="120" cy="180" r="3" fill="#4ACBFF" />
            <circle cx="260" cy="420" r="2.5" fill="#8A57FF" />
            <circle cx="480" cy="260" r="3" fill="#FF67D2" />
        </svg>

        {/* Section Header */}
        <div className="ml-16 mb-10 max-w-4xl relative z-20">
            <SectionBadge label={content.badge || content.title || "News"} className="mb-6" />

            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {content.title}
            </h2>
            <p className="text-base text-slate-700 dark:text-slate-300 mt-2 max-w-4xl leading-relaxed whitespace-normal break-words">
                {content.subtitle}
            </p>
            <div className="flex gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#8A57FF]"></span> Event</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#4ACBFF]"></span> Release</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#7BE88B]"></span> Update</div>
            </div>

            <a
                href="/#/news"
                className="inline-flex items-center gap-2 mt-3 text-[#8A57FF] dark:text-[#CBB2FF] text-xs underline hover:text-[#7A4DE5]"
            >
                {content.viewArchive} ↗
            </a>
        </div>

        <div className="ml-16 h-8 w-[3px] bg-slate-300/50 dark:bg-slate-600/50 rounded-full mb-8"></div>

        <div className="absolute left-10 top-0 h-full w-[2px] z-0 bg-gradient-to-b from-[#8A57FF]/20 via-[#FF67D2]/15 to-[#4ACBFF]/15 rounded-full blur-[1px]"></div>

        {/* Timeline */}
        <div className="ml-24 space-y-16 relative z-10">

            {content.items.map((n, i) => (
                <div
                    key={i}
                    className="relative pl-6 border-l border-slate-400/70 dark:border-slate-700/50 animate-fadeInUp"
                    style={{ animationDelay: `${0.25 * i}s` }}
                >
                    {/* Glowing Dot */}
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full shadow-xl ring-2 ring-white/60 dark:ring-indigo-900/40 animate-pulseSlow ${n.category === "event"
                        ? "bg-gradient-to-br from-[#8A57FF] to-[#FF67D2]"
                        : n.category === "release"
                            ? "bg-gradient-to-br from-[#4ACBFF] to-[#8AE2FF]"
                            : n.category === "update"
                                ? "bg-gradient-to-br from-[#7BE88B] to-[#36C870]"
                                : "bg-gradient-to-br from-[#8A57FF] to-[#B08BFF]"
                        }`}></div>

                    {/* Month Label */}
                    {n.monthLabel && (
                        <div className="absolute -left-32 top-0 text-right pr-3 w-28 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {n.monthLabel}
                        </div>
                    )}

                    {/* News Card */}
                    <div className={`mt-3 p-6 rounded-2xl 
    ${n.category === "event"
                            ? "bg-gradient-to-br from-[#E9D8FF]/55 via-[#FAD0F0]/45 to-[#FFD4EC]/55"
                            : n.category === "release"
                                ? "bg-gradient-to-br from-[#D4F1FF]/55 via-[#D9F6FF]/45 to-[#E0E2FF]/55"
                                : n.category === "update"
                                    ? "bg-gradient-to-br from-[#E4FFE9]/55 via-[#D8FFE3]/45 to-[#E9FFDA]/55"
                                    : "bg-gradient-to-br from-[#E9D8FF]/55 via-[#D7E9FF]/45 to-[#D9F7FF]/55"
                        }
    ${n.category === "event"
                            ? "dark:from-[#3A2A66]/55 dark:via-[#5A2C50]/45 dark:to-[#5A1F3D]/45"
                            : n.category === "release"
                                ? "dark:from-[#0B3A5C]/55 dark:via-[#0A2E4A]/45 dark:to-[#1C1A3A]/45"
                                : n.category === "update"
                                    ? "dark:from-[#123A1B]/55 dark:via-[#0F2F17]/45 dark:to-[#1F2F0F]/45"
                                    : "dark:from-[#1C1A3A]/55 dark:via-[#3A2A66]/45 dark:to-[#0A2E4A]/45"
                        }
    shadow-xl border border-white/20 dark:border-slate-700/40
    backdrop-blur-xl hover:shadow-[0_0_20px_rgba(138,87,255,0.25)]
    transition-all duration-300 animate-elasticIn`}>

                        {/* Category Icon */}
                        <span className="mr-1 text-lg">
                            {n.category === "event" ? "🎉" : n.category === "release" ? "🪩" : n.category === "update" ? "📢" : "✨"}
                        </span>

                        {/* Category Tag */}
                        {n.category && (
                            <span className={`text-xs px-2.5 py-1 mr-2 rounded-full font-medium 
                              animate-pulseSlow 
                              ${n.category === "event" ? "bg-purple-200/70 text-purple-900" : ""} 
                              ${n.category === "release" ? "bg-blue-200/70 text-blue-900" : ""} 
                              ${n.category === "update" ? "bg-green-200/70 text-green-900" : ""}`}>
                                {n.category.toUpperCase()}
                            </span>
                        )}

                        {/* Date Badge */}
                        <span className="text-xs px-2 py-1 rounded-full from-[#E9D8FF]/70 to-[#D7E9FF]/70 dark:from-[#1C1A3A]/40 dark:to-[#3A2A66]/40 text-[#8A57FF] dark:text-[#CBB2FF] border border-[#8A57FF]/20 dark:border-[#8A57FF]/35 bg-gradient-to-r">
                            {n.date}
                        </span>

                        <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white 
    leading-snug tracking-tight drop-shadow-[0_0_10px_rgba(99,102,241,0.25)]">
                            {n.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed">
                            {n.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

<style>{`
@keyframes elasticIn {
  0% { opacity: 0; transform: scale(0.6) translateY(40px); }
  60% { opacity: 1; transform: scale(1.05) translateY(-6px); }
  100% { transform: scale(1) translateY(0); }
}
.animate-elasticIn {
  animation: elasticIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes particleSlow {
  0% { transform: translateY(0) translateX(0); opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { transform: translateY(-40px) translateX(20px); opacity: 0.4; }
}
.animate-particleSlow { animation: particleSlow 14s ease-in-out infinite; }

@keyframes particleSlow2 {
  0% { transform: translateY(0) scale(1); opacity: 0.35; }
  100% { transform: translateY(-60px) scale(1.3); opacity: 0.35; }
}
.animate-particleSlow2 { animation: particleSlow2 18s linear infinite; }

@keyframes particleSlow3 {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  100% { transform: translateY(-30px) scale(0.9); opacity: 0.3; }
}
.animate-particleSlow3 { animation: particleSlow3 16s ease-in-out infinite; }

@keyframes pulseSlow {
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
}
.animate-pulseSlow { animation: pulseSlow 2s ease-in-out infinite; }

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(35px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 0.7s ease-out forwards;
}
`}</style>

export default NewsSection;
