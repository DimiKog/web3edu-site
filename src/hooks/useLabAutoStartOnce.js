import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { postLabsStart } from "../utils/labWriteApi.js";
import { getEducationalIdentityInput } from "../utils/educationalIdentityInput.js";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";

/**
 * Fires POST /labs/start at most once per (labId, identity input) for this
 * component lifetime.
 *
 * `smartAccount` / `address` arguments are accepted for call-site compatibility
 * but are not used as canonical identity. Selection goes through
 * {@link getEducationalIdentityInput} (same helper as lab writes/completion).
 */
export function useLabAutoStartOnce({ labId, smartAccount: smartAccountArg, address: addressArg } = {}) {
  const { address: wagmiAddress } = useAccount();
  const { smartAccount: contextSmartAccount, owner } = useIdentity();
  const {
    socialIdentity,
    isOidcAuthenticated,
    socialIdentityLoading,
    oidcAuthLoading,
  } = useSocialIdentity();

  const smartAccount = contextSmartAccount ?? smartAccountArg;
  const address = wagmiAddress ?? addressArg;
  const startedPairRef = useRef(null);

  useEffect(() => {
    if (!labId) return;

    const input = getEducationalIdentityInput({
      smartAccount,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
      address,
      owner,
    });

    if (input.deferred || !input.ready || !input.identityInput) return;

    const pair = `${String(labId)}:${input.identityInput}`;
    if (startedPairRef.current === pair) return;
    startedPairRef.current = pair;

    postLabsStart({
      smartAccount,
      address,
      owner,
      labId,
      isOidcAuthenticated,
      socialIdentity,
      socialIdentityLoading,
      oidcAuthLoading,
    }).catch(() => {});
  }, [
    labId,
    smartAccount,
    address,
    owner,
    isOidcAuthenticated,
    socialIdentity,
    socialIdentityLoading,
    oidcAuthLoading,
  ]);
}
