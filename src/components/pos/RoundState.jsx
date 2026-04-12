import React from "react";

const phases = ["idle", "selected", "proposed", "validated", "finalized"];

const phaseCopy = {
    en: {
        idle: {
            label: "Idle",
            detail: "No proposer has been chosen yet.",
        },
        selected: {
            label: "Selected",
            detail: "Stake-weighted randomness chooses a proposer, making influence proportional to bonded stake instead of free identities.",
        },
        proposed: {
            label: "Proposed",
            detail: "The proposer builds a candidate block from pending transactions, earns fees from the included transactions, and broadcasts the block for review.",
        },
        validated: {
            label: "Validated",
            detail: "Validators attest only if the block is valid. In this model, final acceptance needs at least 2/3 of total stake.",
        },
        finalized: {
            label: "Finalized",
            detail: "Finality means the block is economically irreversible because validators risk slashable stake if they try to revert it.",
        },
    },
    gr: {
        idle: {
            label: "Αναμονή",
            detail: "Δεν έχει επιλεγεί ακόμη proposer.",
        },
        selected: {
            label: "Επιλογή",
            detail: "Η stake-weighted τυχαιότητα επιλέγει proposer, ώστε η επιρροή να είναι ανάλογη του bonded stake και όχι των δωρεάν identities.",
        },
        proposed: {
            label: "Πρόταση",
            detail: "Ο proposer συνθέτει ένα candidate block από εκκρεμείς συναλλαγές, κερδίζει τα fees των συναλλαγών που περιλαμβάνει και το μεταδίδει για έλεγχο.",
        },
        validated: {
            label: "Επικύρωση",
            detail: "Οι validators κάνουν attestation μόνο αν το block είναι έγκυρο. Σε αυτό το μοντέλο η τελική αποδοχή χρειάζεται τουλάχιστον 2/3 του συνολικού stake.",
        },
        finalized: {
            label: "Οριστικοποίηση",
            detail: "Το finality σημαίνει ότι το block είναι οικονομικά μη αναστρέψιμο, γιατί οι validators ρισκάρουν slashable stake αν προσπαθήσουν να το ανατρέψουν.",
        },
    },
};

export default function RoundState({ phase, totalStake, attestation, lang = "en" }) {
    const currentIndex = phases.indexOf(phase);
    const copy = phaseCopy[lang] || phaseCopy.en;
    const supermajorityStake = Math.ceil((totalStake * 2) / 3);
    const attestationStake = attestation;
    const attestationPercent =
        totalStake > 0 ? (attestationStake / totalStake) * 100 : 0;
    const thresholdMet = attestationStake >= supermajorityStake;

    return (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
            <div className="font-semibold text-white">
                {lang === "gr" ? "Κατάσταση συναίνεσης" : "Consensus State"}
            </div>

            <div className="mt-4 flex items-start">
                {phases.map((step, idx) => {
                    const isActive = idx === currentIndex;
                    const isCompleted = idx < currentIndex;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                                <div
                                    className={`h-3 w-3 rounded-full ${
                                        isCompleted
                                            ? "bg-emerald-500"
                                            : isActive
                                                ? "bg-indigo-500"
                                                : "bg-slate-600"
                                    }`}
                                />
                                <div
                                    className={`mt-2 text-[10px] ${
                                        isActive
                                            ? "font-semibold text-indigo-300"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {copy[step].label}
                                </div>
                            </div>
                            {idx < phases.length - 1 && (
                                <div className="mt-[5px] h-[1px] flex-1 bg-slate-700" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/40 p-3 text-sm text-slate-200">
                {copy[phase].detail}
            </div>

            <div className="mt-3 text-xs text-slate-400">
                {lang === "gr"
                    ? `Κατώφλι BFT σε αυτόν τον γύρο: attestation από τουλάχιστον ${supermajorityStake} από συνολικό stake ${totalStake}.`
                    : `BFT threshold in this round: attestation from at least ${supermajorityStake} of ${totalStake} total stake.`}
            </div>

            {(phase === "validated" || phase === "finalized") && (
                <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/40 p-3">
                    <div className="text-xs text-slate-300">
                        {lang === "gr"
                            ? `Attestation: ${attestationStake} / ${totalStake}`
                            : `Attestation: ${attestationStake} / ${totalStake}`}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                        {lang === "gr"
                            ? `Κατώφλι: ${supermajorityStake} απαιτούνται`
                            : `Threshold: ${supermajorityStake} required`}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                        <div
                            className={`h-full rounded-full ${
                                thresholdMet ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${attestationPercent}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                        {thresholdMet
                            ? lang === "gr"
                                ? "Επιτεύχθηκε συναίνεση (≥ 2/3 συμφωνία)"
                                : "Consensus reached (≥ 2/3 agreement)"
                            : lang === "gr"
                                ? "Αποτυχία συναίνεσης (< 2/3 συμφωνία)"
                                : "Consensus failed (< 2/3 agreement)"}
                    </div>
                </div>
            )}
        </div>
    );
}
