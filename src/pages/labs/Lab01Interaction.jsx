import { useState } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const Lab01Interaction = () => {
    // Helper: detect network from wallet (window.ethereum)
    const detectNetworkFromWallet = async () => {
        if (!window.ethereum) return null;

        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (!accounts || accounts.length === 0) {
                // Wallet exists but is not connected
                return null;
            }

            const chainId = await window.ethereum.request({ method: "eth_chainId" });

            if (chainId === "0x67932") return "Besu Edu-Net"; // 424242
            if (chainId === "0x1") return "Ethereum Mainnet";

            return `Unknown network (${chainId})`;
        } catch {
            return null;
        }
    };
    // State for lab progress aligned with corrected Lab01 model
    const [labState, setLabState] = useState({
        networkDetected: false,
        activeNetwork: null,
        previousNetwork: null,
        addressProvided: false,
        addressValid: false,
        addressInspected: false,
        keyRelationshipRevealed: false,
        identityComparedAcrossNetworks: false,
        identityWithoutAccountsAcknowledged: false,
        discoveredData: [],
        confirmedAddress: null,
    });
    const [lastAction, setLastAction] = useState(null);

    // Handler: detect network (now uses wallet, with improved logic)
    const handleDetectNetwork = async () => {
        const detectedNetwork = await detectNetworkFromWallet();

        if (!detectedNetwork) {
            setLabState((s) => ({
                ...s,
                networkDetected: false,
                discoveredData: [
                    ...s.discoveredData,
                    "No wallet connected — network context cannot be detected.",
                ],
            }));
            setLastAction("detect-network-failed");
            return;
        }

        setLabState((s) => ({
            ...s,
            networkDetected: true,
            activeNetwork: detectedNetwork,
            discoveredData: [
                ...s.discoveredData,
                `Detected active network context: ${detectedNetwork}`,
            ],
        }));
        setLastAction("detect-network");
    };

    // Handler: confirm address
    const handleConfirmAddress = (address) => {
        const isValid = address.startsWith("0x") && address.length === 42;
        setLabState((s) => ({
            ...s,
            addressProvided: true,
            addressValid: isValid,
            confirmedAddress: isValid ? address : s.confirmedAddress,
            discoveredData: [
                ...s.discoveredData,
                `Public address observed (${isValid ? "valid checksum format" : "invalid format"}): ${address}`,
            ],
        }));
        setLastAction("confirm-address");
    };

    // Handler: inspect address
    const handleInspectAddress = () => {
        setLabState((s) => ({
            ...s,
            addressInspected: true,
            discoveredData: [
                ...s.discoveredData,
                "Address structure inspected (prefix, length, checksum encoding)",
            ],
        }));
        setLastAction("inspect-address");
    };

    // Handler: reveal key relationship
    const handleRevealKeyRelationship = () => {
        setLabState((s) => ({
            ...s,
            keyRelationshipRevealed: true,
            discoveredData: [
                ...s.discoveredData,
                "Observed conceptual relationship: private key → public key → address",
            ],
        }));
        setLastAction("reveal-keys");
    };

    // Handler: re-detect network (for Action 5, now real detection)
    const handleDetectNetworkAgain = async () => {
        const prev = labState.activeNetwork;
        const detectedNetwork = await detectNetworkFromWallet();

        if (!detectedNetwork) {
            setLastAction("detect-network-same");
            setLabState((s) => ({
                ...s,
                discoveredData: [
                    ...s.discoveredData,
                    "Unable to detect network from wallet.",
                ],
            }));
            return;
        }

        if (prev === detectedNetwork) {
            setLastAction("detect-network-same");
            setLabState((s) => ({
                ...s,
                previousNetwork: prev,
                activeNetwork: detectedNetwork,
                discoveredData: [
                    ...s.discoveredData,
                    "Rechecked network context — wallet is still connected to the same network",
                ],
            }));
            return;
        }

        // Real network change
        setLastAction("detect-network-changed");
        setLabState((s) => ({
            ...s,
            previousNetwork: prev,
            activeNetwork: detectedNetwork,
            identityComparedAcrossNetworks: true,
            discoveredData: [
                ...s.discoveredData,
                `Same address observed across networks: ${prev} → ${detectedNetwork}`,
            ],
        }));
    };

    // Handler: acknowledge identity without accounts
    const handleAcknowledgeIdentityWithoutAccounts = () => {
        setLabState((s) => ({
            ...s,
            identityWithoutAccountsAcknowledged: true,
            discoveredData: [
                ...s.discoveredData,
                "Confirmed: Web3 identity exists without accounts, registration, or transactions",
            ],
        }));
        setLastAction("no-accounts");
    };

    // Handler: reset lab
    const handleResetLab = () => {
        setLabState({
            networkDetected: false,
            activeNetwork: null,
            previousNetwork: null,
            addressProvided: false,
            addressValid: false,
            addressInspected: false,
            keyRelationshipRevealed: false,
            identityComparedAcrossNetworks: false,
            identityWithoutAccountsAcknowledged: false,
            discoveredData: [],
            confirmedAddress: null,
        });
        setLastAction(null);
    };

    // Derived booleans for button enabling/disabling
    const canDetectNetwork = !labState.networkDetected;
    const canConfirmAddress = labState.networkDetected && !labState.addressProvided;
    const canInspectAddress = labState.addressProvided && !labState.addressInspected;
    const canRevealKeyRelationship = labState.addressInspected && !labState.keyRelationshipRevealed;
    // Action 5: Enable "Detect Network Again" after first detection and after keys revealed
    const canDetectNetworkAgain = labState.keyRelationshipRevealed && labState.networkDetected;
    const canAcknowledgeIdentityWithoutAccounts =
        labState.keyRelationshipRevealed && !labState.identityWithoutAccountsAcknowledged;

    const explanationUnlocked =
        labState.networkDetected &&
        labState.addressProvided &&
        labState.addressValid &&
        labState.addressInspected &&
        labState.keyRelationshipRevealed &&
        labState.identityWithoutAccountsAcknowledged;

    const canResetLab =
        labState.networkDetected ||
        labState.activeNetwork !== null ||
        labState.addressProvided ||
        labState.addressValid ||
        labState.addressInspected ||
        labState.keyRelationshipRevealed ||
        labState.identityComparedAcrossNetworks ||
        labState.identityWithoutAccountsAcknowledged ||
        (labState.discoveredData && labState.discoveredData.length > 0);

    return (
        <PageShell title="Lab 01 — Wallets & Web3 Identity">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 01 — Wallets & Web3 Identity
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Web3Edu can start with lighter onboarding (for example social login), but wallet-based public identity becomes important for wallet-native actions such as signing and claiming rewards. This lab introduces how that identity works: a wallet-managed address that exists before transactions, usernames, or smart contracts.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>
                            Network detected: {labState.networkDetected ? "✅" : "❌"}
                        </li>
                        <li>
                            Address provided: {labState.addressProvided ? "✅" : "❌"}
                        </li>
                        <li>
                            Address valid: {labState.addressValid ? "✅" : "❌"}
                        </li>
                        <li>
                            Address inspected: {labState.addressInspected ? "✅" : "❌"}
                        </li>
                        <li>
                            Key relationship understood: {labState.keyRelationshipRevealed ? "✅" : "❌"}
                        </li>
                        <li>
                            Optional — compared identity across networks:{" "}
                            {labState.identityComparedAcrossNetworks ? "✅" : "— (not required)"}
                        </li>
                        <li>
                            Identity without accounts acknowledged: {labState.identityWithoutAccountsAcknowledged ? "✅" : "❌"}
                        </li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">

                        {/* Wallet connection info hint */}
                        <div className="mb-2">
                            <div className="text-xs italic rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-2 mb-2">
                                ℹ️ You may already use Web3Edu with social login; this lab still focuses on the wallet side. For the steps below, connect a browser wallet (e.g. MetaMask) to this page so we can read network context and your public address.
                            </div>
                        </div>
                        {/* Action 1 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleDetectNetwork}
                                disabled={!canDetectNetwork}
                                className={`px-4 py-2 rounded-md bg-indigo-500 text-white ${!canDetectNetwork
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-indigo-600"
                                    }`}
                            >
                                Detect Network
                            </button>
                            {lastAction === "detect-network" && labState.activeNetwork && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Network detected: {labState.activeNetwork}
                                </div>
                            )}
                            {lastAction === "detect-network-failed" && (
                                <div className="mt-2 text-xs rounded bg-yellow-50 dark:bg-slate-800 text-yellow-900 dark:text-yellow-200 px-3 py-1">
                                    ⚠️ Please connect your wallet before detecting the network.
                                </div>
                            )}
                        </div>

                        {/* Action 2 */}
                        <div className="rounded-xl border p-5">
                            <label className="block text-sm font-medium mb-2">
                                Enter public address
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">
                                Copy your public address from your connected wallet (starts with 0x…).
                            </p>
                            <input
                                type="text"
                                placeholder="e.g. 0xABC123456789abcdef123456789abcdef12345678"
                                className={`w-full rounded-md border border-slate-300 dark:border-slate-600
                                           bg-white dark:bg-slate-900 px-3 py-2 mb-3 ${!canConfirmAddress ? "opacity-60 cursor-not-allowed" : ""}`}
                                disabled={!canConfirmAddress}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && canConfirmAddress) {
                                        handleConfirmAddress(e.target.value.trim());
                                        e.target.value = "";
                                    }
                                }}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                Press Enter to confirm address.
                            </p>
                            {lastAction === "confirm-address" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Public EVM-compatible address confirmed
                                </div>
                            )}
                        </div>

                        {/* Action 3 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleInspectAddress}
                                disabled={!canInspectAddress}
                                className={`px-4 py-2 rounded-md ${canInspectAddress
                                    ? "bg-slate-700 text-white hover:bg-slate-800"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Inspect Address
                            </button>
                            {lastAction === "inspect-address" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Address structure inspected (prefix, length, checksum)
                                </div>
                            )}
                            {/* Visual address inspection aid */}
                            {labState.addressInspected === true && labState.confirmedAddress && (
                                <div className="mt-4">
                                    <div className="font-mono text-sm bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded flex flex-col items-start">
                                        <span>
                                            <span className="font-bold text-blue-700 dark:text-blue-400" title="hex prefix">
                                                {labState.confirmedAddress.slice(0, 2)}
                                            </span>
                                            <span className="mx-1" />
                                            <span className="text-black dark:text-white" title="address body">
                                                {labState.confirmedAddress.slice(2)}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                        <div>
                                            <span className="font-mono font-bold text-blue-700 dark:text-blue-400">0x</span>
                                            <span className="ml-1">→ hex prefix</span>
                                        </div>
                                        <div>
                                            <span className="font-mono">40 hex characters</span>
                                            <span className="ml-1">→ address body</span>
                                        </div>
                                        <div>
                                            <span className="font-mono">Mixed case</span>
                                            <span className="ml-1">→ checksum encoding</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                                        <strong>Why mixed case?</strong><br />
                                        Ethereum-compatible addresses use <em>checksum encoding</em> (EIP‑55).
                                        The specific pattern of upper‑ and lower‑case letters helps wallets detect typing mistakes.
                                        If a character or its casing is changed incorrectly, the address becomes invalid.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action 4 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleRevealKeyRelationship}
                                disabled={!canRevealKeyRelationship}
                                className={`px-4 py-2 rounded-md ${canRevealKeyRelationship
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Show Key–Address Relationship
                            </button>
                            <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                                Understand how keys relate to your address — without exposing any keys.
                            </div>
                            {labState.keyRelationshipRevealed === true && (
                                <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3">
                                    <div className="font-mono text-sm flex flex-col items-center space-y-2">
                                        <div>
                                            [ <span>Private Key</span> ] <span className="mx-1">→</span> [ <span>Public Key</span> ] <span className="mx-1">→</span> [ <span>Address</span> ]
                                        </div>
                                        <div className="flex flex-row justify-center space-x-8 mt-2 text-xs">
                                            <div className="flex flex-col items-center">
                                                <span>🔒</span>
                                                <span className="text-slate-500 dark:text-slate-400">managed by wallet</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span>🔒</span>
                                                <span className="text-slate-500 dark:text-slate-400">managed by wallet</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span>👁️</span>
                                                <span className="text-slate-500 dark:text-slate-400">your public identity</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="mt-4 text-sm text-slate-700 dark:text-slate-200 list-disc ml-6 space-y-1">
                                        <li>Keys are generated and stored by the wallet</li>
                                        <li>The address is the only public identifier</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Action 5 — optional network comparison */}
                        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-5 bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-[0.65rem] font-semibold uppercase tracking-wide rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-0.5">
                                    Optional extension
                                </span>
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Compare your identity across networks
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 max-w-3xl">
                                If you like, try switching networks in your wallet and detecting again. Your address stays the same while the network context changes—useful to see, but skipping this does not block lab completion.
                            </p>
                            {/* MetaMask network switching guidance (optional) */}
                            {labState.networkDetected === true && (
                                <div className="mb-3 px-4 py-3 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/60">
                                    <div className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                                        If you want to try it: switching networks in MetaMask
                                    </div>
                                    <ol className="list-decimal ml-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>Open MetaMask</li>
                                        <li>Use the network menu at the bottom of MetaMask (in recent versions)</li>
                                        <li>
                                            Pick, for example:<br />
                                            <span className="ml-3">• Besu Edu-Net<br />• or Ethereum Mainnet</span>
                                        </li>
                                        <li>Come back and tap <span className="font-semibold">Detect Network Again</span> whenever you are ready—no rush</li>
                                    </ol>
                                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                        This only changes which chain MetaMask is pointing at. Your address and keys do not change; you are not signing up for a new identity.
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleDetectNetworkAgain}
                                disabled={!canDetectNetworkAgain}
                                className={`mt-2 px-4 py-2 rounded-md bg-indigo-500 text-white ${!canDetectNetworkAgain
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-indigo-600"
                                    }`}
                            >
                                Detect Network Again
                            </button>
                            {lastAction === "detect-network-changed" && (
                                <div className="mt-2 text-xs rounded bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300 px-3 py-1">
                                    ✔ Network context changed
                                </div>
                            )}
                            {lastAction === "detect-network-same" && (
                                <div className="mt-2 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1">
                                    ℹ️ Same network as before—that is fine. If you want the comparison view, switch networks in your wallet when convenient, then use Detect Network Again.
                                </div>
                            )}
                            {/* Comparison block: only when identityComparedAcrossNetworks === true AND previousNetwork !== activeNetwork */}
                            {labState.identityComparedAcrossNetworks === true &&
                                labState.previousNetwork !== null &&
                                labState.previousNetwork !== labState.activeNetwork && (
                                    <div className="mt-6 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700">
                                        <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                                            Network Comparison
                                        </div>
                                        <div className="text-sm mb-2">
                                            <span className="mr-2">Address:</span>
                                            <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                                {labState.confirmedAddress
                                                    ? `${labState.confirmedAddress.slice(0, 6)}...${labState.confirmedAddress.slice(-4)}`
                                                    : ""}
                                            </span>
                                        </div>
                                        <div className="text-sm flex flex-col gap-1 mb-3">
                                            <span>Previous network: <span className="font-semibold">{labState.previousNetwork}</span></span>
                                            <span>Current network: <span className="font-semibold">{labState.activeNetwork}</span></span>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div>
                                                <div className="font-semibold mb-1">What changed:</div>
                                                <ul className="list-disc ml-5 text-green-700 dark:text-green-300 text-sm space-y-1">
                                                    <li>✔ Network context</li>
                                                    <li>✔ Trust model</li>
                                                    <li>✔ Available applications</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="font-semibold mb-1">What did NOT change:</div>
                                                <ul className="list-disc ml-5 text-green-700 dark:text-green-300 text-sm space-y-1">
                                                    <li>✔ Your address</li>
                                                    <li>✔ Your wallet</li>
                                                    <li>✔ Your keys</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Action 6 */}
                        <div className="rounded-xl border p-5">
                            <button
                                onClick={handleAcknowledgeIdentityWithoutAccounts}
                                disabled={!canAcknowledgeIdentityWithoutAccounts}
                                className={`px-4 py-2 rounded-md ${canAcknowledgeIdentityWithoutAccounts
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                Observe Identity Without Accounts
                            </button>
                            <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                                Review what was not required to establish wallet-native Web3 identity—distinct from app login, and what you rely on for on-chain steps like rewards.
                            </div>
                            {labState.identityWithoutAccountsAcknowledged === true && (
                                <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 px-4 py-3">
                                    <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                                        You completed this lab without:
                                    </div>
                                    <ul className="list-none pl-0 space-y-1 text-slate-700 dark:text-slate-200 text-sm">
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Username</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Password</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Email</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Registration</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Transactions</li>
                                        <li><span className="text-green-600 dark:text-green-400 mr-2">✔</span>Gas fees</li>
                                    </ul>
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                        Your identity exists independently of centralized account systems.
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-lg font-semibold mb-4">🔍 Discovered Data</h2>
                    {labState.discoveredData && labState.discoveredData.length > 0 ? (
                        <ul className="text-slate-700 dark:text-slate-200 list-disc ml-5 space-y-1">
                            {labState.discoveredData.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            Data will appear here as you interact with the lab.
                        </p>
                    )}
                </section>

                {/* 🧠 Explanation */}
                <section
                    className={`rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40 ${explanationUnlocked ? "" : "opacity-60"
                        }`}
                >
                    <h2 className="text-lg font-semibold mb-2">🧠 Explanation</h2>
                    {explanationUnlocked ? (
                        <p className="text-slate-700 dark:text-slate-200">
                            A wallet-native Web3 identity is represented by a public address managed by a wallet.<br />
                            The wallet securely manages cryptographic keys on your behalf, while the address serves as your visible identity on a given network.<br />
                            This identity exists before any transaction, smart contract interaction, or account registration.<br />
                            Easier onboarding (such as social login) can get you into Web3Edu, but understanding this address-based layer helps when you take wallet-native actions—for example signing or claiming rewards on-chain.<br />
                            The same address can appear across multiple networks; its meaning and trust follow the network context, not usernames or centralized accounts.
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            Finish the core path through “Observe Identity Without Accounts” to unlock the explanation. The optional network comparison is not required.
                        </p>
                    )}
                </section>

                {/* 🎁 Completion & Return */}
                {explanationUnlocked && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            🎉 Lab Completed
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 mb-2">
                            You have completed <strong>Lab 01 — Wallets & Web3 Identity</strong>.
                            Claim your completion below.
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                            Claiming records progress with your connected wallet identity—another reason the address-based model you practiced here matters alongside lighter login options.
                        </p>
                        <LabCompletionClaim
                            labId="lab01"
                            language="en"
                            backHref="/#/labs/wallets-keys"
                            backLabel="⬅ Return to Lab Overview"
                        />
                    </section>
                )}

                {/* 🔁 Utilities */}
                <section className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={handleResetLab}
                        disabled={!canResetLab}
                        className={`text-sm ${canResetLab
                            ? "text-slate-700 dark:text-slate-200 hover:underline"
                            : "text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        🔁 Reset Lab
                    </button>

                    <a
                        href="https://github.com/dimikog/web3edu-labs/tree/main/lab-01-wallets-identity"
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                    >
                        📚 View Details (GitHub)
                    </a>
                </section>

            </div>
        </PageShell>
    );
};

export default Lab01Interaction;
