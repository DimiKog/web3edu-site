/**
 * LM05 Educational Ledger Contribution — EN/GR learner copy.
 */

export const LM05_EDUCATIONAL_LEDGER_COPY = {
  en: {
    title: "Educational Ledger Contribution",
    subtitle:
      "Create a valid educational transfer and contribute it to the shared transaction pool as PENDING.",
    spineLabel: "Conceptual flow",
    spineSteps: [
      { id: "intent", label: "Intent", active: true },
      { id: "transaction", label: "Transaction", active: true },
      { id: "pending", label: "Pending", active: true, stopHere: true },
      { id: "inclusion", label: "Inclusion & Execution", active: false },
      { id: "state", label: "State", active: false },
    ],
    spineStopNote: "This activity stops at Pending.",
    stateTitle: "Current ledger state",
    stateSubtitle: "Educational assets and their current recorded owners.",
    assetIdLabel: "Asset",
    ownerLabel: "Current owner",
    pendingBadge: "Pending transfer already in pool",
    createTitle: "Create a transfer",
    createSubtitle:
      "Choose an asset that does not already have a PENDING transfer. FROM is derived from the current owner.",
    selectAssetLabel: "Asset",
    selectAssetPlaceholder: "Select an asset…",
    fromLabel: "From",
    fromDerivedNote: "Derived from the asset’s current owner — you cannot edit this.",
    toLabel: "To",
    toPlaceholder: "Select destination…",
    previewTitle: "Transaction preview",
    previewType: "TRANSFER",
    submitLabel: "Submit Transaction",
    submittingLabel: "Submitting…",
    noAssetsAvailable:
      "Every asset already has a PENDING transfer in the shared pool. You can still review the pool below.",
    successTitle: "Transaction accepted into the shared pool",
    successTxLabel: "TX",
    successAssetLabel: "Asset",
    successFromLabel: "From",
    successToLabel: "To",
    successStatusLabel: "Status",
    successOwnershipNote:
      "Your transaction has been accepted into the shared transaction pool. The asset has not changed owner yet.",
    successPendingNote: "Pending does not mean included or executed.",
    bridgeQuestion:
      "What determines whether your transaction becomes part of the blockchain?",
    poolTitle: "Shared transaction pool — PENDING",
    poolSubtitle: "Educational transactions waiting for later inclusion activities.",
    poolVisualAlt:
      "Diagram: learner transactions enter a shared transaction pool as PENDING, before any later inclusion in a blockchain.",
    poolVisualCaption:
      "Learner transaction → shared transaction pool → PENDING (not yet included or executed).",
    poolStatusPill: "PENDING",
    poolEmpty: "No PENDING transactions yet.",
    poolAssetLabel: "Asset",
    poolFromLabel: "From",
    poolToLabel: "To",
    poolStatusLabel: "Status",
    poolCreatedLabel: "Created",
    poolShowMore: "Show more",
    contrastStateHeading: "STATE (ON CHAIN)",
    contrastPendingHeading: "PENDING (IN POOL)",
    signInRequired: "Sign in to contribute to the Educational Ledger.",
    loadError: "Could not load the educational ledger. Please try again.",
    conflictError:
      "This asset already has a PENDING transfer. Choose another asset or refresh the pool.",
    submitError: "Could not submit the transaction. Please try again.",
    evidenceSatisfied: "Educational Ledger contribution recorded for your learning path.",
    moduleCompleteHint: "LM05 required evidence for this activity is now satisfied.",
  },
  gr: {
    title: "Συνεισφορά στο Εκπαιδευτικό Ledger",
    subtitle:
      "Δημιούργησε μια έγκυρη εκπαιδευτική μεταφορά και πρόσθεσέ την στην κοινή δεξαμενή συναλλαγών ως PENDING.",
    spineLabel: "Εννοιολογική ροή",
    spineSteps: [
      { id: "intent", label: "Intent", active: true },
      { id: "transaction", label: "Transaction", active: true },
      { id: "pending", label: "Pending", active: true, stopHere: true },
      { id: "inclusion", label: "Inclusion & Execution", active: false },
      { id: "state", label: "State", active: false },
    ],
    spineStopNote: "Αυτή η δραστηριότητα σταματά στο Pending.",
    stateTitle: "Τρέχουσα κατάσταση του ledger",
    stateSubtitle:
      "Εκπαιδευτικά assets και οι ιδιοκτήτες που είναι καταγεγραμμένοι αυτή τη στιγμή.",
    assetIdLabel: "Asset",
    ownerLabel: "Τρέχων κάτοχος",
    pendingBadge: "Υπάρχει ήδη PENDING μεταφορά στο pool",
    createTitle: "Δημιούργησε μεταφορά",
    createSubtitle:
      "Επίλεξε ένα asset που δεν έχει ήδη PENDING μεταφορά. Το FROM προκύπτει από τον τρέχοντα κάτοχο.",
    selectAssetLabel: "Asset",
    selectAssetPlaceholder: "Επίλεξε asset…",
    fromLabel: "From",
    fromDerivedNote: "Προκύπτει από τον τρέχοντα κάτοχο του asset — δεν μπορείς να το επεξεργαστείς.",
    toLabel: "To",
    toPlaceholder: "Επίλεξε προορισμό…",
    previewTitle: "Προεπισκόπηση συναλλαγής",
    previewType: "TRANSFER",
    submitLabel: "Υποβολή συναλλαγής",
    submittingLabel: "Υποβολή…",
    noAssetsAvailable:
      "Όλα τα assets έχουν ήδη PENDING μεταφορά στην κοινή δεξαμενή. Μπορείς ακόμα να δεις το pool παρακάτω.",
    successTitle: "Η συναλλαγή έγινε αποδεκτή στην κοινή δεξαμενή",
    successTxLabel: "TX",
    successAssetLabel: "Asset",
    successFromLabel: "From",
    successToLabel: "To",
    successStatusLabel: "Status",
    successOwnershipNote:
      "Η συναλλαγή σου έγινε αποδεκτή στην κοινή δεξαμενή συναλλαγών. Το asset δεν έχει αλλάξει κάτοχο ακόμη.",
    successPendingNote: "Pending δεν σημαίνει included ή executed.",
    bridgeQuestion:
      "Τι καθορίζει αν η συναλλαγή σου θα γίνει τελικά μέρος του blockchain;",
    poolTitle: "Κοινή δεξαμενή συναλλαγών — PENDING",
    poolSubtitle: "Εκπαιδευτικές συναλλαγές σε αναμονή για μελλοντικές δραστηριότητες συμπερίληψης.",
    poolVisualAlt:
      "Διάγραμμα: οι συναλλαγές του μαθητή μπαίνουν σε κοινή δεξαμενή συναλλαγών ως PENDING, πριν από οποιαδήποτε μελλοντική συμπερίληψη στο blockchain.",
    poolVisualCaption:
      "Συναλλαγή μαθητή → κοινή δεξαμενή συναλλαγών → PENDING (όχι ακόμη included ή executed).",
    poolStatusPill: "PENDING",
    poolEmpty: "Δεν υπάρχουν ακόμη PENDING συναλλαγές.",
    poolAssetLabel: "Asset",
    poolFromLabel: "From",
    poolToLabel: "To",
    poolStatusLabel: "Status",
    poolCreatedLabel: "Δημιουργήθηκε",
    poolShowMore: "Εμφάνιση περισσότερων",
    contrastStateHeading: "ΚΑΤΑΣΤΑΣΗ (ΣΤΟ LEDGER)",
    contrastPendingHeading: "PENDING (στο pool)",
    signInRequired: "Συνδέσου για να συνεισφέρεις στο Εκπαιδευτικό Ledger.",
    loadError: "Δεν ήταν δυνατή η φόρτωση του εκπαιδευτικού ledger. Δοκίμασε ξανά.",
    conflictError:
      "Αυτό το asset έχει ήδη PENDING μεταφορά. Επίλεξε άλλο asset ή ανανέωσε το pool.",
    submitError: "Δεν ήταν δυνατή η υποβολή της συναλλαγής. Δοκίμασε ξανά.",
    evidenceSatisfied: "Η συνεισφορά στο Εκπαιδευτικό Ledger καταγράφηκε στη μαθησιακή σου διαδρομή.",
    moduleCompleteHint: "Το απαιτούμενο αποδεικτικό στοιχείο LM05 για αυτή τη δραστηριότητα ικανοποιήθηκε.",
  },
};

/** @type {Record<string, { en: string, gr: string }>} */
export const LM05_LEDGER_PARTICIPANT_LABELS = {
  producer: { en: "Producer", gr: "Παραγωγός" },
  manufacturer: { en: "Manufacturer", gr: "Κατασκευαστής" },
  distributor: { en: "Distributor", gr: "Διανομέας" },
  retailer: { en: "Retailer", gr: "Λιανοπωλητής" },
};

export function getLm05EducationalLedgerCopy(lang = "en") {
  return lang === "gr" ? LM05_EDUCATIONAL_LEDGER_COPY.gr : LM05_EDUCATIONAL_LEDGER_COPY.en;
}

export function participantLabel(participantId, lang = "en") {
  const entry = LM05_LEDGER_PARTICIPANT_LABELS[participantId];
  if (!entry) return participantId || "—";
  return lang === "gr" ? entry.gr : entry.en;
}
