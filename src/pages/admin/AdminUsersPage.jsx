import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import UserDistributionChart from "../../components/admin/UserDistributionChart";
import { fetchAdminUsers } from "../../services/adminApi";

function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
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

function normalizeUser(user) {
    const started = toNumber(user?.started ?? user?.startedLabs ?? user?.labsStarted, 0);
    const completed = toNumber(user?.completed ?? user?.completedLabs ?? user?.labsCompleted, 0);
    const dropOffCount = toNumber(user?.dropOff ?? user?.dropOffCount, Math.max(0, started - completed));
    const isDropOff = typeof user?.isDropOff === "boolean" ? user.isDropOff : dropOffCount > 0;

    const identity = user?.identity && typeof user.identity === "object" ? user.identity : {};
    const social = user?.social ?? null;

    const tokenId =
        pickAny(user, [
            "tokenId",
            "sbtTokenId",
            "identityTokenId",
            "identity.tokenId",
            "identity.sbtTokenId",
            "token.id",
            "sbt.tokenId",
        ]) ?? null;

    const tokenIdCached =
        pickAny(user, ["tokenIdCached", "identity.tokenIdCached"]) ?? null;

    const hasTokenRaw = pickAny(user, [
        "tokenAssigned",
        "hasToken",
        "hasSbt",
        "tokenMinted",
        "identity.hasToken",
        "identity.tokenAssigned",
        "sbt.minted",
        "sbt.exists",
    ]);
    const hasToken =
        typeof hasTokenRaw === "boolean"
            ? hasTokenRaw
            : tokenId !== null && tokenId !== undefined
                ? true
                : false;

    const linkedWallets = asArray(
        pickAny(user, ["linkedWallets", "linkedWalletAddresses", "walletsLinked", "linkedAccounts", "walletLinks"])
    )
        .map((v) => String(v || "").trim())
        .filter(Boolean);

    const socialSub = String(
        pickAny(user, ["oidcSub", "socialSub", "social.subject", "social.sub", "identity.oidcSub", "identity.socialSub"]) || ""
    ).trim();

    const walletLinked =
        Boolean(identity?.walletLinked) ||
        Boolean(identity?.linkedWalletAddress);

    const linkedWalletAddress = String(identity?.linkedWalletAddress || "").trim();
    const effectiveLinkedWallets = [
        ...(linkedWalletAddress ? [linkedWalletAddress] : []),
        ...linkedWallets,
    ].filter(Boolean);

    const hasSocial = Boolean(social && (typeof social === "object" ? Object.keys(social).length : true)) || Boolean(socialSub);

    const hasImportedProgress = Boolean(user?.hasImportedProgress) || Boolean(user?.identity?.hasImportedProgress);
    const importType = String(user?.importType || "").trim();
    const provisioningStatus = String(identity?.provisioningStatus || "").trim();

    return {
        wallet: user?.wallet || user?.address || "—",
        xp: toNumber(user?.xp ?? user?.totalXp, 0),
        tier: user?.tier || user?.level || "Explorer",
        started,
        completed,
        dropOffCount,
        isDropOff,
        lastActivityEpoch: toNumber(user?.lastActivityEpoch ?? user?.lastActiveAtEpoch, 0),
        tokenId,
        tokenIdCached,
        hasToken,
        linkedWallets: effectiveLinkedWallets,
        hasLinkedWallets: walletLinked || effectiveLinkedWallets.length > 0,
        hasSocial,
        hasImportedProgress,
        importType,
        provisioningStatus,
        socialSub,
        raw: user,
    };
}

function engagementScore(user) {
    if (user.started <= 0 && user.completed > 0) return 1;
    return user.completed / user.started;
}

function engagementClass(score) {
    if (score >= 0.8) return "text-emerald-600 dark:text-emerald-300";
    if (score >= 0.5) return "text-amber-600 dark:text-amber-300";
    return "text-rose-600 dark:text-rose-300";
}

export default function AdminUsersPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { address } = useAccount();

    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [sortKey, setSortKey] = useState(searchParams.get("sort") || "xp");
    const [sortDir, setSortDir] = useState(searchParams.get("dir") || "desc");
    const [tierFilter, setTierFilter] = useState(searchParams.get("tier") || "all");
    const [tokenFilter, setTokenFilter] = useState(searchParams.get("token") || "all"); // all|has|none
    const [linkedFilter, setLinkedFilter] = useState(searchParams.get("linked") || "all"); // all|has|none
    const [socialFilter, setSocialFilter] = useState(searchParams.get("social") || "all"); // all|has|none
    const [importFilter, setImportFilter] = useState(searchParams.get("imported") || "all"); // all|has|none
    const [provisioningFilter, setProvisioningFilter] = useState(searchParams.get("prov") || "all"); // all|<status>

    const loadUsers = () => {
        const adminWallet =
            address || localStorage.getItem("web3edu-wallet-address") || "";

        if (!adminWallet) {
            setError("Admin wallet not available. Please reconnect.");
            setUsers([]);
            return;
        }

        setError(null);
        fetchAdminUsers(adminWallet)
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
                setError("Could not load users analytics.");
                setUsers([]);
            });
    };

    useEffect(() => {
        loadUsers();
    }, [address]);

    const {
        normalizedUsers,
        totalUsers,
        builders,
        explorers,
        dropOffUsers,
        sortedUsers,
        provisioningOptions,
    } = useMemo(() => {
        const normalizedUsers = (users ?? []).map(normalizeUser);
        const totalUsers = normalizedUsers.length;
        const builders = normalizedUsers.filter((u) => String(u.tier).toLowerCase().includes("builder")).length;
        const explorers = normalizedUsers.filter((u) => String(u.tier).toLowerCase().includes("explorer")).length;
        const dropOffUsers = normalizedUsers.filter((u) => u.isDropOff).length;

        const q = searchTerm.trim().toLowerCase();
        const filteredUsers = normalizedUsers.filter((u) => {
            if (!q) return true;
            const wallet = String(u.wallet || "").toLowerCase();
            const tokenId = u.tokenId != null ? String(u.tokenId).toLowerCase() : "";
            const tokenIdCached = u.tokenIdCached != null ? String(u.tokenIdCached).toLowerCase() : "";
            const socialSub = String(u.socialSub || "").toLowerCase();
            return wallet.includes(q) || tokenId.includes(q) || tokenIdCached.includes(q) || socialSub.includes(q);
        });

        const dropoffOnly = searchParams.get("dropoffOnly") === "1";
        const scopedUsers = filteredUsers
            .filter((u) => (dropoffOnly ? u.isDropOff : true))
            .filter((u) => {
                if (tierFilter === "all") return true;
                const t = String(u.tier || "").toLowerCase();
                if (tierFilter === "explorer") return t.includes("explorer");
                if (tierFilter === "builder") return t.includes("builder");
                if (tierFilter === "architect") return t.includes("architect");
                return true;
            })
            .filter((u) => {
                if (tokenFilter === "all") return true;
                if (tokenFilter === "has") return u.hasToken === true;
                if (tokenFilter === "none") return u.hasToken === false;
                return true;
            })
            .filter((u) => {
                if (linkedFilter === "all") return true;
                if (linkedFilter === "has") return u.hasLinkedWallets === true;
                if (linkedFilter === "none") return u.hasLinkedWallets === false;
                return true;
            })
            .filter((u) => {
                if (socialFilter === "all") return true;
                if (socialFilter === "has") return u.hasSocial === true;
                if (socialFilter === "none") return u.hasSocial === false;
                return true;
            })
            .filter((u) => {
                if (importFilter === "all") return true;
                if (importFilter === "has") return u.hasImportedProgress === true || Boolean(u.importType);
                if (importFilter === "none") return !(u.hasImportedProgress === true || Boolean(u.importType));
                return true;
            })
            .filter((u) => {
                if (provisioningFilter === "all") return true;
                return String(u.provisioningStatus || "") === String(provisioningFilter);
            });

        const provisioningOptions = Array.from(
            new Set(
                normalizedUsers
                    .map((u) => String(u.provisioningStatus || "").trim())
                    .filter(Boolean)
            )
        ).sort((a, b) => a.localeCompare(b));

        const sortedUsers = [...scopedUsers].sort((a, b) => {
            const factor = sortDir === "asc" ? 1 : -1;
            if (sortKey === "xp") return factor * (a.xp - b.xp);
            if (sortKey === "completed") return factor * (a.completed - b.completed);
            if (sortKey === "dropOff") return factor * (a.dropOffCount - b.dropOffCount);
            if (sortKey === "lastActivity") return factor * ((a.lastActivityEpoch || 0) - (b.lastActivityEpoch || 0));
            return 0;
        });

        return { normalizedUsers, totalUsers, builders, explorers, dropOffUsers, sortedUsers, provisioningOptions };
    }, [users, searchTerm, searchParams, tierFilter, tokenFilter, linkedFilter, socialFilter, importFilter, provisioningFilter, sortKey, sortDir]);

    if (error) {
        return (
            <div className="max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-6 py-4 space-y-3">
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
            <div className="max-w-4xl rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200">
                Loading users analytics…
            </div>
        );
    }

    const formatLastActivity = (epoch) => {
        if (!epoch) return "—";
        try {
            const d = new Date(epoch * 1000);
            return d.toLocaleString();
        } catch {
            return "—";
        }
    };

    const isBuilderTier = (tier) => String(tier).toLowerCase().includes("builder");

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
        <div className="relative min-h-[calc(100vh-8rem)] space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text">
                    Users Analytics
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                    User-level activity and engagement indicators
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Total Users" value={totalUsers} />
                <KpiCard label="Builders" value={builders} />
                <KpiCard label="Explorers" value={explorers} />
                <KpiCard label="Drop-off Users" value={dropOffUsers} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        User Tiers
                    </h3>
                    <UserDistributionChart data={normalizedUsers} type="tier" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Engagement Level
                    </h3>
                    <UserDistributionChart data={normalizedUsers} type="engagement" />
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-6">
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-700 dark:text-slate-200">
                            Click a row for user drill-down.
                            {dropoffOnly ? (
                                <span className="ml-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-200">
                                    drop-off only
                                </span>
                            ) : null}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Showing <span className="font-semibold">{sortedUsers.length}</span> of{" "}
                            <span className="font-semibold">{totalUsers}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-5">
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Search
                            </label>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Account, token id, or social sub…"
                                className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                            />
                        </div>

                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Tier
                                    </label>
                                    <select
                                        value={tierFilter}
                                        onChange={(e) => setTierFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                                    >
                                        <option value="all">All</option>
                                        <option value="explorer">Explorer</option>
                                        <option value="builder">Builder</option>
                                        <option value="architect">Architect</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Token
                                    </label>
                                    <select
                                        value={tokenFilter}
                                        onChange={(e) => setTokenFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                                    >
                                        <option value="all">Any</option>
                                        <option value="has">Yes</option>
                                        <option value="none">No</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Linked
                                    </label>
                                    <select
                                        value={linkedFilter}
                                        onChange={(e) => setLinkedFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                                    >
                                        <option value="all">Any</option>
                                        <option value="has">Yes</option>
                                        <option value="none">No</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Social
                                    </label>
                                    <select
                                        value={socialFilter}
                                        onChange={(e) => setSocialFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                                    >
                                        <option value="all">Any</option>
                                        <option value="has">Yes</option>
                                        <option value="none">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Imported
                                    </label>
                                    <select
                                        value={importFilter}
                                        onChange={(e) => setImportFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                                    >
                                        <option value="all">Any</option>
                                        <option value="has">Yes</option>
                                        <option value="none">No</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Provisioning
                                    </label>
                                    <select
                                        value={provisioningFilter}
                                        onChange={(e) => setProvisioningFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
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
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/60 dark:bg-[#0b0f17]/70 backdrop-blur-xl">
                    <table className="min-w-full text-sm">
                        <thead className="bg-white/80 dark:bg-[#111827]/80">
                            <tr>
                                <th className="p-3 text-left text-slate-700 dark:text-slate-200">Account</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">
                                    <SortButton onClick={() => toggleSort("xp")} label={`XP${sortIndicator("xp")}`} />
                                </th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Tier</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Linked</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Social</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Imported</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Provisioning</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Started</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">
                                    <SortButton onClick={() => toggleSort("completed")} label={`Completed${sortIndicator("completed")}`} />
                                </th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">
                                    <SortButton onClick={() => toggleSort("dropOff")} label={`Drop-Off${sortIndicator("dropOff")}`} />
                                </th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">Engagement</th>
                                <th className="p-3 text-center text-slate-700 dark:text-slate-200">
                                    <SortButton onClick={() => toggleSort("lastActivity")} label={`Last Activity${sortIndicator("lastActivity")}`} />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedUsers.map((user) => {
                                const score = engagementScore(user);
                                return (
                                    <tr
                                        key={user.wallet}
                                        onClick={() => navigate(`/admin/users/${encodeURIComponent(user.wallet)}`, { state: { user: user.raw } })}
                                        className={`cursor-pointer border-t border-white/10 hover:bg-white/60 dark:hover:bg-white/5 ${user.isDropOff ? "bg-red-50/50 dark:bg-red-900/15" : ""}`}
                                    >
                                        <td className="p-3 font-mono text-xs text-slate-900 dark:text-slate-100 underline underline-offset-2 decoration-dotted">
                                            {user.wallet}
                                        </td>

                                        <td className={`p-3 text-center font-semibold ${user.xp >= 2000 ? "text-indigo-700 dark:text-indigo-300" : "text-slate-800 dark:text-slate-200"}`}>
                                            {user.xp}
                                        </td>

                                        <td className="p-3 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isBuilderTier(user.tier)
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                                            >
                                                {user.tier}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.hasLinkedWallets ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/25 dark:text-indigo-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                                                {user.hasLinkedWallets ? `${user.linkedWallets.length}` : "0"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.hasSocial ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                                                {user.hasSocial ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${(user.hasImportedProgress || user.importType) ? "bg-amber-100 text-amber-800 dark:bg-amber-900/25 dark:text-amber-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                                                {(user.hasImportedProgress || user.importType) ? "Yes" : "No"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.provisioningStatus ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                                                {user.provisioningStatus ? user.provisioningStatus : "—"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center text-slate-700 dark:text-slate-200">{user.started}</td>
                                        <td className="p-3 text-center text-slate-700 dark:text-slate-200">{user.completed}</td>
                                        <td className="p-3 text-center text-slate-700 dark:text-slate-200">{user.dropOffCount}</td>
                                        <td className={`p-3 text-center font-semibold ${engagementClass(score)}`}>
                                            {Math.round(score * 100)}%
                                        </td>
                                        <td className="p-3 text-center text-slate-700 dark:text-slate-200">{formatLastActivity(user.lastActivityEpoch)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {sortedUsers.length === 0 && (
                    <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-50/70 dark:bg-amber-900/10 p-4 text-amber-900 dark:text-amber-200">
                        No users matched the current filter. Try adjusting search or clearing drop-off scope.
                    </div>
                )}
            </div>
        </div>
    );
}

function SortButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-center text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
            {label}
        </button>
    );
}

function KpiCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl p-4 shadow-md">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {value}
            </div>
        </div>
    );
}
