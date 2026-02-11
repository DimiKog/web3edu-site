import PageShell from "../../components/PageShell.jsx";
import { useState } from "react";
import { useAccount } from "wagmi";

const PROPOSAL = {
    id: "dao-02-proposal-001",
    title: "Ορισμός Μοντέλου Καταμέτρησης Ψήφων για το DAO του Web3Edu",
    description: `
Στο DAO Lab 01 υπέγραψες μία ψήφο.
Σε αυτό το εργαστήριο δεν αλλάζουμε την ψήφο — αλλάζουμε τον τρόπο που καταμετράται.

Αυτή η πρόταση εξετάζει ποιο μοντέλο διακυβέρνησης
πρέπει να υιοθετήσει το Web3Edu:

• 1 Πορτοφόλι = 1 Ψήφος
• Με βάση τα tokens (1 Token = 1 Ψήφος)
• Τετραγωνική Ψηφοφορία
`
};

export default function DaoLab02InteractionGR({ backToLabPath = "/#/labs-gr/dao-02" }) {
    const { address, isConnected } = useAccount();

    const [model, setModel] = useState(null);
    const [quorum, setQuorum] = useState(20);
    const [threshold, setThreshold] = useState(50);
    const [simulatedResult, setSimulatedResult] = useState(null);

    const simulateOutcome = () => {
        if (!model) return;

        // Fixed community assumptions (academically cleaner)
        const totalMembers = 100;
        const yesIndividuals = 60;   // 60% individuals voted YES (constant across models)
        const noIndividuals = 40;

        // Token distribution assumption:
        // 10 whales hold 60% of tokens
        // 90 small holders hold 40% of tokens
        const whales = 10;
        const smallHolders = 90;

        let participation = 65; // assume 65% participation
        let yesVotes;

        if (model === "democracy") {
            // 1 wallet = 1 vote
            // 60% of participating members voted YES (intent fixed across models)
            yesVotes = yesIndividuals;
        }

        if (model === "token") {
            // Assume whales mostly vote YES (8/10 whales vote YES)
            const whaleYesPower = 0.6 * 0.8; // 60% token share * 80% whales YES
            const smallYesPower = 0.4 * (yesIndividuals - 8) / smallHolders;
            yesVotes = Math.round((whaleYesPower + smallYesPower) * 100);
        }

        if (model === "quadratic") {
            // Square root dampening
            const whalePower = Math.sqrt(60);
            const smallPower = Math.sqrt(40);

            const whaleYes = whalePower * 0.8;
            const smallYes = smallPower * 0.6;

            const totalPower = whalePower + smallPower;
            yesVotes = Math.round(((whaleYes + smallYes) / totalPower) * 100);
        }

        const quorumMet = participation >= quorum;
        const thresholdMet = yesVotes >= threshold;

        setSimulatedResult({
            participation,
            yesVotes,
            quorumMet,
            thresholdMet,
            passed: quorumMet && thresholdMet,
            totalMembers,
            yesIndividuals,
            noIndividuals,
            whales,
            smallHolders
        });
    };

    return (
        <PageShell title="DAO Lab 02 — Προσομοιωτής Σχεδιασμού Διακυβέρνησης">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* Goal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        DAO Lab 02 — Προσομοιωτής Σχεδιασμού Διακυβέρνησης
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Σε αυτό το εργαστήριο <strong>δεν ψηφίζεις</strong>. Σχεδιάζεις τους κανόνες.
                        Θα επιλέξεις μοντέλο καταμέτρησης, θα ρυθμίσεις <strong>απαρτία</strong> και <strong>κατώφλι έγκρισης</strong>,
                        και θα τρέξεις προσομοίωση για να δεις αν η πρόταση θα περάσει.
                    </p>
                </section>

                {/* How to complete */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">✅ Τι πρέπει να κάνεις (βήμα-βήμα)</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                        <li>
                            <strong>Διάβασε</strong> το πλαίσιο της πρότασης (τι προσπαθεί να αποφασίσει το DAO).
                        </li>
                        <li>
                            <strong>Επίλεξε μοντέλο διακυβέρνησης</strong> (1 πορτοφόλι=1 ψήφος, με βάση tokens, τετραγωνική).
                        </li>
                        <li>
                            <strong>Ρύθμισε απαρτία & κατώφλι έγκρισης</strong> και πάτησε <em>«Προσομοίωση Αποτελέσματος»</em>.
                        </li>
                    </ol>
                    <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                        Στόχος: να κατανοήσεις ότι η ίδια πρόθεση της κοινότητας μπορεί να οδηγήσει σε διαφορετικά αποτελέσματα,
                        ανάλογα με τους κανόνες διακυβέρνησης.
                    </p>
                </section>

                {/* Current State */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>{isConnected ? "✅" : "❌"} Πορτοφόλι συνδεδεμένο</li>
                        <li>{model ? "✅" : "❌"} Μοντέλο επιλεγμένο</li>
                        <li>{simulatedResult ? "✅" : "❌"} Προσομοίωση ολοκληρώθηκε</li>
                    </ul>
                    {address && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Πορτοφόλι: <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                        </p>
                    )}
                </section>

                {/* Proposal Context */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">📄 Πλαίσιο Πρότασης</h2>
                    <h3 className="font-semibold mb-2">{PROPOSAL.title}</h3>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {PROPOSAL.description}
                    </p>
                </section>

                {/* Community Structure */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🏛 Προσομοιωμένη Δομή Κοινότητας</h2>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        <li>100 συνολικά μέλη</li>
                        <li>10 μεγάλοι κάτοχοι tokens (ελέγχουν το 60% των tokens)</li>
                        <li>90 μικρότεροι κάτοχοι (ελέγχουν το 40% των tokens)</li>
                        <li>Το 60% των ατόμων ψηφίζει ΝΑΙ (σταθερή πρόθεση)</li>
                    </ul>
                    <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                        Το μόνο που αλλάζεις σε αυτό το εργαστήριο είναι ο τρόπος κατανομής της ισχύος — όχι η πρόθεση των ψηφοφόρων.
                    </p>
                </section>

                {/* Governance Model Selection */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">⚙️ Επίλεξε Μοντέλο Διακυβέρνησης</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Democracy */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "democracy"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("democracy")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                1 Πορτοφόλι = 1 Ψήφος
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Λογική:</strong> Καθαρή δημοκρατία. Κάθε πορτοφόλι έχει ίση ισχύ ψήφου.</p>
                                <p><strong>Κατάλληλο για:</strong> Κοινοτική ταυτότητα ή υποκειμενικές αποφάσεις (π.χ. αλλαγή λογοτύπου).</p>
                                <p className="text-red-500"><strong>Κίνδυνος:</strong> Επιθέσεις Sybil (ένα άτομο δημιουργεί πολλά πορτοφόλια).</p>
                                <div className="mt-2 rounded border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 text-xs text-amber-800 dark:text-amber-300">
                                    ⚠ <strong>Εξήγηση Sybil:</strong> Σε ένα permissionless DAO, ένα άτομο μπορεί να δημιουργήσει 50 πορτοφόλια
                                    και να ψηφίσει 50 φορές. Γι’ αυτό πολλά DAO χρησιμοποιούν Proof‑of‑Personhood συστήματα
                                    (π.χ. Gitcoin Passport) ή Soulbound Tokens (SBTs) ώστε να προσεγγίζουν το “1 άνθρωπος = 1 ψήφος”.
                                </div>
                            </div>
                        </div>

                        {/* Token Weighted */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "token"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("token")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                Με βάση τα tokens
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Λογική:</strong> Περισσότερο stake = περισσότερη επιρροή.</p>
                                <p><strong>Κατάλληλο για:</strong> Οικονομικές αποφάσεις ή διαχείριση θησαυροφυλακίου.</p>
                                <p className="text-red-500"><strong>Κίνδυνος:</strong> Κυριαρχία «φαλαινών» (πολύ μεγάλοι κάτοχοι) και συγκέντρωση ισχύος.</p>
                            </div>
                        </div>

                        {/* Quadratic */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "quadratic"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("quadratic")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                Τετραγωνική Ψηφοφορία
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Λογική:</strong> Η ισχύς ψήφου αυξάνει με √tokens.</p>
                                <p><strong>Κατάλληλο για:</strong> Εξισορρόπηση ισχυρής προτίμησης με ευρεία συναίνεση.</p>
                                <p className="text-red-500"><strong>Κίνδυνος:</strong> Μαθηματική πολυπλοκότητα και ευαλωτότητα σε Sybil χωρίς ταυτότητα.</p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="p-3">Μοντέλο</th>
                                    <th className="p-3">Ποιος κερδίζει ισχύ;</th>
                                    <th className="p-3">Κύριος κίνδυνος</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr>
                                    <td className="p-3 font-medium">1 Πορτοφόλι = 1 Ψήφος</td>
                                    <td className="p-3">Αριθμητική πλειοψηφία</td>
                                    <td className="p-3 text-red-500">Επιθέσεις Sybil</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Με βάση τα tokens</td>
                                    <td className="p-3">Μεγάλοι κάτοχοι stake</td>
                                    <td className="p-3 text-red-500">Συγκέντρωση ισχύος</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Τετραγωνική</td>
                                    <td className="p-3">Πλειοψηφία συναίνεσης</td>
                                    <td className="p-3 text-red-500">Μαθηματική πολυπλοκότητα</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
                        Αν χρησιμοποιήσουμε “1 Πορτοφόλι = 1 Ψήφος”, πώς αποτρέπουμε ένα άτομο από το να δημιουργήσει 100 πορτοφόλια;
                        Τα πραγματικά DAO συχνά απαιτούν επαλήθευση ταυτότητας (π.χ. SBTs ή Proof-of-Personhood) για να μετριάσουν τις επιθέσεις Sybil.
                    </div>
                </section>

                {/* Governance Parameters */}
                {model && (
                    <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40 space-y-6">
                        <h2 className="text-xl font-semibold">📊 Παράμετροι Διακυβέρνησης</h2>

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Απαρτία</strong> = ποσοστό συμμετοχής που απαιτείται για να είναι έγκυρη η ψηφοφορία.
                            <br />
                            <strong>Κατώφλι έγκρισης</strong> = ποσοστό ψήφων «ΝΑΙ» που απαιτείται για να περάσει η πρόταση.
                        </p>

                        {model && (
                            <div className="mt-4 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-sm">
                                <div className="font-semibold mb-1">⚖ Επίδραση στην Κατανομή Ισχύος</div>
                                {model === "democracy" && (
                                    <p>Η ισχύς ψήφου κατανέμεται ισότιμα ανά πορτοφόλι. Η ταυτότητα ισούται με επιρροή.</p>
                                )}
                                {model === "token" && (
                                    <p>Η ισχύς ψήφου είναι ανάλογη των tokens. Η συγκέντρωση κεφαλαίου αυξάνει την επιρροή.</p>
                                )}
                                {model === "quadratic" && (
                                    <p>Η ισχύς ψήφου αυξάνει με τη τετραγωνική ρίζα των tokens. Οι μεγάλοι κάτοχοι «αποδυναμώνονται», οι μικρότεροι αποκτούν σχετικά μεγαλύτερη ισχύ.</p>
                                )}
                            </div>
                        )}

                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                            <div className="font-semibold mb-2">🎯 Δοκίμασε έτοιμα σενάρια</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => { setQuorum(20); setThreshold(50); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Ισορροπημένο (20% / 50%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(60); setThreshold(50); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Υψηλή απαρτία (60% / 50%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(20); setThreshold(70); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Αυστηρή έγκριση (20% / 70%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(10); setThreshold(55); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Χαμηλή τριβή (10% / 55%)
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Tip: Κράτησε την πρόθεση (ΝΑΙ/ΟΧΙ) ίδια και άλλαξε μόνο τους κανόνες — αυτό δείχνει τον «σχεδιασμό διακυβέρνησης».
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Απαρτία: {quorum}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={quorum}
                                onChange={(e) => setQuorum(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Κατώφλι Έγκρισης: {threshold}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <button
                            onClick={simulateOutcome}
                            className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                            Προσομοίωση Αποτελέσματος
                        </button>
                    </section>
                )}

                {/* Simulated Result */}
                {simulatedResult && (
                    <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 space-y-8">
                        <h2 className="text-lg font-semibold">🔬 Ανάλυση Αποτελέσματος Διακυβέρνησης</h2>

                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                            Σε αυτή την προσομοίωση, η πρόθεση της κοινότητας είναι σταθερή. Μόνο ο σχεδιασμός διακυβέρνησης αλλάζει το αποτέλεσμα.
                        </p>

                        {/* Community Snapshot */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">🏛 Κοινότητα</div>
                                <p><strong>100 Μέλη</strong></p>
                                <p className="text-xs text-slate-500">10 μεγάλοι κάτοχοι (60% tokens)</p>
                                <p className="text-xs text-slate-500">90 μικροί κάτοχοι (40% tokens)</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">🗳 Πρόθεση</div>
                                <p>🟢 60% ΝΑΙ</p>
                                <p>🔴 40% ΟΧΙ</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">👥 Συμμετοχή</div>
                                <p>{simulatedResult.participation}% συμμετοχή</p>
                            </div>
                        </div>

                        {/* Raw Intent Bar */}
                        <div>
                            <div className="text-xs mb-1">Ακατέργαστη Πρόθεση Κοινότητας (Πριν το Μοντέλο Διακυβέρνησης)</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-4 overflow-hidden">
                                <div className="bg-green-500 h-4" style={{ width: "60%" }} />
                            </div>
                            <div className="text-xs mt-1">60% ΝΑΙ (πρόθεση ατομικής ψήφου)</div>
                        </div>

                        {/* Token Distribution */}
                        <div className="space-y-2">
                            <div className="text-xs font-semibold">Κατανομή Tokens</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                                <div className="bg-indigo-600 h-3" style={{ width: "60%" }} />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Φάλαινες: 60%</div>

                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                                <div className="bg-indigo-400 h-3" style={{ width: "40%" }} />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Μικροί κάτοχοι: 40%</div>
                        </div>

                        {/* Power-adjusted YES bar */}
                        <div>
                            <div className="text-xs mb-1">Προσαρμοσμένο ΝΑΙ (Μετά την Εφαρμογή Μοντέλου)</div>
                            <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded h-6 overflow-hidden">
                                {/* Threshold Marker */}
                                <div
                                    className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10"
                                    style={{ left: `${threshold}%` }}
                                >
                                    <span className="text-[10px] bg-red-500 text-white px-1 absolute -top-4">
                                        Κατώφλι
                                    </span>
                                </div>

                                {/* Vote Bar */}
                                <div
                                    className={`h-full transition-all duration-500 ${simulatedResult.thresholdMet ? "bg-green-600" : "bg-yellow-500"}`}
                                    style={{ width: `${simulatedResult.yesVotes}%` }}
                                />
                            </div>
                            <div className="text-xs mt-1">
                                {simulatedResult.yesVotes}% ΝΑΙ (μετά την εφαρμογή του μοντέλου διακυβέρνησης)
                            </div>
                        </div>

                        <div className="space-y-1 text-sm">
                            <p>Απαρτία επιτεύχθηκε: {simulatedResult.quorumMet ? "✅" : "❌"}</p>
                            <p>Κατώφλι έγκρισης επιτεύχθηκε: {simulatedResult.thresholdMet ? "✅" : "❌"}</p>
                        </div>

                        <div className="text-lg font-semibold">
                            {simulatedResult.passed ? "✅ Η πρόταση ΕΓΚΡΙΝΕΤΑΙ" : "❌ Η πρόταση ΑΠΟΡΡΙΠΤΕΤΑΙ"}
                        </div>

                        <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
                            <div className="font-semibold">🧠 Γιατί συνέβη αυτό;</div>

                            {model === "democracy" && (
                                <p>
                                    Σε αυτό το μοντέλο, κάθε πορτοφόλι έχει ίσο βάρος. Αφού το 60% των ατόμων ψήφισε ΝΑΙ,
                                    το αποτέλεσμα αντανακλά άμεσα την αριθμητική πλειοψηφία.
                                    Ένας μεγάλος κάτοχος token και ένας νέος συμμετέχων έχουν ίδια επιρροή.
                                </p>
                            )}

                            {model === "token" && (
                                <p>
                                    Στη διακυβέρνηση με βάση τα tokens, η ισχύς ψήφου εξαρτάται από την ιδιοκτησία tokens.
                                    Μια μικρή ομάδα μεγάλων κατόχων («φάλαινες» — συμμετέχοντες που κατέχουν πολύ μεγάλο
                                    ποσοστό tokens) μπορεί να μετατοπίσει σημαντικά το αποτέλεσμα,
                                    ακόμη κι αν οι περισσότεροι συμμετέχοντες διαφωνούν.
                                </p>
                            )}

                            {model === "quadratic" && (
                                <p>
                                    Η τετραγωνική ψηφοφορία μειώνει την κυριαρχία των μεγάλων κατόχων, εφαρμόζοντας
                                    τετραγωνική ρίζα στην ισχύ ψήφου. Αυτό περιορίζει τη συγκέντρωση κεφαλαίου,
                                    ενώ ανταμείβει την ένταση της προτίμησης.
                                </p>
                            )}

                            {!simulatedResult.quorumMet && (
                                <p>
                                    Η πρόταση απέτυχε επειδή η συμμετοχή δεν έφτασε την απαρτία.
                                    Οι κανόνες διακυβέρνησης μπορούν να ακυρώσουν την πρόθεση της πλειοψηφίας
                                    όταν η συμμετοχή είναι χαμηλή.
                                </p>
                            )}

                            {simulatedResult.quorumMet && !simulatedResult.thresholdMet && (
                                <p>
                                    Η πρόταση απέτυχε επειδή το ποσοστό των ψήφων ΝΑΙ δεν έφτασε το απαιτούμενο κατώφλι έγκρισης.
                                    Η αύξηση του κατωφλίου απαιτεί υψηλότερο επίπεδο συναίνεσης.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* Completion */}
                {simulatedResult && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                            🎉 DAO Lab 02 Ολοκληρώθηκε
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 space-y-2">
                            <strong>Συγχαρητήρια!</strong> Έχεις πλέον κατακτήσει τους δύο πυλώνες της αποκεντρωμένης διακυβέρνησης:
                            <br />
                            <span>• <strong>Lab 01:</strong> Κρυπτογραφική Απόδειξη Πρόθεσης (η υπογραφή).</span>
                            <br />
                            <span>• <strong>Lab 02:</strong> Συστημικός Σχεδιασμός Κανόνων (το μοντέλο καταμέτρησης).</span>
                            <br /><br />
                            Είσαι πλέον έτοιμος/η να συμμετέχεις στο πραγματικό DAO του Web3Edu.
                            Η κατανόηση της <strong>απαρτίας</strong>, των <strong>κατωφλιών</strong> και της <strong>ισχύος ψήφου</strong>
                            θα σε βοηθήσει να σχεδιάζεις ισχυρότερες προτάσεις για την κοινότητα.
                        </p>
                        <a
                            href={backToLabPath}
                            className="inline-block mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                        >
                            ⬅ Πίσω στα DAO Labs
                        </a>
                    </section>
                )}

            </div>
        </PageShell>
    );
}
