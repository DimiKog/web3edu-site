import { ArrowRight, Sparkles } from "lucide-react";

const CATEGORY_LABELS = {
    tool: { en: "Tool", gr: "Εργαλείο" },
    lab: { en: "Lab", gr: "Lab" },
    project: { en: "Project", gr: "Project" },
    update: { en: "Update", gr: "Ενημέρωση" },
    identity: { en: "Identity", gr: "Ταυτότητα" },
};

function formatDate(dateStr, isGreek) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString(isGreek ? "el-GR" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const RecentUpdatesStrip = ({ items = [], isGreek = false }) => {
    const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    const [featured, ...secondary] = sorted;
    const visibleSecondary = secondary.slice(0, 2);

    if (!featured) return null;

    const featuredCategory =
        CATEGORY_LABELS[featured.category]?.[isGreek ? "gr" : "en"] ??
        CATEGORY_LABELS.update[isGreek ? "gr" : "en"];

    return (
        <section className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-200/70 bg-white/85 p-5 shadow-lg shadow-cyan-950/5 backdrop-blur dark:border-cyan-400/20 dark:bg-slate-900/70 sm:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,203,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,103,210,0.12),transparent_34%)]" />

                <div className="relative grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-center">
                    <a
                        href={featured.href || "#/"}
                        className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/40 sm:flex-row sm:items-center"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-lg">
                            <Sparkles className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-cyan-300/70 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-800 dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-200">
                                    {isGreek ? "Προστέθηκε πρόσφατα" : "Recently Added"}
                                </span>
                                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 dark:border-indigo-300/20 dark:bg-indigo-400/10 dark:text-indigo-200">
                                    {featuredCategory}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {formatDate(featured.date, isGreek)}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {featured.title}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {featured.description}
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition group-hover:translate-x-1 dark:text-cyan-200">
                            {featured.cta || (isGreek ? "Άνοιγμα" : "Open")}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                    </a>

                    <div className="grid gap-3">
                        {visibleSecondary.map((item) => {
                            const category =
                                CATEGORY_LABELS[item.category]?.[isGreek ? "gr" : "en"] ??
                                CATEGORY_LABELS.update[isGreek ? "gr" : "en"];

                            return (
                                <a
                                    key={item.id}
                                    href={item.href || "#/"}
                                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/75 bg-white/65 px-4 py-3 transition hover:border-indigo-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-indigo-300/35"
                                >
                                    <div>
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-200">
                                                {category}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(item.date, isGreek)}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-200" aria-hidden="true" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentUpdatesStrip;
