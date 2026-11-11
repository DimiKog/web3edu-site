/**
 * WA-01c1 wallet-auth foundation tests (Node built-in test runner).
 * Run: node --test src/utils/walletAuthFlow.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  WALLET_AUTH_CHAIN_ID,
  WALLET_AUTH_PRIMARY_TYPE,
  WALLET_AUTH_PURPOSE,
  WALLET_AUTH_REASON,
  WALLET_AUTH_SESSION_SCOPE,
  WALLET_LINK_PURPOSE,
  WALLET_SESSION_TOKEN_PREFIX,
  createWalletAuthSessionController,
  getWalletAuthEligibility,
  isEduNetChainId,
  isWalletAuthFrontendEnabled,
  isWalletAuthSessionExpired,
  normalizeOrigin,
  normalizeWalletChainId,
  resolveConnectedWalletChainId,
  runWalletAuthFlow,
  validateWalletAuthChallenge,
  validateWalletAuthSession,
} from "./walletAuthFlow.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import { typedDataToWagmiArgs } from "./signEip712TypedData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const WALLET = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const ORIGIN = "https://web3edu.dimikog.org";
const TOKEN = `${WALLET_SESSION_TOKEN_PREFIX}test_session_token_value_abc123xyz`;

function sampleTypedData({
  purpose = WALLET_AUTH_PURPOSE,
  chainId = WALLET_AUTH_CHAIN_ID,
  wallet = WALLET,
  origin = ORIGIN,
  primaryType = WALLET_AUTH_PRIMARY_TYPE,
  includeBinding = false,
} = {}) {
  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    WalletAuth: [
      { name: "purpose", type: "string" },
      { name: "wallet", type: "address" },
      { name: "nonce", type: "string" },
      { name: "issuedAt", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "chainId", type: "uint256" },
      { name: "origin", type: "string" },
    ],
  };
  if (includeBinding) {
    types.WalletBinding = [{ name: "purpose", type: "string" }];
  }
  return {
    types,
    primaryType,
    domain: { name: "Web3Edu", version: "1", chainId },
    message: {
      purpose,
      wallet,
      nonce: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      issuedAt: 1_700_000_000,
      expiresAt: 1_700_000_300,
      chainId,
      origin,
    },
  };
}

function sampleChallenge(overrides = {}) {
  const typedData = overrides.typedData || sampleTypedData();
  return {
    ok: true,
    reasonCode: "CHALLENGE_ISSUED",
    challengeId: "c1",
    walletAddress: WALLET,
    expiresAt: "2026-01-01T00:05:00.000Z",
    issuedAt: "2026-01-01T00:00:00.000Z",
    protocolVersion: 1,
    chainId: WALLET_AUTH_CHAIN_ID,
    origin: ORIGIN,
    purpose: WALLET_AUTH_PURPOSE,
    typedData,
    nonce: typedData.message.nonce,
    ...overrides,
  };
}

function sampleSession(overrides = {}) {
  return {
    ok: true,
    reasonCode: "SESSION_CREATED",
    sessionId: "s1",
    walletAddress: WALLET,
    token: TOKEN,
    tokenType: "Bearer",
    scope: WALLET_AUTH_SESSION_SCOPE,
    expiresAt: "2099-01-01T00:00:00.000Z",
    issuedAt: "2026-01-01T00:00:00.000Z",
    challengeId: "c1",
    ...overrides,
  };
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

// ---------------------------------------------------------------------------
// Feature flag
// ---------------------------------------------------------------------------

test("16. frontend flag disabled by default / non-1 values", () => {
  assert.equal(isWalletAuthFrontendEnabled({}), false);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "" }), false);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "0" }), false);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "yes" }), false);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "1" }), true);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "true" }), true);
  assert.equal(isWalletAuthFrontendEnabled({ VITE_WALLET_AUTH_ENABLED: "TRUE" }), true);
});

// ---------------------------------------------------------------------------
// Challenge validation
// ---------------------------------------------------------------------------

test("1. challenge request shape uses walletAddress only (API client source)", () => {
  const api = read("api/walletAuth.js");
  assert.match(api, /\/web3edu\/auth\/wallet\/challenge/);
  assert.match(api, /body:\s*\{\s*walletAddress:\s*normalized\s*\}/);
  assert.doesNotMatch(api, /WEB3EDU_WALLET_LINK/);
  assert.doesNotMatch(api, /Authorization: `Bearer \$\{idToken/);
});

test("2. EIP-712 typedData maps to wagmi args without EIP712Domain", () => {
  const td = sampleTypedData();
  const args = typedDataToWagmiArgs(td);
  assert.equal(args.primaryType, "WalletAuth");
  assert.equal(args.domain.chainId, 424242);
  assert.equal(args.message.purpose, WALLET_AUTH_PURPOSE);
  assert.equal(args.types.EIP712Domain, undefined);
  assert.ok(args.types.WalletAuth);
});

test("3. wrong purpose rejected", () => {
  assert.throws(
    () =>
      validateWalletAuthChallenge(
        sampleChallenge({ purpose: WALLET_LINK_PURPOSE }),
        { walletAddress: WALLET, expectedOrigin: ORIGIN }
      ),
    (err) => err.reasonCode === WALLET_AUTH_REASON.PURPOSE_MISMATCH
  );
  assert.throws(
    () =>
      validateWalletAuthChallenge(
        sampleChallenge({
          typedData: sampleTypedData({ purpose: WALLET_LINK_PURPOSE }),
        }),
        { walletAddress: WALLET, expectedOrigin: ORIGIN }
      ),
    (err) => err.reasonCode === WALLET_AUTH_REASON.PURPOSE_MISMATCH
  );
});

test("4. wrong chain rejected", () => {
  assert.throws(
    () =>
      validateWalletAuthChallenge(sampleChallenge({ chainId: 1 }), {
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.CHAIN_ID_MISMATCH
  );
  assert.throws(
    () =>
      validateWalletAuthChallenge(
        sampleChallenge({ typedData: sampleTypedData({ chainId: 1 }) }),
        { walletAddress: WALLET, expectedOrigin: ORIGIN }
      ),
    (err) => err.reasonCode === WALLET_AUTH_REASON.CHAIN_ID_MISMATCH
  );
});

test("5. wrong wallet rejected", () => {
  const other = "0x00000000000000000000000000000000000000e2";
  assert.throws(
    () =>
      validateWalletAuthChallenge(sampleChallenge({ walletAddress: other }), {
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.WALLET_MISMATCH
  );
});

test("6. invalid challenge rejected", () => {
  assert.throws(
    () =>
      validateWalletAuthChallenge(sampleChallenge({ typedData: null }), {
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.INVALID_CHALLENGE
  );
  assert.throws(
    () =>
      validateWalletAuthChallenge(sampleChallenge({ challengeId: "" }), {
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.INVALID_CHALLENGE
  );
  assert.throws(
    () =>
      validateWalletAuthChallenge(
        sampleChallenge({
          typedData: sampleTypedData({ primaryType: "WalletBinding", includeBinding: true }),
          purpose: WALLET_AUTH_PURPOSE,
        }),
        { walletAddress: WALLET, expectedOrigin: ORIGIN }
      ),
    (err) => err.reasonCode === WALLET_AUTH_REASON.PURPOSE_MISMATCH
  );
  assert.equal(normalizeOrigin(`${ORIGIN}/`), ORIGIN);
});

test("valid challenge accepted", () => {
  const v = validateWalletAuthChallenge(sampleChallenge(), {
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
  });
  assert.equal(v.challengeId, "c1");
  assert.equal(v.walletAddress.toLowerCase(), WALLET.toLowerCase());
  assert.equal(v.typedData.primaryType, "WalletAuth");
});

// ---------------------------------------------------------------------------
// Confirm / session validation
// ---------------------------------------------------------------------------

test("7. confirm response validation", () => {
  const session = validateWalletAuthSession(sampleSession(), { walletAddress: WALLET });
  assert.equal(session.token, TOKEN);
  assert.equal(session.sessionId, "s1");
  assert.equal(session.scope, WALLET_AUTH_SESSION_SCOPE);
  assert.ok(session.expiresAtMs > Date.now());

  assert.throws(
    () =>
      validateWalletAuthSession(sampleSession({ token: "jwt.not.wallet" }), {
        walletAddress: WALLET,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.INVALID_SESSION
  );
  assert.throws(
    () =>
      validateWalletAuthSession(sampleSession({ scope: "other" }), {
        walletAddress: WALLET,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.INVALID_SESSION
  );
});

test("17. expired session invalidated", () => {
  const session = validateWalletAuthSession(
    sampleSession({ expiresAt: "2000-01-01T00:00:00.000Z" }),
    { walletAddress: WALLET }
  );
  assert.equal(isWalletAuthSessionExpired(session), true);
  assert.equal(isWalletAuthSessionExpired(session, session.expiresAtMs - 1), false);
});

// ---------------------------------------------------------------------------
// Flow orchestration
// ---------------------------------------------------------------------------

test("runWalletAuthFlow: challenge → sign → confirm happy path", async () => {
  const signed = [];
  const api = {
    createChallenge: async ({ walletAddress }) => {
      assert.equal(walletAddress.toLowerCase(), WALLET.toLowerCase());
      return sampleChallenge();
    },
    confirm: async ({ walletAddress, challengeId, nonce, signature }) => {
      assert.equal(walletAddress.toLowerCase(), WALLET.toLowerCase());
      assert.equal(challengeId, "c1");
      assert.ok(nonce);
      assert.equal(signature, "0xsig");
      return sampleSession();
    },
  };

  const session = await runWalletAuthFlow({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: WALLET_AUTH_CHAIN_ID,
    signTypedDataAsync: async (args) => {
      signed.push(args);
      assert.equal(args.primaryType, "WalletAuth");
      assert.equal(args.message.purpose, WALLET_AUTH_PURPOSE);
      assert.equal(args.types.EIP712Domain, undefined);
      return "0xsig";
    },
    api,
  });

  assert.equal(session.token, TOKEN);
  assert.equal(signed.length, 1);
});

test("14. user rejects signature", async () => {
  await assert.rejects(
    () =>
      runWalletAuthFlow({
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
        chainId: WALLET_AUTH_CHAIN_ID,
        signTypedDataAsync: async () => {
          const err = new Error("User rejected the request");
          err.code = 4001;
          throw err;
        },
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            throw new Error("confirm must not run");
          },
        },
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.USER_REJECTED
  );
});

test("15. backend feature disabled", async () => {
  await assert.rejects(
    () =>
      runWalletAuthFlow({
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
        chainId: WALLET_AUTH_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => {
            const err = new Error("WALLET_AUTH_API_DISABLED");
            err.status = 404;
            err.reasonCode = "WALLET_AUTH_API_DISABLED";
            err.payload = { ok: false, error: "WALLET_AUTH_API_DISABLED" };
            throw err;
          },
        },
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.API_DISABLED
  );
});

// ---------------------------------------------------------------------------
// Session controller lifecycle
// ---------------------------------------------------------------------------

test("8. session stored only in memory (no web storage writes)", async () => {
  const writes = [];
  const fakeStorage = {
    setItem(...args) {
      writes.push(args);
    },
    getItem() {
      return null;
    },
    removeItem() {},
  };
  globalThis.localStorage = fakeStorage;
  globalThis.sessionStorage = fakeStorage;

  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });

  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: WALLET_AUTH_CHAIN_ID,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });

  assert.equal(ctrl.getSnapshot().session?.token, TOKEN);
  assert.equal(writes.length, 0);

  const flowSrc = read("utils/walletAuthFlow.js");
  const hookSrc = read("hooks/useWalletAuthSession.js");
  const apiSrc = read("api/walletAuth.js");
  for (const src of [flowSrc, hookSrc, apiSrc]) {
    assert.doesNotMatch(src, /localStorage\.setItem/);
    assert.doesNotMatch(src, /sessionStorage\.setItem/);
    assert.doesNotMatch(src, /indexedDB\./i);
    assert.doesNotMatch(src, /document\.cookie/);
  }
});

test("9. wallet switch invalidates session", async () => {
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });
  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  assert.ok(ctrl.getSnapshot().session);
  ctrl.onWalletAddressChange("0x00000000000000000000000000000000000000e2", WALLET);
  assert.equal(ctrl.getSnapshot().session, null);
});

test("10. chain switch invalidates session", async () => {
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });
  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  ctrl.onChainChange(1);
  assert.equal(ctrl.getSnapshot().session, null);
});

test("11. disconnect invalidates session", async () => {
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });
  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  ctrl.onDisconnect();
  assert.equal(ctrl.getSnapshot().session, null);
});

test("12. late confirm cannot restore stale session", async () => {
  let releaseConfirm;
  const confirmGate = new Promise((resolve) => {
    releaseConfirm = resolve;
  });

  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () => {
      await confirmGate;
      return validateWalletAuthSession(sampleSession(), { walletAddress: WALLET });
    },
  });

  const authPromise = ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });

  // Invalidate while confirm is in flight.
  ctrl.onDisconnect();
  releaseConfirm();

  await assert.rejects(authPromise, (err) => err.reasonCode === WALLET_AUTH_REASON.WALLET_SWITCH);
  assert.equal(ctrl.getSnapshot().session, null);
});

test("13. duplicate authenticate calls share one in-flight request", async () => {
  let runs = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });

  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () => {
      runs += 1;
      await gate;
      return validateWalletAuthSession(sampleSession(), { walletAddress: WALLET });
    },
  });

  const args = {
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  };

  const p1 = ctrl.authenticate(args);
  const p2 = ctrl.authenticate(args);
  assert.equal(p1, p2);
  release();
  const [s1, s2] = await Promise.all([p1, p2]);
  assert.equal(runs, 1);
  assert.equal(s1.token, TOKEN);
  assert.equal(s2.token, TOKEN);
});

test("16b. frontend flag disables authenticate (no flow)", async () => {
  let ran = false;
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => false,
    runFlow: async () => {
      ran = true;
      return validateWalletAuthSession(sampleSession(), { walletAddress: WALLET });
    },
  });
  await assert.rejects(
    () =>
      ctrl.authenticate({
        walletAddress: WALLET,
        expectedOrigin: ORIGIN,
        chainId: 424242,
        isConnected: true,
        viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
        walletOnlyModeEstablished: true,
      }),
    (err) => err.reasonCode === WALLET_AUTH_REASON.FRONTEND_DISABLED
  );
  assert.equal(ran, false);
});

test("15b. API disabled marks unavailable and blocks retries", async () => {
  let calls = 0;
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () => {
      calls += 1;
      throw Object.assign(new Error("disabled"), {
        reasonCode: WALLET_AUTH_REASON.API_DISABLED,
      });
    },
  });

  const args = {
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  };

  await assert.rejects(() => ctrl.authenticate(args), (err) => {
    return err.reasonCode === WALLET_AUTH_REASON.API_DISABLED;
  });
  assert.equal(ctrl.getSnapshot().unavailableReason, WALLET_AUTH_REASON.API_DISABLED);

  await assert.rejects(() => ctrl.authenticate(args), (err) => {
    return err.reasonCode === WALLET_AUTH_REASON.API_DISABLED;
  });
  assert.equal(calls, 1);
});

// ---------------------------------------------------------------------------
// Mode exclusions
// ---------------------------------------------------------------------------

test("18. OIDC mode does not authenticate wallet", () => {
  const e = getWalletAuthEligibility({
    isOidcAuthenticated: true,
    isConnected: true,
    chainId: 424242,
    viewerSource: VIEWER_SOURCE_OIDC_SOCIAL,
    walletOnlyModeEstablished: true,
  });
  assert.equal(e.ok, false);
  assert.equal(e.reasonCode, WALLET_AUTH_REASON.OIDC_ACTIVE);
});

test("19. linked-alias / AA modes excluded", () => {
  const linked = getWalletAuthEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: 424242,
    viewerSource: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
    walletOnlyModeEstablished: true,
  });
  assert.equal(linked.ok, false);
  assert.equal(linked.reasonCode, WALLET_AUTH_REASON.LINKED_ALIAS);

  const aa = getWalletAuthEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: 424242,
    viewerSource: VIEWER_SOURCE_DEVICE_AA,
    walletOnlyModeEstablished: true,
  });
  assert.equal(aa.ok, false);
  assert.equal(aa.reasonCode, WALLET_AUTH_REASON.DEVICE_AA);

  const ok = getWalletAuthEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: 424242,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletOnlyModeEstablished: true,
  });
  assert.equal(ok.ok, true);
});

test("wrong chain eligibility", () => {
  const e = getWalletAuthEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: 1,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  assert.equal(e.ok, false);
  assert.equal(e.reasonCode, WALLET_AUTH_REASON.WRONG_CHAIN);
});

// ---------------------------------------------------------------------------
// No token/signature logging + hook wiring source contracts
// ---------------------------------------------------------------------------

test("20. no token or signature logging", () => {
  const files = [
    read("api/walletAuth.js"),
    read("utils/walletAuthFlow.js"),
    read("hooks/useWalletAuthSession.js"),
  ];
  for (const src of files) {
    assert.doesNotMatch(src, /console\.(log|debug|info|warn|error)\([^\)]*token/i);
    assert.doesNotMatch(src, /console\.(log|debug|info|warn|error)\([^\)]*signature/i);
    assert.doesNotMatch(src, /console\.(log|debug|info|warn|error)\([^\)]*Bearer/i);
  }
});

test("hook exposes authenticate without auto-sign; does not touch resolve wiring", () => {
  const hook = read("hooks/useWalletAuthSession.js");
  assert.match(hook, /authenticate/);
  assert.match(hook, /createWalletAuthSessionController/);
  assert.match(hook, /useSignTypedData/);
  assert.match(hook, /onDisconnect|onChainChange|onWalletAddressChange/);
  assert.match(hook, /resolveConnectedWalletChainId/);
  assert.match(hook, /accountChainId/);
  // WA-01e2.1: must not import wagmi config useChainId.
  const wagmiImport = hook.match(/import\s*\{([^}]*)\}\s*from\s*["']wagmi["']/);
  assert.ok(wagmiImport, "expected wagmi import");
  assert.equal(/\buseChainId\b/.test(wagmiImport[1]), false);
  assert.doesNotMatch(hook, /useResolvedIdentity/);
  assert.doesNotMatch(hook, /web3sbt\/resolve/);
  assert.doesNotMatch(hook, /WEB3EDU_WALLET_LINK/);
  // Hook must not import the provider (comment references are fine).
  assert.doesNotMatch(hook, /from ["'].*ResolvedIdentityProvider/);

  // Must not auto-call authenticate on mount/connect (effects only clear/check).
  const effectBlocks = [...hook.matchAll(/useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\},/g)].map(
    (m) => m[1]
  );
  assert.ok(effectBlocks.length >= 2);
  for (const body of effectBlocks) {
    assert.doesNotMatch(body, /\bauthenticate\s*\(/);
  }
});

test("flow reuses signEip712TypedData and never wallet-link purpose for signing", () => {
  const flow = read("utils/walletAuthFlow.js");
  assert.match(flow, /signEip712TypedData/);
  assert.match(flow, /WALLET_AUTH_PURPOSE = "WEB3EDU_WALLET_AUTH"/);
  assert.match(flow, /WALLET_LINK_PURPOSE/);
  // Rejects link purpose; does not call link APIs.
  assert.doesNotMatch(flow, /identity\/link/);
  assert.doesNotMatch(flow, /createIdentityLinkChallenge/);
});

test("reauth allows exactly one controlled attempt after allowReauth", async () => {
  let runs = 0;
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () => {
      runs += 1;
      throw Object.assign(new Error("user rejected"), {
        reasonCode: WALLET_AUTH_REASON.USER_REJECTED,
      });
    },
  });
  const args = {
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
    allowReauth: true,
  };
  await assert.rejects(() => ctrl.authenticate(args));
  await assert.rejects(
    () => ctrl.authenticate(args),
    (err) => err.reasonCode === WALLET_AUTH_REASON.REAUTH_LIMIT
  );
  assert.equal(runs, 1);
});

// ---------------------------------------------------------------------------
// WA-01e2.1 — connected-chain authority + privacy invalidation
// ---------------------------------------------------------------------------

test("e2.1 normalizeWalletChainId supports decimal and hex", () => {
  assert.equal(normalizeWalletChainId(424242), 424242);
  assert.equal(normalizeWalletChainId("424242"), 424242);
  assert.equal(normalizeWalletChainId("0x67932"), 424242);
  assert.equal(normalizeWalletChainId("0x1"), 1);
  assert.equal(normalizeWalletChainId(null), null);
  assert.equal(normalizeWalletChainId(undefined), null);
  assert.equal(normalizeWalletChainId(""), null);
  assert.equal(normalizeWalletChainId(0), null);
  assert.equal(normalizeWalletChainId("not-a-chain"), null);
  assert.equal(isEduNetChainId(424242), true);
  assert.equal(isEduNetChainId("0x67932"), true);
  assert.equal(isEduNetChainId(1), false);
  assert.equal(isEduNetChainId(null), false);
});

test("e2.1 resolveConnectedWalletChainId prefers account over config; fails closed", () => {
  assert.equal(
    resolveConnectedWalletChainId({ accountChainId: 424242, configChainId: 1 }),
    424242
  );
  assert.equal(
    resolveConnectedWalletChainId({ accountChainId: 1, configChainId: 424242 }),
    1
  );
  assert.equal(
    resolveConnectedWalletChainId({
      accountChainId: null,
      configChainId: 424242,
    }),
    null
  );
  assert.equal(
    resolveConnectedWalletChainId({
      accountChainId: undefined,
      providerChainId: "0x1",
      configChainId: 424242,
    }),
    1
  );
  assert.equal(resolveConnectedWalletChainId({}), null);
});

test("e2.1 eligibility: supported / unsupported / unknown chain", () => {
  const base = {
    isOidcAuthenticated: false,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  };
  assert.equal(getWalletAuthEligibility({ ...base, chainId: 424242 }).ok, true);
  assert.equal(
    getWalletAuthEligibility({ ...base, chainId: 1 }).reasonCode,
    WALLET_AUTH_REASON.WRONG_CHAIN
  );
  assert.equal(
    getWalletAuthEligibility({ ...base, chainId: null }).reasonCode,
    WALLET_AUTH_REASON.WRONG_CHAIN
  );
  assert.equal(
    getWalletAuthEligibility({ ...base, chainId: undefined }).reasonCode,
    WALLET_AUTH_REASON.WRONG_CHAIN
  );
});

test("e2.1 chain switch away clears session; switch back does not restore", async () => {
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });
  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  assert.ok(ctrl.getSnapshot().session);
  const token = ctrl.getSnapshot().bearerToken;

  ctrl.onChainChange(1);
  assert.equal(ctrl.getSnapshot().session, null);
  assert.equal(ctrl.getSnapshot().bearerToken, null);

  ctrl.onChainChange(424242);
  assert.equal(ctrl.getSnapshot().session, null);
  assert.equal(ctrl.getSnapshot().bearerToken, null);
  assert.notEqual(ctrl.getSnapshot().bearerToken, token);
});

test("e2.1 rapid chain switching 424242→1→424242 never restores session", async () => {
  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () =>
      validateWalletAuthSession(sampleSession(), { walletAddress: WALLET }),
  });
  await ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });
  ctrl.onChainChange(1);
  ctrl.onChainChange(424242);
  ctrl.onChainChange(1);
  ctrl.onChainChange(424242);
  assert.equal(ctrl.getSnapshot().session, null);
  assert.equal(ctrl.getSnapshot().bearerToken, null);
});

test("e2.1 mid-flow chain switch aborts authenticate (stale completion)", async () => {
  let liveChain = 424242;
  let releaseSign;
  const signGate = new Promise((resolve) => {
    releaseSign = resolve;
  });

  const flowPromise = runWalletAuthFlow({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    getConnectedWallet: () => WALLET,
    getConnectedChainId: () => liveChain,
    signTypedDataAsync: async () => {
      liveChain = 1;
      await signGate;
      return `0x${"ab".repeat(65)}`;
    },
    api: {
      createChallenge: async () => sampleChallenge(),
      confirm: async () => sampleSession(),
    },
  });
  releaseSign();
  await assert.rejects(
    flowPromise,
    (err) => err.reasonCode === WALLET_AUTH_REASON.WRONG_CHAIN
  );
});

test("e2.1 stale controller auth discarded after chain invalidation", async () => {
  let releaseConfirm;
  const confirmGate = new Promise((resolve) => {
    releaseConfirm = resolve;
  });

  const ctrl = createWalletAuthSessionController({
    isFrontendEnabled: () => true,
    runFlow: async () => {
      await confirmGate;
      return validateWalletAuthSession(sampleSession(), { walletAddress: WALLET });
    },
  });

  const authPromise = ctrl.authenticate({
    walletAddress: WALLET,
    expectedOrigin: ORIGIN,
    chainId: 424242,
    isConnected: true,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletOnlyModeEstablished: true,
  });

  ctrl.onChainChange(1);
  releaseConfirm();

  await assert.rejects(
    authPromise,
    (err) => err.reasonCode === WALLET_AUTH_REASON.WALLET_SWITCH
  );
  assert.equal(ctrl.getSnapshot().session, null);
});
