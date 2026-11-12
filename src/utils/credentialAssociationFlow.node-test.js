/**
 * IC-03A credential-association onboarding tests (Node built-in test runner).
 * Run: node --test src/utils/credentialAssociationFlow.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  CREDENTIAL_ASSOCIATION_CHAIN_ID,
  CREDENTIAL_ASSOCIATION_DOMAIN_NAME,
  CREDENTIAL_ASSOCIATION_PRIMARY_TYPE,
  CREDENTIAL_ASSOCIATION_PURPOSE,
  CREDENTIAL_ASSOCIATION_REASON,
  CREDENTIAL_ASSOCIATION_UI,
  assessCredentialAssociationUiState,
  discoverCredentialAssociationContext,
  extractAaHeldCredential,
  getCredentialAssociationEligibility,
  isCredentialAssociationFrontendEnabled,
  isGenericAssociationServerFailure,
  readCanonicalCredentialBlocks,
  refreshAndConfirmIssued,
  runCredentialAssociationFlow,
  validateCredentialAssociationChallenge,
} from "./credentialAssociationFlow.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_LINKED_WALLET_ALIAS,
  VIEWER_SOURCE_OIDC_SOCIAL,
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_WALLET_ONLY,
} from "./walletEntryCanonicalResolve.js";
import {
  WALLET_AUTH_PURPOSE,
  WALLET_LINK_PURPOSE,
} from "./walletAuthFlow.js";
import { getCredentialAssociationCopy } from "../content/credentialAssociationCopy.js";
import { normalizeEvmAddress } from "./evmAddress.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const EOA = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const AA = "0x1111111111111111111111111111111111111111";
const SBT = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
const ORIGIN = "https://web3edu.dimikog.org";
const TOKEN_ID = 42;

function sampleTypedData(overrides = {}) {
  const chainId = overrides.chainId ?? CREDENTIAL_ASSOCIATION_CHAIN_ID;
  const eoa = overrides.eoa ?? EOA;
  const aa = overrides.aa ?? AA;
  const sbt = overrides.sbtContract ?? SBT;
  const origin = overrides.origin ?? ORIGIN;
  const purpose = overrides.purpose ?? CREDENTIAL_ASSOCIATION_PURPOSE;
  const primaryType = overrides.primaryType ?? CREDENTIAL_ASSOCIATION_PRIMARY_TYPE;
  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    CredentialAssociation: [
      { name: "purpose", type: "string" },
      { name: "eoa", type: "address" },
      { name: "aa", type: "address" },
      { name: "sbtContract", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "action", type: "string" },
      { name: "associationId", type: "string" },
      { name: "nonce", type: "string" },
      { name: "issuedAt", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "chainId", type: "uint256" },
      { name: "origin", type: "string" },
    ],
  };
  if (overrides.includeWalletAuth) {
    types.WalletAuth = [{ name: "purpose", type: "string" }];
  }
  return {
    types,
    primaryType,
    domain: {
      name: overrides.domainName ?? CREDENTIAL_ASSOCIATION_DOMAIN_NAME,
      version: "1",
      chainId,
    },
    message: {
      purpose,
      eoa,
      aa,
      sbtContract: sbt,
      tokenId: TOKEN_ID,
      action: "ASSOCIATE",
      associationId: "",
      nonce: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      issuedAt: 1_700_000_000,
      expiresAt: 1_700_000_300,
      chainId,
      origin,
    },
  };
}

function sampleChallenge(overrides = {}) {
  const { typedData: typedOverride, ...rest } = overrides;
  const typedData = typedOverride || sampleTypedData();
  return {
    ok: true,
    reasonCode: "CHALLENGE_ISSUED",
    challengeId: "cac-1",
    eoaAddress: EOA,
    aaAddress: AA,
    sbtContract: SBT,
    tokenId: TOKEN_ID,
    action: "ASSOCIATE",
    associationId: "",
    expiresAt: "2026-01-01T00:05:00.000Z",
    issuedAt: "2026-01-01T00:00:00.000Z",
    protocolVersion: 1,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    origin: ORIGIN,
    purpose: CREDENTIAL_ASSOCIATION_PURPOSE,
    typedData,
    nonce: typedData.message.nonce,
    ...rest,
    typedData,
  };
}

function walletOnlyCanonical({
  credentialStatus = "MISMATCH",
  holderAddress = null,
  sbtContract = null,
  tokenId = null,
  // legacy alias used by older fixtures — maps to AA-held ISSUED credential fields
  currentlyVerified = false,
} = {}) {
  const issuedViaAssoc =
    currentlyVerified === true ||
    (credentialStatus === "ISSUED" && holderAddress);
  return {
    identity: {
      status: "resolved_legacy",
      mode: "wallet_only",
      matchedBy: "wallet_only_address",
      progressAddress: EOA,
      socialIdentityPresent: false,
    },
    credential: {
      status: credentialStatus,
      holderAddress: holderAddress ?? (issuedViaAssoc ? AA : null),
      sbtContract: sbtContract ?? (issuedViaAssoc ? SBT : null),
      tokenId: tokenId ?? (issuedViaAssoc ? TOKEN_ID : null),
      credentialType: issuedViaAssoc ? "aa" : null,
    },
    // IC-PR-05: public resolve no longer emits credentialAssociation.
  };
}

test("feature flag defaults OFF; exact 1/true enables", () => {
  assert.equal(isCredentialAssociationFrontendEnabled({}), false);
  assert.equal(
    isCredentialAssociationFrontendEnabled({
      VITE_CREDENTIAL_ASSOCIATION_ENABLED: "",
    }),
    false
  );
  assert.equal(
    isCredentialAssociationFrontendEnabled({
      VITE_CREDENTIAL_ASSOCIATION_ENABLED: "0",
    }),
    false
  );
  assert.equal(
    isCredentialAssociationFrontendEnabled({
      VITE_CREDENTIAL_ASSOCIATION_ENABLED: "yes",
    }),
    false
  );
  assert.equal(
    isCredentialAssociationFrontendEnabled({
      VITE_CREDENTIAL_ASSOCIATION_ENABLED: "1",
    }),
    true
  );
  assert.equal(
    isCredentialAssociationFrontendEnabled({
      VITE_CREDENTIAL_ASSOCIATION_ENABLED: "true",
    }),
    true
  );
});

test("eligible wallet-first learner: connected EOA + wallet_only + Edu-Net", () => {
  const e = getCredentialAssociationEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    walletOnlyModeEstablished: true,
  });
  assert.equal(e.eligible, true);
  assert.equal(e.reasonCode, null);
});

test("social-linked learner exclusion (OIDC / linked alias)", () => {
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: true,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_OIDC_SOCIAL,
      walletOnlyModeEstablished: false,
    }).eligible,
    false
  );
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
      walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    }).reasonCode,
    CREDENTIAL_ASSOCIATION_REASON.LINKED_ALIAS
  );
  // Device AA alone (no wallet_only) remains excluded.
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_DEVICE_AA,
    }).eligible,
    false
  );
});

test("IC-03B: CTA eligible for wallet-first EOA despite device-AA viewer context", () => {
  const e = getCredentialAssociationEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    viewerSource: VIEWER_SOURCE_DEVICE_AA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    walletOnlyModeEstablished: true,
  });
  assert.equal(e.eligible, true);
  assert.equal(e.reasonCode, null);
});

test("UI: eligible learner without association → prompt", () => {
  const canonical = readCanonicalCredentialBlocks(walletOnlyCanonical());
  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical,
    aaCredential: { aaAddress: AA, tokenId: TOKEN_ID },
    associationLookup: {
      ok: false,
      currentlyVerified: false,
      reasonCode: "ASSOCIATION_NOT_FOUND",
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.PROMPT);
});

test("UI: already verified association → verified (no signature required)", () => {
  const canonical = readCanonicalCredentialBlocks(
    walletOnlyCanonical({ credentialStatus: "ISSUED", currentlyVerified: true })
  );
  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical,
    aaCredential: { aaAddress: AA, tokenId: TOKEN_ID },
    associationLookup: {
      ok: true,
      currentlyVerified: true,
      reasonCode: "ASSOCIATION_ACTIVE_VERIFIED",
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.VERIFIED);
});

test("UI: missing AA/SBT → missing_credential", () => {
  const canonical = readCanonicalCredentialBlocks(walletOnlyCanonical());
  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical,
    aaCredential: null,
    associationLookup: { currentlyVerified: false },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.MISSING_CREDENTIAL);
});

test("UI: rejected signature / expired / wrong wallet / wrong network / RPC", () => {
  const base = {
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical: readCanonicalCredentialBlocks(walletOnlyCanonical()),
    aaCredential: { aaAddress: AA, tokenId: TOKEN_ID },
  };
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.USER_REJECTED,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.REJECTED
  );
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.CHALLENGE_EXPIRED,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.EXPIRED
  );
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.WALLET_SWITCH,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.WRONG_WALLET
  );
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.WRONG_NETWORK
  );
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.RPC_UNAVAILABLE
  );
});

test("UI: generic HTTP 5xx → failed (not rpc_unavailable)", () => {
  const base = {
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical: readCanonicalCredentialBlocks(walletOnlyCanonical()),
    aaCredential: { aaAddress: AA, tokenId: TOKEN_ID },
  };
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: CREDENTIAL_ASSOCIATION_REASON.ASSOCIATION_FAILED,
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.FAILED
  );
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: "Request failed (HTTP 500)",
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.FAILED
  );
  // Typed RPC codes must stay on RPC_UNAVAILABLE, not FAILED.
  assert.equal(
    assessCredentialAssociationUiState({
      ...base,
      flowReasonCode: "AA_OWNERSHIP_LOOKUP_FAILED",
    }).uiState,
    CREDENTIAL_ASSOCIATION_UI.RPC_UNAVAILABLE
  );
  assert.equal(isGenericAssociationServerFailure("AA_OWNERSHIP_LOOKUP_FAILED"), false);
  assert.equal(isGenericAssociationServerFailure("Request failed (HTTP 500)"), true);
});

test("UI: social exclusion stays hidden", () => {
  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: {
      eligible: false,
      reasonCode: CREDENTIAL_ASSOCIATION_REASON.SOCIAL_EXCLUDED,
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.HIDDEN);
});

test("extractAaHeldCredential requires minted AA + tokenId (no factory invent)", () => {
  assert.equal(extractAaHeldCredential(null), null);
  assert.equal(
    extractAaHeldCredential({ smartAccount: AA, alreadyMinted: false }),
    null
  );
  assert.equal(
    extractAaHeldCredential({
      smartAccount: AA,
      alreadyMinted: true,
      tokenId: TOKEN_ID,
    })?.tokenId,
    TOKEN_ID
  );
  assert.equal(
    extractAaHeldCredential({
      identityAddress: AA,
      alreadyMinted: true,
      token_id: "7",
    })?.tokenId,
    7
  );
});

test("validate challenge accepts CredentialAssociation EIP-712; rejects WA/H3C", () => {
  const ok = validateCredentialAssociationChallenge(sampleChallenge(), {
    eoaAddress: EOA,
    aaAddress: AA,
    tokenId: TOKEN_ID,
    sbtContract: SBT,
    expectedOrigin: ORIGIN,
  });
  assert.equal(ok.challengeId, "cac-1");
  assert.equal(ok.typedData.primaryType, CREDENTIAL_ASSOCIATION_PRIMARY_TYPE);

  assert.throws(
    () =>
      validateCredentialAssociationChallenge(
        sampleChallenge({
          purpose: WALLET_AUTH_PURPOSE,
          typedData: sampleTypedData({ purpose: WALLET_AUTH_PURPOSE }),
        }),
        {
          eoaAddress: EOA,
          aaAddress: AA,
          tokenId: TOKEN_ID,
          expectedOrigin: ORIGIN,
        }
      ),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH
  );

  assert.throws(
    () =>
      validateCredentialAssociationChallenge(
        sampleChallenge({
          purpose: WALLET_LINK_PURPOSE,
          typedData: sampleTypedData({ purpose: WALLET_LINK_PURPOSE }),
        }),
        {
          eoaAddress: EOA,
          aaAddress: AA,
          tokenId: TOKEN_ID,
          expectedOrigin: ORIGIN,
        }
      ),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.PURPOSE_MISMATCH
  );
});

test("flow: happy path signs exact typed data and confirms (no mint)", async () => {
  const typedData = sampleTypedData();
  let signedPayload = null;
  const api = {
    createChallenge: async () => sampleChallenge({ typedData }),
    confirm: async (body) => {
      assert.equal(body.eoaAddress.toLowerCase(), EOA);
      assert.equal(body.aaAddress.toLowerCase(), AA);
      assert.equal(body.tokenId, TOKEN_ID);
      assert.equal(body.challengeId, "cac-1");
      assert.ok(body.signature);
      assert.ok(body.nonce);
      return {
        ok: true,
        reasonCode: "ASSOCIATION_CREATED",
        association: { associationId: "a1", status: "ACTIVE" },
      };
    },
  };

  const result = await runCredentialAssociationFlow({
    eoaAddress: EOA,
    aaAddress: AA,
    tokenId: TOKEN_ID,
    sbtContract: SBT,
    expectedOrigin: ORIGIN,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    getConnectedWallet: () => EOA,
    getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
    signTypedDataAsync: async (args) => {
      signedPayload = args;
      return "0xsignature";
    },
    api,
  });

  assert.equal(result.ok, true);
  assert.equal(result.minted, false);
  assert.equal(result.createdAa, false);
  assert.equal(signedPayload.primaryType, CREDENTIAL_ASSOCIATION_PRIMARY_TYPE);
  assert.equal(signedPayload.message.purpose, CREDENTIAL_ASSOCIATION_PURPOSE);
  assert.equal(String(signedPayload.message.eoa).toLowerCase(), EOA);
});

test("flow: rejected signature", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => {
          const err = new Error("User rejected the request");
          err.code = 4001;
          throw err;
        },
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            throw new Error("should not confirm");
          },
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.USER_REJECTED
  );
});

test("flow: expired challenge on confirm", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            const err = new Error("CHALLENGE_EXPIRED");
            err.reasonCode = "CHALLENGE_EXPIRED";
            err.payload = { error: "CHALLENGE_EXPIRED", reasonCode: "CHALLENGE_EXPIRED" };
            throw err;
          },
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.CHALLENGE_EXPIRED
  );
});

test("flow: generic HTTP 500 on challenge → ASSOCIATION_FAILED (not RPC)", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => {
            const err = new Error("Request failed (HTTP 500)");
            err.status = 500;
            err.payload = {};
            err.reasonCode = null;
            throw err;
          },
          confirm: async () => {
            throw new Error("should not confirm");
          },
        },
      }),
    (err) =>
      err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.ASSOCIATION_FAILED &&
      err.reasonCode !== CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE
  );
});

test("flow: typed AA_OWNERSHIP_LOOKUP_FAILED still maps to RPC_UNAVAILABLE", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            const err = new Error("AA_OWNERSHIP_LOOKUP_FAILED");
            err.status = 503;
            err.reasonCode = "AA_OWNERSHIP_LOOKUP_FAILED";
            err.payload = {
              error: "AA_OWNERSHIP_LOOKUP_FAILED",
              reasonCode: "AA_OWNERSHIP_LOOKUP_FAILED",
            };
            throw err;
          },
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE
  );
});

test("flow: wrong wallet during signing", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => "0x2222222222222222222222222222222222222222",
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => ({ ok: true }),
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.WALLET_SWITCH
  );
});

test("flow: wrong network during signing", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => 1,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => ({ ok: true }),
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN
  );
});

test("flow: RPC unavailable on confirm", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => EOA,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            const err = new Error("SBT_OWNERSHIP_LOOKUP_FAILED");
            err.reasonCode = "SBT_OWNERSHIP_LOOKUP_FAILED";
            err.status = 503;
            err.payload = {
              error: "SBT_OWNERSHIP_LOOKUP_FAILED",
              reasonCode: "SBT_OWNERSHIP_LOOKUP_FAILED",
            };
            throw err;
          },
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE
  );
});

test("discovery: no implicit association; missing AA stays unassociated", async () => {
  const ctx = await discoverCredentialAssociationContext({
    eoaAddress: EOA,
    api: {
      fetchCanonicalResolve: async () => walletOnlyCanonical(),
      resolveIdentity: async () => ({
        smartAccount: null,
        alreadyMinted: false,
      }),
      lookup: async () => ({
        ok: false,
        currentlyVerified: false,
        reasonCode: "ASSOCIATION_NOT_FOUND",
      }),
    },
  });
  assert.equal(ctx.associated, false);
  assert.equal(ctx.minted, false);
  assert.equal(ctx.aaCredential, null);
});

test("discovery: eligible learner finds AA credential without associating", async () => {
  const ctx = await discoverCredentialAssociationContext({
    eoaAddress: EOA,
    api: {
      fetchCanonicalResolve: async () => walletOnlyCanonical(),
      resolveIdentity: async ({ owner }) => {
        assert.equal(owner.toLowerCase(), EOA);
        return {
          smartAccount: AA,
          alreadyMinted: true,
          tokenId: TOKEN_ID,
        };
      },
      lookup: async () => ({
        ok: false,
        currentlyVerified: false,
        reasonCode: "ASSOCIATION_NOT_FOUND",
      }),
    },
  });
  assert.equal(ctx.aaCredential.aaAddress.toLowerCase(), AA);
  assert.equal(ctx.aaCredential.tokenId, TOKEN_ID);
  assert.equal(ctx.associated, false);
  assert.equal(ctx.minted, false);
});

test("refresh confirms ISSUED + expected credential + verified minimal lookup", async () => {
  const issued = await refreshAndConfirmIssued({
    eoaAddress: EOA,
    expectedAaAddress: AA,
    expectedTokenId: TOKEN_ID,
    expectedSbtContract: SBT,
    api: {
      fetchCanonicalResolve: async () =>
        walletOnlyCanonical({
          credentialStatus: "ISSUED",
          holderAddress: AA,
          sbtContract: SBT,
          tokenId: TOKEN_ID,
        }),
      lookup: async () => ({
        ok: true,
        currentlyVerified: true,
        verificationStatus: "VERIFIED",
        reasonCode: "ASSOCIATION_ACTIVE_VERIFIED",
        grantsPrivateProgressionAccess: false,
      }),
    },
  });
  assert.equal(issued.issued, true);
  assert.equal(issued.lookup.currentlyVerified, true);
});

test("refresh: ISSUED alone is insufficient without verified lookup", async () => {
  await assert.rejects(
    () =>
      refreshAndConfirmIssued({
        eoaAddress: EOA,
        expectedAaAddress: AA,
        expectedTokenId: TOKEN_ID,
        expectedSbtContract: SBT,
        api: {
          fetchCanonicalResolve: async () =>
            walletOnlyCanonical({
              credentialStatus: "ISSUED",
              holderAddress: AA,
              sbtContract: SBT,
              tokenId: TOKEN_ID,
            }),
          lookup: async () => ({
            ok: false,
            currentlyVerified: false,
            verificationStatus: "NOT_FOUND",
            reasonCode: "ASSOCIATION_NOT_FOUND",
          }),
        },
      }),
    (err) =>
      err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.NOT_ISSUED_AFTER_CONFIRM
  );
});

test("refresh: credential mismatch fails even when lookup verified", async () => {
  const OTHER_AA = "0x2222222222222222222222222222222222222222";
  await assert.rejects(
    () =>
      refreshAndConfirmIssued({
        eoaAddress: EOA,
        expectedAaAddress: AA,
        expectedTokenId: TOKEN_ID,
        expectedSbtContract: SBT,
        api: {
          fetchCanonicalResolve: async () =>
            walletOnlyCanonical({
              credentialStatus: "ISSUED",
              holderAddress: OTHER_AA,
              sbtContract: SBT,
              tokenId: TOKEN_ID,
            }),
          lookup: async () => ({
            ok: true,
            currentlyVerified: true,
            verificationStatus: "VERIFIED",
            reasonCode: "ASSOCIATION_ACTIVE_VERIFIED",
          }),
        },
      }),
    (err) =>
      err.reasonCode ===
      CREDENTIAL_ASSOCIATION_REASON.POST_CONFIRM_CREDENTIAL_MISMATCH
  );
});

test("refresh: lookup unavailable is retryable (no false success)", async () => {
  await assert.rejects(
    () =>
      refreshAndConfirmIssued({
        eoaAddress: EOA,
        expectedAaAddress: AA,
        expectedTokenId: TOKEN_ID,
        expectedSbtContract: SBT,
        api: {
          fetchCanonicalResolve: async () =>
            walletOnlyCanonical({
              credentialStatus: "ISSUED",
              holderAddress: AA,
              sbtContract: SBT,
              tokenId: TOKEN_ID,
            }),
          lookup: async () => {
            const err = new Error("ASSOCIATION_VERIFICATION_UNAVAILABLE");
            err.status = 503;
            err.reasonCode = "ASSOCIATION_VERIFICATION_UNAVAILABLE";
            throw err;
          },
        },
      }),
    (err) =>
      err.reasonCode ===
      CREDENTIAL_ASSOCIATION_REASON.POST_CONFIRM_LOOKUP_UNAVAILABLE
  );
});

test("refresh: MISMATCH after confirm fails", async () => {
  await assert.rejects(
    () =>
      refreshAndConfirmIssued({
        eoaAddress: EOA,
        expectedAaAddress: AA,
        expectedTokenId: TOKEN_ID,
        expectedSbtContract: SBT,
        api: {
          fetchCanonicalResolve: async () =>
            walletOnlyCanonical({ credentialStatus: "MISMATCH" }),
          lookup: async () => ({
            ok: true,
            currentlyVerified: true,
          }),
        },
      }),
    (err) =>
      err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.NOT_ISSUED_AFTER_CONFIRM
  );
});

test("UI: EOA-held ISSUED without verified lookup is not association VERIFIED", () => {
  const canonical = readCanonicalCredentialBlocks(
    walletOnlyCanonical({
      credentialStatus: "ISSUED",
      holderAddress: EOA,
      sbtContract: SBT,
      tokenId: TOKEN_ID,
    })
  );
  assert.equal(canonical.currentlyVerified, false);
  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical,
    aaCredential: { aaAddress: AA, tokenId: TOKEN_ID },
    associationLookup: {
      ok: false,
      currentlyVerified: false,
      reasonCode: "ASSOCIATION_NOT_FOUND",
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.PROMPT);
});

test("readCanonicalCredentialBlocks tolerates missing credentialAssociation", () => {
  const blocks = readCanonicalCredentialBlocks(
    walletOnlyCanonical({ credentialStatus: "ISSUED", currentlyVerified: true })
  );
  assert.equal(blocks.credentialStatus, "ISSUED");
  assert.equal(blocks.currentlyVerified, false);
  assert.equal(blocks.association, null);
  assert.equal(blocks.progressAddress, normalizeEvmAddress(EOA));
});

test("copy: CTA and no mint / no new identity wording", () => {
  const en = getCredentialAssociationCopy(false);
  assert.equal(en.verifyAction, "Verify and link your credential");
  assert.match(en.promptBody, /existing/i);
  assert.match(en.promptBody, /does not create a new identity/i);
  assert.match(en.promptBody, /mint/i);
  assert.ok(en.failedTitle);
  assert.ok(en.failedBody);
  const gr = getCredentialAssociationCopy(true);
  assert.ok(gr.verifyAction.length > 0);
  assert.ok(gr.failedTitle);
});

test("banner: failed UI shows retry CTA and busy guards duplicate submit", () => {
  const banner = readFileSync(
    join(root, "components/CredentialAssociationBanner.jsx"),
    "utf8"
  );
  assert.match(banner, /CREDENTIAL_ASSOCIATION_UI\.FAILED/);
  assert.match(banner, /failedTitle/);
  assert.match(banner, /if \(typeof onAssociate !== "function" \|\| busy\) return/);
  const hook = readFileSync(
    join(root, "hooks/useCredentialAssociationOnboarding.js"),
    "utf8"
  );
  assert.match(hook, /associatingRef/);
  assert.match(hook, /ASSOCIATION_IN_PROGRESS/);
});

test("no new mint / no implicit association in source modules", () => {
  const flow = readFileSync(
    join(root, "utils/credentialAssociationFlow.js"),
    "utf8"
  );
  const hook = readFileSync(
    join(root, "hooks/useCredentialAssociationOnboarding.js"),
    "utf8"
  );
  const api = readFileSync(join(root, "api/credentialAssociation.js"), "utf8");
  const banner = readFileSync(
    join(root, "components/CredentialAssociationBanner.jsx"),
    "utf8"
  );

  assert.doesNotMatch(flow, /\/aa\/userop\/build/);
  assert.doesNotMatch(flow, /mintIdentity|mintSbt|createSmartAccount/);
  assert.doesNotMatch(hook, /mintIdentity|mintSbt|createSmartAccount/);
  assert.doesNotMatch(api, /mintIdentity|mintSbt/);
  assert.match(flow, /signEip712TypedData/);
  assert.match(flow, /WEB3EDU_CREDENTIAL_ASSOCIATION/);
  assert.doesNotMatch(flow, /localStorage|sessionStorage/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage/);
  assert.doesNotMatch(api, /localStorage|sessionStorage/);
  // Banner requires explicit click — no auto associate on mount.
  assert.match(banner, /onAssociate/);
  assert.doesNotMatch(banner, /useEffect/);
  assert.match(hook, /autoAssociated: false/);
  assert.match(hook, /minted: false/);
});

test("API client paths match backend IC-01 routes", () => {
  const api = readFileSync(join(root, "api/credentialAssociation.js"), "utf8");
  assert.match(
    api,
    /\/web3edu\/identity\/credential-association\/challenge/
  );
  assert.match(api, /\/web3edu\/identity\/credential-association\/confirm/);
  assert.match(api, /\/web3edu\/identity\/credential-association\/lookup/);
});
