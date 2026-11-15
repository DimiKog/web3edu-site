/**
 * Wallet-switch / identity-isolation regression tests (desired fail-closed guarantees).
 * Run: node --test src/utils/walletSwitchIdentityIsolation.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  decideConnectedWalletIdentityTransition,
} from "./connectedWalletIdentityTransition.js";
import {
  classifyOwnerResolveForWalletContinue,
} from "./joinWalletContinueDecision.js";
import {
  decideSocialAwareWalletConnectAction,
  getSocialAwareWalletConnectFlags,
  resolveMappedAaFromOwnerLookup,
} from "./socialAwareWalletConnectDecision.js";

const WALLET_A = "0x1D05bB9B96fB3165799Cb3Dd09567CcFB757fe3F";
const WALLET_B = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const AA_A = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
const AA_B = "0x34F726148fe6d8Fab1DE0Aab755D39d4638E927c";
const SOCIAL_AA = "0x3934c22b178B8CE693AB51d4D39e2A9AB9f2D2A5";
const SOCIAL_OWNER = "0x00000000000000000000000000000000000000b1";

function mintedWalletAIdentity() {
  return {
    owner: WALLET_A,
    smartAccount: AA_A,
    hasIdentity: true,
    alreadyMinted: true,
    version: "aa",
    tokenId: 1,
  };
}

function socialPayload(aa = SOCIAL_AA) {
  return {
    aaAddress: aa,
    ownerAddress: SOCIAL_OWNER,
  };
}

function connectDecision({
  connectedOwner = WALLET_B,
  identity = mintedWalletAIdentity(),
  persistedSmartAccount = identity?.smartAccount ?? null,
  socialIdentity = null,
  isOidcAuthenticated = false,
  ownerLookupOutcome,
}) {
  const flags = getSocialAwareWalletConnectFlags({
    persistedSmartAccount,
    identity,
    socialIdentity,
    isOidcAuthenticated,
  });
  let outcome = ownerLookupOutcome;
  if (outcome === undefined) {
    outcome = flags.shouldLookupOwnerMapping
      ? { kind: "success", mapped: null }
      : { kind: "skipped" };
  }
  return {
    flags,
    decision: decideSocialAwareWalletConnectAction({
      ownerNorm: connectedOwner,
      persistedOwner: identity?.owner ?? null,
      hasActiveSocialAa: flags.hasActiveSocialAa,
      hasActiveWalletAa: flags.hasActiveWalletAa,
      persistedSc: flags.persistedSc,
      ownerLookupOutcome: outcome,
    }),
  };
}

function assertClearedForWalletB(cleared, owner = WALLET_B) {
  assert.deepEqual(cleared, {
    owner,
    smartAccount: null,
    version: null,
    tokenId: null,
    hasIdentity: false,
    alreadyMinted: false,
    signerType: "eoa",
  });
}

// ---------------------------------------------------------------------------
// Fail-closed isolation guarantees
// ---------------------------------------------------------------------------

test("1. A minted → connect B with different mapped AA: clear then resolve", () => {
  const mappedB = resolveMappedAaFromOwnerLookup({ identityAddress: AA_B });
  const { decision } = connectDecision({
    ownerLookupOutcome: { kind: "success", mapped: mappedB },
  });
  assert.equal(decision.mode, "mismatch_clear_then_resolve");
  assert.equal(decision.walletMismatch, true);
  assertClearedForWalletB(decision.clearedIdentity);

  const transition = decideConnectedWalletIdentityTransition({
    isOidcAuthenticated: false,
    connectedEoa: WALLET_B,
    prevIdentity: mintedWalletAIdentity(),
  });
  assert.equal(transition.action, "clear_minted_for_wallet_switch");
  assert.equal(transition.nextIdentity.smartAccount, null);
  assert.equal(transition.nextIdentity.owner, WALLET_B);
});

test("2. A minted → connect B with no mapping: FAIL-CLOSED clear (never session-additive)", () => {
  const { decision } = connectDecision({
    ownerLookupOutcome: { kind: "success", mapped: null },
  });
  assert.equal(decision.walletMismatch, true);
  assert.equal(decision.mode, "mismatch_clear_then_resolve");
  assertClearedForWalletB(decision.clearedIdentity);
});

test("3. A minted → connect B with lookup error: FAIL-CLOSED clear", () => {
  const { decision } = connectDecision({
    ownerLookupOutcome: { kind: "error" },
  });
  assert.equal(decision.walletMismatch, true);
  assert.equal(decision.mode, "mismatch_clear_then_resolve");
  assertClearedForWalletB(decision.clearedIdentity);
});

test("4. Disconnect A → reconnect A: keep minted identity; session-additive when same AA", () => {
  const identity = mintedWalletAIdentity();
  const transition = decideConnectedWalletIdentityTransition({
    isOidcAuthenticated: false,
    connectedEoa: WALLET_A,
    prevIdentity: identity,
  });
  assert.equal(transition.action, "keep");
  assert.equal(transition.nextIdentity.smartAccount, AA_A);
  assert.equal(transition.nextIdentity.alreadyMinted, true);

  const mappedSame = resolveMappedAaFromOwnerLookup({ smartAccount: AA_A });
  const { decision } = connectDecision({
    connectedOwner: WALLET_A,
    identity,
    ownerLookupOutcome: { kind: "success", mapped: mappedSame },
  });
  assert.equal(decision.mode, "session_additive");
  assert.equal(decision.walletMismatch, false);
});

test("4b. Reconnect A with lookup error still session-additive (same owner, not foreign)", () => {
  const { decision } = connectDecision({
    connectedOwner: WALLET_A,
    identity: mintedWalletAIdentity(),
    ownerLookupOutcome: { kind: "error" },
  });
  assert.equal(decision.mode, "session_additive");
  assert.equal(decision.walletMismatch, false);
  assert.equal(decision.clearedIdentity, null);
});

test("5. Disconnect A → connect B without identity: layout clears; Join continue → Identity Setup", () => {
  const afterDisconnect = mintedWalletAIdentity(); // AA material still on device
  const transition = decideConnectedWalletIdentityTransition({
    isOidcAuthenticated: false,
    connectedEoa: WALLET_B,
    prevIdentity: afterDisconnect,
  });
  assert.equal(transition.action, "clear_minted_for_wallet_switch");
  assert.equal(transition.nextIdentity.owner, WALLET_B);
  assert.equal(transition.nextIdentity.smartAccount, null);

  // Backend: no owner→AA mapping for B (null payload or payload without AA anchor).
  assert.equal(classifyOwnerResolveForWalletContinue(null), "resolve_failed");
  assert.equal(classifyOwnerResolveForWalletContinue({}), "not_minted");
  assert.equal(
    classifyOwnerResolveForWalletContinue({ alreadyMinted: false }),
    "not_minted"
  );
});

test("6. OIDC social AA → connect external wallet: session-additive; layout skips guest sync", () => {
  const socialIdentity = socialPayload();
  const { flags, decision } = connectDecision({
    identity: mintedWalletAIdentity(),
    socialIdentity,
    isOidcAuthenticated: true,
    ownerLookupOutcome: { kind: "skipped" },
  });
  assert.equal(flags.hasActiveSocialAa, true);
  assert.equal(flags.shouldLookupOwnerMapping, false);
  assert.equal(decision.mode, "session_additive");

  const transition = decideConnectedWalletIdentityTransition({
    isOidcAuthenticated: true,
    connectedEoa: WALLET_B,
    prevIdentity: mintedWalletAIdentity(),
  });
  assert.equal(transition.action, "skip_oidc");
});

test("7. OIDC without usable social AA → connect B: FAIL-CLOSED vs foreign wallet AA", () => {
  const socialIdentity = { ownerAddress: SOCIAL_OWNER };
  const { flags, decision } = connectDecision({
    identity: mintedWalletAIdentity(),
    socialIdentity,
    isOidcAuthenticated: true,
    ownerLookupOutcome: { kind: "success", mapped: null },
  });
  assert.equal(flags.hasActiveSocialAa, false);
  assert.equal(flags.shouldLookupOwnerMapping, true);
  assert.equal(decision.mode, "mismatch_clear_then_resolve");
  assert.equal(decision.walletMismatch, true);
  assertClearedForWalletB(decision.clearedIdentity);

  // Layout still skips guest EOA sync while any OIDC session is present.
  const transition = decideConnectedWalletIdentityTransition({
    isOidcAuthenticated: true,
    connectedEoa: WALLET_B,
    prevIdentity: mintedWalletAIdentity(),
  });
  assert.equal(transition.action, "skip_oidc");
});

test("Join continue: owner with AA anchor proceeds; missing anchor is Identity Setup (not_minted)", () => {
  assert.equal(
    classifyOwnerResolveForWalletContinue({ smartAccount: AA_B }),
    "has_anchor"
  );
  assert.equal(
    classifyOwnerResolveForWalletContinue({ identityAddress: AA_B }),
    "has_anchor"
  );
  assert.equal(classifyOwnerResolveForWalletContinue(null), "resolve_failed");
  assert.equal(classifyOwnerResolveForWalletContinue({}), "not_minted");
});

test("resolveMappedAaFromOwnerLookup reads identityAddress, smartAccount, then payload fallbacks", () => {
  assert.equal(
    resolveMappedAaFromOwnerLookup({ identityAddress: AA_B }).toLowerCase(),
    AA_B.toLowerCase()
  );
  assert.equal(
    resolveMappedAaFromOwnerLookup({ smartAccount: AA_A }).toLowerCase(),
    AA_A.toLowerCase()
  );
  assert.equal(
    resolveMappedAaFromOwnerLookup({ smartAccountAddress: AA_B }).toLowerCase(),
    AA_B.toLowerCase()
  );
  assert.equal(resolveMappedAaFromOwnerLookup(null), null);
  assert.equal(resolveMappedAaFromOwnerLookup({}), null);
});
