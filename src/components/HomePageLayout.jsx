import Hero from "./Hero.jsx";
import PageShell from "./PageShell.jsx";
import DaoSection from "./DaoSection.jsx";
import DaoSectionGR from "./DaoSectionGR.jsx";
import SectionBadge from "./SectionBadge.jsx";
import HomeSectionCard from "./HomeSectionCard.jsx";
import RecentUpdatesStrip from "./RecentUpdatesStrip.jsx";
import LearningJourney from "./LearningJourney.jsx";
import AvailableNow from "./AvailableNow.jsx";
import TeamTrustBand from "./TeamTrustBand.jsx";

const HomePageLayout = ({
    heroContent,
    motivationContent,
    heroCtaHref,
    heroCtaLabel,
    motivationHeading,
    learningJourneyContent,
    daoContent,
    footerContent,
    whatsNewItems = [],
    availableNowContent,
    motivationBadgeLabel = "Why Web3Edu",
    teamTrustContent,
    daoBadgeLabel = "Community Governance",
}) => {
    const isGreek = heroContent?.lang === "gr";
    const motivationPoints = Array.isArray(motivationContent?.points)
        ? motivationContent.points
        : [];

    return (
        <>
            <Hero content={heroContent} ctaHref={heroCtaHref} ctaLabel={heroCtaLabel} />
            <PageShell footerContent={footerContent}>
                <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>

                <RecentUpdatesStrip items={whatsNewItems} isGreek={isGreek} />

                <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>

                <LearningJourney content={learningJourneyContent} />

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <AvailableNow content={availableNowContent} />

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <HomeSectionCard className="relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#8A57FF]/18 via-[#4ACBFF]/12 to-[#FF67D2]/12 blur-3xl"></div>
                    <div className="relative">
                        <SectionBadge label={motivationBadgeLabel} className="mb-4 transition-opacity duration-500" />
                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-12 w-1.5 rounded-full bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]"></div>
                            <div>
                                <h2 id="motivation" className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl scroll-mt-24">
                                    {motivationHeading}
                                </h2>
                                <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                                    {motivationContent?.summary}
                                </p>
                            </div>
                        </div>
                        {motivationPoints.length > 0 && (
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {motivationPoints.map((point) => (
                                    <div
                                        key={point.title}
                                        className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                                    >
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            {point.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                            {point.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </HomeSectionCard>

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    {isGreek ? (
                        <DaoSectionGR
                            content={daoContent}
                            badgeLabel={daoBadgeLabel}
                            previewPath="/dao-preview-gr"
                            governancePath="/dao-info-gr"
                        />
                    ) : (
                        <DaoSection
                            content={daoContent}
                            badgeLabel={daoBadgeLabel}
                            previewPath="/dao-preview"
                            governancePath="/dao-info"
                        />
                    )}
                </div>
                <div className="w-full my-8" aria-hidden="true"></div>

                <TeamTrustBand content={teamTrustContent} />
            </PageShell>
        </>
    );
};

export default HomePageLayout;
