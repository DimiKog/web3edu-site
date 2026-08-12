import { useCallback, useId, useMemo, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import DashboardCard from "./DashboardCard.jsx";
import { shortAddress } from "./identity-ui.jsx";
import { useResolvedIdentityContext } from "../hooks/useResolvedIdentityContext.js";
import { useProfileAnchorStatus } from "../hooks/useProfileAnchorStatus.js";
import {
  getVerifiableProfileCopy,
  networkLabelForChainId,
  reasonCodeToCopyKey,
} from "../content/verifiableProfileCopy.js";

const EDU_NET_EXPLORER =
  import.meta.env.VITE_BLOCK_EXPLORER_URL || "https://blockexplorer.dimikog.org";

function explorerTxUrl(txHash) {
  if (!txHash) return null;
  return `${EDU_NET_EXPLORER.replace(/\/$/, "")}/tx/${encodeURIComponent(txHash)}`;
}

function explorerAddressUrl(address) {
  if (!address) return null;
  return `${EDU_NET_EXPLORER.replace(/\/$/, "")}/address/${encodeURIComponent(address)}`;
}

function formatBlockNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString();
}

function formatTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString();
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function TruncatedProofValue({ value, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const display = useMemo(() => {
    if (!value) return "—";
    const s = String(value);
    if (s.length <= 18) return s;
    return shortAddress(s);
  }, [value]);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [value]);

  if (!value) {
    return <span className="font-mono text-xs text-slate-500 dark:text-slate-400">—</span>;
  }

  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
      <span
        className="min-w-0 truncate font-mono text-xs text-slate-800 dark:text-slate-100"
        title={String(value)}
      >
        {display}
      </span>
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={copyLabel}
        title={copied ? copiedLabel : copyLabel}
        className="shrink-0 rounded-md border border-slate-200/70 bg-slate-50/80 p-1 text-slate-500 transition hover:bg-violet-50/70 hover:text-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-violet-300"
      >
        <ClipboardDocumentIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {copied ? (
        <span className="sr-only" role="status">
          {copiedLabel}
        </span>
      ) : null}
    </span>
  );
}

function MetaRow({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm text-slate-800 dark:text-slate-100 sm:text-right">
        {children}
      </dd>
    </div>
  );
}

function StatusBadge({ tone, icon, label }) {
  const tones = {
    verified:
      "border-emerald-300/60 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-200",
    outdated:
      "border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-500/35 dark:bg-sky-950/35 dark:text-sky-100",
    neutral:
      "border-slate-300/70 bg-slate-50 text-slate-700 dark:border-slate-600/50 dark:bg-slate-900/40 dark:text-slate-200",
    invalid:
      "border-amber-300/70 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/35 dark:text-amber-50",
    unavailable:
      "border-slate-300/70 bg-slate-50 text-slate-600 dark:border-slate-600/50 dark:bg-slate-900/40 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-snug ${tones[tone] || tones.neutral}`}
      role="status"
    >
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 break-words">{label}</span>
    </span>
  );
}

function ExplorerLink({ href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300/50 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:border-indigo-600/40 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-900/50"
    >
      {label}
      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

function ExpandDetailsButton({ expanded, showLabel, hideLabel, onToggle, controlsId }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className="text-xs font-semibold text-indigo-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:text-indigo-300"
    >
      {expanded ? hideLabel : showLabel}
    </button>
  );
}

/**
 * Learner-facing Verifiable Profile / Latest Seal card.
 * Dashboard (non-compact): collapsed by default.
 * SBT (compact): always shows the full compact section.
 * @param {{ isGR?: boolean, compact?: boolean, className?: string }} props
 */
export default function VerifiableProfileCard({
  isGR = false,
  compact = false,
  className = "",
}) {
  const { canonicalIdentityAddress } = useResolvedIdentityContext();
  const { loading, data, status } = useProfileAnchorStatus(canonicalIdentityAddress);
  /** Dashboard expand state only — never persisted; each visit starts collapsed. */
  const [dashboardExpanded, setDashboardExpanded] = useState(false);
  const detailsPanelId = useId();
  const t = getVerifiableProfileCopy(isGR);

  const credential = data?.credential ?? null;
  const anchor = data?.anchor ?? null;
  const checks = data?.checks ?? null;
  const reasonCode = data?.reasonCode ?? null;

  const statusPresentation = useMemo(() => {
    // Compact SBT + expanded Dashboard keep the fuller status wording.
    const shortBadge = !compact && !dashboardExpanded;
    if (loading && !status) {
      return {
        tone: "neutral",
        label: t.statusLoading,
        icon: <QuestionMarkCircleIcon className="h-3.5 w-3.5" />,
      };
    }
    switch (status) {
      case "VERIFIED":
        return {
          tone: "verified",
          label: t.statusVerified,
          icon: <CheckBadgeIcon className="h-3.5 w-3.5" />,
        };
      case "OUTDATED":
        return {
          tone: "outdated",
          label: shortBadge ? t.statusOutdatedShort : t.statusOutdated,
          icon: <InformationCircleIcon className="h-3.5 w-3.5" />,
        };
      case "NOT_ANCHORED":
        return {
          tone: "neutral",
          label: shortBadge ? t.statusNotAnchoredShort : t.statusNotAnchored,
          icon: <QuestionMarkCircleIcon className="h-3.5 w-3.5" />,
        };
      case "INVALID":
        return {
          tone: "invalid",
          label: t.statusInvalid,
          icon: <ExclamationTriangleIcon className="h-3.5 w-3.5" />,
        };
      case "API_UNAVAILABLE":
        return {
          tone: "unavailable",
          label: t.statusUnavailable,
          icon: <InformationCircleIcon className="h-3.5 w-3.5" />,
        };
      default:
        return {
          tone: "neutral",
          label: t.statusLoading,
          icon: <QuestionMarkCircleIcon className="h-3.5 w-3.5" />,
        };
    }
  }, [loading, status, t, compact, dashboardExpanded]);

  const safeReason = useMemo(() => {
    const key = reasonCodeToCopyKey(reasonCode);
    return key ? t[key] : null;
  }, [reasonCode, t]);

  const credentialLabel = useMemo(() => {
    if (credential?.tokenId != null) {
      return `${t.credentialSbt} #${credential.tokenId}`;
    }
    return null;
  }, [credential, t.credentialSbt]);

  const originLabel = networkLabelForChainId(credential?.originChainId, isGR);
  const anchorChainLabel = networkLabelForChainId(
    anchor?.anchorChainId ?? credential?.originChainId,
    isGR
  );

  const txUrl = explorerTxUrl(anchor?.transactionHash);
  const contractUrl = explorerAddressUrl(anchor?.contractAddress);
  const sbtUrl = explorerAddressUrl(credential?.sbtContract);

  const showProof =
    status === "VERIFIED" || status === "OUTDATED" || (status === "INVALID" && Boolean(anchor));

  const collapsedFreshness = useMemo(() => {
    switch (status) {
      case "VERIFIED":
        return t.matchesSealAlt;
      case "OUTDATED":
        return t.outdatedExplainShort;
      case "NOT_ANCHORED":
        return reasonCode === "ANCHOR_PENDING" && safeReason
          ? safeReason
          : t.notAnchoredShort;
      case "INVALID":
        return t.invalidShort;
      case "API_UNAVAILABLE":
        return t.statusUnavailable;
      default:
        return loading ? t.statusLoading : null;
    }
  }, [status, t, reasonCode, safeReason, loading]);

  const collapsedSealLine =
    anchor?.snapshotVersion != null
      ? `${t.latestSealShort} · ${t.snapshotVersionShortPrefix}${anchor.snapshotVersion}`
      : null;

  const blockLabel = formatBlockNumber(anchor?.blockNumber);

  const deepDetailsPanel = showProof && (anchor || credential) ? (
    <dl className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/60 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900/30">
      {anchor?.schemaVersion != null ? (
        <MetaRow label={t.schemaVersion}>{anchor.schemaVersion}</MetaRow>
      ) : null}
      {credential?.credentialId ? (
        <MetaRow label={t.credentialId}>
          <TruncatedProofValue
            value={credential.credentialId}
            copyLabel={t.copyValue}
            copiedLabel={t.copied}
          />
        </MetaRow>
      ) : null}
      {credential?.sbtContract ? (
        <MetaRow label={t.sbtContract}>
          <TruncatedProofValue
            value={credential.sbtContract}
            copyLabel={t.copyValue}
            copiedLabel={t.copied}
          />
        </MetaRow>
      ) : null}
      {anchor?.contractAddress ? (
        <MetaRow label={t.profileAnchorContract}>
          <TruncatedProofValue
            value={anchor.contractAddress}
            copyLabel={t.copyValue}
            copiedLabel={t.copied}
          />
        </MetaRow>
      ) : null}
      {credential?.tokenId != null ? (
        <MetaRow label={t.tokenId}>{String(credential.tokenId)}</MetaRow>
      ) : null}
      {checks ? (
        <>
          <MetaRow label={t.checkLocal}>
            {checks.localSnapshotValid ? t.yes : t.no}
          </MetaRow>
          <MetaRow label={t.checkBinding}>
            {checks.credentialBindingValid ? t.yes : t.no}
          </MetaRow>
          <MetaRow label={t.checkOnChain}>
            {checks.onChainAnchorValid ? t.yes : t.no}
          </MetaRow>
          <MetaRow label={t.checkCurrent}>
            {checks.currentProfileMatches ? t.yes : t.no}
          </MetaRow>
        </>
      ) : null}
    </dl>
  ) : null;

  const fullProofSection = ({ includeSbtLink, includeDeepDetails }) =>
    showProof && (anchor || credential) ? (
      <div className="space-y-2">
        {anchor?.snapshotVersion != null ? (
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {t.latestSealedSnapshot}
            <span className="ml-2 font-normal text-slate-600 dark:text-slate-300">
              {t.snapshotVersion} {anchor.snapshotVersion}
            </span>
          </p>
        ) : null}

        <dl className="space-y-2 rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
          {credentialLabel ? (
            <MetaRow label={t.credential}>{credentialLabel}</MetaRow>
          ) : null}
          <MetaRow label={compact ? t.originNetwork : t.network}>{originLabel}</MetaRow>
          {anchor?.anchorChainId != null &&
          Number(anchor.anchorChainId) !== Number(credential?.originChainId) ? (
            <MetaRow label={t.anchorNetwork}>{anchorChainLabel}</MetaRow>
          ) : null}
          {anchor?.blockNumber != null ? (
            <MetaRow label={t.block}>{formatBlockNumber(anchor.blockNumber)}</MetaRow>
          ) : null}
          {formatTimestamp(anchor?.anchoredAt || anchor?.onChainTimestamp) ? (
            <MetaRow label={t.anchoredAt}>
              {formatTimestamp(anchor?.anchoredAt || anchor?.onChainTimestamp)}
            </MetaRow>
          ) : null}
          {anchor?.digest ? (
            <MetaRow label={t.digest}>
              <TruncatedProofValue
                value={anchor.digest}
                copyLabel={t.copyValue}
                copiedLabel={t.copied}
              />
            </MetaRow>
          ) : null}
          {anchor?.transactionHash ? (
            <MetaRow label={t.transaction}>
              <TruncatedProofValue
                value={anchor.transactionHash}
                copyLabel={t.copyValue}
                copiedLabel={t.copied}
              />
            </MetaRow>
          ) : null}
        </dl>

        <div className="flex flex-wrap gap-2">
          <ExplorerLink href={txUrl} label={t.viewTransaction} />
          <ExplorerLink href={contractUrl} label={t.viewContract} />
          {includeSbtLink ? (
            <ExplorerLink href={sbtUrl} label={t.viewSbtContract} />
          ) : null}
        </div>

        {includeDeepDetails ? deepDetailsPanel : null}
      </div>
    ) : null;

  const statusMessagesExpanded = (
    <>
      {status === "API_UNAVAILABLE" ? (
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {t.unavailableExplain}
        </p>
      ) : null}

      {status === "NOT_ANCHORED" ? (
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {reasonCode === "ANCHOR_PENDING" && safeReason
            ? safeReason
            : t.notAnchoredExplain}
        </p>
      ) : null}

      {status === "INVALID" ? (
        <div className="space-y-1.5 rounded-xl border border-amber-300/50 bg-amber-50/80 px-3 py-2.5 dark:border-amber-500/35 dark:bg-amber-950/25">
          <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-50">
            {t.invalidExplain}
          </p>
          {safeReason ? (
            <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-100/90">
              {safeReason}
            </p>
          ) : null}
        </div>
      ) : null}

      {status === "VERIFIED" ? (
        <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-200">
          {t.matchesSeal}
        </p>
      ) : null}

      {status === "OUTDATED" ? (
        <div className="space-y-2 rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2.5 dark:border-sky-500/30 dark:bg-sky-950/25">
          <p className="text-xs leading-relaxed text-sky-950 dark:text-sky-50">
            {t.outdatedExplain}
          </p>
          <dl className="space-y-1">
            <MetaRow label={t.outdatedCurrentLabel}>
              <span className="font-semibold">{t.outdatedCurrentValue}</span>
            </MetaRow>
          </dl>
        </div>
      ) : null}
    </>
  );

  /* ---------- Compact SBT body (unchanged behavior: always full) ---------- */
  if (compact) {
    const compactBody = (
      <div className="space-y-3 text-sm">
        <div className="space-y-1.5 rounded-xl border border-indigo-200/40 bg-indigo-50/40 px-3 py-2.5 dark:border-indigo-700/30 dark:bg-indigo-950/25">
          <p className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-200">
            {t.conceptSbt}
          </p>
          <p className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-200">
            {t.conceptSeal}
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {t.conceptNote}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            tone={statusPresentation.tone}
            icon={statusPresentation.icon}
            label={statusPresentation.label}
          />
        </div>

        {statusMessagesExpanded}
        {fullProofSection({ includeSbtLink: false, includeDeepDetails: false })}

        {loading && status ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400" aria-live="polite">
            {t.statusLoading}
          </p>
        ) : null}
      </div>
    );

    return (
      <section
        className={`rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-white/90 via-indigo-50/40 to-slate-100/40 p-5 shadow-md backdrop-blur-xl dark:border-indigo-800/40 dark:from-slate-900/70 dark:via-indigo-900/30 dark:to-slate-900/60 ${className}`}
        aria-label={t.latestSeal}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] shadow-md">
            <ShieldCheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {t.latestSeal}
          </h2>
        </div>
        {compactBody}
      </section>
    );
  }

  /* ---------- Dashboard: collapsed by default ---------- */
  const dashboardBody = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge
          tone={statusPresentation.tone}
          icon={statusPresentation.icon}
          label={statusPresentation.label}
        />
      </div>

      {collapsedSealLine ? (
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
          {collapsedSealLine}
        </p>
      ) : null}

      {credentialLabel ? (
        <p className="text-xs text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {t.credential}:{" "}
          </span>
          {credentialLabel}
        </p>
      ) : null}

      {blockLabel ? (
        <p className="text-xs text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {t.block}:{" "}
          </span>
          {blockLabel}
        </p>
      ) : null}

      {!dashboardExpanded && collapsedFreshness ? (
        <p
          className={`text-xs leading-relaxed ${
            status === "VERIFIED"
              ? "text-emerald-800 dark:text-emerald-200"
              : status === "OUTDATED"
                ? "text-sky-900 dark:text-sky-100"
                : status === "INVALID"
                  ? "text-amber-950 dark:text-amber-50"
                  : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {collapsedFreshness}
        </p>
      ) : null}

      <ExpandDetailsButton
        expanded={dashboardExpanded}
        showLabel={t.showDetails}
        hideLabel={t.hideDetails}
        controlsId={detailsPanelId}
        onToggle={() => setDashboardExpanded((v) => !v)}
      />

      {dashboardExpanded ? (
        <div id={detailsPanelId} className="space-y-3 border-t border-slate-200/60 pt-3 dark:border-white/10">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {t.framing}
          </p>
          {statusMessagesExpanded}
          {fullProofSection({ includeSbtLink: true, includeDeepDetails: true })}
        </div>
      ) : (
        <div id={detailsPanelId} hidden />
      )}

      {loading && status ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400" aria-live="polite">
          {t.statusLoading}
        </p>
      ) : null}
    </div>
  );

  return (
    <DashboardCard
      title={t.title}
      className={`p-5 ${className}`}
      icon={<ShieldCheckIcon className="h-5 w-5 text-white" aria-hidden="true" />}
    >
      {dashboardBody}
    </DashboardCard>
  );
}
