export const LM08_CONTRACT_INSPECTION_COPY = {
  en: {
    title: "Inspect Your Deployed Contract",
    subtitle:
      "Review your Counter contract on Blockscout and confirm how the deployer wallet, deployment transaction, and contract address relate on Besu Edu-Net.",
    loading: "Loading inspection challenge…",
    signInRequired: "Sign in with your Web3Edu identity to start contract inspection.",
    notReadyTitle: "Inspection not ready yet",
    coding01Required:
      "Complete Coding Lab 01 and verify your Counter contract before contract inspection.",
    attributionRequired:
      "Verify deployment ownership in Coding Lab 01 before contract inspection. This links your deployer wallet to the creation transaction.",
    coding01Path: "/labs/coding-01/interaction",
    contractAddressLabel: "Deployed contract address",
    deployerAddressLabel: "Deployer wallet",
    deploymentTxLabel: "Deployment transaction",
    viewContract: "View contract in Blockscout",
    viewDeploymentTx: "View deployment transaction",
    flowHint:
      "Follow the chain of evidence: your deployer wallet signed the deployment transaction, which created your contract at its own address.",
    questionsTitle: "Inspection questions",
    submitAnswers: "Submit inspection answers",
    submitting: "Submitting…",
    incorrectTitle: "Not quite — review Blockscout and try again",
    incorrectHint:
      "Open the contract and deployment transaction links above. Compare addresses and what the deployment transaction created.",
    completedTitle: "Contract inspection complete",
    completedHint:
      "You identified the deployer wallet, deployment transaction role, and deployed contract address for your Counter on Besu Edu-Net.",
    completedAtLabel: "Completed",
    alreadyCompleted: "Contract inspection evidence is already recorded.",
    backToLabs: "Back to labs",
    labsPath: "/labs",
    questions: {
      contract_role: {
        prompt: "Which address is your deployed Counter contract?",
        options: {
          contract_address: "The deployed contract address shown above",
          deployer_address: "The deployer wallet address shown above",
          wallet_receive_only:
            "A wallet address that only receives EDU test tokens and did not deploy the contract",
        },
      },
      deployer_role: {
        prompt: "What does the From address of the deployment transaction represent?",
        options: {
          deployer_wallet: "The wallet that deployed (created) the contract",
          deployed_contract: "The deployed contract itself",
          block_validator: "A validator node that only included the transaction in a block",
        },
      },
      creation_tx_role: {
        prompt: "What is the relationship between the deployment transaction and your contract?",
        options: {
          created_contract: "It created the contract on Besu Edu-Net",
          read_state_only: "It only read the contract state without changing anything",
          source_verification:
            "It is the Blockscout source-verification operation (separate from deployment)",
        },
      },
    },
  },
  gr: {
    title: "Επιθεώρηση του Contract που Έκανες Deploy",
    subtitle:
      "Δες το Counter contract σου στο Blockscout και επιβεβαίωσε πώς σχετίζονται το deployer wallet, η συναλλαγή deployment και η διεύθυνση του contract στο Besu Edu-Net.",
    loading: "Φόρτωση inspection challenge…",
    signInRequired:
      "Συνδέσου με την Web3Edu ταυτότητά σου για να ξεκινήσεις την επιθεώρηση contract.",
    notReadyTitle: "Η επιθεώρηση δεν είναι ακόμη έτοιμη",
    coding01Required:
      "Ολοκλήρωσε το Coding Lab 01 και επαλήθευσε το Counter contract σου πριν την επιθεώρηση.",
    attributionRequired:
      "Επαλήθευσε την ιδιοκτησία deployment στο Coding Lab 01 πριν την επιθεώρηση. Αυτό συνδέει το deployer wallet σου με τη συναλλαγή δημιουργίας.",
    coding01Path: "/labs-gr/coding-01/interaction",
    contractAddressLabel: "Deployed contract address",
    deployerAddressLabel: "Deployer wallet",
    deploymentTxLabel: "Συναλλαγή deployment",
    viewContract: "Προβολή contract στο Blockscout",
    viewDeploymentTx: "Προβολή συναλλαγής deployment",
    flowHint:
      "Ακολούθησε την αλυσίδα αποδείξεων: το deployer wallet σου υπέγραψε τη συναλλαγή deployment, η οποία δημιούργησε το contract στη δική του διεύθυνση.",
    questionsTitle: "Ερωτήσεις επιθεώρησης",
    submitAnswers: "Υποβολή απαντήσεων επιθεώρησης",
    submitting: "Υποβολή…",
    incorrectTitle: "Όχι ακριβώς — δες ξανά το Blockscout",
    incorrectHint:
      "Άνοιξε τους συνδέσμους contract και deployment transaction παραπάνω. Σύγκρινε τις διευθύνσεις και τι δημιούργησε η συναλλαγή deployment.",
    completedTitle: "Η επιθεώρηση contract ολοκληρώθηκε",
    completedHint:
      "Εντόπισες το deployer wallet, τον ρόλο της συναλλαγής deployment και τη διεύθυνση του deployed Counter σου στο Besu Edu-Net.",
    completedAtLabel: "Ολοκληρώθηκε",
    alreadyCompleted: "Η απόδειξη επιθεώρησης contract έχει ήδη καταγραφεί.",
    backToLabs: "Επιστροφή στα εργαστήρια",
    labsPath: "/labs-gr",
    questions: {
      contract_role: {
        prompt: "Ποια διεύθυνση είναι το deployed Counter contract σου;",
        options: {
          contract_address: "Η deployed contract address που εμφανίζεται παραπάνω",
          deployer_address: "Η deployer wallet address που εμφανίζεται παραπάνω",
          wallet_receive_only:
            "Μια wallet address που λαμβάνει μόνο EDU test tokens και δεν έκανε deploy το contract",
        },
      },
      deployer_role: {
        prompt: "Τι αντιπροσωπεύει η διεύθυνση From της συναλλαγής deployment;",
        options: {
          deployer_wallet: "Το wallet που έκανε deploy (δημιούργησε) το contract",
          deployed_contract: "Το ίδιο το deployed contract",
          block_validator:
            "Ένας validator node που απλώς συμπεριέλαβε τη συναλλαγή σε block",
        },
      },
      creation_tx_role: {
        prompt:
          "Ποια είναι η σχέση μεταξύ της συναλλαγής deployment και του contract σου;",
        options: {
          created_contract: "Δημιούργησε το contract στο Besu Edu-Net",
          read_state_only:
            "Διάβασε μόνο την κατάσταση του contract χωρίς να αλλάξει κάτι",
          source_verification:
            "Είναι η λειτουργία επαλήθευσης πηγαίου κώδικα στο Blockscout (ξεχωριστή από το deployment)",
        },
      },
    },
  },
};
