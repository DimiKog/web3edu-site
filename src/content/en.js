const en = {
    // -------------------------
    // HERO SECTION
    // -------------------------
    hero: {
        welcome: "Welcome to Web3Edu",
        headline: "Learn Web3 by doing it.\nBuild proof of what you learn.",
        tagline: "Proof of learning, not proof of attendance",
        desc: "Hands-on blockchain learning through real labs, on-chain activities, and applied projects — with verifiable progress that becomes part of your Web3Edu learning identity.",
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
            "Learn the concepts, use them in practice, turn your work into verifiable progress, and build a learning identity that grows with you.",
        progression: ["LEARN", "DO", "VERIFY", "OWN"],
        stages: [
            {
                id: "learn",
                label: "01 · LEARN",
                shortLabel: "LEARN",
                title: "Understand the concepts",
                description:
                    "Build a foundation in blockchain, consensus, wallets, smart contracts, and Web3 through guided learning.",
                cta: { label: "Start Here", href: "/#/start-here" },
            },
            {
                id: "do",
                label: "02 · DO",
                shortLabel: "DO",
                title: "Use Web3 in practice",
                description:
                    "Complete hands-on labs, work with wallets and transactions, deploy smart contracts, and explore real blockchain infrastructure.",
                cta: { label: "Explore Labs", href: "/#/labs" },
            },
            {
                id: "verify",
                label: "03 · VERIFY",
                shortLabel: "VERIFY",
                title: "Turn activity into evidence",
                description:
                    "Completed labs, challenges, and on-chain actions become evidence-backed learning progress — not just attendance records.",
            },
            {
                id: "own",
                label: "04 · OWN",
                shortLabel: "OWN",
                title: "Build your learning identity",
                description:
                    "XP, achievements, and credentials accumulate into a persistent Web3Edu learning identity, with key milestones anchored on-chain.",
            },
        ],
    },

    availableNow: {
        badge: "Available Now",
        title: "What you can do today",
        description:
            "Learn, build, and verify your progress in a live Web3 learning environment.",
        capabilities: [
            {
                id: "labs",
                icon: "labs",
                title: "Hands-on Labs",
                description:
                    "Learn blockchain concepts through guided practical activities, from fundamentals to smart-contract deployment and interaction.",
                cta: { label: "Explore Labs", href: "/#/labs" },
            },
            {
                id: "onchain",
                icon: "onchain",
                title: "Real On-chain Work",
                description:
                    "Use wallets, transactions, smart contracts, and the live Besu Edu-Net instead of simulated blockchain workflows.",
                cta: { label: "Start Learning", href: "/#/start-here" },
            },
            {
                id: "progress",
                icon: "progress",
                title: "Verifiable Progress",
                description:
                    "Completed work becomes XP, achievements, and evidence-backed learning progress — not simply a record of attendance.",
            },
            {
                id: "identity",
                icon: "identity",
                title: "Web3Edu Learning Identity",
                description:
                    "Build a persistent learning profile where achievements and credentials accumulate, with key milestones anchored on-chain.",
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
            title: "Real progress. Verifiable milestones.",
            description:
                "Your learning path, XP, achievements, and verifiable profile come together in one learning environment.",
            dashboardAlt: "Web3Edu dashboard showing next steps, progress, XP, and badges",
            profileAlt: "Web3Edu verifiable profile with verified milestone status",
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
