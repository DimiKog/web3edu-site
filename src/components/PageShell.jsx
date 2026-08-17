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
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton.jsx";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialAwareWalletConnect } from "../hooks/useSocialAwareWalletConnect.js";
import { useResolvedIdentityContext } from "../hooks/useResolvedIdentityContext.js";
import { useAuth } from "react-oidc-context";
import { loadIdentityState } from "../utils/aaIdentity.js";
import { signOutKeycloakAccount } from "../auth/keycloakSignOut.js";
import { isNeutralAfterLogout, setViewerMode, VIEWER_MODES } from "../utils/viewerMode.js";
import { resolveNavIdentityMenuHint } from "../utils/dashboardIdentityUi.js";
import { useAdminEligibility } from "../hooks/useAdminEligibility.js";

const WALLET_SESSION_KEY = "web3edu-wallet-connected";
const WALLET_ADDRESS_KEY = "web3edu-wallet-address";

/** Outline / secondary — matches SectionBadge + TeamMemberCard lavender tokens */
const navAuthSecondaryClass =
  "px-3 py-1.5 rounded-full border border-[#8A57FF]/35 bg-[#EDE8FF]/95 text-[#5B2DC8] shadow-sm backdrop-blur " +
  "cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#E2D8FF] hover:border-[#8A57FF]/50 " +
  "dark:border-indigo-400/35 dark:bg-indigo-950/80 dark:text-indigo-100 dark:shadow-lg dark:shadow-indigo-900/20 " +
  "dark:hover:bg-indigo-900/85 dark:hover:border-indigo-300/45";

/** Primary CTA — saturated gradient so label stays readable on light lavender nav */
const navAuthPrimaryClass =
  "px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-md shadow-[#8A57FF]/25 " +
  "bg-gradient-to-r from-[#9333ea] via-[#6366f1] to-[#0891b2] ring-1 ring-white/35 " +
  "cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/35 " +
  "dark:from-violet-600 dark:via-indigo-600 dark:to-cyan-600 dark:ring-white/20";

const SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY = "web3edu-social-switch-from-local-aa";

const getLangFromHash = (hash) => {
  if (!hash) return null;
  if (hash.includes("-gr") || hash.startsWith("#/gr")) return "gr";
  return null;
};

const hasPersistedIdentityState = () => {
  const state = loadIdentityState();
  return Boolean(state?.hasIdentity === true || state?.alreadyMinted === true);
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
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { connectWalletSessionAware, isPending: isConnectPending } = useSocialAwareWalletConnect();
  const { disconnectAsync } = useDisconnect();
  const [identityMenuOpen, setIdentityMenuOpen] = React.useState(false);
  const identityMenuRef = React.useRef(null);
  const identityMenuMobileRef = React.useRef(null);
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
  const [hasPersistedIdentity, setHasPersistedIdentity] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return hasPersistedIdentityState();
  });
  const { walletTier, syncIssueVisible, refetch, canonicalIdentityAddress, isWalletEntryLinkedAlias, walletEntryResolvePending } = useResolvedIdentityContext();

  const [currentHash, setCurrentHash] = React.useState(
    typeof window !== "undefined" ? window.location.hash || "#/" : "#/"
  );

  const { disconnectIdentity, isIdentityReady: onboarded } = useIdentity();
  const { address: wagmiAddress, isConnected } = useAccount();
  const { isAdminEligible } = useAdminEligibility();
  /**
   * Canonical identity address — resolves both social-login AA and wallet AA.
   * Social-login users have a backend-provisioned AA address that is not tracked
   * by `isIdentityReady` (wallet-only flag), so we use canonicalIdentityAddress
   * from ResolvedIdentityProvider which handles both paths.
   */
  const identityAddress = canonicalIdentityAddress ?? null;
  const displayAddress = canonicalIdentityAddress ?? wagmiAddress ?? walletAddress ?? null;
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
  const navIdentityMenuHint = resolveNavIdentityMenuHint({ isGR });

  const handleNavbarWalletConnect = React.useCallback(() => {
    void connectWalletSessionAware(isGR);
  }, [connectWalletSessionAware, isGR]);

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
    const syncSessionState = () => {
      const fromStorage = localStorage.getItem(WALLET_SESSION_KEY) === "true";
      const storedAddress = localStorage.getItem(WALLET_ADDRESS_KEY) || "";
      setHasWalletSession(fromStorage);
      setWalletAddress(storedAddress);
      setHasPersistedIdentity(hasPersistedIdentityState());
    };

    syncSessionState();
    window.addEventListener("storage", syncSessionState);
    window.addEventListener("focus", syncSessionState);
    window.addEventListener("web3edu-wallet-state", syncSessionState);

    return () => {
      window.removeEventListener("storage", syncSessionState);
      window.removeEventListener("focus", syncSessionState);
      window.removeEventListener("web3edu-wallet-state", syncSessionState);
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
    if (!syncIssueVisible) return undefined;
    const timeoutId = window.setTimeout(() => {
      refetch();
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [syncIssueVisible, refetch]);

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
  const isAdminRoute =
    String(location?.pathname || "").startsWith("/admin") ||
    normalizedHash.startsWith("#/admin");
  const isJoinPage =
    normalizedHash.startsWith("#/join") || normalizedHash.startsWith("#/join-gr");
  const isLabsLandingPage =
    normalizedHash === "#/labs" ||
    normalizedHash === "#/labs/" ||
    normalizedHash === "#/labs-gr" ||
    normalizedHash === "#/labs-gr/";

  /**
   * Dashboard entry point should be visible whenever the user has an active session:
   * - wallet-first AA identity (onboarded + smartAccount)
   * - social login session (OIDC authenticated; AA lives in SocialIdentityContext)
   */
  const hasActiveSession = Boolean(onboarded || auth?.isAuthenticated);
  const dashboardHash = isGR ? "#/dashboard-gr" : "#/dashboard";

  // Hide Join button on pages with Web3RouteControls (to avoid duplicates)
  const isWeb3ProtectedRoute =
    normalizedHash.startsWith("#/labs/") ||
    normalizedHash.startsWith("#/labs-gr/") ||
    normalizedHash.startsWith("#/mint-identity") ||
    normalizedHash.startsWith("#/welcome") ||
    normalizedHash.startsWith("#/dashboard") ||
    normalizedHash.startsWith("#/sbt-view") ||
    normalizedHash.startsWith("#/verify") ||
    normalizedHash.startsWith("#/settings") ||
    normalizedHash.startsWith("#/admin");

  /** Routes wrapped by `Web3Layout` (where `Web3RouteControls` mounts). Keep in sync with `routeTable.jsx` web3.routes. */
  const isWeb3LayoutRoute =
    normalizedHash.startsWith("#/join") ||
    normalizedHash.startsWith("#/mint-identity") ||
    normalizedHash.startsWith("#/welcome") ||
    normalizedHash.startsWith("#/dashboard") ||
    normalizedHash.startsWith("#/sbt-view") ||
    normalizedHash.startsWith("#/verify") ||
    normalizedHash.startsWith("#/labs");

  const showNavbarConnectWallet = !isConnected && !isJoinPage;

  /** Reserve space only when the floating Web3 account chrome is actually visible. */
  const reserveWeb3FloatingChrome = isWeb3LayoutRoute && onboarded;
  const reserveWeb3FloatingChromeClasses = reserveWeb3FloatingChrome
    ? isAdminEligible
      ? "md:pr-52 lg:pr-64 xl:pr-72"
      : "md:pr-40 lg:pr-52"
    : "";

  const showJoinCta =
    !identityAddress &&
    !hasActiveSession &&
    !isJoinPage &&
    !isLabsLandingPage &&
    !isWeb3ProtectedRoute &&
    !isAdminRoute;
  const identityEntryLabel = hasPersistedIdentity
    ? (isGR ? "Συνέχεια Ταυτότητας" : "Continue Identity")
    : (isGR ? "Web3Edu Identity" : "Web3Edu Identity");
  const socialConnectLabel = isGR
    ? "🔐 Σύνδεση Web3Edu Account"
    : "🔐 Connect Web3Edu Account";
  const walletConnectedForBanner = hasWalletSession || isConnected;
  /**
   * Identity dropdown should be available everywhere once a canonical identity exists,
   * including `/labs` (so users can jump to Dashboard from the learning hub).
   */
  const showIdentityCtaDesktop = Boolean(identityAddress) && !isJoinPage;
  const showIdentityCtaMobile = Boolean(identityAddress) && !isJoinPage;

  const handleDisconnectIdentity = React.useCallback(async () => {
    setIdentityMenuOpen(false);
    setMobileOpen(false);
    if (isConnected) {
      try {
        await disconnectAsync();
      } catch {
        /* ignore wagmi disconnect errors */
      }
    }
    disconnectIdentity();
    if (auth?.isAuthenticated) {
      try {
        await signOutKeycloakAccount(auth);
        // signoutRedirect navigates away; post_logout_redirect_uri returns to /#/join
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [disconnectAsync, disconnectIdentity, isConnected, navigate, auth]);

  React.useEffect(() => {
    if (!identityMenuOpen) return undefined;
    const onDocDown = (e) => {
      const desktop = identityMenuRef.current;
      const mobile = identityMenuMobileRef.current;
      if (desktop?.contains(e.target) || mobile?.contains(e.target)) return;
      setIdentityMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [identityMenuOpen]);

  return (
    <main
      style={{
        background: isDark
          ? "#0a0f1a"
          : "linear-gradient(180deg, #e7dfff 0%, #f3eaff 50%, #f7faff 100%)"
      }}
      className="w-full min-h-screen transition-colors duration-500 overflow-x-hidden"
    >
      <div
        className={[
          "w-full fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-8",
          reserveWeb3FloatingChromeClasses,
        ]
          .filter(Boolean)
          .join(" ")}
      >

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
                  Έρευνα Διακυβέρνησης
                </a>
                <a href="/#/team-gr" className="relative font-medium
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Ομάδα</a>
                {/* Πίνακας link only for OIDC-only users who have no identity avatar dropdown */}
                {hasActiveSession && !identityAddress ? (
                  <a
                    href={`/${dashboardHash}`}
                    className="relative font-semibold
  text-slate-900 dark:text-white
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100"
                  >
                    Πίνακας
                  </a>
                ) : null}
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
                  Governance Research
                </a>
                <a href="/#/team" className="relative font-medium
  text-slate-800 dark:text-slate-100
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100">Team</a>
                {/* Dashboard link only for OIDC-only users who have no identity avatar dropdown */}
                {hasActiveSession && !identityAddress ? (
                  <a
                    href={`/${dashboardHash}`}
                    className="relative font-semibold
  text-slate-900 dark:text-white
  hover:text-indigo-700 dark:hover:text-white
  after:absolute after:-bottom-1 after:left-0 after:h-[2px]
  after:w-full after:scale-x-0 after:bg-gradient-to-r
  after:from-[#7b3df8] after:to-[#00d4ff]
  after:transition-transform hover:after:scale-x-100"
                  >
                    Dashboard
                  </a>
                ) : null}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {showNavbarConnectWallet ? (
              <ConnectWalletButton
                isGr={isGR}
                isPending={isConnectPending}
                onClick={() => void handleNavbarWalletConnect()}
              />
            ) : null}
            {showJoinCta && (
                <button
                  onClick={() => {
                    window.location.hash = isGR ? "#/join-gr" : "#/join";
                  }}
                  className={navAuthPrimaryClass}
                >
                  {identityEntryLabel}
                </button>
              )}
            {showIdentityCtaDesktop && displayAddress && (
              <div ref={identityMenuRef} className="relative flex items-center gap-2">
                <button
                  type="button"
                  aria-expanded={identityMenuOpen}
                  aria-haspopup="menu"
                  aria-label={isGR ? "Μενού λογαριασμού" : "Account menu"}
                  title={navIdentityMenuHint}
                  onClick={() => setIdentityMenuOpen((o) => !o)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/85 px-2 py-1.5 text-white shadow-lg shadow-indigo-500/25 backdrop-blur cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 hover:border-white/40"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-purple-400/80"
                    style={generateAvatarStyle(displayAddress, walletTier)}
                  >
                    <AddressIdenticon address={displayAddress} />
                  </span>
                  <span className="hidden text-xs font-mono sm:inline">
                    {shortAddress(displayAddress)}
                  </span>
                  <span className="hidden text-[10px] opacity-70 sm:inline" aria-hidden>
                    ▾
                  </span>
                </button>
                {identityMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[12rem] rounded-xl border border-white/15 bg-slate-900/95 py-1 text-left shadow-xl shadow-black/40 backdrop-blur-md dark:bg-slate-950/95"
                  >
                    {!auth?.isAuthenticated ? (
                      !isAdminRoute ? (
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                        onClick={() => {
                          setIdentityMenuOpen(false);
                          if (typeof window !== "undefined" && displayAddress) {
                            window.sessionStorage.setItem(
                              SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY,
                              String(displayAddress)
                            );
                          }
                          void auth?.signinRedirect?.();
                        }}
                      >
                        {socialConnectLabel}
                      </button>
                      ) : null
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                      onClick={() => {
                        setIdentityMenuOpen(false);
                        window.location.hash = isGR ? "#/dashboard-gr" : "#/dashboard";
                      }}
                    >
                      {isGR ? "📊 Πίνακας" : "📊 Dashboard"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                      onClick={() => {
                        setIdentityMenuOpen(false);
                        window.location.hash = isGR ? "#/sbt-view-gr" : "#/sbt-view";
                      }}
                    >
                      {isGR ? "🏅 Η Ταυτότητά μου" : "🏅 My Identity"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                      onClick={() => {
                        setIdentityMenuOpen(false);
                        window.location.hash = isGR ? "#/settings-gr" : "#/settings";
                      }}
                    >
                      {isGR ? "⚙ Ρυθμίσεις" : "⚙ Settings"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full border-t border-white/10 px-4 py-2.5 text-left text-sm text-red-200 transition hover:bg-red-500/20"
                      onClick={() => void handleDisconnectIdentity()}
                    >
                      {isGR ? "Αποσύνδεση" : "Disconnect"}
                    </button>
                  </div>
                ) : null}
                {isAdminEligible ? (
                  <button
                    onClick={() => {
                      window.location.hash = "#/admin";
                    }}
                    className="rounded-full border border-red-400/40 bg-red-500/25 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:bg-red-500/50 hover:scale-105 hover:border-red-400/60 hover:shadow-lg"
                  >
                    {isGR ? "Διαχείριση" : "Admin"}
                  </button>
                ) : null}
              </div>
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
            {!isAdminRoute ? (
              <>
                <button
                  onClick={toggleLanguage}
                  aria-label={isGR ? "Switch language to English" : "Αλλαγή γλώσσας στα Ελληνικά"}
                  title={isGR ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
                  className="px-3 py-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
                >
                  {isGR ? "EN" : "GR"}
                </button>
                {auth?.isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => void signOutKeycloakAccount(auth)}
                    className={navAuthSecondaryClass}
                  >
                    {isGR ? "Έξοδος" : "Sign out"}
                  </button>
                ) : null}
              </>
            ) : null}
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
                onClick={() => refetch()}
                className="inline-flex items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 font-semibold text-amber-950 transition hover:bg-amber-500/25 dark:text-amber-100"
              >
                {isGR ? "Δοκίμασε ξανά" : "Retry now"}
              </button>
            </div>
          </div>
        ) : null}

        {!auth?.isAuthenticated && isNeutralAfterLogout() && !isWalletEntryLinkedAlias && !walletEntryResolvePending && (hasWalletSession || hasPersistedIdentity) ? (
          <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-sky-300/40 bg-sky-50/80 px-4 py-3 text-left text-sm text-sky-950 shadow-lg backdrop-blur dark:border-sky-500/25 dark:bg-sky-950/25 dark:text-sky-50">
            <p className="font-semibold">
              {isGR
                ? "Αποσυνδέθηκες από τον Web3Edu Account σου."
                : "You signed out from your Web3Edu Account."}
            </p>
            <p className="mt-1 text-xs opacity-90">
              {walletConnectedForBanner
                ? isGR
                  ? "Συνδέσου ξανά για να δεις την πρόοδό σου ή συνέχισε με το συνδεδεμένο wallet ως ξεχωριστό wallet-only προφίλ."
                  : "Sign in again to view your Web3Edu progress, or continue with your connected wallet as a separate wallet-only profile."
                : isGR
                  ? "Συνδέσου ξανά για να δεις την πρόοδό σου ή συνέχισε με την ταυτότητα που είναι αποθηκευμένη σε αυτή τη συσκευή."
                  : "Sign in again to view your Web3Edu progress, or continue with the identity saved on this device."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewerMode(VIEWER_MODES.social);
                  void auth?.signinRedirect?.();
                }}
                className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                {isGR ? "Είσοδος με Web3Edu Account" : "Sign in with Web3Edu Account"}
              </button>

              {walletConnectedForBanner ? (
                <button
                  type="button"
                  onClick={() => {
                    setViewerMode(VIEWER_MODES.wallet);
                    navigate(isGR ? "/join-gr" : "/join");
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-sky-300/60 bg-white/80 px-4 py-2 text-xs font-semibold text-sky-950 hover:bg-white dark:border-sky-500/30 dark:bg-white/10 dark:text-sky-50 dark:hover:bg-white/15"
                >
                  {isGR ? "Συνέχεια με wallet-only προφίλ" : "Continue with wallet-only profile"}
                </button>
              ) : hasPersistedIdentity ? (
                <button
                  type="button"
                  onClick={() => {
                    setViewerMode(VIEWER_MODES.device);
                    navigate(isGR ? "/join-gr" : "/join");
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-sky-300/60 bg-white/80 px-4 py-2 text-xs font-semibold text-sky-950 hover:bg-white dark:border-sky-500/30 dark:bg-white/10 dark:text-sky-50 dark:hover:bg-white/15"
                >
                  {isGR ? "Συνέχεια σε αυτή τη συσκευή" : "Continue on this device"}
                </button>
              ) : null}
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
                      Έρευνα Διακυβέρνησης
                    </button>
                    <button
                      onClick={() => navigateTo("#/team-gr")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Ομάδα
                    </button>
                    {/* Πίνακας only for OIDC-only users without identity dropdown */}
                    {hasActiveSession && !identityAddress ? (
                      <button
                        onClick={() => navigateTo(dashboardHash)}
                        className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20"
                      >
                        Πίνακας
                      </button>
                    ) : null}
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
                      Governance Research
                    </button>
                    <button
                      onClick={() => navigateTo("#/team")}
                      className="w-full rounded-xl border border-slate-300/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/80 py-3 text-sm font-semibold text-slate-800 dark:text-blue-100 hover:border-indigo-400/50"
                    >
                      Team
                    </button>
                    {/* Dashboard only for OIDC-only users without identity dropdown */}
                    {hasActiveSession && !identityAddress ? (
                      <button
                        onClick={() => navigateTo(dashboardHash)}
                        className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20"
                      >
                        Dashboard
                      </button>
                    ) : null}
                  </>
                )}
              </div>

              {showNavbarConnectWallet ? (
                <ConnectWalletButton
                  isGr={isGR}
                  isPending={isConnectPending}
                  onClick={() => void handleNavbarWalletConnect()}
                  className="w-full justify-center py-3"
                />
              ) : null}
              {showJoinCta && (
                  <button
                    onClick={() => navigateTo(isGR ? "#/join-gr" : "#/join")}
                    className={`${navAuthPrimaryClass.replace("rounded-full", "rounded-xl").replace("py-1.5", "py-3")} w-full shadow-lg`}
                  >
                    {identityEntryLabel}
                  </button>
                )}
              {showIdentityCtaMobile && displayAddress && (
                <div ref={identityMenuMobileRef} className="space-y-2">
                  <button
                    type="button"
                    aria-expanded={identityMenuOpen}
                    aria-haspopup="menu"
                    aria-label={isGR ? "Μενού λογαριασμού" : "Account menu"}
                    title={navIdentityMenuHint}
                    onClick={() => setIdentityMenuOpen((o) => !o)}
                    className="w-full rounded-xl bg-slate-900 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-500/25 transition inline-flex items-center justify-center gap-2"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-purple-400/80"
                      style={generateAvatarStyle(displayAddress, walletTier)}
                    >
                      <AddressIdenticon address={displayAddress} />
                    </span>
                    <span className="font-mono">{shortAddress(displayAddress)}</span>
                    <span className="text-xs opacity-70" aria-hidden>
                      ▾
                    </span>
                  </button>
                  {identityMenuOpen ? (
                    <div
                      role="menu"
                      className="w-full overflow-hidden rounded-xl border border-white/15 bg-white/95 dark:bg-slate-900/95"
                    >
                      {!auth?.isAuthenticated ? (
                        !isAdminRoute ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-200/80 dark:text-white dark:hover:bg-white/10"
                          onClick={() => {
                            setIdentityMenuOpen(false);
                            setMobileOpen(false);
                            if (typeof window !== "undefined" && displayAddress) {
                              window.sessionStorage.setItem(
                                SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY,
                                String(displayAddress)
                              );
                            }
                            void auth?.signinRedirect?.();
                          }}
                        >
                          {socialConnectLabel}
                        </button>
                        ) : null
                      ) : null}
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-200/80 dark:text-white dark:hover:bg-white/10"
                        onClick={() => {
                          setIdentityMenuOpen(false);
                          navigateTo(isGR ? "#/dashboard-gr" : "#/dashboard");
                        }}
                      >
                        {isGR ? "📊 Πίνακας" : "📊 Dashboard"}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-200/80 dark:text-white dark:hover:bg-white/10"
                        onClick={() => {
                          setIdentityMenuOpen(false);
                          navigateTo(isGR ? "#/sbt-view-gr" : "#/sbt-view");
                        }}
                      >
                        {isGR ? "🏅 Η Ταυτότητά μου" : "🏅 My Identity"}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-200/80 dark:text-white dark:hover:bg-white/10"
                        onClick={() => {
                          setIdentityMenuOpen(false);
                          navigateTo(isGR ? "#/settings-gr" : "#/settings");
                        }}
                      >
                        {isGR ? "⚙ Ρυθμίσεις" : "⚙ Settings"}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/20"
                        onClick={() => void handleDisconnectIdentity()}
                      >
                        {isGR ? "Αποσύνδεση" : "Disconnect"}
                      </button>
                    </div>
                  ) : null}
                  {isAdminEligible ? (
                    <button
                      onClick={() => navigateTo("#/admin")}
                      className="w-full rounded-xl bg-red-500/30 text-white py-3 text-sm font-semibold shadow-lg shadow-red-500/25 hover:bg-red-500/45 transition"
                    >
                      {isGR ? "Διαχείριση" : "Admin"}
                    </button>
                  ) : null}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                {!isAdminRoute ? (
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
                ) : (
                  <div className="w-full" />
                )}
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
              {!isAdminRoute && auth?.isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => void signOutKeycloakAccount(auth)}
                  className="w-full rounded-xl border border-white/20 bg-white/80 dark:bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-800 dark:text-white"
                >
                  {isGR ? "Έξοδος" : "Sign out"}
                </button>
              ) : null}
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
