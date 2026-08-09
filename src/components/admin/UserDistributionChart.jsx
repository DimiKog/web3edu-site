import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = {
    builders: "#f59e0b",
    explorers: "#6366f1",
    dropOff: "#f43f5e",
    active: "#10b981",
};

export default function UserDistributionChart({ data, type = "tier" }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                No user data available
            </div>
        );
    }

    let chartData = [];

    if (type === "tier") {
        // Progress-based tiers only; Class F / no-progress is a separate slice.
        const withProgress = data.filter((u) => u?.hasProgress !== false);
        const noProgress = data.length - withProgress.length;
        const builders = withProgress.filter((u) =>
            String(u?.tier || u?.level || "").toLowerCase().includes("builder")
        ).length;
        const explorers = withProgress.length - builders;

        chartData = [
            { name: "Builders", value: builders, color: COLORS.builders },
            { name: "Explorers", value: explorers, color: COLORS.explorers },
        ];
        if (noProgress > 0) {
            chartData.push({
                name: "No Progress",
                value: noProgress,
                color: "#94a3b8",
            });
        }
    } else if (type === "engagement") {
        const withProgress = data.filter((u) => u?.hasProgress !== false);
        const noProgress = data.length - withProgress.length;
        const engaged = withProgress.filter((u) => {
            const started = u?.started || u?.labsStarted || 0;
            const completed = u?.completed || u?.labsCompleted || 0;
            if (started <= 0) return completed > 0;
            return (completed / started) >= 0.5;
        }).length;
        const dropOff = withProgress.length - engaged;

        chartData = [
            { name: "Engaged (50%+)", value: engaged, color: COLORS.active },
            { name: "Low Engagement", value: dropOff, color: COLORS.dropOff },
        ];
        if (noProgress > 0) {
            chartData.push({
                name: "No Progress",
                value: noProgress,
                color: "#94a3b8",
            });
        }
    }

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip total={total} />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                            <span className="text-slate-600 dark:text-slate-300 text-sm">
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

function CustomTooltip({ active, payload, total }) {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    const percentage = total > 0 ? Math.round((data.value / total) * 100) : 0;

    return (
        <div className="rounded-xl border border-white/20 bg-slate-900/95 backdrop-blur-sm px-4 py-3 shadow-xl">
            <p className="font-semibold text-white mb-1">{data.name}</p>
            <p className="text-slate-300 text-sm">
                Count: <span className="font-medium text-white">{data.value}</span>
            </p>
            <p className="text-slate-300 text-sm">
                Percentage: <span className="font-medium text-white">{percentage}%</span>
            </p>
        </div>
    );
}
