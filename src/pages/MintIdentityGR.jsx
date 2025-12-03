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
        setError(null);
        setIsMinting(true);
        try {
            const response = await fetch("https://web3edu-api.dimikog.org/mint-sbt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address })
            });
            const data = await response.json();
            if (!data.ok) {
                throw new Error(data.error || "Minting failed");
            }
            navigate("/welcome-gr");
        } catch (err) {
            console.error(err);
            setError(err.message || "Minting failed.");
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6
bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#0a0f1a]
relative overflow-hidden text-white backdrop-brightness-125 rounded-3xl py-20">

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/3 w-[380px] h-[380px] bg-[#33D6FF]/25 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-[#7F3DF1]/30 blur-[120px] rounded-full"></div>
                </div>

                <div className="absolute top-[30%] left-[18%] w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-[22%] right-[15%] w-2 h-2 bg-[#33D6FF]/50 rounded-full animate-ping"></div>
                <div className="absolute top-[55%] right-[28%] w-2 h-2 bg-[#7F3DF1]/50 rounded-full animate-ping"></div>

                <div className="flex items-center gap-10 mb-10 relative z-10">
                    {/* Step 1 — Completed */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#7F3DF1] flex items-center justify-center text-white font-bold shadow-md">
                            ✓
                        </div>
                        <span className="text-[#D3B6FF] font-medium">Σύνδεση Wallet</span>
                    </div>

                    {/* Step 2 — Current (Mint SBT) */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#A855F7] flex items-center justify-center text-white font-bold shadow-md">
                            2
                        </div>
                        <span className="text-white font-semibold">Έκδοση SBT</span>
                    </div>

                    {/* Step 3 — Upcoming */}
                    <div className="flex items-center gap-2 opacity-60">
                        <div className="w-7 h-7 rounded-full bg-slate-500/60 flex items-center justify-center text-white font-bold shadow-md">
                            3
                        </div>
                        <span className="text-slate-200/80 font-medium">Καλωσόρισες στο Web3Edu</span>
                    </div>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl px-10 py-12 shadow-[0_0_40px_rgba(0,0,0,0.25)] max-w-3xl w-full flex flex-col items-center animate-[fadeInUp_0.6s_ease-out] border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.12)]">

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

                    <h1 className="text-4xl font-extrabold drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)] text-white relative z-10 stroke-white/20 [text-shadow:0_0_4px_rgba(255,255,255,0.4)]">
                        Κόψε το Web3Edu Identity σου
                    </h1>

                    <p className="mt-4 text-lg text-white/90 max-w-xl leading-relaxed drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)] relative z-10">
                        Το Identity Soulbound Token (SBT) είναι το μόνιμο on-chain προφίλ σου στο Web3Edu.
                        Αποθηκεύει το επίπεδό σου, τους πόντους σου, τα επιτεύγματά σου και την πρόοδο μάθησης σου.
                        Πρόκειται για Soulbound Token — δεν μπορεί να μεταφερθεί και αντιπροσωπεύει μοναδικά
                        την ταυτότητά σου στο Web3Edu οικοσύστημα.
                    </p>

                    <div className="flex items-center gap-2 mt-6 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                        <div className="w-3 h-3 rounded-full bg-white/90"></div>
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                    </div>

                    {!isConnected && (
                        <div className="mt-10">
                            <ConnectButton />
                            <p className="mt-4 text-sm text-white/70">Σύνδεσε το πορτοφόλι σου για να συνεχίσεις.</p>
                        </div>
                    )}

                    {isConnected && (
                        <div className="mt-10 flex flex-col items-center">
                            <button
                                onClick={handleMint}
                                disabled={isMinting}
                                className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition
                            bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF] hover:opacity-90 ${isMinting ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isMinting ? "Γίνεται mint..." : "Κόψε το Identity SBT"}
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
        </PageShell>
    );
}