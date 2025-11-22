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
                mt-10 rounded-2xl px-8 py-7
                bg-gradient-to-br from-white/70 via-white/60 to-white/70
                dark:from-slate-900/50 dark:via-slate-900/40 dark:to-slate-900/50
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
                    className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm"
                >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                </svg>

                <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent 
    bg-gradient-to-r from-[#ff77e9] to-[#7bc4ff]">
                    {content.heading}
                </h2>
            </div>
            <div className="w-full h-[3px] mb-4 rounded-full 
      bg-gradient-to-r from-[#ff77e9]/60 via-[#7bc4ff]/60 to-[#ff77e9]/60 
      animate-pulse"></div>

            <p
                className="
                    text-[17px] leading-[1.75] md:leading-relaxed
                    text-slate-700 dark:text-slate-300
                    max-w-3xl
                "
                dangerouslySetInnerHTML={{ __html: formattedBody }}
            />
        </section>
    );
};

export default Motivation;