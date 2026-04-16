import { ethers } from "ethers";

/**
 * Returns checksummed EIP-55 address or null if invalid / empty.
 */
export function normalizeEvmAddress(value) {
  if (value == null || typeof value !== "string") return null;
  const t = value.trim();
  if (!/^0x[a-fA-F0-9]{40}$/i.test(t)) return null;
  try {
    return ethers.getAddress(t);
  } catch {
    return null;
  }
}
