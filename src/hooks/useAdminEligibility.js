import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useAccount } from "wagmi";
import { getIdentityLinkStatus } from "../api/identityLink.js";
import {
  computeAdminEligibility,
  getAdminWalletAllowlist,
} from "../utils/adminEligibility.js";

function getIdTokenFromAuth(auth) {
  const raw = auth?.user?.id_token;
  return typeof raw === "string" && raw.trim() ? raw : null;
}

/**
 * Authoritative admin UI eligibility for the current session.
 *
 * OIDC learners: backend link status ACTIVE bindings only. A live wallet
 * connection is never required, and wagmi values are not forwarded at all so
 * the OIDC path cannot depend on them.
 * Wallet-only sessions: never privileged admin.
 *
 * Resets when OIDC token changes or the user signs out.
 */
export function useAdminEligibility() {
  const auth = useAuth();
  const { address, isConnected } = useAccount();
  const oidcAuthLoading = Boolean(auth?.isLoading);
  const isOidcAuthenticated = Boolean(!oidcAuthLoading && auth?.isAuthenticated);
  const idToken = isOidcAuthenticated ? getIdTokenFromAuth(auth) : null;
  const allowlist = useMemo(
    () => getAdminWalletAllowlist(import.meta.env.VITE_ADMIN_WALLETS),
    []
  );

  const [linkStatus, setLinkStatus] = useState(null);
  const [linkStatusLoaded, setLinkStatusLoaded] = useState(false);
  const lastTokenRef = useRef(null);

  useEffect(() => {
    if (!isOidcAuthenticated || !idToken) {
      setLinkStatus(null);
      setLinkStatusLoaded(false);
      lastTokenRef.current = null;
      return undefined;
    }

    if (lastTokenRef.current !== idToken) {
      setLinkStatus(null);
      setLinkStatusLoaded(false);
      lastTokenRef.current = idToken;
    }

    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const status = await getIdentityLinkStatus(idToken, { signal: controller.signal });
        if (cancelled) return;
        setLinkStatus(status);
      } catch {
        if (cancelled) return;
        setLinkStatus(null);
      } finally {
        if (!cancelled) setLinkStatusLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isOidcAuthenticated, idToken]);

  const { isAdminEligible, adminWalletAddress, pending } = computeAdminEligibility({
    isOidcAuthenticated,
    linkStatus,
    linkStatusLoaded: !isOidcAuthenticated || linkStatusLoaded,
    // OIDC mode is decided solely by backend link status — never by wagmi.
    connectedWalletAddress: isOidcAuthenticated ? null : address,
    isWalletConnected: isOidcAuthenticated ? false : isConnected,
    allowlist,
  });

  return {
    isAdminEligible,
    adminWalletAddress,
    adminEligibilityLoading: pending,
    idToken,
  };
}
