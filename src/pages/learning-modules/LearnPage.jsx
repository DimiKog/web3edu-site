import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
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
import { fetchLearningModulesProgression } from "../../utils/labWriteApi.js";

const PATH_GRID = {
  explorer: "sm:grid-cols-2 lg:grid-cols-3",
  builder: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  architect: "sm:grid-cols-2 lg:grid-cols-3",
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

/**
 * Compact Learn Continue bar — presentation only over canonical view-model.
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
  const pathTierKey = String(targetTier || progression?.earnedTier || "")
    .trim()
    .toLowerCase();
  const pathMark =
    pathTierKey === "builder" || pathTierKey === "architect"
      ? pathTierKey
      : "explorer";
  const pathLabel = formatProgressionTierLabel(
    targetTier || progression?.earnedTier,
    lang
  );

  if (view.mode === "complete") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3.5 dark:border-emerald-700/30 dark:bg-emerald-900/20 sm:flex-row sm:items-center sm:gap-4">
        <LmTierMark tier="architect" active className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {copy.continueTitle}
          </p>
          <p className="mt-0.5 text-sm text-emerald-800 dark:text-emerald-200">
            {view.pathCompleteLabel || copy.continuePathComplete}
          </p>
        </div>
      </div>
    );
  }

  const action = view.action;
  const canContinue =
    (action?.status === "ready" || action?.status === "browse") &&
    Boolean(action?.route);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-indigo-200/70 bg-gradient-to-r from-white/90 via-indigo-50/50 to-cyan-50/40 px-4 py-3.5 shadow-sm dark:border-indigo-500/25 dark:from-slate-900/80 dark:via-indigo-950/40 dark:to-cyan-950/30 sm:flex-row sm:items-center sm:gap-4">
      <LmTierMark tier={pathMark} active className="h-9 w-9 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {copy.continueTitle}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm">
          {copy.continueSubtitle}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
          {copy.continuePathModule(pathLabel, view.moduleId)}
        </p>
        {view.moduleTitle ? (
          <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
            {view.moduleTitle}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 sm:self-center">
        {canContinue ? (
          <button
            type="button"
            onClick={() => handleContinue(action.route)}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 sm:w-auto"
          >
            {copy.continueCta}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-300/60 bg-slate-100/80 px-4 py-2.5 text-sm font-semibold text-slate-500 opacity-80 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400 sm:w-auto"
          >
            {action?.cta || copy.continueCta}
          </button>
        )}
      </div>
    </div>
  );
}

function ModuleCard({ mod, lang, copy }) {
  const locale = lang === "gr" ? "gr" : "en";
  const title = getLmRegistryModuleTitle(mod.id, locale) || mod.id;
  const available = mod.chapterAvailable === true;
  const route = available ? getLmChapterRoute(mod.id, locale) : null;
  const heroSrc = available ? getLmModuleVisuals(mod.id)?.hero : null;
  const label = copy.moduleLabel(mod.moduleNumber);

  const body = (
    <>
      <div className="flex items-start gap-2.5">
        <LmTierMark
          tier={mod.pathKey}
          active={available}
          className="mt-0.5 h-8 w-8 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                available
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </p>
            {heroSrc ? (
              <LmApprovedVisual
                src={heroSrc}
                alt=""
                className="hidden h-10 w-10 shrink-0 sm:block"
              />
            ) : null}
          </div>
          <h3
            className={`mt-0.5 text-sm font-bold leading-snug sm:text-[0.95rem] ${
              available
                ? "text-slate-900 dark:text-white"
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        {available && route ? (
          <>
            <span className="inline-flex items-center rounded-md border border-emerald-300/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200">
              {copy.available}
            </span>
            <span className="text-xs font-semibold text-indigo-700 dark:text-cyan-200">
              {copy.openModule}
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
              {copy.planned}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {copy.chapterPlanned}
            </span>
          </>
        )}
      </div>
    </>
  );

  const shellClass = available
    ? "group flex h-full flex-col rounded-xl border border-indigo-200/70 bg-gradient-to-br from-white via-indigo-50/35 to-cyan-50/40 px-3.5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-indigo-500/25 dark:from-slate-900/80 dark:via-indigo-950/35 dark:to-cyan-950/25 dark:hover:border-indigo-400/50"
    : "flex h-full flex-col rounded-xl border border-slate-200/60 bg-white/55 px-3.5 py-3 dark:border-white/[0.08] dark:bg-white/[0.025]";

  if (available && route) {
    return (
      <Link
        to={route}
        className={shellClass}
        aria-label={`${label}: ${title}. ${copy.available}`}
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
        <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-indigo-200/70 bg-gradient-to-br from-[#E4D7FF] via-[#E8EEFF] to-[#CFF6FF] px-6 py-8 text-center shadow-[0_24px_70px_-45px_rgba(79,70,229,0.45)] dark:border-indigo-500/20 dark:from-indigo-950/80 dark:via-slate-900 dark:to-cyan-950/60 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-[#4ACBFF]/25 blur-3xl dark:bg-indigo-300/10" />
          <div className="pointer-events-none absolute -left-10 bottom-0 -z-10 h-56 w-56 rounded-full bg-[#8A57FF]/20 blur-3xl dark:bg-violet-500/10" />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-200">
            {copy.eyebrow}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200 sm:text-[1.05rem]">
            {copy.heroBody}
          </p>

          <ul className="mx-auto mt-7 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {copy.valuePoints.map((point, index) => {
              const Icon = VALUE_ICONS[index] || BookOpen;
              return (
                <li
                  key={point.title}
                  className="rounded-xl border border-white/60 bg-white/45 px-3 py-3 text-left dark:border-white/10 dark:bg-white/[0.05] sm:text-center"
                >
                  <div className="flex items-start gap-2.5 sm:flex-col sm:items-center sm:gap-2">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] text-white shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {point.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                        {point.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {showContinueSection ? (
          <section className="mt-6" aria-labelledby="learn-continue-heading">
            <h2 id="learn-continue-heading" className="sr-only">
              {copy.continueTitle}
            </h2>

            {personalizationLoading && !showContinueBar ? (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.continueLoading}
              </div>
            ) : null}

            {!personalizationLoading && progressionError && !showContinueBar ? (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
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
          </section>
        ) : null}

        <div className="mt-8 space-y-7">
          {LM_LEARN_PATH_KEYS.map((pathKey) => {
            const pathCopy = copy.paths[pathKey];
            const modules = getLmModulesForPath(pathKey);
            return (
              <section key={pathKey} aria-labelledby={`learn-path-${pathKey}`}>
                <div className="mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <LmTierMark tier={pathKey} active className="h-7 w-7" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h2
                      id={`learn-path-${pathKey}`}
                      className="text-lg font-bold text-slate-900 dark:text-white"
                    >
                      {pathCopy.title}
                    </h2>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      — {pathCopy.subtitle}
                    </span>
                  </div>
                </div>
                <div className={`grid grid-cols-1 gap-3 ${PATH_GRID[pathKey]}`}>
                  {modules.map((mod) => (
                    <ModuleCard
                      key={mod.id}
                      mod={mod}
                      lang={locale}
                      copy={copy}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-6 text-center dark:border-white/10 dark:bg-white/[0.04] sm:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8A57FF]/90 to-[#4ACBFF]/90 text-white shadow-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              {copy.footerTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {copy.footerBody}
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
