import { useMemo, useState, useEffect, useRef } from "react";
import { BrowserProvider, Contract } from "ethers";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import TransactionStateVisualizer from "../../components/mining/TransactionStateVisualizer";

const demoContractAddress = "0x9de0C731c8FA34CD0a47497dE4f569CbaaD5ab5F";
const counterAbi = [
    "function value() view returns (uint256)",
    "function increment()",
];

const CONTENT = {
    en: {
        title: "System Lab S2 Interaction",
        intro:
            "Trace how one transaction moves through the system and becomes a persistent state change on-chain.",
        steps: [
            "Observe initial state",
            "Predict outcome",
            "Execute transaction",
            "Verify updated state",
            "Explain why",
        ],
        instructions: [
            "Read the current on-chain value from the contract below.",
            "Predict what the value will be after calling increment().",
            "Send the transaction that executes increment().",
            "Read the updated value and compare it with your prediction.",
            "Explain why the value changed and why the change persists.",
        ],
        flowSteps: ["Transaction", "Block", "Execution", "State Change"],
        toolTitle: "Transaction-to-State Tool",
        toolIntro:
            "This tool focuses only on the contract state transition needed for this system lab.",
        contractCardTitle: "1. Read Current State",
        contractCardBody:
            "Use a read-only call to inspect the current value stored in the contract. This does not require gas and does not change state.",
        readButton: "Read current value",
        currentValue: "Current value",
        step1Insight:
            "This was a read-only eth_call — no gas, no signature, no block required. The value came directly from contract storage.",
        predictionTitle: "2. Predict the Next State",
        predictionPrompt: "What will the value be after one increment() transaction?",
        predictionLocked: "Prediction locked:",
        confirmPrediction: "Confirm prediction",
        executeTitle: "3. Execute the Transaction",
        executeBody:
            "Send increment() from your wallet. This creates a real transaction that asks the blockchain to execute contract code.",
        executeButton: "Send increment() transaction",
        txPending: "Waiting for block confirmation...",
        txConfirmed: "Transaction confirmed on-chain.",
        txHash: "Transaction hash",
        step3Insight:
            "The EVM executed increment() inside a confirmed block. The contract's storage slot is now permanently updated on-chain.",
        verifyTitle: "4. Verify the Updated State",
        verifyBody:
            "Read the state again after the transaction is mined. The new value is evidence that execution changed contract storage.",
        verifyButton: "Read updated value",
        updatedValue: "Updated value",
        correctPrediction: "✅ Correct prediction",
        incorrectPrediction: "❌ Incorrect prediction",
        incorrectPredictionExplain:
            "increment() always adds exactly 1. Each call is a new transaction — the value only changes when execution completes inside a confirmed block.",
        actualResult: "Actual result",
        explanationTitle: "5. Explain Why",
        explanationPrompt:
            "Explain why the value changed and why this is a state change rather than just a local UI update.",
        explanationPlaceholder:
            "Mention the transaction, contract execution, block inclusion, and persistent state change.",
        confirmExplanation: "Confirm explanation",
        explanationRetry:
            "Include the ideas of transaction execution and on-chain state change.",
        explanationOptions: [
            {
                id: "ui",
                label: "Because the UI updated locally",
                feedback: "The UI reflects what's on-chain, but it doesn't cause the change. The blockchain state changed first — the UI just displays it.",
                correct: false,
            },
            {
                id: "tx",
                label: "Because a transaction executed contract code in a confirmed block",
                feedback: "✅ Correct. A signed transaction triggered EVM execution inside a confirmed block, permanently updating contract storage.",
                correct: true,
            },
            {
                id: "read",
                label: "Because reading the state changed it",
                feedback: "Reading state never changes it. eth_call is read-only — no gas, no block, no state mutation.",
                correct: false,
            },
            {
                id: "wallet",
                label: "Because the wallet stored a new value",
                feedback: "The wallet signs transactions, but contract state lives in the contract's storage slot on-chain — not in the wallet.",
                correct: false,
            },
        ],
        explorerLink: "Open contract in block explorer",
        resetLab: "Reset lab",
        backHref: "/#/labs/system/s2",
        backLabel: "Back to Lab Overview",
        completionTitle: "You completed System Lab S2.",
        completionBody:
            "Claim the reward now that you have connected transaction execution to persistent state change.",
        completedSteps: "All steps completed",
        rewardClaimTitle: "Claim Reward",
        rewardClaimDescription:
            "You completed System Lab S2. Claim your reward below.",
        claimRewardButton: "🎁 Claim Reward",
        claimingRewardButton: "Signing…",
        visualizerTitle: "Transaction State Visualizer",
        visualizerSubtitle:
            "This diagram tracks the transaction lifecycle and the moment the contract state becomes readable again.",
        visualizerIdle: "Idle",
        visualizerCreated: "Created",
        visualizerPending: "Pending",
        visualizerIncluded: "Included",
        visualizerExecuted: "Executed",
        visualizerTxHash: "Transaction hash",
        visualizerStateValue: "State value",
        visualizerNoState: "State not read yet",
        visualizerCallout:
            "💡 Watch the Transaction State Visualizer below — it will animate in real time as your transaction moves through the system.",
        visualizerIdlePlaceholder:
            "⏳ The visualizer will animate once you send a transaction in Step 3.",
        whatThisShowsTitle: "What This Lab Proves",
        whatThisShowsBullets: [
            "Read-only calls (eth_call) return contract state without gas, signatures, or block inclusion — they never change on-chain data.",
            "Writing to a contract requires a signed transaction that must be included in a block before the EVM executes it.",
            "State changes only become permanent after block inclusion — the EVM runs the contract code inside that block.",
            "The value you read after the transaction reflects persistent on-chain storage, not a local UI variable.",
        ],
        finalReflectionTitle: "Final Reflection",
        finalReflectionQuestion:
            "Why can't the state change happen the moment you click 'Send'? What has to happen first?",
        finalReflectionHint:
            "Think about the role the block plays between sending the transaction and the state changing.",
        finalReflectionAnswer:
            "The transaction must be broadcast, included in a block, and the EVM must execute the contract code inside that block. Only then does the state change become permanent. Clicking 'Send' creates a transaction intent — block inclusion is what makes it real.",
        discoveredTitle: "Evidence Collected",
        discoveredEmpty: "No evidence yet — complete the steps above.",
        discovery1: "eth_call proved: contract state is readable without gas or a transaction.",
        discovery3: "Transaction proved: contract code executes only inside a confirmed block.",
        discovery4Prefix: "State changed:",
        discovery4Suffix: "— permanent on-chain evidence that execution modified contract storage.",
    },
    gr: {
        title: "System Lab S2 Interaction",
        intro:
            "Ακολούθησε πώς μία συναλλαγή διασχίζει το σύστημα και γίνεται μόνιμη αλλαγή κατάστασης on-chain.",
        steps: [
            "Παρατήρηση αρχικής κατάστασης",
            "Πρόβλεψη αποτελέσματος",
            "Εκτέλεση συναλλαγής",
            "Επαλήθευση ενημερωμένης κατάστασης",
            "Εξήγηση του γιατί",
        ],
        instructions: [
            "Διάβασε την τρέχουσα on-chain τιμή του contract.",
            "Πρόβλεψε ποια θα είναι η τιμή μετά την κλήση του increment().",
            "Στείλε τη συναλλαγή που εκτελεί το increment().",
            "Διάβασε τη νέα τιμή και σύγκρινέ τη με την πρόβλεψή σου.",
            "Εξήγησε γιατί η τιμή άλλαξε και γιατί η αλλαγή παραμένει.",
        ],
        flowSteps: ["Συναλλαγή", "Block", "Εκτέλεση", "Αλλαγή Κατάστασης"],
        toolTitle: "Εργαλείο Συναλλαγής προς Αλλαγή Κατάστασης",
        toolIntro:
            "Αυτό το εργαλείο εστιάζει μόνο στη μετάβαση κατάστασης του contract που χρειάζεται αυτό το system lab.",
        contractCardTitle: "1. Ανάγνωση Τρέχουσας Κατάστασης",
        contractCardBody:
            "Χρησιμοποίησε ένα read-only call για να επιθεωρήσεις την τρέχουσα τιμή του contract. Δεν απαιτεί gas και δεν αλλάζει την κατάσταση.",
        readButton: "Διάβασε την τρέχουσα τιμή",
        currentValue: "Τρέχουσα τιμή",
        step1Insight:
            "Αυτό ήταν ένα read-only eth_call — χωρίς gas, χωρίς υπογραφή, χωρίς block. Η τιμή ήρθε απευθείας από το storage του contract.",
        predictionTitle: "2. Πρόβλεψη της Επόμενης Κατάστασης",
        predictionPrompt: "Ποια θα είναι η τιμή μετά από μία συναλλαγή increment();",
        predictionLocked: "Πρόβλεψη κλειδωμένη:",
        confirmPrediction: "Επιβεβαίωση πρόβλεψης",
        executeTitle: "3. Εκτέλεση της Συναλλαγής",
        executeBody:
            "Στείλε το increment() από το wallet σου. Αυτό δημιουργεί μια πραγματική συναλλαγή που ζητά από το blockchain να εκτελέσει τον κώδικα του contract.",
        executeButton: "Στείλε τη συναλλαγή increment()",
        txPending: "Αναμονή επιβεβαίωσης σε block...",
        txConfirmed: "Η συναλλαγή επιβεβαιώθηκε on-chain.",
        txHash: "Hash συναλλαγής",
        step3Insight:
            "Το EVM εκτέλεσε το increment() μέσα σε ένα επιβεβαιωμένο block. Το storage slot του contract ενημερώθηκε μόνιμα on-chain.",
        verifyTitle: "4. Επαλήθευση της Νέας Κατάστασης",
        verifyBody:
            "Διάβασε ξανά την κατάσταση αφού η συναλλαγή μπει σε block. Η νέα τιμή αποδεικνύει ότι η εκτέλεση άλλαξε το storage του contract.",
        verifyButton: "Διάβασε την ενημερωμένη τιμή",
        updatedValue: "Ενημερωμένη τιμή",
        correctPrediction: "✅ Σωστή πρόβλεψη",
        incorrectPrediction: "❌ Λανθασμένη πρόβλεψη",
        incorrectPredictionExplain:
            "Το increment() προσθέτει πάντα ακριβώς 1. Κάθε κλήση είναι μια νέα συναλλαγή — η τιμή αλλάζει μόνο αφού η εκτέλεση ολοκληρωθεί μέσα σε ένα επιβεβαιωμένο block.",
        actualResult: "Πραγματικό αποτέλεσμα",
        explanationTitle: "5. Εξήγησε το Γιατί",
        explanationPrompt:
            "Εξήγησε γιατί άλλαξε η τιμή και γιατί αυτό είναι αλλαγή κατάστασης και όχι απλώς τοπική ενημέρωση του UI.",
        explanationPlaceholder:
            "Ανάφερε τη συναλλαγή, την εκτέλεση του contract, την ένταξη σε block και τη μόνιμη αλλαγή κατάστασης.",
        confirmExplanation: "Επιβεβαίωση εξήγησης",
        explanationRetry:
            "Συμπερίλαβε τις έννοιες της εκτέλεσης συναλλαγής και της on-chain αλλαγής κατάστασης.",
        explanationOptions: [
            {
                id: "ui",
                label: "Επειδή το UI ενημερώθηκε τοπικά",
                feedback: "Το UI αντανακλά ό,τι είναι on-chain, αλλά δεν προκαλεί την αλλαγή. Η κατάσταση του blockchain άλλαξε πρώτα — το UI απλώς την εμφανίζει.",
                correct: false,
            },
            {
                id: "tx",
                label: "Επειδή μια συναλλαγή εκτέλεσε τον κώδικα του contract σε ένα επιβεβαιωμένο block",
                feedback: "✅ Σωστά. Μια υπογεγραμμένη συναλλαγή ενεργοποίησε την εκτέλεση EVM μέσα σε ένα επιβεβαιωμένο block, ενημερώνοντας μόνιμα το storage του contract.",
                correct: true,
            },
            {
                id: "read",
                label: "Επειδή η ανάγνωση της κατάστασης την άλλαξε",
                feedback: "Η ανάγνωση κατάστασης δεν την αλλάζει ποτέ. Το eth_call είναι read-only — χωρίς gas, χωρίς block, χωρίς μετάλλαξη κατάστασης.",
                correct: false,
            },
            {
                id: "wallet",
                label: "Επειδή το wallet αποθήκευσε νέα τιμή",
                feedback: "Το wallet υπογράφει συναλλαγές, αλλά η κατάσταση του contract ζει στο storage slot του contract on-chain — όχι στο wallet.",
                correct: false,
            },
        ],
        explorerLink: "Άνοιγμα contract στον block explorer",
        resetLab: "Επαναφορά lab",
        backHref: "/#/labs-gr/system/s2",
        backLabel: "Επιστροφή στην Επισκόπηση Lab",
        completionTitle: "Ολοκλήρωσες το System Lab S2.",
        completionBody:
            "Διεκδίκησε τώρα την επιβράβευση αφού συνέδεσες την εκτέλεση μιας συναλλαγής με τη μόνιμη αλλαγή κατάστασης.",
        completedSteps: "Όλα τα βήματα ολοκληρώθηκαν",
        rewardClaimTitle: "Διεκδίκηση Επιβράβευσης",
        rewardClaimDescription:
            "Ολοκλήρωσες το System Lab S2. Διεκδίκησε την επιβράβευσή σου παρακάτω.",
        claimRewardButton: "🎁 Διεκδίκηση Επιβράβευσης",
        claimingRewardButton: "Υπογραφή…",
        visualizerTitle: "Οπτικοποιητής Κατάστασης Συναλλαγής",
        visualizerSubtitle:
            "Αυτό το διάγραμμα παρακολουθεί τον κύκλο ζωής της συναλλαγής και τη στιγμή που η κατάσταση του contract γίνεται ξανά αναγνώσιμη.",
        visualizerIdle: "Αδράνεια",
        visualizerCreated: "Δημιουργήθηκε",
        visualizerPending: "Εκκρεμεί",
        visualizerIncluded: "Μπήκε σε block",
        visualizerExecuted: "Εκτελέστηκε",
        visualizerTxHash: "Hash συναλλαγής",
        visualizerStateValue: "Τιμή κατάστασης",
        visualizerNoState: "Η κατάσταση δεν έχει διαβαστεί ακόμη",
        visualizerCallout:
            "💡 Παρακολούθησε τον Οπτικοποιητή Κατάστασης Συναλλαγής παρακάτω — θα κινηθεί σε πραγματικό χρόνο καθώς η συναλλαγή σου περνά από το σύστημα.",
        visualizerIdlePlaceholder:
            "⏳ Ο visualizer θα ανοίξει μόλις ξεκινήσει μια συναλλαγή στο Βήμα 3.",
        whatThisShowsTitle: "Τι Αποδεικνύει Αυτό το Lab",
        whatThisShowsBullets: [
            "Τα read-only calls (eth_call) επιστρέφουν κατάσταση χωρίς gas, υπογραφή ή block — δεν αλλάζουν ποτέ on-chain δεδομένα.",
            "Η εγγραφή σε contract απαιτεί υπογεγραμμένη συναλλαγή που πρέπει να ενταχθεί σε block πριν εκτελεστεί από το EVM.",
            "Οι αλλαγές κατάστασης γίνονται μόνιμες μόνο μετά την ένταξη σε block — το EVM εκτελεί τον κώδικα μέσα στο block.",
            "Η τιμή που διαβάζεις μετά τη συναλλαγή αντικατοπτρίζει μόνιμο on-chain storage, όχι τοπική μεταβλητή UI.",
        ],
        finalReflectionTitle: "Τελικός Αναστοχασμός",
        finalReflectionQuestion:
            "Γιατί η αλλαγή κατάστασης δεν συμβαίνει τη στιγμή που πατάς 'Στείλε'; Τι πρέπει να γίνει πρώτα;",
        finalReflectionHint:
            "Σκέψου τον ρόλο που παίζει το block ανάμεσα στην αποστολή της συναλλαγής και την αλλαγή κατάστασης.",
        finalReflectionAnswer:
            "Η συναλλαγή πρέπει να μεταδοθεί, να ενταχθεί σε block, και το EVM πρέπει να εκτελέσει τον κώδικα μέσα σε αυτό το block. Μόνο τότε η αλλαγή γίνεται μόνιμη. Το πάτημα 'Στείλε' δημιουργεί πρόθεση — η ένταξη σε block είναι αυτό που τη κάνει πραγματική.",
        discoveredTitle: "Αποδείξεις που Συλλέχθηκαν",
        discoveredEmpty: "Δεν υπάρχουν αποδείξεις ακόμα — ολοκλήρωσε τα παραπάνω βήματα.",
        discovery1: "Το eth_call απέδειξε: η κατάσταση του contract διαβάζεται χωρίς gas ή συναλλαγή.",
        discovery3: "Η συναλλαγή απέδειξε: ο κώδικας του contract εκτελείται μόνο μέσα σε επιβεβαιωμένο block.",
        discovery4Prefix: "Αλλαγή κατάστασης:",
        discovery4Suffix: "— μόνιμη on-chain απόδειξη ότι η εκτέλεση τροποποίησε το storage του contract.",
    },
};


export default function SystemLabS2Interaction({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;

    const [initialValue, setInitialValue] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [predictionConfirmed, setPredictionConfirmed] = useState(false); // Patch 3
    const [txHash, setTxHash] = useState("");
    const [txPending, setTxPending] = useState(false);
    const [txConfirmed, setTxConfirmed] = useState(false);
    const [updatedValue, setUpdatedValue] = useState(null);
    const [explanationOk, setExplanationOk] = useState(null);
    // Step 5: multiple-choice
    const [selectedReason, setSelectedReason] = useState(null);
    const [error, setError] = useState("");
    const [simState, setSimState] = useState({
        tx: null,
        phase: "idle",
        stateValue: null,
    });

    // Animation/highlight state for transaction lifecycle
    const [simHighlight, setSimHighlight] = useState(null);

    // 1) Add previous phase tracking
    const prevPhaseRef = useRef(null);

    // Patch 6 — scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 2) Update simState effect to react only on phase changes and add staged animations.
    useEffect(() => {
        if (!simState) return;

        const prev = prevPhaseRef.current;
        const next = simState.phase;
        prevPhaseRef.current = next;

        if (prev === next) return;

        if (next === "created") {
            setSimHighlight("tx-created");
        }

        if (next === "pending") {
            setSimHighlight("tx-pending");
        }

        if (next === "included") {
            setSimHighlight("block-added");
        }

        if (next === "executed") {
            setSimHighlight("state-updated");
        }
    }, [simState]);

    // Patch 1 — corrected step values (were all off-by-one)
    const step = useMemo(() => {
        if (explanationOk) return 5;
        if (updatedValue !== null) return 4;
        if (txConfirmed) return 3;
        if (predictionConfirmed) return 2;
        if (initialValue !== null) return 1;
        return 0;
    }, [explanationOk, updatedValue, txConfirmed, predictionConfirmed, initialValue]);

    const predictionNumber = prediction === "" ? null : Number(prediction);
    const predictionCorrect =
        updatedValue !== null && predictionNumber !== null
            ? predictionNumber === updatedValue
            : null;
    const stepCompletion = [
        initialValue !== null,
        predictionConfirmed,
        txConfirmed,
        updatedValue !== null,
        explanationOk === true,
    ];
    // Improved phaseMessage clarity and causal phrasing
    const phaseMessage =
        simState.phase === "created"
            ? lang === "gr"
                ? "Συναλλαγή δημιουργήθηκε — έτοιμη να εισέλθει στο δίκτυο"
                : "Transaction created — ready to enter the network"
            : simState.phase === "pending"
                ? lang === "gr"
                    ? "Η συναλλαγή μεταδόθηκε — αναμονή για ένταξη σε block"
                    : "Transaction broadcast — waiting for block inclusion"
                : simState.phase === "included"
                    ? lang === "gr"
                        ? "Η συναλλαγή εντάχθηκε σε block — εκτελείται τώρα"
                        : "Transaction included in block — execution happening"
                    : simState.phase === "executed"
                        ? lang === "gr"
                            ? "Η εκτέλεση ολοκληρώθηκε — η νέα κατάσταση είναι πλέον αναγνώσιμη"
                            : "Execution complete — state updated and now readable"
                        : null;

    const card =
        "rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/40";

    const getProvider = async (withSigner = false) => {
        if (!window.ethereum) {
            throw new Error(
                lang === "gr"
                    ? "Δεν βρέθηκε wallet browser."
                    : "No browser wallet was found."
            );
        }
        const provider = new BrowserProvider(window.ethereum);
        if (withSigner) {
            await provider.send("eth_requestAccounts", []);
            return { provider, runner: await provider.getSigner() };
        }
        return { provider, runner: provider };
    };

    // Patch 2 — no longer resets downstream state
    const handleReadCurrentValue = async () => {
        try {
            setError("");
            const { runner } = await getProvider(false);
            const contract = new Contract(demoContractAddress, counterAbi, runner);
            const value = Number(await contract.value());
            setInitialValue(value);
        } catch (err) {
            setError(err?.message ?? String(err));
        }
    };

    const handleSendTransaction = async () => {
        try {
            setError("");
            setTxPending(true);
            const { runner } = await getProvider(true);
            const contract = new Contract(demoContractAddress, counterAbi, runner);
            const tx = await contract.increment();
            setSimState((prev) => ({
                ...prev,
                tx: tx.hash,
                phase: "created",
            }));
            setTxHash(tx.hash);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSimState((prev) => ({
                ...prev,
                phase: "pending",
            }));
            await tx.wait();
            setSimState((prev) => ({
                ...prev,
                phase: "included",
            }));
            setTxConfirmed(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSimState((prev) => ({
                ...prev,
                phase: "executed",
            }));
        } catch (err) {
            setError(err?.message ?? String(err));
        } finally {
            setTxPending(false);
        }
    };

    const handleReadUpdatedValue = async () => {
        try {
            setError("");
            const { runner } = await getProvider(false);
            const contract = new Contract(demoContractAddress, counterAbi, runner);
            const value = Number(await contract.value());
            setUpdatedValue(value);
            setSimState((prev) => ({
                ...prev,
                stateValue: value,
            }));
        } catch (err) {
            setError(err?.message ?? String(err));
        }
    };


    const resetLab = () => {
        setInitialValue(null);
        setPrediction("");
        setPredictionConfirmed(false);
        setTxHash("");
        setTxPending(false);
        setTxConfirmed(false);
        setUpdatedValue(null);
        setExplanationOk(null);
        setError("");
        setSimState({
            tx: null,
            phase: "idle",
            stateValue: null,
        });
        setSelectedReason(null);
    };

    return (
        <PageShell>
            <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">

                {/* Header */}
                <section className={card}>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{copy.title}</h1>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">{copy.intro}</p>
                </section>

                {/* Step tracker */}
                <section className={card}>
                    <div className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                        Step {Math.min(step + 1, copy.steps.length)} / {copy.steps.length}
                    </div>
                    <div className="space-y-2">
                        {copy.steps.map((label, index) => (
                            <div key={label} className="flex gap-3">
                                <div className={`text-sm ${stepCompletion[index] ? "text-green-500 dark:text-green-400" : index === step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>
                                    {stepCompletion[index] ? "✔" : index === step ? "●" : "○"}
                                </div>
                                <div>
                                    <div
                                        className={
                                            index === step
                                                ? "font-semibold text-slate-900 dark:text-white"
                                                : "text-slate-700 dark:text-slate-300"
                                        }
                                    >
                                        {label}
                                    </div>
                                    {index === step ? (
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {copy.instructions[index]}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                    {explanationOk === true ? (
                        <div className="mt-3 text-xs text-green-400">
                            ✔ {copy.completedSteps}
                        </div>
                    ) : null}
                </section>

                {/* Patch 8 — system flow visual diagram */}
                <section className={card}>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {copy.flowSteps.map((label, i) => (
                            <span key={label} className="flex items-center gap-2">
                                <span className="px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 text-xs font-semibold tracking-wide dark:bg-indigo-500/15 dark:text-indigo-300">
                                    {label}
                                </span>
                                {i < copy.flowSteps.length - 1 && (
                                    <span className="text-slate-600 dark:text-slate-400 text-base select-none">→</span>
                                )}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Interaction tool */}
                <section className={card}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{copy.toolTitle}</h2>
                        <a
                            href={`https://blockexplorer.dimikog.org/address/${demoContractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                        >
                            {copy.explorerLink}
                        </a>
                    </div>
                    <p className="mb-6 text-sm text-slate-700 dark:text-slate-400">{copy.toolIntro}</p>

                    {phaseMessage ? (
                        <div className="mb-6 rounded border border-indigo-500/20 bg-indigo-500/10 p-3 text-sm text-indigo-800 dark:text-indigo-200">
                            {phaseMessage}
                        </div>
                    ) : null}

                    <div className="grid gap-6">

                        {/* Step 1 — Read current state */}
                        <section className="rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{copy.contractCardTitle}</h3>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{copy.contractCardBody}</p>
                            <button
                                onClick={handleReadCurrentValue}
                                className="mt-4 flex items-center gap-3 rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                            >
                                {copy.readButton}
                            </button>
                            {initialValue !== null ? (
                                <>
                                    <div className="mt-4 rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
                                        {copy.currentValue}:{" "}
                                        <span className="font-mono">{initialValue}</span>
                                    </div>
                                    {/* Patch 9 — step 1 insight */}
                                    <div className="mt-3 rounded border border-slate-200/70 bg-slate-100 p-3 text-xs text-slate-700 dark:border-slate-600/40 dark:bg-slate-800/40 dark:text-slate-400">
                                        💡 {copy.step1Insight}
                                    </div>
                                </>
                            ) : null}
                        </section>

                        {/* Step 2 — Predict (Patch 3: confirmPrediction now locks prediction) */}
                        <section
                            className={`rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5 ${initialValue === null ? "opacity-50" : ""
                                }`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white">{copy.predictionTitle}</h3>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{copy.predictionPrompt}</p>
                            <div className="mt-4 flex gap-3">
                                <input
                                    type="number"
                                    value={prediction}
                                    disabled={initialValue === null || predictionConfirmed}
                                    onChange={(e) => setPrediction(e.target.value)}
                                    className="w-32 rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                                />
                                <button
                                    disabled={
                                        initialValue === null ||
                                        prediction === "" ||
                                        predictionConfirmed
                                    }
                                    onClick={() => {
                                        setPredictionConfirmed(true);
                                        setError("");
                                    }}
                                    className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
                                >
                                    {copy.confirmPrediction}
                                </button>
                            </div>
                            {predictionConfirmed && (
                                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                                    📌 {copy.predictionLocked}{" "}
                                    <span className="font-mono text-slate-900 dark:text-slate-200">{prediction}</span>
                                </div>
                            )}
                        </section>

                        {/* Step 3 — Execute (gated on predictionConfirmed) */}
                        <section
                            className={`rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5 ${!predictionConfirmed ? "opacity-50" : ""
                                }`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white">{copy.executeTitle}</h3>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{copy.executeBody}</p>
                            <div className="mt-3 rounded border border-indigo-400/20 bg-indigo-500/10 p-3 text-xs text-indigo-800 dark:text-indigo-300">
                                {copy.visualizerCallout}
                            </div>
                            <button
                                disabled={!predictionConfirmed || txPending || txConfirmed}
                                onClick={handleSendTransaction}
                                className="mt-4 flex items-center gap-3 rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
                            >
                                {copy.executeButton}
                            </button>
                            {txPending ? (
                                <div className="mt-4 text-sm text-amber-700 dark:text-amber-300">{copy.txPending}</div>
                            ) : null}
                            {txConfirmed ? (
                                <>
                                    <div className="mt-4 rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
                                        <div>{copy.txConfirmed}</div>
                                    </div>
                                    {txHash ? (
                                        <div className="break-all font-mono text-[10px] text-slate-600 mt-1 dark:text-slate-400">
                                            {copy.txHash}: {txHash}
                                        </div>
                                    ) : null}
                                    {/* Patch 9 — step 3 insight */}
                                    <div className="mt-3 rounded border border-slate-200/70 bg-slate-100 p-3 text-xs text-slate-700 dark:border-slate-600/40 dark:bg-slate-800/40 dark:text-slate-400">
                                        💡 {copy.step3Insight}
                                    </div>
                                </>
                            ) : null}
                        </section>

                        {/* Step 4 — Verify */}
                        <section
                            className={`rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5 ${!txConfirmed ? "opacity-50" : ""
                                }`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white">{copy.verifyTitle}</h3>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{copy.verifyBody}</p>
                            <button
                                disabled={!txConfirmed}
                                onClick={handleReadUpdatedValue}
                                className="mt-4 flex items-center gap-3 rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
                            >
                                {copy.verifyButton}
                            </button>
                            {updatedValue !== null ? (
                                <div className="mt-4 rounded border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-slate-200">
                                    <div>
                                        {copy.updatedValue}:{" "}
                                        <span className="font-mono">{updatedValue}</span>
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {predictionCorrect
                                            ? copy.correctPrediction
                                            : copy.incorrectPrediction}
                                    </div>
                                    <div className="mt-1 text-slate-600 dark:text-slate-400">
                                        {copy.actualResult}:{" "}
                                        <span className="font-mono">{updatedValue}</span>
                                    </div>
                                    {/* Patch 10 — educational note on wrong prediction */}
                                    {predictionCorrect === false && (
                                        <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                                            💡 {copy.incorrectPredictionExplain}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </section>

                        {/* Step 5 — Multiple choice, immediate per-option feedback */}
                        <section
                            className={`rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5 ${updatedValue === null ? "opacity-50" : ""}`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white">{copy.explanationTitle}</h3>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{copy.explanationPrompt}</p>

                            <div className="mt-4 space-y-2 text-sm">
                                {copy.explanationOptions.map((option) => {
                                    const isSelected = selectedReason === option.id;
                                    const borderColor = isSelected
                                        ? option.correct
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-red-500 bg-red-500/10"
                                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950";
                                    return (
                                        <div key={option.id}>
                                            <label className={`block rounded border px-3 py-2 cursor-pointer transition-colors ${borderColor}`}>
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={option.id}
                                                    checked={isSelected}
                                                    disabled={updatedValue === null || explanationOk}
                                                    onChange={() => setSelectedReason(option.id)}
                                                    className="mr-2"
                                                />
                                                {option.label}
                                            </label>
                                            {isSelected && (
                                                <div className={`mt-1 px-3 py-2 rounded text-xs ${option.correct ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}`}>
                                                    {option.feedback}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                disabled={updatedValue === null || selectedReason !== "tx" || explanationOk}
                                onClick={() => setExplanationOk(true)}
                                className="mt-5 rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
                            >
                                {copy.confirmExplanation}
                            </button>
                        </section>
                    </div>

                    {error ? (
                        <div className="mt-6 rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    ) : null}
                </section>

                {/* Visualizer section */}
                <section className={`${card} transition-all duration-300`}>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
                        {lang === "gr"
                            ? "📊 Παρακολούθησε πώς η συναλλαγή περνά από κάθε στάδιο του συστήματος."
                            : "📊 Follow how your transaction moves through each stage of the system."}
                    </p>
                    {simState.phase === "idle" && (
                        <div className="mb-4 rounded border border-slate-200/70 bg-slate-100 p-3 text-xs text-slate-700 text-center dark:border-slate-600/40 dark:bg-slate-800/30 dark:text-slate-400">
                            {copy.visualizerIdlePlaceholder}
                        </div>
                    )}
                    <TransactionStateVisualizer
                        simState={simState}
                        copy={{
                            title: copy.visualizerTitle,
                            subtitle: copy.visualizerSubtitle,
                            idle: copy.visualizerIdle,
                            created: copy.visualizerCreated,
                            pending: copy.visualizerPending,
                            included: copy.visualizerIncluded,
                            executed: copy.visualizerExecuted,
                            txHash: copy.visualizerTxHash,
                            stateValue: copy.visualizerStateValue,
                            noState: copy.visualizerNoState,
                        }}
                    />
                    {/* Unified simHighlight feedback block */}
                    {simHighlight && (
                        <div className="mt-2 text-xs">
                            {simHighlight === "tx-created" && (
                                <span className="text-indigo-800 dark:text-indigo-300">🚀 Transaction created — ready to enter network</span>
                            )}
                            {simHighlight === "tx-pending" && (
                                <span className="text-amber-700 dark:text-yellow-400 animate-pulse">⏳ Pending — waiting for block inclusion</span>
                            )}
                            {simHighlight === "block-added" && (
                                <span className="text-indigo-700 dark:text-indigo-400">📦 Included in block → execution triggered</span>
                            )}
                            {simHighlight === "state-updated" && (
                                <span className="text-green-400">🟢 State updated on-chain</span>
                            )}
                        </div>
                    )}
                    {/* Keep the separate stateValue display below */}
                    {simHighlight === "state-updated" && simState?.stateValue !== null && (
                        <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                            ✔ New state value: {simState.stateValue}
                        </div>
                    )}
                </section>

                {/* Discovered Data — reactive accumulation of what the student proved */}
                <section className={card}>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{copy.discoveredTitle}</h2>
                    {(() => {
                        const items = [
                            initialValue !== null ? copy.discovery1 : null,
                            txConfirmed ? copy.discovery3 : null,
                            updatedValue !== null
                                ? `${copy.discovery4Prefix} ${initialValue} → ${updatedValue} ${copy.discovery4Suffix}`
                                : null,
                        ].filter(Boolean);
                        return items.length === 0 ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400">{copy.discoveredEmpty}</p>
                        ) : (
                            <div className="rounded border border-slate-200/70 bg-slate-100 p-4 dark:border-slate-600/40 dark:bg-slate-800/30">
                                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    {items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-green-400 mt-0.5 shrink-0">✔</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })()}
                </section>

                {/* What This Lab Proves — permanent summary */}
                <section className={card}>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{copy.whatThisShowsTitle}</h2>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {copy.whatThisShowsBullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-0.5 shrink-0">›</span>
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Final Reflection — unlocked at completion */}
                {explanationOk && (
                    <section className={card}>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{copy.finalReflectionTitle}</h2>
                        <p className="text-sm text-slate-800 dark:text-slate-200">{copy.finalReflectionQuestion}</p>
                        <p className="mt-2 text-xs text-slate-600 italic dark:text-slate-400">{copy.finalReflectionHint}</p>
                        <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-400">{copy.finalReflectionAnswer}</p>
                    </section>
                )}

                {/* Completion */}
                {explanationOk ? (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
                            {copy.rewardClaimTitle}
                        </h2>
                        <p className="mt-2 text-slate-700 dark:text-slate-200">
                            {copy.rewardClaimDescription}
                        </p>
                        <div className="mt-6">
                            <LabCompletionClaim
                                labId="system-s2"
                                language={lang}
                                backHref={copy.backHref}
                                backLabel={copy.backLabel}
                                labTitle={copy.title}
                                claimButtonLabel={copy.claimRewardButton}
                                claimingButtonLabel={copy.claimingRewardButton}
                            />
                        </div>
                    </section>
                ) : null}

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
                    <a
                        href={copy.backHref}
                        className="text-sm text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {copy.backLabel}
                    </a>
                    <button
                        onClick={resetLab}
                        className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        {copy.resetLab}
                    </button>
                </div>
            </div>
        </PageShell>
    );
}
