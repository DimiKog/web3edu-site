/**
 * Admin Learners directory — pure view helpers (presentation / filtering only).
 */

import {
    formatLearnerKind,
    formatSocialRegisteredAt,
} from "./adminObservability.js";

export const SECONDS_PER_DAY = 86400;

export function parseEpochSeconds(value) {
    if (value == null || value === "") return null;
    if (typeof value === "number" && Number.isFinite(value)) {
        if (value <= 0) return null;
        return value > 1e12 ? Math.floor(value / 1000) : value;
    }
    if (typeof value === "string") {
        const text = value.trim();
        if (!text) return null;
        if (/^-?\d+(\.\d+)?$/.test(text)) {
            const n = Number(text);
            if (!Number.isFinite(n) || n <= 0) return null;
            return n > 1e12 ? Math.floor(n / 1000) : n;
        }
        const ms = Date.parse(text);
        if (Number.isNaN(ms)) return null;
        return Math.floor(ms / 1000);
    }
    return null;
}

/** Resolve Social vs Wallet-only from API kind + social signal. */
export function resolveLearnerKindKey(learner) {
    const raw = String(learner?.learnerKind || "").trim().toLowerCase();
    if (raw === "social") return "social";
    if (raw === "wallet_only" || raw === "wallet-only") return "wallet_only";
    if (learner?.hasSocial === true) return "social";
    if (learner?.hasSocial === false) return "wallet_only";
    const label = String(learner?.learnerKindLabel || "").trim().toLowerCase();
    if (label === "social") return "social";
    if (label === "wallet-only" || label === "wallet_only") return "wallet_only";
    return null;
}

export function isActiveWithinDays(lastActivityEpoch, days, nowEpoch = Math.floor(Date.now() / 1000)) {
    const epoch = parseEpochSeconds(lastActivityEpoch);
    if (epoch == null) return false;
    const window = Number(days);
    if (!Number.isFinite(window) || window < 0) return false;
    const now = parseEpochSeconds(nowEpoch) ?? Math.floor(Date.now() / 1000);
    return epoch >= now - window * SECONDS_PER_DAY;
}

/**
 * ACTIVITY filter:
 * - any
 * - active7d / active30d — meaningful activity within window
 * - inactive30d — no meaningful activity within 30d (includes missing timestamp)
 */
export function matchesActivityFilter(lastActivityEpoch, filter, nowEpoch = Math.floor(Date.now() / 1000)) {
    const key = String(filter || "any").trim().toLowerCase();
    if (!key || key === "any") return true;
    if (key === "active7d" || key === "active_7d") {
        return isActiveWithinDays(lastActivityEpoch, 7, nowEpoch);
    }
    if (key === "active30d" || key === "active_30d") {
        return isActiveWithinDays(lastActivityEpoch, 30, nowEpoch);
    }
    if (key === "inactive30d" || key === "no_recent" || key === "none") {
        return !isActiveWithinDays(lastActivityEpoch, 30, nowEpoch);
    }
    return true;
}

export function matchesKindFilter(learner, filter) {
    const key = String(filter || "all").trim().toLowerCase();
    if (!key || key === "all") return true;
    const kind = resolveLearnerKindKey(learner);
    if (key === "social") return kind === "social";
    if (key === "wallet_only" || key === "wallet-only") return kind === "wallet_only";
    return true;
}

export function countLearnerPopulation(learners = [], nowEpoch = Math.floor(Date.now() / 1000)) {
    const rows = Array.isArray(learners) ? learners : [];
    let social = 0;
    let walletOnly = 0;
    let active30d = 0;
    for (const row of rows) {
        const kind = resolveLearnerKindKey(row);
        if (kind === "social") social += 1;
        else if (kind === "wallet_only") walletOnly += 1;
        if (isActiveWithinDays(row?.lastActivityEpoch, 30, nowEpoch)) active30d += 1;
    }
    return {
        total: rows.length,
        social,
        walletOnly,
        active30d,
    };
}

export function registeredSortEpoch(learner) {
    const kind = resolveLearnerKindKey(learner);
    if (kind === "wallet_only") return null;
    return parseEpochSeconds(learner?.socialRegisteredAt);
}

export function formatLearnerRegistered(learner) {
    const kindKey = resolveLearnerKindKey(learner);
    const kindForFmt =
        kindKey ||
        (learner?.hasSocial ? "social" : "wallet_only");
    return formatSocialRegisteredAt(learner?.socialRegisteredAt, kindForFmt);
}

/**
 * Compare nullable epochs. Missing/invalid always sort after valid timestamps
 * (for both asc and desc), so newest-first still puts inactive learners at the bottom.
 */
export function compareNullableEpochDescAware(aEpoch, bEpoch, sortDir = "desc") {
    const a = parseEpochSeconds(aEpoch);
    const b = parseEpochSeconds(bEpoch);
    const aNull = a == null;
    const bNull = b == null;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    const factor = sortDir === "asc" ? 1 : -1;
    return factor * (a - b);
}

export function sortLearners(learners = [], sortKey = "lastActivity", sortDir = "desc") {
    const key = String(sortKey || "lastActivity");
    const dir = sortDir === "asc" ? "asc" : "desc";
    const factor = dir === "asc" ? 1 : -1;

    return [...learners].sort((a, b) => {
        if (key === "xp") {
            return factor * ((Number(a?.xp) || 0) - (Number(b?.xp) || 0));
        }
        if (key === "registered") {
            return compareNullableEpochDescAware(
                registeredSortEpoch(a),
                registeredSortEpoch(b),
                dir
            );
        }
        // default: lastActivity
        return compareNullableEpochDescAware(
            a?.lastActivityEpoch,
            b?.lastActivityEpoch,
            dir
        );
    });
}

export function filterLearners(
    learners = [],
    {
        searchTerm = "",
        kindFilter = "all",
        activityFilter = "any",
        linkedFilter = "all",
        importFilter = "all",
        provisioningFilter = "all",
        nowEpoch = Math.floor(Date.now() / 1000),
    } = {}
) {
    const q = String(searchTerm || "").trim().toLowerCase();

    return (Array.isArray(learners) ? learners : []).filter((u) => {
        if (q) {
            const wallet = String(u.wallet || u.progressAddress || "").toLowerCase();
            const tokenId = u.tokenId != null ? String(u.tokenId).toLowerCase() : "";
            const tokenIdCached =
                u.tokenIdCached != null ? String(u.tokenIdCached).toLowerCase() : "";
            const learnerId = String(u.learnerId || "").toLowerCase();
            const hit =
                wallet.includes(q) ||
                tokenId.includes(q) ||
                tokenIdCached.includes(q) ||
                learnerId.includes(q);
            if (!hit) return false;
        }

        if (!matchesKindFilter(u, kindFilter)) return false;
        if (!matchesActivityFilter(u.lastActivityEpoch, activityFilter, nowEpoch)) return false;

        if (linkedFilter === "has" && u.hasLinkedWallets !== true) return false;
        if (linkedFilter === "none" && u.hasLinkedWallets === true) return false;

        if (importFilter === "has" && u.hasImportedProgress !== true) return false;
        if (importFilter === "none" && u.hasImportedProgress === true) return false;

        if (provisioningFilter !== "all") {
            if (String(u.provisioningStatus || "") !== String(provisioningFilter)) return false;
        }

        return true;
    });
}

/** Convenience for tests / page: population + filtered + sorted roster. */
export function buildLearnerDirectoryView(learners, options = {}) {
    const nowEpoch = options.nowEpoch ?? Math.floor(Date.now() / 1000);
    const population = countLearnerPopulation(learners, nowEpoch);
    const filtered = filterLearners(learners, { ...options, nowEpoch });
    const sorted = sortLearners(
        filtered,
        options.sortKey || "lastActivity",
        options.sortDir || "desc"
    );
    return { population, filtered, sorted };
}

export { formatLearnerKind };
