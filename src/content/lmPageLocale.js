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
    expandConcept: "Explore",
    collapseConcept: "Hide",
    openAssessment: "Go to assessment",
    reviewAssessment: "Review assessment",
    assessmentComingSoon: "Assessment coming soon",
    activityNotAvailable: "Activity not yet available",
    comingSoon: "Coming soon",
    assessmentRequiredComingSoon: "Required · Coming soon",
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
      concept: "CONCEPT",
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
    expandConcept: "Εξερεύνησε",
    collapseConcept: "Απόκρυψη",
    openAssessment: "Μετάβαση στην αξιολόγηση",
    reviewAssessment: "Επανεξέταση αξιολόγησης",
    assessmentComingSoon: "Η αξιολόγηση έρχεται σύντομα",
    activityNotAvailable: "Η δραστηριότητα δεν είναι ακόμη διαθέσιμη",
    comingSoon: "Σύντομα",
    assessmentRequiredComingSoon: "Υποχρεωτικό · Σύντομα",
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
      concept: "CONCEPT",
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
  LM02: {
    en: {
      learningPathIntro:
        "Follow the reasoning journey from understanding the trust model to comparing architectural choices. Use the recommended reading to deepen your understanding, then complete the LM02 Assessment to test your reasoning and apply it to FoodTrace.",
      sidebarProgress: "Your progress in LM02",
      assessmentTitle: "LM02 Assessment",
      nextRequiredBody:
        "Complete the LM02 Assessment to test your architectural reasoning and apply it to FoodTrace.",
      finishAssessmentCta: "Finish the assessment to complete LM02",
      closingNextBody:
        "Complete the LM02 Assessment to test your architectural reasoning and apply it to FoodTrace.",
      closingNextEvidenceBody:
        "Complete the next required LM02 activity to continue this module.",
      moduleCompleteBody:
        "LM02 is complete according to your verifiable learning progress. You can still revisit the reasoning explainer anytime.",
      signInRequired: "Sign in with your Web3Edu identity to load your LM02 progress.",
      loading: "Loading LM02…",
      moduleTypeLabel: "Foundational",
      activityMixValue: "Reasoning explainer, reading, assessment",
    },
    gr: {
      learningPathIntro:
        "Ακολούθησε τη διαδρομή συλλογισμού από την κατανόηση του μοντέλου εμπιστοσύνης έως τη σύγκριση αρχιτεκτονικών επιλογών. Χρησιμοποίησε την προτεινόμενη ανάγνωση για να εμβαθύνεις και ολοκλήρωσε την Αξιολόγηση LM02 για να ελέγξεις τον συλλογισμό σου και να τον εφαρμόσεις στο FoodTrace.",
      sidebarProgress: "Η πρόοδός σου στο LM02",
      sidebarAbout: "Σχετικά με το LM02",
      assessmentTitle: "Αξιολόγηση LM02",
      nextRequiredBody:
        "Ολοκλήρωσε την Αξιολόγηση LM02 για να ελέγξεις τον αρχιτεκτονικό συλλογισμό σου και να τον εφαρμόσεις στο FoodTrace.",
      finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM02",
      closingNextBody:
        "Ολοκλήρωσε την Αξιολόγηση LM02 για να ελέγξεις τον αρχιτεκτονικό συλλογισμό σου και να τον εφαρμόσεις στο FoodTrace.",
      closingNextEvidenceBody:
        "Ολοκλήρωσε την επόμενη απαιτούμενη δραστηριότητα LM02 για να συνεχίσεις αυτό το module.",
      moduleCompleteBody:
        "Το LM02 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς την επεξήγηση συλλογισμού οποιαδήποτε στιγμή.",
      signInRequired:
        "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM02.",
      loading: "Φόρτωση LM02…",
      moduleTypeLabel: "Θεμελιώδες",
      activityMixValue: "Επεξήγηση συλλογισμού, ανάγνωση, αξιολόγηση",
    },
  },
  LM03: {
    en: {
      learningPathIntro:
        "Distinguish architectural dimensions, deepen with recommended reading, translate requirements into platform characteristics, practice a lightweight comparison, then revisit FoodTrace. Complete the LM03 Assessment to verify platform-fit reasoning.",
      sidebarProgress: "Your progress in LM03",
      assessmentTitle: "LM03 Assessment",
      nextRequiredBody:
        "Complete the LM03 Assessment to verify your platform-fit reasoning.",
      finishAssessmentCta: "Finish the assessment to complete LM03",
      closingNextBody:
        "Complete the LM03 Assessment to verify your platform-fit reasoning and finish this module.",
      closingNextEvidenceBody:
        "Complete the next required LM03 activity to continue this module.",
      moduleCompleteBody:
        "LM03 is complete according to your verifiable learning progress. You can still revisit the platform-reasoning path anytime.",
      signInRequired: "Sign in with your Web3Edu identity to load your LM03 progress.",
      loading: "Loading LM03…",
      moduleTypeLabel: "Foundational",
      activityMixValue: "Concepts, reading, comparison practice, FoodTrace application, assessment",
      typeLabels: {
        observation: "GUIDED ACTIVITY",
      },
    },
    gr: {
      learningPathIntro:
        "Διάκρινε τις αρχιτεκτονικές διαστάσεις, εμβάθυνε με την προτεινόμενη ανάγνωση, μετάφρασε απαιτήσεις σε χαρακτηριστικά πλατφόρμας, εξασκήσου σε μια ελαφριά σύγκριση και ξαναδές το FoodTrace. Ολοκλήρωσε την Αξιολόγηση LM03 για να επαληθεύσεις τον συλλογισμό καταλληλότητας πλατφόρμας.",
      sidebarProgress: "Η πρόοδός σου στο LM03",
      sidebarAbout: "Σχετικά με το LM03",
      assessmentTitle: "Αξιολόγηση LM03",
      nextRequiredBody:
        "Ολοκλήρωσε την Αξιολόγηση LM03 για να επαληθεύσεις τον συλλογισμό καταλληλότητας πλατφόρμας.",
      finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM03",
      closingNextBody:
        "Ολοκλήρωσε την Αξιολόγηση LM03 για να επαληθεύσεις τον συλλογισμό καταλληλότητας πλατφόρμας και να τελειώσεις αυτό το module.",
      closingNextEvidenceBody:
        "Ολοκλήρωσε την επόμενη απαιτούμενη δραστηριότητα LM03 για να συνεχίσεις αυτό το module.",
      moduleCompleteBody:
        "Το LM03 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς τη διαδρομή συλλογισμού πλατφόρμας οποιαδήποτε στιγμή.",
      signInRequired:
        "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM03.",
      loading: "Φόρτωση LM03…",
      moduleTypeLabel: "Θεμελιώδες",
      activityMixValue: "Έννοιες, ανάγνωση, εξάσκηση σύγκρισης, εφαρμογή FoodTrace, αξιολόγηση",
      typeLabels: {
        observation: "ΚΑΘΟΔΗΓΟΥΜΕΝΗ",
      },
    },
  },
  LM04: {
    en: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Read the interactive chapter and the recommended textbook sections, then complete Labs 01–03 as required evidence. Finish the LM04 Assessment to check keys, wallets, encryption vs signing, and careful identity interpretation. Opening this page or textbook links does not itself record completion.",
      sidebarProgress: "Your progress in LM04",
      assessmentTitle: "LM04 Assessment",
      nextRequiredBody:
        "Complete the next required LM04 lab or assessment. Opening this page or visiting labs does not itself record completion.",
      finishAssessmentCta: "Finish the assessment to complete LM04",
      closingNextBody:
        "Finish Labs 01–03 and the LM04 Assessment to complete this module.",
      closingNextEvidenceBody:
        "Complete the next required LM04 lab to continue this module.",
      moduleCompleteBody:
        "LM04 is complete according to your verifiable learning progress. You can still revisit labs and the chapter anytime.",
      signInRequired: "Sign in with your Web3Edu identity to load your LM04 progress.",
      loading: "Loading LM04…",
      moduleTypeLabel: "Foundational",
      activityMixValue: "Chapter, textbook readings, Labs 01–03, assessment",
    },
    gr: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Διάβασε το διαδραστικό κεφάλαιο και τις προτεινόμενες ενότητες του συγγράμματος, και ολοκλήρωσε τα Labs 01–03 ως απαιτούμενα αποδεικτικά. Ολοκλήρωσε την Αξιολόγηση LM04 για να ελέγξεις κλειδιά, πορτοφόλια, κρυπτογράφηση vs υπογραφή και προσεκτική ερμηνεία ταυτότητας. Το άνοιγμα αυτής της σελίδας ή των συνδέσμων του συγγράμματος δεν καταγράφει από μόνο του ολοκλήρωση.",
      sidebarProgress: "Η πρόοδός σου στο LM04",
      sidebarAbout: "Σχετικά με το LM04",
      assessmentTitle: "Αξιολόγηση LM04",
      nextRequiredBody:
        "Ολοκλήρωσε το επόμενο απαιτούμενο lab ή αξιολόγηση LM04. Το άνοιγμα αυτής της σελίδας ή των labs δεν καταγράφει από μόνο του ολοκλήρωση.",
      finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM04",
      closingNextBody:
        "Ολοκλήρωσε τα Labs 01–03 και την Αξιολόγηση LM04 για να τελειώσεις αυτό το module.",
      closingNextEvidenceBody:
        "Ολοκλήρωσε το επόμενο απαιτούμενο lab LM04 για να συνεχίσεις αυτό το module.",
      moduleCompleteBody:
        "Το LM04 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς labs και κεφάλαιο οποιαδήποτε στιγμή.",
      signInRequired:
        "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM04.",
      loading: "Φόρτωση LM04…",
      moduleTypeLabel: "Θεμελιώδες",
      activityMixValue: "Κεφάλαιο, αναγνώσεις συγγράμματος, Labs 01–03, αξιολόγηση",
    },
  },
  LM05: {
    en: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Read the interactive chapter and the recommended textbook section, then complete Lab 04 and Lab 05 as required evidence. Take the LM05 Assessment when ready. An Educational Ledger contribution is also required for module completion when available. Opening this page or textbook links does not itself record completion.",
      sidebarProgress: "Your progress in LM05",
      assessmentTitle: "LM05 Assessment",
      nextRequiredBody:
        "Complete the next required LM05 lab or activity. Opening this page or visiting labs does not itself record completion.",
      finishAssessmentCta: "Finish the assessment to complete LM05",
      closingNextBody:
        "Finish Lab 04, Lab 05, the Educational Ledger contribution, and the LM05 Assessment to complete this module.",
      closingNextEvidenceBody:
        "Complete the next required LM05 activity to continue this module.",
      closingPathEyebrow: "Learning path",
      closingPathTitle: "Continue your LM05 learning path",
      closingPathBody:
        "Complete the available learning activities and return as the remaining required activities become available.",
      moduleCompleteBody:
        "LM05 is complete according to your verifiable learning progress. You can still revisit labs and the chapter anytime.",
      signInRequired: "Sign in with your Web3Edu identity to load your LM05 progress.",
      loading: "Loading LM05…",
      moduleTypeLabel: "Foundational",
      activityMixValue: "Chapter, textbook reading, Labs 04–05, Educational Ledger, assessment",
      typeLabels: {
        observation: "ACTIVITY",
      },
    },
    gr: {
      breadcrumbExplorer: "Builder Path",
      pathBadge: "Builder Path",
      learningPathIntro:
        "Διάβασε το διαδραστικό κεφάλαιο και την προτεινόμενη ενότητα του συγγράμματος, και ολοκλήρωσε τα Labs 04 και 05 ως απαιτούμενα αποδεικτικά. Δώσε την Αξιολόγηση LM05 όταν είσαι έτοιμος/η. Απαιτείται επίσης συνεισφορά στο Εκπαιδευτικό Ledger για ολοκλήρωση του module όταν είναι διαθέσιμη. Το άνοιγμα αυτής της σελίδας ή των συνδέσμων του συγγράμματος δεν καταγράφει από μόνο του ολοκλήρωση.",
      sidebarProgress: "Η πρόοδός σου στο LM05",
      sidebarAbout: "Σχετικά με το LM05",
      assessmentTitle: "Αξιολόγηση LM05",
      nextRequiredBody:
        "Ολοκλήρωσε το επόμενο απαιτούμενο lab ή δραστηριότητα LM05. Το άνοιγμα αυτής της σελίδας ή των labs δεν καταγράφει από μόνο του ολοκλήρωση.",
      finishAssessmentCta: "Ολοκλήρωσε την αξιολόγηση για να τελειώσεις το LM05",
      closingNextBody:
        "Ολοκλήρωσε τα Labs 04 και 05, τη συνεισφορά στο Εκπαιδευτικό Ledger και την Αξιολόγηση LM05 για να τελειώσεις αυτό το module.",
      closingNextEvidenceBody:
        "Ολοκλήρωσε την επόμενη απαιτούμενη δραστηριότητα LM05 για να συνεχίσεις αυτό το module.",
      closingPathEyebrow: "Διαδρομή μάθησης",
      closingPathTitle: "Συνέχισε τη διαδρομή μάθησης LM05",
      closingPathBody:
        "Ολοκλήρωσε τις διαθέσιμες δραστηριότητες μάθησης και επέστρεψε όταν γίνουν διαθέσιμες οι υπόλοιπες απαιτούμενες.",
      moduleCompleteBody:
        "Το LM05 ολοκληρώθηκε σύμφωνα με την επαληθεύσιμη πρόοδό σου. Μπορείς να ξαναδείς labs και κεφάλαιο οποιαδήποτε στιγμή.",
      signInRequired:
        "Συνδέσου με την ταυτότητα Web3Edu για να φορτωθεί η πρόοδός σου στο LM05.",
      loading: "Φόρτωση LM05…",
      moduleTypeLabel: "Θεμελιώδες",
      activityMixValue:
        "Κεφάλαιο, ανάγνωση συγγράμματος, Labs 04–05, Εκπαιδευτικό Ledger, αξιολόγηση",
      typeLabels: {
        observation: "ΔΡΑΣΤΗΡΙΟΤΗΤΑ",
      },
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
