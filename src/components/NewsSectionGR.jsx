const NewsSection = ({ content }) => {
    // Helper to deterministically parse month-year dates like "Jan 2026"
    const parseMonthYear = (str) => {
        if (!str || typeof str !== "string") return new Date(0);
        const [month, year] = str.trim().split(/\s+/);
        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Sept: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        };
        const m = months[month] ?? 0;
        const y = Number.parseInt(year, 10);
        return new Date(Number.isFinite(y) ? y : 1970, m, 1);
    };

    return (
        <>
            <style>{`
        @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(35px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.7s ease-out forwards;
        }

        @keyframes pulseSlow {
            0% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 0.85; }
        }
        .animate-pulseSlow {
            animation: pulseSlow 2.8s ease-in-out infinite;
        }
    `}</style>
            <section className="relative mt-12 rounded-3xl p-8 border border-[#8A57FF]/25 
    bg-gradient-to-br from-[#F6F1FF]/80 via-white/70 to-[#EAF8FF]/80 
    shadow-xl 
    dark:bg-gradient-to-br dark:from-[#0A0F1A]/70 dark:via-[#111626]/60 dark:to-[#131B2D]/70 
    dark:border-[#8A57FF]/35">
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                        🗓 {content.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative pl-6">
                    {/* Vertical line */}
                    <div className="absolute top-0 left-2 w-[3px] h-full bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] 
dark:from-[#8A57FF]/80 dark:via-[#4ACBFF]/80 dark:to-[#FF67D2]/80 rounded-full"></div>

                    <div className="space-y-10">
                        {[...content.items]
                            .sort((a, b) => parseMonthYear(b.date) - parseMonthYear(a.date))
                            .map((n, i) => (
                                <div key={i} className="relative opacity-0 animate-fadeInUp" style={{ animationDelay: `${0.25 * i}s` }}>
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[10px] top-1 h-4 w-4 bg-[#8A57FF] dark:bg-[#CBB2FF] border-[3px] border-white dark:border-slate-900 rounded-full shadow-md animate-pulseSlow"></div>

                                    {/* Card */}
                                    <div className="ml-4 rounded-2xl bg-white/95 dark:bg-slate-900/70 p-5 shadow-md border border-[#8A57FF]/20 dark:border-[#8A57FF]/35 hover:shadow-[0_0_20px_rgba(138,87,255,0.25)] transition-all">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#E9D8FF] text-[#8A57FF] 
dark:bg-[#1C1A3A]/50 dark:text-[#CBB2FF]">
                                            {n.date}
                                        </span>

                                        <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">
                                            {n.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {n.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default NewsSection;