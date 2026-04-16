export default function DecryptPanel({
    selectedTx,
    encryptedInput,
    setEncryptedInput,
    userKey,
    setUserKey,
    decryptMessage,
    decryptedOutput,
    suggestedTrim,
    setSuggestedTrim,
    decryptAttempts,
    handlePlainTextPaste,
    isGR,
    isDecryptionCorrect,
    setIsDecryptionCorrect,
}) {
    const normalizeEncryptedInput = (value) =>
        (value || "").trim().replace(/^0x/i, "").replace(/\s+/g, "");

    const handleEncryptedInputPaste = (event) => {
        event.preventDefault();
        const text = event.clipboardData?.getData("text/plain") ?? "";
        setEncryptedInput(normalizeEncryptedInput(text));
        setIsDecryptionCorrect(false);
    };

    const fieldClass =
        "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-cyan-500/25 dark:!bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:[-webkit-text-fill-color:white] dark:[caret-color:white] dark:[color-scheme:dark] dark:focus:border-cyan-400/50 dark:focus:ring-cyan-900/30";

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isGR ? "Αποκρυπτογράφηση" : "Decrypt Message"}
            </h3>
            {selectedTx === false && (
                <p className="mt-2 text-sm font-medium text-cyan-800 dark:text-[#4ACBFF]">
                    {isGR
                        ? "Επιλέξτε πρώτα μια συναλλαγή από τη λίστα για να ενεργοποιηθεί η αποκρυπτογράφηση."
                        : "Select a transaction from the list first to enable decryption."}
                </p>
            )}
            <div className="mt-3 space-y-4">
                <p className="text-xs text-slate-500 dark:text-white/50">
                    {isGR
                        ? "Αντιγράψτε την τιμή από: Decoded → data (bytes)"
                        : "Copy the value from: Decoded → data (bytes)"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-white/40">
                    {isGR
                        ? "ΜΗ χρησιμοποιήσετε τα raw πεδία Data ή Topics. Χρησιμοποιήστε μόνο την decoded τιμή bytes."
                        : "Do NOT use the raw Data or Topics fields. Use only the decoded bytes value."}
                </p>
                <p className="text-[11px] font-mono text-slate-400 dark:text-white/35">
                    {isGR
                        ? "Παράδειγμα format: 4f7a2c9e1b3d5a6f8c0e2d4b6a8f1c3e5d7b9a0c2e4f6a8b0d1f3c5e7a9b2d4"
                        : "Example format: 4f7a2c9e1b3d5a6f8c0e2d4b6a8f1c3e5d7b9a0c2e4f6a8b0d1f3c5e7a9b2d4"}
                </p>
                <textarea
                    value={encryptedInput}
                    onInput={(e) => setEncryptedInput(e.currentTarget.value)}
                    onChange={(e) => {
                        setEncryptedInput(normalizeEncryptedInput(e.target.value));
                        setIsDecryptionCorrect(false);
                    }}
                    onPaste={handleEncryptedInputPaste}
                    placeholder={
                        isGR
                            ? "Επικολλήστε την τιμή Decoded → data (bytes)..."
                            : "Paste the Decoded → data (bytes) value..."
                    }
                    className={fieldClass}
                />
                <p className="text-xs text-slate-500 dark:text-white/50">
                    {isGR ? "Key για αποκρυπτογράφηση" : "Decryption key"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-white/40">
                    {isGR
                        ? "Το key είναι απλό string (όχι hex)."
                        : "The key is a plain string (not hex)."}
                </p>
                <input
                    type="text"
                    value={userKey}
                    onInput={(e) => setUserKey(e.currentTarget.value)}
                    onChange={(e) => {
                        setUserKey(e.target.value);
                        setIsDecryptionCorrect(false);
                    }}
                    onPaste={(e) => handlePlainTextPaste(e, setUserKey)}
                    placeholder={isGR ? "Εισάγετε το key..." : "Enter decryption key..."}
                    className={fieldClass}
                />
                <button
                    onClick={decryptMessage}
                    disabled={!encryptedInput || !userKey}
                    className="rounded-full bg-gradient-to-r from-[#4ACBFF] to-[#8A57FF] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isGR ? "Αποκρυπτογράφηση" : "Decrypt"}
                </button>
                {isDecryptionCorrect && (
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        {isGR
                            ? "✔ Σωστό μήνυμα! Μπορείτε να προχωρήσετε στην υποβολή."
                            : "✔ Correct message! You can proceed to submit."}
                    </p>
                )}
                {decryptedOutput && (
                    <div>
                        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-900 [overflow-wrap:anywhere] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                            {decryptedOutput}
                        </div>
                        <p className="mt-2 text-[11px] text-slate-400 dark:text-white/40">
                            {isGR
                                ? "Αν το μήνυμα φαίνεται λανθασμένο, ελέγξτε ξανά ότι αντιγράψατε τα σωστά δεδομένα από το αποκωδικοποιημένο event (δεν απαιτείται περικοπή ή μετατόπιση)."
                                : "If the message looks incorrect, double-check that you copied the correct data from the decoded event (no trimming or shifting is needed)."}
                        </p>
                    </div>
                )}
                {suggestedTrim && (
                    <div className="mt-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-900 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
                        <p className="mb-2 text-[11px] text-blue-800/90 dark:text-blue-200/80">
                            {isGR
                                ? "Τα δεδομένα των events περιέχουν δομή (offset, length, payload). Προσπαθήστε να εντοπίσετε το πραγματικό payload."
                                : "Event data contains structure (offset, length, payload). Try to identify the actual payload segment."}
                        </p>
                        {isGR
                            ? "Πιθανός υποψήφιος payload (από το αποκωδικοποιημένο event):"
                            : "Possible payload candidate (from decoded event):"}

                        <div className="mt-1 break-all font-mono">{suggestedTrim}</div>

                        <button
                            onClick={() => {
                                setEncryptedInput(suggestedTrim);
                                setSuggestedTrim("");
                            }}
                            className="mt-2 text-xs text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-white"
                        >
                            {isGR ? "Δοκιμάστε αυτό" : "Try this candidate"}
                        </button>
                    </div>
                )}
                {decryptAttempts >= 1 && (
                    <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-200">
                        <>
                            <p>
                                {isGR
                                    ? "Hint: Δεν αντιστοιχούν όλα τα bytes στο μήνυμα — κάποια ανήκουν στη δομή της κωδικοποίησης."
                                    : "Hint: Not all bytes represent the message — try isolating a smaller segment that looks like meaningful data."}
                            </p>
                            <p>
                                {isGR
                                    ? "Hint: Εστιάστε στην εξαγωγή του πραγματικού payload και όχι ολόκληρου του data field."
                                    : "Hint: Focus on extracting the actual payload, not the entire data field."}
                            </p>
                            <p>
                                {isGR
                                    ? "Hint: Χρήσιμες πληροφορίες συχνά αποθηκεύονται σε events και όχι στο κύριο transaction input."
                                    : "Hint: Useful information is often stored in events rather than the main transaction input."}
                            </p>
                        </>
                        {decryptAttempts >= 2 && (
                            <>
                                <p>
                                    {isGR
                                        ? "Hint: Η συναλλαγή περιέχει περισσότερα από ένα απλό transfer — ψάξτε για emitted data."
                                        : "Hint: The transaction contains more than just a transfer — look for emitted data."}
                                </p>
                                <p>
                                    {isGR
                                        ? "Hint: Τα events περιέχουν bytes που ακολουθούν συγκεκριμένη δομή. Δεν είναι όλα το μήνυμα."
                                        : "Hint: Event bytes follow a structure — not all of them are the actual message."}
                                </p>
                            </>
                        )}
                        {decryptAttempts >= 3 && (
                            <p>
                                {isGR
                                    ? "Hint: Μόλις απομονωθεί, το payload μπορεί να αποκρυπτογραφηθεί με το παρεχόμενο key."
                                    : "Hint: Once isolated, the payload can be decrypted using the provided key."}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
