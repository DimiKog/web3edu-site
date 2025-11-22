import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

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

    // --- Detect chainId from RPC ---
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

    // --- Ensure Besu EduNet is active in MetaMask ---
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

    // --- Fetch balance from RPC ---
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

    // --- Connect wallet ---
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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white
bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#0a0f1a] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-[480px] h-[480px] bg-[#33D6FF]/20 blur-[140px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-[#7F3DF1]/25 blur-[130px] rounded-full"></div>
            </div>
            <div className="w-full max-w-md backdrop-blur-xl bg-[#0E0F1A]/40 border border-white/20
rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.25)] p-8 relative z-10 text-white">
                {/* 🌐 Language Toggle */}
                <div className="absolute top-3 right-3 flex items-center gap-2 text-sm">
                    <a
                        href="#/education/network-check-gr"
                        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        title="Ελληνικά"
                    >
                        🇬🇷 GR
                    </a>
                </div>

                <h1 className="text-2xl font-bold text-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] text-white">
                    🧠 Besu EduNet Connectivity Check
                </h1>

                {/* Info Box */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 text-sm text-white/90">
                    Use this tool to confirm you’re connected to <strong>Besu EduNet</strong>
                    and to check your balance in <strong>{NATIVE_SYMBOL}</strong>.
                    <br />
                    If you’ve just received tokens from the faucet, click <em>↻ Refresh</em> to update.
                </div>

                <button
                    onClick={connectWallet}
                    className="w-full py-2 px-4 
bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF] 
hover:opacity-90 text-white font-semibold rounded-xl shadow-lg shadow-[#7F3DF1]/30 transition"
                >
                    Connect Wallet
                </button>

                {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}

                {besuChainId && (
                    <p className="mt-4 text-center text-sm text-white/70">
                        Detected Chain ID: {parseInt(besuChainId, 16)} ({besuChainId})
                    </p>
                )}

                {address && (
                    <div className="mt-6 space-y-3 text-sm sm:text-base">
                        <p><strong>Address:</strong> {address}</p>

                        <div className="flex items-center justify-between">
                            <p>
                                <strong>Balance:</strong> {balance} {NATIVE_SYMBOL}
                            </p>
                            <button
                                onClick={() => fetchBalance(address)}
                                disabled={refreshing}
                                className={`ml-2 px-3 py-1 text-sm rounded-md font-medium ${refreshing
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#33D6FF] to-[#7F3DF1] hover:opacity-90"
                                    } text-white transition`}
                            >
                                {refreshing ? "Refreshing..." : "↻ Refresh"}
                            </button>
                        </div>

                        <p className="text-xs text-white/70 italic">
                            If MetaMask shows 0 {NATIVE_SYMBOL}, treat this value as the correct network balance.
                        </p>

                        <p><strong>Status:</strong> {networkStatus}</p>
                        {connected && Number(besuChainId) === CHAIN_ID_DEC && (
                            <button
                                onClick={() => {
                                    window.location.hash = "#/join";
                                }}
                                className="mt-6 w-full py-2 px-4 rounded-xl 
bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF] 
text-white font-semibold shadow-lg shadow-[#7F3DF1]/30 hover:opacity-90 transition"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                )}

                <p className="mt-6 text-sm text-center text-white/70">
                    Connected via {BESU_RPC_URL}
                </p>

                {connected && (
                    <div className="absolute inset-x-0 top-0 flex justify-center mt-2 animate-fadeIn">
                        <div className="bg-green-500/90 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                            ✅ Connected to Besu EduNet! Balance updates directly from RPC.
                        </div>
                    </div>
                )}
            </div>

            {/* 🏠 Back to Education Portal */}
            <div className="mt-10">
                <a
                    href="#/education"
                    className="inline-flex items-center gap-2 px-5 py-3 
bg-gradient-to-r from-[#33D6FF]/25 to-[#7F3DF1]/25 
hover:from-[#33D6FF]/35 hover:to-[#7F3DF1]/35
text-white/90 font-medium rounded-xl shadow-md border border-white/20 backdrop-blur-sm transition"
                >
                    <span>🏠</span> Back to Education Portal
                </a>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
        </div>
    );
}
