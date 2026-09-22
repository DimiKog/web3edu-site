/**
 * Admin User Details view helpers.
 * Run: node --test src/utils/adminUserDetailsView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
    INFERRED_PROJECT_START_LABEL,
    buildLabTitleLookup,
    formatProjectStartedDisplay,
    groupXpBreakdown,
    normalizeActivityTimeline,
    normalizeCompletedLabs,
    normalizeIncompleteLabs,
    normalizeProjectProgressItems,
    projectTableColumnFlags,
} from "./adminUserDetailsView.js";
import { formatAdminDateTime } from "./adminObservability.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const detailsSrc = readFileSync(
    join(__dirname, "../pages/admin/AdminUserDetailsPage.jsx"),
    "utf8"
);

test("formatAdminDateTime renders concise UTC datetime", () => {
    assert.equal(formatAdminDateTime(null), "—");
    assert.equal(formatAdminDateTime("not-a-date"), "—");
    assert.equal(
        formatAdminDateTime("2026-06-17T20:07:23.284066+00:00"),
        "17 Jun 2026, 20:07"
    );
    assert.equal(
        formatAdminDateTime("2026-09-18T18:21:00.000Z"),
        "18 Sep 2026, 18:21"
    );
    assert.equal(
        formatAdminDateTime(Date.parse("2026-09-18T18:21:00.000Z") / 1000),
        "18 Sep 2026, 18:21"
    );
});

test("completed labs use titles and newest-first order", () => {
    const rows = normalizeCompletedLabs([
        {
            labId: "lab01",
            title: { en: "Wallets & Keys" },
            completedAt: "2026-01-01T00:00:00Z",
            xp: 100,
        },
        {
            labId: "lab02",
            title: { en: "Transactions" },
            completedAt: "2026-06-01T00:00:00Z",
            xp: 100,
        },
    ]);
    assert.equal(rows[0].title, "Transactions");
    assert.equal(rows[1].title, "Wallets & Keys");
    assert.equal(rows[0].dateLabel, "1 Jun 2026, 00:00");
});

test("incomplete labs reuse completed titles when available", () => {
    const lookup = buildLabTitleLookup([
        { labId: "lab03", title: { en: "Smart Contracts" } },
    ]);
    const rows = normalizeIncompleteLabs(
        [{ labId: "lab03", startedAt: "2026-03-01T12:00:00Z", inferred: true }],
        lookup
    );
    assert.equal(rows[0].title, "Smart Contracts");
    assert.equal(rows[0].inferred, true);
});

test("xp groups labs/projects/modules without inventing values", () => {
    const groups = groupXpBreakdown(
        {
            labs: [{ labId: "lab01", xp: 100 }],
            projects: [{ projectId: "poe01", xp: 500 }],
            lessons: [],
        },
        {
            timeline: [
                {
                    type: "assessment",
                    id: "LM05",
                    title: { en: "LM05 — Assessment completed" },
                    xp: 200,
                    completedAt: "2026-09-18T18:21:00Z",
                },
            ],
            labTitles: { lab01: "Wallets & Keys" },
            projectTitles: { poe01: "Proof of Escape" },
        }
    );
    assert.equal(groups.length, 3);
    assert.equal(groups[0].title, "Labs");
    assert.equal(groups[0].items[0].label, "Wallets & Keys");
    assert.equal(groups[0].totalXp, 100);
    assert.equal(groups[1].title, "Projects");
    assert.equal(groups[2].title, "Learning modules");
    assert.equal(groups[2].totalXp, 200);
});

test("timeline newest-first and assessment wording", () => {
    const rows = normalizeActivityTimeline([
        {
            type: "lab",
            id: "lab01",
            title: { en: "Wallets & Keys" },
            completedAt: "2026-01-01T00:00:00Z",
            xp: 100,
        },
        {
            type: "assessment",
            id: "LM05",
            title: { en: "LM05 — Assessment completed" },
            completedAt: "2026-09-18T18:21:00Z",
            xp: 200,
        },
        {
            type: "project",
            id: "poe01",
            title: { en: "Proof of Escape" },
            status: "completed",
            completedAt: "2026-06-01T00:00:00Z",
            xp: 500,
        },
    ]);
    assert.equal(rows[0].what, "Assessment completed");
    assert.equal(rows[0].title, "LM05 — Assessment completed");
    assert.equal(rows[0].dateLabel, "18 Sep 2026, 18:21");
    assert.equal(rows[1].what, "Project completed");
    assert.equal(rows[2].what, "Lab completed");
});

test("project table hides unused columns", () => {
    const flags = projectTableColumnFlags([
        {
            projectId: "poe01",
            status: "completed",
            completedAt: "2026-06-01T00:00:00Z",
            xpAwarded: 500,
        },
    ]);
    assert.equal(flags.completed, true);
    assert.equal(flags.xp, true);
    assert.equal(flags.started, false);
    assert.equal(flags.submitted, false);
    assert.equal(flags.evidence, false);
    assert.equal(flags.review, false);
});

test("inferred project start displays Unknown, not a genuine date", () => {
    const display = formatProjectStartedDisplay({
        projectId: "poe01",
        startedAt: "2026-02-11T12:49:56.059299+00:00",
        inferred: true,
        completedAt: "2026-02-11T12:49:56.059299+00:00",
    });
    assert.equal(display.startedIsInferred, true);
    assert.equal(display.startedLabel, INFERRED_PROJECT_START_LABEL);
    assert.doesNotMatch(display.startedLabel, /2026/);
    assert.doesNotMatch(display.startedLabel, /Feb/);

    const rows = normalizeProjectProgressItems([
        {
            projectId: "poe01",
            status: "completed",
            startedAt: "2026-02-11T12:49:56.059299+00:00",
            inferred: true,
            completedAt: "2026-02-11T12:49:56.059299+00:00",
            xpAwarded: 500,
        },
    ]);
    assert.equal(rows[0].startedLabel, INFERRED_PROJECT_START_LABEL);
    assert.equal(rows[0].startedIsInferred, true);
    assert.equal(rows[0].completedLabel, formatAdminDateTime("2026-02-11T12:49:56.059299+00:00"));
    assert.equal(rows[0].completedLabel, "11 Feb 2026, 12:49");

    const flags = projectTableColumnFlags(rows);
    assert.equal(flags.started, true);
    assert.equal(flags.completed, true);
});

test("genuine project start keeps formatted date; completion unchanged", () => {
    const display = formatProjectStartedDisplay({
        projectId: "poe01",
        startedAt: "2026-03-01T10:00:00.000Z",
        inferred: false,
        completedAt: "2026-03-02T15:30:00.000Z",
    });
    assert.equal(display.startedIsInferred, false);
    assert.equal(display.startedLabel, "1 Mar 2026, 10:00");

    const rows = normalizeProjectProgressItems([
        {
            projectId: "poe01",
            status: "completed",
            startedAt: "2026-03-01T10:00:00.000Z",
            inferred: false,
            completedAt: "2026-03-02T15:30:00.000Z",
            xpAwarded: 500,
        },
    ]);
    assert.equal(rows[0].startedLabel, "1 Mar 2026, 10:00");
    assert.equal(rows[0].completedLabel, "2 Mar 2026, 15:30");
    assert.equal(rows[0].startedIsInferred, false);
});

test("details page uses Advanced details and readable date helper", () => {
    assert.match(detailsSrc, /Advanced details/);
    assert.match(detailsSrc, /formatAdminDateTime/);
    assert.match(detailsSrc, /normalizeActivityTimeline/);
    assert.match(detailsSrc, /groupXpBreakdown/);
    assert.match(detailsSrc, /normalizeProjectProgressItems/);
    assert.match(detailsSrc, /items-start/);
    assert.match(detailsSrc, /activityEventMeta/);
    assert.match(detailsSrc, /accent="cyan"/);
    assert.match(detailsSrc, /accent="emerald"/);
    assert.match(detailsSrc, /accent="amber"/);
    assert.match(detailsSrc, /accent="violet"/);
    assert.doesNotMatch(detailsSrc, /ProgressSourceHelper/);
    assert.doesNotMatch(detailsSrc, /keycloakSub/);
    assert.doesNotMatch(detailsSrc, /label: "Email"/);
    assert.doesNotMatch(detailsSrc, /system-lab-s1/);
});
