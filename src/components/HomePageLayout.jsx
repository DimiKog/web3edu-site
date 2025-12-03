import Hero from "./Hero.jsx";
import HeroGR from "./HeroGR.jsx";
import PageShell from "./PageShell.jsx";
import Motivation from "./Motivation.jsx";
import LearningPath from "./LearningPath.jsx";
import DaoSection from "./DaoSection.jsx";
import AppsGrid from "./AppsGrid.jsx";
import NewsSection from "./NewsSection.jsx";
import Footer from "./Footer.jsx";
import SectionBadge from "./SectionBadge.jsx";
import { ACCENT_PRIMARY } from "../design/theme.js";

const FEATURE_ICONS = [
    (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-500 dark:text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5a2.25 2.25 0 00-4.5 0v4.5m4.5 0a3 3 0 11-6 0m6 0v6a3 3 0 11-6 0v-6m6 0H9" />
        </svg>
    ),
    (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-500 dark:text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6h3.75a2.25 2.25 0 012.25 2.25v9.75a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-9.75A2.25 2.25 0 016.75 6H10.5m3 0V4.125c0-.621-.504-1.125-1.125-1.125S11.25 3.504 11.25 4.125V6m3 0H9m3 0v12" />
        </svg>
    ),
    (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-500 dark:text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75h4.5l3 3v7.5a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5v-7.5l3-3zM12 10.5v6m-3-3h6" />
        </svg>
    ),
    (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-indigo-500 dark:text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5a4.5 4.5 0 019 0v6a4.5 4.5 0 019 0v-6a9 9 0 10-18 0v6z" />
        </svg>
    )
];

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

                <div className="w-full px-6 mt-6 mb-4 opacity-0 animate-fadeInSlow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {featureCards && featureCards.map((card, idx) => (
                            <div
                                key={`feature-card-${idx}`}
                                className={
                                    `
                                        rounded-3xl 
                                        p-7 
                                        shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                                        transition 
                                        duration-300 
                                        hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]
                                        hover:-translate-y-0.5
                                        border border-slate-200/50 dark:border-slate-700/40
                                        ${idx === 0 ? 'bg-[#e8faff] dark:bg-[#0a3a46]' : ''}
                                        ${idx === 1 ? 'bg-[#f3eaff] dark:bg-[#2d1b46]' : ''}
                                        ${idx === 2 ? 'bg-[#fef7e8] dark:bg-[#4a3c1a]' : ''}
                                        ${idx === 3 ? 'bg-[#e8f4ff] dark:bg-[#132b46]' : ''}
                                    `
                                }
                            >
                                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                                    <span className="text-2xl">{card.icon}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                    {card.title}
                                </h3>

                                {card.subtitle && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {card.subtitle}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full my-16" aria-hidden="true"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow">
                    <div className="rounded-3xl p-10 bg-white/80 dark:bg-slate-900/60 shadow-xl border border-slate-200/60 dark:border-slate-700/40 backdrop-blur-sm overflow-visible relative">
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-holoShimmer"></div>

                        <SectionBadge label={motivationBadgeLabel} className="mb-4" />
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-indigo-400 via-purple-400 to-indigo-500"></div>
                            <h2 id="motivation" className="text-4xl font-bold text-slate-900 dark:text-slate-100 scroll-mt-24">
                                {motivationHeading}
                            </h2>
                        </div>

                        <div className="relative flex flex-col lg:flex-row gap-10 items-center">
                            <div className="flex-1 px-2 md:px-4">
                                <Motivation content={motivationContent} />
                            </div>
                            <div className="relative flex-1 flex lg:flex items-center justify-center mt-4 max-w-[70%] mx-auto mb-6 lg:mb-0 overflow-hidden">
                                <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-blue-500/20 blur-3xl"></div>
                                <img src={motivationImage} alt={motivationImageAlt} className="relative z-10 w-64 opacity-90 animate-subtleFloat" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px mt-8 mb-8 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-60"></div>
                <div className="w-full px-6 opacity-0 animate-fadeInSlow overflow-visible">
                    <LearningPath content={learnPathContent} badgeLabel={learnBadgeLabel} />
                </div>
                <div className="w-full h-px mt-8 mb-8 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-60"></div>

                <div className="w-full px-6">
                    <div className="mt-12 mb-12 relative overflow-hidden opacity-0 animate-fadeInSlow [animation-delay:0.15s]">
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.12),transparent_60%)] opacity-70 animate-subtleFloat"></div>
                        <div className="relative max-w-6xl mx-auto">
                            <SectionBadge label={teamBadgeLabel} className="mb-6" />

                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{teamHeading}</h2>
                            <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">{teamSubheading}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {teamCards.map((card, idx) => (
                                    <div key={`team-card-${idx}`} className="p-9 rounded-2xl bg-white/80 dark:bg-slate-900/50 shadow-lg border border-slate-200/60 dark:border-slate-700 items-center text-center gap-4 hover:shadow-2xl hover:scale-[1.03] hover:shadow-indigo-300/50 hover:border-indigo-300 transition duration-500 min-h-[560px] hover:min-h-[580px] flex flex-col justify-between">
                                        <img src={card.img} className="h-40 w-40 rounded-full object-cover ring-[12px] ring-indigo-400/70 dark:ring-indigo-500/80 shadow-2xl shadow-indigo-400/40" alt={card.alt} />
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{card.name}</h3>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{card.role}</p>
                                        <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-2">{card.quote}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-8">
                                <a href={teamCtaHref} className="text-base font-semibold px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-300/40 transition">
                                    {teamCtaLabel}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px mt-8 mb-8 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-60"></div>
                <div className="w-full px-6 mt-16 mb-20 opacity-0 animate-fadeInSlow">
                    <DaoSection content={daoContent} badgeLabel={daoBadgeLabel} />
                </div>
                <div className="w-full my-12" aria-hidden="true"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow">
                    <AppsGrid content={appsContent} badgeLabel={appsBadgeLabel} />
                </div>
                <div className="w-full my-16" aria-hidden="true"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow">
                    <NewsSection content={newsContent} />
                </div>

                <Footer content={footerContent} />
            </PageShell>
        </>
    );
};

export default HomePageLayout;
