import { ShieldCheck } from "lucide-react";
import LearningModuleActivityShell from "../../components/learning-modules/LearningModuleActivityShell.jsx";
import Lm08ContractInspectionPanel from "../../components/learning-modules/Lm08ContractInspectionPanel.jsx";
import { LM08_CONTRACT_INSPECTION_COPY } from "../../content/lm08ContractInspectionLocale.js";

export default function Lm08ContractInspectionPage({ lang = "en" }) {
  const copy = LM08_CONTRACT_INSPECTION_COPY[lang] || LM08_CONTRACT_INSPECTION_COPY.en;

  return (
    <LearningModuleActivityShell
      lang={lang}
      moduleId="LM08"
      title={copy.title}
      subtitle={copy.subtitle}
      icon={ShieldCheck}
    >
      <Lm08ContractInspectionPanel lang={lang} />
    </LearningModuleActivityShell>
  );
}
