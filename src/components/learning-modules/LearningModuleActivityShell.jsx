import { Link } from "react-router-dom";
import PageShell from "../PageShell.jsx";
import { getLearningModuleActivityShellCopy } from "../../content/learningModuleActivityShellLocale.js";

/**
 * Shared chrome for Learning Module activity pages.
 * @param {{
 *   lang?: "en"|"gr",
 *   moduleId: string,
 *   title: string,
 *   subtitle?: string|null,
 *   icon?: import("react").ComponentType<{ className?: string }>|null,
 *   density?: "default"|"compact",
 *   children?: import("react").ReactNode,
 * }} props
 */
export default function LearningModuleActivityShell({
    lang = "en",
    moduleId,
    title,
    subtitle = null,
    icon: Icon = null,
    density = "default",
    children,
}) {
    const copy = getLearningModuleActivityShellCopy(lang);
    const compact = density === "compact";

    return (
        <PageShell>
            <div
                className={`mx-auto max-w-4xl px-4 sm:px-6 ${
                    compact ? "py-6 sm:py-8" : "py-10"
                }`}
            >
                <nav
                    className={`text-sm text-slate-500 dark:text-slate-400 ${
                        compact ? "mb-4" : "mb-6"
                    }`}
                >
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
                    className={`inline-flex text-sm font-semibold text-indigo-600 transition hover:translate-x-0.5 dark:text-indigo-300 ${
                        compact ? "mb-3" : "mb-4"
                    }`}
                >
                    ← {copy.backToDashboard}
                </Link>

                <section
                    className={`rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-cyan-50/40 to-fuchsia-50/40 shadow-sm dark:border-slate-700/60 dark:from-slate-900/80 dark:via-cyan-950/20 dark:to-fuchsia-950/20 ${
                        compact ? "p-4 sm:p-5" : "p-6 sm:p-8"
                    }`}
                >
                    <div className="flex items-start gap-3">
                        {Icon ? (
                            <Icon
                                className={`mt-1 shrink-0 text-cyan-700 dark:text-cyan-200 ${
                                    compact ? "h-6 w-6" : "h-7 w-7"
                                }`}
                            />
                        ) : null}
                        <div>
                            <span
                                className="inline-flex items-center gap-2 rounded-full bg-cyan-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                            >
                                {copy.headerPill}
                            </span>
                            <p
                                className={`text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80 ${
                                    compact ? "mt-2" : "mt-3"
                                }`}
                            >
                                {moduleId}
                            </p>
                            <h1
                                className={`font-semibold text-slate-900 dark:text-white ${
                                    compact
                                        ? "mt-1.5 text-xl sm:text-2xl"
                                        : "mt-2 text-2xl sm:text-3xl"
                                }`}
                            >
                                {title}
                            </h1>
                            {subtitle ? (
                                <p
                                    className={`max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base ${
                                        compact
                                            ? "mt-2 leading-6"
                                            : "mt-3 leading-7"
                                    }`}
                                >
                                    {subtitle}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <div className={compact ? "mt-5" : "mt-8"}>{children}</div>
            </div>
        </PageShell>
    );
}
