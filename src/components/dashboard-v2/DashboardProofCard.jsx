import { useMemo, useState } from "react";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { useProfileAnchorStatus } from "../../hooks/useProfileAnchorStatus.js";
import {
  getVerifiableProfileCopy,
  networkLabelForChainId,
  reasonCodeToCopyKey,
} from "../../content/verifiableProfileCopy.js";
import { getDashboardCompositionCopy } from "../../content/dashboardCompositionLocale.js";

const ASSET = "/assets/dashboard-v2/dashboard-profile-anchor.png";

const EDU_NET_EXPLORER =
  import.meta.env.VITE_BLOCK_EXPLORER_URL || "https://blockexplorer.dimikog.org";

function explorerTxUrl(txHash) {
  if (!txHash) return null;
  return `${EDU_NET_EXPLORER.replace(/\/$/, "")}/tx/${encodeURIComponent(txHash)}`;
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

/**
 * Compact PROOF card — same anchor semantics as VerifiableProfileCard, denser UI + locked asset.
 */
export default function DashboardProofCard({ lang = "en", className = "" }) {
  const isGR = lang === "gr";
  const { canonicalIdentityAddress } = useResolvedIdentityContext();
  const { loading, data, status } = useProfileAnchorStatus(canonicalIdentityAddress);
  const [expanded, setExpanded] = useState(false);
  const t = getVerifiableProfileCopy(isGR);
  const copy = getDashboardCompositionCopy(lang);

  const credential = data?.credential ?? null;
  const anchor = data?.anchor ?? null;
  const reasonCode = data?.reasonCode ?? null;

  const statusPresentation = useMemo(() => {
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
          label: t.statusOutdatedShort || t.statusOutdated,
          icon: <InformationCircleIcon className="h-3.5 w-3.5" />,
        };
      case "NOT_ANCHORED":
        return {
          tone: "neutral",
          label: t.statusNotAnchoredShort || t.statusNotAnchored,
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
  }, [loading, status, t]);

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

  const network = networkLabelForChainId(
    anchor?.anchorChainId ?? credential?.originChainId,
    isGR
  );
  const txUrl = explorerTxUrl(anchor?.transactionHash);
  const safeReasonKey = reasonCodeToCopyKey(reasonCode);
  const safeReason = safeReasonKey ? t[safeReasonKey] : null;

  return (
    <section
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/45 ${className}`}
      aria-labelledby="dashboard-proof-title"
    >
      <div className="pointer-events-none absolute -right-3 top-1 h-32 w-36 opacity-85 sm:h-36 sm:w-40">
        <img
          src={ASSET}
          alt=""
          className="h-full w-full object-contain object-right-top"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 px-4 py-4 sm:px-5 sm:py-4">
        <div className="space-y-3">
          <div>
            <h2
              id="dashboard-proof-title"
              className="text-base font-bold text-slate-900 dark:text-white sm:text-lg"
            >
              {copy.proofTitle}
            </h2>
            <p className="mt-0.5 max-w-[68%] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {copy.proofSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-snug ${
                tones[statusPresentation.tone] || tones.neutral
              }`}
              role="status"
            >
              {statusPresentation.icon}
              <span className="min-w-0 break-words">{statusPresentation.label}</span>
            </span>
          </div>
        </div>

        <dl className="max-w-md space-y-2 text-sm">
          {credential?.tokenId != null ? (
            <div className="flex justify-between gap-3">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.proofSbt}
              </dt>
              <dd className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                #{credential.tokenId}
              </dd>
            </div>
          ) : null}
          {anchor?.snapshotVersion != null ? (
            <div className="flex justify-between gap-3">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.proofSnapshot}
              </dt>
              <dd className="text-xs font-semibold text-slate-900 dark:text-white">
                v{anchor.snapshotVersion}
              </dd>
            </div>
          ) : null}
          {network ? (
            <div className="flex justify-between gap-3">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.proofNetwork}
              </dt>
              <dd className="text-xs text-slate-800 dark:text-slate-100">{network}</dd>
            </div>
          ) : null}
          {formatTimestamp(anchor?.anchoredAt || anchor?.onChainTimestamp) ? (
            <div className="flex justify-between gap-3">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.proofAnchoredAt}
              </dt>
              <dd className="text-right text-xs text-slate-800 dark:text-slate-100">
                {formatTimestamp(anchor?.anchoredAt || anchor?.onChainTimestamp)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="space-y-2">
          {status === "NOT_ANCHORED" && reasonCode === "ANCHOR_PENDING" && safeReason ? (
            <p className="max-w-md text-xs text-sky-800 dark:text-sky-200">{safeReason}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              {expanded ? copy.proofHideDetails : copy.proofViewDetails}
            </button>
            {txUrl ? (
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
              >
                {copy.proofViewExplorer}
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>

          {expanded ? (
            <div className="max-w-lg space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
              <VerifiableProfileCardExpandedHint isGR={isGR} status={status} t={t} data={data} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Thin detail block — keeps anchor field semantics without importing DashboardCard shell. */
function VerifiableProfileCardExpandedHint({ isGR, status, t, data }) {
  const checks = data?.checks ?? null;
  const anchor = data?.anchor ?? null;
  const credential = data?.credential ?? null;

  return (
    <div className="space-y-2">
      <p className="leading-relaxed text-slate-600 dark:text-slate-300">{t.framing}</p>
      {status === "VERIFIED" ? (
        <p className="text-emerald-800 dark:text-emerald-200">{t.matchesSeal}</p>
      ) : null}
      {status === "OUTDATED" ? (
        <p className="text-sky-900 dark:text-sky-100">{t.outdatedExplain}</p>
      ) : null}
      {status === "INVALID" ? (
        <p className="text-amber-950 dark:text-amber-50">{t.invalidExplain}</p>
      ) : null}
      {status === "API_UNAVAILABLE" ? (
        <p>{t.unavailableExplain}</p>
      ) : null}
      {status === "NOT_ANCHORED" ? <p>{t.notAnchoredExplain}</p> : null}
      {anchor?.digest ? (
        <p className="break-all font-mono text-[10px] opacity-80">
          digest: {String(anchor.digest)}
        </p>
      ) : null}
      {credential?.credentialId ? (
        <p className="break-all font-mono text-[10px] opacity-80">
          credentialId: {String(credential.credentialId)}
        </p>
      ) : null}
      {checks ? (
        <ul className="space-y-0.5 text-[11px]">
          <li>
            {t.checkLocal}: {checks.localSnapshotValid ? t.yes : t.no}
          </li>
          <li>
            {t.checkBinding}: {checks.credentialBindingValid ? t.yes : t.no}
          </li>
          <li>
            {t.checkOnChain}: {checks.onChainAnchorValid ? t.yes : t.no}
          </li>
          <li>
            {t.checkCurrent}: {checks.currentProfileMatches ? t.yes : t.no}
          </li>
        </ul>
      ) : null}
      {!isGR ? null : null}
    </div>
  );
}
