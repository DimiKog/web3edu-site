import { useState, useRef, useEffect } from "react";
import { hashBlock } from "../../utils/mining";

const shortenHash = (value, head = 10, tail = 8) => {
    if (!value) return "-";
    return `${value.slice(0, head)}...${value.slice(-tail)}`;
};

export default function MiningControls({
    chain,
    selectedTxs,
    setChain,
    setMempool,
    setSelectedTxs,
    copy,
}) {
    const [nonce, setNonce] = useState(0);
    const [hash, setHash] = useState("");
    const [isMining, setIsMining] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const intervalRef = useRef(null);
    const [difficulty, setDifficulty] = useState(2); // selectable difficulty
    const totalSelectedFeesGwei = selectedTxs.reduce((sum, tx) => {
        const feeGwei = Number(tx?.maxFeeGwei || 0);
        const gas = Number(tx?.gas || 0);
        return sum + feeGwei * gas;
    }, 0);
    const totalSelectedFeesEth = totalSelectedFeesGwei / 1e9;
    const isValidHash = (h) => {
        if (!h) return false;
        const clean = h.startsWith("0x") ? h.slice(2) : h;
        return clean.startsWith("0".repeat(difficulty));
    };

    const previousBlock = chain[chain.length - 1];

    const mine = () => {
        const newHash = hashBlock({
            previousHash: previousBlock.hash,
            transactions: selectedTxs,
            nonce,
        });

        setHash(newHash);
        // optional: could auto-increment nonce for next attempt
    };

    const autoMine = () => {
        if (intervalRef.current) return;

        let currentNonce = nonce;
        setIsMining(true);

        intervalRef.current = setInterval(() => {
            const batchSize = Math.min(Math.pow(16, difficulty - 1) * 10, 500);

            for (let i = 0; i < batchSize; i++) {
                const newHash = hashBlock({
                    previousHash: previousBlock.hash,
                    transactions: selectedTxs,
                    nonce: currentNonce,
                });

                if (isValidHash(newHash)) {
                    setNonce(currentNonce);
                    setHash(newHash);
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setIsMining(false);
                    return;
                }

                currentNonce++;
            }

            setAttempts((prev) => prev + batchSize);

            const previewHash = hashBlock({
                previousHash: previousBlock.hash,
                transactions: selectedTxs,
                nonce: currentNonce,
            });

            setNonce(currentNonce);
            setHash(previewHash);
        }, 10);
    };

    const addBlock = () => {
        if (!hash || !isValidHash(hash)) return;

        // --- Coinbase transaction (reward + fees) ---
        const BLOCK_REWARD_ETH = 2.0;

        const coinbaseTx = {
            id: `coinbase-${Date.now()}`,
            from: "network",
            to: "miner",
            valueEth: (BLOCK_REWARD_ETH + totalSelectedFeesEth).toFixed(6),
            gas: 0,
            maxFeeGwei: 0,
            nonce: 0,
        };

        const txs = selectedTxs || [];

        const newBlock = {
            index: chain.length,
            previousHash: previousBlock.hash,
            transactions: [coinbaseTx, ...txs],
            nonce,
            hash,
            blockDifficulty: difficulty,
        };

        setChain([...chain, newBlock]);

        // remove only selected txs from mempool (coinbase not included there anyway)
        setMempool((prev) =>
            prev.filter((tx) => !txs.some((t) => t.id === tx.id))
        );

        setSelectedTxs([]);
        setHash("");
        setNonce(0);
        setAttempts(0);
    };

    const stopMining = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsMining(false);
        }
    };

    useEffect(() => {
        setHash("");
        stopMining();
    }, [difficulty, selectedTxs]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const reset = () => {
        setNonce(0);
        setHash("");
        setAttempts(0);
        stopMining();
    };

    return (
        <div className="space-y-5">
            <h2 className="font-semibold">{copy.heading}</h2>
            <div className="text-xs text-slate-400">
                Difficulty: {"0".repeat(difficulty)}
            </div>

            <div className="grid gap-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_140px]">
                    <select disabled={isMining}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full rounded bg-gray-900 p-2 text-sm"
                    >
                        <option value={2}>Difficulty 2 (00...)</option>
                        <option value={3}>Difficulty 3 (000...)</option>
                        <option value={4}>Difficulty 4 (0000...)</option>
                    </select>

                    <div className="space-y-2">
                        <div className="text-xs text-slate-400">
                            Nonce (change to find a valid hash)
                        </div>

                        <input disabled={isMining}
                            type="number"
                            value={nonce}
                            onChange={(e) => {
                                const newNonce = Number(e.target.value);
                                setNonce(newNonce);

                                const newHash = hashBlock({
                                    previousHash: previousBlock.hash,
                                    transactions: selectedTxs,
                                    nonce: newNonce,
                                });

                                setHash(newHash);
                            }}
                            className="w-full rounded bg-gray-900 p-2"
                            aria-label={copy.nonceLabel}
                        />
                    </div>
                </div>

                <div className={`rounded border p-4 lg:p-5 ${isMining ? "border-yellow-400" : "border-slate-700"}`}>
                    <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Mining inputs</div>
                        <div className="mt-3 grid gap-3 text-sm">
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_180px]">
                                <div className="rounded-lg bg-slate-800/45 p-3">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Previous Hash</div>
                                    <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs sm:text-sm">
                                        {shortenHash(previousBlock.hash, 14, 8)}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-slate-800/45 p-3">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Nonce</div>
                                    <div className={`mt-2 text-base font-semibold ${isMining ? "text-yellow-300" : "text-slate-100"}`}>{nonce}</div>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg bg-slate-800/45 p-3">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Difficulty Target</div>
                                    <div className="mt-2 font-mono text-sm text-slate-100">{"0".repeat(difficulty)}</div>
                                </div>
                                <div className="rounded-lg bg-slate-800/45 p-3">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fees Collected</div>
                                    <div className="mt-2 font-mono text-sm text-slate-100">{totalSelectedFeesEth.toFixed(6)} ETH</div>
                                    <div className="mt-1 text-[11px] text-slate-500">{totalSelectedFeesGwei.toLocaleString()} gwei</div>
                                </div>
                            </div>
                            <div className="rounded-lg border border-slate-700/80 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-300">
                                Miner reward = <span className="font-mono text-slate-100">2.000000 ETH</span> block reward + collected fees.
                                Fees are estimated here as <span className="font-mono text-slate-100">gas x max fee</span> for each selected transaction.
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Selected Transactions</div>
                        <div className="mt-3 max-h-36 space-y-2 overflow-auto pr-1">
                            {(() => {
                                // compute coinbase preview (same logic as addBlock)
                                const BLOCK_REWARD_ETH = 2.0;

                                const coinbaseTx = {
                                    id: "coinbase-preview",
                                    from: "network",
                                    to: "miner",
                                    valueEth: (BLOCK_REWARD_ETH + totalSelectedFeesEth).toFixed(6),
                                };

                                const allTxs = [coinbaseTx, ...(selectedTxs || [])];

                                if (allTxs.length === 0) {
                                    return (
                                        <div className="rounded-lg bg-slate-800/35 px-3 py-2 text-xs text-slate-500">
                                            No transactions (coinbase will still be included)
                                        </div>
                                    );
                                }

                                return allTxs.map((tx, idx) => {
                                    const isCoinbase = tx.from === "network";

                                    return (
                                        <div key={tx.id || idx} className={`rounded-lg px-3 py-3 ${isCoinbase ? "bg-amber-900/40 border border-amber-500" : "bg-slate-800/60"}`}>
                                            {isCoinbase && (
                                                <div className="text-[10px] uppercase tracking-wide text-amber-400 mb-1">
                                                    Coinbase (Reward + Fees)
                                                </div>
                                            )}

                                            <div className="mt-1 font-mono text-xs text-slate-200">
                                                {tx.from} → {tx.to}
                                            </div>

                                            <div className="mt-2 text-xs text-slate-200">
                                                {tx.valueEth} ETH
                                            </div>

                                            {!isCoinbase && (
                                                <div className="mt-2 grid gap-x-4 gap-y-1 text-xs text-slate-200 md:grid-cols-3">
                                                    <span className="whitespace-nowrap">{tx.gas.toLocaleString()} gas</span>
                                                    <span className="whitespace-nowrap">Max Fee {tx.maxFeeGwei} gwei</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button onClick={mine} disabled={isMining} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium">
                        {copy.mineButton}
                    </button>
                    <button onClick={autoMine} disabled={isMining} className="rounded-md bg-purple-500 px-3 py-2 text-sm font-medium">
                        {copy.autoMineButton || "Auto Mine"}
                    </button>
                    <button onClick={stopMining} disabled={!isMining} className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50">
                        Stop
                    </button>
                    <button onClick={reset} className="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium">
                        Reset
                    </button>
                </div>

                <div className="text-xs text-slate-400">
                    Attempts: {attempts}
                </div>
            </div>

            <div className="text-xs text-slate-400">
                Current hash (valid prefix in green):
            </div>
            <div className="text-base sm:text-lg font-mono break-all">
                {hash && (() => {
                    const clean = hash.startsWith("0x") ? hash.slice(2) : hash;
                    const prefix = clean.slice(0, difficulty);
                    const rest = clean.slice(difficulty);

                    return (
                        <>
                            <span className="text-slate-400">0x</span>
                            <span className="text-green-400">{prefix}</span>
                            <span className="text-red-400">{rest}</span>
                        </>
                    );
                })()}
            </div>

            {hash && isValidHash(hash) && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-300">
                    Valid hash found. You can now add this block to the chain.
                </div>
            )}

            <button
                onClick={addBlock}
                disabled={!hash || !isValidHash(hash)}
                className="rounded bg-green-500 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {copy.addBlockButton}
            </button>
        </div>
    );
}
