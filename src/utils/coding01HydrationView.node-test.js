import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import {
    applyCoding01Hydration,
    shouldShowDeploymentAttributionFromHydration,
} from "./coding01HydrationView.js";

const here = dirname(fileURLToPath(import.meta.url));

test("applyCoding01Hydration returns null for unverified status", () => {
    assert.equal(applyCoding01Hydration({ ok: true, verified: false }), null);
    assert.equal(applyCoding01Hydration(null), null);
});

test("hydrated verified Coding01 prefills canonical contract", () => {
    const hydrated = applyCoding01Hydration({
        ok: true,
        verified: true,
        contractAddress: "0xabcabcabcabcabcabcabcabcabcabcabcabcabca",
        verifiedAt: "2026-06-17T00:00:00+00:00",
        deploymentAttributed: false,
    });
    assert.equal(
        hydrated.contractAddressInput,
        "0xabcabcabcabcabcabcabcabcabcabcabcabcabca"
    );
});

test("hydrated verified Coding01 marks local verification state", () => {
    const hydrated = applyCoding01Hydration({
        ok: true,
        verified: true,
        contractAddress: "0xabcabcabcabcabcabcabcabcabcabcabcabcabca",
        deploymentAttributed: false,
    });
    assert.equal(hydrated.contractVerified, true);
    assert.equal(hydrated.verificationResult.alreadyVerified, true);
});

test("hydrated attributed Coding01 shows ownership already verified", () => {
    const hydrated = applyCoding01Hydration({
        ok: true,
        verified: true,
        contractAddress: "0xabcabcabcabcabcabcabcabcabcabcabcabcabca",
        deploymentAttributed: true,
        deployerAddress: "0xdefdefdefdefdefdefdefdefdefdefdefdefdefde",
        deploymentTxHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
    });
    assert.equal(hydrated.deploymentAttributed, true);
    assert.equal(hydrated.deploymentAttributionResult.alreadyAttributed, true);
});

test("hydrated verified-but-not-attributed shows attribution action eligibility", () => {
    const hydrated = applyCoding01Hydration({
        ok: true,
        verified: true,
        contractAddress: "0xabcabcabcabcabcabcabcabcabcabcabcabcabca",
        deploymentAttributed: false,
    });
    assert.equal(shouldShowDeploymentAttributionFromHydration(hydrated), true);
});

test("fresh learner hydration remains null/default", () => {
    assert.equal(
        applyCoding01Hydration({ ok: true, verified: false, deploymentAttributed: false }),
        null
    );
});

test("CodingLabInteraction1 hydrates from fetchCoding01Status on mount", () => {
    const src = readFileSync(join(here, "../pages/labs/CodingLabInteraction1.jsx"), "utf8");
    assert.match(src, /fetchCoding01Status/);
    assert.match(src, /applyCoding01Hydration/);
    assert.match(src, /useEffect/);
});

test("CodingLabInteraction1 hydration failure is non-blocking", () => {
    const src = readFileSync(join(here, "../pages/labs/CodingLabInteraction1.jsx"), "utf8");
    assert.match(src, /catch \{[\s\S]*non-blocking/);
});

test("CodingLabInteraction1 has no XP mutation in hydration path", () => {
    const src = readFileSync(join(here, "../pages/labs/CodingLabInteraction1.jsx"), "utf8");
    const hydrationBlock = src.slice(src.indexOf("hydrateCoding01Status"), src.indexOf("const stepItems"));
    assert.equal(hydrationBlock.includes("xp_total"), false);
    assert.equal(hydrationBlock.includes("postLabsComplete"), false);
});

test("fetchCoding01Status uses Bearer GET only", () => {
    const src = readFileSync(join(here, "labWriteApi.js"), "utf8");
    const start = src.indexOf("export async function fetchCoding01Status");
    const end = src.indexOf("/**\n * POST /labs/coding01/verify-contract");
    const fn = src.slice(start, end);
    assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
    assert.match(fn, /\/labs\/coding01\/status`/);
    assert.match(fn, /method:\s*"GET"/);
    assert.equal(fn.includes("wallet"), false);
    assert.equal(fn.includes("contractAddress:"), false);
});

test("contract_conflict behavior untouched in verify merge", () => {
    const backendPath = join(here, "../../../web3edu-backend/utils/coding_labs.py");
    const src = readFileSync(backendPath, "utf8");
    assert.match(src, /Coding01VerificationConflictError/);
    assert.match(src, /already exists for a different contract address/);
});

test("LM08 pages use shared LearningModuleActivityShell", () => {
    const inspectionPage = readFileSync(
        join(here, "../pages/learning-modules/Lm08ContractInspectionPage.jsx"),
        "utf8"
    );
    const sourcePage = readFileSync(
        join(here, "../pages/learning-modules/Lm08SourceVerificationPage.jsx"),
        "utf8"
    );
    assert.match(inspectionPage, /LearningModuleActivityShell/);
    assert.match(sourcePage, /LearningModuleActivityShell/);
    assert.match(inspectionPage, /moduleId="LM08"/);
    assert.match(sourcePage, /moduleId="LM08"/);
});
test("EN shell labels and dashboard navigation", () => {
    const shell = readFileSync(
        join(here, "../components/learning-modules/LearningModuleActivityShell.jsx"),
        "utf8"
    );
    const locale = readFileSync(join(here, "../content/learningModuleActivityShellLocale.js"), "utf8");
    assert.match(shell, /getLearningModuleActivityShellCopy/);
    assert.match(locale, /dashboardPath: "\/dashboard"/);
    assert.match(locale, /breadcrumbDashboard: "Dashboard"/);
});

test("GR shell labels and dashboard navigation", () => {
    const locale = readFileSync(join(here, "../content/learningModuleActivityShellLocale.js"), "utf8");
    assert.match(locale, /dashboardPath: "\/dashboard-gr"/);
    assert.match(locale, /breadcrumbDashboard: "Πίνακας Ελέγχου"/);
});

test("Contract Inspection panel keeps evidence API logic", () => {
    const panel = readFileSync(
        join(here, "../components/learning-modules/Lm08ContractInspectionPanel.jsx"),
        "utf8"
    );
    assert.match(panel, /fetchLm08ContractInspectionChallenge/);
    assert.match(panel, /postLm08ContractInspectionAnswers/);
    assert.doesNotMatch(panel, /<h1/);
});

test("Source Verification panel keeps evidence API logic", () => {
    const panel = readFileSync(
        join(here, "../components/learning-modules/Lm08SourceVerificationPanel.jsx"),
        "utf8"
    );
    assert.match(panel, /postLm08SourceVerification/);
    assert.match(panel, /refetchResolvedIdentity/);
    assert.doesNotMatch(panel, /<h1/);
});
