import { participantLabel } from "../../content/lm05EducationalLedgerLocale.js";

/**
 * Read-only Educational Ledger snapshot for inspection / future explorer reuse.
 * Does not fetch or mutate data — presentational only.
 *
 * @param {{
 *   assets?: Array,
 *   participants?: Array,
 *   pendingTransactions?: Array,
 *   copy: Record<string, string>,
 *   locale?: "en"|"gr",
 *   highlightAssetId?: string|null,
 *   highlightParticipantId?: string|null,
 *   highlightTxId?: string|null,
 *   assignedTxId?: string|null,
 *   onInspectAssigned?: ((tx: object) => void)|null,
 *   focusSection?: "current-state"|"participants"|"pending-pool"|null,
 *   inspectorOpen?: boolean,
 *   showInspectTask?: boolean,
 * }} props
 */
export default function EducationalLedgerSnapshot({
  assets = [],
  participants = [],
  pendingTransactions = [],
  copy,
  locale = "en",
  highlightAssetId = null,
  highlightParticipantId = null,
  highlightTxId = null,
  assignedTxId = null,
  onInspectAssigned = null,
  focusSection = null,
  inspectorOpen = false,
  showInspectTask = false,
}) {
  const assetRows = Array.isArray(assets) ? assets : [];
  const participantRows = Array.isArray(participants) ? participants : [];
  const pendingRows = Array.isArray(pendingTransactions) ? pendingTransactions : [];

  function sectionRing(id) {
    return focusSection === id
      ? "ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-transparent"
      : "";
  }

  return (
    <section
      className="space-y-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/60 dark:bg-slate-900/40 sm:p-5"
      data-educational-ledger-snapshot="true"
      data-ledger-visible-during-inspect={inspectorOpen ? "true" : "false"}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {copy.ledgerSnapshotTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {copy.ledgerSnapshotSubtitle}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.ledgerSnapshotLiveBadge}
        </p>
      </div>

      <div
        id="lm06-ledger-current-state"
        data-ledger-section="current-state"
        className={`rounded-xl transition ${sectionRing("current-state")}`}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.ledgerCurrentStateTitle}
        </h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-700/50">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/80 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">{copy.assetLabel}</th>
                <th className="px-3 py-2 font-semibold">
                  {copy.ledgerDescriptionLabel}
                </th>
                <th className="px-3 py-2 font-semibold">
                  {copy.ledgerOwnerColumn}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white/70 dark:divide-slate-700/40 dark:bg-slate-950/40">
              {assetRows.map((asset) => {
                const id = String(asset?.id || "");
                const highlighted = Boolean(
                  highlightAssetId && id === highlightAssetId
                );
                return (
                  <tr
                    key={id || JSON.stringify(asset)}
                    data-asset-row={id}
                    className={
                      highlighted
                        ? "bg-cyan-50/90 dark:bg-cyan-500/15"
                        : undefined
                    }
                  >
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                      {id || "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                      {asset?.label ? String(asset.label) : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                      {participantLabel(asset?.ownerParticipantId, locale)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        id="lm06-ledger-participants"
        data-ledger-section="participants"
        className={`rounded-xl transition ${sectionRing("participants")}`}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.ledgerParticipantsTitle}
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {participantRows.map((p) => {
            const id = String(p?.id || "");
            const highlighted = Boolean(
              highlightParticipantId && id === highlightParticipantId
            );
            return (
              <li
                key={id}
                data-participant-chip={id}
                className={`rounded-full px-3 py-1 text-sm ${
                  highlighted
                    ? "bg-cyan-500/20 font-semibold text-cyan-900 ring-1 ring-cyan-400/40 dark:text-cyan-100"
                    : "bg-white/80 text-slate-800 dark:bg-slate-950/50 dark:text-slate-100"
                }`}
              >
                {participantLabel(id, locale)}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        id="lm06-ledger-pending-pool"
        data-ledger-section="pending-pool"
        className={`rounded-xl transition ${sectionRing("pending-pool")}`}
      >
        {showInspectTask ? (
          <div
            className="mb-3 rounded-xl border border-cyan-300/60 bg-cyan-50/80 px-3 py-2.5 dark:border-cyan-500/30 dark:bg-cyan-950/30"
            data-inspect-task="true"
          >
            <p
              className="text-[11px] font-bold uppercase tracking-wide text-cyan-900 dark:text-cyan-100"
              data-step-inspect="true"
            >
              {copy.stepInspectLabel}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              {copy.taskTitle}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
              {copy.taskInstruction}
            </p>
          </div>
        ) : null}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.ledgerPendingPoolTitle}
        </h3>
        <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200/80 dark:border-slate-700/50">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-white/95 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/95 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">{copy.txLabel}</th>
                <th className="px-3 py-2 font-semibold">{copy.assetLabel}</th>
                <th className="px-3 py-2 font-semibold">{copy.fromLabel}</th>
                <th className="px-3 py-2 font-semibold">{copy.toLabel}</th>
                <th className="px-3 py-2 font-semibold">{copy.statusLabel}</th>
                <th className="px-3 py-2 font-semibold">
                  <span className="sr-only">{copy.inspectButton}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white/70 dark:divide-slate-700/40 dark:bg-slate-950/40">
              {pendingRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-3 text-slate-500 dark:text-slate-400"
                  >
                    {copy.ledgerPendingEmpty}
                  </td>
                </tr>
              ) : (
                pendingRows.map((tx) => {
                  const id = String(tx?.id || "");
                  const isAssigned = Boolean(assignedTxId && id === assignedTxId);
                  const highlighted = Boolean(
                    highlightTxId && id === highlightTxId
                  );
                  const canLaunch =
                    isAssigned && typeof onInspectAssigned === "function";
                  const showInspecting = Boolean(inspectorOpen && isAssigned);
                  const canInspect = canLaunch && !showInspecting;

                  return (
                    <tr
                      key={id || JSON.stringify(tx)}
                      data-pending-row={id}
                      data-assigned={isAssigned ? "true" : "false"}
                      data-validity-hint="none"
                      className={`${
                        highlighted
                          ? "bg-cyan-50/90 dark:bg-cyan-500/15"
                          : isAssigned
                            ? "bg-violet-50/50 dark:bg-violet-500/10"
                            : ""
                      } ${canLaunch ? "cursor-pointer" : ""}`}
                      onClick={
                        canLaunch
                          ? () => onInspectAssigned(tx)
                          : undefined
                      }
                      onKeyDown={
                        canLaunch
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onInspectAssigned(tx);
                              }
                            }
                          : undefined
                      }
                      tabIndex={canLaunch ? 0 : undefined}
                      role={canLaunch ? "button" : undefined}
                      aria-label={
                        canLaunch
                          ? `${showInspecting ? copy.inspectingButton : copy.inspectButton}: ${id}`
                          : undefined
                      }
                    >
                      <td className="px-3 py-2 font-mono text-xs text-slate-700 dark:text-slate-200">
                        <span className="inline-flex flex-wrap items-center gap-1.5">
                          {id || "—"}
                          {isAssigned ? (
                            <span
                              className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-900 dark:text-violet-100"
                              data-assigned-badge="true"
                            >
                              {copy.assignedBadge}
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                        {tx?.assetId != null ? String(tx.assetId) : "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                        {participantLabel(tx?.fromParticipantId, locale)}
                      </td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                        {participantLabel(tx?.toParticipantId, locale)}
                      </td>
                      <td className="px-3 py-2 font-medium text-amber-800 dark:text-amber-200">
                        {tx?.status != null ? String(tx.status) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {canInspect ? (
                          <button
                            type="button"
                            className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-violet-500 dark:text-slate-950 dark:hover:bg-violet-400"
                            data-inspect-assigned="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectAssigned(tx);
                            }}
                          >
                            {copy.inspectButton}
                          </button>
                        ) : showInspecting && canLaunch ? (
                          <button
                            type="button"
                            className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-900 dark:text-violet-100"
                            data-inspecting-state="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectAssigned(tx);
                            }}
                          >
                            {copy.inspectingButton}
                          </button>
                        ) : showInspecting ? (
                          <span
                            className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-900 dark:text-violet-100"
                            data-inspecting-state="true"
                          >
                            {copy.inspectingButton}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
