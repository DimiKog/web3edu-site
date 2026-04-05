// PAGE SHELL — LANGUAGE STATE AS SOURCE OF TRUTH (OPTION A)

import React from "react";
import Footer from "./Footer.jsx";
import FooterGr from "./FooterGR.jsx";
import web3EduLogoLight from "../assets/web3edu_logo_light.svg";
import web3EduLogoDark from "../assets/web3edu_logo.svg";
import {
  AddressIdenticon,
  generateAvatarStyle,
  shortAddress,
} from "./identity-ui.jsx";
import {
  createBackendError,
  getRoleFromXpTotal,
  getXpTotalFromBackend,
  isUserStateUnavailableError,
} from "../utils/progression.js";

const WALLET_SESSION_KEY = "web3edu-wallet-connected";
const WALLET_ADDRESS_KEY = "web3edu-wallet-address";
const ADMIN_WALLETS = (
  import.meta.env.VITE_ADMIN_WALLETS ??
  "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e"
)
  .split(",")
  .map((address) => address.trim().toLowerCase())
  .filter(Boolean);

const isAdminWallet = (address) =>
  Boolean(address && ADMIN_WALLETS.includes(address.toLowerCase()));

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

  // targetLang === "en"
  if (!root || root === "gr") return "#/";
  if (root === "education" && rest === "network-check-gr")
    return "#/education/network-check";
  if (root === "education-gr" && !rest) return "#/education";
  if (root === "labs-gr") return buildHash("labs", rest);
  if (root === "verify-gr") return buildHash("verify", rest);
  if (root.endsWith("-gr")) return buildHash(root.replace(/-gr$/, ""), rest);
  return `#/${[root, rest].filter(Boolean).join("/")}`;
};

export default function PageShell({
  innerClassName = "",
  children,
  footerContent,
}) {
  const [isShrunk, setIsShrunk] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hasWalletSession, setHasWalletSession] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(WALLET_SESSION_KEY) === "true";
  });
  const [walletAddress, setWalletAddress] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(WALLET_ADDRESS_KEY) || "";
  });
  const [walletTier, setWalletTier] = React.useState("Explorer");
  const [syncIssueVisible, setSyncIssueVisible] = React.useState(false);
  const [syncRetryTick, setSyncRetryTick] = React.useState(0);

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
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsShrunk(prev => {
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

  React.useEffect(() => {
    const syncWalletState = () => {
      const fromStorage = localStorage.getItem(WALLET_SESSION_KEY) === "true";
      const storedAddress = localStorage.getItem(WALLET_ADDRESS_KEY) || "";
      setHasWalletSession(fromStorage);
      setWalletAddress(storedAddress);
    };

    syncWalletState();
    window.addEventListener("storage", syncWalletState);
    window.addEventListener("focus", syncWalletState);
    window.addEventListener("web3edu-wallet-state", syncWalletState);

    return () => {
      window.removeEventListener("storage", syncWalletState);
      window.removeEventListener("focus", syncWalletState);
      window.removeEventListener("web3edu-wallet-state", syncWalletState);
    };
  }, []);

  React.useEffect(() => {
    const revalidateWalletSession = async () => {
      if (!hasWalletSession) return;
      if (!window.ethereum?.request) return;

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (!Array.isArray(accounts) || accounts.length === 0) {
          localStorage.removeItem(WALLET_SESSION_KEY);
          localStorage.removeItem(WALLET_ADDRESS_KEY);
          setHasWalletSession(false);
          setWalletAddress("");
        } else {
          localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0]);
          setWalletAddress(accounts[0]);
        }
      } catch {
        // Keep stored state if provider check fails.
      }
    };

    revalidateWalletSession();
  }, [hasWalletSession]);

  React.useEffect(() => {
    if (!walletAddress) {
      setWalletTier("Explorer");
      setSyncIssueVisible(false);
      return;
    }

    const controller = new AbortController();
    const BACKEND =
      import.meta.env.VITE_BACKEND_URL ?? "https://web3edu-api.dimikog.org";

    fetch(`${BACKEND}/web3sbt/resolve/${walletAddress}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().catch(() => ({})).then((payload) => {
          throw createBackendError(res.status, payload);
        });
      })
      .then((data) => {
        const xpTotal = getXpTotalFromBackend(data);
        setWalletTier(getRoleFromXpTotal(xpTotal));
        setSyncIssueVisible(false);
      })
      .catch((err) => {
        if (isUserStateUnavailableError(err)) {
          console.warn("Backend user state temporarily unavailable; preserving wallet tier.");
          setSyncIssueVisible(true);
          return;
        }
        setSyncIssueVisible(false);
        setWalletTier("Explorer");
      });

    return () => controller.abort();
  }, [walletAddress, syncRetryTick]);

  React.useEffect(() => {
    if (!syncIssueVisible) return undefined;
    const timeoutId = window.setTimeout(() => {
      setSyncRetryTick((value) => value + 1);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [syncIssueVisible]);

  // Handle language toggle
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

  const normalizedHash = currentHash.split("?")[0];
  const isJoinPage =
    normalizedHash.startsWith("#/join") || normalizedHash.startsWith("#/join-gr");
  const isLabsLandingPage =
    normalizedHash === "#/labs" ||
    normalizedHash === "#/labs/" ||
    normalizedHash === "#/labs-gr" ||
    normalizedHash === "#/labs-gr/";

  // Hide Join button on pages with Web3RouteControls (to avoid duplicates)
  const isWeb3ProtectedRoute =
    normalizedHash.startsWith("#/labs/") ||
    normalizedHash.startsWith("#/labs-gr/") ||
    normalizedHash.startsWith("#/mint-identity") ||
    normalizedHash.startsWith("#/welcome") ||
    normalizedHash.startsWith("#/dashboard") ||
    normalizedHash.startsWith("#/sbt-view") ||
    normalizedHash.startsWith("#/verify") ||
    normalizedHash.startsWith("#/admin");

  const showJoinCta =
    !hasWalletSession && !isJoinPage && !isLabsLandingPage && !isWeb3ProtectedRoute;
  const showWalletSessionCtaDesktop =
    hasWalletSession && !isJoinPage && !isLabsLandingPage && !isWeb3ProtectedRoute;
  const showWalletSessionCtaMobile =
    hasWalletSession && !isJoinPage && !isLabsLandingPage;

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
    ${isShrunk ? "py-2 shadow-2xl" : ""}
  `}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href={isGR ? "/#/gr" : "/#/"} aria-label={isGR ? "Αρχική" : "Home"}>
              <picture>
                <source srcSet={isDark ? web3EduLogoDark : web3EduLogoLight} type="image/svg+xml" />
                <img src={isDark ? web3EduLogoDark : web3EduLogoLight}
                  alt="Web3Edu"
                  className="h-10 w-auto drop-shadow-[0_0_12px_rgba(120,60,255,0.45)]
                  transition-opacity duration-500"
                  loading="eager"
                />
              </picture>
            </a>
          </div>

          {/* Main nav */}
          <div className="hidden lg:flex items-center gap-4">
            {isGR ? (
              <>
                <a href="/#/gr" className="relative font-medium 
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Αρχική</a>
                <a
                  href="/#/start-here-gr"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
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
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Εργαστήρια
                </a>
                <a
                  href="/#/projects-gr"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Projects
                </a>
                <a
                  href="/#/dao-info-gr"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Διακυβέρνηση DAO
                </a>
                <a href="/#/team-gr" className="relative font-medium 
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Ομάδα</a>
              </>
            ) : (
              <>
                <a href="/#/" className="relative font-medium 
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Home</a>
                <a
                  href="/#/start-here"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
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
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Labs
                </a>
                <a
                  href="/#/projects"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  Projects
                </a>
                <a
                  href="/#/dao-info"
                  className="relative font-medium 
    text-slate-800 dark:text-slate-100
    hover:text-indigo-700 dark:hover:text-white
    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
    after:w-full after:scale-x-0 after:bg-gradient-to-r
    after:from-[#7b3df8] after:to-[#00d4ff]
    after:transition-transform hover:after:scale-x-100"
                >
                  DAO Governance
                </a>
                <a href="/#/team" className="relative font-medium 
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Team</a>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {showJoinCta && (
                <button
                  onClick={() => {
                    window.location.hash = isGR ? "#/join-gr" : "#/join";
                  }}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/40 to-blue-500/40
                 hover:from-pink-500/60 hover:to-blue-500/60
                 text-white shadow-lg shadow-indigo-500/20 border border-white/10 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  {isGR ? "Σύνδεση" : "Join"}
                </button>
              )}
            {showWalletSessionCtaDesktop && walletAddress && (
              <>
                <button
                  onClick={() => {
                    window.location.hash = isGR ? "#/dashboard-gr" : "#/dashboard";
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/85 px-2 py-1.5 text-white shadow-lg shadow-indigo-500/25 backdrop-blur cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 hover:border-white/40"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-purple-400/80"
                    style={generateAvatarStyle(walletAddress, walletTier)}
                  >
                    <AddressIdenticon address={walletAddress} />
                  </span>
                  <span className="hidden text-xs font-mono sm:inline">
                    {shortAddress(walletAddress)}
                  </span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem(WALLET_SESSION_KEY);
                    localStorage.removeItem(WALLET_ADDRESS_KEY);
                    window.dispatchEvent(new Event("web3edu-wallet-state"));
                    window.location.hash = isGR ? "#/join-gr" : "#/join";
                  }}
                  className="px-4 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/35 text-white shadow-lg shadow-red-500/20 border border-red-300/25 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  {isGR ? "Αποσύνδεση" : "Disconnect"}
                </button>
                {isAdminWallet(walletAddress) ? (
                  <button
                    onClick={() => {
                      window.location.hash = "#/admin";
                    }}
                    className="rounded-full border border-red-400/40 bg-red-500/25 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:bg-red-500/50 hover:scale-105 hover:border-red-400/60 hover:shadow-lg"
                  >
                    {isGR ? "Διαχείριση" : "Admin"}
                  </button>
                ) : null}
              </>
            )}

            {/* Theme toggle (moved outside language toggle group) */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? (isGR ? "Εναλλαγή σε φωτεινό θέμα" : "Switch to light theme") : (isGR ? "Εναλλαγή σε σκοτεινό θέμα" : "Switch to dark theme")}
              title={isDark ? (isGR ? "Φωτεινό θέμα" : "Light theme") : (isGR ? "Σκοτεινό θέμα" : "Dark theme")}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              {isDark ? "🌞" : "🌙"}
            </button>

            {/* Language toggle (clean, separate, no interaction with theme) */}
            <button
              onClick={toggleLanguage}
              aria-label={isGR ? "Switch language to English" : "Αλλαγή γλώσσας στα Ελληνικά"}
              title={isGR ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
              className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              {isGR ? "EN" : "GR"}
            </button>
          </div>

          {/* Mobile */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? (isGR ? "Κλείσιμο μενού" : "Close menu") : (isGR ? "Άνοιγμα μενού" : "Open menu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-menu"
          >
            ☰
          </button>
          {/* Decorative line under navbar */}
          <div className="absolute left-0 right-0 -bottom-1 h-[3px]
            bg-gradient-to-r from-[#7b3df8] via-[#9c4dff] to-[#00d4ff]
            opacity-80 blur-[1px] pointer-events-none"></div>
        </nav>

        {syncIssueVisible ? (
          <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 shadow-lg backdrop-blur dark:text-amber-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">
                {isGR
                  ? "⚠ Δυσκολευόμαστε να συγχρονίσουμε την πρόοδό σας. Γίνεται νέα προσπάθεια…"
                  : "⚠ We’re having trouble syncing your progress. Retrying…"}
              </p>
              <button
                onClick={() => setSyncRetryTick((value) => value + 1)}
                className="inline-flex items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 font-semibold text-amber-950 transition hover:bg-amber-500/25 dark:text-amber-100"
              >
                {isGR ? "Δοκίμασε ξανά" : "Retry now"}
              </button>
            </div>
          </div>
        ) : null}

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div id="mobile-navigation-menu" className="fixed inset-0 lg:hidden z-40 px-4 pt-24 pb-8 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xl">
            <div className="h-full w-full overflow-y-auto rounded-2xl border border-white/10 bg-white/80 dark:bg-slate-900/85 shadow-2xl shadow-indigo-500/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      onClick={() => navigateTo("#/projects-gr")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Projects
                    </button>
                    <button
                      onClick={() => navigateTo("#/dao-info-gr")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50 flex items-center justify-center"
                    >
                      Διακυβέρνηση DAO
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
                      onClick={() => navigateTo("#/projects")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Projects
                    </button>
                    <button
                      onClick={() => navigateTo("#/dao-info")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50 flex items-center justify-center"
                    >
                      DAO Governance
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

              {showJoinCta && (
                  <button
                    onClick={() => navigateTo(isGR ? "#/join-gr" : "#/join")}
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500/60 to-blue-500/60 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:from-pink-500/70 hover:to-blue-500/70 transition"
                  >
                    {isGR ? "Σύνδεση" : "Join"}
                  </button>
                )}
              {showWalletSessionCtaMobile && walletAddress && (
                <>
                  <button
                    onClick={() => navigateTo(isGR ? "#/dashboard-gr" : "#/dashboard")}
                    className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 transition inline-flex items-center justify-center gap-2"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-purple-400/80"
                      style={generateAvatarStyle(walletAddress, walletTier)}
                    >
                      <AddressIdenticon address={walletAddress} />
                    </span>
                    <span className="font-mono">{shortAddress(walletAddress)}</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem(WALLET_SESSION_KEY);
                      localStorage.removeItem(WALLET_ADDRESS_KEY);
                      window.dispatchEvent(new Event("web3edu-wallet-state"));
                      navigateTo(isGR ? "#/join-gr" : "#/join");
                    }}
                    className="w-full rounded-xl bg-red-500/35 text-white py-3 text-sm font-semibold shadow-lg shadow-red-500/25 hover:bg-red-500/45 transition"
                  >
                    {isGR ? "Αποσύνδεση" : "Disconnect"}
                  </button>
                  {isAdminWallet(walletAddress) ? (
                    <button
                      onClick={() => navigateTo("#/admin")}
                      className="w-full rounded-xl bg-red-500/30 text-white py-3 text-sm font-semibold shadow-lg shadow-red-500/25 hover:bg-red-500/45 transition"
                    >
                      {isGR ? "Διαχείριση" : "Admin"}
                    </button>
                  ) : null}
                </>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
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
                  onClick={() => {
                    setIsDark((prev) => !prev);
                    setMobileOpen(false);
                  }}
                  aria-label={isDark ? (isGR ? "Εναλλαγή σε φωτεινό θέμα" : "Switch to light theme") : (isGR ? "Εναλλαγή σε σκοτεινό θέμα" : "Switch to dark theme")}
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
        {isGR ? <FooterGr content={footerContent} /> : <Footer content={footerContent} />}
      </div>
    </main>
  );
}
