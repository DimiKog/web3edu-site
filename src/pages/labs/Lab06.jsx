import React from "react";
import LabTemplate from "./LabTemplate";

import lab06HeroImg from "../../assets/labs/lab06-consensus-finality-diagram.jpg";

const Lab06 = () => {
    return (
        <LabTemplate
            labId="lab06"
            title="Lab 06 — Consensus & Finality"
            subtitle="Understand how distributed systems agree on one truth without a central authority"
            conceptualFocusText={
                "This lab explores how blockchain networks reach agreement on the order of transactions and blocks. You will learn what consensus is, who participates in it, why temporary forks can happen, and how finality guarantees that a block will never be reverted. The focus is on understanding trust at the protocol level, not on cryptographic or mathematical details."
            }
            heroImage={lab06HeroImg}
            level="Beginner"
            estimatedTime="15-20 minutes"
            tools={[
                "Block Explorer",
                "Besu Edu-Net (QBFT)",
            ]}
            prerequisites={[
                "Completed Lab 04 — Transactions & Gas",
                "Completed Lab 05 — Smart Contracts & State",
            ]}
            interactionPath="/labs/lab06/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-06-consensus-finality/README.md"
            xp={300}
            badge="Consensus Explorer"
            completionMessage="Completed Lab 06 — Consensus & Finality"
        />
    );
};

export default Lab06;