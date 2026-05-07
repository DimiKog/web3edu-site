const HomeFeatureCards = ({ cards = [] }) => {
    if (!cards.length) return null;

    return (
        <div className="w-full px-6 mt-6 mb-4 opacity-0 animate-fadeInSlow duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                {cards.map((card, idx) => (
                    <div
                        key={`${card.title}-${idx}`}
                        className="
                            rounded-2xl
                            p-8
                            bg-white/70 dark:bg-slate-900/50
                            border border-slate-200/70 dark:border-slate-700/60
                            shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                            transition duration-300 hover:-translate-y-[2px]
                            hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)]
                            sm:hover:scale-[1.02]
                        "
                    >
                        <div className="
                            w-11 h-11 min-w-[44px] mx-auto rounded-2xl
                            bg-[#F5EEFF] dark:bg-[#221B3A]
                            flex items-center justify-center
                            mb-3 shadow-inner shadow-[0_0_12px_rgba(138,87,255,0.15)]
                        ">
                            <span className="text-2xl">{card.icon}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                            {card.title}
                        </h3>

                        {card.subtitle && (
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {card.subtitle}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeFeatureCards;
