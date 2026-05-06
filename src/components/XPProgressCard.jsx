import React from "react";

const XPProgressCard = ({
    tier,
    xp,
    xpPercent,
    remainingXp,
    nextTierPercent,
    lang = "en",
}) => {
    const tierOrder = ["Explorer", "Builder", "Architect"];
    const tierIndex = tierOrder.indexOf(tier);
    const safeTierIndex = tierIndex === -1 ? 0 : tierIndex;
    const intraTierPercent = nextTierPercent ?? xpPercent ?? 0;
    const segmentSize = 100 / 3;

    const computedOverallPercent =
        safeTierIndex >= 2
            ? 100
            : safeTierIndex * segmentSize + (intraTierPercent / 100) * segmentSize;
    const roundedXpPercent = Math.round((xpPercent ?? 0) * 10) / 10;

    const tierLabel =
        lang === "gr"
            ? (tier === "Explorer"
                ? "Εξερευνητής"
                : tier === "Builder"
                    ? "Δημιουργός"
                    : tier === "Architect"
                        ? "Αρχιτέκτονας"
                        : "Εξερευνητής")
            : tier || "Explorer";

    const tierNarrative =
        lang === "gr"
            ? (tier === "Explorer"
                ? "Χτίζεις τα θεμέλια της Web3 ταυτότητάς σου."
                : tier === "Builder"
                    ? "Σχεδιάζεις μηχανισμούς διακυβέρνησης."
                    : tier === "Architect"
                        ? "Καθορίζεις την αρχιτεκτονική του DAO."
                        : "Ξεκινάς το ταξίδι σου στο Web3.")
            : (tier === "Explorer"
                ? "Building your Web3 identity foundations."
                : tier === "Builder"
                    ? "Designing governance mechanisms."
                    : tier === "Architect"
                        ? "Defining DAO architecture."
                        : "Beginning your Web3 journey.");

    return (
        <div className="w-full rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white/90 via-indigo-50/30 to-slate-100/50 p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all dark:border-slate-700/60 dark:bg-slate-800/60">
            <h3 className="mb-2.5 text-lg font-bold text-slate-800 dark:text-slate-100">
                {lang === "gr" ? "Πρόοδος XP" : "XP Progress"}
            </h3>

            {/* Tier Badge */}
            <div
                className={`
            inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold mb-2.5
            bg-gradient-to-r from-[#8A57FF]/30 via-[#4ACBFF]/30 to-[#FF67D2]/30 dark:from-[#8A57FF]/20 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20 border border-white/30 backdrop-blur-md
            ring-2 ring-[#8A57FF]/50 dark:ring-[#8A57FF]/70
            shadow-[0_0_12px_rgba(138,87,255,0.45)]
            animate-[pulseGlow_2.4s_ease-in-out_infinite]
            mx-auto justify-center
        `}
            >
                <span className="text-slate-900 dark:text-white">{tierLabel}</span>
            </div>

            {/* XP Value */}
            <p className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {lang === "gr" ? `${xp} Μόρια XP` : `${xp} XP`}
            </p>

            {/* XP Percent */}
            <p className="text-xs font-semibold text-[#8A57FF] dark:text-[#B799FF]">
                {lang === "gr"
                    ? `${roundedXpPercent}% προς το επόμενο επίπεδο`
                    : `${roundedXpPercent}% toward next tier`}
            </p>

            {/* Tier Narrative Microcopy */}
            <p className="mt-1 text-[12px] leading-snug text-slate-700 dark:text-slate-300">
                {tierNarrative}
            </p>

            {/* XP Progress Bar */}
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-300/70 dark:bg-white/20">
                <div
                    className="relative h-full transition-all duration-700 ease-out"
                    style={{ width: `${computedOverallPercent}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"></div>
                    <div className="absolute inset-0 bg-white/30 blur-[2px] opacity-50"></div>
                </div>
            </div>

            {/* Milestone Markers */}
            <div className="relative mt-1 flex w-full justify-between px-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{lang === "gr" ? "Εξερευνητής" : "Explorer"}</span>
                <span>{lang === "gr" ? "Δημιουργός" : "Builder"}</span>
                <span>{lang === "gr" ? "Αρχιτέκτονας" : "Architect"}</span>
            </div>

            {/* Progress to Next Tier */}
            <p className="mt-2.5 text-sm font-medium text-[#4ACBFF] dark:text-[#7FD8FF]">
                {remainingXp > 0
                    ? (lang === "gr"
                        ? `${remainingXp} Μόρια XP για το επόμενο επίπεδο.`
                        : `${remainingXp} XP remaining to unlock the next tier.`)
                    : (lang === "gr"
                        ? "Έχεις ξεκλειδώσει το ανώτατο επίπεδο."
                        : "You have unlocked the highest tier.")}
            </p>
        </div>
    );
};

export default XPProgressCard;
