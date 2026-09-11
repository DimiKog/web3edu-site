/**
 * Compact Slice 1 greeting — not a chapter hero.
 */
export default function DashboardLearnerGreeting({ greeting }) {
  if (!greeting) return null;
  return (
    <header className="px-0.5">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {greeting}
      </h1>
    </header>
  );
}
