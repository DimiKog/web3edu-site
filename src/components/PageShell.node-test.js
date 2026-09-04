/**
 * PageShell nav + Join return-to-origin contracts.
 * Run: node --test src/components/PageShell.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "PageShell.jsx"), "utf8");

test("PageShell imports saveReturnUrl from oidcConfig", () => {
  assert.match(src, /import\s+\{\s*saveReturnUrl\s*\}\s+from\s+"\.\.\/auth\/oidcConfig\.js"/);
});

test("PageShell adds Learn between Start Here and Labs (EN desktop + mobile)", () => {
  assert.match(
    src,
    /href="\/#\/start-here"[\s\S]*?href="\/#\/learning-modules\/lm01"[\s\S]*?href="\/#\/labs"/
  );
  assert.match(
    src,
    /navigateTo\("#\/start-here"\)[\s\S]*?navigateTo\("#\/learning-modules\/lm01"\)[\s\S]*?navigateTo\("#\/labs"\)/
  );
  assert.match(src, />\s*Learn\s*</);
});

test("PageShell adds Μάθηση between Start Here and Labs (GR desktop + mobile)", () => {
  assert.match(
    src,
    /href="\/#\/start-here-gr"[\s\S]*?href="\/#\/learning-modules-gr\/lm01"[\s\S]*?href="\/#\/labs-gr"/
  );
  assert.match(
    src,
    /navigateTo\("#\/start-here-gr"\)[\s\S]*?navigateTo\("#\/learning-modules-gr\/lm01"\)[\s\S]*?navigateTo\("#\/labs-gr"\)/
  );
  assert.match(src, />\s*Μάθηση\s*</);
});

test("PageShell Join CTA preserves return URL before navigating to Join", () => {
  assert.match(src, /const goToJoinForSignIn = \(\) => \{[\s\S]*?saveReturnUrl\(\);[\s\S]*?navigateTo\(isGR \? "#\/join-gr" : "#\/join"\)/);
  assert.match(src, /onClick=\{goToJoinForSignIn\}/);
  // Both desktop and mobile Join CTAs use the shared helper (two occurrences).
  assert.equal((src.match(/onClick=\{goToJoinForSignIn\}/g) || []).length, 2);
});

test("PageShell direct signinRedirect paths call saveReturnUrl first", () => {
  const redirects = src.match(/saveReturnUrl\(\);\s*\n\s*void auth\?\.signinRedirect/g) || [];
  assert.ok(
    redirects.length >= 3,
    `expected ≥3 saveReturnUrl+signinRedirect sites, got ${redirects.length}`
  );
});

test("PageShell does not invent a Learn overview route", () => {
  assert.doesNotMatch(src, /href="\/#\/learn"/);
  assert.doesNotMatch(src, /href="\/#\/learn-gr"/);
  assert.doesNotMatch(src, /navigateTo\("#\/learn"\)/);
  assert.doesNotMatch(src, /navigateTo\("#\/learn-gr"\)/);
});
