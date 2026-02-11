import PageShell from "../../components/PageShell.jsx";
import { useState } from "react";
import { useAccount } from "wagmi";

const PROPOSAL = {
    id: "dao-02-proposal-001",
    title: "Define Voting Tally Model for the Web3Edu DAO",
    description: `
In DAO Lab 01 you signed a vote.
In this lab, we do not change the vote — we change how it is counted.

This proposal examines which governance model
Web3Edu should adopt:

• 1 Wallet = 1 Vote
• Token-weighted (1 Token = 1 Vote)
• Quadratic Voting
`
};

export default function DaoLab02Interaction({ backToLabPath = "/#/labs/dao-02" }) {
    const { address, isConnected } = useAccount();

    const [model, setModel] = useState(null);
    const [quorum, setQuorum] = useState(20);
    const [threshold, setThreshold] = useState(50);
    const [simulatedResult, setSimulatedResult] = useState(null);

    const simulateOutcome = () => {
        if (!model) return;

        // Fixed community assumptions (academically cleaner)
        const totalMembers = 100;
        const yesIndividuals = 60;   // 60% individuals voted YES (constant across models)
        const noIndividuals = 40;

        // Token distribution assumption:
        // 10 whales hold 60% of tokens
        // 90 small holders hold 40% of tokens
        const whales = 10;
        const smallHolders = 90;

        let participation = 65; // assume 65% participation
        let yesVotes;

        if (model === "democracy") {
            // 1 wallet = 1 vote
            // 60% of participating members voted YES (intent fixed across models)
            yesVotes = yesIndividuals;
        }

        if (model === "token") {
            // Assume whales mostly vote YES (8/10 whales vote YES)
            const whaleYesPower = 0.6 * 0.8; // 60% token share * 80% whales YES
            const smallYesPower = 0.4 * (yesIndividuals - 8) / smallHolders;
            yesVotes = Math.round((whaleYesPower + smallYesPower) * 100);
        }

        if (model === "quadratic") {
            // Square root dampening
            const whalePower = Math.sqrt(60);
            const smallPower = Math.sqrt(40);

            const whaleYes = whalePower * 0.8;
            const smallYes = smallPower * 0.6;

            const totalPower = whalePower + smallPower;
            yesVotes = Math.round(((whaleYes + smallYes) / totalPower) * 100);
        }

        const quorumMet = participation >= quorum;
        const thresholdMet = yesVotes >= threshold;

        setSimulatedResult({
            participation,
            yesVotes,
            quorumMet,
            thresholdMet,
            passed: quorumMet && thresholdMet,
            totalMembers,
            yesIndividuals,
            noIndividuals,
            whales,
            smallHolders
        });
    };

    return (
        <PageShell title="DAO Lab 02 — Governance Design Simulator">
            <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

                {/* Goal */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h1 className="text-3xl font-extrabold mb-2">
                        DAO Lab 02 — Governance Design Simulator
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
                        In this lab you do <strong>not vote</strong>. You design the rules.
                        You will select a tally model, adjust <strong>quorum</strong> and <strong>approval threshold</strong>,
                        and run a simulation to see if the proposal would pass.
                    </p>
                </section>

                {/* How to complete */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">✅ What you need to do (step-by-step)</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                        <li>
                            <strong>Read</strong> the proposal context (what the DAO is trying to decide).
                        </li>
                        <li>
                            <strong>Select a governance model</strong> (1 wallet=1 vote, token-weighted, quadratic).
                        </li>
                        <li>
                            <strong>Adjust quorum & approval threshold</strong> and click <em>“Simulate Outcome”</em>.
                        </li>
                    </ol>
                    <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                        Goal: understand that the same community intent can lead to different outcomes depending on governance rules.
                    </p>
                </section>

                {/* Current State */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🧭 Current State</h2>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li>{isConnected ? "✅" : "❌"} Wallet connected</li>
                        <li>{model ? "✅" : "❌"} Model selected</li>
                        <li>{simulatedResult ? "✅" : "❌"} Simulation completed</li>
                    </ul>
                    {address && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Wallet: <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                        </p>
                    )}
                </section>

                {/* Proposal Context */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">📄 Proposal Context</h2>
                    <h3 className="font-semibold mb-2">{PROPOSAL.title}</h3>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {PROPOSAL.description}
                    </p>
                </section>

                {/* Community Structure */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-2">🏛 Simulated Community Structure</h2>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        <li>100 total members</li>
                        <li>10 large token holders (control 60% of tokens)</li>
                        <li>90 smaller holders (control 40% of tokens)</li>
                        <li>60% of individuals vote YES (constant intent)</li>
                    </ul>
                    <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                        The only thing you change in this lab is how power is distributed — not voter intent.
                    </p>
                </section>

                {/* Governance Model Selection */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/40">
                    <h2 className="text-xl font-semibold mb-4">⚙️ Select Governance Model</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Democracy */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "democracy"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("democracy")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                1 Wallet = 1 Vote
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Logic:</strong> Pure democracy. Every wallet has equal voting power.</p>
                                <p><strong>Best for:</strong> Community identity or subjective decisions (e.g. logo changes).</p>
                                <p className="text-red-500"><strong>Risk:</strong> Sybil attacks (one person creating many wallets).</p>
                                <div className="mt-2 rounded border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 text-xs text-amber-800 dark:text-amber-300">
                                    ⚠ <strong>Sybil Risk Explained:</strong> In a permissionless DAO, one person could create 50 wallets and vote 50 times.
                                    This is why many DAOs use Proof‑of‑Personhood systems (e.g. Gitcoin Passport) or Soulbound Tokens (SBTs)
                                    to approximate “1 human = 1 vote”.
                                </div>
                            </div>
                        </div>

                        {/* Token Weighted */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "token"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("token")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                Token-weighted
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Logic:</strong> Skin in the game. More stake = more influence.</p>
                                <p><strong>Best for:</strong> Financial or treasury-related decisions.</p>
                                <p className="text-red-500"><strong>Risk:</strong> Whale dominance (very large token holders) and power concentration.</p>
                            </div>
                        </div>

                        {/* Quadratic */}
                        <div className={`rounded-xl border-2 p-4 transition-all transform ${model === "quadratic"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 scale-105 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:scale-102"
                            }`}>
                            <button
                                onClick={() => setModel("quadratic")}
                                className="w-full px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-medium"
                            >
                                Quadratic Voting
                            </button>
                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Logic:</strong> Voting power grows with √tokens.</p>
                                <p><strong>Best for:</strong> Balancing strong preference with broad consensus.</p>
                                <p className="text-red-500"><strong>Risk:</strong> Mathematical complexity and Sybil vulnerability without identity.</p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="p-3">Model</th>
                                    <th className="p-3">Who Gains Power?</th>
                                    <th className="p-3">Main Risk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr>
                                    <td className="p-3 font-medium">1 Wallet = 1 Vote</td>
                                    <td className="p-3">Numerical Majority</td>
                                    <td className="p-3 text-red-500">Sybil Attacks</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Token-weighted</td>
                                    <td className="p-3">Large Stake Holders</td>
                                    <td className="p-3 text-red-500">Power Centralization</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Quadratic</td>
                                    <td className="p-3">Consensus Majority</td>
                                    <td className="p-3 text-red-500">Mathematical Complexity</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
                        If we use “1 Wallet = 1 Vote”, how do we prevent one person from creating 100 wallets?
                        Real DAOs often require identity verification (e.g. SBTs or Proof-of-Personhood) to mitigate Sybil attacks.
                    </div>
                </section>

                {/* Governance Parameters */}
                {model && (
                    <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900/40 space-y-6">
                        <h2 className="text-xl font-semibold">📊 Governance Parameters</h2>

                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Quorum</strong> = percentage of participation required for the vote to be valid.
                            <br />
                            <strong>Approval threshold</strong> = percentage of “YES” votes required for the proposal to pass.
                        </p>

                        {model && (
                            <div className="mt-4 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-4 text-sm">
                                <div className="font-semibold mb-1">⚖ Impact on Power Distribution</div>
                                {model === "democracy" && (
                                    <p>Voting power is equally distributed per wallet. Identity equals influence.</p>
                                )}
                                {model === "token" && (
                                    <p>Voting power is proportional to token holdings. Capital concentration increases influence.</p>
                                )}
                                {model === "quadratic" && (
                                    <p>Voting power grows with the square root of tokens. Large holders are dampened, smaller holders gain relative strength.</p>
                                )}
                            </div>
                        )}

                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                            <div className="font-semibold mb-2">🎯 Try preset scenarios</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => { setQuorum(20); setThreshold(50); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Balanced (20% / 50%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(60); setThreshold(50); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    High quorum (60% / 50%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(20); setThreshold(70); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Strict approval (20% / 70%)
                                </button>
                                <button
                                    onClick={() => { setQuorum(10); setThreshold(55); }}
                                    className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900 text-xs"
                                >
                                    Low friction (10% / 55%)
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Tip: Keep the intent (YES/NO) the same and only change rules — this shows “governance design”.
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Quorum: {quorum}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={quorum}
                                onChange={(e) => setQuorum(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Approval Threshold: {threshold}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <button
                            onClick={simulateOutcome}
                            className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                            Simulate Outcome
                        </button>
                    </section>
                )}

                {/* Simulated Result */}
                {simulatedResult && (
                    <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 space-y-8">
                        <h2 className="text-lg font-semibold">🔬 Governance Outcome Analysis</h2>

                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                            In this simulation, community intent is fixed. Only governance design changes the outcome.
                        </p>

                        {/* Community Snapshot */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">🏛 Community</div>
                                <p><strong>100 Members</strong></p>
                                <p className="text-xs text-slate-500">10 large holders (60% tokens)</p>
                                <p className="text-xs text-slate-500">90 small holders (40% tokens)</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">🗳 Intent</div>
                                <p>🟢 60% YES</p>
                                <p>🔴 40% NO</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 p-4 text-sm">
                                <div className="font-semibold mb-1">👥 Participation</div>
                                <p>{simulatedResult.participation}% engaged</p>
                            </div>
                        </div>

                        {/* Raw Intent Bar */}
                        <div>
                            <div className="text-xs mb-1">Raw Community Intent (Before Governance Model)</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-4 overflow-hidden">
                                <div className="bg-green-500 h-4" style={{ width: "60%" }} />
                            </div>
                            <div className="text-xs mt-1">60% YES (individual voting intent)</div>
                        </div>

                        {/* Token Distribution */}
                        <div className="space-y-2">
                            <div className="text-xs font-semibold">Token Distribution</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                                <div className="bg-indigo-600 h-3" style={{ width: "60%" }} />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Whales: 60%</div>

                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-3 overflow-hidden">
                                <div className="bg-indigo-400 h-3" style={{ width: "40%" }} />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Small holders: 40%</div>
                        </div>

                        {/* Power-adjusted YES bar */}
                        <div>
                            <div className="text-xs mb-1">Power-adjusted YES share (After Model Weighting)</div>
                            <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded h-6 overflow-hidden">
                                {/* Threshold Marker */}
                                <div
                                    className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10"
                                    style={{ left: `${threshold}%` }}
                                >
                                    <span className="text-[10px] bg-red-500 text-white px-1 absolute -top-4">
                                        Threshold
                                    </span>
                                </div>

                                {/* Vote Bar */}
                                <div
                                    className={`h-full transition-all duration-500 ${simulatedResult.thresholdMet ? "bg-green-600" : "bg-yellow-500"}`}
                                    style={{ width: `${simulatedResult.yesVotes}%` }}
                                />
                            </div>
                            <div className="text-xs mt-1">
                                {simulatedResult.yesVotes}% YES (after applying governance model)
                            </div>
                        </div>

                        <div className="space-y-1 text-sm">
                            <p>Quorum met: {simulatedResult.quorumMet ? "✅" : "❌"}</p>
                            <p>Threshold met: {simulatedResult.thresholdMet ? "✅" : "❌"}</p>
                        </div>

                        <div className="text-lg font-semibold">
                            {simulatedResult.passed ? "✅ Proposal PASSES" : "❌ Proposal REJECTED"}
                        </div>

                        <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
                            <div className="font-semibold">🧠 Why did this happen?</div>

                            {model === "democracy" && (
                                <p>
                                    In this model, every wallet has equal weight. Since 60% of individuals voted YES,
                                    the outcome directly reflects the numerical majority.
                                    A large token holder and a newcomer have identical influence.
                                </p>
                            )}

                            {model === "token" && (
                                <p>
                                    In token-weighted governance, voting power depends on token ownership.
                                    A small group of large holders (“whales” — participants holding a very large
                                    percentage of tokens) can significantly shift the outcome,
                                    even if most individual members disagree.
                                </p>
                            )}

                            {model === "quadratic" && (
                                <p>
                                    Quadratic voting reduces the dominance of large holders by applying
                                    a square-root function to voting power.
                                    This dampens capital concentration while still rewarding stronger preference intensity.
                                </p>
                            )}

                            {!simulatedResult.quorumMet && (
                                <p>
                                    The proposal failed because participation did not reach quorum.
                                    Governance rules can invalidate majority intent if engagement is too low.
                                </p>
                            )}

                            {simulatedResult.quorumMet && !simulatedResult.thresholdMet && (
                                <p>
                                    The proposal failed because the YES vote did not meet the required approval threshold.
                                    Raising thresholds increases the level of consensus required.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* Completion */}
                {simulatedResult && (
                    <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                        <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                            🎉 DAO Lab 02 Completed
                        </h2>
                        <p className="text-slate-700 dark:text-slate-200 space-y-2">
                            <strong>Congratulations!</strong> You have now mastered the two pillars of decentralized governance:
                            <br />
                            <span>• <strong>Lab 01:</strong> Cryptographic Proof of Intent (the signature).</span>
                            <br />
                            <span>• <strong>Lab 02:</strong> Systemic Rule Design (the tallying model).</span>
                            <br /><br />
                            You are now ready to participate in the real Web3Edu DAO.
                            Understanding how <strong>quorum</strong>, <strong>thresholds</strong>, and <strong>voting power</strong>
                            interact will help you design stronger proposals for the community.
                        </p>
                        <a
                            href={backToLabPath}
                            className="inline-block mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                        >
                            ⬅ Back to DAO Labs
                        </a>
                    </section>
                )}

            </div>
        </PageShell>
    );
}
