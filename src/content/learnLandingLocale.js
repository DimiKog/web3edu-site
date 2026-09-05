/**
 * Learn landing page copy (EN + GR).
 * Presentation only — curriculum overview + Continue framing.
 * Does not own progression, availability of evidence, or XP rules.
 */

export const LEARN_LANDING_COPY = {
  en: {
    eyebrow: "Learn",
    heroTitle: "Learn Blockchain by Understanding, Building, and Designing",
    heroBody:
      "A structured journey from blockchain foundations to smart-contract architecture. Follow the modules in sequence, use hands-on Labs and Projects where they support the learning goals, and build verifiable progress as you advance.",
    valuePoints: [
      {
        title: "11 Learning Modules",
        body: "From foundations to advanced topics",
      },
      {
        title: "Hands-on Learning",
        body: "With Labs and real examples",
      },
      {
        title: "Verifiable Progress",
        body: "Track and prove your achievements",
      },
    ],
    continueTitle: "Continue your journey",
    continueSubtitle: "Pick up where you left off and keep making progress.",
    continueCta: "Continue Learning →",
    continueLoading: "Loading your learning path…",
    progressionUnavailable:
      "Learning path details are temporarily unavailable. You can still browse the curriculum below.",
    continuePathComplete: "Learning path complete",
    /** Presentation line from canonical path tier + current module id. */
    continuePathModule: (pathLabel, moduleId) =>
      moduleId
        ? `${String(pathLabel).toUpperCase()} PATH · ${moduleId}`
        : `${String(pathLabel).toUpperCase()} PATH`,
    paths: {
      explorer: {
        title: "Explorer Path",
        subtitle: "Foundations",
      },
      builder: {
        title: "Builder Path",
        subtitle: "Build & Understand",
      },
      architect: {
        title: "Architect Path",
        subtitle: "Design & Create",
      },
    },
    available: "Available",
    planned: "Planned",
    chapterPlanned: "Interactive chapter",
    openModule: "Open module →",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    footerTitle: "How Learn relates to Labs and Projects",
    footerBody:
      "Learning Modules organize the curriculum. Labs and Projects provide reusable hands-on experiences that modules can use as learning activities and evidence.",
  },
  gr: {
    eyebrow: "Μάθηση",
    heroTitle: "Μάθε Blockchain μέσα από Κατανόηση, Κατασκευή και Σχεδιασμό",
    heroBody:
      "Μια δομημένη μαθησιακή διαδρομή από τις θεμελιώδεις έννοιες του blockchain έως την αρχιτεκτονική έξυπνων συμβολαίων. Ακολούθησε τα modules με τη σειρά, αξιοποίησε Labs και Projects όπου υποστηρίζουν τους μαθησιακούς στόχους και δημιούργησε επαληθεύσιμη πρόοδο καθώς εξελίσσεσαι.",
    valuePoints: [
      {
        title: "11 Learning Modules",
        body: "Από τις θεμελιώδεις έννοιες έως προχωρημένα θέματα",
      },
      {
        title: "Πρακτική Μάθηση",
        body: "Με Labs και πραγματικά παραδείγματα",
      },
      {
        title: "Επαληθεύσιμη Πρόοδος",
        body: "Παρακολούθησε και τεκμηρίωσε την πρόοδό σου",
      },
    ],
    continueTitle: "Συνέχισε τη διαδρομή σου",
    continueSubtitle: "Συνέχισε από εκεί που σταμάτησες και προχώρα.",
    continueCta: "Συνέχεια μάθησης →",
    continueLoading: "Φόρτωση της μαθησιακής σου διαδρομής…",
    progressionUnavailable:
      "Οι λεπτομέρειες της διαδρομής μάθησης δεν είναι προσωρινά διαθέσιμες. Μπορείς να περιηγηθείς στο πρόγραμμα παρακάτω.",
    continuePathComplete: "Η διαδρομή μάθησης ολοκληρώθηκε",
    continuePathModule: (pathLabel, moduleId) =>
      moduleId
        ? `ΔΙΑΔΡΟΜΗ ${String(pathLabel).toUpperCase()} · ${moduleId}`
        : `ΔΙΑΔΡΟΜΗ ${String(pathLabel).toUpperCase()}`,
    paths: {
      explorer: {
        title: "Διαδρομή Εξερευνητή",
        subtitle: "Θεμέλια",
      },
      builder: {
        title: "Διαδρομή Δημιουργού",
        subtitle: "Κατασκευή & Κατανόηση",
      },
      architect: {
        title: "Διαδρομή Αρχιτέκτονα",
        subtitle: "Σχεδιασμός & Δημιουργία",
      },
    },
    available: "Διαθέσιμο",
    planned: "Σχεδιασμένο",
    chapterPlanned: "Διαδραστικό κεφάλαιο",
    openModule: "Άνοιγμα module →",
    moduleLabel: (n) => `LM${String(n).padStart(2, "0")}`,
    footerTitle: "Πώς το Learn σχετίζεται με Labs και Projects",
    footerBody:
      "Τα Learning Modules οργανώνουν το πρόγραμμα μάθησης. Τα Labs και τα Projects παρέχουν επαναχρησιμοποιήσιμες πρακτικές δραστηριότητες που μπορούν να αξιοποιούνται από τα modules ως μαθησιακές δραστηριότητες και αποδεικτικά μάθησης.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLearnLandingCopy(lang) {
  return LEARN_LANDING_COPY[lang === "gr" ? "gr" : "en"] || LEARN_LANDING_COPY.en;
}
