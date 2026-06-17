import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell.jsx";
import { AlertTriangle, CheckCircle2, ExternalLink, Copy, Settings2, Rocket, XCircle } from "lucide-react";

const REMIX_URL = "https://remix.ethereum.org/";
const FAUCET_URL = "https://faucet.dimikog.org/";

const COPY = {
    en: {
        badge: "Setup Guide",
        title: "Remix + Besu Edu-Net Setup",
        description:
            "Configure Remix IDE correctly before deploying Solidity contracts to Besu Edu-Net. This guide is a prerequisite for Coding Lab 01 — not a lab itself.",
        whatIsRemixTitle: "What is Remix?",
        whatIsRemixBody:
            "Remix is a browser-based IDE for writing, compiling, and deploying Solidity smart contracts. You do not need to install anything locally — open it in your browser and start coding.",
        needsTitle: "What you need",
        needs: [
            "A browser wallet such as MetaMask",
            "Your wallet connected to Besu Edu-Net",
            "Test EDU tokens from the faucet",
            "Remix opened at remix.ethereum.org",
        ],
        networkTitle: "Network requirement",
        networkBody:
            "Your wallet must be connected to Besu Edu-Net before deployment. In Remix, select Environment: Injected Provider / MetaMask. Confirm that Remix shows the Besu Edu-Net chain before you deploy.",
        compilerTitle: "Why EVM Paris?",
        compilerParagraphs: [
            "Remix can compile the same Solidity contract for different Ethereum Virtual Machine versions. Besu Edu-Net expects bytecode compatible with the Paris EVM rules.",
            "If you compile with a newer EVM target, Remix may generate bytecode that uses instructions not supported by the network. This can cause deployment or execution to fail.",
            "For this lab, open the Solidity Compiler settings in Remix and select:",
        ],
        compilerSetting: "EVM Version: Paris",
        stepsTitle: "Step-by-step setup",
        visualCheckpointsTitle: "What to confirm in Remix",
        visualCheckpointsIntro:
            "Schematic panels below show the settings and labels to look for. Remix updates its layout over time, but these values stay the same on Besu Edu-Net.",
        visualCheckpoints: [
            {
                title: "Solidity Compiler settings",
                body: "Select Solidity 0.8.x and set EVM Version to Paris before compiling.",
                panelTitle: "Solidity Compiler",
                fields: [
                    { label: "Compiler", value: "0.8.x", highlight: true },
                    { label: "EVM Version", value: "paris", highlight: true, note: "Advanced Compiler Configuration" },
                ],
            },
            {
                title: "Deploy with Injected Provider",
                body: "In Deploy & Run Transactions, select Environment: Injected Provider / MetaMask and confirm Besu Edu-Net is active.",
                panelTitle: "Deploy Panel",
                fields: [
                    { label: "Environment", value: "Injected Provider - MetaMask", highlight: true },
                    { label: "Network", value: "Besu Edu-Net", highlight: true, success: true },
                ],
            },
            {
                title: "Copy the deployed contract address",
                body: "After deployment, copy the address from Deployed Contracts. Do not copy your wallet address.",
                panelTitle: "Deployed Contracts",
                fields: [
                    { label: "Counter", value: "0xAbC…1234", highlight: true, copy: true },
                ],
                avoidLabel: "Wallet address (do not copy)",
                avoidValue: "0xYourWallet…",
            },
        ],
        steps: [
            "Open Remix at remix.ethereum.org.",
            "Create a new .sol file (for example Counter.sol).",
            "Go to the Solidity Compiler tab and select compiler version 0.8.x.",
            "Open Advanced Compiler Settings and set EVM Version to Paris.",
            "Compile the contract and confirm there are no errors.",
            "Go to Deploy & Run Transactions.",
            "Select Environment: Injected Provider / MetaMask.",
            "Confirm that Remix shows the Besu Edu-Net chain/network.",
            "Deploy the contract and approve the transaction in your wallet.",
            "Copy the deployed contract address from the Deployed Contracts section.",
        ],
        mistakesTitle: "Common mistakes",
        mistakes: [
            "Copying your wallet address instead of the deployed contract address.",
            "Deploying while MetaMask is on another network.",
            "Leaving EVM version on a newer/default setting when it causes deployment issues.",
            "Deploying without enough test EDU tokens for gas.",
            "Assuming Web3Edu verification succeeded before the deployment transaction is confirmed.",
        ],
        blockscoutTitle: "Blockscout verification",
        blockscoutBody:
            "Blockscout source-code verification is optional and recommended, but not required for Web3Edu lab completion. Web3Edu verifies your deployed contract address through the Besu RPC.",
        remixLink: "Open Remix",
        faucetLink: "Get test EDU tokens",
        networkCheckLink: "Check Besu connection",
        backToLab: "Back to Coding Lab 01",
        backToLabRoute: "/labs/coding-01",
        networkCheckRoute: "/education/network-check",
        toolsRoute: "/tools",
    },
    gr: {
        badge: "Οδηγός Ρύθμισης",
        title: "Ρύθμιση Remix + Besu Edu-Net",
        description:
            "Ρύθμισε σωστά το Remix IDE πριν κάνεις deploy Solidity contracts στο Besu Edu-Net. Αυτός ο οδηγός είναι προαπαιτούμενος για το Coding Lab 01 — δεν είναι lab.",
        whatIsRemixTitle: "Τι είναι το Remix;",
        whatIsRemixBody:
            "Το Remix είναι ένα browser-based IDE για συγγραφή, compile και deploy Solidity smart contracts. Δεν χρειάζεται τοπική εγκατάσταση — άνοιξέ το στον browser και ξεκίνα.",
        needsTitle: "Τι χρειάζεσαι",
        needs: [
            "Browser wallet όπως το MetaMask",
            "Το wallet σου συνδεδεμένο στο Besu Edu-Net",
            "Δοκιμαστικά EDU tokens από το faucet",
            "Το Remix ανοιχτό στο remix.ethereum.org",
        ],
        networkTitle: "Απαίτηση δικτύου",
        networkBody:
            "Το wallet σου πρέπει να είναι συνδεδεμένο στο Besu Edu-Net πριν το deployment. Στο Remix, επίλεξε Environment: Injected Provider / MetaMask. Επιβεβαίωσε ότι το Remix δείχνει το δίκτυο Besu Edu-Net πριν κάνεις deploy.",
        compilerTitle: "Γιατί EVM Paris;",
        compilerParagraphs: [
            "Το Remix μπορεί να κάνει compile το ίδιο Solidity contract για διαφορετικές εκδόσεις της Ethereum Virtual Machine. Το Besu Edu-Net αναμένει bytecode συμβατό με τους κανόνες Paris.",
            "Αν κάνεις compile με νεότερο EVM target, το Remix μπορεί να δημιουργήσει bytecode που χρησιμοποιεί εντολές που δεν υποστηρίζονται από το δίκτυο. Αυτό μπορεί να προκαλέσει αποτυχία στο deployment ή στην εκτέλεση.",
            "Για αυτό το lab, άνοιξε τις ρυθμίσεις του Solidity Compiler στο Remix και επίλεξε:",
        ],
        compilerSetting: "EVM Version: Paris",
        stepsTitle: "Ρύθμιση βήμα-βήμα",
        visualCheckpointsTitle: "Τι να επιβεβαιώσεις στο Remix",
        visualCheckpointsIntro:
            "Τα σχηματικά panels παρακάτω δείχνουν τις ρυθμίσεις και τις ετικέτες που πρέπει να βρεις. Το layout του Remix μπορεί να αλλάζει, αλλά αυτές οι τιμές μένουν ίδιες στο Besu Edu-Net.",
        visualCheckpoints: [
            {
                title: "Ρυθμίσεις Solidity Compiler",
                body: "Επίλεξε Solidity 0.8.x και όρισε EVM Version σε Paris πριν κάνεις compile.",
                panelTitle: "Solidity Compiler",
                fields: [
                    { label: "Compiler", value: "0.8.x", highlight: true },
                    { label: "EVM Version", value: "paris", highlight: true, note: "Advanced Compiler Configuration" },
                ],
            },
            {
                title: "Deploy με Injected Provider",
                body: "Στο Deploy & Run Transactions, επίλεξε Environment: Injected Provider / MetaMask και επιβεβαίωσε ότι είναι ενεργό το Besu Edu-Net.",
                panelTitle: "Deploy Panel",
                fields: [
                    { label: "Environment", value: "Injected Provider - MetaMask", highlight: true },
                    { label: "Network", value: "Besu Edu-Net", highlight: true, success: true },
                ],
            },
            {
                title: "Αντιγραφή deployed contract address",
                body: "Μετά το deployment, αντέγραψε τη διεύθυνση από το Deployed Contracts. Μην αντιγράψεις το wallet address σου.",
                panelTitle: "Deployed Contracts",
                fields: [
                    { label: "Counter", value: "0xAbC…1234", highlight: true, copy: true },
                ],
                avoidLabel: "Wallet address (μην αντιγράψεις)",
                avoidValue: "0xYourWallet…",
            },
        ],
        steps: [
            "Άνοιξε το Remix στο remix.ethereum.org.",
            "Δημιούργησε ένα νέο αρχείο .sol (π.χ. Counter.sol).",
            "Πήγαινε στο tab Solidity Compiler και επίλεξε compiler έκδοση 0.8.x.",
            "Άνοιξε τα Advanced Compiler Settings και όρισε EVM Version σε Paris.",
            "Κάνε compile το contract και επιβεβαίωσε ότι δεν υπάρχουν errors.",
            "Πήγαινε στο Deploy & Run Transactions.",
            "Επίλεξε Environment: Injected Provider / MetaMask.",
            "Επιβεβαίωσε ότι το Remix δείχνει το δίκτυο/αλυσίδα Besu Edu-Net.",
            "Κάνε deploy το contract και έγκρινε τη συναλλαγή στο wallet σου.",
            "Αντέγραψε τη deployed contract address από την ενότητα Deployed Contracts.",
        ],
        mistakesTitle: "Συχνά λάθη",
        mistakes: [
            "Αντιγραφή του wallet address αντί για το deployed contract address.",
            "Deploy ενώ το MetaMask είναι σε άλλο δίκτυο.",
            "Αφήνοντας το EVM version σε νεότερη/default ρύθμιση όταν προκαλεί προβλήματα deployment.",
            "Deploy χωρίς αρκετά δοκιμαστικά EDU tokens για gas.",
            "Υπόθεση ότι η επαλήθευση Web3Edu πέτυχε πριν επιβεβαιωθεί η συναλλαγή deployment.",
        ],
        blockscoutTitle: "Επαλήθευση Blockscout",
        blockscoutBody:
            "Η επαλήθευση πηγαίου κώδικα στο Blockscout είναι προαιρετική και συνιστάται, αλλά δεν απαιτείται για ολοκλήρωση Web3Edu lab. Το Web3Edu επαληθεύει τη deployed contract address μέσω του Besu RPC.",
        remixLink: "Άνοιγμα Remix",
        faucetLink: "Λήψη δοκιμαστικών EDU tokens",
        networkCheckLink: "Έλεγχος σύνδεσης Besu",
        backToLab: "Επιστροφή στο Coding Lab 01",
        backToLabRoute: "/labs-gr/coding-01",
        networkCheckRoute: "/education/network-check-gr",
        toolsRoute: "/tools-gr",
    },
};

function RemixMockPanel({ title, children }) {
    return (
        <div className="flex min-h-[168px] flex-col overflow-hidden rounded-xl border border-slate-300/70 bg-[#1e1e1e] shadow-inner dark:border-slate-600/80">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#252526] px-3 py-1.5">
                <div className="flex shrink-0 gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="min-w-0 text-[9px] font-medium tracking-[0.04em] text-slate-400">
                    {title}
                </span>
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-3">{children}</div>
        </div>
    );
}

function MockField({ label, value, highlight = false, success = false, note = null, copy = false }) {
    return (
        <div className="space-y-1">
            {note ? (
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{note}</p>
            ) : null}
            <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="shrink-0 text-slate-400">{label}</span>
                <div
                    className={`flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] ${
                        highlight
                            ? success
                                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                                : "border-[#8A57FF]/50 bg-[#8A57FF]/20 text-violet-100"
                            : "border-white/10 bg-white/5 text-slate-300"
                    }`}
                >
                    {success ? <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" /> : null}
                    <span className="truncate">{value}</span>
                    {copy ? <Copy className="h-3 w-3 shrink-0 text-cyan-300" /> : null}
                </div>
            </div>
        </div>
    );
}

function RemixCheckpointCard({ checkpoint, index }) {
    const icons = [Settings2, Rocket, Copy];

    const Icon = icons[index] || CheckCircle2;

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <div className="p-4 pb-0">
                <RemixMockPanel title={checkpoint.panelTitle}>
                {checkpoint.fields.map((field) => (
                    <MockField key={`${field.label}-${field.value}`} {...field} />
                ))}
                {checkpoint.avoidLabel ? (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-dashed border-rose-400/30 bg-rose-500/10 px-2 py-1.5 text-[10px]">
                        <span className="text-rose-200/80">{checkpoint.avoidLabel}</span>
                        <span className="flex items-center gap-1 font-mono text-rose-200/60 line-through">
                            <XCircle className="h-3 w-3" />
                            {checkpoint.avoidValue}
                        </span>
                    </div>
                ) : null}
                </RemixMockPanel>
            </div>

            <div className="flex flex-1 flex-col p-5 pt-4">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/50 bg-cyan-50 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100">
                        <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{checkpoint.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{checkpoint.body}</p>
            </div>
        </article>
    );
}

function SectionCard({ title, children, variant = "default" }) {
    const variants = {
        default:
            "border-slate-200/70 bg-white/80 dark:border-slate-700/60 dark:bg-slate-900/60",
        warning:
            "border-amber-300/70 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10",
        info: "border-cyan-300/70 bg-cyan-50/80 dark:border-cyan-400/25 dark:bg-cyan-400/10",
    };

    return (
        <section className={`rounded-2xl border p-6 shadow-sm ${variants[variant]}`}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <div className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
        </section>
    );
}

export default function RemixBesuSetup({ lang = "en" }) {
    const copy = COPY[lang] || COPY.en;

    return (
        <PageShell>
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#8A57FF]/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#4ACBFF]/15 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
                </div>

                <main className="relative mx-auto max-w-4xl px-6 py-20">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-[#8A57FF]/30 bg-[#8A57FF]/10 px-4 py-1 text-sm font-semibold text-[#8A57FF]">
                            {copy.badge}
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            {copy.title}
                        </h1>
                        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {copy.description}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href={REMIX_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-400/25 dark:bg-slate-950/40 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {copy.remixLink}
                        </a>
                        <a
                            href={FAUCET_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/25 dark:bg-slate-950/40 dark:text-emerald-100 dark:hover:bg-emerald-400/15"
                        >
                            <ExternalLink className="h-4 w-4" />
                            {copy.faucetLink}
                        </a>
                        <Link
                            to={copy.networkCheckRoute}
                            className="inline-flex items-center gap-2 rounded-full border border-[#8A57FF]/30 bg-[#8A57FF]/10 px-4 py-2 text-sm font-semibold text-[#8A57FF] transition hover:bg-[#8A57FF]/15"
                        >
                            {copy.networkCheckLink}
                        </Link>
                    </div>

                    <div className="mt-10 space-y-6">
                        <SectionCard title={copy.whatIsRemixTitle}>
                            <p>{copy.whatIsRemixBody}</p>
                        </SectionCard>

                        <SectionCard title={copy.needsTitle}>
                            <ul className="space-y-2">
                                {copy.needs.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>

                        <SectionCard title={copy.networkTitle} variant="info">
                            <p>{copy.networkBody}</p>
                        </SectionCard>

                        <SectionCard title={copy.compilerTitle} variant="warning">
                            <div className="flex items-start gap-3">
                                <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <div className="space-y-3">
                                    {copy.compilerParagraphs.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                    <p className="rounded-lg border border-amber-300/70 bg-white/80 px-4 py-3 font-semibold text-slate-900 dark:border-amber-500/30 dark:bg-slate-950/40 dark:text-white">
                                        {copy.compilerSetting}
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title={copy.stepsTitle}>
                            <ol className="space-y-3">
                                {copy.steps.map((step, index) => (
                                    <li key={step} className="flex gap-3">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/70 bg-cyan-50 text-xs font-semibold text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-100">
                                            {index + 1}
                                        </span>
                                        <span className="pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </SectionCard>

                        <SectionCard title={copy.visualCheckpointsTitle}>
                            <p className="mb-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                {copy.visualCheckpointsIntro}
                            </p>
                            <div className="grid gap-5 md:grid-cols-3">
                                {copy.visualCheckpoints.map((checkpoint, index) => (
                                    <RemixCheckpointCard
                                        key={checkpoint.panelTitle}
                                        checkpoint={checkpoint}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </SectionCard>

                        <SectionCard title={copy.mistakesTitle}>
                            <ul className="space-y-2">
                                {copy.mistakes.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>

                        <SectionCard title={copy.blockscoutTitle}>
                            <p>{copy.blockscoutBody}</p>
                        </SectionCard>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to={copy.backToLabRoute}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-violet-500"
                        >
                            {copy.backToLab}
                        </Link>
                        <Link
                            to={copy.toolsRoute}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#8A57FF]/40 hover:text-[#8A57FF] dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200"
                        >
                            {lang === "gr" ? "Όλα τα εργαλεία" : "All tools"}
                        </Link>
                    </div>
                </main>
            </div>
        </PageShell>
    );
}
