import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  FlaskConical,
  Info,
  Loader2,
} from "lucide-react";
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
import { getContinueLearningViewState } from "../../utils/continueLearningView.js";
import {
  isValidCanonicalProgression,
  pickLearnContinueProgression,
  shouldShowLearnContinueSection,
} from "../../utils/learnContinueUi.js";
import { getCanonicalModuleEntry } from "../../utils/lmModuleView.js";
import { fetchLearningModulesProgression } from "../../utils/labWriteApi.js";

const PATH_GRID = {
  explorer: "sm:grid-cols-2 lg:grid-cols-3",
  builder: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  architect: "sm:grid-cols-2 lg:grid-cols-3",
};

const PATH_ACCENT = {
  explorer: {
    ring: "ring-violet-200/80 dark:ring-violet-500/30",
    bar: "from-violet-500 to-indigo-500",
    text: "text-violet-700 dark:text-violet-300",
  },
  builder: {
    ring: "ring-sky-200/80 dark:ring-sky-500/30",
    bar: "from-blue-500 to-cyan-500",
    text: "text-sky-700 dark:text-sky-300",
  },
  architect: {
    ring: "ring-teal-200/80 dark:ring-teal-500/30",
    bar: "from-teal-500 to-cyan-400",
    text: "text-teal-700 dark:text-teal-300",
  },
};

const VALUE_ICONS = [BookOpen, FlaskConical, BadgeCheck];

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

function getModuleAbout(mod, locale) {
  const about = mod?.about;
  if (!about || typeof about !== "object") return null;
  const text = about[locale] || about.en;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

/**
 * Compact Continue control — presentation only over canonical view-model.
 * Kept as LearnContinueBar for existing presentation contracts.
 */
function LearnContinueBar({ progression, lang, copy }) {
  const view = getContinueLearningViewState(progression, lang);
  const handleContinue = useCallback((route) => {
    navigateHashSafe(route);
  }, []);

  if (view.mode === "invalid") return null;

  const targetTier =
    typeof progression?.currentPath?.targetTier === "string"
      ? progression.currentPath.targetTier
      : null;
  const pathLabel = formatProgressionTierLabel(
    targetTier || progression?.earnedTier,
    lang
  );

  if (view.mode === "complete") {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-300">
        <span className="font-semibold">{copy.continueTitle}</span>
        <span className="mx-1.5 text-slate-400 dark:text-slate-500" aria-hidden="true">
          ·
        </span>
        <span>{view.pathCompleteLabel || copy.continuePathComplete}</span>
      </p>
    );
  }

  const action = view.action;
  const canContinue =
    (action?.status === "ready" || action?.status === "browse") &&
    Boolean(action?.route);
  const contextLine = copy.continuePathModule(pathLabel, view.moduleId);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {canContinue ? (
        <button
          type="button"
          onClick={() => handleContinue(action.route)}
          className="inline-flex items-center gap-1 font-semibold text-indigo-700 underline-offset-2 transition hover:underline dark:text-indigo-300"
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
          {view.moduleTitle ? ` — ${view.moduleTitle}` : ""}
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
  const about = getModuleAbout(mod, locale);
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

  const body = (
    <>
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {heroSrc ? (
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10 sm:h-16 sm:w-16">
              <LmApprovedVisual src={heroSrc} alt="" className="h-full w-full p-1.5" />
            </span>
          ) : (
            <LmTierMark
              tier={mod.pathKey}
              active={available}
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
          )}
          {complete ? (
            <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                available
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </p>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>
          <h3
            className={`mt-1 text-sm font-bold leading-snug sm:text-[0.95rem] ${
              available
                ? "text-slate-900 dark:text-white"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {title}
          </h3>
          {about ? (
            <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
              {about}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        {available && route ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 transition group-hover:gap-1.5 dark:text-cyan-200">
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

  const shellClass = available
    ? "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-indigo-400/40"
    : "flex h-full flex-col rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/60 px-4 py-4 dark:border-white/[0.1] dark:bg-white/[0.02]";

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

function PathJourneyOverview({ copy }) {
  return (
    <nav aria-label={copy.journeyLabel} className="mt-6">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
        {LM_LEARN_PATH_KEYS.map((pathKey, index) => {
          const pathCopy = copy.paths[pathKey];
          const accent = PATH_ACCENT[pathKey];
          const isLast = index === LM_LEARN_PATH_KEYS.length - 1;
          return (
            <li key={pathKey} className="relative flex sm:flex-col sm:items-center sm:px-3">
              {!isLast ? (
                <div
                  className="pointer-events-none absolute left-[2.25rem] right-0 top-5 hidden h-px bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700 sm:left-1/2 sm:right-0 sm:block"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative z-10 flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-4 dark:bg-slate-900 ${accent.ring}`}
                >
                  <LmTierMark tier={pathKey} active className="h-7 w-7" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className={`text-sm font-bold text-slate-900 dark:text-white`}>
                    {pathCopy.title}
                  </p>
                  <p className={`mt-0.5 text-xs font-medium ${accent.text}`}>
                    {pathCopy.subtitle}
                  </p>
                  <p className="mt-1.5 max-w-[16rem] text-xs leading-5 text-slate-600 dark:text-slate-400 sm:mx-auto">
                    {pathCopy.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
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
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#F3F6FC] via-white to-[#E8F7FB] px-6 py-8 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 sm:px-8 sm:py-9">
          {/* Subtle chain / node motif — decorative only */}
          <svg
            className="pointer-events-none absolute -right-6 top-4 h-40 w-40 text-[#7A29D6]/15 dark:text-cyan-300/10 sm:h-48 sm:w-48"
            viewBox="0 0 160 160"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="40" cy="48" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="96" cy="40" r="8" stroke="currentColor" strokeWidth="2" />
            <circle cx="120" cy="88" r="11" stroke="currentColor" strokeWidth="2" />
            <circle cx="68" cy="112" r="9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M49 52 L88 44 M103 48 L112 78 M110 96 L76 108"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#4BD7EC]/10 blur-3xl dark:bg-violet-500/10"
            aria-hidden="true"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {copy.heroBody}
          </p>

          <PathJourneyOverview copy={copy} />
        </section>

        {/* Modules */}
        <div className="mt-10">
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
                  <div className={`grid grid-cols-1 gap-4 ${PATH_GRID[pathKey]}`}>
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

        {/* Learn · Practice · Prove */}
        <section
          className="mt-12 rounded-3xl border border-slate-200/80 bg-white/80 px-5 py-7 dark:border-white/10 dark:bg-slate-900/40 sm:px-8"
          aria-labelledby="learn-practice-prove-heading"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="learn-practice-prove-heading"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {copy.footerTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {copy.footerBody}
            </p>
          </div>

          <ul className="mx-auto mt-7 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {copy.valuePoints.map((point, index) => {
              const Icon = VALUE_ICONS[index] || BookOpen;
              return (
                <li
                  key={point.title}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-4 text-left dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7A29D6] to-[#4BD7EC] text-white shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                    {point.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {point.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
