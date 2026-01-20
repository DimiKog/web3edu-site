import PageShell from "../components/PageShell.jsx";
import SectionBadge from "../components/SectionBadge.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, PlugZap, Wallet, AlertTriangle, LifeBuoy } from "lucide-react";

const RPC_URL = "https://rpc.dimikog.org/rpc/";
const CHAIN_ID = "424242";

function InfoLine({ label, value, mono = false }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3">
            <span className="text-white/60 text-sm">{label}</span>
            <span className={`text-white/90 text-sm ${mono ? "font-mono break-all" : ""}`}>{value}</span>
        </div>
    );
}

function GettingStartedCard({ icon: Icon, title, children, color = "#8A57FF" }) {
    return (
        <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
            <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to bottom right, ${color}10, transparent)` }}
            />

            <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-2xl border shadow-lg"
                        style={{
                            background: `linear-gradient(to bottom right, ${color}30, ${color}10)`,
                            borderColor: `${color}40`,
                            boxShadow: `0 0 20px ${color}30`,
                        }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>

                <div
                    className="h-1 w-24 rounded-full mb-6"
                    style={{ background: `linear-gradient(to right, ${color}, #8A57FF, #4ACBFF)` }}
                />

                <div className="text-white/80 leading-relaxed space-y-4">{children}</div>
            </div>
        </section>
    );
}

export default function GettingStarted() {
    return (
        <PageShell>
            <div className="relative min-h-screen">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[160px] animate-pulse-glow" />
                    <div className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-[#4ACBFF]/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-2/3 -left-20 h-[350px] w-[350px] rounded-full bg-[#FF67D2]/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[85%] right-[10%] h-[300px] w-[300px] rounded-full bg-[#8A57FF]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

                    <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#8A57FF]/60 animate-float" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#4ACBFF]/50 animate-float" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[#FF67D2]/50 animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[45%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#8A57FF]/70 animate-float" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute top-[80%] left-[25%] w-2.5 h-2.5 rounded-full bg-[#4ACBFF]/40 animate-float" style={{ animationDelay: "1.5s" }} />

                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <main className="relative max-w-4xl mx-auto px-4 py-20 space-y-12">
                    <div className="opacity-0 animate-fade-up">
                        <SectionBadge label="Getting Started" className="mb-6" />
                    </div>

                    <h1 className="opacity-0 animate-fade-up-delay-1 text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                        Getting Started with Web3Edu
                    </h1>

                    <div className="opacity-0 animate-fade-up-delay-2 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-500" />
                        <div
                            className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)] p-8 mb-2 animate-float"
                            style={{ animationDuration: "8s" }}
                        >
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                A short, practical guide to get you unstuck fast: add the Edu-Net, connect your wallet,
                                run labs, and know where to ask for help.
                            </p>
                            <p className="mt-3 text-white/60 text-sm">
                                This page is the stable source of truth for pilots and new learners.
                            </p>
                        </div>
                    </div>

                    <div className="opacity-0 animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/labs"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-[#FF67D2]/20 via-[#8A57FF]/20 to-[#4ACBFF]/20 border border-[#8A57FF]/30 text-white font-semibold hover:border-[#8A57FF]/60 hover:shadow-[0_0_30px_rgba(138,87,255,0.3)] transition-all duration-300"
                        >
                            Go to Laboratories <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/5 border border-white/10 text-white/80 font-semibold hover:text-white hover:border-white/30 transition"
                        >
                            Open Dashboard <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="https://web3edu.dimikog.org"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/5 border border-white/10 text-white/70 font-semibold hover:text-white hover:border-white/30 transition"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Open live site <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                    <GettingStartedCard icon={PlugZap} title="1) Add Besu Edu-Net to MetaMask" color="#8A57FF">
                        <p>
                            Web3Edu runs on a Besu-based permissioned Ethereum network (Edu-Net). You don’t need mainnet
                            ETH — this is a learning chain.
                        </p>
                        <div className="space-y-3">
                            <InfoLine label="RPC URL" value={RPC_URL} mono />
                            <InfoLine label="Chain ID" value={CHAIN_ID} mono />
                            <InfoLine label="Currency" value="EDU-D (learning token)" />
                        </div>
                        <p className="text-white/60 text-sm">
                            Tip: If MetaMask prompts you to switch networks, accept it.
                        </p>
                    </GettingStartedCard>

                    <GettingStartedCard icon={Wallet} title="2) Connect your wallet and start with Labs" color="#4ACBFF">
                        <p>
                            Start with the <span className="text-[#4ACBFF] font-medium">Foundational Labs</span>. They are
                            short, hands-on, and designed to teach one concept at a time.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Open Laboratories and pick Lab 01.",
                                "Complete the steps and submit when asked.",
                                "You’ll see XP and progress in your Dashboard.",
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#4ACBFF]" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-white/60 text-sm">
                            Applied Labs (like Proof of Escape) are validated on-chain via proof of ownership.
                        </p>
                    </GettingStartedCard>

                    <GettingStartedCard icon={AlertTriangle} title="3) Safety rule: your private key is never needed" color="#FF67D2">
                        <p>
                            Web3Edu will <span className="text-[#FF67D2] font-semibold">never</span> ask you to paste a private
                            key. Any app/site that requests it is unsafe.
                        </p>
                        <p className="text-white/60 text-sm">
                            You can prove ownership of an address using signatures — without sending funds and without
                            exposing secrets.
                        </p>
                    </GettingStartedCard>

                    <GettingStartedCard icon={LifeBuoy} title="4) If you get stuck" color="#8A57FF">
                        <p>If something doesn’t work (network, wallet, a lab step, or a UI bug), do this:</p>
                        <ul className="space-y-3">
                            {[
                                "Refresh once (seriously, it fixes half the universe).",
                                "Switch network → back to Edu-Net.",
                                "Try reconnecting the wallet.",
                                "If it still fails, share a screenshot + your wallet address + the lab name.",
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#FF67D2]" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/start-here"
                                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/5 border border-white/10 text-white/80 font-semibold hover:text-white hover:border-white/30 transition"
                            >
                                Back to Start Here <ArrowRight className="h-4 w-4" />
                            </Link>
                            <span className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/5 border border-white/10 text-white/50 font-semibold">
                                Pilot discussion link lives in the banner
                            </span>
                        </div>
                    </GettingStartedCard>

                    <div className="mt-12">
                        <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#8A57FF] to-transparent opacity-60" />
                        <div className="mt-8 text-center">
                            <p className="text-slate-800 dark:text-white/70 italic mb-6">
                                "Learning on Web3Edu begins with{" "}
                                <span className="bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text font-medium not-italic">
                                    momentum
                                </span>{" "}
                                — not perfection."
                            </p>
                            <Link
                                to="/labs"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF67D2]/20 via-[#8A57FF]/20 to-[#4ACBFF]/20 border border-[#8A57FF]/30 text-white font-semibold hover:border-[#8A57FF]/60 hover:shadow-[0_0_30px_rgba(138,87,255,0.3)] transition-all duration-300"
                            >
                                Start your first Lab
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="mt-8 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#4ACBFF] to-transparent opacity-60" />
                    </div>
                </main>
            </div>
        </PageShell>
    );
}
