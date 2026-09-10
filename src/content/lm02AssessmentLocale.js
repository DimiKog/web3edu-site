/**
 * LM02 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 * Exact Blueprint wording (FINAL / LOCKED / D70). Do not paraphrase.
 */

export const LM02_ASSESSMENT_COPY = {
  en: {
    title: "LM02 Assessment — Why Blockchain?",
    subtitle:
      "Check your understanding of when blockchain is justified, trusted vs shared control, record integrity vs real-world truth, and apply the reasoning to FoodTrace.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes seven questions about the architectural reasoning from LM02. Most questions have one best answer; two ask you to select all answers that apply. Part B applies the same reasoning to FoodTrace. If you do not pass on your first attempt, you can review the feedback and try again.",
    responseModeHint:
      "This assessment checks whether you can decide when blockchain is justified — it does not replace the chapter reasoning journey or recommended reading.",
    /** Compact meta-strip chips (presentation chrome — not grading authority). */
    metaItems: [
      "7 questions",
      "Single + multiple select",
      "Pass: 5/7 + all Critical questions",
      "Retries allowed",
    ],
    metaScopeHint:
      "Checks when blockchain is justified — including FoodTrace trust and coordination reasoning.",
    metaSummaryLabel: "Assessment summary",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    singleChoiceType: "Single choice",
    multiSelectType: "Select all that apply",
    criticalLabel: "Critical",
    classificationNote: "",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM02 assessment.",
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
    passedTitle: "LM02 Assessment Complete",
    alreadyPassedTitle: "LM02 Assessment already recorded",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP already awarded",
    youCanNow: "You can now:",
    passCapabilities: [
      "Judge when blockchain is worth considering.",
      "Separate record integrity from real-world truth.",
      "Apply trust and coordination reasoning to FoodTrace.",
    ],
    keyPrinciple:
      "Multiple parties alone do not justify blockchain — trust and coordination requirements do.",
    revisitOne: "One point to revisit",
    revisitMany: "Points to revisit",
    reviewTakeaways: "Review key takeaways",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step.",
    partBTitle: "Part B — FoodTrace",
    scenarioP1:
      "FoodTrace is a proposed digital traceability system for a food supply chain.",
    scenarioP2:
      "A Producer, Transporter, Warehouse, and Retailer contribute records as a product moves through the supply chain. They need a shared history containing product origin, transfers of custody, transport conditions, and delivery information.",
    scenarioP3:
      "The organizations are independent and have different operational responsibilities. They want the history to be trustworthy and verifiable, but introducing new shared infrastructure also creates technical and operational cost.",
    questions: {
      lm02_q1_when_consider_blockchain: {
        heading: "When should blockchain be considered?",
        prompt:
          "Which conditions can strengthen the case for considering a blockchain-based solution?",
        options: {
          A: "Multiple independent parties need to maintain or verify shared records.",
          B: "No single party is naturally accepted as the sole trusted controller of the shared record.",
          C: "Participants benefit from independently verifying a common history.",
          D: "The application requires records to be stored reliably over time.",
          E: "The application is expected to serve many users.",
        },
      },
      lm02_q2_trusted_authority: {
        heading: "Trusted authority",
        prompt:
          "Several organizations need to share information. They all trust and accept one organization to operate the authoritative database, and there is no requirement for independent control or verification. What is the best architectural conclusion?",
        options: {
          A: "A blockchain architecture should still be preferred because distributing the record removes a potential single point of failure.",
          B: "A centralized architecture may be sufficient and should be considered before introducing blockchain.",
          C: "A blockchain architecture should be preferred because data shared between multiple organizations benefits from decentralization.",
          D: "The information provided is insufficient because an architecture decision cannot be made until the expected transaction volume is known.",
        },
      },
      lm02_q3_no_trusted_authority: {
        heading: "No trusted authority",
        prompt:
          "Several independent organizations need to maintain a shared record, but no single organization is accepted as the sole trusted controller. What can we conclude?",
        options: {
          A: "A blockchain architecture is justified because the absence of a trusted controller is sufficient by itself.",
          B: "The absence of a commonly trusted controller strengthens the case for considering a distributed approach, but other requirements and trade-offs must still be evaluated.",
          C: "The organizations should establish a new central authority because centralized architectures are generally simpler to operate.",
          D: "A permissionless blockchain should be preferred because independent organizations should not rely on controlled participation.",
        },
      },
      lm02_q4_integrity_vs_truth: {
        heading: "Record integrity ≠ real-world truth",
        prompt:
          "A temperature sensor reports that a food shipment remained at 4°C, and the reading is recorded on a blockchain. What does the blockchain allow us to conclude?",
        options: {
          A: "The temperature reading can be treated as true because all participants can verify the same blockchain record.",
          B: "The reading is reliable as long as it cannot be modified after being recorded.",
          C: "The blockchain can help preserve and verify the integrity of the recorded value, but it cannot by itself prove that the sensor accurately represented the physical world.",
          D: "Using several independent organizations to verify the blockchain also verifies the accuracy of the original sensor measurement.",
        },
      },
      lm02_q5_foodtrace_first_decision: {
        heading: "Make the first decision",
        prompt:
          "Based on the information currently available, what is the most defensible architecture decision for FoodTrace?",
        options: {
          A: "A centralized architecture is preferable because it introduces less operational complexity.",
          B: "A blockchain-based architecture is preferable because several independent organizations contribute to the shared history.",
          C: "There is not enough information yet to justify either architecture.",
        },
      },
      lm02_q6_foodtrace_what_to_know: {
        heading: "What do you need to know?",
        prompt:
          "Which additional information would most directly help determine whether blockchain addresses a trust or coordination need in FoodTrace?",
        options: {
          A: "Whether the organizations accept a single trusted operator to control the authoritative shared record.",
          B: "Whether participants require independent verification rather than relying exclusively on that operator.",
          C: "Whether shared control of the authoritative record is an important requirement.",
          D: "Whether the system must process a large number of records efficiently.",
          E: "Whether some supply-chain information must be accessible only to authorized participants.",
        },
      },
      lm02_q7_foodtrace_decide: {
        heading: "Decide with the new requirements",
        scenario:
          "FoodTrace now provides additional requirements:\n\nNo single participating organization is accepted as the sole controller of the authoritative record. The Producer, Transporter, Warehouse, and Retailer need to contribute to a shared history and independently verify it without relying exclusively on one participant to maintain the authoritative version. They also accept the additional operational complexity required by a distributed solution.",
        prompt:
          "Given this new information, what is the most defensible architecture direction?",
        options: {
          A: "A blockchain-based architecture is now justified for further design because the requirements include multiple independent parties, no accepted sole controller, a shared record, and independent verification.",
          B: "A centralized architecture remains preferable because operational simplicity should outweigh the trust and coordination requirements.",
          C: "A blockchain-based architecture is justified primarily because distributing the system should improve its performance and scalability.",
          D: "A blockchain-based architecture is justified only if FoodTrace can make all supply-chain records publicly accessible.",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM02 — Γιατί Blockchain;",
    subtitle:
      "Έλεγξε την κατανόησή σου για το πότε δικαιολογείται το blockchain, την έμπιστη έναντι κοινής διαχείρισης, την ακεραιότητα εγγραφής έναντι της αλήθειας του πραγματικού κόσμου, και εφάρμοσε τον συλλογισμό στο FoodTrace.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασέ το πρώτα",
    introBody:
      "Αυτή η αξιολόγηση περιλαμβάνει επτά ερωτήσεις για τον αρχιτεκτονικό συλλογισμό του LM02. Οι περισσότερες έχουν μία καλύτερη απάντηση· δύο ζητούν να επιλέξεις όλες τις απαντήσεις που ισχύουν. Το Μέρος Β εφαρμόζει τον ίδιο συλλογισμό στο FoodTrace. Αν δεν περάσεις με την πρώτη προσπάθεια, μπορείς να δεις την ανατροφοδότηση και να δοκιμάσεις ξανά.",
    responseModeHint:
      "Η αξιολόγηση ελέγχει αν μπορείς να κρίνεις πότε δικαιολογείται το blockchain — δεν αντικαθιστά τη διαδρομή συλλογισμού του κεφαλαίου ή την προτεινόμενη ανάγνωση.",
    metaItems: [
      "7 ερωτήσεις",
      "Μονή + πολλαπλή επιλογή",
      "Επιτυχία: 5/7 + όλες οι Κρίσιμες ερωτήσεις",
      "Επιτρέπονται επαναλήψεις",
    ],
    metaScopeHint:
      "Ελέγχει πότε δικαιολογείται το blockchain — συμπεριλαμβανομένου του συλλογισμού εμπιστοσύνης και συντονισμού στο FoodTrace.",
    metaSummaryLabel: "Σύνοψη αξιολόγησης",
    multiSelectHint: "Επίλεξε όλες τις απαντήσεις που ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία.",
    singleChoiceType: "Μία απάντηση",
    multiSelectType: "Επίλεξε όλες τις σωστές",
    criticalLabel: "Κρίσιμη",
    classificationNote: "",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να δώσεις την αξιολόγηση LM02.",
    questionsTitle: "Ερωτήσεις αξιολόγησης",
    submitAnswers: "Υποβολή αξιολόγησης",
    submitting: "Υποβολή…",
    retry: "Δοκίμασε ξανά",
    failedTitle: "Η αξιολόγηση δεν έχει περάσει ακόμη",
    failedLead: "Δες το feedback παρακάτω και δοκίμασε ξανά.",
    failedCriticalLead:
      "Το σκορ σου φτάνει το αριθμητικό όριο, αλλά μια Κρίσιμη ερώτηση χρειάζεται άλλη μια ματιά.",
    failedScore: (score, total) => `${score}/${total}`,
    feedbackTitle: "Ξαναδές αυτές τις ερωτήσεις",
    passedTitle: "Η Αξιολόγηση LM02 Ολοκληρώθηκε",
    alreadyPassedTitle: "Η Αξιολόγηση LM02 έχει ήδη καταγραφεί",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Τα XP έχουν ήδη απονεμηθεί",
    youCanNow: "Μπορείς πλέον να:",
    passCapabilities: [
      "Κρίνεις πότε αξίζει να εξεταστεί το blockchain.",
      "Διαχωρίζεις ακεραιότητα εγγραφής από την αλήθεια του πραγματικού κόσμου.",
      "Εφαρμόζεις συλλογισμό εμπιστοσύνης και συντονισμού στο FoodTrace.",
    ],
    keyPrinciple:
      "Πολλά μέρη από μόνα τους δεν δικαιολογούν blockchain — το κάνουν οι απαιτήσεις εμπιστοσύνης και συντονισμού.",
    revisitOne: "Ένα σημείο για επανάληψη",
    revisitMany: "Σημεία για επανάληψη",
    reviewTakeaways: "Δες τα βασικά συμπεράσματα",
    postPassTitle: "Βασικά Συμπεράσματα",
    backToDashboard: "Επιστροφή στο Dashboard",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η διαδρομή μάθησης ενημερώνεται από τον διακομιστή. Χρησιμοποίησε το Continue Learning στο Dashboard για το επόμενο βήμα.",
    partBTitle: "Μέρος B — FoodTrace",
    scenarioP1:
      "FoodTrace είναι ένα προτεινόμενο ψηφιακό σύστημα ιχνηλασιμότητας για μια εφοδιαστική αλυσίδα τροφίμων.",
    scenarioP2:
      "Ένας Παραγωγός, ένας Μεταφορέας, μια Αποθήκη και ένας Λιανοπωλητής συνεισφέρουν εγγραφές καθώς ένα προϊόν κινείται στην εφοδιαστική αλυσίδα. Χρειάζονται ένα κοινό ιστορικό που περιλαμβάνει την προέλευση του προϊόντος, τις μεταβιβάσεις κατοχής, τις συνθήκες μεταφοράς και πληροφορίες παράδοσης.",
    scenarioP3:
      "Οι οργανισμοί είναι ανεξάρτητοι και έχουν διαφορετικές λειτουργικές αρμοδιότητες. Θέλουν το ιστορικό να είναι αξιόπιστο και επαληθεύσιμο, αλλά η εισαγωγή μιας νέας κοινής υποδομής συνεπάγεται επίσης τεχνικό και λειτουργικό κόστος.",
    questions: {
      lm02_q1_when_consider_blockchain: {
        heading: "Πότε αξίζει να εξετάσουμε το blockchain;",
        prompt:
          "Ποιες από τις παρακάτω συνθήκες μπορούν να ενισχύσουν την επιλογή εξέτασης μιας λύσης βασισμένης σε blockchain;",
        options: {
          A: "Πολλά ανεξάρτητα μέρη χρειάζεται να διατηρούν ή να επαληθεύουν κοινές εγγραφές.",
          B: "Κανένα μεμονωμένο μέρος δεν είναι κοινά αποδεκτό ως ο μοναδικός έμπιστος διαχειριστής του κοινού αρχείου.",
          C: "Οι συμμετέχοντες ωφελούνται από τη δυνατότητα ανεξάρτητης επαλήθευσης ενός κοινού ιστορικού.",
          D: "Η εφαρμογή απαιτεί αξιόπιστη αποθήκευση εγγραφών σε βάθος χρόνου.",
          E: "Η εφαρμογή αναμένεται να εξυπηρετεί μεγάλο αριθμό χρηστών.",
        },
      },
      lm02_q2_trusted_authority: {
        heading: "Έμπιστη αρχή",
        prompt:
          "Αρκετοί οργανισμοί χρειάζεται να μοιράζονται πληροφορίες. Όλοι εμπιστεύονται και αποδέχονται έναν οργανισμό ως υπεύθυνο για τη λειτουργία της έγκυρης κεντρικής βάσης δεδομένων και δεν υπάρχει απαίτηση για ανεξάρτητο έλεγχο ή επαλήθευση. Ποιο είναι το καταλληλότερο αρχιτεκτονικό συμπέρασμα;",
        options: {
          A: "Θα πρέπει και πάλι να προτιμηθεί blockchain, επειδή η κατανομή των εγγραφών περιορίζει την εξάρτηση από ένα μοναδικό σημείο λειτουργίας.",
          B: "Μια κεντρικοποιημένη αρχιτεκτονική μπορεί να είναι επαρκής και θα πρέπει να εξεταστεί πριν εισαχθεί η πρόσθετη πολυπλοκότητα του blockchain.",
          C: "Θα πρέπει να προτιμηθεί blockchain, επειδή η ανταλλαγή δεδομένων μεταξύ πολλών οργανισμών ωφελείται από την αποκέντρωση.",
          D: "Οι πληροφορίες δεν επαρκούν, επειδή δεν μπορεί να ληφθεί αρχιτεκτονική απόφαση πριν γνωρίζουμε τον αναμενόμενο όγκο συναλλαγών.",
        },
      },
      lm02_q3_no_trusted_authority: {
        heading: "Απουσία κοινά αποδεκτής έμπιστης αρχής",
        prompt:
          "Αρκετοί ανεξάρτητοι οργανισμοί χρειάζεται να διατηρούν ένα κοινό αρχείο, αλλά κανένας οργανισμός δεν είναι κοινά αποδεκτός ως ο μοναδικός έμπιστος διαχειριστής του. Τι μπορούμε να συμπεράνουμε;",
        options: {
          A: "Μια αρχιτεκτονική blockchain δικαιολογείται αυτομάτως, επειδή η απουσία έμπιστου διαχειριστή αποτελεί από μόνη της επαρκή λόγο.",
          B: "Η απουσία ενός κοινά αποδεκτού έμπιστου διαχειριστή ενισχύει την περίπτωση εξέτασης μιας κατανεμημένης προσέγγισης, αλλά πρέπει να αξιολογηθούν και άλλες απαιτήσεις και συμβιβασμοί.",
          C: "Οι οργανισμοί θα πρέπει να δημιουργήσουν μια νέα κεντρική αρχή, επειδή οι κεντρικοποιημένες αρχιτεκτονικές είναι γενικά απλούστερες στη λειτουργία.",
          D: "Θα πρέπει να προτιμηθεί ένα permissionless blockchain, επειδή ανεξάρτητοι οργανισμοί δεν πρέπει να βασίζονται σε ελεγχόμενη συμμετοχή.",
        },
      },
      lm02_q4_integrity_vs_truth: {
        heading: "Ακεραιότητα εγγραφής ≠ αλήθεια του πραγματικού κόσμου",
        prompt:
          "Ένας αισθητήρας θερμοκρασίας αναφέρει ότι ένα φορτίο τροφίμων παρέμεινε στους 4°C και η μέτρηση καταγράφεται σε blockchain. Τι μας επιτρέπει να συμπεράνουμε το blockchain;",
        options: {
          A: "Η μέτρηση μπορεί να θεωρηθεί αληθής επειδή όλοι οι συμμετέχοντες μπορούν να επαληθεύσουν την ίδια εγγραφή στο blockchain.",
          B: "Η μέτρηση είναι αξιόπιστη εφόσον δεν μπορεί να τροποποιηθεί μετά την καταγραφή της.",
          C: "Το blockchain μπορεί να βοηθήσει στη διατήρηση και επαλήθευση της ακεραιότητας της καταγεγραμμένης τιμής, αλλά δεν μπορεί από μόνο του να αποδείξει ότι ο αισθητήρας αποτύπωσε με ακρίβεια τον πραγματικό κόσμο.",
          D: "Η επαλήθευση του blockchain από πολλούς ανεξάρτητους οργανισμούς επαληθεύει επίσης την ακρίβεια της αρχικής μέτρησης του αισθητήρα.",
        },
      },
      lm02_q5_foodtrace_first_decision: {
        heading: "Πρώτη αρχιτεκτονική απόφαση",
        prompt:
          "Με βάση τις πληροφορίες που είναι διαθέσιμες μέχρι τώρα, ποια είναι η πιο τεκμηριωμένη αρχιτεκτονική απόφαση για το FoodTrace;",
        options: {
          A: "Είναι προτιμότερη μια κεντρικοποιημένη αρχιτεκτονική επειδή έχει μικρότερη λειτουργική πολυπλοκότητα.",
          B: "Είναι προτιμότερη μια αρχιτεκτονική blockchain επειδή πολλοί ανεξάρτητοι οργανισμοί συνεισφέρουν στο κοινό ιστορικό.",
          C: "Δεν υπάρχουν ακόμη αρκετές πληροφορίες ώστε να δικαιολογηθεί κάποια από τις δύο αρχιτεκτονικές.",
        },
      },
      lm02_q6_foodtrace_what_to_know: {
        heading: "Τι πρέπει ακόμη να γνωρίζουμε;",
        prompt:
          "Ποιες πρόσθετες πληροφορίες θα βοηθούσαν πιο άμεσα να προσδιοριστεί εάν το blockchain αντιμετωπίζει μια πραγματική ανάγκη εμπιστοσύνης ή συντονισμού στο FoodTrace;",
        options: {
          A: "Αν οι οργανισμοί αποδέχονται έναν κοινό έμπιστο φορέα που θα ελέγχει το έγκυρο κοινό αρχείο.",
          B: "Αν οι συμμετέχοντες χρειάζονται ανεξάρτητη επαλήθευση αντί να βασίζονται αποκλειστικά σε αυτόν τον φορέα.",
          C: "Αν ο κοινός έλεγχος του έγκυρου αρχείου αποτελεί σημαντική απαίτηση.",
          D: "Αν το σύστημα πρέπει να επεξεργάζεται αποτελεσματικά πολύ μεγάλο αριθμό εγγραφών.",
          E: "Αν ορισμένες πληροφορίες της εφοδιαστικής αλυσίδας πρέπει να είναι προσβάσιμες μόνο από εξουσιοδοτημένους συμμετέχοντες.",
        },
      },
      lm02_q7_foodtrace_decide: {
        heading: "Απόφαση με τις νέες απαιτήσεις",
        scenario:
          "Το FoodTrace παρέχει τώρα πρόσθετες απαιτήσεις:\n\nΚανένας συμμετέχων οργανισμός δεν είναι αποδεκτός ως ο μοναδικός διαχειριστής του έγκυρου κοινού αρχείου. Ο Παραγωγός, ο Μεταφορέας, η Αποθήκη και ο Λιανοπωλητής πρέπει να συνεισφέρουν σε ένα κοινό ιστορικό και να μπορούν να το επαληθεύουν ανεξάρτητα, χωρίς να βασίζονται αποκλειστικά σε έναν συμμετέχοντα για τη διατήρηση της έγκυρης εκδοχής του. Αποδέχονται επίσης την πρόσθετη λειτουργική πολυπλοκότητα που απαιτεί μια κατανεμημένη λύση.",
        prompt:
          "Με βάση αυτές τις νέες πληροφορίες, ποια είναι η πιο τεκμηριωμένη αρχιτεκτονική κατεύθυνση;",
        options: {
          A: "Μια αρχιτεκτονική blockchain δικαιολογείται πλέον για περαιτέρω σχεδιασμό, επειδή οι απαιτήσεις περιλαμβάνουν πολλούς ανεξάρτητους συμμετέχοντες, απουσία ενός κοινά αποδεκτού μοναδικού διαχειριστή, κοινό αρχείο και ανεξάρτητη επαλήθευση.",
          B: "Μια κεντρικοποιημένη αρχιτεκτονική παραμένει προτιμότερη, επειδή η λειτουργική απλότητα πρέπει να υπερισχύει των απαιτήσεων εμπιστοσύνης και συντονισμού.",
          C: "Μια αρχιτεκτονική blockchain δικαιολογείται κυρίως επειδή η κατανομή του συστήματος αναμένεται να βελτιώσει την απόδοση και την κλιμάκωσή του.",
          D: "Μια αρχιτεκτονική blockchain δικαιολογείται μόνο εφόσον το FoodTrace μπορεί να καταστήσει όλες τις εγγραφές της εφοδιαστικής αλυσίδας δημόσια προσβάσιμες.",
        },
      },
    },
  },
};

/** Post-pass rationales (EN/GR). Presentation only — backend may also return localized text. */
export const LM02_POST_PASS_RATIONALES = {
  en: {
    lm02_q1_when_consider_blockchain:
      "Conditions that strengthen considering blockchain include multiple independent parties sharing records, no single accepted sole controller, and benefit from independently verifying a common history. Reliable storage or many users alone do not establish that need.",
    lm02_q2_trusted_authority:
      "When organizations already trust one operator for the authoritative database and do not require independent control or verification, a centralized architecture may be sufficient and should be considered before introducing blockchain.",
    lm02_q3_no_trusted_authority:
      "Absence of a commonly trusted sole controller strengthens considering a distributed approach, but is not by itself automatic justification for blockchain — other requirements and trade-offs still matter.",
    lm02_q4_integrity_vs_truth:
      "A blockchain can help preserve and verify integrity of a recorded value, but cannot by itself prove that a sensor accurately represented the physical world.",
    lm02_q5_foodtrace_first_decision:
      "FoodTrace's initial description alone does not yet justify preferring either a centralized or a blockchain architecture — more trust/coordination information is needed.",
    lm02_q6_foodtrace_what_to_know:
      "The most direct next questions are whether a single trusted operator is accepted, whether independent verification is required, and whether shared control of the authoritative record matters — not only throughput or access-control details.",
    lm02_q7_foodtrace_decide:
      "With no accepted sole controller, shared history, independent verification, and acceptance of distributed complexity, a blockchain-based architecture is justified for further FoodTrace design.",
  },
  gr: {
    lm02_q1_when_consider_blockchain:
      "Συνθήκες που ενισχύουν την εξέταση του blockchain περιλαμβάνουν πολλά ανεξάρτητα μέρη με κοινές εγγραφές, απουσία μοναδικού έμπιστου διαχειριστή και όφελος από ανεξάρτητη επαλήθευση κοινού ιστορικού. Η αξιόπιστη αποθήκευση ή οι πολλοί χρήστες από μόνα τους δεν αρκούν.",
    lm02_q2_trusted_authority:
      "Όταν οι οργανισμοί ήδη εμπιστεύονται έναν φορέα για την έγκυρη βάση δεδομένων και δεν απαιτούν ανεξάρτητο έλεγχο ή επαλήθευση, μια κεντρικοποιημένη αρχιτεκτονική μπορεί να είναι επαρκής και πρέπει να εξεταστεί πριν εισαχθεί το blockchain.",
    lm02_q3_no_trusted_authority:
      "Η απουσία κοινά αποδεκτού μοναδικού διαχειριστή ενισχύει την εξέταση κατανεμημένης προσέγγισης, αλλά δεν αποτελεί από μόνη της αυτόματη δικαιολόγηση blockchain — μετράνε και άλλες απαιτήσεις και συμβιβασμοί.",
    lm02_q4_integrity_vs_truth:
      "Το blockchain μπορεί να βοηθήσει στη διατήρηση και επαλήθευση ακεραιότητας μιας καταγεγραμμένης τιμής, αλλά δεν μπορεί από μόνο του να αποδείξει ότι ο αισθητήρας αποτύπωσε με ακρίβεια τον πραγματικό κόσμο.",
    lm02_q5_foodtrace_first_decision:
      "Η αρχική περιγραφή του FoodTrace από μόνη της δεν δικαιολογεί ακόμη προτίμηση κεντρικοποιημένης ή blockchain αρχιτεκτονικής — χρειάζονται περισσότερες πληροφορίες εμπιστοσύνης/συντονισμού.",
    lm02_q6_foodtrace_what_to_know:
      "Οι πιο άμεσες επόμενες ερωτήσεις είναι αν αποδέχονται έναν έμπιστο φορέα, αν χρειάζονται ανεξάρτητη επαλήθευση και αν μετράει ο κοινός έλεγχος του έγκυρου αρχείου — όχι μόνο ρυθμός επεξεργασίας ή έλεγχος πρόσβασης.",
    lm02_q7_foodtrace_decide:
      "Με απουσία κοινά αποδεκτού μοναδικού διαχειριστή, κοινό ιστορικό, ανεξάρτητη επαλήθευση και αποδοχή κατανεμημένης πολυπλοκότητας, μια αρχιτεκτονική blockchain δικαιολογείται για περαιτέρω σχεδιασμό του FoodTrace.",
  },
};

export function getLm02AssessmentCopy(lang = "en") {
  return LM02_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM02_ASSESSMENT_COPY.en;
}
