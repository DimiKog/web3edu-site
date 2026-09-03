/**
 * LM01 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 */

export const LM01_ASSESSMENT_COPY = {
  en: {
    title: "LM01 Assessment — What is Blockchain?",
    subtitle:
      "Check your understanding of blockchain basics, important properties and limits, and when blockchain is — or is not — worth considering.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes seven questions about the key ideas introduced in LM01. Most questions have one best answer, while one asks you to select all answers that apply. If you do not pass on your first attempt, you can review the feedback and try again.",
    responseModeHint: "",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    foodtraceDesignCaseMarker: "FoodTrace · Design Case",
    foodtraceNote:
      "You will also meet FoodTrace, a design case that will continue in later modules. For now, you are only deciding whether blockchain is worth considering. As new requirements are introduced later, you may revise your thinking — and blockchain may or may not remain the most appropriate solution.",
    classificationNote:
      "As you answer, keep two distinctions in mind. Public / Private / Consortium describe how a blockchain network is governed, while Permissioned / Permissionless describe who may participate.",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM01 assessment.",
    questionsTitle: "Assessment questions",
    submitAnswers: "Submit assessment",
    submitting: "Submitting…",
    retry: "Try again",
    failedTitle: "Assessment not passed yet",
    failedScore: (score, total) => `${score} / ${total}`,
    feedbackTitle: "Review these ideas",
    passedTitle: "LM01 Assessment Complete",
    alreadyPassedTitle: "LM01 Assessment already recorded",
    passedScore: (score, total) => `${score} / ${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP for this assessment was already awarded earlier.",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step.",
    questions: {
      lm01_q1_distribute_ledger: {
        prompt:
          "Several independent organizations need to maintain a common record of transactions. What is a key reason they might consider a distributed ledger rather than a database controlled by one of the organizations?",
        options: {
          A: "A distributed ledger guarantees that all submitted information is true.",
          B: "It can allow the organizations to maintain a shared record without giving one participant exclusive control over it.",
          C: "Distributed ledgers always process transactions faster than centralized databases.",
          D: "A distributed ledger removes the need for governance between the organizations.",
        },
      },
      lm01_q2_hash_linkage: {
        prompt:
          "A block contains a cryptographic reference derived from the previous block. What is an important consequence of this design?",
        options: {
          A: "Previous data becomes physically impossible to modify.",
          B: "Changing data in an earlier block can invalidate the hash relationships with subsequent blocks.",
          C: "All information stored in the blockchain becomes encrypted.",
          D: "The blockchain guarantees that every recorded transaction describes a true real-world event.",
        },
      },
      lm01_q3_not_guaranteed: {
        prompt:
          "Which of the following are NOT guaranteed simply because information has been recorded on a blockchain?",
        options: {
          A: "The information originally submitted was factually correct.",
          B: "The integrity mechanisms can reveal that previously recorded blockchain data has been altered.",
          C: "A real-world event described by the recorded information actually occurred.",
          D: "Information entered by an external source is trustworthy.",
        },
      },
      lm01_q4_network_model: {
        prompt:
          "Five independent companies establish a blockchain network together. Each company participates in the governance of the network, and decisions about the network are made collectively. No single company owns or controls the blockchain. Which network model best describes this arrangement?",
        options: {
          A: "Public blockchain",
          B: "Private blockchain",
          C: "Consortium blockchain",
          D: "Centralized database",
        },
      },
      lm01_q5_blockchain_crypto: {
        prompt: "Which statement is the most accurate?",
        options: {
          A: "Every blockchain requires its own cryptocurrency.",
          B: "Blockchain should generally replace conventional databases.",
          C: "Blockchain can maintain shared records/state under particular trust and governance conditions; cryptocurrency is one possible application of blockchain technology.",
          D: "A database becomes a blockchain when several organizations use it.",
        },
      },
      lm01_q6_foodtrace_consider: {
        prompt:
          "Five independent organizations participate in a food supply chain (the FoodTrace case). Each organization records events as products move between them. They need a shared history of these events, and disputes sometimes occur about when records were entered or changed. Based only on the information currently available, what is the best initial conclusion?",
        options: {
          A: "A blockchain-based approach is worth considering because independent organizations need a shared and auditable history.",
          B: "Blockchain is definitely the best solution because several organizations are involved.",
          C: "Blockchain should be used because it guarantees that the information entered by each organization is true.",
          D: "Blockchain should not be considered because supply-chain applications require conventional databases.",
        },
      },
      lm01_q7_university_inventory: {
        prompt:
          "A university department wants to track laptops and monitors stored in one equipment room. One administrator manages the inventory. The university already operates a central database, and no independent organization needs to maintain or verify a shared copy of these records. Based on these requirements, what is the most appropriate starting approach?",
        options: {
          A: "Public blockchain",
          B: "Private blockchain",
          C: "Consortium blockchain",
          D: "Use the existing centralized database",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM01 — Τι είναι το Blockchain;",
    subtitle:
      "Ελέγξτε την κατανόησή σας για τα βασικά του blockchain, σημαντικές ιδιότητες και όρια, και πότε αξίζει — ή δεν αξίζει — να εξεταστεί.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασέ το πρώτα",
    introBody:
      "Αυτή η αξιολόγηση περιλαμβάνει επτά ερωτήσεις πάνω στις βασικές έννοιες του LM01. Οι περισσότερες έχουν μία καλύτερη απάντηση, ενώ σε μία θα χρειαστεί να επιλέξεις όλες τις απαντήσεις που ισχύουν. Αν δεν περάσεις με την πρώτη προσπάθεια, μπορείς να δεις την ανατροφοδότηση και να δοκιμάσεις ξανά.",
    responseModeHint: "",
    multiSelectHint:
      "Επιλέξτε όλες όσες ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία.",
    foodtraceDesignCaseMarker: "FoodTrace · Μελέτη Περίπτωσης",
    foodtraceNote:
      "Θα γνωρίσεις επίσης το FoodTrace, μια μελέτη περίπτωσης που θα συνεχιστεί και σε επόμενα Learning Modules. Προς το παρόν, εξετάζεις μόνο αν αξίζει να εξεταστεί η χρήση blockchain. Καθώς θα προστίθενται νέες απαιτήσεις στα επόμενα modules, μπορεί να αναθεωρήσεις την αρχική σου σκέψη — και το blockchain μπορεί τελικά να είναι ή να μην είναι η καταλληλότερη λύση.",
    classificationNote:
      "Καθώς απαντάς, κράτησε στο μυαλό σου δύο διαφορετικές διαστάσεις. Public / Private / Consortium περιγράφουν τον τρόπο διακυβέρνησης ενός blockchain δικτύου, ενώ Permissioned / Permissionless περιγράφουν ποιοι μπορούν να συμμετέχουν.",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired: "Συνδεθείτε με την ταυτότητα Web3Edu για να δώσετε την αξιολόγηση LM01.",
    questionsTitle: "Ερωτήσεις αξιολόγησης",
    submitAnswers: "Υποβολή αξιολόγησης",
    submitting: "Υποβολή…",
    retry: "Δοκιμάστε ξανά",
    failedTitle: "Η αξιολόγηση δεν πέρασε ακόμη",
    failedScore: (score, total) => `${score} / ${total}`,
    feedbackTitle: "Επανεξετάστε αυτές τις ιδέες",
    passedTitle: "Η Αξιολόγηση LM01 Ολοκληρώθηκε",
    alreadyPassedTitle: "Η αξιολόγηση LM01 είναι ήδη καταγεγραμμένη",
    passedScore: (score, total) => `${score} / ${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Τα XP για αυτή την αξιολόγηση έχουν ήδη απονεμηθεί.",
    postPassTitle: "Βασικά συμπεράσματα",
    backToDashboard: "Επιστροφή στον Πίνακα",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η διαδρομή ενημερώνεται από τον διακομιστή. Χρησιμοποιήστε το «Συνέχισε τη Μάθηση» στον Πίνακα για το επόμενο βήμα.",
    questions: {
      lm01_q1_distribute_ledger: {
        prompt:
          "Αρκετοί ανεξάρτητοι οργανισμοί χρειάζονται κοινό αρχείο συναλλαγών. Ποιος είναι βασικός λόγος να εξετάσουν κατανεμημένο καθολικό αντί για βάση δεδομένων που ελέγχει ένας από αυτούς;",
        options: {
          A: "Ένα κατανεμημένο καθολικό εγγυάται ότι κάθε υποβληθείσα πληροφορία είναι αληθής.",
          B: "Επιτρέπει κοινό αρχείο χωρίς να δίνει σε έναν συμμετέχοντα αποκλειστικό έλεγχο.",
          C: "Τα κατανεμημένα καθολικά επεξεργάζονται πάντα τις συναλλαγές ταχύτερα από κεντρικές βάσεις.",
          D: "Ένα κατανεμημένο καθολικό αφαιρεί την ανάγκη διακυβέρνησης μεταξύ των οργανισμών.",
        },
      },
      lm01_q2_hash_linkage: {
        prompt:
          "Ένα μπλοκ περιέχει κρυπτογραφική αναφορά που προκύπτει από το προηγούμενο μπλοκ. Ποια είναι σημαντική συνέπεια αυτού του σχεδιασμού;",
        options: {
          A: "Τα προηγούμενα δεδομένα γίνονται φυσικά αδύνατο να τροποποιηθούν.",
          B: "Αλλαγή δεδομένων σε προηγούμενο μπλοκ μπορεί να ακυρώσει τις σχέσεις hash με τα επόμενα μπλοκ.",
          C: "Όλες οι πληροφορίες στο blockchain κρυπτογραφούνται.",
          D: "Το blockchain εγγυάται ότι κάθε καταγεγραμμένη συναλλαγή περιγράφει αληθινό γεγονός στον πραγματικό κόσμο.",
        },
      },
      lm01_q3_not_guaranteed: {
        prompt:
          "Ποια από τα παρακάτω ΔΕΝ εγγυώνται απλώς επειδή μια πληροφορία καταγράφηκε σε blockchain;",
        options: {
          A: "Η αρχικά υποβληθείσα πληροφορία ήταν πραγματικά σωστή.",
          B: "Οι μηχανισμοί ακεραιότητας μπορούν να αποκαλύψουν ότι προηγούμενα δεδομένα στο blockchain έχουν αλλοιωθεί.",
          C: "Ένα γεγονός του πραγματικού κόσμου που περιγράφει η καταγραφή όντως συνέβη.",
          D: "Πληροφορία από εξωτερική πηγή είναι αξιόπιστη.",
        },
      },
      lm01_q4_network_model: {
        prompt:
          "Πέντε ανεξάρτητες εταιρείες δημιουργούν μαζί ένα δίκτυο blockchain. Κάθε εταιρεία συμμετέχει στη διακυβέρνηση και οι αποφάσεις λαμβάνονται συλλογικά. Καμία εταιρεία δεν κατέχει ή ελέγχει μόνη το blockchain. Ποιο μοντέλο δικτύου ταιριάζει καλύτερα;",
        options: {
          A: "Δημόσιο blockchain",
          B: "Ιδιωτικό blockchain",
          C: "Blockchain κοινοπραξίας (Consortium)",
          D: "Κεντρική βάση δεδομένων",
        },
      },
      lm01_q5_blockchain_crypto: {
        prompt: "Ποια δήλωση είναι η πιο ακριβής;",
        options: {
          A: "Κάθε blockchain απαιτεί δικό του κρυπτονόμισμα.",
          B: "Το blockchain θα πρέπει γενικά να αντικαθιστά τις συμβατικές βάσεις δεδομένων.",
          C: "Το blockchain μπορεί να διατηρεί κοινά αρχεία/κατάσταση υπό συγκεκριμένες συνθήκες εμπιστοσύνης και διακυβέρνησης· το κρυπτονόμισμα είναι μία πιθανή εφαρμογή.",
          D: "Μια βάση δεδομένων γίνεται blockchain όταν τη χρησιμοποιούν πολλοί οργανισμοί.",
        },
      },
      lm01_q6_foodtrace_consider: {
        prompt:
          "Πέντε ανεξάρτητοι οργανισμοί συμμετέχουν σε αλυσίδα τροφίμων (περίπτωση FoodTrace). Καθένας καταγράφει γεγονότα καθώς τα προϊόντα μετακινούνται. Χρειάζονται κοινό ιστορικό και συχνά υπάρχουν διαφωνίες για το πότε καταχωρήθηκαν ή άλλαξαν εγγραφές. Με βάση μόνο αυτές τις πληροφορίες, ποιο είναι το καλύτερο αρχικό συμπέρασμα;",
        options: {
          A: "Μια προσέγγιση blockchain αξίζει να εξεταστεί επειδή ανεξάρτητοι οργανισμοί χρειάζονται κοινό και ελέγξιμο ιστορικό.",
          B: "Το blockchain είναι σίγουρα η καλύτερη λύση επειδή συμμετέχουν πολλοί οργανισμοί.",
          C: "Πρέπει να χρησιμοποιηθεί blockchain επειδή εγγυάται ότι οι πληροφορίες κάθε οργανισμού είναι αληθείς.",
          D: "Δεν πρέπει να εξεταστεί blockchain επειδή οι εφαρμογές εφοδιαστικής απαιτούν συμβατικές βάσεις.",
        },
      },
      lm01_q7_university_inventory: {
        prompt:
          "Ένα πανεπιστημιακό τμήμα θέλει να παρακολουθεί φορητούς υπολογιστές και οθόνες σε μία αίθουσα εξοπλισμού. Ένας διαχειριστής διαχειρίζεται το απόθεμα. Το πανεπιστήμιο έχει ήδη κεντρική βάση δεδομένων και κανένας ανεξάρτητος οργανισμός δεν χρειάζεται κοινό αντίγραφο αυτών των εγγραφών. Ποια είναι η καταλληλότερη αρχική προσέγγιση;",
        options: {
          A: "Δημόσιο blockchain",
          B: "Ιδιωτικό blockchain",
          C: "Blockchain κοινοπραξίας (Consortium)",
          D: "Χρήση της υπάρχουσας κεντρικής βάσης δεδομένων",
        },
      },
    },
  },
};

/** Localized post-pass rationales (safe pedagogical text; not the answer key). */
export const LM01_POST_PASS_RATIONALES = {
  en: {
    lm01_q4_network_model:
      "A consortium blockchain is governed collectively by multiple independent organizations. In contrast, a private blockchain is typically governed by a single organization for its own controlled environment. Public / Private / Consortium is a separate classification dimension from Permissioned / Permissionless.",
    lm01_q7_university_inventory:
      "Blockchain is not automatically an improvement over a centralized system. When there is a clear trusted authority and no meaningful distributed-trust requirement, a conventional database may be the simpler and more appropriate solution.",
  },
  gr: {
    lm01_q4_network_model:
      "Ένα blockchain κοινοπραξίας διακυβερνάται συλλογικά από πολλούς ανεξάρτητους οργανισμούς. Αντίθετα, ένα ιδιωτικό blockchain συνήθως διακυβερνάται από έναν οργανισμό για το δικό του ελεγχόμενο περιβάλλον. Δημόσιο / Ιδιωτικό / Κοινοπραξίας είναι ξεχωριστή διάσταση από Permissioned / Permissionless.",
    lm01_q7_university_inventory:
      "Το blockchain δεν είναι αυτόματα βελτίωση έναντι ενός κεντρικού συστήματος. Όταν υπάρχει σαφής αξιόπιστη αρχή και δεν υπάρχει ουσιαστική ανάγκη κατανεμημένης εμπιστοσύνης, μια συμβατική βάση δεδομένων μπορεί να είναι απλούστερη και καταλληλότερη.",
  },
};

export function getLm01AssessmentCopy(lang = "en") {
  return LM01_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM01_ASSESSMENT_COPY.en;
}
