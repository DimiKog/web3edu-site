import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm01AssessmentPanel from "../../components/learning-modules/Lm01AssessmentPanel.jsx";
import { getLm01AssessmentCopy } from "../../content/lm01AssessmentLocale.js";

export default function Lm01AssessmentPage({ lang = "en" }) {
  const copy = getLm01AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM01"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
    >
      <Lm01AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
