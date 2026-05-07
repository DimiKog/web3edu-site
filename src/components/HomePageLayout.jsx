import Hero from "./Hero.jsx";
import PageShell from "./PageShell.jsx";
import Motivation from "./Motivation.jsx";
import MotivationGR from "./MotivationGR.jsx";
import LearningPath from "./LearningPath.jsx";
import LearningPathGr from "./LearningPathGr.jsx";
import DaoSection from "./DaoSection.jsx";
import DaoSectionGR from "./DaoSectionGR.jsx";
import AppsGrid from "./AppsGrid.jsx";
import AppsGridGR from "./AppsGridGR.jsx";
import SectionBadge from "./SectionBadge.jsx";
import HomeFeatureCards from "./HomeFeatureCards.jsx";
import HomeSectionCard from "./HomeSectionCard.jsx";
import TeamPreview from "./TeamPreview.jsx";

const HomePageLayout = ({
    heroContent,
    motivationContent,
    heroCtaHref,
    heroCtaLabel,
    motivationHeading,
    motivationImage,
    motivationImageAlt,
    learnPathContent,
    daoContent,
    appsContent,
    footerContent,
    featureCards = [],
    whatsNewSection = null,
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
    const isGreek = heroContent?.lang === "gr";

    return (
        <>
            <Hero content={heroContent} ctaHref={heroCtaHref} ctaLabel={heroCtaLabel} />
            <PageShell footerContent={footerContent}>
                <HomeFeatureCards cards={featureCards} />

                {whatsNewSection && (
                    <>
                        <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>
                        <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                            {whatsNewSection}
                        </div>
                    </>
                )}

                <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>

                <HomeSectionCard className="overflow-visible relative">
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
                                {isGreek ? (
                                    <MotivationGR content={motivationContent} />
                                ) : (
                                    <Motivation content={motivationContent} />
                                )}
                            </div>
                            <div className="relative flex-1 flex lg:flex items-center justify-center mt-4 max-w-[85%] sm:max-w-[70%] mx-auto mb-6 lg:mb-0 overflow-hidden">
                                <div className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/20 to-[#FF67D2]/20 blur-3xl"></div>
                                <img src={motivationImage}
                                    alt={motivationImageAlt}
                                    width="256"
                                    height="256"
                                    className="relative z-10 w-52 sm:w-64 opacity-90 animate-subtleFloat transition-transform duration-500" loading="lazy" />
                            </div>
                        </div>
                </HomeSectionCard>

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>
                <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
                    {isGreek ? (
                        <LearningPathGr
                            content={learnPathContent}
                            badgeLabel={learnBadgeLabel}
                            ctaHref="/#/start-here-gr"
                        />
                    ) : (
                        <LearningPath
                            content={learnPathContent}
                            badgeLabel={learnBadgeLabel}
                            ctaHref="/#/start-here"
                        />
                    )}
                </div>
                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <HomeSectionCard>
                        {isGreek ? (
                            <AppsGridGR content={appsContent} badgeLabel={appsBadgeLabel} />
                        ) : (
                            <AppsGrid content={appsContent} badgeLabel={appsBadgeLabel} />
                        )}
                </HomeSectionCard>
                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <HomeSectionCard>
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
                </HomeSectionCard>
                <div className="w-full my-8" aria-hidden="true"></div>

                <TeamPreview
                    badgeLabel={teamBadgeLabel}
                    heading={teamHeading}
                    subheading={teamSubheading}
                    cards={teamCards}
                    ctaHref={teamCtaHref}
                    ctaLabel={teamCtaLabel}
                />


            </PageShell>
        </>
    );
};

export default HomePageLayout;
