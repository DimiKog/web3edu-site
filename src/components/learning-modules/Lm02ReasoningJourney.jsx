import { ArrowRight, ShieldCheck, Thermometer } from "lucide-react";
import { getLm02ChapterCopy } from "../../content/lm02ChapterLocale.js";

/**
 * LM02 concept panels for Learning Path disclosure rows.
 * Presentation only — expand/collapse must never write evidence or progress.
 * @param {{ lang?: "en"|"gr", panel: "trust-model"|"architecture-choices" }} props
 */
export default function Lm02ConceptPanel({ lang = "en", panel }) {
  const copy = getLm02ChapterCopy(lang);

  if (panel === "architecture-choices") {
    return <ArchitectureChoicesContent copy={copy} />;
  }
  return <TrustModelContent copy={copy} />;
}

function TrustModelContent({ copy }) {
  return (
    <div className="space-y-3" data-lm02-panel="trust-model">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.authorityTitle}</p>
          <ol className="mt-2 flex flex-wrap items-center gap-1.5">
            {(copy.authorityFlow || []).map((step, index) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                  {step}
                </span>
                {index < (copy.authorityFlow?.length || 0) - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs font-semibold text-amber-900 dark:text-amber-100">
            {copy.authorityQuestion}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-200/70 bg-cyan-50/50 p-3 dark:border-cyan-500/25 dark:bg-cyan-950/25">
          <p className="flex items-center gap-1.5 text-xs font-bold text-cyan-950 dark:text-cyan-100">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {copy.distributionTitle}
          </p>
          <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
            {copy.distributionBody}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.trustTitle}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <MiniTrustCard label={copy.centralizedLabel} steps={copy.centralizedSteps} />
          <MiniTrustCard label={copy.sharedLabel} steps={copy.sharedSteps} />
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy.trustNote}</p>
      </div>
    </div>
  );
}

function ArchitectureChoicesContent({ copy }) {
  const outcomes = Array.isArray(copy.outcomes) ? copy.outcomes : [];
  return (
    <div className="space-y-3" data-lm02-panel="architecture-choices">
      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.tradeoffsTitle}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ChipList items={copy.capabilities} tone="capability" />
            <ChipList items={copy.tradeoffs} tone="tradeoff" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <Thermometer className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
            {copy.integrityTitle}
          </p>
          <ol className="mt-2 flex flex-wrap items-center gap-1.5">
            {(copy.integrityPipeline || []).map((step, index) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                  {step}
                </span>
                {index < (copy.integrityPipeline?.length || 0) - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-2 border-l-2 border-cyan-400/70 pl-2 text-xs font-medium leading-5 text-slate-700 dark:border-cyan-400/40 dark:text-slate-200">
            {copy.integrityTakeaway}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.decideTitle}</p>
        <p className="mt-1 text-xs font-semibold text-cyan-900 dark:text-cyan-100">
          {copy.decideQuestion}
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
          {outcomes.map((outcome) => (
            <li
              key={outcome.id}
              className="rounded-xl border border-slate-200/80 bg-white px-2.5 py-2 text-center text-[11px] font-bold leading-4 text-slate-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100"
            >
              {outcome.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-3xl border-l-2 border-violet-300/70 pl-3 text-xs leading-5 text-slate-600 dark:border-violet-400/40 dark:text-slate-300 sm:text-sm sm:leading-6">
        {copy.foodTraceBridge}
      </p>
    </div>
  );
}

function MiniTrustCard({ label, steps }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <ol className="mt-1.5 space-y-1">
        {(steps || []).map((step, index) => (
          <li key={step} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-100">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-bold text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-300">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChipList({ items, tone }) {
  const styles =
    tone === "capability"
      ? "border-emerald-200/80 bg-emerald-50/70 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-950/25 dark:text-emerald-100"
      : "border-slate-200/80 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200";
  return (
    <ul className="flex flex-wrap gap-1.5">
      {(items || []).map((item) => (
        <li key={item} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
