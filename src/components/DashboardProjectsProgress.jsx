import { useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard.jsx";
import { TrophyIcon } from "@heroicons/react/24/solid";

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

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function normalizeProjectsProgress(raw) {
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
}

/** Canonical project IDs — aliases map to one id (e.g. poe01 → proof-of-escape). */
const PROJECT_ID_ALIASES = {
    poe01: "proof-of-escape",
    poe: "proof-of-escape",
    "proof-of-escape": "proof-of-escape",
    decrypt01: "decrypt-message",
    "decrypt-message": "decrypt-message",
    txinvestigation01: "tx-investigation",
    "tx-investigation": "tx-investigation",
};

function normalizeCanonicalProjectId(id) {
    if (!id) return null;
    const key = String(id).trim().toLowerCase();
    if (!key) return null;
    return PROJECT_ID_ALIASES[key] ?? key;
}

function isProjectsProgressEmpty(progress) {
    if (!progress?.items?.length) {
        const s = progress?.summary ?? {};
        return (
            (Number(s.totalCompleted) || 0) === 0 &&
            (Number(s.totalStarted) || 0) === 0 &&
            (Number(s.totalSubmitted) || 0) === 0 &&
            (Number(s.totalPendingReview) || 0) === 0 &&
            (Number(s.totalNeedsRevision) || 0) === 0
        );
    }
    return false;
}

function normalizeTimelineTitle(title) {
    if (!title) return undefined;
    if (typeof title === "object") return title;
    return { en: title, el: title };
}

function deriveProjectsProgressFromTimeline(timeline) {
    if (!Array.isArray(timeline)) return null;

    const projectEntries = timeline.filter((item) => item?.type === "project");
    if (projectEntries.length === 0) return null;

    const seenCanonical = new Set();
    const items = [];

    for (const entry of projectEntries) {
        const rawId = entry?.id ?? entry?.projectId ?? entry?.slug;
        const canonicalId = normalizeCanonicalProjectId(rawId);
        if (!canonicalId || seenCanonical.has(canonicalId)) continue;
        seenCanonical.add(canonicalId);

        items.push({
            projectId: canonicalId,
            status: "completed",
            title: normalizeTimelineTitle(entry?.title),
            completedAt: entry?.completedAt ?? null,
            xpAwarded: entry?.xp ?? entry?.xpAwarded ?? null,
        });
    }

    if (items.length === 0) return null;

    return {
        summary: {
            totalStarted: 0,
            totalSubmitted: 0,
            totalCompleted: items.length,
            totalPendingReview: 0,
            totalRejected: 0,
            totalNeedsRevision: 0,
        },
        items,
    };
}

function dedupeProgressItems(items) {
    if (!Array.isArray(items) || items.length === 0) return [];

    const seenCanonical = new Set();
    const deduped = [];

    for (const item of items) {
        const canonicalId = normalizeCanonicalProjectId(item?.projectId ?? item?.id);
        if (!canonicalId || seenCanonical.has(canonicalId)) continue;
        seenCanonical.add(canonicalId);
        deduped.push({
            ...item,
            projectId: canonicalId,
        });
    }

    return deduped;
}

function resolveProjectsProgress({ resolveData, metadata, profile, timeline }) {
    const raw =
        resolveData?.projectsProgress ??
        metadata?.projectsProgress ??
        profile?.projectsProgress ??
        null;

    let progress = normalizeProjectsProgress(raw);
    progress = {
        ...progress,
        items: dedupeProgressItems(progress.items),
    };

    if (isProjectsProgressEmpty(progress)) {
        const derived = deriveProjectsProgressFromTimeline(timeline);
        if (derived) {
            progress = derived;
        }
    }

    return progress;
}

function getLearnerProjectStatusMeta(status, isGR) {
    const map = {
        started: {
            label: isGR ? "Σε εξέλιξη" : "In progress",
            className: "border-slate-200/70 bg-slate-100/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200",
        },
        submitted: {
            label: isGR ? "Υποβλήθηκε" : "Submitted",
            className: "border-indigo-200/70 bg-indigo-50/80 text-indigo-800 dark:border-indigo-700/30 dark:bg-indigo-900/25 dark:text-indigo-200",
        },
        pending_review: {
            label: isGR ? "Σε αναμονή αξιολόγησης" : "Pending review",
            className: "border-amber-200/70 bg-amber-50/80 text-amber-900 dark:border-amber-700/30 dark:bg-amber-900/25 dark:text-amber-200",
        },
        completed: {
            label: isGR ? "Ολοκληρώθηκε" : "Completed",
            className: "border-emerald-200/70 bg-emerald-50/80 text-emerald-800 dark:border-emerald-700/30 dark:bg-emerald-900/25 dark:text-emerald-200",
        },
        rejected: {
            label: isGR ? "Δεν έγινε αποδεκτό" : "Not accepted",
            className: "border-rose-200/70 bg-rose-50/80 text-rose-800 dark:border-rose-700/30 dark:bg-rose-900/25 dark:text-rose-200",
        },
        needs_revision: {
            label: isGR ? "Χρειάζεται διόρθωση" : "Needs revision",
            className: "border-amber-200/70 bg-amber-50/80 text-amber-900 dark:border-amber-700/30 dark:bg-amber-900/25 dark:text-amber-200",
        },
    };

    return map[status] || {
        label: isNonEmptyString(status) ? status : isGR ? "Άγνωστο" : "Unknown",
        className: "border-slate-200/70 bg-slate-100/80 text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200",
    };
}

function getProjectTitle(item, isGR) {
    if (isGR) {
        return item?.title?.el || item?.title?.en || item?.projectId || "—";
    }
    return item?.title?.en || item?.title?.el || item?.projectId || "—";
}

function parseDateValue(value) {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatProjectDate(value, isGR) {
    if (!value) return "—";
    const timestamp = parseDateValue(value);
    if (!timestamp) return "—";
    try {
        return new Date(timestamp).toLocaleDateString(isGR ? "el-GR" : undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return String(value);
    }
}

function getRelevantDate(item) {
    return (
        item?.reviewedAt ||
        item?.completedAt ||
        item?.submittedAt ||
        item?.startedAt ||
        null
    );
}

function sortProjectsByRecency(items) {
    return [...items].sort((a, b) => {
        const aTime = parseDateValue(getRelevantDate(a));
        const bTime = parseDateValue(getRelevantDate(b));
        return bTime - aTime;
    });
}

function findReviewNoteItem(items) {
    return items.find(
        (item) =>
            (item?.status === "needs_revision" || item?.status === "rejected") &&
            isNonEmptyString(item?.reviewNote)
    );
}

export default function DashboardProjectsProgress({
    resolveData,
    metadata,
    profile,
    timeline,
    isGR = false,
}) {
    const copy = isGR
        ? {
            title: "Builder Projects",
            completed: "Ολοκληρωμένα",
            inProgress: "Σε εξέλιξη",
            pendingReview: "Σε αναμονή αξιολόγησης",
            needsRevision: "Χρειάζεται διόρθωση",
            empty: "Η πρόοδος στα projects θα εμφανιστεί εδώ μόλις ξεκινήσεις ένα Builder project.",
            viewProjects: "Προβολή Projects",
            recent: "Τρέχοντα projects",
            reviewerNote: "Σημείωση αξιολόγησης",
            projectsLink: "/projects-gr",
        }
        : {
            title: "Builder Projects",
            completed: "Completed",
            inProgress: "In progress",
            pendingReview: "Pending review",
            needsRevision: "Needs revision",
            empty: "Your project progress will appear here once you start a Builder project.",
            viewProjects: "View Projects",
            recent: "Recent projects",
            reviewerNote: "Reviewer note",
            projectsLink: "/projects",
        };

    const progress = useMemo(
        () => resolveProjectsProgress({ resolveData, metadata, profile, timeline }),
        [resolveData, metadata, profile, timeline]
    );

    const summaryCards = useMemo(
        () => [
            { label: copy.completed, value: progress.summary.totalCompleted },
            {
                label: copy.inProgress,
                value: progress.summary.totalStarted + progress.summary.totalSubmitted,
            },
            { label: copy.pendingReview, value: progress.summary.totalPendingReview },
            { label: copy.needsRevision, value: progress.summary.totalNeedsRevision },
        ],
        [copy, progress.summary]
    );

    const recentItems = useMemo(
        () => sortProjectsByRecency(progress.items).slice(0, 3),
        [progress.items]
    );

    const reviewNoteItem = useMemo(
        () => findReviewNoteItem(progress.items),
        [progress.items]
    );

    const hasItems = progress.items.length > 0;

    return (
        <DashboardCard
            title={copy.title}
            className="p-5"
            icon={<TrophyIcon className="h-5 w-5 text-white" />}
        >
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[minmax(10.5rem,0.34fr)_minmax(0,1fr)] md:items-start">
                    <div className="grid grid-cols-2 gap-2">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    {card.label}
                                </p>
                                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {!hasItems ? (
                        <p className="rounded-2xl border border-slate-200/70 bg-white/50 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 md:min-h-[8.5rem]">
                            {copy.empty}
                        </p>
                    ) : (
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {copy.recent}
                            </p>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {recentItems.map((item, idx) => {
                                    const statusMeta = getLearnerProjectStatusMeta(item?.status, isGR);
                                    const title = getProjectTitle(item, isGR);
                                    const projectId = item?.projectId || "project";
                                    const relevantDate = getRelevantDate(item);

                                    return (
                                        <div
                                            key={`${projectId}-${idx}`}
                                            className="rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]"
                                        >
                                            <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-white line-clamp-2">
                                                {title}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {formatProjectDate(relevantDate, isGR)}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}
                                                >
                                                    {statusMeta.label}
                                                </span>
                                                {item?.xpAwarded !== null && item?.xpAwarded !== undefined ? (
                                                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                                        +{item.xpAwarded} XP
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {reviewNoteItem ? (
                    <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-3 py-3 text-sm text-amber-950 dark:border-amber-700/30 dark:bg-amber-900/20 dark:text-amber-100">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                            {copy.reviewerNote}
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm">
                            {reviewNoteItem.reviewNote}
                        </p>
                    </div>
                ) : null}

                <Link
                    to={copy.projectsLink}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                >
                    {copy.viewProjects}
                </Link>
            </div>
        </DashboardCard>
    );
}
