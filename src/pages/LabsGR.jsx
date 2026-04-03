import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import PageShell from "../components/PageShell.jsx";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.webp";

const BACKEND =
    import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";

const CATEGORY_LABELS = {
    foundational: "Θεμελιώδη Labs",
    dao: "Εργαστήρια DAO & Διακυβέρνησης",
    project: "Εφαρμοσμένα Εργαστήρια",
};

const CORE_LAB_IDS = ["lab01", "lab02", "lab03", "lab04", "lab05", "lab06"];

const LAB_ROUTES_GR = {
    lab01: "/labs-gr/wallets-keys",
    lab02: "/labs-gr/lab02",
    lab03: "/labs-gr/lab03",
    lab04: "/labs-gr/lab04",
    lab05: "/labs-gr/lab05",
    lab06: "/labs-gr/lab06",
    dao01: "/labs-gr/dao-01",
    dao02: "/labs-gr/dao-02",
};

const FOUNDATIONAL_COPY_GR = {
    lab02: {
        title: "Lab 02 — 🔐 Κρυπτογραφημένα Μηνύματα",
        hint: "Η ιδιωτικότητα στο Web3 ξεκινά εκτός αλυσίδας με κρυπτογράφηση.",
        description:
            "Μάθετε πώς λειτουργεί η κρυπτογραφημένη επικοινωνία στο Web3 με κρυπτογραφία δημοσίου κλειδιού και off-chain κρυπτογράφηση — χωρίς συναλλαγές ή smart contracts.",
    },
    lab03: {
        title: "Lab 03 — ✍️ Υπογραφή Μηνυμάτων & Ιδιοκτησία",
        hint: "Οι υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση χωρίς gas.",
        description:
            "Μάθετε πώς οι κρυπτογραφικές υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση — χωρίς αποκάλυψη ιδιωτικών κλειδιών ή on-chain συναλλαγές.",
    },
    lab04: {
        title: "Lab 04 — ⛽ Συναλλαγές & Gas",
        hint: "Οι on-chain ενέργειες κοστίζουν gas και αλλάζουν μόνιμα την κατάσταση.",
        description:
            "Αλληλεπιδράστε με την πρώτη σας on-chain συναλλαγή και μάθετε πώς λειτουργούν το gas, η εκτέλεση και οι αλλαγές κατάστασης.",
    },
    lab05: {
        title: "Lab 05 — 📜 Έξυπνα Συμβόλαια & Κατάσταση",
        hint: "Το READ είναι δωρεάν, το WRITE είναι συναλλαγή.",
        description:
            "Αλληλεπιδράστε με ένα πραγματικό έξυπνο συμβόλαιο και μάθετε πώς λειτουργούν η on-chain κατάσταση, τα reads και τα writes.",
    },
    lab06: {
        title: "Lab 06 — ⚙️ Συναίνεση & Οριστικότητα",
        hint: "Η συναίνεση επιλέγει μία αλυσίδα, η οριστικότητα την κλειδώνει.",
        description:
            "Εξερευνήστε πώς οι validators καταλήγουν σε συμφωνία και πότε τα blocks γίνονται πραγματικά οριστικά.",
    },
};

const DAO_COPY_GR = {
    dao01: {
        title: "DAO Lab 01 — 🗳️ Διακυβέρνηση & Ψηφοφορία",
        description:
            "Συμμετέχετε σε μια προσομοιωμένη διαδικασία διακυβέρνησης DAO και καταθέστε πραγματική ψήφο μέσω υπογραφής wallet. Μάθετε πώς λειτουργούν οι προτάσεις, η ισχύς ψήφου και η συλλογική λήψη αποφάσεων στα DAO — χωρίς ανάπτυξη παραγωγικού συστήματος.",
        level: "Ενδιάμεσο",
    },
    dao02: {
        title: "DAO Lab 02 — 🏛️ Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος",
        description:
            "Σχεδιάστε κανόνες ψηφοφορίας, ρυθμίστε quorum και approval thresholds και δείτε πώς το ίδιο σύνολο ψήφων οδηγεί σε διαφορετικά αποτελέσματα ανάλογα με το μοντέλο διακυβέρνησης.",
        level: "Προχωρημένο",
    },
};

const PROJECT_COPY_GR = {
    poe01: {
        title: "Lab 01 — 🧠 Proof of Escape",
        description:
            "Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.",
        level: "Αρχάριο",
    },
    "proof-of-escape": {
        title: "Lab 01 — 🧠 Proof of Escape",
        description:
            "Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.",
        level: "Αρχάριο",
    },
};

const CATEGORY_DESCRIPTIONS = {
    foundational:
        "Χτίσε τα βασικά νοητικά μοντέλα του Web3 πριν περάσεις σε governance και βαθύτερους μηχανισμούς πρωτοκόλλου.",
    dao:
        "Εξερευνήστε την αποκεντρωμένη διακυβέρνηση, τη συλλογική λήψη αποφάσεων και τους μηχανισμούς DAO μέσω καθοδηγούμενων προσομοιώσεων και πραγματικών κρυπτογραφικών ενεργειών.",
    project:
        "Εφαρμοσμένα labs και project-style προκλήσεις που συνδέουν τις βασικές έννοιες με πιο ολοκληρωμένες Web3 ροές.",
};

const sortLabs = (labs) =>
    [...labs].sort((a, b) => {
        const orderDiff = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
        if (orderDiff !== 0) return orderDiff;
        return String(a.id).localeCompare(String(b.id));
    });

const statusTone = (completed) =>
    completed
        ? "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30"
        : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30";

export default function LabsGR() {
    const { address } = useAccount();
    const [labsRegistry, setLabsRegistry] = useState([]);
    const [completionMap, setCompletionMap] = useState({});
    const [poeCompleted, setPoeCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        fetch(`${BACKEND}/labs`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const items = Object.entries(data || {}).map(([id, lab]) => ({
                    id,
                    ...lab,
                }));
                setLabsRegistry(sortLabs(items.filter((lab) => lab.active !== false)));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης του registry των labs", err);
                    setLabsRegistry([]);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (labsRegistry.length === 0) {
            setCompletionMap({});
            return;
        }

        if (!address) {
            setCompletionMap(
                Object.fromEntries(labsRegistry.map((lab) => [lab.id, false]))
            );
            return;
        }

        const controller = new AbortController();
        setStatusLoading(true);

        Promise.all(
            labsRegistry.map(async (lab) => {
                const res = await fetch(
                    `${BACKEND}/labs/status?address=${address}&labId=${lab.id}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                return [lab.id, Boolean(data?.completed)];
            })
        )
            .then((entries) => {
                setCompletionMap(Object.fromEntries(entries));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης καταστάσεων ολοκλήρωσης labs", err);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setStatusLoading(false);
                }
            });

        return () => controller.abort();
    }, [address, labsRegistry]);

    useEffect(() => {
        if (!address) {
            setPoeCompleted(false);
            return;
        }

        const controller = new AbortController();

        fetch(`${BACKEND}/projects/poe/status?address=${address}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setPoeCompleted(Boolean(data?.completed));
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Αποτυχία φόρτωσης κατάστασης Proof of Escape", err);
                }
            });

        return () => controller.abort();
    }, [address]);

    const groupedLabs = useMemo(() => {
        const groups = new Map();
        for (const lab of labsRegistry) {
            const category = lab.category || "other";
            if (!groups.has(category)) groups.set(category, []);
            groups.get(category).push(lab);
        }
        return [...groups.entries()];
    }, [labsRegistry]);

    const foundationalLabs = labsRegistry.filter(
        (lab) => lab.category === "foundational" && CORE_LAB_IDS.includes(lab.id)
    );
    const featuredLab = foundationalLabs.find((lab) => lab.id === "lab01") || null;
    const remainingFoundationalLabs = foundationalLabs.filter((lab) => lab.id !== "lab01");
    const daoLabs = labsRegistry.filter((lab) => lab.category === "dao");
    const otherSections = groupedLabs.filter(
        ([category]) => category !== "foundational" && category !== "dao" && category !== "project"
    );

    const completedCount = foundationalLabs.filter((lab) => Boolean(completionMap[lab.id])).length;
    const totalCount = CORE_LAB_IDS.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <PageShell title="Web3Edu Labs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Εργαστήρια Web3Edu
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                        Ο κατάλογος των labs φορτώνεται πλέον απευθείας από το backend registry,
                        ώστε νέα labs να εμφανίζονται εδώ χωρίς hardcoded frontend λίστα.
                    </p>
                </header>

                {loading ? (
                    <p className="text-slate-600 dark:text-slate-300">Φόρτωση labs...</p>
                ) : groupedLabs.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-300">
                        Δεν επιστράφηκαν labs από το backend registry.
                    </p>
                ) : (
                    <div className="space-y-14">
                        {foundationalLabs.length > 0 ? (
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">Θεμελιώδη Labs</h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        Χτίσε την Web3 ταυτότητά σου και τα βασικά νοητικά μοντέλα πριν περάσεις σε συναλλαγές ή smart contracts.
                                    </p>
                                </div>

                                <div className="mb-10 max-w-xl">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <span>Πρόοδος Θεμελιωδών Labs</span>
                                        <span>{completedCount} / {totalCount} ολοκληρωμένα</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {featuredLab ? (
                                    <div className="mb-10">
                                        <Link
                                            to={LAB_ROUTES_GR[featuredLab.id] || `/labs-gr/${featuredLab.slug || featuredLab.id}`}
                                            className="group relative block overflow-hidden rounded-2xl backdrop-blur-sm bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-blue-50/90 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all"
                                        >
                                            {completionMap[featuredLab.id] ? (
                                                <div className="absolute top-4 right-4 z-20">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold shadow-lg backdrop-blur">
                                                        ✓ Ολοκληρώθηκε
                                                    </span>
                                                </div>
                                            ) : null}
                                            <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] min-h-[420px]">
                                                <div className="relative flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-6 lg:p-8">
                                                    <img
                                                        src={lab01IdentityImg}
                                                        alt="Web3 identity flow: wallet to address to identity"
                                                        className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/30"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="p-10 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-indigo-300">
                                                            {featuredLab.title?.gr || featuredLab.title?.en || "Lab 01 — Πορτοφόλια & Web3 Ταυτότητα"}
                                                        </h3>
                                                        <p className="text-xs italic text-slate-600/90 dark:text-slate-300/80 mb-4">
                                                            Παιδαγωγική υπόδειξη: Το wallet σου είναι η Web3 ταυτότητά σου πριν συμβεί οποιαδήποτε συναλλαγή.
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                            {featuredLab.description?.gr || featuredLab.description?.en}
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <span>🧭 <strong className="font-semibold text-slate-700 dark:text-slate-200">Επίπεδο:</strong> {featuredLab.level || "Beginner"}</span>
                                                            <span>⏱️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Χρόνος:</strong> {featuredLab.estimated_time_minutes || "15-20"} λεπτά</span>
                                                            <span>🌐 <strong className="font-semibold text-slate-700 dark:text-slate-200">Δίκτυο:</strong> Besu Edu-Net</span>
                                                            <span>🚫 <strong className="font-semibold text-slate-700 dark:text-slate-200">Συναλλαγές:</strong> Καμία</span>
                                                            <span>🛠️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Εργαλεία:</strong> 3 διαδραστικά εργαλεία</span>
                                                            <span>🏅 <strong className="font-semibold text-slate-700 dark:text-slate-200">Badge:</strong> {featuredLab.badge?.label?.gr || featuredLab.badge?.label?.en || featuredLab.badge?.id || "Identity Explorer"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex items-center justify-between">
                                                        <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition">
                                                            Έναρξη Lab →
                                                        </span>
                                                        <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                                                            +{featuredLab.xp || 100} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ) : null}

                                {remainingFoundationalLabs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {remainingFoundationalLabs.map((lab) => {
                                            const completed = Boolean(completionMap[lab.id]);
                                            const copy = FOUNDATIONAL_COPY_GR[lab.id] || {};
                                            const title = copy.title || lab.title?.gr || lab.title?.en || lab.id;
                                            const description = copy.description || lab.description?.gr || lab.description?.en || "";
                                            const hint = copy.hint || null;
                                            const badge = lab.badge?.label?.gr || lab.badge?.label?.en || lab.badge?.id;
                                            const link = LAB_ROUTES_GR[lab.id] || `/labs-gr/${lab.slug || lab.id}`;
                                            const showNext =
                                                lab.id === "lab02" &&
                                                Boolean(completionMap.lab01) &&
                                                !Boolean(completionMap.lab02);

                                            return (
                                                <Link
                                                    key={lab.id}
                                                    to={link}
                                                    className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/45 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                                >
                                                    <div className="flex items-start justify-between gap-3 mb-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                                {lab.id}
                                                            </p>
                                                            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                                {title}
                                                            </h3>
                                                        </div>
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(completed)}`}
                                                        >
                                                            {completed ? "Ολοκληρώθηκε" : "Διαθέσιμο"}
                                                        </span>
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                ⭐ ΕΠΟΜΕΝΟ
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    {hint ? (
                                                        <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                            Παιδαγωγική ιδέα: <span className="not-italic">{hint}</span>
                                                        </p>
                                                    ) : null}
                                                    <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                                        {description}
                                                    </p>

                                                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                                        {lab.level ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {lab.level}
                                                            </span>
                                                        ) : null}
                                                        {lab.estimated_time_minutes ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {lab.estimated_time_minutes} λεπτά
                                                            </span>
                                                        ) : null}
                                                        {typeof lab.xp === "number" ? (
                                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-indigo-700 dark:text-indigo-300">
                                                                +{lab.xp} XP
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    {badge ? (
                                                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                            Badge: <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                        </p>
                                                    ) : null}

                                                    <div className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                        Άνοιγμα Lab →
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </section>
                        ) : null}

                        {daoLabs.length > 0 ? (
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">Εργαστήρια DAO & Διακυβέρνησης</h2>
                                    <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                        Εξερευνήστε την αποκεντρωμένη διακυβέρνηση, τη συλλογική λήψη αποφάσεων και τους μηχανισμούς DAO μέσω καθοδηγούμενων προσομοιώσεων και πραγματικών κρυπτογραφικών ενεργειών.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {daoLabs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const showNext =
                                            lab.id === "dao02" &&
                                            Boolean(completionMap.dao01) &&
                                            !Boolean(completionMap.dao02);
                                        const copy = DAO_COPY_GR[lab.id] || {};
                                        const title = copy.title || lab.title?.gr || lab.title?.en || lab.id;
                                        const description = copy.description || lab.description?.gr || lab.description?.en || "";
                                        const link = LAB_ROUTES_GR[lab.id] || `/labs-gr/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/45 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                                                            Διαθέσιμο
                                                        </span>
                                                        {completed ? (
                                                            <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                                ✓ Ολοκληρώθηκε
                                                            </span>
                                                        ) : null}
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                ⭐ ΕΠΟΜΕΝΟ
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                                    {description}
                                                </p>

                                                <div className="mt-5 flex items-center justify-between gap-4">
                                                    <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                                        {copy.level || lab.level || "Ενδιάμεσο"}
                                                    </span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                            +{lab.xp || 0} XP
                                                        </span>
                                                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                            Άνοιγμα Lab →
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : null}

                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">Εφαρμοσμένα Εργαστήρια</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Link
                                    to="/labs-gr/proof-of-escape"
                                    className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/45 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Lab 01 — 🧠 Proof of Escape
                                        </h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                                                Διαθέσιμο
                                            </span>
                                            {poeCompleted ? (
                                                <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                    ✓ Ολοκληρώθηκε
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            Αρχάριο
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                +500 XP
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                Άνοιγμα Lab →
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/45 p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Lab 02 — 🖼 Εργαστήριο NFT Marketplace
                                        </h3>
                                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            Coming Soon
                                        </span>
                                    </div>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        Δημιουργήστε και αλληλεπιδράστε με μια απλή αγορά NFTs ενώ μαθαίνετε για token standards, ownership και on-chain events.
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            Ενδιάμεσο
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {otherSections.map(([category, labs]) => (
                            <section key={category}>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">
                                        {CATEGORY_LABELS[category] || category}
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        {CATEGORY_DESCRIPTIONS[category] || "Labs που εκτίθενται από το backend registry."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {labs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const copy = PROJECT_COPY_GR[lab.id] || PROJECT_COPY_GR[lab.slug] || {};
                                        const title = copy.title || lab.title?.gr || lab.title?.en || lab.id;
                                        const description = copy.description || lab.description?.gr || lab.description?.en || "";
                                        const badge = lab.badge?.label?.gr || lab.badge?.label?.en || lab.badge?.id;
                                        const link = LAB_ROUTES_GR[lab.id] || `/labs-gr/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/45 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                            {lab.id}
                                                        </p>
                                                        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                            {title}
                                                        </h3>
                                                    </div>
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(completed)}`}
                                                    >
                                                        {completed ? "Ολοκληρώθηκε" : "Διαθέσιμο"}
                                                    </span>
                                                </div>

                                                <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                                    {description}
                                                </p>

                                                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                                        {copy.level || lab.level ? (
                                                            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                                {copy.level || lab.level}
                                                            </span>
                                                        ) : null}
                                                    {lab.estimated_time_minutes ? (
                                                        <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                                                            {lab.estimated_time_minutes} λεπτά
                                                        </span>
                                                    ) : null}
                                                    {typeof lab.xp === "number" ? (
                                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-indigo-700 dark:text-indigo-300">
                                                            +{lab.xp} XP
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {badge ? (
                                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                        Badge: <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                    </p>
                                                ) : null}

                                                <div className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                    Άνοιγμα Lab →
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </PageShell>
    );
}
