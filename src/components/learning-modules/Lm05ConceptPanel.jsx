import { ArrowRight } from "lucide-react";
import { getLm05ChapterCopy } from "../../content/lm05ChapterLocale.js";

/**
 * Compact LM05 conceptual spine (sections A–D). Presentation only.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm05ConceptPanel({ lang = "en" }) {
  const copy = getLm05ChapterCopy(lang);

  return (
    <div className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
      <div>
        <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {copy.subtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/30 dark:bg-emerald-950/30">
        <p className="text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-100">
          {copy.openingQuestion}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {copy.spineLabel}
        </p>
        <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
          {copy.spineSteps.map((step, index) => (
            <li key={step} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <ArrowRight
                  className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />
              ) : null}
              <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 dark:border-white/10 dark:bg-white/[0.06]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        {copy.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/40"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {section.title}
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-700 dark:text-slate-300">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {section.showStateDiagram ? (
              <StateTransitionDiagram diagram={copy.stateDiagram} />
            ) : null}

            {section.showReadWrite ? (
              <ReadWriteContrast readWrite={copy.readWrite} />
            ) : null}

            {section.bridgeQuestion ? (
              <div className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 dark:border-amber-500/30 dark:bg-amber-950/30">
                <p className="text-sm font-semibold leading-6 text-amber-950 dark:text-amber-100">
                  {section.bridgeQuestion}
                </p>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function StateTransitionDiagram({ diagram }) {
  return (
    <div
      className="mt-3 space-y-2"
      aria-label={`${diagram.s0Title} → ${diagram.txLabel} → ${diagram.execLabel} → ${diagram.s1Title}`}
    >
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
        <StateCard title={diagram.s0Title} lines={[diagram.s0Alice, diagram.s0Bob]} />
        <FlowArrow className="hidden sm:flex" />
        <FlowCard title={diagram.txLabel} detail={diagram.txDetail} tone="indigo" />
        <FlowArrow className="hidden sm:flex" />
        <FlowCard title={diagram.execLabel} detail={diagram.execDetail} tone="cyan" />
        <FlowArrow className="hidden sm:flex" />
        <StateCard title={diagram.s1Title} lines={[diagram.s1Alice, diagram.s1Bob]} />
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:hidden">
        <FlowArrow />
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {diagram.s0Title} → {diagram.txLabel} → {diagram.execLabel} → {diagram.s1Title}
        </span>
      </div>
      <p className="text-[11px] leading-4 text-slate-500 dark:text-slate-400">{diagram.note}</p>
    </div>
  );
}

function StateCard({ title, lines }) {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3 dark:border-emerald-500/25 dark:bg-emerald-950/25">
      <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
        {title}
      </p>
      <ul className="mt-1.5 space-y-1 text-xs leading-4 text-slate-700 dark:text-slate-200">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function FlowCard({ title, detail, tone = "indigo" }) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-200/80 bg-cyan-50/70 dark:border-cyan-500/25 dark:bg-cyan-950/25"
      : "border-indigo-200/80 bg-indigo-50/70 dark:border-indigo-500/25 dark:bg-indigo-950/25";
  const titleClass =
    tone === "cyan"
      ? "text-cyan-800 dark:text-cyan-200"
      : "text-indigo-800 dark:text-indigo-200";

  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <p className={`text-[11px] font-bold uppercase tracking-wide ${titleClass}`}>{title}</p>
      <p className="mt-1.5 text-xs leading-4 text-slate-700 dark:text-slate-200">{detail}</p>
    </div>
  );
}

function FlowArrow({ className = "" }) {
  return (
    <div className={`items-center justify-center text-slate-400 dark:text-slate-500 ${className}`}>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </div>
  );
}

function ReadWriteContrast({ readWrite }) {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/70 p-3 dark:border-sky-500/25 dark:bg-sky-950/25">
        <p className="text-[11px] font-bold uppercase tracking-wide text-sky-800 dark:text-sky-200">
          {readWrite.readTitle}
        </p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-4 text-slate-700 dark:text-slate-200">
          {readWrite.readItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-violet-200/80 bg-violet-50/70 p-3 dark:border-violet-500/25 dark:bg-violet-950/25">
        <p className="text-[11px] font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
          {readWrite.writeTitle}
        </p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-4 text-slate-700 dark:text-slate-200">
          {readWrite.writeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
