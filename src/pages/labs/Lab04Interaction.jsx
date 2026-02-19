import { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";
import "../../styles/animations.css";

const initialLab04State = {
    currentStep: 1,
    lastAction: null,

    preStateObserved: false,
    preState: {
        balance: null,
        nonce: null,
    },

    wallet: {
        connected: false,
        address: null,
        network: null,
        isCorrectNetwork: false,
    },

    txExplored: false,
    txFields: {
        from: "",
        to: "",
        value: "",
        gasLimit: "",
        gasPrice: "",
        nonce: "",
    },

    gasConceptUnderstood: false,

    postStateObserved: false,
    postState: {
        balance: null,
        nonce: null,
    },

    // Faucet/real tx step additions
    txSent: false,
    txHash: "",
    postTxChecked: false,

    discoveredData: [],
    explanationUnlocked: false,
};

const EXAMPLE_TX_HASH = "0x01c6e6afeb02082edb538dc24f2157090381d175bef6354bbf8c54c8b349fdfe";
const EXAMPLE_TX_DETAILS = {
    from: "0x7e81C3B018e6c471eeFf5dEE7483bc32bF8635C4",
    to: "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E",
    value: "1 ETH",
    gasPrice: "1 Gwei",
    gasLimit: "21,000",
    gasUsed: "21,000 (100%)",
    nonce: "99",
    block: "3121417",
    status: "Success",
};
const BLOCK_EXPLORER_TX_URL = "https://blockexplorer.dimikog.org/tx/" + EXAMPLE_TX_HASH;

const Lab04Interaction = () => {
    const [labState, setLabState] = useState(initialLab04State);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleConnectAndFetchState = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            // Supported Besu Edu-Net chain IDs
            const BESU_CHAIN_IDS = [424242];

            const networkName =
                network.name && network.name !== "unknown"
                    ? network.name
                    : `Besu Edu-Net (Chain ID ${chainId})`;
            const isBesuEduNet = BESU_CHAIN_IDS.includes(chainId);

            const balanceWei = await provider.getBalance(address);
            const nonce = await provider.getTransactionCount(address);

            setLabState((s) => ({
                ...s,
                preStateObserved: true,
                wallet: {
                    connected: true,
                    address,
                    network: networkName,
                    isCorrectNetwork: isBesuEduNet,
                },
                preState: {
                    balance: `${formatEther(balanceWei)} ETH`,
                    nonce: nonce.toString(),
                },
                lastAction: "Live pre-transaction state fetched from wallet",
                discoveredData: [
                    ...s.discoveredData,
                    "Wallets expose live on-chain state (balance and nonce) without creating a transaction.",
                ],
            }));
        } catch (err) {
            console.error("Wallet connection failed", err);
            alert("Failed to connect wallet or fetch state");
        }
    };

    // Faucet/real tx post-transaction check handler
    const handlePostTransactionCheck = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const balanceWei = await provider.getBalance(address);
            const newBalance = parseFloat(formatEther(balanceWei));

            const prevBalance = parseFloat(
                (labState.preState.balance || "0").replace("ETH", "").trim()
            );

            if (newBalance <= prevBalance) {
                alert("Balance has not increased. Please complete the faucet transaction first.");
                return;
            }

            setLabState((s) => ({
                ...s,
                postTxChecked: true,
                postStateObserved: true,
                postState: {
                    balance: `${newBalance} ETH`,
                    nonce: s.preState.nonce, // unchanged
                },
                lastAction: "Balance increase verified after faucet transaction",
                discoveredData: [
                    ...s.discoveredData,
                    "Receiving funds increases balance but does not change nonce.",
                ],
            }));
        } catch (err) {
            console.error("Post-tx check failed", err);
            alert("Failed to re-check balance and nonce");
        }
    };

    const handleResetLab = () => {
        setLabState({ ...initialLab04State, lastAction: null });
    };

    const canResetLab =
        labState.preStateObserved ||
        labState.txExplored ||
        labState.gasConceptUnderstood ||
        labState.postStateObserved ||
        labState.discoveredData.length > 0;

    return (
        <PageShell>
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* 🎯 Goal */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Lab 04 — Transactions & Gas
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Explore how blockchain transactions change on-chain state
                        and why gas is required for execution.
                    </p>
                </section>

                {/* 🧭 Current State */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-2">🧭 Current State</h2>
                    {labState.lastAction && (
                        <div
                            className="mb-3 p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold animate-fadeIn"
                            key={labState.lastAction}
                        >
                            ✅ {labState.lastAction}
                        </div>
                    )}
                    <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                        <li>
                            Pre-transaction state observed:
                            {labState.preStateObserved ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Transaction structure explored:
                            {labState.txExplored ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Gas concept understood:
                            {labState.gasConceptUnderstood ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Post-transaction state observed:
                            {labState.postStateObserved ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                        <li>
                            Real blockchain interaction completed:
                            {labState.postTxChecked ? (
                                <span className="inline-block ml-1 text-green-600 animate-bounce">✓</span>
                            ) : (
                                "❌"
                            )}
                        </li>
                    </ul>
                </section>

                {/* 🎛 Available Actions */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    <div className="space-y-6">

                        {/* Action 1 — Observe pre-state */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                1️⃣ Observe Pre-Transaction State (Before Anything Happens)
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Even before you send a transaction, your wallet already has <strong>on‑chain state</strong>.
                                This state exists independently of any action you take now.
                            </p>

                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-4 space-y-1">
                                <li><strong>Balance</strong>: how much ETH the account owns</li>
                                <li><strong>Nonce</strong>: how many transactions the account has already sent</li>
                            </ul>

                            <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                                text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                                🔎 At this stage, <strong>no transaction exists yet</strong>.
                                You are only observing existing blockchain state.
                            </div>

                            <button
                                onClick={handleConnectAndFetchState}
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                🔌 Connect Wallet & Observe State
                            </button>

                            {labState.preStateObserved && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="text-sm font-semibold mb-2">✅ Observed Pre‑Transaction State</p>
                                    {/* Network warning */}
                                    {!labState.wallet.isCorrectNetwork && (
                                        <div className="mb-3 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                                            text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                            ⚠️ Please switch to <strong>Besu Edu‑Net</strong> to continue.
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Balance</div>
                                            <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                {labState.preState.balance}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Nonce</div>
                                            <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                {labState.preState.nonce}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 break-all">
                                        Wallet address: <span className="font-mono">{labState.wallet.address}</span><br />
                                        Network: <strong>{labState.wallet.network}</strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action 2 — Explore transaction */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                2️⃣ Explore Transaction Structure
                            </h3>
                            <div className="mb-6 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                                        Example Transaction
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                                        Value Transfer
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">From</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            0x7e81C3B018e6c471eeFf5dEE7483bc32bF8635C4
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-indigo-600 dark:text-indigo-300 text-lg animate-bounce">
                                        ↓
                                    </div>

                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">To</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                        Amount Sent
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold">
                                        1 ETH <span className="opacity-80">(EDU‑D)</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                This example transaction transfers <strong>1 EDU‑D</strong> (displayed as ETH in the block explorer)
                                from one address to another. It represents a simple value transfer with no smart contract execution.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Note: The explorer displays ETH, but the asset is EDU-D on Besu Edu-Net.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                A transaction is a signed message containing specific fields.
                            </p>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        txExplored: true,
                                        lastAction: "Real transaction structure examined",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Transactions are signed data structures with specific fields that define value transfer, execution cost, and ordering.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Inspect real transaction
                            </button>

                            {labState.txExplored && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                                    <p className="text-sm font-semibold">🔍 Real Transaction Example</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div><strong>Status:</strong> {EXAMPLE_TX_DETAILS.status}</div>
                                        <div><strong>Block:</strong> {EXAMPLE_TX_DETAILS.block}</div>
                                        <div><strong>From:</strong> <span className="font-mono break-all">{EXAMPLE_TX_DETAILS.from}</span></div>
                                        <div><strong>To:</strong> <span className="font-mono break-all">{EXAMPLE_TX_DETAILS.to}</span></div>
                                        <div><strong>Value:</strong> {EXAMPLE_TX_DETAILS.value}</div>
                                        <div><strong>Nonce:</strong> {EXAMPLE_TX_DETAILS.nonce}</div>
                                        <div><strong>Gas Limit:</strong> {EXAMPLE_TX_DETAILS.gasLimit}</div>
                                        <div><strong>Gas Used:</strong> {EXAMPLE_TX_DETAILS.gasUsed}</div>
                                        <div><strong>Gas Price:</strong> {EXAMPLE_TX_DETAILS.gasPrice}</div>
                                    </div>

                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-4">
                                        Transaction hash:
                                        <div className="font-mono break-all mt-1">{EXAMPLE_TX_HASH}</div>
                                    </div>

                                    <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">from</span>
                                            : sender address (who paid gas and initiated state change)
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">to</span>
                                            : receiver address or contract
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">value</span>
                                            : ETH transferred
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">nonce</span>
                                            : sender’s transaction counter
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasLimit</span>
                                            : maximum computation allowed
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasUsed</span>
                                            : computation actually consumed
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">gasPrice</span>
                                            : price per gas unit
                                        </li>
                                        <li>
                                            <span className="inline-block px-2 py-0.5 mr-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">status</span>
                                            : success or revert
                                        </li>
                                    </ul>
                                    <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                                        👀 Find each of these fields in the block explorer and confirm they match the values above.
                                    </div>
                                    <div className="mt-2 text-xs text-indigo-700 dark:text-indigo-300">
                                        <span className="font-semibold">Tip:</span> Each <span className="inline-block px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold align-middle">field</span> is crucial—hover or click in block explorers to see real values.
                                    </div>

                                    <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-sm text-indigo-800 dark:text-indigo-300">
                                        Every field you see above is part of the signed transaction payload.
                                        Changing any field would invalidate the signature.
                                    </div>

                                    <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-sm text-yellow-800 dark:text-yellow-300">
                                        🔎 Open the explorer and manually verify that each value above matches the on‑chain transaction.
                                    </div>

                                    <a
                                        href={BLOCK_EXPLORER_TX_URL}
                                        target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        🔗 View this transaction in the Block Explorer
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Action 3 — Gas */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                3️⃣ Understand Gas & Execution
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Gas limits computation and prevents abuse of the network.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                From the transaction in the previous step we can see that:
                            </p>

                            {/* Real transaction gas summary */}
                            <div className="mb-4 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-xs text-slate-700 dark:text-indigo-200">
                                <div className="font-semibold mb-1">Gas & Execution in Real Transaction:</div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    <div>
                                        <span className="font-semibold">Gas Limit:</span> {EXAMPLE_TX_DETAILS.gasLimit}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gas Used:</span> {EXAMPLE_TX_DETAILS.gasUsed}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gas Price:</span> {EXAMPLE_TX_DETAILS.gasPrice}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Status:</span> {EXAMPLE_TX_DETAILS.status}
                                    </div>
                                </div>
                            </div>

                            {/* Unit conversion: Wei / Gwei / ETH */}
                            <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
                                <p className="text-sm font-semibold mb-2">
                                    📏 Gas Units — Wei, Gwei & ETH
                                </p>

                                <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                                    <li><strong>1 ETH</strong> = 1,000,000,000 Gwei</li>
                                    <li><strong>1 Gwei</strong> = 0.000000001 ETH</li>
                                    <li><strong>Gas price</strong> is always expressed in Gwei</li>
                                </ul>

                                <div className="mt-3 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30
                                                font-mono font-bold text-base text-indigo-900 dark:text-indigo-200">
                                    21,000 × 1 Gwei = 21,000 × 0.000000001 ETH = 0.000021 ETH
                                </div>

                                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                    This is the <strong>exact fee</strong> paid by the sender for the transaction shown above.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        gasConceptUnderstood: true,
                                        lastAction: "Gas concept confirmed",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "Gas is required to pay for computation; gas limit sets the maximum allowed work, and gas price determines the fee paid to miners. If gas runs out, the transaction fails but fees are still spent.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Confirm gas understanding
                            </button>

                            {labState.gasConceptUnderstood && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                    <p className="text-sm font-semibold mb-2">✅ Gas Explained (with real values)</p>
                                    <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>
                                            Gas limit was <strong>{EXAMPLE_TX_DETAILS.gasLimit}</strong> — exactly enough for a simple ETH transfer.
                                        </li>
                                        <li>
                                            Gas used was <strong>{EXAMPLE_TX_DETAILS.gasUsed}</strong>, meaning all allowed computation was consumed.
                                        </li>
                                        <li>
                                            Gas price was <strong>{EXAMPLE_TX_DETAILS.gasPrice}</strong>, determining the transaction fee.
                                        </li>
                                        <li>
                                            Transaction status: <strong>{EXAMPLE_TX_DETAILS.status}</strong>.
                                        </li>
                                    </ul>
                                    <div className="mt-3 text-lg font-bold text-indigo-900 dark:text-indigo-200">
                                        The fee paid = gasUsed × gasPrice
                                    </div>
                                    <div className="mt-1 text-xl font-mono font-bold">
                                        21,000 × 1 Gwei = 0.000021 ETH
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action 4 — Post-state */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                4️⃣ Observe Post-Transaction State
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                After execution of a sending transaction, balances and nonces change permanently.
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                This post-transaction state refers to a transaction where the account <strong>SENDS 1 EDU-D</strong>.
                                It does <strong>not</strong> refer to the faucet transaction where funds are received.
                            </p>
                            <div className="mb-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                                ⚠️ Important: Step 4 analyzes a <strong>sending</strong> transaction (like the one in Step 2).
                                It does <strong>not</strong> describe the faucet transaction in Step 5.
                            </div>

                            {/* Transaction Visualization (premium box, before table and button) */}
                            <div className="mb-6 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                                        Sending Transaction (Illustrative)
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                                        State‑Changing
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">From</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            Your address (sender)
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-indigo-600 dark:text-indigo-300 text-lg">
                                        ↓
                                    </div>

                                    <div className="text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-semibold">To</span>
                                        <div className="mt-1 font-mono text-xs break-all bg-white/70 dark:bg-slate-900/50 rounded-md px-2 py-1">
                                            Another address (receiver)
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                        Amount Sent
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold">
                                        1 ETH <span className="opacity-80">(EDU‑D)</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setLabState((s) => ({
                                        ...s,
                                        postStateObserved: true,
                                        explanationUnlocked: true,
                                        lastAction: "Post-transaction state observed",
                                        discoveredData: [
                                            ...s.discoveredData,
                                            "When an account sends a transaction, its balance decreases (value + fee) and its nonce increases by 1. This demonstrates a permanent on-chain state change.",
                                        ],
                                    }))
                                }
                                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Mark post-state observed
                            </button>

                            {labState.postStateObserved && (() => {
                                // 🔬 Illustrative example values (NOT the student's wallet)
                                const examplePreBalance = 10;
                                const examplePreNonce = 20;
                                const exampleValue = 1;
                                const exampleFee = 0.000021;

                                const examplePostBalance = (
                                    examplePreBalance - exampleValue - exampleFee
                                ).toFixed(6);
                                const examplePostNonce = examplePreNonce + 1;

                                return (
                                    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                                        <p className="text-sm font-semibold mb-2">
                                            ✅ Observed Post-Transaction State (Illustrative Example)
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Pre-State (Before Sending Tx)
                                                </div>
                                                <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                    Balance: {examplePreBalance} ETH<br />
                                                    Nonce: {examplePreNonce}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Post-State (After Sending Tx)
                                                </div>
                                                <div className="mt-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                                                    Balance: {examplePostBalance} ETH<br />
                                                    Nonce: {examplePostNonce}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Premium math/teaching block */}
                                        <div className="mt-4 p-5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 space-y-3 transition-all duration-300 hover:scale-[1.01] animate-fadeIn">
                                            <p className="text-lg font-bold text-indigo-900 dark:text-indigo-200">
                                                State Transition (Sending 1 EDU‑D)
                                            </p>

                                            <ul className="list-disc list-inside text-base font-semibold text-indigo-900 dark:text-indigo-200">
                                                <li>Balance decreases by <strong>value + gas fee</strong></li>
                                                <li>Nonce increases by <strong>1</strong></li>
                                            </ul>

                                            <div className="mt-3 space-y-1 text-lg font-mono font-bold">
                                                <div>
                                                    postBalance = 10 − 1 − 0.000021 = <span className="text-indigo-700 dark:text-indigo-300">8.999979 ETH</span>
                                                </div>
                                                <div>
                                                    postNonce = 20 + 1 = <span className="text-indigo-700 dark:text-indigo-300">21</span>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-sm text-indigo-800 dark:text-indigo-300">
                                                📘 This is an <strong>illustrative example</strong>. Your real wallet state is verified in Step 5.
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Action 5 — Send a real transaction */}
                        <div className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/80 dark:bg-slate-900/50">
                            <h3 className="font-semibold mb-2">
                                5️⃣ Send a Real Transaction (Faucet)
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                To prove that you fully understand transactions, you will now perform a real on‑chain action.
                                You will request funds from the faucet and then verify that your on‑chain state has changed.
                            </p>

                            <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40
                        text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                                💡 Use the faucet to send ETH to your wallet.
                                This creates a real blockchain transaction that consumes gas.
                                Your nonce will NOT increase because your account is RECEIVING funds.
                            </div>

                            <div className="mt-3 p-3 rounded-md bg-blue-100 dark:bg-blue-900/40
  text-blue-800 dark:text-blue-300 text-sm">
                                ℹ️ <strong>Important:</strong> Receiving funds does <strong>not</strong> increase your nonce.
                                The nonce only increases when <strong>your account sends</strong> a transaction.
                            </div>

                            <a
                                href="https://faucet.dimikog.org/"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-block px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                💧 Open Faucet (New Tab)
                            </a>

                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                After the faucet transaction is confirmed:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Your <strong>balance</strong> should increase</li>
                                </ul>
                            </div>

                            <button
                                onClick={handlePostTransactionCheck}
                                className="mt-4 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                🔄 Re-check Balance & Nonce After Transaction
                            </button>

                            {labState.postTxChecked && (
                                <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40 animate-fadeIn">
                                    <p className="text-sm font-semibold mb-2">
                                        ✅ Real Transaction Confirmed
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border">
                                            <div className="text-xs text-slate-500">Balance (After)</div>
                                            <div className="font-mono text-sm">{labState.postState.balance}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 🧠 Mini Recap — Sender vs Receiver */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="font-semibold mb-3">🧠 Mini Recap — Sender vs Receiver</h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Use this table to consolidate what you observed in the previous steps.
                        The rules below always apply in Ethereum‑based blockchains.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                            <h3 className="font-semibold mb-2">📤 When an account SENDS a transaction</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Balance <strong>decreases</strong> (value + gas fee)</li>
                                <li>Nonce <strong>increases by 1</strong></li>
                                <li>Gas is paid by the sender</li>
                                <li>State change is initiated by this account</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                            <h3 className="font-semibold mb-2">📥 When an account RECEIVES a transaction</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Balance <strong>increases</strong></li>
                                <li>Nonce <strong>does NOT change</strong></li>
                                <li>No gas is paid by the receiver</li>
                                <li>No state change is initiated by this account</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-sm text-indigo-800 dark:text-indigo-300">
                        💡 <strong>Key takeaway:</strong> Only the <strong>sender</strong> of a transaction pays gas and increments their nonce.
                        Receiving funds never changes the nonce.
                    </div>

                    {/* Mini quiz block */}
                    <div className="mt-6 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold mb-2">🧪 Quick Check</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            When you <strong>receive funds</strong> from the faucet, will your <strong>nonce</strong> increase?
                        </p>
                        <select
                            className="w-full max-w-xs px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                   bg-white dark:bg-slate-900 text-sm"
                            onChange={(e) => {
                                const correct = e.target.value === "no";
                                alert(
                                    correct
                                        ? "✅ Correct! Receiving funds does NOT change the nonce."
                                        : "❌ Not quite. The nonce only increases when YOU send a transaction."
                                );
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select an answer…</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </section>

                {/* 🔍 Discovered Data */}
                <section className="rounded-xl border border-white/80 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/60">
                    <h2 className="font-semibold mb-3">🔍 Discovered Data</h2>
                    {labState.discoveredData.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No discoveries yet — complete the steps above to unlock key blockchain insights.
                        </p>
                    ) : (
                        <>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                These are the key rules and observations you have uncovered during this lab.
                            </div>
                            <ul className="list-disc list-inside text-sm space-y-1 animate-fadeIn">
                                {labState.discoveredData.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>

                {/* 🧠 Explanation */}
                {labState.explanationUnlocked && (
                    <section className="rounded-xl border border-white/80 dark:border-indigo-700 p-6 bg-indigo-50 dark:bg-indigo-900/30 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-2">🧠 Explanation</h2>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Transactions are the <strong>only mechanism</strong> that can change blockchain state.</li>
                            <li>The <strong>sender</strong> pays gas and increments their nonce.</li>
                            <li>The <strong>receiver</strong> never pays gas and never changes nonce.</li>
                            <li>Balance changes depend on <strong>direction</strong> (sending vs receiving).</li>
                            <li>All state changes become permanent only after <strong>block inclusion</strong>.</li>
                        </ul>
                    </section>
                )}

                {/* 🎁 Completion & Return */}
                {labState.postTxChecked && (
                    <section className="rounded-xl border border-white/80 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-6">
                        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            🎉 Lab Completed
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 mb-4">
                            You have completed <strong>Lab 04 — Transactions &amp; Gas</strong>.
                            Claim your completion below.
                        </p>
                        <LabCompletionClaim
                            labId="lab04"
                            language="en"
                            backHref="/#/labs/lab04"
                            backLabel="⬅ Return to Lab Overview"
                        />
                    </section>
                )}

                {/* 🔁 Utilities */}
                <section className="flex items-center justify-between pt-6 border-t border-white/80 dark:border-slate-700">
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
                        href="https://github.com/DimiKog/web3edu-labs/tree/main/lab-04-transactions-gas"
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

export default Lab04Interaction;
