/**
 * LabCompletionClaim must not expose browser credentials on POST /labs/complete.
 * Run: node --test src/utils/labCompletionClaim.node-test.js
 */

import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { globSync } from "glob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "../..");
const claimPath = join(__dirname, "../components/LabCompletionClaim.jsx");

function readClaimSource() {
  return readFileSync(claimPath, "utf8");
}

function readLeakedSecretFromGitHeadEnv() {
  try {
    const headEnv = execSync("git show HEAD:.env 2>/dev/null", {
      cwd: siteRoot,
      encoding: "utf8",
    });
    const match = headEnv.match(/^VITE_XP_SECRET=(.+)$/m);
    return match?.[1]?.trim() ?? null;
  } catch {
    return null;
  }
}

test("LabCompletionClaim POSTs to /labs/complete without X-API-KEY or VITE_XP_SECRET", () => {
  const source = readClaimSource();

  assert.equal(source.includes("VITE_XP_SECRET"), false);
  assert.equal(source.includes("X-API-KEY"), false);
  assert.ok(source.includes("${BACKEND}/labs/complete"));
  assert.ok(source.includes('method: "POST"'));
  assert.ok(source.includes('"Content-Type": "application/json"'));

  const completeBlock = source.slice(source.indexOf("/labs/complete"));
  assert.ok(completeBlock.includes("wallet: effectiveWallet"));
  assert.ok(completeBlock.includes("owner: ownerForWrites"));
  assert.ok(completeBlock.includes("labId,"));
  assert.ok(completeBlock.includes("message,"));
  assert.ok(completeBlock.includes("signature,"));
});

test("repo source tree has no runtime VITE_XP_SECRET reference", () => {
  let hits = 0;
  try {
    hits = Number(
      execSync('git grep -l "VITE_XP_SECRET" -- . ":(exclude)dist" ":(exclude)node_modules" 2>/dev/null | wc -l', {
        cwd: siteRoot,
        encoding: "utf8",
      }).trim()
    );
  } catch {
    hits = 0;
  }
  assert.equal(hits, 0);
});

test("production build output contains no VITE_XP_SECRET, X-API-KEY, or leaked secret value", () => {
  const distRoot = join(siteRoot, "dist");
  const assets = globSync("**/*.{js,mjs,css,html}", { cwd: distRoot });
  assert.ok(assets.length > 0, "expected dist assets after npm run build");

  const leakedSecret = readLeakedSecretFromGitHeadEnv();
  for (const rel of assets) {
    const content = readFileSync(join(distRoot, rel), "utf8");
    assert.equal(content.includes("VITE_XP_SECRET"), false, `found in dist/${rel}`);
    assert.equal(content.includes("X-API-KEY"), false, `found in dist/${rel}`);
    if (leakedSecret) {
      assert.equal(content.includes(leakedSecret), false, `leaked secret found in dist/${rel}`);
    }
  }
});
