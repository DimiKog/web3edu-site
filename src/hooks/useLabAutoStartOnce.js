import { useEffect, useRef } from "react";
import { postLabsStart } from "../utils/labWriteApi.js";
import { getEducationalIdentityInput } from "../utils/educationalIdentityInput.js";
import { useEducationalIdentityArgs } from "./useEducationalIdentityArgs.js";

/**
 * Fires POST /labs/start at most once per (labId, identity input) for this
 * component lifetime, after Keycloak idToken is available.
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

    const idToken =
      typeof identityArgs.idToken === "string" && identityArgs.idToken.trim()
        ? identityArgs.idToken.trim()
        : null;
    // Defer until OIDC token is ready — avoid marking the pair started on a 204.
    if (!idToken) return;

    const input = getEducationalIdentityInput(identityArgs);

    if (input.deferred || !input.ready || !input.identityInput) return;

    const pair = `${String(labId)}:${input.identityInput}`;
    if (startedPairRef.current === pair) return;
    startedPairRef.current = pair;

    postLabsStart({
      ...identityArgs,
      idToken,
      labId,
    })
      .then((res) => {
        // Allow a later retry if deferred (204) or failed. 200 (including
        // sessionStorage short-circuit) keeps the pair marked started.
        if (res.status === 204 || !res.ok) {
          startedPairRef.current = null;
        }
      })
      .catch(() => {
        startedPairRef.current = null;
      });
  }, [labId, identityArgs]);
}
