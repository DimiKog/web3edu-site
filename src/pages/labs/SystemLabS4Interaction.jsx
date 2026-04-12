import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "../../components/PageShell";
import LabCompletionClaim from "../../components/LabCompletionClaim.jsx";

const INITIAL_VOTES = { A: false, B: false, C: false, D: false };
const INITIAL_CHOICES = { A: null, B: null, C: null, D: null };
const INITIAL_DELAYS = { A: 350, B: 800, C: 1400, D: 2100 };
const MODE_ORDER = ["basic", "proposers", "faulty", "async"];

const CONTENT = {
    en: {
        title: "QBFT on Besu",
        intro:
            "This lab turns QBFT into a guided simulator on top of the Besu Edu-Net context. You start from the basic prepare -> commit flow, then progressively unlock harder scenarios: competing leaders proposing different blocks, faulty validators resisting alignment, and delayed message delivery in an asynchronous network. The goal is not only to click through phases, but to understand why prepare creates safe alignment, why commit creates finality, how QBFT tolerates limited Byzantine behavior, and why delayed or conflicting information makes agreement harder before the network converges again.",
        progressionIntro:
            "This simulator increases in complexity. Start with Basic mode and unlock advanced scenarios.",
        learningPathTitle: "Learning Path",
        modePrefix: "Mode",
        controlsTitle: "Inputs",
        processTitle: "Process",
        feedbackTitle: "System Feedback",
        nextModeCta: "Switch to {mode} Mode",
        asyncNetworkBadge: "Network: Delayed",
        networkStateLabel: "Network State",
        networkMessagesInTransit: "Messages in transit",
        networkMessagesDelivered: "Messages delivered",
        faultyConsensusMessage: "Consensus was reached despite faulty validators.",
        finalityEventStrong:
            "This block will not change unless validators violate the protocol.",
        modeUnlockTitle: "New behavior unlocked",
        modeUnlockItems: {
            proposers: "Competing leaders",
            faulty: "Fault tolerance",
            async: "Network delays",
        },
        modesTitle: "Modes",
        modeLabels: {
            basic: "Basic",
            proposers: "Conflicting Proposers",
            faulty: "Faulty Validators",
            async: "Async Network",
        },
        modeDescriptions: {
            basic: "Start with standard QBFT flow: validators align on a block and finalize it.",
            proposers: "Multiple leaders propose different blocks. Resolve the conflict.",
            faulty: "Some validators behave incorrectly. Maintain consensus despite faults.",
            async: "Votes arrive with delays. Consensus depends on eventual agreement.",
        },
        unlockPrevious: "Complete previous mode to unlock",
        masteredNext: {
            basic: "You have mastered Basic mode. Try Conflicting Proposers next.",
            proposers: "You have mastered Conflicting Proposers. Try Faulty Validators next.",
            faulty: "You have mastered Faulty Validators. Try Async Network next.",
            async: "You have completed every scenario in the simulator.",
        },
        modeContent: {
            basic: {
                steps: [
                    "Start round",
                    "Align validators",
                    "Reach finality",
                ],
                instructions: [
                    "Start the round. Notice that the validator set is already known and fixed before consensus begins.",
                    "In prepare, validators must converge on one proposal before the system can move safely toward finality.",
                    "In commit, validators lock the aligned proposal and produce deterministic finality.",
                ],
                stepHints: [
                    "Action required: start the round by proposing a block.",
                    "Action required: make validators align on the same block.",
                    "Action required: lock the aligned block during commit until finality is reached.",
                ],
            },
            proposers: {
                steps: [
                    "Observe competing proposals",
                    "Resolve leader conflict",
                    "Reach aligned proposal",
                    "Finalize",
                ],
                instructions: [
                    "Start the round and notice that two leaders may propose different blocks at the same height.",
                    "Guide validators toward one leader's proposal so the conflict is resolved safely.",
                    "Verify that quorum is reached on one shared proposal, not just on total votes.",
                    "Move to commit and finalize the aligned proposal.",
                ],
                stepHints: [
                    "Action required: start the round and inspect both leader proposals.",
                    "Action required: make enough validators support the SAME proposal so the leader conflict is resolved.",
                    "Action required: verify quorum exists on one proposal only.",
                    "Action required: finalize the proposal of the single aligned leader.",
                ],
            },
            faulty: {
                steps: [
                    "Identify faulty validators",
                    "Maintain alignment despite faults",
                    "Reach quorum",
                    "Finalize",
                ],
                instructions: [
                    "Start the round and identify which validator is faulty in this scenario.",
                    "Keep enough honest validators aligned on one proposal even when the faulty validator resists agreement.",
                    "Confirm that quorum can still be reached because too few validators are malicious.",
                    "Move to commit and finalize despite the fault.",
                ],
                stepHints: [
                    "Action required: observe the faulty validator marker before voting.",
                    "Action required: keep honest validators aligned on the same proposal.",
                    "Action required: reach quorum with the honest majority.",
                    "Action required: commit the aligned proposal into finality.",
                ],
            },
            async: {
                steps: [
                    "Observe delayed votes",
                    "Wait for message arrival",
                    "Achieve eventual alignment",
                    "Finalize",
                ],
                instructions: [
                    "Start the round and watch votes enter the network as delayed messages instead of instant updates.",
                    "Do not advance too early. Wait until validator messages arrive and the temporary inconsistency clears.",
                    "Observe that consensus depends on eventual alignment after delayed messages are delivered.",
                    "Move to commit and wait again until enough commit messages arrive for finality.",
                ],
                stepHints: [
                    "Action required: start the round and send votes into the delayed network.",
                    "Action required: wait for pending validator messages to arrive.",
                    "Action required: confirm eventual agreement once delayed votes are applied.",
                    "Action required: finalize only after enough commit messages have arrived.",
                ],
            },
        },
        backHref: "/#/labs/system/s4",
        backLabel: "⬅ Return to Lab Overview",
        allStepsCompleted: "All guided checks completed",
        completedLabel: "🎉 Lab Completed",
        completedDescription:
            "You completed System Lab S4 and reviewed how QBFT reaches finality on Besu Edu-Net.",
        bulletsTitle: "What To Retain",
        bullets: [
            "QBFT works with a known validator set rather than an open validator market.",
            "Prepare is about alignment: validators show they are converging on the same proposed block.",
            "Commit is about finality: validators lock that aligned block so the result cannot be changed.",
            "Finality is deterministic once the required commit agreement is reached.",
            "Permissioned consensus trades open participation for predictable coordination and fast settlement.",
        ],
        comparisonTitle: "PoS vs QBFT at a Glance",
        comparisonIntro:
            "Use this final comparison to connect the proof-of-stake logic from the previous system lab with the permissioned QBFT model you just explored here.",
        comparisonHeaders: {
            concept: "Concept",
            pos: "PoS",
            qbft: "QBFT (Besu)",
        },
        comparisonRows: [
            {
                concept: "Validator Set",
                pos: "Open (stake-based)",
                qbft: "Fixed / permissioned",
            },
            {
                concept: "Selection",
                pos: "Random (stake-weighted)",
                qbft: "Predefined / rotating leader",
            },
            {
                concept: "Fault Model",
                pos: "Economic (slashing)",
                qbft: "Byzantine (≤ 1/3 faulty)",
            },
            {
                concept: "Finality",
                pos: "Probabilistic + checkpoints",
                qbft: "Deterministic",
            },
            {
                concept: "Network Model",
                pos: "Eventually synchronous",
                qbft: "Partially synchronous",
            },
            {
                concept: "Trust Basis",
                pos: "Capital",
                qbft: "Known participants",
            },
        ],
        simulatorTitle: "QBFT Phase Progression",
        phaseStatusIdle: "Start the consensus round by proposing a block.",
        phaseStatusPrepare:
            "The proposer has already broadcast candidate blocks. In prepare, validators must align on one shared proposal before the system can move toward finality.",
        phaseStatusCommit:
            "Prepare has already established alignment on one proposal. In commit, validators lock that same proposal into finality.",
        startRound: "Start Round",
        nextToCommit: "Move to Commit",
        resetPhases: "Reset Round",
        phaseLabel: "Phase",
        approvalsLabel: "Approvals",
        quorumLabel: "Quorum",
        validatorLabel: "Validator",
        voteHintPrepare:
            "In prepare, validators are choosing which proposed block they are willing to align on.",
        voteHintCommit:
            "In commit, validators are no longer choosing between proposals. They are locking the aligned block.",
        moveBlockedPrepare:
            "Prepare quorum on one shared proposal is required before moving to commit.",
        moveBlockedCommit:
            "Commit quorum is required before the block can be finalized.",
        finalizedSuccess: "✔ Block finalized (commit quorum reached on the aligned proposal)",
        finalizedFailure:
            "✖ Block not finalized yet. More commit votes are required to reach quorum.",
        finalityEvent:
            "Finality achieved: this block is now permanently accepted. Reverting it would require validators to violate the protocol.",
        phaseTitle: "QBFT Phases",
        phaseColumn: "Phase",
        purposeColumn: "Purpose",
        prepareVoteLabel: "Prepare: align on one block",
        commitVoteLabel: "Commit: lock the aligned block",
        checkpointTitle: "Checkpoint",
        checkpointQuestion: "Why does QBFT need both prepare and commit?",
        checkpointOptions: [
            "Prepare aligns validators on one block, while commit locks that aligned block into finality.",
            "Prepare and commit are the same vote repeated twice for redundancy only.",
            "Prepare chooses the validator set, while commit chooses the proposer.",
            "Prepare is for mining competition, while commit is for transaction ordering.",
        ],
        checkpointCorrect:
            "Correct: prepare creates alignment on one proposal, and commit locks that same proposal into finality.",
        checkpointWrong:
            "Try again. Focus on the difference between alignment and finality.",
        checkpointLocked:
            "Finalize the block first, then answer the checkpoint.",
        checkpointReadyToClaim:
            "Checkpoint passed. You can now claim completion for this lab.",
        currentAction: "Current action",
        prePrepareCompleted: "pre-prepare completed automatically when the round starts",
        prepareLockedHint: "Prepare voting becomes active as soon as the round starts.",
        commitLockedHint: "Commit voting unlocks after prepare quorum is reached.",
        finalityReachedHint:
            "Commit quorum is already reached. The block is final now. Remaining validators may still add matching commit votes, but they are no longer required for finality.",
        prepareConceptTitle: "What prepare proves",
        prepareConceptBody:
            "Validators are not finalizing yet. They are proving they are aligned on the same proposed block so the network does not risk locking different blocks on different nodes.",
        commitConceptTitle: "What commit proves",
        commitConceptBody:
            "Validators are no longer deciding between alternatives. They are locking the already aligned block, which is what gives the round deterministic finality.",
        prepareWarning:
            "Without prepare, validators could try to finalize different blocks.",
        commitWarning:
            "Without commit, agreement exists but is not yet locked as final.",
        commitExtraVoteNote:
            "A validator who did not help form the quorum can still send a matching commit afterward. The key idea is that finality already happened once quorum was reached.",
        proposalTitle: "Proposed blocks",
        proposalHint:
            "Prepare is successful only when enough validators align on the same block.",
        conflictingProposalsIntro:
            "Different leaders may propose different blocks at the same height. That is normal in distributed systems, and QBFT must drive the network back to one shared proposal.",
        conflictingProposalsCause:
            "This can happen due to network delays, competing leaders, or faulty validators proposing different blocks at the same time.",
        proposalRule:
            "Validators must agree on the SAME block. Mixed votes do not create consensus.",
        blockA: "Block A",
        blockB: "Block B",
        proposedBy: "Proposed by",
        leaderProposal: "Leader {id} proposal",
        dualProposerMode: "Conflicting proposer scenario",
        dualProposerHint:
            "Simulate a round where two validators act as competing proposers and the network must resolve the conflict.",
        asyncModeLabel: "Async / Delayed network",
        asyncModeHint:
            "Simulate a network where validator messages arrive at different times instead of appearing instantly.",
        alignedProposal: "Aligned proposal",
        noAlignedProposal: "No aligned proposal yet",
        consensusAchievedOn: "Consensus achieved on",
        alignedOn: "Aligned on",
        commitTargetLabel: "Commit target",
        prepareQuorumReached: "Prepare quorum reached on this proposal.",
        prepareQuorumMissing: "No single proposal has enough prepare votes yet.",
        splitVoteWarning:
            "Validators are split across different blocks. Consensus cannot be reached until they align on one proposal.",
        networkSplitWarning: "Network is split across conflicting proposals.",
        multipleProposalsPreventFinality:
            "Multiple competing proposals prevent finality.",
        splitCorrection:
            "To proceed, you must make enough validators support the SAME proposal.",
        byzantineBridge:
            "This is the same challenge as the Byzantine problem: without enough agreement, the system cannot safely decide.",
        alignmentConfirmed:
            "All validators now agree on the same block.",
        conflictResolved:
            "Conflict resolved: the network converged on a single proposal.",
        maliciousConflictLink:
            "Faulty validators may support different proposers, increasing the likelihood of conflicting proposals.",
        validatorChoiceLabel: "Validator choice",
        commitClarifier:
            "Commit is not about choosing a block. It is about locking the agreed block so it cannot change.",
        prepareActionPrompt:
            "Choose Block A or Block B for each validator below. The goal is not to click randomly, but to make enough validators converge on the SAME proposal.",
        asyncPrepareHint:
            "Validators do not receive messages at the same time. Some votes may arrive later due to network delays.",
        asyncTimelineHint:
            "Votes arrive over time, not instantly.",
        asyncTemporarySplit:
            "The network appears inconsistent until all messages arrive.",
        asyncEventualAgreement:
            "Temporary disagreement does not mean failure. Consensus depends on eventual agreement.",
        pendingVoteLabel: "Pending",
        commitActionPrompt:
            "Now confirm the already aligned block. Commit votes do not pick a new proposal; they lock the aligned one into finality.",
        commitLeaderMessage:
            "Validators are committing to the proposal of a single leader.",
        commitIrreversible:
            "At this point, the network is no longer negotiating. It is making a final, irreversible decision.",
        pendingMessagesError:
            "Some validator messages have not arrived yet.",
        leaderMismatchError:
            "Commit stays locked until validators align on one proposal from a single leader.",
        faultyMinimumError:
            "Faulty mode must keep at least one faulty validator active.",
        commitLateVoteExplanation:
            "A validator like Validator D can still add a matching commit after quorum. That vote does not change the chosen block; it only confirms the same aligned block.",
        finalityBridge:
            "This is what solves the Byzantine-style safety problem from S0: once enough validators lock the same block, the network can decide safely.",
        proposerRotationHint:
            "In real QBFT, proposer roles rotate across rounds.",
    },
    gr: {
        title: "QBFT στο Besu",
        intro:
            "Αυτό το lab μετατρέπει το QBFT σε καθοδηγούμενο simulator πάνω στο πλαίσιο του Besu Edu-Net. Ξεκινάς από τη βασική ροή prepare -> commit και στη συνέχεια ξεκλειδώνεις πιο απαιτητικά σενάρια: ανταγωνιστικούς leaders που προτείνουν διαφορετικά blocks, faulty validators που αντιστέκονται στην ευθυγράμμιση και καθυστερημένη παράδοση μηνυμάτων σε ασύγχρονο δίκτυο. Ο στόχος δεν είναι απλώς να περάσεις τις φάσεις με clicks, αλλά να κατανοήσεις γιατί το prepare δημιουργεί ασφαλή alignment, γιατί το commit παράγει finality, πώς το QBFT ανέχεται περιορισμένη Byzantine συμπεριφορά και γιατί οι καθυστερήσεις ή οι συγκρούσεις πληροφορίας δυσκολεύουν τη συναίνεση μέχρι το δίκτυο να συγκλίνει ξανά.",
        progressionIntro:
            "Αυτός ο simulator αυξάνει σταδιακά την πολυπλοκότητα. Ξεκίνα με Basic mode και ξεκλείδωσε τα προχωρημένα σενάρια.",
        learningPathTitle: "Learning Path",
        modePrefix: "Mode",
        controlsTitle: "Είσοδοι",
        processTitle: "Ροή",
        feedbackTitle: "Κατάσταση Συστήματος",
        nextModeCta: "Μετάβαση σε {mode} Mode",
        asyncNetworkBadge: "Δίκτυο: Καθυστερημένο",
        networkStateLabel: "Κατάσταση Δικτύου",
        networkMessagesInTransit: "Μηνύματα σε μεταφορά",
        networkMessagesDelivered: "Τα μηνύματα παραδόθηκαν",
        faultyConsensusMessage: "Η συναίνεση επιτεύχθηκε παρά τους faulty validators.",
        finalityEventStrong:
            "Αυτό το block δεν θα αλλάξει εκτός αν οι validators παραβιάσουν το πρωτόκολλο.",
        modeUnlockTitle: "Ξεκλειδώθηκε νέα συμπεριφορά",
        modeUnlockItems: {
            proposers: "Ανταγωνιστικοί leaders",
            faulty: "Ανοχή σε faults",
            async: "Καθυστερήσεις δικτύου",
        },
        modesTitle: "Modes",
        modeLabels: {
            basic: "Basic",
            proposers: "Συγκρουόμενοι Proposers",
            faulty: "Faulty Validators",
            async: "Async Network",
        },
        modeDescriptions: {
            basic: "Ξεκίνα με τη βασική ροή QBFT: οι validators ευθυγραμμίζονται σε ένα block και το οριστικοποιούν.",
            proposers: "Πολλαπλοί leaders προτείνουν διαφορετικά blocks. Επίλυσε τη σύγκρουση.",
            faulty: "Μερικοί validators συμπεριφέρονται λανθασμένα. Διατήρησε τη συναίνεση παρά τα faults.",
            async: "Οι ψήφοι φτάνουν με καθυστέρηση. Η συναίνεση εξαρτάται από eventual agreement.",
        },
        unlockPrevious: "Ολοκλήρωσε το προηγούμενο mode για να ξεκλειδώσεις αυτό",
        masteredNext: {
            basic: "Κατέκτησες το Basic mode. Δοκίμασε τώρα το Συγκρουόμενοι Proposers.",
            proposers: "Κατέκτησες το Συγκρουόμενοι Proposers. Δοκίμασε τώρα το Faulty Validators.",
            faulty: "Κατέκτησες το Faulty Validators. Δοκίμασε τώρα το Async Network.",
            async: "Ολοκλήρωσες όλα τα σενάρια του simulator.",
        },
        modeContent: {
            basic: {
                steps: [
                    "Ξεκίνα τον γύρο",
                    "Ευθυγράμμισε τους validators",
                    "Πέτυχε finality",
                ],
                instructions: [
                    "Ξεκίνα τον γύρο. Πρόσεξε ότι το validator set είναι ήδη γνωστό και προκαθορισμένο πριν αρχίσει η συναίνεση.",
                    "Στο prepare, οι validators πρέπει να συγκλίνουν σε μία πρόταση πριν το σύστημα κινηθεί με ασφάλεια προς το finality.",
                    "Στο commit, οι validators κλειδώνουν την ευθυγραμμισμένη πρόταση και παράγουν ντετερμινιστικό finality.",
                ],
                stepHints: [
                    "Απαιτούμενη ενέργεια: ξεκίνα τον γύρο προτείνοντας ένα block.",
                    "Απαιτούμενη ενέργεια: κάνε τους validators να ευθυγραμμιστούν στο ίδιο block.",
                    "Απαιτούμενη ενέργεια: κλείδωσε το ευθυγραμμισμένο block στη φάση commit μέχρι να υπάρξει finality.",
                ],
            },
            proposers: {
                steps: [
                    "Παρατήρησε τις συγκρουόμενες προτάσεις",
                    "Επίλυσε τη σύγκρουση leaders",
                    "Πέτυχε ευθυγραμμισμένη πρόταση",
                    "Οριστικοποίησε",
                ],
                instructions: [
                    "Ξεκίνα τον γύρο και πρόσεξε ότι δύο leaders μπορεί να προτείνουν διαφορετικά blocks στο ίδιο height.",
                    "Κατεύθυνε τους validators προς την πρόταση ενός leader ώστε η σύγκρουση να λυθεί με ασφάλεια.",
                    "Επιβεβαίωσε ότι το quorum επιτεύχθηκε σε μία κοινή πρόταση και όχι απλώς σε σύνολο ψήφων.",
                    "Πήγαινε στο commit και οριστικοποίησε την ευθυγραμμισμένη πρόταση.",
                ],
                stepHints: [
                    "Απαιτούμενη ενέργεια: ξεκίνα τον γύρο και επιθεώρησε και τις δύο προτάσεις leaders.",
                    "Απαιτούμενη ενέργεια: κάνε αρκετούς validators να υποστηρίξουν την ΙΔΙΑ πρόταση ώστε να λυθεί η σύγκρουση leaders.",
                    "Απαιτούμενη ενέργεια: επιβεβαίωσε ότι υπάρχει quorum πάνω σε μία μόνο πρόταση.",
                    "Απαιτούμενη ενέργεια: οριστικοποίησε την πρόταση του ενός ευθυγραμμισμένου leader.",
                ],
            },
            faulty: {
                steps: [
                    "Εντόπισε τους faulty validators",
                    "Διατήρησε την ευθυγράμμιση παρά τα faults",
                    "Πέτυχε quorum",
                    "Οριστικοποίησε",
                ],
                instructions: [
                    "Ξεκίνα τον γύρο και εντόπισε ποιος validator είναι faulty σε αυτό το σενάριο.",
                    "Κράτησε αρκετούς honest validators ευθυγραμμισμένους στην ίδια πρόταση ακόμη κι όταν ο faulty validator αντιστέκεται στη συμφωνία.",
                    "Επιβεβαίωσε ότι το quorum εξακολουθεί να επιτυγχάνεται επειδή οι κακόβουλοι validators είναι λίγοι.",
                    "Πήγαινε στο commit και οριστικοποίησε παρά το fault.",
                ],
                stepHints: [
                    "Απαιτούμενη ενέργεια: παρατήρησε πρώτα τη σήμανση του faulty validator.",
                    "Απαιτούμενη ενέργεια: κράτησε τους honest validators ευθυγραμμισμένους στην ίδια πρόταση.",
                    "Απαιτούμενη ενέργεια: πέτυχε quorum με την honest πλειοψηφία.",
                    "Απαιτούμενη ενέργεια: κάνε commit την ευθυγραμμισμένη πρόταση σε finality.",
                ],
            },
            async: {
                steps: [
                    "Παρατήρησε τις καθυστερημένες ψήφους",
                    "Περίμενε την άφιξη μηνυμάτων",
                    "Πέτυχε eventual alignment",
                    "Οριστικοποίησε",
                ],
                instructions: [
                    "Ξεκίνα τον γύρο και παρατήρησε ότι οι ψήφοι μπαίνουν στο δίκτυο ως καθυστερημένα μηνύματα και όχι ως άμεσες ενημερώσεις.",
                    "Μην προχωράς πρόωρα. Περίμενε μέχρι να φτάσουν τα μηνύματα των validators και να καθαρίσει η προσωρινή ασυνέπεια.",
                    "Παρατήρησε ότι η συναίνεση εξαρτάται από eventual alignment αφού παραδοθούν τα καθυστερημένα μηνύματα.",
                    "Πήγαινε στο commit και περίμενε ξανά μέχρι να φτάσουν αρκετά commit μηνύματα για finality.",
                ],
                stepHints: [
                    "Απαιτούμενη ενέργεια: ξεκίνα τον γύρο και στείλε ψήφους στο καθυστερημένο δίκτυο.",
                    "Απαιτούμενη ενέργεια: περίμενε να φτάσουν τα pending μηνύματα validators.",
                    "Απαιτούμενη ενέργεια: επιβεβαίωσε την eventual agreement μόλις εφαρμοστούν οι καθυστερημένες ψήφοι.",
                    "Απαιτούμενη ενέργεια: οριστικοποίησε μόνο αφού φτάσουν αρκετά commit μηνύματα.",
                ],
            },
        },
        backHref: "/#/labs-gr/system/s4",
        backLabel: "⬅ Επιστροφή στην Επισκόπηση Lab",
        allStepsCompleted: "Όλοι οι καθοδηγούμενοι έλεγχοι ολοκληρώθηκαν",
        completedLabel: "🎉 Ολοκλήρωση Lab",
        completedDescription:
            "Ολοκλήρωσες το System Lab S4 και εξέτασες πώς το QBFT φτάνει σε finality στο Besu Edu-Net.",
        bulletsTitle: "Τι Να Κρατήσεις",
        bullets: [
            "Το QBFT λειτουργεί με γνωστό validator set και όχι με ανοιχτή αγορά validators.",
            "Το prepare αφορά την ευθυγράμμιση: οι validators δείχνουν ότι συγκλίνουν στο ίδιο προτεινόμενο block.",
            "Το commit αφορά το finality: οι validators κλειδώνουν αυτό το ήδη ευθυγραμμισμένο block ώστε το αποτέλεσμα να μην αλλάζει.",
            "Το finality είναι ντετερμινιστικό μόλις επιτευχθεί η απαιτούμενη commit συμφωνία.",
            "Η permissioned συναίνεση ανταλλάσσει την ανοιχτή συμμετοχή με πιο προβλέψιμο συντονισμό και γρήγορη οριστικοποίηση.",
        ],
        comparisonTitle: "PoS και QBFT Συνοπτικά",
        comparisonIntro:
            "Χρησιμοποίησε αυτή τη σύγκριση για να συνδέσεις τη λογική του proof-of-stake από το προηγούμενο system lab με το permissioned μοντέλο QBFT που μόλις εξερεύνησες εδώ.",
        comparisonHeaders: {
            concept: "Έννοια",
            pos: "PoS",
            qbft: "QBFT (Besu)",
        },
        comparisonRows: [
            {
                concept: "Validator Set",
                pos: "Ανοιχτό (με βάση το stake)",
                qbft: "Σταθερό / permissioned",
            },
            {
                concept: "Επιλογή",
                pos: "Τυχαία (με βάση το stake)",
                qbft: "Προκαθορισμένος / rotating leader",
            },
            {
                concept: "Fault Model",
                pos: "Οικονομικό (slashing)",
                qbft: "Byzantine (≤ 1/3 faulty)",
            },
            {
                concept: "Finality",
                pos: "Πιθανοτικό + checkpoints",
                qbft: "Ντετερμινιστικό",
            },
            {
                concept: "Network Model",
                pos: "Eventually synchronous",
                qbft: "Partially synchronous",
            },
            {
                concept: "Trust Basis",
                pos: "Κεφάλαιο",
                qbft: "Γνωστοί συμμετέχοντες",
            },
        ],
        simulatorTitle: "Ροή Φάσεων QBFT",
        phaseStatusIdle: "Ξεκίνα τον γύρο συναίνεσης προτείνοντας ένα block.",
        phaseStatusPrepare:
            "Ο proposer έχει ήδη μεταδώσει υποψήφια blocks. Στο prepare, οι validators πρέπει να ευθυγραμμιστούν σε μία κοινή πρόταση πριν το σύστημα προχωρήσει προς finality.",
        phaseStatusCommit:
            "Το prepare έχει ήδη δημιουργήσει ευθυγράμμιση σε μία πρόταση. Στο commit, οι validators κλειδώνουν αυτή την ίδια πρόταση σε finality.",
        startRound: "Έναρξη Γύρου",
        nextToCommit: "Μετάβαση σε Commit",
        resetPhases: "Επαναφορά Γύρου",
        phaseLabel: "Φάση",
        approvalsLabel: "Εγκρίσεις",
        quorumLabel: "Quorum",
        validatorLabel: "Validator",
        voteHintPrepare:
            "Στο prepare, οι validators επιλέγουν ποιο προτεινόμενο block είναι διατεθειμένοι να υποστηρίξουν κοινά.",
        voteHintCommit:
            "Στο commit, οι validators δεν επιλέγουν πλέον ανάμεσα σε προτάσεις. Κλειδώνουν το ήδη ευθυγραμμισμένο block.",
        moveBlockedPrepare:
            "Απαιτείται prepare quorum πάνω στην ίδια κοινή πρόταση πριν μεταβείς στο commit.",
        moveBlockedCommit:
            "Απαιτείται commit quorum πριν οριστικοποιηθεί το block.",
        finalizedSuccess: "✔ Το block οριστικοποιήθηκε (επιτεύχθηκε commit quorum πάνω στην ευθυγραμμισμένη πρόταση)",
        finalizedFailure:
            "✖ Το block δεν έχει οριστικοποιηθεί ακόμη. Χρειάζονται περισσότερες commit ψήφοι για quorum.",
        finalityEvent:
            "Επιτεύχθηκε finality: αυτό το block θεωρείται πλέον οριστικά αποδεκτό. Η ανατροπή του θα απαιτούσε από validators να παραβιάσουν το πρωτόκολλο.",
        phaseTitle: "Φάσεις QBFT",
        phaseColumn: "Φάση",
        purposeColumn: "Σκοπός",
        prepareVoteLabel: "Prepare: ευθυγράμμιση σε ένα block",
        commitVoteLabel: "Commit: κλείδωμα του ευθυγραμμισμένου block",
        checkpointTitle: "Checkpoint",
        checkpointQuestion: "Γιατί το QBFT χρειάζεται και prepare και commit;",
        checkpointOptions: [
            "Το prepare ευθυγραμμίζει τους validators σε ένα block, ενώ το commit κλειδώνει αυτό το block σε finality.",
            "Το prepare και το commit είναι η ίδια ψήφος δύο φορές μόνο για πλεονασμό.",
            "Το prepare επιλέγει το validator set, ενώ το commit επιλέγει τον proposer.",
            "Το prepare είναι για mining competition, ενώ το commit για transaction ordering.",
        ],
        checkpointCorrect:
            "Σωστό: το prepare δημιουργεί ευθυγράμμιση σε μία πρόταση και το commit κλειδώνει αυτή την ίδια πρόταση σε finality.",
        checkpointWrong:
            "Δοκίμασε ξανά. Εστίασε στη διαφορά μεταξύ ευθυγράμμισης και finality.",
        checkpointLocked:
            "Οριστικοποίησε πρώτα το block και μετά απάντησε στο checkpoint.",
        checkpointReadyToClaim:
            "Το checkpoint ολοκληρώθηκε. Μπορείς τώρα να κάνεις claim την ολοκλήρωση του lab.",
        currentAction: "Τρέχουσα ενέργεια",
        prePrepareCompleted: "το pre-prepare ολοκληρώθηκε αυτόματα με την έναρξη του γύρου",
        prepareLockedHint: "Η prepare ψηφοφορία ενεργοποιείται μόλις ξεκινήσει ο γύρος.",
        commitLockedHint: "Η commit ψηφοφορία ξεκλειδώνει αφού επιτευχθεί prepare quorum.",
        finalityReachedHint:
            "Το commit quorum έχει ήδη επιτευχθεί. Το block είναι πλέον τελικό. Οι υπόλοιποι validators μπορούν ακόμη να προσθέσουν matching commit ψήφους, αλλά δεν χρειάζονται πλέον για το finality.",
        prepareConceptTitle: "Τι αποδεικνύει το prepare",
        prepareConceptBody:
            "Οι validators δεν οριστικοποιούν ακόμη. Αποδεικνύουν ότι είναι ευθυγραμμισμένοι στο ίδιο προτεινόμενο block ώστε το δίκτυο να μην κινδυνεύει να κλειδώσει διαφορετικά blocks σε διαφορετικούς κόμβους.",
        commitConceptTitle: "Τι αποδεικνύει το commit",
        commitConceptBody:
            "Οι validators δεν αποφασίζουν πλέον ανάμεσα σε εναλλακτικές. Κλειδώνουν το ήδη ευθυγραμμισμένο block, και αυτό είναι που δίνει ντετερμινιστικό finality.",
        prepareWarning:
            "Χωρίς prepare, οι validators θα μπορούσαν να προσπαθήσουν να οριστικοποιήσουν διαφορετικά blocks.",
        commitWarning:
            "Χωρίς commit, υπάρχει συμφωνία αλλά δεν έχει ακόμη κλειδώσει ως τελικό αποτέλεσμα.",
        commitExtraVoteNote:
            "Ένας validator που δεν συμμετείχε στο quorum μπορεί ακόμη να στείλει matching commit αργότερα. Η ουσία είναι ότι το finality έχει ήδη συμβεί μόλις επιτευχθεί το quorum.",
        proposalTitle: "Προτεινόμενα blocks",
        proposalHint:
            "Το prepare πετυχαίνει μόνο όταν αρκετοί validators ευθυγραμμιστούν στην ίδια πρόταση block.",
        conflictingProposalsIntro:
            "Διαφορετικοί leaders μπορεί να προτείνουν διαφορετικά blocks στο ίδιο height. Αυτό είναι φυσιολογικό στα κατανεμημένα συστήματα και το QBFT πρέπει να επαναφέρει το δίκτυο σε μία κοινή πρόταση.",
        conflictingProposalsCause:
            "Αυτό μπορεί να συμβεί λόγω καθυστερήσεων δικτύου, ανταγωνιστικών leaders ή faulty validators που προτείνουν διαφορετικά blocks την ίδια στιγμή.",
        proposalRule:
            "Οι validators πρέπει να συμφωνήσουν στο ΙΔΙΟ block. Οι μικτές ψήφοι δεν δημιουργούν συναίνεση.",
        blockA: "Block A",
        blockB: "Block B",
        proposedBy: "Προτάθηκε από",
        leaderProposal: "Πρόταση Leader {id}",
        dualProposerMode: "Σενάριο συγκρουόμενων proposers",
        dualProposerHint:
            "Προσομοίωσε έναν γύρο όπου δύο validators λειτουργούν ως ανταγωνιστικοί proposers και το δίκτυο πρέπει να λύσει τη σύγκρουση.",
        asyncModeLabel: "Ασύγχρονο / Καθυστερημένο δίκτυο",
        asyncModeHint:
            "Προσομοίωσε ένα δίκτυο όπου τα μηνύματα των validators φτάνουν σε διαφορετικούς χρόνους αντί να εμφανίζονται αμέσως.",
        alignedProposal: "Ευθυγραμμισμένη πρόταση",
        noAlignedProposal: "Δεν υπάρχει ακόμη ευθυγραμμισμένη πρόταση",
        consensusAchievedOn: "Επιτεύχθηκε συναίνεση στο",
        alignedOn: "Ευθυγράμμιση σε",
        commitTargetLabel: "Στόχος commit",
        prepareQuorumReached: "Επιτεύχθηκε prepare quorum σε αυτή την πρόταση.",
        prepareQuorumMissing: "Καμία μεμονωμένη πρόταση δεν έχει ακόμη αρκετές prepare ψήφους.",
        splitVoteWarning:
            "Οι validators είναι μοιρασμένοι σε διαφορετικά blocks. Δεν μπορεί να υπάρξει συναίνεση μέχρι να ευθυγραμμιστούν σε μία πρόταση.",
        networkSplitWarning: "Το δίκτυο έχει χωριστεί σε συγκρουόμενες προτάσεις.",
        multipleProposalsPreventFinality:
            "Πολλαπλές ανταγωνιστικές προτάσεις εμποδίζουν το finality.",
        splitCorrection:
            "Για να προχωρήσεις, πρέπει αρκετοί validators να υποστηρίξουν την ΙΔΙΑ πρόταση.",
        byzantineBridge:
            "Αυτή είναι η ίδια πρόκληση με το Βυζαντινό πρόβλημα: χωρίς επαρκή συμφωνία, το σύστημα δεν μπορεί να αποφασίσει με ασφάλεια.",
        alignmentConfirmed:
            "Όλοι οι validators συμφωνούν πλέον στο ίδιο block.",
        conflictResolved:
            "Η σύγκρουση επιλύθηκε: το δίκτυο συνέκλινε σε μία και μόνο πρόταση.",
        maliciousConflictLink:
            "Οι faulty validators μπορεί να υποστηρίζουν διαφορετικούς proposers, αυξάνοντας την πιθανότητα συγκρουόμενων προτάσεων.",
        validatorChoiceLabel: "Επιλογή validator",
        commitClarifier:
            "Το commit δεν αφορά την επιλογή block. Αφορά το κλείδωμα του συμφωνημένου block ώστε να μην μπορεί να αλλάξει.",
        prepareActionPrompt:
            "Επίλεξε Block A ή Block B για κάθε validator παρακάτω. Ο στόχος δεν είναι τυχαία clicks, αλλά να συγκλίνουν αρκετοί validators στην ΙΔΙΑ πρόταση.",
        asyncPrepareHint:
            "Οι validators δεν λαμβάνουν τα μηνύματα την ίδια στιγμή. Μερικές ψήφοι μπορεί να φτάσουν αργότερα λόγω καθυστερήσεων δικτύου.",
        asyncTimelineHint:
            "Οι ψήφοι φτάνουν με την πάροδο του χρόνου και όχι ακαριαία.",
        asyncTemporarySplit:
            "Το δίκτυο φαίνεται ασυνεπές μέχρι να φτάσουν όλα τα μηνύματα.",
        asyncEventualAgreement:
            "Η προσωρινή διαφωνία δεν σημαίνει αποτυχία. Η συναίνεση εξαρτάται από eventual agreement.",
        pendingVoteLabel: "Σε αναμονή",
        commitActionPrompt:
            "Τώρα επιβεβαίωσε το ήδη ευθυγραμμισμένο block. Οι commit ψήφοι δεν διαλέγουν νέα πρόταση· κλειδώνουν αυτή που ήδη συμφωνήθηκε σε finality.",
        commitLeaderMessage:
            "Οι validators κάνουν commit στην πρόταση ενός και μόνο leader.",
        commitIrreversible:
            "Σε αυτό το σημείο, το δίκτυο δεν διαπραγματεύεται πλέον. Παίρνει μια τελική, μη αναστρέψιμη απόφαση.",
        pendingMessagesError:
            "Κάποια μηνύματα validators δεν έχουν φτάσει ακόμη.",
        leaderMismatchError:
            "Το commit παραμένει κλειδωμένο μέχρι οι validators να ευθυγραμμιστούν σε μία πρόταση από έναν μόνο leader.",
        faultyMinimumError:
            "Το Faulty mode πρέπει να διατηρεί τουλάχιστον έναν faulty validator ενεργό.",
        commitLateVoteExplanation:
            "Ένας validator όπως ο Validator D μπορεί ακόμη να προσθέσει matching commit μετά το quorum. Αυτή η ψήφος δεν αλλάζει το επιλεγμένο block· απλώς επιβεβαιώνει το ίδιο ευθυγραμμισμένο block.",
        finalityBridge:
            "Αυτό είναι που λύνει το πρόβλημα ασφάλειας τύπου Byzantine από το S0: όταν αρκετοί validators κλειδώσουν το ίδιο block, το δίκτυο μπορεί να αποφασίσει με ασφάλεια.",
        proposerRotationHint:
            "Στο πραγματικό QBFT, οι ρόλοι proposer περιστρέφονται από γύρο σε γύρο.",
    },
};

function voteCount(votes) {
    return Object.values(votes).filter(Boolean).length;
}

function proposalCounts(choices) {
    return Object.values(choices).reduce(
        (acc, value) => {
            if (value === "A") acc.A += 1;
            if (value === "B") acc.B += 1;
            return acc;
        },
        { A: 0, B: 0 }
    );
}

function proposalLabel(proposal, copy) {
    if (proposal === "A") return copy.blockA;
    if (proposal === "B") return copy.blockB;
    return copy.noAlignedProposal;
}

function otherValidator(id) {
    return { A: "B", B: "C", C: "D", D: "A" }[id] || "B";
}

function defaultMaliciousForMode(modeName) {
    if (modeName === "faulty" || modeName === "async") {
        return { A: false, B: false, C: false, D: true };
    }

    return { A: false, B: false, C: false, D: false };
}

export default function SystemLabS4Interaction({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;
    const modeThemes = {
        basic: {
            badge: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200",
            active: "border-slate-500 bg-slate-700 text-white dark:border-slate-400 dark:bg-slate-200 dark:text-slate-900",
            available: "border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200",
        },
        proposers: {
            badge: "border-amber-300 bg-amber-100/70 text-amber-800 dark:border-amber-500/60 dark:bg-amber-900/30 dark:text-amber-200",
            active: "border-amber-500 bg-amber-500 text-white",
            available: "border-amber-300 bg-white text-amber-800 hover:border-amber-400 dark:border-amber-500/60 dark:bg-slate-900/40 dark:text-amber-200",
        },
        faulty: {
            badge: "border-red-300 bg-red-100/70 text-red-800 dark:border-red-500/60 dark:bg-red-900/30 dark:text-red-200",
            active: "border-red-500 bg-red-500 text-white",
            available: "border-red-300 bg-white text-red-800 hover:border-red-400 dark:border-red-500/60 dark:bg-slate-900/40 dark:text-red-200",
        },
        async: {
            badge: "border-sky-300 bg-sky-100/70 text-sky-800 dark:border-sky-500/60 dark:bg-sky-900/30 dark:text-sky-200",
            active: "border-sky-500 bg-sky-500 text-white",
            available: "border-sky-300 bg-white text-sky-800 hover:border-sky-400 dark:border-sky-500/60 dark:bg-slate-900/40 dark:text-sky-200",
        },
        locked: "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-500",
    };
    const [mode, setMode] = useState("basic");
    const [unlockedModes, setUnlockedModes] = useState(["basic"]);
    const [phase, setPhase] = useState("idle");
    const [prepareChoices, setPrepareChoices] = useState(INITIAL_CHOICES);
    const [pendingPrepare, setPendingPrepare] = useState(INITIAL_CHOICES);
    const [pendingCommit, setPendingCommit] = useState(INITIAL_VOTES);
    const [validatorDelays, setValidatorDelays] = useState(INITIAL_DELAYS);
    const [proposers, setProposers] = useState({ A: "A", B: "B" });
    const [malicious, setMalicious] = useState({
        A: false,
        B: false,
        C: false,
        D: false,
    });
    const [commitVotes, setCommitVotes] = useState(INITIAL_VOTES);
    const [answer, setAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [phaseError, setPhaseError] = useState(null);
    const [asyncObserved, setAsyncObserved] = useState(false);
    const timersRef = useRef({ prepare: {}, commit: {} });
    const dualProposerMode = mode !== "basic";
    const asyncMode = mode === "async";
    const modeConfig = copy.modeContent[mode];
    const steps = modeConfig.steps;
    const instructions = modeConfig.instructions;
    const stepHints = modeConfig.stepHints;

    const totalValidators = 4;
    const threshold = Math.ceil((2 / 3) * totalValidators);
    const prepareCounts = proposalCounts(prepareChoices);
    const prepareApprovals = Math.max(prepareCounts.A, prepareCounts.B);
    const alignedProposal =
        prepareCounts.A >= threshold ? "A" : prepareCounts.B >= threshold ? "B" : null;
    const sameLeaderConflict = dualProposerMode && proposers.A === proposers.B;
    const alignedLeader = alignedProposal ? proposers[alignedProposal] : null;
    const hasSingleAlignedLeader = Boolean(alignedProposal) && Boolean(alignedLeader) && !sameLeaderConflict;
    const commitApprovals = voteCount(commitVotes);
    const finalized = phase === "commit" && Boolean(alignedProposal) && commitApprovals >= threshold;
    const splitNetwork = !alignedProposal && prepareApprovals > 0;
    const hasPendingPrepare = Object.values(pendingPrepare).some(Boolean);
    const hasPendingCommit = Object.values(pendingCommit).some(Boolean);
    const hasMalicious = Object.values(malicious).some(Boolean);
    const faultyCount = Object.values(malicious).filter(Boolean).length;
    const tooManyFaulty = faultyCount >= totalValidators - threshold + 1;
    const asyncPendingObserved = asyncMode && asyncObserved;
    const asyncPendingResolved =
        asyncPendingObserved &&
        !hasPendingPrepare &&
        !hasPendingCommit &&
        (prepareApprovals > 0 || commitApprovals > 0);
    const asyncAlignmentResolved = asyncPendingResolved && Boolean(alignedProposal);
    const canSwitchModes = phase === "idle" || finalized;
    const checkpointPassed = feedback === "correct";

    const stepCompletionByMode = {
        basic: [
            phase !== "idle",
            Boolean(alignedProposal),
            finalized,
        ],
        proposers: [
            phase !== "idle",
            splitNetwork || prepareCounts.A > 0 || prepareCounts.B > 0,
            Boolean(alignedProposal),
            finalized,
        ],
        faulty: [
            hasMalicious,
            Boolean(alignedProposal),
            prepareApprovals >= threshold && (phase === "prepare" || phase === "commit"),
            finalized,
        ],
        async: [
            asyncPendingObserved,
            asyncPendingResolved,
            asyncAlignmentResolved,
            finalized,
        ],
    };
    const stepCompletion = stepCompletionByMode[mode];
    const currentStep = stepCompletion.findIndex((done) => !done);
    const activeStep = currentStep === -1 ? stepCompletion.length - 1 : currentStep;
    const allStepsCompleted = stepCompletion.every(Boolean);
    const readyForClaim = mode === "async" && finalized;
    const isComplete = readyForClaim && checkpointPassed;

    const card =
        "rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/40";

    const currentInstruction = useMemo(() => {
        if (currentStep === -1) {
            return instructions[instructions.length - 1];
        }
        return instructions[currentStep];
    }, [instructions, currentStep]);

    const currentHint = useMemo(() => {
        if (currentStep === -1) {
            return stepHints[stepHints.length - 1];
        }
        return stepHints[currentStep];
    }, [stepHints, currentStep]);

    const phaseStatusText = useMemo(() => {
        if (phase === "idle") return copy.phaseStatusIdle;
        if (phase === "prepare") return copy.phaseStatusPrepare;
        return copy.phaseStatusCommit;
    }, [copy, phase]);

    useEffect(() => {
        return () => {
            Object.values(timersRef.current.prepare).forEach(clearTimeout);
            Object.values(timersRef.current.commit).forEach(clearTimeout);
        };
    }, []);

    const clearTimers = () => {
        Object.values(timersRef.current.prepare).forEach(clearTimeout);
        Object.values(timersRef.current.commit).forEach(clearTimeout);
        timersRef.current = { prepare: {}, commit: {} };
    };

    const handleModeSelect = (nextMode) => {
        if (!canSwitchModes) return;
        if (!unlockedModes.includes(nextMode)) {
            setPhaseError(copy.unlockPrevious);
            return;
        }

        if (phase !== "idle") {
            resetRound();
        }

        setMode(nextMode);
        setPrepareChoices(INITIAL_CHOICES);
        setPendingPrepare(INITIAL_CHOICES);
        setPendingCommit(INITIAL_VOTES);
        setCommitVotes(INITIAL_VOTES);
        setProposers({ A: "A", B: nextMode === "basic" ? "A" : "B" });
        setMalicious(defaultMaliciousForMode(nextMode));
        setValidatorDelays(nextMode === "async" ? INITIAL_DELAYS : { A: 0, B: 0, C: 0, D: 0 });
        setAsyncObserved(false);
        setAnswer(null);
        setFeedback(null);
        setPhaseError(null);
    };

    const handleToggleMalicious = (id) => {
        setPhaseError(null);
        setMalicious((current) => {
            const nextValue = !current[id];
            const nextState = { ...current, [id]: nextValue };
            const nextFaultyCount = Object.values(nextState).filter(Boolean).length;

            if (mode === "faulty" && nextFaultyCount === 0) {
                setPhaseError(copy.faultyMinimumError);
                return current;
            }

            return nextState;
        });
    };

    const resetRound = () => {
        clearTimers();
        setPhase("idle");
        setPrepareChoices(INITIAL_CHOICES);
        setPendingPrepare(INITIAL_CHOICES);
        setPendingCommit(INITIAL_VOTES);
        setProposers({ A: "A", B: dualProposerMode ? "B" : "A" });
        setValidatorDelays(INITIAL_DELAYS);
        setMalicious(defaultMaliciousForMode(mode));
        setCommitVotes(INITIAL_VOTES);
        setAnswer(null);
        setFeedback(null);
        setPhaseError(null);
        setAsyncObserved(false);
    };

    const setPrepareChoice = (id, proposal) => {
        if (phase !== "prepare") return;

        setPhaseError(null);
        const targetProposal = malicious[id] ? (proposal === "A" ? "B" : "A") : proposal;

        if (asyncMode) {
            if (timersRef.current.prepare[id]) clearTimeout(timersRef.current.prepare[id]);
            setPendingPrepare((current) => ({ ...current, [id]: targetProposal }));
            setAsyncObserved(true);
            timersRef.current.prepare[id] = setTimeout(() => {
                setPrepareChoices((current) => ({ ...current, [id]: targetProposal }));
                setPendingPrepare((current) => ({ ...current, [id]: null }));
                delete timersRef.current.prepare[id];
            }, validatorDelays[id]);
            return;
        }

        setPrepareChoices((current) => ({
            ...current,
            [id]: current[id] === targetProposal ? null : targetProposal,
        }));
    };

    const toggleCommitVote = (id) => {
        if (phase !== "commit") return;
        setPhaseError(null);
        if (malicious[id]) {
            return;
        }

        if (asyncMode) {
            if (timersRef.current.commit[id]) clearTimeout(timersRef.current.commit[id]);
            setPendingCommit((current) => ({ ...current, [id]: true }));
            setAsyncObserved(true);
            timersRef.current.commit[id] = setTimeout(() => {
                setCommitVotes((current) => {
                    if (finalized && current[id]) return current;
                    return { ...current, [id]: true };
                });
                setPendingCommit((current) => ({ ...current, [id]: false }));
                delete timersRef.current.commit[id];
            }, validatorDelays[id]);
            return;
        }

        setCommitVotes((current) => {
            if (finalized) {
                if (current[id]) return current;
                return { ...current, [id]: true };
            }

            return { ...current, [id]: !current[id] };
        });
    };

    const startRound = () => {
        const primaryLeader = "A";
        const competingLeader = dualProposerMode ? otherValidator(primaryLeader) : primaryLeader;
        clearTimers();
        setPhase("prepare");
        setPhaseError(null);
        setProposers({ A: primaryLeader, B: competingLeader });
        setPrepareChoices(INITIAL_CHOICES);
        setPendingPrepare(INITIAL_CHOICES);
        setPendingCommit(INITIAL_VOTES);
        setValidatorDelays(asyncMode ? INITIAL_DELAYS : { A: 0, B: 0, C: 0, D: 0 });
        setMalicious(defaultMaliciousForMode(mode));
        setCommitVotes(INITIAL_VOTES);
    };

    const moveToCommit = () => {
        if (phase !== "prepare") return;
        if (asyncMode && hasPendingPrepare) {
            setPhaseError(copy.pendingMessagesError);
            return;
        }
        if (!alignedProposal || prepareApprovals < threshold || !alignedLeader) {
            setPhaseError(copy.moveBlockedPrepare);
            return;
        }
        if (!hasSingleAlignedLeader) {
            setPhaseError(copy.leaderMismatchError);
            return;
        }
        setPhase("commit");
        setCommitVotes(INITIAL_VOTES);
        setPhaseError(null);
    };

    const onCheckpointAnswer = (index) => {
        if (!finalized) return;
        setAnswer(index);
        setFeedback(index === 0 ? "correct" : "wrong");
    };

    useEffect(() => {
        if (mode === "basic" && finalized) {
            setUnlockedModes((current) =>
                current.includes("proposers") ? current : [...current, "proposers"]
            );
        }
    }, [finalized, mode]);

    useEffect(() => {
        if (mode === "proposers" && finalized) {
            setUnlockedModes((current) =>
                current.includes("faulty") ? current : [...current, "faulty"]
            );
        }
    }, [finalized, mode]);

    useEffect(() => {
        if (mode === "faulty" && finalized) {
            setUnlockedModes((current) =>
                current.includes("async") ? current : [...current, "async"]
            );
        }
    }, [finalized, mode]);

    const nextMode =
        mode === "basic" && unlockedModes.includes("proposers")
            ? "proposers"
            : mode === "proposers" && finalized && unlockedModes.includes("faulty")
                ? "faulty"
                : mode === "faulty" && finalized && unlockedModes.includes("async")
                    ? "async"
                    : mode === "async" && finalized
                        ? "async"
                        : null;
    const latestUnlockedMode =
        mode === "basic" && finalized && unlockedModes.includes("proposers")
            ? "proposers"
            : mode === "proposers" && finalized && unlockedModes.includes("faulty")
                ? "faulty"
                : mode === "faulty" && finalized && unlockedModes.includes("async")
                    ? "async"
                    : null;
    const modeTheme = modeThemes[mode];

    return (
        <PageShell>
            <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12">
                <section className={card}>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {copy.title}
                    </h1>
                    <p className="mt-3 max-w-5xl text-slate-600 dark:text-slate-300">
                        {copy.intro}
                    </p>
                    <a
                        href={copy.backHref}
                        className="mt-4 inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-1 dark:text-indigo-300"
                    >
                        {copy.backLabel}
                    </a>
                </section>

                <section className={card}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                {copy.learningPathTitle}
                            </div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                {copy.modePrefix}: {copy.modeLabels[mode]}
                            </div>
                        </div>
                        <div className="text-xs text-slate-400">
                            Step {Math.min(activeStep + 1, steps.length)} / {steps.length}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {steps.map((item, index) => (
                            <div
                                key={item}
                                className={`h-2 flex-1 rounded-full ${stepCompletion[index]
                                        ? "bg-green-500"
                                        : index === activeStep && !allStepsCompleted
                                            ? "bg-indigo-500"
                                            : "bg-slate-200 dark:bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        {steps.map((item, index) => {
                            const done = stepCompletion[index];
                            const active = index === activeStep && !allStepsCompleted;

                            return (
                                <div key={item} className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 text-xs ${done
                                                ? "text-green-400"
                                                : active
                                                    ? "text-blue-400"
                                                    : "text-slate-500"
                                            }`}
                                    >
                                        {done ? "✔" : active ? "●" : "○"}
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`text-sm ${active
                                                    ? "font-semibold text-slate-900 dark:text-white"
                                                    : "text-slate-500 dark:text-slate-400"
                                                }`}
                                        >
                                            {item}
                                        </div>
                                        {active ? (
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {currentInstruction}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-700/50 dark:bg-indigo-900/20 dark:text-indigo-200">
                        {currentHint}
                    </div>

                    {allStepsCompleted ? (
                        <div className="mt-3 text-xs text-green-500 dark:text-green-400">
                            ✔ {copy.allStepsCompleted}
                        </div>
                    ) : null}
                </section>

                <section className={card}>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.modesTitle}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {MODE_ORDER.map((modeName) => {
                            const unlocked = unlockedModes.includes(modeName);
                            const selected = mode === modeName;
                            const theme = modeThemes[modeName];

                            return (
                                <button
                                    key={modeName}
                                    onClick={() => handleModeSelect(modeName)}
                                    disabled={!canSwitchModes}
                                    title={!unlocked ? copy.unlockPrevious : ""}
                                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${!unlocked
                                            ? modeThemes.locked
                                            : selected
                                                ? theme.active
                                                : theme.available
                                        }`}
                                >
                                    {!unlocked ? "🔒 " : ""}
                                    {selected
                                        ? `${copy.modePrefix}: ${copy.modeLabels[modeName]}`
                                        : copy.modeLabels[modeName]}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {copy.modeDescriptions[mode]}
                    </div>

                    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-700/50 dark:bg-indigo-900/20 dark:text-indigo-200">
                        {copy.progressionIntro}
                    </div>

                    {latestUnlockedMode ? (
                        <div className="mt-4 rounded-xl border border-emerald-400 bg-emerald-100/20 px-4 py-4 text-sm text-emerald-700 dark:text-emerald-300">
                            <div className="font-semibold">✔ {copy.modeUnlockTitle}</div>
                            <div className="mt-2 text-xs">
                                • {copy.modeUnlockItems[latestUnlockedMode]}
                            </div>
                        </div>
                    ) : null}

                    {nextMode ? (
                        <div className="mt-4 rounded-xl border border-emerald-400 bg-emerald-100/20 px-4 py-4 text-sm text-emerald-700 dark:text-emerald-300">
                            <div className="font-semibold">✔ {copy.masteredNext[mode]}</div>
                            {nextMode !== mode ? (
                                <button
                                    onClick={() => handleModeSelect(nextMode)}
                                    disabled={!canSwitchModes}
                                    className="mt-3 rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                                >
                                    {copy.nextModeCta.replace("{mode}", copy.modeLabels[nextMode])}
                                </button>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.controlsTitle}
                    </div>
                    <div className="mt-2 h-px w-full bg-slate-200 dark:bg-slate-700" />

                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/30">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${modeTheme.badge}`}>
                                {copy.modePrefix}: {copy.modeLabels[mode]}
                            </div>
                            {asyncMode ? (
                                <div className="rounded-full border border-sky-400/70 bg-sky-100/60 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">
                                    {copy.asyncNetworkBadge}
                                </div>
                            ) : null}
                        </div>

                        {asyncMode ? (
                            <div className="mt-3 rounded-lg border border-sky-300 bg-sky-100/40 px-3 py-2 text-xs text-sky-700 dark:border-sky-500/40 dark:bg-sky-900/20 dark:text-sky-200">
                                <span className="font-semibold">{copy.networkStateLabel}:</span>{" "}
                                {hasPendingPrepare || hasPendingCommit
                                    ? copy.networkMessagesInTransit
                                    : asyncObserved
                                        ? copy.networkMessagesDelivered
                                        : copy.asyncTimelineHint}
                            </div>
                        ) : null}

                        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                            {copy.simulatorTitle}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {phaseStatusText}
                        </p>

                        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-700/50 dark:bg-indigo-900/20 dark:text-indigo-200">
                            <span className="font-semibold">{copy.currentAction}:</span>{" "}
                            {phase === "idle" && stepHints[0]}
                            {phase === "prepare" && currentHint}
                            {phase === "commit" && !finalized && stepHints[stepHints.length - 1]}
                            {phase === "commit" && finalized && copy.finalityReachedHint}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                                onClick={startRound}
                                disabled={phase !== "idle"}
                                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                            >
                                {copy.startRound}
                            </button>

                            <button
                                onClick={moveToCommit}
                                disabled={phase !== "prepare"}
                                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                            >
                                {copy.nextToCommit}
                            </button>

                            <button
                                onClick={resetRound}
                                className="rounded-full bg-slate-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                                {copy.resetPhases}
                            </button>
                        </div>

                        {phaseError ? (
                            <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                                {phaseError}
                            </div>
                        ) : null}

                        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                            {copy.phaseLabel}: {phase}
                        </div>

                        {phase !== "idle" ? (
                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                                ✔ {copy.prePrepareCompleted}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.processTitle}
                    </div>
                    <div className="mt-2 h-px w-full bg-slate-200 dark:bg-slate-700" />

                    <div className="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/30">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className={`rounded-2xl border p-4 ${phase === "prepare"
                                    ? "border-indigo-400/70 bg-[#0F172A] text-white"
                                    : "border-slate-700 bg-[#0F172A] text-white"
                                }`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white">
                                        {copy.prepareVoteLabel}
                                    </div>
                                    <div className="text-xs text-slate-300">
                                        {copy.approvalsLabel}: {prepareApprovals}/{totalValidators} ({copy.quorumLabel} ≥ {threshold})
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-2 flex-1 rounded ${i < prepareApprovals
                                                    ? prepareApprovals >= threshold
                                                        ? "bg-green-500"
                                                        : "bg-indigo-500"
                                                    : "bg-slate-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 text-xs font-medium text-slate-200">
                                    {copy.proposalTitle}
                                </p>
                                <p className="mt-1 text-xs text-slate-300">
                                    {copy.proposalHint}
                                </p>
                                {dualProposerMode ? (
                                    <div className="mt-2 text-xs text-slate-300">
                                        {copy.conflictingProposalsIntro}
                                    </div>
                                ) : null}
                                {dualProposerMode ? (
                                    <div className="mt-2 text-xs text-slate-300">
                                        {copy.conflictingProposalsCause}
                                    </div>
                                ) : null}
                                {dualProposerMode ? (
                                    <div className="mt-2 text-xs text-slate-300">
                                        {copy.proposerRotationHint}
                                    </div>
                                ) : null}
                                {hasMalicious ? (
                                    <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        {copy.maliciousConflictLink}
                                    </div>
                                ) : null}
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div className={`rounded-xl border px-3 py-3 ${prepareCounts.A >= threshold
                                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                                            : splitNetwork
                                                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
                                        }`}>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {copy.blockA}
                                        </div>
                                        <div className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                            {copy.leaderProposal.replace("{id}", proposers.A)}
                                        </div>
                                        <div className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                                            {copy.proposedBy} {copy.validatorLabel} {proposers.A}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                            {prepareCounts.A} / {totalValidators}
                                        </div>
                                    </div>
                                    <div className={`rounded-xl border px-3 py-3 ${prepareCounts.B >= threshold
                                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                                            : splitNetwork
                                                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
                                        }`}>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {copy.blockB}
                                        </div>
                                        <div className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                                            {copy.leaderProposal.replace("{id}", proposers.B)}
                                        </div>
                                        <div className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            {copy.proposedBy} {copy.validatorLabel} {proposers.B}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                            {prepareCounts.B} / {totalValidators}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-slate-300">
                                    {phase === "idle" ? copy.prepareLockedHint : copy.voteHintPrepare}
                                </p>
                                {phase === "prepare" ? (
                                    <div className="mt-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200">
                                        {copy.prepareActionPrompt}
                                    </div>
                                ) : null}
                                <div className="mt-2 text-xs text-slate-300">
                                    {copy.proposalRule}
                                </div>
                                {asyncMode ? (
                                    <>
                                        <div className="mt-2 text-xs text-sky-600 dark:text-sky-300">
                                            {copy.asyncPrepareHint}
                                        </div>
                                        <div className="mt-2 text-xs text-slate-300">
                                            {copy.asyncTimelineHint}
                                        </div>
                                        {hasPendingPrepare ? (
                                            <div className="mt-2 text-xs text-amber-600 dark:text-amber-300">
                                                {copy.asyncTemporarySplit}
                                            </div>
                                        ) : null}
                                        {(hasPendingPrepare || splitNetwork) ? (
                                            <div className="mt-2 text-xs text-slate-300">
                                                {copy.asyncEventualAgreement}
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}
                                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {["A", "B", "C", "D"].map((id) => (
                                        <div
                                            key={id}
                                            className={`rounded-xl border bg-white p-3 dark:bg-slate-900 ${malicious[id]
                                                    ? "border-red-300 dark:border-red-500/60"
                                                    : "border-slate-200 dark:border-slate-700"
                                                } ${pendingPrepare[id] ? "animate-pulse opacity-70" : ""}`}
                                        >
                                            <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                                {copy.validatorLabel} {id}
                                            </div>
                                            {malicious[id] && (
                                                <div className="mt-1 text-[11px] text-red-500 dark:text-red-400">
                                                    ⚠ Faulty validator
                                                </div>
                                            )}
                                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
                                            {copy.validatorChoiceLabel}: {prepareChoices[id] ? proposalLabel(prepareChoices[id], copy) : "—"}
                                        </div>
                                            {pendingPrepare[id] ? (
                                                <div className="mt-1 text-[11px] text-sky-600 dark:text-sky-300">
                                                    {copy.pendingVoteLabel}... {proposalLabel(pendingPrepare[id], copy)}
                                                </div>
                                            ) : null}
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => setPrepareChoice(id, "A")}
                                                    disabled={phase !== "prepare" || Boolean(pendingPrepare[id])}
                                                    className={`flex-1 rounded border px-3 py-2 text-xs disabled:opacity-50 ${prepareChoices[id] === "A"
                                                            ? "border-indigo-500 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
                                                            : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                                        }`}
                                                >
                                                    {copy.blockA}
                                                </button>
                                                <button
                                                    onClick={() => setPrepareChoice(id, "B")}
                                                    disabled={phase !== "prepare" || Boolean(pendingPrepare[id])}
                                                    className={`flex-1 rounded border px-3 py-2 text-xs disabled:opacity-50 ${prepareChoices[id] === "B"
                                                            ? "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                                                            : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                                        }`}
                                                >
                                                    {copy.blockB}
                                                </button>
                                            </div>
                                            {mode === "faulty" || mode === "async" ? (
                                                <button
                                                    onClick={() => handleToggleMalicious(id)}
                                                    className={`mt-2 w-full rounded border px-2 py-1 text-[11px] ${malicious[id]
                                                            ? "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200"
                                                            : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                                                        }`}
                                                >
                                                    {malicious[id]
                                                        ? lang === "gr" ? "Ορισμός ως Honest" : "Set Honest"
                                                        : lang === "gr" ? "Ορισμός ως Malicious" : "Set Malicious"}
                                                </button>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                                {alignedProposal ? (
                                    <div className="mt-4 rounded-xl border-2 border-green-500 bg-green-100/20 px-4 py-3 ring-2 ring-green-400/60">
                                        <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                                            ✔ {copy.consensusAchievedOn} {proposalLabel(alignedProposal, copy)}
                                        </div>
                                        <div className="mt-1 text-xs text-green-700/80 dark:text-green-300/80">
                                            {copy.alignmentConfirmed}
                                        </div>
                                        <div className="mt-1 text-xs text-green-700/80 dark:text-green-300/80">
                                            {copy.conflictResolved}
                                        </div>
                                        <div className="mt-1 text-xs text-green-700/80 dark:text-green-300/80">
                                            {copy.prepareQuorumReached}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/30">
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                            {copy.alignedProposal}: {copy.noAlignedProposal}
                                        </div>
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                                                {copy.prepareQuorumMissing}
                                            </div>
                                        {!alignedProposal && prepareApprovals > 0 ? (
                                            <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                {copy.splitVoteWarning}
                                            </div>
                                        ) : null}
                                        {splitNetwork ? (
                                            <div className="mt-2 text-xs text-amber-600 dark:text-amber-300">
                                                {copy.networkSplitWarning}
                                            </div>
                                        ) : null}
                                        {splitNetwork ? (
                                            <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                {copy.splitCorrection}
                                            </div>
                                        ) : null}
                                        {splitNetwork ? (
                                            <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                {copy.multipleProposalsPreventFinality}
                                            </div>
                                        ) : null}
                                        {splitNetwork ? (
                                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                                                {copy.byzantineBridge}
                                            </div>
                                        ) : null}
                                        {tooManyFaulty && (
                                            <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                {lang === "gr"
                                                    ? "Πάρα πολλοί faulty validators — η συναίνεση μπορεί να γίνει αδύνατη."
                                                    : "Too many faulty validators — consensus may become impossible."}
                                            </div>
                                        )}
                                        {!alignedProposal && prepareApprovals > 0 && !splitNetwork ? (
                                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                                                {copy.byzantineBridge}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                                <div className="mt-3 rounded-lg border border-amber-400/80 bg-amber-500/12 px-3 py-2 text-xs text-amber-200">
                                    ⚠ {copy.prepareWarning}
                                </div>
                                <div className="mt-3 rounded-lg border border-red-400/80 bg-red-500/12 px-3 py-2 text-xs text-red-200">
                                    {lang === "gr"
                                        ? "Το QBFT ανέχεται faulty validators όσο λιγότερο από το 1/3 συμπεριφέρεται κακόβουλα."
                                        : "QBFT tolerates faulty validators as long as fewer than 1/3 behave maliciously."}
                                </div>
                            </div>

                            <div className={`rounded-2xl border p-4 ${phase === "commit"
                                    ? "border-indigo-400/70 bg-[#0F172A] text-white"
                                    : "border-slate-700 bg-[#0F172A] text-white"
                                }`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white">
                                        {copy.commitVoteLabel}
                                    </div>
                                    <div className="text-xs text-slate-300">
                                        {copy.approvalsLabel}: {commitApprovals}/{totalValidators} ({copy.quorumLabel} ≥ {threshold})
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-2 flex-1 rounded ${i < commitApprovals
                                                    ? commitApprovals >= threshold
                                                        ? "bg-green-500"
                                                        : "bg-indigo-500"
                                                    : "bg-slate-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 text-xs text-slate-300">
                                    {phase === "commit" ? copy.voteHintCommit : copy.commitLockedHint}
                                </p>
                                <div className="mt-2 text-xs text-indigo-300">
                                    {copy.commitClarifier}
                                </div>
                                {phase === "commit" ? (
                                    <div className="mt-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200">
                                        {copy.commitActionPrompt}
                                    </div>
                                ) : null}
                                {phase === "commit" ? (
                                    <div className="mt-2 text-xs text-indigo-300">
                                        {copy.commitLeaderMessage}
                                    </div>
                                ) : null}
                                {phase === "commit" ? (
                                    <div className="mt-2 text-xs text-indigo-300">
                                        {copy.commitIrreversible}
                                    </div>
                                ) : null}
                                {asyncMode ? (
                                    <div className="mt-2 text-xs text-slate-300">
                                        {copy.asyncTimelineHint}
                                    </div>
                                ) : null}
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/30">
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                        {copy.commitTargetLabel}: {proposalLabel(alignedProposal, copy)}
                                        {alignedLeader ? ` (${copy.proposedBy} ${copy.validatorLabel} ${alignedLeader})` : ""}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {copy.commitConceptBody}
                                    </div>
                                    <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                        {copy.commitWarning}
                                    </div>
                                    {finalized ? (
                                        <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                                            {copy.commitExtraVoteNote}
                                        </div>
                                    ) : null}
                                    {phase === "commit" ? (
                                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            {copy.commitLateVoteExplanation}
                                        </div>
                                    ) : null}
                                    {asyncMode && hasPendingCommit ? (
                                        <div className="mt-2 text-xs text-amber-600 dark:text-amber-300">
                                            {copy.asyncTemporarySplit}
                                        </div>
                                    ) : null}
                                    {asyncMode && hasPendingCommit ? (
                                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            {copy.asyncEventualAgreement}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                                    {["A", "B", "C", "D"].map((id) => (
                                        <button
                                            key={id}
                                            onClick={() => toggleCommitVote(id)}
                                            disabled={phase !== "commit" || (finalized && commitVotes[id]) || pendingCommit[id]}
                                            className={`rounded border px-3 py-2 text-xs disabled:opacity-50 ${commitVotes[id]
                                                    ? "border-green-400 bg-green-100 text-green-800"
                                                    : pendingCommit[id]
                                                        ? "animate-pulse border-sky-400 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200"
                                                        : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                                }`}
                                        >
                                            {copy.validatorLabel} {id} {commitVotes[id] ? "✔" : pendingCommit[id] ? "..." : "✖"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.feedbackTitle}
                    </div>
                    <div className="mt-2 h-px w-full bg-slate-200 dark:bg-slate-700" />

                    {phase === "commit" ? (
                        <div className="mt-3 text-sm font-medium">
                            {finalized ? (
                                <span className="text-green-600 dark:text-green-400">
                                    {copy.finalizedSuccess}
                                </span>
                            ) : (
                                <span className="text-red-600 dark:text-red-400">
                                    {copy.finalizedFailure}
                                </span>
                            )}
                        </div>
                    ) : null}

                    {finalized ? (
                        <div className="mt-3 rounded-xl border-2 border-green-400 bg-green-100/20 px-4 py-3 text-green-700 dark:text-green-300">
                            <div className="text-sm font-semibold">
                                ✔ {copy.finalizedSuccess}
                            </div>
                            <div className="mt-1 text-xs">
                                {copy.finalityEvent}
                            </div>
                            <div className="mt-2 text-xs">
                                {copy.finalityEventStrong}
                            </div>
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                                {copy.finalityBridge}
                            </div>
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                                {copy.byzantineBridge}
                            </div>
                        </div>
                    ) : null}

                    {mode === "faulty" && alignedProposal ? (
                        <div className="mt-3 rounded-lg border border-red-300 bg-red-100/20 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:text-red-300">
                            {copy.faultyConsensusMessage}
                        </div>
                    ) : null}
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.phaseTitle}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-700/40 dark:bg-sky-900/20">
                            <div className="text-sm font-semibold text-sky-900 dark:text-sky-200">
                                {copy.prepareConceptTitle}
                            </div>
                            <div className="mt-2 text-sm text-sky-800 dark:text-sky-100">
                                {copy.prepareConceptBody}
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
                            <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                {copy.commitConceptTitle}
                            </div>
                            <div className="mt-2 text-sm text-emerald-800 dark:text-emerald-100">
                                {copy.commitConceptBody}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-[160px_1fr] bg-slate-100 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                            <div className="px-4 py-3">{copy.phaseColumn}</div>
                            <div className="px-4 py-3">{copy.purposeColumn}</div>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {[
                                { phase: "pre-prepare", purpose: copy.prePrepareCompleted },
                                { phase: "prepare", purpose: copy.phaseStatusPrepare },
                                { phase: "commit", purpose: copy.phaseStatusCommit },
                            ].map((row) => (
                                <div
                                    key={row.phase}
                                    className="grid grid-cols-1 gap-2 px-4 py-4 text-sm md:grid-cols-[160px_1fr]"
                                >
                                    <div
                                        className={`font-semibold ${(row.phase === "pre-prepare" && phase !== "idle") || phase === row.phase
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-900 dark:text-white"
                                            }`}
                                    >
                                        {row.phase}
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-300">
                                        {row.purpose}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.checkpointTitle}
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        {copy.checkpointQuestion}
                    </p>

                    {!finalized ? (
                        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            {copy.checkpointLocked}
                        </div>
                    ) : null}

                    <div className="mt-4 space-y-2">
                        {copy.checkpointOptions.map((option, index) => (
                            <button
                                key={option}
                                type="button"
                                disabled={!finalized}
                                onClick={() => onCheckpointAnswer(index)}
                                className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition disabled:opacity-50 ${answer === index
                                        ? "border-indigo-400 bg-indigo-500/10 text-slate-900 dark:text-white"
                                        : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {feedback === "correct" ? (
                        <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
                            {copy.checkpointCorrect}
                        </div>
                    ) : null}
                    {feedback === "correct" && readyForClaim ? (
                        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                            {copy.checkpointReadyToClaim}
                        </div>
                    ) : null}
                    {feedback === "wrong" ? (
                        <div className="mt-3 text-xs text-red-600 dark:text-red-400">
                            {copy.checkpointWrong}
                        </div>
                    ) : null}
                </section>

                {isComplete ? (
                    <section className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-700 dark:bg-green-900/20">
                        <h2 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
                            {copy.completedLabel}
                        </h2>
                        <p className="mb-4 text-slate-700 dark:text-slate-200">
                            {copy.completedDescription}
                        </p>
                        <LabCompletionClaim
                            labId="system-s4"
                            language={lang}
                            backHref={copy.backHref}
                            backLabel={copy.backLabel}
                            labTitle={copy.title}
                        />
                    </section>
                ) : null}

                <section className="overflow-hidden rounded-2xl border border-cyan-200/60 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_48%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                                {lang === "gr" ? "Σύγκριση συναίνεσης" : "Consensus comparison"}
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold text-white">
                                {copy.comparisonTitle}
                            </h2>
                            <p className="mt-3 max-w-3xl text-sm text-slate-200">
                                {copy.comparisonIntro}
                            </p>
                        </div>
                        <div className="flex gap-2 text-xs font-semibold">
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                                🛡 {copy.comparisonHeaders.pos}
                            </span>
                            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
                                ⚖ {copy.comparisonHeaders.qbft}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
                        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                            <div className="px-4 py-3">{copy.comparisonHeaders.concept}</div>
                            <div className="px-4 py-3 text-emerald-200">{copy.comparisonHeaders.pos}</div>
                            <div className="px-4 py-3 text-cyan-200">{copy.comparisonHeaders.qbft}</div>
                        </div>
                        <div className="divide-y divide-white/10">
                            {copy.comparisonRows.map((row) => (
                                <div
                                    key={row.concept}
                                    className="grid grid-cols-1 gap-3 px-4 py-4 text-sm md:grid-cols-[1.1fr_1fr_1fr] md:gap-4"
                                >
                                    <div className="font-semibold text-white">{row.concept}</div>
                                    <div className="text-slate-200">{row.pos}</div>
                                    <div className="text-slate-200">{row.qbft}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={card}>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {copy.bulletsTitle}
                    </h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                        {copy.bullets.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

            </div>
        </PageShell>
    );
}
