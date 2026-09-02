export const LM08_SOURCE_VERIFICATION_COPY = {
    en: {
        moduleLabel: "LM08",
        title: "Source-code Verification",
        subtitle:
            "Verify that your deployed Counter contract on Besu Edu-Net is linked to published Solidity source in Blockscout. Web3Edu checks Blockscout — you publish the source there first.",
        whyTitle: "Why this matters",
        whyBody:
            "Source verification connects your on-chain contract address to human-readable Solidity source through the explorer. It proves the bytecode at your address matches the code you intended to deploy.",
        readyTitle: "Ready to check",
        readyBody:
            "When your Counter source is verified in Blockscout, click below and Web3Edu will confirm the verification for your canonical Coding Lab 01 contract.",
        checkButton: "Check Source Verification",
        checkAgainButton: "Check Again",
        checking: "Checking Blockscout…",
        signInRequired: "Sign in with your Web3Edu identity to check source verification.",
        verifiedSuccess: "Source code verified on Blockscout.",
        alreadyRecorded: "Source verification already recorded.",
        verificationRecorded: "Verification recorded",
        notVerifiedTitle: "Source not verified yet",
        notVerifiedBody:
            "Publish or verify the Solidity source for this contract in Blockscout. When verification is complete, return here and check again.",
        contractAddressLabel: "Canonical contract address",
        openContract: "Open contract in Blockscout",
        coding01RequiredTitle: "Coding Lab 01 required",
        coding01RequiredBody: "Complete Coding Lab 01 contract verification first.",
        goToCoding01: "Go to Coding Lab 01",
        coding01Path: "/labs/coding-01/interaction",
        explorerUnavailable:
            "Blockscout is temporarily unavailable. Try again shortly.",
        evidenceReviewTitle: "Evidence needs review",
        evidenceReviewBody:
            "Your stored learning evidence needs review. Please try again later or contact support.",
        backToDashboard: "Back to Dashboard",
        dashboardPath: "/dashboard",
    },
    gr: {
        moduleLabel: "LM08",
        title: "Επαλήθευση Πηγαίου Κώδικα",
        subtitle:
            "Επαλήθευσε ότι το deployed Counter contract σου στο Besu Edu-Net συνδέεται με δημοσιευμένο Solidity source στο Blockscout. Το Web3Edu ελέγχει το Blockscout — εσύ δημοσιεύεις πρώτα τον κώδικα εκεί.",
        whyTitle: "Γιατί έχει σημασία",
        whyBody:
            "Η επαλήθευση πηγαίου κώδικα συνδέει τη διεύθυνση του on-chain contract με αναγνώσιμο Solidity source μέσω του explorer. Αποδεικνύει ότι το bytecode στη διεύθυνσή σου ταιριάζει με τον κώδικα που σκόπευες να κάνεις deploy.",
        readyTitle: "Έτοιμο για έλεγχο",
        readyBody:
            "Όταν ο κώδικας του Counter είναι επαληθευμένος στο Blockscout, πάτησε παρακάτω και το Web3Edu θα επιβεβαιώσει την επαλήθευση για το canonical Coding Lab 01 contract σου.",
        checkButton: "Έλεγχος επαλήθευσης κώδικα",
        checkAgainButton: "Έλεγχος ξανά",
        checking: "Έλεγχος Blockscout…",
        signInRequired:
            "Συνδέσου με την ταυτότητα Web3Edu σου για να ελέγξεις την επαλήθευση πηγαίου κώδικα.",
        verifiedSuccess: "Ο πηγαίος κώδικας επαληθεύτηκε στο Blockscout.",
        alreadyRecorded: "Η επαλήθευση πηγαίου κώδικα έχει ήδη καταγραφεί.",
        verificationRecorded: "Η επαλήθευση καταγράφηκε",
        notVerifiedTitle: "Ο πηγαίος κώδικας δεν είναι ακόμη επαληθευμένος",
        notVerifiedBody:
            "Δημοσίευσε ή επαλήθευσε τον Solidity source για αυτό το contract στο Blockscout. Όταν ολοκληρωθεί η επαλήθευση, επέστρεψε εδώ και έλεγξε ξανά.",
        contractAddressLabel: "Canonical διεύθυνση contract",
        openContract: "Άνοιγμα contract στο Blockscout",
        coding01RequiredTitle: "Απαιτείται Coding Lab 01",
        coding01RequiredBody:
            "Ολοκλήρωσε πρώτα την επαλήθευση contract του Coding Lab 01.",
        goToCoding01: "Μετάβαση στο Coding Lab 01",
        coding01Path: "/labs-gr/coding-01/interaction",
        explorerUnavailable:
            "Το Blockscout δεν είναι προσωρινά διαθέσιμο. Δοκίμασε ξανά σε λίγο.",
        evidenceReviewTitle: "Απαιτείται έλεγχος αποδεικτικών",
        evidenceReviewBody:
            "Τα αποθηκευμένα αποδεικτικά μάθησής σου χρειάζονται έλεγχο. Δοκίμασε ξανά αργότερα ή επικοινώνησε για υποστήριξη.",
        backToDashboard: "Επιστροφή στο Dashboard",
        dashboardPath: "/dashboard-gr",
    },
};

/** @param {"en"|"gr"} lang */
export function getLm08SourceVerificationCopy(lang) {
    return LM08_SOURCE_VERIFICATION_COPY[lang === "gr" ? "gr" : "en"];
}
