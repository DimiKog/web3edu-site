const API_BASE =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    "https://web3edu-api.dimikog.org";

export function getAdminApiBase() {
    return API_BASE;
}

function normalizeAdminWallet(wallet) {
    return String(wallet || "").trim().toLowerCase();
}

export async function fetchAdminOverview(wallet) {
    const adminWallet = normalizeAdminWallet(wallet);
    if (!adminWallet) throw new Error("Admin wallet missing");
    const res = await fetch(
        `${API_BASE}/admin/overview?wallet=${adminWallet}`
    );

    if (!res.ok) {
        throw new Error("Not authorized");
    }

    return res.json();
}

export async function fetchLabsSummary(wallet) {
    const adminWallet = normalizeAdminWallet(wallet);
    if (!adminWallet) throw new Error("Admin wallet missing");
    const res = await fetch(
        `${API_BASE}/admin/labs/summary?wallet=${adminWallet}`
    );

    if (!res.ok) {
        throw new Error("Not authorized");
    }

    // Return full response so caller can access both platform and labs
    return res.json();
}

export async function fetchAdminUsers(wallet) {
    const adminWallet = normalizeAdminWallet(wallet);
    if (!adminWallet) throw new Error("Admin wallet missing");

    const res = await fetch(`${API_BASE}/admin/users?wallet=${adminWallet}`);
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
}

export async function fetchAdminUserDetails(wallet, userWallet) {
    const adminWallet = normalizeAdminWallet(wallet);
    const target = String(userWallet || "").trim();
    if (!adminWallet) throw new Error("Admin wallet missing");
    if (!target) throw new Error("Target wallet missing");

    const res = await fetch(
        `${API_BASE}/admin/users/details?wallet=${adminWallet}&user=${encodeURIComponent(target)}`
    );
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
}

export async function fetchAdminLabDetails(wallet, labId) {
    const adminWallet = normalizeAdminWallet(wallet);
    const id = String(labId || "").trim();
    if (!adminWallet) throw new Error("Admin wallet missing");
    if (!id) throw new Error("Lab id missing");

    const res = await fetch(
        `${API_BASE}/admin/labs/details?wallet=${adminWallet}&labId=${encodeURIComponent(id)}&enrich=1`
    );
    if (!res.ok) throw new Error("Not authorized");
    return res.json();
}