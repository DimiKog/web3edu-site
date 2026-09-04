/**
 * OIDC return-URL helper (post-login restore).
 * Run: node --test src/auth/oidcConfig.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  OIDC_RETURN_URL_SESSION_KEY,
  saveReturnUrl,
} from "./oidcConfig.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "../..");

function withMockWindow({ hash = "#/", store = {} } = {}, fn) {
  const previousWindow = globalThis.window;
  const previousSessionStorage = globalThis.sessionStorage;
  const sessionStore = { ...store };
  const sessionStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(sessionStore, key)
        ? sessionStore[key]
        : null;
    },
    setItem(key, value) {
      sessionStore[key] = String(value);
    },
    removeItem(key) {
      delete sessionStore[key];
    },
  };
  globalThis.window = {
    location: { hash },
    sessionStorage,
  };
  globalThis.sessionStorage = sessionStorage;
  try {
    return fn(sessionStore);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousSessionStorage === undefined) delete globalThis.sessionStorage;
    else globalThis.sessionStorage = previousSessionStorage;
  }
}

test("saveReturnUrl stores EN LM01 hash route", () => {
  withMockWindow({ hash: "#/learning-modules/lm01" }, (store) => {
    saveReturnUrl();
    assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], "/learning-modules/lm01");
  });
});

test("saveReturnUrl stores GR LM01 hash route", () => {
  withMockWindow({ hash: "#/learning-modules-gr/lm01" }, (store) => {
    saveReturnUrl();
    assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], "/learning-modules-gr/lm01");
  });
});

test("saveReturnUrl stores a generic non-join route (labs)", () => {
  withMockWindow({ hash: "#/labs/lab02" }, (store) => {
    saveReturnUrl();
    assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], "/labs/lab02");
  });
});

test("saveReturnUrl skips join and root", () => {
  for (const hash of ["#/join", "#/join-gr", "#/"]) {
    withMockWindow({ hash }, (store) => {
      saveReturnUrl();
      assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], undefined);
    });
  }
});

test("saveReturnUrl skip does not clear a previously saved return URL", () => {
  withMockWindow(
    {
      hash: "#/join",
      store: { [OIDC_RETURN_URL_SESSION_KEY]: "/learning-modules/lm01" },
    },
    (store) => {
      saveReturnUrl();
      assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], "/learning-modules/lm01");
    }
  );
});

test("saveReturnUrl accepts explicit pathname override", () => {
  withMockWindow({ hash: "#/join" }, (store) => {
    saveReturnUrl("/projects/demo");
    assert.equal(store[OIDC_RETURN_URL_SESSION_KEY], "/projects/demo");
  });
});

test("OidcPostLoginNavigate falls back to Dashboard when return URL absent", () => {
  const src = readFileSync(
    join(siteRoot, "src/components/OidcPostLoginNavigate.jsx"),
    "utf8"
  );
  assert.match(src, /returnUrl \|\| \(isGr \? "\/dashboard-gr" : "\/dashboard"\)/);
  assert.match(src, /OIDC_RETURN_URL_SESSION_KEY/);
});

test("createOidcConfig does not override userStore (sessionStorage default)", () => {
  const src = readFileSync(join(siteRoot, "src/auth/oidcConfig.js"), "utf8");
  assert.doesNotMatch(src, /userStore/);
  assert.doesNotMatch(src, /localStorage/);
});
