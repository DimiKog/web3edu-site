import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getLm05EducationalLedgerCopy,
  participantLabel,
} from "../../content/lm05EducationalLedgerLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  fetchLearningModulesProgression,
  fetchLm05EducationalLedger,
  postLm05EducationalLedgerTransfer,
} from "../../utils/labWriteApi.js";
import {
  PENDING_POOL_PAGE_SIZE,
  clampPoolVisibleCount,
  derivedFromParticipantId,
  nextPoolVisibleCount,
  pendingAssetIds,
  publicTransactionView,
  selectableAssets,
  selectableDestinations,
  sliceVisiblePendingTransactions,
  sortPendingTransactionsNewestFirst,
  stripSubmitterIdentity,
} from "../../utils/lm05EducationalLedgerView.js";
import { LmApprovedVisual } from "./LmVisuals.jsx";

const POOL_VISUAL_SRC =
  "/learning-modules/visuals/lm05/lm05-pending-transaction-pool.png";

function assetLabel(asset) {
  if (!asset) return "—";
  return `${asset.id} — ${asset.label || asset.id}`;
}

export default function Lm05EducationalLedgerPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm05EducationalLedgerCopy(locale);
  const identityArgs = useEducationalIdentityArgs();
  const { refetch: refetchResolvedIdentity } = useResolvedIdentityContext();
  const apiBase = getWeb3eduBackendUrl();
  const hasIdToken = Boolean(identityArgs.idToken);

  const [loading, setLoading] = useState(true);
  const [ledger, setLedger] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [assetId, setAssetId] = useState("");
  const [toParticipantId, setToParticipantId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedTx, setSubmittedTx] = useState(null);
  const [pelSatisfied, setPelSatisfied] = useState(false);
  const [lm05Complete, setLm05Complete] = useState(false);
  const [poolVisibleCount, setPoolVisibleCount] = useState(PENDING_POOL_PAGE_SIZE);

  const refreshProgressionFlags = useCallback(async () => {
    if (!identityArgs.idToken) return;
    try {
      const result = await fetchLearningModulesProgression({
        apiBase,
        idToken: identityArgs.idToken,
      });
      const lm05 = result.data?.progression?.modules?.LM05;
      const pel = lm05?.requiredEvidence?.["lm05-pel-transaction"];
      setPelSatisfied(Boolean(pel?.satisfied));
      setLm05Complete(Boolean(lm05?.complete));
    } catch {
      /* optional */
    }
    try {
      await refetchResolvedIdentity?.();
    } catch {
      /* optional */
    }
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("web3edu-progress-updated"));
      }
    } catch {
      /* optional */
    }
  }, [apiBase, identityArgs.idToken, refetchResolvedIdentity]);

  const loadLedger = useCallback(async () => {
    if (!identityArgs.idToken) {
      setLoading(false);
      setLoadError(copy.signInRequired);
      setLedger(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    const result = await fetchLm05EducationalLedger({
      apiBase,
      idToken: identityArgs.idToken,
    });
    if (!result.ok) {
      setLedger(null);
      setLoadError(copy.loadError);
      setLoading(false);
      return;
    }
    setLedger(stripSubmitterIdentity(result.data));
    setLoading(false);
  }, [apiBase, copy.loadError, copy.signInRequired, identityArgs.idToken]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  useEffect(() => {
    refreshProgressionFlags();
  }, [refreshProgressionFlags]);

  const participants = ledger?.participants || [];
  const assets = ledger?.assets || [];
  const pendingTransactions = ledger?.pendingTransactions || [];
  const sortedPendingTransactions = useMemo(
    () => sortPendingTransactionsNewestFirst(pendingTransactions),
    [pendingTransactions]
  );
  const poolTotalCount = sortedPendingTransactions.length;
  const visiblePendingTransactions = useMemo(
    () =>
      sliceVisiblePendingTransactions(sortedPendingTransactions, poolVisibleCount),
    [sortedPendingTransactions, poolVisibleCount]
  );
  const canShowMorePending = poolVisibleCount < poolTotalCount;

  useEffect(() => {
    setPoolVisibleCount((prev) =>
      clampPoolVisibleCount(prev, poolTotalCount, PENDING_POOL_PAGE_SIZE)
    );
  }, [poolTotalCount]);

  const blockedAssets = useMemo(
    () => pendingAssetIds(pendingTransactions),
    [pendingTransactions]
  );
  const availableAssets = useMemo(
    () => selectableAssets(assets, pendingTransactions),
    [assets, pendingTransactions]
  );

  const fromParticipantId = derivedFromParticipantId(assetId, assets);
  const toOptions = useMemo(
    () => selectableDestinations(participants, fromParticipantId),
    [participants, fromParticipantId]
  );

  useEffect(() => {
    if (assetId && blockedAssets.has(assetId)) {
      setAssetId("");
      setToParticipantId("");
    }
  }, [assetId, blockedAssets]);

  useEffect(() => {
    if (toParticipantId && fromParticipantId && toParticipantId === fromParticipantId) {
      setToParticipantId("");
    }
  }, [toParticipantId, fromParticipantId]);

  const selectedAsset = assets.find((a) => a.id === assetId) || null;
  const canSubmit =
    Boolean(assetId) &&
    Boolean(fromParticipantId) &&
    Boolean(toParticipantId) &&
    toParticipantId !== fromParticipantId &&
    !blockedAssets.has(assetId) &&
    !submitting;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || !identityArgs.idToken) return;
    setSubmitting(true);
    setSubmitError(null);

    const result = await postLm05EducationalLedgerTransfer({
      apiBase,
      idToken: identityArgs.idToken,
      assetId,
      toParticipantId,
    });

    if (result.status === 409) {
      setSubmitError(copy.conflictError);
      await loadLedger();
      setSubmitting(false);
      return;
    }

    if (!result.ok) {
      setSubmitError(copy.submitError);
      setSubmitting(false);
      return;
    }

    const tx = publicTransactionView(result.data.transaction);
    setSubmittedTx(tx);
    setAssetId("");
    setToParticipantId("");
    await loadLedger();
    await refreshProgressionFlags();
    setSubmitting(false);
  }

  if (!hasIdToken && !identityArgs.oidcAuthLoading) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        {copy.signInRequired}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.spineLabel}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {copy.spineSteps.map((step, index) => (
            <span key={step.id} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                  →
                </span>
              ) : null}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  step.stopHere
                    ? "bg-emerald-500/15 text-emerald-800 ring-2 ring-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-100"
                    : step.active
                      ? "bg-slate-900/5 text-slate-800 dark:bg-white/10 dark:text-slate-100"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                {step.label}
                {step.stopHere ? " · stop" : ""}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{copy.spineStopNote}</p>
      </section>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          …
        </div>
      ) : null}

      {loadError ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {loadError}
        </p>
      ) : null}

      {ledger ? (
        <>
          <section className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700/60 dark:bg-slate-950/30 sm:p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {copy.contrastStateHeading}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {copy.stateTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {copy.stateSubtitle}
              </p>
            </div>
            <ul className="divide-y divide-slate-200/80 overflow-hidden rounded-xl border border-slate-200/80 dark:divide-slate-700/60 dark:border-slate-700/60">
              {assets.map((asset) => {
                const hasPending = blockedAssets.has(asset.id);
                return (
                  <li
                    key={asset.id}
                    className="flex flex-col gap-1 bg-slate-50/80 px-4 py-3 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {asset.id}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {asset.label}
                      </p>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      <span className="text-slate-500 dark:text-slate-400">
                        {copy.ownerLabel}:{" "}
                      </span>
                      <span className="font-medium">
                        {participantLabel(asset.ownerParticipantId, locale)}
                      </span>
                      {hasPending ? (
                        <span className="mt-1 block text-xs font-medium text-amber-700 dark:text-amber-300">
                          {copy.pendingBadge}
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/60 dark:bg-slate-900/40 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {copy.createTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {copy.createSubtitle}
              </p>
            </div>

            {availableAssets.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {copy.noAssetsAvailable}
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {copy.selectAssetLabel}
                  </span>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                    value={assetId}
                    onChange={(e) => {
                      setAssetId(e.target.value);
                      setToParticipantId("");
                      setSubmitError(null);
                    }}
                  >
                    <option value="">{copy.selectAssetPlaceholder}</option>
                    {availableAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {assetLabel(asset)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="text-sm">
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {copy.fromLabel}
                  </p>
                  <p className="mt-1 rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-2 text-slate-800 dark:border-slate-600 dark:bg-slate-950/60 dark:text-slate-100">
                    {fromParticipantId
                      ? participantLabel(fromParticipantId, locale)
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {copy.fromDerivedNote}
                  </p>
                </div>

                <label className="block text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {copy.toLabel}
                  </span>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                    value={toParticipantId}
                    disabled={!fromParticipantId}
                    onChange={(e) => {
                      setToParticipantId(e.target.value);
                      setSubmitError(null);
                    }}
                  >
                    <option value="">{copy.toPlaceholder}</option>
                    {toOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {participantLabel(p.id, locale)}
                      </option>
                    ))}
                  </select>
                </label>

                {assetId && fromParticipantId && toParticipantId ? (
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                      {copy.previewTitle}
                    </p>
                    <p className="mt-2 text-emerald-900 dark:text-emerald-50">
                      {copy.previewType}
                    </p>
                    <p className="text-emerald-900 dark:text-emerald-50">
                      {copy.successAssetLabel}: {assetLabel(selectedAsset)}
                    </p>
                    <p className="text-emerald-900 dark:text-emerald-50">
                      {copy.fromLabel}: {participantLabel(fromParticipantId, locale)}
                    </p>
                    <p className="text-emerald-900 dark:text-emerald-50">
                      {copy.toLabel}: {participantLabel(toParticipantId, locale)}
                    </p>
                  </div>
                ) : null}

                {submitError ? (
                  <p className="text-sm text-amber-800 dark:text-amber-200">{submitError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:text-slate-950 dark:enabled:hover:bg-emerald-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {copy.submittingLabel}
                    </>
                  ) : (
                    copy.submitLabel
                  )}
                </button>
              </form>
            )}
          </section>

          {submittedTx ? (
            <section className="space-y-3 rounded-2xl border border-emerald-300/70 bg-emerald-50/90 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                  {copy.successTitle}
                </h2>
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/30">
                  {submittedTx.status || copy.poolStatusPill}
                </span>
              </div>
              <dl className="grid gap-2 text-sm text-emerald-950 dark:text-emerald-50 sm:grid-cols-2">
                <div>
                  <dt className="text-emerald-800/80 dark:text-emerald-200/80">
                    {copy.successTxLabel}
                  </dt>
                  <dd className="font-mono text-xs sm:text-sm">{submittedTx.id}</dd>
                </div>
                <div>
                  <dt className="text-emerald-800/80 dark:text-emerald-200/80">
                    {copy.successStatusLabel}
                  </dt>
                  <dd className="font-semibold">{submittedTx.status}</dd>
                </div>
                <div>
                  <dt className="text-emerald-800/80 dark:text-emerald-200/80">
                    {copy.successAssetLabel}
                  </dt>
                  <dd>{submittedTx.assetId}</dd>
                </div>
                <div>
                  <dt className="text-emerald-800/80 dark:text-emerald-200/80">
                    {copy.successFromLabel} → {copy.successToLabel}
                  </dt>
                  <dd>
                    {participantLabel(submittedTx.fromParticipantId, locale)} →{" "}
                    {participantLabel(submittedTx.toParticipantId, locale)}
                  </dd>
                </div>
              </dl>

              {selectedContrast(assets, submittedTx, copy, locale)}

              <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                {copy.successOwnershipNote}
              </p>
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                {copy.successPendingNote}
              </p>
              <p className="border-t border-emerald-300/50 pt-3 text-sm font-semibold text-emerald-950 dark:border-emerald-400/20 dark:text-emerald-50">
                {copy.bridgeQuestion}
              </p>
              {pelSatisfied ? (
                <p className="text-sm text-emerald-900 dark:text-emerald-100">
                  {copy.evidenceSatisfied}
                  {lm05Complete ? ` ${copy.moduleCompleteHint}` : null}
                </p>
              ) : null}
            </section>
          ) : null}

          <figure className="mx-auto max-w-xl px-2 py-4 text-center sm:py-6">
            <LmApprovedVisual
              src={POOL_VISUAL_SRC}
              alt={copy.poolVisualAlt}
              className="mx-auto h-auto w-full max-h-28 sm:max-h-36"
            />
            <figcaption className="mt-3 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {copy.poolVisualCaption}
            </figcaption>
          </figure>

          <section className="space-y-4 rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-slate-100/90 via-cyan-50/50 to-slate-50/80 p-4 dark:border-cyan-500/25 dark:from-slate-950/90 dark:via-cyan-950/35 dark:to-slate-900/70 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700/80 dark:text-cyan-300/80">
                  {copy.contrastPendingHeading}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {copy.poolTitle} ({poolTotalCount})
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {copy.poolSubtitle}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/30">
                {copy.poolStatusPill}
              </span>
            </div>

            {poolTotalCount === 0 ? (
              <p className="rounded-xl border border-dashed border-cyan-200/80 bg-white/50 px-4 py-3 text-sm text-slate-600 dark:border-cyan-500/20 dark:bg-slate-950/40 dark:text-slate-300">
                {copy.poolEmpty}
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {visiblePendingTransactions.map((tx) => {
                    const safe = publicTransactionView(tx);
                    return (
                      <li
                        key={safe.id}
                        className="rounded-xl border border-cyan-200/60 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-cyan-500/20 dark:bg-slate-950/55"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            {safe.id}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
                            {safe.status || copy.poolStatusPill}
                          </span>
                        </div>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white">
                          {copy.poolAssetLabel}: {safe.assetId}
                        </p>
                        <p className="text-slate-700 dark:text-slate-200">
                          {participantLabel(safe.fromParticipantId, locale)} →{" "}
                          {participantLabel(safe.toParticipantId, locale)}
                        </p>
                        {safe.createdAt ? (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {copy.poolCreatedLabel}: {safe.createdAt}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                {canShowMorePending ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPoolVisibleCount((prev) =>
                        nextPoolVisibleCount(
                          prev,
                          poolTotalCount,
                          PENDING_POOL_PAGE_SIZE
                        )
                      )
                    }
                    className="w-full rounded-xl border border-cyan-200/70 bg-white/60 px-4 py-2 text-sm font-medium text-cyan-900 transition hover:bg-white/90 dark:border-cyan-500/25 dark:bg-slate-950/40 dark:text-cyan-100 dark:hover:bg-slate-950/70"
                  >
                    {copy.poolShowMore}
                  </button>
                ) : null}
              </>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function selectedContrast(assets, submittedTx, copy, locale) {
  const asset = assets.find((a) => a.id === submittedTx.assetId);
  if (!asset) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-600/50 dark:bg-slate-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.contrastStateHeading}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
          {asset.id} → {participantLabel(asset.ownerParticipantId, locale)}
        </p>
      </div>
      <div className="rounded-xl border border-amber-300/70 bg-amber-50/80 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-200/80">
          {copy.contrastPendingHeading}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
          {submittedTx.assetId}
          <br />
          {participantLabel(submittedTx.fromParticipantId, locale)} →{" "}
          {participantLabel(submittedTx.toParticipantId, locale)}
        </p>
      </div>
    </div>
  );
}
