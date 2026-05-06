import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { loadIdentityState } from "../utils/aaIdentity.js";
import { useIdentity } from "../context/IdentityContext.jsx";
import { tryProvisionMintedWalletIdentityFromOwner } from "../utils/provisionWalletIdentityFromOwner.js";
import { useAuth } from "react-oidc-context";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { saveReturnUrl } from "../auth/oidcConfig.js";

function readHasPersistedAaIdentity() {
    const s = loadIdentityState();
    return Boolean(s?.hasIdentity === true || s?.alreadyMinted === true);
}

export default function Join() {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { clearIdentity, setIdentity, isIdentityReady } = useIdentity();
    const auth = useAuth();
    const { socialIdentityLoading, socialIdentityError, resolveNow } = useSocialIdentity();
    const navigate = useNavigate();
    const location = useLocation();
    const [networkOK, setNetworkOK] = useState(true);
    const [loadingNetwork, setLoadingNetwork] = useState(false);
    const [checkingSBT, setCheckingSBT] = useState(false);
    const [hasPersistedAa, setHasPersistedAa] = useState(readHasPersistedAaIdentity);

    // Check if user is connected to Web3Edu Besu Edu-Net (chainId 424242)
    const checkNetwork = useCallback(async () => {
        if (!window.ethereum) return;
        setLoadingNetwork(true);

        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });

            if (chainId.toLowerCase() !== "0x67932") {
                setNetworkOK(false);
                navigate("/education/network-check");
                return;
            } else {
                setNetworkOK(true);
            }
        } catch {
            setNetworkOK(false);
        }
        setLoadingNetwork(false);
    }, [navigate]);

    useEffect(() => {
        setHasPersistedAa(readHasPersistedAaIdentity());
    }, [isConnected]);

    useEffect(() => {
        if (isConnected) {
            checkNetwork();
        }
    }, [isConnected, checkNetwork]);

    useEffect(() => {
        if (!isIdentityReady) return;
        const p = location.pathname || "";
        if (p !== "/join" && p !== "/join-gr") return;
        navigate(p === "/join-gr" ? "/dashboard-gr" : "/dashboard", { replace: true });
    }, [isIdentityReady, location.pathname, navigate]);

    const handleLegacyContinue = async () => {
        if (!address) {
            alert("Connect your wallet first to check an existing Identity SBT.");
            return;
        }

        setCheckingSBT(true);

        try {
            const status = await tryProvisionMintedWalletIdentityFromOwner(address, setIdentity);
            if (status === "minted") {
                navigate("/dashboard", { replace: true });
                return;
            }
            if (status === "not_minted") {
                navigate("/mint-identity", { replace: true });
                return;
            }
            alert(
                "Could not reach the identity service or no identity was found for this wallet. Try again or start mint."
            );
        } catch (e) {
            console.error("Wallet continue failed:", e);
            alert("Could not verify your wallet identity. Please try again.");
        } finally {
            setCheckingSBT(false);
        }
    };

    const primaryButtonClassName = "w-full rounded-xl bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#8A57FF]/20 transition hover:brightness-110";
    const secondaryButtonClassName = "w-full rounded-xl border border-slate-300/80 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";
    const optionCardClassName = "relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/65 p-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.10)] backdrop-blur-md ring-1 ring-white/60 transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10";

    /** No local AA payload and not OIDC-authenticated → show device-based mint path. */
    const showNewUserDeviceAaPath = !hasPersistedAa && !auth?.isAuthenticated;

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center
px-6 sm:px-8 md:px-10 py-14
bg-gradient-to-br from-white via-slate-100 to-white
dark:from-[#0A0F1A] dark:via-[#120A1E]/90 dark:to-[#0A0F1A]
relative overflow-hidden rounded-3xl transition-colors duration-500">

                <div className="absolute inset-0 bg-gradient-to-br 
from-[#8A57FF]/10 via-[#4ACBFF]/8 to-[#FF67D2]/10 
rounded-3xl dark:hidden"></div>

                <div className="absolute inset-0 pointer-events-none">
                    {/* Light mode glow */}
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px]
bg-gradient-to-br from-[#C7B6FF]/40 via-[#AEE6FF]/30 to-[#FFC3EB]/40
blur-[120px] rounded-full dark:hidden"></div>

                    <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px]
bg-gradient-to-br from-[#AEE6FF]/30 via-[#FFC3EB]/40 to-[#C7B6FF]/30
blur-[110px] rounded-full dark:hidden"></div>

                    {/* Dark mode glow */}
                    <div className="absolute top-1/3 left-1/4 w-[260px] h-[260px] bg-[#4ACBFF]/20 blur-[110px] rounded-full hidden dark:block"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-[240px] h-[240px] bg-[#8A57FF]/18 blur-[100px] rounded-full hidden dark:block"></div>
                </div>

                <div className="relative z-10 max-sm:px-6
bg-transparent
border border-white/40 dark:border-white/10
shadow-[0_18px_60px_rgba(15,23,42,0.10)]
backdrop-blur-xl rounded-[28px] px-6 sm:px-10 py-10 sm:py-12
max-w-4xl w-full flex flex-col items-center animate-[fadeInUp_0.6s_ease-out] transition-colors duration-500
ring-1 ring-slate-900/5 dark:ring-white/10">

                    {hasPersistedAa && !isConnected ? (
                        <div
                            className="mb-8 w-full max-w-[42rem] rounded-2xl border border-emerald-200/75 bg-emerald-50/90 px-5 py-5 text-left shadow-sm ring-1 ring-emerald-500/15
                            dark:border-emerald-500/35 dark:bg-emerald-950/35 dark:ring-emerald-500/20"
                        >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800/90 dark:text-emerald-200/90">
                                Returning on this browser
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                                Continue on this device
                            </p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                                Use your existing Web3Edu identity saved in this browser. You can connect a Web3Edu account
                                or wallet later for easier sign-in.
                            </p>
                            <div className="mt-4 flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className={primaryButtonClassName}
                                >
                                    Continue on this device
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openConnectModal?.()}
                                    className="w-full rounded-xl border border-slate-300/80 bg-white/90 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                                >
                                    Connect a wallet
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.removeItem("web3edu-aa-owner-private-key");
                                        localStorage.removeItem("web3edu-aa-identity");
                                        clearIdentity();
                                        setHasPersistedAa(false);
                                    }}
                                    className="w-full rounded-xl border border-red-200/60 bg-red-50/90 py-2.5 text-xs font-semibold text-red-800 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-100"
                                >
                                    Reset this device session
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <div className="w-full flex flex-col items-center">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Join Web3Edu
                        </p>
                        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)] relative z-10">
                        How do you want to enter Web3Edu?
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed relative z-10">
                        Choose how you want to start. You can switch later.
                    </p>

                    <div className="mt-7 w-full relative z-10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Option 1: Web3Edu account */}
                            <div className={optionCardClassName}>
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] opacity-70" />
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Sign in with Web3Edu
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                            New or returning — sign in with Keycloak.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-1 flex-col justify-end">
                                    {!auth?.isAuthenticated ? (
                                        <button
                                            type="button"
                                            onClick={() => { saveReturnUrl(location.state?.from); void auth?.signinRedirect?.(); }}
                                            className={primaryButtonClassName}
                                        >
                                            Sign in
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-xs text-slate-700 dark:border-slate-800/70 dark:bg-slate-950/30 dark:text-slate-200">
                                            You’re signed in.
                                            {socialIdentityError ? (
                                                <div className="mt-1 text-red-600 dark:text-red-300">
                                                    {socialIdentityError}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/dashboard")}
                                                className={primaryButtonClassName}
                                            >
                                                Continue
                                            </button>
                                            <button
                                                type="button"
                                                disabled={socialIdentityLoading}
                                                onClick={() => void resolveNow()}
                                                className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                                            >
                                                {socialIdentityLoading
                                                    ? "Finishing sign-in…"
                                                    : "Trouble loading your account? Retry"}
                                            </button>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Option 2: Wallet */}
                            <div className={optionCardClassName}>
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4ACBFF] via-[#8A57FF] to-[#FF67D2] opacity-60" />
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8V7a2 2 0 00-2-2H6a2 2 0 00-2 2v1" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 14h2" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Connect a wallet
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                            For wallet-first users.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-1 flex-col justify-end">
                                    <div className="rounded-xl p-[1px] bg-gradient-to-r from-[#8A57FF]/35 via-[#4ACBFF]/30 to-[#FF67D2]/35 shadow-[0_8px_24px_rgba(74,203,255,0.10)]">
                                        <div className="rounded-xl bg-white/80 p-2 dark:bg-white/5">
                                            <ConnectButton.Custom>
                                                {({
                                                    account,
                                                    chain,
                                                    mounted,
                                                    authenticationStatus,
                                                    openAccountModal,
                                                    openChainModal,
                                                    openConnectModal: openWalletModal,
                                                }) => {
                                                    const ready = mounted && authenticationStatus !== "loading";
                                                    const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                                                    let buttonLabel = "Connect Wallet";
                                                    let buttonAction = openWalletModal;

                                                    if (connected && chain.unsupported) {
                                                        buttonLabel = "Wrong network";
                                                        buttonAction = openChainModal;
                                                    } else if (connected) {
                                                        buttonLabel = account.displayName ? `Connected: ${account.displayName}` : "Wallet connected";
                                                        buttonAction = openAccountModal;
                                                    }

                                                    return (
                                                        <button
                                                            type="button"
                                                            onClick={buttonAction}
                                                            className={connected && !chain.unsupported ? secondaryButtonClassName : primaryButtonClassName}
                                                        >
                                                            {buttonLabel}
                                                        </button>
                                                    );
                                                }}
                                            </ConnectButton.Custom>
                                        </div>
                                    </div>

                                    {isConnected && loadingNetwork ? (
                                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                                            Checking network…
                                        </p>
                                    ) : null}

                                    {isConnected && networkOK && !loadingNetwork ? (
                                        <div className="mt-4 space-y-2">
                                            <button
                                                type="button"
                                                onClick={handleLegacyContinue}
                                                disabled={checkingSBT}
                                                className={`w-full rounded-xl border border-slate-300/80 dark:border-white/20
                                            bg-white/90 dark:bg-white/10 text-slate-800 dark:text-white
                                            py-3 text-sm font-semibold shadow-md tracking-wide transition-all duration-300
                                            ${checkingSBT ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:scale-[1.01]"}`}
                                            >
                                                {checkingSBT ? "Checking identity…" : "Continue with connected wallet"}
                                            </button>
                                            {checkingSBT ? (
                                                <p className="text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                                                    Verifying your identity…
                                                </p>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {showNewUserDeviceAaPath ? (
                        <div className="mt-8 w-full max-w-[42rem] relative z-10 text-left">
                            <div className="rounded-2xl border border-slate-200/60 bg-white/35 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] ring-1 ring-white/40 dark:ring-white/10">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Start or continue without a wallet
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Create a device-based identity now. You can connect a Web3Edu account or wallet later
                                    for easier sign-in.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/mint-identity")}
                                    className={`mt-4 ${secondaryButtonClassName}`}
                                >
                                    Continue without a wallet
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

            </div>
        </PageShell>
    );
}
