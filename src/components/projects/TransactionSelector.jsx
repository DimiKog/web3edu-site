export default function TransactionSelector({
    transactions,
    selectedTx,
    setSelectedTx,
    setIsDecryptionCorrect,
    setDecryptedOutput,
    setEncryptedInput,
    setSuggestedTrim,
    isGR,
}) {
    if (!transactions?.length) {
        return null;
    }

    const handleSelect = (txHash) => {
        setSelectedTx(txHash);
        setIsDecryptionCorrect(false);
        setDecryptedOutput("");
        setEncryptedInput("");
        setSuggestedTrim("");
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isGR ? "Επιλογή Συναλλαγής" : "Select Transaction"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
                {isGR
                    ? "Μόνο μία συναλλαγή περιέχει χρήσιμα δεδομένα. Επιλέξτε και εξερευνήστε."
                    : "Only one transaction contains meaningful data. Select and investigate."}
            </p>
            <div className="mt-3 space-y-3">
                {transactions.map((tx, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const label = tx.label || `${isGR ? "Συναλλαγή" : "Transaction"} ${letter}`;
                    const shortHash = `${tx.hash.slice(0, 6)}…${tx.hash.slice(-4)}`;
                    return (
                        <div
                            key={tx.id}
                            role="button"
                            aria-selected={selectedTx === tx.hash}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition ${selectedTx === tx.hash
                                ? "border-cyan-400/60 bg-cyan-50 dark:border-[#4ACBFF]/50 dark:bg-[#4ACBFF]/10"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                                }`}
                            onClick={() => handleSelect(tx.hash)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-xs text-cyan-800 dark:bg-[#4ACBFF]/20 dark:text-[#4ACBFF]">
                                    {letter}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-800 dark:text-white/90">{label}</span>
                                    <span className="text-[11px] text-slate-500 dark:text-white/50">{shortHash}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedTx === tx.hash && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300">
                                        {isGR ? "Επιλεγμένη" : "Selected"}
                                    </span>
                                )}
                                <a
                                    href={`https://blockexplorer.dimikog.org/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-cyan-700 underline dark:text-[#4ACBFF]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Explorer
                                </a>
                            </div>
                        </div>
                    );
                })}
                {selectedTx && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                        <p className="text-sm text-slate-600 dark:text-white/70">
                            {isGR
                                ? "Άνοιξε το Explorer, βρες τα Logs (DataStored) και αντέγραψε το πεδίο data."
                                : "Open the Explorer, find Logs (DataStored) and copy the data field."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
