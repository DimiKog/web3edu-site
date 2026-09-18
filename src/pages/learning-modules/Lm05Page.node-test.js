/**
 * LM05 Interactive Chapter + Assessment contracts.
 * Run: node --test src/pages/learning-modules/Lm05Page.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm05ChapterCopy } from "../../content/lm05ChapterLocale.js";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import {
  getLmChapterRoute,
  getLmVisibleActivities,
  isLmChapterAvailable,
  LM_PRESENTATION_REGISTRY,
} from "../../content/lmRegistry.js";
import {
  ASSESSMENT_ROUTES,
  UNAVAILABLE_EVIDENCE_IDS,
  resolveProgressionActionTarget,
} from "../../utils/progressionActionMapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageSrc = readFileSync(join(__dirname, "Lm05Page.jsx"), "utf8");
const panelSrc = readFileSync(
  join(__dirname, "../../components/learning-modules/Lm05ConceptPanel.jsx"),
  "utf8"
);
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);

test("routeTable registers LM05 EN/GR chapter and assessment routes", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm05"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm05"/);
  assert.match(routesSrc, /Lm05Page/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm05\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm05\/assessment"/);
  assert.match(routesSrc, /Lm05AssessmentPage/);
  assert.equal(isLmChapterAvailable("LM05"), true);
  assert.equal(getLmChapterRoute("LM05", "en"), "/learning-modules/lm05");
  assert.equal(getLmChapterRoute("LM05", "gr"), "/learning-modules-gr/lm05");
});

test("Lm05Page uses Learning Path disclosures and LM05 view state", () => {
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmProgressSidebar/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /Lm05ConceptPanel/);
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /getLmPageViewState\(progression, locale, "LM05"\)/);
  assert.doesNotMatch(pageSrc, /evidenceId/);
  assert.doesNotMatch(pageSrc, /view\.closingCta\s*=/);
  const outcomesAt = pageSrc.indexOf("lm05-outcomes-title");
  const pathAt = pageSrc.indexOf("<LmLearningPath");
  assert.ok(outcomesAt > 0 && pathAt > outcomesAt);
});

test("LM05 keeps five bilingual learning outcomes and pedagogical transition", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM05;
  assert.equal(mod.learningOutcomes.en.length, 5);
  assert.equal(mod.learningOutcomes.gr.length, 5);
  assert.equal(mod.transition.from.en, "Understands keys, wallets and identity");
  assert.match(mod.transition.to.en, /transactions, state and lifecycle/i);
  assert.ok(mod.transition.from.gr);
  assert.ok(mod.transition.to.gr);
  assert.equal(mod.learnerMeta.assessmentXp, 200);
});

test("LM05 Learning Path exposes labs + live assessment; PEL stays unavailable", async () => {
  const { getLmPageViewState, getLmActivityRowPresentation } = await import(
    "../../utils/lmModuleView.js"
  );

  for (const lang of ["en", "gr"]) {
    const copy = getLmPageCopy(lang, "LM05");
    const visible = getLmVisibleActivities("LM05", lang);
    assert.equal(visible.length, 6);
    assert.equal(visible[0].id, "lm05-interactive-chapter");
    assert.equal(visible[2].evidenceId, "lab04");
    assert.equal(visible[3].evidenceId, "lab05");
    assert.equal(visible[4].evidenceId, "lm05-pel-transaction");
    assert.equal(visible[5].evidenceId, "lm05-assessment");

    const view = getLmPageViewState(null, lang, "LM05");
    assert.equal(view.mode, "ready");
    assert.equal(view.activities.length, 6);

    const lab04 = getLmActivityRowPresentation(visible[2], null, lang, {
      moduleId: "LM05",
    });
    assert.ok(lab04.href);
    assert.match(lab04.href, /lab04/);

    const pel = getLmActivityRowPresentation(visible[4], null, lang, {
      moduleId: "LM05",
    });
    assert.equal(pel.href, null);
    assert.equal(pel.statusKind, "coming_soon");
    assert.equal(pel.statusLabel, copy.comingSoon);
    assert.equal(pel.ctaLabel, copy.comingSoon);
    assert.equal(pel.typeLabel, copy.typeLabels.observation);
    assert.notEqual(pel.statusLabel, copy.resourceAvailable);

    const assessment = getLmActivityRowPresentation(visible[5], null, lang, {
      moduleId: "LM05",
    });
    assert.equal(
      assessment.href,
      lang === "gr"
        ? "/learning-modules-gr/lm05/assessment"
        : "/learning-modules/lm05/assessment"
    );
    assert.equal(assessment.statusKind, "assessment_required");
    assert.equal(assessment.statusLabel, copy.assessmentRequired);
    assert.equal(assessment.ctaLabel, copy.openAssessment);
  }
});

test("lm05-pel-transaction stays unavailable; assessment is ready in progression mapper", () => {
  assert.equal(UNAVAILABLE_EVIDENCE_IDS.has("lm05-pel-transaction"), true);
  assert.equal(ASSESSMENT_ROUTES.en["lm05-assessment"], "/learning-modules/lm05/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm05-assessment"],
    "/learning-modules-gr/lm05/assessment"
  );

  const pel = resolveProgressionActionTarget({
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM05",
      evidenceId: "lm05-pel-transaction",
    },
    lang: "en",
  });
  assert.equal(pel.status, "unavailable");
  assert.equal(pel.route, null);
  assert.match(pel.label, /Educational Ledger Contribution/i);

  const pelGr = resolveProgressionActionTarget({
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM05",
      evidenceId: "lm05-pel-transaction",
    },
    lang: "gr",
  });
  assert.match(pelGr.label, /Εκπαιδευτικό Ledger/);

  const assessment = resolveProgressionActionTarget({
    nextAction: {
      type: "assessment",
      moduleId: "LM05",
      assessmentId: "lm05-assessment",
    },
    lang: "en",
  });
  assert.equal(assessment.status, "ready");
  assert.equal(assessment.route, "/learning-modules/lm05/assessment");
});

test("assessment pass alone does not imply LM05 completion in local view", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");

  const progression = {
    earnedTier: "explorer",
    modules: {
      LM05: {
        id: "LM05",
        complete: false,
        requiredEvidenceSatisfied: false,
        assessment: {
          id: "lm05-assessment",
          passed: true,
          required: true,
        },
        requiredEvidence: {
          lab04: { satisfied: true },
          lab05: { satisfied: true },
          "lm05-pel-transaction": { satisfied: false },
        },
      },
    },
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM05",
      evidenceId: "lm05-pel-transaction",
    },
  };

  const view = getLmPageViewState(progression, "en", "LM05");
  assert.equal(view.complete, false);
  assert.equal(view.assessment.passed, true);
  assert.equal(view.assessment.route, "/learning-modules/lm05/assessment");
  const pelItem = view.requiredEvidenceItems.find(
    (item) => item.evidenceId === "lm05-pel-transaction"
  );
  assert.equal(pelItem?.satisfied, false);
});

test("LM05 chapter copy is bilingual with four sections and state diagram", () => {
  for (const lang of ["en", "gr"]) {
    const copy = getLm05ChapterCopy(lang);
    assert.ok(copy.title);
    assert.ok(copy.openingQuestion);
    assert.equal(copy.sections.length, 4);
    assert.equal(copy.spineSteps.length, 5);
    assert.deepEqual(copy.spineSteps, [
      "Intent",
      "Transaction",
      "Successful Execution",
      "State Transition",
      "Shared State",
    ]);
    assert.ok(copy.stateDiagram.s0Title);
    assert.ok(copy.stateDiagram.s1Title);
    assert.ok(copy.readWrite.readTitle);
    assert.ok(copy.sections[3].bridgeQuestion);
  }
  const en = getLm05ChapterCopy("en");
  const gr = getLm05ChapterCopy("gr");
  assert.match(en.openingQuestion, /prove control of an address/i);
  assert.match(gr.openingQuestion, /ελέγχεις μια διεύθυνση/);
  assert.match(
    en.stateDiagram.execDetail,
    /executed according to the protocol rules/i
  );
  assert.match(gr.stateDiagram.execDetail, /κανόνες του πρωτοκόλλου/);
  assert.match(
    en.sections[3].bridgeQuestion,
    /My transaction is pending\. What determines whether it becomes part of the blockchain\?/
  );
  assert.match(gr.sections[3].bridgeQuestion, /αναμονή/);
  assert.match(en.sections[3].body.join(" "), /shared ledger\/history/i);
  assert.doesNotMatch(en.sections.map((s) => s.body.join(" ")).join(" "), /does not re-teach/i);
  assert.doesNotMatch(en.sections.map((s) => s.body.join(" ")).join(" "), /This chapter stops/i);
  assert.doesNotMatch(en.sections.map((s) => s.body.join(" ")).join(" "), /Fee details are conceptual/i);
  assert.match(panelSrc, /StateTransitionDiagram|State S0/);
  assert.match(panelSrc, /bridgeQuestion/);
  assert.doesNotMatch(panelSrc, /validator|proposer|consensus|PoW|PoS/i);
});

test("LM05 closing CTA uses shared view when assessment is available", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");

  for (const lang of ["en", "gr"]) {
    const copy = getLmPageCopy(lang, "LM05");
    assert.ok(copy.closingPathTitle);
    assert.ok(copy.closingPathBody);
    assert.ok(copy.closingPathEyebrow);
    assert.equal(copy.typeLabels.observation, lang === "gr" ? "ΔΡΑΣΤΗΡΙΟΤΗΤΑ" : "ACTIVITY");
  }

  const view = getLmPageViewState(null, "en", "LM05");
  assert.equal(view.nextRequiredStep?.kind, "assessment");
  assert.equal(view.nextRequiredStep?.route, "/learning-modules/lm05/assessment");
  assert.equal(view.closingCta?.kind, "next_assessment");
  assert.equal(view.closingCta?.route, "/learning-modules/lm05/assessment");
});
