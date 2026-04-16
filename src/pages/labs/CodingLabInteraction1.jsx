import { useMemo, useState } from "react";
import SystemLabTemplate from "./SystemLabTemplate";
import LabCompletionClaim from "../../components/LabCompletionClaim";
import { AlertTriangle, Code2, ExternalLink, FileCode2, RotateCcw, BookOpen, TerminalSquare } from "lucide-react";

const REMIX_URL = "https://remix.ethereum.org/";

const CONTENT = {
    en: {
        title: "Coding Lab 01 — ✍️ Write and Deploy Your First Smart Contract",
        subtitle:
            "Write a minimal Solidity contract, compile it in Remix, deploy it to Besu Edu-Net, and verify that your own contract instance is live on-chain.",
        kicker: "From Source Code to Deployed Contract",
        level: "Beginner",
        estimatedTime: "15–20 minutes",
        badge: "Smart Contract Deployer",
        stepLabel: "Step",
        steps: [
            "Create the Solidity file",
            "Compile the contract",
            "Deploy your contract",
            "Verify the deployed address",
            "Pass the checkpoint",
        ],
        instructions: [
            "Open Remix and create a new file named Counter.sol.",
            "Compile the contract successfully using Solidity 0.8.x.",
            "Deploy the contract to Besu Edu-Net with your browser wallet.",
            "Confirm that your contract has its own deployed address and can be found on-chain.",
            "Answer the checkpoint questions correctly to complete the lab.",
        ],
        backHref: "/labs/coding-01",
        backLabel: "Back to Coding Lab 01",
        simulatorTitle: "Build Workflow",
        workflowTitle: "Coding workflow",
        workflowIntro:
            "This lab is not about interacting with a pre-deployed contract. It is about writing code, compiling it, deploying it, and understanding what deployment actually creates on-chain.",
        remixTitle: "Open Remix IDE",
        remixDescription:
            "Remix is a browser-based Solidity development environment. In this lab, you use it to write the contract, compile it into deployable artifacts, connect your wallet through Injected Provider, and send the deployment transaction to Besu Edu-Net.",
        codeTitle: "Contract Preview",
        checklistTitle: "Build Checklist",
        commonMistakesTitle: "Common Mistakes",
        commonMistakes: [
            "Using the wrong network in your wallet instead of Besu Edu-Net.",
            "Forgetting to switch Remix to Injected Provider before deployment.",
            "Confusing the wallet address with the deployed contract address.",
            "Assuming a contract is live on-chain before the deployment transaction is confirmed.",
        ],
        controlsTitle: "Task Controls",
        notesTitle: "Current Goal",
        notesPanelTitle: "What to keep in mind",
        eventsTitle: "Observed Outcomes",
        comparisonTitle: "Key Takeaways",
        reflectionTitle: "Checkpoint",
        currentAction: "Current lab state",
        allStepsCompleted: "All required tasks completed",
        checkpointReadyToClaim: "All tasks and checkpoint requirements are complete. You can now claim the reward.",
        checkpointQuestion: "What is the main purpose of deployment in this lab?",
        checkpointOptions: [
            "To create a new live contract instance on-chain at its own address.",
            "To store Solidity source code directly in the browser wallet.",
            "To replace the need for compilation and ABI generation.",
            "To make the contract readable only inside Remix.",
        ],
        checkpointCorrectIndex: 0,
        checkpointCorrect:
            "Correct. Deployment creates a new live contract instance on-chain at its own address. That is what makes this lab different from simply interacting with an already deployed contract.",
        checkpointWrong:
            "Not quite. Focus on what deployment changes on the blockchain itself: it creates a new contract instance with its own address.",
        completeLabel: "Lab completion",
        completeDescription:
            "Finish the guided workflow and answer the checkpoint correctly to unlock the reward claim.",
        tasks: {
            createFile: "Created the Solidity file in Remix",
            compile: "Compiled the contract successfully",
            deploy: "Deployed the contract to Besu Edu-Net",
            verify: "Verified that the contract has its own deployed address",
        },
        actionLabels: {
            markDone: "Mark as done",
            markedDone: "Completed",
            reset: "Reset Lab",
        },
        notes: [
            "A Solidity file is source code. It is not yet a deployed blockchain object.",
            "Compilation translates Solidity into artifacts that can be used for deployment and interaction.",
            "Deployment is a blockchain transaction that creates a new contract instance.",
            "A deployed contract has its own address and can then be interacted with on-chain.",
        ],
        takeaways: [
            "Writing and compiling contract code happens before deployment.",
            "Deployment creates a new contract instance with its own address.",
            "A deployed contract is different from simply viewing source code in Remix.",
            "This lab focuses on creating your own instance, not only interacting with an existing one.",
        ],
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public value;

    function increment() external {
        value += 1;
    }
}`,
    },
    gr: {
        title: "Coding Lab 01 — ✍️ Γράψε και Κάνε Deploy το Πρώτο σου Smart Contract",
        subtitle:
            "Γράψε ένα minimal Solidity contract, κάνε compile στο Remix, κάνε deploy στο Besu Edu-Net και επιβεβαίωσε ότι το δικό σου contract instance είναι live on-chain.",
        kicker: "Από το Source Code στο Deployed Contract",
        level: "Αρχάριο",
        estimatedTime: "15–20 λεπτά",
        badge: "Smart Contract Deployer",
        stepLabel: "Βήμα",
        steps: [
            "Δημιούργησε το Solidity αρχείο",
            "Κάνε compile το contract",
            "Κάνε deploy το contract σου",
            "Επιβεβαίωσε τη deployed διεύθυνση",
            "Πέρασε το checkpoint",
        ],
        instructions: [
            "Άνοιξε το Remix και δημιούργησε ένα νέο αρχείο με όνομα Counter.sol.",
            "Κάνε compile το contract επιτυχώς με Solidity 0.8.x.",
            "Κάνε deploy το contract στο Besu Edu-Net με το browser wallet σου.",
            "Επιβεβαίωσε ότι το contract σου έχει τη δική του deployed διεύθυνση και μπορεί να βρεθεί on-chain.",
            "Απάντησε σωστά στο checkpoint για να ολοκληρώσεις το lab.",
        ],
        backHref: "/labs-gr/coding-01",
        backLabel: "Επιστροφή στο Coding Lab 01",
        simulatorTitle: "Ροή Εργασίας Build",
        workflowTitle: "Ροή εργασίας coding",
        workflowIntro:
            "Αυτό το lab δεν αφορά την αλληλεπίδραση με ένα ήδη deployed contract. Αφορά τη συγγραφή κώδικα, το compile, το deploy και την κατανόηση του τι ακριβώς δημιουργεί το deployment on-chain.",
        remixTitle: "Άνοιγμα Remix IDE",
        remixDescription:
            "Το Remix είναι ένα browser-based περιβάλλον ανάπτυξης Solidity. Σε αυτό το lab το χρησιμοποιείς για να γράψεις το contract, να κάνεις compile σε deployable artifacts, να συνδέσεις το wallet σου μέσω Injected Provider και να στείλεις το deployment transaction στο Besu Edu-Net.",
        codeTitle: "Προεπισκόπηση Contract",
        checklistTitle: "Build Checklist",
        commonMistakesTitle: "Συχνά Λάθη",
        commonMistakes: [
            "Χρήση λάθος δικτύου στο wallet αντί για Besu Edu-Net.",
            "Να ξεχάσεις να αλλάξεις το Remix σε Injected Provider πριν το deployment.",
            "Να μπερδέψεις το wallet address με το deployed contract address.",
            "Να θεωρήσεις ότι το contract είναι live on-chain πριν επιβεβαιωθεί το deployment transaction.",
        ],
        controlsTitle: "Έλεγχοι Εργασιών",
        notesTitle: "Τρέχων Στόχος",
        notesPanelTitle: "Τι να κρατήσεις",
        eventsTitle: "Παρατηρούμενα Αποτελέσματα",
        comparisonTitle: "Βασικά Συμπεράσματα",
        reflectionTitle: "Checkpoint",
        currentAction: "Τρέχουσα κατάσταση lab",
        allStepsCompleted: "Όλες οι απαιτούμενες εργασίες ολοκληρώθηκαν",
        checkpointReadyToClaim: "Όλες οι εργασίες και το checkpoint έχουν ολοκληρωθεί. Μπορείς τώρα να κάνεις claim το reward.",
        checkpointQuestion: "Ποιος είναι ο βασικός σκοπός του deployment σε αυτό το lab;",
        checkpointOptions: [
            "Να δημιουργήσει ένα νέο live contract instance on-chain στη δική του διεύθυνση.",
            "Να αποθηκεύσει τον Solidity source code απευθείας στο browser wallet.",
            "Να αντικαταστήσει την ανάγκη για compile και ABI generation.",
            "Να κάνει το contract αναγνώσιμο μόνο μέσα στο Remix.",
        ],
        checkpointCorrectIndex: 0,
        checkpointCorrect:
            "Σωστά. Το deployment δημιουργεί ένα νέο live contract instance on-chain στη δική του διεύθυνση. Αυτό είναι που διαφοροποιεί το lab από την απλή αλληλεπίδραση με ένα ήδη deployed contract.",
        checkpointWrong:
            "Όχι ακριβώς. Εστίασε στο τι αλλάζει το deployment στο ίδιο το blockchain: δημιουργεί ένα νέο contract instance με δική του διεύθυνση.",
        completeLabel: "Ολοκλήρωση Lab",
        completeDescription:
            "Ολοκλήρωσε τη guided ροή εργασίας και απάντησε σωστά στο checkpoint για να ξεκλειδώσεις το reward claim.",
        tasks: {
            createFile: "Δημιούργησα το Solidity αρχείο στο Remix",
            compile: "Έκανα compile το contract επιτυχώς",
            deploy: "Έκανα deploy το contract στο Besu Edu-Net",
            verify: "Επιβεβαίωσα ότι το contract έχει τη δική του deployed διεύθυνση",
        },
        actionLabels: {
            markDone: "Σήμανση ως ολοκληρωμένο",
            markedDone: "Ολοκληρώθηκε",
            reset: "Επαναφορά Lab",
        },
        notes: [
            "Ένα Solidity αρχείο είναι source code. Δεν είναι ακόμη deployed αντικείμενο του blockchain.",
            "Το compilation μετατρέπει το Solidity σε artifacts που μπορούν να χρησιμοποιηθούν για deployment και interaction.",
            "Το deployment είναι blockchain transaction που δημιουργεί ένα νέο contract instance.",
            "Ένα deployed contract έχει τη δική του διεύθυνση και μετά μπορεί να δεχτεί on-chain interactions.",
        ],
        takeaways: [
            "Η συγγραφή και το compile του contract προηγούνται του deployment.",
            "Το deployment δημιουργεί νέο contract instance με τη δική του διεύθυνση.",
            "Ένα deployed contract είναι διαφορετικό από την απλή προβολή source code στο Remix.",
            "Το lab αυτό εστιάζει στη δημιουργία του δικού σου instance και όχι μόνο στο interaction με ήδη υπάρχον contract.",
        ],
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public value;

    function increment() external {
        value += 1;
    }
}`,
    },
};

function CheckItem({ done, title, description, actionLabel, doneLabel, onClick }) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/45">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">{title}</h3>
                    {description && <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>}
                </div>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={done}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${done
                        ? "cursor-default border border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                        : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                        }`}
                >
                    {done ? doneLabel : actionLabel}
                </button>
            </div>
        </div>
    );
}

export default function CodingLabInteraction1({ lang = "en" }) {
    const copy = CONTENT[lang];

    const [tasks, setTasks] = useState({
        createFile: false,
        compile: false,
        deploy: false,
        verify: false,
    });
    const [checkpointAnswer, setCheckpointAnswer] = useState(null);
    const [checkpointSubmitted, setCheckpointSubmitted] = useState(false);
    const [checkpointCorrect, setCheckpointCorrect] = useState(false);

    const stepItems = useMemo(() => {
        const current = [
            tasks.createFile,
            tasks.compile,
            tasks.deploy,
            tasks.verify,
            checkpointCorrect,
        ];

        return copy.steps.map((title, index) => ({
            label: `${copy.stepLabel} ${index + 1}`,
            title,
            text: copy.instructions[index],
            complete: current[index],
        }));
    }, [copy, tasks, checkpointCorrect]);

    const currentStep = useMemo(() => {
        const completion = [tasks.createFile, tasks.compile, tasks.deploy, tasks.verify, checkpointCorrect];
        const idx = completion.findIndex((item) => !item);
        return idx === -1 ? stepItems.length : idx;
    }, [tasks, checkpointCorrect, stepItems.length]);

    const isComplete = tasks.createFile && tasks.compile && tasks.deploy && tasks.verify && checkpointCorrect;

    const toggleTask = (key) => {
        setTasks((prev) => ({ ...prev, [key]: true }));
    };

    const resetLab = () => {
        setTasks({
            createFile: false,
            compile: false,
            deploy: false,
            verify: false,
        });
        setCheckpointAnswer(null);
        setCheckpointSubmitted(false);
        setCheckpointCorrect(false);
    };

    const submitCheckpoint = () => {
        if (checkpointAnswer === null) return;
        const isCorrect = checkpointAnswer === copy.checkpointCorrectIndex;
        setCheckpointSubmitted(true);
        setCheckpointCorrect(isCorrect);
    };

    const simulatorContent = (
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-7">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
                <div className="space-y-6">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                            {copy.simulatorTitle}
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{copy.workflowTitle}</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.workflowIntro}</p>
                        <div className="mt-5 rounded-2xl border border-cyan-200/80 bg-cyan-50/80 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{copy.remixTitle}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                                        {copy.remixDescription}
                                    </p>
                                </div>
                                <a
                                    href={REMIX_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-300/70 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-slate-950/40 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    remix.ethereum.org
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-100/80 p-5 dark:border-white/10 dark:bg-slate-950/50 sm:p-6">
                        <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-200">
                            <div className="rounded-2xl border border-cyan-300/60 bg-cyan-50 p-3 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                                <FileCode2 className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                    {copy.codeTitle}
                                </div>
                                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Counter.sol</h3>
                            </div>
                        </div>

                        <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-200">
                            <code>{copy.code}</code>
                        </pre>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl border border-cyan-300/60 bg-cyan-50 p-3 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                                    <TerminalSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                        {copy.notesTitle}
                                    </div>
                                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{copy.currentAction}</h3>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {stepItems.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className={`rounded-xl border px-4 py-3 text-sm ${index < currentStep
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
                                    <div key={item} className="rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200">
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
                        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{copy.checklistTitle}</h3>

                        <div className="mt-5 space-y-3">
                            <CheckItem
                                done={tasks.createFile}
                                title={copy.tasks.createFile}
                                description={lang === "gr" ? "Δημιούργησε το αρχείο Counter.sol μέσα στο Remix." : "Create the Counter.sol file inside Remix."}
                                actionLabel={copy.actionLabels.markDone}
                                doneLabel={copy.actionLabels.markedDone}
                                onClick={() => toggleTask("createFile")}
                            />
                            <CheckItem
                                done={tasks.compile}
                                title={copy.tasks.compile}
                                description={lang === "gr" ? "Επίλεξε compiler 0.8.x και βεβαιώσου ότι το contract κάνει compile χωρίς errors." : "Select compiler 0.8.x and ensure the contract compiles without errors."}
                                actionLabel={copy.actionLabels.markDone}
                                doneLabel={copy.actionLabels.markedDone}
                                onClick={() => toggleTask("compile")}
                            />
                            <CheckItem
                                done={tasks.deploy}
                                title={copy.tasks.deploy}
                                description={lang === "gr" ? "Σύνδεσε το wallet σου μέσω Injected Provider και κάνε deploy στο Besu Edu-Net." : "Connect your wallet through Injected Provider and deploy to Besu Edu-Net."}
                                actionLabel={copy.actionLabels.markDone}
                                doneLabel={copy.actionLabels.markedDone}
                                onClick={() => toggleTask("deploy")}
                            />
                            <CheckItem
                                done={tasks.verify}
                                title={copy.tasks.verify}
                                description={lang === "gr" ? "Βρες το deployed contract address και επιβεβαίωσέ το στο block explorer ή μέσα από το deployment panel του Remix." : "Find the deployed contract address and confirm it in the block explorer or in Remix’s deployment panel."}
                                actionLabel={copy.actionLabels.markDone}
                                doneLabel={copy.actionLabels.markedDone}
                                onClick={() => toggleTask("verify")}
                            />
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
                <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-200">
                    <Code2 className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{lang === "gr" ? "Τι αλλάζει σε αυτό το lab" : "What changes in this lab"}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {lang === "gr"
                        ? "Σε προηγούμενα labs αλληλεπιδρούσες με ένα ήδη deployed contract. Εδώ δημιουργείς εσύ το contract instance, οπότε το deploy είναι βασικό μέρος της μάθησης."
                        : "In earlier labs you interacted with an already deployed contract. Here, you create the contract instance yourself, so deployment becomes part of the learning outcome."}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-950/45">
                <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-200">
                    <ExternalLink className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{lang === "gr" ? "Τι να παρατηρήσεις" : "What to observe"}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {lang === "gr"
                        ? "Μετά το deployment, το contract αποκτά τη δική του διεύθυνση on-chain. Αυτό είναι το πιο σημαντικό observable αποτέλεσμα αυτής της άσκησης."
                        : "After deployment, the contract gets its own on-chain address. That is the most important observable outcome of this exercise."}
                </p>
            </div>
        </div>
    );

    const takeawaysContent = (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
                {copy.takeaways.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200">
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
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${checkpointAnswer === index
                            ? "border-cyan-300/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"
                            : "border-slate-200/70 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={submitCheckpoint}
                disabled={checkpointAnswer === null}
                className={`mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${checkpointAnswer === null
                    ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                    : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                    }`}
            >
                {lang === "gr" ? "Υποβολή απάντησης" : "Submit answer"}
            </button>

            {checkpointSubmitted && (
                <div
                    className={`mt-5 rounded-2xl border px-4 py-4 text-sm leading-7 ${checkpointCorrect
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
            labId="coding01"
            title={copy.completeLabel}
            description={copy.completeDescription}
            xp={400}
            badge={copy.badge}
            backHref={copy.backHref}
            completedLabel={copy.allStepsCompleted}
            language={lang}
        />
    ) : null;

    return (
        <SystemLabTemplate
            labId="coding01"
            title={copy.title}
            subtitle={copy.subtitle}
            level={copy.level}
            estimatedTime={copy.estimatedTime}
            xp={400}
            badge={copy.badge}
            backHref={copy.backHref}
            backLabel={copy.backLabel}
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
                level: lang === "gr" ? "Επίπεδο" : "Level",
                estimatedTime: lang === "gr" ? "Εκτιμώμενος χρόνος" : "Estimated time",
                xp: "XP",
                badgeLabel: lang === "gr" ? "Σήμα" : "Badge",
                stepLabel: copy.stepLabel,
                completedOn: lang === "gr" ? "Ολοκληρώθηκε:" : "Completed on:",
                successMessage: lang === "gr" ? "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς" : "✔ Completion recorded successfully",
                checkingStatus: lang === "gr" ? "Έλεγχος κατάστασης ολοκλήρωσης…" : "Checking completion status…",
            }}
        />
    );
}
