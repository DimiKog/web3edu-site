/**
 * LM06 Educational Ledger consensus prototype — pure frontend simulation.
 * Never mutates source ledger objects. No network / evidence / XP.
 */

export const LM06_SIM_STAGES = Object.freeze({
  POOL: "pool",
  CANDIDATE: "candidate",
  VALIDATION: "validation",
  AGREEMENT: "agreement",
  INCLUSION: "inclusion",
  RESULT: "result",
});

export const LM06_SPINE_IDS = Object.freeze([
  "pending",
  "candidateBlock",
  "validation",
  "agreement",
  "finalization",
  "stateUpdate",
]);

export const LM06_VALIDATORS = Object.freeze([
  { id: "v1", labelKey: "validator1" },
  { id: "v2", labelKey: "validator2" },
  { id: "v3", labelKey: "validator3You", isLearner: true },
  { id: "v4", labelKey: "validator4" },
]);

export const LM06_PROPOSER_ID = "v1";
export const LM06_LEARNER_VALIDATOR_ID = "v3";

export const LM06_DECISION = Object.freeze({
  VALID: "VALID",
  INVALID: "INVALID",
});

/** Ordered protocol / validation rule ids (instructions + verification). */
export const LM06_PROTOCOL_RULE_IDS = Object.freeze([
  "asset_exists",
  "from_matches_owner",
  "destination_exists",
  "from_to_different",
  "still_pending",
]);

/**
 * Build post-decision verification rows that identify the evidence the learner
 * needed. Safe to call only after a decision — used for teaching reveal.
 * Does not mutate inputs.
 * @param {{
 *   transaction: object|null|undefined,
 *   validation: object|null|undefined,
 *   assets?: Array,
 *   participants?: Array,
 *   pendingTransactions?: Array,
 * }} args
 */
export function buildPostDecisionVerificationRows({
  transaction,
  validation,
  assets = [],
  participants = [],
  pendingTransactions = [],
}) {
  const tx = transaction && typeof transaction === "object" ? transaction : null;
  const assetList = Array.isArray(assets) ? assets : [];
  const participantList = Array.isArray(participants) ? participants : [];
  const pendingList = Array.isArray(pendingTransactions) ? pendingTransactions : [];
  const rules = Array.isArray(validation?.rules) ? validation.rules : [];
  const byId = Object.fromEntries(rules.map((r) => [r.id, r]));

  const assetId = tx?.assetId != null ? String(tx.assetId) : "";
  const asset = assetList.find((a) => a && String(a.id) === assetId) || null;
  const fromId = tx?.fromParticipantId != null ? String(tx.fromParticipantId) : "";
  const toId = tx?.toParticipantId != null ? String(tx.toParticipantId) : "";
  const status = tx?.status != null ? String(tx.status) : "";
  const currentOwner = asset?.ownerParticipantId
    ? String(asset.ownerParticipantId)
    : validation?.currentOwner
      ? String(validation.currentOwner)
      : null;
  const pendingMatch =
    pendingList.find((p) => p && String(p.id) === String(tx?.id || "")) || null;

  return LM06_PROTOCOL_RULE_IDS.map((id) => {
    const passed = Boolean(byId[id]?.passed);
    if (id === "asset_exists") {
      return {
        id,
        passed,
        detail: {
          assetId: assetId || null,
          found: Boolean(asset),
          assetLabel:
            asset?.label != null && String(asset.label).trim()
              ? String(asset.label).trim()
              : null,
        },
      };
    }
    if (id === "from_matches_owner") {
      return {
        id,
        passed,
        detail: {
          fromParticipantId: fromId || null,
          currentOwner,
        },
      };
    }
    if (id === "destination_exists") {
      const found = participantList.some((p) => p && String(p.id) === toId);
      return {
        id,
        passed,
        detail: {
          toParticipantId: toId || null,
          found,
        },
      };
    }
    if (id === "from_to_different") {
      return {
        id,
        passed,
        detail: {
          fromParticipantId: fromId || null,
          toParticipantId: toId || null,
        },
      };
    }
    return {
      id,
      passed,
      detail: {
        status: status || null,
        foundInPool: Boolean(pendingMatch),
        pendingTxId: pendingMatch?.id != null ? String(pendingMatch.id) : null,
      },
    };
  });
}

/** @typedef {"pool"|"candidate"|"validation"|"agreement"|"inclusion"|"result"} Lm06SimStage */

function createdAtMsOldestFirst(tx) {
  const raw = tx?.createdAt;
  if (typeof raw !== "string" || !raw.trim()) return Number.POSITIVE_INFINITY;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
}

/**
 * Oldest eligible PENDING by createdAt. Does not mutate input.
 * @param {unknown} pendingTransactions
 * @returns {object|null}
 */
export function selectOldestPendingTransaction(pendingTransactions) {
  if (!Array.isArray(pendingTransactions) || pendingTransactions.length === 0) {
    return null;
  }
  const pending = pendingTransactions.filter(
    (tx) => tx && typeof tx === "object" && String(tx.status || "") === "PENDING"
  );
  if (pending.length === 0) return null;
  const sorted = [...pending].sort(
    (a, b) => createdAtMsOldestFirst(a) - createdAtMsOldestFirst(b)
  );
  return { ...sorted[0] };
}

/**
 * Deterministic proposer for the prototype (Validator 1).
 * @param {ReadonlyArray<{ id: string }>} [validators]
 */
export function selectDeterministicProposer(validators = LM06_VALIDATORS) {
  const list = Array.isArray(validators) ? validators : LM06_VALIDATORS;
  const byId = list.find((v) => v?.id === LM06_PROPOSER_ID);
  return byId ? { ...byId } : { ...list[0] };
}

/**
 * Deep-ish snapshot for local simulation; never returns the same object refs as input.
 * @param {object|null|undefined} ledger
 */
export function snapshotLedgerForSimulation(ledger) {
  if (!ledger || typeof ledger !== "object") {
    return { participants: [], assets: [], pendingTransactions: [] };
  }
  return {
    participants: Array.isArray(ledger.participants)
      ? ledger.participants.map((p) => (p && typeof p === "object" ? { ...p } : p))
      : [],
    assets: Array.isArray(ledger.assets)
      ? ledger.assets.map((a) => (a && typeof a === "object" ? { ...a } : a))
      : [],
    pendingTransactions: Array.isArray(ledger.pendingTransactions)
      ? ledger.pendingTransactions.map((tx) =>
          tx && typeof tx === "object" ? { ...tx } : tx
        )
      : [],
  };
}

/**
 * Deterministic Educational Ledger validation for a candidate transfer.
 * @param {object|null|undefined} tx
 * @param {Array} assets
 * @param {Array} participants
 */
export function validateCandidateTransaction(tx, assets, participants) {
  const assetList = Array.isArray(assets) ? assets : [];
  const participantList = Array.isArray(participants) ? participants : [];
  const participantIds = new Set(
    participantList.map((p) => p?.id).filter(Boolean).map(String)
  );

  const assetId = tx?.assetId != null ? String(tx.assetId) : "";
  const fromId = tx?.fromParticipantId != null ? String(tx.fromParticipantId) : "";
  const toId = tx?.toParticipantId != null ? String(tx.toParticipantId) : "";
  const status = String(tx?.status || "");

  const asset = assetList.find((a) => a && String(a.id) === assetId) || null;
  const assetExists = Boolean(asset);
  const currentOwner = asset?.ownerParticipantId
    ? String(asset.ownerParticipantId)
    : null;
  const fromMatchesOwner =
    assetExists && currentOwner != null && currentOwner === fromId;
  const destinationExists = Boolean(toId) && participantIds.has(toId);
  const fromToDifferent = Boolean(fromId) && Boolean(toId) && fromId !== toId;
  const stillPending = status === "PENDING";

  const byId = {
    asset_exists: assetExists,
    from_matches_owner: fromMatchesOwner,
    destination_exists: destinationExists,
    from_to_different: fromToDifferent,
    still_pending: stillPending,
  };

  const rules = LM06_PROTOCOL_RULE_IDS.map((id) => ({
    id,
    passed: Boolean(byId[id]),
  }));

  const correctDecision = rules.every((r) => r.passed)
    ? LM06_DECISION.VALID
    : LM06_DECISION.INVALID;

  return {
    ok: correctDecision === LM06_DECISION.VALID,
    correctDecision,
    rules,
    currentOwner,
    assetId: assetId || null,
  };
}

/**
 * Peer validators independently apply the same deterministic validation result.
 * Learner (V3) uses their submitted decision. No arbitrary disagreement.
 * @param {{
 *   learnerDecision: "VALID"|"INVALID",
 *   validationOk: boolean,
 * }} args
 */
export function buildSimulatedValidatorDecisions({
  learnerDecision,
  validationOk,
}) {
  const learner =
    learnerDecision === LM06_DECISION.INVALID
      ? LM06_DECISION.INVALID
      : LM06_DECISION.VALID;
  const peerDecision = validationOk
    ? LM06_DECISION.VALID
    : LM06_DECISION.INVALID;

  return LM06_VALIDATORS.map((v) => ({
    validatorId: v.id,
    isLearner: Boolean(v.isLearner),
    isProposer: v.id === LM06_PROPOSER_ID,
    decision:
      v.id === LM06_LEARNER_VALIDATOR_ID ? learner : peerDecision,
    derivedFromRules: v.id !== LM06_LEARNER_VALIDATOR_ID,
  }));
}

/**
 * Educational agreement: strict majority VALID among four validators (3+).
 * Prototype simplification — not a claim about real QBFT quorum math.
 * @param {Array<{ decision: string }>} decisions
 */
export function evaluateEducationalAgreement(decisions) {
  const list = Array.isArray(decisions) ? decisions : [];
  const validCount = list.filter((d) => d?.decision === LM06_DECISION.VALID).length;
  const invalidCount = list.filter((d) => d?.decision === LM06_DECISION.INVALID)
    .length;
  return {
    reached: validCount >= 3,
    validCount,
    invalidCount,
    total: list.length,
  };
}

/**
 * @param {{
 *   transaction: object,
 *   proposerId: string,
 *   decisions: Array,
 *   agreement: object,
 * }} args
 */
export function buildSimulatedInclusionBlock({
  transaction,
  proposerId,
  decisions,
  agreement,
}) {
  return {
    id: "edu-block-preview",
    labelKey: "finalizedBlockTitle",
    status: "FINALIZED_SIMULATION",
    transaction: transaction ? { ...transaction } : null,
    proposerId,
    decisions: Array.isArray(decisions)
      ? decisions.map((d) => ({ ...d }))
      : [],
    agreement: agreement ? { ...agreement } : null,
  };
}

/**
 * BEFORE = current recorded owner; AFTER = transfer destination (local only).
 * @param {{ transaction: object|null, assets: Array }} args
 */
export function buildBeforeAfterState({ transaction, assets }) {
  const assetList = Array.isArray(assets) ? assets : [];
  const assetId = transaction?.assetId != null ? String(transaction.assetId) : "";
  const asset = assetList.find((a) => a && String(a.id) === assetId) || null;
  const beforeOwner = asset?.ownerParticipantId
    ? String(asset.ownerParticipantId)
    : null;
  const afterOwner = transaction?.toParticipantId
    ? String(transaction.toParticipantId)
    : null;

  return {
    assetId: assetId || null,
    beforeOwner,
    afterOwner,
    fromParticipantId: transaction?.fromParticipantId
      ? String(transaction.fromParticipantId)
      : null,
    toParticipantId: afterOwner,
  };
}

/**
 * Map simulation stage → spine step highlighting.
 * @param {Lm06SimStage} stage
 */
export function spineActiveIdForStage(stage) {
  switch (stage) {
    case LM06_SIM_STAGES.POOL:
      return "pending";
    case LM06_SIM_STAGES.CANDIDATE:
      return "candidateBlock";
    case LM06_SIM_STAGES.VALIDATION:
      return "validation";
    case LM06_SIM_STAGES.AGREEMENT:
      return "agreement";
    case LM06_SIM_STAGES.INCLUSION:
      return "finalization";
    case LM06_SIM_STAGES.RESULT:
      return "stateUpdate";
    default:
      return "pending";
  }
}

/**
 * Initial local simulation state (no ledger mutation).
 */
export function createInitialSimulationState() {
  return {
    stage: LM06_SIM_STAGES.POOL,
    snapshot: null,
    candidate: null,
    proposerId: LM06_PROPOSER_ID,
    validation: null,
    learnerDecision: null,
    learnerMatchesCorrect: null,
    decisions: null,
    agreement: null,
    simulatedBlock: null,
    beforeAfter: null,
  };
}

/**
 * Begin consensus round from a live ledger read.
 * Lands on VALIDATION so rules + evidence appear with the candidate (one less empty continue).
 * @param {object} ledger
 */
export function beginConsensusRound(ledger) {
  const snapshot = snapshotLedgerForSimulation(ledger);
  const candidate = selectOldestPendingTransaction(snapshot.pendingTransactions);
  if (!candidate) {
    return {
      ...createInitialSimulationState(),
      snapshot,
      stage: LM06_SIM_STAGES.POOL,
    };
  }
  const proposer = selectDeterministicProposer();
  const validation = validateCandidateTransaction(
    candidate,
    snapshot.assets,
    snapshot.participants
  );
  return {
    ...createInitialSimulationState(),
    stage: LM06_SIM_STAGES.VALIDATION,
    snapshot,
    candidate,
    proposerId: proposer.id,
    validation,
  };
}

/**
 * Advance into learner validation (kept for tests / optional staging).
 * @param {ReturnType<typeof createInitialSimulationState>} state
 */
export function enterValidationStage(state) {
  if (!state?.candidate) return { ...createInitialSimulationState(), ...state };
  return {
    ...state,
    stage: LM06_SIM_STAGES.VALIDATION,
  };
}

/**
 * Apply learner VALID/INVALID, reveal rule-derived peer decisions, compute agreement.
 * Incorrect learner decisions do not stop the simulation.
 * @param {ReturnType<typeof createInitialSimulationState>} state
 * @param {"VALID"|"INVALID"} learnerDecision
 */
export function submitLearnerValidation(state, learnerDecision) {
  if (!state?.candidate) return state;
  const decision =
    learnerDecision === LM06_DECISION.INVALID
      ? LM06_DECISION.INVALID
      : LM06_DECISION.VALID;
  const validationOk = Boolean(state.validation?.ok);
  const correctDecision =
    state.validation?.correctDecision ||
    (validationOk ? LM06_DECISION.VALID : LM06_DECISION.INVALID);
  const decisions = buildSimulatedValidatorDecisions({
    learnerDecision: decision,
    validationOk,
  });
  const agreement = evaluateEducationalAgreement(decisions);
  return {
    ...state,
    stage: LM06_SIM_STAGES.AGREEMENT,
    learnerDecision: decision,
    learnerMatchesCorrect: decision === correctDecision,
    decisions,
    agreement,
  };
}

/**
 * After agreement: build finalized educational block (frontend-only).
 * @param {ReturnType<typeof createInitialSimulationState>} state
 */
export function advanceAfterAgreement(state) {
  if (!state?.agreement?.reached) {
    return {
      ...state,
      stage: LM06_SIM_STAGES.AGREEMENT,
    };
  }
  const simulatedBlock = buildSimulatedInclusionBlock({
    transaction: state.candidate,
    proposerId: state.proposerId,
    decisions: state.decisions,
    agreement: state.agreement,
  });
  const beforeAfter = buildBeforeAfterState({
    transaction: state.candidate,
    assets: state.snapshot?.assets || [],
  });
  return {
    ...state,
    stage: LM06_SIM_STAGES.INCLUSION,
    simulatedBlock,
    beforeAfter,
  };
}

/**
 * @param {ReturnType<typeof createInitialSimulationState>} state
 */
export function advanceToResult(state) {
  if (!state?.simulatedBlock) return state;
  return {
    ...state,
    stage: LM06_SIM_STAGES.RESULT,
  };
}

/**
 * Single advance: agreement → finalized block + state-update view.
 * @param {ReturnType<typeof createInitialSimulationState>} state
 */
export function advanceToFinalizationAndResult(state) {
  const withBlock = advanceAfterAgreement(state);
  if (!withBlock.simulatedBlock) return withBlock;
  return advanceToResult(withBlock);
}

/**
 * Reset local simulation only (keep nothing from prior round).
 */
export function resetSimulationState() {
  return createInitialSimulationState();
}
