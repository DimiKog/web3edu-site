import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminFeedback } from "../../services/adminApi";
import { useAdminEligibility } from "../../hooks/useAdminEligibility.js";

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function normalizeIssuesForComparison(value) {
    // Conservative normalization: enough to detect common placeholders.
    // - trim + lowercase
    // - collapse whitespace
    // - remove common punctuation (e.g. "no.", "none!", "κανένα.")
    return normalizeText(value)
        .replace(/\s+/g, " ")
        .replace(/[.,;:!?"'()[\]{}<>]/g, "")
        .trim();
}

function isMeaningfulIssuesText(value) {
    const s = normalizeIssuesForComparison(value);
    if (!s) return false;

    // Low-signal placeholders to ignore for review/highlighting/filtering.
    const LOW_SIGNAL = new Set([
        // English
        "no",
        "none",
        "nope",
        "nah",
        "nothing",
        "n/a",
        "na",
        "no issues",
        "no issue",
        "no problems",
        "no problem",
        "nothing to report",
        "all good",
        "ok",
        "okay",
        "good",
        "test",
        "testing",
        "asd",
        "asdf",
        "123",
        // Greek (common variants)
        "κανένα",
        "κανενα",
        "κανένα πρόβλημα",
        "κανενα προβλημα",
        "κανένα προβλημα",
        "κανένα θέμα",
        "κανενα θεμα",
        "κανένα θεμα",
        "όχι",
        "οχι",
        "τίποτα",
        "τιποτα",
        "δεν έχω",
        "δεν εχω",
        "δεν έχει",
        "δεν εχει",
    ]);

    if (LOW_SIGNAL.has(s)) return false;
    if (s.length < 3) return false;
    return true;
}

function formatDateTime(input) {
    if (!input) return "—";
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

function formatDateCompact(input) {
    if (!input) return "—";
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
}

function shortAccount(value) {
    const s = String(value || "");
    if (s.length <= 14) return s || "—";
    return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

function getSubmissionDate(entry) {
    return entry?.submittedAt || entry?.timestamp || null;
}

function todayIsoDate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function toCsvValue(value) {
    const s = value === null || value === undefined ? "" : String(value);
    // CSV escaping: double quotes inside quoted field.
    return `"${s.replace(/"/g, '""')}"`;
}

function downloadBlob({ filename, content, mimeType }) {
    if (typeof window === "undefined") return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function getBackendReviewLevel(entry) {
    const raw = entry?.reviewLevel;
    if (raw === null || raw === undefined) return null;
    const v = normalizeText(raw);
    if (!v) return null;

    // Be tolerant to minor backend naming differences.
    if (v === "strong" || v === "high" || v === "critical" || v === "needs_review_strong") return "strong";
    if (v === "soft" || v === "low" || v === "needs_review_soft") return "soft";
    if (v === "ok" || v === "normal" || v === "none") return "ok";

    // Unknown value: treat as missing to avoid hard coupling.
    return null;
}

function getHasMeaningfulIssues(entry) {
    if (typeof entry?.hasMeaningfulIssues === "boolean") {
        return entry.hasMeaningfulIssues;
    }
    return isMeaningfulIssuesText(entry?.issues);
}

function getReviewLevel(entry) {
    // Prefer backend-derived classification when provided.
    const backend = getBackendReviewLevel(entry);
    if (backend) return backend;

    // Fallback heuristics for older responses.
    const recommend = normalizeText(entry?.recommend);
    const clarity = normalizeText(entry?.clarity);
    if (recommend === "no" || clarity === "confusing") return "strong";
    if (getHasMeaningfulIssues(entry)) return "soft";
    return "ok";
}

function isStrongReview(entry) {
    return getReviewLevel(entry) === "strong";
}

function isSoftReview(entry) {
    return getReviewLevel(entry) === "soft";
}

export default function AdminFeedbackPage() {
    const { idToken } = useAdminEligibility();
    const [submissions, setSubmissions] = useState(null);
    const [totalSubmissions, setTotalSubmissions] = useState(null);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const [labIdFilter, setLabIdFilter] = useState("");
    const [labTypeFilter, setLabTypeFilter] = useState("");
    const [clarityFilter, setClarityFilter] = useState("");
    const [recommendFilter, setRecommendFilter] = useState("");
    const [walletSearch, setWalletSearch] = useState("");
    const [hasIssuesOnly, setHasIssuesOnly] = useState(false);

    const loadFeedback = () => {
        if (!idToken) return;

        setError(null);
        fetchAdminFeedback(idToken)
            .then((data) => {
                if (Array.isArray(data)) {
                    setSubmissions(data);
                    setTotalSubmissions(data.length);
                    return;
                }
                if (Array.isArray(data?.entries)) {
                    setSubmissions(data.entries);
                    setTotalSubmissions(
                        typeof data?.total === "number"
                            ? data.total
                            : typeof data?.count === "number"
                                ? data.count
                                : data.entries.length
                    );
                    return;
                }
                if (Array.isArray(data?.feedback)) {
                    setSubmissions(data.feedback);
                    setTotalSubmissions(
                        typeof data?.total === "number"
                            ? data.total
                            : typeof data?.count === "number"
                                ? data.count
                                : data.feedback.length
                    );
                    return;
                }
                if (Array.isArray(data?.submissions)) {
                    setSubmissions(data.submissions);
                    setTotalSubmissions(
                        typeof data?.total === "number"
                            ? data.total
                            : typeof data?.count === "number"
                                ? data.count
                                : data.submissions.length
                    );
                    return;
                }
                setSubmissions([]);
                setTotalSubmissions(typeof data?.total === "number" ? data.total : 0);
            })
            .catch(() => setError("Not authorized"));
    };

    useEffect(() => {
        loadFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- same pattern as other admin pages
    }, [idToken]);

    const labTypes = useMemo(() => {
        const set = new Set();
        for (const entry of submissions || []) {
            const t = String(entry?.labType || "").trim();
            if (t) set.add(t);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [submissions]);

    const clarityValues = useMemo(() => {
        const set = new Set();
        for (const entry of submissions || []) {
            const v = String(entry?.clarity || "").trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [submissions]);

    const recommendValues = useMemo(() => {
        const set = new Set();
        for (const entry of submissions || []) {
            const v = String(entry?.recommend || "").trim();
            if (v) set.add(v);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [submissions]);

    const filtered = useMemo(() => {
        const labIdNeedle = normalizeText(labIdFilter);
        const walletNeedle = normalizeText(walletSearch);

        return (submissions || []).filter((entry) => {
            const labId = normalizeText(entry?.labId);
            const labType = String(entry?.labType || "").trim();
            const clarity = String(entry?.clarity || "").trim();
            const recommend = String(entry?.recommend || "").trim();
            const wallet = normalizeText(entry?.walletAddress);

            if (labIdNeedle && !labId.includes(labIdNeedle)) return false;
            if (labTypeFilter && labType !== labTypeFilter) return false;
            if (clarityFilter && clarity !== clarityFilter) return false;
            if (recommendFilter && recommend !== recommendFilter) return false;
            if (hasIssuesOnly && !getHasMeaningfulIssues(entry)) return false;
            if (walletNeedle && !wallet.includes(walletNeedle)) return false;

            return true;
        });
    }, [
        submissions,
        labIdFilter,
        labTypeFilter,
        clarityFilter,
        recommendFilter,
        hasIssuesOnly,
        walletSearch,
    ]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const aTime = new Date(getSubmissionDate(a) || 0).getTime();
            const bTime = new Date(getSubmissionDate(b) || 0).getTime();
            return bTime - aTime;
        });
    }, [filtered]);

    const perLabSummary = useMemo(() => {
        const map = new Map();

        const parseDifficulty = (value) => {
            if (typeof value === "number" && Number.isFinite(value)) return value;
            const s = String(value ?? "").trim();
            if (!s) return null;
            const n = Number(s);
            return Number.isFinite(n) ? n : null;
        };

        for (const entry of sorted) {
            const labId = String(entry?.labId || "").trim() || "—";
            const labTitle = entry?.labTitle ?? null;
            const label = labTitle ? String(labTitle) : labId;

            const prev =
                map.get(labId) || {
                    labId,
                    label,
                    count: 0,
                    strong: 0,
                    soft: 0,
                    meaningfulIssues: 0,
                    difficultySum: 0,
                    difficultyCount: 0,
                };

            prev.count += 1;
            const reviewLevel = getReviewLevel(entry);
            if (reviewLevel === "strong") prev.strong += 1;
            else if (reviewLevel === "soft") prev.soft += 1;

            if (getHasMeaningfulIssues(entry)) prev.meaningfulIssues += 1;

            const d = parseDifficulty(entry?.difficulty);
            if (d !== null) {
                prev.difficultySum += d;
                prev.difficultyCount += 1;
            }

            // Prefer a real title if it appears later in the dataset.
            if (!prev.label || prev.label === prev.labId) {
                prev.label = label;
            } else if (!prev.label && label) {
                prev.label = label;
            }

            map.set(labId, prev);
        }

        const rows = Array.from(map.values()).map((r) => ({
            ...r,
            avgDifficulty:
                r.difficultyCount > 0 ? r.difficultySum / r.difficultyCount : null,
        }));

        rows.sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            if (b.strong !== a.strong) return b.strong - a.strong;
            return String(a.label).localeCompare(String(b.label));
        });

        return rows;
    }, [sorted]);

    const strongReviewCount = useMemo(() => sorted.filter(isStrongReview).length, [sorted]);
    const meaningfulIssuesCount = useMemo(
        () => sorted.filter((e) => getHasMeaningfulIssues(e)).length,
        [sorted]
    );
    const softReviewCount = useMemo(
        () => sorted.filter((e) => !isStrongReview(e) && isSoftReview(e)).length,
        [sorted]
    );

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4 space-y-3">
                <div>{error}</div>
                <button
                    type="button"
                    onClick={loadFeedback}
                    className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-1.5 text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!submissions) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading feedback…
            </div>
        );
    }

    const clearFilters = () => {
        setLabIdFilter("");
        setLabTypeFilter("");
        setClarityFilter("");
        setRecommendFilter("");
        setWalletSearch("");
        setHasIssuesOnly(false);
    };

    const handleExportCsv = () => {
        const filename = `admin-feedback-export-${todayIsoDate()}.csv`;
        const headers = [
            "id",
            "labId",
            "labTitle",
            "labType",
            "walletAddress",
            "submittedAt",
            "duration",
            "difficulty",
            "clarity",
            "recommend",
            "issues",
            "hasMeaningfulIssues",
            "reviewLevel",
        ];

        const rows = sorted.map((e) => {
            const submitted = getSubmissionDate(e);
            const reviewLevel = getReviewLevel(e);
            return [
                e?.id ?? "",
                e?.labId ?? "",
                e?.labTitle ?? "",
                e?.labType ?? "",
                e?.walletAddress ?? "",
                submitted ? new Date(submitted).toISOString() : "",
                e?.duration ?? "",
                e?.difficulty ?? "",
                e?.clarity ?? "",
                e?.recommend ?? "",
                e?.issues ?? "",
                String(getHasMeaningfulIssues(e)),
                reviewLevel,
            ];
        });

        const csv =
            `${headers.map(toCsvValue).join(",")}\n` +
            rows.map((r) => r.map(toCsvValue).join(",")).join("\n") +
            "\n";

        downloadBlob({
            filename,
            content: csv,
            mimeType: "text/csv;charset=utf-8",
        });
    };

    const handleExportJson = () => {
        const filename = `admin-feedback-export-${todayIsoDate()}.json`;
        const payload = {
            exportedAt: new Date().toISOString(),
            visibleCount: sorted.length,
            total: typeof totalSubmissions === "number" ? totalSubmissions : submissions?.length ?? 0,
            filters: {
                labId: labIdFilter,
                labType: labTypeFilter,
                clarity: clarityFilter,
                recommend: recommendFilter,
                hasIssues: hasIssuesOnly,
                walletSearch,
            },
            entries: sorted,
        };

        downloadBlob({
            filename,
            content: JSON.stringify(payload, null, 2),
            mimeType: "application/json;charset=utf-8",
        });
    };

    return (
        <div className="relative min-h-[calc(100vh-8rem)]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[140px]" />
                <div className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-[#4ACBFF]/20 blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-8%] h-[320px] w-[320px] rounded-full bg-[#FF67D2]/15 blur-[130px]" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                            Feedback
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                            Read and review lab feedback submissions.
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Showing {sorted.length} of {typeof totalSubmissions === "number" ? totalSubmissions : submissions.length} submissions
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <SummaryPill
                                label="Total"
                                value={typeof totalSubmissions === "number" ? totalSubmissions : submissions.length}
                                tone="slate"
                            />
                            <SummaryPill label="Strong review" value={strongReviewCount} tone="rose" />
                            <SummaryPill label="Soft review" value={softReviewCount} tone="amber" />
                            <SummaryPill label="Meaningful issues" value={meaningfulIssuesCount} tone="amber" />
                            <SummaryPill label="Visible" value={sorted.length} tone="slate" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={loadFeedback}
                            className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                        >
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                            title="Export the currently visible (filtered) entries"
                        >
                            Export CSV
                        </button>
                        <button
                            type="button"
                            onClick={handleExportJson}
                            className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                            title="Export the currently visible (filtered) entries"
                        >
                            Export JSON
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                <details className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                    <summary className="cursor-pointer select-none">
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Per-lab summary
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Based on the currently visible (filtered) entries. Click a row to filter by lab.
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Labs: <span className="font-mono">{perLabSummary.length}</span>
                            </div>
                        </div>
                    </summary>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/60 dark:bg-[#111827]/60">
                        <table className="min-w-[980px] w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3">Lab</th>
                                    <th className="px-3 py-3">Count</th>
                                    <th className="px-3 py-3">Avg difficulty</th>
                                    <th className="px-3 py-3">Strong</th>
                                    <th className="px-3 py-3">Soft</th>
                                    <th className="px-3 py-3">Meaningful issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {perLabSummary.map((row) => (
                                    <tr
                                        key={row.labId}
                                        className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors"
                                        title="Click to filter by this lab"
                                        onClick={() => setLabIdFilter(String(row.labId))}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                {row.label || row.labId}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {row.labId}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 font-mono text-slate-800 dark:text-slate-100">
                                            {row.count}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-slate-800 dark:text-slate-100">
                                            {row.avgDifficulty === null ? "—" : row.avgDifficulty.toFixed(2)}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-rose-700 dark:text-rose-200">
                                            {row.strong}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-amber-800 dark:text-amber-200">
                                            {row.soft}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-amber-800 dark:text-amber-200">
                                            {row.meaningfulIssues}
                                        </td>
                                    </tr>
                                ))}
                                {perLabSummary.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-6 text-slate-600 dark:text-slate-300" colSpan={6}>
                                            No entries available for summary (check filters).
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </details>

                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Lab ID
                            </label>
                            <input
                                value={labIdFilter}
                                onChange={(e) => setLabIdFilter(e.target.value)}
                                placeholder="e.g. wallets-keys"
                                className="mt-1 w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Lab type
                            </label>
                            <select
                                value={labTypeFilter}
                                onChange={(e) => setLabTypeFilter(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            >
                                <option value="">All</option>
                                {labTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Clarity
                            </label>
                            <select
                                value={clarityFilter}
                                onChange={(e) => setClarityFilter(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            >
                                <option value="">All</option>
                                {clarityValues.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Recommend
                            </label>
                            <select
                                value={recommendFilter}
                                onChange={(e) => setRecommendFilter(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            >
                                <option value="">All</option>
                                {recommendValues.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Wallet search
                            </label>
                            <input
                                value={walletSearch}
                                onChange={(e) => setWalletSearch(e.target.value)}
                                placeholder="0x…"
                                className="mt-1 w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                            type="checkbox"
                            checked={hasIssuesOnly}
                            onChange={(e) => setHasIssuesOnly(e.target.checked)}
                            className="h-4 w-4 accent-fuchsia-600"
                        />
                        Has issues text
                    </label>

                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/60 dark:bg-[#111827]/60">
                        <table className="min-w-[1200px] w-full table-fixed text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 w-[240px]">Lab</th>
                                    <th className="px-3 py-3 w-[120px]">Type</th>
                                    <th className="px-3 py-3 w-[120px]">Account</th>
                                    <th className="px-3 py-3 w-[120px]">Submitted</th>
                                    <th className="px-3 py-3 w-[90px]">Duration</th>
                                    <th className="px-3 py-3 w-[95px]">Difficulty</th>
                                    <th className="px-3 py-3 w-[95px]">Clarity</th>
                                    <th className="px-3 py-3 w-[110px]">Recommend</th>
                                    <th className="px-4 py-3 w-[420px]">Issues</th>
                                    <th className="px-4 py-3 w-[140px] text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {sorted.map((entry) => {
                                    const id = entry?.id ?? `${entry?.walletAddress ?? "unknown"}:${String(getSubmissionDate(entry) ?? "")}`;
                                    const expanded = expandedId === id;
                                    const reviewLevel = getReviewLevel(entry);
                                    const strong = reviewLevel === "strong";
                                    const soft = reviewLevel === "soft";
                                    const title = entry?.labTitle ?? null;
                                    const labLabel = title ? title : entry?.labId || "—";
                                    const issuesText = String(entry?.issues ?? "").trim();
                                    const issuesMeaningful = getHasMeaningfulIssues(entry);
                                    const submittedAt = getSubmissionDate(entry);

                                    const rowBase =
                                        "cursor-pointer transition-colors " +
                                        (strong
                                            ? "bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                            : soft
                                                ? "bg-amber-50/70 dark:bg-amber-950/15 hover:bg-amber-50 dark:hover:bg-amber-950/25"
                                                : "hover:bg-slate-50/80 dark:hover:bg-slate-900/30");

                                    return (
                                        <FragmentRow
                                            key={String(id)}
                                            rowClassName={rowBase}
                                            onToggle={() => setExpandedId((prev) => (prev === id ? null : id))}
                                            expanded={expanded}
                                            entry={entry}
                                            labLabel={labLabel}
                                            title={title}
                                            issuesText={issuesText}
                                            issuesMeaningful={issuesMeaningful}
                                            submittedAt={submittedAt}
                                            reviewLevel={reviewLevel}
                                        />
                                    );
                                })}

                                {sorted.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-6 text-slate-600 dark:text-slate-300" colSpan={10}>
                                            No submissions matched these filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FragmentRow({
    rowClassName,
    onToggle,
    expanded,
    entry,
    labLabel,
    title,
    issuesText,
    issuesMeaningful,
    submittedAt,
    reviewLevel,
}) {
    const hasAnyIssuesText = issuesText.length > 0;
    const recommend = String(entry?.recommend ?? "—");
    const clarity = String(entry?.clarity ?? "—");
    const difficulty = String(entry?.difficulty ?? "—");
    const duration = entry?.duration ?? "—";
    const labType = String(entry?.labType ?? "—");
    const wallet = String(entry?.walletAddress ?? "—");

    return (
        <>
            <tr className={rowClassName} onClick={onToggle} title="Click to expand">
                <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {labLabel}
                    </div>
                    {title ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {entry?.labId || "—"}
                        </div>
                    ) : null}
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200 truncate" title={labType || "—"}>
                    {labType || "—"}
                </td>
                <td className="px-3 py-3">
                    <Link
                        to={`/admin/users/${encodeURIComponent(wallet)}`}
                        className="font-mono text-slate-800 dark:text-slate-100 underline decoration-slate-300/60 underline-offset-2 hover:decoration-slate-900 dark:hover:decoration-white"
                        title={`Open user details for ${wallet || "—"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {shortAccount(wallet)}
                    </Link>
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200" title={formatDateTime(submittedAt)}>
                    {formatDateCompact(submittedAt)}
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{String(duration ?? "—")}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{difficulty}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{clarity}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{recommend}</td>
                <td className="px-4 py-3">
                    {issuesMeaningful ? (
                        <div className="space-y-1" title={issuesText}>
                            <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-100/80 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                                Comment
                            </span>
                            <div
                                className="text-xs text-slate-700 dark:text-slate-200 whitespace-normal break-words"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {issuesText}
                            </div>
                        </div>
                    ) : (
                        <span className="text-slate-400">—</span>
                    )}
                </td>
                <td className="px-4 py-3 text-right">
                    {reviewLevel === "strong" ? (
                        <span className="inline-flex items-center rounded-full border border-rose-400/40 bg-rose-100/80 px-2 py-0.5 text-xs font-semibold text-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
                            Strong review
                        </span>
                    ) : reviewLevel === "soft" ? (
                        <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-100/80 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                            Soft review
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-100/70 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
                            OK
                        </span>
                    )}
                </td>
            </tr>

            {expanded ? (
                <tr className="bg-white/60 dark:bg-[#0b0f17]/60">
                    <td className="px-4 py-4" colSpan={10}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-white/10 bg-white/80 p-4 dark:bg-[#111827]/70">
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Submission
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-slate-800 dark:text-slate-100">
                                    <div>
                                        <span className="font-semibold">Lab:</span> {labLabel}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Lab type:</span> {labType || "—"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Account:</span>{" "}
                                        <span className="font-mono break-all">{wallet || "—"}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Submitted:</span> {formatDateTime(submittedAt)}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/80 p-4 dark:bg-[#111827]/70">
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Ratings
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-800 dark:text-slate-100">
                                    <div className="rounded-lg border border-white/10 bg-white/70 px-3 py-2 dark:bg-slate-900/40">
                                        <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Duration
                                        </div>
                                        <div className="font-semibold">{String(duration ?? "—")}</div>
                                    </div>
                                    <div className="rounded-lg border border-white/10 bg-white/70 px-3 py-2 dark:bg-slate-900/40">
                                        <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Difficulty
                                        </div>
                                        <div className="font-semibold">{difficulty}</div>
                                    </div>
                                    <div className="rounded-lg border border-white/10 bg-white/70 px-3 py-2 dark:bg-slate-900/40">
                                        <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Clarity
                                        </div>
                                        <div className="font-semibold">{clarity}</div>
                                    </div>
                                    <div className="rounded-lg border border-white/10 bg-white/70 px-3 py-2 dark:bg-slate-900/40">
                                        <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Recommend
                                        </div>
                                        <div className="font-semibold">{recommend}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/80 p-4 dark:bg-[#111827]/70">
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Issues / Comments
                                </div>
                                <div className="mt-2 text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                                    {issuesMeaningful ? (
                                        issuesText
                                    ) : hasAnyIssuesText ? (
                                        <span className="text-slate-500 dark:text-slate-400">
                                            No meaningful issues (placeholder value).
                                        </span>
                                    ) : (
                                        "—"
                                    )}
                                </div>
                            </div>
                        </div>

                        <details className="mt-4 rounded-xl border border-white/10 bg-white/70 dark:bg-[#111827]/50 px-4 py-3">
                            <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Debug view (raw JSON)
                            </summary>
                            <pre className="mt-3 overflow-x-auto text-xs text-slate-700 dark:text-slate-200">
                                {JSON.stringify(entry, null, 2)}
                            </pre>
                        </details>
                    </td>
                </tr>
            ) : null}
        </>
    );
}

function SummaryPill({ label, value, tone = "slate" }) {
    const tones = {
        slate: "border-white/10 bg-white/70 text-slate-800 dark:bg-slate-900/50 dark:text-slate-100",
        rose: "border-rose-400/30 bg-rose-100/70 text-rose-900 dark:bg-rose-950/25 dark:text-rose-200",
        amber: "border-amber-400/30 bg-amber-100/70 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200",
    };

    return (
        <div
            className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                tones[tone] || tones.slate,
            ].join(" ")}
        >
            <span className="uppercase tracking-wide opacity-70">{label}</span>
            <span className="font-mono">{String(value ?? 0)}</span>
        </div>
    );
}

