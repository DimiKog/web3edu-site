/**
 * Learn landing page contracts.
 * Run: node --test src/pages/learning-modules/LearnPage.node-test.js
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getLmChapterRoute,
  getLmCurriculumModules,
  getLmLearnCardVisualSrc,
  getLmModuleVisuals,
  isLmChapterAvailable,
  LM01_VISUALS,
  LM02_VISUALS,
  LM03_VISUALS,
  LM04_VISUALS,
  LM05_VISUALS,
  LM06_VISUALS,
  LM07_VISUALS,
  LM08_VISUALS,
} from "../../content/lmRegistry.js";
import { getLearnLandingCopy } from "../../content/learnLandingLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(__dirname, "../../../public");
const pageSrc = readFileSync(join(__dirname, "LearnPage.jsx"), "utf8");
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);

test("routeTable registers /learn and /learn-gr with LearnPage lang prop", () => {
  assert.match(routesSrc, /path: "\/learn"/);
  assert.match(routesSrc, /path: "\/learn-gr"/);
  assert.match(routesSrc, /LearnPage/);
  assert.match(
    routesSrc,
    /path: "\/learn-gr",\s*component: LearnPage,\s*props: \{ lang: "gr" \}/
  );
});

test("Learn page uses canonical progression helpers (fetch + metadata fallback)", () => {
  assert.match(pageSrc, /fetchLearningModulesProgression/);
  assert.match(pageSrc, /resolveLearnContinueBarPresentation/);
  assert.match(pageSrc, /pickLearnContinueProgression/);
  assert.match(pageSrc, /shouldShowLearnContinueSection/);
  assert.match(pageSrc, /useResolvedIdentityContext/);
  assert.match(pageSrc, /metadata\?\.progression/);
  assert.match(pageSrc, /LearnContinueBar/);
  assert.match(pageSrc, /availableModulesCompleteTitle/);
  assert.doesNotMatch(pageSrc, /ContinueLearningCard/);
  assert.doesNotMatch(pageSrc, /getRoleFromXpTotal/);
  assert.doesNotMatch(pageSrc, /getProgressFromXpTotal/);
  assert.doesNotMatch(pageSrc, /from ["'].*progression\.js["']/);
});

test("Learn Continue section is not breakpoint-hidden", () => {
  assert.doesNotMatch(pageSrc, /showContinueSection[\s\S]{0,80}hidden/);
  assert.doesNotMatch(pageSrc, /LearnContinueBar[\s\S]{0,120}hidden (?:lg|md|sm|xl):/);
  assert.doesNotMatch(pageSrc, /max-lg:hidden/);
  assert.doesNotMatch(pageSrc, /hidden lg:block[\s\S]{0,40}Continue/);
});

test("Learn page keeps stable top padding (no sm:py override under fixed header)", () => {
  assert.match(pageSrc, /pt-28/);
  assert.doesNotMatch(pageSrc, /sm:py-10/);
  assert.doesNotMatch(pageSrc, /lg:py-12/);
  assert.match(pageSrc, /sm:pt-28/);
  assert.match(pageSrc, /lg:pt-28/);
});

test("Learn page curriculum cards never navigate unavailable chapters", () => {
  const unavailable = getLmCurriculumModules().filter(
    (m) => !isLmChapterAvailable(m.id)
  );
  assert.deepEqual(
    unavailable.map((m) => m.id),
    ["LM09", "LM10", "LM11"]
  );
  for (const mod of unavailable) {
    assert.equal(getLmChapterRoute(mod.id, "en"), null);
    assert.equal(getLmChapterRoute(mod.id, "gr"), null);
  }
  assert.match(pageSrc, /if \(available && route\) \{\s*return \(\s*<Link/);
  assert.match(pageSrc, /return \(\s*<div\s+className=\{shellClass\}/);
  assert.match(pageSrc, /chapterPlanned/);
});

test("Learn landing locale exposes EN/GR hero, value points, planned state, footer", () => {
  const en = getLearnLandingCopy("en");
  const gr = getLearnLandingCopy("gr");
  assert.ok(en.heroTitle);
  assert.ok(gr.heroTitle);
  assert.match(en.heroTitle, /Web3 Learning Journey/i);
  assert.ok(gr.heroTitle.includes("Web3") || gr.heroTitle.includes("Διαδρομή"));
  assert.equal(en.valuePoints.length, 3);
  assert.equal(gr.valuePoints.length, 3);
  assert.equal(en.valuePoints[0].title, "Learn");
  assert.equal(en.valuePoints[1].title, "Practice");
  assert.equal(en.valuePoints[2].title, "Prove");
  assert.equal(gr.valuePoints[0].title, "Μάθε");
  assert.equal(gr.valuePoints[1].title, "Εξασκήσου");
  assert.equal(gr.valuePoints[2].title, "Απόδειξε");
  assert.equal(en.paths.explorer.subtitle, "Foundations");
  assert.equal(gr.paths.explorer.subtitle, "Θεμέλια");
  assert.ok(en.paths.explorer.description);
  assert.ok(gr.paths.builder.description);
  assert.equal(en.available, "Available");
  assert.equal(en.completed, "Completed");
  assert.equal(gr.available, "Διαθέσιμο");
  assert.equal(gr.completed, "Ολοκληρωμένο");
  assert.equal(en.planned, "Planned");
  assert.equal(gr.chapterPlanned, "Διαδραστικό κεφάλαιο");
  assert.ok(en.modulesHeading);
  assert.ok(gr.modulesHeading);
  // Desktop curriculum: max three columns (Builder wraps as 3+2).
  assert.match(pageSrc, /lg:grid-cols-3/);
  assert.doesNotMatch(pageSrc, /xl:grid-cols-5/);
  assert.match(pageSrc, /learning-journey-hero\.png/);
  assert.doesNotMatch(pageSrc, /learning-stages-illustration/);
  // Phase 3: hero CTA scrolls to curriculum; no Explorer/Builder/Architect strip in hero.
  assert.doesNotMatch(pageSrc, /PathJourneyOverview/);
  assert.match(pageSrc, /scrollToCurriculum/);
  assert.match(pageSrc, /prefers-reduced-motion/);
  assert.equal(en.exploreModulesCta, "Explore Learning Modules");
  assert.equal(
    gr.exploreModulesCta,
    "Εξερεύνησε τις Μαθησιακές Ενότητες"
  );
  assert.match(pageSrc, /MethodologyStrip|learn-practice-prove-heading/);
  assert.match(pageSrc, /getModuleAbout|mod\.about|moduleSummaries/);
  // EN/GR card summary parity for LM01–LM11.
  const enKeys = Object.keys(en.moduleSummaries || {});
  const grKeys = Object.keys(gr.moduleSummaries || {});
  assert.deepEqual(enKeys, grKeys);
  for (const id of [
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
  ]) {
    assert.ok(en.moduleSummaries[id]);
    assert.ok(gr.moduleSummaries[id]);
  }
});

test("Module cards read canonical modules[].complete — not XP or activity guesses", () => {
  assert.match(pageSrc, /getCanonicalModuleEntry/);
  assert.match(pageSrc, /ModuleCard[\s\S]*progression=\{progression\}/);
  assert.match(pageSrc, /getCanonicalModuleEntry\(progression, mod\.id\)\?\.complete/);
  assert.match(pageSrc, /copy\.completed/);
  assert.doesNotMatch(pageSrc, /getRoleFromXpTotal|getProgressFromXpTotal|xp_total|score\s*>=/);
  // Planned/unavailable path must not invent completion labels.
  assert.match(pageSrc, /copy\.planned/);
  assert.match(pageSrc, /chapterPlanned/);
});

test("EN/GR available-modules completion copy for Continue Learning State B", () => {
  const en = getLearnLandingCopy("en");
  const gr = getLearnLandingCopy("gr");
  assert.equal(
    en.availableModulesCompleteTitle,
    "All available Learning Modules completed!"
  );
  assert.equal(
    en.availableModulesCompleteBody,
    "You've completed the current learning journey. New modules are coming soon."
  );
  assert.equal(
    gr.availableModulesCompleteTitle,
    "Ολοκλήρωσες όλες τις διαθέσιμες Μαθησιακές Ενότητες!"
  );
  assert.equal(
    gr.availableModulesCompleteBody,
    "Η μαθησιακή σου διαδρομή συνεχίζεται σύντομα με νέες ενότητες."
  );
  assert.match(pageSrc, /available_complete/);
  assert.match(pageSrc, /availableModulesCompleteBody/);
});

test("LM03 Learn card prefers lm03-card.png; hero unchanged for chapter pages", () => {
  assert.equal(
    LM03_VISUALS.card,
    "/learning-modules/visuals/lm03/lm03-card.png"
  );
  assert.equal(
    LM03_VISUALS.hero,
    "/learning-modules/visuals/lm03/lm03-hero.png"
  );
  assert.equal(getLmModuleVisuals("LM03")?.card, LM03_VISUALS.card);
  assert.equal(getLmModuleVisuals("LM03")?.hero, LM03_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM03"), LM03_VISUALS.card);
  assert.notEqual(getLmLearnCardVisualSrc("LM03"), LM03_VISUALS.hero);
  assert.equal(
    existsSync(join(publicRoot, LM03_VISUALS.card.slice(1))),
    true
  );
  assert.equal(
    existsSync(join(publicRoot, LM03_VISUALS.hero.slice(1))),
    true
  );
  // Learn ModuleCard uses card helper — not raw hero.
  assert.match(pageSrc, /getLmLearnCardVisualSrc/);
  assert.doesNotMatch(pageSrc, /getLmModuleVisuals\(mod\.id\)\?\.hero/);
});

test("LM06 Learn card prefers lm06-card.png; hero unchanged for chapter pages", () => {
  assert.equal(
    LM06_VISUALS.card,
    "/learning-modules/visuals/lm06/lm06-card.png"
  );
  assert.equal(
    LM06_VISUALS.hero,
    "/learning-modules/visuals/lm06/lm06-hero-consensus-block-inclusion.png"
  );
  assert.equal(getLmModuleVisuals("LM06")?.card, LM06_VISUALS.card);
  assert.equal(getLmModuleVisuals("LM06")?.hero, LM06_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM06"), LM06_VISUALS.card);
  assert.notEqual(getLmLearnCardVisualSrc("LM06"), LM06_VISUALS.hero);
  assert.equal(
    existsSync(join(publicRoot, LM06_VISUALS.card.slice(1))),
    true
  );
  assert.equal(
    existsSync(join(publicRoot, LM06_VISUALS.hero.slice(1))),
    true
  );
});

test("LM07 Learn card prefers lm07-card.png; hero unchanged for chapter pages", () => {
  assert.equal(
    LM07_VISUALS.card,
    "/learning-modules/visuals/lm07/lm07-card.png"
  );
  assert.equal(
    LM07_VISUALS.hero,
    "/learning-modules/visuals/lm07/lm07-hero.png"
  );
  assert.equal(getLmModuleVisuals("LM07")?.card, LM07_VISUALS.card);
  assert.equal(getLmModuleVisuals("LM07")?.hero, LM07_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM07"), LM07_VISUALS.card);
  assert.notEqual(getLmLearnCardVisualSrc("LM07"), LM07_VISUALS.hero);
  assert.equal(
    existsSync(join(publicRoot, LM07_VISUALS.card.slice(1))),
    true
  );
  assert.equal(
    existsSync(join(publicRoot, LM07_VISUALS.hero.slice(1))),
    true
  );
});

test("modules without card art fall back to existing hero on Learn cards", () => {
  assert.equal(getLmModuleVisuals("LM01")?.card, undefined);
  assert.equal(getLmModuleVisuals("LM07")?.card, LM07_VISUALS.card);
  assert.equal(getLmLearnCardVisualSrc("LM01"), LM01_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM02"), LM02_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM04"), LM04_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM05"), LM05_VISUALS.hero);
  assert.equal(getLmLearnCardVisualSrc("LM08"), LM08_VISUALS.hero);
  assert.notEqual(getLmLearnCardVisualSrc("LM07"), LM07_VISUALS.hero);
});

test("Learn card visuals do not touch canonical progression or completion helpers", () => {
  assert.match(pageSrc, /getCanonicalModuleEntry\(progression, mod\.id\)\?\.complete/);
  assert.match(pageSrc, /resolveLearnContinueBarPresentation/);
  assert.doesNotMatch(pageSrc, /getRoleFromXpTotal|getProgressFromXpTotal/);
  assert.doesNotMatch(pageSrc, /from ["'].*progression\.js["']/);
});
