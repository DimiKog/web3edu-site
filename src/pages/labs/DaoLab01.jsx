import React from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "../../context/IdentityContext.jsx";
import LabTemplate from "./LabTemplate";
import daoLab01HeroImg from "../../assets/labs/daolab01.webp";
import { useLabAutoStartOnce } from "../../hooks/useLabAutoStartOnce.js";

const DaoLab01 = () => {
    const { address } = useAccount();
    const { smartAccount } = useIdentity();
    useLabAutoStartOnce({ labId: "dao01", smartAccount, address });

    return (
        <LabTemplate
            labId="dao01"
            title="DAO Lab 01 — 🗳 Governance & Voting"
            subtitle="Explore proposals, voting power, and collective decisions through a DAO simulation"
            conceptualFocusText="This lab introduces decentralized governance through a guided DAO voting simulation. You will explore how proposals are created, how voting power works, and how collective decisions are formed using real wallet signatures in a controlled, educational setting."
            heroImage={daoLab01HeroImg}
            level="Intermediate"
            estimatedTime="10 minutes"
            tools={[
                "Proposal simulator",
                "Wallet signature flow",
                "Vote tally visualizer",
            ]}
            prerequisites={[
                "Modern browser (Chrome / Firefox / Brave)",
                "Browser wallet (MetaMask or equivalent)",
                "Read-only access to the DAO simulation environment",
            ]}
            interactionPath="/labs/dao-01/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs"
            xp={400}
            badge="Governance Explorer"
            labels={{
                headerPill: "🧪 Web3Edu · DAO Lab",
                heroCaption:
                    "Governance becomes tangible through proposals, voting power, and collective intent.",
                conceptualFocus: "Conceptual focus",
            }}
        />
    );
};

export default DaoLab01;
