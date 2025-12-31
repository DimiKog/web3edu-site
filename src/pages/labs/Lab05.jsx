import React from "react";
import LabTemplate from "./LabTemplate";

import lab05HeroImg from "../../assets/labs/lab05-smart-contracts-state-diagram.jpg";

const Lab05 = () => {
    return (
        <LabTemplate
            labId="lab05"
            title="Lab 05 — Smart Contracts & State"
            subtitle="Understand how smart contracts store state and how transactions change it"
            conceptualFocusText={
                "This lab introduces smart contracts as stateful programs running on the blockchain. You will observe how contract state exists independently of wallets, how functions are executed via transactions, and how state changes persist after block inclusion."
            }
            heroImage={lab05HeroImg}
            level="Beginner"
            estimatedTime="20–30 minutes"
            tools={[
                "Wallet (MetaMask or equivalent)",
                "Besu Edu-Net RPC",
                "Simple Counter Contract",
                "Block Explorer",
                "Faucet (optional)",
            ]}
            prerequisites={[
                "Completed Lab 01 — Wallets & Web3 Identity",
                "Understanding of transactions & gas (Lab 04)",
            ]}
            interactionPath="/labs/lab05/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-05-smart-contracts/README.md"
            xp={250}
            badge="Smart Contract Explorer"
            completionMessage="Completed Lab 05 — Smart Contracts & State"
        />
    );
};

export default Lab05;
