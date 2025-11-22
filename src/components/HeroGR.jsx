import web3EduLogo from "../assets/web3edu_logo.svg";
import { ACCENT_PRIMARY } from "../design/theme.js";

const Hero = ({ content }) => (
    <header
        className="relative overflow-hidden mt-10 rounded-3xl px-6 py-12 sm:py-16 text-center shadow-xl sm:mt-16 sm:px-10
                   bg-gradient-to-br from-[#1b2337] via-[#1f2a44] to-[#1b2337]
                   border border-white/10 backdrop-blur-xl space-y-6"
    >
        <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]"></div>
        <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:text-center sm:gap-6">
            <div className="relative inline-flex items-center justify-center rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.03]">
                <div className="absolute inset-0 -z-10 blur-[60px] bg-[#33D6FF]/30 rounded-2xl"></div>
                <img src={web3EduLogo} alt="Web3Edu logo" className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain drop-shadow-[0_0_20px_rgba(0,200,255,0.45)]" />
            </div>
            <div className="space-y-4">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold
           bg-white/10 text-white border border-white/25 shadow-sm backdrop-blur-md tracking-wide">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-indigo-300"
                    >
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {content.tagline}
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                    👋 {content.welcome}
                </h1>
            </div>
        </div>

        <p className="relative mx-auto max-w-2xl text-xl font-medium leading-relaxed text-slate-200/90 drop-shadow-sm tracking-wide">
            {content.desc}
        </p>
        <div className="mt-6">
            <a
                href="#/join"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold
                           bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-900/30
                           transition-all duration-300 hover:scale-[1.03]"
            >
                Ξεκίνα τη Μάθηση →
            </a>
        </div>
        <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-[18%] right-[20%] w-2 h-2 bg-[#33D6FF]/50 rounded-full animate-ping"></div>
        <div className="absolute top-[55%] right-[28%] w-2 h-2 bg-[#7F3DF1]/50 rounded-full animate-ping"></div>
    </header>
);

export default Hero;