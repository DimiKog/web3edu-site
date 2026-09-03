/**
 * LM01 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm01AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { LM01_ASSESSMENT_COPY } from "../../content/lm01AssessmentLocale.js";
import { ASSESSMENT_ROUTES } from "../../utils/progressionActionMapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm01AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm01AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm01AssessmentLocale.js"),
  "utf8"
);

test("EN/GR assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm01-assessment"], "/learning-modules/lm01/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm01-assessment"],
    "/learning-modules-gr/lm01/assessment"
  );
});

test("multiple-select instruction is present in EN and GR", () => {
  assert.match(LM01_ASSESSMENT_COPY.en.multiSelectHint, /More than one answer may be correct/i);
  assert.match(LM01_ASSESSMENT_COPY.gr.multiSelectHint, /περισσότερες από μία/i);
  assert.match(panelSrc, /multiSelectHint/);
  assert.match(panelSrc, /multiple_select/);
});

test("panel submits answers only and refreshes progression on pass", () => {
  assert.match(panelSrc, /postLm01AssessmentAnswers/);
  assert.match(panelSrc, /answers,/);
  assert.match(panelSrc, /postLm01AssessmentAnswers\(\{[\s\S]*answers/);
  assert.doesNotMatch(panelSrc, /postLm01AssessmentAnswers\(\{[\s\S]*score:/);
  assert.doesNotMatch(panelSrc, /postLm01AssessmentAnswers\(\{[\s\S]*passed:/);
  assert.doesNotMatch(panelSrc, /postLm01AssessmentAnswers\(\{[\s\S]*wallet:/);
  assert.match(panelSrc, /web3edu-progress-updated/);
  assert.match(panelSrc, /refetchResolvedIdentity/);
});

test("failed state Try Again does not require form completeness", () => {
  assert.match(panelSrc, /handleTryAgain/);
  const fnStart = panelSrc.indexOf("const handleTryAgain");
  const fnEnd = panelSrc.indexOf("const handleSubmit", fnStart);
  const fn = panelSrc.slice(fnStart, fnEnd);
  assert.match(fn, /setSubmitResult\(null\)/);
  assert.match(fn, /buildShuffledOptionOrders/);
  assert.doesNotMatch(fn, /allAnswered/);
  assert.doesNotMatch(fn, /postLm01AssessmentAnswers/);
  assert.doesNotMatch(fn, /fetchLm01AssessmentChallenge/);
  // Answers are intentionally not cleared so prior selections remain.
  assert.doesNotMatch(fn, /emptyAnswers|setAnswers\(/);
});

test("failed state allows immediate retry", () => {
  assert.match(panelSrc, /onClick=\{handleTryAgain\}/);
  assert.match(panelSrc, /isFailed/);
  assert.match(panelSrc, /showForm = .*!isFailed/);
});

test("success state renders score and XP clearly", () => {
  assert.match(panelSrc, /copy\.passedTitle/);
  assert.match(panelSrc, /copy\.passedScore/);
  assert.match(panelSrc, /copy\.xpAwarded/);
  assert.match(panelSrc, /text-2xl/);
  assert.match(panelSrc, /Back to Dashboard|copy\.backToDashboard/);
  assert.match(LM01_ASSESSMENT_COPY.en.passedTitle, /LM01 Assessment Complete/i);
  assert.equal(LM01_ASSESSMENT_COPY.en.failedTitle, "Assessment not passed yet");
  assert.equal(LM01_ASSESSMENT_COPY.en.failedScore(6, 7), "6 / 7");
  assert.equal(LM01_ASSESSMENT_COPY.en.xpAwarded(100), "+100 XP");
});

test("EN/GR content still renders", () => {
  assert.ok(LM01_ASSESSMENT_COPY.en.questions.lm01_q1_distribute_ledger);
  assert.ok(LM01_ASSESSMENT_COPY.gr.questions.lm01_q1_distribute_ledger);
  assert.match(LM01_ASSESSMENT_COPY.en.classificationNote, /Public \/ Private \/ Consortium/);
  assert.match(LM01_ASSESSMENT_COPY.gr.classificationNote, /Permissioned \/ Permissionless/);
});

test("orientation block is distinct and localized", () => {
  assert.equal(LM01_ASSESSMENT_COPY.en.readFirst, "Read this first");
  assert.equal(LM01_ASSESSMENT_COPY.gr.readFirst, "Διάβασέ το πρώτα");
  assert.match(panelSrc, /BookOpen/);
  assert.match(panelSrc, /copy\.readFirst/);
  assert.match(panelSrc, /from-cyan-50/);
  assert.match(panelSrc, /border-t/);
});

test("page uses shared LearningModuleActivityShell", () => {
  assert.match(pageSrc, /LearningModuleActivityShell/);
  assert.match(pageSrc, /Lm01AssessmentPanel/);
  assert.match(pageSrc, /moduleId=\"LM01\"/);
});

test("locale has seven questions EN/GR without answer-key authority", () => {
  const enIds = Object.keys(LM01_ASSESSMENT_COPY.en.questions);
  const grIds = Object.keys(LM01_ASSESSMENT_COPY.gr.questions);
  assert.equal(enIds.length, 7);
  assert.deepEqual(enIds, grIds);
  assert.doesNotMatch(localeSrc, /correct:\s*["']?[ABCD]/);
  assert.doesNotMatch(localeSrc, /passMin|answerKey|correctAnswers/);
  assert.match(localeSrc, /Public \/ Private \/ Consortium/);
  assert.match(localeSrc, /Permissioned \/ Permissionless/);
});

test("panel uses canonical IDs with visual letters from shuffle helper", () => {
  assert.match(panelSrc, /mapOptionsForDisplay/);
  assert.match(panelSrc, /buildShuffledOptionOrders/);
  assert.match(panelSrc, /row\.canonicalId/);
  assert.match(panelSrc, /row\.visualLetter/);
  assert.match(panelSrc, /value=\{row\.canonicalId\}/);
});

test("FoodTrace Design Case marker is shown before Q6 only", () => {
  assert.match(panelSrc, /isFoodtraceDesignCaseIntroQuestion/);
  assert.match(panelSrc, /foodtraceDesignCaseMarker/);
  assert.equal(
    LM01_ASSESSMENT_COPY.en.foodtraceDesignCaseMarker,
    "FoodTrace · Design Case"
  );
  assert.equal(
    LM01_ASSESSMENT_COPY.gr.foodtraceDesignCaseMarker,
    "FoodTrace · Μελέτη Περίπτωσης"
  );
  assert.doesNotMatch(panelSrc, /critical question|required question|pass rule/i);
  assert.doesNotMatch(localeSrc, /critical question|required question/i);
});
