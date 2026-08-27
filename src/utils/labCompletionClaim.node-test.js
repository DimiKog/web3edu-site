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
const labWritePath = join(__dirname, "labWriteApi.js");

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

test("LabCompletionClaim POSTs lab complete via postLabsComplete without X-API-KEY or VITE_XP_SECRET", () => {
  const source = readClaimSource();
  const labWrite = readFileSync(labWritePath, "utf8");

  assert.equal(source.includes("VITE_XP_SECRET"), false);
  assert.equal(source.includes("X-API-KEY"), false);
  assert.equal(labWrite.includes("VITE_XP_SECRET"), false);
  assert.equal(labWrite.includes("X-API-KEY"), false);

  assert.ok(source.includes("postLabsComplete"));
  assert.ok(source.includes("idToken"));
  assert.ok(labWrite.includes("/labs/complete"));
  assert.ok(labWrite.includes("Authorization: `Bearer ${idToken.trim()}`"));

  assert.ok(source.includes("wallet: effectiveWallet"));
  assert.ok(source.includes("owner: ownerForWrites"));
  assert.ok(source.includes("labId,") || source.includes("labId"));
  assert.ok(source.includes("message,") || source.includes("message"));
  assert.ok(source.includes("signature,") || source.includes("signature"));
});

test("repo source tree has no runtime VITE_XP_SECRET reference", () => {
  let files = [];
  try {
    const out = execSync(
      [
        "git grep -l",
        '"VITE_XP_SECRET"',
        "-- .",
        '":(exclude)dist"',
        '":(exclude)node_modules"',
        '":(exclude)*.node-test.js"',
        '":(exclude)**/*.node-test.js"',
      ].join(" "),
      {
        cwd: siteRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    );
    files = out
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    files = [];
  }
  assert.deepEqual(files, []);
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
