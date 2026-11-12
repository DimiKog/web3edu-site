/**
 * IC-03A — wallet-first credential association onboarding.
 *
 * Discovers AA-held SBT via backend APIs, shows explicit CTA, runs EIP-712
 * association on user action only. Never persists challenges/signatures.
 * Never mints or creates AA.
 *
 * IC-03B hardening: eligibility requires authoritative backend wallet-only
 * for the connected EOA (not viewerSource alone). Discovery results are
 * generation-gated so disconnect / wallet / chain / eligibility churn cannot
 * apply stale state.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  CREDENTIAL_ASSOCIATION_CHAIN_ID,
  CREDENTIAL_ASSOCIATION_REASON,
  CREDENTIAL_ASSOCIATION_UI,
  assessCredentialAssociationUiState,
  discoverCredentialAssociationContext,
  getConfiguredAaSbtContract,
  getCredentialAssociationEligibility,
  isCredentialAssociationFrontendEnabled,
  refreshAndConfirmIssued,
  runCredentialAssociationFlow,
  shouldApplyCredentialAssociationDiscovery,
} from "../utils/credentialAssociationFlow.js";
import {
  WALLET_ENTRY_LINKED_ALIAS,
  WALLET_ENTRY_WALLET_ONLY,
} from "../utils/walletEntryCanonicalResolve.js";
import {
  normalizeWalletChainId,
  resolveConnectedWalletChainId,
} from "../utils/walletAuthFlow.js";

function readBrowserOrigin() {
  if (typeof window === "undefined" || !window.location?.origin) return null;
  return window.location.origin;
}

/**
 * @param {object} [options]
 * @param {boolean} [options.isOidcAuthenticated]
 * @param {string|null} [options.viewerSource]
 * @param {boolean} [options.isWalletEntryLinkedAlias]
 * @param {string|null} [options.walletEntryStatus]
 * @param {string|null} [options.walletEntryMode]
 * @param {boolean} [options.walletOnlyModeEstablished]
 * @param {() => void|Promise<void>} [options.onAssociated]
 * @param {boolean} [options.enabled]
 */
export function useCredentialAssociationOnboarding(options = {}) {
  const {
    isOidcAuthenticated = false,
    viewerSource = null,
    isWalletEntryLinkedAlias = false,
    walletEntryStatus = null,
    walletEntryMode = null,
    walletOnlyModeEstablished = false,
    onAssociated,
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
  const isConnectedRef = useRef(isConnected);
  isConnectedRef.current = isConnected;

  const walletAddress = useMemo(
    () => (isConnected ? normalizeEvmAddress(address) : null),
    [isConnected, address]
  );

  const frontendEnabled =
    isCredentialAssociationFrontendEnabled() && enabled !== false;

  // Authoritative wallet-entry only — never infer wallet_only from viewerSource.
  const effectiveWalletEntryStatus = isWalletEntryLinkedAlias
    ? WALLET_ENTRY_LINKED_ALIAS
    : walletEntryStatus ?? null;

  const effectiveWalletEntryMode = walletEntryMode ?? null;

  const authoritativeWalletOnly = Boolean(
    walletOnlyModeEstablished === true ||
      effectiveWalletEntryStatus === WALLET_ENTRY_WALLET_ONLY ||
      effectiveWalletEntryMode === "wallet_only"
  );

  const eligibility = useMemo(
    () =>
      getCredentialAssociationEligibility({
        isOidcAuthenticated,
        isConnected: Boolean(isConnected && walletAddress),
        chainId: chainId ?? null,
        viewerSource,
        walletEntryStatus: effectiveWalletEntryStatus,
        walletEntryMode: effectiveWalletEntryMode,
        walletOnlyModeEstablished: authoritativeWalletOnly,
      }),
    [
      isOidcAuthenticated,
      isConnected,
      walletAddress,
      chainId,
      viewerSource,
      effectiveWalletEntryStatus,
      effectiveWalletEntryMode,
      authoritativeWalletOnly,
    ]
  );

  const eligibilityRef = useRef(eligibility);
  eligibilityRef.current = eligibility;

  const [discovery, setDiscovery] = useState(null);
  const [discoveryError, setDiscoveryError] = useState(null);
  const [flowPhase, setFlowPhase] = useState("idle");
  const [flowReasonCode, setFlowReasonCode] = useState(null);

  const discoveryGen = useRef(0);

  const readLiveWallet = useCallback(() => {
    if (!isConnectedRef.current) return null;
    return normalizeEvmAddress(addressRef.current);
  }, []);

  useEffect(() => {
    if (!frontendEnabled || !eligibility.eligible || !walletAddress) {
      discoveryGen.current += 1;
      setDiscovery(null);
      setDiscoveryError(null);
      return undefined;
    }

    const gen = ++discoveryGen.current;
    const requestWallet = walletAddress;
    const requestChainId = chainId ?? null;
    const ac = new AbortController();

    (async () => {
      try {
        const ctx = await discoverCredentialAssociationContext({
          eoaAddress: requestWallet,
          signal: ac.signal,
        });
        if (
          !shouldApplyCredentialAssociationDiscovery({
            generation: gen,
            currentGeneration: discoveryGen.current,
            requestWallet,
            liveWallet: readLiveWallet(),
            requestChainId,
            liveChainId: chainIdRef.current,
            eligible: Boolean(
              eligibilityRef.current?.eligible && frontendEnabled
            ),
          })
        ) {
          return;
        }
        setDiscovery(ctx);
        setDiscoveryError(null);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (
          !shouldApplyCredentialAssociationDiscovery({
            generation: gen,
            currentGeneration: discoveryGen.current,
            requestWallet,
            liveWallet: readLiveWallet(),
            requestChainId,
            liveChainId: chainIdRef.current,
            eligible: Boolean(
              eligibilityRef.current?.eligible && frontendEnabled
            ),
          })
        ) {
          return;
        }
        setDiscovery(null);
        setDiscoveryError(err?.reasonCode || err?.message || "DISCOVERY_FAILED");
      }
    })();

    return () => {
      ac.abort();
      if (discoveryGen.current === gen) {
        discoveryGen.current += 1;
      }
    };
  }, [
    frontendEnabled,
    eligibility.eligible,
    walletAddress,
    chainId,
    readLiveWallet,
  ]);

  // Clear ephemeral flow errors when wallet/chain changes.
  useEffect(() => {
    setFlowPhase("idle");
    setFlowReasonCode(null);
  }, [walletAddress, chainId]);

  const uiAssessment = useMemo(() => {
    if (discoveryError === CREDENTIAL_ASSOCIATION_REASON.API_DISABLED) {
      return {
        uiState: CREDENTIAL_ASSOCIATION_UI.UNAVAILABLE,
        reasonCode: discoveryError,
      };
    }
    if (
      discoveryError === CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE ||
      String(discoveryError).includes("LOOKUP_FAILED")
    ) {
      // Fall through with partial discovery when possible.
    }
    return assessCredentialAssociationUiState({
      frontendEnabled,
      eligibility,
      canonical: discovery?.canonical || null,
      aaCredential: discovery?.aaCredential || null,
      associationLookup: discovery?.associationLookup || null,
      flowPhase,
      flowReasonCode:
        flowReasonCode ||
        (discoveryError === CREDENTIAL_ASSOCIATION_REASON.RPC_UNAVAILABLE
          ? discoveryError
          : null),
    });
  }, [
    frontendEnabled,
    eligibility,
    discovery,
    discoveryError,
    flowPhase,
    flowReasonCode,
  ]);

  const associate = useCallback(async () => {
    if (!frontendEnabled || !eligibility.eligible || !walletAddress) {
      return { ok: false, reasonCode: eligibility.reasonCode };
    }
    if (!discovery?.aaCredential) {
      setFlowReasonCode(CREDENTIAL_ASSOCIATION_REASON.MISSING_AA_SBT);
      return { ok: false, reasonCode: CREDENTIAL_ASSOCIATION_REASON.MISSING_AA_SBT };
    }
    if (
      discovery.associationLookup?.currentlyVerified === true ||
      discovery.canonical?.currentlyVerified === true
    ) {
      setFlowReasonCode(CREDENTIAL_ASSOCIATION_REASON.ALREADY_VERIFIED);
      return { ok: false, reasonCode: CREDENTIAL_ASSOCIATION_REASON.ALREADY_VERIFIED };
    }

    const origin = readBrowserOrigin();
    const startWallet = walletAddress;
    const startChain = chainId ?? CREDENTIAL_ASSOCIATION_CHAIN_ID;
    const assocGen = ++discoveryGen.current;
    setFlowPhase("signing");
    setFlowReasonCode(null);

    try {
      const result = await runCredentialAssociationFlow({
        eoaAddress: startWallet,
        aaAddress: discovery.aaCredential.aaAddress,
        tokenId: discovery.aaCredential.tokenId,
        sbtContract: getConfiguredAaSbtContract(),
        expectedOrigin: origin,
        chainId: startChain,
        getConnectedWallet: readLiveWallet,
        getConnectedChainId: () =>
          normalizeWalletChainId(chainIdRef.current),
        signTypedDataAsync,
      });

      await refreshAndConfirmIssued({ eoaAddress: startWallet });

      // Refresh discovery only if wallet/chain/eligibility still match.
      try {
        const ctx = await discoverCredentialAssociationContext({
          eoaAddress: startWallet,
        });
        if (
          shouldApplyCredentialAssociationDiscovery({
            generation: assocGen,
            currentGeneration: discoveryGen.current,
            requestWallet: startWallet,
            liveWallet: readLiveWallet(),
            requestChainId: startChain,
            liveChainId: chainIdRef.current,
            eligible: Boolean(
              eligibilityRef.current?.eligible && frontendEnabled
            ),
          })
        ) {
          setDiscovery(ctx);
        }
      } catch {
        // resolve refresh below still informs ISSUED via onAssociated
      }

      if (assocGen !== discoveryGen.current) {
        return result;
      }

      setFlowPhase("idle");
      setFlowReasonCode(null);
      if (typeof onAssociated === "function") {
        await onAssociated();
      }
      return result;
    } catch (err) {
      const code =
        err?.reasonCode ||
        err?.payload?.reasonCode ||
        err?.payload?.error ||
        "ASSOCIATION_FAILED";
      if (assocGen === discoveryGen.current) {
        setFlowPhase("idle");
        setFlowReasonCode(String(code));
      }
      throw err;
    }
  }, [
    frontendEnabled,
    eligibility,
    walletAddress,
    discovery,
    chainId,
    signTypedDataAsync,
    onAssociated,
    readLiveWallet,
  ]);

  return {
    uiState: uiAssessment.uiState,
    reasonCode: uiAssessment.reasonCode,
    eligible: Boolean(eligibility.eligible && frontendEnabled),
    isFrontendEnabled: frontendEnabled,
    isAssociating: flowPhase === "signing",
    discovery,
    associate,
    /** Explicit: association never runs without associate(). */
    autoAssociated: false,
    minted: false,
  };
}
