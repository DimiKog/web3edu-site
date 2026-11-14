import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Info, Loader2 } from "lucide-react";
import PageShell from "../../components/PageShell.jsx";
import {
  LmApprovedVisual,
  LmTierMark,
} from "../../components/learning-modules/LmVisuals.jsx";
import { formatProgressionTierLabel } from "../../content/continueLearningLocale.js";
import { getLearnLandingCopy } from "../../content/learnLandingLocale.js";
import {
  getLmChapterRoute,
  getLmModulesForPath,
  getLmModuleVisuals,
  getLmRegistryModuleTitle,
  LM_LEARN_PATH_KEYS,
} from "../../content/lmRegistry.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { useResolvedIdentityContext } from "../../hooks/useResolvedIdentityContext.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import {
  isValidCanonicalProgression,
  pickLearnContinueProgression,
  resolveLearnContinueBarPresentation,
  shouldShowLearnContinueSection,
} from "../../utils/learnContinueUi.js";
import { getCanonicalModuleEntry } from "../../utils/lmModuleView.js";
import { fetchLearningModulesProgression } from "../../utils/labWriteApi.js";

/** Max three columns on desktop — Builder naturally wraps as 3+2. */
const PATH_GRID = {
  explorer: "sm:grid-cols-2 lg:grid-cols-3",
  builder: "sm:grid-cols-2 lg:grid-cols-3",
  architect: "sm:grid-cols-1 md:grid-cols-3",
};

const LEARN_HERO_IMAGE = "/images/learn/learning-journey-hero.png";
const LEARN_MODULES_ANCHOR = "learn-modules";

const PATH_ACCENT = {
  explorer: {
    bar: "from-violet-500 to-indigo-500",
  },
  builder: {
    bar: "from-blue-500 to-cyan-500",
  },
  architect: {
    bar: "from-teal-500 to-cyan-400",
  },
};

/** Compact methodology cards — purple / blue / teal Web3Edu palette. */
const VALUE_CARD_STYLES = [
  {
    card: "border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/40 shadow-sm dark:border-violet-500/25 dark:from-violet-950/40 dark:via-slate-900/60 dark:to-slate-900/40",
    iconWrap:
      "bg-gradient-to-br from-[#7A29D6] to-[#9B4DFF] text-white shadow-sm",
  },
  {
    card: "border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-cyan-50/40 shadow-sm dark:border-sky-500/25 dark:from-sky-950/35 dark:via-slate-900/60 dark:to-slate-900/40",
    iconWrap:
      "bg-gradient-to-br from-[#2563EB] to-[#4BD7EC] text-white shadow-sm",
  },
  {
    card: "border-teal-200/70 bg-gradient-to-br from-teal-50 via-white to-emerald-50/30 shadow-sm dark:border-teal-500/25 dark:from-teal-950/35 dark:via-slate-900/60 dark:to-slate-900/40",
    iconWrap:
      "bg-gradient-to-br from-[#0D9488] to-[#2DD4BF] text-white shadow-sm",
  },
];

function navigateHashSafe(path) {
  if (!path) return;
  try {
    if (typeof window !== "undefined") {
      const normalized = String(path).startsWith("/") ? String(path) : `/${path}`;
      window.location.hash = `#${normalized}`;
    }
  } catch {
    /* ignore */
  }
}

function prefersReducedMotion() {
  try {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

function scrollToCurriculum() {
  try {
    const el = document.getElementById(LEARN_MODULES_ANCHOR);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  } catch {
    /* ignore */
  }
}

/** Prefer concise Learn-landing summaries; fall back to registry about. */
function getModuleAbout(mod, locale, copy) {
  const summary = copy?.moduleSummaries?.[mod?.id];
  if (typeof summary === "string" && summary.trim()) return summary.trim();
  const about = mod?.about;
  if (!about || typeof about !== "object") return null;
  const text = about[locale] || about.en;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

function LearnIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 19.5V6.8c0-.4.2-.8.6-1L12 2l7.4 3.8c.4.2.6.6.6 1v12.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4.5 10.5 12 14l7.5-3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PracticeIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 9.5 7 11l1.5 1.5M15.5 9.5 17 11l-1.5 1.5M13.2 8.8l-2.4 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProveIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 3 5.5 5.5v5.2c0 4.1 2.7 7.8 6.5 9.3 3.8-1.5 6.5-5.2 6.5-9.3V5.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const VALUE_ICONS = [LearnIcon, PracticeIcon, ProveIcon];

/**
 * Compact Continue control — presentation only over canonical view-model.
 * Kept as LearnContinueBar for existing presentation contracts.
 */
function LearnContinueBar({ progression, lang, copy }) {
  const presentation = resolveLearnContinueBarPresentation(progression, lang);
  const handleContinue = useCallback((route) => {
    navigateHashSafe(route);
  }, []);

  if (presentation.mode === "invalid") return null;

  if (presentation.mode === "available_complete") {
    return (
      <div className="max-w-xs text-sm text-emerald-700 dark:text-emerald-300 sm:text-right">
        <p className="font-semibold">{copy.availableModulesCompleteTitle}</p>
        <p className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
          {copy.availableModulesCompleteBody}
        </p>
      </div>
    );
  }

  const view = presentation.view;
  const targetTier =
    typeof progression?.currentPath?.targetTier === "string"
      ? progression.currentPath.targetTier
      : null;
  const pathLabel = formatProgressionTierLabel(
    targetTier || progression?.earnedTier,
    lang
  );

  if (presentation.mode === "path_complete") {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-300">
        <span className="font-semibold">{copy.continueTitle}</span>
        <span className="mx-1.5 text-slate-400 dark:text-slate-500" aria-hidden="true">
          ·
        </span>
        <span>{view?.pathCompleteLabel || copy.continuePathComplete}</span>
      </p>
    );
  }

  const action = view?.action;
  const canContinue =
    (action?.status === "ready" || action?.status === "browse") &&
    Boolean(action?.route);
  const contextLine = copy.continuePathModule(pathLabel, view?.moduleId);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {canContinue ? (
        <button
          type="button"
          onClick={() => handleContinue(action.route)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-700 underline-offset-2 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-300"
        >
          {copy.continueCta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : (
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          {action?.cta || copy.continueCta}
        </span>
      )}
      {contextLine ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {contextLine}
          {view?.moduleTitle ? ` — ${view.moduleTitle}` : ""}
        </span>
      ) : null}
    </div>
  );
}

function ModuleCard({ mod, lang, copy, progression }) {
  const locale = lang === "gr" ? "gr" : "en";
  const title = getLmRegistryModuleTitle(mod.id, locale) || mod.id;
  const available = mod.chapterAvailable === true;
  const route = available ? getLmChapterRoute(mod.id, locale) : null;
  const heroSrc = available ? getLmModuleVisuals(mod.id)?.hero : null;
  const label = copy.moduleLabel(mod.moduleNumber);
  const about = getModuleAbout(mod, locale, copy);
  // Canonical LM_COMPLETE only — never XP, activities, or local guesses.
  const complete = Boolean(
    available && getCanonicalModuleEntry(progression, mod.id)?.complete
  );
  const statusLabel = !available
    ? copy.planned
    : complete
      ? copy.completed
      : copy.available;

  const statusClass = !available
    ? "border-slate-200/80 bg-slate-50/80 text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
    : complete
      ? "border-emerald-300/70 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200"
      : "border-indigo-200/80 bg-indigo-50/80 text-indigo-800 dark:border-indigo-500/35 dark:bg-indigo-500/15 dark:text-indigo-200";

  // Compact planned cards — no large empty image placeholders.
  if (!available) {
    const shellClass =
      "flex h-full flex-col rounded-xl border border-dashed border-slate-200/90 bg-slate-50/70 px-3.5 py-3 dark:border-white/[0.12] dark:bg-white/[0.03]";
    return (
      <div
        className={shellClass}
        aria-label={`${label}: ${title}. ${copy.planned}`}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 ring-1 ring-teal-200/70 dark:bg-teal-500/10 dark:ring-teal-500/25">
            <LmTierMark tier={mod.pathKey} active={false} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>
            <h3 className="mt-1 text-sm font-bold leading-snug text-slate-800 dark:text-slate-200">
              {title}
            </h3>
            {about ? (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                {about}
              </p>
            ) : null}
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              {copy.chapterPlanned}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const body = (
    <>
      <div className="relative">
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/90 ring-1 ring-slate-200/70 dark:from-slate-800/80 dark:to-slate-900/60 dark:ring-white/10">
          {heroSrc ? (
            <LmApprovedVisual
              src={heroSrc}
              alt=""
              className="h-full w-full p-2.5 sm:p-3"
            />
          ) : (
            <LmTierMark
              tier={mod.pathKey}
              active
              className="h-14 w-14 sm:h-16 sm:w-16"
            />
          )}
        </div>
        {complete ? (
          <span className="absolute bottom-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            {label}
          </p>
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
        <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        {about ? (
          <p className="mt-1.5 line-clamp-3 text-sm leading-5 text-slate-600 dark:text-slate-400">
            {about}
          </p>
        ) : null}
      </div>

      <div className="mt-auto pt-3">
        {route ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition group-hover:bg-indigo-100 group-hover:gap-2 dark:bg-indigo-500/15 dark:text-cyan-200 dark:group-hover:bg-indigo-500/25">
            {copy.openModule}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {copy.chapterPlanned}
          </span>
        )}
      </div>
    </>
  );

  const shellClass =
    "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-indigo-400/40 sm:p-3.5";

  if (available && route) {
    return (
      <Link
        to={route}
        className={shellClass}
        aria-label={`${label}: ${title}. ${statusLabel}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className={shellClass}
      aria-label={`${label}: ${title}. ${copy.planned}`}
    >
      {body}
    </div>
  );
}

function MethodologyStrip({ copy }) {
  return (
    <section className="mt-6" aria-labelledby="learn-practice-prove-heading">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <h2
          id="learn-practice-prove-heading"
          className="text-sm font-bold text-slate-900 dark:text-white sm:text-base"
        >
          {copy.footerTitle}
        </h2>
        <p className="max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-400">
          {copy.footerBody}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {copy.valuePoints.map((point, index) => {
          const Icon = VALUE_ICONS[index] || LearnIcon;
          const styles = VALUE_CARD_STYLES[index] || VALUE_CARD_STYLES[0];
          return (
            <li
              key={point.title}
              className={`flex flex-col rounded-2xl border px-4 py-4 ${styles.card}`}
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconWrap}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {point.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {point.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Learn landing — curriculum entry point (LM01–LM11 overview).
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function LearnPage({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLearnLandingCopy(locale);
  const identityArgs = useEducationalIdentityArgs();
  const {
    metadata,
    loading: identityMetadataLoading,
    canonicalIdentityAddress,
  } = useResolvedIdentityContext();
  const apiBase = getWeb3eduBackendUrl();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchProgression, setFetchProgression] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Match LM01/LM08: wait only while OIDC is still resolving a missing token.
      // Do not block the progression fetch on socialIdentityLoading once idToken exists.
      if (!identityArgs.idToken) {
        if (!identityArgs.oidcAuthLoading && !identityArgs.socialIdentityLoading) {
          if (!cancelled) {
            setFetchProgression(null);
            setFetchError(null);
            setFetchLoading(false);
          }
        }
        return;
      }

      if (!cancelled) {
        setFetchLoading(true);
        setFetchError(null);
      }

      const result = await fetchLearningModulesProgression({
        apiBase,
        idToken: identityArgs.idToken,
      });

      if (cancelled) return;

      if (result.ok && result.data?.progression) {
        setFetchProgression(result.data.progression);
        setFetchError(null);
      } else {
        setFetchProgression(null);
        setFetchError(result.data?.error || "progression_error");
      }
      setFetchLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [
    apiBase,
    identityArgs.idToken,
    identityArgs.oidcAuthLoading,
    identityArgs.socialIdentityLoading,
  ]);

  const { progression } = pickLearnContinueProgression(
    fetchProgression,
    metadata?.progression
  );

  const progressionError =
    !isValidCanonicalProgression(progression) &&
    (fetchError || metadata?.progressionError || null);

  const personalizationLoading =
    identityArgs.oidcAuthLoading ||
    (Boolean(identityArgs.idToken) && fetchLoading) ||
    (Boolean(canonicalIdentityAddress) &&
      identityMetadataLoading &&
      !isValidCanonicalProgression(progression));

  const showContinueSection = shouldShowLearnContinueSection({
    oidcAuthLoading: identityArgs.oidcAuthLoading,
    idToken: identityArgs.idToken,
    isOidcAuthenticated: identityArgs.isOidcAuthenticated,
    fetchLoading,
    identityAddress: canonicalIdentityAddress,
    identityLoading: identityMetadataLoading,
    progression,
    progressionError,
  });

  const showContinueBar = isValidCanonicalProgression(progression);

  return (
    <PageShell>
      {/* Keep explicit top padding at all breakpoints — do not use sm:py-* which
          overrides pt-* and pulls hero under the fixed PageShell header. */}
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pt-28 sm:pb-10 lg:px-8 lg:pt-28 lg:pb-12">
        {/* Hero — transparent journey illustration, no stage indicators */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#F3F6FC] via-white to-[#E8F7FB] px-5 py-6 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 sm:px-8 sm:py-7">
          <div
            className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[#4BD7EC]/10 blur-3xl dark:bg-violet-500/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#7A29D6]/10 blur-3xl dark:bg-cyan-500/10"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
                {copy.eyebrow}
              </p>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {copy.heroBody}
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={scrollToCurriculum}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7A29D6] to-[#4BD7EC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {copy.exploreModulesCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="min-w-0">
              <img
                src={LEARN_HERO_IMAGE}
                alt={copy.heroImageAlt}
                width={1983}
                height={793}
                decoding="async"
                className="mx-auto h-auto w-full max-w-xl object-contain object-center lg:max-w-none"
              />
            </div>
          </div>
        </section>

        <MethodologyStrip copy={copy} />

        {/* Modules */}
        <div id={LEARN_MODULES_ANCHOR} className="mt-8 scroll-mt-28">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2
                id="learn-modules-heading"
                className="text-xl font-bold text-slate-900 dark:text-white"
              >
                {copy.modulesHeading}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {copy.modulesIntro}
              </p>
            </div>

            {showContinueSection ? (
              <div
                className="shrink-0 sm:pb-0.5"
                aria-labelledby="learn-continue-heading"
              >
                <h3 id="learn-continue-heading" className="sr-only">
                  {copy.continueTitle}
                </h3>

                {personalizationLoading && !showContinueBar ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {copy.continueLoading}
                  </div>
                ) : null}

                {!personalizationLoading && progressionError && !showContinueBar ? (
                  <div className="flex max-w-sm items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{copy.progressionUnavailable}</span>
                  </div>
                ) : null}

                {showContinueBar ? (
                  <LearnContinueBar
                    progression={progression}
                    lang={locale}
                    copy={copy}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-8 space-y-10">
            {LM_LEARN_PATH_KEYS.map((pathKey) => {
              const pathCopy = copy.paths[pathKey];
              const modules = getLmModulesForPath(pathKey);
              const accent = PATH_ACCENT[pathKey];
              return (
                <section key={pathKey} aria-labelledby={`learn-path-${pathKey}`}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${accent.bar}`}
                      aria-hidden="true"
                    />
                    <LmTierMark tier={pathKey} active className="h-7 w-7" />
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <h3
                        id={`learn-path-${pathKey}`}
                        className="text-lg font-bold text-slate-900 dark:text-white"
                      >
                        {pathCopy.title}
                      </h3>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        — {pathCopy.subtitle}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`grid grid-cols-1 gap-4 ${
                      pathKey === "architect" ? "gap-3" : ""
                    } ${PATH_GRID[pathKey]}`}
                  >
                    {modules.map((mod) => (
                      <ModuleCard
                        key={mod.id}
                        mod={mod}
                        lang={locale}
                        copy={copy}
                        progression={progression}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
