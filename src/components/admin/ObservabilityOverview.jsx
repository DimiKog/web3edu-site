import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    MEANINGFUL_ACTIVITY_CAPTION,
    formatMetricValue,
    normalizeSocialRegistrationsByWeek,
} from "../../utils/adminObservability.js";

/**
 * Acquisition / activity / LM strips for Admin Observability V1.
 * Tolerates missing overview sections (backend version mismatch).
 */
export default function ObservabilityOverview({ overview }) {
    const acquisition = overview?.acquisition;
    const activity = overview?.activity;
    const learningModules = overview?.learningModules;

    const totalLearners = formatMetricValue(
        acquisition?.canonicalLearners ?? overview?.canonicalLearners ?? overview?.totalUsers
    );
    const social7 = formatMetricValue(acquisition?.socialRegistrationsLast7Days);
    const social30 = formatMetricValue(acquisition?.socialRegistrationsLast30Days);
    const weekSeries = normalizeSocialRegistrationsByWeek(
        acquisition?.socialRegistrationsByWeek
    );
    const population = acquisition?.population;

    const active7 = formatMetricValue(activity?.activeLearnersLast7Days);
    const active30 = formatMetricValue(activity?.activeLearnersLast30Days);
    const activityCaption =
        (typeof activity?.definitionLabel === "string" && activity.definitionLabel.trim())
            || MEANINGFUL_ACTIVITY_CAPTION;

    const lmLearners = formatMetricValue(learningModules?.learnersWithPassedAssessments);
    const lmPassed = formatMetricValue(learningModules?.passedAssessmentsTotal);

    return (
        <div className="space-y-6">
            <SectionFrame
                title="Acquisition"
                subtitle="Social registrations and current learner population"
                tone="indigo"
            >
                {!acquisition ? (
                    <Unavailable message="Acquisition metrics unavailable from this API version." />
                ) : (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <MetricTile
                                label="Total canonical learners"
                                value={totalLearners}
                                tone="indigo"
                            />
                            <MetricTile
                                label="New social registrations — 7d"
                                value={social7}
                                tone="violet"
                            />
                            <MetricTile
                                label="New social registrations — 30d"
                                value={social30}
                                tone="fuchsia"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Social registrations by week
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Last 12 UTC weeks (Monday start). Wallet-only learners are not included.
                            </p>
                            {weekSeries.length === 0 ? (
                                <Unavailable message="Weekly social registration series unavailable." />
                            ) : (
                                <div className="mt-3 h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={weekSeries}
                                            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="rgba(148,163,184,0.25)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="shortLabel"
                                                tick={{ fill: "#94a3b8", fontSize: 10 }}
                                                interval={1}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fill: "#94a3b8", fontSize: 10 }}
                                                width={28}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: "rgba(139,92,246,0.08)" }}
                                                contentStyle={{
                                                    borderRadius: 12,
                                                    border: "1px solid rgba(148,163,184,0.35)",
                                                    background: "rgba(15,23,42,0.92)",
                                                    color: "#e2e8f0",
                                                    fontSize: 12,
                                                }}
                                                formatter={(value) => [value, "Social registrations"]}
                                                labelFormatter={(label, payload) => {
                                                    const week = payload?.[0]?.payload?.weekStartUtc;
                                                    return week ? `Week of ${week} (UTC)` : label;
                                                }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                name="Social registrations"
                                                fill="#8A57FF"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={18}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Current population
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Snapshot of the canonical roster — not registration events. Wallet-only
                                learners have no social registration date.
                            </p>
                            {!population ? (
                                <Unavailable message="Population breakdown unavailable." />
                            ) : (
                                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <PopulationTile
                                        label="Social with progress"
                                        value={formatMetricValue(population.socialWithProgress)}
                                    />
                                    <PopulationTile
                                        label="Social without progress"
                                        value={formatMetricValue(population.socialWithoutProgress)}
                                    />
                                    <PopulationTile
                                        label="Wallet-only learners"
                                        value={formatMetricValue(population.walletOnlyLearners)}
                                    />
                                    <PopulationTile
                                        label="Identity issues"
                                        value={formatMetricValue(population.identityIssues)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SectionFrame>

            <SectionFrame
                title="Activity"
                subtitle="Learners with recent meaningful learning activity"
                tone="cyan"
            >
                {!activity ? (
                    <Unavailable message="Activity metrics unavailable from this API version." />
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <MetricTile
                                label="Active learners — 7d"
                                value={active7}
                                tone="cyan"
                            />
                            <MetricTile
                                label="Active learners — 30d"
                                value={active30}
                                tone="teal"
                            />
                        </div>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {activityCaption}
                            {activity?.definitionId ? (
                                <span className="ml-1 text-slate-400 dark:text-slate-500">
                                    ({activity.definitionId})
                                </span>
                            ) : null}
                        </p>
                    </div>
                )}
            </SectionFrame>

            <SectionFrame
                title="Learning modules"
                subtitle="Passed module assessments from existing progress data"
                tone="emerald"
            >
                {!learningModules ? (
                    <Unavailable message="Learning module metrics unavailable from this API version." />
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <MetricTile
                            label="Learners with passed assessments"
                            value={lmLearners}
                            tone="emerald"
                        />
                        <MetricTile
                            label="Passed assessments total"
                            value={lmPassed}
                            tone="emerald"
                        />
                    </div>
                )}
            </SectionFrame>
        </div>
    );
}

const SECTION_TONES = {
    indigo: "border-indigo-300/40 dark:border-indigo-500/30",
    cyan: "border-cyan-300/40 dark:border-cyan-500/30",
    emerald: "border-emerald-300/40 dark:border-emerald-500/30",
};

function SectionFrame({ title, subtitle, tone = "indigo", children }) {
    return (
        <section
            className={`rounded-2xl border bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-[#0b0f17]/80 ${SECTION_TONES[tone] || SECTION_TONES.indigo}`}
        >
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                {subtitle ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </section>
    );
}

const TILE_TONES = {
    indigo: "from-indigo-50/90 to-white/80 dark:from-indigo-950/35 dark:to-[#0b0f17]/80 border-indigo-300/40 dark:border-indigo-500/30",
    violet: "from-violet-50/90 to-white/80 dark:from-violet-950/35 dark:to-[#0b0f17]/80 border-violet-300/40 dark:border-violet-500/30",
    fuchsia: "from-fuchsia-50/90 to-white/80 dark:from-fuchsia-950/35 dark:to-[#0b0f17]/80 border-fuchsia-300/40 dark:border-fuchsia-500/30",
    cyan: "from-cyan-50/90 to-white/80 dark:from-cyan-950/35 dark:to-[#0b0f17]/80 border-cyan-300/40 dark:border-cyan-500/30",
    teal: "from-teal-50/90 to-white/80 dark:from-teal-950/35 dark:to-[#0b0f17]/80 border-teal-300/40 dark:border-teal-500/30",
    emerald: "from-emerald-50/90 to-white/80 dark:from-emerald-950/35 dark:to-[#0b0f17]/80 border-emerald-300/40 dark:border-emerald-500/30",
};

function MetricTile({ label, value, tone = "indigo" }) {
    return (
        <div
            className={`rounded-xl border bg-gradient-to-br p-4 shadow-sm ${TILE_TONES[tone] || TILE_TONES.indigo}`}
        >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {label}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
                {value}
            </div>
        </div>
    );
}

function PopulationTile({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700/70 dark:bg-slate-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
        </div>
    );
}

function Unavailable({ message }) {
    return (
        <div className="rounded-xl border border-amber-300/40 bg-amber-50/70 px-3 py-2 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-200">
            {message}
        </div>
    );
}
