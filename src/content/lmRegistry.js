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
 * nextStep/completion reuse the LM08 hero until dedicated chrome art ships —
 * do not reuse lm01-next-step.png (it embeds “LM01 Assessment”).
 */
export const LM08_VISUALS = {
  hero: "/learning-modules/visuals/lm08/lm08-hero.png",
  verification: "/learning-modules/visuals/lm08/lm08-verification.png",
  nextStep: "/learning-modules/visuals/lm08/lm08-hero.png",
};

/** Approved LM02 production visuals (public/ paths). Do not regenerate or substitute. */
export const LM02_VISUALS = {
  hero: "/learning-modules/visuals/lm02/lm02-hero.png",
  concept: "/learning-modules/visuals/lm02/lm02-concept.png",
};

/** Approved LM03 production visuals (public/ paths). Do not regenerate or substitute. */
export const LM03_VISUALS = {
  hero: "/learning-modules/visuals/lm03/lm03-hero.png",
  architecturalDimensions:
    "/learning-modules/visuals/lm03/lm03-architectural-dimensions.png",
  requirementsToCharacteristics:
    "/learning-modules/visuals/lm03/lm03-requirements-to-characteristics.png",
  foodtraceRevisited:
    "/learning-modules/visuals/lm03/lm03-foodtrace-revisited.png",
};

/**
 * @typedef {"book"|"reading"|"concept"|"demo"|"simulator"|"observation"|"coding"|"inspection"|"verification"|"assessment"} LmActivityVisualType
 * @typedef {"required"|"recommended"|"optional"|"core"} LmRequirementHint
 */

export const LM_PRESENTATION_REGISTRY = {
  LM01: {
    id: "LM01",
    pathKey: "explorer",
    moduleNumber: 1,
    totalModules: 11,
    /** Interactive Chapter page exists (not curriculum/evidence completeness). */
    chapterAvailable: true,
    chapterRoute: {
      en: "/learning-modules/lm01",
      gr: "/learning-modules-gr/lm01",
    },
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
        showRequirementStatus: true,
        languages: ["gr"],
        title: {
          en: "Blockchain fundamentals",
          gr: "Βασικές αρχές του blockchain",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.1 (pp. 13–15) for a concise introduction to blockchain and its fundamental characteristics.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου την §1.1 (σελ. 13–15) για μια σύντομη εισαγωγή στο blockchain και τα βασικά χαρακτηριστικά του.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm01-textbook-kallipos-en-ref",
        visualType: "book",
        requirementHint: "recommended",
        showRequirementStatus: true,
        languages: ["en"],
        title: {
          en: "Blockchain fundamentals",
          gr: "Βασικές αρχές του blockchain",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.1 (pp. 13–15) for a concise introduction to blockchain and its fundamental characteristics.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου την §1.1 (σελ. 13–15) για μια σύντομη εισαγωγή στο blockchain και τα βασικά χαρακτηριστικά του.",
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

  /** Thin curriculum stubs — chapter UI not yet implemented. */
  LM02: {
    id: "LM02",
    pathKey: "explorer",
    moduleNumber: 2,
    totalModules: 11,
    chapterAvailable: true,
    chapterRoute: {
      en: "/learning-modules/lm02",
      gr: "/learning-modules-gr/lm02",
    },
    title: {
      en: "Why Blockchain?",
      gr: "Γιατί Blockchain;",
    },
    transition: {
      from: {
        en: "Blockchain could be used here",
        gr: "Το blockchain θα μπορούσε να χρησιμοποιηθεί εδώ",
      },
      to: {
        en: "I can determine whether blockchain is actually justified and explain why.",
        gr: "Μπορώ να κρίνω αν το blockchain δικαιολογείται πραγματικά και να εξηγήσω γιατί.",
      },
    },
    about: {
      en: "LM02 asks whether blockchain is justified for a problem. Learners compare trusted centralized alternatives with shared-control needs, separate record integrity from real-world truth, and prepare for the LM02 Assessment — including FoodTrace as Part B of that assessment.",
      gr: "Το LM02 εξετάζει αν το blockchain δικαιολογείται για ένα πρόβλημα. Οι εκπαιδευόμενοι συγκρίνουν αξιόπιστες κεντρικές εναλλακτικές με ανάγκες κοινού ελέγχου, διαχωρίζουν την ακεραιότητα εγγραφής από την αλήθεια του πραγματικού κόσμου και προετοιμάζονται για την Αξιολόγηση LM02 — συμπεριλαμβανομένου του FoodTrace ως Μέρος Β της ίδιας αξιολόγησης.",
    },
    learnerMeta: {
      estimatedTime: { en: "1–2 hours", gr: "1–2 ώρες" },
      level: { en: "Beginner", gr: "Αρχάριο" },
      assessmentXp: 150,
    },
    visuals: {
      hero: LM02_VISUALS.hero,
      // Shared chrome tiles until LM02-specific completion/next-step art ships.
      completion: LM01_VISUALS.completion,
      nextStep: LM01_VISUALS.nextStep,
      meta: {
        time: LM01_VISUALS.metaTime,
        level: LM01_VISUALS.metaLevel,
        xp: LM01_VISUALS.metaXp,
      },
      activityByType: {
        concept: LM02_VISUALS.concept,
        book: LM01_VISUALS.book,
        reading: LM01_VISUALS.book,
        assessment: LM01_VISUALS.assessment,
      },
    },
    learningOutcomes: {
      en: [
        "Identify trust and coordination conditions that may make blockchain worth considering.",
        "Recognize when a trusted centralized authority is simpler and sufficient.",
        "Compare blockchain-based and centralized approaches for the same problem.",
        "Explain blockchain capabilities and trade-offs — not decentralization as an automatic win.",
        "Distinguish record integrity from truth about the external world.",
        "Decide whether blockchain is justified and defend that decision concisely.",
      ],
      gr: [
        "Να εντοπίζεις συνθήκες εμπιστοσύνης και συντονισμού που μπορεί να κάνουν το blockchain άξιο εξέτασης.",
        "Να αναγνωρίζεις πότε μια αξιόπιστη κεντρική αρχή είναι απλούστερη και επαρκής.",
        "Να συγκρίνεις προσεγγίσεις με blockchain και κεντρικές προσεγγίσεις για το ίδιο πρόβλημα.",
        "Να εξηγείς ικανότητες και συμβιβασμούς του blockchain — όχι την αποκέντρωση ως αυτόματη νίκη.",
        "Να διακρίνεις την ακεραιότητα εγγραφής από την αλήθεια για τον εξωτερικό κόσμο.",
        "Να κρίνεις αν το blockchain δικαιολογείται και να υπερασπίζεσαι συνοπτικά την απόφαση.",
      ],
    },
    activities: [
      {
        id: "lm02-understand-trust-model",
        visualType: "concept",
        requirementHint: "core",
        expandable: true,
        languages: ["both"],
        title: {
          en: "Understand the trust model",
          gr: "Κατανόησε το μοντέλο εμπιστοσύνης",
        },
        description: {
          en: "Recognize when an accepted trusted authority may be sufficient, and distinguish technical distribution from decentralized authority.",
          gr: "Αναγνώρισε πότε μια αποδεκτή αξιόπιστη κεντρική αρχή μπορεί να είναι επαρκής και διάκρινε την τεχνική κατανομή από την αποκεντρωμένη αυθεντία.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm02-compare-architecture-choices",
        visualType: "concept",
        requirementHint: "core",
        expandable: true,
        languages: ["both"],
        title: {
          en: "Compare architecture choices",
          gr: "Σύγκρινε αρχιτεκτονικές επιλογές",
        },
        description: {
          en: "Compare shared-control needs, blockchain capabilities and trade-offs, and distinguish record integrity from truth about the external world.",
          gr: "Σύγκρινε τις ανάγκες κοινού ελέγχου, τις δυνατότητες και τους συμβιβασμούς του blockchain και διάκρινε την ακεραιότητα μιας εγγραφής από την αλήθεια για τον εξωτερικό κόσμο.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm02-slides",
        visualType: "reading",
        requirementHint: "recommended",
        languages: ["both"],
        title: {
          en: "LM02 slides",
          gr: "Διαφάνειες LM02",
        },
        description: {
          en: "Core teaching slides EN/GR — link reserved until the revised decks are ready.",
          gr: "Βασικές διαφάνειες EN/GR — ο σύνδεσμος θα προστεθεί όταν είναι έτοιμα τα αναθεωρημένα αρχεία.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
        reserved: true,
      },
      {
        id: "lm02-chapter1-reading",
        visualType: "book",
        requirementHint: "recommended",
        showRequirementStatus: true,
        languages: ["gr"],
        title: {
          en: "Benefits, limitations & when to use blockchain",
          gr: "Οφέλη, περιορισμοί και πότε δικαιολογείται το blockchain",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.2 (pp. 15–19) and §1.5 (pp. 28–31) to deepen your understanding of blockchain benefits, limitations, trade-offs, and the criteria used to decide whether a blockchain-based solution is justified.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου την §1.2 (σελ. 15–19) και την §1.5 (σελ. 28–31), ώστε να εμβαθύνεις στα οφέλη, τους περιορισμούς και τους συμβιβασμούς του blockchain, καθώς και στα κριτήρια με τα οποία κρίνουμε αν μια λύση βασισμένη σε blockchain δικαιολογείται.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm02-chapter1-reading-en-ref",
        visualType: "book",
        requirementHint: "recommended",
        showRequirementStatus: true,
        languages: ["en"],
        title: {
          en: "Benefits, limitations & when to use blockchain",
          gr: "Οφέλη, περιορισμοί και πότε δικαιολογείται το blockchain",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.2 (pp. 15–19) and §1.5 (pp. 28–31) to deepen your understanding of blockchain benefits, limitations, trade-offs, and the criteria used to decide whether a blockchain-based solution is justified.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου την §1.2 (σελ. 15–19) και την §1.5 (σελ. 28–31), ώστε να εμβαθύνεις στα οφέλη, τους περιορισμούς και τους συμβιβασμούς του blockchain, καθώς και στα κριτήρια με τα οποία κρίνουμε αν μια λύση βασισμένη σε blockchain δικαιολογείται.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm02-assessment",
        visualType: "assessment",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "LM02 Assessment",
          gr: "Αξιολόγηση LM02",
        },
        description: {
          en: "Test your understanding through 7 questions and apply the architectural reasoning from LM02 to FoodTrace. Successfully passing the assessment completes LM02.",
          gr: "Έλεγξε την κατανόησή σου μέσα από 7 ερωτήσεις και εφάρμοσε τον αρχιτεκτονικό συλλογισμό του LM02 στο FoodTrace. Η επιτυχής ολοκλήρωση της αξιολόγησης ολοκληρώνει το LM02.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm02/assessment",
          gr: "/learning-modules-gr/lm02/assessment",
        },
        evidenceId: "lm02-assessment",
        presentationOnly: false,
      },
    ],
  },
  LM03: {
    id: "LM03",
    pathKey: "explorer",
    moduleNumber: 3,
    totalModules: 11,
    chapterAvailable: true,
    chapterRoute: {
      en: "/learning-modules/lm03",
      gr: "/learning-modules-gr/lm03",
    },
    title: {
      en: "From Blockchain Concept to Blockchain Platforms",
      gr: "Από την Έννοια Blockchain στις Πλατφόρμες Blockchain",
    },
    transition: {
      from: {
        en: "Blockchain is justified here",
        gr: "Το blockchain δικαιολογείται εδώ",
      },
      to: {
        en: "I can determine the required participation, governance and deployment characteristics, evaluate a candidate blockchain platform against them, and justify its fit or rejection.",
        gr: "Μπορώ να προσδιορίσω τα απαιτούμενα χαρακτηριστικά συμμετοχής, διακυβέρνησης και ανάπτυξης, να αξιολογήσω μια υποψήφια πλατφόρμα blockchain με βάση αυτά και να δικαιολογήσω την καταλληλότητα ή την απόρριψή της.",
      },
    },
    about: {
      en: "LM03 moves from a justified blockchain need to platform reasoning. Learners separate participation/permissioning, governance/control and deployment model, translate requirements into platform characteristics, compare a candidate platform, and practice that reasoning on FoodTrace — without treating textbook taxonomies as the Web3Edu architecture model.",
      gr: "Το LM03 μεταβαίνει από μια δικαιολογημένη ανάγκη για blockchain στον συλλογισμό επιλογής πλατφόρμας. Οι εκπαιδευόμενοι διακρίνουν συμμετοχή/άδειες, διακυβέρνηση/έλεγχο και μοντέλο ανάπτυξης, μεταφράζουν απαιτήσεις σε χαρακτηριστικά πλατφόρμας, συγκρίνουν μια υποψήφια πλατφόρμα και εξασκούν τον συλλογισμό στο FoodTrace — χωρίς να αντιμετωπίζουν τις ταξινομήσεις του συγγράμματος ως το αρχιτεκτονικό μοντέλο του Web3Edu.",
    },
    learnerMeta: {
      estimatedTime: { en: "1–2 hours", gr: "1–2 ώρες" },
      level: { en: "Beginner", gr: "Αρχάριο" },
      assessmentXp: 150,
    },
    visuals: {
      hero: LM03_VISUALS.hero,
      completion: LM01_VISUALS.completion,
      nextStep: LM01_VISUALS.nextStep,
      meta: {
        time: LM01_VISUALS.metaTime,
        level: LM01_VISUALS.metaLevel,
        xp: LM01_VISUALS.metaXp,
      },
      activityByType: {
        // Shared type fallbacks; step-specific concept art is in activityById.
        concept: LM03_VISUALS.architecturalDimensions,
        observation: LM01_VISUALS.demo,
        book: LM01_VISUALS.book,
        reading: LM01_VISUALS.book,
        assessment: LM01_VISUALS.assessment,
      },
      activityById: {
        "lm03-separate-dimensions": LM03_VISUALS.architecturalDimensions,
        "lm03-requirements-to-characteristics":
          LM03_VISUALS.requirementsToCharacteristics,
        "lm03-foodtrace-revisited": LM03_VISUALS.foodtraceRevisited,
      },
    },
    learningOutcomes: {
      en: [
        "Distinguish permissionless from permissioned participation.",
        "Distinguish network participation from governance and control.",
        "Explain public, private and consortium blockchain deployments without treating them as synonyms for permissioning.",
        "Translate application requirements into required blockchain-platform characteristics.",
        "Compare candidate blockchain platforms against those requirements.",
        "Determine whether a candidate platform is a good fit or misfit and justify the decision.",
        "Recognize that rejecting a blockchain platform is a valid architectural outcome even when blockchain itself was justified.",
      ],
      gr: [
        "Να διακρίνεις τη permissionless από τη permissioned συμμετοχή.",
        "Να διακρίνεις τη συμμετοχή στο δίκτυο από τη διακυβέρνηση και τον έλεγχο.",
        "Να εξηγείς δημόσιες, ιδιωτικές και consortium αναπτύξεις blockchain χωρίς να τις αντιμετωπίζεις ως συνώνυμα του permissioning.",
        "Να μεταφράζεις απαιτήσεις εφαρμογής σε απαιτούμενα χαρακτηριστικά πλατφόρμας blockchain.",
        "Να συγκρίνεις υποψήφιες πλατφόρμες blockchain με βάση αυτές τις απαιτήσεις.",
        "Να κρίνεις αν μια υποψήφια πλατφόρμα ταιριάζει ή όχι και να δικαιολογείς την απόφαση.",
        "Να αναγνωρίζεις ότι η απόρριψη μιας πλατφόρμας blockchain είναι έγκυρο αρχιτεκτονικό αποτέλεσμα ακόμη και όταν το ίδιο το blockchain δικαιολογείται.",
      ],
    },
    activities: [
      {
        id: "lm03-separate-dimensions",
        visualType: "concept",
        requirementHint: "core",
        expandable: true,
        languages: ["both"],
        title: {
          en: "Separate the architectural dimensions",
          gr: "Διάκρινε τις αρχιτεκτονικές διαστάσεις",
        },
        description: {
          en: "Keep participation/permissioning, governance/control and deployment model as related but separate dimensions — a distributed system is not automatically decentralized in governance.",
          gr: "Κράτα τη συμμετοχή/άδειες, τη διακυβέρνηση/έλεγχο και το μοντέλο ανάπτυξης ως συναφείς αλλά διακριτές διαστάσεις — ένα κατανεμημένο σύστημα δεν είναι αυτόματα αποκεντρωμένο στη διακυβέρνηση.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm03-chapter1-reading",
        visualType: "book",
        requirementHint: "recommended",
        showRequirementStatus: true,
        languages: ["gr"],
        title: {
          en: "Participation, governance & deployment readings",
          gr: "Ανάγνωση για συμμετοχή, διακυβέρνηση και ανάπτυξη",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.4–§1.4.4 (pp. 23–28) as background. Treat the textbook taxonomy as supporting reading — Web3Edu keeps participation/permissioning, governance/control and deployment model as separate architectural dimensions.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου τις §1.4–§1.4.4 (σελ. 23–28) ως υποστηρικτικό υλικό. Αντιμετώπισε την ταξινόμηση του συγγράμματος ως συμπληρωματική ανάγνωση — το Web3Edu διατηρεί τη συμμετοχή/άδειες, τη διακυβέρνηση/έλεγχο και το μοντέλο ανάπτυξης ως διακριτές αρχιτεκτονικές διαστάσεις.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm03-chapter1-reading-en-ref",
        visualType: "book",
        requirementHint: "recommended",
        showRequirementStatus: true,
        languages: ["en"],
        title: {
          en: "Participation, governance & deployment readings",
          gr: "Ανάγνωση για συμμετοχή, διακυβέρνηση και ανάπτυξη",
        },
        description: {
          en: "Read Kallipos Chapter 1, §1.4–§1.4.4 (pp. 23–28) as background. Treat the textbook taxonomy as supporting reading — Web3Edu keeps participation/permissioning, governance/control and deployment model as separate architectural dimensions.",
          gr: "Διάβασε από το Κεφάλαιο 1 του Κάλλιπου τις §1.4–§1.4.4 (σελ. 23–28) ως υποστηρικτικό υλικό. Αντιμετώπισε την ταξινόμηση του συγγράμματος ως συμπληρωματική ανάγνωση — το Web3Edu διατηρεί τη συμμετοχή/άδειες, τη διακυβέρνηση/έλεγχο και το μοντέλο ανάπτυξης ως διακριτές αρχιτεκτονικές διαστάσεις.",
        },
        linkKind: "external",
        href: LM01_KALLIPOS_TEXTBOOK_URL,
        presentationOnly: true,
      },
      {
        id: "lm03-requirements-to-characteristics",
        visualType: "concept",
        requirementHint: "core",
        expandable: true,
        languages: ["both"],
        title: {
          en: "From requirements to platform characteristics",
          gr: "Από τις απαιτήσεις στα χαρακτηριστικά της πλατφόρμας",
        },
        description: {
          en: "Move from application requirements to required blockchain characteristics, then to a candidate platform and a fit / misfit judgment — do not pick a platform first.",
          gr: "Πέρασε από τις απαιτήσεις της εφαρμογής στα απαιτούμενα χαρακτηριστικά blockchain, μετά σε μια υποψήφια πλατφόρμα και σε κρίση καταλληλότητας / ακαταλληλότητας — μην επιλέγεις πρώτα πλατφόρμα.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm03-platform-comparison",
        visualType: "observation",
        requirementHint: "optional",
        expandable: true,
        languages: ["both"],
        title: {
          en: "Platform Comparison Canvas",
          gr: "Καμβάς Σύγκρισης Πλατφόρμας",
        },
        description: {
          en: "Practice only (0 XP) — reason from scenario requirements to characteristics, compare a candidate platform, and choose Fit / Misfit / Insufficient information. Nothing is saved.",
          gr: "Μόνο εξάσκηση (0 XP) — συλλογίσου από τις απαιτήσεις του σεναρίου στα χαρακτηριστικά, σύγκρινε μια υποψήφια πλατφόρμα και επίλεξε Κατάλληλη / Ακατάλληλη / Ανεπαρκείς πληροφορίες. Τίποτα δεν αποθηκεύεται.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm03-foodtrace-revisited",
        visualType: "concept",
        requirementHint: "core",
        expandable: true,
        languages: ["both"],
        title: {
          en: "FoodTrace revisited",
          gr: "FoodTrace ξανά",
        },
        description: {
          en: "Reconsider FoodTrace now that blockchain may be justified — who participates, who controls membership, and what platform characteristics follow. No single platform answer is required.",
          gr: "Ξανασκέψου το FoodTrace τώρα που το blockchain μπορεί να δικαιολογείται — ποιοι συμμετέχουν, ποιος ελέγχει τη συμμετοχή και ποια χαρακτηριστικά πλατφόρμας προκύπτουν. Δεν απαιτείται μία απάντηση πλατφόρμας.",
        },
        linkKind: "none",
        href: null,
        presentationOnly: true,
      },
      {
        id: "lm03-assessment",
        visualType: "assessment",
        requirementHint: "required",
        languages: ["both"],
        title: {
          en: "LM03 Assessment",
          gr: "Αξιολόγηση LM03",
        },
        description: {
          en: "Test your platform-fit reasoning through 7 questions — including FoodTrace revisited. Successfully passing the assessment completes LM03.",
          gr: "Έλεγξε τον συλλογισμό καταλληλότητας πλατφόρμας μέσα από 7 ερωτήσεις — συμπεριλαμβανομένου του FoodTrace ξανά. Η επιτυχής ολοκλήρωση της αξιολόγησης ολοκληρώνει το LM03.",
        },
        linkKind: "internal",
        href: {
          en: "/learning-modules/lm03/assessment",
          gr: "/learning-modules-gr/lm03/assessment",
        },
        evidenceId: "lm03-assessment",
        presentationOnly: false,
      },
    ],
  },
  LM04: {
    id: "LM04",
    pathKey: "builder",
    moduleNumber: 4,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Keys, Wallets and Blockchain Identity",
      gr: "Κλειδιά, Πορτοφόλια και Ταυτότητα Blockchain",
    },
  },
  LM05: {
    id: "LM05",
    pathKey: "builder",
    moduleNumber: 5,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Transactions and Blockchain State",
      gr: "Συναλλαγές και Κατάσταση Blockchain",
    },
  },
  LM06: {
    id: "LM06",
    pathKey: "builder",
    moduleNumber: 6,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Consensus and Distributed Agreement",
      gr: "Συναίνεση και Κατανεμημένη Συμφωνία",
    },
  },
  LM07: {
    id: "LM07",
    pathKey: "builder",
    moduleNumber: 7,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Understanding Smart Contracts",
      gr: "Κατανόηση Έξυπνων Συμβολαίων",
    },
  },

  LM08: {
    id: "LM08",
    pathKey: "builder",
    moduleNumber: 8,
    totalModules: 11,
    /** Interactive Chapter page exists (not curriculum/evidence completeness). */
    chapterAvailable: true,
    chapterRoute: {
      en: "/learning-modules/lm08",
      gr: "/learning-modules-gr/lm08",
    },
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
      nextStep: LM08_VISUALS.nextStep,
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

  /** Thin curriculum stubs — chapter UI not yet implemented. */
  LM09: {
    id: "LM09",
    pathKey: "architect",
    moduleNumber: 9,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Building Smart Contracts",
      gr: "Κατασκευή Έξυπνων Συμβολαίων",
    },
  },
  LM10: {
    id: "LM10",
    pathKey: "architect",
    moduleNumber: 10,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Tokens and Tokenization",
      gr: "Tokens και Tokenization",
    },
  },
  LM11: {
    id: "LM11",
    pathKey: "architect",
    moduleNumber: 11,
    totalModules: 11,
    chapterAvailable: false,
    chapterRoute: null,
    title: {
      en: "Building and Using an ERC-20 Token",
      gr: "Κατασκευή και Χρήση ERC-20 Token",
    },
  },
};

/** Canonical curriculum order for Learn landing presentation. */
export const LM_CURRICULUM_IDS = Object.freeze([
  "LM01",
  "LM02",
  "LM03",
  "LM04",
  "LM05",
  "LM06",
  "LM07",
  "LM08",
  "LM09",
  "LM10",
  "LM11",
]);

/** Path groups for Learn landing (exclusive module sets). */
export const LM_LEARN_PATH_KEYS = Object.freeze(["explorer", "builder", "architect"]);

/** @param {string} moduleId */
export function getLmPresentationModule(moduleId) {
  return LM_PRESENTATION_REGISTRY[moduleId] ?? null;
}

/**
 * Ordered LM01–LM11 presentation modules for curriculum overview.
 * @returns {Array<object>}
 */
export function getLmCurriculumModules() {
  return LM_CURRICULUM_IDS.map((id) => getLmPresentationModule(id)).filter(Boolean);
}

/**
 * Modules for one Learn path group, ordered by moduleNumber.
 * @param {"explorer"|"builder"|"architect"} pathKey
 */
export function getLmModulesForPath(pathKey) {
  return getLmCurriculumModules()
    .filter((mod) => mod.pathKey === pathKey)
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
}

/**
 * @param {string} moduleId
 * @returns {boolean} True only when an Interactive Chapter page exists.
 */
export function isLmChapterAvailable(moduleId) {
  return getLmPresentationModule(moduleId)?.chapterAvailable === true;
}

/**
 * @param {string} moduleId
 * @param {"en"|"gr"} lang
 * @returns {string|null}
 */
export function getLmChapterRoute(moduleId, lang = "en") {
  const mod = getLmPresentationModule(moduleId);
  if (!mod || mod.chapterAvailable !== true || !mod.chapterRoute) return null;
  const locale = lang === "gr" ? "gr" : "en";
  const route = mod.chapterRoute[locale] || mod.chapterRoute.en;
  return typeof route === "string" && route ? route : null;
}

/**
 * Localized module title from the presentation registry.
 * @param {string} moduleId
 * @param {"en"|"gr"} lang
 * @returns {string|null}
 */
export function getLmRegistryModuleTitle(moduleId, lang = "en") {
  const title = getLmPresentationModule(moduleId)?.title;
  if (!title || typeof title !== "object") return null;
  const locale = lang === "gr" ? "gr" : "en";
  return title[locale] || title.en || null;
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
 *   activityById?: Record<string, string>,
 * }|null}
 */
export function getLmModuleVisuals(moduleId) {
  const visuals = getLmPresentationModule(moduleId)?.visuals;
  return visuals && typeof visuals === "object" ? visuals : null;
}

/**
 * Activity thumbnail src from the module's approved visual set.
 * Prefers activityById when present, then activityByType.
 * @param {string} moduleId
 * @param {string} visualType
 * @param {string|null|undefined} [activityId]
 * @returns {string|null}
 */
export function getLmActivityVisualSrc(moduleId, visualType, activityId = null) {
  const visuals = getLmModuleVisuals(moduleId);
  if (typeof activityId === "string" && activityId) {
    const byId = visuals?.activityById?.[activityId];
    if (typeof byId === "string" && byId) return byId;
  }
  const src = visuals?.activityByType?.[visualType];
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
