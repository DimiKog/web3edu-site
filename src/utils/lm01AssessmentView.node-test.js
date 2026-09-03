/**
 * LM01 assessment view helpers + panel polish tests.
 * Run: node --test src/utils/lm01AssessmentView.node-test.js src/components/learning-modules/Lm01AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildShuffledOptionOrders,
  isFoodtraceDesignCaseIntroQuestion,
  mapOptionsForDisplay,
  optionOrdersEqual,
  shuffleArray,
  visualLetterForIndex,
  FOODTRACE_DESIGN_CASE_INTRO_QUESTION_ID,
} from "./lm01AssessmentView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function sequentialRandom(sequence) {
  let i = 0;
  return () => {
    const value = sequence[i % sequence.length];
    i += 1;
    return value;
  };
}

test("shuffleArray preserves members and uses injected randomness", () => {
  const input = ["A", "B", "C", "D"];
  // random always 0 → swaps each i with index 0 → deterministic rotation.
  const shuffled = shuffleArray(input, () => 0);
  assert.deepEqual(shuffled, ["B", "C", "D", "A"]);
  assert.deepEqual([...shuffled].sort(), ["A", "B", "C", "D"]);
});

test("option shuffling preserves canonical option IDs", () => {
  const questions = [
    { id: "q1", optionIds: ["A", "B", "C", "D"] },
    { id: "q3", optionIds: ["A", "B", "C", "D"], type: "multiple_select" },
  ];
  const orders = buildShuffledOptionOrders(questions, sequentialRandom([0.2, 0.8, 0.1, 0.9]));
  assert.deepEqual([...orders.q1].sort(), ["A", "B", "C", "D"]);
  assert.deepEqual([...orders.q3].sort(), ["A", "B", "C", "D"]);
});

test("visual labels derive from shuffled position rather than canonical ID", () => {
  const rows = mapOptionsForDisplay(["D", "A", "B", "C"], {
    A: "text-a",
    B: "text-b",
    C: "text-c",
    D: "Use the existing centralized database",
  });
  assert.equal(rows[0].canonicalId, "D");
  assert.equal(rows[0].visualLetter, "A");
  assert.equal(rows[0].text, "Use the existing centralized database");
  assert.equal(rows[1].canonicalId, "A");
  assert.equal(rows[1].visualLetter, "B");
  assert.equal(visualLetterForIndex(0), "A");
  assert.equal(visualLetterForIndex(3), "D");
});

test("same attempt order stays stable when rebuild is not called", () => {
  const questions = [{ id: "q1", optionIds: ["A", "B", "C", "D"] }];
  const first = buildShuffledOptionOrders(questions, sequentialRandom([0.1, 0.7, 0.3]));
  // Ordinary "render" does not rebuild — compare to itself.
  assert.equal(optionOrdersEqual(first, first), true);
  assert.deepEqual(first.q1, first.q1);
});

test("retry creates a new option order with different randomness", () => {
  const questions = [{ id: "q1", optionIds: ["A", "B", "C", "D"] }];
  const attempt1 = buildShuffledOptionOrders(questions, sequentialRandom([0, 0, 0]));
  const attempt2 = buildShuffledOptionOrders(
    questions,
    sequentialRandom([0.99, 0.99, 0.99])
  );
  assert.equal(optionOrdersEqual(attempt1, attempt2), false);
  assert.deepEqual([...attempt1.q1].sort(), [...attempt2.q1].sort());
});

test("multiple-select rows still expose stable canonical IDs after shuffle", () => {
  const rows = mapOptionsForDisplay(["C", "A", "D", "B"], {
    A: "a",
    B: "b",
    C: "c",
    D: "d",
  });
  const submitted = rows.filter((r) => ["A", "C", "D"].includes(r.canonicalId)).map(
    (r) => r.canonicalId
  );
  assert.deepEqual([...submitted].sort(), ["A", "C", "D"]);
  assert.equal(rows.find((r) => r.canonicalId === "C").visualLetter, "A");
});

test("FoodTrace Design Case marker targets Q6 intro only", () => {
  assert.equal(FOODTRACE_DESIGN_CASE_INTRO_QUESTION_ID, "lm01_q6_foodtrace_consider");
  assert.equal(isFoodtraceDesignCaseIntroQuestion("lm01_q6_foodtrace_consider"), true);
  assert.equal(isFoodtraceDesignCaseIntroQuestion("lm01_q7_university_inventory"), false);
  assert.equal(isFoodtraceDesignCaseIntroQuestion("lm01_q5_blockchain_crypto"), false);
});
