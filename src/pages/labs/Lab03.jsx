import React from "react";
import LabTemplate from "./LabTemplate";

import lab03HeroImg from "../../assets/labs/lab03-message-signing-diagram.jpg";

const Lab03 = () => {
    return (
        <LabTemplate
            labId="lab03"
            title="Lab 03 — Message Signing & Ownership"
            subtitle="Prove ownership and intent using cryptographic signatures"
            conceptualFocusText={
                "This lab explores how message signing works in Web3 and how cryptographic signatures are used to prove ownership and intent without revealing private keys or sending transactions. You will learn how signatures differ from encryption, how ownership is verified off-chain, and why signing is foundational for authentication, DAOs, and Web3 identity."
            }
            heroImage={lab03HeroImg}
            level="Beginner"
            estimatedTime="10–15 minutes"
            tools={[
                "Message Signer",
                "Signature Verifier",
            ]}
            prerequisites={[
                "Modern browser (Chrome / Firefox / Brave)",
                "Understanding of wallets and addresses (Lab 01)",
                "Understanding of keys and confidentiality (Lab 02)",
            ]}
            interactionPath="/labs/lab03/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-03-message-signing/README.md"
            xp={150}
            badge="Ownership Prover"
            completionMessage="Completed Lab 03 — Message Signing & Ownership"
        />
    );
};

export default Lab03;