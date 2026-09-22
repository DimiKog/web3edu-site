/**
 * LM06 Interactive Chapter — Consensus & Block Inclusion (EN/GR).
 * Dense pedagogical content. No evidence / XP / ledger mutation.
 */

export const LM06_CHAPTER_COPY = {
  en: {
    title: "Consensus & Block Inclusion",
    subtitle:
      "How a PENDING transaction becomes part of an agreed blockchain state.",
    openingQuestion:
      "Your transaction is PENDING. What has to happen before the network can treat it as part of the blockchain?",
    lm05Bridge:
      "In LM05 you created and submitted a transaction. It entered the shared pool as PENDING. Now the network must decide whether it can become part of the shared state.",
    spineLabel: "Conceptual spine",
    spineSteps: [
      "PENDING",
      "CANDIDATE BLOCK",
      "VALIDATION",
      "AGREEMENT",
      "FINALIZATION",
      "STATE UPDATE",
    ],
    readingCallout:
      "Before continuing — Chapter 5, pp. 103–109 provides the theoretical foundation for distributed consensus, PoW and PoS.",
    readingOpenCta: "Open resource →",
    why: {
      heading: "WHY CONSENSUS?",
      body:
        "Different nodes must converge on one accepted blockchain state without relying on one central decision-maker. Participants may disagree, fail, or behave incorrectly — consensus protocols define how the network can still establish an accepted state.",
      imageAlt:
        "Diagram of distributed nodes converging toward one shared blockchain state through consensus.",
    },
    approaches: {
      heading: "Two approaches: Proof of Work and Proof of Stake",
      caveat:
        "PoS selection details vary by protocol — this is a conceptual comparison, not a claim that every PoS design works identically.",
      bridgeQuestion: "But what changes when the validators are already known?",
      pow: {
        title: "Proof of Work",
        points: [
          "Resource: computational work",
          "Block producer: miner",
          "Selection: successful work / protocol",
        ],
        body:
          "Participants compete through computational work. Successful work allows a candidate block to be proposed according to the protocol.",
        cta: "Explore with the PoW Simulator →",
      },
      pos: {
        title: "Proof of Stake",
        points: [
          "Resource: stake",
          "Block producer: validator",
          "Selection: protocol / stake mechanism",
        ],
        body:
          "Validators participate with stake. A protocol mechanism selects who may propose; the network then validates the candidate block.",
        cta: "Explore with the PoS Simulator →",
      },
    },
    knownValidators: {
      heading: "From open participation to known validators",
      bridgeQuestion: "But what changes when the validators are already known?",
      body:
        "Besu Edu-Net uses a known validator set with QBFT. A proposer suggests a candidate block; validators validate independently; sufficient agreement leads to deterministic finality in the conceptual model used here.",
      imageAlt:
        "Diagram of a known validator set: proposer, validator participation and agreement, then finality.",
      keyStatement: "The proposer does not decide alone.",
      scopeNote:
        "This is the conceptual consensus model — not the complete QBFT message protocol.",
      qbftNotInTextbook:
        "QBFT is Web3Edu content for Besu Edu-Net; it is not covered in the Chapter 5 textbook pages.",
    },
    yourTurn: {
      heading: "Now apply the model.",
      body:
        "Take the validator role and follow a PENDING transaction through validation, agreement, finalization, and state transition.",
      cta: "Start Consensus Activity →",
    },
    takeaway: {
      heading: "FINAL TAKEAWAY",
      inequalities: ["PENDING", "PROPOSED", "AGREED", "FINALIZED"],
      resultLead: "FINALIZED",
      resultMid: "+ SUCCESSFUL EXECUTION",
      resultEnd: "→ UPDATED SHARED STATE",
      body:
        "Creating or proposing a transaction does not by itself change the blockchain state. Agreement, finalization, and successful execution are separate steps.",
    },
    heroImageAlt:
      "LM06 visual: consensus and block inclusion from pending transaction to finalized shared state.",
  },
  gr: {
    title: "Συναίνεση & Συμπερίληψη σε Block",
    subtitle:
      "Πώς μια PENDING συναλλαγή γίνεται μέρος μιας συμφωνημένης κατάστασης blockchain.",
    openingQuestion:
      "Η συναλλαγή σου είναι PENDING. Τι πρέπει να συμβεί πριν το δίκτυο τη θεωρήσει μέρος του blockchain;",
    lm05Bridge:
      "Στο LM05 δημιούργησες και υπέβαλες μια συναλλαγή. Μπήκε στην κοινή δεξαμενή ως PENDING. Τώρα το δίκτυο πρέπει να αποφασίσει αν μπορεί να γίνει μέρος της κοινής κατάστασης.",
    spineLabel: "Εννοιολογική ροή",
    spineSteps: [
      "PENDING",
      "ΥΠΟΨΗΦΙΟ BLOCK",
      "ΕΠΙΚΥΡΩΣΗ",
      "ΣΥΜΦΩΝΙΑ",
      "ΟΡΙΣΤΙΚΟΠΟΙΗΣΗ",
      "ΕΝΗΜΕΡΩΣΗ ΚΑΤΑΣΤΑΣΗΣ",
    ],
    readingCallout:
      "Πριν συνεχίσεις — το Κεφάλαιο 5, σελ. 103–109 παρέχει το θεωρητικό υπόβαθρο για κατανεμημένη συναίνεση, PoW και PoS.",
    readingOpenCta: "Άνοιξε τον πόρο →",
    why: {
      heading: "ΓΙΑΤΙ ΣΥΝΑΙΝΕΣΗ;",
      body:
        "Διαφορετικοί κόμβοι πρέπει να συγκλίνουν σε μία αποδεκτή κατάσταση blockchain χωρίς κεντρικό αποφασίζοντα. Οι συμμετέχοντες μπορεί να διαφωνούν, να αποτυγχάνουν ή να συμπεριφέρονται λανθασμένα — τα πρωτόκολλα συναίνεσης ορίζουν πώς το δίκτυο μπορεί παρ’ όλα αυτά να καθιερώσει αποδεκτή κατάσταση.",
      imageAlt:
        "Διάγραμμα κατανεμημένων κόμβων που συγκλίνουν σε μία κοινή κατάσταση blockchain μέσω συναίνεσης.",
    },
    approaches: {
      heading: "Δύο προσεγγίσεις: Proof of Work και Proof of Stake",
      caveat:
        "Οι λεπτομέρειες επιλογής στο PoS διαφέρουν ανά πρωτόκολλο — αυτή είναι εννοιολογική σύγκριση, όχι ισχυρισμός ότι κάθε σχεδιασμός PoS λειτουργεί πανομοιότυπα.",
      bridgeQuestion: "Τι αλλάζει όμως όταν οι validators είναι ήδη γνωστοί;",
      pow: {
        title: "Proof of Work",
        points: [
          "Πόρος: υπολογιστική εργασία",
          "Παραγωγός block: miner",
          "Επιλογή: επιτυχής εργασία / πρωτόκολλο",
        ],
        body:
          "Οι συμμετέχοντες ανταγωνίζονται μέσω υπολογιστικής εργασίας. Η επιτυχής εργασία επιτρέπει την πρόταση υποψήφιου block σύμφωνα με το πρωτόκολλο.",
        cta: "Εξερεύνησε με τον προσομοιωτή PoW →",
      },
      pos: {
        title: "Proof of Stake",
        points: [
          "Πόρος: stake",
          "Παραγωγός block: validator",
          "Επιλογή: μηχανισμός πρωτοκόλλου / stake",
        ],
        body:
          "Οι validators συμμετέχουν με stake. Ένας μηχανισμός πρωτοκόλλου επιλέγει ποιος μπορεί να προτείνει· έπειτα το δίκτυο επικυρώνει το υποψήφιο block.",
        cta: "Εξερεύνησε με τον προσομοιωτή PoS →",
      },
    },
    knownValidators: {
      heading: "Από ανοιχτή συμμετοχή σε γνωστούς validators",
      bridgeQuestion: "Τι αλλάζει όμως όταν οι validators είναι ήδη γνωστοί;",
      body:
        "Το Besu Edu-Net χρησιμοποιεί γνωστό σύνολο validators με QBFT. Ένας proposer προτείνει υποψήφιο block· οι validators επικυρώνουν ανεξάρτητα· επαρκής συμφωνία οδηγεί σε ντετερμινιστική τελικότητα στο εννοιολογικό μοντέλο που χρησιμοποιούμε εδώ.",
      imageAlt:
        "Διάγραμμα γνωστού συνόλου validators: proposer, συμμετοχή και συμφωνία validators, έπειτα τελικότητα.",
      keyStatement: "Ο proposer δεν αποφασίζει μόνος του.",
      scopeNote:
        "Αυτό είναι το εννοιολογικό μοντέλο συναίνεσης — όχι το πλήρες πρωτόκολλο μηνυμάτων QBFT.",
      qbftNotInTextbook:
        "Το QBFT είναι περιεχόμενο Web3Edu για το Besu Edu-Net· δεν καλύπτεται στις σελίδες του Κεφαλαίου 5 του συγγράμματος.",
    },
    yourTurn: {
      heading: "Εφάρμοσε τώρα το μοντέλο.",
      body:
        "Πάρε τον ρόλο validator και ακολούθησε μια PENDING συναλλαγή μέσα από επικύρωση, συμφωνία, οριστικοποίηση και μετάβαση κατάστασης.",
      cta: "Έναρξη δραστηριότητας Consensus →",
    },
    takeaway: {
      heading: "ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ",
      inequalities: ["PENDING", "PROPOSED", "AGREED", "FINALIZED"],
      resultLead: "FINALIZED",
      resultMid: "+ ΕΠΙΤΥΧΗΣ ΕΚΤΕΛΕΣΗ",
      resultEnd: "→ ΕΝΗΜΕΡΩΜΕΝΗ ΚΟΙΝΗ ΚΑΤΑΣΤΑΣΗ",
      body:
        "Η δημιουργία ή η πρόταση μιας συναλλαγής δεν αλλάζει από μόνη της την κατάσταση του blockchain. Συμφωνία, οριστικοποίηση και επιτυχής εκτέλεση είναι ξεχωριστά βήματα.",
    },
    heroImageAlt:
      "Οπτικό LM06: συναίνεση και συμπερίληψη σε block από pending συναλλαγή σε οριστικοποιημένη κοινή κατάσταση.",
  },
};

/** Real Web3Edu tool routes (not invented). */
export const LM06_POW_SIMULATOR_HREF = {
  en: "/tools/mining",
  gr: "/tools-gr/mining",
};

export const LM06_POS_SIMULATOR_HREF = {
  en: "/tools/pos",
  gr: "/tools-gr/pos",
};

export const LM06_EDUCATIONAL_LEDGER_HREF = {
  en: "/learning-modules/lm06/educational-ledger",
  gr: "/learning-modules-gr/lm06/educational-ledger",
};

export function getLm06ChapterCopy(lang = "en") {
  return lang === "gr" ? LM06_CHAPTER_COPY.gr : LM06_CHAPTER_COPY.en;
}
