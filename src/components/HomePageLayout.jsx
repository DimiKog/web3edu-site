import Hero from "./Hero.jsx";
import PageShell from "./PageShell.jsx";
import DaoSection from "./DaoSection.jsx";
import DaoSectionGR from "./DaoSectionGR.jsx";
import RecentUpdatesStrip from "./RecentUpdatesStrip.jsx";
import LearningJourney from "./LearningJourney.jsx";
import AvailableNow from "./AvailableNow.jsx";
import TeamTrustBand from "./TeamTrustBand.jsx";

const HomePageLayout = ({
    heroContent,
    heroCtaHref,
    heroCtaLabel,
    learningJourneyContent,
    daoContent,
    footerContent,
    whatsNewItems = [],
    availableNowContent,
    teamTrustContent,
    daoBadgeLabel = "Community Governance",
}) => {
    const isGreek = heroContent?.lang === "gr";

    return (
        <>
            <Hero content={heroContent} ctaHref={heroCtaHref} ctaLabel={heroCtaLabel} />
            <PageShell footerContent={footerContent}>
                <div className="w-full my-8 sm:my-10" aria-hidden="true"></div>

                <LearningJourney content={learningJourneyContent} />

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <AvailableNow content={availableNowContent} />

                <div className="w-full h-px my-8 sm:my-10 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-60"></div>

                <RecentUpdatesStrip items={whatsNewItems} isGreek={isGreek} />

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
