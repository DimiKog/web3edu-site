import PageShell from "../../components/PageShell.jsx";
import genesisBadgeImage from "./badges/genesis.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useIdentity } from "../../context/IdentityContext.jsx";

const texts = {
    en: {
        title: "Web3Edu Genesis Event",
        intro: "Participants of the first Web3Edu workshop can claim the Genesis Event Badge — a permanent on-chain proof of participation in the launch of the Web3Edu ecosystem.",
        badgeTitle: "Genesis Badge",
        badgeDesc: "This badge recognizes the early adopters who joined the first Web3Edu launch workshop.",
        date: "March 2026 • Web3Edu Genesis Workshop",
        contractLabel: "Contract:",
        explorer: "View badge contract on explorer",
        mint: "Mint Genesis Badge",
        minting: "Minting...",
        minted: "Badge Claimed",
        txPendingTitle: "Transaction Submitted",
        txPendingBody: "Approve in wallet and wait for on-chain confirmation.",
        txConfirmingTitle: "Confirming On-Chain",
        txConfirmingBody: "Your transaction is being confirmed. This can take a few seconds.",
        txSuccessTitle: "Badge Minted Successfully",
        txSuccessBody: "Your Genesis badge is now recorded on-chain.",
        redirecting: "Redirecting to dashboard...",
        txErrorTitle: "Mint Failed",
        viewTx: "View transaction",
        walletMissing: "MetaMask not detected",
        txSent: "Mint transaction sent:",
        txSuccess: "Genesis badge minted successfully!",
        errRejected: "Transaction rejected in wallet.",
        errInsufficientFunds: "Insufficient funds for gas fees.",
        errAlreadyClaimed: "This wallet has already claimed the Genesis badge.",
        errGeneric: "Mint failed. Please try again.",
        connectToMint: "Connect your wallet to mint your Genesis Badge.",
        aaConnectHint: "Connect wallet to mint your Genesis Badge",
    },
    gr: {
        title: "Web3Edu Genesis Εκδήλωση",
        intro: "Οι συμμετέχοντες στο πρώτο εργαστήριο Web3Edu μπορούν να αποκτήσουν το Genesis Event Badge — μια μόνιμη on‑chain απόδειξη συμμετοχής στην έναρξη του οικοσυστήματος Web3Edu.",
        badgeTitle: "Genesis Badge",
        badgeDesc: "Το badge αυτό αναγνωρίζει τους πρώτους συμμετέχοντες που έλαβαν μέρος στο πρώτο workshop του Web3Edu.",
        date: "Μάρτιος 2026 • Web3Edu Genesis Workshop",
        contractLabel: "Contract:",
        explorer: "Προβολή του contract στον explorer",
        mint: "Κάνε Mint το Genesis Badge",
        minting: "Γίνεται mint...",
        minted: "Το badge έχει γίνει claim",
        txPendingTitle: "Η συναλλαγή υποβλήθηκε",
        txPendingBody: "Επιβεβαίωσε στο wallet και περίμενε το on-chain confirmation.",
        txConfirmingTitle: "Γίνεται on-chain επιβεβαίωση",
        txConfirmingBody: "Η συναλλαγή επιβεβαιώνεται στο δίκτυο. Μπορεί να χρειαστούν μερικά δευτερόλεπτα.",
        txSuccessTitle: "Το badge έγινε mint με επιτυχία",
        txSuccessBody: "Το Genesis badge έχει πλέον καταγραφεί on-chain.",
        redirecting: "Μεταφορά στο dashboard...",
        txErrorTitle: "Το mint απέτυχε",
        viewTx: "Προβολή συναλλαγής",
        walletMissing: "Δεν βρέθηκε MetaMask",
        txSent: "Η συναλλαγή mint στάλθηκε:",
        txSuccess: "Το Genesis badge έγινε mint με επιτυχία!",
        errRejected: "Η συναλλαγή απορρίφθηκε στο wallet.",
        errInsufficientFunds: "Ανεπαρκές υπόλοιπο για gas fees.",
        errAlreadyClaimed: "Αυτό το wallet έχει ήδη κάνει claim το Genesis badge.",
        errGeneric: "Το mint απέτυχε. Δοκίμασε ξανά.",
        connectToMint: "Σύνδεσε το πορτοφόλι σου για να κάνεις mint το Genesis Badge.",
        aaConnectHint: "Σύνδεσε το πορτοφόλι για να κάνεις mint το Genesis Badge",
    }
};

export default function GenesisEvent() {
    const { isConnected, address } = useAccount();
    const { smartAccount } = useIdentity();
    const canMint = Boolean(isConnected && address);
    const location = useLocation();
    const navigate = useNavigate();
    const isGreekRoute =
        location.pathname.endsWith("-gr") ||
        (typeof window !== "undefined" && (window.location.hash || "").includes("-gr"));
    const t = texts[isGreekRoute ? "gr" : "en"];
    const [isMinting, setIsMinting] = useState(false);
    const [hasMinted, setHasMinted] = useState(false);
    const [mintStatus, setMintStatus] = useState("idle");
    const [txHash, setTxHash] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const confettiCanvasRef = useRef(null);

    const contractAddress = "0x1e9e1515a472aFf340b79dfd3c5b47D307632Fbc";

    const abi = [
        "function claim(uint256 eventId)"
    ];

    function getReadableMintError(err, tCopy) {
        const code = err?.code;
        const reason =
            String(
                err?.shortMessage ||
                err?.reason ||
                err?.message ||
                err?.error?.message ||
                ""
            ).toLowerCase();

        if (code === 4001 || reason.includes("user rejected")) {
            return tCopy.errRejected;
        }
        if (reason.includes("insufficient funds")) {
            return tCopy.errInsufficientFunds;
        }
        if (reason.includes("already claimed") || reason.includes("already minted")) {
            return tCopy.errAlreadyClaimed;
        }
        return tCopy.errGeneric;
    }

    async function mintGenesis() {
        if (isMinting) return;
        if (!canMint) return;
        try {
            if (!window.ethereum) {
                setMintStatus("error");
                setErrorMessage(t.walletMissing);
                return;
            }
            setIsMinting(true);
            setMintStatus("pending");
            setErrorMessage("");
            setTxHash("");

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();

            const contract = new ethers.Contract(contractAddress, abi, signer);

            const tx = await contract.claim(1);
            setTxHash(tx.hash);
            setMintStatus("confirming");

            await tx.wait();

            setHasMinted(true);
            setMintStatus("success");

        } catch (err) {
            console.error(err);
            setMintStatus("error");
            setErrorMessage(getReadableMintError(err, t));
        } finally {
            setIsMinting(false);
        }
    }

    useEffect(() => {
        if (mintStatus !== "success") return;

        const canvas = confettiCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId = 0;
        const durationMs = 2200;
        const startedAt = Date.now();
        const pieces = Array.from({ length: 110 }, () => ({
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * window.innerHeight * 0.35,
            r: Math.random() * 4 + 3,
            c: `hsl(${Math.random() * 360}, 90%, 62%)`,
            s: Math.random() * 2.2 + 1.1,
            a: Math.random() * (Math.PI * 2),
        }));

        const render = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pieces.forEach(p => {
                p.y += p.s;
                p.a += 0.02;
                p.x += Math.sin(p.a) * 0.6;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            if (Date.now() - startedAt < durationMs) {
                rafId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        render();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [mintStatus]);

    useEffect(() => {
        if (mintStatus !== "success") return;

        const timeoutId = setTimeout(() => {
            navigate(isGreekRoute ? "/dashboard-gr" : "/dashboard");
        }, 3200);

        return () => clearTimeout(timeoutId);
    }, [mintStatus, navigate, isGreekRoute]);

    return (
        <PageShell>
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
                <canvas ref={confettiCanvasRef} className="fixed inset-0 z-40 pointer-events-none" />

                <h1 className="text-4xl font-bold mb-4">
                    {t.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 max-w-xl mb-10">
                    {t.intro}
                </p>

                <div className="rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl p-8 max-w-md w-full">

                    <img
                        src={genesisBadgeImage}
                        alt="Web3Edu Genesis Badge"
                        className="w-40 mx-auto mb-6"
                    />

                    <h2 className="text-lg font-semibold mb-3">
                        {t.badgeTitle}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {t.badgeDesc}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                        📅 {t.date}
                    </p>

                    <div className="text-xs font-mono bg-black/10 dark:bg-white/10 p-3 rounded-lg mb-4 break-all">
                        {t.contractLabel}
                        0x1e9e1515a472aFf340b79dfd3c5b47D307632Fbc
                    </div>

                    <a
                        href="https://blockexplorer.dimikog.org/token/0x1e9e1515a472aFf340b79dfd3c5b47D307632Fbc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-block"
                    >
                        {t.explorer}
                    </a>

                    {!canMint ? (
                        <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-600/40 dark:bg-amber-950/30 dark:text-amber-100">
                            {smartAccount && !isConnected ? t.aaConnectHint : t.connectToMint}
                        </div>
                    ) : null}

                    <button
                        onClick={mintGenesis}
                        disabled={!canMint || isMinting || hasMinted}
                        className="
                        w-full py-3 rounded-xl
                        bg-gradient-to-r from-purple-500 to-indigo-500
                        text-white font-semibold
                        disabled:opacity-70 disabled:cursor-not-allowed
                    "
                    >
                        {isMinting ? t.minting : hasMinted ? t.minted : t.mint}
                    </button>

                    {mintStatus !== "idle" && (
                        <div
                            className={`mt-4 rounded-xl border p-4 text-left text-sm ${
                                mintStatus === "success"
                                    ? "border-emerald-300/60 bg-emerald-50/80 dark:border-emerald-700/50 dark:bg-emerald-900/20"
                                    : mintStatus === "error"
                                        ? "border-rose-300/60 bg-rose-50/80 dark:border-rose-700/50 dark:bg-rose-900/20"
                                        : "border-indigo-300/60 bg-indigo-50/80 dark:border-indigo-700/50 dark:bg-indigo-900/20"
                            }`}
                        >
                            {mintStatus === "pending" && (
                                <>
                                    <p className="font-semibold text-indigo-800 dark:text-indigo-200">
                                        {t.txPendingTitle}
                                    </p>
                                    <p className="mt-1 text-indigo-700 dark:text-indigo-300">{t.txPendingBody}</p>
                                </>
                            )}
                            {mintStatus === "confirming" && (
                                <>
                                    <p className="font-semibold text-indigo-800 dark:text-indigo-200">
                                        {t.txConfirmingTitle}
                                    </p>
                                    <p className="mt-1 text-indigo-700 dark:text-indigo-300">{t.txConfirmingBody}</p>
                                </>
                            )}
                            {mintStatus === "success" && (
                                <>
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                        {t.txSuccessTitle}
                                    </p>
                                    <p className="mt-1 text-emerald-700 dark:text-emerald-300">{t.txSuccessBody}</p>
                                    <p className="mt-2 text-xs font-medium text-emerald-700/90 dark:text-emerald-300/90">
                                        {t.redirecting}
                                    </p>
                                </>
                            )}
                            {mintStatus === "error" && (
                                <>
                                    <p className="font-semibold text-rose-800 dark:text-rose-200">
                                        {t.txErrorTitle}
                                    </p>
                                    <p className="mt-1 text-rose-700 dark:text-rose-300">{errorMessage || t.errGeneric}</p>
                                </>
                            )}

                            {txHash && (
                                <a
                                    href={`https://blockexplorer.dimikog.org/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-300 underline hover:opacity-80"
                                >
                                    {t.viewTx} ↗
                                </a>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </PageShell>
    );
}
