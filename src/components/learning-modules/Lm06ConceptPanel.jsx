import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  getLm06ChapterCopy,
  LM06_EDUCATIONAL_LEDGER_HREF,
  LM06_POS_SIMULATOR_HREF,
  LM06_POW_SIMULATOR_HREF,
} from "../../content/lm06ChapterLocale.js";
import {
  LM01_KALLIPOS_TEXTBOOK_URL,
  LM06_VISUALS,
} from "../../content/lmRegistry.js";
import { LmApprovedVisual } from "./LmVisuals.jsx";

/**
 * LM06 Interactive Chapter — dense conceptual journey (5 movements).
 * Presentation only. Does not touch evidence, XP, or ledger state.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm06ConceptPanel({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm06ChapterCopy(locale);
  const powHref = LM06_POW_SIMULATOR_HREF[locale];
  const posHref = LM06_POS_SIMULATOR_HREF[locale];
  const ledgerHref = LM06_EDUCATIONAL_LEDGER_HREF[locale];

  return (
    <div
      className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5"
      data-lm06-concept-panel="true"
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
        {copy.lm05Bridge}
      </p>

      <div data-lm06-spine="true">
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
        data-lm06-required-reading="true"
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
        data-lm06-why-consensus="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.why.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.why.body}
        </p>
        <div className="mx-auto w-full max-w-xl" data-lm06-why-visual="true">
          <LmApprovedVisual
            src={LM06_VISUALS.whyConsensus}
            alt={copy.why.imageAlt}
            className="mx-auto h-auto w-full max-h-64 sm:max-h-72"
          />
        </div>
      </section>

      <section className="space-y-3" data-lm06-approaches="true">
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.approaches.heading}
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <ApproachCard
            dataAttr="pow"
            card={copy.approaches.pow}
            href={powHref}
            tone="amber"
          />
          <ApproachCard
            dataAttr="pos"
            card={copy.approaches.pos}
            href={posHref}
            tone="emerald"
          />
        </div>
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          {copy.approaches.caveat}
        </p>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-violet-200/70 bg-violet-50/50 px-4 py-4 dark:border-violet-500/25 dark:bg-violet-950/20"
        data-lm06-known-validators="true"
        data-lm06-permissioned="true"
        data-lm06-qbft="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.knownValidators.heading}
        </h4>
        <p
          className="rounded-lg border border-violet-300/50 bg-white/70 px-3 py-2 text-sm font-bold text-violet-950 dark:border-violet-400/30 dark:bg-slate-950/40 dark:text-violet-50"
          data-lm06-permissioned-bridge="true"
        >
          {copy.knownValidators.bridgeQuestion}
        </p>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.knownValidators.body}
        </p>
        <div className="mx-auto w-full max-w-xl" data-lm06-qbft-visual="true">
          <LmApprovedVisual
            src={LM06_VISUALS.qbftKnownValidators}
            alt={copy.knownValidators.imageAlt}
            className="mx-auto h-auto w-full max-h-72 sm:max-h-80"
          />
        </div>
        <p
          className="rounded-xl border-2 border-violet-400/50 bg-white px-4 py-2.5 text-center text-sm font-extrabold text-violet-950 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-50"
          data-lm06-proposer-not-alone="true"
        >
          {copy.knownValidators.keyStatement}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {copy.knownValidators.scopeNote}
        </p>
        <p
          className="text-xs text-slate-500 dark:text-slate-400"
          data-lm06-qbft-not-in-textbook="true"
        >
          {copy.knownValidators.qbftNotInTextbook}
        </p>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-emerald-300/70 bg-emerald-50/70 px-4 py-4 dark:border-emerald-500/30 dark:bg-emerald-950/25"
        data-lm06-your-turn="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.yourTurn.heading}
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          {copy.yourTurn.body}
        </p>
        <Link
          to={ledgerHref}
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          data-lm06-ledger-cta="true"
        >
          {copy.yourTurn.cta}
        </Link>
      </section>

      <section
        className="space-y-3 rounded-2xl border border-slate-300/80 bg-gradient-to-br from-slate-100 via-white to-violet-50 px-4 py-4 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/40"
        data-lm06-takeaway="true"
      >
        <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.takeaway.heading}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
          {copy.takeaway.inequalities.map((label, i) => (
            <span key={label} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span
                  className="text-violet-500 dark:text-violet-300"
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

function ApproachCard({ dataAttr, card, href, tone }) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-950/20"
      : "border-amber-200/80 bg-amber-50/60 dark:border-amber-500/25 dark:bg-amber-950/20";
  return (
    <article
      className={`flex h-full flex-col gap-2.5 rounded-2xl border px-3.5 py-3.5 ${toneClass}`}
      data-lm06-mechanism={dataAttr}
    >
      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
        {card.title}
      </h5>
      <ul className="space-y-1 text-xs font-medium leading-5 text-slate-700 dark:text-slate-200">
        {card.points.map((point) => (
          <li key={point}>• {point}</li>
        ))}
      </ul>
      <p className="flex-1 text-sm leading-5 text-slate-700 dark:text-slate-200">
        {card.body}
      </p>
      <Link
        to={href}
        className="text-sm font-semibold text-slate-900 underline-offset-2 hover:underline dark:text-white"
        data-lm06-simulator-cta={dataAttr}
      >
        {card.cta}
      </Link>
    </article>
  );
}
