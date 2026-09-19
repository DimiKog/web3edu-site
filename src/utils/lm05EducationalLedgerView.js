/**
 * Pure helpers for LM05 Educational Ledger learner UI.
 * No network, no evidence writes.
 */

/** Progressive disclosure page size for the shared PENDING pool (frontend-only). */
export const PENDING_POOL_PAGE_SIZE = 5;

/**
 * @param {Array<{ assetId?: string, status?: string }>} pendingTransactions
 * @returns {Set<string>}
 */
export function pendingAssetIds(pendingTransactions) {
  const ids = new Set();
  if (!Array.isArray(pendingTransactions)) return ids;
  for (const tx of pendingTransactions) {
    if (!tx || typeof tx !== "object") continue;
    if (String(tx.status || "") !== "PENDING") continue;
    const assetId = String(tx.assetId || "").trim();
    if (assetId) ids.add(assetId);
  }
  return ids;
}

/**
 * @param {Array<{ id: string, label?: string, ownerParticipantId: string }>} assets
 * @param {Array} pendingTransactions
 */
export function selectableAssets(assets, pendingTransactions) {
  const blocked = pendingAssetIds(pendingTransactions);
  if (!Array.isArray(assets)) return [];
  return assets.filter((asset) => asset?.id && !blocked.has(asset.id));
}

/**
 * @param {string|null|undefined} assetId
 * @param {Array<{ id: string, ownerParticipantId: string }>} assets
 */
export function derivedFromParticipantId(assetId, assets) {
  if (!assetId || !Array.isArray(assets)) return null;
  const asset = assets.find((a) => a?.id === assetId);
  return asset?.ownerParticipantId ? String(asset.ownerParticipantId) : null;
}

/**
 * Destination options exclude current owner.
 * @param {Array<{ id: string }>} participants
 * @param {string|null|undefined} fromParticipantId
 */
export function selectableDestinations(participants, fromParticipantId) {
  if (!Array.isArray(participants)) return [];
  const from = fromParticipantId ? String(fromParticipantId) : null;
  return participants.filter((p) => p?.id && p.id !== from);
}

/**
 * Strip any accidental submitter identity from a ledger/API payload view.
 * @param {unknown} value
 */
export function stripSubmitterIdentity(value) {
  if (Array.isArray(value)) {
    return value.map(stripSubmitterIdentity);
  }
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    if (key === "submittedByProgressAddress") continue;
    out[key] = stripSubmitterIdentity(entry);
  }
  return out;
}

/**
 * Build a learner-safe public transaction object for display.
 * @param {Record<string, unknown>|null|undefined} tx
 */
export function publicTransactionView(tx) {
  if (!tx || typeof tx !== "object") return null;
  return {
    id: tx.id ?? null,
    type: tx.type ?? "TRANSFER",
    assetId: tx.assetId ?? null,
    fromParticipantId: tx.fromParticipantId ?? null,
    toParticipantId: tx.toParticipantId ?? null,
    status: tx.status ?? null,
    createdAt: tx.createdAt ?? null,
  };
}

function createdAtSortKey(tx) {
  const raw = tx?.createdAt;
  if (typeof raw !== "string" || !raw.trim()) return Number.NEGATIVE_INFINITY;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : Number.NEGATIVE_INFINITY;
}

/**
 * Newest-first copy of the PENDING pool. Does not mutate the input array.
 * @param {unknown} pendingTransactions
 * @returns {Array}
 */
export function sortPendingTransactionsNewestFirst(pendingTransactions) {
  if (!Array.isArray(pendingTransactions)) return [];
  return [...pendingTransactions].sort(
    (a, b) => createdAtSortKey(b) - createdAtSortKey(a)
  );
}

/**
 * Keep progressive-disclosure visible count within [0, total], preferring at
 * least min(pageSize, total) when the pool is non-empty.
 * @param {number} visibleCount
 * @param {number} totalCount
 * @param {number} [pageSize]
 */
export function clampPoolVisibleCount(
  visibleCount,
  totalCount,
  pageSize = PENDING_POOL_PAGE_SIZE
) {
  const total = Math.max(0, Number(totalCount) || 0);
  const size = Math.max(1, Number(pageSize) || PENDING_POOL_PAGE_SIZE);
  if (total === 0) return 0;
  const prev = Math.max(0, Number(visibleCount) || 0);
  const floor = Math.min(size, total);
  return Math.min(Math.max(prev, floor), total);
}

/**
 * Next visible count after a "Show more" click.
 * @param {number} visibleCount
 * @param {number} totalCount
 * @param {number} [pageSize]
 */
export function nextPoolVisibleCount(
  visibleCount,
  totalCount,
  pageSize = PENDING_POOL_PAGE_SIZE
) {
  const total = Math.max(0, Number(totalCount) || 0);
  const size = Math.max(1, Number(pageSize) || PENDING_POOL_PAGE_SIZE);
  const prev = Math.max(0, Number(visibleCount) || 0);
  return Math.min(prev + size, total);
}

/**
 * @param {Array} sortedPending
 * @param {number} visibleCount
 */
export function sliceVisiblePendingTransactions(sortedPending, visibleCount) {
  if (!Array.isArray(sortedPending)) return [];
  const n = Math.max(0, Number(visibleCount) || 0);
  return sortedPending.slice(0, n);
}
