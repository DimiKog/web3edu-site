import DecryptPanel from "../../components/projects/DecryptPanel";

export default function DecryptSingle({ shared }) {
    return (
        <DecryptPanel
            selectedTx={true}
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
            isGR={shared.isGR}
            setIsDecryptionCorrect={shared.setIsDecryptionCorrect}
        />
    );
}
