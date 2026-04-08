import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import PageShell from "../components/PageShell.jsx";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.webp";

const BACKEND =
    import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";

const CATEGORY_LABELS = {
    foundational: "Foundational Labs",
    dao: "DAO & Governance Labs",
    project: "Applied Labs",
};

const CORE_LAB_IDS = ["lab01", "lab02", "lab03", "lab04", "lab05", "lab06"];

const LAB_ROUTES = {
    lab01: "/labs/wallets-keys",
    lab02: "/labs/lab02",
    lab03: "/labs/lab03",
    lab04: "/labs/lab04",
    lab05: "/labs/lab05",
    lab06: "/labs/lab06",
    dao01: "/labs/dao-01",
    dao02: "/labs/dao-02",
    "system-s0": "/labs/system/s0",
    "system-s1": "/labs/system/s1",
    "system-s2": "/labs/system/s2",
};

const FOUNDATIONAL_COPY = {
    lab02: {
        title: "Lab 02 — 🔐 Encrypted Messages",
        hint: "Privacy in Web3 starts off‑chain with encryption.",
        description:
            "Learn how encrypted communication works in Web3 using public‑key cryptography and off‑chain message encryption — without blockchain transactions or smart contracts.",
    },
    lab03: {
        title: "Lab 03 — ✍️ Message Signing & Ownership",
        hint: "Signatures prove ownership and intent without spending gas.",
        description:
            "Learn how cryptographic signatures prove ownership and intent — without revealing private keys or sending on‑chain transactions.",
    },
    lab04: {
        title: "Lab 04 — ⛽ Transactions & Gas",
        hint: "On‑chain actions cost gas and permanently change state.",
        description:
            "Interact with your first blockchain transaction and learn how gas, execution, and state changes work on-chain.",
    },
    lab05: {
        title: "Lab 05 — 📜 Smart Contracts & State",
        hint: "READ is a free call; WRITE is a transaction.",
        description:
            "Interact with a real smart contract and learn how on‑chain state, reads, and writes work.",
    },
    lab06: {
        title: "Lab 06 — ⚙️ Consensus & Finality",
        hint: "Consensus picks one chain; finality locks it.",
        description:
            "Explore how validators reach agreement and when blocks become truly final.",
    },
};

const DAO_COPY = {
    dao01: {
        title: "DAO Lab 01 — 🗳️ Governance & Voting",
        hint: "A wallet signature is a vote — no transaction needed, no gas spent.",
        description:
            "Participate in a simulated DAO governance process and cast a real vote using your wallet signature. Learn how proposals, voting power, and collective decision-making work in DAOs — without deploying a production system.",
        level: "Intermediate",
        badge: "Governance Participant",
    },
    dao02: {
        title: "DAO Lab 02 — 🏛 Governance Models & Power Dynamics",
        hint: "Governance rules are code — the same votes produce different outcomes depending on how power is distributed.",
        description:
            "Explore how governance outcomes depend on rule design. Select different voting models, adjust quorum and approval thresholds, and observe how identical community intent can lead to different results depending on how voting power is distributed.",
        level: "Advanced",
        badge: "Governance Architect",
    },
};

const PROJECT_COPY = {
    poe01: {
        title: "Lab 01 — 🧠 Proof of Escape",
        description:
            "A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.",
        level: "Beginner",
    },
    "proof-of-escape": {
        title: "Lab 01 — 🧠 Proof of Escape",
        hint: "Completion is on-chain — your NFT badge is cryptographic proof you understood the concepts.",
        description:
            "A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.",
        level: "Beginner",
        badge: "Proof of Escape",
    },
};

const CARD_ACCENT = {
    foundational: "bg-blue-500/10 border-blue-400/20 dark:bg-blue-500/20 dark:border-blue-400/30",
    system:       "bg-indigo-500/10 border-indigo-400/20 dark:bg-indigo-500/20 dark:border-indigo-400/30",
    dao:          "bg-green-500/10 border-green-400/20 dark:bg-green-500/20 dark:border-green-400/30",
    project:      "bg-orange-500/10 border-orange-400/20 dark:bg-orange-500/20 dark:border-orange-400/30",
};

const CATEGORY_BADGE = {
    foundational: "bg-blue-500/10 text-blue-700 dark:text-blue-300 dark:bg-blue-500/20",
    system:       "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-500/20",
    dao:          "bg-green-500/10 text-green-700 dark:text-green-300 dark:bg-green-500/20",
    project:      "bg-orange-500/10 text-orange-700 dark:text-orange-300 dark:bg-orange-500/20",
};

const CATEGORY_BADGE_LABEL = {
    foundational: "Foundational",
    system:       "System",
    dao:          "DAO",
    project:      "Applied",
};

const CATEGORY_DESCRIPTIONS = {
    foundational:
        "Build core Web3 mental models before moving into governance and deeper protocol mechanics.",
    dao:
        "Explore decentralized governance, collective decision-making, and DAO mechanics through guided simulations and real cryptographic actions.",
    project:
        "Applied labs and project-style challenges that connect the core concepts to more complete Web3 flows.",
};

const SYSTEM_LABS = [
    {
        id: "system-s0",
        title: "System Lab S0 — 🏰 Why Consensus Is Hard",
        hint: "Consensus exists because honest participants can still see different local realities.",
        description:
            "Explore the Byzantine Generals Problem and see why distributed systems need explicit consensus rules before they can agree safely.",
        level: "Intermediate",
        xp: 200,
        link: "/labs/system/s0",
        cta: "Open Lab →",
        status: "Available",
        badge: "Consensus Analyst",
    },
    {
        id: "system-s1",
        title: "SysLab01 — ⛏️ PoW Mining",
        hint: "Changing one byte invalidates every block that follows — this is why blockchains are tamper-evident.",
        description:
            "Trace how blocks connect into a secure chain, break that chain by editing data, and repair it through Proof of Work intuition.",
        level: "Intermediate",
        xp: 300,
        link: "/labs/system/s1",
        cta: "Open Lab →",
        status: "Available",
        badge: "System Thinker",
    },
    {
        id: "system-s2",
        title: "SysLab02 — 🔄 Transaction to State Change",
        hint: "Transactions do not just move data around. They trigger execution that changes blockchain state.",
        description:
            "Follow how a transaction is executed by the system and how that execution results in a persistent state change on-chain.",
        level: "Intermediate",
        xp: 300,
        link: "/labs/system/s2",
        cta: "Open Lab →",
        status: "Available",
        badge: "State Change Explorer",
    },
];

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

export default function Labs() {
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
                    console.error("Failed to load labs registry", err);
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
                    console.error("Failed to load lab completion statuses", err);
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
                    console.error("Failed to load Proof of Escape status", err);
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
    const systemLabs = labsRegistry.filter((lab) => lab.category === "system");
    const displayedSystemLabs = SYSTEM_LABS.map((fallbackLab) => {
        const backendLab = systemLabs.find((lab) => lab.id === fallbackLab.id);
        return {
            id: fallbackLab.id,
            title: fallbackLab.title || backendLab?.title?.en || fallbackLab.id,
            hint: fallbackLab.hint || null,
            description: backendLab?.description?.en || fallbackLab.description,
            level: backendLab?.level || fallbackLab.level,
            xp: typeof backendLab?.xp === "number" ? backendLab.xp : fallbackLab.xp,
            link: LAB_ROUTES[fallbackLab.id] || fallbackLab.link,
            cta: fallbackLab.cta,
            status: Boolean(completionMap[fallbackLab.id]) ? "Completed" : "Available",
            completed: Boolean(completionMap[fallbackLab.id]),
            badge:
                backendLab?.badge?.label?.en ||
                backendLab?.badge?.label ||
                backendLab?.badge?.id ||
                fallbackLab.badge,
        };
    });
    const otherSections = groupedLabs.filter(
        ([category]) => category !== "foundational" && category !== "dao" && category !== "project" && category !== "system"
    );

    const completedCount = foundationalLabs.filter((lab) => Boolean(completionMap[lab.id])).length;
    const totalCount = CORE_LAB_IDS.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <PageShell title="Web3Edu Labs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Web3Edu Labs
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                        Hands-on exercises that take you from wallet basics to governance mechanics
                        and applied Web3 challenges — each lab builds on the last.
                    </p>
                </header>

                {loading ? (
                    <p className="text-slate-600 dark:text-slate-300">Loading labs...</p>
                ) : groupedLabs.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-300">
                        No labs were returned by the backend registry.
                    </p>
                ) : (
                    <div className="space-y-14">
                        {foundationalLabs.length > 0 ? (
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">Foundational Labs</h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        Build your Web3 identity and core mental models before touching transactions or smart contracts.
                                    </p>
                                </div>

                                <div className="mb-10 max-w-xl">
                                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <span>Foundational Labs Progress</span>
                                        <span>{completedCount} / {totalCount} completed</span>
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
                                            to={LAB_ROUTES[featuredLab.id] || `/labs/${featuredLab.slug || featuredLab.id}`}
                                            className="group relative block overflow-hidden rounded-2xl backdrop-blur-sm bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-blue-50/90 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all"
                                        >
                                            {completionMap[featuredLab.id] ? (
                                                <div className="absolute top-4 right-4 z-20">
                                                    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-semibold leading-none text-white shadow-lg backdrop-blur">
                                                        ✓ Completed
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
                                                            {featuredLab.title?.en || "Lab 01 — Wallets & Web3 Identity"}
                                                        </h3>
                                                        <p className="text-xs italic text-slate-600/90 dark:text-slate-300/80 mb-4">
                                                            Pedagogy hint: Your wallet is your Web3 identity — before transactions ever happen.
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                            {featuredLab.description?.en}
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <span>🧭 <strong className="font-semibold text-slate-700 dark:text-slate-200">Level:</strong> {featuredLab.level || "Beginner"}</span>
                                                            <span>⏱️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Time:</strong> {featuredLab.estimated_time_minutes || "15-20"} minutes</span>
                                                            <span>🌐 <strong className="font-semibold text-slate-700 dark:text-slate-200">Network:</strong> Besu Edu-Net</span>
                                                            <span>🚫 <strong className="font-semibold text-slate-700 dark:text-slate-200">Transactions:</strong> None</span>
                                                            <span>🛠️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Tools:</strong> 3 interactive tools</span>
                                                            <span>🏅 <strong className="font-semibold text-slate-700 dark:text-slate-200">Badge:</strong> {featuredLab.badge?.label?.en || featuredLab.badge?.id || "Identity Explorer"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 flex items-center justify-between">
                                                        <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition">
                                                            Start Lab →
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
                                            const copy = FOUNDATIONAL_COPY[lab.id] || {};
                                            const title = copy.title || lab.title?.en || lab.id;
                                            const description = copy.description || lab.description?.en || "";
                                            const hint = copy.hint || null;
                                            const badge = lab.badge?.label?.en || lab.badge?.id;
                                            const link = LAB_ROUTES[lab.id] || `/labs/${lab.slug || lab.id}`;
                                            const showNext =
                                                lab.id === "lab02" &&
                                                Boolean(completionMap.lab01) &&
                                                !Boolean(completionMap.lab02);

                                            return (
                                                <Link
                                                    key={lab.id}
                                                    to={link}
                                                    className={`group rounded-2xl border ${CARD_ACCENT.foundational} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                                >
                                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.foundational}`}>
                                                        {CATEGORY_BADGE_LABEL.foundational}
                                                    </span>
                                                    <div className="flex items-start justify-between gap-3 mb-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                                {lab.id}
                                                            </p>
                                                            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                                {title}
                                                            </h3>
                                                        </div>
                                                        {completed ? (
                                                            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-green-400/20 bg-green-500 px-2 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
                                                                ✓ Completed
                                                            </span>
                                                        ) : null}
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                ⭐ NEXT
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    {hint ? (
                                                        <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                            Pedagogy hint: <span className="not-italic">{hint}</span>
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
                                                                {lab.estimated_time_minutes} min
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
                                                        Open Lab →
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
                                <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">DAO & Governance Labs</h2>
                                    <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                        Explore decentralized governance, collective decision-making, and DAO mechanics through guided simulations and real cryptographic actions.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {daoLabs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const showNext =
                                            lab.id === "dao02" &&
                                            Boolean(completionMap.dao01) &&
                                            !Boolean(completionMap.dao02);
                                        const copy = DAO_COPY[lab.id] || {};
                                        const title = copy.title || lab.title?.en || lab.id;
                                        const hint = copy.hint || null;
                                        const description = copy.description || lab.description?.en || "";
                                        const badge = lab.badge?.label?.en || lab.badge?.id || copy.badge;
                                        const link = LAB_ROUTES[lab.id] || `/labs/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className={`group rounded-2xl border ${CARD_ACCENT.dao} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                            >
                                                <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.dao}`}>
                                                    {CATEGORY_BADGE_LABEL.dao}
                                                </span>
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {completed ? (
                                                            <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                                ✓ Completed
                                                            </span>
                                                        ) : null}
                                                        {showNext ? (
                                                            <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                                                                ⭐ NEXT
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {hint ? (
                                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                        Pedagogy hint: <span className="not-italic">{hint}</span>
                                                    </p>
                                                ) : null}

                                                <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                                    {description}
                                                </p>

                                                {badge ? (
                                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                        Badge: <span className="font-medium text-slate-700 dark:text-slate-200">{badge}</span>
                                                    </p>
                                                ) : null}

                                                <div className="mt-5 flex items-center justify-between gap-4">
                                                    <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                                        {copy.level || lab.level || "Intermediate"}
                                                    </span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                            +{lab.xp || 0} XP
                                                        </span>
                                                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                            Open Lab →
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
                            <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">System Labs</h2>
                                <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                    Explore blockchain mechanics as a system, starting with why consensus is needed at all and then moving into how hashes, links, mining, and execution secure chain history.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {displayedSystemLabs.map((lab) => (
                                    <Link
                                        key={lab.id}
                                        to={lab.link}
                                        className={`group rounded-2xl border ${CARD_ACCENT.system} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                    >
                                        <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.system}`}>
                                            {CATEGORY_BADGE_LABEL.system}
                                        </span>
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                    {lab.id}
                                                </p>
                                                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                    {lab.title}
                                                </h3>
                                            </div>
                                            {lab.completed ? (
                                                <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                    ✓ Completed
                                                </span>
                                            ) : null}
                                        </div>

                                        {lab.hint ? (
                                            <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                Pedagogy hint: <span className="not-italic">{lab.hint}</span>
                                            </p>
                                        ) : null}

                                        <p className="min-h-[72px] text-sm text-slate-600 dark:text-slate-300">
                                            {lab.description}
                                        </p>

                                        {lab.badge ? (
                                            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                                Badge: <span className="font-medium text-slate-700 dark:text-slate-200">{lab.badge}</span>
                                            </p>
                                        ) : null}

                                        <div className="mt-5 flex items-center justify-between gap-4">
                                            <span className="rounded-lg bg-slate-200/80 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                {lab.level}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-900/35 dark:text-indigo-300">
                                                    +{lab.xp} XP
                                                </span>
                                                <span className="text-sm font-semibold text-indigo-600 transition-transform group-hover:translate-x-1 dark:text-indigo-300">
                                                    {lab.cta}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">Applied Labs</h2>
                                <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                                    Scenario-driven challenges that put your knowledge to work — combining on-chain interaction, gamification, and real-world problem solving.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Link
                                    to="/labs/proof-of-escape"
                                    className={`group rounded-2xl border ${CARD_ACCENT.project} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                >
                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.project}`}>
                                        {CATEGORY_BADGE_LABEL.project}
                                    </span>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Lab 01 — 🧠 Proof of Escape
                                        </h3>
                                        {poeCompleted ? (
                                            <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow shrink-0">
                                                ✓ Completed
                                            </span>
                                        ) : null}
                                    </div>

                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                        Pedagogy hint: <span className="not-italic">Completion is on-chain — your NFT badge is cryptographic proof you understood the concepts.</span>
                                    </p>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.
                                    </p>

                                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                                        Badge: <span className="font-medium text-slate-700 dark:text-slate-200">Proof of Escape</span>
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            Beginner
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/35 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                                                +500 XP
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                                Open Lab →
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className={`rounded-2xl border ${CARD_ACCENT.project} p-6 shadow-sm`}>
                                    <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE.project}`}>
                                        {CATEGORY_BADGE_LABEL.project}
                                    </span>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Lab 02 — 🖼 NFT Marketplace Lab
                                        </h3>
                                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            Coming Soon
                                        </span>
                                    </div>

                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                        Pedagogy hint: <span className="not-italic">Token standards define ownership rules — an NFT is a unique on-chain record no one can duplicate.</span>
                                    </p>

                                    <p className="min-h-[96px] text-sm text-slate-600 dark:text-slate-300">
                                        Build and interact with a simple NFT marketplace while learning token standards, ownership, and on-chain events.
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-4">
                                        <span className="rounded-lg bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
                                            Intermediate
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
                                <hr className="mb-8 border-slate-200/60 dark:border-slate-700/50" />
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">
                                        {CATEGORY_LABELS[category] || category}
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                                        {CATEGORY_DESCRIPTIONS[category] || "Labs exposed by the backend registry."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {labs.map((lab) => {
                                        const completed = Boolean(completionMap[lab.id]);
                                        const copy = PROJECT_COPY[lab.id] || PROJECT_COPY[lab.slug] || {};
                                        const title = copy.title || lab.title?.en || lab.id;
                                        const hint = copy.hint || null;
                                        const description = copy.description || lab.description?.en || "";
                                        const badge = lab.badge?.label?.en || lab.badge?.id;
                                        const link = LAB_ROUTES[lab.id] || `/labs/${lab.slug || lab.id}`;

                                        return (
                                            <Link
                                                key={lab.id}
                                                to={link}
                                                className={`group rounded-2xl border ${CARD_ACCENT[category] || CARD_ACCENT.project} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
                                            >
                                                <span className={`inline-block mb-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_BADGE[category] || CATEGORY_BADGE.project}`}>
                                                    {CATEGORY_BADGE_LABEL[category] || CATEGORY_BADGE_LABEL.project}
                                                </span>
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                                            {lab.id}
                                                        </p>
                                                        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                                            {title}
                                                        </h3>
                                                    </div>
                                                    {completed ? (
                                                        <span className="inline-flex rounded-full border border-green-400/20 bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                            ✓ Completed
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {hint ? (
                                                    <p className="mb-2 text-xs italic text-slate-500 dark:text-slate-400">
                                                        Pedagogy hint: <span className="not-italic">{hint}</span>
                                                    </p>
                                                ) : null}

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
                                                            {lab.estimated_time_minutes} min
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
                                                    Open Lab →
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
