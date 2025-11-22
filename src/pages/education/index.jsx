import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell.jsx";
import { ACCENT_SECONDARY } from "../../design/theme.js";

export default function Education() {
    return (
        <PageShell innerClassName="items-center">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm transition dark:bg-slate-900/80 sm:p-12">

                {/* 🌐 Language Toggle */}
                <div className="absolute top-5 right-5 flex items-center gap-2 text-sm">
                    <a
                        href="#/education-gr"
                        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        title="Ελληνικά"
                    >
                        🇬🇷 GR
                    </a>
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🎓</span>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Education Portal
                    </h1>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Welcome to your Web3 course environment. This portal includes resources,
                    tools, and verifiers for your Besu EduNet learning experience.
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-10 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                        <span>📘</span> NFT-based participation access
                    </li>
                    <li className="flex items-center gap-2">
                        <span>📂</span> Course modules and lecture materials
                    </li>
                    <li className="flex items-center gap-2">
                        <span>🔐</span> Gated content requiring your Web3Edu SBT
                    </li>
                </ul>

                {/* Section Divider */}
                <div
                    className="my-8 h-px w-full"
                    style={{ backgroundColor: ACCENT_SECONDARY }}
                ></div>

                {/* Tools & Verifiers Section */}
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🧠 Tools & Verifiers
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Before accessing gated content, verify your wallet connection and
                    balance on the <strong>Besu EduNet</strong> network.
                </p>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <Link
                        to="/education/network-check"
                        className="w-full md:flex-1 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/25"
                    >
                        🔗 Open Besu Network Verifier
                    </Link>

                    <Link
                        to="/education/nft-verifier"
                        className="w-full md:flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/25"
                    >
                        🪪 Open NFT Verifier (coming soon)
                    </Link>
                </div>

                {/* Section Divider */}
                <div
                    className="my-10 h-px w-full"
                    style={{ backgroundColor: ACCENT_SECONDARY }}
                ></div>

                {/* Home Button */}
                <div className="text-center">
                    <a
                        href="https://web3edu.dimikog.org"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg transition"
                    >
                        <span>🏠</span> Back to Web3Edu Home
                    </a>
                </div>
            </div>
        </PageShell>
    );
}
