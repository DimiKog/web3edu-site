const PHASE_ORDER = ["idle", "created", "pending", "included", "executed"];

// Returns "past" | "current" | "future" for a given target phase vs current phase
function phaseState(target, current) {
    const t = PHASE_ORDER.indexOf(target);
    const c = PHASE_ORDER.indexOf(current);
    if (c > t) return "past";
    if (c === t) return "current";
    return "future";
}

const PHASE_CLASSES = {
    past:    "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20",
    current: "bg-indigo-500/20 text-indigo-700 ring-2 ring-indigo-400/50 dark:bg-indigo-500/25 dark:text-indigo-200 dark:ring-indigo-400/40",
    future:  "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
};

const DEFAULT_COPY = {
    title: "System Visualization",
    subtitle:
        "A minimal system view of how a transaction moves toward execution and produces a state change.",
    idle: "No transaction yet",
    created: "Transaction created",
    pending: "Pending in network",
    included: "Included in block",
    executed: "Execution completed",
    txHash: "Transaction hash",
    stateValue: "State value",
    noState: "State not read yet",
};

export default function TransactionStateVisualizer({ simState, copy = {} }) {
    const t = { ...DEFAULT_COPY, ...copy };
    const phase = simState?.phase || "idle";
    const tx = simState?.tx || null;
    const stateValue = simState?.stateValue;

    const steps = [
        { key: "created",  label: t.created  },
        { key: "pending",  label: t.pending  },
        { key: "included", label: t.included },
        { key: "executed", label: t.executed },
    ];

    const idleState = phase === "idle" ? "current" : "past";

    return (
        <div className="rounded-xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">{t.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {/* Idle pill */}
                <span className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${PHASE_CLASSES[idleState]}`}>
                    {t.idle}
                </span>

                {steps.map((step) => {
                    const state = phaseState(step.key, phase);
                    return (
                        <span key={step.key} className="flex items-center gap-2">
                            <span className={`text-base transition-colors duration-300 ${state === "future" ? "text-slate-500 dark:text-slate-600" : "text-slate-600 dark:text-slate-500"}`}>
                                →
                            </span>
                            <span className={`relative rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${PHASE_CLASSES[state]}`}>
                                {state === "current" && (
                                    <span className="absolute inset-0 rounded-full ring-2 ring-indigo-400/30 dark:ring-indigo-400/20 animate-ping" />
                                )}
                                {state === "past" && (
                                    <span className="mr-1 text-emerald-500 dark:text-emerald-400">✔</span>
                                )}
                                {step.label}
                            </span>
                        </span>
                    );
                })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200/70 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-slate-950/60">
                    <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
                        {t.txHash}
                    </div>
                    <div className="mt-2 break-all font-mono text-sm text-slate-800 dark:text-slate-200">
                        {tx || "-"}
                    </div>
                </div>
                <div className={`rounded-lg border p-3 transition-all duration-300 ${
                    stateValue !== null
                        ? "border-emerald-300/50 bg-emerald-50 dark:border-emerald-700/40 dark:bg-emerald-900/20"
                        : "border-slate-200/70 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-950/60"
                }`}>
                    <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
                        {t.stateValue}
                    </div>
                    <div className={`mt-2 font-mono text-sm ${
                        stateValue !== null
                            ? "font-bold text-emerald-700 dark:text-emerald-300"
                            : "text-slate-800 dark:text-slate-200"
                    }`}>
                        {stateValue === null ? t.noState : stateValue}
                    </div>
                </div>
            </div>
        </div>
    );
}
