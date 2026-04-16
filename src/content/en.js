const en = {
    // -------------------------
    // HERO SECTION
    // -------------------------
    hero: {
        welcome: "Welcome to Web3Edu",
        headline: "A Web3-native learning identity that grows with the ecosystem",
        tagline: "Proof of learning, not proof of attendance",
        desc: "Build real Web3 skills through hands-on labs and experiments, earn verifiable on-chain credentials, and carry your learning identity across networks, tools, and communities.",
        cta: "Start Learning",
    },

    // -------------------------
    // MOTIVATION SECTION
    // -------------------------
    motivation: {
        heading: "Why Web3Edu?",
        detailHeading: "Our Mission",
        badgeText: "Because learning Web3 should be empowering.",
        body: `Web3Edu treats learning as a first-class Web3 concept — not as content to consume, but as identity to build.

Learners develop real blockchain skills through hands-on labs, experiments, and direct interaction with decentralized systems. Each step of progress becomes verifiable, composable, and reusable across the ecosystem.

With on-chain credentials and participation in the Web3Edu DAO, learning does not end at completion. It evolves through contribution, collaboration, and shared governance — shaping both the learner and the platform itself.`,
    },

    // -------------------------
    // LEARNING PATH
    // -------------------------
    learnPath: {
        title: "How Web3Edu Works",
        subtitle: "Follow a clear rhythm: understand the concepts, experiment with them, then co-create what comes next.",
        stepLabel: "STEP",
        steps: [
            {
                emoji: "🪪",
                title: "Identity & Fundamentals",
                desc: "Establish your Web3 learning identity and grasp the core blockchain concepts."
            },
            {
                emoji: "🏛️",
                title: "Access the DAO",
                desc: "Join the Web3Edu DAO and unlock participation in a learner-driven ecosystem."
            },
            {
                emoji: "📘",
                title: "Learn by Doing",
                desc: "Explore blockchain concepts through hands-on labs and guided experiments."
            },
            {
                emoji: "🛠️",
                title: "Build & Contribute",
                desc: "Apply what you learned by building prototypes and shaping what comes next."
            }
        ],
        ctaLabel: "Start Your Web3 Journey →",
    },

    // -------------------------
    // DAO SECTION
    // -------------------------
    dao: {
        title: "Web3Edu DAO — The Governance Layer",
        desc: "The Web3Edu DAO connects educators, students, and researchers in shaping the future of blockchain education. Members propose improvements, vote on new modules, and directly shape the platform’s evolution.",
        imageCaption: "A living governance layer where students, mentors and partners collectively shape the evolution of the Web3Edu ecosystem.",
        buttons: {
            learn: "Learn About the Governance Model",
            enter: "Explore DAO",
        },
    },

    /// -------------------------
    // APP CARDS
    // -------------------------
    apps: {
        heading: "Web3Edu Ecosystem",

        poe: {
            title: "Proof of Escape",
            desc: "An applied, on-chain challenge that validates core Web3 concepts through interaction rather than quizzes."
        },

        education: {
            title: "Web3 Laboratories",
            desc: "A structured laboratory environment for exploring foundational Web3 concepts, from wallets and cryptography to smart contracts and consensus."
        },

        nft: {
            title: "NFT Verifier",
            desc: "A utility module for verifying NFT ownership and on-chain credentials issued within the Web3Edu ecosystem."
        },

        dao: {
            title: "DAO Playground",
            desc: "An experimental governance sandbox for exploring proposals, voting mechanisms, and decentralized participation models."
        },

        zkp: {
            title: "Zero-Knowledge Module",
            desc: "A research-oriented module focused on privacy-preserving techniques and zero-knowledge proofs in applied Web3 systems."
        },

        tools: {
            title: "Developer Tools",
            desc: "Interactive protocol visualizers and sandboxes for inspecting blockchain mechanics step by step."
        },

        cta: "Explore"
    },

    // -------------------------
    // -------------------------
    // WHAT'S NEW (platform changelog)
    // -------------------------
    whatsNew: {
        items: [
            {
                id: "pos-visualizer-v2",
                category: "tool",
                date: "2026-04-10",
                title: "PoS Visualizer — Enhanced",
                description: "Validator balances now grow with finalization rewards. Includes reward breakdown, improved mempool layout, and highlighted key numbers in the info panel.",
                href: "#/tools/pos",
                cta: "Explore Tool",
                image: "/assets/previews/pos-visualizer.webp",
                links: [
                    { label: "All Visual Tools", href: "#/tools" },
                    { label: "SystemLab S3 — Consensus Under Pressure", href: "#/labs/system/s3" },
                ],
            },
            {
                id: "system-labs-s0-s4",
                category: "lab",
                date: "2026-04-08",
                title: "6 System Labs Available",
                description: "Interactive consensus scenarios across six labs (S0-S5) — covering node behavior, Byzantine faults, validator quorums, and QBFT-based finality.",
                href: "#/labs",
                cta: "Explore Labs",
            },
            {
                id: "visual-tools-pow-pos",
                category: "tool",
                date: "2026-04-07",
                title: "PoW & PoS Visual Tools",
                description: "Two interactive visualizers live: explore mining difficulty and nonce search in PoW, and stake-weighted validator selection with attestation in PoS.",
                href: "#/tools",
                cta: "Open Tools",
            },
            {
                id: "builder-projects",
                category: "project",
                date: "2026-04-04",
                title: "2 Builder Projects Available",
                description: "Applied project paths for Builders ready to move beyond labs into hands-on blockchain development work.",
                href: "#/projects",
                cta: "View Projects",
            },
            {
                id: "builder-readiness-dashboard",
                category: "update",
                date: "2026-04-03",
                title: "Ready to Become a Builder?",
                description: "Complete the Core Labs first, then use the recommendations block in your dashboard to see which labs and Builder path you should tackle next.",
                href: "#/dashboard",
                cta: "Go to Dashboard",
            },
        ],
    },

    // NEWS & EVENTS
    // -------------------------
    news: {
        title: "News & Events",
        badge: "Timeline / Agenda",
        subtitle: "Key events, milestones, and public appearances related to the Web3Edu ecosystem and its projects.",
        viewArchive: "View Archive",
        items: [
            {
                category: "release",
                date: "1/03/2026",
                title: "Web3Edu Platform — Public Launch",
                desc: "Public release of the Web3Edu platform, opening access to the learning experience, foundational labs, and identity-driven progression.",
            },
            {
                category: "event",
                date: "9/03/2026",
                title: "1st Web3Edu Workshop",
                desc: "The event where the platform was officially presented at the University of West Attica.",
            },
            {
                category: "update",
                date: "Dec 2025",
                title: "Web3Edu Platform Development Milestone",
                desc: "Core foundational labs and learning infrastructure reached internal completion ahead of the public Web3Edu launch.",
            },
            {
                category: "event",
                date: "Nov 2025",
                title: "Proof of Escape Exhibition at UNOVATE Festival",
                desc: "Public exhibition of the Proof of Escape (PoE) project, showcasing the Festival Edition game experience and on-site Web3 onboarding.",
            },
            {
                category: "update",
                date: "Oct 2025",
                title: "Proof of Escape — Festival Edition Completed",
                desc: "The special Festival Edition of Proof of Escape was finalized and prepared for live public demonstration.",
            },
        ]
    },

    // -------------------------
    // FOOTER
    // -------------------------
    footer: {
        name: "Web3Edu Initiative",
        role: "A community-driven Web3 education ecosystem",
        site: "Visit our website",

        nav: {
            home: "Home",
            about: "About",
            team: "Team",
            dao: "DAO",
            contact: "Contact",
            news: "News",
            startHere: "Start Here",
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
    langSwitch: "Switch to Greek",
};

export default en;
