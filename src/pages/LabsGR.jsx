// Animation: Όταν ένα εργαστήριο επισημαίνεται ως ολοκληρωμένο, το badge "✓ Ολοκληρώθηκε" εμφανίζεται
// με ένα διακριτικό fade και scale χρησιμοποιώντας το Tailwind: animate-[fadeInScale_300ms_ease-out].
// Έτσι δηλώνεται οπτικά η ολοκλήρωση χωρίς να επηρεάζεται το layout ή η λογική.
import PageShell from "../components/PageShell.jsx";
import { Link } from "react-router-dom";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.png";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BadgeWithTooltip from "../components/BadgeWithTooltip.jsx";

const LabsGR = () => {
    const { address } = useAccount();
    const [lab01Completed, setLab01Completed] = useState(false);
    const [lab02Completed, setLab02Completed] = useState(false);
    const [lab03Completed, setLab03Completed] = useState(false);
    const [lab04Completed, setLab04Completed] = useState(false);
    const [lab05Completed, setLab05Completed] = useState(false);
    const [lab06Completed, setLab06Completed] = useState(false);
    const [poeCompleted, setPoeCompleted] = useState(false);
    useEffect(() => {
        if (!address) {
            setPoeCompleted(false);
            return;
        }
        const controller = new AbortController();
        fetch(
            `https://web3edu-api.dimikog.org/projects/poe/status?address=${address}`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setPoeCompleted(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Proof of Escape", err);
                }
            });
        return () => controller.abort();
    }, [address]);
    useEffect(() => {
        if (!address) {
            setLab06Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab06`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab06Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 06", err);
                }
            });

        return () => controller.abort();
    }, [address]);
    useEffect(() => {
        if (!address) {
            setLab05Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab05`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab05Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 05", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    useEffect(() => {
        if (!address) {
            setLab01Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab01`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab01Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 01", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    useEffect(() => {
        if (!address) {
            setLab02Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab02`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab02Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 02", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    useEffect(() => {
        if (!address) {
            setLab03Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab03`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab03Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 03", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    useEffect(() => {
        if (!address) {
            setLab04Completed(false);
            return;
        }

        const controller = new AbortController();

        fetch(
            `https://web3edu-api.dimikog.org/labs/status?address=${address}&labId=lab04`,
            { signal: controller.signal }
        )
            .then(res => res.json())
            .then(data => {
                setLab04Completed(Boolean(data?.completed));
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Lab 04", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    const showLab02Next =
        Boolean(lab01Completed && !lab02Completed);

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
                        smart contracts και έννοιες ασφάλειας μέσα από πρακτικά εργαστήρια.
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
                            από συναλλαγές ή smart contracts.
                        </p>

                        {/* 📊 Πρόοδος Θεμελιωδών Εργαστηρίων */}
                        <div className="mb-10">
                            {(() => {
                                const completedCount = [
                                    lab01Completed,
                                    lab02Completed,
                                    lab03Completed,
                                    lab04Completed,
                                    lab05Completed,
                                    lab06Completed,
                                ].filter(Boolean).length;

                                const progressPercent = Math.round((completedCount / 6) * 100);

                                return (
                                    <div className="max-w-xl">
                                        <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            <span>Πρόοδος Θεμελιωδών Εργαστηρίων</span>
                                            <span>{completedCount} / 6 ολοκληρωμένα</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                        {completedCount === 6 && (
                                            <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                🎉 Όλα τα θεμελιώδη εργαστήρια ολοκληρώθηκαν!
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

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
                                                shadow-lg backdrop-blur
                                                transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]">
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
                                                <p className="text-xs italic text-slate-600/90 dark:text-slate-300/80 mb-4">
                                                    Παιδαγωγική ιδέα: <span className="not-italic">Το πορτοφόλι σας είναι η Web3 ταυτότητά σας — πριν από οποιεσδήποτε συναλλαγές.</span>
                                                </p>
                                                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                    Κατανοήστε πώς πορτοφόλια και διευθύνσεις θεμελιώνουν την Web3 ταυτότητα
                                                    σε ένα αδειοδοτημένο Ethereum δίκτυο — πριν από συναλλαγές, gas ή smart contracts.
                                                </p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
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

                        {/* Secondary grid of foundational labs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {/* 🔐 Encrypted Messages Lab */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-visible">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">
                                        Lab 02 — 🔐 Κρυπτογραφημένα Μηνύματα
                                    </h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Διαθέσιμο */}
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
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Ολοκληρώθηκε */}
                                        {lab02Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        )}
                                        {/* 3. ΕΠΟΜΕΝΟ */}
                                        {showLab02Next && (
                                            <span
                                                title="Προτεινόμενο επόμενο εργαστήριο μετά την ολοκλήρωση του Lab 01"
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap uppercase tracking-wide bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 ring-1 ring-indigo-400/30 font-semibold"
                                            >
                                                ⭐ ΕΠΟΜΕΝΟ
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Παιδαγωγική ιδέα: <span className="not-italic">Η ιδιωτικότητα στο Web3 ξεκινά εκτός αλυσίδας με κρυπτογράφηση.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Μάθετε πώς λειτουργεί η κρυπτογραφημένη επικοινωνία στο Web3 με κρυπτογραφία δημοσίου κλειδιού
                                    και off-chain κρυπτογράφηση — χωρίς συναλλαγές ή smart contracts.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
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
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 03 — ✍️ Υπογραφή Μηνυμάτων & Ιδιοκτησία</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Διαθέσιμο */}
                                        <BadgeWithTooltip
                                            label="Διαθέσιμο"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Απόδειξη ιδιοκτησίας & πρόθεσης<br />
                                                    • Καμία συναλλαγή<br />
                                                    • Καμία αποκάλυψη ιδιωτικού κλειδιού
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Ολοκληρώθηκε */}
                                        {lab03Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Παιδαγωγική ιδέα: <span className="not-italic">Οι υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση χωρίς gas.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Μάθετε πώς οι κρυπτογραφικές υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση — χωρίς αποκάλυψη ιδιωτικών κλειδιών
                                    ή on-chain συναλλαγές.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
                                    </span>
                                    <Link
                                        to="/labs-gr/lab03"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Άνοιγμα Εργαστηρίου →
                                    </Link>
                                </div>
                            </div>

                            {/* ⛽ Transactions & Gas */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 04 — ⛽ Συναλλαγές & Gas</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Διαθέσιμο */}
                                        <BadgeWithTooltip
                                            label="Διαθέσιμο"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    On-chain συναλλαγές<br />
                                                    • Gas & εκτέλεση<br />
                                                    • Αλλαγές κατάστασης
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Ολοκληρώθηκε */}
                                        {lab04Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Παιδαγωγική ιδέα: <span className="not-italic">Οι on-chain ενέργειες κοστίζουν gas και αλλάζουν μόνιμα την κατάσταση.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Αλληλεπιδράστε με την πρώτη σας on-chain συναλλαγή και μάθετε πώς λειτουργούν το gas,
                                    η εκτέλεση και οι αλλαγές κατάστασης.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
                                    </span>
                                    <Link
                                        to="/labs-gr/lab04"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Άνοιγμα Εργαστηρίου →
                                    </Link>
                                </div>
                            </div>

                            {/* 📜 Smart Contracts & State */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 05 — 📜 Έξυπνα Συμβόλαια &amp; Κατάσταση</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Διαθέσιμο */}
                                        <BadgeWithTooltip
                                            label="Διαθέσιμο"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Αλληλεπίδραση με smart contract<br />
                                                    • On-chain κατάσταση<br />
                                                    • Read & write calls
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Ολοκληρώθηκε */}
                                        {lab05Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Παιδαγωγική ιδέα: <span className="not-italic">Το READ είναι δωρεάν, το WRITE είναι συναλλαγή.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Αλληλεπιδράστε με ένα πραγματικό έξυπνο συμβόλαιο και μάθετε πώς λειτουργούν
                                    η on-chain κατάσταση, τα reads και τα writes.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
                                    </span>
                                    <Link
                                        to="/labs-gr/lab05"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Άνοιγμα Εργαστηρίου →
                                    </Link>
                                </div>
                            </div>

                            {/* ⚙️ Consensus & Finality */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 06 — ⚙️ Συναίνεση & Οριστικότητα</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Διαθέσιμο */}
                                        <BadgeWithTooltip
                                            label="Διαθέσιμο"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Συμφωνία validators<br />
                                                    • Συναίνεση<br />
                                                    • Οριστικότητα
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Ολοκληρώθηκε */}
                                        {lab06Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Ολοκληρώθηκε
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Παιδαγωγική ιδέα: <span className="not-italic">Η συναίνεση επιλέγει μία αλυσίδα, η οριστικότητα την κλειδώνει.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Εξερευνήστε πώς οι validators καταλήγουν σε συμφωνία και πότε τα blocks γίνονται πραγματικά οριστικά.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Αρχάριο
                                    </span>
                                    <Link
                                        to="/labs-gr/lab06"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Άνοιγμα Εργαστηρίου →
                                    </Link>
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
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between mb-3 gap-2">
                                <h3 className="text-lg font-semibold">Lab 07 — 🧠 Proof of Escape</h3>
                                <div className="flex items-center gap-2 flex-nowrap">
                                    {/* 1. Διαθέσιμο */}
                                    <BadgeWithTooltip
                                        label="Διαθέσιμο"
                                        variant="success"
                                        tooltip="On-chain επαληθευμένο project lab"
                                        className="rounded-full text-xs whitespace-nowrap"
                                    />
                                    {/* 2. Ολοκληρώθηκε */}
                                    {poeCompleted && (
                                        <span
                                            title="Ολοκληρώθηκε μέσω on-chain απόδειξης"
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                                       text-xs whitespace-nowrap bg-green-500/90 text-white
                                                       font-semibold shadow-lg backdrop-blur
                                                       transition transform
                                                       motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                        >
                                            ✓ Ολοκληρώθηκε
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 min-h-[96px]">
                                Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και
                                on-chain επαλήθευση βασικών εννοιών.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Αρχάριο
                                </span>
                                <Link
                                    to="/labs-gr/proof-of-escape"
                                    className="text-sm font-semibold text-indigo-600 hover:underline"
                                >
                                    Άνοιγμα Εργαστηρίου
                                </Link>
                            </div>
                        </div>

                        {/* 🖼 NFT Marketplace Lab */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Lab 08 — 🖼 Εργαστήριο NFT Marketplace</h3>
                                <span className="rounded-full text-xs whitespace-nowrap px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 font-semibold">
                                    Σύντομα
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 min-h-[96px]">
                                Δημιουργήστε και αλληλεπιδράστε με ένα απλό NFT marketplace
                                μαθαίνοντας πρότυπα token, ιδιοκτησία και on-chain γεγονότα.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Μεσαίο
                                </span>
                                <span className="text-sm text-slate-400">Μη διαθέσιμο</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </PageShell>
    );
};

export default LabsGR;
