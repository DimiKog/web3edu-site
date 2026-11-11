/**
 * WA-01c1/c2 — in-memory wallet authentication session for wallet-only EOA.
 *
 * ResolvedIdentityProvider selects this Bearer for wallet-only resolve (WA-01c2).
 * Does NOT authenticate linked-alias, device AA, or OIDC modes.
 * Does NOT auto-sign on wallet connect — callers must invoke authenticate().
 *
 * Session lives in React memory only (via createWalletAuthSessionController).
 * Never writes token to web storage, cookies, or browser databases.
 * Never logs token or signature.
 *
 * WA-01e2.1: chain authority is useAccount().chainId (connected wallet), not
 * wagmi config useChainId, so unsupported-chain switches invalidate auth.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import {
  WALLET_AUTH_CHAIN_ID,
  WALLET_AUTH_REASON,
  createWalletAuthSessionController,
  getWalletAuthEligibility,
  isWalletAuthFrontendEnabled,
  normalizeWalletChainId,
  resolveConnectedWalletChainId,
} from "../utils/walletAuthFlow.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

function readBrowserOrigin() {
  if (typeof window === "undefined" || !window.location?.origin) return null;
  return window.location.origin;
}

/**
 * @param {object} [options]
 * @param {boolean} [options.isOidcAuthenticated]
 * @param {string|null} [options.viewerSource]
 * @param {string|null} [options.walletEntryStatus]
 * @param {string|null} [options.walletEntryMode]
 * @param {boolean} [options.walletOnlyModeEstablished]
 * @param {string|null} [options.expectedOrigin] defaults to window.location.origin
 * @param {boolean} [options.enabled] extra gate (default true); still requires VITE flag
 */
export function useWalletAuthSession(options = {}) {
  const {
    isOidcAuthenticated = false,
    viewerSource = null,
    walletEntryStatus = null,
    walletEntryMode = null,
    walletOnlyModeEstablished = false,
    expectedOrigin: expectedOriginOpt = null,
    enabled = true,
  } = options;

  const { address, isConnected, chainId: accountChainId } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const chainId = useMemo(
    () =>
      resolveConnectedWalletChainId({
        accountChainId: accountChainId ?? null,
      }),
    [accountChainId]
  );

  const addressRef = useRef(address);
  addressRef.current = address;
  const chainIdRef = useRef(chainId);
  chainIdRef.current = chainId;

  const controllerRef = useRef(null);
  if (!controllerRef.current) {
    controllerRef.current = createWalletAuthSessionController();
  }
  const controller = controllerRef.current;

  const [snap, setSnap] = useState(() => controller.getSnapshot());
  const [error, setError] = useState(null);

  useEffect(() => controller.subscribe(setSnap), [controller]);

  const walletAddress = useMemo(
    () => (isConnected ? normalizeEvmAddress(address) : null),
    [isConnected, address]
  );

  const frontendEnabled = isWalletAuthFrontendEnabled() && enabled !== false;

  const eligibility = useMemo(
    () =>
      getWalletAuthEligibility({
        isOidcAuthenticated,
        isConnected: Boolean(isConnected && walletAddress),
        chainId: chainId ?? null,
        viewerSource,
        walletEntryStatus,
        walletEntryMode,
        walletOnlyModeEstablished,
      }),
    [
      isOidcAuthenticated,
      isConnected,
      walletAddress,
      chainId,
      viewerSource,
      walletEntryStatus,
      walletEntryMode,
      walletOnlyModeEstablished,
    ]
  );

  const prevWalletRef = useRef(walletAddress);
  const prevChainRef = useRef(chainId);
  const prevConnectedRef = useRef(isConnected);

  // Lifecycle: disconnect / address change / chain change clear memory session.
  useEffect(() => {
    const prevWallet = prevWalletRef.current;
    const prevChain = prevChainRef.current;
    const prevConnected = prevConnectedRef.current;

    if (prevConnected && !isConnected) {
      controller.onDisconnect();
    } else if (prevWallet && walletAddress && prevWallet !== walletAddress) {
      controller.onWalletAddressChange(walletAddress, prevWallet);
    } else if (!walletAddress && prevWallet) {
      controller.onDisconnect();
    }

    const prevNorm = normalizeWalletChainId(prevChain);
    const nextNorm = normalizeWalletChainId(chainId);
    if (prevNorm !== nextNorm) {
      // Any connected-chain change (incl. → unknown / → Edu-Net) invalidates.
      // Returning to 424242 must not restore the prior session.
      controller.onChainChange(nextNorm);
    }

    prevWalletRef.current = walletAddress;
    prevChainRef.current = chainId;
    prevConnectedRef.current = isConnected;
  }, [controller, isConnected, walletAddress, chainId]);

  // Immediate invalidation on provider chainChanged (before React/wagmi re-render)
  // so in-flight authenticate cannot commit after the wallet leaves Edu-Net.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const eth = window.ethereum;
    if (!eth || typeof eth.on !== "function") return undefined;

    const onProviderChainChanged = (hexOrId) => {
      const prev = normalizeWalletChainId(chainIdRef.current);
      const next = resolveConnectedWalletChainId({
        accountChainId: hexOrId,
        providerChainId: hexOrId,
      });
      // Keep mid-flow checks honest before React re-renders.
      chainIdRef.current = next;
      if (prev === next) return;
      // Immediate generation bump; React effect still reconciles eligibility UI.
      controller.onChainChange(next);
    };

    eth.on("chainChanged", onProviderChainChanged);
    return () => {
      if (typeof eth.removeListener === "function") {
        eth.removeListener("chainChanged", onProviderChainChanged);
      } else if (typeof eth.off === "function") {
        eth.off("chainChanged", onProviderChainChanged);
      }
    };
  }, [controller]);

  // Soft expiration check on tick when a session exists.
  useEffect(() => {
    if (!snap.rawSession) return undefined;
    const id = setInterval(() => {
      controller.checkExpiration();
    }, 15_000);
    controller.checkExpiration();
    return () => clearInterval(id);
  }, [controller, snap.rawSession]);

  const expectedOrigin = expectedOriginOpt || readBrowserOrigin();

  const authenticate = useCallback(
    async ({ allowReauth = false } = {}) => {
      setError(null);

      if (!frontendEnabled) {
        const err = Object.assign(new Error("wallet auth frontend disabled"), {
          reasonCode: WALLET_AUTH_REASON.FRONTEND_DISABLED,
        });
        setError(err);
        throw err;
      }

      if (snap.unavailableReason === WALLET_AUTH_REASON.API_DISABLED) {
        const err = Object.assign(new Error("wallet auth API disabled"), {
          reasonCode: WALLET_AUTH_REASON.API_DISABLED,
        });
        setError(err);
        throw err;
      }

      if (!eligibility.ok) {
        const err = Object.assign(new Error(eligibility.reasonCode), {
          reasonCode: eligibility.reasonCode,
        });
        setError(err);
        throw err;
      }

      if (!walletAddress) {
        const err = Object.assign(new Error("wallet disconnected"), {
          reasonCode: WALLET_AUTH_REASON.WALLET_DISCONNECTED,
        });
        setError(err);
        throw err;
      }

      if (!expectedOrigin) {
        const err = Object.assign(new Error("origin unavailable"), {
          reasonCode: WALLET_AUTH_REASON.ORIGIN_MISMATCH,
        });
        setError(err);
        throw err;
      }

      try {
        return await controller.authenticate({
          walletAddress,
          chainId: chainId ?? WALLET_AUTH_CHAIN_ID,
          expectedOrigin,
          isOidcAuthenticated,
          isConnected: true,
          viewerSource,
          walletEntryStatus,
          walletEntryMode,
          walletOnlyModeEstablished,
          allowReauth,
          getConnectedWallet: () => normalizeEvmAddress(addressRef.current),
          getConnectedChainId: () => chainIdRef.current,
          signTypedDataAsync,
        });
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [
      frontendEnabled,
      snap.unavailableReason,
      eligibility,
      walletAddress,
      expectedOrigin,
      controller,
      chainId,
      isOidcAuthenticated,
      viewerSource,
      walletEntryStatus,
      walletEntryMode,
      walletOnlyModeEstablished,
      signTypedDataAsync,
    ]
  );

  const reauthenticate = useCallback(() => authenticate({ allowReauth: true }), [authenticate]);

  const logout = useCallback(async () => {
    setError(null);
    return controller.logout();
  }, [controller]);

  const clearSession = useCallback(() => {
    setError(null);
    controller.clearSession();
  }, [controller]);

  const invalidateFromAuthError = useCallback(
    (reasonCode) => {
      setError(null);
      controller.invalidateFromAuthError(reasonCode);
    },
    [controller]
  );

  return {
    /** Valid non-expired session, or null. */
    session: snap.session,
    /** Opaque Bearer token for WA-01c2 resolve wiring — null when absent/expired. */
    bearerToken: snap.bearerToken,
    sessionId: snap.session?.sessionId ?? null,
    walletAddress: snap.session?.walletAddress ?? walletAddress,
    expiresAt: snap.session?.expiresAt ?? null,
    isExpired: snap.expired,
    isAuthenticating: snap.authenticating,
    isAuthenticated: Boolean(snap.session),
    isFrontendEnabled: frontendEnabled,
    isAvailable:
      frontendEnabled && snap.unavailableReason !== WALLET_AUTH_REASON.API_DISABLED,
    unavailableReason: snap.unavailableReason,
    sessionInvalidationReason: snap.invalidationReason ?? null,
    canAuthenticate: frontendEnabled && eligibility.ok && !snap.authenticating,
    eligibility,
    /** Connected wallet chain used for auth eligibility (not wagmi config chain). */
    connectedChainId: chainId,
    error,
    authenticate,
    reauthenticate,
    logout,
    clearSession,
    invalidateFromAuthError,
  };
}
