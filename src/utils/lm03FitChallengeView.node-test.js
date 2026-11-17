/**
 * LM03 Platform Fit Challenge formative feedback contracts.
 * Run: node --test src/utils/lm03FitChallengeView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm03ChapterCopy } from "../content/lm03ChapterLocale.js";
import {
  lm03FitChallengeFeedbackTone,
  resolveLm03FitChallengeFeedback,
} from "./lm03FitChallengeView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(
  join(__dirname, "../components/learning-modules/Lm03ConceptPanel.jsx"),
  "utf8"
);
const viewSrc = readFileSync(join(__dirname, "lm03FitChallengeView.js"), "utf8");
const localeSrc = readFileSync(
  join(__dirname, "../content/lm03ChapterLocale.js"),
  "utf8"
);

test("no fit-challenge feedback until submit — helper returns null without answer", () => {
  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.equal(
      resolveLm03FitChallengeFeedback(copy.fitChallenge.reasoningFeedback, ""),
      null
    );
    assert.equal(
      resolveLm03FitChallengeFeedback(copy.fitChallenge.reasoningFeedback, null),
      null
    );
  }
  assert.match(panelSrc, /feedbackVisible/);
  assert.match(panelSrc, /data-lm03-fit-challenge-submit/);
  assert.match(panelSrc, /setFeedbackVisible\(false\)/);
});

test("each fit-challenge answer maps to the required formative feedback EN/GR", () => {
  const expected = {
    en: {
      fit: "Not enough evidence yet. A permissioned network may support controlled issuance",
      misfit: "Rejection is premature. A permissioned blockchain could satisfy the requirements",
      needMoreInfo:
        "Correct. The proposed network is a plausible candidate, but we need additional information",
    },
    gr: {
      fit: "Δεν υπάρχουν ακόμη αρκετά στοιχεία. Ένα permissioned δίκτυο μπορεί να υποστηρίζει ελεγχόμενη έκδοση",
      misfit: "Η απόρριψη είναι πρόωρη. Ένα permissioned blockchain θα μπορούσε να ικανοποιήσει τις απαιτήσεις",
      needMoreInfo:
        "Σωστά. Το προτεινόμενο δίκτυο είναι εύλογος υποψήφιος, αλλά χρειαζόμαστε πρόσθετες πληροφορίες",
    },
  };

  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.equal(
      copy.fitChallenge.submitLabel,
      lang === "gr" ? "Υποβολή απάντησης" : "Submit answer"
    );
    assert.equal(copy.fitChallenge.answerOptions.length, 3);
    assert.deepEqual(
      copy.fitChallenge.answerOptions.map((o) => o.id),
      ["fit", "misfit", "needMoreInfo"]
    );
    for (const id of ["fit", "misfit", "needMoreInfo"]) {
      const text = resolveLm03FitChallengeFeedback(
        copy.fitChallenge.reasoningFeedback,
        id
      );
      assert.ok(text);
      assert.match(
        text,
        new RegExp(expected[lang][id].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      );
    }
    assert.equal(lm03FitChallengeFeedbackTone("needMoreInfo"), "aligned");
    assert.equal(lm03FitChallengeFeedbackTone("fit"), "reconsider");
    assert.equal(lm03FitChallengeFeedbackTone("misfit"), "reconsider");
  }
});

test("fit challenge stays presentation-only with retry and no assessment ids", () => {
  assert.match(panelSrc, /data-lm03-panel="fit-challenge"/);
  assert.match(panelSrc, /Try again|resetLabel/);
  assert.match(panelSrc, /focus-visible:ring-2/);
  assert.match(panelSrc, /feedbackHeading/);
  assert.match(panelSrc, /aria-live="polite"/);
  assert.doesNotMatch(panelSrc, /fetch\(|localStorage|evidenceId|awardXp/i);
  assert.doesNotMatch(panelSrc, /lm03_q[0-9]/i);
  assert.doesNotMatch(viewSrc, /fetch\(|localStorage|evidenceId|awardXp/i);
  assert.match(localeSrc, /fitChallenge/);
  assert.match(localeSrc, /feedbackStatusAligned/);
  assert.match(localeSrc, /feedbackStatusReconsider/);
  assert.match(
    localeSrc,
    /NEED MORE INFO does not mean the architecture is unsuitable/
  );
  assert.match(
    localeSrc,
    /ΧΡΕΙΑΖΟΝΤΑΙ ΠΕΡΙΣΣΟΤΕΡΕΣ ΠΛΗΡΟΦΟΡΙΕΣ» δεν σημαίνει ότι η αρχιτεκτονική είναι ακατάλληλη/
  );
  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.ok(copy.fitChallenge.verdictLabel);
    assert.ok(copy.fitChallenge.feedbackHeading);
    assert.ok(copy.fitChallenge.feedbackStatusAligned);
    assert.ok(copy.fitChallenge.feedbackStatusReconsider);
  }
});
