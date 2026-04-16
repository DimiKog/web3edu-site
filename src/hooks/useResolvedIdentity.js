import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveIdentity } from "../api/aa.js";
import {
  buildWeb3SbtResolveUrl,
  resolveReadOwnerQueryParam,
} from "../lib/web3eduBackend.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import {
  createBackendError,
  extractBackendMetadata,
  extractBackendProfile,
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
  // eslint-disable-next-line no-console -- AA / backend integration debug
  console.log("API CALL", { identityAddress, resolveOwner });
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw createBackendError(res.status, payload);
  }
  return await res.json();
}

export function useResolvedIdentity(identityAddress, owner, address, smartAccount) {
  const [metadata, setMetadata] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchBump, setRefetchBump] = useState(0);

  const canonId = useMemo(
    () => normalizeEvmAddress(identityAddress),
    [identityAddress]
  );
  const canonOwner = useMemo(
    () => normalizeEvmAddress(owner),
    [owner]
  );
  const canonWallet = useMemo(
    () => normalizeEvmAddress(address),
    [address]
  );

  const isAAUser = useMemo(() => {
    if (!canonOwner) return false;
    if (canonId && canonId !== canonOwner) return true;
    if (!canonWallet) return true;
    return canonOwner !== canonWallet;
  }, [canonOwner, canonId, canonWallet]);

  const resolveOwner = useMemo(
    () => resolveReadOwnerQueryParam(smartAccount, address, owner),
    [address]
  );

  const resolveKey = useMemo(() => {
    if (!canonId) return null;
    return `${canonId}:${resolveOwner ?? ""}`;
  }, [canonId, resolveOwner]);

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
      }

      try {
        if (isAAUser && canonOwner) {
          try {
            await resolveIdentity({
              owner: canonOwner,
              signal: controller.signal,
            });
          } catch {
            // Non-fatal: SBT holder payload comes from /web3sbt/resolve below.
          }
        }

        const dashboardData = await fetchLegacyResolve({
          identityAddress: canonId,
          resolveOwner,
          signal: controller.signal,
        });

        if (cancelled) return;

        if (dashboardData?.owner && resolveOwner) {
          const resolvedAddr = String(dashboardData.owner).toLowerCase();
          const expectedAddr = String(resolveOwner).toLowerCase();
          if (resolvedAddr !== expectedAddr) {
            // eslint-disable-next-line no-console -- mismatch diagnostic
            console.warn("⚠️ MISMATCH: backend returned different address", {
              resolvedAddr,
              expectedAddr,
            });
          }
        }

        const apiMetadata = extractBackendMetadata(dashboardData);
        const apiProfile = extractBackendProfile(dashboardData);

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
        const mergedAttributes = [...metadataAttributes, ...profileAttributes];

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

        const displayAddr = canonId || canonWallet || null;

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
  }, [
    resolveKey,
    canonId,
    resolveOwner,
    isAAUser,
    canonOwner,
    refetchBump,
  ]);

  return { metadata, profile, loading, error, refetch };
}
