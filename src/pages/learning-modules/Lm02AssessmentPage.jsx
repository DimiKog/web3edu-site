import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm02AssessmentPanel from "../../components/learning-modules/Lm02AssessmentPanel.jsx";
import { getLm02AssessmentCopy } from "../../content/lm02AssessmentLocale.js";

export default function Lm02AssessmentPage({ lang = "en" }) {
  const copy = getLm02AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM02"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm02AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
