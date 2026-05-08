import { ArrowRight, BadgeCheck, FlaskConical, Gamepad2, LayoutDashboard, Wrench } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const ICONS = {
    labs: FlaskConical,
    poe: Gamepad2,
    tools: Wrench,
    projects: BadgeCheck,
    identity: LayoutDashboard,
};

const AvailableNow = ({ content }) => {
    if (!content?.items?.length) return null;

    return (
        <section className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
            <div className="p-1 sm:p-2">
                <div className="mb-8 max-w-3xl">
                    <SectionBadge label={content.badge} className="mb-4" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        {content.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">
                        {content.description}
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {content.items.map((item) => {
                        const Icon = ICONS[item.icon] || BadgeCheck;

                        return (
                            <a
                                key={item.title}
                                href={item.href}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200/75 bg-white/72 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-white/90 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/[0.045] dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.07]"
                            >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#8A57FF]/12 via-[#4ACBFF]/12 to-[#FF67D2]/12 blur-2xl" />
                                <div className="relative">
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-950">
                                            <Icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        {item.meta && (
                                            <span className="rounded-full border border-emerald-300/70 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-200">
                                                {item.meta}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                        {item.description}
                                    </p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition group-hover:translate-x-1 dark:text-cyan-200">
                                        {item.cta}
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AvailableNow;
