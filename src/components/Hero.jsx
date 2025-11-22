import { useEffect } from "react";
import web3EduLogo from "../assets/web3edu_logo.png";

const Hero = ({ content }) => {
    useEffect(() => {
        const h = () => {
            document.documentElement.style.setProperty("--scrollPos", window.scrollY);
        };
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    const ctaLabel = content.cta ?? "Start Learning";

    return (
        <header className="w-full py-32 sm:py-28 px-6 bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#081018] overflow-hidden rounded-b-[80px] lg:rounded-b-[120px] relative z-10">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[520px] h-[520px] bg-[#33D6FF]/18 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#E05BFF]/20 blur-[160px] rounded-full"></div>
            </div>

            {/* FLOATING PARTICLES */}
            <div className="pointer-events-none absolute inset-0 opacity-55 [transform:translateY(calc(var(--scrollPos)*0.15))] transition-transform duration-75">
                <div className="absolute w-96 h-96 rounded-full bg-[#D84FD1]/10 blur-3xl animate-pulse-slow top-10 left-10"></div>
                <div className="absolute w-80 h-80 rounded-full bg-[#38C7FF]/20 blur-2xl animate-pulse-slow2 bottom-10 right-20"></div>
            </div>

            {/* HOLOGRAM SHIMMER LINE */}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16">

                {/* LEFT SIDE — Logo + Tagline */}
                <div className="flex flex-col items-center lg:items-center text-center lg:text-center gap-4">
                    <div className="p-8 bg-white/5 rounded-3xl shadow-xl backdrop-blur-xl border border-white/10 hover:shadow-cyan-500/30 transition duration-300 [perspective:1000px] relative">
                        <div className="transition-transform duration-500 hover:[transform:rotateX(6deg)_rotateY(-6deg)_scale(1.05)]">
                            <img src={web3EduLogo} alt="Web3Edu" className="h-48 w-48 lg:h-56 lg:w-56 xl:h-64 xl:w-64 rounded-2xl object-contain drop-shadow-[0_0_30px_rgba(0,200,255,0.55)]" />
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E05BFF]/22 via-[#7F3DF1]/26 to-[#33D6FF]/22 blur-2xl opacity-40 pointer-events-none"></div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold bg-gradient-to-r from-[#D84FD1]/20 via-[#7F3DF1]/20 to-[#38C7FF]/20 text-white border border-white/20 shadow-md tracking-wide backdrop-blur-md">
                        {content.tagline}
                    </div>
                </div>

                {/* RIGHT SIDE — Text + CTA */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-xl relative">
                    <div className="absolute -z-10 -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
                    <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#E05BFF] via-[#9A5CFF] to-[#33D6FF] text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(0,255,255,.35)] animate-fade-up">
                        👋 {content.welcome}
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-100/95 leading-relaxed max-w-lg animate-fade-up delay-150">
                        {content.desc}
                    </p>

                    <a
                        href="/#/join"
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#E05BFF] via-[#7F3DF1] to-[#33D6FF] hover:from-[#D849F2] hover:via-[#8A4BFF] hover:to-[#28C7F3] text-white font-semibold shadow-xl shadow-cyan-500/20 transition duration-300 animate-fade-up delay-300"
                    >
                        🚀 {ctaLabel}
                    </a>
                </div>

            </div>
        </header>
    );
};

<style jsx>{`
    @keyframes holo-shimmer {
        0% { opacity: .2; transform: translateX(-20%); }
        50% { opacity: 1; transform: translateX(20%); }
        100% { opacity: .2; transform: translateX(-20%); }
    }
    .animate-holo-shimmer { animation: holo-shimmer 3.2s ease-in-out infinite; }

    @keyframes pulse-slow { 0%, 100% { opacity: .3; } 50% { opacity: .6; } }
    @keyframes pulse-slow2 { 0%, 100% { opacity: .25; } 50% { opacity: .55; } }
    .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
    .animate-pulse-slow2 { animation: pulse-slow2 9s ease-in-out infinite; }

    @keyframes fade-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fade-up .8s ease-out forwards; }
    .delay-150 { animation-delay: .15s; }
    .delay-300 { animation-delay: .3s; }
`}</style>

export default Hero;
