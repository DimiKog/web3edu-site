import PageShell from "../components/PageShell.jsx";
import { Link } from "react-router-dom";
import lab01IdentityImg from "../assets/labs/lab01-identity-diagram.png";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BadgeWithTooltip from "../components/BadgeWithTooltip.jsx";

const Labs = () => {
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
                console.error("Failed to load user metadata", err);
            });
    }, [address]);

    // Defensive: labsCompleted is computed backend-side and reflects total foundational labs completed.
    // Per-lab granularity will move to a dedicated endpoint or expanded metadata in the future.
    const lab01Completed =
        Boolean(metadata?.labsCompleted && metadata?.labsCompleted >= 1);

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
                        How Labs work
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

                        <div className="space-y-20">
                            {/* 👛 Wallets & Web3 Identities — Featured Card */}
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
                                                shadow-lg backdrop-blur">
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
                                                    Lab 01 — Wallets & Web3 Identities
                                                </h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* 🔐 Encrypted Messages Lab */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm
                          hover:shadow-lg hover:-translate-y-1 transition-all
                          overflow-visible">
                                <div className="flex items-center justify-between mb-3 relative overflow-visible">
                                    <h3 className="text-lg font-semibold">🔐 Encrypted Messages Lab</h3>
                                    <BadgeWithTooltip
                                        label="Available"
                                        variant="success"
                                        tooltip={
                                            <>
                                                Off‑chain cryptography<br />
                                                • No transactions<br />
                                                • No smart contracts
                                            </>
                                        }
                                    />
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Learn how encrypted communication works in Web3 using public‑key cryptography,
                                    cryptographic identities, and off‑chain message encryption — without relying on
                                    blockchain transactions or Smart Contracts.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner → Intermediate
                                    </span>
                                    <Link
                                        to="/labs/lab02"
                                        className="text-sm font-semibold text-indigo-600 hover:underline"
                                    >
                                        Open Lab →
                                    </Link>
                                </div>
                            </div>
                            {/* ⚙️ Consensus & Finality */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">⚙️ Consensus & Finality</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Understand how blockchain networks reach agreement and finality through
                                    Byzantine Fault Tolerant consensus mechanisms.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Intermediate
                                    </span>
                                    <span className="text-sm text-slate-400">Preview</span>
                                </div>
                            </div>
                            {/* ✍️ Message Signing */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">✍️ Message Signing</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Learn how cryptographic signatures prove ownership and intent without revealing
                                    private keys or requiring on‑chain transactions.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner
                                    </span>
                                    <span className="text-sm text-slate-400">Preview</span>
                                </div>
                            </div>
                            {/* ⛽ Transactions & Gas */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">⛽ Transactions & Gas</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Explore how transactions are executed, paid for, and included in the blockchain.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Beginner → Intermediate
                                    </span>
                                    <span className="text-sm text-slate-400">Preview</span>
                                </div>
                            </div>
                            {/* 📜 First Smart Contract */}
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                          bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">📜 First Smart Contract</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                        Coming Soon
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                    Deploy and interact with your first smart contract to understand on-chain state and execution.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                        Intermediate
                                    </span>
                                    <span className="text-sm text-slate-400">Preview</span>
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
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                      bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm
                      hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">🧠 Proof of Escape</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                    Available
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                A gamified Web3 challenge combining quizzes, NFTs, and on‑chain verification
                                to introduce core blockchain concepts.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Beginner
                                </span>
                                <span className="text-sm text-slate-500">Open Lab</span>
                            </div>
                        </div>

                        {/* 🖼 NFT Marketplace Lab */}
                        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                      bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm opacity-70">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">🖼 NFT Marketplace Lab</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                    Coming Soon
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Build and interact with a simple NFT marketplace while learning token
                                standards, ownership, and on‑chain events.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-700/60">
                                    Intermediate
                                </span>
                                <span className="text-sm text-slate-400">Preview</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </PageShell>
    );
};

export default Labs;
