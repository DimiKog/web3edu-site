/**
 * Admin Labs / Lab Detail / Feedback responsive table structure.
 * Run: node --test src/pages/admin/AdminTablesResponsive.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, "../..");
const labsTableSrc = readFileSync(join(srcRoot, "components/admin/AdminLabsTable.jsx"), "utf8");
const labDetailsSrc = readFileSync(join(__dirname, "AdminLabDetails.jsx"), "utf8");
const feedbackSrc = readFileSync(join(__dirname, "AdminFeedbackPage.jsx"), "utf8");

test("labs table hides Category/Avg/Median below md and keeps drop-off usable", () => {
  assert.match(labsTableSrc, /hidden[^"]*md:table-cell[\s\S]*Category/);
  assert.match(labsTableSrc, /hidden[^"]*md:table-cell[\s\S]*Avg Time/);
  assert.match(labsTableSrc, /hidden[^"]*md:table-cell[\s\S]*Median Time/);
  assert.match(labsTableSrc, /md:min-w-\[220px\]/);
  assert.match(labsTableSrc, /overflow-x-auto/);
  assert.match(labsTableSrc, />Started</);
  assert.match(labsTableSrc, />Completed</);
  assert.match(labsTableSrc, />Completion</);
});

test("lab details hides timestamp columns below md and stacks header", () => {
  assert.match(labDetailsSrc, /flex-col gap-3 sm:flex-row/);
  assert.match(labDetailsSrc, /hidden[^"]*md:table-cell[\s\S]*Started At/);
  assert.match(labDetailsSrc, /hidden[^"]*md:table-cell[\s\S]*Completed At/);
  assert.match(labDetailsSrc, />Progress address</);
  assert.match(labDetailsSrc, /overflow-x-auto/);
});

test("feedback tables hide secondary columns below md without forcing mobile min-width", () => {
  assert.match(feedbackSrc, /md:min-w-\[980px\]/);
  assert.match(feedbackSrc, /md:min-w-\[1200px\]/);
  assert.match(feedbackSrc, /md:table-fixed/);
  assert.doesNotMatch(feedbackSrc, /className="min-w-\[980px]/);
  assert.doesNotMatch(feedbackSrc, /className="min-w-\[1200px]/);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*Avg difficulty/);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Soft</);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Type</);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Duration</);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Difficulty</);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Clarity</);
  assert.match(feedbackSrc, /hidden[^"]*md:table-cell[\s\S]*>Recommend</);
  assert.match(feedbackSrc, />Issues</);
  assert.match(feedbackSrc, />Review</);
});
