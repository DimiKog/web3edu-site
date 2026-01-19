// Animation: When a lab is marked as completed, the "✓ Completed" badge animates in with a subtle fade and scale effect
// using Tailwind's arbitrary value for the animation utility class: animate-[fadeInScale_300ms_ease-out].
// This signals completion visually without disrupting layout or logic.
import PageShell from "../components/PageShell.jsx";
import { Link } from "react-router-dom";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.png";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BadgeWithTooltip from "../components/BadgeWithTooltip.jsx";

const Labs = () => {
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
                    console.error("Failed to load Proof of Escape status", err);
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
                    console.error("Failed to load Lab 06 status", err);
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
                    console.error("Failed to load Lab 05 status", err);
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
                    console.error("Failed to load Lab 01 status", err);
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
                    console.error("Failed to load Lab 03 status", err);
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
                    console.error("Failed to load Lab 02 status", err);
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
                    console.error("Failed to load Lab 04 status", err);
                }
            });

        return () => controller.abort();
    }, [address]);
    const showLab02Next =
        Boolean(lab01Completed && !lab02Completed);

    return (
        <PageShell title="Web3Edu Labs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Page Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Web3Edu Labs
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                        Learn Web3 by interacting with real blockchain infrastructure, smart contracts,
                        and security concepts through hands-on labs and experiments.
                    </p>
                </header>

                {/* How Labs Work */}
                <section className="mb-14">
                    <h2 className="text-xl font-semibold mb-4">
                        How Labs Work
                    </h2>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                        <li>• Hands-on exercises using real Web3 infrastructure</li>
                        <li>• No prior setup required for most labs</li>
                        <li>• Designed for students, educators, and builders</li>
                    </ul>
                </section>

                {/* Foundational Labs */}
                <section className="mb-16 relative">
                    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                        <h2 className="text-2xl font-semibold mb-6">
                            Foundational Labs
                        </h2>
                        <p className="max-w-3xl mb-8 text-slate-600 dark:text-slate-300">
                            Build your Web3 identity and core mental models before touching transactions or smart contracts.
                        </p>

                        {/* 📊 Foundational Labs Progress */}
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
                                            <span>Foundational Labs Progress</span>
                                            <span>{completedCount} / 6 completed</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                        {completedCount === 6 && (
                                            <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                🎉 All foundational labs completed!
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="space-y-20">
                            {/* 👛 Wallets & Web3 Identity — Featured Card */}
                            <div className="w-full">
                                <Link
                                    to="/labs/wallets-keys"
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
                                                ✓ Completed
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
                                                alt="Web3 identity flow: wallet to address to identity"
                                                className="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/30"
                                            />
                                        </div>
                                        {/* Content */}
                                        <div className="p-10 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-3">
                                                    Lab 01 — Wallets & Web3 Identity
                                                </h3>
                                                <p className="text-xs italic text-slate-600/90 dark:text-slate-300/80 mb-4">
                                                    Pedagogy hint: Your wallet is your Web3 identity — before transactions ever happen.
                                                </p>
                                                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl">
                                                    Understand how wallets and addresses establish Web3 identity
                                                    on a permissioned Ethereum network — before transactions,
                                                    gas, or smart contracts exist.
                                                </p>
                                                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span>🧭 <strong className="font-semibold text-slate-700 dark:text-slate-200">Level:</strong> Beginner</span>
                                                    <span>⏱️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Time:</strong> 15–20 minutes</span>
                                                    <span>🌐 <strong className="font-semibold text-slate-700 dark:text-slate-200">Network:</strong> Besu Edu‑Net</span>
                                                    <span>🚫 <strong className="font-semibold text-slate-700 dark:text-slate-200">Transactions:</strong> None</span>
                                                    <span>🛠️ <strong className="font-semibold text-slate-700 dark:text-slate-200">Tools:</strong> 3 interactive tools</span>
                                                    <span>🏅 <strong className="font-semibold text-slate-700 dark:text-slate-200">Badge:</strong> Identity Explorer</span>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="inline-flex items-center gap-2
                                                   text-indigo-600 dark:text-indigo-400
                                                   font-semibold group-hover:translate-x-1 transition">
                                                    Start Lab →
                                                </span>
                                                {/* XP Placeholder */}
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

                            {/* Secondary grid of foundational labs */}
                        </div>
                        <div className="h-8 lg:h-12"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {/* 🔐 Encrypted Messages Lab */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-visible">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">
                                        Lab 02 — 🔐 Encrypted Messages
                                    </h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Available */}
                                        <BadgeWithTooltip
                                            label="Available"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Off-chain cryptography<br />
                                                    • No transactions<br />
                                                    • No smart contracts
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Completed */}
                                        {lab02Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Completed
                                            </span>
                                        )}
                                        {/* 3. NEXT */}
                                        {showLab02Next && (
                                            <span
                                                title="Recommended next lab after completing Lab 01"
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap uppercase tracking-wide bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 ring-1 ring-indigo-400/30 font-semibold"
                                            >
                                                ⭐ NEXT
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Pedagogy hint: <span className="not-italic">Privacy in Web3 starts off‑chain with encryption.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Learn how encrypted communication works in Web3 using public‑key cryptography and off‑chain message encryption — without blockchain transactions or smart contracts.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <Link
                                        to="/labs/lab02"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                            {/* ✍️ Message Signing */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 03 — ✍️ Message Signing & Ownership</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Available */}
                                        <BadgeWithTooltip
                                            label="Available"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Off-chain signatures<br />
                                                    • Ownership proof<br />
                                                    • No transactions
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Completed */}
                                        {lab03Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Completed
                                            </span>
                                        )}
                                        {/* 3. NEXT (never shown for Lab 03, but keep order for consistency) */}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Pedagogy hint: <span className="not-italic">Signatures prove ownership and intent without spending gas.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Learn how cryptographic signatures prove ownership and intent — without revealing private keys or sending on‑chain transactions.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <Link
                                        to="/labs/lab03"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                            {/* ⛽ Transactions & Gas */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 04 — ⛽ Transactions & Gas</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Available */}
                                        <BadgeWithTooltip
                                            label="Available"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    On-chain transactions<br />
                                                    • Gas & execution<br />
                                                    • State changes
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Completed */}
                                        {lab04Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Completed
                                            </span>
                                        )}
                                        {/* 3. NEXT (never shown for Lab 04, but keep order for consistency) */}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Pedagogy hint: <span className="not-italic">On‑chain actions cost gas and permanently change state.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Interact with your first blockchain transaction and learn how gas, execution, and state changes work on-chain.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <Link
                                        to="/labs/lab04"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                            {/* 📜 First Smart Contract */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 05 — 📜 Smart Contracts & State</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Available */}
                                        <BadgeWithTooltip
                                            label="Available"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Smart contract interaction<br />
                                                    • On‑chain state<br />
                                                    • Read & write calls
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Completed */}
                                        {lab05Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Completed
                                            </span>
                                        )}
                                        {/* 3. NEXT (never shown for Lab 05, but keep order for consistency) */}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Pedagogy hint: <span className="not-italic">READ is a free call; WRITE is a transaction.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Interact with a real smart contract and learn how on‑chain state, reads, and writes work.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <Link
                                        to="/labs/lab05"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                            {/* ⚙️ Consensus & Finality */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between mb-3 gap-2">
                                    <h3 className="text-lg font-semibold">Lab 06 — ⚙️ Consensus & Finality</h3>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        {/* 1. Available */}
                                        <BadgeWithTooltip
                                            label="Available"
                                            variant="success"
                                            tooltip={
                                                <>
                                                    Validator agreement<br />
                                                    • Consensus<br />
                                                    • Finality
                                                </>
                                            }
                                            className="rounded-full text-xs whitespace-nowrap"
                                        />
                                        {/* 2. Completed */}
                                        {lab06Completed && (
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap bg-green-500/90 text-white font-semibold shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                            >
                                                ✓ Completed
                                            </span>
                                        )}
                                        {/* 3. NEXT (never shown for Lab 06, but keep order for consistency) */}
                                    </div>
                                </div>
                                <p className="mb-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    Pedagogy hint: <span className="not-italic">Consensus picks one chain; finality locks it.</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 min-h-[96px]">
                                    Explore how validators reach agreement and when blocks become truly final.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <Link
                                        to="/labs/lab06"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Applied & Project Labs */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">
                        Applied & Project Labs
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 🧠 Proof of Escape */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between mb-3 gap-2">
                                <h3 className="text-lg font-semibold">Lab 07 — 🧠 Proof of Escape</h3>
                                <div className="flex items-center gap-2 flex-nowrap">
                                    {/* 1. Available (always shown, matches Foundational Labs) */}
                                    <BadgeWithTooltip
                                        label="Available"
                                        variant="success"
                                        tooltip="On-chain verified project lab"
                                        className="rounded-full text-xs whitespace-nowrap"
                                    />
                                    {/* 2. Completed (only if poeCompleted, matches Foundational Labs) */}
                                    {poeCompleted && (
                                        <span
                                            title="Completed via on-chain proof"
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                                       text-xs whitespace-nowrap bg-green-500/90 text-white
                                                       font-semibold shadow-lg backdrop-blur
                                                       transition transform
                                                       motion-safe:animate-[fadeInScale_300ms_ease-out]"
                                        >
                                            ✓ Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 min-h-[96px]">
                                A gamified Web3 challenge combining quizzes, NFTs, and on‑chain verification
                                to introduce core blockchain concepts.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Beginner
                                </span>
                                <Link
                                    to="/labs/proof-of-escape"
                                    className="text-sm font-semibold text-indigo-600 hover:underline"
                                >
                                    Open Lab
                                </Link>
                            </div>
                        </div>

                        {/* 🖼 NFT Marketplace Lab */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                            <div className="flex items-center justify-between mb-3 gap-2">
                                <h3 className="text-lg font-semibold">Lab 08 — 🖼 NFT Marketplace Lab</h3>
                                <span className="rounded-full text-xs whitespace-nowrap px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 font-semibold">
                                    Coming Soon
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 min-h-[96px]">
                                Build and interact with a simple NFT marketplace while learning token
                                standards, ownership, and on‑chain events.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Intermediate
                                </span>
                                <span className="text-sm text-slate-400">Coming Soon</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </PageShell>
    );
};

export default Labs;
