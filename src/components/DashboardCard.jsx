export default function DashboardCard({ title, icon, children, className = "" }) {
    return (
        <div
            className={`
            rounded-3xl p-6
            border border-indigo-300/40 dark:border-indigo-700/30
            shadow-[0_12px_40px_rgba(0,0,0,0.35)]
            bg-gradient-to-br from-white via-indigo-50/40 to-slate-100/60
            dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/40
            backdrop-blur-2xl
            transition duration-300
            break-words whitespace-normal
            ${className}
        `}
        >
            {/* Title + optional icon */}
            <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-slate-100">
                {icon && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg 
                                    bg-gradient-to-br from-[#7F3DF1] to-[#33D6FF] shadow-lg">
                        {icon}
                    </div>
                )}

                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-wide break-words whitespace-normal">
                    {title}
                </h2>
            </div>

            {/* Main content */}
            <div className="text-slate-800 dark:text-slate-200 break-words whitespace-normal">
                {children}
            </div>
        </div>
    );
}