/**
 * LM07 assessment surface tests (minimal).
 * Run: node --test src/components/learning-modules/Lm07AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM07_ASSESSMENT_COPY,
  LM07_POST_PASS_RATIONALES,
} from "../../content/lm07AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";
import {
  isLm07CriticalQuestion,
  LM07_CRITICAL_QUESTION_IDS,
  LM07_PRESENTATION_PASS_MIN,
} from "../../utils/lm07AssessmentView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm07AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm07AssessmentPage.jsx"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const QUESTION_IDS = Object.keys(LM07_ASSESSMENT_COPY.en.questions);

test("EN/GR LM07 assessment routes exist and map ready", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm07-assessment"], "/learning-modules/lm07/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm07-assessment"],
    "/learning-modules-gr/lm07/assessment"
  );
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM07",
      assessmentId: "lm07-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm07/assessment");
});

test("LM07 questions are single-choice with expected nine ids", () => {
  assert.equal(QUESTION_IDS.length, 9);
  assert.deepEqual(QUESTION_IDS, [
    "lm07_q1_code_plus_state",
    "lm07_q2_evm_execution",
    "lm07_q3_determinism",
    "lm07_q4_read_vs_write",
    "lm07_q5_gas",
    "lm07_q6_state_transition",
    "lm07_q7_persistence_immutability",
    "lm07_q8_onchain_offchain",
    "lm07_q9_foodchain_critical",
  ]);
  assert.match(
    LM07_ASSESSMENT_COPY.en.metaItems.join(" "),
    /Pass: 7\/9 correct \+ Critical Question 9/
  );
});

test("Critical chip only on Q9 FoodChain", () => {
  assert.deepEqual([...LM07_CRITICAL_QUESTION_IDS], ["lm07_q9_foodchain_critical"]);
  assert.equal(isLm07CriticalQuestion("lm07_q9_foodchain_critical"), true);
  assert.equal(LM07_PRESENTATION_PASS_MIN, 7);
  assert.match(panelSrc, /isLm07CriticalQuestion\(question\.id\)/);
});

test("EN/GR question ids and option key parity", () => {
  assert.deepEqual(
    Object.keys(LM07_ASSESSMENT_COPY.en.questions),
    Object.keys(LM07_ASSESSMENT_COPY.gr.questions)
  );
  for (const qid of QUESTION_IDS) {
    assert.deepEqual(
      Object.keys(LM07_ASSESSMENT_COPY.en.questions[qid].options),
      Object.keys(LM07_ASSESSMENT_COPY.gr.questions[qid].options),
      qid
    );
  }
  assert.deepEqual(
    Object.keys(LM07_POST_PASS_RATIONALES.en),
    Object.keys(LM07_POST_PASS_RATIONALES.gr)
  );
});

test("panel posts answer ids only via LM07 APIs", () => {
  assert.match(panelSrc, /postLm07AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm07AssessmentChallenge/);
  assert.match(panelSrc, /seedIncompleteAttemptIfNeeded/);
  assert.match(apiSrc, /learning-modules\/lm07\/assessment/);
  assert.match(pageSrc, /Lm07AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM07"/);
});

test("registry assessment activity is live internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM07.activities.find(
    (a) => a.id === "lm07-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm07-assessment");
  assert.equal(assessment.presentationOnly, false);
});
