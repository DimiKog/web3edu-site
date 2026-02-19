import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

function completionColor(rate) {
    if (rate >= 0.8) return "text-green-600 dark:text-green-400";
    if (rate >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
}

function dropOff(lab) {
    return Math.max(0, (lab.started || 0) - (lab.completed || 0));
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

    const groupedLabs = labs
        .slice()
        .sort((a, b) => dropOff(b) - dropOff(a))
        .reduce((acc, lab) => {
            const category = lab.category || "other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(lab);
            return acc;
        }, {});

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
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Drop‑off</th>
                            <th className="p-3 text-center text-slate-700 dark:text-slate-200">Completion</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(groupedLabs).map(([category, labs]) => (
                            <Fragment key={category}>
                                <tr key={category}>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-900/60"
                                    >
                                        {category}
                                    </td>
                                </tr>

                                {labs.map((lab) => {
                                    const d = dropOff(lab);

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
                                                {lab.started}
                                            </td>

                                            <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                                                {lab.completed}
                                            </td>

                                            <td className="p-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {d}
                                            </td>

                                            <td className={`p-3 text-center font-semibold ${completionColor(lab.completionRate || 0)}`}>
                                                {Math.round(
                                                    (lab.completionRate || 0) * 100
                                                )}
                                                %
                                            </td>
                                        </tr>
                                    );
                                })}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
