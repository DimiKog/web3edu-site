/**
 * LM02 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm02AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM02_ASSESSMENT_COPY,
  LM02_POST_PASS_RATIONALES,
} from "../../content/lm02AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import { ASSESSMENT_ROUTES, resolveProgressionActionTarget } from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  isLm02CriticalQuestion,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM02_CRITICAL_QUESTION_IDS,
  LM02_PRESENTATION_PASS_MIN,
} from "../../utils/lm02AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm02AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm02AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm02AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM02_ASSESSMENT_COPY.en.questions);
const NON_CRITICAL_IDS = QUESTION_IDS.filter(
  (id) => !LM02_CRITICAL_QUESTION_IDS.includes(id)
);

test("EN/GR LM02 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm02-assessment"], "/learning-modules/lm02/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm02-assessment"],
    "/learning-modules-gr/lm02/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm02\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm02\/assessment"/);
  assert.match(routesSrc, /Lm02AssessmentPage/);
});

test("Continue Learning maps lm02-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM02",
      assessmentId: "lm02-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm02/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM02",
      assessmentId: "lm02-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm02/assessment");
});

test("shared meta strip and type chips are wired", () => {
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentQuestionHeader/);
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.match(panelSrc, /multiSelectType/);
  assert.match(panelSrc, /singleChoiceType/);
  assert.match(LM02_ASSESSMENT_COPY.en.multiSelectType, /Select all that apply/i);
  assert.equal(
    LM02_ASSESSMENT_COPY.gr.multiSelectType,
    "Επίλεξε όλες τις σωστές"
  );
  assert.match(panelSrc, /multiple_select/);
  assert.ok(LM02_ASSESSMENT_COPY.en.questions.lm02_q1_when_consider_blockchain.options.E);
  assert.ok(LM02_ASSESSMENT_COPY.en.questions.lm02_q6_foodtrace_what_to_know.options.E);
});

test("Critical chip only on curriculum-critical LM02 questions", () => {
  assert.deepEqual([...LM02_CRITICAL_QUESTION_IDS], [
    "lm02_q2_trusted_authority",
    "lm02_q7_foodtrace_decide",
  ]);
  assert.equal(isLm02CriticalQuestion("lm02_q2_trusted_authority"), true);
  assert.equal(isLm02CriticalQuestion("lm02_q7_foodtrace_decide"), true);
  for (const id of NON_CRITICAL_IDS) {
    assert.equal(isLm02CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm02CriticalQuestion\(question\.id\)/);
  assert.equal(LM02_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM02_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("post-pass rationales cover Q1-Q7 in EN and GR", () => {
  assert.deepEqual(Object.keys(LM02_POST_PASS_RATIONALES.en).sort(), [...QUESTION_IDS].sort());
  assert.deepEqual(Object.keys(LM02_POST_PASS_RATIONALES.gr).sort(), [...QUESTION_IDS].sort());
  for (const id of QUESTION_IDS) {
    assert.ok(LM02_POST_PASS_RATIONALES.en[id].length > 40);
    assert.ok(LM02_POST_PASS_RATIONALES.gr[id].length > 40);
  }
  assert.match(panelSrc, /LM02_POST_PASS_RATIONALES/);
  assert.match(panelSrc, /postPassRationales/);
});

test("panel submits answers only and refreshes progression on pass", () => {
  assert.match(panelSrc, /postLm02AssessmentAnswers/);
  assert.match(panelSrc, /postLm02AssessmentAnswers\(\{[\s\S]*answers/);
  assert.doesNotMatch(panelSrc, /postLm02AssessmentAnswers\(\{[\s\S]*score:/);
  assert.doesNotMatch(panelSrc, /postLm02AssessmentAnswers\(\{[\s\S]*passed:/);
  assert.doesNotMatch(panelSrc, /postLm02AssessmentAnswers\(\{[\s\S]*wallet:/);
  assert.match(panelSrc, /web3edu-progress-updated/);
  assert.match(panelSrc, /refetchResolvedIdentity/);
});

test("API helpers never send score/passed authority fields", () => {
  assert.match(apiSrc, /export async function fetchLm02AssessmentChallenge/);
  assert.match(apiSrc, /export async function postLm02AssessmentAnswers/);
  const fn = apiSrc.slice(apiSrc.indexOf("export async function postLm02AssessmentAnswers"));
  assert.match(fn, /JSON\.stringify\(body\)/);
  assert.doesNotMatch(fn.slice(0, 800), /score:|passed:|xpAwarded:/);
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
  assert.doesNotMatch(fn, /postLm02AssessmentAnswers/);
  assert.doesNotMatch(fn, /emptyAnswers|setAnswers\(/);
  assert.match(panelSrc, /onRetry=\{handleTryAgain\}/);
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM02_PRESENTATION_PASS_MIN, 5);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: ["lm02_q2_trusted_authority"] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM02_PRESENTATION_PASS_MIN,
    }),
    "critical-threshold"
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: [] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM02_PRESENTATION_PASS_MIN,
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
  assert.equal(LM02_ASSESSMENT_COPY.en.passCapabilities.length, 3);
  assert.equal(LM02_ASSESSMENT_COPY.gr.passCapabilities.length, 3);
  assert.match(LM02_ASSESSMENT_COPY.en.keyPrinciple, /trust and coordination/i);
  assert.equal(LM02_ASSESSMENT_COPY.en.xpAwarded(150), "+150 XP");
  assert.equal(LM02_ASSESSMENT_COPY.en.passedScore(7, 7), "7/7");
});

test("imperfect PASS revisit only when evaluation.feedback is present", () => {
  assert.match(panelSrc, /passRevisitRows/);
  assert.match(panelSrc, /score < total/);
  assert.match(panelSrc, /evaluation\?\.feedback/);
  assert.match(panelSrc, /buildAssessmentFeedbackRows\(feedback/);
});

test("page uses shared LearningModuleActivityShell in compact density", () => {
  assert.match(pageSrc, /LearningModuleActivityShell/);
  assert.match(pageSrc, /Lm02AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM02"/);
  assert.match(pageSrc, /density="compact"/);
});

test("locale has seven questions EN/GR without answer-key authority", () => {
  const enIds = Object.keys(LM02_ASSESSMENT_COPY.en.questions);
  const grIds = Object.keys(LM02_ASSESSMENT_COPY.gr.questions);
  assert.equal(enIds.length, 7);
  assert.deepEqual(enIds, grIds);
  assert.doesNotMatch(localeSrc, /correct:\s*["']?[ABCDE]/);
  assert.doesNotMatch(localeSrc, /passMin|answerKey|correctAnswers|\[CRITICAL\]|\[CORRECT\]/);
  assert.match(localeSrc, /lm02_q1_when_consider_blockchain/);
  assert.match(localeSrc, /lm02_q7_foodtrace_decide/);
});

test("panel has no frontend correct-answer logic", () => {
  assert.doesNotMatch(panelSrc, /correctAnswers|OPTION_B|score\s*>=/);
  assert.doesNotMatch(panelSrc, /\[CRITICAL\]/);
});

test("failed remediation shows Q-number title and hint separation", () => {
  assert.match(panelSrc, /buildAssessmentFeedbackRows/);
  assert.match(panelSrc, /feedbackRows/);
  assert.equal(LM02_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM02_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
});

test("silent token renewal does not reset attempt; Try again still reshuffles", () => {
  assert.match(panelSrc, /idTokenRef/);
  assert.match(panelSrc, /attemptSeededRef/);
  assert.match(panelSrc, /seedIncompleteAttemptIfNeeded/);
  const loadStart = panelSrc.indexOf("const loadChallenge = useCallback");
  const loadEnd = panelSrc.indexOf("}, [apiBase, copy.loading, copy.signInRequired, locale]");
  assert.ok(loadStart >= 0 && loadEnd > loadStart);
  const loadFn = panelSrc.slice(loadStart, loadEnd);
  assert.doesNotMatch(loadFn, /identityArgs\.idToken/);
  assert.match(loadFn, /idTokenRef\.current/);
  assert.match(loadFn, /alreadyLoaded/);
  const tryStart = panelSrc.indexOf("const handleTryAgain");
  const tryEnd = panelSrc.indexOf("const handleSubmit", tryStart);
  const tryFn = panelSrc.slice(tryStart, tryEnd);
  assert.match(tryFn, /buildShuffledOptionOrders/);
  assert.doesNotMatch(tryFn, /emptyAnswers|setAnswers\(/);
});

test("FoodTrace Part B chrome is present", () => {
  assert.equal(LM02_ASSESSMENT_COPY.en.partBTitle, "Part B — FoodTrace");
  assert.equal(LM02_ASSESSMENT_COPY.gr.partBTitle, "Μέρος B — FoodTrace");
  assert.match(LM02_ASSESSMENT_COPY.en.scenarioP1, /FoodTrace/);
  assert.match(LM02_ASSESSMENT_COPY.gr.scenarioP1, /FoodTrace/);
  assert.match(panelSrc, /partBTitle/);
  assert.match(panelSrc, /scenarioP1/);
  assert.match(panelSrc, /lm02_q5_foodtrace_first_decision/);
});

test("registry assessment href is active internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM02.activities.find(
    (a) => a.id === "lm02-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm02/assessment",
    gr: "/learning-modules-gr/lm02/assessment",
  });
});

test("single vs multiple selection UI and five-option visual letters", () => {
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.equal(visualLetterForIndex(4), "E");
  const orders = buildShuffledOptionOrders(
    [{ id: "q1", optionIds: ["A", "B", "C", "D", "E"] }],
    () => 0
  );
  assert.equal(orders.q1.length, 5);
  const rows = mapOptionsForDisplay(["A", "E"], {
    A: "Independent parties",
    E: "Many users",
  });
  assert.equal(rows[0].visualLetter, "A");
  assert.equal(rows[1].visualLetter, "B");
  assert.equal(rows[1].canonicalId, "E");
});

test("EN/GR key parity for assessment chrome and question ids", () => {
  const enKeys = Object.keys(LM02_ASSESSMENT_COPY.en).filter((k) => k !== "questions").sort();
  const grKeys = Object.keys(LM02_ASSESSMENT_COPY.gr).filter((k) => k !== "questions").sort();
  assert.deepEqual(enKeys, grKeys);
  assert.deepEqual(
    Object.keys(LM02_ASSESSMENT_COPY.en.questions),
    Object.keys(LM02_ASSESSMENT_COPY.gr.questions)
  );
  for (const id of QUESTION_IDS) {
    const enQ = LM02_ASSESSMENT_COPY.en.questions[id];
    const grQ = LM02_ASSESSMENT_COPY.gr.questions[id];
    assert.deepEqual(Object.keys(enQ.options).sort(), Object.keys(grQ.options).sort());
    assert.ok(enQ.heading);
    assert.ok(grQ.heading);
    assert.ok(enQ.prompt);
    assert.ok(grQ.prompt);
  }
});

test("panel renders heading then prompt for each question", () => {
  assert.match(panelSrc, /qCopy\.heading/);
  assert.match(panelSrc, /qCopy\.prompt/);
  assert.match(panelSrc, /AssessmentQuestionHeader/);
});
