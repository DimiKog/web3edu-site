/**
 * H3F EIP-712 wallet-link flow unit tests (Node built-in test runner).
 * Run: node --test src/utils/identityLinkFlow.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  isIdentityLinkRetryable,
  mapIdentityLinkError,
  runEip712WalletLinkFlow,
} from "./identityLinkFlow.js";
import { typedDataToWagmiArgs } from "./signEip712TypedData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SAMPLE_TYPED = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    WalletBinding: [
      { name: "purpose", type: "string" },
      { name: "learnerId", type: "string" },
      { name: "wallet", type: "address" },
      { name: "nonce", type: "string" },
      { name: "issuedAt", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "chainId", type: "uint256" },
      { name: "origin", type: "string" },
    ],
  },
  primaryType: "WalletBinding",
  domain: { name: "Web3Edu", version: "1", chainId: 424242 },
  message: {
    purpose: "WEB3EDU_WALLET_LINK",
    learnerId: "u1",
    wallet: "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2",
    nonce: "n1",
    issuedAt: 1,
    expiresAt: 2,
    chainId: 424242,
    origin: "https://web3edu.dimikog.org",
  },
};

function mockLinkApi({
  wallet,
  preview,
  confirm,
  status,
  challengeError,
} = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    calls.push({ url: u, method: init?.method || "GET", body: init?.body });
    assert.equal(u.includes("/social/identity/link-wallet"), false);
    assert.equal(u.includes("/import-progress"), false);

    if (u.endsWith("/web3edu/identity/link/challenge")) {
      if (challengeError) {
        return {
          ok: false,
          status: 400,
          json: async () => ({
            ok: false,
            reasonCode: challengeError,
            error: challengeError,
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          ok: true,
          reasonCode: "CHALLENGE_ISSUED",
          challengeId: "c1",
          nonce: "n1",
          walletAddress: wallet.toLowerCase(),
          typedData: SAMPLE_TYPED,
        }),
      };
    }
    if (u.endsWith("/web3edu/identity/link/preview")) {
      if (typeof preview === "function") return preview();
      return {
        ok: true,
        json: async () => ({
          ok: true,
          reasonCode: preview?.reasonCode || "CASE_A_SAFE",
          preview: preview || { allowed: true, case: "A", reasonCode: "CASE_A_SAFE" },
        }),
      };
    }
    if (u.endsWith("/web3edu/identity/link/confirm")) {
      if (typeof confirm === "function") return confirm();
      return {
        ok: true,
        json: async () =>
          confirm || {
            ok: true,
            reasonCode: "BINDING_CREATED",
            walletAddress: wallet.toLowerCase(),
          },
      };
    }
    if (u.endsWith("/web3edu/identity/link/status")) {
      return {
        ok: true,
        json: async () =>
          status || {
            ok: true,
            progressSource: "web3edu_account",
          },
      };
    }
    throw new Error(`unexpected fetch ${u}`);
  };
  return calls;
}

test("mapIdentityLinkError covers Case B / Case C codes", () => {
  assert.match(mapIdentityLinkError("CASE_B_NOT_ALLOWLISTED"), /not enabled/i);
  assert.match(mapIdentityLinkError("BOTH_HAVE_PROGRESS"), /already contain progress/i);
  assert.match(mapIdentityLinkError("WALLET_ALREADY_BOUND"), /different/i);
  assert.match(mapIdentityLinkError("RELINK_REQUIRED"), /Relinking/i);
  assert.match(mapIdentityLinkError("INVALID_SIGNATURE"), /signature/i);
  assert.match(mapIdentityLinkError("CASE_B_NOT_ALLOWLISTED", { isGR: true }), /ενεργή/);
});

test("retryable challenge errors", () => {
  assert.equal(isIdentityLinkRetryable("CHALLENGE_EXPIRED"), true);
  assert.equal(isIdentityLinkRetryable("CHALLENGE_CONSUMED"), true);
  assert.equal(isIdentityLinkRetryable("BOTH_HAVE_PROGRESS"), false);
});

test("typedDataToWagmiArgs strips EIP712Domain", () => {
  const args = typedDataToWagmiArgs(SAMPLE_TYPED);
  assert.equal(args.primaryType, "WalletBinding");
  assert.equal(args.domain.chainId, 424242);
  assert.equal("EIP712Domain" in args.types, false);
  assert.ok(args.types.WalletBinding);
});

test("runEip712WalletLinkFlow Case B path does not call legacy link-wallet or import-progress", async () => {
  const wallet = "0xDF0D2c02E18209C3D717488E0157fb40A33BB6D2";
  const calls = mockLinkApi({
    wallet,
    preview: {
      allowed: true,
      case: "B",
      action: "link_without_progress_move",
      reasonCode: "CASE_B_SAFE",
      walletHasProgress: true,
      socialHasProgress: false,
    },
    confirm: {
      ok: true,
      reasonCode: "CASE_B_BINDING_CREATED",
      progressOrigin: "linked_wallet",
      progressAddress: wallet.toLowerCase(),
      credentialHolderAddress: "0x390af8c46ef984a1a0625d5d92a9fe3ec32bb2a2",
      bindingId: "b1",
      walletAddress: wallet.toLowerCase(),
    },
    status: {
      ok: true,
      progressSource: "linked_wallet",
      progressAddress: wallet.toLowerCase(),
      credentialHolderAddress: "0x390af8c46ef984a1a0625d5d92a9fe3ec32bb2a2",
    },
  });

  let signedTyped = null;
  const result = await runEip712WalletLinkFlow({
    idToken: "tok",
    walletAddress: wallet,
    getConnectedWallet: () => wallet,
    signTypedDataAsync: async (args) => {
      signedTyped = args;
      return "0xsig";
    },
  });

  assert.equal(result.caseLabel, "B");
  assert.equal(result.progressSource, "linked_wallet");
  assert.ok(signedTyped);
  assert.equal(signedTyped.primaryType, "WalletBinding");
  assert.equal("EIP712Domain" in signedTyped.types, false);
  assert.deepEqual(
    calls.map((c) => c.method + " " + c.url.replace(/^.*\/web3edu/, "/web3edu")),
    [
      "POST /web3edu/identity/link/challenge",
      "POST /web3edu/identity/link/preview",
      "POST /web3edu/identity/link/confirm",
      "GET /web3edu/identity/link/status",
    ]
  );
  const challengeBody = JSON.parse(calls[0].body);
  assert.equal(challengeBody.walletAddress.toLowerCase(), wallet.toLowerCase());
  const previewBody = JSON.parse(calls[1].body);
  assert.equal(previewBody.nonce, "n1");
  assert.equal(previewBody.signature, "0xsig");
  assert.equal(previewBody.challengeId, "c1");
});

test("Case A confirm keeps web3edu_account progress source", async () => {
  const wallet = "0x1111111111111111111111111111111111111111";
  mockLinkApi({
    wallet,
    preview: { allowed: true, case: "A", reasonCode: "CASE_A_SAFE" },
    status: {
      ok: true,
      progressSource: "web3edu_account",
      progressAddress: "0x390af8c46ef984a1a0625d5d92a9fe3ec32bb2a2",
    },
  });
  const result = await runEip712WalletLinkFlow({
    idToken: "tok",
    walletAddress: wallet,
    signTypedDataAsync: async () => "0xsig",
  });
  assert.equal(result.caseLabel, "A");
  assert.equal(result.progressSource, "web3edu_account");
});

test("Case C does not confirm", async () => {
  const wallet = "0x2222222222222222222222222222222222222222";
  let confirmCalled = false;
  mockLinkApi({
    wallet,
    preview: {
      allowed: false,
      case: "C",
      reasonCode: "BOTH_HAVE_PROGRESS",
    },
    confirm: async () => {
      confirmCalled = true;
      throw new Error("should not confirm");
    },
  });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => err.reasonCode === "BOTH_HAVE_PROGRESS"
  );
  assert.equal(confirmCalled, false);
});

test("CASE_B_NOT_ALLOWLISTED surfaces from preview", async () => {
  const wallet = "0x5555555555555555555555555555555555555555";
  mockLinkApi({
    wallet,
    preview: {
      allowed: false,
      case: "B",
      reasonCode: "CASE_B_NOT_ALLOWLISTED",
    },
  });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => err.reasonCode === "CASE_B_NOT_ALLOWLISTED"
  );
});

test("WALLET_ALREADY_BOUND surfaces from preview", async () => {
  const wallet = "0x6666666666666666666666666666666666666666";
  mockLinkApi({
    wallet,
    preview: {
      allowed: false,
      reasonCode: "WALLET_ALREADY_BOUND",
    },
  });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => err.reasonCode === "WALLET_ALREADY_BOUND"
  );
});

test("RELINK_REQUIRED surfaces from preview", async () => {
  const wallet = "0x7777777777777777777777777777777777777777";
  mockLinkApi({
    wallet,
    preview: {
      allowed: false,
      reasonCode: "RELINK_REQUIRED",
    },
  });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => err.reasonCode === "RELINK_REQUIRED"
  );
});

test("challenge expiry is retryable reason", async () => {
  const wallet = "0x8888888888888888888888888888888888888888";
  mockLinkApi({ wallet, challengeError: "CHALLENGE_EXPIRED" });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => {
      assert.equal(err.reasonCode, "CHALLENGE_EXPIRED");
      assert.equal(isIdentityLinkRetryable(err.reasonCode), true);
      return true;
    }
  );
});

test("invalid signature from signer is tagged", async () => {
  const wallet = "0x9999999999999999999999999999999999999999";
  mockLinkApi({ wallet });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        signTypedDataAsync: async () => {
          throw new Error("user rejected");
        },
      }),
    (err) => err.reasonCode === "INVALID_SIGNATURE"
  );
});

test("wallet switch between challenge and sign aborts", async () => {
  const wallet = "0x3333333333333333333333333333333333333333";
  mockLinkApi({ wallet });
  await assert.rejects(
    () =>
      runEip712WalletLinkFlow({
        idToken: "tok",
        walletAddress: wallet,
        getConnectedWallet: () => "0x4444444444444444444444444444444444444444",
        signTypedDataAsync: async () => "0xsig",
      }),
    (err) => err.reasonCode === "WALLET_SWITCH"
  );
});

test("Dashboard pages use H3C path and not legacy link-wallet from handleLinkWallet", () => {
  const root = join(__dirname, "..");
  for (const file of ["pages/Dashboard.jsx", "pages/DashboardGR.jsx"]) {
    const src = readFileSync(join(root, file), "utf8");
    assert.match(src, /runEip712WalletLinkFlow/);
    assert.match(src, /useSignTypedData/);
    assert.match(src, /getIdentityLinkStatus/);
    assert.doesNotMatch(src, /createLinkWalletChallenge/);
    assert.doesNotMatch(src, /confirmLinkWallet/);
    assert.doesNotMatch(src, /useSignMessage/);
    assert.match(src, /shouldOfferSocialProgressImport/);
  }
});

test("no token/nonce/signature localStorage persistence in identity link modules", () => {
  for (const rel of [
    "api/identityLink.js",
    "utils/identityLinkFlow.js",
    "utils/signEip712TypedData.js",
  ]) {
    const src = readFileSync(join(__dirname, "..", rel), "utf8");
    assert.doesNotMatch(src, /localStorage/);
    assert.doesNotMatch(src, /sessionStorage/);
    assert.doesNotMatch(src, /console\.(log|debug|info).*signature/i);
    assert.doesNotMatch(src, /console\.(log|debug|info).*nonce/i);
    assert.doesNotMatch(src, /console\.(log|debug|info).*token/i);
  }
});

test("BesuWallet-compatible signer uses eth_signTypedData_v4 fallback", () => {
  const src = readFileSync(join(__dirname, "signEip712TypedData.js"), "utf8");
  assert.match(src, /eth_signTypedData_v4/);
  assert.match(src, /signTypedDataAsync/);
  assert.doesNotMatch(src, /METAMASK/);
  assert.doesNotMatch(src, /binding_type/);
});
