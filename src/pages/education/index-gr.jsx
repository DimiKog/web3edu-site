import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell.jsx";
import { ACCENT_SECONDARY } from "../../design/theme.js";

export default function EducationGR() {
    return (
        <PageShell innerClassName="items-center">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white/90 p-8 shadow-lg backdrop-blur-sm transition dark:bg-slate-900/80 sm:p-12">

                {/* 🌐 Εναλλαγή Γλώσσας */}
                <div className="absolute top-5 right-5 flex items-center gap-2 text-sm">
                    <a
                        href="#/education"
                        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        title="English"
                    >
                        🇬🇧 EN
                    </a>
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🎓</span>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Εκπαιδευτική Πύλη
                    </h1>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Καλώς ήρθατε στο περιβάλλον μαθημάτων Web3. Η πύλη αυτή περιλαμβάνει πόρους,
                    εργαλεία και επαληθευτές για την εκπαιδευτική σας εμπειρία στο Besu EduNet.
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-10 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                        <span>📘</span> Πρόσβαση με NFT συμμετοχής
                    </li>
                    <li className="flex items-center gap-2">
                        <span>📂</span> Ενότητες μαθημάτων και εκπαιδευτικό υλικό
                    </li>
                    <li className="flex items-center gap-2">
                        <span>🔐</span> Προστατευμένο περιεχόμενο με το Web3Edu SBT
                    </li>
                </ul>

                <div
                    className="my-8 h-px w-full"
                    style={{ backgroundColor: ACCENT_SECONDARY }}
                ></div>

                {/* Tools & Verifiers */}
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🧠 Εργαλεία & Επαληθευτές
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Πριν αποκτήσετε πρόσβαση στο προστατευμένο περιεχόμενο, επιβεβαιώστε τη σύνδεσή σας
                    και το υπόλοιπο σας στο <strong>Besu EduNet</strong>.
                </p>

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <Link
                        to="/education/network-check-gr"
                        className="w-full md:flex-1 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/25"
                    >
                        🔗 Άνοιγμα Επαληθευτή Δικτύου Besu
                    </Link>

                    <Link
                        to="/education/nft-verifier-gr"
                        className="w-full md:flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/25"
                    >
                        🪪 Άνοιγμα Επαληθευτή NFT (σύντομα διαθέσιμο)
                    </Link>
                </div>

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
                        <span>🏠</span> Επιστροφή στην Αρχική
                    </a>
                </div>
            </div>
        </PageShell>
    );
}
