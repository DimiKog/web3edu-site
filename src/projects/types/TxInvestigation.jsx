import TransactionSelector from "../../components/projects/TransactionSelector";
import DecryptPanel from "../../components/projects/DecryptPanel";

export default function TxInvestigation({ project, shared }) {
    const { isGR, selectedTx, setSelectedTx } = shared;

    return (
        <>
            <TransactionSelector
                transactions={project?.content?.transactions}
                selectedTx={selectedTx}
                setSelectedTx={setSelectedTx}
                setIsDecryptionCorrect={shared.setIsDecryptionCorrect}
                setDecryptedOutput={shared.setDecryptedOutput}
                setEncryptedInput={shared.setEncryptedInput}
                setSuggestedTrim={shared.setSuggestedTrim}
                isGR={isGR}
            />

            {!selectedTx && (
                <div className="mt-3 text-sm text-blue-300 font-medium">
                    {isGR
                        ? "Επιλέξτε μια συναλλαγή από τη λίστα για να συνεχίσετε."
                        : "Select a transaction from the list first to enable decryption."}
                </div>
            )}

            {selectedTx && (
                <DecryptPanel
                    selectedTx={selectedTx}
                    encryptedInput={shared.encryptedInput}
                    setEncryptedInput={shared.setEncryptedInput}
                    userKey={shared.userKey}
                    setUserKey={shared.setUserKey}
                    decryptMessage={shared.decryptMessage}
                    decryptedOutput={shared.decryptedOutput}
                    suggestedTrim={shared.suggestedTrim}
                    setSuggestedTrim={shared.setSuggestedTrim}
                    decryptAttempts={shared.decryptAttempts}
                    handlePlainTextPaste={shared.handlePlainTextPaste}
                    isGR={isGR}
                    setIsDecryptionCorrect={shared.setIsDecryptionCorrect}
                />
            )}
        </>
    );
}
