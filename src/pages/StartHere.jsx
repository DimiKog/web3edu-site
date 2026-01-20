import PageShell from "../components/PageShell.jsx";
import { useNavigate } from "react-router-dom";

const StartHere = () => {
    const navigate = useNavigate();
    return (
        <PageShell>
            <div className="relative min-h-screen">
                {/* Animated background layers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary glow orbs */}
                    <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[160px] animate-pulse-glow" />
                    <div className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-[#4ACBFF]/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-2/3 -left-20 h-[350px] w-[350px] rounded-full bg-[#FF67D2]/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[85%] right-[10%] h-[300px] w-[300px] rounded-full bg-[#8A57FF]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

                    {/* Floating particles */}
                    <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#8A57FF]/60 animate-float" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#4ACBFF]/50 animate-float" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[#FF67D2]/50 animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[45%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#8A57FF]/70 animate-float" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute top-[80%] left-[25%] w-2.5 h-2.5 rounded-full bg-[#4ACBFF]/40 animate-float" style={{ animationDelay: "1.5s" }} />

                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <main className="relative max-w-4xl mx-auto px-4 py-20 space-y-12">
                    {/* HERO / INTRO */}
                    <section className="opacity-0 animate-fade-up">
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#8A57FF]/40 to-[#4ACBFF]/40 rounded-full blur-2xl opacity-40" />
                                <svg
                                    className="w-20 h-20 text-[#8A57FF] relative"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-center bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                            Start Here
                        </h1>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-25 group-hover:opacity-45 blur-sm transition-opacity duration-500" />
                            <div
                                className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)] p-8"
                            >
                                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-white/90 text-center">
                                    Web3Edu is an experimental learning environment where Web3 is not explained — it is experienced.
                                </p>
                                <p className="max-w-3xl mx-auto mt-4 text-base text-white/70 text-center">
                                    You don't read about wallets, blockchains, or identity. You use them, step by step, on real infrastructure.
                                </p>
                                <p className="max-w-3xl mx-auto mt-4 text-base text-white/80 text-center font-medium">
                                    This page tells you exactly how to begin.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* WHO THIS IS FOR */}
                    <StartCard
                        title="Who this is for (v1)"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                    >
                        <p className="text-base text-white/70 mb-4">
                            Right now, Web3Edu is designed for students and early learners.
                        </p>

                        <div className="rounded-xl p-6 border border-white/10 bg-white/[0.02]">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#4ACBFF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-base text-white/70">Curious about Web3 beyond hype</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#4ACBFF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-base text-white/70">Willing to experiment and break things safely</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#4ACBFF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-base text-white/70">Interested in understanding how things actually work</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-sm text-white/50 mt-4 italic">
                            Educator and Builder paths will be added later. For v1, we focus on doing one thing well.
                        </p>
                    </StartCard>

                    {/* HOW WEB3EDU WORKS */}
                    <StartCard
                        title="How Web3Edu works"
                        color="#4ACBFF"
                        icon={
                            <svg className="w-6 h-6 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                    >
                        <p className="text-base text-white/70 mb-4">
                            Web3Edu is built around hands-on labs.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 my-8">
                            <div className="rounded-xl p-6 border border-white/10 bg-white/[0.03]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF]">
                                    <span className="text-white font-bold text-lg">1</span>
                                </div>
                                <p className="text-sm text-white/70">Each lab introduces one core Web3 concept</p>
                            </div>
                            <div className="rounded-xl p-6 border border-white/10 bg-white/[0.03]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-[#4ACBFF] to-[#8A57FF]">
                                    <span className="text-white font-bold text-lg">2</span>
                                </div>
                                <p className="text-sm text-white/70">Each lab requires interaction with real tools</p>
                            </div>
                            <div className="rounded-xl p-6 border border-white/10 bg-white/[0.03]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-[#8A57FF] to-[#FF67D2]">
                                    <span className="text-white font-bold text-lg">3</span>
                                </div>
                                <p className="text-sm text-white/70">Each lab leaves behind verifiable progress</p>
                            </div>
                        </div>

                        <div className="rounded-lg p-6 border-l-4 border-[#8A57FF] bg-[#8A57FF]/10">
                            <p className="text-base text-white/90 font-medium">
                                There are no quizzes, no slides, and no fake demos. Progress is earned by doing.
                            </p>
                        </div>
                    </StartCard>

                    {/* WHERE TO START */}
                    <StartCard
                        title="Where you should start"
                        color="#FF67D2"
                        icon={
                            <svg className="w-6 h-6 text-[#FF67D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                    >
                        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.02]">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Foundational Labs</h3>
                                    <p className="text-base text-white/70 mb-3">
                                        You should start with the Foundational Labs.
                                    </p>
                                    <p className="text-base text-white/70 mb-3">
                                        These labs are ordered intentionally. Each one builds on the previous.
                                    </p>
                                    <div className="flex items-center gap-2 border border-yellow-400/30 rounded-lg p-3 mt-4 bg-yellow-400/10">
                                        <svg className="w-5 h-5 text-yellow-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-sm text-yellow-200 font-medium">
                                            Do not skip ahead. The system assumes you've completed them in sequence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StartCard>

                    {/* PROOF OF ESCAPE */}
                    <StartCard
                        title="What Proof of Escape is (and is not)"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        }
                    >
                        <div className="rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-[#8A57FF]/10 to-[#FF67D2]/10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-[#8A57FF] text-white text-xs font-semibold rounded-full">Applied Lab</span>
                            </div>

                            <p className="text-base text-white/80 mb-3">
                                Proof of Escape is an Applied Lab.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 my-6">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-sm text-white/60">Not an introduction</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-sm text-white/60">Not a tutorial</span>
                                </div>
                            </div>

                            <p className="text-base text-white/80">
                                You should attempt it after completing the foundational labs, as a way to apply what you learned and earn an on-chain proof of completion.
                            </p>
                        </div>
                    </StartCard>

                    {/* PROGRESS & PHILOSOPHY */}
                    <StartCard
                        title="How progress is tracked"
                        color="#4ACBFF"
                        icon={
                            <svg className="w-6 h-6 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="rounded-xl p-6 border border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="font-semibold text-white">Local Progress</h3>
                                </div>
                                <p className="text-sm text-white/70">
                                    Recorded locally to guide your learning journey
                                </p>
                            </div>
                            <div className="rounded-xl p-6 border border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="font-semibold text-white">On-Chain Proof</h3>
                                </div>
                                <p className="text-sm text-white/70">
                                    Verifiable proof recorded when appropriate
                                </p>
                            </div>
                        </div>

                        <p className="text-base text-white/60 mt-6 text-center italic">
                            Foundational labs focus on learning progression. Applied labs focus on proof and experience. These are treated differently by design.
                        </p>
                    </StartCard>

                    {/* WHAT THIS IS NOT */}
                    <StartCard
                        title="What Web3Edu is not"
                        color="#FF67D2"
                        icon={
                            <svg className="w-6 h-6 text-[#FF67D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        }
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">A course platform</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">A certificate mill</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">A marketing funnel</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">A simulation</span>
                            </div>
                        </div>
                    </StartCard>

                    {/* HOW TO USE IT */}
                    <StartCard
                        title="How to use this platform"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        }
                    >
                        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.03]">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 space-y-4">
                                    <p className="text-lg text-white/80 font-medium">
                                        Take your time. Read carefully. Experiment freely.
                                    </p>
                                    <p className="text-base text-white/60">
                                        If something breaks, that's part of the lesson. And when you finish a lab, leave feedback — this platform evolves with its learners.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => navigate("/labs")}
                                        className="px-8 py-4 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(138,87,255,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <span>Go to Labs</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </StartCard>
                </main>
            </div>
        </PageShell>
    );
};

export default StartHere;

function StartCard({ title, icon, color = "#8A57FF", children }) {
    return (
        <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom right, ${color}12, transparent)` }} />

            <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-2xl border shadow-lg"
                        style={{
                            background: `linear-gradient(to bottom right, ${color}30, ${color}10)`,
                            borderColor: `${color}40`,
                            boxShadow: `0 0 20px ${color}30`
                        }}
                    >
                        {icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">{title}</h2>
                </div>

                <div className="h-1 w-24 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${color}, #8A57FF, #4ACBFF)` }} />

                <div className="text-white/80 leading-relaxed">
                    {children}
                </div>
            </div>
        </section>
    );
}
