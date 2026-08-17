/**
 * Admin eligibility semantics (H3F admin identity auth).
 * Run: node --test src/utils/adminEligibility.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  ACTIVE_BINDING_STATUS,
  computeAdminEligibility,
  computeOidcSocialAdminEligibility,
  computeWalletOnlyAdminEligibility,
  getAdminWalletAllowlist,
  isAdminWalletAddress,
  parseAdminWalletAllowlist,
  pickActiveLinkedAdminWallet,
} from "./adminEligibility.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "../..");

const ADMIN_A = "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e";
const ADMIN_B = "0x859e88a0bd63db831e7deef4cb86be0015d81a0a";
const NON_ADMIN = "0x1111111111111111111111111111111111111111";
const allowlist = [ADMIN_A, ADMIN_B];

function activeBinding(walletAddress, overrides = {}) {
  return {
    bindingId: 1,
    walletAddress,
    status: ACTIVE_BINDING_STATUS,
    isPrimary: true,
    ...overrides,
  };
}

test("admin Keycloak learner + ACTIVE linked admin wallet → eligible", () => {
  const status = { activeBindings: [activeBinding(ADMIN_A)] };
  const result = computeOidcSocialAdminEligibility(status, allowlist);
  assert.equal(result.isAdminEligible, true);
  assert.equal(result.adminWalletAddress, ADMIN_A);
});

test("linked admin wallet without connected wallet → still eligible (OIDC path)", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_A)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(result.isAdminEligible, true);
  assert.equal(result.adminWalletAddress, ADMIN_A);
});

test("non-admin Keycloak learner → not eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(NON_ADMIN)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
});

test("non-admin after admin session (OIDC switch) → not eligible", () => {
  const afterSwitch = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [] },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(afterSwitch.isAdminEligible, false);
});

test("stale connected admin wallet for unrelated OIDC learner → not eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(NON_ADMIN)] },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
});

test("linked non-admin wallet → not eligible", () => {
  const wallet = pickActiveLinkedAdminWallet(
    { activeBindings: [activeBinding(NON_ADMIN)] },
    allowlist
  );
  assert.equal(wallet, null);
});

test("revoked admin binding → not eligible", () => {
  const wallet = pickActiveLinkedAdminWallet(
    {
      activeBindings: [
        { walletAddress: ADMIN_A, status: "REVOKED" },
      ],
    },
    allowlist
  );
  assert.equal(wallet, null);
});

test("wallet disconnected but ACTIVE admin binding for current learner → eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_B)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(result.isAdminEligible, true);
  assert.equal(result.adminWalletAddress, ADMIN_B);
});

test("OIDC logout clears eligibility (no token / not authenticated)", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: false,
    linkStatus: null,
    linkStatusLoaded: false,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
});

test("wallet-only admin path is retired (never eligible)", () => {
  const result = computeWalletOnlyAdminEligibility(ADMIN_A, true, allowlist);
  assert.equal(result.isAdminEligible, false);
  assert.equal(result.adminWalletAddress, null);
});

test("wallet-only path ignores disconnected stale admin address", () => {
  const result = computeWalletOnlyAdminEligibility(ADMIN_A, false, allowlist);
  assert.equal(result.isAdminEligible, false);
});

test("frontend never grants admin merely from localStorage wallet (wallet-only path)", () => {
  const result = computeWalletOnlyAdminEligibility(ADMIN_A, false, allowlist);
  assert.equal(result.isAdminEligible, false);
});

test("frontend never grants admin merely from connected wagmi for OIDC learner", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [] },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
});

test("pending while link status loading for OIDC learner", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: null,
    linkStatusLoaded: false,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.pending, true);
  assert.equal(result.isAdminEligible, false);
});

test("isAdminWalletAddress normalizes case", () => {
  assert.equal(isAdminWalletAddress(ADMIN_A.toUpperCase(), allowlist), true);
});

test("primaryWallet ACTIVE admin binding counts when listed alone", () => {
  const wallet = pickActiveLinkedAdminWallet(
    { primaryWallet: activeBinding(ADMIN_A), activeBindings: [] },
    allowlist
  );
  assert.equal(wallet, ADMIN_A);
});

test("missing/empty admin allowlist fails closed for ACTIVE admin binding", () => {
  const status = { activeBindings: [activeBinding(ADMIN_A)] };
  assert.equal(computeOidcSocialAdminEligibility(status, []).isAdminEligible, false);
  assert.equal(
    computeAdminEligibility({
      isOidcAuthenticated: true,
      linkStatus: status,
      linkStatusLoaded: true,
      connectedWalletAddress: null,
      isWalletConnected: false,
      allowlist: [],
    }).isAdminEligible,
    false
  );
});

test("parseAdminWalletAllowlist is independent of DEV/PROD mode", () => {
  const prodLike =
    "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e,0x859e88a0bd63db831e7deef4cb86be0015d81a0a,0x5a654ecf6766400506c81cf1a7f8f185715e5a78";
  const parsed = parseAdminWalletAllowlist(prodLike);
  assert.deepEqual(parsed, getAdminWalletAllowlist(prodLike));
  assert.equal(parsed.length, 3);
  assert.equal(parsed.includes(ADMIN_A), true);
  assert.equal(parsed.includes(ADMIN_B), true);
});

test("parseAdminWalletAllowlist empty/invalid values fail closed", () => {
  assert.deepEqual(parseAdminWalletAllowlist(undefined), []);
  assert.deepEqual(parseAdminWalletAllowlist(null), []);
  assert.deepEqual(parseAdminWalletAllowlist(""), []);
  assert.deepEqual(parseAdminWalletAllowlist(false), []);
  assert.deepEqual(parseAdminWalletAllowlist("false"), []);
  assert.deepEqual(getAdminWalletAllowlist(), []);
});

test("admin wallet allowlist normalizes case and drops junk tokens", () => {
  const parsed = parseAdminWalletAllowlist(
    ` ${ADMIN_A.toUpperCase()} , not-an-address, ${ADMIN_B} `
  );
  assert.deepEqual(parsed, [ADMIN_A, ADMIN_B]);
});

test("production env defines the allowlist; untracked local dev env must match it", () => {
  const readEnvValue = (file, key) => {
    let src;
    try {
      src = readFileSync(join(siteRoot, file), "utf8");
    } catch {
      return null;
    }
    const line = src.split("\n").find((row) => row.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim() : null;
  };

  const productionValue = readEnvValue(".env.production", "VITE_ADMIN_WALLETS");
  assert.ok(productionValue, ".env.production must define VITE_ADMIN_WALLETS");
  const fromProduction = parseAdminWalletAllowlist(productionValue);
  assert.equal(fromProduction.includes(ADMIN_A), true);
  assert.equal(fromProduction.length > 0, true);

  // Local dev overrides live in untracked *.local files; only checked when present.
  for (const file of [".env.local", ".env.development.local"]) {
    const localValue = readEnvValue(file, "VITE_ADMIN_WALLETS");
    if (localValue === null) continue;
    assert.deepEqual(
      parseAdminWalletAllowlist(localValue),
      fromProduction,
      `${file} allowlist must match .env.production`
    );
  }

  // The tracked .env must not carry the allowlist (kept out of committed config).
  assert.equal(readEnvValue(".env", "VITE_ADMIN_WALLETS"), null);
});

test("hook passes Vite env directly; util does not use import.meta or localStorage", () => {
  const hook = readFileSync(join(__dirname, "../hooks/useAdminEligibility.js"), "utf8");
  const util = readFileSync(join(__dirname, "adminEligibility.js"), "utf8");
  assert.match(hook, /getAdminWalletAllowlist\(import\.meta\.env\.VITE_ADMIN_WALLETS\)/);
  assert.doesNotMatch(hook, /import\.meta\.env\?\.VITE_ADMIN_WALLETS/);
  assert.doesNotMatch(hook, /localStorage/);
  assert.doesNotMatch(util, /import\.meta/);
  assert.doesNotMatch(util, /localStorage/);
});

/* ── Linked-wallet admin matrix: no live connection required for OIDC ── */

test("matrix 1: OIDC admin + ACTIVE linked admin wallet + wagmi disconnected → eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_A)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(result.isAdminEligible, true);
  assert.equal(result.adminWalletAddress, ADMIN_A);
  assert.equal(result.pending, false);
});

test("matrix 2: OIDC admin eligible from linked binding, not from a different connected wallet", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_A)] },
    linkStatusLoaded: true,
    connectedWalletAddress: NON_ADMIN,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.isAdminEligible, true);
  assert.equal(result.adminWalletAddress, ADMIN_A);
});

test("matrix 3: OIDC without admin binding + admin wallet connected → NOT eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(NON_ADMIN)] },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
  assert.equal(result.adminWalletAddress, null);
});

test("matrix 4: non-admin OIDC learner + stale admin wallet connected → NOT eligible", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [], primaryWallet: null },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.isAdminEligible, false);
});

test("matrix 5: after OIDC logout, wallet-only mode is never privileged admin", () => {
  const staleLinkStatus = { activeBindings: [activeBinding(ADMIN_A)] };
  const disconnected = computeAdminEligibility({
    isOidcAuthenticated: false,
    linkStatus: staleLinkStatus,
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(disconnected.isAdminEligible, false);

  const connected = computeAdminEligibility({
    isOidcAuthenticated: false,
    linkStatus: staleLinkStatus,
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_B,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(connected.isAdminEligible, false);
  assert.equal(connected.adminWalletAddress, null);
});

test("matrix 6+7: wallet-only admin is retired even with a live connection", () => {
  assert.equal(computeWalletOnlyAdminEligibility(ADMIN_A, true, allowlist).isAdminEligible, false);
  assert.equal(computeWalletOnlyAdminEligibility(ADMIN_A, false, allowlist).isAdminEligible, false);
});

test("matrix 8: OIDC admin API wallet is the ACTIVE linked admin wallet", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: {
      activeBindings: [activeBinding(NON_ADMIN, { bindingId: 7, isPrimary: false })],
      primaryWallet: activeBinding(ADMIN_B, { bindingId: 8 }),
    },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist,
  });
  assert.equal(result.adminWalletAddress, ADMIN_B);
  assert.notEqual(result.adminWalletAddress, ADMIN_A);
});

test("matrix 9: hook forwards no wagmi values in OIDC mode and reads no localStorage", () => {
  const hook = readFileSync(join(__dirname, "../hooks/useAdminEligibility.js"), "utf8");
  assert.match(hook, /connectedWalletAddress:\s*isOidcAuthenticated\s*\?\s*null\s*:\s*address/);
  assert.match(hook, /isWalletConnected:\s*isOidcAuthenticated\s*\?\s*false\s*:\s*isConnected/);
  assert.doesNotMatch(hook, /localStorage/);
  assert.doesNotMatch(hook, /web3edu-wallet-address/);
});

test("matrix 10: identity switch drops the previous learner's linked admin eligibility", () => {
  const hook = readFileSync(join(__dirname, "../hooks/useAdminEligibility.js"), "utf8");
  // Token change must clear cached link status before the next fetch resolves.
  assert.match(hook, /lastTokenRef\.current\s*!==\s*idToken/);
  assert.match(hook, /setLinkStatus\(null\)/);

  const previousAdminSession = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_A)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(previousAdminSession.isAdminEligible, true);

  // New learner: link status cleared → pending, then non-admin bindings → hidden.
  const switching = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: null,
    linkStatusLoaded: false,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(switching.isAdminEligible, false);
  assert.equal(switching.pending, true);

  const newLearner = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(NON_ADMIN)] },
    linkStatusLoaded: true,
    connectedWalletAddress: null,
    isWalletConnected: false,
    allowlist,
  });
  assert.equal(newLearner.isAdminEligible, false);
});

test("OIDC eligibility ignores wagmi even when allowlist is empty", () => {
  const result = computeAdminEligibility({
    isOidcAuthenticated: true,
    linkStatus: { activeBindings: [activeBinding(ADMIN_A)] },
    linkStatusLoaded: true,
    connectedWalletAddress: ADMIN_A,
    isWalletConnected: true,
    allowlist: [],
  });
  assert.equal(result.isAdminEligible, false);
});
