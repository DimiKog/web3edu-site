import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import AdminBackButton from "../../components/admin/AdminBackButton";
import { LabeledAddressField, ProgressSourceHelper } from "../../components/LabeledAddressField.jsx";
import { fetchAdminUserDetails, fetchAdminUsers } from "../../services/adminApi";

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

function formatDateLike(value) {
    if (!value) return "—";
    if (typeof value === "number" && Number.isFinite(value)) {
        try {
            return new Date(value).toLocaleString();
        } catch {
            return String(value);
        }
    }
    const s = String(value).trim();
    return s || "—";
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
    const { address } = useAccount();
    const { wallet } = useParams();

    const targetWallet = decodeURIComponent(wallet || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const adminWallet =
            address || localStorage.getItem("web3edu-wallet-address") || "";

        if (!adminWallet || !targetWallet) {
            setError("Missing wallet context.");
            setLoading(false);
            return;
        }

        let active = true;

        async function loadUserDetails() {
            try {
                const detailsJson = await fetchAdminUserDetails(adminWallet, targetWallet);
                if (active) {
                    setData(detailsJson);
                    setError(null);
                    setLoading(false);
                }
            } catch {
                try {
                    // Fallback: fetch users list and locate the selected wallet.
                    const listJson = await fetchAdminUsers(adminWallet);
                    const users = Array.isArray(listJson)
                        ? listJson
                        : Array.isArray(listJson?.users)
                            ? listJson.users
                            : [];
                    const matched = users.find((u) => {
                        const w = String(u?.wallet || u?.address || "").toLowerCase();
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
    }, [address, targetWallet]);

    const labsCompleted = useMemo(() => {
        if (!data?.labsCompleted) return [];
        return data.labsCompleted;
    }, [data]);

    const labsStartedNotCompleted = useMemo(() => {
        if (!data?.labsStartedNotCompleted) return [];
        return data.labsStartedNotCompleted;
    }, [data]);

    const xpBreakdownObj = useMemo(() => {
        return data?.xpBreakdown || null;
    }, [data]);

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

        const items = Array.isArray(raw.items) ? raw.items : [];

        return { summary, items };
    }, [data]);

    const identitySummary = useMemo(() => {
        const raw = data || {};
        const identity = raw?.identity || raw?.user?.identity || {};
        const social = raw?.social || raw?.user?.social || null;

        // Convenience cache only — do not over-trust.
        const tokenIdCached =
            raw?.tokenIdCached ??
            raw?.identity?.tokenIdCached ??
            raw?.user?.tokenIdCached ??
            null;

        const hasSocial = Boolean(social && (typeof social === "object" ? Object.keys(social).length : true));

        const hasImportedProgress = Boolean(raw?.hasImportedProgress);

        const progressSourceAddress =
            pickAddressValue(
                raw?.progressSourceAddress,
                raw?.progressSource,
                identity?.progressSourceAddress,
                identity?.progressSource,
                targetWallet
            ) ?? targetWallet;

        const showInspectedAccount =
            progressSourceAddress.toLowerCase() !== String(targetWallet).toLowerCase();

        const addressRows = [
            {
                label: "Progress source",
                copyValue: progressSourceAddress,
                emphasize: true,
                hint: "Labs, projects, and XP in this admin view are loaded for this address.",
            },
            ...(showInspectedAccount
                ? [{
                    label: "Inspected account",
                    copyValue: targetWallet,
                    hint: "Address from the admin URL query parameter.",
                }]
                : []),
            {
                label: "Web3Edu Identity",
                copyValue: pickAddressValue(identity?.aaAddress),
            },
            {
                label: "Linked wallet",
                copyValue: pickAddressValue(identity?.linkedWalletAddress),
            },
            {
                label: "Linked account",
                copyValue: pickAddressValue(identity?.ownerAddress),
            },
        ];

        const metaRows = [
            { label: "Wallet linked", value: formatBool(identity?.walletLinked) },
            { label: "Custody type", value: isNonEmptyString(identity?.custodyType) ? identity.custodyType : "—" },
            { label: "Provisioning status", value: isNonEmptyString(identity?.provisioningStatus) ? identity.provisioningStatus : "—" },
            { label: "Social user", value: formatBool(hasSocial) },
            { label: "Import type", value: isNonEmptyString(raw?.importType) ? raw.importType : "—" },
            { label: "Imported from owner", value: formatBool(raw?.importedFromOwner) },
            { label: "Imported at", value: formatDateLike(raw?.importedAt) },
            { label: "Migrated from owner", value: formatBool(raw?.migratedFromOwner) },
            { label: "Migrated at", value: formatDateLike(raw?.migratedAt) },
            { label: "Has imported progress", value: formatBool(hasImportedProgress) },
            { label: "Token ID (cached)", value: tokenIdCached !== null && tokenIdCached !== undefined ? String(tokenIdCached) : "—" },
        ];

        const badges = [
            identity?.walletLinked ? { label: "Linked", tone: "indigo" } : null,
            hasSocial ? { label: "Social", tone: "emerald" } : null,
            hasImportedProgress || raw?.importType ? { label: "Imported", tone: "amber" } : null,
            isNonEmptyString(identity?.provisioningStatus)
                ? { label: identity.provisioningStatus, tone: "slate" }
                : null,
        ].filter(Boolean);

        return { addressRows, metaRows, badges, progressSourceAddress };
    }, [data, targetWallet]);

    const timeline = useMemo(() => {
        if (!data?.timeline) return [];

        return data.timeline.map((item) => ({
            label:
                item?.title?.en ||
                item?.id ||
                item?.type ||
                "Activity",
            when: item?.completedAt || "—",
            xp: item?.xp ?? null,
        }));
    }, [data]);

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
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                        User Analytics
                    </h1>
                    {data?.user && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Tier:{" "}
                            <span className="font-semibold">
                                {data.user.hasProgress === false || data.user.tier == null
                                    ? "No Progress"
                                    : data.user.tier}
                            </span>{" "}
                            · XP: <span className="font-semibold">{data.user.xp}</span>
                        </p>
                    )}
                    <div className="mt-4 max-w-xl space-y-2">
                        <LabeledAddressField
                            label="Progress source"
                            address={identitySummary.progressSourceAddress}
                            emphasize
                            hint="This is the learner address used to load labs, projects, and XP in this admin view."
                        />
                        <ProgressSourceHelper />
                    </div>
                </div>
                <AdminBackButton to="/admin/users" label="Back to Users" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Panel title="Identity & continuity">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {identitySummary.badges.map((b) => (
                                <Badge key={b.label} tone={b.tone}>
                                    {b.label}
                                </Badge>
                            ))}
                            {!identitySummary.badges.length ? (
                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                    No identity markers available for this user.
                                </span>
                            ) : null}
                        </div>
                        <div className="space-y-3">
                            {identitySummary.addressRows.map((row) => (
                                <LabeledAddressField
                                    key={row.label}
                                    label={row.label}
                                    address={row.copyValue}
                                    hint={row.hint}
                                    emphasize={row.emphasize}
                                />
                            ))}
                        </div>
                        <KeyValueGrid rows={identitySummary.metaRows} />
                    </div>
                </Panel>

                <Panel title="Labs Completed List">
                    <List items={labsCompleted} emptyMessage="No completed labs available." />
                </Panel>

                <Panel title="Labs Started but Not Completed">
                    <List items={labsStartedNotCompleted} emptyMessage="No incomplete labs available." />
                </Panel>

                <Panel title="XP Breakdown">
                    {xpBreakdownObj ? (
                        <div className="space-y-4 text-sm">
                            {xpBreakdownObj.labs?.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Labs</p>
                                    <ul className="space-y-1">
                                        {xpBreakdownObj.labs.map((lab, idx) => (
                                            <li key={`lab-${idx}`} className="flex justify-between">
                                                <span>{lab.labId}</span>
                                                <span className="font-medium">{lab.xp} XP</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {xpBreakdownObj.lessons?.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Lessons</p>
                                    <ul className="space-y-1">
                                        {xpBreakdownObj.lessons.map((lesson, idx) => (
                                            <li key={`lesson-${idx}`} className="flex justify-between">
                                                <span>{lesson.lessonId || "Lesson"}</span>
                                                <span className="font-medium">{lesson.xp} XP</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {xpBreakdownObj.projects?.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Projects</p>
                                    <ul className="space-y-1">
                                        {xpBreakdownObj.projects.map((project, idx) => (
                                            <li key={`project-${idx}`} className="flex justify-between">
                                                <span>{project.projectId}</span>
                                                <span className="font-medium">
                                                    {project.xp !== null && project.xp !== undefined
                                                        ? `${project.xp} XP`
                                                        : isNonEmptyString(project.status)
                                                            ? project.status
                                                            : "Completed"}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No XP breakdown available.</p>
                    )}
                </Panel>

                <Panel title="Project Progress" className="md:col-span-2">
                    <ProjectProgressSection progress={projectsProgress} />
                </Panel>

                <Panel title="Timeline of Activity">
                    {timeline.length ? (
                        <div className="space-y-2">
                            {timeline.map((item, idx) => (
                                <div key={`${item.label}-${idx}`} className="rounded-lg border border-white/10 bg-white/60 dark:bg-slate-900/40 px-3 py-2">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {item.label}
                                        </p>
                                        {item.xp !== null && (
                                            <p className="text-xs font-medium text-emerald-400">
                                                {item.xp} XP
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {item.when}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No timeline entries available.</p>
                    )}
                </Panel>
            </div>
        </div>
    );
}

function Panel({ title, children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5 ${className}`}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
            {children}
        </div>
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

    if (!progress.items.length) {
        return (
            <div className="space-y-4">
                <ProjectProgressSummary cards={summaryCards} />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No project progress recorded for this user yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ProjectProgressSummary cards={summaryCards} />
            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/60 dark:bg-slate-900/40 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            <th className="px-3 py-2 font-semibold">Project</th>
                            <th className="px-3 py-2 font-semibold">Status</th>
                            <th className="px-3 py-2 font-semibold">Started</th>
                            <th className="px-3 py-2 font-semibold">Submitted</th>
                            <th className="px-3 py-2 font-semibold">Completed</th>
                            <th className="px-3 py-2 font-semibold">Reviewed</th>
                            <th className="px-3 py-2 font-semibold">XP</th>
                            <th className="px-3 py-2 font-semibold">Evidence</th>
                            <th className="px-3 py-2 font-semibold">Review</th>
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
                                    className="bg-white/40 dark:bg-slate-900/20 align-top"
                                >
                                    <td className="px-3 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
                                        <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 break-all">
                                            {projectId}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3">
                                        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                        {formatDateLike(item?.startedAt)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                        {formatDateLike(item?.submittedAt)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                        {formatDateLike(item?.completedAt)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                        {formatDateLike(item?.reviewedAt)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                        {item?.xpAwarded !== null && item?.xpAwarded !== undefined
                                            ? `${item.xpAwarded} XP`
                                            : "—"}
                                    </td>
                                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                        <p>{isNonEmptyString(item?.evidenceType) ? item.evidenceType : "—"}</p>
                                        {hasEvidenceRef ? (
                                            <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 break-all">
                                                {item.evidenceRef}
                                            </p>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                        {hasReviewer ? (
                                            <p className="font-mono text-xs break-all">{item.reviewerWallet}</p>
                                        ) : (
                                            <p>—</p>
                                        )}
                                        {hasReviewNote ? (
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {item.reviewNote}
                                            </p>
                                        ) : null}
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

function ProjectProgressSummary({ cards }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-xl border border-white/10 bg-white/60 dark:bg-slate-900/40 px-3 py-3 text-center"
                >
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {card.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

function List({ items, emptyMessage }) {
    if (!items.length) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>;
    }

    return (
        <ul className="space-y-2">
            {items.map((item, idx) => {
                const label =
                    item?.title?.en ||
                    item?.labId ||
                    item?.projectId ||
                    String(item);

                const meta =
                    item?.completedAt ||
                    item?.startedAt ||
                    item?.xp;

                return (
                    <li
                        key={`${label}-${idx}`}
                        className="rounded-lg border border-white/10 bg-white/60 dark:bg-slate-900/40 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
                    >
                        <div className="flex justify-between">
                            <span>{label}</span>
                            {meta && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {typeof meta === "number" ? `${meta} XP` : meta}
                                </span>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function KeyValueGrid({ rows }) {
    return (
        <div className="grid grid-cols-1 gap-3 text-sm">
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="rounded-xl border border-white/10 bg-white/60 dark:bg-slate-900/40 p-3"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {row.label}
                        </div>
                        {row.source === "inferred" ? (
                            <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                                inferred
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-1 font-mono text-xs text-slate-800 dark:text-slate-100 break-all">
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
        emerald: "border-emerald-300/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
        amber: "border-amber-300/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
        rose: "border-rose-300/40 bg-rose-500/10 text-rose-800 dark:text-rose-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>
            {children}
        </span>
    );
}
