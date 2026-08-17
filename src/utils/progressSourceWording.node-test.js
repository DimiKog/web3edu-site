/**
 * Progress Source student-facing wording (H3F Case B cleanup).
 * Run: node --test src/utils/progressSourceWording.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  PROGRESS_SOURCE_HELPER_ACCOUNT_EN,
  PROGRESS_SOURCE_HELPER_ACCOUNT_GR,
  PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN,
  PROGRESS_SOURCE_HELPER_LINKED_WALLET_GR,
  resolveProgressSourceDisplayLabel,
  resolveProgressSourceHelperCopy,
} from "./progressSourceWording.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

test("web3edu_account → Web3Edu Account wording (EN)", () => {
  assert.equal(
    resolveProgressSourceHelperCopy({
      progressSource: "web3edu_account",
      isGR: false,
    }),
    PROGRESS_SOURCE_HELPER_ACCOUNT_EN
  );
  assert.equal(
    resolveProgressSourceDisplayLabel({ progressSource: "web3edu_account" }),
    "Web3Edu Account"
  );
  assert.match(PROGRESS_SOURCE_HELPER_ACCOUNT_EN, /Web3Edu Account/);
  assert.doesNotMatch(PROGRESS_SOURCE_HELPER_ACCOUNT_EN, /Linked Wallet/);
});

test("linked_wallet → Linked Wallet wording (EN)", () => {
  assert.equal(
    resolveProgressSourceHelperCopy({
      progressSource: "linked_wallet",
      isGR: false,
    }),
    PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN
  );
  assert.equal(
    resolveProgressSourceDisplayLabel({ progressSource: "linked_wallet" }),
    "Linked Wallet"
  );
  assert.match(PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN, /Linked Wallet/);
  assert.doesNotMatch(PROGRESS_SOURCE_HELPER_LINKED_WALLET_EN, /Web3Edu Account/);
});

test("unknown/loading (null) does not falsely claim Web3Edu Account", () => {
  assert.equal(
    resolveProgressSourceHelperCopy({ progressSource: null, isGR: false }),
    null
  );
  assert.equal(
    resolveProgressSourceHelperCopy({ progressSource: null, isGR: true }),
    null
  );
  assert.equal(resolveProgressSourceDisplayLabel({ progressSource: null }), null);
});

test("GR parity for account and linked wallet", () => {
  assert.equal(
    resolveProgressSourceHelperCopy({
      progressSource: "web3edu_account",
      isGR: true,
    }),
    PROGRESS_SOURCE_HELPER_ACCOUNT_GR
  );
  assert.equal(
    resolveProgressSourceHelperCopy({
      progressSource: "linked_wallet",
      isGR: true,
    }),
    PROGRESS_SOURCE_HELPER_LINKED_WALLET_GR
  );
  assert.match(PROGRESS_SOURCE_HELPER_LINKED_WALLET_GR, /συνδεδεμένο πορτοφόλι/i);
  assert.equal(
    resolveProgressSourceDisplayLabel({
      progressSource: "linked_wallet",
      isGR: true,
    }),
    "Συνδεδεμένο πορτοφόλι"
  );
});

test("Dashboards pass backend progressSource and suppress import via helper", () => {
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /progressSource=\{linkProgressSource\}/);
    assert.match(src, /shouldOfferSocialProgressImport/);
    assert.doesNotMatch(src, /linkWalletCase/);
    assert.doesNotMatch(
      src,
      /progressSourceLabel=\{\s*linkProgressSource === "linked_wallet"/
    );
    assert.doesNotMatch(src, /progressAddress\s*===/);
    assert.doesNotMatch(src, /credentialHolderAddress\s*===/);
  }
});

test("DashboardIdentityAddresses wires progressSource into helper (no AA/EOA compare)", () => {
  const src = readFileSync(join(root, "components/DashboardIdentityAddresses.jsx"), "utf8");
  assert.match(src, /progressSource=\{progressSource\}/);
  assert.match(src, /resolveProgressSourceDisplayLabel/);
  assert.doesNotMatch(src, /progressAddress/);
  assert.doesNotMatch(src, /0x[a-fA-F0-9]{40}/);
});

test("helper resolver does not take address inputs (no client-side origin inference)", () => {
  const src = readFileSync(join(__dirname, "progressSourceWording.js"), "utf8");
  const fnStart = src.indexOf("export function resolveProgressSourceHelperCopy");
  const fnEnd = src.indexOf("export function resolveProgressSourceDisplayLabel");
  const fn = src.slice(fnStart, fnEnd);
  assert.doesNotMatch(fn, /\baddress\b/i);
  assert.doesNotMatch(fn, /\bAA\b|\bEOA\b|identityAddress|walletAddress/);
});
