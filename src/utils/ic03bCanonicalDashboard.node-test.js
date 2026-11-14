/**
 * IC-03B — canonical Dashboard identity selection regression tests.
 * Run: node --test src/utils/ic03bCanonicalDashboard.node-test.js
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
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_UNAVAILABLE,
  WALLET_ENTRY_UNRESOLVED,
  WALLET_ENTRY_WALLET_ONLY,
  interpretWalletEntryCanonicalResult,
  selectCanonicalViewerIdentity,
} from "./walletEntryCanonicalResolve.js";
import {
  CREDENTIAL_ASSOCIATION_CHAIN_ID,
  CREDENTIAL_ASSOCIATION_REASON,
  CREDENTIAL_ASSOCIATION_UI,
  assessCredentialAssociationUiState,
  getCredentialAssociationEligibility,
  readCanonicalCredentialBlocks,
} from "./credentialAssociationFlow.js";
import {
  getEducationalIdentityInput,
  IDENTITY_INPUT_CONNECTED_EOA,
  IDENTITY_INPUT_SOCIAL_AA,
} from "./educationalIdentityInput.js";
import {
  isWalletOnlyResolveAuthEligible,
  selectResolveBearer,
  RESOLVE_BEARER_KIND,
} from "./resolveBearerSelection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const EOA = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const DEVICE_AA = "0x1111111111111111111111111111111111111111";
const AA_CRED = "0x2222222222222222222222222222222222222222";
const SOCIAL_AA = "0x3333333333333333333333333333333333333333";
const LINKED_EOA = "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e";

function walletOnlyResolve({
  progressAddress = EOA,
  credentialStatus = "NOT_ISSUED",
  currentlyVerified = false,
  aaAddress = null,
  tokenId = null,
  sbtContract = null,
} = {}) {
  return {
    identity: {
      status: "resolved_legacy",
      mode: "wallet_only",
      matchedBy: "wallet_only_address",
      progressAddress,
      socialIdentityPresent: false,
      aaAddress,
      ownerAddress: null,
      linkedWalletAddress: null,
    },
    credential: {
      status: credentialStatus,
      holderAddress: currentlyVerified ? aaAddress : null,
      sbtContract: currentlyVerified ? sbtContract : null,
      tokenId,
      credentialType: currentlyVerified ? "aa" : null,
    },
    // IC-PR-05: public resolve omits credentialAssociation.
  };
}

test("1. Wallet-first EOA with progress JSON + device AA → canonical EOA progress", () => {
  const payload = walletOnlyResolve({ progressAddress: EOA });
  const interpreted = interpretWalletEntryCanonicalResult(payload, {
    connectedEoa: EOA,
  });
  assert.equal(interpreted.status, WALLET_ENTRY_WALLET_ONLY);
  assert.equal(
    interpreted.canonicalProgressAddress,
    normalizeEvmAddress(EOA)
  );

  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryProgressAddress: interpreted.canonicalProgressAddress,
    walletEntryMode: "wallet_only",
    walletEntryMatchedBy: "wallet_only_address",
  });
  assert.equal(viewer.source, VIEWER_SOURCE_CONNECTED_EOA);
  assert.equal(viewer.identityAddress, normalizeEvmAddress(EOA));
  assert.notEqual(viewer.identityAddress, normalizeEvmAddress(DEVICE_AA));
  assert.equal(viewer.signerAddress, normalizeEvmAddress(EOA));

  // Educational writes still send connected EOA, never device AA.
  const edu = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: false,
    address: EOA,
  });
  assert.equal(edu.source, IDENTITY_INPUT_CONNECTED_EOA);
  assert.equal(edu.identityInput, normalizeEvmAddress(EOA));
});

test("2. Wallet-first EOA with AA-held SBT + verified association", () => {
  const payload = walletOnlyResolve({
    progressAddress: EOA,
    credentialStatus: "ISSUED",
    currentlyVerified: true,
    aaAddress: AA_CRED,
    tokenId: 9,
  });
  const blocks = readCanonicalCredentialBlocks(payload);
  assert.equal(blocks.credentialStatus, "ISSUED");
  // Association verification comes from minimal lookup, not resolve.
  assert.equal(blocks.currentlyVerified, false);
  assert.equal(blocks.association, null);
  assert.equal(blocks.progressAddress, normalizeEvmAddress(EOA));
  assert.equal(blocks.credential.holderAddress, AA_CRED);

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
  // Progress identity stays EOA; association does not merge learner to AA.
  assert.equal(viewer.identityAddress, normalizeEvmAddress(EOA));
  assert.notEqual(viewer.identityAddress, normalizeEvmAddress(AA_CRED));

  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical: blocks,
    aaCredential: { aaAddress: AA_CRED, tokenId: 9 },
    associationLookup: {
      ok: true,
      currentlyVerified: true,
      reasonCode: "ASSOCIATION_ACTIVE_VERIFIED",
      grantsPrivateProgressionAccess: false,
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.VERIFIED);
});

test("3. Wallet-first EOA without association → prompt (not auto-merge)", () => {
  const payload = walletOnlyResolve({
    progressAddress: EOA,
    credentialStatus: "MISMATCH",
    aaAddress: null,
  });
  const blocks = readCanonicalCredentialBlocks(payload);
  assert.equal(blocks.currentlyVerified, false);

  const ui = assessCredentialAssociationUiState({
    frontendEnabled: true,
    eligibility: { eligible: true },
    canonical: blocks,
    aaCredential: { aaAddress: AA_CRED, tokenId: 3 },
    associationLookup: {
      ok: false,
      currentlyVerified: false,
      reasonCode: "ASSOCIATION_NOT_FOUND",
    },
  });
  assert.equal(ui.uiState, CREDENTIAL_ASSOCIATION_UI.PROMPT);
});

test("4. IC-03A CTA visible for eligible wallet-first EOA despite device-AA UI context", () => {
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

  // After IC-03B selection, viewer is connected_eoa even with device AA present.
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
});

test("5. Social-linked EOA remains unchanged", () => {
  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: LINKED_EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    walletEntryProgressAddress: SOCIAL_AA,
    walletEntryMode: "social",
    walletEntryMatchedBy: "wallet_address",
    walletEntryLinkedWalletAddress: LINKED_EOA,
  });
  assert.equal(viewer.source, VIEWER_SOURCE_LINKED_WALLET_ALIAS);
  assert.equal(viewer.identityAddress, normalizeEvmAddress(SOCIAL_AA));
  assert.equal(viewer.isLinkedWalletAlias, true);

  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_LINKED_WALLET_ALIAS,
      walletEntryStatus: WALLET_ENTRY_LINKED_ALIAS,
    }).eligible,
    false
  );
});

test("6. OIDC learner remains unchanged", () => {
  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: true,
    socialAaAddress: SOCIAL_AA,
    connectedEoa: LINKED_EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: false,
  });
  assert.equal(viewer.source, VIEWER_SOURCE_OIDC_SOCIAL);
  assert.equal(viewer.identityAddress, normalizeEvmAddress(SOCIAL_AA));

  const edu = getEducationalIdentityInput({
    smartAccount: DEVICE_AA,
    isOidcAuthenticated: true,
    socialIdentity: { aaAddress: SOCIAL_AA },
    address: LINKED_EOA,
  });
  assert.equal(edu.source, IDENTITY_INPUT_SOCIAL_AA);
  assert.equal(edu.identityInput, normalizeEvmAddress(SOCIAL_AA));

  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: true,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_OIDC_SOCIAL,
      walletOnlyModeEstablished: true,
    }).eligible,
    false
  );
});

test("7. No private progression access without existing authorization", () => {
  // Verified association does not grant private progression.
  const lookup = {
    ok: true,
    currentlyVerified: true,
    verificationStatus: "VERIFIED",
    reasonCode: "ASSOCIATION_ACTIVE_VERIFIED",
    grantsPrivateProgressionAccess: false,
  };
  assert.equal(lookup.grantsPrivateProgressionAccess, false);
  const payload = walletOnlyResolve({
    currentlyVerified: true,
    credentialStatus: "ISSUED",
    aaAddress: AA_CRED,
    tokenId: 1,
  });
  assert.equal(payload.credential.status, "ISSUED");
  assert.equal("credentialAssociation" in payload, false);

  // Without WA-01 wallet Bearer / Keycloak, resolve bearer stays none.
  const bearer = selectResolveBearer({
    isOidcAuthenticated: false,
    idToken: null,
    walletSession: null,
    viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
    walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
    walletEntryMode: "wallet_only",
    identityAddress: EOA,
    connectedEoa: EOA,
    chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
    frontendEnabled: true,
  });
  assert.equal(bearer.kind, RESOLVE_BEARER_KIND.NONE);
  assert.equal(bearer.token, null);

  // Device AA viewer is not wallet-auth eligible (Policy B target = EOA).
  assert.equal(
    isWalletOnlyResolveAuthEligible({
      isOidcAuthenticated: false,
      viewerSource: VIEWER_SOURCE_DEVICE_AA,
      walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
      walletEntryMode: "wallet_only",
      identityAddress: DEVICE_AA,
      connectedEoa: EOA,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      frontendEnabled: true,
    }),
    false
  );
});

test("8. Wallet / network switching invalidates prior wallet-entry path", () => {
  const otherEoa = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  // Prior wallet_only for EOA must not stick when a different EOA is connected
  // without a matching wallet-entry result (status idle → empty / device path).
  const switchedUnresolved = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: otherEoa,
    deviceAa: DEVICE_AA,
    deviceAaReady: false,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_UNRESOLVED,
    walletEntryProgressAddress: EOA, // stale progress for previous wallet
  });
  assert.equal(switchedUnresolved.identityAddress, null);
  assert.equal(switchedUnresolved.source, VIEWER_SOURCE_UNRESOLVED);
  assert.notEqual(
    switchedUnresolved.identityAddress,
    normalizeEvmAddress(EOA)
  );

  // Wrong network: IC-03A not eligible.
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: 1,
      viewerSource: VIEWER_SOURCE_CONNECTED_EOA,
      walletEntryStatus: WALLET_ENTRY_WALLET_ONLY,
      walletEntryMode: "wallet_only",
      walletOnlyModeEstablished: true,
    }).reasonCode,
    CREDENTIAL_ASSOCIATION_REASON.WRONG_CHAIN
  );
});

test("9. Missing / unavailable backend resolution → no fabricated identity", () => {
  const unavailable = interpretWalletEntryCanonicalResult(null, {
    connectedEoa: EOA,
    error: new Error("network"),
  });
  assert.equal(unavailable.status, WALLET_ENTRY_UNAVAILABLE);

  const viewer = selectCanonicalViewerIdentity({
    isOidcAuthenticated: false,
    connectedEoa: EOA,
    deviceAa: DEVICE_AA,
    deviceAaReady: true,
    walletEntryActive: true,
    walletEntryStatus: WALLET_ENTRY_UNAVAILABLE,
  });
  // Device AA must not fill in when canonical resolve failed.
  assert.equal(viewer.source, VIEWER_SOURCE_UNAVAILABLE);
  assert.equal(viewer.identityAddress, null);
});

test("10. No automatic EOA/AA learner merge", () => {
  const selector = readFileSync(
    join(root, "utils/walletEntryCanonicalResolve.js"),
    "utf8"
  );
  const edu = readFileSync(
    join(root, "utils/educationalIdentityInput.js"),
    "utf8"
  );
  const provider = readFileSync(
    join(root, "context/ResolvedIdentityProvider.jsx"),
    "utf8"
  );

  // No persistence APIs (comments may mention browser storage conceptually).
  assert.equal(selector.includes("setItem"), false);
  assert.equal(edu.includes("setItem"), false);
  assert.equal(selector.includes("getItem("), false);
  // Wallet-only branch must prefer progressAddress before device AA.
  assert.match(selector, /WALLET_ENTRY_WALLET_ONLY/);
  assert.match(selector, /progressAddress/);
  assert.match(
    selector,
    /Device AA only when wallet-entry did not establish/
  );
  // Provider establishes wallet_only from wallet-entry, not device AA viewer.
  assert.match(provider, /walletOnlyModeEstablished/);
  assert.match(provider, /walletEntry\.status === WALLET_ENTRY_WALLET_ONLY/);

  // Device AA alone (no wallet_only) never becomes credential association.
  assert.equal(
    getCredentialAssociationEligibility({
      isOidcAuthenticated: false,
      isConnected: true,
      chainId: CREDENTIAL_ASSOCIATION_CHAIN_ID,
      viewerSource: VIEWER_SOURCE_DEVICE_AA,
      walletEntryStatus: null,
      walletOnlyModeEstablished: false,
    }).eligible,
    false
  );
});
