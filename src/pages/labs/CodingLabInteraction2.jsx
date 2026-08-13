import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { useAccount } from "wagmi";
import SystemLabTemplate from "./SystemLabTemplate";
import LabCompletionClaim from "../../components/LabCompletionClaim";
import { useIdentity } from "../../context/useIdentity.js";
import { useSocialIdentity } from "../../context/SocialIdentityContext.jsx";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
    getEffectiveLabsWalletIdentity,
    postCoding02StartInteraction,
    postCoding02VerifyIncrement,
} from "../../utils/labWriteApi.js";
import {
    AlertTriangle,
    CheckCircle2,
    Loader2,
    RotateCcw,
    BookOpen,
    ArrowUpCircle,
    Eye,
    ShieldCheck,
    XCircle,
} from "lucide-react";

const INCREMENT_SELECTOR = "0xd09de08a";
const counterAbi = ["function value() view returns (uint256)"];

function getVerifyCurrentValue(data) {
    if (!data) return null;
    if (data.finalValue != null) return String(data.finalValue);
    if (data.currentValue != null) return String(data.currentValue);
    return null;
}

function hasVerifyValueIncrease(initial, current) {
    if (initial == null || current == null) return false;
    try {
        return BigInt(String(current)) > BigInt(String(initial));
    } catch {
        return false;
    }
}

function isCoding02VerifySuccess(result, data) {
    if (!result?.ok || !data) return false;
    if (data.stateChangeVerified === true) return true;
    return hasVerifyValueIncrease(data.initialValue, getVerifyCurrentValue(data));
}

function shouldShowCoding02VerifyFailure(result, data) {
    if (isCoding02VerifySuccess(result, data)) return false;
    if (result?.ok === false) return true;
    if (data?.stateChangeVerified === false) return true;
    return false;
}

const CONTENT = {
    en: {
        title: "Coding Lab 02 — Interact With Your Deployed Counter Contract",
        subtitle:
            "Read your Counter's on-chain value, send an increment transaction, and verify that blockchain state changed.",
        kicker: "Read, Write, Verify",
        level: "Beginner",
        estimatedTime: "10–15 minutes",
        badge: "Contract Interaction Builder",
        stepLabel: "Step",
        steps: [
            "Load verified Counter contract",
            "Read current value",
            "Call increment()",
            "Verify state change",
            "Pass the checkpoint",
        ],
        instructions: [
            "Load the Counter contract you verified in Coding Lab 01.",
            "Read value() with a gas-free eth_call.",
            "Send increment() as a state-changing transaction from your wallet.",
            "Confirm on-chain state changed through Web3Edu verification.",
            "Answer the checkpoint question correctly.",
        ],
        backHref: "/labs/coding-02",
        backLabel: "⬅ Back to lab overview",
        labsOverviewPath: "/labs",
        coding01Path: "/labs/coding-01",
        simulatorTitle: "Interaction Workflow",
        workflowTitle: "Contract interaction workflow",
        workflowIntro:
            "Unlike Coding Lab 01, you are not deploying a new contract. You interact with the Counter instance you already verified — separating read-only calls from state-changing transactions.",
        loadSectionTitle: "Load verified Counter contract",
        loadSectionDescription:
            "Web3Edu loads the Counter contract address recorded when you completed Coding Lab 01.",
        loadButton: "Load my Counter contract",
        loadingButton: "Loading…",
        walletRequired: "Connect your Web3Edu identity before starting this lab.",
        lab01Required:
            "Complete Coding Lab 01 first using the same Web3Edu identity. If you completed Coding Lab 01 with social sign-in, sign in the same way before starting Coding Lab 02.",
        lab01RequiredHint:
            "Deploy and verify your Counter contract in Coding Lab 01, then return here.",
        contractAddressLabel: "Contract address",
        initialValueLabel: "Initial value",
        readSectionTitle: "Read current value",
        readSectionDescription:
            "Calling value() is a read-only eth_call. It does not cost gas and does not change blockchain state.",
        readButton: "Read value()",
        readingButton: "Reading…",
        readValueLabel: "Current value",
        readInsight: "This was a read-only eth_call — no gas, no transaction, no state change.",
        incrementSectionTitle: "Call increment()",
        incrementSectionDescription:
            "Sending increment() is a state-changing transaction. Your wallet must sign it and pay gas on Besu Edu-Net.",
        incrementButton: "Send increment() transaction",
        incrementPendingButton: "Transaction pending…",
        incrementDataLabel: "Calldata",
        txHashLabel: "Transaction hash",
        incrementSent: "Increment transaction sent.",
        incrementConfirmed: "Transaction confirmed on-chain.",
        walletConnectRequired: "Connect a browser wallet (MetaMask) to send the increment transaction.",
        verifySectionTitle: "Verify state change",
        verifySectionDescription:
            "Web3Edu checks on-chain storage to confirm the Counter value increased after your increment transaction.",
        verifyButton: "Verify increment",
        verifyingButton: "Verifying…",
        initialValueResultLabel: "Initial value (session baseline)",
        currentValueResultLabel: "Current value",
        finalValueResultLabel: "Final value",
        stateChangeVerifiedLabel: "State change verified",
        verifyRequiresTxHash: "Transaction hash missing — send increment() first, then verify.",
        incrementNotDetected:
            "Increment not detected yet. Wait for confirmation and try again.",
        verifySuccess: "Counter increment verified on Besu Edu-Net.",
        checkpointQuestion: "Which operation changes blockchain state?",
        checkpointOptions: [
            "Reading value()",
            "Calling increment()",
            "Opening Remix",
            "Copying the contract address",
        ],
        checkpointCorrectIndex: 1,
        checkpointCorrect:
            "Correct. Calling increment() sends a signed transaction that executes contract code and updates on-chain storage.",
        checkpointWrong:
            "Not quite. Only state-changing transactions — like increment() — modify blockchain state.",
        checkpointReadyToClaim:
            "All steps, on-chain verification, and the checkpoint are complete. You can now claim the reward.",
        completeLabel: "Lab completion",
        completeDescription:
            "Finish all interaction steps, verify the increment on-chain, and answer the checkpoint correctly to unlock the reward claim.",
        allStepsCompleted: "All required interaction steps completed",
        actionLabels: { reset: "Reset Lab" },
        notesTitle: "Current Goal",
        notesPanelTitle: "Concepts in this lab",
        notes: [
            "Read-only contract calls (eth_call) return state without gas or transactions.",
            "State-changing calls require a signed transaction and gas.",
            "Transaction confirmation means the EVM executed your call inside a block.",
            "On-chain verification compares storage before and after your increment.",
        ],
        takeaways: [
            "Reading value() observes state; increment() changes it.",
            "Only write operations create transactions and cost gas.",
            "State changes persist in contract storage after block confirmation.",
            "This lab builds directly on the Counter you deployed in Coding Lab 01.",
        ],
        commonMistakesTitle: "Common Mistakes",
        commonMistakes: [
            "Trying to increment before completing Coding Lab 01 verification.",
            "Using the wrong network — stay on Besu Edu-Net.",
            "Assuming a read call changed state because the UI updated.",
            "Verifying before the increment transaction is confirmed.",
        ],
        controlsTitle: "Task Controls",
        eventsTitle: "Observed Outcomes",
        comparisonTitle: "Key Takeaways",
        reflectionTitle: "Checkpoint",
        currentAction: "Current lab state",
    },
    gr: {
        title: "Coding Lab 02 — Αλληλεπίδραση με το δικό σου Counter Contract",
        subtitle:
            "Διάβασε την on-chain τιμή του Counter σου, στείλε συναλλαγή increment και επιβεβαίωσε ότι η κατάσταση του blockchain άλλαξε.",
        kicker: "Ανάγνωση, Εγγραφή, Επαλήθευση",
        level: "Αρχάριο",
        estimatedTime: "10–15 λεπτά",
        badge: "Contract Interaction Builder",
        stepLabel: "Βήμα",
        steps: [
            "Φόρτωση επαληθευμένου Counter contract",
            "Ανάγνωση τρέχουσας τιμής",
            "Κλήση increment()",
            "Επαλήθευση αλλαγής κατάστασης",
            "Πέρασμα checkpoint",
        ],
        instructions: [
            "Φόρτωσε το Counter contract που επαλήθευσες στο Coding Lab 01.",
            "Διάβασε το value() με gas-free eth_call.",
            "Στείλε increment() ως state-changing transaction από το wallet σου.",
            "Επιβεβαίωσε ότι η on-chain κατάσταση άλλαξε μέσω Web3Edu.",
            "Απάντησε σωστά στην ερώτηση checkpoint.",
        ],
        backHref: "/labs-gr/coding-02",
        backLabel: "⬅ Επιστροφή στην επισκόηση",
        labsOverviewPath: "/labs-gr",
        coding01Path: "/labs-gr/coding-01",
        simulatorTitle: "Ροή Αλληλεπίδρασης",
        workflowTitle: "Ροή contract interaction",
        workflowIntro:
            "Σε αντίθεση με το Coding Lab 01, εδώ δεν κάνεις deploy νέου contract. Αλληλεπιδράς με το Counter instance που έχεις ήδη επαληθεύσει — διαχωρίζοντας read-only calls από state-changing transactions.",
        loadSectionTitle: "Φόρτωση επαληθευμένου Counter contract",
        loadSectionDescription:
            "Το Web3Edu φορτώνει τη contract address που καταγράφηκε όταν ολοκλήρωσες το Coding Lab 01.",
        loadButton: "Φόρτωση Counter contract",
        loadingButton: "Φόρτωση…",
        walletRequired: "Σύνδεσε την Web3Edu identity σου πριν ξεκινήσεις αυτό το lab.",
        lab01Required:
            "Ολοκλήρωσε πρώτα το Coding Lab 01 με την ίδια Web3Edu ταυτότητα. Αν ολοκλήρωσες το Coding Lab 01 με social sign-in, συνδέσου ξανά με τον ίδιο τρόπο πριν ξεκινήσεις το Coding Lab 02.",
        lab01RequiredHint:
            "Κάνε deploy και επαλήθευσε το Counter contract σου στο Coding Lab 01 και επέστρεψε εδώ.",
        contractAddressLabel: "Contract address",
        initialValueLabel: "Αρχική τιμή",
        readSectionTitle: "Ανάγνωση τρέχουσας τιμής",
        readSectionDescription:
            "Η κλήση value() είναι read-only eth_call. Δεν κοστίζει gas και δεν αλλάζει την κατάσταση του blockchain.",
        readButton: "Ανάγνωση value()",
        readingButton: "Ανάγνωση…",
        readValueLabel: "Τρέχουσα τιμή",
        readInsight: "Αυτό ήταν read-only eth_call — χωρίς gas, χωρίς συναλλαγή, χωρίς αλλαγή κατάστασης.",
        incrementSectionTitle: "Κλήση increment()",
        incrementSectionDescription:
            "Η αποστολή increment() είναι state-changing transaction. Το wallet σου πρέπει να την υπογράψει και να πληρώσει gas στο Besu Edu-Net.",
        incrementButton: "Αποστολή συναλλαγής increment()",
        incrementPendingButton: "Συναλλαγή σε εκκρεμότητα…",
        incrementDataLabel: "Calldata",
        txHashLabel: "Transaction hash",
        incrementSent: "Η συναλλαγή increment στάλθηκε.",
        incrementConfirmed: "Η συναλλαγή επιβεβαιώθηκε on-chain.",
        walletConnectRequired:
            "Σύνδεσε browser wallet (MetaMask) για να στείλεις τη συναλλαγή increment.",
        verifySectionTitle: "Επαλήθευση αλλαγής κατάστασης",
        verifySectionDescription:
            "Το Web3Edu ελέγχει το on-chain storage για να επιβεβαιώσει ότι η τιμή του Counter αυξήθηκε μετά τη συναλλαγή increment.",
        verifyButton: "Επαλήθευση increment",
        verifyingButton: "Επαλήθευση…",
        initialValueResultLabel: "Αρχική τιμή (baseline session)",
        currentValueResultLabel: "Τρέχουσα τιμή",
        finalValueResultLabel: "Τελική τιμή",
        stateChangeVerifiedLabel: "Επαληθεύτηκε αλλαγή κατάστασης",
        verifyRequiresTxHash:
            "Λείπει transaction hash — στείλε πρώτα increment() και μετά επαλήθευσε.",
        incrementNotDetected:
            "Δεν εντοπίστηκε ακόμη increment. Περίμενε επιβεβαίωση και δοκίμασε ξανά.",
        verifySuccess: "Το increment του Counter επαληθεύτηκε στο Besu Edu-Net.",
        checkpointQuestion: "Ποια λειτουργία αλλάζει την κατάσταση του blockchain;",
        checkpointOptions: [
            "Ανάγνωση value()",
            "Κλήση increment()",
            "Άνοιγμα Remix",
            "Αντιγραφή contract address",
        ],
        checkpointCorrectIndex: 1,
        checkpointCorrect:
            "Σωστά. Η κλήση increment() στέλνει υπογεγραμμένη συναλλαγή που εκτελεί κώδικα contract και ενημερώνει on-chain storage.",
        checkpointWrong:
            "Όχι ακριβώς. Μόνο οι state-changing transactions — όπως το increment() — τροποποιούν την κατάσταση του blockchain.",
        checkpointReadyToClaim:
            "Όλα τα βήματα, η on-chain επαλήθευση και το checkpoint ολοκληρώθηκαν. Μπορείς τώρα να κάνεις claim το reward.",
        completeLabel: "Ολοκλήρωση Lab",
        completeDescription:
            "Ολοκλήρωσε όλα τα βήματα, επαλήθευσε το increment on-chain και απάντησε σωστά στο checkpoint για να ξεκλειδώσεις το reward claim.",
        allStepsCompleted: "Όλα τα απαιτούμενα βήματα interaction ολοκληρώθηκαν",
        actionLabels: { reset: "Επαναφορά Lab" },
        notesTitle: "Τρέχων Στόχος",
        notesPanelTitle: "Έννοιες σε αυτό το lab",
        notes: [
            "Τα read-only contract calls (eth_call) επιστρέφουν κατάσταση χωρίς gas ή συναλλαγές.",
            "Οι state-changing κλήσεις απαιτούν υπογεγραμμένη συναλλαγή και gas.",
            "Η επιβεβαίωση συναλλαγής σημαίνει ότι το EVM εκτέλεσε την κλήση σου μέσα σε block.",
            "Η on-chain επαλήθευση συγκρίνει storage πριν και μετά το increment.",
        ],
        takeaways: [
            "Το value() παρατηρεί κατάσταση· το increment() την αλλάζει.",
            "Μόνο οι write operations δημιουργούν συναλλαγές και κοστίζουν gas.",
            "Οι αλλαγές κατάστασης παραμένουν στο contract storage μετά την επιβεβαίωση block.",
            "Αυτό το lab βασίζεται στο Counter που έκανες deploy στο Coding Lab 01.",
        ],
        commonMistakesTitle: "Συχνά Λάθη",
        commonMistakes: [
            "Προσπάθεια increment πριν ολοκληρωθεί η επαλήθευση Coding Lab 01.",
            "Χρήση λάθους δικτύου — μείνε στο Besu Edu-Net.",
            "Υπόθεση ότι read call άλλαξε κατάσταση επειδή ενημερώθηκε το UI.",
            "Επαλήθευση πριν επιβεβαιωθεί η συναλλαγή increment.",
        ],
        controlsTitle: "Έλεγχοι Εργασιών",
        eventsTitle: "Παρατηρούμενα Αποτελέσματα",
        comparisonTitle: "Βασικά Συμπεράσματα",
        reflectionTitle: "Checkpoint",
        currentAction: "Τρέχουσα κατάσταση lab",
    },
};

export default function CodingLabInteraction2({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;
    const { address } = useAccount();
    const { smartAccount, owner: identityOwner } = useIdentity();
    const { socialIdentity, isOidcAuthenticated, socialIdentityLoading, oidcAuthLoading } = useSocialIdentity();
    const apiBase = getWeb3eduBackendUrl();

    const { wallet: progressWallet } = useMemo(
        () =>
            getEffectiveLabsWalletIdentity({
                smartAccount,
                isOidcAuthenticated,
                socialIdentity,
                socialIdentityLoading,
                oidcAuthLoading,
                address,
                owner: identityOwner,
            }),
        [
            smartAccount,
            isOidcAuthenticated,
            socialIdentity,
            socialIdentityLoading,
            oidcAuthLoading,
            address,
            identityOwner,
        ]
    );

    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const [sessionError, setSessionError] = useState(null);
    const [lab01Missing, setLab01Missing] = useState(false);
    const [contractAddress, setContractAddress] = useState(null);
    const [initialValueFromBackend, setInitialValueFromBackend] = useState(null);

    const [readLoading, setReadLoading] = useState(false);
    const [readValue, setReadValue] = useState(null);
    const [readDone, setReadDone] = useState(false);

    const [incrementPending, setIncrementPending] = useState(false);
    const [incrementTxHash, setIncrementTxHash] = useState(null);
    const [incrementSent, setIncrementSent] = useState(false);
    const [incrementConfirmed, setIncrementConfirmed] = useState(false);
    const [incrementError, setIncrementError] = useState(null);

    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyResult, setVerifyResult] = useState(null);
    const [verifyError, setVerifyError] = useState(null);
    const [stateChangeVerified, setStateChangeVerified] = useState(false);

    const [checkpointAnswer, setCheckpointAnswer] = useState(null);
    const [checkpointSubmitted, setCheckpointSubmitted] = useState(false);
    const [checkpointCorrect, setCheckpointCorrect] = useState(false);

    const sessionStartedRef = useRef(false);
    const lockedInitialValueRef = useRef(null);

    const loadSession = useCallback(async () => {
        if (!progressWallet) {
            setSessionError(copy.walletRequired);
            setLab01Missing(false);
            return;
        }

        if (sessionStartedRef.current) {
            return;
        }

        setSessionLoading(true);
        setSessionError(null);
        setLab01Missing(false);

        try {
            const result = await postCoding02StartInteraction({
                apiBase,
                smartAccount,
                address,
                owner: identityOwner,
                isOidcAuthenticated,
                socialIdentity,
                socialIdentityLoading,
                oidcAuthLoading,
            });

            if (result.ok) {
                sessionStartedRef.current = true;
                setSessionLoaded(true);
                setContractAddress(result.data.contractAddress ?? null);

                if (
                    lockedInitialValueRef.current == null &&
                    result.data.initialValue != null
                ) {
                    lockedInitialValueRef.current = String(result.data.initialValue);
                    setInitialValueFromBackend(String(result.data.initialValue));
                }
            } else {
                const message =
                    result.data?.message ||
                    result.data?.error ||
                    copy.lab01Required;
                const missingLab01 =
                    /coding lab 01|coding01|lab 01|complete.*first/i.test(message);
                setLab01Missing(missingLab01);
                setSessionError(missingLab01 ? copy.lab01Required : message);
            }
        } catch {
            setSessionError(copy.lab01Required);
        } finally {
            setSessionLoading(false);
        }
    }, [
        progressWallet,
        apiBase,
        smartAccount,
        address,
        identityOwner,
        isOidcAuthenticated,
        socialIdentity,
        copy.walletRequired,
        copy.lab01Required,
        socialIdentityLoading,
        oidcAuthLoading,
    ]);

    const handleReadValue = async () => {
        if (!contractAddress) return;

        setReadLoading(true);
        try {
            if (window.ethereum) {
                const provider = new BrowserProvider(window.ethereum);
                const contract = new Contract(contractAddress, counterAbi, provider);
                const value = await contract.value();
                setReadValue(value.toString());
            } else if (initialValueFromBackend != null) {
                setReadValue(String(initialValueFromBackend));
            }
            setReadDone(true);
        } catch (err) {
            if (initialValueFromBackend != null) {
                setReadValue(String(initialValueFromBackend));
                setReadDone(true);
            } else {
                setSessionError(err?.message ?? String(err));
            }
        } finally {
            setReadLoading(false);
        }
    };

    const handleIncrement = async () => {
        if (!contractAddress) return;

        if (!window.ethereum) {
            setIncrementError(copy.walletConnectRequired);
            return;
        }

        setIncrementPending(true);
        setIncrementError(null);

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const tx = await signer.sendTransaction({
                to: contractAddress,
                data: INCREMENT_SELECTOR,
            });
            setIncrementTxHash(tx.hash);
            setIncrementSent(true);
            await tx.wait();
            setIncrementConfirmed(true);
        } catch (err) {
            setIncrementError(err?.message ?? String(err));
        } finally {
            setIncrementPending(false);
        }
    };

    const handleVerifyIncrement = async () => {
        if (!progressWallet) {
            setVerifyError(copy.walletRequired);
            return;
        }

        if (!incrementTxHash) {
            setVerifyError(copy.verifyRequiresTxHash);
            return;
        }

        setVerifyLoading(true);
        setVerifyError(null);
        setVerifyResult(null);
        setStateChangeVerified(false);

        try {
            const result = await postCoding02VerifyIncrement({
                apiBase,
                smartAccount,
                address,
                owner: identityOwner,
                isOidcAuthenticated,
                socialIdentity,
                socialIdentityLoading,
                oidcAuthLoading,
                txHash: incrementTxHash,
            });

            const responseData = result.data ?? null;
            setVerifyResult(responseData);

            if (isCoding02VerifySuccess(result, responseData)) {
                setStateChangeVerified(true);
                setVerifyError(null);
                return;
            }

            if (shouldShowCoding02VerifyFailure(result, responseData)) {
                setVerifyError(
                    responseData?.message ||
                        responseData?.error ||
                        copy.incrementNotDetected
                );
            }
        } catch {
            setVerifyError(copy.incrementNotDetected);
        } finally {
            setVerifyLoading(false);
        }
    };

    const submitCheckpoint = () => {
        if (checkpointAnswer === null) return;
        const isCorrect = checkpointAnswer === copy.checkpointCorrectIndex;
        setCheckpointSubmitted(true);
        setCheckpointCorrect(isCorrect);
    };

    const resetLab = () => {
        sessionStartedRef.current = false;
        lockedInitialValueRef.current = null;
        setSessionLoading(false);
        setSessionLoaded(false);
        setSessionError(null);
        setLab01Missing(false);
        setContractAddress(null);
        setInitialValueFromBackend(null);
        setReadLoading(false);
        setReadValue(null);
        setReadDone(false);
        setIncrementPending(false);
        setIncrementTxHash(null);
        setIncrementSent(false);
        setIncrementConfirmed(false);
        setIncrementError(null);
        setVerifyLoading(false);
        setVerifyResult(null);
        setVerifyError(null);
        setStateChangeVerified(false);
        setCheckpointAnswer(null);
        setCheckpointSubmitted(false);
        setCheckpointCorrect(false);
    };

    const stepItems = useMemo(() => {
        const current = [
            sessionLoaded,
            readDone,
            incrementSent,
            stateChangeVerified,
            checkpointCorrect,
        ];

        return copy.steps.map((title, index) => ({
            label: `${copy.stepLabel} ${index + 1}`,
            title,
            text: copy.instructions[index],
            complete: current[index],
        }));
    }, [copy, sessionLoaded, readDone, incrementSent, stateChangeVerified, checkpointCorrect]);

    const currentStep = useMemo(() => {
        const completion = [
            sessionLoaded,
            readDone,
            incrementSent,
            stateChangeVerified,
            checkpointCorrect,
        ];
        const idx = completion.findIndex((item) => !item);
        return idx === -1 ? stepItems.length : idx;
    }, [sessionLoaded, readDone, incrementSent, stateChangeVerified, checkpointCorrect, stepItems.length]);

    const isComplete =
        sessionLoaded &&
        incrementSent &&
        stateChangeVerified &&
        checkpointCorrect;

    const verifySuccessInitial =
        verifyResult?.initialValue != null ? String(verifyResult.initialValue) : null;
    const verifySuccessCurrent = getVerifyCurrentValue(verifyResult);
    const verifyFailureInitial =
        verifyResult?.initialValue != null ? String(verifyResult.initialValue) : null;
    const verifyFailureCurrent = getVerifyCurrentValue(verifyResult);

    const simulatorContent = (
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-7">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
                <div className="space-y-6">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                            {copy.simulatorTitle}
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {copy.workflowTitle}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {copy.workflowIntro}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                {copy.notesTitle}
                            </div>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                {copy.currentAction}
                            </h3>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {stepItems.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className={`rounded-xl border px-4 py-3 text-sm ${
                                            index < currentStep
                                                ? "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                                                : index === currentStep
                                                  ? "border-cyan-300/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100"
                                                  : "border-slate-200/70 bg-slate-100/80 text-slate-600 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-300"
                                        }`}
                                    >
                                        {step.title}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                {copy.notesPanelTitle}
                            </div>
                            <div className="mt-4 space-y-3">
                                {copy.notes.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                    <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                            {copy.controlsTitle}
                        </div>

                        {/* Step 1 — Load contract */}
                        <div className="mt-5 rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-200">
                                <ShieldCheck className="h-4 w-4" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.loadSectionTitle}
                                </h4>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {copy.loadSectionDescription}
                            </p>
                            <button
                                type="button"
                                onClick={loadSession}
                                disabled={sessionLoading || !progressWallet || sessionLoaded}
                                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                    sessionLoading || !progressWallet || sessionLoaded
                                        ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                }`}
                            >
                                {sessionLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {copy.loadingButton}
                                    </>
                                ) : (
                                    copy.loadButton
                                )}
                            </button>

                            {sessionLoaded && contractAddress && (
                                <div className="mt-4 space-y-2 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                                    <div className="flex items-start gap-2 font-semibold">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{copy.loadSectionTitle}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{copy.contractAddressLabel}: </span>
                                        <span className="font-mono break-all">{contractAddress}</span>
                                    </div>
                                    {initialValueFromBackend != null && (
                                        <div>
                                            <span className="font-semibold">{copy.initialValueLabel}: </span>
                                            <span className="font-mono">{initialValueFromBackend}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {sessionError && !sessionLoaded && (
                                <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                                    <div className="flex items-start gap-2 font-semibold">
                                        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{sessionError}</span>
                                    </div>
                                    {lab01Missing && (
                                        <p className="mt-2">
                                            {copy.lab01RequiredHint}{" "}
                                            <Link
                                                to={copy.coding01Path}
                                                className="font-semibold text-cyan-700 underline dark:text-cyan-200"
                                            >
                                                Coding Lab 01
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Step 2 — Read value */}
                        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-200">
                                <Eye className="h-4 w-4" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.readSectionTitle}
                                </h4>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {copy.readSectionDescription}
                            </p>
                            <button
                                type="button"
                                onClick={handleReadValue}
                                disabled={!sessionLoaded || readLoading}
                                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                    !sessionLoaded || readLoading
                                        ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                }`}
                            >
                                {readLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {copy.readingButton}
                                    </>
                                ) : (
                                    copy.readButton
                                )}
                            </button>
                            {readDone && readValue != null && (
                                <div className="mt-4 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                                    <div>
                                        <span className="font-semibold">{copy.readValueLabel}: </span>
                                        <span className="font-mono">{readValue}</span>
                                    </div>
                                    <p className="mt-2">{copy.readInsight}</p>
                                </div>
                            )}
                        </div>

                        {/* Step 3 — Increment */}
                        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-200">
                                <ArrowUpCircle className="h-4 w-4" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.incrementSectionTitle}
                                </h4>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {copy.incrementSectionDescription}
                            </p>
                            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-semibold">{copy.incrementDataLabel}: </span>
                                <span className="font-mono">{INCREMENT_SELECTOR}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={!sessionLoaded || incrementPending}
                                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                    !sessionLoaded || incrementPending
                                        ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                }`}
                            >
                                {incrementPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {copy.incrementPendingButton}
                                    </>
                                ) : (
                                    copy.incrementButton
                                )}
                            </button>
                            {incrementSent && (
                                <div className="mt-4 space-y-2 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{copy.incrementSent}</span>
                                    </div>
                                    {incrementTxHash && (
                                        <div>
                                            <span className="font-semibold">{copy.txHashLabel}: </span>
                                            <span className="font-mono break-all">{incrementTxHash}</span>
                                        </div>
                                    )}
                                    {incrementConfirmed && (
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{copy.incrementConfirmed}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {incrementError && (
                                <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                                    {incrementError}
                                </div>
                            )}
                        </div>

                        {/* Step 4 — Verify */}
                        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-200">
                                <ShieldCheck className="h-4 w-4" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {copy.verifySectionTitle}
                                </h4>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {copy.verifySectionDescription}
                            </p>
                            <button
                                type="button"
                                onClick={handleVerifyIncrement}
                                disabled={!incrementConfirmed || !incrementTxHash || verifyLoading}
                                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                    !incrementConfirmed || !incrementTxHash || verifyLoading
                                        ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                }`}
                            >
                                {verifyLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {copy.verifyingButton}
                                    </>
                                ) : (
                                    copy.verifyButton
                                )}
                            </button>
                            {stateChangeVerified && verifyResult && (
                                <div className="mt-4 space-y-2 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                                    <div className="flex items-start gap-2 font-semibold">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{copy.verifySuccess}</span>
                                    </div>
                                    {verifySuccessInitial != null && (
                                        <div>
                                            <span className="font-semibold">{copy.initialValueResultLabel}: </span>
                                            <span className="font-mono">{verifySuccessInitial}</span>
                                        </div>
                                    )}
                                    {verifySuccessCurrent != null && (
                                        <div>
                                            <span className="font-semibold">
                                                {verifyResult.finalValue != null
                                                    ? copy.finalValueResultLabel
                                                    : copy.currentValueResultLabel}
                                                :{" "}
                                            </span>
                                            <span className="font-mono">{verifySuccessCurrent}</span>
                                        </div>
                                    )}
                                    {incrementTxHash && (
                                        <div>
                                            <span className="font-semibold">{copy.txHashLabel}: </span>
                                            <span className="font-mono break-all">{incrementTxHash}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {verifyError && !stateChangeVerified && (
                                <div className="mt-4 space-y-2 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{verifyError}</span>
                                    </div>
                                    {verifyFailureInitial != null && verifyFailureCurrent != null && (
                                        <div className="space-y-1 border-t border-amber-200/80 pt-3 dark:border-amber-400/20">
                                            <div>
                                                <span className="font-semibold">{copy.initialValueResultLabel}: </span>
                                                <span className="font-mono">{verifyFailureInitial}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold">
                                                    {verifyResult?.finalValue != null
                                                        ? copy.finalValueResultLabel
                                                        : copy.currentValueResultLabel}
                                                    :{" "}
                                                </span>
                                                <span className="font-mono">{verifyFailureCurrent}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={resetLab}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/70 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.08]"
                        >
                            <RotateCcw className="h-4 w-4" />
                            {copy.actionLabels.reset}
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );

    const eventsContent = (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {lang === "gr" ? "Read vs Write" : "Read vs Write"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {lang === "gr"
                        ? "Το value() είναι eth_call — δωρεάν ανάγνωση. Το increment() είναι συναλλαγή που αλλάζει μόνιμα το storage του contract."
                        : "value() is an eth_call — a free read. increment() is a transaction that permanently changes contract storage."}
                </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {lang === "gr" ? "Τι να παρατηρήσεις" : "What to observe"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {lang === "gr"
                        ? "Μετά το increment, η on-chain τιμή πρέπει να είναι μεγαλύτερη από την αρχική. Αυτή η διαφορά είναι η απόδειξη state change."
                        : "After increment, the on-chain value should be greater than the initial value. That difference is evidence of a state change."}
                </p>
            </div>
        </div>
    );

    const takeawaysContent = (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
                {copy.takeaways.map((item) => (
                    <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200"
                    >
                        <BookOpen className="mt-1 h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-950/45">
                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {copy.commonMistakesTitle}
                    </h3>
                </div>
                <div className="mt-4 space-y-3">
                    {copy.commonMistakes.map((item) => (
                        <div
                            key={item}
                            className="rounded-xl border border-amber-200/80 bg-white px-4 py-3 text-sm leading-7 text-slate-700 dark:border-amber-400/20 dark:bg-slate-900/50 dark:text-slate-200"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const checkpointContent = (
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-950/45">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.checkpointQuestion}</h3>
            <div className="mt-5 space-y-3">
                {copy.checkpointOptions.map((option, index) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setCheckpointAnswer(index)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                            checkpointAnswer === index
                                ? "border-cyan-300/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"
                                : "border-slate-200/70 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                        }`}
                    >
                        {String.fromCharCode(65 + index)}. {option}
                    </button>
                ))}
            </div>
            <button
                type="button"
                onClick={submitCheckpoint}
                disabled={checkpointAnswer === null || !stateChangeVerified}
                className={`mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    checkpointAnswer === null || !stateChangeVerified
                        ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                }`}
            >
                {lang === "gr" ? "Υποβολή απάντησης" : "Submit answer"}
            </button>
            {checkpointSubmitted && (
                <div
                    className={`mt-5 rounded-2xl border px-4 py-4 text-sm leading-7 ${
                        checkpointCorrect
                            ? "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                            : "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100"
                    }`}
                >
                    {checkpointCorrect ? copy.checkpointCorrect : copy.checkpointWrong}
                </div>
            )}
            {isComplete && (
                <div className="mt-5 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                    {copy.checkpointReadyToClaim}
                </div>
            )}
        </div>
    );

    const completionContent = isComplete ? (
        <LabCompletionClaim
            labId="coding02"
            language={lang}
            backHref={copy.backHref}
            backLabel={copy.backLabel}
            labTitle={copy.title}
        />
    ) : null;

    return (
        <SystemLabTemplate
            labId="coding02"
            title={copy.title}
            subtitle={copy.subtitle}
            level={copy.level}
            estimatedTime={copy.estimatedTime}
            xp={350}
            badge={copy.badge}
            backHref={copy.backHref}
            labsOverviewPath={copy.labsOverviewPath}
            kicker={copy.kicker}
            statusBadge={isComplete ? copy.allStepsCompleted : null}
            steps={stepItems}
            currentStep={currentStep}
            simulatorContent={simulatorContent}
            eventsContent={eventsContent}
            takeawaysContent={takeawaysContent}
            checkpointContent={checkpointContent}
            completionContent={completionContent}
            showCompletionSection={isComplete}
            wrapSimulatorSection={false}
            labels={{
                headerPill: "🧪 Web3Edu · Coding Lab",
                stepsTitle: lang === "gr" ? "Οδηγός Lab" : "Lab Guide",
                simulatorTitle: copy.simulatorTitle,
                eventsTitle: copy.eventsTitle,
                takeawaysTitle: copy.comparisonTitle,
                checkpointTitle: copy.reflectionTitle,
                completionTitle: copy.completeLabel,
                completionDescription: copy.completeDescription,
                breadcrumbLabs: lang === "gr" ? "Εργαστήρια" : "Labs",
                breadcrumbSystemLabs: lang === "gr" ? "Εργαστήρια Προγραμματισμού" : "Coding Labs",
                backLabel: copy.backLabel,
                level: lang === "gr" ? "Επίπεδο" : "Level",
                estimatedTime: lang === "gr" ? "Εκτιμώμενος χρόνος" : "Estimated time",
                xp: "XP",
                badgeLabel: lang === "gr" ? "Σήμα" : "Badge",
                stepLabel: copy.stepLabel,
                completedOn: lang === "gr" ? "Ολοκληρώθηκε:" : "Completed on:",
                successMessage:
                    lang === "gr"
                        ? "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς"
                        : "✔ Completion recorded successfully",
                checkingStatus:
                    lang === "gr" ? "Έλεγχος κατάστασης ολοκλήρωσης…" : "Checking completion status…",
            }}
        />
    );
}
