/**
 * LM06 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm06AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM06_ASSESSMENT_COPY,
  LM06_POST_PASS_RATIONALES,
} from "../../content/lm06AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  isLm06CriticalQuestion,
  LM06_CRITICAL_QUESTION_IDS,
  LM06_PRESENTATION_PASS_MIN,
  mapOptionsForDisplay,
  visualLetterForIndex,
} from "../../utils/lm06AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm06AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm06AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm06AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM06_ASSESSMENT_COPY.en.questions);

test("EN/GR LM06 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm06-assessment"], "/learning-modules/lm06/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm06-assessment"],
    "/learning-modules-gr/lm06/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm06\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06\/assessment"/);
  assert.match(routesSrc, /Lm06AssessmentPage/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm06"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06"/);
});

test("Continue Learning maps lm06-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM06",
      assessmentId: "lm06-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm06/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM06",
      assessmentId: "lm06-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm06/assessment");
});

test("LM06 questions are single-choice with expected nine ids", () => {
  assert.match(panelSrc, /singleChoiceType/);
  assert.equal(QUESTION_IDS.length, 9);
  assert.deepEqual(QUESTION_IDS, [
    "lm06_q1_why_consensus",
    "lm06_q2_proof_of_work",
    "lm06_q3_proof_of_stake",
    "lm06_q4_different_networks",
    "lm06_q5_known_validators",
    "lm06_q6_qbft_scenario",
    "lm06_q7_local_validation",
    "lm06_q8_proposal_not_finality",
    "lm06_q9_foodchain_synthesis",
  ]);
  assert.match(
    LM06_ASSESSMENT_COPY.en.metaItems.join(" "),
    /Pass: 7\/9 correct \+ Critical Question 8/
  );
  assert.match(
    LM06_ASSESSMENT_COPY.gr.metaItems.join(" "),
    /Επιτυχία: 7\/9 σωστές \+ Κρίσιμη Ερώτηση 8/
  );
});

test("Critical chip only on Q8 proposal not finality", () => {
  assert.deepEqual([...LM06_CRITICAL_QUESTION_IDS], ["lm06_q8_proposal_not_finality"]);
  assert.equal(isLm06CriticalQuestion("lm06_q8_proposal_not_finality"), true);
  for (const id of QUESTION_IDS) {
    if (id === "lm06_q8_proposal_not_finality") continue;
    assert.equal(isLm06CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm06CriticalQuestion\(question\.id\)/);
  assert.match(panelSrc, /criticalLabel/);
  assert.equal(LM06_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM06_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM06_PRESENTATION_PASS_MIN, 7);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 8, criticalFailures: ["lm06_q8_proposal_not_finality"] },
      defaultLead: "default",
      criticalThresholdLead: LM06_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM06_PRESENTATION_PASS_MIN,
    }),
    LM06_ASSESSMENT_COPY.en.failedCriticalLead
  );
  assert.match(
    LM06_ASSESSMENT_COPY.en.failedCriticalLead,
    /not finality/i
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 6, criticalFailures: ["lm06_q8_proposal_not_finality"] },
      defaultLead: "default",
      criticalThresholdLead: LM06_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM06_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
});

test("EN/GR question ids and option key parity", () => {
  assert.deepEqual(
    Object.keys(LM06_ASSESSMENT_COPY.en.questions),
    Object.keys(LM06_ASSESSMENT_COPY.gr.questions)
  );
  for (const qid of QUESTION_IDS) {
    assert.deepEqual(
      Object.keys(LM06_ASSESSMENT_COPY.en.questions[qid].options),
      Object.keys(LM06_ASSESSMENT_COPY.gr.questions[qid].options),
      qid
    );
  }
  assert.deepEqual(
    Object.keys(LM06_POST_PASS_RATIONALES.en),
    Object.keys(LM06_POST_PASS_RATIONALES.gr)
  );
});

test("panel posts answer ids only and uses attempt stability", () => {
  assert.match(panelSrc, /postLm06AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm06AssessmentChallenge/);
  assert.match(panelSrc, /idTokenRef/);
  assert.match(panelSrc, /seedIncompleteAttemptIfNeeded/);
  assert.match(panelSrc, /buildShuffledOptionOrders/);
  assert.match(panelSrc, /handleTryAgain/);
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentPassState/);
  assert.match(panelSrc, /AssessmentFailState/);
  assert.match(panelSrc, /refreshProgression/);
  assert.match(panelSrc, /refetchResolvedIdentity/);
  assert.match(panelSrc, /web3edu-progress-updated/);
  assert.doesNotMatch(panelSrc, /score:\s*[0-9]/);
  assert.doesNotMatch(panelSrc, /passed:\s*true/);
  assert.doesNotMatch(panelSrc, /wallet:/);
  assert.doesNotMatch(localeSrc, /correctAnswers|passRule|OPTION_C is correct/i);
});

test("API helpers exist for LM06 assessment", () => {
  assert.match(apiSrc, /fetchLm06AssessmentChallenge/);
  assert.match(apiSrc, /postLm06AssessmentAnswers/);
  assert.match(apiSrc, /learning-modules\/lm06\/assessment/);
});

test("registry assessment activity is live internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm06-assessment");
  assert.equal(assessment.presentationOnly, false);
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm06/assessment",
    gr: "/learning-modules-gr/lm06/assessment",
  });
  assert.doesNotMatch(assessment.description.en, /not yet available/i);
});

test("page shell wires LM06 assessment panel", () => {
  assert.match(pageSrc, /Lm06AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM06"/);
  assert.match(pageSrc, /getLm06AssessmentCopy/);
});

test("pass presentation does not hard-code LM06 complete", () => {
  assert.match(
    LM06_ASSESSMENT_COPY.en.keyPrinciple,
    /PENDING → PROPOSED → AGREED → FINALIZED/
  );
  assert.match(LM06_ASSESSMENT_COPY.en.continueLearningHint, /Lab 06/i);
  assert.match(LM06_ASSESSMENT_COPY.gr.continueLearningHint, /Lab 06/);
  assert.doesNotMatch(localeSrc, /module is complete|LM06 is now complete/i);
  assert.match(
    LM06_ASSESSMENT_COPY.en.continueLearningHint,
    /complete only when Lab 06 and this assessment are both satisfied/i
  );
});

test("shuffle helpers preserve canonical option ids", () => {
  const questions = [
    {
      id: "lm06_q1_why_consensus",
      optionIds: ["A", "B", "C", "D"],
    },
  ];
  const orders = buildShuffledOptionOrders(questions);
  assert.deepEqual([...orders.lm06_q1_why_consensus].sort(), ["A", "B", "C", "D"]);
  const rows = mapOptionsForDisplay(orders.lm06_q1_why_consensus, {
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
    LM06_ASSESSMENT_COPY.en.questions.lm06_q1_why_consensus.options.B,
    /agreed ledger state/i
  );
  assert.match(
    LM06_ASSESSMENT_COPY.en.questions.lm06_q8_proposal_not_finality.heading,
    /Proposal Is Not Finality/i
  );
  assert.match(
    LM06_ASSESSMENT_COPY.en.questions.lm06_q8_proposal_not_finality.options.C,
    /proposed for inclusion/i
  );
  assert.match(
    LM06_ASSESSMENT_COPY.en.questions.lm06_q9_foodchain_synthesis.options.D,
    /finalized/i
  );
  assert.match(
    LM06_ASSESSMENT_COPY.gr.questions.lm06_q8_proposal_not_finality.heading,
    /Οριστικότητα/
  );
  assert.doesNotMatch(localeSrc, /correctAnswers|answerKey|OPTION_C is correct/i);
});

test("xp award copy distinguishes first pass vs already awarded", () => {
  assert.equal(LM06_ASSESSMENT_COPY.en.xpAwarded(200), "+200 XP");
  assert.equal(LM06_ASSESSMENT_COPY.en.xpAlready, "XP already awarded");
  assert.match(panelSrc, /xpAwarded > 0/);
  assert.match(panelSrc, /already_passed/);
});
