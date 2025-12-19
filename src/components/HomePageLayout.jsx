import Hero from "./Hero.jsx";
import HeroGR from "./HeroGR.jsx";
import PageShell from "./PageShell.jsx";
import Motivation from "./Motivation.jsx";
import LearningPath from "./LearningPath.jsx";
import DaoSection from "./DaoSection.jsx";
import AppsGrid from "./AppsGrid.jsx";
import NewsSection from "./NewsSection.jsx";
import SectionBadge from "./SectionBadge.jsx";
import { ACCENT_PRIMARY } from "../design/theme.js";

const HomePageLayout = ({
    heroContent,
    motivationContent,
    motivationHeading,
    motivationImage,
    motivationImageAlt,
    learnPathContent,
    daoContent,
    appsContent,
    newsContent,
    footerContent,
    featureCards = [],
    motivationBadgeLabel = "Why Web3Edu",
    learnBadgeLabel = "Learning Journey",
    teamBadgeLabel,
    teamHeading,
    teamSubheading,
    teamCards = [],
    teamCtaHref,
    teamCtaLabel,
    daoBadgeLabel = "Community Governance",
    appsBadgeLabel = "Developer’s Corner",
}) => {
    return (
        <>
            {heroContent?.lang === "gr" ? <HeroGR content={heroContent} /> : <Hero content={heroContent} />}
            <PageShell accentColor={ACCENT_PRIMARY}>
                <style>{`html { scroll-behavior: smooth; }

@keyframes holoShimmer {
  0% { opacity: 0; transform: translateX(-20%); }
  50% { opacity: 0.5; transform: translateX(20%); }
  100% { opacity: 0; transform: translateX(60%); }
}
.animate-holoShimmer {
  animation: holoShimmer 4s linear infinite;
}
`}</style>

                <div className="w-full px-6 mt-6 mb-4 opacity-0 animate-fadeInSlow duration-500">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                        {featureCards && featureCards.map((card, idx) => (
                            <div
                                key={`feature-card-${idx}`}
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

                <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/80 dark:bg-slate-900/60 shadow-xl hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)] sm:hover:scale-[1.015] border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-sm overflow-visible relative">
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/20 to-[#FF67D2]/20 blur-3xl"></div>

                        <SectionBadge label={motivationBadgeLabel} className="mb-4 transition-opacity duration-500" />
                        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20 mb-4"></div>
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]"></div>
                            <h2 id="motivation" className="text-4xl font-bold text-slate-800 dark:text-slate-100 scroll-mt-24">
                                {motivationHeading}
                            </h2>
                        </div>

                        <div className="relative flex flex-col lg:flex-row gap-10 items-center">
                            <div className="flex-1 px-2 md:px-4">
                                <Motivation content={motivationContent} />
                            </div>
                            <div className="relative flex-1 flex lg:flex items-center justify-center mt-4 max-w-[85%] sm:max-w-[70%] mx-auto mb-6 lg:mb-0 overflow-hidden">
                                <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/20 to-[#FF67D2]/20 blur-3xl"></div>
                                <img src={motivationImage} alt={motivationImageAlt} className="relative z-10 w-52 sm:w-64 opacity-90 animate-subtleFloat transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>
                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    <LearningPath content={learnPathContent} badgeLabel={learnBadgeLabel} />
                </div>
                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/80 dark:bg-slate-900/60 shadow-xl hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)] sm:hover:scale-[1.015] border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-sm">
                        <AppsGrid content={appsContent} badgeLabel={appsBadgeLabel} />
                    </div>
                </div>
                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/80 dark:bg-slate-900/60 shadow-xl hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)] sm:hover:scale-[1.015] border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-sm">
                        <DaoSection content={daoContent} badgeLabel={daoBadgeLabel} />
                    </div>
                </div>
                <div className="w-full my-8" aria-hidden="true"></div>

                <div className="w-full px-6">
                    <div className="mt-8 mb-10 relative overflow-hidden opacity-0 animate-fadeInSlow duration-500">
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.18),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(74,203,255,0.16),transparent_60%)] opacity-70 animate-subtleFloat"></div>
                        <div className="relative max-w-6xl mx-auto">
                            <SectionBadge label={teamBadgeLabel} className="mb-4 transition-opacity duration-500" />

                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{teamHeading}</h2>
                            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">{teamSubheading}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                                {teamCards.map((card, idx) => (
                                    <div key={`team-card-${idx}`} className="
    p-8 rounded-2xl bg-white/80 dark:bg-slate-900/50
    shadow-[0_8px_24px_rgba(15,23,42,0.18)]
    border border-slate-200/70 dark:border-slate-700/60
    grid grid-rows-[auto_auto_auto_1fr] justify-items-center text-center gap-4
    transition-all duration-300
    hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(138,87,255,0.35)]
    sm:hover:scale-[1.03]
    min-h-[400px] sm:min-h-[440px] lg:min-h-[500px]
  ">
                                        <img src={card.img} className="h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 rounded-full object-cover ring-[10px] ring-[#8A57FF]/30 dark:ring-[#8A57FF]/50 shadow-[0_0_25px_rgba(138,87,255,0.35)]" alt={card.alt} />
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{card.name}</h3>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{card.role}</p>
                                        <p className="text-xs italic text-slate-700 dark:text-slate-400 mt-2">{card.quote}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>
                            <div className="flex justify-center mt-12">
                                <a href={teamCtaHref} className="text-base font-semibold px-6 py-2 rounded-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white shadow-md hover:opacity-90 transition-all duration-300">
                                    {teamCtaLabel}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500 hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)] sm:hover:scale-[1.015] transition-all duration-300">
                    <NewsSection content={newsContent} />
                </div>

            </PageShell>
        </>
    );
};

export default HomePageLayout;
