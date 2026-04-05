export default function BlockCard({ block, copy, previousBlock, activeBlock, setActiveBlock, difficulty = 2, isFirstBroken = false }) {
    const isGenesis = block.index === 0;

    const prevHash = block.previousHash;
    const currentHash = block.hash;

    const isValidLink = isGenesis || !previousBlock
        ? true
        : block.previousHash === previousBlock.hash;

    // mining validity (difficulty check)
    const blockDifficulty = isGenesis ? 0 : Number(block.blockDifficulty ?? difficulty);
    const cleanHash = (currentHash || "").replace(/^0x/, "");
    const isMined = isGenesis ? true : cleanHash.startsWith("0".repeat(blockDifficulty));

    // do not invalidate older blocks visually when editing a later block
    const isBeforeActive = activeBlock !== null && block.index < activeBlock;

    const isBlockValid = isGenesis
        ? true
        : isBeforeActive
            ? isValidLink
            : (isValidLink && isMined);

    const shorten = (h) => (h ? h.slice(0, 10) + "..." : "-");

    const isActive = activeBlock === block.index;

    const shortenAddress = (value) => (value ? `${value.slice(0, 8)}...${value.slice(-6)}` : "-");

    return (
        <div
            onClick={() => setActiveBlock && setActiveBlock(block.index)}
            className={`min-w-[260px] rounded-xl border p-5 sm:min-w-[280px] xl:min-w-[320px] transition-all cursor-pointer hover:ring-1 hover:ring-slate-400 ${isBlockValid ? "bg-gray-900 border-gray-700" : "bg-red-900/80 border-red-500 shadow-lg shadow-red-500/20"} ${isActive ? "ring-2 ring-blue-400 scale-[1.01]" : "hover:scale-[1.01] hover:border-slate-500"}`}
        >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <div className="font-semibold">
                        {isGenesis ? "Genesis Block" : `Block #${block.index}`}
                    </div>
                    <div className="text-xs text-slate-500">
                        {isGenesis ? "Initial block" : "Contains transactions + nonce"}
                    </div>
                </div>
                {isFirstBroken && (
                    <div className="text-[10px] px-2 py-1 rounded bg-amber-900/40 border border-amber-500 text-amber-300">
                        First broken
                    </div>
                )}
            </div>

            {/* Previous Hash */}
            <div className="text-xs">
                <span className="text-slate-400">Previous:</span>{" "}
                {isGenesis ? "-" : shorten(prevHash)}
            </div>

            {/* Current Hash */}
            <div className="text-xs break-all mt-1">
                <span className="text-slate-400">Hash:</span>
                <div className="mt-1 font-mono text-slate-200">
                    {(() => {
                        const full = currentHash || "";
                        const clean = full.startsWith("0x") ? full.slice(2) : full;
                        const prefix = clean.slice(0, blockDifficulty);
                        const rest = clean.slice(blockDifficulty);
                        const prefixValid = blockDifficulty === 0 || prefix === "0".repeat(blockDifficulty);

                        return (
                            <>
                                <span className="text-slate-500">0x</span>
                                <span className={prefixValid ? "text-emerald-400" : "text-red-400"}>{prefix}</span>
                                <span className="text-slate-300">{rest.slice(0, 10)}...</span>
                            </>
                        );
                    })()}
                </div>
                {!isGenesis && (
                    <div className="mt-1 text-[11px] text-slate-500">
                        Target: {"0".repeat(blockDifficulty)}
                    </div>
                )}
            </div>

            {/* Nonce */}
            <div className="text-xs mt-1">
                <span className="text-slate-400">Nonce:</span> <span className="text-slate-300">{block.nonce}</span>
            </div>

            {/* Transactions */}
            <div className="mt-2">
                <div className="text-xs text-slate-400 mb-1">Transactions:</div>
                <div className="text-[11px] text-slate-500 mb-2">Coinbase (reward + fees) is included in the block hash</div>

                {(!block.transactions || block.transactions.length === 0) && (
                    <div className="text-xs text-slate-500">No transactions</div>
                )}

                <div className="space-y-2">
                    {block.transactions && block.transactions.map((tx, idx) => {
                        const isCoinbase = tx?.from === "network";
                        return (
                            <div
                                key={tx.id || idx}
                                className={`rounded-lg border p-2 ${isCoinbase ? "border-amber-500 bg-amber-900/30" : "border-slate-700 bg-slate-950/60"}`}
                            >
                                <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                                    {isCoinbase ? "Coinbase (reward)" : "Transaction"}
                                </div>

                                <div className="text-xs font-mono text-slate-300 flex gap-1 items-center">
                                    <span>{shortenAddress(tx.from)}</span>
                                    →
                                    <span>{shortenAddress(tx.to)}</span>
                                </div>

                                <div className="text-xs mt-1">
                                    <span className="text-slate-400">Value:</span> <span className="text-slate-200">{tx.valueEth} ETH</span>
                                </div>

                                <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400">
                                    <div>Gas: <span className="text-slate-300">{tx.gas?.toLocaleString()}</span></div>
                                    <div>Fee: <span className="text-slate-300">{tx.maxFeeGwei} gwei</span></div>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">Click block to inspect</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Validity Indicator */}
            <div className="text-xs mt-3">
                {isBlockValid ? (
                    <div className="text-green-400 font-medium">✔ Block valid</div>
                ) : !isValidLink ? (
                    <div className="text-red-400 font-medium">✖ Chain broken here</div>
                ) : (
                    <div className="text-red-400 font-medium">✖ Invalid proof-of-work for this block</div>
                )}
            </div>
        </div>
    );
}
