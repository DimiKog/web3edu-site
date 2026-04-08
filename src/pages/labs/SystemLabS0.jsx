import LabTemplate from "./LabTemplate";
import sysLab0Img from "../../assets/labs/SysLab0.webp";

const CONTENT = {
    en: {
        title: "System Lab S0 — 🏰 Why Consensus Is Hard",
        subtitle:
            "Understand the Byzantine Generals Problem and why distributed systems need explicit consensus rules before they can agree safely.",
        level: "Intermediate",
        estimatedTime: "10-15 minutes",
        conceptualFocusText:
            "Before understanding how blockchain consensus works, you need to understand the coordination problem it solves. In distributed systems, honest participants can receive conflicting information, and that makes reliable agreement difficult even before you add malicious actors.",
        goals: [
            "Understand why coordinated agreement matters in distributed systems",
            "See how inconsistent messages create uncertainty",
            "Recognize why naive majority reasoning can fail",
            "Connect the Byzantine Generals Problem to blockchain consensus",
        ],
        prerequisites: [
            "No technical prerequisites required",
        ],
        interactionPath: "/labs/system/s0/interaction",
        labels: {
            headerPill: "⛓ Web3Edu · System Lab",
            heroCaption: "Consensus begins with the problem of unreliable communication and conflicting local views",
            tools: "Learning Goals",
        },
    },
    gr: {
        title: "System Lab S0 — 🏰 Γιατί η Συναίνεση Είναι Δύσκολη",
        subtitle:
            "Κατανόησε το πρόβλημα των Βυζαντινών Στρατηγών και γιατί τα κατανεμημένα συστήματα χρειάζονται ρητούς κανόνες συναίνεσης για να συμφωνούν με ασφάλεια.",
        level: "Ενδιάμεσο",
        estimatedTime: "10-15 λεπτά",
        conceptualFocusText:
            "Πριν κατανοήσεις πώς λειτουργεί η συναίνεση στα blockchain, πρέπει να δεις το πρόβλημα συντονισμού που λύνει. Σε κατανεμημένα συστήματα, ακόμη και οι έντιμοι συμμετέχοντες μπορούν να λάβουν αντικρουόμενες πληροφορίες, κάτι που κάνει την αξιόπιστη συμφωνία δύσκολη πριν καν εμφανιστούν κακόβουλοι κόμβοι.",
        goals: [
            "Κατανόησε γιατί η συντονισμένη συμφωνία είναι κρίσιμη στα κατανεμημένα συστήματα",
            "Δες πώς τα ασυνεπή μηνύματα δημιουργούν αβεβαιότητα",
            "Αναγνώρισε γιατί η απλή λογική πλειοψηφίας μπορεί να αποτύχει",
            "Σύνδεσε το πρόβλημα των Βυζαντινών Στρατηγών με τη συναίνεση στα blockchain",
        ],
        prerequisites: [
            "Δεν απαιτούνται τεχνικές προϋποθέσεις",
        ],
        interactionPath: "/labs-gr/system/s0/interaction",
        labels: {
            breadcrumbLabs: "Εργαστήρια",
            headerPill: "⛓ Web3Edu · Εργαστήριο Συστήματος",
            heroCaption: "Η συναίνεση ξεκινά από το πρόβλημα της αναξιόπιστης επικοινωνίας και των διαφορετικών τοπικών οπτικών",
            tools: "Στόχοι Μάθησης",
            level: "Επίπεδο",
            estimatedTime: "Εκτιμώμενος χρόνος",
            prerequisites: "Προαπαιτούμενα",
            xp: "XP",
            badgeLabel: "Σήμα",
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

export default function SystemLabS0({ lang = "en" }) {
    const t = CONTENT[lang] || CONTENT.en;

    return (
        <LabTemplate
            labId="system-s0"
            title={t.title}
            subtitle={t.subtitle}
            heroImage={sysLab0Img}
            level={t.level}
            estimatedTime={t.estimatedTime}
            xp={200}
            conceptualFocusText={t.conceptualFocusText}
            tools={t.goals}
            prerequisites={t.prerequisites}
            interactionPath={t.interactionPath}
            labels={t.labels}
        />
    );
}
