const API_BASE =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    "https://web3edu-api.dimikog.org";

export function getAdminApiBase() {
    return API_BASE;
}

function adminAuthHeaders(idToken) {
    if (!idToken || typeof idToken !== "string" || !idToken.trim()) {
        throw new Error("Admin session token missing");
    }
    return {
        Authorization: `Bearer ${idToken.trim()}`,
        Accept: "application/json",
    };
}

async function adminGet(path, idToken) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "GET",
        headers: adminAuthHeaders(idToken),
    });
    if (!res.ok) {
        throw new Error("Not authorized");
    }
    return res.json();
}

export async function fetchAdminOverview(idToken) {
    return adminGet("/admin/overview", idToken);
}

export async function fetchLabsSummary(idToken) {
    return adminGet("/admin/labs/summary", idToken);
}

export async function fetchAdminUsers(idToken) {
    return adminGet("/admin/users", idToken);
}

export async function fetchAdminUserDetails(idToken, userWallet) {
    const target = String(userWallet || "").trim();
    if (!target) throw new Error("Target wallet missing");
    return adminGet(
        `/admin/users/details?user=${encodeURIComponent(target)}`,
        idToken
    );
}

export async function fetchAdminLabDetails(idToken, labId) {
    const id = String(labId || "").trim();
    if (!id) throw new Error("Lab id missing");
    return adminGet(
        `/admin/labs/details?labId=${encodeURIComponent(id)}&enrich=1`,
        idToken
    );
}

export async function fetchAdminFeedback(idToken) {
    return adminGet("/admin/feedback", idToken);
}
