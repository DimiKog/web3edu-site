/**
 * LM07 Interactive Chapter — Understanding Smart Contracts (EN/GR).
 * Dense pedagogical content. No evidence / XP / ledger mutation.
 */

export const LM07_CHAPTER_COPY = {
  en: {
    title: "Understanding Smart Contracts",
    subtitle:
      "How smart-contract execution turns an agreed transaction into a deterministic state transition.",
    openingQuestion:
      "In LM06, the network agreed on which transactions become part of the blockchain. But what happens when a transaction targets a smart contract?",
    lm06Bridge:
      "In LM06 you followed PENDING → agreement → finalization → shared state. LM07 asks what programmable contract logic does once a transaction can update that shared state.",
    spineLabel: "Conceptual spine",
    spineSteps: [
      "TRANSACTION",
      "SMART CONTRACT",
      "EVM EXECUTION",
      "STATE TRANSITION",
      "RECEIPT / EVENTS",
    ],
    readingCallout:
      "Before continuing — Chapter 6, §6.1 (pp. 115–116) provides the theoretical foundation for smart contracts, Ethereum accounts, languages, and gas.",
    readingOpenCta: "Open resource →",
    codeState: {
      heading: "From shared state to programmable state",
      keyStatement: "SMART CONTRACT = CODE + STATE",
      body:
        "A smart contract is deployed program logic together with persistent state at a blockchain address. Nodes share an execution context: the same contract code and the same stored state that later transactions can read or update.",
      points: [
        "Contract code — the deployed logic",
        "Persistent state — values stored at the contract address",
        "Contract address — where code and state live on the chain",
        "Shared execution context — validators start from the same prior state",
      ],
      imageAlt:
        "Diagram of a smart contract as code plus persistent state at a blockchain address.",
    },
    execution: {
      heading: "How smart-contract execution works",
      body:
        "A transaction can invoke contract logic. The EVM (Ethereum Virtual Machine — the shared engine that runs contract code) executes that logic. Validating nodes run the same deterministic steps and must derive the same resulting state. Successful execution may update blockchain state; receipts and events record execution metadata and logs — they are not the persistent contract state itself.",
      keyStatement:
        "Validators do not merely agree that the transaction exists. They execute the same contract logic and must derive the same resulting state.",
      imageAlt:
        "Flow diagram: transaction to smart contract to EVM execution to state transition to receipt and events.",
    },
    readWrite: {
      heading: "Reading state ≠ changing state",
      body:
        "A normal read/call inspects contract state without submitting a state-changing transaction. From the learner’s perspective, a typical off-chain view call does not require paying transaction gas. A write path requests execution through a transaction, is processed by the network, consumes gas, and may change persistent state if execution succeeds — it does not always change state.",
      read: {
        title: "READ / CALL",
        points: [
          "Inspects contract state",
          "No blockchain state transition",
          "Normally no on-chain transaction",
          "Typical view call does not require paying transaction gas",
        ],
      },
      write: {
        title: "WRITE / TRANSACTION",
        points: [
          "Requests execution through a transaction",
          "Processed by the network",
          "Consumes gas",
          "May change persistent state if execution succeeds",
        ],
      },
      imageAlt:
        "Comparison diagram of read/call inspection versus write/transaction execution that may update state.",
    },
    constraints: {
      heading: "Execution has constraints",
      determinism: {
        title: "Determinism",
        body:
          "Same prior state and the same valid inputs must produce the same execution result on every validating node.",
      },
      gas: {
        title: "Gas",
        body:
          "Gas meters and bounds computational work during contract execution. It prices resources; it does not replace consensus or guarantee that every transaction updates state.",
      },
      persistence: {
        title: "Persistence",
        body:
          "Successful state changes become part of blockchain state and history.",
      },
      immutability: {
        title: "Immutability (lightly)",
        body:
          "Deployed contract logic is not casually edited like a private application backend. Do not treat upgrade patterns here — those belong later.",
      },
    },
    onChain: {
      heading: "What belongs on-chain?",
      body:
        "Blockchain is not a database where everything should be stored. Permanence, privacy, cost, and trust/verifiability decide what belongs on-chain versus off-chain.",
      dimensions: [
        { title: "Permanence", body: "On-chain data is hard to remove once recorded." },
        { title: "Privacy", body: "Shared ledgers are a poor place for secrets or private personal data." },
        { title: "Cost", body: "Large payloads are expensive to store directly on-chain." },
        {
          title: "Trust / verifiability",
          body: "Compact shared proofs, hashes, or ownership state can belong on-chain when shared verification matters.",
        },
      ],
      examples: [
        { label: "Password", verdict: "Should not be stored on-chain" },
        { label: "Large image / file", verdict: "Generally keep off-chain" },
        { label: "Credential proof / hash", verdict: "Potentially appropriate on-chain" },
        { label: "Ownership state", verdict: "Potentially appropriate on-chain" },
        { label: "Private personal data", verdict: "Generally inappropriate on-chain" },
      ],
      keyStatement: "Blockchain is not a database where everything should be stored.",
    },
    yourTurn: {
      heading: "Now apply the model.",
      body:
        "Trace simple contract actions from initial state through execution rules to the resulting state — including a case that must be rejected.",
      cta: "Start Execution Trace →",
    },
    takeaway: {
      heading: "FINAL TAKEAWAY",
      inequalities: ["TRANSACTION", "STATE CHANGE"],
      resultLead: "VALID TRANSACTION",
      resultMid: "+ DETERMINISTIC CONTRACT EXECUTION",
      resultEnd: "→ VALID STATE TRANSITION → UPDATED SHARED STATE",
      body:
        "Submitting a transaction is not the same as changing state. A valid state transition follows successful deterministic contract execution — failed, reverted, or no-op execution does not automatically update shared state.",
    },
    heroImageAlt:
      "LM07 visual: understanding smart contracts as programmable code and state on the blockchain.",
  },
  gr: {
    title: "Κατανόηση Έξυπνων Συμβολαίων",
    subtitle:
      "Πώς η εκτέλεση έξυπνου συμβολαίου μετατρέπει μια συμφωνημένη συναλλαγή σε ντετερμινιστική μετάβαση κατάστασης.",
    openingQuestion:
      "Στο LM06, το δίκτυο συμφώνησε ποιες συναλλαγές γίνονται μέρος του blockchain. Τι συμβαίνει όμως όταν μια συναλλαγή στοχεύει ένα έξυπνο συμβόλαιο;",
    lm06Bridge:
      "Στο LM06 ακολούθησες PENDING → συμφωνία → οριστικοποίηση → κοινή κατάσταση. Το LM07 ρωτά τι κάνει η προγραμματιζόμενη λογική συμβολαίου όταν μια συναλλαγή μπορεί να ενημερώσει αυτή την κοινή κατάσταση.",
    spineLabel: "Εννοιολογική ροή",
    spineSteps: [
      "ΣΥΝΑΛΛΑΓΗ",
      "ΈΞΥΠΝΟ ΣΥΜΒΟΛΑΙΟ",
      "ΕΚΤΕΛΕΣΗ EVM",
      "ΜΕΤΑΒΑΣΗ ΚΑΤΑΣΤΑΣΗΣ",
      "RECEIPT / EVENTS",
    ],
    readingCallout:
      "Πριν συνεχίσεις — το Κεφάλαιο 6, §6.1 (σελ. 115–116) παρέχει το θεωρητικό υπόβαθρο για έξυπνα συμβόλαια, λογαριασμούς Ethereum, γλώσσες και gas.",
    readingOpenCta: "Άνοιξε τον πόρο →",
    codeState: {
      heading: "Από κοινή κατάσταση σε προγραμματιζόμενη κατάσταση",
      keyStatement: "ΈΞΥΠΝΟ ΣΥΜΒΟΛΑΙΟ = ΚΩΔΙΚΑΣ + ΚΑΤΑΣΤΑΣΗ",
      body:
        "Ένα έξυπνο συμβόλαιο είναι αναπτυγμένη λογική προγράμματος μαζί με επίμονη κατάσταση σε μια διεύθυνση blockchain. Οι κόμβοι μοιράζονται κοινό πλαίσιο εκτέλεσης: τον ίδιο κώδικα συμβολαίου και την ίδια αποθηκευμένη κατάσταση που μεταγενέστερες συναλλαγές μπορούν να διαβάσουν ή να ενημερώσουν.",
      points: [
        "Κώδικας συμβολαίου — η αναπτυγμένη λογική",
        "Επίμονη κατάσταση — τιμές στη διεύθυνση του συμβολαίου",
        "Διεύθυνση συμβολαίου — όπου ζουν κώδικας και κατάσταση στο chain",
        "Κοινό πλαίσιο εκτέλεσης — οι validators ξεκινούν από την ίδια προηγούμενη κατάσταση",
      ],
      imageAlt:
        "Διάγραμμα έξυπνου συμβολαίου ως κώδικας μαζί με επίμονη κατάσταση σε διεύθυνση blockchain.",
    },
    execution: {
      heading: "Πώς λειτουργεί η εκτέλεση έξυπνου συμβολαίου",
      body:
        "Μια συναλλαγή μπορεί να καλέσει λογική συμβολαίου. Το EVM (Ethereum Virtual Machine — η κοινή μηχανή που εκτελεί κώδικα συμβολαίου) εκτελεί αυτή τη λογική. Οι validating κόμβοι τρέχουν τα ίδια ντετερμινιστικά βήματα και πρέπει να παράγουν την ίδια προκύπτουσα κατάσταση. Η επιτυχής εκτέλεση μπορεί να ενημερώσει την κατάσταση blockchain· τα receipts και τα events καταγράφουν μεταδεδομένα/logs εκτέλεσης — δεν είναι η ίδια η επίμονη κατάσταση του συμβολαίου.",
      keyStatement:
        "Οι validators δεν συμφωνούν απλώς ότι η συναλλαγή υπάρχει. Εκτελούν την ίδια λογική συμβολαίου και πρέπει να παράγουν την ίδια προκύπτουσα κατάσταση.",
      imageAlt:
        "Διάγραμμα ροής: συναλλαγή → έξυπνο συμβόλαιο → εκτέλεση EVM → μετάβαση κατάστασης → receipt και events.",
    },
    readWrite: {
      heading: "Ανάγνωση κατάστασης ≠ αλλαγή κατάστασης",
      body:
        "Μια κανονική ανάγνωση/call επιθεωρεί κατάσταση συμβολαίου χωρίς να υποβάλει state-changing συναλλαγή. Από την πλευρά του εκπαιδευόμενου, μια τυπική off-chain view call δεν απαιτεί πληρωμή transaction gas. Η διαδρομή εγγραφής ζητά εκτέλεση μέσω συναλλαγής, επεξεργάζεται από το δίκτυο, καταναλώνει gas και μπορεί να αλλάξει επίμονη κατάσταση αν η εκτέλεση επιτύχει — δεν αλλάζει πάντα κατάσταση.",
      read: {
        title: "ΑΝΑΓΝΩΣΗ / CALL",
        points: [
          "Επιθεωρεί κατάσταση συμβολαίου",
          "Χωρίς μετάβαση κατάστασης blockchain",
          "Συνήθως χωρίς on-chain συναλλαγή",
          "Τυπική view call δεν απαιτεί πληρωμή transaction gas",
        ],
      },
      write: {
        title: "ΕΓΓΡΑΦΗ / ΣΥΝΑΛΛΑΓΗ",
        points: [
          "Ζητά εκτέλεση μέσω συναλλαγής",
          "Επεξεργάζεται από το δίκτυο",
          "Καταναλώνει gas",
          "Μπορεί να αλλάξει επίμονη κατάσταση αν η εκτέλεση επιτύχει",
        ],
      },
      imageAlt:
        "Συγκριτικό διάγραμμα ανάγνωσης/call έναντι εγγραφής/συναλλαγής που μπορεί να ενημερώσει κατάσταση.",
    },
    constraints: {
      heading: "Η εκτέλεση έχει περιορισμούς",
      determinism: {
        title: "Ντετερμινισμός",
        body:
          "Η ίδια προηγούμενη κατάσταση και τα ίδια έγκυρα δεδομένα εισόδου πρέπει να δίνουν το ίδιο αποτέλεσμα εκτέλεσης σε κάθε validating κόμβο.",
      },
      gas: {
        title: "Gas",
        body:
          "Το gas μετρά και περιορίζει την υπολογιστική εργασία κατά την εκτέλεση συμβολαίου. Τιμολογεί πόρους· δεν αντικαθιστά τη συναίνεση ούτε εγγυάται ότι κάθε συναλλαγή ενημερώνει κατάσταση.",
      },
      persistence: {
        title: "Επιμονή",
        body:
          "Οι επιτυχείς αλλαγές κατάστασης γίνονται μέρος της κατάστασης και του ιστορικού blockchain.",
      },
      immutability: {
        title: "Αμεταβλητότητα (ελαφρά)",
        body:
          "Η λογική αναπτυγμένου συμβολαίου δεν επεξεργάζεται εύκολα όπως ένα ιδιωτικό backend εφαρμογής. Μην εισάγεις εδώ πρότυπα αναβάθμισης — ανήκουν αργότερα.",
      },
    },
    onChain: {
      heading: "Τι ανήκει on-chain;",
      body:
        "Το blockchain δεν είναι βάση δεδομένων όπου πρέπει να αποθηκεύονται τα πάντα. Η μονιμότητα, η ιδιωτικότητα, το κόστος και η εμπιστοσύνη/επαληθευσιμότητα καθορίζουν τι ανήκει on-chain και τι off-chain.",
      dimensions: [
        { title: "Μονιμότητα", body: "Τα on-chain δεδομένα δύσκολα αφαιρούνται αφού καταγραφούν." },
        {
          title: "Ιδιωτικότητα",
          body: "Τα κοινά ledgers είναι κακό μέρος για μυστικά ή ιδιωτικά προσωπικά δεδομένα.",
        },
        { title: "Κόστος", body: "Μεγάλα payloads είναι ακριβά να αποθηκευτούν απευθείας on-chain." },
        {
          title: "Εμπιστοσύνη / επαληθευσιμότητα",
          body: "Συμπαγείς κοινές αποδείξεις, hashes ή κατάσταση ιδιοκτησίας μπορεί να ανήκουν on-chain όταν μετράει η κοινή επαλήθευση.",
        },
      ],
      examples: [
        { label: "Κωδικός πρόσβασης", verdict: "Δεν πρέπει να αποθηκεύεται on-chain" },
        { label: "Μεγάλη εικόνα / αρχείο", verdict: "Συνήθως off-chain" },
        { label: "Απόδειξη / hash διαπιστευτηρίου", verdict: "Ενδεχομένως κατάλληλο on-chain" },
        { label: "Κατάσταση ιδιοκτησίας", verdict: "Ενδεχομένως κατάλληλη on-chain" },
        { label: "Ιδιωτικά προσωπικά δεδομένα", verdict: "Συνήθως ακατάλληλα on-chain" },
      ],
      keyStatement: "Το blockchain δεν είναι βάση δεδομένων όπου πρέπει να αποθηκεύονται τα πάντα.",
    },
    yourTurn: {
      heading: "Εφάρμοσε τώρα το μοντέλο.",
      body:
        "Ιχνηλάτησε απλές ενέργειες συμβολαίου από αρχική κατάσταση μέσω κανόνων εκτέλεσης έως την προκύπτουσα κατάσταση — συμπεριλαμβανομένης περίπτωσης που πρέπει να απορριφθεί.",
      cta: "Έναρξη Execution Trace →",
    },
    takeaway: {
      heading: "ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ",
      inequalities: ["ΣΥΝΑΛΛΑΓΗ", "ΑΛΛΑΓΗ ΚΑΤΑΣΤΑΣΗΣ"],
      resultLead: "ΕΓΚΥΡΗ ΣΥΝΑΛΛΑΓΗ",
      resultMid: "+ ΝΤΕΤΕΡΜΙΝΙΣΤΙΚΗ ΕΚΤΕΛΕΣΗ ΣΥΜΒΟΛΑΙΟΥ",
      resultEnd: "→ ΕΓΚΥΡΗ ΜΕΤΑΒΑΣΗ ΚΑΤΑΣΤΑΣΗΣ → ΕΝΗΜΕΡΩΜΕΝΗ ΚΟΙΝΗ ΚΑΤΑΣΤΑΣΗ",
      body:
        "Η υποβολή συναλλαγής δεν είναι το ίδιο με την αλλαγή κατάστασης. Μια έγκυρη μετάβαση κατάστασης ακολουθεί επιτυχή ντετερμινιστική εκτέλεση συμβολαίου — αποτυχημένη, reverted ή no-op εκτέλεση δεν ενημερώνει αυτόματα την κοινή κατάσταση.",
    },
    heroImageAlt:
      "Οπτικό LM07: κατανόηση έξυπνων συμβολαίων ως προγραμματιζόμενος κώδικας και κατάσταση στο blockchain.",
  },
};

export const LM07_EXECUTION_TRACE_HREF = {
  en: "/learning-modules/lm07/execution-trace",
  gr: "/learning-modules-gr/lm07/execution-trace",
};

export function getLm07ChapterCopy(lang = "en") {
  return lang === "gr" ? LM07_CHAPTER_COPY.gr : LM07_CHAPTER_COPY.en;
}
