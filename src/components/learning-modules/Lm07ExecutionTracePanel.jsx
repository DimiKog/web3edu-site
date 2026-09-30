import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getLm07ExecutionTraceCopy } from "../../content/lm07ExecutionTraceLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  fetchLm07ExecutionTrace,
  postLm07ExecutionTrace,
} from "../../utils/labWriteApi.js";
import {
  buildLm07ExecutionTraceScenariosPayload,
  emptyLm07ExecutionTraceForm,
  isLm07ExecutionTraceFormComplete,
  listLm07ExecutionTraceScenarios,
  LM07_SCENARIO_SCORE_INCREASE,
  LM07_SCENARIO_TRANSFER_INSUFFICIENT,
  LM07_SCENARIO_TRANSFER_SUFFICIENT,
} from "../../utils/lm07ExecutionTraceView.js";

function formatJsonSnippet(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "");
  }
}

export default function Lm07ExecutionTracePanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm07ExecutionTraceCopy(locale);
  const identityArgs = useEducationalIdentityArgs();
  const { refetch: refetchResolvedIdentity } = useResolvedIdentityContext();
  const apiBase = getWeb3eduBackendUrl();
  const hasIdToken = Boolean(identityArgs.idToken);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const [form, setForm] = useState(() => emptyLm07ExecutionTraceForm());
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
      setScenarios(null);
      return;
    }

    setLoading(true);
    setLoadError(null);

    try {
      const result = await fetchLm07ExecutionTrace({
        apiBase,
        idToken: identityArgs.idToken,
      });

      if (result.ok && result.data?.ok) {
        setScenarios(result.data.scenarios || {});
        if (result.data.completed) {
          setSubmitResult({
            kind: "already_applied",
            executionTrace: result.data.executionTrace,
          });
        } else {
          setSubmitResult(null);
          setForm(emptyLm07ExecutionTraceForm());
        }
      } else {
        setLoadError(
          result.data?.message || result.data?.error || copy.loadError
        );
      }
    } catch {
      setLoadError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [apiBase, copy.loadError, copy.signInRequired, identityArgs.idToken]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge, hasIdToken, locale]);

  const scenarioRows = useMemo(
    () => listLm07ExecutionTraceScenarios(scenarios),
    [scenarios]
  );

  const formComplete = isLm07ExecutionTraceFormComplete(form);

  const setField = (scenarioId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [scenarioId]: {
        ...(prev[scenarioId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!identityArgs.idToken || !formComplete) return;
    const payload = buildLm07ExecutionTraceScenariosPayload(form);
    if (!payload) return;

    setSubmitting(true);
    try {
      const result = await postLm07ExecutionTrace({
        apiBase,
        idToken: identityArgs.idToken,
        scenarios: payload,
      });

      if (result.ok && result.data?.ok) {
        const already = Boolean(result.data.alreadyApplied);
        setSubmitResult({
          kind: already ? "already_applied" : "created",
          executionTrace: result.data.executionTrace,
        });
        await refreshProgression();
        return;
      }

      setSubmitResult({
        kind: "failed",
        message:
          result.data?.message ||
          result.data?.error ||
          copy.failedTitle,
      });
    } catch {
      setSubmitResult({ kind: "failed", message: copy.failedTitle });
    } finally {
      setSubmitting(false);
    }
  };

  const isDone =
    submitResult?.kind === "created" || submitResult?.kind === "already_applied";
  const isFailed = submitResult?.kind === "failed";
  const showForm =
    !loading && !loadError && !isDone && scenarioRows.length > 0;

  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
      <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {copy.introTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {copy.introBody}
        </p>
      </div>

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

      {!loading && !loadError && isDone && (
        <div className="mt-5 space-y-4 rounded-2xl border border-emerald-300/70 bg-emerald-50/80 px-4 py-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-50">
            {submitResult.kind === "already_applied"
              ? copy.alreadyAppliedTitle
              : copy.successTitle}
          </h2>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
            {submitResult.kind === "already_applied"
              ? copy.alreadyAppliedBody
              : copy.successBody}
          </p>
          <Link
            to={copy.assessmentHref}
            className="inline-flex rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {copy.continueAssessmentCta}
          </Link>
        </div>
      )}

      {!loading && !loadError && isFailed && (
        <div className="mt-5 space-y-3 rounded-2xl border border-amber-300/70 bg-amber-50/80 px-4 py-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <h2 className="text-base font-extrabold text-amber-950 dark:text-amber-50">
            {copy.failedTitle}
          </h2>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
            {submitResult.message || copy.failedLead}
          </p>
          <button
            type="button"
            onClick={() => setSubmitResult(null)}
            className="inline-flex rounded-full border border-amber-400/60 bg-white px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-50 dark:border-amber-400/30 dark:bg-slate-950/40 dark:text-amber-50"
          >
            {copy.retry}
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-6 space-y-4">
          {scenarioRows.map((row) => {
            if (row.missing) return null;
            const sc = copy.scenarios[row.id];
            if (!sc) return null;

            return (
              <fieldset
                key={row.id}
                className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]"
                data-lm07-scenario={row.id}
              >
                <legend className="px-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  {sc.title}
                </legend>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {sc.hint}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.initialStateLabel}
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100">
                      {formatJsonSnippet(row.initialState)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.actionLabel}
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100">
                      {formatJsonSnippet(row.action)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.ruleLabel}
                    </p>
                    <p className="mt-1 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100">
                      {row.rule}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {copy.yourAnswersLabel}
                  </p>

                  {row.id === LM07_SCENARIO_SCORE_INCREASE ? (
                    <label className="block text-sm text-slate-700 dark:text-slate-200">
                      {sc.resultingScoreLabel}
                      <input
                        type="number"
                        inputMode="numeric"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                        value={form[LM07_SCENARIO_SCORE_INCREASE]?.resultingScore || ""}
                        onChange={(e) =>
                          setField(
                            LM07_SCENARIO_SCORE_INCREASE,
                            "resultingScore",
                            e.target.value
                          )
                        }
                      />
                    </label>
                  ) : null}

                  {row.id === LM07_SCENARIO_TRANSFER_SUFFICIENT ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm text-slate-700 dark:text-slate-200">
                        {sc.aliceBalanceLabel}
                        <input
                          type="number"
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                          value={
                            form[LM07_SCENARIO_TRANSFER_SUFFICIENT]?.aliceBalance ||
                            ""
                          }
                          onChange={(e) =>
                            setField(
                              LM07_SCENARIO_TRANSFER_SUFFICIENT,
                              "aliceBalance",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label className="block text-sm text-slate-700 dark:text-slate-200">
                        {sc.bobBalanceLabel}
                        <input
                          type="number"
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                          value={
                            form[LM07_SCENARIO_TRANSFER_SUFFICIENT]?.bobBalance || ""
                          }
                          onChange={(e) =>
                            setField(
                              LM07_SCENARIO_TRANSFER_SUFFICIENT,
                              "bobBalance",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  ) : null}

                  {row.id === LM07_SCENARIO_TRANSFER_INSUFFICIENT ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="block text-sm text-slate-700 dark:text-slate-200">
                        {sc.outcomeLabel}
                        <select
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                          value={
                            form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.outcome ||
                            "rejected"
                          }
                          onChange={(e) =>
                            setField(
                              LM07_SCENARIO_TRANSFER_INSUFFICIENT,
                              "outcome",
                              e.target.value
                            )
                          }
                        >
                          <option value="rejected">{sc.outcomeRejected}</option>
                        </select>
                      </label>
                      <label className="block text-sm text-slate-700 dark:text-slate-200">
                        {sc.aliceBalanceLabel}
                        <input
                          type="number"
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                          value={
                            form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.aliceBalance ||
                            ""
                          }
                          onChange={(e) =>
                            setField(
                              LM07_SCENARIO_TRANSFER_INSUFFICIENT,
                              "aliceBalance",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label className="block text-sm text-slate-700 dark:text-slate-200">
                        {sc.bobBalanceLabel}
                        <input
                          type="number"
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                          value={
                            form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.bobBalance ||
                            ""
                          }
                          onChange={(e) =>
                            setField(
                              LM07_SCENARIO_TRANSFER_INSUFFICIENT,
                              "bobBalance",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              </fieldset>
            );
          })}

          <button
            type="button"
            disabled={!formComplete || submitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? copy.submitting : copy.submit}
          </button>
        </div>
      )}
    </div>
  );
}
