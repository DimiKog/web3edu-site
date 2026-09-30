/**
 * LM07 Smart Contract Execution Trace activity copy (EN + GR).
 * Presentation only — server validates scenario answers.
 */

export const LM07_EXECUTION_TRACE_COPY = {
  en: {
    title: "Smart Contract Execution Trace",
    subtitle:
      "Reason through simple contract actions from initial state to resulting state. Completing this activity records required LM07 evidence (0 XP).",
    loading: "Loading execution-trace scenarios…",
    signInRequired:
      "Sign in with your Web3Edu identity to complete the LM07 execution-trace activity.",
    loadError: "Could not load execution-trace scenarios. Try again.",
    introTitle: "How this works",
    introBody:
      "Each scenario gives an initial state, an action, and an execution rule. Enter the resulting state the deterministic rule produces. One scenario must be rejected when balances are insufficient.",
    scenarioOrder: [
      "score_increase",
      "transfer_sufficient",
      "transfer_insufficient",
    ],
    scenarios: {
      score_increase: {
        title: "Scenario 1 — Score increase",
        hint: "Apply the rule: new score = current score + amount.",
        resultingScoreLabel: "Resulting score",
      },
      transfer_sufficient: {
        title: "Scenario 2 — Transfer with sufficient balance",
        hint: "If sender balance ≥ amount: subtract from sender and add to receiver.",
        aliceBalanceLabel: "Alice balance after transfer",
        bobBalanceLabel: "Bob balance after transfer",
      },
      transfer_insufficient: {
        title: "Scenario 3 — Transfer with insufficient balance",
        hint: "If sender balance < amount: reject and leave balances unchanged.",
        outcomeLabel: "Outcome",
        outcomeRejected: "rejected",
        aliceBalanceLabel: "Alice balance after attempt",
        bobBalanceLabel: "Bob balance after attempt",
      },
    },
    initialStateLabel: "Initial state",
    actionLabel: "Action",
    ruleLabel: "Execution rule",
    yourAnswersLabel: "Your answers",
    submit: "Submit execution trace",
    submitting: "Submitting…",
    retry: "Try again",
    successTitle: "Execution Trace recorded",
    alreadyAppliedTitle: "Execution Trace already recorded",
    successBody:
      "Your LM07 execution-trace evidence is saved. Completing LM07 still requires the LM07 Assessment.",
    alreadyAppliedBody:
      "This activity was already completed for your learner identity. You can continue to the assessment when ready.",
    failedTitle: "Answers not accepted yet",
    failedLead:
      "One or more scenario answers are incorrect. Review the rules and try again.",
    continueAssessmentCta: "Open LM07 Assessment →",
    assessmentHref: "/learning-modules/lm07/assessment",
  },
  gr: {
    title: "Smart Contract Execution Trace",
    subtitle:
      "Συλλογίσου απλές ενέργειες συμβολαίου από αρχική σε προκύπτουσα κατάσταση. Η ολοκλήρωση καταγράφει απαιτούμενο αποδεικτικό LM07 (0 XP).",
    loading: "Φόρτωση σεναρίων execution-trace…",
    signInRequired:
      "Συνδέσου με την ταυτότητα Web3Edu για να ολοκληρώσεις τη δραστηριότητα execution-trace του LM07.",
    loadError: "Δεν ήταν δυνατή η φόρτωση των σεναρίων. Δοκίμασε ξανά.",
    introTitle: "Πώς λειτουργεί",
    introBody:
      "Κάθε σενάριο δίνει αρχική κατάσταση, ενέργεια και κανόνα εκτέλεσης. Συμπλήρωσε την προκύπτουσα κατάσταση που παράγει ο ντετερμινιστικός κανόνας. Ένα σενάριο πρέπει να απορριφθεί όταν τα υπόλοιπα δεν επαρκούν.",
    scenarioOrder: [
      "score_increase",
      "transfer_sufficient",
      "transfer_insufficient",
    ],
    scenarios: {
      score_increase: {
        title: "Σενάριο 1 — Αύξηση score",
        hint: "Εφάρμοσε τον κανόνα: νέο score = τρέχον score + ποσό.",
        resultingScoreLabel: "Προκύπτον score",
      },
      transfer_sufficient: {
        title: "Σενάριο 2 — Μεταφορά με επαρκές υπόλοιπο",
        hint: "Αν το υπόλοιπο αποστολέα ≥ ποσό: αφαίρεσε από αποστολέα και πρόσθεσε στον παραλήπτη.",
        aliceBalanceLabel: "Υπόλοιπο Alice μετά τη μεταφορά",
        bobBalanceLabel: "Υπόλοιπο Bob μετά τη μεταφορά",
      },
      transfer_insufficient: {
        title: "Σενάριο 3 — Μεταφορά με ανεπαρκές υπόλοιπο",
        hint: "Αν το υπόλοιπο αποστολέα < ποσό: απόρριψε και άφησε τα υπόλοιπα αμετάβλητα.",
        outcomeLabel: "Αποτέλεσμα",
        outcomeRejected: "rejected",
        aliceBalanceLabel: "Υπόλοιπο Alice μετά την προσπάθεια",
        bobBalanceLabel: "Υπόλοιπο Bob μετά την προσπάθεια",
      },
    },
    initialStateLabel: "Αρχική κατάσταση",
    actionLabel: "Ενέργεια",
    ruleLabel: "Κανόνας εκτέλεσης",
    yourAnswersLabel: "Οι απαντήσεις σου",
    submit: "Υποβολή execution trace",
    submitting: "Υποβολή…",
    retry: "Δοκίμασε ξανά",
    successTitle: "Το Execution Trace καταγράφηκε",
    alreadyAppliedTitle: "Το Execution Trace έχει ήδη καταγραφεί",
    successBody:
      "Το αποδεικτικό execution-trace του LM07 αποθηκεύτηκε. Η ολοκλήρωση του LM07 απαιτεί ακόμη την Αξιολόγηση LM07.",
    alreadyAppliedBody:
      "Αυτή η δραστηριότητα έχει ήδη ολοκληρωθεί για την ταυτότητά σου. Μπορείς να συνεχίσεις στην αξιολόγηση όταν είσαι έτοιμος/η.",
    failedTitle: "Οι απαντήσεις δεν έγιναν ακόμη αποδεκτές",
    failedLead:
      "Μία ή περισσότερες απαντήσεις σεναρίων είναι λάθος. Ξαναδές τους κανόνες και δοκίμασε ξανά.",
    continueAssessmentCta: "Άνοιξε την Αξιολόγηση LM07 →",
    assessmentHref: "/learning-modules-gr/lm07/assessment",
  },
};

/** @param {"en"|"gr"} lang */
export function getLm07ExecutionTraceCopy(lang = "en") {
  return (
    LM07_EXECUTION_TRACE_COPY[lang === "gr" ? "gr" : "en"] ||
    LM07_EXECUTION_TRACE_COPY.en
  );
}
