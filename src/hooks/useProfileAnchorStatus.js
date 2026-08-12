import { useCallback, useEffect, useRef, useState } from "react";
import { getProfileAnchorStatus } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";

/**
 * Generation-safe fetch for GET /web3sbt/anchor-status/:address.
 * Refreshes on identity change and `web3edu-progress-updated` (VERIFIED → OUTDATED).
 * Network/shape failures become API_UNAVAILABLE — never inferred as INVALID.
 *
 * @param {string|null|undefined} identityAddress
 */
export function useProfileAnchorStatus(identityAddress) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [uiStatus, setUiStatus] = useState(null); // VERIFIED|OUTDATED|NOT_ANCHORED|INVALID|API_UNAVAILABLE|null
  const [refetchBump, setRefetchBump] = useState(0);

  const generationRef = useRef(0);
  const prevKeyRef = useRef(null);

  const canon = normalizeEvmAddress(identityAddress);

  const refetch = useCallback(() => {
    generationRef.current += 1;
    setRefetchBump((n) => n + 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onProgressUpdated = () => {
      refetch();
    };
    window.addEventListener("web3edu-progress-updated", onProgressUpdated);
    return () => {
      window.removeEventListener("web3edu-progress-updated", onProgressUpdated);
    };
  }, [refetch]);

  useEffect(() => {
    if (!canon) {
      generationRef.current += 1;
      prevKeyRef.current = null;
      setData(null);
      setUiStatus(null);
      setLoading(false);
      return undefined;
    }

    const generation = ++generationRef.current;
    const controller = new AbortController();
    const isCurrent = () => generationRef.current === generation;

    const run = async () => {
      setLoading(true);
      if (prevKeyRef.current !== canon) {
        setData(null);
        setUiStatus(null);
      }

      try {
        const payload = await getProfileAnchorStatus(canon, {
          signal: controller.signal,
        });
        if (!isCurrent()) return;
        prevKeyRef.current = canon;
        setData(payload);
        setUiStatus(payload.status);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (!isCurrent()) return;
        prevKeyRef.current = canon;
        setData(null);
        setUiStatus("API_UNAVAILABLE");
      } finally {
        if (isCurrent()) setLoading(false);
      }
    };

    void run();
    return () => {
      controller.abort();
    };
  }, [canon, refetchBump]);

  return {
    loading,
    data,
    status: uiStatus,
    refetch,
  };
}
