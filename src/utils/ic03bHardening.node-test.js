/**
 * IC-03B targeted hardening regressions.
 * Run: node --test src/utils/ic03bHardening.node-test.js
 */

import assert from "node:assert/strict";
import test from "node:test";

import { normalizeEvmAddress } from "./evmAddress.js";
import {
  VIEWER_SOURCE_CONNECTED_EOA,
  VIEWER_SOURCE_DEVICE_AA,
  VIEWER_SOURCE_UNRESOLVED,
  WALLET_ENTRY_UNRESOLVED,
  WALLET_ENTRY_WALLET_ONLY,
  interpretWalletEntryCanonicalResult,
  selectCanonicalViewerIdentity,
} from "./walletEntryCanonicalResolve.js";
import {
  CREDENTIAL_ASSOCIATION_CHAIN_ID,
  CREDENTIAL_ASSOCIATION_PRIMARY_TYPE,
  CREDENTIAL_ASSOCIATION_PURPOSE,
  CREDENTIAL_ASSOCIATION_REASON,
  getCredentialAssociationEligibility,
  runCredentialAssociationFlow,
  shouldApplyCredentialAssociationDiscovery,
} from "./credentialAssociationFlow.js";

const EOA = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const OTHER = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const DEVICE_AA = "0x1111111111111111111111111111111111111111";
const AA = "0x2222222222222222222222222222222222222222";
const SBT = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
const ORIGIN = "https://web3edu.dimikog.org";
const TOKEN_ID = 7;

function walletOnlyPayload({ progressAddress = EOA } = {}) {
  return {
    identity: {
      status: "resolved_legacy",
      mode: "wallet_only",
      matchedBy: "wallet_only_address",
      progressAddress,
      socialIdentityPresent: false,
    },
    credential: { status: "NOT_ISSUED" },
  };
}

function sampleChallenge() {
  const typedData = {
    types: {
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
    },
    primaryType: CREDENTIAL_ASSOCIATION_PRIMARY_TYPE,
    domain: { name: "Web3Edu", version: "1", chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID },
    message: {
      purpose: CREDENTIAL_ASSOCIATION_PURPOSE,
      eoa: EOA,
      aa: AA,
      sbtContract: SBT,
      tokenId: TOKEN_ID,
      action: "ASSOCIATE",
      associationId: "",
      nonce: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      issuedAt: 1_700_000_000,
      expiresAt: 1_700_000_300,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      origin: ORIGIN,
    },
  };
  return {
    ok: true,
    challengeId: "cac-h1",
    eoaAddress: EOA,
    aaAddress: AA,
    sbtContract: SBT,
    tokenId: TOKEN_ID,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    origin: ORIGIN,
    purpose: CREDENTIAL_ASSOCIATION_PURPOSE,
    typedData,
    nonce: typedData.message.nonce,
  };
}

test("missing progressAddress → interpret unresolved; viewer fail-closed", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    walletOnlyPayload({ progressAddress: null }),
    { connectedEoa: EOA }
  );
  assert.equal(interpreted.status, WALLET_ENTRY_UNRESOLVED);
  assert.equal(interpreted.canonicalProgressAddress, null);

  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: null,
    walletEntryMode: "wallet_only",
  });
  assert.equal(viewer.source, VIEWER_SOURCE_UNRESOLVED);
  assert.equal(viewer.identityAddress, null);
  assert.notEqual(viewer.identityAddress, normalizeEvmAddress(DEVICE_AA));
  assert.notEqual(viewer.identityAddress, normalizeEvmAddress(EOA));
});

test("inconsistent wallet-only progressAddress → fail closed", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    walletOnlyPayload({ progressAddress: OTHER }),
    { connectedEoa: EOA }
  );
  assert.equal(interpreted.status, WALLET_ENTRY_UNRESOLVED);
  assert.equal(interpreted.canonicalProgressAddress, null);

  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: OTHER,
    walletEntryMode: "wallet_only",
  });
  assert.equal(viewer.source, VIEWER_SOURCE_UNRESOLVED);
  assert.equal(viewer.identityAddress, null);
});

test("viewerSource alone without authoritative wallet-only → not eligible", () => {
  const e = getCredentialAssociationEligibility({
    isOidcAuthenticated: false,
    isConnected: true,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: null,
    walletEntryMode: null,
    walletOnlyModeEstablished: false,
  });
  assert.equal(e.eligible, false);
  assert.equal(e.reasonCode, CREDENTIAL_ASSOCIATION_REASON.NOT_WALLET_ONLY);
});

test("valid wallet-only EOA with restored device AA → canonical EOA + CTA eligible", () => {
  const interpreted = interpretWalletEntryCanonicalResult(
    walletOnlyPayload({ progressAddress: EOA }),
    { connectedEoa: EOA }
  );
  assert.equal(interpreted.status, WALLET_ENTRY_WALLET_ONLY);

  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: EOA,
    walletEntryMode: "wallet_only",
  });
  assert.equal(viewer.source, VIEWER_SOURCE_CONNECTED_EOA);
  assert.equal(viewer.identityAddress, normalizeEvmAddress(EOA));

  // Device-AA viewer context still eligible when backend wallet_only established.
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_DEVICE_AA,
      walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
      walletEntryMode: "wallet_only",
      walletOnlyModeEstablished: true,
    }).eligible,
    true
  );
});

test("stale discovery after disconnect is not applied", () => {
  assert.equal(
    shouldApplyCredentialAssociationDiscovery({
      generation: 1,
      currentGeneration: 1,
      requestWallet: EOA,
      liveWallet: null,
      requestChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      liveChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      eligible: true,
    }),
    false
  );
});

test("stale discovery after chain switch is not applied", () => {
  assert.equal(
    shouldApplyCredentialAssociationDiscovery({
      generation: 2,
      currentGeneration: 2,
      requestWallet: EOA,
      liveWallet: EOA,
      requestChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      liveChainId: 1,
      eligible: true,
    }),
    false
  );
  // Generation bump (cleanup / eligibility false) also blocks.
  assert.equal(
    shouldApplyCredentialAssociationDiscovery({
      generation: 3,
      currentGeneration: 4,
      requestWallet: EOA,
      liveWallet: EOA,
      requestChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      liveChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      eligible: true,
    }),
    false
  );
  assert.equal(
    shouldApplyCredentialAssociationDiscovery({
      generation: 5,
      currentGeneration: 5,
      requestWallet: EOA,
      liveWallet: EOA,
      requestChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      liveChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      eligible: false,
    }),
    false
  );
  // Happy path still applies.
  assert.equal(
    shouldApplyCredentialAssociationDiscovery({
      generation: 6,
      currentGeneration: 6,
      requestWallet: EOA,
      liveWallet: EOA,
      requestChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      liveChainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      eligible: true,
    }),
    true
  );
});

test("wallet disconnect during signing is rejected", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => null,
        getConnectedChainId: () => CREDENTIAL_ASSOCIATION_CHAIN_ID,
        signTypedDataAsync: async () => "0xsig",
        api: {
          createChallenge: async () => sampleChallenge(),
          confirm: async () => {
            throw new Error("should not confirm");
          },
        },
      }),
    (err) => err.reasonCode === CREDENTIAL_ASSOCIATION_REASON.WALLET_DISCONNECTED
  );
});

test("wallet switch during signing still rejected", async () => {
  await assert.rejects(
    () =>
      runCredentialAssociationFlow({
        eoaAddress: EOA,
        aaAddress: AA,
        tokenId: TOKEN_ID,
        sbtContract: SBT,
        expectedOrigin: ORIGIN,
        chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
        getConnectedWallet: () => OTHER,
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
