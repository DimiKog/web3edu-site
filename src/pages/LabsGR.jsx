import PageShell from "../components/PageShell.jsx";
import { Link } from "react-router-dom";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.png";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BadgeWithTooltip from "../components/BadgeWithTooltip.jsx";

const LabsGR = () => {
    const { address } = useAccount();
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        if (!address) return;

        fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${address}`)
            .then(res => res.json())
            .then(data => {
                setMetadata(data.metadata || null);
            })
            .catch(err => {
                console.error("Αποτυχία φόρτωσης μεταδεδομένων χρήστη", err);
            });
    }, [address]);

    const lab01Completed =
        Boolean(metadata?.labsCompleted && metadata?.labsCompleted >= 1);

    const showLab02Next =
        Boolean(metadata?.labsCompleted === 1);

    return (
        <PageShell title="Εργαστήρια Web3Edu">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Page Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Εργαστήρια Web3Edu
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                        Μάθετε Web3 αλληλεπιδρώντας με πραγματική υποδομή blockchain,
                        έξυπνα συμβόλαια και έννοιες ασφάλειας μέσα από πρακτικά εργαστήρια.
                    </p>
                </header>

                {/* How Labs Work */}
                <section className="mb-14">
                    <h2 className="text-xl font-semibold mb-4">
                        Πώς λειτουργούν τα εργαστήρια
                    </h2>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                        <li>• Πρακτικές ασκήσεις πάνω σε πραγματική Web3 υποδομή</li>
                        <li>• Δεν απαιτείται αρχική ρύθμιση για τα περισσότερα εργαστήρια</li>
                        <li>• Σχεδιασμένα για φοιτητές, εκπαιδευτικούς και builders</li>
                    </ul>
                </section>

                {/* Foundational Labs */}
                <section className="mb-16 relative">
                    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                        <h2 className="text-2xl font-semibold mb-6">
                            Θεμελιώδη Εργαστήρια
                        </h2>
                        <p className="max-w-3xl mb-8 text-slate-600 dark:text-slate-300">
                            Χτίστε την Web3 ταυτότητά σας και τα βασικά νοητικά μοντέλα πριν
                            ασχοληθείτε με συναλλαγές ή smart contracts.
                        </p>

                        <div className="space-y-20">
                            {/* 👛 Wallets & Web3 Identities — Featured Card */}
                            <div className="w-full">
                                <Link
                                    to="/labs-gr/wallets-keys"
                                    className="group relative block overflow-hidden rounded-2xl backdrop-blur-sm
                            bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-blue-50/90
                            dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900
                            border border-white/20 dark:border-white/10
                            shadow-xl hover:shadow-2xl transition-all z-10"
                                >
                                    {lab01Completed && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                                bg-green-500/90 text-white text-xs font-semibold
                                                shadow-lg backdrop-blur">
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] min-h-[420px]">
                                        {/* Visual */}
                                        <div className="relative flex items-center justify-center
                              bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10
                              p-6 lg:p-8">
                                            <img
                                                src={lab01IdentityImg}
                                                alt="Ροή Web3 ταυτότητας: πορτοφόλι προς διεύθυνση"
                                                className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/30"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-10 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-3">
                                                    Lab 01 — Πορτοφόλια & Web3 Ταυτότητες
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                    Κατανοήστε πώς τα πορτοφόλια και οι διευθύνσεις θεμελιώνουν
                                                    την ταυτότητα στο Web3 σε ένα αδειοδοτημένο Ethereum δίκτυο,
                                                    πριν από gas, συναλλαγές ή smart contracts.
                                                </p>

                                                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span>🧭 <strong className="font-semibold text-slate-700 dark:text-slate-200">Επίπεδο:</strong> Αρχάριο</span>
                                                    <span>⏱️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Διάρκεια:</strong> 15–20 λεπτά</span>
                                                    <span>🌐 <strong className="font-semibold text-slate-700 dark:text-slate-200">Δίκτυο:</strong> Besu Edu‑Net</span>
                                                    <span>🚫 <strong className="font-semibold text-slate-700 dark:text-slate-200">Συναλλαγές:</strong> Καμία</span>
                                                    <span>🛠️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Εργαλεία:</strong> 3 διαδραστικά εργαλεία</span>
                                                    <span>🏅 <strong className="font-semibold text-slate-700 dark:text-slate-200">Badge:</strong> Εξερευνητής Ταυτότητας</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="inline-flex items-center gap-2
                                  text-indigo-600 dark:text-indigo-400
                                  font-semibold group-hover:translate-x-1 transition">
                                                    Άνοιγμα Lab →
                                                </span>
                                                <span className="text-xs px-3 py-1 rounded-full
                                  bg-indigo-50 dark:bg-indigo-900/30
                                  text-indigo-600 dark:text-indigo-300">
                                                    +100 XP
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="h-8 lg:h-12"></div>

                        {/* Secondary grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {/* 🔐 Encrypted Messages Lab */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm
                          hover:shadow-lg hover:-translate-y-1 transition-all
                          overflow-visible">
                                <div className="flex items-center justify-between mb-3 relative overflow-visible">
                                    <h3 className="text-lg font-semibold">Lab 02 — 🔐 Κρυπτογραφημένα Μηνύματα</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        <BadgeWithTooltip
                                            label="Διαθέσιμο"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Κρυπτογραφία εκτός blockchain<br />
                                                    • Καμία συναλλαγή<br />
                                                    • Κανένα smart contract
                                                </>
                                            }
                                        />
                                        {showLab02Next && (
                                            <span
                                                title="Προτεινόμενο επόμενο εργαστήριο μετά την ολοκλήρωση του Lab 01"
                                                className="
                                                    inline-flex items-center gap-1
                                                    px-2 py-0.5
                                                    text-xs font-semibold uppercase tracking-wide
                                                    rounded-full
                                                    bg-indigo-100 text-indigo-700
                                                    dark:bg-indigo-500/20 dark:text-indigo-300
                                                    ring-1 ring-indigo-400/30
                                                    whitespace-nowrap
                                                "
                                            >
                                                ⭐ NEXT
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Μάθετε πώς λειτουργεί η κρυπτογραφημένη επικοινωνία στο Web3 χρησιμοποιώντας
                                    δημόσια και ιδιωτικά κλειδιά. Θα εξερευνήσετε πώς δημιουργούνται ταυτότητες από
                                    κρυπτογραφικά κλειδιά και πώς τα μηνύματα κρυπτογραφούνται εκτός blockchain,
                                    χωρίς συναλλαγές ή smart contracts.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο → Μεσαίο
                                    </span>
                                    <Link
                                        to="/labs-gr/lab02"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Άνοιγμα Εργαστηρίου →
                                    </Link>
                                </div>
                            </div>

                            {/* ✍️ Message Signing */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Lab 03 — ✍️ Υπογραφή Μηνυμάτων και Ιδιοκτησία</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Σύντομα
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Μάθετε πώς οι κρυπτογραφικές υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση
                                    χωρίς αποκάλυψη ιδιωτικών κλειδιών ή on-chain συναλλαγές.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
                                    </span>
                                    <span className="text-sm text-slate-400">Προεπισκόπηση</span>
                                </div>
                            </div>

                            {/* ⚙️ Consensus & Finality */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Lab 04 — ⚙️ Συναίνεση & Οριστικότητα</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Σύντομα
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Κατανοήστε πώς τα blockchain δίκτυα καταλήγουν σε συμφωνία και
                                    οριστικοποίηση μέσω μηχανισμών ανοχής βυζαντινών σφαλμάτων.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Μεσαίο
                                    </span>
                                    <span className="text-sm text-slate-400">Προεπισκόπηση</span>
                                </div>
                            </div>

                            {/* ⛽ Transactions & Gas */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Lab 05 — ⛽ Συναλλαγές & Gas</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Σύντομα
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Εξερευνήστε πώς εκτελούνται οι συναλλαγές, πώς κοστολογούνται
                                    και πώς ενσωματώνονται στο blockchain.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο → Μεσαίο
                                    </span>
                                    <span className="text-sm text-slate-400">Προεπισκόπηση</span>
                                </div>
                            </div>

                            {/* 📜 First Smart Contract */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Lab 06 — 📜 Έξυπνα Συμβόλαια</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Σύντομα
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Αναπτύξτε και αλληλεπιδράστε με το πρώτο σας έξυπνο συμβόλαιο
                                    για να κατανοήσετε την κατάσταση και την εκτέλεση on-chain.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Μεσαίο
                                    </span>
                                    <span className="text-sm text-slate-400">Προεπισκόπηση</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Applied Labs */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">
                        Εφαρμοσμένα & Project Εργαστήρια
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 🧠 Proof of Escape */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
              bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Lab 07 — 🧠 Proof of Escape</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                    Διαθέσιμο
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και
                                on-chain επαλήθευση βασικών εννοιών blockchain.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Αρχάριο
                                </span>
                                <span className="text-sm text-slate-500">Άνοιγμα Εργαστηρίου</span>
                            </div>
                        </div>

                        {/* 🖼 NFT Marketplace Lab */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
              bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Lab 08 — 🖼 Εργαστήριο NFT Marketplace</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                    Σύντομα
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Δημιουργήστε και αλληλεπιδράστε με ένα απλό NFT marketplace
                                μαθαίνοντας πρότυπα token, ιδιοκτησία και on-chain γεγονότα.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Μεσαίο
                                </span>
                                <span className="text-sm text-slate-400">Προεπισκόπηση</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </PageShell>
    );
};

export default LabsGR;
