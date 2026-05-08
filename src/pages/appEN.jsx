import HomePageLayout from "../components/HomePageLayout.jsx";

import en from "../content/en.js";

const AppEN = () => (
    <HomePageLayout
        heroContent={en.hero}
        heroCtaHref="/#/join"
        heroCtaLabel="Get Your Web3Edu Identity"
        motivationContent={en.motivation}
        motivationHeading="Why Web3Edu"
        learnPathContent={en.learnPath}
        daoContent={en.dao}
        footerContent={en.footer}
        whatsNewItems={en.whatsNew.items}
        choosePathContent={en.choosePath}
        availableNowContent={en.availableNow}
        motivationBadgeLabel="Motivation"
        learnBadgeLabel="Learning Journey"
        teamTrustContent={en.teamTrust}
        daoBadgeLabel="Community Governance"
    />
);

export default AppEN;
