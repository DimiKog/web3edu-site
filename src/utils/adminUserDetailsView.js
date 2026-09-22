/**
 * Pure view helpers for Admin User Details (presentation only).
 */

import { formatAdminDateTime } from "./adminObservability.js";

export function localizedTitle(value, fallback = "—") {
    if (value == null) return fallback;
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "object") {
        const en = value.en ?? value.EN;
        const gr = value.gr ?? value.el ?? value.GR;
        if (typeof en === "string" && en.trim()) return en.trim();
        if (typeof gr === "string" && gr.trim()) return gr.trim();
    }
    return fallback;
}

export function parseSortableEpoch(value) {
    if (value == null || value === "") return null;
    if (typeof value === "number" && Number.isFinite(value)) {
        return value > 1e12 ? Math.floor(value / 1000) : value;
    }
    if (typeof value === "string") {
        const text = value.trim();
        if (!text) return null;
        if (/^-?\d+(\.\d+)?$/.test(text)) {
            const n = Number(text);
            if (!Number.isFinite(n)) return null;
            return n > 1e12 ? Math.floor(n / 1000) : n;
        }
        const ms = Date.parse(text);
        if (Number.isNaN(ms)) return null;
        return Math.floor(ms / 1000);
    }
    return null;
}

export function sortByNewest(rows, getDateValue) {
    return [...rows].sort((a, b) => {
        const ea = parseSortableEpoch(getDateValue(a));
        const eb = parseSortableEpoch(getDateValue(b));
        if (ea == null && eb == null) return 0;
        if (ea == null) return 1;
        if (eb == null) return -1;
        return eb - ea;
    });
}

export function buildLabTitleLookup(labsCompleted = []) {
    const map = Object.create(null);
    for (const item of labsCompleted || []) {
        const id = String(item?.labId || "").trim();
        if (!id) continue;
        const title = localizedTitle(item?.title, "");
        if (title) map[id] = title;
    }
    return map;
}

export function normalizeCompletedLabs(labsCompleted = []) {
    const rows = (labsCompleted || []).map((item, idx) => {
        const labId = String(item?.labId || "").trim();
        return {
            key: `${labId || "lab"}-${idx}`,
            labId,
            title: localizedTitle(item?.title, labId || "Lab"),
            dateRaw: item?.completedAt || item?.completedAtEpoch || null,
            dateLabel: formatAdminDateTime(item?.completedAt ?? item?.completedAtEpoch),
            xp: item?.xp ?? null,
        };
    });
    return sortByNewest(rows, (r) => r.dateRaw);
}

export function normalizeIncompleteLabs(labsStartedNotCompleted = [], titleLookup = {}) {
    const rows = (labsStartedNotCompleted || []).map((item, idx) => {
        const labId = String(item?.labId || "").trim();
        const mapped = labId ? titleLookup[labId] : null;
        const fromItem = localizedTitle(item?.title, "");
        return {
            key: `${labId || "lab"}-${idx}`,
            labId,
            title: fromItem || mapped || labId || "Lab",
            dateRaw: item?.startedAt || item?.startedAtEpoch || null,
            dateLabel: formatAdminDateTime(item?.startedAt ?? item?.startedAtEpoch),
            inferred: Boolean(item?.inferred),
        };
    });
    return sortByNewest(rows, (r) => r.dateRaw);
}

function sumXp(entries) {
    let total = 0;
    let hasXp = false;
    for (const e of entries) {
        const n = Number(e?.xp);
        if (Number.isFinite(n)) {
            total += n;
            hasXp = true;
        }
    }
    return hasXp ? total : null;
}

/**
 * Group XP breakdown into Labs / Projects / Learning Modules (from timeline assessments)
 * and Lessons (legacy). Does not invent XP.
 */
export function groupXpBreakdown(xpBreakdown, { timeline = [], labTitles = {}, projectTitles = {} } = {}) {
    const labs = Array.isArray(xpBreakdown?.labs) ? xpBreakdown.labs : [];
    const projects = Array.isArray(xpBreakdown?.projects) ? xpBreakdown.projects : [];
    const lessons = Array.isArray(xpBreakdown?.lessons) ? xpBreakdown.lessons : [];

    const labItems = labs.map((lab, idx) => {
        const id = String(lab?.labId || "").trim();
        return {
            key: `lab-${id || idx}`,
            label: labTitles[id] || id || "Lab",
            xp: lab?.xp ?? null,
        };
    });

    const projectItems = projects.map((project, idx) => {
        const id = String(project?.projectId || "").trim();
        const title = projectTitles[id] || localizedTitle(project?.title, id || "Project");
        return {
            key: `project-${id || idx}`,
            label: title,
            xp: project?.xp ?? null,
            status: project?.status || null,
        };
    });

    const assessmentItems = (timeline || [])
        .filter((ev) => String(ev?.type || "").toLowerCase() === "assessment")
        .map((ev, idx) => {
            const id = String(ev?.id || "").trim();
            return {
                key: `assessment-${id || idx}`,
                label: localizedTitle(ev?.title, id ? `${id} — Assessment` : "Assessment"),
                xp: ev?.xp ?? null,
            };
        });

    const lessonItems = lessons.map((lesson, idx) => {
        const id = String(lesson?.lessonId || "").trim();
        return {
            key: `lesson-${id || idx}`,
            label: id || "Lesson",
            xp: lesson?.xp ?? null,
        };
    });

    const groups = [];
    if (labItems.length) {
        groups.push({ id: "labs", title: "Labs", items: labItems, totalXp: sumXp(labItems) });
    }
    if (projectItems.length) {
        groups.push({
            id: "projects",
            title: "Projects",
            items: projectItems,
            totalXp: sumXp(projectItems),
        });
    }
    if (assessmentItems.length) {
        groups.push({
            id: "modules",
            title: "Learning modules",
            items: assessmentItems,
            totalXp: sumXp(assessmentItems),
        });
    }
    if (lessonItems.length) {
        groups.push({
            id: "lessons",
            title: "Lessons",
            items: lessonItems,
            totalXp: sumXp(lessonItems),
        });
    }
    return groups;
}

export function normalizeActivityTimeline(timeline = []) {
    const rows = (timeline || []).map((item, idx) => {
        const type = String(item?.type || "").toLowerCase() || "activity";
        // Prefer completion-ish timestamps; projects may only have startedAt/submittedAt.
        const dateRaw =
            item?.completedAt ||
            item?.submittedAt ||
            item?.reviewedAt ||
            item?.startedAt ||
            item?.completedAtEpoch ||
            null;
        const title = localizedTitle(
            item?.title,
            item?.id || (type === "assessment" ? "Assessment" : type)
        );
        let what = "Activity";
        if (type === "lab") what = "Lab completed";
        else if (type === "project") {
            const status = String(item?.status || "").toLowerCase();
            if (status === "completed") what = "Project completed";
            else if (status === "submitted" || status === "pending_review") what = "Project submitted";
            else if (status === "started") what = "Project started";
            else what = "Project activity";
        } else if (type === "assessment") what = "Assessment completed";
        else if (type === "lesson") what = "Lesson completed";

        return {
            key: `${type}-${item?.id || idx}-${dateRaw || idx}`,
            type,
            what,
            title,
            dateRaw,
            dateLabel: formatAdminDateTime(dateRaw),
            xp: item?.xp ?? null,
        };
    });

    return sortByNewest(rows, (r) => r.dateRaw);
}

export function projectTitleLookup(items = []) {
    const map = Object.create(null);
    for (const item of items || []) {
        const id = String(item?.projectId || "").trim();
        if (!id) continue;
        map[id] = localizedTitle(item?.title, id);
    }
    return map;
}

function hasUsefulCell(value) {
    if (value == null || value === "") return false;
    if (value === "—") return false;
    return true;
}

/** Display copy when project start was backfilled (`inferred: true`). */
export const INFERRED_PROJECT_START_LABEL = "Unknown (historical record)";

/**
 * Resolve Started-column display for a projectsProgress item.
 * Inferred starts must not be shown as genuine calendar dates.
 */
export function formatProjectStartedDisplay(item) {
    const inferred = item?.inferred === true || item?.startedInferred === true;
    if (inferred) {
        return {
            startedLabel: INFERRED_PROJECT_START_LABEL,
            startedIsInferred: true,
        };
    }
    return {
        startedLabel: formatAdminDateTime(item?.startedAt ?? item?.startedAtEpoch),
        startedIsInferred: false,
    };
}

/**
 * Normalize admin projectsProgress rows for presentation.
 * Does not invent dates; completion formatting stays independent of start inference.
 */
export function normalizeProjectProgressItems(items = []) {
    return (Array.isArray(items) ? items : []).map((item, idx) => {
        const start = formatProjectStartedDisplay(item);
        return {
            ...item,
            key: `${item?.projectId || "project"}-${idx}`,
            startedLabel: start.startedLabel,
            startedIsInferred: start.startedIsInferred,
            completedLabel: formatAdminDateTime(item?.completedAt ?? item?.completedAtEpoch),
            submittedLabel: formatAdminDateTime(item?.submittedAt ?? item?.submittedAtEpoch),
            reviewedLabel: formatAdminDateTime(item?.reviewedAt ?? item?.reviewedAtEpoch),
        };
    });
}

/**
 * Decide which optional project columns have any useful values.
 */
export function projectTableColumnFlags(items = []) {
    let started = false;
    let submitted = false;
    let completed = false;
    let reviewed = false;
    let xp = false;
    let evidence = false;
    let review = false;

    for (const item of items || []) {
        const inferred = item?.inferred === true || item?.startedInferred === true;
        if (inferred || hasUsefulCell(item?.startedAt) || hasUsefulCell(item?.startedLabel)) {
            started = true;
        }
        if (hasUsefulCell(item?.submittedAt) || hasUsefulCell(item?.submittedLabel)) submitted = true;
        if (hasUsefulCell(item?.completedAt) || hasUsefulCell(item?.completedLabel)) completed = true;
        if (hasUsefulCell(item?.reviewedAt) || hasUsefulCell(item?.reviewedLabel)) reviewed = true;
        if (item?.xpAwarded !== null && item?.xpAwarded !== undefined && item?.xpAwarded !== "") {
            xp = true;
        }
        if (hasUsefulCell(item?.evidenceType) || hasUsefulCell(item?.evidenceRef)) evidence = true;
        if (hasUsefulCell(item?.reviewerWallet) || hasUsefulCell(item?.reviewNote)) review = true;
    }

    return { started, submitted, completed, reviewed, xp, evidence, review };
}
