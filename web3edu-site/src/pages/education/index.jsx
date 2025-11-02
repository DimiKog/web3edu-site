import { Link } from "react-router-dom";

export default function Education() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">

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
                <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                {/* Tools & Verifiers Section */}
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🧠 Tools & Verifiers
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Before accessing gated content, verify your wallet connection and
                    balance on the <strong>Besu EduNet</strong> network.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/education/network-check"
                        className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-4 rounded-lg transition border border-indigo-300 text-center"
                    >
                        🔗 Open Besu Network Verifier
                    </Link>

                    <Link
                        to="/education/nft-verifier"
                        className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-4 rounded-lg transition border border-green-300 text-center"
                    >
                        🪪 Open NFT Verifier (coming soon)
                    </Link>
                </div>

                {/* Section Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-10"></div>

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
        </div>
    );
}
