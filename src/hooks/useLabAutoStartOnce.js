import { useEffect, useRef } from "react";
import { postLabsStart } from "../utils/labWriteApi.js";
import { getEducationalIdentityInput } from "../utils/educationalIdentityInput.js";
import { useEducationalIdentityArgs } from "./useEducationalIdentityArgs.js";

/**
 * Fires POST /labs/start at most once per (labId, identity input) for this
 * component lifetime.
 *
 * `smartAccount` / `address` arguments are accepted for call-site compatibility
 * but are not used as canonical identity. Selection goes through
 * {@link getEducationalIdentityInput} (same helper as lab writes/completion).
 */
export function useLabAutoStartOnce({ labId } = {}) {
  const identityArgs = useEducationalIdentityArgs();
  const startedPairRef = useRef(null);

  useEffect(() => {
    if (!labId) return;

    const input = getEducationalIdentityInput(identityArgs);

    if (input.deferred || !input.ready || !input.identityInput) return;

    const pair = `${String(labId)}:${input.identityInput}`;
    if (startedPairRef.current === pair) return;
    startedPairRef.current = pair;

    postLabsStart({
      ...identityArgs,
      labId,
    }).catch(() => {});
  }, [labId, identityArgs]);
}
