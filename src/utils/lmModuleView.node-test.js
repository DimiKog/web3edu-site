/**
 * LM01 page presentation + canonical mapping tests.
 * Run: node --test src/utils/lmModuleView.node-test.js src/content/lmRegistry.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  LM01_ANDERS_DEMO_URL,
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM01_VISUALS,
  getLmVisibleActivities,
  resolveLmActivityHref,
} from "../content/lmRegistry.js";
import {
  getLmActivityRowPresentation,
  getLmAssessmentPresentation,
  getLmClosingCtaPresentation,
  getLmOverallPathPresentation,
  getLmPageViewState,
  getLmProgressStages,
} from "./lmModuleView.js";
import { LM_PAGE_COPY } from "../content/lmPageLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function freshProgression({ assessmentPassed = false, complete = false } = {}) {
  return {
    earnedTier: "explorer",
    computedTier: "explorer",
    currentModule: complete ? "LM02" : "LM01",
    currentPath: { targetTier: "explorer", alignmentStatus: "current_curriculum_path" },
    nextAction: assessmentPassed
      ? null
      : { type: "assessment", moduleId: "LM01", assessmentId: "lm01-assessment" },
    modules: {
      LM01: {
        complete,
        requiredEvidenceSatisfied: true,
        requiredEvidence: {},
        missingEvidence: [],
        assessment: {
          id: "lm01-assessment",
          required: true,
          passed: assessmentPassed,
        },
      },
    },
  };
}

test("EN learning path excludes Greek primary textbook and includes optional Greek reference", () => {
  const en = getLmVisibleActivities("LM01", "en");
  const ids = en.map((a) => a.id);
  assert.ok(ids.includes("lm01-textbook-kallipos-en-ref"));
  assert.ok(!ids.includes("lm01-textbook-kallipos"));
  assert.ok(!ids.includes("lm01-slides"));
  assert.ok(!ids.includes("lm01-pel-observe"));
  assert.ok(ids.includes("lm01-anders-demo"));
  assert.ok(ids.includes("lm01-blockchain-simulator"));
  assert.ok(ids.includes("lm01-assessment"));

  const greekRef = en.find((a) => a.id === "lm01-textbook-kallipos-en-ref");
  assert.match(greekRef.title.en, /Greek textbook/i);
  assert.equal(greekRef.requirementHint, "optional");
  assert.equal(resolveLmActivityHref(greekRef, "en"), LM01_KALLIPOS_TEXTBOOK_URL);
});

test("GR learning path uses Kallipos as recommended Greek textbook", () => {
  const gr = getLmVisibleActivities("LM01", "gr");
  const ids = gr.map((a) => a.id);
  assert.ok(ids.includes("lm01-textbook-kallipos"));
  assert.ok(!ids.includes("lm01-textbook-kallipos-en-ref"));
  const book = gr.find((a) => a.id === "lm01-textbook-kallipos");
  assert.equal(book.requirementHint, "recommended");
  assert.equal(resolveLmActivityHref(book, "gr"), LM01_KALLIPOS_TEXTBOOK_URL);
});

test("Anders demo URL is the approved external interactive demo", () => {
  assert.equal(LM01_ANDERS_DEMO_URL, "https://andersbrownworth.com/blockchain/");
  const en = getLmVisibleActivities("LM01", "en");
  const demo = en.find((a) => a.id === "lm01-anders-demo");
  assert.equal(resolveLmActivityHref(demo, "en"), LM01_ANDERS_DEMO_URL);
});

test("simulator is embed presentation-only with no completion status", () => {
  const progression = freshProgression();
  const moduleEntry = progression.modules.LM01;
  const sim = getLmVisibleActivities("LM01", "en").find(
    (a) => a.id === "lm01-blockchain-simulator"
  );
  const row = getLmActivityRowPresentation(sim, moduleEntry, "en", { canonical: true });
  assert.equal(row.embed, true);
  assert.equal(row.presentationOnly, true);
  assert.equal(row.statusKind, "interactive");
  assert.equal(row.ctaLabel, "Open simulator");
  assert.doesNotMatch(row.statusLabel, /completed/i);
});

test("resource rows never show completed even when LM01 is complete", () => {
  const progression = freshProgression({ assessmentPassed: true, complete: true });
  const moduleEntry = progression.modules.LM01;
  for (const activity of getLmVisibleActivities("LM01", "en")) {
    if (activity.visualType === "assessment") continue;
    const row = getLmActivityRowPresentation(activity, moduleEntry, "en");
    assert.doesNotMatch(String(row.statusLabel), /completed/i);
    assert.notEqual(row.statusKind, "completed");
  }
});

test("assessment routes and canonical passed/not-passed mapping", () => {
  const notPassed = getLmAssessmentPresentation(
    freshProgression().modules.LM01,
    "en",
    { canonical: true }
  );
  assert.equal(notPassed.passed, false);
  assert.equal(notPassed.statusLabel, "Not passed");
  assert.equal(notPassed.route, "/learning-modules/lm01/assessment");

  const passed = getLmAssessmentPresentation(
    freshProgression({ assessmentPassed: true, complete: true }).modules.LM01,
    "gr",
    { canonical: true }
  );
  assert.equal(passed.passed, true);
  assert.equal(passed.route, "/learning-modules-gr/lm01/assessment");
});

test("signed-out view stays neutral and does not fabricate progress", () => {
  const view = getLmPageViewState(null, "en");
  assert.equal(view.progressionValid, false);
  assert.equal(view.complete, false);
  assert.equal(view.assessment.statusLabel, null);
  assert.equal(view.assessment.passed, false);
  assert.ok(view.progressStages.every((stage) => stage.state === "idle"));
  assert.ok(view.overallPath.tiers.every((tier) => tier.state === "idle"));
  assert.equal(view.closingCta.kind, "next_assessment");
  assert.equal(view.closingCta.visualSrc, LM01_VISUALS.nextStep);
  for (const row of view.activities) {
    assert.doesNotMatch(String(row.statusLabel), /completed/i);
    assert.doesNotMatch(String(row.statusLabel), /not passed/i);
  }
});

test("progress stages do not treat resources as complete", () => {
  const inProgress = getLmPageViewState(freshProgression(), "en");
  const byId = Object.fromEntries(inProgress.progressStages.map((s) => [s.id, s.state]));
  assert.equal(byId.learn, "open");
  assert.equal(byId.explore, "open");
  assert.equal(byId.assess, "current");
  assert.equal(byId.complete, "idle");
  assert.notEqual(byId.learn, "done");
  assert.notEqual(byId.explore, "done");

  const done = getLmPageViewState(
    freshProgression({ assessmentPassed: true, complete: true }),
    "en"
  );
  assert.ok(done.progressStages.every((stage) => stage.state === "done"));
});

test("overall path uses canonical tier fields only", () => {
  const view = getLmPageViewState(freshProgression(), "en");
  const path = getLmOverallPathPresentation(view, "en");
  assert.equal(path.currentModule, "LM01");
  const explorer = path.tiers.find((t) => t.key === "explorer");
  const builder = path.tiers.find((t) => t.key === "builder");
  assert.equal(explorer.state, "earned");
  assert.equal(builder.state, "idle");
  assert.doesNotMatch(JSON.stringify(path), /3 \/ 3/);
});

test("idle progress stages when canonical progression is missing", () => {
  const stages = getLmProgressStages({ progressionValid: false }, "gr");
  assert.equal(stages.length, 4);
  assert.ok(stages.every((stage) => stage.state === "idle"));
  assert.deepEqual(
    stages.map((s) => s.id),
    ["learn", "explore", "assess", "complete"]
  );
});

test("LM page copy EN/GR key parity", () => {
  assert.deepEqual(Object.keys(LM_PAGE_COPY.en).sort(), Object.keys(LM_PAGE_COPY.gr).sort());
});

test("page view does not invent LM completion without canonical module.complete", () => {
  const view = getLmPageViewState(freshProgression({ assessmentPassed: false }), "en");
  assert.equal(view.complete, false);
  assert.equal(view.assessment.passed, false);
  assert.equal(view.learnerMeta.assessmentXp, 100);
  assert.equal(view.learnerMeta.estimatedTime, "1–2 hours");
  assert.equal(view.learnerMeta.level, "Beginner");

  const done = getLmPageViewState(
    freshProgression({ assessmentPassed: true, complete: true }),
    "en"
  );
  assert.equal(done.complete, true);
  assert.equal(done.assessment.passed, true);
});

test("closing CTA is assessment for incomplete LM01 and acknowledgement when complete", () => {
  const open = getLmClosingCtaPresentation(
    getLmPageViewState(freshProgression(), "en"),
    "en"
  );
  assert.equal(open.kind, "next_assessment");
  assert.equal(open.title, "LM01 Assessment");
  assert.equal(open.body, "Finish the assessment to complete LM01.");
  assert.equal(open.ctaLabel, "Go to assessment");
  assert.equal(open.route, "/learning-modules/lm01/assessment");
  assert.equal(open.visualSrc, LM01_VISUALS.nextStep);
  assert.doesNotMatch(open.body, /unlock LM02/i);
  assert.doesNotMatch(open.body, /XP/i);

  const done = getLmClosingCtaPresentation(
    getLmPageViewState(
      freshProgression({ assessmentPassed: true, complete: true }),
      "en"
    ),
    "en"
  );
  assert.equal(done.kind, "complete");
  assert.equal(done.visualSrc, LM01_VISUALS.completion);
  assert.notEqual(done.visualSrc, LM01_VISUALS.nextStep);
  assert.notEqual(done.ctaLabel, "Go to assessment");
  assert.notEqual(done.route, "/learning-modules/lm01/assessment");
  assert.equal(done.currentModule, "LM02");
  assert.match(done.currentModuleTitle, /Why Blockchain/i);
  assert.equal(done.route, null);

  const gr = getLmClosingCtaPresentation(
    getLmPageViewState(freshProgression(), "gr"),
    "gr"
  );
  assert.equal(gr.title, "Αξιολόγηση LM01");
  assert.equal(gr.ctaLabel, "Μετάβαση στην αξιολόγηση");
});

test("Lm01Page keeps cohesive path, hero facts band, and chapter-ending CTA", () => {
  const pageSrc = readFileSync(
    join(__dirname, "../pages/learning-modules/Lm01Page.jsx"),
    "utf8"
  );
  const pathSrc = readFileSync(
    join(__dirname, "../components/learning-modules/LmLearningPath.jsx"),
    "utf8"
  );
  const closeSrc = readFileSync(
    join(__dirname, "../components/learning-modules/LmChapterClose.jsx"),
    "utf8"
  );
  const visualsSrc = readFileSync(
    join(__dirname, "../components/learning-modules/LmVisuals.jsx"),
    "utf8"
  );
  const sidebarSrc = readFileSync(
    join(__dirname, "../components/learning-modules/LmProgressSidebar.jsx"),
    "utf8"
  );
  assert.match(pageSrc, /fetchLearningModulesProgression/);
  assert.match(pageSrc, /getLmPageViewState/);
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmOutcomeMark/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /heroTimeLabel/);
  assert.match(pageSrc, /heroLevelLabel/);
  assert.match(pageSrc, /heroXpLabel/);
  assert.match(pageSrc, /learnerMeta/);
  assert.match(pageSrc, /presentation\?\.visuals\?\.hero/);
  assert.match(pageSrc, /visuals\.meta\.time/);
  assert.match(pageSrc, /visuals\.meta\.level/);
  assert.match(pageSrc, /visuals\.meta\.xp/);
  assert.doesNotMatch(pageSrc, /Lm01ChapterIllustration/);
  assert.doesNotMatch(pageSrc, /heroPathValue/);
  assert.doesNotMatch(pageSrc, /\+20 XP/);
  assert.doesNotMatch(pageSrc, /postLabsComplete/);
  assert.match(pathSrc, /Lm01BlockchainSimulator/);
  assert.match(pathSrc, /presentation="embedded"/);
  assert.match(pathSrc, /expandedId/);
  assert.match(pathSrc, /aria-expanded/);
  assert.match(pathSrc, /LmActivityTile/);
  assert.match(pathSrc, /visualSrc/);
  // Mobile: compact accent tile; description uses full content width (col-span-2).
  assert.match(pathSrc, /h-12 w-\[4\.5rem\]/);
  assert.match(pathSrc, /col-span-2[\s\S]*sm:hidden/);
  // Desktop: modest shared scale reduction vs prior h-24 / w-36.
  assert.match(pathSrc, /sm:h-\[5\.5rem\] sm:w-\[8\.1rem\]/);
  // Mobile breadcrumb clears sticky PageShell header.
  assert.match(pageSrc, /pt-24 pb-8 sm:px-6 sm:py-10/);
  assert.match(closeSrc, /cta\.visualSrc/);
  assert.doesNotMatch(closeSrc, /LmClosingCtaIllustration/);
  assert.match(visualsSrc, /object-contain/);
  assert.doesNotMatch(visualsSrc, /invert|hue-rotate|mix-blend/);
  assert.match(sidebarSrc, /loadError === "sign_in"/);
  assert.match(sidebarSrc, /progressStages/);
  assert.match(sidebarSrc, /overallPath/);
  assert.doesNotMatch(pageSrc, /Completed/);
  assert.doesNotMatch(pageSrc, /\bPEL\b/);
  assert.doesNotMatch(pageSrc, /Excel Simulator/);
  assert.doesNotMatch(pathSrc, /Excel Simulator/);
});

test("visible LM01 activity rows use approved PNG thumbnails", () => {
  const view = getLmPageViewState(null, "en");
  const byType = Object.fromEntries(view.activities.map((row) => [row.visualType, row.visualSrc]));
  assert.equal(byType.book, LM01_VISUALS.book);
  assert.equal(byType.demo, LM01_VISUALS.demo);
  assert.equal(byType.simulator, LM01_VISUALS.simulator);
  assert.equal(byType.assessment, LM01_VISUALS.assessment);
  assert.equal(view.presentation.visuals.hero, LM01_VISUALS.hero);
  assert.equal(view.presentation.visuals.completion, LM01_VISUALS.completion);
  assert.equal(view.presentation.visuals.nextStep, LM01_VISUALS.nextStep);
  assert.equal(view.presentation.visuals.meta.time, LM01_VISUALS.metaTime);
  assert.equal(view.presentation.visuals.meta.level, LM01_VISUALS.metaLevel);
  assert.equal(view.presentation.visuals.meta.xp, LM01_VISUALS.metaXp);
});

test("routeTable registers LM01 chapter EN/GR routes", () => {
  const routes = readFileSync(join(__dirname, "../routes/routeTable.jsx"), "utf8");
  assert.match(routes, /path: "\/learning-modules\/lm01"/);
  assert.match(routes, /path: "\/learning-modules-gr\/lm01"/);
  assert.match(routes, /Lm01Page/);
  assert.doesNotMatch(routes, /simulator-preview/);
});
