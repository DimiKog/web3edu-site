/**
 * Dashboard v2 composition copy (EN + GR) — Record / Proof / Identity strip.
 */

export const DASHBOARD_COMPOSITION_LOCALE = {
  en: {
    identityLabel: "Web3Edu Identity",
    linkedWallet: "Linked Wallet",
    sbtLabel: "Web3Edu SBT",
    progressSource: "Progress Source",
    viewExplorer: "Explorer",
    copyAddress: "Copy identity address",
    copied: "Copied!",
    settingUp: "Setting up…",
    deviceAccessTitle: "Device-based identity",
    deviceAccessBody: "Connect a Web3Edu Account or wallet for easier sign-in later.",
    legacyBuilderStatus: "Legacy Builder",

    recordTitle: "Your Web3Edu Record",
    recordSubtitle: "What you have already done on Web3Edu",
    totalXp: "Total XP",
    labsCompleted: "Labs completed",
    projects: "Projects",
    achievements: "Badges",
    poeEarned: "Proof of Escape",
    genesisBadge: "Genesis Badge",
    poeYes: "Earned",
    poeNo: "Not yet",
    viewRecordDetails: "View details ↓",

    proofTitle: "Verifiable Profile",
    proofSubtitle: "What is verifiably bound to your identity",
    proofSbt: "Web3Edu SBT",
    proofSnapshot: "Snapshot",
    proofNetwork: "Network",
    proofStatus: "Status",
    proofViewDetails: "View proof details",
    proofHideDetails: "Hide details",
    proofViewExplorer: "View on Explorer →",
    proofAnchoredAt: "Last anchor",

    historyTitle: "History",
    projectsSection: "Projects",

    showTimeline: "Show timeline ↓",
    hideTimeline: "Hide timeline ↑",
    timelineXp: "Timeline XP",
    timelineCompactLabs: "Labs",
    timelineCompactProjects: "Projects",
    timelineCompactAssessments: "Assessments",
    timelineCompactActivities: "Activities",
  },
  gr: {
    identityLabel: "Web3Edu Identity",
    linkedWallet: "Συνδεδεμένο πορτοφόλι",
    sbtLabel: "Web3Edu SBT",
    progressSource: "Πηγή προόδου",
    viewExplorer: "Explorer",
    copyAddress: "Αντιγραφή διεύθυνσης",
    copied: "Αντιγράφηκε!",
    settingUp: "Ρύθμιση…",
    deviceAccessTitle: "Ταυτότητα στη συσκευή",
    deviceAccessBody: "Σύνδεσε Web3Edu Account ή πορτοφόλι για ευκολότερη είσοδο αργότερα.",
    legacyBuilderStatus: "Legacy Δημιουργός",

    recordTitle: "Το Web3Edu Record σου",
    recordSubtitle: "Όσα έχεις ήδη κάνει στο Web3Edu",
    totalXp: "Συνολικό XP",
    labsCompleted: "Ολοκληρωμένα labs",
    projects: "Projects",
    achievements: "Badges",
    poeEarned: "Proof of Escape",
    genesisBadge: "Genesis Badge",
    poeYes: "Κερδισμένο",
    poeNo: "Όχι ακόμη",
    viewRecordDetails: "Λεπτομέρειες ↓",

    proofTitle: "Επαληθεύσιμο Προφίλ",
    proofSubtitle: "Όσα είναι επαληθεύσιμα δεμένα με την ταυτότητά σου",
    proofSbt: "Web3Edu SBT",
    proofSnapshot: "Snapshot",
    proofNetwork: "Δίκτυο",
    proofStatus: "Κατάσταση",
    proofViewDetails: "Λεπτομέρειες proof",
    proofHideDetails: "Απόκρυψη",
    proofViewExplorer: "Προβολή στο Explorer →",
    proofAnchoredAt: "Τελευταίο anchor",

    historyTitle: "Ιστορικό",
    projectsSection: "Έργα",

    showTimeline: "Προβολή χρονολογίου ↓",
    hideTimeline: "Απόκρυψη χρονολογίου ↑",
    timelineXp: "XP χρονολογίου",
    timelineCompactLabs: "Labs",
    timelineCompactProjects: "Projects",
    timelineCompactAssessments: "Αξιολογήσεις",
    timelineCompactActivities: "Δραστηριότητες",
  },
};

/** @param {"en"|"gr"} lang */
export function getDashboardCompositionCopy(lang) {
  return DASHBOARD_COMPOSITION_LOCALE[lang === "gr" ? "gr" : "en"];
}
