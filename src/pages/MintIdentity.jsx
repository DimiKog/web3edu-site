import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import PageShell from "../components/PageShell.jsx";
import identityIcon from "../assets/icons/identity-icon.webp";
import {
  buildUserOp,
  submitUserOp,
  getUserOpReceipt,
  resolveIdentity,
} from "../api/aa.js";
import { getOwnerWallet } from "../utils/aaIdentity.js";
import { useIdentity } from "../context/IdentityContext.jsx";

const CONTENT = {
  en: {
    title: "Create Your Web3Edu Identity",
    subtitle:
      "Create your on-chain profile using Account Abstraction — no gas required.",
    stepTitle: "Identity Setup",
    steps: ["Owner Key", "Create Profile", "Welcome"],
    buttonIdle: "Create Profile",
    buttonBusy: "Creating...",
    statusMinting: "Creating your profile…",
    errors: {
      generic: "Profile creation failed.",
      verifyFailed:
        "Could not verify your identity. Check your connection and try again.",
      mintedBuildNotVerified:
        "The mint service says this wallet is already minted, but identity verification did not confirm it, so no on-chain step was run from this page. If that is wrong, try again later or contact support.",
      mintedMismatch:
        "Mint and verify responses do not match (smart account or token). No transaction was sent. Try again or contact support.",
    },
  },
  gr: {
    title: "Δημιούργησε το Web3Edu Identity σου",
    subtitle:
      "Δημιούργησε το on-chain προφίλ σου με Account Abstraction — χωρίς gas.",
    stepTitle: "Ρύθμιση Ταυτότητας",
    steps: ["Owner Key", "Δημιουργία Προφίλ", "Καλωσόρισμα"],
    buttonIdle: "Δημιούργησε Προφίλ",
    buttonBusy: "Δημιουργείται…",
    statusMinting: "Δημιουργία προφίλ…",
    errors: {
      generic: "Η δημιουργία προφίλ απέτυχε.",
      verifyFailed:
        "Δεν ήταν δυνατή η επαλήθευση της ταυτότητας. Έλεγξε τη σύνδεση και δοκίμασε ξανά.",
      mintedBuildNotVerified:
        "Η υπηρεσία mint αναφέρει ότι το πορτοφόλι έχει ήδη mint, αλλά η επαλήθευση ταυτότητας δεν το επιβεβαίωσε — δεν εκτελέστηκε on-chain βήμα από αυτή τη σελίδα. Αν δεν ισχύει, δοκίμασε αργότερα ή επικοινώνησε με υποστήριξη.",
      mintedMismatch:
        "Οι απαντήσεις mint και verify δεν ταιριάζουν (smart account ή token). Δεν στάλθηκε συναλλαγή. Δοκίμασε ξανά ή επικοινώνησε με υποστήριξη.",
    },
  },
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickSmartAccount(payload) {
  if (!payload || typeof payload !== "object") return null;
  return (
    payload.smartAccount ??
    payload.smartAccountAddress ??
    payload.account ??
    payload.tokenHolder ??
    null
  );
}

function pickReceiptTxHash(receipt) {
  const candidates = [
    receipt?.txHash,
    receipt?.transactionHash,
    receipt?.hash,
    receipt?.result?.txHash,
    receipt?.result?.transactionHash,
    receipt?.result?.hash,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.startsWith("0x") && value.length >= 10)
      return value;
  }
  return null;
}

const MINT_STAGE = {
  IDLE: "idle",
  SUBMITTED: "submitted",
  WAITING_INCLUSION: "waiting_inclusion",
  CONFIRMED: "confirmed",
  FAILED: "failed",
};

const RECEIPT_POLL_TIMEOUT_MS = 14_000;

/**
 * Read execution / tx status from bundler + custom API shapes (order: deepest receipt first).
 */
function getReceiptStatusValue(receipt) {
  if (!receipt || typeof receipt !== "object") return undefined;

  const candidates = [
    receipt?.receipt?.receipt?.status,
    receipt.receipt?.status,
    receipt.receipt?.executionStatus,
    receipt.transactionReceipt?.status,
    receipt.transaction_receipt?.status,
    receipt.executionReceipt?.status,
    receipt.execution_receipt?.status,
    receipt.userOpReceipt?.receipt?.status,
    receipt.user_op_receipt?.receipt?.status,
    receipt.result?.receipt?.status,
    receipt.result?.transactionReceipt?.status,
    receipt.result?.transaction_receipt?.status,
    receipt.result?.executionReceipt?.status,
    receipt.result?.status,
    receipt.data?.receipt?.status,
    receipt.data?.status,
    receipt.executionStatus,
    receipt.execution_status,
    receipt.receiptStatus,
    receipt.receipt_status,
    receipt.status,
  ];

  for (const value of candidates) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function normalizeStatusToInt(status) {
  if (status === true) return 1;
  if (status === false) return 0;
  if (typeof status === "bigint") return Number(status);
  if (typeof status === "number" && Number.isFinite(status)) return status;
  if (typeof status === "string") {
    const t = status.trim().toLowerCase();
    if (/^0x[0-9a-f]+$/i.test(t)) {
      const n = Number.parseInt(t, 16);
      return Number.isFinite(n) ? n : NaN;
    }
    if (t === "1" || t === "0") return Number(t);
  }
  return NaN;
}

/** Success only from normalized on-chain-style status (1), not backend booleans. */
function isReceiptSuccess(receipt) {
  const raw = getReceiptStatusValue(receipt);
  const n = normalizeStatusToInt(raw);
  if (n === 1) return true;
  return false;
}

/** Failure only from explicit on-chain-style failure (0). */
function isReceiptFailure(receipt) {
  const raw = getReceiptStatusValue(receipt);
  const n = normalizeStatusToInt(raw);
  if (n === 0) return true;
  return false;
}

export default function MintIdentity({ lang = "en" }) {
  const t = useMemo(() => CONTENT[lang] || CONTENT.en, [lang]);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { setIdentity } = useIdentity();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStage, setMintStage] = useState(MINT_STAGE.IDLE);
  const [error, setError] = useState(null);
  const [resolvedDebug, setResolvedDebug] = useState(null);
  const [longWait, setLongWait] = useState(false);

  const stageLabels = useMemo(
    () =>
      lang === "gr"
        ? {
            waiting: "Αναμονή για inclusion",
            confirmed: "Επιβεβαιώθηκε on-chain",
          }
        : {
            waiting: "Waiting for inclusion",
            confirmed: "Confirmed on-chain",
          },
    [lang]
  );

  const activeStageLabel =
    mintStage === MINT_STAGE.CONFIRMED
      ? stageLabels.confirmed
      : stageLabels.waiting;

  const handleCreateProfile = async () => {
    try {
      setError(null);
      setResolvedDebug(null);
      setLongWait(false);
      setIsMinting(true);
      setMintStage(MINT_STAGE.IDLE);

      let owner;
      let messageSigner;

      if (isConnected && address) {
        if (!window?.ethereum) {
          throw new Error(
            lang === "gr"
              ? "Δεν βρέθηκε πάροχος πορτοφολιού (window.ethereum)."
              : "No injected wallet (window.ethereum) available to sign."
          );
        }
        owner = ethers.getAddress(address);
        const provider = new ethers.BrowserProvider(window.ethereum);
        messageSigner = await provider.getSigner();
      } else {
        const ownerWallet = getOwnerWallet();
        owner = ownerWallet.address;
        messageSigner = ownerWallet;
      }

      const build = await buildUserOp({ owner });
      const userOp = build?.userOp;
      const userOpHash = build?.userOpHash;
      const hasMintUserOp =
        userOp &&
        typeof userOp === "object" &&
        typeof userOpHash === "string" &&
        userOpHash.startsWith("0x");

      setResolvedDebug({
        owner,
        alreadyMinted: Boolean(build?.alreadyMinted),
        version: build?.version ?? build?.identityVersion ?? null,
        smartAccount:
          build?.smartAccount ??
          build?.smartAccountAddress ??
          build?.account ??
          null,
        tokenId: build?.tokenId ?? build?.token_id ?? null,
        userOpHash: build?.userOpHash ?? null,
        deployed: build?.deployed ?? build?.isDeployed ?? null,
      });

      // Skip submit only when there is nothing to sign. If the API sets
      // alreadyMinted but still returns a UserOp, we must run the chain flow.
      if (build?.alreadyMinted === true && !hasMintUserOp) {
        let verified;
        try {
          verified = await resolveIdentity({ owner: build.owner ?? owner });
        } catch {
          throw new Error(t.errors.verifyFailed);
        }

        if (verified?.alreadyMinted !== true) {
          throw new Error(t.errors.mintedBuildNotVerified);
        }

        const buildSmart = pickSmartAccount(build);
        const resolvedSmart = pickSmartAccount(verified);
        if (
          typeof buildSmart === "string" &&
          typeof resolvedSmart === "string" &&
          buildSmart.toLowerCase() !== resolvedSmart.toLowerCase()
        ) {
          throw new Error(t.errors.mintedMismatch);
        }

        const buildTid = build?.tokenId ?? build?.token_id;
        const verTid = verified?.tokenId ?? verified?.token_id;
        if (
          buildTid != null &&
          verTid != null &&
          Number(buildTid) !== Number(verTid)
        ) {
          throw new Error(t.errors.mintedMismatch);
        }

        const smartAccount = buildSmart ?? resolvedSmart;
        setResolvedDebug((prev) =>
          prev
            ? {
                ...prev,
                resolveVerified: true,
                resolvedTokenId: verTid ?? buildTid ?? null,
              }
            : prev
        );
        setIdentity({
          owner: build.owner ?? owner,
          smartAccount,
          hasIdentity: true,
          version: verified?.version ?? build?.version ?? "aa",
          tokenId: verTid ?? buildTid ?? null,
          alreadyMinted: true,
        });
        setMintStage(MINT_STAGE.CONFIRMED);
        setIsMinting(false);
        const dash = lang === "gr" ? "/dashboard-gr" : "/dashboard";
        await new Promise((r) => setTimeout(r, 50));
        navigate(dash);
        return;
      }

      if (!hasMintUserOp) {
        throw new Error(build?.error || "Missing userOp or userOpHash from build");
      }

      const signature = await messageSigner.signMessage(ethers.getBytes(userOpHash));
      const signedUserOp = { ...userOp, signature };

      const submitted = await submitUserOp({ userOp: signedUserOp });
      const submittedHash =
        submitted?.userOpHash ??
        submitted?.hash ??
        submitted?.userOpHashSubmitted ??
        userOpHash;
      setMintStage(MINT_STAGE.WAITING_INCLUSION);
      setResolvedDebug((prev) =>
        prev
          ? {
              ...prev,
              userOpHash: submittedHash,
              submittedAt: new Date().toISOString(),
            }
          : prev
      );

      const started = Date.now();
      let lastReceipt = null;
      let delay = 800;
      let didSucceed = false;
      const timeoutMs = 180_000;
      let longWaitShown = false;

      while (Date.now() - started < timeoutMs) {
        if (Date.now() - started > 30000 && !longWaitShown) {
          longWaitShown = true;
          setLongWait(true);
        }

        let polled = null;
        const controller = new AbortController();
        const pollTimer = setTimeout(() => controller.abort(), RECEIPT_POLL_TIMEOUT_MS);
        try {
          polled = await getUserOpReceipt({
            hash: submittedHash,
            signal: controller.signal,
          });
        } catch {
          // not ready, network blip, or poll timeout — keep polling
        } finally {
          clearTimeout(pollTimer);
        }

        if (polled != null) {
          lastReceipt = polled;
        }

        setResolvedDebug((prev) =>
          prev
            ? {
                ...prev,
                lastReceiptCheckAt: new Date().toISOString(),
              }
            : prev
        );

        if (!lastReceipt) {
          setMintStage(MINT_STAGE.WAITING_INCLUSION);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        const receipt = lastReceipt;
        setMintStage(MINT_STAGE.WAITING_INCLUSION);

        const txHash = pickReceiptTxHash(receipt);
        if (txHash) {
          setResolvedDebug((prev) =>
            prev
              ? {
                  ...prev,
                  txHash,
                  receiptSeenAt: prev.receiptSeenAt ?? new Date().toISOString(),
                }
              : prev
          );
        }

        if (isReceiptSuccess(receipt)) {
          didSucceed = true;
          setMintStage(MINT_STAGE.CONFIRMED);
          setIsMinting(false);
          break;
        }

        if (isReceiptFailure(receipt)) {
          setMintStage(MINT_STAGE.FAILED);
          const reason =
            receipt?.reason ??
            receipt?.error ??
            receipt?.result?.reason ??
            receipt?.result?.error ??
            "UserOp execution failed";
          throw new Error(reason);
        }

        await sleep(delay);
        delay = Math.min(Math.round(delay * 1.5), 4000);
      }

      if (!didSucceed) {
        setMintStage(MINT_STAGE.FAILED);
        setIsMinting(false);
        throw new Error("Timed out waiting for receipt");
      }

      const smartAccount =
        lastReceipt?.smartAccount ??
        lastReceipt?.smartAccountAddress ??
        build.smartAccount ??
        build.smartAccountAddress ??
        build.account ??
        null;
      const resolved = await resolveIdentity({ owner });
      const resolvedTokenId =
        resolved?.tokenId ?? resolved?.token_id ?? null;
      setIdentity({
        owner: build.owner ?? owner,
        smartAccount,
        hasIdentity: true,
        version: "aa",
        tokenId: resolvedTokenId,
        alreadyMinted: true,
      });

      setMintStage(MINT_STAGE.CONFIRMED);
      setIsMinting(false);

      const txHash = pickReceiptTxHash(lastReceipt);
      const welcomePath = lang === "gr" ? "/welcome-gr" : "/welcome";
      const nextPath = txHash ? `${welcomePath}?tx=${encodeURIComponent(txHash)}` : welcomePath;
      await new Promise((r) => setTimeout(r, 50));
      navigate(nextPath);
    } catch (err) {
      console.error(err);
      setLongWait(false);
      setMintStage(MINT_STAGE.FAILED);
      setError(err?.message || t.errors.generic);
      setIsMinting(false);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <PageShell>
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center
px-6 sm:px-8 md:px-10 py-14
bg-gradient-to-br from-white via-slate-100 to-white
dark:from-[#0A0F1A] dark:via-[#120A1E]/90 dark:to-[#0A0F1A]
relative overflow-hidden rounded-3xl transition-colors duration-500"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br 
from-[#8A57FF]/10 via-[#4ACBFF]/8 to-[#FF67D2]/10 
rounded-3xl dark:hidden"
        />

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/4 w-[300px] h-[300px]
bg-gradient-to-br from-[#C7B6FF]/40 via-[#AEE6FF]/30 to-[#FFC3EB]/40
blur-[120px] rounded-full dark:hidden"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px]
bg-gradient-to-br from-[#AEE6FF]/30 via-[#FFC3EB]/40 to-[#C7B6FF]/30
blur-[110px] rounded-full dark:hidden"
          />
          <div className="absolute top-1/3 left-1/4 w-[260px] h-[260px] bg-[#4ACBFF]/20 blur-[110px] rounded-full hidden dark:block" />
          <div className="absolute bottom-1/3 right-1/4 w-[240px] h-[240px] bg-[#8A57FF]/18 blur-[100px] rounded-full hidden dark:block" />
        </div>

        <div className="relative z-20 max-w-xl w-full mb-12 flex flex-col items-center select-none">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">
            {t.stepTitle}
          </h2>
          <div className="w-24 h-1 mb-6 rounded-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/30 to-[#FF67D2]/40" />

          <div className="flex justify-between items-center w-full text-sm font-semibold text-slate-700 dark:text-gray-400">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#8A57FF]/15 via-[#4ACBFF]/10 to-[#FF67D2]/15 border border-[#8A57FF]/20 shadow-sm">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-md">
                1
              </div>
              <span className="text-slate-900 dark:text-white tracking-wide">{t.steps[0]}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-[#8A57FF]/15 via-[#4ACBFF]/10 to-[#FF67D2]/15 border border-[#8A57FF]/20 shadow-sm">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-md">
                2
              </div>
              <span className="text-slate-900 dark:text-white tracking-wide">{t.steps[1]}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-gray-400">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-white/15 text-slate-800 dark:text-white">
                3
              </div>
              <span className="tracking-wide">{t.steps[2]}</span>
            </div>
          </div>

          <div className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent opacity-70" />
        </div>

        <div
          className="relative z-10 max-sm:px-6
bg-white/80 dark:bg-white/5
border border-slate-200/70 dark:border-white/15
shadow-[0_8px_24px_rgba(15,23,42,0.18)]
backdrop-blur-md rounded-3xl px-10 py-12
max-w-3xl w-full flex flex-col items-center animate-[fadeInUp_0.6s_ease-out] transition-colors duration-500"
        >
          <div className="mb-6 relative flex items-center justify-center">
            <div
              className="absolute w-40 h-40 rounded-full border-4 border-[#7F3DF1]/40 blur-[2px]
animate-[pulse_2.8s_ease-in-out_infinite]"
            />
            <div className="absolute w-44 h-44 rounded-full bg-[#33D6FF]/20 blur-[45px]" />
            <img
              src={identityIcon}
              alt="Identity Icon"
              className="w-28 h-28 opacity-95 drop-shadow-[0_0_14px_rgba(255,255,255,0.55)]
animate-[pulse_4s_ease-in-out_infinite]"
              loading="lazy"
            />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-4 mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.40)] relative z-10">
            {t.title}
          </h1>

          <p className="animate-[fadeIn_0.8s_ease-out] mt-3 text-lg text-slate-700 dark:text-white/90 max-w-md leading-relaxed dark:leading-loose tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] relative z-10">
            {t.subtitle}
          </p>

          <p className="animate-[fadeIn_0.8s_ease-out] mt-4 text-sm text-slate-600 dark:text-white/75 max-w-md leading-relaxed dark:leading-loose tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] relative z-10">
            {lang === "gr"
              ? "Το owner key δημιουργείται και παραμένει στον browser σου. Δεν αποστέλλεται ποτέ στο backend."
              : "Your owner key is generated and kept in your browser. It is never sent to the backend."}
          </p>

          <div className="flex items-center gap-2 mt-6 relative z-10">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/25" />
            <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white/90" />
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/25" />
          </div>

          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={handleCreateProfile}
              disabled={isMinting}
              className={`px-6 py-3 rounded-xl
bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
text-white font-semibold shadow-lg shadow-[#8A57FF]/30 tracking-wide
transition-all duration-300
${isMinting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:scale-[1.02]"}`}
            >
              {isMinting ? t.buttonBusy : t.buttonIdle}
            </button>

            {error && <p className="mt-4 text-red-400 text-sm max-w-md">{error}</p>}
          </div>

          {import.meta.env.DEV && resolvedDebug ? (
            <div className="mt-8 w-full max-w-xl rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-left text-xs text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                AA Debug
              </div>
              <div className="grid grid-cols-1 gap-2 font-mono">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">owner</span>
                  <span className="truncate max-w-[60%]">{resolvedDebug.owner ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">smartAccount</span>
                  <span className="truncate max-w-[60%]">{resolvedDebug.smartAccount ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">version</span>
                  <span>{resolvedDebug.version ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">tokenId</span>
                  <span>{resolvedDebug.tokenId ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">alreadyMinted</span>
                  <span>{String(resolvedDebug.alreadyMinted)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">userOpHash</span>
                  <span className="truncate max-w-[60%]">{resolvedDebug.userOpHash ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">txHash</span>
                  <span className="truncate max-w-[60%]">{resolvedDebug.txHash ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">deployed</span>
                  <span>{resolvedDebug.deployed ?? "—"}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isMinting && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center
backdrop-blur-lg bg-black/40 animate-fadeIn"
        >
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-40 h-40 rounded-full border-4 border-[#8A57FF]/40 animate-ping" />
            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-[#8A57FF]/30 via-[#4ACBFF]/25 to-[#FF67D2]/30 blur-2xl" />
            <img src={identityIcon} className="w-28 h-28 relative z-10 animate-pulse" loading="lazy" />
          </div>

          <p className="text-white text-xl font-semibold tracking-wide animate-pulse">
            {activeStageLabel}
          </p>

          {longWait && (
            <p className="mt-3 text-sm text-white/70">
              Still processing… you can safely refresh if needed.
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 text-sm text-white/90">
            {[
              { id: MINT_STAGE.WAITING_INCLUSION, label: stageLabels.waiting },
              { id: MINT_STAGE.CONFIRMED, label: stageLabels.confirmed },
            ].map((step, index) => {
              const isCompleted =
                (step.id === MINT_STAGE.WAITING_INCLUSION &&
                  mintStage === MINT_STAGE.CONFIRMED) ||
                (step.id === MINT_STAGE.CONFIRMED && mintStage === MINT_STAGE.CONFIRMED);
              const isActive = mintStage === step.id;

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                        isCompleted
                          ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                          : isActive
                            ? "border-sky-300 bg-sky-400/20 text-sky-100"
                            : "border-white/25 bg-white/10 text-white/60"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span className={isCompleted || isActive ? "text-white" : "text-white/60"}>
                      {step.label}
                    </span>
                  </div>
                  {index < 1 ? <div className="h-px w-8 bg-white/25" /> : null}
                </div>
              );
            })}
          </div>

          {resolvedDebug?.txHash && (
            <a
              href={`https://blockexplorer.dimikog.org/tx/${resolvedDebug.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-blue-300 underline"
            >
              View transaction
            </a>
          )}
        </div>
      )}
    </PageShell>
  );
}
