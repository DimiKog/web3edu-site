import { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import PageShell from "../../components/PageShell";
import "../../styles/animations.css";

const initialLab04State = {
    currentStep: 1,
    lastAction: null,

    preStateObserved: false,
    preState: {
        balance: null,
        nonce: null,
    },

    wallet: {
        connected: false,
        address: null,
        network: null,
        isCorrectNetwork: false,
    },

    txExplored: false,
    txFields: {
        from: "",
        to: "",
        value: "",
        gasLimit: "",
        gasPrice: "",
        nonce: "",
    },

    gasConceptUnderstood: false,

    postStateObserved: false,
    postState: {
        balance: null,
        nonce: null,
    },

    // Προσθήκες βήματος faucet/πραγματικής συναλλαγής
    txSent: false,
    txHash: "",
    postTxChecked: false,

    discoveredData: [],
    explanationUnlocked: false,
};

const EXAMPLE_TX_HASH = "0x01c6e6afeb02082edb538dc24f2157090381d175bef6354bbf8c54c8b349fdfe";
const EXAMPLE_TX_DETAILS = {
    from: "0x7e81C3B018e6c471eeFf5dEE7483bc32bF8635C4",
    to: "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E",
    value: "1 ETH",
    gasPrice: "1 Gwei",
    gasLimit: "21,000",
    gasUsed: "21,000 (100%)",
    nonce: "99",
    block: "3121417",
    status: "Επιτυχία",
};
const BLOCK_EXPLORER_TX_URL = "https://blockexplorer.dimikog.org/tx/" + EXAMPLE_TX_HASH;

const Lab04InteractionGR = () => {
    const [labState, setLabState] = useState(initialLab04State);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleConnectAndFetchState = async () => {
        if (!window.ethereum) {
            alert("Δεν εντοπίστηκε το MetaMask");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            // Υποστηριζόμενα chain IDs για το Besu Edu-Net
            const BESU_CHAIN_IDS = [424242];

            const networkName =
                network.name && network.name !== "unknown"
                    ? network.name
                    : `Besu Edu-Net (Chain ID ${chainId})`;
            const isBesuEduNet = BESU_CHAIN_IDS.includes(chainId);

            const balanceWei = await provider.getBalance(address);
            const nonce = await provider.getTransactionCount(address);

            setLabState((s) => ({
                ...s,
                preStateObserved: true,
                wallet: {
                    connected: true,
                    address,
                    network: networkName,
                    isCorrectNetwork: isBesuEduNet,
                },
                preState: {
                    balance: `${formatEther(balanceWei)} ETH`,
                    nonce: nonce.toString(),
                },
                lastAction: "Η ζωντανή κατάσταση πριν τη συναλλαγή ανακτήθηκε από το πορτοφόλι",
                discoveredData: [
                    ...s.discoveredData,
                    "Τα πορτοφόλια αποκαλύπτουν ζωντανή on‑chain κατάσταση (υπόλοιπο και nonce) χωρίς να δημιουργούν συναλλαγή.",
                ],
            }));
        } catch (err) {
            console.error("Wallet connection failed", err);
            alert("Αποτυχία σύνδεσης πορτοφολιού ή ανάκτησης κατάστασης");
        }
    };

    // Έλεγχος μετά τη συναλλαγή faucet
    const handlePostTransactionCheck = async () => {
        if (!window.ethereum) {
            alert("Δεν εντοπίστηκε το MetaMask");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const balanceWei = await provider.getBalance(address);
            const newBalance = parseFloat(formatEther(balanceWei));

            const prevBalance = parseFloat(
                (labState.preState.balance || "0").replace("ETH", "").trim()
            );

            if (newBalance <= prevBalance) {
                alert("Το υπόλοιπο δεν αυξήθηκε. Ολοκλήρωσε πρώτα τη συναλλαγή από το faucet.");
                return;
            }

            setLabState((s) => ({
                ...s,
                postTxChecked: true,
                postStateObserved: true,
                postState: {
                    balance: `${newBalance} ETH`,
                    nonce: s.preState.nonce, // αμετάβλητο
                },
                lastAction: "Επιβεβαιώθηκε αύξηση υπολοίπου μετά τη συναλλαγή faucet",
                discoveredData: [
                    ...s.discoveredData,
                    "Η λήψη κεφαλαίων αυξάνει το υπόλοιπο αλλά δεν αλλάζει το nonce.",
                ],
            }));
        } catch (err) {
            console.error("Post-tx check failed", err);
            alert("Αποτυχία επανελέγχου υπολοίπου και nonce");
        }
    };

    const handleResetLab = () => {
        setLabState({ ...initialLab04State, lastAction: null });
    };

    const canResetLab =
        labState.preStateObserved ||
        labState.txExplored ||
        labState.gasConceptUnderstood ||
        labState.postStateObserved ||
        labState.discoveredData.length > 0;

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Στόχος */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 04 — Συναλλαγές & Gas
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Εξερεύνησε πώς οι συναλλαγές στο blockchain αλλάζουν την on‑chain κατάσταση
                        και γιατί απαιτείται gas για την εκτέλεση.
                    </p>
                </section>

                {/* 🧭 Τρέχουσα Κατάσταση */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    {labState.lastAction && (
                        <div
                            className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold animate-fadeIn"
                            key={labState.lastAction}
                        >
                            ✅ {labState.lastAction}
                        </div>
                    )}
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>
                            Παρατήρηση προ-συναλλακτικής κατάστασης:
                            {labState.preStateObserved ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Εξερεύνηση δομής συναλλαγής:
                            {labState.txExplored ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Κατανόηση της έννοιας του gas:
                            {labState.gasConceptUnderstood ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Παρατήρηση μετα-συναλλακτικής κατάστασης:
                            {labState.postStateObserved ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Ολοκληρώθηκε πραγματική αλληλεπίδραση με blockchain:
                            {labState.postTxChecked ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                    </ul>
                </section>

                {/* 🎛 Διαθέσιμες Ενέργειες */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    <div className="space-y-6">

                        {/* Ενέργεια 1 — Παρατήρηση προ-κατάστασης */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Παρατήρηση Προ-Συναλλακτικής Κατάστασης (Πριν Συμβεί Οτιδήποτε)
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Ακόμα και πριν στείλεις συναλλαγή, το πορτοφόλι σου έχει ήδη <strong>on‑chain κατάσταση</strong>.
                                Αυτή η κατάσταση υπάρχει ανεξάρτητα από οποιαδήποτε ενέργεια κάνεις τώρα.
                            </p>

                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-4 space-y-1">
                                <li><strong>Υπόλοιπο</strong>: πόσα ETH διαθέτει ο λογαριασμός</li>
                                <li><strong>Nonce</strong>: πόσες συναλλαγές έχει ήδη στείλει ο λογαριασμός</li>
                            </ul>

                            <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                                text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                                🔎 Σε αυτό το στάδιο, <strong>δεν υπάρχει ακόμη συναλλαγή</strong>.
                                Παρατηρείς μόνο την υπάρχουσα κατάσταση του blockchain.
                            </div>

                            <button
                                onClick={handleConnectAndFetchState}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                🔌 Σύνδεση Πορτοφολιού & Παρατήρηση Κατάστασης
                            </button>

                            {labState.preStateObserved && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="text-sm font-semibold mb-2">✅ Παρατηρήθηκε Προ-Συναλλακτική Κατάσταση</p>
                                    {/* Προειδοποίηση δικτύου */}
                                    {!labState.wallet.isCorrectNetwork && (
                                        <div className="mb-3 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                                            text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                            ⚠️ Μετάβαλε στο <strong>Besu Edu‑Net</strong> για να συνεχίσεις.
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Υπόλοιπο</div>
                                            <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                {labState.preState.balance}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Nonce</div>
                                            <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                {labState.preState.nonce}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 break-all">
                                        Διεύθυνση πορτοφολιού: <span className="font-mono">{labState.wallet.address}</span><br />
                                        Δίκτυο: <strong>{labState.wallet.network}</strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 2 — Εξερεύνηση συναλλαγής */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Εξερεύνηση Δομής Συναλλαγής
                            </h3>
                            <div className="mb-6 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                                        Παράδειγμα Συναλλαγής
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                                        Μεταφορά Αξίας
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">Από</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            0x7e81C3B018e6c471eeFf5dEE7483bc32bF8635C4
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-indigo-600 dark:text-indigo-300 text-lg animate-bounce">
                                        ↓
                                    </div>

                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">Προς</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                        Ποσό που Στάλθηκε
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold">
                                        1 ETH <span className="opacity-80">(EDU‑D)</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Αυτή η συναλλαγή παραδείγματος μεταφέρει <strong>1 EDU‑D</strong> (εμφανίζεται ως ETH στον block explorer)
                                από μια διεύθυνση σε μια άλλη. Πρόκειται για απλή μεταφορά αξίας χωρίς εκτέλεση smart contract.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Σημείωση: Ο explorer εμφανίζει ETH, αλλά το asset είναι EDU-D στο Besu Edu-Net.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Μια συναλλαγή είναι ένα υπογεγραμμένο μήνυμα που περιλαμβάνει συγκεκριμένα πεδία.
                            </p>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        txExplored: true,
                                        lastAction: "Εξετάστηκε η δομή πραγματικής συναλλαγής",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Οι συναλλαγές είναι υπογεγραμμένες δομές δεδομένων με συγκεκριμένα πεδία που ορίζουν τη μεταφορά αξίας, το κόστος εκτέλεσης και τη σειρά.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Επιθεώρηση πραγματικής συναλλαγής
                            </button>

                            {labState.txExplored && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                                    <p className="text-sm font-semibold">🔍 Παράδειγμα Πραγματικής Συναλλαγής</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div><strong>Status:</strong> {EXAMPLE_TX_DETAILS.status}</div>
                                        <div><strong>Block:</strong> {EXAMPLE_TX_DETAILS.block}</div>
                                        <div><strong>From:</strong> <span className="font-mono break-all">{EXAMPLE_TX_DETAILS.from}</span></div>
                                        <div><strong>To:</strong> <span className="font-mono break-all">{EXAMPLE_TX_DETAILS.to}</span></div>
                                        <div><strong>Value:</strong> {EXAMPLE_TX_DETAILS.value}</div>
                                        <div><strong>Nonce:</strong> {EXAMPLE_TX_DETAILS.nonce}</div>
                                        <div><strong>Gas Limit:</strong> {EXAMPLE_TX_DETAILS.gasLimit}</div>
                                        <div><strong>Gas Used:</strong> {EXAMPLE_TX_DETAILS.gasUsed}</div>
                                        <div><strong>Gas Price:</strong> {EXAMPLE_TX_DETAILS.gasPrice}</div>
                                    </div>

                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-4">
                                        Hash συναλλαγής:
                                        <div className="font-mono break-all mt-1">{EXAMPLE_TX_HASH}</div>
                                    </div>

                                    <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">from</span>
                                            : διεύθυνση αποστολέα (όποιος πλήρωσε gas και ξεκίνησε την αλλαγή κατάστασης)
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">to</span>
                                            : διεύθυνση παραλήπτη ή contract
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">value</span>
                                            : ETH που μεταφέρθηκε
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">nonce</span>
                                            : μετρητής συναλλαγών αποστολέα
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasLimit</span>
                                            : μέγιστη επιτρεπόμενη υπολογιστική προσπάθεια
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasUsed</span>
                                            : υπολογιστική προσπάθεια που καταναλώθηκε
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasPrice</span>
                                            : τιμή ανά μονάδα gas
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">status</span>
                                            : επιτυχία ή αποτυχία
                                        </li>
                                    </ul>
                                    <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                                        👀 Εντόπισε κάθε πεδίο στον block explorer και επιβεβαίωσε ότι ταιριάζει με τις τιμές παραπάνω.
                                    </div>
                                    <div className="mt-2 text-xs text-indigo-700 dark:text-indigo-300">
                                        <span className="font-semibold">Συμβουλή:</span> Κάθε <span className="inline-block px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">πεδίο</span> είναι κρίσιμο — κάνε hover ή click σε explorers για να δεις πραγματικές τιμές.
                                    </div>

                                    <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-sm text-indigo-800 dark:text-indigo-300">
                                        Κάθε πεδίο που βλέπεις παραπάνω αποτελεί μέρος του υπογεγραμμένου payload της συναλλαγής.
                                        Αν αλλάξει οποιοδήποτε πεδίο, η υπογραφή καθίσταται άκυρη.
                                    </div>

                                    <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-sm text-yellow-800 dark:text-yellow-300">
                                        🔎 Άνοιξε τον explorer και επιβεβαίωσε χειροκίνητα ότι κάθε τιμή παραπάνω ταιριάζει με την on‑chain συναλλαγή.
                                    </div>

                                    <a
                                        href={BLOCK_EXPLORER_TX_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        🔗 Δες αυτή τη συναλλαγή στον Block Explorer
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 3 — Gas */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Κατανόηση Gas & Εκτέλεσης
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Το gas περιορίζει την υπολογιστική προσπάθεια και αποτρέπει την κατάχρηση του δικτύου.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Από τη συναλλαγή του προηγούμενου βήματος βλέπουμε ότι:
                            </p>

                            {/* Σύνοψη gas από πραγματική συναλλαγή */}
                            <div className="mb-4 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-xs text-slate-700 dark:text-indigo-200">
                                <div className="font-semibold mb-1">Gas & Εκτέλεση σε Πραγματική Συναλλαγή:</div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    <div>
                                        <span className="font-semibold">Όριο Gas:</span> {EXAMPLE_TX_DETAILS.gasLimit}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gas που Χρησιμοποιήθηκε:</span> {EXAMPLE_TX_DETAILS.gasUsed}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Τιμή Gas:</span> {EXAMPLE_TX_DETAILS.gasPrice}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Κατάσταση:</span> {EXAMPLE_TX_DETAILS.status}
                                    </div>
                                </div>
                            </div>

                            {/* Μετατροπές μονάδων: Wei / Gwei / ETH */}
                            <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
                                <p className="text-sm font-semibold mb-2">
                                    📏 Μονάδες Gas — Wei, Gwei & ETH
                                </p>

                                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                                    <li><strong>1 ETH</strong> = 1,000,000,000 Gwei</li>
                                    <li><strong>1 Gwei</strong> = 0.000000001 ETH</li>
                                    <li><strong>Η τιμή gas</strong> εκφράζεται πάντα σε Gwei</li>
                                </ul>

                                <div className="mt-3 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30
                                                font-mono font-bold text-base text-indigo-900 dark:text-indigo-200">
                                    21,000 × 1 Gwei = 21,000 × 0.000000001 ETH = 0.000021 ETH
                                </div>

                                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                    Αυτό είναι το <strong>ακριβές τέλος</strong> που πλήρωσε ο αποστολέας για τη συναλλαγή που είδες παραπάνω.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        gasConceptUnderstood: true,
                                        lastAction: "Η έννοια του gas επιβεβαιώθηκε",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Το gas απαιτείται για την πληρωμή της υπολογιστικής προσπάθειας· το gas limit θέτει το μέγιστο επιτρεπόμενο έργο και το gas price καθορίζει το τέλος. Αν το gas εξαντληθεί, η συναλλαγή αποτυγχάνει αλλά τα τέλη καταναλώνονται.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Επιβεβαίωση κατανόησης gas
                            </button>

                            {labState.gasConceptUnderstood && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="text-sm font-semibold mb-2">✅ Το Gas Εξηγήθηκε (με πραγματικές τιμές)</p>
                                    <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>
                                            Το όριο gas ήταν <strong>{EXAMPLE_TX_DETAILS.gasLimit}</strong> — ακριβώς αρκετό για μια απλή μεταφορά ETH.
                                        </li>
                                        <li>
                                            Το gas που χρησιμοποιήθηκε ήταν <strong>{EXAMPLE_TX_DETAILS.gasUsed}</strong>, δηλαδή καταναλώθηκε όλο το επιτρεπόμενο έργο.
                                        </li>
                                        <li>
                                            Η τιμή gas ήταν <strong>{EXAMPLE_TX_DETAILS.gasPrice}</strong>, η οποία καθόρισε το τέλος της συναλλαγής.
                                        </li>
                                        <li>
                                            Κατάσταση συναλλαγής: <strong>{EXAMPLE_TX_DETAILS.status}</strong>.
                                        </li>
                                    </ul>
                                    <div className="mt-3 text-lg font-bold text-indigo-900 dark:text-indigo-200">
                                        Το τέλος που πληρώθηκε = gasUsed × gasPrice
                                    </div>
                                    <div className="mt-1 text-xl font-mono font-bold">
                                        21,000 × 1 Gwei = 0.000021 ETH
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 4 — Μετα-κατάσταση */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                4️⃣ Παρατήρηση Μετα-Συναλλακτικής Κατάστασης
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Μετά την εκτέλεση μιας αποστολής, τα υπόλοιπα και τα nonces αλλάζουν μόνιμα.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Αυτή η μετα-κατάσταση αναφέρεται σε συναλλαγή όπου ο λογαριασμός <strong>ΣΤΕΛΝΕΙ 1 EDU-D</strong>.
                                <strong>Δεν</strong> αναφέρεται στη συναλλαγή faucet όπου λαμβάνονται κεφάλαια.
                            </p>
                            <div className="mb-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                ⚠️ Σημαντικό: Το Βήμα 4 αναλύει συναλλαγή <strong>αποστολής</strong> (όπως στο Βήμα 2).
                                <strong>Δεν</strong> περιγράφει τη συναλλαγή faucet του Βήματος 5.
                            </div>

                            {/* Οπτικοποίηση συναλλαγής (premium box, πριν τον πίνακα και το κουμπί) */}
                            <div className="mb-6 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                                        Συναλλαγή Αποστολής (Ενδεικτική)
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                                        Αλλαγή Κατάστασης
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">Από</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            Η διεύθυνσή σου (αποστολέας)
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-indigo-600 dark:text-indigo-300 text-lg">
                                        ↓
                                    </div>

                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">Προς</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            Μια άλλη διεύθυνση (παραλήπτης)
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                        Ποσό που Στάλθηκε
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold">
                                        1 ETH <span className="opacity-80">(EDU‑D)</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        postStateObserved: true,
                                        explanationUnlocked: true,
                                        lastAction: "Παρατηρήθηκε μετα-συναλλακτική κατάσταση",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Όταν ένας λογαριασμός στέλνει συναλλαγή, το υπόλοιπό του μειώνεται (αξία + τέλος) και το nonce αυξάνεται κατά 1. Αυτό δείχνει μια μόνιμη αλλαγή on‑chain κατάστασης.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Σήμανση παρατήρησης μετα-κατάστασης
                            </button>

                            {labState.postStateObserved && (() => {
                                // 🔬 Ενδεικτικές τιμές παραδείγματος (ΟΧΙ του πορτοφολιού του φοιτητή)
                                const examplePreBalance = 10;
                                const examplePreNonce = 20;
                                const exampleValue = 1;
                                const exampleFee = 0.000021;

                                const examplePostBalance = (
                                    examplePreBalance - exampleValue - exampleFee
                                ).toFixed(6);
                                const examplePostNonce = examplePreNonce + 1;

                                return (
                                    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                        <p className="text-sm font-semibold mb-2">
                                            ✅ Παρατηρήθηκε Μετα-Συναλλακτική Κατάσταση (Ενδεικτικό Παράδειγμα)
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Προ-Κατάσταση (Πριν την Αποστολή)
                                                </div>
                                                <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                    Υπόλοιπο: {examplePreBalance} ETH<br />
                                                    Nonce: {examplePreNonce}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Μετα-Κατάσταση (Μετά την Αποστολή)
                                                </div>
                                                <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                    Υπόλοιπο: {examplePostBalance} ETH<br />
                                                    Nonce: {examplePostNonce}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Premium μπλοκ μαθηματικών/διδασκαλίας */}
                                        <div className="mt-4 p-5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 space-y-3 transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
                                            <p className="text-lg font-bold text-indigo-900 dark:text-indigo-200">
                                                Μετάβαση Κατάστασης (Αποστολή 1 EDU‑D)
                                            </p>

                                            <ul className="list-disc list-inside text-base font-semibold text-indigo-900 dark:text-indigo-200">
                                                <li>Το υπόλοιπο μειώνεται κατά <strong>αξία + τέλος gas</strong></li>
                                                <li>Το nonce αυξάνεται κατά <strong>1</strong></li>
                                            </ul>

                                            <div className="mt-3 space-y-1 text-lg font-mono font-bold">
                                                <div>
                                                    postBalance = 10 − 1 − 0.000021 = <span className="text-indigo-700 dark:text-indigo-300">8.999979 ETH</span>
                                                </div>
                                                <div>
                                                    postNonce = 20 + 1 = <span className="text-indigo-700 dark:text-indigo-300">21</span>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-sm text-indigo-800 dark:text-indigo-300">
                                                📘 Αυτό είναι <strong>ενδεικτικό παράδειγμα</strong>. Η πραγματική σου κατάσταση επιβεβαιώνεται στο Βήμα 5.
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Ενέργεια 5 — Πραγματική συναλλαγή */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                5️⃣ Πραγματική Συναλλαγή (Faucet)
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Για να αποδείξεις ότι κατανοείς πλήρως τις συναλλαγές, θα κάνεις τώρα μια πραγματική on‑chain ενέργεια.
                                Θα ζητήσεις κεφάλαια από το faucet και έπειτα θα επιβεβαιώσεις ότι η on‑chain κατάσταση άλλαξε.
                            </p>

                            <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                        text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                                💡 Χρησιμοποίησε το faucet για να στείλεις ETH στο πορτοφόλι σου.
                                Αυτό δημιουργεί μια πραγματική συναλλαγή στο blockchain που καταναλώνει gas.
                                Το nonce σου ΔΕΝ θα αυξηθεί επειδή ο λογαριασμός σου ΛΑΜΒΑΝΕΙ κεφάλαια.
                            </div>

                            <div className="mt-3 p-3 rounded-md bg-blue-100 dark:bg-blue-900/40
  text-blue-800 dark:text-blue-300 text-sm">
                                ℹ️ <strong>Σημαντικό:</strong> Η λήψη κεφαλαίων <strong>δεν</strong> αυξάνει το nonce.
                                Το nonce αυξάνεται μόνο όταν <strong>ο λογαριασμός σου στέλνει</strong> συναλλαγή.
                            </div>

                            <a
                                href="https://faucet.dimikog.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                💧 Άνοιγμα Faucet (Νέα Καρτέλα)
                            </a>

                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                Μετά την επιβεβαίωση της συναλλαγής από το faucet:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Το <strong>υπόλοιπό</strong> σου θα αυξηθεί</li>
                                </ul>
                            </div>

                            <button
                                onClick={handlePostTransactionCheck}
                                className="mt-4 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                🔄 Επανέλεγχος Υπολοίπου & Nonce Μετά τη Συναλλαγή
                            </button>

                            {labState.postTxChecked && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 animate-fadeIn">
                                    <p className="text-sm font-semibold mb-2">
                                        ✅ Η Πραγματική Συναλλαγή Επιβεβαιώθηκε
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Υπόλοιπο (Μετά)</div>
                                            <div className="font-mono text-sm">{labState.postState.balance}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🧠 Μίνι Ανακεφαλαίωση — Αποστολέας vs Παραλήπτης */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-3">🧠 Μίνι Ανακεφαλαίωση — Αποστολέας vs Παραλήπτης</h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Χρησιμοποίησε αυτόν τον πίνακα για να συνοψίσεις όσα παρατήρησες στα προηγούμενα βήματα.
                        Οι παρακάτω κανόνες ισχύουν πάντα σε Ethereum‑based blockchains.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                            <h3 className="font-semibold mb-2">📤 Όταν ένας λογαριασμός ΣΤΕΛΝΕΙ συναλλαγή</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Το υπόλοιπο <strong>μειώνεται</strong> (αξία + τέλος gas)</li>
                                <li>Το nonce <strong>αυξάνεται κατά 1</strong></li>
                                <li>Το gas πληρώνεται από τον αποστολέα</li>
                                <li>Η αλλαγή κατάστασης ξεκινά από αυτόν τον λογαριασμό</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                            <h3 className="font-semibold mb-2">📥 Όταν ένας λογαριασμός ΛΑΜΒΑΝΕΙ συναλλαγή</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Το υπόλοιπο <strong>αυξάνεται</strong></li>
                                <li>Το nonce <strong>ΔΕΝ αλλάζει</strong></li>
                                <li>Δεν πληρώνεται gas από τον παραλήπτη</li>
                                <li>Δεν ξεκινά αλλαγή κατάστασης από αυτόν τον λογαριασμό</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-sm text-indigo-800 dark:text-indigo-300">
                        💡 <strong>Κύριο συμπέρασμα:</strong> Μόνο ο <strong>αποστολέας</strong> μιας συναλλαγής πληρώνει gas και αυξάνει το nonce του.
                        Η λήψη κεφαλαίων δεν αλλάζει ποτέ το nonce.
                    </div>

                    {/* Μίνι κουίζ */}
                    <div className="mt-6 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold mb-2">🧪 Γρήγορος Έλεγχος</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Όταν <strong>λαμβάνεις κεφάλαια</strong> από το faucet, θα αυξηθεί το <strong>nonce</strong> σου;
                        </p>
                        <select
                            className="w-full max-w-xs px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                   bg-white dark:bg-slate-900 text-sm"
                            onChange={(e) => {
                                const correct = e.target.value === "no";
                                alert(
                                    correct
                                        ? "✅ Σωστά! Η λήψη κεφαλαίων ΔΕΝ αλλάζει το nonce."
                                        : "❌ Όχι ακριβώς. Το nonce αυξάνεται μόνο όταν ΕΣΥ στέλνεις συναλλαγή."
                                );
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Επίλεξε απάντηση…</option>
                            <option value="yes">Ναι</option>
                            <option value="no">Όχι</option>
                        </select>
                    </div>
                </section>

                {/* 🔍 Ανακαλυφθέντα Δεδομένα */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Ανακαλυφθέντα Δεδομένα</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Καμία ανακάλυψη ακόμα — ολοκλήρωσε τα βήματα παραπάνω για να ξεκλειδώσεις βασικές γνώσεις.
                        </p>
                    ) : (
                        <>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Αυτοί είναι οι βασικοί κανόνες και οι παρατηρήσεις που ανακάλυψες κατά τη διάρκεια του εργαστηρίου.
                            </div>
                            <ul className="list-disc list-inside text-sm space-y-1 animate-fadeIn">
                                {labState.discoveredData.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>

                {/* 🧠 Επεξήγηση */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-white/80 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-2">🧠 Επεξήγηση</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Οι συναλλαγές είναι ο <strong>μοναδικός μηχανισμός</strong> που μπορεί να αλλάξει την κατάσταση του blockchain.</li>
                            <li>Ο <strong>αποστολέας</strong> πληρώνει gas και αυξάνει το nonce του.</li>
                            <li>Ο <strong>παραλήπτης</strong> δεν πληρώνει gas και δεν αλλάζει ποτέ το nonce.</li>
                            <li>Οι μεταβολές υπολοίπου εξαρτώνται από την <strong>κατεύθυνση</strong> (αποστολή vs λήψη).</li>
                            <li>Όλες οι αλλαγές κατάστασης γίνονται μόνιμες μόνο μετά την <strong>ένταξη σε block</strong>.</li>
                        </ul>
                    </section>
                )}

                {/* 🎁 Ολοκλήρωση & Επιστροφή */}
                {labState.postTxChecked && (
                    <section className="rounded-xl border border-white/80 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-6">
                        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            🎉 Το Lab Ολοκληρώθηκε
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 mb-4">
                            Ολοκλήρωσες το <strong>Lab 04 — Συναλλαγές &amp; Gas</strong>.
                            Επέστρεψε στη σύνοψη εργαστηρίων για να το σημειώσεις ως ολοκληρωμένο και να λάβεις τα rewards σου.
                        </p>
                        <a
                            href="/#/labs-gr/lab04"
                            className="inline-block px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                        >
                            ⬅ Επιστροφή στη Σύνοψη Εργαστηρίου &amp; Λήψη Rewards
                        </a>
                    </section>
                )}

                {/* 🔁 Βοηθητικά */}
                <section className="flex items-center justify-between pt-6 border-t border-white/80 dark:border-slate-700">
                    <button
                        onClick={handleResetLab}
                        disabled={!canResetLab}
                        className={`text-sm ${canResetLab
                            ? "text-slate-700 dark:text-slate-200 hover:underline"
                            : "text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        🔁 Επαναφορά Εργαστηρίου
                    </button>

                    <a
                        href="https://github.com/DimiKog/web3edu-labs/tree/main/lab-04-transactions-gas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                    >
                        📚 Προβολή Λεπτομερειών (GitHub)
                    </a>
                </section>

            </div>
        </PageShell>
    );
};

export default Lab04InteractionGR;
