/**
 * LM08 Interactive Chapter conceptual content (EN + GR).
 * Presentation only — does not award evidence or XP.
 */

export const LM08_CHAPTER_COPY = {
  en: {
    lifecycleTitle: "The smart-contract lifecycle",
    lifecycleSubtitle: "From Solidity source to verification — at a glance.",
    conceptualNote:
      "Deployment creates a new on-chain contract instance at its own address. Reading state does not change it; changing state requires a transaction. Inspection and source verification provide evidence about the deployed contract, but verification is not a security certification.",
    foodTraceLine:
      "Example: when FoodTrace deploys a Traceability contract, Solidity source is not the deployed instance — deployment creates a separate on-chain address.",
    stages: [
      { title: "Solidity source", hint: "Human-readable code" },
      { title: "Compile", hint: "Source → bytecode" },
      { title: "Deployable bytecode", hint: "What the network runs" },
      { title: "Deployment transaction", hint: "Creates the instance" },
      { title: "Contract instance", hint: "Address on-chain" },
      { title: "Read vs write", hint: "Call vs transaction" },
      { title: "Inspect", hint: "Blockchain evidence" },
      { title: "Verify source", hint: "Source ↔ deployed code" },
    ],
  },
  gr: {
    lifecycleTitle: "Ο κύκλος ζωής ενός έξυπνου συμβολαίου",
    lifecycleSubtitle: "Από τον πηγαίο κώδικα έως την επαλήθευση — με μια ματιά.",
    conceptualNote:
      "Η ανάπτυξη δημιουργεί ένα νέο στιγμιότυπο του συμβολαίου στο blockchain, με τη δική του διεύθυνση. Η ανάγνωση της κατάστασης δεν τη μεταβάλλει, ενώ η μεταβολή απαιτεί συναλλαγή. Η επιθεώρηση και η επαλήθευση πηγαίου κώδικα παρέχουν στοιχεία για το αναπτυγμένο συμβόλαιο, αλλά η επαλήθευση δεν αποτελεί πιστοποίηση ασφάλειας.",
    foodTraceLine:
      "Παράδειγμα: όταν το FoodTrace αναπτύσσει ένα συμβόλαιο Traceability, ο πηγαίος κώδικας Solidity δεν είναι το αναπτυγμένο στιγμιότυπο — η ανάπτυξη δημιουργεί ξεχωριστή διεύθυνση στο blockchain.",
    stages: [
      { title: "Πηγαίος κώδικας Solidity", hint: "Αναγνώσιμος κώδικας" },
      { title: "Μεταγλώττιση", hint: "Πηγαίος → bytecode" },
      { title: "Bytecode προς ανάπτυξη", hint: "Εκτελέσιμο αποτέλεσμα" },
      { title: "Συναλλαγή ανάπτυξης", hint: "Δημιουργεί το στιγμιότυπο" },
      { title: "Στιγμιότυπο συμβολαίου", hint: "Διεύθυνση στο blockchain" },
      { title: "Ανάγνωση vs μεταβολή", hint: "Κλήση vs συναλλαγή" },
      { title: "Επιθεώρηση", hint: "Στοιχεία blockchain" },
      { title: "Επαλήθευση κώδικα", hint: "Πηγαίος ↔ ανεπτυγμένος" },
    ],
  },
};

/** @param {"en"|"gr"} lang */
export function getLm08ChapterCopy(lang = "en") {
  return LM08_CHAPTER_COPY[lang === "gr" ? "gr" : "en"] || LM08_CHAPTER_COPY.en;
}
