/**
 * Learning Module presentation registry (frontend display metadata only).
 *
 * MUST NOT own: requiredEvidence, completion rules, assessment pass state,
 * progression/tier eligibility, or XP award logic.
 * MAY reference canonical evidence IDs for presentation wiring only.
 */

export const LM01_ANDERS_DEMO_URL = "https://andersbrownworth.com/blockchain/";
export const LM01_KALLIPOS_TEXTBOOK_URL =
  "https://repository.kallipos.gr/handle/11419/9130";

/** Approved LM01 production visuals (public/ paths). */
export const LM01_VISUALS = {
  hero: "/learning-modules/visuals/lm01/lm01-hero.png",
  book: "/learning-modules/visuals/lm01/lm01-book.png",
  demo: "/learning-modules/visuals/lm01/lm01-demo.png",
  simulator: "/learning-modules/visuals/lm01/lm01-simulator.png",
  assessment: "/learning-modules/visuals/lm01/lm01-assessment.png",
  completion: "/learning-modules/visuals/lm01/lm01-completion.png",
  nextStep: "/learning-modules/visuals/lm01/lm01-next-step.png",
  metaTime: "/learning-modules/visuals/lm01/lm01-meta-time.png",
  metaLevel: "/learning-modules/visuals/lm01/lm01-meta-level.png",
  metaXp: "/learning-modules/visuals/lm01/lm01-meta-xp.png",
};

/**
 * LM08 production visuals (public/ paths).
 * Spec: same visual family as LM01; no embedded text/logos.
 */
export const LM08_VISUALS = {
  hero: "/learning-modules/visuals/lm08/lm08-hero.png",
  verification: "/learning-modules/visuals/lm08/lm08-verification.png",
};

/**
 * @typedef {"book"|"reading"|"demo"|"simulator"|"observation"|"coding"|"inspection"|"verification"|"assessment"} LmActivityVisualType
 * @typedef {"required"|"recommended"|"optional"|"core"} LmRequirementHint
 */

export const LM_PRESENTATION_REGISTRY = {
  LM01: {
    id: "LM01",
    pathKey: "explorer",
    moduleNumber: 1,
    totalModules: 11,
    title: {
      en: "What is Blockchain?",
      gr: "Τι είναι το Blockchain;",
    },
    transition: {
      from: {
        en: "I've heard about blockchain",
        gr: "Έχω ακούσει για blockchain",
      },
      to: {
        en: "I understand its basic mechanism, properties, limitations, and when it may be worth considering.",
        gr: "Κατανοώ τον βασικό μηχανισμό, τις ιδιότητες, τους περιορισμούς του και πότε μπορεί να αξίζει να το εξετάσω.",
      },
    },
    about: {
      en: "LM01 introduces blockchain as a linked record structure — how blocks and hashes connect, what that does and does not guarantee, and when blockchain may be worth considering.",
      gr: "Το LM01 εισάγει το blockchain ως δομή συνδεδεμένων εγγραφών — πώς συνδέονται blocks και hashes, τι εγγυάται και τι όχι, και πότε μπορεί να αξίζει να εξεταστεί το blockchain.",
    },
    /**
     * Learner-facing course metadata. Presentation only.
     * estimatedTime / level are not canonical progression.
     * assessmentXp displays the existing LM assessment XP amount — it does not award XP.
     */
    learnerMeta: {
      estimatedTime: { en: "1–2 hours", gr: "1–2 ώρες" },
      level: { en: "Beginner", gr: "Αρχάριο" },
      assessmentXp: 100,
    },
    /**
     * Approved production artwork. Presentation only.
     * activityByType is keyed by visualType; types without an asset stay null.
     */
    visuals: {
      hero: LM01_VISUALS.hero,
      completion: LM01_VISUALS.completion,
      nextStep: LM01_VISUALS.nextStep,
      meta: {
        time: LM01_VISUALS.metaTime,
        level: LM01_VISUALS.metaLevel,
        xp: LM01_VISUALS.metaXp,
      },
      activityByType: {
        book: LM01_VISUALS.book,
        demo: LM01_VISUALS.demo,
        simulator: LM01_VISUALS.simulator,
        assessment: LM01_VISUALS.assessment,
      },
    },
    learningOutcomes: {
      en: [
        "Explain at a basic level how blocks and hashes form a blockchain",
        "Identify key properties and limitations without treating them as guarantees",
        "Distinguish blockchain from cryptocurrency",
        "Recognize simple situations where blockchain may or may not be worth considering",
      ],
      gr: [
        "Να εξηγείς σε βασικό επίπεδο πώς τα blocks και τα hashes σχηματίζουν ένα blockchain",
        "Να εντοπίζεις βασικές ιδιότητες και περιορισμούς χωρίς να τους αντιμετωπίζεις ως εγγυήσεις",
        "Να διακρίνεις το blockchain από το κρυπτονόμισμα",
        "Να αναγνωρίζεις απλές περιπτώσεις όπου το blockchain μπορεί ή μπορεί να μην αξίζει να εξεταστεί",
      ],
    },
    /**
     * Presentation activities only. Slots reserved for future slides / PEL.
     * @type {Array<{
     *   id: string,
     *   visualType: LmActivityVisualType,
     *   requirementHint: LmRequirementHint,
     *   languages: Array<"en"|"gr"|"both">,
     *   title: {en: string, gr: string},
     *   description: {en: string, gr: string},
     *   linkKind: "external"|"internal"|"embed"|"none",
     *   href?: {en?: string|null, gr?: string|null}|string|null,
     *   evidenceId?: string|null,
     *   presentationOnly?: boolean,
     *   reserved?: boolean,
     * }>}
     */
    activities: [
      {
        id: "lm01-textbook-kallipos",
        visualType: "book",
        requirementHint: "recommended",
        languages: ["gr"],
        title: {
          en: "Textbook — Blockchain: Θεωρία και Πρακτικές Εφαρμογές",
          gr: "Σύγγραμμα — Blockchain: Θεωρία και Πρακτικές Εφαρμογές",
        },
        description: {
          en: "Greek open textbook on Kallipos (Chapter 1 orientation).",
          gr: "Ανοιχτό σύγγραμμα στο Κάλλιπος — εισαγωγή στις βασικές έννοιες του blockchain.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm01-textbook-kallipos-en-ref",
        visualType: "book",
        requirementHint: "optional",
        languages: ["en"],
        title: {
          en: "Greek textbook — optional reference",
          gr: "Σύγγραμμα (ελληνικά) — προαιρετική αναφορά",
        },
        description: {
          en: "Open Kallipos resource in Greek. Not an English textbook equivalent.",
          gr: "Ανοιχτός πόρος Κάλλιπος στα ελληνικά.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm01-slides",
        visualType: "reading",
        requirementHint: "recommended",
        languages: ["both"],
        title: {
          en: "LM01 slides",
          gr: "Διαφάνειες LM01",
        },
        description: {
          en: "Learner slides (to be linked when the refreshed PDF is ready).",
          gr: "Διαφάνειες μαθήματος (θα συνδεθούν όταν είναι έτοιμο το ανανεωμένο PDF).",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
        reserved: true,
      },
      {
        id: "lm01-anders-demo",
        visualType: "demo",
        requirementHint: "recommended",
        languages: ["both"],
        title: {
          en: "Anders Brownworth Blockchain Demo",
          gr: "Anders Brownworth Blockchain Demo",
        },
        description: {
          en: "External interactive demonstration of blocks, hashes, and links.",
          gr: "Εξωτερική διαδραστική επίδειξη για blocks, hashes και συνδέσεις.",
        },
        linkKind: "external",
        href: LM01_ANDERS_DEMO_URL,
        presentationOnly: true,
      },
      {
        id: "lm01-blockchain-simulator",
        visualType: "simulator",
        requirementHint: "recommended",
        languages: ["both"],
        title: {
          en: "Web3Edu Blockchain Simulator",
          gr: "Web3Edu Προσομοιωτής Blockchain",
        },
        description: {
          en: "Build a chain, change a block, and see how hash relationships break and can be restored.",
          gr: "Δημιούργησε μια αλυσίδα, άλλαξε ένα Block και δες πώς παραβιάζονται και αποκαθίστανται οι σχέσεις Hash.",
        },
        linkKind: "embed",
        presentationOnly: true,
      },
      {
        id: "lm01-pel-observe",
        visualType: "observation",
        requirementHint: "optional",
        languages: ["both"],
        title: {
          en: "PEL observation",
          gr: "Παρατήρηση PEL",
        },
        description: {
          en: "Reserved for a learner-facing Persistent Educational Ledger experience.",
          gr: "Δεσμευμένο για μελλοντική μαθησιακή εμπειρία Persistent Educational Ledger.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
        reserved: true,
      },
      {
        id: "lm01-assessment",
        visualType: "assessment",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "LM01 Assessment",
          gr: "Αξιολόγηση LM01",
        },
        description: {
          en: "Demonstrate your understanding. This is the required completion step for LM01.",
          gr: "Δείξε την κατανόησή σου. Αυτό είναι το απαιτούμενο βήμα ολοκλήρωσης του LM01.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm01/assessment",
          gr: "/learning-modules-gr/lm01/assessment",
        },
        evidenceId: "lm01-assessment",
        presentationOnly: false,
      },
    ],
  },

  LM08: {
    id: "LM08",
    pathKey: "builder",
    moduleNumber: 8,
    totalModules: 11,
    title: {
      en: "Deploying and Interacting with Smart Contracts",
      gr: "Ανάπτυξη και Αλληλεπίδραση με Έξυπνα Συμβόλαια",
    },
    transition: {
      from: {
        en: "I understand smart contracts conceptually",
        gr: "Κατανοώ τις βασικές έννοιες των έξυπνων συμβολαίων",
      },
      to: {
        en: "I can deploy, interact with, inspect, and verify a contract on Besu Edu-Net.",
        gr: "Μπορώ να αναπτύξω και να αλληλεπιδράσω με ένα έξυπνο συμβόλαιο στο Besu Edu-Net, καθώς και να το επιθεωρήσω και να επαληθεύσω τον πηγαίο κώδικά του.",
      },
    },
    about: {
      en: "LM08 teaches the smart-contract deployment lifecycle on Besu Edu-Net — from Solidity source through deployment, interaction, on-chain inspection, and source verification — then checks understanding with a required assessment.",
      gr: "Το LM08 σε καθοδηγεί από τον πηγαίο κώδικα Solidity έως την ανάπτυξη και την αλληλεπίδραση με ένα έξυπνο συμβόλαιο στο Besu Edu-Net. Στη συνέχεια, μαθαίνεις να το επιθεωρείς στο blockchain και να επαληθεύεις τον πηγαίο κώδικά του.",
    },
    learnerMeta: {
      estimatedTime: { en: "3–5 hours", gr: "3–5 ώρες" },
      level: { en: "Intermediate", gr: "Μεσαίο" },
      assessmentXp: 300,
    },
    /**
     * LM08 artwork under public/learning-modules/visuals/lm08/.
     * Coding/inspection/assessment thumbs still reuse LM01 family placeholders.
     */
    visuals: {
      hero: LM08_VISUALS.hero,
      completion: LM01_VISUALS.completion,
      nextStep: LM01_VISUALS.nextStep,
      meta: {
        time: LM01_VISUALS.metaTime,
        level: LM01_VISUALS.metaLevel,
        xp: LM01_VISUALS.metaXp,
      },
      activityByType: {
        reading: LM01_VISUALS.book,
        coding: LM01_VISUALS.simulator,
        inspection: LM01_VISUALS.demo,
        verification: LM08_VISUALS.verification,
        assessment: LM01_VISUALS.assessment,
      },
    },
    learningOutcomes: {
      en: [
        "Explain the lifecycle and distinguish source code, compiled/deployable code, deployment, and a deployed contract instance",
        "Deploy a contract and understand what a contract address / deployed instance means",
        "Distinguish read-only calls from state-changing transactions",
        "Inspect an on-chain contract and explain what inspection can and cannot establish",
        "Explain and perform source verification and understand its limits",
      ],
      gr: [
        "Να εξηγείς τον κύκλο ζωής ενός έξυπνου συμβολαίου και να διακρίνεις τον πηγαίο κώδικα, το bytecode, τη διαδικασία ανάπτυξης και το αναπτυγμένο στιγμιότυπό του.",
        "Να αναπτύσσεις ένα έξυπνο συμβόλαιο και να κατανοείς τι αντιπροσωπεύουν η διεύθυνση του συμβολαίου και το αναπτυγμένο στιγμιότυπό του.",
        "Να διακρίνεις τις κλήσεις μόνο ανάγνωσης από τις συναλλαγές που μεταβάλλουν την κατάσταση.",
        "Να επιθεωρείς ένα συμβόλαιο στο blockchain και να εξηγείς τι μπορεί και τι δεν μπορεί να τεκμηριώσει η επιθεώρηση.",
        "Να εξηγείς και να εκτελείς επαλήθευση πηγαίου κώδικα και να κατανοείς τα όριά της.",
      ],
    },
    activities: [
      {
        id: "lm08-lifecycle",
        visualType: "reading",
        requirementHint: "core",
        languages: ["both"],
        title: {
          en: "Smart-contract deployment lifecycle",
          gr: "Κύκλος ζωής ανάπτυξης έξυπνου συμβολαίου",
        },
        description: {
          en: "Read the chapter explainer above: source → compile → bytecode → deploy → address → read vs write → inspect → verify.",
          gr: "Διάβασε την επεξήγηση παραπάνω: πηγαίος κώδικας → μεταγλώττιση → bytecode → ανάπτυξη → διεύθυνση → ανάγνωση vs μεταβολή κατάστασης → επιθεώρηση → επαλήθευση.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm08-remix-setup",
        visualType: "reading",
        requirementHint: "recommended",
        languages: ["both"],
        title: {
          en: "Setup: Remix + Besu Edu-Net",
          gr: "Ρύθμιση Remix + Besu Edu-Net",
        },
        description: {
          en: "Prepare Remix and connect to Besu Edu-Net before the coding labs.",
          gr: "Προετοίμασε το Remix και συνδέσου στο Besu Edu-Net πριν τα coding labs.",
        },
        linkKind: "internal",
        href: {
          en: "/tools/remix-besu-setup",
          gr: "/tools-gr/remix-besu-setup",
        },
        presentationOnly: true,
      },
      {
        id: "lm08-coding01",
        visualType: "coding",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "Deploy a contract — Coding Lab 01",
          gr: "Ανάπτυξη έξυπνου συμβολαίου — Coding Lab 01",
        },
        description: {
          en: "Compile and deploy the Counter contract on Besu Edu-Net, then record deployment evidence.",
          gr: "Μεταγλώττισε και ανάπτυξε το συμβόλαιο Counter στο Besu Edu-Net και καταχώρισε αποδεικτικό ανάπτυξης.",
        },
        linkKind: "internal",
        href: {
          en: "/labs/coding-01/interaction",
          gr: "/labs-gr/coding-01/interaction",
        },
        evidenceId: "coding01",
        presentationOnly: false,
      },
      {
        id: "lm08-coding02",
        visualType: "coding",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "Interact with a contract — Coding Lab 02",
          gr: "Αλληλεπίδραση με έξυπνο συμβόλαιο — Coding Lab 02",
        },
        description: {
          en: "Practice reading state and submitting a state-changing transaction on your deployed instance.",
          gr: "Εξάσκησε την ανάγνωση κατάστασης και την υποβολή συναλλαγής που μεταβάλλει την κατάσταση στο αναπτυγμένο στιγμιότυπό σου.",
        },
        linkKind: "internal",
        href: {
          en: "/labs/coding-02/interaction",
          gr: "/labs-gr/coding-02/interaction",
        },
        evidenceId: "coding02",
        presentationOnly: false,
      },
      {
        id: "lm08-contract-inspection",
        visualType: "inspection",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "Inspect an on-chain contract",
          gr: "Επιθεώρηση συμβολαίου στο blockchain",
        },
        description: {
          en: "Use explorer evidence to inspect a deployed contract and its limits.",
          gr: "Χρησιμοποίησε στοιχεία από block explorer για να επιθεωρήσεις ένα αναπτυγμένο συμβόλαιο και τα όριά της επιθεώρησης.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm08/contract-inspection",
          gr: "/learning-modules-gr/lm08/contract-inspection",
        },
        evidenceId: "lm08-contract-inspection",
        presentationOnly: false,
      },
      {
        id: "lm08-source-verification",
        visualType: "verification",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "Source verification",
          gr: "Επαλήθευση πηγαίου κώδικα",
        },
        description: {
          en: "Relate published source and compilation info to deployed code — and know what verification does not prove.",
          gr: "Συσχέτισε δημοσιευμένο πηγαίο κώδικα και πληροφορίες μεταγλώττισης με τον κώδικα που έχει αναπτυχθεί — και γνώριζε τι δεν αποδεικνύει η επαλήθευση.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm08/source-verification",
          gr: "/learning-modules-gr/lm08/source-verification",
        },
        evidenceId: "lm08-source-verification",
        presentationOnly: false,
      },
      {
        id: "lm08-assessment",
        visualType: "assessment",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "LM08 Assessment",
          gr: "Αξιολόγηση LM08",
        },
        description: {
          en: "Check your understanding of the deployment lifecycle, interaction, inspection, and source verification.",
          gr: "Έλεγξε την κατανόησή σου για τον κύκλο ζωής ανάπτυξης, την αλληλεπίδραση, την επιθεώρηση και την επαλήθευση πηγαίου κώδικα.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm08/assessment",
          gr: "/learning-modules-gr/lm08/assessment",
        },
        evidenceId: "lm08-assessment",
        presentationOnly: false,
      },
    ],
  },
};

/** @param {string} moduleId */
export function getLmPresentationModule(moduleId) {
  return LM_PRESENTATION_REGISTRY[moduleId] ?? null;
}

/**
 * Approved artwork for a module (hero, completion, activity type map).
 * @param {string} moduleId
 * @returns {{
 *   hero?: string,
 *   completion?: string,
 *   nextStep?: string,
 *   meta?: { time?: string, level?: string, xp?: string },
 *   activityByType?: Record<string, string>,
 * }|null}
 */
export function getLmModuleVisuals(moduleId) {
  const visuals = getLmPresentationModule(moduleId)?.visuals;
  return visuals && typeof visuals === "object" ? visuals : null;
}

/**
 * Activity thumbnail src from the module's approved visual set.
 * @param {string} moduleId
 * @param {string} visualType
 * @returns {string|null}
 */
export function getLmActivityVisualSrc(moduleId, visualType) {
  const src = getLmModuleVisuals(moduleId)?.activityByType?.[visualType];
  return typeof src === "string" && src ? src : null;
}

/**
 * Localized learner-facing course metadata for a module.
 * Returns null when a module has not defined it yet (LM02–LM11 later).
 * @param {string} moduleId
 * @param {"en"|"gr"} lang
 * @returns {{ estimatedTime: string, level: string, assessmentXp: number }|null}
 */
export function getLmLearnerMeta(moduleId, lang = "en") {
  const mod = getLmPresentationModule(moduleId);
  const meta = mod?.learnerMeta;
  if (!meta || typeof meta !== "object") return null;
  const locale = lang === "gr" ? "gr" : "en";
  const estimatedTime = meta.estimatedTime?.[locale] || meta.estimatedTime?.en;
  const level = meta.level?.[locale] || meta.level?.en;
  const assessmentXp =
    typeof meta.assessmentXp === "number" && Number.isFinite(meta.assessmentXp)
      ? meta.assessmentXp
      : null;
  if (!estimatedTime || !level || assessmentXp == null) return null;
  return { estimatedTime, level, assessmentXp };
}

/**
 * Activities visible on the LM page for a language (skips reserved/unlinked slots).
 * @param {string} moduleId
 * @param {"en"|"gr"} lang
 */
export function getLmVisibleActivities(moduleId, lang = "en") {
  const mod = getLmPresentationModule(moduleId);
  if (!mod) return [];
  const locale = lang === "gr" ? "gr" : "en";
  return (mod.activities || []).filter((activity) => {
    if (activity.reserved) return false;
    const langs = activity.languages || ["both"];
    return langs.includes("both") || langs.includes(locale);
  });
}

/**
 * @param {{ href?: string|{en?: string|null, gr?: string|null}|null, linkKind?: string }} activity
 * @param {"en"|"gr"} lang
 */
export function resolveLmActivityHref(activity, lang = "en") {
  if (!activity || activity.linkKind === "none" || activity.linkKind === "embed") {
    return null;
  }
  const href = activity.href;
  if (!href) return null;
  if (typeof href === "string") return href;
  const locale = lang === "gr" ? "gr" : "en";
  return href[locale] || href.en || null;
}
