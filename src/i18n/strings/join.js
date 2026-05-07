export const JOIN_STRINGS = {
  en: {
    joinTag: "Join Web3Edu",
    pageTitle: "How do you want to enter Web3Edu?",
    pageSubtitle: "Choose how you want to start. You can switch later.",
    returning: {
      label: "Returning on this browser",
      heading: "Continue on this device",
      body: "Use your existing Web3Edu identity saved in this browser. You can connect a Web3Edu account or wallet later for easier sign-in.",
      continueBtn: "Continue on this device",
      connectWalletBtn: "Connect a wallet",
      resetBtn: "Reset this device session",
    },
    oidc: {
      heading: "Sign in with Web3Edu",
      subtitle: "New or returning — sign in with Keycloak.",
      signInBtn: "Sign in",
      signedIn: "You're signed in.",
      continueBtn: "Continue",
      loadingLabel: "Finishing sign-in…",
      retryBtn: "Trouble loading your account? Retry",
    },
    wallet: {
      heading: "Connect a wallet",
      subtitle: "For wallet-first users.",
      connectBtn: "Connect Wallet",
      wrongNetwork: "Wrong network",
      connectedPrefix: "Connected: ",
      walletConnected: "Wallet connected",
      checkingNetwork: "Checking network…",
      continueBtn: "Continue with connected wallet",
      checkingBtn: "Checking identity…",
      verifyingPulse: "Verifying your identity…",
    },
    device: {
      heading: "Start without a wallet",
      body: "Create a device-based identity now. You can connect a Web3Edu account or wallet later for easier sign-in.",
      continueBtn: "Start without a wallet",
    },
    alerts: {
      noWallet: "Connect your wallet first to check an existing Identity SBT.",
      noIdentity:
        "Could not reach the identity service or no identity was found for this wallet. Try again or start mint.",
      failed: "Could not verify your wallet identity. Please try again.",
    },
  },
  gr: {
    joinTag: "Join Web3Edu",
    pageTitle: "Πώς θέλεις να μπεις στο Web3Edu;",
    pageSubtitle: "Διάλεξε πώς θέλεις να ξεκινήσεις. Μπορείς να το αλλάξεις αργότερα.",
    returning: {
      label: "Επιστροφή σε αυτό το πρόγραμμα",
      heading: "Συνέχεια σε αυτή τη συσκευή",
      body: "Χρησιμοποίησε την υπάρχουσα ταυτότητα Web3Edu που είναι αποθηκευμένη σε αυτό το πρόγραμμα περιήγησης. Μπορείς αργότερα να συνδέσεις λογαριασμό Web3Edu ή πορτοφόλι για ευκολότερη είσοδο.",
      continueBtn: "Συνέχεια σε αυτή τη συσκευή",
      connectWalletBtn: "Σύνδεση πορτοφολιού",
      resetBtn: "Επαναφορά συνεδρίας συσκευής",
    },
    oidc: {
      heading: "Είσοδος με Web3Edu",
      subtitle: "Νέοι ή επιστρέφοντες — είσοδος μέσω Keycloak.",
      signInBtn: "Είσοδος",
      signedIn: "Έχεις συνδεθεί.",
      continueBtn: "Συνέχεια",
      loadingLabel: "Ολοκλήρωση εισόδου…",
      retryBtn: "Πρόβλημα φόρτωσης; Δοκίμασε ξανά",
    },
    wallet: {
      heading: "Σύνδεση με πορτοφόλι",
      subtitle: "Για wallet-first χρήστες.",
      connectBtn: "Σύνδεση πορτοφολιού",
      wrongNetwork: "Λάθος δίκτυο",
      connectedPrefix: "Συνδέθηκε: ",
      walletConnected: "Το πορτοφόλι συνδέθηκε",
      checkingNetwork: "Έλεγχος δικτύου…",
      continueBtn: "Συνέχεια με συνδεδεμένο wallet",
      checkingBtn: "Έλεγχος…",
      verifyingPulse: "Γίνεται έλεγχος ταυτότητας…",
    },
    device: {
      heading: "Ξεκίνα χωρίς πορτοφόλι",
      body: "Δημιούργησε τώρα μια ταυτότητα βασισμένη στη συσκευή. Μπορείς αργότερα να συνδέσεις λογαριασμό Web3Edu ή πορτοφόλι για ευκολότερη είσοδο.",
      continueBtn: "Ξεκίνα χωρίς πορτοφόλι",
    },
    alerts: {
      noWallet: "Σύνδεσε πρώτα το πορτοφόλι σου για έλεγχο υπάρχοντος Identity SBT.",
      noIdentity:
        "Δεν ήταν δυνατή η επικοινωνία με την υπηρεσία ταυτότητας ή δεν βρέθηκε ταυτότητα για αυτό το πορτοφόλι. Δοκίμασε ξανά ή ξεκίνα mint.",
      failed: "Δεν ήταν δυνατή η επαλήθευση της ταυτότητας του πορτοφολιού. Δοκίμασε ξανά.",
    },
  },
};

export const JOIN_ROUTES = {
  en: {
    dashboard: "/dashboard",
    mint: "/mint-identity",
    networkCheck: "/education/network-check",
  },
  gr: {
    dashboard: "/dashboard-gr",
    mint: "/mint-identity-gr",
    networkCheck: "/education/network-check-gr",
  },
};
