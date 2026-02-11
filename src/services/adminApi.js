const API_BASE = import.meta.env.VITE_API_URL || "https://web3edu-api.dimikog.org";

export async function fetchAdminOverview(wallet) {
    const res = await fetch(
        `${API_BASE}/admin/overview?wallet=${wallet.toLowerCase()}`
    );

    if (!res.ok) {
        throw new Error("Not authorized");
    }

    return res.json();
}

export async function fetchLabsSummary(wallet) {
    const res = await fetch(
        `${API_BASE}/admin/labs/summary?wallet=${wallet.toLowerCase()}`
    );

    if (!res.ok) {
        throw new Error("Not authorized");
    }

    const data = await res.json();
    return data.labs || [];
}