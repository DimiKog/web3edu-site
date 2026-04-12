import HomePageLayout from "../components/HomePageLayout.jsx";
import WhatsNew from "../components/WhatsNew.jsx";

import gr from "../content/gr.js";

import motivationCubes from "../assets/motivation-cubes.webp";
import { teamCardsGr } from "../content/teamCards.js";

const featureCardsGR = [
    {
        icon: "🔧",
        title: "Εργαστήρια Hands-on",
        subtitle: "Πρακτικές ασκήσεις blockchain",
    },
    {
        icon: "📦",
        title: "Blockchain & Πέρα",
        subtitle: "Βασικές αρχές & καινοτομίες",
    },
    {
        icon: "🔐",
        title: "Παιχνιδοποιημένες Προκλήσεις",
        subtitle: "Μάθηση μέσω αποστολών",
    },
    {
        icon: "🏛️",
        title: "Διαπιστευτήρια DAO",
        subtitle: "Κέρδισε επαληθεύσιμα Web3 badges",
    },
];

const AppGR = () => (
    <HomePageLayout
        heroContent={gr.hero}
        heroCtaHref="/#/join-gr"
        heroCtaLabel="Απέκτησε την Ταυτότητα σου στο Web3Edu"
        motivationContent={gr.motivation}
        motivationHeading="Γιατί Web3Edu"
        motivationImage={motivationCubes}
        motivationImageAlt="Εικονίδιο Web3 Mesh"
        learnPathContent={gr.learnPath}
        daoContent={gr.dao}
        appsContent={gr.apps}
        footerContent={gr.footer}
        featureCards={featureCardsGR}
        whatsNewSection={<WhatsNew items={gr.whatsNew.items} isGR />}
        motivationBadgeLabel="Η Αποστολή Μας"
        learnBadgeLabel="Μαθησιακό Ταξίδι"
        teamBadgeLabel="Γνωρίστε την Ομάδα"
        teamHeading="Κύρια Ομάδα"
        teamSubheading="Οι άνθρωποι πίσω από το Web3Edu"
        teamCards={teamCardsGr}
        teamCtaHref="/#/team-gr"
        teamCtaLabel="Δείτε όλη την ομάδα →"
        daoBadgeLabel="Κοινοτική Διακυβέρνηση"
        appsBadgeLabel="Εργαλεία Δημιουργίας"
    />
);

export default AppGR;
