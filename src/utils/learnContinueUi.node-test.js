/**
 * Learn Continue UI selection helpers.
 * Run: node --test src/utils/learnContinueUi.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import { getContinueLearningViewState } from "./continueLearningView.js";
import {
  areAllAvailableLearningModulesComplete,
  getAvailableLearningModuleIds,
  pickLearnContinueProgression,
  resolveLearnContinueBarPresentation,
  shouldShowLearnContinueSection,
} from "./learnContinueUi.js";

const validProgression = {
  earnedTier: "explorer",
  currentModule: "LM01",
  nextAction: { type: "assessment", assessmentId: "lm01-assessment" },
};

/** Canonical complete flags for every registry-available chapter (LM01–LM08). */
function modulesCompleteThroughLm08() {
  const modules = {};
  for (const id of getAvailableLearningModuleIds()) {
    modules[id] = { complete: true, requiredEvidence: {} };
  }
  return modules;
}

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
  assert.equal(
    resolveLearnContinueBarPresentation(null, "en").mode,
    "invalid"
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

test("available module ids exclude Planned LM09–LM11", () => {
  const ids = getAvailableLearningModuleIds();
  assert.deepEqual(ids, [
    "LM01",
    "LM02",
    "LM03",
    "LM04",
    "LM05",
    "LM06",
    "LM07",
    "LM08",
  ]);
  assert.equal(ids.includes("LM09"), false);
  assert.equal(ids.includes("LM10"), false);
  assert.equal(ids.includes("LM11"), false);
});

test("incomplete available modules: Continue stays active (State A)", () => {
  const progression = {
    earnedTier: "builder",
    computedTier: null,
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "current_curriculum_path",
    },
    currentModule: "LM08",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM08",
      evidenceId: "lm08-contract-inspection",
    },
    modules: {
      LM01: { complete: true },
      LM02: { complete: true },
      LM03: { complete: true },
      LM04: { complete: true },
      LM05: { complete: true },
      LM06: { complete: true },
      LM07: { complete: true },
      LM08: { complete: false },
    },
    xp: { current: 2400, nextTier: "architect", nextTierXp: 7000, remaining: 4600 },
  };

  assert.equal(areAllAvailableLearningModulesComplete(progression), false);
  const presentation = resolveLearnContinueBarPresentation(progression, "en");
  assert.equal(presentation.mode, "active");
  assert.equal(presentation.view.action.status, "ready");
  assert.equal(
    presentation.view.action.route,
    "/learning-modules/lm08/contract-inspection"
  );
  assert.doesNotMatch(presentation.view.action.cta, /not yet available/i);
});

test("all available modules complete + Planned LM09 nextAction: State B (not unavailable CTA)", () => {
  const progression = {
    earnedTier: "builder",
    computedTier: null,
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "current_curriculum_path",
    },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    modules: modulesCompleteThroughLm08(),
    xp: { current: 2500, nextTier: "architect", nextTierXp: 7000, remaining: 4500 },
  };

  // Shared Continue view still maps Planned evidence as unavailable (Dashboard).
  const shared = getContinueLearningViewState(progression, "en");
  assert.equal(shared.mode, "active");
  assert.equal(shared.action.status, "unavailable");
  assert.match(shared.action.cta, /not yet available/i);
  assert.equal(shared.moduleId, "LM09");

  // Learn landing must not treat Planned LM09 as the Continue target.
  assert.equal(areAllAvailableLearningModulesComplete(progression), true);
  const presentation = resolveLearnContinueBarPresentation(progression, "en");
  assert.equal(presentation.mode, "available_complete");
  assert.equal(presentation.view, undefined);
});

test("completion uses canonical modules[].complete only — not XP", () => {
  const highXpIncomplete = {
    earnedTier: "builder",
    currentPath: { targetTier: "architect", alignmentStatus: "current_curriculum_path" },
    currentModule: "LM08",
    nextAction: {
      type: "assessment",
      moduleId: "LM08",
      assessmentId: "lm08-assessment",
    },
    modules: {
      ...Object.fromEntries(
        getAvailableLearningModuleIds().map((id) => [
          id,
          { complete: id !== "LM08" },
        ])
      ),
    },
    xp: { current: 99999, nextTierXp: 7000, remaining: 0 },
  };
  assert.equal(areAllAvailableLearningModulesComplete(highXpIncomplete), false);
  assert.equal(
    resolveLearnContinueBarPresentation(highXpIncomplete, "en").mode,
    "active"
  );

  const lowXpAllComplete = {
    earnedTier: "builder",
    currentPath: { targetTier: "architect", alignmentStatus: "current_curriculum_path" },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    modules: modulesCompleteThroughLm08(),
    xp: { current: 0, nextTierXp: 7000, remaining: 7000 },
  };
  assert.equal(areAllAvailableLearningModulesComplete(lowXpAllComplete), true);
  assert.equal(
    resolveLearnContinueBarPresentation(lowXpAllComplete, "en").mode,
    "available_complete"
  );
});

test("Planned module complete flags alone do not satisfy available-completion", () => {
  const progression = {
    earnedTier: "explorer",
    currentModule: "LM01",
    nextAction: {
      type: "assessment",
      moduleId: "LM01",
      assessmentId: "lm01-assessment",
    },
    modules: {
      LM09: { complete: true },
      LM10: { complete: true },
      LM11: { complete: true },
    },
  };
  assert.equal(areAllAvailableLearningModulesComplete(progression), false);
  assert.equal(
    resolveLearnContinueBarPresentation(progression, "en").mode,
    "active"
  );
});
