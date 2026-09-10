/**
 * LM03 Interactive Chapter conceptual + practice content (EN + GR).
 * Presentation only — no evidence/XP/persistence.
 * Assessment question wording is intentionally not included.
 */

export const LM03_CHAPTER_COPY = {
  en: {
    dimensions: {
      ruleTitle: "Three related dimensions — keep them separate",
      ruleBody:
        "Participation / permissioning ≠ governance / control ≠ deployment model. Do not collapse them into public = permissionless or private = permissioned.",
      cards: [
        {
          id: "participation",
          title: "Participation / permissioning",
          body: "Who may join the network and under what conditions — open to anyone (permissionless) or only approved parties (permissioned).",
          example: "Example: only licensed cold-chain operators may submit records.",
        },
        {
          id: "governance",
          title: "Governance / control",
          body: "Who sets membership rules, upgrades and operational policy — and who can change them.",
          example: "Example: a steering group of three companies approves new members.",
        },
        {
          id: "deployment",
          title: "Deployment model",
          body: "How the network is organizationally shared: public, private, or consortium-style among known organizations.",
          example: "Example: a consortium network hosted for several food producers.",
        },
      ],
      distributedNote:
        "A technically distributed system can still be centrally governed. Distribution of nodes is not the same as decentralization of control.",
    },
    requirements: {
      flowTitle: "Requirements → characteristics → candidate → fit",
      flowSteps: [
        "Application requirements",
        "Required blockchain characteristics",
        "Candidate platform",
        "Fit / misfit",
      ],
      keyLesson:
        "Do not select Ethereum, Besu, or another platform first and then force the problem to fit it.",
      characteristicsTitle: "Characteristics you may need to specify",
      characteristics: [
        "Known vs open participants",
        "Membership control",
        "Validator participation",
        "Governance / control",
        "Privacy / confidentiality",
        "Programmability / smart contracts",
        "Operational requirements",
        "Consensus (high-level only)",
      ],
      consensusNote:
        "Consensus appears here only as one platform characteristic. Deep consensus study belongs later (LM06).",
    },
    canvas: {
      practiceBadge: "Practice · 0 XP · not saved",
      intro:
        "Work the comparison in order. This is guided practice — not the LM03 Assessment.",
      scenarioTitle: "1. What does the scenario require?",
      scenarioBody:
        "Several regional food producers want a shared ledger for cold-chain handoffs. Participants must be known businesses. Membership should be controlled jointly. Commercial volume data should stay confidential among members. Smart-contract automation would help, but is secondary.",
      scenarioHints: [
        "Known participants",
        "Joint membership control",
        "Confidential commercial data",
        "Optional programmability",
      ],
      characteristicsTitle: "2. What platform characteristics follow?",
      characteristicsPrompt: "Select the characteristics that follow from the scenario (practice only).",
      characteristicOptions: [
        { id: "known", label: "Known / permissioned participants" },
        { id: "membership", label: "Controlled membership" },
        { id: "sharedGov", label: "Shared multi-org governance" },
        { id: "privacy", label: "Privacy / confidentiality" },
        { id: "programmability", label: "Programmability helpful, not primary" },
        { id: "openPublic", label: "Open public participation required" },
      ],
      candidateTitle: "3. What does the candidate platform provide?",
      candidateName: "Candidate: Open Public L1",
      candidateBody:
        "Illustrative only — an open, permissionless public smart-contract chain. Anyone can participate; membership is not jointly controlled by the producers; on-chain state is broadly visible; rich programmability is available.",
      candidateTraits: [
        "Permissionless participation",
        "No joint producer membership gate",
        "Broadly visible ledger state",
        "Strong smart-contract support",
      ],
      verdictTitle: "4. Fit / Misfit / Insufficient information?",
      verdictOptions: [
        { id: "fit", label: "Fit" },
        { id: "misfit", label: "Misfit" },
        { id: "insufficient", label: "Insufficient information" },
      ],
      whyTitle: "5. Why?",
      whyPlaceholder: "One or two sentences — local notes only, nothing is saved.",
      checkReasoningLabel: "Check my reasoning",
      reasoningFeedback: {
        misfit:
          "Correct direction. The candidate conflicts with several critical requirements: participation must be controlled, membership must be jointly governed, and commercial data requires confidentiality. Smart-contract support alone is not enough to make the platform suitable.",
        fit:
          "Revisit the requirements. Compare the candidate with the required participation model, membership control, and data visibility. Supporting smart contracts does not compensate for mismatches in these architectural requirements.",
        insufficient:
          "There is already enough information to evaluate several critical characteristics. Compare the known-participant requirement, controlled membership, and confidentiality needs with what the candidate platform provides.",
      },
      resetLabel: "Clear practice answers",
      coaching:
        "A misfit or “insufficient information” answer can still be good architecture reasoning. Rejecting a platform is valid even when blockchain itself is justified.",
    },
    foodTrace: {
      bridge:
        "In LM02 you may have judged that blockchain could be justified for FoodTrace. LM03 asks what participation, governance and deployment characteristics that problem needs — and whether a candidate platform fits.",
      promptsTitle: "Reconsider FoodTrace",
      prompts: [
        "Who needs to participate?",
        "Are participants known?",
        "Who controls membership?",
        "Is governance shared among organizations?",
        "What privacy or programmability characteristics are required?",
        "What kind of platform characteristics follow?",
      ],
      validOutcomesTitle: "Valid reasoning outcomes",
      validOutcomes: [
        "Characteristics are clear enough to compare a candidate",
        "Not enough information yet",
        "Reject a candidate platform even though blockchain may still be justified",
      ],
      noForceNote:
        "This step does not force one platform answer. It prepares architectural questions for later verification.",
    },
  },
  gr: {
    dimensions: {
      ruleTitle: "Τρεις συναφείς διαστάσεις — κράτα τις διακριτές",
      ruleBody:
        "Συμμετοχή / άδειες ≠ διακυβέρνηση / έλεγχος ≠ μοντέλο ανάπτυξης. Μην τις συμπτύσσεις σε δημόσιο = permissionless ή ιδιωτικό = permissioned.",
      cards: [
        {
          id: "participation",
          title: "Συμμετοχή / άδειες",
          body: "Ποιος μπορεί να συμμετέχει στο δίκτυο και υπό ποιες προϋποθέσεις — ανοιχτά σε όλους (permissionless) ή μόνο σε εγκεκριμένους (permissioned).",
          example: "Παράδειγμα: μόνο αδειοδοτημένοι χειριστές ψυχρής αλυσίδας υποβάλλουν εγγραφές.",
        },
        {
          id: "governance",
          title: "Διακυβέρνηση / έλεγχος",
          body: "Ποιος ορίζει κανόνες συμμετοχής, αναβαθμίσεις και λειτουργική πολιτική — και ποιος μπορεί να τα αλλάξει.",
          example: "Παράδειγμα: μια ομάδα καθοδήγησης τριών εταιρειών εγκρίνει νέα μέλη.",
        },
        {
          id: "deployment",
          title: "Μοντέλο ανάπτυξης",
          body: "Πώς οργανώνεται και μοιράζεται το δίκτυο: δημόσιο, ιδιωτικό ή consortium μεταξύ γνωστών οργανισμών.",
          example: "Παράδειγμα: δίκτυο consortium για αρκετούς παραγωγούς τροφίμων.",
        },
      ],
      distributedNote:
        "Ένα τεχνικά κατανεμημένο σύστημα μπορεί ακόμη να έχει κεντρική διακυβέρνηση. Η κατανομή κόμβων δεν είναι το ίδιο με αποκέντρωση ελέγχου.",
    },
    requirements: {
      flowTitle: "Απαιτήσεις → χαρακτηριστικά → υποψήφια → καταλληλότητα",
      flowSteps: [
        "Απαιτήσεις εφαρμογής",
        "Απαιτούμενα χαρακτηριστικά blockchain",
        "Υποψήφια πλατφόρμα",
        "Καταλληλότητα / ακαταλληλότητα",
      ],
      keyLesson:
        "Μην επιλέγεις πρώτα Ethereum, Besu ή άλλη πλατφόρμα και μετά να πιέζεις το πρόβλημα να ταιριάξει.",
      characteristicsTitle: "Χαρακτηριστικά που μπορεί να χρειαστεί να προσδιορίσεις",
      characteristics: [
        "Γνωστοί vs ανοιχτοί συμμετέχοντες",
        "Έλεγχος συμμετοχής / membership",
        "Συμμετοχή validators",
        "Διακυβέρνηση / έλεγχος",
        "Ιδιωτικότητα / εμπιστευτικότητα",
        "Προγραμματισιμότητα / smart contracts",
        "Λειτουργικές απαιτήσεις",
        "Συναίνεση (μόνο σε υψηλό επίπεδο)",
      ],
      consensusNote:
        "Η συναίνεση εμφανίζεται εδώ μόνο ως ένα χαρακτηριστικό πλατφόρμας. Η βαθύτερη μελέτη ανήκει αργότερα (LM06).",
    },
    canvas: {
      practiceBadge: "Εξάσκηση · 0 XP · δεν αποθηκεύεται",
      intro:
        "Ακολούθησε τη σύγκριση με σειρά. Αυτή είναι καθοδηγούμενη εξάσκηση — όχι η Αξιολόγηση LM03.",
      scenarioTitle: "1. Τι απαιτεί το σενάριο;",
      scenarioBody:
        "Αρκετοί περιφερειακοί παραγωγοί τροφίμων θέλουν κοινόχρηστο ledger για παραδόσεις ψυχρής αλυσίδας. Οι συμμετέχοντες πρέπει να είναι γνωστές επιχειρήσεις. Η συμμετοχή πρέπει να ελέγχεται από κοινού. Τα εμπορικά δεδομένα όγκου πρέπει να μένουν εμπιστευτικά μεταξύ των μελών. Ο αυτοματισμός με smart contracts θα βοηθούσε, αλλά είναι δευτερεύων.",
      scenarioHints: [
        "Γνωστοί συμμετέχοντες",
        "Κοινός έλεγχος συμμετοχής",
        "Εμπιστευτικά εμπορικά δεδομένα",
        "Προαιρετική προγραμματισιμότητα",
      ],
      characteristicsTitle: "2. Ποια χαρακτηριστικά πλατφόρμας προκύπτουν;",
      characteristicsPrompt:
        "Επίλεξε τα χαρακτηριστικά που προκύπτουν από το σενάριο (μόνο εξάσκηση).",
      characteristicOptions: [
        { id: "known", label: "Γνωστοί / permissioned συμμετέχοντες" },
        { id: "membership", label: "Ελεγχόμενη συμμετοχή" },
        { id: "sharedGov", label: "Κοινή διακυβέρνηση οργανισμών" },
        { id: "privacy", label: "Ιδιωτικότητα / εμπιστευτικότητα" },
        { id: "programmability", label: "Προγραμματισιμότητα χρήσιμη, όχι πρωτεύουσα" },
        { id: "openPublic", label: "Απαιτείται ανοιχτή δημόσια συμμετοχή" },
      ],
      candidateTitle: "3. Τι παρέχει η υποψήφια πλατφόρμα;",
      candidateName: "Υποψήφια: Ανοιχτό Δημόσιο L1",
      candidateBody:
        "Μόνο ενδεικτικά — ένα ανοιχτό, permissionless δημόσιο δίκτυο με smart contracts. Οποιοσδήποτε μπορεί να συμμετέχει· η συμμετοχή δεν ελέγχεται από κοινού από τους παραγωγούς· η κατάσταση on-chain είναι ευρέως ορατή· υπάρχει πλούσια προγραμματισιμότητα.",
      candidateTraits: [
        "Permissionless συμμετοχή",
        "Χωρίς κοινή πύλη συμμετοχής παραγωγών",
        "Ευρέως ορατή κατάσταση ledger",
        "Ισχυρή υποστήριξη smart contracts",
      ],
      verdictTitle: "4. Κατάλληλη / Ακατάλληλη / Ανεπαρκείς πληροφορίες;",
      verdictOptions: [
        { id: "fit", label: "Κατάλληλη" },
        { id: "misfit", label: "Ακατάλληλη" },
        { id: "insufficient", label: "Ανεπαρκείς πληροφορίες" },
      ],
      whyTitle: "5. Γιατί;",
      whyPlaceholder: "Μία-δύο προτάσεις — τοπικές σημειώσεις μόνο, τίποτα δεν αποθηκεύεται.",
      checkReasoningLabel: "Έλεγξε τη συλλογιστική μου",
      reasoningFeedback: {
        misfit:
          "Σωστή κατεύθυνση. Η υποψήφια πλατφόρμα συγκρούεται με αρκετές κρίσιμες απαιτήσεις: η συμμετοχή πρέπει να είναι ελεγχόμενη, η διαχείριση της ιδιότητας μέλους να γίνεται από κοινού και τα εμπορικά δεδομένα απαιτούν εμπιστευτικότητα. Η υποστήριξη smart contracts από μόνη της δεν αρκεί για να καταστήσει την πλατφόρμα κατάλληλη.",
        fit:
          "Επανεξέτασε τις απαιτήσεις. Σύγκρινε την υποψήφια πλατφόρμα με το απαιτούμενο μοντέλο συμμετοχής, τον έλεγχο της ιδιότητας μέλους και την ορατότητα των δεδομένων. Η υποστήριξη smart contracts δεν αντισταθμίζει ασυμβατότητες σε αυτές τις αρχιτεκτονικές απαιτήσεις.",
        insufficient:
          "Υπάρχουν ήδη αρκετές πληροφορίες για να αξιολογήσεις αρκετά κρίσιμα χαρακτηριστικά. Σύγκρινε την απαίτηση για γνωστούς συμμετέχοντες, τον ελεγχόμενο τρόπο συμμετοχής και τις ανάγκες εμπιστευτικότητας με όσα παρέχει η υποψήφια πλατφόρμα.",
      },
      resetLabel: "Καθαρισμός απαντήσεων εξάσκησης",
      coaching:
        "Η ακαταλληλότητα ή οι «ανεπαρκείς πληροφορίες» μπορούν να είναι καλός αρχιτεκτονικός συλλογισμός. Η απόρριψη πλατφόρμας είναι έγκυρη ακόμη και όταν το ίδιο το blockchain δικαιολογείται.",
    },
    foodTrace: {
      bridge:
        "Στο LM02 μπορεί να έκρινες ότι το blockchain θα μπορούσε να δικαιολογείται για το FoodTrace. Το LM03 ρωτά ποια χαρακτηριστικά συμμετοχής, διακυβέρνησης και ανάπτυξης χρειάζεται το πρόβλημα — και αν μια υποψήφια πλατφόρμα ταιριάζει.",
      promptsTitle: "Ξανασκέψου το FoodTrace",
      prompts: [
        "Ποιοι πρέπει να συμμετέχουν;",
        "Είναι γνωστοί οι συμμετέχοντες;",
        "Ποιος ελέγχει τη συμμετοχή;",
        "Είναι η διακυβέρνηση κοινή μεταξύ οργανισμών;",
        "Ποια χαρακτηριστικά ιδιωτικότητας ή προγραμματισιμότητας απαιτούνται;",
        "Ποια χαρακτηριστικά πλατφόρμας προκύπτουν;",
      ],
      validOutcomesTitle: "Έγκυρα αποτελέσματα συλλογισμού",
      validOutcomes: [
        "Τα χαρακτηριστικά είναι αρκετά καθαρά για σύγκριση υποψηφίου",
        "Δεν υπάρχουν ακόμη αρκετές πληροφορίες",
        "Απόρριψη υποψήφιας πλατφόρμας ακόμη κι αν το blockchain μπορεί να δικαιολογείται",
      ],
      noForceNote:
        "Αυτό το βήμα δεν επιβάλλει μία απάντηση πλατφόρμας. Προετοιμάζει αρχιτεκτονικά ερωτήματα για μεταγενέστερη επαλήθευση.",
    },
  },
};

/** @param {"en"|"gr"} lang */
export function getLm03ChapterCopy(lang = "en") {
  return LM03_CHAPTER_COPY[lang === "gr" ? "gr" : "en"];
}
