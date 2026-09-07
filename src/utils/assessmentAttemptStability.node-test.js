/**
 * Assessment attempt-stability helpers.
 * Run: node --test src/utils/assessmentAttemptStability.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  assessmentChoiceInputClassName,
  seedIncompleteAttemptIfNeeded,
  shouldSeedIncompleteAttempt,
} from "./assessmentAttemptStability.js";

test("token refresh path does not seed again (answers preserved)", () => {
  assert.equal(shouldSeedIncompleteAttempt(false), true);
  assert.equal(shouldSeedIncompleteAttempt(true), false);

  const questions = [{ id: "q1", type: "single_choice" }];
  const first = seedIncompleteAttemptIfNeeded({
    attemptSeeded: false,
    questions,
    emptyAnswers: () => ({ q1: "" }),
    buildOptionOrders: () => ({ q1: ["B", "A"] }),
  });
  assert.equal(first.seeded, true);
  assert.deepEqual(first.answers, { q1: "" });
  assert.deepEqual(first.optionOrders, { q1: ["B", "A"] });

  const afterTokenRefresh = seedIncompleteAttemptIfNeeded({
    attemptSeeded: true,
    questions,
    emptyAnswers: () => ({ q1: "WIPED" }),
    buildOptionOrders: () => ({ q1: ["A", "B", "RESHUFFLED"] }),
  });
  assert.equal(afterTokenRefresh.seeded, false);
  assert.equal(afterTokenRefresh.answers, undefined);
  assert.equal(afterTokenRefresh.optionOrders, undefined);
});

test("token refresh path does not reshuffle option order", () => {
  const stableOrders = { q1: ["C", "A", "B"] };
  let buildCalls = 0;
  const result = seedIncompleteAttemptIfNeeded({
    attemptSeeded: true,
    questions: [{ id: "q1" }],
    emptyAnswers: () => ({ q1: "A" }),
    buildOptionOrders: () => {
      buildCalls += 1;
      return { q1: ["A", "B", "C"] };
    },
  });
  assert.equal(result.seeded, false);
  assert.equal(buildCalls, 0);
  // Caller keeps prior orders when seeded=false.
  assert.deepEqual(stableOrders, { q1: ["C", "A", "B"] });
});

test("explicit retry may start a new shuffle while keeping the helper contract", () => {
  // Retry UI calls buildShuffledOptionOrders directly (force new order).
  // Seeding helper still allows a fresh seed after attemptSeeded is reset.
  assert.equal(shouldSeedIncompleteAttempt(false), true);
  const retried = seedIncompleteAttemptIfNeeded({
    attemptSeeded: false,
    questions: [{ id: "q1" }],
    emptyAnswers: () => ({ q1: "" }),
    buildOptionOrders: () => ({ q1: ["D", "C", "B", "A"] }),
  });
  assert.equal(retried.seeded, true);
  assert.deepEqual(retried.optionOrders, { q1: ["D", "C", "B", "A"] });
});

test("choice input classes mark hollow vs selected for light and dark", () => {
  const radio = assessmentChoiceInputClassName("radio");
  const checkbox = assessmentChoiceInputClassName("checkbox");
  assert.match(radio, /appearance-none/);
  assert.match(radio, /rounded-full/);
  assert.match(radio, /border-slate-400/);
  assert.match(radio, /checked:bg-cyan-700/);
  assert.match(radio, /dark:checked:bg-cyan-400/);
  assert.match(checkbox, /rounded-\[0\.25rem\]/);
  assert.match(checkbox, /appearance-none/);
});
