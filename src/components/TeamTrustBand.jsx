import { ArrowRight, Users } from "lucide-react";

const TeamTrustBand = ({ content }) => {
    if (!content) return null;

    return (
        <section className="w-full px-6 opacity-0 animate-fadeInSlow duration-500">
            <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A57FF] to-[#4ACBFF] text-white shadow-lg">
                        <Users className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {content.title}
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                            {content.description}
                        </p>
                    </div>
                </div>
                <a
                    href={content.href}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8A57FF] to-[#4ACBFF] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02]"
                >
                    {content.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
            </div>
        </section>
    );
};

export default TeamTrustBand;
