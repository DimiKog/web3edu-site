/**
 * Progression action mapper tests (Slice 9C2).
 * Run: node --test src/utils/progressionActionMapper.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import { resolveProgressionActionTarget } from "./progressionActionMapper.js";

test("lab01 EN routes to wallets-keys", () => {
    const result = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "lab01" },
        lang: "en",
    });
    assert.equal(result.status, "ready");
    assert.equal(result.route, "/labs/wallets-keys");
    assert.match(result.label, /Lab 01/i);
});

test("lab01 GR routes to labs-gr wallets-keys", () => {
    const result = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "lab01" },
        lang: "gr",
    });
    assert.equal(result.status, "ready");
    assert.equal(result.route, "/labs-gr/wallets-keys");
});

test("lab04 routes correctly", () => {
    const en = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "lab04" },
        lang: "en",
    });
    assert.equal(en.route, "/labs/lab04");
    const gr = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "lab04" },
        lang: "gr",
    });
    assert.equal(gr.route, "/labs-gr/lab04");
});

test("coding01 EN/GR interaction routes", () => {
    const en = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "coding01" },
        lang: "en",
    });
    assert.equal(en.status, "ready");
    assert.equal(en.route, "/labs/coding-01/interaction");

    const gr = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "coding02" },
        lang: "gr",
    });
    assert.equal(gr.status, "ready");
    assert.equal(gr.route, "/labs-gr/coding-02/interaction");
});

test("coding02 EN", () => {
    const result = resolveProgressionActionTarget({
        nextAction: { type: "learning_module_evidence", evidenceId: "coding02" },
        lang: "en",
    });
    assert.equal(result.route, "/labs/coding-02/interaction");
});

test("LM08 contract inspection EN/GR", () => {
    const en = resolveProgressionActionTarget({
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm08-contract-inspection",
        },
        lang: "en",
    });
    assert.equal(en.status, "ready");
    assert.equal(en.route, "/learning-modules/lm08/contract-inspection");

    const gr = resolveProgressionActionTarget({
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm08-contract-inspection",
        },
        lang: "gr",
    });
    assert.equal(gr.route, "/learning-modules-gr/lm08/contract-inspection");
});

test("LM08 source verification EN/GR ready routes", () => {
    const en = resolveProgressionActionTarget({
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm08-source-verification",
        },
        lang: "en",
    });
    assert.equal(en.status, "ready");
    assert.equal(en.route, "/learning-modules/lm08/source-verification");

    const gr = resolveProgressionActionTarget({
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm08-source-verification",
        },
        lang: "gr",
    });
    assert.equal(gr.status, "ready");
    assert.equal(gr.route, "/learning-modules-gr/lm08/source-verification");
    assert.match(gr.label, /Πηγαίου/i);
});

test("LM01 assessment EN/GR ready routes", () => {
    const en = resolveProgressionActionTarget({
        nextAction: {
            type: "assessment",
            moduleId: "LM01",
            assessmentId: "lm01-assessment",
        },
        lang: "en",
    });
    assert.equal(en.status, "ready");
    assert.equal(en.route, "/learning-modules/lm01/assessment");
    assert.match(en.cta, /Continue/i);

    const gr = resolveProgressionActionTarget({
        nextAction: {
            type: "assessment",
            moduleId: "LM01",
            assessmentId: "lm01-assessment",
        },
        lang: "gr",
    });
    assert.equal(gr.status, "ready");
    assert.equal(gr.route, "/learning-modules-gr/lm01/assessment");
    assert.match(gr.cta, /Συνέχεια/i);
});

test("other assessments remain coming soon", () => {
    const en = resolveProgressionActionTarget({
        nextAction: {
            type: "assessment",
            moduleId: "LM04",
            assessmentId: "lm04-assessment",
        },
        lang: "en",
    });
    assert.equal(en.status, "coming_soon");
    assert.equal(en.route, null);
    assert.match(en.cta, /Assessment coming soon/i);
});

test("future evidence unavailable", () => {
    const result = resolveProgressionActionTarget({
        nextAction: {
            type: "learning_module_evidence",
            evidenceId: "lm09-guided-coding",
        },
        lang: "en",
    });
    assert.equal(result.status, "unavailable");
    assert.equal(result.route, null);
});

test("enrichment_xp EN/GR browse labs", () => {
    const en = resolveProgressionActionTarget({
        nextAction: { type: "enrichment_xp" },
        lang: "en",
    });
    assert.equal(en.status, "browse");
    assert.equal(en.route, "/labs");
    assert.match(en.cta, /Explore enrichment/i);

    const gr = resolveProgressionActionTarget({
        nextAction: { type: "enrichment_xp" },
        lang: "gr",
    });
    assert.equal(gr.route, "/labs-gr");
    assert.match(gr.cta, /Εξερεύνησε/i);
});

test("null action → complete", () => {
    const result = resolveProgressionActionTarget({ nextAction: null, lang: "en" });
    assert.equal(result.status, "complete");
    assert.equal(result.route, null);
});

test("unknown action safely unavailable", () => {
    const result = resolveProgressionActionTarget({
        nextAction: { type: "unknown_future_type", id: "x" },
        lang: "en",
    });
    assert.equal(result.status, "unavailable");
    assert.equal(result.route, null);
});
