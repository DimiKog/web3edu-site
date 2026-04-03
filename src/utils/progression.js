export const BUILDER_THRESHOLD = Number(
    import.meta.env.VITE_BUILDER_THRESHOLD ?? 2500
);
export const ARCHITECT_THRESHOLD = Number(
    import.meta.env.VITE_ARCHITECT_THRESHOLD ?? 7000
);

const toNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ""));
        if (Number.isFinite(parsed)) return parsed;
    }
    return null;
};

export const parseObjectish = (value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch {
            return {};
        }
    }

    return {};
};

export const extractBackendMetadata = (payload) => {
    const directMetadata = parseObjectish(payload?.metadata);
    const nestedMetadata = parseObjectish(directMetadata?.metadata);
    return {
        ...directMetadata,
        ...nestedMetadata,
    };
};

export const extractBackendProfile = (payload) => {
    const directProfile = parseObjectish(payload?.profile);
    const nestedProfile = parseObjectish(directProfile?.metadata);
    return {
        ...directProfile,
        ...nestedProfile,
    };
};

export const getXpTotalFromBackend = (payload) => {
    const metadata = extractBackendMetadata(payload);
    const profile = extractBackendProfile(payload);

    return toNumber(
        payload?.xp_total ??
        payload?.total_xp ??
        payload?.xp ??
        profile?.profile?.xp_total ??
        profile?.profile?.total_xp ??
        profile?.profile?.xp ??
        profile?.xp_total ??
        profile?.total_xp ??
        profile?.xp ??
        metadata?.profile?.xp_total ??
        metadata?.profile?.total_xp ??
        metadata?.profile?.xp ??
        metadata?.xp_total ??
        metadata?.total_xp ??
        metadata?.xp
    ) ?? 0;
};

export const isUserStateUnavailableError = (statusOrError, payload) => {
    if (typeof statusOrError === "number") {
        return (
            statusOrError === 503 &&
            (payload?.error === "user_state_unavailable" ||
                payload?.status === "user_state_unavailable")
        );
    }

    return (
        statusOrError?.status === 503 &&
        statusOrError?.code === "user_state_unavailable"
    );
};

export const createBackendError = (status, payload) => {
    const error = new Error(
        payload?.error ||
        payload?.message ||
        `HTTP ${status}`
    );
    error.status = status;
    error.code = payload?.error || payload?.status || null;
    error.payload = payload;
    return error;
};

export const getRoleFromXpTotal = (xpTotal) =>
    xpTotal >= ARCHITECT_THRESHOLD
        ? "Architect"
        : xpTotal >= BUILDER_THRESHOLD
            ? "Builder"
            : "Explorer";

export const getProgressFromXpTotal = (xpTotal) => {
    const safeXpTotal = Math.max(0, toNumber(xpTotal) ?? 0);
    const tier = getRoleFromXpTotal(safeXpTotal);
    const nextThreshold =
        tier === "Explorer"
            ? BUILDER_THRESHOLD
            : tier === "Builder"
                ? ARCHITECT_THRESHOLD
                : ARCHITECT_THRESHOLD;
    const previousThreshold =
        tier === "Architect"
            ? ARCHITECT_THRESHOLD
            : tier === "Builder"
                ? BUILDER_THRESHOLD
                : 0;
    const intraTierRange = Math.max(1, nextThreshold - previousThreshold);
    const nextTierPercent =
        tier === "Architect"
            ? 100
            : Math.max(
                0,
                Math.min(
                    100,
                    ((safeXpTotal - previousThreshold) / intraTierRange) * 100
                )
            );
    const overallPercent = Math.max(
        0,
        Math.min(100, (safeXpTotal / ARCHITECT_THRESHOLD) * 100)
    );

    return {
        xpTotal: safeXpTotal,
        tier,
        role: tier,
        xpPercent: nextTierPercent,
        nextTierPercent,
        overallPercent,
        remainingXp:
            tier === "Architect" ? 0 : Math.max(0, nextThreshold - safeXpTotal),
    };
};
