import { useEffect, useRef } from "react";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { postLabsStart } from "../utils/labWriteApi.js";

/**
 * Fires POST /labs/start at most once per (labId, smartAccount) for this component
 * lifetime (ignores wagmi `address` churn). Dedupe is reinforced inside {@link postLabsStart}.
 */
export function useLabAutoStartOnce({ labId, smartAccount, address }) {
  const startedPairRef = useRef(null);

  useEffect(() => {
    if (!labId || !smartAccount) return;
    const id = normalizeEvmAddress(smartAccount);
    if (!id) return;
    const pair = `${String(labId)}:${id}`;
    if (startedPairRef.current === pair) return;
    startedPairRef.current = pair;

    postLabsStart({ smartAccount, address, labId }).catch(() => {});
  }, [labId, smartAccount, address]);
}
