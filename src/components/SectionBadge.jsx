const VARIANTS = {
    light: {
        wrapper: "bg-indigo-200/80 dark:bg-indigo-700/50 text-indigo-800 dark:text-indigo-200 shadow-indigo-300/40 border-indigo-400/40",
        dot: "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.9)]",
    },
    dark: {
        wrapper: "bg-white/15 text-white border-white/30 shadow-white/30",
        dot: "bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]",
    },
};

const SectionBadge = ({ label, className = "", variant = "light" }) => {
    const styles = VARIANTS[variant] || VARIANTS.light;

    return (
        <div
            className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full 
        text-base font-extrabold shadow-md backdrop-blur-sm border ${styles.wrapper} ${className}`.trim()}
        >
            <span className={`h-2.5 w-2.5 rounded-full animate-ping ${styles.dot}`}></span>
            <span>{label}</span>
        </div>
    );
};

export default SectionBadge;
