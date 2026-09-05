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

test("PageShell Learn targets curriculum landing (EN desktop + mobile)", () => {
  assert.match(
    src,
    /href="\/#\/start-here"[\s\S]*?href="\/#\/learn"[\s\S]*?href="\/#\/labs"/
  );
  assert.match(
    src,
    /navigateTo\("#\/start-here"\)[\s\S]*?navigateTo\("#\/learn"\)[\s\S]*?navigateTo\("#\/labs"\)/
  );
  assert.match(src, />\s*Learn\s*</);
  assert.doesNotMatch(src, /href="\/#\/learning-modules\/lm01"/);
  assert.doesNotMatch(src, /navigateTo\("#\/learning-modules\/lm01"\)/);
});

test("PageShell Μάθηση targets curriculum landing (GR desktop + mobile)", () => {
  assert.match(
    src,
    /href="\/#\/start-here-gr"[\s\S]*?href="\/#\/learn-gr"[\s\S]*?href="\/#\/labs-gr"/
  );
  assert.match(
    src,
    /navigateTo\("#\/start-here-gr"\)[\s\S]*?navigateTo\("#\/learn-gr"\)[\s\S]*?navigateTo\("#\/labs-gr"\)/
  );
  assert.match(src, />\s*Μάθηση\s*</);
  assert.doesNotMatch(src, /href="\/#\/learning-modules-gr\/lm01"/);
  assert.doesNotMatch(src, /navigateTo\("#\/learning-modules-gr\/lm01"\)/);
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
