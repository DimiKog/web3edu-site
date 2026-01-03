const DaoSection = ({ content }) => (
    <section className="mt-12 rounded-2xl border border-[#8A57FF]/25 bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF] p-6 text-center shadow-sm dark:border-[#8A57FF]/30 dark:bg-gradient-to-br dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D]">
        <h2 className="text-xl md:text-2xl font-semibold text-[#8A57FF] dark:text-[#CBB2FF]">
            {content.title}
        </h2>
        <p className="mt-3 text-xs md:text-sm leading-relaxed md:leading-loose text-slate-700 dark:text-white/80">
            {content.desc}
        </p>

        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <a
                href="/#/dao-info"
                className="inline-flex items-center gap-2 rounded-full border border-[#8A57FF]/40 bg-white/80 px-4 py-2 text-sm font-medium text-[#8A57FF] shadow-sm hover:border-[#CBB2FF] hover:text-[#CBB2FF] dark:bg-slate-800/60"
            >
                {content.buttons.learn} ↗
            </a>
            <a
                href="/#/dao-preview"
                className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#8A57FF] px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,87,255,0.45)] hover:bg-[#7A4DE5] hover:shadow-[0_0_18px_rgba(138,87,255,0.55)] dark:bg-[#8A57FF]/90"
            >
                {content.buttons.enter} ↗
            </a>
        </div>
    </section>
);

export default DaoSection;