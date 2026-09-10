/**
 * LM08 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm08AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM08_ASSESSMENT_COPY,
  LM08_POST_PASS_RATIONALES,
} from "../../content/lm08AssessmentLocale.js";
import { ASSESSMENT_ROUTES, resolveProgressionActionTarget } from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  isLm08CriticalQuestion,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CRITICAL_QUESTION_IDS,
  LM08_PRESENTATION_PASS_MIN,
} from "../../utils/lm08AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm08AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm08AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm08AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM08_ASSESSMENT_COPY.en.questions);
const NON_CRITICAL_IDS = QUESTION_IDS.filter(
  (id) => !LM08_CRITICAL_QUESTION_IDS.includes(id)
);

test("EN/GR LM08 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm08-assessment"], "/learning-modules/lm08/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm08-assessment"],
    "/learning-modules-gr/lm08/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm08\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm08\/assessment"/);
  assert.match(routesSrc, /Lm08AssessmentPage/);
});

test("Continue Learning maps lm08-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM08",
      assessmentId: "lm08-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm08/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM08",
      assessmentId: "lm08-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm08/assessment");
});

test("shared meta strip and type chips are wired", () => {
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentQuestionHeader/);
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.match(panelSrc, /multiSelectType/);
  assert.match(panelSrc, /singleChoiceType/);
  assert.match(LM08_ASSESSMENT_COPY.en.multiSelectType, /Select all that apply/i);
  assert.equal(
    LM08_ASSESSMENT_COPY.gr.multiSelectType,
    "Επίλεξε όλες τις σωστές"
  );
  assert.match(panelSrc, /multiple_select/);
});

test("Critical chip only on curriculum-critical LM08 questions", () => {
  assert.deepEqual([...LM08_CRITICAL_QUESTION_IDS], [
    "lm08_q4_changing_state",
    "lm08_q7_verification_limits",
  ]);
  assert.equal(isLm08CriticalQuestion("lm08_q4_changing_state"), true);
  assert.equal(isLm08CriticalQuestion("lm08_q7_verification_limits"), true);
  for (const id of NON_CRITICAL_IDS) {
    assert.equal(isLm08CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm08CriticalQuestion\(question\.id\)/);
  assert.equal(LM08_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM08_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("Greek wording refinements for agreed learner-facing strings", () => {
  const q = LM08_ASSESSMENT_COPY.gr.questions;
  assert.match(q.lm08_q1_deployment_lifecycle.prompt, /πώς καταλήγει σε ένα ανεπτυγμένο συμβόλαιο/);
  assert.doesNotMatch(q.lm08_q1_deployment_lifecycle.prompt, /πώς γίνεται ανεπτυγμένο/);
  assert.match(q.lm08_q2_contract_instance.options.D, /αρχείο πηγαίου κώδικα Solidity/);
  assert.equal(
    q.lm08_q4_changing_state.options.C,
    "Αλλάζει μόνο την τοπική κατάσταση στον browser του μαθητή."
  );
  assert.equal(q.lm08_q5_contract_inspection.options.A, "Η διεύθυνση του ανεπτυγμένου συμβολαίου.");
  assert.match(
    q.lm08_q5_contract_inspection.options.C,
    /όταν αυτές οι πληροφορίες παρέχονται από τον explorer/
  );
  assert.match(q.lm08_q6_source_verification.options.C, /συσχετίσουν/);
  assert.doesNotMatch(q.lm08_q6_source_verification.options.C, /συνδέσουν/);
});

test("post-pass rationales cover Q1-Q7 in EN and GR", () => {
  assert.deepEqual(Object.keys(LM08_POST_PASS_RATIONALES.en).sort(), [...QUESTION_IDS].sort());
  assert.deepEqual(Object.keys(LM08_POST_PASS_RATIONALES.gr).sort(), [...QUESTION_IDS].sort());
  for (const id of QUESTION_IDS) {
    assert.ok(LM08_POST_PASS_RATIONALES.en[id].length > 40);
    assert.ok(LM08_POST_PASS_RATIONALES.gr[id].length > 40);
  }
  assert.match(LM08_POST_PASS_RATIONALES.gr.lm08_q7_verification_limits, /δυνατότητα επιθεώρησης/);
  assert.doesNotMatch(LM08_POST_PASS_RATIONALES.gr.lm08_q7_verification_limits, /επιθεωρησιμότητα/);
  assert.match(panelSrc, /LM08_POST_PASS_RATIONALES/);
  assert.match(panelSrc, /postPassRationales/);
});

test("panel submits answers only and refreshes progression on pass", () => {
  assert.match(panelSrc, /postLm08AssessmentAnswers/);
  assert.match(panelSrc, /postLm08AssessmentAnswers\(\{[\s\S]*answers/);
  assert.doesNotMatch(panelSrc, /postLm08AssessmentAnswers\(\{[\s\S]*score:/);
  assert.doesNotMatch(panelSrc, /postLm08AssessmentAnswers\(\{[\s\S]*passed:/);
  assert.doesNotMatch(panelSrc, /postLm08AssessmentAnswers\(\{[\s\S]*wallet:/);
  assert.match(panelSrc, /web3edu-progress-updated/);
  assert.match(panelSrc, /refetchResolvedIdentity/);
});

test("API helpers never send score/passed authority fields", () => {
  assert.match(apiSrc, /export async function fetchLm08AssessmentChallenge/);
  assert.match(apiSrc, /export async function postLm08AssessmentAnswers/);
  const fn = apiSrc.slice(apiSrc.indexOf("export async function postLm08AssessmentAnswers"));
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
  assert.doesNotMatch(fn, /postLm08AssessmentAnswers/);
  assert.doesNotMatch(fn, /emptyAnswers|setAnswers\(/);
  assert.match(panelSrc, /onRetry=\{handleTryAgain\}/);
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM08_PRESENTATION_PASS_MIN, 5);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: ["lm08_q4_changing_state"] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM08_PRESENTATION_PASS_MIN,
    }),
    "critical-threshold"
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 4, criticalFailures: ["lm08_q4_changing_state"] },
      defaultLead: "default",
      criticalThresholdLead: "critical-threshold",
      passMinCorrect: LM08_PRESENTATION_PASS_MIN,
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
  assert.equal(LM08_ASSESSMENT_COPY.en.passCapabilities.length, 3);
  assert.equal(LM08_ASSESSMENT_COPY.gr.passCapabilities.length, 3);
  assert.match(LM08_ASSESSMENT_COPY.en.keyPrinciple, /Source verification/i);
  assert.equal(LM08_ASSESSMENT_COPY.en.xpAwarded(300), "+300 XP");
  assert.equal(LM08_ASSESSMENT_COPY.en.passedScore(7, 7), "7/7");
});

test("imperfect PASS revisit only when evaluation.feedback is present", () => {
  assert.match(panelSrc, /passRevisitRows/);
  assert.match(panelSrc, /score < total/);
  assert.match(panelSrc, /evaluation\?\.feedback/);
  assert.match(panelSrc, /buildAssessmentFeedbackRows\(feedback/);
});

test("page uses shared LearningModuleActivityShell in compact density", () => {
  assert.match(pageSrc, /LearningModuleActivityShell/);
  assert.match(pageSrc, /Lm08AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM08"/);
  assert.match(pageSrc, /density="compact"/);
});

test("locale has seven questions EN/GR without answer-key authority", () => {
  const enIds = Object.keys(LM08_ASSESSMENT_COPY.en.questions);
  const grIds = Object.keys(LM08_ASSESSMENT_COPY.gr.questions);
  assert.equal(enIds.length, 7);
  assert.deepEqual(enIds, grIds);
  assert.doesNotMatch(localeSrc, /correct:\s*["']?[ABCDE]/);
  assert.doesNotMatch(localeSrc, /passMin|answerKey|correctAnswers|\[CRITICAL\]/);
  assert.match(localeSrc, /lm08_q4_changing_state/);
  assert.match(localeSrc, /lm08_q7_verification_limits/);
});

test("panel has no frontend correct-answer logic", () => {
  assert.doesNotMatch(panelSrc, /correctAnswers|OPTION_B|score\s*>=/);
  assert.doesNotMatch(panelSrc, /\[CRITICAL\]/);
});

test("failed remediation shows Q-number title and hint separation", () => {
  assert.match(panelSrc, /buildAssessmentFeedbackRows/);
  assert.match(panelSrc, /feedbackRows/);
  assert.equal(LM08_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM08_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
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

test("single vs multiple selection UI and five-option visual letters", () => {
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.equal(visualLetterForIndex(4), "E");
  const orders = buildShuffledOptionOrders(
    [{ id: "q5", optionIds: ["A", "B", "C", "D", "E"] }],
    () => 0
  );
  assert.equal(orders.q5.length, 5);
  const rows = mapOptionsForDisplay(["A", "E"], {
    A: "Address",
    E: "No vulnerabilities",
  });
  assert.equal(rows[0].visualLetter, "A");
  assert.equal(rows[1].visualLetter, "B");
  assert.equal(rows[1].canonicalId, "E");
});

test("EN/GR key parity for assessment chrome", () => {
  const enKeys = Object.keys(LM08_ASSESSMENT_COPY.en).filter((k) => k !== "questions").sort();
  const grKeys = Object.keys(LM08_ASSESSMENT_COPY.gr).filter((k) => k !== "questions").sort();
  assert.deepEqual(enKeys, grKeys);
});
