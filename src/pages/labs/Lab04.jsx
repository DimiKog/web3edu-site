import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import LabTemplate from "./LabTemplate";

import lab04HeroImg from "../../assets/labs/lab04-transactions-gas-diagram.webp";

const Lab04 = () => {
    const { address } = useAccount();

    useEffect(() => {
        if (!address) return;

        let cancelled = false;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/labs/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wallet: address,
                labId: "lab04"
            })
        }).catch(() => { });

        return () => { cancelled = true; };
    }, [address]);

    return (
        <LabTemplate
            labId="lab04"
            title="Lab 04 — Transactions & Gas"
            subtitle="Understand how state changes happen on-chain and why gas exists"
            conceptualFocusText={
                "This lab introduces blockchain transactions as state-changing operations. You will observe how balances and nonces exist before transactions, how transactions are built and signed, why gas is required, and how execution changes on-chain state after inclusion in a block."
            }
            heroImage={lab04HeroImg}
            level="Beginner"
            estimatedTime="15–20 minutes"
            tools={[
                "Wallet (MetaMask or equivalent)",
                "Besu Edu-Net RPC",
                "Block Explorer",
                "Faucet (EDU-D test funds)",
            ]}
            prerequisites={[
                "Completed Lab 01 — Wallets & Web3 Identity",
                "Basic understanding of encryption & signatures (Labs 02–03)",
            ]}
            interactionPath="/labs/lab04/interaction"
            readmeUrl="https://github.com/DimiKog/web3edu-labs/blob/main/lab-04-transactions-gas/README.md"
            xp={200}
            badge="Transaction Explorer"
            completionMessage="Completed Lab 04 — Transactions & Gas"
        />
    );
};

export default Lab04;