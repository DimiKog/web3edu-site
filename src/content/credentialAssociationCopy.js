/**
 * IC-03A — wallet-first credential association banner copy (EN/GR).
 * Does not claim minting, new identity creation, or private access.
 */

const EN = {
  promptTitle: "Link your existing credential",
  promptBody:
    "This links an existing Account Abstraction–held Web3Edu credential to your wallet profile. It does not create a new identity or mint a new SBT.",
  verifyAction: "Verify and link your credential",
  signingTitle: "Confirm the signature in your wallet…",
  signingBody:
    "Sign the credential-association message only. No transaction is sent and nothing is minted.",
  rejectedTitle: "Signature cancelled",
  rejectedBody:
    "Your credential was not linked. You can try again when ready.",
  expiredTitle: "Association challenge expired",
  expiredBody: "Request a new verification to link your existing credential.",
  retryAction: "Try again",
  reverifyAction: "Verify and link again",
  verifiedTitle: "Credential linked",
  verifiedBody:
    "Your Account Abstraction–held credential is verified and linked to this wallet profile.",
  missingTitle: "No AA-held credential found",
  missingBody:
    "We could not find an existing Account Abstraction identity with a Web3Edu credential for this wallet. Association does not mint a new SBT.",
  wrongWalletTitle: "Wrong wallet",
  wrongWalletBody:
    "Keep the same Edu-Net wallet connected while signing the association.",
  wrongNetworkTitle: "Wrong network",
  wrongNetworkBody: "Switch to Besu Edu-Net before linking your credential.",
  rpcTitle: "Verification temporarily unavailable",
  rpcBody:
    "On-chain checks are unavailable right now. Public progress stays available; try again shortly.",
  failedTitle: "Could not link credential",
  failedBody:
    "Something went wrong while verifying your credential. Please try again.",
  unavailableTitle: "Credential linking unavailable",
  unavailableBody:
    "Credential association is turned off on this environment.",
};

const GR = {
  promptTitle: "Σύνδεσε το υπάρχον διαπιστευτήριό σου",
  promptBody:
    "Αυτό συνδέει ένα υπάρχον διαπιστευτήριο Web3Edu που κρατά το Account Abstraction στο προφίλ πορτοφολιού σου. Δεν δημιουργεί νέα ταυτότητα ούτε mint νέου SBT.",
  verifyAction: "Επαλήθευση και σύνδεση διαπιστευτηρίου",
  signingTitle: "Επιβεβαίωσε την υπογραφή στο πορτοφόλι…",
  signingBody:
    "Υπόγραψε μόνο το μήνυμα σύνδεσης διαπιστευτηρίου. Δεν αποστέλλεται συναλλαγή και δεν γίνεται mint.",
  rejectedTitle: "Η υπογραφή ακυρώθηκε",
  rejectedBody:
    "Το διαπιστευτήριο δεν συνδέθηκε. Μπορείς να δοκιμάσεις ξανά όταν είσαι έτοιμος/η.",
  expiredTitle: "Έληξε η πρόκληση σύνδεσης",
  expiredBody: "Ζήτησε νέα επαλήθευση για να συνδέσεις το υπάρχον διαπιστευτήριο.",
  retryAction: "Δοκίμασε ξανά",
  reverifyAction: "Επαλήθευση και σύνδεση ξανά",
  verifiedTitle: "Το διαπιστευτήριο συνδέθηκε",
  verifiedBody:
    "Το διαπιστευτήριο που κρατά το Account Abstraction είναι επαληθευμένο και συνδεδεμένο με αυτό το προφίλ πορτοφολιού.",
  missingTitle: "Δεν βρέθηκε διαπιστευτήριο AA",
  missingBody:
    "Δεν βρέθηκε υπάρχουσα ταυτότητα Account Abstraction με διαπιστευτήριο Web3Edu για αυτό το πορτοφόλι. Η σύνδεση δεν mint νέο SBT.",
  wrongWalletTitle: "Λάθος πορτοφόλι",
  wrongWalletBody:
    "Κράτα το ίδιο πορτοφόλι Edu-Net συνδεδεμένο κατά την υπογραφή.",
  wrongNetworkTitle: "Λάθος δίκτυο",
  wrongNetworkBody: "Μετάβαλε σε Besu Edu-Net πριν τη σύνδεση του διαπιστευτηρίου.",
  rpcTitle: "Η επαλήθευση δεν είναι διαθέσιμη προσωρινά",
  rpcBody:
    "Οι on-chain έλεγχοι δεν είναι διαθέσιμοι αυτή τη στιγμή. Η δημόσια πρόοδος παραμένει διαθέσιμη· δοκίμασε ξανά σύντομα.",
  failedTitle: "Αδυναμία σύνδεσης διαπιστευτηρίου",
  failedBody:
    "Κάτι πήγε στραβά κατά την επαλήθευση. Δοκίμασε ξανά.",
  unavailableTitle: "Η σύνδεση διαπιστευτηρίου δεν είναι διαθέσιμη",
  unavailableBody:
    "Η σύνδεση διαπιστευτηρίου είναι απενεργοποιημένη σε αυτό το περιβάλλον.",
};

export function getCredentialAssociationCopy(isGR = false) {
  return isGR ? GR : EN;
}
