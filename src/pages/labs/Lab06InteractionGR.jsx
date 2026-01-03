import { useState, useEffect } from "react";
import PageShell from "../../components/PageShell";

/**
 * Lab 06 — Συναίνεση & Οριστικότητα
 * Interaction Scaffold
 *
 * Goal:
 * Help students build intuition around:
 * - What consensus means
 * - Why finality matters
 * - How validators agree on a single chain
 *
 * NOTE:
 * This scaffold is intentionally conceptual-first.
 * Byzantine Fault Tolerance theory is deferred to a future lab.
 */

const initialLab06State = {
    currentStep: 1,
    lastAction: null,

    // Step 1 — Conceptual understanding
    consensusDefined: false,
    consensusAnswerWrong: false,

    // Step 2 — Validators & blocks
    validatorsUnderstood: false,
    validatorsAnswerWrong: false,

    // Step 3 — Forks vs finality
    finalityUnderstood: false,

    // Discoveries & completion
    discoveredData: [],
    explanationUnlocked: false,
};

const Lab06InteractionGR = () => {
    const [labState, setLabState] = useState(initialLab06State);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const markStepComplete = (key, message, discovery) => {
        setLabState((s) => ({
            ...s,
            [key]: true,
            lastAction: message,
            discoveredData: discovery
                ? [...s.discoveredData, discovery]
                : s.discoveredData,
        }));
    };

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 06 — Συναίνεση & Οριστικότητα
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Μάθετε πώς τα αποκεντρωμένα δίκτυα συμφωνούν σε ένα κοινό ιστορικό
                        και γιατί η οριστικότητα είναι κρίσιμη για εμπιστοσύνη χωρίς κεντρική αρχή.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border p-5 bg-slate-50 dark:bg-slate-900/40">
                    {labState.lastAction && (
                        <div className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                            ✅ {labState.lastAction}
                        </div>
                    )}
                    <h2 className="font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Κατανόηση έννοιας συναίνεσης: {labState.consensusDefined ? "✅" : "❌"}</li>
                        <li>Κατανόηση ρόλου επικυρωτών: {labState.validatorsUnderstood ? "✅" : "❌"}</li>
                        <li>Κατανόηση της έννοιας της οριστικότητας: {labState.finalityUnderstood ? "✅" : "❌"}</li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    <div className="space-y-6">

                        {/* Step 1 — What is consensus */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                1️⃣ Τι είναι η Συναίνεση;
                            </h3>

                            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                🔀 Πριν τη Συναίνεση - Διαφορετικά Τοπικά Ιστορικά
                            </p>

                            {/* Distributed network intuition */}
                            <div className="mb-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Τα blockchains είναι <strong>κατανεμημένα συστήματα</strong>. Δεν υπάρχει
                                    κεντρική βάση δεδομένων, ούτε παγκόσμιο ρολόι, ούτε αρχή που λέει στους κόμβους
                                    ποια είναι η “σωστή” κατάσταση.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Κόμβος A βλέπει</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx1 → Tx2</li>
                                            <li>Block #120</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Κόμβος B βλέπει</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx2 → Tx1</li>
                                            <li>Block #120</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Κόμβος C βλέπει</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx1 μόνο</li>
                                            <li>Block #119</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                    ⚠️ Επειδή το δίκτυο είναι κατανεμημένο, οι κόμβοι μπορούν προσωρινά να έχουν
                                    <em>διαφορετικές εκδοχές της ιστορίας του blockchain</em>. Η συναίνεση είναι απαραίτητη
                                    ώστε όλοι να καταλήξουν σε <strong>ένα κοινό blockchain</strong>.
                                </div>
                            </div>

                            {/* Visual intuition */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/20">
                                    <p className="font-semibold mb-2">❌ Χωρίς Συναίνεση</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Διαφορετικές σειρές blocks</li>
                                        <li>Πολλαπλές ανταγωνιστικές αλυσίδες</li>
                                        <li>Καμία κοινή ιστορία</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                                    <p className="font-semibold mb-2">✅ Με Συναίνεση</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Οι επικυρωτές συντονίζονται</li>
                                        <li>Μία κοινή αλυσίδα</li>
                                        <li>Κοινή πηγή αλήθειας</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Question */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Με βάση την παραπάνω κατάσταση, τι πρέπει να λύσει το δίκτυο ώστε να λειτουργήσει
                                ως <strong>ένα blockchain</strong>;
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900 disabled:opacity-70"
                                value={labState.consensusDefined ? "correct" : ""}
                                disabled={labState.consensusDefined}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "correct") {
                                        setLabState((s) => ({
                                            ...s,
                                            consensusDefined: true,
                                            consensusAnswerWrong: false,
                                            lastAction: "✅ Σωστά! Η συναίνεση εξασφαλίζει ότι όλοι οι έντιμοι κόμβοι συμφωνούν σε μία κοινή ιστορία.",
                                            discoveredData: [
                                                ...s.discoveredData,
                                                "Η συναίνεση λύνει το πρόβλημα συμφωνίας σε κατανεμημένα συστήματα, οδηγώντας όλους τους έντιμους κόμβους σε μία ιστορία.",
                                            ],
                                        }));
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ Αυτό από μόνο του δεν αρκεί. Οι κόμβοι μπορεί ακόμα να διαφωνούν για το ποια ιστορία είναι η κανονική.",
                                            consensusAnswerWrong: true,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Επιλέξτε απάντηση…
                                </option>
                                <option value="wrong1">
                                    Ταξινόμηση συναλλαγών μέσα σε ένα block
                                </option>
                                <option value="correct">
                                    Διασφάλιση ότι όλοι οι κόμβοι συμφωνούν στην ίδια ιστορία του blockchain
                                </option>
                                <option value="wrong2">
                                    Μόνο επαλήθευση κρυπτογραφικών υπογραφών
                                </option>
                            </select>

                            {labState.consensusAnswerWrong === true && (
                                <div className="mt-3 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold">
                                    ❌ Αυτό δεν λύνει το πρόβλημα της κατανεμημένης συμφωνίας. Ακόμα κι αν οι συναλλαγές
                                    ταξινομούνται ή οι υπογραφές είναι έγκυρες, οι κόμβοι μπορεί να διαφωνούν ως προς
                                    το ποια αλυσίδα είναι η κανονική.
                                </div>
                            )}

                            {/* Post-consensus visual */}
                            {labState.consensusDefined && (
                                <div className="mt-6 p-5 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 transition-all duration-500 ease-out">
                                    <p className="font-semibold mb-4 text-green-800 dark:text-green-200">
                                        🔗 Μετά τη Συναίνεση
                                    </p>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Κόμβος A<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>

                                        <div className="text-2xl text-green-600 dark:text-green-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Κόμβος B<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>

                                        <div className="text-2xl text-green-600 dark:text-green-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Κόμβος C<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-green-800 dark:text-green-200 font-semibold text-center">
                                        ✔️ Διαφορετικοί κόμβοι συγκλίνουν σε <strong>μία κοινή ιστορία</strong>.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Step 2 — Validators */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                2️⃣ Επικυρωτές & Παραγωγή Blocks
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Σε ένα αποκεντρωμένο blockchain δεν υπάρχει κεντρική αρχή.
                                <strong> Οι επικυρωτές</strong> είναι ειδικοί κόμβοι που συλλογικά
                                εφαρμόζουν τους κανόνες συναίνεσης του δικτύου.
                            </p>

                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-1">
                                <li>Προτείνουν νέα blocks</li>
                                <li>Επαληθεύουν blocks που προτείνουν άλλοι</li>
                                <li>Κανένας επικυρωτής δεν αποφασίζει μόνος του την ιστορία</li>
                            </ul>


                            {/* Visual: block proposal with transactions */}
                            <div className="mb-6 p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/40">
                                <p className="font-semibold mb-3 text-slate-700 dark:text-slate-200">
                                    🧱 Ένας Επικυρωτής Προτείνει ένα Block
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 font-mono text-xs shadow-sm">
                                        <p className="font-semibold mb-2">Εκκρεμείς Συναλλαγές</p>
                                        <ul className="space-y-1">
                                            <li>Tx A → Tx B</li>
                                            <li>Tx C → Tx D</li>
                                            <li>Tx E → Tx F</li>
                                        </ul>
                                    </div>

                                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        ⇨
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-sm">
                                        <p className="font-semibold mb-1">🧑‍⚙️ Επικυρωτής</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                            Δημιουργεί υποψήφιο block
                                        </p>
                                        <div className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                            Block #122
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
                                    Ένας επικυρωτής επιλέγει συναλλαγές και προτείνει ένα <strong>υποψήφιο block</strong>.
                                    Αυτό το block <em>δεν είναι τελικό</em> μέχρι να συμφωνήσουν οι υπόλοιποι επικυρωτές.
                                </p>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Ποια δήλωση περιγράφει καλύτερα τον ρόλο των επικυρωτών;
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900"
                                defaultValue=""
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "correct") {
                                        markStepComplete(
                                            "validatorsUnderstood",
                                            "✅ Ο ρόλος των επικυρωτών έγινε κατανοητός",
                                            "Οι επικυρωτές συλλογικά εφαρμόζουν τους κανόνες συναίνεσης προτείνοντας και επαληθεύοντας blocks."
                                        );
                                        setLabState((s) => ({
                                            ...s,
                                            validatorsAnswerWrong: false,
                                        }));
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ Οι επικυρωτές δεν ελέγχουν το δίκτυο ούτε δρουν μόνοι τους.",
                                            validatorsAnswerWrong: true,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>Επιλέξτε απάντηση…</option>
                                <option value="wrong1">Κόμβοι που ελέγχουν ποιοι χρήστες μπορούν να κάνουν συναλλαγές</option>
                                <option value="wrong2">Κόμβοι που απλώς αποθηκεύουν δεδομένα του blockchain</option>
                                <option value="correct">
                                    Κόμβοι που ακολουθούν τους κανόνες πρωτοκόλλου για να προτείνουν και να συμφωνούν σε blocks
                                </option>
                            </select>

                            {/* Feedback — Wrong answer */}
                            {labState.validatorsAnswerWrong && !labState.validatorsUnderstood && (
                                <div className="mt-3 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold">
                                    ❌ Λάθος. Οι επικυρωτές <strong>δεν</strong> ελέγχουν το δίκτυο ούτε
                                    αποφασίζουν μόνοι τους την ιστορία. Πρέπει να ακολουθούν τους κανόνες
                                    του πρωτοκόλλου και να συμφωνούν με άλλους επικυρωτές.
                                </div>
                            )}

                            {/* Feedback — Correct answer */}
                            {labState.validatorsUnderstood && (
                                <div className="mt-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                                    ✅ Σωστά! Οι επικυρωτές συλλογικά προτείνουν, επαληθεύουν και συμφωνούν
                                    σε blocks σύμφωνα με τους κανόνες του πρωτοκόλλου.
                                </div>
                            )}

                            {/* Post-correct visual feedback block */}
                            {labState.validatorsUnderstood && (
                                <div className="mt-6 p-5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 transition-all duration-500 ease-out">
                                    <p className="font-semibold mb-4 text-indigo-800 dark:text-indigo-200">
                                        🔗 Οι Επικυρωτές Συντονίζονται για ένα Block
                                    </p>

                                    {/* Updated diagram: show validators proposing, verifying, and finalizing */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Επικυρωτής A<br />
                                            <span className="text-indigo-700 dark:text-indigo-200">Προτείνει Block #122</span>
                                        </div>

                                        <div className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Επικυρωτής B<br />
                                            <span className="text-green-700 dark:text-green-300">Επαληθεύει Κανόνες ✔</span>
                                        </div>

                                        <div className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Επικυρωτής C<br />
                                            <span className="text-blue-700 dark:text-blue-200">Ψηφίζει για Οριστικότητα ✔</span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-indigo-800 dark:text-indigo-200 font-semibold text-center">
                                        ✔️ Ένα block γίνεται <strong>τελικό</strong> μόνο όταν <strong>πολλοί επικυρωτές</strong>
                                        το προτείνουν, το επαληθεύουν και συμφωνούν.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* New: Fork scenario block, before Step 3 */}
                        {labState.validatorsUnderstood && (
                            <div className="rounded-xl border p-5 mb-6 bg-yellow-50 dark:bg-yellow-900/20">
                                <h3 className="font-semibold mb-3 text-yellow-900 dark:text-yellow-200">
                                    ⚡ Forks: Τι συμβαίνει αν οι επικυρωτές διαφωνήσουν;
                                </h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                    Μερικές φορές, οι επικυρωτές μπορεί να διαφωνούν ή να λαμβάνουν blocks σε διαφορετικό χρόνο,
                                    προκαλώντας ένα <strong>fork</strong>: η αλυσίδα χωρίζεται σε δύο ανταγωνιστικές ιστορίες.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm mb-2">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                        Επικυρωτής A<br />
                                        <span className="text-indigo-700 dark:text-indigo-200">Block #123a</span>
                                    </div>
                                    <div className="text-2xl text-yellow-600 dark:text-yellow-300 font-bold">
                                        ⇨
                                    </div>
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                        Επικυρωτής B<br />
                                        <span className="text-pink-700 dark:text-pink-200">Block #123b</span>
                                    </div>
                                </div>
                                <p className="text-xs text-yellow-900 dark:text-yellow-200 text-center">
                                    🚩 Ένα fork: δύο blocks στο ίδιο ύψος, διαφορετικές ιστορίες!
                                </p>
                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 text-center">
                                    Το δίκτυο πρέπει να επιλύσει τα forks για να επιστρέψει σε <strong>μία αλυσίδα</strong>.
                                    Εδώ η <strong>οριστικότητα</strong> γίνεται κρίσιμη.
                                </p>
                            </div>
                        )}

                        {/* Step 3 — Finality */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                3️⃣ Οριστικότητα: Πότε είναι πραγματικά τελικό ένα block;
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Ακόμα και μετά τη συμφωνία σε ένα block, το δίκτυο μπορεί να έχει
                                <strong> προσωρινά forks</strong>.
                                Η οριστικότητα καθορίζει το σημείο όπου ένα block γίνεται
                                <strong> μη αναστρέψιμο</strong>.
                            </p>

                            {/* Before vs After Finality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                                <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20">
                                    <p className="font-semibold mb-2">⏳ Πριν την Οριστικότητα</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Τα blocks μπορεί να αντικατασταθούν</li>
                                        <li>Τα forks είναι ακόμα πιθανά</li>
                                        <li>Η ιστορία δεν είναι εγγυημένη</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                                    <p className="font-semibold mb-2">🔒 Μετά την Οριστικότητα</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Το block είναι μη αναστρέψιμο</li>
                                        <li>Δεν επιτρέπεται ανταγωνιστική ιστορία</li>
                                        <li>Εδραιώνεται κοινή εμπιστοσύνη</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Question */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Τι εγγυάται η οριστικότητα σε ένα blockchain δίκτυο;
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900"
                                defaultValue=""
                                disabled={labState.finalityUnderstood}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "correct") {
                                        markStepComplete(
                                            "finalityUnderstood",
                                            "✅ Σωστά! Η οριστικότητα εγγυάται μη αναστρέψιμη συμφωνία.",
                                            "Η οριστικότητα διασφαλίζει ότι μόλις ένα block γίνει τελικό, δεν μπορεί να αναιρεθεί ποτέ."
                                        );
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ Όχι ακριβώς. Η οριστικότητα αφορά τη μη αναστρεψιμότητα, όχι την ταχύτητα ή την εγκυρότητα των συναλλαγών.",
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>Επιλέξτε απάντηση…</option>
                                <option value="wrong1">
                                    Ότι οι συναλλαγές επικυρώνονται πιο γρήγορα
                                </option>
                                <option value="wrong2">
                                    Ότι τα blocks περιέχουν μόνο έγκυρες συναλλαγές
                                </option>
                                <option value="correct">
                                    Ότι ένα block δεν μπορεί ποτέ να αναιρεθεί αφού γίνει τελικό
                                </option>
                            </select>

                            {/* Feedback */}
                            {labState.finalityUnderstood && (
                                <div className="mt-4 p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                                    🔐 Η οριστικότητα επιτεύχθηκε: η ιστορία του blockchain είναι πλέον
                                    <strong> αμετάβλητη</strong>.
                                    Οι χρήστες και οι εφαρμογές μπορούν να εμπιστεύονται μόνιμα την κατάσταση.
                                </div>
                            )}

                            {/* Finality as irreversible lock */}
                            {labState.finalityUnderstood && (
                                <div className="mt-6 p-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="font-semibold mb-4 text-slate-800 dark:text-slate-200">
                                        ⏱️ Η Οριστικότητα: Αλλάζει τον Χρόνο, Όχι Μόνο τη Συμφωνία
                                    </p>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs">
                                            <p className="font-semibold mb-1">Block #124 (Υποψήφιο)</p>
                                            <p className="text-yellow-600 dark:text-yellow-400">
                                                ⏳ Σε αναμονή επιβεβαιώσεων
                                            </p>
                                            <p className="mt-2 text-slate-500">
                                                Μπορεί ακόμα να αντικατασταθεί
                                            </p>
                                        </div>

                                        {/* Label above confirmations column */}
                                        <div className="flex flex-col items-center">
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                                                χρόνος + επιβεβαιώσεις
                                            </p>
                                            <div className="flex flex-col items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +1 block
                                                </div>
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +2 blocks
                                                </div>
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +3 blocks
                                                </div>
                                                <span className="mt-1 text-[10px] italic text-slate-400">
                                                    οι επιβεβαιώσεις συσσωρεύονται
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/30 text-center font-mono text-xs">
                                            <p className="font-semibold mb-1">Block #124 (Τελικό)</p>
                                            <p className="text-green-700 dark:text-green-300">
                                                🔒 Μη αναστρέψιμο
                                            </p>
                                            <p className="mt-2 text-green-800 dark:text-green-200 font-semibold">
                                                Δεν μπορεί να αναιρεθεί
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 text-center">
                                        ✔️ Η οριστικότητα <strong>δεν</strong> αλλάζει το block — αλλάζει την
                                        <strong> κατάστασή</strong> του στον χρόνο. Καθώς συσσωρεύονται επιβεβαιώσεις,
                                        η αναίρεση γίνεται οικονομικά και τεχνικά αδύνατη.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Ανακαλύψεις</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Καμία ανακάλυψη ακόμη.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {labState.discoveredData.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* 🧠 Explanation */}
                {(labState.consensusDefined &&
                    labState.validatorsUnderstood &&
                    labState.finalityUnderstood) && (
                        <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                            <h2 className="text-xl font-semibold mb-2">🧠 Εξήγηση</h2>
                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                <li>Η συναίνεση εξασφαλίζει ότι όλοι οι έντιμοι κόμβοι μοιράζονται την ίδια ιστορία.</li>
                                <li>Οι επικυρωτές εφαρμόζουν τους κανόνες του δικτύου.</li>
                                <li>Η οριστικότητα αποτρέπει την αναγραφή της ιστορίας.</li>
                            </ul>
                        </section>
                    )}

                {/* 🎉 Completion */}
                {(labState.consensusDefined &&
                    labState.validatorsUnderstood &&
                    labState.finalityUnderstood) && (
                        <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-6">
                            <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                                🎉 Ολοκληρώθηκε το Εργαστήριο
                            </h2>
                            <p className="text-slate-700 dark:text-slate-200 mb-4">
                                Ολοκληρώσατε το <strong>Lab 06 — Συναίνεση & Οριστικότητα</strong>.
                                Πλέον κατανοείτε πώς η αποκεντρωμένη συμφωνία και η οριστικότητα
                                αποτελούν τη βάση της εμπιστοσύνης στο blockchain.
                            </p>
                            <a
                                href="/#/labs-gr/lab06"
                                className="inline-block px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                                ⬅ Επιστροφή στην Επισκόπηση & Δήλωση Ανταμοιβών
                            </a>
                        </section>
                    )}

            </div>
        </PageShell>
    );
};

export default Lab06InteractionGR;
