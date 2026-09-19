/**
 * LM05 Educational Ledger view helpers + activity contracts.
 * Run: node --test src/utils/lm05EducationalLedgerView.node-test.js
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  getLm05EducationalLedgerCopy,
  participantLabel,
} from "../content/lm05EducationalLedgerLocale.js";
import {
  PENDING_POOL_PAGE_SIZE,
  clampPoolVisibleCount,
  derivedFromParticipantId,
  nextPoolVisibleCount,
  pendingAssetIds,
  publicTransactionView,
  selectableAssets,
  selectableDestinations,
  sliceVisiblePendingTransactions,
  sortPendingTransactionsNewestFirst,
  stripSubmitterIdentity,
} from "./lm05EducationalLedgerView.js";
import {
  EVIDENCE_ROUTES,
  UNAVAILABLE_EVIDENCE_IDS,
  resolveProgressionActionTarget,
} from "./progressionActionMapper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const panelSrc = readFileSync(
  join(__dirname, "../components/learning-modules/Lm05EducationalLedgerPanel.jsx"),
  "utf8"
);
const pageSrc = readFileSync(
  join(__dirname, "../pages/learning-modules/Lm05EducationalLedgerPage.jsx"),
  "utf8"
);
const apiSrc = readFileSync(join(__dirname, "labWriteApi.js"), "utf8");

const assets = [
  { id: "TC-001", label: "Olive Oil Batch", ownerParticipantId: "producer" },
  { id: "TC-002", label: "Coffee Batch", ownerParticipantId: "producer" },
  { id: "TC-003", label: "Medicine Batch", ownerParticipantId: "manufacturer" },
];
const participants = [
  { id: "producer", label: "Producer" },
  { id: "manufacturer", label: "Manufacturer" },
  { id: "distributor", label: "Distributor" },
  { id: "retailer", label: "Retailer" },
];

test("PEL item routes are ready EN/GR", () => {
  assert.equal(UNAVAILABLE_EVIDENCE_IDS.has("lm05-pel-transaction"), false);
  assert.equal(
    EVIDENCE_ROUTES.en["lm05-pel-transaction"],
    "/learning-modules/lm05/educational-ledger"
  );
  assert.equal(
    EVIDENCE_ROUTES.gr["lm05-pel-transaction"],
    "/learning-modules-gr/lm05/educational-ledger"
  );
  const action = resolveProgressionActionTarget({
    nextAction: {
      type: "learning_module_evidence",
      evidenceId: "lm05-pel-transaction",
    },
    lang: "en",
  });
  assert.equal(action.status, "ready");
  assert.equal(action.route, "/learning-modules/lm05/educational-ledger");
});

test("selected asset derives FROM; TO excludes current owner", () => {
  assert.equal(derivedFromParticipantId("TC-001", assets), "producer");
  const destinations = selectableDestinations(participants, "producer");
  assert.deepEqual(
    destinations.map((p) => p.id),
    ["manufacturer", "distributor", "retailer"]
  );
});

test("pending asset cannot be selected for another transfer", () => {
  const pending = [
    {
      id: "pel-tx-1",
      assetId: "TC-001",
      status: "PENDING",
      fromParticipantId: "producer",
      toParticipantId: "distributor",
    },
  ];
  assert.deepEqual([...pendingAssetIds(pending)], ["TC-001"]);
  const selectable = selectableAssets(assets, pending);
  assert.deepEqual(
    selectable.map((a) => a.id),
    ["TC-002", "TC-003"]
  );
});

test("public transaction view and stripSubmitterIdentity omit submitter fields", () => {
  const raw = {
    id: "pel-tx-1",
    type: "TRANSFER",
    assetId: "TC-001",
    fromParticipantId: "producer",
    toParticipantId: "distributor",
    status: "PENDING",
    createdAt: "2026-09-19T10:00:00Z",
    submittedByProgressAddress: "0xabc",
  };
  const view = publicTransactionView(raw);
  assert.equal(view.status, "PENDING");
  assert.equal(view.id, "pel-tx-1");
  assert.equal("submittedByProgressAddress" in view, false);

  const stripped = stripSubmitterIdentity({
    pendingTransactions: [raw],
    nested: { submittedByProgressAddress: "0xabc", ok: true },
  });
  assert.equal("submittedByProgressAddress" in stripped.pendingTransactions[0], false);
  assert.equal("submittedByProgressAddress" in stripped.nested, false);
  assert.equal(stripped.nested.ok, true);
});

test("EN/GR copy includes success PENDING explanation and bridge question", () => {
  const en = getLm05EducationalLedgerCopy("en");
  const gr = getLm05EducationalLedgerCopy("gr");
  assert.match(en.successOwnershipNote, /has not changed owner/i);
  assert.match(en.successPendingNote, /Pending does not mean included/i);
  assert.match(en.bridgeQuestion, /part of the blockchain/i);
  assert.match(gr.successOwnershipNote, /δεν έχει αλλάξει κάτοχο/i);
  assert.match(gr.successPendingNote, /Pending δεν σημαίνει/i);
  assert.match(gr.bridgeQuestion, /μέρος του blockchain/i);
  assert.equal(participantLabel("producer", "en"), "Producer");
  assert.equal(participantLabel("producer", "gr"), "Παραγωγός");
  assert.match(en.poolVisualCaption, /shared transaction pool/i);
  assert.match(en.poolVisualCaption, /PENDING/i);
  assert.match(gr.poolVisualCaption, /δεξαμενή συναλλαγών/i);
  assert.match(gr.poolVisualCaption, /PENDING/i);
  assert.ok(en.poolVisualAlt.length > 20);
  assert.ok(gr.poolVisualAlt.length > 20);
  assert.equal(en.poolStatusPill, "PENDING");
  assert.equal(gr.poolStatusPill, "PENDING");
  assert.equal(en.poolShowMore, "Show more");
  assert.equal(gr.poolShowMore, "Εμφάνιση περισσότερων");
});

test("panel uses Bearer APIs only and does not fake evidence writes", () => {
  assert.match(panelSrc, /fetchLm05EducationalLedger/);
  assert.match(panelSrc, /postLm05EducationalLedgerTransfer/);
  assert.match(panelSrc, /fetchLearningModulesProgression/);
  assert.match(panelSrc, /conflictError/);
  assert.match(panelSrc, /status === 409/);
  assert.match(panelSrc, /stripSubmitterIdentity/);
  assert.match(panelSrc, /publicTransactionView/);
  assert.match(
    panelSrc,
    /lm05-pending-transaction-pool\.png/
  );
  assert.match(panelSrc, /LmApprovedVisual/);
  assert.match(panelSrc, /poolShowMore/);
  assert.match(panelSrc, /sortPendingTransactionsNewestFirst/);
  assert.match(panelSrc, /PENDING_POOL_PAGE_SIZE/);
  assert.match(panelSrc, /nextPoolVisibleCount/);
  assert.match(panelSrc, /\{copy\.poolTitle\} \(\{poolTotalCount\}\)/);
  // Conceptual bridge sits outside the live cyan pool system panel.
  const visualIdx = panelSrc.indexOf("lm05-pending-transaction-pool.png");
  const poolTitleIdx = panelSrc.indexOf("{copy.poolTitle}");
  assert.ok(visualIdx > 0 && poolTitleIdx > visualIdx);
  assert.doesNotMatch(panelSrc, /submittedByProgressAddress/);
  assert.doesNotMatch(panelSrc, /xpAwarded\s*[:=]/);
  assert.doesNotMatch(panelSrc, /module_evidence/);
  assert.doesNotMatch(panelSrc, /"pel completed"/i);
  assert.match(apiSrc, /educational-ledger\/transactions/);
  assert.match(apiSrc, /assetId,\s*\n\s*toParticipantId/);
  assert.match(pageSrc, /Lm05EducationalLedgerPanel/);
  assert.match(pageSrc, /getLm05EducationalLedgerCopy/);
});

test("pool visual asset exists in public/", () => {
  const visualPath = join(
    __dirname,
    "../../public/learning-modules/visuals/lm05/lm05-pending-transaction-pool.png"
  );
  const bytes = readFileSync(visualPath);
  assert.ok(bytes.length > 1000);
  assert.equal(bytes[0], 0x89);
  assert.equal(bytes[1], 0x50); // P
  assert.equal(bytes[2], 0x4e); // N
  assert.equal(bytes[3], 0x47); // G
});

function makePending(id, createdAt) {
  return {
    id,
    type: "TRANSFER",
    assetId: "TC-001",
    fromParticipantId: "producer",
    toParticipantId: "distributor",
    status: "PENDING",
    createdAt,
  };
}

test("pending pool progressive disclosure: empty and small pools", () => {
  assert.equal(PENDING_POOL_PAGE_SIZE, 5);

  const empty = sortPendingTransactionsNewestFirst([]);
  assert.deepEqual(empty, []);
  assert.equal(clampPoolVisibleCount(5, 0), 0);
  assert.deepEqual(sliceVisiblePendingTransactions(empty, 5), []);

  const three = [
    makePending("a", "2026-09-19T10:00:00Z"),
    makePending("b", "2026-09-19T12:00:00Z"),
    makePending("c", "2026-09-19T11:00:00Z"),
  ];
  const sortedThree = sortPendingTransactionsNewestFirst(three);
  assert.deepEqual(
    sortedThree.map((tx) => tx.id),
    ["b", "c", "a"]
  );
  assert.notEqual(sortedThree, three);
  assert.deepEqual(
    three.map((tx) => tx.id),
    ["a", "b", "c"]
  );

  const visibleThree = clampPoolVisibleCount(PENDING_POOL_PAGE_SIZE, 3);
  assert.equal(visibleThree, 3);
  assert.equal(
    sliceVisiblePendingTransactions(sortedThree, visibleThree).length,
    3
  );
  assert.equal(nextPoolVisibleCount(3, 3), 3);
});

test("pending pool progressive disclosure: exactly 5 and more than 5", () => {
  const five = Array.from({ length: 5 }, (_, i) =>
    makePending(`tx-${i}`, `2026-09-19T1${i}:00:00Z`)
  );
  const sortedFive = sortPendingTransactionsNewestFirst(five);
  assert.equal(sortedFive[0].id, "tx-4");
  const visibleFive = clampPoolVisibleCount(0, 5);
  assert.equal(visibleFive, 5);
  assert.equal(sliceVisiblePendingTransactions(sortedFive, visibleFive).length, 5);
  assert.equal(nextPoolVisibleCount(5, 5), 5);

  const twelve = Array.from({ length: 12 }, (_, i) =>
    makePending(`n-${i}`, `2026-09-19T${String(i).padStart(2, "0")}:00:00Z`)
  );
  const sortedTwelve = sortPendingTransactionsNewestFirst(twelve);
  assert.equal(sortedTwelve[0].id, "n-11");
  assert.equal(sortedTwelve[11].id, "n-0");

  let visible = clampPoolVisibleCount(0, 12);
  assert.equal(visible, 5);
  assert.equal(sliceVisiblePendingTransactions(sortedTwelve, visible).length, 5);
  assert.deepEqual(
    sliceVisiblePendingTransactions(sortedTwelve, visible).map((tx) => tx.id),
    ["n-11", "n-10", "n-9", "n-8", "n-7"]
  );

  visible = nextPoolVisibleCount(visible, 12);
  assert.equal(visible, 10);
  assert.equal(sliceVisiblePendingTransactions(sortedTwelve, visible).length, 10);

  visible = nextPoolVisibleCount(visible, 12);
  assert.equal(visible, 12);
  assert.equal(sliceVisiblePendingTransactions(sortedTwelve, visible).length, 12);
  assert.equal(nextPoolVisibleCount(12, 12), 12);

  assert.equal(clampPoolVisibleCount(10, 3), 3);
  assert.equal(clampPoolVisibleCount(10, 12), 10);
});
