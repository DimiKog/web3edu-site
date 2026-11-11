/**
 * WA-01c2 resolve Bearer selection + privacy wiring contracts.
 * Run: node --test src/utils/resolveBearerSelection.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  RESOLVE_BEARER_KIND,
  getWalletAuthProgressUiState,
  isWalletOnlyResolveAuthEligible,
  isWalletSessionAuthFailureError,
  selectResolveBearer,
  walletSessionMatchesIdentity,
} from "./resolveBearerSelection.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import { WALLET_SESSION_TOKEN_PREFIX } from "./walletAuthFlow.js";
import { getWalletAuthProgressCopy } from "../content/walletAuthProgressCopy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const EOA = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const OTHER = "0x00000000000000000000000000000000000000e2";
const AA = "0x00000000000000000000000000000000000000aa";

function session(overrides = {}) {
  return {
    token: `${WALLET_SESSION_TOKEN_PREFIX}abc123`,
    walletAddress: EOA,
    sessionId: "s1",
    expiresAt: "2099-01-01T00:00:00.000Z",
    expiresAtMs: Date.parse("2099-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

test("1. Keycloak Bearer priority", () => {
  const selected = selectResolveBearer({
    isOidcAuthenticated: true,
    idToken: "kc.jwt.token",
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_OIDC_SOCIAL,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: AA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.KEYCLOAK);
  assert.equal(selected.token, "kc.jwt.token");
  assert.equal(selected.authStateKey, "keycloak");
  assert.equal(selected.token.startsWith(WALLET_SESSION_TOKEN_PREFIX), false);
});

test("2. Wallet-only Bearer selection", () => {
  const selected = selectResolveBearer({
    isOidcAuthenticated: false,
    idToken: null,
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.WALLET);
  assert.equal(selected.token, session().token);
  assert.equal(selected.authStateKey, "wallet:s1");
});

test("3. Anonymous public resolve", () => {
  const selected = selectResolveBearer({
    isOidcAuthenticated: false,
    idToken: null,
    walletSession: null,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.NONE);
  assert.equal(selected.token, null);
  assert.equal(selected.authStateKey, "anon");
});

test("4. Linked-alias exclusion", () => {
  const eligible = isWalletOnlyResolveAuthEligible({
    isOidcAuthenticated: false,
    viewerSource: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryMode: "social",
    identityAddress: AA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(eligible, false);

  const selected = selectResolveBearer({
    isOidcAuthenticated: false,
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryMode: "social",
    identityAddress: AA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.NONE);
});

test("5. AA exclusion", () => {
  const eligible = isWalletOnlyResolveAuthEligible({
    isOidcAuthenticated: false,
    viewerSource: VIEWER_SOURCE_DEVICE_AA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: AA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.equal(eligible, false);
});

test("wallet session must match identity + connected EOA", () => {
  assert.equal(walletSessionMatchesIdentity(session(), EOA, EOA), true);
  assert.equal(walletSessionMatchesIdentity(session(), OTHER, OTHER), false);
  assert.equal(walletSessionMatchesIdentity(session({ walletAddress: OTHER }), EOA, EOA), false);
  assert.equal(
    walletSessionMatchesIdentity(
      session({ expiresAtMs: Date.parse("2000-01-01T00:00:00.000Z") }),
      EOA,
      EOA
    ),
    false
  );
});

test("9. Same-address authStateKey changes between wallet and anon", () => {
  const withSession = selectResolveBearer({
    isOidcAuthenticated: false,
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  const without = selectResolveBearer({
    isOidcAuthenticated: false,
    walletSession: null,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: true,
  });
  assert.notEqual(withSession.authStateKey, without.authStateKey);
  assert.equal(without.authStateKey, "anon");
});

test("11. 401 session failure detection", () => {
  assert.equal(
    isWalletSessionAuthFailureError({
      status: 401,
      payload: { reasonCode: "SESSION_EXPIRED" },
    }),
    true
  );
  assert.equal(
    isWalletSessionAuthFailureError({
      status: 401,
      payload: { reasonCode: "SESSION_REVOKED" },
    }),
    true
  );
  assert.equal(
    isWalletSessionAuthFailureError({
      status: 401,
      code: "SESSION_NOT_FOUND",
    }),
    true
  );
  assert.equal(
    isWalletSessionAuthFailureError({
      status: 401,
      payload: { reasonCode: "invalid_token" },
    }),
    false
  );
  assert.equal(
    isWalletSessionAuthFailureError({ status: 503, code: "SESSION_EXPIRED" }),
    false
  );
});

test("12/13/14. UI states: prompt, rejected, expired, unavailable, hidden", () => {
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      isAvailable: true,
    }),
    "prompt"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      isAvailable: true,
      isAuthenticating: true,
    }),
    "signing"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      isAvailable: true,
      authErrorReason: "USER_REJECTED",
    }),
    "rejected"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      isAvailable: true,
      sessionInvalidationReason: "SESSION_EXPIRED",
    }),
    "expired"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      isAvailable: false,
    }),
    "unavailable"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      isOidcAuthenticated: true,
      eligible: true,
      frontendEnabled: true,
    }),
    "hidden"
  );
  assert.equal(
    getWalletAuthProgressUiState({
      eligible: true,
      frontendEnabled: true,
      hasWalletSession: true,
    }),
    "hidden"
  );
});

test("15. EN/GR UX copy", () => {
  const en = getWalletAuthProgressCopy(false);
  const gr = getWalletAuthProgressCopy(true);
  assert.match(en.verifyAction, /Verify wallet/i);
  assert.match(gr.verifyAction, /Επαλήθευση/);
  assert.notEqual(en.verifyAction, gr.verifyAction);
  assert.match(en.expiredTitle, /expired/i);
  assert.match(gr.expiredTitle, /έληξε/i);
});

test("20. Feature flag OFF preserves anonymous Bearer", () => {
  const selected = selectResolveBearer({
    isOidcAuthenticated: false,
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: 424242,
    frontendEnabled: false,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.NONE);
  assert.equal(selected.token, null);
});

test("e2.1 selectResolveBearer refuses w3wa1_ on unsupported/unknown chain", () => {
  const base = {
    isOidcAuthenticated: false,
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    frontendEnabled: true,
  };
  assert.equal(
    selectResolveBearer({ ...base, chainId: 424242 }).kind,
    RESOLVE_BEARER_KIND.WALLET
  );
  assert.equal(
    selectResolveBearer({ ...base, chainId: 1 }).kind,
    RESOLVE_BEARER_KIND.NONE
  );
  assert.equal(
    selectResolveBearer({ ...base, chainId: null }).kind,
    RESOLVE_BEARER_KIND.NONE
  );
  assert.equal(isWalletOnlyResolveAuthEligible({ ...base, chainId: 1 }), false);
  assert.equal(isWalletOnlyResolveAuthEligible({ ...base, chainId: null }), false);
});

test("e2.1 Keycloak coexistence: chain switch does not drop Keycloak Bearer", () => {
  const selected = selectResolveBearer({
    isOidcAuthenticated: true,
    idToken: "kc.jwt.token",
    walletSession: session(),
    viewerSource: VIEWER_SOURCE_OIDC_SOCIAL,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: AA,
    connectedEoa: EOA,
    chainId: 1,
    frontendEnabled: true,
  });
  assert.equal(selected.kind, RESOLVE_BEARER_KIND.KEYCLOAK);
  assert.equal(selected.token, "kc.jwt.token");
});

test("6-10/16-19. Provider + resolve hook privacy wiring (source contracts)", () => {
  const provider = read("context/ResolvedIdentityProvider.jsx");
  const resolveHook = read("hooks/useResolvedIdentity.js");
  const dashboard = read("pages/Dashboard.jsx");
  const dashboardGr = read("pages/DashboardGR.jsx");
  const verify = read("pages/VerifyIdentity.jsx");
  const verifyGr = read("pages/VerifyIdentityGR.jsx");
  const banner = read("components/WalletAuthProgressBanner.jsx");
  const selection = read("utils/resolveBearerSelection.js");

  assert.match(provider, /useWalletAuthSession/);
  assert.match(provider, /selectResolveBearer/);
  assert.match(provider, /resolveConnectedWalletChainId/);
  assert.match(provider, /authStateKey/);
  assert.match(provider, /onPrivateAuthFailure/);
  assert.match(provider, /walletAuthProgress/);
  const wagmiImport = provider.match(/import\s*\{([^}]*)\}\s*from\s*["']wagmi["']/);
  assert.ok(wagmiImport, "expected wagmi import in provider");
  assert.equal(/\buseChainId\b/.test(wagmiImport[1]), false);
  assert.doesNotMatch(provider, /localStorage\.setItem/);
  assert.doesNotMatch(provider, /sessionStorage\.setItem/);

  assert.match(resolveHook, /resolveDataKey/);
  assert.match(resolveHook, /isWalletSessionAuthFailureError/);
  assert.match(resolveHook, /onPrivateAuthFailureRef/);
  assert.match(resolveHook, /authStateKey/);

  assert.match(dashboard, /WalletAuthProgressBanner/);
  assert.match(dashboardGr, /WalletAuthProgressBanner/);
  assert.match(dashboard, /walletAuthProgress/);
  assert.match(dashboardGr, /isGR/);

  // Verify pages remain public (no wallet auth / Bearer wiring).
  assert.doesNotMatch(verify, /useWalletAuthSession/);
  assert.doesNotMatch(verify, /w3wa1_/);
  assert.doesNotMatch(verifyGr, /useWalletAuthSession/);
  assert.doesNotMatch(verify, /WalletAuthProgressBanner/);

  assert.match(banner, /Verify wallet|verifyAction/);
  assert.doesNotMatch(banner, /Private access verified/i);

  assert.match(selection, /Never combine credentials|Never reuse a wallet token/i);
  assert.match(selection, /KEYCLOAK/);
  assert.match(selection, /WALLET/);
});

test("16. no token writes in new WA-01c2 surfaces", () => {
  const files = [
    read("utils/resolveBearerSelection.js"),
    read("components/WalletAuthProgressBanner.jsx"),
    read("content/walletAuthProgressCopy.js"),
    read("context/ResolvedIdentityProvider.jsx"),
  ];
  for (const src of files) {
    assert.doesNotMatch(src, /localStorage\.setItem/);
    assert.doesNotMatch(src, /sessionStorage\.setItem/);
    assert.doesNotMatch(src, /console\.(log|debug|info|warn|error)\([^\)]*token/i);
    assert.doesNotMatch(src, /console\.(log|debug|info|warn|error)\([^\)]*w3wa1_/i);
  }
});

test("18. Keycloak path still preferred in provider source", () => {
  const provider = read("context/ResolvedIdentityProvider.jsx");
  assert.match(provider, /isOidcAuthenticated/);
  assert.match(provider, /idToken/);
  assert.match(provider, /selectResolveBearer/);
});
