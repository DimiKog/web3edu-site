/**
 * Pure helpers for restoring persisted Coding01 verification state in the UI.
 * Display/session restoration only — does not mutate backend or infer contracts.
 *
 * @param {object|null|undefined} status — GET /labs/coding01/status payload
 * @returns {object|null}
 */
export function applyCoding01Hydration(status) {
    if (!status || status.ok !== true || status.verified !== true) {
        return null;
    }

    const contractAddress = status.contractAddress || "";

    return {
        contractAddressInput: contractAddress,
        contractVerified: true,
        verificationResult: {
            contractAddress,
            verifiedAt: status.verifiedAt ?? null,
            matchesTemplate: true,
            alreadyVerified: true,
            message: "Coding Lab 01 Counter contract verified.",
        },
        deploymentAttributed: status.deploymentAttributed === true,
        deploymentAttributionResult:
            status.deploymentAttributed === true
                ? {
                      alreadyAttributed: true,
                      contractAddress,
                      deployerAddress: status.deployerAddress ?? null,
                      deploymentTxHash: status.deploymentTxHash ?? null,
                  }
                : null,
    };
}

/**
 * Whether hydrated session should show deployment attribution without re-verify.
 * @param {object|null|undefined} hydration
 */
export function shouldShowDeploymentAttributionFromHydration(hydration) {
    return Boolean(
        hydration?.contractVerified &&
            hydration.deploymentAttributed !== true
    );
}
