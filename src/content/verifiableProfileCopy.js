/** EN/GR copy for Verifiable Profile / Latest Seal (P5b). Feature parity required. */

export const VERIFIABLE_PROFILE_COPY = {
  en: {
    title: "Verifiable Profile",
    latestSeal: "Latest Profile Seal",
    framing:
      "A cryptographic snapshot of your learning profile is anchored on-chain.",
    conceptSbt: "Identity Credential → SBT",
    conceptSeal: "Latest Profile Seal → ProfileAnchor",
    conceptNote:
      "Your SBT is your identity credential. The profile seal records one version of your learning progress — it does not store XP or labs inside the SBT.",

    statusVerified: "Verified",
    statusOutdated: "Valid seal — profile updated since anchor",
    statusOutdatedShort: "Outdated",
    statusNotAnchored: "Not anchored yet",
    statusNotAnchoredShort: "Not Anchored",
    statusInvalid: "Verification issue",
    statusUnavailable: "Verification status temporarily unavailable",
    statusLoading: "Checking verification…",

    matchesSeal: "Current profile matches this seal.",
    matchesSealAlt: "Current profile matches latest seal",
    outdatedExplain:
      "Your anchored snapshot is valid, but your current learning progress has changed since it was sealed.",
    outdatedExplainShort:
      "Current progress has changed since latest seal",
    outdatedCurrentLabel: "Current profile",
    outdatedCurrentValue: "Newer than latest seal",
    notAnchoredExplain:
      "Your current Web3Edu profile does not yet have a confirmed on-chain seal.",
    notAnchoredShort: "No confirmed profile seal",
    invalidExplain:
      "The stored seal could not be validated against the current credential or on-chain state.",
    invalidShort: "Verification issue",
    unavailableExplain:
      "We could not reach the verification service right now. Your dashboard still works normally.",

    latestSealShort: "Latest seal",
    snapshotVersionShortPrefix: "Snapshot v",
    latestSealedSnapshot: "Latest sealed snapshot",
    snapshotVersion: "Snapshot Version",
    schemaVersion: "Schema Version",
    credential: "Credential",
    credentialSbt: "Web3Edu SBT",
    originNetwork: "Origin Network",
    anchorNetwork: "Anchor Network",
    network: "Network",
    anchored: "Anchored",
    anchoredAt: "Anchored At",
    block: "Block",
    digest: "Digest",
    transaction: "Transaction",
    credentialId: "Credential ID",
    sbtContract: "SBT Contract",
    profileAnchorContract: "Profile Anchor Contract",
    tokenId: "Token ID",

    viewTransaction: "View Transaction",
    viewContract: "View Contract",
    viewSbtContract: "View SBT Contract",
    showDetails: "Show verification details",
    hideDetails: "Hide verification details",
    copyValue: "Copy value",
    copied: "Copied!",

    checkLocal: "Local snapshot valid",
    checkBinding: "Credential binding valid",
    checkOnChain: "On-chain anchor valid",
    checkCurrent: "Current profile matches",
    yes: "Yes",
    no: "No",

    reasonPending: "A profile seal was submitted but is not confirmed on-chain yet.",
    reasonBindingMismatch: "The seal does not match the current identity credential.",
    reasonChainDigest: "The on-chain digest does not match the stored seal.",
    reasonChainVersion: "The on-chain snapshot version does not match the stored seal.",
    reasonChainMissing: "No matching on-chain anchor was found for this seal.",
    reasonLocalInvalid: "The stored seal record could not be validated.",
    reasonLifecycle: "The seal lifecycle record is inconsistent.",
    reasonChainOnly: "An on-chain anchor exists without matching local seal history.",
    reasonRpc: "Could not read on-chain anchor state right now.",
    reasonConfig: "Verification is misconfigured on the server.",
    reasonResolver: "Identity resolution failed during verification.",
    reasonBinding: "Credential binding could not be resolved.",
  },
  gr: {
    title: "Επαληθεύσιμο Προφίλ",
    latestSeal: "Τελευταία Σφράγιση Προφίλ",
    framing:
      "Ένα κρυπτογραφικό στιγμιότυπο του μαθησιακού σου προφίλ είναι αγκυρωμένο στην αλυσίδα.",
    conceptSbt: "Διαπιστευτήριο Ταυτότητας → SBT",
    conceptSeal: "Τελευταία Σφράγιση Προφίλ → ProfileAnchor",
    conceptNote:
      "Το SBT είναι το διαπιστευτήριο ταυτότητάς σου. Η σφράγιση προφίλ καταγράφει μία έκδοση της μαθησιακής σου προόδου — δεν αποθηκεύει XP ή labs μέσα στο SBT.",

    statusVerified: "Επαληθευμένο",
    statusOutdated: "Έγκυρη σφράγιση — το προφίλ ενημερώθηκε μετά την αγκύρωση",
    statusOutdatedShort: "Ενημερώθηκε μετά τη σφράγιση",
    statusNotAnchored: "Δεν έχει γίνει ακόμη αγκύρωση",
    statusNotAnchoredShort: "Χωρίς αγκύρωση",
    statusInvalid: "Πρόβλημα επαλήθευσης",
    statusUnavailable: "Η κατάσταση επαλήθευσης δεν είναι προσωρινά διαθέσιμη",
    statusLoading: "Έλεγχος επαλήθευσης…",

    matchesSeal: "Το τρέχον προφίλ αντιστοιχεί σε αυτή τη σφράγιση.",
    matchesSealAlt: "Το τρέχον προφίλ αντιστοιχεί στην τελευταία σφράγιση",
    outdatedExplain:
      "Η αγκυρωμένη σφράγισή σου είναι έγκυρη, αλλά η τρέχουσα μαθησιακή πρόοδος έχει αλλάξει μετά τη σφράγιση.",
    outdatedExplainShort:
      "Η τρέχουσα πρόοδος έχει αλλάξει μετά την τελευταία σφράγιση",
    outdatedCurrentLabel: "Τρέχον προφίλ",
    outdatedCurrentValue: "Νεότερο από την τελευταία σφράγιση",
    notAnchoredExplain:
      "Το τρέχον προφίλ Web3Edu δεν έχει ακόμη επιβεβαιωμένη σφράγιση στην αλυσίδα.",
    notAnchoredShort: "Δεν υπάρχει επιβεβαιωμένη σφράγιση προφίλ",
    invalidExplain:
      "Η αποθηκευμένη σφράγιση δεν μπόρεσε να επαληθευτεί έναντι του τρέχοντος διαπιστευτηρίου ή της κατάστασης στην αλυσίδα.",
    invalidShort: "Πρόβλημα επαλήθευσης",
    unavailableExplain:
      "Δεν ήταν δυνατή η επικοινωνία με την υπηρεσία επαλήθευσης αυτή τη στιγμή. Ο πίνακας ελέγχου λειτουργεί κανονικά.",

    latestSealShort: "Τελευταία σφράγιση",
    snapshotVersionShortPrefix: "Στιγμιότυπο v",
    latestSealedSnapshot: "Τελευταίο σφραγισμένο στιγμιότυπο",
    snapshotVersion: "Έκδοση Στιγμιότυπου",
    schemaVersion: "Έκδοση Σχήματος",
    credential: "Διαπιστευτήριο",
    credentialSbt: "Web3Edu SBT",
    originNetwork: "Δίκτυο Προέλευσης",
    anchorNetwork: "Δίκτυο Αγκύρωσης",
    network: "Δίκτυο",
    anchored: "Αγκυρώθηκε",
    anchoredAt: "Αγκυρώθηκε",
    block: "Μπλοκ",
    digest: "Digest",
    transaction: "Συναλλαγή",
    credentialId: "Αναγνωριστικό Διαπιστευτηρίου",
    sbtContract: "Συμβόλαιο SBT",
    profileAnchorContract: "Συμβόλαιο Profile Anchor",
    tokenId: "Token ID",

    viewTransaction: "Προβολή Συναλλαγής",
    viewContract: "Προβολή Συμβολαίου",
    viewSbtContract: "Προβολή Συμβολαίου SBT",
    showDetails: "Εμφάνιση λεπτομερειών επαλήθευσης",
    hideDetails: "Απόκρυψη λεπτομερειών επαλήθευσης",
    copyValue: "Αντιγραφή τιμής",
    copied: "Αντιγράφηκε!",

    checkLocal: "Έγκυρο τοπικό στιγμιότυπο",
    checkBinding: "Έγκυρη δέσμευση διαπιστευτηρίου",
    checkOnChain: "Έγκυρη αγκύρωση στην αλυσίδα",
    checkCurrent: "Το τρέχον προφίλ αντιστοιχεί",
    yes: "Ναι",
    no: "Όχι",

    reasonPending: "Υποβλήθηκε σφράγιση προφίλ, αλλά δεν έχει ακόμη επιβεβαιωθεί στην αλυσίδα.",
    reasonBindingMismatch: "Η σφράγιση δεν αντιστοιχεί στο τρέχον διαπιστευτήριο ταυτότητας.",
    reasonChainDigest: "Το digest στην αλυσίδα δεν αντιστοιχεί στην αποθηκευμένη σφράγιση.",
    reasonChainVersion: "Η έκδοση στιγμιότυπου στην αλυσίδα δεν αντιστοιχεί στην αποθηκευμένη σφράγιση.",
    reasonChainMissing: "Δεν βρέθηκε αντίστοιχη αγκύρωση στην αλυσίδα για αυτή τη σφράγιση.",
    reasonLocalInvalid: "Η αποθηκευμένη εγγραφή σφράγισης δεν μπόρεσε να επαληθευτεί.",
    reasonLifecycle: "Η εγγραφή κύκλου ζωής της σφράγισης είναι ασυνεπής.",
    reasonChainOnly: "Υπάρχει αγκύρωση στην αλυσίδα χωρίς αντίστοιχο τοπικό ιστορικό σφράγισης.",
    reasonRpc: "Δεν ήταν δυνατή η ανάγνωση της κατάστασης αγκύρωσης στην αλυσίδα αυτή τη στιγμή.",
    reasonConfig: "Η επαλήθευση δεν είναι σωστά ρυθμισμένη στον διακομιστή.",
    reasonResolver: "Η ανάλυση ταυτότητας απέτυχε κατά την επαλήθευση.",
    reasonBinding: "Η δέσμευση διαπιστευτηρίου δεν μπόρεσε να επιλυθεί.",
  },
};

export function getVerifiableProfileCopy(isGR) {
  return isGR ? VERIFIABLE_PROFILE_COPY.gr : VERIFIABLE_PROFILE_COPY.en;
}

/** Map backend reasonCode → safe bilingual key (never raw exception text). */
export function reasonCodeToCopyKey(reasonCode) {
  switch (reasonCode) {
    case "ANCHOR_PENDING":
      return "reasonPending";
    case "CREDENTIAL_BINDING_MISMATCH":
      return "reasonBindingMismatch";
    case "CHAIN_DIGEST_MISMATCH":
      return "reasonChainDigest";
    case "CHAIN_VERSION_MISMATCH":
      return "reasonChainVersion";
    case "CHAIN_ANCHOR_MISSING":
      return "reasonChainMissing";
    case "LOCAL_RECORD_INVALID":
      return "reasonLocalInvalid";
    case "LIFECYCLE_INVALID":
      return "reasonLifecycle";
    case "CHAIN_ONLY_NO_LOCAL_HISTORY":
      return "reasonChainOnly";
    case "RPC_ERROR":
      return "reasonRpc";
    case "CONFIG_ERROR":
      return "reasonConfig";
    case "RESOLVER_ERROR":
      return "reasonResolver";
    case "BINDING_ERROR":
      return "reasonBinding";
    default:
      return null;
  }
}

export function networkLabelForChainId(chainId, isGR) {
  const id = Number(chainId);
  if (id === 424242) return "Edu-Net";
  if (!Number.isFinite(id) || id <= 0) return isGR ? "Άγνωστο" : "Unknown";
  return `chainId ${id}`;
}
