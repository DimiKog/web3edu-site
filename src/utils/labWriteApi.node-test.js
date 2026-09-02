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

test("postProjectsCompleteAnswer sends Authorization Bearer from idToken", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postProjectsCompleteAnswer/);
  const fn = src.slice(src.indexOf("export async function postProjectsCompleteAnswer"));
  const end = fn.indexOf("export async function postLabsComplete");
  const body = end === -1 ? fn : fn.slice(0, end);
  assert.match(body, /normalizeIdToken\(idToken\)/);
  assert.match(body, /fetch\(`\$\{base\}\/projects\/complete-answer`/);
  assert.match(body, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(body, /body\.wallet\s*=/);
  assert.equal(body.includes("X-API-KEY"), false);
  assert.equal(body.includes("VITE_XP_SECRET"), false);
  assert.match(body, /missing_bearer_token/);
  assert.match(body, /if \(!token\)/);
});

test("ProjectDetail POSTs complete-answer via postProjectsCompleteAnswer with idToken", () => {
  const detail = read(join(__dirname, "../pages/ProjectDetail.jsx"));
  assert.match(detail, /postProjectsCompleteAnswer/);
  assert.match(detail, /educationalIdentityArgs\.idToken/);
  assert.match(detail, /idToken,/);
  assert.equal(detail.includes("${getWeb3eduBackendUrl()}/projects/complete-answer"), false);
  assert.equal(detail.includes("X-API-KEY"), false);
  assert.equal(detail.includes("VITE_XP_SECRET"), false);
  assert.match(detail, /signInMissing/);
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

test("fetchProjectsPoeStatus sends Authorization Bearer when idToken present", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function fetchProjectsPoeStatus/);
  const fn = src.slice(src.indexOf("export async function fetchProjectsPoeStatus"));
  const end = fn.indexOf("export async function postLabsComplete");
  const body = end === -1 ? fn : fn.slice(0, end);
  assert.match(body, /buildLabWriteAuthHeaders\(idToken\)/);
  assert.match(body, /\/projects\/poe\/status\?/);
});

test("useResolvedIdentity sends Bearer on self /web3sbt/resolve when idToken provided", () => {
  const src = read(join(__dirname, "../hooks/useResolvedIdentity.js"));
  assert.match(src, /idToken: bearerToken/);
  assert.match(src, /headers\.Authorization = `Bearer \$\{idToken\.trim\(\)\}`/);
});

test("ResolvedIdentityProvider passes idToken only when OIDC authenticated", () => {
  const src = read(join(__dirname, "../context/ResolvedIdentityProvider.jsx"));
  assert.match(src, /isOidcAuthenticated \? idToken : null/);
});

test("Labs and ProjectLabTemplate use fetchProjectsPoeStatus with idToken", () => {
  const labs = read(join(__dirname, "../pages/Labs.jsx"));
  const template = read(join(__dirname, "../pages/labs/ProjectLabTemplate.jsx"));
  assert.match(labs, /fetchProjectsPoeStatus/);
  assert.match(labs, /idToken: oidcIdToken/);
  assert.match(template, /fetchProjectsPoeStatus/);
  assert.match(template, /idToken: oidcIdToken/);
});

test("OIDC social AA identity input remains preferred (Case A / Case B compatible)", () => {
  // Source-level contract: educational helper still prefers social AA when present.
  const edu = read(join(__dirname, "educationalIdentityInput.js"));
  assert.match(edu, /IDENTITY_INPUT_SOCIAL_AA/);
  assert.match(edu, /if \(socialAa\)/);
  assert.match(edu, /identityInput:\s*socialAa/);
});

test("postCoding01VerifyContract sends Authorization Bearer from idToken", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postCoding01VerifyContract/);
  const fn = src.slice(src.indexOf("export async function postCoding01VerifyContract"));
  const end = fn.indexOf("export async function postCoding01AttributeDeployment");
  const body = end === -1 ? fn : fn.slice(0, end);
  assert.match(body, /normalizeIdToken\(idToken\)/);
  assert.match(body, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(body, /fetch\(`\$\{base\}\/labs\/coding01\/verify-contract`/);
  assert.match(body, /contractAddress:\s*addr/);
  assert.match(body, /missing_bearer_token/);
  assert.equal(body.includes("getEffectiveLabsWalletIdentity"), false);
});

test("postCoding01AttributeDeployment sends Authorization Bearer with empty body", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postCoding01AttributeDeployment/);
  const fn = src.slice(src.indexOf("export async function postCoding01AttributeDeployment"));
  const end = fn.indexOf("export async function postCoding02StartInteraction");
  const body = end === -1 ? fn : fn.slice(0, end);
  assert.match(body, /normalizeIdToken\(idToken\)/);
  assert.match(body, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(body, /fetch\(`\$\{base\}\/labs\/coding01\/attribute-deployment`/);
  assert.match(body, /body:\s*JSON\.stringify\(\{\}\)/);
  assert.match(body, /missing_bearer_token/);
  assert.equal(body.includes("contractAddress"), false);
  assert.equal(body.includes("deployerAddress"), false);
});

test("fetchCoding01Status sends Bearer GET with no authority fields", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function fetchCoding01Status/);
  const start = src.indexOf("export async function fetchCoding01Status");
  const end = src.indexOf("/**\n * POST /labs/coding01/verify-contract");
  const fn = src.slice(start, end);
  assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(fn, /\/labs\/coding01\/status`/);
  assert.match(fn, /method:\s*"GET"/);
  assert.equal(fn.includes("wallet"), false);
  assert.equal(fn.includes("contractAddress:"), false);
});

test("CodingLabInteraction1 imports getEffectiveLabsWalletIdentity (ReferenceError guard)", () => {
  const src = read(join(__dirname, "../pages/labs/CodingLabInteraction1.jsx"));
  assert.match(src, /getEffectiveLabsWalletIdentity\(identityArgs\)/);
  assert.match(
    src,
    /import\s*\{[\s\S]*?getEffectiveLabsWalletIdentity[\s\S]*?\}\s*from\s*["']\.\.\/\.\.\/utils\/labWriteApi\.js["']/
  );
});

test("CodingLabInteraction1 passes idToken to postCoding01VerifyContract", () => {
  const src = read(join(__dirname, "../pages/labs/CodingLabInteraction1.jsx"));
  assert.match(src, /postCoding01VerifyContract/);
  assert.match(src, /identityArgs\.idToken/);
  assert.match(src, /contractAddress:\s*normalizedAddress/);
});

test("CodingLabInteraction1 triggers deployment attribution without authority fields", () => {
  const src = read(join(__dirname, "../pages/labs/CodingLabInteraction1.jsx"));
  assert.match(src, /postCoding01AttributeDeployment/);
  assert.match(src, /attributeDeployment/);
  assert.match(src, /deploymentDeployerNotBound/);
  assert.match(src, /idToken:\s*identityArgs\.idToken/);
  assert.equal(src.includes("contractAddress:"), true);
  assert.match(src, /contractAddress:\s*normalizedAddress/);
});

test("fetchLm08ContractInspectionChallenge sends Authorization Bearer", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function fetchLm08ContractInspectionChallenge/);
  const fn = src.slice(src.indexOf("export async function fetchLm08ContractInspectionChallenge"));
  assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(fn, /\/learning-modules\/lm08\/contract-inspection`/);
  assert.match(fn, /method:\s*"GET"/);
  assert.match(fn, /missing_bearer_token/);
});

test("postLm08ContractInspectionAnswers sends answers only with Bearer", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postLm08ContractInspectionAnswers/);
  const fn = src.slice(src.indexOf("export async function postLm08ContractInspectionAnswers"));
  assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(fn, /JSON\.stringify\(\{\s*answers\s*\}\)/);
  assert.match(fn, /method:\s*"POST"/);
  assert.equal(fn.includes("contractAddress"), false);
  assert.equal(fn.includes("deployerAddress"), false);
  assert.equal(fn.includes("deploymentTxHash"), false);
  assert.equal(fn.includes("txHash"), false);
  assert.equal(fn.includes("chainId"), false);
  assert.equal(fn.includes("wallet"), false);
});

test("Lm08ContractInspectionPanel uses Bearer-backed inspection APIs", () => {
  const panel = read(
    join(__dirname, "../components/learning-modules/Lm08ContractInspectionPanel.jsx")
  );
  assert.match(panel, /fetchLm08ContractInspectionChallenge/);
  assert.match(panel, /postLm08ContractInspectionAnswers/);
  assert.match(panel, /identityArgs\.idToken/);
  assert.match(panel, /explorerLinks\?\.contract/);
  assert.match(panel, /explorerLinks\?\.deploymentTransaction/);
});

test("Lm08 contract inspection locale includes EN and GR strings", () => {
  const locale = read(join(__dirname, "../content/lm08ContractInspectionLocale.js"));
  assert.match(locale, /en:\s*\{/);
  assert.match(locale, /gr:\s*\{/);
  assert.match(locale, /Inspect Your Deployed Contract/);
  assert.match(locale, /Επιθεώρηση του Contract που Έκανες Deploy/);
  assert.match(locale, /contract_role/);
  assert.match(locale, /deployer_role/);
  assert.match(locale, /creation_tx_role/);
});

test("postLm08SourceVerification sends Bearer with empty body only", () => {
  const src = read(labWritePath);
  assert.match(src, /export async function postLm08SourceVerification/);
  const fn = src.slice(src.indexOf("export async function postLm08SourceVerification"));
  assert.match(fn, /buildLabWriteAuthHeaders\(token\)/);
  assert.match(fn, /\/learning-modules\/lm08\/source-verification`/);
  assert.match(fn, /method:\s*"POST"/);
  assert.match(fn, /JSON\.stringify\(\{\}\)/);
  assert.equal(fn.includes("contractAddress"), false);
  assert.equal(fn.includes("wallet"), false);
  assert.equal(fn.includes("progressAddress"), false);
  assert.equal(fn.includes("learner"), false);
});

test("Lm08SourceVerificationPanel uses Bearer-backed API without inspection GET", () => {
  const panel = read(
    join(__dirname, "../components/learning-modules/Lm08SourceVerificationPanel.jsx")
  );
  assert.match(panel, /postLm08SourceVerification/);
  assert.match(panel, /identityArgs\.idToken/);
  assert.match(panel, /refetchResolvedIdentity/);
  assert.doesNotMatch(panel, /fetchLm08ContractInspectionChallenge/);
  assert.doesNotMatch(panel, /contract-inspection/);
});

test("Lm08 source verification locale includes EN and GR strings", () => {
  const locale = read(join(__dirname, "../content/lm08SourceVerificationLocale.js"));
  assert.match(locale, /Source-code Verification/);
  assert.match(locale, /Επαλήθευση Πηγαίου Κώδικα/);
  assert.match(locale, /Check Source Verification/);
  assert.match(locale, /Έλεγχος επαλήθευσης κώδικα/);
});

test("routeTable registers source verification EN and GR routes", () => {
  const routes = read(join(__dirname, "../routes/routeTable.jsx"));
  assert.match(routes, /\/learning-modules\/lm08\/source-verification/);
  assert.match(routes, /\/learning-modules-gr\/lm08\/source-verification/);
  assert.match(routes, /Lm08SourceVerificationPage/);
});
