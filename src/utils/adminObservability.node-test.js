/**
 * Admin Observability V1 display helpers.
 * Run: node --test src/utils/adminObservability.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
    formatLastActivityEpoch,
    formatLearnerKind,
    formatMetricValue,
    formatSocialRegisteredAt,
    normalizeSocialRegistrationsByWeek,
    truncateLearnerId,
} from "./adminObservability.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, "..");

test("formatLearnerKind maps social and wallet-only", () => {
    assert.equal(formatLearnerKind("social"), "Social");
    assert.equal(formatLearnerKind("wallet_only"), "Wallet-only");
    assert.equal(formatLearnerKind(null, { hasSocial: true }), "Social");
    assert.equal(formatLearnerKind(null, { hasSocial: false }), "Wallet-only");
    assert.equal(formatLearnerKind(null), "—");
});

test("formatSocialRegisteredAt shows dash for wallet-only", () => {
    assert.equal(
        formatSocialRegisteredAt("2026-09-01T12:00:00Z", "wallet_only"),
        "—"
    );
    assert.equal(formatSocialRegisteredAt(null, "social"), "—");
    assert.equal(
        formatSocialRegisteredAt("2026-09-01T12:00:00Z", "social"),
        "1 Sep 2026, 12:00"
    );
});

test("formatLastActivityEpoch null and zero become dash", () => {
    assert.equal(formatLastActivityEpoch(null), "—");
    assert.equal(formatLastActivityEpoch(0), "—");
    assert.equal(formatLastActivityEpoch(""), "—");
    assert.equal(
        formatLastActivityEpoch(Date.parse("2026-09-22T12:00:00.000Z") / 1000),
        "22 Sep 2026, 12:00"
    );
});

test("normalizeSocialRegistrationsByWeek keeps zero weeks", () => {
    const series = normalizeSocialRegistrationsByWeek([
        { weekStartUtc: "2026-09-07", count: 0 },
        { weekStartUtc: "2026-09-14", count: 2 },
    ]);
    assert.equal(series.length, 2);
    assert.equal(series[0].count, 0);
    assert.equal(series[1].count, 2);
    assert.equal(normalizeSocialRegistrationsByWeek(null).length, 0);
});

test("formatMetricValue and truncateLearnerId", () => {
    assert.equal(formatMetricValue(null), "—");
    assert.equal(formatMetricValue(12), 12);
    assert.equal(truncateLearnerId("abcdefghijklmnop"), "abcdef…mnop");
    assert.equal(truncateLearnerId("short"), "short");
    assert.equal(truncateLearnerId(""), null);
});

test("dashboard uses social registrations terminology and ObservabilityOverview", () => {
    const dashboard = readFileSync(join(srcRoot, "pages/AdminDashboard.jsx"), "utf8");
    const overview = readFileSync(
        join(srcRoot, "components/admin/ObservabilityOverview.jsx"),
        "utf8"
    );
    assert.match(dashboard, /ObservabilityOverview/);
    assert.match(overview, /New social registrations/);
    assert.match(overview, /Social registrations by week/);
    assert.doesNotMatch(overview, /New users/);
    assert.match(overview, /Active learners — 7d/);
    assert.match(overview, /Active learners — 30d/);
    assert.match(overview, /Learners with passed assessments/);
    assert.match(overview, /Passed assessments total/);
    assert.match(overview, /Acquisition metrics unavailable/);
    assert.match(overview, /Activity metrics unavailable/);
    assert.match(overview, /Learning module metrics unavailable/);
    assert.match(overview, /MEANINGFUL_ACTIVITY_CAPTION/);
    assert.match(overview, /activity\?\.definitionLabel/);
});

test("users page uses Progress address and learner kind labels", () => {
    const users = readFileSync(join(srcRoot, "pages/admin/AdminUsersPage.jsx"), "utf8");
    assert.match(users, />Progress address</);
    assert.doesNotMatch(users, />Account</);
    assert.match(users, /learnerKindLabel/);
    assert.match(users, /formatLearnerRegistered|formatSocialRegisteredAt/);
    assert.match(users, /Progress address, learner id/);
    assert.match(users, /\bLearners\b/);
    assert.doesNotMatch(users, /Users Analytics/);
    assert.doesNotMatch(users, /UserDistributionChart/);
    assert.doesNotMatch(users, /\bBuilders\b/);
});

test("user details exposes registration and last activity without email/sub", () => {
    const details = readFileSync(
        join(srcRoot, "pages/admin/AdminUserDetailsPage.jsx"),
        "utf8"
    );
    assert.match(details, /Identity & registration/);
    assert.match(details, /Last meaningful activity/);
    assert.match(details, /Registered at/);
    assert.match(details, /Learner kind/);
    assert.match(details, /Progress address/);
    assert.match(details, /Web3Edu Identity \(AA\)/);
    assert.match(details, /Linked EOA/);
    assert.doesNotMatch(details, /keycloakSub/);
    assert.doesNotMatch(details, /label: "Email"/);
});

test("lab details uses Progress address terminology", () => {
    const labs = readFileSync(join(srcRoot, "pages/admin/AdminLabDetails.jsx"), "utf8");
    assert.match(labs, />Progress address</);
    assert.doesNotMatch(labs, />Account</);
});
