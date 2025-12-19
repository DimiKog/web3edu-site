// PAGE SHELL — LANGUAGE STATE AS SOURCE OF TRUTH (OPTION A)

import React from "react";
import Footer from "./Footer.jsx";
import FooterGr from "./FooterGR.jsx";
import web3EduLogoLight from "../assets/web3edu_logo_light.webp";
import web3EduLogoDark from "../assets/web3edu_logo.webp";
import web3EduLogoLightPng from "../assets/web3edu_logo_light.png";
import web3EduLogoDarkPng from "../assets/web3edu_logo.png";
import web3EduLogoLightSvg from "../assets/web3edu_logo_light.svg";
import web3EduLogoDarkSvg from "../assets/web3edu_logo.svg";
import { ACCENT_PRIMARY } from "../design/theme.js";
import { useAccount } from "wagmi";
import { useDisconnect } from "wagmi";
import { AddressIdenticon, generateAvatarStyle, shortAddress } from "./identity-ui.jsx";

const getLangFromHash = (hash) => {
  if (!hash) return null;
  if (hash.includes("-gr") || hash.startsWith("#/gr")) return "gr";
  return null;
};

export default function PageShell({
  accentColor = ACCENT_PRIMARY,
  innerClassName = "",
  children,
}) {
  const [isShrunk, setIsShrunk] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showJoin, setShowJoin] = React.useState(false);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [currentHash, setCurrentHash] = React.useState(
    typeof window !== "undefined" ? window.location.hash || "#/" : "#/"
  );

  // THE ONLY source of truth for language — prefer URL hint, then stored value
  const [lang, setLang] = React.useState(() => {
    if (typeof window !== "undefined") {
      const langFromHash = getLangFromHash(window.location.hash || "");
      if (langFromHash) return langFromHash;
      const stored = localStorage.getItem("lang");
      if (stored) return stored;
    }
    return "en";
  });

  const isGR = lang === "gr";

  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      setCurrentHash(hash);
      const langFromHash = getLangFromHash(hash);
      setLang(langFromHash ? "gr" : "en");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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

  const inDashboard = currentHash.startsWith("#/dashboard");
  const inSbtView = currentHash.startsWith("#/sbt-view");
  const inVerify = currentHash.startsWith("#/verify");
  const inWelcomeIdentity = currentHash.startsWith("#/welcome-identity");

  const showIdentityAvatar = Boolean(isConnected && address);
  const shortAddr = address ? shortAddress(address) : "";
  const savedTier = localStorage.getItem("web3edu-tier") || "Explorer";

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setMobileOpen(false);
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
            <picture>
              <source srcSet={isDark ? web3EduLogoDark : web3EduLogoLight} type="image/webp" />
              <source srcSet={isDark ? web3EduLogoDarkSvg : web3EduLogoLightSvg} type="image/svg+xml" />
              <img
                src={isDark ? web3EduLogoDarkPng : web3EduLogoLightPng}
                alt="Web3Edu"
                className="h-10 w-auto drop-shadow-[0_0_12px_rgba(120,60,255,0.45)]
                  transition-opacity duration-500
                  group-hover:scale-110 group-hover:rotate-1"
              />
            </picture>
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
                <a
                  href="/#/start-here-gr"
                  className="relative font-medium 
    text-white dark:text-blue-200
    hover:text-blue-300 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Ξεκίνα εδώ
                </a>
                <a
                  href="/#/labs-gr"
                  className="relative font-medium 
    text-white dark:text-blue-200
    hover:text-blue-300 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Εργαστήρια
                </a>
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
                <a
                  href="/#/start-here"
                  className="relative font-medium 
    text-white dark:text-blue-200
    hover:text-blue-300 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Start Here
                </a>
                <a
                  href="/#/labs"
                  className="relative font-medium 
    text-white dark:text-blue-200
    hover:text-blue-300 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Labs
                </a>
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

            {/* Identity avatar OR Join button */}
            {showIdentityAvatar ? (
              <>
                <button
                  onClick={() => {
                    window.location.hash = isGR ? "#/dashboard-gr" : "#/dashboard";
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-slate-900/80 dark:bg-slate-900/80
                    text-slate-100 border border-white/20 shadow-lg
                    hover:bg-slate-800/90 transition-colors"
                >
                  <div
                    className={
                      "w-7 h-7 rounded-full flex items-center justify-center shadow-md " +
                      (
                        savedTier === "Architect"
                          ? "ring-2 ring-yellow-400/80"
                          : savedTier === "Builder"
                            ? "ring-2 ring-blue-400/80"
                            : "ring-2 ring-purple-400/80"
                      )
                    }
                    style={generateAvatarStyle(address, savedTier)}
                  >
                    <AddressIdenticon address={address} />
                  </div>
                  <span className="text-[11px] font-mono tracking-wide hidden sm:inline">
                    {shortAddr}
                  </span>
                </button>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold
                    bg-gradient-to-r from-red-500/25 via-rose-500/25 to-pink-500/25
                    text-white border border-white/20 shadow-lg shadow-pink-500/15
                    hover:from-red-500/35 hover:to-pink-500/35 hover:shadow-pink-500/25
                    transition-colors transition-shadow"
                >
                  {isGR ? "Αποσύνδεση" : "Disconnect"}
                </button>
              </>
            ) : (
              !currentHash.startsWith("#/join") && !currentHash.startsWith("#/join-gr") && (
                <button
                  onClick={() => {
                    window.location.hash = isGR ? "#/join-gr" : "#/join";
                  }}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/40 to-blue-500/40
                 hover:from-pink-500/60 hover:to-blue-500/60
                 text-white shadow-lg shadow-indigo-500/20 border border-white/10"
                >
                  {isGR ? "Σύνδεση" : "Join"}
                </button>
              )
            )}

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
          <div className="fixed inset-0 md:hidden z-40 px-4 pt-24 pb-8 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xl">
            <div className="h-full w-full overflow-y-auto rounded-2xl border border-white/10 bg-white/80 dark:bg-slate-900/85 shadow-2xl shadow-indigo-500/10 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {isGR ? (
                  <>
                    <button
                      onClick={() => navigateTo("#/gr")}
                      className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20"
                    >
                      Αρχική
                    </button>
                    <button
                      onClick={() => navigateTo("#/start-here-gr")}
                      className="w-full rounded-xl border border-slate-300/40 
    dark:border-slate-700/60 bg-white/70 
    dark:bg-slate-800/80 py-3 text-sm font-semibold 
    text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Ξεκίνα εδώ
                    </button>
                    <button
                      onClick={() => navigateTo("#/labs-gr")}
                      className="w-full rounded-xl border border-slate-300/40 
    dark:border-slate-700/60 bg-white/70 
    dark:bg-slate-800/80 py-3 text-sm font-semibold 
    text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Εργαστήρια
                    </button>
                    <button
                      onClick={() => navigateTo("#/team-gr")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Ομάδα
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigateTo("#/")}
                      className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => navigateTo("#/start-here")}
                      className="w-full rounded-xl border border-slate-300/40 
    dark:border-slate-700/60 bg-white/70 
    dark:bg-slate-800/80 py-3 text-sm font-semibold 
    text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Start Here
                    </button>
                    <button
                      onClick={() => navigateTo("#/labs")}
                      className="w-full rounded-xl border border-slate-300/40 
    dark:border-slate-700/60 bg-white/70 
    dark:bg-slate-800/80 py-3 text-sm font-semibold 
    text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Labs
                    </button>
                    <button
                      onClick={() => navigateTo("#/team")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Team
                    </button>
                  </>
                )}
              </div>

              {showIdentityAvatar ? (
                <div className="space-y-2">
                  <button
                    onClick={() => navigateTo(isGR ? "#/dashboard-gr" : "#/dashboard")}
                    className="w-full flex items-center justify-between gap-3 rounded-xl bg-slate-900 text-white py-3 px-4 text-sm font-semibold shadow-lg shadow-indigo-500/20"
                  >
                    <div
                      className={
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-md " +
                        (
                          savedTier === "Architect"
                            ? "ring-2 ring-yellow-400/80"
                            : savedTier === "Builder"
                              ? "ring-2 ring-blue-400/80"
                              : "ring-2 ring-purple-400/80"
                        )
                      }
                      style={generateAvatarStyle(address, savedTier)}
                    >
                      <AddressIdenticon address={address} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs text-white/70">{isGR ? "Ταυτότητα" : "Identity"}</p>
                      <p className="font-mono text-sm">{shortAddr}</p>
                    </div>
                    <span className="text-[10px] rounded-full bg-white/15 px-3 py-1">
                      {savedTier}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      disconnect();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl border border-red-400/40 bg-red-500/15 py-3 text-sm font-semibold text-red-100 hover:bg-red-500/25 transition"
                  >
                    {isGR ? "Αποσύνδεση" : "Disconnect"}
                  </button>
                </div>
              ) : (
                !currentHash.startsWith("#/join") && !currentHash.startsWith("#/join-gr") && (
                  <button
                    onClick={() => navigateTo(isGR ? "#/join-gr" : "#/join")}
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500/60 to-blue-500/60 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:from-pink-500/70 hover:to-blue-500/70 transition"
                  >
                    {isGR ? "Σύνδεση" : "Join"}
                  </button>
                )
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-xl border border-white/20 bg-white/80 dark:bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-800 dark:text-white"
                >
                  {isGR ? "EN" : "GR"}
                </button>
                <button
                  onClick={() => {
                    setIsDark((prev) => !prev);
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-xl border border-white/20 bg-slate-900 text-white py-2.5 text-sm font-semibold"
                >
                  {isDark ? "🌞" : "🌙"}
                </button>
              </div>
            </div>
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

      {/* GLOBAL FOOTER */}
      <div className="w-full">
        {isGR ? <FooterGr /> : <Footer />}
      </div>
    </main>
  );
}
