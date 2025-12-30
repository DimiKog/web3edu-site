import { useState, useEffect } from "react";
import PageShell from "../../components/PageShell";

const initialLab05State = {
    currentStep: 1,
    lastAction: null,

    // Step 1 — Contract existence
    contractObserved: false,

    // Step 2 — Read-only call
    stateRead: false,
    storedValue: null,

    // Step 3 — Write transaction
    txPrepared: false,
    txHash: null,

    // Step 4 — State change observed
    stateUpdated: false,
    updatedValue: null,

    discoveredData: [],
    explanationUnlocked: false,
};


const demoContractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public value;

    function increment() external {
        value += 1;
    }
}`;

const demoContractAddress = "0x1234567890abcdef1234567890abcdef12345678";

const Lab05Interaction = () => {
    const [labState, setLabState] = useState(initialLab05State);
    const [showContractDetails, setShowContractDetails] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const recordAction = (updates, discovery) => {
        setLabState((s) => ({
            ...s,
            ...updates,
            lastAction: discovery,
            discoveredData: discovery
                ? [...s.discoveredData, discovery]
                : s.discoveredData,
        }));
    };

    const canReset =
        labState.contractObserved ||
        labState.stateRead ||
        labState.txPrepared ||
        labState.stateUpdated;

    const resetLab = () => {
        setLabState({ ...initialLab05State });
        setShowContractDetails(false);
    };

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 05 — Smart Contracts & State
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Understand how smart contracts store state on-chain and how
                        transactions execute code that permanently modifies it.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>

                    {labState.lastAction && (
                        <div className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                            ✅ {labState.lastAction}
                        </div>
                    )}

                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Contract existence observed: {labState.contractObserved ? "✅" : "❌"}</li>
                        <li>State read (no gas): {labState.stateRead ? "✅" : "❌"}</li>
                        <li>Function execution prepared: {labState.txPrepared ? "✅" : "❌"}</li>
                        <li>State updated on-chain: {labState.stateUpdated ? "✅" : "❌"}</li>
                        <li>Blockchain interaction needed: ✅</li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">

                        {/* Step 1 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Observe Smart Contract Existence
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                                Educational Demo Contract — already deployed on Besu Edu‑Net
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                Contract Address: <code className="font-mono">{demoContractAddress}</code>
                            </p>
                            <a
                                href={`https://besu-edu-net-explorer.example/contract/${demoContractAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 text-sm inline-block mb-3 hover:underline"
                            >
                                🔗 View contract in Block Explorer (opens new tab)
                            </a>
                            <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4">
                                <p className="text-sm font-semibold mb-2">📄 Deployed Contract Code</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    This is the exact Solidity code that was deployed at the address above.
                                </p>
                                <pre className="overflow-x-auto text-xs font-mono p-3 rounded bg-white dark:bg-slate-800 border">
                                    <code>{demoContractSource}</code>
                                </pre>
                            </div>
                            <div className="mb-3 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300 text-sm">
                                <strong>Info:</strong> This contract already exists on-chain. The source code below was deployed once and now lives permanently on Besu Edu‑Net.
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 mt-2">
                                Smart contracts are deployed code + state stored permanently on-chain, not abstractions or placeholders.
                            </p>
                            <button
                                onClick={() => {
                                    recordAction(
                                        { contractObserved: true },
                                        "Smart contracts are deployed once and persist on-chain independently of users or wallets."
                                    );
                                    setShowContractDetails(true);
                                }}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Confirm contract exists
                            </button>
                            {showContractDetails && labState.contractObserved && (
                                <div className="mt-4 p-4 border rounded bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-900 dark:text-indigo-300">
                                    <p>
                                        The contract address above represents a deployed smart contract on the blockchain.
                                    </p>
                                    <p className="mt-2">
                                        You can interact with this contract by reading its state or sending transactions to it.
                                    </p>
                                    <div className="mt-4 p-3 border rounded bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 font-mono">
                                        <p><strong>Contract Address:</strong> {demoContractAddress}</p>
                                        <p><strong>Status:</strong> Deployed ✅</p>
                                        <p><strong>Network:</strong> Besu Edu‑Net</p>
                                        <p><strong>Gas spent by student:</strong> 0 (read‑only observation)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Read Contract State (No Transaction)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Reading state does <strong>not</strong> change the blockchain
                                and does <strong>not</strong> cost gas.
                            </p>
                            <button
                                onClick={() =>
                                    recordAction(
                                        { stateRead: true, storedValue: 0 },
                                        "Contract state can be read freely without a transaction."
                                    )
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Read stored value
                            </button>

                            {labState.stateRead && (
                                <div className="mt-3 text-sm font-mono">
                                    Stored value: {labState.storedValue}
                                </div>
                            )}
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Execute Contract Function (Transaction)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Changing contract state requires a signed transaction
                                and gas.
                            </p>
                            <button
                                onClick={() =>
                                    recordAction(
                                        {
                                            txPrepared: true,
                                            txHash: "0xTRANSACTION_HASH_PLACEHOLDER",
                                        },
                                        "State changes require executing a contract function via transaction."
                                    )
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Prepare state-changing call
                            </button>

                            {labState.txPrepared && (
                                <div className="mt-3 text-xs font-mono break-all">
                                    Transaction hash: {labState.txHash}
                                </div>
                            )}
                        </div>

                        {/* Step 4 */}
                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                4️⃣ Observe Updated Contract State
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                After the transaction is included in a block,
                                the contract’s state is permanently updated.
                            </p>
                            <button
                                onClick={() =>
                                    recordAction(
                                        {
                                            stateUpdated: true,
                                            updatedValue:
                                                (labState.storedValue ?? 0) + 1,
                                            explanationUnlocked: true,
                                        },
                                        "Smart contract state changes persist after execution."
                                    )
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Observe new state
                            </button>

                            {labState.stateUpdated && (
                                <div className="mt-3 text-sm font-mono">
                                    Updated value: {labState.updatedValue}
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border p-5 bg-white/70 dark:bg-slate-900/60">
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
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-300 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="text-xl font-semibold mb-2">🧠 Explanation</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Smart contracts are programs with persistent on-chain state.</li>
                            <li>Reading state is free; writing state requires gas.</li>
                            <li>State changes only occur after block inclusion.</li>
                        </ul>
                    </section>
                )}

                {/* 🔁 Utilities */}
                <section className="flex items-center justify-between pt-6 border-t">
                    <button
                        onClick={resetLab}
                        disabled={!canReset}
                        className={`text-sm ${canReset
                            ? "text-slate-700 dark:text-slate-200 hover:underline"
                            : "text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        🔁 Reset Lab
                    </button>
                </section>

            </div>
        </PageShell>
    );
};

export default Lab05Interaction;