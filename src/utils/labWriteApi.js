import { getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import { warnIfIdentityNotInitialized } from "./identityReadiness.js";
import {
  getEducationalIdentityInput,
  getEffectiveLabsWalletIdentity,
} from "./educationalIdentityInput.js";

export {
  getEducationalIdentityInput,
  getEffectiveLabsWalletIdentity,
} from "./educationalIdentityInput.js";

const LAB_START_SESSION_PREFIX = "web3edu:labsStart:v1:";
/** @type {Map<string, Promise<Response>>} */
const inFlightLabStarts = new Map();

function labStartSessionStorageKey(labId, identityInput) {
  const id = normalizeEvmAddress(identityInput);
  const lid = String(labId ?? "").trim();
  if (!id || !lid) return null;
  return `${LAB_START_SESSION_PREFIX}${lid}:${id}`;
}

/**
 * READ path only — first argument to {@link buildLabsStatusUrl}.
 *
 * Pass the same identity fields as educational writes. The address is an
 * identity *input* for backend canonicalization, not a locally computed
 * progressAddress.
 */
export function getLabsStatusReadIdentity(args = {}) {
  if (Object.prototype.hasOwnProperty.call(args, "identityAddress")) {
    return { identityAddress: normalizeEvmAddress(args.identityAddress) };
  }
  const { identityInput } = getEducationalIdentityInput(args);
  return { identityAddress: identityInput };
}

/**
 * POST /labs/start — identity input as `wallet` + optional EOA `owner`.
 *
 * Backend canonicalizes. Session dedupe keys on the identity input, not on
 * a device-local smartAccount that might differ from SocialIdentity AA.
 */
export async function postLabsStart({
  apiBase,
  smartAccount,
  address,
  owner,
  labId,
  isOidcAuthenticated,
  socialIdentity,
  socialIdentityLoading,
  oidcAuthLoading,
} = {}) {
  const input = getEducationalIdentityInput({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    socialIdentityLoading,
    oidcAuthLoading,
    address,
    owner,
  });

  if (input.deferred) {
    return new Response(null, { status: 204 });
  }

  const storageKey = labStartSessionStorageKey(labId, input.identityInput);
  if (!storageKey) {
    warnIfIdentityNotInitialized("postLabsStart", {
      smartAccount: input.identityInput,
      owner: input.owner,
    });
    return new Response(
      JSON.stringify({ error: "identity input and labId are required for /labs/start" }),
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
  const ownerPayload = input.owner;

  const promise = (async () => {
    try {
      const body = {
        wallet: input.identityInput,
        labId,
        startedAt,
      };
      if (ownerPayload) {
        body.owner = ownerPayload;
      }
      const res = await fetch(`${base}/labs/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
  socialIdentityLoading,
  oidcAuthLoading,
  contractAddress,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    socialIdentityLoading,
    oidcAuthLoading,
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
  socialIdentityLoading,
  oidcAuthLoading,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    socialIdentityLoading,
    oidcAuthLoading,
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
  socialIdentityLoading,
  oidcAuthLoading,
  txHash,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity({
    smartAccount,
    isOidcAuthenticated,
    socialIdentity,
    socialIdentityLoading,
    oidcAuthLoading,
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
