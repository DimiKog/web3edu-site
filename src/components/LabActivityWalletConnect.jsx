import { useInjectedWalletConnect } from "../hooks/useInjectedWalletConnect.js";

/**
 * In-lab wallet connect for learning activities (signing, voting, etc.).
 * Uses injected wagmi connect only — not Web3Edu sign-in or identity switching.
 *
 * @param {{ prompt: string, isGr?: boolean, className?: string }}
 */
export default function LabActivityWalletConnect({
  prompt,
  isGr = false,
  className = "",
}) {
  const { connectInjected, isPending } = useInjectedWalletConnect();

  const buttonLabel = isPending
    ? isGr
      ? "Σύνδεση…"
      : "Connecting…"
    : isGr
      ? "Σύνδεση πορτοφολιού"
      : "Connect Wallet";

  return (
    <div
      className={[
        "rounded-lg border border-indigo-200 dark:border-indigo-700",
        "bg-indigo-50 dark:bg-indigo-900/20 p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">{prompt}</p>
      <button
        type="button"
        onClick={() => void connectInjected()}
        disabled={isPending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
