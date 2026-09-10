import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm03AssessmentPanel from "../../components/learning-modules/Lm03AssessmentPanel.jsx";
import { getLm03AssessmentCopy } from "../../content/lm03AssessmentLocale.js";

export default function Lm03AssessmentPage({ lang = "en" }) {
  const copy = getLm03AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM03"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm03AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
