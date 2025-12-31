import React from "react";
import LabTemplate from "./LabTemplate";

import lab02HeroImg from "../../assets/labs/lab02-encrypted-messages-diagram.jpg";

const Lab02GR = () => {
    return (
        <LabTemplate
            labId="lab02"
            title="Lab 02 — Κρυπτογραφημένα Μηνύματα"
            subtitle="Κατανόηση της ιδιωτικής επικοινωνίας στο Web3 μέσω κρυπτογραφικών κλειδιών"
            conceptualFocusText={
                "Αυτό το εργαστήριο εξερευνά πώς λειτουργεί η κρυπτογραφημένη επικοινωνία στο Web3 χρησιμοποιώντας κρυπτογραφία δημοσίου κλειδιού. Θα μάθετε πώς δημιουργούνται ταυτότητες από κλειδιά, πώς κρυπτογραφούνται μηνύματα εκτός blockchain με χρήση δημοσίων κλειδιών και γιατί το blockchain δεν είναι υπεύθυνο για την εμπιστευτικότητα."
            }
            heroImage={lab02HeroImg}
            level="Αρχάριο"
            estimatedTime="10–15 λεπτά"
            tools={[
                "Δημιουργός Κλειδιών",
                "Κρυπτογράφος Μηνυμάτων",
                "Αποκρυπτογράφος Μηνυμάτων",
            ]}
            prerequisites={[
                "Σύγχρονος browser (Chrome / Firefox / Brave)",
                "Βασική κατανόηση πορτοφολιών και διευθύνσεων (Lab 01)",
            ]}
            interactionPath="/labs-gr/lab02/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-02-encrypted-messages/README.md"
            xp={150}
            badge="Εξερευνητής Κρυπτογράφησης"
            completionMessage="Ολοκλήρωση Lab 02 — Κρυπτογραφημένα Μηνύματα"
            labels={{
                tools: "Εργαλεία",
                prerequisites: "Προαπαιτούμενα",
                startLab: "Έναρξη Εργαστηρίου →",
                startLabHint: "Ανοίγει το διαδραστικό εργαστήριο",
                completionTitle: "Ολοκλήρωση Εργαστηρίου",
                completionDescription: "Αφού ολοκληρώσετε το εργαστήριο, υπογράψτε ένα μήνυμα για να καταγραφεί η πρόοδός σας στο Web3Edu.",
                successMessage: "✔ Η ολοκλήρωση καταγράφηκε επιτυχώς"
            }}
        />
    );
};

export default Lab02GR;
