import { buildResolveOwner, getWeb3eduBackendUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "./evmAddress.js";

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
      if (data?.identityKey != null && data?.identityKey !== undefined) {
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
