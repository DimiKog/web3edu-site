import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PageShell from "../../components/PageShell.jsx";
import SectionBadge from "../../components/SectionBadge.jsx";
import { Link } from "react-router-dom";

export default function NetworkCheck() {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [networkStatus, setNetworkStatus] = useState("");
    const [besuChainId, setBesuChainId] = useState("");
    const [error, setError] = useState("");
    const [connected, setConnected] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const BESU_RPC_URL = "https://rpc.dimikog.org/rpc/";
    const CHAIN_NAME = "Besu EduNet";
    const CHAIN_ID_DEC = 424242;
    const CHAIN_ID_HEX = "0x67932";
    const NATIVE_SYMBOL = "EDU-D";

    // Detect chainId from the RPC
    useEffect(() => {
        async function detectBesuChainId() {
            try {
                const res = await fetch(BESU_RPC_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        method: "eth_chainId",
                        params: [],
                        id: 1,
                    }),
                });
                const data = await res.json();
                if (data.result) setBesuChainId(data.result);
            } catch (err) {
                console.error("Failed to detect chainId:", err);
            }
        }
        detectBesuChainId();
    }, []);

    // Switch/add the Besu EduNet in MetaMask
    async function ensureBesuNetwork() {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: CHAIN_ID_HEX }],
            });
            return true;
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: CHAIN_ID_HEX,
                                chainName: CHAIN_NAME,
                                nativeCurrency: {
                                    name: "EduCoin-Dev",
                                    symbol: NATIVE_SYMBOL,
                                    decimals: 18,
                                },
                                rpcUrls: [BESU_RPC_URL],
                                blockExplorerUrls: ["https://blockexplorer.dimikog.org"],
                            },
                        ],
                    });
                    return true;
                } catch (addError) {
                    console.error("Error adding Besu EduNet:", addError);
                    setError("Could not add Besu EduNet to MetaMask.");
                }
            } else {
                console.error("Network switch error:", switchError);
                setError("Network change was rejected or failed.");
            }
            return false;
        }
    }

    // Fetch balance from RPC
    async function fetchBalance(addr) {
        try {
            setRefreshing(true);
            const rpcProvider = new ethers.JsonRpcProvider(BESU_RPC_URL);
            const rawBalance = await rpcProvider.getBalance(addr);
            const formatted = ethers.formatEther(rawBalance);
            setBalance(formatted);
            setRefreshing(false);
        } catch (err) {
            console.error("Error fetching balance:", err);
            setError("Could not refresh balance.");
            setRefreshing(false);
        }
    }

    // Connect wallet
    async function connectWallet() {
        try {
            if (!window.ethereum) {
                setError("MetaMask not detected. Please install it first.");
                return;
            }

            const switched = await ensureBesuNetwork();
            if (!switched) return;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            const network = await provider.getNetwork();

            if (Number(network.chainId) !== CHAIN_ID_DEC) {
                setNetworkStatus(`⚠️ Wrong network (ID ${Number(network.chainId)}).`);
                setConnected(false);
            } else {
                setNetworkStatus("✅ Connected successfully to Besu EduNet");
                setConnected(true);
            }

            setAddress(userAddress);
            await fetchBalance(userAddress);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Connection failed. Check MetaMask and try again.");
            setConnected(false);
        }
    }

    return (
        <PageShell>
            {/* Animated gradient glow orbs and subtle grid */}
            <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 opacity-30 blur-3xl animate-glowSlow"></div>
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 opacity-20 blur-3xl animate-glowSlow delay-2000"></div>
                <svg
                    className="absolute inset-0 w-full h-full stroke-[0.5] stroke-gray-700/10 dark:stroke-gray-400/10"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                            x="50%"
                            y="50%"
                        >
                            <path d="M 40 0 L 0 0 0 40" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
                <SectionBadge className="mb-6">Network Check</SectionBadge>

                <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500 mb-12 animate-fadeUp">
                    Connect to Besu EduNet
                </h1>

                {/* Glassmorphism card container */}
                <div
                    className="bg-gradient-to-tr from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-md rounded-3xl p-8 shadow-lg space-y-10"
                    style={{ minHeight: "480px" }}
                >
                    {/* 1) Intro / explanation card */}
                    <section
                        className="bg-[#1B2238]/50 rounded-2xl p-6 text-blue-400 text-sm leading-relaxed space-y-3 shadow-inner shadow-blue-900/20 animate-fadeUp"
                        style={{ animationDelay: "100ms" }}
                    >
                        <p>
                            Use this tool to confirm you’re connected to <strong>Besu EduNet</strong> and
                            check your balance in <strong>{NATIVE_SYMBOL}</strong>.
                        </p>
                        <p>
                            If you just received tokens from the faucet, press <em>↻ Refresh</em> to update.
                        </p>
                    </section>

                    {/* 2) Wallet connection button */}
                    <section className="flex justify-center" style={{ animationDelay: "200ms" }}>
                        <button
                            onClick={connectWallet}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                            type="button"
                        >
                            Connect Wallet
                        </button>
                    </section>

                    {/* 3) Status + address + balance area */}
                    {address && (
                        <section
                            className="text-gray-300 space-y-5 animate-fadeUp"
                            style={{ animationDelay: "300ms" }}
                        >
                            <div className="space-y-2">
                                <p className="break-all">
                                    <strong>Address:</strong> {address}
                                </p>

                                <div className="flex items-center justify-between">
                                    <p>
                                        <strong>Balance:</strong> {balance} {NATIVE_SYMBOL}
                                    </p>
                                    <button
                                        onClick={() => fetchBalance(address)}
                                        disabled={refreshing}
                                        className={`ml-2 inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition ${refreshing
                                            ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            }`}
                                        type="button"
                                        aria-label="Refresh balance"
                                    >
                                        {refreshing ? "Refreshing..." : "↻ Refresh"}
                                    </button>
                                </div>

                                <p className="text-xs italic text-gray-400">
                                    If MetaMask shows 0 {NATIVE_SYMBOL}, treat this value as the correct network balance.
                                </p>

                                <p>
                                    <strong>Status:</strong> {networkStatus}
                                </p>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium">
                                    {error}
                                </p>
                            )}

                            {besuChainId && (
                                <p className="text-sm text-gray-500">
                                    Detected Chain ID: {parseInt(besuChainId, 16)} ({besuChainId})
                                </p>
                            )}
                        </section>
                    )}

                    {connected && (
                        <div className="mt-6 rounded-full bg-green-600/80 px-6 py-3 text-center text-white font-semibold shadow-lg animate-fadeUp glow">
                            ✅ You're connected to Besu EduNet! Balance updates directly from the RPC.
                        </div>
                    )}
                </div>
            </main>

            <div className="mt-10 flex justify-center animate-fadeUp">
                <Link
                    to="/start-here"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                >
                    🏠 Back to Start Here
                </Link>
            </div>

            <style>{`
                @keyframes fadeUp {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.6s ease forwards;
                }
                @keyframes glowSlow {
                    0%, 100% {
                        filter: blur(60px);
                        opacity: 0.3;
                        transform: translateY(0) translateX(0);
                    }
                    50% {
                        filter: blur(80px);
                        opacity: 0.4;
                        transform: translateY(10px) translateX(10px);
                    }
                }
                .animate-glowSlow {
                    animation: glowSlow 10s ease-in-out infinite;
                }
                .glow {
                    filter: drop-shadow(0 0 8px rgba(34,197,94,0.7)) drop-shadow(0 0 12px rgba(34,197,94,0.5));
                }
            `}</style>
        </PageShell>
    );
}
