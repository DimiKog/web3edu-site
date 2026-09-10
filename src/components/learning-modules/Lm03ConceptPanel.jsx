import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { getLm03ChapterCopy } from "../../content/lm03ChapterLocale.js";
import {
  lm03CanvasFeedbackTone,
  resolveLm03CanvasReasoningFeedback,
} from "../../utils/lm03CanvasReasoningView.js";

/**
 * LM03 concept + practice panels for Learning Path disclosure rows.
 * Presentation only — expand/collapse and practice answers never write evidence or progress.
 * @param {{
 *   lang?: "en"|"gr",
 *   panel: "dimensions"|"requirements"|"canvas"|"foodtrace",
 * }} props
 */
export default function Lm03ConceptPanel({ lang = "en", panel }) {
  const copy = getLm03ChapterCopy(lang);

  if (panel === "requirements") {
    return <RequirementsContent copy={copy.requirements} />;
  }
  if (panel === "canvas") {
    return <PlatformComparisonCanvas copy={copy.canvas} />;
  }
  if (panel === "foodtrace") {
    return <FoodTraceContent copy={copy.foodTrace} />;
  }
  return <DimensionsContent copy={copy.dimensions} />;
}

function DimensionsContent({ copy }) {
  return (
    <div className="space-y-3" data-lm03-panel="dimensions">
      <div className="rounded-2xl border border-cyan-200/70 bg-cyan-50/50 p-3 dark:border-cyan-500/25 dark:bg-cyan-950/25">
        <p className="text-xs font-bold text-cyan-950 dark:text-cyan-100">{copy.ruleTitle}</p>
        <p className="mt-1.5 text-xs leading-5 text-slate-700 dark:text-slate-200">{copy.ruleBody}</p>
      </div>

      <div className="grid gap-2 lg:grid-cols-3">
        {(copy.cards || []).map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <p className="text-xs font-bold text-slate-900 dark:text-white">{card.title}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">{card.body}</p>
            <p className="mt-2 border-l-2 border-violet-300/70 pl-2 text-[11px] font-medium leading-4 text-slate-500 dark:border-violet-400/40 dark:text-slate-400">
              {card.example}
            </p>
          </div>
        ))}
      </div>

      <p className="max-w-3xl border-l-2 border-amber-300/80 pl-3 text-xs leading-5 text-slate-600 dark:border-amber-400/40 dark:text-slate-300 sm:text-sm sm:leading-6">
        {copy.distributedNote}
      </p>
    </div>
  );
}

function RequirementsContent({ copy }) {
  return (
    <div className="space-y-3" data-lm03-panel="requirements">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.flowTitle}</p>
        <ol className="mt-2 flex flex-wrap items-center gap-1.5">
          {(copy.flowSteps || []).map((step, index) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                {step}
              </span>
              {index < (copy.flowSteps?.length || 0) - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs font-semibold text-amber-900 dark:text-amber-100">
          {copy.keyLesson}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {copy.characteristicsTitle}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {(copy.characteristics || []).map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          {copy.consensusNote}
        </p>
      </div>
    </div>
  );
}

function PlatformComparisonCanvas({ copy }) {
  const options = Array.isArray(copy.characteristicOptions) ? copy.characteristicOptions : [];
  const verdicts = Array.isArray(copy.verdictOptions) ? copy.verdictOptions : [];
  const [selected, setSelected] = useState(() => new Set());
  const [verdict, setVerdict] = useState("");
  const [why, setWhy] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const toggleCharacteristic = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectVerdict = (id) => {
    setVerdict(id);
    setFeedbackVisible(false);
  };

  const checkReasoning = () => {
    if (!verdict) return;
    setFeedbackVisible(true);
  };

  const reset = () => {
    setSelected(new Set());
    setVerdict("");
    setWhy("");
    setFeedbackVisible(false);
  };

  const feedbackText = feedbackVisible
    ? resolveLm03CanvasReasoningFeedback(copy.reasoningFeedback, verdict)
    : null;
  const feedbackTone = feedbackText ? lm03CanvasFeedbackTone(verdict) : null;

  return (
    <div className="space-y-3" data-lm03-panel="canvas">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-slate-200/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
          {copy.practiceBadge}
        </span>
        <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{copy.intro}</p>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.scenarioTitle}</p>
        <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
          {copy.scenarioBody}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {(copy.scenarioHints || []).map((hint) => (
            <li
              key={hint}
              className="rounded-lg border border-cyan-200/80 bg-cyan-50/70 px-2 py-1 text-[11px] font-semibold text-cyan-950 dark:border-cyan-500/25 dark:bg-cyan-950/30 dark:text-cyan-100"
            >
              {hint}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {copy.characteristicsTitle}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {copy.characteristicsPrompt}
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {options.map((option) => {
            const active = selected.has(option.id);
            return (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => toggleCharacteristic(option.id)}
                  aria-pressed={active}
                  className={`w-full rounded-xl border px-2.5 py-2 text-left text-[11px] font-semibold leading-4 transition ${
                    active
                      ? "border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-400/40 dark:bg-violet-500/15 dark:text-violet-100"
                      : "border-slate-200/80 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-white/20"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.candidateTitle}</p>
        <p className="mt-1 text-xs font-semibold text-indigo-800 dark:text-indigo-200">
          {copy.candidateName}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
          {copy.candidateBody}
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {(copy.candidateTraits || []).map((trait) => (
            <li
              key={trait}
              className="rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
            >
              {trait}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.verdictTitle}</p>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-3" role="radiogroup" aria-label={copy.verdictTitle}>
          {verdicts.map((option) => {
            const active = verdict === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => selectVerdict(option.id)}
                className={`rounded-xl border px-2.5 py-2 text-center text-[11px] font-bold leading-4 transition ${
                  active
                    ? "border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-400/40 dark:bg-cyan-500/15 dark:text-cyan-100"
                    : "border-slate-200/80 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={checkReasoning}
            disabled={!verdict}
            data-lm03-canvas-check
            className="inline-flex items-center rounded-xl border border-slate-300 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/90 dark:text-slate-900 dark:enabled:hover:bg-white"
          >
            {copy.checkReasoningLabel}
          </button>
        </div>

        {feedbackText ? (
          <p
            role="status"
            data-lm03-canvas-feedback={verdict}
            data-lm03-canvas-feedback-tone={feedbackTone}
            className={`mt-3 border-l-2 pl-3 text-xs leading-5 ${
              feedbackTone === "aligned"
                ? "border-cyan-400/80 text-slate-700 dark:border-cyan-400/50 dark:text-slate-200"
                : "border-amber-400/80 text-slate-700 dark:border-amber-400/45 dark:text-slate-200"
            }`}
          >
            {feedbackText}
          </p>
        ) : null}

        <label className="mt-3 block">
          <span className="text-xs font-bold text-slate-900 dark:text-white">{copy.whyTitle}</span>
          <textarea
            value={why}
            onChange={(event) => setWhy(event.target.value)}
            rows={2}
            placeholder={copy.whyPlaceholder}
            className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-800 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400/40 dark:focus:ring-indigo-500/20"
          />
        </label>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          {copy.coaching}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          {copy.resetLabel}
        </button>
      </div>
    </div>
  );
}

function FoodTraceContent({ copy }) {
  return (
    <div className="space-y-3" data-lm03-panel="foodtrace">
      <p className="max-w-3xl border-l-2 border-violet-300/70 pl-3 text-xs leading-5 text-slate-600 dark:border-violet-400/40 dark:text-slate-300 sm:text-sm sm:leading-6">
        {copy.bridge}
      </p>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{copy.promptsTitle}</p>
        <ol className="mt-2 space-y-1.5">
          {(copy.prompts || []).map((prompt, index) => (
            <li
              key={prompt}
              className="flex items-start gap-2 text-xs leading-5 text-slate-700 dark:text-slate-200"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {index + 1}
              </span>
              {prompt}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {copy.validOutcomesTitle}
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
          {(copy.validOutcomes || []).map((outcome) => (
            <li
              key={outcome}
              className="rounded-xl border border-slate-200/80 bg-white px-2.5 py-2 text-center text-[11px] font-bold leading-4 text-slate-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100"
            >
              {outcome}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          {copy.noForceNote}
        </p>
      </div>
    </div>
  );
}
