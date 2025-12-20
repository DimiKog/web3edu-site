export default function DashboardCard({ title, icon, status, statusLabel, children, className = "" }) {
    return (
        <div
            className={`
            relative rounded-3xl p-6
            border border-indigo-300/40 dark:border-indigo-700/30
            bg-gradient-to-br from-white/90 via-indigo-50/75 to-slate-100/85
            dark:from-[#0E1426]/85 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
            dark:border-white/10
            backdrop-blur-xl
            shadow-xl
            transition-all duration-500 ease-out
            hover:scale-[1.01] hover:shadow-2xl
            opacity-0 animate-fadeInSlow
            break-words whitespace-normal
            ${className}
        `}
        >
            {status === "completed" && (
                <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                        bg-green-500/90 text-white text-xs font-semibold
                        shadow-lg backdrop-blur">
                        ✓ {statusLabel || "Completed"}
                    </span>
                </div>
            )}

            {/* Title + optional icon */}
            <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-slate-100">
                {icon && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg 
                                    bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] shadow-md">
                        {icon}
                    </div>
                )}

                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-wide tracking-tight break-words whitespace-normal">
                    {title}
                </h2>
            </div>

            {/* Main content */}
            <div className="text-slate-800 dark:text-slate-100 break-words whitespace-normal">
                {children}
            </div>
        </div>
    );
}
