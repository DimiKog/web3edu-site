import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { ethers } from "ethers";
import identityIcon from "../assets/icons/identity-icon.png";

export default function MintIdentity() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [isMinting, setIsMinting] = useState(false);
    const [error, setError] = useState(null);

    // TODO: Replace with the final deployed contract address
    const SBT_ADDRESS = "0xYourSBTContractAddressHere";
    // TODO: Replace with the ABI of your Identity SBT contract
    const SBT_ABI = [
        "function mint() public",
        "function balanceOf(address owner) view returns (uint256)",
    ];

    const handleMint = async () => {
        try {
            setError(null);
            setIsMinting(true);

            if (!window.ethereum) {
                setError("MetaMask not detected.");
                setIsMinting(false);
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);

            // Get the current network object
            const net = await provider.getNetwork();

            // Override the internal network object to fully disable ENS
            provider._network = {
                ...net,
                ensAddress: undefined
            };

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(SBT_ADDRESS, SBT_ABI, signer);

            const tx = await contract.mint();
            await tx.wait();

            window.location.hash = "#/welcome";
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

                <p className="text-sm text-white/70 mb-6 mt-4 relative z-10">
                    Step 2 of 3 — Mint Your Identity SBT
                </p>

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
                        Mint Your Web3Edu Identity
                    </h1>

                    <p className="mt-4 text-lg text-white/90 max-w-xl leading-relaxed drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)] relative z-10">
                        Your Identity Soulbound Token (SBT) is your permanent Web3Edu on-chain profile. It stores
                        your level, your points, achievements, and your learning progression.
                        This is a Soulbound Token — it cannot be transferred and uniquely
                        represents your identity across the Web3Edu ecosystem.
                    </p>

                    <div className="flex items-center gap-2 mt-6 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                        <div className="w-3 h-3 rounded-full bg-white/90"></div>
                        <div className="w-3 h-3 rounded-full bg-white/25"></div>
                    </div>

                    {!isConnected && (
                        <div className="mt-10">
                            <ConnectButton />
                            <p className="mt-4 text-sm text-white/70">Please connect your wallet to continue.</p>
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
        </PageShell>
    );
}