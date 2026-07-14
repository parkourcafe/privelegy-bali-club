import assert from "node:assert/strict";
import test from "node:test";

import { buildPlacesFilterPath, readPlacesFilterState } from "./places-filter-url";

test("places filters round-trip through a shareable URL", () => {
  const path = buildPlacesFilterPath({
    pathname: "/places",
    search: "?intent=1&m=food&dur=week&utm_source=home",
    hash: "#results",
    filters: { query: "quiet cafe", district: "uluwatu-bukit", category: "cafe" },
  });
  assert.equal(
    path,
    "/places?intent=1&m=food&dur=week&utm_source=home&q=quiet+cafe&district=uluwatu&category=cafe#results",
  );
  assert.deepEqual(readPlacesFilterState(new URL(path, "https://www.otherbali.com").search), {
    query: "quiet cafe",
    district: "uluwatu-bukit",
    category: "cafe",
    intentMode: true,
  });
});

test("clear all removes every effective filter and original brief marker", () => {
  assert.equal(buildPlacesFilterPath({
    pathname: "/places",
    search: "?intent=1&m=food&dur=week&q=quiet&district=canggu&category=cafe",
    filters: { query: "", district: null, category: null },
    clearBrief: true,
  }), "/places");
});

test("filter URL state is bounded and uses the public Uluwatu slug", () => {
  assert.equal(readPlacesFilterState(`?q=${"a".repeat(500)}`).query.length, 240);
  assert.equal(buildPlacesFilterPath({
    pathname: "/places",
    search: "",
    filters: { query: "", district: "uluwatu-bukit", category: null },
  }), "/places?district=uluwatu");
});
