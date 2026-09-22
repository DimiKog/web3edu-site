import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm06AssessmentPanel from "../../components/learning-modules/Lm06AssessmentPanel.jsx";
import { getLm06AssessmentCopy } from "../../content/lm06AssessmentLocale.js";

export default function Lm06AssessmentPage({ lang = "en" }) {
  const copy = getLm06AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM06"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm06AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
