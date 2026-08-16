/**
 * Generic EIP-712 typed-data signing for H3C wallet binding.
 * Prefers wagmi/viem signTypedDataAsync; falls back to eth_signTypedData_v4.
 * Not MetaMask-specific — works with any EIP-712 capable provider (incl. BesuWallet).
 */

/**
 * @param {object} typedData server typedData from /web3edu/identity/link/challenge
 * @param {{ signTypedDataAsync?: Function, account?: string|null }} opts
 * @returns {Promise<string>} signature hex
 */
export async function signEip712TypedData(typedData, { signTypedDataAsync, account } = {}) {
  if (!typedData || typeof typedData !== "object") {
    throw new Error("typedData is required");
  }
  const domain = typedData.domain;
  const message = typedData.message;
  const primaryType = typedData.primaryType;
  const rawTypes = typedData.types;
  if (!domain || !message || !primaryType || !rawTypes) {
    throw new Error("typedData is incomplete");
  }

  // viem/wagmi: omit EIP712Domain from types (domain is separate).
  const types = { ...rawTypes };
  delete types.EIP712Domain;

  if (typeof signTypedDataAsync === "function") {
    return await signTypedDataAsync({
      domain,
      types,
      primaryType,
      message,
      account: account || undefined,
    });
  }

  const provider = typeof window !== "undefined" ? window.ethereum : null;
  if (!provider?.request) {
    throw new Error("No EIP-712 signer available");
  }
  const from =
    account ||
    (await provider.request({ method: "eth_requestAccounts" }).then((a) => a?.[0]));
  if (!from) {
    throw new Error("No wallet account for EIP-712 signing");
  }

  // eth_signTypedData_v4 expects the full JSON including EIP712Domain in types.
  const full = {
    types: rawTypes,
    domain,
    primaryType,
    message,
  };
  return await provider.request({
    method: "eth_signTypedData_v4",
    params: [from, JSON.stringify(full)],
  });
}

/**
 * Prepare wagmi-compatible args from server typedData (for tests / callers).
 */
export function typedDataToWagmiArgs(typedData) {
  const types = { ...(typedData?.types || {}) };
  delete types.EIP712Domain;
  return {
    domain: typedData.domain,
    types,
    primaryType: typedData.primaryType,
    message: typedData.message,
  };
}
