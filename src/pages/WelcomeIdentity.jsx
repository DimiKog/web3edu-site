import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import web3eduLogo from "../assets/web3edu_logo.png";

const WelcomeIdentity = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PageShell>
            <div className="min-h-screen w-full flex flex-col items-center justify-center
            bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/20 to-[#020617]
            text-slate-100 px-6 py-20 relative overflow-hidden">
                {/* Glow / Highlight */}
                <div className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full"></div>
                </div>

                {/* Progress Header */}
                <div className="relative z-20 max-w-xl w-full mb-10 flex justify-between items-center text-sm font-semibold text-slate-500 dark:text-gray-400 select-none">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9E4BFF] text-white">
                            ✓
                        </div>
                        <span className="text-white/90">Connect Wallet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9E4BFF] text-white">
                            ✓
                        </div>
                        <span className="text-white/90">Mint SBT</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4F46E5] text-white font-bold">
                            3
                        </div>
                        <span className="font-semibold text-[#4F46E5] dark:text-white">
                            Welcome to Web3Edu
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div className="relative z-10 max-w-xl w-full bg-gradient-to-br from-white via-indigo-50/30 to-slate-100 dark:from-gray-900 dark:via-indigo-900/40 dark:to-gray-900 border border-white/20 dark:border-white/10 rounded-3xl backdrop-blur-xl p-10 shadow-2xl flex flex-col items-center text-center">
                    {/* Top: Title and description */}
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
                        🎉 Your Web3Edu Identity Is Ready!
                    </h1>
                    <p className="text-md text-slate-600 dark:text-gray-300 leading-snug max-w-md mb-8">
                        You’ve successfully minted your <span className="font-semibold text-[#7F3DF1] dark:text-purple-300">
                            Web3Edu Identity SBT
                        </span>.
                        This token unlocks access to your learning profile, achievements, and future DAO features.
                    </p>

                    {/* Middle: Completed steps summary */}
                    <div className="bg-purple-200/40 dark:bg-purple-900/40 rounded-xl py-4 px-6 mb-8 w-full max-w-md text-left text-purple-800 dark:text-purple-200">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Wallet connected</li>
                            <li>Identity SBT minted</li>
                            <li>Dashboard unlocked</li>
                        </ul>
                    </div>

                    {/* Image */}
                    <img
                        src={web3eduLogo}
                        alt="Web3Edu Identity Badge"
                        className="w-32 h-32 sm:w-40 sm:h-40 mb-8 rounded-full drop-shadow-xl mx-auto"
                    />

                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 max-w-md">
                        Next steps: Explore your Dashboard to view your XP, track lessons, unlock badges,
                        and follow your personalized learning path on Web3Edu.
                    </p>

                    {/* Bottom: Primary button */}
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition rounded-xl text-lg font-semibold shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </PageShell>
    );
};

export default WelcomeIdentity;