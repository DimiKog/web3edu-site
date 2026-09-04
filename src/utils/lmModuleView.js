/**
 * Pure LM page view helpers — map canonical progression → presentation.
 * Never invents completion for resources/simulators.
 */

import { ASSESSMENT_ROUTES, resolveProgressionActionTarget } from "./progressionActionMapper.js";
import {
  getLmActivityVisualSrc,
  getLmLearnerMeta,
  getLmPresentationModule,
  getLmVisibleActivities,
  resolveLmActivityHref,
} from "../content/lmRegistry.js";
import { getLmPageCopy } from "../content/lmPageLocale.js";
import {
  formatProgressionTierLabel,
  getModuleDisplayTitle,
} from "../content/continueLearningLocale.js";
import { isValidCanonicalProgression } from "./continueLearningView.js";

/**
 * @param {unknown} progression
 * @param {string} moduleId
 */
export function getCanonicalModuleEntry(progression, moduleId) {
  if (!isValidCanonicalProgression(progression)) return null;
  const modules = progression.modules;
  if (!modules || typeof modules !== "object") return null;
  const entry = modules[moduleId];
  return entry && typeof entry === "object" ? entry : null;
}

/**
 * Assessment presentation from canonical module.assessment only.
 * @param {object|null} moduleEntry
 * @param {"en"|"gr"} lang
 * @param {{ canonical?: boolean }} [options]
 */
export function getLmAssessmentPresentation(moduleEntry, lang = "en", options = {}) {
  const copy = getLmPageCopy(lang);
  const canonical = options.canonical === true;
  const assessment = moduleEntry?.assessment;
  const assessmentId =
    typeof assessment?.id === "string" && assessment.id
      ? assessment.id
      : "lm01-assessment";
  const passed = Boolean(assessment?.passed);
  const route =
    ASSESSMENT_ROUTES[lang === "gr" ? "gr" : "en"][assessmentId] || null;

  return {
    assessmentId,
    passed,
    required: assessment?.required !== false,
    route,
    statusLabel: !canonical
      ? null
      : passed
        ? copy.assessmentPassed
        : copy.assessmentNotPassed,
    ctaLabel: passed ? copy.reviewAssessment : copy.openAssessment,
  };
}

/**
 * Activity row presentation. Resources never show "Completed".
 * @param {object} activity
 * @param {object|null} moduleEntry
 * @param {"en"|"gr"} lang
 * @param {{ canonical?: boolean, moduleId?: string }} [options]
 */
export function getLmActivityRowPresentation(activity, moduleEntry, lang = "en", options = {}) {
  const copy = getLmPageCopy(lang);
  const locale = lang === "gr" ? "gr" : "en";
  const canonical = options.canonical === true;
  const moduleId = typeof options.moduleId === "string" ? options.moduleId : "LM01";
  const href = resolveLmActivityHref(activity, locale);
  const isAssessment = activity.visualType === "assessment";
  const isSimulator = activity.linkKind === "embed";
  const assessment = isAssessment
    ? getLmAssessmentPresentation(moduleEntry, locale, { canonical })
    : null;

  let statusKind = "available";
  let statusLabel = copy.resourceAvailable;

  if (activity.requirementHint === "optional") {
    statusKind = "optional";
    statusLabel = copy.resourceOptional;
  } else if (activity.requirementHint === "recommended") {
    statusKind = "recommended";
    statusLabel = copy.resourceRecommended;
  }

  if (activity.linkKind === "external") {
    statusKind = activity.requirementHint === "optional" ? "optional" : "external";
    statusLabel =
      activity.requirementHint === "optional"
        ? copy.resourceOptional
        : copy.resourceExternal;
  }

  if (isSimulator) {
    statusKind = "interactive";
    statusLabel = copy.simulatorInteractive;
  }

  if (isAssessment && assessment) {
    statusKind = canonical && assessment.passed ? "assessment_passed" : "assessment_required";
    statusLabel =
      canonical && assessment.passed ? copy.assessmentPassed : copy.assessmentRequired;
  }

  let ctaLabel = null;
  if (isAssessment) {
    ctaLabel = assessment?.ctaLabel;
  } else if (isSimulator) {
    ctaLabel = copy.openSimulator;
  } else if (activity.linkKind === "external") {
    ctaLabel = activity.visualType === "demo" ? copy.openDemo : copy.openExternal;
  }

  return {
    id: activity.id,
    visualType: activity.visualType,
    visualSrc: getLmActivityVisualSrc(moduleId, activity.visualType),
    typeLabel: copy.typeLabels[activity.visualType] || activity.visualType,
    title: activity.title?.[locale] || activity.title?.en || activity.id,
    description:
      activity.description?.[locale] || activity.description?.en || "",
    requirementHint: activity.requirementHint,
    linkKind: activity.linkKind,
    href: isAssessment ? assessment?.route || href : href,
    embed: isSimulator,
    presentationOnly: Boolean(activity.presentationOnly),
    statusKind,
    statusLabel,
    ctaLabel,
    assessmentPassed: assessment?.passed ?? null,
  };
}

/**
 * Learn → Explore → Assess → Complete visual. Learner fill comes only from
 * canonical assessment/module completion — never from resource opens.
 * @param {{ progressionValid?: boolean, complete?: boolean, assessment?: { passed?: boolean } }} view
 * @param {"en"|"gr"} lang
 */
export function getLmProgressStages(view, lang = "en") {
  const copy = getLmPageCopy(lang);
  const stages = [
    { id: "learn", label: copy.stageLearn },
    { id: "explore", label: copy.stageExplore },
    { id: "assess", label: copy.stageAssess },
    { id: "complete", label: copy.stageComplete },
  ];

  if (!view?.progressionValid) {
    return stages.map((stage) => ({ ...stage, state: "idle" }));
  }

  if (view.complete) {
    return stages.map((stage) => ({ ...stage, state: "done" }));
  }

  const assessmentPassed = Boolean(view.assessment?.passed);
  return [
    { ...stages[0], state: "open" },
    { ...stages[1], state: "open" },
    { ...stages[2], state: assessmentPassed ? "done" : "current" },
    { ...stages[3], state: "idle" },
  ];
}

/**
 * Explorer → Builder → Architect journey using canonical tier fields only.
 * Does not compute eligibility or module-count progress.
 * @param {{
 *   progressionValid?: boolean,
 *   earnedTier?: string|null,
 *   computedTier?: string|null,
 *   targetTier?: string|null,
 *   earnedTierLabel?: string|null,
 *   currentModule?: string|null,
 * }} view
 * @param {"en"|"gr"} lang
 */
export function getLmOverallPathPresentation(view, lang = "en") {
  const copy = getLmPageCopy(lang);
  const defs = [
    { key: "explorer", title: copy.tierExplorer, description: copy.tierExplorerBody },
    { key: "builder", title: copy.tierBuilder, description: copy.tierBuilderBody },
    { key: "architect", title: copy.tierArchitect, description: copy.tierArchitectBody },
  ];

  if (!view?.progressionValid) {
    return {
      currentModule: null,
      earnedTierLabel: null,
      tiers: defs.map((tier) => ({ ...tier, state: "idle" })),
    };
  }

  const earned = String(view.earnedTier || "").toLowerCase();
  const computed = String(view.computedTier || "").toLowerCase();
  const target = String(view.targetTier || "").toLowerCase();

  return {
    currentModule: view.currentModule || null,
    earnedTierLabel: view.earnedTierLabel || null,
    tiers: defs.map((tier) => {
      let state = "idle";
      if (tier.key === earned) state = "earned";
      else if (tier.key === computed) state = "computed";
      else if (tier.key === target) state = "target";
      return { ...tier, state };
    }),
  };
}

/**
 * Chapter-ending CTA. Incomplete LM01 always points at the assessment.
 * Complete LM01 acknowledges completion and continues only if canonical
 * nextAction already has a ready route (never invents LM02).
 * @param {object} view
 * @param {"en"|"gr"} lang
 */
export function getLmClosingCtaPresentation(view, lang = "en") {
  const copy = getLmPageCopy(lang);
  const locale = lang === "gr" ? "gr" : "en";

  if (view?.complete) {
    const action = resolveProgressionActionTarget({
      nextAction: view.nextAction ?? null,
      lang: locale,
    });
    const assessmentRoute = view.assessment?.route || null;
    const continueReady =
      action.status === "ready" &&
      Boolean(action.route) &&
      action.route !== assessmentRoute;
    const currentModule =
      view.currentModule && view.currentModule !== view.moduleId
        ? view.currentModule
        : null;

    return {
      kind: "complete",
      eyebrow: copy.statusComplete,
      title: view.moduleId,
      body: copy.moduleCompleteBody,
      currentModule,
      currentModuleTitle: currentModule
        ? getModuleDisplayTitle(currentModule, locale)
        : null,
      route: continueReady ? action.route : null,
      ctaLabel: continueReady ? action.cta : null,
      visualSrc: view.presentation?.visuals?.completion || null,
    };
  }

  return {
    kind: "next_assessment",
    eyebrow: copy.nextRequired,
    title: copy.assessmentTitle,
    body: copy.closingNextBody,
    currentModule: null,
    currentModuleTitle: null,
    route: view?.assessment?.route || null,
    ctaLabel: copy.openAssessment,
    visualSrc: view?.presentation?.visuals?.nextStep || null,
  };
}

/**
 * Full LM01 page view-model from canonical progression + presentation registry.
 * @param {unknown} progression
 * @param {"en"|"gr"} lang
 * @param {string} [moduleId]
 */
export function getLmPageViewState(progression, lang = "en", moduleId = "LM01") {
  const copy = getLmPageCopy(lang);
  const locale = lang === "gr" ? "gr" : "en";
  const presentation = getLmPresentationModule(moduleId);
  const moduleEntry = getCanonicalModuleEntry(progression, moduleId);
  const valid = isValidCanonicalProgression(progression);

  if (!presentation) {
    return { mode: "missing_module" };
  }

  const assessment = getLmAssessmentPresentation(moduleEntry, locale, {
    canonical: valid,
  });
  const activities = getLmVisibleActivities(moduleId, locale).map((activity) =>
    getLmActivityRowPresentation(activity, moduleEntry, locale, {
      canonical: valid,
      moduleId,
    })
  );

  const complete = Boolean(valid && moduleEntry?.complete);
  const moduleStatusLabel = !valid
    ? copy.statusUnavailable
    : complete
      ? copy.statusComplete
      : copy.statusInProgress;

  const earnedTier = valid ? progression.earnedTier ?? null : null;
  const earnedTierLabel = valid
    ? formatProgressionTierLabel(earnedTier, locale)
    : null;

  const view = {
    mode: "ready",
    moduleId,
    presentation,
    title: presentation.title[locale] || presentation.title.en,
    transitionFrom: presentation.transition.from[locale],
    transitionTo: presentation.transition.to[locale],
    about: presentation.about[locale],
    learningOutcomes: presentation.learningOutcomes[locale] || [],
    learnerMeta: getLmLearnerMeta(moduleId, locale),
    activities,
    assessment,
    complete,
    moduleStatusLabel,
    progressionValid: valid,
    earnedTier,
    earnedTierLabel,
    currentModule: valid ? progression.currentModule ?? null : null,
    targetTier: valid ? progression.currentPath?.targetTier ?? null : null,
    computedTier: valid ? progression.computedTier ?? null : null,
    nextAction: valid ? progression.nextAction ?? null : null,
  };

  view.progressStages = getLmProgressStages(view, locale);
  view.overallPath = getLmOverallPathPresentation(view, locale);
  view.closingCta = getLmClosingCtaPresentation(view, locale);

  return view;
}

export { isValidCanonicalProgression };
