import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  getLm07ChapterCopy,
  LM07_EXECUTION_TRACE_HREF,
} from "../../content/lm07ChapterLocale.js";
import {
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM07_VISUALS,
} from "../../content/lmRegistry.js";
import { LmApprovedVisual } from "./LmVisuals.jsx";

/**
 * LM07 Interactive Chapter — dense conceptual journey (5 sections + takeaway).
 * Presentation only. Does not touch evidence, XP, or ledger state.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm07ConceptPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm07ChapterCopy(locale);
  const traceHref = LM07_EXECUTION_TRACE_HREF[locale];

  return (
    <div
      className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5"
      data-lm07-concept-panel="true"
    >
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

      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
        {copy.lm06Bridge}
      </p>

      <div data-lm07-spine="true">
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

      <aside
        className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3 py-2.5 dark:border-amber-500/25 dark:bg-amber-950/20"
        data-lm07-required-reading="true"
      >
        <p className="min-w-0 flex-1 text-sm leading-5 text-amber-950 dark:text-amber-50">
          {copy.readingCallout}
        </p>
        {LM01_KALLIPOS_TEXTBOOK_URL ? (
          <a
            href={LM01_KALLIPOS_TEXTBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-900 underline-offset-2 hover:underline dark:text-amber-100"
          >
            {copy.readingOpenCta}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        ) : null}
      </aside>

      <section
        className="space-y-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40"
        data-lm07-code-state="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.codeState.heading}
        </h4>
        <p
          className="rounded-xl border-2 border-cyan-400/50 bg-cyan-50/80 px-4 py-2.5 text-center text-sm font-extrabold text-cyan-950 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-50"
          data-lm07-code-state-key="true"
        >
          {copy.codeState.keyStatement}
        </p>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.codeState.body}
        </p>
        <ul className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.codeState.points.map((point) => (
            <li key={point}>• {point}</li>
          ))}
        </ul>
        <div className="mx-auto w-full max-w-xl" data-lm07-code-state-visual="true">
          <LmApprovedVisual
            src={LM07_VISUALS.codeState}
            alt={copy.codeState.imageAlt}
            className="mx-auto h-auto w-full max-h-64 sm:max-h-72"
          />
        </div>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-violet-200/70 bg-violet-50/50 px-4 py-4 dark:border-violet-500/25 dark:bg-violet-950/20"
        data-lm07-execution="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.execution.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.execution.body}
        </p>
        <div className="mx-auto w-full max-w-xl" data-lm07-execution-visual="true">
          <LmApprovedVisual
            src={LM07_VISUALS.executionFlow}
            alt={copy.execution.imageAlt}
            className="mx-auto h-auto w-full max-h-72 sm:max-h-80"
          />
        </div>
        <p
          className="rounded-xl border-2 border-violet-400/50 bg-white px-4 py-2.5 text-center text-sm font-extrabold text-violet-950 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-50"
          data-lm07-execution-key="true"
        >
          {copy.execution.keyStatement}
        </p>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40"
        data-lm07-read-write="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.readWrite.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.readWrite.body}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-sky-200/80 bg-sky-50/60 px-3.5 py-3.5 dark:border-sky-500/25 dark:bg-sky-950/20">
            <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {copy.readWrite.read.title}
            </h5>
            <ul className="mt-2 space-y-1 text-xs font-medium leading-5 text-slate-700 dark:text-slate-200">
              {copy.readWrite.read.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-3.5 dark:border-amber-500/25 dark:bg-amber-950/20">
            <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {copy.readWrite.write.title}
            </h5>
            <ul className="mt-2 space-y-1 text-xs font-medium leading-5 text-slate-700 dark:text-slate-200">
              {copy.readWrite.write.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="mx-auto w-full max-w-xl" data-lm07-read-write-visual="true">
          <LmApprovedVisual
            src={LM07_VISUALS.readWrite}
            alt={copy.readWrite.imageAlt}
            className="mx-auto h-auto w-full max-h-64 sm:max-h-72"
          />
        </div>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40"
        data-lm07-constraints="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.constraints.heading}
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            copy.constraints.determinism,
            copy.constraints.gas,
            copy.constraints.persistence,
            copy.constraints.immutability,
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-3.5 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {card.title}
              </h5>
              <p className="mt-1.5 text-sm leading-5 text-slate-700 dark:text-slate-200">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-4 dark:border-emerald-500/25 dark:bg-emerald-950/20"
        data-lm07-onchain="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.onChain.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.onChain.body}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {copy.onChain.dimensions.map((dim) => (
            <article
              key={dim.title}
              className="rounded-2xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 dark:border-emerald-500/20 dark:bg-slate-950/40"
            >
              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {dim.title}
              </h5>
              <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">
                {dim.body}
              </p>
            </article>
          ))}
        </div>
        <ul className="space-y-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.onChain.examples.map((ex) => (
            <li key={ex.label}>
              <span className="font-semibold text-slate-900 dark:text-white">
                {ex.label}
              </span>
              {" — "}
              {ex.verdict}
            </li>
          ))}
        </ul>
        <p
          className="rounded-xl border-2 border-emerald-400/50 bg-white px-4 py-2.5 text-center text-sm font-extrabold text-emerald-950 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-50"
          data-lm07-onchain-key="true"
        >
          {copy.onChain.keyStatement}
        </p>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-cyan-300/70 bg-cyan-50/70 px-4 py-4 dark:border-cyan-500/30 dark:bg-cyan-950/25"
        data-lm07-your-turn="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.yourTurn.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.yourTurn.body}
        </p>
        <Link
          to={traceHref}
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          data-lm07-trace-cta="true"
        >
          {copy.yourTurn.cta}
        </Link>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-slate-300/80 bg-gradient-to-br from-slate-100 via-white to-cyan-50 px-4 py-4 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40"
        data-lm07-takeaway="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.takeaway.heading}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
          {copy.takeaway.inequalities.map((label, i) => (
            <span key={label} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span
                  className="text-cyan-600 dark:text-cyan-300"
                  aria-hidden="true"
                >
                  ≠
                </span>
              ) : null}
              <span className="rounded-lg border border-slate-300/80 bg-white px-3 py-1.5 dark:border-white/15 dark:bg-white/[0.06]">
                {label}
              </span>
            </span>
          ))}
        </div>
        <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/90 px-4 py-3 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
            {copy.takeaway.resultLead}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {copy.takeaway.resultMid}
          </p>
          <p className="mt-1 text-sm font-extrabold text-emerald-950 dark:text-emerald-50">
            {copy.takeaway.resultEnd}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.takeaway.body}
        </p>
      </section>
    </div>
  );
}
