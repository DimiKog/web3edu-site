import { useState } from "react";

export default function PilotBanner({ lang = "en" }) {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem("web3edu-pilot-banner-collapsed") === "true";
        } catch {
            return false;
        }
    });

    const collapseBanner = () => {
        setCollapsed(true);
        try {
            localStorage.setItem("web3edu-pilot-banner-collapsed", "true");
        } catch {
            // Ignore storage write failures (e.g. private mode restrictions).
        }
    };

    return (
        <div className="relative z-10 w-full max-w-6xl mx-auto mb-8 px-2 md:px-0 animate-[fadeSlideUp_0.5s_ease-out]">
            {!collapsed ? (
                /* FULL BANNER */
                <div className="relative overflow-hidden rounded-2xl
          border border-fuchsia-300/30 dark:border-fuchsia-700/30
          bg-gradient-to-br
            from-white/95 via-fuchsia-50/70 to-slate-100/90
            dark:from-[#16081f]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
          backdrop-blur-xl shadow-xl"
                >
                    {/* Glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-fuchsia-500/25 blur-[120px]" />
                        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-purple-500/20 blur-[140px]" />
                    </div>

                    <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br from-fuchsia-500 to-purple-500
                flex items-center justify-center shadow-md"
                            >
                                <span className="text-2xl">🚀</span>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {lang === "gr" ? "Είσαι Πιλοτικός Χρήστης" : "You’re a Pilot User"}
                                </h3>

                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                                    {lang === "gr"
                                        ? "Συμμετέχεις στην πιλοτική φάση του Web3Edu. Τα σχόλια και οι παρατηρήσεις σου βοηθούν άμεσα στη βελτίωση της πλατφόρμας."
                                        : "You are participating in the pilot phase of Web3Edu. Your feedback directly helps shape and improve the platform."}
                                </p>

                                <a
                                    href="https://teams.microsoft.com/l/team/19%3Apwj5b5f8p7xMSvMQLth7ewFU5-aSEeowtClTZHt9Zqg1%40thread.tacv2/conversations?groupId=e5ff2c9e-34e6-4d42-9246-88b9de4fd760&tenantId=0c8943ee-c370-4bb3-ba51-321f406f32ec"
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold
                    text-fuchsia-600 dark:text-fuchsia-400
                    hover:underline mt-1"
                                >
                                    {lang === "gr"
                                        ? "💬 Συμμετοχή στη συζήτηση του μαθήματος (Microsoft Teams)"
                                        : "💬 Join the course discussion (Microsoft Teams)"}
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={collapseBanner}
                            className="self-start md:self-center
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-white/60 dark:bg-white/10
                border border-slate-300/40 dark:border-white/10
                text-slate-700 dark:text-slate-200
                hover:bg-white/80 dark:hover:bg-white/20
                transition"
                        >
                            {lang === "gr" ? "Εντάξει" : "Got it"}
                        </button>
                    </div>
                </div>
            ) : (
                /* COLLAPSED STRIP */
                <div className="flex items-center justify-between gap-4
          px-4 py-2 rounded-xl
          bg-fuchsia-100/70 dark:bg-fuchsia-900/30
          border border-fuchsia-300/40 dark:border-fuchsia-700/40"
                >
                    <span className="font-semibold text-sm text-fuchsia-700 dark:text-fuchsia-300">
                        🚀 {lang === "gr" ? "Πιλοτικός Χρήστης" : "Pilot User"}
                    </span>

                    <a
                        href="https://teams.microsoft.com/l/team/19%3Apwj5b5f8p7xMSvMQLth7ewFU5-aSEeowtClTZHt9Zqg1%40thread.tacv2/conversations?groupId=e5ff2c9e-34e6-4d42-9246-88b9de4fd760&tenantId=0c8943ee-c370-4bb3-ba51-321f406f32ec"
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:underline"
                    >
                        {lang === "gr" ? "Συζήτηση μαθήματος →" : "Course discussion →"}
                    </a>
                </div>
            )}
        </div>
    );
}
