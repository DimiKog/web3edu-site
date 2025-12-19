import PageShell from "../components/PageShell.jsx";
import { useNavigate } from "react-router-dom";

const StartHereGR = () => {
    const navigate = useNavigate();

    return (
        <PageShell>
            {/* Intro */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Ξεκινήστε από εδώ
                </h1>

                <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                    Το Web3Edu είναι ένα πειραματικό εκπαιδευτικό οικοσύστημα όπου φοιτητές,
                    εκπαιδευτικοί και builders μαθαίνουν Web3 μέσα από πραγματική υποδομή,
                    πραγματικά εργαλεία και πραγματικά primitives διακυβέρνησης.
                </p>

                <p className="max-w-3xl mt-4 text-base text-slate-600 dark:text-slate-400">
                    Αυτή η σελίδα σας βοηθά να καταλάβετε από πού να ξεκινήσετε — ανάλογα
                    με το ποιοι είστε και τι θέλετε να εξερευνήσετε.
                </p>

                <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-700/60" />

                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Πώς να χρησιμοποιήσετε αυτή τη σελίδα
                </p>

                <p className="mt-2 text-base text-slate-600 dark:text-slate-300 max-w-3xl">
                    Παρακάτω θα βρείτε προτεινόμενα σημεία εκκίνησης ανάλογα με το αν είστε
                    φοιτητής, εκπαιδευτικός ή builder. Δεν χρειάζεται να τα κάνετε όλα —
                    απλώς επιλέξτε ένα σημείο για να ξεκινήσετε.
                </p>
            </section>

            {/* Choose your starting point */}
            <section className="bg-slate-100/40 dark:bg-slate-900/30 py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-10">
                        Επιλέξτε το σημείο εκκίνησής σας
                    </h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Student */}
                        <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
              bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
              hover:shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="text-lg font-semibold mb-2">🎓 Φοιτητής</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Μάθετε Web3 μέσα από άμεση επαφή με πραγματική υποδομή,
                                εργαλεία και hands-on εργαστήρια.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li>• Δοκιμάστε το Proof of Escape</li>
                                <li
                                    onClick={() => navigate("/labs-gr")}
                                    className="cursor-pointer hover:text-indigo-500 transition"
                                >
                                    • Εξερευνήστε το πρώτο σας εργαστήριο
                                </li>
                                <li>• Κατανοήστε την έννοια της Web3 ταυτότητας</li>
                            </ul>
                        </div>

                        {/* Educator */}
                        <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
              bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
              hover:shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="text-lg font-semibold mb-2">🧑‍🏫 Εκπαιδευτικός</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Εντάξτε έννοιες Web3 στη διδασκαλία σας χωρίς να χρειαστεί
                                να ανασχεδιάσετε ολόκληρο το μάθημά σας.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li
                                    onClick={() => navigate("/labs-gr")}
                                    className="cursor-pointer hover:text-indigo-500 transition"
                                >
                                    • Δείτε τα διαθέσιμα εργαστήρια
                                </li>
                                <li>• Κατανοήστε SBTs και ταυτότητα</li>
                                <li>• Πιλοτική χρήση του Web3Edu σε μάθημα</li>
                            </ul>
                        </div>

                        {/* Builder */}
                        <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
              bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
              hover:shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="text-lg font-semibold mb-2">🧑‍💻 Builder / Ερευνητής</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Πειραματιστείτε με πραγματική Web3 υποδομή και εργαλεία
                                που βασίζονται στην έρευνα.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li>• Εξερευνήστε το Besu Edu-Net</li>
                                <li>• Αναλύστε Blockscout & metrics</li>
                                <li>• Συνεισφέρετε ιδέες και πειράματα</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* What you can do today */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                <h2 className="text-2xl md:text-3xl font-semibold mb-10">
                    Τι μπορείτε να κάνετε σήμερα
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
            bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
            hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 15 λεπτά</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Διαβάστε γιατί δημιουργήθηκε το Web3Edu και πώς το Web3 μπορεί
                            να αλλάξει την εκπαίδευση.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            → Άρθρο στο Medium
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
            bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
            hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 30 λεπτά</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Ζήστε μια hands-on εμπειρία Web3 χρησιμοποιώντας πραγματική υποδομή.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            → Proof of Escape
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-300/40 dark:border-slate-700/60
            bg-white/70 dark:bg-slate-800/60 p-6 backdrop-blur-sm
            hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 45 λεπτά</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Εξερευνήστε το πρώτο σας εργαστήριο και αλληλεπιδράστε άμεσα
                            με Web3 εργαλεία.
                        </p>
                        <p
                            onClick={() => navigate("/labs-gr")}
                            className="mt-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-indigo-500 transition"
                        >
                            → Εργαστήρια (εισαγωγή)
                        </p>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default StartHereGR;