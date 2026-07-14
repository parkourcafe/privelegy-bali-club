import assert from "node:assert/strict";
import test from "node:test";

import {
  buildReportIncorrectMailto,
  REPORT_INCORRECT_REASONS,
} from "./report-incorrect";

test("report flow exposes exactly the six editorial correction reasons", () => {
  assert.deepEqual(REPORT_INCORRECT_REASONS.map(({ value }) => value), [
    "place_closed",
    "wrong_hours",
    "wrong_address",
    "wrong_price",
    "photo_issue",
    "other",
  ]);
});

test("report mail contains only a bounded venue identity and selected reason", () => {
  const href = buildReportIncorrectMailto({
    venueSlug: "sample-place",
    venueName: "  Sample   Place  ",
    reason: "wrong_hours",
  });
  assert.ok(href);
  const url = new URL(href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "support@otherbali.com");
  assert.equal(url.searchParams.get("subject"), "Other Bali correction: Sample Place");
  assert.match(url.searchParams.get("body") ?? "", /Issue: Wrong hours/);
  assert.match(url.searchParams.get("body") ?? "", /https:\/\/www\.otherbali\.com\/places\/sample-place/);
  assert.doesNotMatch(url.searchParams.get("body") ?? "", /guest|cookie|identifier/i);
});

test("report mail fails closed for an invalid public slug or empty venue name", () => {
  assert.equal(buildReportIncorrectMailto({
    venueSlug: "../admin",
    venueName: "Sample Place",
    reason: "other",
  }), null);
  assert.equal(buildReportIncorrectMailto({
    venueSlug: "sample-place",
    venueName: "   ",
    reason: "other",
  }), null);
});
