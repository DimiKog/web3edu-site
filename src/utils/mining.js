import { keccak_256 } from "@noble/hashes/sha3";

export function hashBlock({ previousHash = "0x" + "0".repeat(64), transactions = [], nonce = 0 }) {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const input = JSON.stringify({
        previousHash,
        transactions: safeTransactions,
        nonce,
    });

    const bytes = new TextEncoder().encode(input);

    const hashArray = Array.from(keccak_256(bytes));

    return (
        "0x" +
        hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    );
}

export function createGenesisBlock() {
    const zeroHash = "0x" + "0".repeat(64);

    return {
        index: 0,
        previousHash: zeroHash,
        transactions: [],
        nonce: 0,
        hash: zeroHash,
        blockDifficulty: 0,
    };
}