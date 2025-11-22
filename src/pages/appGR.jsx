import HomePageLayout from "../components/HomePageLayout.jsx";

import gr from "../content/gr.js";

import motivationCubes from "../assets/motivation-cubes.png";
import { teamCardsGr } from "../content/teamCards.js";

const featureLabelsGR = [
    "Εργαστήρια Hands-on",
    "Blockchain & Πέρα",
    "Παιχνιδοποιημένες Προκλήσεις",
    "Διαπιστευτήρια DAO",
];

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
        heroCtaHref="/#/join"
        heroCtaLabel="Ξεκίνα την Μάθηση"
        motivationContent={gr.motivation}
        motivationHeading="Γιατί Web3Edu"
        motivationImage={motivationCubes}
        motivationImageAlt="Εικονίδιο Web3 Mesh"
        learnPathContent={gr.learnPath}
        daoContent={gr.dao}
        appsContent={gr.apps}
        newsContent={gr.news}
        footerContent={gr.footer}
        featureCards={featureCardsGR}
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
