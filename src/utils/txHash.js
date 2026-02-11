export function extractTxHash(value) {
    if (!value) return null;
    if (typeof value !== "string") {
        try {
            value = JSON.stringify(value);
        } catch {
            return null;
        }
    }
    const match = value.match(/0x[a-fA-F0-9]{64}/);
    return match ? match[0] : null;
}
