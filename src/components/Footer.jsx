import web3EduLogoLightSvg from "../assets/web3edu_logo_light.svg";
import web3EduLogoDarkSvg from "../assets/web3edu_logo.svg";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";
import { useState, useEffect } from "react";

const Footer = ({ content }) => {
    const safe = content ?? {};
    const year = new Date().getFullYear();
    const nav = safe.nav ?? {};
    const [isDark, setIsDark] = useState(
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
    );
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <footer
            className={`relative mt-32 rounded-3xl px-8 py-14 text-xs
               shadow-xl backdrop-blur-xl border
               bg-gradient-to-br from-[#F6F1FF] via-white to-[#EAF8FF]
               dark:bg-gradient-to-br dark:from-[#0B0F17] dark:via-[#111626] dark:to-[#0D1220]
               border-slate-300/50 dark:border-white/10
               text-slate-700 dark:text-white
               overflow-hidden
               bg-gradient-to-t from-slate-50/40 to-transparent dark:from-[#0B0F17]/40`}
        >

            <div className="absolute inset-0 opacity-[0.04] pointer-events-none
                    bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.10),transparent_70%)]
                    dark:bg-[linear-gradient(120deg,transparent,rgba(138,87,255,0.12),transparent)] dark:animate-holo-shimmer">
            </div>

            {/* Neon Vertical Spine */}
            <div className="absolute left-0 top-0 h-full w-[4px]
                    hidden dark:block
                    bg-gradient-to-b from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                    opacity-90 blur-sm"></div>

            {/* Hologram Grid */}
            <div className="absolute inset-0 pointer-events-none
                    opacity-[0.03] bg-[radial-gradient(circle_at_top_left,rgba(138,87,255,0.05),transparent_70%)]
                    dark:opacity-[0.06] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_70%)]"></div>

            {/* Floating particle glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
                <div className="absolute w-40 h-40 bg-gradient-to-br from-[#FF67D2]/20 to-[#8A57FF]/20
                         rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute right-10 bottom-10 w-32 h-32 bg-gradient-to-br 
                         from-[#8A57FF]/20 to-[#4ACBFF]/20
                         rounded-full blur-3xl animate-pulse-slow delay-500"></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Left: Logo + Info */}
                <div className="flex flex-col items-center text-center gap-3">
                    <picture>
                        <source srcSet={isDark ? web3EduLogoDarkSvg : web3EduLogoLightSvg} type="image/svg+xml" />
                        <img
                            src={isDark ? web3EduLogoDarkSvg : web3EduLogoLightSvg}
                            className="h-12 w-auto drop-shadow-[0_0_15px_rgba(138,87,255,0.35)] hover:scale-105 transition-transform duration-500"
                            alt="Web3Edu Logo"
                        />
                    </picture>
                    <div className="text-center">
                        <div className="font-semibold text-slate-700 dark:text-white tracking-wide text-sm">
                            Web3Edu
                        </div>
                        <div className="text-[#4ACBFF] dark:text-white/80 text-[11px]">
                            Identification Layer for Web3 Education
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
                <nav className="flex gap-6 text-slate-600 dark:text-white/80 text-[11px] tracking-wide">
                    <a href="/#/" className="hover:text-[#8A57FF] dark:hover:text-[#8A57FF] transition">{nav.home ?? "Home"}</a>
                    <a href="/#/team" className="hover:text-[#8A57FF] dark:hover:text-[#8A57FF] transition">{nav.team ?? "Team"}</a>
                    <a href="/#/start-here" className="hover:text-[#8A57FF] dark:hover:text-[#8A57FF] transition">{nav.startHere ?? "Start Here"}</a>
                    <a href="/#/dao-info" className="hover:text-[#8A57FF] dark:hover:text-[#8A57FF] transition">{nav.dao ?? "DAO Governance"}</a>
                </nav>

                {/* Right: Social Icons */}
                <div className="flex gap-6 text-lg">
                    <a
                        href="https://github.com/DimiKog"
                        target="_blank" rel="noopener noreferrer"
                        className="relative hover:scale-110 transition-transform group"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8A57FF]/20 to-[#4ACBFF]/20 blur-xl opacity-0
                                group-hover:opacity-100 transition"></div>
                        <FaGithub className="relative" />
                    </a>

                    <a
                        href="#"
                        target="_blank" rel="noopener noreferrer"
                        className="relative opacity-60 cursor-not-allowed"
                        title="Community Discord (Coming Soon)"
                    >
                        <FaDiscord className="relative" />
                    </a>

                    <a
                        href="#"
                        target="_blank" rel="noopener noreferrer"
                        className="relative opacity-60 cursor-not-allowed"
                        title="LinkedIn Page (Coming Soon)"
                    >
                        <FaLinkedin className="relative" />
                    </a>
                </div>
            </div>

            {/* Micro-CTA */}
            <div className="mt-6 text-center text-[10px] text-[#8A57FF] dark:text-white/70 tracking-wide">
                Explore: Learning Path · Proof of Escape · DAO Governance
            </div>

            <div className="w-20 h-[2px] bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20 mx-auto mb-4"></div>

            {/* Bottom line */}
            <div
                className="mt-10 pt-6 border-t border-slate-300/50 dark:border-white/10 
                   text-center text-[10px] text-[#4ACBFF] dark:text-white/70"
            >
                © {year} Web3Edu — All Rights Reserved.
            </div>

            {/* Back to top button */}
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-[#8A57FF] to-[#4ACBFF] text-white shadow-xl hover:scale-[1.015] transition-transform"
                >
                    ↑
                </button>
            )}

            <style>{`
                @keyframes holo-shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
                .animate-holo-shimmer{ background-size:200% 100%; animation:holo-shimmer 3s linear infinite; }
            `}</style>
        </footer>
    );
};

export default Footer;
