/**
 * Shared attempt-stability helpers for LM assessment panels.
 * Presentation / UX only — no grading authority.
 */

/**
 * Whether an incomplete challenge load should initialize answers + option shuffle.
 * Silent token renewal / background refetch must pass attemptSeeded=true and skip.
 *
 * @param {boolean} attemptSeeded
 * @returns {boolean}
 */
export function shouldSeedIncompleteAttempt(attemptSeeded) {
  return !attemptSeeded;
}

/**
 * Apply incomplete-attempt seeding when appropriate.
 * @template T
 * @param {{
 *   attemptSeeded: boolean,
 *   questions: T[],
 *   emptyAnswers: (questions: T[]) => Record<string, string|string[]>,
 *   buildOptionOrders: (questions: T[]) => Record<string, string[]>,
 * }} args
 * @returns {{
 *   seeded: boolean,
 *   answers?: Record<string, string|string[]>,
 *   optionOrders?: Record<string, string[]>,
 * }}
 */
export function seedIncompleteAttemptIfNeeded({
  attemptSeeded,
  questions,
  emptyAnswers,
  buildOptionOrders,
}) {
  if (!shouldSeedIncompleteAttempt(attemptSeeded)) {
    return { seeded: false };
  }
  return {
    seeded: true,
    answers: emptyAnswers(questions),
    optionOrders: buildOptionOrders(questions),
  };
}

/** Native radio/checkbox replacement: hollow unselected, accent selected (light + dark). */
export function assessmentChoiceInputClassName(inputType) {
  const shape =
    inputType === "checkbox" ? "rounded-[0.25rem]" : "rounded-full";
  return [
    "mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-none border-2 bg-white",
    shape,
    "border-slate-400 text-cyan-700",
    "checked:border-cyan-700 checked:bg-cyan-700",
    "dark:border-slate-400 dark:bg-slate-950",
    "dark:checked:border-cyan-400 dark:checked:bg-cyan-400",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600",
  ].join(" ");
}
