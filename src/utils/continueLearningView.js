import {
    formatProgressionTierLabel,
    getContinueLearningCopy,
    getModuleDisplayTitle,
} from "../content/continueLearningLocale.js";
import { resolveProgressionActionTarget } from "./progressionActionMapper.js";

/**
 * @param {unknown} progression
 * @returns {progression is Record<string, unknown>}
 */
export function isValidCanonicalProgression(progression) {
    return (
        progression != null &&
        typeof progression === "object" &&
        !Array.isArray(progression) &&
        typeof progression.earnedTier === "string"
    );
}

/**
 * Pure view-model for ContinueLearningCard — no tier/XP recomputation.
 *
 * @param {Record<string, unknown>|null|undefined} progression
 * @param {"en"|"gr"} lang
 */
export function getContinueLearningViewState(progression, lang = "en") {
    const copy = getContinueLearningCopy(lang);

    if (!isValidCanonicalProgression(progression)) {
        return { mode: "invalid" };
    }

    const alignmentStatus = progression.currentPath?.alignmentStatus;
    const isArchitectComplete =
        progression.currentModule == null &&
        progression.nextAction == null &&
        alignmentStatus === "architect_complete";

    const earnedTierLabel = formatProgressionTierLabel(progression.earnedTier, lang);
    const targetTier = progression.currentPath?.targetTier;
    const pathLabel =
        targetTier != null
            ? `${copy.toward} ${formatProgressionTierLabel(String(targetTier), lang)}`
            : null;

    if (isArchitectComplete) {
        return {
            mode: "complete",
            earnedTierLabel: formatProgressionTierLabel("architect", lang),
            pathCompleteLabel: copy.pathComplete,
        };
    }

    const moduleId =
        typeof progression.currentModule === "string" ? progression.currentModule : null;
    const moduleTitle = getModuleDisplayTitle(moduleId, lang);
    const action = resolveProgressionActionTarget({
        nextAction: progression.nextAction ?? null,
        lang,
    });

    const xp = progression.xp;
    const xpLine =
        xp &&
        typeof xp === "object" &&
        typeof xp.current === "number" &&
        typeof xp.nextTierXp === "number" &&
        xp.nextTierXp > 0
            ? copy.xpToward(xp.current, xp.nextTierXp)
            : null;

    return {
        mode: "active",
        earnedTierLabel,
        pathLabel,
        moduleId,
        moduleTitle,
        action,
        xpLine,
    };
}
