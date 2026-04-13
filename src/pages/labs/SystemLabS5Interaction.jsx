import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ArrowRightLeft,
    CheckCircle2,
    PauseCircle,
    PlayCircle,
    RotateCcw,
    WifiOff,
} from "lucide-react";
import SystemLabTemplate from "./SystemLabTemplate.jsx";
import S5NetworkTopology from "../../components/S5NetworkTopology";

const SCENARIO_KEYS = ["healthy", "minority", "broken", "recovery"];

const CONTENT = {
    en: {
        title: "Network Partition and Recovery in QBFT",
        intro:
            "This lab extends the QBFT flow from the previous system lab into failure conditions. You will start from a healthy validator network, isolate a minority partition, break quorum completely, and finally restore connectivity to observe why safety can survive even when liveness stalls.",
        stepLabel: "Step",
        breadcrumbLabs: "Labs",
        breadcrumbSystemLabs: "System Labs",
        backHref: "/labs/system/s5",
        backLabel: "⬅ Return to Lab Overview",
        completedBadge: "✓ Completed",
        allStepsCompleted: "All guided checks completed",
        controlsTitle: "Simulator Controls",
        processTitle: "Network Simulation",
        notesTitle: "Current Scenario",
        eventsTitle: "Observed Events",
        quickSwitchLabel: "Quick Scenario Switch",
        reflectionTitle: "Checkpoint",
        comparisonTitle: "Key Takeaways",
        simulatorTitle: "QBFT Partition Simulator",
        completionTitle: "🎉 Lab Completed",
        completionDescription:
            "You completed System Lab S5 and explored how QBFT behaves under partition, quorum loss, and recovery.",
        completeInsideInteraction: "All required checkpoints are complete. You can now claim completion for this lab below.",
        successMessage: "✔ Completion recorded successfully",
        completedOn: "Completed on:",
        checkingStatus: "Checking completion status…",
        phaseStatusHealthy:
            "Healthy network: all validators can exchange proposals and votes, so quorum is available and consensus can progress.",
        phaseStatusMinority:
            "Minority partition: one side is isolated, but the connected majority can still coordinate because quorum remains in the larger group.",
        phaseStatusBroken:
            "Quorum-breaking partition: validators still observe local activity, but the full network can no longer finalize safely.",
        phaseStatusRecovery:
            "Recovery: connectivity is restored, quorum becomes available again, and the network can resume coordinated progress.",
        start: "Start",
        pause: "Pause",
        reset: "Reset Lab",
        restore: "Restore Network",
        partition: "Apply Partition",
        currentAction: "Current lab state",
        steps: [
            "Start from a healthy network",
            "Checkpoint 1 — Prediction",
            "Apply a minority partition",
            "Break quorum completely",
            "Checkpoint 2 — Interpretation",
            "Restore connectivity",
            "Checkpoint 3 — Recovery and Safety",
        ],
        instructions: [
            "Start the simulator while the network is healthy. Observe that all validators are connected and the system can progress normally.",
            "Predict what will happen if one validator becomes isolated while the connected majority still retains quorum.",
            "Apply one partition. The minority side loses global visibility, but the majority side still retains quorum.",
            "Apply partition again to move into the quorum-breaking scenario. The network stalls because no side can gather enough votes.",
            "Explain why progress stops in the quorum-breaking scenario.",
            "Restore the network and observe how communication returns across the full validator set.",
            "Connect recovery to quorum, safety, and resumed progress.",
        ],
        bullets: [
            "Partitions challenge liveness first: the protocol may stop progressing without violating safety.",
            "A minority partition does not automatically stop consensus if quorum still exists in the majority partition.",
            "When no partition can assemble quorum, QBFT stalls instead of finalizing conflicting decisions.",
            "Recovery matters because restored communication lets validators resynchronize and continue safely.",
        ],
        scenarios: {
            healthy: {
                name: "Healthy Network",
                summary: "All validators remain connected. Consensus can progress normally.",
                status: "Healthy",
                quorum: "Available",
                notes: [
                    "All validators can exchange proposals and votes.",
                    "The network can reach quorum and finalize blocks normally.",
                    "This is the baseline state for comparing partition behavior.",
                ],
                events: [
                    "All validators are connected.",
                    "Proposal flow is visible across the full network.",
                    "Votes can be collected normally.",
                    "Quorum is available for finalization.",
                ],
            },
            minority: {
                name: "Minority Partition",
                summary: "A minority of validators becomes isolated while the majority remains connected.",
                status: "Partitioned",
                quorum: "Available in majority partition",
                notes: [
                    "The isolated minority cannot drive finalization on its own.",
                    "The connected majority can still continue if quorum is preserved.",
                    "This scenario highlights that liveness may continue in one partition only.",
                ],
                events: [
                    "A minority validator group becomes isolated.",
                    "The majority partition still exchanges proposals and votes.",
                    "The minority observes only partial network activity.",
                    "Finalization can continue only where quorum remains available.",
                ],
            },
            broken: {
                name: "Quorum-Breaking Partition",
                summary: "The network splits in a way that prevents quorum from being reached.",
                status: "Stalled",
                quorum: "Unavailable",
                notes: [
                    "Validators may continue local activity, but no partition can safely finalize.",
                    "This demonstrates loss of liveness without loss of safety.",
                    "The protocol avoids unsafe progress when quorum is unavailable.",
                ],
                events: [
                    "The network is split into isolated groups.",
                    "Validators continue to observe local state only.",
                    "Votes cannot be gathered across the required quorum threshold.",
                    "Finality stalls while safety is preserved.",
                ],
            },
            recovery: {
                name: "Recovery After Partition",
                summary: "Connectivity is restored and validators can resume coordinated progress.",
                status: "Recovered",
                quorum: "Restored",
                notes: [
                    "Reconnected validators can again exchange proposals and votes globally.",
                    "The network resumes progress after the partition ends.",
                    "Recovery highlights why temporary stalls are preferable to unsafe finalization.",
                ],
                events: [
                    "Broken communication links are restored.",
                    "Validators reconnect and resynchronize state visibility.",
                    "Quorum becomes available again.",
                    "Consensus progress can resume safely.",
                ],
            },
        },
        validators: {
            connected: "Connected",
            isolated: "Isolated",
            recovering: "Recovering",
            majority: "Majority Partition",
            minority: "Minority Partition",
            split: "Split Group",
            full: "Full Network",
        },
        checkpoints: {
            cp1: {
                label: "Checkpoint 1 — Prediction",
                question:
                    "If one validator becomes isolated while the other validators remain connected, what is the most likely outcome?",
                options: [
                    "The majority can still continue if quorum remains available.",
                    "The isolated validator can finalize blocks alone.",
                    "The whole network must stop immediately.",
                    "Recovery is required before any validator can vote again.",
                ],
                correctIndex: 0,
                correctFeedback:
                    "Correct. A minority partition does not necessarily stop consensus. If the remaining connected validators still satisfy quorum, the majority partition can continue.",
                wrongFeedback:
                    "Not quite. Focus on whether the connected majority still has enough validators to form quorum.",
            },
            cp2: {
                label: "Checkpoint 2 — Interpretation",
                question:
                    "Why does the network stop finalizing blocks in the quorum-breaking partition scenario?",
                options: [
                    "The leader is offline, so QBFT always stops.",
                    "No partition can gather enough votes to reach quorum safely.",
                    "Validators are forbidden from sending proposals after a partition.",
                    "Recovery automatically pauses all finality until the next round.",
                ],
                correctIndex: 1,
                correctFeedback:
                    "Correct. Validators may still observe local activity, but without enough votes across a valid quorum, the network cannot finalize safely.",
                wrongFeedback:
                    "Look again at the broken scenario. The problem is not that all activity stops, but that no side can safely gather a quorum.",
            },
            cp3: {
                label: "Checkpoint 3 — Recovery and Safety",
                question:
                    "What does recovery restore in the network, and why does that matter?",
                options: [
                    "Recovery rewrites any previously finalized conflicting block.",
                    "Recovery allows a single validator to decide for the network.",
                    "Recovery restores communication across validators, making quorum available again so progress can resume safely.",
                    "Recovery removes the need for quorum in future rounds.",
                ],
                correctIndex: 2,
                correctFeedback:
                    "Correct. Recovery restores communication, which makes quorum available again and allows consensus progress to resume without sacrificing safety.",
                wrongFeedback:
                    "Not quite. Recovery does not undo safety rules. It restores communication so validators can coordinate again.",
            },
        },
        checkpointReadyToClaim:
            "All three checkpoints are complete. You can now claim completion for this lab.",
    },
    gr: {
        title: "Δικτυακός Κατακερματισμός και Ανάκαμψη στο QBFT",
        intro:
            "Αυτό το lab επεκτείνει τη ροή του QBFT από το προηγούμενο system lab σε συνθήκες αστοχίας. Θα ξεκινήσεις από ένα υγιές δίκτυο validators, θα απομονώσεις μια μειοψηφική ομάδα, θα σπάσεις πλήρως το quorum και τέλος θα επαναφέρεις τη συνδεσιμότητα για να δεις γιατί το safety μπορεί να διατηρείται ακόμη κι όταν σταματά το liveness.",
        stepLabel: "Βήμα",
        breadcrumbLabs: "Labs",
        breadcrumbSystemLabs: "System Labs",
        backHref: "/labs-gr/system/s5",
        backLabel: "⬅ Επιστροφή στην Επισκόπηση Lab",
        completedBadge: "✓ Ολοκληρώθηκε",
        allStepsCompleted: "Όλοι οι καθοδηγούμενοι έλεγχοι ολοκληρώθηκαν",
        controlsTitle: "Έλεγχοι Προσομοιωτή",
        processTitle: "Προσομοίωση Δικτύου",
        notesTitle: "Τρέχον Σενάριο",
        eventsTitle: "Παρατηρούμενα Συμβάντα",
        quickSwitchLabel: "Γρήγορη Αλλαγή Σεναρίου",
        reflectionTitle: "Checkpoint",
        comparisonTitle: "Βασικά Συμπεράσματα",
        simulatorTitle: "Προσομοιωτής Partition στο QBFT",
        completionTitle: "🎉 Ολοκλήρωση Lab",
        completionDescription:
            "Ολοκλήρωσες το System Lab S5 και εξερεύνησες πώς συμπεριφέρεται το QBFT υπό partition, απώλεια quorum και ανάκαμψη.",
        completeInsideInteraction:
            "Όλα τα απαιτούμενα checkpoints ολοκληρώθηκαν. Μπορείς τώρα να κάνεις claim την ολοκλήρωση του lab παρακάτω.",
        successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς",
        completedOn: "Ολοκληρώθηκε στις:",
        checkingStatus: "Έλεγχος κατάστασης ολοκλήρωσης…",
        phaseStatusHealthy:
            "Υγιές δίκτυο: όλοι οι validators μπορούν να ανταλλάσσουν proposals και ψήφους, άρα το quorum είναι διαθέσιμο και η συναίνεση μπορεί να προχωρά.",
        phaseStatusMinority:
            "Μειοψηφικό partition: η μία πλευρά απομονώνεται, αλλά η συνδεδεμένη πλειοψηφία συνεχίζει να συντονίζεται επειδή διατηρεί το quorum.",
        phaseStatusBroken:
            "Partition που σπάει το quorum: οι validators συνεχίζουν να βλέπουν τοπική δραστηριότητα, αλλά το συνολικό δίκτυο δεν μπορεί πλέον να οριστικοποιήσει με ασφάλεια.",
        phaseStatusRecovery:
            "Ανάκαμψη: η συνδεσιμότητα αποκαθίσταται, το quorum γίνεται ξανά διαθέσιμο και το δίκτυο μπορεί να επανέλθει σε συντονισμένη πρόοδο.",
        start: "Έναρξη",
        pause: "Παύση",
        reset: "Επαναφορά Lab",
        restore: "Επαναφορά Δικτύου",
        partition: "Εφαρμογή Partition",
        currentAction: "Τρέχουσα κατάσταση lab",
        steps: [
            "Ξεκίνα από ένα υγιές δίκτυο",
            "Checkpoint 1 — Πρόβλεψη",
            "Εφάρμοσε μειοψηφικό partition",
            "Σπάσε πλήρως το quorum",
            "Checkpoint 2 — Ερμηνεία",
            "Επανέφερε τη συνδεσιμότητα",
            "Checkpoint 3 — Ανάκαμψη και Safety",
        ],
        instructions: [
            "Ξεκίνα την προσομοίωση ενώ το δίκτυο είναι υγιές. Παρατήρησε ότι όλοι οι validators είναι συνδεδεμένοι και το σύστημα μπορεί να προχωρά κανονικά.",
            "Πρόβλεψε τι θα συμβεί αν ένας validator απομονωθεί ενώ η συνδεδεμένη πλειοψηφία εξακολουθεί να διατηρεί quorum.",
            "Εφάρμοσε ένα partition. Η μειοψηφία χάνει τη συνολική ορατότητα, αλλά η πλειοψηφία εξακολουθεί να διατηρεί quorum.",
            "Εφάρμοσε ξανά partition για να περάσεις στο σενάριο που σπάει το quorum. Το δίκτυο σταματά επειδή καμία πλευρά δεν μπορεί να συγκεντρώσει αρκετές ψήφους.",
            "Εξήγησε γιατί σταματά η πρόοδος στο broken scenario.",
            "Επανέφερε το δίκτυο και παρατήρησε πώς επιστρέφει η επικοινωνία σε όλο το σύνολο των validators.",
            "Σύνδεσε την ανάκαμψη με το quorum, το safety και την επανέναρξη της προόδου.",
        ],
        bullets: [
            "Τα partitions πιέζουν πρώτα το liveness: το πρωτόκολλο μπορεί να σταματήσει να προχωρά χωρίς να παραβιάζει το safety.",
            "Ένα μειοψηφικό partition δεν σταματά απαραίτητα τη συναίνεση, αν το quorum παραμένει στην πλειοψηφία.",
            "Όταν κανένα partition δεν μπορεί να συγκεντρώσει quorum, το QBFT σταματά αντί να οριστικοποιεί αντικρουόμενες αποφάσεις.",
            "Η ανάκαμψη είναι κρίσιμη επειδή η αποκατάσταση της επικοινωνίας επιτρέπει στους validators να συγχρονιστούν ξανά και να συνεχίσουν με ασφάλεια.",
        ],
        scenarios: {
            healthy: {
                name: "Υγιές Δίκτυο",
                summary: "Όλοι οι validators παραμένουν συνδεδεμένοι. Η συναίνεση εξελίσσεται κανονικά.",
                status: "Υγιές",
                quorum: "Διαθέσιμο",
                notes: [
                    "Όλοι οι validators μπορούν να ανταλλάσσουν proposals και ψήφους.",
                    "Το δίκτυο μπορεί να πετύχει quorum και να οριστικοποιεί blocks κανονικά.",
                    "Αυτή είναι η βασική κατάσταση αναφοράς για τη σύγκριση της συμπεριφοράς υπό partition.",
                ],
                events: [
                    "Όλοι οι validators είναι συνδεδεμένοι.",
                    "Η ροή των proposals είναι ορατή σε όλο το δίκτυο.",
                    "Οι ψήφοι μπορούν να συλλεχθούν κανονικά.",
                    "Το quorum είναι διαθέσιμο για finalization.",
                ],
            },
            minority: {
                name: "Μειοψηφικό Partition",
                summary: "Μια μειοψηφική ομάδα validators απομονώνεται ενώ η πλειοψηφία παραμένει συνδεδεμένη.",
                status: "Σε Partition",
                quorum: "Διαθέσιμο στην πλειοψηφία",
                notes: [
                    "Η απομονωμένη μειοψηφία δεν μπορεί να οδηγήσει μόνη της σε finalization.",
                    "Η συνδεδεμένη πλειοψηφία μπορεί να συνεχίσει αν διατηρείται το quorum.",
                    "Το σενάριο δείχνει ότι το liveness μπορεί να συνεχίζεται μόνο σε ένα partition.",
                ],
                events: [
                    "Μια μειοψηφική ομάδα validators απομονώνεται.",
                    "Η πλειοψηφική ομάδα συνεχίζει να ανταλλάσσει proposals και ψήφους.",
                    "Η μειοψηφία βλέπει μόνο μερική δραστηριότητα του δικτύου.",
                    "Το finalization συνεχίζεται μόνο όπου παραμένει διαθέσιμο το quorum.",
                ],
            },
            broken: {
                name: "Partition που Σπάει το Quorum",
                summary: "Το δίκτυο χωρίζεται με τρόπο που δεν επιτρέπει να επιτευχθεί quorum.",
                status: "Μπλοκαρισμένο",
                quorum: "Μη διαθέσιμο",
                notes: [
                    "Οι validators μπορεί να συνεχίζουν τοπική δραστηριότητα, αλλά κανένα partition δεν μπορεί να οριστικοποιήσει με ασφάλεια.",
                    "Αυτό δείχνει απώλεια liveness χωρίς απώλεια safety.",
                    "Το πρωτόκολλο αποφεύγει μη ασφαλή πρόοδο όταν το quorum δεν είναι διαθέσιμο.",
                ],
                events: [
                    "Το δίκτυο χωρίζεται σε απομονωμένες ομάδες.",
                    "Οι validators βλέπουν μόνο την τοπική τους κατάσταση.",
                    "Οι ψήφοι δεν μπορούν να συγκεντρωθούν πάνω από το απαιτούμενο όριο quorum.",
                    "Το finality σταματά ενώ το safety διατηρείται.",
                ],
            },
            recovery: {
                name: "Ανάκαμψη μετά το Partition",
                summary: "Η συνδεσιμότητα αποκαθίσταται και οι validators μπορούν να επανέλθουν σε συντονισμένη πρόοδο.",
                status: "Ανακάμπτει",
                quorum: "Αποκαταστάθηκε",
                notes: [
                    "Οι validators που επανασυνδέονται μπορούν ξανά να ανταλλάσσουν proposals και ψήφους σε όλο το δίκτυο.",
                    "Το δίκτυο συνεχίζει την πρόοδο μετά το τέλος του partition.",
                    "Η ανάκαμψη δείχνει γιατί οι προσωρινές καθυστερήσεις είναι προτιμότερες από μη ασφαλές finalization.",
                ],
                events: [
                    "Οι διακοπές επικοινωνίας αποκαθίστανται.",
                    "Οι validators επανασυνδέονται και συγχρονίζουν ξανά την ορατότητα της κατάστασης.",
                    "Το quorum γίνεται ξανά διαθέσιμο.",
                    "Η συναίνεση μπορεί να συνεχιστεί με ασφάλεια.",
                ],
            },
        },
        validators: {
            connected: "Συνδεδεμένος",
            isolated: "Απομονωμένος",
            recovering: "Ανακάμπτει",
            majority: "Πλειοψηφικό Partition",
            minority: "Μειοψηφικό Partition",
            split: "Χωρισμένη Ομάδα",
            full: "Πλήρες Δίκτυο",
        },
        checkpoints: {
            cp1: {
                label: "Checkpoint 1 — Πρόβλεψη",
                question:
                    "Αν ένας validator απομονωθεί ενώ οι υπόλοιποι παραμένουν συνδεδεμένοι, ποιο είναι το πιο πιθανό αποτέλεσμα;",
                options: [
                    "Η πλειοψηφία μπορεί να συνεχίσει εφόσον το quorum παραμένει διαθέσιμο.",
                    "Ο απομονωμένος validator μπορεί να οριστικοποιεί blocks μόνος του.",
                    "Όλο το δίκτυο πρέπει να σταματήσει αμέσως.",
                    "Απαιτείται ανάκαμψη πριν μπορέσει οποιοσδήποτε validator να ψηφίσει ξανά.",
                ],
                correctIndex: 0,
                correctFeedback:
                    "Σωστά. Ένα minority partition δεν σταματά απαραίτητα τη συναίνεση. Αν οι συνδεδεμένοι validators εξακολουθούν να καλύπτουν το quorum, η πλειοψηφία μπορεί να συνεχίσει.",
                wrongFeedback:
                    "Όχι ακριβώς. Εστίασε στο αν η συνδεδεμένη πλειοψηφία εξακολουθεί να έχει αρκετούς validators για quorum.",
            },
            cp2: {
                label: "Checkpoint 2 — Ερμηνεία",
                question:
                    "Γιατί το δίκτυο σταματά να οριστικοποιεί blocks στο σενάριο partition που σπάει το quorum;",
                options: [
                    "Ο leader είναι offline, οπότε το QBFT σταματά πάντα.",
                    "Κανένα partition δεν μπορεί να συγκεντρώσει αρκετές ψήφους ώστε να επιτύχει quorum με ασφάλεια.",
                    "Οι validators απαγορεύεται να στέλνουν proposals μετά από partition.",
                    "Η ανάκαμψη παγώνει αυτόματα κάθε finality μέχρι τον επόμενο γύρο.",
                ],
                correctIndex: 1,
                correctFeedback:
                    "Σωστά. Οι validators μπορεί να συνεχίζουν να βλέπουν τοπική δραστηριότητα, αλλά χωρίς αρκετές ψήφους για έγκυρο quorum, το δίκτυο δεν μπορεί να κάνει finalization με ασφάλεια.",
                wrongFeedback:
                    "Κοίτα ξανά το broken scenario. Το πρόβλημα δεν είναι ότι σταματά κάθε δραστηριότητα, αλλά ότι καμία πλευρά δεν μπορεί να συγκεντρώσει με ασφάλεια quorum.",
            },
            cp3: {
                label: "Checkpoint 3 — Ανάκαμψη και Safety",
                question:
                    "Τι αποκαθιστά η ανάκαμψη στο δίκτυο και γιατί αυτό έχει σημασία;",
                options: [
                    "Η ανάκαμψη ξαναγράφει οποιοδήποτε προηγουμένως finalized αντικρουόμενο block.",
                    "Η ανάκαμψη επιτρέπει σε έναν validator να αποφασίζει για όλο το δίκτυο.",
                    "Η ανάκαμψη αποκαθιστά την επικοινωνία μεταξύ validators, κάνοντας το quorum ξανά διαθέσιμο ώστε η πρόοδος να συνεχιστεί με ασφάλεια.",
                    "Η ανάκαμψη καταργεί την ανάγκη για quorum στους επόμενους γύρους.",
                ],
                correctIndex: 2,
                correctFeedback:
                    "Σωστά. Η ανάκαμψη αποκαθιστά την επικοινωνία, κάνει το quorum ξανά διαθέσιμο και επιτρέπει στη συναίνεση να συνεχιστεί χωρίς να θυσιάζεται το safety.",
                wrongFeedback:
                    "Όχι ακριβώς. Η ανάκαμψη δεν αναιρεί τους κανόνες safety. Αποκαθιστά την επικοινωνία ώστε οι validators να μπορέσουν να συντονιστούν ξανά.",
            },
        },
        checkpointReadyToClaim:
            "Και τα τρία checkpoints ολοκληρώθηκαν. Μπορείς τώρα να κάνεις claim την ολοκλήρωση του lab.",
    },
};

function buildValidators(copy, scenarioKey) {
    if (scenarioKey === "minority") {
        return [
            { id: "V1", group: copy.validators.majority, status: copy.validators.connected },
            { id: "V2", group: copy.validators.majority, status: copy.validators.connected },
            { id: "V3", group: copy.validators.majority, status: copy.validators.connected },
            { id: "V4", group: copy.validators.minority, status: copy.validators.isolated },
        ];
    }

    if (scenarioKey === "broken") {
        return [
            { id: "V1", group: copy.validators.split, status: copy.validators.isolated },
            { id: "V2", group: copy.validators.split, status: copy.validators.isolated },
            { id: "V3", group: copy.validators.split, status: copy.validators.isolated },
            { id: "V4", group: copy.validators.split, status: copy.validators.isolated },
        ];
    }

    if (scenarioKey === "recovery") {
        return [
            { id: "V1", group: copy.validators.full, status: copy.validators.recovering },
            { id: "V2", group: copy.validators.full, status: copy.validators.recovering },
            { id: "V3", group: copy.validators.full, status: copy.validators.connected },
            { id: "V4", group: copy.validators.full, status: copy.validators.connected },
        ];
    }

    return [
        { id: "V1", group: copy.validators.full, status: copy.validators.connected },
        { id: "V2", group: copy.validators.full, status: copy.validators.connected },
        { id: "V3", group: copy.validators.full, status: copy.validators.connected },
        { id: "V4", group: copy.validators.full, status: copy.validators.connected },
    ];
}

function getScenarioStatus(copy, scenarioKey) {
    if (scenarioKey === "minority") return copy.phaseStatusMinority;
    if (scenarioKey === "broken") return copy.phaseStatusBroken;
    if (scenarioKey === "recovery") return copy.phaseStatusRecovery;
    return copy.phaseStatusHealthy;
}

export default function SystemLabS5Interaction({ lang = "en" }) {
    const copy = CONTENT[lang] || CONTENT.en;
    const [scenarioKey, setScenarioKey] = useState("healthy");
    const [isRunning, setIsRunning] = useState(false);
    const [visited, setVisited] = useState({
        healthy: false,
        minority: false,
        broken: false,
        recovery: false,
    });
    const [checkpointState, setCheckpointState] = useState({
        cp1: { answer: null, feedback: null },
        cp2: { answer: null, feedback: null },
        cp3: { answer: null, feedback: null },
    });

    const scenario = copy.scenarios[scenarioKey];
    const validators = useMemo(() => buildValidators(copy, scenarioKey), [copy, scenarioKey]);
    const checkpointCompletion = {
        cp1: checkpointState.cp1.feedback === "correct",
        cp2: checkpointState.cp2.feedback === "correct",
        cp3: checkpointState.cp3.feedback === "correct",
    };

    useEffect(() => {
        if (scenarioKey === "healthy" && isRunning) {
            setVisited((current) => (current.healthy ? current : { ...current, healthy: true }));
        }
    }, [scenarioKey, isRunning]);

    useEffect(() => {
        if (scenarioKey === "minority") {
            setVisited((current) => (current.minority ? current : { ...current, minority: true }));
        }
        if (scenarioKey === "broken") {
            setVisited((current) => (current.broken ? current : { ...current, broken: true }));
        }
        if (scenarioKey === "recovery") {
            setVisited((current) => (current.recovery ? current : { ...current, recovery: true }));
        }
    }, [scenarioKey]);

    const stepCompletion = [
        visited.healthy,
        checkpointCompletion.cp1,
        visited.minority,
        visited.broken,
        checkpointCompletion.cp2,
        visited.recovery,
        checkpointCompletion.cp3,
    ];
    const currentStep = stepCompletion.findIndex((item) => !item);
    const isComplete = stepCompletion.every(Boolean);
    const activeCheckpointId =
        visited.healthy && !checkpointCompletion.cp1
            ? "cp1"
            : visited.broken && !checkpointCompletion.cp2
                ? "cp2"
                : visited.recovery && !checkpointCompletion.cp3
                    ? "cp3"
                    : null;
    const activeCheckpoint = activeCheckpointId ? copy.checkpoints[activeCheckpointId] : null;

    const statusTone =
        scenarioKey === "broken"
            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            : scenarioKey === "minority"
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                : "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200";

    const quorumTone =
        scenarioKey === "broken"
            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-200";

    const handleReset = () => {
        setScenarioKey("healthy");
        setIsRunning(false);
        setVisited({
            healthy: false,
            minority: false,
            broken: false,
            recovery: false,
        });
        setCheckpointState({
            cp1: { answer: null, feedback: null },
            cp2: { answer: null, feedback: null },
            cp3: { answer: null, feedback: null },
        });
    };

    const handlePartition = () => {
        setIsRunning(false);

        if (scenarioKey === "healthy" && checkpointCompletion.cp1) {
            setScenarioKey("minority");
            return;
        }

        if (scenarioKey === "minority") {
            setScenarioKey("broken");
            return;
        }

        if (scenarioKey === "recovery") {
            setScenarioKey("minority");
            return;
        }

        setScenarioKey("broken");
    };

    const handleRestore = () => {
        if (scenarioKey !== "broken" || !checkpointCompletion.cp2) {
            return;
        }
        setScenarioKey("recovery");
        setIsRunning(false);
    };

    const handleCheckpoint = (checkpointId, index) => {
        const checkpoint = copy.checkpoints[checkpointId];
        setCheckpointState((current) => ({
            ...current,
            [checkpointId]: {
                answer: index,
                feedback: index === checkpoint.correctIndex ? "correct" : "wrong",
            },
        }));
    };

    const canQuickSwitch = (key) => {
        if (key === "healthy") return true;
        if (key === "minority") return visited.minority;
        if (key === "broken") return checkpointCompletion.cp1 && visited.minority;
        if (key === "recovery") return visited.recovery;
        return false;
    };

    const partitionDisabled =
        scenarioKey === "healthy"
            ? !visited.healthy || !checkpointCompletion.cp1
            : scenarioKey === "broken";
    const restoreDisabled = scenarioKey !== "broken" || !checkpointCompletion.cp2;

    const labels = {
        language: lang,
        breadcrumbLabs: copy.breadcrumbLabs,
        breadcrumbSystemLabs: copy.breadcrumbSystemLabs,
        headerPill: "⛓ Web3Edu · System Lab",
        completedBadge: copy.completedBadge,
        backLabel: copy.backLabel,
        level: lang === "gr" ? "Επίπεδο" : "Level",
        estimatedTime: lang === "gr" ? "Εκτιμώμενος χρόνος" : "Estimated time",
        xp: "XP",
        badgeLabel: lang === "gr" ? "Badge" : "Badge",
        stepsTitle: lang === "gr" ? "Οδηγός Lab" : "Lab Guide",
        stepLabel: copy.stepLabel,
        simulatorTitle: copy.simulatorTitle,
        eventsTitle: copy.eventsTitle,
        takeawaysTitle: copy.comparisonTitle,
        checkpointTitle: copy.reflectionTitle,
        completionTitle: copy.completionTitle,
        completionDescription: copy.completionDescription,
        completeInsideInteraction: copy.completeInsideInteraction,
        successMessage: copy.successMessage,
        completedOn: copy.completedOn,
        checkingStatus: copy.checkingStatus,
    };

    const stepItems = copy.steps.map((title, index) => ({
        label: `${copy.stepLabel} ${index + 1}`,
        title,
        text: copy.instructions[index],
    }));

    const simulatorContent = (
        <div className="overflow-hidden rounded-2xl border border-cyan-200/60 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.96))] p-6 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-cyan-500/20 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94))] dark:text-white dark:shadow-[0_24px_80px_rgba(2,6,23,0.55)]">
            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                {copy.processTitle}
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                {scenario.name}
                            </h2>
                            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
                                {scenario.summary}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsRunning((prev) => !prev)}
                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                            >
                                {isRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                {isRunning ? copy.pause : copy.start}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100 dark:hover:bg-white/[0.08]"
                            >
                                <RotateCcw className="h-4 w-4" />
                                {copy.reset}
                            </button>
                        </div>
                    </div>

                    <S5NetworkTopology
                        language={lang}
                        scenarioKey={scenarioKey}
                        isRunning={isRunning}
                    />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {validators.map((validator) => (
                            <div
                                key={validator.id}
                                className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                            >
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    {validator.id}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                                    {validator.group}
                                </div>
                                <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                                    {validator.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                            {copy.controlsTitle}
                        </div>
                        <div className="mt-4 grid gap-3">
                            <button
                                type="button"
                                onClick={handlePartition}
                                disabled={partitionDisabled}
                                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                    partitionDisabled
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100 dark:hover:bg-amber-400/15"
                                }`}
                            >
                                <WifiOff className="h-4 w-4" />
                                {copy.partition}
                            </button>
                            <button
                                type="button"
                                onClick={handleRestore}
                                disabled={restoreDisabled}
                                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                    restoreDisabled
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
                                        : "border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                                }`}
                            >
                                <ArrowRightLeft className="h-4 w-4" />
                                {copy.restore}
                            </button>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                                {copy.quickSwitchLabel}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {SCENARIO_KEYS.map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={!canQuickSwitch(key)}
                                        onClick={() => {
                                            if (!canQuickSwitch(key)) return;
                                            setScenarioKey(key);
                                            setIsRunning(false);
                                        }}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                            !canQuickSwitch(key)
                                                ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500"
                                                : scenarioKey === key
                                                    ? "border border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"
                                                    : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                                            }`}
                                    >
                                        {copy.scenarios[key].name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-cyan-300 bg-cyan-50 p-3 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                    {copy.notesTitle}
                                </div>
                                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                    {scenario.name}
                                </h3>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3">
                            <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${statusTone}`}>
                                {scenario.status}
                            </div>
                            <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${quorumTone}`}>
                                {scenario.quorum}
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-200">
                                {getScenarioStatus(copy, scenarioKey)}
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {scenario.notes.map((note) => (
                                <div
                                    key={note}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-200"
                                >
                                    {note}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    const eventsContent = (
        <div className="grid gap-4 md:grid-cols-2">
            {scenario.events.map((event) => (
                <div
                    key={event}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-500 dark:text-cyan-300" />
                    <span>{event}</span>
                </div>
            ))}
        </div>
    );

    const takeawaysContent = (
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {copy.bullets.map((bullet) => (
                <div key={bullet}>• {bullet}</div>
            ))}
        </div>
    );

    const checkpointContent = (
        activeCheckpoint ? (
            <>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                    {activeCheckpoint.label}
                </div>
                <div className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                    {activeCheckpoint.question}
                </div>
                <div className="mt-4 space-y-3">
                    {activeCheckpoint.options.map((option, index) => {
                        const isSelected = checkpointState[activeCheckpointId].answer === index;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleCheckpoint(activeCheckpointId, index)}
                                className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                                    isSelected
                                        ? "border-indigo-400 bg-indigo-50 text-slate-900 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-white"
                                        : "border-slate-200 bg-white/85 text-slate-800 hover:border-indigo-200 hover:bg-indigo-50/70 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5"
                                }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {checkpointState[activeCheckpointId].feedback === "correct" ? (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
                        {activeCheckpoint.correctFeedback}
                    </div>
                ) : null}

                {checkpointState[activeCheckpointId].feedback === "wrong" ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        {activeCheckpoint.wrongFeedback}
                    </div>
                ) : null}
            </>
        ) : isComplete ? (
            <>
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
                    {copy.checkpointReadyToClaim}
                </div>
            </>
        ) : null
    );

    return (
        <SystemLabTemplate
            labId="system-s5"
            language={lang}
            title={copy.title}
            subtitle={copy.intro}
            level={lang === "gr" ? "Ενδιάμεσο" : "Intermediate"}
            estimatedTime={lang === "gr" ? "12–15 λεπτά" : "12–15 minutes"}
            xp={400}
            badge={lang === "gr" ? "Εξερευνητής Κατακερματισμού QBFT" : "QBFT Partition Explorer"}
            backHref={copy.backHref}
            kicker={lang === "gr" ? "Συνθήκες Αστοχίας στο QBFT" : "QBFT Failure Conditions"}
            statusBadge={isComplete ? copy.allStepsCompleted : null}
            steps={stepItems}
            currentStep={currentStep < 0 ? stepItems.length : currentStep}
            simulatorContent={simulatorContent}
            eventsContent={eventsContent}
            takeawaysContent={takeawaysContent}
            checkpointContent={checkpointContent}
            showCompletionSection={isComplete}
            wrapSimulatorSection
            labels={labels}
        />
    );
}
