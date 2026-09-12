import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";

/**
 * EIP-55 checksum without ethers/viem — keeps SocialIdentity (global) off vendor-web3.
 * Mirrors ethers.getAddress: invalid mixed-case checksum → null.
 *
 * Uses @noble/hashes (split into vendor-noble via vite.config) so Rollup does not
 * absorb this shared crypto into vendor-web3.
 */
export function normalizeEvmAddress(value) {
  if (value == null || typeof value !== "string") return null;
  const t = value.trim();
  // Case-insensitive hex body, but ethers.getAddress requires lowercase "0x" prefix.
  if (!/^0x[a-fA-F0-9]{40}$/i.test(t)) return null;
  if (!t.startsWith("0x")) return null;
  try {
    const hex = t.slice(2);
    const lower = hex.toLowerCase();
    const hash = bytesToHex(keccak_256(utf8ToBytes(lower)));
    let out = "0x";
    for (let i = 0; i < 40; i++) {
      out += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
    }
    const mixed = /[A-F]/.test(hex) && /[a-f]/.test(hex);
    if (mixed && t !== out) return null;
    return out;
  } catch {
    return null;
  }
}
