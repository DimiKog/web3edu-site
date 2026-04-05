import { useState, useEffect } from "react";
import PageShell from "../components/PageShell.jsx";
import BlockchainView from "../components/mining/BlockchainView";
import Mempool from "../components/mining/Mempool";
import MiningControls from "../components/mining/MiningControls";
import { createGenesisBlock } from "../utils/mining";

const COPY = {
    en: {
        title: "Mining Visualizer",
        eyebrow: "Developer Tools",
        description: "Simulate a basic proof-of-work flow by selecting pending transactions, trying a nonce, and committing a block to the chain.",
        mempool: {
            heading: "Mempool",
        },
        mining: {
            heading: "Mining",
            nonceLabel: "Nonce",
            mineButton: "Mine",
            autoMineButton: "Auto Mine",
            addBlockButton: "Add Block",
        },
        blockchain: {
            heading: "Blockchain",
            hashLabel: "Hash",
            transactionsLabel: "Txs",
            nonceLabel: "Nonce",
        },
    },
    gr: {
        title: "Οπτικοποίηση Mining",
        eyebrow: "Εργαλεία Ανάπτυξης",
        description: "Προσομοίωσε μια βασική ροή proof-of-work επιλέγοντας εκκρεμείς συναλλαγές, δοκιμάζοντας nonce και προσθέτοντας block στην αλυσίδα.",
        mempool: {
            heading: "Mempool",
        },
        mining: {
            heading: "Mining",
            nonceLabel: "Nonce",
            mineButton: "Εξόρυξη",
            autoMineButton: "Αυτόματη Εξόρυξη",
            addBlockButton: "Προσθήκη Block",
        },
        blockchain: {
            heading: "Blockchain",
            hashLabel: "Hash",
            transactionsLabel: "Συναλλαγές",
            nonceLabel: "Nonce",
        },
    },
};

export default function MiningLab({ lang = "en" }) {
    const copy = COPY[lang] || COPY.en;
    const [chain, setChain] = useState([createGenesisBlock()]);
    const [allTxs, setAllTxs] = useState(generateDummyTxs());
    const [windowStart, setWindowStart] = useState(0);
    const VISIBLE_COUNT = 3;

    const mempool = getVisibleTxs(allTxs, windowStart, VISIBLE_COUNT);
    const [selectedTxs, setSelectedTxs] = useState([]);

    useEffect(() => {
        if (allTxs.length <= VISIBLE_COUNT) return;

        const id = setInterval(() => {
            setWindowStart((prev) => {
                const next = prev + VISIBLE_COUNT;
                return next >= allTxs.length ? 0 : next;
            });
        }, 3000);

        return () => clearInterval(id);
    }, [allTxs]);

    return (
        <PageShell>
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#8A57FF]/18 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#4ACBFF]/14 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
                </div>

                <main className="relative mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-[#8A57FF]/30 bg-[#8A57FF]/10 px-4 py-1 text-sm font-semibold text-[#8A57FF]">
                            {copy.eyebrow}
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            {copy.title}
                        </h1>
                        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {copy.description}
                        </p>
                    </div>

                    <section className="mt-10 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-6 lg:p-8">

                        {/* TOP: Mempool + Mining */}
                        <div className="grid gap-6 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.62fr)_minmax(380px,0.92fr)] lg:items-start">
                            <div className="rounded-2xl bg-[#0F172A] p-5 text-white lg:h-full">
                                <Mempool
                                    mempool={mempool}
                                    selectedTxs={selectedTxs}
                                    setSelectedTxs={setSelectedTxs}
                                    copy={copy.mempool}
                                />
                            </div>

                            <div className="rounded-2xl bg-[#0F172A] p-5 text-white lg:self-start">
                                <MiningControls
                                    chain={chain}
                                    selectedTxs={selectedTxs}
                                    setChain={setChain}
                                    setMempool={(updater) => {
                                        // update full tx list, not just visible window
                                        setAllTxs((prev) => {
                                            const next = typeof updater === 'function' ? updater(prev) : updater;
                                            return next;
                                        });
                                    }}
                                    setSelectedTxs={setSelectedTxs}
                                    copy={copy.mining}
                                />
                            </div>
                        </div>

                        {/* BOTTOM: Blockchain FULL WIDTH */}
                        <div className="mt-8 rounded-2xl bg-[#0F172A] p-5 text-white">
                            <BlockchainView
                                chain={chain}
                                setChain={setChain}
                                copy={copy.blockchain}
                            />
                        </div>

                    </section>
                </main>
            </div>
        </PageShell>
    );
}

function generateDummyTxs() {
    return Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        hash: makeHex(`tx-${i}-${Math.random()}`, 64),
        from: makeHex(`from-${i}`, 40),
        to: makeHex(`to-${i}`, 40),
        valueEth: (Math.random() * 2 + 0.005).toFixed(4),
        gas: 21_000 + Math.floor(Math.random() * 180_000),
        maxFeeGwei: 12 + Math.floor(Math.random() * 90),
        nonce: i + Math.floor(Math.random() * 4),
    }));
}

function getVisibleTxs(allTxs, windowStart, visibleCount) {
    if (allTxs.length <= visibleCount) return allTxs;

    return Array.from({ length: visibleCount }, (_, index) => {
        const txIndex = (windowStart + index) % allTxs.length;
        return allTxs[txIndex];
    });
}

function makeHex(seed, length) {
    const alphabet = "0123456789abcdef";
    let value = "";

    for (let i = 0; i < length; i++) {
        const code = seed.charCodeAt(i % seed.length);
        value += alphabet[(code + i * 7) % alphabet.length];
    }

    return `0x${value}`;
}
