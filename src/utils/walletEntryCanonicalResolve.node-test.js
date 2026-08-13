/**
 * H3A.1 wallet-entry canonical selection tests (Node built-in test runner).
 * Run: node --test src/utils/walletEntryCanonicalResolve.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { normalizeEvmAddress } from "./evmAddress.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  VIEWER_SOURCE_UNAVAILABLE,
  VIEWER_SOURCE_UNRESOLVED,
  VIEWER_SOURCE_WALLET_ENTRY_PENDING,
  WALLET_ENTRY_IDLE,
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_LOADING,
  WALLET_ENTRY_UNAVAILABLE,
  WALLET_ENTRY_UNRESOLVED,
  WALLET_ENTRY_WALLET_ONLY,
  interpretWalletEntryCanonicalResult,
  selectCanonicalViewerIdentity,
} from "./walletEntryCanonicalResolve.js";

const PROD_LINKED_EOA = "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E";
const PROD_SOCIAL_AA = "0x3934c22b178B8CE693AB51d4D39e2A9AB9f2D2A5";
const PROD_DEVICE_AA = "0x34F726148fe6d8Fab1DE0Aab755D39d4638E927c";
const WALLET_ONLY_EOA = "0x00000000000000000000000000000000000000e2";
const DEVICE_AA = "0x00000000000000000000000000000000000000d1";
const SOCIAL_AA = "0x00000000000000000000000000000000000000aa";

function linkedPayload(overrides = {}) {
  return {
    schemaVersion: "canonical-identity-credential-v1",
    identity: {
      status: "resolved",
      mode: "social",
      progressAddress: PROD_SOCIAL_AA,
      isSocial: true,
      isWalletOnly: false,
      aaAddress: PROD_SOCIAL_AA,
      ownerAddress: "0x00000000000000000000000000000000000000b1",
      linkedWalletAddress: PROD_LINKED_EOA,
      matchedBy: "wallet_address",
      socialIdentityPresent: true,
      ...overrides,
    },
    credential: {
      status: "ISSUED",
      tokenId: 7,
    },
    warnings: [],
    conflicts: [],
    reasonCodes: { identity: "IDENTITY_RESOLVED", credential: "CREDENTIAL_ISSUED" },
  };
}

function walletOnlyPayload({ eoa = WALLET_ONLY_EOA, credentialStatus = "NOT_ISSUED" } = {}) {
  return {
    identity: {
      status: "resolved",
      mode: "wallet_only",
      progressAddress: eoa,
      isSocial: false,
      isWalletOnly: true,
      aaAddress: null,
      ownerAddress: null,
      linkedWalletAddress: null,
      matchedBy: "wallet_only_address",
      socialIdentityPresent: false,
    },
    credential: { status: credentialStatus, tokenId: null },
  };
}

test("1. OIDC authenticated social wins over linked EOA and device AA", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: true,
    socialAaAddress: SOCIAL_AA,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: false,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: PROD_SOCIAL_AA,
  });
  assert.equal(v.source, VIEWER_SOURCE_OIDC_SOCIAL);
  assert.equal(v.identityAddress, normalizeEvmAddress(SOCIAL_AA));
  assert.equal(v.isLinkedWalletAlias, false);
});

test("2–4. production linked EOA returns social AA; device AA cannot override", () => {
  const interpreted = interpretWalletEntryCanonicalResult(linkedPayload(), {
    connectedEoa: PROD_LINKED_EOA,
  });
  assert.equal(interpreted.status, WALLET_ENTRY_LINKED_ALIAS);
  assert.equal(interpreted.matchedBy, "wallet_address");
  assert.equal(
    interpreted.canonicalProgressAddress,
    normalizeEvmAddress(PROD_SOCIAL_AA)
  );

  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    socialAaAddress: null,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: interpreted.canonicalProgressAddress,
    walletEntryLinkedWalletAddress: interpreted.linkedWalletAddress,
  });
  assert.equal(v.source, VIEWER_SOURCE_LINKED_WALLET_ALIAS);
  assert.equal(v.identityAddress, normalizeEvmAddress(PROD_SOCIAL_AA));
  assert.notEqual(v.identityAddress, normalizeEvmAddress(PROD_DEVICE_AA));
  assert.equal(v.signerAddress, normalizeEvmAddress(PROD_LINKED_EOA));
  assert.equal(v.isLinkedWalletAlias, true);
});

test("5. device AA separate progress is not selected as canonical learner", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: PROD_SOCIAL_AA,
  });
  assert.notEqual(v.identityAddress, normalizeEvmAddress(PROD_DEVICE_AA));
});

test("6–7. genuine wallet-only EOA with no SBT stays wallet-only", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    walletOnlyPayload({ credentialStatus: "NOT_ISSUED" }),
    { connectedEoa: WALLET_ONLY_EOA }
  );
  assert.equal(interpreted.status, WALLET_ENTRY_WALLET_ONLY);

  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: WALLET_ONLY_EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    isNeutralAfterLogout: false,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: WALLET_ONLY_EOA,
  });
  assert.equal(v.source, VIEWER_SOURCE_DEVICE_AA);
  assert.equal(v.identityAddress, normalizeEvmAddress(DEVICE_AA));
  assert.equal(v.isLinkedWalletAlias, false);
  assert.equal(v.signerAddress, normalizeEvmAddress(WALLET_ONLY_EOA));
});

test("8. disconnect (no EOA) clears linked-wallet alias", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: null,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: false,
    walletEntryActive: false,
    walletEntryStatus: WALLET_ENTRY_IDLE,
    walletEntryProgressAddress: PROD_SOCIAL_AA,
  });
  assert.equal(v.isLinkedWalletAlias, false);
  assert.equal(v.identityAddress, null);
});

test("9. wallet switch uses the new EOA status, not a stale social AA", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: WALLET_ONLY_EOA,
    deviceAa: null,
    deviceAaReady: false,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: WALLET_ONLY_EOA,
  });
  assert.notEqual(v.identityAddress, normalizeEvmAddress(PROD_SOCIAL_AA));
  assert.equal(v.source, VIEWER_SOURCE_CONNECTED_EOA);
});

test("10. OIDC sign-in supersedes wallet alias", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: true,
    socialAaAddress: SOCIAL_AA,
    connectedEoa: PROD_LINKED_EOA,
    walletEntryActive: false,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: PROD_SOCIAL_AA,
  });
  assert.equal(v.source, VIEWER_SOURCE_OIDC_SOCIAL);
});

test("11. OIDC sign-out with connected linked EOA triggers alias resolve (pending then linked)", () => {
  const pending = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_LOADING,
  });
  assert.equal(pending.pending, true);
  assert.equal(pending.source, VIEWER_SOURCE_WALLET_ENTRY_PENDING);
  assert.equal(pending.identityAddress, null);
});

test("12. backend unresolved → no identity inference", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    {
      identity: {
        status: "unresolved",
        mode: "unknown",
        progressAddress: null,
        matchedBy: null,
        socialIdentityPresent: false,
      },
    },
    { connectedEoa: PROD_LINKED_EOA }
  );
  assert.equal(interpreted.status, WALLET_ENTRY_UNRESOLVED);

  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_UNRESOLVED,
  });
  assert.equal(v.source, VIEWER_SOURCE_UNRESOLVED);
  assert.equal(v.identityAddress, null);
});

test("13. backend error / SBT evidence does not infer social identity", () => {
  const err = interpretWalletEntryCanonicalResult(null, {
    connectedEoa: PROD_LINKED_EOA,
    error: new Error("network"),
  });
  assert.equal(err.status, WALLET_ENTRY_UNAVAILABLE);

  const mismatchOnly = interpretWalletEntryCanonicalResult(
    walletOnlyPayload({ credentialStatus: "MISMATCH" }),
    { connectedEoa: WALLET_ONLY_EOA }
  );
  assert.equal(mismatchOnly.status, WALLET_ENTRY_WALLET_ONLY);

  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_UNAVAILABLE,
  });
  assert.equal(v.source, VIEWER_SOURCE_UNAVAILABLE);
  assert.equal(v.identityAddress, null);
});

test("14. helpers do not persist EOA→AA mappings", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "walletEntryCanonicalResolve.js"), "utf8");
  assert.equal(src.includes("localStorage"), false);
  assert.equal(src.includes("sessionStorage"), false);
  assert.equal(src.includes("setItem"), false);
});

test("15. signer EOA remains separate from canonical learner", () => {
  const v = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: PROD_LINKED_EOA,
    deviceAa: PROD_DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: PROD_SOCIAL_AA,
  });
  assert.equal(v.signerAddress, normalizeEvmAddress(PROD_LINKED_EOA));
  assert.equal(v.identityAddress, normalizeEvmAddress(PROD_SOCIAL_AA));
  assert.notEqual(v.signerAddress, v.identityAddress);
});

test("matchedBy=wallet_address is required; SBT/AA evidence is not enough", () => {
  const noMatch = interpretWalletEntryCanonicalResult(
    linkedPayload({ matchedBy: "aa_address" }),
    { connectedEoa: PROD_LINKED_EOA }
  );
  assert.notEqual(noMatch.status, WALLET_ENTRY_LINKED_ALIAS);

  const noSocial = interpretWalletEntryCanonicalResult(
    linkedPayload({ socialIdentityPresent: false, mode: "wallet_only" }),
    { connectedEoa: PROD_LINKED_EOA }
  );
  assert.notEqual(noSocial.status, WALLET_ENTRY_LINKED_ALIAS);
});

test("truncated prefixes are not accepted as progressAddress", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    linkedPayload({ progressAddress: "0x3934c22b178B" }),
    { connectedEoa: PROD_LINKED_EOA }
  );
  assert.notEqual(interpreted.status, WALLET_ENTRY_LINKED_ALIAS);
});

test("canonical fetch helper is GET-only and does not write identity", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const api = readFileSync(join(here, "../api/canonicalIdentity.js"), "utf8");
  assert.equal(api.includes('method: "GET"'), true);
  assert.equal(api.includes('method: "POST"'), false);
  assert.equal(api.includes("localStorage"), false);
  assert.equal(api.includes("sendTransaction"), false);
  assert.equal(api.includes("eth_sendRawTransaction"), false);
});
