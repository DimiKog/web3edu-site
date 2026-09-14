/**
 * LM04 Assessment copy (EN + GR).
 * Presentation only — no correct answers or pass-rule authority.
 */

export const LM04_ASSESSMENT_COPY = {
  en: {
    title: "LM04 Assessment — Keys, Wallets and Blockchain Identity",
    subtitle:
      "Check your understanding of keys, wallets, addresses, encryption vs signing, proof of control, and careful identity interpretation.",
    introTitle: "Before you begin",
    readFirst: "Read this first",
    introBody:
      "This assessment includes seven single-choice questions from LM04. Pass with at least 5 correct answers and the Critical question. If you do not pass on your first attempt, review the feedback and try again. Completing LM04 also requires Labs 01–03.",
    responseModeHint:
      "This assessment verifies conceptual understanding. It does not replace Labs 01–03, which remain required evidence for LM04 completion.",
    metaItems: [
      "7 questions",
      "Single choice",
      "Pass: 5/7 + Critical question",
      "Retries allowed",
    ],
    metaScopeHint:
      "Checks keys, wallets, encryption vs signing, and identity interpretation from LM04.",
    metaSummaryLabel: "Assessment summary",
    multiSelectHint: "Select all that apply. More than one answer may be correct.",
    singleChoiceType: "Single choice",
    multiSelectType: "Select all that apply",
    criticalLabel: "Critical",
    classificationNote: "",
    loading: "Loading assessment…",
    signInRequired: "Sign in with your Web3Edu identity to take the LM04 assessment.",
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
    passedTitle: "LM04 Assessment Complete",
    alreadyPassedTitle: "LM04 Assessment already recorded",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "XP already awarded",
    youCanNow: "You can now:",
    passCapabilities: [
      "Separate private key, public key, and address roles.",
      "Distinguish wallets from addresses and identity claims.",
      "Choose encryption for confidentiality and signing for proof of control.",
    ],
    keyPrinciple:
      "Address control proves cryptographic control — not real-world identity by itself.",
    revisitOne: "One point to revisit",
    revisitMany: "Points to revisit",
    reviewTakeaways: "Review key takeaways",
    postPassTitle: "Key Takeaways",
    backToDashboard: "Back to Dashboard",
    dashboardPath: "/dashboard",
    continueLearningHint:
      "Your learning path updates from the server. Use Continue Learning on the Dashboard for your next step. LM04 is complete only when Labs 01–03 and this assessment are all satisfied.",
    questions: {
      lm04_q1_key_roles: {
        heading: "Key roles",
        prompt:
          "Which statement best describes the roles of private key, public key, and address?",
        options: {
          A: "The address is the secret that must never be shared; the private key is the public handle others see.",
          B: "The private key stays secret and enables control; the public key can be shared for encryption or verification; the address is the usual public network handle derived from those keys.",
          C: "Private key, public key, and address are three names for the same secret value.",
          D: "Only the public key matters; private keys and addresses are optional labels created by wallets.",
        },
      },
      lm04_q2_wallet_vs_address: {
        heading: "Wallet vs address",
        prompt: "What does a wallet do, compared with what an address represents?",
        options: {
          A: "The wallet application is itself your Web3 identity; the address is only a decorative nickname.",
          B: "The address stores your private key on-chain so anyone can look it up.",
          C: "The wallet manages cryptographic keys and signing; the address is the public handle others see — the wallet is not itself the identity.",
          D: "Wallets and addresses are identical: installing a wallet automatically registers your legal identity on every network.",
        },
      },
      lm04_q3_confidentiality_encryption: {
        heading: "Confidentiality",
        prompt:
          "You need to send a note so that only your classmate can read it. Which capability should you use?",
        options: {
          A: "Encrypt the note with your classmate’s public key (confidentiality).",
          B: "Sign the note with your private key so anyone can read it and verify authorship.",
          C: "Publish the note in a transaction so the blockchain hides it from everyone except your classmate.",
          D: "Share your private key with your classmate so they can open any of your messages.",
        },
      },
      lm04_q4_authenticity_signing: {
        heading: "Authenticity / proof of control",
        prompt:
          "A teammate asks you to prove you control a specific address for a short statement — without sending funds. What should you do?",
        options: {
          A: "Encrypt the statement with the teammate’s public key.",
          B: "Sign the statement with the wallet that controls that address so they can verify the recovered address.",
          C: "Send them your private key so they can check it themselves.",
          D: "Ask them to trust the wallet app icon on your phone as sufficient proof.",
        },
      },
      lm04_q5_address_not_public_key: {
        heading: "Address ≠ public key",
        prompt:
          "Why can’t you simply paste an Ethereum-style address into an encryption field that expects a public key?",
        options: {
          A: "Addresses are always longer than public keys, so they cannot fit.",
          B: "Addresses already include the private key, so encryption would be unsafe.",
          C: "An address is a derived public handle, not the encryption public key; addresses do not expose that public key by default.",
          D: "Encryption only works on-chain, and addresses are off-chain labels.",
        },
      },
      lm04_q6_signature_interpretation: {
        heading: "FoodTrust scenario — What does a signature prove?",
        prompt:
          "In a FoodTrust-style supply-chain system, a producer signs a record stating that a product batch was harvested on a specific date. The signature is successfully verified against the producer’s blockchain address. What can you conclude?",
        options: {
          A: "The blockchain has independently verified that the stated harvest date is true.",
          B: "The signing key controlling that address authorized the record; the signature alone does not prove that the declared harvest date is factually true.",
          C: "The producer’s real-world legal identity has been proven solely by the signature.",
          D: "The signed record must have been stored on every blockchain network.",
        },
      },
      lm04_q7_proof_without_transaction: {
        heading: "Proof without a transaction",
        prompt:
          "Which statement about proving address control is correct?",
        options: {
          A: "You can prove control by signing a message and verifying recovery without revealing the private key and without needing a gas-paying on-chain transaction for that proof itself.",
          B: "You must always send a transaction with gas; otherwise ownership cannot be proven.",
          C: "You must email your private key to the verifier so they can reconstruct the address.",
          D: "Only minting an NFT can prove control of an address.",
        },
      },
    },
  },
  gr: {
    title: "Αξιολόγηση LM04 — Κλειδιά, Πορτοφόλια και Ταυτότητα Blockchain",
    subtitle:
      "Έλεγξε την κατανόησή σου για κλειδιά, πορτοφόλια, διευθύνσεις, κρυπτογράφηση vs υπογραφή, απόδειξη ελέγχου και προσεκτική ερμηνεία ταυτότητας.",
    introTitle: "Πριν ξεκινήσεις",
    readFirst: "Διάβασε πρώτα αυτό",
    introBody:
      "Η αξιολόγηση περιλαμβάνει επτά ερωτήσεις μίας επιλογής από το LM04. Περνάς με τουλάχιστον 5 σωστές απαντήσεις και τη Κρίσιμη ερώτηση. Αν δεν περάσεις με την πρώτη, διάβασε το feedback και δοκίμασε ξανά. Η ολοκλήρωση του LM04 απαιτεί επίσης τα Labs 01–03.",
    responseModeHint:
      "Η αξιολόγηση επαληθεύει εννοιολογική κατανόηση. Δεν αντικαθιστά τα Labs 01–03, που παραμένουν απαιτούμενα αποδεικτικά για την ολοκλήρωση του LM04.",
    metaItems: [
      "7 ερωτήσεις",
      "Μία επιλογή",
      "Επιτυχία: 5/7 + Κρίσιμη ερώτηση",
      "Επιτρέπονται επαναλήψεις",
    ],
    metaScopeHint:
      "Ελέγχει κλειδιά, πορτοφόλια, κρυπτογράφηση vs υπογραφή και ερμηνεία ταυτότητας από το LM04.",
    metaSummaryLabel: "Σύνοψη αξιολόγησης",
    multiSelectHint: "Επίλεξε όσα ισχύουν. Μπορεί να είναι σωστές περισσότερες από μία απαντήσεις.",
    singleChoiceType: "Μία επιλογή",
    multiSelectType: "Επίλεξε όσα ισχύουν",
    criticalLabel: "Κρίσιμη",
    classificationNote: "",
    loading: "Φόρτωση αξιολόγησης…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να δώσεις την αξιολόγηση LM04.",
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
    passedTitle: "Η Αξιολόγηση LM04 ολοκληρώθηκε",
    alreadyPassedTitle: "Η Αξιολόγηση LM04 έχει ήδη καταγραφεί",
    passedScore: (score, total) => `${score}/${total}`,
    xpAwarded: (xp) => `+${xp} XP`,
    xpAlready: "Τα XP έχουν ήδη απονεμηθεί",
    youCanNow: "Μπορείς πλέον:",
    passCapabilities: [
      "Να διακρίνεις ρόλους ιδιωτικού κλειδιού, δημόσιου κλειδιού και διεύθυνσης.",
      "Να διακρίνεις πορτοφόλια από διευθύνσεις και ισχυρισμούς ταυτότητας.",
      "Να επιλέγεις κρυπτογράφηση για εμπιστευτικότητα και υπογραφή για απόδειξη ελέγχου.",
    ],
    keyPrinciple:
      "Ο έλεγχος διεύθυνσης αποδεικνύει κρυπτογραφικό έλεγχο — όχι από μόνος του πραγματική ταυτότητα.",
    revisitOne: "Ένα σημείο για επανάληψη",
    revisitMany: "Σημεία για επανάληψη",
    reviewTakeaways: "Δες τα βασικά συμπεράσματα",
    postPassTitle: "Βασικά συμπεράσματα",
    backToDashboard: "Επιστροφή στο Dashboard",
    dashboardPath: "/dashboard-gr",
    continueLearningHint:
      "Η μαθησιακή διαδρομή ενημερώνεται από τον διακομιστή. Χρησιμοποίησε το Continue Learning στο Dashboard για το επόμενο βήμα. Το LM04 ολοκληρώνεται μόνο όταν ικανοποιηθούν τα Labs 01–03 και αυτή η αξιολόγηση.",
    questions: {
      lm04_q1_key_roles: {
        heading: "Ρόλοι κλειδιών",
        prompt:
          "Ποια δήλωση περιγράφει καλύτερα τους ρόλους ιδιωτικού κλειδιού, δημόσιου κλειδιού και διεύθυνσης;",
        options: {
          A: "Η διεύθυνση είναι το μυστικό που δεν πρέπει ποτέ να κοινοποιηθεί· το ιδιωτικό κλειδί είναι το δημόσιο αναγνωριστικό που βλέπουν οι άλλοι.",
          B: "Το ιδιωτικό κλειδί μένει μυστικό και επιτρέπει έλεγχο· το δημόσιο κλειδί μπορεί να κοινοποιηθεί για κρυπτογράφηση ή επαλήθευση· η διεύθυνση είναι το συνηθισμένο δημόσιο αναγνωριστικό που παράγεται από αυτά τα κλειδιά.",
          C: "Ιδιωτικό κλειδί, δημόσιο κλειδί και διεύθυνση είναι τρία ονόματα για την ίδια μυστική τιμή.",
          D: "Μόνο το δημόσιο κλειδί μετράει· ιδιωτικά κλειδιά και διευθύνσεις είναι προαιρετικές ετικέτες των πορτοφολιών.",
        },
      },
      lm04_q2_wallet_vs_address: {
        heading: "Πορτοφόλι vs διεύθυνση",
        prompt: "Τι κάνει ένα πορτοφόλι, σε σύγκριση με αυτό που αντιπροσωπεύει μια διεύθυνση;",
        options: {
          A: "Η εφαρμογή πορτοφολιού είναι από μόνη της η ταυτότητά σου στο Web3· η διεύθυνση είναι μόνο διακοσμητικό ψευδώνυμο.",
          B: "Η διεύθυνση αποθηκεύει το ιδιωτικό σου κλειδί on-chain ώστε να μπορεί να το βρει ο καθένας.",
          C: "Το πορτοφόλι διαχειρίζεται κρυπτογραφικά κλειδιά και υπογραφές· η διεύθυνση είναι το δημόσιο αναγνωριστικό που βλέπουν οι άλλοι — το πορτοφόλι δεν είναι από μόνο του η ταυτότητα.",
          D: "Πορτοφόλια και διευθύνσεις είναι ταυτόσημα: η εγκατάσταση πορτοφολιού εγγράφει αυτόματα τη νομική σου ταυτότητα σε κάθε δίκτυο.",
        },
      },
      lm04_q3_confidentiality_encryption: {
        heading: "Εμπιστευτικότητα",
        prompt:
          "Θέλεις να στείλεις μια σημείωση ώστε μόνο ο/η συμμαθητής/ριά σου να μπορεί να τη διαβάσει. Ποια δυνατότητα πρέπει να χρησιμοποιήσεις;",
        options: {
          A: "Κρυπτογράφηση της σημείωσης με το δημόσιο κλειδί του/της συμμαθητή/ριας (εμπιστευτικότητα).",
          B: "Υπογραφή της σημείωσης με το ιδιωτικό σου κλειδί ώστε ο καθένας να τη διαβάσει και να επαληθεύσει την πατρότητα.",
          C: "Δημοσίευση της σημείωσης σε συναλλαγή ώστε το blockchain να την κρύψει από όλους εκτός από τον/την συμμαθητή/ρια.",
          D: "Κοινοποίηση του ιδιωτικού σου κλειδιού στον/στην συμμαθητή/ρια ώστε να ανοίγει οποιοδήποτε μήνυμά σου.",
        },
      },
      lm04_q4_authenticity_signing: {
        heading: "Αυθεντικότητα / απόδειξη ελέγχου",
        prompt:
          "Ένας συμπαίκτης ζητά να αποδείξεις ότι ελέγχεις συγκεκριμένη διεύθυνση για μια σύντομη δήλωση — χωρίς να στείλεις κεφάλαια. Τι πρέπει να κάνεις;",
        options: {
          A: "Να κρυπτογραφήσεις τη δήλωση με το δημόσιο κλειδί του συμπαίκτη.",
          B: "Να υπογράψεις τη δήλωση με το πορτοφόλι που ελέγχει εκείνη τη διεύθυνση ώστε να επαληθεύσει την ανακτημένη διεύθυνση.",
          C: "Να του στείλεις το ιδιωτικό κλειδί για να το ελέγξει μόνος του.",
          D: "Να του ζητήσεις να εμπιστευτεί το εικονίδιο της εφαρμογής πορτοφολιού στο τηλέφωνό σου ως επαρκή απόδειξη.",
        },
      },
      lm04_q5_address_not_public_key: {
        heading: "Διεύθυνση ≠ δημόσιο κλειδί",
        prompt:
          "Γιατί δεν μπορείς απλώς να επικολλήσεις μια διεύθυνση τύπου Ethereum σε πεδίο κρυπτογράφησης που περιμένει δημόσιο κλειδί;",
        options: {
          A: "Οι διευθύνσεις είναι πάντα μακρύτερες από τα δημόσια κλειδιά, άρα δεν χωράνε.",
          B: "Οι διευθύνσεις περιλαμβάνουν ήδη το ιδιωτικό κλειδί, άρα η κρυπτογράφηση θα ήταν μη ασφαλής.",
          C: "Η διεύθυνση είναι παράγωγο δημόσιο αναγνωριστικό, όχι το δημόσιο κλειδί κρυπτογράφησης· οι διευθύνσεις δεν εκθέτουν αυτό το δημόσιο κλειδί εξ ορισμού.",
          D: "Η κρυπτογράφηση λειτουργεί μόνο on-chain, και οι διευθύνσεις είναι ετικέτες εκτός αλυσίδας.",
        },
      },
      lm04_q6_signature_interpretation: {
        heading: "Σενάριο FoodTrust — Τι αποδεικνύει μια υπογραφή;",
        prompt:
          "Σε ένα σύστημα εφοδιαστικής αλυσίδας τύπου FoodTrust, ένας παραγωγός υπογράφει μια καταγραφή που δηλώνει ότι μια παρτίδα προϊόντος συγκομίστηκε σε συγκεκριμένη ημερομηνία. Η υπογραφή επαληθεύεται επιτυχώς ως προς τη διεύθυνση blockchain του παραγωγού. Τι μπορείς να συμπεράνεις;",
        options: {
          A: "Το blockchain έχει επαληθεύσει ανεξάρτητα ότι η δηλωμένη ημερομηνία συγκομιδής είναι αληθής.",
          B: "Το κλειδί υπογραφής που ελέγχει εκείνη τη διεύθυνση ενέκρινε την καταγραφή· η υπογραφή από μόνη της δεν αποδεικνύει ότι η δηλωμένη ημερομηνία συγκομιδής είναι πραγματικά αληθής.",
          C: "Η πραγματική νομική ταυτότητα του παραγωγού έχει αποδειχθεί αποκλειστικά από την υπογραφή.",
          D: "Η υπογεγραμμένη καταγραφή πρέπει να έχει αποθηκευτεί σε κάθε δίκτυο blockchain.",
        },
      },
      lm04_q7_proof_without_transaction: {
        heading: "Απόδειξη χωρίς συναλλαγή",
        prompt: "Ποια δήλωση για την απόδειξη ελέγχου διεύθυνσης είναι σωστή;",
        options: {
          A: "Μπορείς να αποδείξεις έλεγχο υπογράφοντας ένα μήνυμα και επαληθεύοντας την ανάκτηση χωρίς να αποκαλύψεις το ιδιωτικό κλειδί και χωρίς να χρειάζεται συναλλαγή on-chain με gas για την ίδια την απόδειξη.",
          B: "Πρέπει πάντα να στείλεις συναλλαγή με gas· αλλιώς δεν αποδεικνύεται η κυριότητα.",
          C: "Πρέπει να στείλεις με email το ιδιωτικό κλειδί στον επαληθευτή ώστε να ανασυνθέσει τη διεύθυνση.",
          D: "Μόνο η έκδοση NFT μπορεί να αποδείξει έλεγχο μιας διεύθυνσης.",
        },
      },
    },
  },
};

/** Fallback post-pass rationales when GET/POST omit them (presentation only). */
export const LM04_POST_PASS_RATIONALES = {
  en: {
    lm04_q1_key_roles:
      "The private key stays secret and enables control. The public key can be shared for encryption or verification. The address is the usual public network handle derived from those keys.",
    lm04_q2_wallet_vs_address:
      "A wallet manages cryptographic keys and signing on your behalf. The address is what others see as your public handle — the wallet application is not itself the identity.",
    lm04_q3_confidentiality_encryption:
      "Confidentiality means only the intended receiver should read the message. That is encryption with the receiver's public key — not signing.",
    lm04_q4_authenticity_signing:
      "Authenticity and proof of control come from signing. Anyone can verify the signature; encryption would hide content instead of proving who authorized it.",
    lm04_q5_address_not_public_key:
      "An address is not interchangeable with a public key for encryption. You need the receiver's public key; addresses do not publish that key by default.",
    lm04_q6_signature_interpretation:
      "In a FoodTrust-style supply chain, a verified producer signature shows that the signing key controlling that address authorized the record. The signature alone does not prove that declared facts (for example a harvest date) are true, nor legal identity.",
    lm04_q7_proof_without_transaction:
      "Message signing proves control without disclosing the private key and without requiring an on-chain transaction for the proof itself.",
  },
  gr: {
    lm04_q1_key_roles:
      "Το ιδιωτικό κλειδί μένει μυστικό και επιτρέπει έλεγχο. Το δημόσιο κλειδί μπορεί να κοινοποιηθεί για κρυπτογράφηση ή επαλήθευση. Η διεύθυνση είναι το συνηθισμένο δημόσιο αναγνωριστικό που παράγεται από αυτά τα κλειδιά.",
    lm04_q2_wallet_vs_address:
      "Ένα πορτοφόλι διαχειρίζεται κρυπτογραφικά κλειδιά και υπογραφές εκ μέρους σου. Η διεύθυνση είναι αυτό που βλέπουν οι άλλοι ως δημόσιο αναγνωριστικό — η εφαρμογή πορτοφολιού δεν είναι από μόνη της η ταυτότητα.",
    lm04_q3_confidentiality_encryption:
      "Εμπιστευτικότητα σημαίνει ότι μόνο ο προοριζόμενος παραλήπτης πρέπει να διαβάσει το μήνυμα. Αυτό είναι κρυπτογράφηση με το δημόσιο κλειδί του παραλήπτη — όχι υπογραφή.",
    lm04_q4_authenticity_signing:
      "Η αυθεντικότητα και η απόδειξη ελέγχου προκύπτουν από την υπογραφή. Οποιοσδήποτε μπορεί να επαληθεύσει την υπογραφή· η κρυπτογράφηση θα έκρυβε το περιεχόμενο αντί να αποδεικνύει ποιος το ενέκρινε.",
    lm04_q5_address_not_public_key:
      "Μια διεύθυνση δεν είναι εναλλάξιμη με δημόσιο κλειδί για κρυπτογράφηση. Χρειάζεσαι το δημόσιο κλειδί του παραλήπτη· οι διευθύνσεις δεν δημοσιεύουν αυτό το κλειδί εξ ορισμού.",
    lm04_q6_signature_interpretation:
      "Σε εφοδιαστική αλυσίδα τύπου FoodTrust, μια επαληθευμένη υπογραφή παραγωγού δείχνει ότι το κλειδί υπογραφής που ελέγχει εκείνη τη διεύθυνση ενέκρινε την καταγραφή. Η υπογραφή από μόνη της δεν αποδεικνύει ότι δηλωμένα γεγονότα (π.χ. ημερομηνία συγκομιδής) είναι αληθή, ούτε νομική ταυτότητα.",
    lm04_q7_proof_without_transaction:
      "Η υπογραφή μηνύματος αποδεικνύει έλεγχο χωρίς αποκάλυψη του ιδιωτικού κλειδιού και χωρίς να απαιτείται συναλλαγή on-chain για την ίδια την απόδειξη.",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm04AssessmentCopy(lang = "en") {
  return LM04_ASSESSMENT_COPY[lang === "gr" ? "gr" : "en"] || LM04_ASSESSMENT_COPY.en;
}
