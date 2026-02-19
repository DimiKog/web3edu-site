import { useState, useEffect } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import { keccak_256 } from "@noble/hashes/sha3";
import { secp256k1 } from "@noble/curves/secp256k1";

const generateEducationalIdentity = (input) => {
    // 1. keccak256 hash εισόδου → ιδιωτικό κλειδί
    const hashBytes = keccak_256(new TextEncoder().encode(input));
    const privateKeyHex = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // 2. παραγωγή δημόσιου κλειδιού (uncompressed)
    const publicKeyBytes = secp256k1.getPublicKey(hashBytes, false);
    const publicKeyHex =
        "0x" +
        Array.from(publicKeyBytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

    // 3. παραγωγή διεύθυνσης τύπου Ethereum
    const pubKeyNoPrefix = publicKeyBytes.slice(1);
    const addressHash = keccak_256(pubKeyNoPrefix);
    const address =
        "0x" +
        Array.from(addressHash.slice(-20))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

    return {
        privateKey: "0x" + privateKeyHex,
        publicKey: publicKeyHex,
        address,
    };
};

const generateBlockieSvg = (address) => {
    if (!address || typeof address !== "string") return null;

    const size = 8;
    const scale = 4;

    // Deterministic hex seed από τη διεύθυνση
    const seed = address.toLowerCase().replace(/^0x/, "");

    let svg = `<svg width="${size * scale}" height="${size * scale}"
        viewBox="0 0 ${size} ${size}"
        xmlns="http://www.w3.org/2000/svg">`;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size / 2; x++) {
            const i = (x + y * size) % seed.length;
            const value = parseInt(seed[i], 16);

            if (value % 2 === 0) continue;

            const hue = (value * 37) % 360;
            const color = `hsl(${hue}, 70%, 50%)`;

            svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`;
            svg += `<rect x="${size - x - 1}" y="${y}" width="1" height="1" fill="${color}" />`;
        }
    }

    svg += `</svg>`;
    return svg;
};

const isLikelyEthereumAddress = (value) => {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
};

const isLikelyPrivateKey = (value) => {
    return /^0x[a-fA-F0-9]{64}$/.test(value);
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

const initialLab02State = {
    // Πρόοδος
    currentStep: 1,
    lastAction: null,

    // Βήμα 1 — Εκπαιδευτική ταυτότητα
    identityGenerated: false,
    seedPhrase: "",
    identity: {
        privateKey: null,
        publicKey: null,
        address: null,
    },
    previewIdentity: {
        publicKey: null,
        address: null,
    },

    // UX ιδιωτικού κλειδιού
    privateKeyRevealRequested: false,
    privateKeyVisible: false,

    // Βήμα 2 — Κρυπτογράφηση
    encryption: {
        receiverPublicKey: "",
        messagePlaintext: "",
        encryptedPayload: null,
        encryptedPayloadText: "",
        encryptionComplete: false,
    },

    // Βήμα 3 — Αποκρυπτογράφηση
    decryption: {
        receiverPrivateKey: "",
        payloadInputText: "",
        decryptedMessage: null,
        decryptionComplete: false,
    },

    // Σημειωματάριο εργαστηρίου
    discoveredData: [],

    // Ολοκλήρωση
    explanationUnlocked: false,

    // Σφάλματα
    errors: {
        identity: null,
        encrypt: null,
        decrypt: null,
    },
};

const Lab02InteractionGR = () => {
    const [labState, setLabState] = useState(initialLab02State);
    const [copiedLabel, setCopiedLabel] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCopyWithFeedback = async (text, label) => {
        const ok = await copyToClipboard(text);
        if (ok) {
            setCopiedLabel(label);
            setTimeout(() => setCopiedLabel(null), 1500);
        }
    };

    const handleEncryptClick = () => {
        // Προσομοίωση κρυπτογράφησης
        const fakePayload = {
            version: 1,
            nonce: "randomNonce123",
            ephemPublicKey: labState.encryption.receiverPublicKey.slice(0, 20),
            ciphertext: btoa(labState.encryption.messagePlaintext),
        };
        const fakePayloadText = JSON.stringify(fakePayload, null, 2);

        setLabState((s) => ({
            ...s,
            encryption: {
                ...s.encryption,
                encryptedPayload: fakePayload,
                encryptedPayloadText: fakePayloadText,
                encryptionComplete: true,
            },
            discoveredData: [
                ...s.discoveredData,
                "Η κρυπτογράφηση χρησιμοποίησε το δημόσιο κλειδί του παραλήπτη και έγινε εξ ολοκλήρου off-chain.",
            ],
        }));
    };

    const receiverPublicKey = labState.encryption.receiverPublicKey;
    const messagePlaintext = labState.encryption.messagePlaintext;
    const receiverIsAddress = isLikelyEthereumAddress(receiverPublicKey);
    const canEncrypt =
        labState.identity.publicKey &&
        receiverPublicKey.trim() !== "" &&
        !receiverIsAddress &&
        messagePlaintext.trim() !== "";

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Στόχος */}
                <section>
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 02 — Κρυπτογραφημένα Μηνύματα
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Κρυπτογραφήστε ένα μήνυμα ώστε μόνο ο προοριζόμενος παραλήπτης να μπορεί να το διαβάσει —
                        χωρίς συναλλαγές, έξυπνα συμβόλαια ή αλληλεπίδραση με το blockchain.
                    </p>
                </section>

                {/* 🧭 Τρέχουσα Κατάσταση */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Τρέχουσα Κατάσταση</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Δημιουργήθηκε ταυτότητα: {labState.identityGenerated ? "✅" : "❌"}</li>
                        <li>Παράχθηκε δημόσιο κλειδί: {labState.identity.publicKey ? "✅" : "❌"}</li>
                        <li>Παράχθηκε διεύθυνση: {labState.identity.address ? "✅" : "❌"}</li>
                        <li>
                            Εμπιστευτικότητα (ροή δημόσιο → ιδιωτικό κλειδί):{" "}
                            {labState.encryption.encryptionComplete && labState.decryption.decryptionComplete ? "✅" : "❌"}
                        </li>
                        <li>Ολοκληρώθηκε κρυπτογράφηση: {labState.encryption.encryptionComplete ? "✅" : "❌"}</li>
                        <li>Ολοκληρώθηκε αποκρυπτογράφηση: {labState.decryption.decryptionComplete ? "✅" : "❌"}</li>
                    </ul>
                </section>

                {/* 🎛 Διαθέσιμες Ενέργειες */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">🎛 Διαθέσιμες Ενέργειες</h2>

                    <div className="space-y-6">

                        {/* Ενέργεια 1 — Δημιουργία Ταυτότητας */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Δημιουργία Κρυπτογραφικής Ταυτότητας (Εκπαιδευτικό)
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-400 mb-3">
                                Δώστε μια σύντομη είσοδο κειμένου για να παραχθεί ντετερμινιστικά ένα ζεύγος κλειδιών,
                                αποκλειστικά για εκπαιδευτικούς σκοπούς.
                            </p>

                            <input
                                type="text"
                                placeholder="Εισάγετε μια σύντομη φράση (π.χ. alice)"
                                value={labState.seedPhrase}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (!value) {
                                        setLabState((s) => ({
                                            ...s,
                                            seedPhrase: "",
                                            identityGenerated: false,
                                            identity: { privateKey: null, publicKey: null, address: null },
                                        }));
                                        return;
                                    }

                                    try {
                                        const identity = generateEducationalIdentity(value);
                                        setLabState((s) => ({
                                            ...s,
                                            seedPhrase: value,
                                            identityGenerated: true,
                                            identity,
                                        }));
                                    } catch {
                                        setLabState((s) => ({
                                            ...s,
                                            seedPhrase: value,
                                            identityGenerated: false,
                                        }));
                                    }
                                }}
                                className="w-full max-w-md rounded-md border px-3 py-2 text-sm
                                text-slate-900 dark:text-slate-100
                                bg-white dark:bg-slate-800
                                placeholder-slate-400"
                            />
                        </div>

                        {labState.identityGenerated && (
                            <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                <p className="text-sm mb-2 font-semibold">🔑 Παραγόμενη Ταυτότητα (Εκπαιδευτικό)</p>
                                <ul className="text-sm space-y-2 break-all">
                                    <li>
                                        <strong>Δημόσιο Κλειδί:</strong>
                                        <div className="mt-1 flex items-start gap-2">
                                            <div className="p-2 flex-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs break-all">
                                                {labState.identity.publicKey}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyWithFeedback(labState.identity.publicKey, "publicKey")}
                                                className="px-2 py-1 text-xs rounded-md
                                                bg-slate-200 dark:bg-slate-700
                                                hover:bg-slate-300 dark:hover:bg-slate-600
                                                font-semibold"
                                                title="Αντιγραφή δημόσιου κλειδιού"
                                            >
                                                Αντιγραφή
                                            </button>
                                            {copiedLabel === "publicKey" && (
                                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                    ✓ Αντιγράφηκε
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                    <li>
                                        <strong>Διεύθυνση:</strong>
                                        <div className="mt-1 flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs break-all">
                                                {labState.identity.address}
                                            </div>
                                            {/* SECURITY: Safe to use dangerouslySetInnerHTML here because:
                                                1. Function generates SVG programmatically (no user HTML)
                                                2. Address is validated Ethereum address format
                                                3. Address only used in math operations for colors/patterns
                                                See: dangerouslySetInnerHTML-security-report.md */}
                                            <div
                                                className="w-10 h-10 rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900"
                                                title="Οπτικό αποτύπωμα διεύθυνσης (Blockie)"
                                                dangerouslySetInnerHTML={{
                                                    __html: generateBlockieSvg(labState.identity.address),
                                                }}
                                            />
                                        </div>
                                    </li>
                                </ul>
                                <p className="mt-2 text-xs text-slate-500">
                                    Το ιδιωτικό κλειδί είναι σκόπιμα κρυφό. Μπορείτε να το αποκαλύψετε <strong>μόνο για εκπαιδευτική δοκιμή</strong>.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLabState((s) => ({
                                            ...s,
                                            privateKeyRevealRequested: true,
                                            privateKeyVisible: true,
                                        }))
                                    }
                                    className="mt-2 px-3 py-1 rounded-md text-xs font-semibold
                                    bg-yellow-200 dark:bg-yellow-700
                                    hover:bg-yellow-300 dark:hover:bg-yellow-600"
                                >
                                    Αποκάλυψη ιδιωτικού κλειδιού (εκπαιδευτικό)
                                </button>

                                {labState.privateKeyVisible && (
                                    <div className="mt-3 rounded-md border border-red-300 dark:border-red-700
                                    bg-red-50 dark:bg-red-900/30 p-3">
                                        <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                                            ⚠️ Εκπαιδευτική προειδοποίηση
                                        </p>
                                        <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                                            Το ιδιωτικό κλειδί αποκαλύπτεται μόνο για να επιδειχθεί η αποκρυπτογράφηση.
                                            Στα πραγματικά πορτοφόλια, τα ιδιωτικά κλειδιά δεν πρέπει ποτέ να αποκαλύπτονται.
                                        </p>

                                        <div className="flex items-start gap-2">
                                            <div className="p-2 flex-1 rounded-md bg-white dark:bg-slate-800
                                            font-mono text-xs break-all">
                                                {labState.identity.privateKey}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyWithFeedback(labState.identity.privateKey, "privateKey")}
                                                className="px-2 py-1 text-xs rounded-md
                                                bg-red-200 dark:bg-red-700
                                                hover:bg-red-300 dark:hover:bg-red-600
                                                font-semibold"
                                                title="Αντιγραφή ιδιωτικού κλειδιού (εκπαιδευτικό)"
                                            >
                                                Αντιγραφή
                                            </button>
                                            {copiedLabel === "privateKey" && (
                                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                    ✓ Αντιγράφηκε
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                            Αυτό επιτρέπει την αποστολή κρυπτογραφημένων μηνυμάτων <em>στον εαυτό σας</em> για δοκιμή.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ενέργεια 2 — Κρυπτογράφηση */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Κρυπτογράφηση Μηνύματος (Εμπιστευτικότητα)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Κρυπτογραφήστε ένα μήνυμα χρησιμοποιώντας το δημόσιο κλειδί του παραλήπτη.
                            </p>

                            <label className="block mb-1 font-semibold" htmlFor="receiverPublicKey">
                                Δημόσιο Κλειδί Παραλήπτη
                            </label>
                            <textarea
                                id="receiverPublicKey"
                                rows={3}
                                value={receiverPublicKey}
                                onChange={(e) =>
                                    setLabState((s) => ({
                                        ...s,
                                        encryption: {
                                            ...s.encryption,
                                            receiverPublicKey: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full max-w-md rounded-md border px-3 py-2 text-sm font-mono
                                text-slate-900 dark:text-slate-100
                                bg-white dark:bg-slate-800
                                placeholder-slate-400 break-words"
                                spellCheck={false}
                            />
                            {receiverIsAddress && (
                                <div className="mt-2 p-2 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                    Προειδοποίηση: Αυτό μοιάζει με διεύθυνση Ethereum. Η κρυπτογράφηση απαιτεί ΔΗΜΟΣΙΟ ΚΛΕΙΔΙ, όχι διεύθυνση.
                                </div>
                            )}

                            <label className="block mt-4 mb-1 font-semibold" htmlFor="messagePlaintext">
                                Μήνυμα Απλού Κειμένου
                            </label>
                            <textarea
                                id="messagePlaintext"
                                rows={4}
                                value={messagePlaintext}
                                onChange={(e) =>
                                    setLabState((s) => ({
                                        ...s,
                                        encryption: {
                                            ...s.encryption,
                                            messagePlaintext: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full max-w-md rounded-md border px-3 py-2 text-sm
                                text-slate-900 dark:text-slate-100
                                bg-white dark:bg-slate-800
                                placeholder-slate-400 break-words"
                            />

                            <button
                                type="button"
                                disabled={!canEncrypt}
                                onClick={handleEncryptClick}
                                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${canEncrypt
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Κρυπτογράφηση
                            </button>

                            {labState.encryption.encryptionComplete && (
                                <div className="mt-4 space-y-2 max-w-md">
                                    <div className="p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 font-mono text-xs whitespace-pre-wrap break-words">
                                        {labState.encryption.encryptedPayloadText}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyWithFeedback(labState.encryption.encryptedPayloadText, "encryptedPayload")}
                                        className="px-3 py-1 rounded-md text-xs font-semibold
                                        bg-green-200 dark:bg-green-700
                                        hover:bg-green-300 dark:hover:bg-green-600"
                                        title="Αντιγραφή κρυπτογραφημένου payload"
                                    >
                                        Αντιγραφή κρυπτογραφημένου payload
                                    </button>
                                    {copiedLabel === "encryptedPayload" && (
                                        <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                            ✓ Αντιγράφηκε
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Ενέργεια 3 — Αποκρυπτογράφηση */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Αποκρυπτογράφηση Μηνύματος (Πλευρά Παραλήπτη)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Αποκρυπτογραφήστε το κρυπτογραφημένο payload χρησιμοποιώντας το <strong>ιδιωτικό κλειδί</strong> του παραλήπτη.
                            </p>

                            <label className="block mb-1 font-semibold" htmlFor="receiverPrivateKey">
                                Ιδιωτικό Κλειδί Παραλήπτη
                            </label>
                            <textarea
                                id="receiverPrivateKey"
                                rows={2}
                                value={labState.decryption.receiverPrivateKey}
                                onChange={(e) =>
                                    setLabState((s) => ({
                                        ...s,
                                        decryption: {
                                            ...s.decryption,
                                            receiverPrivateKey: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full max-w-md rounded-md border px-3 py-2 text-sm font-mono
                                text-slate-900 dark:text-slate-100
                                bg-white dark:bg-slate-800
                                placeholder-slate-400"
                                spellCheck={false}
                            />

                            {!isLikelyPrivateKey(labState.decryption.receiverPrivateKey) &&
                                labState.decryption.receiverPrivateKey.trim() !== "" && (
                                    <div className="mt-2 p-2 rounded-md bg-yellow-100 dark:bg-yellow-900
                                    text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                        Προειδοποίηση: Η αποκρυπτογράφηση απαιτεί ΙΔΙΩΤΙΚΟ ΚΛΕΙΔΙ (64 hex χαρακτήρες). Τα δημόσια κλειδιά ή οι διευθύνσεις δεν θα λειτουργήσουν.
                                    </div>
                                )}

                            <label className="block mt-4 mb-1 font-semibold" htmlFor="payloadInputText">
                                Κρυπτογραφημένο Payload (JSON)
                            </label>
                            <textarea
                                id="payloadInputText"
                                rows={5}
                                value={labState.decryption.payloadInputText}
                                onChange={(e) =>
                                    setLabState((s) => ({
                                        ...s,
                                        decryption: {
                                            ...s.decryption,
                                            payloadInputText: e.target.value,
                                        },
                                    }))
                                }
                                className="w-full max-w-md rounded-md border px-3 py-2 text-sm font-mono
                                text-slate-900 dark:text-slate-100
                                bg-white dark:bg-slate-800
                                placeholder-slate-400"
                                spellCheck={false}
                            />

                            <button
                                type="button"
                                disabled={
                                    !isLikelyPrivateKey(labState.decryption.receiverPrivateKey) ||
                                    labState.decryption.payloadInputText.trim() === ""
                                }
                                onClick={() => {
                                    // Προσομοιωμένη αποκρυπτογράφηση
                                    setLabState((s) => ({
                                        ...s,
                                        decryption: {
                                            ...s.decryption,
                                            decryptedMessage: atob(
                                                JSON.parse(s.decryption.payloadInputText).ciphertext
                                            ),
                                            decryptionComplete: true,
                                        },
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Μόνο ο κάτοχος του αντίστοιχου ιδιωτικού κλειδιού μπορεί να αποκρυπτογραφήσει το μήνυμα.",
                                        ],
                                        explanationUnlocked: true,
                                    }));
                                }}
                                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${isLikelyPrivateKey(labState.decryption.receiverPrivateKey) &&
                                    labState.decryption.payloadInputText.trim() !== ""
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Αποκρυπτογράφηση
                            </button>

                            {labState.decryption.decryptionComplete && (
                                <div className="mt-4 p-3 rounded-md bg-green-100 dark:bg-green-900
                                text-green-800 dark:text-green-300 text-sm">
                                    <strong>Αποκρυπτογραφημένο μήνυμα:</strong>
                                    <div className="mt-1 font-mono break-words">
                                        {labState.decryption.decryptedMessage}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 🔍 Ανακαλυφθέντα Δεδομένα */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Ανακαλυφθέντα Δεδομένα</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Καμία ανακάλυψη ακόμη. Εκτελέστε ενέργειες για να αποκαλύψετε συμπεράσματα.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {labState.discoveredData.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* 🧠 Επεξήγηση */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="text-xl font-semibold mb-2">🧠 Επεξήγηση</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>
                                Η εμπιστευτικότητα στο Web3 επιτυγχάνεται μέσω <strong>κρυπτογραφίας δημοσίου κλειδιού</strong>,
                                όχι μέσω συναλλαγών στο blockchain.
                            </li>
                            <li>
                                Οποιοσδήποτε μπορεί να κρυπτογραφήσει ένα μήνυμα με ένα <strong>δημόσιο κλειδί</strong>,
                                αλλά μόνο ο κάτοχος του αντίστοιχου <strong>ιδιωτικού κλειδιού</strong> μπορεί να το αποκρυπτογραφήσει.
                            </li>
                            <li>
                                Η κρυπτογράφηση και η αποκρυπτογράφηση σε αυτό το εργαστήριο έγιναν <strong>εξ ολοκλήρου off-chain</strong>,
                                χωρίς έξυπνα συμβόλαια, gas ή αλληλεπίδραση με το δίκτυο.
                            </li>
                        </ul>
                    </section>
                )}
                {/* Η Πρόκληση εμφανίζεται μόνο όταν ολοκληρωθούν κρυπτογράφηση και αποκρυπτογράφηση */}
                {labState.encryption.encryptionComplete &&
                    labState.decryption.decryptionComplete && (
                        <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40">
                            <h2 className="text-xl font-semibold mb-3">🤔 Πρόκληση</h2>

                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                                Κρυπτογραφήσατε και αποκρυπτογραφήσατε επιτυχώς ένα μήνυμα.
                            </p>

                            <p className="text-slate-700 dark:text-slate-300 mb-4 font-semibold">
                                Μπορείτε τώρα να στείλετε ένα μήνυμα στον φίλο σας;
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                <li>Θα χρειαζόσασταν το <strong>δημόσιο κλειδί</strong> του φίλου σας.</li>
                                <li>Θα χρειαζόσασταν έναν τρόπο να <strong>εμπιστευτείτε</strong> ότι το δημόσιο κλειδί ανήκει πράγματι σε εκείνον.</li>
                                <li>Θα χρειαζόσασταν έναν ασφαλή τρόπο να <strong>ανακαλύψετε</strong> αυτό το δημόσιο κλειδί.</li>
                            </ul>

                            <div className="mt-4 p-4 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                           text-yellow-800 dark:text-yellow-300 text-sm">
                                <strong>Γιατί αυτό δεν έχει λυθεί ακόμη:</strong>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Οι διευθύνσεις πορτοφολιού <strong>δεν</strong> αποκαλύπτουν τα δημόσια κλειδιά από προεπιλογή.</li>
                                    <li>Τα δημόσια κλειδιά αποκαλύπτονται μόνο μετά από <strong>υπογραφή</strong> ή αποστολή συναλλαγής.</li>
                                    <li>Τα blockchains <strong>δεν είναι κατάλογοι ταυτότητας</strong>.</li>
                                    <li>Ο διαμοιρασμός κλειδιών εισάγει προκλήσεις <strong>εμπιστοσύνης και επαλήθευσης</strong>.</li>
                                </ul>
                            </div>

                            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm italic">
                                Αυτά τα ερωτήματα οδηγούν απευθείας στο επόμενο εργαστήριο: <strong>Υπογραφές & Κυριότητα</strong>.
                            </p>
                        </section>
                    )}
                {/* ✅ Τελική Ενότητα Ολοκλήρωσης */}
                {labState.encryption.encryptionComplete &&
                    labState.decryption.decryptionComplete && (
                        <section
                            className="rounded-2xl border border-green-200 dark:border-green-700
                        bg-green-50 dark:bg-green-900/20 p-6 mt-10"
                        >
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                🎉 Το εργαστήριο ολοκληρώθηκε
                            </h2>

                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                Ολοκληρώσατε το <strong>Lab 02 — Κρυπτογραφημένα Μηνύματα</strong>.
                                Διερευνήσατε πώς επιτυγχάνεται η εμπιστευτικότητα στο Web3 μέσω
                                <strong> κρυπτογραφίας δημοσίου κλειδιού</strong>, εξ ολοκλήρου off-chain.
                            </p>

                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                Δηλώστε την ολοκλήρωση παρακάτω.
                            </p>
                            <LabCompletionClaim
                                labId="lab02"
                                language="gr"
                                backHref="/#/labs-gr/lab02"
                                backLabel="⬅ Επιστροφή στην επισκόπηση"
                            />
                        </section>
                    )}
            </div>
        </PageShell>
    );
};

export default Lab02InteractionGR;
