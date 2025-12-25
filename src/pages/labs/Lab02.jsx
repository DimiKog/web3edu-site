import React from "react";
import LabTemplate from "./LabTemplate";

import lab02HeroImg from "../../assets/labs/lab02-encrypted-messages-diagram.jpg";

const Lab02 = () => {
    return (
        <LabTemplate
            labId="lab02"
            title="Lab 02 — Encrypted Messages"
            subtitle="Understand how private communication works in Web3 using cryptographic keys"
            conceptualFocusText={
                "This lab explores how encrypted communication works in Web3 using public-key cryptography. You will learn how identities are created from keys, how messages are encrypted off-chain using public keys, and why the blockchain is not responsible for confidentiality."
            }
            heroImage={lab02HeroImg}
            level="Beginner"
            estimatedTime="25–35 minutes"
            tools={[
                "Key Generator",
                "Message Encryptor",
                "Message Decryptor",
            ]}
            prerequisites={[
                "Modern browser (Chrome / Firefox / Brave)",
                "Basic understanding of wallets and addresses (Lab 01)",
            ]}
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-02-encrypted-messages/README.md"
            xp={150}
            badge="Encryption Explorer"
            completionMessage="Completed Lab 02 — Encrypted Messages"
        />
    );
};

export default Lab02;