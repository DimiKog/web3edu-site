import { useCallback, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { shortAddress } from "./identity-ui.jsx";

function isCopyableAddress(value) {
    return typeof value === "string" && value.trim().length > 0 && value.trim() !== "—";
}

export const PROGRESS_SOURCE_HELPER_ACCOUNT_EN =
    "Project and XP progress is tied to your Web3Edu Account.";

export const PROGRESS_SOURCE_HELPER_ACCOUNT_GR =
    "Η πρόοδος projects και XP συνδέεται με τον Web3Edu Account σου.";

export const PROGRESS_SOURCE_HELPER_WALLET_EN =
    "This wallet-only profile is separate from your Web3Edu Account progress. Sign in with your Web3Edu Account to view that progress.";

export const PROGRESS_SOURCE_HELPER_WALLET_GR =
    "Αυτό το wallet-only προφίλ είναι ξεχωριστό από την πρόοδο του Web3Edu Account σου. Συνδέσου με Web3Edu Account για να δεις εκείνη την πρόοδο.";

/** @deprecated Use profileMode-specific helpers via ProgressSourceHelper */
export const PROGRESS_SOURCE_HELPER_EN = PROGRESS_SOURCE_HELPER_ACCOUNT_EN;

/** @deprecated Use profileMode-specific helpers via ProgressSourceHelper */
export const PROGRESS_SOURCE_HELPER_GR = PROGRESS_SOURCE_HELPER_ACCOUNT_GR;

export function LabeledAddressField({
    label,
    address,
    displayValue,
    hint,
    emphasize = false,
    compact = false,
    copiedLabel = "Copied!",
}) {
    const [copied, setCopied] = useState(false);
    const copyable = isCopyableAddress(address) && !displayValue;

    const handleCopy = useCallback(async () => {
        if (!copyable || !address) return;
        try {
            await navigator.clipboard.writeText(address.trim());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }, [address, copyable]);

    const hasDisplayValue = typeof displayValue === "string" && displayValue.trim().length > 0;

    if (!copyable && !hasDisplayValue && !hint) {
        return (
            <div className={`rounded-xl border border-slate-200/70 bg-white/45 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04] ${emphasize ? "border-violet-300/60 bg-violet-50/50 dark:border-violet-700/30 dark:bg-violet-950/20" : ""}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">—</p>
            </div>
        );
    }

    return (
        <div
            className={`rounded-xl border px-3 py-2.5 ${
                emphasize
                    ? "border-violet-300/60 bg-violet-50/55 dark:border-violet-700/30 dark:bg-violet-950/20"
                    : "border-slate-200/70 bg-white/45 dark:border-white/10 dark:bg-white/[0.04]"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    {hasDisplayValue ? (
                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {displayValue}
                        </p>
                    ) : copyable ? (
                        <p
                            className={`mt-1 font-mono text-slate-800 dark:text-slate-100 break-all ${compact ? "text-xs" : "text-xs sm:text-sm"}`}
                            title={address}
                        >
                            {compact ? shortAddress(address) : address}
                        </p>
                    ) : (
                        <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">—</p>
                    )}
                    {hint ? (
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                            {hint}
                        </p>
                    ) : null}
                </div>
                {copyable ? (
                    <button
                        type="button"
                        onClick={handleCopy}
                        title={copied ? copiedLabel : `Copy ${label}`}
                        className="shrink-0 rounded-lg border border-slate-200/70 bg-slate-50/80 p-1.5 text-slate-500 transition hover:bg-violet-50/70 hover:text-violet-700 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-violet-300"
                    >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                ) : null}
            </div>
            {copied ? (
                <p className="mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300" role="status">
                    {copiedLabel}
                </p>
            ) : null}
        </div>
    );
}

export function ProgressSourceHelper({ isGR = false, profileMode = "account", className = "" }) {
    const copy =
        profileMode === "wallet-only"
            ? isGR
                ? PROGRESS_SOURCE_HELPER_WALLET_GR
                : PROGRESS_SOURCE_HELPER_WALLET_EN
            : isGR
              ? PROGRESS_SOURCE_HELPER_ACCOUNT_GR
              : PROGRESS_SOURCE_HELPER_ACCOUNT_EN;

    return (
        <p className={`text-xs leading-relaxed text-slate-600 dark:text-slate-300 ${className}`}>
            {copy}
        </p>
    );
}
