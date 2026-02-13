<style>
    {`
@keyframes float {0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
@keyframes float-delayed {0%{transform:translateY(0)}50%{transform:translateY(6px)}100%{transform:translateY(0)}}
@keyframes float-slow {0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}
.animate-float {animation: float 4s ease-in-out infinite;}
.animate-float-delayed {animation: float-delayed 5s ease-in-out infinite;}
.animate-float-slow {animation: float-slow 6s ease-in-out infinite;}
.animate-fadeIn {animation: fadeIn .6s ease-out;}
@keyframes fadeIn {from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.animate-slideUp {animation: slideUp .7s ease-out;}
@keyframes slideUp {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.motivation-highlight {display:inline-flex;align-items:center;padding:0.12em 0.5em;margin:0 0.12em;border-radius:999px;background: linear-gradient(120deg,
rgba(138,87,255,0.22),
rgba(74,203,255,0.22),
rgba(255,103,210,0.22));border:1px solid rgba(138,87,255,0.40);color:#0f172a;font-weight:600;box-shadow:0 8px 24px rgba(79,70,229,0.15);transition:transform .2s ease,box-shadow .2s ease;white-space:nowrap;}
.motivation-highlight::after {content:"";width:6px;height:6px;border-radius:999px;margin-left:6px;background: radial-gradient(circle, rgba(255,103,210,0.8), rgba(74,203,255,0.2));box-shadow:0 0 12px rgba(236,72,153,0.5);}
.motivation-highlight:hover {transform:translateY(-1px) scale(1.01);box-shadow:0 12px 26px rgba(59,130,246,0.22);}
.dark .motivation-highlight {color:#f8fafc;border-color: rgba(138,87,255,0.35);background: linear-gradient(120deg,
rgba(138,87,255,0.25),
rgba(74,203,255,0.18),
rgba(255,103,210,0.22));box-shadow:0 10px 28px rgba(15,23,42,0.8);}
`}
</style>

const Motivation = ({ content }) => {
    let formattedBody = content.body;

    if (typeof content.body === "string") {
        const highlightPhrases = [
            // English phrases
            "courses",
            "practical tools",
            "experiment-driven learning",
            "blockchain technologies and beyond",
            "hands-on labs",
            "gamified challenges",
            "decentralized systems",
            "verifiable credentials",
            "DAO participation",
            // Greek phrases
            "μαθήματα",
            "πρακτικά εργαλεία",
            "βιωματική μάθηση",
            "hands-on εργαστήρια",
            "παιχνιδοποιημένα challenges",
            "αποκεντρωμένα συστήματα",
            "επαληθεύσιμα διαπιστευτήρια",
            "συμμετοχή στο DAO",
        ];

        const escapeRegex = (str) =>
            str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (highlightPhrases.length) {
            const highlightRegex = new RegExp(
                `(${highlightPhrases.map(escapeRegex).join("|")})`,
                "gi"
            );

            formattedBody = content.body.replace(
                highlightRegex,
                '<span class="motivation-highlight">$1</span>'
            );
        }
    }

    return (
        <section
            className="
            mt-4 relative overflow-hidden  
            rounded-2xl px-6 py-8 sm:px-10 sm:py-10
            bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF]
            dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D]
            border border-slate-200/40 dark:border-white/10
            shadow-xl backdrop-blur-2xl
            "
        >
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="hidden sm:block absolute -top-24 -right-16 w-72 h-72 bg-[radial-gradient(circle,rgba(138,87,255,0.22),transparent_65%)] blur-3xl" />
                <div className="hidden sm:block absolute -bottom-24 -left-20 w-80 h-80 bg-[radial-gradient(circle,rgba(74,203,255,0.18),transparent_70%)] blur-[90px]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-[#8A57FF]/15 via-transparent to-[#4ACBFF]/15 opacity-70 blur-3xl" />
            </div>

            <div className="absolute left-0 top-0 h-full w-[3px]
            bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
            animate-pulse opacity-70 z-10"></div>

            <div className="relative z-20">
                <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full
                bg-[#EDE9FF]/80 dark:bg-[#1A1035]/60
                text-[#4B3CFF] dark:text-[#9F8CFF]
                border border-[#4B3CFF]/30 dark:border-[#9F8CFF]/30
                text-lg font-semibold shadow-md
                backdrop-blur-md
                animate-fadeIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{content.badgeText ?? "Because learning Web3 should feel empowering."}</span>
                </div>

                <div className="absolute left-0 right-0 top-[78px] h-[3px] bg-gradient-to-r from-transparent via-[#8A3FFC]/50 to-transparent animate-pulse"></div>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text 
                bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                dark:from-[#C9B3FF] dark:via-[#8EE8FF] dark:to-[#FF9EE6]
                mt-2 mb-4 tracking-tight drop-shadow-[0_0_18px_rgba(90,40,255,0.35)]">
                    {content.detailHeading || content.heading || "Our Mission"}
                </h3>

                {/* SECURITY: Safe to use dangerouslySetInnerHTML here because:
                    1. Content source: Hardcoded strings from src/content/en.js (developer-controlled)
                    2. Processing: Only wraps known phrases with <span> tags
                    3. No user input: All content is static and trusted
                    See: dangerouslySetInnerHTML-security-report.md for full audit */}
                <p
                    className="text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-slate-100 max-w-3xl animate-slideUp tracking-wide space-y-3"
                    dangerouslySetInnerHTML={{
                        __html: formattedBody,
                    }}
                />
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-30 z-10">
                <div className="absolute w-3 h-3 bg-[#8A57FF]/40 rounded-full top-12 left-24 animate-float" />
                <div className="absolute w-2 h-2 bg-[#FF67D2]/40 rounded-full top-1/3 left-1/4 animate-float-delayed" />
                <div className="absolute w-3 h-3 bg-[#4ACBFF]/40 rounded-full bottom-12 right-20 animate-float-slow" />
                <div className="absolute w-2 h-2 bg-[#8A57FF]/35 rounded-full bottom-1/3 right-1/4 animate-float" />
                <div className="absolute w-1.5 h-1.5 bg-[#8A57FF]/30 rounded-full top-1/4 right-1/3 animate-float-delayed" />
            </div>
        </section>
    );
};

export default Motivation;
