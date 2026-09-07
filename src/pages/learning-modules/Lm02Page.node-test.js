/**
 * LM02 Interactive Chapter contracts.
 * Run: node --test src/pages/learning-modules/Lm02Page.node-test.js
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { getLm02ChapterCopy } from "../../content/lm02ChapterLocale.js";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import {
  getLmActivityVisualSrc,
  getLmChapterRoute,
  getLmModuleVisuals,
  getLmVisibleActivities,
  isLmChapterAvailable,
  LM02_VISUALS,
  LM_PRESENTATION_REGISTRY,
} from "../../content/lmRegistry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(__dirname, "../../../public");
const pageSrc = readFileSync(join(__dirname, "Lm02Page.jsx"), "utf8");
const journeySrc = readFileSync(
  join(__dirname, "../../components/learning-modules/Lm02ReasoningJourney.jsx"),
  "utf8"
);
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);

test("routeTable registers LM02 EN/GR chapter routes", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm02"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm02"/);
  assert.match(routesSrc, /Lm02Page/);
  assert.equal(isLmChapterAvailable("LM02"), true);
  assert.equal(getLmChapterRoute("LM02", "en"), "/learning-modules/lm02");
  assert.equal(getLmChapterRoute("LM02", "gr"), "/learning-modules-gr/lm02");
});

test("Lm02Page uses Learning Path as primary concept surface without standalone explainer", () => {
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmProgressSidebar/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /Lm02ConceptPanel/);
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /getLmPageViewState\(progression, locale, "LM02"\)/);
  assert.doesNotMatch(pageSrc, /<Lm02ReasoningJourney/);
  assert.doesNotMatch(pageSrc, /Architecture reasoning — at a glance/);
  const outcomesAt = pageSrc.indexOf("lm02-outcomes-title");
  const pathAt = pageSrc.indexOf("<LmLearningPath");
  assert.ok(outcomesAt > 0 && pathAt > outcomesAt);
  assert.equal((pageSrc.match(/<article/g) || []).length, 0);
});

test("LM02 concept panels preserve locked concepts without five articles", () => {
  for (const lang of ["en", "gr"]) {
    const copy = getLm02ChapterCopy(lang);
    assert.equal(copy.stages, undefined);
    assert.equal(copy.sequenceLabel, undefined);
    assert.equal(copy.outcomes.length, 3);
    assert.match(copy.distributionTitle, /≠/);
    assert.ok(copy.integrityTakeaway);
    assert.ok(copy.decideQuestion);
    assert.match(copy.centralizedLabel, /Accepted central|Αποδεκτή κεντρική/i);
    assert.match(copy.sharedLabel, /Shared control required|Απαιτείται κοινός/i);
    assert.match(copy.foodTraceBridge, /FoodTrace/i);
    assert.match(copy.foodTraceBridge, /Part B|Μέρος Β/i);
    assert.equal(copy.assessmentNote, undefined);
    assert.equal(copy.sections, undefined);
  }
  assert.match(journeySrc, /panel === "architecture-choices"/);
  assert.match(journeySrc, /data-lm02-panel="trust-model"/);
  assert.match(journeySrc, /data-lm02-panel="architecture-choices"/);
  assert.doesNotMatch(journeySrc, /sequenceLabel|UNDERSTAND|stages\.map/);
  assert.doesNotMatch(journeySrc, /assessmentNote/);
  assert.doesNotMatch(journeySrc, /SectionShell/);
  assert.doesNotMatch(journeySrc, /id="lm02-reasoning"/);
});

test("LM02 keeps all six locked learning outcomes", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM02;
  assert.equal(mod.learningOutcomes.en.length, 6);
  assert.equal(mod.learningOutcomes.gr.length, 6);
});

test("LM02 Learning Path has four visible steps with two expandable CONCEPT cores", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  for (const lang of ["en", "gr"]) {
    const visible = getLmVisibleActivities("LM02", lang);
    assert.equal(visible.length, 4);
    assert.equal(visible[0].id, "lm02-understand-trust-model");
    assert.equal(visible[1].id, "lm02-compare-architecture-choices");
    assert.equal(visible[0].expandable, true);
    assert.equal(visible[1].expandable, true);
    assert.equal(visible[0].visualType, "concept");
    assert.equal(visible[1].visualType, "concept");
    assert.equal(visible[0].requirementHint, "core");
    assert.equal(visible[1].requirementHint, "core");
    assert.equal(visible[2].visualType, "book");
    assert.equal(visible[2].requirementHint, "recommended");
    assert.equal(visible[3].id, "lm02-assessment");

    const view = getLmPageViewState(null, lang, "LM02");
    const step01 = view.activities.find((a) => a.id === "lm02-understand-trust-model");
    const step02 = view.activities.find((a) => a.id === "lm02-compare-architecture-choices");
    assert.equal(step01.disclosure, true);
    assert.equal(step02.disclosure, true);
    assert.equal(step01.embed, false);
    assert.equal(step02.embed, false);
    assert.equal(step01.statusKind, "core");
    assert.equal(step02.statusKind, "core");
    assert.equal(step01.ctaLabel, lang === "gr" ? "Εξερεύνησε" : "Explore");
    assert.equal(step01.evidenceId, null);
    assert.equal(step02.evidenceId, null);
    assert.equal(step01.presentationOnly, true);
    assert.equal(step02.presentationOnly, true);
  }
  assert.match(journeySrc, /authorityTitle/);
  assert.match(journeySrc, /distributionTitle/);
  assert.match(journeySrc, /tradeoffsTitle/);
  assert.match(journeySrc, /integrityTitle/);
  assert.match(journeySrc, /foodTraceBridge/);
  assert.match(pageSrc, /panel="trust-model"/);
  assert.match(pageSrc, /panel="architecture-choices"/);
});

test("LM02 approved visuals are registered and present on disk", () => {
  const visuals = getLmModuleVisuals("LM02");
  assert.equal(visuals.hero, LM02_VISUALS.hero);
  assert.equal(visuals.activityByType.concept, LM02_VISUALS.concept);
  assert.equal(getLmActivityVisualSrc("LM02", "concept"), LM02_VISUALS.concept);
  assert.equal(existsSync(join(publicRoot, LM02_VISUALS.hero.slice(1))), true);
  assert.equal(existsSync(join(publicRoot, LM02_VISUALS.concept.slice(1))), true);
  assert.match(LM02_VISUALS.hero, /\/lm02\/lm02-hero\.png$/);
  assert.match(LM02_VISUALS.concept, /\/lm02\/lm02-concept\.png$/);
});

test("LM02 Kallipos Step 03 shows Recommended status with locked reading scope", async () => {
  const { getLmPageViewState } = await import("../../utils/lmModuleView.js");
  for (const lang of ["en", "gr"]) {
    const view = getLmPageViewState(null, lang, "LM02");
    const kallipos = view.activities.find((a) => a.visualType === "book");
    assert.ok(kallipos, lang);
    assert.equal(kallipos.requirementHint, "recommended");
    assert.equal(kallipos.statusKind, "recommended");
    assert.equal(
      kallipos.statusLabel,
      lang === "gr" ? "Προτεινόμενο" : "Recommended"
    );
    assert.equal(
      kallipos.ctaLabel,
      lang === "gr" ? "Άνοιγμα πόρου" : "Open resource"
    );
    assert.ok(kallipos.href);
    assert.equal(kallipos.linkKind, "external");
    assert.equal(kallipos.presentationOnly, true);
    assert.match(kallipos.description, /§1\.2/);
    assert.match(kallipos.description, /15–19|15-19/);
    assert.match(kallipos.description, /§1\.5/);
    assert.match(kallipos.description, /28–31|28-31/);
  }
  const enBook = LM_PRESENTATION_REGISTRY.LM02.activities.find(
    (a) => a.id === "lm02-chapter1-reading-en-ref"
  );
  const grBook = LM_PRESENTATION_REGISTRY.LM02.activities.find(
    (a) => a.id === "lm02-chapter1-reading"
  );
  assert.equal(enBook.title.en, "Benefits, limitations & when to use blockchain");
  assert.equal(
    grBook.title.gr,
    "Οφέλη, περιορισμοί και πότε δικαιολογείται το blockchain"
  );
  assert.doesNotMatch(enBook.description.en, /whole Chapter 1|entire Chapter/i);
  assert.doesNotMatch(grBook.description.gr, /ολόκληρο το Κεφάλαιο 1/i);
});

test("LM02 Learning Path has no FoodTrace standalone activity and assessment has href", () => {
  const visible = getLmVisibleActivities("LM02", "en");
  assert.ok(visible.some((a) => a.id === "lm02-assessment"));
  assert.equal(
    visible.some((a) =>
      /foodtrace|decision activity/i.test(`${a.id} ${a.title?.en || a.title || ""}`)
    ),
    false
  );
  const assessment = LM_PRESENTATION_REGISTRY.LM02.activities.find(
    (a) => a.id === "lm02-assessment"
  );
  assert.equal(assessment.linkKind, "internal");
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm02/assessment",
    gr: "/learning-modules-gr/lm02/assessment",
  });
  assert.match(assessment.description.en, /7 questions/i);
  assert.match(assessment.description.en, /FoodTrace/i);
  assert.doesNotMatch(assessment.description.en, /not available|slice|product yet/i);
  assert.doesNotMatch(assessment.description.gr, /δεν είναι ακόμη|assessment slice|προϊόν/i);
});

test("LM02 learner-facing copy has no implementation terminology", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM02;
  const chromeEn = getLmPageCopy("en", "LM02");
  const chromeGr = getLmPageCopy("gr", "LM02");
  const learnerBlobs = [
    chromeEn.learningPathIntro,
    chromeEn.nextRequiredBody,
    chromeEn.closingNextBody,
    chromeEn.closingNextEvidenceBody,
    chromeGr.learningPathIntro,
    chromeGr.nextRequiredBody,
    chromeGr.closingNextBody,
    chromeGr.closingNextEvidenceBody,
    mod.about.en,
    mod.about.gr,
    getLm02ChapterCopy("en").foodTraceBridge,
    getLm02ChapterCopy("gr").foodTraceBridge,
    ...mod.activities
      .filter((a) => !a.reserved)
      .flatMap((a) => [a.description.en, a.description.gr, a.title.en, a.title.gr]),
  ].join("\n");

  assert.doesNotMatch(learnerBlobs, /lm02-decision|lm02-assessment/);
  assert.doesNotMatch(learnerBlobs, /assessment slice|slice ships/i);
  assert.doesNotMatch(learnerBlobs, /not available in the product|no open link/i);
  assert.doesNotMatch(learnerBlobs, /future LM02 Assessment|when the assessment ships/i);
  assert.doesNotMatch(learnerBlobs, /Exact sections TBD|θα οριστούν αργότερα/i);
  assert.doesNotMatch(learnerBlobs, /δεν είναι ακόμη διαθέσιμη|assessment slice|στο προϊόν/i);
  assert.match(chromeEn.learningPathIntro, /FoodTrace/);
  assert.match(chromeGr.learningPathIntro, /FoodTrace/);
  assert.match(chromeEn.closingNextBody, /architectural reasoning/i);
  assert.match(chromeGr.closingNextBody, /αρχιτεκτονικό συλλογισμό/);
});

test("LM02 reasoning journey does not invent assessment question text", () => {
  assert.doesNotMatch(journeySrc, /lm02_q[0-9]/i);
  assert.doesNotMatch(journeySrc, /Part A: at least/i);
  assert.doesNotMatch(pageSrc, /Select all that apply/i);
});

test("LM02 page chrome overrides exist and registry keeps slides unlinked", () => {
  const en = getLmPageCopy("en", "LM02");
  const gr = getLmPageCopy("gr", "LM02");
  assert.match(en.loading, /LM02/);
  assert.match(gr.loading, /LM02/);
  assert.match(en.closingNextBody, /Complete the LM02 Assessment/i);
  assert.match(gr.closingNextBody, /Ολοκλήρωσε την Αξιολόγηση LM02/);
  assert.doesNotMatch(en.closingNextBody, /not available|open link/i);
  assert.doesNotMatch(gr.closingNextBody, /δεν είναι ακόμη|σύνδεσμος ανοίγματος/);
  const slides = LM_PRESENTATION_REGISTRY.LM02.activities.find(
    (a) => a.id === "lm02-slides"
  );
  assert.equal(slides?.href, null);
  assert.equal(slides?.reserved, true);
});
