import React from "react";

export default function ValidatorCard({
    validator,
    totalStake,
    isSelected,
    phase,
    onStakeChange,
    reward = null,
    lang = "en",
}) {
    const probability =
        totalStake > 0
            ? ((validator.stake / totalStake) * 100).toFixed(1)
            : "0.0";

    const getRoleLabel = () => {
        if (!isSelected) return null;
        if (phase === "selected") return lang === "gr" ? "Επιλέχθηκε" : "Selected";
        if (phase === "proposed") return lang === "gr" ? "Προτείνει block" : "Proposing block";
        if (phase === "validated") return lang === "gr" ? "Το block επικυρώθηκε" : "Block validated";
        if (phase === "finalized") return lang === "gr" ? "Οριστικοποιήθηκε" : "Finalized";
        return null;
    };

    const isProposer = reward !== null && reward > 0.01;

    return (
        <div
            className={`p-4 rounded-xl border transition-colors duration-200 ${
                isSelected
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-900/40"
            }`}
        >
            {/* Header */}
            <div className="font-semibold">Validator {validator.id}</div>

            {/* Balance row — highlighted when reward just arrived */}
            <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                    {lang === "gr" ? "Υπόλοιπο (stake + αμοιβές)" : "Balance (stake + rewards)"}{" "}
                    <span className={`font-semibold tabular-nums transition-colors duration-300 ${
                        reward !== null ? "text-emerald-400" : "text-slate-200"
                    }`}>
                        {validator.balance != null ? validator.balance.toFixed(2) : "32.00"} ETH
                    </span>
                </div>
                {reward !== null && (
                    <span className="animate-bounce text-xs font-bold text-emerald-400">
                        +{reward.toFixed(2)} ETH
                    </span>
                )}
            </div>

            {/* Reward role label (proposer vs attestor) */}
            {reward !== null && (
                <div className="mt-1 text-[11px] text-emerald-500/80">
                    {isProposer
                        ? lang === "gr" ? "Αμοιβή proposer" : "Proposer reward"
                        : lang === "gr" ? "Αμοιβή attestor" : "Attestor reward"}
                </div>
            )}

            {/* Stake */}
            <div className="mt-2 text-xs text-slate-400">
                Stake: {validator.stake}
            </div>

            {/* Slider */}
            <input
                type="range"
                min="1"
                max="100"
                value={validator.stake}
                onChange={(e) => onStakeChange(validator.id, Number(e.target.value))}
                className="w-full mt-2"
            />

            {/* Probability */}
            <div className="mt-2 text-xs text-indigo-400">
                {probability}% {lang === "gr" ? "πιθανότητα" : "chance"}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
                {lang === "gr"
                    ? "Το stake αυξάνει την πιθανότητα επιλογής proposer χωρίς να επιτρέπει σε δωρεάν Sybil identities να κυριαρχήσουν."
                    : "Stake increases proposer odds without letting free Sybil identities dominate selection."}
            </div>

            {/* Role badge */}
            {getRoleLabel() && (
                <div className="mt-2 text-xs text-indigo-300">
                    {getRoleLabel()}
                </div>
            )}

            {/* Attestation confirmation (non-proposer validators) */}
            {phase === "validated" && !isSelected && (
                <div className="mt-2 text-xs text-emerald-500">
                    ✔ {lang === "gr" ? "Έγκυρο block, σωστές συναλλαγές" : "Valid block, valid transactions"}
                </div>
            )}
        </div>
    );
}
