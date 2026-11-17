/**
 * LM03 Interactive Chapter contracts.
 * Run: node --test src/pages/learning-modules/Lm03Page.node-test.js
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm03ChapterCopy } from "../../content/lm03ChapterLocale.js";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import {
  getLmActivityVisualSrc,
  getLmChapterRoute,
  getLmModuleVisuals,
  getLmVisibleActivities,
  isLmChapterAvailable,
  resolveLmActivityHref,
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM01_VISUALS,
  LM03_PRESENTATION_PDF_URL_EN,
  LM03_PRESENTATION_PDF_URL_GR,
  LM03_VISUALS,
  LM_PRESENTATION_REGISTRY,
} from "../../content/lmRegistry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(__dirname, "../../../public");
const pageSrc = readFileSync(join(__dirname, "Lm03Page.jsx"), "utf8");
const panelSrc = readFileSync(
  join(__dirname, "../../components/learning-modules/Lm03ConceptPanel.jsx"),
  "utf8"
);
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);

test("routeTable registers LM03 EN/GR chapter routes", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm03"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm03"/);
  assert.match(routesSrc, /Lm03Page/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm03\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm03\/assessment"/);
  assert.match(routesSrc, /Lm03AssessmentPage/);
  assert.equal(isLmChapterAvailable("LM03"), true);
  assert.equal(getLmChapterRoute("LM03", "en"), "/learning-modules/lm03");
  assert.equal(getLmChapterRoute("LM03", "gr"), "/learning-modules-gr/lm03");
});

test("Lm03Page uses Learning Path disclosures with live assessment link", () => {
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmProgressSidebar/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /Lm03ConceptPanel/);
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /getLmPageViewState\(progression, locale, "LM03"\)/);
  assert.doesNotMatch(pageSrc, /evidenceId/);
  const outcomesAt = pageSrc.indexOf("lm03-outcomes-title");
  const pathAt = pageSrc.indexOf("<LmLearningPath");
  assert.ok(outcomesAt > 0 && pathAt > outcomesAt);
});

test("LM03 keeps seven locked learning outcomes and bilingual transition", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM03;
  assert.equal(mod.learningOutcomes.en.length, 7);
  assert.equal(mod.learningOutcomes.gr.length, 7);
  assert.match(mod.transition.from.en, /Blockchain is justified here/i);
  assert.match(mod.transition.to.en, /fit or rejection/i);
  assert.ok(mod.transition.from.gr);
  assert.ok(mod.transition.to.gr);
  assert.equal(mod.learnerMeta.assessmentXp, 150);
});

test("LM03 Learning Path has eight visible steps in reasoning order", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  for (const lang of ["en", "gr"]) {
    const visible = getLmVisibleActivities("LM03", lang);
    assert.equal(visible.length, 8);
    assert.equal(visible[0].id, "lm03-slides");
    assert.equal(visible[0].visualType, "visualLesson");
    assert.equal(visible[0].presentationOnly, true);
    assert.equal(visible[0].evidenceId, undefined);
    assert.equal(visible[1].id, "lm03-separate-dimensions");
    assert.equal(visible[2].visualType, "book");
    assert.equal(visible[3].id, "lm03-requirements-to-characteristics");
    assert.equal(visible[4].id, "lm03-platform-comparison");
    assert.equal(visible[5].id, "lm03-platform-fit-challenge");
    assert.equal(visible[6].id, "lm03-foodtrace-revisited");
    assert.equal(visible[7].id, "lm03-assessment");

    assert.equal(visible[1].expandable, true);
    assert.equal(visible[3].expandable, true);
    assert.equal(visible[4].expandable, true);
    assert.equal(visible[4].visualType, "observation");
    assert.equal(visible[4].requirementHint, "optional");
    assert.equal(visible[5].expandable, true);
    assert.equal(visible[5].visualType, "observation");
    assert.equal(visible[5].requirementHint, "optional");
    assert.equal(visible[5].presentationOnly, true);
    assert.equal(visible[5].evidenceId, undefined);
    assert.equal(visible[6].expandable, true);
    assert.equal(visible[7].linkKind, "internal");
    assert.deepEqual(visible[7].href, {
      en: "/learning-modules/lm03/assessment",
      gr: "/learning-modules-gr/lm03/assessment",
    });
    assert.equal(visible[7].presentationOnly, false);
    assert.equal(visible[7].evidenceId, "lm03-assessment");

    const view = getLmPageViewState(null, lang, "LM03");
    const slides = view.activities.find((a) => a.id === "lm03-slides");
    const dims = view.activities.find((a) => a.id === "lm03-separate-dimensions");
    const canvas = view.activities.find((a) => a.id === "lm03-platform-comparison");
    const fitChallenge = view.activities.find(
      (a) => a.id === "lm03-platform-fit-challenge"
    );
    const assessment = view.activities.find((a) => a.id === "lm03-assessment");
    assert.equal(slides.visualSrc, LM03_VISUALS.visualLesson);
    assert.equal(dims.disclosure, true);
    assert.equal(canvas.disclosure, true);
    assert.equal(canvas.statusKind, "optional");
    assert.match(canvas.description, /0 XP/i);
    assert.equal(fitChallenge.disclosure, true);
    assert.equal(fitChallenge.statusKind, "optional");
    assert.equal(fitChallenge.evidenceId, null);
    assert.equal(fitChallenge.presentationOnly, true);
    assert.match(fitChallenge.description, /0 XP/i);
    assert.equal(
      assessment.href,
      lang === "gr"
        ? "/learning-modules-gr/lm03/assessment"
        : "/learning-modules/lm03/assessment"
    );
    assert.equal(
      assessment.ctaLabel,
      lang === "gr" ? "Μετάβαση στην αξιολόγηση" : "Go to assessment"
    );
    assert.equal(assessment.statusLabel, lang === "gr" ? "Υποχρεωτικό" : "Required");
    assert.equal(view.closingCta.route, assessment.href);
    assert.ok(view.closingCta.ctaLabel);
    assert.match(view.closingCta.body, /LM03 Assessment|Αξιολόγηση LM03/);
  }
});

test("LM03 Visual Lesson links EN PDF and keeps GR without active PDF link", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  const slides = LM_PRESENTATION_REGISTRY.LM03.activities.find(
    (a) => a.id === "lm03-slides"
  );
  assert.ok(slides);
  assert.equal(slides.linkKind, "external");
  assert.deepEqual(slides.href, {
    en: LM03_PRESENTATION_PDF_URL_EN,
    gr: null,
  });
  assert.equal(resolveLmActivityHref(slides, "en"), LM03_PRESENTATION_PDF_URL_EN);
  assert.equal(resolveLmActivityHref(slides, "gr"), null);
  assert.equal(
    existsSync(join(publicRoot, LM03_PRESENTATION_PDF_URL_EN.slice(1))),
    true
  );
  assert.equal(
    existsSync(join(publicRoot, LM03_PRESENTATION_PDF_URL_GR.slice(1))),
    false
  );

  const enView = getLmPageViewState(null, "en", "LM03");
  const grView = getLmPageViewState(null, "gr", "LM03");
  const enSlides = enView.activities.find((a) => a.id === "lm03-slides");
  const grSlides = grView.activities.find((a) => a.id === "lm03-slides");
  assert.equal(enSlides.href, LM03_PRESENTATION_PDF_URL_EN);
  assert.equal(enSlides.ctaLabel, "Open resource");
  assert.equal(grSlides.href, null);
  assert.equal(grSlides.statusKind, "coming_soon");
  assert.equal(grSlides.ctaLabel, "Σύντομα");
  assert.notEqual(grSlides.href, LM03_PRESENTATION_PDF_URL_EN);
});

test("LM03 Kallipos reading is Recommended §1.4–§1.4.4 with pedagogical caveat", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  for (const lang of ["en", "gr"]) {
    const view = getLmPageViewState(null, lang, "LM03");
    const kallipos = view.activities.find((a) => a.visualType === "book");
    assert.ok(kallipos, lang);
    assert.equal(kallipos.requirementHint, "recommended");
    assert.equal(kallipos.statusKind, "recommended");
    assert.equal(
      kallipos.statusLabel,
      lang === "gr" ? "Προτεινόμενο" : "Recommended"
    );
    assert.equal(kallipos.presentationOnly, true);
    assert.equal(kallipos.evidenceId, null);
    assert.equal(kallipos.href, LM01_KALLIPOS_TEXTBOOK_URL);
    assert.match(kallipos.description, /§1\.4/);
    assert.match(kallipos.description, /23–28|23-28/);
    assert.match(kallipos.description, /Web3Edu/);
  }
  assert.doesNotMatch(
    LM_PRESENTATION_REGISTRY.LM03.activities
      .filter((a) => a.visualType === "book")
      .map((a) => a.description.en)
      .join("\n"),
    /Chapter 2|§2\./i
  );
});

test("LM03 concept panels teach dimension separation and FoodTrace application", () => {
  for (const lang of ["en", "gr"]) {
    const copy = getLm03ChapterCopy(lang);
    assert.equal(copy.dimensions.cards.length, 3);
    assert.match(copy.dimensions.ruleBody, /≠/);
    assert.match(copy.requirements.keyLesson, /Ethereum|Besu|πλατφόρμα/i);
    assert.match(copy.canvas.practiceBadge, /0 XP/);
    assert.equal(copy.canvas.verdictOptions.length, 3);
    assert.ok(copy.canvas.checkReasoningLabel);
    assert.ok(copy.canvas.reasoningFeedback.misfit);
    assert.ok(copy.canvas.reasoningFeedback.fit);
    assert.ok(copy.canvas.reasoningFeedback.insufficient);
    assert.match(copy.fitChallenge.practiceBadge, /0 XP/);
    assert.equal(copy.fitChallenge.answerOptions.length, 3);
    assert.ok(copy.fitChallenge.verdictLabel);
    assert.ok(copy.fitChallenge.feedbackHeading);
    assert.ok(copy.fitChallenge.reasoningFeedback.fit);
    assert.ok(copy.fitChallenge.reasoningFeedback.misfit);
    assert.ok(copy.fitChallenge.reasoningFeedback.needMoreInfo);
    assert.match(copy.fitChallenge.distinctionNote, /unsuitable|ακατάλληλη/i);
    assert.equal(copy.foodTrace.prompts.length, 6);
    assert.match(copy.foodTrace.bridge, /FoodTrace/i);
    assert.equal(copy.foodTrace.validOutcomes.length, 3);
    assert.match(
      copy.foodTrace.validOutcomesIntro,
      lang === "gr"
        ? /πιθανά συμπεράσματα.*όχι επιλογές απάντησης/
        : /possible reasoning outcomes, not answers to select/
    );
  }
  assert.match(panelSrc, /data-lm03-panel="dimensions"/);
  assert.match(panelSrc, /data-lm03-panel="requirements"/);
  assert.match(panelSrc, /data-lm03-panel="canvas"/);
  assert.match(panelSrc, /data-lm03-panel="fit-challenge"/);
  assert.match(panelSrc, /data-lm03-panel="foodtrace"/);
  assert.match(panelSrc, /validOutcomesIntro/);
  assert.match(panelSrc, /text-left/);
  assert.doesNotMatch(
    panelSrc.slice(panelSrc.indexOf('data-lm03-panel="foodtrace"')),
    /role="radio"|aria-checked|onClick|useState/
  );
  assert.match(pageSrc, /lm03-platform-fit-challenge/);
  assert.doesNotMatch(panelSrc, /fetch\(|localStorage|evidenceId|awardXp/i);
  assert.doesNotMatch(panelSrc, /lm03_q[0-9]/i);
});

test("LM03 shared visuals exist and assessment is live", () => {
  const visuals = getLmModuleVisuals("LM03");
  assert.equal(visuals.hero, LM03_VISUALS.hero);
  assert.equal(visuals.card, LM03_VISUALS.card);
  assert.notEqual(visuals.card, visuals.hero);
  assert.equal(
    visuals.activityById["lm03-separate-dimensions"],
    LM03_VISUALS.architecturalDimensions
  );
  assert.equal(
    visuals.activityById["lm03-requirements-to-characteristics"],
    LM03_VISUALS.requirementsToCharacteristics
  );
  assert.equal(
    visuals.activityById["lm03-foodtrace-revisited"],
    LM03_VISUALS.foodtraceRevisited
  );
  assert.equal(visuals.activityById["lm03-slides"], LM03_VISUALS.visualLesson);
  assert.equal(
    getLmActivityVisualSrc("LM03", "visualLesson", "lm03-slides"),
    LM03_VISUALS.visualLesson
  );
  assert.equal(
    getLmActivityVisualSrc("LM03", "concept", "lm03-separate-dimensions"),
    LM03_VISUALS.architecturalDimensions
  );
  assert.equal(
    getLmActivityVisualSrc(
      "LM03",
      "concept",
      "lm03-requirements-to-characteristics"
    ),
    LM03_VISUALS.requirementsToCharacteristics
  );
  assert.equal(
    getLmActivityVisualSrc("LM03", "concept", "lm03-foodtrace-revisited"),
    LM03_VISUALS.foodtraceRevisited
  );
  assert.equal(getLmActivityVisualSrc("LM03", "observation"), LM01_VISUALS.demo);
  assert.equal(getLmActivityVisualSrc("LM03", "book"), LM01_VISUALS.book);
  assert.equal(getLmActivityVisualSrc("LM03", "assessment"), LM01_VISUALS.assessment);
  assert.equal(existsSync(join(publicRoot, LM03_VISUALS.hero.slice(1))), true);
  assert.equal(existsSync(join(publicRoot, LM03_VISUALS.card.slice(1))), true);
  assert.equal(
    existsSync(join(publicRoot, LM03_VISUALS.architecturalDimensions.slice(1))),
    true
  );
  assert.equal(
    existsSync(
      join(publicRoot, LM03_VISUALS.requirementsToCharacteristics.slice(1))
    ),
    true
  );
  assert.equal(
    existsSync(join(publicRoot, LM03_VISUALS.foodtraceRevisited.slice(1))),
    true
  );

  const assessment = LM_PRESENTATION_REGISTRY.LM03.activities.find(
    (a) => a.id === "lm03-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.evidenceId, "lm03-assessment");
  assert.match(assessment.description.en, /7 questions/i);
  assert.doesNotMatch(assessment.description.en, /not open yet/i);
});

test("LM03 required evidence is assessment-only with no platform-decision", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  const progression = {
    earnedTier: "explorer",
    computedTier: "explorer",
    currentModule: "LM03",
    currentPath: { targetTier: "explorer", alignmentStatus: "current_curriculum_path" },
    nextAction: {
      type: "assessment",
      moduleId: "LM03",
      assessmentId: "lm03-assessment",
    },
    nextRequiredEvidence: null,
    modules: {
      LM03: {
        complete: false,
        requiredEvidenceSatisfied: true,
        requiredEvidence: {},
        missingEvidence: [],
        assessment: {
          id: "lm03-assessment",
          required: true,
          passed: false,
        },
      },
    },
  };
  for (const lang of ["en", "gr"]) {
    const view = getLmPageViewState(progression, lang, "LM03");
    assert.equal(view.requiredEvidenceItems.length, 1);
    assert.equal(view.requiredEvidenceItems[0].kind, "assessment");
    assert.equal(view.requiredEvidenceItems[0].evidenceId, "lm03-assessment");
    assert.equal(
      view.requiredEvidenceItems.some((i) => i.evidenceId === "lm03-platform-decision"),
      false
    );
    const canvas = view.activities.find((a) => a.id === "lm03-platform-comparison");
    const fitChallenge = view.activities.find(
      (a) => a.id === "lm03-platform-fit-challenge"
    );
    const food = view.activities.find((a) => a.id === "lm03-foodtrace-revisited");
    const slides = view.activities.find((a) => a.id === "lm03-slides");
    assert.equal(canvas.evidenceId, null);
    assert.equal(canvas.presentationOnly, true);
    assert.equal(fitChallenge.evidenceId, null);
    assert.equal(fitChallenge.presentationOnly, true);
    assert.equal(food.evidenceId, null);
    assert.equal(food.presentationOnly, true);
    assert.equal(slides.evidenceId, null);
    assert.equal(slides.presentationOnly, true);
  }
});

test("LM03 page chrome overrides exist for live assessment", () => {
  const en = getLmPageCopy("en", "LM03");
  const gr = getLmPageCopy("gr", "LM03");
  assert.match(en.loading, /LM03/);
  assert.match(gr.loading, /LM03/);
  assert.equal(en.typeLabels.observation, "GUIDED ACTIVITY");
  assert.equal(gr.typeLabels.observation, "ΚΑΘΟΔΗΓΟΥΜΕΝΗ");
  assert.match(en.closingNextBody, /Complete the LM03 Assessment/i);
  assert.match(gr.closingNextBody, /Ολοκλήρωσε την Αξιολόγηση LM03/);
  assert.doesNotMatch(en.closingNextBody, /not open yet/i);
  assert.match(en.learningPathIntro, /Visual Lesson/);
  assert.match(en.learningPathIntro, /FoodTrace/);
  assert.match(gr.learningPathIntro, /Παρουσίαση/);
  assert.match(gr.learningPathIntro, /FoodTrace/);
  assert.match(en.activityMixValue, /fit challenge/i);
  assert.match(gr.activityMixValue, /πρόκληση καταλληλότητας/i);
});
