import PageShell from '../../components/PageShell.jsx';
import { ACCENT_PRIMARY, ACCENT_SECONDARY } from '../../design/theme.js';

const accentCardClasses = {
    blue: 'border-sky-300/80 bg-sky-50/90 hover:border-sky-400 dark:border-sky-500/40 dark:bg-sky-500/15 dark:hover:border-sky-400/60',
    violet: 'border-violet-300/80 bg-violet-50/90 hover:border-violet-400 dark:border-violet-500/40 dark:bg-violet-500/15 dark:hover:border-violet-400/60',
    emerald: 'border-emerald-300/80 bg-emerald-50/90 hover:border-emerald-400 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:hover:border-emerald-400/60',
};

const content = {
    EN: {
        tag: '🧩 Proof of Escape',
        title: 'Interactive Learning Adventure',
        intro:
            'Explore blockchain concepts through storytelling and puzzles. Choose the classic narrative run or dive into festival quests with live DAO rewards.',
        experiences: [
            {
                key: 'main-game',
                title: 'Proof of Escape — Core Story',
                emoji: '🧠',
                description: 'Start the narrative-driven quiz that introduces core blockchain ideas through puzzles and missions.',
                link: 'https://dimikog.github.io/proof-of-escape/',
                accent: 'blue',
                cta: 'Launch Main Experience',
            },
            {
                key: 'festival',
                title: 'Festival Edition Dapp',
                emoji: '🎉',
                description: 'Join community events with seasonal quests, bonus challenges, and collectible NFTs.',
                link: 'https://dimikog.github.io/poe-festival-dapp/',
                accent: 'violet',
                cta: 'Open Festival Edition',
            },
        ],
        readyTitle: 'Ready for More?',
        readyBody:
            'After each mission, record your progress in the Education Portal and unlock deeper experiments across the Web3Edu ecosystem.',
        homeCta: 'Back to Web3Edu Home',
    },
    GR: {
        tag: '🧩 Proof of Escape',
        title: 'Διαδραστική Εμπειρία Μάθησης',
        intro:
            'Εξερευνήστε τις έννοιες του blockchain μέσα από ιστορίες και γρίφους. Επιλέξτε την κλασική διαδρομή ή ζήστε τα festival quests με ζωντανές ανταμοιβές DAO.',
        experiences: [
            {
                key: 'main-game',
                title: 'Proof of Escape — Βασική Ιστορία',
                emoji: '🧠',
                description: 'Ξεκινήστε το παιχνίδι με αποστολές και γρίφους που παρουσιάζουν τις θεμελιώδεις έννοιες του blockchain.',
                link: 'https://dimikog.github.io/proof-of-escape/',
                accent: 'blue',
                cta: 'Εκκίνηση Κύριας Εμπειρίας',
            },
            {
                key: 'festival',
                title: 'Festival Edition Dapp',
                emoji: '🎉',
                description: 'Συμμετέχετε σε εποχιακά quests, bonus challenges και collectible NFTs μαζί με την κοινότητα.',
                link: 'https://dimikog.github.io/poe-festival-dapp/',
                accent: 'violet',
                cta: 'Άνοιγμα Festival Edition',
            },
        ],
        readyTitle: 'Έτοιμοι για συνέχεια;',
        readyBody:
            'Μετά από κάθε αποστολή, καταγράψτε την πρόοδό σας στο Education Portal και ξεκλειδώστε βαθύτερα πειράματα στο οικοσύστημα Web3Edu.',
        homeCta: 'Επιστροφή στο Web3Edu Home',
    },
};

export default function Poe({ language = 'EN' }) {
    const strings = content[language] ?? content.EN;

    return (
        <PageShell accentColor={ACCENT_PRIMARY} innerClassName="items-center">
            <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-lg backdrop-blur-sm transition dark:border-slate-700/50 dark:bg-slate-900/80 sm:p-12">
                <div className="absolute top-5 right-5 flex items-center gap-2 text-sm">
                    <a
                        href={language === 'EN' ? '#/poe-gr' : '#/poe'}
                        className="rounded-lg bg-slate-200 px-3 py-1 text-slate-800 transition hover:bg-slate-300 dark:bg-gray-700 dark:text-slate-100 dark:hover:bg-gray-600"
                    >
                        {language === 'EN' ? '🇬🇷 GR' : '🇬🇧 EN'}
                    </a>
                </div>

                <header className="space-y-4 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/80 bg-indigo-100/90 px-4 py-1 text-sm font-medium text-indigo-800 shadow-sm dark:border-indigo-400/60 dark:bg-indigo-500/20 dark:text-indigo-100">
                        {strings.tag}
                    </div>
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {strings.title}
                    </h1>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">
                        {strings.intro}
                    </p>
                </header>

                <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {strings.experiences.map((exp) => {
                        const accentClasses =
                            accentCardClasses[exp.accent] ??
                            'border-indigo-200/70 bg-indigo-50/80 hover:border-indigo-300 dark:border-indigo-500/40 dark:bg-slate-900/70 dark:hover:border-indigo-400/60';

                        return (
                            <a
                                key={exp.key}
                                href={exp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex h-full flex-col justify-between rounded-2xl border p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${accentClasses}`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-2xl">
                                        <span aria-hidden>{exp.emoji}</span>
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {exp.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                                        {exp.description}
                                    </p>
                                </div>
                                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-800 transition-colors duration-200 group-hover:text-indigo-700 dark:text-indigo-100 dark:group-hover:text-white">
                                    {exp.cta} ↗
                                </div>
                            </a>
                        );
                    })}
                </section>

                <div
                    className="my-10 h-px w-full"
                    style={{ backgroundColor: ACCENT_SECONDARY }}
                />

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {strings.readyTitle}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                        {strings.readyBody}
                    </p>
                </section>

                <div className="mt-8 text-center">
                    <a
                        href="https://web3edu.dimikog.org"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-600"
                    >
                        <span>🏠</span> {strings.homeCta}
                    </a>
                </div>
            </div>
        </PageShell>
    );
}
