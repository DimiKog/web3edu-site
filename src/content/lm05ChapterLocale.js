/**
 * LM05 Interactive Chapter conceptual content (EN + GR).
 * Compact explainer only — presentation, no evidence/XP.
 * Assessment and Educational Ledger activities are intentionally not implemented here.
 */

export const LM05_CHAPTER_COPY = {
  en: {
    title: "Transactions and blockchain state — at a glance",
    subtitle:
      "From proving control of an address to requesting a change to shared blockchain state — and seeing why not every interaction is a state-changing transaction.",
    openingQuestion:
      "You can now prove control of an address. What happens when you use that control to request a change to blockchain state?",
    spineLabel: "Conceptual flow",
    spineSteps: [
      "Intent",
      "Transaction",
      "Successful Execution",
      "State Transition",
      "Shared State",
    ],
    sections: [
      {
        id: "from-control-to-transaction",
        title: "A — From control to transaction",
        body: [
          "LM04 showed that a signature can demonstrate authorization: you can prove control of an address.",
          "Proof of control means: “I can authorize actions for this address.”",
          "A transaction means: “I authorize this particular action.”",
          "A signature alone is not the same as requesting a state change. A transaction expresses intent to perform an action that may change shared blockchain state.",
          "You practice real wallet signing and on-chain execution in the labs.",
        ],
      },
      {
        id: "transactions-change-state",
        title: "B — Transactions change state",
        body: [
          "Blockchain state is the current result of previously executed transactions — for example account balances, account nonces, and contract state.",
          "Conceptually: State S0 → Transaction → Execution → State S1.",
          "Nonce (introductory): it orders transactions from an account and helps prevent the same sequence from simply being replayed as another valid next transaction.",
          "Gas is the execution/resource cost mechanism. Lab 04 is where you observe gas in a real network context.",
        ],
        showStateDiagram: true,
      },
      {
        id: "not-every-interaction",
        title: "C — Not every interaction changes state",
        body: [
          "A read-only interaction observes blockchain state. It does not create a state-changing transaction and does not modify blockchain state.",
          "A state-changing transaction requests execution that may modify state. It requires a transaction; successful execution produces a new state.",
          "Lab 05 uses a concrete example: reading `value()` versus executing `increment()`.",
        ],
        showReadWrite: true,
      },
      {
        id: "shared-history",
        title: "D — From one transaction to shared history",
        body: [
          "A transaction is created, then it can become pending.",
          "If it is successfully included and executed, its effects contribute to the blockchain’s shared state and shared ledger/history.",
        ],
        bridgeQuestion:
          "My transaction is pending. What determines whether it becomes part of the blockchain?",
      },
    ],
    stateDiagram: {
      s0Title: "State S0",
      s0Alice: "Alice balance: 10",
      s0Bob: "Bob balance: 2",
      txLabel: "Transaction",
      txDetail: "Alice sends 3 to Bob",
      execLabel: "Execution",
      execDetail: "The transaction is executed according to the protocol rules",
      s1Title: "State S1",
      s1Alice: "Alice balance: 7 − transaction cost",
      s1Bob: "Bob balance: 5",
      note: "Conceptual balances for illustration.",
    },
    readWrite: {
      readTitle: "READ",
      readItems: [
        "Observes current state",
        "No state-changing transaction",
        "Example: reading `value()`",
      ],
      writeTitle: "WRITE",
      writeItems: [
        "Requests execution that may modify state",
        "Requires a transaction",
        "Example: executing `increment()`",
      ],
    },
  },
  gr: {
    title: "Συναλλαγές και κατάσταση blockchain — με μια ματιά",
    subtitle:
      "Από την απόδειξη ελέγχου μιας διεύθυνσης στο αίτημα αλλαγής της κοινής κατάστασης blockchain — και γιατί δεν είναι κάθε αλληλεπίδραση state-changing transaction.",
    openingQuestion:
      "Μπορείς πλέον να αποδείξεις ότι ελέγχεις μια διεύθυνση. Τι συμβαίνει όταν χρησιμοποιείς αυτόν τον έλεγχο για να ζητήσεις μια αλλαγή στην κατάσταση του blockchain;",
    spineLabel: "Εννοιολογική ροή",
    spineSteps: [
      "Intent",
      "Transaction",
      "Successful Execution",
      "State Transition",
      "Shared State",
    ],
    sections: [
      {
        id: "from-control-to-transaction",
        title: "A — Από τον έλεγχο στη συναλλαγή",
        body: [
          "Το LM04 έδειξε ότι μια υπογραφή μπορεί να αποδείξει εξουσιοδότηση: μπορείς να αποδείξεις έλεγχο μιας διεύθυνσης.",
          "Απόδειξη ελέγχου σημαίνει: «Μπορώ να εγκρίνω ενέργειες για αυτή τη διεύθυνση.»",
          "Συναλλαγή σημαίνει: «Εγκρίνω αυτή τη συγκεκριμένη ενέργεια.»",
          "Η υπογραφή από μόνη της δεν είναι το ίδιο με αίτημα αλλαγής κατάστασης. Μια συναλλαγή εκφράζει πρόθεση να εκτελεστεί μια ενέργεια που μπορεί να αλλάξει την κοινή κατάσταση blockchain.",
          "Η πραγματική υπογραφή με πορτοφόλι και η εκτέλεση on-chain εξασκούνται στα labs.",
        ],
      },
      {
        id: "transactions-change-state",
        title: "B — Οι συναλλαγές αλλάζουν κατάσταση",
        body: [
          "Η κατάσταση blockchain είναι το τρέχον αποτέλεσμα προηγούμενων εκτελεσμένων συναλλαγών — για παράδειγμα υπόλοιπα λογαριασμών, nonce λογαριασμών και κατάσταση συμβολαίων.",
          "Εννοιολογικά: State S0 → Transaction → Execution → State S1.",
          "Nonce (εισαγωγικά): διατάσσει τις συναλλαγές από έναν λογαριασμό και βοηθά να μην επαναλαμβάνεται απλώς η ίδια ακολουθία ως άλλη έγκυρη επόμενη συναλλαγή.",
          "Το gas είναι ο μηχανισμός κόστους εκτέλεσης/πόρων. Στο Lab 04 παρατηρείς το gas σε πραγματικό δίκτυο.",
        ],
        showStateDiagram: true,
      },
      {
        id: "not-every-interaction",
        title: "C — Δεν αλλάζει κατάσταση κάθε αλληλεπίδραση",
        body: [
          "Μια αλληλεπίδραση μόνο ανάγνωσης (read-only) παρατηρεί την κατάσταση blockchain. Δεν δημιουργεί state-changing transaction και δεν τροποποιεί την κατάσταση.",
          "Μια state-changing transaction ζητά εκτέλεση που μπορεί να τροποποιήσει κατάσταση. Απαιτεί συναλλαγή· η επιτυχής εκτέλεση παράγει νέα κατάσταση.",
          "Το Lab 05 χρησιμοποιεί συγκεκριμένο παράδειγμα: ανάγνωση του `value()` έναντι εκτέλεσης `increment()`.",
        ],
        showReadWrite: true,
      },
      {
        id: "shared-history",
        title: "D — Από μία συναλλαγή στο κοινό ιστορικό",
        body: [
          "Μια συναλλαγή δημιουργείται και έπειτα μπορεί να γίνει pending.",
          "Αν συμπεριληφθεί και εκτελεστεί επιτυχώς, οι επιπτώσεις της συμβάλλουν στην κοινή κατάσταση (shared state) και στο κοινό ledger/ιστορικό του blockchain.",
        ],
        bridgeQuestion:
          "Η συναλλαγή μου είναι σε αναμονή. Τι καθορίζει αν τελικά θα γίνει μέρος του blockchain;",
      },
    ],
    stateDiagram: {
      s0Title: "State S0",
      s0Alice: "Υπόλοιπο Alice: 10",
      s0Bob: "Υπόλοιπο Bob: 2",
      txLabel: "Transaction",
      txDetail: "Η Alice στέλνει 3 στον Bob",
      execLabel: "Execution",
      execDetail: "Η συναλλαγή εκτελείται σύμφωνα με τους κανόνες του πρωτοκόλλου",
      s1Title: "State S1",
      s1Alice: "Υπόλοιπο Alice: 7 − κόστος συναλλαγής",
      s1Bob: "Υπόλοιπο Bob: 5",
      note: "Εννοιολογικά υπόλοιπα για απεικόνιση.",
    },
    readWrite: {
      readTitle: "READ",
      readItems: [
        "Παρατηρεί την τρέχουσα κατάσταση",
        "Χωρίς state-changing transaction",
        "Παράδειγμα: ανάγνωση `value()`",
      ],
      writeTitle: "WRITE",
      writeItems: [
        "Ζητά εκτέλεση που μπορεί να τροποποιήσει κατάσταση",
        "Απαιτεί συναλλαγή",
        "Παράδειγμα: εκτέλεση `increment()`",
      ],
    },
  },
};

/** @param {"en"|"gr"} lang */
export function getLm05ChapterCopy(lang = "en") {
  return LM05_CHAPTER_COPY[lang === "gr" ? "gr" : "en"] || LM05_CHAPTER_COPY.en;
}
