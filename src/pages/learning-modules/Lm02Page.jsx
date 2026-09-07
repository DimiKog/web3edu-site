import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import PageShell from "../../components/PageShell.jsx";
import LmLearningPath from "../../components/learning-modules/LmLearningPath.jsx";
import LmProgressSidebar from "../../components/learning-modules/LmProgressSidebar.jsx";
import LmChapterClose from "../../components/learning-modules/LmChapterClose.jsx";
import Lm02ConceptPanel from "../../components/learning-modules/Lm02ReasoningJourney.jsx";
import { LmApprovedVisual, LmHeroMetaMark, LmOutcomeMark } from "../../components/learning-modules/LmVisuals.jsx";
import { getLmPageCopy } from "../../content/lmPageLocale.js";
import { useEducationalIdentityArgs } from "../../hooks/useEducationalIdentityArgs.js";
import { getWeb3eduBackendUrl } from "../../lib/web3eduBackend.js";
import { fetchLearningModulesProgression } from "../../utils/labWriteApi.js";
import { getLmPageViewState } from "../../utils/lmModuleView.js";

/**
 * LM02 Interactive Chapter — Why Blockchain? (architecture justification).
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm02Page({ lang = "en" }) {
  const locale = lang === "gr" ? "gr" : "en";
  const copy = getLmPageCopy(locale, "LM02");
  const identityArgs = useEducationalIdentityArgs();
  const apiBase = getWeb3eduBackendUrl();

  const [loading, setLoading] = useState(true);
  const [progression, setProgression] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!identityArgs.idToken) {
        if (!identityArgs.oidcAuthLoading && !identityArgs.socialIdentityLoading) {
          if (!cancelled) {
            setProgression(null);
            setLoadError("sign_in");
            setLoading(false);
          }
        }
        return;
      }

      setLoading(true);
      setLoadError(null);
      const result = await fetchLearningModulesProgression({
        apiBase,
        idToken: identityArgs.idToken,
      });

      if (cancelled) return;

      if (result.ok && result.data?.progression) {
        setProgression(result.data.progression);
        setLoadError(null);
      } else {
        setProgression(null);
        setLoadError(result.data?.error || "progression_error");
      }
      setLoading(false);
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

  const view = getLmPageViewState(progression, locale, "LM02");

  if (view.mode !== "ready") {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-sm text-slate-600 dark:text-slate-300">{copy.progressionError}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <nav className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-indigo-600 dark:text-indigo-300">
            {copy.breadcrumbLearn}
          </span>
          <span className="mx-2">›</span>
          <span>{copy.breadcrumbExplorer}</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700 dark:text-slate-200">LM02</span>
        </nav>

        {loading ? (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {copy.loading}
          </div>
        ) : null}

        {!loading && loadError && loadError !== "sign_in" ? (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{copy.progressionError}</span>
          </div>
        ) : null}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] xl:gap-8">
          <div className="min-w-0 space-y-6">
            <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-slate-300/70 bg-gradient-to-br from-slate-100 via-[#E8EEFF] to-cyan-100/80 px-6 py-7 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] dark:border-slate-500/20 dark:from-slate-950/90 dark:via-slate-900 dark:to-cyan-950/50 sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-300/10" />
              <div className="pointer-events-none absolute -left-10 bottom-0 -z-10 h-56 w-56 rounded-full bg-slate-500/15 blur-3xl dark:bg-slate-400/10" />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(200px,0.75fr)] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-700 dark:text-cyan-200">
                    <span className="rounded-full bg-white/70 px-3 py-1 dark:bg-white/10">
                      {copy.pathBadge}
                    </span>
                    {view.presentation ? (
                      <span className="text-slate-600 dark:text-slate-300">
                        {copy.moduleOf(view.presentation.moduleNumber, view.presentation.totalModules)}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
                    LM02
                  </p>
                  <h1 className="mt-1.5 max-w-xl text-3xl font-black tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-[2.45rem] lg:leading-[1.08]">
                    {view.title}
                  </h1>

                  <div className="mt-5 max-w-xl border-l-2 border-cyan-500/60 pl-4 text-sm leading-6 text-slate-700 dark:border-cyan-400/40 dark:text-slate-200">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="mr-2 font-semibold text-slate-500 dark:text-slate-400">
                        {copy.fromLabel}:
                      </span>
                      “{view.transitionFrom}”
                    </p>
                    <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">
                      <span className="mr-2 font-semibold text-cyan-700 dark:text-cyan-300">
                        {copy.toLabel}:
                      </span>
                      {view.transitionTo}
                    </p>
                  </div>
                </div>

                <div className="relative flex w-full min-w-0 justify-center lg:justify-end">
                  <LmApprovedVisual
                    src={view.presentation?.visuals?.hero}
                    className="mx-auto h-auto w-auto max-h-52 max-w-full sm:max-h-64 lg:mx-0 lg:max-h-[20rem] xl:max-h-[22.5rem]"
                  />
                </div>
              </div>

              <dl className="mt-6 grid gap-4 border-t border-slate-300/50 pt-5 dark:border-white/10 sm:grid-cols-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  {view.presentation?.visuals?.meta?.time ? (
                    <LmApprovedVisual
                      src={view.presentation.visuals.meta.time}
                      className="h-12 w-[4.5rem] shrink-0 sm:h-14 sm:w-[5.25rem]"
                    />
                  ) : (
                    <LmHeroMetaMark kind="time" className="h-9 w-9 shrink-0" />
                  )}
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.heroTimeLabel}
                    </dt>
                    <dd className="text-sm font-bold text-slate-900 dark:text-white">
                      {view.learnerMeta?.estimatedTime}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sky-700 dark:text-sky-300">
                  {view.presentation?.visuals?.meta?.level ? (
                    <LmApprovedVisual
                      src={view.presentation.visuals.meta.level}
                      className="h-12 w-[4.5rem] shrink-0 sm:h-14 sm:w-[5.25rem]"
                    />
                  ) : (
                    <LmHeroMetaMark kind="level" className="h-9 w-9 shrink-0" />
                  )}
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.heroLevelLabel}
                    </dt>
                    <dd className="text-sm font-bold text-slate-900 dark:text-white">
                      {view.learnerMeta?.level}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-300">
                  {view.presentation?.visuals?.meta?.xp ? (
                    <LmApprovedVisual
                      src={view.presentation.visuals.meta.xp}
                      className="h-12 w-[4.5rem] shrink-0 sm:h-14 sm:w-[5.25rem]"
                    />
                  ) : (
                    <LmHeroMetaMark kind="xp" className="h-9 w-9 shrink-0" />
                  )}
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {copy.heroXpLabel}
                    </dt>
                    <dd className="text-sm font-bold text-slate-900 dark:text-white">
                      {view.learnerMeta
                        ? copy.heroXpValue(view.learnerMeta.assessmentXp)
                        : null}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            <section
              aria-labelledby="lm02-outcomes-title"
              className="rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-white/[0.035] sm:px-6"
            >
              <h2
                id="lm02-outcomes-title"
                className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white"
              >
                {copy.whatYoullLearn}
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {(view.learningOutcomes || []).map((outcome, index) => (
                  <li key={outcome} className="flex items-start gap-3">
                    <LmOutcomeMark index={index} className="h-11 w-11 shrink-0" />
                    <p className="pt-0.5 text-sm leading-5 text-slate-700 dark:text-slate-200">
                      {outcome}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <LmLearningPath
              activities={view.activities}
              lang={locale}
              moduleId="LM02"
              renderEmbed={(row, { lang: embedLang }) => {
                if (row.id === "lm02-understand-trust-model") {
                  return <Lm02ConceptPanel lang={embedLang} panel="trust-model" />;
                }
                if (row.id === "lm02-compare-architecture-choices") {
                  return (
                    <Lm02ConceptPanel lang={embedLang} panel="architecture-choices" />
                  );
                }
                return null;
              }}
            />
            <LmChapterClose view={view} lang={locale} />
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <LmProgressSidebar
              view={view}
              lang={locale}
              loading={loading}
              loadError={loadError}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
