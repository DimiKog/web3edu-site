/**
 * LM04 assessment surface tests.
 * Run: node --test src/components/learning-modules/Lm04AssessmentPanel.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM04_ASSESSMENT_COPY,
  LM04_POST_PASS_RATIONALES,
} from "../../content/lm04AssessmentLocale.js";
import { LM_PRESENTATION_REGISTRY } from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  EVIDENCE_ROUTES,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";
import {
  buildShuffledOptionOrders,
  isLm04CriticalQuestion,
  LM04_CRITICAL_QUESTION_IDS,
  LM04_PRESENTATION_PASS_MIN,
  mapOptionsForDisplay,
  visualLetterForIndex,
} from "../../utils/lm04AssessmentView.js";
import { resolveAssessmentFailLead } from "./assessment/assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(join(__dirname, "Lm04AssessmentPanel.jsx"), "utf8");
const pageSrc = readFileSync(
  join(__dirname, "../../pages/learning-modules/Lm04AssessmentPage.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm04AssessmentLocale.js"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "../../utils/labWriteApi.js"), "utf8");
const routesSrc = readFileSync(join(__dirname, "../../routes/routeTable.jsx"), "utf8");
const QUESTION_IDS = Object.keys(LM04_ASSESSMENT_COPY.en.questions);

test("EN/GR LM04 assessment routes exist", () => {
  assert.equal(ASSESSMENT_ROUTES.en["lm04-assessment"], "/learning-modules/lm04/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm04-assessment"],
    "/learning-modules-gr/lm04/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm04\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm04\/assessment"/);
  assert.match(routesSrc, /Lm04AssessmentPage/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm04"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm04"/);
});

test("Continue Learning maps lm04-assessment to ready route", () => {
  const en = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM04",
      assessmentId: "lm04-assessment",
    },
    lang: "en",
  });
  assert.equal(en.status, "ready");
  assert.equal(en.route, "/learning-modules/lm04/assessment");

  const gr = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM04",
      assessmentId: "lm04-assessment",
    },
    lang: "gr",
  });
  assert.equal(gr.status, "ready");
  assert.equal(gr.route, "/learning-modules-gr/lm04/assessment");
});

test("lab evidence routes for LM04 remain the real lab paths", () => {
  assert.equal(EVIDENCE_ROUTES.en.lab01, "/labs/wallets-keys");
  assert.equal(EVIDENCE_ROUTES.en.lab02, "/labs/lab02");
  assert.equal(EVIDENCE_ROUTES.en.lab03, "/labs/lab03");
  assert.equal(EVIDENCE_ROUTES.gr.lab01, "/labs-gr/wallets-keys");
  assert.equal(EVIDENCE_ROUTES.gr.lab02, "/labs-gr/lab02");
  assert.equal(EVIDENCE_ROUTES.gr.lab03, "/labs-gr/lab03");

  const mod = LM_PRESENTATION_REGISTRY.LM04;
  const lab01 = mod.activities.find((a) => a.evidenceId === "lab01");
  const lab02 = mod.activities.find((a) => a.evidenceId === "lab02");
  const lab03 = mod.activities.find((a) => a.evidenceId === "lab03");
  assert.deepEqual(lab01.href, { en: "/labs/wallets-keys", gr: "/labs-gr/wallets-keys" });
  assert.deepEqual(lab02.href, { en: "/labs/lab02", gr: "/labs-gr/lab02" });
  assert.deepEqual(lab03.href, { en: "/labs/lab03", gr: "/labs-gr/lab03" });
});

test("LM04 questions are single-choice with expected ids", () => {
  assert.match(panelSrc, /singleChoiceType/);
  assert.deepEqual(QUESTION_IDS, [
    "lm04_q1_key_roles",
    "lm04_q2_wallet_vs_address",
    "lm04_q3_confidentiality_encryption",
    "lm04_q4_authenticity_signing",
    "lm04_q5_address_not_public_key",
    "lm04_q6_signature_interpretation",
    "lm04_q7_proof_without_transaction",
  ]);
  assert.match(LM04_ASSESSMENT_COPY.en.metaItems.join(" "), /Pass: 5\/7 \+ Critical/);
  assert.match(LM04_ASSESSMENT_COPY.gr.metaItems.join(" "), /Επιτυχία: 5\/7 \+ Κρίσιμη/);
});

test("Critical chip only on Q4 authenticity / proof of control", () => {
  assert.deepEqual([...LM04_CRITICAL_QUESTION_IDS], ["lm04_q4_authenticity_signing"]);
  assert.equal(isLm04CriticalQuestion("lm04_q4_authenticity_signing"), true);
  for (const id of QUESTION_IDS) {
    if (id === "lm04_q4_authenticity_signing") continue;
    assert.equal(isLm04CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm04CriticalQuestion\(question\.id\)/);
  assert.match(panelSrc, /criticalLabel/);
  assert.equal(LM04_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM04_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(LM04_PRESENTATION_PASS_MIN, 5);
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 6, criticalFailures: ["lm04_q4_authenticity_signing"] },
      defaultLead: "default",
      criticalThresholdLead: LM04_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM04_PRESENTATION_PASS_MIN,
    }),
    LM04_ASSESSMENT_COPY.en.failedCriticalLead
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 4, criticalFailures: ["lm04_q4_authenticity_signing"] },
      defaultLead: "default",
      criticalThresholdLead: LM04_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM04_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
});

test("EN/GR question ids and option key parity", () => {
  assert.deepEqual(
    Object.keys(LM04_ASSESSMENT_COPY.en.questions),
    Object.keys(LM04_ASSESSMENT_COPY.gr.questions)
  );
  for (const qid of QUESTION_IDS) {
    assert.deepEqual(
      Object.keys(LM04_ASSESSMENT_COPY.en.questions[qid].options),
      Object.keys(LM04_ASSESSMENT_COPY.gr.questions[qid].options),
      qid
    );
  }
  assert.deepEqual(
    Object.keys(LM04_POST_PASS_RATIONALES.en),
    Object.keys(LM04_POST_PASS_RATIONALES.gr)
  );
});

test("panel posts answer ids only and uses attempt stability", () => {
  assert.match(panelSrc, /postLm04AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm04AssessmentChallenge/);
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

test("API helpers exist for LM04 assessment", () => {
  assert.match(apiSrc, /fetchLm04AssessmentChallenge/);
  assert.match(apiSrc, /postLm04AssessmentAnswers/);
  assert.match(apiSrc, /learning-modules\/lm04\/assessment/);
});

test("registry assessment activity is live internal link", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM04.activities.find(
    (a) => a.id === "lm04-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm04-assessment");
  assert.equal(assessment.presentationOnly, false);
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm04/assessment",
    gr: "/learning-modules-gr/lm04/assessment",
  });
});

test("page shell wires LM04 assessment panel", () => {
  assert.match(pageSrc, /Lm04AssessmentPanel/);
  assert.match(pageSrc, /moduleId="LM04"/);
  assert.match(pageSrc, /getLm04AssessmentCopy/);
});

test("shuffle helpers preserve canonical option ids", () => {
  const questions = [
    {
      id: "lm04_q1_key_roles",
      optionIds: ["A", "B", "C", "D"],
    },
  ];
  const orders = buildShuffledOptionOrders(questions);
  assert.deepEqual([...orders.lm04_q1_key_roles].sort(), ["A", "B", "C", "D"]);
  const rows = mapOptionsForDisplay(orders.lm04_q1_key_roles, {
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
    LM04_ASSESSMENT_COPY.en.questions.lm04_q2_wallet_vs_address.options.C,
    /wallet manages cryptographic keys/i
  );
  assert.match(
    LM04_ASSESSMENT_COPY.en.questions.lm04_q5_address_not_public_key.options.C,
    /derived public handle/i
  );
  assert.match(
    LM04_ASSESSMENT_COPY.en.questions.lm04_q6_signature_interpretation.heading,
    /FoodTrust scenario/i
  );
  assert.match(
    LM04_ASSESSMENT_COPY.en.questions.lm04_q6_signature_interpretation.options.B,
    /signature alone does not prove that the declared harvest date is factually true/i
  );
  assert.match(
    LM04_ASSESSMENT_COPY.gr.questions.lm04_q6_signature_interpretation.heading,
    /FoodTrust/
  );
  assert.doesNotMatch(localeSrc, /correctAnswers|answerKey|OPTION_B is correct/i);
});
