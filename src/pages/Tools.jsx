import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

const COPY = {
    en: {
        badge: "Developer Tools",
        title: "Interactive tools for understanding how Web3 systems behave.",
        description: "Explore visual sandboxes and protocol mechanics without leaving the learning environment.",
        miningTitle: "Mining Visualizer",
        miningDescription: "Build blocks from a mempool, inspect chain growth, and see how pending transactions turn into confirmed history.",
        posTitle: "PoS Visualizer",
        posDescription: "Adjust validator stake, run proposer selection, and watch how a proof-of-stake round moves from selection to finality.",
        openLabel: "Open tool",
        miningRoute: "/tools/mining",
        posRoute: "/tools/pos",
    },
    gr: {
        badge: "Εργαλεία Ανάπτυξης",
        title: "Διαδραστικά εργαλεία για να κατανοήσεις πώς λειτουργούν τα συστήματα Web3.",
        description: "Εξερεύνησε οπτικά sandboxes και μηχανισμούς blockchain μέσα από το ίδιο μαθησιακό περιβάλλον.",
        miningTitle: "Οπτικοποίηση Mining",
        miningDescription: "Δημιούργησε blocks από το mempool, παρακολούθησε την αλυσίδα να μεγαλώνει και δες πώς οι εκκρεμείς συναλλαγές γίνονται επιβεβαιωμένο ιστορικό.",
        posTitle: "Οπτικοποίηση PoS",
        posDescription: "Άλλαξε το stake των validators, εκτέλεσε την επιλογή proposer και δες πώς ένας proof-of-stake γύρος φτάνει από την επιλογή στην οριστικοποίηση.",
        openLabel: "Άνοιγμα εργαλείου",
        miningRoute: "/tools-gr/mining",
        posRoute: "/tools-gr/pos",
    },
};

export default function Tools({ lang = "en" }) {
    const copy = COPY[lang] || COPY.en;

    return (
        <PageShell>
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#8A57FF]/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#4ACBFF]/15 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
                </div>

                <main className="relative mx-auto max-w-6xl px-6 py-20">
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

                    <section className="mt-12 grid gap-6 md:grid-cols-2">
                        <Link
                            to={copy.miningRoute}
                            className="group rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(138,87,255,0.22)] dark:border-slate-700/60 dark:bg-slate-900/60"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] text-2xl text-white shadow-lg">
                                ⛏
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 transition group-hover:text-[#8A57FF] dark:text-white">
                                {copy.miningTitle}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {copy.miningDescription}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 font-semibold text-[#8A57FF]">
                                {copy.openLabel}
                                <span className="transition group-hover:translate-x-1">→</span>
                            </div>
                        </Link>

                        <Link
                            to={copy.posRoute}
                            className="group rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(74,203,255,0.22)] dark:border-slate-700/60 dark:bg-slate-900/60"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#4ACBFF] text-2xl text-white shadow-lg">
                                ⚖
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 transition group-hover:text-[#0F766E] dark:text-white">
                                {copy.posTitle}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {copy.posDescription}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0F766E]">
                                {copy.openLabel}
                                <span className="transition group-hover:translate-x-1">→</span>
                            </div>
                        </Link>
                    </section>
                </main>
            </div>
        </PageShell>
    );
}
