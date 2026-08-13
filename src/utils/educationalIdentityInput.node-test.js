/**
 * H2b educational identity-input tests (Node built-in test runner).
 * Run: node --test src/utils/educationalIdentityInput.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  IDENTITY_INPUT_CONNECTED_EOA,
  IDENTITY_INPUT_DEVICE_AA,
  IDENTITY_INPUT_OIDC_PENDING,
  IDENTITY_INPUT_SOCIAL_AA,
  IDENTITY_INPUT_SOCIAL_RELATIONSHIP,
  IDENTITY_INPUT_WALLET_ENTRY_PENDING,
  getEducationalIdentityInput,
  getEffectiveLabsWalletIdentity,
} from "./educationalIdentityInput.js";

const SOCIAL_AA = "0x00000000000000000000000000000000000000aa";
const DEVICE_AA = "0x00000000000000000000000000000000000000d1";
const LINKED_EOA = "0x00000000000000000000000000000000000000e1";
const CONNECTED_EOA = "0x00000000000000000000000000000000000000e2";
const OWNER = "0x00000000000000000000000000000000000000e3";

const social = {
  aaAddress: SOCIAL_AA,
  ownerAddress: OWNER,
  walletAddress: LINKED_EOA,
};

test("A: social + authoritative AA + device smartAccount → social AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.equal(r.source, IDENTITY_INPUT_SOCIAL_AA);
  assert.equal(r.identityInput.toLowerCase(), SOCIAL_AA);
  assert.equal(r.ready, true);
});

test("B: social + authoritative AA + linked EOA → social AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: null,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: LINKED_EOA,
    owner: OWNER,
  });
  assert.equal(r.identityInput.toLowerCase(), SOCIAL_AA);
  assert.notEqual(r.identityInput.toLowerCase(), LINKED_EOA);
});

test("C: social + AA + connected EOA + device AA → social AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.equal(r.identityInput.toLowerCase(), SOCIAL_AA);
  assert.equal(r.signerAddress.toLowerCase(), CONNECTED_EOA);
  assert.notEqual(r.signerAddress.toLowerCase(), r.identityInput.toLowerCase());
});

test("D: wallet-only + connected EOA remains valid", () => {
  const r = getEducationalIdentityInput({
    smartAccount: null,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: CONNECTED_EOA,
  });
  assert.equal(r.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(r.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.equal(r.owner, null);
});

test("E/H3A.2: wallet-only + connected EOA + device AA → connected EOA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.equal(r.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(r.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.notEqual(r.identityInput.toLowerCase(), DEVICE_AA);
});

test("F: authenticated social without AA does not use device-local AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: { ownerAddress: OWNER, walletAddress: LINKED_EOA },
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.notEqual((r.identityInput || "").toLowerCase(), DEVICE_AA);
  assert.equal(r.source, IDENTITY_INPUT_SOCIAL_RELATIONSHIP);
  assert.equal(r.identityInput.toLowerCase(), OWNER);
});

test("F2: OIDC pending does not fall back to device AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: null,
    socialIdentityLoading: true,
    address: CONNECTED_EOA,
  });
  assert.equal(r.deferred, true);
  assert.equal(r.ready, false);
  assert.equal(r.identityInput, null);
  assert.equal(r.source, IDENTITY_INPUT_OIDC_PENDING);
});

test("G/H: labWrite compatibility wrapper shares the same selection", () => {
  const args = {
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    owner: OWNER,
  };
  const a = getEducationalIdentityInput(args);
  const b = getEffectiveLabsWalletIdentity(args);
  assert.equal(a.identityInput, b.wallet);
  assert.equal(a.owner, b.owner);
});

test("I: signer can differ from learner identity input", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.equal(r.identityInput.toLowerCase(), SOCIAL_AA);
  assert.equal(r.signerAddress.toLowerCase(), CONNECTED_EOA);
});

test("J/K: helper does not look up SBT; device AA does not override connected EOA", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "educationalIdentityInput.js"), "utf8");
  assert.equal(src.includes("sbt"), false);
  assert.equal(src.includes("tokenId"), false);
  assert.equal(src.includes("hasMinted"), false);
  assert.equal(src.includes("web3edu/identity/resolve"), false);
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: CONNECTED_EOA,
  });
  assert.equal(r.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.notEqual(r.identityInput.toLowerCase(), DEVICE_AA);
});

test("H3A.1: linked-wallet alias sends connected EOA, not device AA or progressAddress", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: CONNECTED_EOA,
    walletEntryLinkedAlias: true,
  });
  assert.equal(r.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(r.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.notEqual(r.identityInput.toLowerCase(), DEVICE_AA);
  assert.equal(r.signerAddress.toLowerCase(), CONNECTED_EOA);
});

test("H3A.1: wallet-entry pending defers writes (no device AA flicker write)", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: CONNECTED_EOA,
    walletEntryResolvePending: true,
  });
  assert.equal(r.deferred, true);
  assert.equal(r.ready, false);
  assert.equal(r.identityInput, null);
  assert.equal(r.source, IDENTITY_INPUT_WALLET_ENTRY_PENDING);
});

test("H3A.1: OIDC social still wins over linked-alias educational flag", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
    walletEntryLinkedAlias: true,
  });
  assert.equal(r.source, IDENTITY_INPUT_SOCIAL_AA);
  assert.equal(r.identityInput.toLowerCase(), SOCIAL_AA);
});

const PROD_WALLET_ONLY_EOA = "0xe63761BFE4599AAb4a7D4CFbb2229103199b3631";
const PROD_DEVICE_AA = "0x48312994109cd45f98b9b57cd96857e42f49d480";
const OTHER_EOA = "0x00000000000000000000000000000000000000e4";

test("H3A.2 regression: wallet-only EOA + device AA → EOA, not device AA", () => {
  const r = getEducationalIdentityInput({
    smartAccount: PROD_DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: PROD_WALLET_ONLY_EOA,
  });
  assert.equal(r.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(r.identityInput.toLowerCase(), PROD_WALLET_ONLY_EOA.toLowerCase());
  assert.notEqual(r.identityInput.toLowerCase(), PROD_DEVICE_AA.toLowerCase());
  assert.equal(r.signerAddress.toLowerCase(), PROD_WALLET_ONLY_EOA.toLowerCase());
});

test("H3A.2 CASE C: no OIDC + no EOA + device AA → device AA fallback", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: null,
  });
  assert.equal(r.source, IDENTITY_INPUT_DEVICE_AA);
  assert.equal(r.identityInput.toLowerCase(), DEVICE_AA);
});

test("H3A.2: wallet disconnect does not keep a stale EOA input", () => {
  const connected = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: CONNECTED_EOA,
  });
  assert.equal(connected.identityInput.toLowerCase(), CONNECTED_EOA);
  const disconnected = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: null,
  });
  assert.equal(disconnected.source, IDENTITY_INPUT_DEVICE_AA);
  assert.notEqual((disconnected.identityInput || "").toLowerCase(), CONNECTED_EOA);
});

test("H3A.2: wallet switch uses the new EOA", () => {
  const a = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: CONNECTED_EOA,
  });
  const b = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: OTHER_EOA,
  });
  assert.equal(a.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.equal(b.identityInput.toLowerCase(), OTHER_EOA);
});

test("H3A.2: OIDC login after wallet-only → social AA supersedes EOA", () => {
  const before = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: CONNECTED_EOA,
  });
  assert.equal(before.identityInput.toLowerCase(), CONNECTED_EOA);
  const after = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: social,
    socialIdentityLoading: false,
    address: CONNECTED_EOA,
  });
  assert.equal(after.source, IDENTITY_INPUT_SOCIAL_AA);
  assert.equal(after.identityInput.toLowerCase(), SOCIAL_AA);
});

test("H3A.2: OIDC logout with EOA connected → EOA input resumes", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: social,
    address: CONNECTED_EOA,
  });
  assert.equal(r.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(r.identityInput.toLowerCase(), CONNECTED_EOA);
  assert.notEqual(r.identityInput.toLowerCase(), SOCIAL_AA);
});

test("H3A.2: linked EOA educational input is the EOA (frontend does not send social AA)", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: LINKED_EOA,
    walletEntryLinkedAlias: true,
  });
  assert.equal(r.identityInput.toLowerCase(), LINKED_EOA);
  assert.notEqual(r.identityInput.toLowerCase(), SOCIAL_AA);
  assert.notEqual(r.identityInput.toLowerCase(), DEVICE_AA);
});

test("H3A.2: start/auto-start/completion/coding callers use the shared helper", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const labWrite = readFileSync(join(here, "labWriteApi.js"), "utf8");
  const autoStart = readFileSync(join(here, "../hooks/useLabAutoStartOnce.js"), "utf8");
  const claim = readFileSync(join(here, "../components/LabCompletionClaim.jsx"), "utf8");
  const coding1 = readFileSync(join(here, "../pages/labs/CodingLabInteraction1.jsx"), "utf8");
  const coding2 = readFileSync(join(here, "../pages/labs/CodingLabInteraction2.jsx"), "utf8");
  assert.equal(labWrite.includes("getEducationalIdentityInput"), true);
  assert.equal(autoStart.includes("getEducationalIdentityInput"), true);
  assert.equal(claim.includes("getEducationalIdentityInput"), true);
  assert.equal(coding1.includes("getEffectiveLabsWalletIdentity"), true);
  assert.equal(coding2.includes("getEffectiveLabsWalletIdentity"), true);
  assert.equal(labWrite.includes("sendTransaction"), false);
  assert.equal(labWrite.includes("eth_sendRawTransaction"), false);
});
