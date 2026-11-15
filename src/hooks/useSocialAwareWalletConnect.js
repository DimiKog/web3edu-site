import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "wagmi";
import { getAccount } from "wagmi/actions";
import { useInjectedWalletConnect } from "./useInjectedWalletConnect.js";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  getSocialIdentityAaAddress,
  hasUsableSocialIdentityPayload,
} from "../utils/socialIdentityPayload.js";
import { resolveIdentity, resolveIdentityV2 } from "../api/aa.js";
import { getSocialAwareWalletConnectFlags } from "../utils/socialAwareWalletConnectDecision.js";
import { runSocialAwareWalletConnectIdentityFlow } from "../utils/socialAwareWalletConnectFlow.js";
import { shouldApplyWalletConnectIdentityMutation } from "../utils/walletConnectIdentityFreshness.js";

/**
 * Injected wallet connect + optional owner→AA resolve for wallet-first restore.
 * When social AA or an active wallet-backed AA identity is already canonical, only
 * connects the browser wallet (session-additive) and navigates to the dashboard.
 *
 * In-flight restores are generation-gated and re-validated against the live wallet /
 * OIDC context after every await so stale responses cannot mutate active identity.
 */
export function useSocialAwareWalletConnect() {
  const navigate = useNavigate();
  const wagmiConfig = useConfig();
  const { connectInjected, isPending } = useInjectedWalletConnect();
  const { smartAccount, setIdentity, identity } = useIdentity();
  const { socialIdentity, isOidcAuthenticated } = useSocialIdentity();

  const opSeqRef = useRef(0);
  const abortRef = useRef(null);
  const liveRef = useRef({
    isOidcAuthenticated: false,
    hasActiveSocialAa: false,
  });

  const hasActiveSocialAa = Boolean(
    isOidcAuthenticated &&
      hasUsableSocialIdentityPayload(socialIdentity) &&
      normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity))
  );

  liveRef.current = {
    isOidcAuthenticated: Boolean(isOidcAuthenticated),
    hasActiveSocialAa,
  };

  // Invalidate in-flight wallet-connect identity ops when auth context changes.
  useEffect(() => {
    opSeqRef.current += 1;
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {
        /* ignore */
      }
      abortRef.current = null;
    }
  }, [isOidcAuthenticated, hasActiveSocialAa]);

  const connectWalletSessionAware = useCallback(
    async (isGr) => {
      await connectInjected();
      const { address: connected } = getAccount(wagmiConfig);
      const ownerNorm = normalizeEvmAddress(connected);
      if (!ownerNorm) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only guard
          console.warn("Skipping wallet-connect resolve — no connected address (user cancelled or no accounts)");
        }
        return false;
      }

      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch {
          /* ignore */
        }
      }
      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      abortRef.current = controller;
      const mySeq = ++opSeqRef.current;
      const requestOidcAuthenticated = Boolean(isOidcAuthenticated);

      const isOperationFresh = () => {
        const liveOwner = normalizeEvmAddress(getAccount(wagmiConfig).address);
        const live = liveRef.current;
        return shouldApplyWalletConnectIdentityMutation({
          operationId: mySeq,
          currentOperationId: opSeqRef.current,
          requestOwner: ownerNorm,
          liveOwner,
          requestOidcAuthenticated,
          liveOidcAuthenticated: live.isOidcAuthenticated,
          liveHasActiveSocialAa: live.hasActiveSocialAa,
        });
      };

      const flags = getSocialAwareWalletConnectFlags({
        persistedSmartAccount: smartAccount,
        identity,
        socialIdentity,
        isOidcAuthenticated,
      });

      /**
       * IMPORTANT: A wallet connect can race with identity persistence. Also, `identity.owner`
       * may already have been overwritten to the newly connected EOA while `smartAccount` still
       * points to a previous minted identity. So we must compare against the backend owner→AA
       * mapping instead of trusting local `identity.owner`.
       */
      const result = await runSocialAwareWalletConnectIdentityFlow({
        ownerNorm,
        isGr: Boolean(isGr),
        flags,
        persistedOwner: identity?.owner ?? null,
        resolveIdentity,
        resolveIdentityV2,
        isOperationFresh,
        applyIdentity: setIdentity,
        navigateTo: (path) => navigate(path),
        signal: controller?.signal,
      });

      if (result.status === "stale" || result.status === "aborted") {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only
          console.debug(
            "[useSocialAwareWalletConnect] Discarded stale/aborted identity operation",
            { status: result.status, ownerNorm }
          );
        }
        return false;
      }

      if (result.status === "session_additive" && import.meta.env.DEV) {
        // eslint-disable-next-line no-console -- dev-only
        console.debug(
          "[useSocialAwareWalletConnect] Wallet connect is session-additive — skipping auto identity switch",
          {
            hasActiveSocialAa: result.decision?.hasActiveSocialAa,
            hasActiveWalletAa: result.decision?.hasActiveWalletAa,
            walletMismatch: result.decision?.walletMismatch,
          }
        );
      }

      return result.status === "session_additive" || result.status === "restored";
    },
    [
      connectInjected,
      wagmiConfig,
      setIdentity,
      navigate,
      smartAccount,
      identity,
      socialIdentity,
      isOidcAuthenticated,
    ]
  );

  return { connectWalletSessionAware, isPending };
}
