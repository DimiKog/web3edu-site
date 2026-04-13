import LabTemplate from "./LabTemplate";
import sysLab05Img from "../../assets/labs/SysLab5.webp";

const CONTENT = {
    en: {
        title: "Network Partition and Recovery in QBFT",
        subtitle:
            "Examine how QBFT behaves when validator connectivity breaks, quorum disappears, and the network later recovers.",
        level: "Intermediate",
        estimatedTime: "12–15 minutes",
        conceptualFocusText:
            "This lab extends the QBFT story from normal operation into failure conditions. You will inspect what happens when validators are partitioned into isolated groups, why liveness can stall even while safety is preserved, and how consensus resumes once communication is restored.",
        goals: [
            "Distinguish partition from ordinary delay in a permissioned network",
            "Understand how validator splits affect quorum and finality",
            "See why safety can survive even when liveness stalls",
            "Observe how recovery restores coordinated progress",
        ],
        prerequisites: [
            "Completion of System Lab S4 or equivalent QBFT overview",
            "Modern browser (Chrome / Firefox / Brave)",
            "No wallet required for the overview",
        ],
        interactionPath: "/labs/system/s5/interaction",
        labels: {
            headerPill: "⛓ Web3Edu · System Lab",
            heroCaption:
                "Network partitions stress liveness first: the protocol may stop progressing while still preserving safety",
            tools: "Learning Goals",
        },
    },
    gr: {
        title: "Δικτυακός Κατακερματισμός και Ανάκαμψη στο QBFT",
        subtitle:
            "Εξέτασε πώς συμπεριφέρεται το QBFT όταν διακόπτεται η συνδεσιμότητα μεταξύ validators, χάνεται το quorum και το δίκτυο αργότερα επανέρχεται.",
        level: "Ενδιάμεσο",
        estimatedTime: "12–15 λεπτά",
        conceptualFocusText:
            "Αυτό το lab επεκτείνει το QBFT από την κανονική λειτουργία σε συνθήκες αστοχίας. Θα δεις τι συμβαίνει όταν οι validators χωρίζονται σε απομονωμένες ομάδες, γιατί το liveness μπορεί να σταματήσει ενώ η safety παραμένει, και πώς η συναίνεση επανέρχεται όταν αποκαθίσταται η επικοινωνία.",
        goals: [
            "Διάκριση ανάμεσα σε δικτυακό κατακερματισμό και απλή καθυστέρηση σε permissioned δίκτυο",
            "Κατανόηση του πώς ο διαχωρισμός των validators επηρεάζει quorum και finality",
            "Παρατήρηση του γιατί η safety μπορεί να διατηρείται ακόμη κι όταν σταματά το liveness",
            "Παρατήρηση του πώς η ανάκαμψη επαναφέρει τη συντονισμένη πρόοδο",
        ],
        prerequisites: [
            "Ολοκλήρωση του System Lab S4 ή αντίστοιχη κατανόηση του QBFT",
            "Σύγχρονος browser (Chrome / Firefox / Brave)",
            "Δεν απαιτείται wallet για την επισκόπηση",
        ],
        interactionPath: "/labs-gr/system/s5/interaction",
        labels: {
            headerPill: "⛓ Web3Edu · System Lab",
            heroCaption:
                "Οι δικτυακοί κατακερματισμοί πιέζουν πρώτα το liveness: το πρωτόκολλο μπορεί να σταματήσει να προχωρά ενώ συνεχίζει να προστατεύει τη safety",
            tools: "Στόχοι Μάθησης",
            level: "Επίπεδο",
            estimatedTime: "Εκτιμώμενος χρόνος",
            prerequisites: "Προαπαιτούμενα",
            startLab: "Έναρξη Lab →",
            startLabInteractionHint: "Ανοίγει το διαδραστικό εργαστήριο",
            conceptualFocus: "Εκπαιδευτικό επίκεντρο",
            completionTitle: "Ολοκλήρωση Εργαστηρίου",
            completionDescription:
                "Αφού ολοκληρώσετε το εργαστήριο, διεκδικήστε ολοκλήρωση μέσα στη διαδραστική σελίδα.",
            successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς",
            completeInsideInteraction:
                "Ολοκληρώστε τη διαδραστική δραστηριότητα και διεκδικήστε ολοκλήρωση εκεί.",
            checkingStatus: "Έλεγχος κατάστασης ολοκλήρωσης…",
            completedBadge: "✓ Ολοκληρώθηκε",
            completedOn: "Ολοκληρώθηκε στις:",
            walletNotConnectedError: "Το πορτοφόλι δεν είναι συνδεδεμένο",
            labIdMissingError: "Λείπει το αναγνωριστικό του εργαστηρίου",
            backendError: "Σφάλμα κατά την καταγραφή της ολοκλήρωσης",
        },
    },
};

export default function SystemLabS5({ lang = "en" }) {
    const t = CONTENT[lang] || CONTENT.en;

    return (
        <LabTemplate
            labId="system-s5"
            title={t.title}
            subtitle={t.subtitle}
            heroImage={sysLab05Img}
            level={t.level}
            estimatedTime={t.estimatedTime}
            xp={400}
            conceptualFocusText={t.conceptualFocusText}
            tools={t.goals}
            prerequisites={t.prerequisites}
            interactionPath={t.interactionPath}
            labels={t.labels}
        />
    );
}
