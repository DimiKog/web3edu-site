import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAdminUsers } from "../../services/adminApi";
import { getSocialIdentityCustodyType } from "../../utils/socialIdentityPayload.js";
import {
    formatLastActivityEpoch,
    formatLearnerKind,
    truncateLearnerId,
} from "../../utils/adminObservability.js";
import {
    buildLearnerDirectoryView,
    formatLearnerRegistered,
} from "../../utils/adminLearnersView.js";
import { useAdminEligibility } from "../../hooks/useAdminEligibility.js";

function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

function asArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

function pickAny(obj, paths) {
    for (const path of paths) {
        const parts = String(path).split(".");
        let cur = obj;
        for (const p of parts) {
            if (!cur || typeof cur !== "object") {
                cur = undefined;
                break;
            }
            cur = cur[p];
        }
        if (cur !== undefined && cur !== null) return cur;
    }
    return undefined;
}

/**
 * `/admin/users` rows may be flat or wrap the account under `user` / `account` / `profile`
 * while aggregates sit on the outer object. Merge so identity/social match detail shape.
 */
function mergeAdminListRow(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return row;
    const inner = row.user ?? row.account ?? row.profile;
    if (!inner || typeof inner !== "object" || Array.isArray(inner)) return row;

    const { user: _u, account: _a, profile: _p, ...rest } = row;
    return {
        ...inner,
        ...rest,
        identity: rest.identity ?? inner.identity,
        social: rest.social ?? inner.social,
        continuity: rest.continuity ?? inner.continuity,
    };
}

function normalizeImportedValue(value) {
    if (value === true) return true;
    if (value === false || value == null) return false;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
        const v = value.trim().toLowerCase();
        return v === "true" || v === "yes" || v === "1" || v === "imported";
    }
    return false;
}

function custodyLooksSocial(custody) {
    const s = String(custody ?? "").trim().toLowerCase();
    if (!s) return false;
    if (/\b(eoa|externally_owned|wallet_only|wallet-key|external_wallet)\b/.test(s)) return false;
    return (
        /\b(social|oidc|federat|broker|keycloak|custodial|idp|guest|passkey|webauthn)\b/.test(s) ||
        s.includes("social") ||
        s.includes("oidc")
    );
}

function providerLooksSocial(value) {
    const s = String(value ?? "").trim().toLowerCase();
    if (!s) return false;
    return /google|github|apple|keycloak|oidc|discord|twitter|microsoft|facebook|broker|federat/.test(s);
}

function isSocialUser(user) {
    const u = mergeAdminListRow(user);
    if (!u || typeof u !== "object") return false;

    const socialObj = u.social ?? pickAny(u, ["continuity.social", "identity.social"]);
    if (socialObj && typeof socialObj === "object" && Object.keys(socialObj).length > 0) return true;
    if (typeof socialObj === "string" && socialObj.trim().length > 0) return true;

    const sub = String(
        pickAny(u, [
            "oidcSub",
            "socialSub",
            "oidc_sub",
            "social_sub",
            "identity.oidcSub",
            "identity.socialSub",
            "identity.oidc_sub",
            "identity.subject",
            "subject",
            "identity.subjectId",
        ]) || ""
    ).trim();
    if (sub) return true;

    const socialFlags = [
        pickAny(u, ["isSocial", "is_social", "socialLogin", "social_login", "isOidc", "is_oidc"]),
        pickAny(u, ["identity.isSocial", "identity.is_social", "identity.isOidc", "identity.socialLogin"]),
    ];
    if (socialFlags.some(normalizeImportedValue)) return true;

    const custody =
        getSocialIdentityCustodyType(u) ??
        pickAny(u, ["identity.custodyType", "identity.custody_type", "custodyType", "custody_type"]);
    if (custodyLooksSocial(custody)) return true;

    const providerCandidates = [
        pickAny(u, ["provider", "providerType", "provider_type", "identityProvider", "identity_provider"]),
        pickAny(u, ["identity.provider", "identity.providerType", "identity.identityProvider"]),
        pickAny(u, ["federationLink", "federation_link", "broker", "continuity.provider"]),
    ];
    if (providerCandidates.some(providerLooksSocial)) return true;

    return false;
}

function isImportedUser(user) {
    const u = mergeAdminListRow(user);
    if (!u || typeof u !== "object") return false;

    const values = [
        u.imported,
        u.isImported,
        u.importedProgress,
        u.imported_progress,
        u.progressImported,
        u.progress_imported,
        u.hasImportedProgress,
        u.has_imported_progress,
        u.socialContinuityImported,
        u.continuityImported,
        u.importedFromWallet,
        u.imported_from_wallet,
        u.importCount,
        u.importedCount,
        u.import_count,
        u.importedFromOwner,
        u.imported_from_owner,
        u.migratedFromOwner,
        u.migrated_from_owner,
        pickAny(u, [
            "identity.hasImportedProgress",
            "identity.has_imported_progress",
            "identity.imported",
            "identity.importedFromWallet",
            "identity.imported_from_wallet",
        ]),
        pickAny(u, ["identity.importedFromOwner", "identity.imported_from_owner"]),
        pickAny(u, [
            "continuity.hasImportedProgress",
            "continuity.imported",
            "continuity.importedFromOwner",
            "continuity.imported_from_owner",
        ]),
    ];

    if (values.some(normalizeImportedValue)) return true;

    const importType = pickAny(u, [
        "importType",
        "import_type",
        "identity.importType",
        "identity.import_type",
        "continuity.importType",
    ]);
    if (typeof importType === "string" && importType.trim().length > 0) return true;

    const importedAt = pickAny(u, [
        "importedAt",
        "imported_at",
        "identity.importedAt",
        "identity.imported_at",
        "progressImportedAt",
        "progress_imported_at",
    ]);
    if (importedAt != null && importedAt !== false) {
        if (typeof importedAt === "string" && importedAt.trim() === "") return false;
        return true;
    }

    const xpImported = pickAny(u, ["importedXp", "imported_xp", "xpImported", "xp_imported"]);
    if (normalizeImportedValue(xpImported)) return true;

    return false;
}

function normalizeUser(user) {
    const src = mergeAdminListRow(user);
    const identity = src?.identity && typeof src.identity === "object" ? src.identity : {};

    const tokenId =
        pickAny(src, [
            "tokenId",
            "sbtTokenId",
            "identityTokenId",
            "identity.tokenId",
            "identity.sbtTokenId",
            "token.id",
            "sbt.tokenId",
        ]) ?? null;

    const tokenIdCached = pickAny(src, ["tokenIdCached", "identity.tokenIdCached"]) ?? null;

    const linkedWallets = asArray(
        pickAny(src, ["linkedWallets", "linkedWalletAddresses", "walletsLinked", "linkedAccounts", "walletLinks"])
    )
        .map((v) => String(v || "").trim())
        .filter(Boolean);

    const walletLinked =
        Boolean(identity?.walletLinked) || Boolean(identity?.linkedWalletAddress);

    const linkedWalletAddress = String(identity?.linkedWalletAddress || "").trim();
    const effectiveLinkedWallets = [
        ...(linkedWalletAddress ? [linkedWalletAddress] : []),
        ...linkedWallets,
    ].filter(Boolean);

    const hasSocial = isSocialUser(src);
    const learnerKindRaw = String(
        pickAny(src, ["learnerKind", "learner_kind", "canonicalLearnerKind"]) || ""
    ).trim();

    const socialRegisteredAt =
        pickAny(src, [
            "socialRegisteredAt",
            "social_registered_at",
            "identity.social.createdAt",
            "social.createdAt",
        ]) ?? null;

    const lastActivityRaw = src?.lastActivityEpoch ?? src?.lastActiveAtEpoch;
    const lastActivityEpoch =
        lastActivityRaw == null || lastActivityRaw === ""
            ? null
            : Number.isFinite(Number(lastActivityRaw))
                ? Number(lastActivityRaw)
                : null;

    const provisioningStatus = String(identity?.provisioningStatus || "").trim();

    return {
        wallet: src?.progressAddress || src?.wallet || src?.address || "—",
        progressAddress: src?.progressAddress || src?.wallet || src?.address || null,
        learnerId: src?.learnerId || null,
        learnerKind: learnerKindRaw || null,
        learnerKindLabel: formatLearnerKind(learnerKindRaw, { hasSocial }),
        socialRegisteredAt,
        xp: toNumber(src?.xp ?? src?.totalXp, 0),
        lastActivityEpoch,
        tokenId,
        tokenIdCached,
        linkedWallets: effectiveLinkedWallets,
        hasLinkedWallets: walletLinked || effectiveLinkedWallets.length > 0,
        hasSocial,
        hasImportedProgress: isImportedUser(src),
        provisioningStatus,
        raw: user,
    };
}

function truncateAddress(address, head = 6, tail = 4) {
    const s = String(address || "").trim();
    if (!s || s === "—") return "—";
    if (s.length <= head + tail + 1) return s;
    return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

const ALLOWED_SORT_KEYS = new Set(["xp", "registered", "lastActivity"]);

export default function AdminUsersPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { idToken } = useAdminEligibility();

    const initialSort = ALLOWED_SORT_KEYS.has(searchParams.get("sort"))
        ? searchParams.get("sort")
        : "lastActivity";

    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [sortKey, setSortKey] = useState(initialSort);
    const [sortDir, setSortDir] = useState(searchParams.get("dir") === "asc" ? "asc" : "desc");
    const [kindFilter, setKindFilter] = useState(searchParams.get("kind") || "all");
    const [activityFilter, setActivityFilter] = useState(searchParams.get("activity") || "any");
    const [linkedFilter, setLinkedFilter] = useState(searchParams.get("linked") || "all");
    const [importFilter, setImportFilter] = useState(searchParams.get("imported") || "all");
    const [provisioningFilter, setProvisioningFilter] = useState(searchParams.get("prov") || "all");

    const loadUsers = useCallback(() => {
        if (!idToken) {
            setError("Admin session is not available.");
            setUsers([]);
            return;
        }

        setError(null);
        fetchAdminUsers(idToken)
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    return;
                }
                if (Array.isArray(data?.users)) {
                    setUsers(data.users);
                    return;
                }
                setUsers([]);
            })
            .catch(() => {
                setError("Could not load learners.");
                setUsers([]);
            });
    }, [idToken]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const { population, sortedUsers, provisioningOptions, totalUsers } = useMemo(() => {
        const normalizedUsers = (users ?? []).map(normalizeUser);
        const view = buildLearnerDirectoryView(normalizedUsers, {
            searchTerm,
            kindFilter,
            activityFilter,
            linkedFilter,
            importFilter,
            provisioningFilter,
            sortKey,
            sortDir,
        });

        const provisioningOptions = Array.from(
            new Set(
                normalizedUsers
                    .map((u) => String(u.provisioningStatus || "").trim())
                    .filter(Boolean)
            )
        ).sort((a, b) => a.localeCompare(b));

        return {
            population: view.population,
            sortedUsers: view.sorted,
            provisioningOptions,
            totalUsers: view.population.total,
        };
    }, [
        users,
        searchTerm,
        kindFilter,
        activityFilter,
        linkedFilter,
        importFilter,
        provisioningFilter,
        sortKey,
        sortDir,
    ]);

    if (error) {
        return (
            <div className="max-w-4xl space-y-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                <div>{error}</div>
                <button
                    type="button"
                    onClick={loadUsers}
                    className="rounded-lg border border-red-300/40 bg-red-500/20 px-3 py-1.5 text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!users) {
        return (
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 px-6 py-4 text-slate-700 backdrop-blur-xl dark:bg-[#0b0f17]/80 dark:text-slate-200">
                Loading learners…
            </div>
        );
    }

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
            return;
        }
        setSortKey(key);
        setSortDir("desc");
    };

    const sortIndicator = (key) => {
        if (sortKey !== key) return "";
        return sortDir === "desc" ? " ↓" : " ↑";
    };

    return (
        <div className="relative min-h-[calc(100vh-8rem)] space-y-5">
            <div>
                <h1 className="bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                    Learners
                </h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    Canonical learner roster, identity, and activity
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <KpiCard label="Total learners" value={population.total} accent="cyan" />
                <KpiCard label="Social learners" value={population.social} accent="emerald" />
                <KpiCard label="Wallet-only learners" value={population.walletOnly} accent="slate" />
                <KpiCard label="Active — 30d" value={population.active30d} accent="cyan" />
            </div>

            <div className="rounded-2xl border border-cyan-300/25 bg-white/70 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-500/20 dark:bg-[#0b0f17]/80 md:p-5">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Click a row for learner overview.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Showing <span className="font-semibold">{sortedUsers.length}</span> of{" "}
                        <span className="font-semibold">{totalUsers}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-4">
                        <FilterLabel>Search</FilterLabel>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Progress address, learner id, or token id…"
                            className={filterControlClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
                        <div>
                            <FilterLabel>Kind</FilterLabel>
                            <select
                                value={kindFilter}
                                onChange={(e) => setKindFilter(e.target.value)}
                                className={filterControlClass}
                            >
                                <option value="all">All</option>
                                <option value="social">Social</option>
                                <option value="wallet_only">Wallet-only</option>
                            </select>
                        </div>
                        <div>
                            <FilterLabel>Activity</FilterLabel>
                            <select
                                value={activityFilter}
                                onChange={(e) => setActivityFilter(e.target.value)}
                                className={filterControlClass}
                            >
                                <option value="any">Any</option>
                                <option value="active7d">Active 7d</option>
                                <option value="active30d">Active 30d</option>
                                <option value="inactive30d">No recent activity</option>
                            </select>
                        </div>
                        <div>
                            <FilterLabel>Linked</FilterLabel>
                            <select
                                value={linkedFilter}
                                onChange={(e) => setLinkedFilter(e.target.value)}
                                className={filterControlClass}
                            >
                                <option value="all">Any</option>
                                <option value="has">Yes</option>
                                <option value="none">No</option>
                            </select>
                        </div>
                        <div>
                            <FilterLabel>Imported</FilterLabel>
                            <select
                                value={importFilter}
                                onChange={(e) => setImportFilter(e.target.value)}
                                className={filterControlClass}
                            >
                                <option value="all">Any</option>
                                <option value="has">Yes</option>
                                <option value="none">No</option>
                            </select>
                        </div>
                        <div>
                            <FilterLabel>Provisioning</FilterLabel>
                            <select
                                value={provisioningFilter}
                                onChange={(e) => setProvisioningFilter(e.target.value)}
                                className={filterControlClass}
                            >
                                <option value="all">Any</option>
                                {provisioningOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/60 md:overflow-visible dark:bg-[#0b0f17]/70">
                    <table className="w-full table-fixed text-sm">
                        <colgroup>
                            <col className="w-[18%]" />
                            <col className="w-[10%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                            <col className="w-[8%]" />
                            <col className="w-[8%]" />
                            <col className="w-[9%]" />
                            <col className="w-[19%]" />
                        </colgroup>
                        <thead className="bg-white/80 dark:bg-[#111827]/80">
                            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                <th className="px-2 py-2 font-semibold">Progress address</th>
                                <th className="px-2 py-2 text-center font-semibold">Kind</th>
                                <th className="px-2 py-2 text-center font-semibold">
                                    <SortButton
                                        onClick={() => toggleSort("registered")}
                                        label={`Registered${sortIndicator("registered")}`}
                                    />
                                </th>
                                <th className="px-2 py-2 text-center font-semibold">
                                    <SortButton
                                        onClick={() => toggleSort("lastActivity")}
                                        label={`Last activity${sortIndicator("lastActivity")}`}
                                    />
                                </th>
                                <th className="px-2 py-2 text-center font-semibold">
                                    <SortButton
                                        onClick={() => toggleSort("xp")}
                                        label={`XP${sortIndicator("xp")}`}
                                    />
                                </th>
                                <th className="px-2 py-2 text-center font-semibold">Linked</th>
                                <th className="px-2 py-2 text-center font-semibold">Imported</th>
                                <th className="px-2 py-2 text-center font-semibold">Provisioning</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => {
                                const shortId = truncateLearnerId(user.learnerId);
                                const registeredLabel = formatLearnerRegistered(user);
                                const kindTone =
                                    user.learnerKindLabel === "Social"
                                        ? "emerald"
                                        : user.learnerKindLabel === "Wallet-only"
                                            ? "slate"
                                            : "slate";

                                return (
                                    <tr
                                        key={user.progressAddress || user.wallet}
                                        onClick={() =>
                                            navigate(
                                                `/admin/users/${encodeURIComponent(
                                                    user.progressAddress || user.wallet
                                                )}`,
                                                { state: { user: user.raw } }
                                            )
                                        }
                                        className="cursor-pointer border-t border-white/10 hover:bg-cyan-500/[0.04] dark:hover:bg-cyan-500/[0.06]"
                                    >
                                        <td className="px-2 py-2 font-mono text-xs text-slate-900 dark:text-slate-100">
                                            <div
                                                className="truncate underline decoration-dotted underline-offset-2"
                                                title={user.wallet}
                                            >
                                                {truncateAddress(user.wallet)}
                                            </div>
                                            {shortId ? (
                                                <div className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                                                    id {shortId}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <StatusBadge tone={kindTone}>{user.learnerKindLabel}</StatusBadge>
                                        </td>
                                        <td className="truncate px-2 py-2 text-center text-xs text-slate-700 dark:text-slate-200">
                                            {registeredLabel}
                                        </td>
                                        <td className="truncate px-2 py-2 text-center text-xs text-slate-700 dark:text-slate-200">
                                            {formatLastActivityEpoch(user.lastActivityEpoch)}
                                        </td>
                                        <td className="px-2 py-2 text-center font-semibold text-slate-800 dark:text-slate-100">
                                            {user.xp}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <StatusBadge tone={user.hasLinkedWallets ? "cyan" : "slate"}>
                                                {user.hasLinkedWallets ? "Yes" : "No"}
                                            </StatusBadge>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <StatusBadge tone={user.hasImportedProgress ? "amber" : "slate"}>
                                                {user.hasImportedProgress ? "Yes" : "No"}
                                            </StatusBadge>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <StatusBadge tone="slate">
                                                {user.provisioningStatus || "—"}
                                            </StatusBadge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {sortedUsers.length === 0 ? (
                    <div className="mt-3 rounded-xl border border-amber-300/40 bg-amber-50/70 p-3 text-sm text-amber-900 dark:bg-amber-900/10 dark:text-amber-200">
                        No learners matched the current filters.
                    </div>
                ) : null}
            </div>
        </div>
    );
}

const filterControlClass =
    "w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/35 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100";

function FilterLabel({ children }) {
    return (
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {children}
        </label>
    );
}

function SortButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className="text-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
            {label}
        </button>
    );
}

const KPI_ACCENTS = {
    cyan: {
        border: "border-cyan-300/35 dark:border-cyan-500/25",
        marker: "bg-cyan-500",
    },
    emerald: {
        border: "border-emerald-300/35 dark:border-emerald-500/25",
        marker: "bg-emerald-500",
    },
    slate: {
        border: "border-slate-300/45 dark:border-slate-600/50",
        marker: "bg-slate-400 dark:bg-slate-500",
    },
};

function KpiCard({ label, value, accent = "slate" }) {
    const tone = KPI_ACCENTS[accent] || KPI_ACCENTS.slate;
    return (
        <div
            className={`rounded-2xl border bg-white/70 p-3.5 shadow-md backdrop-blur-xl dark:bg-[#0b0f17]/80 ${tone.border}`}
        >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.marker}`} aria-hidden />
                {label}
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
        </div>
    );
}

function StatusBadge({ tone = "slate", children }) {
    const tones = {
        slate: "border-slate-300/40 bg-slate-500/10 text-slate-700 dark:text-slate-200",
        cyan: "border-cyan-300/40 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200",
        emerald: "border-emerald-300/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
        amber: "border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                tones[tone] || tones.slate
            }`}
        >
            {children}
        </span>
    );
}
