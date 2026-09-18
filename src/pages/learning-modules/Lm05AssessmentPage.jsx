import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm05AssessmentPanel from "../../components/learning-modules/Lm05AssessmentPanel.jsx";
import { getLm05AssessmentCopy } from "../../content/lm05AssessmentLocale.js";

export default function Lm05AssessmentPage({ lang = "en" }) {
  const copy = getLm05AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM05"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm05AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
