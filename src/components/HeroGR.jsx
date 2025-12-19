import { useState, useEffect } from "react";
import web3EduLogoLightWebp from "../assets/web3edu_logo_light.webp";
import web3EduLogoDarkWebp from "../assets/web3edu_logo.webp";
import web3EduLogoLightSvg from "../assets/web3edu_logo_light.svg";
import web3EduLogoDarkSvg from "../assets/web3edu_logo.svg";
import web3EduLogoLightPng from "../assets/web3edu_logo_light.png";
import web3EduLogoDarkPng from "../assets/web3edu_logo.png";
import { useNavigate } from "react-router-dom";

const HeroGR = ({ content }) => {
    const navigate = useNavigate();

    const [isDark, setIsDark] = useState(
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const h = () => {
            document.documentElement.style.setProperty("--scrollPos", window.scrollY);
        };
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    return (
        <header className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-[#090C14] via-[#120A1E] via-[#7F3DF1]/25 to-[#081018] overflow-hidden rounded-b-[80px] lg:rounded-b-[120px] relative z-10">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] bg-[#4ACBFF]/18 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#FF67D2]/20 blur-[160px] rounded-full"></div>
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-55 [transform:translateY(calc(var(--scrollPos)*0.15))] transition-transform duration-75">
                <div className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#FF67D2]/10 blur-3xl animate-pulse-slow top-10 left-10"></div>
                <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-[#4ACBFF]/20 blur-2xl animate-pulse-slow2 bottom-10 right-20"></div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16">

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-8 bg-white/5 rounded-3xl shadow-xl backdrop-blur-xl border border-white/10 hover:shadow-cyan-500/20 transition duration-300 [perspective:1000px] relative">
                        <div className="transition-transform duration-500 sm:hover:[transform:rotateX(6deg)_rotateY(-6deg)_scale(1.05)]">
                            <picture>
                                <source srcSet={isDark ? web3EduLogoDarkWebp : web3EduLogoLightWebp} type="image/webp" />
                                <source srcSet={isDark ? web3EduLogoDarkSvg : web3EduLogoLightSvg} type="image/svg+xml" />
                                <img
                                    src={isDark ? web3EduLogoDarkPng : web3EduLogoLightPng}
                                    alt="Web3Edu logo"
                                    className="h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 xl:h-64 xl:w-64 rounded-2xl object-contain drop-shadow-[0_0_30px_rgba(74,203,255,0.55)] transition-opacity duration-500"
                                />
                            </picture>
                        </div>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF67D2]/22 via-[#8A57FF]/26 to-[#4ACBFF]/22 blur-2xl opacity-40 pointer-events-none"></div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold bg-gradient-to-r from-[#FF67D2]/20 via-[#8A57FF]/20 to-[#4ACBFF]/20 text-white border border-white/20 shadow-md tracking-wide backdrop-blur-md">
                        {content.tagline}
                    </div>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-xl relative">
                    <div className="absolute -z-10 -top-10 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4ACBFF]/10 to-[#8A57FF]/10 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>

                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(74,203,255,.28)] animate-fade-up">
                        👋 {content.welcome}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed max-w-lg animate-fade-up delay-150">
                        {content.desc}
                    </p>

                    <button
                        onClick={() => navigate("/start-here-gr")}
                        className="inline-flex items-center gap-2 px-8 py-3 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#FF4FCC] via-[#8A57FF] to-[#36BEEB] hover:from-[#FF4FCC] hover:via-[#7A3FEF] hover:to-[#36BEEB] text-white font-semibold shadow-xl shadow-[0_0_40px_rgba(138,87,255,0.40)] transition duration-300 animate-fade-up delay-300"
                    >
                        🚀 Ξεκίνα τη Μάθηση
                    </button>
                </div>

            </div>
        </header>
    );
};

export default HeroGR;

<style jsx>{`
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