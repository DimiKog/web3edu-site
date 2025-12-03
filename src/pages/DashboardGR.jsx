import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";

import {
    UserIcon,
    AcademicCapIcon,
    StarIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/solid";
import { KeyIcon, TrophyIcon, BookOpenIcon } from "@heroicons/react/24/solid";

import {
    ExplorerIcon,
    BuilderIcon,
    ArchitectIcon,
    AddressIdenticon,
    generateAvatarStyle,
    shortAddress
} from "../components/identity-ui.jsx";

export default function DashboardGR() {
    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [metadata, setMetadata] = useState(null);
    const [showTierPopup, setShowTierPopup] = useState(false);
    const [xpLeveledUp, setXpLeveledUp] = useState(false);
    const prevXpRef = useRef(null);

    useEffect(() => {
        if (!isConnected) navigate("/join-gr");
        window.scrollTo(0, 0);
    }, [isConnected]);

    const formattedAddress = shortAddress(address);

    useEffect(() => {
        if (!address) return;
        const BACKEND =
            import.meta.env.VITE_BACKEND_URL ??
            "https://web3edu-api.dimikog.org";
        fetch(`${BACKEND}/sbt/resolve/${address}`)
            .then((res) => res.json())
            .then((data) => setMetadata(data.metadata))
            .catch((err) =>
                console.error("Αποτυχία φόρτωσης metadata:", err)
            );
    }, [address]);

    useEffect(() => {
        if (!metadata || typeof metadata.xp !== "number") return;

        let timeoutId;
        if (prevXpRef.current == null) {
            prevXpRef.current = metadata.xp;
        } else {
            if (metadata.xp > prevXpRef.current) {
                setXpLeveledUp(true);
                timeoutId = setTimeout(
                    () => setXpLeveledUp(false),
                    1200
                );
            }
            prevXpRef.current = metadata.xp;
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [metadata]);

    useEffect(() => {
        if (!metadata || !metadata.tier) return;
        try {
            localStorage.setItem("web3edu-tier", metadata.tier);
        } catch (err) {
            console.error("Failed to persist tier in localStorage:", err);
        }
    }, [metadata?.tier]);

    return (
        <PageShell>
            <div className="min-h-screen flex flex-col items-center px-6 py-20 bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/20 to-[#0a0f1a] text-white">

                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] bg-[#7F3DF1]/30 blur-[140px] rounded-full"></div>
                    <div className="absolute bottom-[15%] right-[25%] w-[300px] h-[300px] bg-[#33D6FF]/25 blur-[120px] rounded-full"></div>
                </div>

                {/* GRID */}
                <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-1 md:px-0">

                    {/* --- IDENTITY CARD --- */}
                    <DashboardCard title="" className="min-h-[560px] pr-4 w-full sm:w-[320px] overflow-visible">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={
                                        "relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:scale-[1.03] overflow-visible" +
                                        (metadata?.tier === "Architect"
                                            ? " after:content-[''] after:absolute after:w-24 after:h-24 after:rounded-full after:border-2 after:border-yellow-300/40 after:animate-ping "
                                            : metadata?.tier === "Builder"
                                                ? " animate-pulse "
                                                : metadata?.tier === "Explorer"
                                                    ? " ring-2 ring-[#7F3DF1]/60 "
                                                    : "")
                                    }
                                    style={generateAvatarStyle(address, metadata?.tier)}
                                >
                                    <AddressIdenticon address={address} />

                                    <span className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-[11px]">
                                        {metadata?.tier === "Explorer" && <ExplorerIcon />}
                                        {metadata?.tier === "Builder" && <BuilderIcon />}
                                        {metadata?.tier === "Architect" && <ArchitectIcon />}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-slate-900 dark:text-white/90 font-semibold text-lg">Ταυτότητα</p>
                                    <p className="text-slate-500 dark:text-white/50 text-xs">Προφίλ Soulbound</p>
                                </div>
                            </div>

                            {metadata?.tier && (
                                <span
                                    className={
                                        "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md " +
                                        "bg-white/10 border border-white/20 self-start " +
                                        "max-w-full overflow-hidden truncate text-ellipsis " +
                                        (metadata?.tier === "Architect"
                                            ? "bg-yellow-300/20 border-yellow-300/40 animate-pulse"
                                            : "")
                                    }
                                >
                                    {metadata.tier === "Explorer" && <ExplorerIcon />}
                                    {metadata.tier === "Builder" && <BuilderIcon />}
                                    {metadata.tier === "Architect" && <ArchitectIcon />}
                                    {metadata.tier === "Explorer"
                                        ? "Εξερευνητής"
                                        : metadata.tier === "Builder"
                                            ? "Δημιουργός"
                                            : "Αρχιτέκτονας"}
                                </span>
                            )}
                        </div>

                        <p className="text-slate-700 dark:text-white/70 mb-1">Διεύθυνση</p>
                        <p className="font-semibold text-slate-900 dark:text-white/95 mb-4">{formattedAddress}</p>

                        {/* Metadata section */}
                        {metadata ? (
                            <div className="space-y-3 text-slate-800 dark:text-white/85">

                                {/* TIER */}
                                <div>
                                    <p className="text-slate-700 dark:text-white/70 text-sm">Tier</p>
                                    <p className="font-semibold flex items-center gap-2">
                                        {metadata.tier === "Explorer" && <ExplorerIcon />}
                                        {metadata.tier === "Builder" && <BuilderIcon />}
                                        {metadata.tier === "Architect" && <ArchitectIcon />}
                                        {metadata.tier === "Explorer"
                                            ? "Εξερευνητής"
                                            : metadata.tier === "Builder"
                                                ? "Δημιουργός"
                                                : "Αρχιτέκτονας"}
                                    </p>

                                    <button
                                        onClick={() => setShowTierPopup(true)}
                                        className="mt-2 text-xs text-[#33D6FF] hover:text-[#7F3DF1] underline"
                                    >
                                        Δες τα προνόμια Tier
                                    </button>
                                </div>

                                {/* XP PROGRESS */}
                                <div
                                    className={
                                        "rounded-xl p-3 bg-white/5 transition " +
                                        (xpLeveledUp
                                            ? "ring-2 ring-[#33D6FF] ring-offset-2 ring-offset-[#090C14] animate-pulse"
                                            : "")
                                    }
                                >
                                    <p className="text-slate-700 dark:text-white/70 text-sm">Πρόοδος XP</p>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"
                                            style={{ width: `${metadata.xpPercent ?? 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm mt-1">{metadata.xp} XP</p>
                                    <p className="text-xs text-slate-600 dark:text-white/60">
                                        {metadata.remainingXp > 0
                                            ? `${metadata.remainingXp} XP για το επόμενο tier`
                                            : "Μέγιστο tier"}
                                    </p>
                                </div>

                                {/* PROGRESS TO NEXT TIER */}
                                <div className="mt-3">
                                    <p className="text-slate-700 dark:text-white/70 text-sm">Προς το επόμενο Tier</p>
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                                            style={{ width: `${metadata.nextTierPercent ?? 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-white/60 mt-1">
                                        {metadata.remainingXp > 0
                                            ? `${metadata.remainingXp} XP απομένουν`
                                            : "Μέγιστο tier επιτεύχθηκε"}
                                    </p>
                                </div>

                                {/* LESSONS */}
                                <div>
                                    <p className="text-slate-700 dark:text-white/70 text-sm">Ολοκληρωμένα Μαθήματα</p>
                                    <p className="font-semibold">{metadata.lessonsCompleted}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 dark:text-white/60">Φόρτωση...</p>
                        )}
                    </DashboardCard>

                    {/* --- ACTIONS --- */}
                    <DashboardCard title="Ενέργειες" icon={<AcademicCapIcon className="w-5 h-5 text-white" />}>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/sbt-view-gr")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                Προβολή SBT
                            </button>

                            <button
                                onClick={() => navigate("/education-gr")}
                                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] hover:opacity-90 transition font-semibold shadow-md"
                            >
                                Ξεκίνησε Μάθηση
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold shadow-md"
                            >
                                Αρχική Σελίδα
                            </button>
                        </div>
                    </DashboardCard>

                    {/* --- BADGES --- */}
                    <DashboardCard title="Διακρίσεις" icon={<StarIcon className="w-5 h-5 text-white" />}>
                        {metadata && metadata.badges?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {metadata.badges.map((b, i) => {
                                    let Icon = StarIcon;
                                    if (b.toLowerCase().includes("wallet"))
                                        Icon = KeyIcon;
                                    if (b.toLowerCase().includes("lesson"))
                                        Icon = BookOpenIcon;
                                    if (b.toLowerCase().includes("quiz"))
                                        Icon = TrophyIcon;

                                    return (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#7F3DF1]/30 to-[#33D6FF]/30 border border-white/20 shadow-md text-white whitespace-nowrap"
                                        >
                                            <Icon className="w-3.5 h-3.5 text-white/90" />
                                            {b}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-white/60">Δεν υπάρχουν διακρίσεις…</p>
                        )}
                    </DashboardCard>

                    {/* --- DAO ACCESS --- */}
                    <DashboardCard title="Πρόσβαση DAO" icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}>
                        {metadata?.tier === "Builder" || metadata?.tier === "Architect" ? (
                            <p className="text-slate-900 dark:text-slate-100">Έχεις πρόσβαση στη συμμετοχή του DAO.</p>
                        ) : (
                            <p className="text-slate-900 dark:text-slate-100">Φτάσε σε επίπεδο Builder για πρόσβαση στο DAO.</p>
                        )}
                    </DashboardCard>

                    {/* --- NEXT LESSON --- */}
                    <DashboardCard title="Προτεινόμενο Μάθημα" icon={<AcademicCapIcon className="w-5 h-5 text-white" />}>
                        {metadata?.nextLesson ? (
                            <p className="text-slate-900 dark:text-slate-100">{metadata.nextLesson}</p>
                        ) : (
                            <p className="text-slate-900 dark:text-slate-100">
                                Νέες προτάσεις έρχονται σύντομα…
                            </p>
                        )}
                    </DashboardCard>
                </div>
            </div>

            {/* --- POPUP --- */}
            {showTierPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#0F0F17]/95 p-6 rounded-2xl w-80 border border-white/10 shadow-xl backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            Προνόμια Tier
                        </h2>
                        <ul className="text-white/80 text-sm space-y-2">
                            <li>🟣 Εξερευνητής — Βασική πρόσβαση & ρόλος κοινότητας</li>
                            <li>🔵 Δημιουργός — Προχωρημένα μαθήματα & δυνατότητα DAO</li>
                            <li>🟡 Αρχιτέκτονας — Πλήρης DAO πρόσβαση, beta χαρακτηριστικά</li>
                        </ul>

                        <p className="text-white/70 text-sm mt-4">
                            Πώς ανεβαίνεις tier:
                        </p>
                        <ul className="text-white/80 text-sm space-y-1 mt-1">
                            <li>• Συμπλήρωσε μαθήματα & κουίζ για XP.</li>
                            <li>• Ολοκλήρωσε learning paths.</li>
                            <li>• Συμμετείχε σε κοινότητα / DAO (μελλοντικά).</li>
                        </ul>

                        <button
                            onClick={() => setShowTierPopup(false)}
                            className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white font-semibold text-sm"
                        >
                            Κλείσιμο
                        </button>
                    </div>
                </div>
            )}
        </PageShell>
    );
}