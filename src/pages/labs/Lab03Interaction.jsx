import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ethers } from "ethers";
import PageShell from "../../components/PageShell";

/**
 * Lab 03 — Message Signing & Ownership
 * Interaction scaffold (no cryptographic implementation yet)
 */

const initialLab03State = {
    message: {
        text: "",
        provided: false,
    },
    signing: {
        method: null, // "wallet" | "privateKey"
        signature: null,
        signed: false,
    },
    verification: {
        recoveredAddress: null,
        verified: false,
        incomingVerified: false,
    },
    ownership: {
        proven: false,
    },
    explanationUnlocked: false,
};

// 🔐 Static incoming signed message (Instructor → Student)
const INCOMING_MESSAGE = {
    senderName: "Dimitris Kogias",
    role: "Web3Edu Founder",
    sbtImage: "https://bronze-secondary-catfish-124.mypinata.cloud/ipfs/bafybeihnyrl6wrvqmt5moatkztryx32pux7l2f2lkcopoz53frije6ztui",
    address: "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E", // placeholder
    message:
        "👋 Hello from Web3Edu!\n\nYou have just verified a real cryptographic signature.\n\nThis message proves ownership, not identity.\n\nNow verify who sent it.",
    signedMessage:
        "👋 Hello from Web3Edu!\n\nYou have just verified a real cryptographic signature.\n\nThis message proves ownership, not identity.\n\nNow verify who sent it.",
    signature: "0x003b342acf2581a2c301380f1e3910d4f930f37abb7140d8c3e9429daa5e5e5e6dad49b6fa07035d36ddf1c8f55bd20d5dd0e27e3cdd302e04db15e87f7d6f3d1c",
    hasValidSignature: true,
};

const Lab03Interaction = () => {
    const [labState, setLabState] = useState(initialLab03State);

    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    // 🔁 Derived state
    useEffect(() => {
        const ownershipProven =
            labState.signing.signed &&
            labState.verification.verified;

        if (
            ownershipProven &&
            !labState.ownership.proven
        ) {
            setLabState((prev) => ({
                ...prev,
                ownership: { proven: true },
                explanationUnlocked: true,
            }));
        }
    }, [labState.signing.signed, labState.verification.verified]);

    // ─────────────────────────────
    // Handlers (logic to be filled later)
    // ─────────────────────────────

    const handleMessageChange = (e) => {
        const text = e.target.value;

        setLabState((prev) => ({
            ...prev,
            message: {
                text,
                provided: text.trim().length > 0,
            },
        }));
    };

    const handleSignMessage = async (method) => {
        if (method === "wallet") {
            if (!isConnected || !address) return;

            try {
                const signature = await signMessageAsync({
                    message: labState.message.text,
                });

                setLabState((prev) => ({
                    ...prev,
                    signing: {
                        method: "wallet",
                        signature,
                        signed: true,
                    },
                }));
            } catch (err) {
                console.error("Wallet signing failed", err);
            }
        }

        if (method === "privateKey") {
            // Educational placeholder (implemented later)
            setLabState((prev) => ({
                ...prev,
                signing: {
                    method: "privateKey",
                    signature: "0xPRIVATE_KEY_SIGNATURE_PLACEHOLDER",
                    signed: true,
                },
            }));
        }
    };

    const handleVerifySignature = () => {
        try {
            const recoveredAddress = ethers.verifyMessage(
                labState.message.text,
                labState.signing.signature
            );

            const verified =
                recoveredAddress &&
                address &&
                recoveredAddress.toLowerCase() === address.toLowerCase();

            setLabState((prev) => ({
                ...prev,
                verification: {
                    ...prev.verification,
                    recoveredAddress,
                    verified,
                },
            }));
        } catch (err) {
            console.error("Signature verification failed", err);
            setLabState((prev) => ({
                ...prev,
                verification: {
                    ...prev.verification,
                    recoveredAddress: null,
                    verified: false,
                },
            }));
        }
    };

    const handleVerifyIncomingMessage = () => {
        if (!INCOMING_MESSAGE.signature || !INCOMING_MESSAGE.hasValidSignature) {
            console.warn("Incoming message has no valid signature yet.");
            return;
        }
        try {
            const recoveredAddress = ethers.verifyMessage(
                INCOMING_MESSAGE.signedMessage,
                INCOMING_MESSAGE.signature
            );

            const verified =
                recoveredAddress.toLowerCase() ===
                INCOMING_MESSAGE.address.toLowerCase();
            setLabState((prev) => ({
                ...prev,
                verification: {
                    ...prev.verification,
                    incomingVerified: verified,
                },
                ownership: verified ? { proven: true } : prev.ownership,
            }));
        } catch (err) {
            console.error("Incoming message verification failed", err);
        }
    };

    // ─────────────────────────────
    // UI
    // ─────────────────────────────

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* Header */}
                <header>
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 03 — Message Signing & Ownership
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Prove ownership and intent using cryptographic signatures — without revealing private keys or sending transactions.
                    </p>
                </header>

                {/* Goal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                    p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🎯 Goal</h2>
                    <p>
                        Sign a message and verify the signature to prove ownership of a Web3 identity.
                    </p>
                </section>

                {/* Current State */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                    p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-4">🧭 Current State</h2>
                    <ul className="space-y-1 text-sm">
                        <li>Message provided: {labState.message.provided ? "✅" : "❌"}</li>
                        <li>Message signed: {labState.signing.signed ? "✅" : "❌"}</li>
                        <li>Signature verified: {labState.verification.verified ? "✅" : "❌"}</li>
                        <li>Ownership proven: {labState.ownership.proven ? "✅" : "❌"}</li>
                        <li>
                            Blockchain interaction:{" "}
                            <span className="font-semibold text-green-600 dark:text-green-400">
                                NOT NEEDED
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Actions */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                    p-5 bg-slate-50 dark:bg-slate-900/40 space-y-6">
                    <h2 className="font-semibold">🎛 Available Actions</h2>

                    {/* Action 1 — Provide Message */}
                    <div>
                        <h3 className="font-semibold mb-2">1️⃣ Provide a message</h3>
                        <textarea
                            value={labState.message.text}
                            onChange={handleMessageChange}
                            rows={3}
                            className="w-full max-w-md rounded-md border px-3 py-2 text-sm
                                       text-slate-900 dark:text-slate-100
                                       bg-white dark:bg-slate-800
                                       placeholder-slate-400
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Type any message you want to sign…"
                        />
                    </div>

                    {/* Action 2 — Sign Message */}
                    <div>
                        <h3 className="font-semibold mb-2">2️⃣ Sign the message</h3>
                        <div className="flex gap-3">
                            <button
                                disabled={!labState.message.provided || !isConnected}
                                onClick={() => handleSignMessage("wallet")}
                                className={`px-4 py-2 rounded-md font-semibold text-white ${labState.message.provided && isConnected
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Sign with Wallet
                            </button>
                            <button
                                disabled={!labState.message.provided}
                                onClick={() => handleSignMessage("privateKey")}
                                className={`px-4 py-2 rounded-md font-semibold text-white ${labState.message.provided
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Sign with Private Key
                            </button>
                        </div>
                        {!isConnected && (
                            <p className="text-xs text-slate-500 mt-1">
                                Connect your wallet to sign using Web3 identity.
                            </p>
                        )}
                        {/* Visual feedback for message signing */}
                        {labState.signing.signed && (
                            <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
                                <span aria-hidden="true">✓</span> Message signed
                            </p>
                        )}
                    </div>

                    {/* Action 3 — Verify Signature */}
                    <div>
                        <h3 className="font-semibold mb-2">3️⃣ Verify the signature</h3>
                        {!labState.verification.verified ? (
                            <button
                                disabled={!labState.signing.signed}
                                onClick={handleVerifySignature}
                                className={`px-4 py-2 rounded-md font-semibold text-white ${labState.signing.signed
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-indigo-300 cursor-not-allowed"
                                    }`}
                            >
                                Verify Signature
                            </button>
                        ) : (
                            <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                                <span aria-hidden="true">✓</span> Signature verified
                            </p>
                        )}
                    </div>
                </section>

                {/* Discovered Data */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                    p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-4">🔍 Discovered Data</h2>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {labState.signing.signed && (
                            <li>
                                <strong>Signature:</strong>
                                <div className="mt-1 p-2 rounded-md bg-slate-100 dark:bg-slate-800
                                                font-mono text-xs break-all">
                                    {labState.signing.signature}
                                </div>
                            </li>
                        )}
                        {labState.verification.verified && (
                            <li>
                                <strong>Recovered address:</strong>
                                <div className="mt-1 p-2 rounded-md bg-slate-100 dark:bg-slate-800
                                                font-mono text-xs break-all">
                                    {labState.verification.recoveredAddress}
                                </div>
                            </li>
                        )}
                    </ul>
                </section>

                {/* Section 4 — Incoming Signed Message */}
                {labState.verification.verified && (
                    <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                        p-5 bg-slate-50 dark:bg-slate-900/40 space-y-4">
                        <h2 className="font-semibold text-lg">📩 Incoming Signed Message</h2>

                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Someone sent you a signed message. Before trusting it, you must
                            verify who actually signed it.
                        </p>

                        <div className="rounded-md border border-slate-300 dark:border-slate-600
                                        bg-white dark:bg-slate-800 p-4 space-y-3">
                            <div>
                                <strong>Message:</strong>
                                <pre className="mt-1 text-sm whitespace-pre-wrap">
                                    {INCOMING_MESSAGE.message}
                                </pre>
                            </div>

                            <div>
                                <strong>Claimed sender address:</strong>
                                <div className="mt-1 font-mono text-xs break-all">
                                    {INCOMING_MESSAGE.address}
                                </div>
                            </div>

                            <div>
                                <strong>Signature:</strong>
                                <div className="mt-1 font-mono text-xs break-all">
                                    {INCOMING_MESSAGE.signature}
                                </div>
                            </div>
                        </div>

                        {/* Sender verification button or feedback */}
                        {!labState.verification.incomingVerified ? (
                            <>
                                <button
                                    onClick={handleVerifyIncomingMessage}
                                    disabled={!INCOMING_MESSAGE.hasValidSignature}
                                    className={`px-4 py-2 rounded-md font-semibold text-white ${INCOMING_MESSAGE.hasValidSignature
                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                        : "bg-indigo-300 cursor-not-allowed"
                                        }`}
                                >
                                    Verify Sender
                                </button>
                                {!INCOMING_MESSAGE.hasValidSignature && (
                                    <p className="text-xs text-slate-500 mt-2">
                                        This message is shown for demonstration. A real signature will be added next.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1 mt-2">
                                <span aria-hidden="true">✓</span> Sender successfully verified
                            </p>
                        )}

                        {/* Visual feedback for incoming message verification */}
                        {labState.verification.incomingVerified && (
                            <div className="mt-4 rounded-xl border border-green-300 dark:border-green-700
                                            bg-green-50 dark:bg-green-900/30 p-4">
                                <h3 className="font-semibold mb-2">🪪 Verified Web3 Identity</h3>

                                <p className="text-sm mb-3">
                                    This message was signed by a verified Web3Edu founder identity.
                                </p>

                                <div className="mt-3 rounded-lg border border-indigo-300 dark:border-indigo-700
                                                bg-indigo-50 dark:bg-indigo-900/40 p-4">
                                    {INCOMING_MESSAGE.sbtImage && (
                                        <div className="mb-3 flex justify-center">
                                            <img
                                                src={INCOMING_MESSAGE.sbtImage}
                                                alt="Sender SBT"
                                                className="w-24 h-24 rounded-full border border-indigo-400 dark:border-indigo-600
                                                           shadow-md bg-white dark:bg-slate-800"
                                            />
                                        </div>
                                    )}
                                    <p className="text-sm font-semibold">🎓 Web3Edu Founder SBT</p>
                                    <ul className="mt-2 text-sm space-y-1">
                                        <li><strong>Name:</strong> Dimitris Kogias</li>
                                        <li><strong>Role:</strong> Founder · Educator</li>
                                        <li><strong>Credential:</strong> Web3Edu Founder</li>
                                        <li><strong>Type:</strong> Soulbound Token (non-transferable)</li>
                                    </ul>
                                </div>

                                <div className="rounded-lg border border-slate-300 dark:border-slate-600
                                                bg-white dark:bg-slate-800 p-4 mt-3">
                                    <p className="font-semibold">{INCOMING_MESSAGE.senderName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {INCOMING_MESSAGE.role}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Identity anchored via Soulbound Token (SBT)
                                    </p>
                                </div>

                                <p className="mt-3 text-sm italic text-slate-600 dark:text-slate-400">
                                    Signature → Address → Identity
                                </p>
                                {/* Visual feedback for sender verification */}
                                <div className="mt-3 text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                                    <span aria-hidden="true">✓</span> Sender verified
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Explanation */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-indigo-200 dark:border-indigo-700
                                        p-5 bg-indigo-50 dark:bg-indigo-900/30">
                        <h2 className="font-semibold mb-3">🧠 Explanation</h2>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Signing proves ownership and intent.</li>
                            <li>The private key is never revealed.</li>
                            <li>Anyone can verify a signature.</li>
                            <li>No transaction or blockchain interaction is required.</li>
                            <li>This mechanism underpins Web3 authentication and DAO voting.</li>
                        </ul>
                    </section>
                )}

                {/* Challenge */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-slate-200 dark:border-slate-700
                                        p-5 bg-slate-50 dark:bg-slate-900/40">
                        <h2 className="font-semibold mb-2">🏁 Challenge</h2>
                        <p className="text-sm">
                            Can you prove to a friend that you own a Web3 address without sending them ETH or revealing your private key?
                        </p>
                    </section>
                )}

                {/* Completion Section */}
                {
                    (labState.ownership.proven === true && labState.verification.incomingVerified === true) && (
                        <section className="rounded-xl border border-green-300 dark:border-green-700
                                        bg-green-50 dark:bg-green-900/30 p-6 mt-6 flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">🎉 Lab Completed</h2>
                            <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
                                You have completed Lab 03 — Message Signing &amp; Ownership.
                            </p>
                            <p className="mb-4 text-slate-800 dark:text-slate-200 text-sm max-w-lg">
                                You have successfully verified your ownership of a Web3 address and trusted a signed message from another party — all without any blockchain transaction or revealing your private key. This is the foundation of Web3 authentication!
                            </p>
                            <a
                                href="/#/labs/lab03"
                                className="inline-block px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                            >
                                ← Return to Lab Overview &amp; Claim Rewards
                            </a>
                        </section>
                    )
                }

            </div>
        </PageShell>
    );
};

export default Lab03Interaction;

