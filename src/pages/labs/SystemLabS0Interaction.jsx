import { useEffect, useState } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const INITIAL_STATE = {
    currentStep: 0,
    selected: null,
    stepCompleted: {
        s1: false,
        s2: false,
        s3: false,
        s4: false,
        s5: false,
    },
    explanationOk: null,
    feedback: "",
};

const CONTENT = {
    en: {
        title: "System Lab S0 Interaction",
        intro:
            "Explore the Byzantine Generals Problem and see why distributed systems need explicit consensus rules before they can agree safely.",
        steps: [
            "Why agreement matters",
            "When messages are consistent",
            "When a traitor appears",
            "Why local views diverge",
            "Why consensus is needed",
        ],
        instructions: [
            "Start with the coordination problem itself: a system fails if honest participants do not act together.",
            "Check the easy case first. When everyone receives the same message, agreement is possible.",
            "Introduce a malicious actor who sends conflicting messages and observe how shared certainty breaks down.",
            "Compare two honest participants who now see different evidence and ask whether certainty is still possible.",
            "Finish by explaining why consensus protocols exist and what problem they solve.",
        ],
        backHref: "/#/labs/system/s0",
        backLabel: "⬅ Return to Lab Overview",
        resetLabel: "🔁 Reset Lab",
        allStepsCompleted: "All steps completed",
        discoveredTitle: "Evidence Collected",
        discoveredEmpty: "No evidence yet — complete the steps above.",
        discovered: {
            s1: "Coordinated systems need participants to reach the same decision.",
            s2: "Agreement is easy only when honest participants receive consistent information.",
            s3: "A malicious participant can create conflicting local views by sending different messages.",
            s4: "Honest participants may still disagree because they do not all see the same reality.",
            s5: "Consensus protocols exist to recover reliable agreement despite faults or malicious behavior.",
        },
        whatThisShowsTitle: "What This Lab Shows",
        whatThisShowsBullets: [
            "Distributed systems do not need consensus because coordination is convenient. They need it because honest participants can receive different information.",
            "The Byzantine Generals Problem shows that unreliable communication and malicious actors can break naive majority reasoning.",
            "Local certainty is not enough. A system needs shared rules for deciding what counts as a valid common outcome.",
            "Blockchain consensus mechanisms are built to solve this exact class of agreement problem.",
        ],
        finalReflectionTitle: "Final Reflection",
        finalReflectionQuestion:
            "Why isn't it enough for each honest participant to make the best decision from their own local information?",
        finalReflectionHint:
            "Think about what happens when different honest participants receive different messages.",
        finalReflectionAnswer:
            "Because local information may be inconsistent across the system. Honest participants can each reason correctly from their own perspective and still end up with conflicting decisions. Consensus protocols create shared rules so the system can converge on one reliable outcome.",
        completedLabel: "🎉 Lab Completed",
        completedDescription:
            "You completed System Lab S0 and identified why blockchain systems need consensus before they can safely coordinate.",
        onboardingTitle: "0. The Problem",
        onboardingIntro:
            "Imagine multiple nodes in a distributed system must reach the same decision without fully trusting each other.",
        onboardingNodeBridge:
            "In this lab, each general represents a node in a distributed system.",
        onboardingRolesBridge:
            "This is the same problem blockchain networks face when nodes must agree on transactions.",
        onboardingStoryTitle: "The Byzantine Generals Story",
        onboardingStory:
            "Several generals surround a city. They can only coordinate by sending messengers. To succeed, they must all choose the same action at the same time: attack together or retreat together.",
        onboardingWhyHard:
            "The problem is not choosing an action in isolation. The problem is that some messages may be delayed, inconsistent, or intentionally deceptive, so each general may end up with a different local picture of reality.",
        onboardingProblemPrompt:
            "If different participants (generals) take different actions, what happens to the system?",
        onboardingOutcome:
            "If they agree, the system works. If they disagree, the system fails.",
        onboardingGoal:
            "👉 Goal: Understand why agreement becomes difficult when participants see different information.",
        onboardingRolesTitle: "What each general represents",
        onboardingRole1: "Each general is one participant in a distributed system.",
        onboardingRole2: "Messengers represent communication between participants.",
        onboardingRole3: "Attack or retreat represents a system-wide decision that only works if everyone converges on the same outcome.",
        agreementLabel: "Agreement",
        agreementOutcome: "System works",
        disagreementLabel: "Disagreement",
        disagreementOutcome: "System fails",
        continueLabel: "Continue",
        step1Hint:
            "Answer based on what each participant actually sees — not on global knowledge.",
        attackLabel: "Attack",
        retreatLabel: "Retreat",
        traitorBehaviorTitle: "Traitor behavior:",
        traitorBehaviorSummary: "Same sender → different messages",
        disagreementIndicator: "Honest participants now disagree",
        flowDifferentViews: "Different views",
        flowDisagreement: "Disagreement",
        flowConsensusRules: "Consensus rules",
        flowAgreement: "Agreement",
        messagesAlignedTitle: "Shared Message View",
        messagesBrokenTitle: "Conflicting Message View",
        localViewTitle: "Local View Comparison",
        localViewSummary:
            "Notice that each honest general can reason correctly from their own evidence and still end up with a different conclusion.",
        step1: {
            title: "1. Why agreement matters",
            prompt:
                "If different generals choose different actions, what happens?",
            options: [
                {
                    id: "a",
                    label: "Nothing important",
                    feedback: "Think again — if generals split between attacking and retreating, the attack is undersized and fails. Coordination isn't optional here.",
                },
                {
                    id: "b",
                    label: "They succeed anyway",
                    feedback: "Not quite — individual effort doesn't substitute for coordination. A partial attack against a defended city fails regardless of intent.",
                },
                {
                    id: "c",
                    label: "They fail because they are not coordinated",
                    correct: true,
                    success:
                        "Correct. Coordinated action requires agreement, not just individual effort.",
                },
            ],
            retry: "Try again — focus on coordination, not individual intent.",
        },
        step2: {
            title: "2. Honest messages",
            prompt:
                "All generals send the same message (Attack). Can they safely agree?",
            options: [
                {
                    id: "yes",
                    label: "Yes",
                    correct: true,
                    success:
                        "Correct. When everyone receives consistent information, agreement is straightforward.",
                },
                {
                    id: "no",
                    label: "No",
                    feedback: "In this scenario every general receives the exact same 'Attack' message — no conflicting views exist, so agreement is straightforward.",
                },
            ],
            retry:
                "Try again — in this case, everyone sees the same signal.",
        },
        step3: {
            title: "3. A traitor appears",
            prompt:
                "One general sends conflicting messages to different participants. Do all generals still receive the same information?",
            options: [
                {
                    id: "yes",
                    label: "Yes",
                    feedback: "Look at the arrows — the traitor sends 'Attack' to Gen. B but 'Retreat' to Gen. C. They each see a different message from the same sender.",
                },
                {
                    id: "no",
                    label: "No",
                    correct: true,
                    success:
                        "Correct. Conflicting messages create different local views of reality.",
                },
            ],
            retry:
                "Try again — the key issue is that the traitor sends different messages to different people.",
            callout:
                "A malicious participant does not have to stop communication entirely. It is enough to make honest participants disagree about what they saw.",
        },
        step4: {
            title: "4. Different local views",
            prompt:
                "Two honest generals receive different information. Can they reach the same decision with certainty?",
            options: [
                {
                    id: "yes",
                    label: "Yes",
                    feedback: "Check the scenario — General A and General B hold different evidence. Reasoning correctly from different premises leads to different conclusions, not agreement.",
                },
                {
                    id: "no",
                    label: "No",
                    correct: true,
                    success:
                        "Correct. Honest participants can still diverge if the information they receive is inconsistent.",
                },
            ],
            retry:
                "Try again — if the evidence differs, certainty also breaks down.",
            viewA: "General A sees:",
            viewB: "General B sees:",
        },
        step5: {
            title: "5. Why consensus is needed",
            prompt:
                "Which statement best explains why consensus protocols exist?",
            explanationOptions: [
                {
                    id: "fast",
                    label: "To make systems faster",
                    feedback: "Speed is a side concern. Consensus protocols exist because honest participants can receive different information and still disagree — making the system faster does not fix that.",
                    correct: false,
                },
                {
                    id: "correct",
                    label: "To ensure agreement despite faulty or malicious participants",
                    feedback: "Exactly. Consensus protocols create shared rules so the system can converge on one reliable outcome even when some participants are faulty or adversarial.",
                    correct: true,
                },
                {
                    id: "traffic",
                    label: "To reduce traffic",
                    feedback: "Traffic reduction is an engineering optimization, not the reason consensus exists. The core problem is conflicting local views across honest participants, not bandwidth.",
                    correct: false,
                },
            ],
            confirm: "Confirm",
            followup:
                "Next, the later system labs show how blockchains solve this coordination problem using chain structure, execution rules, and consensus mechanisms.",
        },
    },
    gr: {
        title: "System Lab S0 Interaction",
        intro:
            "Εξερεύνησε το πρόβλημα των Βυζαντινών Στρατηγών και δες γιατί τα κατανεμημένα συστήματα χρειάζονται ρητούς κανόνες συναίνεσης για να συμφωνούν με ασφάλεια.",
        steps: [
            "Γιατί η συμφωνία έχει σημασία",
            "Όταν τα μηνύματα είναι συνεπή",
            "Όταν εμφανίζεται προδότης",
            "Γιατί αποκλίνουν οι τοπικές οπτικές",
            "Γιατί χρειάζεται συναίνεση",
        ],
        instructions: [
            "Ξεκίνα από το ίδιο το πρόβλημα συντονισμού: ένα σύστημα αποτυγχάνει όταν οι έντιμοι συμμετέχοντες δεν ενεργούν μαζί.",
            "Έλεγξε πρώτα την εύκολη περίπτωση. Όταν όλοι λαμβάνουν το ίδιο μήνυμα, η συμφωνία είναι εφικτή.",
            "Εισήγαγε έναν κακόβουλο συμμετέχοντα που στέλνει αντικρουόμενα μηνύματα και παρατήρησε πώς χάνεται η κοινή βεβαιότητα.",
            "Σύγκρινε δύο έντιμους συμμετέχοντες που βλέπουν πλέον διαφορετικά δεδομένα και αναρωτήσου αν η βεβαιότητα είναι ακόμη δυνατή.",
            "Ολοκλήρωσε εξηγώντας γιατί υπάρχουν οι μηχανισμοί συναίνεσης και ποιο πρόβλημα λύνουν.",
        ],
        backHref: "/#/labs-gr/system/s0",
        backLabel: "⬅ Επιστροφή στην Επισκόπηση Lab",
        resetLabel: "🔁 Επαναφορά Lab",
        allStepsCompleted: "Όλα τα βήματα ολοκληρώθηκαν",
        discoveredTitle: "Αποδείξεις που Συλλέχθηκαν",
        discoveredEmpty: "Δεν υπάρχουν ακόμη ευρήματα — ολοκλήρωσε τα παραπάνω βήματα.",
        discovered: {
            s1: "Τα συντονισμένα συστήματα χρειάζονται συμμετέχοντες που να καταλήγουν στην ίδια απόφαση.",
            s2: "Η συμφωνία είναι εύκολη μόνο όταν οι έντιμοι συμμετέχοντες λαμβάνουν συνεπείς πληροφορίες.",
            s3: "Ένας κακόβουλος συμμετέχων μπορεί να δημιουργήσει αντικρουόμενες τοπικές οπτικές στέλνοντας διαφορετικά μηνύματα.",
            s4: "Ακόμη και οι έντιμοι συμμετέχοντες μπορεί να διαφωνούν επειδή δεν βλέπουν όλοι την ίδια πραγματικότητα.",
            s5: "Οι μηχανισμοί συναίνεσης υπάρχουν για να αποκαθιστούν αξιόπιστη συμφωνία παρά τα σφάλματα ή την κακόβουλη συμπεριφορά.",
        },
        whatThisShowsTitle: "Τι Δείχνει Αυτό το Lab",
        whatThisShowsBullets: [
            "Τα κατανεμημένα συστήματα δεν χρειάζονται συναίνεση επειδή ο συντονισμός είναι απλώς χρήσιμος. Τη χρειάζονται επειδή ακόμη και οι έντιμοι συμμετέχοντες μπορεί να λαμβάνουν διαφορετικές πληροφορίες.",
            "Το πρόβλημα των Βυζαντινών Στρατηγών δείχνει ότι η αναξιόπιστη επικοινωνία και οι κακόβουλοι συμμετέχοντες μπορούν να καταρρίψουν την αφελή λογική πλειοψηφίας.",
            "Η τοπική βεβαιότητα δεν αρκεί. Το σύστημα χρειάζεται κοινά κριτήρια για το τι θεωρείται έγκυρο κοινό αποτέλεσμα.",
            "Οι μηχανισμοί συναίνεσης των blockchain είναι σχεδιασμένοι ακριβώς για να λύνουν αυτό το πρόβλημα συμφωνίας.",
        ],
        finalReflectionTitle: "Τελικός Αναστοχασμός",
        finalReflectionQuestion:
            "Γιατί δεν αρκεί κάθε έντιμος συμμετέχων να πάρει την καλύτερη δυνατή απόφαση με βάση τις δικές του τοπικές πληροφορίες;",
        finalReflectionHint:
            "Σκέψου τι συμβαίνει όταν διαφορετικοί έντιμοι συμμετέχοντες λαμβάνουν διαφορετικά μηνύματα.",
        finalReflectionAnswer:
            "Επειδή οι τοπικές πληροφορίες μπορεί να είναι ασυνεπείς σε όλο το σύστημα. Οι έντιμοι συμμετέχοντες μπορούν να σκεφτούν σωστά από τη δική τους οπτική και παρ' όλα αυτά να καταλήξουν σε αντικρουόμενες αποφάσεις. Οι μηχανισμοί συναίνεσης εισάγουν κοινούς κανόνες ώστε το σύστημα να συγκλίνει σε ένα αξιόπιστο αποτέλεσμα.",
        completedLabel: "🎉 Ολοκλήρωση Lab",
        completedDescription:
            "Ολοκλήρωσες το System Lab S0 και εντόπισες γιατί τα blockchain χρειάζονται συναίνεση πριν μπορέσουν να συντονιστούν με ασφάλεια.",
        onboardingTitle: "0. Το Πρόβλημα",
        onboardingIntro:
            "Φαντάσου ότι πολλοί κόμβοι σε ένα κατανεμημένο σύστημα πρέπει να πάρουν την ίδια απόφαση χωρίς να εμπιστεύονται πλήρως ο ένας τον άλλον.",
        onboardingNodeBridge:
            "Σε αυτό το lab, κάθε στρατηγός αντιστοιχεί σε έναν κόμβο ενός κατανεμημένου συστήματος.",
        onboardingRolesBridge:
            "Αυτό είναι το ίδιο πρόβλημα που αντιμετωπίζουν τα blockchain όταν οι κόμβοι πρέπει να συμφωνήσουν στις συναλλαγές.",
        onboardingStoryTitle: "Η Ιστορία των Βυζαντινών Στρατηγών",
        onboardingStory:
            "Πολλοί στρατηγοί έχουν περικυκλώσει μια πόλη. Μπορούν να συντονιστούν μόνο στέλνοντας αγγελιοφόρους. Για να πετύχουν, πρέπει όλοι να επιλέξουν την ίδια ενέργεια την ίδια στιγμή: είτε να επιτεθούν μαζί είτε να υποχωρήσουν μαζί.",
        onboardingWhyHard:
            "Το πρόβλημα δεν είναι να διαλέξει κανείς μόνος του μια ενέργεια. Το πρόβλημα είναι ότι κάποια μηνύματα μπορεί να καθυστερούν, να είναι ασυνεπή ή και σκόπιμα παραπλανητικά, οπότε κάθε στρατηγός μπορεί να σχηματίσει διαφορετική τοπική εικόνα της πραγματικότητας.",
        onboardingProblemPrompt:
            "Αν διαφορετικοί συμμετέχοντες (στρατηγοί) επιλέξουν διαφορετικές ενέργειες, τι συμβαίνει στο σύστημα;",
        onboardingOutcome:
            "Αν όλοι συμφωνήσουν, το σύστημα λειτουργεί. Αν διαφωνήσουν, το σύστημα αποτυγχάνει.",
        onboardingGoal:
            "👉 Στόχος: Να καταλάβεις γιατί η συμφωνία είναι δύσκολη όταν οι συμμετέχοντες βλέπουν διαφορετικές πληροφορίες.",
        onboardingRolesTitle: "Τι αντιπροσωπεύει κάθε στρατηγός",
        onboardingRole1: "Κάθε στρατηγός είναι ένας συμμετέχων σε ένα κατανεμημένο σύστημα.",
        onboardingRole2: "Οι αγγελιοφόροι αντιπροσωπεύουν την επικοινωνία μεταξύ των συμμετεχόντων.",
        onboardingRole3: "Η επίθεση ή η υποχώρηση αντιστοιχεί σε μια απόφαση του συστήματος που λειτουργεί μόνο αν όλοι συγκλίνουν στο ίδιο αποτέλεσμα.",
        agreementLabel: "Συμφωνία",
        agreementOutcome: "Το σύστημα λειτουργεί",
        disagreementLabel: "Διαφωνία",
        disagreementOutcome: "Το σύστημα αποτυγχάνει",
        continueLabel: "Συνέχεια",
        step1Hint:
            "Απάντησε με βάση το τι βλέπει κάθε συμμετέχων, όχι με βάση τη συνολική γνώση.",
        attackLabel: "Επίθεση",
        retreatLabel: "Υποχώρηση",
        traitorBehaviorTitle: "Συμπεριφορά προδότη:",
        traitorBehaviorSummary: "Ο ίδιος αποστολέας → διαφορετικά μηνύματα",
        disagreementIndicator: "Οι έντιμοι συμμετέχοντες διαφωνούν πλέον",
        flowDifferentViews: "Διαφορετικές οπτικές",
        flowDisagreement: "Διαφωνία",
        flowConsensusRules: "Κανόνες συναίνεσης",
        flowAgreement: "Συμφωνία",
        messagesAlignedTitle: "Κοινή Εικόνα Μηνυμάτων",
        messagesBrokenTitle: "Αντικρουόμενη Εικόνα Μηνυμάτων",
        localViewTitle: "Σύγκριση Τοπικών Οπτικών",
        localViewSummary:
            "Παρατήρησε ότι κάθε έντιμος στρατηγός μπορεί να σκεφτεί σωστά με βάση τα δικά του δεδομένα και παρ’ όλα αυτά να καταλήξει σε διαφορετικό συμπέρασμα.",
        step1: {
            title: "1. Γιατί η συμφωνία έχει σημασία",
            prompt:
                "Αν διαφορετικοί στρατηγοί επιλέξουν διαφορετικές ενέργειες, τι συμβαίνει;",
            options: [
                {
                    id: "a",
                    label: "Τίποτα σημαντικό",
                    feedback: "Σκέψου ξανά — αν οι στρατηγοί χωριστούν ανάμεσα σε επίθεση και υποχώρηση, η επίθεση είναι ανεπαρκής και αποτυγχάνει. Ο συντονισμός δεν είναι προαιρετικός.",
                },
                {
                    id: "b",
                    label: "Θα πετύχουν έτσι κι αλλιώς",
                    feedback: "Όχι ακριβώς — η ατομική προσπάθεια δεν αντικαθιστά τον συντονισμό. Μια μερική επίθεση σε οχυρωμένη πόλη αποτυγχάνει ανεξάρτητα από την πρόθεση.",
                },
                {
                    id: "c",
                    label: "Αποτυγχάνουν επειδή δεν είναι συντονισμένοι",
                    correct: true,
                    success:
                        "Σωστά. Η συντονισμένη δράση απαιτεί συμφωνία, όχι απλώς ατομική προσπάθεια.",
                },
            ],
            retry:
                "Δοκίμασε ξανά — εστίασε στον συντονισμό, όχι μόνο στην ατομική πρόθεση.",
        },
        step2: {
            title: "2. Συνεπή μηνύματα",
            prompt:
                "Όλοι οι στρατηγοί στέλνουν το ίδιο μήνυμα (Επίθεση). Μπορούν να συμφωνήσουν με ασφάλεια;",
            options: [
                {
                    id: "yes",
                    label: "Ναι",
                    correct: true,
                    success:
                        "Σωστά. Όταν όλοι λαμβάνουν συνεπείς πληροφορίες, η συμφωνία είναι άμεση.",
                },
                {
                    id: "no",
                    label: "Όχι",
                    feedback: "Σε αυτό το σενάριο κάθε στρατηγός λαμβάνει ακριβώς το ίδιο μήνυμα «Επίθεση» — δεν υπάρχουν αντικρουόμενες οπτικές, οπότε η συμφωνία είναι εύθετη.",
                },
            ],
            retry:
                "Δοκίμασε ξανά — σε αυτή την περίπτωση όλοι βλέπουν το ίδιο σήμα.",
        },
        step3: {
            title: "3. Εμφανίζεται προδότης",
            prompt:
                "Ένας στρατηγός στέλνει αντικρουόμενα μηνύματα σε διαφορετικούς συμμετέχοντες. Λαμβάνουν όλοι πια την ίδια πληροφορία;",
            options: [
                {
                    id: "yes",
                    label: "Ναι",
                    feedback: "Κοίτα τα βέλη — ο προδότης στέλνει «Επίθεση» στον Στρ. Β αλλά «Υποχώρηση» στον Στρ. Γ. Ο καθένας λαμβάνει διαφορετικό μήνυμα από τον ίδιο αποστολέα.",
                },
                {
                    id: "no",
                    label: "Όχι",
                    correct: true,
                    success:
                        "Σωστά. Τα αντικρουόμενα μηνύματα δημιουργούν διαφορετικές τοπικές οπτικές της πραγματικότητας.",
                },
            ],
            retry:
                "Δοκίμασε ξανά — το κρίσιμο σημείο είναι ότι ο προδότης στέλνει διαφορετικά μηνύματα σε διαφορετικούς παραλήπτες.",
            callout:
                "Ένας κακόβουλος συμμετέχων δεν χρειάζεται να σταματήσει την επικοινωνία. Αρκεί να κάνει τους έντιμους συμμετέχοντες να διαφωνούν για το τι είδαν.",
        },
        step4: {
            title: "4. Διαφορετικές τοπικές οπτικές",
            prompt:
                "Δύο έντιμοι στρατηγοί λαμβάνουν διαφορετικές πληροφορίες. Μπορούν να καταλήξουν με βεβαιότητα στην ίδια απόφαση;",
            options: [
                {
                    id: "yes",
                    label: "Ναι",
                    feedback: "Έλεγξε το σενάριο — ο Στρατηγός Α και ο Στρατηγός Β διαθέτουν διαφορετικά δεδομένα. Το να σκεφτείς σωστά από διαφορετικές αφετηρίες οδηγεί σε διαφορετικά συμπεράσματα, όχι σε συμφωνία.",
                },
                {
                    id: "no",
                    label: "Όχι",
                    correct: true,
                    success:
                        "Σωστά. Οι έντιμοι συμμετέχοντες μπορεί να αποκλίνουν όταν τα δεδομένα που λαμβάνουν είναι ασυνεπή.",
                },
            ],
            retry:
                "Δοκίμασε ξανά — αν τα δεδομένα διαφέρουν, χάνεται και η βεβαιότητα.",
            viewA: "Ο Στρατηγός Α βλέπει:",
            viewB: "Ο Στρατηγός Β βλέπει:",
        },
        step5: {
            title: "5. Γιατί χρειάζεται συναίνεση",
            prompt:
                "Ποια πρόταση εξηγεί καλύτερα γιατί υπάρχουν οι μηχανισμοί συναίνεσης;",
            explanationOptions: [
                {
                    id: "fast",
                    label: "Για να κάνουν τα συστήματα πιο γρήγορα",
                    feedback: "Η ταχύτητα είναι δευτερεύον ζήτημα. Οι μηχανισμοί συναίνεσης υπάρχουν επειδή έντιμοι συμμετέχοντες μπορεί να λαμβάνουν διαφορετικές πληροφορίες — η ταχύτητα δεν λύνει αυτό.",
                    correct: false,
                },
                {
                    id: "correct",
                    label: "Για να εξασφαλίζουν συμφωνία παρά τα σφάλματα ή τους κακόβουλους συμμετέχοντες",
                    feedback: "Ακριβώς. Οι μηχανισμοί συναίνεσης εισάγουν κοινούς κανόνες ώστε το σύστημα να συγκλίνει σε ένα αξιόπιστο αποτέλεσμα ακόμα και όταν κάποιοι συμμετέχοντες είναι ελαττωματικοί ή κακόβουλοι.",
                    correct: true,
                },
                {
                    id: "traffic",
                    label: "Για να μειώνουν την κίνηση",
                    feedback: "Η μείωση κίνησης είναι βελτιστοποίηση, όχι ο λόγος ύπαρξης της συναίνεσης. Το πρόβλημα είναι οι αντικρουόμενες τοπικές οπτικές, όχι το bandwidth.",
                    correct: false,
                },
            ],
            confirm: "Επιβεβαίωση",
            followup:
                "Στη συνέχεια, τα επόμενα system labs δείχνουν πώς τα blockchain λύνουν αυτό το πρόβλημα συντονισμού με δομή αλυσίδας, κανόνες εκτέλεσης και μηχανισμούς συναίνεσης.",
        },
    },
};

function StepCard({
    title,
    prompt,
    options,
    onSelect,
    feedback,
    scenario,
    lang,
}) {
    return (
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40">
            <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{prompt}</p>

            {scenario ? (
                <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/60 p-4 text-xs text-slate-700 dark:text-slate-300">
                    {scenario}
                </div>
            ) : null}

            <div className="mt-4 space-y-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option)}
                        className="block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 py-3 text-left text-sm text-slate-900 dark:text-slate-100 transition hover:border-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-slate-900"
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {feedback ? (
                <div className={`mt-4 text-sm ${feedback.type === "success" ? "text-green-500" : "text-red-400"}`}>
                    {feedback.message}
                </div>
            ) : null}
        </section>
    );
}

function GeneralNode({ label, tone = "slate" }) {
    const tones = {
        slate: "border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100",
        green: "border-green-400/50 bg-green-500/10 text-green-700 dark:text-green-300",
        red: "border-red-400 bg-red-500/20 text-red-300",
        indigo: "border-indigo-400/50 bg-indigo-500/10 text-indigo-200",
    };

    return (
        <div className={`rounded-full border px-3 py-2 text-xs font-semibold ${tones[tone]}`}>
            {label}
        </div>
    );
}

function MessageFlow({ title, nodes, arrows }) {
    return (
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/50 p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {nodes.map((node) => (
                    <GeneralNode key={node.label} label={node.label} tone={node.tone} />
                ))}
            </div>
            <div className="mt-4 space-y-2">
                {arrows.map((arrow, index) => (
                    <div
                        key={`${arrow.from}-${arrow.to}-${index}`}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${arrow.tone === "good"
                            ? "border-green-400/40 bg-green-500/10 text-green-700 dark:text-green-300"
                            : arrow.tone === "bad"
                                ? "border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-300"
                                : "border-indigo-400/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                            }`}
                    >
                        <span>{arrow.from}</span>
                        <span>{arrow.label}</span>
                        <span>{arrow.to}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function SystemLabS0Interaction({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = copy.steps;
    const currentIndex = state.currentStep === 0 ? -1 : Math.min(state.currentStep - 1, steps.length - 1);
    const isComplete = state.explanationOk === true;
    const stepCompletion = steps.map((_, index) => {
        if (isComplete) return true;
        return state.currentStep > 0 && index + 1 < state.currentStep;
    });

    const card = "rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40";

    const advanceStep = (key, successMessage) => {
        setState((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
            selected: null,
            feedback: successMessage,
            stepCompleted: { ...prev.stepCompleted, [key]: true },
        }));
    };

    const setError = (message) => {
        setState((prev) => ({
            ...prev,
            feedback: message,
        }));
    };

    const handleReset = () => {
        setState(INITIAL_STATE);
    };

    const canReset = Object.values(state.stepCompleted).some(Boolean);

    const stepFeedback = state.feedback
        ? {
            type:
                (state.feedback?.toLowerCase().includes("correct") ||
                    state.feedback?.toLowerCase().includes("σωστά"))
                    ? "success"
                    : "error",
            message: state.feedback,
        }
        : null;

    // Reset feedback on step change
    useEffect(() => {
        setState(prev => ({ ...prev, feedback: "" }));
    }, [state.currentStep]);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [state.currentStep]);

    const scenario = (
        <>
            <div>{copy.step4.viewA}</div>
            <div>- B: <span className="text-green-500">{copy.attackLabel}</span></div>
            <div>- C: <span className="text-green-500">{copy.attackLabel}</span></div>
            <div>- D: <span className="text-red-400">{copy.retreatLabel}</span></div>
            <div className="mt-3">{copy.step4.viewB}</div>
            <div>- A: <span className="text-green-500">{copy.attackLabel}</span></div>
            <div>- C: <span className="text-green-500">{copy.attackLabel}</span></div>
            <div>- D: <span className="text-green-500">{copy.attackLabel}</span></div>
        </>
    );

    const alignedFlow = (
        <MessageFlow
            title={copy.messagesAlignedTitle}
            nodes={[
                { label: lang === "gr" ? "Στρ. Α" : "Gen. A", tone: "green" },
                { label: lang === "gr" ? "Στρ. Β" : "Gen. B", tone: "green" },
                { label: lang === "gr" ? "Στρ. Γ" : "Gen. C", tone: "green" },
                { label: lang === "gr" ? "Στρ. Δ" : "Gen. D", tone: "green" },
            ]}
            arrows={[
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Β" : "B", label: copy.attackLabel, tone: "good" },
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Γ" : "C", label: copy.attackLabel, tone: "good" },
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Δ" : "D", label: copy.attackLabel, tone: "good" },
            ]}
        />
    );

    const brokenFlow = (
        <MessageFlow
            title={copy.messagesBrokenTitle}
            nodes={[
                { label: lang === "gr" ? "Προδότης" : "Traitor", tone: "red" },
                { label: lang === "gr" ? "Στρ. Β" : "Gen. B", tone: "slate" },
                { label: lang === "gr" ? "Στρ. Γ" : "Gen. C", tone: "slate" },
                { label: lang === "gr" ? "Στρ. Δ" : "Gen. D", tone: "slate" },
            ]}
            arrows={[
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Β" : "B", label: copy.attackLabel, tone: "good" },
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Γ" : "C", label: copy.retreatLabel, tone: "bad" },
                { from: lang === "gr" ? "Α" : "A", to: lang === "gr" ? "Δ" : "D", label: copy.attackLabel, tone: "good" },
            ]}
        />
    );

    const onStepChoice = (stepKey, option, retry) => {
        if (option.correct) {
            advanceStep(stepKey, option.success);
            return;
        }
        setError(option.feedback || retry);
    };

    const confirmFinalStep = () => {
        if (state.selected !== "correct") {
            setState((prev) => ({
                ...prev,
                feedback:
                    lang === "gr"
                        ? "Δοκίμασε ξανά — σκέψου γιατί οι έντιμοι συμμετέχοντες μπορεί να διαφωνούν."
                        : "Try again — think about why honest participants may disagree.",
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            explanationOk: true,
            currentStep: 6,
            stepCompleted: { ...prev.stepCompleted, s5: true },
            feedback: "",
        }));
    };

    return (
        <PageShell>
            <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
                <section className={card}>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {copy.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
                        {copy.intro}
                    </p>
                </section>

                <section className={card.replace("p-6", "p-5")}>
                    <div className="mb-3 text-xs text-slate-400">
                        {state.currentStep === 0
                            ? `0 / ${steps.length}`
                            : isComplete
                                ? `${steps.length} / ${steps.length}`
                                : `${currentIndex + 1} / ${steps.length}`}
                    </div>

                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-start gap-2 transition-all duration-200">
                                <div className={`mt-0.5 text-xs ${stepCompletion[index] ? "text-green-400" : index === currentIndex && !isComplete ? "text-blue-400" : "text-slate-500"}`}>
                                    {stepCompletion[index] ? "✔" : index === currentIndex && !isComplete ? "●" : "○"}
                                </div>
                                <div>
                                    <div className={`text-sm ${index === currentIndex && !isComplete ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400"}`}>
                                        {step}
                                    </div>
                                    {index === currentIndex && !isComplete ? (
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {copy.instructions[index]}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>

                    {isComplete ? (
                        <div className="mt-3 text-xs text-green-400">
                            ✔ {copy.allStepsCompleted}
                        </div>
                    ) : null}
                </section>

                {/* Step 0: Conceptual onboarding */}
                {state.currentStep === 0 ? (
                    <section className={card}>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            {copy.onboardingTitle}
                        </h2>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {copy.onboardingIntro}
                        </p>

                        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/50 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {copy.onboardingStoryTitle}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {copy.onboardingStory}
                            </p>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                {copy.onboardingWhyHard}
                            </p>
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {copy.onboardingNodeBridge}
                        </p>

                        <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/50 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {copy.onboardingRolesTitle}
                            </h3>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                                <li>{copy.onboardingRole1}</li>
                                <li>{copy.onboardingRole2}</li>
                                <li>{copy.onboardingRole3}</li>
                            </ul>
                            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                                {copy.onboardingRolesBridge}
                            </p>

                            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900/60 p-5 text-xs text-center">
                                <div className="text-slate-400 mb-4">
                                    {lang === "gr"
                                        ? "Οπτικοποίηση του συστήματος"
                                        : "System visualization"}
                                </div>

                                {/* 4-node mesh layout */}
                                <div className="flex flex-col items-center gap-3">
                                    {/* Top row: A and B */}
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="px-3 py-2 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-200">
                                            {lang === "gr" ? "Κόμβος Α" : "Node A"}
                                        </div>
                                        <div className="text-slate-400 text-xs">msg ↔</div>
                                        <div className="px-3 py-2 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-200">
                                            {lang === "gr" ? "Κόμβος Β" : "Node B"}
                                        </div>
                                    </div>
                                    {/* Cross connections */}
                                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                                        <span>msg ↕</span>
                                        <span className="mx-10">↘︎↗︎</span>
                                        <span>msg ↕</span>
                                    </div>
                                    {/* Bottom row: C and D */}
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="px-3 py-2 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-200">
                                            {lang === "gr" ? "Κόμβος Γ" : "Node C"}
                                        </div>
                                        <div className="text-slate-400 text-xs">msg ↔</div>
                                        <div className="px-3 py-2 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-200">
                                            {lang === "gr" ? "Κόμβος Δ" : "Node D"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-xs text-amber-400">
                                    {lang === "gr"
                                        ? "⚠ Κάποιοι κόμβοι μπορεί να στείλουν διαφορετικά μηνύματα"
                                        : "⚠ Some nodes may send different messages"}
                                </div>

                                <div className="mt-4 text-slate-400">
                                    {lang === "gr"
                                        ? "Κάθε κόμβος επικοινωνεί με πολλούς άλλους και πρέπει να συμφωνήσουν στην ίδια απόφαση"
                                        : "Each node communicates with multiple peers and all must agree on the same decision"}
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {copy.onboardingProblemPrompt}
                        </p>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {copy.onboardingOutcome}
                        </p>

                        <div className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm">
                            {copy.onboardingGoal}
                        </div>

                        {/* Agreement vs Disagreement visual */}
                        <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm">
                            <div className="p-4 rounded-xl border bg-green-500/10 border-green-500/30">
                                <div className="text-lg">✅</div>
                                <div className="font-semibold">{copy.agreementLabel}</div>
                                <div className="text-xs text-slate-400 mt-1">{copy.agreementOutcome}</div>
                            </div>
                            <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30">
                                <div className="text-lg">❌</div>
                                <div className="font-semibold">{copy.disagreementLabel}</div>
                                <div className="text-xs text-slate-400 mt-1">{copy.disagreementOutcome}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, currentStep: 1 }))}
                            className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white"
                        >
                            {copy.continueLabel}
                        </button>
                    </section>
                ) : null}

                {state.currentStep === 1 ? (
                    <StepCard
                        title={copy.step1.title}
                        prompt={copy.step1.prompt}
                        options={copy.step1.options}
                        onSelect={(option) => onStepChoice("s1", option, copy.step1.retry)}
                        feedback={stepFeedback}
                        scenario={copy.step1Hint}
                        lang={lang}
                    />
                ) : null}

                {state.currentStep === 2 ? (
                    <>
                        <StepCard
                            title={copy.step2.title}
                            prompt={copy.step2.prompt}
                            options={copy.step2.options}
                            onSelect={(option) => onStepChoice("s2", option, copy.step2.retry)}
                            feedback={stepFeedback}
                            lang={lang}
                        />
                        {alignedFlow}
                    </>
                ) : null}

                {state.currentStep === 3 ? (
                    <>
                        <StepCard
                            title={copy.step3.title}
                            prompt={copy.step3.prompt}
                            options={copy.step3.options}
                            onSelect={(option) => onStepChoice("s3", option, copy.step3.retry)}
                            feedback={stepFeedback}
                            lang={lang}
                        />
                        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                            {copy.step3.callout}
                        </div>
                        {brokenFlow}
                        {/* Traitor behavior visual */}
                        <div className="text-xs bg-slate-900/60 border border-slate-700 p-3 rounded">
                            <div className="mb-2 text-slate-400">{copy.traitorBehaviorTitle}</div>
                            <div>A → B: <span className="text-green-400">{copy.attackLabel}</span></div>
                            <div>A → C: <span className="text-red-400">{copy.retreatLabel}</span></div>
                            <div className="mt-2 text-slate-500">
                                {copy.traitorBehaviorSummary}
                            </div>
                        </div>
                    </>
                ) : null}

                {state.currentStep === 4 ? (
                    <>
                        <StepCard
                            title={copy.step4.title}
                            prompt={copy.step4.prompt}
                            options={copy.step4.options}
                            onSelect={(option) => onStepChoice("s4", option, copy.step4.retry)}
                            feedback={stepFeedback}
                            scenario={scenario}
                            lang={lang}
                        />
                        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/50 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {copy.localViewTitle}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                {copy.localViewSummary}
                            </p>
                        </section>
                        {/* Disagreement indicator */}
                        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                            ⚠ {copy.disagreementIndicator}
                        </div>
                    </>
                ) : null}

                {state.currentStep === 5 && !isComplete ? (
                    <section className={card}>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            {copy.step5.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {copy.step5.prompt}
                        </p>

                        {/* Consensus flow visual */}
                        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-center flex-wrap">
                            <div className="px-3 py-2 rounded border bg-slate-800">{copy.flowDifferentViews}</div>
                            <div>→</div>
                            <div className="px-3 py-2 rounded border bg-slate-800">{copy.flowDisagreement}</div>
                            <div>→</div>
                            <div className="px-3 py-2 rounded border bg-indigo-500/20 border-indigo-400">
                                {copy.flowConsensusRules}
                            </div>
                            <div>→</div>
                            <div className="px-3 py-2 rounded border bg-green-500/20">
                                {copy.flowAgreement}
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            {copy.step5.explanationOptions.map((option) => {
                                const isSelected = state.selected === option.id;
                                return (
                                    <div key={option.id}>
                                        <button
                                            onClick={() => setState((prev) => ({ ...prev, selected: option.id, feedback: "" }))}
                                            className={`block w-full rounded-xl border px-4 py-3 text-left transition ${isSelected
                                                ? option.correct
                                                    ? "border-green-400/60 bg-green-500/10 text-green-700 dark:text-green-300"
                                                    : "border-amber-400/60 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 hover:border-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-slate-900"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                        {isSelected && (
                                            <p className={`mt-1 px-1 text-xs ${option.correct ? "text-green-500" : "text-amber-400"}`}>
                                                {option.feedback}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={confirmFinalStep}
                            disabled={!state.selected}
                            className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white transition ${state.selected
                                ? "bg-indigo-600 hover:bg-indigo-500"
                                : "bg-slate-500 cursor-not-allowed"
                                }`}
                        >
                            {copy.step5.confirm}
                        </button>
                    </section>
                ) : null}

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.discoveredTitle}
                    </h2>
                    {Object.values(state.stepCompleted).some(Boolean) ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                            {state.stepCompleted.s1 ? <li>{copy.discovered.s1}</li> : null}
                            {state.stepCompleted.s2 ? <li>{copy.discovered.s2}</li> : null}
                            {state.stepCompleted.s3 ? <li>{copy.discovered.s3}</li> : null}
                            {state.stepCompleted.s4 ? <li>{copy.discovered.s4}</li> : null}
                            {state.stepCompleted.s5 ? <li>{copy.discovered.s5}</li> : null}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            {copy.discoveredEmpty}
                        </p>
                    )}
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.whatThisShowsTitle}
                    </h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                        {copy.whatThisShowsBullets.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                {isComplete ? (
                    <>
                        <section className={card}>
                            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                                {copy.finalReflectionTitle}
                            </h2>
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                                {copy.finalReflectionQuestion}
                            </p>
                            <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
                                {copy.finalReflectionHint}
                            </p>
                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                {copy.finalReflectionAnswer}
                            </p>
                        </section>

                        <section className="rounded-xl border border-indigo-200 dark:border-indigo-700/50 bg-indigo-500/5 p-5 text-sm text-indigo-700 dark:text-indigo-300">
                            {copy.step5.followup}
                        </section>

                        <section className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                            <h2 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
                                {copy.completedLabel}
                            </h2>
                            <p className="mb-4 text-slate-700 dark:text-slate-200">
                                {copy.completedDescription}
                            </p>
                            <LabCompletionClaim
                                labId="system-s0"
                                language={lang}
                                backHref={copy.backHref}
                                backLabel={copy.backLabel}
                                labTitle={copy.title}
                            />
                        </section>
                    </>
                ) : null}

                <section className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
                    <a
                        href={copy.backHref}
                        className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                    >
                        {copy.backLabel}
                    </a>
                    <button
                        onClick={handleReset}
                        disabled={!canReset}
                        className={`text-sm text-slate-600 dark:text-slate-300 ${canReset ? "hover:underline" : "cursor-not-allowed opacity-50"}`}
                    >
                        {copy.resetLabel}
                    </button>
                </section>
            </div>
        </PageShell>
    );
}
