import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import joinHero from "../assets/join-hero.png";

export default function JoinGR() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [networkOK, setNetworkOK] = useState(true);
    const [loadingNetwork, setLoadingNetwork] = useState(false);

    // Έλεγχος δικτύου (Besu Edu-Net, chainId 424242)
    const checkNetwork = async () => {
        if (!window.ethereum) return;
        setLoadingNetwork(true);

        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });

            if (chainId !== "0x67932") {
                setNetworkOK(false);
                window.location.hash = "#/education/network-check-gr";
                return;
            } else {
                setNetworkOK(true);
            }
        } catch (err) {
            setNetworkOK(false);
        }
        setLoadingNetwork(false);
    };

    useEffect(() => {
        if (!isConnected) return;
        checkNetwork();
    }, [isConnected]);

    const handleContinue = async () => {
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://mybackend.dimikog.org";
        try {
            const res = await axios.get(`${BACKEND}/check-sbt/${address}`);
            if (res.data.hasSBT) {
                window.location.hash = "#/dashboard-gr";
            } else {
                window.location.hash = "#/mint-identity-gr";
            }
        } catch (e) {
            console.error("SBT check failed:", e);
        }
    };

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6
bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#0a0f1a] relative overflow-hidden text-white rounded-3xl py-20">

                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/3 w-[380px] h-[380px] bg-[#33D6FF]/25 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-[#7F3DF1]/30 blur-[120px] rounded-full"></div>
                </div>

                {/* Floating Particle Effects */}
                <div className="absolute top-[30%] left-[18%] w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-[22%] right-[15%] w-2 h-2 bg-[#33D6FF]/50 rounded-full animate-ping"></div>
                <div className="absolute top-[55%] right-[28%] w-2 h-2 bg-[#7F3DF1]/50 rounded-full animate-ping"></div>

                {/* Wide-Screen Halo */}
                <div className="absolute top-[40%] right-[10%] w-[180px] h-[180px] bg-white/[0.05] blur-[100px] rounded-full"></div>

                {/* STEP Indicator */}
                <p className="text-sm text-white/70 mb-6 mt-4 relative z-10">
                    Βήμα 1 από 3 — Σύνδεση Πορτοφολιού
                </p>

                {/* Main Card */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl px-10 py-12 shadow-[0_0_40px_rgba(0,0,0,0.25)] max-w-3xl w-full flex flex-col items-center animate-[fadeInUp_0.6s_ease-out]">

                    {/* Title */}
                    <h1 className="text-4xl font-extrabold drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)] text-white relative z-10">
                        Ξεκίνησε το Ταξίδι σου στο Web3Edu
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 text-lg text-white/80 max-w-xl leading-relaxed drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] relative z-10">
                        Σύνδεσε το πορτοφόλι σου για να αποκτήσεις πρόσβαση στο εκαπιδευτικό υλικό για το Web3,
                        να κερδίσεις βαθμούς και να ξεκλειδώσεις το δυναμικό σου Identity Soulbound Token (SBT).
                    </p>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-2 mt-6 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-white/90"></div>
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative mt-10">
                        <div className="absolute inset-0 blur-[90px] bg-[#7F3DF1]/40 rounded-full"></div>
                        <img
                            src={joinHero}
                            alt="Web3Edu Identity Illustration"
                            className="relative w-full max-w-xl rounded-2xl shadow-lg shadow-black/40 opacity-95 animate-fadeIn"
                        />
                    </div>

                    {/* Connect Button */}
                    <div className="mt-8 relative z-10">
                        <ConnectButton />
                    </div>

                    {/* Continue Button */}
                    {isConnected && networkOK && !loadingNetwork && (
                        <button
                            onClick={handleContinue}
                            className="mt-10 relative z-10 py-3 px-6 rounded-xl 
                            bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF] 
                            text-white font-semibold shadow-lg shadow-[#7F3DF1]/30 
                            hover:opacity-90 transition"
                        >
                            Συνέχεια
                        </button>
                    )}

                    {/* Network loading */}
                    {isConnected && loadingNetwork && (
                        <p className="mt-6 text-md text-white/70 relative z-10">Έλεγχος δικτύου…</p>
                    )}
                </div>

            </div>
        </PageShell>
    );
}