const NewsSection = ({ content }) => (
    <section className="relative mt-12 rounded-3xl p-8 border bg-white/95 shadow-xl dark:bg-slate-900/70">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                🗓 {content.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {content.subtitle}
            </p>
            <a href="/#/news" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 text-xs underline hover:text-indigo-800">
                {content.viewArchive} ↗
            </a>
        </div>

        {/* Timeline */}
        <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute top-0 left-2 w-[3px] h-full bg-gradient-to-b from-indigo-300 to-indigo-600 dark:from-indigo-500 dark:to-indigo-300 rounded-full"></div>

            <div className="space-y-10">
                {content.items.map((n, i) => (
                    <div key={i} className="relative">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[10px] top-1 h-4 w-4 bg-indigo-600 dark:bg-indigo-400 border-[3px] border-white dark:border-slate-900 rounded-full shadow-md"></div>

                        {/* Card */}
                        <div className="ml-4 rounded-2xl bg-white/95 dark:bg-slate-900/70 p-5 shadow-md border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all">
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300">
                                {n.date}
                            </span>

                            <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">
                                {n.title}
                            </h3>

                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {n.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default NewsSection;