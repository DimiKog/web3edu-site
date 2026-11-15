import { ethers } from "ethers";
import {
  resolveIdentity as defaultResolveIdentity,
  resolveIdentityV2 as defaultResolveIdentityV2,
} from "../api/aa.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import {
  pickSmartAccountFromPayload,
  resolveIndicatesMintedIdentity,
} from "./aaResolvePayload.js";
import { classifyOwnerResolveForWalletContinue } from "./joinWalletContinueDecision.js";

/**
 * @param {{ signal?: AbortSignal, isOperationFresh?: () => boolean }} opts
 * @returns {'ok' | 'stale' | 'aborted'}
 */
function evaluateProvisionFreshness({ signal, isOperationFresh } = {}) {
  if (signal?.aborted) return "aborted";
  if (typeof isOperationFresh === "function" && !isOperationFresh()) return "stale";
  return "ok";
}

/**
 * Owner-only AA resolve → persist minted wallet-backed identity (same contract as
 * {@link ../components/IdentityAaRestore.jsx} and import-on-Join).
 *
 * Mutations run only while {@link opts.isOperationFresh} (and AbortSignal) remain valid.
 *
 * @param {string} ownerRaw — checksummed or hex EOA
 * @param {(patch: object) => void} setIdentity — IdentityContext setter
 * @param {{
 *   signal?: AbortSignal,
 *   isOperationFresh?: () => boolean,
 *   resolveIdentity?: Function,
 *   resolveIdentityV2?: Function,
 * }} [opts]
 * @returns {Promise<'minted' | 'not_minted' | 'invalid_owner' | 'resolve_failed' | 'stale' | 'aborted'>}
 */
export async function tryProvisionMintedWalletIdentityFromOwner(
  ownerRaw,
  setIdentity,
  opts = {}
) {
  const {
    signal,
    isOperationFresh,
    resolveIdentity: resolveOwner = defaultResolveIdentity,
    resolveIdentityV2: resolveV2 = defaultResolveIdentityV2,
  } = opts;
  const ownerNorm = normalizeEvmAddress(ownerRaw);
  if (!ownerNorm) return "invalid_owner";

  try {
    const first = await resolveOwner({ owner: ownerNorm, signal });
    {
      const gate = evaluateProvisionFreshness({ signal, isOperationFresh });
      if (gate !== "ok") return gate;
    }
    const firstStatus = classifyOwnerResolveForWalletContinue(first);
    if (firstStatus === "resolve_failed") return "resolve_failed";
    if (firstStatus === "not_minted") return "not_minted";

    let anchor = normalizeEvmAddress(first?.identityAddress ?? first?.smartAccount);
    if (!anchor) {
      anchor = normalizeEvmAddress(pickSmartAccountFromPayload(first));
    }
    if (!anchor) return "not_minted";

    const finalResolved = await resolveV2({ address: anchor, signal });
    {
      const gate = evaluateProvisionFreshness({ signal, isOperationFresh });
      if (gate !== "ok") return gate;
    }
    if (!finalResolved || !resolveIndicatesMintedIdentity(finalResolved)) {
      return "not_minted";
    }

    const smartAccount = normalizeEvmAddress(pickSmartAccountFromPayload(finalResolved));
    if (!smartAccount) return "not_minted";

    let ownerChecksummed = ownerNorm;
    try {
      ownerChecksummed = ethers.getAddress(ownerNorm);
    } catch {
      ownerChecksummed = ownerNorm;
    }

    {
      const gate = evaluateProvisionFreshness({ signal, isOperationFresh });
      if (gate !== "ok") return gate;
    }

    setIdentity({
      owner: ownerChecksummed,
      smartAccount,
      hasIdentity: true,
      version: finalResolved?.version ?? "aa",
      tokenId: finalResolved?.tokenId ?? finalResolved?.token_id ?? null,
      alreadyMinted: true,
      signerType: "eoa",
    });

    return "minted";
  } catch (e) {
    if (e?.name === "AbortError" || signal?.aborted) {
      return "aborted";
    }
    throw e;
  }
}

/**
 * Join "Continue with connected wallet" — provision then navigate only while fresh.
 *
 * @param {{
 *   ownerRaw: string,
 *   setIdentity: (patch: object) => void,
 *   navigateDashboard: () => void,
 *   navigateMint: () => void,
 *   isOperationFresh?: () => boolean,
 *   signal?: AbortSignal,
 *   resolveIdentity?: Function,
 *   resolveIdentityV2?: Function,
 * }} args
 */
export async function runJoinWalletContinueFlow({
  ownerRaw,
  setIdentity,
  navigateDashboard,
  navigateMint,
  isOperationFresh,
  signal,
  resolveIdentity,
  resolveIdentityV2,
} = {}) {
  const status = await tryProvisionMintedWalletIdentityFromOwner(ownerRaw, setIdentity, {
    signal,
    isOperationFresh,
    resolveIdentity,
    resolveIdentityV2,
  });

  if (status === "stale" || status === "aborted") {
    return { status };
  }
  {
    const gate = evaluateProvisionFreshness({ signal, isOperationFresh });
    if (gate !== "ok") return { status: gate, provisionStatus: status };
  }
  if (status === "minted") {
    navigateDashboard?.();
    return { status };
  }
  if (status === "not_minted") {
    navigateMint?.();
    return { status };
  }
  return { status };
}
