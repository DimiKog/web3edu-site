/**
 * LM04 Interactive Chapter conceptual content (EN + GR).
 * Compact explainer only — presentation, no evidence/XP.
 * Assessment question wording is intentionally not included.
 */

export const LM04_CHAPTER_COPY = {
  en: {
    title: "Keys, wallets, identity — at a glance",
    subtitle:
      "From platforms to people on the chain: what keys do, what wallets manage, and how carefully to interpret Web3 identity.",
    sections: [
      {
        id: "platforms-to-people",
        title: "1 — From platforms to people on the chain",
        body: [
          "LM03 asked how blockchain platforms differ. LM04 asks who acts on a network before transactions begin.",
          "Keys, addresses, and wallets are the practical layer that lets someone prove control of a public handle — without usernames, passwords, or gas.",
        ],
      },
      {
        id: "keys-addresses-wallets",
        title: "2 — Keys, addresses, wallets",
        body: [
          "Private key: stays secret; enables control (signing / decryption).",
          "Public key: can be shared; used for encryption or verifying signatures.",
          "Address: the usual public network handle derived from those keys (what others typically see).",
          "Conceptual chain: private key → public key → address.",
          "A wallet manages keys and signing on your behalf. It is not itself the identity — the address is the public handle; the wallet is the tool that protects the keys.",
        ],
      },
      {
        id: "two-capabilities",
        title: "3 — Two things keys can do",
        body: [
          "Encryption → confidentiality: only the holder of the matching private key should read the message.",
          "Signing → authenticity / proof of control: anyone can verify that a message was authorized by the key behind an address.",
          "Important: a public key is not the same thing as an address. Encryption needs a public key; addresses do not expose that key by default.",
        ],
      },
      {
        id: "proving-control",
        title: "4 — Proving control without a transaction",
        body: [
          "You can sign a message with your wallet. Verification recovers the address that authorized it.",
          "The private key never leaves the wallet for this proof.",
          "The proof itself does not require gas or an on-chain transaction — you are showing control of a key, not moving funds.",
        ],
      },
      {
        id: "interpreting-identity",
        title: "5 — Interpreting Web3 identity",
        body: [
          "Controlling an address proves cryptographic control of that keypair in a given context.",
          "It does not automatically prove real-world identity (who you are offline).",
          "Product or social login identity is a different layer from wallet/address control.",
          "Educational credentials and progress are yet another trust story — useful, but not the same as “I control this address.”",
        ],
      },
      {
        id: "practice-path",
        title: "6 — Practice path",
        body: [
          "Required evidence order: Lab 01 → Lab 02 → Lab 03 → LM04 Assessment.",
          "Opening this chapter does not complete the module. Labs write lab completion; the assessment must also be passed.",
        ],
      },
    ],
  },
  gr: {
    title: "Κλειδιά, πορτοφόλια, ταυτότητα — με μια ματιά",
    subtitle:
      "Από τις πλατφόρμες στους ανθρώπους στο δίκτυο: τι κάνουν τα κλειδιά, τι διαχειρίζεται το πορτοφόλι, και πώς να ερμηνεύεις προσεκτικά την ταυτότητα στο Web3.",
    sections: [
      {
        id: "platforms-to-people",
        title: "1 — Από τις πλατφόρμες στους ανθρώπους στο δίκτυο",
        body: [
          "Το LM03 εξέτασε πώς διαφέρουν οι πλατφόρμες blockchain. Το LM04 ρωτά ποιος ενεργεί σε ένα δίκτυο πριν ξεκινήσουν οι συναλλαγές.",
          "Κλειδιά, διευθύνσεις και πορτοφόλια είναι το πρακτικό στρώμα που επιτρέπει σε κάποιον να αποδείξει έλεγχο ενός δημόσιου αναγνωριστικού — χωρίς ονόματα χρήστη, κωδικούς ή gas.",
        ],
      },
      {
        id: "keys-addresses-wallets",
        title: "2 — Κλειδιά, διευθύνσεις, πορτοφόλια",
        body: [
          "Ιδιωτικό κλειδί: μένει μυστικό· επιτρέπει έλεγχο (υπογραφή / αποκρυπτογράφηση).",
          "Δημόσιο κλειδί: μπορεί να κοινοποιηθεί· χρησιμοποιείται για κρυπτογράφηση ή επαλήθευση υπογραφών.",
          "Διεύθυνση: το συνηθισμένο δημόσιο αναγνωριστικό στο δίκτυο που παράγεται από αυτά τα κλειδιά (αυτό που συνήθως βλέπουν οι άλλοι).",
          "Εννοιολογική αλυσίδα: ιδιωτικό κλειδί → δημόσιο κλειδί → διεύθυνση.",
          "Ένα πορτοφόλι διαχειρίζεται κλειδιά και υπογραφές εκ μέρους σου. Δεν είναι από μόνο του η ταυτότητα — η διεύθυνση είναι το δημόσιο αναγνωριστικό· το πορτοφόλι είναι το εργαλείο που προστατεύει τα κλειδιά.",
        ],
      },
      {
        id: "two-capabilities",
        title: "3 — Δύο πράγματα που μπορούν να κάνουν τα κλειδιά",
        body: [
          "Κρυπτογράφηση → εμπιστευτικότητα: μόνο ο κάτοχος του αντίστοιχου ιδιωτικού κλειδιού πρέπει να διαβάσει το μήνυμα.",
          "Υπογραφή → αυθεντικότητα / απόδειξη ελέγχου: οποιοσδήποτε μπορεί να επαληθεύσει ότι ένα μήνυμα εγκρίθηκε από το κλειδί πίσω από μια διεύθυνση.",
          "Σημαντικό: το δημόσιο κλειδί δεν είναι το ίδιο με τη διεύθυνση. Η κρυπτογράφηση χρειάζεται δημόσιο κλειδί· οι διευθύνσεις δεν το εκθέτουν εξ ορισμού.",
        ],
      },
      {
        id: "proving-control",
        title: "4 — Απόδειξη ελέγχου χωρίς συναλλαγή",
        body: [
          "Μπορείς να υπογράψεις ένα μήνυμα με το πορτοφόλι σου. Η επαλήθευση ανακτά τη διεύθυνση που το ενέκρινε.",
          "Το ιδιωτικό κλειδί δεν φεύγει από το πορτοφόλι για αυτή την απόδειξη.",
          "Η ίδια η απόδειξη δεν απαιτεί gas ή συναλλαγή on-chain — δείχνεις έλεγχο κλειδιού, όχι μετακίνηση κεφαλαίων.",
        ],
      },
      {
        id: "interpreting-identity",
        title: "5 — Ερμηνεία της ταυτότητας στο Web3",
        body: [
          "Ο έλεγχος μιας διεύθυνσης αποδεικνύει κρυπτογραφικό έλεγχο εκείνου του ζεύγους κλειδιών σε συγκεκριμένο πλαίσιο.",
          "Δεν αποδεικνύει αυτόματα πραγματική ταυτότητα προσώπου (ποιος είσαι εκτός δικτύου).",
          "Η ταυτότητα σύνδεσης προϊόντος ή social login είναι διαφορετικό στρώμα από τον έλεγχο πορτοφολιού/διεύθυνσης.",
          "Τα εκπαιδευτικά διαπιστευτήρια και η πρόοδος είναι άλλη ιστορία εμπιστοσύνης — χρήσιμη, αλλά όχι το ίδιο με «ελέγχω αυτή τη διεύθυνση».",
        ],
      },
      {
        id: "practice-path",
        title: "6 — Διαδρομή εξάσκησης",
        body: [
          "Απαιτούμενη σειρά αποδεικτικών: Lab 01 → Lab 02 → Lab 03 → Αξιολόγηση LM04.",
          "Το άνοιγμα αυτού του κεφαλαίου δεν ολοκληρώνει το module. Τα labs καταγράφουν ολοκλήρωση lab· πρέπει επίσης να περάσεις την αξιολόγηση.",
        ],
      },
    ],
  },
};

/** @param {"en"|"gr"} lang */
export function getLm04ChapterCopy(lang = "en") {
  return LM04_CHAPTER_COPY[lang === "gr" ? "gr" : "en"] || LM04_CHAPTER_COPY.en;
}
