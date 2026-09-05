/**
 * Learn Continue UI selection helpers.
 * Run: node --test src/utils/learnContinueUi.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  pickLearnContinueProgression,
  shouldShowLearnContinueSection,
} from "./learnContinueUi.js";

const validProgression = {
  earnedTier: "explorer",
  currentModule: "LM01",
  nextAction: { type: "assessment", assessmentId: "lm01-assessment" },
};

test("signed-out learner: no Continue section", () => {
  assert.equal(
    shouldShowLearnContinueSection({
      oidcAuthLoading: false,
      idToken: null,
      isOidcAuthenticated: false,
      fetchLoading: false,
      identityAddress: null,
      identityLoading: false,
      progression: null,
      progressionError: null,
    }),
    false
  );
});

test("authenticated + valid canonical progression: Continue section shown", () => {
  assert.equal(
    shouldShowLearnContinueSection({
      oidcAuthLoading: false,
      idToken: "token",
      isOidcAuthenticated: true,
      fetchLoading: false,
      progression: validProgression,
    }),
    true
  );
  assert.equal(
    pickLearnContinueProgression(validProgression, null).source,
    "fetch"
  );
});

test("progression error: Continue section still shown for signed-in learner", () => {
  assert.equal(
    shouldShowLearnContinueSection({
      oidcAuthLoading: false,
      idToken: "token",
      isOidcAuthenticated: true,
      fetchLoading: false,
      progression: null,
      progressionError: "progression_error",
    }),
    true
  );
});

test("Dashboard metadata progression is reused when fetch is absent", () => {
  const picked = pickLearnContinueProgression(null, validProgression);
  assert.equal(picked.source, "metadata");
  assert.equal(picked.progression.currentModule, "LM01");
  assert.equal(
    shouldShowLearnContinueSection({
      oidcAuthLoading: false,
      idToken: null,
      isOidcAuthenticated: false,
      identityAddress: "0xabc",
      identityLoading: false,
      progression: picked.progression,
    }),
    true
  );
});

test("fetch progression wins over metadata when both valid", () => {
  const fetchProg = { ...validProgression, currentModule: "LM08" };
  const metaProg = { ...validProgression, currentModule: "LM01" };
  const picked = pickLearnContinueProgression(fetchProg, metaProg);
  assert.equal(picked.source, "fetch");
  assert.equal(picked.progression.currentModule, "LM08");
});
