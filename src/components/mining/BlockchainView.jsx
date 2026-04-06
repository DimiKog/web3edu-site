import { useEffect, useRef, useState } from "react";
import BlockCard from "./BlockCard";
import { hashBlock } from "../../utils/mining";

export default function BlockchainView({ chain, setChain, copy, onStateChange, simState }) {
    const [activeBlock, setActiveBlock] = useState(null);
    const [isRepairMining, setIsRepairMining] = useState(false);
    const repairIntervalRef = useRef(null);
    const shortenHash = (value, head = 10, tail = 8) =>
        value ? `${value.slice(0, head)}...${value.slice(-tail)}` : "-";

    const [simHighlight, setSimHighlight] = useState(null);

    const onEditNonce = (index, newNonce) => {
        const updated = [...chain];

        for (let i = index; i < updated.length; i++) {
            const block = updated[i];

            const prevHash = i === 0
                ? block.previousHash
                : updated[i - 1].hash;

            const nonce = i === index ? newNonce : block.nonce;

            const newHash = hashBlock({
                previousHash: prevHash,
                transactions: block.transactions,
                nonce,
            });

            updated[i] = {
                ...block,
                previousHash: prevHash,
                nonce,
                hash: newHash,
            };
        }

        setChain(updated);
    };

    const activeBlockData = activeBlock === null ? null : chain.find((b) => b.index === activeBlock);

    const isGenesisBlock = (block) => block?.index === 0;

    const isLinkBroken = (idx) => {
        for (let i = 1; i <= idx; i++) {
            if (chain[i].previousHash !== chain[i - 1].hash) {
                return true;
            }
        }
        return false;
    };

    const isPowInvalid = (idx) => {
        const block = chain[idx];
        if (!block || idx === 0) return false;

        const difficulty = block.blockDifficulty ?? 2;
        const clean = block.hash?.startsWith("0x")
            ? block.hash.slice(2)
            : block.hash || "";

        return !clean.startsWith("0".repeat(difficulty));
    };

    const isBlockInvalid = (idx) => idx > 0 && (isLinkBroken(idx) || isPowInvalid(idx));

    const firstBrokenIndex = chain.findIndex((_, idx) => isBlockInvalid(idx));

    useEffect(() => {
        onStateChange?.({
            chain,
            firstBrokenIndex,
            activeBlock,
        });
    }, [chain, firstBrokenIndex, activeBlock, onStateChange]);

    useEffect(() => {
        if (!simState) return;

        if (simState.phase === "created") {
            setSimHighlight("tx-created");
        }

        if (simState.phase === "pending") {
            setSimHighlight("tx-pending");
        }

        if (simState.phase === "included") {
            setSimHighlight("block-added");
        }

        if (simState.phase === "executed") {
            setSimHighlight("state-updated");
        }
    }, [simState]);

    const getBlockPrompt = (block) => {
        if (!block) {
            return "Click a block to inspect it. Editing a transaction changes the block hash and can break the chain from that point onward.";
        }

        if (isGenesisBlock(block)) {
            return "This is the Genesis block. It anchors the chain and should remain valid.";
        }

        const idx = chain.findIndex((b) => b.index === block.index);
        const broken = idx > 0 && isBlockInvalid(idx);

        if (broken) {
            const isFirst = firstBrokenIndex === idx;
            return isFirst
                ? "Step 1: Repair this first broken block. Mine it until its hash satisfies the difficulty target. Then move to the next broken block."
                : "This block is downstream of an earlier break. First repair the earlier broken block, then re-mine this one.";
        }

        return "Edit a transaction or nonce in this block. That changes the block hash, and the next block may still point to the old hash.";
    };

    const inspectorTransactions = activeBlockData?.transactions || [];

    const updateBlockTransactions = (blockIndex, updater) => {
        const updated = [...chain];

        // update selected block first
        const block = updated[blockIndex];
        if (!block) return;

        const newTxs = updater(block.transactions);

        updated[blockIndex] = {
            ...block,
            transactions: newTxs,
        };

        // cascade update
        for (let i = blockIndex; i < updated.length; i++) {
            const b = updated[i];

            const prevHash = i === 0
                ? b.previousHash
                : updated[i - 1].hash;

            const newHash = hashBlock({
                previousHash: prevHash,
                transactions: b.transactions,
                nonce: b.nonce,
            });

            updated[i] = {
                ...b,
                previousHash: prevHash,
                hash: newHash,
            };
        }

        setChain(updated);
    };

    const autoMineActiveBlock = () => {
        if (activeBlockData == null || repairIntervalRef.current) return;

        const idx = chain.findIndex((b) => b.index === activeBlockData.index);
        if (idx === -1) return;

        const targetZeros = activeBlockData.blockDifficulty ?? 2;
        let candidateNonce = activeBlockData.nonce;
        setIsRepairMining(true);

        repairIntervalRef.current = setInterval(() => {
            const batchSize = Math.min(Math.pow(16, targetZeros - 1) * 10, 500);

            for (let i = 0; i < batchSize; i++) {
                const candidateHash = hashBlock({
                    previousHash: activeBlockData.previousHash,
                    transactions: activeBlockData.transactions,
                    nonce: candidateNonce,
                });

                const clean = candidateHash.startsWith("0x") ? candidateHash.slice(2) : candidateHash;
                if (clean.startsWith("0".repeat(targetZeros))) {
                    onEditNonce(activeBlockData.index, candidateNonce);
                    clearInterval(repairIntervalRef.current);
                    repairIntervalRef.current = null;
                    setIsRepairMining(false);
                    return;
                }

                candidateNonce += 1;
            }
        }, 10);
    };

    useEffect(() => {
        return () => {
            if (repairIntervalRef.current) {
                clearInterval(repairIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full">
            <h2 className="font-semibold">{copy.heading}</h2>

            <div className="text-xs text-slate-400 mt-1">
                Each block contains a hash of the previous block → forming a secure chain
            </div>

            {simHighlight && (
                <div className="mt-3 text-xs text-indigo-300">
                    {simHighlight === "tx-created" && "• Transaction created"}
                    {simHighlight === "tx-pending" && "• Transaction pending (waiting for block)"}
                    {simHighlight === "block-added" && "• Transaction included in new block"}
                    {simHighlight === "state-updated" && "• Contract executed — state updated"}
                </div>
            )}

            <div className="mt-4 flex w-full items-stretch gap-4 overflow-x-auto pb-2">
                {chain.map((block, idx) => {
                    const isLastBlock = idx === chain.length - 1;
                    const highlightBlock = simHighlight === "block-added" && isLastBlock;
                    return (
                        <div key={block.index} className="flex shrink-0 items-center gap-4">
                            <div className={highlightBlock ? "ring-2 ring-indigo-400 rounded-xl" : ""}>
                                <BlockCard
                                    block={block}
                                    previousBlock={chain[idx - 1]}
                                    copy={copy}
                                    activeBlock={activeBlock}
                                    setActiveBlock={setActiveBlock}
                                    isFirstBroken={idx === firstBrokenIndex}
                                />
                            </div>
                            {idx < chain.length - 1 && (() => {
                                const broken = isBlockInvalid(idx + 1);
                                return (
                                    <div className={`text-xl ${broken ? "text-red-400" : "text-slate-400"}`}>
                                        →
                                    </div>
                                );
                            })()}
                        </div>
                    );
                })}
            </div>

            {/* Chain validity indicator */}
            {firstBrokenIndex === -1 && chain.length > 0 && (
                <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-300">
                    ✔ Chain fully valid — all blocks satisfy proof-of-work and links are intact
                </div>
            )}
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-white">
                <div className="text-xs uppercase tracking-wide text-slate-400">Block Inspector</div>
                <div className="mt-2 text-sm text-slate-200">
                    {activeBlockData && (() => {
                        const idx = chain.findIndex((b) => b.index === activeBlockData.index);

                        const isGenesis = activeBlockData.index === 0;

                        // link validity
                        const linkBroken = idx > 0 && isLinkBroken(idx);

                        // proof-of-work validity
                        const difficulty = activeBlockData.blockDifficulty ?? 2;
                        const clean = activeBlockData.hash?.startsWith("0x")
                            ? activeBlockData.hash.slice(2)
                            : activeBlockData.hash || "";

                        const powInvalid = !isGenesis && !clean.startsWith("0".repeat(difficulty));

                        const isInvalid = linkBroken || powInvalid;

                        return (
                            <div className={`mt-2 rounded-lg px-3 py-2 text-xs ${isInvalid
                                ? "bg-red-900/30 border border-red-500 text-red-300"
                                : "bg-emerald-900/20 border border-emerald-500 text-emerald-300"
                                }`}>
                                {isInvalid
                                    ? (linkBroken
                                        ? "🔗 Broken link: previous hash mismatch"
                                        : "⛏ Invalid PoW: hash does not meet difficulty target")
                                    : "✔ Block valid"}
                            </div>
                        );
                    })()}
                    {activeBlockData ? `Inspecting Block #${activeBlockData.index}` : "No block selected"}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                    {getBlockPrompt(activeBlockData)}
                </div>
                <div className="mt-3 h-px bg-slate-700" />

                {activeBlockData && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Previous Hash</div>
                            <div className="mt-2 font-mono text-xs text-slate-300">{shortenHash(activeBlockData.previousHash, 14, 10)}</div>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Nonce</div>
                            <input
                                type="number"
                                value={activeBlockData.nonce}
                                onChange={(e) => {
                                    const next = Number(e.target.value);
                                    if (!Number.isNaN(next)) onEditNonce(activeBlockData.index, next);
                                }}
                                className="mt-2 w-full rounded border border-slate-600 bg-black/30 px-2 py-1 text-sm text-slate-100"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Transactions in selected block</div>
                    <div className="mt-2 space-y-2">
                        {!activeBlockData ? (
                            <div className="text-xs text-slate-500">Select a block to inspect its transactions.</div>
                        ) : inspectorTransactions.length === 0 ? (
                            <div className="text-xs text-slate-500">This block contains no transactions.</div>
                        ) : (
                            inspectorTransactions.map((tx, idx) => (
                                <div key={tx.id || idx} className="rounded-lg bg-slate-900/60 px-3 py-2">
                                    <div className="font-mono text-[11px] text-slate-400">{shortenHash(tx.hash, 12, 8)}</div>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        <input
                                            value={tx.from}
                                            onChange={(e) => updateBlockTransactions(activeBlockData.index, (transactions) => {
                                                const next = [...transactions];
                                                next[idx] = { ...next[idx], from: e.target.value };
                                                return next;
                                            })}
                                            className="rounded border border-slate-600 bg-black/30 px-2 py-1 text-xs font-mono text-slate-100"
                                        />
                                        <input
                                            value={tx.to}
                                            onChange={(e) => updateBlockTransactions(activeBlockData.index, (transactions) => {
                                                const next = [...transactions];
                                                next[idx] = { ...next[idx], to: e.target.value };
                                                return next;
                                            })}
                                            className="rounded border border-slate-600 bg-black/30 px-2 py-1 text-xs font-mono text-slate-100"
                                        />
                                    </div>
                                    <div className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
                                        <label className="space-y-1">
                                            <span className="block text-slate-500">Value (ETH)</span>
                                            <input
                                                value={tx.valueEth}
                                                onChange={(e) => updateBlockTransactions(activeBlockData.index, (transactions) => {
                                                    const next = [...transactions];
                                                    next[idx] = { ...next[idx], valueEth: e.target.value };
                                                    return next;
                                                })}
                                                className="w-full rounded border border-slate-600 bg-black/30 px-2 py-1 text-xs font-mono text-slate-100"
                                            />
                                        </label>
                                        <label className="space-y-1">
                                            <span className="block text-slate-500">Gas</span>
                                            <input
                                                type="number"
                                                value={tx.gas}
                                                onChange={(e) => updateBlockTransactions(activeBlockData.index, (transactions) => {
                                                    const next = [...transactions];
                                                    next[idx] = { ...next[idx], gas: Number(e.target.value) };
                                                    return next;
                                                })}
                                                className="w-full rounded border border-slate-600 bg-black/30 px-2 py-1 text-xs font-mono text-slate-100"
                                            />
                                        </label>
                                        <label className="space-y-1">
                                            <span className="block text-slate-500">Max Fee (gwei)</span>
                                            <input
                                                type="number"
                                                value={tx.maxFeeGwei}
                                                onChange={(e) => updateBlockTransactions(activeBlockData.index, (transactions) => {
                                                    const next = [...transactions];
                                                    next[idx] = { ...next[idx], maxFeeGwei: Number(e.target.value) };
                                                    return next;
                                                })}
                                                className="w-full rounded border border-slate-600 bg-black/30 px-2 py-1 text-xs font-mono text-slate-100"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {activeBlockData && chain.findIndex((b) => b.index === activeBlockData.index) === firstBrokenIndex && (
                        <div className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs text-amber-300">
                            Repair this block first
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={autoMineActiveBlock}
                        disabled={!activeBlockData || isRepairMining}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isRepairMining ? "Mining block..." : "Auto-mine selected block"}
                    </button>
                    {activeBlockData && chain.findIndex((b) => b.index === activeBlockData.index) === firstBrokenIndex && (
                        <div className="text-xs text-purple-300">
                            Mining this block will restore chain consistency
                        </div>
                    )}
                    <div className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400">
                        Hint: Fix the first broken block, mine it to satisfy the prefix target, then proceed to the next block.
                    </div>
                </div>
            </div>
        </div>
    );
}
