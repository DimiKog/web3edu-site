import HomePageLayout from "../components/HomePageLayout.jsx";
import WhatsNew from "../components/WhatsNew.jsx";

import en from "../content/en.js";

import motivationCubes from "../assets/motivation-cubes.webp";
import { teamCardsEn } from "../content/teamCards.js";

const featureCardsEN = [
    {
        icon: "🔧",
        title: "Hands-on Labs",
        subtitle: "Practical blockchain workshops",
    },
    {
        icon: "📦",
        title: "Blockchain & Beyond",
        subtitle: "Core concepts & innovations",
    },
    {
        icon: "🔐",
        title: "Gamified Challenges",
        subtitle: "Learn through missions",
    },
    {
        icon: "🏛️",
        title: "DAO Credentials",
        subtitle: "Earn verifiable Web3 badges",
    },
];

const AppEN = () => (
    <HomePageLayout
        heroContent={en.hero}
        heroCtaHref="/#/join"
        heroCtaLabel="Get Your Web3Edu Identity"
        motivationContent={en.motivation}
        motivationHeading="Why Web3Edu"
        motivationImage={motivationCubes}
        motivationImageAlt="Web3 Mesh Icon"
        learnPathContent={en.learnPath}
        daoContent={en.dao}
        appsContent={en.apps}
        footerContent={en.footer}
        featureCards={featureCardsEN}
        whatsNewSection={<WhatsNew items={en.whatsNew.items} />}
        motivationBadgeLabel="Motivation"
        learnBadgeLabel="Learning Journey"
        teamBadgeLabel="Meet the Team"
        teamHeading="Core Team"
        teamSubheading="The people behind Web3Edu"
        teamCards={teamCardsEn}
        teamCtaHref="/#/team"
        teamCtaLabel="View Full Team →"
        daoBadgeLabel="Community Governance"
        appsBadgeLabel="Developer’s Corner"
    />
);

export default AppEN;
