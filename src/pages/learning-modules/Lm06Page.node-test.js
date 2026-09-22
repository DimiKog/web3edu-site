/**
 * LM06 Interactive Chapter contracts.
 * Run: node --test src/pages/learning-modules/Lm06Page.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getLm06ChapterCopy,
  LM06_EDUCATIONAL_LEDGER_HREF,
  LM06_POS_SIMULATOR_HREF,
  LM06_POW_SIMULATOR_HREF,
} from "../../content/lm06ChapterLocale.js";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import {
  getLmActivityVisualSrc,
  getLmChapterRoute,
  getLmVisibleActivities,
  isLmChapterAvailable,
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM_PRESENTATION_REGISTRY,
} from "../../content/lmRegistry.js";
import { ASSESSMENT_ROUTES } from "../../utils/progressionActionMapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pageSrc = readFileSync(join(__dirname, "Lm06Page.jsx"), "utf8");
const panelSrc = readFileSync(
  join(__dirname, "../../components/learning-modules/Lm06ConceptPanel.jsx"),
  "utf8"
);
const routesSrc = readFileSync(
  join(__dirname, "../../routes/routeTable.jsx"),
  "utf8"
);
const localeSrc = readFileSync(
  join(__dirname, "../../content/lm06ChapterLocale.js"),
  "utf8"
);
const closeSrc = readFileSync(
  join(__dirname, "../../components/learning-modules/LmChapterClose.jsx"),
  "utf8"
);

test("routeTable registers LM06 EN/GR chapter and preserves educational-ledger child routes", () => {
  assert.match(routesSrc, /path: "\/learning-modules\/lm06"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06"/);
  assert.match(routesSrc, /Lm06Page/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm06\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06\/assessment"/);
  assert.match(routesSrc, /Lm06AssessmentPage/);
  assert.match(routesSrc, /path: "\/learning-modules\/lm06\/educational-ledger"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06\/educational-ledger"/);
  assert.match(routesSrc, /Lm06EducationalLedgerPage/);
  assert.equal(isLmChapterAvailable("LM06"), true);
  assert.equal(getLmChapterRoute("LM06", "en"), "/learning-modules/lm06");
  assert.equal(getLmChapterRoute("LM06", "gr"), "/learning-modules-gr/lm06");
});

test("Lm06Page uses Learning Path disclosures and LM06 view state", () => {
  assert.match(pageSrc, /LmLearningPath/);
  assert.match(pageSrc, /LmProgressSidebar/);
  assert.match(pageSrc, /LmChapterClose/);
  assert.match(pageSrc, /Lm06ConceptPanel/);
  assert.match(pageSrc, /renderEmbed/);
  assert.match(pageSrc, /getLmPageViewState\(progression, locale, "LM06"\)/);
  assert.doesNotMatch(pageSrc, /awardXp|postLm05EducationalLedgerTransfer/i);
});

test("LM06 learning transition from LM05 PENDING and bilingual outcomes", () => {
  const mod = LM_PRESENTATION_REGISTRY.LM06;
  assert.equal(mod.chapterAvailable, true);
  assert.match(mod.transition.from.en, /PENDING/i);
  assert.match(mod.transition.from.gr, /PENDING/i);
  assert.equal(mod.learningOutcomes.en.length, 6);
  assert.equal(mod.learningOutcomes.gr.length, 6);
  assert.equal(mod.title.en, "Consensus & Block Inclusion");
  assert.match(mod.title.gr, /Συναίνεση/);
  const en = getLm06ChapterCopy("en");
  const gr = getLm06ChapterCopy("gr");
  assert.deepEqual(Object.keys(en).sort(), Object.keys(gr).sort());
  assert.match(en.openingQuestion, /PENDING/);
  assert.match(gr.openingQuestion, /PENDING/);
  assert.match(en.lm05Bridge, /LM05/);
  assert.deepEqual(en.spineSteps.slice(0, 2), ["PENDING", "CANDIDATE BLOCK"]);
});

test("Chapter 5 pp. 103–109 required reading present; textbook does not claim QBFT", () => {
  // Compact callout inside chapter — full resource card stays on Learning Path
  assert.match(panelSrc, /data-lm06-required-reading/);
  assert.match(panelSrc, /readingCallout/);
  assert.doesNotMatch(panelSrc, /coversLabel|covers\.map/);
  assert.match(localeSrc, /103–109/);
  assert.match(panelSrc, /data-lm06-qbft-not-in-textbook/);
  assert.match(localeSrc, /not covered in the Chapter 5|does not cover QBFT/i);
  assert.match(localeSrc, /δεν καλύπτεται|δεν καλύπτει το QBFT/);
  const reading = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-chapter5-reading"
  );
  assert.ok(reading);
  assert.equal(reading.presentationOnly, true);
  assert.equal(reading.href, LM01_KALLIPOS_TEXTBOOK_URL);
  assert.match(reading.description.en, /103–109/);
  assert.match(reading.description.en, /does not cover QBFT/i);
  assert.match(reading.title.gr, /Συναίνεση σε Κατανεμημένα Δίκτυα/);
  assert.equal(reading.evidenceId, undefined);
  const en = getLm06ChapterCopy("en");
  assert.match(en.readingCallout, /103–109/);
});

test("PoW and PoS merged into one two-column section with real simulator routes", () => {
  assert.match(panelSrc, /data-lm06-approaches/);
  assert.match(panelSrc, /data-lm06-mechanism=\{dataAttr\}/);
  assert.match(panelSrc, /dataAttr="pow"/);
  assert.match(panelSrc, /dataAttr="pos"/);
  assert.match(panelSrc, /sm:grid-cols-2/);
  assert.doesNotMatch(panelSrc, /VerticalFlow|compare\.rows|headers\.pow/);
  assert.equal(LM06_POW_SIMULATOR_HREF.en, "/tools/mining");
  assert.equal(LM06_POW_SIMULATOR_HREF.gr, "/tools-gr/mining");
  assert.equal(LM06_POS_SIMULATOR_HREF.en, "/tools/pos");
  assert.equal(LM06_POS_SIMULATOR_HREF.gr, "/tools-gr/pos");
  assert.match(panelSrc, /LM06_POW_SIMULATOR_HREF/);
  assert.match(panelSrc, /LM06_POS_SIMULATOR_HREF/);
  assert.match(routesSrc, /path: "\/tools\/mining"/);
  assert.match(routesSrc, /path: "\/tools-gr\/mining"/);
  assert.match(routesSrc, /path: "\/tools\/pos"/);
  assert.match(routesSrc, /path: "\/tools-gr\/pos"/);
  const pow = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-pow-simulator"
  );
  const pos = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-pos-simulator"
  );
  assert.equal(pow.href.en, "/tools/mining");
  assert.equal(pow.href.gr, "/tools-gr/mining");
  assert.equal(pos.href.en, "/tools/pos");
  assert.equal(pos.href.gr, "/tools-gr/pos");
  assert.equal(pow.presentationOnly, true);
  assert.equal(pos.presentationOnly, true);
  assert.equal(pow.evidenceId, undefined);
  assert.equal(pos.evidenceId, undefined);
});

test("permissioned transition, QBFT/Besu, and Educational Ledger activity routes", () => {
  assert.match(panelSrc, /data-lm06-known-validators/);
  assert.match(panelSrc, /data-lm06-permissioned/);
  assert.match(panelSrc, /data-lm06-permissioned-bridge/);
  assert.match(panelSrc, /data-lm06-qbft/);
  assert.match(panelSrc, /data-lm06-proposer-not-alone/);
  assert.match(panelSrc, /data-lm06-your-turn/);
  assert.match(panelSrc, /data-lm06-takeaway/);
  // Dense: no duplicated long vertical consensus stacks in practice section
  assert.doesNotMatch(panelSrc, /SHARED PENDING POOL/);
  assert.equal(
    LM06_EDUCATIONAL_LEDGER_HREF.en,
    "/learning-modules/lm06/educational-ledger"
  );
  assert.equal(
    LM06_EDUCATIONAL_LEDGER_HREF.gr,
    "/learning-modules-gr/lm06/educational-ledger"
  );
  const ledger = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-educational-ledger"
  );
  assert.equal(ledger.href.en, "/learning-modules/lm06/educational-ledger");
  assert.equal(ledger.href.gr, "/learning-modules-gr/lm06/educational-ledger");
  assert.equal(ledger.presentationOnly, false);
  assert.equal(ledger.evidenceId, "lm06-consensus-activity");
});

test("dense chapter uses custom Why/QBFT visuals; no hero flow or old placeholders", () => {
  assert.match(panelSrc, /data-lm06-spine/);
  assert.doesNotMatch(panelSrc, /data-lm06-hero-flow|HeroTransition/);
  assert.doesNotMatch(panelSrc, /data-lm06-visual-placeholder/);
  assert.doesNotMatch(panelSrc, /DISTRIBUTED AGREEMENT/);
  assert.doesNotMatch(panelSrc, /KNOWN VALIDATORS[\s\S]*PROPOSER[\s\S]*VALIDATION[\s\S]*AGREEMENT[\s\S]*FINALITY/);
  assert.match(panelSrc, /LM06_VISUALS\.whyConsensus/);
  assert.match(panelSrc, /LM06_VISUALS\.qbftKnownValidators/);
  assert.match(panelSrc, /data-lm06-why-visual/);
  assert.match(panelSrc, /data-lm06-qbft-visual/);
  assert.match(panelSrc, /LmApprovedVisual/);
  assert.match(pageSrc, /LM06_VISUALS\.hero|visuals\.hero|chapterCopy\.heroImageAlt/);
  assert.match(pageSrc, /heroImageAlt/);
  const en = getLm06ChapterCopy("en");
  const gr = getLm06ChapterCopy("gr");
  assert.ok(en.heroImageAlt);
  assert.ok(gr.heroImageAlt);
  assert.ok(en.why.imageAlt);
  assert.ok(gr.why.imageAlt);
  assert.ok(en.knownValidators.imageAlt);
  assert.ok(gr.knownValidators.imageAlt);
  assert.deepEqual(Object.keys(en.approaches).sort(), Object.keys(gr.approaches).sort());
  assert.deepEqual(
    Object.keys(en.knownValidators).sort(),
    Object.keys(gr.knownValidators).sort()
  );
  assert.match(
    LM_PRESENTATION_REGISTRY.LM06.visuals.hero,
    /lm06-hero-consensus-block-inclusion\.png/
  );
  assert.match(
    LM_PRESENTATION_REGISTRY.LM06.visuals.chapter.whyConsensus,
    /lm06-why-consensus\.png/
  );
  assert.match(
    LM_PRESENTATION_REGISTRY.LM06.visuals.chapter.qbftKnownValidators,
    /lm06-qbft-known-validators\.png/
  );
});
test("LM06 assessment is live internal link with EN/GR routes", () => {
  const assessment = LM_PRESENTATION_REGISTRY.LM06.activities.find(
    (a) => a.id === "lm06-assessment"
  );
  assert.ok(assessment);
  assert.equal(assessment.linkKind, "internal");
  assert.equal(assessment.presentationOnly, false);
  assert.equal(assessment.evidenceId, "lm06-assessment");
  assert.deepEqual(assessment.href, {
    en: "/learning-modules/lm06/assessment",
    gr: "/learning-modules-gr/lm06/assessment",
  });
  assert.equal(ASSESSMENT_ROUTES.en["lm06-assessment"], "/learning-modules/lm06/assessment");
  assert.equal(
    ASSESSMENT_ROUTES.gr["lm06-assessment"],
    "/learning-modules-gr/lm06/assessment"
  );
  assert.match(routesSrc, /path: "\/learning-modules\/lm06\/assessment"/);
  assert.match(routesSrc, /path: "\/learning-modules-gr\/lm06\/assessment"/);
  assert.match(routesSrc, /Lm06AssessmentPage/);
  const visible = getLmVisibleActivities("LM06", "en");
  assert.ok(visible.some((a) => a.id === "lm06-assessment"));
});

test("LM06 Learning Path thumbs and next-step banner use dedicated assets", () => {
  const visuals = LM_PRESENTATION_REGISTRY.LM06.visuals;
  assert.match(visuals.hero, /lm06-hero-consensus-block-inclusion\.png$/);
  assert.match(
    visuals.activityById["lm06-interactive-chapter"],
    /lm06-interactive-chapter\.png$/
  );
  assert.notEqual(
    visuals.activityById["lm06-interactive-chapter"],
    visuals.hero
  );
  assert.equal(
    getLmActivityVisualSrc("LM06", "concept", "lm06-interactive-chapter"),
    "/learning-modules/visuals/lm06/lm06-interactive-chapter.png"
  );
  assert.match(
    visuals.activityById["lm06-assessment"],
    /lm06-assessment\.png$/
  );
  assert.equal(
    getLmActivityVisualSrc("LM06", "assessment", "lm06-assessment"),
    "/learning-modules/visuals/lm06/lm06-assessment.png"
  );
  assert.match(visuals.nextStep, /lm06-next-required-step\.png$/);
  assert.equal(visuals.nextStepAsCard, undefined);
  assert.doesNotMatch(closeSrc, /visualAsCard|data-lm-chapter-close-visual-card/);
  assert.match(closeSrc, /data-lm-chapter-close-native/);
  assert.match(closeSrc, /data-lm-chapter-close-coming-soon/);
  assert.match(closeSrc, /assessmentComingSoon/);
  assert.match(closeSrc, /closingComingSoonHint/);
  assert.match(closeSrc, /alt=""/);
  assert.match(visuals.chapter.whyConsensus, /lm06-why-consensus\.png$/);
  assert.match(
    visuals.chapter.qbftKnownValidators,
    /lm06-qbft-known-validators\.png$/
  );
  // next-required-step is only for chapter-close chrome — not LP assessment thumb
  assert.notEqual(
    visuals.activityById["lm06-assessment"],
    visuals.nextStep
  );
});

test("LM06 page chrome locale parity", () => {
  const en = getLmPageCopy("en", "LM06");
  const gr = getLmPageCopy("gr", "LM06");
  assert.ok(en.learningPathIntro);
  assert.ok(gr.learningPathIntro);
  assert.match(en.assessmentTitle, /LM06/);
  assert.match(gr.assessmentTitle, /LM06/);
  assert.match(en.finishAssessmentCta, /Finish the assessment/i);
  assert.match(gr.finishAssessmentCta, /Ολοκλήρωσε την αξιολόγηση/);
  assert.doesNotMatch(en.learningPathIntro, /not yet available/i);
  assert.doesNotMatch(gr.learningPathIntro, /δεν είναι ακόμη διαθέσιμη/);
  assert.doesNotMatch(en.finishAssessmentCta, /coming soon/i);
  assert.ok(en.closingComingSoonHint);
  assert.ok(gr.closingComingSoonHint);
  assert.ok(en.assessmentComingSoon);
  assert.ok(gr.assessmentComingSoon);
  assert.equal(en.closingNextVisualAlt, undefined);
  assert.equal(gr.closingNextVisualAlt, undefined);
});
