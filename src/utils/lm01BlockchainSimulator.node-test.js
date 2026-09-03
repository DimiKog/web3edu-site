/**
 * LM01 Blockchain Simulator — educational state transitions.
 * Run: node --test src/utils/lm01BlockchainSimulator.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { LM01_BLOCKCHAIN_SIMULATOR_COPY } from "../content/lm01BlockchainSimulatorLocale.js";
import {
  LM01_SIM_CONCEPT_CORRECT_ID,
  LM01_SIM_DEFAULT_RECORDS,
  LM01_SIM_STAGES,
  LM01_SIM_ZERO_HASH,
  createLm01InitialChain,
  createLm01SimulatorInitialState,
  evaluateLm01ConceptAnswer,
  getLm01FirstBrokenLinkIndex,
  hashLm01Block,
  isLm01ChainIntegrityValid,
  isLm01LinkValid,
  reduceLm01SimulatorState,
  repairLm01NextLink,
  shouldStackLm01ChainVertically,
  tamperLm01Block1,
} from "./lm01BlockchainSimulator.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("deterministic initial hashes for EN records", () => {
  const a = createLm01InitialChain("en");
  const b = createLm01InitialChain("en");
  assert.equal(a[0].hash, b[0].hash);
  assert.equal(a[1].hash, b[1].hash);
  assert.equal(a[2].hash, b[2].hash);
  assert.equal(a[0].previousHash, LM01_SIM_ZERO_HASH);
  assert.equal(
    a[0].hash,
    hashLm01Block({ previousHash: LM01_SIM_ZERO_HASH, data: LM01_SIM_DEFAULT_RECORDS.en[0] })
  );
});

test("Block 2 previousHash initially equals Block 1 hash", () => {
  const chain = createLm01InitialChain("en");
  assert.equal(chain[1].previousHash, chain[0].hash);
  assert.equal(isLm01LinkValid(chain[0], chain[1]), true);
});

test("Block 3 previousHash initially equals Block 2 hash", () => {
  const chain = createLm01InitialChain("en");
  assert.equal(chain[2].previousHash, chain[1].hash);
  assert.equal(isLm01LinkValid(chain[1], chain[2]), true);
  assert.equal(isLm01ChainIntegrityValid(chain), true);
});

test("tampering Block 1 changes Block 1 hash only and does not mutate Block 2.previousHash", () => {
  const chain = createLm01InitialChain("en");
  const originalB1Hash = chain[0].hash;
  const originalB2Prev = chain[1].previousHash;
  const originalB2Hash = chain[1].hash;
  const originalB3Prev = chain[2].previousHash;
  const originalB3Hash = chain[2].hash;

  const next = tamperLm01Block1(chain, "Batch FT-104 REGISTERED (altered)");
  assert.notEqual(next[0].hash, originalB1Hash);
  assert.equal(next[1].previousHash, originalB2Prev);
  assert.equal(next[1].previousHash, originalB1Hash);
  assert.equal(next[1].hash, originalB2Hash);
  assert.equal(next[2].previousHash, originalB3Prev);
  assert.equal(next[2].hash, originalB3Hash);
  assert.notEqual(next[0].hash, next[1].previousHash);
});

test("first mismatch after tamper is Block 1 → Block 2", () => {
  const chain = tamperLm01Block1(createLm01InitialChain("en"), "altered record");
  assert.equal(getLm01FirstBrokenLinkIndex(chain), 1);
  assert.equal(isLm01LinkValid(chain[0], chain[1]), false);
  assert.equal(isLm01LinkValid(chain[1], chain[2]), true);
});

test("first repair updates/re-hashes Block 2 but does not update Block 3.previousHash", () => {
  const broken = tamperLm01Block1(createLm01InitialChain("en"), "altered record");
  const originalB3Prev = broken[2].previousHash;
  const originalB2Hash = broken[1].hash;

  const repaired = repairLm01NextLink(broken);
  assert.ok(repaired);
  assert.equal(repaired.repairedIndex, 1);
  assert.equal(repaired.chain[1].previousHash, repaired.chain[0].hash);
  assert.notEqual(repaired.chain[1].hash, originalB2Hash);
  assert.equal(repaired.chain[2].previousHash, originalB3Prev);
  assert.notEqual(repaired.chain[1].hash, repaired.chain[2].previousHash);
});

test("after first repair mismatch moves to Block 2 → Block 3", () => {
  const broken = tamperLm01Block1(createLm01InitialChain("en"), "altered record");
  const repaired = repairLm01NextLink(broken);
  assert.equal(getLm01FirstBrokenLinkIndex(repaired.chain), 2);
  assert.equal(isLm01LinkValid(repaired.chain[0], repaired.chain[1]), true);
  assert.equal(isLm01LinkValid(repaired.chain[1], repaired.chain[2]), false);
});

test("second repair restores all links", () => {
  const broken = tamperLm01Block1(createLm01InitialChain("en"), "altered record");
  const afterFirst = repairLm01NextLink(broken).chain;
  const afterSecond = repairLm01NextLink(afterFirst);
  assert.equal(afterSecond.repairedIndex, 2);
  assert.equal(isLm01ChainIntegrityValid(afterSecond.chain), true);
  assert.equal(getLm01FirstBrokenLinkIndex(afterSecond.chain), -1);
});

test("reset restores deterministic initial chain via reducer", () => {
  let state = createLm01SimulatorInitialState("en");
  state = reduceLm01SimulatorState(state, { type: "ADD_BLOCK_2" });
  state = reduceLm01SimulatorState(state, { type: "ADD_BLOCK_3" });
  state = reduceLm01SimulatorState(state, { type: "TEST_CHAIN" });
  state = reduceLm01SimulatorState(state, {
    type: "TAMPER_BLOCK_1",
    data: "tampered",
  });
  state = reduceLm01SimulatorState(state, { type: "REPAIR_NEXT" });
  state = reduceLm01SimulatorState(state, { type: "REPAIR_NEXT" });
  assert.equal(state.stage, LM01_SIM_STAGES.RESTORED);

  const reset = reduceLm01SimulatorState(state, { type: "RESET", lang: "en" });
  const fresh = createLm01SimulatorInitialState("en");
  assert.equal(reset.stage, LM01_SIM_STAGES.BUILD_1);
  assert.deepEqual(reset.chain, fresh.chain);
  assert.equal(reset.selectedConceptId, null);
  assert.equal(reset.conceptFeedback, null);
});

test("concept-check retry does not reveal the answer and allows another attempt", () => {
  let state = createLm01SimulatorInitialState("en");
  state = {
    ...state,
    stage: LM01_SIM_STAGES.CONCEPT,
    selectedConceptId: "A",
  };
  state = reduceLm01SimulatorState(state, { type: "SUBMIT_CONCEPT" });
  assert.equal(state.stage, LM01_SIM_STAGES.CONCEPT);
  assert.equal(state.conceptFeedback, "incorrect");
  assert.equal(evaluateLm01ConceptAnswer("A"), "incorrect");

  state = reduceLm01SimulatorState(state, { type: "RETRY_CONCEPT" });
  assert.equal(state.selectedConceptId, null);
  assert.equal(state.conceptFeedback, null);

  state = reduceLm01SimulatorState(state, {
    type: "SELECT_CONCEPT",
    conceptId: LM01_SIM_CONCEPT_CORRECT_ID,
  });
  state = reduceLm01SimulatorState(state, { type: "SUBMIT_CONCEPT" });
  assert.equal(state.stage, LM01_SIM_STAGES.COMPLETE);
  assert.equal(state.conceptFeedback, "correct");
});

test("full guided reducer path reaches restored then concept", () => {
  let state = createLm01SimulatorInitialState("gr");
  assert.equal(state.stage, LM01_SIM_STAGES.BUILD_1);
  state = reduceLm01SimulatorState(state, { type: "ADD_BLOCK_2" });
  state = reduceLm01SimulatorState(state, { type: "ADD_BLOCK_3" });
  assert.equal(isLm01ChainIntegrityValid(state.chain), true);
  state = reduceLm01SimulatorState(state, { type: "TEST_CHAIN" });
  assert.equal(state.stage, LM01_SIM_STAGES.TAMPER);

  state = reduceLm01SimulatorState(state, {
    type: "TAMPER_BLOCK_1",
    data: "αλλοιωμένη εγγραφή",
  });
  assert.equal(getLm01FirstBrokenLinkIndex(state.chain), 1);

  state = reduceLm01SimulatorState(state, { type: "REPAIR_NEXT" });
  assert.equal(state.stage, LM01_SIM_STAGES.REPAIR_1);
  assert.equal(getLm01FirstBrokenLinkIndex(state.chain), 2);

  state = reduceLm01SimulatorState(state, { type: "REPAIR_NEXT" });
  assert.equal(state.stage, LM01_SIM_STAGES.RESTORED);
  assert.equal(isLm01ChainIntegrityValid(state.chain), true);

  state = reduceLm01SimulatorState(state, { type: "ACK_RESTORED" });
  assert.equal(state.stage, LM01_SIM_STAGES.CONCEPT);
});

test("EN/GR locale content covers required concept options and CTAs", () => {
  for (const lang of ["en", "gr"]) {
    const copy = LM01_BLOCKCHAIN_SIMULATOR_COPY[lang];
    assert.ok(copy.title);
    assert.ok(copy.tagline);
    assert.ok(copy.addBlock2);
    assert.ok(copy.addBlock3);
    assert.ok(copy.testChain);
    assert.ok(copy.tamperInstruction);
    assert.ok(copy.repairNext);
    assert.ok(copy.restoredExplain);
    assert.ok(copy.consensusBridge);
    assert.ok(copy.consensusNote);
    assert.ok(copy.conceptTitle);
    assert.deepEqual(Object.keys(copy.conceptOptions).sort(), ["A", "B", "C", "D"]);
    assert.ok(copy.conceptIncorrect);
    assert.ok(copy.conceptRetry);
    assert.ok(copy.experimentComplete);
    assert.ok(copy.runAgain);
    assert.equal(LM01_SIM_DEFAULT_RECORDS[lang].length, 3);
  }

  assert.deepEqual(LM01_SIM_DEFAULT_RECORDS.en, LM01_SIM_DEFAULT_RECORDS.gr);
  assert.equal(LM01_SIM_DEFAULT_RECORDS.gr[0], "Batch FT-104 registered");
  assert.equal(LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.previousHashLabel, "Previous Hash");
  assert.equal(LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.hashLabel, "Hash");
  assert.equal(LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.stageLabels.repair, "Αποκατάσταση");
  assert.equal(
    LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.stageLabels.concept,
    "Έλεγχος κατανόησης"
  );
  assert.match(
    LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.chainBroken,
    /παραβιάστηκε/
  );
  assert.match(
    LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.repairNext,
    /Αποκατάσταση επόμενης σύνδεσης/
  );
  assert.match(
    LM01_BLOCKCHAIN_SIMULATOR_COPY.gr.mismatchTitle,
    /Ασυμφωνία σύνδεσης Hash/
  );
});

test("chain stacks vertically when container is too narrow for readable cards", () => {
  assert.equal(shouldStackLm01ChainVertically(1200, 3), false);
  assert.equal(shouldStackLm01ChainVertically(900, 3), true);
  assert.equal(shouldStackLm01ChainVertically(640, 2), false);
  assert.equal(shouldStackLm01ChainVertically(500, 2), true);
  assert.equal(shouldStackLm01ChainVertically(400, 1), false);
});

test("LM01 helper does not depend on PoW mining hashBlock transactions/nonce semantics", () => {
  const helperSrc = readFileSync(join(__dirname, "lm01BlockchainSimulator.js"), "utf8");
  const hashFn = helperSrc.slice(
    helperSrc.indexOf("export function hashLm01Block"),
    helperSrc.indexOf("export function shortenLm01Hash")
  );
  assert.match(helperSrc, /keccak_256/);
  assert.match(hashFn, /previousHash/);
  assert.match(hashFn, /\bdata\b/);
  assert.doesNotMatch(hashFn, /\bnonce\b/);
  assert.doesNotMatch(hashFn, /transactions/);
  assert.doesNotMatch(helperSrc, /from ["'].*mining/);
});

test("component stays isolated from mining / System Lab S1 imports", () => {
  const panelSrc = readFileSync(
    join(__dirname, "../components/learning-modules/Lm01BlockchainSimulator.jsx"),
    "utf8"
  );
  assert.doesNotMatch(panelSrc, /BlockchainView/);
  assert.doesNotMatch(panelSrc, /MiningControls/);
  assert.doesNotMatch(panelSrc, /Mempool/);
  assert.doesNotMatch(panelSrc, /mining\.js/);
  assert.doesNotMatch(panelSrc, /SystemLabS1/);
  assert.doesNotMatch(panelSrc, /labWriteApi/);
  assert.doesNotMatch(panelSrc, /postLabsComplete|fetchLm01Assessment/);
});
