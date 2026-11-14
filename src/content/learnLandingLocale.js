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
      "Move from blockchain foundations to smart-contract design through structured Learning Modules. Explore concepts, practice with Labs and Projects, and build understanding step by step.",
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
    openModule: "Open module →",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    footerTitle: "Learn · Practice · Prove",
    footerBody:
      "Learning Modules organize the curriculum. Labs and Projects provide hands-on practice. Verifiable achievements and identity help you prove what you have learned — not every module issues an on-chain credential.",
  },
  gr: {
    eyebrow: "Μάθηση",
    heroTitle: "Η Μαθησιακή σου Διαδρομή στο Web3",
    heroBody:
      "Πέρασε από τα θεμέλια του blockchain στον σχεδιασμό έξυπνων συμβολαίων μέσα από δομημένα Learning Modules. Εξερεύνησε έννοιες, εξασκήσου με Labs και Projects και χτίσε κατανόηση βήμα προς βήμα.",
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
    openModule: "Άνοιγμα module →",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    footerTitle: "Μάθε · Εξασκήσου · Απόδειξε",
    footerBody:
      "Τα Learning Modules οργανώνουν το πρόγραμμα μάθησης. Τα Labs και τα Projects παρέχουν πρακτική εξάσκηση. Τα επαληθεύσιμα επιτεύγματα και η ταυτότητα βοηθούν να αποδείξεις τι έχεις μάθει — δεν εκδίδει κάθε module διαπιστευτήριο on-chain.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLearnLandingCopy(lang) {
  return LEARN_LANDING_COPY[lang === "gr" ? "gr" : "en"] || LEARN_LANDING_COPY.en;
}
