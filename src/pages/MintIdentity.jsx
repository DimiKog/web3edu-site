import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell.jsx";
import identityIcon from "../assets/icons/identity-icon.png";

export default function MintIdentity() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [isMinting, setIsMinting] = useState(false);
    const [error, setError] = useState(null);

    const handleMint = async () => {
        try {
            setError(null);
            setIsMinting(true);

            if (!address) {
                setError("Wallet address not found.");
                setIsMinting(false);
                return;
            }

            const response = await fetch("https://web3edu-api.dimikog.org/mint-sbt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ address })
            });

            const data = await response.json();

            if (data.ok) {
                navigate("/welcome");
            } else {
                setError(data.error || "Minting failed.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Minting failed.");
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center
px-6 sm:px-8 md:px-10 py-14
bg-gradient-to-br from-white via-slate-100 to-white
dark:from-[#0A0F1A] dark:via-[#120A1E]/90 dark:to-[#0A0F1A]
relative overflow-hidden rounded-3xl transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br 
from-[#8A57FF]/10 via-[#4ACBFF]/8 to-[#FF67D2]/10 
rounded-3xl dark:hidden"></div>

                <div className="absolute inset-0 pointer-events-none">
                    {/* Light mode glow */}
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px]
                bg-gradient-to-br from-[#C7B6FF]/40 via-[#AEE6FF]/30 to-[#FFC3EB]/40
                blur-[120px] rounded-full dark:hidden"></div>

                    <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px]
                bg-gradient-to-br from-[#AEE6FF]/30 via-[#FFC3EB]/40 to-[#C7B6FF]/30
                blur-[110px] rounded-full dark:hidden"></div>

                    {/* Dark mode glow */}
                    <div className="absolute top-1/3 left-1/4 w-[260px] h-[260px] bg-[#4ACBFF]/20 blur-[110px] rounded-full hidden dark:block"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-[240px] h-[240px] bg-[#8A57FF]/18 blur-[100px] rounded-full hidden dark:block"></div>
                </div>

                {/* Step Header */}
                <div className="relative z-20 max-w-xl w-full mb-12 flex flex-col items-center select-none">

                    {/* Section Title Above Steps */}
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Identity Setup
                    </h2>

                    <div className="w-24 h-1 mb-6 rounded-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40"></div>

                    {/* Steps Row */}
                    <div className="flex justify-between items-center w-full text-sm font-semibold text-slate-700 dark:text-gray-400">

                        {/* Step 1 — COMPLETED */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300/60 dark:border-emerald-400/60 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-bold shadow-md">
                                ✓
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">Connect Wallet</span>
                        </div>

                        {/* Step 2 — ACTIVE */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#8A57FF]/15 via-[#4ACBFF]/10 to-[#FF67D2]/15 border border-[#8A57FF]/20 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-md">
                                2
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">Mint SBT</span>
                        </div>

                        {/* Step 3 — PENDING */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-gray-400">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-white/15 text-slate-800 dark:text-white">
                                3
                            </div>
                            <span className="tracking-wide">Welcome</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-70"></div>
                </div>

                <div className="relative z-10 max-sm:px-6
bg-white/80 dark:bg-white/5
border border-slate-200/70 dark:border-white/15
shadow-[0_8px_24px_rgba(15,23,42,0.18)]
backdrop-blur-md rounded-3xl px-10 py-12
max-w-3xl w-full flex flex-col items-center animate-[fadeInUp_0.6s_ease-out] transition-colors duration-500">

                    <div className="mb-6 relative flex items-center justify-center">
                        {/* Glowing ring */}
                        <div className="absolute w-40 h-40 rounded-full border-4 border-[#7F3DF1]/40 blur-[2px]
                                        animate-[pulse_2.8s_ease-in-out_infinite]"></div>

                        {/* Outer soft glow */}
                        <div className="absolute w-44 h-44 rounded-full bg-[#33D6FF]/20 blur-[45px]"></div>

                        {/* Icon */}
                        <img
                            src={identityIcon}
                            alt="Identity Icon"
                            className="w-28 h-28 opacity-95 drop-shadow-[0_0_14px_rgba(255,255,255,0.55)]
                                       animate-[pulse_4s_ease-in-out_infinite]"
                        />
                    </div>

                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-4 mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.40)] relative z-10">
                        Mint Your Web3Edu Identity
                    </h1>

                    <p className="animate-[fadeIn_0.8s_ease-out] mt-3 text-lg text-slate-700 dark:text-white/90 max-w-md leading-relaxed dark:leading-loose tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] relative z-10">
                        Your <strong>Identity Soulbound Token (SBT)</strong> is your permanent <strong>on-chain profile</strong> in Web3Edu.
                        It stores your level, accumulated points, achievements, and your overall learning progression.
                    </p>

                    <p className="animate-[fadeIn_0.8s_ease-out] mt-4 text-lg text-slate-700 dark:text-white/90 max-w-md leading-relaxed dark:leading-loose tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] relative z-10">
                        As a <strong>Soulbound Token</strong>, it cannot be transferred and it uniquely represents your
                        <strong> identity</strong> across the <strong>Web3Edu ecosystem</strong>.
                    </p>

                    <div className="flex items-center gap-2 mt-6 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/25"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white/90"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/25"></div>
                    </div>

                    {!isConnected && (
                        <div className="mt-10 flex flex-col items-center">
                            <div className="relative z-10 p-3 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-lg shadow-[0_4px_18px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_18px_rgba(15,23,42,0.18)]">
                                <ConnectButton />
                            </div>
                            <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 tracking-wide">
                                Please connect your wallet to continue.
                            </p>
                        </div>
                    )}

                    {isConnected && (
                        <div className="mt-10 flex flex-col items-center">
                            <button
                                onClick={handleMint}
                                disabled={isMinting}
                                className={`px-6 py-3 rounded-xl
bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
text-white font-semibold shadow-lg shadow-[#8A57FF]/30 tracking-wide
transition-all duration-300
${isMinting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:scale-[1.02]"}`}
                            >
                                {isMinting ? "Minting..." : "Mint Identity SBT"}
                            </button>

                            {error && (
                                <p className="mt-4 text-red-400 text-sm max-w-md">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}

                </div>

            </div>
            {isMinting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
  backdrop-blur-lg bg-black/40 animate-fadeIn">

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute w-40 h-40 rounded-full border-4 border-[#8A57FF]/40 animate-ping"></div>
                        <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/25 to-[#FF67D2]/30 blur-2xl"></div>
                        <img src={identityIcon} className="w-28 h-28 relative z-10 animate-pulse" />
                    </div>

                    <p className="text-white text-xl font-semibold tracking-wide animate-pulse">
                        Minting your SBT…
                    </p>

                </div>
            )}
        </PageShell>
    );
}