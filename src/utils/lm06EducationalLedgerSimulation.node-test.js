/**
 * LM06 Educational Ledger consensus simulation — pure logic + UX structure tests.
 * Run: node --test src/utils/lm06EducationalLedgerSimulation.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm06EducationalLedgerCopy } from "../content/lm06EducationalLedgerLocale.js";
import {
  LM06_DECISION,
  LM06_LEARNER_VALIDATOR_ID,
  LM06_PROPOSER_ID,
  LM06_PROTOCOL_RULE_IDS,
  LM06_SIM_STAGES,
  LM06_SPINE_IDS,
  advanceAfterAgreement,
  advanceToFinalizationAndResult,
  beginConsensusRound,
  buildBeforeAfterState,
  buildPostDecisionVerificationRows,
  buildSimulatedValidatorDecisions,
  createInitialSimulationState,
  enterValidationStage,
  evaluateEducationalAgreement,
  resetSimulationState,
  selectDeterministicProposer,
  selectOldestPendingTransaction,
  snapshotLedgerForSimulation,
  spineActiveIdForStage,
  submitLearnerValidation,
  validateCandidateTransaction,
} from "./lm06EducationalLedgerSimulation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesSrc = readFileSync(
  join(__dirname, "../routes/routeTable.jsx"),
  "utf8"
);
const panelSrc = readFileSync(
  join(
    __dirname,
    "../components/learning-modules/Lm06EducationalLedgerConsensusPanel.jsx"
  ),
  "utf8"
);
const snapshotSrc = readFileSync(
  join(__dirname, "../components/learning-modules/EducationalLedgerSnapshot.jsx"),
  "utf8"
);
const inspectorSrc = readFileSync(
  join(__dirname, "../components/learning-modules/TransactionInspector.jsx"),
  "utf8"
);
const pageSrc = readFileSync(
  join(__dirname, "../pages/learning-modules/Lm06EducationalLedgerPage.jsx"),
  "utf8"
);
const simSrc = readFileSync(
  join(__dirname, "lm06EducationalLedgerSimulation.js"),
  "utf8"
);

function sampleLedger() {
  return {
    participants: [
      { id: "producer", label: "Producer" },
      { id: "manufacturer", label: "Manufacturer" },
      { id: "distributor", label: "Distributor" },
      { id: "retailer", label: "Retailer" },
    ],
    assets: [
      { id: "TC-001", label: "Olive Oil", ownerParticipantId: "producer" },
      { id: "TC-002", label: "Coffee", ownerParticipantId: "producer" },
      { id: "TC-003", label: "Medicine", ownerParticipantId: "manufacturer" },
    ],
    pendingTransactions: [
      {
        id: "pel-newer",
        assetId: "TC-002",
        fromParticipantId: "producer",
        toParticipantId: "distributor",
        status: "PENDING",
        createdAt: "2026-09-19T14:00:00Z",
      },
      {
        id: "pel-oldest",
        assetId: "TC-001",
        fromParticipantId: "producer",
        toParticipantId: "distributor",
        status: "PENDING",
        createdAt: "2026-09-19T10:00:00Z",
      },
      {
        id: "pel-mid",
        assetId: "TC-001",
        fromParticipantId: "producer",
        toParticipantId: "retailer",
        status: "PENDING",
        createdAt: "2026-09-19T12:00:00Z",
      },
    ],
  };
}

test("routes register LM06 educational-ledger EN/GR prototype pages", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm06\/educational-ledger"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06\/educational-ledger"/);
  assert.match(routesSrc, /Lm06EducationalLedgerPage/);
  assert.match(pageSrc, /Lm06EducationalLedgerConsensusPanel/);
  assert.match(panelSrc, /fetchLm05EducationalLedger/);
  assert.doesNotMatch(panelSrc, /postLm05EducationalLedgerTransfer/);
  assert.doesNotMatch(routesSrc, /educational-ledger-explorer/i);
});

test("conceptual spine ordering EN/GR", () => {
  assert.deepEqual([...LM06_SPINE_IDS], [
    "pending",
    "candidateBlock",
    "validation",
    "agreement",
    "finalization",
    "stateUpdate",
  ]);
  const en = getLm06EducationalLedgerCopy("en");
  const gr = getLm06EducationalLedgerCopy("gr");
  assert.deepEqual(
    en.spineSteps.map((s) => s.id),
    [...LM06_SPINE_IDS]
  );
  assert.deepEqual(
    gr.spineSteps.map((s) => s.id),
    [...LM06_SPINE_IDS]
  );
  assert.equal(spineActiveIdForStage(LM06_SIM_STAGES.VALIDATION), "validation");
  assert.equal(spineActiveIdForStage(LM06_SIM_STAGES.AGREEMENT), "agreement");
  assert.equal(spineActiveIdForStage(LM06_SIM_STAGES.RESULT), "stateUpdate");
});

test("EN/GR locale parity and contextual questions map to five fields", () => {
  const en = getLm06EducationalLedgerCopy("en");
  const gr = getLm06EducationalLedgerCopy("gr");
  assert.deepEqual(Object.keys(en).sort(), Object.keys(gr).sort());
  assert.equal(en.contextualQuestions.length, 5);
  assert.equal(gr.contextualQuestions.length, 5);
  assert.deepEqual(
    en.contextualQuestions.map((q) => q.id),
    [...LM06_PROTOCOL_RULE_IDS]
  );
  assert.deepEqual(
    gr.contextualQuestions.map((q) => q.id),
    [...LM06_PROTOCOL_RULE_IDS]
  );
  assert.match(en.ledgerSnapshotTitle, /Current Educational Ledger/i);
  assert.match(gr.ledgerSnapshotTitle, /Educational Ledger/);
  assert.match(en.assignedBadge, /ASSIGNED/i);
  assert.match(gr.assignedBadge, /ΑΝΑΤΕΘΕΙΜΕΝΗ|ASSIGNED/i);
  assert.match(en.inspectButton, /Inspect transaction/i);
  assert.match(gr.inspectButton, /Έλεγχος συναλλαγής/);
  assert.match(en.taskTitle, /YOUR TASK/i);
  assert.match(gr.taskTitle, /ΑΠΟΣΤΟΛΗ/);
  assert.match(en.taskInstruction, /ASSIGNED/);
  assert.match(gr.taskInstruction, /ASSIGNED/);
  assert.match(en.stepInspectLabel, /STEP 1 OF 3/i);
  assert.match(en.stepValidateLabel, /STEP 2 OF 3/i);
  assert.match(en.stepConsensusLabel, /STEP 3 OF 3/i);
  assert.match(gr.stepInspectLabel, /ΒΗΜΑ 1/);
  assert.match(gr.stepValidateLabel, /ΒΗΜΑ 2/);
  assert.match(gr.stepConsensusLabel, /ΒΗΜΑ 3/);
  assert.ok(en.compactRuleReminder);
  assert.ok(gr.compactRuleReminder);
});

test("explicit inspect task appears before pending pool; Inspect transaction CTA", () => {
  assert.match(snapshotSrc, /data-inspect-task/);
  assert.match(snapshotSrc, /showInspectTask/);
  assert.match(snapshotSrc, /taskTitle/);
  assert.match(snapshotSrc, /taskInstruction/);
  assert.match(snapshotSrc, /stepInspectLabel/);
  // Task block is rendered before pending pool heading in source order
  const taskAt = snapshotSrc.indexOf("data-inspect-task");
  const pendingTitleAt = snapshotSrc.indexOf("ledgerPendingPoolTitle");
  assert.ok(taskAt > 0 && pendingTitleAt > taskAt);
  assert.match(snapshotSrc, /inspectButton/);
  assert.match(panelSrc, /showInspectTask=\{!inspectorOpen\}/);
});

test("assigned candidate identifiable but not marked valid/invalid", () => {
  assert.match(snapshotSrc, /assignedBadge/);
  assert.match(snapshotSrc, /data-assigned-badge/);
  assert.match(snapshotSrc, /data-validity-hint="none"/);
  assert.doesNotMatch(snapshotSrc, /VALID|INVALID/);
  assert.match(panelSrc, /assignedTxId/);
  assert.match(panelSrc, /selectOldestPendingTransaction/);
});

test("inspect opens TransactionInspector; not auto-revealed before interaction", () => {
  assert.match(panelSrc, /TransactionInspector/);
  assert.match(panelSrc, /inspectorOpen/);
  assert.match(panelSrc, /handleInspectAssigned/);
  assert.match(panelSrc, /setInspectorOpen\(true\)/);
  assert.match(snapshotSrc, /onInspectAssigned/);
  assert.match(snapshotSrc, /data-inspect-assigned/);
  // Inspector gated on inspectorOpen
  assert.match(panelSrc, /showInspector/);
  assert.match(panelSrc, /inspectorOpen &&/);
});

test("inspect click scrolls and focuses Transaction Inspector with reduced-motion safe behavior", () => {
  assert.match(inspectorSrc, /data-inspector-focus-target/);
  assert.match(inspectorSrc, /id="lm06-transaction-inspector"/);
  assert.match(inspectorSrc, /scroll-mt-24/);
  assert.match(inspectorSrc, /forwardRef/);
  assert.match(panelSrc, /inspectorRef/);
  assert.match(panelSrc, /pendingInspectorScrollRef/);
  assert.match(panelSrc, /scrollAndFocusInspector/);
  assert.match(panelSrc, /prefers-reduced-motion/);
  assert.match(panelSrc, /useLayoutEffect/);
  assert.match(panelSrc, /scrollIntoView/);
  assert.match(panelSrc, /prefersReducedMotion\(\) \? ["']auto["'] : ["']smooth["']/);
  assert.match(panelSrc, /scrollIntoView\(\{ behavior, block: ["']start["'] \}\)/);
  assert.match(panelSrc, /ref=\{inspectorRef\}/);
  assert.match(inspectorSrc, /stepValidateLabel/);
  assert.match(panelSrc, /stepConsensusLabel/);
});

test("TransactionInspector is data-driven with real candidate field nodes", () => {
  assert.match(inspectorSrc, /transaction\.assetId/);
  assert.match(inspectorSrc, /fromParticipantId/);
  assert.match(inspectorSrc, /toParticipantId/);
  assert.match(inspectorSrc, /transaction\.status/);
  assert.match(inspectorSrc, /transaction\.id/);
  assert.doesNotMatch(inspectorSrc, /TC-001/);
  assert.doesNotMatch(inspectorSrc, /Producer/);
  assert.doesNotMatch(inspectorSrc, /Distributor/);
  assert.match(inspectorSrc, /data-tx-node="asset"/);
  assert.match(inspectorSrc, /data-tx-node="from"/);
  assert.match(inspectorSrc, /data-tx-node="to"/);
  assert.match(inspectorSrc, /data-tx-node="status"/);
  assert.match(inspectorSrc, /data-field=\{FIELD_BY_RULE/);
});

test("five contextual questions map to asset / FROM / TO / transfer / status", () => {
  assert.match(inspectorSrc, /asset_exists: "asset"/);
  assert.match(inspectorSrc, /from_matches_owner: "from"/);
  assert.match(inspectorSrc, /destination_exists: "to"/);
  assert.match(inspectorSrc, /from_to_different: "transfer"/);
  assert.match(inspectorSrc, /still_pending: "status"/);
  assert.match(inspectorSrc, /data-contextual-question-map/);
  assert.match(inspectorSrc, /data-rule-question=\{ruleId\}/);
});

test("no validation answer exposed before learner decision", () => {
  assert.match(inspectorSrc, /revealResults/);
  assert.match(inspectorSrc, /if \(revealResults && result\)/);
  assert.match(panelSrc, /revealResults = Boolean\(sim\.learnerDecision\)/);
  assert.doesNotMatch(panelSrc, /GuidedCheckCard/);
  assert.doesNotMatch(panelSrc, /buildGuidedValidationChecks/);
  assert.doesNotMatch(simSrc, /buildGuidedValidationChecks/);
  assert.doesNotMatch(panelSrc, /type=["']checkbox["']/);
  // Large protocol rules list removed from primary panel interaction
  assert.doesNotMatch(panelSrc, /protocolRules/);
  assert.match(inspectorSrc, /compact-rule-reminder/);
});

test("ledger remains visible during inspection; section focus does not reveal rows", () => {
  assert.match(panelSrc, /EducationalLedgerSnapshot/);
  assert.match(snapshotSrc, /data-ledger-visible-during-inspect/);
  assert.match(panelSrc, /inspectorOpen=\{inspectorOpen\}/);
  // Inspector and snapshot coexist in same branch (not a hiding modal)
  assert.doesNotMatch(panelSrc, /role=["']dialog["']/);
  assert.match(panelSrc, /handleQuestionFocus/);
  assert.match(panelSrc, /focusSection/);
  assert.match(snapshotSrc, /data-ledger-section="current-state"/);
  assert.match(snapshotSrc, /data-ledger-section="participants"/);
  assert.match(snapshotSrc, /data-ledger-section="pending-pool"/);
  // Pre-decision focus must not set highlight ids
  assert.match(
    panelSrc,
    /const highlightAssetId = revealResults \? sim\.candidate\?\.assetId : null/
  );
  assert.match(
    panelSrc,
    /focusSection=\{!revealResults \? focusSection : null\}/
  );
});

test("VALID/INVALID controls are near inspector in component structure", () => {
  assert.match(inspectorSrc, /decisionSlot/);
  assert.match(inspectorSrc, /data-decision-near-inspector/);
  assert.match(panelSrc, /decisionSlot=/);
  assert.match(panelSrc, /chooseValid/);
  assert.match(panelSrc, /chooseInvalid/);
  const decisionNear =
    inspectorSrc.indexOf("data-decision-near-inspector") <
    inspectorSrc.indexOf("data-consensus-transition");
  assert.equal(decisionNear, true);
});

test("post-decision results appear on same transaction visual; evidence only after", () => {
  assert.match(inspectorSrc, /data-rule-result=\{ruleId\}/);
  assert.match(inspectorSrc, /resultFailed/);
  assert.match(inspectorSrc, /resultFound/);
  assert.match(panelSrc, /buildPostDecisionVerificationRows/);
  assert.match(
    panelSrc,
    /const highlightAssetId = revealResults \? sim\.candidate\?\.assetId : null/
  );
  assert.match(
    panelSrc,
    /highlightParticipantId = revealResults[\s\S]*?toParticipantId/
  );
  assert.match(
    panelSrc,
    /const highlightTxId = revealResults \? sim\.candidate\?\.id : null/
  );
  assert.match(panelSrc, /ConsensusVisual/);
  assert.match(inspectorSrc, /consensusSlot/);
});

test("snapshot component renders all assets/participants/pending without hard-coded TC ids", () => {
  assert.doesNotMatch(snapshotSrc, /TC-001/);
  assert.doesNotMatch(snapshotSrc, /Producer/);
  assert.match(snapshotSrc, /assetRows\.map/);
  assert.match(snapshotSrc, /participantRows\.map/);
  assert.match(snapshotSrc, /pendingRows\.map/);
});

test("oldest pending + immutable snapshot + begin lands on validation", () => {
  const ledger = sampleLedger();
  const frozen = JSON.stringify(ledger);
  const oldest = selectOldestPendingTransaction(ledger.pendingTransactions);
  assert.equal(oldest.id, "pel-oldest");
  const snap = snapshotLedgerForSimulation(ledger);
  snap.assets[0].ownerParticipantId = "distributor";
  assert.equal(JSON.stringify(ledger), frozen);
  const started = beginConsensusRound(ledger);
  assert.equal(started.stage, LM06_SIM_STAGES.VALIDATION);
  assert.equal(started.candidate.id, "pel-oldest");
  assert.equal(started.validation.ok, true);
  assert.equal(JSON.stringify(ledger), frozen);
});

test("deterministic proposer/learner and validation rules unchanged", () => {
  assert.equal(selectDeterministicProposer().id, "v1");
  assert.equal(LM06_PROPOSER_ID, "v1");
  assert.equal(LM06_LEARNER_VALIDATOR_ID, "v3");
  const ledger = sampleLedger();
  const tx = selectOldestPendingTransaction(ledger.pendingTransactions);
  const ok = validateCandidateTransaction(tx, ledger.assets, ledger.participants);
  assert.equal(ok.ok, true);
  const bad = validateCandidateTransaction(
    { ...tx, fromParticipantId: "distributor" },
    ledger.assets,
    ledger.participants
  );
  assert.equal(bad.ok, false);
});

test("post-decision verification identifies real evidence without mutating source", () => {
  const ledger = sampleLedger();
  const frozen = JSON.stringify(ledger);
  const tx = selectOldestPendingTransaction(ledger.pendingTransactions);
  const validation = validateCandidateTransaction(
    tx,
    ledger.assets,
    ledger.participants
  );
  const rows = buildPostDecisionVerificationRows({
    transaction: tx,
    validation,
    assets: ledger.assets,
    participants: ledger.participants,
    pendingTransactions: ledger.pendingTransactions,
  });
  assert.equal(rows.length, 5);
  assert.deepEqual(
    rows.map((r) => r.id),
    [...LM06_PROTOCOL_RULE_IDS]
  );
  assert.equal(rows[0].detail.assetId, "TC-001");
  assert.equal(rows[0].detail.found, true);
  assert.equal(rows[1].detail.currentOwner, "producer");
  assert.equal(rows[2].detail.toParticipantId, "distributor");
  assert.equal(rows[2].detail.found, true);
  assert.equal(rows[4].detail.foundInPool, true);
  assert.ok(rows.every((r) => r.passed));
  assert.equal(JSON.stringify(ledger), frozen);
});

test("peer validators derive from validation logic — no arbitrary V4 INVALID", () => {
  const votes = buildSimulatedValidatorDecisions({
    learnerDecision: LM06_DECISION.VALID,
    validationOk: true,
  });
  assert.deepEqual(
    votes.map((d) => [d.validatorId, d.decision]),
    [
      ["v1", "VALID"],
      ["v2", "VALID"],
      ["v3", "VALID"],
      ["v4", "VALID"],
    ]
  );
  assert.doesNotMatch(simSrc, /id === "v4"\s*\?\s*LM06_DECISION\.INVALID/);
});

test("incorrect learner decision still allows consensus; finalization after agreement", () => {
  const ledger = sampleLedger();
  let state = beginConsensusRound(ledger);
  state = submitLearnerValidation(state, LM06_DECISION.INVALID);
  assert.equal(state.learnerMatchesCorrect, false);
  assert.equal(state.stage, LM06_SIM_STAGES.AGREEMENT);
  assert.equal(state.agreement.reached, true);
  assert.equal(evaluateEducationalAgreement(state.decisions).validCount, 3);

  const blocked = advanceAfterAgreement({
    ...state,
    agreement: { reached: false, validCount: 1, invalidCount: 3, total: 4 },
  });
  assert.equal(blocked.simulatedBlock, null);

  state = advanceToFinalizationAndResult(state);
  assert.equal(state.stage, LM06_SIM_STAGES.RESULT);
  assert.equal(state.simulatedBlock.status, "FINALIZED_SIMULATION");
  assert.equal(state.beforeAfter.beforeOwner, "producer");
  assert.equal(state.beforeAfter.afterOwner, "distributor");
  assert.equal(ledger.assets[0].ownerParticipantId, "producer");
  assert.deepEqual(resetSimulationState(), createInitialSimulationState());
});

test("BEFORE/AFTER helpers and enterValidationStage retained", () => {
  const view = buildBeforeAfterState({
    transaction: {
      assetId: "TC-001",
      fromParticipantId: "producer",
      toParticipantId: "distributor",
    },
    assets: [{ id: "TC-001", ownerParticipantId: "producer" }],
  });
  assert.equal(view.beforeOwner, "producer");
  assert.equal(view.afterOwner, "distributor");
  const ledger = sampleLedger();
  let state = beginConsensusRound(ledger);
  state = enterValidationStage(state);
  assert.equal(state.stage, LM06_SIM_STAGES.VALIDATION);
});

test("frontend-only safety: no ledger mutation writes; evidence POST only at terminal save", () => {
  assert.match(panelSrc, /fetchLm05EducationalLedger/);
  assert.match(panelSrc, /postLm06ConsensusActivity/);
  assert.match(panelSrc, /handleContinueToFinalization/);
  assert.match(panelSrc, /persistConsensusEvidence/);
  assert.match(panelSrc, /advanceToFinalizationAndResult/);
  assert.match(panelSrc, /LM06_SIM_STAGES\.RESULT/);
  assert.match(panelSrc, /web3edu-progress-updated/);
  assert.match(panelSrc, /data-lm06-evidence-retry/);
  assert.match(panelSrc, /data-lm06-evidence-saving/);
  // Completion path: continue-to-finalization + retry only.
  assert.match(panelSrc, /await persistConsensusEvidence\(next\.candidate\.id\)/);
  assert.match(panelSrc, /await persistConsensusEvidence\(candidateId\)/);
  // Earlier round controls must not call persist.
  const inspectHandler = panelSrc.slice(
    panelSrc.indexOf("function handleInspectAssigned"),
    panelSrc.indexOf("function handleQuestionFocus")
  );
  assert.doesNotMatch(inspectHandler, /persistConsensusEvidence/);
  assert.doesNotMatch(panelSrc, /postLm05EducationalLedgerTransfer/);
  assert.doesNotMatch(panelSrc, /awardXp|completeLab/i);
  assert.doesNotMatch(inspectorSrc, /fetch\(/);
  assert.doesNotMatch(snapshotSrc, /fetch\(/);
  assert.doesNotMatch(panelSrc, /progressAddress:/);
  assert.doesNotMatch(panelSrc, /finalized:\s*true|stateUpdated:\s*true|votes:/);
});
