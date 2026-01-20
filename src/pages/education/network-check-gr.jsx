// src/pages/education/network-check-gr.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function NetworkCheckGR() {
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

    // Ανίχνευση του chainId από το RPC
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
                console.error("Αποτυχία ανίχνευσης chainId:", err);
            }
        }
        detectBesuChainId();
    }, []);

    // Αλλαγή/προσθήκη δικτύου στο MetaMask
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
                    console.error("Σφάλμα κατά την προσθήκη του Besu EduNet:", addError);
                    setError("Δεν ήταν δυνατή η προσθήκη του Besu EduNet στο MetaMask.");
                }
            } else {
                console.error("Σφάλμα αλλαγής δικτύου:", switchError);
                setError("Η αλλαγή δικτύου απορρίφθηκε ή απέτυχε.");
            }
            return false;
        }
    }

    // Ανάκτηση υπολοίπου από RPC
    async function fetchBalance(addr) {
        try {
            setRefreshing(true);
            const rpcProvider = new ethers.JsonRpcProvider(BESU_RPC_URL);
            const rawBalance = await rpcProvider.getBalance(addr);
            const formatted = ethers.formatEther(rawBalance);
            setBalance(formatted);
            setRefreshing(false);
        } catch (err) {
            console.error("Σφάλμα ανάκτησης υπολοίπου:", err);
            setError("Αποτυχία ενημέρωσης υπολοίπου.");
            setRefreshing(false);
        }
    }

    // Σύνδεση πορτοφολιού
    async function connectWallet() {
        try {
            if (!window.ethereum) {
                setError("Δεν εντοπίστηκε MetaMask. Εγκαταστήστε το πρώτα.");
                return;
            }

            const switched = await ensureBesuNetwork();
            if (!switched) return;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            const network = await provider.getNetwork();

            if (Number(network.chainId) !== CHAIN_ID_DEC) {
                setNetworkStatus(`⚠️ Λάθος δίκτυο (ID ${Number(network.chainId)}).`);
                setConnected(false);
            } else {
                setNetworkStatus("✅ Συνδεθήκατε επιτυχώς στο Besu EduNet");
                setConnected(true);
            }

            setAddress(userAddress);
            await fetchBalance(userAddress);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Η σύνδεση απέτυχε. Ελέγξτε το MetaMask και προσπαθήστε ξανά.");
            setConnected(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative overflow-hidden">
                {/* ΓΛΩΣΣΙΚΟ TOGGLE: αφαιρέθηκε προσωρινά */}

                <h1 className="text-2xl font-bold text-center mb-4">
                    🧠 Έλεγχος Συνδεσιμότητας στο Besu EduNet
                </h1>

                {/* Πληροφοριακό πλαίσιο */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-sm text-blue-800 dark:text-blue-200">
                    Χρησιμοποιήστε αυτό το εργαλείο για να επιβεβαιώσετε ότι είστε συνδεδεμένοι
                    στο <strong>Besu EduNet</strong> και για να ελέγξετε το υπόλοιπό σας σε <strong>{NATIVE_SYMBOL}</strong>.
                    <br />
                    Αν μόλις λάβατε tokens από το faucet, πατήστε <em>↻ Ανανέωση</em> για ενημέρωση.
                </div>

                <button
                    onClick={connectWallet}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                >
                    Σύνδεση Πορτοφολιού
                </button>

                {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}

                {besuChainId && (
                    <p className="mt-4 text-center text-sm text-gray-500">
                        Ανιχνεύθηκε Chain ID: {parseInt(besuChainId, 16)} ({besuChainId})
                    </p>
                )}

                {address && (
                    <div className="mt-6 space-y-3 text-sm sm:text-base">
                        <p><strong>Διεύθυνση:</strong> {address}</p>

                        <div className="flex items-center justify-between">
                            <p>
                                <strong>Υπόλοιπο:</strong> {balance} {NATIVE_SYMBOL}
                            </p>
                            <button
                                onClick={() => fetchBalance(address)}
                                disabled={refreshing}
                                className={`ml-2 px-3 py-1 text-sm rounded-md font-medium ${refreshing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                    } text-white transition`}
                            >
                                {refreshing ? "Ανανέωση..." : "↻ Ανανέωση"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 italic">
                            Αν το MetaMask δείχνει 0 {NATIVE_SYMBOL}, θεωρήστε αυτήν την τιμή ως το σωστό υπόλοιπο του δικτύου.
                        </p>

                        <p><strong>Κατάσταση:</strong> {networkStatus}</p>
                    </div>
                )}

                <p className="mt-6 text-sm text-center text-gray-500">
                    Συνδεδεμένο μέσω {BESU_RPC_URL}
                </p>

                {connected && (
                    <div className="absolute inset-x-0 top-0 flex justify-center mt-2 animate-fadeIn">
                        <div className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                            ✅ Συνδεθήκατε στο Besu EduNet! Το υπόλοιπο ενημερώνεται απευθείας από το RPC.
                        </div>
                    </div>
                )}
            </div>

            {/* Footer σημείωση (χωρίς home button) */}
            <p className="text-center text-xs text-gray-400 mt-10 mb-4">
                Αυτή η σελίδα αποτελεί μέρος της δοκιμαστικής έκδοσης του <strong>Web3Edu</strong> (Beta).
            </p>

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
