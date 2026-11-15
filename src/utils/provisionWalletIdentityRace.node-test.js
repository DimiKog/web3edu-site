/**
 * Async TOCTOU / stale-response regressions for Join continue + IdentityAaRestore
 * via {@link ./provisionWalletIdentityFromOwner.js}.
 * Run: node --test src/utils/provisionWalletIdentityRace.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  runJoinWalletContinueFlow,
  tryProvisionMintedWalletIdentityFromOwner,
} from "./provisionWalletIdentityFromOwner.js";
import { shouldApplyWalletConnectIdentityMutation } from "./walletConnectIdentityFreshness.js";

const WALLET_A = "0x1D05bB9B96fB3165799Cb3Dd09567CcFB757fe3F";
const WALLET_B = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const AA_A = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
const AA_B = "0x34F726148fe6d8Fab1DE0Aab755D39d4638E927c";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeFreshnessBox({
  requestOwner,
  requestOidcAuthenticated = false,
  liveOwner,
  liveOidcAuthenticated = false,
  liveHasActiveSocialAa = false,
  operationId = 1,
  currentOperationId = 1,
  requireLiveOwner = true,
}) {
  const state = {
    requestOwner,
    requestOidcAuthenticated,
    liveOwner: liveOwner === undefined ? requestOwner : liveOwner,
    liveOidcAuthenticated,
    liveHasActiveSocialAa,
    operationId,
    currentOperationId,
    requireLiveOwner,
  };
  return {
    state,
    isOperationFresh() {
      return shouldApplyWalletConnectIdentityMutation({
        operationId: state.operationId,
        currentOperationId: state.currentOperationId,
        requestOwner: state.requestOwner,
        liveOwner: state.liveOwner,
        requestOidcAuthenticated: state.requestOidcAuthenticated,
        liveOidcAuthenticated: state.liveOidcAuthenticated,
        liveHasActiveSocialAa: state.liveHasActiveSocialAa,
        requireLiveOwner: state.requireLiveOwner,
      });
    },
  };
}

function mintedOwnerPayload(aa) {
  return { smartAccount: aa, alreadyMinted: true, version: "aa", tokenId: 24 };
}

function deferredOwnerThenV2(aa) {
  const ownerLookup = deferred();
  return {
    ownerLookup,
    resolveIdentity: async () => ownerLookup.promise,
    resolveIdentityV2: async () => mintedOwnerPayload(aa),
  };
}

// ---------------------------------------------------------------------------
// Join → Continue with connected wallet
// ---------------------------------------------------------------------------

test("1. Join starts for A → switch to B → A response must not setIdentity or navigate", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({ requestOwner: WALLET_A, liveOwner: WALLET_A });
  const applied = [];
  const navigated = [];

  const run = runJoinWalletContinueFlow({
    ownerRaw: WALLET_A,
    setIdentity: (p) => applied.push(p),
    navigateDashboard: () => navigated.push("dashboard"),
    navigateMint: () => navigated.push("mint"),
    isOperationFresh: () => box.isOperationFresh(),
    resolveIdentity,
    resolveIdentityV2,
  });

  box.state.liveOwner = WALLET_B;
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
  assert.equal(navigated.length, 0);
});

test("2. Join starts for A → disconnect → response must not restore or navigate", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({ requestOwner: WALLET_A });
  const applied = [];
  const navigated = [];

  const run = runJoinWalletContinueFlow({
    ownerRaw: WALLET_A,
    setIdentity: (p) => applied.push(p),
    navigateDashboard: () => navigated.push("dashboard"),
    navigateMint: () => navigated.push("mint"),
    isOperationFresh: () => box.isOperationFresh(),
    resolveIdentity,
    resolveIdentityV2,
  });

  box.state.liveOwner = null;
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
  assert.equal(navigated.length, 0);
});

test("3. Join starts for A → OIDC social login → response must not override social AA", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({
    requestOwner: WALLET_A,
    requestOidcAuthenticated: false,
  });
  const applied = [];
  const navigated = [];

  const run = runJoinWalletContinueFlow({
    ownerRaw: WALLET_A,
    setIdentity: (p) => applied.push(p),
    navigateDashboard: () => navigated.push("dashboard"),
    navigateMint: () => navigated.push("mint"),
    isOperationFresh: () => box.isOperationFresh(),
    resolveIdentity,
    resolveIdentityV2,
  });

  box.state.liveOidcAuthenticated = true;
  box.state.liveHasActiveSocialAa = true;
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
  assert.equal(navigated.length, 0);
});

// ---------------------------------------------------------------------------
// IdentityAaRestore
// ---------------------------------------------------------------------------

test("4. IdentityAaRestore starts for A → component cleanup → response must not setIdentity", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({
    requestOwner: WALLET_A,
    requireLiveOwner: false,
  });
  const applied = [];

  const run = tryProvisionMintedWalletIdentityFromOwner(
    WALLET_A,
    (p) => applied.push(p),
    {
      isOperationFresh: () => box.isOperationFresh(),
      resolveIdentity,
      resolveIdentityV2,
    }
  );

  // Effect cleanup: supersede operation (AbortController alone is insufficient).
  box.state.currentOperationId = 2;
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const status = await run;
  assert.equal(status, "stale");
  assert.equal(applied.length, 0);
});

test("5. IdentityAaRestore starts for A → wallet changes to B → must not activate A’s AA", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({
    requestOwner: WALLET_A,
    liveOwner: WALLET_A,
    requireLiveOwner: true,
  });
  const applied = [];

  const run = tryProvisionMintedWalletIdentityFromOwner(
    WALLET_A,
    (p) => applied.push(p),
    {
      isOperationFresh: () => box.isOperationFresh(),
      resolveIdentity,
      resolveIdentityV2,
    }
  );

  box.state.liveOwner = WALLET_B;
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const status = await run;
  assert.equal(status, "stale");
  assert.equal(applied.length, 0);
});

test("6. Two overlapping provisions → older response arrives last must not win", async () => {
  const olderLookup = deferred();
  const newerLookup = deferred();
  const shared = { currentOperationId: 1, liveOwner: WALLET_A };
  const applied = [];

  const freshFor = (operationId) => () =>
    shouldApplyWalletConnectIdentityMutation({
      operationId,
      currentOperationId: shared.currentOperationId,
      requestOwner: WALLET_A,
      liveOwner: shared.liveOwner,
    });

  const runOlder = tryProvisionMintedWalletIdentityFromOwner(
    WALLET_A,
    (p) => applied.push({ tag: "older", ...p }),
    {
      isOperationFresh: freshFor(1),
      resolveIdentity: async () => olderLookup.promise,
      resolveIdentityV2: async () => mintedOwnerPayload(AA_A),
    }
  );

  shared.currentOperationId = 2;
  const runNewer = tryProvisionMintedWalletIdentityFromOwner(
    WALLET_A,
    (p) => applied.push({ tag: "newer", ...p }),
    {
      isOperationFresh: freshFor(2),
      resolveIdentity: async () => newerLookup.promise,
      resolveIdentityV2: async () => mintedOwnerPayload(AA_B),
    }
  );

  olderLookup.resolve(mintedOwnerPayload(AA_A));
  const olderStatus = await runOlder;
  assert.equal(olderStatus, "stale");

  newerLookup.resolve(mintedOwnerPayload(AA_B));
  const newerStatus = await runNewer;
  assert.equal(newerStatus, "minted");
  assert.equal(applied.length, 1);
  assert.equal(applied[0].tag, "newer");
  assert.equal(applied[0].smartAccount.toLowerCase(), AA_B.toLowerCase());
});

test("7. Normal Join with existing identity still succeeds", async () => {
  const box = makeFreshnessBox({ requestOwner: WALLET_A });
  const applied = [];
  const navigated = [];

  const result = await runJoinWalletContinueFlow({
    ownerRaw: WALLET_A,
    setIdentity: (p) => applied.push(p),
    navigateDashboard: () => navigated.push("dashboard"),
    navigateMint: () => navigated.push("mint"),
    isOperationFresh: () => box.isOperationFresh(),
    resolveIdentity: async () => mintedOwnerPayload(AA_A),
    resolveIdentityV2: async () => mintedOwnerPayload(AA_A),
  });

  assert.equal(result.status, "minted");
  assert.equal(applied.length, 1);
  assert.equal(applied[0].smartAccount.toLowerCase(), AA_A.toLowerCase());
  assert.equal(applied[0].hasIdentity, true);
  assert.deepEqual(navigated, ["dashboard"]);
});

test("8. New wallet without identity still reaches Identity Setup", async () => {
  const box = makeFreshnessBox({ requestOwner: WALLET_B });
  const applied = [];
  const navigated = [];

  const result = await runJoinWalletContinueFlow({
    ownerRaw: WALLET_B,
    setIdentity: (p) => applied.push(p),
    navigateDashboard: () => navigated.push("dashboard"),
    navigateMint: () => navigated.push("mint"),
    isOperationFresh: () => box.isOperationFresh(),
    resolveIdentity: async () => ({ owner: WALLET_B }),
    resolveIdentityV2: async () => {
      throw new Error("v2 must not run without anchor");
    },
  });

  assert.equal(result.status, "not_minted");
  assert.equal(applied.length, 0);
  assert.deepEqual(navigated, ["mint"]);
});

test("aborted signal before mutation returns aborted and skips setIdentity", async () => {
  const { ownerLookup, resolveIdentity, resolveIdentityV2 } = deferredOwnerThenV2(AA_A);
  const box = makeFreshnessBox({ requestOwner: WALLET_A });
  const applied = [];
  const controller = new AbortController();

  const run = tryProvisionMintedWalletIdentityFromOwner(
    WALLET_A,
    (p) => applied.push(p),
    {
      signal: controller.signal,
      isOperationFresh: () => box.isOperationFresh(),
      resolveIdentity,
      resolveIdentityV2,
    }
  );

  controller.abort();
  ownerLookup.resolve(mintedOwnerPayload(AA_A));

  const status = await run;
  assert.equal(status, "aborted");
  assert.equal(applied.length, 0);
});
