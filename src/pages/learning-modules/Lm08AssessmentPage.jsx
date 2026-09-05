import { ClipboardCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm08AssessmentPanel from "../../components/learning-modules/Lm08AssessmentPanel.jsx";
import { getLm08AssessmentCopy } from "../../content/lm08AssessmentLocale.js";

export default function Lm08AssessmentPage({ lang = "en" }) {
  const copy = getLm08AssessmentCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM08"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ClipboardCheck}
      density="compact"
    >
      <Lm08AssessmentPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
