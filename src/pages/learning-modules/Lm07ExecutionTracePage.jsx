import { GitBranch } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm07ExecutionTracePanel from "../../components/learning-modules/Lm07ExecutionTracePanel.jsx";
import { getLm07ExecutionTraceCopy } from "../../content/lm07ExecutionTraceLocale.js";

export default function Lm07ExecutionTracePage({ lang = "en" }) {
  const copy = getLm07ExecutionTraceCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM07"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={GitBranch}
      density="compact"
    >
      <Lm07ExecutionTracePanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
