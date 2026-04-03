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
            <h3 className="text-lg font-semibold text-white">
                {isGR ? "Επιλογή Συναλλαγής" : "Select Transaction"}
            </h3>
            <p className="mt-2 text-sm text-white/60">
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
                                ? "border-[#4ACBFF]/50 bg-[#4ACBFF]/10"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                }`}
                            onClick={() => handleSelect(tx.hash)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4ACBFF]/20 text-xs text-[#4ACBFF]">
                                    {letter}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-white/90">{label}</span>
                                    <span className="text-[11px] text-white/50">{shortHash}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedTx === tx.hash && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
                                        {isGR ? "Επιλεγμένη" : "Selected"}
                                    </span>
                                )}
                                <a
                                    href={`https://blockexplorer.dimikog.org/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[#4ACBFF] underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Explorer
                                </a>
                            </div>
                        </div>
                    );
                })}
                {selectedTx && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-sm text-white/70">
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
