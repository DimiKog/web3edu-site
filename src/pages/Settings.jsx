import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { useIdentity } from "../context/useIdentity.js";
import { useSocialIdentity } from "../context/SocialIdentityContext.jsx";
import { normalizeEvmAddress } from "../utils/evmAddress.js";
import { readConnectedEoaAddress } from "../utils/aaIdentity.js";
import { exportIdentity } from "../utils/identityExport.js";
import { Cog6ToothIcon, KeyIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Settings({ lang = "en" }) {
    const { smartAccount, hasIdentity, disconnectIdentity, isIdentityReady } = useIdentity();
    const { address, isConnected } = useAccount();
    const { isOidcAuthenticated } = useSocialIdentity();
    const { disconnectAsync } = useDisconnect();
    const navigate = useNavigate();
    const [exportDone, setExportDone] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);

    const isGR = lang === "gr";
    const dashboardPath = isGR ? "/dashboard-gr" : "/dashboard";

    const connectedWalletNorm =
        normalizeEvmAddress(address) ?? normalizeEvmAddress(readConnectedEoaAddress()) ?? null;
    const showDeviceBasedAccessNote = Boolean(
        isIdentityReady &&
            !isOidcAuthenticated &&
            !connectedWalletNorm &&
            (hasIdentity || smartAccount)
    );

    const handleExportKey = () => {
        const key = exportIdentity();
        if (!key) {
            alert(isGR ? "Δεν βρέθηκε ταυτότητα" : "No identity found");
            return;
        }
        navigator.clipboard.writeText(key);
        setExportDone(true);
        setTimeout(() => setExportDone(false), 3000);
    };

    const handleReset = async () => {
        if (isConnected) {
            try { await disconnectAsync(); } catch { /* ignore */ }
        }
        disconnectIdentity();
        navigate("/join");
    };

    return (
        <PageShell>
            <div className="min-h-[70vh] flex flex-col items-center px-6 py-16 text-slate-900 dark:text-slate-100">
                <div className="w-full max-w-xl">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] shadow-md">
                            <Cog6ToothIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                {isGR ? "Ρυθμίσεις" : "Settings"}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isGR ? "Διαχείριση ταυτότητας" : "Identity management"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate(dashboardPath)}
                            className="ml-auto text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            {isGR ? "← Πίνακας" : "← Dashboard"}
                        </button>
                    </div>

                    {/* Identity section */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-700/50 dark:bg-slate-900/40 divide-y divide-slate-200/70 dark:divide-slate-700/50 shadow-sm backdrop-blur-sm">

                        {showDeviceBasedAccessNote ? (
                            <div className="p-5 bg-slate-50/70 dark:bg-slate-950/35">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                    {isGR
                                        ? "Τρέχουσα μέθοδος πρόσβασης: ταυτότητα σε αυτό το πρόγραμμα και τη συσκευή σου"
                                        : "Current access method: device-based identity"}
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {isGR
                                        ? "Μπορείς να συνδέσεις Web3Edu Account ή πορτοφόλι για ευκολότερη είσοδο αργότερα."
                                        : "You can connect a Web3Edu Account or wallet for easier sign-in later."}
                                </p>
                            </div>
                        ) : null}

                        {/* Export private key */}
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/70 bg-slate-50/80 dark:border-slate-600/50 dark:bg-slate-800/60">
                                    <KeyIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {isGR ? "Εξαγωγή ιδιωτικού κλειδιού" : "Export private key"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isGR
                                            ? "Αντιγράφει το ιδιωτικό κλειδί της AA ταυτότητάς σου στο πρόχειρο. Φύλαξέ το με ασφάλεια — όποιος έχει αυτό το κλειδί ελέγχει την ταυτότητά σου."
                                            : "Copies your AA identity private key to the clipboard. Keep it safe — anyone with this key controls your identity."}
                                    </p>
                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            onClick={handleExportKey}
                                            disabled={!hasIdentity && !smartAccount}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300/70 bg-slate-100/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700/80 transition-colors"
                                        >
                                            {exportDone
                                                ? (isGR ? "✓ Αντιγράφηκε!" : "✓ Copied to clipboard!")
                                                : (isGR ? "Αντιγραφή κλειδιού" : "Copy key to clipboard")}
                                        </button>
                                    </div>
                                    {exportDone && (
                                        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
                                            {isGR
                                                ? "⚠ Αποθήκευσέ το σε ασφαλές μέρος. Μην το μοιραστείς με κανέναν."
                                                : "⚠ Store it somewhere safe. Never share it with anyone."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reset device session */}
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50/80 dark:border-amber-700/50 dark:bg-amber-900/30">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {isGR ? "Επαναφορά συνεδρίας συσκευής" : "Reset device session"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isGR
                                            ? "Διαγράφει την αποθηκευμένη ταυτότητα από αυτή τη συσκευή. Χρήσιμο για εναλλαγή ταυτότητας ή εκκαθάριση συνεδρίας. Δεν διαγράφει on-chain δεδομένα."
                                            : "Clears the saved identity from this device. Useful for switching identities or resetting your session. Does not delete on-chain data."}
                                    </p>
                                    <div className="mt-3">
                                        {!resetConfirm ? (
                                            <button
                                                type="button"
                                                onClick={() => setResetConfirm(true)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-amber-300/70 bg-amber-50/90 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100/90 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                                            >
                                                {isGR ? "Επαναφορά ταυτότητας" : "Reset identity"}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                                                    {isGR ? "Σίγουρα; Η συνεδρία θα διαγραφεί." : "Are you sure? This session will be cleared."}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleReset()}
                                                    className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                                                >
                                                    {isGR ? "Ναι, επαναφορά" : "Yes, reset"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setResetConfirm(false)}
                                                    className="rounded-lg border border-slate-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-200 transition-colors"
                                                >
                                                    {isGR ? "Άκυρο" : "Cancel"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
                        {isGR ? "Περισσότερες ρυθμίσεις σύντομα." : "More settings coming soon."}
                    </p>
                </div>
            </div>
        </PageShell>
    );
}
