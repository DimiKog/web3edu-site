

import React, { useMemo } from "react";
import { Network, WifiOff, ShieldCheck } from "lucide-react";

const POSITION_MAP = {
    V1: { left: "18%", top: "22%" },
    V2: { left: "68%", top: "22%" },
    V3: { left: "18%", top: "68%" },
    V4: { left: "68%", top: "68%" },
};

const COPY = {
    en: {
        badge: "Network Topology",
        title: "Connectivity and partition view",
        summaryHealthy: "All validators are connected and can exchange proposals and votes across the full network.",
        summaryMinority: "A minority validator is isolated, while the majority partition remains connected and can still coordinate.",
        summaryBroken: "The network is split into isolated groups, so quorum cannot be reached across the full validator set.",
        summaryRecovery: "Connectivity is being restored and validators can return to coordinated progress.",
        healthyLabel: "Healthy links",
        brokenLabel: "Broken links",
        quorumAvailable: "Quorum available",
        quorumUnavailable: "Quorum unavailable",
        quorumRestored: "Quorum restored",
        stateRunning: "Simulation running",
        statePaused: "Simulation paused",
        node: "Validator",
        connected: "Connected",
        isolated: "Isolated",
        recovering: "Recovering",
        majority: "Majority",
        minority: "Minority",
        split: "Split group",
        full: "Full network",
    },
    gr: {
        badge: "Τοπολογία Δικτύου",
        title: "Όψη συνδεσιμότητας και partition",
        summaryHealthy: "Όλοι οι validators είναι συνδεδεμένοι και μπορούν να ανταλλάσσουν proposals και ψήφους σε όλο το δίκτυο.",
        summaryMinority: "Ένας minority validator είναι απομονωμένος, ενώ η majority ομάδα παραμένει συνδεδεμένη και συνεχίζει να συντονίζεται.",
        summaryBroken: "Το δίκτυο χωρίζεται σε απομονωμένες ομάδες, οπότε δεν μπορεί να επιτευχθεί quorum στο σύνολο των validators.",
        summaryRecovery: "Η συνδεσιμότητα αποκαθίσταται και οι validators μπορούν να επιστρέψουν σε συντονισμένη πρόοδο.",
        healthyLabel: "Υγιείς συνδέσεις",
        brokenLabel: "Σπασμένες συνδέσεις",
        quorumAvailable: "Quorum διαθέσιμο",
        quorumUnavailable: "Quorum μη διαθέσιμο",
        quorumRestored: "Quorum αποκαταστάθηκε",
        stateRunning: "Η προσομοίωση εκτελείται",
        statePaused: "Η προσομοίωση είναι σε παύση",
        node: "Validator",
        connected: "Συνδεδεμένος",
        isolated: "Απομονωμένος",
        recovering: "Ανακάμπτει",
        majority: "Πλειοψηφία",
        minority: "Μειοψηφία",
        split: "Χωρισμένη ομάδα",
        full: "Πλήρες δίκτυο",
    },
};

const CONNECTIONS = [
    ["V1", "V2"],
    ["V1", "V3"],
    ["V1", "V4"],
    ["V2", "V3"],
    ["V2", "V4"],
    ["V3", "V4"],
];

function getScenarioSummary(copy, scenarioKey) {
    if (scenarioKey === "minority") return copy.summaryMinority;
    if (scenarioKey === "broken") return copy.summaryBroken;
    if (scenarioKey === "recovery") return copy.summaryRecovery;
    return copy.summaryHealthy;
}

function getQuorumLabel(copy, scenarioKey) {
    if (scenarioKey === "broken") return copy.quorumUnavailable;
    if (scenarioKey === "recovery") return copy.quorumRestored;
    return copy.quorumAvailable;
}

function buildNodes(copy, scenarioKey) {
    if (scenarioKey === "minority") {
        return [
            { id: "V1", group: copy.majority, state: copy.connected },
            { id: "V2", group: copy.majority, state: copy.connected },
            { id: "V3", group: copy.majority, state: copy.connected },
            { id: "V4", group: copy.minority, state: copy.isolated },
        ];
    }

    if (scenarioKey === "broken") {
        return [
            { id: "V1", group: copy.split, state: copy.isolated },
            { id: "V2", group: copy.split, state: copy.isolated },
            { id: "V3", group: copy.split, state: copy.isolated },
            { id: "V4", group: copy.split, state: copy.isolated },
        ];
    }

    if (scenarioKey === "recovery") {
        return [
            { id: "V1", group: copy.full, state: copy.recovering },
            { id: "V2", group: copy.full, state: copy.recovering },
            { id: "V3", group: copy.full, state: copy.connected },
            { id: "V4", group: copy.full, state: copy.connected },
        ];
    }

    return [
        { id: "V1", group: copy.full, state: copy.connected },
        { id: "V2", group: copy.full, state: copy.connected },
        { id: "V3", group: copy.full, state: copy.connected },
        { id: "V4", group: copy.full, state: copy.connected },
    ];
}

function getLineState(scenarioKey, from, to) {
    if (scenarioKey === "healthy") return "healthy";
    if (scenarioKey === "recovery") return "recovery";

    if (scenarioKey === "minority") {
        return from === "V4" || to === "V4" ? "broken" : "healthy";
    }

    if (scenarioKey === "broken") {
        const groupA = ["V1", "V2"];
        const groupB = ["V3", "V4"];
        const sameGroup =
            (groupA.includes(from) && groupA.includes(to)) ||
            (groupB.includes(from) && groupB.includes(to));
        return sameGroup ? "healthy" : "broken";
    }

    return "healthy";
}

function statusTone(state, copy) {
    if (state === copy.connected) return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200";
    if (state === copy.recovering) return "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-200";
    return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200";
}

export default function S5NetworkTopology({
    language = "en",
    scenarioKey = "healthy",
    isRunning = false,
}) {
    const copy = COPY[language] || COPY.en;

    const nodes = useMemo(() => buildNodes(copy, scenarioKey), [copy, scenarioKey]);

    const lines = useMemo(
        () =>
            CONNECTIONS.map(([from, to]) => ({
                from,
                to,
                state: getLineState(scenarioKey, from, to),
            })),
        [scenarioKey]
    );

    const brokenCount = lines.filter((line) => line.state === "broken").length;
    const healthyCount = lines.length - brokenCount;

    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-100/80 p-5 sm:p-6 dark:border-white/10 dark:bg-slate-950/45">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-cyan-300 bg-cyan-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                        {copy.badge}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                        <Network className="h-3.5 w-3.5" />
                        {isRunning ? copy.stateRunning : copy.statePaused}
                    </span>
                </div>

                <div className="max-w-4xl">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">{copy.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{getScenarioSummary(copy, scenarioKey)}</p>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="min-w-0 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/90 dark:text-emerald-200/90">{copy.healthyLabel}</p>
                        <p className="mt-1 text-base font-semibold">{healthyCount}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700/90 dark:text-amber-200/90">{copy.brokenLabel}</p>
                        <p className="mt-1 text-base font-semibold">{brokenCount}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-fuchsia-300 bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-100">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-700/90 dark:text-fuchsia-200/90">Quorum</p>
                        <p className="mt-1 text-sm font-semibold leading-6 break-words">{getQuorumLabel(copy, scenarioKey)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_55%)] p-4 sm:p-5 dark:border-white/10 dark:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_55%)]">
                    <div className="relative mx-auto h-[360px] w-full max-w-[520px] overflow-hidden rounded-[1.5rem] border border-slate-300 bg-[#0F172A] dark:border-white/10 dark:bg-slate-950/65">
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            {lines.map((line) => {
                                const from = POSITION_MAP[line.from];
                                const to = POSITION_MAP[line.to];
                                const stroke = line.state === "broken" ? "rgba(251,191,36,0.8)" : line.state === "recovery" ? "rgba(34,211,238,0.85)" : "rgba(16,185,129,0.85)";
                                const dash = line.state === "broken" ? "5 4" : line.state === "recovery" ? "3 2" : "";

                                return (
                                    <line
                                        key={`${line.from}-${line.to}`}
                                        x1={parseFloat(from.left)}
                                        y1={parseFloat(from.top)}
                                        x2={parseFloat(to.left)}
                                        y2={parseFloat(to.top)}
                                        stroke={stroke}
                                        strokeWidth="1.6"
                                        strokeDasharray={dash}
                                        className={isRunning && line.state !== "broken" ? "animate-pulse" : ""}
                                    />
                                );
                            })}
                        </svg>

                        {nodes.map((node) => (
                            <div
                                key={node.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: POSITION_MAP[node.id].left, top: POSITION_MAP[node.id].top }}
                            >
                                <div className="flex w-[122px] flex-col items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/95 px-3 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold ${statusTone(node.state, copy)}`}>
                                        {node.id}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.node}</p>
                                        <p className="mt-1 text-sm font-semibold text-white">{node.group}</p>
                                        <p className="mt-1 text-xs text-slate-300">{node.state}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-200">
                            <ShieldCheck className="h-5 w-5" />
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">Quorum</h4>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{getQuorumLabel(copy, scenarioKey)}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-200">
                            <WifiOff className="h-5 w-5" />
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">Partition</h4>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {scenarioKey === "healthy" && (
                                <>
                                    <li>• {copy.full}</li>
                                    <li>• {copy.connected}</li>
                                </>
                            )}
                            {scenarioKey === "minority" && (
                                <>
                                    <li>• {copy.majority}: V1, V2, V3</li>
                                    <li>• {copy.minority}: V4</li>
                                </>
                            )}
                            {scenarioKey === "broken" && (
                                <>
                                    <li>• {copy.split}: V1, V2</li>
                                    <li>• {copy.split}: V3, V4</li>
                                </>
                            )}
                            {scenarioKey === "recovery" && (
                                <>
                                    <li>• {copy.full}</li>
                                    <li>• {copy.recovering}</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
