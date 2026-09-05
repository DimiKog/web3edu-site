import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import { LmAboutMetaMark, LmStageMark, LmTierMark } from "./LmVisuals.jsx";

const STAGE_TONE = {
  learn: {
    idle: "text-violet-300 dark:text-violet-700",
    open: "text-violet-400 dark:text-violet-400",
    current: "text-violet-600 dark:text-violet-400",
    done: "text-violet-600 dark:text-violet-400",
  },
  explore: {
    idle: "text-sky-300 dark:text-sky-700",
    open: "text-sky-400 dark:text-sky-400",
    current: "text-sky-600 dark:text-sky-400",
    done: "text-sky-600 dark:text-sky-400",
  },
  assess: {
    idle: "text-cyan-300 dark:text-cyan-700",
    open: "text-cyan-400 dark:text-cyan-400",
    current: "text-cyan-600 dark:text-cyan-400",
    done: "text-cyan-600 dark:text-cyan-400",
  },
  complete: {
    idle: "text-teal-300 dark:text-teal-800",
    open: "text-teal-400 dark:text-teal-400",
    current: "text-teal-600 dark:text-teal-400",
    done: "text-teal-600 dark:text-teal-400",
  },
};

const TIER_ROW = {
  explorer: "bg-violet-50/80 dark:bg-violet-500/10",
  builder: "bg-sky-50/80 dark:bg-sky-500/10",
  architect: "bg-cyan-50/80 dark:bg-cyan-500/10",
};

function SidebarCard({ children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_16px_40px_-32px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-white/[0.035] ${className}`}
    >
      {children}
    </section>
  );
}

function ProgressRail({ stages }) {
  return (
    <ol className="flex items-start justify-between gap-1">
      {stages.map((stage, index) => {
        const active = stage.state === "done" || stage.state === "current";
        const open = stage.state === "open";
        const tone = STAGE_TONE[stage.id] || STAGE_TONE.learn;
        const markClass = tone[stage.state] || tone.idle;
        const lit =
          stages[index - 1]?.state === "done" ||
          stages[index - 1]?.state === "current" ||
          stages[index - 1]?.state === "open";
        return (
          <li key={stage.id} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {index > 0 ? (
                <span
                  className={`h-0.5 flex-1 rounded-full ${
                    lit
                      ? "bg-gradient-to-r from-violet-400 to-sky-400 dark:from-violet-400/80 dark:to-sky-400/80"
                      : "bg-violet-200/70 dark:bg-violet-500/25"
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <span className="flex-1" />
              )}
              <LmStageMark stage={stage.id} className={`h-9 w-9 shrink-0 ${markClass}`} />
              {index < stages.length - 1 ? (
                <span
                  className={`h-0.5 flex-1 rounded-full ${
                    active || open
                      ? "bg-gradient-to-r from-sky-400 to-cyan-400 dark:from-sky-400/80 dark:to-cyan-400/80"
                      : "bg-cyan-200/70 dark:bg-cyan-500/25"
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <span className="flex-1" />
              )}
            </div>
            <span
              className={`mt-2 text-center text-[10px] font-bold uppercase tracking-wide ${
                active
                  ? "text-violet-700 dark:text-violet-200"
                  : open
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function EvidenceItem({ item }) {
  const done = Boolean(item.satisfied);
  return (
    <div className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
      ) : (
        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-violet-300 dark:text-violet-500" />
      )}
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
        {item.requirementLabel ? (
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {item.requirementLabel}
          </p>
        ) : null}
        {item.statusLabel ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {item.statusLabel}
          </p>
        ) : null}
        {item.route && item.ctaLabel ? (
          <Link
            to={item.route}
            className="mt-2 inline-flex text-sm font-semibold text-indigo-700 dark:text-indigo-300"
          >
            {item.ctaLabel} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Supporting sidebar — canonical LM evidence/assessment state only.
 * @param {{
 *   view: object,
 *   lang?: "en"|"gr",
 *   loading?: boolean,
 *   loadError?: string|null,
 * }} props
 */
export default function LmProgressSidebar({ view, lang = "en", loading = false, loadError = null }) {
  const copy = getLmPageCopy(lang, view?.moduleId || "LM01");
  const presentation = view.presentation;
  const stages = view.progressStages || [];
  const overall = view.overallPath;
  const signedOut = loadError === "sign_in";
  const evidenceItems = Array.isArray(view.requiredEvidenceItems)
    ? view.requiredEvidenceItems
    : [];
  const nextStep = view.nextRequiredStep;

  let footer = null;
  if (view.complete) {
    footer = (
      <div className="bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100">
        {copy.statusComplete}
      </div>
    );
  } else if (signedOut) {
    footer = (
      <div className="bg-violet-50 px-5 py-3.5 text-sm leading-6 text-violet-950 dark:bg-violet-500/15 dark:text-violet-100">
        {copy.signInRequired}
      </div>
    );
  } else if (!loading) {
    if (nextStep?.kind === "assessment") {
      footer = (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white dark:from-violet-500 dark:to-indigo-500">
          {copy.finishAssessmentCta}
        </div>
      );
    } else if (nextStep?.kind === "evidence") {
      footer = (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white dark:from-violet-500 dark:to-indigo-500">
          {copy.finishNextStepCta}
        </div>
      );
    } else if (nextStep?.kind === "neutral") {
      footer = (
        <div className="bg-slate-100 px-5 py-3.5 text-sm leading-6 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
          {copy.closingNeutralBody}
        </div>
      );
    }
  }

  return (
    <aside className="space-y-5">
      <SidebarCard className="border-violet-200/80 dark:border-violet-500/25">
        <div className="bg-gradient-to-br from-violet-50/90 via-white to-cyan-50/50 p-5 dark:from-violet-500/10 dark:via-transparent dark:to-cyan-500/5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {copy.sidebarProgress}
          </h2>

          {loading ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.loading}
            </p>
          ) : null}

          <div className="mt-5">
            <ProgressRail stages={stages} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            {view.moduleStatusLabel}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {view.moduleId}
            {presentation?.pathKey ? ` · ${copy.pathBadge}` : ""}
          </p>

          <div className="mt-5 rounded-2xl border border-violet-200/70 bg-white/80 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
            <p className="text-[11px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-200">
              {copy.sidebarEvidence}
            </p>
            <div className="mt-3 space-y-4">
              {evidenceItems.length > 0 ? (
                evidenceItems.map((item) => <EvidenceItem key={item.id} item={item} />)
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {view.progressionValid ? copy.statusInProgress : copy.statusUnavailable}
                </p>
              )}
            </div>
          </div>
        </div>

        {footer}
      </SidebarCard>

      <SidebarCard className="border-indigo-100 dark:border-indigo-500/20">
        <div className="p-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {copy.sidebarAbout}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {view.about}
          </p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <LmAboutMetaMark kind="path" className="h-7 w-7" />
                {copy.pathLabel}
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-white">{copy.pathBadge}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                <LmAboutMetaMark kind="type" className="h-7 w-7" />
                {copy.typeLabel}
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-white">
                {copy.moduleTypeLabel || copy.typeFoundational}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                <LmAboutMetaMark kind="mix" className="h-7 w-7" />
                {copy.activityMixLabel}
              </dt>
              <dd className="text-right font-semibold text-slate-900 dark:text-white">
                {copy.activityMixValue}
              </dd>
            </div>
          </dl>
        </div>
      </SidebarCard>

      <SidebarCard className="border-cyan-100 dark:border-cyan-500/20">
        <div className="p-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {copy.sidebarOverall}
          </h2>
          {overall?.currentModule ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {copy.currentModuleLabel}:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {overall.currentModule}
              </span>
            </p>
          ) : null}

          <ol className="relative mt-4 space-y-3">
            {(overall?.tiers || []).map((tier) => {
              const active = tier.state === "earned" || tier.state === "computed";
              const target = tier.state === "target";
              return (
                <li
                  key={tier.key}
                  className={`relative flex items-start gap-3 rounded-2xl px-2.5 py-2 ${
                    TIER_ROW[tier.key] || TIER_ROW.explorer
                  } ${active ? "ring-1 ring-violet-300/70 dark:ring-violet-400/30" : ""}`}
                >
                  <LmTierMark
                    tier={tier.key}
                    active={active || target}
                    className="relative z-10 h-12 w-12 shrink-0"
                  />
                  <div className="min-w-0 pt-1">
                    <p
                      className={`font-bold ${
                        active
                          ? "text-violet-700 dark:text-violet-200"
                          : target
                            ? "text-sky-700 dark:text-sky-200"
                            : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {tier.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {tier.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </SidebarCard>
    </aside>
  );
}
