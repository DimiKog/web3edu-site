/**
 * LM08 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 *
 * Future LM08 chapter note: Q1 assesses the deployment lifecycle that the
 * chapter must teach explicitly (source → compile → bytecode → deploy tx →
 * contract address → read/transact). This locale does not deliver that chapter.
 */

export const LM08_ASSESSMENT_COPY = {
  en: {
    title: "LM08 Assessment — Deploying and Interacting with Smart Contracts",
    subtitle:
      "Check your understanding of the smart-contract deployment lifecycle, contract interaction, inspection, and source verification on Besu Edu-Net.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes seven questions about the concepts behind Coding Labs 01–02, contract inspection, and source verification. Most questions have one best answer; two ask you to select all answers that apply. If you do not pass on your first attempt, you can review the feedback and try again.",
    responseModeHint:
      "This assessment checks conceptual understanding of what you practiced — it does not replace the hands-on coding and verification activities.",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    classificationNote: "",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM08 assessment.",
    questionsTitle: "Assessment questions",
    submitAnswers: "Submit assessment",
    submitting: "Submitting…",
    retry: "Try again",
    failedTitle: "Assessment not passed yet",
    failedScore: (score, total) => `${score} / ${total}`,
    feedbackTitle: "Review these ideas",
    passedTitle: "LM08 Assessment Complete",
    alreadyPassedTitle: "LM08 Assessment already recorded",
    passedScore: (score, total) => `${score} / ${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP for this assessment was already awarded earlier.",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step.",
    questions: {
      lm08_q1_deployment_lifecycle: {
        prompt:
          "After writing a Solidity smart contract, which sequence best describes how it becomes a deployed contract that users can interact with on Besu Edu-Net?",
        options: {
          A: "Source code → Contract address → Compile → Deployment transaction",
          B: "Source code → Compile to deployable bytecode → Submit deployment transaction → Deployed contract at a contract address",
          C: "Source code → Wallet signature → Source verification → Contract address",
          D: "Source code → Block explorer → Compile → Contract address",
        },
      },
      lm08_q2_contract_instance: {
        prompt: "After deploying the same smart contract twice, what should you normally expect?",
        options: {
          A: "Both deployments must have the same contract address because the source code is identical.",
          B: "Each deployment creates a distinct contract instance with its own address.",
          C: "Only the source-verified deployment receives an address.",
          D: "The contract address identifies the Solidity source file rather than the deployed instance.",
        },
      },
      lm08_q3_reading_state: {
        prompt:
          "You want to read the current value stored by a contract without changing it. Which statement is correct?",
        options: {
          A: "A read-only call can retrieve the value without creating a state-changing transaction.",
          B: "Every interaction with a smart contract must create a blockchain transaction.",
          C: "Reading state requires redeploying the contract.",
          D: "The value can only be obtained after source verification.",
        },
      },
      lm08_q4_changing_state: {
        prompt:
          "A learner calls increment() on the Counter contract and expects its stored value to change. Why is this different from simply reading the current value?",
        options: {
          A: "increment() changes the Solidity source code stored on-chain.",
          B: "It changes blockchain state and therefore requires a transaction to be processed by the network.",
          C: "It changes only the learner's local browser state.",
          D: "It requires source verification before the network can execute it.",
        },
      },
      lm08_q5_contract_inspection: {
        prompt:
          "When inspecting a deployed contract using a blockchain explorer, which information can potentially be established from on-chain/explorer data?",
        options: {
          A: "The contract's deployed address.",
          B: "Transactions involving the contract.",
          C: "The block/transaction associated with its deployment, when exposed by the explorer.",
          D: "The real-world truth of every piece of information supplied to the contract.",
          E: "That the contract contains no security vulnerabilities.",
        },
      },
      lm08_q6_source_verification: {
        prompt: "What is the main value of source verification for a deployed smart contract?",
        options: {
          A: "It proves that the contract is secure.",
          B: "It allows the contract to modify blockchain history.",
          C: "It allows users to relate published human-readable source code and compilation information to the code deployed at the contract address.",
          D: "It is required before the contract can receive transactions.",
        },
      },
      lm08_q7_verification_limits: {
        prompt:
          "A contract is shown as source-verified in Blockscout. Which conclusions should you NOT make solely from that fact?",
        options: {
          A: "The contract is free from vulnerabilities.",
          B: "The contract's business logic is correct for its intended purpose.",
          C: "The people or organisation operating it are trustworthy.",
          D: "The published source can be related to the deployed contract code through the verification process.",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM08 — Ανάπτυξη και Αλληλεπίδραση με Έξυπνα Συμβόλαια",
    subtitle:
      "Έλεγξε την κατανόησή σου για τον κύκλο ζωής ανάπτυξης smart contracts, την αλληλεπίδραση, την επιθεώρηση και την επαλήθευση πηγαίου κώδικα στο Besu Edu-Net.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασέ το πρώτα",
    introBody:
      "Αυτή η αξιολόγηση περιλαμβάνει επτά ερωτήσεις για τις έννοιες πίσω από τα Coding Labs 01–02, την επιθεώρηση συμβολαίου και την επαλήθευση πηγαίου κώδικα. Οι περισσότερες έχουν μία καλύτερη απάντηση· δύο ζητούν να επιλέξεις όλες τις απαντήσεις που ισχύουν. Αν δεν περάσεις με την πρώτη προσπάθεια, μπορείς να δεις την ανατροφοδότηση και να δοκιμάσεις ξανά.",
    responseModeHint:
      "Η αξιολόγηση ελέγχει εννοιολογική κατανόηση αυτών που εξάσκησες — δεν αντικαθιστά τις πρακτικές δραστηριότητες κώδικα και επαλήθευσης.",
    multiSelectHint: "Επίλεξε όλες τις απαντήσεις που ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία.",
    classificationNote: "",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να δώσεις την αξιολόγηση LM08.",
    questionsTitle: "Ερωτήσεις αξιολόγησης",
    submitAnswers: "Υποβολή αξιολόγησης",
    submitting: "Υποβολή…",
    retry: "Δοκίμασε ξανά",
    failedTitle: "Η αξιολόγηση δεν έχει περάσει ακόμη",
    failedScore: (score, total) => `${score} / ${total}`,
    feedbackTitle: "Ξαναδές αυτές τις ιδέες",
    passedTitle: "Η Αξιολόγηση LM08 Ολοκληρώθηκε",
    alreadyPassedTitle: "Η Αξιολόγηση LM08 έχει ήδη καταγραφεί",
    passedScore: (score, total) => `${score} / ${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Το XP για αυτή την αξιολόγηση έχει ήδη απονεμηθεί νωρίτερα.",
    postPassTitle: "Βασικά Συμπεράσματα",
    backToDashboard: "Επιστροφή στο Dashboard",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η διαδρομή μάθησης ενημερώνεται από τον διακομιστή. Χρησιμοποίησε το Continue Learning στο Dashboard για το επόμενο βήμα.",
    questions: {
      lm08_q1_deployment_lifecycle: {
        prompt:
          "Αφού γράψεις ένα smart contract σε Solidity, ποια ακολουθία περιγράφει καλύτερα πώς καταλήγει σε ένα ανεπτυγμένο συμβόλαιο με το οποίο μπορούν να αλληλεπιδράσουν χρήστες στο Besu Edu-Net;",
        options: {
          A: "Πηγαίος κώδικας → Διεύθυνση συμβολαίου → Μεταγλώττιση → Συναλλαγή ανάπτυξης",
          B: "Πηγαίος κώδικας → Μεταγλώττιση σε deployable bytecode → Υποβολή συναλλαγής ανάπτυξης → Ανεπτυγμένο συμβόλαιο σε διεύθυνση συμβολαίου",
          C: "Πηγαίος κώδικας → Υπογραφή πορτοφολιού → Επαλήθευση πηγαίου κώδικα → Διεύθυνση συμβολαίου",
          D: "Πηγαίος κώδικας → Block explorer → Μεταγλώττιση → Διεύθυνση συμβολαίου",
        },
      },
      lm08_q2_contract_instance: {
        prompt:
          "Αφού αναπτύξεις το ίδιο smart contract δύο φορές, τι πρέπει κανονικά να περιμένεις;",
        options: {
          A: "Και οι δύο αναπτύξεις πρέπει να έχουν την ίδια διεύθυνση συμβολαίου επειδή ο πηγαίος κώδικας είναι ίδιος.",
          B: "Κάθε ανάπτυξη δημιουργεί ξεχωριστό στιγμιότυπο συμβολαίου με τη δική του διεύθυνση.",
          C: "Μόνο η ανάπτυξη με επαληθευμένο πηγαίο κώδικα λαμβάνει διεύθυνση.",
          D: "Η διεύθυνση συμβολαίου προσδιορίζει το αρχείο πηγαίου κώδικα Solidity και όχι το ανεπτυγμένο στιγμιότυπο.",
        },
      },
      lm08_q3_reading_state: {
        prompt:
          "Θέλεις να διαβάσεις την τρέχουσα τιμή που αποθηκεύει ένα συμβόλαιο χωρίς να την αλλάξεις. Ποια δήλωση είναι σωστή;",
        options: {
          A: "Μια read-only κλήση μπορεί να ανακτήσει την τιμή χωρίς να δημιουργήσει συναλλαγή αλλαγής κατάστασης.",
          B: "Κάθε αλληλεπίδραση με smart contract πρέπει να δημιουργεί συναλλαγή στο blockchain.",
          C: "Η ανάγνωση κατάστασης απαιτεί εκ νέου ανάπτυξη του συμβολαίου.",
          D: "Η τιμή μπορεί να ληφθεί μόνο μετά από επαλήθευση πηγαίου κώδικα.",
        },
      },
      lm08_q4_changing_state: {
        prompt:
          "Ένας μαθητής καλεί increment() στο συμβόλαιο Counter και περιμένει να αλλάξει η αποθηκευμένη τιμή. Γιατί αυτό διαφέρει από την απλή ανάγνωση της τρέχουσας τιμής;",
        options: {
          A: "Το increment() αλλάζει τον πηγαίο κώδικα Solidity που είναι αποθηκευμένος on-chain.",
          B: "Αλλάζει την κατάσταση στο blockchain και γι' αυτό απαιτεί συναλλαγή που επεξεργάζεται το δίκτυο.",
          C: "Αλλάζει μόνο την τοπική κατάσταση στον browser του μαθητή.",
          D: "Απαιτεί επαλήθευση πηγαίου κώδικα πριν το δίκτυο μπορέσει να το εκτελέσει.",
        },
      },
      lm08_q5_contract_inspection: {
        prompt:
          "Όταν επιθεωρείς ένα ανεπτυγμένο συμβόλαιο με blockchain explorer, ποιες πληροφορίες μπορούν ενδεχομένως να τεκμηριωθούν από δεδομένα on-chain/explorer;",
        options: {
          A: "Η διεύθυνση του ανεπτυγμένου συμβολαίου.",
          B: "Συναλλαγές που αφορούν το συμβόλαιο.",
          C: "Το block και η συναλλαγή που σχετίζονται με την ανάπτυξή του, όταν αυτές οι πληροφορίες παρέχονται από τον explorer.",
          D: "Η πραγματική αλήθεια κάθε πληροφορίας που δόθηκε στο συμβόλαιο.",
          E: "Ότι το συμβόλαιο δεν περιέχει ευπάθειες ασφαλείας.",
        },
      },
      lm08_q6_source_verification: {
        prompt:
          "Ποια είναι η κύρια αξία της επαλήθευσης πηγαίου κώδικα για ένα ανεπτυγμένο smart contract;",
        options: {
          A: "Αποδεικνύει ότι το συμβόλαιο είναι ασφαλές.",
          B: "Επιτρέπει στο συμβόλαιο να τροποποιεί το ιστορικό του blockchain.",
          C: "Επιτρέπει στους χρήστες να συσχετίσουν δημοσιευμένο αναγνώσιμο πηγαίο κώδικα και πληροφορίες μεταγλώττισης με τον κώδικα που έχει αναπτυχθεί στη διεύθυνση του συμβολαίου.",
          D: "Απαιτείται πριν το συμβόλαιο μπορέσει να λάβει συναλλαγές.",
        },
      },
      lm08_q7_verification_limits: {
        prompt:
          "Ένα συμβόλαιο εμφανίζεται ως source-verified στο Blockscout. Ποια συμπεράσματα ΔΕΝ πρέπει να βγάλεις μόνο από αυτό το γεγονός;",
        options: {
          A: "Το συμβόλαιο είναι χωρίς ευπάθειες.",
          B: "Η επιχειρηματική λογική του συμβολαίου είναι ορθή για τον σκοπό του.",
          C: "Τα άτομα ή ο οργανισμός που το διαχειρίζονται είναι αξιόπιστοι.",
          D: "Ο δημοσιευμένος πηγαίος κώδικας μπορεί να συσχετιστεί με τον ανεπτυγμένο κώδικα μέσω της διαδικασίας επαλήθευσης.",
        },
      },
    },
  },
};

/** Post-pass rationales (EN/GR). Presentation only — backend may also return localized text. */
export const LM08_POST_PASS_RATIONALES = {
  en: {
    lm08_q1_deployment_lifecycle:
      "Solidity source is compiled into deployable EVM bytecode (among other artifacts). Deployment is submitted as a blockchain transaction. Successful deployment creates a contract instance at a contract address. The source file itself is not simply stored or deployed as-is.",
    lm08_q2_contract_instance:
      "A contract address identifies a deployed contract instance, not merely the source file. Separate deployments normally create distinct instances with their own addresses.",
    lm08_q3_reading_state:
      "A read-only call can inspect contract state without creating a state-changing blockchain transaction. Reading and writing are different operations.",
    lm08_q4_changing_state:
      "Reading contract state and changing contract state are different operations. A call such as increment() changes blockchain state and therefore requires a transaction to be processed by the network.",
    lm08_q5_contract_inspection:
      "Explorer and on-chain inspection can establish blockchain evidence such as contract addresses, related transactions, and deployment data when the explorer exposes them. They cannot by themselves prove off-chain truth or that the contract has no vulnerabilities.",
    lm08_q6_source_verification:
      "Source verification relates published human-readable source code and compilation information to the code deployed at the contract address. It is not required for the contract to execute transactions and is not a security certification.",
    lm08_q7_verification_limits:
      "Source verification improves the ability to inspect a contract by relating published source and compilation information to deployed code. Alone, it does not prove that the contract is free from vulnerabilities, that its business logic is correct, or that its operators are trustworthy.",
  },
  gr: {
    lm08_q1_deployment_lifecycle:
      "Ο πηγαίος κώδικας Solidity μεταγλωττίζεται σε deployable EVM bytecode (μαζί με άλλα artifacts). Η ανάπτυξη υποβάλλεται ως συναλλαγή στο blockchain. Η επιτυχής ανάπτυξη δημιουργεί στιγμιότυπο συμβολαίου σε μια διεύθυνση. Το αρχείο πηγαίου κώδικα δεν αποθηκεύεται/αναπτύσσεται απλώς ως έχει.",
    lm08_q2_contract_instance:
      "Μια διεύθυνση συμβολαίου προσδιορίζει ένα ανεπτυγμένο στιγμιότυπο, όχι απλώς το αρχείο πηγαίου κώδικα. Ξεχωριστές αναπτύξεις συνήθως δημιουργούν ξεχωριστά στιγμιότυπα με δικές τους διευθύνσεις.",
    lm08_q3_reading_state:
      "Μια read-only κλήση μπορεί να επιθεωρήσει την κατάσταση του συμβολαίου χωρίς να δημιουργήσει συναλλαγή αλλαγής κατάστασης στο blockchain. Η ανάγνωση και η εγγραφή είναι διαφορετικές λειτουργίες.",
    lm08_q4_changing_state:
      "Η ανάγνωση και η αλλαγή κατάστασης συμβολαίου είναι διαφορετικές λειτουργίες. Μια κλήση όπως increment() αλλάζει κατάσταση στο blockchain και γι' αυτό απαιτεί συναλλαγή που επεξεργάζεται το δίκτυο.",
    lm08_q5_contract_inspection:
      "Η επιθεώρηση μέσω explorer και on-chain δεδομένων μπορεί να τεκμηριώσει στοιχεία blockchain όπως διευθύνσεις συμβολαίων, σχετικές συναλλαγές και δεδομένα ανάπτυξης όταν τα παρέχει ο explorer. Από μόνη της δεν αποδεικνύει την αλήθεια εκτός αλυσίδας ούτε ότι το συμβόλαιο δεν έχει ευπάθειες.",
    lm08_q6_source_verification:
      "Η επαλήθευση πηγαίου κώδικα συσχετίζει δημοσιευμένο αναγνώσιμο πηγαίο κώδικα και πληροφορίες μεταγλώττισης με τον κώδικα που έχει αναπτυχθεί στη διεύθυνση του συμβολαίου. Δεν απαιτείται για την εκτέλεση συναλλαγών και δεν αποτελεί πιστοποίηση ασφάλειας.",
    lm08_q7_verification_limits:
      "Η επαλήθευση πηγαίου κώδικα βελτιώνει τη δυνατότητα επιθεώρησης συσχετίζοντας δημοσιευμένο κώδικα και πληροφορίες μεταγλώττισης με τον ανεπτυγμένο κώδικα. Από μόνη της δεν αποδεικνύει ότι το συμβόλαιο είναι χωρίς ευπάθειες, ότι η επιχειρηματική λογική είναι ορθή, ή ότι οι διαχειριστές του είναι αξιόπιστοι.",
  },
};

export function getLm08AssessmentCopy(lang = "en") {
  return LM08_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM08_ASSESSMENT_COPY.en;
}
