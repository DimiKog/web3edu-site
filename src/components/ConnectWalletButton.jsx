import React from "react";

const baseClass =
  "inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r " +
  "from-violet-600 via-indigo-600 to-cyan-600 px-4 py-2 text-sm font-semibold " +
  "text-white shadow-lg shadow-indigo-900/20 ring-1 ring-white/30 " +
  "transition duration-200 hover:brightness-110 hover:shadow-indigo-600/35 " +
  "hover:ring-white/45 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none " +
  "dark:ring-white/20 dark:hover:ring-white/35";

/**
 * @param {{ isGr?: boolean, isPending?: boolean, onClick: () => void, className?: string }}
 */
export default function ConnectWalletButton({
  isGr = false,
  isPending = false,
  onClick,
  className = "",
}) {
  const label = isPending
    ? isGr
      ? "Σύνδεση…"
      : "Connecting…"
    : isGr
      ? "Είσοδος με wallet"
      : "Wallet Sign in";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={[baseClass, className].filter(Boolean).join(" ")}
    >
      <span
        className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 shadow-inner ring-1 ring-white/25 sm:flex"
        aria-hidden
      >
        <svg
          className="h-4 w-4 opacity-95"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h10" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12h.01" />
        </svg>
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
