import web3EduLogo from "../assets/web3edu_logo.png";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";
import { useState, useEffect } from "react";

const FooterGr = ({ content }) => {
    const safe = content ?? {};
    const [gradientClass, setGradientClass] = useState("from-slate-100 via-white to-slate-200");
    const year = new Date().getFullYear();

    useEffect(() => {
        const onScroll = () => {
            const depth = window.scrollY;
            if (depth > 400) {
                setGradientClass("from-slate-200 via-slate-300 to-slate-400 dark:from-[#0d1320] dark:via-[#10182a] dark:to-[#0a0f1a]");
            } else {
                setGradientClass("from-slate-100 via-white to-slate-200 dark:from-[#0f1523] dark:via-[#121a2c] dark:to-[#0c111b]");
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <footer
            className={`relative mt-32 rounded-3xl px-8 py-14 text-xs
               shadow-2xl backdrop-blur-2xl border
               bg-gradient-to-br from-[#0B0F17] via-[#111626] to-[#0D1220] dark:from-[#05070D] dark:via-[#090D16] dark:to-[#0A0F1A]
               text-white dark:text-white border-slate-300/40 dark:border-white/10
               overflow-hidden`}
        >

            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(138,87,255,0.12),transparent)] animate-holo-shimmer"></div>

            {/* Neon Vertical Spine */}
            <div className="absolute left-0 top-0 h-full w-[4px]
                    bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                    opacity-90 blur-sm"></div>

            {/* Hologram Grid */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none
                    bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_60%)] 
                    dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_70%)]"></div>

            {/* Floating particle glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-400/20
                         rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute right-10 bottom-10 w-32 h-32 bg-gradient-to-br 
                         from-fuchsia-400/20 to-purple-500/20
                         rounded-full blur-3xl animate-pulse-slow delay-500"></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Left: Logo + Info */}
                <div className="flex items-center gap-5">
                    <img
                        src={web3EduLogo}
                        className="h-12 w-auto drop-shadow-[0_0_15px_rgba(138,87,255,0.55)] hover:scale-105 transition-transform duration-500"
                        alt="Web3Edu Logo"
                    />
                    <div>
                        <div className="font-semibold text-white tracking-wide text-sm">
                            Web3Edu
                        </div>
                        <div className="text-white/80 text-[11px]">
                            Blockchain Education Ecosystem
                        </div>

                        {/* Powered by Badge */}
                        <div className="mt-2 inline-flex px-3 py-1 rounded-full text-[10px] 
                                bg-[#8A57FF]/15 border border-[#8A57FF]/30 text-[#8A57FF] 
                                dark:bg-[#8A57FF]/15 dark:text-[#8A57FF] dark:border-[#8A57FF]/30
                                backdrop-blur-md shadow-sm">
                            Powered by BesuEduNet
                        </div>
                    </div>
                </div>

                {/* Middle Nav */}
                <nav className="flex gap-6 text-white dark:text-white/80 text-[11px] tracking-wide">
                    <a href="/#/" className="hover:text-[#4ACBFF] dark:hover:text-[#8A57FF] transition">Home</a>
                    <a href="/#/team" className="hover:text-[#4ACBFF] dark:hover:text-[#8A57FF] transition">Team</a>
                    <a href="/#applications" className="hover:text-[#4ACBFF] dark:hover:text-[#8A57FF] transition">Applications</a>
                    <a href="/#dao" className="hover:text-[#4ACBFF] dark:hover:text-[#8A57FF] transition">DAO</a>
                </nav>

                {/* Right: Social Icons */}
                <div className="flex gap-6 text-lg">
                    <a
                        href="https://github.com/DimiKog"
                        target="_blank"
                        className="relative hover:scale-110 transition-transform group"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8A57FF]/20 to-[#4ACBFF]/20 blur-xl opacity-0
                                group-hover:opacity-100 transition"></div>
                        <FaGithub className="relative" />
                    </a>

                    <a
                        href="#"
                        target="_blank"
                        className="relative opacity-60 cursor-not-allowed"
                    >
                        <FaDiscord className="relative" />
                    </a>

                    <a
                        href="#"
                        target="_blank"
                        className="relative opacity-60 cursor-not-allowed"
                    >
                        <FaLinkedin className="relative" />
                    </a>
                </div>
            </div>

            {/* Micro-CTA */}
            <div className="mt-6 text-center text-[10px] text-white/80 dark:text-white/70 tracking-wide">
                Explore: Proof of Escape · Education Portal · Learning Path · DAO
            </div>

            {/* Bottom line */}
            <div
                className="mt-10 pt-6 border-t border-slate-300/40 dark:border-white/10 
                   text-center text-[10px] text-white/70 dark:text-white/70"
            >
                © {year} Web3Edu — All Rights Reserved.
            </div>

            {/* Back to top button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-[#8A57FF] to-[#4ACBFF] text-white shadow-xl hover:scale-125 transition-transform"
            >
                ↑
            </button>

            <style>{`
                @keyframes holo-shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
                .animate-holo-shimmer{ background-size:200% 100%; animation:holo-shimmer 4s linear infinite; }
            `}</style>
        </footer>
    );
};

export default FooterGr;
