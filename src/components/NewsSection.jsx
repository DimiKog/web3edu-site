import SectionBadge from "./SectionBadge.jsx";

const NewsSection = ({ content }) => (
    <section className="relative mt-24 rounded-3xl p-10 border 
                      bg-gradient-to-br from-indigo-50/70 via-purple-50/60 to-sky-50/70 
                      dark:bg-gradient-to-br dark:from-slate-900/60 dark:via-slate-800/50 dark:to-indigo-900/50 
                      shadow-xl backdrop-blur-2xl overflow-hidden">

        {/* ✨ Particle Float Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-particleSlow absolute w-1.5 h-1.5 rounded-full bg-indigo-400/30 top-1/3 left-1/3 blur-[1px]"></div>
        </div>

        {/* 🔮 Vertical Neon Spine */}
        <div className="absolute left-6 top-0 h-full w-[4px] bg-gradient-to-b 
             from-indigo-500 via-fuchsia-400 to-sky-400 
             opacity-70 rounded-full 
             shadow-[0_0_20px_rgba(99,102,241,0.9)] blur-[0.4px]"></div>

        {/* 🌐 Neon Node Network (Faint Background) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none">
            <circle cx="120" cy="180" r="3" fill="#7dd3fc" />
            <circle cx="260" cy="420" r="2.5" fill="#c084fc" />
            <circle cx="480" cy="260" r="3" fill="#93c5fd" />
        </svg>

        {/* Section Header */}
        <div className="ml-20 mb-10">
            <SectionBadge label={content.badge || content.title || "News"} className="mb-6" />

            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {content.title}
            </h2>
            <p className="text-base text-slate-700 dark:text-slate-300 mt-2 max-w-2xl">
                {content.subtitle}
            </p>
            <div className="flex gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Event</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Release</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Update</div>
            </div>

            <a
                href="/#/news"
                className="inline-flex items-center gap-2 mt-3 text-indigo-700 dark:text-indigo-300 text-xs underline hover:text-indigo-500"
            >
                {content.viewArchive} ↗
            </a>
        </div>

        {/* Timeline */}
        <div className="ml-20 space-y-16 relative">

            {content.items.map((n, i) => (
                <div
                    key={i}
                    className="relative pl-6 border-l border-slate-400/70 dark:border-slate-700/50 opacity-0 animate-fadeInSlow"
                    style={{ animationDelay: `${0.15 * i}s` }}
                >
                    {/* Glowing Dot */}
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full shadow-xl ring-2 ring-white/60 dark:ring-indigo-900/40 animate-pulseSlow ${n.category === "event"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : n.category === "release"
                                ? "bg-gradient-to-br from-blue-500 to-sky-500"
                                : n.category === "update"
                                    ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                    : "bg-gradient-to-br from-indigo-500 to-violet-500"
                        }`}></div>

                    {/* Month Label */}
                    {n.monthLabel && (
                        <div className="absolute -left-32 top-0 text-right pr-3 w-24 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {n.monthLabel}
                        </div>
                    )}

                    {/* News Card */}
                    <div className={`mt-3 p-6 rounded-2xl 
    ${n.category === "event"
                            ? "bg-gradient-to-br from-purple-200/55 via-fuchsia-200/45 to-pink-200/55"
                            : n.category === "release"
                                ? "bg-gradient-to-br from-blue-200/55 via-sky-200/45 to-indigo-200/55"
                                : n.category === "update"
                                    ? "bg-gradient-to-br from-green-200/55 via-emerald-200/45 to-lime-200/55"
                                    : "bg-gradient-to-br from-indigo-200/55 via-purple-200/45 to-sky-200/55"
                        }
    ${n.category === "event"
                            ? "dark:from-purple-900/55 dark:via-fuchsia-900/45 dark:to-pink-900/45"
                            : n.category === "release"
                                ? "dark:from-blue-900/55 dark:via-sky-900/45 dark:to-indigo-900/45"
                                : n.category === "update"
                                    ? "dark:from-green-900/55 dark:via-emerald-900/45 dark:to-lime-900/45"
                                    : "dark:from-indigo-900/55 dark:via-purple-900/45 dark:to-sky-900/45"
                        }
    shadow-xl border border-white/20 dark:border-slate-700/40
    backdrop-blur-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
    transition-all duration-300 animate-elasticIn`}>

                        {/* Category Icon */}
                        <span className="mr-1 text-lg">
                            {n.category === "event" ? "🎉" : n.category === "release" ? "🪩" : n.category === "update" ? "📢" : "✨"}
                        </span>

                        {/* Category Tag */}
                        {n.category && (
                            <span className={`text-xs px-2 py-1 mr-2 rounded-full font-medium 
                              animate-pulseSlow 
                              ${n.category === "event" ? "bg-purple-200/70 text-purple-900" : ""} 
                              ${n.category === "release" ? "bg-blue-200/70 text-blue-900" : ""} 
                              ${n.category === "update" ? "bg-green-200/70 text-green-900" : ""}`}>
                                {n.category.toUpperCase()}
                            </span>
                        )}

                        {/* Date Badge */}
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-indigo-200/70 to-purple-200/70 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-200 border border-indigo-300/30 dark:border-indigo-800/40">
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
`}</style>

export default NewsSection;
