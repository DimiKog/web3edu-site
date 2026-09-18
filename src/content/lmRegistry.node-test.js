/**
 * LM presentation registry contracts.
 * Run: node --test src/content/lmRegistry.node-test.js
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM_PRESENTATION_REGISTRY,
  LM_CURRICULUM_IDS,
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM01_VISUALS,
  LM02_VISUALS,
  LM04_VISUALS,
  LM05_VISUALS,
  LM08_VISUALS,
  getLmActivityVisualSrc,
  getLmChapterRoute,
  getLmCurriculumModules,
  getLmLearnerMeta,
  getLmModulesForPath,
  getLmModuleVisuals,
  getLmRegistryModuleTitle,
  getLmVisibleActivities,
  isLmChapterAvailable,
} from "./lmRegistry.js";
import { CONTINUE_LEARNING_LOCALE } from "./continueLearningLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(__dirname, "../../public");

test("LM01 registry keeps reserved slides/PEL out of visible path", () => {
  const reserved = LM_PRESENTATION_REGISTRY.LM01.activities.filter((a) => a.reserved);
  assert.ok(reserved.some((a) => a.id === "lm01-slides"));
  assert.ok(reserved.some((a) => a.id === "lm01-pel-observe"));
  assert.equal(
    getLmVisibleActivities("LM01", "en").some((a) => a.reserved),
    false
  );
});

test("LM01 learnerMeta is bilingual presentation and does not invent extra XP", () => {
  const meta = LM_PRESENTATION_REGISTRY.LM01.learnerMeta;
  assert.equal(meta.estimatedTime.en, "1–2 hours");
  assert.equal(meta.estimatedTime.gr, "1–2 ώρες");
  assert.equal(meta.level.en, "Beginner");
  assert.equal(meta.level.gr, "Αρχάριο");
  assert.equal(meta.assessmentXp, 100);

  const en = getLmLearnerMeta("LM01", "en");
  const gr = getLmLearnerMeta("LM01", "gr");
  assert.equal(en.estimatedTime, "1–2 hours");
  assert.equal(gr.level, "Αρχάριο");
  assert.equal(en.assessmentXp, 100);
  assert.equal(getLmLearnerMeta("LM99", "en"), null);
});

test("EN and GR learning outcomes are bilingual and non-empty", () => {
  const { learningOutcomes, title, transition } = LM_PRESENTATION_REGISTRY.LM01;
  assert.equal(learningOutcomes.en.length, 4);
  assert.equal(learningOutcomes.gr.length, 4);
  assert.ok(title.en);
  assert.ok(title.gr);
  assert.ok(transition.from.en);
  assert.ok(transition.to.gr);
});

test("LM01 approved visuals are registered and present on disk", () => {
  const visuals = getLmModuleVisuals("LM01");
  assert.equal(visuals.hero, LM01_VISUALS.hero);
  assert.equal(visuals.completion, LM01_VISUALS.completion);
  assert.equal(visuals.nextStep, LM01_VISUALS.nextStep);
  assert.equal(visuals.meta.time, LM01_VISUALS.metaTime);
  assert.equal(visuals.meta.level, LM01_VISUALS.metaLevel);
  assert.equal(visuals.meta.xp, LM01_VISUALS.metaXp);
  assert.equal(visuals.activityByType.book, LM01_VISUALS.book);
  assert.equal(visuals.activityByType.demo, LM01_VISUALS.demo);
  assert.equal(visuals.activityByType.simulator, LM01_VISUALS.simulator);
  assert.equal(visuals.activityByType.assessment, LM01_VISUALS.assessment);
  assert.equal(getLmActivityVisualSrc("LM01", "book"), LM01_VISUALS.book);
  assert.equal(getLmActivityVisualSrc("LM01", "reading"), null);
  assert.equal(getLmModuleVisuals("LM99"), null);

  for (const src of Object.values(LM01_VISUALS)) {
    assert.match(src, /^\/learning-modules\/visuals\/lm01\/lm01-.+\.png$/);
    assert.equal(existsSync(join(publicRoot, src.slice(1))), true, src);
  }
});

test("LM08 presentation registry exists with canonical evidence wiring", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM08;
  assert.ok(mod);
  assert.equal(mod.pathKey, "builder");
  assert.equal(mod.learnerMeta.assessmentXp, 300);
  assert.equal(mod.learningOutcomes.en.length, 5);
  assert.equal(mod.learningOutcomes.gr.length, 5);
  assert.ok(mod.title.en);
  assert.ok(mod.title.gr);
  assert.equal(mod.visuals.hero, LM08_VISUALS.hero);
  assert.equal(mod.visuals.nextStep, LM08_VISUALS.nextStep);
  assert.notEqual(mod.visuals.nextStep, LM01_VISUALS.nextStep);
  assert.equal(mod.visuals.activityByType.verification, LM08_VISUALS.verification);

  const visible = getLmVisibleActivities("LM08", "en");
  assert.equal(visible.length, 7);
  const evidenceIds = visible
    .map((a) => a.evidenceId)
    .filter(Boolean);
  assert.deepEqual(evidenceIds, [
    "coding01",
    "coding02",
    "lm08-contract-inspection",
    "lm08-source-verification",
    "lm08-assessment",
  ]);
  assert.equal(visible[0].id, "lm08-lifecycle");
  assert.equal(visible[0].visualType, "reading");
  assert.equal(visible[0].requirementHint, "core");
  assert.equal(visible[0].presentationOnly, true);
  assert.equal(visible[0].evidenceId, undefined);
  assert.equal(visible[0].title.gr, "Κύκλος ζωής ανάπτυξης έξυπνου συμβολαίου");
  assert.equal(visible[1].id, "lm08-remix-setup");
  assert.equal(visible[1].requirementHint, "recommended");
  assert.equal(visible[2].visualType, "coding");
  assert.equal(visible[4].visualType, "inspection");
  assert.equal(visible[5].visualType, "verification");
  assert.equal(getLmActivityVisualSrc("LM08", "coding"), LM01_VISUALS.simulator);
  assert.equal(getLmLearnerMeta("LM08", "en").assessmentXp, 300);
});

test("LM08 expected visual asset paths are documented for owner drop-in", () => {
  assert.equal(LM08_VISUALS.hero, "/learning-modules/visuals/lm08/lm08-hero.png");
  assert.equal(
    LM08_VISUALS.verification,
    "/learning-modules/visuals/lm08/lm08-verification.png"
  );
  assert.equal(existsSync(join(publicRoot, LM08_VISUALS.hero.slice(1))), true);
  assert.equal(
    existsSync(join(publicRoot, LM08_VISUALS.verification.slice(1))),
    true
  );
  assert.equal(getLmModuleVisuals("LM08").hero, LM08_VISUALS.hero);
  assert.equal(
    getLmActivityVisualSrc("LM08", "verification"),
    LM08_VISUALS.verification
  );
});

test("curriculum registry covers exactly LM01–LM11 with correct path groups", () => {
  assert.deepEqual(LM_CURRICULUM_IDS, [
    "LM01",
    "LM02",
    "LM03",
    "LM04",
    "LM05",
    "LM06",
    "LM07",
    "LM08",
    "LM09",
    "LM10",
    "LM11",
  ]);
  const mods = getLmCurriculumModules();
  assert.equal(mods.length, 11);
  assert.deepEqual(
    mods.map((m) => m.id),
    LM_CURRICULUM_IDS
  );
  assert.deepEqual(
    getLmModulesForPath("explorer").map((m) => m.id),
    ["LM01", "LM02", "LM03"]
  );
  assert.deepEqual(
    getLmModulesForPath("builder").map((m) => m.id),
    ["LM04", "LM05", "LM06", "LM07", "LM08"]
  );
  assert.deepEqual(
    getLmModulesForPath("architect").map((m) => m.id),
    ["LM09", "LM10", "LM11"]
  );
});

test("chapterAvailable is true for LM01, LM02, LM03, LM04, LM05, and LM08 Interactive Chapters", () => {
  const availableIds = new Set(["LM01", "LM02", "LM03", "LM04", "LM05", "LM08"]);
  for (const id of LM_CURRICULUM_IDS) {
    const available = isLmChapterAvailable(id);
    if (availableIds.has(id)) {
      assert.equal(available, true, id);
      assert.ok(getLmChapterRoute(id, "en"));
      assert.ok(getLmChapterRoute(id, "gr"));
    } else {
      assert.equal(available, false, id);
      assert.equal(getLmChapterRoute(id, "en"), null);
      assert.equal(getLmChapterRoute(id, "gr"), null);
      assert.equal(LM_PRESENTATION_REGISTRY[id].chapterRoute, null);
    }
  }
  assert.equal(getLmChapterRoute("LM01", "en"), "/learning-modules/lm01");
  assert.equal(getLmChapterRoute("LM01", "gr"), "/learning-modules-gr/lm01");
  assert.equal(getLmChapterRoute("LM02", "en"), "/learning-modules/lm02");
  assert.equal(getLmChapterRoute("LM02", "gr"), "/learning-modules-gr/lm02");
  assert.equal(getLmChapterRoute("LM03", "en"), "/learning-modules/lm03");
  assert.equal(getLmChapterRoute("LM03", "gr"), "/learning-modules-gr/lm03");
  assert.equal(getLmChapterRoute("LM04", "en"), "/learning-modules/lm04");
  assert.equal(getLmChapterRoute("LM04", "gr"), "/learning-modules-gr/lm04");
  assert.equal(getLmChapterRoute("LM05", "en"), "/learning-modules/lm05");
  assert.equal(getLmChapterRoute("LM05", "gr"), "/learning-modules-gr/lm05");
  assert.equal(getLmChapterRoute("LM08", "en"), "/learning-modules/lm08");
  assert.equal(getLmChapterRoute("LM08", "gr"), "/learning-modules-gr/lm08");
});

test("LM04 chapter wires lab01–03 evidence and assessment", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM04;
  assert.equal(mod.chapterAvailable, true);
  assert.equal(mod.pathKey, "builder");
  assert.equal(mod.learnerMeta.assessmentXp, 200);
  assert.equal(mod.learningOutcomes.en.length, 5);
  assert.equal(mod.learningOutcomes.gr.length, 5);
  const visible = getLmVisibleActivities("LM04", "en");
  assert.deepEqual(
    visible.map((a) => a.id),
    [
      "lm04-interactive-chapter",
      "lm04-chapter3-reading",
      "lm04-lab01",
      "lm04-lab02",
      "lm04-section43-reading",
      "lm04-lab03",
      "lm04-assessment",
    ]
  );
  assert.equal(visible[0].presentationOnly, true);
  const evidenceIds = visible.map((a) => a.evidenceId).filter(Boolean);
  assert.deepEqual(evidenceIds, ["lab01", "lab02", "lab03", "lm04-assessment"]);
  assert.equal(visible.find((a) => a.id === "lm04-lab01")?.href.en, "/labs/wallets-keys");
  assert.equal(visible.find((a) => a.id === "lm04-lab02")?.href.en, "/labs/lab02");
  assert.equal(visible.find((a) => a.id === "lm04-lab03")?.href.en, "/labs/lab03");
  const assessment = visible.find((a) => a.id === "lm04-assessment");
  assert.equal(assessment?.linkKind, "internal");
  assert.equal(assessment?.href.gr, "/learning-modules-gr/lm04/assessment");
});

test("LM05 chapter wires lab04–05, unavailable PEL, and coming-soon assessment", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM05;
  assert.equal(mod.chapterAvailable, true);
  assert.equal(mod.pathKey, "builder");
  assert.equal(mod.learnerMeta.assessmentXp, 200);
  assert.equal(mod.learningOutcomes.en.length, 5);
  assert.equal(mod.learningOutcomes.gr.length, 5);
  assert.equal(mod.transition.from.en, "Understands keys, wallets and identity");
  assert.match(mod.transition.to.en, /transactions, state and lifecycle/i);
  assert.ok(mod.transition.from.gr);
  assert.ok(mod.transition.to.gr);

  const visible = getLmVisibleActivities("LM05", "en");
  assert.deepEqual(
    visible.map((a) => a.id),
    [
      "lm05-interactive-chapter",
      "lm05-chapter4-reading",
      "lm05-lab04",
      "lm05-lab05",
      "lm05-pel-transaction",
      "lm05-assessment",
    ]
  );
  assert.equal(visible[0].presentationOnly, true);
  assert.equal(visible[0].expandable, true);

  const evidenceIds = visible.map((a) => a.evidenceId).filter(Boolean);
  assert.deepEqual(evidenceIds, [
    "lab04",
    "lab05",
    "lm05-pel-transaction",
    "lm05-assessment",
  ]);

  assert.equal(visible.find((a) => a.id === "lm05-lab04")?.href.en, "/labs/lab04");
  assert.equal(visible.find((a) => a.id === "lm05-lab04")?.href.gr, "/labs-gr/lab04");
  assert.equal(visible.find((a) => a.id === "lm05-lab05")?.href.en, "/labs/lab05");
  assert.equal(visible.find((a) => a.id === "lm05-lab05")?.href.gr, "/labs-gr/lab05");

  const pel = visible.find((a) => a.id === "lm05-pel-transaction");
  assert.equal(pel?.requirementHint, "required");
  assert.equal(pel?.linkKind, "none");
  assert.equal(pel?.href, null);
  assert.equal(pel?.evidenceId, "lm05-pel-transaction");
  assert.match(pel?.title.en || "", /Educational Ledger Contribution/i);
  assert.match(pel?.title.gr || "", /Εκπαιδευτικό Ledger/);

  const assessment = visible.find((a) => a.id === "lm05-assessment");
  assert.equal(assessment?.visualType, "assessment");
  assert.equal(assessment?.linkKind, "none");
  assert.equal(assessment?.href, null);
  assert.equal(assessment?.evidenceId, "lm05-assessment");

  const reading = visible.find((a) => a.id === "lm05-chapter4-reading");
  assert.equal(reading?.visualType, "book");
  assert.equal(reading?.presentationOnly, true);
  assert.equal(reading?.href, LM01_KALLIPOS_TEXTBOOK_URL);
  assert.match(reading?.description.en || "", /Chapter 4/);
  assert.match(reading?.description.en || "", /4\.2\.2/);
});

test("LM05 wires dedicated hero/lab/PEL visuals via presentation overrides", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM05;
  assert.equal(LM05_VISUALS.hero, "/learning-modules/visuals/lm05/lm05-hero.png");
  assert.equal(LM05_VISUALS.concept, LM05_VISUALS.hero);
  assert.equal(
    LM05_VISUALS.lab04,
    "/learning-modules/visuals/lm05/lm05-lab04-transactions-gas.png"
  );
  assert.equal(
    LM05_VISUALS.lab05,
    "/learning-modules/visuals/lm05/lm05-lab05-smart-contracts-state.png"
  );
  assert.equal(
    LM05_VISUALS.educationalLedger,
    "/learning-modules/visuals/lm05/lm05-educational-ledger-contribution.png"
  );
  assert.equal(LM05_VISUALS.assessment, LM01_VISUALS.assessment);
  assert.equal(LM05_VISUALS.nextStep, LM01_VISUALS.assessment);

  for (const rel of [
    LM05_VISUALS.hero,
    LM05_VISUALS.lab04,
    LM05_VISUALS.lab05,
    LM05_VISUALS.educationalLedger,
  ]) {
    assert.equal(existsSync(join(publicRoot, rel.slice(1))), true);
  }

  assert.equal(mod.visuals.hero, LM05_VISUALS.hero);
  assert.equal(mod.visuals.activityByType.concept, LM05_VISUALS.concept);
  assert.equal(mod.visuals.activityByType.book, LM01_VISUALS.book);
  assert.equal(mod.visuals.activityByType.assessment, LM01_VISUALS.assessment);
  assert.equal(mod.visuals.activityByType.coding, LM01_VISUALS.simulator);

  assert.equal(
    getLmActivityVisualSrc("LM05", "concept", "lm05-interactive-chapter"),
    LM05_VISUALS.hero
  );
  assert.equal(
    getLmActivityVisualSrc("LM05", "coding", "lm05-lab04"),
    LM05_VISUALS.lab04
  );
  assert.equal(
    getLmActivityVisualSrc("LM05", "coding", "lm05-lab05"),
    LM05_VISUALS.lab05
  );
  assert.equal(
    getLmActivityVisualSrc("LM05", "observation", "lm05-pel-transaction"),
    LM05_VISUALS.educationalLedger
  );
  assert.equal(
    getLmActivityVisualSrc("LM05", "assessment", "lm05-assessment"),
    LM01_VISUALS.assessment
  );
  assert.equal(getLmActivityVisualSrc("LM05", "book"), LM01_VISUALS.book);
  // Type fallback without activityId stays shared simulator — override is by id only.
  assert.equal(getLmActivityVisualSrc("LM05", "coding"), LM01_VISUALS.simulator);
});


test("LM04 textbook readings are presentation-only Kallipos resources", () => {
  const visible = getLmVisibleActivities("LM04", "en");
  const core = visible.find((a) => a.id === "lm04-chapter3-reading");
  const focused = visible.find((a) => a.id === "lm04-section43-reading");
  assert.ok(core);
  assert.ok(focused);
  for (const reading of [core, focused]) {
    assert.equal(reading.visualType, "book");
    assert.equal(reading.requirementHint, "recommended");
    assert.equal(reading.presentationOnly, true);
    assert.equal(reading.evidenceId, undefined);
    assert.equal(reading.linkKind, "external");
    assert.equal(reading.href, LM01_KALLIPOS_TEXTBOOK_URL);
  }
  assert.match(core.description.en, /Chapter 3/);
  assert.match(core.description.en, /57–75|57-75/);
  assert.match(focused.description.en, /4\.3/);
  assert.match(focused.description.en, /93–97|93-97/);
  assert.equal(getLmActivityVisualSrc("LM04", "book"), LM01_VISUALS.book);
  assert.equal(
    getLmVisibleActivities("LM04", "gr").filter((a) => a.visualType === "book")
      .length,
    2
  );
});

test("LM04 uses dedicated hero/concept/assessment; nextStep uses assessment art", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM04;
  assert.equal(mod.visuals.hero, LM04_VISUALS.hero);
  assert.equal(mod.visuals.nextStep, LM04_VISUALS.nextStep);
  assert.equal(mod.visuals.completion, LM04_VISUALS.completion);
  assert.equal(mod.visuals.nextStep, LM04_VISUALS.assessment);
  assert.equal(mod.visuals.completion, LM04_VISUALS.hero);
  assert.notEqual(mod.visuals.hero, LM01_VISUALS.hero);
  assert.notEqual(mod.visuals.nextStep, LM01_VISUALS.nextStep);
  assert.notEqual(mod.visuals.completion, LM01_VISUALS.completion);
  assert.equal(mod.visuals.activityByType.concept, LM04_VISUALS.concept);
  assert.notEqual(mod.visuals.activityByType.concept, LM01_VISUALS.demo);
  assert.equal(mod.visuals.activityByType.assessment, LM04_VISUALS.assessment);
  assert.notEqual(mod.visuals.activityByType.assessment, LM01_VISUALS.assessment);
  assert.equal(getLmActivityVisualSrc("LM04", "concept"), LM04_VISUALS.concept);
  assert.equal(getLmActivityVisualSrc("LM04", "book"), LM01_VISUALS.book);
  assert.equal(getLmActivityVisualSrc("LM04", "coding"), LM01_VISUALS.simulator);
  assert.equal(getLmActivityVisualSrc("LM04", "assessment"), LM04_VISUALS.assessment);
  assert.equal(mod.visuals.meta.time, LM01_VISUALS.metaTime);
  assert.equal(mod.visuals.meta.level, LM01_VISUALS.metaLevel);
  assert.equal(mod.visuals.meta.xp, LM01_VISUALS.metaXp);
});

test("LM04 expected visual asset paths exist for owner drop-in", () => {
  assert.equal(LM04_VISUALS.hero, "/learning-modules/visuals/lm04/lm04-hero.png");
  assert.equal(
    LM04_VISUALS.concept,
    "/learning-modules/visuals/lm04/lm04-concept.png"
  );
  assert.equal(
    LM04_VISUALS.assessment,
    "/learning-modules/visuals/lm04/lm04-assessment.png"
  );
  assert.equal(existsSync(join(publicRoot, LM04_VISUALS.hero.slice(1))), true);
  assert.equal(existsSync(join(publicRoot, LM04_VISUALS.concept.slice(1))), true);
  assert.equal(
    existsSync(join(publicRoot, LM04_VISUALS.assessment.slice(1))),
    true
  );
  assert.equal(getLmModuleVisuals("LM04").hero, LM04_VISUALS.hero);
  assert.equal(getLmActivityVisualSrc("LM04", "concept"), LM04_VISUALS.concept);
  assert.equal(
    getLmActivityVisualSrc("LM04", "assessment"),
    LM04_VISUALS.assessment
  );
});

test("LM03 chapter is bilingual with locked transition and live assessment wiring", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM03;
  assert.equal(mod.chapterAvailable, true);
  assert.equal(mod.learnerMeta.assessmentXp, 150);
  assert.equal(mod.learningOutcomes.en.length, 7);
  assert.equal(mod.learningOutcomes.gr.length, 7);
  assert.ok(mod.activities.some((a) => a.id === "lm03-separate-dimensions"));
  assert.ok(mod.activities.some((a) => a.id === "lm03-platform-comparison"));
  assert.ok(mod.activities.some((a) => a.id === "lm03-foodtrace-revisited"));
  const assessment = mod.activities.find((a) => a.id === "lm03-assessment");
  assert.equal(assessment?.linkKind, "internal");
  assert.deepEqual(assessment?.href, {
    en: "/learning-modules/lm03/assessment",
    gr: "/learning-modules-gr/lm03/assessment",
  });
  assert.equal(assessment?.evidenceId, "lm03-assessment");
  assert.equal(assessment?.presentationOnly, false);
  assert.equal(
    getLmVisibleActivities("LM03", "en").filter((a) => a.visualType === "book").length,
    1
  );
  assert.ok(
    getLmVisibleActivities("LM03", "en").some((a) => a.id === "lm03-assessment")
  );
});

test("LM02 chapter is bilingual with locked transition and assessment XP display", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM02;
  assert.equal(mod.chapterAvailable, true);
  assert.equal(mod.learnerMeta.assessmentXp, 150);
  assert.match(mod.transition.from.en, /Blockchain could be used here/i);
  assert.match(mod.transition.to.en, /actually justified/i);
  assert.ok(mod.transition.from.gr);
  assert.ok(mod.transition.to.gr);
  assert.equal(mod.learningOutcomes.en.length, 6);
  assert.equal(mod.learningOutcomes.gr.length, 6);
  assert.ok(mod.activities.some((a) => a.id === "lm02-understand-trust-model"));
  assert.ok(mod.activities.some((a) => a.id === "lm02-compare-architecture-choices"));
  assert.ok(mod.activities.some((a) => a.id === "lm02-slides" && a.reserved));
  const assessment = mod.activities.find((a) => a.id === "lm02-assessment");
  assert.equal(assessment?.evidenceId, "lm02-assessment");
  assert.equal(assessment?.linkKind, "internal");
  assert.deepEqual(assessment?.href, {
    en: "/learning-modules/lm02/assessment",
    gr: "/learning-modules-gr/lm02/assessment",
  });
  assert.equal(assessment?.reserved, undefined);
  assert.equal(
    getLmVisibleActivities("LM02", "en").some((a) => a.id === "lm02-slides"),
    false
  );
  assert.ok(
    getLmVisibleActivities("LM02", "en").some((a) => a.id === "lm02-assessment")
  );
  assert.equal(mod.visuals.hero, LM02_VISUALS.hero);
  assert.equal(mod.visuals.activityByType.concept, LM02_VISUALS.concept);
  assert.equal(
    mod.activities.find((a) => a.id === "lm02-chapter1-reading-en-ref")
      ?.requirementHint,
    "recommended"
  );
  assert.equal(mod.learningOutcomes.en.length, 6);
  assert.equal(mod.learningOutcomes.gr.length, 6);
});

test("registry titles stay equivalent to Continue Learning moduleTitles (drift guard)", () => {
  for (const id of LM_CURRICULUM_IDS) {
    assert.equal(
      getLmRegistryModuleTitle(id, "en"),
      CONTINUE_LEARNING_LOCALE.en.moduleTitles[id],
      `${id} en`
    );
    assert.equal(
      getLmRegistryModuleTitle(id, "gr"),
      CONTINUE_LEARNING_LOCALE.gr.moduleTitles[id],
      `${id} gr`
    );
  }
});
