import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getSocialIdentityMe, resolveOrProvisionSocialIdentity } from "../api/socialIdentity.js";
import {
  getSocialIdentityProvisioningStatus,
  hasUsableSocialIdentityPayload,
} from "../utils/socialIdentityPayload.js";

const SocialIdentityContext = createContext(null);

function isAbortError(e) {
  return (
    e?.name === "AbortError" ||
    e?.message === "signal is aborted without reason"
  );
}

function getIdTokenFromAuth(auth) {
  const raw = auth?.user?.id_token;
  return typeof raw === "string" && raw.trim() ? raw : null;
}

const PROVISION_POLL_MAX = 6;
const PROVISION_POLL_DELAY_MS = 650;

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(Object.assign(new Error("signal is aborted without reason"), { name: "AbortError" }));
      return;
    }
    const t = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(Object.assign(new Error("signal is aborted without reason"), { name: "AbortError" }));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Backend says provisioning will not succeed — stop polling. */
function isTerminalProvisioningFailure(data) {
  if (!data || typeof data !== "object") return false;
  const st = String(getSocialIdentityProvisioningStatus(data) ?? "").toLowerCase();
  return st.includes("fail") || st.includes("error") || st === "rejected";
}

/**
 * GET /me when useful, else POST resolve-or-provision (with bounded retries while AA
 * is still missing — first-time users often need a short eventual-consistency window).
 * Throws only when provision/read paths truly fail or return unusable payload after retries.
 * Propagates AbortError for cancelled in-flight work.
 */
async function fetchMeThenProvision(idToken, signal) {
  let me = null;
  try {
    me = await getSocialIdentityMe(idToken, { signal });
  } catch (e) {
    if (isAbortError(e)) throw e;
    // Transient GET errors — still attempt provision
  }

  if (hasUsableSocialIdentityPayload(me)) {
    return me;
  }

  let lastResolved = null;
  for (let attempt = 1; attempt <= PROVISION_POLL_MAX; attempt += 1) {
    if (signal?.aborted) {
      const err = new Error("signal is aborted without reason");
      err.name = "AbortError";
      throw err;
    }

    lastResolved = await resolveOrProvisionSocialIdentity(idToken, { signal });
    if (isTerminalProvisioningFailure(lastResolved)) {
      const msg =
        lastResolved?.message ||
        lastResolved?.error ||
        "Social identity provisioning failed.";
      const err = new Error(msg);
      err.code = "PROVISIONING_FAILED";
      err.payload = lastResolved;
      throw err;
    }
    if (hasUsableSocialIdentityPayload(lastResolved)) {
      return lastResolved;
    }

    try {
      me = await getSocialIdentityMe(idToken, { signal });
    } catch (e) {
      if (isAbortError(e)) throw e;
    }
    if (hasUsableSocialIdentityPayload(me)) {
      return me;
    }

    if (attempt < PROVISION_POLL_MAX) {
      await delay(PROVISION_POLL_DELAY_MS, signal);
    }
  }

  const err = new Error(
    "Social identity response did not include an AA address. Try Retry or contact support if this persists."
  );
  err.code = "MISSING_AA_ADDRESS";
  err.payload = lastResolved;
  throw err;
}

export function SocialIdentityProvider({ children }) {
  const auth = useAuth();

  const oidcAuthLoading = Boolean(auth?.isLoading);
  const isOidcAuthenticated = Boolean(auth?.isAuthenticated);
  /**
   * Do not memoize only on `auth.user` reference — oidc-client may reuse `user` while
   * `id_token` is populated after sign-in / userinfo. Always derive from latest auth.
   */
  const idToken =
    !auth?.isLoading && auth?.isAuthenticated ? getIdTokenFromAuth(auth) : null;

  const [socialIdentity, setSocialIdentity] = useState(null);
  const [socialIdentityLoading, setSocialIdentityLoading] = useState(false);
  const [socialIdentityError, setSocialIdentityError] = useState(null);

  const lastResolvedTokenRef = useRef(null);
  const socialIdentityRef = useRef(null);

  useEffect(() => {
    socialIdentityRef.current = socialIdentity;
  }, [socialIdentity]);

  const clearSocialIdentity = useCallback(() => {
    setSocialIdentity(null);
    setSocialIdentityError(null);
    setSocialIdentityLoading(false);
    lastResolvedTokenRef.current = null;
    socialIdentityRef.current = null;
  }, []);

  const resolveNow = useCallback(async () => {
    if (!isOidcAuthenticated) return null;
    if (!idToken) {
      throw new Error("Missing ID token");
    }

    if (
      lastResolvedTokenRef.current === idToken &&
      hasUsableSocialIdentityPayload(socialIdentityRef.current)
    ) {
      return socialIdentityRef.current;
    }

    const controller = new AbortController();
    setSocialIdentityLoading(true);
    setSocialIdentityError(null);

    try {
      const data = await fetchMeThenProvision(idToken, controller.signal);
      setSocialIdentity(data);
      lastResolvedTokenRef.current = idToken;
      socialIdentityRef.current = data;
      return data;
    } catch (e) {
      if (isAbortError(e)) return null;
      setSocialIdentity(null);
      socialIdentityRef.current = null;
      setSocialIdentityError(e?.message || "Failed to resolve social identity");
      return null;
    } finally {
      setSocialIdentityLoading(false);
    }
  }, [isOidcAuthenticated, idToken]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    // eslint-disable-next-line no-console -- dev-only OIDC / social identity diagnostics
    console.debug("[SocialIdentity/OIDC]", {
      isLoading: auth?.isLoading,
      isAuthenticated: auth?.isAuthenticated,
      hasUser: Boolean(auth?.user),
      id_token: auth?.user?.id_token ? `present(len=${auth.user.id_token.length})` : null,
      derivedIdToken: idToken ? `present(len=${idToken.length})` : null,
    });
  }, [auth?.isLoading, auth?.isAuthenticated, auth?.user, idToken]);

  useEffect(() => {
    if (oidcAuthLoading) {
      return;
    }
    if (!isOidcAuthenticated) {
      clearSocialIdentity();
      return;
    }

    if (!idToken) {
      setSocialIdentity(null);
      setSocialIdentityError(
        "OIDC session is missing an ID token. Confirm Keycloak returns the openid scope and that sign-in completed."
      );
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setSocialIdentityLoading(true);
      setSocialIdentityError(null);
      try {
        const data = await fetchMeThenProvision(idToken, controller.signal);
        if (cancelled) return;
        setSocialIdentity(data);
        lastResolvedTokenRef.current = idToken;
        socialIdentityRef.current = data;
      } catch (e) {
        if (cancelled || isAbortError(e)) return;
        setSocialIdentity(null);
        socialIdentityRef.current = null;
        setSocialIdentityError(e?.message || "Failed to resolve social identity");
      } finally {
        setSocialIdentityLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [oidcAuthLoading, isOidcAuthenticated, idToken, clearSocialIdentity]);

  const value = useMemo(
    () => ({
      oidcAuthLoading,
      isOidcAuthenticated,
      idToken,
      socialIdentity,
      socialIdentityLoading,
      socialIdentityError,
      resolveNow,
      clearSocialIdentity,
    }),
    [
      oidcAuthLoading,
      isOidcAuthenticated,
      idToken,
      socialIdentity,
      socialIdentityLoading,
      socialIdentityError,
      resolveNow,
      clearSocialIdentity,
    ]
  );

  return (
    <SocialIdentityContext.Provider value={value}>
      {children}
    </SocialIdentityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for this context module
export function useSocialIdentity() {
  const ctx = useContext(SocialIdentityContext);
  if (!ctx) {
    throw new Error("useSocialIdentity must be used within a SocialIdentityProvider");
  }
  return ctx;
}
