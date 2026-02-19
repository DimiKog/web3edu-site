import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const PROPOSAL = {
    id: "dao-01-proposal-001",
    title: "Υιοθέτηση DAO-based διακυβέρνησης για το Web3Edu",
    description: `
Το Web3Edu εξερευνά τη χρήση DAO-based διακυβέρνησης για:
• εξέλιξη του εκπαιδευτικού περιεχομένου
• έγκριση εργαστηρίων
• συμμετοχή της κοινότητας

Η παρούσα πρόταση εξετάζει αν το Web3Edu θα πρέπει να:
• χρησιμοποιεί προτάσεις για αλλαγές στο curriculum
• επιτρέπει voting με βάση tokens ή SBTs
• καταγράφει πράξεις διακυβέρνησης κρυπτογραφικά

Πρόκειται για προσομοιωμένη ψηφοφορία διακυβέρνησης.
`
};

export default function DaoLab01InteractionGR() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [vote, setVote] = useState(null);
    const [signature, setSignature] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [proposalRead, setProposalRead] = useState(false);
    const [proposalUnfolded, setProposalUnfolded] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);

    const handleVote = async () => {
        if (!isConnected || !selectedChoice) {
            setError("Παρακαλώ επίλεξε επιλογή ψήφου πριν την υπογραφή.");
            return;
        }
        if (!proposalRead) {
            setError("Πρέπει πρώτα να διαβάσεις και να επιβεβαιώσεις την πρόταση.");
            return;
        }

        try {
            const message = `
DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία

Proposal ID: ${PROPOSAL.id}
Voter: ${address}
Vote: ${selectedChoice}

Η ψήφος αυτή αποτελεί μέρος προσομοίωσης διακυβέρνησης Web3Edu.
`;

            const sig = await signMessageAsync({ message });

            setVote(selectedChoice);
            setSignature(sig);
            setSubmitted(true);
        } catch {
            setError("Η υπογραφή απορρίφθηκε ή απέτυχε.");
        }
    };

    return (
        <PageShell title="DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* Governance lifecycle */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-lg font-semibold mb-3">🗳️ Κύκλος Διακυβέρνησης (Προσομοίωση)</h2>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span className="opacity-50">Συζήτηση</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Σχέδιο</span>
                        <span className="opacity-50">→</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Ενεργή Ψηφοφορία</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Καταμέτρηση</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Εκτέλεση</span>
                    </div>
                    <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
                        Συμμετέχεις στη φάση <strong>Ενεργής Ψηφοφορίας</strong>.
                    </p>
                </section>

                {/* Goal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Συμμετέχεις σε προσομοιωμένη διαδικασία διακυβέρνησης DAO
                        υπογράφοντας κρυπτογραφικά την ψήφο σου με το πορτοφόλι σου.
                        Το εργαστήριο εστιάζει στη <strong>σημασιολογία της διακυβέρνησης</strong>,
                        όχι σε on-chain εκτέλεση.
                    </p>
                </section>

                {/* Current state */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>{isConnected ? "✅" : "❌"} Πορτοφόλι συνδεδεμένο</li>
                        <li>{proposalRead ? "✅" : "❌"} Πρόταση διαβασμένη</li>
                        <li>{vote !== null ? "✅" : "❌"} Ψήφος κατατεθειμένη</li>
                        <li>{signature !== null ? "✅" : "❌"} Ψήφος υπογεγραμμένη</li>
                    </ul>
                </section>

                {/* Proposal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">📄 Πρόταση Διακυβέρνησης</h2>
                    <h3 className="font-semibold mb-2">{PROPOSAL.title}</h3>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 mb-4">
                        {PROPOSAL.description}
                    </p>

                    {proposalUnfolded && (
                        <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 p-4 text-sm space-y-2">
                            <p><strong>Κίνητρο:</strong> Συμμετοχική εξέλιξη εκπαιδευτικού περιεχομένου.</p>
                            <p><strong>Πεδίο:</strong> Labs, learning tracks, κανόνες DAO.</p>
                            <p><strong>Κίνδυνοι:</strong> Χαμηλή συμμετοχή, ασάφεια voting models.</p>
                            <p><strong>Εκτός πεδίου:</strong> Token launch ή on-chain εκτέλεση.</p>
                        </div>
                    )}

                    <button
                        onClick={() => setProposalUnfolded(!proposalUnfolded)}
                        className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        📖 {proposalUnfolded ? "Απόκρυψη πρότασης" : "Ανάπτυξη πλήρους πρότασης"}
                    </button>

                    <button
                        onClick={() => setProposalRead(true)}
                        disabled={!proposalUnfolded || proposalRead}
                        className="ml-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                        ✅ Δήλωση ανάγνωσης πρότασης
                    </button>
                </section>

                {/* Voting actions */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    {!submitted ? (
                        <div className={!proposalRead ? "opacity-40 pointer-events-none" : "opacity-100"}>
                            <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                                1. Επίλεξε στάση · 2. Έλεγξε το payload · 3. Υπέγραψε την ψήφο
                            </p>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setSelectedChoice("YES")}
                                    className={`px-6 py-2 rounded-lg border-2 ${selectedChoice === "YES"
                                        ? "border-green-600 bg-green-600 text-white"
                                        : "border-green-600 text-green-600 hover:bg-green-50"
                                        }`}
                                >
                                    ΝΑΙ
                                </button>

                                <button
                                    onClick={() => setSelectedChoice("NO")}
                                    className={`px-6 py-2 rounded-lg border-2 ${selectedChoice === "NO"
                                        ? "border-slate-700 bg-slate-700 text-white"
                                        : "border-slate-700 text-slate-700 hover:bg-slate-100"
                                        }`}
                                >
                                    ΟΧΙ
                                </button>
                            </div>

                            {selectedChoice && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Δεδομένα προς υπογραφή:</span>
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                            EIP-191 Standard
                                        </span>
                                    </div>

                                    <pre className="text-xs rounded bg-slate-100 dark:bg-slate-800 p-3 overflow-x-auto border border-slate-200 dark:border-slate-700">
                                        {`Proposal: ${PROPOSAL.id}
Voter: ${address}
Choice: ${selectedChoice}
Timestamp: ${new Date().toISOString()}`}
                                    </pre>

                                    <button
                                        onClick={handleVote}
                                        className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-transform active:scale-95"
                                    >
                                        Υπογραφή & Υποβολή Ψήφου
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded bg-green-50 dark:bg-slate-800 px-4 py-3 space-y-2">
                            <div className="font-semibold mb-2 text-green-700 dark:text-green-300">
                                ✔ Η ψήφος καταγράφηκε
                            </div>
                            <p className="text-sm">
                                <strong>Η ψήφος σου:</strong> {vote}
                            </p>
                            <p className="break-all text-xs mt-2 text-slate-600 dark:text-slate-400">
                                <strong>Υπογραφή:</strong> {signature}
                            </p>
                            <div className="mt-4 border-t border-green-200 dark:border-green-700 pt-3">
                                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                                    Τι μόλις συνέβη;
                                </h3>
                                <ul className="list-disc list-inside text-green-700 dark:text-green-300 text-sm space-y-1">
                                    <li>Υπέγραψες ένα μήνυμα με το πορτοφόλι σου</li>
                                    <li>Δεν στάλθηκε καμία συναλλαγή</li>
                                    <li>Αυτό προσομοιώνει off‑chain ψηφοφορία σε DAO</li>
                                    <li>Η υπογραφή αποδεικνύει πρόθεση και ταυτότητα</li>
                                </ul>
                            </div>
                            <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-6">
                                <h2 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-200">
                                    🧠 Γιατί ήταν σημαντικό
                                </h2>

                                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200 text-sm">
                                    <li>
                                        Συμμετείχες στη διακυβέρνηση <strong>χωρίς να στείλεις συναλλαγή</strong>.
                                    </li>
                                    <li>
                                        Το πορτοφόλι σου χρησιμοποιήθηκε για να εκφράσει <strong>πρόθεση</strong>, όχι για μεταφορά αξίας.
                                    </li>
                                    <li>
                                        Η κρυπτογραφική υπογραφή αποδεικνύει <strong>ποιος ψήφισε</strong> και <strong>τι ψήφισε</strong>.
                                    </li>
                                    <li>
                                        Έτσι λειτουργούν πολλά πραγματικά DAO στην off‑chain διακυβέρνησή τους.
                                    </li>
                                </ul>

                                <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-400">
                                    Η διακυβέρνηση στο Web3 δεν ορίζεται μόνο από blockchains — ορίζεται από
                                    κρυπτογραφική ταυτότητα και συλλογική συμφωνία.
                                </p>
                            </section>
                        </div>
                    )}

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </section>

                {/* Simulated Admission Context */}
                {submitted && (
                    <section className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/40 p-6">
                        <h2 className="text-lg font-semibold mb-2">🧪 Προσομοιωμένο Πλαίσιο Εισαγωγής</h2>
                        <p className="text-slate-700 dark:text-slate-300 space-y-2">
                            Σε πραγματικά DAO, η συμμετοχή στη διακυβέρνηση μπορεί να απαιτεί μέλος, ανάθεση ή stake. Σε αυτό το
                            εργαστήριο, η εισαγωγή θεωρείται δεδομένη μόνο για μαθησιακούς σκοπούς. Πρόκειται για προσομοίωση και δεν
                            επιβάλλει πραγματικούς κανόνες εισαγωγής DAO.
                        </p>
                    </section>
                )}

                {submitted && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                🔍 Λογική Διακυβέρνησης: Καταμέτρηση
                            </h2>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                Η υπογραφή σου αποτελεί πλέον <strong>δεδομένο διακυβέρνησης</strong>.
                                Στο <strong>DAO Lab 02</strong> θα εφαρμόσουμε διαφορετικά μοντέλα καταμέτρησης
                                πάνω σε αυτήν ακριβώς την ψήφο.
                            </p>

                            <ul className="space-y-3 text-xs">
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
                                    <span className="font-medium text-blue-800 dark:text-blue-300">Αυστηρή Δημοκρατία</span>
                                    <span>1 Πορτοφόλι = 1 Ψήφος</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
                                    <span className="font-medium text-blue-800 dark:text-blue-300">Token-weighted</span>
                                    <span>1 Token = 1 Ψήφος</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1 text-slate-500">
                                    <span className="font-medium">Quadratic (Επόμενο Lab)</span>
                                    <span>√Tokens = Ισχύς Ψήφου</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-6">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                📡 Πέρα από την Υπογραφή
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                                        Πού αποθηκεύεται η ψήφος;
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Προς το παρόν υπάρχει μόνο ως υπογεγραμμένο δεδομένο. Σε πραγματικά DAO, αυτό το δεδομένο
                                        αποστέλλεται σε <strong>indexer</strong> ή <strong>relayer</strong>.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                                        Είναι κάτι on-chain;
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Όχι. Πρόκειται για <strong>off‑chain πρόθεση</strong>. Η on‑chain εκτέλεση γίνεται μόνο αν
                                        το επιτρέπουν οι κανόνες διακυβέρνησης.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </section>
                )}

                {submitted && (
                    <section className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 mt-6">
                        <h2 className="text-lg font-semibold mb-2">🧾 Προσομοιωμένη Απόδειξη Ψήφου</h2>

                        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                            <li><strong>Πρόταση:</strong> {PROPOSAL.id}</li>
                            <li><strong>Ψηφοφόρος:</strong> {address}</li>
                            <li><strong>Ψήφος:</strong> {vote}</li>
                            <li><strong>Αποθήκευση:</strong> Αποκεντρωμένη (προσομοίωση)</li>
                            <li><strong>Content ID (CID):</strong> bafybeigdyr…mock</li>
                        </ul>

                        <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                            Σε πραγματικά DAO, οι off‑chain ψήφοι αποθηκεύονται σε αποκεντρωμένα
                            συστήματα (π.χ. IPFS ή Arweave) ώστε οποιοσδήποτε να μπορεί να επαληθεύσει
                            το αποτέλεσμα χωρίς κόστος gas.
                        </p>
                    </section>
                )}

                {/* Completion */}
                {submitted && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                            🎉 Ολοκλήρωση Εργαστηρίου
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200">
                            Συμμετείχες επιτυχώς σε διαδικασία διακυβέρνησης τύπου DAO.
                            Δηλώστε την ολοκλήρωση παρακάτω.
                        </p>
                        <LabCompletionClaim
                            labId="dao01"
                            language="gr"
                            backHref="/#/labs-gr/dao-01"
                            backLabel="⬅ Επιστροφή στα DAO Labs"
                        />
                    </section>
                )}
            </div>
        </PageShell>
    );
}
