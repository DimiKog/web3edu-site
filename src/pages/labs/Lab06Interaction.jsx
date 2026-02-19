

import { useState, useEffect } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

/**
 * Lab 06 — Consensus & Finality
 * Interaction Scaffold
 *
 * Goal:
 * Help students build intuition around:
 * - What consensus means
 * - Why finality matters
 * - How validators agree on a single chain
 *
 * NOTE:
 * This scaffold is intentionally conceptual-first.
 * Byzantine Fault Tolerance theory is deferred to a future lab.
 */

const initialLab06State = {
    currentStep: 1,
    lastAction: null,

    // Step 1 — Conceptual understanding
    consensusDefined: false,
    consensusAnswerWrong: false,

    // Step 2 — Validators & blocks
    validatorsUnderstood: false,
    validatorsAnswerWrong: false,

    // Step 3 — Forks vs finality
    finalityUnderstood: false,

    // Discoveries & completion
    discoveredData: [],
    explanationUnlocked: false,
};

const Lab06Interaction = () => {
    const [labState, setLabState] = useState(initialLab06State);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const markStepComplete = (key, message, discovery) => {
        setLabState((s) => ({
            ...s,
            [key]: true,
            lastAction: message,
            discoveredData: discovery
                ? [...s.discoveredData, discovery]
                : s.discoveredData,
        }));
    };

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 06 — Consensus & Finality
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Learn how decentralized networks agree on a single shared history
                        and why finality is critical for trust without central authority.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border p-5 bg-slate-50 dark:bg-slate-900/40">
                    {labState.lastAction && (
                        <div className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                            ✅ {labState.lastAction}
                        </div>
                    )}
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Consensus concept understood: {labState.consensusDefined ? "✅" : "❌"}</li>
                        <li>Validator role understood: {labState.validatorsUnderstood ? "✅" : "❌"}</li>
                        <li>Finality concept understood: {labState.finalityUnderstood ? "✅" : "❌"}</li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">

                        {/* Step 1 — What is consensus */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                1️⃣ What Is Consensus?
                            </h3>

                            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                🔀 Before Consensus - Different Local Histories
                            </p>

                            {/* Distributed network intuition */}
                            <div className="mb-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Blockchains are <strong>distributed systems</strong>. There is no central database,
                                    no global clock, and no authority telling nodes what the “correct” state is.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Node A sees</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx1 → Tx2</li>
                                            <li>Block #120</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Node B sees</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx2 → Tx1</li>
                                            <li>Block #120</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900">
                                        <p className="font-semibold mb-2">🖥️ Node C sees</p>
                                        <ul className="space-y-1 font-mono text-xs">
                                            <li>Tx1 only</li>
                                            <li>Block #119</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                    ⚠️ Because the network is distributed, nodes can temporarily hold <em>different views of the blockchain history so far</em>. Consensus is required to converge to
                                    one shared blockchain.
                                </div>
                            </div>

                            {/* Visual intuition */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/20">
                                    <p className="font-semibold mb-2">❌ Without Consensus</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Different block orders</li>
                                        <li>Multiple competing chains</li>
                                        <li>No single shared history</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                                    <p className="font-semibold mb-2">✅ With Consensus</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Validators coordinate</li>
                                        <li>One agreed blockchain</li>
                                        <li>Shared source of truth</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Question */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Given the situation above, what must the network solve in order to function
                                as <strong>one blockchain</strong>?
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900 disabled:opacity-70"
                                value={labState.consensusDefined ? "correct" : ""}
                                disabled={labState.consensusDefined}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "correct") {
                                        setLabState((s) => ({
                                            ...s,
                                            consensusDefined: true,
                                            consensusAnswerWrong: false,
                                            lastAction: "✅ Correct! Consensus ensures all honest nodes agree on a single shared blockchain history.",
                                            discoveredData: [
                                                ...s.discoveredData,
                                                "Consensus solves the distributed agreement problem by converging all honest nodes on one blockchain history.",
                                            ],
                                        }));
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ This alone is not sufficient. Nodes may still disagree on which history is canonical.",
                                            consensusAnswerWrong: true,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Select an answer…
                                </option>
                                <option value="wrong1">
                                    Ordering transactions inside a block
                                </option>
                                <option value="correct">
                                    Ensuring all nodes agree on the same blockchain history
                                </option>
                                <option value="wrong2">
                                    Verifying cryptographic signatures only
                                </option>
                            </select>

                            {labState.consensusAnswerWrong === true && (
                                <div className="mt-3 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold">
                                    ❌ This does not solve the distributed agreement problem. Even if transactions are ordered or signatures are valid, nodes may still disagree on which chain is canonical.
                                </div>
                            )}

                            {/* Post-consensus visual */}
                            {labState.consensusDefined && (
                                <div className="mt-6 p-5 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 transition-all duration-500 ease-out">
                                    <p className="font-semibold mb-4 text-green-800 dark:text-green-200">
                                        🔗 After Consensus Is Achieved
                                    </p>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Node A<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>

                                        <div className="text-2xl text-green-600 dark:text-green-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Node B<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>

                                        <div className="text-2xl text-green-600 dark:text-green-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Node C<br />
                                            Tx1 → Tx2 → Tx3<br />
                                            Block #121
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-green-800 dark:text-green-200 font-semibold text-center">
                                        ✔️ Different nodes collapse into <strong>one shared blockchain history</strong>.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Step 2 — Validators */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                2️⃣ Validators & Block Production
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                In a decentralized blockchain, there is no central authority.
                                <strong> Validators</strong> are special nodes that collectively
                                enforce the consensus rules of the network.
                            </p>

                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-1">
                                <li>They propose new blocks</li>
                                <li>They verify blocks proposed by others</li>
                                <li>No single validator can decide history alone</li>
                            </ul>


                            {/* Visual: block proposal with transactions */}
                            <div className="mb-6 p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/40">
                                <p className="font-semibold mb-3 text-slate-700 dark:text-slate-200">
                                    🧱 A Validator Proposes a Block
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 font-mono text-xs shadow-sm">
                                        <p className="font-semibold mb-2">Pending Transactions</p>
                                        <ul className="space-y-1">
                                            <li>Tx A → Tx B</li>
                                            <li>Tx C → Tx D</li>
                                            <li>Tx E → Tx F</li>
                                        </ul>
                                    </div>

                                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        ⇨
                                    </div>

                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-sm">
                                        <p className="font-semibold mb-1">🧑‍⚙️ Validator</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                            Builds candidate block
                                        </p>
                                        <div className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                            Block #122
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
                                    A validator selects transactions and proposes a <strong>candidate block</strong>.
                                    This block is <em>not final</em> until other validators agree.
                                </p>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Which statement best describes the role of validators?
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900"
                                defaultValue=""
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "correct") {
                                        markStepComplete(
                                            "validatorsUnderstood",
                                            "✅ Validator role understood",
                                            "Validators collectively enforce consensus rules by proposing and validating blocks."
                                        );
                                        setLabState((s) => ({
                                            ...s,
                                            validatorsAnswerWrong: false,
                                        }));
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ Validators do not control the network or act alone.",
                                            validatorsAnswerWrong: true,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>Select an answer…</option>
                                <option value="wrong1">Nodes that control which users can transact</option>
                                <option value="wrong2">Nodes that only store blockchain data</option>
                                <option value="correct">
                                    Nodes that follow protocol rules to propose and agree on blocks
                                </option>
                            </select>

                            {/* Feedback — Wrong answer */}
                            {labState.validatorsAnswerWrong && !labState.validatorsUnderstood && (
                                <div className="mt-3 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-semibold">
                                    ❌ Incorrect. Validators do <strong>not</strong> control the network
                                    or decide history alone. They must follow protocol rules and reach
                                    agreement with other validators.
                                </div>
                            )}

                            {/* Feedback — Correct answer */}
                            {labState.validatorsUnderstood && (
                                <div className="mt-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                                    ✅ Correct! Validators collectively propose, verify, and agree on
                                    blocks according to the protocol rules.
                                </div>
                            )}

                            {/* Post-correct visual feedback block */}
                            {labState.validatorsUnderstood && (
                                <div className="mt-6 p-5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 transition-all duration-500 ease-out">
                                    <p className="font-semibold mb-4 text-indigo-800 dark:text-indigo-200">
                                        🔗 Validators Coordinating on a Block
                                    </p>

                                    {/* Updated diagram: show validators proposing, verifying, and finalizing */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Validator A<br />
                                            <span className="text-indigo-700 dark:text-indigo-200">Proposes Block #122</span>
                                        </div>

                                        <div className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Validator B<br />
                                            <span className="text-green-700 dark:text-green-300">Verifies Rules ✔</span>
                                        </div>

                                        <div className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                                            ⇨
                                        </div>

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                            Validator C<br />
                                            <span className="text-blue-700 dark:text-blue-200">Votes to Finalize ✔</span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-indigo-800 dark:text-indigo-200 font-semibold text-center">
                                        ✔️ A block is <strong>finalized</strong> only after <strong>multiple validators</strong> propose, verify, and agree.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* New: Fork scenario block, before Step 3 */}
                        {labState.validatorsUnderstood && (
                            <div className="rounded-xl border p-5 mb-6 bg-yellow-50 dark:bg-yellow-900/20">
                                <h3 className="font-semibold mb-3 text-yellow-900 dark:text-yellow-200">
                                    ⚡ Forks: What Happens If Validators Disagree?
                                </h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                    Sometimes, validators may disagree or receive blocks at different times,
                                    causing a <strong>fork</strong>: the chain splits into two competing histories.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm mb-2">
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                        Validator A<br />
                                        <span className="text-indigo-700 dark:text-indigo-200">Block #123a</span>
                                    </div>
                                    <div className="text-2xl text-yellow-600 dark:text-yellow-300 font-bold">
                                        ⇨
                                    </div>
                                    <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs shadow-sm">
                                        Validator B<br />
                                        <span className="text-pink-700 dark:text-pink-200">Block #123b</span>
                                    </div>
                                </div>
                                <p className="text-xs text-yellow-900 dark:text-yellow-200 text-center">
                                    🚩 A fork: two blocks at the same height, different histories!
                                </p>
                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 text-center">
                                    The network must resolve forks to restore a <strong>single chain</strong>. This is where <strong>finality</strong> becomes critical.
                                </p>
                            </div>
                        )}

                        {/* Step 3 — Finality */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">
                                3️⃣ Finality: When Is a Block Truly Final?
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Even after validators agree on a block, the network may still
                                experience <strong>temporary forks</strong>.
                                Finality defines the point at which a block becomes
                                <strong> irreversible</strong>.
                            </p>

                            {/* Before vs After Finality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                                <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20">
                                    <p className="font-semibold mb-2">⏳ Before Finality</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Blocks may be replaced</li>
                                        <li>Forks are still possible</li>
                                        <li>History is not guaranteed</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                                    <p className="font-semibold mb-2">🔒 After Finality</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Block is irreversible</li>
                                        <li>No competing history allowed</li>
                                        <li>Shared trust is established</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Question */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                What does finality guarantee in a blockchain network?
                            </p>

                            <select
                                className="w-full p-2 rounded-md border bg-white dark:bg-slate-900"
                                defaultValue=""
                                disabled={labState.finalityUnderstood}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "correct") {
                                        markStepComplete(
                                            "finalityUnderstood",
                                            "✅ Correct! Finality guarantees irreversible agreement.",
                                            "Finality ensures that once a block is finalized, it can never be reverted."
                                        );
                                    } else if (value !== "") {
                                        setLabState((s) => ({
                                            ...s,
                                            lastAction:
                                                "❌ Not quite. Finality is about irreversibility, not speed or transaction validity.",
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>Select an answer…</option>
                                <option value="wrong1">
                                    That transactions are validated faster
                                </option>
                                <option value="wrong2">
                                    That blocks contain only valid transactions
                                </option>
                                <option value="correct">
                                    That a block can never be reverted once finalized
                                </option>
                            </select>

                            {/* Feedback */}
                            {labState.finalityUnderstood && (
                                <div className="mt-4 p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                                    🔐 Finality achieved: the blockchain history is now
                                    <strong> immutable</strong>.
                                    Users and applications can trust the state permanently.
                                </div>
                            )}

                            {/* Finality as irreversible lock */}
                            {labState.finalityUnderstood && (
                                <div className="mt-6 p-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="font-semibold mb-4 text-slate-800 dark:text-slate-200">
                                        ⏱️ Finality Changes Time, Not Just Agreement
                                    </p>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">

                                        <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 text-center font-mono text-xs">
                                            <p className="font-semibold mb-1">Block #124 (Candidate)</p>
                                            <p className="text-yellow-600 dark:text-yellow-400">
                                                ⏳ Awaiting confirmations
                                            </p>
                                            <p className="mt-2 text-slate-500">
                                                Can still be replaced
                                            </p>
                                        </div>

                                        {/* Label above confirmations column */}
                                        <div className="flex flex-col items-center">
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                                                time + confirmations
                                            </p>
                                            <div className="flex flex-col items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +1 block
                                                </div>
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +2 blocks
                                                </div>
                                                <div className="px-3 py-1 rounded border bg-slate-100 dark:bg-slate-800">
                                                    +3 blocks
                                                </div>
                                                <span className="mt-1 text-[10px] italic text-slate-400">
                                                    confirmations accumulate
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/30 text-center font-mono text-xs">
                                            <p className="font-semibold mb-1">Block #124 (Finalized)</p>
                                            <p className="text-green-700 dark:text-green-300">
                                                🔒 Irreversible
                                            </p>
                                            <p className="mt-2 text-green-800 dark:text-green-200 font-semibold">
                                                Cannot be reverted
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 text-center">
                                        ✔️ Finality does <strong>not</strong> change the block — it changes its
                                        <strong> status over time</strong>. As confirmations accumulate,
                                        reverting this block becomes economically and technically impossible.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border p-5 bg-white dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Discovered Data</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No discoveries yet.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {labState.discoveredData.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* 🧠 Explanation */}
                {(labState.consensusDefined &&
                    labState.validatorsUnderstood &&
                    labState.finalityUnderstood) && (
                        <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                            <h2 className="text-xl font-semibold mb-2">🧠 Explanation</h2>
                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                <li>Consensus ensures all honest nodes share the same history.</li>
                                <li>Validators enforce the rules of the network.</li>
                                <li>Finality prevents history from being rewritten.</li>
                            </ul>
                        </section>
                    )}

                {/* 🎉 Completion */}
                {(labState.consensusDefined &&
                    labState.validatorsUnderstood &&
                    labState.finalityUnderstood) && (
                        <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-6">
                            <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                                🎉 Lab Completed
                            </h2>
                            <p className="text-slate-700 dark:text-slate-200 mb-4">
                                You have completed <strong>Lab 06 — Consensus & Finality</strong>.
                                You now understand how decentralized agreement and finality
                                form the backbone of blockchain trust.
                            </p>
                            <LabCompletionClaim
                                labId="lab06"
                                language="en"
                                backHref="/#/labs/lab06"
                                backLabel="⬅ Return to Lab Overview"
                            />
                        </section>
                    )}

            </div>
        </PageShell>
    );
};

export default Lab06Interaction;
