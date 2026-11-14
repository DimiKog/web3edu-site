/**
 * H3F final identity UX helpers + authoritative wallet progress gate.
 * Run: node --test src/utils/dashboardIdentityUi.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  readAuthoritativeWalletProgress,
  resolveLinkWalletSuccessMessage,
  resolveLinkedWalletRevokeHint,
  resolveNavIdentityMenuHint,
  shouldOfferSocialProgressImport,
  shouldShowSocialWalletLinkageDevSnapshot,
} from "./dashboardIdentityUi.js";
import { classifySocialProgressImportError } from "./socialProgressImportErrors.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const authBase = {
  isSocialWalletLinkedAuthorized: true,
  hasIdToken: true,
  hasConnectedWallet: true,
  progressImportSnoozed: false,
  socialContinuityAlreadyReflected: false,
};

test("import hidden for linked_wallet (Case B)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "linked_wallet",
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("import hidden after H3E / account continuity (web3edu_account + progress)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      socialContinuityAlreadyReflected: true,
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("import hidden while progressSource unknown (null)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: null,
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("1. new social + empty wallet → no banner", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: false,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("2. social + wallet with meaningful progression → banner", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    true
  );
});

test("3. wallet with 0 XP but completed activities → banner (backend true)", () => {
  // Frontend trusts authoritative boolean; backend already treats labs as progress.
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    true
  );
});

test("4. unknown/unavailable progress state → no banner (fail closed)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: null,
      walletProgressEvaluated: false,
    }),
    false
  );
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: true,
      walletProgressEvaluated: false,
    }),
    false
  );
});

test("5. Case B → no banner even when wallet has progress", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "linked_wallet",
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("10. legacy-only state does not falsely claim progression", () => {
  const legacy = readAuthoritativeWalletProgress({
    walletHasProgress: null,
    walletProgressEvaluated: false,
  });
  assert.equal(legacy.walletHasProgress, null);
  assert.equal(legacy.walletProgressEvaluated, false);
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      ...legacy,
    }),
    false
  );
});

test("readAuthoritativeWalletProgress normalizes evaluated true/false/null", () => {
  assert.deepEqual(
    readAuthoritativeWalletProgress({
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    { walletHasProgress: true, walletProgressEvaluated: true }
  );
  assert.deepEqual(
    readAuthoritativeWalletProgress({
      walletHasProgress: false,
      walletProgressEvaluated: true,
    }),
    { walletHasProgress: false, walletProgressEvaluated: true }
  );
  assert.deepEqual(
    readAuthoritativeWalletProgress({
      walletHasProgress: true,
      walletProgressEvaluated: false,
    }),
    { walletHasProgress: null, walletProgressEvaluated: false }
  );
  assert.deepEqual(readAuthoritativeWalletProgress(null), {
    walletHasProgress: null,
    walletProgressEvaluated: false,
  });
});

test("8. source_missing / source_empty classified consistently", () => {
  assert.equal(
    classifySocialProgressImportError({ payload: { error: "source_missing" } }),
    "source_missing"
  );
  assert.equal(
    classifySocialProgressImportError({ payload: { error: "source_empty" } }),
    "source_missing"
  );
  assert.equal(
    classifySocialProgressImportError({ message: "SOURCE_EMPTY" }),
    "source_missing"
  );
  const importSrc = readFileSync(
    join(root, "components/SocialWalletProgressImportSection.jsx"),
    "utf8"
  );
  assert.match(importSrc, /classifySocialProgressImportError/);
});

test("import still respects snooze and auth gates", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      progressSource: "web3edu_account",
      walletHasProgress: true,
      walletProgressEvaluated: true,
      progressImportSnoozed: true,
    }),
    false
  );
  assert.equal(
    shouldOfferSocialProgressImport({
      ...authBase,
      isSocialWalletLinkedAuthorized: false,
      progressSource: "web3edu_account",
      walletHasProgress: true,
      walletProgressEvaluated: true,
    }),
    false
  );
});

test("revoke hint blocked when progress on linked wallet", () => {
  const hint = resolveLinkedWalletRevokeHint({
    progressSource: "linked_wallet",
    hasLinkedWallet: true,
  });
  assert.match(hint, /cannot be unlinked|δεν μπορείς να αποσυνδέσεις/i);
});

test("revoke hint informational when progress on web3edu_account", () => {
  const hint = resolveLinkedWalletRevokeHint({
    progressSource: "web3edu_account",
    hasLinkedWallet: true,
  });
  assert.match(hint, /Web3Edu Account/);
  assert.match(hint, /does not remove progress|δεν αφαιρεί την πρόοδο/i);
});

test("link success message uses progressSource not Case B label", () => {
  assert.match(
    resolveLinkWalletSuccessMessage({ progressSource: "linked_wallet" }),
    /Linked Wallet/
  );
  assert.match(
    resolveLinkWalletSuccessMessage({ progressSource: "web3edu_account" }),
    /Web3Edu Account/
  );
  const caseB = resolveLinkWalletSuccessMessage({ progressSource: "linked_wallet" });
  const caseBGR = resolveLinkWalletSuccessMessage({
    isGR: true,
    progressSource: "linked_wallet",
  });
  assert.doesNotMatch(caseB, /administrator/i);
  assert.doesNotMatch(caseBGR, /διαχειριστή/);
  assert.match(caseBGR, /Συνδεδεμένο πορτοφόλι/);
});

test("9. EN/GR Dashboards wire authoritative wallet progress identically", () => {
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /shouldOfferSocialProgressImport/);
    assert.match(src, /readAuthoritativeWalletProgress/);
    assert.match(src, /walletHasProgress/);
    assert.match(src, /walletProgressEvaluated/);
    assert.match(src, /getIdentityLinkStatus/);
    assert.doesNotMatch(src, /linkWalletCase/);
    assert.match(src, /resolveLinkWalletSuccessMessage/);
    // After link: consume flow result (status-backed), not transient preview alone.
    assert.match(src, /readAuthoritativeWalletProgress\(result\)/);
    assert.match(src, /walletProgressEvaluated/);
  }
});

test("6. Dashboard refresh hydrates wallet progress from status", () => {
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /getIdentityLinkStatus\(oidcIdToken\)/);
    assert.match(src, /readAuthoritativeWalletProgress\(status\)/);
    assert.match(src, /setWalletHasProgress\(signal\.walletHasProgress\)/);
    assert.match(src, /setWalletProgressEvaluated\(signal\.walletProgressEvaluated\)/);
  }
});

test("legacy EIP-191 removed from socialIdentity.js student API surface", () => {
  const src = readFileSync(join(root, "api/socialIdentity.js"), "utf8");
  assert.doesNotMatch(src, /createLinkWalletChallenge/);
  assert.doesNotMatch(src, /confirmLinkWallet/);
  assert.match(src, /socialIdentityLegacyLink/);
});

test("PageShell clarifies Web3Edu Identity vs connected wallet", () => {
  const src = readFileSync(join(root, "components/PageShell.jsx"), "utf8");
  assert.match(src, /resolveNavIdentityMenuHint/);
  assert.match(src, /title=\{navIdentityMenuHint\}/);
});

test("DashboardIdentityAddresses shows revoke hint from backend progressSource", () => {
  const src = readFileSync(
    join(root, "components/DashboardIdentityAddresses.jsx"),
    "utf8"
  );
  assert.match(src, /resolveLinkedWalletRevokeHint/);
  assert.match(src, /Πηγή προόδου/);
  assert.match(src, /Device Account/);
});

test("nav identity hint EN/GR", () => {
  assert.match(resolveNavIdentityMenuHint({ isGR: false }), /canonical learner account/i);
  assert.match(resolveNavIdentityMenuHint({ isGR: true }), /κανονικός λογαριασμός/i);
});

test("DEV snapshot panel permitted in development when a snapshot exists", () => {
  assert.equal(
    shouldShowSocialWalletLinkageDevSnapshot({ isDev: true, hasSnapshot: true }),
    true
  );
});

test("DEV snapshot panel cannot render in production even with a snapshot", () => {
  assert.equal(
    shouldShowSocialWalletLinkageDevSnapshot({ isDev: false, hasSnapshot: true }),
    false
  );
  assert.equal(
    shouldShowSocialWalletLinkageDevSnapshot({ isDev: false, hasSnapshot: false }),
    false
  );
  assert.equal(
    shouldShowSocialWalletLinkageDevSnapshot({ isDev: true, hasSnapshot: false }),
    false
  );
});

test("Dashboards gate the linkage DEV snapshot strictly on import.meta.env.DEV", () => {
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /shouldShowSocialWalletLinkageDevSnapshot/);
    assert.match(src, /isDev:\s*import\.meta\.env\.DEV/);
    assert.doesNotMatch(src, /debugIdentityFromQuery/);
    assert.doesNotMatch(src, /isAdminDebugEnabled/);
    assert.doesNotMatch(src, /debugIdentity/);
    assert.doesNotMatch(src, /DASHBOARD_IDENTITY_DEBUG_FLAG/);
  }
});
