/**
 * Admin API client: Bearer OIDC, no wallet-as-credential.
 * Run: node --test src/utils/*.node-test.js
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, "..");
const adminApiSrc = readFileSync(join(srcRoot, "services/adminApi.js"), "utf8");
const eligibilitySrc = readFileSync(join(srcRoot, "utils/adminEligibility.js"), "utf8");
const hookSrc = readFileSync(join(srcRoot, "hooks/useAdminEligibility.js"), "utf8");

function collectJsx(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) out.push(...collectJsx(full));
    else if (name.name.endsWith(".js") || name.name.endsWith(".jsx")) {
      out.push({ path: full, src: readFileSync(full, "utf8") });
    }
  }
  return out;
}

test("adminApi sends Authorization Bearer from idToken", () => {
  assert.match(adminApiSrc, /Authorization:\s*`Bearer \$\{idToken/);
  assert.match(adminApiSrc, /function adminAuthHeaders\(idToken\)/);
  assert.match(adminApiSrc, /export async function fetchAdminOverview\(idToken\)/);
  assert.match(adminApiSrc, /export async function fetchLabsSummary\(idToken\)/);
  assert.match(adminApiSrc, /export async function fetchAdminUsers\(idToken\)/);
  assert.match(adminApiSrc, /export async function fetchAdminUserDetails\(idToken, userWallet\)/);
  assert.match(adminApiSrc, /export async function fetchAdminLabDetails\(idToken, labId\)/);
  assert.match(adminApiSrc, /export async function fetchAdminFeedback\(idToken\)/);
});

test("adminApi does not use wallet as authorization", () => {
  assert.doesNotMatch(adminApiSrc, /\?wallet=/);
  assert.doesNotMatch(adminApiSrc, /adminWallet/);
  assert.doesNotMatch(adminApiSrc, /wallet=\$\{/);
  assert.doesNotMatch(adminApiSrc, /encodeURIComponent\(.*wallet/);
});

test("adminApi never puts the token in URL, localStorage, sessionStorage, or logs", () => {
  assert.doesNotMatch(adminApiSrc, /localStorage/);
  assert.doesNotMatch(adminApiSrc, /sessionStorage/);
  assert.doesNotMatch(adminApiSrc, /console\.(log|debug|info|warn)/);
  assert.doesNotMatch(adminApiSrc, /\$\{API_BASE\}.*idToken/);
  assert.doesNotMatch(adminApiSrc, /[?&]token=/);
});

test("admin user details keeps learner `user=` as a resource selector only", () => {
  assert.match(adminApiSrc, /\/admin\/users\/details\?user=\$\{encodeURIComponent\(target\)\}/);
});

test("frontend allowlist remains UX-only (VITE_ADMIN_WALLETS not used by adminApi)", () => {
  assert.doesNotMatch(adminApiSrc, /VITE_ADMIN_WALLETS/);
  assert.match(eligibilitySrc, /VITE_ADMIN_WALLETS/);
});

test("admin callers pass idToken, not an admin wallet, to adminApi", () => {
  const files = [
    join(srcRoot, "pages/AdminDashboard.jsx"),
    join(srcRoot, "pages/admin/AdminLayout.jsx"),
    join(srcRoot, "pages/admin/AdminLabsPage.jsx"),
    join(srcRoot, "pages/admin/AdminLabDetails.jsx"),
    join(srcRoot, "pages/admin/AdminUsersPage.jsx"),
    join(srcRoot, "pages/admin/AdminUserDetailsPage.jsx"),
    join(srcRoot, "pages/admin/AdminFeedbackPage.jsx"),
  ];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    assert.match(src, /idToken/, file);
    assert.doesNotMatch(src, /fetchAdmin\w+\(adminWalletAddress/, file);
    assert.doesNotMatch(src, /fetchLabsSummary\(adminWalletAddress/, file);
    assert.doesNotMatch(src, /\?wallet=\$\{/, file);
  }
});

test("no admin page generates ?wallet=<admin> auth queries", () => {
  const pages = collectJsx(join(srcRoot, "pages"));
  for (const file of pages) {
    assert.doesNotMatch(file.src, /\/admin\/[^'"\s]*\?wallet=/, file.path);
  }
  assert.doesNotMatch(adminApiSrc, /\/admin\/[^'"\s]*\?wallet=/);
});

test("hook exposes idToken for admin API and does not persist it", () => {
  assert.match(hookSrc, /idToken,/);
  assert.match(hookSrc, /getIdTokenFromAuth/);
  assert.doesNotMatch(hookSrc, /localStorage/);
  assert.doesNotMatch(hookSrc, /sessionStorage/);
});

test("wallet-only admin UI is no longer treated as privileged admin", () => {
  assert.match(
    eligibilitySrc,
    /function computeWalletOnlyAdminEligibility[\s\S]*isAdminEligible:\s*false/
  );
  assert.match(
    eligibilitySrc,
    /return \{ isAdminEligible: false, adminWalletAddress: null, pending: false \};/
  );
});
