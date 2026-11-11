import React, { useCallback, useState } from "react";
import { getWalletAuthProgressCopy } from "../content/walletAuthProgressCopy.js";

/**
 * Minimal wallet-only Dashboard banner (WA-01c2).
 * Hidden for Keycloak / linked-alias / AA / feature-flag-off / active session.
 */
export default function WalletAuthProgressBanner({
  uiState = "hidden",
  onVerify,
  isGR = false,
}) {
  const copy = getWalletAuthProgressCopy(Boolean(isGR));
  const [busy, setBusy] = useState(false);

  const handleVerify = useCallback(async () => {
    if (typeof onVerify !== "function" || busy) return;
    setBusy(true);
    try {
      await onVerify();
    } catch {
      // Error/reason surfaced via uiState from provider; stay public.
    } finally {
      setBusy(false);
    }
  }, [onVerify, busy]);

  if (!uiState || uiState === "hidden") return null;

  const showAction =
    uiState === "prompt" || uiState === "rejected" || uiState === "expired";
  const actionLabel =
    uiState === "expired"
      ? copy.reverifyAction
      : uiState === "rejected"
        ? copy.retryAction
        : copy.verifyAction;

  let title = copy.publicTitle;
  let body = copy.publicBody;
  if (uiState === "signing") {
    title = copy.signingTitle;
    body = copy.signingBody;
  } else if (uiState === "rejected") {
    title = copy.rejectedTitle;
    body = copy.rejectedBody;
  } else if (uiState === "expired") {
    title = copy.expiredTitle;
    body = copy.expiredBody;
  } else if (uiState === "unavailable") {
    title = copy.unavailableTitle;
    body = copy.unavailableBody;
  }

  return (
    <div
      className="rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-3 text-left text-sm text-sky-950 shadow-sm backdrop-blur-sm dark:border-sky-500/35 dark:bg-sky-950/30 dark:text-sky-50 md:px-4"
      role="status"
      data-wallet-auth-ui={uiState}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90 dark:opacity-95">{body}</p>
      {uiState === "signing" || busy ? (
        <p className="mt-3 text-xs animate-pulse opacity-90">{copy.signingTitle}</p>
      ) : null}
      {showAction ? (
        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={busy || uiState === "signing"}
          className="mt-3 inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          {busy ? copy.signingTitle : actionLabel}
        </button>
      ) : null}
    </div>
  );
}
