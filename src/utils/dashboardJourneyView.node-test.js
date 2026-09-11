/**
 * Dashboard v2 Slice 1 — journey view helpers.
 * Run: node --test src/utils/dashboardJourneyView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  countCompletedModules,
  getDashboardJourneyViewState,
  getJourneyTierModuleIds,
  getLearningJourneyNodes,
  getLegacyBuilderStatusLabel,
  hasAnyLearningModuleCompletion,
  hasHistoricalWeb3EduRecord,
  isAuthoritativeLegacyBridgePath,
  JOURNEY_TIER_ORDER,
} from "./dashboardJourneyView.js";
import { DASHBOARD_JOURNEY_LOCALE } from "../content/dashboardJourneyLocale.js";
import { DASHBOARD_COMPOSITION_LOCALE } from "../content/dashboardCompositionLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const viewSrc = readFileSync(join(__dirname, "dashboardJourneyView.js"), "utf8");
const sliceSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardJourneySlice.jsx"),
  "utf8"
);
const dashboardSrc = readFileSync(join(__dirname, "../pages/Dashboard.jsx"), "utf8");
const dashboardGrSrc = readFileSync(join(__dirname, "../pages/DashboardGR.jsx"), "utf8");

function emptyModules() {
  const modules = {};
  for (let n = 1; n <= 11; n += 1) {
    modules[`LM${String(n).padStart(2, "0")}`] = { complete: false };
  }
  return modules;
}

function defaultMilestones(overrides = {}) {
  return {
    explorer: {
      requiredModules: ["LM01", "LM02", "LM03"],
      modulesSatisfied: false,
      xpSatisfied: false,
      satisfied: false,
      ...overrides.explorer,
    },
    builder: {
      requiredModules: ["LM01", "LM02", "LM03", "LM04", "LM05", "LM06", "LM07", "LM08"],
      modulesSatisfied: false,
      xpSatisfied: false,
      satisfied: false,
      ...overrides.builder,
    },
    architect: {
      requiredModules: [
        "LM01",
        "LM02",
        "LM03",
        "LM04",
        "LM05",
        "LM06",
        "LM07",
        "LM08",
        "LM09",
        "LM10",
        "LM11",
      ],
      modulesSatisfied: false,
      xpSatisfied: false,
      satisfied: false,
      ...overrides.architect,
    },
  };
}

function progressionBase(overrides = {}) {
  const base = {
    earnedTier: "explorer",
    computedTier: null,
    currentPath: {
      targetTier: "explorer",
      alignmentStatus: "current_curriculum_path",
      isLegacyBuilder: false,
      bridge: { required: false, complete: false, missingEvidence: [] },
    },
    currentModule: "LM01",
    nextAction: {
      type: "assessment",
      moduleId: "LM01",
      assessmentId: "lm01-assessment",
    },
    xp: { current: 0, nextTier: "explorer", nextTierXp: 400, remaining: 400 },
    milestones: defaultMilestones(),
    modules: emptyModules(),
  };
  return {
    ...base,
    ...overrides,
    currentPath: {
      ...base.currentPath,
      ...(overrides.currentPath && typeof overrides.currentPath === "object"
        ? overrides.currentPath
        : {}),
    },
    milestones: overrides.milestones ?? base.milestones,
    modules: overrides.modules ?? base.modules,
  };
}

test("no getProgressFromXpTotal / getRoleFromXpTotal in journey helpers", () => {
  assert.doesNotMatch(viewSrc, /getProgressFromXpTotal/);
  assert.doesNotMatch(viewSrc, /getRoleFromXpTotal/);
  assert.doesNotMatch(viewSrc, /from ["'].*progression\.js["']/);
  assert.doesNotMatch(sliceSrc, /getProgressFromXpTotal/);
});

test("EN/GR locale keys stay in parity", () => {
  const enKeys = Object.keys(DASHBOARD_JOURNEY_LOCALE.en).sort();
  const grKeys = Object.keys(DASHBOARD_JOURNEY_LOCALE.gr).sort();
  assert.deepEqual(enKeys, grKeys);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.en.statusLegacyTransition);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.gr.statusLegacyTransition);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.en.statusNotStarted);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.gr.statusNotStarted);
  assert.equal(
    DASHBOARD_JOURNEY_LOCALE.en.statusLegacyTransition,
    "Transitioning to new path"
  );
  assert.equal(
    DASHBOARD_JOURNEY_LOCALE.gr.statusLegacyTransition,
    "Προσαρμογή στο νέο πρόγραμμα"
  );
  assert.equal(DASHBOARD_JOURNEY_LOCALE.en.statusNotStarted, "Not started");
  assert.equal(DASHBOARD_JOURNEY_LOCALE.gr.statusNotStarted, "Δεν έχει ξεκινήσει");
  assert.ok(DASHBOARD_JOURNEY_LOCALE.en.viewLearningPath);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.gr.viewLearningPath);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.en.nextMilestoneEyebrow);
  assert.ok(DASHBOARD_JOURNEY_LOCALE.gr.upcomingBody);
});

test("historical record detection ignores Learning Module fields", () => {
  assert.equal(hasHistoricalWeb3EduRecord({ xp_total: 0 }), false);
  assert.equal(hasHistoricalWeb3EduRecord({ xp_total: 2850 }), true);
  assert.equal(
    hasHistoricalWeb3EduRecord({
      modules: { LM01: { complete: true } },
      xp_total: 0,
    }),
    false
  );
});

test("1) normal active learner in LM02 → Explorer current", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  const progression = progressionBase({
    currentModule: "LM02",
    nextAction: {
      type: "assessment",
      moduleId: "LM02",
      assessmentId: "lm02-assessment",
    },
    modules,
  });
  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[0].status, "current");
  assert.equal(nodes[0].statusLabel, "In progress");
  assert.equal(nodes[1].status, "locked");
  assert.equal(nodes[1].statusLabel, "Coming next");
  assert.equal(nodes[2].status, "locked");
});

test("2) normal active learner in LM08 → Builder current", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  modules.LM04 = { complete: true };
  modules.LM05 = { complete: true };
  const progression = progressionBase({
    currentPath: {
      targetTier: "builder",
      alignmentStatus: "current_curriculum_path",
      isLegacyBuilder: false,
      bridge: { required: false, complete: false, missingEvidence: [] },
    },
    currentModule: "LM08",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM08",
      evidenceId: "lm08-contract-inspection",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
    }),
    modules,
  });
  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[0].status, "completed");
  assert.equal(nodes[1].status, "current");
  assert.equal(nodes[1].statusLabel, "In progress");
  assert.equal(nodes[2].status, "locked");
  assert.equal(nodes[2].statusLabel, "Coming next");
});

test("3) canonical currentModule LM09 → Architect current, 0 done → Not started", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  const progression = progressionBase({
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
    }),
    modules,
  });
  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[2].tierKey, "architect");
  assert.equal(nodes[2].status, "current");
  assert.equal(nodes[2].done, 0);
  assert.equal(nodes[2].statusLabel, "Not started");
  assert.notEqual(nodes[2].statusLabel, "Coming next");
  assert.notEqual(nodes[2].statusLabel, "In progress");

  const gr = getLearningJourneyNodes(progression, "gr");
  assert.equal(gr[2].status, "current");
  assert.equal(gr[2].statusLabel, "Δεν έχει ξεκινήσει");
});

test("3b) Architect with completed module progress → In progress (EN/GR)", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  modules.LM09 = { complete: true }; // 1/3 architect started
  const progression = progressionBase({
    currentModule: "LM10",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM10",
      evidenceId: "lm10-evidence",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
    }),
    modules,
  });
  const en = getLearningJourneyNodes(progression, "en");
  assert.equal(en[2].tierKey, "architect");
  assert.equal(en[2].status, "current");
  assert.equal(en[2].done, 1);
  assert.equal(en[2].statusLabel, "In progress");

  const gr = getLearningJourneyNodes(progression, "gr");
  assert.equal(gr[2].status, "current");
  assert.equal(gr[2].statusLabel, "Σε εξέλιξη");
});

test("4) legacy/bridge learner LM09 → Builder bridged not completed/locked", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  modules.LM04 = { complete: true }; // 1/5 builder — honest count, not full complete

  const progression = progressionBase({
    earnedTier: "builder",
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "legacy_bridge_complete",
      isLegacyBuilder: true,
      bridge: { required: true, complete: true, missingEvidence: [] },
    },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
      builder: { modulesSatisfied: false },
    }),
    modules,
  });

  assert.equal(isAuthoritativeLegacyBridgePath(progression), true);

  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[0].status, "completed");
  assert.equal(nodes[0].statusLabel, "Completed");
  assert.equal(nodes[0].modulesLabel, "3/3 modules");

  assert.equal(nodes[1].status, "bridged");
  assert.equal(nodes[1].statusLabel, "Transitioning to new path");
  assert.equal(nodes[1].modulesLabel, "1/5 modules");
  assert.notEqual(nodes[1].status, "completed");
  assert.notEqual(nodes[1].status, "locked");

  assert.equal(nodes[2].status, "current");
  assert.equal(nodes[2].done, 0);
  assert.equal(nodes[2].statusLabel, "Not started");
});

test("5) canonical nextAction with valid route → Continue CTA unchanged", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  const progression = progressionBase({
    currentModule: "LM02",
    nextAction: {
      type: "assessment",
      moduleId: "LM02",
      assessmentId: "lm02-assessment",
    },
    modules,
  });
  const view = getDashboardJourneyViewState({
    progression,
    hasHistoricalRecord: true,
    lang: "en",
  });
  assert.equal(view.mode, "active");
  assert.equal(view.nextStep.variant, "continue");
  assert.equal(view.nextStep.primaryEnabled, true);
  assert.equal(view.nextStep.primaryRoute, "/learning-modules/lm02/assessment");
  assert.match(view.nextStep.primaryCta, /Continue/i);
});

test("6) canonical nextAction with no route → upcoming, no Continue CTA", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  const progression = progressionBase({
    earnedTier: "builder",
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "legacy_bridge_complete",
      isLegacyBuilder: true,
      bridge: { required: true, complete: true, missingEvidence: [] },
    },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
    }),
    modules,
  });

  const en = getDashboardJourneyViewState({
    progression,
    hasHistoricalRecord: true,
    lang: "en",
  });
  assert.equal(en.nextStep.variant, "upcoming");
  assert.equal(en.nextStep.primaryCta, null);
  assert.equal(en.nextStep.primaryRoute, null);
  assert.equal(en.nextStep.primaryEnabled, false);
  assert.match(en.nextStep.title, /LM09/);
  assert.match(en.nextStep.body, /not available yet/i);
  assert.equal(en.nextStep.secondaryRoute, "/learn");
  assert.match(en.nextStep.secondaryCta, /Learning Path/i);

  const gr = getDashboardJourneyViewState({
    progression,
    hasHistoricalRecord: true,
    lang: "gr",
  });
  assert.equal(gr.nextStep.variant, "upcoming");
  assert.equal(gr.nextStep.primaryEnabled, false);
  assert.equal(gr.nextStep.secondaryRoute, "/learn-gr");
  assert.equal(gr.journeyNodes[1].statusLabel, "Προσαρμογή στο νέο πρόγραμμα");
  assert.equal(gr.journeyNodes[2].status, "current");
  assert.equal(gr.journeyNodes[2].statusLabel, "Δεν έχει ξεκινήσει");
  assert.equal(en.journeyNodes[1].statusLabel, "Transitioning to new path");
  assert.equal(en.journeyNodes[2].statusLabel, "Not started");
});

test("legacy XP does NOT mark Builder journey complete", () => {
  const progression = progressionBase({
    xp: { current: 7000, nextTier: null, nextTierXp: 0, remaining: 0 },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "legacy_bridge_complete",
      isLegacyBuilder: true,
      bridge: { required: true, complete: true, missingEvidence: [] },
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true, xpSatisfied: true, satisfied: true },
      builder: {
        modulesSatisfied: false,
        xpSatisfied: true,
        satisfied: false,
      },
      architect: { xpSatisfied: true, satisfied: false },
    }),
  });
  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[1].status, "bridged");
  assert.notEqual(nodes[1].status, "completed");
  assert.equal(nodes[1].done, 0);
});

test("invalid progression degrades safely", () => {
  const view = getDashboardJourneyViewState({
    progression: null,
    hasHistoricalRecord: true,
    lang: "en",
  });
  assert.equal(view.mode, "unavailable");
  assert.equal(view.nextStep, null);
});

test("Dashboard pages mount Slice 1 and keep Profile Anchor proof", () => {
  assert.match(dashboardSrc, /DashboardJourneySlice/);
  assert.match(dashboardGrSrc, /DashboardJourneySlice/);
  assert.match(dashboardSrc, /DashboardProofCard/);
  assert.match(dashboardGrSrc, /DashboardProofCard/);
});

test("Explorer/Builder/Architect display order is canonical", () => {
  assert.deepEqual([...JOURNEY_TIER_ORDER], ["explorer", "builder", "architect"]);
  const segments = getJourneyTierModuleIds(defaultMilestones());
  assert.deepEqual(segments.architect, ["LM09", "LM10", "LM11"]);
});

test("countCompletedModules uses progression.modules only", () => {
  assert.deepEqual(
    countCompletedModules(["LM01", "LM02"], {
      LM01: { complete: true },
      LM02: { complete: false },
    }),
    { done: 1, total: 2 }
  );
});

test("hasAnyLearningModuleCompletion requires modules.complete", () => {
  assert.equal(hasAnyLearningModuleCompletion(progressionBase()), false);
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  assert.equal(
    hasAnyLearningModuleCompletion(progressionBase({ modules })),
    true
  );
});

test("legacy Builder progression → Legacy Builder status label (EN/GR)", () => {
  const progression = progressionBase({
    earnedTier: "builder",
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "legacy_bridge_complete",
      isLegacyBuilder: true,
      bridge: { required: true, complete: true, missingEvidence: [] },
    },
  });
  assert.equal(
    getLegacyBuilderStatusLabel(progression, "en"),
    DASHBOARD_COMPOSITION_LOCALE.en.legacyBuilderStatus
  );
  assert.equal(getLegacyBuilderStatusLabel(progression, "en"), "Legacy Builder");
  assert.equal(
    getLegacyBuilderStatusLabel(progression, "gr"),
    DASHBOARD_COMPOSITION_LOCALE.gr.legacyBuilderStatus
  );
  assert.equal(getLegacyBuilderStatusLabel(progression, "gr"), "Legacy Δημιουργός");
});

test("non-legacy learner → no legacy status label", () => {
  assert.equal(getLegacyBuilderStatusLabel(progressionBase(), "en"), null);
  assert.equal(
    getLegacyBuilderStatusLabel(
      progressionBase({
        earnedTier: "explorer",
        currentPath: {
          targetTier: "explorer",
          alignmentStatus: "current_curriculum_path",
          isLegacyBuilder: false,
          bridge: { required: false, complete: false, missingEvidence: [] },
        },
      }),
      "en"
    ),
    null
  );
});

test("high XP alone does NOT create Legacy Builder status", () => {
  const highXp = progressionBase({
    earnedTier: "explorer",
    currentPath: {
      targetTier: "explorer",
      alignmentStatus: "current_curriculum_path",
      isLegacyBuilder: false,
      bridge: { required: false, complete: false, missingEvidence: [] },
    },
    xp: { current: 9000, nextTier: null, nextTierXp: 0, remaining: 0 },
  });
  assert.equal(getLegacyBuilderStatusLabel(highXp, "en"), null);
  assert.equal(getLegacyBuilderStatusLabel(highXp, "gr"), null);
  // earnedTier builder without isLegacyBuilder flag also must not show.
  assert.equal(
    getLegacyBuilderStatusLabel(
      progressionBase({
        earnedTier: "builder",
        currentPath: {
          targetTier: "architect",
          alignmentStatus: "current_curriculum_path",
          isLegacyBuilder: false,
          bridge: { required: false, complete: false, missingEvidence: [] },
        },
        xp: { current: 9000, nextTier: null, nextTierXp: 0, remaining: 0 },
      }),
      "en"
    ),
    null
  );
});

test("legacy Builder Journey nodes unchanged (Explorer completed, Builder bridged, Architect current)", () => {
  const modules = emptyModules();
  modules.LM01 = { complete: true };
  modules.LM02 = { complete: true };
  modules.LM03 = { complete: true };
  modules.LM04 = { complete: true };
  const progression = progressionBase({
    earnedTier: "builder",
    currentPath: {
      targetTier: "architect",
      alignmentStatus: "legacy_bridge_complete",
      isLegacyBuilder: true,
      bridge: { required: true, complete: true, missingEvidence: [] },
    },
    currentModule: "LM09",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
    milestones: defaultMilestones({
      explorer: { modulesSatisfied: true },
      builder: { modulesSatisfied: false },
    }),
    modules,
  });
  const nodes = getLearningJourneyNodes(progression, "en");
  assert.equal(nodes[0].status, "completed");
  assert.equal(nodes[0].statusLabel, "Completed");
  assert.equal(nodes[1].status, "bridged");
  assert.equal(nodes[1].statusLabel, "Transitioning to new path");
  assert.equal(nodes[2].status, "current");
  assert.equal(nodes[2].done, 0);
  assert.equal(nodes[2].statusLabel, "Not started");
  assert.equal(getLegacyBuilderStatusLabel(progression, "en"), "Legacy Builder");

  const gr = getLearningJourneyNodes(progression, "gr");
  assert.equal(gr[0].statusLabel, "Ολοκληρώθηκε");
  assert.equal(gr[1].statusLabel, "Προσαρμογή στο νέο πρόγραμμα");
  assert.equal(gr[2].statusLabel, "Δεν έχει ξεκινήσει");
});

test("identity strip wiring uses getLegacyBuilderStatusLabel (EN/GR pages)", () => {
  assert.match(dashboardSrc, /getLegacyBuilderStatusLabel/);
  assert.match(dashboardGrSrc, /getLegacyBuilderStatusLabel/);
  assert.match(dashboardSrc, /legacyStatusLabel=\{getLegacyBuilderStatusLabel/);
  assert.match(dashboardGrSrc, /legacyStatusLabel=\{getLegacyBuilderStatusLabel/);
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.en.legacyBuilderStatus,
    "Legacy Builder"
  );
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.gr.legacyBuilderStatus,
    "Legacy Δημιουργός"
  );
});
