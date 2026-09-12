/**
 * Pure-public shell: navigation + OIDC session chrome without Web3 libs.
 * Must NOT statically import wagmi, viem, ethers, RainbowKit, or ResolvedIdentity.
 */
import React from "react";
import Footer from "./Footer.jsx";
import FooterGr from "./FooterGR.jsx";
import web3EduLogoLight from "../assets/web3edu_logo_light.webp";
import web3EduLogoDark from "../assets/web3edu_logo_dark.webp";
import { useAuth } from "react-oidc-context";
import { signOutKeycloakAccount } from "../auth/keycloakSignOut.js";
import { saveReturnUrl } from "../auth/oidcConfig.js";

const navAuthSecondaryClass =
  "px-3 py-1.5 rounded-full border border-[#8A57FF]/35 bg-[#EDE8FF]/95 text-[#5B2DC8] shadow-sm backdrop-blur " +
  "cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#E2D8FF] hover:border-[#8A57FF]/50 " +
  "dark:border-indigo-400/35 dark:bg-indigo-950/80 dark:text-indigo-100 dark:shadow-lg dark:shadow-indigo-900/20 " +
  "dark:hover:bg-indigo-900/85 dark:hover:border-indigo-300/45";

const navAuthPrimaryClass =
  "px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-md shadow-[#8A57FF]/25 " +
  "bg-gradient-to-r from-[#9333ea] via-[#6366f1] to-[#0891b2] ring-1 ring-white/35 " +
  "cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/35 " +
  "dark:from-violet-600 dark:via-indigo-600 dark:to-cyan-600 dark:ring-white/20";

const navLinkClass =
  "relative font-medium text-slate-800 dark:text-slate-100 hover:text-indigo-700 dark:hover:text-white " +
  "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-gradient-to-r " +
  "after:from-[#7b3df8] after:to-[#00d4ff] after:transition-transform hover:after:scale-x-100";

const getLangFromHash = (hash) => {
  if (!hash) return null;
  if (hash.includes("-gr") || hash.startsWith("#/gr")) return "gr";
  return null;
};

const buildHash = (firstSegment, rest) => {
  const suffix = rest ? `/${rest}` : "";
  return `#/${firstSegment}${suffix}`;
};

const translateHashForLang = (hash, targetLang) => {
  const cleaned = (hash || "#/").replace(/^#\//, "");
  const [rawRoot, ...restParts] = cleaned.split("/");
  const root = rawRoot || "";
  const rest = restParts.join("/");

  if (targetLang === "gr") {
    if (!root || root === "gr") return "#/gr";
    if (root === "education" && rest === "network-check")
      return "#/education/network-check-gr";
    if (root === "education") return "#/education-gr";
    if (root === "labs") return buildHash("labs-gr", rest);
    if (root === "verify") return buildHash("verify-gr", rest);
    if (root.endsWith("-gr"))
      return `#/${[root, rest].filter(Boolean).join("/")}`;
    return buildHash(`${root}-gr`, rest);
  }

  if (!root || root === "gr") return "#/";
  if (root === "education" && rest === "network-check-gr")
    return "#/education/network-check";
  if (root === "education-gr" && !rest) return "#/education";
  if (root === "labs-gr") return buildHash("labs", rest);
  if (root === "verify-gr") return buildHash("verify", rest);
  if (root.endsWith("-gr")) return buildHash(root.replace(/-gr$/, ""), rest);
  return `#/${[root, rest].filter(Boolean).join("/")}`;
};

export default function PublicPageShell({
  innerClassName = "",
  children,
  footerContent,
}) {
  const auth = useAuth();
  const [isShrunk, setIsShrunk] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentHash, setCurrentHash] = React.useState(
    typeof window !== "undefined" ? window.location.hash || "#/" : "#/"
  );
  const [lang, setLang] = React.useState(() => {
    if (typeof window !== "undefined") {
      const langFromHash = getLangFromHash(window.location.hash || "");
      if (langFromHash) return langFromHash;
      const stored = localStorage.getItem("lang");
      if (stored) return stored;
    }
    return "en";
  });
  const [isDark, setIsDark] = React.useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  const isGR = lang === "gr";
  const isOidcAuthenticated = Boolean(auth?.isAuthenticated);

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

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsShrunk((prev) => {
            const next = window.scrollY > 20;
            return prev !== next ? next : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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

  const toggleLanguage = () => {
    const newLang = lang === "gr" ? "en" : "gr";
    const nextHash = translateHashForLang(window.location.hash, newLang);
    setLang(newLang);
    window.location.hash = nextHash;
  };

  const navigateTo = (hash) => {
    window.location.hash = hash;
    setMobileOpen(false);
  };

  const goToJoin = () => {
    saveReturnUrl();
    navigateTo(isGR ? "#/join-gr" : "#/join");
  };

  const goToJoinForWallet = () => {
    saveReturnUrl();
    navigateTo(isGR ? "#/join-gr" : "#/join");
  };

  const dashboardHash = isGR ? "#/dashboard-gr" : "#/dashboard";
  void currentHash;

  return (
    <main
      style={{
        background: isDark
          ? "#0a0f1a"
          : "linear-gradient(180deg, #e7dfff 0%, #f3eaff 50%, #f7faff 100%)",
      }}
      className="w-full min-h-screen transition-colors duration-500 overflow-x-hidden"
    >
      <div className="w-full fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-8">
        <nav
          className={`relative sticky top-4 z-50 mb-4 flex items-center justify-between
    text-sm px-5 py-3 rounded-2xl
    ${isDark
              ? "bg-[#0b0f17]/80"
              : "bg-gradient-to-r from-[#c7d2fe]/95 via-[#d8c6ff]/95 to-[#eadfff]/95"}
    text-slate-900 dark:text-slate-100
    border border-white/10 shadow-xl backdrop-blur-xl
    transition-all duration-500 group
    ${isShrunk ? "py-2 shadow-2xl" : ""}
  `}
        >
          <div className="flex items-center gap-3">
            <a href={isGR ? "/#/gr" : "/#/"} aria-label={isGR ? "Αρχική" : "Home"}>
              <picture>
                <source srcSet={isDark ? web3EduLogoDark : web3EduLogoLight} type="image/webp" />
                <img
                  src={isDark ? web3EduLogoDark : web3EduLogoLight}
                  alt="Web3Edu"
                  className="h-10 w-auto drop-shadow-[0_0_12px_rgba(120,60,255,0.45)] transition-opacity duration-500"
                  loading="eager"
                  fetchPriority="low"
                />
              </picture>
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {isGR ? (
              <>
                <a href="/#/gr" className={navLinkClass}>Αρχική</a>
                <a href="/#/start-here-gr" className={navLinkClass}>Ξεκίνα εδώ</a>
                <a href="/#/learn-gr" className={navLinkClass}>Μάθηση</a>
                <a href="/#/labs-gr" className={navLinkClass}>Εργαστήρια</a>
                <a href="/#/projects-gr" className={navLinkClass}>Projects</a>
                <a href="/#/dao-info-gr" className={navLinkClass}>Έρευνα Διακυβέρνησης</a>
                <a href="/#/team-gr" className={navLinkClass}>Ομάδα</a>
                {isOidcAuthenticated ? (
                  <a href={`/${dashboardHash}`} className={`${navLinkClass} font-semibold`}>
                    Πίνακας
                  </a>
                ) : null}
              </>
            ) : (
              <>
                <a href="/#/" className={navLinkClass}>Home</a>
                <a href="/#/start-here" className={navLinkClass}>Start Here</a>
                <a href="/#/learn" className={navLinkClass}>Learn</a>
                <a href="/#/labs" className={navLinkClass}>Labs</a>
                <a href="/#/projects" className={navLinkClass}>Projects</a>
                <a href="/#/dao-info" className={navLinkClass}>Governance Research</a>
                <a href="/#/team" className={navLinkClass}>Team</a>
                {isOidcAuthenticated ? (
                  <a href={`/${dashboardHash}`} className={`${navLinkClass} font-semibold`}>
                    Dashboard
                  </a>
                ) : null}
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {!isOidcAuthenticated ? (
              <>
                <button type="button" onClick={goToJoinForWallet} className={navAuthSecondaryClass}>
                  {isGR ? "Σύνδεση wallet" : "Connect wallet"}
                </button>
                <button type="button" onClick={goToJoin} className={navAuthPrimaryClass}>
                  {isGR ? "Web3Edu Identity" : "Web3Edu Identity"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void signOutKeycloakAccount(auth)}
                className={navAuthSecondaryClass}
              >
                {isGR ? "Έξοδος" : "Sign out"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={
                isDark
                  ? isGR
                    ? "Εναλλαγή σε φωτεινό θέμα"
                    : "Switch to light theme"
                  : isGR
                    ? "Εναλλαγή σε σκοτεινό θέμα"
                    : "Switch to dark theme"
              }
              title={isDark ? (isGR ? "Φωτεινό θέμα" : "Light theme") : isGR ? "Σκοτεινό θέμα" : "Dark theme"}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              {isDark ? "🌞" : "🌙"}
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={isGR ? "Switch language to English" : "Αλλαγή γλώσσας στα Ελληνικά"}
              title={isGR ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              {isGR ? "EN" : "GR"}
            </button>
          </div>

          <button
            type="button"
            className="lg:hidden text-xl"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={
              mobileOpen
                ? isGR
                  ? "Κλείσιμο μενού"
                  : "Close menu"
                : isGR
                  ? "Άνοιγμα μενού"
                  : "Open menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-navigation-menu"
          >
            ☰
          </button>
          <div
            className="absolute left-0 right-0 -bottom-1 h-[3px]
            bg-gradient-to-r from-[#7b3df8] via-[#9c4dff] to-[#00d4ff]
            opacity-80 blur-[1px] pointer-events-none"
          />
        </nav>

        {mobileOpen && (
          <div
            id="public-mobile-navigation-menu"
            className="fixed inset-0 lg:hidden z-40 px-4 pt-24 pb-8 bg-slate-950/95 dark:bg-black/95"
          >
            <div className="h-full w-full overflow-y-auto rounded-2xl border border-white/10 bg-white/80 dark:bg-slate-900/85 shadow-2xl shadow-indigo-500/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {isGR ? (
                  <>
                    <button type="button" onClick={() => navigateTo("#/gr")} className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20">
                      Αρχική
                    </button>
                    <button type="button" onClick={() => navigateTo("#/start-here-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Ξεκίνα εδώ
                    </button>
                    <button type="button" onClick={() => navigateTo("#/learn-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Μάθηση
                    </button>
                    <button type="button" onClick={() => navigateTo("#/labs-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Εργαστήρια
                    </button>
                    <button type="button" onClick={() => navigateTo("#/projects-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Projects
                    </button>
                    <button type="button" onClick={() => navigateTo("#/dao-info-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Έρευνα Διακυβέρνησης
                    </button>
                    <button type="button" onClick={() => navigateTo("#/team-gr")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Ομάδα
                    </button>
                    {isOidcAuthenticated ? (
                      <button type="button" onClick={() => navigateTo(dashboardHash)} className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20">
                        Πίνακας
                      </button>
                    ) : null}
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => navigateTo("#/")} className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20">
                      Home
                    </button>
                    <button type="button" onClick={() => navigateTo("#/start-here")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Start Here
                    </button>
                    <button type="button" onClick={() => navigateTo("#/learn")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Learn
                    </button>
                    <button type="button" onClick={() => navigateTo("#/labs")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Labs
                    </button>
                    <button type="button" onClick={() => navigateTo("#/projects")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Projects
                    </button>
                    <button type="button" onClick={() => navigateTo("#/dao-info")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Governance Research
                    </button>
                    <button type="button" onClick={() => navigateTo("#/team")} className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100">
                      Team
                    </button>
                    {isOidcAuthenticated ? (
                      <button type="button" onClick={() => navigateTo(dashboardHash)} className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20">
                        Dashboard
                      </button>
                    ) : null}
                  </>
                )}
              </div>

              {!isOidcAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={goToJoinForWallet}
                    className="w-full rounded-xl border border-[#8A57FF]/35 bg-[#EDE8FF]/95 py-3 text-sm font-semibold text-[#5B2DC8] dark:border-indigo-400/35 dark:bg-indigo-950/80 dark:text-indigo-100"
                  >
                    {isGR ? "Σύνδεση wallet" : "Connect wallet"}
                  </button>
                  <button
                    type="button"
                    onClick={goToJoin}
                    className={`${navAuthPrimaryClass.replace("rounded-full", "rounded-xl").replace("py-1.5", "py-3")} w-full shadow-lg`}
                  >
                    {isGR ? "Web3Edu Identity" : "Web3Edu Identity"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => void signOutKeycloakAccount(auth)}
                  className="w-full rounded-xl border border-white/20 bg-white/80 dark:bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-800 dark:text-white"
                >
                  {isGR ? "Έξοδος" : "Sign out"}
                </button>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleLanguage();
                    setMobileOpen(false);
                  }}
                  aria-label={isGR ? "Switch language to English" : "Αλλαγή γλώσσας στα Ελληνικά"}
                  className="w-full rounded-xl border border-white/20 bg-white/80 dark:bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-800 dark:text-white"
                >
                  {isGR ? "EN" : "GR"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDark((prev) => !prev);
                    setMobileOpen(false);
                  }}
                  aria-label={
                    isDark
                      ? isGR
                        ? "Εναλλαγή σε φωτεινό θέμα"
                        : "Switch to light theme"
                      : isGR
                        ? "Εναλλαγή σε σκοτεινό θέμα"
                        : "Switch to dark theme"
                  }
                  className="w-full rounded-xl border border-white/20 bg-slate-900 text-white py-2.5 text-sm font-semibold"
                >
                  {isDark ? "🌞" : "🌙"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="w-full mt-12">
        {Array.isArray(children) ? children[0] : children}
      </section>

      {Array.isArray(children) ? (
        <div className={`relative w-full flex flex-col overflow-visible ${innerClassName}`.trim()}>
          {children.slice(1)}
        </div>
      ) : null}

      <div className="w-full">
        {isGR ? <FooterGr content={footerContent} /> : <Footer content={footerContent} />}
      </div>
    </main>
  );
}
