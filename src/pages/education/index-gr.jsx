import { Link } from "react-router-dom";

export default function EducationGR() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 relative">

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

                <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                {/* Tools & Verifiers */}
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    🧠 Εργαλεία & Επαληθευτές
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Πριν αποκτήσετε πρόσβαση στο προστατευμένο περιεχόμενο, επιβεβαιώστε τη σύνδεσή σας
                    και το υπόλοιπο σας στο <strong>Besu EduNet</strong>.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/education/network-check-gr"
                        className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-4 rounded-lg transition border border-indigo-300 text-center"
                    >
                        🔗 Άνοιγμα Επαληθευτή Δικτύου Besu
                    </Link>

                    <Link
                        to="/education/nft-verifier-gr"
                        className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-4 rounded-lg transition border border-green-300 text-center"
                    >
                        🪪 Άνοιγμα Επαληθευτή NFT (σύντομα διαθέσιμο)
                    </Link>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-10"></div>

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
        </div>
    );
}
