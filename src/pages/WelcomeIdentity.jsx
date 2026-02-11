import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import PageShell from "../components/PageShell.jsx";
import web3eduLogoDark from "../assets/web3edu_logo.png";
import web3eduLogoLight from "../assets/web3edu_logo_light.png";

const WelcomeIdentity = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useAccount();
    const txHashRaw = new URLSearchParams(location.search).get("tx");
    const [tokenId, setTokenId] = useState(null);
    const [tokenIdError, setTokenIdError] = useState(null);

    useEffect(() => {
        if (!address) return;
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";
        fetch(`${BACKEND}/web3sbt/resolve/${address}`)
            .then((res) => res.json())
            .then((data) => {
                setTokenId(data?.tokenId ?? null);
                setTokenIdError(null);
            })
            .catch((err) => {
                console.error("Failed to resolve tokenId", err);
                setTokenId(null);
                setTokenIdError("Unable to resolve token ID.");
            });
    }, [address]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Confetti animation
        const canvas = document.getElementById("confetti-canvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            const pieces = Array.from({ length: 120 }, () => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight - window.innerHeight,
                r: Math.random() * 6 + 4,
                c: `hsl(${Math.random() * 360}, 90%, 65%)`,
                s: Math.random() * 2 + 1,
                a: Math.random() * (Math.PI * 2),
            }));
            const fall = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pieces.forEach(p => {
                    p.y += p.s;
                    p.a += 0.02;
                    p.x += Math.sin(p.a) * 0.5;
                    if (p.y > window.innerHeight) p.y = -20;
                    ctx.fillStyle = p.c;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(fall);
            };
            fall();
        }
    }, []);

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mq.matches);
        const handler = e => setIsDark(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <PageShell>
            <div className="min-h-screen w-full flex flex-col items-center justify-center
            bg-gradient-to-br from-white via-slate-100 to-white
            dark:from-[#090C14] dark:via-[#120A1E] dark:to-[#020617]
            text-slate-900 dark:text-slate-100 px-6 py-20 relative overflow-hidden transition-colors duration-500">

                {/* Success Confetti + Glow Burst */}
                <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center animate-[fadeIn_0.8s_ease-out]">
                    <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40 blur-3xl animate-pulse"></div>
                </div>

                {/* Canvas Confetti Trigger */}
                <canvas id="confetti-canvas" className="absolute inset-0 z-40 pointer-events-none"></canvas>

                {/* Glow / Highlight */}
                <div className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full"></div>
                </div>

                {/* Progress Header */}
                <div className="relative z-20 max-w-xl w-full mb-12 flex flex-col items-center select-none">

                    <h2 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-4 tracking-tight">
                        Identity Setup
                    </h2>

                    <div className="w-24 h-1 mb-6 rounded-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40"></div>

                    <div className="flex justify-between items-center w-full text-sm font-semibold text-slate-700 dark:text-gray-400">

                        {/* Step 1 — completed */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300/60 dark:border-emerald-400/60 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-bold shadow-md">
                                ✓
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">
                                Connect Wallet
                            </span>
                        </div>

                        {/* Step 2 — completed */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300/60 dark:border-emerald-400/60 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-bold shadow-md">
                                ✓
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">
                                Mint SBT
                            </span>
                        </div>

                        {/* Step 3 — active */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#8A57FF]/15 via-[#4ACBFF]/10 to-[#FF67D2]/15 border border-[#8A57FF]/20 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-md">
                                3
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">
                                Welcome
                            </span>
                        </div>

                    </div>

                    <div className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-70"></div>
                </div>

                {/* Card */}
                <div className="relative z-10 max-w-xl w-full
                bg-white/80 dark:bg-white/5
                border border-slate-200/70 dark:border-white/10
                rounded-3xl backdrop-blur-md p-10
                shadow-[0_8px_24px_rgba(15,23,42,0.18)]
                flex flex-col items-center text-center transition-colors duration-500">
                    {/* Top: Title and description */}
                    <h1 className="text-4xl font-extrabold mb-5 tracking-tight animate-[fadeIn_0.8s_ease-out] text-slate-900 dark:text-white">
                        🎉 Your Web3Edu Identity Is Ready!
                    </h1>
                    <p className="animate-[fadeIn_0.9s_ease-out] text-md text-slate-600 dark:text-gray-300 leading-relaxed dark:leading-loose max-w-md mb-8">
                        You’ve successfully minted your <strong>Web3Edu Identity SBT</strong> —
                        your permanent <strong>on-chain learning identity</strong>.
                        This token unlocks access to your <strong>progress tracking</strong>, <strong>achievements</strong>,
                        and upcoming <strong>DAO participation features</strong> across the Web3Edu ecosystem.
                    </p>

                    {/* Middle: Completed steps summary */}
                    <div className="animate-[fadeIn_1s_ease-out] bg-purple-200/40 dark:bg-purple-900/40 rounded-xl py-4 px-6 mb-8 w-full max-w-md text-left text-purple-800 dark:text-purple-200">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Wallet connected</strong></li>
                            <li><strong>Identity SBT successfully minted</strong></li>
                            <li><strong>Dashboard access unlocked</strong></li>
                        </ul>
                    </div>

                    {/* Image */}
                    <img
                        src={isDark ? web3eduLogoDark : web3eduLogoLight}
                        alt="Web3Edu Identity Badge"
                        className="w-32 h-32 sm:w-40 sm:h-40 mb-8 rounded-full drop-shadow-xl mx-auto transition-all duration-300"
                    />

                    <p className="animate-[fadeIn_1.1s_ease-out] text-sm text-slate-700 dark:text-slate-300 mb-6 max-w-md leading-relaxed dark:leading-loose">
                        Next steps: Explore your <strong>Dashboard</strong> to view your XP,
                        track completed lessons, unlock <strong>badges</strong>, and follow your
                        personalized <strong>learning path</strong> within the Web3Edu platform.
                    </p>

                    {/* Transaction Hash Display */}
                    {tokenId !== null ? (
                        <div className="animate-[fadeIn_1.15s_ease-out] mb-6 w-full max-w-md mx-auto p-4 
                        rounded-xl border border-slate-300/60 dark:border-white/10 
                        bg-white/60 dark:bg-white/5 backdrop-blur-md 
                        shadow-[0_4px_18px_rgba(0,0,0,0.08)]">

                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                <strong>Token ID</strong>
                            </p>

                            <a
                                href={`https://blockexplorer.dimikog.org/token/0xdde6a59445538ea146a17dd8745e7ea5288b1a31/instance/${tokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-[#8A57FF] dark:text-purple-300 underline hover:opacity-80"
                            >
                                View on Blockscout ↗
                            </a>
                        </div>
                    ) : (
                        (tokenIdError || txHashRaw) && (
                            <div className="animate-[fadeIn_1.15s_ease-out] mb-6 w-full max-w-md mx-auto p-4 
                            rounded-xl border border-amber-300/60 dark:border-amber-500/40 
                            bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-md 
                            shadow-[0_4px_18px_rgba(0,0,0,0.08)]">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                    {tokenIdError ?? "Token ID not available yet. Try again in a moment."}
                                </p>
                            </div>
                        )
                    )}

                    {/* Bottom: Primary button */}
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-2 px-8 py-3 bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] hover:opacity-90 hover:scale-[1.02] transition-all rounded-xl text-lg font-semibold shadow-lg animate-[fadeIn_1.2s_ease-out]"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </PageShell>
    );
};

export default WelcomeIdentity;
