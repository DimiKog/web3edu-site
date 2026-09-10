import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  LM03_POST_PASS_RATIONALES,
  getLm03AssessmentCopy,
} from "../../content/lm03AssessmentLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  fetchLm03AssessmentChallenge,
  postLm03AssessmentAnswers,
} from "../../utils/labWriteApi.js";
import { seedIncompleteAttemptIfNeeded } from "../../utils/assessmentAttemptStability.js";
import { buildAssessmentFeedbackRows } from "../../utils/assessmentFeedbackView.js";
import {
  buildShuffledOptionOrders,
  isLm03CriticalQuestion,
  mapOptionsForDisplay,
  LM03_PRESENTATION_PASS_MIN,
} from "../../utils/lm03AssessmentView.js";
import AssessmentChoiceList from "./assessment/AssessmentChoiceList.jsx";
import AssessmentFailState from "./assessment/AssessmentFailState.jsx";
import AssessmentMetaStrip from "./assessment/AssessmentMetaStrip.jsx";
import AssessmentPassState from "./assessment/AssessmentPassState.jsx";
import AssessmentQuestionHeader from "./assessment/AssessmentQuestionHeader.jsx";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

function emptyAnswers(questions) {
  const next = {};
  for (const q of questions) {
    next[q.id] = q.type === "multiple_select" ? [] : "";
  }
  return next;
}

export default function Lm03AssessmentPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm03AssessmentCopy(lang);
  const rationales =
    LM03_POST_PASS_RATIONALES[locale] || LM03_POST_PASS_RATIONALES.en;
  const identityArgs = useEducationalIdentityArgs();
  const { refetch: refetchResolvedIdentity } = useResolvedIdentityContext();
  const apiBase = getWeb3eduBackendUrl();
  const assessmentTopRef = useRef(null);
  const idTokenRef = useRef(identityArgs.idToken);
  const attemptSeededRef = useRef(false);
  const challengeLoadedRef = useRef(false);
  const hasIdToken = Boolean(identityArgs.idToken);
  idTokenRef.current = identityArgs.idToken;

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

  useEffect(() => {
    attemptSeededRef.current = false;
    challengeLoadedRef.current = false;
  }, [locale]);

  const loadChallenge = useCallback(async () => {
    const idToken = idTokenRef.current;
    if (!idToken) {
      attemptSeededRef.current = false;
      challengeLoadedRef.current = false;
      setLoading(false);
      setLoadError(copy.signInRequired);
      setChallenge(null);
      return;
    }

    const alreadyLoaded = challengeLoadedRef.current;
    if (!alreadyLoaded) {
      setLoading(true);
    }
    setLoadError(null);

    try {
      const result = await fetchLm03AssessmentChallenge({
        apiBase,
        idToken,
      });

      if (result.ok && result.data?.ok) {
        setChallenge(result.data);
        challengeLoadedRef.current = true;
        if (!result.data.completed) {
          const qs = result.data.questions || [];
          const seeded = seedIncompleteAttemptIfNeeded({
            attemptSeeded: attemptSeededRef.current,
            questions: qs,
            emptyAnswers,
            buildOptionOrders: buildShuffledOptionOrders,
          });
          if (seeded.seeded) {
            setAnswers(seeded.answers);
            setOptionOrders(seeded.optionOrders);
            setSubmitResult(null);
            attemptSeededRef.current = true;
          }
        } else {
          attemptSeededRef.current = true;
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
  }, [apiBase, copy.loading, copy.signInRequired]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge, hasIdToken, locale]);

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
    // Exit failed UI immediately — no validation, no API call, keep prior answers.
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
      const result = await postLm03AssessmentAnswers({
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
  const canonicalQuestionOrder = useMemo(
    () => questions.map((q) => q.id).filter(Boolean),
    [questions]
  );
  const feedbackRows = useMemo(
    () =>
      isFailed
        ? buildAssessmentFeedbackRows(
            submitResult?.feedback,
            copy,
            canonicalQuestionOrder
          )
        : [],
    [canonicalQuestionOrder, copy, isFailed, submitResult?.feedback]
  );

  const passRevisitRows = useMemo(() => {
    if (!isPassed) return [];
    const score = submitResult?.evaluation?.score;
    const total =
      submitResult?.evaluation?.total ?? challenge?.totalQuestions ?? null;
    if (
      typeof score !== "number" ||
      typeof total !== "number" ||
      !(score < total)
    ) {
      return [];
    }
    const feedback = submitResult?.evaluation?.feedback;
    if (!Array.isArray(feedback) || feedback.length === 0) return [];
    return buildAssessmentFeedbackRows(feedback, copy, canonicalQuestionOrder);
  }, [
    canonicalQuestionOrder,
    challenge?.totalQuestions,
    copy,
    isPassed,
    submitResult?.evaluation,
  ]);

  const passRevisitTitle =
    passRevisitRows.length > 1
      ? copy.revisitMany
      : passRevisitRows.length === 1
        ? copy.revisitOne
        : "";

  const displayRationales =
    submitResult?.postPassRationales &&
    typeof submitResult.postPassRationales === "object" &&
    Object.keys(submitResult.postPassRationales).length > 0
      ? submitResult.postPassRationales
      : rationales;

  const takeawayRows = useMemo(
    () =>
      Object.entries(displayRationales || {}).map(([id, text]) => ({
        id,
        text,
      })),
    [displayRationales]
  );

  const failLead = useMemo(
    () =>
      resolveAssessmentFailLead({
        evaluation: submitResult?.evaluation,
        defaultLead: copy.failedLead,
        criticalThresholdLead: copy.failedCriticalLead,
        passMinCorrect: LM03_PRESENTATION_PASS_MIN,
      }),
    [copy.failedCriticalLead, copy.failedLead, submitResult?.evaluation]
  );

  return (
    <div
      ref={assessmentTopRef}
      className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-6"
    >
      {!isPassed ? (
        <AssessmentMetaStrip
          items={copy.metaItems}
          scopeHint={copy.metaScopeHint}
          summaryLabel={copy.metaSummaryLabel}
        />
      ) : null}

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
        <AssessmentPassState
          title={
            submitResult.kind === "already_passed"
              ? copy.alreadyPassedTitle
              : copy.passedTitle
          }
          scoreLabel={
            submitResult.evaluation?.score != null
              ? copy.passedScore(
                  submitResult.evaluation.score,
                  submitResult.evaluation.total ?? challenge?.totalQuestions ?? 7
                )
              : null
          }
          xpLabel={
            submitResult.xpAwarded > 0
              ? copy.xpAwarded(submitResult.xpAwarded)
              : copy.xpAlready
          }
          youCanNowLabel={copy.youCanNow}
          capabilities={copy.passCapabilities}
          keyPrinciple={copy.keyPrinciple}
          revisitTitle={passRevisitTitle}
          revisitRows={passRevisitRows}
          reviewTakeawaysLabel={copy.reviewTakeaways}
          takeawaysTitle={copy.postPassTitle}
          takeaways={takeawayRows}
          continueHint={copy.continueLearningHint}
          dashboardPath={copy.dashboardPath}
          dashboardLabel={copy.backToDashboard}
        />
      )}

      {!loading && !loadError && isFailed && (
        <AssessmentFailState
          title={copy.failedTitle}
          scoreLabel={
            submitResult.evaluation?.score != null
              ? copy.failedScore(
                  submitResult.evaluation.score,
                  submitResult.evaluation.total ?? 7
                )
              : null
          }
          lead={failLead}
          feedbackTitle={copy.feedbackTitle}
          feedbackRows={feedbackRows}
          retryLabel={copy.retry}
          onRetry={handleTryAgain}
        />
      )}

      {showForm && (
        <div className="mt-6 space-y-4">
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
            const promptId = `${question.id}-prompt`;

            return (
              <fieldset
                key={question.id}
                className="rounded-2xl border border-slate-200/70 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]"
                aria-describedby={promptId}
              >
                {/*
                  float-left + w-full pulls <legend> out of the default border-cutout
                  rendering so multiline content sits fully inside the card padding.
                */}
                <legend className="float-left w-full px-4 pt-3">
                  <AssessmentQuestionHeader
                    number={index + 1}
                    typeLabel={isMulti ? copy.multiSelectType : copy.singleChoiceType}
                    isMultiple={isMulti}
                    heading={qCopy.heading}
                    critical={isLm03CriticalQuestion(question.id)}
                    criticalLabel={copy.criticalLabel}
                  />
                </legend>
                <p
                  id={promptId}
                  className="clear-both px-4 pt-2 text-sm leading-6 text-slate-700 dark:text-slate-300"
                >
                  {qCopy.prompt}
                </p>
                <AssessmentChoiceList
                  questionId={question.id}
                  isMultiple={isMulti}
                  rows={displayRows}
                  selected={selected}
                  onSelect={(canonicalId) =>
                    isMulti
                      ? toggleMulti(question.id, canonicalId)
                      : setSingle(question.id, canonicalId)
                  }
                />
              </fieldset>
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
