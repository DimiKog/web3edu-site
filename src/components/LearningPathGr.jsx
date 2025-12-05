const LearningPath = ({ content }) => (
    <section className="mt-12 rounded-2xl border border-slate-200/40 bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF] p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/40 dark:bg-gradient-to-br dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D]">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {content.title}
        </h2>

        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {content.subtitle}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {content.steps.map((step, i) => (
                <div
                    key={i}
                    className="group rounded-2xl bg-white/70 p-5 shadow-md border border-[#8A57FF]/10 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(138,87,255,0.35)] transition-all dark:bg-slate-900/50"
                >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20 text-2xl dark:bg-gradient-to-br dark:from-[#8A57FF]/15 dark:via-[#4ACBFF]/15 dark:to-[#FF67D2]/15">
                        {step.emoji}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {step.title}
                    </h3>
                    <p className="mt-3 text-base text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

export default LearningPath;