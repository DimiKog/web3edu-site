import { Puzzle, BadgeCheck, Landmark, GraduationCap, Eye } from "lucide-react";
import { CARD_BACKGROUND_MAP } from "../design/theme.js";

const iconMap = {
    poe: Puzzle,
    education: GraduationCap,
    nft: BadgeCheck,
    dao: Landmark,
    zkp: Eye,
};

const AppsGrid = ({ content }) => (
    <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {["poe", "education", "nft", "dao", "zkp"].map((key) => {
            const app = content[key];
            const Icon = iconMap[key];
            const backgrounds = CARD_BACKGROUND_MAP.indigo;

            return (
                <a
                    key={key}
                    href={`/#/${key}`}
                    className="group rounded-2xl bg-white/80 p-6 shadow-sm border text-left hover:-translate-y-1 hover:shadow-xl transition-all"
                    style={{ backgroundColor: backgrounds.light }}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{app.title}</h2>
                            <p className="text-sm text-slate-600">{app.desc}</p>
                        </div>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-700">
                        {content.cta} →
                    </div>
                </a>
            );
        })}
    </section>
);

export default AppsGrid;