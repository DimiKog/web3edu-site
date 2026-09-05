import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import {
  LM08_POST_PASS_RATIONALES,
  getLm08AssessmentCopy,
} from "../../content/lm08AssessmentLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  fetchLm08AssessmentChallenge,
  postLm08AssessmentAnswers,
} from "../../utils/labWriteApi.js";
import {
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
} from "../../utils/lm08AssessmentView.js";

function emptyAnswers(questions) {
  const next = {};
  for (const q of questions) {
    next[q.id] = q.type === "multiple_select" ? [] : "";
  }
  return next;
}

export default function Lm08AssessmentPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm08AssessmentCopy(locale);
  const rationales =
    LM08_POST_PASS_RATIONALES[locale] || LM08_POST_PASS_RATIONALES.en;
  const identityArgs = useEducationalIdentityArgs();
  const { refetch: refetchResolvedIdentity } = useResolvedIdentityContext();
  const apiBase = getWeb3eduBackendUrl();
  const assessmentTopRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [optionOrders, setOptionOrders] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const refreshProgression = useCallback(async () => {
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
  }, [refetchResolvedIdentity]);

  const loadChallenge = useCallback(async () => {
    if (!identityArgs.idToken) {
      setLoading(false);
      setLoadError(copy.signInRequired);
      setChallenge(null);
      return;
    }

    setLoading(true);
    setLoadError(null);

    try {
      const result = await fetchLm08AssessmentChallenge({
        apiBase,
        idToken: identityArgs.idToken,
        lang: locale,
      });

      if (result.ok && result.data?.ok) {
        setChallenge(result.data);
        if (!result.data.completed) {
          const qs = result.data.questions || [];
          setAnswers(emptyAnswers(qs));
          setOptionOrders(buildShuffledOptionOrders(qs));
          setSubmitResult(null);
        } else {
          setOptionOrders({});
          setSubmitResult({
            kind: "already_passed",
            evaluation: {
              score: result.data.assessment?.score,
              total: result.data.totalQuestions,
            },
            xpAwarded: 0,
            postPassRationales: result.data.postPassRationales,
          });
        }
      } else {
        setLoadError(result.data?.message || result.data?.error || copy.loading);
      }
    } catch {
      setLoadError(copy.loading);
    } finally {
      setLoading(false);
    }
  }, [apiBase, copy.loading, copy.signInRequired, identityArgs.idToken, locale]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const questions = useMemo(() => challenge?.questions ?? [], [challenge]);

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q) => {
      const value = answers[q.id];
      if (q.type === "multiple_select") {
        return Array.isArray(value) && value.length > 0;
      }
      return typeof value === "string" && value.length > 0;
    });
  }, [answers, questions]);

  const setSingle = (questionId, canonicalId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: canonicalId }));
  };

  const toggleMulti = (questionId, canonicalId) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const next = current.includes(canonicalId)
        ? current.filter((id) => id !== canonicalId)
        : [...current, canonicalId];
      return { ...prev, [questionId]: next };
    });
  };

  const handleTryAgain = () => {
    setSubmitResult(null);
    setOptionOrders(buildShuffledOptionOrders(questions));
    try {
      assessmentTopRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    } catch {
      /* optional */
    }
  };

  const handleSubmit = async () => {
    if (!identityArgs.idToken || !allAnswered) return;

    setSubmitting(true);

    try {
      const result = await postLm08AssessmentAnswers({
        apiBase,
        idToken: identityArgs.idToken,
        answers,
        lang: locale,
      });

      if (result.ok && result.data?.ok) {
        const already = Boolean(result.data.alreadyPassed);
        setSubmitResult({
          kind: already ? "already_passed" : "passed",
          evaluation: result.data.evaluation,
          xpAwarded: result.data.xpAwarded ?? 0,
          postPassRationales: result.data.postPassRationales,
        });
        await refreshProgression();
        return;
      }

      if (result.data?.error === "assessment_failed") {
        setSubmitResult({
          kind: "failed",
          evaluation: result.data.evaluation,
          feedback: result.data.evaluation?.feedback || [],
        });
        return;
      }

      setSubmitResult({
        kind: "failed",
        evaluation: result.data?.evaluation || null,
        feedback: [
          {
            questionId: "",
            hint: result.data?.message || result.data?.error || copy.failedTitle,
          },
        ],
      });
    } catch {
      setSubmitResult({
        kind: "failed",
        evaluation: null,
        feedback: [{ questionId: "", hint: copy.failedTitle }],
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isPassed =
    submitResult?.kind === "passed" || submitResult?.kind === "already_passed";
  const isFailed = submitResult?.kind === "failed";
  const showForm = !loading && !loadError && !isPassed && !isFailed && questions.length > 0;

  const displayRationales =
    submitResult?.postPassRationales &&
    typeof submitResult.postPassRationales === "object" &&
    Object.keys(submitResult.postPassRationales).length > 0
      ? submitResult.postPassRationales
      : rationales;

  return (
    <div
      ref={assessmentTopRef}
      className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-6"
    >
      {!isPassed && (
        <div className="rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50/90 to-sky-50/60 px-4 py-3.5 dark:border-cyan-400/20 dark:from-cyan-950/30 dark:to-sky-950/15">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <BookOpen
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-300"
            />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {copy.introTitle}
            </h2>
            <span className="inline-flex rounded-full border border-cyan-200/80 bg-white/60 px-2 py-0.5 text-[0.6875rem] font-semibold text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              {copy.readFirst}
            </span>
          </div>
          <div className="mt-2.5 max-w-3xl space-y-2.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {copy.introBody ? <p>{copy.introBody}</p> : null}
            {copy.responseModeHint ? <p>{copy.responseModeHint}</p> : null}
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          {copy.loading}
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-5 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
          {loadError}
        </div>
      )}

      {!loading && !loadError && isPassed && (
        <div className="space-y-5 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-5 py-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-200" />
            <div>
              <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                {submitResult.kind === "already_passed"
                  ? copy.alreadyPassedTitle
                  : copy.passedTitle}
              </h2>
              {submitResult.evaluation?.score != null && (
                <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-800 dark:text-emerald-100">
                  {copy.passedScore(
                    submitResult.evaluation.score,
                    submitResult.evaluation.total ?? challenge?.totalQuestions ?? 7
                  )}
                </p>
              )}
              <p className="mt-1 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                {submitResult.xpAwarded > 0
                  ? copy.xpAwarded(submitResult.xpAwarded)
                  : copy.xpAlready}
              </p>
            </div>
          </div>

          <div className="text-sm leading-6 text-emerald-900 dark:text-emerald-100">
            <h3 className="font-semibold">{copy.postPassTitle}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {Object.entries(displayRationales).map(([qid, text]) => (
                <li key={qid}>{text}</li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-emerald-800/90 dark:text-emerald-200/90">
            {copy.continueLearningHint}
          </p>

          <Link
            to={copy.dashboardPath}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {copy.backToDashboard}
          </Link>
        </div>
      )}

      {!loading && !loadError && isFailed && (
        <div className="mt-5 space-y-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-5 dark:border-amber-400/20 dark:bg-amber-400/10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-200" />
            <div>
              <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-50">
                {copy.failedTitle}
              </h2>
              {submitResult.evaluation?.score != null && (
                <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-900 dark:text-amber-100">
                  {copy.failedScore(
                    submitResult.evaluation.score,
                    submitResult.evaluation.total ?? 7
                  )}
                </p>
              )}
            </div>
          </div>

          {(submitResult.feedback || []).length > 0 && (
            <div className="text-sm leading-6 text-amber-950 dark:text-amber-50">
              <h3 className="font-semibold">{copy.feedbackTitle}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {submitResult.feedback.map((item, idx) => (
                  <li key={`${item.questionId || "hint"}-${idx}`}>{item.hint}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleTryAgain}
            className="inline-flex items-center justify-center rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {copy.retry}
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-7 space-y-4 border-t border-slate-200/80 pt-5 dark:border-white/10">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {copy.questionsTitle}
          </h2>

          {questions.map((question, index) => {
            const qCopy = copy.questions[question.id];
            if (!qCopy) return null;
            const isMulti = question.type === "multiple_select";
            const selected = answers[question.id];
            const orderedIds = optionOrders[question.id] || question.optionIds || [];
            const displayRows = mapOptionsForDisplay(orderedIds, qCopy.options);

            return (
              <div key={question.id} className="space-y-2">
                <fieldset className="rounded-2xl border border-slate-200/70 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]">
                  <legend className="float-left w-full px-4 pt-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                    {index + 1}. {qCopy.prompt}
                  </legend>
                  {isMulti ? (
                    <p className="clear-both px-4 pt-1.5">
                      <span className="inline-flex max-w-full rounded-full border border-cyan-200/80 bg-cyan-50 px-2.5 py-1 text-xs font-semibold leading-5 text-cyan-800 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100">
                        {copy.multiSelectHint}
                      </span>
                    </p>
                  ) : null}
                  <div
                    className={`clear-both space-y-0.5 px-2 pb-2 ${isMulti ? "pt-1" : "pt-2"}`}
                  >
                    {displayRows.map((row) => {
                      const inputId = `${question.id}-${row.canonicalId}`;
                      const checked = isMulti
                        ? Array.isArray(selected) && selected.includes(row.canonicalId)
                        : selected === row.canonicalId;

                      return (
                        <label
                          key={row.canonicalId}
                          htmlFor={inputId}
                          className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-sm leading-6 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                        >
                          <input
                            id={inputId}
                            className="mt-1"
                            type={isMulti ? "checkbox" : "radio"}
                            name={question.id}
                            value={row.canonicalId}
                            checked={checked}
                            onChange={() =>
                              isMulti
                                ? toggleMulti(question.id, row.canonicalId)
                                : setSingle(question.id, row.canonicalId)
                            }
                          />
                          <span>
                            <span className="font-semibold">{row.visualLetter}.</span>{" "}
                            {row.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            );
          })}

          <button
            type="button"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? copy.submitting : copy.submitAnswers}
          </button>
        </div>
      )}
    </div>
  );
}
