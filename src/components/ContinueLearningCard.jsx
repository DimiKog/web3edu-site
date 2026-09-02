import { useCallback } from "react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import DashboardCard from "./DashboardCard.jsx";
import { getContinueLearningCopy } from "../content/continueLearningLocale.js";
import {
    getContinueLearningViewState,
    isValidCanonicalProgression,
} from "../utils/continueLearningView.js";

export { isValidCanonicalProgression, getContinueLearningViewState };

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
 * @param {{ progression: Record<string, unknown>, lang?: "en"|"gr" }} props
 */
export default function ContinueLearningCard({ progression, lang = "en" }) {
    const copy = getContinueLearningCopy(lang);
    const view = getContinueLearningViewState(progression, lang);

    const handleContinue = useCallback(
        (route) => {
            navigateHashSafe(route);
        },
        []
    );

    if (view.mode === "invalid") {
        return null;
    }

    if (view.mode === "complete") {
        return (
            <DashboardCard
                title={copy.title}
                className="p-5"
                icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
                status="completed"
                statusLabel={copy.pathComplete}
            >
                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/70 p-4 dark:border-emerald-700/30 dark:bg-emerald-900/20">
                    <p className="text-xs uppercase tracking-wide font-semibold text-emerald-700 dark:text-emerald-300">
                        {copy.earnedTier}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {view.earnedTierLabel}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {view.pathCompleteLabel}
                    </p>
                </div>
            </DashboardCard>
        );
    }

    const { action } = view;
    const isActionReady = action.status === "ready" || action.status === "browse";
    const isDisabled =
        action.status === "coming_soon" ||
        action.status === "unavailable" ||
        action.status === "complete";

    return (
        <DashboardCard
            title={copy.title}
            className="p-5"
            icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
        >
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200/60 bg-white/45 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {copy.earnedTier}
                        </p>
                        <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                            {view.earnedTierLabel}
                        </p>
                    </div>
                    {view.pathLabel ? (
                        <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/50 px-3 py-2.5 dark:border-indigo-700/30 dark:bg-indigo-900/20">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                                {copy.currentPath}
                            </p>
                            <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                                {view.pathLabel}
                            </p>
                        </div>
                    ) : null}
                </div>

                {view.moduleId ? (
                    <div className="rounded-2xl border border-slate-200/60 bg-white/45 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {copy.currentModule}
                        </p>
                        <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {view.moduleId}
                        </p>
                        {view.moduleTitle ? (
                            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white leading-snug">
                                {view.moduleTitle}
                            </p>
                        ) : null}
                    </div>
                ) : null}

                <div className="rounded-2xl border border-slate-200/60 bg-white/45 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {copy.nextStep}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {action.label}
                    </p>
                    {view.xpLine ? (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{view.xpLine}</p>
                    ) : null}
                    <div className="mt-4">
                        {isActionReady && action.route ? (
                            <button
                                type="button"
                                onClick={() => handleContinue(action.route)}
                                className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                            >
                                {action.cta}
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center gap-1 rounded-xl border border-slate-300/60 bg-slate-100/80 px-4 py-2.5 text-sm font-semibold text-slate-500 opacity-80 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400"
                            >
                                {action.cta ?? copy.notYetAvailable}
                            </button>
                        )}
                    </div>
                    {isDisabled && action.status === "unavailable" ? (
                        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                            {copy.notYetAvailable}
                        </p>
                    ) : null}
                </div>
            </div>
        </DashboardCard>
    );
}
