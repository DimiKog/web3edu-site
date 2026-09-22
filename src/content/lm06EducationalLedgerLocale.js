/**
 * LM06 Educational Ledger consensus prototype — EN/GR learner copy.
 * Frontend simulation only; no production ledger writes.
 */

export const LM06_EDUCATIONAL_LEDGER_COPY = {
  en: {
    title: "Educational Ledger — Consensus & Block Inclusion",
    subtitle:
      "Follow one PENDING transfer through candidate block, validation, agreement, finalization, and state update.",
    prototypeBanner:
      "Educational consensus simulation. Uses the real shared PENDING pool. Production ledger unchanged.",
    qbftLabel: "QBFT-inspired educational simulation",
    spineLabel: "Conceptual flow",
    spineSteps: [
      { id: "pending", label: "Pending TX" },
      { id: "candidateBlock", label: "Candidate block" },
      { id: "validation", label: "Validation" },
      { id: "agreement", label: "Agreement" },
      { id: "finalization", label: "Finalization" },
      { id: "stateUpdate", label: "State update" },
    ],
    spineMisconception:
      "PENDING ≠ PROPOSED ≠ AGREED ≠ FINALIZED — each step is a different claim.",
    signInRequired: "Sign in to load the shared Educational Ledger pool.",
    loadError: "Could not load the educational ledger. Please try again.",
    poolEmptyTitle: "No PENDING transactions",
    poolEmptyBody:
      "Contribute a transfer in LM05 Educational Ledger first, then return here.",
    poolLm05LinkLabel: "Open LM05 Educational Ledger",
    selectionRule: "Oldest eligible PENDING is assigned to Validator 3.",
    inspectHint: "Inspect the assigned transaction to begin your validation.",
    taskTitle: "YOUR TASK",
    taskInstruction:
      "Find the transaction marked ASSIGNED and select ‘Inspect transaction’ to begin validation.",
    stepInspectLabel: "STEP 1 OF 3 · INSPECT",
    stepValidateLabel: "STEP 2 OF 3 · VALIDATE",
    stepConsensusLabel: "STEP 3 OF 3 · CONSENSUS",
    assignedBadge: "ASSIGNED",
    inspectButton: "Inspect transaction →",
    inspectingButton: "Inspecting",
    candidateHeading: "Candidate transaction",
    inspectorTitle: "Transaction Inspector",
    validatedCandidateLabel: "Validated candidate",
    compactRuleReminder:
      "VALID only if all 5 checks pass. If any check fails → INVALID.",
    contextualQuestions: [
      {
        id: "asset_exists",
        number: "1",
        text: "Can you find this asset in Current State?",
      },
      {
        id: "from_matches_owner",
        number: "2",
        text: "Does FROM match the asset's current owner?",
      },
      {
        id: "destination_exists",
        number: "3",
        text: "Is TO a registered participant?",
      },
      {
        id: "from_to_different",
        number: "4",
        text: "Are FROM and TO different participants?",
      },
      {
        id: "still_pending",
        number: "5",
        text: "Is this transaction still PENDING and eligible?",
      },
    ],
    resultFound: "FOUND",
    resultCurrentOwner: "CURRENT OWNER",
    resultRegistered: "REGISTERED",
    resultDifferent: "DIFFERENT",
    resultEligible: "ELIGIBLE",
    resultFailed: "FAILED",
    txLabel: "TX",
    assetLabel: "Asset",
    fromLabel: "From",
    toLabel: "To",
    statusLabel: "Status",
    restart: "Restart simulation",
    proposerBadge: "PROPOSER",
    validatorBadge: "VALIDATOR",
    youBadge: "YOU",
    validatorNetworkTitle: "Validator network",
    validator1: "Validator 1",
    validator2: "Validator 2",
    validator3You: "Validator 3 — YOU",
    validator4: "Validator 4",
    yourRoleCompact: "You are Validator 3 — inspect, then decide.",
    ledgerSnapshotTitle: "Current Educational Ledger",
    ledgerSnapshotSubtitle:
      "Cross-check the candidate against this live read-only snapshot.",
    ledgerSnapshotLiveBadge: "Live read-only snapshot",
    ledgerCurrentStateTitle: "Current state",
    ledgerDescriptionLabel: "Description",
    ledgerOwnerColumn: "Current owner",
    ledgerParticipantsTitle: "Registered participants",
    ledgerPendingPoolTitle: "Shared pending pool",
    ledgerPendingEmpty: "No PENDING transactions in this snapshot.",
    decisionTitle: "Your validator decision",
    decisionPrompt: "After checking the live ledger, classify this candidate.",
    decisionAllMustPass: "All 5 checks must pass for VALID.",
    chooseValid: "VALID",
    chooseInvalid: "INVALID",
    yourDecision: "Your decision",
    correctResultLabel: "Correct validator result",
    ruleSatisfied: "RULE SATISFIED",
    ruleFailed: "RULE FAILED",
    feedbackMatchValid: "Your decision: VALID — correct.",
    feedbackMatchInvalid: "Your decision: INVALID — correct.",
    feedbackMismatchValidEvidence:
      "Your decision: INVALID. Evidence leads to VALID.",
    feedbackMismatchInvalidEvidence:
      "Your decision: VALID. Evidence leads to INVALID.",
    consensusBridge:
      "You validated locally. Now the validator network must reach agreement.",
    individualDecisionsLabel: "Individual validation",
    networkAgreementLabel: "Network agreement",
    agreementReached: "Sufficient validator agreement reached.",
    agreementNotReached:
      "Sufficient agreement not reached. Finalization does not proceed.",
    agreementDisclaimer:
      "QBFT-inspired simplification — not the complete Besu QBFT protocol.",
    continueToFinalization: "Continue to finalization & state update",
    inclusionTitle: "Finalized educational block",
    finalizedBlockTitle: "Educational Block #Preview",
    includedStatus: "FINALIZED (SIMULATION)",
    simulationCompactLabel: "SIMULATION — production ledger unchanged",
    beforeHeading: "BEFORE CURRENT STATE",
    afterHeading: "AFTER STATE (SIMULATION)",
    ownerLabel: "Owner",
    finalizedContains: "FINALIZED TRANSFER",
    successfulExecution: "SUCCESSFUL EXECUTION",
    afterSimulatedNote: "AFTER is simulated. Live ledger unchanged.",
    resultTitle: "What actually changed shared state?",
    resultSummary:
      "Creating, submitting, proposing, or validating alone does not change the ledger. Only after agreement, finalization, and successful execution can shared state change.",
    besuBridge:
      "Web3Edu’s Besu Edu-Net uses QBFT. This activity models proposal, validation, agreement, finalization, and state transition — not the full QBFT message protocol.",
    evidenceSaving: "Saving your consensus activity progress…",
    evidenceSaved:
      "Consensus activity recorded. If you have already passed the LM06 Assessment, your module progress will update from the server.",
    evidenceError:
      "Could not save your consensus activity progress. Your simulation result is kept — retry without restarting.",
    evidenceRetry: "Retry save",
  },
  gr: {
    title: "Εκπαιδευτικό Ledger — Consensus & συμπερίληψη σε block",
    subtitle:
      "Ακολούθησε μια PENDING μεταφορά μέσα από υποψήφιο block, επικύρωση, συμφωνία, οριστικοποίηση και ενημέρωση κατάστασης.",
    prototypeBanner:
      "Εκπαιδευτική προσομοίωση consensus. Χρησιμοποιεί την πραγματική δεξαμενή PENDING. Το ledger παραγωγής δεν αλλάζει.",
    qbftLabel: "Εκπαιδευτική προσομοίωση εμπνευσμένη από QBFT",
    spineLabel: "Εννοιολογική ροή",
    spineSteps: [
      { id: "pending", label: "Pending TX" },
      { id: "candidateBlock", label: "Υποψήφιο block" },
      { id: "validation", label: "Validation" },
      { id: "agreement", label: "Agreement" },
      { id: "finalization", label: "Οριστικοποίηση" },
      { id: "stateUpdate", label: "Ενημέρωση κατάστασης" },
    ],
    spineMisconception:
      "PENDING ≠ PROPOSED ≠ AGREED ≠ FINALIZED — κάθε βήμα είναι διαφορετικός ισχυρισμός.",
    signInRequired: "Συνδέσου για να φορτωθεί η κοινή δεξαμενή του Εκπαιδευτικού Ledger.",
    loadError: "Δεν ήταν δυνατή η φόρτωση του εκπαιδευτικού ledger. Δοκίμασε ξανά.",
    poolEmptyTitle: "Δεν υπάρχουν PENDING συναλλαγές",
    poolEmptyBody:
      "Συνεισέφερε μια μεταφορά στο LM05 Educational Ledger και μετά επέστρεψε εδώ.",
    poolLm05LinkLabel: "Άνοιξε το LM05 Educational Ledger",
    selectionRule: "Η παλαιότερη κατάλληλη PENDING ανατίθεται στον Validator 3.",
    inspectHint: "Επιθεώρησε την ανατεθειμένη συναλλαγή για να ξεκινήσεις την επικύρωση.",
    taskTitle: "Η ΑΠΟΣΤΟΛΗ ΣΟΥ",
    taskInstruction:
      "Βρες τη συναλλαγή με την ένδειξη ASSIGNED και επίλεξε «Έλεγχος συναλλαγής» για να ξεκινήσεις την επικύρωση.",
    stepInspectLabel: "ΒΗΜΑ 1 ΑΠΟ 3 · ΕΛΕΓΧΟΣ",
    stepValidateLabel: "ΒΗΜΑ 2 ΑΠΟ 3 · ΕΠΙΚΥΡΩΣΗ",
    stepConsensusLabel: "ΒΗΜΑ 3 ΑΠΟ 3 · ΣΥΜΦΩΝΙΑ",
    assignedBadge: "ΑΝΑΤΕΘΕΙΜΕΝΗ",
    inspectButton: "Έλεγχος συναλλαγής →",
    inspectingButton: "Σε έλεγχο",
    candidateHeading: "Υποψήφια συναλλαγή",
    inspectorTitle: "Επιθεωρητής συναλλαγής",
    validatedCandidateLabel: "Επικυρωμένη υποψηφιότητα",
    compactRuleReminder:
      "VALID μόνο αν περάσουν και οι 5 έλεγχοι. Αν αποτύχει οποιοσδήποτε → INVALID.",
    contextualQuestions: [
      {
        id: "asset_exists",
        number: "1",
        text: "Μπορείς να βρεις αυτό το asset στην Τρέχουσα κατάσταση;",
      },
      {
        id: "from_matches_owner",
        number: "2",
        text: "Το FROM ταιριάζει με τον τρέχοντα κάτοχο του asset;",
      },
      {
        id: "destination_exists",
        number: "3",
        text: "Το TO είναι εγγεγραμμένος συμμετέχων;",
      },
      {
        id: "from_to_different",
        number: "4",
        text: "FROM και TO είναι διαφορετικοί συμμετέχοντες;",
      },
      {
        id: "still_pending",
        number: "5",
        text: "Η συναλλαγή είναι ακόμη PENDING και κατάλληλη;",
      },
    ],
    resultFound: "ΒΡΕΘΗΚΕ",
    resultCurrentOwner: "ΤΡΕΧΩΝ ΚΑΤΟΧΟΣ",
    resultRegistered: "ΕΓΓΕΓΡΑΜΜΕΝΟΣ",
    resultDifferent: "ΔΙΑΦΟΡΕΤΙΚΟΙ",
    resultEligible: "ΚΑΤΑΛΛΗΛΗ",
    resultFailed: "ΑΠΕΤΥΧΕ",
    txLabel: "TX",
    assetLabel: "Asset",
    fromLabel: "From",
    toLabel: "To",
    statusLabel: "Status",
    restart: "Επανεκκίνηση προσομοίωσης",
    proposerBadge: "PROPOSER",
    validatorBadge: "VALIDATOR",
    youBadge: "ΕΣΥ",
    validatorNetworkTitle: "Δίκτυο validators",
    validator1: "Validator 1",
    validator2: "Validator 2",
    validator3You: "Validator 3 — ΕΣΥ",
    validator4: "Validator 4",
    yourRoleCompact: "Είσαι Validator 3 — επιθεώρησε και αποφάσισε.",
    ledgerSnapshotTitle: "Τρέχον Educational Ledger",
    ledgerSnapshotSubtitle:
      "Σύγκρινε την υποψηφιότητα με αυτό το live snapshot μόνο για ανάγνωση.",
    ledgerSnapshotLiveBadge: "Live snapshot μόνο για ανάγνωση",
    ledgerCurrentStateTitle: "Τρέχουσα κατάσταση",
    ledgerDescriptionLabel: "Περιγραφή",
    ledgerOwnerColumn: "Τρέχων κάτοχος",
    ledgerParticipantsTitle: "Εγγεγραμμένοι συμμετέχοντες",
    ledgerPendingPoolTitle: "Κοινή δεξαμενή PENDING",
    ledgerPendingEmpty: "Δεν υπάρχουν PENDING συναλλαγές σε αυτό το snapshot.",
    decisionTitle: "Η απόφαση του validator σου",
    decisionPrompt: "Αφού ελέγξεις το live ledger, ταξινόμησε αυτή την υποψηφιότητα.",
    decisionAllMustPass: "Και οι 5 έλεγχοι πρέπει να περάσουν για VALID.",
    chooseValid: "VALID",
    chooseInvalid: "INVALID",
    yourDecision: "Η απόφασή σου",
    correctResultLabel: "Σωστό αποτέλεσμα validator",
    ruleSatisfied: "ΚΑΝΟΝΑΣ ΙΚΑΝΟΠΟΙΗΘΗΚΕ",
    ruleFailed: "ΚΑΝΟΝΑΣ ΑΠΕΤΥΧΕ",
    feedbackMatchValid: "Η απόφασή σου: VALID — σωστά.",
    feedbackMatchInvalid: "Η απόφασή σου: INVALID — σωστά.",
    feedbackMismatchValidEvidence:
      "Η απόφασή σου: INVALID. Τα στοιχεία οδηγούν σε VALID.",
    feedbackMismatchInvalidEvidence:
      "Η απόφασή σου: VALID. Τα στοιχεία οδηγούν σε INVALID.",
    consensusBridge:
      "Επικύρωσες τοπικά. Τώρα το δίκτυο validators πρέπει να συμφωνήσει.",
    individualDecisionsLabel: "Ατομική επικύρωση",
    networkAgreementLabel: "Συμφωνία δικτύου",
    agreementReached: "Επιτεύχθηκε επαρκής συμφωνία validators.",
    agreementNotReached:
      "Δεν επιτεύχθηκε επαρκής συμφωνία. Η οριστικοποίηση δεν προχωρά.",
    agreementDisclaimer:
      "Απλοποίηση εμπνευσμένη από QBFT — όχι το πλήρες πρωτόκολλο Besu QBFT.",
    continueToFinalization: "Συνέχεια στην οριστικοποίηση & ενημέρωση κατάστασης",
    inclusionTitle: "Οριστικοποιημένο εκπαιδευτικό block",
    finalizedBlockTitle: "Εκπαιδευτικό Block #Preview",
    includedStatus: "FINALIZED (ΠΡΟΣΟΜΟΙΩΣΗ)",
    simulationCompactLabel: "ΠΡΟΣΟΜΟΙΩΣΗ — το ledger παραγωγής δεν άλλαξε",
    beforeHeading: "ΤΡΕΧΟΥΣΑ ΚΑΤΑΣΤΑΣΗ ΠΡΙΝ",
    afterHeading: "ΚΑΤΑΣΤΑΣΗ ΜΕΤΑ (ΠΡΟΣΟΜΟΙΩΣΗ)",
    ownerLabel: "Κάτοχος",
    finalizedContains: "ΟΡΙΣΤΙΚΟΠΟΙΗΜΕΝΗ ΜΕΤΑΦΟΡΑ",
    successfulExecution: "ΕΠΙΤΥΧΗΣ ΕΚΤΕΛΕΣΗ",
    afterSimulatedNote: "Το ΜΕΤΑ είναι προσομοίωση. Το live ledger δεν άλλαξε.",
    resultTitle: "Τι άλλαξε πραγματικά την κοινή κατάσταση;",
    resultSummary:
      "Η δημιουργία, υποβολή, πρόταση ή επικύρωση από μόνες τους δεν αλλάζουν το ledger. Μόνο μετά από συμφωνία, οριστικοποίηση και επιτυχή εκτέλεση μπορεί να αλλάξει η κοινή κατάσταση.",
    besuBridge:
      "Το Besu Edu-Net του Web3Edu χρησιμοποιεί QBFT. Αυτή η δραστηριότητα μοντελοποιεί πρόταση, επικύρωση, συμφωνία, οριστικοποίηση και μετάβαση κατάστασης — όχι το πλήρες πρωτόκολλο μηνυμάτων QBFT.",
    evidenceSaving: "Αποθήκευση της προόδου της δραστηριότητας consensus…",
    evidenceSaved:
      "Η δραστηριότητα consensus καταγράφηκε. Αν έχεις ήδη περάσει την Αξιολόγηση LM06, η πρόοδος του module θα ενημερωθεί από τον διακομιστή.",
    evidenceError:
      "Δεν ήταν δυνατή η αποθήκευση της προόδου. Το αποτέλεσμα της προσομοίωσης διατηρείται — δοκίμασε ξανά χωρίς επανεκκίνηση.",
    evidenceRetry: "Επανάληψη αποθήκευσης",
  },
};

const VERIFY_HEADINGS = {
  asset_exists: { en: "1 · Asset exists", gr: "1 · Το asset υπάρχει" },
  from_matches_owner: {
    en: "2 · FROM is current owner",
    gr: "2 · Το FROM είναι ο τρέχων κάτοχος",
  },
  destination_exists: {
    en: "3 · TO is registered",
    gr: "3 · Το TO είναι εγγεγραμμένο",
  },
  from_to_different: {
    en: "4 · FROM ≠ TO",
    gr: "4 · FROM ≠ TO",
  },
  still_pending: {
    en: "5 · Transaction is pending",
    gr: "5 · Η συναλλαγή είναι pending",
  },
};

export function getLm06EducationalLedgerCopy(lang = "en") {
  return lang === "gr"
    ? LM06_EDUCATIONAL_LEDGER_COPY.gr
    : LM06_EDUCATIONAL_LEDGER_COPY.en;
}

export function lm06VerificationHeading(ruleId, lang = "en") {
  const entry = VERIFY_HEADINGS[ruleId];
  if (!entry) return ruleId;
  return lang === "gr" ? entry.gr : entry.en;
}
