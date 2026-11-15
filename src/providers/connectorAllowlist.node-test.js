/**
 * Connector allowlist regression tests.
 *
 * Ensures Web3Edu application code activates only the injected wagmi connector and
 * does not import WalletConnect / MetaMask SDK / Coinbase connector runtimes.
 *
 * Uses comment-stripped import parsing (not formatting-dependent connector-array regex).
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, "..");
const providersFile = join(__dirname, "Web3Providers.jsx");

const APPROVED_CONNECTOR_SYMBOLS = new Set(["injected"]);

const FORBIDDEN_MODULE_PREFIXES = [
  "@walletconnect/",
  "@reown/",
  "@metamask/sdk",
  "@coinbase/wallet-sdk",
  "@coinbase/cdp-sdk",
  "@base-org/account",
];

const FORBIDDEN_WAGMI_CONNECTOR_SYMBOLS = new Set([
  "walletConnect",
  "metaMask",
  "coinbaseWallet",
  "safe",
  "porto",
  "gemini",
  "mock",
]);

function stripComments(source) {
  // Block comments then line comments — adequate for import scanning of our JS/JSX sources.
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/**
 * Parse ESM import declarations into { source, names }.
 * names: default/namespace ignored for allowlist; named bindings collected.
 */
function parseImports(source) {
  const text = stripComments(source);
  const imports = [];
  const re =
    /\bimport\s+(?:type\s+)?(?:([\s\S]*?)\s+from\s+)?["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(text))) {
    const clause = (m[1] || "").trim();
    const sourcePath = m[2];
    const names = new Set();
    if (clause) {
      const named = clause.match(/\{([^}]*)\}/);
      if (named) {
        for (const part of named[1].split(",")) {
          const token = part.trim();
          if (!token) continue;
          const [imported] = token.split(/\s+as\s+/);
          const name = imported.trim();
          if (name) names.add(name);
        }
      }
    }
    imports.push({ source: sourcePath, names });
  }
  return imports;
}

function listSourceFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      listSourceFiles(full, out);
      continue;
    }
    if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(name) && !name.endsWith(".node-test.js")) {
      out.push(full);
    }
  }
  return out;
}

function moduleIsForbidden(source) {
  return FORBIDDEN_MODULE_PREFIXES.some(
    (prefix) => source === prefix.replace(/\/$/, "") || source.startsWith(prefix)
  );
}

test("Web3Providers imports only injected from wagmi/connectors", () => {
  const source = readFileSync(providersFile, "utf8");
  const imports = parseImports(source);
  const connectorImports = imports.filter((i) => i.source === "wagmi/connectors");
  assert.equal(connectorImports.length, 1, "expected exactly one wagmi/connectors import");
  const names = [...connectorImports[0].names];
  assert.deepEqual(names.sort(), ["injected"]);
  assert.ok(
    imports.some((i) => i.source === "wagmi" && i.names.has("createConfig")),
    "expected createConfig from wagmi"
  );
});

test("Web3Providers does not import forbidden wallet connector SDKs", () => {
  const source = readFileSync(providersFile, "utf8");
  const imports = parseImports(source);
  for (const imp of imports) {
    assert.equal(
      moduleIsForbidden(imp.source),
      false,
      `forbidden module imported in Web3Providers: ${imp.source}`
    );
  }
});

test("src application code does not activate non-injected wagmi connectors or WC/MM/Coinbase SDKs", () => {
  const files = listSourceFiles(srcRoot);
  assert.ok(files.length > 10, "expected to scan application sources");

  const violations = [];

  for (const file of files) {
    const rel = relative(srcRoot, file);
    const source = readFileSync(file, "utf8");
    const imports = parseImports(source);

    for (const imp of imports) {
      if (moduleIsForbidden(imp.source)) {
        violations.push(`${rel}: import ${imp.source}`);
      }
      if (imp.source === "wagmi/connectors") {
        for (const name of imp.names) {
          if (!APPROVED_CONNECTOR_SYMBOLS.has(name)) {
            violations.push(`${rel}: wagmi/connectors symbol ${name}`);
          }
          if (FORBIDDEN_WAGMI_CONNECTOR_SYMBOLS.has(name)) {
            violations.push(`${rel}: forbidden connector ${name}`);
          }
        }
      }
      // Dynamic-style package imports of connectors entrypoints.
      if (
        /^@wagmi\/connectors/.test(imp.source) &&
        imp.source !== "wagmi/connectors"
      ) {
        violations.push(`${rel}: import ${imp.source}`);
      }
    }
  }

  assert.deepEqual(violations, [], violations.join("\n"));
});

test("useInjectedWalletConnect selects from configured connectors (no alternate connector imports)", () => {
  const hookPath = join(srcRoot, "hooks/useInjectedWalletConnect.js");
  const source = readFileSync(hookPath, "utf8");
  const imports = parseImports(source);
  assert.equal(
    imports.some((i) => i.source === "wagmi/connectors"),
    false,
    "hook should use config.connectors, not import connector factories"
  );
  for (const imp of imports) {
    assert.equal(moduleIsForbidden(imp.source), false, imp.source);
  }
  assert.match(source, /wagmiConfig\.connectors/);
});
