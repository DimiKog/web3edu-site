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
  getOwnerAddress,
  loadIdentityState,
  saveIdentityState,
  clearIdentityState,
  readConnectedEoaAddress,
  clearAaDisconnectLocalStorage,
} from "../utils/aaIdentity.js";

import { resolveIdentity } from "../api/aa.js";

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
  const [identity, setIdentityState] = useState(() => loadIdentityState() ?? BLANK_IDENTITY);
  const [walletSurfaceTick, setWalletSurfaceTick] = useState(0);
  /** After full disconnect, skip auto-creating an ephemeral owner key until wallet or identity is restored. */
  const [ephemeralOwnerSuppressed, setEphemeralOwnerSuppressed] = useState(false);

  /**
   * AA owner must be the connected EOA when a wallet session exists; otherwise
   * persisted `identity.owner` (e.g. after ephemeral mint) or a per-browser
   * key from `web3edu-aa-owner-private-key` — never a single global default.
   */
  const owner = useMemo(() => {
    const connected = readConnectedEoaAddress();
    if (connected) return connected;
    const persisted = identity?.owner;
    if (persisted && typeof persisted === "string" && /^0x[a-fA-F0-9]{40}$/i.test(persisted)) {
      try {
        return ethers.getAddress(persisted);
      } catch {
        return persisted;
      }
    }
    if (ephemeralOwnerSuppressed) return null;
    return getOwnerAddress();
  }, [identity, walletSurfaceTick, ephemeralOwnerSuppressed]);

  const smartAccount = identity?.smartAccount ?? null;
  const version = identity?.version ?? null;
  const tokenId = identity?.tokenId ?? null;
  const hasIdentity = Boolean(identity?.hasIdentity === true || identity?.alreadyMinted === true);

  /**
   * When the wallet session address differs from persisted `identity.owner`,
   * drop cached AA rows (smart account / mint flags) so each EOA maps to its own account.
   */
  useLayoutEffect(() => {
    const connected = readConnectedEoaAddress();
    if (!connected) return;

    setIdentityState((prev) => {
      const base = prev && typeof prev === "object" ? prev : BLANK_IDENTITY;
      let prevOwnerNorm = null;
      if (base.owner) {
        try {
          prevOwnerNorm = ethers.getAddress(base.owner).toLowerCase();
        } catch {
          prevOwnerNorm = String(base.owner).toLowerCase();
        }
      }
      if (prevOwnerNorm === connected.toLowerCase()) return base;

      if (!prevOwnerNorm) {
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
  }, [walletSurfaceTick]);

  useEffect(() => {
    const bump = () => setWalletSurfaceTick((n) => n + 1);
    window.addEventListener("web3edu-wallet-state", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("web3edu-wallet-state", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  useEffect(() => {
    if (readConnectedEoaAddress()) {
      setEphemeralOwnerSuppressed(false);
      return;
    }
    if (identity?.owner || identity?.smartAccount) setEphemeralOwnerSuppressed(false);
  }, [identity?.owner, identity?.smartAccount, walletSurfaceTick]);

  const setIdentity = useCallback((next) => {
    setIdentityState((prev) => {
      const base = prev && typeof prev === "object" ? prev : BLANK_IDENTITY;
      const patch = next && typeof next === "object" ? next : {};
      const merged = { ...base, ...patch };
      saveIdentityState(merged);
      return merged;
    });
  }, []);

  const clearIdentity = useCallback(() => {
    clearIdentityState();
    setIdentityState({ ...BLANK_IDENTITY });
  }, []);

  const disconnectIdentity = useCallback(() => {
    clearAaDisconnectLocalStorage();
    setEphemeralOwnerSuppressed(true);
    setIdentityState({ ...BLANK_IDENTITY });
    setWalletSurfaceTick((n) => n + 1);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("web3edu-wallet-state"));
    }
  }, []);

  const refreshIdentity = useCallback(
    async (ownerOverride) => {
      const effectiveOwner =
        ownerOverride ??
        owner ??
        readConnectedEoaAddress() ??
        getOwnerAddress();
      const response = await resolveIdentity({ owner: effectiveOwner });

      if (response?.alreadyMinted === true) {
        const next = {
          owner: effectiveOwner,
          smartAccount: response?.smartAccount ?? null,
          version: response?.version ?? null,
          tokenId: response?.tokenId ?? null,
          hasIdentity: true,
          alreadyMinted: true,
        };
        setIdentity(next);
        return response;
      }

      const next = {
        owner: effectiveOwner,
        smartAccount: response?.smartAccount ?? null,
        version: response?.version ?? null,
        tokenId: null,
        hasIdentity: false,
        alreadyMinted: false,
      };
      setIdentity(next);
      return response;
    },
    [owner, setIdentity]
  );

  const value = useMemo(
    () => ({
      identity,
      owner,
      smartAccount,
      version,
      tokenId,
      hasIdentity,
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

