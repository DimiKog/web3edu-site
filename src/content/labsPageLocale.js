/**
 * Copy and static lab metadata for {@link ../pages/Labs.jsx} (EN + GR).
 * Routes use {@link LabsLocale#pathPrefix}; lab links are built in the page.
 */

/** @typedef {typeof LABS_LOCALES.en} LabsLocale */

export const LABS_LOCALES = {
    en: {
        pathPrefix: "/labs",
        categoryLabels: {
            foundational: "Foundational Labs",
            dao: "DAO & Governance Labs",
            project: "Applied Labs",
        },
        categoryBadgeLabel: {
            foundational: "Foundational",
            coding: "Coding",
            system: "System",
            dao: "DAO",
            project: "Applied",
        },
        categoryDescriptions: {
            foundational:
                "Build core Web3 mental models before moving into governance and deeper protocol mechanics.",
            dao:
                "Explore decentralized governance, collective decision-making, and DAO mechanics through guided simulations and real cryptographic actions.",
            project:
                "Applied labs and project-style challenges that connect the core concepts to more complete Web3 flows.",
        },
        foundationalCopy: {
            lab02: {
                title: "Lab 02 — 🔐 Encrypted Messages",
                hint: "Privacy in Web3 starts off‑chain with encryption.",
                description:
                    "Learn how encrypted communication works in Web3 using public‑key cryptography and off‑chain message encryption — without blockchain transactions or smart contracts.",
            },
            lab03: {
                title: "Lab 03 — ✍️ Message Signing & Ownership",
                hint: "Signatures prove ownership and intent without spending gas.",
                description:
                    "Learn how cryptographic signatures prove ownership and intent — without revealing private keys or sending on‑chain transactions.",
            },
            lab04: {
                title: "Lab 04 — ⛽ Transactions & Gas",
                hint: "On‑chain actions cost gas and permanently change state.",
                description:
                    "Interact with your first blockchain transaction and learn how gas, execution, and state changes work on-chain.",
            },
            lab05: {
                title: "Lab 05 — 📜 Smart Contracts & State",
                hint: "READ is a free call; WRITE is a transaction.",
                description:
                    "Interact with a real smart contract and learn how on‑chain state, reads, and writes work.",
            },
            lab06: {
                title: "Lab 06 — ⚙️ Consensus & Finality",
                hint: "Consensus picks one chain; finality locks it.",
                description:
                    "Explore how validators reach agreement and when blocks become truly final.",
            },
        },
        daoCopy: {
            dao01: {
                title: "DAO Lab 01 — 🗳️ Governance & Voting",
                hint: "A wallet signature is a vote — no transaction needed, no gas spent.",
                description:
                    "Participate in a simulated DAO governance process and cast a real vote using your wallet signature. Learn how proposals, voting power, and collective decision-making work in DAOs — without deploying a production system.",
                level: "Intermediate",
                badge: "Governance Participant",
            },
            dao02: {
                title: "DAO Lab 02 — 🏛 Governance Models & Power Dynamics",
                hint: "Governance rules are code — the same votes produce different outcomes depending on how power is distributed.",
                description:
                    "Explore how governance outcomes depend on rule design. Select different voting models, adjust quorum and approval thresholds, and observe how identical community intent can lead to different results depending on how voting power is distributed.",
                level: "Advanced",
                badge: "Governance Architect",
            },
        },
        projectCopy: {
            poe01: {
                title: "Lab 01 — 🧠 Proof of Escape",
                description:
                    "A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.",
                level: "Beginner",
            },
            "proof-of-escape": {
                title: "Lab 01 — 🧠 Proof of Escape",
                hint: "Completion is on-chain — your NFT badge is cryptographic proof you understood the concepts.",
                description:
                    "A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.",
                level: "Beginner",
                badge: "Proof of Escape",
            },
        },
        codingLabs: [
            {
                id: "coding01",
                title: "Coding Lab 01 — ✍️ Write and Deploy Your First Smart Contract",
                hint: "Building begins with deployment — write a minimal contract, compile it, and launch your own on-chain instance.",
                description:
                    "Create your first Solidity contract, compile it in Remix, deploy it to Besu Edu-Net, and verify that your own contract instance is live on-chain. This lab introduces the full path from source code to deployed smart contract.",
                level: "Beginner",
                xp: 400,
                badge: "Smart Contract Deployer",
            },
        ],
        systemLabs: [
            {
                id: "system-s0",
                title: "System Lab S0 — 🏰 Why Consensus Is Hard",
                hint: "Consensus exists because honest participants can still see different local realities.",
                description:
                    "Explore the Byzantine Generals Problem and see why distributed systems need explicit consensus rules before they can agree safely.",
                level: "Intermediate",
                xp: 200,
                cta: "Open Lab →",
                badge: "Consensus Analyst",
            },
            {
                id: "system-s1",
                title: "SysLab01 — ⛏️ PoW Mining",
                hint: "Changing one byte invalidates every block that follows — this is why blockchains are tamper-evident.",
                description:
                    "Trace how blocks connect into a secure chain, break that chain by editing data, and repair it through Proof of Work intuition.",
                level: "Intermediate",
                xp: 300,
                cta: "Open Lab →",
                badge: "System Thinker",
            },
            {
                id: "system-s2",
                title: "SysLab02 — 🔄 Transaction to State Change",
                hint: "Transactions do not just move data around. They trigger execution that changes blockchain state.",
                description:
                    "Follow how a transaction is executed by the system and how that execution results in a persistent state change on-chain.",
                level: "Intermediate",
                xp: 300,
                cta: "Open Lab →",
                badge: "State Change Explorer",
            },
            {
                id: "system-s3",
                title: "System Lab S3 — 🛡️ Consensus Under Pressure",
                hint: "A proposer can suggest a block, but the system accepts it only when enough stake attests and pushes it past the 2/3 threshold.",
                description:
                    "Stress-test proof-of-stake by changing validator stake, observing proposer selection, and checking when attestation is strong enough to reach finality.",
                level: "Intermediate",
                xp: 350,
                cta: "Open Lab →",
                badge: "Consensus Stress Tester",
            },
            {
                id: "system-s4",
                title: "System Lab S4 — 🏛️ QBFT on Besu",
                hint: "In a permissioned chain, consensus comes from a known validator set coordinating through explicit voting rounds.",
                description:
                    "Compare proof-of-stake with QBFT and follow how pre-prepare, prepare, and commit phases let known validators finalize blocks on Besu Edu-Net.",
                level: "Intermediate",
                xp: 350,
                cta: "Open Lab →",
                badge: "QBFT Observer",
            },
            {
                id: "system-s5",
                title: "System Lab S5 — 🌐 Network Partition and Recovery in QBFT",
                hint: "When quorum breaks, safety can remain intact even while liveness stalls.",
                description:
                    "Explore how QBFT behaves when validators are split across a network partition, why finality pauses without quorum, and how coordinated progress resumes after recovery.",
                level: "Intermediate",
                xp: 400,
                cta: "Open Lab →",
                badge: "Partition Analyst",
            },
        ],
        ui: {
            heroTitle: "Web3Edu Labs",
            heroSubtitle:
                "Hands-on exercises that take you from wallet basics to governance mechanics and applied Web3 challenges — each lab builds on the last.",
            loadingLabs: "Loading labs...",
            emptyRegistry: "No labs were returned by the backend registry.",
            foundationalSectionTitle: "Foundational Labs",
            foundationalSectionBlurb:
                "Build your Web3 identity and core mental models before touching transactions or smart contracts.",
            progressLabel: "Foundational Labs Progress",
            progressCountSuffix: "completed",
            featuredLabAlt:
                "Web3 identity flow: wallet to address to identity",
            featuredDefaultTitle: "Lab 01 — Wallets & Web3 Identity",
            featuredPedagogy:
                "Your wallet is your Web3 identity — before transactions ever happen.",
            metaLevel: "Level:",
            metaTime: "Time:",
            metaNetwork: "Network:",
            metaTransactions: "Transactions:",
            metaTransactionsNone: "None",
            metaTools: "Tools:",
            metaToolsCount: "3 interactive tools",
            metaBadge: "Badge:",
            metaTimeUnit: "minutes",
            defaultBadge: "Identity Explorer",
            startLabCta: "Start Lab →",
            pedagogyHintLabel: "Pedagogy hint:",
            completedBadge: "✓ Completed",
            nextBadge: "⭐ NEXT",
            openLabCta: "Open Lab →",
            timeMinShort: "min",
            badgePrefix: "Badge:",
            codingSectionTitle: "Coding Labs",
            codingSectionBlurb:
                "Hands-on labs focused on writing, deploying, and interacting with smart contracts and Web3 code. These labs shift from observation to building.",
            comingSoon: "Coming soon",
            systemSectionTitle: "System Labs",
            systemSectionBlurb:
                "Explore blockchain mechanics as a system, starting with why consensus is needed at all and then moving into how hashes, links, mining, and execution secure chain history.",
            daoSectionTitle: "DAO & Governance Labs",
            daoSectionBlurb:
                "Explore decentralized governance, collective decision-making, and DAO mechanics through guided simulations and real cryptographic actions.",
            appliedSectionTitle: "Applied Labs",
            appliedSectionBlurb:
                "Scenario-driven challenges that put your knowledge to work — combining on-chain interaction, gamification, and real-world problem solving.",
            proofOfEscapeTitle: "Lab 01 — 🧠 Proof of Escape",
            proofOfEscapeHint:
                "Completion is on-chain — your NFT badge is cryptographic proof you understood the concepts.",
            proofOfEscapeDescription:
                "A gamified Web3 challenge combining quizzes, NFTs, and on-chain verification to introduce core blockchain concepts.",
            proofOfEscapeBadge: "Proof of Escape",
            proofOfEscapeLevel: "Beginner",
            nftMarketplaceTitle: "Lab 02 — 🖼 NFT Marketplace Lab",
            nftMarketplaceHint:
                "Token standards define ownership rules — an NFT is a unique on-chain record no one can duplicate.",
            nftMarketplaceDescription:
                "Build and interact with a simple NFT marketplace while learning token standards, ownership, and on-chain events.",
            nftMarketplaceLevel: "Intermediate",
            nftComingSoonBadge: "Coming Soon",
            nftComingSoonFooter: "Coming Soon",
            otherCategoryFallback: "Labs exposed by the backend registry.",
            statusAvailable: "Available",
            statusCompleted: "Completed",
            defaultDaoLevelFallback: "Intermediate",
        },
    },
    gr: {
        pathPrefix: "/labs-gr",
        categoryLabels: {
            foundational: "Θεμελιώδη Labs",
            dao: "Εργαστήρια DAO & Διακυβέρνησης",
            project: "Εφαρμοσμένα Εργαστήρια",
        },
        categoryBadgeLabel: {
            foundational: "Θεμελιώδες",
            coding: "Προγραμματισμός",
            system: "Σύστημα",
            dao: "DAO",
            project: "Εφαρμοσμένο",
        },
        categoryDescriptions: {
            foundational:
                "Χτίσε τα βασικά νοητικά μοντέλα του Web3 πριν περάσεις σε governance και βαθύτερους μηχανισμούς πρωτοκόλλου.",
            dao:
                "Εξερευνήστε την αποκεντρωμένη διακυβέρνηση, τη συλλογική λήψη αποφάσεων και τους μηχανισμούς DAO μέσω καθοδηγούμενων προσομοιώσεων και πραγματικών κρυπτογραφικών ενεργειών.",
            project:
                "Εφαρμοσμένα labs και project-style προκλήσεις που συνδέουν τις βασικές έννοιες με πιο ολοκληρωμένες Web3 ροές.",
        },
        foundationalCopy: {
            lab02: {
                title: "Lab 02 — 🔐 Κρυπτογραφημένα Μηνύματα",
                hint: "Η ιδιωτικότητα στο Web3 ξεκινά εκτός αλυσίδας με κρυπτογράφηση.",
                description:
                    "Μάθετε πώς λειτουργεί η κρυπτογραφημένη επικοινωνία στο Web3 με κρυπτογραφία δημοσίου κλειδιού και off-chain κρυπτογράφηση — χωρίς συναλλαγές ή smart contracts.",
            },
            lab03: {
                title: "Lab 03 — ✍️ Υπογραφή Μηνυμάτων & Ιδιοκτησία",
                hint: "Οι υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση χωρίς gas.",
                description:
                    "Μάθετε πώς οι κρυπτογραφικές υπογραφές αποδεικνύουν ιδιοκτησία και πρόθεση — χωρίς αποκάλυψη ιδιωτικών κλειδιών ή on-chain συναλλαγές.",
            },
            lab04: {
                title: "Lab 04 — ⛽ Συναλλαγές & Gas",
                hint: "Οι on-chain ενέργειες κοστίζουν gas και αλλάζουν μόνιμα την κατάσταση.",
                description:
                    "Αλληλεπιδράστε με την πρώτη σας on-chain συναλλαγή και μάθετε πώς λειτουργούν το gas, η εκτέλεση και οι αλλαγές κατάστασης.",
            },
            lab05: {
                title: "Lab 05 — 📜 Έξυπνα Συμβόλαια & Κατάσταση",
                hint: "Το READ είναι δωρεάν, το WRITE είναι συναλλαγή.",
                description:
                    "Αλληλεπιδράστε με ένα πραγματικό έξυπνο συμβόλαιο και μάθετε πώς λειτουργούν η on-chain κατάσταση, τα reads και τα writes.",
            },
            lab06: {
                title: "Lab 06 — ⚙️ Συναίνεση & Οριστικότητα",
                hint: "Η συναίνεση επιλέγει μία αλυσίδα, η οριστικότητα την κλειδώνει.",
                description:
                    "Εξερευνήστε πώς οι validators καταλήγουν σε συμφωνία και πότε τα blocks γίνονται πραγματικά οριστικά.",
            },
        },
        daoCopy: {
            dao01: {
                title: "DAO Lab 01 — 🗳️ Διακυβέρνηση & Ψηφοφορία",
                hint: "Μια υπογραφή wallet είναι ψήφος — δεν χρειάζεται συναλλαγή, δεν ξοδεύεται gas.",
                description:
                    "Συμμετέχετε σε μια προσομοιωμένη διαδικασία διακυβέρνησης DAO και καταθέστε πραγματική ψήφο μέσω υπογραφής wallet. Μάθετε πώς λειτουργούν οι προτάσεις, η ισχύς ψήφου και η συλλογική λήψη αποφάσεων στα DAO — χωρίς ανάπτυξη παραγωγικού συστήματος.",
                level: "Ενδιάμεσο",
                badge: "Συμμετέχων Διακυβέρνησης",
            },
            dao02: {
                title: "DAO Lab 02 — 🏛️ Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος",
                hint: "Οι κανόνες διακυβέρνησης είναι κώδικας — οι ίδιες ψήφοι δίνουν διαφορετικά αποτελέσματα ανάλογα με την κατανομή ισχύος.",
                description:
                    "Σχεδιάστε κανόνες ψηφοφορίας, ρυθμίστε quorum και approval thresholds και δείτε πώς το ίδιο σύνολο ψήφων οδηγεί σε διαφορετικά αποτελέσματα ανάλογα με το μοντέλο διακυβέρνησης.",
                level: "Προχωρημένο",
                badge: "Αρχιτέκτονας Διακυβέρνησης",
            },
        },
        projectCopy: {
            poe01: {
                title: "Lab 01 — 🧠 Proof of Escape",
                description:
                    "Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.",
                level: "Αρχάριο",
            },
            "proof-of-escape": {
                title: "Lab 01 — 🧠 Proof of Escape",
                hint: "Η ολοκλήρωση είναι on-chain — το NFT badge σου είναι κρυπτογραφική απόδειξη ότι κατανόησες τις έννοιες.",
                description:
                    "Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.",
                level: "Αρχάριο",
                badge: "Proof of Escape",
            },
        },
        codingLabs: [
            {
                id: "coding01",
                title: "Coding Lab 01 — ✍️ Γράψε και Κάνε Deploy το Πρώτο σου Smart Contract",
                hint: "Η κατασκευή ξεκινά με το deployment — γράψε ένα ελάχιστο contract, κάνε compile και ανέβασε το δικό σου on-chain instance.",
                description:
                    "Δημιούργησε το πρώτο σου Solidity contract, κάνε compile στο Remix, κάνε deploy στο Besu Edu-Net και επιβεβαίωσε ότι το δικό σου contract instance είναι live on-chain. Αυτό το lab εισάγει όλη τη διαδρομή από τον πηγαίο κώδικα μέχρι το ανεπτυγμένο smart contract.",
                level: "Αρχάριο",
                xp: 400,
                badge: "Smart Contract Deployer",
            },
        ],
        systemLabs: [
            {
                id: "system-s0",
                title: "System Lab S0 — 🏰 Γιατί η Συναίνεση Είναι Δύσκολη",
                hint: "Η συναίνεση χρειάζεται επειδή ακόμη και οι έντιμοι συμμετέχοντες μπορεί να βλέπουν διαφορετικές τοπικές πραγματικότητες.",
                description:
                    "Εξερεύνησε το πρόβλημα των Βυζαντινών Στρατηγών και δες γιατί τα κατανεμημένα συστήματα χρειάζονται ρητούς κανόνες συναίνεσης για να συμφωνούν με ασφάλεια.",
                level: "Ενδιάμεσο",
                xp: 200,
                cta: "Άνοιγμα Lab →",
                badge: "Αναλυτής Συναίνεσης",
            },
            {
                id: "system-s1",
                title: "SysLab01 — ⛏️ PoW Mining",
                hint: "Η αλλαγή ενός byte ακυρώνει κάθε block που ακολουθεί — γι' αυτό τα blockchains είναι tamper-evident.",
                description:
                    "Εξερεύνησε πώς τα blocks συνδέονται σε ένα ασφαλές chain, πώς το chain σπάει όταν αλλάζουν δεδομένα και πώς αποκαθίσταται μέσω της λογικής του Proof of Work.",
                level: "Ενδιάμεσο",
                xp: 300,
                cta: "Άνοιγμα Lab →",
                badge: "Συστημικός Αναλυτής",
            },
            {
                id: "system-s2",
                title: "SysLab02 — 🔄 Από Συναλλαγή σε Αλλαγή Κατάστασης",
                hint: "Οι συναλλαγές δεν μεταφέρουν απλώς δεδομένα. Ενεργοποιούν εκτέλεση που αλλάζει την κατάσταση του blockchain.",
                description:
                    "Ακολούθησε πώς μια συναλλαγή εκτελείται από το σύστημα και πώς αυτή η εκτέλεση οδηγεί σε μόνιμη αλλαγή κατάστασης on-chain.",
                level: "Ενδιάμεσο",
                xp: 300,
                cta: "Άνοιγμα Lab →",
                badge: "Εξερευνητής Αλλαγής Κατάστασης",
            },
            {
                id: "system-s3",
                title: "System Lab S3 — 🛡️ Συναίνεση Υπό Πίεση",
                hint: "Ένας proposer μπορεί να προτείνει block, αλλά το σύστημα το αποδέχεται μόνο όταν αρκετό stake κάνει attestation και ξεπερνά το όριο του 2/3.",
                description:
                    "Δοκίμασε το proof-of-stake υπό πίεση αλλάζοντας stake validators, παρατηρώντας την επιλογή proposer και ελέγχοντας πότε το attestation είναι αρκετό για finality.",
                level: "Ενδιάμεσο",
                xp: 350,
                cta: "Άνοιγμα Lab →",
                badge: "Ελεγκτής Συναίνεσης Υπό Πίεση",
            },
            {
                id: "system-s4",
                title: "System Lab S4 — 🏛️ QBFT στο Besu",
                hint: "Σε ένα permissioned chain, η συναίνεση προκύπτει από ένα γνωστό σύνολο validators που συντονίζονται μέσω ρητών γύρων ψηφοφορίας.",
                description:
                    "Σύγκρινε το proof-of-stake με το QBFT και ακολούθησε πώς οι φάσεις pre-prepare, prepare και commit επιτρέπουν σε γνωστούς validators να οριστικοποιούν blocks στο Besu Edu-Net.",
                level: "Ενδιάμεσο",
                xp: 350,
                cta: "Άνοιγμα Lab →",
                badge: "Παρατηρητής QBFT",
            },
            {
                id: "system-s5",
                title: "System Lab S5 — 🌐 Network Partition και Recovery στο QBFT",
                hint: "Όταν σπάει το quorum, η safety μπορεί να παραμένει άθικτη ακόμη κι αν το liveness σταματήσει.",
                description:
                    "Εξερεύνησε πώς συμπεριφέρεται το QBFT όταν οι validators χωρίζονται από ένα network partition, γιατί το finality παγώνει χωρίς quorum και πώς η συντονισμένη πρόοδος επιστρέφει μετά το recovery.",
                level: "Ενδιάμεσο",
                xp: 400,
                cta: "Άνοιγμα Lab →",
                badge: "Αναλυτής Partition",
            },
        ],
        ui: {
            heroTitle: "Εργαστήρια Web3Edu",
            heroSubtitle:
                "Πρακτικές ασκήσεις που σε οδηγούν από τα βασικά του wallet ως τη διακυβέρνηση και εφαρμοσμένες προκλήσεις Web3 — κάθε lab χτίζει πάνω στο προηγούμενο.",
            loadingLabs: "Φόρτωση labs...",
            emptyRegistry: "Δεν επιστράφηκαν labs από το backend registry.",
            foundationalSectionTitle: "Θεμελιώδη Labs",
            foundationalSectionBlurb:
                "Χτίσε την Web3 ταυτότητά σου και τα βασικά νοητικά μοντέλα πριν περάσεις σε συναλλαγές ή smart contracts.",
            progressLabel: "Πρόοδος Θεμελιωδών Labs",
            progressCountSuffix: "ολοκληρωμένα",
            featuredLabAlt:
                "Web3 identity flow: wallet to address to identity",
            featuredDefaultTitle: "Lab 01 — Πορτοφόλια & Web3 Ταυτότητα",
            featuredPedagogy:
                "Το wallet σου είναι η Web3 ταυτότητά σου πριν συμβεί οποιαδήποτε συναλλαγή.",
            metaLevel: "Επίπεδο:",
            metaTime: "Χρόνος:",
            metaNetwork: "Δίκτυο:",
            metaTransactions: "Συναλλαγές:",
            metaTransactionsNone: "Καμία",
            metaTools: "Εργαλεία:",
            metaToolsCount: "3 διαδραστικά εργαλεία",
            metaBadge: "Badge:",
            metaTimeUnit: "λεπτά",
            defaultBadge: "Identity Explorer",
            startLabCta: "Έναρξη Lab →",
            pedagogyHintLabel: "Παιδαγωγική ιδέα:",
            completedBadge: "✓ Ολοκληρώθηκε",
            nextBadge: "⭐ ΕΠΟΜΕΝΟ",
            openLabCta: "Άνοιγμα Lab →",
            timeMinShort: "λεπτά",
            badgePrefix: "Badge:",
            codingSectionTitle: "Εργαστήρια Προγραμματισμού",
            codingSectionBlurb:
                "Πρακτικά labs εστιασμένα στη συγγραφή, ανάπτυξη και αλληλεπίδραση με smart contracts και Web3 κώδικα. Αυτά τα labs μετακινούν τη μάθηση από την παρατήρηση στην κατασκευή.",
            comingSoon: "Σύντομα",
            systemSectionTitle: "Εργαστήρια Συστήματος",
            systemSectionBlurb:
                "Εξερεύνησε τους μηχανισμούς του blockchain ως σύστημα, ξεκινώντας από το γιατί χρειάζεται συναίνεση και συνεχίζοντας με το πώς hashes, links, mining και εκτέλεση ασφαλίζουν το ιστορικό της αλυσίδας.",
            daoSectionTitle: "Εργαστήρια DAO & Διακυβέρνησης",
            daoSectionBlurb:
                "Εξερευνήστε την αποκεντρωμένη διακυβέρνηση, τη συλλογική λήψη αποφάσεων και τους μηχανισμούς DAO μέσω καθοδηγούμενων προσομοιώσεων και πραγματικών κρυπτογραφικών ενεργειών.",
            appliedSectionTitle: "Εφαρμοσμένα Εργαστήρια",
            appliedSectionBlurb:
                "Σενάρια-προκλήσεις που βάζουν τις γνώσεις σου σε εφαρμογή — συνδυάζοντας on-chain αλληλεπίδραση, gamification και επίλυση πραγματικών προβλημάτων.",
            proofOfEscapeTitle: "Lab 01 — 🧠 Proof of Escape",
            proofOfEscapeHint:
                "Η ολοκλήρωση είναι on-chain — το NFT badge σου είναι κρυπτογραφική απόδειξη ότι κατανόησες τις έννοιες.",
            proofOfEscapeDescription:
                "Ένα παιγνιοποιημένο Web3 challenge με quizzes, NFTs και on-chain επαλήθευση βασικών εννοιών.",
            proofOfEscapeBadge: "Proof of Escape",
            proofOfEscapeLevel: "Αρχάριο",
            nftMarketplaceTitle: "Lab 02 — 🖼 Εργαστήριο NFT Marketplace",
            nftMarketplaceHint:
                "Τα token standards ορίζουν τους κανόνες ιδιοκτησίας — ένα NFT είναι μοναδική on-chain εγγραφή που κανείς δεν μπορεί να αντιγράψει.",
            nftMarketplaceDescription:
                "Δημιουργήστε και αλληλεπιδράστε με μια απλή αγορά NFTs ενώ μαθαίνετε για token standards, ownership και on-chain events.",
            nftMarketplaceLevel: "Ενδιάμεσο",
            nftComingSoonBadge: "Σύντομα",
            nftComingSoonFooter: "Σύντομα",
            otherCategoryFallback: "Labs που εκτίθενται από το backend registry.",
            statusAvailable: "Διαθέσιμο",
            statusCompleted: "Ολοκληρώθηκε",
            defaultDaoLevelFallback: "Ενδιάμεσο",
        },
    },
};
