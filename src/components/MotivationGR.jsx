import { ACCENT_SECONDARY } from "../design/theme.js";

const Motivation = ({ content }) => {
    let formattedBody = content.body;

    if (typeof content.body === "string") {
        formattedBody = content.body
            .replace(/μαθήματα/gi, '<span class="font-semibold text-slate-900 dark:text-white">μαθήματα</span>')
            .replace(/πρακτικά εργαλεία/gi, '<span class="font-semibold text-slate-900 dark:text-white">πρακτικά εργαλεία</span>')
            .replace(/βιωματική μάθηση|πειραματική μάθηση/gi, '<span class="font-semibold text-slate-900 dark:text-white">βιωματική μάθηση</span>')
            .replace(/blockchain και πέρα|τεχνολογίες blockchain και πέρα/gi, '<span class="font-semibold text-slate-900 dark:text-white">blockchain και πέρα</span>')
            .replace(/hands-on εργαστήρια|εργαστήρια/gi, '<span class="font-semibold text-slate-900 dark:text-white">εργαστήρια</span>')
            .replace(/gamified challenges|παιγνιοποιημένα challenges/gi, '<span class="font-semibold text-slate-900 dark:text-white">gamified challenges</span>')
            .replace(/αποκεντρωμένα συστήματα/gi, '<span class="font-semibold text-slate-900 dark:text-white">αποκεντρωμένα συστήματα</span>')
            .replace(/επαληθεύσιμα διαπιστευτήρια/gi, '<span class="font-semibold text-slate-900 dark:text-white">επαληθεύσιμα διαπιστευτήρια</span>')
            .replace(/DAO συμμετοχή|συμμετοχή στο DAO/gi, '<span class="font-semibold text-slate-900 dark:text-white">DAO συμμετοχή</span>');
    }

    return (
        <section
            className="
                mt-10 rounded-2xl px-6 py-7 sm:px-8
                bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF]
                dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D]
                border border-slate-200/40 dark:border-white/10
                shadow-lg backdrop-blur-xl
            "
        >
            <div className="flex items-center gap-3 mb-3">
                <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#8A57FF] dark:text-[#C9B3FF] drop-shadow-sm"
                >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                </svg>

                <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent 
    bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
    dark:from-[#C9B3FF] dark:via-[#8EE8FF] dark:to-[#FF9EE6]">
                    {content.heading}
                </h2>
            </div>
            <div className="w-full h-[3px] mb-4 rounded-full 
      bg-gradient-to-r from-[#8A57FF]/60 via-[#4ACBFF]/60 to-[#FF67D2]/60 
      animate-pulse"></div>

            <p
                className="
                    text-lg sm:text-xl leading-[1.75] md:leading-relaxed
                    text-slate-700 dark:text-slate-300
                    max-w-3xl
                    opacity-0 translate-y-4 transition-all duration-700 ease-out
                    animate-fadeInSlow
                "
                dangerouslySetInnerHTML={{ __html: formattedBody }}
            />
        </section>
    );
};

export default Motivation;