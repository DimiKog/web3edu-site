/**
 * Admin Learners directory helpers.
 * Run: node --test src/utils/adminLearnersView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
    buildLearnerDirectoryView,
    countLearnerPopulation,
    filterLearners,
    formatLearnerRegistered,
    isActiveWithinDays,
    matchesActivityFilter,
    sortLearners,
} from "./adminLearnersView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersPageSrc = readFileSync(
    join(__dirname, "../pages/admin/AdminUsersPage.jsx"),
    "utf8"
);

const NOW = Date.parse("2026-09-22T12:00:00.000Z") / 1000;

const sample = [
    {
        learnerId: "social-1",
        learnerKind: "social",
        hasSocial: true,
        socialRegisteredAt: "2026-06-01T10:00:00Z",
        lastActivityEpoch: NOW - 2 * 86400,
        xp: 100,
        hasLinkedWallets: true,
        hasImportedProgress: false,
        provisioningStatus: "active",
        progressAddress: "0xaaa",
        wallet: "0xaaa",
    },
    {
        learnerId: "wallet-1",
        learnerKind: "wallet_only",
        hasSocial: false,
        socialRegisteredAt: null,
        lastActivityEpoch: NOW - 40 * 86400,
        xp: 500,
        hasLinkedWallets: false,
        hasImportedProgress: true,
        provisioningStatus: "",
        progressAddress: "0xbbb",
        wallet: "0xbbb",
    },
    {
        learnerId: "social-2",
        learnerKind: "social",
        hasSocial: true,
        socialRegisteredAt: "2026-08-01T10:00:00Z",
        lastActivityEpoch: null,
        xp: 50,
        hasLinkedWallets: true,
        hasImportedProgress: false,
        provisioningStatus: "pending",
        progressAddress: "0xccc",
        wallet: "0xccc",
    },
    {
        learnerId: "social-3",
        learnerKind: "social",
        hasSocial: true,
        socialRegisteredAt: "2026-09-01T10:00:00Z",
        lastActivityEpoch: NOW - 10 * 86400,
        xp: 200,
        hasLinkedWallets: false,
        hasImportedProgress: false,
        provisioningStatus: "active",
        progressAddress: "0xddd",
        wallet: "0xddd",
    },
];

test("population counts social / wallet-only / active 30d", () => {
    const pop = countLearnerPopulation(sample, NOW);
    assert.equal(pop.total, 4);
    assert.equal(pop.social, 3);
    assert.equal(pop.walletOnly, 1);
    assert.equal(pop.active30d, 2); // 2d and 10d ago
});

test("activity filters use meaningful lastActivityEpoch windows", () => {
    assert.equal(isActiveWithinDays(NOW - 2 * 86400, 7, NOW), true);
    assert.equal(isActiveWithinDays(NOW - 10 * 86400, 7, NOW), false);
    assert.equal(isActiveWithinDays(null, 30, NOW), false);

    const active7 = filterLearners(sample, { activityFilter: "active7d", nowEpoch: NOW });
    assert.equal(active7.length, 1);
    assert.equal(active7[0].learnerId, "social-1");

    const active30 = filterLearners(sample, { activityFilter: "active30d", nowEpoch: NOW });
    assert.equal(active30.length, 2);

    const inactive = filterLearners(sample, { activityFilter: "inactive30d", nowEpoch: NOW });
    assert.equal(inactive.length, 2);
    assert.ok(inactive.every((u) => !matchesActivityFilter(u.lastActivityEpoch, "active30d", NOW)));
});

test("default sort is last activity newest-first; missing sorts last", () => {
    const sorted = sortLearners(sample, "lastActivity", "desc");
    assert.equal(sorted[0].learnerId, "social-1");
    assert.equal(sorted[1].learnerId, "social-3");
    assert.equal(sorted[2].learnerId, "wallet-1");
    assert.equal(sorted[3].learnerId, "social-2"); // null activity last
});

test("registration formatting hides wallet-only dates", () => {
    assert.equal(formatLearnerRegistered(sample[0]), "1 Jun 2026, 10:00");
    assert.equal(formatLearnerRegistered(sample[1]), "—");
});

test("directory view wires population + filters + sort", () => {
    const view = buildLearnerDirectoryView(sample, {
        kindFilter: "social",
        sortKey: "xp",
        sortDir: "desc",
        nowEpoch: NOW,
    });
    assert.equal(view.population.social, 3);
    assert.equal(view.sorted.length, 3);
    assert.equal(view.sorted[0].xp, 200);
});

test("learners page drops legacy analytics presentation", () => {
    assert.match(usersPageSrc, /\bLearners\b/);
    assert.match(usersPageSrc, /Canonical learner roster, identity, and activity/);
    assert.match(usersPageSrc, /Active — 30d/);
    assert.match(usersPageSrc, /Social learners/);
    assert.match(usersPageSrc, /Wallet-only learners/);
    assert.match(usersPageSrc, /buildLearnerDirectoryView/);
    assert.match(usersPageSrc, /active7d/);
    assert.match(usersPageSrc, /inactive30d/);
    assert.match(usersPageSrc, /lastActivity/);
    assert.match(usersPageSrc, /hasLinkedWallets \? "Yes" : "No"/);
    assert.match(usersPageSrc, /table-fixed/);
    assert.match(usersPageSrc, /truncateAddress\(user\.wallet\)/);

    // Column order: Last activity before XP
    const lastActivityTh = usersPageSrc.indexOf('label={`Last activity${sortIndicator("lastActivity")}`}');
    const xpTh = usersPageSrc.indexOf('label={`XP${sortIndicator("xp")}`}');
    assert.ok(lastActivityTh > 0 && xpTh > lastActivityTh, "Last activity column should precede XP");

    assert.doesNotMatch(usersPageSrc, /Users Analytics/);
    assert.doesNotMatch(usersPageSrc, /UserDistributionChart/);
    assert.doesNotMatch(usersPageSrc, /\bBuilders\b/);
    assert.doesNotMatch(usersPageSrc, /\bExplorers\b/);
    assert.doesNotMatch(usersPageSrc, /Drop-off Users/);
    assert.doesNotMatch(usersPageSrc, /User Tiers/);
    assert.doesNotMatch(usersPageSrc, /Engagement Level/);
    assert.doesNotMatch(usersPageSrc, /engagementScore/);
    assert.doesNotMatch(usersPageSrc, /dropoffOnly/);
    assert.doesNotMatch(usersPageSrc, /tierFilter/);
    assert.doesNotMatch(usersPageSrc, />Tier</);
    assert.doesNotMatch(usersPageSrc, />Started</);
    assert.doesNotMatch(usersPageSrc, />Completed</);
    assert.doesNotMatch(usersPageSrc, /Drop-Off/);
    assert.doesNotMatch(usersPageSrc, />Engagement</);
    assert.doesNotMatch(usersPageSrc, /keycloakSub/);
    assert.doesNotMatch(usersPageSrc, /label: "Email"/);
    assert.doesNotMatch(usersPageSrc, /\$\{user\.linkedWallets\.length\}/);
});
