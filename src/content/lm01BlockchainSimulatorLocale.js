/**
 * LM01 Blockchain Simulator copy (EN + GR).
 * Presentation only — no progression / XP / evidence authority.
 *
 * Technical labels (Block, Hash, Previous Hash, Blockchain, Genesis, Consensus)
 * stay in English in GR UI for course vocabulary consistency.
 */

export const LM01_BLOCKCHAIN_SIMULATOR_COPY = {
  en: {
    title: "Web3Edu Blockchain Simulator",
    tagline: "Build a chain. Change a block. See what breaks.",
    stageLabels: {
      build: "Build",
      link: "Link",
      tamper: "Tamper",
      observe: "Observe",
      repair: "Repair",
      concept: "Concept check",
    },
    blockLabel: (n) => `Block ${n}`,
    dataLabel: "Data",
    previousHashLabel: "Previous Hash",
    hashLabel: "Hash",
    zeroHashNote: "Zero previous hash — this block starts the chain",
    fingerprintExplain:
      "A cryptographic hash acts as a fingerprint derived from this block’s contents (its data and the previous hash).",
    linkExplain:
      "The new block stores the fingerprint of the previous block as its Previous Hash. That reference is what links the blocks together.",
    chainValid: "Chain integrity valid",
    chainBroken: "Chain integrity broken",
    chainRestored: "Chain integrity restored",
    mismatchTitle: "Hash relationship mismatch",
    mismatchDetail: (blockA, blockB) =>
      `Block ${blockA} Hash no longer matches Block ${blockB} Previous Hash.`,
    linkValid: "Link matches",
    linkBroken: "Link mismatch",
    addBlock2: "Add Block 2",
    addBlock3: "Add Block 3",
    testChain: "Test the chain",
    tamperInstruction: "Change the data stored in Block 1 and observe what happens.",
    tamperHint: "Edit the record text below. Only Block 1’s hash will update.",
    repairNext: "Repair next link",
    repairHint1:
      "Repair updates Block 2’s Previous Hash to Block 1’s current hash, then recomputes Block 2’s hash. Block 3 is left unchanged for now.",
    repairHint2:
      "The broken relationship has moved downstream. Repair Block 3’s Previous Hash next.",
    restoredExplain:
      "Changing earlier data required the later block references to be recomputed.",
    consensusBridge:
      "You restored the chain’s local structure. But in a distributed network, who decides whether this rewritten history should be accepted?",
    consensusNote: "We’ll return to this question when we study consensus.",
    continueToConcept: "Continue to concept check",
    conceptTitle: "What did this experiment demonstrate?",
    conceptOptions: {
      A: "Blockchain guarantees that stored information is true.",
      B: "Changing earlier data can be detected through broken hash relationships.",
      C: "Blockchain prevents anyone from changing digital data.",
      D: "Every blockchain is public.",
    },
    submitConcept: "Check my answer",
    conceptIncorrect:
      "Not quite. Think about what you saw when the fingerprint no longer matched the next block’s Previous Hash.",
    conceptRetry: "Try again",
    conceptEmpty: "Select an answer to continue.",
    experimentComplete: "Experiment complete",
    conceptSuccessExplain:
      "Changing stored data changes its cryptographic fingerprint and breaks the expected chain relationship. Later references must be recomputed to restore local structure — detection comes from those broken hash relationships.",
    runAgain: "Run again",
    relationshipCaption: "references",
  },
  gr: {
    title: "Web3Edu Προσομοιωτής Blockchain",
    tagline: "Δημιούργησε μια αλυσίδα. Άλλαξε ένα Block. Δες τι επηρεάζεται.",
    stageLabels: {
      build: "Κατασκευή",
      link: "Σύνδεση",
      tamper: "Αλλοίωση",
      observe: "Παρατήρηση",
      repair: "Αποκατάσταση",
      concept: "Έλεγχος κατανόησης",
    },
    blockLabel: (n) => `Block ${n}`,
    dataLabel: "Δεδομένα",
    previousHashLabel: "Previous Hash",
    hashLabel: "Hash",
    zeroHashNote: "Μηδενικό Previous Hash — αυτό το Block ξεκινά την αλυσίδα",
    fingerprintExplain:
      "Ένα κρυπτογραφικό Hash λειτουργεί ως αποτύπωμα που προκύπτει από το περιεχόμενο του Block (τα δεδομένα του και το Previous Hash).",
    linkExplain:
      "Το νέο Block αποθηκεύει το αποτύπωμα του προηγούμενου Block ως Previous Hash. Αυτή η αναφορά είναι που συνδέει τα Blocks μεταξύ τους.",
    chainValid: "Η ακεραιότητα της αλυσίδας είναι έγκυρη",
    chainBroken: "Η ακεραιότητα της αλυσίδας παραβιάστηκε",
    chainRestored: "Η ακεραιότητα της αλυσίδας αποκαταστάθηκε",
    mismatchTitle: "Ασυμφωνία σύνδεσης Hash",
    mismatchDetail: (blockA, blockB) =>
      `Το Hash του Block ${blockA} δεν ταιριάζει πλέον με το Previous Hash του Block ${blockB}.`,
    linkValid: "Η σύνδεση ταιριάζει",
    linkBroken: "Ασυμφωνία σύνδεσης",
    addBlock2: "Προσθήκη Block 2",
    addBlock3: "Προσθήκη Block 3",
    testChain: "Δοκίμασε την αλυσίδα",
    tamperInstruction: "Άλλαξε τα δεδομένα στο Block 1 και παρατήρησε τι συμβαίνει.",
    tamperHint: "Επεξεργάσου το κείμενο της εγγραφής. Θα ενημερωθεί μόνο το Hash του Block 1.",
    repairNext: "Αποκατάσταση επόμενης σύνδεσης",
    repairHint1:
      "Η αποκατάσταση ενημερώνει το Previous Hash του Block 2 ώστε να ταιριάζει με το τρέχον Hash του Block 1 και επανυπολογίζει το Hash του Block 2. Το Block 3 παραμένει προς το παρόν αμετάβλητο.",
    repairHint2:
      "Η ασυμφωνία μετακινήθηκε προς τα κάτω στην αλυσίδα. Επόμενο βήμα: αποκατάσταση του Previous Hash του Block 3.",
    restoredExplain:
      "Η αλλαγή προγενέστερων δεδομένων απαιτούσε τον επανυπολογισμό των αναφορών στα επόμενα Blocks.",
    consensusBridge:
      "Αποκατέστησες την τοπική δομή της αλυσίδας. Σε ένα κατανεμημένο δίκτυο, όμως, ποιος αποφασίζει αν αυτή η επανεγγραφή της ιστορίας πρέπει να γίνει αποδεκτή;",
    consensusNote: "Θα επιστρέψουμε σε αυτό το ερώτημα όταν μελετήσουμε το Consensus.",
    continueToConcept: "Συνέχεια στον έλεγχο κατανόησης",
    conceptTitle: "Τι έδειξε αυτό το πείραμα;",
    conceptOptions: {
      A: "Το Blockchain εγγυάται ότι οι αποθηκευμένες πληροφορίες είναι αληθείς.",
      B: "Η αλλαγή προγενέστερων δεδομένων μπορεί να εντοπιστεί μέσω σπασμένων σχέσεων Hash.",
      C: "Το Blockchain εμποδίζει οποιονδήποτε να αλλάξει ψηφιακά δεδομένα.",
      D: "Κάθε Blockchain είναι δημόσιο.",
    },
    submitConcept: "Έλεγχος απάντησης",
    conceptIncorrect:
      "Όχι ακριβώς. Σκέψου τι είδες όταν το αποτύπωμα δεν ταίριαζε πλέον με το Previous Hash του επόμενου Block.",
    conceptRetry: "Δοκίμασε ξανά",
    conceptEmpty: "Επίλεξε μια απάντηση για να συνεχίσεις.",
    experimentComplete: "Το πείραμα ολοκληρώθηκε",
    conceptSuccessExplain:
      "Η αλλαγή αποθηκευμένων δεδομένων αλλάζει το κρυπτογραφικό τους αποτύπωμα και παραβιάζει την αναμενόμενη σχέση της αλυσίδας. Οι επόμενες αναφορές πρέπει να επανυπολογιστούν για να αποκατασταθεί η τοπική δομή — ο εντοπισμός προκύπτει από αυτές τις ασυμφωνίες Hash.",
    runAgain: "Επανάληψη",
    relationshipCaption: "αναφέρεται στο",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm01BlockchainSimulatorCopy(lang = "en") {
  return (
    LM01_BLOCKCHAIN_SIMULATOR_COPY[lang === "gr" ? "gr" : "en"] ||
    LM01_BLOCKCHAIN_SIMULATOR_COPY.en
  );
}
