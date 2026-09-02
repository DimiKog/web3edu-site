import { FileCode2 } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm08SourceVerificationPanel from "../../components/learning-modules/Lm08SourceVerificationPanel.jsx";
import { LM08_SOURCE_VERIFICATION_COPY } from "../../content/lm08SourceVerificationLocale.js";

export default function Lm08SourceVerificationPage({ lang = "en" }) {
    const copy = LM08_SOURCE_VERIFICATION_COPY[lang] || LM08_SOURCE_VERIFICATION_COPY.en;

    return (
        <LearningModuleActivityShell
            lang={lang}
            moduleId="LM08"
            title={copy.title}
            subtitle={copy.subtitle}
            icon={FileCode2}
        >
            <Lm08SourceVerificationPanel lang={lang} />
        </LearningModuleActivityShell>
    );
}
