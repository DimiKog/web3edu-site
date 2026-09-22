import { Network } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm06EducationalLedgerConsensusPanel from "../../components/learning-modules/Lm06EducationalLedgerConsensusPanel.jsx";
import { getLm06EducationalLedgerCopy } from "../../content/lm06EducationalLedgerLocale.js";

export default function Lm06EducationalLedgerPage({ lang = "en" }) {
  const copy = getLm06EducationalLedgerCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM06"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={Network}
      density="compact"
    >
      <Lm06EducationalLedgerConsensusPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
