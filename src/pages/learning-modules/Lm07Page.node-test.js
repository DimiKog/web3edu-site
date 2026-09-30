/**
 * LM07 Interactive Chapter contracts (minimal).
 * Run: node --test src/pages/learning-modules/Lm07Page.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm07ChapterCopy, LM07_EXECUTION_TRACE_HREF } from "../../content/lm07ChapterLocale.js";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import {
  getLmChapterRoute,
  isLmChapterAvailable,
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM_PRESENTATION_REGISTRY,
} from "../../content/lmRegistry.js";
import { ASSESSMENT_ROUTES, EVIDENCE_ROUTES } from "../../utils/progressionActionMapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageSrc = readFileSync(join(__dirname, "Lm07Page.jsx"), "utf8");
const panelSrc = readFileSync(
  join(__dirname, "../../components/learning-modules/Lm07ConceptPanel.jsx"),
  "utf8"
);
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);

test("routeTable registers LM07 EN/GR chapter, assessment, and execution-trace", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm07"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm07"/);
  assert.match(routesSrc, /Lm07Page/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm07\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm07\/assessment"/);
  assert.match(routesSrc, /Lm07AssessmentPage/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm07\/execution-trace"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm07\/execution-trace"/);
  assert.match(routesSrc, /Lm07ExecutionTracePage/);
  assert.equal(isLmChapterAvailable("LM07"), true);
  assert.equal(getLmChapterRoute("LM07", "en"), "/learning-modules/lm07");
  assert.equal(getLmChapterRoute("LM07", "gr"), "/learning-modules-gr/lm07");
});

test("Lm07Page uses Learning Path disclosures and LM07 view state", () => {
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmProgressSidebar/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /Lm07ConceptPanel/);
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /getLmPageViewState\(progression, locale, "LM07"\)/);
  assert.match(pageSrc, /lm07-interactive-chapter/);
});

test("LM07 chapter has bilingual copy and required reading callout", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM07;
  assert.equal(mod.chapterAvailable, true);
  assert.equal(mod.learningOutcomes.en.length, 6);
  assert.equal(mod.learningOutcomes.gr.length, 6);
  const en = getLm07ChapterCopy("en");
  const gr = getLm07ChapterCopy("gr");
  assert.deepEqual(Object.keys(en).sort(), Object.keys(gr).sort());
  assert.match(en.openingQuestion, /smart contract/i);
  assert.match(panelSrc, /data-lm07-required-reading/);
  assert.match(panelSrc, /LM07_VISUALS\.codeState/);
  assert.match(panelSrc, /LM07_VISUALS\.executionFlow/);
  assert.match(panelSrc, /LM07_VISUALS\.readWrite/);
  assert.match(panelSrc, /LM01_KALLIPOS_TEXTBOOK_URL/);
  assert.ok(LM01_KALLIPOS_TEXTBOOK_URL);
  assert.equal(
    LM07_EXECUTION_TRACE_HREF.en,
    "/learning-modules/lm07/execution-trace"
  );
  assert.equal(
    LM07_EXECUTION_TRACE_HREF.gr,
    "/learning-modules-gr/lm07/execution-trace"
  );
  assert.equal(
    EVIDENCE_ROUTES.en["lm07-execution-trace"],
    "/learning-modules/lm07/execution-trace"
  );
  assert.equal(
    ASSESSMENT_ROUTES.en["lm07-assessment"],
    "/learning-modules/lm07/assessment"
  );
});

test("LM07 page chrome locale parity", () => {
  const en = getLmPageCopy("en", "LM07");
  const gr = getLmPageCopy("gr", "LM07");
  assert.ok(en.learningPathIntro);
  assert.ok(gr.learningPathIntro);
  assert.match(en.assessmentTitle, /LM07/);
  assert.match(gr.assessmentTitle, /LM07/);
  assert.match(en.finishAssessmentCta, /Finish the assessment/i);
  assert.match(gr.finishAssessmentCta, /Ολοκλήρωσε την αξιολόγηση/);
});
