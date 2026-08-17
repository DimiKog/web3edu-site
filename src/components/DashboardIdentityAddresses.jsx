import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { AddressIdenticon, generateAvatarStyle } from "./identity-ui.jsx";
import { LabeledAddressField, ProgressSourceHelper } from "./LabeledAddressField.jsx";
import { resolveProgressSourceDisplayLabel } from "../utils/progressSourceWording.js";
import { resolveLinkedWalletRevokeHint } from "../utils/dashboardIdentityUi.js";

function addressesEqual(a, b) {
    if (!a || !b) return false;
    return String(a).toLowerCase() === String(b).toLowerCase();
}

/**
 * @param {"account"|"wallet-only"} profileMode
 */
export default function DashboardIdentityAddresses({
    isGR = false,
    profileMode = "account",
    identityAddress,
    linkedWallet,
    connectedWallet,
    linkedAccount,
    /** Backend progressSource: web3edu_account | linked_wallet | null (loading/unknown) */
    progressSource,
    progressSourceLabel,
    tier,
    displayTokenId,
    isLoading = false,
    showWalletOnlyProgressNote = false,
    onViewExplorer,
    onCopyIdentity,
    identityCopyFeedback = "",
}) {
    const isWalletOnly = profileMode === "wallet-only";

    const copy = isGR
        ? {
            web3eduIdentity: isWalletOnly ? "Wallet Identity" : "Web3Edu Identity",
            linkedWallet: "Linked Wallet",
            connectedWallet: "Connected Wallet",
            linkedAccount: "Device Account",
            progressSource: "Πηγή προόδου",
            copied: "Αντιγράφηκε!",
            identiconTooltip:
                "Το μοναδικό σας identity pattern — δημιουργείται από τη διεύθυνση Web3Edu Identity. Κάντε κλικ για αντιγραφή.",
            copyIdentityAria: "Αντιγραφή διεύθυνσης Web3Edu Identity",
            walletOnlyNote:
                "Βλέπεις ξεχωριστό wallet-only προφίλ. Η πρόοδος του Web3Edu Account σου δεν έχει χαθεί — συνδέσου ξανά για να τη δεις.",
        }
        : {
            web3eduIdentity: isWalletOnly ? "Wallet Identity" : "Web3Edu Identity",
            linkedWallet: "Linked Wallet",
            connectedWallet: "Connected Wallet",
            linkedAccount: "Device Account",
            progressSource: "Progress Source",
            copied: "Copied!",
            identiconTooltip:
                "Your unique identity pattern — generated from your Web3Edu Identity address. Click to copy.",
            copyIdentityAria: "Copy Web3Edu Identity address",
            walletOnlyNote:
                "You are viewing a separate wallet-only profile. Your Web3Edu Account progress is not lost — sign in again to view it.",
        };

    const showLinkedWallet =
        !isWalletOnly &&
        linkedWallet &&
        !addressesEqual(linkedWallet, identityAddress);
    const showConnectedWallet =
        isWalletOnly
            ? Boolean(connectedWallet)
            : connectedWallet &&
              !addressesEqual(connectedWallet, identityAddress) &&
              !addressesEqual(connectedWallet, linkedWallet);
    const showLinkedAccount =
        !isWalletOnly &&
        linkedAccount &&
        !addressesEqual(linkedAccount, identityAddress) &&
        !addressesEqual(linkedAccount, linkedWallet) &&
        !addressesEqual(linkedAccount, connectedWallet);

    const resolvedProgressSourceLabel = resolveProgressSourceDisplayLabel({
        isGR,
        profileMode,
        progressSource,
        progressSourceLabel,
    });

    const revokeHint = resolveLinkedWalletRevokeHint({
        isGR,
        progressSource,
        hasLinkedWallet: Boolean(showLinkedWallet),
    });

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-nowrap sm:gap-3 dark:border-slate-700/50 dark:bg-slate-900/35">
                <span className="group relative flex shrink-0">
                    <button
                        type="button"
                        onClick={onCopyIdentity}
                        aria-label={copy.copyIdentityAria}
                        aria-describedby="dashboard-identicon-tooltip"
                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-purple-400/60 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/45"
                        style={generateAvatarStyle(identityAddress, tier)}
                    >
                        <AddressIdenticon address={identityAddress} />
                        <span className="absolute inset-x-0 bottom-0 flex h-4 items-center justify-center bg-slate-950/65 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                            <ClipboardDocumentIcon className="h-3 w-3" />
                        </span>
                    </button>
                    <span
                        id="dashboard-identicon-tooltip"
                        role="tooltip"
                        className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-left text-xs font-medium leading-snug text-slate-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        {copy.identiconTooltip}
                    </span>
                </span>

                <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
                    {isLoading ? (
                        <>
                            <span className="h-4 w-14 shrink-0 animate-pulse rounded bg-slate-200/80 dark:bg-slate-700/70" />
                            <span className="h-6 w-24 shrink-0 animate-pulse rounded-full bg-purple-100/80 dark:bg-purple-900/40" />
                        </>
                    ) : (
                        <>
                            {displayTokenId != null && (
                                <span className="shrink-0 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                    #{displayTokenId}
                                </span>
                            )}
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-purple-300/40 bg-purple-100/80 px-3 py-1 text-[11px] font-semibold text-purple-700 dark:border-purple-600/60 dark:bg-purple-900/40 dark:text-purple-200">
                                <span className="inline-flex h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400" />
                                {tier ?? "Explorer"}
                            </span>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={onViewExplorer}
                        title={isGR ? "Προβολή στο block explorer" : "View on block explorer"}
                        disabled={!identityAddress}
                        className="shrink-0 rounded-lg border border-slate-200/70 bg-slate-50/80 p-1.5 text-slate-500 transition hover:bg-violet-50/70 hover:text-violet-700 disabled:opacity-40 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-violet-300"
                    >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <LabeledAddressField
                    label={copy.web3eduIdentity}
                    address={identityAddress}
                    compact
                    copiedLabel={copy.copied}
                />
                {showLinkedWallet ? (
                    <LabeledAddressField
                        label={copy.linkedWallet}
                        address={linkedWallet}
                        compact
                        copiedLabel={copy.copied}
                    />
                ) : null}
                {showConnectedWallet ? (
                    <LabeledAddressField
                        label={copy.connectedWallet}
                        address={connectedWallet}
                        compact
                        copiedLabel={copy.copied}
                    />
                ) : null}
                {showLinkedAccount ? (
                    <LabeledAddressField
                        label={copy.linkedAccount}
                        address={linkedAccount}
                        compact
                        copiedLabel={copy.copied}
                    />
                ) : null}
                <LabeledAddressField
                    label={copy.progressSource}
                    displayValue={resolvedProgressSourceLabel ?? undefined}
                    emphasize
                    compact
                    copiedLabel={copy.copied}
                />
            </div>

            <ProgressSourceHelper
                isGR={isGR}
                profileMode={profileMode}
                progressSource={progressSource}
            />

            {revokeHint ? (
                <p className="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-600/50 dark:bg-slate-900/40 dark:text-slate-200">
                    {revokeHint}
                </p>
            ) : null}

            {showWalletOnlyProgressNote ? (
                <p className="rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/25 dark:text-sky-50">
                    {copy.walletOnlyNote}
                </p>
            ) : null}

            {identityCopyFeedback ? (
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300" role="status">
                    {identityCopyFeedback}
                </p>
            ) : null}
        </div>
    );
}
