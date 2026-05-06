/**
 * Backend may return identity fields at the top level or under `identity`.
 * These helpers read both shapes consistently.
 */

function socialIdentityNestedRecord(data) {
  const nested = data?.identity;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested;
  }
  return null;
}

function pickFromPayloadOrIdentity(data, camel, snake) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const id = socialIdentityNestedRecord(data);
  return (
    data[camel] ??
    data[snake] ??
    id?.[camel] ??
    id?.[snake] ??
    null
  );
}

/** Non-empty trimmed string or null */
export function getSocialIdentityAaAddress(data) {
  const raw = pickFromPayloadOrIdentity(data, "aaAddress", "aa_address");
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

export function hasUsableSocialIdentityPayload(data) {
  return Boolean(getSocialIdentityAaAddress(data));
}

export function getSocialIdentityProvisioningStatus(data) {
  const v = pickFromPayloadOrIdentity(data, "provisioningStatus", "provisioning_status");
  return v ?? null;
}

export function getSocialIdentityCustodyType(data) {
  const v = pickFromPayloadOrIdentity(data, "custodyType", "custody_type");
  return v ?? null;
}

export function getSocialIdentityOwnerAddress(data) {
  const v = pickFromPayloadOrIdentity(data, "ownerAddress", "owner_address");
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export function getSocialIdentityWalletAddress(data) {
  const v = pickFromPayloadOrIdentity(data, "walletAddress", "wallet_address");
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}
