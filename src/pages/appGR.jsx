import HomePageLayout from "../components/HomePageLayout.jsx";

import gr from "../content/gr.js";

const AppGR = () => (
    <HomePageLayout
        heroContent={gr.hero}
        motivationContent={gr.motivation}
        motivationHeading="Γιατί Web3Edu"
        learnPathContent={gr.learnPath}
        daoContent={gr.dao}
        footerContent={gr.footer}
        whatsNewItems={gr.whatsNew.items}
        choosePathContent={gr.choosePath}
        availableNowContent={gr.availableNow}
        motivationBadgeLabel="Η Αποστολή Μας"
        learnBadgeLabel="Μαθησιακό Ταξίδι"
        teamTrustContent={gr.teamTrust}
        daoBadgeLabel="Κοινοτική Διακυβέρνηση"
    />
);

export default AppGR;
