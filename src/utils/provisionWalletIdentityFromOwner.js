import { ethers } from "ethers";
import { resolveIdentity, resolveIdentityV2 } from "../api/aa.js";
import { normalizeEvmAddress } from "./evmAddress.js";
import {
  pickSmartAccountFromPayload,
  resolveIndicatesMintedIdentity,
} from "./aaResolvePayload.js";

/**
 * Owner-only AA resolve → persist minted wallet-backed identity (same contract as
 * {@link ../components/IdentityAaRestore.jsx} and import-on-Join).
 *
 * @param {string} ownerRaw — checksummed or hex EOA
 * @param {(patch: object) => void} setIdentity — IdentityContext setter
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<'minted' | 'not_minted' | 'invalid_owner' | 'resolve_failed'>}
 */
export async function tryProvisionMintedWalletIdentityFromOwner(
  ownerRaw,
  setIdentity,
  opts = {}
) {
  const { signal } = opts;
  const ownerNorm = normalizeEvmAddress(ownerRaw);
  if (!ownerNorm) return "invalid_owner";

  const first = await resolveIdentity({ owner: ownerNorm, signal });
  if (!first) return "resolve_failed";

  let anchor = normalizeEvmAddress(first?.identityAddress ?? first?.smartAccount);
  if (!anchor) {
    anchor = normalizeEvmAddress(pickSmartAccountFromPayload(first));
  }
  if (!anchor) return "resolve_failed";

  const finalResolved = await resolveIdentityV2({ address: anchor, signal });
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
}
