import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const COPY = {
    en: {
        claimButton: "✅ Claim completion",
        claimingButton: "Signing…",
        successMessage: "✔ Completion recorded successfully",
        checkingStatus: "Checking completion status…",
        completedOn: "Completed on:",
        walletNotConnectedError: "Wallet not connected",
        labIdMissingError: "Lab ID missing",
        backendError: "Failed to record completion",
        backToOverview: "⬅ Back to lab overview",
    },
    gr: {
        claimButton: "✅ Δήλωση Ολοκλήρωσης",
        claimingButton: "Υπογραφή…",
        successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς",
        checkingStatus: "Έλεγχος κατάστασης ολοκλήρωσης…",
        completedOn: "Ολοκληρώθηκε στις:",
        walletNotConnectedError: "Το πορτοφόλι δεν είναι συνδεδεμένο",
        labIdMissingError: "Λείπει το Lab ID",
        backendError: "Αποτυχία καταγραφής ολοκλήρωσης",
        backToOverview: "⬅ Επιστροφή στην επισκόπηση",
    },
};

export default function LabCompletionClaim({
    labId,
    language = "en",
    backHref = null,
    backLabel = null,
}) {
    const labels = COPY[language] || COPY.en;
    const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";

    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [error, setError] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completedAt, setCompletedAt] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (!isConnected || !address || !labId) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                const res = await fetch(`${BACKEND}/labs/status?address=${address}&labId=${labId}`);
                if (!res.ok) return;

                const data = await res.json();
                if (data.completed === true) {
                    setClaimed(true);
                    setCompletedAt(data.completedAt || null);
                }
            } catch (err) {
                console.warn("Failed to restore lab completion state", err);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkCompletion();
    }, [BACKEND, isConnected, address, labId]);

    useEffect(() => {
        if (!showCelebration) return undefined;

        const durationMs = 1800;
        const pieceCount = 120;
        const start = Date.now();
        const colors = ["#22c55e", "#38bdf8", "#a78bfa", "#f59e0b", "#f43f5e"];
        const particles = Array.from({ length: pieceCount }, () => ({
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * window.innerHeight * 0.4,
            r: 2 + Math.random() * 5,
            vy: 2 + Math.random() * 3,
            vx: -1.25 + Math.random() * 2.5,
            tilt: Math.random() * Math.PI * 2,
            spin: -0.1 + Math.random() * 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));

        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "90";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            canvas.remove();
            setShowCelebration(false);
            return undefined;
        }

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        let rafId = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx + Math.sin(p.tilt) * 0.5;
                p.y += p.vy;
                p.tilt += p.spin;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.r, p.r * 0.65, p.tilt, 0, Math.PI * 2);
                ctx.fill();
            });

            if (Date.now() - start < durationMs) {
                rafId = requestAnimationFrame(animate);
            } else {
                setShowCelebration(false);
            }
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            canvas.remove();
        };
    }, [showCelebration]);

    const handleClaimCompletion = async () => {
        if (claimed) return;

        if (!isConnected || !address) {
            setError(labels.walletNotConnectedError);
            return;
        }

        if (!labId) {
            setError(labels.labIdMissingError);
            return;
        }

        setClaiming(true);
        setError(null);

        try {
            const timestamp = new Date().toISOString();
            const message = `I confirm completion of Web3Edu Lab\nLab ID: ${labId}\nAddress: ${address}\nTimestamp: ${timestamp}`;
            const signature = await signMessageAsync({ message });

            const res = await fetch(`${BACKEND}/labs/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": import.meta.env.VITE_XP_SECRET,
                },
                body: JSON.stringify({
                    address,
                    labId,
                    message,
                    signature,
                }),
            });

            if (!res.ok) throw new Error("Backend rejected completion");

            setClaimed(true);
            setCompletedAt(new Date().toISOString());
            setShowCelebration(true);
        } catch (err) {
            console.error(err);
            setError(labels.backendError);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="mt-4">
            {checkingStatus && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{labels.checkingStatus}</p>
            )}

            {!claimed && !checkingStatus && (
                <button
                    onClick={handleClaimCompletion}
                    disabled={claiming}
                    className={`px-5 py-2 rounded-md font-semibold text-white transition ${claiming
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {claiming ? labels.claimingButton : labels.claimButton}
                </button>
            )}

            {claimed && (
                <div className="rounded-xl border border-green-300/60 dark:border-green-700/40 bg-green-50 dark:bg-green-900/20 p-4">
                    <p className="font-semibold text-green-700 dark:text-green-400">{labels.successMessage}</p>
                    {completedAt && (
                        <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                            {labels.completedOn} {new Date(completedAt).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {backHref && (
                <a
                    href={backHref}
                    className="inline-block mt-4 px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-800"
                >
                    {backLabel || labels.backToOverview}
                </a>
            )}
        </div>
    );
}
