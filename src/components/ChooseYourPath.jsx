import { ArrowRight, Compass, Hammer, Route, Wrench } from "lucide-react";
import SectionBadge from "./SectionBadge.jsx";

const ICONS = {
    learner: Compass,
    labs: Route,
    tools: Wrench,
    builder: Hammer,
};

const ChooseYourPath = ({ content }) => {
    if (!content?.cards?.length) return null;

    return (
        <section className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-8 lg:p-10">
                <div className="mb-8 max-w-3xl">
                    <SectionBadge label={content.badge} className="mb-4" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        {content.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">
                        {content.description}
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {content.cards.map((card) => {
                        const Icon = ICONS[card.icon] || Compass;

                        return (
                            <a
                                key={card.title}
                                href={card.href}
                                className="group flex min-h-[230px] flex-col rounded-2xl border border-slate-200/75 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/10 dark:border-white/10 dark:from-white/[0.07] dark:to-white/[0.03] dark:hover:border-indigo-300/40"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] text-white shadow-lg">
                                    <Icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {card.title}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                                    {card.description}
                                </p>
                                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-700 transition group-hover:translate-x-1 dark:text-cyan-200">
                                    {card.cta}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ChooseYourPath;
