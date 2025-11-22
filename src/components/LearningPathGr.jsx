const LearningPath = ({ content }) => (
    <section className="mt-12 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {content.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {content.subtitle}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {content.steps.map((step, i) => (
                <div
                    key={i}
                    className="group rounded-2xl bg-white/80 p-5 shadow-md border border-transparent hover:-translate-y-1 hover:shadow-xl transition-all dark:bg-slate-900/60"
                >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl dark:bg-slate-800/70">
                        {step.emoji}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {step.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

export default LearningPath;