import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
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
import { resolveIdentity } from "../api/aa.js";

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

export default function Web3RouteControls() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { owner, smartAccount, disconnectIdentity } = useIdentity();
  const [identityMenuOpen, setIdentityMenuOpen] = useState(false);
  const identityMenuRef = useRef(null);

  const identityAddress = smartAccount ?? owner ?? address ?? null;
  const displayAddress = smartAccount ?? address ?? owner ?? null;
  const addrForUi = displayAddress ?? identityAddress;

  const currentPath = location.pathname || "/";
  const isGreek = isGreekPathname(currentPath);
  const isJoinRoute = currentPath.startsWith("/join");
  const dashboardPath = isGreek ? "/dashboard-gr" : "/dashboard";
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
    if (!identityAddress || !owner) {
      setSavedTier("Explorer");
      return;
    }

    const controller = new AbortController();

    resolveIdentity({
      owner,
      signal: controller.signal
    })
      .then((data) => {
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
  }, [identityAddress, owner]);

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
    navigate("/");
  };

  if (!identityAddress && isJoinRoute) return null;

  return (
    <div className="fixed top-4 right-3 sm:top-6 sm:right-4 md:right-[9.5rem] lg:right-[11rem] z-[60] flex max-w-[calc(100vw-0.75rem)] sm:max-w-none items-center justify-end gap-1.5 sm:gap-2">
      {identityAddress ? (
        <div ref={identityMenuRef} className="relative flex items-center gap-1.5 sm:gap-2">
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
        <Link
          to={isGreek ? "/join-gr" : "/join"}
          className="inline-flex rounded-full border border-white/20 bg-gradient-to-r from-pink-500/70 to-blue-500/70 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 cursor-pointer transition-all duration-200 hover:scale-105 hover:from-pink-500/80 hover:to-blue-500/80 hover:shadow-xl hover:shadow-indigo-500/40 hover:border-white/40"
        >
          {isGreek ? "Σύνδεση" : "Join"}
        </Link>
      )}
    </div>
  );
}
