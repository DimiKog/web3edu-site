import HomePageLayout from "../components/HomePageLayout.jsx";

import en from "../content/en.js";

const AppEN = () => (
    <HomePageLayout
        heroContent={en.hero}
        motivationContent={en.motivation}
        motivationHeading="Why Web3Edu"
        learningJourneyContent={en.learningJourney}
        daoContent={en.dao}
        footerContent={en.footer}
        whatsNewItems={en.whatsNew.items}
        availableNowContent={en.availableNow}
        motivationBadgeLabel="Motivation"
        teamTrustContent={en.teamTrust}
        daoBadgeLabel="Community Governance"
    />
);

export default AppEN;
