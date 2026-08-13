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

test("E: wallet-only does not require social identity", () => {
  const r = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    socialIdentity: null,
    address: CONNECTED_EOA,
    owner: OWNER,
  });
  assert.equal(r.source, IDENTITY_INPUT_DEVICE_AA);
  assert.equal(r.identityInput.toLowerCase(), DEVICE_AA);
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

test("J/K: helper does not look up SBT or invent AA→EOA canonical fallback", () => {
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
  assert.equal(r.identityInput.toLowerCase(), DEVICE_AA);
  assert.notEqual(r.identityInput.toLowerCase(), CONNECTED_EOA);
});
