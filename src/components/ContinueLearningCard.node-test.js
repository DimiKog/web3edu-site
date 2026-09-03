/**
 * ContinueLearningCard view-state tests (Slice 9C2).
 * Run: node --test src/components/ContinueLearningCard.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
    getContinueLearningViewState,
    isValidCanonicalProgression,
} from "../utils/continueLearningView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentSrc = readFileSync(join(__dirname, "ContinueLearningCard.jsx"), "utf8");
const viewSrc = readFileSync(join(__dirname, "../utils/continueLearningView.js"), "utf8");

test("no getRoleFromXpTotal in ContinueLearningCard or view helper", () => {
    assert.doesNotMatch(componentSrc, /getRoleFromXpTotal/);
    assert.doesNotMatch(viewSrc, /getRoleFromXpTotal/);
});

test("no getProgressFromXpTotal in ContinueLearningCard or view helper", () => {
    assert.doesNotMatch(componentSrc, /getProgressFromXpTotal/);
    assert.doesNotMatch(viewSrc, /getProgressFromXpTotal/);
});

test("no progression.js import in ContinueLearningCard or view helper", () => {
    assert.doesNotMatch(componentSrc, /from ["'].*progression\.js["']/);
    assert.doesNotMatch(viewSrc, /from ["'].*progression\.js["']/);
});

test("fresh learner assessment state routes to LM01 assessment", () => {
    const progression = {
        earnedTier: "explorer",
        computedTier: null,
        currentPath: { targetTier: "explorer", alignmentStatus: "current_curriculum_path" },
        currentModule: "LM01",
        nextAction: {
            type: "assessment",
            moduleId: "LM01",
            assessmentId: "lm01-assessment",
        },
        xp: { current: 0, nextTier: "explorer", nextTierXp: 400, remaining: 400 },
    };
    const view = getContinueLearningViewState(progression, "en");
    assert.equal(view.mode, "active");
    assert.equal(view.moduleId, "LM01");
    assert.equal(view.action.status, "ready");
    assert.equal(view.action.route, "/learning-modules/lm01/assessment");
    assert.match(view.action.cta, /Continue/i);
});

test("legacy Builder bridge required → inspection CTA ready", () => {
    const progression = {
        earnedTier: "builder",
        computedTier: null,
        currentPath: {
            targetTier: "architect",
            alignmentStatus: "legacy_bridge_required",
            isLegacyBuilder: true,
        },
        currentModule: "LM08",
        nextAction: {
            type: "learning_module_evidence",
            moduleId: "LM08",
            evidenceId: "lm08-contract-inspection",
        },
        xp: { current: 2500, nextTier: "architect", nextTierXp: 7000, remaining: 4500 },
    };
    const view = getContinueLearningViewState(progression, "en");
    assert.equal(view.earnedTierLabel, "Builder");
    assert.match(view.pathLabel, /Architect/);
    assert.equal(view.action.status, "ready");
    assert.equal(view.action.route, "/learning-modules/lm08/contract-inspection");
});

test("legacy Builder bridge complete → LM09 unavailable evidence", () => {
    const progression = {
        earnedTier: "builder",
        computedTier: null,
        currentPath: {
            targetTier: "architect",
            alignmentStatus: "legacy_bridge_complete",
            isLegacyBuilder: true,
        },
        currentModule: "LM09",
        nextAction: {
            type: "learning_module_evidence",
            moduleId: "LM09",
            evidenceId: "lm09-guided-coding",
        },
        xp: { current: 2500, nextTier: "architect", nextTierXp: 7000, remaining: 4500 },
    };
    const view = getContinueLearningViewState(progression, "en");
    assert.equal(view.moduleId, "LM09");
    assert.equal(view.action.status, "unavailable");
    assert.equal(view.action.route, null);
});

test("Architect complete → no CTA", () => {
    const progression = {
        earnedTier: "architect",
        computedTier: "architect",
        currentPath: { targetTier: null, alignmentStatus: "architect_complete" },
        currentModule: null,
        nextAction: null,
        xp: { current: 7200, nextTier: null, nextTierXp: null, remaining: 0 },
    };
    const view = getContinueLearningViewState(progression, "en");
    assert.equal(view.mode, "complete");
    assert.equal(view.earnedTierLabel, "Architect");
});

test("isValidCanonicalProgression rejects invalid payloads", () => {
    assert.equal(isValidCanonicalProgression(null), false);
    assert.equal(isValidCanonicalProgression({}), false);
    assert.equal(isValidCanonicalProgression({ earnedTier: "explorer" }), true);
});

test("GR tier labels from backend lowercase", () => {
    const progression = {
        earnedTier: "builder",
        currentPath: { targetTier: "architect", alignmentStatus: "legacy_bridge_required" },
        currentModule: "LM08",
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm08-contract-inspection",
        },
        xp: { current: 2500, nextTierXp: 7000 },
    };
    const view = getContinueLearningViewState(progression, "gr");
    assert.equal(view.earnedTierLabel, "Δημιουργός");
    assert.match(view.pathLabel, /Αρχιτέκτονας/);
});
