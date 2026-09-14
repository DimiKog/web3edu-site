import { getLm04ChapterCopy } from "../../content/lm04ChapterLocale.js";

/**
 * Compact LM04 conceptual spine (sections 1–6). Presentation only.
 * @param {{ lang?: "en"|"gr" }} props
 */
export default function Lm04ConceptPanel({ lang = "en" }) {
  const copy = getLm04ChapterCopy(lang);

  return (
    <div className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
      <div>
        <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
          {copy.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {copy.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {copy.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/40"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {section.title}
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-700 dark:text-slate-300">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
