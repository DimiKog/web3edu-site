import { useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import PoSVisualizer from "../tools/PoSVisualizer.jsx";

const CONTENT = {
    en: {
        title: "Consensus Under Pressure",
        intro:
            "This lab goes beyond running the proof-of-stake visualizer. You will compare outcomes across different stake distributions, observe when consensus succeeds or fails, and explain what stake, attestation, and finality mean for safety.",
        steps: [
            "Run a balanced round and observe",
            "Run an imbalanced round and compare",
            "Find both success and failure",
            "Explain inclusion, attestation, and finality",
        ],
        instructions: [
            "First, adjust all validators to have equal stake. Then run a round and observe proposer selection and attestation behavior.",
            "Then create an extreme distribution (for example 90 / 5 / 5) and run again. Compare how proposer probability and selection behavior change.",
            "Repeat rounds until you observe both success and failure. Focus on what changes in the attestation threshold and why the system sometimes refuses to finalize.",
            "Inspect the transactions that enter the block and explain why only finalized blocks count as accepted system outcomes.",
        ],
        allStepsCompleted: "All guided checks completed",
        backHref: "/#/labs/system/s3",
        backLabel: "⬅ Return to Lab Overview",
        completeTitle: "System Lab S3 Complete",
        completeDescription:
            "You explored how proof-of-stake behaves under pressure and when consensus succeeds or fails.",
        completedLabel: "🎉 Lab Completed",
        completedDescription:
            "You completed System Lab S3 — Consensus Under Pressure. Claim your completion below.",
        whatToFocusTitle: "What This Lab Shows",
        bullets: [
            "Stake changes influence, but influence is probabilistic rather than guaranteed.",
            "A proposer can create a candidate block, but the system accepts it only if attestation reaches the 2/3 threshold.",
            "Consensus safety is visible not only when the system succeeds, but also when it refuses to finalize an unsafe block.",
            "Transaction inclusion matters economically, but only finalized blocks produce accepted outcomes and rewards.",
        ],
        comparisonTitle: "PoW vs PoS at a Glance",
        comparisonIntro:
            "Use this final comparison to connect the proof-of-stake round you just observed with the proof-of-work logic you have already seen elsewhere in the course.",
        comparisonHeaders: {
            concept: "Concept",
            pow: "PoW",
            pos: "PoS",
        },
        comparisonRows: [
            { concept: "Resource", pow: "Computation (hashing)", pos: "Stake (capital)" },
            { concept: "Selection", pow: "Mining competition", pos: "Random (stake-weighted)" },
            { concept: "Energy", pow: "High", pos: "Low" },
            { concept: "Security", pow: "Economic (costly work)", pos: "Economic (slashing risk)" },
            { concept: "Finality", pow: "Probabilistic", pos: "Probabilistic / Finality" },
        ],
        toolTitle: "Consensus Pressure Tool",
        markDone: "Mark complete",
    },
    gr: {
        title: "Συναίνεση Υπό Πίεση",
        intro:
            "Αυτό το lab προχωρά πέρα από την απλή χρήση του proof-of-stake visualizer. Θα συγκρίνεις αποτελέσματα σε διαφορετικές κατανομές stake, θα παρατηρήσεις πότε η συναίνεση πετυχαίνει ή αποτυγχάνει και θα εξηγήσεις τι σημαίνουν το stake, το attestation και το finality για την ασφάλεια.",
        steps: [
            "Εκτέλεσε έναν ισορροπημένο γύρο και παρατήρησε",
            "Εκτέλεσε έναν ανισόρροπο γύρο και σύγκρινε",
            "Βρες επιτυχία και αποτυχία",
            "Εξήγησε inclusion, attestation και finality",
        ],
        instructions: [
            "Αρχικά, ρύθμισε όλους τους validators ώστε να έχουν ίσο stake. Έπειτα εκτέλεσε έναν γύρο και παρατήρησε την επιλογή proposer και τη συμπεριφορά του attestation.",
            "Έπειτα δημιούργησε μια ακραία κατανομή (για παράδειγμα 90 / 5 / 5) και εκτέλεσε ξανά. Σύγκρινε πώς αλλάζουν η πιθανότητα proposer και η συμπεριφορά επιλογής.",
            "Επανάλαβε γύρους μέχρι να δεις τόσο επιτυχία όσο και αποτυχία. Εστίασε στο τι αλλάζει στο όριο attestation και γιατί το σύστημα μερικές φορές αρνείται να οριστικοποιήσει.",
            "Παρατήρησε τις συναλλαγές που μπαίνουν στο block και εξήγησε γιατί μόνο τα finalized blocks θεωρούνται αποδεκτά αποτελέσματα του συστήματος.",
        ],
        allStepsCompleted: "Όλοι οι καθοδηγούμενοι έλεγχοι ολοκληρώθηκαν",
        backHref: "/#/labs-gr/system/s3",
        backLabel: "⬅ Επιστροφή στην Επισκόπηση Lab",
        completeTitle: "Ολοκλήρωση του System Lab S3",
        completeDescription:
            "Εξερεύνησες πώς συμπεριφέρεται το proof-of-stake υπό πίεση και πότε η συναίνεση πετυχαίνει ή αποτυγχάνει.",
        completedLabel: "🎉 Ολοκλήρωση Lab",
        completedDescription:
            "Ολοκλήρωσες το System Lab S3 — Συναίνεση Υπό Πίεση. Διεκδίκησε την ολοκλήρωσή σου παρακάτω.",
        whatToFocusTitle: "Τι Δείχνει Αυτό το Lab",
        bullets: [
            "Το stake αλλάζει την επιρροή, αλλά η επιρροή παραμένει πιθανοτική και όχι εγγυημένη.",
            "Ο proposer μπορεί να δημιουργήσει ένα candidate block, αλλά το σύστημα το αποδέχεται μόνο αν το attestation φτάσει το όριο 2/3.",
            "Η ασφάλεια της συναίνεσης φαίνεται όχι μόνο όταν το σύστημα πετυχαίνει, αλλά και όταν αρνείται να οριστικοποιήσει ένα μη ασφαλές block.",
            "Η συμπερίληψη συναλλαγών έχει οικονομική σημασία, αλλά μόνο τα finalized blocks παράγουν αποδεκτά αποτελέσματα και rewards.",
        ],
        comparisonTitle: "PoW και PoS Συνοπτικά",
        comparisonIntro:
            "Χρησιμοποίησε αυτή τη σύγκριση για να συνδέσεις τον proof-of-stake γύρο που μόλις παρατήρησες με τη λογική του proof-of-work που έχεις ήδη δει αλλού στο μάθημα.",
        comparisonHeaders: {
            concept: "Έννοια",
            pow: "PoW",
            pos: "PoS",
        },
        comparisonRows: [
            { concept: "Πόρος", pow: "Υπολογισμός (hashing)", pos: "Stake (κεφάλαιο)" },
            { concept: "Επιλογή", pow: "Ανταγωνισμός mining", pos: "Τυχαία (με βάση το stake)" },
            { concept: "Ενέργεια", pow: "Υψηλή", pos: "Χαμηλή" },
            { concept: "Ασφάλεια", pow: "Οικονομική (δαπανηρή εργασία)", pos: "Οικονομική (κίνδυνος slashing)" },
            { concept: "Finality", pow: "Πιθανοτική", pos: "Πιθανοτική / Finality" },
        ],
        toolTitle: "Εργαλείο Συναίνεσης Υπό Πίεση",
        markDone: "Σήμανση ως ολοκληρωμένο",
    },
};

export default function SystemLabS3Interaction({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;
    const [step, setStep] = useState(0);
    const isComplete = step === copy.steps.length;
    const stepCompletion = copy.steps.map((_, index) => index < step);
    const card = "rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40";

    // --- Minimal checkpoint state ---
    const [checkpointAnswer, setCheckpointAnswer] = useState(null);
    const [checkpointFeedback, setCheckpointFeedback] = useState(null);

    const completeCurrentStep = () => {
        setStep((current) => Math.min(current + 1, copy.steps.length));
    };

    const currentInstruction = useMemo(() => {
        if (isComplete) return null;
        return copy.instructions[step];
    }, [copy.instructions, isComplete, step]);

    return (
        <PageShell>
            <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 xl:max-w-[1500px]">
                <section className={card}>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {copy.title}
                    </h1>
                    <p className="mt-3 max-w-5xl text-slate-600 dark:text-slate-300">
                        {copy.intro}
                    </p>
                    <a
                        href={copy.backHref}
                        className="mt-4 inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-1 dark:text-indigo-300"
                    >
                        {copy.backLabel}
                    </a>
                </section>

                <section className={card.replace("p-6", "p-5")}>
                    <div className="mb-3 text-xs text-slate-400">
                        Step {Math.min(step + 1, copy.steps.length)} / {copy.steps.length}
                    </div>

                    <div className="space-y-2">
                        {copy.steps.map((item, index) => (
                            <div key={item} className="flex items-start gap-2 transition-all duration-200">
                                <div className={`mt-0.5 text-xs ${stepCompletion[index] ? "text-green-400" : index === step && !isComplete ? "text-blue-400" : "text-slate-500"}`}>
                                    {stepCompletion[index] ? "✔" : index === step && !isComplete ? "●" : "○"}
                                </div>
                                <div className="flex-1">
                                    <div className={`text-sm ${index === step && !isComplete ? "font-semibold text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                                        {item}
                                    </div>
                                    {index === step && !isComplete && (
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {currentInstruction}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {lang === "gr"
                            ? "Χρησιμοποίησε το εργαλείο σε κάθε βήμα πριν προχωρήσεις."
                            : "Use the tool in each step before marking it complete."}
                    </div>
                    {step === 0 && !isComplete && (
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {lang === "gr"
                                ? "Ισορροπημένο stake σημαίνει ίση πιθανότητα, όχι ίδιο αποτέλεσμα σε έναν μόνο γύρο."
                                : "Balanced stake means equal probability — not equal outcomes in a single round."}
                        </div>
                    )}

                    {!isComplete && (
                        <button
                            onClick={completeCurrentStep}
                            className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                            {copy.markDone}
                        </button>
                    )}

                    {isComplete && (
                        <div className="mt-3 text-xs text-green-400">
                            ✔ {copy.allStepsCompleted}
                        </div>
                    )}
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {lang === "gr" ? "Καθοδηγούμενα Πειράματα" : "Guided Experiments"}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {lang === "gr" ? "Πείραμα 1 — Ισορροπημένο stake" : "Experiment 1 — Balanced stake"}
                            </div>
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {lang === "gr"
                                    ? "Διατήρησε παρόμοιο stake στους validators και εκτέλεσε έναν γύρο. Παρατήρησε ποιος επιλέγεται και αν το block φτάνει σε finality."
                                    : "Keep validator stake relatively balanced and run a round. Observe who is selected and whether the block reaches finality."}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {lang === "gr" ? "Πείραμα 2 — Ακραία ανισορροπία" : "Experiment 2 — Extreme imbalance"}
                            </div>
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {lang === "gr"
                                    ? "Ρύθμισε stake όπως 90 / 5 / 5 και εκτέλεσε ξανά. Σύγκρινε αν η επιλογή proposer γίνεται πιο προβλέψιμη και τι σημαίνει αυτό για την αποκέντρωση."
                                    : "Set stake to something like 90 / 5 / 5 and run again. Compare whether proposer selection becomes more predictable and what this means for decentralization."}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/30">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {lang === "gr" ? "Πείραμα 3 — Αποτυχία συναίνεσης" : "Experiment 3 — Consensus failure"}
                            </div>
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {lang === "gr"
                                    ? "Επανάλαβε γύρους μέχρι να εμφανιστεί αποτυχία. Κατέγραψε τι συνέβη στο attestation και γιατί το σύστημα δεν δέχτηκε το block. Εστίασε στο όριο 2/3 και πώς το attestation υπολείπεται."
                                    : "Repeat rounds until you observe failure. Record what happened to attestation and why the system refused to accept the block. Focus on the 2/3 threshold and how attestation falls short."}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {copy.toolTitle}
                    </div>
                    <div className="rounded-2xl bg-[#0F172A] p-5 text-white">
                        <PoSVisualizer key={`${lang}-${step}`} lang={lang} embedded />
                    </div>
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {lang === "gr" ? "Σημειώσεις Παρατήρησης" : "Observation Notes"}
                    </h2>
                    <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div>• {lang === "gr" ? "Ποιος validator επιλέγεται πιο συχνά όταν αυξάνεται το stake;" : "Which validator is selected most often as stake increases?"}</div>
                        <div>• {lang === "gr" ? "Τι αλλάζει μεταξύ επιτυχημένου και αποτυχημένου γύρου;" : "What changes between a successful and a failed round?"}</div>
                        <div>• {lang === "gr" ? "Γιατί η αποτυχία finality προστατεύει το σύστημα;" : "Why does failure to finalize protect the system?"}</div>
                    </div>
                </section>

                {/* Minimal checkpoint after Observation Notes */}
                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {lang === "gr" ? "Checkpoint" : "Checkpoint"}
                    </h2>

                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {lang === "gr"
                            ? "Γιατί το σύστημα αρνείται να κάνει finalize ένα block;"
                            : "Why does the system refuse to finalize a block?"}
                    </div>

                    <div className="mt-4 space-y-2">
                        {[
                            lang === "gr" ? "Δεν υπάρχουν αρκετές συναλλαγές" : "Not enough transactions",
                            lang === "gr" ? "Δεν υπάρχουν αρκετοί validators" : "Not enough validators",
                            lang === "gr" ? "Το attestation δεν έφτασε το όριο 2/3" : "Attestation did not reach the 2/3 threshold",
                            lang === "gr" ? "Ο proposer απέτυχε" : "Proposer failed",
                        ].map((opt, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setCheckpointAnswer(idx);
                                    if (idx === 2) {
                                        setCheckpointFeedback("correct");
                                    } else {
                                        setCheckpointFeedback("wrong");
                                    }
                                }}
                                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${checkpointAnswer === idx
                                        ? "border-indigo-400 bg-indigo-500/20"
                                        : "border-slate-700 bg-slate-800/50"
                                    }`}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>

                    {checkpointFeedback === "correct" && (
                        <div className="mt-3 text-xs text-emerald-400">
                            {lang === "gr"
                                ? "Σωστό: η συναίνεση απαιτεί ≥2/3 του συνολικού stake."
                                : "Correct: consensus requires ≥2/3 of total stake."}
                        </div>
                    )}

                    {checkpointFeedback === "wrong" && (
                        <div className="mt-3 text-xs text-red-400">
                            {lang === "gr"
                                ? "Δοκίμασε ξανά — σκέψου το όριο attestation."
                                : "Try again — think about the attestation threshold."}
                        </div>
                    )}
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {lang === "gr" ? "Τι πρέπει να συμπεράνεις" : "What You Should Conclude"}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <div>
                            {lang === "gr"
                                ? "• Ο proposer δεν αποφασίζει μόνος του το αποτέλεσμα. Η επιλογή proposer είναι μόνο η αρχή της διαδικασίας."
                                : "• The proposer does not decide the outcome alone. Proposer selection is only the beginning of the process."}
                        </div>
                        <div>
                            {lang === "gr"
                                ? "• Το block γίνεται αποδεκτό μόνο όταν το attestation φτάσει το όριο 2/3 του συνολικού stake."
                                : "• A block is accepted only when attestation reaches ≥ 2/3 of total stake."}
                        </div>
                        <div>
                            {lang === "gr"
                                ? "• Η αποτυχία finality δεν είναι bug· είναι ένδειξη ότι το σύστημα προστάτεψε τη συναίνεση αρνούμενο να δεχτεί ανεπαρκώς επικυρωμένο block."
                                : "• Failure to finalize is not a bug; it shows the system protecting consensus by refusing to accept an insufficiently validated block."}
                        </div>
                        <div>
                            {lang === "gr"
                                ? "• Το proof-of-stake λύνει το πρόβλημα των Βυζαντινών Στρατηγών όχι επειδή εξαλείφει τη διαφωνία, αλλά επειδή κάνει την ασφαλή συμφωνία μετρήσιμη και τα οικονομικά κίνητρα κρίσιμα."
                                : "• Proof-of-stake solves the Byzantine Generals problem not by eliminating disagreement, but by making safe agreement measurable and economically meaningful."}
                        </div>
                    </div>
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.whatToFocusTitle}
                    </h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                        {copy.bullets.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                {isComplete && (
                    <section className="overflow-hidden rounded-2xl border border-cyan-200/60 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_48%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                                    {lang === "gr" ? "Σύγκριση συναίνεσης" : "Consensus comparison"}
                                </div>
                                <h2 className="mt-3 text-2xl font-semibold text-white">
                                    {copy.comparisonTitle}
                                </h2>
                                <p className="mt-2 max-w-3xl text-sm text-slate-300">
                                    {copy.comparisonIntro}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-amber-200">
                                    ⛏ {copy.comparisonHeaders.pow}
                                </div>
                                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200">
                                    🛡 {copy.comparisonHeaders.pos}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
                            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                                <div className="px-4 py-3">{copy.comparisonHeaders.concept}</div>
                                <div className="px-4 py-3 text-amber-200">{copy.comparisonHeaders.pow}</div>
                                <div className="px-4 py-3 text-emerald-200">{copy.comparisonHeaders.pos}</div>
                            </div>

                            <div className="divide-y divide-white/10">
                                {copy.comparisonRows.map((row) => (
                                    <div
                                        key={row.concept}
                                        className="grid grid-cols-1 gap-3 px-4 py-4 text-sm md:grid-cols-[1.1fr_1fr_1fr] md:items-center"
                                    >
                                        <div className="font-semibold text-white">
                                            {row.concept}
                                        </div>
                                        <div className="rounded-xl border border-amber-400/15 bg-amber-400/8 px-3 py-2 text-slate-200">
                                            {row.pow}
                                        </div>
                                        <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-slate-200">
                                            {row.pos}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {isComplete && (
                    <section className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-700 dark:bg-green-900/20">
                        <h2 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
                            {copy.completedLabel}
                        </h2>
                        <p className="mb-4 text-slate-700 dark:text-slate-200">
                            {copy.completedDescription}
                        </p>
                        <LabCompletionClaim
                            labId="system-s3"
                            language={lang}
                            backHref={copy.backHref}
                            backLabel={copy.backLabel}
                            labTitle={copy.title}
                        />
                    </section>
                )}
            </div>
        </PageShell>
    );
}
