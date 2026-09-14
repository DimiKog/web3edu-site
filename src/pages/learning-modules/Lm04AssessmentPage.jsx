import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm04AssessmentPanel from "../../components/learning-modules/Lm04AssessmentPanel.jsx";
import { getLm04AssessmentCopy } from "../../content/lm04AssessmentLocale.js";

export default function Lm04AssessmentPage({ lang = "en" }) {
  const copy = getLm04AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM04"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm04AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
