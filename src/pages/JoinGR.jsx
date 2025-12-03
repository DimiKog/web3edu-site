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
    const [loadingSBT, setLoadingSBT] = useState(false);

    // Έλεγχος δικτύου (Besu Edu-Net, chainId 424242)
    const checkNetwork = async () => {
        if (!window.ethereum) return;
        setLoadingNetwork(true);

        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });

            if (chainId.toLowerCase() !== "0x67932") {
                setNetworkOK(false);
                navigate("/education/network-check-gr");
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
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";
        setLoadingSBT(true);
        try {
            const res = await axios.get(
                `${BACKEND}/check-sbt/${address}`,
                { timeout: 8000 }
            );
            if (res.data?.hasSBT) {
                navigate("/dashboard-gr");
            } else {
                navigate("/mint-identity-gr");
            }
        } catch (e) {
            console.error("SBT check failed:", e);
            navigate("/mint-identity-gr");
        } finally {
            setLoadingSBT(false);
        }
    };

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6
bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#0a0f1a] relative overflow-hidden text-white rounded-3xl py-20">

                {/* Progress Header */}
                <div className="relative z-20 max-w-xl w-full mb-10 flex justify-between items-center text-sm font-semibold text-white/80 select-none">

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
                            1
                        </div>
                        <span className="text-white">Σύνδεση Πορτοφολιού</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">
                            2
                        </div>
                        <span className="text-white/50">Κόμισμα SBT</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">
                            3
                        </div>
                        <span className="text-white/50">Καλωσορίσατε</span>
                    </div>

                </div>

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
                    {isConnected && networkOK && (
                        <button
                            onClick={loadingSBT ? undefined : handleContinue}
                            disabled={loadingSBT}
                            className={`mt-10 relative z-10 py-3 px-6 rounded-xl 
                            bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF] 
                            text-white font-semibold shadow-lg shadow-[#7F3DF1]/30 
                            transition ${loadingSBT
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:opacity-90"
                                }`}
                        >
                            {loadingSBT ? "Έλεγχος..." : "Συνέχεια"}
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
