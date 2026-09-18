/**
 * LM05 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 */

export const LM05_ASSESSMENT_COPY = {
  en: {
    title: "LM05 Assessment — Transactions and Blockchain State",
    subtitle:
      "Check your understanding of transactions, nonce, gas, read vs state change, failed execution, TrustChain state transitions, and pending transactions.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes seven single-choice questions from LM05. Pass with at least 5 correct answers and the Critical question. If you do not pass on your first attempt, review the feedback and try again. Completing LM05 also requires Labs 04–05 and the Educational Ledger contribution.",
    responseModeHint:
      "This assessment verifies conceptual understanding. It does not replace Labs 04–05 or the Educational Ledger contribution, which remain required evidence for LM05 completion.",
    metaItems: [
      "7 questions",
      "Single choice",
      "Pass: 5/7 + Critical question",
      "Retries allowed",
    ],
    metaScopeHint:
      "Checks transactions, state, read vs write, and the pending lifecycle from LM05.",
    metaSummaryLabel: "Assessment summary",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    singleChoiceType: "Single choice",
    multiSelectType: "Select all that apply",
    criticalLabel: "Critical",
    classificationNote: "",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM05 assessment.",
    questionsTitle: "Assessment questions",
    submitAnswers: "Submit assessment",
    submitting: "Submitting…",
    retry: "Try again",
    failedTitle: "Assessment not passed yet",
    failedLead: "Review the feedback below, then try again.",
    failedCriticalLead:
      "Your score meets the numeric threshold, but a Critical question needs another look.",
    failedScore: (score, total) => `${score}/${total}`,
    feedbackTitle: "Review these questions",
    passedTitle: "LM05 Assessment Complete",
    alreadyPassedTitle: "LM05 Assessment already recorded",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP already awarded",
    youCanNow: "You can now:",
    passCapabilities: [
      "Explain a transaction as a request to change blockchain state.",
      "Distinguish read-only interaction from state-changing transactions.",
      "Separate pending acceptance from inclusion, execution, and state change.",
    ],
    keyPrinciple:
      "Creating or submitting a transaction is not the same as inclusion, successful execution, or shared state change.",
    revisitOne: "One point to revisit",
    revisitMany: "Points to revisit",
    reviewTakeaways: "Review key takeaways",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step. LM05 is complete only when Labs 04–05, the Educational Ledger contribution, and this assessment are all satisfied.",
    questions: {
      lm05_q1_transaction_intent: {
        heading: "Transaction intent",
        prompt:
          "Alice wants to transfer 2 EDU tokens to Bob. What does the transaction primarily represent?",
        options: {
          A: "A request to change blockchain state",
          B: "A copy of the current blockchain state",
          C: "Proof that the transfer has already succeeded",
          D: "A new block",
        },
      },
      lm05_q2_nonce: {
        heading: "Nonce",
        prompt:
          "Alice sends a transaction to Bob. After the transaction is successfully executed, which statement about the nonce is correct?",
        options: {
          A: "Both Alice's and Bob's nonces increase",
          B: "Bob's nonce increases because he received funds",
          C: "Alice's nonce increases; Bob's does not increase merely because he received funds",
          D: "Neither nonce changes",
        },
      },
      lm05_q3_gas: {
        heading: "Gas / fees",
        prompt:
          "Alice sends a transaction that requires gas. Who normally pays the transaction fee?",
        options: {
          A: "The receiver",
          B: "The sender who authorizes the transaction",
          C: "Every network participant equally",
          D: "Nobody if the transaction changes state",
        },
      },
      lm05_q4_read_vs_state_change: {
        heading: "Read vs state change",
        prompt:
          "A learner reads the current value stored in a smart contract without requesting any modification. Later, they submit an interaction that changes that stored value. What is the key difference?",
        options: {
          A: "Both interactions necessarily create state-changing transactions",
          B: "Reading can be performed without changing blockchain state, while modifying the stored value requires a state-changing transaction",
          C: "Reading changes state, while writing does not",
          D: "Neither interaction involves the smart contract state",
        },
      },
      lm05_q5_failed_execution: {
        heading: "Failed execution",
        prompt:
          "A learner submits a transaction intended to increment a value stored in a smart contract, but the transaction fails during execution. What should we expect?",
        options: {
          A: "The contract state still increments because the transaction was submitted",
          B: "The intended contract state change does not take effect",
          C: "The interaction becomes equivalent to a read-only call",
          D: "A new wallet must be created",
        },
      },
      lm05_q6_trustchain_state_transition: {
        heading: "TrustChain state transition",
        prompt:
          "In TrustChain, a product record currently shows Owner: Producer. A valid ownership-transfer transaction is successfully executed, changing it to Owner: Distributor. What has the blockchain recorded?",
        options: {
          A: "A new wallet for the distributor",
          B: "A state transition from the previous product state to a new product state",
          C: "Proof that every detail about the physical product is factually true",
          D: "Only a read-only query of the product record",
        },
      },
      lm05_q7_pending_transaction: {
        heading: "Pending transaction",
        prompt:
          "A learner creates a valid educational transaction and it appears as PENDING in the shared transaction pool. What can we conclude?",
        options: {
          A: "It has already been included in a block",
          B: "It has already changed the shared blockchain state",
          C: "It has been accepted into the pool as pending, but inclusion and state change have not yet occurred",
          D: "It has failed",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM05 — Συναλλαγές και Κατάσταση Blockchain",
    subtitle:
      "Έλεγξε την κατανόησή σου για συναλλαγές, nonce, gas, ανάγνωση vs αλλαγή κατάστασης, αποτυχημένη εκτέλεση, μεταβάσεις TrustChain και pending συναλλαγές.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασε πρώτα αυτό",
    introBody:
      "Η αξιολόγηση περιλαμβάνει επτά ερωτήσεις μίας επιλογής από το LM05. Περνάς με τουλάχιστον 5 σωστές απαντήσεις και τη Κρίσιμη ερώτηση. Αν δεν περάσεις με την πρώτη, διάβασε το feedback και δοκίμασε ξανά. Η ολοκλήρωση του LM05 απαιτεί επίσης τα Labs 04–05 και τη συνεισφορά στο Εκπαιδευτικό Ledger.",
    responseModeHint:
      "Η αξιολόγηση επαληθεύει εννοιολογική κατανόηση. Δεν αντικαθιστά τα Labs 04–05 ή τη συνεισφορά στο Εκπαιδευτικό Ledger, που παραμένουν απαιτούμενα αποδεικτικά για την ολοκλήρωση του LM05.",
    metaItems: [
      "7 ερωτήσεις",
      "Μία επιλογή",
      "Επιτυχία: 5/7 + Κρίσιμη ερώτηση",
      "Επιτρέπονται επαναλήψεις",
    ],
    metaScopeHint:
      "Ελέγχει συναλλαγές, κατάσταση, ανάγνωση vs εγγραφή και τον κύκλο ζωής pending από το LM05.",
    metaSummaryLabel: "Σύνοψη αξιολόγησης",
    multiSelectHint: "Επίλεξε όσα ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία απαντήσεις.",
    singleChoiceType: "Μία επιλογή",
    multiSelectType: "Επίλεξε όσα ισχύουν",
    criticalLabel: "Κρίσιμη",
    classificationNote: "",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να δώσεις την αξιολόγηση LM05.",
    questionsTitle: "Ερωτήσεις αξιολόγησης",
    submitAnswers: "Υποβολή αξιολόγησης",
    submitting: "Υποβολή…",
    retry: "Δοκίμασε ξανά",
    failedTitle: "Η αξιολόγηση δεν ολοκληρώθηκε ακόμη",
    failedLead: "Διάβασε το feedback παρακάτω και δοκίμασε ξανά.",
    failedCriticalLead:
      "Το σκορ φτάνει το αριθμητικό όριο, αλλά μια Κρίσιμη ερώτηση χρειάζεται άλλη ματιά.",
    failedScore: (score, total) => `${score}/${total}`,
    feedbackTitle: "Ξαναδές αυτές τις ερωτήσεις",
    passedTitle: "Η Αξιολόγηση LM05 ολοκληρώθηκε",
    alreadyPassedTitle: "Η Αξιολόγηση LM05 έχει ήδη καταγραφεί",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Τα XP έχουν ήδη απονεμηθεί",
    youCanNow: "Μπορείς πλέον:",
    passCapabilities: [
      "Να εξηγείς τη συναλλαγή ως αίτημα αλλαγής κατάστασης blockchain.",
      "Να διακρίνεις read-only αλληλεπίδραση από συναλλαγές που αλλάζουν κατάσταση.",
      "Να διαχωρίζεις την αποδοχή ως pending από συμπερίληψη, εκτέλεση και αλλαγή κατάστασης.",
    ],
    keyPrinciple:
      "Η δημιουργία ή υποβολή μιας συναλλαγής δεν είναι το ίδιο με συμπερίληψη, επιτυχή εκτέλεση ή αλλαγή της κοινής κατάστασης.",
    revisitOne: "Ένα σημείο για επανάληψη",
    revisitMany: "Σημεία για επανάληψη",
    reviewTakeaways: "Δες τα βασικά συμπεράσματα",
    postPassTitle: "Βασικά συμπεράσματα",
    backToDashboard: "Επιστροφή στο Dashboard",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η μαθησιακή διαδρομή ενημερώνεται από τον διακομιστή. Χρησιμοποίησε το Continue Learning στο Dashboard για το επόμενο βήμα. Το LM05 ολοκληρώνεται μόνο όταν ικανοποιηθούν τα Labs 04–05, η συνεισφορά στο Εκπαιδευτικό Ledger και αυτή η αξιολόγηση.",
    questions: {
      lm05_q1_transaction_intent: {
        heading: "Πρόθεση συναλλαγής",
        prompt:
          "Η Alice θέλει να μεταφέρει 2 EDU tokens στον Bob. Τι αντιπροσωπεύει πρωτίστως η συναλλαγή;",
        options: {
          A: "Ένα αίτημα για αλλαγή της κατάστασης του blockchain",
          B: "Ένα αντίγραφο της τρέχουσας κατάστασης του blockchain",
          C: "Απόδειξη ότι η μεταφορά έχει ήδη ολοκληρωθεί επιτυχώς",
          D: "Ένα νέο block",
        },
      },
      lm05_q2_nonce: {
        heading: "Nonce",
        prompt:
          "Η Alice στέλνει μια συναλλαγή στον Bob. Μετά την επιτυχή εκτέλεσή της, ποια πρόταση για το nonce είναι σωστή;",
        options: {
          A: "Αυξάνονται τα nonce τόσο της Alice όσο και του Bob",
          B: "Αυξάνεται το nonce του Bob επειδή έλαβε κεφάλαια",
          C: "Αυξάνεται το nonce της Alice· του Bob δεν αυξάνεται απλώς επειδή έλαβε κεφάλαια",
          D: "Κανένα nonce δεν αλλάζει",
        },
      },
      lm05_q3_gas: {
        heading: "Gas / τέλη",
        prompt:
          "Η Alice στέλνει μια συναλλαγή που απαιτεί gas. Ποιος πληρώνει κανονικά το transaction fee;",
        options: {
          A: "Ο παραλήπτης",
          B: "Ο αποστολέας που εξουσιοδοτεί τη συναλλαγή",
          C: "Όλοι οι συμμετέχοντες στο δίκτυο εξίσου",
          D: "Κανείς, εφόσον η συναλλαγή αλλάζει την κατάσταση",
        },
      },
      lm05_q4_read_vs_state_change: {
        heading: "Ανάγνωση vs αλλαγή κατάστασης",
        prompt:
          "Ένας εκπαιδευόμενος διαβάζει την τρέχουσα τιμή που είναι αποθηκευμένη σε ένα smart contract χωρίς να ζητά καμία τροποποίηση. Στη συνέχεια υποβάλλει μια αλληλεπίδραση που αλλάζει αυτή την τιμή. Ποια είναι η βασική διαφορά;",
        options: {
          A: "Και οι δύο αλληλεπιδράσεις δημιουργούν υποχρεωτικά συναλλαγές που αλλάζουν την κατάσταση",
          B: "Η ανάγνωση μπορεί να γίνει χωρίς αλλαγή της κατάστασης του blockchain, ενώ η τροποποίηση της αποθηκευμένης τιμής απαιτεί συναλλαγή που αλλάζει την κατάσταση",
          C: "Η ανάγνωση αλλάζει την κατάσταση, ενώ η εγγραφή όχι",
          D: "Καμία από τις δύο αλληλεπιδράσεις δεν αφορά την κατάσταση του smart contract",
        },
      },
      lm05_q5_failed_execution: {
        heading: "Αποτυχημένη εκτέλεση",
        prompt:
          "Ένας εκπαιδευόμενος υποβάλλει μια συναλλαγή που προορίζεται να αυξήσει μια τιμή αποθηκευμένη σε smart contract, αλλά η συναλλαγή αποτυγχάνει κατά την εκτέλεση. Τι πρέπει να περιμένουμε;",
        options: {
          A: "Η κατάσταση του contract αλλάζει ούτως ή άλλως επειδή η συναλλαγή υποβλήθηκε",
          B: "Η επιδιωκόμενη αλλαγή της κατάστασης του contract δεν πραγματοποιείται",
          C: "Η αλληλεπίδραση μετατρέπεται σε read-only κλήση",
          D: "Πρέπει να δημιουργηθεί νέο wallet",
        },
      },
      lm05_q6_trustchain_state_transition: {
        heading: "Μετάβαση κατάστασης TrustChain",
        prompt:
          "Στο TrustChain, μια εγγραφή προϊόντος εμφανίζει αρχικά Owner: Producer. Μια έγκυρη συναλλαγή μεταβίβασης ιδιοκτησίας εκτελείται επιτυχώς και η εγγραφή αλλάζει σε Owner: Distributor. Τι έχει καταγράψει το blockchain;",
        options: {
          A: "Ένα νέο wallet για τον distributor",
          B: "Μια μετάβαση από την προηγούμενη κατάσταση του προϊόντος σε μια νέα κατάσταση",
          C: "Απόδειξη ότι κάθε πληροφορία για το φυσικό προϊόν είναι αντικειμενικά αληθής",
          D: "Μόνο ένα read-only query της εγγραφής προϊόντος",
        },
      },
      lm05_q7_pending_transaction: {
        heading: "Pending συναλλαγή",
        prompt:
          "Ένας εκπαιδευόμενος δημιουργεί μια έγκυρη εκπαιδευτική συναλλαγή και αυτή εμφανίζεται ως PENDING στο κοινό transaction pool. Τι μπορούμε να συμπεράνουμε;",
        options: {
          A: "Έχει ήδη συμπεριληφθεί σε block",
          B: "Έχει ήδη αλλάξει την κοινή κατάσταση του blockchain",
          C: "Έχει γίνει αποδεκτή στο pool ως pending, αλλά δεν έχει ακόμη συμπεριληφθεί σε block ούτε έχει αλλάξει την κατάσταση",
          D: "Έχει αποτύχει",
        },
      },
    },
  },
};

/** Fallback post-pass rationales when GET/POST omit them (presentation only). */
export const LM05_POST_PASS_RATIONALES = {
  en: {
    lm05_q1_transaction_intent:
      "A transaction primarily represents a request to change blockchain state — for example transferring tokens from Alice to Bob.",
    lm05_q2_nonce:
      "After successful execution, Alice's nonce increases. Bob's nonce does not increase merely because he received funds.",
    lm05_q3_gas:
      "Gas fees are normally paid by the sender who authorizes the transaction.",
    lm05_q4_read_vs_state_change:
      "Reading can leave blockchain state unchanged. Changing a stored value requires a state-changing transaction.",
    lm05_q5_failed_execution:
      "Failed execution means the intended contract state change does not take effect.",
    lm05_q6_trustchain_state_transition:
      "In TrustChain, a valid ownership transfer records a state transition from the previous product state to a new product state.",
    lm05_q7_pending_transaction:
      "PENDING means accepted into the pool — not yet included in a block, not yet executed successfully, and not yet a shared state change.",
  },
  gr: {
    lm05_q1_transaction_intent:
      "Μια συναλλαγή αντιπροσωπεύει πρωτίστως ένα αίτημα για αλλαγή της κατάστασης του blockchain — για παράδειγμα μεταφορά tokens από την Alice στον Bob.",
    lm05_q2_nonce:
      "Μετά την επιτυχή εκτέλεση, αυξάνεται το nonce της Alice. Το nonce του Bob δεν αυξάνεται απλώς επειδή έλαβε κεφάλαια.",
    lm05_q3_gas:
      "Τα gas fees τα πληρώνει κανονικά ο αποστολέας που εξουσιοδοτεί τη συναλλαγή.",
    lm05_q4_read_vs_state_change:
      "Η ανάγνωση μπορεί να αφήσει την κατάσταση του blockchain αμετάβλητη. Η αλλαγή μιας αποθηκευμένης τιμής απαιτεί συναλλαγή που αλλάζει την κατάσταση.",
    lm05_q5_failed_execution:
      "Αποτυχημένη εκτέλεση σημαίνει ότι η επιδιωκόμενη αλλαγή κατάστασης του contract δεν πραγματοποιείται.",
    lm05_q6_trustchain_state_transition:
      "Στο TrustChain, μια έγκυρη μεταβίβαση ιδιοκτησίας καταγράφει μια μετάβαση από την προηγούμενη κατάσταση του προϊόντος σε μια νέα κατάσταση.",
    lm05_q7_pending_transaction:
      "PENDING σημαίνει αποδοχή στο pool — όχι ακόμη συμπερίληψη σε block, όχι ακόμη επιτυχής εκτέλεση, και όχι ακόμη αλλαγή της κοινής κατάστασης.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm05AssessmentCopy(lang = "en") {
  return LM05_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM05_ASSESSMENT_COPY.en;
}
