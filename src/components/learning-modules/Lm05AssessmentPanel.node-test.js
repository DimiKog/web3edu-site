/**
 * LM05 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm05AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM05_ASSESSMENT_COPY,
  LM05_POST_PASS_RATIONALES,
} from "../../content/lm05AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  EVIDENCE_ROUTES,
  UNAVAILABLE_EVIDENCE_IDS,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  isLm05CriticalQuestion,
  LM05_CRITICAL_QUESTION_IDS,
  LM05_PRESENTATION_PASS_MIN,
  mapOptionsForDisplay,
  visualLetterForIndex,
} from "../../utils/lm05AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm05AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm05AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm05AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM05_ASSESSMENT_COPY.en.questions);

test("EN/GR LM05 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm05-assessment"], "/learning-modules/lm05/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm05-assessment"],
    "/learning-modules-gr/lm05/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm05\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm05\/assessment"/);
  assert.match(routesSrc, /Lm05AssessmentPage/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm05"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm05"/);
});

test("Continue Learning maps lm05-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM05",
      assessmentId: "lm05-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm05/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM05",
      assessmentId: "lm05-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm05/assessment");
});

test("lab evidence routes for LM05 remain real lab paths; PEL links to educational ledger", () => {
  assert.equal(EVIDENCE_ROUTES.en.lab04, "/labs/lab04");
  assert.equal(EVIDENCE_ROUTES.en.lab05, "/labs/lab05");
  assert.equal(EVIDENCE_ROUTES.gr.lab04, "/labs-gr/lab04");
  assert.equal(EVIDENCE_ROUTES.gr.lab05, "/labs-gr/lab05");
  assert.equal(
    EVIDENCE_ROUTES.en["lm05-pel-transaction"],
    "/learning-modules/lm05/educational-ledger"
  );
  assert.equal(
    EVIDENCE_ROUTES.gr["lm05-pel-transaction"],
    "/learning-modules-gr/lm05/educational-ledger"
  );
  assert.equal(UNAVAILABLE_EVIDENCE_IDS.has("lm05-pel-transaction"), false);

  const mod = LM_PRESENTATION_REGISTRY.LM05;
  const lab04 = mod.activities.find((a) => a.evidenceId === "lab04");
  const lab05 = mod.activities.find((a) => a.evidenceId === "lab05");
  const pel = mod.activities.find((a) => a.evidenceId === "lm05-pel-transaction");
  assert.deepEqual(lab04.href, { en: "/labs/lab04", gr: "/labs-gr/lab04" });
  assert.deepEqual(lab05.href, { en: "/labs/lab05", gr: "/labs-gr/lab05" });
  assert.equal(pel.linkKind, "internal");
  assert.deepEqual(pel.href, {
    en: "/learning-modules/lm05/educational-ledger",
    gr: "/learning-modules-gr/lm05/educational-ledger",
  });

  const pelAction = resolveProgressionActionTarget({
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM05",
      evidenceId: "lm05-pel-transaction",
    },
    lang: "en",
  });
  assert.equal(pelAction.status, "ready");
  assert.equal(pelAction.route, "/learning-modules/lm05/educational-ledger");
});

test("LM05 questions are single-choice with expected ids", () => {
  assert.match(panelSrc, /singleChoiceType/);
  assert.deepEqual(QUESTION_IDS, [
    "lm05_q1_transaction_intent",
    "lm05_q2_nonce",
    "lm05_q3_gas",
    "lm05_q4_read_vs_state_change",
    "lm05_q5_failed_execution",
    "lm05_q6_trustchain_state_transition",
    "lm05_q7_pending_transaction",
  ]);
  assert.match(LM05_ASSESSMENT_COPY.en.metaItems.join(" "), /Pass: 5\/7 \+ Critical/);
  assert.match(LM05_ASSESSMENT_COPY.gr.metaItems.join(" "), /Επιτυχία: 5\/7 \+ Κρίσιμη/);
});

test("Critical chip only on Q7 pending transaction", () => {
  assert.deepEqual([...LM05_CRITICAL_QUESTION_IDS], ["lm05_q7_pending_transaction"]);
  assert.equal(isLm05CriticalQuestion("lm05_q7_pending_transaction"), true);
  for (const id of QUESTION_IDS) {
    if (id === "lm05_q7_pending_transaction") continue;
    assert.equal(isLm05CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm05CriticalQuestion\(question\.id\)/);
  assert.match(panelSrc, /criticalLabel/);
  assert.equal(LM05_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM05_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM05_PRESENTATION_PASS_MIN, 5);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 6, criticalFailures: ["lm05_q7_pending_transaction"] },
      defaultLead: "default",
      criticalThresholdLead: LM05_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM05_PRESENTATION_PASS_MIN,
    }),
    LM05_ASSESSMENT_COPY.en.failedCriticalLead
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 4, criticalFailures: ["lm05_q7_pending_transaction"] },
      defaultLead: "default",
      criticalThresholdLead: LM05_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM05_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
});

test("EN/GR question ids and option key parity", () => {
  assert.deepEqual(
    Object.keys(LM05_ASSESSMENT_COPY.en.questions),
    Object.keys(LM05_ASSESSMENT_COPY.gr.questions)
  );
  for (const qid of QUESTION_IDS) {
    assert.deepEqual(
      Object.keys(LM05_ASSESSMENT_COPY.en.questions[qid].options),
      Object.keys(LM05_ASSESSMENT_COPY.gr.questions[qid].options),
      qid
    );
  }
  assert.deepEqual(
    Object.keys(LM05_POST_PASS_RATIONALES.en),
    Object.keys(LM05_POST_PASS_RATIONALES.gr)
  );
});

test("panel posts answer ids only and uses attempt stability", () => {
  assert.match(panelSrc, /postLm05AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm05AssessmentChallenge/);
  assert.match(panelSrc, /idTokenRef/);
  assert.match(panelSrc, /seedIncompleteAttemptIfNeeded/);
  assert.match(panelSrc, /buildShuffledOptionOrders/);
  assert.match(panelSrc, /handleTryAgain/);
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentPassState/);
  assert.match(panelSrc, /AssessmentFailState/);
  assert.doesNotMatch(panelSrc, /score:\s*[0-9]/);
  assert.doesNotMatch(panelSrc, /passed:\s*true/);
  assert.doesNotMatch(panelSrc, /wallet:/);
  assert.doesNotMatch(localeSrc, /correctAnswers|passRule|OPTION_C is correct/i);
});

test("API helpers exist for LM05 assessment", () => {
  assert.match(apiSrc, /fetchLm05AssessmentChallenge/);
  assert.match(apiSrc, /postLm05AssessmentAnswers/);
  assert.match(apiSrc, /learning-modules\/lm05\/assessment/);
});

test("registry assessment activity is live internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM05.activities.find(
    (a) => a.id === "lm05-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm05-assessment");
  assert.equal(assessment.presentationOnly, false);
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm05/assessment",
    gr: "/learning-modules-gr/lm05/assessment",
  });
});

test("page shell wires LM05 assessment panel", () => {
  assert.match(pageSrc, /Lm05AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM05"/);
  assert.match(pageSrc, /getLm05AssessmentCopy/);
});

test("pass presentation reinforces pending vs inclusion", () => {
  assert.match(
    LM05_ASSESSMENT_COPY.en.keyPrinciple,
    /Creating or submitting a transaction is not the same/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.en.continueLearningHint,
    /Educational Ledger contribution/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.gr.continueLearningHint,
    /Εκπαιδευτικό Ledger/
  );
  assert.doesNotMatch(localeSrc, /module is complete|LM05 is now complete/i);
});

test("shuffle helpers preserve canonical option ids", () => {
  const questions = [
    {
      id: "lm05_q1_transaction_intent",
      optionIds: ["A", "B", "C", "D"],
    },
  ];
  const orders = buildShuffledOptionOrders(questions);
  assert.deepEqual([...orders.lm05_q1_transaction_intent].sort(), ["A", "B", "C", "D"]);
  const rows = mapOptionsForDisplay(orders.lm05_q1_transaction_intent, {
    A: "a",
    B: "b",
    C: "c",
    D: "d",
  });
  assert.equal(rows.length, 4);
  assert.equal(visualLetterForIndex(0), "A");
  assert.ok(rows.every((row) => typeof row.canonicalId === "string"));
});

test("English prompts cover the approved conceptual set", () => {
  assert.match(
    LM05_ASSESSMENT_COPY.en.questions.lm05_q1_transaction_intent.options.A,
    /request to change blockchain state/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.en.questions.lm05_q4_read_vs_state_change.options.B,
    /without changing blockchain state/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.en.questions.lm05_q7_pending_transaction.heading,
    /Pending transaction/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.en.questions.lm05_q7_pending_transaction.options.C,
    /accepted into the pool as pending/i
  );
  assert.match(
    LM05_ASSESSMENT_COPY.gr.questions.lm05_q7_pending_transaction.heading,
    /Pending/
  );
  assert.doesNotMatch(localeSrc, /correctAnswers|answerKey|OPTION_C is correct/i);
});
