import SectionBadge from "./SectionBadge.jsx";

const TeamPreview = ({
    badgeLabel,
    heading,
    subheading,
    cards = [],
    ctaHref,
    ctaLabel,
}) => {
    if (!cards.length) return null;

    return (
        <div className="w-full px-6">
            <div className="mt-8 mb-10 relative overflow-hidden opacity-0 animate-fadeInSlow duration-500" id="team-section">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.18),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.16),transparent_60%)] opacity-70 animate-subtleFloat"></div>
                <div className="relative max-w-6xl mx-auto">
                    <SectionBadge label={badgeLabel} className="mb-4 transition-opacity duration-500" />

                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{heading}</h2>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">{subheading}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {cards.map((card, idx) => (
                            <div
                                key={`${card.name}-${idx}`}
                                className="
                                    p-8 rounded-2xl bg-white/80 dark:bg-slate-900/50
                                    shadow-[0_8px_24px_rgba(15,23,42,0.18)]
                                    border border-slate-200/70 dark:border-slate-700/60
                                    grid grid-rows-[auto_auto_auto_1fr] justify-items-center text-center gap-4
                                    transition-all duration-300
                                    hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(138,87,255,0.35)]
                                    sm:hover:scale-[1.03]
                                    min-h-[400px] sm:min-h-[440px] lg:min-h-[500px]
                                "
                            >
                                <img
                                    src={card.img}
                                    alt={card.alt}
                                    width="160"
                                    height="160"
                                    className="h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full object-cover ring-[10px] ring-[#8A57FF]/30 dark:ring-[#8A57FF]/50 shadow-[0_0_25px_rgba(138,87,255,0.35)]"
                                    loading="lazy"
                                />
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{card.name}</h3>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{card.role}</p>
                                <p className="text-xs italic text-slate-700 dark:text-slate-400 mt-2">{card.quote}</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>
                    {ctaHref && ctaLabel ? (
                        <div className="flex justify-center mt-12">
                            <a href={ctaHref} className="text-base font-semibold px-6 py-2 rounded-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white shadow-md hover:opacity-90 transition-all duration-300 cursor-pointer">
                                {ctaLabel}
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default TeamPreview;
