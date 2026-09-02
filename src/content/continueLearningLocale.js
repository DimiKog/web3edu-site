/**
 * Copy for ContinueLearningCard (EN + GR).
 * Presentation only — no progression rules.
 */

export const CONTINUE_LEARNING_LOCALE = {
    en: {
        title: "Continue Learning",
        earnedTier: "Earned Tier",
        currentPath: "Current Path",
        toward: "Toward",
        currentModule: "Current Module",
        nextStep: "Next Step",
        continue: "Continue",
        continueArrow: "Continue →",
        assessmentComingSoon: "Assessment coming soon",
        activityNotAvailable: "Activity not yet available",
        notYetAvailable: "Not yet available",
        exploreEnrichment: "Explore enrichment activities",
        pathComplete: "Learning path complete",
        progressionUnavailable:
            "Learning path details are temporarily unavailable. Your dashboard still shows your usual progress.",
        xpToward: (current, target) => `${current.toLocaleString()} / ${target.toLocaleString()} XP`,
        tierLabels: {
            explorer: "Explorer",
            builder: "Builder",
            architect: "Architect",
        },
        moduleTitles: {
            LM01: "What is Blockchain?",
            LM02: "Why Blockchain?",
            LM03: "From Blockchain Concept to Blockchain Platforms",
            LM04: "Keys, Wallets and Blockchain Identity",
            LM05: "Transactions and Blockchain State",
            LM06: "Consensus and Distributed Agreement",
            LM07: "Understanding Smart Contracts",
            LM08: "Deploying and Interacting with Smart Contracts",
            LM09: "Building Smart Contracts",
            LM10: "Tokens and Tokenization",
            LM11: "Building and Using an ERC-20 Token",
        },
        evidenceLabels: {
            lab01: "Lab 01 — Wallets & Keys",
            lab02: "Lab 02 — Encrypted Messages",
            lab03: "Lab 03 — Message Signing",
            lab04: "Lab 04 — Transactions & Gas",
            lab05: "Lab 05 — Smart Contracts & State",
            lab06: "Lab 06 — Consensus & Finality",
            coding01: "Coding Lab 01 — Deploy Counter",
            coding02: "Coding Lab 02 — Contract Interaction",
            "lm08-contract-inspection": "Contract Inspection",
            "lm08-source-verification": "Source-code Verification",
            "lm02-decision": "Blockchain Decision Activity",
            "lm03-platform-decision": "Platform Decision Activity",
            "lm05-pel-transaction": "PEL Transaction Activity",
            "lm09-guided-coding": "Guided Coding Activity",
            "lm10-pel-tokenization": "PEL Tokenization Activity",
            "lm10-token-decision": "Token Decision Activity",
            "lm11-erc20-activity": "ERC-20 Activity",
            "lm01-assessment": "LM01 Assessment",
            "lm02-assessment": "LM02 Assessment",
            "lm03-assessment": "LM03 Assessment",
            "lm04-assessment": "LM04 Assessment",
            "lm05-assessment": "LM05 Assessment",
            "lm06-assessment": "LM06 Assessment",
            "lm07-assessment": "LM07 Assessment",
            "lm08-assessment": "LM08 Assessment",
            "lm09-assessment": "LM09 Assessment",
            "lm10-assessment": "LM10 Assessment",
            "lm11-assessment": "LM11 Assessment",
        },
        enrichmentLabel: "Optional enrichment activities",
        unknownAction: "Next learning activity",
        assessmentDefault: "Module assessment",
    },
    gr: {
        title: "Συνέχισε τη Μάθηση",
        earnedTier: "Κερδισμένη Βαθμίδα",
        currentPath: "Τρέχουσα Διαδρομή",
        toward: "Προς",
        currentModule: "Τρέχον Module",
        nextStep: "Επόμενο Βήμα",
        continue: "Συνέχεια",
        continueArrow: "Συνέχεια →",
        assessmentComingSoon: "Η αξιολόγηση έρχεται σύντομα",
        activityNotAvailable: "Η δραστηριότητα δεν είναι ακόμη διαθέσιμη",
        notYetAvailable: "Δεν είναι ακόμη διαθέσιμο",
        exploreEnrichment: "Εξερεύνησε δραστηριότητες εμπλουτισμού",
        pathComplete: "Η διαδρομή μάθησης ολοκληρώθηκε",
        progressionUnavailable:
            "Οι λεπτομέρειες της διαδρομής μάθησης δεν είναι προσωρινά διαθέσιμες. Το dashboard σου εξακολουθεί να δείχνει την κανονική πρόοδό σου.",
        xpToward: (current, target) => `${current.toLocaleString()} / ${target.toLocaleString()} XP`,
        tierLabels: {
            explorer: "Εξερευνητής",
            builder: "Δημιουργός",
            architect: "Αρχιτέκτονας",
        },
        moduleTitles: {
            LM01: "Τι είναι το Blockchain;",
            LM02: "Γιατί Blockchain;",
            LM03: "Από την Έννοια Blockchain στις Πλατφόρμες Blockchain",
            LM04: "Κλειδιά, Πορτοφόλια και Ταυτότητα Blockchain",
            LM05: "Συναλλαγές και Κατάσταση Blockchain",
            LM06: "Συναίνεση και Κατανεμημένη Συμφωνία",
            LM07: "Κατανόηση Έξυπνων Συμβολαίων",
            LM08: "Ανάπτυξη και Αλληλεπίδραση με Έξυπνα Συμβόλαια",
            LM09: "Κατασκευή Έξυπνων Συμβολαίων",
            LM10: "Tokens και Tokenization",
            LM11: "Κατασκευή και Χρήση ERC-20 Token",
        },
        evidenceLabels: {
            lab01: "Lab 01 — Πορτοφόλια & Κλειδιά",
            lab02: "Lab 02 — Κρυπτογραφημένα Μηνύματα",
            lab03: "Lab 03 — Υπογραφή Μηνυμάτων",
            lab04: "Lab 04 — Συναλλαγές & Gas",
            lab05: "Lab 05 — Smart Contracts & Κατάσταση",
            lab06: "Lab 06 — Συναίνεση & Τελικότητα",
            coding01: "Coding Lab 01 — Ανάπτυξη Counter",
            coding02: "Coding Lab 02 — Αλληλεπίδραση Συμβολαίου",
            "lm08-contract-inspection": "Επιθεώρηση Συμβολαίου",
            "lm08-source-verification": "Επαλήθευση Πηγαίου Κώδικα",
            "lm02-decision": "Δραστηριότητα Απόφασης Blockchain",
            "lm03-platform-decision": "Δραστηριότητα Απόφασης Πλατφόρμας",
            "lm05-pel-transaction": "Δραστηριότητα PEL Συναλλαγής",
            "lm09-guided-coding": "Καθοδηγούμενη Coding Δραστηριότητα",
            "lm10-pel-tokenization": "Δραστηριότητα PEL Tokenization",
            "lm10-token-decision": "Δραστηριότητα Απόφασης Token",
            "lm11-erc20-activity": "Δραστηριότητα ERC-20",
            "lm01-assessment": "Αξιολόγηση LM01",
            "lm02-assessment": "Αξιολόγηση LM02",
            "lm03-assessment": "Αξιολόγηση LM03",
            "lm04-assessment": "Αξιολόγηση LM04",
            "lm05-assessment": "Αξιολόγηση LM05",
            "lm06-assessment": "Αξιολόγηση LM06",
            "lm07-assessment": "Αξιολόγηση LM07",
            "lm08-assessment": "Αξιολόγηση LM08",
            "lm09-assessment": "Αξιολόγηση LM09",
            "lm10-assessment": "Αξιολόγηση LM10",
            "lm11-assessment": "Αξιολόγηση LM11",
        },
        enrichmentLabel: "Προαιρετικές δραστηριότητες εμπλουτισμού",
        unknownAction: "Επόμενη δραστηριότητα μάθησης",
        assessmentDefault: "Αξιολόγηση module",
    },
};

/** @param {"en"|"gr"} lang */
export function getContinueLearningCopy(lang) {
    return CONTINUE_LEARNING_LOCALE[lang === "gr" ? "gr" : "en"];
}

/** @param {string|null|undefined} tier @param {"en"|"gr"} lang */
export function formatProgressionTierLabel(tier, lang) {
    if (!tier || typeof tier !== "string") return "—";
    const copy = getContinueLearningCopy(lang);
    const key = tier.trim().toLowerCase();
    return copy.tierLabels[key] ?? tier;
}

/** @param {string|null|undefined} moduleId @param {"en"|"gr"} lang */
export function getModuleDisplayTitle(moduleId, lang) {
    if (!moduleId) return null;
    const copy = getContinueLearningCopy(lang);
    return copy.moduleTitles[moduleId] ?? moduleId;
}
