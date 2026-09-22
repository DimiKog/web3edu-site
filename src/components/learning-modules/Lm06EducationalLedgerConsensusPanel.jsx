import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getLm06EducationalLedgerCopy } from "../../content/lm06EducationalLedgerLocale.js";
import { participantLabel } from "../../content/lm05EducationalLedgerLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import { fetchLm05EducationalLedger } from "../../utils/labWriteApi.js";
import { stripSubmitterIdentity } from "../../utils/lm05EducationalLedgerView.js";
import {
  LM06_DECISION,
  LM06_LEARNER_VALIDATOR_ID,
  LM06_PROPOSER_ID,
  LM06_SIM_STAGES,
  LM06_VALIDATORS,
  advanceToFinalizationAndResult,
  beginConsensusRound,
  buildPostDecisionVerificationRows,
  resetSimulationState,
  selectOldestPendingTransaction,
  spineActiveIdForStage,
  submitLearnerValidation,
} from "../../utils/lm06EducationalLedgerSimulation.js";
import EducationalLedgerSnapshot from "./EducationalLedgerSnapshot.jsx";
import TransactionInspector from "./TransactionInspector.jsx";

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollAndFocusInspector(container) {
  if (!container) return;
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof container.scrollIntoView === "function") {
    container.scrollIntoView({ behavior, block: "start" });
  }
  const focusTarget =
    container.querySelector("[data-inspector-focus-target]") || container;
  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus({ preventScroll: true });
  }
}

function ValidatorCard({ validator, copy, decision, highlightProposer }) {
  const isProposer = validator.id === LM06_PROPOSER_ID;
  const isLearner = validator.id === LM06_LEARNER_VALIDATOR_ID;
  const name = copy[validator.labelKey] || validator.id;
  return (
    <div
      className={`rounded-2xl border px-3 py-3 text-center ${
        isProposer && highlightProposer
          ? "border-violet-300/80 bg-violet-50/90 dark:border-violet-400/40 dark:bg-violet-500/10"
          : isLearner
            ? "border-cyan-300/80 bg-cyan-50/80 dark:border-cyan-400/40 dark:bg-cyan-500/10"
            : "border-slate-200/80 bg-white/70 dark:border-slate-700/60 dark:bg-slate-950/40"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {isProposer ? copy.proposerBadge : copy.validatorBadge}
        {isLearner ? ` · ${copy.youBadge}` : ""}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {name}
      </p>
      {decision ? (
        <p
          className={`mt-2 text-xs font-bold ${
            decision === LM06_DECISION.VALID
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-amber-700 dark:text-amber-300"
          }`}
        >
          {decision}
        </p>
      ) : null}
    </div>
  );
}

function decisionFeedbackText(copy, sim) {
  if (!sim.learnerDecision) return null;
  const correct = sim.validation?.correctDecision;
  if (sim.learnerMatchesCorrect) {
    return sim.learnerDecision === LM06_DECISION.VALID
      ? copy.feedbackMatchValid
      : copy.feedbackMatchInvalid;
  }
  return correct === LM06_DECISION.VALID
    ? copy.feedbackMismatchValidEvidence
    : copy.feedbackMismatchInvalidEvidence;
}

function assetLabelFromSnapshot(snapshot, assetId) {
  const asset = (snapshot?.assets || []).find(
    (a) => a && String(a.id) === String(assetId || "")
  );
  return asset?.label ? String(asset.label) : null;
}

function ConsensusVisual({ copy, decisions, showDecisions }) {
  return (
    <div className="mt-2 space-y-3 rounded-xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700/50 dark:bg-slate-950/40">
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-[11px] font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200"
          data-step-consensus="true"
        >
          {copy.stepConsensusLabel}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
          {copy.validatedCandidateLabel}
        </p>
        <svg
          className="h-6 w-4 text-slate-400"
          viewBox="0 0 16 24"
          aria-hidden="true"
        >
          <path
            d="M8 0 v16 M3 12 l5 8 l5 -8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        {copy.consensusBridge}
      </p>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        {LM06_VALIDATORS.map((v) => {
          const d = showDecisions
            ? (decisions || []).find((x) => x.validatorId === v.id)
            : null;
          return (
            <ValidatorCard
              key={v.id}
              validator={v}
              copy={copy}
              decision={d?.decision}
              highlightProposer
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Lm06EducationalLedgerConsensusPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm06EducationalLedgerCopy(locale);
  const identityArgs = useEducationalIdentityArgs();
  const apiBase = getWeb3eduBackendUrl();
  const hasIdToken = Boolean(identityArgs.idToken);

  const [loading, setLoading] = useState(true);
  const [ledger, setLedger] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [sim, setSim] = useState(() => resetSimulationState());
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [focusSection, setFocusSection] = useState(null);
  const inspectorRef = useRef(null);
  const pendingInspectorScrollRef = useRef(false);

  const lm05PoolPath =
    locale === "gr"
      ? "/learning-modules-gr/lm05/educational-ledger"
      : "/learning-modules/lm05/educational-ledger";

  const loadLedger = useCallback(async () => {
    if (!identityArgs.idToken) {
      setLoading(false);
      setLoadError(copy.signInRequired);
      setLedger(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    const result = await fetchLm05EducationalLedger({
      apiBase,
      idToken: identityArgs.idToken,
    });
    if (!result.ok) {
      setLedger(null);
      setLoadError(copy.loadError);
      setLoading(false);
      return;
    }
    setLedger(stripSubmitterIdentity(result.data));
    setLoading(false);
  }, [apiBase, copy.loadError, copy.signInRequired, identityArgs.idToken]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const pendingTransactions = ledger?.pendingTransactions || [];
  const assignedPreview = useMemo(
    () => selectOldestPendingTransaction(pendingTransactions),
    [pendingTransactions]
  );

  const snapshot = sim.snapshot;
  const revealResults = Boolean(sim.learnerDecision);
  const verificationRows = useMemo(() => {
    if (!revealResults || !sim.candidate || !snapshot) return [];
    return buildPostDecisionVerificationRows({
      transaction: sim.candidate,
      validation: sim.validation,
      assets: snapshot.assets,
      participants: snapshot.participants,
      pendingTransactions: snapshot.pendingTransactions,
    });
  }, [revealResults, sim.candidate, sim.validation, snapshot]);

  const activeSpineId = spineActiveIdForStage(sim.stage);
  const inRound = sim.stage !== LM06_SIM_STAGES.POOL;
  const showInspector =
    inspectorOpen &&
    sim.candidate &&
    (sim.stage === LM06_SIM_STAGES.VALIDATION ||
      sim.stage === LM06_SIM_STAGES.AGREEMENT);
  const showConsensus = sim.stage === LM06_SIM_STAGES.AGREEMENT && revealResults;
  const showFinalResult =
    sim.stage === LM06_SIM_STAGES.RESULT && sim.simulatedBlock && sim.beforeAfter;

  useLayoutEffect(() => {
    if (!showInspector || !pendingInspectorScrollRef.current) return;
    pendingInspectorScrollRef.current = false;
    scrollAndFocusInspector(inspectorRef.current);
  }, [showInspector]);

  // Ledger row highlighting only after decision
  const highlightAssetId = revealResults ? sim.candidate?.assetId : null;
  const highlightParticipantId = revealResults
    ? sim.candidate?.toParticipantId
    : null;
  const highlightTxId = revealResults ? sim.candidate?.id : null;

  const displayAssets = snapshot?.assets || ledger?.assets || [];
  const displayParticipants =
    snapshot?.participants || ledger?.participants || [];
  const displayPending =
    snapshot?.pendingTransactions || ledger?.pendingTransactions || [];
  const assignedTxId =
    sim.candidate?.id || assignedPreview?.id || null;

  function handleRestart() {
    setSim(resetSimulationState());
    setInspectorOpen(false);
    setFocusSection(null);
    pendingInspectorScrollRef.current = false;
  }

  function handleInspectAssigned() {
    if (!ledger) return;
    pendingInspectorScrollRef.current = true;
    if (sim.stage === LM06_SIM_STAGES.POOL) {
      setSim(beginConsensusRound(ledger));
    }
    setInspectorOpen(true);
    setFocusSection(null);
    // If inspector is already open, layout effect may not re-fire — scroll now.
    if (inspectorOpen && inspectorRef.current) {
      pendingInspectorScrollRef.current = false;
      scrollAndFocusInspector(inspectorRef.current);
    }
  }

  function handleQuestionFocus(sectionId) {
    if (!sectionId || revealResults) return;
    setFocusSection(sectionId);
    const el = document.getElementById(`lm06-ledger-${sectionId}`);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  if (!hasIdToken && !identityArgs.oidcAuthLoading) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        {copy.signInRequired}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="rounded-2xl border border-violet-200/80 bg-violet-50/80 px-4 py-3 text-sm text-violet-950 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100">
        {copy.prototypeBanner}
      </p>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {copy.spineLabel}
          </p>
          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {copy.qbftLabel}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {copy.spineSteps.map((step, index) => (
            <span key={step.id} className="flex items-center gap-2">
              {index > 0 ? (
                <span
                  className="text-slate-400 dark:text-slate-600"
                  aria-hidden="true"
                >
                  →
                </span>
              ) : null}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  step.id === activeSpineId
                    ? "bg-violet-500/15 text-violet-900 ring-2 ring-violet-400/40 dark:bg-violet-500/20 dark:text-violet-100"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {copy.spineMisconception}
        </p>
      </section>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          …
        </div>
      ) : null}

      {loadError ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {loadError}
        </p>
      ) : null}

      {ledger && pendingTransactions.length === 0 && !inRound ? (
        <div className="space-y-3 rounded-xl border border-dashed border-cyan-200/80 bg-white/60 px-4 py-4 dark:border-cyan-500/20 dark:bg-slate-950/40">
          <p className="font-semibold text-slate-900 dark:text-white">
            {copy.poolEmptyTitle}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {copy.poolEmptyBody}
          </p>
          <Link
            to={lm05PoolPath}
            className="inline-flex text-sm font-semibold text-cyan-800 underline-offset-2 hover:underline dark:text-cyan-200"
          >
            {copy.poolLm05LinkLabel}
          </Link>
        </div>
      ) : null}

      {inRound ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-500/20 dark:text-amber-100">
            {copy.simulationCompactLabel}
          </span>
          <button
            type="button"
            onClick={handleRestart}
            className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
          >
            {copy.restart}
          </button>
        </div>
      ) : null}

      {ledger && pendingTransactions.length > 0 && !showFinalResult ? (
        <div className="space-y-5">
          {!inspectorOpen ? (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {copy.selectionRule}
            </p>
          ) : null}

          {showInspector ? (
            <TransactionInspector
              ref={inspectorRef}
              transaction={sim.candidate}
              copy={copy}
              locale={locale}
              revealResults={revealResults}
              verificationRows={verificationRows}
              onQuestionFocus={handleQuestionFocus}
              decisionSlot={
                <div className="space-y-3 rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {copy.decisionTitle}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {copy.decisionPrompt}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {copy.decisionAllMustPass}
                    </p>
                  </div>
                  {!revealResults ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSim((s) =>
                            submitLearnerValidation(s, LM06_DECISION.VALID)
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950"
                      >
                        {copy.chooseValid}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSim((s) =>
                            submitLearnerValidation(s, LM06_DECISION.INVALID)
                          )
                        }
                        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100"
                      >
                        {copy.chooseInvalid}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {copy.correctResultLabel}:{" "}
                        <span className="font-semibold">
                          {sim.validation?.correctDecision}
                        </span>
                      </p>
                      <p className="rounded-lg border border-slate-200/70 bg-white/80 px-3 py-2 text-sm font-medium text-slate-900 dark:border-slate-700/50 dark:bg-slate-950/50 dark:text-white">
                        {decisionFeedbackText(copy, sim)}
                      </p>
                    </div>
                  )}
                </div>
              }
              consensusSlot={
                showConsensus ? (
                  <div className="space-y-4">
                    <ConsensusVisual
                      copy={copy}
                      decisions={sim.decisions}
                      showDecisions
                    />
                    <div
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        sim.agreement?.reached
                          ? "border-emerald-300/70 bg-emerald-50/90 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-50"
                          : "border-amber-300/70 bg-amber-50/90 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-50"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                        {copy.networkAgreementLabel}
                      </p>
                      <p className="mt-1 font-semibold">
                        {sim.agreement?.reached
                          ? copy.agreementReached
                          : copy.agreementNotReached}
                      </p>
                      <p className="mt-2 text-xs opacity-80">
                        {copy.agreementDisclaimer}
                      </p>
                    </div>
                    {sim.agreement?.reached ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSim((s) => advanceToFinalizationAndResult(s))
                        }
                        className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-violet-500 dark:text-slate-950"
                      >
                        {copy.continueToFinalization}
                      </button>
                    ) : null}
                  </div>
                ) : null
              }
            />
          ) : null}

          <EducationalLedgerSnapshot
            assets={displayAssets}
            participants={displayParticipants}
            pendingTransactions={displayPending}
            copy={copy}
            locale={locale}
            highlightAssetId={highlightAssetId}
            highlightParticipantId={highlightParticipantId}
            highlightTxId={highlightTxId}
            assignedTxId={assignedTxId}
            onInspectAssigned={
              !showFinalResult ? handleInspectAssigned : null
            }
            focusSection={!revealResults ? focusSection : null}
            inspectorOpen={inspectorOpen}
            showInspectTask={!inspectorOpen}
          />
        </div>
      ) : null}

      {showFinalResult ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-500/20 dark:text-amber-100">
              {copy.simulationCompactLabel}
            </span>
            <button
              type="button"
              onClick={handleRestart}
              className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
            >
              {copy.restart}
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-emerald-300/70 bg-emerald-50/80 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                {copy.inclusionTitle}
              </h2>
              <span className="rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100">
                {copy.includedStatus}
              </span>
            </div>
            <div className="rounded-xl border border-emerald-200/70 bg-white/70 p-4 dark:border-emerald-500/20 dark:bg-slate-950/40">
              <p className="font-semibold text-slate-900 dark:text-white">
                {copy.finalizedBlockTitle}
              </p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    {copy.txLabel}
                  </dt>
                  <dd className="font-mono text-xs text-slate-900 dark:text-white">
                    {sim.candidate?.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    {copy.assetLabel}
                  </dt>
                  <dd className="text-slate-900 dark:text-white">
                    {sim.candidate?.assetId}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    {copy.fromLabel} → {copy.toLabel}
                  </dt>
                  <dd className="text-slate-900 dark:text-white">
                    {participantLabel(sim.candidate?.fromParticipantId, locale)}{" "}
                    → {participantLabel(sim.candidate?.toParticipantId, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    {copy.proposerBadge}
                  </dt>
                  <dd className="text-slate-900 dark:text-white">
                    {copy.validator1}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/60 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {copy.beforeHeading}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {sim.beforeAfter.assetId}
                {assetLabelFromSnapshot(snapshot, sim.beforeAfter.assetId)
                  ? ` | ${assetLabelFromSnapshot(snapshot, sim.beforeAfter.assetId)}`
                  : ""}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {copy.ownerLabel}:{" "}
                {participantLabel(sim.beforeAfter.beforeOwner, locale)}
              </p>
            </div>

            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              ↓
            </p>

            <div className="rounded-2xl border border-violet-200/70 bg-violet-50/70 p-4 text-center dark:border-violet-500/25 dark:bg-violet-500/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
                {copy.finalizedContains}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                {participantLabel(sim.beforeAfter.fromParticipantId, locale)} →{" "}
                {participantLabel(sim.beforeAfter.toParticipantId, locale)}
              </p>
            </div>

            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              ↓ {copy.successfulExecution}
            </p>

            <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50/90 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80 dark:text-emerald-200/80">
                {copy.afterHeading}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {sim.beforeAfter.assetId}
                {assetLabelFromSnapshot(snapshot, sim.beforeAfter.assetId)
                  ? ` | ${assetLabelFromSnapshot(snapshot, sim.beforeAfter.assetId)}`
                  : ""}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {copy.ownerLabel}:{" "}
                {participantLabel(sim.beforeAfter.afterOwner, locale)}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {copy.afterSimulatedNote}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-violet-200/70 bg-violet-50/70 p-4 dark:border-violet-500/25 dark:bg-violet-500/10 sm:p-5">
            <h2 className="text-lg font-semibold text-violet-950 dark:text-violet-50">
              {copy.resultTitle}
            </h2>
            <p className="text-sm text-violet-950 dark:text-violet-50">
              {copy.resultSummary}
            </p>
            <p className="border-t border-violet-200/60 pt-3 text-sm text-violet-900 dark:border-violet-400/20 dark:text-violet-100">
              {copy.besuBridge}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            {copy.restart}
          </button>
        </section>
      ) : null}
    </div>
  );
}
