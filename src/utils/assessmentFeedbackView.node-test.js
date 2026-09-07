/**
 * Assessment failure feedback labeling helpers.
 * Run: node --test src/utils/assessmentFeedbackView.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import { LM01_ASSESSMENT_COPY } from "../content/lm01AssessmentLocale.js";
import { LM02_ASSESSMENT_COPY } from "../content/lm02AssessmentLocale.js";
import { LM08_ASSESSMENT_COPY } from "../content/lm08AssessmentLocale.js";
import {
  buildAssessmentFeedbackRows,
  formatAssessmentFeedbackQuestionLabel,
  questionNumberFromCanonicalOrder,
} from "./assessmentFeedbackView.js";

const LM02_ORDER = [
  "lm02_q1_when_consider_blockchain",
  "lm02_q2_trusted_authority",
  "lm02_q3_no_trusted_authority",
  "lm02_q4_integrity_vs_truth",
  "lm02_q5_foodtrace_first_decision",
  "lm02_q6_foodtrace_what_to_know",
  "lm02_q7_foodtrace_decide",
];

test("only incorrect questionIds produce labeled remediation rows", () => {
  const feedback = [
    { questionId: "lm02_q2_trusted_authority", hint: "Hint for Q2" },
    { questionId: "lm02_q7_foodtrace_decide", hint: "Hint for Q7" },
  ];
  const rows = buildAssessmentFeedbackRows(
    feedback,
    LM02_ASSESSMENT_COPY.en,
    LM02_ORDER
  );
  assert.equal(rows.length, 2);
  assert.deepEqual(
    rows.map((r) => r.label),
    [
      "Q2 — Trusted authority",
      "Q7 — Decide with the new requirements",
    ]
  );
  assert.equal(rows.some((r) => r.label.includes("Q1")), false);
  assert.equal(rows.some((r) => r.label.includes("Q3")), false);
});

test("canonical order numbering is stable regardless of option shuffle", () => {
  assert.equal(
    questionNumberFromCanonicalOrder("lm02_q5_foodtrace_first_decision", LM02_ORDER),
    5
  );
  assert.equal(
    formatAssessmentFeedbackQuestionLabel({
      number: 5,
      title: "Make the first decision",
    }),
    "Q5 — Make the first decision"
  );
});

test("EN/GR labels use localized titles and feedback titles", () => {
  const qid = "lm02_q2_trusted_authority";
  const enRows = buildAssessmentFeedbackRows(
    [{ questionId: qid, hint: "EN hint" }],
    LM02_ASSESSMENT_COPY.en,
    LM02_ORDER
  );
  const grRows = buildAssessmentFeedbackRows(
    [{ questionId: qid, hint: "GR hint" }],
    LM02_ASSESSMENT_COPY.gr,
    LM02_ORDER
  );
  assert.equal(enRows[0].label, "Q2 — Trusted authority");
  assert.equal(grRows[0].label, "Q2 — Έμπιστη αρχή");
  assert.equal(enRows[0].hint, "EN hint");
  assert.equal(grRows[0].hint, "GR hint");
  assert.equal(LM01_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM01_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
  assert.equal(LM02_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM02_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
  assert.equal(LM08_ASSESSMENT_COPY.en.feedbackTitle, "Review these questions");
  assert.equal(LM08_ASSESSMENT_COPY.gr.feedbackTitle, "Ξαναδές αυτές τις ερωτήσεις");
});

test("feedback rows do not include option letters or answer keys", () => {
  const rows = buildAssessmentFeedbackRows(
    [
      {
        questionId: "lm02_q4_integrity_vs_truth",
        hint: "Review integrity versus real-world truth.",
      },
    ],
    LM02_ASSESSMENT_COPY.en,
    LM02_ORDER
  );
  const blob = JSON.stringify(rows);
  assert.doesNotMatch(blob, /\[CORRECT\]|correctAnswers|OPTION_[A-E]|answer key/i);
  assert.doesNotMatch(rows[0].label, /\b[A-E]\./);
  assert.doesNotMatch(rows[0].hint, /\bOption [A-E]\b/);
});

test("LM01 and LM08 headings map to Q numbers", () => {
  const lm01Order = [
    "lm01_q1_distribute_ledger",
    "lm01_q2_hash_linkage",
    "lm01_q3_not_guaranteed",
    "lm01_q4_network_model",
    "lm01_q5_blockchain_crypto",
    "lm01_q6_foodtrace_consider",
    "lm01_q7_university_inventory",
  ];
  const lm01 = buildAssessmentFeedbackRows(
    [{ questionId: "lm01_q4_network_model", hint: "Review network models." }],
    LM01_ASSESSMENT_COPY.en,
    lm01Order
  );
  assert.equal(lm01[0].label, "Q4 — Network models");

  const lm08Order = [
    "lm08_q1_deployment_lifecycle",
    "lm08_q2_contract_instance",
    "lm08_q3_reading_state",
    "lm08_q4_changing_state",
    "lm08_q5_contract_inspection",
    "lm08_q6_source_verification",
    "lm08_q7_verification_limits",
  ];
  const lm08 = buildAssessmentFeedbackRows(
    [{ questionId: "lm08_q7_verification_limits", hint: "Review limits." }],
    LM08_ASSESSMENT_COPY.gr,
    lm08Order
  );
  assert.equal(lm08[0].label, "Q7 — Όρια επαλήθευσης");
});
