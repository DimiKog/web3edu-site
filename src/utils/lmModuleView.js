/**
 * Pure LM page view helpers — map canonical progression → presentation.
 * Never invents completion for resources/simulators.
 * Never owns curriculum rules: evidence satisfaction, module.complete, XP, tiers.
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
 * @param {object|null|undefined} moduleEntry
 * @param {string} evidenceId
 * @returns {boolean|null} true/false when canonical entry exists; null when absent
 */
export function getCanonicalEvidenceSatisfied(moduleEntry, evidenceId) {
  if (!evidenceId || !moduleEntry || typeof moduleEntry !== "object") return null;
  const map = moduleEntry.requiredEvidence;
  if (!map || typeof map !== "object") return null;
  const entry = map[evidenceId];
  if (!entry || typeof entry !== "object") return null;
  return Boolean(entry.satisfied);
}

/**
 * @param {object|null|undefined} moduleEntry
 */
export function moduleHasUnsatisfiedPracticalEvidence(moduleEntry) {
  const map = moduleEntry?.requiredEvidence;
  if (!map || typeof map !== "object") return false;
  return Object.keys(map).some((evidenceId) => {
    const entry = map[evidenceId];
    return !(entry && typeof entry === "object" && entry.satisfied);
  });
}

/**
 * Assessment presentation from canonical module.assessment only.
 * @param {object|null} moduleEntry
 * @param {"en"|"gr"} lang
 * @param {{
 *   canonical?: boolean,
 *   fallbackAssessmentId?: string|null,
 *   moduleId?: string,
 * }} [options]
 */
export function getLmAssessmentPresentation(moduleEntry, lang = "en", options = {}) {
  const moduleId =
    typeof options.moduleId === "string" && options.moduleId
      ? options.moduleId
      : "LM01";
  const copy = getLmPageCopy(lang, moduleId);
  const canonical = options.canonical === true;
  const assessment = moduleEntry?.assessment;
  const fallbackId =
    typeof options.fallbackAssessmentId === "string" && options.fallbackAssessmentId
      ? options.fallbackAssessmentId
      : null;
  const assessmentId =
    typeof assessment?.id === "string" && assessment.id
      ? assessment.id
      : fallbackId;
  const passed = Boolean(assessment?.passed);
  const route = assessmentId
    ? ASSESSMENT_ROUTES[lang === "gr" ? "gr" : "en"][assessmentId] || null
    : null;

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
 * Sidebar / evidence checklist from canonical moduleEntry + presentation wiring.
 * Practical IDs come only from moduleEntry.requiredEvidence; titles from activities.
 * @param {object|null} moduleEntry
 * @param {Array<object>} activities registry (or row) activities with optional evidenceId
 * @param {"en"|"gr"} lang
 * @param {{
 *   canonical?: boolean,
 *   moduleId?: string,
 *   assessment?: ReturnType<typeof getLmAssessmentPresentation>|null,
 * }} [options]
 */
export function getLmRequiredEvidenceListPresentation(
  moduleEntry,
  activities = [],
  lang = "en",
  options = {}
) {
  const moduleId =
    typeof options.moduleId === "string" && options.moduleId
      ? options.moduleId
      : "LM01";
  const copy = getLmPageCopy(lang, moduleId);
  const locale = lang === "gr" ? "gr" : "en";
  const canonical = options.canonical === true;
  const assessment =
    options.assessment ??
    getLmAssessmentPresentation(moduleEntry, locale, {
      canonical,
      moduleId,
    });
  /** @type {Array<object>} */
  const items = [];

  const reqMap = moduleEntry?.requiredEvidence;
  if (reqMap && typeof reqMap === "object") {
    for (const evidenceId of Object.keys(reqMap)) {
      const entry = reqMap[evidenceId];
      const satisfied =
        entry && typeof entry === "object" ? Boolean(entry.satisfied) : false;
      const activity = activities.find(
        (a) => a && (a.evidenceId === evidenceId || a.id === evidenceId)
      );
      const title =
        (activity &&
          (activity.title?.[locale] ||
            activity.title?.en ||
            activity.title)) ||
        evidenceId;
      const href =
        activity?.href ||
        (activity ? resolveLmActivityHref(activity, locale) : null) ||
        null;
      items.push({
        id: evidenceId,
        kind: "practical",
        evidenceId,
        title,
        satisfied: canonical ? satisfied : false,
        requirementLabel: copy.evidenceRequired,
        statusLabel: !canonical
          ? null
          : satisfied
            ? copy.evidenceSatisfied
            : null,
        route: typeof href === "string" ? href : null,
        ctaLabel: href ? copy.continueActivity : null,
      });
    }
  }

  if (assessment?.required !== false) {
    const assessmentActivity = activities.find(
      (a) =>
        a &&
        (a.visualType === "assessment" ||
          a.evidenceId === assessment.assessmentId)
    );
    const title =
      (assessmentActivity &&
        (assessmentActivity.title?.[locale] ||
          assessmentActivity.title?.en ||
          assessmentActivity.title)) ||
      copy.assessmentTitle;
    items.push({
      id: assessment.assessmentId || "assessment",
      kind: "assessment",
      evidenceId: assessment.assessmentId || null,
      title,
      satisfied: canonical ? Boolean(assessment.passed) : false,
      requirementLabel: copy.assessmentRequired,
      statusLabel: assessment.statusLabel,
      route: assessment.route || null,
      ctaLabel: assessment.ctaLabel,
    });
  }

  return items;
}

/**
 * Activity row presentation. Resources never show evidence completion.
 * Practical rows with evidenceId wire to moduleEntry.requiredEvidence only.
 * @param {object} activity
 * @param {object|null} moduleEntry
 * @param {"en"|"gr"} lang
 * @param {{ canonical?: boolean, moduleId?: string }} [options]
 */
export function getLmActivityRowPresentation(activity, moduleEntry, lang = "en", options = {}) {
  const locale = lang === "gr" ? "gr" : "en";
  const canonical = options.canonical === true;
  const moduleId = typeof options.moduleId === "string" ? options.moduleId : "LM01";
  const copy = getLmPageCopy(lang, moduleId);
  const href = resolveLmActivityHref(activity, locale);
  const isAssessment = activity.visualType === "assessment";
  const isSimulator = activity.linkKind === "embed";
  const evidenceId =
    typeof activity.evidenceId === "string" && activity.evidenceId.trim()
      ? activity.evidenceId.trim()
      : null;
  const assessment = isAssessment
    ? getLmAssessmentPresentation(moduleEntry, locale, {
        canonical,
        moduleId,
        fallbackAssessmentId: evidenceId,
      })
    : null;

  const practicalSatisfied =
    !isAssessment && evidenceId
      ? getCanonicalEvidenceSatisfied(moduleEntry, evidenceId)
      : null;
  const hasPracticalEvidenceWiring = practicalSatisfied !== null;

  let statusKind = "available";
  let statusLabel = copy.resourceAvailable;

  if (activity.requirementHint === "optional") {
    statusKind = "optional";
    statusLabel = copy.resourceOptional;
  } else if (activity.requirementHint === "core") {
    statusKind = "core";
    statusLabel = copy.resourceCore;
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

  if (hasPracticalEvidenceWiring && canonical) {
    statusKind = practicalSatisfied ? "evidence_satisfied" : "evidence_required";
    statusLabel = practicalSatisfied ? copy.evidenceSatisfied : copy.evidenceRequired;
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
  } else if (activity.linkKind === "internal" && href) {
    ctaLabel = copy.continueActivity;
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
    evidenceId,
    evidenceSatisfied: hasPracticalEvidenceWiring
      ? canonical
        ? practicalSatisfied
        : null
      : isAssessment
        ? assessment?.passed ?? null
        : null,
    statusKind,
    statusLabel,
    ctaLabel,
    assessmentPassed: assessment?.passed ?? null,
  };
}

/**
 * Canonical next required step for the chapter being viewed.
 * Presentation only — does not invent curriculum order.
 * @param {{
 *   progressionValid?: boolean,
 *   complete?: boolean,
 *   moduleId?: string,
 *   currentModule?: string|null,
 *   nextAction?: object|null,
 *   nextRequiredEvidence?: string|null,
 *   moduleEntry?: object|null,
 *   activities?: Array<object>,
 *   assessment?: object|null,
 * }} view
 * @param {"en"|"gr"} lang
 */
export function getLmNextRequiredStepPresentation(view, lang = "en") {
  const locale = lang === "gr" ? "gr" : "en";
  const moduleId = view?.moduleId || "LM01";
  const copy = getLmPageCopy(lang, moduleId);
  const assessment = view?.assessment || null;
  const activities = Array.isArray(view?.activities) ? view.activities : [];

  const assessmentTitle =
    activities.find((a) => a.visualType === "assessment")?.title ||
    copy.assessmentTitle;

  if (view?.complete) {
    return null;
  }

  if (!view?.progressionValid) {
    return {
      kind: "assessment",
      evidenceId: null,
      assessmentId: assessment?.assessmentId || null,
      title: assessmentTitle,
      body: copy.closingNextBody,
      route: assessment?.route || null,
      ctaLabel: copy.openAssessment,
      visualSrc: view?.presentation?.visuals?.nextStep || null,
    };
  }

  const nextAction =
    view.nextAction && typeof view.nextAction === "object" ? view.nextAction : null;
  const actionForThisModule =
    nextAction && nextAction.moduleId === moduleId ? nextAction : null;

  const findActivityForEvidence = (evidenceId) =>
    activities.find(
      (a) => a && (a.evidenceId === evidenceId || a.id === evidenceId)
    );

  const buildEvidenceStep = (evidenceId) => {
    const activity = findActivityForEvidence(evidenceId);
    const mapped = resolveProgressionActionTarget({
      nextAction: {
        type: "learning_module_evidence",
        moduleId,
        evidenceId,
      },
      lang: locale,
    });
    const route =
      (typeof activity?.href === "string" && activity.href) ||
      (mapped.status === "ready" ? mapped.route : null) ||
      null;
    return {
      kind: "evidence",
      evidenceId,
      assessmentId: null,
      title: activity?.title || mapped.label || evidenceId,
      body: copy.closingNextEvidenceBody,
      route,
      ctaLabel: route ? copy.continueActivity : null,
      visualSrc: view?.presentation?.visuals?.nextStep || null,
    };
  };

  const buildAssessmentStep = () => ({
    kind: "assessment",
    evidenceId: null,
    assessmentId: assessment?.assessmentId || null,
    title: assessmentTitle,
    body: copy.closingNextBody,
    route: assessment?.route || null,
    ctaLabel: copy.openAssessment,
    visualSrc: view?.presentation?.visuals?.nextStep || null,
  });

  if (actionForThisModule?.type === "learning_module_evidence") {
    const evidenceId = String(actionForThisModule.evidenceId || "");
    if (evidenceId) return buildEvidenceStep(evidenceId);
  }

  if (actionForThisModule?.type === "assessment") {
    return buildAssessmentStep();
  }

  // Module-local presentation when this chapter is the canonical current module.
  if (view.currentModule === moduleId) {
    const nextEvidence =
      typeof view.nextRequiredEvidence === "string" && view.nextRequiredEvidence
        ? view.nextRequiredEvidence
        : null;
    if (nextEvidence) {
      return buildEvidenceStep(nextEvidence);
    }
    if (assessment && assessment.required !== false && !assessment.passed) {
      return buildAssessmentStep();
    }
  }

  // nextAction targets another module, or currentModule has moved on while this
  // module remains incomplete (e.g. legacy Builder bridge). Do not invent a step.
  return {
    kind: "neutral",
    evidenceId: null,
    assessmentId: null,
    title: moduleId,
    body: copy.closingNeutralBody,
    route: null,
    ctaLabel: null,
    visualSrc: view?.presentation?.visuals?.nextStep || null,
  };
}

/**
 * Learn → Explore → Assess → Complete visual. Learner fill comes only from
 * canonical assessment/module/evidence completion — never from resource opens.
 * @param {{
 *   progressionValid?: boolean,
 *   complete?: boolean,
 *   assessment?: { passed?: boolean },
 *   moduleEntry?: object|null,
 * }} view
 * @param {"en"|"gr"} lang
 */
export function getLmProgressStages(view, lang = "en") {
  const copy = getLmPageCopy(lang, view?.moduleId || "LM01");
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

  const practicalPending = moduleHasUnsatisfiedPracticalEvidence(
    view.moduleEntry ?? null
  );
  const assessmentPassed = Boolean(view.assessment?.passed);

  if (practicalPending) {
    return [
      { ...stages[0], state: "open" },
      { ...stages[1], state: "current" },
      { ...stages[2], state: "idle" },
      { ...stages[3], state: "idle" },
    ];
  }

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
  const copy = getLmPageCopy(lang, view?.moduleId || "LM01");
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
 * Chapter-ending CTA from canonical complete + nextRequiredStep only.
 * @param {object} view
 * @param {"en"|"gr"} lang
 */
export function getLmClosingCtaPresentation(view, lang = "en") {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLmPageCopy(lang, view?.moduleId || "LM01");

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

  const step =
    view?.nextRequiredStep ||
    getLmNextRequiredStepPresentation(view, locale);

  if (!step || step.kind === "neutral") {
    return {
      kind: "neutral",
      eyebrow: copy.nextRequired,
      title: step?.title || view?.moduleId || "",
      body: step?.body || copy.closingNeutralBody,
      currentModule: null,
      currentModuleTitle: null,
      route: null,
      ctaLabel: null,
      visualSrc:
        step?.visualSrc || view?.presentation?.visuals?.nextStep || null,
    };
  }

  if (step.kind === "evidence") {
    return {
      kind: "next_evidence",
      eyebrow: copy.nextRequired,
      title: step.title,
      body: step.body,
      currentModule: null,
      currentModuleTitle: null,
      route: step.route,
      ctaLabel: step.ctaLabel,
      visualSrc: step.visualSrc,
    };
  }

  // assessment (LM01 incomplete default)
  return {
    kind: "next_assessment",
    eyebrow: copy.nextRequired,
    title: step.title,
    body: step.body,
    currentModule: null,
    currentModuleTitle: null,
    route: step.route,
    ctaLabel: step.ctaLabel || copy.openAssessment,
    visualSrc: step.visualSrc,
  };
}

/**
 * Full LM page view-model from canonical progression + presentation registry.
 * @param {unknown} progression
 * @param {"en"|"gr"} lang
 * @param {string} [moduleId]
 */
export function getLmPageViewState(progression, lang = "en", moduleId = "LM01") {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLmPageCopy(lang, moduleId);
  const presentation = getLmPresentationModule(moduleId);
  const moduleEntry = getCanonicalModuleEntry(progression, moduleId);
  const valid = isValidCanonicalProgression(progression);

  if (!presentation) {
    return { mode: "missing_module" };
  }

  const registryActivities = getLmVisibleActivities(moduleId, locale);
  const assessmentActivity = registryActivities.find(
    (a) => a && a.visualType === "assessment"
  );
  const fallbackAssessmentId =
    typeof assessmentActivity?.evidenceId === "string"
      ? assessmentActivity.evidenceId
      : null;
  const assessment = getLmAssessmentPresentation(moduleEntry, locale, {
    canonical: valid,
    moduleId,
    fallbackAssessmentId,
  });
  const activities = registryActivities.map((activity) =>
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

  const requiredEvidenceItems = getLmRequiredEvidenceListPresentation(
    moduleEntry,
    registryActivities,
    locale,
    { canonical: valid, assessment, moduleId }
  );

  const view = {
    mode: "ready",
    moduleId,
    presentation,
    pageCopy: copy,
    title: presentation.title[locale] || presentation.title.en,
    transitionFrom: presentation.transition.from[locale],
    transitionTo: presentation.transition.to[locale],
    about: presentation.about[locale],
    learningOutcomes: presentation.learningOutcomes[locale] || [],
    learnerMeta: getLmLearnerMeta(moduleId, locale),
    activities,
    assessment,
    requiredEvidenceItems,
    moduleEntry,
    complete,
    moduleStatusLabel,
    progressionValid: valid,
    earnedTier,
    earnedTierLabel,
    currentModule: valid ? progression.currentModule ?? null : null,
    targetTier: valid ? progression.currentPath?.targetTier ?? null : null,
    computedTier: valid ? progression.computedTier ?? null : null,
    nextAction: valid ? progression.nextAction ?? null : null,
    nextRequiredEvidence: valid ? progression.nextRequiredEvidence ?? null : null,
  };

  view.nextRequiredStep = getLmNextRequiredStepPresentation(view, locale);
  view.progressStages = getLmProgressStages(view, locale);
  view.overallPath = getLmOverallPathPresentation(view, locale);
  view.closingCta = getLmClosingCtaPresentation(view, locale);

  return view;
}

export { isValidCanonicalProgression };
