import { Link } from "react-router-dom";
import PageShell from "../PageShell.jsx";
import { getLearningModuleActivityShellCopy } from "../../content/learningModuleActivityShellLocale.js";

export default function LearningModuleActivityShell({
    lang = "en",
    moduleId,
    title,
    subtitle = null,
    icon: Icon = null,
    children,
}) {
    const copy = getLearningModuleActivityShellCopy(lang);

    return (
        <PageShell>
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <Link
                        to={copy.dashboardPath}
                        className="font-medium text-indigo-600 transition hover:underline dark:text-indigo-300"
                    >
                        {copy.breadcrumbDashboard}
                    </Link>
                    <span className="mx-2">→</span>
                    <span>{copy.breadcrumbModules}</span>
                    <span className="mx-2">→</span>
                    <span className="text-slate-700 dark:text-slate-300">{moduleId}</span>
                </nav>

                <Link
                    to={copy.dashboardPath}
                    className="mb-4 inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-0.5 dark:text-indigo-300"
                >
                    ← {copy.backToDashboard}
                </Link>

                <section
                    className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-cyan-50/40 to-fuchsia-50/40 p-6 shadow-sm dark:border-slate-700/60 dark:from-slate-900/80 dark:via-cyan-950/20 dark:to-fuchsia-950/20 sm:p-8"
                >
                    <div className="flex items-start gap-3">
                        {Icon ? (
                            <Icon className="mt-1 h-7 w-7 shrink-0 text-cyan-700 dark:text-cyan-200" />
                        ) : null}
                        <div>
                            <span
                                className="inline-flex items-center gap-2 rounded-full bg-cyan-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                            >
                                {copy.headerPill}
                            </span>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                                {moduleId}
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                                {title}
                            </h1>
                            {subtitle ? (
                                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                                    {subtitle}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <div className="mt-8">{children}</div>
            </div>
        </PageShell>
    );
}
