/**
 * Learn landing page contracts.
 * Run: node --test src/pages/learning-modules/LearnPage.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getLmChapterRoute,
  getLmCurriculumModules,
  isLmChapterAvailable,
} from "../../content/lmRegistry.js";
import { getLearnLandingCopy } from "../../content/learnLandingLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
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
  assert.match(pageSrc, /getContinueLearningViewState/);
  assert.match(pageSrc, /pickLearnContinueProgression/);
  assert.match(pageSrc, /shouldShowLearnContinueSection/);
  assert.match(pageSrc, /useResolvedIdentityContext/);
  assert.match(pageSrc, /metadata\?\.progression/);
  assert.match(pageSrc, /LearnContinueBar/);
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
  assert.ok(unavailable.length >= 9);
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
  assert.equal(en.valuePoints.length, 3);
  assert.equal(gr.valuePoints.length, 3);
  assert.equal(en.paths.explorer.subtitle, "Foundations");
  assert.equal(gr.paths.explorer.subtitle, "Θεμέλια");
  assert.equal(en.available, "Available");
  assert.equal(en.planned, "Planned");
  assert.equal(gr.chapterPlanned, "Διαδραστικό κεφάλαιο");
  assert.match(pageSrc, /xl:grid-cols-5/);
});
