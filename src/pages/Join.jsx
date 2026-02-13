import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import joinHero from "../assets/join-hero.webp";

export default function Join() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [networkOK, setNetworkOK] = useState(true);
    const [loadingNetwork, setLoadingNetwork] = useState(false);
    const [checkingSBT, setCheckingSBT] = useState(false);

    // Check if user is connected to Web3Edu Besu Edu-Net (chainId 424242)
    const checkNetwork = useCallback(async () => {
        if (!window.ethereum) return;
        setLoadingNetwork(true);

        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });

            if (chainId.toLowerCase() !== "0x67932") {
                setNetworkOK(false);
                navigate("/education/network-check");
                return;
            } else {
                setNetworkOK(true);
            }
        } catch {
            setNetworkOK(false);
        }
        setLoadingNetwork(false);
    }, [navigate]);

    useEffect(() => {
        if (isConnected) {
            checkNetwork();
        }
    }, [isConnected, checkNetwork]);

    const handleContinue = async () => {
        const BACKEND = "https://web3edu-api.dimikog.org";

        setCheckingSBT(true);

        try {
            const res = await axios.get(`${BACKEND}/check-sbt/${address}`, {
                timeout: 8000
            });

            if (res.data.hasSBT === true) {
                setCheckingSBT(false);
                navigate("/dashboard");
            } else {
                setCheckingSBT(false);
                navigate("/mint-identity");
            }
        } catch (e) {
            setCheckingSBT(false);
            console.error("SBT check failed:", e);
            alert("Could not check your Identity SBT. Please try again.");
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

                        {/* Step 1 — ACTIVE */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#8A57FF]/15 via-[#4ACBFF]/10 to-[#FF67D2]/15 border border-[#8A57FF]/20 shadow-sm">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-md">
                                1
                            </div>
                            <span className="text-slate-900 dark:text-white tracking-wide">Connect Wallet</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-gray-400">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-white/15 text-slate-800 dark:text-white">
                                2
                            </div>
                            <span className="tracking-wide">Mint SBT</span>
                        </div>

                        {/* Step 3 */}
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

                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-4 mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.40)] relative z-10">
                        Start Your Web3Edu Journey
                    </h1>

                    <p className="mt-3 text-lg text-slate-700 dark:text-white/85 max-w-md leading-relaxed tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] relative z-10">
                        Connect your wallet to access Web3-native learning, earn points,
                        and unlock your dynamic Identity Soulbound Token (SBT).
                    </p>

                    <div className="relative mt-10 p-3 rounded-2xl bg-white/5 backdrop-blur-md shadow-inner shadow-black/10">
                        <div className="absolute inset-0 blur-[55px]
                        bg-gradient-to-br from-sky-300/20 via-purple-300/20 to-pink-300/20
                        dark:from-[#8A57FF]/25 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20
                        rounded-2xl"></div>
                        <img src={joinHero}
                            alt="Web3Edu Identity Illustration"
                            className="relative w-full max-w-lg sm:max-w-xl rounded-2xl shadow-lg shadow-black/30 opacity-95 animate-fadeIn mx-auto"
                            loading="eager" fetchpriority="high"
                        />
                    </div>

                    <div className="mt-10 relative z-10 p-3 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-lg shadow-[0_4px_18px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_18px_rgba(15,23,42,0.18)]">
                        <ConnectButton />
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-gray-400 tracking-wide">
                        No gas fees. Your wallet always remains yours.
                    </p>

                    {isConnected && networkOK && !loadingNetwork && (
                        <button
                            onClick={handleContinue}
                            disabled={checkingSBT}
                            className={`mt-10 relative z-10 py-3 px-8 rounded-xl
                        bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                        text-white font-semibold shadow-lg shadow-[#8A57FF]/30 tracking-wide
                        transition-all duration-300
                        ${checkingSBT ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:scale-[1.02]"}`}
                        >
                            {checkingSBT ? "Checking identity…" : "Continue"}
                        </button>
                    )}

                    {checkingSBT && (
                        <p className="mt-4 text-md text-slate-700 dark:text-white/75 tracking-wide relative z-10 animate-pulse">
                            Verifying your Identity SBT…
                        </p>
                    )}

                    {isConnected && loadingNetwork && (
                        <p className="mt-6 text-md text-slate-700 dark:text-white/75 tracking-wide relative z-10 animate-pulse">
                            Checking network…
                        </p>
                    )}
                </div>

            </div>
        </PageShell>
    );
}
