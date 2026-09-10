/**
 * Assessment UX v2 presentation primitives (Slice 1).
 * Run: node --test src/components/learning-modules/assessment/assessmentPresentation.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM03_ASSESSMENT_COPY,
  LM03_POST_PASS_RATIONALES,
} from "../../../content/lm03AssessmentLocale.js";
import {
  isLm03CriticalQuestion,
  LM03_CRITICAL_QUESTION_IDS,
  LM03_PRESENTATION_PASS_MIN,
} from "../../../utils/lm03AssessmentView.js";
import {
  assessmentChoiceInputClassName,
  assessmentChoiceRowClassName,
} from "./assessmentChoicePresentation.js";
import { resolveAssessmentFailLead } from "./assessmentFailPresentation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const metaSrc = readFileSync(join(__dirname, "AssessmentMetaStrip.jsx"), "utf8");
const headerSrc = readFileSync(join(__dirname, "AssessmentQuestionHeader.jsx"), "utf8");
const choiceSrc = readFileSync(join(__dirname, "AssessmentChoiceList.jsx"), "utf8");
const failSrc = readFileSync(join(__dirname, "AssessmentFailState.jsx"), "utf8");
const passSrc = readFileSync(join(__dirname, "AssessmentPassState.jsx"), "utf8");
const panelSrc = readFileSync(join(__dirname, "../Lm03AssessmentPanel.jsx"), "utf8");

const CHROME_KEYS = [
  "metaItems",
  "metaScopeHint",
  "metaSummaryLabel",
  "singleChoiceType",
  "multiSelectType",
  "criticalLabel",
  "failedLead",
  "failedCriticalLead",
  "youCanNow",
  "passCapabilities",
  "keyPrinciple",
  "revisitOne",
  "revisitMany",
  "reviewTakeaways",
];

const NON_CRITICAL_LM03_IDS = Object.keys(LM03_ASSESSMENT_COPY.en.questions).filter(
  (id) => !LM03_CRITICAL_QUESTION_IDS.includes(id)
);
test("AssessmentMetaStrip is a compact metadata strip", () => {
  assert.match(metaSrc, /data-assessment-meta-strip/);
  assert.match(metaSrc, /summaryLabel/);
  assert.doesNotMatch(metaSrc, /Before you begin|Read this first/);
  assert.match(metaSrc, /scopeHint/);
});

test("LM03 meta strip copy covers required assessment metadata in EN and GR", () => {
  for (const lang of ["en", "gr"]) {
    const items = LM03_ASSESSMENT_COPY[lang].metaItems;
    assert.equal(items.length, 4);
    assert.match(items.join(" "), /7/);
    assert.match(items.join(" "), /5\/7/);
    assert.ok(LM03_ASSESSMENT_COPY[lang].metaScopeHint.length > 10);
  }
  assert.match(LM03_ASSESSMENT_COPY.en.metaItems.join(" "), /all Critical questions/i);
  assert.match(LM03_ASSESSMENT_COPY.gr.metaItems.join(" "), /όλες οι Κρίσιμες ερωτήσεις/i);
  assert.match(LM03_ASSESSMENT_COPY.en.metaItems.join(" "), /Retries allowed/i);
  assert.match(LM03_ASSESSMENT_COPY.gr.metaItems.join(" "), /Επιτρέπονται επαναλήψεις/);
  assert.doesNotMatch(LM03_ASSESSMENT_COPY.en.metaItems.join(" "), /Q4|Q7|lm03_q/);
  assert.doesNotMatch(LM03_ASSESSMENT_COPY.gr.metaItems.join(" "), /Q4|Q7|lm03_q/);
});

test("AssessmentQuestionHeader distinguishes single vs multiple select", () => {
  assert.match(headerSrc, /data-question-type=\{isMultiple \? "multiple_select" : "single_choice"\}/);
  assert.match(headerSrc, /typeLabel/);
  assert.match(headerSrc, /Q\{number\}/);
  assert.equal(LM03_ASSESSMENT_COPY.en.singleChoiceType, "Single choice");
  assert.equal(LM03_ASSESSMENT_COPY.en.multiSelectType, "Select all that apply");
  assert.ok(LM03_ASSESSMENT_COPY.gr.singleChoiceType);
  assert.ok(LM03_ASSESSMENT_COPY.gr.multiSelectType);
  assert.notEqual(
    LM03_ASSESSMENT_COPY.en.singleChoiceType,
    LM03_ASSESSMENT_COPY.en.multiSelectType
  );
});

test("AssessmentQuestionHeader supports optional Critical chip without error styling", () => {
  assert.match(headerSrc, /critical/);
  assert.match(headerSrc, /criticalLabel/);
  assert.match(headerSrc, /data-critical-chip/);
  assert.match(headerSrc, /violet/);
  assert.doesNotMatch(headerSrc, /red-|rose-|destructive|error/i);
  assert.equal(LM03_ASSESSMENT_COPY.en.criticalLabel, "Critical");
  assert.equal(LM03_ASSESSMENT_COPY.gr.criticalLabel, "Κρίσιμη");
});

test("LM03 marks only Q4 and Q7 as Critical via adapter config", () => {
  assert.deepEqual([...LM03_CRITICAL_QUESTION_IDS], [
    "lm03_q4_platform_fit",
    "lm03_q7_architectural_rejection",
  ]);
  assert.equal(isLm03CriticalQuestion("lm03_q4_platform_fit"), true);
  assert.equal(isLm03CriticalQuestion("lm03_q7_architectural_rejection"), true);
  for (const id of NON_CRITICAL_LM03_IDS) {
    assert.equal(isLm03CriticalQuestion(id), false, id);
  }
  assert.match(panelSrc, /isLm03CriticalQuestion\(question\.id\)/);
  assert.match(panelSrc, /criticalLabel=\{copy\.criticalLabel\}/);
  assert.doesNotMatch(headerSrc, /lm03_q4_platform_fit|lm03_q7_architectural_rejection/);
});

test("fail lead uses public criticalFailures when score meets presentation threshold", () => {
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: ["lm03_q4_platform_fit"] },
      defaultLead: "default",
      criticalThresholdLead: LM03_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM03_PRESENTATION_PASS_MIN,
    }),
    LM03_ASSESSMENT_COPY.en.failedCriticalLead
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 4, criticalFailures: ["lm03_q4_platform_fit"] },
      defaultLead: "default",
      criticalThresholdLead: LM03_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM03_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
  assert.equal(
    resolveAssessmentFailLead({
      evaluation: { score: 5, criticalFailures: [] },
      defaultLead: "default",
      criticalThresholdLead: LM03_ASSESSMENT_COPY.en.failedCriticalLead,
      passMinCorrect: LM03_PRESENTATION_PASS_MIN,
    }),
    "default"
  );
  assert.match(panelSrc, /resolveAssessmentFailLead/);
  assert.match(panelSrc, /failedCriticalLead/);
  assert.match(
    LM03_ASSESSMENT_COPY.gr.failedCriticalLead,
    /Κρίσιμη ερώτηση/
  );
});

test("selected-answer styling is presentation-only and neutral", () => {
  const selected = assessmentChoiceRowClassName(true);
  const idle = assessmentChoiceRowClassName(false);
  assert.match(selected, /border-cyan/);
  assert.match(selected, /bg-cyan/);
  assert.doesNotMatch(selected, /emerald|green-|#16a34a|correct/i);
  assert.match(idle, /border-transparent/);
  assert.match(assessmentChoiceInputClassName("radio"), /checked:bg-cyan/);
  assert.match(choiceSrc, /assessmentChoiceRowClassName\(checked\)/);
  assert.match(choiceSrc, /value=\{row\.canonicalId\}/);
  assert.doesNotMatch(choiceSrc, /correctAnswers|passRule|emerald-500/);
  assert.doesNotMatch(selected, /correctAnswers|passRule/);
});

test("AssessmentFailState preserves remediation feedback and retry", () => {
  assert.match(failSrc, /feedbackRows\.map/);
  assert.match(failSrc, /row\.hint/);
  assert.match(failSrc, /row\.label/);
  assert.match(failSrc, /onRetry/);
  assert.match(failSrc, /retryLabel/);
  assert.match(failSrc, /scoreLabel/);
  assert.doesNotMatch(failSrc, /correctAnswers|pass threshold/i);
});

test("AssessmentPassState shows score/XP, max 3 capabilities, collapsed takeaways", () => {
  assert.match(passSrc, /scoreLabel/);
  assert.match(passSrc, /xpLabel/);
  assert.match(passSrc, /\.slice\(0,\s*3\)/);
  assert.match(passSrc, /<details/);
  assert.match(passSrc, /reviewTakeawaysLabel/);
  assert.match(passSrc, /keyPrinciple/);
  assert.match(passSrc, /dashboardPath/);
  assert.doesNotMatch(passSrc, /\+150 XP|7\/7/);
  assert.equal(LM03_ASSESSMENT_COPY.en.passCapabilities.length, 3);
  assert.equal(LM03_ASSESSMENT_COPY.gr.passCapabilities.length, 3);
  assert.equal(
    LM03_ASSESSMENT_COPY.en.keyPrinciple,
    "Blockchain justified ≠ every blockchain platform is suitable."
  );
  assert.equal(
    LM03_ASSESSMENT_COPY.gr.keyPrinciple,
    "Το ότι το blockchain δικαιολογείται ≠ κάθε blockchain πλατφόρμα είναι κατάλληλη."
  );
});

test("AssessmentPassState supports compact revisit remediation when imperfect pass", () => {
  assert.match(passSrc, /revisitTitle/);
  assert.match(passSrc, /revisitRows/);
  assert.match(passSrc, /data-assessment-revisit/);
  assert.match(passSrc, /showRevisit/);
  assert.equal(LM03_ASSESSMENT_COPY.en.revisitOne, "One point to revisit");
  assert.equal(LM03_ASSESSMENT_COPY.en.revisitMany, "Points to revisit");
  assert.equal(LM03_ASSESSMENT_COPY.gr.revisitOne, "Ένα σημείο για επανάληψη");
  assert.equal(LM03_ASSESSMENT_COPY.gr.revisitMany, "Σημεία για επανάληψη");
  assert.match(panelSrc, /passRevisitRows/);
  assert.match(panelSrc, /revisitTitle=\{passRevisitTitle\}/);
  assert.match(panelSrc, /evaluation\?\.feedback/);
  assert.match(panelSrc, /score < total/);
  assert.doesNotMatch(panelSrc, /incorrectSelected|missedCorrect|_CORRECT/);
});

test("EN/GR chrome key parity for UX v2 presentation copy", () => {
  for (const key of CHROME_KEYS) {
    assert.ok(key in LM03_ASSESSMENT_COPY.en, `en missing ${key}`);
    assert.ok(key in LM03_ASSESSMENT_COPY.gr, `gr missing ${key}`);
  }
  assert.deepEqual(
    Object.keys(LM03_ASSESSMENT_COPY.en.questions),
    Object.keys(LM03_ASSESSMENT_COPY.gr.questions)
  );
  assert.deepEqual(
    Object.keys(LM03_POST_PASS_RATIONALES.en),
    Object.keys(LM03_POST_PASS_RATIONALES.gr)
  );
});

test("LM03 panel wires shared primitives without shared grading panel", () => {
  assert.match(panelSrc, /AssessmentMetaStrip/);
  assert.match(panelSrc, /AssessmentQuestionHeader/);
  assert.match(panelSrc, /AssessmentChoiceList/);
  assert.match(panelSrc, /AssessmentFailState/);
  assert.match(panelSrc, /AssessmentPassState/);
  assert.match(panelSrc, /postLm03AssessmentAnswers/);
  assert.match(panelSrc, /fetchLm03AssessmentChallenge/);
  assert.match(panelSrc, /handleTryAgain/);
  assert.match(panelSrc, /buildShuffledOptionOrders/);
  assert.doesNotMatch(panelSrc, /Before you begin|introBody|responseModeHint/);
  assert.doesNotMatch(panelSrc, /SharedAssessmentPanel|GenericAssessmentPanel/);
});

test("LM03 panel still posts answers map of canonical option ids only", () => {
  assert.match(panelSrc, /postLm03AssessmentAnswers\(\{[\s\S]*answers/);
  assert.doesNotMatch(panelSrc, /postLm03AssessmentAnswers\(\{[\s\S]*score:/);
  assert.doesNotMatch(panelSrc, /postLm03AssessmentAnswers\(\{[\s\S]*passed:/);
  assert.match(choiceSrc, /value=\{row\.canonicalId\}/);
  assert.match(choiceSrc, /onSelect\(row\.canonicalId\)/);
});

test("retry reshuffles options without clearing answers", () => {
  const fnStart = panelSrc.indexOf("const handleTryAgain");
  const fnEnd = panelSrc.indexOf("const handleSubmit", fnStart);
  const fn = panelSrc.slice(fnStart, fnEnd);
  assert.match(fn, /setSubmitResult\(null\)/);
  assert.match(fn, /buildShuffledOptionOrders/);
  assert.doesNotMatch(fn, /setAnswers\(/);
  assert.doesNotMatch(fn, /postLm03AssessmentAnswers/);
});

test("locked LM03 question wording is unchanged", () => {
  assert.equal(
    LM03_ASSESSMENT_COPY.en.questions.lm03_q1_architectural_dimensions.prompt,
    "Which statements correctly distinguish architectural dimensions of a blockchain system?"
  );
  assert.match(
    LM03_ASSESSMENT_COPY.en.questions.lm03_q4_platform_fit.options.B,
    /blockchain justification and platform suitability are separate decisions/i
  );
  assert.equal(Object.keys(LM03_POST_PASS_RATIONALES.en).length, 7);
});
