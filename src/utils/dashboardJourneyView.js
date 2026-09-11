/**
 * Dashboard v2 Slice 1 — pure Journey presentation helpers.
 * Canonical progression is authoritative. Does not recompute tiers from XP.
 */

import {
  formatProgressionTierLabel,
  getModuleDisplayTitle,
} from "../content/continueLearningLocale.js";
import { getDashboardCompositionCopy } from "../content/dashboardCompositionLocale.js";
import { getDashboardJourneyCopy } from "../content/dashboardJourneyLocale.js";
import { isValidCanonicalProgression } from "./continueLearningView.js";
import { resolveProgressionActionTarget } from "./progressionActionMapper.js";
import { getLmChapterRoute } from "../content/lmRegistry.js";

export { isValidCanonicalProgression };

/**
 * Preserved historical Legacy Builder status for identity chrome only.
 * Uses canonical progression.earnedTier + currentPath.isLegacyBuilder.
 * Never derives from XP, metadata.tier, or milestone completion.
 *
 * @param {Record<string, unknown>|null|undefined} progression
 * @param {"en"|"gr"} [lang]
 * @returns {string|null}
 */
export function getLegacyBuilderStatusLabel(progression, lang = "en") {
  if (!progression || typeof progression !== "object" || Array.isArray(progression)) {
    return null;
  }
  const earned = String(progression.earnedTier || "").toLowerCase();
  if (earned !== "builder") return null;
  if (progression.currentPath?.isLegacyBuilder !== true) return null;
  return getDashboardCompositionCopy(lang).legacyBuilderStatus;
}

/** Canonical tier order for Journey UI — matches backend v2 milestone keys. */
export const JOURNEY_TIER_ORDER = Object.freeze(["explorer", "builder", "architect"]);

/**
 * Incremental modules per tier when milestones are absent.
 * Mirrors backend V2_MILESTONE_MODULES differences (Explorer 1–3, Builder 4–8, Architect 9–11).
 * Used only for presentation segmenting — completion still comes from progression.modules.
 */
export const FALLBACK_TIER_SEGMENTS = Object.freeze({
  explorer: Object.freeze(["LM01", "LM02", "LM03"]),
  builder: Object.freeze(["LM04", "LM05", "LM06", "LM07", "LM08"]),
  architect: Object.freeze(["LM09", "LM10", "LM11"]),
});

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function hasHistoricalWeb3EduRecord(value) {
  if (!value || typeof value !== "object") return false;
  const xp = Number(value.xp_total ?? value.xp ?? 0);
  if (Number.isFinite(xp) && xp > 0) return true;

  const labs =
    (value.labs_completed && typeof value.labs_completed === "object"
      ? value.labs_completed
      : null) ||
    (value.labs && typeof value.labs === "object" ? value.labs : null);
  if (labs && Object.keys(labs).length > 0) return true;

  const projects =
    (value.projectsCompleted && typeof value.projectsCompleted === "object"
      ? value.projectsCompleted
      : null) ||
    (value.projects_completed && typeof value.projects_completed === "object"
      ? value.projects_completed
      : null);
  if (projects && Object.keys(projects).length > 0) return true;

  if (Array.isArray(value.badges) && value.badges.length > 0) return true;
  if (Array.isArray(value.eventBadges) && value.eventBadges.length > 0) return true;
  if (Array.isArray(value.timeline) && value.timeline.length > 0) return true;

  return false;
}

/**
 * @param {Record<string, unknown>|null|undefined} progression
 * @returns {boolean}
 */
export function hasAnyLearningModuleCompletion(progression) {
  if (!isValidCanonicalProgression(progression)) return false;
  const modules = progression.modules;
  if (!modules || typeof modules !== "object") return false;
  return Object.values(modules).some(
    (entry) => entry && typeof entry === "object" && entry.complete === true
  );
}

/**
 * @param {Record<string, unknown>|null|undefined} milestones
 * @returns {Record<"explorer"|"builder"|"architect", string[]>}
 */
export function getJourneyTierModuleIds(milestones) {
  const fromMilestone = (tierKey) => {
    const entry = milestones?.[tierKey];
    const required = entry?.requiredModules;
    if (!Array.isArray(required) || required.length === 0) return null;
    return required.map((id) => String(id)).filter(Boolean);
  };

  const explorer = fromMilestone("explorer") ?? [...FALLBACK_TIER_SEGMENTS.explorer];
  const builderAll = fromMilestone("builder");
  const architectAll = fromMilestone("architect");

  const explorerSet = new Set(explorer);
  const builderCumSet = new Set(builderAll ?? [...explorer, ...FALLBACK_TIER_SEGMENTS.builder]);

  const builder = builderAll
    ? builderAll.filter((id) => !explorerSet.has(id))
    : [...FALLBACK_TIER_SEGMENTS.builder];

  const architect = architectAll
    ? architectAll.filter((id) => !builderCumSet.has(id))
    : [...FALLBACK_TIER_SEGMENTS.architect];

  return { explorer, builder, architect };
}

/**
 * Count completed modules in a segment from progression.modules only.
 * Never uses XP thresholds.
 *
 * @param {string[]} moduleIds
 * @param {Record<string, unknown>|null|undefined} modules
 */
export function countCompletedModules(moduleIds, modules) {
  if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
    return { done: 0, total: 0 };
  }
  const map = modules && typeof modules === "object" ? modules : {};
  let done = 0;
  for (const id of moduleIds) {
    const entry = map[id];
    if (entry && typeof entry === "object" && entry.complete === true) done += 1;
  }
  return { done, total: moduleIds.length };
}

/**
 * Authoritative legacy/grandfathered bridge path from canonical progression only.
 * @param {Record<string, unknown>|null|undefined} progression
 */
export function isAuthoritativeLegacyBridgePath(progression) {
  const path = progression?.currentPath;
  if (!path || typeof path !== "object") return false;
  if (path.isLegacyBuilder === true) return true;
  const alignment = String(path.alignmentStatus || "");
  if (
    alignment === "legacy_bridge_required" ||
    alignment === "legacy_bridge_complete"
  ) {
    return true;
  }
  const bridge = path.bridge;
  if (bridge && typeof bridge === "object") {
    if (bridge.required === true || bridge.complete === true) return true;
  }
  return false;
}

/**
 * Segment index for a module id within incremental journey segments.
 * @param {string|null|undefined} moduleId
 * @param {Record<string, string[]>} segments
 */
export function getSegmentIndexForModule(moduleId, segments) {
  if (!moduleId || typeof moduleId !== "string") return -1;
  return JOURNEY_TIER_ORDER.findIndex((tierKey) =>
    (segments[tierKey] || []).includes(moduleId)
  );
}

/**
 * Journey node status from canonical module completion + currentModule.
 * Does not use legacy XP tiers. Bridged labels require authoritative bridge fields.
 *
 * @param {Record<string, unknown>} progression
 * @returns {Array<{
 *   tierKey: string,
 *   label: string,
 *   status: "completed"|"current"|"bridged"|"locked",
 *   statusLabel: string,
 *   done: number,
 *   total: number,
 *   modulesLabel: string,
 * }>}
 */
export function getLearningJourneyNodes(progression, lang = "en") {
  const copy = getDashboardJourneyCopy(lang);
  const segments = getJourneyTierModuleIds(progression?.milestones);
  const modules = progression?.modules;

  const alignmentStatus = progression?.currentPath?.alignmentStatus;
  const isArchitectComplete =
    progression?.currentModule == null &&
    progression?.nextAction == null &&
    alignmentStatus === "architect_complete";

  const bridgePath = isAuthoritativeLegacyBridgePath(progression);

  const nodes = JOURNEY_TIER_ORDER.map((tierKey) => {
    const ids = segments[tierKey] ?? [];
    const { done, total } = countCompletedModules(ids, modules);
    // Prefer milestone.modulesSatisfied (module-based). Never use milestone.satisfied (includes XP).
    const milestoneModulesSatisfied =
      progression?.milestones?.[tierKey]?.modulesSatisfied === true;
    const segmentComplete =
      isArchitectComplete ||
      milestoneModulesSatisfied ||
      (total > 0 && done === total);

    return {
      tierKey,
      label: copy.tierLabels[tierKey] ?? formatProgressionTierLabel(tierKey, lang),
      segmentComplete,
      done,
      total,
      modulesLabel: copy.modulesCount(done, total),
    };
  });

  const currentModule =
    typeof progression?.currentModule === "string" ? progression.currentModule : null;
  const moduleSegmentIndex = getSegmentIndexForModule(currentModule, segments);

  // Prefer the segment that contains canonical currentModule / nextAction module.
  let currentIndex = -1;
  if (moduleSegmentIndex >= 0) {
    if (!nodes[moduleSegmentIndex].segmentComplete) {
      currentIndex = moduleSegmentIndex;
    } else {
      currentIndex = nodes.findIndex(
        (n, i) => i > moduleSegmentIndex && !n.segmentComplete
      );
    }
  }
  if (currentIndex < 0) {
    currentIndex = nodes.findIndex((n) => !n.segmentComplete);
  }
  if (isArchitectComplete) currentIndex = -1;
  if (currentIndex < 0 && !isArchitectComplete) currentIndex = 0;

  const lastIndex = JOURNEY_TIER_ORDER.length - 1;

  return nodes.map((node, index) => {
    let status;
    let statusLabel;

    if (node.segmentComplete) {
      status = "completed";
      statusLabel = copy.statusCompleted;
    } else if (index === currentIndex) {
      status = "current";
      // Presentation labels only — status remains "current".
      // Explorer with 0 done → Start here; Architect with 0 done → Not started;
      // any current segment with module progress → In progress.
      if (node.done === 0 && index === 0) {
        statusLabel = copy.statusStartHere;
      } else if (node.done === 0 && node.tierKey === "architect") {
        statusLabel = copy.statusNotStarted;
      } else {
        statusLabel = copy.statusInProgress;
      }
    } else if (
      index < currentIndex &&
      !node.segmentComplete &&
      bridgePath
    ) {
      // Incomplete earlier segment bypassed by authoritative legacy bridge — not Locked, not Completed.
      status = "bridged";
      statusLabel = copy.statusLegacyTransition;
    } else if (index > currentIndex) {
      status = "locked";
      if (index === currentIndex + 1) {
        statusLabel = copy.statusComingNext;
      } else if (index === lastIndex) {
        statusLabel = copy.statusFuture;
      } else {
        statusLabel = copy.statusLocked;
      }
    } else {
      status = "locked";
      statusLabel = copy.statusLocked;
    }

    return {
      tierKey: node.tierKey,
      label: node.label,
      status,
      statusLabel,
      done: node.done,
      total: node.total,
      modulesLabel: node.modulesLabel,
    };
  });
}

/**
 * @param {"legacy_start"|"fresh_start"|"active"|"complete"|"unavailable"} mode
 * @param {"en"|"gr"} lang
 */
function greetingForMode(mode, lang) {
  const copy = getDashboardJourneyCopy(lang);
  switch (mode) {
    case "legacy_start":
      return copy.greetingLegacy;
    case "active":
      return copy.greetingActive;
    case "complete":
      return copy.greetingComplete;
    case "unavailable":
      return copy.greetingUnavailable;
    case "fresh_start":
    default:
      return copy.greetingFresh;
  }
}

/**
 * Build next-step card when canonical nextAction has no actionable route.
 */
function buildUpcomingNextStep({
  copy,
  moduleId,
  moduleTitle,
  actionLabel,
  learnRoute,
}) {
  const titleParts = [moduleId, moduleTitle].filter(Boolean);
  return {
    variant: "upcoming",
    eyebrow: copy.nextMilestoneEyebrow,
    title: titleParts.length ? titleParts.join(" — ") : actionLabel || copy.comingSoon,
    body: actionLabel
      ? `${actionLabel}. ${copy.upcomingBody}`
      : copy.upcomingBody,
    bullets: null,
    actionLabel: actionLabel || null,
    primaryCta: null,
    primaryRoute: null,
    primaryEnabled: false,
    secondaryCta: copy.viewLearningPath,
    secondaryRoute: learnRoute,
    moduleId,
    moduleTitle,
    comingSoonLabel: copy.comingSoon,
    disabledReason: null,
  };
}

/**
 * @param {{
 *   progression?: Record<string, unknown>|null,
 *   hasHistoricalRecord?: boolean,
 *   progressionError?: boolean,
 *   lang?: "en"|"gr",
 * }} params
 */
export function getDashboardJourneyViewState({
  progression = null,
  hasHistoricalRecord = false,
  progressionError = false,
  lang = "en",
} = {}) {
  const copy = getDashboardJourneyCopy(lang);
  const locale = lang === "gr" ? "gr" : "en";
  const learnRoute = locale === "gr" ? "/learn-gr" : "/learn";

  if (progressionError && !isValidCanonicalProgression(progression)) {
    return {
      mode: "unavailable",
      greeting: copy.greetingUnavailable,
      showRecordPreserved: false,
      nextStep: null,
      journeyNodes: null,
      journeyNote: null,
      learnRoute,
      copy,
    };
  }

  if (!isValidCanonicalProgression(progression)) {
    return {
      mode: "unavailable",
      greeting: copy.greetingUnavailable,
      showRecordPreserved: false,
      nextStep: null,
      journeyNodes: null,
      journeyNote: null,
      learnRoute,
      copy,
    };
  }

  const alignmentStatus = progression.currentPath?.alignmentStatus;
  const isArchitectComplete =
    progression.currentModule == null &&
    progression.nextAction == null &&
    alignmentStatus === "architect_complete";

  const hasLmProgress = hasAnyLearningModuleCompletion(progression);
  /** @type {"legacy_start"|"fresh_start"|"active"|"complete"} */
  let mode;
  if (isArchitectComplete) mode = "complete";
  else if (hasLmProgress) mode = "active";
  else if (hasHistoricalRecord) mode = "legacy_start";
  else mode = "fresh_start";

  const action = resolveProgressionActionTarget({
    nextAction: progression.nextAction ?? null,
    lang: locale,
  });

  const moduleId =
    typeof progression.currentModule === "string" ? progression.currentModule : null;
  const moduleTitle = getModuleDisplayTitle(moduleId, locale);
  const moduleRoute = moduleId ? getLmChapterRoute(moduleId, locale) : null;

  const actionReady =
    (action.status === "ready" || action.status === "browse") &&
    Boolean(action.route);

  const nextStep = (() => {
    if (mode === "complete") {
      return {
        variant: "complete",
        eyebrow: copy.continueEyebrow,
        title: copy.pathCompleteTitle,
        body: copy.pathCompleteBody,
        actionLabel: action.label,
        primaryCta: copy.browseLearn,
        primaryRoute: learnRoute,
        primaryEnabled: true,
        secondaryCta: null,
        secondaryRoute: null,
        moduleId: null,
        moduleTitle: null,
      };
    }

    // Canonical nextAction exists but has no actionable route — do not show fake Continue.
    if (progression.nextAction != null && !actionReady) {
      return buildUpcomingNextStep({
        copy,
        moduleId,
        moduleTitle,
        actionLabel: action.label,
        learnRoute,
      });
    }

    if (mode === "legacy_start" || mode === "fresh_start") {
      return {
        variant: "start",
        eyebrow: copy.startJourneyEyebrow,
        title: copy.startJourneyTitle,
        body: action.label || null,
        bullets: copy.startJourneyBullets,
        actionLabel: action.label,
        primaryCta: copy.startCta(moduleId),
        primaryRoute: actionReady ? action.route : null,
        primaryEnabled: actionReady,
        secondaryCta: moduleRoute ? copy.viewModuleDetails : null,
        secondaryRoute: moduleRoute,
        moduleId,
        moduleTitle,
        disabledReason: null,
      };
    }

    // active + actionable route
    const titleParts = [moduleId, moduleTitle].filter(Boolean);
    return {
      variant: "continue",
      eyebrow: copy.continueEyebrow,
      title: titleParts.length ? titleParts.join(" — ") : action.label,
      body: action.label,
      bullets: null,
      actionLabel: action.label,
      primaryCta: copy.continueCta,
      primaryRoute: action.route,
      primaryEnabled: true,
      secondaryCta: moduleRoute ? copy.viewModuleDetails : null,
      secondaryRoute: moduleRoute,
      moduleId,
      moduleTitle,
      disabledReason: null,
    };
  })();

  const journeyNodes = getLearningJourneyNodes(progression, locale);

  let journeyNote = null;
  if (mode === "legacy_start" || mode === "fresh_start") {
    journeyNote = {
      tone: "info",
      text: copy.legacyJourneyNote,
    };
  } else if (
    isAuthoritativeLegacyBridgePath(progression) &&
    journeyNodes.some((n) => n.status === "bridged")
  ) {
    journeyNote = {
      tone: "info",
      text: copy.bridgeJourneyNote,
    };
  }
  // Active milestone detail lives on the primary Next Action card — avoid duplicating here.

  return {
    mode,
    greeting: greetingForMode(mode, locale),
    showRecordPreserved: mode === "legacy_start",
    nextStep,
    journeyNodes,
    journeyNote,
    learnRoute,
    action,
    copy,
  };
}
