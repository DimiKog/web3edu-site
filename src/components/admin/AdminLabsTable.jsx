import { useNavigate } from "react-router-dom";

function completionColor(rate) {
    if (rate >= 0.8) return "text-green-600 dark:text-green-400";
    if (rate >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
}

function dropOff(lab) {
    return Math.max(0, (lab.started || 0) - (lab.completed || 0));
}

function completionRate(lab) {
    if (typeof lab?.completionRate === "number") return lab.completionRate;
    const started = lab?.started || 0;
    const completed = lab?.completed || 0;
    if (started <= 0) return 0;
    return completed / started;
}

function dropOffPercent(lab) {
    const started = lab?.started || 0;
    const completed = lab?.completed || 0;
    if (started <= 0) return 0;
    return Math.max(0, (started - completed) / started);
}

function formatMinutes(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) return "—";
    return `${Math.round(num)} min`;
}

function dropOffRowClass(value) {
    if (value >= 5) return "bg-red-50/70 dark:bg-red-900/20";
    if (value >= 2) return "bg-yellow-50/70 dark:bg-yellow-900/20";
    return "";
}

export default function AdminLabsTable({ labs }) {
    const navigate = useNavigate();

    if (!labs || labs.length === 0) {
        return (
            <div className="mt-8 text-slate-500 dark:text-slate-300">
                No lab data available yet.
            </div>
        );
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                Labs Progress
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/60 dark:bg-[#0b0f17]/70 backdrop-blur-xl">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/80 dark:bg-[#111827]/80">
                        <tr>
                            <th className="p-3 text-left text-slate-700 dark:text-slate-200">Lab</th>
                            <th className="p-3 text-left text-slate-700 dark:text-slate-200">Category</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Started</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Completed</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Avg Time</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Median Time</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Drop‑off</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Completion</th>
                        </tr>
                    </thead>

                    <tbody>
                        {labs.map((lab) => {
                            const d = dropOff(lab);
                            const started = lab.started || 0;
                            const completed = lab.completed || 0;
                            const completionPct = completionRate(lab);
                            const dropPct = dropOffPercent(lab);
                            const completionOpacity = completionPct >= 0.9 ? 1 : completionPct >= 0.75 ? 0.8 : 0.6;
                            const dropColorClass = dropPct > 0.15 ? "bg-rose-600" : "bg-rose-500";

                            return (
                                <tr
                                    key={lab.labId}
                                    onClick={() => navigate(`/admin/labs/${lab.labId}`)}
                                    className={`cursor-pointer border-t border-white/10 hover:bg-white/60 dark:hover:bg-white/5 transition ${dropOffRowClass(d)}`}
                                >
                                    <td className="p-3 text-slate-900 dark:text-slate-100">
                                        {lab.title?.en || lab.labId}
                                    </td>

                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
                                        {lab.category}
                                    </td>

                                    <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                                        {started}
                                    </td>

                                    <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                                        {completed}
                                    </td>

                                    <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                                        {formatMinutes(lab.avgCompletionTimeMinutes)}
                                    </td>

                                    <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                                        {formatMinutes(lab.medianCompletionTimeMinutes)}
                                    </td>

                                    <td className="p-3 min-w-[220px]">
                                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                            <div className="flex justify-between">
                                                <span>Started: {started}</span>
                                                <span>Completed: {completed}</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 flex">
                                                <div
                                                    className="h-full bg-emerald-500"
                                                    style={{
                                                        width: `${Math.round(completionPct * 100)}%`,
                                                        opacity: completionOpacity,
                                                    }}
                                                />
                                                <div
                                                    className={`h-full ${dropColorClass}`}
                                                    style={{ width: `${Math.round(dropPct * 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-right font-medium">
                                                Drop-off: {Math.round(dropPct * 100)}%
                                            </div>
                                        </div>
                                    </td>

                                    <td className={`p-3 text-center font-semibold ${completionColor(completionPct)}`}>
                                        {Math.round(completionPct * 100)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
