import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import {
  AddressIdenticon,
  generateAvatarStyle,
  shortAddress,
} from "../components/identity-ui.jsx";

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

export default function Web3RouteControls() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const currentPath = location.pathname || "/";
  const isGreek = currentPath.includes("-gr") || currentPath === "/gr";
  const isJoinRoute = currentPath.startsWith("/join");
  const dashboardPath = isGreek ? "/dashboard-gr" : "/dashboard";

  const savedTier = useMemo(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("web3edu-tier") || "Explorer"
        : "Explorer",
    []
  );

  if (!isConnected && isJoinRoute) return null;

  return (
    <div className="fixed top-4 right-3 sm:top-6 sm:right-4 md:right-[9.5rem] lg:right-[11rem] z-[60] flex max-w-[calc(100vw-0.75rem)] sm:max-w-none items-center justify-end gap-1.5 sm:gap-2">
      {isConnected && address ? (
        <>
          <button
            onClick={() => navigate(dashboardPath)}
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
              style={generateAvatarStyle(address, savedTier)}
            >
              <AddressIdenticon address={address} />
            </span>
            <span className="hidden text-xs font-mono sm:inline">
              {shortAddress(address)}
            </span>
          </button>
          <button
            onClick={() => disconnect()}
            className="rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-50 cursor-pointer transition-all duration-200 hover:bg-red-500/40 hover:scale-105 hover:border-red-400/50 hover:shadow-lg"
          >
            {isGreek ? "Αποσύνδεση" : "Disconnect"}
          </button>
          {isAdminWallet(address) ? (
            <Link
              to="/admin"
              className="rounded-full border border-red-400/40 bg-red-500/25 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:bg-red-500/50 hover:scale-105 hover:border-red-400/60 hover:shadow-lg"
            >
              {isGreek ? "Διαχείριση" : "Admin"}
            </Link>
          ) : null}
        </>
      ) : (
        <Link
          to={isGreek ? "/join-gr" : "/join"}
          className="hidden lg:inline-flex rounded-full border border-white/20 bg-gradient-to-r from-pink-500/70 to-blue-500/70 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 cursor-pointer transition-all duration-200 hover:scale-105 hover:from-pink-500/80 hover:to-blue-500/80 hover:shadow-xl hover:shadow-indigo-500/40 hover:border-white/40"
        >
          {isGreek ? "Σύνδεση" : "Join"}
        </Link>
      )}
    </div>
  );
}
