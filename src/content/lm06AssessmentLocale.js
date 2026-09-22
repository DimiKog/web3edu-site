/**
 * LM06 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 */

export const LM06_ASSESSMENT_COPY = {
  en: {
    title: "LM06 Assessment — Consensus & Block Inclusion",
    subtitle:
      "Check your understanding of consensus, Proof of Work, Proof of Stake, QBFT on Besu Edu-Net, local validation, and why proposal is not finality.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes nine single-choice questions from LM06. Pass with at least 7 correct answers and Critical Question 8. If you do not pass on your first attempt, review the feedback and try again. Completing LM06 also requires the Educational Ledger Consensus Activity.",
    responseModeHint:
      "This assessment verifies conceptual understanding. It does not replace the Educational Ledger Consensus Activity, which remains required evidence for LM06 completion.",
    metaItems: [
      "9 questions",
      "Single choice",
      "Pass: 7/9 correct + Critical Question 8",
      "Retries allowed",
    ],
    metaScopeHint:
      "Checks consensus, PoW/PoS/QBFT, local validation, and proposal vs finality from LM06.",
    metaSummaryLabel: "Assessment summary",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    singleChoiceType: "Single choice",
    multiSelectType: "Select all that apply",
    criticalLabel: "Critical",
    classificationNote: "",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM06 assessment.",
    questionsTitle: "Assessment questions",
    submitAnswers: "Submit assessment",
    submitting: "Submitting…",
    retry: "Try again",
    failedTitle: "Assessment not passed yet",
    failedLead: "Review the feedback below, then try again.",
    failedCriticalLead:
      "Your score meets the numeric threshold, but Critical Question 8 needs another look — proposal or candidate-block inclusion is not finality.",
    failedScore: (score, total) => `${score}/${total}`,
    feedbackTitle: "Review these questions",
    passedTitle: "LM06 Assessment Complete",
    alreadyPassedTitle: "LM06 Assessment already recorded",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP already awarded",
    youCanNow: "You can now:",
    passCapabilities: [
      "Explain why distributed networks need consensus to agree on ledger state.",
      "Compare Proof of Work, Proof of Stake, and QBFT at a conceptual level.",
      "Separate local VALID checks and proposal from network agreement and finality.",
    ],
    keyPrinciple:
      "PENDING → PROPOSED → AGREED → FINALIZED. Being selected by a proposer is not the same as becoming part of finalized shared state.",
    revisitOne: "One point to revisit",
    revisitMany: "Points to revisit",
    reviewTakeaways: "Review key takeaways",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step. LM06 is complete only when the Educational Ledger Consensus Activity and this assessment are both satisfied.",
    questions: {
      lm06_q1_why_consensus: {
        heading: "Why Consensus?",
        prompt:
          "Several blockchain nodes receive transactions independently. Why is a consensus mechanism necessary?",
        options: {
          A: "To encrypt every transaction before it enters the network.",
          B: "To allow distributed participants to establish an agreed ledger state.",
          C: "To ensure that every node creates its own version of the ledger.",
          D: "To replace digital signatures.",
        },
      },
      lm06_q2_proof_of_work: {
        heading: "Proof of Work",
        prompt:
          "In a Proof-of-Work blockchain, what is the key mechanism used in competition to propose the next block?",
        options: {
          A: "Owning the largest number of blockchain addresses.",
          B: "Performing computational work according to the protocol.",
          C: "Being manually selected by the other nodes.",
          D: "Having submitted the oldest transaction in the pool.",
        },
      },
      lm06_q3_proof_of_stake: {
        heading: "Proof of Stake",
        prompt:
          "What is the main conceptual change when moving from Proof of Work to Proof of Stake?",
        options: {
          A: "Validators no longer need to agree on blockchain state.",
          B: "Transactions no longer need validation.",
          C: "The protocol uses stake and its selection rules rather than computational work for participation in block production.",
          D: "Blocks are replaced by individual signed transactions.",
        },
      },
      lm06_q4_different_networks: {
        heading: "Different Networks, Different Consensus",
        prompt:
          "Two blockchain networks use different consensus mechanisms. Which explanation is the most appropriate?",
        options: {
          A: "Every blockchain must eventually migrate to the same consensus mechanism.",
          B: "Consensus mechanisms reflect different participation, trust and system requirements.",
          C: "Consensus is relevant only to public blockchains.",
          D: "The choice affects transaction fees but not how the network reaches agreement.",
        },
      },
      lm06_q5_known_validators: {
        heading: "Known Validators",
        prompt:
          "Web3Edu's Besu Edu-Net operates with a known validator set. What does this imply for consensus?",
        options: {
          A: "Consensus is unnecessary because the validators are known.",
          B: "Any Internet user can automatically become a validator by solving a PoW puzzle.",
          C: "Authorized validators participate in reaching agreement, but no single validator decides the ledger state alone.",
          D: "Every transaction becomes final as soon as one validator receives it.",
        },
      },
      lm06_q6_qbft_scenario: {
        heading: "Besu Edu-Net / QBFT Scenario",
        prompt:
          "A validator in the Besu Edu-Net is selected as proposer and creates a candidate block containing valid transactions. What best describes what happens next?",
        options: {
          A: "Because the proposer is an authorized validator, the block immediately becomes final.",
          B: "The proposer must solve a Proof-of-Work puzzle before the block can be accepted.",
          C: "The other validators participate in the QBFT agreement process; the proposer cannot finalize the block alone.",
          D: "The users who submitted the transactions decide whether the block is accepted.",
        },
      },
      lm06_q7_local_validation: {
        heading: "Educational Ledger: Local Validation",
        prompt:
          "In the Educational Ledger activity, you inspect the assigned transaction and mark it VALID. What have you established?",
        options: {
          A: "The transaction has passed your local validation checks.",
          B: "The transaction is now finalized.",
          C: "All validators have agreed with you.",
          D: "The ledger state has already changed.",
        },
      },
      lm06_q8_proposal_not_finality: {
        heading: "Proposal Is Not Finality",
        prompt:
          "A proposer selects a PENDING transaction and places it in a candidate block. Which statement is correct?",
        options: {
          A: "The transaction is now finalized because it appears in the candidate block.",
          B: "The transaction is finalized if the proposer also considers it valid.",
          C: "The transaction has been proposed for inclusion, but network agreement and finalization are still required.",
          D: "The shared ledger state must immediately be updated.",
        },
      },
      lm06_q9_foodchain_synthesis: {
        heading: "FoodChain Synthesis",
        prompt:
          "FoodChain contains a PENDING transaction transferring an olive-oil batch from Producer to Distributor. When can the Distributor become the recorded owner in the finalized shared ledger state?",
        options: {
          A: "As soon as the Producer submits the transaction.",
          B: "As soon as a proposer selects the transaction for a candidate block.",
          C: "As soon as one validator marks the transaction VALID.",
          D: "After the transaction is validated, sufficient network agreement is reached, the block is finalized, and execution successfully updates the state.",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM06 — Συναίνεση & Συμπερίληψη σε Block",
    subtitle:
      "Έλεγξε την κατανόησή σου για συναίνεση, Proof of Work, Proof of Stake, QBFT στο Besu Edu-Net, τοπική επικύρωση και γιατί η πρόταση δεν είναι οριστικότητα.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασε πρώτα αυτό",
    introBody:
      "Η αξιολόγηση περιλαμβάνει εννέα ερωτήσεις μίας επιλογής από το LM06. Περνάς με τουλάχιστον 7 σωστές απαντήσεις και την Κρίσιμη Ερώτηση 8. Αν δεν περάσεις με την πρώτη, διάβασε το feedback και δοκίμασε ξανά. Η ολοκλήρωση του LM06 απαιτεί επίσης τη δραστηριότητα Consensus στο Εκπαιδευτικό Ledger.",
    responseModeHint:
      "Η αξιολόγηση επαληθεύει εννοιολογική κατανόηση. Δεν αντικαθιστά τη δραστηριότητα Consensus στο Εκπαιδευτικό Ledger, που παραμένει απαιτούμενο αποδεικτικό για την ολοκλήρωση του LM06.",
    metaItems: [
      "9 ερωτήσεις",
      "Μία επιλογή",
      "Επιτυχία: 7/9 σωστές + Κρίσιμη Ερώτηση 8",
      "Επιτρέπονται επαναλήψεις",
    ],
    metaScopeHint:
      "Ελέγχει συναίνεση, PoW/PoS/QBFT, τοπική επικύρωση και πρόταση vs οριστικότητα από το LM06.",
    metaSummaryLabel: "Σύνοψη αξιολόγησης",
    multiSelectHint: "Επίλεξε όσα ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία απαντήσεις.",
    singleChoiceType: "Μία επιλογή",
    multiSelectType: "Επίλεξε όσα ισχύουν",
    criticalLabel: "Κρίσιμη",
    classificationNote: "",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να δώσεις την αξιολόγηση LM06.",
    questionsTitle: "Ερωτήσεις αξιολόγησης",
    submitAnswers: "Υποβολή αξιολόγησης",
    submitting: "Υποβολή…",
    retry: "Δοκίμασε ξανά",
    failedTitle: "Η αξιολόγηση δεν ολοκληρώθηκε ακόμη",
    failedLead: "Διάβασε το feedback παρακάτω και δοκίμασε ξανά.",
    failedCriticalLead:
      "Το σκορ φτάνει το αριθμητικό όριο, αλλά η Κρίσιμη Ερώτηση 8 χρειάζεται άλλη ματιά — η πρόταση ή η συμπερίληψη σε candidate block δεν είναι οριστικότητα.",
    failedScore: (score, total) => `${score}/${total}`,
    feedbackTitle: "Ξαναδές αυτές τις ερωτήσεις",
    passedTitle: "Η Αξιολόγηση LM06 ολοκληρώθηκε",
    alreadyPassedTitle: "Η Αξιολόγηση LM06 έχει ήδη καταγραφεί",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Τα XP έχουν ήδη απονεμηθεί",
    youCanNow: "Μπορείς πλέον:",
    passCapabilities: [
      "Να εξηγείς γιατί τα κατανεμημένα δίκτυα χρειάζονται συναίνεση για συμφωνημένη κατάσταση ledger.",
      "Να συγκρίνεις εννοιολογικά Proof of Work, Proof of Stake και QBFT.",
      "Να διαχωρίζεις τοπικούς ελέγχους VALID και πρόταση από συμφωνία δικτύου και οριστικότητα.",
    ],
    keyPrinciple:
      "PENDING → PROPOSED → AGREED → FINALIZED. Η επιλογή από έναν proposer δεν είναι το ίδιο με την ένταξη στην οριστικοποιημένη κοινή κατάσταση.",
    revisitOne: "Ένα σημείο για επανάληψη",
    revisitMany: "Σημεία για επανάληψη",
    reviewTakeaways: "Δες τα βασικά συμπεράσματα",
    postPassTitle: "Βασικά συμπεράσματα",
    backToDashboard: "Επιστροφή στο Dashboard",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η μαθησιακή διαδρομή ενημερώνεται από τον διακομιστή. Χρησιμοποίησε το Continue Learning στο Dashboard για το επόμενο βήμα. Το LM06 ολοκληρώνεται μόνο όταν ικανοποιηθούν η δραστηριότητα Consensus στο Εκπαιδευτικό Ledger και αυτή η αξιολόγηση.",
    questions: {
      lm06_q1_why_consensus: {
        heading: "Γιατί Συναίνεση;",
        prompt:
          "Αρκετοί κόμβοι blockchain λαμβάνουν συναλλαγές ανεξάρτητα. Γιατί είναι απαραίτητος ένας μηχανισμός συναίνεσης;",
        options: {
          A: "Για να κρυπτογραφείται κάθε συναλλαγή πριν εισέλθει στο δίκτυο.",
          B: "Για να επιτρέπεται σε κατανεμημένους συμμετέχοντες να καθιερώσουν συμφωνημένη κατάσταση ledger.",
          C: "Για να διασφαλίζεται ότι κάθε κόμβος δημιουργεί τη δική του έκδοση του ledger.",
          D: "Για να αντικατασταθούν οι ψηφιακές υπογραφές.",
        },
      },
      lm06_q2_proof_of_work: {
        heading: "Proof of Work",
        prompt:
          "Σε ένα blockchain Proof-of-Work, ποιος είναι ο βασικός μηχανισμός ανταγωνισμού για την πρόταση του επόμενου block;",
        options: {
          A: "Η κατοχή του μεγαλύτερου αριθμού διευθύνσεων blockchain.",
          B: "Η εκτέλεση υπολογιστικής εργασίας σύμφωνα με το πρωτόκολλο.",
          C: "Η χειροκίνητη επιλογή από τους άλλους κόμβους.",
          D: "Η υποβολή της παλαιότερης συναλλαγής στο pool.",
        },
      },
      lm06_q3_proof_of_stake: {
        heading: "Proof of Stake",
        prompt:
          "Ποια είναι η κύρια εννοιολογική αλλαγή όταν περνάμε από Proof of Work σε Proof of Stake;",
        options: {
          A: "Οι validators δεν χρειάζεται πλέον να συμφωνούν για την κατάσταση του blockchain.",
          B: "Οι συναλλαγές δεν χρειάζονται πλέον επικύρωση.",
          C: "Το πρωτόκολλο χρησιμοποιεί το stake και τους κανόνες επιλογής του αντί για υπολογιστική εργασία για συμμετοχή στην παραγωγή block.",
          D: "Τα blocks αντικαθίστανται από μεμονωμένες υπογεγραμμένες συναλλαγές.",
        },
      },
      lm06_q4_different_networks: {
        heading: "Διαφορετικά Δίκτυα, Διαφορετική Συναίνεση",
        prompt:
          "Δύο δίκτυα blockchain χρησιμοποιούν διαφορετικούς μηχανισμούς συναίνεσης. Ποια εξήγηση είναι η πιο κατάλληλη;",
        options: {
          A: "Κάθε blockchain πρέπει τελικά να μεταβεί στον ίδιο μηχανισμό συναίνεσης.",
          B: "Οι μηχανισμοί συναίνεσης αντανακλούν διαφορετικές απαιτήσεις συμμετοχής, εμπιστοσύνης και συστήματος.",
          C: "Η συναίνεση αφορά μόνο δημόσια blockchains.",
          D: "Η επιλογή επηρεάζει τα τέλη συναλλαγών αλλά όχι τον τρόπο που το δίκτυο φτάνει σε συμφωνία.",
        },
      },
      lm06_q5_known_validators: {
        heading: "Γνωστοί Validators",
        prompt:
          "Το Besu Edu-Net του Web3Edu λειτουργεί με γνωστό σύνολο validators. Τι συνεπάγεται αυτό για τη συναίνεση;",
        options: {
          A: "Η συναίνεση είναι περιττή επειδή οι validators είναι γνωστοί.",
          B: "Οποιοσδήποτε χρήστης του Internet μπορεί αυτόματα να γίνει validator λύνοντας ένα PoW puzzle.",
          C: "Εξουσιοδοτημένοι validators συμμετέχουν στη συμφωνία, αλλά κανένας μεμονωμένος validator δεν αποφασίζει μόνος του την κατάσταση του ledger.",
          D: "Κάθε συναλλαγή γίνεται οριστική μόλις την λάβει ένας validator.",
        },
      },
      lm06_q6_qbft_scenario: {
        heading: "Besu Edu-Net / Σενάριο QBFT",
        prompt:
          "Ένας validator στο Besu Edu-Net επιλέγεται ως proposer και δημιουργεί ένα candidate block με έγκυρες συναλλαγές. Τι περιγράφει καλύτερα τι συμβαίνει στη συνέχεια;",
        options: {
          A: "Επειδή ο proposer είναι εξουσιοδοτημένος validator, το block γίνεται αμέσως οριστικό.",
          B: "Ο proposer πρέπει να λύσει ένα Proof-of-Work puzzle πριν γίνει αποδεκτό το block.",
          C: "Οι άλλοι validators συμμετέχουν στη διαδικασία συμφωνίας QBFT· ο proposer δεν μπορεί να οριστικοποιήσει το block μόνος του.",
          D: "Οι χρήστες που υπέβαλαν τις συναλλαγές αποφασίζουν αν το block γίνεται αποδεκτό.",
        },
      },
      lm06_q7_local_validation: {
        heading: "Educational Ledger: Τοπική Επικύρωση",
        prompt:
          "Στη δραστηριότητα Educational Ledger, επιθεωρείς την ανατεθειμένη συναλλαγή και τη σημειώνεις VALID. Τι έχεις αποδείξει;",
        options: {
          A: "Η συναλλαγή πέρασε τους τοπικούς σου ελέγχους επικύρωσης.",
          B: "Η συναλλαγή έχει πλέον οριστικοποιηθεί.",
          C: "Όλοι οι validators έχουν συμφωνήσει μαζί σου.",
          D: "Η κατάσταση του ledger έχει ήδη αλλάξει.",
        },
      },
      lm06_q8_proposal_not_finality: {
        heading: "Η Πρόταση Δεν Είναι Οριστικότητα",
        prompt:
          "Ένας proposer επιλέγει μια PENDING συναλλαγή και την τοποθετεί σε ένα candidate block. Ποια πρόταση είναι σωστή;",
        options: {
          A: "Η συναλλαγή έχει πλέον οριστικοποιηθεί επειδή εμφανίζεται στο candidate block.",
          B: "Η συναλλαγή οριστικοποιείται αν ο proposer τη θεωρεί επίσης έγκυρη.",
          C: "Η συναλλαγή έχει προταθεί για συμπερίληψη, αλλά απαιτούνται ακόμη συμφωνία δικτύου και οριστικοποίηση.",
          D: "Η κοινή κατάσταση του ledger πρέπει να ενημερωθεί αμέσως.",
        },
      },
      lm06_q9_foodchain_synthesis: {
        heading: "Σύνθεση FoodChain",
        prompt:
          "Το FoodChain περιέχει μια PENDING συναλλαγή που μεταφέρει μια παρτίδα ελαιολάδου από Producer σε Distributor. Πότε μπορεί ο Distributor να γίνει ο καταγεγραμμένος ιδιοκτήτης στην οριστικοποιημένη κοινή κατάσταση ledger;",
        options: {
          A: "Μόλις ο Producer υποβάλει τη συναλλαγή.",
          B: "Μόλις ένας proposer επιλέξει τη συναλλαγή για ένα candidate block.",
          C: "Μόλις ένας validator σημειώσει τη συναλλαγή VALID.",
          D: "Αφού η συναλλαγή επικυρωθεί, επιτευχθεί επαρκής συμφωνία δικτύου, οριστικοποιηθεί το block και η εκτέλεση ενημερώσει επιτυχώς την κατάσταση.",
        },
      },
    },
  },
};

/** Fallback post-pass rationales when GET/POST omit them (presentation only). */
export const LM06_POST_PASS_RATIONALES = {
  en: {
    lm06_q1_why_consensus:
      "A consensus mechanism lets distributed participants establish an agreed ledger state despite receiving transactions independently.",
    lm06_q2_proof_of_work:
      "In Proof of Work, competition to propose the next block is tied to performing computational work according to the protocol.",
    lm06_q3_proof_of_stake:
      "Moving to Proof of Stake means stake and selection rules, rather than computational work, govern participation in block production.",
    lm06_q4_different_networks:
      "Different consensus mechanisms reflect different participation, trust, and system requirements — there is no single universal choice.",
    lm06_q5_known_validators:
      "On Besu Edu-Net, authorized validators participate in reaching agreement, but no single validator decides the ledger state alone.",
    lm06_q6_qbft_scenario:
      "After a QBFT proposer creates a candidate block, the other validators participate in the agreement process; the proposer cannot finalize alone.",
    lm06_q7_local_validation:
      "Marking a transaction VALID in the Educational Ledger means it passed your local validation checks — not that it is finalized.",
    lm06_q8_proposal_not_finality:
      "Selecting a PENDING transaction into a candidate block proposes it for inclusion. Network agreement and finalization are still required before shared state updates.",
    lm06_q9_foodchain_synthesis:
      "In FoodChain, the Distributor becomes recorded owner only after validation, sufficient network agreement, block finalization, and successful execution update the shared state.",
  },
  gr: {
    lm06_q1_why_consensus:
      "Ένας μηχανισμός συναίνεσης επιτρέπει σε κατανεμημένους συμμετέχοντες να καθιερώσουν μια συμφωνημένη κατάσταση ledger, παρόλο που λαμβάνουν συναλλαγές ανεξάρτητα.",
    lm06_q2_proof_of_work:
      "Στο Proof of Work, ο ανταγωνισμός για την πρόταση του επόμενου block συνδέεται με υπολογιστική εργασία σύμφωνα με το πρωτόκολλο.",
    lm06_q3_proof_of_stake:
      "Η μετάβαση στο Proof of Stake σημαίνει ότι το stake και οι κανόνες επιλογής — όχι η υπολογιστική εργασία — ρυθμίζουν τη συμμετοχή στην παραγωγή block.",
    lm06_q4_different_networks:
      "Διαφορετικοί μηχανισμοί συναίνεσης αντανακλούν διαφορετικές απαιτήσεις συμμετοχής, εμπιστοσύνης και συστήματος — δεν υπάρχει μία καθολική επιλογή.",
    lm06_q5_known_validators:
      "Στο Besu Edu-Net, εξουσιοδοτημένοι validators συμμετέχουν στη συμφωνία, αλλά κανένας μεμονωμένος validator δεν αποφασίζει μόνος του την κατάσταση του ledger.",
    lm06_q6_qbft_scenario:
      "Αφού ένας QBFT proposer δημιουργήσει candidate block, οι άλλοι validators συμμετέχουν στη διαδικασία συμφωνίας· ο proposer δεν μπορεί να οριστικοποιήσει μόνος του.",
    lm06_q7_local_validation:
      "Η σήμανση μιας συναλλαγής ως VALID στο Educational Ledger σημαίνει ότι πέρασε τους τοπικούς σου ελέγχους επικύρωσης — όχι ότι έχει οριστικοποιηθεί.",
    lm06_q8_proposal_not_finality:
      "Η επιλογή μιας PENDING συναλλαγής σε candidate block την προτείνει για συμπερίληψη. Απαιτούνται ακόμη συμφωνία δικτύου και οριστικοποίηση πριν αλλάξει η κοινή κατάσταση.",
    lm06_q9_foodchain_synthesis:
      "Στο FoodChain, ο Distributor γίνεται καταγεγραμμένος ιδιοκτήτης μόνο αφού επικύρωση, επαρκής συμφωνία δικτύου, οριστικοποίηση block και επιτυχής εκτέλεση ενημερώσουν την κοινή κατάσταση.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm06AssessmentCopy(lang = "en") {
  return LM06_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM06_ASSESSMENT_COPY.en;
}
