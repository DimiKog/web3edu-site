/**
 * Helpers for LM07 Smart Contract Execution Trace form → POST payload.
 * Presentation helpers only — server remains authoritative for grading.
 */

export const LM07_SCENARIO_SCORE_INCREASE = "score_increase";
export const LM07_SCENARIO_TRANSFER_SUFFICIENT = "transfer_sufficient";
export const LM07_SCENARIO_TRANSFER_INSUFFICIENT = "transfer_insufficient";

export const LM07_REQUIRED_SCENARIO_IDS = Object.freeze([
  LM07_SCENARIO_SCORE_INCREASE,
  LM07_SCENARIO_TRANSFER_SUFFICIENT,
  LM07_SCENARIO_TRANSFER_INSUFFICIENT,
]);

/**
 * Empty form state keyed by scenario id.
 * @returns {Record<string, Record<string, string>>}
 */
export function emptyLm07ExecutionTraceForm() {
  return {
    [LM07_SCENARIO_SCORE_INCREASE]: { resultingScore: "" },
    [LM07_SCENARIO_TRANSFER_SUFFICIENT]: {
      aliceBalance: "",
      bobBalance: "",
    },
    [LM07_SCENARIO_TRANSFER_INSUFFICIENT]: {
      outcome: "rejected",
      aliceBalance: "",
      bobBalance: "",
    },
  };
}

/**
 * @param {string|number|null|undefined} raw
 * @returns {number|null}
 */
export function parseOptionalInt(raw) {
  if (raw === null || raw === undefined) return null;
  const text = String(raw).trim();
  if (!text) return null;
  if (!/^-?\d+$/.test(text)) return null;
  const value = Number(text);
  return Number.isInteger(value) ? value : null;
}

/**
 * Build the POST `scenarios` object from form state.
 * Returns null when required numeric fields are missing/invalid.
 *
 * @param {Record<string, Record<string, string>>} form
 * @returns {Record<string, object>|null}
 */
export function buildLm07ExecutionTraceScenariosPayload(form) {
  if (!form || typeof form !== "object") return null;

  const score = parseOptionalInt(form[LM07_SCENARIO_SCORE_INCREASE]?.resultingScore);
  const okAlice = parseOptionalInt(
    form[LM07_SCENARIO_TRANSFER_SUFFICIENT]?.aliceBalance
  );
  const okBob = parseOptionalInt(form[LM07_SCENARIO_TRANSFER_SUFFICIENT]?.bobBalance);
  const failAlice = parseOptionalInt(
    form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.aliceBalance
  );
  const failBob = parseOptionalInt(
    form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.bobBalance
  );
  const outcome = String(
    form[LM07_SCENARIO_TRANSFER_INSUFFICIENT]?.outcome || ""
  )
    .trim()
    .toLowerCase();

  if (
    score === null ||
    okAlice === null ||
    okBob === null ||
    failAlice === null ||
    failBob === null ||
    !outcome
  ) {
    return null;
  }

  return {
    [LM07_SCENARIO_SCORE_INCREASE]: { resultingScore: score },
    [LM07_SCENARIO_TRANSFER_SUFFICIENT]: {
      aliceBalance: okAlice,
      bobBalance: okBob,
    },
    [LM07_SCENARIO_TRANSFER_INSUFFICIENT]: {
      outcome,
      aliceBalance: failAlice,
      bobBalance: failBob,
    },
  };
}

/**
 * @param {Record<string, Record<string, string>>} form
 * @returns {boolean}
 */
export function isLm07ExecutionTraceFormComplete(form) {
  return buildLm07ExecutionTraceScenariosPayload(form) !== null;
}

/**
 * Normalize GET `scenarios` map into a stable display list.
 * @param {Record<string, object>|null|undefined} scenarios
 * @returns {object[]}
 */
export function listLm07ExecutionTraceScenarios(scenarios) {
  if (!scenarios || typeof scenarios !== "object") return [];
  return LM07_REQUIRED_SCENARIO_IDS.map((id) => {
    const row = scenarios[id];
    if (!row || typeof row !== "object") {
      return { id, missing: true };
    }
    return { id, missing: false, ...row };
  });
}
