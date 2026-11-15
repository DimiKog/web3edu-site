#!/usr/bin/env node
/**
 * Targeted production npm audit gate.
 *
 * - Always writes the full `npm audit --omit=dev` JSON report for review.
 * - Fails only if `ws` or `ethers` appear in the vulnerability map (regressions of
 *   the dependency-hardening fixes).
 * - Does not fail solely because of other known connector-tree findings.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "security-reports");
const outFile = join(outDir, "npm-audit-prod.json");

const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
  shell: process.platform === "win32",
});

const stdout = result.stdout || "";
const stderr = result.stderr || "";

let report;
try {
  report = JSON.parse(stdout);
} catch (e) {
  console.error("check-prod-audit: FAIL: unable to parse npm audit JSON");
  if (stderr) console.error(stderr);
  if (stdout) console.error(stdout.slice(0, 2000));
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`check-prod-audit: wrote ${outFile}`);

const vulns = report.vulnerabilities || {};
const meta = report.metadata?.vulnerabilities || {};
console.log(
  `check-prod-audit: summary total=${meta.total ?? "?"} critical=${meta.critical ?? 0} high=${meta.high ?? 0} moderate=${meta.moderate ?? 0} low=${meta.low ?? 0}`
);

const watched = ["ws", "ethers"];
const regressions = watched.filter((name) => Object.prototype.hasOwnProperty.call(vulns, name));

if (regressions.length > 0) {
  for (const name of regressions) {
    const entry = vulns[name];
    console.error(
      `check-prod-audit: FAIL: ${name} is flagged again (severity=${entry.severity}, range=${entry.range})`
    );
    if (Array.isArray(entry.nodes)) {
      for (const node of entry.nodes.slice(0, 12)) {
        console.error(`  node: ${node}`);
      }
    }
  }
  process.exit(1);
}

console.log("check-prod-audit: OK (ws and ethers not flagged; other findings are informational)");
if (!existsSync(outFile)) {
  process.exit(1);
}
