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

    const BESU_RPC_URL = "https://rpc.dimikog.org/rpc";
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative overflow-hidden">
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

                <h1 className="text-2xl font-bold text-center mb-4">
                    🧠 Besu EduNet Connectivity Check
                </h1>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-sm text-blue-800 dark:text-blue-200">
                    Use this tool to confirm you’re connected to <strong>Besu EduNet</strong>
                    and to check your balance in <strong>{NATIVE_SYMBOL}</strong>.
                    <br />
                    If you’ve just received tokens from the faucet, click <em>↻ Refresh</em> to update.
                </div>

                <button
                    onClick={connectWallet}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                >
                    Connect Wallet
                </button>

                {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}

                {besuChainId && (
                    <p className="mt-4 text-center text-sm text-gray-500">
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
                                    : "bg-green-600 hover:bg-green-700"
                                    } text-white transition`}
                            >
                                {refreshing ? "Refreshing..." : "↻ Refresh"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 italic">
                            If MetaMask shows 0 {NATIVE_SYMBOL}, treat this value as the correct network balance.
                        </p>

                        <p><strong>Status:</strong> {networkStatus}</p>
                    </div>
                )}

                <p className="mt-6 text-sm text-center text-gray-500">
                    Connected via {BESU_RPC_URL}
                </p>

                {connected && (
                    <div className="absolute inset-x-0 top-0 flex justify-center mt-2 animate-fadeIn">
                        <div className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                            ✅ Connected to Besu EduNet! Balance updates directly from RPC.
                        </div>
                    </div>
                )}
            </div>

            {/* 🏠 Back to Education Portal */}
            <div className="mt-10">
                <a
                    href="#/education"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg shadow-md transition"
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
