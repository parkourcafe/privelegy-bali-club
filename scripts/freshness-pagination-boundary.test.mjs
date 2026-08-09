// The freshness admin queue must read through readAllPages.
//
// PostgREST caps any single response at 1000 rows. venue_action_capabilities
// crossed that ceiling at 1192 rows and venues at 1440 (2026-08-09), so the
// queue's former unpaginated Promise.all silently hid the tail from the
// operator — four days after the identical bug was fixed in the public
// catalogue. A truncated response is indistinguishable from a complete one,
// which is why this is enforced at the source level rather than left to
// manual counting.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const src = readFileSync(
  join(process.cwd(), "app/admin/(protected)/freshness/data.ts"),
  "utf8"
);

test("every freshness read goes through readAllPages with a bounded range", () => {
  assert.match(src, /import \{ readAllPages, type PageResult \} from "@\/lib\/read-all-pages";/);
  for (const label of [
    "admin-freshness-menus",
    "admin-freshness-sections",
    "admin-freshness-items",
    "admin-freshness-actions",
    "admin-freshness-venues",
  ]) {
    assert.match(
      src,
      new RegExp(`readAllPages<Row>\\("${label}"`),
      `${label} read is not paginated`
    );
  }
  assert.equal((src.match(/readAllPages</g) ?? []).length, 5);
  assert.match(src, /\.range\(from, to\)/);
});

test("the two tables past the 1000-row ceiling are the paginated ones", () => {
  assert.match(src, /"admin-freshness-actions", \(from, to\) =>[\s\S]{0,200}venue_action_capabilities/);
  assert.match(src, /"admin-freshness-venues", \(from, to\) =>[\s\S]{0,200}from\("venues"\)/);
});

test("range pagination keeps a deterministic total order on every read", () => {
  // Pages of a non-unique sort can skip or duplicate rows between requests;
  // each order chain must end in a unique column (id, or venues' slug).
  const chains = src.match(/client[\s\S]*?\.range\(from, to\)/g) ?? [];
  assert.equal(chains.length, 5);
  for (const chain of chains) {
    assert.match(
      chain,
      /\.order\("(id|slug)"\)(?:[^.]|\.range)/,
      `no unique tiebreaker in: ${chain.slice(0, 90)}…`
    );
  }
});
