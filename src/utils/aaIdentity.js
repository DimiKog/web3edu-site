import { ethers } from "ethers";

const OWNER_PRIVATE_KEY_STORAGE_KEY = "web3edu-aa-owner-private-key";
const IDENTITY_STORAGE_KEY = "web3edu-aa-identity";
const WALLET_SESSION_KEY = "web3edu-wallet-connected";
const WALLET_ADDRESS_KEY = "web3edu-wallet-address";

/**
 * Connected EOA from the same session keys Web3RouteControls writes (wagmi sync).
 * Used as AA `owner` when a wallet is connected — distinct from the ephemeral
 * `web3edu-aa-owner-private-key` identity used only when no wallet session exists.
 */
export function readConnectedEoaAddress() {
  if (typeof window === "undefined") return null;
  if (window.localStorage.getItem(WALLET_SESSION_KEY) !== "true") return null;
  const raw = (window.localStorage.getItem(WALLET_ADDRESS_KEY) || "").trim();
  if (!/^0x[a-fA-F0-9]{40}$/i.test(raw)) return null;
  try {
    return ethers.getAddress(raw);
  } catch {
    return null;
  }
}

function isHexString(value) {
  return typeof value === "string" && /^0x[0-9a-fA-F]*$/.test(value);
}

function normalizeHex32(value) {
  if (!isHexString(value)) return null;
  try {
    return ethers.hexlify(value);
  } catch {
    return null;
  }
}

function generatePrivateKey() {
  // 32 bytes random → 0x-prefixed hex string
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return ethers.hexlify(bytes);
}

export function loadOwnerPrivateKey() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(OWNER_PRIVATE_KEY_STORAGE_KEY);
  const normalized = normalizeHex32(raw);
  return normalized && normalized.length === 66 ? normalized : null;
}

export function saveOwnerPrivateKey(privateKey) {
  if (typeof window === "undefined") return;
  const normalized = normalizeHex32(privateKey);
  if (!normalized || normalized.length !== 66) {
    throw new Error("Invalid owner private key");
  }
  window.localStorage.setItem(OWNER_PRIVATE_KEY_STORAGE_KEY, normalized);
}

export function getOrCreateOwnerPrivateKey() {
  const existing = loadOwnerPrivateKey();
  if (existing) return existing;
  const created = generatePrivateKey();
  saveOwnerPrivateKey(created);
  return created;
}

export function getOwnerWallet() {
  const pk = getOrCreateOwnerPrivateKey();
  return new ethers.Wallet(pk);
}

export function getOwnerAddress() {
  return getOwnerWallet().address;
}

export function loadIdentityState() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(IDENTITY_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveIdentityState(nextState) {
  if (typeof window === "undefined") return;
  const current = loadIdentityState() ?? {};
  const merged = { ...current, ...nextState, updatedAt: Date.now() };
  window.localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export function clearIdentityState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(IDENTITY_STORAGE_KEY);
}

/** Clears persisted AA owner key, wallet session keys, and identity JSON (see IdentityContext.disconnectIdentity). */
export function clearAaDisconnectLocalStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OWNER_PRIVATE_KEY_STORAGE_KEY);
  window.localStorage.removeItem(WALLET_ADDRESS_KEY);
  window.localStorage.removeItem(WALLET_SESSION_KEY);
  clearIdentityState();
}

export function getStoredOwnerAddress() {
  const identity = loadIdentityState();
  return identity?.owner ?? null;
}

export function getStoredSmartAccount() {
  const identity = loadIdentityState();
  return identity?.smartAccount ?? null;
}

export function getStoredIdentityVersion() {
  const identity = loadIdentityState();
  return identity?.version ?? null;
}

export function getStoredTokenId() {
  const identity = loadIdentityState();
  return identity?.tokenId ?? null;
}

export function hasIdentityState() {
  const identity = loadIdentityState();
  if (!identity) return false;
  return identity?.hasIdentity === true || identity?.alreadyMinted === true;
}

