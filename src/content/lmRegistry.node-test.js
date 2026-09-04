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
  LM01_VISUALS,
  getLmActivityVisualSrc,
  getLmLearnerMeta,
  getLmModuleVisuals,
  getLmVisibleActivities,
} from "./lmRegistry.js";

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
