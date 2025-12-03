import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function SbtView() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!isConnected) {
            navigate("/join");
            return;
        }
        window.scrollTo(0, 0);
    }, [isConnected, navigate]);

    useEffect(() => {
        if (!address) return;
        const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";

        setLoading(true);
        setError("");
        fetch(`${BACKEND}/sbt/profile/${address}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProfile(data);
                // Store tier for navbar avatar
                if (data?.profile?.tier) {
                    localStorage.setItem("web3edu_tier", data.profile.tier);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch SBT profile:", err);
                setError("Could not load your SBT passport.");
                setLoading(false);
            });
    }, [address]);

    const shortAddr = shortAddress(address);

    const handleCopy = () => {
        if (!profile?.verifyUrl) return;
        navigator.clipboard
            .writeText(profile.verifyUrl)
            .catch(err => console.error("Clipboard error:", err));
    };

    const tier = profile?.profile?.tier;
    const xpPercent = profile?.profile?.xpPercent ?? 0;
    const remainingXp = profile?.profile?.remainingXp ?? 0;
    const lessonsCompleted = profile?.profile?.lessonsCompleted ?? 0;
    const badges = profile?.profile?.badges ?? [];
    const lessons = profile?.lessons ?? {};
    const verifyUrl = profile?.verifyUrl ?? "";

    return (
        <PageShell>
            <div className="min-h-screen flex flex-col items-center px-2 sm:px-6 py-16
                bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/20 to-[#020617] text-white">

                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[18%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/25 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/20 blur-[130px] rounded-full"></div>
                </div>

                <div className="relative z-10 mb-8 text-center max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
                        Web3Edu Identity Passport
                    </h1>
                    <p className="text-white/70 text-xs sm:text-sm md:text-base">
                        Your non-transferable Soulbound Identity on Web3Edu Edu-Net.
                    </p>
                </div>

                {loading && (
                    <p className="relative z-10 text-white/70">Loading your SBT passport…</p>
                )}
                {error && !loading && (
                    <p className="relative z-10 text-red-300">{error}</p>
                )}

                {!loading && !error && profile && (
                    <div
                        className="
                            relative z-10 max-w-3xl w-full 
                            rounded-3xl border border-indigo-300/40 dark:border-indigo-700/30
                            shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                            bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
                            dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
                            backdrop-blur-2xl p-6 sm:p-8
                            text-slate-800 dark:text-slate-200
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl ring-2 ring-indigo-300 dark:ring-indigo-700/50"
                                style={generateAvatarStyle(address, tier)}
                            >
                                <AddressIdenticon address={address} />
                            </div>

                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                                    Soulbound Identity
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {profile.sbt?.name ?? "Web3Edu Identity SBT"}
                                </p>
                                <p className="text-xs text-slate-900 dark:text-white mt-1 font-mono">
                                    Wallet: {shortAddr}
                                </p>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="rounded-2xl border border-indigo-200/40 dark:border-indigo-800/40
                            bg-gradient-to-br from-white/90 to-indigo-100/40
                            dark:bg-gradient-to-br dark:from-slate-900/70 dark:via-indigo-900/30 dark:to-slate-900/60
                            shadow-md backdrop-blur-xl p-5 mb-6
                            text-slate-700 dark:text-slate-200
                        ">
                            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-300 mb-4">
                                Identity Details
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Token Type</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Soulbound (non‑transferable)</p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Standard</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">ERC‑721 (SBT)</p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Wallet Address</p>
                                    <p className="font-mono text-xs text-slate-900 dark:text-slate-100 break-all">{address}</p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Token ID</p>
                                    <p className="font-mono text-xs text-slate-900 dark:text-slate-100">{profile.tokenId ?? "Not assigned"}</p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Tier</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{tier ?? "Explorer"}</p>
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Badges</p>
                                    {badges.length > 0 ? (
                                        <ul className="mt-1 flex flex-wrap gap-1">
                                            {badges.map((b, i) => (
                                                <li
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-full text-[11px] bg-indigo-200/40 dark:bg-indigo-900/40 border border-indigo-300/40 dark:border-indigo-700/40 text-slate-900 dark:text-slate-100"
                                                >
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-400">No badges yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Verification */}
                        <div className="rounded-2xl border border-indigo-200/40 dark:border-indigo-800/40
                            bg-gradient-to-br from-white/90 via-indigo-50/40 to-slate-100/40
                            dark:bg-gradient-to-br dark:from-slate-900/70 dark:via-indigo-900/30 dark:to-slate-900/60
                            shadow-md backdrop-blur-xl p-5 mb-4
                            text-slate-700 dark:text-slate-200
                        ">
                            <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-300 mb-4">
                                Verification
                            </h2>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {verifyUrl && (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                            verifyUrl
                                        )}&size=140x140`}
                                        alt="Verification QR"
                                        className="rounded-xl border border-indigo-300/50 dark:border-indigo-700/50 bg-white dark:bg-slate-900/40 p-2 shadow"
                                    />
                                )}

                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                        Verification Link
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                                        Scan the QR or copy the URL to verify your identity.
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 rounded-lg bg-indigo-100/60 dark:bg-indigo-900/40 border border-indigo-300/40 dark:border-indigo-700/40 text-xs font-mono max-w-[260px] overflow-hidden text-ellipsis text-slate-900 dark:text-slate-100">
                                            {verifyUrl}
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            disabled={!verifyUrl}
                                            className="px-3 py-1 rounded-lg bg-indigo-200/60 dark:bg-indigo-800/40 hover:bg-indigo-300/70 dark:hover:bg-indigo-700/60 text-xs font-semibold transition-colors disabled:opacity-50"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-indigo-700/70 dark:text-indigo-300/70 mt-2">
                            <p>Issued on Web3Edu Edu‑Net</p>
                            <p className="italic">Non‑transferable Soulbound Token</p>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}