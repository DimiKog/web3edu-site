import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
    AlertTriangle,
    CheckCircle2,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { LM08_SOURCE_VERIFICATION_COPY } from "../../content/lm08SourceVerificationLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import { mapSourceVerificationResponse } from "../../utils/lm08SourceVerificationView.js";
import { postLm08SourceVerification } from "../../utils/labWriteApi.js";

function FieldRow({ label, value }) {
    return (
        <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </div>
            <div className="mt-1 font-mono text-sm break-all text-slate-800 dark:text-slate-100">
                {value}
            </div>
        </div>
    );
}

export default function Lm08SourceVerificationPanel({ lang = "en" }) {
    const copy = LM08_SOURCE_VERIFICATION_COPY[lang] || LM08_SOURCE_VERIFICATION_COPY.en;
    const identityArgs = useEducationalIdentityArgs();
    const { refetch: refetchResolvedIdentity } = useResolvedIdentityContext();
    const apiBase = getWeb3eduBackendUrl();

    const [checking, setChecking] = useState(false);
    const [uiState, setUiState] = useState({ kind: "ready" });
    const [checkError, setCheckError] = useState(null);

    const runCheck = useCallback(async () => {
        if (!identityArgs.idToken) {
            setUiState({ kind: "sign_in_required" });
            setCheckError(null);
            return;
        }

        setChecking(true);
        setCheckError(null);

        try {
            const result = await postLm08SourceVerification({
                apiBase,
                idToken: identityArgs.idToken,
            });
            const mapped = mapSourceVerificationResponse(result, lang);
            setUiState(mapped);

            if (mapped.shouldRefetch) {
                try {
                    await refetchResolvedIdentity?.();
                } catch {
                    /* optional */
                }
                try {
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new Event("web3edu-progress-updated"));
                    }
                } catch {
                    /* optional */
                }
            }
        } catch {
            setCheckError(copy.explorerUnavailable);
            setUiState({ kind: "explorer_unavailable", copy });
        } finally {
            setChecking(false);
        }
    }, [apiBase, copy, identityArgs.idToken, lang, refetchResolvedIdentity]);

    const showCheckAgain =
        uiState.kind === "not_verified" || uiState.kind === "explorer_unavailable";
    const showInitialCheck = uiState.kind === "ready" || showCheckAgain;
    const isSuccess =
        uiState.kind === "success_created" || uiState.kind === "success_already";

    return (
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-950/45">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {copy.whyTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {copy.whyBody}
                    </p>
                </div>

                {uiState.kind === "sign_in_required" && (
                    <div className="mt-6 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                        {copy.signInRequired}
                    </div>
                )}

                {uiState.kind === "coding01_required" && (
                    <div className="mt-6 space-y-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                        <div className="flex items-start gap-2 font-semibold">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{copy.coding01RequiredTitle}</span>
                        </div>
                        <p>{copy.coding01RequiredBody}</p>
                        <Link
                            to={copy.coding01Path}
                            className="inline-flex font-semibold text-cyan-700 underline dark:text-cyan-200"
                        >
                            {copy.goToCoding01}
                        </Link>
                    </div>
                )}

                {uiState.kind === "integrity_failure" && (
                    <div className="mt-6 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-4 text-sm leading-7 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100">
                        <p className="font-semibold">{copy.evidenceReviewTitle}</p>
                        <p className="mt-2">{copy.evidenceReviewBody}</p>
                    </div>
                )}

                {isSuccess && (
                    <div className="mt-6 space-y-4 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                        <div className="flex items-start gap-2 font-semibold">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{copy.verificationRecorded}</span>
                        </div>
                        <p>
                            {uiState.kind === "success_already"
                                ? copy.alreadyRecorded
                                : copy.verifiedSuccess}
                        </p>
                        {uiState.contractAddress ? (
                            <FieldRow
                                label={copy.contractAddressLabel}
                                value={uiState.contractAddress}
                            />
                        ) : null}
                        {uiState.explorerUrl ? (
                            <a
                                href={uiState.explorerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {copy.openContract}
                            </a>
                        ) : null}
                        <Link
                            to={copy.dashboardPath}
                            className="inline-flex font-semibold text-emerald-800 underline dark:text-emerald-200"
                        >
                            {copy.backToDashboard}
                        </Link>
                    </div>
                )}

                {uiState.kind === "not_verified" && (
                    <div className="mt-6 space-y-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                        <div className="flex items-start gap-2 font-semibold">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{copy.notVerifiedTitle}</span>
                        </div>
                        {uiState.contractAddress ? (
                            <FieldRow
                                label={copy.contractAddressLabel}
                                value={uiState.contractAddress}
                            />
                        ) : null}
                        {uiState.explorerUrl ? (
                            <a
                                href={uiState.explorerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {copy.openContract}
                            </a>
                        ) : null}
                        <p>{copy.notVerifiedBody}</p>
                    </div>
                )}

                {uiState.kind === "explorer_unavailable" && (
                    <div className="mt-6 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                        {checkError || copy.explorerUnavailable}
                    </div>
                )}

                {uiState.kind === "ready" && (
                    <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {copy.readyTitle}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {copy.readyBody}
                        </p>
                    </div>
                )}

                {showInitialCheck && uiState.kind !== "sign_in_required" && uiState.kind !== "coding01_required" && !isSuccess && uiState.kind !== "integrity_failure" && (
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => void runCheck()}
                            disabled={checking}
                            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                checking
                                    ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                    : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                            }`}
                        >
                            {checking ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {copy.checking}
                                </>
                            ) : uiState.kind === "ready" ? (
                                copy.checkButton
                            ) : (
                                copy.checkAgainButton
                            )}
                        </button>
                    </div>
                )}
        </div>
    );
}
