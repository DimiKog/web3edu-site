import React from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../../context/IdentityContext.jsx";
import LabTemplate from "./LabTemplate";
import daoLab01HeroImg from "../../assets/labs/daolab01.webp";
import { useLabAutoStartOnce } from "../../hooks/useLabAutoStartOnce.js";

const DaoLab01GR = () => {
    const { address } = useAccount();
    const { smartAccount } = useIdentity();
    useLabAutoStartOnce({ labId: "dao01", smartAccount, address });

    return (
        <LabTemplate
            labId="dao01"
            title="DAO Lab 01 — 🗳 Διακυβέρνηση & Ψηφοφορία"
            subtitle="Εξερεύνησε προτάσεις, δύναμη ψήφου και συλλογικές αποφάσεις μέσα από μια προσομοίωση DAO"
            conceptualFocusText="Το εργαστήριο αυτό εισάγει την αποκεντρωμένη διακυβέρνηση μέσα από μια καθοδηγούμενη προσομοίωση ψηφοφορίας σε DAO. Θα εξερευνήσεις πώς δημιουργούνται οι προτάσεις, πώς λειτουργεί η δύναμη ψήφου και πώς διαμορφώνονται συλλογικές αποφάσεις, χρησιμοποιώντας πραγματικές υπογραφές πορτοφολιού σε ένα ελεγχόμενο, εκπαιδευτικό περιβάλλον."
            heroImage={daoLab01HeroImg}
            level="Μεσαίο επίπεδο"
            estimatedTime="10 λεπτά"
            tools={[
                "Προσομοιωτής προτάσεων",
                "Ροή υπογραφής μέσω πορτοφολιού",
                "Οπτικοποίηση καταμέτρησης ψήφων",
            ]}
            prerequisites={[
                "Σύγχρονος περιηγητής (Chrome / Firefox / Brave)",
                "Πορτοφόλι στον περιηγητή (MetaMask ή ισοδύναμο)",
                "Πρόσβαση μόνο για ανάγνωση στο περιβάλλον προσομοίωσης DAO",
            ]}
            interactionPath="/labs-gr/dao-01/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs"
            xp={400}
            badge="Εξερευνητής Διακυβέρνησης"
            labels={{
                headerPill: "🧪 Web3Edu · Εργαστήριο DAO",
                heroCaption:
                    "Η διακυβέρνηση γίνεται απτή μέσα από προτάσεις, δύναμη ψήφου και συλλογική πρόθεση.",
                conceptualFocus: "Εννοιολογική εστίαση",
                breadcrumbLabs: "Εργαστήρια",
                level: "Επίπεδο",
                estimatedTime: "Εκτιμώμενος χρόνος",
                tools: "Εργαλεία",
                prerequisites: "Προαπαιτούμενα",
                startLab: "Έναρξη Εργαστηρίου →",
                startLabInteractionHint: "Ανοίγει το διαδραστικό εργαστήριο στο Web3Edu",

                // Completion / Claim section
                completionTitle: "Ολοκλήρωση Εργαστηρίου",
                completionDescription:
                    "Αφού ολοκληρώσετε το εργαστήριο, υπογράψτε ένα μήνυμα για να καταγραφεί η πρόοδός σας στο Web3Edu.",
                claimButton: "✅ Δήλωση Ολοκλήρωσης",
                claimingButton: "Υπογραφή…",
                successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς",
                walletNotConnectedError: "Το πορτοφόλι δεν είναι συνδεδεμένο",
                labIdMissingError: "Λείπει το αναγνωριστικό του εργαστηρίου",
                backendError: "Σφάλμα κατά την καταγραφή της ολοκλήρωσης",
            }}
        />
    );
};

export default DaoLab01GR;
