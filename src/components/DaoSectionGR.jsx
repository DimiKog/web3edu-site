const DaoSection = ({ content }) => (
    <section className="mt-12 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 p-6 text-center shadow-sm dark:border-indigo-800 dark:from-indigo-900/30 dark:to-violet-900/30">
        <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            {content.title}
        </h2>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{content.desc}</p>

        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <a
                href="/#/dao-info"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-800/70"
            >
                {content.buttons.learn} ↗
            </a>
            <a
                href="/#/dao"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-600/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500/80"
            >
                {content.buttons.enter} ↗
            </a>
        </div>
    </section>
);

export default DaoSection;