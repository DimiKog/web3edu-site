import PageShell from "../components/PageShell.jsx";
import { useNavigate } from "react-router-dom";

const StartHere = () => {
    const navigate = useNavigate();
    return (
        <PageShell>
            {/* =========================
            HERO / INTRO
        ========================== */}
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
                {/* Compass Icon - Visual Anchor */}
                <div className="flex items-center justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur-2xl opacity-20"></div>
                        <svg
                            className="w-20 h-20 text-indigo-600 dark:text-indigo-400 relative"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-center">
                    Start Here
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 text-center">
                    Web3Edu is an experimental learning environment where Web3 is not explained — it is experienced.
                </p>

                <p className="max-w-3xl mx-auto mt-4 text-base text-slate-600 dark:text-slate-400 text-center">
                    You don't read about wallets, blockchains, or identity. You use them, step by step, on real infrastructure.
                </p>

                <p className="max-w-3xl mx-auto mt-4 text-base text-slate-600 dark:text-slate-400 text-center font-medium">
                    This page tells you exactly how to begin.
                </p>
            </section>

            {/* =========================
            WHO THIS IS FOR
        ========================== */}
            <section className="bg-slate-100/40 dark:bg-slate-900/30 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Icon for Target Audience */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            Who this is for (v1)
                        </h2>
                    </div>

                    <p className="text-base text-slate-600 dark:text-slate-300 mb-4">
                        Right now, Web3Edu is designed for students and early learners.
                    </p>

                    <div className="bg-white/50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-base text-slate-600 dark:text-slate-300">Curious about Web3 beyond hype</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-base text-slate-600 dark:text-slate-300">Willing to experiment and break things safely</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-base text-slate-600 dark:text-slate-300">Interested in understanding how things actually work</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 italic">
                        Educator and Builder paths will be added later. For v1, we focus on doing one thing well.
                    </p>
                </div>
            </section>

            {/* =========================
            HOW WEB3EDU WORKS
        ========================== */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                {/* Icon for How It Works */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        How Web3Edu works
                    </h2>
                </div>

                <p className="text-base text-slate-600 dark:text-slate-300 mb-4">
                    Web3Edu is built around hands-on labs.
                </p>

                <div className="grid md:grid-cols-3 gap-4 my-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/30 dark:to-cyan-950/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Each lab introduces one core Web3 concept</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-cyan-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-cyan-200/50 dark:border-cyan-700/50">
                        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Each lab requires interaction with real tools</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/30 dark:to-cyan-950/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Each lab leaves behind verifiable progress</p>
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/40 rounded-lg p-6 border-l-4 border-indigo-500">
                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                        There are no quizzes, no slides, and no fake demos. Progress is earned by doing.
                    </p>
                </div>
            </section>

            {/* =========================
            WHERE TO START
        ========================== */}
            <section className="bg-slate-100/40 dark:bg-slate-900/30 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Icon for Starting Point */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            Where you should start
                        </h2>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/40 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Foundational Labs</h3>
                                <p className="text-base text-slate-600 dark:text-slate-300 mb-3">
                                    You should start with the Foundational Labs.
                                </p>
                                <p className="text-base text-slate-600 dark:text-slate-300 mb-3">
                                    These labs are ordered intentionally. Each one builds on the previous.
                                </p>
                                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3 mt-4">
                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                        Do not skip ahead. The system assumes you've completed them in sequence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================
            PROOF OF ESCAPE
        ========================== */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                {/* Icon for Proof of Escape */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        What Proof of Escape is (and is not)
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">Applied Lab</span>
                    </div>

                    <p className="text-base text-slate-700 dark:text-slate-300 mb-3">
                        Proof of Escape is an Applied Lab.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 my-6">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Not an introduction</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Not a tutorial</span>
                        </div>
                    </div>

                    <p className="text-base text-slate-700 dark:text-slate-300">
                        You should attempt it after completing the foundational labs, as a way to apply what you learned and earn an on-chain proof of completion.
                    </p>
                </div>
            </section>

            {/* =========================
            PROGRESS & PHILOSOPHY
        ========================== */}
            <section className="bg-slate-100/40 dark:bg-slate-900/30 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Icon for Progress */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            How progress is tracked
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/60 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Local Progress</h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Recorded locally to guide your learning journey
                            </p>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">On-Chain Proof</h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Verifiable proof recorded when appropriate
                            </p>
                        </div>
                    </div>

                    <p className="text-base text-slate-600 dark:text-slate-300 mt-6 text-center italic">
                        Foundational labs focus on learning progression. Applied labs focus on proof and experience. These are treated differently by design.
                    </p>
                </div>
            </section>

            {/* =========================
            WHAT THIS IS NOT
        ========================== */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                {/* Icon for What This Is Not */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        What Web3Edu is not
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-base text-slate-700 dark:text-slate-300">A course platform</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-base text-slate-700 dark:text-slate-300">A certificate mill</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-base text-slate-700 dark:text-slate-300">A marketing funnel</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-base text-slate-700 dark:text-slate-300">A simulation</span>
                    </div>
                </div>
            </section>

            {/* =========================
            HOW TO USE IT
        ========================== */}
            <section className="bg-gradient-to-br from-indigo-50 via-cyan-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Icon for How To Use */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            How to use this platform
                        </h2>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 dark:border-indigo-700/50 shadow-lg">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 space-y-4">
                                <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                                    Take your time. Read carefully. Experiment freely.
                                </p>
                                <p className="text-base text-slate-600 dark:text-slate-400">
                                    If something breaks, that's part of the lesson. And when you finish a lab, leave feedback — this platform evolves with its learners.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => navigate("/labs")}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <span>Go to Labs</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default StartHere;
