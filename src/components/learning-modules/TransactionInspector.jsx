import { forwardRef } from "react";
import { participantLabel } from "../../content/lm05EducationalLedgerLocale.js";
import { LM06_PROTOCOL_RULE_IDS } from "../../utils/lm06EducationalLedgerSimulation.js";

const FIELD_BY_RULE = Object.freeze({
  asset_exists: "asset",
  from_matches_owner: "from",
  destination_exists: "to",
  from_to_different: "transfer",
  still_pending: "status",
});

const RESULT_KEY_BY_RULE = Object.freeze({
  asset_exists: "resultFound",
  from_matches_owner: "resultCurrentOwner",
  destination_exists: "resultRegistered",
  from_to_different: "resultDifferent",
  still_pending: "resultEligible",
});

const FOCUS_SECTION_BY_RULE = Object.freeze({
  asset_exists: "current-state",
  from_matches_owner: "current-state",
  destination_exists: "participants",
  from_to_different: null,
  still_pending: "pending-pool",
});

/**
 * Data-driven visual Transaction Inspector for LM06 (reusable later for Explorer).
 * Does not fetch or mutate ledger data.
 *
 * @param {{
 *   transaction: object|null,
 *   copy: Record<string, any>,
 *   locale?: "en"|"gr",
 *   revealResults?: boolean,
 *   verificationRows?: Array<{ id: string, passed: boolean }>,
 *   onQuestionFocus?: (sectionId: string|null, ruleId: string) => void,
 *   decisionSlot?: import("react").ReactNode,
 *   consensusSlot?: import("react").ReactNode,
 * }} props
 */
const TransactionInspector = forwardRef(function TransactionInspector(
  {
    transaction,
    copy,
    locale = "en",
    revealResults = false,
    verificationRows = [],
    onQuestionFocus,
    decisionSlot = null,
    consensusSlot = null,
  },
  ref
) {
  if (!transaction) return null;

  const assetId =
    transaction.assetId != null ? String(transaction.assetId) : "—";
  const fromLabel = participantLabel(transaction.fromParticipantId, locale);
  const toLabel = participantLabel(transaction.toParticipantId, locale);
  const status =
    transaction.status != null ? String(transaction.status) : "PENDING";
  const txId = transaction.id != null ? String(transaction.id) : "—";

  const resultById = Object.fromEntries(
    (Array.isArray(verificationRows) ? verificationRows : []).map((row) => [
      row.id,
      row,
    ])
  );

  const questions = Array.isArray(copy.contextualQuestions)
    ? copy.contextualQuestions
    : [];

  function questionFor(ruleId) {
    return (
      questions.find((q) => q.id === ruleId) || {
        id: ruleId,
        text: ruleId,
      }
    );
  }

  function handleFocus(ruleId) {
    if (typeof onQuestionFocus !== "function") return;
    onQuestionFocus(FOCUS_SECTION_BY_RULE[ruleId] ?? null, ruleId);
  }

  function Callout({ ruleId, align = "start" }) {
    const q = questionFor(ruleId);
    const result = revealResults ? resultById[ruleId] : null;
    const passed = Boolean(result?.passed);
    const alignClass =
      align === "end"
        ? "items-end text-right"
        : align === "center"
          ? "items-center text-center"
          : "items-start text-left";

    if (revealResults && result) {
      const label = passed
        ? copy[RESULT_KEY_BY_RULE[ruleId]] || copy.ruleSatisfied
        : copy.resultFailed;
      return (
        <div
          className={`flex flex-col gap-1 ${alignClass}`}
          data-rule-result={ruleId}
          data-passed={passed ? "true" : "false"}
        >
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
              passed
                ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                : "bg-amber-500/15 text-amber-950 dark:text-amber-100"
            }`}
            role="status"
          >
            <span aria-hidden="true">{passed ? "✓" : "✗"}</span>
            <span>
              {passed ? `${q.number} ${label}` : `${q.number} ${label}`}
            </span>
          </span>
          <span className="sr-only">
            {passed ? copy.ruleSatisfied : copy.ruleFailed}: {q.text}
          </span>
        </div>
      );
    }

    return (
      <button
        type="button"
        data-rule-question={ruleId}
        data-field={FIELD_BY_RULE[ruleId]}
        onClick={() => handleFocus(ruleId)}
        className={`group flex max-w-[14rem] flex-col gap-0.5 rounded-lg border border-cyan-300/50 bg-cyan-50/90 px-2.5 py-1.5 text-left transition hover:border-cyan-400/70 hover:bg-cyan-100/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 ${alignClass}`}
        aria-label={`${q.number}. ${q.text}`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
          {q.number}
        </span>
        <span className="text-[11px] font-medium leading-snug text-slate-800 dark:text-slate-100">
          {q.text}
        </span>
      </button>
    );
  }

  return (
    <section
      ref={ref}
      id="lm06-transaction-inspector"
      className="scroll-mt-24 space-y-4 rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50/80 via-white/90 to-cyan-50/50 p-4 dark:border-violet-500/25 dark:from-violet-950/40 dark:via-slate-950/70 dark:to-cyan-950/30 sm:p-5"
      data-transaction-inspector="true"
      aria-label={copy.inspectorTitle}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200"
            data-step-validate="true"
          >
            {copy.stepValidateLabel}
          </p>
          <h2
            tabIndex={-1}
            data-inspector-focus-target="true"
            className="mt-1 text-lg font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 dark:text-white"
          >
            {copy.inspectorTitle}
          </h2>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-violet-800 dark:text-violet-200">
            {revealResults
              ? copy.validatedCandidateLabel
              : copy.candidateHeading}
          </p>
        </div>
        <p
          className="max-w-xs rounded-lg border border-slate-200/70 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-600/50 dark:bg-slate-950/50 dark:text-slate-200"
          data-compact-rule-reminder="true"
        >
          {copy.compactRuleReminder}
        </p>
      </div>

      <div
        className="rounded-2xl border border-violet-200/50 bg-white/85 p-4 dark:border-violet-500/20 dark:bg-slate-950/55 sm:p-6"
        data-tx-visual="true"
      >
        {/* Asset node */}
        <div className="flex flex-col items-center gap-2">
          <Callout ruleId="asset_exists" align="center" />
          <div
            className="min-w-[8rem] rounded-2xl border-2 border-violet-300/70 bg-violet-50 px-4 py-3 text-center dark:border-violet-400/40 dark:bg-violet-500/15"
            data-tx-node="asset"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-200">
              {copy.assetLabel}
            </p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
              {assetId}
            </p>
          </div>
          <svg
            className="h-8 w-6 text-slate-400 dark:text-slate-500"
            viewBox="0 0 24 32"
            aria-hidden="true"
          >
            <path
              d="M12 0 v24 M6 18 l6 8 l6 -8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* FROM → TO */}
        <div className="mt-1 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <Callout ruleId="from_matches_owner" align="center" />
            <div
              className="w-full max-w-[12rem] rounded-2xl border border-slate-300/80 bg-slate-50 px-4 py-3 text-center dark:border-slate-600 dark:bg-slate-900/60"
              data-tx-node="from"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {copy.fromLabel}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {fromLabel}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 py-1">
            <Callout ruleId="from_to_different" align="center" />
            {/* Desktop horizontal arrow */}
            <div
              className="hidden items-center gap-1 text-slate-500 dark:text-slate-400 sm:flex"
              aria-hidden="true"
              data-tx-arrow="horizontal"
            >
              <svg className="h-3 w-24" viewBox="0 0 96 12">
                <path
                  d="M0 6 H84 M76 1 L90 6 L76 11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Mobile downward arrow */}
            <div
              className="flex flex-col items-center text-slate-500 dark:text-slate-400 sm:hidden"
              aria-hidden="true"
              data-tx-arrow="vertical"
            >
              <svg className="h-8 w-6" viewBox="0 0 24 32">
                <path
                  d="M12 0 v24 M6 18 l6 8 l6 -8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="sr-only">
              {fromLabel} → {toLabel}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Callout ruleId="destination_exists" align="center" />
            <div
              className="w-full max-w-[12rem] rounded-2xl border border-slate-300/80 bg-slate-50 px-4 py-3 text-center dark:border-slate-600 dark:bg-slate-900/60"
              data-tx-node="to"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {copy.toLabel}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {toLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Status + TX id */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <Callout ruleId="still_pending" align="center" />
          <div
            className="rounded-xl border border-amber-300/60 bg-amber-50/90 px-4 py-2 text-center dark:border-amber-500/30 dark:bg-amber-500/10"
            data-tx-node="status"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              {copy.statusLabel}
            </p>
            <p className="mt-0.5 text-sm font-bold text-amber-950 dark:text-amber-50">
              {status}
            </p>
          </div>
          <p
            className="font-mono text-[11px] text-slate-500 dark:text-slate-400"
            data-tx-node="id"
          >
            {copy.txLabel} {txId}
          </p>
        </div>
      </div>

      {decisionSlot ? (
        <div data-decision-near-inspector="true">{decisionSlot}</div>
      ) : null}

      {consensusSlot ? (
        <div data-consensus-transition="true">{consensusSlot}</div>
      ) : null}

      {/* Stable rule-id list for tests / a11y map */}
      <ul className="sr-only" data-contextual-question-map="true">
        {LM06_PROTOCOL_RULE_IDS.map((id) => (
          <li key={id} data-field={FIELD_BY_RULE[id]}>
            {id}: {FIELD_BY_RULE[id]}
          </li>
        ))}
      </ul>
    </section>
  );
});

export default TransactionInspector;
export { FIELD_BY_RULE, FOCUS_SECTION_BY_RULE };
