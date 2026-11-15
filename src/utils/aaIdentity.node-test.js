/**
 * AA identity / private-key security regression tests.
 * Run: node --test src/utils/aaIdentity.node-test.js
 *
 * Covers storage fail-closed behavior for device AA keys, connected EOA session
 * keys, and minted wallet-AA evidence. Does not change production code.
 */

import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import test from "node:test";
import { Wallet } from "ethers";

import {
  clearAaDisconnectLocalStorage,
  clearIdentityState,
  getOrCreateOwnerPrivateKey,
  getOwnerAddress,
  hasPersistedWalletAaIdentity,
  loadIdentityState,
  loadOwnerPrivateKey,
  normalizeOwnerPrivateKey,
  persistWagmiWalletSession,
  readConnectedEoaAddress,
  saveIdentityState,
  saveOwnerPrivateKey,
} from "./aaIdentity.js";
import { exportIdentity, importIdentity } from "./identityExport.js";

const OWNER_KEY = "web3edu-aa-owner-private-key";
const IDENTITY_KEY = "web3edu-aa-identity";
const WALLET_SESSION_KEY = "web3edu-wallet-connected";
const WALLET_ADDRESS_KEY = "web3edu-wallet-address";

const VALID_PK =
  "0x423d045bacd70b683069eabee60d0528e7a66ef8f7f8974eec1325415eb5197a";
const VALID_EOA = "0x1D05bB9B96fB3165799Cb3Dd09567CcFB757fe3F";
const OTHER_EOA = "0xdf0d2c02e18209c3d717488e0157fb40a33bb6d2";
const VALID_AA = "0x5e67e43cd14daab71b01a5268d209cb3b69dc175";
/** secp256k1 curve order n — private keys must satisfy 0 < key < n */
const SECP256K1_N =
  0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const ZERO_PK =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const EQ_N_PK = `0x${SECP256K1_N.toString(16).padStart(64, "0")}`;
const ABOVE_N_PK = `0x${(SECP256K1_N + 1n).toString(16).padStart(64, "0")}`;
const MAX_UINT256_PK =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

if (!globalThis.crypto?.getRandomValues) {
  globalThis.crypto = webcrypto;
}

function createMemoryStorage() {
  const store = Object.create(null);
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) delete store[key];
    },
    _dump() {
      return { ...store };
    },
  };
}

function withBrowserStorage(fn) {
  const previous = {
    window: globalThis.window,
    localStorage: globalThis.localStorage,
  };
  const localStorage = createMemoryStorage();
  globalThis.localStorage = localStorage;
  globalThis.window = {
    localStorage,
    dispatchEvent() {
      return true;
    },
  };
  try {
    return fn(localStorage);
  } finally {
    if (previous.window === undefined) delete globalThis.window;
    else globalThis.window = previous.window;
    if (previous.localStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous.localStorage;
  }
}

// ---------------------------------------------------------------------------
// 1. AA private-key handling
// ---------------------------------------------------------------------------

test("saveOwnerPrivateKey rejects malformed keys and does not persist them", () => {
  withBrowserStorage((storage) => {
    assert.throws(() => saveOwnerPrivateKey("not-a-key"), /Invalid owner private key/);
    assert.throws(() => saveOwnerPrivateKey("0x1234"), /Invalid owner private key/);
    assert.throws(() => saveOwnerPrivateKey(VALID_PK.slice(2)), /Invalid owner private key/);
    assert.equal(storage.getItem(OWNER_KEY), null);

    saveOwnerPrivateKey(VALID_PK);
    assert.equal(storage.getItem(OWNER_KEY), VALID_PK);
  });
});

test("loadOwnerPrivateKey returns normalized 32-byte keys only", () => {
  withBrowserStorage((storage) => {
    assert.equal(loadOwnerPrivateKey(), null);

    storage.setItem(OWNER_KEY, "garbage");
    assert.equal(loadOwnerPrivateKey(), null);

    storage.setItem(OWNER_KEY, "0xabcd");
    assert.equal(loadOwnerPrivateKey(), null);

    storage.setItem(OWNER_KEY, VALID_PK);
    assert.equal(loadOwnerPrivateKey(), VALID_PK);
  });
});

test("clearAaDisconnectLocalStorage removes private key, wallet session, and identity JSON", () => {
  withBrowserStorage((storage) => {
    saveOwnerPrivateKey(VALID_PK);
    persistWagmiWalletSession(VALID_EOA);
    saveIdentityState({
      owner: VALID_EOA,
      smartAccount: VALID_AA,
      hasIdentity: true,
      alreadyMinted: true,
    });

    clearAaDisconnectLocalStorage();

    assert.equal(storage.getItem(OWNER_KEY), null);
    assert.equal(storage.getItem(WALLET_SESSION_KEY), null);
    assert.equal(storage.getItem(WALLET_ADDRESS_KEY), null);
    assert.equal(storage.getItem(IDENTITY_KEY), null);
    assert.equal(loadOwnerPrivateKey(), null);
    assert.equal(readConnectedEoaAddress(), null);
    assert.equal(loadIdentityState(), null);
  });
});

test("exportIdentity round-trips a valid stored owner private key", () => {
  withBrowserStorage(() => {
    assert.equal(exportIdentity(), null);
    saveOwnerPrivateKey(VALID_PK);
    const exported = exportIdentity();
    assert.ok(exported);
    const parsed = JSON.parse(exported);
    assert.equal(parsed.privateKey, VALID_PK);
  });
});

test("importIdentity accepts a valid private key and clears prior identity JSON", () => {
  withBrowserStorage((storage) => {
    saveIdentityState({
      owner: OTHER_EOA,
      smartAccount: VALID_AA,
      hasIdentity: true,
      alreadyMinted: true,
    });
    assert.equal(importIdentity(JSON.stringify({ privateKey: VALID_PK })), true);
    assert.equal(storage.getItem(OWNER_KEY), VALID_PK);
    assert.equal(loadIdentityState(), null);
    assert.equal(loadOwnerPrivateKey(), VALID_PK);
  });
});

test("importIdentity rejects malformed private keys and does not persist them", () => {
  withBrowserStorage((storage) => {
    storage.setItem(OWNER_KEY, VALID_PK);

    assert.equal(importIdentity("not-a-key"), false);
    assert.equal(importIdentity(JSON.stringify({ privateKey: "0x12" })), false);
    assert.equal(importIdentity(JSON.stringify({ privateKey: "totally-invalid" })), false);
    assert.equal(importIdentity(""), false);
    assert.equal(importIdentity(null), false);

    // Prior valid key must remain when import is rejected (fail closed).
    assert.equal(storage.getItem(OWNER_KEY), VALID_PK);
    assert.equal(loadOwnerPrivateKey(), VALID_PK);
  });
});

// ---------------------------------------------------------------------------
// 1b. secp256k1 validation + export fail-closed
// ---------------------------------------------------------------------------

test("normalizeOwnerPrivateKey accepts valid secp256k1 private keys", () => {
  const random = Wallet.createRandom().privateKey;
  assert.equal(normalizeOwnerPrivateKey(VALID_PK), VALID_PK);
  assert.equal(normalizeOwnerPrivateKey(random), random);
  assert.equal(
    normalizeOwnerPrivateKey("0x0000000000000000000000000000000000000000000000000000000000000001"),
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
});

test("normalizeOwnerPrivateKey rejects zero and out-of-range secp256k1 scalars", () => {
  assert.equal(normalizeOwnerPrivateKey(ZERO_PK), null);
  assert.equal(normalizeOwnerPrivateKey(EQ_N_PK), null);
  assert.equal(normalizeOwnerPrivateKey(ABOVE_N_PK), null);
  assert.equal(normalizeOwnerPrivateKey(MAX_UINT256_PK), null);
  withBrowserStorage((storage) => {
    assert.throws(() => saveOwnerPrivateKey(ZERO_PK), /Invalid owner private key/);
    assert.throws(() => saveOwnerPrivateKey(EQ_N_PK), /Invalid owner private key/);
    assert.equal(storage.getItem(OWNER_KEY), null);
  });
});

test("normalizeOwnerPrivateKey rejects malformed and truncated keys", () => {
  assert.equal(normalizeOwnerPrivateKey("not-a-key"), null);
  assert.equal(normalizeOwnerPrivateKey("0x12"), null);
  assert.equal(normalizeOwnerPrivateKey(VALID_PK.slice(2)), null);
  assert.equal(normalizeOwnerPrivateKey(`${VALID_PK}00`), null);
  assert.equal(normalizeOwnerPrivateKey(""), null);
  assert.equal(normalizeOwnerPrivateKey(null), null);
});

test("exportIdentity exports valid keys and rejects corrupted stored keys without mutating storage", () => {
  withBrowserStorage((storage) => {
    saveOwnerPrivateKey(VALID_PK);
    const exported = exportIdentity();
    assert.deepEqual(JSON.parse(exported), { privateKey: VALID_PK });
    assert.equal(storage.getItem(OWNER_KEY), VALID_PK);

    storage.setItem(OWNER_KEY, ZERO_PK);
    assert.equal(exportIdentity(), null);
    assert.equal(storage.getItem(OWNER_KEY), ZERO_PK, "export must not delete corrupted keys");

    storage.setItem(OWNER_KEY, "garbage");
    assert.equal(exportIdentity(), null);
    assert.equal(storage.getItem(OWNER_KEY), "garbage");

    storage.setItem(OWNER_KEY, "0xabcd");
    assert.equal(exportIdentity(), null);
    assert.equal(loadOwnerPrivateKey(), null);
  });
});

test("failed import preserves existing valid key and identity state", () => {
  withBrowserStorage((storage) => {
    saveOwnerPrivateKey(VALID_PK);
    const identity = saveIdentityState({
      owner: VALID_EOA,
      smartAccount: VALID_AA,
      hasIdentity: true,
      alreadyMinted: true,
    });

    assert.equal(importIdentity(ZERO_PK), false);
    assert.equal(importIdentity(JSON.stringify({ privateKey: EQ_N_PK })), false);
    assert.equal(importIdentity(JSON.stringify({ privateKey: "0x12" })), false);
    assert.equal(importIdentity("not-a-key"), false);

    assert.equal(storage.getItem(OWNER_KEY), VALID_PK);
    assert.equal(loadOwnerPrivateKey(), VALID_PK);
    assert.equal(loadIdentityState()?.smartAccount, identity.smartAccount);
    assert.equal(loadIdentityState()?.hasIdentity, true);
    assert.equal(hasPersistedWalletAaIdentity(loadIdentityState()), true);
  });
});

// ---------------------------------------------------------------------------
// 2. AA identity evidence / EOA vs device AA
// ---------------------------------------------------------------------------

test("readConnectedEoaAddress requires session flag and a full checksummable EOA", () => {
  withBrowserStorage((storage) => {
    assert.equal(readConnectedEoaAddress(), null);

    storage.setItem(WALLET_ADDRESS_KEY, VALID_EOA);
    assert.equal(
      readConnectedEoaAddress(),
      null,
      "address without session flag must not count as connected EOA"
    );

    storage.setItem(WALLET_SESSION_KEY, "yes");
    assert.equal(readConnectedEoaAddress(), null);

    storage.setItem(WALLET_SESSION_KEY, "true");
    storage.setItem(WALLET_ADDRESS_KEY, "0x3934c22b178B");
    assert.equal(readConnectedEoaAddress(), null);

    storage.setItem(WALLET_ADDRESS_KEY, VALID_EOA);
    assert.equal(readConnectedEoaAddress(), VALID_EOA);
  });
});

test("connected EOA session is distinct from device-owned AA key material", () => {
  withBrowserStorage(() => {
    const devicePk = getOrCreateOwnerPrivateKey();
    const deviceOwner = getOwnerAddress();
    assert.equal(devicePk.length, 66);
    assert.ok(/^0x[a-fA-F0-9]{40}$/.test(deviceOwner));

    persistWagmiWalletSession(OTHER_EOA);
    const connected = readConnectedEoaAddress();
    assert.equal(connected.toLowerCase(), OTHER_EOA.toLowerCase());
    assert.notEqual(
      connected.toLowerCase(),
      deviceOwner.toLowerCase(),
      "connected EOA must not be confused with device AA owner address"
    );

    // Device key remains loadable separately; session address is not the device key.
    assert.equal(loadOwnerPrivateKey(), devicePk);
    assert.equal(getOwnerAddress().toLowerCase(), deviceOwner.toLowerCase());
  });
});

test("hasPersistedWalletAaIdentity requires smartAccount + minted flag", () => {
  assert.equal(hasPersistedWalletAaIdentity(null), false);
  assert.equal(hasPersistedWalletAaIdentity({}), false);
  assert.equal(
    hasPersistedWalletAaIdentity({
      smartAccount: VALID_AA,
      hasIdentity: false,
      alreadyMinted: false,
    }),
    false
  );
  assert.equal(
    hasPersistedWalletAaIdentity({
      hasIdentity: true,
      alreadyMinted: true,
    }),
    false
  );
  assert.equal(
    hasPersistedWalletAaIdentity({
      smartAccount: "0x1234",
      hasIdentity: true,
    }),
    false
  );
  assert.equal(
    hasPersistedWalletAaIdentity({
      smartAccount: VALID_AA,
      hasIdentity: true,
    }),
    true
  );
  assert.equal(
    hasPersistedWalletAaIdentity({
      smartAccount: VALID_AA,
      alreadyMinted: true,
    }),
    true
  );
});

// ---------------------------------------------------------------------------
// 3. Identity persistence / incomplete evidence
// ---------------------------------------------------------------------------

test("saveIdentityState merge must not make incomplete AA evidence look minted", () => {
  withBrowserStorage(() => {
    const minted = saveIdentityState({
      owner: VALID_EOA,
      smartAccount: VALID_AA,
      hasIdentity: true,
      alreadyMinted: true,
    });
    assert.equal(hasPersistedWalletAaIdentity(minted), true);

    // Clearing mint flags while leaving smartAccount must fail closed.
    const clearedFlags = saveIdentityState({
      hasIdentity: false,
      alreadyMinted: false,
    });
    assert.equal(clearedFlags.smartAccount, VALID_AA);
    assert.equal(
      hasPersistedWalletAaIdentity(clearedFlags),
      false,
      "smartAccount without minted flags is not a valid wallet-AA identity"
    );
    assert.equal(hasPersistedWalletAaIdentity(loadIdentityState()), false);

    clearIdentityState();
    const flagsOnly = saveIdentityState({
      owner: VALID_EOA,
      hasIdentity: true,
      alreadyMinted: true,
    });
    assert.equal(
      hasPersistedWalletAaIdentity(flagsOnly),
      false,
      "minted flags without smartAccount are not wallet-AA evidence"
    );

    const truncated = saveIdentityState({
      smartAccount: "0x5e67e43cd14d",
      hasIdentity: true,
      alreadyMinted: true,
    });
    assert.equal(hasPersistedWalletAaIdentity(truncated), false);
  });
});

test("device AA owner key alone is not persisted wallet-AA identity evidence", () => {
  withBrowserStorage(() => {
    saveOwnerPrivateKey(VALID_PK);
    const deviceOwner = new Wallet(VALID_PK).address;
    assert.equal(getOwnerAddress(), deviceOwner);
    assert.equal(hasPersistedWalletAaIdentity(loadIdentityState()), false);
    assert.equal(readConnectedEoaAddress(), null);

    persistWagmiWalletSession(deviceOwner);
    assert.equal(readConnectedEoaAddress(), deviceOwner);
    // Even if session EOA equals device owner address, identity JSON is still required.
    assert.equal(hasPersistedWalletAaIdentity(loadIdentityState()), false);
  });
});
