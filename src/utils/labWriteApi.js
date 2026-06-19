import { buildResolveOwner, getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import { warnIfIdentityNotInitialized } from "./identityReadiness.js";
import { getSocialIdentityAaAddress } from "./socialIdentityPayload.js";

const LAB_START_SESSION_PREFIX = "web3edu:labsStart:v1:";
/** @type {Map<string, Promise<Response>>} */
const inFlightLabStarts = new Map();

function labStartSessionStorageKey(labId, smartAccount) {
  const id = normalizeEvmAddress(smartAccount);
  const lid = String(labId ?? "").trim();
  if (!id || !lid) return null;
  return `${LAB_START_SESSION_PREFIX}${lid}:${id}`;
}

/**
 * READ path only — first argument to {@link buildLabsStatusUrl}.
 * Labs use AA `smartAccount` only (same key as write `wallet`); never wagmi `address` or IdentityContext `owner`.
 */
export function getLabsStatusReadIdentity({ smartAccount }) {
  return {
    identityAddress: smartAccount ?? null,
  };
}

/**
 * Same progress `wallet` + optional `owner` used by lab completion, dashboard reads, and coding01 verify.
 *
 * Resolution order for `wallet`:
 * 1. Local AA smart account (wallet-first / minted identity)
 * 2. Social-login AA when OIDC-authenticated
 * 3. Connected MetaMask EOA when no AA/social Web3Edu identity exists (wallet-only path)
 *
 * `owner` is sent only when an AA/social identity is active — for owner→AA migration.
 * Wallet-only users use the connected EOA as `wallet` and omit `owner`.
 */
export function getEffectiveLabsWalletIdentity({
  smartAccount,
  isOidcAuthenticated = false,
  socialIdentity = null,
  address = null,
  owner = null,
} = {}) {
  const localSc = normalizeEvmAddress(smartAccount);
  const socialAa = isOidcAuthenticated
    ? normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity))
    : null;
  const connectedEoa = normalizeEvmAddress(address);

  const hasAaOrSocialIdentity = Boolean(localSc || socialAa);
  const wallet = localSc ?? socialAa ?? connectedEoa;
  const ownerPayload = hasAaOrSocialIdentity
    ? buildResolveOwner(address, owner)
    : null;

  return {
    wallet,
    owner: ownerPayload,
  };
}

/**
 * POST /labs/start — AA `wallet` + EOA `owner` (wagmi `address` when connected, else IdentityContext `owner`
 * for walletless AA) so the backend can key XP the same way as {@link buildLabsStatusUrl}.
 *
 * Idempotent per browser tab: after a successful response for the same (labId, smartAccount),
 * further calls resolve immediately without a second network request.
 */
export async function postLabsStart({
  apiBase,
  smartAccount,
  address,
  owner,
  labId,
} = {}) {
  const storageKey = labStartSessionStorageKey(labId, smartAccount);
  if (!storageKey) {
    warnIfIdentityNotInitialized("postLabsStart", { smartAccount, owner });
    return new Response(
      JSON.stringify({ error: "smartAccount and labId are required for /labs/start" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof sessionStorage !== "undefined") {
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        return new Response(null, { status: 200 });
      }
    } catch {
      /* private mode / blocked storage */
    }
  }

  const existing = inFlightLabStarts.get(storageKey);
  if (existing) return existing;

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const startedAt = new Date().toISOString();

  const ownerPayload = buildResolveOwner(address, owner);

  const promise = (async () => {
    try {
      const res = await fetch(`${base}/labs/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: smartAccount,
          owner: ownerPayload,
          labId,
          startedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (import.meta.env.DEV && data?.identityKey != null) {
        // eslint-disable-next-line no-console -- backend integration diagnostic
        console.log("LAB IDENTITY KEY", data.identityKey);
      }
      if (res.ok && typeof sessionStorage !== "undefined") {
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {
          /* ignore */
        }
      }
      return res;
    } finally {
      inFlightLabStarts.delete(storageKey);
    }
  })();

  inFlightLabStarts.set(storageKey, promise);
  return promise;
}

/**
 * POST /labs/coding01/verify-contract — checks deployed Counter bytecode on Besu Edu-Net.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postCoding01VerifyContract({
  apiBase,
  smartAccount,
  address,
  owner,
  isOidcAuthenticated,
  socialIdentity,
  contractAddress,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    address,
    owner,
  });
  const addr = normalizeEvmAddress(contractAddress);

  if (!wallet || !addr) {
    return {
      ok: false,
      status: 400,
      data: {
        error: "wallet and contractAddress are required for /labs/coding01/verify-contract",
      },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const payload = {
    wallet,
    contractAddress: addr,
  };
  if (ownerPayload) {
    payload.owner = ownerPayload;
  }

  try {
    const res = await fetch(`${base}/labs/coding01/verify-contract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (import.meta.env.DEV && data?.identityKey != null) {
      // eslint-disable-next-line no-console -- backend integration diagnostic
      console.log("CODING01 VERIFY IDENTITY KEY", data.identityKey);
    }
    return {
      ok: res.ok && data?.ok === true,
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { error: err?.message || "Network error" },
    };
  }
}

/**
 * POST /labs/coding02/start-interaction — loads the learner's verified Counter from Coding Lab 01.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postCoding02StartInteraction({
  apiBase,
  smartAccount,
  address,
  owner,
  isOidcAuthenticated,
  socialIdentity,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    address,
    owner,
  });

  if (!wallet) {
    return {
      ok: false,
      status: 400,
      data: {
        error: "wallet is required for /labs/coding02/start-interaction",
      },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const payload = { wallet };
  if (ownerPayload) {
    payload.owner = ownerPayload;
  }

  try {
    const res = await fetch(`${base}/labs/coding02/start-interaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (import.meta.env.DEV && data?.identityKey != null) {
      // eslint-disable-next-line no-console -- backend integration diagnostic
      console.log("CODING02 START IDENTITY KEY", data.identityKey);
    }
    return {
      ok: res.ok && data?.ok === true,
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { error: err?.message || "Network error" },
    };
  }
}

/**
 * POST /labs/coding02/verify-increment — checks that increment() changed on-chain state.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postCoding02VerifyIncrement({
  apiBase,
  smartAccount,
  address,
  owner,
  isOidcAuthenticated,
  socialIdentity,
  txHash,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    address,
    owner,
  });

  if (!wallet) {
    return {
      ok: false,
      status: 400,
      data: {
        error: "wallet is required for /labs/coding02/verify-increment",
      },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const payload = { wallet };
  if (ownerPayload) {
    payload.owner = ownerPayload;
  }
  const normalizedTxHash = String(txHash ?? "").trim();
  if (normalizedTxHash) {
    payload.txHash = normalizedTxHash;
  }

  try {
    const res = await fetch(`${base}/labs/coding02/verify-increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (import.meta.env.DEV && data?.identityKey != null) {
      // eslint-disable-next-line no-console -- backend integration diagnostic
      console.log("CODING02 VERIFY IDENTITY KEY", data.identityKey);
    }
    const currentValue = data.finalValue ?? data.currentValue;
    const valueIncreased =
      data.initialValue != null &&
      currentValue != null &&
      BigInt(String(currentValue)) > BigInt(String(data.initialValue));
    return {
      ok: res.ok && (data?.ok === true || valueIncreased),
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { error: err?.message || "Network error" },
    };
  }
}
