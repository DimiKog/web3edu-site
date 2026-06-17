import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveIdentityV2 } from "../api/aa.js";
import { buildWeb3SbtResolveUrl } from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  createBackendError,
  extractBackendMetadata,
  extractBackendProfile,
  extractRootIdentityHints,
  getProgressFromXpTotal,
  getXpTotalFromBackend,
  isUserStateUnavailableError,
} from "../utils/progression.js";

function resolveTokenId(payload) {
  const candidates = [
    payload?.tokenId,
    payload?.token_id,
    payload?.tokenID,
    payload?.metadata?.tokenId,
    payload?.metadata?.token_id,
    payload?.profile?.tokenId,
    payload?.profile?.token_id,
    payload?.metadata?.metadata?.tokenId,
    payload?.metadata?.metadata?.token_id,
    payload?.profile?.metadata?.tokenId,
    payload?.profile?.metadata?.token_id,
  ];

  for (const candidate of candidates) {
    if (candidate !== null && candidate !== undefined && candidate !== "") {
      return candidate;
    }
  }

  return null;
}

function parseMaybeJson(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function normalizeAttributes(source) {
  const candidates = [
    source?.attributes,
    source?.attribute,
    source?.attrs,
    source?.traits,
    source?.traits_array,
    source?.traitsArray,
    source?.attributes_json,
    source?.attributesJson,
  ];
  for (const cand of candidates) {
    const parsed = parseMaybeJson(cand);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed).map(([key, value]) => ({
        trait_type: key,
        value,
      }));
    }
  }
  return [];
}

async function fetchLegacyResolve({ identityAddress, resolveOwner, signal }) {
  const url = buildWeb3SbtResolveUrl(identityAddress, resolveOwner);
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- dev-only identity diagnostics (must be visible)
    console.log("[useResolvedIdentity] request", {
      url,
      identityAddress,
      resolveOwner,
    });
  }
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw createBackendError(res.status, payload);
  }
  const data = await res.json();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- dev-only identity diagnostics (must be visible)
    console.log("[useResolvedIdentity] parsed", {
      url,
      identityAddress,
      resolveOwner,
      identityAddressReturned:
        data?.identityAddress ??
        data?.smartAccount ??
        data?.smartAccountAddress ??
        data?.tokenHolder ??
        null,
      ownerReturned:
        data?.owner ??
        data?.ownerAddress ??
        data?.eoa ??
        data?.wallet ??
        data?.walletAddress ??
        data?.profile?.wallet ??
        data?.profile?.walletAddress ??
        null,
    });
  }
  return data;
}

/**
 * @param {string|null|undefined} identityAddress — canonical smart account ONLY (no owner fallback)
 * @param {string|null|undefined} resolveOwner — optional EOA for `?owner=` on /web3sbt/resolve (backend may require it for founder / full passport)
 */
export function useResolvedIdentity(identityAddress, resolveOwner = null) {
  const [metadata, setMetadata] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resolveData, setResolveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchBump, setRefetchBump] = useState(0);

  const canonId = useMemo(
    () => normalizeEvmAddress(identityAddress),
    [identityAddress]
  );

  const canonResolveOwner = useMemo(
    () => normalizeEvmAddress(resolveOwner),
    [resolveOwner]
  );

  const resolveKey = useMemo(() => {
    if (!canonId) return null;
    if (canonResolveOwner) {
      return `${canonId}|${canonResolveOwner.toLowerCase()}`;
    }
    return canonId;
  }, [canonId, canonResolveOwner]);

  const lastCompletedKeyRef = useRef(null);
  const prevResolveKeyForDataRef = useRef(null);

  const refetch = useCallback(() => {
    lastCompletedKeyRef.current = null;
    setRefetchBump((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!resolveKey || !canonId) {
      lastCompletedKeyRef.current = null;
      prevResolveKeyForDataRef.current = null;
      setMetadata(null);
      setProfile(null);
      setResolveData(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (lastCompletedKeyRef.current === resolveKey) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);
      if (prevResolveKeyForDataRef.current !== resolveKey) {
        setMetadata(null);
        setProfile(null);
        setResolveData(null);
      }

      try {
        const anchor = canonId;
        if (!anchor) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- dev-only guard
            console.warn("Skipping resolve — no smartAccount");
          }
        } else {
          // Non-mint flows: smart-account anchor only (never pass connected EOA as owner).
          try {
            await resolveIdentityV2({
              address: anchor,
              signal: controller.signal,
            });
          } catch {
            // Non-fatal: SBT holder payload comes from /web3sbt/resolve below.
          }
        }

        const dashboardData = await fetchLegacyResolve({
          identityAddress: canonId,
          resolveOwner: canonResolveOwner,
          signal: controller.signal,
        });

        if (cancelled) return;

        if (import.meta.env.DEV) {
          const rawTokenId = resolveTokenId(dashboardData);
          const rawXpTotal = getXpTotalFromBackend(dashboardData);
          const derived = getProgressFromXpTotal(rawXpTotal);
          const badgeCandidates = [
            dashboardData?.badges,
            dashboardData?.metadata?.badges,
            dashboardData?.profile?.badges,
            dashboardData?.metadata?.metadata?.badges,
            dashboardData?.profile?.metadata?.badges,
          ];
          let badges = null;
          for (const c of badgeCandidates) {
            if (Array.isArray(c)) {
              badges = c;
              break;
            }
          }
          // eslint-disable-next-line no-console -- dev-only identity diagnostics (must be visible)
          console.log("[useResolvedIdentity] response", {
            requested: {
              identityAddress: canonId,
              resolveOwner: canonResolveOwner,
              resolveKey,
            },
            returned: {
              identityAddress:
                dashboardData?.identityAddress ??
                dashboardData?.smartAccount ??
                dashboardData?.smartAccountAddress ??
                dashboardData?.tokenHolder ??
                null,
              owner:
                dashboardData?.owner ??
                dashboardData?.ownerAddress ??
                dashboardData?.eoa ??
                dashboardData?.wallet ??
                dashboardData?.walletAddress ??
                dashboardData?.profile?.wallet ??
                dashboardData?.profile?.walletAddress ??
                null,
              tokenId: rawTokenId,
              metadataTier:
                dashboardData?.metadata?.tier ??
                dashboardData?.profile?.tier ??
                dashboardData?.tier ??
                derived?.tier ??
                null,
              metadataXp:
                dashboardData?.metadata?.xp ??
                dashboardData?.metadata?.xp_total ??
                dashboardData?.profile?.xp ??
                dashboardData?.profile?.xp_total ??
                rawXpTotal ??
                null,
              badgesCount: Array.isArray(badges) ? badges.length : null,
              badgesPreview: Array.isArray(badges) ? badges.slice(0, 8) : null,
              rowSelectionHints: {
                tokenHolder: dashboardData?.tokenHolder ?? null,
                smartAccount: dashboardData?.smartAccount ?? null,
                smartAccountAddress: dashboardData?.smartAccountAddress ?? null,
                resolveOwnerEcho:
                  dashboardData?.resolveOwner ??
                  dashboardData?.ownerUsed ??
                  dashboardData?.ownerParam ??
                  null,
              },
            },
          });
        }

        if (import.meta.env.DEV) {
          const got = normalizeEvmAddress(dashboardData?.identityAddress);
          if (got && canonId && got !== canonId) {
            // eslint-disable-next-line no-console -- dev-only identity invariant
            console.warn("🚨 IDENTITY DRIFT DETECTED", {
              expected: canonId,
              got,
              raw: dashboardData?.identityAddress,
              fullResponse: dashboardData,
            });
          }
        }

        if (import.meta.env.DEV && canonId) {
          const driftCandidates = [
            dashboardData?.smartAccount,
            dashboardData?.smartAccountAddress,
            dashboardData?.tokenHolder,
            dashboardData?.identity,
          ];
          let resolvedNorm = null;
          for (const c of driftCandidates) {
            const n = normalizeEvmAddress(c);
            if (n) {
              resolvedNorm = n;
              break;
            }
          }
          if (resolvedNorm && resolvedNorm !== canonId) {
            // eslint-disable-next-line no-console -- dev-only identity invariant
            console.warn(
              "Identity drift detected — smartAccount must be the only identity anchor",
              { expected: canonId, resolved: resolvedNorm }
            );
          }
        }

        const apiMetadata = extractBackendMetadata(dashboardData);
        const apiProfile = extractBackendProfile(dashboardData);
        const rootHints = extractRootIdentityHints(dashboardData);

        const preferredRecommendation = (() => {
          const metadataRecommendation =
            apiMetadata && typeof apiMetadata.recommendedNext === "object"
              ? apiMetadata.recommendedNext
              : null;
          const profileRecommendation =
            apiProfile && typeof apiProfile.recommendedNext === "object"
              ? apiProfile.recommendedNext
              : null;
          const isUsable = (rec) => rec && (rec.title || rec.slug);
          if (isUsable(metadataRecommendation)) return metadataRecommendation;
          if (isUsable(profileRecommendation)) return profileRecommendation;
          return null;
        })();

        const xpTotal = getXpTotalFromBackend(dashboardData);
        const derivedProgress = getProgressFromXpTotal(xpTotal);

        const combinedMetadata = {
          ...apiMetadata,
          ...apiProfile,
          ...rootHints,
        };

        const nextMetadata = {
          ...combinedMetadata,
          tokenId: resolveTokenId(dashboardData),
          xp_total: xpTotal,
          xp: xpTotal,
          tier: derivedProgress.tier,
          xpPercent: derivedProgress.xpPercent,
          nextTierPercent: derivedProgress.nextTierPercent,
          remainingXp: derivedProgress.remainingXp,
          recommendedNext: preferredRecommendation,
        };

        const metadataAttributes = normalizeAttributes(apiMetadata);
        const profileAttributes = normalizeAttributes(apiProfile);
        const rootAttributes = normalizeAttributes(dashboardData);
        const mergedAttributes = [
          ...metadataAttributes,
          ...profileAttributes,
          ...rootAttributes,
        ];

        const roleValue = apiProfile.role || apiMetadata.role;
        const specializationValue =
          apiProfile.specialization ||
          apiProfile.speciality ||
          apiMetadata.specialization ||
          apiMetadata.speciality;

        const hasRoleAttr = mergedAttributes.some(
          (a) => (a.trait_type || "").toLowerCase() === "role"
        );
        const hasSpecAttr = mergedAttributes.some((a) =>
          ["specialization", "speciality"].includes(
            (a.trait_type || "").toLowerCase()
          )
        );

        if (!hasRoleAttr && roleValue) {
          mergedAttributes.push({ trait_type: "Role", value: roleValue });
        }
        if (!hasSpecAttr && specializationValue) {
          mergedAttributes.push({
            trait_type: "Specialization",
            value: specializationValue,
          });
        }

        const finalImage =
          apiProfile.image && apiProfile.image.trim() !== ""
            ? apiProfile.image
            : apiProfile.avatar && apiProfile.avatar.trim() !== ""
              ? apiProfile.avatar
              : apiMetadata.image && apiMetadata.image.trim() !== ""
                ? apiMetadata.image
                : apiMetadata.avatar && apiMetadata.avatar.trim() !== ""
                  ? apiMetadata.avatar
                  : null;

        const displayAddr = canonId;

        const nextProfile = {
          ...combinedMetadata,
          xp_total: xpTotal,
          xp: xpTotal,
          tier: derivedProgress.tier,
          name:
            apiProfile.name ||
            apiMetadata.name ||
            (displayAddr ? `${displayAddr.slice(0, 6)}...${displayAddr.slice(-4)}` : null) ||
            "Web3Edu Identity",
          image: finalImage,
          attributes: mergedAttributes,
        };

        setMetadata(nextMetadata);
        setProfile(nextProfile);
        setResolveData(dashboardData);
        lastCompletedKeyRef.current = resolveKey;
        prevResolveKeyForDataRef.current = resolveKey;
      } catch (err) {
        if (cancelled) return;
        if (isUserStateUnavailableError(err)) {
          setError("user_state_unavailable");
          return;
        }
        setError(err?.message || "Failed to resolve identity");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [resolveKey, canonId, canonResolveOwner, refetchBump]);

  return { metadata, profile, resolveData, loading, error, refetch };
}
