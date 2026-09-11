import { ArrowTopRightOnSquareIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { AddressIdenticon, generateAvatarStyle, shortAddress } from "../identity-ui.jsx";
import { resolveProgressSourceDisplayLabel } from "../../utils/progressSourceWording.js";
import { getDashboardCompositionCopy } from "../../content/dashboardCompositionLocale.js";

function addressesEqual(a, b) {
  if (!a || !b) return false;
  return String(a).toLowerCase() === String(b).toLowerCase();
}

/**
 * Compact Dashboard v2 identity strip — no XP-derived tier badge.
 * Optional legacyStatusLabel is a preserved historical status only (not current milestone).
 */
export default function DashboardIdentityStrip({
  lang = "en",
  profileMode = "account",
  identityAddress,
  linkedWallet,
  displayTokenId,
  progressSource,
  isLoading = false,
  onViewExplorer,
  onCopyIdentity,
  identityCopyFeedback = "",
  settingUp = false,
  deviceAccessNote = false,
  legacyStatusLabel = null,
}) {
  const copy = getDashboardCompositionCopy(lang);
  const isGR = lang === "gr";
  const isWalletOnly = profileMode === "wallet-only";

  const showLinked =
    !isWalletOnly &&
    linkedWallet &&
    !addressesEqual(linkedWallet, identityAddress);

  const progressLabel = resolveProgressSourceDisplayLabel({
    isGR,
    profileMode,
    progressSource,
  });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50 sm:px-4">
        <button
          type="button"
          onClick={onCopyIdentity}
          aria-label={copy.copyAddress}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-violet-400/50 transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/40"
          style={generateAvatarStyle(identityAddress, null)}
        >
          <AddressIdenticon address={identityAddress} />
          <span className="absolute inset-x-0 bottom-0 flex h-3.5 items-center justify-center bg-slate-950/65 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
            <ClipboardDocumentIcon className="h-2.5 w-2.5" />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {isWalletOnly ? "Wallet Identity" : copy.identityLabel}
            </span>
            {isLoading ? (
              <span className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            ) : (
              <span className="font-mono text-slate-800 dark:text-slate-100">
                {shortAddress(identityAddress)}
              </span>
            )}
            {showLinked ? (
              <>
                <span className="hidden text-slate-300 sm:inline dark:text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="text-slate-500 dark:text-slate-400">{copy.linkedWallet}</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">
                  {shortAddress(linkedWallet)}
                </span>
              </>
            ) : null}
            {displayTokenId != null && displayTokenId !== "" ? (
              <>
                <span className="hidden text-slate-300 sm:inline dark:text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="font-mono text-[11px] font-semibold text-violet-700 dark:text-violet-300 sm:text-xs">
                  {copy.sbtLabel} #{displayTokenId}
                </span>
              </>
            ) : null}
            {legacyStatusLabel ? (
              <>
                <span className="hidden text-slate-300 sm:inline dark:text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span
                  className="rounded-md border border-slate-200/70 bg-slate-50/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
                  title={legacyStatusLabel}
                >
                  {legacyStatusLabel}
                </span>
              </>
            ) : null}
          </div>
          {progressLabel ? (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {copy.progressSource}: {progressLabel}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {settingUp ? (
            <span className="rounded-full border border-amber-300/50 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/40 dark:text-amber-200">
              {copy.settingUp}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onViewExplorer}
            disabled={!identityAddress}
            title={copy.viewExplorer}
            className="rounded-lg border border-slate-200/70 bg-slate-50/80 p-1.5 text-slate-500 transition hover:bg-violet-50/70 hover:text-violet-700 disabled:opacity-40 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-400"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {identityCopyFeedback ? (
        <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300" role="status">
          {identityCopyFeedback}
        </p>
      ) : null}

      {deviceAccessNote ? (
        <p className="rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300">
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {copy.deviceAccessTitle}.{" "}
          </span>
          {copy.deviceAccessBody}
        </p>
      ) : null}
    </div>
  );
}
