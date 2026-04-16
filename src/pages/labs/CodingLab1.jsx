import { useAccount } from "wagmi";
import { useIdentity } from "../../context/IdentityContext.jsx";
import LabTemplate from "./LabTemplate";
import { useLabAutoStartOnce } from "../../hooks/useLabAutoStartOnce.js";
import lab05HeroImg from "../../assets/labs/lab05-smart-contracts-state-diagram.webp";

const CONTENT = {
    en: {
        title: "Coding Lab 01 — ✍️ Write and Deploy Your First Smart Contract",
        subtitle:
            "Create your first Solidity contract, compile it in Remix, deploy it to Besu Edu-Net, and verify that your own contract instance is live on-chain.",
        conceptualFocusText:
            "This lab introduces the full path from source code to deployed smart contract. Instead of interacting with an already deployed contract, you will write a minimal Solidity contract, compile it in Remix, deploy it yourself, and verify that your own contract instance is live on-chain.",
        level: "Beginner",
        estimatedTime: "15–20 minutes",
        tools: [
            "Remix IDE",
            "Besu Edu-Net",
            "Browser wallet (MetaMask or equivalent)",
            "Block Explorer",
        ],
        prerequisites: [
            "Modern browser (Chrome / Firefox / Brave)",
            "Browser wallet connected to Besu Edu-Net",
            "Basic familiarity with smart contracts and on-chain state",
        ],
        interactionPath: "/labs/coding-01/interaction",
        labels: {
            headerPill: "🧪 Web3Edu · Coding Lab",
            heroCaption:
                "Building begins with deployment — write a minimal contract, compile it, and launch your own on-chain instance.",
            conceptualFocus: "Conceptual focus",
        },
    },
    gr: {
        title: "Coding Lab 01 — ✍️ Γράψε και Κάνε Deploy το Πρώτο σου Smart Contract",
        subtitle:
            "Δημιούργησε το πρώτο σου Solidity contract, κάνε compile στο Remix, κάνε deploy στο Besu Edu-Net και επιβεβαίωσε ότι το δικό σου contract instance είναι live on-chain.",
        conceptualFocusText:
            "Αυτό το lab εισάγει όλη τη διαδρομή από τον πηγαίο κώδικα μέχρι το ανεπτυγμένο smart contract. Αντί να αλληλεπιδράς με ένα ήδη ανεπτυγμένο contract, θα γράψεις ένα ελάχιστο Solidity contract, θα κάνεις compile στο Remix, θα το κάνεις deploy ο ίδιος και θα επιβεβαιώσεις ότι το δικό σου contract instance είναι live on-chain.",
        level: "Αρχάριο",
        estimatedTime: "15–20 λεπτά",
        tools: [
            "Remix IDE",
            "Besu Edu-Net",
            "Πορτοφόλι browser (MetaMask ή αντίστοιχο)",
            "Block Explorer",
        ],
        prerequisites: [
            "Σύγχρονος browser (Chrome / Firefox / Brave)",
            "Πορτοφόλι browser συνδεδεμένο στο Besu Edu-Net",
            "Βασική εξοικείωση με smart contracts και on-chain state",
        ],
        interactionPath: "/labs-gr/coding-01/interaction",
        labels: {
            breadcrumbLabs: "Εργαστήρια",
            level: "Επίπεδο",
            estimatedTime: "Εκτιμώμενος χρόνος",
            tools: "Χρησιμοποιούμενα εργαλεία",
            prerequisites: "Προαπαιτούμενα",
            xp: "XP",
            badgeLabel: "Badge",
            startLab: "Έναρξη Lab →",
            startLabInteractionHint: "Ανοίγει το διαδραστικό εργαστήριο στο Web3Edu",
            conceptualFocus: "Εννοιολογική εστίαση",
            heroCaption:
                "Η κατασκευή ξεκινά με το deployment — γράψε ένα ελάχιστο contract, κάνε compile και ανέβασε το δικό σου on-chain instance.",
            headerPill: "🧪 Web3Edu · Coding Lab",
            completedBadge: "✓ Ολοκληρώθηκε",
            checkingStatus: "Έλεγχος κατάστασης ολοκλήρωσης…",
            completedOn: "Ολοκληρώθηκε στις:",
            completionTitle: "Ολοκλήρωση Εργαστηρίου",
            completionDescription:
                "Αφού ολοκληρώσετε το εργαστήριο, διεκδικήστε ολοκλήρωση μέσα στη διαδραστική σελίδα.",
            successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς",
            completeInsideInteraction:
                "Ολοκληρώστε τη διαδραστική δραστηριότητα και διεκδικήστε ολοκλήρωση εκεί.",
            walletNotConnectedError: "Το πορτοφόλι δεν είναι συνδεδεμένο",
            labIdMissingError: "Λείπει το αναγνωριστικό του εργαστηρίου",
            backendError: "Αποτυχία καταγραφής ολοκλήρωσης",
        },
    },
};

export default function CodingLab01({ lang = "en" }) {
    const { address } = useAccount();
    const { smartAccount } = useIdentity();
    const t = CONTENT[lang] || CONTENT.en;

    useLabAutoStartOnce({ labId: "coding01", smartAccount, address });

    return (
        <LabTemplate
            labId="coding01"
            title={t.title}
            subtitle={t.subtitle}
            conceptualFocusText={t.conceptualFocusText}
            heroImage={lab05HeroImg}
            level={t.level}
            estimatedTime={t.estimatedTime}
            tools={t.tools}
            prerequisites={t.prerequisites}
            interactionPath={t.interactionPath}
            readmeUrl="https://github.com/DimiKog/web3edu-labs"
            xp={400}
            badge="Smart Contract Deployer"
            labels={t.labels}
        />
    );
}
