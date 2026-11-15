/**
 * Async TOCTOU / stale-response regressions for wallet-connect identity restore.
 * Run: node --test src/utils/walletConnectIdentityRace.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import { getSocialAwareWalletConnectFlags } from "./socialAwareWalletConnectDecision.js";
import { runSocialAwareWalletConnectIdentityFlow } from "./socialAwareWalletConnectFlow.js";
import { shouldApplyWalletConnectIdentityMutation } from "./walletConnectIdentityFreshness.js";

const WALLET_A = "0x1D05bB9B96fB3165799Cb3Dd09567CcFB757fe3F";
const WALLET_B = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const AA_A = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
const AA_B = "0x34F726148fe6d8Fab1DE0Aab755D39d4638E927c";

function minted(owner, smartAccount) {
  return {
    owner,
    smartAccount,
    hasIdentity: true,
    alreadyMinted: true,
    version: "aa",
    tokenId: 1,
  };
}

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
}) {
  const state = {
    requestOwner,
    requestOidcAuthenticated,
    liveOwner: liveOwner ?? requestOwner,
    liveOidcAuthenticated,
    liveHasActiveSocialAa,
    operationId,
    currentOperationId,
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
      });
    },
  };
}

function restoreResolvers(aa) {
  return {
    async resolveIdentity() {
      return { smartAccount: aa, alreadyMinted: true, version: "aa", tokenId: 7 };
    },
    async resolveIdentityV2() {
      return { smartAccount: aa, alreadyMinted: true, version: "aa", tokenId: 7 };
    },
  };
}

// ---------------------------------------------------------------------------
// Pure guard
// ---------------------------------------------------------------------------

test("guard: rejects when operation id is superseded", () => {
  assert.equal(
    shouldApplyWalletConnectIdentityMutation({
      operationId: 1,
      currentOperationId: 2,
      requestOwner: WALLET_A,
      liveOwner: WALLET_A,
    }),
    false
  );
});

test("guard: rejects after disconnect (no live owner)", () => {
  assert.equal(
    shouldApplyWalletConnectIdentityMutation({
      operationId: 1,
      currentOperationId: 1,
      requestOwner: WALLET_A,
      liveOwner: null,
    }),
    false
  );
});

test("guard: rejects after switch A→B", () => {
  assert.equal(
    shouldApplyWalletConnectIdentityMutation({
      operationId: 1,
      currentOperationId: 1,
      requestOwner: WALLET_A,
      liveOwner: WALLET_B,
    }),
    false
  );
});

test("guard: rejects wallet-only op after OIDC social AA becomes active", () => {
  assert.equal(
    shouldApplyWalletConnectIdentityMutation({
      operationId: 1,
      currentOperationId: 1,
      requestOwner: WALLET_A,
      liveOwner: WALLET_A,
      requestOidcAuthenticated: false,
      liveOidcAuthenticated: true,
      liveHasActiveSocialAa: true,
    }),
    false
  );
});

test("guard: allows same-wallet reconnect while context unchanged", () => {
  assert.equal(
    shouldApplyWalletConnectIdentityMutation({
      operationId: 3,
      currentOperationId: 3,
      requestOwner: WALLET_A,
      liveOwner: WALLET_A,
      requestOidcAuthenticated: false,
      liveOidcAuthenticated: false,
      liveHasActiveSocialAa: false,
    }),
    true
  );
});

// ---------------------------------------------------------------------------
// Orchestration races (production flow)
// ---------------------------------------------------------------------------

test("1. A lookup pending → switch to B → A response must not mutate identity", async () => {
  const firstLookup = deferred();
  const box = makeFreshnessBox({ requestOwner: WALLET_A, liveOwner: WALLET_A });
  const applied = [];
  const navigated = [];

  const flags = getSocialAwareWalletConnectFlags({
    persistedSmartAccount: null,
    identity: { owner: WALLET_A },
    isOidcAuthenticated: false,
  });

  const run = runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags,
    persistedOwner: WALLET_A,
    resolveIdentity: async () => firstLookup.promise,
    resolveIdentityV2: restoreResolvers(AA_A).resolveIdentityV2,
    isOperationFresh: () => box.isOperationFresh(),
    applyIdentity: (p) => applied.push(p),
    navigateTo: (p) => navigated.push(p),
  });

  box.state.liveOwner = WALLET_B;
  firstLookup.resolve({
    smartAccount: AA_A,
    alreadyMinted: true,
    version: "aa",
    tokenId: 24,
  });

  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
  assert.equal(navigated.length, 0);
});

test("2. A lookup pending → disconnect → A response must not restore identity", async () => {
  const firstLookup = deferred();
  const box = makeFreshnessBox({ requestOwner: WALLET_A });
  const applied = [];

  const run = runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags: getSocialAwareWalletConnectFlags({
      persistedSmartAccount: null,
      identity: { owner: WALLET_A },
    }),
    persistedOwner: WALLET_A,
    resolveIdentity: async () => firstLookup.promise,
    resolveIdentityV2: restoreResolvers(AA_A).resolveIdentityV2,
    isOperationFresh: () => box.isOperationFresh(),
    applyIdentity: (p) => applied.push(p),
    navigateTo: () => {},
  });

  box.state.liveOwner = null;
  firstLookup.resolve({ smartAccount: AA_A, alreadyMinted: true, tokenId: 1 });
  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
});

test("3. A lookup pending → OIDC social login completes → A must not overwrite social session", async () => {
  const firstLookup = deferred();
  const box = makeFreshnessBox({
    requestOwner: WALLET_A,
    requestOidcAuthenticated: false,
  });
  const applied = [];

  const run = runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags: getSocialAwareWalletConnectFlags({
      persistedSmartAccount: null,
      identity: { owner: WALLET_A },
    }),
    persistedOwner: WALLET_A,
    resolveIdentity: async () => firstLookup.promise,
    resolveIdentityV2: restoreResolvers(AA_A).resolveIdentityV2,
    isOperationFresh: () => box.isOperationFresh(),
    applyIdentity: (p) => applied.push(p),
    navigateTo: () => {},
  });

  box.state.liveOidcAuthenticated = true;
  box.state.liveHasActiveSocialAa = true;
  // Same EOA may remain connected as guest; social AA is now canonical.
  firstLookup.resolve({ smartAccount: AA_A, alreadyMinted: true, tokenId: 1 });
  const result = await run;
  assert.equal(result.status, "stale");
  assert.equal(applied.length, 0);
});

test("4. Two requests for same wallet: older response must not overwrite newer", async () => {
  const older = deferred();
  const newer = deferred();
  const shared = { currentOperationId: 1, liveOwner: WALLET_A };
  const applied = [];

  const flags = getSocialAwareWalletConnectFlags({
    persistedSmartAccount: null,
    identity: { owner: WALLET_A },
  });

  const freshFor = (operationId) => () =>
    shouldApplyWalletConnectIdentityMutation({
      operationId,
      currentOperationId: shared.currentOperationId,
      requestOwner: WALLET_A,
      liveOwner: shared.liveOwner,
    });

  const runOlder = runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags,
    persistedOwner: WALLET_A,
    resolveIdentity: async () => older.promise,
    resolveIdentityV2: async () => ({
      smartAccount: AA_A,
      alreadyMinted: true,
      tokenId: 1,
    }),
    isOperationFresh: freshFor(1),
    applyIdentity: (p) => applied.push({ tag: "older", ...p }),
    navigateTo: () => {},
  });

  // Newer operation supersedes (same pattern as hook ++opSeqRef).
  shared.currentOperationId = 2;
  const runNewer = runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags,
    persistedOwner: WALLET_A,
    resolveIdentity: async () => newer.promise,
    resolveIdentityV2: async () => ({
      smartAccount: AA_B,
      alreadyMinted: true,
      tokenId: 2,
    }),
    isOperationFresh: freshFor(2),
    applyIdentity: (p) => applied.push({ tag: "newer", ...p }),
    navigateTo: () => {},
  });

  // Older completes after newer has started — must be ignored.
  older.resolve({ smartAccount: AA_A, alreadyMinted: true, tokenId: 1 });
  const olderResult = await runOlder;
  assert.equal(olderResult.status, "stale");

  newer.resolve({ smartAccount: AA_B, alreadyMinted: true, tokenId: 2 });
  const newerResult = await runNewer;
  assert.equal(newerResult.status, "restored");
  assert.equal(applied.length, 1);
  assert.equal(applied[0].tag, "newer");
  assert.equal(applied[0].smartAccount.toLowerCase(), AA_B.toLowerCase());
});

test("5. Normal Wallet A reconnect restores identity", async () => {
  const box = makeFreshnessBox({ requestOwner: WALLET_A });
  const applied = [];
  const navigated = [];
  const { resolveIdentity, resolveIdentityV2 } = restoreResolvers(AA_A);

  const result = await runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_A,
    flags: getSocialAwareWalletConnectFlags({
      persistedSmartAccount: null,
      identity: { owner: WALLET_A },
    }),
    persistedOwner: WALLET_A,
    resolveIdentity,
    resolveIdentityV2,
    isOperationFresh: () => box.isOperationFresh(),
    applyIdentity: (p) => applied.push(p),
    navigateTo: (p) => navigated.push(p),
  });

  assert.equal(result.status, "restored");
  assert.equal(applied.length, 1);
  assert.equal(applied[0].smartAccount.toLowerCase(), AA_A.toLowerCase());
  assert.equal(navigated[0], "/dashboard");
});

test("6. OIDC session-additive behavior unchanged when social AA active", async () => {
  const socialIdentity = {
    aaAddress: "0x3934c22b178B8CE693AB51d4D39e2A9AB9f2D2A5",
    ownerAddress: "0x00000000000000000000000000000000000000b1",
  };
  const identity = minted(WALLET_A, AA_A);
  const flags = getSocialAwareWalletConnectFlags({
    persistedSmartAccount: AA_A,
    identity,
    socialIdentity,
    isOidcAuthenticated: true,
  });
  assert.equal(flags.hasActiveSocialAa, true);
  assert.equal(flags.shouldLookupOwnerMapping, false);

  const box = makeFreshnessBox({
    requestOwner: WALLET_B,
    requestOidcAuthenticated: true,
    liveOwner: WALLET_B,
    liveOidcAuthenticated: true,
    liveHasActiveSocialAa: true,
  });
  const applied = [];
  const navigated = [];
  let resolveCalls = 0;

  const result = await runSocialAwareWalletConnectIdentityFlow({
    ownerNorm: WALLET_B,
    flags,
    persistedOwner: identity.owner,
    resolveIdentity: async () => {
      resolveCalls += 1;
      return { smartAccount: AA_A };
    },
    resolveIdentityV2: async () => ({ smartAccount: AA_A, alreadyMinted: true }),
    isOperationFresh: () => box.isOperationFresh(),
    applyIdentity: (p) => applied.push(p),
    navigateTo: (p) => navigated.push(p),
  });

  assert.equal(result.status, "session_additive");
  assert.equal(resolveCalls, 0, "session-additive must skip owner lookup/restore");
  assert.equal(applied.length, 0);
  assert.equal(navigated[0], "/dashboard");
});
