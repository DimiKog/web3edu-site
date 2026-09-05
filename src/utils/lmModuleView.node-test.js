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
  getLmNextRequiredStepPresentation,
  getLmOverallPathPresentation,
  getLmPageViewState,
  getLmProgressStages,
  getLmRequiredEvidenceListPresentation,
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
    nextRequiredEvidence: null,
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

/** Synthetic multi-evidence module — presentation wiring only; not LM08 curriculum. */
function syntheticMultiEvidenceFixture({
  satisfied = { "practical-a": true, "practical-b": false, "practical-c": false, "practical-d": false },
  assessmentPassed = false,
  complete = false,
  currentModule = "SYN",
  nextRequiredEvidence = "practical-b",
  nextAction = {
    type: "learning_module_evidence",
    moduleId: "SYN",
    evidenceId: "practical-b",
  },
} = {}) {
  const requiredEvidence = {};
  for (const id of ["practical-a", "practical-b", "practical-c", "practical-d"]) {
    requiredEvidence[id] = { satisfied: Boolean(satisfied[id]) };
  }
  const missingEvidence = Object.keys(requiredEvidence).filter(
    (id) => !requiredEvidence[id].satisfied
  );
  return {
    progression: {
      earnedTier: "explorer",
      computedTier: "explorer",
      currentModule,
      currentPath: { targetTier: "builder", alignmentStatus: "current_curriculum_path" },
      nextAction,
      nextRequiredEvidence,
      modules: {
        SYN: {
          complete,
          requiredEvidenceSatisfied: missingEvidence.length === 0,
          requiredEvidence,
          missingEvidence,
          assessment: {
            id: "syn-assessment",
            required: true,
            passed: assessmentPassed,
          },
        },
      },
    },
    activities: [
      {
        id: "syn-resource",
        visualType: "book",
        requirementHint: "recommended",
        title: { en: "Supporting resource", gr: "Supporting resource" },
        description: { en: "Presentation only", gr: "Presentation only" },
        linkKind: "external",
        href: "https://example.com/resource",
        presentationOnly: true,
      },
      {
        id: "syn-a",
        visualType: "observation",
        requirementHint: "required",
        title: { en: "Practical A", gr: "Practical A" },
        description: { en: "A", gr: "A" },
        linkKind: "internal",
        href: { en: "/syn/a", gr: "/syn-gr/a" },
        evidenceId: "practical-a",
      },
      {
        id: "syn-b",
        visualType: "observation",
        requirementHint: "required",
        title: { en: "Practical B", gr: "Practical B" },
        description: { en: "B", gr: "B" },
        linkKind: "internal",
        href: { en: "/syn/b", gr: "/syn-gr/b" },
        evidenceId: "practical-b",
      },
      {
        id: "syn-c",
        visualType: "observation",
        requirementHint: "required",
        title: { en: "Practical C", gr: "Practical C" },
        description: { en: "C", gr: "C" },
        linkKind: "internal",
        href: { en: "/syn/c", gr: "/syn-gr/c" },
        evidenceId: "practical-c",
      },
      {
        id: "syn-d",
        visualType: "observation",
        requirementHint: "required",
        title: { en: "Practical D", gr: "Practical D" },
        description: { en: "D", gr: "D" },
        linkKind: "internal",
        href: { en: "/syn/d", gr: "/syn-gr/d" },
        evidenceId: "practical-d",
      },
      {
        id: "syn-assessment",
        visualType: "assessment",
        requirementHint: "required",
        title: { en: "SYN Assessment", gr: "SYN Assessment" },
        description: { en: "Final", gr: "Final" },
        linkKind: "internal",
        href: { en: "/syn/assessment", gr: "/syn-gr/assessment" },
        evidenceId: "syn-assessment",
      },
    ],
  };
}

function buildSyntheticView(overrides = {}) {
  const { progression, activities } = syntheticMultiEvidenceFixture(overrides);
  const moduleEntry = progression.modules.SYN;
  const rows = activities.map((activity) =>
    getLmActivityRowPresentation(activity, moduleEntry, "en", {
      canonical: true,
      moduleId: "SYN",
    })
  );
  const assessment = getLmAssessmentPresentation(moduleEntry, "en", {
    canonical: true,
  });
  // Assessment route may be null (no ASSESSMENT_ROUTES entry) — use registry href.
  if (!assessment.route) {
    assessment.route = "/syn/assessment";
  }
  const view = {
    mode: "ready",
    moduleId: "SYN",
    presentation: { visuals: { nextStep: "/next.png", completion: "/done.png" } },
    activities: rows,
    assessment,
    moduleEntry,
    complete: Boolean(moduleEntry.complete),
    progressionValid: true,
    currentModule: progression.currentModule,
    nextAction: progression.nextAction,
    nextRequiredEvidence: progression.nextRequiredEvidence,
    requiredEvidenceItems: getLmRequiredEvidenceListPresentation(
      moduleEntry,
      activities,
      "en",
      { canonical: true, assessment }
    ),
  };
  view.nextRequiredStep = getLmNextRequiredStepPresentation(view, "en");
  view.closingCta = getLmClosingCtaPresentation(view, "en");
  view.progressStages = getLmProgressStages(view, "en");
  return view;
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
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /Lm01BlockchainSimulator/);
  assert.match(pageSrc, /presentation="embedded"/);
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
  assert.doesNotMatch(pathSrc, /Lm01BlockchainSimulator/);
  assert.match(pathSrc, /renderEmbed/);
  assert.match(pathSrc, /expandedId/);
  assert.match(pathSrc, /aria-expanded/);
  assert.match(pathSrc, /LmActivityTile/);
  assert.match(pathSrc, /visualSrc/);
  assert.match(pathSrc, /evidence_satisfied|evidence_required/);
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
  assert.match(sidebarSrc, /requiredEvidenceItems/);
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

test("LM01 required evidence list is assessment-only", () => {
  const view = getLmPageViewState(freshProgression(), "en");
  assert.equal(view.requiredEvidenceItems.length, 1);
  assert.equal(view.requiredEvidenceItems[0].kind, "assessment");
  assert.equal(view.requiredEvidenceItems[0].satisfied, false);
  assert.equal(view.nextRequiredStep.kind, "assessment");
  assert.equal(view.closingCta.kind, "next_assessment");
});

test("synthetic multi-evidence: row satisfaction and next practical step", () => {
  const view = buildSyntheticView();
  const byId = Object.fromEntries(view.activities.map((r) => [r.id, r]));

  assert.equal(byId["syn-a"].statusKind, "evidence_satisfied");
  assert.equal(byId["syn-a"].evidenceSatisfied, true);
  assert.equal(byId["syn-b"].statusKind, "evidence_required");
  assert.equal(byId["syn-b"].evidenceSatisfied, false);
  assert.equal(byId["syn-c"].statusKind, "evidence_required");
  assert.equal(byId["syn-d"].statusKind, "evidence_required");
  assert.equal(byId["syn-assessment"].statusKind, "assessment_required");
  assert.equal(byId["syn-assessment"].assessmentPassed, false);

  assert.equal(byId["syn-resource"].statusKind, "external");
  assert.equal(byId["syn-resource"].evidenceId, null);
  assert.doesNotMatch(String(byId["syn-resource"].statusLabel), /evidence|completed/i);

  assert.equal(view.nextRequiredStep.kind, "evidence");
  assert.equal(view.nextRequiredStep.evidenceId, "practical-b");
  assert.equal(view.nextRequiredStep.title, "Practical B");
  assert.equal(view.nextRequiredStep.route, "/syn/b");
  assert.equal(view.closingCta.kind, "next_evidence");
  assert.notEqual(view.closingCta.kind, "next_assessment");
  assert.equal(view.complete, false);

  const evidenceIds = view.requiredEvidenceItems.map((i) => i.id);
  assert.deepEqual(evidenceIds, [
    "practical-a",
    "practical-b",
    "practical-c",
    "practical-d",
    "syn-assessment",
  ]);
  assert.equal(view.requiredEvidenceItems[0].satisfied, true);
  assert.equal(view.requiredEvidenceItems[1].satisfied, false);
  assert.equal(view.requiredEvidenceItems[4].kind, "assessment");
  assert.equal(view.requiredEvidenceItems[4].satisfied, false);

  const stages = Object.fromEntries(view.progressStages.map((s) => [s.id, s.state]));
  assert.equal(stages.explore, "current");
  assert.equal(stages.assess, "idle");
});

test("synthetic multi-evidence: assessment next only after practical evidence satisfied", () => {
  const view = buildSyntheticView({
    satisfied: {
      "practical-a": true,
      "practical-b": true,
      "practical-c": true,
      "practical-d": true,
    },
    assessmentPassed: false,
    complete: false,
    currentModule: "SYN",
    nextRequiredEvidence: null,
    nextAction: {
      type: "assessment",
      moduleId: "SYN",
      assessmentId: "syn-assessment",
    },
  });

  assert.ok(
    view.activities
      .filter((r) => r.evidenceId?.startsWith("practical-"))
      .every((r) => r.statusKind === "evidence_satisfied")
  );
  assert.equal(view.nextRequiredStep.kind, "assessment");
  assert.equal(view.closingCta.kind, "next_assessment");
  assert.equal(view.closingCta.route, "/syn/assessment");
  assert.equal(view.complete, false);

  const stages = Object.fromEntries(view.progressStages.map((s) => [s.id, s.state]));
  assert.equal(stages.explore, "open");
  assert.equal(stages.assess, "current");
});

test("synthetic multi-evidence: complete only when canonical module.complete", () => {
  const incomplete = buildSyntheticView({
    satisfied: {
      "practical-a": true,
      "practical-b": true,
      "practical-c": true,
      "practical-d": true,
    },
    assessmentPassed: true,
    complete: false,
    currentModule: "SYN",
    nextRequiredEvidence: null,
    nextAction: null,
  });
  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.closingCta.kind, "neutral");

  const done = buildSyntheticView({
    satisfied: {
      "practical-a": true,
      "practical-b": true,
      "practical-c": true,
      "practical-d": true,
    },
    assessmentPassed: true,
    complete: true,
    currentModule: "OTHER",
    nextRequiredEvidence: null,
    nextAction: null,
  });
  assert.equal(done.complete, true);
  assert.equal(done.closingCta.kind, "complete");
});

test("legacy-style currentModule elsewhere does not invent this module next step", () => {
  const view = buildSyntheticView({
    satisfied: {
      "practical-a": true,
      "practical-b": true,
      "practical-c": true,
      "practical-d": true,
    },
    assessmentPassed: false,
    complete: false,
    currentModule: "LM09",
    nextRequiredEvidence: "something-else",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "something-else",
    },
  });

  assert.equal(view.complete, false);
  assert.equal(view.currentModule, "LM09");
  assert.equal(view.nextRequiredStep.kind, "neutral");
  assert.equal(view.closingCta.kind, "neutral");
  assert.equal(view.closingCta.route, null);
  assert.equal(view.requiredEvidenceItems[4].satisfied, false);
});

test("supporting resource rows never become evidence from module completion", () => {
  const view = buildSyntheticView({
    satisfied: {
      "practical-a": true,
      "practical-b": true,
      "practical-c": true,
      "practical-d": true,
    },
    assessmentPassed: true,
    complete: true,
    currentModule: "OTHER",
    nextAction: null,
    nextRequiredEvidence: null,
  });
  const resource = view.activities.find((r) => r.id === "syn-resource");
  assert.equal(resource.statusKind, "external");
  assert.equal(resource.evidenceSatisfied, null);
  assert.doesNotMatch(String(resource.statusLabel), /completed|recorded/i);
});
function lm08ProgressionFixture({
  satisfied = {
    coding01: false,
    coding02: false,
    "lm08-contract-inspection": false,
    "lm08-source-verification": false,
  },
  assessmentPassed = false,
  complete = false,
  currentModule = "LM08",
  nextRequiredEvidence = "coding01",
  nextAction = {
    type: "learning_module_evidence",
    moduleId: "LM08",
    evidenceId: "coding01",
  },
} = {}) {
  const requiredEvidence = {};
  for (const id of [
    "coding01",
    "coding02",
    "lm08-contract-inspection",
    "lm08-source-verification",
  ]) {
    requiredEvidence[id] = { satisfied: Boolean(satisfied[id]) };
  }
  const missingEvidence = Object.keys(requiredEvidence).filter(
    (id) => !requiredEvidence[id].satisfied
  );
  return {
    earnedTier: "explorer",
    computedTier: "builder",
    currentModule,
    currentPath: {
      targetTier: "builder",
      alignmentStatus: "current_curriculum_path",
      isLegacyBuilder: currentModule === "LM09" && missingEvidence.length === 0,
    },
    nextAction,
    nextRequiredEvidence,
    modules: {
      LM08: {
        complete,
        requiredEvidenceSatisfied: missingEvidence.length === 0,
        requiredEvidence,
        missingEvidence,
        assessment: {
          id: "lm08-assessment",
          required: true,
          passed: assessmentPassed,
        },
      },
    },
  };
}

test("LM08 registry view maps exact canonical evidence IDs", () => {
  const view = getLmPageViewState(lm08ProgressionFixture(), "en", "LM08");
  assert.equal(view.mode, "ready");
  assert.equal(view.moduleId, "LM08");
  assert.match(view.title, /Deploying and Interacting/);
  assert.equal(view.assessment.assessmentId, "lm08-assessment");
  assert.equal(view.assessment.route, "/learning-modules/lm08/assessment");

  const practicalIds = view.requiredEvidenceItems
    .filter((i) => i.kind === "practical")
    .map((i) => i.evidenceId);
  assert.deepEqual(practicalIds, [
    "coding01",
    "coding02",
    "lm08-contract-inspection",
    "lm08-source-verification",
  ]);
  const assessmentItem = view.requiredEvidenceItems.find((i) => i.kind === "assessment");
  assert.equal(assessmentItem.evidenceId, "lm08-assessment");
  assert.equal(assessmentItem.satisfied, false);

  const coding = view.activities.find((a) => a.evidenceId === "coding01");
  assert.equal(coding.visualType, "coding");
  assert.equal(coding.typeLabel, "CODING");
  assert.equal(coding.href, "/labs/coding-01/interaction");
  assert.equal(coding.statusKind, "evidence_required");

  const lifecycle = view.activities.find((a) => a.id === "lm08-lifecycle");
  assert.equal(lifecycle.requirementHint, "core");
  assert.equal(lifecycle.statusKind, "core");
  assert.equal(lifecycle.statusLabel, "Core");
  assert.equal(lifecycle.evidenceId, null);
  assert.equal(lifecycle.presentationOnly, true);
  assert.equal(lifecycle.evidenceSatisfied, null);

  const remix = view.activities.find((a) => a.id === "lm08-remix-setup");
  assert.equal(remix.requirementHint, "recommended");
  assert.equal(remix.statusKind, "recommended");
});

test("LM08 4/4 practical + assessment false → assessment next for normal learner", () => {
  const progression = lm08ProgressionFixture({
    satisfied: {
      coding01: true,
      coding02: true,
      "lm08-contract-inspection": true,
      "lm08-source-verification": true,
    },
    assessmentPassed: false,
    complete: false,
    currentModule: "LM08",
    nextRequiredEvidence: null,
    nextAction: {
      type: "assessment",
      moduleId: "LM08",
      assessmentId: "lm08-assessment",
    },
  });
  const view = getLmPageViewState(progression, "en", "LM08");
  assert.equal(view.complete, false);
  assert.equal(view.nextRequiredStep.kind, "assessment");
  assert.equal(view.nextRequiredStep.route, "/learning-modules/lm08/assessment");
  assert.equal(view.closingCta.kind, "next_assessment");
  assert.ok(
    view.requiredEvidenceItems.filter((i) => i.kind === "practical").every((i) => i.satisfied)
  );
  assert.equal(
    view.requiredEvidenceItems.find((i) => i.kind === "assessment").satisfied,
    false
  );
});

test("LM08 legacy Builder 4/4 + assessment false + currentModule LM09 stays neutral", () => {
  const progression = lm08ProgressionFixture({
    satisfied: {
      coding01: true,
      coding02: true,
      "lm08-contract-inspection": true,
      "lm08-source-verification": true,
    },
    assessmentPassed: false,
    complete: false,
    currentModule: "LM09",
    nextRequiredEvidence: "lm09-guided-coding",
    nextAction: {
      type: "learning_module_evidence",
      moduleId: "LM09",
      evidenceId: "lm09-guided-coding",
    },
  });
  const view = getLmPageViewState(progression, "en", "LM08");
  assert.equal(view.complete, false);
  assert.equal(view.currentModule, "LM09");
  assert.equal(view.nextRequiredStep.kind, "neutral");
  assert.equal(view.closingCta.kind, "neutral");
  assert.equal(view.closingCta.route, null);
  assert.ok(
    view.requiredEvidenceItems.filter((i) => i.kind === "practical").every((i) => i.satisfied)
  );
  assert.equal(
    view.requiredEvidenceItems.find((i) => i.kind === "assessment").satisfied,
    false
  );
  assert.doesNotMatch(JSON.stringify(view.activities), /localStorage|visit|xp_total/i);
});

test("LM08 assessment fallback never becomes lm01-assessment", () => {
  const empty = getLmAssessmentPresentation(null, "en", {
    moduleId: "LM08",
    fallbackAssessmentId: "lm08-assessment",
  });
  assert.equal(empty.assessmentId, "lm08-assessment");
  assert.equal(empty.route, "/learning-modules/lm08/assessment");

  const noFallback = getLmAssessmentPresentation(null, "en", { moduleId: "LM08" });
  assert.equal(noFallback.assessmentId, null);
  assert.notEqual(noFallback.assessmentId, "lm01-assessment");
});

test("LM01 page chrome remains LM01-specific after module-aware copy", () => {
  assert.match(LM_PAGE_COPY.en.learningPathIntro, /LM01/);
  assert.match(LM_PAGE_COPY.en.sidebarProgress, /LM01/);
  const lm01 = getLmPageViewState(freshProgression(), "en", "LM01");
  assert.equal(lm01.mode, "ready");
  assert.equal(lm01.assessment.assessmentId, "lm01-assessment");
  assert.match(lm01.pageCopy.learningPathIntro, /LM01/);
  assert.doesNotMatch(lm01.pageCopy.learningPathIntro, /four practical/);
});

test("LM08 GR view uses GR routes and chrome", () => {
  const view = getLmPageViewState(lm08ProgressionFixture(), "gr", "LM08");
  assert.match(view.title, /Ανάπτυξη/);
  assert.equal(
    view.activities.find((a) => a.evidenceId === "coding01").href,
    "/labs-gr/coding-01/interaction"
  );
  assert.equal(view.assessment.route, "/learning-modules-gr/lm08/assessment");
  assert.match(view.pageCopy.pathBadge, /Builder/);
  assert.match(view.pageCopy.sidebarProgress, /LM08/);
  const lifecycle = view.activities.find((a) => a.id === "lm08-lifecycle");
  assert.equal(lifecycle.title, "Κύκλος ζωής ανάπτυξης έξυπνου συμβολαίου");
  assert.equal(lifecycle.statusLabel, "Βασικό υλικό");
});

test("LM08 chapter routes are registered EN/GR", () => {
  const routesSrc = readFileSync(join(__dirname, "../routes/routeTable.jsx"), "utf8");
  assert.match(routesSrc, /path: "\/learning-modules\/lm08"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm08"/);
  assert.match(routesSrc, /Lm08Page/);
});
