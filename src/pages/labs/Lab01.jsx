import React from "react";
import LabTemplate from "./LabTemplate";
import lab01HeroImg from "../../assets/labs/lab01-identity-diagram.png";

const Lab01 = () => {
    return (
        <LabTemplate
            labId="lab01"
            title="Lab 01 — Wallets & Web3 Identity"
            subtitle="Understand wallets, addresses, and identity before transactions"
            conceptualFocusText="This lab introduces the foundations of Web3 identity. You will explore how wallets and addresses establish identity on a permissioned Ethereum network, before any transactions or smart contracts are involved."
            heroImage={lab01HeroImg}
            level="Beginner"
            estimatedTime="15–20 minutes"
            tools={[
                "Network Identifier",
                "Address Anatomy",
                "Identity Scope Visualizer",
            ]}
            prerequisites={[
                "Modern browser (Chrome / Firefox / Brave)",
                "Browser wallet (MetaMask or equivalent)",
                "Besu Edu-Net RPC details",
            ]}
            interactionPath="/labs/wallets-keys/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-01-wallets-identity/README.md"
            xp={100}
            badge="Identity Explorer"
            completionMessage="Completed Lab 01 — Wallets & Web3 Identity"
        />
    );
};

export default Lab01;
