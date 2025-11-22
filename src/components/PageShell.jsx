// PAGE SHELL — LANGUAGE STATE AS SOURCE OF TRUTH (OPTION A)

import React from "react";
import web3EduLogo from "../assets/web3edu_logo.svg";
import { ACCENT_PRIMARY } from "../design/theme.js";

export default function PageShell({
  accentColor = ACCENT_PRIMARY,
  innerClassName = "",
  children,
}) {
  const [isShrunk, setIsShrunk] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showJoin, setShowJoin] = React.useState(false);

  // THE ONLY source of truth for language
  const [lang, setLang] = React.useState(
    localStorage.getItem("lang") || "en"
  );

  const isGR = lang === "gr";

  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Stable theme toggle
  const [isDark, setIsDark] = React.useState(
    localStorage.getItem("theme") === "dark"
  );

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Navbar shrink effect
  React.useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle language toggle
  const toggleLanguage = () => {
    const newLang = lang === "gr" ? "en" : "gr";
    setLang(newLang);

    const current = window.location.hash;

    if (newLang === "gr") {
      if (current.startsWith("#/team")) {
        window.location.hash = "#/team-gr";
      } else if (current.startsWith("#/join")) {
        window.location.hash = "#/join-gr";
      } else if (current.startsWith("#/mint-identity")) {
        window.location.hash = "#/mint-identity-gr";
      } else {
        window.location.hash = "#/gr";
      }
    } else {
      if (current.startsWith("#/team-gr")) {
        window.location.hash = "#/team";
      } else if (current.startsWith("#/join-gr")) {
        window.location.hash = "#/join";
      } else if (current.startsWith("#/mint-identity-gr")) {
        window.location.hash = "#/mint-identity";
      } else {
        window.location.hash = "#/";
      }
    }
  };

  const baseClasses =
    "w-full flex flex-col px-4 sm:px-8 text-slate-900 dark:text-slate-100 transition-colors duration-300";

  return (
    <main
      style={{
        background: isDark
          ? "#0a0f1a"
          : "linear-gradient(180deg, #e7dfff 0%, #f3eaff 50%, #f7faff 100%)"
      }}
      className="w-full min-h-screen transition-colors duration-500 overflow-x-hidden"
    >
      <div className="w-full fixed top-0 left-0 right-0 px-4 sm:px-8 pt-4 z-50">

        {/* NAV */}
        <nav
          className={`relative sticky top-4 z-50 mb-4 flex items-center justify-between
    text-sm px-5 py-3 rounded-2xl
    ${isDark
              ? "bg-[#0b0f17]/80"
              : "bg-gradient-to-r from-[#c7d2fe]/95 via-[#d8c6ff]/95 to-[#eadfff]/95"}
    text-slate-900 dark:text-slate-100
    border border-white/10 shadow-xl backdrop-blur-xl
    transition-all duration-500 group
    ${isShrunk ? "scale-[0.94] py-2 shadow-2xl" : "scale-100"}
  `}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={web3EduLogo}
              alt="Web3Edu"
              className="h-10 w-auto drop-shadow-[0_0_12px_rgba(120,60,255,0.45)]
               transition-transform duration-300
               group-hover:scale-110 group-hover:rotate-1"
            />
          </div>

          {/* Main nav */}
          <div className="hidden md:flex items-center gap-4">
            {isGR ? (
              <>
                <a href="/#/gr" className="relative font-medium 
  text-white dark:text-blue-200
  hover:text-blue-300 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Αρχική</a>
                <a href="/#/team-gr" className="relative font-medium 
  text-white dark:text-blue-200
  hover:text-blue-300 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Ομάδα</a>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Μαθήματα Σύντομα
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Workshops Σύντομα
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Εργαλεία Σύντομα
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Κοινότητα Σύντομα
                </span>
              </>
            ) : (
              <>
                <a href="/#/" className="relative font-medium 
  text-white dark:text-blue-200
  hover:text-blue-300 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Home</a>
                <a href="/#/team" className="relative font-medium 
  text-white dark:text-blue-200
  hover:text-blue-300 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Team</a>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Courses Soon
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Workshops Soon
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Tools Soon
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded-full 
    border border-indigo-300/30 dark:border-indigo-300/40
    bg-indigo-500/10 dark:bg-indigo-500/20
    text-indigo-600 dark:text-indigo-200">
                  Community Soon
                </span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">

            {/* Join button */}
            <button
              onClick={() => (window.location.hash = "#/join-gr")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/40 to-blue-500/40
             hover:from-pink-500/60 hover:to-blue-500/60
             text-white shadow-lg shadow-indigo-500/20 border border-white/10"
            >
              {isGR ? "Σύνδεση" : "Join"}
            </button>

            {/* Theme toggle (moved outside language toggle group) */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md"
            >
              {isDark ? "🌞" : "🌙"}
            </button>

            {/* Language toggle (clean, separate, no interaction with theme) */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md"
            >
              {isGR ? "EN" : "GR"}
            </button>
          </div>

          {/* Mobile */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
          {/* Decorative line under navbar */}
          <div className="absolute left-0 right-0 -bottom-1 h-[3px]
            bg-gradient-to-r from-[#7b3df8] via-[#9c4dff] to-[#00d4ff]
            opacity-80 blur-[1px] pointer-events-none"></div>
        </nav>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden p-4 bg-white/30 dark:bg-slate-800/60 rounded-xl mt-1">
            {isGR ? (
              <>
                <a href="/#/gr" className="block py-1 font-medium 
text-slate-700 dark:text-blue-200
hover:text-blue-500 dark:hover:text-white">Αρχική</a>
                <a href="/#/team-gr" className="block py-1 font-medium 
text-slate-700 dark:text-blue-200
hover:text-blue-500 dark:hover:text-white">Ομάδα</a>
                <a
                  href="/#/join-gr"
                  className="block mt-2 py-2 px-4 rounded-full 
                  bg-gradient-to-r from-pink-500/40 to-blue-500/40
                  text-white font-semibold text-center
                  shadow-lg shadow-indigo-500/20 border border-white/10
                  hover:from-pink-500/60 hover:to-blue-500/60 transition"
                >
                  Σύνδεση
                </a>
              </>
            ) : (
              <>
                <a href="/#/" className="block py-1 font-medium 
text-slate-700 dark:text-blue-200
hover:text-blue-500 dark:hover:text-white">Home</a>
                <a href="/#/team" className="block py-1 font-medium 
text-slate-700 dark:text-blue-200
hover:text-blue-500 dark:hover:text-white">Team</a>
                <a
                  href="/#/join"
                  className="block mt-2 py-2 px-4 rounded-full 
                  bg-gradient-to-r from-pink-500/40 to-blue-500/40
                  text-white font-semibold text-center
                  shadow-lg shadow-indigo-500/20 border border-white/10
                  hover:from-pink-500/60 hover:to-blue-500/60 transition"
                >
                  Join
                </a>
              </>
            )}

            <button
              className="mt-2 block"
              onClick={() => {
                toggleLanguage();
              }}
            >
              {isGR ? "EN" : "GR"}
            </button>

            <button
              className="mt-2 block"
              onClick={() => {
                setIsDark((prev) => !prev);
                setMobileOpen(false);
              }}
            >
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        )}
      </div>

      {/* HERO — full width, within PageShell background */}
      <section className="w-full mt-12">
        {Array.isArray(children) ? children[0] : children}
      </section>

      {/* ALL OTHER SECTIONS — padded container */}
      {Array.isArray(children) ? (
        <div className={`relative w-full flex flex-col overflow-visible ${innerClassName}`.trim()}>
          {children.slice(1)}
        </div>
      ) : null}
    </main>
  );
}
