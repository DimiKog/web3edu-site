import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function VerifyIdentityGR() {
    const { address } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!address) {
            setError("Μη έγκυρη διεύθυνση.");
            setLoading(false);
            return;
        }

        const BACKEND =
            import.meta.env.VITE_BACKEND_URL ??
            "https://web3edu-api.dimikog.org";

        setLoading(true);
        setError("");

        fetch(`${BACKEND}/sbt/verify/${address}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Verify page error:", err);
                setError("Αδυναμία φόρτωσης των δεδομένων SBT.");
                setLoading(false);
            });
    }, [address]);

    const tier = profile?.profile?.tier;
    const xpPercent = profile?.profile?.xpPercent ?? 0;
    const remainingXp = profile?.profile?.remainingXp ?? 0;
    const lessonsCompleted = profile?.profile?.lessonsCompleted ?? 0;
    const badges = profile?.profile?.badges ?? [];
    const verifyUrl =
        profile?.verifyUrl ??
        window.location.href;

    const tokenId = profile?.tokenId ?? null;

    const shortAddr = shortAddress(address);

    return (
        <PageShell>
            <div className="min-h-screen flex flex-col items-center px-3 sm:px-6 py-16
                bg-gradient-to-br from-[#0a0f1f] via-[#0d1224] via-[#1a2a4a]/20 to-[#050910] text-white border-t-4 border-blue-800/80 relative">

                <div className="absolute top-0 left-0 w-full text-center py-2 bg-blue-900/40 text-blue-200 text-xs tracking-widest z-20 border-b border-blue-700/40">
                    ΛΕΙΤΟΥΡΓΙΑ ΕΠΑΛΗΘΕΥΣΗΣ
                </div>

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/25 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/20 blur-[130px] rounded-full"></div>
                </div>

                <div className="relative z-10 mb-8 text-center max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                        Επαλήθευση Ταυτότητας Web3Edu
                    </h1>
                    <p className="text-white/70 text-sm sm:text-base">
                        Δημόσια επαλήθευση ενός Soulbound Identity Token.
                    </p>
                </div>

                {loading && (
                    <p className="relative z-10 text-white/70">Φόρτωση ταυτότητας…</p>
                )}

                {error && !loading && (
                    <p className="relative z-10 text-red-300">{error}</p>
                )}

                {!loading && !error && profile && (
                    <div
                        className="
                            relative z-10 max-w-5xl w-full print:p-0 print:shadow-none print:bg-white print:text-black print:border-none
                            rounded-3xl border border-teal-200/20 
                            shadow-[0_20px_60px_rgba(0,0,0,0.65)]
                            bg-gradient-to-br from-[#1f2937] via-[#020617] to-[#020617]
                            p-4 sm:p-6 md:p-10
                            overflow-hidden
                        "
                    >
                        {/* MOBILE PASSPORT */}
                        <div className="md:hidden block relative rounded-xl border border-white/20 bg-[#0e1422] p-4 mx-auto w-full shadow-lg">
                            <div className="absolute top-2 right-2 w-10 h-10 opacity-70">
                                <img
                                    src="/stamp-mini.svg"
                                    alt="seal"
                                    className="w-full h-full object-contain pointer-events-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={generateAvatarStyle(address, tier)}>
                                    <AddressIdenticon address={address} />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Soulbound Identity</p>
                                    <p className="text-base font-semibold">{profile.sbt?.name ?? "Web3Edu Identity"}</p>
                                    <p className="text-[10px] text-white/50 font-mono">{shortAddr}</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Επίπεδο</p>
                                <p className="text-sm font-semibold flex items-center gap-1">
                                    {tier === "Explorer" && <ExplorerIcon />}
                                    {tier === "Builder" && <BuilderIcon />}
                                    {tier === "Architect" && <ArchitectIcon />}
                                    {tier}
                                </p>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Πρόοδος XP</p>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]" style={{ width: `${xpPercent}%` }}></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="text-[10px] text-white/40 uppercase">Token ID</p>
                                <p className="text-xs font-mono">{tokenId !== null ? tokenId : "Κανένα"}</p>
                            </div>

                            <div className="mt-4">
                                {verifyUrl && (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(verifyUrl)}&size=100x100`}
                                        alt="QR"
                                        className="rounded-lg border border-white/20 bg-white/5 p-1 mx-auto"
                                    />
                                )}
                                <p className="text-center text-[10px] text-white/50 mt-2">Σάρωση για επαλήθευση</p>
                            </div>
                        </div>

                        {/* DESKTOP PASSPORT CARD */}
                        <div className="hidden md:block">
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 text-6xl font-bold text-white select-none">ΔΗΜΟΣΙΑ ΕΠΑΛΗΘΕΥΣΗ</div>
                            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-20 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-40 blur-xl" />

                            {/* Header */}
                            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={
                                            "relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl " +
                                            (tier === "Architect"
                                                ? "animate-pulse"
                                                : tier === "Builder"
                                                    ? "ring-2 ring-[#33D6FF]/70"
                                                    : "ring-2 ring-[#7F3DF1]/60")
                                        }
                                        style={generateAvatarStyle(address, tier)}
                                    >
                                        <AddressIdenticon address={address} />
                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/40 flex items-center justify-center">
                                            {tier === "Explorer" && <ExplorerIcon />}
                                            {tier === "Builder" && <BuilderIcon />}
                                            {tier === "Architect" && <ArchitectIcon />}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-[0.18em] text-white/50">Soulbound Identity</p>
                                        <p className="text-xl font-semibold mt-1">{profile.sbt?.name ?? "Web3Edu Identity SBT"}</p>
                                        <p className="text-xs text-white/60 mt-1">
                                            Διεύθυνση: <span className="font-mono">{shortAddr}</span>
                                        </p>
                                    </div>
                                </div>

                                {tier && (
                                    <div className="flex flex-col items-center md:items-end gap-2">
                                        <span
                                            className={
                                                "px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md " +
                                                (tier === "Architect"
                                                    ? "bg-yellow-300/20 border-yellow-300/40"
                                                    : "bg-white/10 border-white/20")
                                            }
                                        >
                                            {tier === "Explorer" && <ExplorerIcon />}
                                            {tier === "Builder" && <BuilderIcon />}
                                            {tier === "Architect" && <ArchitectIcon />}
                                            {tier}
                                        </span>

                                        <p className="text-xs text-white/60">XP: {profile.profile?.xp ?? 0} • Μαθήματα: {lessonsCompleted}</p>
                                    </div>
                                )}
                            </div>

                            {/* MAIN SINGLE-COLUMN PASSPORT (Mirrored from ENG) */}
                            <div className="mt-6">
                                <div
                                    className="
                                        relative rounded-2xl border border-yellow-900/30
                                        bg-[#f5f0e6]/95 text-slate-900
                                        px-4 py-5 shadow-inner
                                    "
                                >
                                    <div
                                        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-[0.04] text-[110px] font-extrabold tracking-widest"
                                        style={{ color: '#444' }}
                                    >
                                        VERIFIED
                                    </div>

                                    <div className="relative space-y-3 text-sm">
                                        <p className="font-semibold tracking-wide text-xs text-slate-700 uppercase">
                                            Στοιχεία Ταυτότητας
                                        </p>

                                        <div>
                                            <p className="text-[11px] text-slate-600 uppercase">Όνομα</p>
                                            <p className="font-semibold">{profile.sbt?.name ?? 'Web3Edu Identity SBT'}</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-600 uppercase">Πρότυπο Token</p>
                                            <p className="font-medium text-sm">ERC‑721 SBT</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-600 uppercase">Διεύθυνση Wallet</p>
                                            <p className="font-mono text-xs break-all">{address}</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-600 uppercase">Token ID</p>
                                            <p className="font-mono text-xs break-all">
                                                {tokenId !== null ? tokenId : 'Κανένα'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-600 uppercase">Badges</p>
                                            {badges.length > 0 ? (
                                                <ul className="mt-1 flex flex-wrap gap-1">
                                                    {badges.map((b, i) => (
                                                        <li
                                                            key={i}
                                                            className="px-2 py-0.5 rounded-full text-[11px] bg-slate-900/10 border border-slate-500/30"
                                                        >
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-[11px] text-slate-500">Δεν υπάρχουν badges.</p>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-[11px] text-slate-600 uppercase mb-1">Πρόοδος XP</p>
                                            <div className="w-full h-2 rounded-full bg-slate-300/70 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#7F3DF1] via-[#9A5CFF] to-[#33D6FF]"
                                                    style={{ width: `${xpPercent}%` }}
                                                ></div>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-700">
                                                XP: <span className="font-semibold">{profile.profile?.xp ?? 0}</span>
                                                {remainingXp > 0 && (
                                                    <span className="text-slate-500"> • {remainingXp} XP μέχρι το επόμενο επίπεδο</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Seal + QR horizontally aligned (same as ENG) */}
                                    <div className="absolute top-6 right-10 flex flex-row items-start gap-14 max-w-none">
                                        {/* Seal */}
                                        <div className="w-44 h-44 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center">
                                            <svg viewBox="0 0 120 120" className="w-full h-full">
                                                <defs>
                                                    <radialGradient id="sealInner" cx="50%" cy="35%" r="60%">
                                                        <stop offset="0%" stopColor="#e5f4ff" stopOpacity="0.95" />
                                                        <stop offset="45%" stopColor="#1f2937" stopOpacity="0.9" />
                                                        <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                                                    </radialGradient>
                                                    <linearGradient id="sealRing" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#38bdf8" />
                                                        <stop offset="45%" stopColor="#6366f1" />
                                                        <stop offset="100%" stopColor="#fbbf24" />
                                                    </linearGradient>
                                                    <radialGradient id="sealHighlight" cx="30%" cy="0%" r="70%">
                                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                                        <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
                                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                                    </radialGradient>
                                                    <path id="sealCirclePath"
                                                        d="M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100" />
                                                </defs>
                                                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sealRing)" strokeWidth="4"
                                                    strokeDasharray="2 5" opacity="0.9" />
                                                <circle cx="60" cy="60" r="56" fill="none" stroke="#0f172a" strokeWidth="3"
                                                    opacity="0.35" />
                                                <circle cx="60" cy="60" r="40" fill="url(#sealInner)"
                                                    stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
                                                <ellipse cx="60" cy="40" rx="30" ry="14" fill="url(#sealHighlight)" />

                                                <text fontSize="6" letterSpacing="6" fill="rgba(0,0,0,0.55)">
                                                    <textPath href="#sealCirclePath" startOffset="50%" textAnchor="middle">
                                                        WEB3EDU VERIFIED • SBT AUTHORIZED • WEB3EDU VERIFIED • SBT AUTHORIZED •
                                                    </textPath>
                                                </text>

                                                <g transform="translate(60 60)">
                                                    <path d="M0 -22 L14 -14 V0 C14 11 6.5 23 0 25 C-6.5 23 -14 11 -14 0 V-14 Z"
                                                        fill="#0b1120"
                                                        stroke="rgba(148,163,184,0.9)"
                                                        strokeWidth="1.3"
                                                        strokeLinejoin="round" />
                                                    <path d="M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z"
                                                        fill="#38bdf8" opacity="0.96" />
                                                    <path d="M-3 -4 L-0.5 -1 L4 -7"
                                                        fill="none"
                                                        stroke="#e0f2fe"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                </g>

                                                <circle cx="60" cy="60" r="40" fill="none"
                                                    stroke="rgba(15,23,42,0.75)"
                                                    strokeWidth="3" opacity="0.9" />
                                            </svg>
                                            <p className="text-[10px] text-slate-600 mt-1 text-center leading-tight">ΣΦΡΑΓΙΔΑ WEB3EDU</p>
                                        </div>

                                        <div className="w-px h-40 bg-slate-400/40 mx-4"></div>

                                        {/* QR */}
                                        {verifyUrl && (
                                            <div className="flex flex-col items-center ml-4">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                                        verifyUrl
                                                    )}&size=180x180`}
                                                    alt="QR"
                                                    className="rounded-xl border border-slate-400/40 bg-white/5 p-2 shadow-lg"
                                                />
                                                <p className="text-[10px] text-slate-600 mt-1 text-center leading-tight">
                                                    Εκδόθηκε στο Web3Edu Edu‑Net<br />ως μη‑μεταβιβάσιμο SBT
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Footer Information */}
                            <div className="mt-8 text-center text-[11px] text-white/40">
                                <p>Επαληθεύτηκε στις: {new Date().toISOString()}</p>
                                <p>Δίκτυο: Web3Edu Edu-Net (424242)</p>
                                <p>Συμβόλαιο: 0xdDE6A59445538eA146a17Dd8745e7eA5288b1a31</p>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 text-xs bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                                >
                                    Εκτύπωση Επαλήθευσης
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}