import LabTemplate from "./LabTemplate";
import sysLabImg from "../../assets/labs/SysLab01.webp";

const CONTENT = {
    en: {
        title: "How Blocks Form a Secure Chain",
        subtitle:
            "Understand how transactions become blocks, how blocks form a chain, and why blockchain is secure.",
        level: "Intermediate",
        estimatedTime: "15–20 minutes",
        conceptualFocusText:
            "In this lab, you will explore how a blockchain works as a system. You will interact with blocks, modify transactions, and observe how even a small change affects the entire chain. Then, you will use mining to restore consistency.",
        goals: [
            "Understand what a block contains",
            "See how hashes link blocks together",
            "Break the chain and observe what happens",
            "Repair the chain using Proof of Work",
            "Understand why blockchain is tamper-resistant",
        ],
        prerequisites: [
            "Modern browser (Chrome / Firefox / Brave)",
            "Browser wallet (MetaMask or equivalent) — for claiming completion",
        ],
        interactionPath: "/labs/system/s1/interaction",
        labels: {
            headerPill: "⛓ Web3Edu · System Lab",
            heroCaption: "How blocks link together to form a tamper-resistant chain",
            tools: "Learning Goals",
        },
    },
    gr: {
        title: "Πώς τα Blocks σχηματίζουν ένα ασφαλές chain",
        subtitle:
            "Κατανόησε πώς οι συναλλαγές γίνονται blocks, πώς τα blocks σχηματίζουν chain και γιατί το blockchain είναι ασφαλές.",
        level: "Μέτριο",
        estimatedTime: "15–20 λεπτά",
        conceptualFocusText:
            "Σε αυτό το lab θα εξερευνήσεις πώς λειτουργεί το blockchain ως σύστημα. Θα αλληλεπιδράσεις με blocks, θα αλλάξεις συναλλαγές και θα δεις πώς μία μικρή αλλαγή επηρεάζει όλο το chain. Στη συνέχεια, θα χρησιμοποιήσεις mining για να επαναφέρεις τη συνέπεια.",
        goals: [
            "Κατανόηση του περιεχομένου ενός block",
            "Κατανόηση του linking μέσω hash",
            "Παραβίαση του chain και παρατήρηση των συνεπειών",
            "Επιδιόρθωση μέσω Proof of Work",
            "Κατανόηση της ανθεκτικότητας του blockchain",
        ],
        prerequisites: [
            "Σύγχρονος browser (Chrome / Firefox / Brave)",
            "Πορτοφόλι browser (π.χ. MetaMask) — για δήλωση ολοκλήρωσης",
        ],
        interactionPath: "/labs-gr/system/s1/interaction",
        labels: {
            breadcrumbLabs: "Εργαστήρια",
            headerPill: "⛓ Web3Edu · System Lab",
            heroCaption: "Πώς τα blocks συνδέονται για να σχηματίσουν ένα αδιάρρηκτο chain",
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

export default function SystemLabS1({ lang = "en" }) {
    const t = CONTENT[lang] || CONTENT.en;

    return (
        <LabTemplate
            labId="system-s1"
            title={t.title}
            subtitle={t.subtitle}
            heroImage={sysLabImg}
            level={t.level}
            estimatedTime={t.estimatedTime}
            xp={300}
            conceptualFocusText={t.conceptualFocusText}
            tools={t.goals}
            prerequisites={t.prerequisites}
            interactionPath={t.interactionPath}
            labels={t.labels}
        />
    );
}
