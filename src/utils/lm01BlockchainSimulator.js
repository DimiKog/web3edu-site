/**
 * LM01 Blockchain Simulator — pure chain/hash helpers.
 * Intentionally separate from the PoW mining helper.
 * Hash input: previousHash + data only.
 */

import { keccak_256 } from "@noble/hashes/sha3";

export const LM01_SIM_ZERO_HASH = `0x${"0".repeat(64)}`;

export const LM01_SIM_STAGES = Object.freeze({
  BUILD_1: "build_1",
  BUILD_2: "build_2",
  BUILD_3: "build_3",
  TAMPER: "tamper",
  REPAIR_1: "repair_1",
  REPAIR_2: "repair_2",
  RESTORED: "restored",
  CONCEPT: "concept",
  COMPLETE: "complete",
});

/** Shared FoodTrace ledger records (EN text in both locales — data, not UI prose). */
export const LM01_SIM_LEDGER_RECORDS = Object.freeze([
  "Batch FT-104 registered",
  "Batch FT-104 inspected",
  "Batch FT-104 received",
]);

export const LM01_SIM_DEFAULT_RECORDS = Object.freeze({
  en: LM01_SIM_LEDGER_RECORDS,
  gr: LM01_SIM_LEDGER_RECORDS,
});

export const LM01_SIM_CONCEPT_CORRECT_ID = "B";

/** Comfortable card width before switching the chain to a vertical stack. */
export const LM01_SIM_BLOCK_MIN_WIDTH_PX = 280;
/** Approx. connector gutter between cards in the horizontal layout. */
export const LM01_SIM_CONNECTOR_GUTTER_PX = 72;

/**
 * Prefer vertical stack when the container cannot fit all visible blocks
 * at a readable minimum width (based on measured container width).
 * @param {number} containerWidth
 * @param {number} blockCount
 */
export function shouldStackLm01ChainVertically(containerWidth, blockCount) {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return false;
  if (blockCount <= 1) return false;
  const needed =
    blockCount * LM01_SIM_BLOCK_MIN_WIDTH_PX +
    (blockCount - 1) * LM01_SIM_CONNECTOR_GUTTER_PX;
  return containerWidth < needed;
}

/**
 * @param {{ previousHash: string, data: string }} params
 * @returns {string} 0x-prefixed keccak-256 hex
 */
export function hashLm01Block({ previousHash, data }) {
  const payload = JSON.stringify({
    previousHash: String(previousHash ?? ""),
    data: String(data ?? ""),
  });
  const bytes = new TextEncoder().encode(payload);
  const digest = Array.from(keccak_256(bytes));
  return `0x${digest.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * @param {string} hash
 * @param {number} [head]
 * @param {number} [tail]
 */
export function shortenLm01Hash(hash, head = 10, tail = 8) {
  if (!hash || typeof hash !== "string") return "—";
  if (hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

/**
 * @param {number} index 1-based block number
 * @param {string} previousHash
 * @param {string} data
 */
export function createLm01Block(index, previousHash, data) {
  const prev = String(previousHash ?? LM01_SIM_ZERO_HASH);
  const record = String(data ?? "");
  return {
    index,
    data: record,
    previousHash: prev,
    hash: hashLm01Block({ previousHash: prev, data: record }),
  };
}

/**
 * Deterministic full 3-block chain for a language.
 * @param {"en"|"gr"} [lang]
 * @param {readonly string[]} [records]
 */
export function createLm01InitialChain(lang = "en", records) {
  const localeKey = lang === "gr" ? "gr" : "en";
  const data = records ?? LM01_SIM_DEFAULT_RECORDS[localeKey];
  if (!Array.isArray(data) || data.length !== 3) {
    throw new Error("LM01 simulator requires exactly 3 record strings");
  }

  const block1 = createLm01Block(1, LM01_SIM_ZERO_HASH, data[0]);
  const block2 = createLm01Block(2, block1.hash, data[1]);
  const block3 = createLm01Block(3, block2.hash, data[2]);
  return [block1, block2, block3];
}

/** @param {Array<{ previousHash: string, hash: string }>} chain */
export function isLm01LinkValid(prevBlock, nextBlock) {
  if (!prevBlock || !nextBlock) return false;
  return nextBlock.previousHash === prevBlock.hash;
}

/**
 * Returns the 0-based index of the later block in the first broken link,
 * or -1 if the visible chain is fully linked.
 * @param {Array<{ previousHash: string, hash: string }>} chain
 */
export function getLm01FirstBrokenLinkIndex(chain) {
  if (!Array.isArray(chain) || chain.length < 2) return -1;
  for (let i = 1; i < chain.length; i += 1) {
    if (!isLm01LinkValid(chain[i - 1], chain[i])) return i;
  }
  return -1;
}

/** @param {Array<{ previousHash: string, hash: string }>} chain */
export function isLm01ChainIntegrityValid(chain) {
  return getLm01FirstBrokenLinkIndex(chain) === -1;
}

/**
 * Visible prefix during build stages.
 * @param {string} stage
 * @param {Array} fullChain
 */
export function getLm01VisibleChain(stage, fullChain) {
  const chain = Array.isArray(fullChain) ? fullChain : [];
  if (stage === LM01_SIM_STAGES.BUILD_1) return chain.slice(0, 1);
  if (stage === LM01_SIM_STAGES.BUILD_2) return chain.slice(0, 2);
  return chain.slice();
}

/**
 * Tamper Block 1 data only — recompute Block 1 hash.
 * Does NOT mutate Block 2.previousHash or later blocks.
 * @param {Array} chain
 * @param {string} newData
 */
export function tamperLm01Block1(chain, newData) {
  if (!Array.isArray(chain) || chain.length < 1) {
    throw new Error("Cannot tamper an empty LM01 chain");
  }
  const next = chain.map((block) => ({ ...block }));
  const block1 = next[0];
  const data = String(newData ?? "");
  next[0] = {
    ...block1,
    data,
    hash: hashLm01Block({ previousHash: block1.previousHash, data }),
  };
  return next;
}

/**
 * Repair the first broken link only.
 * Updates that block's previousHash to the current previous block hash
 * and recomputes its hash. Downstream previousHash values are left unchanged.
 * @param {Array} chain
 * @returns {{ chain: Array, repairedIndex: number } | null}
 */
export function repairLm01NextLink(chain) {
  if (!Array.isArray(chain) || chain.length < 2) return null;
  const brokenIndex = getLm01FirstBrokenLinkIndex(chain);
  if (brokenIndex < 1) return null;

  const next = chain.map((block) => ({ ...block }));
  const prev = next[brokenIndex - 1];
  const current = next[brokenIndex];
  const previousHash = prev.hash;
  next[brokenIndex] = {
    ...current,
    previousHash,
    hash: hashLm01Block({ previousHash, data: current.data }),
  };

  return { chain: next, repairedIndex: brokenIndex };
}

/**
 * @param {string} selectedId
 * @returns {"correct"|"incorrect"|"empty"}
 */
export function evaluateLm01ConceptAnswer(selectedId) {
  if (!selectedId) return "empty";
  return selectedId === LM01_SIM_CONCEPT_CORRECT_ID ? "correct" : "incorrect";
}

/**
 * Pure stage transition helper (presentation-free).
 * @param {{ stage: string, chain: Array, selectedConceptId?: string|null }} state
 * @param {{ type: string, data?: string, conceptId?: string }} action
 */
export function reduceLm01SimulatorState(state, action) {
  const stage = state.stage;
  const chain = state.chain;

  switch (action.type) {
    case "ADD_BLOCK_2": {
      if (stage !== LM01_SIM_STAGES.BUILD_1) return state;
      return { ...state, stage: LM01_SIM_STAGES.BUILD_2 };
    }
    case "ADD_BLOCK_3": {
      if (stage !== LM01_SIM_STAGES.BUILD_2) return state;
      return { ...state, stage: LM01_SIM_STAGES.BUILD_3 };
    }
    case "TEST_CHAIN": {
      if (stage !== LM01_SIM_STAGES.BUILD_3) return state;
      return {
        ...state,
        stage: LM01_SIM_STAGES.TAMPER,
        selectedConceptId: null,
        conceptFeedback: null,
      };
    }
    case "TAMPER_BLOCK_1": {
      if (stage !== LM01_SIM_STAGES.TAMPER) return state;
      const nextChain = tamperLm01Block1(chain, action.data);
      return { ...state, chain: nextChain };
    }
    case "REPAIR_NEXT": {
      if (
        stage !== LM01_SIM_STAGES.TAMPER &&
        stage !== LM01_SIM_STAGES.REPAIR_1
      ) {
        return state;
      }
      if (isLm01ChainIntegrityValid(chain)) return state;
      const result = repairLm01NextLink(chain);
      if (!result) return state;
      if (isLm01ChainIntegrityValid(result.chain)) {
        return { ...state, chain: result.chain, stage: LM01_SIM_STAGES.RESTORED };
      }
      return {
        ...state,
        chain: result.chain,
        stage:
          result.repairedIndex === 1
            ? LM01_SIM_STAGES.REPAIR_1
            : LM01_SIM_STAGES.REPAIR_2,
      };
    }
    case "ACK_RESTORED": {
      if (stage !== LM01_SIM_STAGES.RESTORED) return state;
      return {
        ...state,
        stage: LM01_SIM_STAGES.CONCEPT,
        selectedConceptId: null,
        conceptFeedback: null,
      };
    }
    case "SELECT_CONCEPT": {
      if (stage !== LM01_SIM_STAGES.CONCEPT) return state;
      return { ...state, selectedConceptId: action.conceptId ?? null, conceptFeedback: null };
    }
    case "SUBMIT_CONCEPT": {
      if (stage !== LM01_SIM_STAGES.CONCEPT) return state;
      const verdict = evaluateLm01ConceptAnswer(state.selectedConceptId);
      if (verdict === "empty") {
        return { ...state, conceptFeedback: "empty" };
      }
      if (verdict === "correct") {
        return {
          ...state,
          stage: LM01_SIM_STAGES.COMPLETE,
          conceptFeedback: "correct",
        };
      }
      return { ...state, conceptFeedback: "incorrect" };
    }
    case "RETRY_CONCEPT": {
      if (stage !== LM01_SIM_STAGES.CONCEPT) return state;
      return { ...state, selectedConceptId: null, conceptFeedback: null };
    }
    case "RESET": {
      return createLm01SimulatorInitialState(action.lang || state.lang || "en");
    }
    default:
      return state;
  }
}

/** @param {"en"|"gr"} lang */
export function createLm01SimulatorInitialState(lang = "en") {
  return {
    lang: lang === "gr" ? "gr" : "en",
    stage: LM01_SIM_STAGES.BUILD_1,
    chain: createLm01InitialChain(lang),
    selectedConceptId: null,
    conceptFeedback: null,
  };
}
