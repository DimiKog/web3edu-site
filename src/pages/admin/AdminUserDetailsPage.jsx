import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AdminBackButton from "../../components/admin/AdminBackButton";
import { LabeledAddressField } from "../../components/LabeledAddressField.jsx";
import { fetchAdminUserDetails, fetchAdminUsers } from "../../services/adminApi";
import { useAdminEligibility } from "../../hooks/useAdminEligibility.js";
import {
    formatAdminDateTime,
    formatLastActivityEpoch,
    formatLearnerKind,
    formatSocialRegisteredAt,
} from "../../utils/adminObservability.js";
import {
    buildLabTitleLookup,
    groupXpBreakdown,
    normalizeActivityTimeline,
    normalizeCompletedLabs,
    normalizeIncompleteLabs,
    normalizeProjectProgressItems,
    projectTableColumnFlags,
    projectTitleLookup,
} from "../../utils/adminUserDetailsView.js";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function formatBool(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "—";
}

function pickAddressValue(...candidates) {
    for (const candidate of candidates) {
        if (isNonEmptyString(candidate)) return candidate.trim();
    }
    return null;
}

const EMPTY_PROJECTS_PROGRESS = {
    summary: {
        totalStarted: 0,
        totalSubmitted: 0,
        totalCompleted: 0,
        totalPendingReview: 0,
        totalRejected: 0,
        totalNeedsRevision: 0,
    },
    items: [],
};

function getProjectTitle(item) {
    return item?.title?.en || item?.title?.el || item?.projectId || "—";
}

function getProjectStatusMeta(status) {
    const map = {
        started: { label: "Started", tone: "slate" },
        submitted: { label: "Submitted", tone: "indigo" },
        pending_review: { label: "Pending review", tone: "amber" },
        completed: { label: "Completed", tone: "emerald" },
        rejected: { label: "Rejected", tone: "rose" },
        needs_revision: { label: "Needs revision", tone: "amber" },
    };
    return map[status] || { label: isNonEmptyString(status) ? status : "Unknown", tone: "slate" };
}

export default function AdminUserDetailsPage() {
    const { idToken } = useAdminEligibility();
    const { wallet } = useParams();

    const targetWallet = decodeURIComponent(wallet || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!idToken) {
            setError("Admin session is not available.");
            setLoading(false);
            return;
        }
        if (!targetWallet) {
            setError("Missing learner progress address.");
            setLoading(false);
            return;
        }

        let active = true;

        async function loadUserDetails() {
            try {
                const detailsJson = await fetchAdminUserDetails(idToken, targetWallet);
                if (active) {
                    setData(detailsJson);
                    setError(null);
                    setLoading(false);
                }
            } catch {
                try {
                    const listJson = await fetchAdminUsers(idToken);
                    const users = Array.isArray(listJson)
                        ? listJson
                        : Array.isArray(listJson?.users)
                            ? listJson.users
                            : [];
                    const matched = users.find((u) => {
                        const w = String(
                            u?.progressAddress || u?.wallet || u?.address || ""
                        ).toLowerCase();
                        return w === String(targetWallet).toLowerCase();
                    });

                    if (!matched) {
                        throw new Error("User not found");
                    }

                    if (active) {
                        setData({ user: matched });
                        setError(null);
                        setLoading(false);
                    }
                } catch {
                    if (active) {
                        setError("Could not load user details.");
                        setLoading(false);
                    }
                }
            }
        }

        loadUserDetails();

        return () => {
            active = false;
        };
    }, [idToken, targetWallet]);

    const labsCompletedRaw = useMemo(
        () => (Array.isArray(data?.labsCompleted) ? data.labsCompleted : []),
        [data]
    );
    const labsIncompleteRaw = useMemo(
        () => (Array.isArray(data?.labsStartedNotCompleted) ? data.labsStartedNotCompleted : []),
        [data]
    );

    const completedLabs = useMemo(
        () => normalizeCompletedLabs(labsCompletedRaw),
        [labsCompletedRaw]
    );
    const incompleteLabs = useMemo(() => {
        const lookup = buildLabTitleLookup(labsCompletedRaw);
        return normalizeIncompleteLabs(labsIncompleteRaw, lookup);
    }, [labsCompletedRaw, labsIncompleteRaw]);

    const projectsProgress = useMemo(() => {
        const raw = data?.projectsProgress;
        if (!raw || typeof raw !== "object") {
            return EMPTY_PROJECTS_PROGRESS;
        }

        const summary = raw.summary && typeof raw.summary === "object"
            ? {
                totalStarted: Number(raw.summary.totalStarted) || 0,
                totalSubmitted: Number(raw.summary.totalSubmitted) || 0,
                totalCompleted: Number(raw.summary.totalCompleted) || 0,
                totalPendingReview: Number(raw.summary.totalPendingReview) || 0,
                totalRejected: Number(raw.summary.totalRejected) || 0,
                totalNeedsRevision: Number(raw.summary.totalNeedsRevision) || 0,
            }
            : EMPTY_PROJECTS_PROGRESS.summary;

        const items = normalizeProjectProgressItems(Array.isArray(raw.items) ? raw.items : []);

        return { summary, items };
    }, [data]);

    const timelineRows = useMemo(
        () => normalizeActivityTimeline(Array.isArray(data?.timeline) ? data.timeline : []),
        [data]
    );

    const xpGroups = useMemo(() => {
        const labTitles = buildLabTitleLookup(labsCompletedRaw);
        const projectTitles = projectTitleLookup(projectsProgress.items);
        return groupXpBreakdown(data?.xpBreakdown || null, {
            timeline: Array.isArray(data?.timeline) ? data.timeline : [],
            labTitles,
            projectTitles,
        });
    }, [data, labsCompletedRaw, projectsProgress.items]);

    const identitySummary = useMemo(() => {
        const raw = data || {};
        const user = raw?.user || {};
        const identity = raw?.identity || user?.identity || {};
        const social = identity?.social || raw?.social || user?.social || null;
        const continuity = user?.continuity || raw?.continuity || {};

        const tokenIdCached =
            raw?.tokenIdCached ??
            identity?.tokenIdCached ??
            user?.tokenIdCached ??
            null;

        const learnerKindRaw = raw?.learnerKind || user?.learnerKind || null;
        const hasSocial = Boolean(
            social && (typeof social === "object" ? Object.keys(social).length : true)
        );
        const learnerKindLabel = formatLearnerKind(learnerKindRaw, { hasSocial });

        const hasImportedProgress = Boolean(
            continuity?.hasImportedProgress ??
            raw?.hasImportedProgress ??
            continuity?.importedFromOwner ??
            continuity?.migratedFromOwner
        );

        const progressSourceAddress =
            pickAddressValue(
                raw?.progressAddress,
                raw?.progressSourceAddress,
                raw?.progressSource,
                identity?.progressSourceAddress,
                identity?.progressSource,
                targetWallet
            ) ?? targetWallet;

        const showInspectedAddress =
            progressSourceAddress.toLowerCase() !== String(targetWallet).toLowerCase();

        const addressRows = [
            {
                label: "Progress address",
                copyValue: progressSourceAddress,
                emphasize: true,
                hint: "Labs, projects, and XP are loaded for this address.",
            },
            ...(showInspectedAddress
                ? [{
                    label: "Inspected address",
                    copyValue: targetWallet,
                    hint: "Address from the admin URL path (differs from progress address).",
                }]
                : []),
            {
                label: "Web3Edu Identity (AA)",
                copyValue: pickAddressValue(identity?.aaAddress),
            },
            {
                label: "Linked EOA",
                copyValue: pickAddressValue(identity?.linkedWalletAddress),
            },
            {
                label: "Owner address",
                copyValue: pickAddressValue(identity?.ownerAddress),
            },
        ];

        const socialRegisteredAt = raw?.socialRegisteredAt ?? social?.createdAt ?? null;
        const lastActivityEpoch = raw?.lastActivityEpoch ?? user?.lastActivityEpoch ?? null;
        const learnerId = raw?.learnerId ?? user?.learnerId ?? null;

        const registrationRows = [
            { label: "Learner kind", value: learnerKindLabel },
            { label: "Learner ID", value: isNonEmptyString(learnerId) ? learnerId : "—", mono: true },
            {
                label: "Registered at",
                value: formatSocialRegisteredAt(
                    socialRegisteredAt,
                    learnerKindRaw || (hasSocial ? "social" : "wallet_only")
                ),
            },
            {
                label: "Last meaningful activity",
                value: formatLastActivityEpoch(lastActivityEpoch),
            },
            {
                label: "Display name",
                value: isNonEmptyString(social?.displayName) ? social.displayName : "—",
            },
            {
                label: "Auth provider",
                value: isNonEmptyString(social?.authProvider) ? social.authProvider : "—",
            },
        ];

        const continuityPrimary = [
            { label: "Wallet linked", value: formatBool(identity?.walletLinked) },
            { label: "Custody type", value: isNonEmptyString(identity?.custodyType) ? identity.custodyType : "—" },
            {
                label: "Provisioning status",
                value: isNonEmptyString(identity?.provisioningStatus) ? identity.provisioningStatus : "—",
            },
            { label: "Has imported progress", value: formatBool(hasImportedProgress) },
        ];

        const continuityAdvanced = [
            {
                label: "Import type",
                value: isNonEmptyString(continuity?.importType || raw?.importType)
                    ? (continuity?.importType || raw?.importType)
                    : "—",
            },
            {
                label: "Imported from owner",
                value: formatBool(continuity?.importedFromOwner ?? raw?.importedFromOwner),
            },
            {
                label: "Imported at",
                value: formatAdminDateTime(continuity?.importedAt ?? raw?.importedAt),
            },
            {
                label: "Migrated from owner",
                value: formatBool(continuity?.migratedFromOwner ?? raw?.migratedFromOwner),
            },
            {
                label: "Migrated at",
                value: formatAdminDateTime(continuity?.migratedAt ?? raw?.migratedAt),
            },
            {
                label: "Token ID (cached)",
                value: tokenIdCached !== null && tokenIdCached !== undefined ? String(tokenIdCached) : "—",
                mono: true,
            },
        ];

        const badges = [
            identity?.walletLinked ? { label: "Linked", tone: "indigo" } : null,
            learnerKindLabel === "Social" || hasSocial ? { label: "Social", tone: "emerald" } : null,
            learnerKindLabel === "Wallet-only" ? { label: "Wallet-only", tone: "slate" } : null,
            hasImportedProgress || continuity?.importType || raw?.importType
                ? { label: "Imported", tone: "amber" }
                : null,
            isNonEmptyString(identity?.provisioningStatus)
                ? { label: identity.provisioningStatus, tone: "slate" }
                : null,
        ].filter(Boolean);

        return {
            addressRows,
            registrationRows,
            continuityPrimary,
            continuityAdvanced,
            badges,
            displayName: isNonEmptyString(social?.displayName) ? social.displayName : null,
            learnerKindLabel,
        };
    }, [data, targetWallet]);

    if (loading) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading user details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                        Learner overview
                    </h1>
                    {data?.user && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {identitySummary.displayName ? (
                                <>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {identitySummary.displayName}
                                    </span>
                                    <span className="mx-1.5 text-slate-400">·</span>
                                </>
                            ) : null}
                            Tier:{" "}
                            <span className="font-semibold">
                                {data.user.hasProgress === false || data.user.tier == null
                                    ? "No Progress"
                                    : data.user.tier}
                            </span>{" "}
                            · XP: <span className="font-semibold">{data.user.xp ?? 0}</span>
                            <span className="mx-1.5 text-slate-400">·</span>
                            {identitySummary.learnerKindLabel}
                        </p>
                    )}
                </div>
                <AdminBackButton to="/admin/users" label="Back to Users" />
            </div>

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                <Panel title="Identity & registration" accent="cyan">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {identitySummary.badges.map((b) => (
                                <Badge key={b.label} tone={b.tone}>
                                    {b.label}
                                </Badge>
                            ))}
                            {!identitySummary.badges.length ? (
                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                    No identity markers available.
                                </span>
                            ) : null}
                        </div>
                        <KeyValueGrid rows={identitySummary.registrationRows} dense />
                        <div className="space-y-2">
                            {identitySummary.addressRows.map((row) => (
                                <LabeledAddressField
                                    key={row.label}
                                    label={row.label}
                                    address={row.copyValue}
                                    hint={row.hint}
                                    emphasize={row.emphasize}
                                    compact
                                />
                            ))}
                        </div>
                    </div>
                </Panel>

                <Panel title="Continuity" accent="slate">
                    <KeyValueGrid rows={identitySummary.continuityPrimary} dense />
                    <details className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50/70 open:pb-1 dark:border-slate-700/60 dark:bg-slate-900/40">
                        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
                            <span className="inline-flex items-center gap-2">
                                Advanced details
                                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                    import / migration / token cache
                                </span>
                            </span>
                        </summary>
                        <div className="border-t border-slate-200/70 px-3 py-3 dark:border-slate-700/60">
                            <KeyValueGrid rows={identitySummary.continuityAdvanced} dense />
                        </div>
                    </details>
                </Panel>

                <Panel title={`Completed labs (${completedLabs.length})`} accent="emerald">
                    <LabList
                        rows={completedLabs}
                        emptyMessage="No completed labs."
                        dateCaption="Completed"
                    />
                </Panel>

                {incompleteLabs.length > 0 ? (
                    <Panel title={`Incomplete labs (${incompleteLabs.length})`} accent="amber">
                        <LabList
                            rows={incompleteLabs}
                            emptyMessage="No incomplete labs."
                            dateCaption="Started"
                            showInferred
                        />
                    </Panel>
                ) : (
                    <div className="self-start rounded-xl border border-dashed border-amber-300/50 bg-amber-500/[0.04] px-4 py-3 text-sm text-slate-500 dark:border-amber-700/40 dark:bg-amber-500/[0.06] dark:text-slate-400">
                        No incomplete labs
                    </div>
                )}

                <Panel title="XP & achievements" accent="violet" className="lg:col-span-2">
                    <XpGroupsSection groups={xpGroups} />
                </Panel>

                <Panel title="Project progress" accent="emerald" className="lg:col-span-2">
                    <ProjectProgressSection progress={projectsProgress} />
                </Panel>

                <Panel title={`Recent activity (${timelineRows.length})`} accent="cyan" className="lg:col-span-2">
                    <ActivityTimeline rows={timelineRows} />
                </Panel>
            </div>
        </div>
    );
}

const PANEL_ACCENTS = {
    cyan: {
        panel: "border-cyan-300/35 dark:border-cyan-500/25",
        marker: "bg-cyan-500",
        title: "text-cyan-800 dark:text-cyan-200",
    },
    slate: {
        panel: "border-slate-300/45 dark:border-slate-600/50",
        marker: "bg-slate-400 dark:bg-slate-500",
        title: "text-slate-800 dark:text-slate-200",
    },
    emerald: {
        panel: "border-emerald-300/35 dark:border-emerald-500/25",
        marker: "bg-emerald-500",
        title: "text-emerald-800 dark:text-emerald-200",
    },
    amber: {
        panel: "border-amber-300/40 dark:border-amber-500/30",
        marker: "bg-amber-500",
        title: "text-amber-800 dark:text-amber-200",
    },
    violet: {
        panel: "border-violet-300/35 dark:border-violet-500/25",
        marker: "bg-violet-500",
        title: "text-violet-800 dark:text-violet-200",
    },
};

function Panel({ title, children, className = "", accent = "slate" }) {
    const tone = PANEL_ACCENTS[accent] || PANEL_ACCENTS.slate;
    return (
        <div
            className={`rounded-2xl border bg-white/70 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-[#0b0f17]/80 ${tone.panel} ${className}`}
        >
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                <span className={`h-2 w-2 shrink-0 rounded-full ${tone.marker}`} aria-hidden />
                <span className={tone.title}>{title}</span>
            </h2>
            {children}
        </div>
    );
}

function LabList({ rows, emptyMessage, dateCaption, showInferred = false }) {
    if (!rows.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>;
    }

    return (
        <ul className="divide-y divide-slate-200/70 dark:divide-slate-700/60">
            {rows.map((row) => (
                <li key={row.key} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.title}</p>
                        {row.labId && row.title !== row.labId ? (
                            <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                {row.labId}
                            </p>
                        ) : null}
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{dateCaption}</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{row.dateLabel}</p>
                        {showInferred && row.inferred ? (
                            <span className="mt-1 inline-flex rounded-full border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                                inferred
                            </span>
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
}

const XP_GROUP_ACCENTS = {
    labs: {
        border: "border-cyan-300/40 dark:border-cyan-500/30",
        total: "text-cyan-700 dark:text-cyan-300",
        marker: "bg-cyan-500",
    },
    projects: {
        border: "border-emerald-300/40 dark:border-emerald-500/30",
        total: "text-emerald-700 dark:text-emerald-300",
        marker: "bg-emerald-500",
    },
    modules: {
        border: "border-violet-300/40 dark:border-violet-500/30",
        total: "text-violet-700 dark:text-violet-300",
        marker: "bg-violet-500",
    },
    lessons: {
        border: "border-slate-200/70 dark:border-slate-700/60",
        total: "text-slate-600 dark:text-slate-300",
        marker: "bg-slate-400",
    },
};

function XpGroupsSection({ groups }) {
    if (!groups.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">No XP breakdown available.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
                const accent = XP_GROUP_ACCENTS[group.id] || XP_GROUP_ACCENTS.lessons;
                return (
                    <div
                        key={group.id}
                        className={`rounded-xl border bg-white/60 p-3 dark:bg-slate-900/40 ${accent.border}`}
                    >
                        <div className="mb-2 flex items-baseline justify-between gap-2">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.marker}`} aria-hidden />
                                {group.title}
                            </h3>
                            {group.totalXp != null ? (
                                <span className={`text-xs font-semibold ${accent.total}`}>
                                    {group.totalXp} XP
                                </span>
                            ) : null}
                        </div>
                        <ul className="space-y-1.5">
                            {group.items.map((item) => (
                                <li
                                    key={item.key}
                                    className="flex items-start justify-between gap-2 text-sm text-slate-700 dark:text-slate-200"
                                >
                                    <span className="min-w-0 break-words">{item.label}</span>
                                    <span className="shrink-0 font-medium text-slate-900 dark:text-slate-100">
                                        {item.xp != null && item.xp !== undefined
                                            ? `${item.xp} XP`
                                            : item.status || "—"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

function activityEventMeta(type) {
    const t = String(type || "").toLowerCase();
    if (t === "lab") {
        return {
            label: "Lab completed",
            tone: "cyan",
            border: "border-cyan-300/35 dark:border-cyan-500/25",
            rail: "bg-cyan-500",
            xp: "text-cyan-700 dark:text-cyan-300",
        };
    }
    if (t === "project") {
        return {
            label: "Project",
            tone: "emerald",
            border: "border-emerald-300/35 dark:border-emerald-500/25",
            rail: "bg-emerald-500",
            xp: "text-emerald-700 dark:text-emerald-300",
        };
    }
    if (t === "assessment") {
        return {
            label: "Assessment completed",
            tone: "violet",
            border: "border-violet-300/35 dark:border-violet-500/25",
            rail: "bg-violet-500",
            xp: "text-violet-700 dark:text-violet-300",
        };
    }
    return {
        label: "Activity",
        tone: "slate",
        border: "border-white/10",
        rail: "bg-slate-400",
        xp: "text-slate-600 dark:text-slate-300",
    };
}

function ActivityTimeline({ rows }) {
    if (!rows.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">No recent meaningful activity.</p>;
    }

    return (
        <ol className="space-y-2">
            {rows.map((row) => {
                const meta = activityEventMeta(row.type);
                return (
                    <li
                        key={row.key}
                        className={`relative overflow-hidden rounded-xl border bg-white/60 px-3 py-2.5 pl-4 dark:bg-slate-900/40 ${meta.border}`}
                    >
                        <span
                            className={`absolute bottom-2 left-0 top-2 w-0.5 rounded-full ${meta.rail}`}
                            aria-hidden
                        />
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="mb-1">
                                    <Badge tone={meta.tone}>{row.what}</Badge>
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {row.title}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    {row.dateLabel}
                                </p>
                            </div>
                            {row.xp != null && Number(row.xp) > 0 ? (
                                <span className={`shrink-0 text-xs font-semibold ${meta.xp}`}>
                                    +{row.xp} XP
                                </span>
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function ProjectProgressSection({ progress }) {
    const summaryCards = [
        { label: "Started", value: progress.summary.totalStarted },
        { label: "Submitted", value: progress.summary.totalSubmitted },
        { label: "Pending Review", value: progress.summary.totalPendingReview },
        { label: "Completed", value: progress.summary.totalCompleted },
        { label: "Needs Revision", value: progress.summary.totalNeedsRevision },
        { label: "Rejected", value: progress.summary.totalRejected },
    ];

    const flags = projectTableColumnFlags(progress.items);

    if (!progress.items.length) {
        return (
            <div className="space-y-3">
                <ProjectProgressSummary cards={summaryCards} />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No project progress recorded yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <ProjectProgressSummary cards={summaryCards} />
            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/60 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                            <th className="px-3 py-2 font-semibold">Project</th>
                            <th className="px-3 py-2 font-semibold">Status</th>
                            {flags.started ? <th className="px-3 py-2 font-semibold">Started</th> : null}
                            {flags.submitted ? <th className="px-3 py-2 font-semibold">Submitted</th> : null}
                            {flags.completed ? <th className="px-3 py-2 font-semibold">Completed</th> : null}
                            {flags.reviewed ? <th className="px-3 py-2 font-semibold">Reviewed</th> : null}
                            {flags.xp ? <th className="px-3 py-2 font-semibold">XP</th> : null}
                            {flags.evidence ? <th className="px-3 py-2 font-semibold">Evidence</th> : null}
                            {flags.review ? <th className="px-3 py-2 font-semibold">Review</th> : null}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {progress.items.map((item, idx) => {
                            const statusMeta = getProjectStatusMeta(item?.status);
                            const title = getProjectTitle(item);
                            const projectId = item?.projectId || "—";
                            const hasEvidenceRef = isNonEmptyString(item?.evidenceRef);
                            const hasReviewer = isNonEmptyString(item?.reviewerWallet);
                            const hasReviewNote = isNonEmptyString(item?.reviewNote);

                            return (
                                <tr
                                    key={`${projectId}-${idx}`}
                                    className="bg-white/40 align-top dark:bg-slate-900/20"
                                >
                                    <td className="px-3 py-2.5">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
                                        {title !== projectId ? (
                                            <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">
                                                {projectId}
                                            </p>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                                    </td>
                                    {flags.started ? (
                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {item?.startedLabel ?? formatAdminDateTime(item?.startedAt)}
                                        </td>
                                    ) : null}
                                    {flags.submitted ? (
                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {item?.submittedLabel ?? formatAdminDateTime(item?.submittedAt)}
                                        </td>
                                    ) : null}
                                    {flags.completed ? (
                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {item?.completedLabel ?? formatAdminDateTime(item?.completedAt)}
                                        </td>
                                    ) : null}
                                    {flags.reviewed ? (
                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {item?.reviewedLabel ?? formatAdminDateTime(item?.reviewedAt)}
                                        </td>
                                    ) : null}
                                    {flags.xp ? (
                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {item?.xpAwarded !== null && item?.xpAwarded !== undefined
                                                ? `${item.xpAwarded} XP`
                                                : "—"}
                                        </td>
                                    ) : null}
                                    {flags.evidence ? (
                                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            <p>{isNonEmptyString(item?.evidenceType) ? item.evidenceType : "—"}</p>
                                            {hasEvidenceRef ? (
                                                <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">
                                                    {item.evidenceRef}
                                                </p>
                                            ) : null}
                                        </td>
                                    ) : null}
                                    {flags.review ? (
                                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                                            {hasReviewer ? (
                                                <p className="font-mono text-[11px] break-all">{item.reviewerWallet}</p>
                                            ) : (
                                                <p>—</p>
                                            )}
                                            {hasReviewNote ? (
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.reviewNote}
                                                </p>
                                            ) : null}
                                        </td>
                                    ) : null}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProjectProgressSummary({ cards }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-xl border border-white/10 bg-white/60 px-2.5 py-2 text-center dark:bg-slate-900/40"
                >
                    <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {card.label}
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-slate-100">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

function KeyValueGrid({ rows, dense = false }) {
    return (
        <div className={`grid grid-cols-1 gap-2 text-sm ${dense ? "sm:grid-cols-2" : ""}`}>
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="rounded-lg border border-white/10 bg-white/60 px-2.5 py-2 dark:bg-slate-900/40"
                >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {row.label}
                    </div>
                    <div
                        className={`mt-0.5 break-all text-slate-800 dark:text-slate-100 ${
                            row.mono ? "font-mono text-xs" : "text-sm font-medium"
                        }`}
                    >
                        {row.value}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Badge({ tone = "slate", children }) {
    const tones = {
        slate: "border-slate-300/40 bg-slate-500/10 text-slate-700 dark:text-slate-200",
        indigo: "border-indigo-300/40 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200",
        cyan: "border-cyan-300/40 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200",
        emerald: "border-emerald-300/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
        amber: "border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
        violet: "border-violet-300/40 bg-violet-500/10 text-violet-800 dark:text-violet-200",
        rose: "border-rose-300/40 bg-rose-500/10 text-rose-800 dark:text-rose-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate}`}>
            {children}
        </span>
    );
}
