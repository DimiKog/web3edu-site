import { BookOpenCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm05EducationalLedgerPanel from "../../components/learning-modules/Lm05EducationalLedgerPanel.jsx";
import { getLm05EducationalLedgerCopy } from "../../content/lm05EducationalLedgerLocale.js";

export default function Lm05EducationalLedgerPage({ lang = "en" }) {
  const copy = getLm05EducationalLedgerCopy(lang);

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM05"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={BookOpenCheck}
      density="compact"
    >
      <Lm05EducationalLedgerPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
