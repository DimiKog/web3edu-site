const en = {
    // -------------------------
    // HERO SECTION
    // -------------------------
    hero: {
        welcome: "Welcome to Web3Edu",
        headline: "Learn Web3 by doing it.\nBuild proof of what you learn.",
        tagline: "Proof of learning, not proof of attendance",
        desc: "Follow structured Learning Modules, practice with real Web3 activities, and turn your progress into a verifiable Web3Edu learning identity.",
        cta: "Start Learning",
        ctaHref: "/#/start-here",
        secondaryCta: "Explore Web3Edu",
        exploreSectionId: "home-explore",
    },

    // -------------------------
    // MOTIVATION SECTION
    // -------------------------
    motivation: {
        heading: "Why Web3Edu?",
        detailHeading: "Our Mission",
        badgeText: "Because learning Web3 should be empowering.",
        summary: "Web3Edu turns learning into a practical, verifiable identity. Learners use real Web3 workflows, complete hands-on labs, and carry their progress across the platform.",
        points: [
            {
                title: "Learn by interacting",
                description: "Labs and tools ask learners to use wallets, signatures, transactions, consensus, and governance directly.",
            },
            {
                title: "Make progress verifiable",
                description: "Completion, XP, and identity state give each learner a durable record of what they have done.",
            },
            {
                title: "Move toward contribution",
                description: "The path leads from fundamentals into participation research, builder projects, and applied experimentation.",
            },
        ],
        body: `Web3Edu treats learning as a first-class Web3 concept — not as content to consume, but as identity to build.

Learners develop real blockchain skills through hands-on labs, experiments, and direct interaction with decentralized systems. Each step of progress becomes verifiable, composable, and reusable across the ecosystem.

With evidence-backed progress records and structured contribution paths, learning does not end at completion. It evolves through collaboration, applied experimentation, and participation research.`,
    },

    // -------------------------
    // LEARNING JOURNEY (Home)
    // -------------------------
    learningJourney: {
        badge: "Learning Journey",
        title: "How Web3Edu Works",
        subtitle:
            "Learn through structured modules, demonstrate with real Web3 work, progress through milestones, and verify your learning identity.",
        progression: ["LEARN", "DEMONSTRATE", "PROGRESS", "VERIFY"],
        stages: [
            {
                id: "learn",
                label: "01 · LEARN",
                shortLabel: "LEARN",
                title: "Follow Learning Modules",
                description:
                    "Structured modules guide you through concepts, resources, and clear learning outcomes — from foundations to advanced Web3 topics.",
                cta: { label: "Open Learning Modules", href: "/#/learn" },
            },
            {
                id: "demonstrate",
                label: "02 · DEMONSTRATE",
                shortLabel: "DEMONSTRATE",
                title: "Apply what you learn",
                description:
                    "Use labs, on-chain activities, projects, quizzes, and other practical tasks to produce evidence of what you can do.",
                cta: { label: "Explore Labs", href: "/#/labs" },
            },
            {
                id: "progress",
                label: "03 · PROGRESS",
                shortLabel: "PROGRESS",
                title: "Complete modules and milestones",
                description:
                    "Evidence and assessments complete modules. XP and completed modules advance you through Explorer, Builder, and Architect.",
                cta: { label: "Open Dashboard", href: "/#/dashboard" },
            },
            {
                id: "verify",
                label: "04 · VERIFY",
                shortLabel: "VERIFY",
                title: "Build a verifiable learning identity",
                description:
                    "Progress, Badges, credentials, and learning records come together in your persistent Web3Edu identity and profile.",
                cta: { label: "Web3Edu Identity", href: "/#/join" },
            },
        ],
    },

    availableNow: {
        badge: "Available Now",
        title: "What you can do today",
        description:
            "Learn through modules, demonstrate with real Web3 work, track your progress, and grow a verifiable learning identity.",
        capabilities: [
            {
                id: "modules",
                icon: "modules",
                systemLabel: "Learn",
                title: "Learning Modules",
                description:
                    "Structured paths that combine resources, activities, evidence, and assessment into one clear journey.",
                cta: { label: "Browse Learning Modules", href: "/#/learn" },
            },
            {
                id: "handsOn",
                icon: "handsOn",
                systemLabel: "Demonstrate",
                title: "Hands-on Web3",
                description:
                    "Labs, wallets, smart contracts, projects, and the live Besu Edu-Net — real activity that supports your modules.",
                cta: { label: "Explore Labs", href: "/#/labs" },
            },
            {
                id: "progress",
                icon: "progress",
                systemLabel: "Progress",
                title: "Learning Progress",
                description:
                    "Module completion, XP, Badges, and milestone progress toward Explorer, Builder, and Architect.",
                cta: { label: "Open Dashboard", href: "/#/dashboard" },
            },
            {
                id: "identity",
                icon: "identity",
                systemLabel: "Verify",
                title: "Verifiable Learning Identity",
                description:
                    "A persistent educational profile linking progress, credentials, badges, and verifiable learning records.",
                cta: { label: "Web3Edu Identity", href: "/#/join" },
            },
        ],
        alsoExplore: {
            label: "Also explore",
            links: [
                { label: "Proof of Escape", href: "/#/labs/proof-of-escape" },
                { label: "Developer Tools", href: "/#/tools" },
                { label: "Builder Projects", href: "/#/projects" },
            ],
        },
        productPreview: {
            eyebrow: "Inside Web3Edu",
            title: "Your journey, record, and profile — in one place.",
            description:
                "See your Learning Journey, module and milestone progress, XP, Badges, Web3Edu Record, and Verifiable Profile together.",
            dashboardAlt: "Web3Edu dashboard showing Learning Journey, progress, XP, Badges, and Verifiable Profile",
            profileAlt: "Web3Edu verifiable profile with verified status",
        },
    },

    teamTrust: {
        title: "Built through research and operational pilots",
        description:
            "Web3Edu combines educational pilots, blockchain infrastructure, decentralized identity research, and hands-on technical experimentation within real learning environments.",
        href: "/#/team",
        cta: "Meet the Team",
    },

    // -------------------------
    // DAO SECTION
    // -------------------------
    dao: {
        title: "Future Participation & Governance",
        desc: "Web3Edu explores how verified learning activity could support future participation in decisions around learning paths, pilots, and platform governance.",
        imageCaption: "Research into participation models, governance experiments, and community feedback loops.",
        buttons: {
            learn: "Read the Governance Research",
            enter: "Explore Participation Preview",
        },
    },

    // -------------------------
    // -------------------------
    // WHAT'S NEW (platform changelog)
    // -------------------------
    whatsNew: {
        items: [
            {
                id: "learning-modules-journey",
                category: "update",
                date: "2026-09-05",
                title: "Learning Modules are live",
                description: "Structured learning paths now bring resources, practical activities, evidence, and assessment together.",
                href: "#/learn",
                cta: "Explore Learning Modules",
            },
            {
                id: "walletless-first-learning",
                category: "update",
                date: "2026-08-29",
                title: "Walletless-first learning",
                description: "Start with your Web3Edu Account and connect a wallet only when a learning activity needs Web3 interaction.",
                href: "#/start-here",
                cta: "Start Here",
            },
            {
                id: "easier-web3edu-sign-in",
                category: "identity",
                date: "2026-05-08",
                title: "Easier Web3Edu Sign-In",
                description: "Use Google Sign-In to access Web3Edu faster, with Account Abstraction supporting a smoother path toward wallet-based learning identity.",
                href: "#/start-here",
                cta: "Start Sign-In",
            },
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
            dao: "Governance Research",
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
