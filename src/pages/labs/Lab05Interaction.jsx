import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const initialLab05State = {
    currentStep: 1,
    lastAction: null,

    contractObserved: false,
    stateRead: false,
    storedValue: null,
    txPrepared: false,
    txHash: null,
    stateUpdated: false,
    updatedValue: null,
    discoveredData: [],
    explanationUnlocked: false,
};

const demoContractAddress = "0x9de0C731c8FA34CD0a47497dE4f569CbaaD5ab5F";

const counterAbi = [
    "function value() view returns (uint256)",
    "function increment()",
];

const Lab05Interaction = () => {
    const [labState, setLabState] = useState(initialLab05State);
    const [showContractDetails, setShowContractDetails] = useState(false);
    const [creatorFeedback, setCreatorFeedback] = useState(null);
    const [selectedCreator, setSelectedCreator] = useState("");

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
        setCreatorFeedback(null);
        setSelectedCreator("");
    };

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 05 — Smart Contracts & State
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Understand how smart contracts store state on-chain and how
                        transactions execute code that permanently modifies it.
                    </p>
                </section>

                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>

                    {labState.lastAction && (
                        <div className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold">
                            ✅ {labState.lastAction}
                        </div>
                    )}

                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Contract existence observed (on-chain code): {labState.contractObserved ? "✅" : "❌"}</li>
                        <li>State read (read-only, no gas): {labState.stateRead ? "✅" : "❌"}</li>
                        <li>Function execution prepared (transaction intent): {labState.txPrepared ? "✅" : "❌"}</li>
                        <li>State updated on-chain (after block): {labState.stateUpdated ? "✅" : "❌"}</li>
                        <li>Blockchain interaction required: {labState.txPrepared ? "✅" : "❌"}</li>
                    </ul>
                </section>

                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">
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
                                href={`https://blockexplorer.dimikog.org/address/${demoContractAddress}`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                            >
                                🔍 Open Contract in Block Explorer
                            </a>
                            <div className="mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-sm text-yellow-900 dark:text-yellow-200">
                                <p className="font-semibold mb-2">🧭 Where to find the real code</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">This Lab UI</div>
                                        <div className="opacity-80">Guides you</div>
                                    </div>
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">Block Explorer</div>
                                        <div className="opacity-80">Shows verified source</div>
                                    </div>
                                    <div className="p-2 rounded border bg-white/70 dark:bg-slate-900/30">
                                        <div className="font-semibold">On-chain Contract</div>
                                        <div className="opacity-80">Code + state live here</div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Open the explorer → click <strong>Code</strong>. That Solidity is the <strong>verified</strong> contract.
                                </p>
                            </div>
                            <div className="mt-4 p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 border">
                                👀 Hint: Find the <strong>Creator / Deployer</strong> field in the explorer before answering.
                            </div>
                            <div className="mt-4 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Who deployed (created) this contract?
                                </label>
                                <select
                                    className="w-full max-w-md px-3 py-2 border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-sm"
                                    value={selectedCreator}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setSelectedCreator(selected);
                                        const isCorrect =
                                            selected === "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E";
                                        if (isCorrect) {
                                            setCreatorFeedback("correct");
                                            recordAction(
                                                { contractObserved: true },
                                                "The contract creator was verified directly from the block explorer."
                                            );
                                            setShowContractDetails(true);
                                        } else if (selected !== "") {
                                            setCreatorFeedback("wrong");
                                        }
                                    }}
                                >
                                    <option value="" disabled>
                                        Select creator address
                                    </option>
                                    <option value="0x3A91b2cD9E0f4c6F21b8E1aA0C4eD92F7C5A1123">
                                        0x3A91b2cD9E0f4c6F21b8E1aA0C4eD92F7C5A1123
                                    </option>
                                    <option value="0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E">
                                        0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E
                                    </option>
                                    <option value="0x91F0cA7eD8bE4F29C2aA8E1bC0d9F34E7A5B6C89">
                                        0x91F0cA7eD8bE4F29C2aA8E1bC0d9F34E7A5B6C89
                                    </option>
                                </select>
                                {creatorFeedback === "correct" && (
                                    <div className="mt-2 p-3 rounded-md bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-600 text-green-900 dark:text-green-200 text-sm font-semibold">
                                        ✅ Correct. This address is listed as the contract creator in the Block Explorer.
                                    </div>
                                )}
                                {creatorFeedback === "wrong" && (
                                    <div className="mt-2 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 text-sm font-semibold">
                                        ❌ Not quite. Check the <strong>Creator / Deployer</strong> field in the Block Explorer and try again.
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 mt-2">
                                Smart contracts are deployed code + state stored permanently on-chain, not abstractions or placeholders.
                            </p>
                            {showContractDetails && labState.contractObserved && (
                                <div className="mt-4 p-4 border rounded bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-900 dark:text-indigo-300">
                                    <p>
                                        This address points to a verified smart contract deployed on Besu Edu‑Net.
                                    </p>
                                    <p className="mt-2">
                                        The <strong>Code</strong> tab in the block explorer is the single source of truth
                                        for the contract logic.
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

                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Read Contract State (No Transaction)
                            </h3>
                            <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-sm text-blue-900 dark:text-blue-200">
                                <div className="font-semibold mb-2">📖 READ (eth_call)</div>
                                <div className="flex flex-wrap gap-2 text-xs mb-2">
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">⛽ Gas: 0</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">✍️ Signature: No</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">📦 Block: No</span>
                                    <span className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/30 border">🔁 State change: No</span>
                                </div>
                                <div>
                                    You will read <strong>value()</strong> from the deployed contract at
                                    <code className="font-mono ml-1">{demoContractAddress}</code>.
                                </div>
                            </div>
                            <div className="mt-3 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700 text-sm text-indigo-900 dark:text-indigo-200">
                                🔍 <strong>Explorer Tip:</strong> Open the contract in the block explorer and locate the
                                <span className="mx-1 px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 font-mono text-xs">value()</span>
                                function under the <strong>Read Contract</strong> section.
                                <br />
                                This function exists because <code className="font-mono">value</code> is declared <strong>public</strong> in Solidity.
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">⛽ Gas: 0</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">✍️ Signature: No</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">📦 Block: No</span>
                                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 border">🔁 State change: No</span>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        const contract = new Contract(demoContractAddress, counterAbi, provider);
                                        const value = await contract.value();
                                        recordAction(
                                            {
                                                stateRead: true,
                                                storedValue: Number(value),
                                            },
                                            "A read-only call returned the contract state without creating a transaction."
                                        );
                                    } catch (err) {
                                        alert("Failed to read contract state: " + (err?.message ?? err));
                                    }
                                }}
                                className="mt-4 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Read current on-chain state
                            </button>

                            {labState.stateRead && (
                                <div className="mt-3 text-sm font-mono animate-fade-in">
                                    Current value: {labState.storedValue}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Execute Contract Function (Transaction)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Calling <code className="font-mono">increment()</code> requires a signed transaction,
                                gas, and block inclusion.
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        await provider.send("eth_requestAccounts", []);
                                        const signer = await provider.getSigner();
                                        const contract = new Contract(demoContractAddress, counterAbi, signer);
                                        const tx = await contract.increment();
                                        recordAction(
                                            {
                                                txPrepared: true,
                                                txHash: tx.hash,
                                            },
                                            "A signed transaction was sent to execute smart contract code."
                                        );
                                        await tx.wait();
                                    } catch (err) {
                                        alert("Transaction failed: " + (err?.message ?? err));
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Execute increment()
                            </button>

                            {labState.txPrepared && (
                                <div className="mt-3 p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-sm text-green-900 dark:text-green-300">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>A transaction was created and signed.</li>
                                        <li>The network included it in a block.</li>
                                        <li>Contract code was executed on-chain.</li>
                                    </ul>
                                    <div className="mt-2 font-mono text-xs break-all">
                                        Transaction hash: {labState.txHash}
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                        👉 Proceed to Step 4 to read the updated contract state.
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                💡 Until this transaction is mined, the contract state is <strong>not yet changed</strong>.
                            </p>
                        </div>

                        <div className="rounded-xl border p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                4️⃣ Observe Updated Contract State
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                After the transaction is included in a block,
                                the contract’s state is permanently updated.
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const provider = new BrowserProvider(window.ethereum);
                                        const contract = new Contract(demoContractAddress, counterAbi, provider);
                                        const value = await contract.value();
                                        recordAction(
                                            {
                                                stateUpdated: true,
                                                updatedValue: Number(value),
                                                explanationUnlocked: true,
                                            },
                                            "Smart contract state changes persist after execution."
                                        );
                                    } catch (err) {
                                        alert("Failed to read updated state: " + (err?.message ?? err));
                                    }
                                }}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Read updated on-chain state
                            </button>

                            {labState.stateUpdated && (
                                <div className="mt-3 text-sm font-mono animate-fade-in">
                                    Updated value: {labState.updatedValue}
                                </div>
                            )}
                            {labState.stateUpdated && (
                                <div className="mt-4 p-4 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30">
                                    <h4 className="font-semibold mb-3 text-indigo-900 dark:text-indigo-200">
                                        🔍 Read-Before vs Read-After Comparison
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Before Transaction (Step 2)</div>
                                            <div className="mt-1 font-mono text-lg font-bold">
                                                {labState.storedValue}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">After Transaction (Step 4)</div>
                                            <div className="mt-1 font-mono text-lg font-bold text-green-700 dark:text-green-300">
                                                {labState.updatedValue}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-indigo-800 dark:text-indigo-300">
                                        The difference proves that a <strong>transaction</strong> (Step 3) permanently modified on-chain state.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border p-5 bg-white/70 dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Discovered Data</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No discoveries yet — complete steps above to unlock insights.
                        </p>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/40 border rounded-md p-3">
                            <p className="text-sm mb-2">
                                Here’s what you proved (by interacting with the real contract):
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {labState.discoveredData.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-300 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="text-xl font-semibold mb-2">🧠 Explanation</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Smart contracts are deployed code + state stored on-chain.</li>
                            <li>Read-only calls (<code className="font-mono">eth_call</code>) do not create transactions and cost no gas.</li>
                            <li>Executing a contract function requires a signed transaction and gas.</li>
                            <li>State changes become permanent only after block inclusion.</li>
                        </ul>
                        <p className="mt-4 font-semibold text-indigo-900 dark:text-indigo-200">
                            <em>Pattern to remember: read → write → read.</em>
                        </p>
                    </section>
                )}

                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-green-300 dark:border-green-700 p-6 bg-green-50 dark:bg-green-900/20 mt-8">
                        <h2 className="text-xl font-semibold mb-2">🎉 Lab Completed</h2>
                        <p className="mb-4 text-slate-700 dark:text-slate-200">
                            You have completed this lab. Claim your completion below.
                        </p>
                        <LabCompletionClaim
                            labId="lab05"
                            language="en"
                            backHref="/#/labs/lab05"
                            backLabel="⬅ Back to Lab Overview"
                        />
                    </section>
                )}

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
