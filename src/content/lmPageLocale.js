/**
 * LM student page chrome copy (EN + GR).
 * Presentation only — no progression authority.
 *
 * Shared strings live in LM_PAGE_COPY. Module-specific overrides
 * (titles, completion explanations, About mix) live in LM_MODULE_PAGE_CHROME.
 * Default moduleId is LM01 so existing callers stay LM01-correct.
 */

export const LM_PAGE_COPY = {
  en: {
    breadcrumbLearn: "Learn",
    breadcrumbExplorer: "Explorer Path",
    pathBadge: "Explorer Path",
    moduleOf: (n, total) => `Module ${n} of ${total}`,
    fromLabel: "From",
    toLabel: "To",
    whatYoullLearn: "What you'll learn",
    learningPath: "Your Learning Path",
    learningPathIntro:
      "Learn organizes the journey. Activities and resources help you practice — only the required assessment counts as LM01 completion evidence.",
    sidebarProgress: "Your progress in LM01",
    sidebarEvidence: "Required evidence",
    sidebarAbout: "About this module",
    sidebarOverall: "Your overall path",
    statusComplete: "Module complete",
    statusInProgress: "In progress",
    statusUnavailable: "Sign in to view progress",
    assessmentPassed: "Assessment passed",
    assessmentNotPassed: "Not passed",
    assessmentTitle: "LM01 Assessment",
    assessmentRequired: "Required",
    evidenceSatisfied: "Evidence recorded",
    evidenceRequired: "Required",
    resourceAvailable: "Available",
    resourceExternal: "External resource",
    resourceRecommended: "Recommended",
    resourceCore: "Core",
    resourceOptional: "Optional",
    simulatorInteractive: "Interactive activity",
    openExternal: "Open resource",
    openDemo: "Open demo",
    openSimulator: "Open simulator",
    closeSimulator: "Hide simulator",
    openAssessment: "Go to assessment",
    reviewAssessment: "Review assessment",
    continueActivity: "Continue",
    nextRequired: "Next required step",
    nextRequiredBody:
      "Complete the LM01 Assessment to finish this module. Opening resources or running the simulator does not record completion.",
    finishAssessmentCta: "Finish the assessment to complete LM01",
    finishNextStepCta: "Continue with the next required step",
    closingNextBody: "Finish the assessment to complete LM01.",
    closingNextEvidenceBody:
      "Complete the next required activity to continue this module.",
    closingNeutralBody:
      "This module is not complete yet according to your verifiable learning progress.",
    moduleCompleteBody:
      "LM01 is complete according to your verifiable learning progress. You can still revisit resources and the simulator anytime.",
    heroTimeLabel: "Est. time",
    heroLevelLabel: "Level",
    heroXpLabel: "XP reward",
    heroXpValue: (n) => `${n} XP`,
    signInRequired: "Sign in with your Web3Edu identity to load your LM01 progress.",
    progressionError:
      "Learning path details are temporarily unavailable. You can still explore the module resources below.",
    loading: "Loading LM01…",
    typeLabels: {
      book: "BOOK",
      reading: "READING",
      demo: "DEMO",
      simulator: "SIMULATOR",
      observation: "OBSERVATION",
      coding: "CODING",
      inspection: "INSPECTION",
      verification: "VERIFICATION",
      assessment: "ASSESSMENT",
    },
    stageLearn: "Learn",
    stageExplore: "Explore",
    stageAssess: "Assess",
    stageComplete: "Complete",
    tierExplorer: "Explorer",
    tierBuilder: "Builder",
    tierArchitect: "Architect",
    tierExplorerBody: "Foundational understanding of blockchain.",
    tierBuilderBody: "Applied labs and hands-on building.",
    tierArchitectBody: "Advanced design with contracts and tokens.",
    pathLabel: "Path",
    typeLabel: "Type",
    typeFoundational: "Foundational",
    moduleTypeLabel: "Foundational",
    activityMixLabel: "Activity mix",
    activityMixValue: "Textbook, demo, simulator, assessment",
    currentModuleLabel: "Current module",
  },
  gr: {
    breadcrumbLearn: "Learn",
    breadcrumbExplorer: "Explorer Path",
    pathBadge: "Explorer Path",
    moduleOf: (n, total) => `Module ${n} από ${total}`,
    fromLabel: "Από",
    toLabel: "Προς",
    whatYoullLearn: "Τι θα μάθεις",
    learningPath: "Η διαδρομή μάθησής σου",
    learningPathIntro:
      "Το Learn οργανώνει τη διαδρομή. Οι δραστηριότητες και οι πόροι βοηθούν στην εξάσκηση — μόνο η απαιτούμενη αξιολόγηση μετρά ως αποδεικτικό ολοκλήρωσης του LM01.",
    sidebarProgress: "Η πρόοδός σου στο LM01",
    sidebarEvidence: "Απαιτούμενο αποδεικτικό",
    sidebarAbout: "Σχετικά με το module",
    sidebarOverall: "Η συνολική σου διαδρομή",
    statusComplete: "Το module ολοκληρώθηκε",
    statusInProgress: "Σε εξέλιξη",
    statusUnavailable: "Συνδέσου για να δεις την πρόοδό σου",
    assessmentPassed: "Η αξιολόγηση πέρασε",
    assessmentNotPassed: "Δεν έχει περάσει",
    assessmentTitle: "Αξιολόγηση LM01",
    assessmentRequired: "Υποχρεωτικό",
    evidenceSatisfied: "Καταγράφηκε αποδεικτικό",
    evidenceRequired: "Υποχρεωτικό",
    resourceAvailable: "Διαθέσιμο",
    resourceExternal: "Εξωτερικός πόρος",
    resourceRecommended: "Προτεινόμενο",
    resourceCore: "Βασικό υλικό",
    resourceOptional: "Προαιρετικό",
    simulatorInteractive: "Διαδραστική δραστηριότητα",
    openExternal: "Άνοιγμα πόρου",
    openDemo: "Άνοιγμα demo",
    openSimulator: "Άνοιγμα προσομοιωτή",
    closeSimulator: "Απόκρυψη προσομοιωτή",
    openAssessment: "Μετάβαση στην αξιολόγηση",
    reviewAssessment: "Επανεξέταση αξιολόγησης",
    continueActivity: "Συνέχεια",
    nextRequired: "Επόμενο απαιτούμενο βήμα",
    nextRequiredBody:
      "Ολοκλήρωσε την Αξιολόγηση LM01 για να τελειώσεις αυτό το module. Το άνοιγμα πόρων ή η χρήση του προσομοιωτή δεν καταγράφει ολοκλήρωση.",
    finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM01",
    finishNextStepCta: "Συνέχισε με το επόμενο απαιτούμενο βήμα",
    closingNextBody: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM01.",
    closingNextEvidenceBody:
      "Ολοκλήρωσε την επόμενη απαιτούμενη δραστηριότητα για να συνεχίσεις αυτό το module.",
    closingNeutralBody:
      "Αυτό το module δεν έχει ολοκληρωθεί ακόμη σύμφωνα με την επαληθεύσιμη πρόοδό σου.",
    moduleCompleteBody:
      "Το LM01 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς πόρους και τον προσομοιωτή οποιαδήποτε στιγμή.",
    heroTimeLabel: "Εκτιμώμενος χρόνος",
    heroLevelLabel: "Επίπεδο",
    heroXpLabel: "Ανταμοιβή XP",
    heroXpValue: (n) => `${n} XP`,
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM01.",
    progressionError:
      "Οι λεπτομέρειες της διαδρομής δεν είναι προσωρινά διαθέσιμες. Μπορείς να εξερευνήσεις τους πόρους του module παρακάτω.",
    loading: "Φόρτωση LM01…",
    typeLabels: {
      book: "BOOK",
      reading: "READING",
      demo: "DEMO",
      simulator: "SIMULATOR",
      observation: "OBSERVATION",
      coding: "CODING",
      inspection: "INSPECTION",
      verification: "VERIFICATION",
      assessment: "ASSESSMENT",
    },
    stageLearn: "Μάθε",
    stageExplore: "Εξερεύνησε",
    stageAssess: "Αξιολόγησε",
    stageComplete: "Ολοκλήρωσε",
    tierExplorer: "Explorer",
    tierBuilder: "Builder",
    tierArchitect: "Architect",
    tierExplorerBody: "Θεμελιώδης κατανόηση του blockchain.",
    tierBuilderBody: "Εργαστήρια και πρακτική κατασκευή.",
    tierArchitectBody: "Προχωρημένος σχεδιασμός με συμβόλαια και tokens.",
    pathLabel: "Διαδρομή",
    typeLabel: "Τύπος",
    typeFoundational: "Θεμελιώδες",
    moduleTypeLabel: "Θεμελιώδες",
    activityMixLabel: "Μείγμα δραστηριοτήτων",
    activityMixValue: "Σύγγραμμα, demo, προσομοιωτής, αξιολόγηση",
    currentModuleLabel: "Τρέχον module",
  },
};

/** Module-specific chrome overrides. Presentation only. */
export const LM_MODULE_PAGE_CHROME = {
  LM08: {
    en: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Learn organizes the journey. Hands-on coding, inspection, and verification activities produce required evidence — LM08 is complete only when all four practical evidence items and the LM08 Assessment are satisfied.",
      sidebarProgress: "Your progress in LM08",
      assessmentTitle: "LM08 Assessment",
      nextRequiredBody:
        "Complete the next required LM08 activity or assessment. Opening this page or visiting labs does not itself record completion.",
      finishAssessmentCta: "Finish the assessment to complete LM08",
      closingNextBody: "Finish the LM08 Assessment to complete this module.",
      moduleCompleteBody:
        "LM08 is complete according to your verifiable learning progress. You can still revisit labs and activities anytime.",
      signInRequired: "Sign in with your Web3Edu identity to load your LM08 progress.",
      loading: "Loading LM08…",
      moduleTypeLabel: "Applied",
      activityMixValue: "Lifecycle reading, coding labs, inspection, verification, assessment",
    },
    gr: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Το Learn οργανώνει τη μαθησιακή διαδρομή. Οι πρακτικές δραστηριότητες κώδικα, επιθεώρησης και επαλήθευσης παράγουν τα απαιτούμενα αποδεικτικά. Το LM08 ολοκληρώνεται όταν ικανοποιηθούν και τα τέσσερα πρακτικά αποδεικτικά και ολοκληρωθεί επιτυχώς η Αξιολόγηση LM08.",
      sidebarProgress: "Η πρόοδός σου στο LM08",
      sidebarAbout: "Σχετικά με το LM08",
      assessmentTitle: "Αξιολόγηση LM08",
      nextRequiredBody:
        "Ολοκλήρωσε την επόμενη απαιτούμενη δραστηριότητα ή αξιολόγηση LM08. Το άνοιγμα αυτής της σελίδας ή των labs δεν καταγράφει από μόνο του ολοκλήρωση.",
      finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM08",
      closingNextBody: "Ολοκλήρωσε την Αξιολόγηση LM08 για να τελειώσεις αυτό το module.",
      moduleCompleteBody:
        "Το LM08 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς labs και δραστηριότητες οποιαδήποτε στιγμή.",
      signInRequired:
        "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM08.",
      loading: "Φόρτωση LM08…",
      moduleTypeLabel: "Εφαρμοσμένο",
      activityMixValue: "Ανάγνωση, coding labs, επιθεώρηση, επαλήθευση, αξιολόγηση",
    },
  },
};

/**
 * @param {"en"|"gr"} lang
 * @param {string|null|undefined} [moduleId] defaults to LM01 chrome (base copy)
 */
export function getLmPageCopy(lang = "en", moduleId = "LM01") {
  const locale = lang === "gr" ? "gr" : "en";
  const base = LM_PAGE_COPY[locale] || LM_PAGE_COPY.en;
  const override =
    moduleId && moduleId !== "LM01"
      ? LM_MODULE_PAGE_CHROME[moduleId]?.[locale]
      : null;
  if (!override) {
    return {
      ...base,
      typeLabels: { ...base.typeLabels },
    };
  }
  return {
    ...base,
    ...override,
    typeLabels: {
      ...base.typeLabels,
      ...(override.typeLabels || {}),
    },
  };
}
