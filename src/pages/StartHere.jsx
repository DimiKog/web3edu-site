import PageShell from "../components/PageShell.jsx";
import { useNavigate } from "react-router-dom";

const StartHere = () => {
    const navigate = useNavigate();
    return (
        <PageShell>
            <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Start Here
                </h1>

                <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                    Web3Edu is an experimental educational ecosystem where students,
                    educators, and builders learn Web3 by using real infrastructure,
                    real tools, and real governance primitives.
                </p>

                <p className="max-w-3xl mt-4 text-base text-slate-600 dark:text-slate-400">
                    This page helps you figure out where to begin — depending on who you are
                    and what you want to explore.
                </p>

                <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-700/60" />

                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    How this page works
                </p>

                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                    Below, you’ll find suggested entry points depending on whether you are a
                    student, educator, or builder. You don’t need to do everything — just pick
                    one place to start.
                </p>
            </section>

            <section className="bg-slate-100/40 dark:bg-slate-900/30 py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-10">
                        Choose your starting point
                    </h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Student */}
                        <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
                    bg-white/70 dark:bg-slate-800/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all rounded-2xl backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-2">🎓 Student</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Learn Web3 by interacting with real infrastructure, tools, and hands-on labs.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li>• Try Proof of Escape</li>
                                <li
                                    onClick={() => navigate("/labs")}
                                    className="cursor-pointer hover:text-indigo-500 transition"
                                >
                                    • Explore your first lab
                                </li>
                                <li>• Understand Web3 identity</li>
                            </ul>
                        </div>

                        {/* Educator */}
                        <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
                    bg-white/70 dark:bg-slate-800/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all rounded-2xl backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-2">🧑‍🏫 Educator</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Adopt Web3 concepts in teaching without redesigning your entire course.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li
                                    onClick={() => navigate("/labs")}
                                    className="cursor-pointer hover:text-indigo-500 transition"
                                >
                                    • Review available labs
                                </li>
                                <li>• Understand identity & SBTs</li>
                                <li>• Pilot Web3Edu in class</li>
                            </ul>
                        </div>

                        {/* Builder */}
                        <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
                    bg-white/70 dark:bg-slate-800/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all rounded-2xl backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-2">🧑‍💻 Builder / Researcher</h3>
                            <div className="mt-1 mb-3 h-[2px] w-10 rounded bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Experiment with real Web3 infrastructure and research-driven tooling.
                            </p>
                            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                <li>• Explore Besu Edu-Net</li>
                                <li>• Inspect Blockscout & metrics</li>
                                <li>• Contribute ideas & experiments</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-20">
                <h2 className="text-2xl md:text-3xl font-semibold mb-10">
                    What you can do today
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* 15 minutes */}
                    <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
      bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl backdrop-blur-sm hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 15 minutes</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Read why Web3Edu exists and how Web3 can change education.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            → Medium article
                        </p>
                    </div>

                    {/* 30 minutes */}
                    <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
      bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl backdrop-blur-sm hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 30 minutes</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Try a hands-on Web3 experience using real infrastructure.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            → Proof of Escape
                        </p>
                    </div>

                    {/* 45 minutes */}
                    <div className="rounded-xl border border-slate-300/40 dark:border-slate-700/60
      bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl backdrop-blur-sm hover:shadow-md transition-all">
                        <h3 className="font-semibold mb-2">⏱️ 45 minutes</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Explore your first lab and interact with Web3 tools directly.
                        </p>
                        <p
                            onClick={() => navigate("/labs")}
                            className="mt-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-indigo-500 transition"
                        >
                            → Labs (intro)
                        </p>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default StartHere;