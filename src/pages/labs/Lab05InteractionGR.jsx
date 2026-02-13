import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import PageShell from "../../components/PageShell";

const initialLab05State = {
    currentStep: 1,
    lastAction: null,

    // Step 1 — Contract existence
    contractObserved: false,

    // Step 2 — Read-only call
    stateRead: false,
    storedValue: null,

    // Step 3 — Write transaction
    txPrepared: false,
    txHash: null,

    // Step 4 — State change observed
    stateUpdated: false,
    updatedValue: null,

    discoveredData: [],
    explanationUnlocked: false,
};


const demoContractAddress = "0x9de0C731c8FA34CD0a47497dE4f569CbaaD5ab5F";

const counterAbi = [
    "function value() view returns (uint256)",
    "function increment()"
];

const Lab05InteractionGR = () => {
    const [labState, setLabState] = useState(initialLab05State);
    const [showContractDetails, setShowContractDetails] = useState(false);
    // Step 1 feedback state
    const [creatorFeedback, setCreatorFeedback] = useState(null); // "correct" | "wrong" | null

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const recordAction = (updates, discovery) => {
        setLabState((s) => ({
            ...s,
            ...updates,
            lastAction: discovery,
            discoveredData: discovery
                ? [...s.discoveredData, discovery]
                : s.discoveredData,
        }));
    };

    const canReset =
        labState.contractObserved ||
        labState.stateRead ||
        labState.txPrepared ||
        labState.stateUpdated;

    const resetLab = () => {
        setLabState({ ...initialLab05State });
        setShowContractDetails(false);
    };

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 05 — Έξυπνα Συμβόλαια & Κατάσταση
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Κατανοήστε πώς τα έξυπνα συμβόλαια αποθηκεύουν κατάσταση on-chain και πώς
                        οι συναλλαγές εκτελούν κώδικα που την τροποποιεί μόνιμα.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>

                    {labState.lastAction && (
                        <div className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                            ✅ {labState.lastAction}
                        </div>
                    )}

                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Παρατήρηση ύπαρξης συμβολαίου (κώδικας on-chain): {labState.contractObserved ? "✅" : "❌"}</li>
                        <li>Ανάγνωση κατάστασης (μόνο ανάγνωση, χωρίς gas): {labState.stateRead ? "✅" : "❌"}</li>
                        <li>Προετοιμασία εκτέλεσης συνάρτησης (πρόθεση συναλλαγής): {labState.txPrepared ? "✅" : "❌"}</li>
                        <li>Ενημέρωση κατάστασης on-chain (μετά το block): {labState.stateUpdated ? "✅" : "❌"}</li>
                        <li>Απαιτήθηκε αλληλεπίδραση με το blockchain: {labState.txPrepared ? "✅" : "❌"}</li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    <div className="space-y-6">

                        {/* Step 1 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Παρατηρήστε την ύπαρξη του Έξυπνου Συμβολαίου
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                                Εκπαιδευτικό demo συμβόλαιο — ήδη ανεπτυγμένο στο Besu Edu‑Net
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                Διεύθυνση Συμβολαίου: <code className="font-mono">{demoContractAddress}</code>
                            </p>
                            <a
                                href={`https://blockexplorer.dimikog.org/address/${demoContractAddress}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                            >
                                🔍 Άνοιγμα συμβολαίου στον Block Explorer
                            </a>
                            <div className="mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-sm text-yellow-900 dark:text-yellow-200">
                                <p className="font-semibold mb-2">🧭 Πού θα βρείτε τον πραγματικό κώδικα</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">Αυτό το UI εργαστηρίου</div>
                                        <div className="opacity-80">Σε καθοδηγεί</div>
                                    </div>
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">Block Explorer</div>
                                        <div className="opacity-80">Εμφανίζει επαληθευμένο κώδικα</div>
                                    </div>
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">Συμβόλαιο on-chain</div>
                                        <div className="opacity-80">Κώδικας + κατάσταση ζουν εδώ</div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Ανοίξτε τον Block Explorer → πατήστε <strong>Code</strong>. Αυτό το Solidity είναι το <strong>επαληθευμένο</strong> συμβόλαιο.
                                </p>
                            </div>
                            <div className="mt-4 p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 border">
                                👀 Υπόδειξη: Βρείτε το πεδίο <strong>Creator / Deployer</strong> στον Block Explorer πριν απαντήσετε.
                            </div>
                            <div className="mt-4 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Ποιος ανέπτυξε (δημιούργησε) αυτό το συμβόλαιο;
                                </label>
                                <select
                                    className="w-full max-w-md px-3 py-2 border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-sm"
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        const isCorrect =
                                            selected === "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E";
                                        if (isCorrect) {
                                            setCreatorFeedback("correct");
                                            recordAction(
                                                { contractObserved: true },
                                                "Ο δημιουργός του συμβολαίου επαληθεύτηκε απευθείας από τον Block Explorer."
                                            );
                                            setShowContractDetails(true);
                                        } else if (selected !== "") {
                                            setCreatorFeedback("wrong");
                                            // Do not set contractObserved or call recordAction
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Επιλέξτε διεύθυνση δημιουργού
                                    </option>
                                    <option value="0x3A91b2cD9E0f4c6F21b8E1aA0C4eD92F7C5A1123">
                                        0x3A91b2cD9E0f4c6F21b8E1aA0C4eD92F7C5A1123
                                    </option>
                                    <option value="0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E">
                                        0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E
                                    </option>
                                    <option value="0x91F0cA7eD8bE4F29C2aA8E1bC0d9F34E7A5B6C89">
                                        0x91F0cA7eD8bE4F29C2aA8E1bC0d9F34E7A5B6C89
                                    </option>
                                </select>
                                {/* Step 1 feedback blocks */}
                                {creatorFeedback === "correct" && (
                                    <div className="mt-2 p-3 rounded-md bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-600 text-green-900 dark:text-green-200 text-sm font-semibold">
                                        ✅ Σωστά. Αυτή η διεύθυνση εμφανίζεται ως δημιουργός του συμβολαίου στον Block Explorer.
                                    </div>
                                )}
                                {creatorFeedback === "wrong" && (
                                    <div className="mt-2 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 text-sm font-semibold">
                                        ❌ Όχι ακριβώς. Ελέγξτε το πεδίο <strong>Creator / Deployer</strong> στον Block Explorer και δοκιμάστε ξανά.
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 mt-2">
                                Τα έξυπνα συμβόλαια είναι ανεπτυγμένος κώδικας + κατάσταση αποθηκευμένη μόνιμα on-chain, όχι αφαιρέσεις ή placeholders.
                            </p>
                            {/* Old confirm button removed; contractObserved now set via dropdown */}
                            {showContractDetails && labState.contractObserved && (
                                <div className="mt-4 p-4 border rounded bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-900 dark:text-indigo-300">
                                    <p>
                                        Αυτή η διεύθυνση αντιστοιχεί σε επαληθευμένο έξυπνο συμβόλαιο που έχει αναπτυχθεί στο Besu Edu‑Net.
                                    </p>
                                    <p className="mt-2">
                                        Η καρτέλα <strong>Code</strong> στον Block Explorer είναι η μοναδική πηγή αλήθειας
                                        για τη λογική του συμβολαίου.
                                    </p>
                                    <div className="mt-4 p-3 border rounded bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 font-mono">
                                        <p><strong>Διεύθυνση Συμβολαίου:</strong> {demoContractAddress}</p>
                                        <p><strong>Κατάσταση:</strong> Αναπτυγμένο ✅</p>
                                        <p><strong>Δίκτυο:</strong> Besu Edu‑Net</p>
                                        <p><strong>Gas που ξόδεψε ο μαθητής:</strong> 0 (παρατήρηση μόνο ανάγνωσης)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Ανάγνωση κατάστασης συμβολαίου (χωρίς συναλλαγή)
                            </h3>
                            <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-sm text-blue-900 dark:text-blue-200">
                                <div className="font-semibold mb-2">📖 ΑΝΑΓΝΩΣΗ (eth_call)</div>
                                <div className="flex flex-wrap gap-2 text-xs mb-2">
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">⛽ Gas: 0</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">✍️ Υπογραφή: Όχι</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">📦 Block: Όχι</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">🔁 Αλλαγή κατάστασης: Όχι</span>
                                </div>
                                <div>
                                    Θα διαβάσεις τη <strong>value()</strong> από το αναπτυγμένο συμβόλαιο στο
                                    <code className="font-mono ml-1">{demoContractAddress}</code>.
                                </div>
                            </div>
                            <div className="mt-3 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700 text-sm text-indigo-900 dark:text-indigo-200">
                                🔍 <strong>Συμβουλή Block Explorer:</strong> Ανοίξτε το συμβόλαιο στον Block Explorer και βρείτε τη
                                <span className="mx-1 px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 font-mono text-xs">value()</span>
                                συνάρτηση στην ενότητα <strong>Read Contract</strong>.
                                <br />
                                Αυτή η συνάρτηση υπάρχει επειδή η <code className="font-mono">value</code> έχει δηλωθεί ως <strong>public</strong> στη Solidity.
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">⛽ Gas: 0</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">✍️ Υπογραφή: Όχι</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">📦 Block: Όχι</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">🔁 Αλλαγή κατάστασης: Όχι</span>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        const contract = new Contract(demoContractAddress, counterAbi, provider);
                                        const value = await contract.value();
                                        recordAction(
                                            { stateRead: true, storedValue: Number(value) },
                                            "Η κατάσταση του συμβολαίου μπορεί να διαβαστεί ελεύθερα χωρίς συναλλαγή."
                                        );
                                    } catch (err) {
                                        alert("Αποτυχία ανάγνωσης κατάστασης συμβολαίου: " + (err?.message ?? err));
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                🔍 Ανάγνωση on-chain κατάστασης (χωρίς συναλλαγή, χωρίς gas)
                            </button>

                            {labState.stateRead && (
                                <div className="mt-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/40">
                                    <p className="text-sm font-semibold mb-2">
                                        ✅ Η κατάσταση του συμβολαίου διαβάστηκε επιτυχώς
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Κλήση συνάρτησης</div>
                                            <div className="font-mono">value()</div>
                                        </div>

                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Επιστρεφόμενη τιμή</div>
                                            <div className="font-mono text-lg font-bold">
                                                {labState.storedValue}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 p-3 rounded bg-green-100 dark:bg-green-900/30 text-sm text-green-900 dark:text-green-200 space-y-1">
                                        ✔ Εκτελέστηκε κλήση μόνο ανάγνωσης (<code className="font-mono">eth_call</code>)<br />
                                        ✔ Δεν δημιουργήθηκε συναλλαγή<br />
                                        ✔ Δεν καταναλώθηκε gas<br />
                                        ✔ Δεν απαιτήθηκε υπογραφή πορτοφολιού
                                    </div>
                                    <details className="mt-3">
                                        <summary className="cursor-pointer p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 text-sm text-yellow-900 dark:text-yellow-200 font-semibold">
                                            ⚠️ Συνηθισμένο λάθος — ασυμφωνία ABI (πατήστε για επέκταση)
                                        </summary>
                                        <div className="p-3 rounded-md border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-sm text-yellow-900 dark:text-yellow-200">
                                            Αν το ABI του frontend <strong>δεν</strong> ταιριάζει με το ανεπτυγμένο συμβόλαιο (π.χ. καλείτε <code className="font-mono">get()</code> αντί για <code className="font-mono">value()</code>), η EVM θα <strong>κάνει revert</strong> την κλήση.
                                            <div className="mt-2">Επαληθεύστε τα ονόματα συναρτήσεων απευθείας στον <strong>Block Explorer</strong>.</div>
                                        </div>
                                    </details>
                                </div>
                            )}
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                💡 Γι’ αυτό τα blockchains μπορούν να χρησιμοποιούνται ως δημόσιες βάσεις δεδομένων:
                                <strong> οποιοσδήποτε μπορεί να διαβάσει την κατάσταση, αλλά μόνο οι συναλλαγές μπορούν να την αλλάξουν.</strong>
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Εκτέλεση συνάρτησης συμβολαίου (συναλλαγή)
                            </h3>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2">
                                Αυτό το βήμα είναι διαθέσιμο αφού διαβάσετε την κατάσταση στο Βήμα 2.
                            </p>
                            {labState.stateRead && (
                                <div className="mb-3 inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 text-xs font-semibold">
                                    🔁 Μετάβαση: Ανάγνωση → Εγγραφή (απαιτείται gas)
                                </div>
                            )}
                            {/* Visual READ vs WRITE diagram */}
                            <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                                {/* READ */}
                                <div className="flex-1 p-4 rounded-xl border bg-blue-50 dark:bg-blue-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/50">
                                    <div className="text-3xl mb-2">📖</div>
                                    <div className="font-semibold text-sm mb-1">ΑΝΑΓΝΩΣΗ</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-300">
                                        eth_call · value()
                                    </div>
                                    <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs">
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">⛽ 0 gas</span>
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">✍️ χωρίς υπογραφή</span>
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">🔁 χωρίς αλλαγή</span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="text-3xl font-bold text-slate-400 dark:text-slate-500">
                                    ➜
                                </div>

                                {/* WRITE */}
                                <div className="flex-1 p-4 rounded-xl border bg-yellow-50 dark:bg-yellow-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/50">
                                    <div className="text-3xl mb-2">✍️</div>
                                    <div className="font-semibold text-sm mb-1">ΕΓΓΡΑΦΗ</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-300">
                                        συναλλαγή · increment()
                                    </div>
                                    <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs">
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">⛽ gas</span>
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">✍️ υπογραφή</span>
                                        <span className="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/30 border">🔁 αλλαγή κατάστασης</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border text-sm text-slate-700 dark:text-slate-300 mb-4">
                                <p className="font-semibold mb-1">Συνάρτηση προς εκτέλεση:</p>
                                <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border inline-block">
                                    increment()
                                </div>
                                <p className="mt-2">
                                    Αυτή η συνάρτηση ενημερώνει τον εσωτερικό μετρητή του συμβολαίου κατά <strong>+1</strong>.
                                </p>
                            </div>

                            {/* Step 3 warning if state not read */}
                            {!labState.stateRead && (
                                <div className="mb-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 text-sm font-semibold">
                                    ⚠️ Πρέπει να διαβάσετε την κατάσταση στο Βήμα 2 πριν εκτελέσετε συναλλαγή.
                                </div>
                            )}

                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        const signer = await provider.getSigner();
                                        const contract = new Contract(demoContractAddress, counterAbi, signer);
                                        const tx = await contract.increment();
                                        recordAction(
                                            {
                                                txPrepared: true,
                                                txHash: tx.hash,
                                            },
                                            "Η εκτέλεση συνάρτησης συμβολαίου απαιτεί υπογεγραμμένη συναλλαγή και gas."
                                        );
                                        await tx.wait();
                                    } catch (err) {
                                        alert("Η συναλλαγή απορρίφθηκε ή απέτυχε: " + (err?.message ?? err));
                                    }
                                }}
                                disabled={!labState.stateRead}
                                className={`px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold${!labState.stateRead ? " opacity-50 cursor-not-allowed" : ""}`}
                            >
                                🚀 Εκτέλεση increment() μέσω συναλλαγής
                            </button>

                            <div className="mt-3 p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-sm">
                                💧 Χρειάζεστε κεφάλαια για να στείλετε αυτή τη συναλλαγή;
                                <a
                                    href="https://faucet.dimikog.org/"
                                    target="_blank" rel="noopener noreferrer"
                                    className="ml-1 font-semibold text-indigo-700 dark:text-indigo-300 hover:underline"
                                >
                                    Ανοίξτε το Faucet του Besu Edu‑Net
                                </a>
                            </div>

                            {labState.txPrepared && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-green-100 dark:bg-green-900/30 text-sm text-green-900 dark:text-green-200 animate-fade-in">
                                    <p className="font-semibold mb-2">✅ Η συναλλαγή υποβλήθηκε και εξορύχθηκε. Η κατάσταση μπορεί πλέον να ξαναδιαβαστεί.</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Συμμετείχε πορτοφόλι</li>
                                        <li>Απαιτήθηκε gas</li>
                                        <li>Η συναλλαγή συμπεριλήφθηκε σε block</li>
                                    </ul>
                                    <div className="mt-2 font-mono text-xs break-all">
                                        Hash συναλλαγής: {labState.txHash}
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                        👉 Προχωρήστε στο Βήμα 4 για να διαβάσετε την ενημερωμένη κατάσταση.
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                💡 Μέχρι να εξορυχθεί αυτή η συναλλαγή, η κατάσταση του συμβολαίου <strong>δεν έχει αλλάξει ακόμα</strong>.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                4️⃣ Παρατηρήστε την ενημερωμένη κατάσταση του συμβολαίου
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Αφού η συναλλαγή συμπεριληφθεί σε block,
                                η κατάσταση του συμβολαίου ενημερώνεται μόνιμα.
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        const contract = new Contract(demoContractAddress, counterAbi, provider);
                                        const value = await contract.value();
                                        recordAction(
                                            {
                                                stateUpdated: true,
                                                updatedValue: Number(value),
                                                explanationUnlocked: true,
                                            },
                                            "Οι αλλαγές στην κατάσταση του έξυπνου συμβολαίου παραμένουν μετά την εκτέλεση."
                                        );
                                    } catch (err) {
                                        alert("Αποτυχία ανάγνωσης ενημερωμένης κατάστασης: " + (err?.message ?? err));
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Ανάγνωση ενημερωμένης on-chain κατάστασης
                            </button>

                            {labState.stateUpdated && (
                                <div className="mt-3 text-sm font-mono animate-fade-in">
                                    Ενημερωμένη τιμή: {labState.updatedValue}
                                </div>
                            )}
                            {/* Read-Before / Read-After comparison box */}
                            {labState.stateUpdated && (
                                <div className="mt-4 p-4 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30">
                                    <h4 className="font-semibold mb-3 text-indigo-900 dark:text-indigo-200">
                                        🔍 Σύγκριση πριν/μετά την ανάγνωση
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Πριν τη συναλλαγή (Βήμα 2)</div>
                                            <div className="mt-1 font-mono text-lg font-bold">
                                                {labState.storedValue}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Μετά τη συναλλαγή (Βήμα 4)</div>
                                            <div className="mt-1 font-mono text-lg font-bold text-green-700 dark:text-green-300">
                                                {labState.updatedValue}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-indigo-800 dark:text-indigo-300">
                                        Η διαφορά αποδεικνύει ότι μια <strong>συναλλαγή</strong> (Βήμα 3) τροποποίησε μόνιμα την κατάσταση on-chain.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border p-5 bg-white/70 dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Ανακαλυφθέντα Δεδομένα</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Δεν υπάρχουν ακόμα ανακαλύψεις — ολοκληρώστε τα βήματα για να ξεκλειδώσετε συμπεράσματα.
                        </p>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/40 border rounded-md p-3">
                            <p className="text-sm mb-2">
                                Να τι αποδείξατε (αλληλεπιδρώντας με το πραγματικό συμβόλαιο):
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {labState.discoveredData.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* 🧠 Explanation */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-300 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="text-xl font-semibold mb-2">🧠 Εξήγηση</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Τα έξυπνα συμβόλαια είναι ανεπτυγμένος κώδικας + κατάσταση αποθηκευμένη on-chain.</li>
                            <li>Οι κλήσεις μόνο ανάγνωσης (<code className="font-mono">eth_call</code>) δεν δημιουργούν συναλλαγές και δεν κοστίζουν gas.</li>
                            <li>Η εκτέλεση συνάρτησης συμβολαίου απαιτεί υπογεγραμμένη συναλλαγή και gas.</li>
                            <li>Οι αλλαγές κατάστασης γίνονται μόνιμες μόνο μετά τη συμπερίληψη σε block.</li>
                        </ul>
                        <p className="mt-4 font-semibold text-indigo-900 dark:text-indigo-200">
                            <em>Μοτίβο για να θυμάστε: ανάγνωση → εγγραφή → ανάγνωση.</em>
                        </p>
                    </section>
                )}

                {/* 🎉 Completion & Claim Reward */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-green-300 dark:border-green-700 p-6 bg-green-50 dark:bg-green-900/20 mt-8">
                        <h2 className="text-xl font-semibold mb-2">🎉 Ολοκλήρωση εργαστηρίου</h2>
                        <p className="mb-4 text-slate-700 dark:text-slate-200">
                            Ολοκληρώσατε αυτό το εργαστήριο! Μπορείτε τώρα να επιστρέψετε στην επισκόπηση του εργαστηρίου για να διεκδικήσετε τις ανταμοιβές σας και να παρακολουθήσετε την πρόοδό σας.
                        </p>
                        <a
                            href="/#/labs-gr/lab05"
                            className="inline-block px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                        >
                            ← Επιστροφή στην επισκόπηση &amp; διεκδίκηση ανταμοιβής
                        </a>
                    </section>
                )}

                {/* 🔁 Utilities */}
                <section className="flex items-center justify-between pt-6 border-t">
                    <button
                        onClick={resetLab}
                        disabled={!canReset}
                        className={`text-sm ${canReset
                            ? "text-slate-700 dark:text-slate-200 hover:underline"
                            : "text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        🔁 Επαναφορά εργαστηρίου
                    </button>
                </section>

            </div>
        </PageShell>
    );
};

export default Lab05InteractionGR;
