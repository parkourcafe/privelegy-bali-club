import assert from "node:assert/strict";
import test from "node:test";
import { buildCoverageReport } from "./coverage-model";

// Raw rows as the service query returns them (snake_case).
const rows = [
  { district: "canggu", category: "restaurant", status: "active", publication_status: "published" },
  { district: "canggu", category: "restaurant", status: "active", publication_status: "review" },
  { district: "canggu", category: "cafe", status: "active", publication_status: "published" },
  { district: "ubud", category: "restaurant", status: "active", publication_status: "published" },
  { district: "ubud", category: "restaurant", status: "active", publication_status: "published" },
  { district: "ubud", category: "restaurant", status: "active", publication_status: "published" },
  { district: "ubud", category: "restaurant", status: "archived", publication_status: "published" }, // excluded
  { district: "atlantis", category: "restaurant", status: "active", publication_status: "published" }, // unknown district
];

test("counts per district × category, splitting published vs review", () => {
  const r = buildCoverageReport(rows);
  const canggu = r.rows.find((x) => x.slug === "canggu")!;
  assert.deepEqual(canggu.cells.restaurant, { published: 1, review: 1, total: 2 });
  assert.deepEqual(canggu.cells.cafe, { published: 1, review: 0, total: 1 });
  assert.equal(canggu.total.total, 3);

  const ubud = r.rows.find((x) => x.slug === "ubud")!;
  assert.equal(ubud.cells.restaurant.total, 3);
  assert.equal(ubud.cells.cafe.total, 0); // a gap
});

test("archived rows are excluded from coverage", () => {
  const r = buildCoverageReport(rows);
  // 7 active rows (the one archived ubud restaurant is dropped).
  assert.equal(r.grand.total, 7);
  assert.equal(r.grand.published, 6);
  assert.equal(r.grand.review, 1);
  assert.equal(r.categoryTotals.restaurant.total, 2 + 3 + 1); // canggu + ubud + atlantis
});

test("districts not in the registry are flagged, not silently counted into a real one", () => {
  const r = buildCoverageReport(rows);
  assert.deepEqual(r.unknownDistricts, ["atlantis"]);
  // atlantis still appears as its own row so its venue isn't lost.
  assert.ok(r.rows.some((x) => x.slug === "atlantis"));
});

test("catalogued districts with zero venues surface as emptyDistricts", () => {
  const r = buildCoverageReport(rows);
  assert.ok(r.emptyDistricts.some((d) => d.slug === "sidemen"));
  assert.ok(!r.rows.some((x) => x.slug === "sidemen")); // never a table row
});

test("empty input yields an all-zero report, not a crash", () => {
  const r = buildCoverageReport([]);
  assert.equal(r.grand.total, 0);
  assert.equal(r.rows.length, 0);
  assert.ok(r.emptyDistricts.length > 0);
});
