import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { LM08_CONTRACT_INSPECTION_COPY } from "../../content/lm08ContractInspectionLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  fetchLm08ContractInspectionChallenge,
  postLm08ContractInspectionAnswers,
} from "../../utils/labWriteApi.js";

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

export default function Lm08ContractInspectionPanel({ lang = "en" }) {
  const copy = LM08_CONTRACT_INSPECTION_COPY[lang] || LM08_CONTRACT_INSPECTION_COPY.en;
  const identityArgs = useEducationalIdentityArgs();
  const apiBase = getWeb3eduBackendUrl();

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [notReadyError, setNotReadyError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [completedRecord, setCompletedRecord] = useState(null);

  const loadChallenge = useCallback(async () => {
    if (!identityArgs.idToken) {
      setLoading(false);
      setLoadError(copy.signInRequired);
      setChallenge(null);
      setNotReadyError(null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    setNotReadyError(null);

    try {
      const result = await fetchLm08ContractInspectionChallenge({
        apiBase,
        idToken: identityArgs.idToken,
      });

      if (result.ok && result.data?.ok) {
        setChallenge(result.data);
        setCompleted(Boolean(result.data.completed));
        setCompletedRecord(result.data.contractInspection ?? null);
        setNotReadyError(null);
      } else if (result.data?.ready === false) {
        setChallenge(null);
        setNotReadyError(result.data);
      } else if (!identityArgs.idToken) {
        setLoadError(copy.signInRequired);
      } else {
        setLoadError(result.data?.message || result.data?.error || copy.loading);
      }
    } catch {
      setLoadError(copy.loading);
    } finally {
      setLoading(false);
    }
  }, [apiBase, copy.loading, copy.signInRequired, identityArgs.idToken]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const questions = useMemo(() => challenge?.questions ?? [], [challenge]);

  const allAnswered = useMemo(
    () => questions.length > 0 && questions.every((q) => answers[q.id]),
    [answers, questions]
  );

  const handleSubmit = async () => {
    if (!identityArgs.idToken || !allAnswered) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await postLm08ContractInspectionAnswers({
        apiBase,
        idToken: identityArgs.idToken,
        answers,
      });

      if (result.ok && result.data?.ok) {
        setCompleted(true);
        setCompletedRecord(result.data.contractInspection ?? null);
        setSubmitError(null);
        await loadChallenge();
        return;
      }

      if (result.data?.error === "incorrect_answers") {
        setSubmitError({
          title: copy.incorrectTitle,
          hint: copy.incorrectHint,
        });
      } else {
        setSubmitError({
          title: result.data?.message || result.data?.error || copy.incorrectTitle,
          hint: copy.incorrectHint,
        });
      }
    } catch {
      setSubmitError({
        title: copy.incorrectTitle,
        hint: copy.incorrectHint,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const notReadyMessage = useMemo(() => {
    if (!notReadyError) return null;
    const code = notReadyError.error;
    if (code === "deployment_attribution_required") return copy.attributionRequired;
    return copy.coding01Required;
  }, [copy.attributionRequired, copy.coding01Required, notReadyError]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
        <div className="flex items-start gap-3 text-cyan-700 dark:text-cyan-200">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{copy.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.subtitle}</p>
          </div>
        </div>

        {loading && (
          <div className="mt-8 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {copy.loading}
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-8 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
            {loadError}
          </div>
        )}

        {!loading && notReadyMessage && (
          <div className="mt-8 space-y-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
            <div className="flex items-start gap-2 font-semibold">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{copy.notReadyTitle}</span>
            </div>
            <p>{notReadyMessage}</p>
            <Link
              to={copy.coding01Path}
              className="inline-flex font-semibold text-cyan-700 underline dark:text-cyan-200"
            >
              Coding Lab 01
            </Link>
          </div>
        )}

        {!loading && challenge && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-950/45">
              <div className="space-y-4">
                <FieldRow label={copy.contractAddressLabel} value={challenge.contractAddress} />
                <FieldRow label={copy.deployerAddressLabel} value={challenge.deployerAddress} />
                <FieldRow label={copy.deploymentTxLabel} value={challenge.deploymentTxHash} />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={challenge.explorerLinks?.contract}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                >
                  <ExternalLink className="h-4 w-4" />
                  {copy.viewContract}
                </a>
                <a
                  href={challenge.explorerLinks?.deploymentTransaction}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                >
                  <ExternalLink className="h-4 w-4" />
                  {copy.viewDeploymentTx}
                </a>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.flowHint}</p>
            </div>

            {completed ? (
              <div className="rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                <div className="flex items-start gap-2 font-semibold">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{copy.completedTitle}</span>
                </div>
                <p className="mt-2">{copy.completedHint}</p>
                {completedRecord?.completedAt && (
                  <p className="mt-2">
                    <span className="font-semibold">{copy.completedAtLabel}: </span>
                    {completedRecord.completedAt}
                  </p>
                )}
                <p className="mt-2">{copy.alreadyCompleted}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.questionsTitle}</h2>
                <div className="mt-5 space-y-6">
                  {questions.map((question) => {
                    const questionCopy = copy.questions[question.id];
                    if (!questionCopy) return null;
                    return (
                      <div key={question.id} className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {questionCopy.prompt}
                        </h3>
                        <div className="space-y-2">
                          {question.optionIds.map((optionId) => (
                            <button
                              key={optionId}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
                              }
                              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                answers[question.id] === optionId
                                  ? "border-cyan-300/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"
                                  : "border-slate-200/70 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                              }`}
                            >
                              {questionCopy.options[optionId]}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    !allAnswered || submitting
                      ? "cursor-not-allowed border border-slate-200/70 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                      : "border border-cyan-300/70 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {copy.submitting}
                    </>
                  ) : (
                    copy.submitAnswers
                  )}
                </button>

                {submitError && (
                  <div className="mt-5 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                    <div className="flex items-start gap-2 font-semibold">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{submitError.title}</span>
                    </div>
                    <p className="mt-2">{submitError.hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link
            to={copy.labsPath}
            className="text-sm font-semibold text-cyan-700 underline decoration-cyan-300/70 underline-offset-2 hover:text-cyan-600 dark:text-cyan-200"
          >
            {copy.backToLabs}
          </Link>
        </div>
      </div>
    </div>
  );
}
