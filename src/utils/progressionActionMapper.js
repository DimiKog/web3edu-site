import { getContinueLearningCopy } from "../content/continueLearningLocale.js";

/** @type {Record<"en"|"gr", Record<string, string>>} */
const EVIDENCE_ROUTES = {
    en: {
        lab01: "/labs/wallets-keys",
        lab02: "/labs/lab02",
        lab03: "/labs/lab03",
        lab04: "/labs/lab04",
        lab05: "/labs/lab05",
        lab06: "/labs/lab06",
        coding01: "/labs/coding-01/interaction",
        coding02: "/labs/coding-02/interaction",
        "lm08-contract-inspection": "/learning-modules/lm08/contract-inspection",
    },
    gr: {
        lab01: "/labs-gr/wallets-keys",
        lab02: "/labs-gr/lab02",
        lab03: "/labs-gr/lab03",
        lab04: "/labs-gr/lab04",
        lab05: "/labs-gr/lab05",
        lab06: "/labs-gr/lab06",
        coding01: "/labs-gr/coding-01/interaction",
        coding02: "/labs-gr/coding-02/interaction",
        "lm08-contract-inspection": "/learning-modules-gr/lm08/contract-inspection",
    },
};

const UNAVAILABLE_EVIDENCE_IDS = new Set([
    "lm08-source-verification",
    "lm02-decision",
    "lm03-platform-decision",
    "lm05-pel-transaction",
    "lm09-guided-coding",
    "lm10-pel-tokenization",
    "lm10-token-decision",
    "lm11-erc20-activity",
]);

/**
 * Map backend semantic nextAction to frontend route + localized labels.
 * Does not calculate progression.
 *
 * @param {{ nextAction?: object|null, lang?: "en"|"gr" }} params
 * @returns {{ status: "ready"|"coming_soon"|"unavailable"|"browse"|"complete", route: string|null, label: string, cta: string|null }}
 */
export function resolveProgressionActionTarget({ nextAction, lang = "en" }) {
    const localeKey = lang === "gr" ? "gr" : "en";
    const copy = getContinueLearningCopy(localeKey);

    if (nextAction == null) {
        return {
            status: "complete",
            route: null,
            label: copy.pathComplete,
            cta: null,
        };
    }

    if (typeof nextAction !== "object") {
        return {
            status: "unavailable",
            route: null,
            label: copy.unknownAction,
            cta: copy.activityNotAvailable,
        };
    }

    const type = nextAction.type;

    if (type === "enrichment_xp") {
        return {
            status: "browse",
            route: localeKey === "gr" ? "/labs-gr" : "/labs",
            label: copy.enrichmentLabel,
            cta: copy.exploreEnrichment,
        };
    }

    if (type === "assessment") {
        const assessmentId = String(nextAction.assessmentId || "");
        return {
            status: "coming_soon",
            route: null,
            label: copy.evidenceLabels[assessmentId] || copy.assessmentDefault,
            cta: copy.assessmentComingSoon,
        };
    }

    if (type === "learning_module_evidence") {
        const evidenceId = String(nextAction.evidenceId || "");

        if (UNAVAILABLE_EVIDENCE_IDS.has(evidenceId)) {
            return {
                status: "unavailable",
                route: null,
                label: copy.evidenceLabels[evidenceId] || evidenceId,
                cta: copy.activityNotAvailable,
            };
        }

        const route = EVIDENCE_ROUTES[localeKey][evidenceId] ?? null;
        if (route) {
            return {
                status: "ready",
                route,
                label: copy.evidenceLabels[evidenceId] || evidenceId,
                cta: copy.continueArrow,
            };
        }

        return {
            status: "unavailable",
            route: null,
            label: copy.evidenceLabels[evidenceId] || evidenceId || copy.unknownAction,
            cta: copy.activityNotAvailable,
        };
    }

    return {
        status: "unavailable",
        route: null,
        label: copy.unknownAction,
        cta: copy.activityNotAvailable,
    };
}

export { EVIDENCE_ROUTES };
