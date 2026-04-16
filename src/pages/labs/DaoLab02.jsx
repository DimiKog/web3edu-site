import React from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../../context/IdentityContext.jsx";
import LabTemplate from "./LabTemplate";
import daoLab02HeroImg from "../../assets/labs/daolab02.webp";
import { useLabAutoStartOnce } from "../../hooks/useLabAutoStartOnce.js";

const DaoLab02 = () => {
    const { address } = useAccount();
    const { smartAccount } = useIdentity();
    useLabAutoStartOnce({ labId: "dao02", smartAccount, address });

    return (
        <LabTemplate
            labId="dao02"
            title="DAO Lab 02 — 🏛 Governance Models & Power Dynamics"
            subtitle="Design voting rules, simulate power distribution, and observe how governance outcomes change"
            conceptualFocusText="This lab explores how governance outcomes depend on the design of voting power, quorum requirements, and approval thresholds. You will simulate different governance models and observe how identical votes can lead to different outcomes depending on the rule set applied."
            heroImage={daoLab02HeroImg}
            level="Advanced"
            estimatedTime="10-15 minutes"
            tools={[
                "Governance model selector",
                "Voting power simulator",
                "Quorum & threshold calculator",
                "Outcome visualizer",
            ]}
            prerequisites={[
                "Completion of DAO Lab 01",
                "Modern browser (Chrome / Firefox / Brave)",
                "Browser wallet (MetaMask or equivalent)",
            ]}
            interactionPath="/labs/dao-02/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs"
            xp={500}
            badge="Governance Designer"
            labels={{
                headerPill: "🧪 Web3Edu · DAO Lab",
                heroCaption:
                    "Governance is not just about voting — it is about rule design and power distribution.",
                conceptualFocus: "Conceptual focus",
            }}
        />
    );
};

export default DaoLab02;
