import PageShell from "../../components/PageShell.jsx";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const PROPOSAL = {
    id: "dao-01-proposal-001",
    title: "Adopt DAO-based governance for Web3Edu",
    description: `
Web3Edu is exploring DAO-based governance for curriculum evolution,
lab approval, and community participation.

This proposal asks whether Web3Edu should:
• Use proposals for curriculum changes
• Allow token/SBT-weighted voting
• Record governance actions cryptographically

This is a simulated governance vote.
`
};

export default function DaoLab01Interaction() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [vote, setVote] = useState(null);
    const [signature, setSignature] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [proposalRead, setProposalRead] = useState(false);

    const [proposalUnfolded, setProposalUnfolded] = useState(false);

    const [showPayload, setShowPayload] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);

    const handleVote = async () => {
        if (!isConnected || !selectedChoice) {
            setError("Please select a voting option before signing.");
            return;
        }
        if (!proposalRead) {
            setError("You must unfold and explicitly acknowledge the proposal before voting.");
            return;
        }

        try {
            const message = `
DAO Lab 01 — Governance & Voting

Proposal ID: ${PROPOSAL.id}
Voter: ${address}
Vote: ${selectedChoice}

This vote is part of a Web3Edu governance simulation.
`;

            const sig = await signMessageAsync({ message });

            setVote(selectedChoice);
            setSignature(sig);
            setSubmitted(true);

            // Later:
            // POST to backend → record vote
            // mark lab as completed
        } catch (err) {
            setError("Signature rejected or failed.");
        }
    };

    return (
        <PageShell title="DAO Lab 01 — Governance & Voting">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-lg font-semibold mb-3">🗳️ Governance Lifecycle (Simulated)</h2>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span className="opacity-50">Discussion</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Draft</span>
                        <span className="opacity-50">→</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Active Vote</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Tallying</span>
                        <span className="opacity-50">→</span>
                        <span className="opacity-50">Execution</span>
                    </div>
                    <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
                        You are participating in the <strong>Active Vote</strong> phase of a broader governance process.
                    </p>
                </section>
                {/* Goal section */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        DAO Lab 01 — Governance & Voting
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        Participate in a simulated DAO governance process by casting a cryptographically
                        signed vote using your wallet. This lab focuses on governance semantics rather than
                        on-chain deployment.
                    </p>
                </section>

                {/* Current State section */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🧭 Current State</h2>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>{isConnected ? "✅" : "❌"} Wallet connected</li>
                        <li>{proposalRead ? "✅" : "❌"} Proposal read</li>
                        <li>{vote !== null ? "✅" : "❌"} Vote cast</li>
                        <li>{signature !== null ? "✅" : "❌"} Vote signed</li>
                    </ul>
                </section>

                {/* Proposal section */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">
                        📄 Governance Proposal
                    </h2>
                    <h3 className="font-semibold mb-2">{PROPOSAL.title}</h3>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 mb-4">
                        {PROPOSAL.description}
                    </p>
                    {proposalUnfolded && (
                        <div className="mt-4 rounded bg-slate-50 dark:bg-slate-800 p-4 text-sm space-y-2">
                            <p><strong>Motivation:</strong> Enable community-driven curriculum evolution.</p>
                            <p><strong>Scope:</strong> Governance applies to labs, learning tracks, and DAO rules.</p>
                            <p><strong>Risks:</strong> Low participation, unclear voting power models.</p>
                            <p><strong>Non-goals:</strong> No token launch or on-chain execution in this lab.</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setProposalUnfolded(!proposalUnfolded);
                        }}
                        className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        📖 {proposalUnfolded ? "Fold proposal" : "Unfold full proposal"}
                    </button>
                    <button
                        onClick={() => {
                            setProposalRead(true);
                        }}
                        disabled={!proposalUnfolded || proposalRead}
                        className="ml-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                        ✅ Mark proposal as read
                    </button>
                </section>

                {/* Voting actions */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">🎛 Available Actions</h2>

                    {!submitted ? (
                        <div className={!proposalRead ? "opacity-40 pointer-events-none" : "opacity-100"}>
                            <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                                1. Select your stance. 2. Review the data payload. 3. Sign to cast.
                            </p>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setSelectedChoice("YES")}
                                    className={`px-6 py-2 rounded-lg border-2 transition-all ${selectedChoice === "YES"
                                        ? "border-green-600 bg-green-600 text-white"
                                        : "border-green-600 text-green-600 hover:bg-green-50"
                                        }`}
                                >
                                    YES
                                </button>

                                <button
                                    onClick={() => setSelectedChoice("NO")}
                                    className={`px-6 py-2 rounded-lg border-2 transition-all ${selectedChoice === "NO"
                                        ? "border-slate-700 bg-slate-700 text-white"
                                        : "border-slate-700 text-slate-700 hover:bg-slate-100"
                                        }`}
                                >
                                    NO
                                </button>
                            </div>

                            {selectedChoice && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Data to be signed:</span>
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                            EIP-191 Standard
                                        </span>
                                    </div>

                                    <pre className="text-xs rounded bg-slate-100 dark:bg-slate-800 p-3 overflow-x-auto border border-slate-200 dark:border-slate-700">
                                        {`Proposal: ${PROPOSAL.id}
Voter: ${address}
Choice: ${selectedChoice}
Timestamp: ${new Date().toISOString()}`}
                                    </pre>

                                    <button
                                        onClick={handleVote}
                                        className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-transform active:scale-95"
                                    >
                                        Sign & Submit Vote
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* keep the existing submitted-state JSX exactly as it is */
                        <div className="rounded bg-green-50 dark:bg-slate-800 px-4 py-3 space-y-2">
                            <div className="font-semibold mb-2 text-green-700 dark:text-green-300">
                                ✔ Vote recorded
                            </div>
                            <p className="text-sm">
                                <strong>Your vote:</strong> {vote}
                            </p>
                            <p className="break-all text-xs mt-2 text-slate-600 dark:text-slate-400">
                                <strong>Signature:</strong> {signature}
                            </p>
                            <div className="mt-4 border-t border-green-200 dark:border-green-700 pt-3">
                                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                                    What just happened?
                                </h3>
                                <ul className="list-disc list-inside text-green-700 dark:text-green-300 text-sm space-y-1">
                                    <li>You signed a message with your wallet</li>
                                    <li>No transaction was sent</li>
                                    <li>This simulates off-chain DAO voting</li>
                                    <li>The signature proves intent and identity</li>
                                </ul>
                            </div>
                            <section className="rounded-xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-6">
                                <h2 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-200">
                                    🧠 Why this was important
                                </h2>

                                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200 text-sm">
                                    <li>
                                        You participated in governance <strong>without sending a transaction</strong>.
                                    </li>
                                    <li>
                                        Your wallet was used to express <strong>intent</strong>, not to transfer value.
                                    </li>
                                    <li>
                                        The cryptographic signature proves <strong>who voted</strong> and <strong>what they voted</strong>.
                                    </li>
                                    <li>
                                        This is how many real DAOs operate their off-chain governance today.
                                    </li>
                                </ul>

                                <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-400">
                                    Governance in Web3 is not defined by blockchains alone — it is defined by
                                    cryptographic identity and collective agreement.
                                </p>
                            </section>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-600 mt-4">{error}</p>
                    )}
                </section>

                {/* Simulated Admission Context section */}
                {submitted && (
                    <section className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/40 p-6">
                        <h2 className="text-lg font-semibold mb-2">🧪 Simulated Admission Context</h2>
                        <p className="text-slate-700 dark:text-slate-300 space-y-2">
                            In real DAOs, membership, delegation, or stake may be required to participate in governance. In this lab, admission is assumed for learning purposes only. This is a simulation and does not enforce any real DAO admission rules.
                        </p>
                    </section>
                )}

                {/* Governance Insight section */}
                {submitted && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                🔍 Governance Logic: Tallying
                            </h2>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                                Your signature is now a <strong>governance data object</strong>. In <strong>DAO Lab 02</strong>, we will apply
                                different tallying formulas to this same vote.
                            </p>
                            <ul className="space-y-3 text-xs">
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
                                    <span className="font-medium text-blue-800 dark:text-blue-300">Strict Democracy</span>
                                    <span>1 Wallet = 1 Vote</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1">
                                    <span className="font-medium text-blue-800 dark:text-blue-300">Token Weighted</span>
                                    <span>1 Token = 1 Vote</span>
                                </li>
                                <li className="flex justify-between border-b border-blue-100 dark:border-blue-800 pb-1 text-slate-500">
                                    <span className="font-medium">Quadratic (Next Lab)</span>
                                    <span>√Tokens = Voting Power</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-6">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                📡 Beyond the Signature
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                                        Where is the vote stored?
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Right now, it exists only as signed data. In real DAOs, this data is sent to an
                                        <strong> indexer</strong> or <strong>relayer</strong>.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                                        Is anything on-chain?
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        No. This is <strong>off-chain intent</strong>. Blockchain execution only happens
                                        if governance rules decide it should.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {submitted && (
                    <section className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 mt-6">
                        <h2 className="text-lg font-semibold mb-2">🧾 Simulated Vote Receipt</h2>
                        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                            <li><strong>Proposal:</strong> {PROPOSAL.id}</li>
                            <li><strong>Voter:</strong> {address}</li>
                            <li><strong>Vote:</strong> {vote}</li>
                            <li><strong>Storage:</strong> Decentralized (simulated)</li>
                            <li><strong>Content ID (CID):</strong> bafybeigdyr…mock</li>
                        </ul>
                        <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                            In real DAOs, off‑chain votes are commonly stored on decentralized storage
                            (e.g. IPFS or Arweave) so anyone can later verify the results without paying gas.
                        </p>
                    </section>
                )}

                {/* Completion section */}
                {submitted && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            🎉 Lab Interaction Completed
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200">
                            You have successfully participated in a DAO-style governance vote.
                            Return to the DAO Lab overview to continue.
                        </p>
                        <a
                            href="/#/labs/dao-01"
                            className="inline-block mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                        >
                            ⬅ Return to DAO Labs & Claim Completion
                        </a>
                    </section>
                )}
            </div>
        </PageShell>
    );
}
