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
import {
  isLm01CriticalQuestion,
  LM01_CRITICAL_QUESTION_IDS,
  LM01_PRESENTATION_PASS_MIN,
} from "../../utils/lm01AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

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
const NON_CRITICAL_IDS = Object.keys(LM01_ASSESSMENT_COPY.en.questions).filter(
  (id) => !LM01_CRITICAL_QUESTION_IDS.includes(id)
);

test("EN/GR assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm01-assessment"], "/learning-modules/lm01/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm01-assessment"],
    "/learning-modules-gr/lm01/assessment"
  );
});

test("shared meta strip and type chips are wired", () => {
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentQuestionHeader/);
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.match(panelSrc, /multiSelectType/);
  assert.match(panelSrc, /singleChoiceType/);
  assert.deepEqual(LM01_ASSESSMENT_COPY.en.metaItems.slice(0, 2), [
    "7 questions",
    "Single + multiple select",
  ]);
  assert.match(LM01_ASSESSMENT_COPY.en.metaItems[2], /Pass: 5\/7/);
  assert.match(LM01_ASSESSMENT_COPY.gr.metaItems[2], /Επιτυχία: 5\/7/);
  assert.equal(LM01_ASSESSMENT_COPY.en.singleChoiceType, "Single choice");
  assert.equal(LM01_ASSESSMENT_COPY.gr.multiSelectType, "Επίλεξε όλες τις σωστές");
});

test("Critical chip only on curriculum-critical LM01 questions", () => {
  assert.deepEqual([...LM01_CRITICAL_QUESTION_IDS], [
    "lm01_q6_foodtrace_consider",
    "lm01_q7_university_inventory",
  ]);
  assert.equal(isLm01CriticalQuestion("lm01_q6_foodtrace_consider"), true);
  assert.equal(isLm01CriticalQuestion("lm01_q7_university_inventory"), true);
  for (const id of NON_CRITICAL_IDS) {
    assert.equal(isLm01CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm01CriticalQuestion\(question\.id\)/);
  assert.match(panelSrc, /criticalLabel/);
  assert.equal(LM01_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM01_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
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

test("failed state uses shared fail chrome and immediate retry", () => {
  assert.match(panelSrc, /AssessmentFailState/);
  assert.match(panelSrc, /resolveAssessmentFailLead/);
  assert.match(panelSrc, /handleTryAgain/);
  const fnStart = panelSrc.indexOf("const handleTryAgain");
  const fnEnd = panelSrc.indexOf("const handleSubmit", fnStart);
  const fn = panelSrc.slice(fnStart, fnEnd);
  assert.match(fn, /setSubmitResult\(null\)/);
  assert.match(fn, /buildShuffledOptionOrders/);
  assert.doesNotMatch(fn, /allAnswered/);
  assert.doesNotMatch(fn, /postLm01AssessmentAnswers/);
  assert.doesNotMatch(fn, /fetchLm01AssessmentChallenge/);
  assert.doesNotMatch(fn, /emptyAnswers|setAnswers\(/);
  assert.match(panelSrc, /onRetry=\{handleTryAgain\}/);
  assert.match(panelSrc, /isFailed/);
  assert.match(panelSrc, /showForm = .*!isFailed/);
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM01_PRESENTATION_PASS_MIN, 5);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: ["lm01_q6_foodtrace_consider"] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM01_PRESENTATION_PASS_MIN,
    }),
    "critical-threshold"
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 4, criticalFailures: ["lm01_q6_foodtrace_consider"] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM01_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
});

test("pass state uses shared chrome with capabilities and collapsed takeaways", () => {
  assert.match(panelSrc, /AssessmentPassState/);
  assert.match(panelSrc, /passCapabilities/);
  assert.match(panelSrc, /keyPrinciple/);
  assert.match(panelSrc, /reviewTakeaways/);
  assert.match(panelSrc, /passRevisitRows/);
  assert.equal(LM01_ASSESSMENT_COPY.en.passCapabilities.length, 3);
  assert.equal(LM01_ASSESSMENT_COPY.gr.passCapabilities.length, 3);
  assert.match(LM01_ASSESSMENT_COPY.en.keyPrinciple, /conventional database/i);
  assert.equal(LM01_ASSESSMENT_COPY.en.revisitOne, "One point to revisit");
  assert.equal(LM01_ASSESSMENT_COPY.gr.revisitMany, "Σημεία για επανάληψη");
  assert.equal(LM01_ASSESSMENT_COPY.en.failedScore(6, 7), "6/7");
  assert.equal(LM01_ASSESSMENT_COPY.en.passedScore(7, 7), "7/7");
  assert.equal(LM01_ASSESSMENT_COPY.en.xpAwarded(100), "+100 XP");
});

test("imperfect PASS revisit only when evaluation.feedback is present", () => {
  assert.match(panelSrc, /passRevisitRows/);
  assert.match(panelSrc, /score < total/);
  assert.match(panelSrc, /evaluation\?\.feedback/);
  assert.match(panelSrc, /buildAssessmentFeedbackRows\(feedback/);
  assert.doesNotMatch(panelSrc, /fabricat|inventFeedback|clientSideFeedback/i);
});

test("EN/GR content still renders", () => {
  assert.ok(LM01_ASSESSMENT_COPY.en.questions.lm01_q1_distribute_ledger);
  assert.ok(LM01_ASSESSMENT_COPY.gr.questions.lm01_q1_distribute_ledger);
  assert.match(LM01_ASSESSMENT_COPY.en.classificationNote, /Public \/ Private \/ Consortium/);
  assert.match(LM01_ASSESSMENT_COPY.gr.classificationNote, /Permissioned \/ Permissionless/);
});

test("module notes preserved under meta strip", () => {
  assert.match(panelSrc, /classificationNote/);
  assert.match(panelSrc, /foodtraceNote/);
  assert.doesNotMatch(panelSrc, /BookOpen/);
  assert.match(panelSrc, /AssessmentMetaStrip/);
});

test("page uses shared LearningModuleActivityShell in compact density", () => {
  assert.match(pageSrc, /LearningModuleActivityShell/);
  assert.match(pageSrc, /Lm01AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM01"/);
  assert.match(pageSrc, /density="compact"/);
});

test("locale has seven questions EN/GR without answer-key authority", () => {
  const enIds = Object.keys(LM01_ASSESSMENT_COPY.en.questions);
  const grIds = Object.keys(LM01_ASSESSMENT_COPY.gr.questions);
  assert.equal(enIds.length, 7);
  assert.deepEqual(enIds, grIds);
  assert.doesNotMatch(localeSrc, /correct:\s*["']?[ABCD]/);
  assert.doesNotMatch(localeSrc, /passMin|answerKey|correctAnswers|\[CRITICAL\]|\[CORRECT\]/);
  assert.match(localeSrc, /Public \/ Private \/ Consortium/);
  assert.match(localeSrc, /Permissioned \/ Permissionless/);
});

test("panel uses canonical IDs with visual letters from shuffle helper", () => {
  assert.match(panelSrc, /mapOptionsForDisplay/);
  assert.match(panelSrc, /buildShuffledOptionOrders/);
  assert.match(panelSrc, /AssessmentChoiceList/);
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
});

test("failed remediation shows Q-number title and hint separation", () => {
  assert.match(panelSrc, /buildAssessmentFeedbackRows/);
  assert.match(panelSrc, /feedbackRows/);
  assert.equal(LM01_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM01_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
});

test("silent token renewal does not reset attempt; Try again still reshuffles", () => {
  assert.match(panelSrc, /idTokenRef/);
  assert.match(panelSrc, /attemptSeededRef/);
  assert.match(panelSrc, /seedIncompleteAttemptIfNeeded/);
  const loadStart = panelSrc.indexOf("const loadChallenge = useCallback");
  const loadEnd = panelSrc.indexOf("}, [apiBase, copy.loading, copy.signInRequired]");
  assert.ok(loadStart >= 0 && loadEnd > loadStart);
  const loadFn = panelSrc.slice(loadStart, loadEnd);
  assert.doesNotMatch(loadFn, /identityArgs\.idToken/);
  assert.match(loadFn, /idTokenRef\.current/);
  assert.match(loadFn, /seedIncompleteAttemptIfNeeded/);
  assert.match(loadFn, /alreadyLoaded/);
  assert.match(panelSrc, /handleTryAgain[\s\S]*buildShuffledOptionOrders/);
});

test("EN/GR chrome key parity", () => {
  const enKeys = Object.keys(LM01_ASSESSMENT_COPY.en).filter((k) => k !== "questions").sort();
  const grKeys = Object.keys(LM01_ASSESSMENT_COPY.gr).filter((k) => k !== "questions").sort();
  assert.deepEqual(enKeys, grKeys);
});
