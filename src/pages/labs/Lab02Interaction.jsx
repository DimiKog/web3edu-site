import { useState, useEffect } from "react";
import PageShell from "../../components/PageShell";
import { keccak_256 } from "@noble/hashes/sha3";
import { secp256k1 } from "@noble/curves/secp256k1";

const generateEducationalIdentity = (input) => {
    // 1. keccak256 hash of input → private key
    const hashBytes = keccak_256(new TextEncoder().encode(input));
    const privateKeyHex = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // 2. derive public key (uncompressed)
    const publicKeyBytes = secp256k1.getPublicKey(hashBytes, false);
    const publicKeyHex =
        "0x" +
        Array.from(publicKeyBytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

    // 3. derive Ethereum-style address
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

    // Deterministic hex seed from address
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
    // Progress
    currentStep: 1,
    lastAction: null,

    // Step 1 — Educational identity
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

    // Private key UX
    privateKeyRevealRequested: false,
    privateKeyVisible: false,

    // Step 2 — Encryption
    encryption: {
        receiverPublicKey: "",
        messagePlaintext: "",
        encryptedPayload: null,
        encryptedPayloadText: "",
        encryptionComplete: false,
    },

    // Step 3 — Decryption
    decryption: {
        receiverPrivateKey: "",
        payloadInputText: "",
        decryptedMessage: null,
        decryptionComplete: false,
    },

    // Lab notebook
    discoveredData: [],

    // Completion
    explanationUnlocked: false,

    // Errors
    errors: {
        identity: null,
        encrypt: null,
        decrypt: null,
    },
};

const Lab02Interaction = () => {
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
        // Simulate encryption
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
                "Encryption used the receiver’s public key and occurred entirely off‑chain.",
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

                {/* 🎯 Goal */}
                <section>
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 02 — Encrypted Messages
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Encrypt a message so that only the intended receiver can read it —
                        without transactions, smart contracts, or blockchain interaction.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>Identity generated: {labState.identityGenerated ? "✅" : "❌"}</li>
                        <li>Public key derived: {labState.identity.publicKey ? "✅" : "❌"}</li>
                        <li>Address derived: {labState.identity.address ? "✅" : "❌"}</li>
                        <li>
                            Confidentiality (public → private key flow):{" "}
                            {labState.encryption.encryptionComplete && labState.decryption.decryptionComplete ? "✅" : "❌"}
                        </li>
                        <li>Encryption complete: {labState.encryption.encryptionComplete ? "✅" : "❌"}</li>
                        <li>Decryption complete: {labState.decryption.decryptionComplete ? "✅" : "❌"}</li>
                    </ul>
                </section>

                {/* 🎛 Available Actions (placeholders) */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">

                        {/* Action 1 — Generate Identity */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Generate Cryptographic Identity (Educational)
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-400 mb-3">
                                Provide a short text input to deterministically generate a key pair
                                for learning purposes only.
                            </p>

                            <input
                                type="text"
                                placeholder="Enter a short phrase (e.g. alice)"
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
                                <p className="text-sm mb-2 font-semibold">🔑 Generated Identity (Educational)</p>
                                <ul className="text-sm space-y-2 break-all">
                                    <li>
                                        <strong>Public Key:</strong>
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
                                                title="Copy public key"
                                            >
                                                Copy
                                            </button>
                                            {copiedLabel === "publicKey" && (
                                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                    ✓ Copied
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                    <li>
                                        <strong>Address:</strong>
                                        <div className="mt-1 flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs break-all">
                                                {labState.identity.address}
                                            </div>
                                            <div
                                                className="w-10 h-10 rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900"
                                                title="Address visual fingerprint (Blockie)"
                                                dangerouslySetInnerHTML={{
                                                    __html: generateBlockieSvg(labState.identity.address),
                                                }}
                                            />
                                        </div>
                                    </li>
                                </ul>
                                <p className="mt-2 text-xs text-slate-500">
                                    Private key is intentionally hidden. You may reveal it <strong>only for educational testing</strong>.
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
                                    Reveal private key (educational)
                                </button>

                                {labState.privateKeyVisible && (
                                    <div className="mt-3 rounded-md border border-red-300 dark:border-red-700
                                    bg-red-50 dark:bg-red-900/30 p-3">
                                        <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                                            ⚠️ Educational warning
                                        </p>
                                        <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                                            This private key is revealed only to demonstrate decryption.
                                            In real wallets, private keys must never be exposed.
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
                                                title="Copy private key (educational)"
                                            >
                                                Copy
                                            </button>
                                            {copiedLabel === "privateKey" && (
                                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                                    ✓ Copied
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                            This enables sending encrypted messages <em>to yourself</em> for testing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action 2 — Encrypt */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Encrypt a Message (Confidentiality)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Encrypt a message using the receiver’s public key.
                            </p>

                            <label className="block mb-1 font-semibold" htmlFor="receiverPublicKey">
                                Receiver Public Key
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
                                    Warning: This looks like an Ethereum address. Encryption requires a PUBLIC KEY, not an address.
                                </div>
                            )}

                            <label className="block mt-4 mb-1 font-semibold" htmlFor="messagePlaintext">
                                Plaintext Message
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
                                Encrypt
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
                                        title="Copy encrypted payload"
                                    >
                                        Copy encrypted payload
                                    </button>
                                    {copiedLabel === "encryptedPayload" && (
                                        <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                            ✓ Copied
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action 3 — Decrypt */}
                        <div className="rounded-xl border p-5">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Decrypt the Message (Receiver Side)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Decrypt the encrypted payload using the receiver’s <strong>private key</strong>.
                            </p>

                            <label className="block mb-1 font-semibold" htmlFor="receiverPrivateKey">
                                Receiver Private Key
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
                                        Warning: Decryption requires a PRIVATE KEY (64 hex characters). Public keys or addresses will not work.
                                    </div>
                                )}

                            <label className="block mt-4 mb-1 font-semibold" htmlFor="payloadInputText">
                                Encrypted Payload (JSON)
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
                                    // Simulated decryption
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
                                            "Only the holder of the corresponding private key can decrypt the message.",
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
                                Decrypt
                            </button>

                            {labState.decryption.decryptionComplete && (
                                <div className="mt-4 p-3 rounded-md bg-green-100 dark:bg-green-900
                                text-green-800 dark:text-green-300 text-sm">
                                    <strong>Decrypted message:</strong>
                                    <div className="mt-1 font-mono break-words">
                                        {labState.decryption.decryptedMessage}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Discovered Data</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No discoveries yet. Perform actions to reveal insights.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {labState.discoveredData.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* 🧠 Explanation */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="text-xl font-semibold mb-2">🧠 Explanation</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>
                                Confidentiality in Web3 is achieved through <strong>public‑key cryptography</strong>,
                                not through blockchain transactions.
                            </li>
                            <li>
                                Anyone can encrypt a message using a <strong>public key</strong>,
                                but only the holder of the corresponding <strong>private key</strong> can decrypt it.
                            </li>
                            <li>
                                Encryption and decryption in this lab occurred <strong>entirely off‑chain</strong>,
                                without smart contracts, gas, or network interaction.
                            </li>
                        </ul>
                    </section>
                )}
                {/* Show Challenge only when both encryption and decryption are complete */}
                {labState.encryption.encryptionComplete &&
                    labState.decryption.decryptionComplete && (
                        <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40">
                            <h2 className="text-xl font-semibold mb-3">🤔 Challenge</h2>

                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                                You successfully encrypted and decrypted a message.
                            </p>

                            <p className="text-slate-700 dark:text-slate-300 mb-4 font-semibold">
                                Can you now send a message to your friend?
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                                <li>You would need your friend’s <strong>public key</strong>.</li>
                                <li>You would need a way to <strong>trust</strong> that the public key really belongs to them.</li>
                                <li>You would need a safe way to <strong>discover</strong> that public key.</li>
                            </ul>

                            <div className="mt-4 p-4 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                           text-yellow-800 dark:text-yellow-300 text-sm">
                                <strong>Why this is not solved yet:</strong>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Wallet addresses do <strong>not</strong> expose public keys by default.</li>
                                    <li>Public keys are revealed only after <strong>signing</strong> or sending a transaction.</li>
                                    <li>Blockchains are <strong>not identity directories</strong>.</li>
                                    <li>Sharing keys introduces <strong>trust and verification</strong> challenges.</li>
                                </ul>
                            </div>

                            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm italic">
                                These questions lead directly to the next lab: <strong>Signatures & Ownership</strong>.
                            </p>
                        </section>
                    )}
                {/* ✅ Final Completion Section */}
                {labState.encryption.encryptionComplete &&
                    labState.decryption.decryptionComplete && (
                        <section
                            className="rounded-2xl border border-green-200 dark:border-green-700
                        bg-green-50 dark:bg-green-900/20 p-6 mt-10"
                        >
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                🎉 Lab Completed
                            </h2>

                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                You have completed <strong>Lab 02 — Encrypted Messages</strong>.
                                You explored how confidentiality in Web3 is achieved using
                                <strong> public‑key cryptography</strong>, entirely off‑chain.
                            </p>

                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                Return to the lab overview to mark this lab as completed and
                                claim your rewards.
                            </p>

                            <a
                                href="/#/labs/lab02"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                            bg-green-600 hover:bg-green-700
                            text-white font-semibold transition"
                            >
                                ← Return to Lab Overview & Claim Rewards
                            </a>
                        </section>
                    )}
            </div>
        </PageShell>
    );
};

export default Lab02Interaction;
