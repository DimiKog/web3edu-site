/**
 * Dashboard v2 composition / record helpers.
 * Run: node --test src/utils/dashboardRecordView.node-test.js src/utils/dashboardJourneyView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getDashboardRecordMetrics,
  hasGenesisBadgeInMetadata,
  getTimelineCompactStats,
  getPassedAssessmentTimelineEntries,
} from "./dashboardRecordView.js";
import { DASHBOARD_COMPOSITION_LOCALE } from "../content/dashboardCompositionLocale.js";
import { DASHBOARD_JOURNEY_LOCALE } from "../content/dashboardJourneyLocale.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

const dashboardSrc = readFileSync(join(__dirname, "../pages/Dashboard.jsx"), "utf8");
const dashboardGrSrc = readFileSync(join(__dirname, "../pages/DashboardGR.jsx"), "utf8");
const nextStepSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardNextStepCard.jsx"),
  "utf8"
);
const journeyCardSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardLearningJourneyCard.jsx"),
  "utf8"
);
const proofSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardProofCard.jsx"),
  "utf8"
);
const identityStripSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardIdentityStrip.jsx"),
  "utf8"
);
const recordSrc = readFileSync(
  join(__dirname, "../components/dashboard-v2/DashboardRecordCard.jsx"),
  "utf8"
);
const projectsSrc = readFileSync(
  join(__dirname, "../components/DashboardProjectsProgress.jsx"),
  "utf8"
);
const timelineSrc = readFileSync(
  join(__dirname, "../components/LearningTimeline.jsx"),
  "utf8"
);

test("locked visual assets exist at exact paths", () => {
  assert.ok(
    existsSync(join(root, "public/assets/dashboard-v2/dashboard-next-action.png"))
  );
  assert.ok(
    existsSync(join(root, "public/assets/dashboard-v2/dashboard-learning-journey.png"))
  );
  assert.ok(
    existsSync(join(root, "public/assets/dashboard-v2/dashboard-profile-anchor.png"))
  );
});

test("composition assets wired into Next Action / Journey / Proof cards", () => {
  assert.match(nextStepSrc, /dashboard-next-action\.png/);
  assert.match(journeyCardSrc, /dashboard-learning-journey\.png/);
  assert.match(proofSrc, /dashboard-profile-anchor\.png/);
  assert.doesNotMatch(nextStepSrc, /AcademicCapIcon/);
});

test("compact identity strip has no legacy XP tier badge", () => {
  assert.doesNotMatch(identityStripSrc, /tier \?\?/);
  assert.doesNotMatch(identityStripSrc, /\{tier\}/);
  assert.match(identityStripSrc, /sbtLabel/);
  assert.match(identityStripSrc, /legacyStatusLabel/);
  assert.doesNotMatch(identityStripSrc, /metadata\.tier/);
  assert.doesNotMatch(identityStripSrc, /xp_total/);
  assert.match(dashboardSrc, /DashboardIdentityStrip/);
  assert.match(dashboardGrSrc, /DashboardIdentityStrip/);
  assert.match(dashboardSrc, /getLegacyBuilderStatusLabel/);
  assert.match(dashboardGrSrc, /getLegacyBuilderStatusLabel/);
});

test("Dashboard no longer mounts legacy Progress XP tier card or top VerifiableProfileCard", () => {
  assert.doesNotMatch(dashboardSrc, /XPProgressCard/);
  assert.doesNotMatch(dashboardGrSrc, /XPProgressCard/);
  assert.doesNotMatch(dashboardSrc, /Current Tier/);
  assert.doesNotMatch(dashboardSrc, /<VerifiableProfileCard/);
  assert.doesNotMatch(dashboardGrSrc, /<VerifiableProfileCard/);
  assert.match(dashboardSrc, /DashboardProofCard/);
  assert.match(dashboardSrc, /DashboardRecordCard/);
  assert.match(dashboardGrSrc, /DashboardProofCard/);
});

test("Record metrics use historical data without LM completion implication", () => {
  const metrics = getDashboardRecordMetrics({
    xp_total: 2850,
    labs_completed: { lab01: {}, lab02: {} },
    projectsCompleted: { "decrypt-message": {}, "proof-of-escape": {} },
    badges: ["Wallet"],
    eventBadges: ["Genesis"],
  });
  assert.equal(metrics.xp, 2850);
  assert.equal(metrics.labsCompleted, 2);
  assert.equal(metrics.projectsCount, 2);
  assert.equal(metrics.badgesCount, 2);
  assert.equal(metrics.hasPoe, true);
  assert.equal(metrics.hasGenesis, true);
  assert.doesNotMatch(recordSrc, /getProgressFromXpTotal/);
  assert.doesNotMatch(recordSrc, /Next Milestone/);
  assert.doesNotMatch(recordSrc, /Current Tier/);
});

test("Proof card targets canonical AA via useProfileAnchorStatus", () => {
  assert.match(proofSrc, /useProfileAnchorStatus/);
  assert.match(proofSrc, /canonicalIdentityAddress/);
  assert.match(proofSrc, /VERIFIED/);
  assert.match(proofSrc, /OUTDATED/);
  assert.match(proofSrc, /NOT_ANCHORED/);
  assert.match(proofSrc, /INVALID/);
  assert.match(proofSrc, /API_UNAVAILABLE/);
});

test("Recent Activity is no longer rendered; Projects and Timeline remain", () => {
  assert.doesNotMatch(dashboardSrc, /DashboardRecentActivity/);
  assert.doesNotMatch(dashboardGrSrc, /DashboardRecentActivity/);
  assert.ok(
    !existsSync(
      join(__dirname, "../components/dashboard-v2/DashboardRecentActivity.jsx")
    )
  );
  assert.match(dashboardSrc, /DashboardProjectsProgress/);
  assert.match(dashboardSrc, /LearningTimeline/);
  assert.match(dashboardGrSrc, /DashboardProjectsProgress/);
  assert.match(dashboardGrSrc, /LearningTimeline/);
});

test("Projects title and empty-state use neutral wording (not Builder Projects)", () => {
  assert.doesNotMatch(projectsSrc, /Builder Projects/);
  assert.doesNotMatch(projectsSrc, /Builder project/);
  assert.match(projectsSrc, /title:\s*"Projects"/);
  assert.match(projectsSrc, /title:\s*"Έργα"/);
  assert.match(
    projectsSrc,
    /Your project progress will appear here once you start a project\./
  );
  assert.match(
    projectsSrc,
    /Η πρόοδος στα projects θα εμφανιστεί εδώ μόλις ξεκινήσεις ένα project\./
  );
  assert.match(projectsSrc, /projectsLink:\s*"\/projects"/);
  assert.match(projectsSrc, /projectsLink:\s*"\/projects-gr"/);
  assert.match(projectsSrc, /viewProjects:\s*"View Projects"/);
  assert.match(projectsSrc, /to=\{copy\.projectsLink\}/);
});

test("Record metric icons are slightly larger than base h-11/h-6", () => {
  assert.match(recordSrc, /h-12 w-12/);
  assert.match(recordSrc, /h-7 w-7/);
  assert.doesNotMatch(recordSrc, /h-11 w-11/);
  assert.doesNotMatch(recordSrc, /Icon className="h-6 w-6"/);
});

test("Genesis Badge appears only when learner state says earned", () => {
  assert.equal(hasGenesisBadgeInMetadata({ eventBadges: ["Genesis"] }), true);
  assert.equal(
    hasGenesisBadgeInMetadata({ eventBadges: [{ name: "Genesis Badge" }] }),
    true
  );
  assert.equal(hasGenesisBadgeInMetadata({ eventBadges: ["Wallet"] }), false);
  assert.equal(hasGenesisBadgeInMetadata({}), false);
  assert.equal(getDashboardRecordMetrics({ eventBadges: ["Genesis"] }).hasGenesis, true);
  assert.equal(getDashboardRecordMetrics({ badges: ["Wallet"] }).hasGenesis, false);

  assert.match(recordSrc, /showGenesis/);
  assert.match(recordSrc, /genesisBadge/);
  assert.match(recordSrc, /hasGenesisBadge/);
  assert.match(dashboardSrc, /hasGenesisBadge=\{hasGenesisBadgeEffective\}/);
  assert.match(dashboardGrSrc, /hasGenesisBadge=\{hasGenesisBadgeEffective\}/);
});

test("PoE row remains in Record card", () => {
  assert.match(recordSrc, /poeEarned/);
  assert.match(recordSrc, /metrics\.hasPoe/);
  assert.equal(
    getDashboardRecordMetrics({
      projectsCompleted: { "proof-of-escape": {} },
    }).hasPoe,
    true
  );
  assert.equal(getDashboardRecordMetrics({ labs_completed: { lab01: {} } }).hasPoe, false);
});

test("EN/GR composition locale parity includes Genesis label", () => {
  assert.deepEqual(
    Object.keys(DASHBOARD_COMPOSITION_LOCALE.en).sort(),
    Object.keys(DASHBOARD_COMPOSITION_LOCALE.gr).sort()
  );
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.genesisBadge, "Genesis Badge");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.genesisBadge, "Genesis Badge");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.showTimeline, "Show timeline ↓");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.showTimeline, "Προβολή χρονολογίου ↓");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.hideTimeline, "Hide timeline ↑");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.hideTimeline, "Απόκρυψη χρονολογίου ↑");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.timelineXp, "Timeline XP");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.timelineXp, "XP χρονολογίου");
  assert.deepEqual(
    Object.keys(DASHBOARD_JOURNEY_LOCALE.en).sort(),
    Object.keys(DASHBOARD_JOURNEY_LOCALE.gr).sort()
  );
});

test("Record and Verifiable Profile row uses equal-height stretch on desktop", () => {
  assert.match(dashboardSrc, /lg:items-stretch/);
  assert.match(dashboardGrSrc, /lg:items-stretch/);
  assert.doesNotMatch(dashboardSrc, /lg:items-start/);
  assert.doesNotMatch(dashboardGrSrc, /lg:items-start/);
  assert.match(recordSrc, /h-full/);
  assert.match(proofSrc, /h-full/);
  assert.match(proofSrc, /flex h-full flex-col|flex h-full/);
});

test("Learning Timeline is collapsed by default with Labs/Projects/Assessments/Activities", () => {
  assert.match(timelineSrc, /useState\(false\)/);
  assert.match(timelineSrc, /getTimelineCompactStats/);
  assert.match(timelineSrc, /data-timeline-expanded/);
  assert.match(timelineSrc, /data-compact-metric/);
  assert.match(timelineSrc, /composition\.showTimeline/);
  assert.match(timelineSrc, /composition\.hideTimeline/);

  const stats = getTimelineCompactStats([
    { type: "lab", xp: 100 },
    { type: "lab", xp: 200 },
    { type: "project", xp: 500 },
    { type: "assessment", xp: 150 },
    { type: "lesson", xp: 50 },
  ]);
  assert.equal(stats.labs, 2);
  assert.equal(stats.projects, 1);
  assert.equal(stats.assessments, 1);
  assert.equal(stats.activities, 5);
  assert.equal(stats.timelineXp, 1000);

  assert.match(timelineSrc, /key: "labs"/);
  assert.match(timelineSrc, /key: "projects"/);
  assert.match(timelineSrc, /key: "assessments"/);
  assert.match(timelineSrc, /key: "activities"/);
  assert.doesNotMatch(timelineSrc, /key: "timelineXp"/);
  assert.doesNotMatch(timelineSrc, /key: "lessons"/);
  assert.doesNotMatch(timelineSrc, /key: "quizzes"/);
  assert.match(timelineSrc, /border-sky-/);
  assert.match(timelineSrc, /border-violet-/);
  assert.match(timelineSrc, /border-emerald-/);
  assert.match(timelineSrc, /border-indigo-/);
});

test("Timeline XP helper remains distinct from Record Total XP (not shown collapsed)", () => {
  const record = getDashboardRecordMetrics({ xp_total: 6500 });
  const timeline = getTimelineCompactStats([
    { type: "lab", xp: 3000 },
    { type: "project", xp: 2800 },
  ]);
  assert.equal(record.xp, 6500);
  assert.equal(timeline.timelineXp, 5800);
  assert.notEqual(record.xp, timeline.timelineXp);
  assert.doesNotMatch(timelineSrc, /xp_total/);
  assert.doesNotMatch(timelineSrc, /getDashboardRecordMetrics/);
  assert.doesNotMatch(timelineSrc, /composition\.timelineXp/);
});

test("Show/Hide timeline toggles expanded feed vs collapsed metrics", () => {
  assert.match(timelineSrc, /setExpanded\(\(v\) => !v\)/);
  assert.match(timelineSrc, /!expanded \? \(/);
  assert.match(timelineSrc, /\{expanded \? \(/);
  assert.match(timelineSrc, /useState\(false\)/);

  const expandedIdx = timelineSrc.indexOf("{expanded ? (");
  assert.ok(expandedIdx > 0);
  const expandedBranch = timelineSrc.slice(expandedIdx);
  assert.match(expandedBranch, /filters\.map/);
  assert.match(expandedBranch, /groupedTimeline\.map/);
  assert.match(expandedBranch, /type === "assessment"/);
  assert.match(expandedBranch, /tracking-\[0\.16em\]/);
  assert.match(timelineSrc, /id: "assessment"/);
  assert.match(timelineSrc, /assessment: "Assessments"/);
  assert.match(timelineSrc, /assessment: "Αξιολογήσεις"/);

  const collapsedIdx = timelineSrc.indexOf("{!expanded ? (");
  assert.ok(collapsedIdx > 0);
  const collapsedBranch = timelineSrc.slice(
    collapsedIdx,
    timelineSrc.indexOf("{expanded ? (")
  );
  assert.match(collapsedBranch, /data-compact-metric/);
  assert.doesNotMatch(collapsedBranch, /filters\.map/);
  assert.doesNotMatch(collapsedBranch, /groupedTimeline/);
});

test("Passed LM assessments project into Dashboard timeline merge", () => {
  const entries = getPassedAssessmentTimelineEntries(
    {
      moduleAssessments: {
        v2: {
          LM03: {
            passed: true,
            completedAt: "2026-05-01T12:00:00+00:00",
            xpAwarded: 150,
          },
          LM01: {
            passed: false,
            completedAt: "2026-04-01T12:00:00+00:00",
            xpAwarded: 100,
          },
          LM02: {
            passed: true,
            completedAt: "",
            xpAwarded: 150,
          },
        },
      },
    },
    "en"
  );
  assert.equal(entries.length, 1);
  assert.equal(entries[0].type, "assessment");
  assert.equal(entries[0].id, "LM03");
  assert.equal(entries[0].xp, 150);
  assert.equal(entries[0].title, "LM03 — Assessment completed");

  const gr = getPassedAssessmentTimelineEntries(
    {
      v2: {
        LM03: {
          passed: true,
          completedAt: "2026-05-01T12:00:00+00:00",
          xpAwarded: 150,
        },
      },
    },
    "gr"
  );
  assert.equal(gr[0].title, "LM03 — Ολοκλήρωση αξιολόγησης");

  assert.match(dashboardSrc, /getPassedAssessmentTimelineEntries/);
  assert.match(dashboardGrSrc, /getPassedAssessmentTimelineEntries/);
  assert.match(dashboardSrc, /assessment:\$\{entry\.id\}/);
  assert.match(timelineSrc, /type === "assessment"/);
  assert.doesNotMatch(timelineSrc, /learning_module_evidence/);
  assert.doesNotMatch(dashboardSrc, /learning_module_evidence/);
});

test("Proof card uses balanced vertical flex composition", () => {
  assert.match(proofSrc, /justify-between/);
  assert.match(proofSrc, /flex-1 flex-col/);
  assert.match(proofSrc, /h-full/);
});

test("OUTDATED learner-facing badge wording is progress-since-seal (EN/GR)", () => {
  const copySrc = readFileSync(
    join(__dirname, "../content/verifiableProfileCopy.js"),
    "utf8"
  );
  assert.match(copySrc, /statusOutdatedShort:\s*"New progress since last seal"/);
  assert.match(copySrc, /statusOutdatedShort:\s*"Νεότερη πρόοδος από τη σφράγιση"/);
  assert.doesNotMatch(copySrc, /statusOutdatedShort:\s*"Outdated"/);
  assert.match(proofSrc, /statusOutdatedShort/);
  assert.match(proofSrc, /case "OUTDATED"/);
});

test("EN/GR locale includes assessment / activities compact labels", () => {
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.en.timelineCompactAssessments,
    "Assessments"
  );
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.gr.timelineCompactAssessments,
    "Αξιολογήσεις"
  );
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.en.timelineCompactActivities,
    "Activities"
  );
  assert.equal(
    DASHBOARD_COMPOSITION_LOCALE.gr.timelineCompactActivities,
    "Δραστηριότητες"
  );
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.achievements, "Badges");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.achievements, "Badges");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.en.projectsSection, "Projects");
  assert.equal(DASHBOARD_COMPOSITION_LOCALE.gr.projectsSection, "Έργα");
});
