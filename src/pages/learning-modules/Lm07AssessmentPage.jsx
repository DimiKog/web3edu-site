import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm07AssessmentPanel from "../../components/learning-modules/Lm07AssessmentPanel.jsx";
import { getLm07AssessmentCopy } from "../../content/lm07AssessmentLocale.js";

export default function Lm07AssessmentPage({ lang = "en" }) {
  const copy = getLm07AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM07"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm07AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
