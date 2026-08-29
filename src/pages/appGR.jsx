import HomePageLayout from "../components/HomePageLayout.jsx";

import gr from "../content/gr.js";

const AppGR = () => (
    <HomePageLayout
        heroContent={gr.hero}
        motivationContent={gr.motivation}
        motivationHeading="Γιατί Web3Edu"
        learningJourneyContent={gr.learningJourney}
        daoContent={gr.dao}
        footerContent={gr.footer}
        whatsNewItems={gr.whatsNew.items}
        availableNowContent={gr.availableNow}
        motivationBadgeLabel="Η Αποστολή Μας"
        teamTrustContent={gr.teamTrust}
        daoBadgeLabel="Κοινοτική Διακυβέρνηση"
    />
);

export default AppGR;
