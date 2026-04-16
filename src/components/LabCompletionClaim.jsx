import { useEffect, useMemo, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import FeedbackModal from "./FeedbackModal";
import { useIdentity } from "../context/IdentityContext.jsx";
import {
    buildLabsStatusUrl,
    resolveReadOwnerQueryParam,
    getWeb3eduBackendUrl,
} from "../lib/web3eduBackend.js";
import { getLabsStatusReadIdentity, postLabsStart } from "../utils/labWriteApi.js";
import { getOwnerWallet } from "../utils/aaIdentity.js";

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
    labTitle = null,
    claimButtonLabel = null,
    claimingButtonLabel = null,
}) {
    const labels = COPY[language] || COPY.en;
    const BACKEND = getWeb3eduBackendUrl();

    const { address, isConnected } = useAccount();
    const { smartAccount } = useIdentity();
    const { identityAddress } = useMemo(
        () => getLabsStatusReadIdentity({ smartAccount }),
        [smartAccount]
    );
    const statusOwner = useMemo(
        () => resolveReadOwnerQueryParam(smartAccount, address, null),
        [smartAccount, address]
    );
    const { signMessageAsync } = useSignMessage();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [error, setError] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [completedAt, setCompletedAt] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        if (!identityAddress || !labId) {
            setCheckingStatus(false);
            return;
        }

        const checkCompletion = async () => {
            try {
                // eslint-disable-next-line no-console -- AA / backend integration debug
                console.log("API CALL", { identityAddress, statusOwner });
                const res = await fetch(
                    buildLabsStatusUrl(identityAddress, labId, statusOwner)
                );
                if (!res.ok) return;

                const data = await res.json();
                if (data.completed === true) {
                    setClaimed(true);
                    setCompletedAt(data.completedAt || null);
                }
            } catch (err) {
                // eslint-disable-next-line no-console -- non-fatal status restore
                console.warn("Failed to restore lab completion state", err);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkCompletion();
    }, [identityAddress, statusOwner, labId]);

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

    useEffect(() => {
        if (checkingStatus || !claimed || !labId) return;
        if (!address && !statusOwner) return;

        const submitted = localStorage.getItem(`feedback_${labId}`) === "true";
        const prompted = localStorage.getItem(`feedback_prompted_${labId}`) === "true";
        if (submitted || prompted) return;

        setShowFeedback(true);
    }, [checkingStatus, claimed, labId, address, statusOwner]);

    const handleClaimCompletion = async () => {
        if (claimed) return;

        if (!smartAccount) {
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
            const startRes = await postLabsStart({
                apiBase: BACKEND,
                smartAccount,
                address,
                labId,
            });
            if (!startRes.ok) {
                throw new Error("Could not register lab start");
            }

            const timestamp = new Date().toISOString();
            const useEoaSigner = isConnected && !!address;
            const messageSigner = useEoaSigner ? address : getOwnerWallet().address;
            const message = `I confirm completion of Web3Edu Lab\nLab ID: ${labId}\nAddress: ${messageSigner}\nTimestamp: ${timestamp}`;

            let signature;
            if (isConnected && address) {
                signature = await signMessageAsync({ message });
            } else {
                const wallet = getOwnerWallet();
                signature = await wallet.signMessage(message);
            }

            const res = await fetch(`${BACKEND}/labs/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": import.meta.env.VITE_XP_SECRET,
                },
                body: JSON.stringify({
                    wallet: smartAccount,
                    owner: address ?? null,
                    labId,
                    message,
                    signature,
                }),
            });

            const completePayload = await res.json().catch(() => ({}));
            if (
                completePayload?.identityKey != null &&
                completePayload?.identityKey !== undefined
            ) {
                // eslint-disable-next-line no-console -- backend integration diagnostic
                console.log("LAB IDENTITY KEY", completePayload.identityKey);
            }

            if (!res.ok) {
                // eslint-disable-next-line no-console -- lab complete error visibility
                console.error("LAB COMPLETE ERROR RESPONSE", completePayload);
                throw new Error(
                    completePayload?.error || "Backend rejected completion"
                );
            }

            setClaimed(true);
            setCompletedAt(new Date().toISOString());
            setShowCelebration(true);
            setShowFeedback(true);
        } catch (err) {
            console.error(err);
            setError(err?.message || labels.backendError);
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
                    {claiming
                        ? (claimingButtonLabel || labels.claimingButton)
                        : (claimButtonLabel || labels.claimButton)}
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

            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => {
                    if (labId) {
                        localStorage.setItem(`feedback_prompted_${labId}`, "true");
                    }
                    setShowFeedback(false);
                }}
                labId={labId}
                labTitle={labTitle}
                language={language}
                submitterAddressOverride={address ?? statusOwner}
                onSubmit={async (feedback) => {
                    const res = await fetch(`${BACKEND}/feedback`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(feedback),
                    });
                    if (!res.ok) {
                        throw new Error(`Feedback request failed with status ${res.status}`);
                    }
                }}
            />
        </div>
    );
}
