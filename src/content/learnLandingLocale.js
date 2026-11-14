/**
 * Learn landing page copy (EN + GR).
 * Presentation only — curriculum overview + Continue framing.
 * Does not own progression, availability of evidence, or XP rules.
 */

export const LEARN_LANDING_COPY = {
  en: {
    eyebrow: "Learn",
    heroTitle: "Your Web3 Learning Journey",
    heroBody:
      "Move from blockchain foundations to smart-contract design through structured Learning Modules — explore concepts, practice with Labs and Projects, and build understanding step by step.",
    exploreModulesCta: "Explore Learning Modules",
    modulesHeading: "Learning Modules",
    modulesIntro:
      "Follow the curriculum in sequence across three educational stages — from foundations to design.",
    journeyLabel: "Learning path",
    valuePoints: [
      {
        title: "Learn",
        body: "Structured Learning Modules.",
      },
      {
        title: "Practice",
        body: "Hands-on Labs and Projects.",
      },
      {
        title: "Prove",
        body: "Verifiable learning achievements and identity.",
      },
    ],
    continueTitle: "Continue Learning",
    continueSubtitle: "Pick up where you left off.",
    continueCta: "Continue Learning →",
    continueLoading: "Loading your learning path…",
    progressionUnavailable:
      "Learning path details are temporarily unavailable. You can still browse the curriculum below.",
    continuePathComplete: "Learning path complete",
    availableModulesCompleteTitle: "All available Learning Modules completed!",
    availableModulesCompleteBody:
      "You've completed the current learning journey. New modules are coming soon.",
    /** Presentation line from canonical path tier + current module id. */
    continuePathModule: (pathLabel, moduleId) =>
      moduleId
        ? `${String(pathLabel)} · ${moduleId}`
        : String(pathLabel),
    paths: {
      explorer: {
        title: "Explorer",
        subtitle: "Foundations",
        description:
          "Build core blockchain literacy — what it is, when it is justified, and how platforms differ.",
      },
      builder: {
        title: "Builder",
        subtitle: "Build & Understand",
        description:
          "Connect keys, transactions, consensus, and smart contracts through guided practice.",
      },
      architect: {
        title: "Architect",
        subtitle: "Design & Create",
        description:
          "Design and create with tokens and contract systems — modules in this stage are planned.",
      },
    },
    available: "Available",
    completed: "Completed",
    planned: "Planned",
    chapterPlanned: "Interactive chapter",
    openModule: "Open module",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    /** Concise Learn-card blurbs — presentation only; registry `about` stays authoritative for chapters. */
    moduleSummaries: {
      LM01:
        "Understand how blockchain works, what it can guarantee, and where its limitations begin.",
      LM02:
        "Evaluate when blockchain is justified and when conventional systems are a better choice.",
      LM03:
        "Compare blockchain platforms and evaluate their suitability for different requirements.",
      LM04:
        "Understand how keys, wallets, and digital signatures establish control over blockchain addresses.",
      LM05:
        "Trace how transactions are executed and change the shared state of a blockchain.",
      LM06:
        "Compare consensus mechanisms and understand how transactions are validated and included in blocks.",
      LM07:
        "Explain how smart contracts execute code, manage state, and interact with blockchain transactions.",
      LM08:
        "Deploy and interact with smart contracts on Besu Edu-Net, and verify their source code.",
      LM09: "Design and build smart-contract systems — planned module.",
      LM10: "Tokens and tokenization concepts — planned module.",
      LM11: "Build and use an ERC-20 token — planned module.",
    },
    heroImageAlt:
      "Illustration of a three-stage Web3 learning journey from foundations to building and verification.",
    footerTitle: "Learn · Practice · Prove",
    footerBody:
      "Modules structure learning. Labs and Projects provide practice. Verifiable achievements help you prove progress.",
  },
  gr: {
    eyebrow: "Μάθηση",
    heroTitle: "Η Μαθησιακή σου Διαδρομή στο Web3",
    heroBody:
      "Πέρασε από τα θεμέλια του blockchain στον σχεδιασμό έξυπνων συμβολαίων μέσα από δομημένα Learning Modules — εξερεύνησε έννοιες, εξασκήσου με Labs και Projects και χτίσε κατανόηση βήμα προς βήμα.",
    exploreModulesCta: "Εξερεύνησε τις Μαθησιακές Ενότητες",
    modulesHeading: "Learning Modules",
    modulesIntro:
      "Ακολούθησε το πρόγραμμα με τη σειρά σε τρία εκπαιδευτικά στάδια — από τα θεμέλια έως τον σχεδιασμό.",
    journeyLabel: "Διαδρομή μάθησης",
    valuePoints: [
      {
        title: "Μάθε",
        body: "Δομημένα Learning Modules.",
      },
      {
        title: "Εξασκήσου",
        body: "Hands-on Labs και Projects.",
      },
      {
        title: "Απόδειξε",
        body: "Επαληθεύσιμα μαθησιακά επιτεύγματα και ταυτότητα.",
      },
    ],
    continueTitle: "Συνέχεια μάθησης",
    continueSubtitle: "Συνέχισε από εκεί που σταμάτησες.",
    continueCta: "Συνέχεια μάθησης →",
    continueLoading: "Φόρτωση της μαθησιακής σου διαδρομής…",
    progressionUnavailable:
      "Οι λεπτομέρειες της διαδρομής μάθησης δεν είναι προσωρινά διαθέσιμες. Μπορείς να περιηγηθείς στο πρόγραμμα παρακάτω.",
    continuePathComplete: "Η διαδρομή μάθησης ολοκληρώθηκε",
    availableModulesCompleteTitle:
      "Ολοκλήρωσες όλες τις διαθέσιμες Μαθησιακές Ενότητες!",
    availableModulesCompleteBody:
      "Η μαθησιακή σου διαδρομή συνεχίζεται σύντομα με νέες ενότητες.",
    continuePathModule: (pathLabel, moduleId) =>
      moduleId
        ? `${String(pathLabel)} · ${moduleId}`
        : String(pathLabel),
    paths: {
      explorer: {
        title: "Εξερευνητής",
        subtitle: "Θεμέλια",
        description:
          "Χτίσε βασικό blockchain literacy — τι είναι, πότε δικαιολογείται και πώς διαφέρουν οι πλατφόρμες.",
      },
      builder: {
        title: "Δημιουργός",
        subtitle: "Κατασκευή & Κατανόηση",
        description:
          "Σύνδεσε κλειδιά, συναλλαγές, συναίνεση και έξυπνα συμβόλαια μέσα από καθοδηγούμενη πρακτική.",
      },
      architect: {
        title: "Αρχιτέκτονας",
        subtitle: "Σχεδιασμός & Δημιουργία",
        description:
          "Σχεδίασε και δημιούργησε με tokens και συστήματα συμβολαίων — τα modules αυτού του σταδίου είναι σχεδιασμένα.",
      },
    },
    available: "Διαθέσιμο",
    completed: "Ολοκληρωμένο",
    planned: "Σχεδιασμένο",
    chapterPlanned: "Διαδραστικό κεφάλαιο",
    openModule: "Άνοιγμα module",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    moduleSummaries: {
      LM01:
        "Κατανόησε πώς λειτουργεί το blockchain, τι μπορεί να εγγυηθεί και ποιοι είναι οι περιορισμοί του.",
      LM02:
        "Αξιολόγησε πότε δικαιολογείται η χρήση blockchain και πότε οι συμβατικές λύσεις είναι καταλληλότερες.",
      LM03:
        "Σύγκρινε πλατφόρμες blockchain και αξιολόγησε την καταλληλότητά τους για διαφορετικές απαιτήσεις.",
      LM04:
        "Κατανόησε πώς κλειδιά, πορτοφόλια και ψηφιακές υπογραφές αποδεικνύουν τον έλεγχο διευθύνσεων blockchain.",
      LM05:
        "Παρακολούθησε πώς εκτελούνται οι συναλλαγές και μεταβάλλουν την κοινή κατάσταση του blockchain.",
      LM06:
        "Σύγκρινε μηχανισμούς συναίνεσης και κατανόησε πώς οι συναλλαγές επικυρώνονται και εντάσσονται σε blocks.",
      LM07:
        "Κατανόησε πώς τα έξυπνα συμβόλαια εκτελούν κώδικα, διαχειρίζονται κατάσταση και αλληλεπιδρούν με συναλλαγές.",
      LM08:
        "Ανάπτυξε και χρησιμοποίησε έξυπνα συμβόλαια στο Besu Edu-Net και επαλήθευσε τον πηγαίο κώδικά τους.",
      LM09: "Σχεδιασμός και κατασκευή συστημάτων έξυπνων συμβολαίων — σχεδιασμένο module.",
      LM10: "Έννοιες tokens και tokenization — σχεδιασμένο module.",
      LM11: "Κατασκευή και χρήση ERC-20 token — σχεδιασμένο module.",
    },
    heroImageAlt:
      "Εικονογράφηση τριών σταδίων μαθησιακής διαδρομής Web3 — από τα θεμέλια στην κατασκευή και την επαλήθευση.",
    footerTitle: "Μάθε · Εξασκήσου · Απόδειξε",
    footerBody:
      "Τα Modules οργανώνουν τη μάθηση. Labs και Projects δίνουν πρακτική. Τα επαληθεύσιμα επιτεύγματα βοηθούν να αποδείξεις πρόοδο.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLearnLandingCopy(lang) {
  return LEARN_LANDING_COPY[lang === "gr" ? "gr" : "en"] || LEARN_LANDING_COPY.en;
}
