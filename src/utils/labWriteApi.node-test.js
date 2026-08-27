/**
 * Lab write API: Bearer OIDC on /labs/start and /labs/complete.
 * Run: node --test src/utils/labWriteApi.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const labWritePath = join(__dirname, "labWriteApi.js");
const autoStartPath = join(__dirname, "../hooks/useLabAutoStartOnce.js");
const argsHookPath = join(__dirname, "../hooks/useEducationalIdentityArgs.js");
const claimPath = join(__dirname, "../components/LabCompletionClaim.jsx");
const templatePath = join(__dirname, "../pages/labs/LabTemplate.jsx");

function read(path) {
  return readFileSync(path, "utf8");
}

test("postLabsStart sends Authorization Bearer from idToken", () => {
  const src = read(labWritePath);
  assert.match(src, /function buildLabWriteAuthHeaders\(idToken\)/);
  assert.match(src, /Authorization:\s*`Bearer \$\{idToken\.trim\(\)\}`/);
  assert.match(src, /export async function postLabsStart/);
  assert.match(src, /normalizeIdToken\(idToken\)/);
  assert.match(src, /fetch\(`\$\{base\}\/labs\/start`/);
  assert.match(src, /headers,\s*\n\s*body: JSON\.stringify\(body\)/);
  assert.equal(src.includes("X-API-KEY"), false);
  assert.equal(src.includes("VITE_XP_SECRET"), false);
});

test("postLabsStart defers (204) when idToken is missing", () => {
  const src = read(labWritePath);
  const startFn = src.slice(src.indexOf("export async function postLabsStart"));
  const end = startFn.indexOf("export async function postLabsComplete");
  const body = end === -1 ? startFn : startFn.slice(0, end);
  assert.match(body, /if \(!token\)/);
  assert.match(body, /status:\s*204/);
  assert.match(body, /input\.deferred/);
});

test("postLabsComplete sends Authorization Bearer and keeps wallet/owner compatibility", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postLabsComplete/);
  const completeFn = src.slice(src.indexOf("export async function postLabsComplete"));
  const end = completeFn.indexOf("export async function postCoding01VerifyContract");
  const body = end === -1 ? completeFn : completeFn.slice(0, end);
  assert.match(body, /fetch\(`\$\{base\}\/labs\/complete`/);
  assert.match(body, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(body, /body\.wallet\s*=/);
  assert.match(body, /body\.owner\s*=/);
  assert.equal(body.includes("X-API-KEY"), false);
  assert.equal(body.includes("VITE_XP_SECRET"), false);
  assert.match(body, /missing_bearer_token/);
});

test("useEducationalIdentityArgs exposes SocialIdentityContext idToken", () => {
  const src = read(argsHookPath);
  assert.match(src, /idToken/);
  assert.match(src, /useSocialIdentity/);
  assert.match(src, /idToken,/);
});

test("useLabAutoStartOnce waits for idToken before starting", () => {
  const src = read(autoStartPath);
  assert.match(src, /identityArgs\.idToken/);
  assert.match(src, /if \(!idToken\) return/);
  assert.match(src, /postLabsStart\(/);
  assert.match(src, /idToken,/);
  assert.match(src, /res\.status === 204/);
  assert.match(src, /startedPairRef\.current = null/);
});

test("LabTemplate does not fire start without idToken", () => {
  const src = read(templatePath);
  assert.match(src, /identityArgs\.idToken/);
  assert.match(src, /if \(!idToken\) return/);
  assert.match(src, /postLabsStart\(/);
  assert.match(src, /idToken,/);
});

test("LabCompletionClaim uses postLabsComplete with Bearer idToken", () => {
  const src = read(claimPath);
  assert.match(src, /postLabsComplete/);
  assert.match(src, /identityArgs\.idToken/);
  assert.match(src, /signInRequiredError/);
  assert.match(src, /idToken,/);
  assert.equal(src.includes("X-API-KEY"), false);
  assert.equal(src.includes("VITE_XP_SECRET"), false);
  assert.equal(src.includes("${BACKEND}/labs/complete"), false);
});

test("OIDC social AA identity input remains preferred (Case A / Case B compatible)", () => {
  // Source-level contract: educational helper still prefers social AA when present.
  const edu = read(join(__dirname, "educationalIdentityInput.js"));
  assert.match(edu, /IDENTITY_INPUT_SOCIAL_AA/);
  assert.match(edu, /if \(socialAa\)/);
  assert.match(edu, /identityInput:\s*socialAa/);
});
