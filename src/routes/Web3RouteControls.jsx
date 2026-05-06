import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useAuth } from "react-oidc-context";
import {
  AddressIdenticon,
  generateAvatarStyle,
  shortAddress,
} from "../components/identity-ui.jsx";
import {
  getRoleFromXpTotal,
  getXpTotalFromBackend,
  isUserStateUnavailableError,
} from "../utils/progression.js";
import { isGreekPathname } from "../utils/lang.js";
import { useIdentity } from "../context/IdentityContext.jsx";
import { resolveIdentityV2 } from "../api/aa.js";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { createOidcConfig } from "../auth/oidcConfig.js";

const ADMIN_WALLETS = (
  import.meta.env.VITE_ADMIN_WALLETS ??
  "0x0e66db7d115b8f392eb7dfb8bacb23675daeb59e"
)
  .split(",")
  .map((address) => address.trim().toLowerCase())
  .filter(Boolean);

function isAdminWallet(address) {
  return Boolean(address && ADMIN_WALLETS.includes(address.toLowerCase()));
}

const WALLET_SESSION_KEY = "web3edu-wallet-connected";
const WALLET_ADDRESS_KEY = "web3edu-wallet-address";
const SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY = "web3edu-social-switch-from-local-aa";

export default function Web3RouteControls() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { smartAccount, disconnectIdentity, isIdentityReady: onboarded } = useIdentity();
  const [identityMenuOpen, setIdentityMenuOpen] = useState(false);
  const identityMenuRef = useRef(null);
  const addrForUi = onboarded ? smartAccount : null;

  const currentPath = location.pathname || "/";
  const isGreek = isGreekPathname(currentPath);
  const dashboardPath = isGreek ? "/dashboard-gr" : "/dashboard";
  const isDashboardRoute =
    currentPath === "/dashboard" ||
    currentPath === "/dashboard/" ||
    currentPath === "/dashboard-gr" ||
    currentPath === "/dashboard-gr/";
  const isLabsLandingRoute =
    currentPath === "/labs" ||
    currentPath === "/labs/" ||
    currentPath === "/labs-gr" ||
    currentPath === "/labs-gr/";
  const isSettingsRoute =
    currentPath === "/settings" ||
    currentPath === "/settings/" ||
    currentPath === "/settings-gr" ||
    currentPath === "/settings-gr/";
  const isAdminRoute = currentPath === "/admin" || currentPath.startsWith("/admin/");
  const suppressJoinCta = isDashboardRoute || isLabsLandingRoute || isSettingsRoute || isAdminRoute;
  const socialConnectLabel = isGreek
    ? "🔐 Σύνδεση Web3Edu λογαριασμού"
    : "🔐 Connect Web3Edu account";
  const [savedTier, setSavedTier] = useState("Explorer");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isConnected && address) {
      localStorage.setItem(WALLET_SESSION_KEY, "true");
      localStorage.setItem(WALLET_ADDRESS_KEY, address);
    } else {
      localStorage.removeItem(WALLET_SESSION_KEY);
      localStorage.removeItem(WALLET_ADDRESS_KEY);
    }
    window.dispatchEvent(new Event("web3edu-wallet-state"));
  }, [address, isConnected]);

  useEffect(() => {
    if (!onboarded) {
      setSavedTier("Explorer");
      return;
    }

    const sc = normalizeEvmAddress(smartAccount);

    if (!sc) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console -- dev-only guard
        console.warn("Skipping tier resolve — no smartAccount");
      }
      return;
    }

    const controller = new AbortController();

    resolveIdentityV2({
      address: sc,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (!data) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console -- resolve is non-fatal
            console.warn("Skipping tier resolve — resolve returned null");
          }
          return;
        }
        const xpTotal = getXpTotalFromBackend(data);
        setSavedTier(getRoleFromXpTotal(xpTotal));
      })
      .catch((err) => {
        if (isUserStateUnavailableError(err)) {
          return;
        }
        setSavedTier("Explorer");
      });

    return () => controller.abort();
  }, [onboarded, smartAccount]);

  useEffect(() => {
    if (!identityMenuOpen) return undefined;
    const onDocDown = (e) => {
      const root = identityMenuRef.current;
      if (root?.contains(e.target)) return;
      setIdentityMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [identityMenuOpen]);

  const handleDisconnectIdentity = async () => {
    setIdentityMenuOpen(false);
    if (isConnected) {
      try {
        await disconnectAsync();
      } catch {
        /* ignore */
      }
    }
    disconnectIdentity();
    if (auth?.isAuthenticated) {
      try {
        const cfg = createOidcConfig();
        await auth.signoutRedirect({
          post_logout_redirect_uri: cfg.post_logout_redirect_uri,
          extraQueryParams: { client_id: cfg.client_id },
        });
        // signoutRedirect navigates away; post_logout_redirect_uri returns to /#/join
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  if (!onboarded) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col items-end gap-2 sm:top-6 sm:right-8">
      {onboarded && addrForUi ? (
        <div
          ref={identityMenuRef}
          className="pointer-events-auto relative flex max-w-[calc(100vw-2rem)] flex-nowrap items-center justify-end gap-2 sm:max-w-none sm:gap-2.5"
        >
          <button
            type="button"
            aria-expanded={identityMenuOpen}
            aria-haspopup="menu"
            aria-label={isGreek ? "Μενού λογαριασμού" : "Account menu"}
            onClick={() => setIdentityMenuOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/85 px-2 py-1.5 text-white shadow-lg shadow-indigo-500/25 backdrop-blur cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 hover:border-white/40"
          >
            <span
              className={
                "flex h-8 w-8 items-center justify-center rounded-full " +
                (savedTier === "Architect"
                  ? "ring-2 ring-yellow-400/80"
                  : savedTier === "Builder"
                    ? "ring-2 ring-blue-400/80"
                    : "ring-2 ring-purple-400/80")
              }
              style={generateAvatarStyle(addrForUi, savedTier)}
            >
              <AddressIdenticon address={addrForUi} />
            </span>
            <span className="hidden text-xs font-mono sm:inline">
              {shortAddress(addrForUi)}
            </span>
            <span className="hidden text-[10px] opacity-70 sm:inline" aria-hidden>
              ▾
            </span>
          </button>
          {identityMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.35rem)] z-[70] min-w-[10.5rem] rounded-xl border border-white/15 bg-slate-900/95 py-1 text-left shadow-xl backdrop-blur-md dark:bg-slate-950/95"
            >
              {!auth?.isAuthenticated ? (
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-2 text-left text-xs text-white transition hover:bg-white/10 sm:text-sm"
                  onClick={() => {
                    setIdentityMenuOpen(false);
                    if (typeof window !== "undefined" && addrForUi) {
                      window.sessionStorage.setItem(
                        SOCIAL_SWITCH_FROM_LOCAL_AA_SESSION_KEY,
                        String(addrForUi)
                      );
                    }
                    void auth?.signinRedirect?.();
                  }}
                >
                  {socialConnectLabel}
                </button>
              ) : null}
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-xs text-white transition hover:bg-white/10 sm:text-sm"
                onClick={() => {
                  setIdentityMenuOpen(false);
                  navigate(dashboardPath);
                }}
              >
                {isGreek ? "Πίνακας" : "Dashboard"}
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-xs text-red-200 transition hover:bg-red-500/20 sm:text-sm"
                onClick={() => void handleDisconnectIdentity()}
              >
                {isGreek ? "Αποσύνδεση" : "Disconnect"}
              </button>
            </div>
          ) : null}
          {isAdminWallet(address) ? (
            <Link
              to="/admin"
              className="hidden sm:inline-flex rounded-full border border-red-400/40 bg-red-500/25 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:bg-red-500/50 hover:scale-105 hover:border-red-400/60 hover:shadow-lg"
            >
              {isGreek ? "Διαχείριση" : "Admin"}
            </Link>
          ) : null}
        </div>
      ) : (
        !suppressJoinCta ? (
          <Link
            to={isGreek ? "/join-gr" : "/join"}
            className="pointer-events-auto inline-flex rounded-full bg-gradient-to-r from-[#9333ea] via-[#6366f1] to-[#0891b2] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#8A57FF]/25 ring-1 ring-white/35 transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/35 dark:from-violet-600 dark:via-indigo-600 dark:to-cyan-600 dark:ring-white/20"
          >
            {isGreek ? "Σύνδεση" : "Join"}
          </Link>
        ) : null
      )}
    </div>
  );
}
