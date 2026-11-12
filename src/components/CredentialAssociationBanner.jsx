import React, { useCallback, useState } from "react";
import { getCredentialAssociationCopy } from "../content/credentialAssociationCopy.js";
import { CREDENTIAL_ASSOCIATION_UI } from "../utils/credentialAssociationFlow.js";

/**
 * Minimal wallet-first credential association banner (IC-03A).
 * Hidden for social-linked / feature-flag-off / ineligible learners.
 * Never auto-signs — requires explicit CTA.
 */
export default function CredentialAssociationBanner({
  uiState = CREDENTIAL_ASSOCIATION_UI.HIDDEN,
  onAssociate,
  isGR = false,
}) {
  const copy = getCredentialAssociationCopy(Boolean(isGR));
  const [busy, setBusy] = useState(false);

  const handleAssociate = useCallback(async () => {
    if (typeof onAssociate !== "function" || busy) return;
    setBusy(true);
    try {
      await onAssociate();
    } catch {
      // Error/reason surfaced via uiState from hook.
    } finally {
      setBusy(false);
    }
  }, [onAssociate, busy]);

  if (!uiState || uiState === CREDENTIAL_ASSOCIATION_UI.HIDDEN) return null;

  const showAction =
    uiState === CREDENTIAL_ASSOCIATION_UI.PROMPT ||
    uiState === CREDENTIAL_ASSOCIATION_UI.REJECTED ||
    uiState === CREDENTIAL_ASSOCIATION_UI.EXPIRED;

  const actionLabel =
    uiState === CREDENTIAL_ASSOCIATION_UI.EXPIRED
      ? copy.reverifyAction
      : uiState === CREDENTIAL_ASSOCIATION_UI.REJECTED
        ? copy.retryAction
        : copy.verifyAction;

  let title = copy.promptTitle;
  let body = copy.promptBody;
  if (uiState === CREDENTIAL_ASSOCIATION_UI.SIGNING) {
    title = copy.signingTitle;
    body = copy.signingBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.REJECTED) {
    title = copy.rejectedTitle;
    body = copy.rejectedBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.EXPIRED) {
    title = copy.expiredTitle;
    body = copy.expiredBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.VERIFIED) {
    title = copy.verifiedTitle;
    body = copy.verifiedBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.MISSING_CREDENTIAL) {
    title = copy.missingTitle;
    body = copy.missingBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.WRONG_WALLET) {
    title = copy.wrongWalletTitle;
    body = copy.wrongWalletBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.WRONG_NETWORK) {
    title = copy.wrongNetworkTitle;
    body = copy.wrongNetworkBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.RPC_UNAVAILABLE) {
    title = copy.rpcTitle;
    body = copy.rpcBody;
  } else if (uiState === CREDENTIAL_ASSOCIATION_UI.UNAVAILABLE) {
    title = copy.unavailableTitle;
    body = copy.unavailableBody;
  }

  return (
    <div
      className="rounded-2xl border border-teal-200/80 bg-teal-50/90 px-4 py-3 text-left text-sm text-teal-950 shadow-sm backdrop-blur-sm dark:border-teal-500/35 dark:bg-teal-950/30 dark:text-teal-50 md:px-4"
      role="status"
      data-credential-association-ui={uiState}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90 dark:opacity-95">{body}</p>
      {uiState === CREDENTIAL_ASSOCIATION_UI.SIGNING || busy ? (
        <p className="mt-3 text-xs animate-pulse opacity-90">{copy.signingTitle}</p>
      ) : null}
      {showAction ? (
        <button
          type="button"
          onClick={() => void handleAssociate()}
          disabled={busy || uiState === CREDENTIAL_ASSOCIATION_UI.SIGNING}
          className="mt-3 inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
          data-credential-association-action="associate"
        >
          {busy ? copy.signingTitle : actionLabel}
        </button>
      ) : null}
    </div>
  );
}
