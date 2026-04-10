import React from "react";

export default function SelectionPanel({
    onSelect,
    onAdvance,
    phase,
    selected,
    mempoolLength,
    lang = "en",
}) {
    const canStartRound = (phase === "idle" || phase === "finalized") && mempoolLength > 0;

    const phaseStatus = {
        en: {
            idle: "Waiting to begin a round.",
            selected: `Validator ${selected?.id ?? "?"} was chosen by stake-weighted randomness.`,
            proposed: "The proposer is assembling the candidate block from pending transactions and the reward comes from the included transaction fees.",
            validated: "Validators are checking signatures, balances, and block validity before attesting.",
            finalized: "The round finished with finality, so the confirmed transactions leave the mempool.",
        },
        gr: {
            idle: "Αναμονή για έναρξη γύρου.",
            selected: `Ο Validator ${selected?.id ?? "?"} επιλέχθηκε με stake-weighted τυχαιότητα.`,
            proposed: "Ο proposer συνθέτει το candidate block από τις εκκρεμείς συναλλαγές και η ανταμοιβή του εδώ προέρχεται από τα fees των συναλλαγών που περιλαμβάνει.",
            validated: "Οι validators ελέγχουν signatures, balances και εγκυρότητα block πριν κάνουν attestation.",
            finalized: "Ο γύρος ολοκληρώθηκε με finality, άρα οι επιβεβαιωμένες συναλλαγές φεύγουν από το mempool.",
        },
    };

    const prompts = {
        en: {
            selected: {
                focus: "Focus on the selected validator. Its stake changed its chance of becoming proposer, but it still has not won consensus.",
                action: "Continue to Proposal",
            },
            proposed: {
                focus: "Pause here and inspect the candidate block. The proposer chooses transactions first, and in this demo its reward comes from the fees attached to those included transactions.",
                action: "Continue to Validation",
            },
            validated: {
                focus: "Check the attestation bar before moving on. Consensus only succeeds if enough stake signs off on the proposed block.",
                action: "Check Finality",
            },
        },
        gr: {
            selected: {
                focus: "Εστίασε στον validator που επιλέχθηκε. Το stake αύξησε την πιθανότητά του να γίνει proposer, αλλά δεν έχει ακόμη κερδίσει consensus.",
                action: "Συνέχεια στην Πρόταση",
            },
            proposed: {
                focus: "Κάνε παύση εδώ και κοίτα το candidate block. Ο proposer επιλέγει πρώτα συναλλαγές και σε αυτό το demo η ανταμοιβή του προέρχεται από τα fees αυτών των συναλλαγών.",
                action: "Συνέχεια στην Επικύρωση",
            },
            validated: {
                focus: "Δες το attestation bar πριν συνεχίσεις. Η συναίνεση πετυχαίνει μόνο αν αρκετό stake υπογράψει το proposed block.",
                action: "Έλεγχος Finality",
            },
        },
    };
    const phasePrompts = prompts[lang] || prompts.en;

    return (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="font-semibold">
                {lang === "gr" ? "Έλεγχος γύρου" : "Round Control"}
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {lang === "gr"
                    ? "Στο proof-of-stake ο proposer δεν κερδίζει απλώς επειδή επιλέχθηκε. Η επιλογή αποφασίζει ποιος προτείνει, αλλά η συναίνεση απαιτεί attestation από το δίκτυο."
                    : "In proof-of-stake, selection alone does not win consensus. It only decides who proposes; network attestation still decides whether the block is accepted."}
            </div>
            <button
                onClick={onSelect}
                disabled={!canStartRound}
                className={`mt-4 rounded-md px-4 py-2 font-semibold text-white transition ${
                    !canStartRound
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
                {lang === "gr" ? "🎲 Έναρξη γύρου επιλογής" : "🎲 Start Selection Round"}
            </button>

            {mempoolLength === 0 && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {lang === "gr"
                        ? "Δεν υπάρχουν εκκρεμείς συναλλαγές — κάνε επαναφορά γύρου για να προσομοιώσεις νέο mempool"
                        : "No pending transactions — reset the round to simulate a new mempool"}
                </div>
            )}

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200">
                {phaseStatus[lang]?.[phase] ?? phaseStatus.en[phase]}
                {phase === "selected" && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {lang === "gr"
                            ? "Επιλέχθηκε πιθανοτικά με βάση το stake"
                            : "Selected probabilistically based on stake weight"}
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {lang === "gr"
                                ? "Μεγαλύτερο stake αυξάνει την πιθανότητα επιλογής, αλλά δεν την εγγυάται."
                                : "Higher stake increases the probability of being selected, but does not guarantee it."}
                        </div>
                    </div>
                )}
            </div>

            {(phase === "selected" || phase === "proposed" || phase === "validated") && (
                <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/70 p-3 dark:border-indigo-800 dark:bg-indigo-950/20">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                        {lang === "gr" ? "Στάση για εστίαση" : "Pause and Focus"}
                    </div>
                    <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                        {phasePrompts[phase].focus}
                    </div>
                    <button
                        onClick={onAdvance}
                        className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        {phasePrompts[phase].action}
                    </button>
                </div>
            )}
        </div>
    );
}
