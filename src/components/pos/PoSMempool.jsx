import React from "react";

export default function PoSMempool({
    mempool = [],
    selectedTxs = [],
    selected,
    blockNumber,
    phase,
    lang = "en",
}) {
    const shortenHash = (value, head = 10, tail = 8) =>
        value ? `${value.slice(0, head)}...${value.slice(-tail)}` : "-";
    const proposerReward = selectedTxs.reduce(
        (sum, tx) => sum + (tx.feeEth ?? 0),
        0
    );
    const blockTitle =
        phase === "finalized"
            ? lang === "gr"
                ? "Οριστικοποιημένο Block"
                : "Finalized Block"
            : lang === "gr"
                ? "Υποψήφιο Block"
                : "Candidate Block";

    return (
        <div className="mt-4 grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_140px_minmax(0,1.15fr)]">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">
                        Mempool
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                        {mempool.length} {lang === "gr" ? "ορατές" : "visible"}
                    </div>
                </div>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {lang === "gr"
                        ? "Εδώ βρίσκονται οι pending συναλλαγές πριν κάποιος proposer τις συμπεριλάβει."
                        : "Pending transactions stay here until a proposer includes them in a block."}
                </div>

                <div className="mt-3 max-h-[28rem] space-y-3 overflow-auto pr-1">
                    {mempool.length === 0 ? (
                        <div className="text-xs text-slate-500">
                            {lang === "gr" ? "Δεν υπάρχουν εκκρεμείς συναλλαγές" : "No pending transactions"}
                        </div>
                    ) : (
                        mempool.map((tx) => (
                            <div
                                key={tx.id}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-700 dark:bg-slate-950/30"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                            Pending Tx
                                        </div>
                                        <div className="mt-1 truncate font-mono text-xs text-slate-500">
                                            {shortenHash(tx.hash, 10, 6)}
                                        </div>
                                    </div>
                                    <div className="shrink-0 self-start rounded-full bg-slate-200/80 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-slate-700/70 dark:text-slate-300">
                                        Pending
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                        {lang === "gr" ? "Route" : "Route"}
                                    </div>
                                    <div className="mt-2 font-mono text-xs text-slate-700 dark:text-slate-200 sm:text-sm">
                                        {shortenHash(tx.from, 10, 6)} → {shortenHash(tx.to, 10, 6)}
                                    </div>
                                </div>

                                <div className="mt-3 grid gap-y-2 text-[11px] text-slate-500 dark:text-slate-300 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2 sm:text-xs">
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Value" : "Value"}</span> {tx.valueEth} ETH
                                    </div>
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Gas" : "Gas"}</span> {tx.gas?.toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Fee" : "Fee"}</span> {tx.feeEth?.toFixed(3)} ETH
                                    </div>
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Nonce" : "Nonce"}</span> {tx.nonce}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === "gr"
                        ? "Σε αυτό το demo, ο proposer επιλέγει αυτόματα ένα υποσύνολο συναλλαγών (προσομοιωμένη επιλογή)."
                        : "For this demo, the proposer automatically selects a subset of pending transactions (selection is simulated)."}
                </div>
            </div>

            <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/70 px-3 py-6 text-center dark:border-indigo-800 dark:bg-indigo-950/20">
                <div className="text-2xl text-indigo-500">→</div>
                <div className="mt-2 text-xs font-semibold text-indigo-500">
                    {lang === "gr" ? "Πρόταση block" : "Block proposal"}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === "gr"
                        ? "Ο proposer μεταφέρει συναλλαγές από το mempool στο candidate block."
                        : "The proposer moves transactions from the mempool into the candidate block."}
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {lang === "gr"
                        ? "Επιλέγονται από proposer → περιλαμβάνονται στο block"
                        : "Selected by proposer → included in block"}
                </div>
                <div className="my-2 flex items-center justify-center text-xs text-slate-400">
                    {lang === "gr"
                        ? "↓ Επιλέγονται από proposer → block"
                        : "↓ Selected by proposer → included in block"}
                </div>
            </div>

            {(blockNumber > 0 || phase !== "idle") && (
                <div className="min-w-0 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-700 dark:bg-indigo-900/30">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="font-semibold text-sm">
                            {blockTitle}
                        </div>
                        {selected && phase !== "idle" && (
                            <div className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                                {lang === "gr"
                                    ? `Προτάθηκε από Validator ${selected.id}`
                                    : `Proposed by Validator ${selected.id}`}
                            </div>
                        )}
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                            {phase === "idle"
                                ? lang === "gr"
                                    ? "Δεν υπάρχει ενεργό block ακόμη."
                                    : "No active block yet."
                                : lang === "gr"
                                    ? `Block #${blockNumber} από Validator ${selected?.id ?? "-"}`
                                    : `Block #${blockNumber} by Validator ${selected?.id ?? "-"}`}
                        </div>
                    </div>
                    <div className="rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-indigo-500 dark:border-indigo-800 dark:bg-slate-900/40">
                        {phase === "idle"
                            ? lang === "gr"
                                ? "Αναμονή"
                                : "Waiting"
                            : phase === "finalized"
                                ? lang === "gr"
                                    ? "Finality"
                                    : "Finality"
                                : lang === "gr"
                                    ? "Σε πρόοδο"
                                    : "In progress"}
                    </div>
                </div>

                <div className="mt-3 max-h-[28rem] space-y-3 overflow-auto pr-1">
                    {selectedTxs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-indigo-200 bg-white/50 px-3 py-4 text-sm text-slate-500 dark:border-indigo-800 dark:bg-slate-900/20">
                            {lang === "gr"
                                ? "Ο proposer δεν έχει επιλέξει ακόμη συναλλαγές."
                                : "The proposer has not selected transactions yet."}
                        </div>
                    ) : (
                        selectedTxs.map((tx) => (
                            <div
                                key={tx.id}
                                className="rounded-xl border border-indigo-300 bg-white/80 p-4 text-xs dark:border-indigo-600 dark:bg-slate-900/40"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-400">
                                            {lang === "gr" ? "Queued for block" : "Queued for block"}
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-indigo-500">
                                            {shortenHash(tx.hash, 12, 8)}
                                        </div>
                                    </div>
                                    <div className="self-start rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] text-indigo-600 dark:bg-indigo-800/40 dark:text-indigo-200 sm:shrink-0">
                                        {lang === "gr" ? "In block" : "In block"}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                        {lang === "gr" ? "Route" : "Route"}
                                    </div>
                                    <div className="mt-2 font-mono text-xs text-slate-700 dark:text-slate-200 sm:text-sm">
                                        {shortenHash(tx.from, 8, 6)} → {shortenHash(tx.to, 8, 6)}
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-500 dark:text-slate-300 sm:text-xs">
                                    <div className="whitespace-nowrap">
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Value" : "Value"}</span> {tx.valueEth} ETH
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Gas" : "Gas"}</span> {tx.gas?.toLocaleString()}
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Fee" : "Fee"}</span> {tx.feeEth?.toFixed(3)} ETH
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <span className="text-slate-400 dark:text-slate-500">{lang === "gr" ? "Nonce" : "Nonce"}</span> {tx.nonce}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedTxs.length > 0 && (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
                        {lang === "gr"
                            ? `Ανταμοιβή proposer από τα fees των επιλεγμένων συναλλαγών: ${proposerReward.toFixed(3)} ETH`
                            : `Proposer reward from included transaction fees: ${proposerReward.toFixed(3)} ETH`}
                    </div>
                )}

                <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-300">
                    {phase === "finalized"
                        ? lang === "gr"
                            ? "Αυτές οι συναλλαγές έχουν επιβεβαιωθεί και αφαιρέθηκαν από το mempool."
                            : "These transactions are confirmed and have been removed from the mempool."
                        : lang === "gr"
                            ? "Αν το δίκτυο απορρίψει το block, αυτές οι συναλλαγές θα παραμείνουν pending."
                            : "If the network rejected the block, these transactions would remain pending."}
                </div>
                </div>
            )}
        </div>
    );
}
