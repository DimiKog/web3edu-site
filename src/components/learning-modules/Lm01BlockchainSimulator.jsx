import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Link2,
  RotateCcw,
} from "lucide-react";
import { getLm01BlockchainSimulatorCopy } from "../../content/lm01BlockchainSimulatorLocale.js";
import {
  LM01_SIM_STAGES,
  createLm01SimulatorInitialState,
  getLm01FirstBrokenLinkIndex,
  getLm01VisibleChain,
  isLm01ChainIntegrityValid,
  isLm01LinkValid,
  reduceLm01SimulatorState,
  shouldStackLm01ChainVertically,
  shortenLm01Hash,
} from "../../utils/lm01BlockchainSimulator.js";

function stageChipActive(stage, chip) {
  const order = {
    build: [LM01_SIM_STAGES.BUILD_1, LM01_SIM_STAGES.BUILD_2, LM01_SIM_STAGES.BUILD_3],
    link: [LM01_SIM_STAGES.BUILD_2, LM01_SIM_STAGES.BUILD_3],
    tamper: [LM01_SIM_STAGES.TAMPER],
    observe: [LM01_SIM_STAGES.TAMPER, LM01_SIM_STAGES.REPAIR_1],
    repair: [LM01_SIM_STAGES.REPAIR_1, LM01_SIM_STAGES.REPAIR_2, LM01_SIM_STAGES.RESTORED],
    concept: [LM01_SIM_STAGES.CONCEPT, LM01_SIM_STAGES.COMPLETE],
  };
  return (order[chip] || []).includes(stage);
}

function IntegrityBanner({ valid, copy }) {
  if (valid) {
    return (
      <div
        role="status"
        className="flex items-start gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold">{copy.chainValid}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="font-semibold">{copy.chainBroken}</span>
    </div>
  );
}

function HashValue({ value }) {
  return (
    <div
      className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-slate-700 dark:text-slate-200"
      title={value}
    >
      {shortenLm01Hash(value)}
    </div>
  );
}

function BlockCard({
  block,
  copy,
  editable = false,
  onDataChange,
  highlightHash = false,
  highlightPrev = false,
  stacked = false,
}) {
  const isGenesis = block.index === 1;

  return (
    <article
      className={`flex w-full flex-col rounded-2xl border p-4 shadow-sm transition ${
        stacked ? "max-w-xl" : "min-w-[280px] flex-1"
      } ${
        highlightHash || highlightPrev
          ? "border-indigo-300/80 bg-indigo-50/80 dark:border-indigo-400/40 dark:bg-indigo-500/10"
          : "border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {copy.blockLabel(block.index)}
        </h3>
        {isGenesis ? (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
            Genesis
          </span>
        ) : null}
      </div>

      <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {copy.dataLabel}
        {editable ? (
          <textarea
            value={block.data}
            onChange={(e) => onDataChange?.(e.target.value)}
            rows={2}
            className="mt-1.5 w-full resize-y rounded-xl border border-indigo-300/70 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none ring-indigo-400/40 focus:ring-2 dark:border-indigo-400/30 dark:bg-slate-950/60 dark:text-slate-100"
            aria-label={copy.tamperInstruction}
          />
        ) : (
          <span className="mt-1.5 block break-words rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-800 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
            {block.data}
          </span>
        )}
      </label>

      <div className="mt-3 space-y-2 text-xs">
        <div
          className={`rounded-xl border px-3 py-2 ${
            highlightPrev
              ? "border-fuchsia-300/80 bg-fuchsia-50 dark:border-fuchsia-400/30 dark:bg-fuchsia-500/10"
              : "border-slate-200/70 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950/35"
          }`}
        >
          <div className="whitespace-nowrap font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {copy.previousHashLabel}
          </div>
          <HashValue value={block.previousHash} />
          {isGenesis ? (
            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              {copy.zeroHashNote}
            </p>
          ) : null}
        </div>

        <div
          className={`rounded-xl border px-3 py-2 ${
            highlightHash
              ? "border-cyan-300/80 bg-cyan-50 dark:border-cyan-400/30 dark:bg-cyan-500/10"
              : "border-slate-200/70 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950/35"
          }`}
        >
          <div className="whitespace-nowrap font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {copy.hashLabel}
          </div>
          <HashValue value={block.hash} />
        </div>
      </div>
    </article>
  );
}

function LinkConnector({ valid, copy, emphasize = false, vertical = false }) {
  const label = valid ? copy.linkValid : copy.linkBroken;
  const tone = valid
    ? "text-emerald-700 dark:text-emerald-300"
    : "text-amber-800 dark:text-amber-200";
  const border = valid
    ? "border-emerald-300/70 dark:border-emerald-500/30"
    : "border-amber-300/80 dark:border-amber-500/40";

  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-1 ${
        vertical ? "flex-col py-1" : "flex-col px-2 py-2"
      } ${emphasize ? "opacity-100" : "opacity-90"}`}
      aria-label={label}
    >
      {vertical ? (
        <ArrowDown className={`h-5 w-5 ${tone}`} aria-hidden="true" />
      ) : (
        <ArrowRight className={`h-5 w-5 ${tone}`} aria-hidden="true" />
      )}
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${border} ${tone}`}
      >
        <Link2 className="h-3 w-3" aria-hidden="true" />
        {label}
      </span>
      <span className="text-[10px] text-slate-500 dark:text-slate-400">
        {copy.relationshipCaption}
      </span>
    </div>
  );
}

/**
 * Isolated LM01 interactive — no XP, evidence, routing, or backend.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm01BlockchainSimulator({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLm01BlockchainSimulatorCopy(locale);
  const [state, dispatch] = useReducer(
    reduceLm01SimulatorState,
    locale,
    createLm01SimulatorInitialState
  );
  const chainViewportRef = useRef(null);
  const [chainViewportWidth, setChainViewportWidth] = useState(0);

  useEffect(() => {
    const node = chainViewportRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const measure = () => {
      setChainViewportWidth(node.getBoundingClientRect().width);
    };
    measure();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setChainViewportWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = useMemo(
    () => getLm01VisibleChain(state.stage, state.chain),
    [state.stage, state.chain]
  );
  const stackVertically = shouldStackLm01ChainVertically(
    chainViewportWidth,
    visible.length
  );
  const brokenIndex = getLm01FirstBrokenLinkIndex(state.chain);
  const integrityValid = isLm01ChainIntegrityValid(
    state.stage === LM01_SIM_STAGES.BUILD_1 || state.stage === LM01_SIM_STAGES.BUILD_2
      ? visible
      : state.chain
  );
  const showFullIntegrity =
    state.stage !== LM01_SIM_STAGES.BUILD_1 &&
    state.stage !== LM01_SIM_STAGES.BUILD_2;
  const canRepair =
    (state.stage === LM01_SIM_STAGES.TAMPER || state.stage === LM01_SIM_STAGES.REPAIR_1) &&
    brokenIndex >= 1;
  const showMismatchDetail =
    brokenIndex >= 1 &&
    (state.stage === LM01_SIM_STAGES.TAMPER ||
      state.stage === LM01_SIM_STAGES.REPAIR_1 ||
      state.stage === LM01_SIM_STAGES.REPAIR_2);

  const chips = [
    ["build", copy.stageLabels.build],
    ["link", copy.stageLabels.link],
    ["tamper", copy.stageLabels.tamper],
    ["observe", copy.stageLabels.observe],
    ["repair", copy.stageLabels.repair],
    ["concept", copy.stageLabels.concept],
  ];

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/50 p-5 shadow-sm dark:border-white/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-indigo-950/30 sm:p-7">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
          LM01
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {copy.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
          {copy.tagline}
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Experiment stages">
        {chips.map(([id, label]) => {
          const active = stageChipActive(state.stage, id);
          return (
            <span
              key={id}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                active
                  ? "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-400/40 dark:bg-indigo-500/20 dark:text-indigo-100"
                  : "border-slate-200 bg-white/70 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {state.stage === LM01_SIM_STAGES.BUILD_1 ? (
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            {copy.fingerprintExplain}
          </p>
        ) : null}
        {state.stage === LM01_SIM_STAGES.BUILD_2 ? (
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            {copy.linkExplain}
          </p>
        ) : null}
        {state.stage === LM01_SIM_STAGES.TAMPER ? (
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/70 px-4 py-3 text-sm leading-7 text-indigo-950 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-100">
            <p className="font-semibold">{copy.tamperInstruction}</p>
            <p className="mt-1 text-indigo-900/80 dark:text-indigo-100/80">{copy.tamperHint}</p>
          </div>
        ) : null}
        {state.stage === LM01_SIM_STAGES.TAMPER && canRepair ? (
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{copy.repairHint1}</p>
        ) : null}
        {state.stage === LM01_SIM_STAGES.REPAIR_1 ? (
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{copy.repairHint2}</p>
        ) : null}

        {showFullIntegrity ? (
          <IntegrityBanner
            valid={
              state.stage === LM01_SIM_STAGES.RESTORED ||
              state.stage === LM01_SIM_STAGES.CONCEPT ||
              state.stage === LM01_SIM_STAGES.COMPLETE
                ? true
                : integrityValid
            }
            copy={
              state.stage === LM01_SIM_STAGES.RESTORED ||
              state.stage === LM01_SIM_STAGES.CONCEPT ||
              state.stage === LM01_SIM_STAGES.COMPLETE
                ? { ...copy, chainValid: copy.chainRestored }
                : copy
            }
          />
        ) : null}

        {showMismatchDetail ? (
          <div className="rounded-2xl border border-amber-300/70 bg-white/80 px-4 py-3 text-sm dark:border-amber-500/30 dark:bg-slate-950/40">
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              {copy.mismatchTitle}
            </p>
            <p className="mt-1 text-amber-950/90 dark:text-amber-50/90">
              {copy.mismatchDetail(brokenIndex, brokenIndex + 1)}
            </p>
            <div className="mt-3 grid gap-2 font-mono text-[11px] text-slate-700 dark:text-slate-200 sm:grid-cols-2">
              <div className="rounded-xl border border-cyan-200/80 bg-cyan-50/80 px-3 py-2 dark:border-cyan-400/20 dark:bg-cyan-500/10">
                <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
                  {copy.blockLabel(brokenIndex)} · {copy.hashLabel}
                </div>
                <HashValue value={state.chain[brokenIndex - 1]?.hash} />
              </div>
              <div className="rounded-xl border border-fuchsia-200/80 bg-fuchsia-50/80 px-3 py-2 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10">
                <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-fuchsia-800 dark:text-fuchsia-200">
                  {copy.blockLabel(brokenIndex + 1)} · {copy.previousHashLabel}
                </div>
                <HashValue value={state.chain[brokenIndex]?.previousHash} />
              </div>
            </div>
          </div>
        ) : null}

        <div
          ref={chainViewportRef}
          className={
            stackVertically
              ? "flex flex-col items-stretch gap-3"
              : "flex flex-row items-stretch gap-3"
          }
        >
          {visible.map((block, idx) => {
            const prev = visible[idx - 1];
            const linkValid = idx === 0 ? true : isLm01LinkValid(prev, block);
            const emphasizeLink =
              state.stage === LM01_SIM_STAGES.BUILD_2 && idx === 1
                ? true
                : brokenIndex === idx;
            const editable =
              state.stage === LM01_SIM_STAGES.TAMPER && block.index === 1;

            return (
              <div key={block.index} className="contents">
                {idx > 0 ? (
                  <LinkConnector
                    valid={linkValid}
                    copy={copy}
                    emphasize={emphasizeLink}
                    vertical={stackVertically}
                  />
                ) : null}
                <BlockCard
                  block={block}
                  copy={copy}
                  editable={editable}
                  stacked={stackVertically}
                  onDataChange={(value) =>
                    dispatch({ type: "TAMPER_BLOCK_1", data: value })
                  }
                  highlightHash={
                    (state.stage === LM01_SIM_STAGES.BUILD_2 && block.index === 1) ||
                    (brokenIndex >= 1 && block.index === brokenIndex)
                  }
                  highlightPrev={
                    (state.stage === LM01_SIM_STAGES.BUILD_2 && block.index === 2) ||
                    (brokenIndex >= 1 && block.index === brokenIndex + 1)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {state.stage === LM01_SIM_STAGES.BUILD_1 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_BLOCK_2" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {copy.addBlock2}
          </button>
        ) : null}
        {state.stage === LM01_SIM_STAGES.BUILD_2 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "ADD_BLOCK_3" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {copy.addBlock3}
          </button>
        ) : null}
        {state.stage === LM01_SIM_STAGES.BUILD_3 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "TEST_CHAIN" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {copy.testChain}
          </button>
        ) : null}
        {canRepair ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "REPAIR_NEXT" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {copy.repairNext}
          </button>
        ) : null}
      </div>

      {state.stage === LM01_SIM_STAGES.RESTORED ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-emerald-300/60 bg-emerald-50/70 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/10">
          <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
            {copy.restoredExplain}
          </p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
            {copy.consensusBridge}
          </p>
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
            {copy.consensusNote}
          </p>
          <button
            type="button"
            onClick={() => dispatch({ type: "ACK_RESTORED" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
          >
            {copy.continueToConcept}
          </button>
        </div>
      ) : null}

      {state.stage === LM01_SIM_STAGES.CONCEPT ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {copy.conceptTitle}
          </h3>
          <fieldset className="space-y-2">
            <legend className="sr-only">{copy.conceptTitle}</legend>
            {Object.entries(copy.conceptOptions).map(([id, label]) => (
              <label
                key={id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                  state.selectedConceptId === id
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-400/40 dark:bg-indigo-500/15"
                    : "border-slate-200 bg-slate-50/80 hover:border-slate-300 dark:border-white/10 dark:bg-slate-950/30"
                }`}
              >
                <input
                  type="radio"
                  name="lm01-sim-concept"
                  value={id}
                  checked={state.selectedConceptId === id}
                  onChange={() => dispatch({ type: "SELECT_CONCEPT", conceptId: id })}
                  className="mt-1"
                />
                <span className="text-slate-800 dark:text-slate-100">
                  <span className="font-semibold">{id}.</span> {label}
                </span>
              </label>
            ))}
          </fieldset>

          {state.conceptFeedback === "incorrect" ? (
            <div className="rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              <p>{copy.conceptIncorrect}</p>
              <button
                type="button"
                onClick={() => dispatch({ type: "RETRY_CONCEPT" })}
                className="mt-3 inline-flex rounded-lg border border-amber-400/50 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 dark:border-amber-400/30 dark:bg-slate-950/40 dark:text-amber-100"
              >
                {copy.conceptRetry}
              </button>
            </div>
          ) : null}
          {state.conceptFeedback === "empty" ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{copy.conceptEmpty}</p>
          ) : null}

          {state.conceptFeedback !== "incorrect" ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "SUBMIT_CONCEPT" })}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
            >
              {copy.submitConcept}
            </button>
          ) : null}
        </div>
      ) : null}

      {state.stage === LM01_SIM_STAGES.COMPLETE ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-emerald-300/70 bg-emerald-50/80 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            <div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
                {copy.experimentComplete}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {copy.conceptSuccessExplain}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET", lang: locale })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/15 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {copy.runAgain}
          </button>
        </div>
      ) : null}
    </section>
  );
}
