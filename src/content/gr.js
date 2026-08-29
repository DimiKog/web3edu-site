const gr = {
    // -------------------------
    // HERO SECTION
    // -------------------------
    hero: {
        lang: "gr",
        welcome: "Καλώς ήρθατε στο Web3Edu",
        headline: "Μάθε Web3 στην πράξη.\nΑπόδειξε όσα μαθαίνεις.",
        tagline: "Απόδειξη μάθησης, όχι απλή παρουσία",
        desc: "Μάθε blockchain μέσα από πραγματικά labs, on-chain δραστηριότητες και εφαρμοσμένα projects — με επαληθεύσιμη πρόοδο που γίνεται μέρος της Web3Edu μαθησιακής σου ταυτότητας.",
        cta: "Ξεκίνα να μαθαίνεις",
        ctaHref: "/#/start-here-gr",
        secondaryCta: "Εξερεύνησε το Web3Edu",
        exploreSectionId: "home-explore",
    },

    // -------------------------
    // MOTIVATION SECTION
    // -------------------------
    motivation: {
        heading: "Γιατί Web3Edu;",
        detailHeading: "Η αποστολή μας",
        badgeText: "Γιατί η μάθηση του Web3 πρέπει να σας ενδυναμώνει.",
        summary: "Το Web3Edu μετατρέπει τη μάθηση σε πρακτική και επαληθεύσιμη ταυτότητα. Οι εκπαιδευόμενοι χρησιμοποιούν πραγματικές Web3 ροές, ολοκληρώνουν hands-on labs και μεταφέρουν την πρόοδό τους μέσα στην πλατφόρμα.",
        points: [
            {
                title: "Μάθηση μέσω αλληλεπίδρασης",
                description: "Τα labs και τα εργαλεία οδηγούν τους εκπαιδευόμενους σε wallets, signatures, transactions, consensus και governance.",
            },
            {
                title: "Επαληθεύσιμη πρόοδος",
                description: "Η ολοκλήρωση, το XP και η κατάσταση της ταυτότητας δίνουν σε κάθε εκπαιδευόμενο ένα σταθερό αποτύπωμα προόδου.",
            },
            {
                title: "Πορεία προς συνεισφορά",
                description: "Η διαδρομή οδηγεί από τα θεμέλια σε participation research, builder projects και εφαρμοσμένο πειραματισμό.",
            },
        ],
        body: `Το Web3Edu αντιμετωπίζει τη μάθηση ως θεμελιώδη έννοια του Web3 — όχι ως περιεχόμενο προς κατανάλωση, αλλά ως ταυτότητα που οικοδομείται.

Οι συμμετέχοντες αναπτύσσουν πραγματικές δεξιότητες blockchain μέσα από πρακτικά εργαστήρια, πειράματα και άμεση αλληλεπίδραση με αποκεντρωμένα συστήματα. Κάθε βήμα προόδου είναι επαληθεύσιμο, συνθετικό και επαναχρησιμοποιήσιμο σε όλο το οικοσύστημα.

Με evidence-backed αρχεία προόδου και δομημένες διαδρομές συνεισφοράς, η μάθηση δεν σταματά με την ολοκλήρωση. Εξελίσσεται μέσα από συνεργασία, εφαρμοσμένο πειραματισμό και participation research.`,
    },

    // -------------------------
    // LEARNING JOURNEY (Home)
    // -------------------------
    learningJourney: {
        badge: "Μαθησιακή Διαδρομή",
        title: "Πώς λειτουργεί το Web3Edu",
        subtitle:
            "Μάθε τις βασικές έννοιες, εφάρμοσέ τες στην πράξη, μετέτρεψε τη δουλειά σου σε επαληθεύσιμη πρόοδο και χτίσε μια μαθησιακή ταυτότητα που εξελίσσεται μαζί σου.",
        progression: ["Μάθε", "Κάνε", "Επαλήθευσε", "Χτίσε"],
        stages: [
            {
                id: "learn",
                label: "01 · ΜΑΘΕ",
                shortLabel: "ΜΑΘΕ",
                title: "Κατανόησε τις βασικές έννοιες",
                description:
                    "Χτίσε τις βάσεις σου στο blockchain, το consensus, τα wallets, τα smart contracts και το Web3 μέσα από καθοδηγούμενη μάθηση.",
                cta: { label: "Ξεκίνα εδώ", href: "/#/start-here-gr" },
            },
            {
                id: "do",
                label: "02 · ΚΑΝΕ",
                shortLabel: "ΚΑΝΕ",
                title: "Εφάρμοσέ τα στην πράξη",
                description:
                    "Ολοκλήρωσε hands-on labs, χρησιμοποίησε wallets και transactions, κάνε deploy smart contracts και εξερεύνησε πραγματική blockchain υποδομή.",
                cta: { label: "Εξερεύνησε τα Labs", href: "/#/labs-gr" },
            },
            {
                id: "verify",
                label: "03 · ΕΠΑΛΗΘΕΥΣΕ",
                shortLabel: "ΕΠΑΛΗΘΕΥΣΕ",
                title: "Μετέτρεψε τη δραστηριότητα σε αποδείξεις",
                description:
                    "Τα ολοκληρωμένα labs, challenges και on-chain actions μετατρέπονται σε τεκμηριωμένη, επαληθεύσιμη μαθησιακή πρόοδο — όχι απλώς σε καταγραφή παρουσίας.",
            },
            {
                id: "own",
                label: "04 · ΧΤΙΣΕ",
                shortLabel: "ΧΤΙΣΕ",
                title: "Χτίσε τη μαθησιακή σου ταυτότητα",
                description:
                    "XP, επιτεύγματα και credentials συνθέτουν μια διαρκή Web3Edu μαθησιακή ταυτότητα, με σημαντικά ορόσημα που μπορούν να επαληθευτούν on-chain.",
            },
        ],
    },

    availableNow: {
        badge: "Διαθέσιμο Τώρα",
        title: "Τι μπορείς να κάνεις σήμερα",
        description:
            "Μάθε, δημιούργησε και επαλήθευσε την πρόοδό σου σε ένα πραγματικό Web3 μαθησιακό περιβάλλον.",
        capabilities: [
            {
                id: "labs",
                icon: "labs",
                title: "Hands-on Labs",
                description:
                    "Μάθε έννοιες του blockchain μέσα από καθοδηγούμενες πρακτικές δραστηριότητες, από τις βασικές αρχές έως το deployment και την αλληλεπίδραση με smart contracts.",
                cta: { label: "Εξερεύνησε τα Labs", href: "/#/labs-gr" },
            },
            {
                id: "onchain",
                icon: "onchain",
                title: "Blockchain στην πράξη",
                description:
                    "Χρησιμοποίησε wallets, transactions και smart contracts στο ζωντανό Besu Edu-Net, δουλεύοντας με πραγματική blockchain υποδομή.",
                cta: { label: "Ξεκίνα να μαθαίνεις", href: "/#/start-here-gr" },
            },
            {
                id: "progress",
                icon: "progress",
                title: "Επαληθεύσιμη Πρόοδος",
                description:
                    "Η ολοκληρωμένη δουλειά σου μετατρέπεται σε XP, επιτεύγματα και τεκμηριωμένη μαθησιακή πρόοδο — όχι απλώς σε καταγραφή παρουσίας.",
            },
            {
                id: "identity",
                icon: "identity",
                title: "Web3Edu Μαθησιακή Ταυτότητα",
                description:
                    "Χτίσε ένα διαρκές μαθησιακό προφίλ όπου συγκεντρώνονται επιτεύγματα και credentials, με σημαντικά ορόσημα που αγκυρώνονται on-chain.",
                cta: { label: "Web3Edu Ταυτότητα", href: "/#/join-gr" },
            },
        ],
        alsoExplore: {
            label: "Εξερεύνησε επίσης",
            links: [
                { label: "Proof of Escape", href: "/#/labs-gr/proof-of-escape" },
                { label: "Developer Tools", href: "/#/tools-gr" },
                { label: "Builder Projects", href: "/#/projects-gr" },
            ],
        },
        productPreview: {
            eyebrow: "Μέσα στο Web3Edu",
            title: "Πραγματική πρόοδος. Επαληθεύσιμα ορόσημα.",
            description:
                "Η μαθησιακή σου διαδρομή, τα XP, τα επιτεύγματα και το επαληθεύσιμο προφίλ σου συνδυάζονται σε ένα ενιαίο μαθησιακό περιβάλλον.",
            dashboardAlt: "Web3Edu dashboard με επόμενα βήματα, πρόοδο, XP και badges",
            profileAlt: "Web3Edu επαληθεύσιμο προφίλ με verified milestone status",
        },
    },

    teamTrust: {
        title: "Αναπτύσσεται μέσα από έρευνα και operational pilots",
        description:
            "Το Web3Edu συνδυάζει εκπαιδευτικά pilots, blockchain infrastructure, έρευνα αποκεντρωμένης ταυτότητας και hands-on τεχνικό πειραματισμό μέσα σε πραγματικά μαθησιακά περιβάλλοντα.",
        href: "/#/team-gr",
        cta: "Γνώρισε την Ομάδα",
    },

    // -------------------------
    // DAO SECTION
    // -------------------------
    dao: {
        title: "Μελλοντική Συμμετοχή & Διακυβέρνηση",
        desc: "Το Web3Edu διερευνά πώς η επαληθευμένη μαθησιακή δραστηριότητα μπορεί μελλοντικά να υποστηρίξει τη συμμετοχή σε αποφάσεις σχετικά με μαθησιακές διαδρομές, πιλοτικές δράσεις και τη διακυβέρνηση της πλατφόρμας.",
        imageCaption: "Έρευνα πάνω σε μοντέλα συμμετοχής, πειράματα διακυβέρνησης και μηχανισμούς ανατροφοδότησης της κοινότητας.",
        buttons: {
            learn: "Διαβάστε την Έρευνα Διακυβέρνησης",
            enter: "Προεπισκόπηση Συμμετοχής",
        },
    },

    // -------------------------
    // -------------------------
    // WHAT'S NEW (platform changelog)
    // -------------------------
    whatsNew: {
        items: [
            {
                id: "walletless-first-learning",
                category: "update",
                date: "2026-08-29",
                title: "Walletless-first μάθηση",
                description: "Ξεκίνα με τον Web3Edu Account σου και σύνδεσε πορτοφόλι μόνο όταν μια μαθησιακή δραστηριότητα χρειάζεται Web3 αλληλεπίδραση.",
                href: "#/start-here-gr",
                cta: "Ξεκίνα εδώ",
            },
            {
                id: "easier-web3edu-sign-in",
                category: "identity",
                date: "2026-05-08",
                title: "Πιο εύκολη σύνδεση στο Web3Edu",
                description: "Χρησιμοποίησε Google Sign-In για πιο γρήγορη πρόσβαση στο Web3Edu, με Account Abstraction που υποστηρίζει μια πιο ομαλή πορεία προς wallet-based μαθησιακή ταυτότητα.",
                href: "#/start-here-gr",
                cta: "Ξεκίνα τη σύνδεση",
            },
            {
                id: "pos-visualizer-v2",
                category: "tool",
                date: "2026-04-10",
                title: "PoS Visualizer — Βελτιωμένο",
                description: "Τα υπόλοιπα των validators αυξάνονται πλέον με τις αμοιβές finalization. Περιλαμβάνει ανάλυση αμοιβών, βελτιωμένο mempool και επισήμανση βασικών αριθμών στο info panel.",
                href: "#/tools-gr/pos",
                cta: "Εξερεύνηση Εργαλείου",
                image: "/assets/previews/pos-visualizer.webp",
                links: [
                    { label: "Όλα τα Εργαλεία", href: "#/tools-gr" },
                    { label: "SystemLab S3 — Consensus Under Pressure", href: "#/labs-gr/system/s3" },
                ],
            },
            {
                id: "system-labs-s0-s4",
                category: "lab",
                date: "2026-04-08",
                title: "6 System Labs Διαθέσιμα",
                description: "Διαδραστικά σενάρια συναίνεσης σε έξι labs (S0-S5) — καλύπτουν συμπεριφορά κόμβων, Byzantine faults, quorums validators και QBFT finality.",
                href: "#/labs-gr",
                cta: "Εξερεύνηση Labs",
            },
            {
                id: "visual-tools-pow-pos",
                category: "tool",
                date: "2026-04-07",
                title: "PoW & PoS Οπτικά Εργαλεία",
                description: "Δύο διαδραστικά εργαλεία: εξερεύνησε mining δυσκολία και αναζήτηση nonce στο PoW, και stake-weighted επιλογή validator με attestation στο PoS.",
                href: "#/tools-gr",
                cta: "Άνοιγμα Εργαλείων",
            },
            {
                id: "builder-projects",
                category: "project",
                date: "2026-04-04",
                title: "2 Builder Projects Διαθέσιμα",
                description: "Πρακτικά project paths για Builders που είναι έτοιμοι να προχωρήσουν πέρα από τα labs σε εφαρμοσμένη ανάπτυξη blockchain.",
                href: "#/projects-gr",
                cta: "Δες τα Projects",
            },
            {
                id: "builder-readiness-dashboard",
                category: "update",
                date: "2026-04-03",
                title: "Έτοιμος να γίνεις Builder;",
                description: "Ολοκλήρωσε πρώτα τα Core Labs και μετά δες το block προτάσεων στο dashboard για να δεις ποια labs και ποιο Builder path σου ταιριάζουν στη συνέχεια.",
                href: "#/dashboard-gr",
                cta: "Πήγαινε στο Dashboard",
            },
        ],
    },

    // NEWS & EVENTS
    // -------------------------
    news: {
        title: "Νέα και Εκδηλώσεις",
        badge: "Χρονολόγιο / Agenda",
        subtitle: "Ενημερωθείτε για εκθέσεις, παρουσιάσεις έργων και βασικές ανακοινώσεις από το οικοσύστημα Web3Edu.",
        viewArchive: "Προβολή αρχείου",
        items: [
            {
                category: "release",
                date: "1/03/2026",
                title: "Web3Edu Platform — Δημόσια Κυκλοφορία",
                desc: "Δημόσια διάθεση της πλατφόρμας Web3Edu, με πρόσβαση στη μαθησιακή εμπειρία, στα θεμελιώδη labs και στην identity-driven πρόοδο.",
            },
            {
                category: "event",
                date: "9/03/2026",
                title: "1ο Web3Edu Workshop",
                desc: "Η εκδήλωση όπου έγινε η παρουσίαση της πλατφόρμας στο Πανεπιστήμιο Δυτικής Αττικής.",
            },
            {
                category: "update",
                date: "Δεκέμβριος 2025",
                title: "Ορόσημο Ανάπτυξης της Πλατφόρμας Web3Edu",
                desc: "Τα βασικά θεμελιώδη labs και η υποδομή μάθησης ολοκληρώθηκαν εσωτερικά πριν από τη δημόσια κυκλοφορία του Web3Edu.",
            },
            {
                category: "event",
                date: "Νοέμβριος 2025",
                title: "Έκθεση Proof of Escape στο Φεστιβάλ UNOVATE",
                desc: "Δημόσια έκθεση του έργου Proof of Escape (PoE), με παρουσίαση της εμπειρίας παιχνιδιού Festival Edition και επιτόπιο Web3 onboarding.",
            },
            {
                category: "update",
                date: "Οκτώβριος 2025",
                title: "Proof of Escape — Festival Edition Ολοκληρώθηκε",
                desc: "Η ειδική έκδοση Festival Edition του Proof of Escape ολοκληρώθηκε και προετοιμάστηκε για ζωντανή δημόσια επίδειξη.",
            },
        ]
    },

    // -------------------------
    // FOOTER
    // -------------------------
    footer: {
        name: "Πρωτοβουλία Web3Edu",
        role: "Ένα κοινοτικά υποστηριζόμενο οικοσύστημα εκπαίδευσης Web3",
        site: "Επισκεφτείτε την ιστοσελίδα μας",

        nav: {
            home: "Αρχική",
            about: "Σχετικά",
            team: "Ομάδα",
            dao: "Έρευνα Διακυβέρνησης",
            contact: "Επικοινωνία",
            news: "Νέα",
            startHere: "Ξεκίνα εδώ",
        },

        socials: {
            github: "GitHub",
            linkedin: "LinkedIn",
            discord: "Discord",
        }
    },

    // -------------------------
    // GLOBAL
    // -------------------------
    langSwitch: "Switch to English",
};

export default gr;
