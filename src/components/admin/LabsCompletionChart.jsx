import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

export default function LabsCompletionChart({ labs }) {
    if (!labs || labs.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                No lab data available
            </div>
        );
    }

    const chartData = labs.slice(0, 10).map((lab) => {
        const started = lab?.started || 0;
        const completed = lab?.completed || 0;
        const dropOff = Math.max(0, started - completed);
        const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;

        return {
            name: lab?.title?.en || lab?.labId || "Unknown",
            shortName: truncateLabel(lab?.title?.en || lab?.labId || "Unknown", 15),
            completed,
            dropOff,
            completionRate,
            started,
        };
    });

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                    <YAxis
                        type="category"
                        dataKey="shortName"
                        width={120}
                        stroke="#94a3b8"
                        fontSize={11}
                        tick={{ fill: "#94a3b8" }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        formatter={(value) => (
                            <span className="text-slate-600 dark:text-slate-300 text-sm">{value}</span>
                        )}
                    />
                    <Bar dataKey="completed" name="Completed" stackId="a" radius={[0, 0, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-completed-${index}`} fill="#10b981" />
                        ))}
                    </Bar>
                    <Bar dataKey="dropOff" name="Drop-off" stackId="a" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-dropoff-${index}`} fill="#f43f5e" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    return (
        <div className="rounded-xl border border-white/20 bg-slate-900/95 backdrop-blur-sm px-4 py-3 shadow-xl">
            <p className="font-semibold text-white mb-2">{data.name}</p>
            <div className="space-y-1 text-sm">
                <p className="text-slate-300">
                    Started: <span className="font-medium text-white">{data.started}</span>
                </p>
                <p className="text-emerald-400">
                    Completed: <span className="font-medium">{data.completed}</span>
                </p>
                <p className="text-rose-400">
                    Drop-off: <span className="font-medium">{data.dropOff}</span>
                </p>
                <p className="text-fuchsia-400">
                    Rate: <span className="font-medium">{data.completionRate}%</span>
                </p>
            </div>
        </div>
    );
}

function truncateLabel(label, maxLength) {
    if (!label) return "";
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength - 1) + "…";
}
