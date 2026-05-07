import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { loadIdentityState } from "../utils/aaIdentity.js";
import { useIdentity } from "../context/useIdentity.js";
import { tryProvisionMintedWalletIdentityFromOwner } from "../utils/provisionWalletIdentityFromOwner.js";
import { useAuth } from "react-oidc-context";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { saveReturnUrl } from "../auth/oidcConfig.js";
import { useLang } from "../i18n/useLang.js";
import { JOIN_STRINGS, JOIN_ROUTES } from "../i18n/strings/join.js";
import { setViewerMode, VIEWER_MODES } from "../utils/viewerMode.js";

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
    const lang = useLang();
    const t = JOIN_STRINGS[lang];
    const routes = JOIN_ROUTES[lang];
    const [networkOK, setNetworkOK] = useState(true);
    const [loadingNetwork, setLoadingNetwork] = useState(false);
    const [checkingSBT, setCheckingSBT] = useState(false);
    const [hasPersistedAa, setHasPersistedAa] = useState(readHasPersistedAaIdentity);

    const checkNetwork = useCallback(async () => {
        if (!window.ethereum) return;
        setLoadingNetwork(true);
        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            if (chainId.toLowerCase() !== "0x67932") {
                setNetworkOK(false);
                navigate(routes.networkCheck);
                return;
            } else {
                setNetworkOK(true);
            }
        } catch {
            setNetworkOK(false);
        }
        setLoadingNetwork(false);
    }, [navigate, routes.networkCheck]);

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
        // If a wallet is currently connected, avoid auto-forwarding from Join based on a potentially
        // stale persisted identity (common after sign-out). The user should explicitly continue
        // via the wallet flow (restore/mint) or the device flow.
        if (isConnected && !auth?.isAuthenticated) return;
        navigate(p === "/join-gr" ? "/dashboard-gr" : "/dashboard", { replace: true });
    }, [isIdentityReady, location.pathname, navigate, isConnected, auth?.isAuthenticated]);

    const handleLegacyContinue = async () => {
        if (!address) {
            alert(t.alerts.noWallet);
            return;
        }
        setViewerMode(VIEWER_MODES.wallet);
        setCheckingSBT(true);
        try {
            const status = await tryProvisionMintedWalletIdentityFromOwner(address, setIdentity);
            if (status === "minted") {
                navigate(routes.dashboard, { replace: true });
                return;
            }
            if (status === "not_minted") {
                navigate(routes.mint, { replace: true });
                return;
            }
            alert(t.alerts.noIdentity);
        } catch (e) {
            console.error("Wallet continue failed:", e);
            alert(t.alerts.failed);
        } finally {
            setCheckingSBT(false);
        }
    };

    const primaryButtonClassName = "w-full rounded-xl bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#8A57FF]/20 transition hover:brightness-110";
    const secondaryButtonClassName = "w-full rounded-xl border border-slate-300/80 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";
    const optionCardClassName = "relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/65 p-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.10)] backdrop-blur-md ring-1 ring-white/60 transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.06] dark:ring-white/10";

    const showDeviceAaPath = !auth?.isAuthenticated;
    const forceOidcPromptLogin =
        (typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("oidc_prompt") === "login") ||
        import.meta.env.VITE_OIDC_FORCE_PROMPT_LOGIN === "true";

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
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px]
bg-gradient-to-br from-[#C7B6FF]/40 via-[#AEE6FF]/30 to-[#FFC3EB]/40
blur-[120px] rounded-full dark:hidden"></div>

                    <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px]
bg-gradient-to-br from-[#AEE6FF]/30 via-[#FFC3EB]/40 to-[#C7B6FF]/30
blur-[110px] rounded-full dark:hidden"></div>

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

                    <div className="w-full flex flex-col items-center">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            {t.joinTag}
                        </p>
                        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)] relative z-10">
                            {t.pageTitle}
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed relative z-10">
                        {t.pageSubtitle}
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
                                            {t.oidc.heading}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                            {t.oidc.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-1 flex-col justify-end">
                                    {!auth?.isAuthenticated ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setViewerMode(VIEWER_MODES.social);
                                                saveReturnUrl(location.state?.from);
                                                void auth?.signinRedirect?.(
                                                    forceOidcPromptLogin
                                                        ? { extraQueryParams: { prompt: "login" } }
                                                        : undefined
                                                );
                                            }}
                                            className={primaryButtonClassName}
                                        >
                                            {t.oidc.signInBtn}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-xs text-slate-700 dark:border-slate-800/70 dark:bg-slate-950/30 dark:text-slate-200">
                                                {t.oidc.signedIn}
                                                {socialIdentityError ? (
                                                    <div className="mt-1 text-red-600 dark:text-red-300">
                                                        {socialIdentityError}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(routes.dashboard)}
                                                    className={primaryButtonClassName}
                                                >
                                                    {t.oidc.continueBtn}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={socialIdentityLoading}
                                                    onClick={() => void resolveNow()}
                                                    className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                                                >
                                                    {socialIdentityLoading ? t.oidc.loadingLabel : t.oidc.retryBtn}
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
                                            {t.wallet.heading}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                                            {t.wallet.subtitle}
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

                                                    let buttonLabel = t.wallet.connectBtn;
                                                    let buttonAction = openWalletModal;

                                                    if (connected && chain.unsupported) {
                                                        buttonLabel = t.wallet.wrongNetwork;
                                                        buttonAction = openChainModal;
                                                    } else if (connected) {
                                                        buttonLabel = account.displayName
                                                            ? t.wallet.connectedPrefix + account.displayName
                                                            : t.wallet.walletConnected;
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
                                            {t.wallet.checkingNetwork}
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
                                                {checkingSBT ? t.wallet.checkingBtn : t.wallet.continueBtn}
                                            </button>
                                            {checkingSBT ? (
                                                <p className="text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                                                    {t.wallet.verifyingPulse}
                                                </p>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {showDeviceAaPath ? (
                        <div className="mt-8 w-full max-w-[42rem] relative z-10 text-left">
                            <div className="rounded-2xl border border-slate-200/60 bg-white/35 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] ring-1 ring-white/40 dark:ring-white/10">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {hasPersistedAa ? t.returning.heading : t.device.heading}
                                </p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {hasPersistedAa ? t.returning.body : t.device.body}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setViewerMode(VIEWER_MODES.device);
                                        navigate(hasPersistedAa ? routes.dashboard : routes.mint);
                                    }}
                                    className={`mt-4 ${secondaryButtonClassName}`}
                                >
                                    {hasPersistedAa ? t.returning.continueBtn : t.device.continueBtn}
                                </button>

                                {hasPersistedAa ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem("web3edu-aa-owner-private-key");
                                            localStorage.removeItem("web3edu-aa-identity");
                                            clearIdentity();
                                            setHasPersistedAa(false);
                                        }}
                                        className="mt-3 w-full rounded-xl border border-red-200/60 bg-red-50/90 py-2.5 text-xs font-semibold text-red-800 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-100"
                                    >
                                        {t.returning.resetBtn}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>

            </div>
        </PageShell>
    );
}
