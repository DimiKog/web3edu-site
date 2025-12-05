// src/components/TeamMemberCard.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export default function TeamMemberCard({
    name,
    role,
    avatar,
    badges = [],
    socials = {},
    bio = "",
    quote = "",
    mode = "horizontal",
    className = "",
    style = {}
}) {
    const isHorizontal = mode === "horizontal";

    const themeMap = {
        "*": "from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 dark:from-[#8A57FF]/20 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20"
    };

    const bulletColorMap = {
        "*": "bg-[#8A57FF] text-[#8A57FF] dark:text-[#4ACBFF]"
    };

    const theme = themeMap["*"];

    return (
        <div
            className={`
                group rounded-3xl p-[2px] 
                bg-gradient-to-br ${theme} 
                shadow-xl transition-all duration-500 w-full mx-auto ${className}
                hover:shadow-[0_0_55px_rgba(138,87,255,0.55)]
                hover:-translate-y-1
                hover:scale-[1.01]
            `}
            style={style}
        >
            <div
                className={`
                  flex flex-col gap-8 md:flex-row md:items-center md:gap-10
                  p-6 sm:p-8 pb-12 sm:pb-16 md:pb-20 rounded-3xl bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl 
                  border border-white/40 shadow-xl w-full h-full md:min-h-[420px]
                  transition-all duration-300
                  group-hover:shadow-[0_0_45px_rgba(138,87,255,0.35)]
               `}
            >

                <div className={`${isHorizontal ? "flex flex-col items-center w-full md:w-auto" : "flex flex-col items-center w-full"}`}>
                    <img
                        src={avatar}
                        alt={name}
                        className={`
                            h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64
                            rounded-3xl object-cover 
                            shadow-[0_0_35px_rgba(138,87,255,0.45)] 
                            ring-4 ring-[#8A57FF]/40 dark:ring-[#8A57FF]/60
                            animate-avatarGlow
                        `}
                    />

                    {/* Socials Under Avatar */}
                    <div className={`flex gap-4 mt-3 justify-center ${isHorizontal ? "" : "mb-2"}`}>
                        <a
                            href={socials.github || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className={`${socials.github
                                ? "text-slate-700 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF]"
                                : "opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"
                                } transition`}
                        >
                            <FaGithub size={22} />
                        </a>

                        <a
                            href={socials.linkedin || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className={`${socials.linkedin
                                ? "text-slate-700 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF]"
                                : "opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"
                                } transition`}
                        >
                            <FaLinkedin size={22} />
                        </a>

                        <a
                            href={socials.discord || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className={`${socials.discord
                                ? "text-slate-700 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF]"
                                : "opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"
                                } transition`}
                        >
                            <FaDiscord size={22} />
                        </a>
                    </div>

                    {/* Full Role Under Avatar */}
                    <div className="mt-4 text-center text-slate-800 dark:text-slate-200">
                        <p className="font-bold text-lg md:text-xl leading-tight whitespace-pre-line">
                            {role}
                        </p>
                    </div>
                </div>

                {/* Right content */}
                <div
                    className={`
                        w-full flex flex-col items-center text-center mt-4 md:mt-0
                        ${isHorizontal ? "md:flex-1 md:items-start md:text-left md:pl-6" : "md:items-start md:text-left"}
                    `}
                >

                    {/* Name */}
                    <h3
                        className={`
                            font-bold text-slate-800 dark:text-white tracking-tight mb-2
                            ${isHorizontal ? "text-3xl sm:text-4xl md:text-5xl" : "text-3xl sm:text-4xl"}
                        `}
                    >
                        {name}
                    </h3>

                    {/* Badges */}
                    {badges.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mb-3 justify-center ${isHorizontal ? "md:justify-start" : ""}`}>
                            {badges.map((b, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 text-sm md:text-base font-semibold rounded-full bg-[#EDE8FF] text-[#8A57FF] dark:bg-[#1a1630] dark:text-[#C9B8FF] border border-[#8A57FF]/30"
                                >
                                    {b}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Bio */}
                    {bio && (
                        <div className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed w-full max-w-full md:max-w-[600px] space-y-3">
                            {/* Map bio lines and detect bullet points */}
                            {bio.split("\n").map((line, i) => {
                                const trimmed = line.trim();
                                const isBullet =
                                    trimmed.startsWith("—") ||
                                    trimmed.startsWith("-") ||
                                    trimmed.startsWith("•") ||
                                    trimmed.match(/^(\*\s+)/);
                                if (isBullet) {
                                    return (
                                        <div key={i} className="flex items-start gap-3 text-left w-full">
                                            <div
                                                className={`
                                                    mt-1 h-2 w-2 rounded-full 
                                                    ${bulletColorMap["*"].split(" ")[0]}
                                                    animate-bulletShine
                                                `}
                                            ></div>
                                            <p
                                                className={`
                                                    leading-snug font-medium
                                                    ${bulletColorMap["*"].replace(/^bg-[^\s]+ /, "")}
                                                `}
                                            >
                                                {trimmed.replace(/^[-—•*]\s*/, "")}
                                            </p>
                                        </div>
                                    );
                                }
                                return (
                                    <p key={i} className="leading-relaxed">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    )}

                    {/* Quote */}
                    {quote && isHorizontal && (
                        <p className="mt-4 italic text-lg text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-[#8A57FF]/40 dark:border-[#8A57FF]/60 pl-4 max-w-[680px]">
                            “{quote}”
                        </p>
                    )}

                </div>
            </div>
            <div className="w-full h-[4px] mt-4 rounded-full neon-separator"></div>
            <style>
                {`
            @keyframes avatarGlow {
                0% { box-shadow: 0 0 25px rgba(138,87,255,0.35); }
                50% { box-shadow: 0 0 55px rgba(138,87,255,0.55); }
                100% { box-shadow: 0 0 25px rgba(138,87,255,0.35); }
            }
            .animate-avatarGlow {
                animation: avatarGlow 3.5s ease-in-out infinite;
            }
            @keyframes neonPulse {
                0% { opacity: 0.4; filter: blur(2px); }
                50% { opacity: 1; filter: blur(4px); }
                100% { opacity: 0.4; filter: blur(2px); }
            }
            .neon-separator {
                background: linear-gradient(90deg, rgba(138,87,255,1), rgba(74,203,255,1), rgba(255,103,210,1));
                animation: neonPulse 2.6s ease-in-out infinite;
            }
            @keyframes bulletShine {
              0% { transform: scale(1); filter: drop-shadow(0 0 2px currentColor); }
              50% { transform: scale(1.25); filter: drop-shadow(0 0 6px currentColor); }
              100% { transform: scale(1); filter: drop-shadow(0 0 2px currentColor); }
            }
            .animate-bulletShine {
              animation: bulletShine 2.4s ease-in-out infinite;
            }
            `}
            </style>
        </div>
    );
}
