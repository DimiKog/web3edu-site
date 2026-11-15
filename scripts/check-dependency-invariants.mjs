#!/usr/bin/env node
/**
 * Dependency resolution invariants for Web3Edu frontend.
 *
 * - Reject installed `ws` versions affected by known advisories (GHSA-96hv-2xvq-fx4p /
 *   GHSA-58qx-3vcg-4xpx family): ws 7.x < 7.5.11 and ws 8.x < 8.21.0.
 * - Require separate override policies for ws@7 and ws@8 (values may change; keys must exist).
 * - Require wagmi major 2 and RainbowKit major 2 with satisfied peer ranges.
 *
 * Does not pin ethers/viem to exact versions as permanent policy.
 */
import { createRequire } from "node:module";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`dependency-invariants: FAIL: ${message}`);
  process.exitCode = 1;
}

function parseVersion(version) {
  const m = String(version).trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function cmp(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

/** Known vulnerable ranges for current advisories. */
function isVulnerableWs(version) {
  const v = parseVersion(version);
  if (!v) return true;
  const [major] = v;
  if (major === 7) return cmp(v, [7, 5, 11]) < 0;
  if (major === 8) return cmp(v, [8, 21, 0]) < 0;
  // Prior advisory families on older majors.
  if (major === 5) return cmp(v, [5, 2, 5]) < 0;
  if (major === 6) return cmp(v, [6, 2, 4]) < 0;
  return false;
}

function readPkgIfWs(dir) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (pkg.name === "ws") return { path: dir, version: pkg.version };
  } catch {
    /* ignore */
  }
  return null;
}

/** Walk only package roots and nested node_modules (not package source trees). */
function collectWs(nodeModulesDir, out = []) {
  if (!existsSync(nodeModulesDir)) return out;
  let entries;
  try {
    entries = readdirSync(nodeModulesDir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const ent of entries) {
    if (!ent.isDirectory() || ent.name === ".bin" || ent.name === ".cache") continue;
    const full = join(nodeModulesDir, ent.name);

    if (ent.name === "ws") {
      const hit = readPkgIfWs(full);
      if (hit) out.push(hit);
      continue;
    }

    if (ent.name.startsWith("@")) {
      let scoped;
      try {
        scoped = readdirSync(full, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const child of scoped) {
        if (!child.isDirectory()) continue;
        const pkgDir = join(full, child.name);
        const nested = join(pkgDir, "node_modules");
        if (existsSync(nested)) collectWs(nested, out);
      }
      continue;
    }

    const nested = join(full, "node_modules");
    if (existsSync(nested)) collectWs(nested, out);
  }
  return out;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function majorOf(version) {
  const v = parseVersion(version);
  return v ? v[0] : null;
}

function satisfiesRainbowKitWagmiPeer(installed, peerRange) {
  if (peerRange === "2.x" || peerRange === "2") {
    return majorOf(installed) === 2;
  }
  const m = String(peerRange).match(/^\^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return majorOf(installed) === 2;
  const min = [Number(m[1]), Number(m[2]), Number(m[3])];
  const cur = parseVersion(installed);
  if (!cur) return false;
  if (cur[0] !== min[0]) return false;
  return cmp(cur, min) >= 0;
}

const pkg = readJson(join(root, "package.json"));
const overrides = pkg.overrides || {};

if (!Object.prototype.hasOwnProperty.call(overrides, "ws@7")) {
  fail('package.json overrides must include "ws@7" (separate 7.x policy)');
}
if (!Object.prototype.hasOwnProperty.call(overrides, "ws@8")) {
  fail('package.json overrides must include "ws@8" (separate 8.x policy)');
}

const nodeModules = join(root, "node_modules");
if (!existsSync(nodeModules)) {
  fail("node_modules missing; run npm ci first");
  process.exit(process.exitCode || 1);
}

const wsCopies = collectWs(nodeModules);
if (wsCopies.length === 0) {
  fail("no installed ws packages found under node_modules");
}

const byVersion = new Map();
for (const copy of wsCopies) {
  byVersion.set(copy.version, (byVersion.get(copy.version) || 0) + 1);
  if (isVulnerableWs(copy.version)) {
    fail(`vulnerable ws@${copy.version} installed at ${copy.path}`);
  }
}

let wagmi;
let rainbowkit;
try {
  wagmi = require(join(root, "node_modules/wagmi/package.json"));
  rainbowkit = require(join(root, "node_modules/@rainbow-me/rainbowkit/package.json"));
} catch (e) {
  fail(`unable to load wagmi/RainbowKit package.json: ${e.message}`);
  process.exit(process.exitCode || 1);
}

if (majorOf(wagmi.version) !== 2) {
  fail(`wagmi major must be 2 (installed ${wagmi.version})`);
}
if (majorOf(rainbowkit.version) !== 2) {
  fail(`@rainbow-me/rainbowkit major must be 2 (installed ${rainbowkit.version})`);
}

const rkPeers = rainbowkit.peerDependencies || {};
if (rkPeers.wagmi && !satisfiesRainbowKitWagmiPeer(wagmi.version, rkPeers.wagmi)) {
  fail(
    `RainbowKit peer wagmi ${rkPeers.wagmi} not satisfied by installed wagmi@${wagmi.version}`
  );
}

let viem;
try {
  viem = require(join(root, "node_modules/viem/package.json"));
} catch (e) {
  fail(`unable to load viem package.json: ${e.message}`);
}
if (viem && rkPeers.viem === "2.x" && majorOf(viem.version) !== 2) {
  fail(`RainbowKit peer viem 2.x not satisfied by installed viem@${viem.version}`);
}
if (viem && wagmi.peerDependencies?.viem === "2.x" && majorOf(viem.version) !== 2) {
  fail(`wagmi peer viem 2.x not satisfied by installed viem@${viem.version}`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("dependency-invariants: OK");
console.log(
  `  ws versions: ${[...byVersion.entries()]
    .map(([v, n]) => `${v}×${n}`)
    .sort()
    .join(", ")}`
);
console.log(`  wagmi@${wagmi.version} (major 2)`);
console.log(`  @rainbow-me/rainbowkit@${rainbowkit.version} (major 2)`);
console.log(
  `  overrides: ws@7=${JSON.stringify(overrides["ws@7"])}, ws@8=${JSON.stringify(overrides["ws@8"])}`
);
