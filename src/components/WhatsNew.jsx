import React from "react";

// ─── Category metadata ───────────────────────────────────────────────────────
const CATEGORY_META = {
    tool:    { en: "Tool",    gr: "Εργαλείο", border: "border-cyan-300/60 dark:border-cyan-400/30",   bg: "bg-cyan-50/90 dark:bg-cyan-400/10",   text: "text-cyan-700 dark:text-cyan-200"   },
    lab:     { en: "Lab",     gr: "Lab",       border: "border-purple-300/60 dark:border-purple-400/30", bg: "bg-purple-50/90 dark:bg-purple-400/10", text: "text-purple-700 dark:text-purple-200" },
    project: { en: "Project", gr: "Project",   border: "border-amber-300/60 dark:border-amber-400/30",  bg: "bg-amber-50/90 dark:bg-amber-400/10",  text: "text-amber-700 dark:text-amber-200"  },
    update:  { en: "Update",  gr: "Ενημέρωση", border: "border-green-300/60 dark:border-green-400/30",  bg: "bg-green-50/90 dark:bg-green-400/10",  text: "text-green-700 dark:text-green-200"  },
};

// ─── Relative date helper ─────────────────────────────────────────────────────
function relativeDate(dateStr, isGR) {
    const date = new Date(dateStr);
    const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)  return date.toLocaleDateString(isGR ? "el-GR" : "en-GB", { month: "short", year: "numeric" });
    if (diffDays === 0) return isGR ? "Σήμερα"            : "Today";
    if (diffDays === 1) return isGR ? "Χθες"              : "Yesterday";
    if (diffDays < 7)  return isGR ? `${diffDays} μέρες πριν` : `${diffDays} days ago`;
    if (diffDays < 14) return isGR ? "Περ. εβδομάδα"      : "Last week";
    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return isGR ? `${weeks} εβδ. πριν` : `${weeks} weeks ago`;
    if (diffDays < 60) return isGR ? "Περ. μήνα"          : "Last month";
    return date.toLocaleDateString(isGR ? "el-GR" : "en-GB", { month: "short", year: "numeric" });
}

// Auto-badge: items added within the last 30 days are marked "New"
function isNewItem(dateStr) {
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function WhatsNewCard({ item, isGR, featured = false }) {
    const meta     = CATEGORY_META[item.category] || CATEGORY_META.update;
    const catLabel = isGR ? meta.gr : meta.en;
    const showNew  = isNewItem(item.date);
    const dateLabel = relativeDate(item.date, isGR);
    const ctaLabel  = item.cta || (isGR ? "Δες περισσότερα" : "Learn more");

    // Content block — shared between both layouts
    const content = (
        <div className="flex flex-col gap-5">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
                <span className={[
                    "inline-flex items-center rounded-full border px-3 py-1",
                    "text-[11px] font-semibold uppercase tracking-[0.2em]",
                    meta.border, meta.bg, meta.text,
                ].join(" ")}>
                    {catLabel}
                </span>
                {showNew && (
                    <span className="inline-flex items-center rounded-full border border-fuchsia-300/60 bg-fuchsia-50/90 px-3 py-1 text-[11px] font-medium text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-200">
                        {isGR ? "Νέο" : "New"}
                    </span>
                )}
                <span className="ml-auto text-[11px] tabular-nums text-slate-700 dark:text-slate-400">
                    {dateLabel}
                </span>
            </div>

            {/* Title + description */}
            <div className="space-y-2">
                <h3 className={[
                    "font-semibold leading-snug text-slate-900 dark:text-white",
                    featured ? "text-2xl sm:text-[1.75rem]" : "text-lg",
                ].join(" ")}>
                    {item.title}
                </h3>
                <p className={[
                    "leading-6 text-slate-700 dark:text-slate-300",
                    featured ? "text-[15px]" : "text-sm",
                ].join(" ")}>
                    {item.description}
                </p>
            </div>

            {/* Related links (optional) */}
            {item.links && item.links.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/80 pt-4 dark:border-white/10">
                    <span className="shrink-0 text-[11px] uppercase tracking-widest text-slate-700 dark:text-slate-400">
                        {isGR ? "Δες επίσης" : "Also explore"}
                    </span>
                    {item.links.map((link) => (
                        <span
                            key={link.href}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = link.href; }}
                            className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium text-indigo-700 transition-colors duration-200 hover:text-indigo-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                            <span>↗</span>
                            {link.label}
                        </span>
                    ))}
                </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-end">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 transition-transform duration-300 group-hover:translate-x-1 dark:text-cyan-200">
                    {ctaLabel}
                    <span aria-hidden="true">→</span>
                </span>
            </div>
        </div>
    );

    return (
        <a
            href={item.href || "#/"}
            className={[
                "group relative overflow-hidden rounded-3xl border border-[#120A1E]/14 bg-[linear-gradient(135deg,rgba(9,12,20,0.08),rgba(18,10,30,0.10),rgba(8,16,24,0.08))] shadow-[0_16px_36px_rgba(18,10,30,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-[linear-gradient(135deg,rgba(9,12,20,0.11),rgba(18,10,30,0.13),rgba(8,16,24,0.10))] dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:bg-white/[0.08]",
                featured ? "self-start" : "",
            ].join(" ")}
        >
            {/* Featured + image: side-by-side layout */}
            {featured && item.image ? (
                <div className="flex flex-col lg:flex-row">
                    {/* Left: content */}
                    <div className="flex-1 p-6 sm:p-7 lg:p-7">
                        {content}
                    </div>
                    {/* Right: screenshot */}
                    <div className="relative lg:w-[56%] overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl bg-[#090C14]/22 dark:bg-slate-900/60">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover object-top opacity-[84%] transition-opacity duration-300 group-hover:opacity-100 dark:opacity-80 dark:group-hover:opacity-100"
                            style={{ maxHeight: "300px" }}
                        />
                        {/* Subtle left-edge fade so it blends into the content side */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#120A1E]/18 to-transparent dark:from-slate-950/70" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF67D2]/6 via-transparent to-[#4ACBFF]/8 dark:from-transparent dark:to-transparent" />
                    </div>
                </div>
            ) : (
                /* Default: full-width content */
                <div className="p-6 sm:p-7">
                    {content}
                </div>
            )}
        </a>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WhatsNew({ items = [], isGR = false, className = "" }) {
    // Sort newest-first; featured slot is always the most recent item
    const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    const featured = sorted[0];
    const secondary = sorted.slice(1, 5);   // up to 4 secondary cards
    const leftSupport = secondary[3] || null;
    const rightColumn = secondary.slice(0, 3);

    if (!featured) return null;

    return (
        <section className={["w-full", className].join(" ")}>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#120A1E]/16 bg-[linear-gradient(135deg,rgba(9,12,20,0.16),rgba(18,10,30,0.18),rgba(8,16,24,0.16))] px-6 py-8 shadow-[0_24px_70px_rgba(18,10,30,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.92),rgba(8,15,32,0.88))] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-10 lg:px-10">

                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,203,255,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,103,210,0.10),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_32%)]" />

                <div className="relative z-10 flex flex-col gap-8">

                    {/* Header */}
                    <div className="max-w-2xl space-y-3">
                        <span className="inline-flex items-center rounded-full border border-cyan-300/60 bg-cyan-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                            {isGR ? "Τώρα στο Web3Edu" : "Now on Web3Edu"}
                        </span>
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl dark:text-white">
                            {isGR ? "Τελευταίες Προσθήκες" : "What's New"}
                        </h2>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base dark:text-slate-300">
                            {isGR
                                ? "Οι πιο πρόσφατες προσθήκες και βελτιώσεις στην πλατφόρμα."
                                : "The latest additions and improvements to the platform."}
                        </p>
                    </div>

                    {/* Mobile/tablet: simple stack. Desktop: featured + support left, three cards right */}
                    <div className="grid grid-cols-1 gap-6 xl:hidden">
                        <WhatsNewCard item={featured} isGR={isGR} featured />
                        {secondary.map((item) => (
                            <WhatsNewCard key={item.id} item={item} isGR={isGR} />
                        ))}
                    </div>

                    <div className="hidden xl:grid xl:grid-cols-[1.15fr_1fr] xl:items-start xl:gap-6">
                        <div className="grid grid-cols-1 gap-6">
                            <WhatsNewCard item={featured} isGR={isGR} featured />
                            {leftSupport && (
                                <WhatsNewCard item={leftSupport} isGR={isGR} />
                            )}
                        </div>

                        {rightColumn.length > 0 && (
                            <div className="grid grid-cols-1 gap-6">
                                {rightColumn.map((item) => (
                                    <WhatsNewCard key={item.id} item={item} isGR={isGR} />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
