/**
 * H3F final identity UX helpers.
 * Run: node --test src/utils/dashboardIdentityUi.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  resolveLinkWalletSuccessMessage,
  resolveLinkedWalletRevokeHint,
  resolveNavIdentityMenuHint,
  shouldOfferSocialProgressImport,
  shouldShowSocialWalletLinkageDevSnapshot,
} from "./dashboardIdentityUi.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

test("import hidden for linked_wallet (Case B)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      isSocialWalletLinkedAuthorized: true,
      hasIdToken: true,
      hasConnectedWallet: true,
      progressSource: "linked_wallet",
    }),
    false
  );
});

test("import hidden after H3E / account continuity (web3edu_account + progress)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      isSocialWalletLinkedAuthorized: true,
      hasIdToken: true,
      hasConnectedWallet: true,
      progressSource: "web3edu_account",
      socialContinuityAlreadyReflected: true,
    }),
    false
  );
});

test("import hidden while progressSource unknown (null)", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      isSocialWalletLinkedAuthorized: true,
      hasIdToken: true,
      hasConnectedWallet: true,
      progressSource: null,
    }),
    false
  );
});

test("legacy Case A import may still offer when account empty", () => {
  assert.equal(
    shouldOfferSocialProgressImport({
      isSocialWalletLinkedAuthorized: true,
      hasIdToken: true,
      hasConnectedWallet: true,
      progressSource: "web3edu_account",
      socialContinuityAlreadyReflected: false,
    }),
    true
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

test("Dashboards use shouldOfferSocialProgressImport and not linkWalletCase", () => {
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /shouldOfferSocialProgressImport/);
    assert.doesNotMatch(src, /linkWalletCase/);
    assert.match(src, /resolveLinkWalletSuccessMessage/);
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
