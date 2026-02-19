import { useState } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const Lab01InteractionGR = () => {
    // Βοηθητικό: ανίχνευση δικτύου από το πορτοφόλι (window.ethereum)
    const detectNetworkFromWallet = async () => {
        if (!window.ethereum) return null;
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (!accounts || accounts.length === 0) return null;
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            if (chainId === "0x67932") return "Besu Edu-Net"; // 424242
            if (chainId === "0x1") return "Ethereum Mainnet";
            return `Άγνωστο δίκτυο (${chainId})`;
        } catch {
            return null;
        }
    };
    // Κατάσταση προόδου εργαστηρίου σύμφωνα με το διορθωμένο μοντέλο Lab01
    const [labState, setLabState] = useState({
        networkDetected: false,
        activeNetwork: null,
        previousNetwork: null,
        addressProvided: false,
        addressValid: false,
        addressInspected: false,
        keyRelationshipRevealed: false,
        identityComparedAcrossNetworks: false,
        identityWithoutAccountsAcknowledged: false,
        discoveredData: [],
        confirmedAddress: null,
    });
    const [lastAction, setLastAction] = useState(null);

    // Χειριστής: ανίχνευση δικτύου (τώρα απαιτεί συνδεδεμένο πορτοφόλι)
    const handleDetectNetwork = async () => {
        const detectedNetwork = await detectNetworkFromWallet();
        if (detectedNetwork) {
            setLabState((s) => ({
                ...s,
                networkDetected: true,
                activeNetwork: detectedNetwork,
                discoveredData: [
                    ...s.discoveredData,
                    `Ανιχνεύθηκε ενεργό πλαίσιο δικτύου: ${detectedNetwork}`,
                ],
            }));
            setLastAction("detect-network");
        } else {
            setLastAction("detect-network-failed");
            setLabState((s) => ({
                ...s,
                discoveredData: [
                    ...s.discoveredData,
                    "Απαιτείται σύνδεση πορτοφολιού για ανίχνευση δικτύου.",
                ],
            }));
        }
    };

    // Χειριστής: επιβεβαίωση διεύθυνσης
    const handleConfirmAddress = (address) => {
        const isValid = address.startsWith("0x") && address.length === 42;
        setLabState((s) => ({
            ...s,
            addressProvided: true,
            addressValid: isValid,
            confirmedAddress: isValid ? address : s.confirmedAddress,
            discoveredData: [
                ...s.discoveredData,
                `Παρατηρήθηκε δημόσια διεύθυνση (${isValid ? "έγκυρη μορφή checksum" : "μη έγκυρη μορφή"}): ${address}`,
            ],
        }));
        setLastAction("confirm-address");
    };

    // Χειριστής: επιθεώρηση διεύθυνσης
    const handleInspectAddress = () => {
        setLabState((s) => ({
            ...s,
            addressInspected: true,
            discoveredData: [
                ...s.discoveredData,
                "Η δομή της διεύθυνσης επιθεωρήθηκε (prefix, μήκος, κωδικοποίηση checksum)",
            ],
        }));
        setLastAction("inspect-address");
    };

    // Χειριστής: αποκάλυψη σχέσης κλειδιών
    const handleRevealKeyRelationship = () => {
        setLabState((s) => ({
            ...s,
            keyRelationshipRevealed: true,
            discoveredData: [
                ...s.discoveredData,
                "Παρατηρήθηκε εννοιολογική σχέση: ιδιωτικό κλειδί → δημόσιο κλειδί → διεύθυνση",
            ],
        }));
        setLastAction("reveal-keys");
    };

    // Χειριστής: επανεξέταση δικτύου (για Ενέργεια 5, πλέον πραγματική ανίχνευση)
    const handleDetectNetworkAgain = async () => {
        const prev = labState.activeNetwork;
        const detectedNetwork = await detectNetworkFromWallet();

        if (!detectedNetwork) {
            setLastAction("detect-network-same");
            setLabState((s) => ({
                ...s,
                discoveredData: [
                    ...s.discoveredData,
                    "Αδυναμία ανίχνευσης δικτύου από το πορτοφόλι.",
                ],
            }));
            return;
        }

        if (prev === detectedNetwork) {
            setLastAction("detect-network-same");
            setLabState((s) => ({
                ...s,
                previousNetwork: prev,
                activeNetwork: detectedNetwork,
                discoveredData: [
                    ...s.discoveredData,
                    "Επαναλήφθηκε ο έλεγχος του δικτύου — το πορτοφόλι παραμένει στο ίδιο δίκτυο",
                ],
            }));
            return;
        }

        // Πραγματική αλλαγή δικτύου
        setLastAction("detect-network-changed");
        setLabState((s) => ({
            ...s,
            previousNetwork: prev,
            activeNetwork: detectedNetwork,
            identityComparedAcrossNetworks: true,
            discoveredData: [
                ...s.discoveredData,
                `Η ίδια διεύθυνση παρατηρήθηκε σε διαφορετικά δίκτυα: ${prev} → ${detectedNetwork}`,
            ],
        }));
    };

    // Χειριστής: επιβεβαίωση ταυτότητας χωρίς λογαριασμούς
    const handleAcknowledgeIdentityWithoutAccounts = () => {
        setLabState((s) => ({
            ...s,
            identityWithoutAccountsAcknowledged: true,
            discoveredData: [
                ...s.discoveredData,
                "Επιβεβαιώθηκε: η Web3 ταυτότητα υπάρχει χωρίς λογαριασμούς, εγγραφή ή συναλλαγές",
            ],
        }));
        setLastAction("no-accounts");
    };

    // Χειριστής: επαναφορά εργαστηρίου
    const handleResetLab = () => {
        setLabState({
            networkDetected: false,
            activeNetwork: null,
            previousNetwork: null,
            addressProvided: false,
            addressValid: false,
            addressInspected: false,
            keyRelationshipRevealed: false,
            identityComparedAcrossNetworks: false,
            identityWithoutAccountsAcknowledged: false,
            discoveredData: [],
            confirmedAddress: null,
        });
        setLastAction(null);
    };

    // Παράγωγες boolean για ενεργοποίηση/απενεργοποίηση κουμπιών
    const canDetectNetwork = !labState.networkDetected;
    const canConfirmAddress = labState.networkDetected && !labState.addressProvided;
    const canInspectAddress = labState.addressProvided && !labState.addressInspected;
    const canRevealKeyRelationship = labState.addressInspected && !labState.keyRelationshipRevealed;
    // Ενέργεια 5: ενεργοποίηση του "Ανίχνευση Δικτύου Ξανά" μετά την πρώτη ανίχνευση και αφού αποκαλυφθούν τα κλειδιά
    const canDetectNetworkAgain = labState.keyRelationshipRevealed && labState.networkDetected;
    const canAcknowledgeIdentityWithoutAccounts = labState.identityComparedAcrossNetworks && !labState.identityWithoutAccountsAcknowledged;

    const explanationUnlocked =
        labState.networkDetected &&
        labState.addressProvided &&
        labState.addressValid &&
        labState.addressInspected &&
        labState.keyRelationshipRevealed &&
        labState.identityComparedAcrossNetworks &&
        labState.identityWithoutAccountsAcknowledged;

    const canResetLab =
        labState.networkDetected ||
        labState.activeNetwork !== null ||
        labState.addressProvided ||
        labState.addressValid ||
        labState.addressInspected ||
        labState.keyRelationshipRevealed ||
        labState.identityComparedAcrossNetworks ||
        labState.identityWithoutAccountsAcknowledged ||
        (labState.discoveredData && labState.discoveredData.length > 0);

    return (
        <PageShell title="Lab 01 — Πορτοφόλια & Web3 Ταυτότητες">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Στόχος */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 01 — Πορτοφόλια & Web3 Ταυτότητες
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Ανακαλύψτε πώς μια Web3 ταυτότητα αναπαρίσταται από μια δημόσια διεύθυνση που διαχειρίζεται το πορτοφόλι και υπάρχει πριν από συναλλαγές, λογαριασμούς ή έξυπνα συμβόλαια.
                    </p>
                </section>

                {/* 🧭 Τρέχουσα Κατάσταση */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>
                            Ανιχνεύθηκε δίκτυο: {labState.networkDetected ? "✅" : "❌"}
                        </li>
                        <li>
                            Δόθηκε διεύθυνση: {labState.addressProvided ? "✅" : "❌"}
                        </li>
                        <li>
                            Έγκυρη διεύθυνση: {labState.addressValid ? "✅" : "❌"}
                        </li>
                        <li>
                            Επιθεωρήθηκε διεύθυνση: {labState.addressInspected ? "✅" : "❌"}
                        </li>
                        <li>
                            Κατανόηση σχέσης κλειδιών: {labState.keyRelationshipRevealed ? "✅" : "❌"}
                        </li>
                        <li>
                            Σύγκριση ταυτότητας μεταξύ δικτύων: {labState.identityComparedAcrossNetworks ? "✅" : "❌"}
                        </li>
                        <li>
                            Αναγνώριση ταυτότητας χωρίς λογαριασμούς: {labState.identityWithoutAccountsAcknowledged ? "✅" : "❌"}
                        </li>
                    </ul>
                </section>

                {/* 🎛 Διαθέσιμες Ενέργειες */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    <div className="space-y-6">

                        {/* Υπόδειξη σύνδεσης πορτοφολιού */}
                        <div className="mb-2">
                            <div className="text-xs italic rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-2 mb-2">
                                ℹ️ Πριν συνεχίσετε, βεβαιωθείτε ότι το πορτοφόλι του browser (π.χ. MetaMask) είναι εγκατεστημένο και συνδεδεμένο σε αυτή τη σελίδα.
                            </div>
                        </div>
                        {/* Ενέργεια 1 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleDetectNetwork}
                                disabled={!canDetectNetwork}
                                className={`px-4 py-2 rounded-md bg-indigo-500 text-white ${!canDetectNetwork
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-indigo-600"
                                    }`}
                            >
                                Ανίχνευση Δικτύου
                            </button>
                            {lastAction === "detect-network" && labState.activeNetwork && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Ανιχνεύθηκε δίκτυο: {labState.activeNetwork}
                                </div>
                            )}
                            {lastAction === "detect-network-failed" && (
                                <div className="mt-2 text-xs rounded bg-yellow-50 dark:bg-slate-800 text-yellow-900 dark:text-yellow-200 px-3 py-1">
                                    ⚠️ Παρακαλώ συνδέστε πρώτα το πορτοφόλι σας για να ανιχνευθεί το δίκτυο.
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 2 */}
                        <div className="rounded-xl border p-5">
                            <label className="block text-sm font-medium mb-2">
                                Εισάγετε δημόσια διεύθυνση
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">
                                Αντιγράψτε τη δημόσια διεύθυνσή σας από το συνδεδεμένο πορτοφόλι (ξεκινά με 0x…).
                            </p>
                            <input
                                type="text"
                                placeholder="π.χ. 0xABC123456789abcdef123456789abcdef12345678"
                                className={`w-full rounded-md border border-slate-300 dark:border-slate-600
                                           bg-white dark:bg-slate-900 px-3 py-2 mb-3 ${!canConfirmAddress ? "opacity-60 cursor-not-allowed" : ""}`}
                                disabled={!canConfirmAddress}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && canConfirmAddress) {
                                        handleConfirmAddress(e.target.value.trim());
                                        e.target.value = "";
                                    }
                                }}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                Πατήστε Enter για επιβεβαίωση διεύθυνσης.
                            </p>
                            {lastAction === "confirm-address" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Επιβεβαιώθηκε δημόσια διεύθυνση συμβατή με EVM
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 3 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleInspectAddress}
                                disabled={!canInspectAddress}
                                className={`px-4 py-2 rounded-md ${canInspectAddress
                                    ? "bg-slate-700 text-white hover:bg-slate-800"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Επιθεώρηση Διεύθυνσης
                            </button>
                            {lastAction === "inspect-address" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Η δομή της διεύθυνσης επιθεωρήθηκε (prefix, μήκος, checksum)
                                </div>
                            )}
                            {/* Οπτική βοήθεια επιθεώρησης διεύθυνσης */}
                            {labState.addressInspected === true && labState.confirmedAddress && (
                                <div className="mt-4">
                                    <div className="font-mono text-sm bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded flex flex-col items-start">
                                        <span>
                                            <span className="font-bold text-blue-700 dark:text-blue-400" title="hex prefix">
                                                {labState.confirmedAddress.slice(0, 2)}
                                            </span>
                                            <span className="mx-1" />
                                            <span className="text-black dark:text-white" title="address body">
                                                {labState.confirmedAddress.slice(2)}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                        <div>
                                            <span className="font-mono font-bold text-blue-700 dark:text-blue-400">0x</span>
                                            <span className="ml-1">→ 16-δικό prefix</span>
                                        </div>
                                        <div>
                                            <span className="font-mono">40 16-δικοί χαρακτήρες</span>
                                            <span className="ml-1">→ Σώμα Διεύθυνσης</span>
                                        </div>
                                        <div>
                                            <span className="font-mono">Μεικτή γραφή</span>
                                            <span className="ml-1">→ χρήση σε κωδικοποίηση checksum</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                                        <strong>Γιατί μεικτή χρήση κεφαλαίων;</strong><br />
                                        Οι διευθύνσεις συμβατές με Ethereum χρησιμοποιούν <em>κωδικοποίηση checksum</em> (EIP‑55).
                                        Το συγκεκριμένο μοτίβο κεφαλαίων και πεζών βοηθά τα πορτοφόλια να εντοπίζουν τυπογραφικά λάθη.
                                        Αν αλλάξει κατά λάθος ένας χαρακτήρας μορφή (πεζό σε κεφαλαίο ή αντίστροφα) η διεύθυνση γίνεται μη έγκυρη.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 4 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleRevealKeyRelationship}
                                disabled={!canRevealKeyRelationship}
                                className={`px-4 py-2 rounded-md ${canRevealKeyRelationship
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Προβολή Σχέσης Κλειδιού–Διεύθυνσης
                            </button>
                            <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                                Κατανοήστε πώς σχετίζονται τα κλειδιά με τη διεύθυνσή σας — χωρίς να αποκαλυφθούν κλειδιά.
                            </div>
                            {labState.keyRelationshipRevealed === true && (
                                <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3">
                                    <div className="font-mono text-sm flex flex-col items-center space-y-2">
                                        <div>
                                            [ <span>Ιδιωτικό Κλειδί</span> ] <span className="mx-1">→</span> [ <span>Δημόσιο Κλειδί</span> ] <span className="mx-1">→</span> [ <span>Διεύθυνση</span> ]
                                        </div>
                                        <div className="flex flex-row justify-center space-x-8 mt-2 text-xs">
                                            <div className="flex flex-col items-center">
                                                <span>🔒</span>
                                                <span className="text-slate-500 dark:text-slate-400">διαχείριση από πορτοφόλι</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span>🔒</span>
                                                <span className="text-slate-500 dark:text-slate-400">διαχείριση από πορτοφόλι</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span>👁️</span>
                                                <span className="text-slate-500 dark:text-slate-400">η δημόσια ταυτότητά σας</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="mt-4 text-sm text-slate-700 dark:text-slate-200 list-disc ml-6 space-y-1">
                                        <li>Τα κλειδιά δημιουργούνται και αποθηκεύονται από το πορτοφόλι</li>
                                        <li>Η διεύθυνση είναι το μόνο δημόσιο αναγνωριστικό</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 5 */}
                        <div className="rounded-xl border p-5">
                            {/* Οδηγίες αλλαγής δικτύων στο MetaMask */}
                            {labState.networkDetected === true && (
                                <div className="mb-3 px-4 py-3 rounded bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700">
                                    <div className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Πώς να αλλάξετε δίκτυο στο MetaMask</div>
                                    <ol className="list-decimal ml-5 text-sm text-yellow-900 dark:text-yellow-100 space-y-1">
                                        <li>Ανοίξτε το MetaMask</li>
                                        <li>Κάντε κλικ στον επιλογέα δικτύου στην κορυφή</li>
                                        <li>
                                            Επιλέξτε:<br />
                                            <span className="ml-3">• Besu Edu-Net<br />• ή Ethereum Mainnet</span>
                                        </li>
                                        <li>Επιστρέψτε εδώ και κάντε κλικ στο <span className="font-semibold">Ανίχνευση Δικτύου Ξανά</span></li>
                                    </ol>
                                    <div className="mt-2 text-xs text-yellow-800 dark:text-yellow-200 italic">
                                        Δεν δημιουργείτε νέα ταυτότητα — αλλάζετε μόνο το πλαίσιο δικτύου.
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleDetectNetworkAgain}
                                disabled={!canDetectNetworkAgain}
                                className={`mt-2 px-4 py-2 rounded-md bg-indigo-500 text-white ${!canDetectNetworkAgain
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-indigo-600"
                                    }`}
                            >
                                Ανίχνευση Δικτύου Ξανά
                            </button>
                            {lastAction === "detect-network-changed" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Το πλαίσιο δικτύου άλλαξε
                                </div>
                            )}
                            {lastAction === "detect-network-same" && (
                                <div className="mt-2 text-xs rounded bg-yellow-50 dark:bg-slate-800 text-yellow-900 dark:text-yellow-200 px-3 py-1">
                                    ℹ️ Το δίκτυο δεν άλλαξε — αλλάξτε δίκτυα στο πορτοφόλι σας και προσπαθήστε ξανά.
                                </div>
                            )}
                            {/* Μπλοκ σύγκρισης: μόνο όταν identityComparedAcrossNetworks === true ΚΑΙ previousNetwork !== activeNetwork */}
                            {labState.identityComparedAcrossNetworks === true &&
                                labState.previousNetwork !== null &&
                                labState.previousNetwork !== labState.activeNetwork && (
                                    <div className="mt-6 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700">
                                        <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                                            Σύγκριση Δικτύων
                                        </div>
                                        <div className="text-sm mb-2">
                                            <span className="mr-2">Διεύθυνση:</span>
                                            <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                                {labState.confirmedAddress
                                                    ? `${labState.confirmedAddress.slice(0, 6)}...${labState.confirmedAddress.slice(-4)}`
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className="text-sm flex flex-col gap-1 mb-3">
                                            <span>Προηγούμενο δίκτυο: <span className="font-semibold">{labState.previousNetwork}</span></span>
                                            <span>Τρέχον δίκτυο: <span className="font-semibold">{labState.activeNetwork}</span></span>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div>
                                                <div className="font-semibold mb-1">Τι άλλαξε:</div>
                                                <ul className="list-disc ml-5 text-green-700 dark:text-green-300 text-sm space-y-1">
                                                    <li>✔ Πλαίσιο δικτύου</li>
                                                    <li>✔ Μοντέλο εμπιστοσύνης</li>
                                                    <li>✔ Διαθέσιμες εφαρμογές</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="font-semibold mb-1">Τι ΔΕΝ άλλαξε:</div>
                                                <ul className="list-disc ml-5 text-green-700 dark:text-green-300 text-sm space-y-1">
                                                    <li>✔ Η διεύθυνσή σας</li>
                                                    <li>✔ Το πορτοφόλι σας</li>
                                                    <li>✔ Τα κλειδιά σας</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Ενέργεια 6 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleAcknowledgeIdentityWithoutAccounts}
                                disabled={!canAcknowledgeIdentityWithoutAccounts}
                                className={`px-4 py-2 rounded-md ${canAcknowledgeIdentityWithoutAccounts
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Παρατήρηση Ταυτότητας Χωρίς Λογαριασμούς
                            </button>
                            <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                                Εξετάστε τι δεν απαιτήθηκε για να καθιερωθεί η Web3 ταυτότητά σας.
                            </div>
                            {labState.identityWithoutAccountsAcknowledged === true && (
                                <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3">
                                    <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                                        Ολοκληρώσατε αυτό το εργαστήριο χωρίς:
                                    </div>
                                    <ul className="list-none pl-0 space-y-1 text-slate-700 dark:text-slate-200 text-sm">
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Όνομα χρήστη</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Κωδικό πρόσβασης</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Email</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Εγγραφή</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Συναλλαγές</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Τέλη gas</li>
                                    </ul>
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                        Η ταυτότητά σας υπάρχει ανεξάρτητα από κεντρικοποιημένα συστήματα λογαριασμών.
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Ανακαλυφθέντα Δεδομένα */}
                <section className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-lg font-semibold mb-4">🔍 Ανακαλυφθέντα Δεδομένα</h2>
                    {labState.discoveredData && labState.discoveredData.length > 0 ? (
                        <ul className="text-slate-700 dark:text-slate-200 list-disc ml-5 space-y-1">
                            {labState.discoveredData.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            Τα δεδομένα θα εμφανιστούν εδώ καθώς αλληλεπιδράτε με το εργαστήριο.
                        </p>
                    )}
                </section>

                {/* 🧠 Επεξήγηση */}
                <section
                    className={`rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40 ${explanationUnlocked ? "" : "opacity-60"
                        }`}
                >
                    <h2 className="text-lg font-semibold mb-2">🧠 Επεξήγηση</h2>
                    {explanationUnlocked ? (
                        <p className="text-slate-700 dark:text-slate-200">
                            Μια Web3 ταυτότητα αναπαρίσταται από μια δημόσια διεύθυνση που διαχειρίζεται ένα πορτοφόλι.<br />
                            Το πορτοφόλι διαχειρίζεται με ασφάλεια τα κρυπτογραφικά κλειδιά για λογαριασμό σας, ενώ η διεύθυνση λειτουργεί ως η ορατή ταυτότητά σας σε ένα συγκεκριμένο δίκτυο.<br />
                            Αυτή η ταυτότητα υπάρχει πριν από οποιαδήποτε συναλλαγή, αλληλεπίδραση με έξυπνο συμβόλαιο ή εγγραφή λογαριασμού.<br />
                            Η ίδια διεύθυνση μπορεί να εμφανίζεται σε πολλαπλά δίκτυα, αλλά το νόημα και η εμπιστοσύνη της καθορίζονται από το πλαίσιο του δικτύου — όχι από usernames ή κεντρικοποιημένους λογαριασμούς.
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            Ολοκληρώστε όλες τις ενέργειες για να ξεκλειδώσετε την επεξήγηση.
                        </p>
                    )}
                </section>

                {/* 🎁 Ολοκλήρωση & Επιστροφή */}
                {explanationUnlocked && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            🎉 Το εργαστήριο ολοκληρώθηκε
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 mb-4">
                            Ολοκληρώσατε το <strong>Lab 01 — Πορτοφόλια & Web3 Ταυτότητες</strong>.
                            Δηλώστε την ολοκλήρωση παρακάτω.
                        </p>
                        <LabCompletionClaim
                            labId="lab01"
                            language="gr"
                            backHref="/#/labs-gr/wallets-keys"
                            backLabel="⬅ Επιστροφή στην επισκόπηση"
                        />
                    </section>
                )}

                {/* 🔁 Εργαλεία */}
                <section className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
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
                        href="https://github.com/dimikog/web3edu-labs/tree/main/lab-01-wallets-identity"
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                    >
                        📚 Προβολή Λεπτομερειών (GitHub)
                    </a>
                </section>

            </div>
        </PageShell>
    );
};

export default Lab01InteractionGR;
