/**
 * Admin Observability V1 — pure display helpers (no React).
 */

export const MEANINGFUL_ACTIVITY_CAPTION =
    "Meaningful learning activity includes labs, lessons, projects and passed module assessments. Logins and page views are not counted.";

const ADMIN_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function pad2(n) {
    return String(n).padStart(2, "0");
}

/**
 * Concise admin datetime for ISO strings or Unix seconds/ms.
 * Example: "17 Jun 2026, 20:07" (UTC). Invalid/missing → "—".
 * Hand-formatted so output is stable across Node/ICU locales.
 */
export function formatAdminDateTime(value) {
    if (value == null || value === "") return "—";

    let d = null;
    if (value instanceof Date) {
        d = value;
    } else if (typeof value === "number" && Number.isFinite(value)) {
        const ms = value > 1e12 ? value : value * 1000;
        d = new Date(ms);
    } else if (typeof value === "string") {
        const text = value.trim();
        if (!text) return "—";
        if (/^-?\d+(\.\d+)?$/.test(text)) {
            const n = Number(text);
            if (!Number.isFinite(n)) return "—";
            const ms = n > 1e12 ? n : n * 1000;
            d = new Date(ms);
        } else {
            d = new Date(text);
        }
    } else {
        return "—";
    }

    if (!d || Number.isNaN(d.getTime())) return "—";
    const day = d.getUTCDate();
    const month = ADMIN_MONTHS[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hour = pad2(d.getUTCHours());
    const minute = pad2(d.getUTCMinutes());
    return `${day} ${month} ${year}, ${hour}:${minute}`;
}

export function formatLearnerKind(kind, { hasSocial } = {}) {
    const raw = String(kind || "").trim().toLowerCase();
    if (raw === "social") return "Social";
    if (raw === "wallet_only" || raw === "wallet-only") return "Wallet-only";
    if (hasSocial === true) return "Social";
    if (hasSocial === false) return "Wallet-only";
    return "—";
}

export function formatSocialRegisteredAt(value, learnerKind) {
    const kind = String(learnerKind || "").trim().toLowerCase();
    if (kind === "wallet_only" || kind === "wallet-only") return "—";
    return formatAdminDateTime(value);
}

export function formatLastActivityEpoch(epoch) {
    if (epoch == null || epoch === "") return "—";
    const n = Number(epoch);
    if (!Number.isFinite(n) || n <= 0) return "—";
    return formatAdminDateTime(n);
}

export function truncateLearnerId(learnerId, max = 12) {
    const s = String(learnerId || "").trim();
    if (!s) return null;
    if (s.length <= max) return s;
    return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

export function formatMetricValue(value) {
    if (value == null || value === "") return "—";
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
    return "—";
}

/** Normalize weekly series for chart; keep zero weeks. */
export function normalizeSocialRegistrationsByWeek(series) {
    if (!Array.isArray(series)) return [];
    return series.map((row) => {
        const weekStartUtc = String(row?.weekStartUtc || row?.weekStart || "").trim();
        const countRaw = row?.count;
        const count = Number.isFinite(Number(countRaw)) ? Number(countRaw) : 0;
        let shortLabel = weekStartUtc;
        if (weekStartUtc) {
            try {
                const d = new Date(`${weekStartUtc}T00:00:00Z`);
                if (!Number.isNaN(d.getTime())) {
                    shortLabel = d.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                    });
                }
            } catch {
                // keep raw
            }
        }
        return {
            weekStartUtc,
            shortLabel,
            count,
            label: "Social registrations",
        };
    });
}
