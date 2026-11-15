/**
 * Production orchestration for post-connect identity gate + restore.
 * Side effects (setIdentity / navigate) run only while {@link isOperationFresh} is true.
 */

import { ethers } from "ethers";
import { normalizeEvmAddress } from "./evmAddress.js";
import {
  pickSmartAccountFromPayload,
  resolveIndicatesMintedIdentity,
} from "./aaResolvePayload.js";
import {
  decideSocialAwareWalletConnectAction,
  resolveMappedAaFromOwnerLookup,
} from "./socialAwareWalletConnectDecision.js";

/**
 * @param {{
 *   ownerNorm: string,
 *   isGr?: boolean,
 *   flags: object,
 *   persistedOwner?: string|null,
 *   resolveIdentity: Function,
 *   resolveIdentityV2: Function,
 *   isOperationFresh: () => boolean,
 *   applyIdentity: (patch: object) => void,
 *   navigateTo: (path: string) => void,
 *   signal?: AbortSignal,
 * }} args
 */
export async function runSocialAwareWalletConnectIdentityFlow({
  ownerNorm,
  isGr = false,
  flags,
  persistedOwner = null,
  resolveIdentity,
  resolveIdentityV2,
  isOperationFresh,
  applyIdentity,
  navigateTo,
  signal,
} = {}) {
  const dash = isGr ? "/dashboard-gr" : "/dashboard";
  const join = isGr ? "/join-gr" : "/join";

  if (!isOperationFresh()) return { status: "stale" };

  let ownerLookupOutcome = { kind: "skipped" };
  if (flags?.shouldLookupOwnerMapping) {
    try {
      const ownerLookup = await resolveIdentity({ owner: ownerNorm, signal });
      if (!isOperationFresh()) return { status: "stale" };
      ownerLookupOutcome = {
        kind: "success",
        mapped: resolveMappedAaFromOwnerLookup(ownerLookup),
      };
    } catch (e) {
      if (e?.name === "AbortError" || signal?.aborted) {
        return { status: "aborted" };
      }
      if (!isOperationFresh()) return { status: "stale" };
      ownerLookupOutcome = { kind: "error" };
    }
  }

  if (!isOperationFresh()) return { status: "stale" };

  const decision = decideSocialAwareWalletConnectAction({
    ownerNorm,
    persistedOwner,
    hasActiveSocialAa: flags.hasActiveSocialAa,
    hasActiveWalletAa: flags.hasActiveWalletAa,
    persistedSc: flags.persistedSc,
    ownerLookupOutcome,
  });

  if (decision.mode === "session_additive") {
    if (!isOperationFresh()) return { status: "stale" };
    navigateTo(dash);
    return { status: "session_additive", decision };
  }

  if (decision.mode === "mismatch_clear_then_resolve" && decision.clearedIdentity) {
    if (!isOperationFresh()) return { status: "stale" };
    applyIdentity(decision.clearedIdentity);
  }

  try {
    if (!isOperationFresh()) return { status: "stale" };
    const first = await resolveIdentity({ owner: ownerNorm, signal });
    if (!isOperationFresh()) return { status: "stale" };

    if (!first) {
      navigateTo(join);
      return { status: "join", reason: "owner_resolve_null", decision };
    }

    let anchor = normalizeEvmAddress(first?.identityAddress ?? first?.smartAccount);
    if (!anchor) {
      anchor = normalizeEvmAddress(pickSmartAccountFromPayload(first));
    }
    if (!anchor) {
      if (!isOperationFresh()) return { status: "stale" };
      navigateTo(join);
      return { status: "join", reason: "no_anchor", decision };
    }

    const finalResolved = await resolveIdentityV2({
      address: anchor,
      signal,
    });
    if (!isOperationFresh()) return { status: "stale" };

    if (!finalResolved) {
      navigateTo(join);
      return { status: "join", reason: "final_resolve_null", decision };
    }
    if (!resolveIndicatesMintedIdentity(finalResolved)) {
      navigateTo(join);
      return { status: "join", reason: "not_minted", decision };
    }

    const rawSc = pickSmartAccountFromPayload(finalResolved);
    const smartAccountResolved = normalizeEvmAddress(rawSc);
    if (!smartAccountResolved) {
      navigateTo(join);
      return { status: "join", reason: "no_smart_account", decision };
    }

    let ownerChecksummed = ownerNorm;
    try {
      ownerChecksummed = ethers.getAddress(ownerNorm);
    } catch {
      ownerChecksummed = ownerNorm;
    }

    if (!isOperationFresh()) return { status: "stale" };

    applyIdentity({
      owner: ownerChecksummed,
      smartAccount: smartAccountResolved,
      hasIdentity: true,
      version: finalResolved?.version ?? "aa",
      tokenId: finalResolved?.tokenId ?? finalResolved?.token_id ?? null,
      alreadyMinted: true,
      signerType: "eoa",
    });
    navigateTo(dash);
    return {
      status: "restored",
      decision,
      smartAccount: smartAccountResolved,
      owner: ownerChecksummed,
    };
  } catch (e) {
    if (e?.name === "AbortError" || signal?.aborted) {
      return { status: "aborted" };
    }
    if (!isOperationFresh()) return { status: "stale" };
    navigateTo(join);
    return { status: "join", reason: "resolve_threw", decision, error: e };
  }
}
