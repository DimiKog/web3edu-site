export default function Mempool({ mempool, selectedTxs, setSelectedTxs, copy }) {
    const shortenHash = (value, head = 10, tail = 8) => `${value.slice(0, head)}...${value.slice(-tail)}`;
    const shortenMobileAddress = (value) => shortenHash(value, 6, 4);
    const shortenDesktopAddress = (value) => shortenHash(value, 10, 6);

    const toggleTx = (tx) => {
        if (selectedTxs.some((t) => t.id === tx.id)) {
            setSelectedTxs(selectedTxs.filter((t) => t.id !== tx.id));
        } else {
            setSelectedTxs([...selectedTxs, tx]);
        }
    };

    return (
        <div className="grid w-full gap-5 lg:h-full lg:grid-cols-[minmax(0,2.05fr)_320px] xl:grid-cols-[minmax(0,2.22fr)_360px]">
            <div className="w-full rounded-2xl bg-gray-900 p-5 sm:p-6 lg:flex lg:h-full lg:flex-col lg:p-7">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-base sm:text-lg">{copy.heading}</h2>
                    <div className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                        {mempool.length} visible
                    </div>
                </div>

                <div className="mt-4 grid gap-3 lg:flex-1 lg:auto-rows-min lg:grid-cols-1 lg:overflow-auto lg:pr-2">
                    {mempool.map((tx) => {
                        const isSelected = selectedTxs.some((t) => t.id === tx.id);
                        return (
                            <div
                                key={tx.id}
                                onClick={() => toggleTx(tx)}
                                className={`rounded-xl border p-4 transition-all hover:shadow-lg ${isSelected
                                    ? "border-purple-400 bg-purple-600/25"
                                    : "border-gray-700 bg-gray-800/80 hover:border-slate-500 hover:bg-gray-800"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Pending Tx</div>
                                        <div className="mt-1 font-mono text-xs text-slate-200">
                                            {shortenHash(tx.hash, 14, 10)}
                                        </div>
                                    </div>
                                    <div className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${isSelected ? "bg-purple-500/30 text-purple-100" : "bg-slate-700/70 text-slate-300"}`}>
                                        {isSelected ? "In block" : "Pending"}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="min-w-0">
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Route</div>
                                        <div className="mt-2 font-mono text-xs text-slate-100 sm:text-sm">
                                            <span className="sm:hidden">
                                                {shortenMobileAddress(tx.from)} → {shortenMobileAddress(tx.to)}
                                            </span>
                                            <span className="hidden sm:inline">
                                                {shortenDesktopAddress(tx.from)} → {shortenDesktopAddress(tx.to)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-300 sm:text-xs">
                                        <div className="whitespace-nowrap"><span className="text-slate-500">Value</span> {tx.valueEth} ETH</div>
                                        <div className="whitespace-nowrap"><span className="text-slate-500">Gas</span> {tx.gas.toLocaleString()}</div>
                                        <div className="whitespace-nowrap"><span className="text-slate-500">Fee</span> {tx.maxFeeGwei} gwei</div>
                                        <div className="whitespace-nowrap"><span className="text-slate-500">Nonce</span> {tx.nonce}</div>
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-white/10 pt-2 text-xs font-medium text-slate-300">
                                    {isSelected ? "Click to remove from candidate block" : "Click to include in candidate block"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-full rounded-2xl border border-slate-700 bg-gray-900 p-4 sm:p-5 lg:flex lg:h-full lg:flex-col lg:p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="font-semibold text-base sm:text-lg">Selected</div>
                        <div className="mt-1 text-xs text-slate-400">Transactions queued for the next block</div>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                        {selectedTxs.length}
                    </div>
                </div>

                <div className="mt-4 space-y-3 lg:flex-1 lg:overflow-auto lg:pr-2">
                    {selectedTxs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/35 px-3 py-4 text-sm text-slate-500">
                            Select transactions from the mempool to build the candidate block.
                        </div>
                    ) : (
                        selectedTxs.map((tx) => (
                            <div
                                key={tx.id}
                                onClick={() => toggleTx(tx)}
                                className="cursor-pointer rounded-xl border border-purple-400 bg-purple-700/30 p-3 transition-all hover:bg-purple-700/40"
                            >
                                <div className="text-[11px] uppercase tracking-[0.18em] text-purple-100/80">Queued for block</div>
                                <div className="mt-2 font-mono text-xs text-slate-100">{shortenHash(tx.hash, 12, 8)}</div>
                                <div className="mt-2 font-mono text-[11px] text-slate-200 sm:text-xs">
                                    <span className="sm:hidden">
                                        {shortenMobileAddress(tx.from)} → {shortenMobileAddress(tx.to)}
                                    </span>
                                    <span className="hidden sm:inline">
                                        {shortenHash(tx.from, 8, 6)} → {shortenHash(tx.to, 8, 6)}
                                    </span>
                                </div>
                                <div className="mt-3 grid gap-x-3 gap-y-1 text-xs text-slate-200 sm:grid-cols-3">
                                    <span className="whitespace-nowrap">{tx.valueEth} ETH</span>
                                    <span className="whitespace-nowrap">{tx.gas.toLocaleString()} gas</span>
                                    <span className="whitespace-nowrap">Max Fee {tx.maxFeeGwei} gwei</span>
                                </div>
                                <div className="mt-3 border-t border-white/10 pt-2 text-xs text-red-200">Click to remove</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
