/**
 * AdminLayout responsive navigation structure.
 * Run: node --test src/pages/admin/AdminLayout.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const layoutSrc = readFileSync(join(__dirname, "AdminLayout.jsx"), "utf8");

test("desktop admin sidebar is hidden below md and visible at md+", () => {
  assert.match(layoutSrc, /aside className="[^"]*hidden[^"]*md:block/);
  assert.match(layoutSrc, /w-64 shrink-0/);
  assert.match(layoutSrc, /sticky top-24/);
});

test("mobile admin navigation exists below md", () => {
  assert.match(layoutSrc, /className="md:hidden"/);
  assert.match(layoutSrc, /aria-expanded=\{mobileNavOpen\}/);
  assert.match(layoutSrc, /aria-controls="admin-mobile-nav"/);
  assert.match(layoutSrc, /aria-label=\{mobileNavOpen \? "Close admin navigation" : "Open admin navigation"\}/);
  assert.match(layoutSrc, /id="admin-mobile-nav"/);
});

test("admin layout shell stacks on mobile and is row at md+", () => {
  assert.match(layoutSrc, /flex-col[^"]*md:flex-row/);
  assert.match(layoutSrc, /main className="min-w-0 w-full flex-1"/);
});

test("admin navigation destinations remain Dashboard Labs Users Feedback", () => {
  assert.match(layoutSrc, /to: "\/admin"/);
  assert.match(layoutSrc, /to: "\/admin\/labs"/);
  assert.match(layoutSrc, /to: "\/admin\/users"/);
  assert.match(layoutSrc, /to: "\/admin\/feedback"/);
  assert.match(layoutSrc, /label: "Dashboard"/);
  assert.match(layoutSrc, /label: "Labs"/);
  assert.match(layoutSrc, /label: "Users"/);
  assert.match(layoutSrc, /label: "Feedback"/);
});
