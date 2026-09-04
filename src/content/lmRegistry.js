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
 * @typedef {"book"|"reading"|"demo"|"simulator"|"observation"|"assessment"} LmActivityVisualType
 * @typedef {"required"|"recommended"|"optional"} LmRequirementHint
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
