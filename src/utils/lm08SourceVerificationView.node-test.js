/**
 * LM08 source verification view-model tests (Slice 9D1).
 * Run: node --test src/utils/lm08SourceVerificationView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
    buildBlockscoutContractUrl,
    mapSourceVerificationResponse,
    shouldRefetchProgressionAfterSourceVerification,
} from "./lm08SourceVerificationView.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(
    join(__dirname, "../components/learning-modules/Lm08SourceVerificationPanel.jsx"),
    "utf8"
);
const labWritePath = join(__dirname, "labWriteApi.js");

const CONTRACT = "0x1111111111111111111111111111111111111111";

test("created success maps to success_created with refetch", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: true,
            status: 200,
            data: {
                ok: true,
                alreadyApplied: false,
                outcome: "created",
                contractAddress: CONTRACT,
            },
        },
        "en"
    );
    assert.equal(mapped.kind, "success_created");
    assert.equal(mapped.contractAddress, CONTRACT);
    assert.equal(mapped.shouldRefetch, true);
    assert.match(mapped.explorerUrl, /blockexplorer\.dimikog\.org\/address\//);
});

test("alreadyApplied success maps to success_already with refetch", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: true,
            status: 200,
            data: {
                ok: true,
                alreadyApplied: true,
                outcome: "already_applied",
                contractAddress: CONTRACT,
            },
        },
        "en"
    );
    assert.equal(mapped.kind, "success_already");
    assert.equal(mapped.shouldRefetch, true);
});

test("source_not_verified handled despite HTTP 200 wrapper ok false", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 200,
            data: {
                ok: false,
                error: "source_not_verified",
                contractAddress: CONTRACT,
            },
        },
        "en"
    );
    assert.equal(mapped.kind, "not_verified");
    assert.equal(mapped.contractAddress, CONTRACT);
    assert.equal(mapped.shouldRefetch, false);
    assert.equal(
        buildBlockscoutContractUrl(CONTRACT),
        `https://blockexplorer.dimikog.org/address/${CONTRACT}`
    );
});

test("coding01_required maps to Coding01 CTA state", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 400,
            data: { ok: false, error: "coding01_required" },
        },
        "en"
    );
    assert.equal(mapped.kind, "coding01_required");
    assert.match(mapped.copy.goToCoding01, /Coding Lab 01/);
    assert.equal(mapped.copy.coding01Path, "/labs/coding-01/interaction");
});

test("GR coding01 path", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 400,
            data: { ok: false, error: "coding01_required" },
        },
        "gr"
    );
    assert.equal(mapped.copy.coding01Path, "/labs-gr/coding-01/interaction");
});

test("explorer unavailable maps to retry state", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 503,
            data: { ok: false, error: "explorer_unavailable" },
        },
        "en"
    );
    assert.equal(mapped.kind, "explorer_unavailable");
});

test("evidence conflict maps to support state", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 409,
            data: { ok: false, error: "evidence_conflict" },
        },
        "en"
    );
    assert.equal(mapped.kind, "integrity_failure");
});

test("invalid existing evidence maps to support state", () => {
    const mapped = mapSourceVerificationResponse(
        {
            ok: false,
            status: 422,
            data: { ok: false, error: "invalid_existing_evidence" },
        },
        "en"
    );
    assert.equal(mapped.kind, "integrity_failure");
});

test("shouldRefetchProgression only when data.ok true", () => {
    assert.equal(shouldRefetchProgressionAfterSourceVerification({ ok: true }), true);
    assert.equal(shouldRefetchProgressionAfterSourceVerification({ ok: false }), false);
});

test("panel triggers refetchResolvedIdentity on success", () => {
    assert.match(panelSrc, /refetchResolvedIdentity/);
    assert.match(panelSrc, /postLm08SourceVerification/);
    assert.match(panelSrc, /web3edu-progress-updated/);
});

test("panel does not auto POST on mount", () => {
    assert.doesNotMatch(panelSrc, /useEffect\([\s\S]*postLm08SourceVerification/);
});

test("panel has no XP or LM completion mutation", () => {
    assert.doesNotMatch(panelSrc, /xp_total/);
    assert.doesNotMatch(panelSrc, /setLm08/);
    assert.doesNotMatch(panelSrc, /complete.*LM08/i);
});

test("labWriteApi postLm08SourceVerification uses Bearer only", () => {
    const src = readFileSync(labWritePath, "utf8");
    const fn = src.slice(src.indexOf("export async function postLm08SourceVerification"));
    assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
    assert.match(fn, /\/learning-modules\/lm08\/source-verification`/);
    assert.match(fn, /JSON\.stringify\(\{\}\)/);
    assert.equal(fn.includes("contractAddress"), false);
    assert.equal(fn.includes("wallet"), false);
    assert.equal(fn.includes("progressAddress"), false);
});
