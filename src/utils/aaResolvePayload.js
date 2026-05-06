/** Shared shapes for POST /aa/identity/resolve (Join, PageShell shell connect, etc.). */

export function pickSmartAccountFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  return (
    payload.smartAccount ??
    payload.smartAccountAddress ??
    payload.identityAddress ??
    payload.account ??
    payload.tokenHolder ??
    null
  );
}

export function resolveIndicatesMintedIdentity(resolved) {
  return Boolean(
    resolved &&
      (resolved.alreadyMinted === true ||
        resolved.tokenId != null ||
        resolved.token_id != null)
  );
}
