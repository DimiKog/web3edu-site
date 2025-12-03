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

export default function SbtViewGR() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!isConnected) {
            navigate("/join-gr");
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
                if (data?.profile?.tier) localStorage.setItem("web3edu_tier", data.profile.tier);
                setLoading(false);
            })
            .catch(err => {
                console.error("Αποτυχία φόρτωσης SBT προφίλ:", err);
                setError("Δεν ήταν δυνατή η φόρτωση του ψηφιακού διαβατηρίου σας.");
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
                        Web3Edu Ψηφιακό Διαβατήριο Ταυτότητας
                    </h1>
                    <p className="text-white/70 text-xs sm:text-sm md:text-base">
                        Η μη-μεταβιβάσιμη Soulbound ταυτότητά σας στο Web3Edu Edu-Net.
                    </p>
                </div>

                {loading && (
                    <p className="relative z-10 text-white/70">Φόρτωση ψηφιακού διαβατηρίου…</p>
                )}
                {error && !loading && (
                    <p className="relative z-10 text-red-300">{error}</p>
                )}

                {!loading && !error && profile && (
                    <div
                        className="
                            relative z-10 max-w-3xl w-full mx-auto
                            rounded-3xl border border-indigo-400/30 dark:border-indigo-300/20
                            shadow-[0_8px_40px_rgba(36,0,80,0.25)]
                            bg-gradient-to-br from-indigo-50 via-white to-indigo-100
                            dark:from-[#232144] dark:via-[#181531] dark:to-[#232144]
                            p-2 sm:p-3 md:p-4
                            overflow-hidden
                            backdrop-blur-xl
                        "
                    >
                        <div className="rounded-[22px] bg-white dark:bg-[#181531] p-8 sm:p-10 md:p-12">
                            {/* Header */}
                            <div className="flex items-center gap-6 mb-8">
                                <div
                                    className={
                                        "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300" +
                                        (tier === "Architect"
                                            ? " animate-pulse"
                                            : tier === "Builder"
                                                ? " ring-2 ring-[#33D6FF]/70"
                                                : tier === "Explorer"
                                                    ? " ring-2 ring-[#7F3DF1]/60"
                                                    : "")
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
                                    <p className="text-xs uppercase tracking-widest text-indigo-400 dark:text-indigo-200 font-semibold">
                                        Ψηφιακή Ταυτότητα Soulbound
                                    </p>
                                    <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                                        {profile.sbt?.name ?? "Web3Edu Identity SBT"}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                                        Πορτοφόλι: <span className="font-mono">{shortAddr}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Identity Details Card */}
                            <div className="mb-8">
                                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/60 dark:bg-[#232144]/60 px-5 py-6 shadow-inner">
                                    <p className="font-semibold tracking-wide text-xs text-indigo-900 dark:text-indigo-100 uppercase mb-4">
                                        Στοιχεία Ταυτότητας
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Τύπος Token</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Soulbound (μη μεταβιβάσιμο)</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Πρότυπο</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">ERC-721 (SBT)</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Διεύθυνση Πορτοφολιού</p>
                                            <p className="font-mono text-xs break-all text-slate-900 dark:text-indigo-100">
                                                {address}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Token ID</p>
                                            <p className="font-mono text-xs text-slate-900 dark:text-indigo-100">
                                                {profile.sbt?.tokenId ?? "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Επίπεδο</p>
                                            <p className="font-medium text-sm text-slate-900 dark:text-white">{tier ?? "Explorer"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">XP</p>
                                            <p className="font-medium text-sm text-slate-900 dark:text-white">{profile.profile?.xp ?? 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Μαθήματα</p>
                                            <p className="font-medium text-sm text-slate-900 dark:text-white">{lessonsCompleted}</p>
                                        </div>
                                    </div>
                                    {/* Badges full-width row */}
                                    <div className="col-span-1 sm:col-span-2 mt-2">
                                        <p className="text-[11px] text-indigo-800 dark:text-indigo-200 uppercase">Badges</p>
                                        {badges.length > 0 ? (
                                            <ul className="mt-2 flex flex-wrap gap-2">
                                                {badges.map((b, i) => (
                                                    <li key={i} className="px-2 py-1 rounded-full text-[11px] bg-indigo-200/60 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 border border-indigo-300/40 dark:border-indigo-700/40">
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[11px] text-indigo-400 dark:text-indigo-200 mt-1">Δεν υπάρχουν badges.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Verification Card */}
                            <div className="mb-8">
                                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/60 dark:bg-[#232144]/60 px-5 py-6 shadow-inner shadow-lg flex flex-col md:flex-row items-center gap-6">
                                    {verifyUrl && (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(verifyUrl)}&size=120x120`}
                                            alt="QR Επαλήθευσης SBT"
                                            className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white/60 dark:bg-indigo-900/30 p-1 w-24 h-24 sm:w-28 sm:h-28"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                                            Επαλήθευση
                                        </p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-200 mb-2">
                                            Σύνδεσμος Επαλήθευσης
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-indigo-200 mb-2">
                                            Σαρώστε το QR ή αντιγράψτε το URL για επαλήθευση.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-lg bg-indigo-100/60 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-xs font-mono max-w-[260px] overflow-hidden text-ellipsis text-indigo-900 dark:text-indigo-100">
                                                {verifyUrl || "Δεν υπάρχει διαθέσιμο URL"}
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                disabled={!verifyUrl}
                                                className="px-3 py-1 rounded-lg bg-indigo-200/70 hover:bg-indigo-300/80 dark:bg-indigo-800/60 dark:hover:bg-indigo-700 text-xs font-semibold text-indigo-900 dark:text-indigo-100 disabled:opacity-50"
                                            >
                                                Αντιγραφή
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-xs text-indigo-600 dark:text-indigo-200 mt-4">
                                <div>
                                    <span>Εκδόθηκε στο Web3Edu Edu‑Net</span>
                                </div>
                                <div className="italic">
                                    Μη‑μεταβιβάσιμο Soulbound Token
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageShell>
    );
}