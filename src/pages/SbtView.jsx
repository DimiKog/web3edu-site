import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    shortAddress
} from "../components/identity-ui.jsx";
import { QRCodeSVG } from "qrcode.react";
import identityIcon from "../assets/icons/identity-icon.webp";

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
        fetch(`${BACKEND}/web3sbt/resolve/${address}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProfile(data);
                // Store tier for navbar avatar
                if (data?.metadata?.tier) {
                    localStorage.setItem("web3edu_tier", data.metadata.tier);
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
        if (!verifyUrl) return;
        navigator.clipboard
            .writeText(verifyUrl)
            .catch(err => console.error("Clipboard error:", err));
    };

    const tier = profile?.metadata?.tier;
    const badges = profile?.metadata?.badges ?? [];
    const tokenId = (() => {
        const candidates = [
            profile?.tokenId,
            profile?.token_id,
            profile?.tokenID,
            profile?.metadata?.tokenId,
            profile?.metadata?.token_id,
            profile?.profile?.tokenId,
            profile?.profile?.token_id,
            profile?.metadata?.metadata?.tokenId,
            profile?.metadata?.metadata?.token_id,
            profile?.profile?.metadata?.tokenId,
            profile?.profile?.metadata?.token_id
        ];
        for (const candidate of candidates) {
            if (candidate !== null && candidate !== undefined && candidate !== "") {
                return candidate;
            }
        }
        return null;
    })();

    const PUBLIC_SITE = import.meta.env.VITE_PUBLIC_SITE_URL
        ?? "https://web3edu.dimikog.org";

    // Detect local development → Vite uses hash routing (#/verify)
    const isLocalhost = typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1");

    const verifyBase =
        import.meta.env.VITE_VERIFY_BASE ??
        (isLocalhost ? window.location.origin : PUBLIC_SITE);

    // Always use the hash router version:
    const verifyUrl = address ? `${verifyBase}/#/verify/${address}` : "";

    return (
        <PageShell>
            <div className="min-h-screen flex flex-col items-center px-2 sm:px-6 py-16
                bg-gradient-to-br from-[#F5F2FF] via-[#EDE7FF] to-[#F8F6FF] dark:from-[#090C14] dark:via-[#120A1E] dark:to-[#020617] text-white">

                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[18%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/25 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/20 blur-[130px] rounded-full"></div>
                </div>

                <div className="relative z-10 mb-8 text-center max-w-2xl">
                    <h1
                        className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm"
                    >
                        Web3Edu Identity Passport
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                        Issued to: {profile?.profile?.name ?? "Web3Edu Learner"}
                    </p>
                    <p
                        className="mt-2 text-center text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
                    >
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

                        {/* Paper Texture */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.06] mix-blend-overlay 
    bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                        </div>

                        {/* Founder Ribbon */}
                        {profile?.profile?.founder && (
                            <div className="absolute -top-4 -right-4 z-30 scale-110">
                                <div
                                    className="
                                        relative px-4 py-1.5 rounded-lg border border-white/20 shadow-xl
                                        text-white text-[11px] font-bold tracking-wide
                                        bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500
                                        animate-founder-shimmer
                                    "
                                >
                                    ⭐ FOUNDER ⭐
                                </div>
                            </div>
                        )}

                        {/* Header (Upgraded) */}
                        <div className="relative flex items-center gap-6 mb-8">

                            {/* Avatar with soft glow */}
                            <div className="relative">
                                <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full"></div>

                                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl 
            ring-2 ring-indigo-300/60 dark:ring-indigo-700/60 bg-black/10">
                                    <img src={
                                            profile?.profile?.avatar && profile.profile.avatar.trim() !== ""
                                                ? profile.profile.avatar
                                                : profile?.profile?.image && profile.profile.image.trim() !== ""
                                                    ? profile.profile.image
                                                    : identityIcon
                                        }
                                        alt="Identity avatar"
                                        className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            </div>

                            {/* Name + Tier */}
                            <div className="flex-1">
                                <p className="text-[11px] uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                                    Soulbound Identity
                                </p>

                                <div className="flex items-center gap-3 flex-wrap mt-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                        {profile?.profile?.name ?? "Web3Edu Identity SBT"}
                                    </h1>

                                    {/* Tier Badge */}
                                    {tier && (
                                        <span className="
                                            px-3 py-0.5 rounded-full text-[11px] font-bold
                                            bg-gradient-to-r from-indigo-300/50 to-indigo-500/40
                                            dark:bg-gradient-to-r dark:from-indigo-700/50 dark:to-indigo-900/40
                                            border border-indigo-400/40 dark:border-indigo-800/50
                                            text-indigo-800 dark:text-indigo-200
                                        ">
                                            {tier}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">
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
                                    <p className="font-mono text-xs text-slate-900 dark:text-slate-100">
                                        {tokenId ?? "Not assigned"}
                                        {profile?.profile?.edition && (
                                            <span
                                                className="
            inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium
            bg-gradient-to-r from-fuchsia-100 to-fuchsia-200
            dark:from-fuchsia-900/40 dark:to-fuchsia-800/40
            border border-fuchsia-300/40 dark:border-fuchsia-700/40
            text-slate-700 dark:text-slate-200
        "
                                            >
                                                {profile.profile.edition}
                                            </span>
                                        )}
                                    </p>
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
                                {/* Soft Web3 Identity Chips */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {/* Tier Chip */}
                                    {tier && (
                                        <span
                                            className="
                px-3 py-1 rounded-full text-xs font-medium
                bg-gradient-to-r from-blue-100 to-blue-200
                dark:from-blue-900/40 dark:to-blue-800/40
                border border-blue-300/40 dark:border-blue-700/40
                text-blue-900 dark:text-blue-200
            "
                                        >
                                            Tier: {tier}
                                        </span>
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

                            <div className="flex flex-col sm:flex-row items-center gap-6">

                                {/* QR Code Card */}
                                {verifyUrl && (
                                    <div className="
                                        relative p-4 rounded-2xl shadow-lg
                                        bg-gradient-to-br from-white via-indigo-50 to-slate-100
                                        dark:bg-gradient-to-br dark:from-[#111827] dark:via-[#1f2758]/40 dark:to-[#111827]/70
                                        border border-indigo-200/50 dark:border-indigo-700/40
                                        backdrop-blur-xl
                                    ">
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-indigo-400/40 dark:text-indigo-300/30 text-sm font-semibold tracking-widest rotate-[-20deg]">
                                                WEB3EDU VERIFIED
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <QRCodeSVG
                                                value={verifyUrl}
                                                size={160}
                                                bgColor={window.matchMedia("(prefers-color-scheme: dark)").matches ? "#ffffff" : "transparent"}
                                                fgColor={window.matchMedia("(prefers-color-scheme: dark)").matches ? "#000000" : "#1e1b4b"}
                                                level="M"
                                                includeMargin={false}
                                                className="rounded-xl shadow-md w-40 h-40 p-2 
               bg-white dark:bg-white"   // important for dark mode readability
                                            />
                                        </div>

                                        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2">
                                            Scan to verify identity
                                        </p>
                                    </div>
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

                        {/* Verification Seal */}
                        <div className="mt-6 mb-3 flex justify-center">
                            <div className="
                            px-4 py-2 rounded-xl
                            bg-indigo-100/60 dark:bg-indigo-900/30 
                            border border-indigo-300/40 dark:border-indigo-700/40
                            shadow-sm backdrop-blur-md
                            text-[11px] font-semibold text-indigo-700 dark:text-indigo-300
                        ">
                                ✓ Verified on Web3Edu Edu-Net (QBFT • chainId 424242)
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
