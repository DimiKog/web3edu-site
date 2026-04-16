import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { projectRegistry } from "../projects/projectRegistry";
import { getProjectById, localizeProject } from "../services/projectService";
import CryptoJS from "crypto-js";
import { keccak_256 } from "@noble/hashes/sha3";
import { useIdentity } from "../context/IdentityContext.jsx";
import { useResolvedIdentityContext } from "../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";

const capitalize = (s) =>
    typeof s === "string" && s.length > 0
        ? s.charAt(0).toUpperCase() + s.slice(1)
        : "";

const panelClassName =
    "relative overflow-hidden rounded-[28px] border border-slate-200/85 bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/35 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_18px_55px_rgba(2,8,23,0.32)]";

const bytesToHex = (bytes) =>
    Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

const hashText = (value) =>
    `0x${bytesToHex(keccak_256(new TextEncoder().encode(value)))}`;

const normalizePlaintext = (value, lowercase = false) => {
    const normalized = (value || "").replace(/\0/g, "").trim();
    return lowercase ? normalized.toLowerCase() : normalized;
};

const CONFETTI_BITS = [
    { left: "8%", x: "-22px", rotate: "220deg", delay: "0ms", color: "#4ACBFF" },
    { left: "18%", x: "-10px", rotate: "160deg", delay: "70ms", color: "#FF67D2" },
    { left: "32%", x: "-6px", rotate: "250deg", delay: "140ms", color: "#FFD166" },
    { left: "46%", x: "0px", rotate: "180deg", delay: "30ms", color: "#8A57FF" },
    { left: "58%", x: "10px", rotate: "210deg", delay: "120ms", color: "#7CF29A" },
    { left: "72%", x: "20px", rotate: "240deg", delay: "40ms", color: "#4ACBFF" },
    { left: "84%", x: "28px", rotate: "200deg", delay: "100ms", color: "#FF67D2" },
];

const getReflectionSessionKey = (projectId) =>
    `web3edu-project-reflection-hidden:${projectId}`;

export default function ProjectDetail() {
    const { id } = useParams();
    const { pathname } = useLocation();
    const isGR = pathname.startsWith("/projects-gr");
    const { owner, smartAccount } = useIdentity();
    const { metadata: resolvedSbtMetadata } = useResolvedIdentityContext();
    const project = localizeProject(getProjectById(id), isGR);
    const projectCompletionId = project?.backendId ?? project?.id;

    const normalizedSteps = useMemo(() => {
        const steps = project?.content?.steps || [];
        const tx = project?.content?.txHash;

        const result = [];
        for (let i = 0; i < steps.length; i++) {
            const s = steps[i];

            // If this step is exactly the tx hash, merge it with previous step
            if (tx && s === tx && result.length > 0) {
                const prev = result[result.length - 1];
                result[result.length - 1] = `${prev} ${tx}`;
                continue;
            }

            result.push(s);
        }

        return result;
    }, [project]);

    const [submitState, setSubmitState] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [copied, setCopied] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const detailDescription = project?.longDescription || project?.content?.expected || "";

    const [encryptedInput, setEncryptedInput] = useState("");
    const [decryptedOutput, setDecryptedOutput] = useState("");
    const [userKey, setUserKey] = useState("");
    const [isDecryptionCorrect, setIsDecryptionCorrect] = useState(false);
    const [decryptAttempts, setDecryptAttempts] = useState(0);
    const [suggestedTrim, setSuggestedTrim] = useState("");
    const [cleanDecrypted, setCleanDecrypted] = useState("");
    const [selectedTx, setSelectedTx] = useState(null);
    const [hasCorrectMessageWrongTx, setHasCorrectMessageWrongTx] = useState(false);
    const [reflectionAnswers, setReflectionAnswers] = useState({
        difficulty: "",
        confusion: "",
    });
    const [reflectionState, setReflectionState] = useState({
        dismissed: false,
        submitted: false,
        isSubmitting: false,
        error: "",
    });

    const handlePlainTextPaste = (event, setter) => {
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain") ?? "";
        setter(text);
    };

    const copyToClipboard = async (value, key) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(key);
            setTimeout(() => setCopied(null), 1500);
        } catch {
            setCopied(null);
        }
    };

    const decryptMessage = () => {
        try {
            if (!encryptedInput || !userKey) {
                setIsDecryptionCorrect(false);
                setHasCorrectMessageWrongTx(false);
                setDecryptedOutput(
                    isGR ? "Συμπληρώστε data και key" : "Provide both data and key"
                );
                return;
            }

            // Normalize input
            const cleanInput = encryptedInput.trim().toLowerCase().replace(/[^0-9a-f]/g, "");

            // Smart validations
            if (cleanInput.length > 64) {
                setSuggestedTrim("");
                setIsDecryptionCorrect(false);
                setHasCorrectMessageWrongTx(false);
                setDecryptAttempts((prev) => prev + 1);
                setDecryptedOutput(
                    isGR
                        ? "Λάθος format: αντιγράψτε ακριβώς το πεδίο data από το αποκωδικοποιημένο event"
                        : "Wrong format: copy exactly the data field from the decoded event"
                );
                return;
            }

            if (cleanInput.length < 64) {
                setIsDecryptionCorrect(false);
                setHasCorrectMessageWrongTx(false);
                setDecryptAttempts((prev) => prev + 1);
                setDecryptedOutput(
                    isGR
                        ? "Το data φαίνεται ελλιπές — αντιγράψτε το πλήρες πεδίο data από το event"
                        : "Data seems incomplete — copy the full data field from the event"
                );
                return;
            }

            setSuggestedTrim("");
            const keyBytes = CryptoJS.enc.Utf8.parse(userKey);
            const cipherParams = {
                ciphertext: CryptoJS.enc.Hex.parse(cleanInput),
            };
            const decryptedBytes = CryptoJS.AES.decrypt(cipherParams, keyBytes, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });

            const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
            // eslint-disable-next-line no-console -- decryption debug
            console.log("DECRYPTED:", "[" + decrypted + "]");
            const normalizedDecrypted = decrypted.trim();
            const normalizedPlaintext = normalizePlaintext(
                decrypted,
                project?.type === "tx-investigation"
            );

            if (!decrypted) {
                setIsDecryptionCorrect(false);
                setHasCorrectMessageWrongTx(false);
                setDecryptAttempts((prev) => prev + 1);
                setDecryptedOutput(
                    isGR ? "Λάθος key ή δεδομένα" : "Wrong key or data"
                );
                return;
            }

            if (project?.type === "tx-investigation") {
                const hasExpectedPlaintext =
                    normalizedPlaintext === "hidden in plain sight";
                const isCorrectTx = selectedTx === project.content?.targetTx;

                if (hasExpectedPlaintext && isCorrectTx) {
                    setCleanDecrypted(normalizedPlaintext);
                    setHasCorrectMessageWrongTx(false);
                    setDecryptedOutput(
                        isGR
                            ? `${normalizedDecrypted} ✔ Σωστό μήνυμα`
                            : `${normalizedDecrypted} ✔ Correct message`
                    );
                    setIsDecryptionCorrect(true);
                    setDecryptAttempts(0);
                    return;
                }

                if (hasExpectedPlaintext && !isCorrectTx) {
                    setCleanDecrypted(normalizedPlaintext);
                    setHasCorrectMessageWrongTx(true);
                    setIsDecryptionCorrect(false);
                    setDecryptAttempts((prev) => prev + 1);
                    setDecryptedOutput(
                        isGR
                            ? "⚠ Σωστό μήνυμα αλλά λάθος συναλλαγή"
                            : "⚠ Correct message but wrong transaction"
                    );
                    return;
                }

                setHasCorrectMessageWrongTx(false);
                setIsDecryptionCorrect(false);
                setDecryptAttempts((prev) => prev + 1);
                setDecryptedOutput(
                    isGR
                        ? "❌ Λάθος αποτέλεσμα αποκρυπτογράφησης"
                        : "❌ Incorrect decryption result"
                );
                return;
            }

            // Success detection and feedback
            if (
                project?.answerHash &&
                hashText(normalizedPlaintext) === project.answerHash
            ) {
                setCleanDecrypted(normalizedPlaintext);
                setHasCorrectMessageWrongTx(false);
                setDecryptedOutput(
                    isGR
                        ? `${normalizedDecrypted} ✔ Σωστό μήνυμα`
                        : `${normalizedDecrypted} ✔ Correct message`
                );
                setIsDecryptionCorrect(true);
                setDecryptAttempts(0);
            } else {
                setIsDecryptionCorrect(false);
                setHasCorrectMessageWrongTx(false);
                setDecryptAttempts((prev) => prev + 1);
                setDecryptedOutput(
                    isGR
                        ? "❌ Λάθος αποτέλεσμα αποκρυπτογράφησης"
                        : "❌ Incorrect decryption result"
                );
            }
        } catch {
            setIsDecryptionCorrect(false);
            setHasCorrectMessageWrongTx(false);
            setDecryptedOutput(
                isGR ? "Αποτυχία αποκρυπτογράφησης" : "Decryption failed"
            );
        }
    };

    const wallet = useMemo(
        () => localStorage.getItem("web3edu-wallet-address") || "",
        []
    );
    const identityAddress = smartAccount ?? owner ?? (wallet || null);

    const [userRole, setUserRole] = useState("learner");   // identity
    const [userTier, setUserTier] = useState("explorer");  // progression

    useEffect(() => {
        if (!identityAddress || !resolvedSbtMetadata) {
            if (!identityAddress) {
                setIsCompleted(false);
                setUserRole("learner");
                setUserTier("explorer");
            }
            return;
        }

        const tier = (resolvedSbtMetadata.tier || "Explorer").toLowerCase();
        setUserRole(tier === "builder" ? "builder" : "learner");
        setUserTier(tier);
        const projectsDone =
            resolvedSbtMetadata.projectsCompleted ||
            resolvedSbtMetadata.projects_completed ||
            {};
        setIsCompleted(Boolean(projectsDone?.[projectCompletionId]));
    }, [identityAddress, resolvedSbtMetadata, projectCompletionId]);

    useEffect(() => {
        if (typeof window === "undefined" || !project?.id) {
            return;
        }

        setReflectionAnswers({
            difficulty: "",
            confusion: "",
        });

        const isHidden = window.sessionStorage.getItem(
            getReflectionSessionKey(project.id)
        ) === "true";

        setReflectionState({
            dismissed: isHidden,
            submitted: false,
            isSubmitting: false,
            error: "",
        });
    }, [project?.id]);

    const isBuilder = userTier === "builder" || userTier === "architect";

    const copy = isGR
        ? {
            back: "Πίσω στα Projects",
            notFound: "Project δεν βρέθηκε",
            difficulty: "Δυσκολία",
            description: "Περιγραφή",
            instructions: "Αποστολή",
            txHash: "Transaction Hash",
            key: "Κλειδί Αποκρυπτογράφησης",
            openExplorer: "Άνοιγμα στο Explorer",
            steps: "Διαδρομή Διερεύνησης",
            expected: "Παραδοτέο",
            skills: "Δεξιότητες",
            submit: "Υποβολή Απάντησης",
            unlock: "Ξεκλειδώνεται στο επίπεδο Builder.",
            placeholder: "Γράψτε το αποκρυπτογραφημένο μήνυμα...",
            submitting: "Υποβολή...",
            submitButton: "Υποβολή",
            walletMissing: "Συνδέστε πρώτα το wallet σας.",
            roleMissing: "Αυτό το project είναι διαθέσιμο μόνο για Builders.",
            answerMissing: "Συμπληρώστε την απάντηση.",
            success: "Επιτυχία! Κερδίσατε",
            alreadyCompleted: "Το project έχει ήδη ολοκληρωθεί.",
            wrongAnswer: "Λάθος απάντηση. Δοκιμάστε ξανά.",
            networkError: "Σφάλμα επικοινωνίας με το backend.",
            builderAccess: "Builder Access",
            xpReward: "Ανταμοιβή XP",
            unavailable: "Αυτό το project δεν είναι ακόμη διαθέσιμο.",
            unavailableBody: "Η σελίδα υπάρχει ως placeholder, αλλά το challenge δεν έχει ανοίξει ακόμη.",
            browseProjects: "Επιστροφή στα Projects",
            reflectionTitle: "Προαιρετικό feedback",
            reflectionBody: "Βοήθησέ μας να βελτιώσουμε αυτό το project challenge.",
            reflectionDifficulty: "Ποιο ήταν το πιο δύσκολο σημείο αυτού του challenge;",
            reflectionConfusion: "Τι σε μπέρδεψε περισσότερο;",
            reflectionPlaceholder: "Σύντομη απάντηση...",
            feedbackSubmit: "Υποβολή feedback",
            feedbackSkip: "Παράλειψη",
            feedbackSubmitting: "Υποβολή...",
            feedbackSuccess: "Ευχαριστούμε για το feedback.",
            feedbackError: "Δεν ήταν δυνατή η αποστολή του feedback.",
        }
        : {
            back: "Back to Projects",
            notFound: "Project not found",
            difficulty: "Difficulty",
            description: "Description",
            instructions: "Mission",
            txHash: "Transaction Hash",
            key: "Decryption Key",
            openExplorer: "Open in Explorer",
            steps: "Investigation Path",
            expected: "Deliverable",
            skills: "Skills",
            submit: "Submit Your Answer",
            unlock: "Unlocks at Builder level.",
            placeholder: "Enter the decrypted message...",
            submitting: "Submitting...",
            submitButton: "Submit",
            walletMissing: "Please connect your wallet first.",
            roleMissing: "This project is available only for Builders.",
            answerMissing: "Please enter your answer.",
            success: "Success! You earned",
            alreadyCompleted: "This project is already completed.",
            wrongAnswer: "Wrong answer. Try again.",
            networkError: "Backend communication error.",
            builderAccess: "Builder Access",
            xpReward: "XP Reward",
            unavailable: "This project is not available yet.",
            unavailableBody: "This route exists as a placeholder, but the challenge has not been opened yet.",
            browseProjects: "Back to Projects",
            reflectionTitle: "Optional feedback",
            reflectionBody: "Help improve this project challenge.",
            reflectionDifficulty: "What was the hardest part of this challenge?",
            reflectionConfusion: "What confused you the most?",
            reflectionPlaceholder: "Short answer...",
            feedbackSubmit: "Submit feedback",
            feedbackSkip: "Skip",
            feedbackSubmitting: "Submitting...",
            feedbackSuccess: "Thanks for the feedback.",
            feedbackError: "Could not submit feedback.",
        };

    const shouldShowReflectionForm =
        isCompleted &&
        submitState?.type === "success" &&
        !reflectionState.dismissed &&
        !reflectionState.submitted;

    const hideReflectionForSession = () => {
        if (typeof window !== "undefined" && project?.id) {
            window.sessionStorage.setItem(
                getReflectionSessionKey(project.id),
                "true"
            );
        }

        setReflectionState((prev) => ({
            ...prev,
            dismissed: true,
            error: "",
        }));
    };

    const handleReflectionChange = (field) => (event) => {
        const value = event.target.value;
        setReflectionAnswers((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmitReflection = async () => {
        try {
            setReflectionState((prev) => ({
                ...prev,
                isSubmitting: true,
                error: "",
            }));

            const res = await fetch("/api/project-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: project?.id,
                    answers: {
                        difficulty: reflectionAnswers.difficulty.trim(),
                        confusion: reflectionAnswers.confusion.trim(),
                    },
                }),
            });

            if (!res.ok) {
                throw new Error("feedback_request_failed");
            }

            if (typeof window !== "undefined" && project?.id) {
                window.sessionStorage.setItem(
                    getReflectionSessionKey(project.id),
                    "true"
                );
            }

            setReflectionState((prev) => ({
                ...prev,
                dismissed: true,
                submitted: true,
                isSubmitting: false,
                error: "",
            }));
        } catch {
            setReflectionState((prev) => ({
                ...prev,
                isSubmitting: false,
                error: copy.feedbackError,
            }));
        }
    };

    const handleSubmitAnswer = async () => {
        if (!isBuilder) {
            setSubmitState({ type: "error", message: copy.roleMissing });
            return;
        }

        if (!wallet) {
            setSubmitState({ type: "error", message: copy.walletMissing });
            return;
        }
        if (
            project.type === "tx-investigation" &&
            (!selectedTx || selectedTx !== project.content?.targetTx)
        ) {
            setSubmitState({
                type: "error",
                message: isGR
                    ? "Επιλέξτε τη σωστή συναλλαγή πρώτα."
                    : "Select the correct transaction first.",
            });
            return;
        }

        if (!isDecryptionCorrect || !cleanDecrypted.trim()) {
            setSubmitState({ type: "error", message: copy.answerMissing });
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitState(null);

            const res = await fetch(
                `${getWeb3eduBackendUrl()}/projects/complete-answer`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        wallet,
                        projectId: projectCompletionId,
                        answer: cleanDecrypted,
                    }),
                }
            );

            const data = await res.json();

            if (data.ok) {
                setSubmitState({
                    type: "success",
                    message: `${copy.success} +${data.xpAwarded} XP`,
                });
                setIsCompleted(true);
                return;
            }

            if (data.error === "already_completed") {
                setSubmitState({ type: "info", message: copy.alreadyCompleted });
                setIsCompleted(true);
                return;
            }
            setSubmitState({ type: "error", message: copy.wrongAnswer });
        } catch {
            setSubmitState({ type: "error", message: copy.networkError });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!project) {
        return (
            <PageShell>
                <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6">
                    <div className="mx-auto max-w-3xl">
                        <div className={panelClassName}>
                            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#FF67D2]/35 via-[#8A57FF]/35 to-[#4ACBFF]/35 blur-sm" />
                            <div className="relative rounded-[28px] border border-slate-200/70 bg-white p-8 text-slate-900 shadow-sm dark:border-white/10 dark:!bg-slate-950 dark:text-slate-100 dark:shadow-none">
                                <h1 className="text-2xl font-semibold">{copy.notFound}</h1>
                                <Link
                                    to={isGR ? "/projects-gr" : "/projects"}
                                    className="mt-5 inline-flex rounded-full border border-indigo-300/80 bg-white px-5 py-2 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 dark:border-[#8A57FF]/35 dark:bg-white/[0.04] dark:text-white/84 dark:shadow-none dark:hover:border-[#FF67D2]/45 dark:hover:bg-[#8A57FF]/10 dark:hover:text-white"
                                >
                                    {copy.back}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </PageShell>
        );
    }

    if (!project.content || project.status === "hidden" || project.status === "coming-soon") {
        return (
            <PageShell>
                <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6">
                    <div className="mx-auto max-w-3xl">
                        <div className={panelClassName}>
                            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#FF67D2]/35 via-[#8A57FF]/35 to-[#4ACBFF]/35 blur-sm" />
                            <div className="relative rounded-[28px] border border-slate-200/70 bg-white p-8 text-slate-900 shadow-sm dark:border-white/10 dark:!bg-slate-950 dark:text-slate-100 dark:shadow-none">
                                <h1 className="text-2xl font-semibold">{copy.unavailable}</h1>
                                <p className="mt-4 text-slate-600 dark:text-slate-300">{copy.unavailableBody}</p>
                                <Link
                                    to={isGR ? "/projects-gr" : "/projects"}
                                    className="mt-5 inline-flex rounded-full border border-indigo-300/80 bg-white px-5 py-2 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 dark:border-[#8A57FF]/35 dark:bg-white/[0.04] dark:text-white/84 dark:shadow-none dark:hover:border-[#FF67D2]/45 dark:hover:bg-[#8A57FF]/10 dark:hover:text-white"
                                >
                                    {copy.browseProjects}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </PageShell>
        );
    }

    const ProjectComponent = projectRegistry[project.type] || null;

    if (!ProjectComponent) {
        // eslint-disable-next-line no-console -- dev guard for registry
        console.warn("Unknown project type:", project.type);
    }

    const shared = {
        isGR,
        selectedTx,
        setSelectedTx,
        encryptedInput,
        setEncryptedInput,
        userKey,
        setUserKey,
        decryptMessage,
        decryptedOutput,
        suggestedTrim,
        setSuggestedTrim,
        decryptAttempts,
        handlePlainTextPaste,
        isDecryptionCorrect,
        setIsDecryptionCorrect,
        setDecryptedOutput,
    };

    return (
        <PageShell>
            <div className="relative overflow-hidden px-4 pb-20 pt-28 text-slate-900 sm:px-6 dark:text-slate-100">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#8A57FF]/12 blur-[170px] dark:bg-[#8A57FF]/24" />
                    <div className="absolute top-[18%] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[#4ACBFF]/10 blur-[150px] dark:bg-[#4ACBFF]/18" />
                    <div className="absolute bottom-[10%] left-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[#FF67D2]/8 blur-[140px] dark:bg-[#FF67D2]/14" />
                    <div className="absolute inset-0 bg-[size:54px_54px] bg-[linear-gradient(rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.06)_1px,transparent_1px)] opacity-[0.28] dark:bg-[linear-gradient(rgba(138,87,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(74,203,255,0.35)_1px,transparent_1px)] dark:opacity-[0.03]" />
                </div>

                <div className="relative mx-auto flex max-w-5xl flex-col gap-8">
                    <Link
                        to={isGR ? "/projects-gr" : "/projects"}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-300/80 bg-white px-4 py-2 text-sm font-medium text-indigo-900 shadow-sm backdrop-blur-md transition hover:bg-indigo-50 dark:border-[#8A57FF]/35 dark:bg-white/[0.04] dark:text-white/84 dark:shadow-none dark:hover:border-[#FF67D2]/45 dark:hover:bg-[#8A57FF]/10 dark:hover:text-white"
                    >
                        <span aria-hidden="true">←</span>
                        {copy.back}
                    </Link>

                    <section className={panelClassName}>
                        <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#FF67D2]/35 via-[#8A57FF]/40 to-[#4ACBFF]/35 blur-sm" />
                        <div className="relative grid gap-8 rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 lg:grid-cols-[1.15fr_0.85fr] dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                            <div className="p-8 md:p-10">
                                <div className="inline-flex rounded-full border border-indigo-300/80 bg-indigo-100/90 px-4 py-1 text-sm font-semibold text-indigo-900 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/90 dark:text-indigo-100 dark:shadow-[0_0_20px_rgba(138,87,255,0.22)]">
                                    {project.difficulty}
                                </div>
                                <h1 className="mt-5 bg-gradient-to-r from-slate-900 via-indigo-800 to-cyan-800 bg-clip-text text-4xl font-black tracking-tight text-transparent dark:from-white dark:via-fuchsia-300 dark:to-cyan-300 md:text-5xl">
                                    {project.title}
                                </h1>
                                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
                                    {project.description}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <MetaBadge
                                        tone="indigo"
                                        label={copy.difficulty}
                                        value={project.difficulty}
                                    />
                                    <MetaBadge
                                        tone="cyan"
                                        label={copy.xpReward}
                                        value={`${project.xp} XP`}
                                    />
                                    <MetaBadge
                                        tone="pink"
                                        label={copy.builderAccess}
                                        value={`${capitalize(userRole)} · ${capitalize(userTier)}`}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-200/80 bg-gradient-to-br from-slate-100/90 to-indigo-50/50 p-6 lg:border-l lg:border-t-0 lg:p-8 dark:border-white/10 dark:from-slate-900 dark:to-slate-950">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-full min-h-[280px] w-full rounded-[28px] object-cover shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <section className={panelClassName}>
                            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#8A57FF]/30 via-[#4ACBFF]/28 to-[#FF67D2]/24 blur-sm" />
                            <div className="relative rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm md:p-10 dark:border-white/10 dark:!bg-slate-950 dark:shadow-none">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{copy.description}</h2>
                                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                                    {detailDescription}
                                </p>

                                {project.content && (
                                    <div className="mt-10 space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{copy.instructions}</h2>
                                            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                                                {project.content?.missionText || copy.instructions}
                                            </p>
                                        </div>

                                        {project.content.txHash && (
                                            <InfoBlock title={copy.txHash}>
                                                <code className="block max-w-full overflow-hidden rounded-2xl border border-slate-300 bg-slate-900 px-4 py-3 text-sm text-slate-100 break-all break-words dark:border-cyan-500/25 dark:!bg-slate-900 dark:text-slate-100">
                                                    <span className="break-all">{project.content.txHash}</span>
                                                </code>
                                                <a
                                                    href={`https://blockexplorer.dimikog.org/tx/${project.content.txHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 inline-flex rounded-full border border-cyan-300/80 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 dark:border-cyan-500/35 dark:bg-cyan-950/60 dark:text-cyan-100 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/50 dark:hover:text-white"
                                                >
                                                    {copy.openExplorer}
                                                </a>
                                            </InfoBlock>
                                        )}

                                        {project.content.key && (
                                            <InfoBlock title={copy.key}>
                                                <div>
                                                    <code className="block rounded-2xl border border-slate-300 bg-slate-900 px-4 py-3 text-sm text-slate-100 break-all dark:border-cyan-500/25 dark:!bg-slate-900 dark:text-slate-100">
                                                        {project.content.key}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(project.content.key, "key")}
                                                        className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-400/50 hover:text-slate-900 dark:border-white/20 dark:bg-white/5 dark:text-white/72 dark:hover:border-[#4ACBFF]/40 dark:hover:text-white"
                                                    >
                                                        {copied === "key"
                                                            ? isGR ? "Αντιγράφηκε" : "Copied"
                                                            : isGR ? "Αντιγραφή" : "Copy"}
                                                    </button>
                                                </div>
                                            </InfoBlock>
                                        )}

                                        {project.content.steps && (
                                            <InfoBlock title={copy.steps}>
                                                {project.type === "tx-investigation" && (
                                                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                                                        {isGR
                                                            ? "Επιλέξτε μία συναλλαγή και ελέγξτε τα Logs (DataStored)."
                                                            : "Select a transaction and inspect its Logs (DataStored)."}
                                                    </p>
                                                )}
                                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {isGR
                                                        ? "Χρησιμοποιήστε τα hints μόνο αν χρειαστεί — δοκιμάστε πρώτα μόνοι σας."
                                                        : "Use hints only if needed — try solving it yourself first."}
                                                </p>
                                                <ul className="space-y-3">
                                                    {normalizedSteps.map((step, index) => (
                                                        <li
                                                            key={`${index}-${step}`}
                                                            className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50 px-4 py-4 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200"
                                                        >
                                                            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-[#4ACBFF] to-[#8A57FF] shadow-[0_0_8px_rgba(74,203,255,0.6)]" />
                                                            <span className="min-w-0 whitespace-normal leading-7 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
                                                                {step}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </InfoBlock>
                                        )}

                                        {ProjectComponent && (
                                            <>
                                                <ProjectComponent project={project} shared={shared} />
                                                {project.type === "tx-investigation" &&
                                                    selectedTx &&
                                                    selectedTx !== project.content?.targetTx &&
                                                    hasCorrectMessageWrongTx && (
                                                        <div className="mt-4 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-yellow-400/25 dark:bg-yellow-400/10 dark:text-yellow-200">
                                                            {isGR
                                                                ? "Το μήνυμα είναι σωστό, αλλά προέρχεται από λάθος συναλλαγή. Δοκιμάστε άλλη."
                                                                : "The message is correct, but it comes from the wrong transaction. Try another one."}
                                                        </div>
                                                    )}
                                            </>
                                        )}

                                        {project.content.expected && (
                                            <InfoBlock title={copy.expected}>
                                                <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                                                    {project.content?.expected}
                                                </p>
                                            </InfoBlock>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="space-y-8">
                            <section className={panelClassName}>
                                <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#4ACBFF]/28 via-[#8A57FF]/28 to-[#FF67D2]/22 blur-sm" />
                                <div className="relative rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-white/10 dark:!bg-slate-950 dark:text-slate-100 dark:shadow-none">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{copy.skills}</h2>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 dark:border-cyan-500/35 dark:bg-slate-800 dark:text-cyan-100"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className={panelClassName}>
                                <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#FF67D2]/24 via-[#8A57FF]/30 to-[#4ACBFF]/24 blur-sm" />
                                <div className="relative rounded-[28px] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-white/10 dark:!bg-slate-950 dark:text-slate-100 dark:shadow-none">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{copy.submit}</h2>

                                    {!isBuilder && (
                                        <p className="mt-4 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 dark:border-yellow-400/25 dark:bg-yellow-400/10 dark:text-yellow-200">
                                            {copy.unlock}
                                        </p>
                                    )}

                                    {isBuilder && (
                                        <>
                                            {isCompleted && (
                                                <div className="mt-4 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-100">
                                                    {isGR ? "✔ Το project έχει ολοκληρωθεί" : "✔ Project completed"}
                                                </div>
                                            )}

                                            <textarea
                                                disabled={isCompleted}
                                                readOnly
                                                value={cleanDecrypted}
                                                placeholder={copy.placeholder}
                                                className={`mt-5 min-h-[140px] w-full rounded-[24px] border px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:text-white dark:placeholder:text-white/40 dark:[-webkit-text-fill-color:white] dark:[caret-color:white] dark:[color-scheme:dark] dark:focus:border-white/20 dark:focus:ring-white/10 ${isCompleted ? "cursor-default border-slate-200 bg-slate-100 opacity-80 dark:border-white/10 dark:!bg-slate-900" : "cursor-text border-slate-300 bg-white dark:border-cyan-500/25 dark:!bg-slate-900"}`}
                                            />


                                            {submitState && (
                                                <div className="relative mt-4">
                                                    {submitState.type === "success" && (
                                                        <ConfettiBurst />
                                                    )}
                                                    <p
                                                        className={`relative rounded-2xl px-4 py-3 text-sm font-medium ${getStatusClassName(
                                                            submitState.type
                                                        )}`}
                                                    >
                                                        {submitState.message}
                                                    </p>
                                                </div>
                                            )}
                                            {isCompleted && (
                                                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                    {project.content?.completionSummary}
                                                </p>
                                            )}


                                            {isDecryptionCorrect && !isCompleted && (
                                                <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">
                                                    {isGR
                                                        ? "✔ Σωστό μήνυμα! Έτοιμο για υποβολή."
                                                        : "✔ Correct message! Ready to submit."}
                                                </p>
                                            )}

                                            {isDecryptionCorrect && !isCompleted && (
                                                <button
                                                    onClick={handleSubmitAnswer}
                                                    className="mt-5 inline-flex rounded-full bg-gradient-to-r from-[#4ACBFF] via-[#5D8BFF] to-[#8A57FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(74,203,255,0.24)] transition hover:scale-[1.01]"
                                                >
                                                    {isSubmitting ? copy.submitting : isGR ? "Υποβολή Λύσης" : "Submit Solution"}
                                                </button>
                                            )}
                                            {isCompleted && (
                                                <button
                                                    disabled
                                                    className="mt-5 inline-flex cursor-not-allowed rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 dark:bg-white/10 dark:text-white/60"
                                                >
                                                    {isGR ? "✔ Ολοκληρώθηκε" : "✔ Completed"}
                                                </button>
                                            )}
                                            {isCompleted && (
                                                <div className="mt-6 space-y-2 rounded-2xl border border-slate-200/90 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                                                        {project.content?.completionTitle}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {project.content?.completionDetails?.map((item) => (
                                                            <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800/80">
                                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#4ACBFF] to-[#8A57FF]" />
                                                                <span className="text-slate-600 dark:text-slate-300">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {isCompleted && (
                                                <div className="mt-4 space-y-2 rounded-2xl border border-cyan-200/80 bg-cyan-50/90 p-4 text-sm text-slate-700 dark:border-cyan-500/30 dark:bg-cyan-950/45 dark:text-cyan-50">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                                                        {project.content?.whyItMattersTitle}
                                                    </h4>
                                                    <p>
                                                        {project.content?.whyItMatters}
                                                    </p>
                                                </div>
                                            )}
                                            {isCompleted && (
                                                <div className="mt-4 rounded-2xl border border-emerald-300/70 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-100">
                                                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                                                        {project.content?.skillsGainedTitle}
                                                    </h4>
                                                    <div className="mt-2 space-y-2">
                                                        {project.content?.skillsGained?.map((item) => (
                                                            <div key={item} className="flex items-start gap-3">
                                                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                                                                <span className="text-emerald-900 dark:text-emerald-100">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {isCompleted &&
                                                submitState?.type === "success" &&
                                                reflectionState.submitted && (
                                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                        {copy.feedbackSuccess}
                                                    </p>
                                                )}
                                        </>
                                    )}

                                    <Link
                                        to={isGR ? "/projects-gr" : "/projects"}
                                        className="mt-5 inline-flex rounded-full border border-indigo-300/80 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 dark:border-[#8A57FF]/35 dark:bg-white/[0.04] dark:text-white/84 dark:shadow-none dark:hover:border-[#FF67D2]/45 dark:hover:bg-[#8A57FF]/10 dark:hover:text-white"
                                    >
                                        {copy.back}
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            {shouldShowReflectionForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-[#030712]/78">
                    <div className="relative w-full max-w-xl overflow-hidden rounded-[28px]">
                        <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-cyan-400/20 via-indigo-400/25 to-fuchsia-300/20 blur-sm dark:from-[#4ACBFF]/28 dark:via-[#8A57FF]/30 dark:to-[#FF67D2]/24" />
                        <div className="relative rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-xl md:p-8 dark:border-white/10 dark:!bg-slate-950 dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,8,23,0.55)]">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {copy.reflectionTitle}
                            </h4>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                {copy.reflectionBody}
                            </p>
                            <div className="mt-5 space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {copy.reflectionDifficulty}
                                    </label>
                                    <textarea
                                        value={reflectionAnswers.difficulty}
                                        onChange={handleReflectionChange("difficulty")}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:!bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-white/25 dark:focus:ring-white/10"
                                        placeholder={copy.reflectionPlaceholder}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {copy.reflectionConfusion}
                                    </label>
                                    <textarea
                                        value={reflectionAnswers.confusion}
                                        onChange={handleReflectionChange("confusion")}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:!bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-white/25 dark:focus:ring-white/10"
                                        placeholder={copy.reflectionPlaceholder}
                                    />
                                </div>
                            </div>
                            {reflectionState.error && (
                                <p className="mt-3 text-sm text-rose-700 dark:text-[#FFC2EE]">
                                    {reflectionState.error}
                                </p>
                            )}
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    onClick={handleSubmitReflection}
                                    disabled={reflectionState.isSubmitting}
                                    className="inline-flex rounded-full bg-gradient-to-r from-[#4ACBFF] via-[#5D8BFF] to-[#8A57FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(74,203,255,0.2)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {reflectionState.isSubmitting
                                        ? copy.feedbackSubmitting
                                        : copy.feedbackSubmit}
                                </button>
                                <button
                                    onClick={hideReflectionForSession}
                                    disabled={reflectionState.isSubmitting}
                                    className="inline-flex rounded-full border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/12 dark:bg-white/[0.04] dark:text-white/78 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"
                                >
                                    {copy.feedbackSkip}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    );
}


function MetaBadge({ label, value, tone = "indigo" }) {
    const toneClassName =
        tone === "cyan"
            ? "border border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-500/40 dark:bg-cyan-950/70 dark:text-cyan-100"
            : tone === "pink"
                ? "border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-500/40 dark:bg-fuchsia-950/70 dark:text-fuchsia-100"
                : "border border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/70 dark:text-indigo-100";

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClassName}`}
        >
            {label}: {value}
        </span>
    );
}

function InfoBlock({ title, children }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            <div className="mt-3">{children}</div>
        </div>
    );
}

function ConfettiBurst() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 -top-3 h-28 overflow-visible"
        >
            {CONFETTI_BITS.map((bit, index) => (
                <span
                    key={`${bit.left}-${index}`}
                    className="animate-confetti-burst absolute top-0 block rounded-sm motion-reduce:hidden"
                    style={{
                        left: bit.left,
                        width: index % 3 === 0 ? "10px" : "8px",
                        height: index % 2 === 0 ? "14px" : "10px",
                        background: bit.color,
                        boxShadow: `0 0 12px ${bit.color}55`,
                        animationDelay: bit.delay,
                        ["--confetti-x"]: bit.x,
                        ["--confetti-r"]: bit.rotate,
                    }}
                />
            ))}
        </div>
    );
}

function getStatusClassName(type) {
    if (type === "success") {
        return "border border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-500/35 dark:bg-cyan-950/60 dark:text-cyan-100";
    }

    if (type === "info") {
        return "border border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/35 dark:bg-indigo-950/60 dark:text-indigo-100";
    }

    return "border border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/35 dark:bg-rose-950/60 dark:text-rose-100";
}
