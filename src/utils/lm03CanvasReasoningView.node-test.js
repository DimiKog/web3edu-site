/**
 * LM03 Platform Comparison Canvas formative feedback contracts.
 * Run: node --test src/utils/lm03CanvasReasoningView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm03ChapterCopy } from "../content/lm03ChapterLocale.js";
import {
  lm03CanvasFeedbackTone,
  resolveLm03CanvasReasoningFeedback,
} from "./lm03CanvasReasoningView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(
  join(__dirname, "../components/learning-modules/Lm03ConceptPanel.jsx"),
  "utf8"
);
const viewSrc = readFileSync(join(__dirname, "lm03CanvasReasoningView.js"), "utf8");
const localeSrc = readFileSync(
  join(__dirname, "../content/lm03ChapterLocale.js"),
  "utf8"
);

test("no feedback until check — helper returns null without verdict", () => {
  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.equal(
      resolveLm03CanvasReasoningFeedback(copy.canvas.reasoningFeedback, ""),
      null
    );
    assert.equal(
      resolveLm03CanvasReasoningFeedback(copy.canvas.reasoningFeedback, null),
      null
    );
  }
  assert.match(panelSrc, /feedbackVisible/);
  assert.match(panelSrc, /setFeedbackVisible\(false\)/);
  assert.match(panelSrc, /data-lm03-canvas-check/);
});

test("each canvas decision maps to the required formative feedback EN/GR", () => {
  const expected = {
    en: {
      misfit:
        "Correct direction. The candidate conflicts with several critical requirements",
      fit: "Revisit the requirements. Compare the candidate",
      insufficient:
        "There is already enough information to evaluate several critical characteristics",
    },
    gr: {
      misfit: "Σωστή κατεύθυνση. Η υποψήφια πλατφόρμα συγκρούεται",
      fit: "Επανεξέτασε τις απαιτήσεις. Σύγκρινε την υποψήφια πλατφόρμα",
      insufficient: "Υπάρχουν ήδη αρκετές πληροφορίες για να αξιολογήσεις",
    },
  };

  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.equal(copy.canvas.checkReasoningLabel, lang === "gr"
      ? "Έλεγξε τη συλλογιστική μου"
      : "Check my reasoning");
    for (const id of ["misfit", "fit", "insufficient"]) {
      const text = resolveLm03CanvasReasoningFeedback(
        copy.canvas.reasoningFeedback,
        id
      );
      assert.ok(text);
      assert.match(text, new RegExp(expected[lang][id].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.equal(lm03CanvasFeedbackTone("misfit"), "aligned");
    assert.equal(lm03CanvasFeedbackTone("fit"), "reconsider");
    assert.equal(lm03CanvasFeedbackTone("insufficient"), "reconsider");
  }
});

test("changing decision clears feedback until check again", () => {
  assert.match(panelSrc, /const selectVerdict = \(id\) => \{[\s\S]*setFeedbackVisible\(false\)/);
  assert.match(panelSrc, /onClick=\{\(\) => selectVerdict\(option\.id\)\}/);
  assert.match(panelSrc, /feedbackVisible[\s\S]*resolveLm03CanvasReasoningFeedback/);
});

test("free-text Why changes do not clear or grade feedback", () => {
  const whyHandler = panelSrc.slice(
    panelSrc.indexOf("onChange={(event) => setWhy(event.target.value)}")
  );
  assert.doesNotMatch(whyHandler.slice(0, 120), /setFeedbackVisible|reasoningFeedback|resolveLm03/);
  assert.doesNotMatch(viewSrc, /why|textarea|NLP|parse/i);
  assert.doesNotMatch(localeSrc, /gradeWhy|parseWhy|scoreWhy/);
});

test("canvas formative feedback has no API, persistence, XP, or evidence side effects", () => {
  assert.doesNotMatch(panelSrc, /fetch\(|localStorage|sessionStorage|awardXp|evidenceId|xpAwarded/i);
  assert.doesNotMatch(viewSrc, /fetch\(|localStorage|sessionStorage|evidenceId|xp_total|awardXp/i);
  assert.doesNotMatch(panelSrc, /Correct!|Wrong!|success badge/i);
  assert.match(panelSrc, /data-lm03-canvas-feedback-tone/);
  assert.match(panelSrc, /border-cyan-400/);
  assert.match(panelSrc, /border-amber-400/);
});
