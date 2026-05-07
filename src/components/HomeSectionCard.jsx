const HomeSectionCard = ({ children, className = "" }) => (
    <div className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
        <div
            className={[
                "rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/80 dark:bg-slate-900/60 shadow-xl hover:shadow-[0_16px_40px_rgba(138,87,255,0.28)] sm:hover:scale-[1.015] border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-sm",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    </div>
);

export default HomeSectionCard;
