/**
 * WA-01c2 — wallet-only verify-progress banner copy (EN/GR).
 * Does not claim private authorization from metadata shape.
 */

const EN = {
  publicTitle: "Public progress available",
  publicBody:
    "Your wallet-only profile shows public learning summary. Verify this wallet to load your full learning progress.",
  verifyAction: "Verify wallet to load your learning progress",
  signingTitle: "Confirm the signature in your wallet…",
  signingBody: "We only ask you to sign once per short session. No transaction is sent.",
  rejectedTitle: "Wallet verification was cancelled",
  rejectedBody: "Public progress stays available. You can verify again when ready.",
  expiredTitle: "Wallet session expired",
  expiredBody: "Verify again to reload your full learning progress.",
  reverifyAction: "Verify wallet again",
  unavailableTitle: "Wallet verification unavailable",
  unavailableBody:
    "Wallet authentication is turned off on this environment. Public progress remains available.",
  retryAction: "Try again",
};

const GR = {
  publicTitle: "Διαθέσιμη δημόσια πρόοδος",
  publicBody:
    "Το προφίλ μόνο με πορτοφόλι εμφανίζει δημόσια σύνοψη μάθησης. Επαλήθευσε αυτό το πορτοφόλι για να φορτωθεί η πλήρης πρόοδός σου.",
  verifyAction: "Επαλήθευση πορτοφολιού για φόρτωση της προόδου",
  signingTitle: "Επιβεβαίωσε την υπογραφή στο πορτοφόλι…",
  signingBody:
    "Ζητάμε υπογραφή μόνο μία φορά ανά σύντομη συνεδρία. Δεν αποστέλλεται συναλλαγή.",
  rejectedTitle: "Η επαλήθευση πορτοφολιού ακυρώθηκε",
  rejectedBody: "Η δημόσια πρόοδος παραμένει διαθέσιμη. Μπορείς να δοκιμάσεις ξανά όταν είσαι έτοιμος/η.",
  expiredTitle: "Η συνεδρία πορτοφολιού έληξε",
  expiredBody: "Επαλήθευσε ξανά για να φορτωθεί η πλήρης πρόοδος μάθησης.",
  reverifyAction: "Επαλήθευση πορτοφολιού ξανά",
  unavailableTitle: "Η επαλήθευση πορτοφολιού δεν είναι διαθέσιμη",
  unavailableBody:
    "Ο έλεγχος ταυτότητας πορτοφολιού είναι απενεργοποιημένος σε αυτό το περιβάλλον. Η δημόσια πρόοδος παραμένει διαθέσιμη.",
  retryAction: "Δοκίμασε ξανά",
};

export function getWalletAuthProgressCopy(isGR = false) {
  return isGR ? GR : EN;
}
