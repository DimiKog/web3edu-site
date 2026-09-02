import { getLm08SourceVerificationCopy } from "../content/lm08SourceVerificationLocale.js";

/** Edu-Net Blockscout base — matches backend default and Web3Providers config. */
export const EDU_NET_BLOCKSCOUT_BASE = "https://blockexplorer.dimikog.org";

/**
 * @param {string|null|undefined} contractAddress
 * @returns {string|null}
 */
export function buildBlockscoutContractUrl(contractAddress) {
    if (!contractAddress || typeof contractAddress !== "string") return null;
    const trimmed = contractAddress.trim();
    if (!trimmed) return null;
    return `${EDU_NET_BLOCKSCOUT_BASE}/address/${trimmed}`;
}

/**
 * Whether a successful API payload should trigger canonical identity refetch.
 * @param {object|null|undefined} data
 */
export function shouldRefetchProgressionAfterSourceVerification(data) {
    return Boolean(data && data.ok === true);
}

const EXPLORER_ERRORS = new Set([
    "explorer_unavailable",
    "explorer_http_error",
    "explorer_invalid_response",
]);

const INTEGRITY_ERRORS = new Set(["evidence_conflict", "invalid_existing_evidence"]);

/**
 * Map backend source-verification response to UI state (no verification logic).
 *
 * @param {{ ok: boolean, status: number, data: object }} apiResult
 * @param {"en"|"gr"} lang
 */
export function mapSourceVerificationResponse(apiResult, lang = "en") {
    const copy = getLm08SourceVerificationCopy(lang);
    const { ok: wrapperOk, status, data } = apiResult ?? {};
    const payload = data && typeof data === "object" ? data : {};

    if (status === 401) {
        return { kind: "sign_in_required", copy };
    }

    if (payload.ok === true) {
        const contractAddress = payload.contractAddress ?? null;
        const explorerUrl = buildBlockscoutContractUrl(contractAddress);
        if (payload.alreadyApplied === true) {
            return {
                kind: "success_already",
                copy,
                contractAddress,
                explorerUrl,
                shouldRefetch: shouldRefetchProgressionAfterSourceVerification(payload),
            };
        }
        return {
            kind: "success_created",
            copy,
            contractAddress,
            explorerUrl,
            shouldRefetch: shouldRefetchProgressionAfterSourceVerification(payload),
        };
    }

    const error = String(payload.error || "");
    const contractAddress = payload.contractAddress ?? null;
    const explorerUrl = buildBlockscoutContractUrl(contractAddress);

    if (error === "source_not_verified") {
        return {
            kind: "not_verified",
            copy,
            contractAddress,
            explorerUrl,
            shouldRefetch: false,
        };
    }

    if (error === "coding01_required") {
        return { kind: "coding01_required", copy, shouldRefetch: false };
    }

    if (EXPLORER_ERRORS.has(error)) {
        return { kind: "explorer_unavailable", copy, shouldRefetch: false };
    }

    if (INTEGRITY_ERRORS.has(error)) {
        return { kind: "integrity_failure", copy, shouldRefetch: false };
    }

    if (!wrapperOk && status === 0 && error === "missing_bearer_token") {
        return { kind: "sign_in_required", copy };
    }

    return {
        kind: "generic_error",
        copy,
        shouldRefetch: false,
    };
}
