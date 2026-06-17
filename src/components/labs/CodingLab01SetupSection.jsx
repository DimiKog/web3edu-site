import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import {
    CODING_LAB01_SETUP_COPY,
    CODING_LAB01_SETUP_PATHS,
} from "../../content/codingLab01SetupRequirements.js";

export default function CodingLab01SetupSection({ lang = "en", compact = false }) {
    const copy = CODING_LAB01_SETUP_COPY[lang] || CODING_LAB01_SETUP_COPY.en;
    const paths = CODING_LAB01_SETUP_PATHS[lang] || CODING_LAB01_SETUP_PATHS.en;

    return (
        <section
            className={`rounded-2xl border border-cyan-200/70 bg-cyan-50/70 dark:border-cyan-400/25 dark:bg-cyan-400/10 ${
                compact ? "p-5" : "p-6"
            }`}
        >
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700/80 dark:text-cyan-200/80">
                {copy.subtitle}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{copy.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{copy.intro}</p>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {copy.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
                <Link
                    to={paths.setupGuidePath}
                    className="inline-flex items-center gap-2 rounded-full border border-[#8A57FF]/30 bg-[#8A57FF]/10 px-4 py-2 text-sm font-semibold text-[#8A57FF] transition hover:bg-[#8A57FF]/15"
                >
                    {copy.setupGuideCta}
                </Link>
                <a
                    href={paths.faucetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/25 dark:bg-slate-950/40 dark:text-emerald-100 dark:hover:bg-emerald-400/15"
                >
                    <ExternalLink className="h-4 w-4" />
                    {copy.faucetCta}
                </a>
                <a
                    href={paths.remixUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-400/25 dark:bg-slate-950/40 dark:text-cyan-100 dark:hover:bg-cyan-400/15"
                >
                    <ExternalLink className="h-4 w-4" />
                    {copy.remixCta}
                </a>
            </div>

            {!compact && (
                <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{copy.troubleshootingHint}</span>
                </p>
            )}
        </section>
    );
}
