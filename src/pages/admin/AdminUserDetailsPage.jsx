import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import AdminBackButton from "../../components/admin/AdminBackButton";
import { fetchAdminUserDetails, fetchAdminUsers } from "../../services/adminApi";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function formatBool(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "—";
}

function formatAddress(value) {
    if (!isNonEmptyString(value)) return "—";
    return value;
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

        const rows = [
            { label: "Displayed account", value: formatAddress(targetWallet) },
            { label: "AA / smart account", value: formatAddress(identity?.aaAddress) },
            { label: "Owner address", value: formatAddress(identity?.ownerAddress) },
            { label: "Linked wallet address", value: formatAddress(identity?.linkedWalletAddress) },
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

        return { rows, badges };
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
                            Tier: <span className="font-semibold">{data.user.tier}</span> · XP:{" "}
                            <span className="font-semibold">{data.user.xp}</span>
                        </p>
                    )}
                    <p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                        {targetWallet}
                    </p>
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
                        <KeyValueGrid rows={identitySummary.rows} />
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
                                                <span className="font-medium">Completed</span>
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

function Panel({ title, children }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0b0f17]/80 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.18)] p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">{title}</h2>
            {children}
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
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>
            {children}
        </span>
    );
}
