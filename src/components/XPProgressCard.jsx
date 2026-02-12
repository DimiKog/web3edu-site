import React from "react";

const XPProgressCard = ({
    tier,
    xp,
    xpPercent,
    remainingXp,
    nextTierPercent,
    lang = "en",
}) => {
    // Tier segmentation logic (Explorer → Builder → Architect)
    const tierOrder = ["Explorer", "Builder", "Architect"];
    const tierIndex = tierOrder.indexOf(tier);
    const safeTierIndex = tierIndex === -1 ? 0 : tierIndex;

    // nextTierPercent represents progress within the current tier (0–100)
    const intraTierPercent = nextTierPercent ?? 0;

    // Divide progress bar into 3 equal segments
    const segmentSize = 100 / 3;

    const computedOverallPercent =
        safeTierIndex >= 2
            ? 100 // Architect = full bar
            : safeTierIndex * segmentSize + (intraTierPercent / 100) * segmentSize;

    return (
        <div className="w-full p-6 rounded-3xl bg-gradient-to-br from-white/90 via-indigo-50/40 to-slate-100/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 shadow-[0_8px_24px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
                {lang === "gr" ? "Πρόοδος XP" : "XP Progress"}
            </h3>

            {/* Tier Badge */}
            <div
                className={`
            inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-4
            bg-gradient-to-r from-[#8A57FF]/30 via-[#4ACBFF]/30 to-[#FF67D2]/30 dark:from-[#8A57FF]/20 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20 border border-white/30 backdrop-blur-md
            ring-2 ring-[#8A57FF]/50 dark:ring-[#8A57FF]/70
            shadow-[0_0_14px_rgba(138,87,255,0.55)]
            animate-[pulseGlow_2.4s_ease-in-out_infinite]
            mx-auto justify-center
        `}
            >
                <span className="text-slate-900 dark:text-white">
                    {lang === "gr"
                        ? (tier === "Explorer"
                            ? "Εξερευνητής"
                            : tier === "Builder"
                                ? "Δημιουργός"
                                : tier === "Architect"
                                    ? "Αρχιτέκτονας"
                                    : "Εξερευνητής")
                        : tier || "Explorer"}
                </span>
            </div>

            {/* XP Value */}
            <p className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-1">
                {lang === "gr" ? `${xp} Μόρια XP` : `${xp} XP`}
            </p>

            {/* XP Percent */}
            <p className="text-xs font-semibold text-[#8A57FF] dark:text-[#B799FF]">
                {lang === "gr"
                    ? `${xpPercent ?? 0}% προς το επόμενο επίπεδο`
                    : `${xpPercent ?? 0}% toward next tier`}
            </p>

            {/* Tier Narrative Microcopy */}
            <p className="text-[12px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {lang === "gr"
                    ? (tier === "Explorer"
                        ? "Χτίζεις τα θεμέλια της ταυτότητάς σου στο Web3."
                        : tier === "Builder"
                            ? "Σχεδιάζεις και εφαρμόζεις μηχανισμούς διακυβέρνησης."
                            : tier === "Architect"
                                ? "Καθορίζεις τους κανόνες και την αρχιτεκτονική του DAO."
                                : "Ξεκινάς το ταξίδι σου στο Web3.")
                    : (tier === "Explorer"
                        ? "You are building your Web3 identity foundations."
                        : tier === "Builder"
                            ? "You design and apply governance mechanisms."
                            : tier === "Architect"
                                ? "You define DAO architecture and systemic rules."
                                : "You are beginning your Web3 journey.")}
            </p>

            {/* XP Progress Bar */}
            <div className="w-full h-2 bg-slate-300/70 dark:bg-white/20 rounded-full overflow-hidden mt-2">
                <div
                    className="relative h-full transition-all duration-700 ease-out"
                    style={{ width: `${computedOverallPercent}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"></div>
                    <div className="absolute inset-0 bg-white/30 blur-[2px] opacity-50"></div>
                </div>
            </div>

            {/* Milestone Markers */}
            <div className="relative w-full flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 px-1">
                <span>{lang === "gr" ? "Εξερευνητής" : "Explorer"}</span>
                <span>{lang === "gr" ? "Δημιουργός" : "Builder"}</span>
                <span>{lang === "gr" ? "Αρχιτέκτονας" : "Architect"}</span>
            </div>

            {/* Progress to Next Tier */}
            <p className="text-sm font-medium text-[#4ACBFF] dark:text-[#7FD8FF] mt-3">
                {remainingXp > 0
                    ? (lang === "gr"
                        ? `Απομένουν ${remainingXp} Μόρια XP για να ξεκλειδώσεις το επόμενο επίπεδο.`
                        : `${remainingXp} XP remaining to unlock the next tier.`)
                    : (lang === "gr"
                        ? "Έχεις ξεκλειδώσει το ανώτατο επίπεδο."
                        : "You have unlocked the highest tier.")}
            </p>
        </div>
    );
};

export default XPProgressCard;
