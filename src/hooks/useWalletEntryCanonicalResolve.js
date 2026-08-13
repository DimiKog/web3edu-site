import { useEffect, useRef, useState } from "react";
import { fetchCanonicalIdentityResolve } from "../api/canonicalIdentity.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  WALLET_ENTRY_IDLE,
  WALLET_ENTRY_LOADING,
  interpretWalletEntryCanonicalResult,
} from "../utils/walletEntryCanonicalResolve.js";

const EMPTY = {
  status: WALLET_ENTRY_IDLE,
  canonicalProgressAddress: null,
  matchedBy: null,
  mode: null,
  linkedWalletAddress: null,
  aaAddress: null,
  ownerAddress: null,
  connectedEoa: null,
};

/**
 * Resolve a connected EOA through the canonical backend when OIDC is absent.
 * In-memory only. Wallet switch / disconnect invalidates the previous result.
 *
 * @param {{ enabled: boolean, connectedEoa: string|null }} args
 */
export function useWalletEntryCanonicalResolve({ enabled, connectedEoa } = {}) {
  const eoa = enabled ? normalizeEvmAddress(connectedEoa) : null;
  const [result, setResult] = useState(EMPTY);
  const generationRef = useRef(0);

  useEffect(() => {
    if (!eoa) {
      generationRef.current += 1;
      setResult(EMPTY);
      return undefined;
    }

    const generation = ++generationRef.current;
    const controller = new AbortController();
    setResult({
      ...EMPTY,
      status: WALLET_ENTRY_LOADING,
      connectedEoa: eoa,
    });

    (async () => {
      try {
        const payload = await fetchCanonicalIdentityResolve(eoa, {
          signal: controller.signal,
        });
        if (generationRef.current !== generation) return;
        setResult(
          interpretWalletEntryCanonicalResult(payload, { connectedEoa: eoa })
        );
      } catch (err) {
        if (generationRef.current !== generation) return;
        if (err?.name === "AbortError") return;
        setResult(
          interpretWalletEntryCanonicalResult(null, {
            connectedEoa: eoa,
            error: err,
          })
        );
      }
    })();

    return () => {
      controller.abort();
      if (generationRef.current === generation) {
        generationRef.current += 1;
      }
    };
  }, [eoa]);

  return result;
}
