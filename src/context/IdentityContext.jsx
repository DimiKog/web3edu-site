import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";

import {
  loadIdentityState,
  saveIdentityState,
  clearIdentityState,
  readConnectedEoaAddress,
  clearAaDisconnectLocalStorage,
  hasPersistedWalletAaIdentity,
} from "../utils/aaIdentity.js";
import { useSocialIdentity } from "./SocialIdentityContext.jsx";
import {
  getSocialIdentityAaAddress,
  getSocialIdentityOwnerAddress,
  hasUsableSocialIdentityPayload,
} from "../utils/socialIdentityPayload.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { resolveIdentityV2 } from "../api/aa.js";
import {
  isIdentityReady as evaluateIdentityViewerReady,
  warnIfIdentityNotInitialized,
  redirectToJoin,
} from "../utils/identityReadiness.js";

const IdentityContext = createContext(null);

const BLANK_IDENTITY = {
  owner: null,
  smartAccount: null,
  version: null,
  tokenId: null,
  hasIdentity: false,
  alreadyMinted: false,
};

export function IdentityProvider({ children }) {
  const { socialIdentity, isOidcAuthenticated } = useSocialIdentity();
  const [identity, setIdentityState] = useState(() => loadIdentityState() ?? BLANK_IDENTITY);
  const [walletSurfaceTick, setWalletSurfaceTick] = useState(0);
  /** False until after first layout — avoids redirects / resolve before persisted identity is committed to UI. */
  const [identityHydrated, setIdentityHydrated] = useState(false);
  /** After full disconnect, skip auto-creating an ephemeral owner key until wallet or identity is restored. */
  // Removed ephemeralOwnerSuppressed state as per instructions

  /**
   * Canonical `owner` for resolve/on-chain context:
   * social-login → backend/snapshot owner (never the guest connected EOA);
   * wallet-AA active → persisted owner (guest wallet session is additive only);
   * otherwise → connected EOA, else persisted.
   */
  const owner = useMemo(() => {
    const connected = readConnectedEoaAddress();
    let persisted = null;
    if (identity?.owner && typeof identity.owner === "string" && /^0x[a-fA-F0-9]{40}$/i.test(identity.owner)) {
      try {
        persisted = ethers.getAddress(identity.owner);
      } catch {
        persisted = identity.owner;
      }
    }

    const socialAa = normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity));
    const socialOwner = normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity));

    /** Social-login canonical path: never treat a newly connected guest EOA as `owner`. */
    if (isOidcAuthenticated && socialAa) {
      return socialOwner ?? null;
    }

    /** Wallet-AA already active: keep persisted owner as canonical even if another wallet is connected. */
    if (hasPersistedWalletAaIdentity(identity) && persisted) {
      return persisted;
    }

    if (connected) return connected;

    // IMPORTANT: do NOT auto-create owner here (prevents ghost identities)
    return persisted;
  }, [identity, walletSurfaceTick, isOidcAuthenticated, socialIdentity]);

  const smartAccount = identity?.smartAccount ?? null;
  const version = identity?.version ?? null;
  const tokenId = identity?.tokenId ?? null;
  const hasIdentity = Boolean(identity?.hasIdentity === true || identity?.alreadyMinted === true);

  /**
   * Persist connected EOA into `identity.owner` only for wallet-first onboarding.
   * Never replace or blank persisted identity when OIDC social-login is active, or when
   * a wallet-backed AA identity is already minted (guest wallet stays session-only).
   */
  useLayoutEffect(() => {
    /** OIDC session present: never persist a guest EOA into `web3edu-aa-identity` (social AA is canonical). */
    if (isOidcAuthenticated) {
      setIdentityHydrated(true);
      return;
    }

    const connected = readConnectedEoaAddress();
    if (connected) {
      setIdentityState((prev) => {
        const base = prev && typeof prev === "object" ? prev : BLANK_IDENTITY;

        if (hasPersistedWalletAaIdentity(base)) {
          let prevOwnerNorm = null;
          if (base.owner) {
            try {
              prevOwnerNorm = ethers.getAddress(base.owner).toLowerCase();
            } catch {
              prevOwnerNorm = String(base.owner).toLowerCase();
            }
          }
          if (prevOwnerNorm === connected.toLowerCase()) {
            return base;
          }
          /** Different wallet connected — do not keep another wallet’s minted identity. */
          const cleared = {
            ...BLANK_IDENTITY,
            owner: connected,
          };
          saveIdentityState(cleared);
          return cleared;
        }

        let prevOwnerNorm = null;
        if (base.owner) {
          try {
            prevOwnerNorm = ethers.getAddress(base.owner).toLowerCase();
          } catch {
            prevOwnerNorm = String(base.owner).toLowerCase();
          }
        }

        if (prevOwnerNorm === connected.toLowerCase()) {
          return base;
        }

        if (!prevOwnerNorm && !base.smartAccount) {
          const merged = { ...base, owner: connected };
          saveIdentityState(merged);
          return merged;
        }

        const merged = {
          ...BLANK_IDENTITY,
          owner: connected,
        };
        saveIdentityState(merged);
        return merged;
      });
    }
    setIdentityHydrated(true);
  }, [walletSurfaceTick, isOidcAuthenticated, socialIdentity]);

  useEffect(() => {
    const bump = () => setWalletSurfaceTick((n) => n + 1);
    window.addEventListener("web3edu-wallet-state", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("web3edu-wallet-state", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  // Removed useEffect related to ephemeralOwnerSuppressed as per instructions

  const setIdentity = useCallback((next) => {
    setIdentityState((prev) => {
      const base = prev && typeof prev === "object" ? prev : BLANK_IDENTITY;
      const patch = next && typeof next === "object" ? next : {};
      const merged = { ...base, ...patch };
      saveIdentityState(merged);
      return merged;
    });
  }, []);

  /**
   * Stale `identity.owner` from an old wallet session must not ride along with OIDC social
   * login — it was being sent as `?owner=` and returned the wrong user's /web3sbt/resolve payload.
   */
  useEffect(() => {
    if (!isOidcAuthenticated || !hasUsableSocialIdentityPayload(socialIdentity)) return;
    const aa = normalizeEvmAddress(getSocialIdentityAaAddress(socialIdentity));
    if (!aa) return;

    let persistedNorm = null;
    if (identity?.owner && typeof identity.owner === "string" && /^0x[a-fA-F0-9]{40}$/i.test(identity.owner)) {
      try {
        persistedNorm = ethers.getAddress(identity.owner);
      } catch {
        persistedNorm = identity.owner;
      }
    }
    if (!persistedNorm) return;

    const socialOwnerNorm = normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity));
    if (!socialOwnerNorm) {
      setIdentity({ owner: null });
      return;
    }
    if (persistedNorm.toLowerCase() !== socialOwnerNorm.toLowerCase()) {
      setIdentity({ owner: socialOwnerNorm });
    }
  }, [isOidcAuthenticated, socialIdentity, identity?.owner, setIdentity]);

  const clearIdentity = useCallback(() => {
    clearIdentityState();
    setIdentityState({ ...BLANK_IDENTITY });
  }, []);

  const disconnectIdentity = useCallback(() => {
    // Clear all AA-related storage (explicit logout)
    clearAaDisconnectLocalStorage();

    // Reset identity state completely
    setIdentityState({ ...BLANK_IDENTITY });

    // Force re-evaluation of wallet/session
    setWalletSurfaceTick((n) => n + 1);

    // Broadcast event for UI sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("web3edu-wallet-state"));
    }
  }, []);

  const refreshIdentity = useCallback(
    async (ownerOverride) => {
      if (!identityHydrated) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only guard
          console.warn("refreshIdentity skipped — identity not yet hydrated");
        }
        return null;
      }

      const anchor = normalizeEvmAddress(identity?.smartAccount);
      if (!anchor) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- dev-only guard
          console.warn("Skipping resolve — no smartAccount");
        }
        warnIfIdentityNotInitialized("refreshIdentity", {
          smartAccount: identity?.smartAccount ?? null,
          owner: identity?.owner ?? null,
        });
        redirectToJoin();
        throw new Error("Smart account required");
      }

      const response = await resolveIdentityV2({
        address: anchor,
      });

      if (!response) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console -- resolve is non-fatal
          console.warn("refreshIdentity: resolve returned null, keeping cached identity");
        }
        return null;
      }

      const responseSc = normalizeEvmAddress(response?.smartAccount);

      if (import.meta.env.DEV && responseSc && responseSc !== anchor) {
        // eslint-disable-next-line no-console -- dev-only identity invariant
        console.warn(
          "Identity drift detected — smartAccount must be the only identity anchor",
          { expected: anchor, resolved: responseSc }
        );
      }

      if (import.meta.env.DEV && response?.alreadyMinted !== true) {
        // eslint-disable-next-line no-console -- dev-only consistency
        console.warn(
          "refreshIdentity: persisted smartAccount but resolve reports not minted",
          { smartAccount: anchor }
        );
      }

      const effectiveOwner =
        (typeof ownerOverride === "string" &&
          (normalizeEvmAddress(ownerOverride) ?? ownerOverride.trim())) ||
        (isOidcAuthenticated
          ? normalizeEvmAddress(getSocialIdentityOwnerAddress(socialIdentity))
          : readConnectedEoaAddress()) ||
        identity?.owner ||
        null;

      setIdentity({
        owner: effectiveOwner ?? identity?.owner ?? null,
        smartAccount: anchor,
        version: response?.version ?? identity?.version ?? null,
        tokenId:
          response?.tokenId ??
          response?.token_id ??
          identity?.tokenId ??
          null,
        hasIdentity: true,
        alreadyMinted: true,
      });
      return response;
    },
    [setIdentity, identity, identityHydrated, isOidcAuthenticated, socialIdentity]
  );

  const isIdentityReady = useMemo(
    () =>
      evaluateIdentityViewerReady(smartAccount, identity, {
        isOidcAuthenticated,
        socialAaAddress: getSocialIdentityAaAddress(socialIdentity),
      }),
    [smartAccount, identity, isOidcAuthenticated, socialIdentity]
  );

  const value = useMemo(
    () => ({
      identity,
      owner,
      smartAccount,
      version,
      tokenId,
      hasIdentity,
      isIdentityReady,
      identityHydrated,
      setIdentity,
      clearIdentity,
      disconnectIdentity,
      refreshIdentity,
    }),
    [
      identity,
      owner,
      smartAccount,
      version,
      tokenId,
      hasIdentity,
      isIdentityReady,
      identityHydrated,
      setIdentity,
      clearIdentity,
      disconnectIdentity,
      refreshIdentity,
    ]
  );

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for this context module
export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components -- helpers used outside this hook
export {
  isIdentityReady,
  isWalletMintedIdentityRecord,
  warnIfIdentityNotInitialized,
} from "../utils/identityReadiness.js";
