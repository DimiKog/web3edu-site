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

function educationalIdentityFields(args = {}) {
  return {
    smartAccount: args.smartAccount,
    address: args.address,
    owner: args.owner,
    isOidcAuthenticated: args.isOidcAuthenticated,
    socialIdentity: args.socialIdentity,
    socialIdentityLoading: args.socialIdentityLoading,
    oidcAuthLoading: args.oidcAuthLoading,
    walletEntryLinkedAlias: args.walletEntryLinkedAlias,
    walletEntryResolvePending: args.walletEntryResolvePending,
  };
}

/** Same Bearer pattern as socialIdentity.js / identityLink.js — not a second auth system. */
export function buildLabWriteAuthHeaders(idToken) {
  if (!idToken || typeof idToken !== "string" || !idToken.trim()) {
    return null;
  }
  return {
    Authorization: `Bearer ${idToken.trim()}`,
    "Content-Type": "application/json",
  };
}

function normalizeIdToken(idToken) {
  return typeof idToken === "string" && idToken.trim() ? idToken.trim() : null;
}

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
 * POST /labs/start — Keycloak Bearer required; identity input as `wallet` +
 * optional EOA `owner` (compatibility only; backend ignores for destination).
 *
 * Returns HTTP 204 Response when identity or idToken is not ready (caller should
 * defer / retry). Session dedupe keys on the identity input.
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
  walletEntryLinkedAlias,
  walletEntryResolvePending,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    // Do not fire an unauthenticated write that will 401.
    return new Response(null, { status: 204 });
  }

  const input = getEducationalIdentityInput(
    educationalIdentityFields({
      smartAccount,
      address,
      owner,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      walletEntryLinkedAlias,
      walletEntryResolvePending,
    })
  );

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
  const headers = buildLabWriteAuthHeaders(token);

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
        headers,
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
 * POST /projects/complete-answer — Keycloak Bearer required.
 * wallet remains for staged compatibility; backend derives destination from token.
 * Does not require an external wallet connection.
 *
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postProjectsCompleteAnswer({
  apiBase,
  projectId,
  answer,
  wallet,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }
  const pid = String(projectId ?? "").trim();
  const ans = answer == null ? "" : String(answer);
  if (!pid || !ans.trim()) {
    return {
      ok: false,
      status: 400,
      data: { error: "missing_fields" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const body = { projectId: pid, answer: ans };
  const walletPayload = normalizeEvmAddress(wallet);
  if (walletPayload) body.wallet = walletPayload;

  try {
    const res = await fetch(`${base}/projects/complete-answer`, {
      method: "POST",
      headers: buildLabWriteAuthHeaders(token),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
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
 * GET /projects/poe/status — optional Bearer for authenticated Web3Edu reconciliation.
 * Without idToken the call is read-only (stored completion only).
 *
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function fetchProjectsPoeStatus({
  apiBase,
  address,
  idToken,
  signal,
} = {}) {
  const addr = normalizeEvmAddress(address);
  if (!addr) {
    return {
      ok: false,
      status: 400,
      data: { error: "missing_address" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const params = new URLSearchParams({ address: addr });
  const headers = buildLabWriteAuthHeaders(idToken) ?? { "Content-Type": "application/json" };

  try {
    const res = await fetch(`${base}/projects/poe/status?${params.toString()}`, {
      method: "GET",
      headers,
      signal,
    });
    const data = await res.json().catch(() => ({}));
    return {
      ok: res.ok && data?.ok !== false,
      status: res.status,
      data,
    };
  } catch (err) {
    if (err?.name === "AbortError") {
      throw err;
    }
    return {
      ok: false,
      status: 0,
      data: { error: err?.message || "Network error" },
    };
  }
}

/**
 * POST /labs/complete — Keycloak Bearer required.
 * wallet/owner remain for staged compatibility; backend derives destination from token.
 *
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postLabsComplete({
  apiBase,
  labId,
  wallet,
  owner,
  message,
  signature,
  completedAt,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }
  const lid = String(labId ?? "").trim();
  if (!lid) {
    return {
      ok: false,
      status: 400,
      data: { error: "missing_lab" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const body = { labId: lid };
  const walletPayload = normalizeEvmAddress(wallet);
  if (walletPayload) body.wallet = walletPayload;
  const ownerPayload = normalizeEvmAddress(owner);
  if (ownerPayload) body.owner = ownerPayload;
  if (message != null) body.message = message;
  if (signature != null) body.signature = signature;
  if (completedAt != null) body.completedAt = completedAt;

  try {
    const res = await fetch(`${base}/labs/complete`, {
      method: "POST",
      headers: buildLabWriteAuthHeaders(token),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (import.meta.env.DEV && data?.identityKey != null) {
      // eslint-disable-next-line no-console -- backend integration diagnostic
      console.log("LAB IDENTITY KEY", data.identityKey);
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
 * POST /labs/coding01/verify-contract — Keycloak Bearer required.
 * contractAddress is required; wallet/owner are not sent (backend derives learner from token).
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postCoding01VerifyContract({
  apiBase,
  contractAddress,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }
  const addr = normalizeEvmAddress(contractAddress);

  if (!addr) {
    return {
      ok: false,
      status: 400,
      data: {
        error: "contractAddress is required for /labs/coding01/verify-contract",
      },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");
  const payload = {
    contractAddress: addr,
  };

  try {
    const res = await fetch(`${base}/labs/coding01/verify-contract`, {
      method: "POST",
      headers: buildLabWriteAuthHeaders(token),
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
 * POST /labs/coding01/attribute-deployment — Keycloak Bearer required.
 * No authority fields in body; backend uses stored canonical Coding01 contract.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postCoding01AttributeDeployment({
  apiBase,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");

  try {
    const res = await fetch(`${base}/labs/coding01/attribute-deployment`, {
      method: "POST",
      headers: buildLabWriteAuthHeaders(token),
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
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
  walletEntryLinkedAlias,
  walletEntryResolvePending,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity(
    educationalIdentityFields({
      smartAccount,
      address,
      owner,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      walletEntryLinkedAlias,
      walletEntryResolvePending,
    })
  );

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
  walletEntryLinkedAlias,
  walletEntryResolvePending,
  txHash,
} = {}) {
  const { wallet, owner: ownerPayload } = getEffectiveLabsWalletIdentity(
    educationalIdentityFields({
      smartAccount,
      address,
      owner,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      walletEntryLinkedAlias,
      walletEntryResolvePending,
    })
  );

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

/**
 * GET /learning-modules/lm08/contract-inspection — deployment inspection challenge.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function fetchLm08ContractInspectionChallenge({
  apiBase,
  idToken,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");

  try {
    const res = await fetch(`${base}/learning-modules/lm08/contract-inspection`, {
      method: "GET",
      headers: buildLabWriteAuthHeaders(token),
    });
    const data = await res.json().catch(() => ({}));
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
 * POST /learning-modules/lm08/contract-inspection — submit inspection answers only.
 * @returns {Promise<{ ok: boolean, status: number, data: object }>}
 */
export async function postLm08ContractInspectionAnswers({
  apiBase,
  idToken,
  answers,
} = {}) {
  const token = normalizeIdToken(idToken);
  if (!token) {
    return {
      ok: false,
      status: 0,
      data: { error: "missing_bearer_token" },
    };
  }

  if (!answers || typeof answers !== "object") {
    return {
      ok: false,
      status: 400,
      data: { error: "answers object is required" },
    };
  }

  const base = String(apiBase ?? getWeb3eduBackendUrl()).replace(/\/$/, "");

  try {
    const res = await fetch(`${base}/learning-modules/lm08/contract-inspection`, {
      method: "POST",
      headers: buildLabWriteAuthHeaders(token),
      body: JSON.stringify({ answers }),
    });
    const data = await res.json().catch(() => ({}));
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
