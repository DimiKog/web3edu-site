/**
 * Dashboard v2 Slice 1 — Journey presentation copy (EN + GR).
 * Presentation only — no progression rules.
 */

export const DASHBOARD_JOURNEY_LOCALE = {
  en: {
    greetingLegacy: "Good to see you again. Your learning journey continues.",
    greetingActive: "Keep going. You're making great progress.",
    greetingComplete: "Well done. You've completed the Learning Module path.",
    greetingFresh: "Welcome. Start your Learning Module journey when you're ready.",
    greetingUnavailable:
      "Learning path details are temporarily unavailable. Your dashboard still shows your usual progress.",

    recordPreservedTitle: "Your existing Web3Edu record is preserved",
    recordPreservedBody:
      "Your XP, labs, projects, and badges remain part of your Web3Edu record. Learning Modules are the structured journey going forward.",
    viewRecord: "View my record →",

    startJourneyEyebrow: "Start your Learning Journey",
    startJourneyTitle: "Begin with the structured Learning Module path",
    startJourneyBullets: [
      "Follow a clear path from Explorer to Architect",
      "Earn progress that maps to Learning Modules",
      "Your existing Web3Edu record stays with you",
    ],
    startCta: (moduleId) => (moduleId ? `Start ${moduleId} →` : "Start Learning Journey →"),

    continueEyebrow: "Continue Learning",
    continueCta: "Continue with next step →",
    viewModuleDetails: "View module details",
    pathCompleteTitle: "Learning path complete",
    pathCompleteBody: "You have completed the Learning Module journey through Architect.",
    browseLearn: "Open Learn →",
    viewLearningPath: "View Learning Path →",
    actionUnavailable: "This next step is not available yet",
    comingSoon: "Coming soon",
    nextMilestoneEyebrow: "Next milestone",
    upcomingBody:
      "This learning activity is not available yet. Your place in the Learning Journey is preserved.",

    journeyTitle: "Learning Journey",
    journeySubtitle: "Explorer → Builder → Architect",
    openLearn: "View full path on Learn →",
    modulesCount: (done, total) => `${done}/${total} modules`,
    statusCompleted: "Completed",
    statusInProgress: "In progress",
    statusNotStarted: "Not started",
    statusStartHere: "Start here",
    statusComingNext: "Coming next",
    statusFuture: "Future goal",
    statusLocked: "Locked",
    statusLegacyTransition: "Transitioning to new path",

    tierLabels: {
      explorer: "Explorer",
      builder: "Builder",
      architect: "Architect",
    },

    legacyJourneyNote:
      "You haven't completed any Learning Modules yet. Your existing XP, labs, and projects remain part of your record.",
    bridgeJourneyNote:
      "Your previously earned Builder status is preserved. To complete Builder in the new Learning Journey, complete the corresponding Learning Modules.",
    nextMilestonePrefix: "Next milestone:",
    nextMilestoneFallback: "Continue your Learning Module path to progress toward the next milestone.",
  },
  gr: {
    greetingLegacy: "Καλώς ξανά! Η διαδρομή μάθησής σου συνεχίζεται.",
    greetingActive: "Συνέχισε. Κάνεις εξαιρετική πρόοδο.",
    greetingComplete: "Μπράβο. Ολοκλήρωσες τη διαδρομή Learning Modules.",
    greetingFresh: "Καλώς ήρθες. Ξεκίνα τη διαδρομή Learning Modules όταν είσαι έτοιμος/η.",
    greetingUnavailable:
      "Οι λεπτομέρειες της διαδρομής μάθησης δεν είναι προσωρινά διαθέσιμες. Το dashboard σου εξακολουθεί να δείχνει την κανονική πρόοδό σου.",

    recordPreservedTitle: "Το υπάρχον Web3Edu record σου διατηρείται",
    recordPreservedBody:
      "Το XP, τα labs, τα projects και τα badges παραμένουν στο Web3Edu record σου. Τα Learning Modules είναι η δομημένη διαδρομή από εδώ και πέρα.",
    viewRecord: "Δες το record μου →",

    startJourneyEyebrow: "Ξεκίνα τη Διαδρομή Μάθησης",
    startJourneyTitle: "Ξεκίνα με τη δομημένη διαδρομή Learning Modules",
    startJourneyBullets: [
      "Ακολούθησε καθαρή διαδρομή από Explorer σε Architect",
      "Κέρδισε πρόοδο που αντιστοιχεί σε Learning Modules",
      "Το υπάρχον Web3Edu record σου παραμένει μαζί σου",
    ],
    startCta: (moduleId) =>
      moduleId ? `Ξεκίνα ${moduleId} →` : "Ξεκίνα τη Διαδρομή Μάθησης →",

    continueEyebrow: "Συνέχισε τη Μάθηση",
    continueCta: "Συνέχεια στο επόμενο βήμα →",
    viewModuleDetails: "Λεπτομέρειες module",
    pathCompleteTitle: "Η διαδρομή μάθησης ολοκληρώθηκε",
    pathCompleteBody: "Ολοκλήρωσες τη διαδρομή Learning Modules έως Architect.",
    browseLearn: "Άνοιξε το Learn →",
    viewLearningPath: "Δες τη Διαδρομή Μάθησης →",
    actionUnavailable: "Αυτό το επόμενο βήμα δεν είναι ακόμη διαθέσιμο",
    comingSoon: "Έρχεται σύντομα",
    nextMilestoneEyebrow: "Επόμενο milestone",
    upcomingBody:
      "Αυτή η δραστηριότητα μάθησης δεν είναι ακόμη διαθέσιμη. Η θέση σου στη Διαδρομή Μάθησης διατηρείται.",

    journeyTitle: "Διαδρομή Μάθησης",
    journeySubtitle: "Εξερευνητής → Δημιουργός → Αρχιτέκτονας",
    openLearn: "Δες την πλήρη διαδρομή στο Learn →",
    modulesCount: (done, total) => `${done}/${total} modules`,
    statusCompleted: "Ολοκληρώθηκε",
    statusInProgress: "Σε εξέλιξη",
    statusNotStarted: "Δεν έχει ξεκινήσει",
    statusStartHere: "Ξεκίνα εδώ",
    statusComingNext: "Επόμενο",
    statusFuture: "Μελλοντικός στόχος",
    statusLocked: "Κλειδωμένο",
    statusLegacyTransition: "Προσαρμογή στο νέο πρόγραμμα",

    tierLabels: {
      explorer: "Εξερευνητής",
      builder: "Δημιουργός",
      architect: "Αρχιτέκτονας",
    },

    legacyJourneyNote:
      "Δεν έχεις ολοκληρώσει ακόμη κανένα Learning Module. Το υπάρχον XP, labs και projects παραμένουν στο record σου.",
    bridgeJourneyNote:
      "Η βαθμίδα Builder που είχες ήδη κερδίσει διατηρείται. Για να ολοκληρώσεις το Builder στο νέο Learning Journey, χρειάζεται να ολοκληρώσεις τα αντίστοιχα Learning Modules.",
    nextMilestonePrefix: "Επόμενο milestone:",
    nextMilestoneFallback:
      "Συνέχισε τη διαδρομή Learning Modules για να προχωρήσεις στο επόμενο milestone.",
  },
};

/** @param {"en"|"gr"} lang */
export function getDashboardJourneyCopy(lang) {
  return DASHBOARD_JOURNEY_LOCALE[lang === "gr" ? "gr" : "en"];
}
