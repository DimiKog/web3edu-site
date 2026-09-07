/**
 * LM02 Interactive Chapter conceptual content (EN + GR).
 * Compact explainer only — presentation, no evidence/XP.
 * Assessment question wording is intentionally not included.
 */

export const LM02_CHAPTER_COPY = {
  en: {
    title: "Architecture reasoning — at a glance",
    subtitle:
      "Decide whether blockchain is justified before naming a platform. Centralization is not inherently a disadvantage.",
    authorityTitle: "Trusted authority may be enough",
    authorityFlow: ["University", "Authoritative database", "Participants"],
    authorityQuestion: "What problem would blockchain solve here?",
    distributionTitle: "Distribution ≠ decentralized authority",
    distributionBody:
      "Many servers can still serve one controller. Technical distribution is not the same as decentralized control of rules and authoritative state.",
    trustTitle: "Same records, different trust model",
    centralizedLabel: "Accepted central authority",
    centralizedSteps: ["A / B / C / D", "Trusted operator", "Authoritative record"],
    sharedLabel: "Shared control required",
    sharedSteps: ["A ↔ B ↔ C ↔ D", "Shared verifiable record"],
    trustNote:
      "Requirements change when trust and control change — not because more computers were added. Neither path is automatically better.",
    tradeoffsTitle: "Capabilities ↔ trade-offs",
    capabilities: ["Shared state", "Independent verification", "Less one-controller reliance"],
    tradeoffs: ["Complexity", "Performance / cost", "Governance", "Privacy", "Operations"],
    integrityTitle: "Integrity ≠ truth",
    integrityPipeline: ["Physical world", "Sensor → 4°C", "Blockchain record"],
    integrityTakeaway:
      "Blockchain can protect the integrity of a record. It cannot make an incorrect input true.",
    decideTitle: "Three legitimate outcomes",
    decideQuestion:
      "What problem does blockchain solve here that a simpler architecture does not?",
    outcomes: [
      { id: "centralized", label: "Centralized may be sufficient" },
      { id: "blockchain", label: "Blockchain may be justified" },
      { id: "insufficient", label: "Not enough information yet" },
    ],
    foodTraceBridge:
      "You will return to FoodTrace in the LM02 Assessment and use this reasoning to decide whether blockchain is actually justified. FoodTrace forms Part B of the assessment.",
  },
  gr: {
    title: "Αρχιτεκτονικός συλλογισμός — με μια ματιά",
    subtitle:
      "Κρίνε αν το blockchain δικαιολογείται πριν ονομάσεις πλατφόρμα. Η κεντρικοποίηση δεν αποτελεί από μόνη της μειονέκτημα.",
    authorityTitle: "Μια αξιόπιστη αρχή μπορεί να αρκεί",
    authorityFlow: ["Πανεπιστήμιο", "Αυθεντική βάση", "Συμμετέχοντες"],
    authorityQuestion: "Ποιο πρόβλημα θα έλυνε εδώ το blockchain;",
    distributionTitle: "Κατανομή ≠ αποκεντρωμένη αυθεντία",
    distributionBody:
      "Πολλοί διακομιστές μπορούν ακόμη να υπηρετούν έναν ελεγκτή. Η τεχνική κατανομή δεν είναι το ίδιο με αποκεντρωμένο έλεγχο κανόνων και αυθεντικής κατάστασης.",
    trustTitle: "Ίδιες εγγραφές, διαφορετικό μοντέλο εμπιστοσύνης",
    centralizedLabel: "Αποδεκτή κεντρική αυθεντία",
    centralizedSteps: ["A / B / C / D", "Αξιόπιστος διαχειριστής", "Αυθεντική εγγραφή"],
    sharedLabel: "Απαιτείται κοινός έλεγχος",
    sharedSteps: ["A ↔ B ↔ C ↔ D", "Κοινόχρηστη επαληθεύσιμη εγγραφή"],
    trustNote:
      "Οι απαιτήσεις αλλάζουν όταν αλλάζει το μοντέλο εμπιστοσύνης και ελέγχου — όχι επειδή προστέθηκαν περισσότεροι υπολογιστές. Καμία διαδρομή δεν είναι αυτόματα καλύτερη.",
    tradeoffsTitle: "Ικανότητες ↔ συμβιβασμοί",
    capabilities: ["Κοινόχρηστη κατάσταση", "Ανεξάρτητη επαλήθευση", "Λιγότερη εξάρτηση από έναν ελεγκτή"],
    tradeoffs: ["Πολυπλοκότητα", "Απόδοση / κόστος", "Διακυβέρνηση", "Ιδιωτικότητα", "Λειτουργία"],
    integrityTitle: "Ακεραιότητα ≠ αλήθεια",
    integrityPipeline: ["Φυσικός κόσμος", "Αισθητήρας → 4°C", "Εγγραφή blockchain"],
    integrityTakeaway:
      "Το blockchain μπορεί να προστατεύσει την ακεραιότητα μιας εγγραφής. Δεν μπορεί να κάνει μια λανθασμένη είσοδο αληθινή.",
    decideTitle: "Τρία νόμιμα αποτελέσματα",
    decideQuestion:
      "Ποιο πρόβλημα λύνει εδώ το blockchain που δεν λύνει μια απλούστερη αρχιτεκτονική;",
    outcomes: [
      { id: "centralized", label: "Το κεντρικό μπορεί να αρκεί" },
      { id: "blockchain", label: "Το blockchain μπορεί να δικαιολογείται" },
      { id: "insufficient", label: "Δεν υπάρχουν ακόμη αρκετές πληροφορίες" },
    ],
    foodTraceBridge:
      "Θα επιστρέψεις στο FoodTrace στην Αξιολόγηση LM02 και θα χρησιμοποιήσεις αυτόν τον συλλογισμό για να κρίνεις αν το blockchain δικαιολογείται πραγματικά. Το FoodTrace αποτελεί το Μέρος Β της αξιολόγησης.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm02ChapterCopy(lang = "en") {
  return LM02_CHAPTER_COPY[lang === "gr" ? "gr" : "en"];
}
