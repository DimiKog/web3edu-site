/**
 * Presentation-only choice row / control classes for assessment UX v2.
 * Neutral selection affordance — never implies correctness.
 */

import { assessmentChoiceInputClassName } from "../../../utils/assessmentAttemptStability.js";

export { assessmentChoiceInputClassName };

/**
 * @param {boolean} selected
 * @returns {string}
 */
export function assessmentChoiceRowClassName(selected) {
  const base = [
    "flex cursor-pointer items-start gap-3 rounded-xl border px-2.5 py-2 text-sm leading-6 transition",
    "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan-600",
  ];
  if (selected) {
    return [
      ...base,
      "border-cyan-400/80 bg-cyan-50/90 text-slate-900",
      "dark:border-cyan-400/45 dark:bg-cyan-400/10 dark:text-slate-100",
    ].join(" ");
  }
  return [
    ...base,
    "border-transparent text-slate-700 hover:border-slate-200/80 hover:bg-slate-50",
    "dark:text-slate-200 dark:hover:border-white/10 dark:hover:bg-white/[0.04]",
  ].join(" ");
}
