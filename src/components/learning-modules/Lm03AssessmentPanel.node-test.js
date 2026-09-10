/**
 * LM03 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm03AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM03_ASSESSMENT_COPY,
  LM03_POST_PASS_RATIONALES,
} from "../../content/lm03AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
} from "../../utils/lm03AssessmentView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm03AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm03AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm03AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM03_ASSESSMENT_COPY.en.questions);

test("EN/GR LM03 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm03-assessment"], "/learning-modules/lm03/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm03-assessment"],
    "/learning-modules-gr/lm03/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm03\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm03\/assessment"/);
  assert.match(routesSrc, /Lm03AssessmentPage/);
});

test("Continue Learning maps lm03-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM03",
      assessmentId: "lm03-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm03/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM03",
      assessmentId: "lm03-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm03/assessment");
});

test("multiple-select instruction covers Q1, Q3 and Q6", () => {
  assert.match(LM03_ASSESSMENT_COPY.en.multiSelectType, /Select all that apply/i);
  assert.match(LM03_ASSESSMENT_COPY.gr.multiSelectType, /Επίλεξε όλες τις σωστές/i);
  assert.match(panelSrc, /multiSelectType/);
  assert.match(panelSrc, /singleChoiceType/);
  assert.match(panelSrc, /multiple_select/);
  assert.ok(QUESTION_IDS.includes("lm03_q1_architectural_dimensions"));
  assert.ok(QUESTION_IDS.includes("lm03_q3_requirements_to_characteristics"));
  assert.ok(QUESTION_IDS.includes("lm03_q6_foodtrace_revisited"));
});

test("EN/GR question ids and option key parity", () => {
  assert.deepEqual(
    Object.keys(LM03_ASSESSMENT_COPY.en.questions),
    Object.keys(LM03_ASSESSMENT_COPY.gr.questions)
  );
  for (const qid of QUESTION_IDS) {
    assert.deepEqual(
      Object.keys(LM03_ASSESSMENT_COPY.en.questions[qid].options),
      Object.keys(LM03_ASSESSMENT_COPY.gr.questions[qid].options),
      qid
    );
  }
  assert.deepEqual(
    Object.keys(LM03_POST_PASS_RATIONALES.en),
    Object.keys(LM03_POST_PASS_RATIONALES.gr)
  );
});

test("panel posts answer ids only and uses attempt stability", () => {
  assert.match(panelSrc, /postLm03AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm03AssessmentChallenge/);
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
  assert.doesNotMatch(localeSrc, /correctAnswers|passRule|OPTION_B is correct/i);
});

test("API helpers exist without authority fields", () => {
  assert.match(apiSrc, /fetchLm03AssessmentChallenge/);
  assert.match(apiSrc, /postLm03AssessmentAnswers/);
  assert.match(apiSrc, /learning-modules\/lm03\/assessment/);
  assert.doesNotMatch(
    apiSrc.slice(apiSrc.indexOf("postLm03AssessmentAnswers")),
    /score|passed|xpAwarded|wallet/
  );
});

test("registry assessment activity is live internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM03.activities.find(
    (a) => a.id === "lm03-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm03-assessment");
  assert.equal(assessment.presentationOnly, false);
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm03/assessment",
    gr: "/learning-modules-gr/lm03/assessment",
  });
});

test("page shell wires LM03 assessment panel", () => {
  assert.match(pageSrc, /Lm03AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM03"/);
  assert.match(pageSrc, /getLm03AssessmentCopy/);
});

test("shuffle helpers preserve canonical option ids", () => {
  const questions = [
    {
      id: "lm03_q1_architectural_dimensions",
      optionIds: ["A", "B", "C", "D", "E"],
    },
  ];
  const orders = buildShuffledOptionOrders(questions);
  assert.deepEqual(
    [...orders.lm03_q1_architectural_dimensions].sort(),
    ["A", "B", "C", "D", "E"]
  );
  const rows = mapOptionsForDisplay(orders.lm03_q1_architectural_dimensions, {
    A: "a",
    B: "b",
    C: "c",
    D: "d",
    E: "e",
  });
  assert.equal(rows.length, 5);
  assert.equal(visualLetterForIndex(0), "A");
  assert.ok(rows.every((row) => typeof row.canonicalId === "string"));
});

test("locked English prompts are present verbatim", () => {
  assert.match(
    LM03_ASSESSMENT_COPY.en.questions.lm03_q4_platform_fit.options.B,
    /blockchain justification and platform suitability are separate decisions/i
  );
  assert.match(
    LM03_ASSESSMENT_COPY.en.questions.lm03_q7_architectural_rejection.options.C,
    /Rejecting this candidate platform is a valid architectural outcome/i
  );
});
